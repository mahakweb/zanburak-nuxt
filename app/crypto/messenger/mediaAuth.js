/**
 * Authenticated blob fetch for private messenger media.
 */
import config from '@/store/config';
import { getAuthTokenSync } from '@/utils/authToken';

function getAuthToken() {
  return getAuthTokenSync();
}

function getXsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function resolveUrl(url) {
  const raw = String(url || '');
  if (/^https?:\/\//i.test(raw) || raw.startsWith('blob:') || raw.startsWith('data:')) return raw;
  const base = String(config.apiBaseUrl || '').replace(/\/$/, '');
  return `${base}/${raw.replace(/^\//, '')}`;
}

function usesApiCredentials(url) {
  try {
    const apiOrigin = new URL(config.apiBaseUrl, window.location.href).origin;
    return new URL(url, window.location.href).origin === apiOrigin;
  } catch {
    return false;
  }
}

export function isMessengerMediaProxyUrl(url) {
  return typeof url === 'string' && url.includes('/messenger/media/');
}

async function readResponseBlob(res, onProgress, signal = null) {
  const total = Number(res.headers.get('content-length')) || 0;
  if (!res.body || !onProgress) {
    if (signal?.aborted) throw new DOMException('Download cancelled', 'AbortError');
    return res.blob();
  }
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (signal?.aborted) {
      try { await reader.cancel(); } catch (e) { /* noop */ }
      throw new DOMException('Download cancelled', 'AbortError');
    }
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total > 0) onProgress(Math.min(0.92, received / total));
    else onProgress(Math.min(0.85, received / (received + 256000)));
  }
  return new Blob(chunks);
}

/** Fetch a URL with the Authorization header attached, returning a raw Blob. */
export async function fetchAuthenticatedBlob(url, onProgress = null, options = {}) {
  const signal = options?.signal || (onProgress && typeof onProgress === 'object' ? onProgress.signal : null);
  const progressCb = typeof onProgress === 'function' ? onProgress : (options?.onProgress || null);
  const token = getAuthToken();
  const resolved = resolveUrl(url);
  if (resolved.startsWith('blob:')) {
    const res = await fetch(resolved, { signal });
    return res.blob();
  }
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const xsrfToken = getXsrfToken();
  if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
  const res = await fetch(resolved, {
    headers,
    credentials: usesApiCredentials(resolved) ? 'include' : 'omit',
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return readResponseBlob(res, progressCb, signal);
}

/**
 * Fetch media (optionally decrypt E2E) and return an object URL string.
 * Also attaches `.blob` / `.objectUrl` for callers that expect an object.
 * @param {object} [options]
 * @param {AbortSignal} [options.signal]
 */
export async function fetchAuthenticatedMedia(url, message = null, onProgress = null, options = {}) {
  const signal = options?.signal || null;
  if (signal?.aborted) throw new DOMException('Download cancelled', 'AbortError');
  if (onProgress) onProgress(0.02);
  let blob = await fetchAuthenticatedBlob(url, onProgress
    ? (r) => onProgress(Math.min(0.9, r))
    : null, { signal });

  if (signal?.aborted) throw new DOMException('Download cancelled', 'AbortError');

  if (message && (message.is_encrypted || message.meta?.encrypted) && message._mediaKey && message._mediaIv) {
    if (onProgress) onProgress(0.92);
    const { decryptFile } = await import('./e2e');
    blob = await decryptFile(
      blob,
      message._mediaKey,
      message._mediaIv,
      message.meta?.mime || 'application/octet-stream',
    );
  }

  if (signal?.aborted) throw new DOMException('Download cancelled', 'AbortError');
  if (onProgress) onProgress(1);
  const objectUrl = URL.createObjectURL(blob);
  // String primitive with extras — works as <img src> and as { objectUrl }.
  const result = Object.assign(String(objectUrl), { blob, objectUrl });
  return result;
}

export function mediaMessageUrl(messageId) {
  const base = String(config.apiBaseUrl || '').replace(/\/$/, '');
  return `${base}/messenger/media/${messageId}`;
}
