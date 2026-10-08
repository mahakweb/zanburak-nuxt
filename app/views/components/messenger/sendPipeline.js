/**

 * Telegram-style send readiness + status helpers.

 *

 * Tick order (never reverse):

 *   clock (only if slow) → single check (wire/server) → delivered → read

 *

 * Fast path: whisper upgrades pending → wire-sent within ~CLOCK_REVEAL_MS so

 * the UI never paints the clock. Offline stays on clock + outbox queue.

 *

 * Pre-send checks (Connection Manager):

 *   browser internet · websocket · authentication · server availability

 */



import { connectionManager } from '@/services/connectionManager';

import { getPusher } from '@/lib/echo';

import { isServerId } from '@/views/components/messenger/outbox';



/** Canonical outbound message states. */

export const SEND_STATUS = Object.freeze({

  QUEUED: 'queued',

  SENDING: 'sending',

  SENT: 'sent',

  DELIVERED: 'delivered',

  READ: 'read',

  FAILED: 'failed',

});



/** Inline HTTP attempts per call (unstable mobile networks). */

export const INLINE_SEND_ATTEMPTS = 3;



/** Auto outbox retries before marking permanently failed. */

export const MAX_OUTBOX_ATTEMPTS = 12;



/**

 * Delay before showing the pending clock in the UI. Fast realtime sends

 * upgrade to wire-sent well within this window so the clock never flashes

 * (Telegram: clock only visible when the net is actually slow / offline).

 */

export const CLOCK_REVEAL_MS = 1200;



const RETRIABLE_HTTP = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

const PERMANENT_HTTP = new Set([400, 401, 403, 404, 410, 413, 415, 422]);



function readAuthToken() {

  try {

    if (typeof localStorage === 'undefined') return null;

    return JSON.parse(localStorage.getItem('token'));

  } catch {

    return null;

  }

}



export function isRetriableSendError(e) {

  if (!e) return true;

  if (e?.code === 'ERR_CANCELED' || e?.name === 'CanceledError' || e?.name === 'AbortError') {

    return false;

  }

  const status = e?.response?.status;

  if (!status) return true; // network / timeout / offline

  if (PERMANENT_HTTP.has(status)) return false;

  return RETRIABLE_HTTP.has(status);

}



export function isPermanentSendError(e) {

  if (!e) return false;

  if (e?.code === 'ERR_CANCELED' || e?.name === 'CanceledError' || e?.name === 'AbortError') {

    return false;

  }

  const msg = String(e?.message || '');

  if (msg === 'e2e_encrypt_required' || msg === 'Media file unavailable for send') return true;

  const status = e?.response?.status;

  return !!(status && PERMANENT_HTTP.has(status));

}



/**

 * Sync readiness snapshot for the durable send path.

 * HTTP can proceed when network + API path + auth are up; WS enables instant wire ticks.

 * Never report "sent" readiness without these checks — UI checkmarks wait on server ack.

 */

export function getSendReadiness() {

  const snap = connectionManager.snapshot();

  const authenticated = !!(snap.authenticated ?? readAuthToken());

  const browserOnline = snap.isOnline !== false;

  const networkOnline = !!(browserOnline && !snap.networkConfirmedDown);

  const pusherState = snap.wsState || getPusher()?.connection?.state || null;

  const wsConnected = pusherState === 'connected' || !!snap.wsConnected;

  const apiAvailable = networkOnline;

  const serverAckHealthy = !snap.heartbeatStale || wsConnected;

  const canSend = networkOnline && apiAvailable && authenticated;

  /** Network + internet path + auth + socket — instant whisper / no clock. */

  const realtimeReady = canSend && wsConnected && serverAckHealthy;

  return {

    networkOnline,

    browserOnline,

    wsConnected,

    wsState: pusherState,

    apiAvailable,

    authenticated,

    serverAckHealthy,

    connectionState: snap.state,

    displayStatus: snap.displayStatus,

    canSend,

    realtimeReady,

    offline: !canSend,

  };

}



/** True when we should attempt HTTP send (not merely enqueue). */

export function isSendTransportReady() {

  return getSendReadiness().canSend;

}



/**

 * True when network, internet, auth, and websocket are all up — send via WS event

 * and skip the pending clock entirely.

 */

export function isRealtimeSendReady() {

  return getSendReadiness().realtimeReady;

}



/**

 * Confirm API reachability before a send attempt on flaky mobile networks.

 * Skips probe when already offline; uses connectionManager probe when online.

 */

