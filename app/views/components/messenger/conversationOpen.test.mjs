/**
 * Pure helpers mirroring messenger open/cache rules (kept in sync with store).
 */
import test from 'node:test';
import assert from 'node:assert/strict';

function conversationCacheKey(id) {
  if (id == null) return null;
  if (id === 'draft' || typeof id === 'string' && id.startsWith('draft')) return id;
  const n = Number(id);
  return Number.isFinite(n) ? n : id;
}

function isConversationHistoryLoaded(loadedConversationIds, conversationId) {
  if (conversationId == null) return false;
  const loaded = loadedConversationIds || {};
  return !!(
    loaded[conversationId] ||
    loaded[String(conversationId)] ||
    Number.isFinite(Number(conversationId)) && loaded[Number(conversationId)]
  );
}

function shouldSkipHistoryFetch(conv, loadedMap) {
  const id = conversationCacheKey(conv?.id);
  if (id == null) return true;
  if (isConversationHistoryLoaded(loadedMap, id)) return true;
  if (Array.isArray(conv.messages) && conv.messages.length === 0) return true;
  if (Array.isArray(conv.messages) && conv.messages.length > 0) return true;
  return false;
}

test('conversationCacheKey normalizes numeric string ids', () => {
  assert.equal(conversationCacheKey('12'), 12);
  assert.equal(conversationCacheKey(12), 12);
  assert.equal(conversationCacheKey('draft'), 'draft');
});

test('loaded map hit works across number/string keys', () => {
  assert.equal(isConversationHistoryLoaded({ 5: true }, '5'), true);
  assert.equal(isConversationHistoryLoaded({ '5': true }, 5), true);
  assert.equal(isConversationHistoryLoaded({}, 5), false);
});

test('empty list bundle skips history fetch', () => {
  assert.equal(shouldSkipHistoryFetch({ id: 1, messages: [] }, {}), true);
});

test('seeded message bundle skips history fetch', () => {
  assert.equal(shouldSkipHistoryFetch({ id: 2, messages: [{ id: 9 }] }, {}), true);
});

test('missing bundle without loaded mark needs fetch', () => {
  assert.equal(shouldSkipHistoryFetch({ id: 3, last_message: { id: 1 } }, {}), false);
});
