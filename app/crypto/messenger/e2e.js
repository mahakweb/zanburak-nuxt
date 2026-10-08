/**
 * Top-level encrypt/decrypt API used by the messenger Vuex store. Encodes the
 * wire protocol shared with the backend:
 *
 *  message.e2e   = { v: 1, alg: 'A256GCM', iv: base64, kid: number }
 *  message.body  = base64(AES-256-GCM ciphertext of UTF-8 JSON plaintext payload)
 *
 * Plaintext payload shapes:
 *  text     -> { t: 'text', c: 'hello' }
 *  location -> { t: 'location', lat, lng, accuracy? }
 *  media    -> { t: 'photo'|'video'|..., c: caption, mk, miv, name, mime, w?, h?, duration? }
 */
import { encryptJson, decryptJsonCompat, encryptBytes, decryptBytes, generateAesKeyBytes } from './aes';
import { b64Encode, b64Decode, utf8Encode } from './bytes';
import {
  ensureConversationKey,
  pullAndConsumePackages,
  peekInlineKeyWraps,
  scheduleInlineKeyWraps,
  ingestInlineKeyWraps,
  pullAndConsumeKeyVault,
} from './session';
import { getConversationKeyCandidates } from './store';

export const E2E_VERSION = 1;
export const E2E_ALG = 'A256GCM';
/** Shown instead of ciphertext anywhere the app would otherwise leak it (previews, notifications, failed decrypts). */
export const LOCKED_PLACEHOLDER = '🔒 پیام رمزنگاری‌شده';

const MEDIA_TYPES = new Set(['photo', 'video', 'voice', 'audio', 'file']);

/** AAD binds ciphertext to conversation + key version (+ optional sender device). */
export function messageAadBytes(conversationId, kid, senderDeviceId = '') {
  const base = `zanburak-msg-v1:${String(conversationId)}:${Number(kid)}`;
  if (senderDeviceId) return utf8Encode(`${base}:${String(senderDeviceId)}`);
  return utf8Encode(base);
}

/**
 * All AAD byte variants ever used by this client — decrypt must try every one.
 * Legacy always appended `:${deviceId}` (even when empty → trailing colon).
 */
export function messageAadCandidates(conversationId, kid, senderDeviceId = '') {
  const base = `zanburak-msg-v1:${String(conversationId)}:${Number(kid)}`;
  const sid = senderDeviceId ? String(senderDeviceId) : '';
  const texts = [
    base,
    `${base}:`,
    sid ? `${base}:${sid}` : null,
    // legacy test / early builds always included the device segment
    `${base}:${sid}`,
  ].filter(Boolean);
  const seen = new Set();
  const out = [];
  texts.forEach((t) => {
    if (seen.has(t)) return;
    seen.add(t);
    out.push(utf8Encode(t));
  });
  return out;
}

/**
 * Decide whether a conversation must use E2E encryption.
 * Mirrors the backend rule:
 *  - public channels → plaintext (broadcast / searchable)
 *  - Saved Messages → plaintext cloud self-chat (Telegram-style; server forward
 *    + media reuse; legacy is_encrypted notes still decrypt client-side)
 *  - private / group / private channel → E2E while the feature is enabled
 */
export function conversationNeedsE2e(conv, systemConfigOrEnabled = null) {
  if (!conv) return false;

  let e2eEnabled = true;
  if (typeof systemConfigOrEnabled === 'boolean') {
    e2eEnabled = systemConfigOrEnabled;
  } else if (systemConfigOrEnabled && typeof systemConfigOrEnabled === 'object') {
    if (systemConfigOrEnabled.e2e?.enabled === false) e2eEnabled = false;
    if (systemConfigOrEnabled.features?.e2e === false) e2eEnabled = false;
    if (systemConfigOrEnabled.e2e_enabled === false) e2eEnabled = false;
  }
  if (!e2eEnabled) return false;

  // Cloud self-chat — never require E2E for new sends / server forwards.
  if (conv.type === 'saved') return false;

  // Channel policy:
  //  - public channel  → plaintext (broadcast / searchable / scalable)
  //  - private channel → same conversation-key E2EE as groups (admin/creator
  //    control membership; key rotates on member add/kick/leave)
  if (conv.type === 'channel' && conv.is_public) return false;

  return ['private', 'group', 'channel'].includes(conv.type)
    || !!conv.is_encrypted;
}

function buildTextLikePayload(type, fields) {
  if (type === 'location') {
    return {
      t: 'location',
      lat: fields.meta?.lat,
      lng: fields.meta?.lng,
      accuracy: fields.meta?.accuracy,
    };
  }
  if (type === 'text' || !type) {
    return { t: 'text', c: fields.body || '' };
  }
  // Any other non-media custom type: carry body + meta through opaquely so
  // nothing is silently dropped by the encryption layer.
  return { t: type, c: fields.body || '', m: fields.meta || null };
}

