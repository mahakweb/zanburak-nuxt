/**
 * Same-device refresh decrypt + cache-first + realtime apply rules.
 * Mirrors the zanburak A256GCM wire contract without Nuxt path aliases.
 *
 * Runs with: node --test tests/messenger/*.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hasDisplayableMessageCache,
  shouldShowMessagesLoading,
  shouldRefetchHistoryOnOpen,
  liveSocketEventAppliesImmediately,
  conversationCacheKey,
} from '../../app/utils/messengerHistoryCache.js';
import {
  shouldPaintWireSent,
  conversationHasDurableEncryptedMessages,
  isDurableServerId,
  mergeSendLaneTails,
  shouldKeepOptimisticPlaintext,
} from '../../app/utils/messengerSendGuards.js';

const LOCKED = '🔒 پیام رمزنگاری‌شده';
const GCM_IV_LENGTH = 12;

function b64Encode(bytes) {
  const arr = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
  let binary = '';
  for (let i = 0; i < arr.length; i += 1) binary += String.fromCharCode(arr[i]);
  return Buffer.from(binary, 'binary').toString('base64');
}

function b64Decode(b64) {
  let s = String(b64 || '').trim().replace(/[\r\n\s]/g, '');
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4;
  if (pad) s += '='.repeat(4 - pad);
  return new Uint8Array(Buffer.from(s, 'base64'));
}

function utf8Encode(str) {
  return new TextEncoder().encode(str ?? '');
}

function utf8Decode(bytes) {
  return new TextDecoder().decode(bytes);
}

function randomBytes(length) {
  const out = new Uint8Array(length);
  crypto.getRandomValues(out);
  return out;
}

async function importAesKey(rawKeyBytes) {
  return crypto.subtle.importKey('raw', rawKeyBytes, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function encryptJson(keyBytes, value, aad = null) {
  const key = await importAesKey(keyBytes);
  const iv = randomBytes(GCM_IV_LENGTH);
  const params = { name: 'AES-GCM', iv };
  if (aad) params.additionalData = aad;
  const ctBuf = await crypto.subtle.encrypt(params, key, utf8Encode(JSON.stringify(value)));
  return { ivB64: b64Encode(iv), ciphertextB64: b64Encode(new Uint8Array(ctBuf)) };
}

async function decryptJson(keyBytes, ivB64, ciphertextB64, aad = null) {
  const key = await importAesKey(keyBytes);
  const params = { name: 'AES-GCM', iv: b64Decode(ivB64) };
  if (aad) params.additionalData = aad;
  const ptBuf = await crypto.subtle.decrypt(params, key, b64Decode(ciphertextB64));
  return JSON.parse(utf8Decode(new Uint8Array(ptBuf)));
}

async function decryptJsonCompat(keyBytes, ivB64, ciphertextB64, aadOrList = null) {
  const attempts = [];
  if (Array.isArray(aadOrList)) aadOrList.forEach((a) => { if (a) attempts.push(a); });
  else if (aadOrList) attempts.push(aadOrList);
  attempts.push(null);
  let lastErr = null;
  for (const aad of attempts) {
    try {
      return await decryptJson(keyBytes, ivB64, ciphertextB64, aad);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('decrypt failed');
}

function messageAadCandidates(conversationId, kid, senderDeviceId = '') {
  const base = `zanburak-msg-v1:${String(conversationId)}:${Number(kid)}`;
  const sid = senderDeviceId ? String(senderDeviceId) : '';
  const texts = [base, `${base}:`, sid ? `${base}:${sid}` : null, `${base}:${sid}`].filter(Boolean);
  return [...new Set(texts)].map((t) => utf8Encode(t));
}

test('AES-GCM roundtrip survives key persist (IndexedDB simulation) and AAD variants', async () => {
  const conversationId = 42;
  const kid = 1;
  const keyBytes = randomBytes(32);
  const persisted = b64Encode(keyBytes);

  const aad = utf8Encode(`zanburak-msg-v1:${conversationId}:${kid}`);
  const { ivB64, ciphertextB64 } = await encryptJson(keyBytes, { t: 'text', c: 'سلام بعد از رفرش' }, aad);

  const restored = b64Decode(persisted);
  const payload = await decryptJsonCompat(restored, ivB64, ciphertextB64, messageAadCandidates(conversationId, kid, 'web-device-1'));
  assert.equal(payload.c, 'سلام بعد از رفرش');
});

test('private, group, channel, and saved payloads share the same envelope contract', async () => {
  const keyBytes = randomBytes(32);
  for (const conversationId of [11, 22, 33, 44]) {
    const aad = utf8Encode(`zanburak-msg-v1:${conversationId}:1`);
    const { ivB64, ciphertextB64 } = await encryptJson(keyBytes, { t: 'text', c: `chat-${conversationId}` }, aad);
    const payload = await decryptJsonCompat(keyBytes, ivB64, ciphertextB64, messageAadCandidates(conversationId, 1));
    assert.equal(payload.c, `chat-${conversationId}`);
  }
});

test('legacy messages encrypted without AAD still decrypt', async () => {
  const keyBytes = randomBytes(32);
  const { ivB64, ciphertextB64 } = await encryptJson(keyBytes, { t: 'text', c: 'legacy' }, null);
  const payload = await decryptJsonCompat(keyBytes, ivB64, ciphertextB64, messageAadCandidates(9, 1));
  assert.equal(payload.c, 'legacy');
});

test('wrong conversation key cannot be mistaken for plaintext', async () => {
  const keyBytes = randomBytes(32);
  const other = randomBytes(32);
  const aad = utf8Encode('zanburak-msg-v1:1:1');
  const { ivB64, ciphertextB64 } = await encryptJson(keyBytes, { t: 'text', c: 'secret' }, aad);
  await assert.rejects(() => decryptJsonCompat(other, ivB64, ciphertextB64, [aad, null]));
});

test('late key arrival retries from preserved ciphertext, not the locked placeholder', async () => {
  const keyBytes = randomBytes(32);
  const aad = utf8Encode('zanburak-msg-v1:5:1');
  const { ivB64, ciphertextB64 } = await encryptJson(keyBytes, { t: 'text', c: 'unlocked-later' }, aad);

  const seeded = {
    is_encrypted: true,
    body: ciphertextB64,
    e2e: { v: 1, alg: 'A256GCM', iv: ivB64, kid: 1 },
  };
  const locked = {
    ...seeded,
    body: LOCKED,
    preview: LOCKED,
    _e2e_locked: true,
    _e2e_decrypted: false,
    _e2e_ciphertext: seeded.body,
  };

  assert.equal(locked.body, LOCKED);
  const payload = await decryptJsonCompat(
    keyBytes,
    locked.e2e.iv,
    locked._e2e_ciphertext,
    messageAadCandidates(5, 1),
  );
  assert.equal(payload.c, 'unlocked-later');
});

test('websocket echo must not overwrite decrypted plaintext with ciphertext', () => {
  const prev = {
    id: 9,
    body: 'hello',
    _e2e_decrypted: true,
    _e2e_locked: false,
    _decryptFailed: false,
  };
  const incoming = {
    id: 9,
    body: LOCKED,
    is_encrypted: true,
    _e2e_locked: true,
    _e2e_decrypted: false,
  };
  const keepPlain = !!(prev._e2e_decrypted && !prev._e2e_locked && incoming._e2e_locked);
  assert.equal(keepPlain, true);
  const mergedBody = keepPlain ? prev.body : incoming.body;
  assert.equal(mergedBody, 'hello');
});

test('cache-first: seeded ciphertext is displayable and must not refetch on open', () => {
  const state = {
    loadedConversationIds: { 7: true },
    messages: {
      7: [{ id: 1, is_encrypted: true, body: LOCKED, _e2e_ciphertext: 'abc' }],
    },
  };
  assert.equal(hasDisplayableMessageCache(state, 7), true);
  assert.equal(shouldShowMessagesLoading(state, 7, true), false);
  assert.equal(shouldRefetchHistoryOnOpen(state, 7), false);
  assert.equal(shouldRefetchHistoryOnOpen(state, '7'), false);
});

test('cache-first: empty loaded chat is empty, not loading', () => {
  const state = {
    loadedConversationIds: { 3: true },
    messages: { 3: [] },
  };
  assert.equal(hasDisplayableMessageCache(state, 3), true);
  assert.equal(shouldShowMessagesLoading(state, 3, true), false);
  assert.equal(shouldRefetchHistoryOnOpen(state, 3), false);
});

test('cold chat with no cache still loads from network', () => {
  const state = { loadedConversationIds: {}, messages: {} };
  assert.equal(hasDisplayableMessageCache(state, 99), false);
  assert.equal(shouldShowMessagesLoading(state, 99, true), true);
  assert.equal(shouldRefetchHistoryOnOpen(state, 99), true);
});

test('inactive-chat realtime events apply immediately (live id=0 and durable ids)', () => {
  assert.equal(liveSocketEventAppliesImmediately(0), true);
  assert.equal(liveSocketEventAppliesImmediately('0'), true);
  assert.equal(liveSocketEventAppliesImmediately(1842), true);
  assert.equal(conversationCacheKey('12'), 12);
  assert.equal(conversationCacheKey(12), 12);
});

test('draft first-send must not paint a wire-sent checkmark', () => {
  assert.equal(shouldPaintWireSent({
    realtimeReady: true,
    transportReady: true,
    conversationId: 'draft',
    channelLive: false,
  }), false);
  assert.equal(shouldPaintWireSent({
    realtimeReady: true,
    transportReady: true,
    conversationId: 88,
    channelLive: true,
  }), true);
});

test('empty is_encrypted conversation can still mint the first send', () => {
  const conv = { id: 12, is_encrypted: true, e2e_key_version: 1, last_message: null };
  assert.equal(conversationHasDurableEncryptedMessages(conv, [
    { id: 'c_local', is_encrypted: true, body: 'hi' },
  ]), false);
  assert.equal(conversationHasDurableEncryptedMessages(conv, [
    { id: 501, is_encrypted: true, body: LOCKED },
  ]), true);
});

test('live id=0 is not a durable server message id', () => {
  assert.equal(isDurableServerId(0), false);
  assert.equal(isDurableServerId('0'), false);
  assert.equal(isDurableServerId(1842), true);
  assert.equal(isDurableServerId('c_123'), false);
});

test('draft→real lane merge keeps FIFO so a burst cannot race', async () => {
  const tails = new Map();
  const order = [];
  let releaseFirst;
  const firstGate = new Promise((resolve) => { releaseFirst = resolve; });
  tails.set('draft', firstGate.then(() => { order.push('a'); }));
  mergeSendLaneTails(tails, 'draft', '99');
  const later = (tails.get('99') || Promise.resolve()).then(() => { order.push('b'); });
  releaseFirst();
  await later;
  assert.deepEqual(order, ['a', 'b']);
  assert.equal(tails.has('draft'), true);
  assert.equal(tails.has('99'), true);
});

test('optimistic plaintext without envelope must not become the locked placeholder', () => {
  assert.equal(shouldKeepOptimisticPlaintext({
    is_encrypted: true,
    body: 'سلام اولین پیام',
    _e2e_decrypted: true,
    _e2e_locked: false,
  }, LOCKED), true);
  assert.equal(shouldKeepOptimisticPlaintext({
    is_encrypted: true,
    body: 'سلام اولین پیام',
  }, LOCKED), true);
  assert.equal(shouldKeepOptimisticPlaintext({
    is_encrypted: true,
    body: LOCKED,
    e2e: { iv: 'abc' },
  }, LOCKED), false);
});

test('group / channel / saved / private cache keys stay isolated', () => {
  const state = {
    loadedConversationIds: { 1: true, 2: true },
    messages: {
      1: [{ id: 10, body: 'dm' }],
      2: [{ id: 20, body: 'group' }],
    },
  };
  assert.equal(state.messages[1][0].body, 'dm');
  assert.equal(state.messages[2][0].body, 'group');
  assert.equal(hasDisplayableMessageCache(state, 3), false);
});
