/**
 * Top-level encrypt/decrypt API used by the messenger store. Encodes the
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
  buildInlineKeyWraps,
  ingestInlineKeyWraps,
  pullAndConsumeKeyVault,
} from './session';
import { getConversationKeyCandidates } from './store';

export const E2E_VERSION = 1;
export const E2E_ALG = 'A256GCM';
/** Shown instead of ciphertext anywhere the app would otherwise leak it (previews, notifications, failed decrypts). */
export const LOCKED_PLACEHOLDER = '🔒 پیام رمزنگاری‌شده';

const MEDIA_TYPES = new Set(['photo', 'video', 'voice', 'audio', 'file']);

function looksLikeCiphertextBody(body) {
  const b = String(body || '').trim();
  if (!b || b === LOCKED_PLACEHOLDER) return false;
  if (/\s/.test(b)) return false;
  return b.length >= 32 && /^[A-Za-z0-9+/=]+$/.test(b);
}

async function senderDeviceIdOrThrow() {
  const deviceApi = await import('./device');
  let senderDeviceId = await deviceApi.getMyDeviceId();
  if (!senderDeviceId) {
    await deviceApi.ensureDevice({ waitForServer: false }).catch(() => {});
    senderDeviceId = await deviceApi.getMyDeviceId();
  }
  if (!senderDeviceId) throw new Error('missing-device-id');
  return senderDeviceId;
}

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

/** First send: wait briefly for peer wraps so the recipient can decrypt live. */
async function wrapsForOutgoing(conversationId, kid, keyBytes, allowMint) {
  const peeked = peekInlineKeyWraps(conversationId, kid);
  if (peeked?.wraps?.length) return peeked.wraps;
  scheduleInlineKeyWraps(conversationId, kid, keyBytes);
  if (!allowMint) return peeked?.wraps || [];
  try {
    const built = await Promise.race([
      buildInlineKeyWraps(conversationId, kid, keyBytes, { forceBundles: true }),
      new Promise((resolve) => setTimeout(() => resolve(null), 800)),
    ]);
    if (built?.wraps?.length) return built.wraps;
  } catch (e) { /* send ciphertext anyway */ }
  return peeked?.wraps || [];
}