function applyDecryptedPayload(message, payload) {
  const out = { ...message, _decryptFailed: false };
  if (payload.t === 'text') {
    out.body = payload.c || '';
  } else if (payload.t === 'location') {
    out.body = '';
    out.meta = {
      ...(message.meta || {}), lat: payload.lat, lng: payload.lng, accuracy: payload.accuracy,
    };
  } else if (MEDIA_TYPES.has(payload.t)) {
    out.body = payload.c || '';
    out.type = payload.t;
    out.meta = {
      ...(message.meta || {}),
      name: payload.name || message.meta?.name,
      mime: payload.mime || message.meta?.mime,
      width: message.meta?.width ?? payload.w ?? null,
      height: message.meta?.height ?? payload.h ?? null,
      duration: message.meta?.duration ?? payload.duration ?? null,
      encrypted: true,
    };
    out._mediaKey = payload.mk || null;
    out._mediaIv = payload.miv || null;
  } else {
    out.body = payload.c ?? '';
    if (payload.m) out.meta = { ...(message.meta || {}), ...payload.m };
  }
  return out;
}

/**
 * Memory-only wraps. If the chat is still cold, fill the cache in the
 * background — the ciphertext itself must not wait on /bundles.
 */
function inlineWrapsForSend(conversationId, kid, keyBytes) {
  const peeked = peekInlineKeyWraps(conversationId, kid);
  if (!peeked) {
    scheduleInlineKeyWraps(conversationId, kid, keyBytes);
    return [];
  }
  return peeked.wraps || [];
}

export async function encryptOutgoingMessage(conversationId, type, fields = {}, options = {}) {
  const allowMint = options.allowMint !== false;
  const [{ keyBytes, kid }, senderDeviceId] = await Promise.all([
    ensureConversationKey(conversationId, { allowMint }),
    import('./device').then((m) => m.getMyDeviceId()),
  ]);
  const payload = buildTextLikePayload(type, fields);
  const aad = messageAadBytes(conversationId, kid);
  // Local AES only. Peer wraps are attached when already in memory.
  // A cold cache must not block the send on GET /bundles.
  const { ivB64, ciphertextB64 } = await encryptJson(keyBytes, payload, aad);
  const wraps = inlineWrapsForSend(conversationId, kid, keyBytes);

  return {
    body: ciphertextB64,
    is_encrypted: true,
    sender_device_id: senderDeviceId,
    e2e: {
      v: E2E_VERSION,
      alg: E2E_ALG,
      iv: ivB64,
      kid,
      aad: 1,
      sid: senderDeviceId,
      ...(wraps.length ? { wraps } : {}),
    },
  };
}

/**
 * Encrypt a media message's caption + file key envelope for the wire.
 * `fileKey` comes from encryptFile(): { mkB64, mivB64 }.
 */
export async function encryptOutgoingMediaEnvelope(conversationId, type, {
  caption = '', fileKey, name, mime, width = null, height = null, duration = null,
} = {}, options = {}) {
  const allowMint = options.allowMint !== false;
  const [{ keyBytes, kid }, senderDeviceId] = await Promise.all([
    ensureConversationKey(conversationId, { allowMint }),
    import('./device').then((m) => m.getMyDeviceId()),
  ]);
  const payload = {
    t: type,
    c: caption || '',
    mk: fileKey.mkB64,
    miv: fileKey.mivB64,
    name,
    mime,
  };
  if (width != null) payload.w = width;
  if (height != null) payload.h = height;
  if (duration != null) payload.duration = duration;
  const aad = messageAadBytes(conversationId, kid);
  const { ivB64, ciphertextB64 } = await encryptJson(keyBytes, payload, aad);
  const wraps = inlineWrapsForSend(conversationId, kid, keyBytes);
  return {
    body: ciphertextB64,
    is_encrypted: true,
    sender_device_id: senderDeviceId,
    e2e: {
      v: E2E_VERSION,
      alg: E2E_ALG,
      iv: ivB64,
      kid,
      aad: 1,
      sid: senderDeviceId,
      ...(wraps.length ? { wraps } : {}),
    },
  };
}

/** Store-compatible helpers (used by messenger.module.js). */
export async function encryptTextMessage(conversationId, text, options = {}) {
  return encryptOutgoingMessage(conversationId, 'text', { body: text }, options);
}

export async function encryptLocationMessage(conversationId, loc = {}, options = {}) {
  return encryptOutgoingMessage(conversationId, 'location', {
    meta: { lat: loc.lat, lng: loc.lng, accuracy: loc.accuracy },
  }, options);
}