export async function ensureSendTransportReady({ probe = false } = {}) {

  const ready = getSendReadiness();

  if (!ready.authenticated) {

    return { ...ready, canSend: false, offline: true, realtimeReady: false };

  }

  if (!ready.networkOnline) return { ...ready, canSend: false, offline: true, realtimeReady: false };

  if (!probe) return ready;

  const ok = await connectionManager.probeNetwork();

  const next = getSendReadiness();

  const canSend = ok && next.networkOnline && next.authenticated;

  return {

    ...next,

    apiAvailable: canSend,

    canSend,

    realtimeReady: canSend && next.wsConnected,

    offline: !canSend,

  };

}



/**

 * Full preflight: internet + websocket + auth + optional API probe.

 * Used before leaving the queued state for an HTTP attempt.

 */

export async function preflightSend({ probeApi = true } = {}) {

  const base = await ensureSendTransportReady({ probe: probeApi });

  return {

    ...base,

    checks: {

      internet: base.networkOnline,

      websocket: base.wsConnected,

      authentication: base.authenticated,

      api: base.apiAvailable,

    },

  };

}



/** Derive UI/send status from a message row (server ack + receipts). */

export function deriveSendStatus(message) {

  if (!message) return SEND_STATUS.QUEUED;

  if (message.failed) return SEND_STATUS.FAILED;

  if (message.read_at) return SEND_STATUS.READ;

  if (message.delivered_at) return SEND_STATUS.DELIVERED;

  // Durable server id = confirmed Sent (or better via receipts above).
  if (isServerId(message.id) && !message.pending) {

    return SEND_STATUS.SENT;

  }

  // Fast realtime path: WS healthy + local whisper accepted.
  // Still awaiting durable server id — never Delivered/Read yet.
  // Must NOT be used when offline / WS down (those stay pending/queued).
  if (message.awaiting_server && !message.pending && isRealtimeSendReady()) {

    return SEND_STATUS.SENT;

  }

  if (
    message.awaiting_server
    || message.send_status === SEND_STATUS.SENDING
    || message._sending
  ) {

    return SEND_STATUS.SENDING;

  }

  if (message.pending || !isServerId(message.id)) {

    return message.send_status === SEND_STATUS.SENDING

      ? SEND_STATUS.SENDING

      : SEND_STATUS.QUEUED;

  }

  return SEND_STATUS.SENT;

}



/**

 * Healthy realtime path only (caller must gate with isRealtimeSendReady):
 * whisper accepted on a live socket → single check immediately.
 * Durable server id may still be pending (awaiting_server).
 * Offline / degraded callers must use sendingPatch / queuedPatch instead.

 */

export function wireSentPatch(clientId) {

  return {

    id: clientId,

    client_id: clientId,

    pending: false,

    failed: false,

    awaiting_server: true,

    send_status: SEND_STATUS.SENT,

  };

}



/** Patch when degraded / slow — show pending clock. */

export function sendingPatch(clientId) {

  return {

    id: clientId,

    client_id: clientId,

    pending: true,

    failed: false,

    awaiting_server: false,

    send_status: SEND_STATUS.SENDING,

  };

}



/** Patch applied when transport is offline — stay queued, never "sent". */

export function queuedPatch(clientId) {

  return {

    id: clientId,

    client_id: clientId,

    pending: true,

    failed: false,

    awaiting_server: false,

    send_status: SEND_STATUS.QUEUED,

  };

}



/** Enrich a settled server message with send_status. */

export function withSettledSendStatus(message) {

  if (!message) return message;

  // Without a durable server id this is still optimistic — never mark Sent.
  if (!isServerId(message.id)) {
    return {
      ...message,
      pending: true,
      failed: !!message.failed,
      awaiting_server: true,
      send_status: message.failed ? SEND_STATUS.FAILED : SEND_STATUS.SENDING,
    };
  }

  const send_status = message.read_at

    ? SEND_STATUS.READ

    : (message.delivered_at ? SEND_STATUS.DELIVERED : SEND_STATUS.SENT);

  return {

    ...message,

    pending: false,

    failed: false,

    awaiting_server: false,

    send_status,

  };

}

/**
 * Monotonic receipt merge: null / missing must never demote Read→Delivered→Sent.
 */
export function mergeReceiptFields(prev = {}, incoming = {}) {
  return {
    delivered_at: incoming.delivered_at || prev.delivered_at || null,
    read_at: incoming.read_at || prev.read_at || null,
  };
}


