/**
 * Conversation-scoped WebSocket relay (Reverb client events / whisper).
 *
 * Path: Frontend → Reverb (Redis when scaling) → other subscribed clients.
 * Does NOT hit Laravel PHP — used for sub-300ms peer delivery. Durable
 * persistence and multi-device fan-out still go through the Redis hot-path API.
 */
import { getEcho, ensureEchoConnected } from '@/lib/echo';

const subscribed = new Map(); // conversationId → Echo channel
const MAX_SUBSCRIPTIONS = 64;

/** Set once from the Vuex store so every channel shares the same handlers. */
let onWhisperMessage = null;
let onWhisperTyping = null;

function channelName(conversationId) {
  return `conversation.${conversationId}`;
}

export function setConversationRealtimeHandlers({ message, typing } = {}) {
  if (typeof message === 'function') onWhisperMessage = message;
  if (typeof typing === 'function') onWhisperTyping = typing;
}

/**
 * Ensure we are subscribed to a conversation private channel for whisper
 * ingress/egress. Returns the Echo channel or null (or a Promise resolving to it).
 */
export function ensureConversationChannel(conversationId) {
  const id = Number(conversationId);
  if (!id || Number.isNaN(id)) return null;

  if (subscribed.has(id)) {
    return subscribed.get(id);
  }

  const existing = getEcho();
  if (existing) {
    return subscribeConversationChannel(existing, id);
  }

  // Echo not loaded yet — start connect and subscribe when ready.
  return Promise.resolve(ensureEchoConnected())
    .then((echo) => {
      const live = echo || getEcho();
      if (!live) return null;
      if (subscribed.has(id)) return subscribed.get(id);
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
  subscribed.set(id, ch);
  return ch;
}

export function leaveConversationChannel(conversationId) {
  const id = Number(conversationId);
  if (!subscribed.has(id)) return;
  const echo = getEcho();
  if (echo) {
    try {
      echo.leave(channelName(id));
    } catch (e) {
      /* noop */
    }
  }
  subscribed.delete(id);
}

export function leaveAllConversationChannels() {
  [...subscribed.keys()].forEach((id) => leaveConversationChannel(id));
}

/**
 * Peer-deliver a message over the persistent WebSocket (no HTTP, no PHP).
 * Returns true when the whisper was issued on a live channel.
 */
export function whisperMessage(conversationId, payload) {
  const ch = ensureConversationChannel(conversationId);
  // Async subscribe (Echo still loading) — skip whisper; HTTP path remains durable.
  if (!ch || typeof ch.then === 'function') return false;
  try {
    ch.whisper('message', payload);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Typing / recording / uploading_* over WebSocket (no HTTP round-trip).
 */
export function whisperTyping(conversationId, payload) {
  const ch = ensureConversationChannel(conversationId);
  if (!ch || typeof ch.then === 'function') return false;
  try {
    ch.whisper('typing', payload);
    return true;
  } catch (e) {
    return false;
  }
}

export function isConversationChannelLive(conversationId) {
  return subscribed.has(Number(conversationId));
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
