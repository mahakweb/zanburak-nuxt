/**
 * Local GIF favorites + sticker blob cache for the messenger panel.
 */

const GIF_DB = 'zanburak_messenger_gifs';
const GIF_DB_VERSION = 2;
const GIF_STORE = 'gifs';
const STICKER_STORE = 'stickers';
const GIF_META_KEY = 'messenger-saved-gifs-meta';
const STICKER_RECENT_KEY = 'messenger-recent-stickers';
const MAX_GIFS = 200;
const MAX_STICKER_RECENT = 48;
export const GIF_PAGE_SIZE = 18;

let gifDbPromise = null;

function openGifDb() {
  if (gifDbPromise) return gifDbPromise;
  gifDbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    const req = indexedDB.open(GIF_DB, GIF_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(GIF_STORE)) {
        db.createObjectStore(GIF_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STICKER_STORE)) {
        db.createObjectStore(STICKER_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
  return gifDbPromise;
}

function readGifMeta() {
  try {
    const raw = localStorage.getItem(GIF_META_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGifMeta(list) {
  try {
    localStorage.setItem(GIF_META_KEY, JSON.stringify(list.slice(0, MAX_GIFS)));
  } catch {
    /* quota */
  }
}

function newId(prefix = 'gif') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function isVideoMime(mime, name = '') {
  const m = String(mime || '').toLowerCase();
  const n = String(name || '').toLowerCase();
  if (m.startsWith('video/')) return true;
  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(n)) return true;
  return false;
}

export function isAnimationMessage(message) {
  if (!message) return false;
  const meta = message.meta || {};
  if (meta.sticker) return false;
  if (meta.animation || meta.silent) return true;
  const mime = String(meta.mime || '').toLowerCase();
  const name = String(meta.name || meta.file_name || '').toLowerCase();
  if (mime === 'image/gif' || mime.includes('gif')) return true;
  if (/\.gif(\?|#|$)/i.test(name)) return true;
  return false;
}

export function isStickerMessage(message) {
  return !!(message?.meta?.sticker);
}

export function listSavedGifMeta() {
  return readGifMeta();
}

export function isGifSaved(sourceKey) {
  if (!sourceKey) return false;
  return readGifMeta().some((g) => g.sourceKey === String(sourceKey) || g.id === String(sourceKey));
}

export async function getGifBlob(id) {
  const db = await openGifDb();
  if (!db || !id) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(GIF_STORE, 'readonly');
      const req = tx.objectStore(GIF_STORE).get(String(id));
      req.onsuccess = () => {
        const row = req.result;
        resolve(row?.blob instanceof Blob ? row.blob : null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/** Hydrate a slice of GIF metas with blob object URLs (for infinite scroll). */
export async function hydrateGifPreviews(items) {
  const list = Array.isArray(items) ? items : [];
  const out = [];
  for (const item of list) {
    // eslint-disable-next-line no-await-in-loop
    const blob = await getGifBlob(item.id);
    const mime = item.mime || blob?.type || 'image/gif';
    out.push({
      ...item,
      mime,
      isVideo: isVideoMime(mime, item.name),
      previewUrl: blob ? URL.createObjectURL(blob) : (item.thumbUrl || null),
      loaded: !!blob,
      _blob: blob || null,
    });
  }
  return out;
}

async function putGifBlob(id, blob) {
  const db = await openGifDb();
  if (!db || !(blob instanceof Blob)) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(GIF_STORE, 'readwrite');
      tx.objectStore(GIF_STORE).put({ id: String(id), blob, savedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

async function deleteGifBlob(id) {
  const db = await openGifDb();
  if (!db || !id) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(GIF_STORE, 'readwrite');
      tx.objectStore(GIF_STORE).delete(String(id));
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function addGifToLibrary({
  blob,
  mime = null,
  width = null,
  height = null,
  sourceKey = null,
  thumbUrl = null,
  name = null,
} = {}) {
  if (!(blob instanceof Blob) || blob.size < 1) {
    throw new Error('Invalid GIF blob');
  }
  const key = sourceKey ? String(sourceKey) : null;
  if (key && isGifSaved(key)) {
    const existing = readGifMeta().find((g) => g.sourceKey === key);
    return { id: existing?.id || key, added: false };
  }

  const resolvedMime = mime || blob.type || 'image/gif';
  const id = newId('gif');
  const ok = await putGifBlob(id, blob);
  if (!ok) throw new Error('Failed to store GIF');

  const meta = {
    id,
    sourceKey: key,
    mime: resolvedMime,
    width: width != null ? Number(width) : null,
    height: height != null ? Number(height) : null,
    name: name || `gif-${id}.${isVideoMime(resolvedMime) ? 'mp4' : 'gif'}`,
    thumbUrl: thumbUrl || null,
    savedAt: Date.now(),
  };
  writeGifMeta([meta, ...readGifMeta().filter((g) => g.id !== id)]);
  return { id, added: true };
}

export async function removeGifFromLibrary(id) {
  if (!id) return;
  writeGifMeta(readGifMeta().filter((g) => g.id !== String(id)));
  await deleteGifBlob(id);
}

/* ---------- sticker blob cache (host/local) ---------- */

export async function getCachedStickerBlob(id) {
  const db = await openGifDb();
  if (!db || !id) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STICKER_STORE, 'readonly');
      const req = tx.objectStore(STICKER_STORE).get(String(id));
      req.onsuccess = () => {
        const row = req.result;
        resolve(row?.blob instanceof Blob ? row.blob : null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function putCachedStickerBlob(id, blob) {
  const db = await openGifDb();
  if (!db || !id || !(blob instanceof Blob)) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STICKER_STORE, 'readwrite');
      tx.objectStore(STICKER_STORE).put({ id: String(id), blob, savedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export function listRecentStickers() {
  try {
    const raw = localStorage.getItem(STICKER_RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushRecentSticker(sticker) {
  if (!sticker?.id) return;
  const entry = {
    id: String(sticker.id),
    packId: sticker.packId || null,
    emoji: sticker.emoji || null,
    kind: sticker.kind || 'emoji',
    src: sticker.src || null,
    mediaId: sticker.mediaId || sticker.media_id || null,
    width: sticker.width || null,
    height: sticker.height || null,
  };
  const next = [entry, ...listRecentStickers().filter((s) => s.id !== entry.id)].slice(0, MAX_STICKER_RECENT);
  try {
    localStorage.setItem(STICKER_RECENT_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}

/** Render a single emoji as a PNG sticker blob (Telegram-like send). */
export function emojiToStickerBlob(emoji, size = 512) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas unavailable'));
        return;
      }
      ctx.clearRect(0, 0, size, size);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${Math.floor(size * 0.78)}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
      ctx.fillText(String(emoji || ''), size / 2, size / 2 + size * 0.04);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to encode sticker'));
      }, 'image/png');
    } catch (e) {
      reject(e);
    }
  });
}

/** Resolve sticker display src: cache → image/remote → emoji render fallback. */
export async function resolveStickerDisplaySrc(stickerOrMessage) {
  const meta = stickerOrMessage?.meta || stickerOrMessage || {};
  const id = meta.sticker_id || meta.id || stickerOrMessage?.id;
  const emoji = meta.sticker_emoji || meta.emoji;
  const remote = meta.url || meta.local_url || null;
  const src = meta.src || null;
  const hasImageAsset = !!(remote || (src && (String(src).startsWith('data:') || String(src).startsWith('blob:') || String(src).startsWith('http'))));
  const kind = meta.sticker_kind || meta.kind
    || (hasImageAsset ? 'image' : (emoji ? 'emoji' : 'image'));

  if (id) {
    const cached = await getCachedStickerBlob(id);
    if (cached) return { url: URL.createObjectURL(cached), fromCache: true, blob: cached };
  }

  if (kind === 'image' && src) {
    if (String(src).startsWith('data:') || String(src).startsWith('blob:')) {
      return { url: src, fromCache: false, blob: null };
    }
    if (String(src).startsWith('http')) {
      return { url: src, fromCache: false, blob: null, needsDownload: false };
    }
  }

  // Prefer uploaded/remote media whenever present (never replace PNG with ⭐).
  if (remote) {
    return { url: remote, fromCache: false, blob: null, needsDownload: true };
  }

  if (emoji) {
    try {
      const blob = await emojiToStickerBlob(emoji, 512);
      if (id) await putCachedStickerBlob(id, blob);
      return { url: URL.createObjectURL(blob), fromCache: false, blob };
    } catch {
      /* fall through */
    }
  }

  return { url: null, fromCache: false, blob: null };
}

export function deleteLastGrapheme(text) {
  const s = String(text || '');
  if (!s) return '';
  try {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      const parts = [...seg.segment(s)].map((p) => p.segment);
      parts.pop();
      return parts.join('');
    }
  } catch {
    /* fall through */
  }
  const chars = [...s];
  chars.pop();
  return chars.join('');
}