export async function encryptMediaMessage(conversationId, {
  file,
  type,
  caption = '',
  width = null,
  height = null,
  duration = null,
} = {}, options = {}) {
  const encFile = await encryptFile(file);
  const envelope = await encryptOutgoingMediaEnvelope(conversationId, type, {
    caption,
    fileKey: { mkB64: encFile.mkB64, mivB64: encFile.mivB64 },
    name: file?.name || `file.${type}`,
    mime: file?.type || 'application/octet-stream',
    width,
    height,
    duration,
  }, options);
  return {
    file: encFile.encryptedFile,
    captionCipher: envelope.body,
    is_encrypted: true,
    encrypted: true,
    sender_device_id: envelope.sender_device_id,
    e2e: envelope.e2e,
    _plainCaption: caption,
    _mediaKey: encFile.mkB64,
    _mediaIv: encFile.mivB64,
    _mime: file?.type || 'application/octet-stream',
    _name: file?.name || `file.${type}`,
  };
}

/**
 * Decrypt an incoming (or server-echoed) encrypted message for display.
 * Never throws — falls back to a locked placeholder on failure.
 * Original ciphertext is kept on `_e2e_ciphertext` so a later key pull can retry.
 *
 * @param {object} message
 * @param {{ skipPull?: boolean }} [options]  When true, do not hit /packages
 *   (caller already pulled, or decrypting a list in bulk).
 */
export async function decryptIncomingMessage(message, options = {}) {
  if (!message) return message;

  // Nested reply quotes — decrypt independently (may share conversation keys).
  let replyTo = message.reply_to;
  if (replyTo?.is_encrypted && !replyTo._e2e_decrypted) {
    replyTo = await decryptIncomingMessage({
      ...replyTo,
      conversation_id: replyTo.conversation_id || message.conversation_id,
    }, { skipPull: true });
  }

  if (!message.is_encrypted) {
    return replyTo !== message.reply_to ? { ...message, reply_to: replyTo } : message;
  }

  // Device must exist before wrap ingest / package pull.
  try {
    const { ensureDevice } = await import('./device');
    await ensureDevice();
  } catch (e) {
    console.warn('[e2e] ensureDevice before decrypt failed', e);
  }

  // Already unlocked — keep media keys / empty captions (photos without text).
  if (message._e2e_decrypted && !message._e2e_locked && !message._decryptFailed) {
    const out = replyTo !== message.reply_to ? { ...message, reply_to: replyTo } : message;
    if (out.body === LOCKED_PLACEHOLDER && out._e2e_ciphertext) {
      // Stale locked body with a known ciphertext — retry below.
    } else {
      return out;
    }
  }

  let envelope = message.e2e;
  if (typeof envelope === 'string') {
    try { envelope = JSON.parse(envelope); } catch { envelope = null; }
  }

  const cipherBody = (
    message._e2e_ciphertext
    || (message.body && message.body !== LOCKED_PLACEHOLDER ? message.body : null)
  );
  if (!envelope || !cipherBody) {
    return {
      ...message,
      reply_to: replyTo,
      body: LOCKED_PLACEHOLDER,
      _decryptFailed: true,
      _e2e_locked: true,
      preview: LOCKED_PLACEHOLDER,
    };
  }

  const alg = envelope.alg || envelope.algorithm || E2E_ALG;
  if (alg !== E2E_ALG) {
    return {
      ...message,
      reply_to: replyTo,
      body: LOCKED_PLACEHOLDER,
      _e2e_ciphertext: cipherBody,
      _decryptFailed: true,
      _e2e_locked: true,
      preview: LOCKED_PLACEHOLDER,
    };
  }

  const conversationId = message.conversation_id;
  const kid = Number(envelope.kid ?? envelope.key_version ?? 1);
  const iv = envelope.iv;
  const senderDeviceId = message.sender_device_id || envelope.sid || '';
  const aadRaw = [
    ...messageAadCandidates(conversationId, kid, senderDeviceId),
    ...messageAadCandidates(conversationId, kid, envelope.sid || ''),
    ...messageAadCandidates(String(conversationId), kid, senderDeviceId),
    ...messageAadCandidates(Number(conversationId), kid, senderDeviceId),
  ];
  const aadSeen = new Set();
  const aadCandidates = [];
  aadRaw.forEach((a) => {
    const key = b64Encode(a);
    if (aadSeen.has(key)) return;
    aadSeen.add(key);
    aadCandidates.push(a);
  });

  try {
    // Prefer the key the sender embedded for us — self-healing even when
    // package relay / IndexedDB state is out of sync.
    if (Array.isArray(envelope.wraps) && envelope.wraps.length) {
      await ingestInlineKeyWraps(conversationId, kid, envelope.wraps).catch(() => false);
    }

    let candidates = await getConversationKeyCandidates(conversationId, kid);
    if (!candidates.length && !options.skipPull) {
      // Vault first (identity-wrapped, durable) then device packages.
      await pullAndConsumeKeyVault(conversationId, { force: true }).catch(() => 0);
      candidates = await getConversationKeyCandidates(conversationId, kid);
    }
    if (!candidates.length && !options.skipPull) {
      await pullAndConsumePackages(conversationId, { bypassCooldown: true });
      if (Array.isArray(envelope.wraps) && envelope.wraps.length) {
        await ingestInlineKeyWraps(conversationId, kid, envelope.wraps).catch(() => false);
      }
      candidates = await getConversationKeyCandidates(conversationId, kid);
    }
    if (!candidates.length) {
      return {
        ...message,
        reply_to: replyTo,
        body: LOCKED_PLACEHOLDER,
        _e2e_ciphertext: cipherBody,
        _decryptFailed: true,
        _e2e_locked: true,
        preview: LOCKED_PLACEHOLDER,
      };
    }

    let payload = null;
    let lastErr = null;
    const tryDecrypt = async (keys) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const keyB64 of keys) {
        try {
          // eslint-disable-next-line no-await-in-loop
          return await decryptJsonCompat(b64Decode(keyB64), iv, cipherBody, aadCandidates);
        } catch (e) {
          lastErr = e;
        }
      }
      return null;
    };

    payload = await tryDecrypt(candidates);
    if (!payload && Array.isArray(envelope.wraps) && envelope.wraps.length) {
      const ingested = await ingestInlineKeyWraps(conversationId, kid, envelope.wraps).catch(() => false);
      if (ingested) {
        candidates = await getConversationKeyCandidates(conversationId, kid);
        payload = await tryDecrypt(candidates);
      }
    }
    if (!payload) {
      console.warn('[e2e] decrypt failed for all candidate keys', {
        conversationId,
        kid,
        candidateCount: candidates.length,
        hasWraps: Array.isArray(envelope.wraps) && envelope.wraps.length > 0,
        err: lastErr,
      });
      return {
        ...message,
        reply_to: replyTo,
        body: LOCKED_PLACEHOLDER,
        _e2e_ciphertext: cipherBody,
        _decryptFailed: true,
        _e2e_locked: true,
        preview: LOCKED_PLACEHOLDER,
      };
    }

    const out = applyDecryptedPayload({ ...message, e2e: envelope, reply_to: replyTo }, payload);
    out._e2e_decrypted = true;
    out._e2e_locked = false;
    out._decryptFailed = false;
    out._e2e_ciphertext = cipherBody;
    return out;
  } catch (e) {
    console.warn('[e2e] decrypt failed', e);
    return {
      ...message,
      reply_to: replyTo,
      body: LOCKED_PLACEHOLDER,
      _e2e_ciphertext: cipherBody,
      _decryptFailed: true,
      _e2e_locked: true,
      preview: LOCKED_PLACEHOLDER,
    };
  }
}

