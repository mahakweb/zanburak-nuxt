/**
 * Persist decrypted sidebar last-message previews across refresh.
 * Decrypt can lag (device/packages); without this the list flashes
 * «پیام رمزنگاری‌شده» / ciphertext until keys arrive.
 */

import { LOCKED_PLACEHOLDER } from '@/crypto/messenger';

const PREVIEW_CACHE_KEY = 'zanburak_messenger_sidebar_preview_v1';

function looksLikeCiphertextBody(body) {
  const b = String(body || '').trim();
  if (!b || b === LOCKED_PLACEHOLDER) return false;
  return b.length >= 24 && /^[A-Za-z0-9+/=\s]+$/.test(b);
}

function isMediaType(type) {
  return ['photo', 'video', 'voice', 'audio', 'file', 'location', 'system'].includes(String(type || ''));
}

function sameMessageId(a, b) {
  if (a == null || b == null) return false;
  if (a === b) return true;
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb) && na === nb) return true;
  return String(a) === String(b);
}

function cipherFingerprint(message) {
  if (!message) return null;
  const raw = message._e2e_ciphertext
    || (looksLikeCiphertextBody(message.body) ? message.body : null);
  if (!raw) return null;
  return String(raw).replace(/\s+/g, '').slice(0, 80);
}

export function readSidebarPreviewCache() {
  try {
    const raw = localStorage.getItem(PREVIEW_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeSidebarPreviewCache(map) {
  try {
    localStorage.setItem(PREVIEW_CACHE_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
}

export function isSidebarPreviewLocked(message) {
  if (!message) return false;
  if (isMediaType(message.type)) {
    // Media rows show type labels — only "locked" if caption is still ciphertext.
    return !!(message.body && looksLikeCiphertextBody(message.body));
  }
  if (message._e2e_locked || message._decryptFailed) return true;
  if (message.body === LOCKED_PLACEHOLDER) return true;
  if (message.is_encrypted && !message._e2e_decrypted) return true;
  if (message.is_encrypted && looksLikeCiphertextBody(message.body)) return true;
  return false;
}

/** Save a good plaintext/media preview for this chat. */
export function cacheSidebarPreview(conversationId, message) {
  if (conversationId == null || !message) return;
  if (isSidebarPreviewLocked(message) && !isMediaType(message.type)) return;
  if (message.is_encrypted && !message._e2e_decrypted && !isMediaType(message.type)) return;
  if (looksLikeCiphertextBody(message.body) && !isMediaType(message.type)) return;

  const map = readSidebarPreviewCache();
  map[String(conversationId)] = {
    id: message.id ?? null,
    body: message.body || '',
    type: message.type || 'text',
    is_encrypted: !!message.is_encrypted,
    _e2e_decrypted: true,
    _e2e_locked: false,
    _decryptFailed: false,
    cipher: cipherFingerprint(message),
    meta: message.meta ? {
      name: message.meta.name,
      album_id: message.meta.album_id,
      mime: message.meta.mime,
      sticker: !!message.meta.sticker,
      sticker_emoji: message.meta.sticker_emoji || null,
      sticker_id: message.meta.sticker_id || null,
      animation: !!(message.meta.animation || message.meta.silent),
      silent: !!message.meta.silent,
    } : null,
    created_at: message.created_at || null,
    at: Date.now(),
  };

  const keys = Object.keys(map);
  if (keys.length > 300) {
    keys.sort((a, b) => (map[a].at || 0) - (map[b].at || 0))
      .slice(0, keys.length - 250)
      .forEach((k) => { delete map[k]; });
  }
  writeSidebarPreviewCache(map);
}

/** Drop cached snippet when history is cleared or the tip message is deleted. */
export function clearSidebarPreview(conversationId) {
  if (conversationId == null) return;
  const map = readSidebarPreviewCache();
  const key = String(conversationId);
  if (!(key in map)) return;
  delete map[key];
  writeSidebarPreviewCache(map);
}

/**
 * If `message` is still locked/ciphertext, overlay the last known plaintext
 * when the cache matches by message id or ciphertext fingerprint.
 */
export function applyCachedSidebarPreview(conversationId, message) {
  if (!message) return message;
  const needsHelp = isSidebarPreviewLocked(message)
    || (message.is_encrypted && !message._e2e_decrypted && !isMediaType(message.type));
  if (!needsHelp) return message;

  const cached = readSidebarPreviewCache()[String(conversationId)];
  if (!cached) return message;

  const sameId = cached.id != null && message.id != null && sameMessageId(cached.id, message.id);
  const fp = cipherFingerprint(message);
  const sameCipher = !!(cached.cipher && fp && cached.cipher === fp);
  // Same chat tip we already unlocked, even if server id drifted (hot → durable).
  const sameTip = !!(
    cached.created_at
    && message.created_at
    && Math.abs(Date.parse(cached.created_at) - Date.parse(message.created_at)) < 3000
    && cached.type === (message.type || 'text')
  );

  if (!sameId && !sameCipher && !sameTip) return message;

  return {
    ...message,
    body: cached.body,
    type: cached.type || message.type,
    meta: cached.meta ? { ...(message.meta || {}), ...cached.meta } : message.meta,
    is_encrypted: message.is_encrypted !== false,
    _e2e_decrypted: true,
    _e2e_locked: false,
    _decryptFailed: false,
    _e2e_ciphertext: message._e2e_ciphertext
      || (looksLikeCiphertextBody(message.body) ? message.body : null)
      || null,
  };
}

/**
 * UI fallback for sidebar snippet when the store row is still locked.
 * Returns null when cache cannot help.
 */
export function cachedSidebarSnippet(conversationId, message) {
  const applied = applyCachedSidebarPreview(conversationId, message);
  if (!applied || isSidebarPreviewLocked(applied)) return null;
  if (isMediaType(applied.type) && (!applied.body || applied.body === LOCKED_PLACEHOLDER)) {
    return { type: applied.type, body: '', meta: applied.meta };
  }
  return {
    type: applied.type || 'text',
    body: applied.body || '',
    meta: applied.meta,
  };
}
