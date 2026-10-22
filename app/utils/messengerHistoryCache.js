/**
 * Cache-first helpers for messenger history.
 * Opening a chat with a seeded/fetched window must not wait on the network.
 */

export function conversationCacheKey(id) {
  if (id == null) return null;
  if (id === 'draft' || typeof id === 'string' && id.startsWith('draft')) return id;
  const n = Number(id);
  return Number.isFinite(n) ? n : id;
}

export function isConversationHistoryLoaded(state, conversationId) {
  if (conversationId == null) return false;
  const loaded = state.loadedConversationIds || {};
  return !!(
    loaded[conversationId] ||
    loaded[String(conversationId)] ||
    Number.isFinite(Number(conversationId)) && loaded[Number(conversationId)]
  );
}

export function readMessagesBucket(state, conversationId) {
  if (conversationId == null) return [];
  const messages = state.messages || {};
  return messages[conversationId] ||
    messages[String(conversationId)] ||
    messages[Number(conversationId)] ||
    [];
}

/** True when the chat can paint from memory (including ciphertext still unlocking). */
export function hasDisplayableMessageCache(state, conversationId) {
  if (isConversationHistoryLoaded(state, conversationId)) return true;
  return readMessagesBucket(state, conversationId).length > 0;
}

/** Full-pane spinner only when this conversation has nothing to show yet. */
export function shouldShowMessagesLoading(state, conversationId, messagesLoadingFlag) {
  if (!messagesLoadingFlag) return false;
  return !hasDisplayableMessageCache(state, conversationId);
}

/**
 * Opening a chat with a valid cache must not refetch the same recent window.
 * Pagination / envelope-missing decrypt still fetch separately.
 */
export function shouldRefetchHistoryOnOpen(state, conversationId) {
  return !hasDisplayableMessageCache(state, conversationId);
}

/** Live Reverb events (id=0) and durable ids both apply immediately; recover fills gaps. */
export function liveSocketEventAppliesImmediately(eventId) {
  const id = String(eventId ?? '').trim();
  return id === '' || id === '0' || /^\d+$/.test(id);
}
