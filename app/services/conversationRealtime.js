/**
 * Conversation-scoped WebSocket relay (Reverb client events / whisper).
 *
 * Path: Frontend → Reverb (Redis when scaling) → other subscribed clients.
 * Does NOT hit Laravel PHP — used for sub-300ms peer delivery. Durable
 * persistence and multi-device fan-out still go through the Redis hot-path API.
 *
 * `echo.private()` is not live until Pusher `subscription_succeeded`. Whispering
 * before that drops the event, which is why the first contact message never
 * arrived until refresh. We queue outgoing whispers until the channel is
 * actually subscribed, then flush.
 */
import { getEcho, ensureEchoConnected } from '@/lib/echo';

const subscribed = new Map(); // conversationId → Echo channel
const liveChannels = new Set(); // conversationId that completed auth
const pendingWhispers = new Map(); // conversationId → payload[]
const MAX_SUBSCRIPTIONS = 64;
const MAX_PENDING_WHISPERS = 40;

/** Set once from the Pinia store so every channel shares the same handlers. */
let onWhisperMessage = null;
let onWhisperTyping = null;
let onOutgoingWhisper = null;

function channelName(conversationId) {
  return `conversation.${conversationId}`;
}

export function setConversationRealtimeHandlers({ message, typing, outgoingWhisper } = {}) {
  if (typeof message === 'function') onWhisperMessage = message;
  if (typeof typing === 'function') onWhisperTyping = typing;
  if (typeof outgoingWhisper === 'function') onOutgoingWhisper = outgoingWhisper;
}

function pusherChannelSubscribed(echo, id) {
  try {
    const pusher = echo?.connector?.pusher;
    if (!pusher?.channel) return false;
    const privateName = `private-${channelName(id)}`;
    const ch = pusher.channel(privateName) || pusher.channel(channelName(id));
    return !!ch?.subscribed;
  } catch (e) {
    return false;
  }
}

function markChannelLive(id) {
  const n = Number(id);
  if (!n) return;
  liveChannels.add(n);
  flushPendingWhispers(n);
}

function enqueuePendingWhisper(id, payload) {
  const n = Number(id);
  if (!n) return;
  const list = pendingWhispers.get(n) || [];
  if (list.length >= MAX_PENDING_WHISPERS) list.shift();
  list.push(payload);
  pendingWhispers.set(n, list);
}

function emitOutgoing(conversationId, payload) {
  if (typeof onOutgoingWhisper === 'function') {
    try { onOutgoingWhisper(conversationId, payload); } catch (e) { /* noop */ }
  }
}

function flushPendingWhispers(conversationId) {
  const id = Number(conversationId);
  const ch = subscribed.get(id);
  const list = pendingWhispers.get(id) || [];
  pendingWhispers.delete(id);
  if (!ch || typeof ch.whisper !== 'function' || !list.length) return;
  list.forEach((payload) => {
    try {
      ch.whisper('message', payload);
      emitOutgoing(id, payload);
    } catch (e) { /* noop */ }
  });
}

/**
 * Ensure we are subscribed to a conversation private channel for whisper
 * ingress/egress. Returns the Echo channel or null (or a Promise resolving to it).
 */
export function ensureConversationChannel(conversationId) {
  const id = Number(conversationId);
  if (!id || Number.isNaN(id)) return null;

  const existing = getEcho();
  // After Echo rebuild, Map entries point at dead channels — resubscribe.
  if (subscribed.has(id)) {
    if (existing) {
      if (pusherChannelSubscribed(existing, id)) markChannelLive(id);
      return subscribed.get(id);
    }
    leaveConversationChannel(id);
  }

  if (existing) {
    return subscribeConversationChannel(existing, id);
  }

  // Echo not loaded yet — start connect and subscribe when ready.
  return Promise.resolve(ensureEchoConnected())
    .then((echo) => {
      const live = echo || getEcho();
      if (!live) return null;
      if (subscribed.has(id)) {
        if (pusherChannelSubscribed(live, id)) markChannelLive(id);
        return subscribed.get(id);
      }
      return subscribeConversationChannel(live, id);
    })
    .catch(() => null);
}

function subscribeConversationChannel(echo, id) {
  // Evict oldest when over cap (Map insertion order).
  while (subscribed.size >= MAX_SUBSCRIPTIONS) {
    const oldest = subscribed.keys().next().value;
    leaveConversationChannel(oldest);
  }

  const ch = echo.private(channelName(id));
  ch.listenForWhisper('message', (payload) => {
    if (onWhisperMessage) onWhisperMessage(id, payload);
  });
  ch.listenForWhisper('typing', (payload) => {
    if (onWhisperTyping) onWhisperTyping(id, payload);
  });
  ch.subscribed(() => {
    markChannelLive(id);
  });
  subscribed.set(id, ch);
  if (pusherChannelSubscribed(echo, id)) markChannelLive(id);
  return ch;
}

export function leaveConversationChannel(conversationId) {
  const id = Number(conversationId);
  if (!subscribed.has(id) && !liveChannels.has(id)) return;
  const echo = getEcho();
  if (echo) {
    try {
      echo.leave(channelName(id));
    } catch (e) {
      /* noop */
    }
  }
  subscribed.delete(id);
  liveChannels.delete(id);
  pendingWhispers.delete(id);
}

export function leaveAllConversationChannels() {
  [...subscribed.keys()].forEach((id) => leaveConversationChannel(id));
  liveChannels.clear();
  pendingWhispers.clear();
}

/**
 * Peer-deliver a message over the persistent WebSocket (no HTTP, no PHP).
 * Returns true when the whisper was issued on a live (authorized) channel.
 * Otherwise the payload is queued and flushed as soon as the channel auths.
 */
export function whisperMessage(conversationId, payload) {
  const id = Number(conversationId);
  if (!id || Number.isNaN(id)) return false;
  const ch = ensureConversationChannel(id);
  const ready = ch
    && typeof ch.then !== 'function'
    && typeof ch.whisper === 'function'
    && liveChannels.has(id);
  if (!ready) {
    enqueuePendingWhisper(id, payload);
    if (ch && typeof ch.then === 'function') {
      ch.then((readyCh) => {
        if (readyCh && liveChannels.has(id)) flushPendingWhispers(id);
      }).catch(() => {});
    }
    return false;
  }
  try {
    ch.whisper('message', payload);
    emitOutgoing(id, payload);
    return true;
  } catch (e) {
    enqueuePendingWhisper(id, payload);
    return false;
  }
}

/**
 * Typing / recording / uploading_* over WebSocket (no HTTP round-trip).
 */
export function whisperTyping(conversationId, payload) {
  const ch = ensureConversationChannel(conversationId);
  if (!ch || typeof ch.then === 'function') return false;
  const id = Number(conversationId);
  if (!liveChannels.has(id)) return false;
  try {
    ch.whisper('typing', payload);
    return true;
  } catch (e) {
    return false;
  }
}

export function isConversationChannelLive(conversationId) {
  return liveChannels.has(Number(conversationId));
}

/** Warm subscriptions for a list of conversation ids (sidebar / active). */
export function warmConversationChannels(conversationIds = []) {
  (conversationIds || []).forEach((id) => {
    if (id != null && !isDraftConversationIdSafe(id)) {
      ensureConversationChannel(id);
    }
  });
}

function isDraftConversationIdSafe(id) {
  return id === 'draft' || (typeof id === 'string' && id.startsWith('draft'));
}
