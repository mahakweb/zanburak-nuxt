/**
 * Telegram Web–style connection display status helpers.
 *
 * Display statuses (never show peer presence while unhealthy):
 *   connected | connecting | reconnecting | waiting_for_network | offline
 */

/** @typedef {'connected' | 'connecting' | 'reconnecting' | 'waiting_for_network' | 'offline'} ConnectionDisplayStatus */

export const CONNECTION_DISPLAY = Object.freeze({
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  RECONNECTING: 'reconnecting',
  WAITING_FOR_NETWORK: 'waiting_for_network',
  OFFLINE: 'offline',
});

/**
 * Derive a Telegram-like display status from ConnectionManager snapshot fields.
 * @param {{
 *   state?: string,
 *   isOnline?: boolean,
 *   networkConfirmedDown?: boolean,
 *   reconnectAttempt?: number,
 *   everConnected?: boolean,
 *   displayStatus?: string,
 * }} snap
 * @returns {ConnectionDisplayStatus}
 */
export function resolveConnectionDisplayStatus(snap = {}) {
  if (snap.displayStatus && Object.values(CONNECTION_DISPLAY).includes(snap.displayStatus)) {
    return snap.displayStatus;
  }

  const isOnline = snap.isOnline !== false;
  if (!isOnline) return CONNECTION_DISPLAY.OFFLINE;

  if (snap.networkConfirmedDown || snap.state === 'unavailable') {
    return CONNECTION_DISPLAY.WAITING_FOR_NETWORK;
  }

  if (snap.state === 'connected') return CONNECTION_DISPLAY.CONNECTED;

  // Negotiating / reconnecting while the browser still reports online.
  if (snap.everConnected || (Number(snap.reconnectAttempt) || 0) > 0) {
    return CONNECTION_DISPLAY.RECONNECTING;
  }
  return CONNECTION_DISPLAY.CONNECTING;
}

/** True when peer online / last-seen may be shown. */
export function isConnectionHealthy(displayStatus) {
  return displayStatus === CONNECTION_DISPLAY.CONNECTED;
}

/**
 * i18n key for a connection display status (ellipsis added in UI via dots).
 * @param {ConnectionDisplayStatus | string} status
 * @returns {string|null} null when healthy (show brand / presence instead)
 */
export function connectionStatusI18nKey(status) {
  switch (status) {
    case CONNECTION_DISPLAY.CONNECTING:
      return 'messenger.connecting';
    case CONNECTION_DISPLAY.RECONNECTING:
      return 'messenger.reconnecting';
    case CONNECTION_DISPLAY.WAITING_FOR_NETWORK:
      return 'messenger.searchingNetwork';
    case CONNECTION_DISPLAY.OFFLINE:
      return 'messenger.offline';
    default:
      return null;
  }
}

/** Animated ellipsis after Connecting / Reconnecting / Waiting — not Offline. */
export function connectionStatusShowsDots(status) {
  return (
    status === CONNECTION_DISPLAY.CONNECTING
    || status === CONNECTION_DISPLAY.RECONNECTING
    || status === CONNECTION_DISPLAY.WAITING_FOR_NETWORK
  );
}
