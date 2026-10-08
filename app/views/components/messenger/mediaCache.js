/**
 * Local media cache with partial-download resume support.
 * Stores plaintext blobs (never E2E ciphertext) in IndexedDB.
 */

const DB_NAME = 'zanburak_messenger_media';
const DB_VERSION = 2;
const STORE = 'media';
const PARTIAL_STORE = 'partials';
const FLAG_PREFIX = 'zb_msg_media_dl:';
const POSTER_PREFIX = 'zb_poster:';

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(PARTIAL_STORE)) {
        db.createObjectStore(PARTIAL_STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
  return dbPromise;
}

function flagKey(url) {
  return FLAG_PREFIX + String(url || '');
}

export function isEncryptedMediaMessage(message) {
  return !!(message && (message.is_encrypted || message.meta?.encrypted));
}

export function isAuthMediaUrl(url) {
  return typeof url === 'string' && url.includes('/messenger/media/');
}

/** True when this URL must never be used raw as <img>/<video> src. */
export function requiresBlobPlayback(url, message = null) {
  return isAuthMediaUrl(url) || isEncryptedMediaMessage(message);
}

export function isMediaDownloaded(url) {
  if (!url) return false;
  try {
    return localStorage.getItem(flagKey(url)) === '1';
  } catch (e) {
    return false;
  }
}

export function markMediaDownloaded(url) {
  if (!url) return;
  try {
    localStorage.setItem(flagKey(url), '1');
  } catch (e) { /* quota */ }
}

export async function getCachedBlob(url) {
  if (!url) return null;
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(url);
      req.onsuccess = () => {
        const row = req.result;
        resolve(row?.blob instanceof Blob ? row.blob : null);
      };
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

export async function getCachedBlobUrl(url) {
  const blob = await getCachedBlob(url);
  return blob ? URL.createObjectURL(blob) : null;
}

export async function putCachedBlob(url, blob) {
  const db = await openDb();
  if (!db || !(blob instanceof Blob)) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction([STORE, PARTIAL_STORE], 'readwrite');
      tx.objectStore(STORE).put({ key: url, blob, savedAt: Date.now(), size: blob.size });
      try { tx.objectStore(PARTIAL_STORE).delete(url); } catch (e) { /* noop */ }
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
}

function posterKey(url) {
  return POSTER_PREFIX + String(url || '');
}

/** Cache a generated video-frame poster (JPEG/WebP blob) keyed by media URL. */
export async function putCachedPoster(url, blob) {
  if (!url || !(blob instanceof Blob)) return false;
  return putCachedBlob(posterKey(url), blob);
}

export async function getCachedPoster(url) {
  if (!url) return null;
  return getCachedBlob(posterKey(url));
}

export async function getCachedPosterUrl(url) {
  const blob = await getCachedPoster(url);
  return blob ? URL.createObjectURL(blob) : null;
}

/**
 * Persist incomplete download for resume (Range: bytes=received-).
 * @param {{ chunks: Blob[], received: number, total: number, mime: string }} partial
 */
export async function putPartialDownload(url, partial) {
  const db = await openDb();
  if (!db || !url || !partial) return false;
  const blob = partial.chunks instanceof Blob
    ? partial.chunks
    : new Blob(partial.chunks || [], { type: partial.mime || 'application/octet-stream' });
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PARTIAL_STORE, 'readwrite');
      tx.objectStore(PARTIAL_STORE).put({
        key: url,
        blob,
        received: partial.received || blob.size,
        total: partial.total || 0,
        mime: partial.mime || blob.type,
        savedAt: Date.now(),
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
}

export async function getPartialDownload(url) {
  if (!url) return null;
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PARTIAL_STORE, 'readonly');
      const req = tx.objectStore(PARTIAL_STORE).get(url);
      req.onsuccess = () => {
        const row = req.result;
        if (row?.blob instanceof Blob && row.received > 0) {
          resolve({
            blob: row.blob,
            received: row.received,
            total: row.total || 0,
            mime: row.mime || row.blob.type,
          });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

export async function clearPartialDownload(url) {
  const db = await openDb();
  if (!db || !url) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PARTIAL_STORE, 'readwrite');
      tx.objectStore(PARTIAL_STORE).delete(url);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch (e) {
      resolve();
    }
  });
}

/**
 * Download media for in-place viewing.
 * Routes through mediaManager so AbortController cancel/pause/resume stay in sync.
 * Prefer progressive streaming when `progressive: true` (audio/video).
 */
export async function downloadMedia(url, {
  onProgress,
  onBuffering,
  message = null,
  progressive = false,
  background = false,
  signal = null,
  preferHls = false,
  preferSigned = true,
  waitForComplete = false,
} = {}) {
  if (!url) throw new Error('Missing media url');

  const existing = await getCachedBlobUrl(url);
  if (existing) {
    markMediaDownloaded(url);
    return { blobUrl: existing, remoteUrl: url, streaming: false, mode: 'cache', complete: true };
  }

  const { startMediaDownload } = await import('./mediaManager');
  try {
    return await startMediaDownload(url, {
      message,
      progressive: progressive && !isEncryptedMediaMessage(message),
      preferHls,
      preferSigned,
      backgroundCache: background !== false,
      waitForComplete,
      onProgress,
      onBuffering,
      signal,
    });
  } catch (e) {
    if (e?.name === 'AbortError') throw e;
    const status = Number(/HTTP (\d+)/.exec(String(e?.message || ''))?.[1]);
    const missing = status === 404 || status === 410;
    const needsAuth = requiresBlobPlayback(url, message);
    if (needsAuth || missing) throw e;
    // Public CDN soft-fallback (legacy): mark and return remote.
    markMediaDownloaded(url);
    return { blobUrl: null, remoteUrl: url, streaming: false };
  }
}

/** Sender already has the file locally — mark downloaded + optionally cache. */
export async function seedLocalMedia(url, blobOrFile) {
  if (!url) return;
  markMediaDownloaded(url);
  if (blobOrFile instanceof Blob) {
    await putCachedBlob(url, blobOrFile);
  }
}

export async function saveMediaToDevice(url, fileName = 'media', message = null) {
  if (!url) return false;
  const { blobUrl, remoteUrl } = await downloadMedia(url, { message });
  const href = blobUrl || (requiresBlobPlayback(url, message) ? null : remoteUrl);
  if (!href) return false;
  const a = document.createElement('a');
  a.href = href;
  a.download = fileName || 'media';
  a.rel = 'noopener';
  if (!blobUrl) a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}
