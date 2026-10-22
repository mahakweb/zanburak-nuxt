/**
 * Pure send-status demotion guards (mirrors sendPipeline.js helpers).
 * Kept free of Nuxt aliases so node:test can run them.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { isServerId } from './outbox.js';

const SEND_STATUS = Object.freeze({
  QUEUED: 'queued',
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
});

function wireSentPatch(clientId) {
  return {
    id: clientId,
    client_id: clientId,
    pending: false,
    failed: false,
    awaiting_server: true,
    send_status: SEND_STATUS.SENT,
  };
}

function queuedPatch(clientId) {
  return {
    id: clientId,
    client_id: clientId,
    pending: true,
    failed: false,
    awaiting_server: false,
    send_status: SEND_STATUS.QUEUED,
  };
}

function sendingPatch(clientId) {
  return {
    id: clientId,
    client_id: clientId,
    pending: true,
    failed: false,
    awaiting_server: false,
    send_status: SEND_STATUS.SENDING,
  };
}

function isWireSentBubble(m) {
  if (!m || m.failed) return false;
  if (m.delivered_at || m.read_at) return true;
  if (isServerId(m.id) && !m.pending) return true;
  const status = m.send_status;
  if (
    status === SEND_STATUS.SENT ||
    status === SEND_STATUS.DELIVERED ||
    status === SEND_STATUS.READ
  ) {
    return true;
  }
  return !!(m.awaiting_server && !m.pending);
}

function outboundStatusPatch(clientId, kind, bubble) {
  if (isWireSentBubble(bubble)) return null;
  if (kind === 'sending') return sendingPatch(clientId);
  return queuedPatch(clientId);
}

test('wire-sent bubble is not demoted by queued/sending patches', () => {
  const wire = wireSentPatch('c_1');
  assert.equal(isWireSentBubble(wire), true);
  assert.equal(outboundStatusPatch('c_1', 'queued', wire), null);
  assert.equal(outboundStatusPatch('c_1', 'sending', wire), null);
});

test('queued bubble may receive queued/sending patches', () => {
  const q = queuedPatch('c_2');
  assert.equal(isWireSentBubble(q), false);
  assert.deepEqual(outboundStatusPatch('c_2', 'queued', q), queuedPatch('c_2'));
  assert.deepEqual(outboundStatusPatch('c_2', 'sending', q), sendingPatch('c_2'));
});

test('server-acked message is wire-sent for demotion guard', () => {
  assert.equal(isWireSentBubble({
    id: 99,
    pending: false,
    send_status: SEND_STATUS.SENT,
  }), true);
  assert.equal(outboundStatusPatch('c_3', 'queued', {
    id: 99,
    client_id: 'c_3',
    pending: false,
  }), null);
});

test('checkmark then pending regression is blocked', () => {
  // Reproduce: live paint wire-sent, then outbox flusher applies sendingPatch.
  const afterPaint = wireSentPatch('c_group');
  const demote = outboundStatusPatch('c_group', 'sending', afterPaint);
  assert.equal(demote, null, 'must not demote wire-sent to sending/clock');
  const afterRetry = outboundStatusPatch('c_group', 'queued', afterPaint);
  assert.equal(afterRetry, null, 'must not demote wire-sent to queued/clock');
});
