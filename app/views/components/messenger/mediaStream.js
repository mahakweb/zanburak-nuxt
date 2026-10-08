/**
 * Progressive + adaptive media streaming for messenger audio/video.
 * - Progressive MP4/WebM with early playback
 * - HTTP Range resume for interrupted downloads
 * - Adaptive buffering based on measured throughput
 * - HLS when meta.hls_url / stream.hls is available
 */

import config from '@/store/config';
import {
  getCachedBlobUrl,
  putCachedBlob,
  putPartialDownload,
  getPartialDownload,
  clearPartialDownload,
  markMediaDownloaded,
  isMediaDownloaded,
  requiresBlobPlayback,
  isEncryptedMediaMessage,
  isAuthMediaUrl,
} from './mediaCache';

const BASE_CHUNK = 256 * 1024;
const sessions = new Map();

function getAuthToken() {
  try {
    return JSON.parse(localStorage.getItem('token'));
  } catch (e) {
    return null;
  }
}

function resolveUrl(url) {
  if (!url) return '';
  const raw = String(url);
  if (/^https?:\/\//i.test(raw) || raw.startsWith('blob:') || raw.startsWith('data:')) return raw;
  const base = String(config.apiBaseUrl || '').replace(/\/$/, '');
  return `${base}/${raw.replace(/^\//, '')}`;
}

async function authHeaders(extra = {}) {
  const token = getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

function estimateFirstBufferBytes(total, throughputBps, { isVideo = false } = {}) {
  // Video needs a much larger first buffer so both tracks decode (and moov is more likely present).
  const minBytes = isVideo ? 1.5 * 1024 * 1024 : BASE_CHUNK * 2;
  const maxBytes = isVideo ? 4 * 1024 * 1024 : 2 * 1024 * 1024;
  if (throughputBps > 0 && total > 0) {
    const secs = isVideo ? 4 : 2;
    const target = Math.floor(throughputBps * secs);
    return Math.min(total, Math.max(minBytes, Math.min(target, maxBytes)));
  }
  if (total > 0) {
    // Prefer ~12% of file for video first paint, capped.
    const pct = isVideo ? Math.floor(total * 0.12) : Math.floor(total * 0.05);
    return Math.min(total, Math.max(minBytes, Math.min(pct || minBytes, maxBytes)));
  }
  return minBytes;
}

function networkHint() {
  try {
    const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) return { downlink: 0, saveData: false };
    return {
      downlink: Number(c.downlink) || 0, // Mbps
      saveData: !!c.saveData,
      effectiveType: c.effectiveType || '',
    };
  } catch (e) {
    return { downlink: 0, saveData: false };
  }
}

class ProgressiveSession {
  constructor(url, message, callbacks = {}) {
    this.url = url;
    this.resolved = resolveUrl(url);
    this.message = message;
    this.callbacks = callbacks;
    this.chunks = [];
    this.received = 0;
    this.total = 0;
    this.objectUrl = null;
    this.blob = null;
    this.aborted = false;
    this.buffering = false;
    this.complete = false;
    this.controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    this._refreshTimer = 0;
    this._persistTimer = 0;
    this._publishedPartial = false;
    this._externalAbort = null;
    this.encrypted = isEncryptedMediaMessage(message);
    this.mime = message?.meta?.mime || 'application/octet-stream';
    this.throughputBps = 0;
    this.startedAt = 0;
    this.mode = 'progressive'; // progressive | hls | signed
    this.isVideo = (message?.type === 'video')
      || String(message?.meta?.mime || '').startsWith('video/');
    this.isAudio = (message?.type === 'audio' || message?.type === 'voice')
      || String(message?.meta?.mime || '').startsWith('audio/');

    // Link manager AbortSignal → this session's controller.
    const ext = callbacks.externalSignal;
    if (ext) {
      this._externalAbort = () => this.abort({ persist: true });
      if (ext.aborted) this._externalAbort();
      else ext.addEventListener('abort', this._externalAbort, { once: true });
    }
  }

  setBuffering(v) {
    if (this.buffering === !!v) return;
    this.buffering = !!v;
    this.callbacks.onBuffering?.(this.buffering);
  }

  progressRatio() {
    if (this.total > 0) return Math.min(1, this.received / this.total);
    if (this.complete) return 1;
    return Math.min(0.9, this.received / (this.received + BASE_CHUNK * 4));
  }

  emitProgress() {
    this.callbacks.onProgress?.(this.progressRatio());
  }

  revokeUrl() {
    if (this.objectUrl && this.objectUrl.startsWith('blob:')) {
      try { URL.revokeObjectURL(this.objectUrl); } catch (e) { /* noop */ }
    }
    this.objectUrl = null;
  }

  buildBlob(mime) {
    const type = mime || this.mime || 'application/octet-stream';
    return new Blob(this.chunks, { type });
  }

  schedulePersistPartial() {
    if (this.encrypted || this.complete || this.aborted) return;
    if (this._persistTimer) return;
    this._persistTimer = setTimeout(async () => {
      this._persistTimer = 0;
      if (this.aborted || this.complete || !this.chunks.length) return;
      try {
        await putPartialDownload(this.url, {
          chunks: this.chunks,
          received: this.received,
          total: this.total,
          mime: this.mime,
        });
      } catch (e) { /* quota */ }
    }, 1500);
  }

  publishPartial(force = false) {
    if (this.aborted || this.encrypted) return;
    // Background cache while already playing via signed/HLS — don't touch the playable URL.
    if (this.mode === 'signed' || this.mode === 'hls') return;
    if (!this.chunks.length) return;
    // Critical: never thrash blob: URLs while video is decoding.
    // Replacing src mid-play often yields audio-only / black frames.
    if (this._publishedPartial && !force) return;
    if (!force && this._refreshTimer) return;
    const publish = () => {
      this._refreshTimer = 0;
      if (this.aborted || this.complete) return;
      if (this._publishedPartial) return;
      if (this.mode === 'signed' || this.mode === 'hls') return;
      const blob = this.buildBlob();
      const prev = this.objectUrl;
      this.objectUrl = URL.createObjectURL(blob);
      this._publishedPartial = true;
      this.callbacks.onReady?.({
        objectUrl: this.objectUrl,
        partial: true,
        mode: this.mode,
        received: this.received,
        total: this.total,
      });
      // Keep previous URL alive briefly so the element can switch, then revoke.
      if (prev && prev !== this.objectUrl) {
        setTimeout(() => {
          try { URL.revokeObjectURL(prev); } catch (e) { /* noop */ }
        }, 4000);
      }
    };
    if (force) {
      publish();
      return;
    }
    this._refreshTimer = setTimeout(publish, 80);
  }

  async start() {
    try {
      const cached = await getCachedBlobUrl(this.url);
      if (this.aborted) {
        this.callbacks.onAbort?.();
        return;
      }
      if (cached) {
        this.objectUrl = cached;
        this.complete = true;
        markMediaDownloaded(this.url);
        this.callbacks.onReady?.({ objectUrl: cached, partial: false, mode: this.mode });
        this.callbacks.onProgress?.(1);
        this.callbacks.onComplete?.({ objectUrl: cached, blob: null });
        this.setBuffering(false);
        return;
      }

      this.setBuffering(true);

      if (this.encrypted) {
        await this.downloadEncryptedFull();
        return;
      }

      // Native progressive via signed URL — browser Range-streams A+V correctly.
      // Blob-growing mid-play often produces audio-only for H.264 progressive MP4.
      // Same path for audio/voice so music starts before the full file is cached.
      if (this.callbacks.preferSigned !== false && (this.isVideo || this.isAudio)) {
        const messageId = this.message?.id || this.message?.meta?.media_id;
        if (messageId) {
          try {
            const signed = await fetchSignedMediaUrl(messageId, 'file');
            if (this.aborted) {
              this.callbacks.onAbort?.();
              return;
            }
            if (signed) {
              this.mode = 'signed';
              this.objectUrl = signed;
              this.setBuffering(false);
              this.callbacks.onReady?.({
                objectUrl: signed,
                partial: false,
                mode: 'signed',
                signed: true,
              });
              // Cache original in background for offline / next open.
              if (this.callbacks.backgroundCache !== false) {
                this.downloadStreaming(true).catch((err) => {
                  if (this.aborted) {
                    this.callbacks.onAbort?.();
                    return;
                  }
                  if (err?.name !== 'AbortError') {
                    this.callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
                  }
                });
              }
              return;
            }
          } catch (e) {
            if (this.aborted) {
              this.callbacks.onAbort?.();
              return;
            }
            // fall through to blob progressive
          }
        }
      }

      // Prefer HLS when server reports ready (viewer / quality selection).
      const hlsUrl = this.message?.meta?.hls_url;
      const hlsReady = this.message?.meta?.stream?.hls || this.message?.meta?.hls_status === 'ready';
      if (hlsUrl && hlsReady && this.callbacks.preferHls === true) {
        if (this.aborted) {
          this.callbacks.onAbort?.();
          return;
        }
        this.mode = 'hls';
        this.objectUrl = resolveUrl(hlsUrl);
        this.setBuffering(false);
        this.callbacks.onReady?.({
          objectUrl: this.objectUrl,
          partial: false,
          mode: 'hls',
          hls: true,
          qualities: this.message?.meta?.qualities || [],
        });
        if (this.callbacks.backgroundCache !== false) {
          this.downloadStreaming(true).catch(() => {});
        }
        return;
      }

      await this.downloadStreaming(isAuthMediaUrl(this.url) || requiresBlobPlayback(this.url, this.message));
    } catch (e) {
      if (this.aborted || e?.name === 'AbortError') {
        this.callbacks.onAbort?.();
        return;
      }
      this.setBuffering(false);
      this.callbacks.onError?.(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async downloadEncryptedFull() {
    const { fetchAuthenticatedMedia } = await import('@/crypto/messenger/mediaAuth');
    const result = await fetchAuthenticatedMedia(
      this.url,
      this.message,
      (r) => {
        this.callbacks.onProgress?.(Math.max(0, Math.min(1, Number(r) || 0)));
      },
      { signal: this.controller?.signal },
    );
    if (this.aborted) {
      this.callbacks.onAbort?.();
      return;
    }
    const blob = result?.blob || null;
    const objectUrl = result?.objectUrl || String(result);
    this.objectUrl = objectUrl;
    this.blob = blob;
    this.complete = true;
    if (blob instanceof Blob) {
      await putCachedBlob(this.url, blob);
      try {
        const { putMediaResponse } = await import('./mediaSegmentCache');
        await putMediaResponse(this.url, blob);
      } catch (e) { /* noop */ }
    }
    markMediaDownloaded(this.url);
    this.setBuffering(false);
    this.callbacks.onReady?.({ objectUrl, partial: false, mode: this.mode });
    this.callbacks.onProgress?.(1);
    this.callbacks.onComplete?.({ objectUrl, blob });
  }

  async downloadStreaming(withAuth = false) {
    // Resume interrupted download via Range when a partial exists.
    const partial = await getPartialDownload(this.url);
    let resumeFrom = 0;
    if (partial?.blob && partial.received > 0) {
      this.chunks = [partial.blob];
      this.received = partial.received;
      this.total = partial.total || 0;
      this.mime = partial.mime || this.mime;
      resumeFrom = partial.received;
      if (this.received >= BASE_CHUNK) {
        this.setBuffering(false);
        this.publishPartial(true);
      }
    }

    const headers = withAuth ? await authHeaders() : {};
    if (resumeFrom > 0) {
      headers.Range = `bytes=${resumeFrom}-`;
    }

    this.startedAt = performance.now?.() || Date.now();
    const res = await fetch(this.resolved, {
      headers,
      credentials: 'omit',
      signal: this.controller?.signal,
    });

    if (resumeFrom > 0 && res.status === 200) {
      // Server ignored Range — restart from scratch.
      this.chunks = [];
      this.received = 0;
      resumeFrom = 0;
    } else if (resumeFrom > 0 && res.status !== 206 && res.status !== 200) {
      throw new Error(`HTTP ${res.status}`);
    } else if (!res.ok && res.status !== 206) {
      throw new Error(`HTTP ${res.status}`);
    }

    const contentLength = Number(res.headers.get('content-length')) || 0;
    if (res.status === 206) {
      const cr = res.headers.get('content-range');
      const m = cr && /\/(\d+)\s*$/.exec(cr);
      this.total = m ? Number(m[1]) : (resumeFrom + contentLength);
    } else if (contentLength) {
      this.total = contentLength;
    }

    const mime = res.headers.get('content-type') || this.mime;
    this.mime = mime;

    if (!res.body) {
      const blob = await res.blob();
      if (resumeFrom > 0 && this.chunks.length) {
        await this.finishWithBlob(new Blob([...this.chunks, blob], { type: mime }));
      } else {
        await this.finishWithBlob(blob);
      }
      return;
    }

    const reader = res.body.getReader();
    let firstReady = this.objectUrl != null;
    const hint = networkHint();
    const hintBps = hint.downlink > 0 ? (hint.downlink * 125000) : 0; // Mbps → bytes/s
    const firstBytes = estimateFirstBufferBytes(
      this.total,
      hintBps || this.throughputBps,
      { isVideo: this.isVideo },
    );

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { done, value } = await reader.read();
      if (done) break;
      if (this.aborted) {
        try { await reader.cancel(); } catch (e) { /* noop */ }
        this.schedulePersistPartial();
        return;
      }
      this.chunks.push(value);
      this.received += value.byteLength || value.length || 0;
      const elapsed = ((performance.now?.() || Date.now()) - this.startedAt) / 1000;
      if (elapsed > 0.25) {
        this.throughputBps = this.received / elapsed;
      }
      this.emitProgress();
      this.schedulePersistPartial();

      // Video blob progressive: wait for a solid buffer before first paint.
      // Tiny partial MP4s often decode audio-only until more (or all) bytes arrive.
      if (!firstReady && this.received >= Math.min(firstBytes, this.total || firstBytes)) {
        firstReady = true;
        this.setBuffering(false);
        this.publishPartial(true);
      }
      // Do NOT refresh again until finishWithBlob — prevents audio-only black video.
    }

    if (this.aborted) {
      this.schedulePersistPartial();
      return;
    }
    const blob = this.buildBlob(mime);
    await this.finishWithBlob(blob);
  }

  async fetchRange(start, end) {
    if (this.encrypted) return null;
    const headers = await authHeaders({ Range: `bytes=${start}-${end}` });
    const res = await fetch(this.resolved, {
      headers,
      credentials: 'omit',
      signal: this.controller?.signal,
    });
    if (res.status !== 206 && res.status !== 200) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.arrayBuffer();
  }

  async finishWithBlob(blob) {
    if (this.aborted) {
      this.callbacks.onAbort?.();
      return;
    }
    this.blob = blob;
    this.complete = true;
    this.chunks = [];
    await clearPartialDownload(this.url);
    await putCachedBlob(this.url, blob);
    try {
      const { putMediaResponse } = await import('./mediaSegmentCache');
      await putMediaResponse(this.url, blob);
    } catch (e) { /* noop */ }
    markMediaDownloaded(this.url);
    this.setBuffering(false);
    this.callbacks.onProgress?.(1);

    // Playing via signed/HLS: only cache — do not replace the live media src.
    if (this.mode === 'signed' || this.mode === 'hls') {
      this.callbacks.onComplete?.({
        objectUrl: this.objectUrl,
        blob,
        cachedOnly: true,
        mode: this.mode,
      });
      return;
    }

    const prev = this.objectUrl;
    this.objectUrl = URL.createObjectURL(blob);
    this.callbacks.onReady?.({ objectUrl: this.objectUrl, partial: false, mode: this.mode });
    this.callbacks.onComplete?.({ objectUrl: this.objectUrl, blob });
    if (prev && prev !== this.objectUrl && String(prev).startsWith('blob:')) {
      setTimeout(() => {
        try { URL.revokeObjectURL(prev); } catch (e) { /* noop */ }
      }, 5000);
    }
  }

  abort({ persist = true } = {}) {
    if (this.aborted) return;
    this.aborted = true;
    try { this.controller?.abort(); } catch (e) { /* noop */ }
    if (this._refreshTimer) clearTimeout(this._refreshTimer);
    if (this._persistTimer) clearTimeout(this._persistTimer);
    if (this._externalAbort && this.callbacks.externalSignal) {
      try {
        this.callbacks.externalSignal.removeEventListener('abort', this._externalAbort);
      } catch (e) { /* noop */ }
    }
    if (persist && !this.complete && this.chunks.length) {
      putPartialDownload(this.url, {
        chunks: this.chunks,
        received: this.received,
        total: this.total,
        mime: this.mime,
      }).catch(() => {});
    }
    this.setBuffering(false);
    this.callbacks.onAbort?.();
  }

  destroy({ revoke = true, persist = true } = {}) {
    this.abort({ persist });
    if (revoke) this.revokeUrl();
    sessions.delete(this.url);
  }
}

export function openMediaStream(url, { message = null, ...callbacks } = {}) {
  if (!url) throw new Error('Missing media url');
  const existing = sessions.get(url);
  if (existing && !existing.aborted) {
    existing.callbacks = { ...existing.callbacks, ...callbacks };
    if (existing.objectUrl) {
      callbacks.onReady?.({
        objectUrl: existing.objectUrl,
        partial: !existing.complete,
        mode: existing.mode,
        hls: existing.mode === 'hls',
        qualities: message?.meta?.qualities || [],
      });
      callbacks.onProgress?.(existing.progressRatio());
      if (existing.complete) {
        callbacks.onComplete?.({ objectUrl: existing.objectUrl, blob: existing.blob });
      }
    }
    return existing;
  }
  const session = new ProgressiveSession(url, message, callbacks);
  sessions.set(url, session);
  session.start();
  return session;
}

export function closeMediaStream(url, { revoke = false, persist = true } = {}) {
  const s = sessions.get(url);
  if (!s) return;
  s.destroy({ revoke, persist });
}

export function getActiveMediaStream(url) {
  return sessions.get(url) || null;
}

export async function streamMedia(url, {
  message = null,
  onProgress = null,
  onBuffering = null,
  background = false,
  preferHls = false,
  signal = null,
  waitForComplete = false,
} = {}) {
  if (!url) throw new Error('Missing media url');

  // Prefer the unified manager so cancel/pause stay synchronized.
  try {
    const { startMediaDownload } = await import('./mediaManager');
    return startMediaDownload(url, {
      message,
      progressive: true,
      preferHls,
      backgroundCache: background,
      waitForComplete,
      onProgress,
      onBuffering,
      signal,
    });
  } catch (e) {
    // Fall through only if manager import fails.
  }

  if (isMediaDownloaded(url)) {
    const cached = await getCachedBlobUrl(url);
    if (cached) {
      onProgress?.(1);
      onBuffering?.(false);
      return { blobUrl: cached, remoteUrl: url, streaming: false, mode: 'progressive' };
    }
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    const settleAbort = () => {
      if (settled) return;
      settled = true;
      reject(new DOMException('Download cancelled', 'AbortError'));
    };
    if (signal?.aborted) {
      settleAbort();
      return;
    }
    openMediaStream(url, {
      message,
      onProgress,
      onBuffering,
      preferHls,
      backgroundCache: background,
      externalSignal: signal,
      onReady: ({ objectUrl, mode, hls, qualities }) => {
        if (settled || waitForComplete) return;
        settled = true;
        resolve({
          blobUrl: objectUrl,
          remoteUrl: url,
          streaming: true,
          mode: mode || 'progressive',
          hls: !!hls,
          qualities: qualities || [],
        });
      },
      onComplete: ({ objectUrl }) => {
        if (settled && !waitForComplete) return;
        if (settled) return;
        settled = true;
        resolve({
          blobUrl: objectUrl,
          remoteUrl: url,
          streaming: false,
          mode: 'progressive',
          complete: true,
        });
      },
      onAbort: settleAbort,
      onError: (err) => {
        if (settled) return;
        settled = true;
        reject(err);
      },
    });
  });
}

/**
 * Request a short-lived signed URL for Range-friendly CDN fetch.
 */
export async function fetchSignedMediaUrl(messageId, variant = 'file') {
  const token = getAuthToken();
  if (!token || !messageId) return null;
  const base = String(config.apiBaseUrl || '').replace(/\/$/, '');
  const res = await fetch(`${base}/messenger/media/${messageId}/signed-url`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ v: variant }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.url || null;
}

export { BASE_CHUNK as STREAM_CHUNK_SIZE };