/** Decrypt an array of messages; one vault+package pull per conversation, then parallel decrypt. */
export async function decryptMessages(messages) {
  if (!Array.isArray(messages) || !messages.length) return messages;
  const convIds = new Set();
  messages.forEach((m) => {
    if (m?.is_encrypted && m.conversation_id != null) convIds.add(String(m.conversation_id));
  });
  await Promise.all([...convIds].map(async (cid) => {
    await pullAndConsumeKeyVault(cid, { force: true }).catch(() => 0);
    await pullAndConsumePackages(cid, { bypassCooldown: true }).catch(() => {});
  }));
  return Promise.all(messages.map((m) => decryptIncomingMessage(m, { skipPull: true })));
}

export const decryptMessageList = decryptMessages;

// ---------------------------------------------------------------------------
// Media file encryption — independent random key per file (AES-256-GCM)
// ---------------------------------------------------------------------------

/** Encrypt a File/Blob's bytes. Returns an encrypted `.bin` File plus its key material. */
export async function encryptFile(file) {
  const buf = await file.arrayBuffer();
  const mk = generateAesKeyBytes();
  const { iv, ciphertext } = await encryptBytes(mk, new Uint8Array(buf));
  const baseName = (file.name || 'file').replace(/\.[^./]+$/, '') || 'file';
  const encryptedFile = new File([ciphertext], `${baseName}.bin`, { type: 'application/octet-stream' });
  return {
    encryptedFile,
    mkB64: b64Encode(mk),
    mivB64: b64Encode(iv),
  };
}

/** Decrypt a previously encryptFile()'d blob back into its original bytes. */
export async function decryptFile(encryptedBlob, mkB64, mivB64, mime = 'application/octet-stream') {
  const buf = new Uint8Array(await encryptedBlob.arrayBuffer());
  const mk = b64Decode(mkB64);
  const iv = b64Decode(mivB64);
  const plaintext = await decryptBytes(mk, buf, iv);
  return new Blob([plaintext], { type: mime || 'application/octet-stream' });
}
