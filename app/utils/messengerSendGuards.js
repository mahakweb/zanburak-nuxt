/**
 * First-send / outbox guards shared by the messenger store and tests.
 * Keep these free of Pinia / IndexedDB so unit tests can import them.
 */

export function isDraftConversationId(id) {
  return id === 'draft' || String(id) === 'draft';
}

/**
 * Wire-sent checkmarks are only honest when the real conversation channel is live.
 * Draft chats have no conversation.{id} yet — a tick here is a lie (HTTP/whisper
 * cannot have happened), and after refresh those bubbles come back as clocks.
 */
export function shouldPaintWireSent({
  realtimeReady = false,
  transportReady = false,
  conversationId = null,
  channelLive = false,
} = {}) {
  if (!realtimeReady || !transportReady) return false;
  if (isDraftConversationId(conversationId)) return false;
  return !!channelLive;
}

/**
 * Durable encrypted history only. An empty chat with `is_encrypted` / key
 * version set must still be allowed to mint — otherwise the first contact
 * send hangs forever when the local key is missing.
 */
export function conversationHasDurableEncryptedMessages(conv, messages = []) {
  const last = conv?.last_message;
  if (last && (last.is_encrypted || last.e2e) && last.id != null && Number(last.id) > 0) {
    return true;
  }
  return (messages || []).some(
    (m) => (m.is_encrypted || m.e2e) && m.id != null && Number(m.id) > 0,
  );
}

/** Live Reverb id=0 is not a persisted Laravel message id. */
export function isDurableServerId(id) {
  if (id == null) return false;
  if (typeof id === 'number') return Number.isFinite(id) && id > 0;
  if (typeof id === 'string') return /^\d+$/.test(id) && Number(id) > 0;
  return false;
}

/**
 * Keep both draft and real tails pointing at the same merged promise so a
 * burst enqueued on `draft` cannot race a later enqueue on the real id.
 */
export function mergeSendLaneTails(tails, fromKey, toKey) {
  if (!tails || fromKey == null || toKey == null) return tails;
  const from = String(fromKey);
  const to = String(toKey);
  if (!from || !to || from === to) return tails;
  const fromTail = tails.get(from);
  if (!fromTail) return tails;
  const toTail = tails.get(to) || Promise.resolve();
  const merged = Promise.all([
    Promise.resolve(fromTail).catch(() => {}),
    Promise.resolve(toTail).catch(() => {}),
  ]).then(() => {});
  tails.set(from, merged);
  tails.set(to, merged);
  return tails;
}

/** Own optimistic plaintext must never be rewritten as the locked placeholder. */
export function shouldKeepOptimisticPlaintext(message, lockedPlaceholder) {
  if (!message) return false;
  const body = message.body;
  if (body == null || body === '' || body === lockedPlaceholder) return false;
  if (message._e2e_decrypted && !message._e2e_locked && !message._decryptFailed) {
    return true;
  }
  const envelope = message.e2e;
  const hasEnvelope = !!(envelope && (typeof envelope === 'object' ? envelope.iv : true));
  if (hasEnvelope) return false;
  const text = String(body);
  if (/\s/.test(text)) return true;
  return text.length < 32 || !/^[A-Za-z0-9+/=]+$/.test(text);
}
