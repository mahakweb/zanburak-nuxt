/**
 * Background media download queue with resume support.
 * All jobs go through mediaManager so Stop aborts the real network task.
 */

import { isMediaDownloaded, getCachedBlobUrl } from './mediaCache';
import {
  startMediaDownload,
  getMediaTaskState,
} from './mediaManager';

const queue = [];
const inflight = new Map(); // url -> Promise
let pumping = false;
const MAX_CONCURRENT = 2;
let active = 0;

const listeners = new Set();

function emit(event) {
  listeners.forEach((fn) => {
    try { fn(event); } catch (e) { /* noop */ }
  });
}

export function subscribeBackgroundDownloads(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Enqueue a background download. Returns immediately; progress via subscribe.
 */
export function enqueueBackgroundDownload(url, {
  message = null,
  priority = 0,
  progressive = true,
} = {}) {
  if (!url || isMediaDownloaded(url)) {
    return Promise.resolve({ skipped: true });
  }
  if (inflight.has(url)) return inflight.get(url);

  const state = getMediaTaskState(url);
  if (state.downloading || state.complete) {
    if (state.complete) return Promise.resolve({ skipped: true, complete: true });
  }

  const job = { url, message, priority, progressive, resolve: null, reject: null };
  const promise = new Promise((resolve, reject) => {
    job.resolve = resolve;
    job.reject = reject;
  });
  inflight.set(url, promise);
  queue.push(job);
  queue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  emit({ type: 'queued', url });
  pump();
  return promise;
}

async function pump() {
  if (pumping) return;
  pumping = true;
  try {
    while (queue.length && active < MAX_CONCURRENT) {
      const job = queue.shift();
      if (!job) break;
      active += 1;
      runJob(job).finally(() => {
        active -= 1;
        pump();
      });
    }
  } finally {
    pumping = false;
  }
}

async function runJob(job) {
  const { url, message, progressive } = job;
  emit({ type: 'start', url });
  try {
    const cached = await getCachedBlobUrl(url);
    if (cached) {
      emit({ type: 'complete', url, blobUrl: cached });
      job.resolve?.({ blobUrl: cached, remoteUrl: url, streaming: false, complete: true });
      return;
    }
    const res = await startMediaDownload(url, {
      message,
      progressive,
      backgroundCache: true,
      waitForComplete: true,
      onProgress: (r) => emit({ type: 'progress', url, ratio: r }),
      onBuffering: (b) => emit({ type: 'buffering', url, buffering: b }),
    });
    emit({ type: 'complete', url, blobUrl: res.blobUrl });
    job.resolve?.(res);
  } catch (e) {
    if (e?.name === 'AbortError') {
      emit({ type: 'cancelled', url });
      job.resolve?.({ cancelled: true });
      return;
    }
    emit({ type: 'error', url, error: e });
    job.reject?.(e);
  } finally {
    inflight.delete(url);
  }
}

/**
 * Remove from background queue and abort the live progressive session.
 * Does NOT call mediaManager (avoids recursion) — prefer cancelMediaDownload from UI.
 */
export function cancelBackgroundDownload(url) {
  if (!url) return;
  const idx = queue.findIndex((j) => j.url === url);
  if (idx >= 0) {
    const [job] = queue.splice(idx, 1);
    inflight.delete(url);
    job.resolve?.({ cancelled: true });
    emit({ type: 'cancelled', url });
  } else if (inflight.has(url)) {
    inflight.delete(url);
    emit({ type: 'cancelled', url });
  }
  // Abort stream session if manager hasn't already.
  import('./mediaStream').then(({ closeMediaStream }) => {
    closeMediaStream(url, { persist: true });
  }).catch(() => {});
}

export function getBackgroundQueueSize() {
  return queue.length + active;
}
