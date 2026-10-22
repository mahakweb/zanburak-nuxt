import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeOutboxConversationId,
  outboxBackoffMs,
  outboxIsDue,
  isServerId,
} from './outbox.js';

test('normalizeOutboxConversationId keeps draft ids as strings', () => {
  assert.equal(normalizeOutboxConversationId('draft'), 'draft');
  assert.equal(normalizeOutboxConversationId('draft:12'), 'draft:12');
  assert.equal(normalizeOutboxConversationId(42), 42);
  assert.equal(normalizeOutboxConversationId('99'), 99);
  assert.equal(normalizeOutboxConversationId(null), null);
});

test('normalizeOutboxConversationId never yields NaN for draft', () => {
  const id = normalizeOutboxConversationId('draft');
  assert.equal(Number.isNaN(Number(id)) || id === 'draft', true);
  assert.notEqual(id, Number('draft'));
});

test('isServerId accepts numeric strings', () => {
  assert.equal(isServerId(12), true);
  assert.equal(isServerId('12'), true);
  assert.equal(isServerId('c_123'), false);
  assert.equal(isServerId(null), false);
});

test('outboxBackoffMs grows with attempts and stays bounded', () => {
  const a0 = outboxBackoffMs(0);
  const a5 = outboxBackoffMs(5);
  assert.ok(a0 >= 400);
  assert.ok(a5 > a0);
  assert.ok(outboxBackoffMs(99) <= 30_000 + 400);
});

test('outboxIsDue respects next_attempt_at and failed status', () => {
  const now = Date.now();
  assert.equal(outboxIsDue({ status: 'failed' }, now), false);
  assert.equal(outboxIsDue({ status: 'queued', next_attempt_at: null }, now), true);
  assert.equal(
    outboxIsDue({
      status: 'queued',
      next_attempt_at: new Date(now + 60_000).toISOString(),
    }, now),
    false,
  );
});