export async function encryptOutgoingMessage(conversationId, type, fields = {}, options = {}) {
  const allowMint = options.allowMint !== false;
  const { keyBytes, kid } = await ensureConversationKey(conversationId, { allowMint });
  const senderDeviceId = await senderDeviceIdOrThrow();
  const payload = buildTextLikePayload(type, fields);
  const aad = messageAadBytes(conversationId, kid);
  // Local AES only. First send waits briefly for peer wraps so the recipient
  // can decrypt from the envelope instead of after a refresh.
  const { ivB64, ciphertextB64 } = await encryptJson(keyBytes, payload, aad);
  const wraps = await wrapsForOutgoing(conversationId, kid, keyBytes, allowMint);

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
  const { keyBytes, kid } = await ensureConversationKey(conversationId, { allowMint });
  const senderDeviceId = await senderDeviceIdOrThrow();
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
  const wraps = await wrapsForOutgoing(conversationId, kid, keyBytes, allowMint);
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

/** Shared messenger cryptography helpers. */
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

/** Bind a wire/list row to its chat so AAD + IndexedDB key lookup can succeed. */
export function withConversationId(message, conversationId) {
  if (!message || conversationId == null) return message;
  const cid = message.conversation_id != null ? message.conversation_id : conversationId;
  let out = message;
  if (message.conversation_id == null) out = { ...message, conversation_id: cid };
  if (out.reply_to && out.reply_to.conversation_id == null) {
    out = { ...out, reply_to: { ...out.reply_to, conversation_id: cid } };
  }
  return out;
}

/**
 * Decrypt an incoming (or server-echoed) encrypted message for display.
 * Never throws — falls back to a locked placeholder on failure.
 * Original ciphertext is kept on `_e2e_ciphertext` so a later key pull can retry.
 *
 * @param {object} message
 * @param {{ skipPull?: boolean, conversationId?: string|number }} [options]
 *   skipPull: caller already pulled packages. Still pulls if local keys are empty
 *   (refresh / new device must not stay locked because of a skipped fetch).
 */
export async function decryptIncomingMessage(message, options = {}) {
  if (!message) return message;
  message = withConversationId(message, options.conversationId);

  // Nested reply quotes — decrypt independently (may share conversation keys).
  let replyTo = message.reply_to;
  if (replyTo?.is_encrypted && !replyTo._e2e_decrypted) {
    replyTo = await decryptIncomingMessage({
      ...replyTo,
      conversation_id: replyTo.conversation_id || message.conversation_id,
    }, { skipPull: true, conversationId: message.conversation_id });
  }

  if (!message.is_encrypted) {
    return replyTo !== message.reply_to ? { ...message, reply_to: replyTo } : message;
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
    || (message.body && message.body !== LOCKED_PLACEHOLDER && looksLikeCiphertextBody(message.body)
      ? message.body
      : null)
  );
  // Own optimistic / hydrated plaintext: is_encrypted but no envelope yet.
  // Never rewrite readable text as «پیام رمزنگاری‌شده».
  if (!envelope || !cipherBody) {
    const plain = message.body && message.body !== LOCKED_PLACEHOLDER
      && !looksLikeCiphertextBody(message.body);
    if (plain) {
      const out = replyTo !== message.reply_to ? { ...message, reply_to: replyTo } : message;
      return {
        ...out,
        _e2e_decrypted: true,
        _e2e_locked: false,
        _decryptFailed: false,
      };
    }
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

  const conversationId = message.conversation_id ?? options.conversationId ?? null;
  if (conversationId == null) {
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

  const skipPull = options.skipPull === true;
  const lockedResult = () => ({
    ...message,
    reply_to: replyTo,
    body: LOCKED_PLACEHOLDER,
    _e2e_ciphertext: cipherBody,
    e2e: envelope,
    _decryptFailed: true,
    _e2e_locked: true,
    preview: LOCKED_PLACEHOLDER,
  });

  try {
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

    const ingestWraps = async () => {
      if (!Array.isArray(envelope.wraps) || !envelope.wraps.length) return false;
      return ingestInlineKeyWraps(conversationId, kid, envelope.wraps).catch(() => false);
    };

    const pullRemoteKeys = async () => {
      try {
        const { ensureDevice } = await import('./device');
        await ensureDevice({ waitForServer: false });
      } catch (e) {
        console.warn('[e2e] ensureDevice before key pull failed', e);
      }
      await pullAndConsumeKeyVault(conversationId, { force: true }).catch(() => 0);
      await pullAndConsumePackages(conversationId, { bypassCooldown: true }).catch(() => {});
      await ingestWraps();
      return getConversationKeyCandidates(conversationId, kid);
    };

    // Phase 1: local IndexedDB keys + inline wraps. Never wait on device
    // registration / vault HTTP — that is why refresh used to stay locked.
    await ingestWraps();
    let candidates = await getConversationKeyCandidates(conversationId, kid);
    let payload = candidates.length ? await tryDecrypt(candidates) : null;

    if (!payload && !skipPull) {
      candidates = await pullRemoteKeys();
      payload = candidates.length ? await tryDecrypt(candidates) : null;
    }
    if (!payload && !skipPull && Array.isArray(envelope.wraps) && envelope.wraps.length) {
      const ingested = await ingestWraps();
      if (ingested) {
        candidates = await getConversationKeyCandidates(conversationId, kid);
        payload = await tryDecrypt(candidates);
      }
    }
    if (!payload) {
      if (!skipPull) {
        console.warn('[e2e] decrypt failed for all candidate keys', {
          conversationId,
          kid,
          candidateCount: candidates.length,
          hasWraps: Array.isArray(envelope.wraps) && envelope.wraps.length > 0,
          err: lastErr,
        });
      }
      return lockedResult();
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

function isStillLockedEncrypted(message) {
  if (!message?.is_encrypted) return false;
  if (message._e2e_decrypted && !message._e2e_locked && !message._decryptFailed) {
    return message.body === LOCKED_PLACEHOLDER;
  }
  return true;
}

/** Decrypt an array of messages. Local IndexedDB keys first; network only for leftovers. */
export async function decryptMessages(messages, fallbackConversationId = null) {
  if (!Array.isArray(messages) || !messages.length) return messages;
  const stamped = messages.map((m) => withConversationId(m, fallbackConversationId));
  const convIds = new Set();
  stamped.forEach((m) => {
    if (m?.is_encrypted && m.conversation_id != null) convIds.add(String(m.conversation_id));
  });
  if (!convIds.size && fallbackConversationId != null) {
    convIds.add(String(fallbackConversationId));
  }
  const fallbackCid = fallbackConversationId != null
    ? fallbackConversationId
    : (convIds.size === 1 ? [...convIds][0] : null);

  let next = await Promise.all(stamped.map((m) => decryptIncomingMessage(
    withConversationId(m, fallbackCid),
    { skipPull: true, conversationId: fallbackCid },
  )));

  const locked = next.filter(isStillLockedEncrypted);
  if (!locked.length) return next;

  await Promise.all([...convIds].map(async (cid) => {
    await pullAndConsumeKeyVault(cid, { force: true }).catch(() => 0);
    await pullAndConsumePackages(cid, { bypassCooldown: true }).catch(() => {});
  }));

  next = await Promise.all(next.map((m) => {
    if (!isStillLockedEncrypted(m)) return m;
    return decryptIncomingMessage(
      withConversationId(m, fallbackCid),
      { skipPull: false, conversationId: fallbackCid },
    );
  }));
  return next;
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
