/**
 * Unified messenger media manager.
 *
 * Single source of truth for download / stream / cache / readiness state.
 * Every network path is AbortController-backed and generation-guarded so
 * Stop never leaves a zombie download applying results after cancel.
 *
 * States (download): idle | downloading | paused | complete | cancelled | error
 * Playability is orthogonal: playSrc may be set while still downloading.
 */

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
} from './mediaCache';
import { putMediaResponse, getMediaResponse } from './mediaSegmentCache';

/** @typedef {'idle'|'downloading'|'paused'|'complete'|'cancelled'|'error'} MediaDlState */

const tasks = new Map(); // url -> MediaTask
const listeners = new Set();

function snap(task) {
  if (!task) {
    return {
      url: null,
      state: 'idle',
      progress: 0,
      percent: 0,
      buffering: false,
      playSrc: null,
      mode: null,
      complete: false,
      playable: false,
      paused: false,
      downloading: false,
      cancelled: false,
      error: null,
      generation: 0,
    };
  }
  const downloading = task.state === 'downloading';
  const playable = !!(task.playSrc && (task.complete || task.partialReady || task.state === 'complete'));
  return {
    url: task.url,
    state: task.state,
    progress: task.progress,
    percent: Math.max(0, Math.min(99, Math.round((task.progress || 0) * 100))),
    buffering: task.buffering,
    playSrc: task.playSrc,
    mode: task.mode,
    complete: task.complete,
    playable: playable || task.complete,
    paused: task.state === 'paused',
    downloading,
    cancelled: task.state === 'cancelled',
    error: task.error,
    generation: task.generation,
    messageId: task.message?.id ?? null,
  };
}

function emit(task) {
  const s = snap(task);
  listeners.forEach((fn) => {
    try { fn(s); } catch (e) { /* noop */ }
  });
  task?.urlListeners?.forEach((fn) => {
    try { fn(s); } catch (e) { /* noop */ }
  });
}

function ensureTask(url, message = null) {
  let task = tasks.get(url);
  if (!task) {
    task = {
      url,
      message,
      state: /** @type {MediaDlState} */ ('idle'),
      progress: 0,
      buffering: false,
      playSrc: null,
      mode: null,
      complete: false,
      partialReady: false,
      paused: false,
      error: null,
      generation: 0,
      controller: null,
      session: null,
      hls: null,
      urlListeners: new Set(),
      readyWaiters: [],
      completeWaiters: [],
      options: {},
    };
    tasks.set(url, task);
  } else if (message) {
    task.message = message;
  }
  return task;
}

function settleReady(task, result) {
  const waiters = task.readyWaiters.splice(0);
  waiters.forEach(({ resolve }) => {
    try { resolve(result); } catch (e) { /* noop */ }
  });
}

function settleComplete(task, result) {
  const waiters = task.completeWaiters.splice(0);
  waiters.forEach(({ resolve }) => {
    try { resolve(result); } catch (e) { /* noop */ }
  });
}

function rejectAll(task, err) {
  const ready = task.readyWaiters.splice(0);
  const complete = task.completeWaiters.splice(0);
  [...ready, ...complete].forEach(({ reject }) => {
    try { reject(err); } catch (e) { /* noop */ }
  });
}

function isAbortError(err) {
  return !!(err && (err.name === 'AbortError' || err.code === DOMException?.ABORT_ERR));
}

export function subscribeMediaManager(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function subscribeMediaTask(url, fn) {
  if (!url || typeof fn !== 'function') return () => {};
  const task = ensureTask(url);
  task.urlListeners.add(fn);
  fn(snap(task));
  return () => task.urlListeners.delete(fn);
}

export function getMediaTaskState(url) {
  return snap(url ? tasks.get(url) : null);
}

export function isMediaTaskDownloading(url) {
  const t = url ? tasks.get(url) : null;
  return t?.state === 'downloading';
}

/**
 * Hard-cancel: abort network, drop queue affiliation, invalidate generation.
 * Partial bytes are persisted for resume unless persist=false.
 */
export function cancelMediaDownload(url, { persist = true } = {}) {
  if (!url) return;
  const task = tasks.get(url);
  if (!task) {
    // Still kill any orphan progressive session / background job.
    import('./mediaStream').then(({ closeMediaStream }) => {
      closeMediaStream(url, { persist, revoke: false });
    }).catch(() => {});
    import('./mediaBackground').then(({ cancelBackgroundDownload }) => {
      cancelBackgroundDownload(url);
    }).catch(() => {});
    return;
  }

  const gen = task.generation;
  task.generation += 1;
  task.state = 'cancelled';
  task.buffering = false;
  task.paused = false;
  task.error = null;

  try { task.controller?.abort(); } catch (e) { /* noop */ }
  task.controller = null;

  if (task.hls) {
    try { task.hls.destroy(); } catch (e) { /* noop */ }
    task.hls = null;
  }

  import('./mediaStream').then(({ closeMediaStream }) => {
    closeMediaStream(url, { persist, revoke: false });
  }).catch(() => {});

  import('./mediaBackground').then(({ cancelBackgroundDownload }) => {
    cancelBackgroundDownload(url);
  }).catch(() => {});

  const err = new DOMException('Download cancelled', 'AbortError');
  rejectAll(task, err);

  // If generation moved again, skip emit ownership — still emit cancelled once.
  if (task.generation === gen + 1) {
    emit(task);
  } else {
    emit(task);
  }
}

/** Pause download (persist partial, abort network). Resume via resumeMediaDownload. */
export function pauseMediaDownload(url) {
  if (!url) return;
  const task = tasks.get(url);
  if (!task || task.state !== 'downloading') return;

  task.generation += 1;
  task.state = 'paused';
  task.paused = true;
  task.buffering = false;
  try { task.controller?.abort(); } catch (e) { /* noop */ }
  task.controller = null;

  import('./mediaStream').then(({ closeMediaStream }) => {
    closeMediaStream(url, { persist: true, revoke: false });
  }).catch(() => {});

  const err = new DOMException('Download paused', 'AbortError');
  // Ready waiters that haven't got a playSrc yet get rejected; keep playSrc if any.
  if (!task.playSrc) rejectAll(task, err);
  else {
    // Complete waiters stay — resume will finish.
    const ready = task.readyWaiters.splice(0);
    ready.forEach(({ resolve }) => {
      try {
        resolve({
          blobUrl: task.playSrc,
          remoteUrl: url,
          streaming: true,
          mode: task.mode,
          paused: true,
        });
      } catch (e) { /* noop */ }
    });
  }
  emit(task);
}

export function resumeMediaDownload(url, options = {}) {
  if (!url) return Promise.reject(new Error('Missing media url'));
  const task = tasks.get(url);
  const message = options.message || task?.message || null;
  return startMediaDownload(url, {
    ...task?.options,
    ...options,
    message,
    resume: true,
  });
}

/**
 * Start or join a download/stream task.
 * Resolves when media becomes playable (partial OK for progressive).
 * Use waitMediaComplete() if you need the full cache.
 */
export async function startMediaDownload(url, {
  message = null,
  progressive = false,
  preferHls = false,
  preferSigned = true,
  backgroundCache = true,
  waitForComplete = false,
  onProgress = null,
  onBuffering = null,
  signal = null,
} = {}) {
  if (!url) throw new Error('Missing media url');

  // Instant cache hit
  if (isMediaDownloaded(url)) {
    const cached = await getCachedBlobUrl(url);
    if (cached) {
      const task = ensureTask(url, message);
      task.state = 'complete';
      task.complete = true;
      task.progress = 1;
      task.playSrc = cached;
      task.mode = 'cache';
      task.buffering = false;
      emit(task);
      onProgress?.(1);
      onBuffering?.(false);
      return {
        blobUrl: cached,
        remoteUrl: url,
        streaming: false,
        mode: 'cache',
        complete: true,
      };
    }
  }

  // Cache API full response
  try {
    const cachedRes = await getMediaResponse(url);
    if (cachedRes) {
      const blob = await cachedRes.blob();
      if (blob?.size) {
        await putCachedBlob(url, blob);
        markMediaDownloaded(url);
        const objectUrl = URL.createObjectURL(blob);
        const task = ensureTask(url, message);
        task.state = 'complete';
        task.complete = true;
        task.progress = 1;
        task.playSrc = objectUrl;
        task.mode = 'cache';
        emit(task);
        return {
          blobUrl: objectUrl,
          remoteUrl: url,
          streaming: false,
          mode: 'cache',
          complete: true,
        };
      }
    }
  } catch (e) { /* continue */ }

  const task = ensureTask(url, message);
  task.options = {
    progressive,
    preferHls,
    preferSigned,
    backgroundCache,
  };
  task.message = message || task.message;

  // Join in-flight download
  if (task.state === 'downloading' && task.controller && !task.controller.signal.aborted) {
    let unsubProg = null;
    if (onProgress) {
      unsubProg = subscribeMediaTask(url, (s) => onProgress(s.progress));
    }
    return new Promise((resolve, reject) => {
      const wrapResolve = (result) => {
        if (unsubProg) unsubProg();
        resolve(result);
      };
      const wrapReject = (err) => {
        if (unsubProg) unsubProg();
        reject(err);
      };
      if (task.playSrc && !waitForComplete) {
        wrapResolve({
          blobUrl: task.playSrc,
          remoteUrl: url,
          streaming: !task.complete,
          mode: task.mode || 'progressive',
          complete: task.complete,
        });
        return;
      }
      const bucket = waitForComplete ? task.completeWaiters : task.readyWaiters;
      bucket.push({ resolve: wrapResolve, reject: wrapReject });
      if (signal) {
        const onAbort = () => {
          cancelMediaDownload(url, { persist: true });
          wrapReject(new DOMException('Download cancelled', 'AbortError'));
        };
        if (signal.aborted) onAbort();
        else signal.addEventListener('abort', onAbort, { once: true });
      }
    });
  }

  // Fresh start / resume from paused
  const generation = task.generation + 1;
  task.generation = generation;
  task.state = 'downloading';
  task.paused = false;
  task.cancelled = false;
  task.error = null;
  task.buffering = true;
  if (!task.complete) task.progress = task.progress > 0 && task.progress < 1 ? task.progress : 0;
  task.controller = typeof AbortController !== 'undefined' ? new AbortController() : null;

  // External AbortSignal → cancel this task
  if (signal) {
    const onAbort = () => cancelMediaDownload(url, { persist: true });
    if (signal.aborted) {
      cancelMediaDownload(url, { persist: true });
      throw new DOMException('Download cancelled', 'AbortError');
    }
    signal.addEventListener('abort', onAbort, { once: true });
  }

  emit(task);

  const localSignal = task.controller?.signal;

  const promise = new Promise((resolve, reject) => {
    const bucket = waitForComplete ? task.completeWaiters : task.readyWaiters;
    bucket.push({ resolve, reject });
  });

  runDownload(task, generation, {
    progressive,
    preferHls,
    preferSigned,
    backgroundCache,
    onProgress,
    onBuffering,
    signal: localSignal,
  }).catch((err) => {
    if (task.generation !== generation) return;
    if (isAbortError(err) || task.state === 'cancelled' || task.state === 'paused') return;
    task.state = 'error';
    task.error = err;
    task.buffering = false;
    emit(task);
    rejectAll(task, err);
  });

  return promise;
}

async function runDownload(task, generation, opts) {
  const { url, message } = task;
  const stillActive = () => task.generation === generation && task.state === 'downloading';

  const reportProgress = (r) => {
    if (!stillActive()) return;
    task.progress = Math.max(0, Math.min(1, Number(r) || 0));
    opts.onProgress?.(task.progress);
    emit(task);
  };

  const reportBuffering = (b) => {
    if (!stillActive()) return;
    task.buffering = !!b;
    opts.onBuffering?.(task.buffering);
    emit(task);
  };

  // Non-progressive full fetch (photos / encrypted)
  if (!opts.progressive || isEncryptedMediaMessage(message)) {
    await runFullFetch(task, generation, { reportProgress, reportBuffering, signal: opts.signal });
    return;
  }

  // Progressive / signed / HLS via mediaStream session, managed here
  const { openMediaStream, closeMediaStream } = await import('./mediaStream');
  if (!stillActive()) return;

  let readySettled = false;

  task.session = openMediaStream(url, {
    message,
    preferHls: opts.preferHls,
    preferSigned: opts.preferSigned,
    backgroundCache: opts.backgroundCache,
    managed: true,
    externalSignal: opts.signal,
    onProgress: reportProgress,
    onBuffering: reportBuffering,
    onReady: ({ objectUrl, partial, mode, hls, qualities, signed }) => {
      if (!stillActive()) return;
      task.playSrc = objectUrl;
      task.mode = mode || (signed ? 'signed' : 'progressive');
      task.partialReady = !!partial && !signed && mode !== 'hls';
      // Signed/HLS: immediately playable; download may continue as background cache.
      // Keep state=downloading until onComplete so Stop still aborts cache.
      if (!readySettled) {
        readySettled = true;
        settleReady(task, {
          blobUrl: objectUrl,
          remoteUrl: url,
          streaming: !!partial || mode === 'signed' || mode === 'hls',
          mode: task.mode,
          hls: !!hls,
          qualities: qualities || [],
          complete: false,
        });
      }
      emit(task);
    },
    onComplete: async ({ objectUrl, blob, cachedOnly }) => {
      if (task.generation !== generation) return;
      if (blob instanceof Blob) {
        try { await putMediaResponse(url, blob); } catch (e) { /* noop */ }
      }
      task.complete = true;
      task.progress = 1;
      task.buffering = false;
      task.state = 'complete';
      task.partialReady = false;
      if (objectUrl && !cachedOnly) task.playSrc = objectUrl;
      else if (objectUrl && !task.playSrc) task.playSrc = objectUrl;
      emit(task);
      const result = {
        blobUrl: task.playSrc || objectUrl,
        remoteUrl: url,
        streaming: false,
        mode: task.mode || 'progressive',
        complete: true,
      };
      if (!readySettled) {
        readySettled = true;
        settleReady(task, result);
      }
      settleComplete(task, result);
    },
    onAbort: () => {
      if (task.generation !== generation) return;
      // cancel/pause already set state
      if (task.state === 'downloading') {
        task.state = 'cancelled';
        task.buffering = false;
        emit(task);
      }
    },
    onError: (err) => {
      if (task.generation !== generation) return;
      if (isAbortError(err)) return;
      task.state = 'error';
      task.error = err;
      task.buffering = false;
      emit(task);
      rejectAll(task, err);
      closeMediaStream(url, { persist: true, revoke: false });
    },
  });
}

async function runFullFetch(task, generation, { reportProgress, reportBuffering, signal }) {
  const { url, message } = task;
  const stillActive = () => task.generation === generation && task.state === 'downloading';

  reportBuffering(true);

  // Resume partial if present
  const partial = await getPartialDownload(url);
  if (!stillActive()) return;

  const needsAuth = requiresBlobPlayback(url, message);

  try {
    let blob;
    if (needsAuth) {
      const { fetchAuthenticatedMedia } = await import('@/crypto/messenger/mediaAuth');
      const result = await fetchAuthenticatedMedia(
        url,
        message,
        (r) => reportProgress(Math.max(0, Math.min(1, Number(r) || 0))),
        { signal },
      );
      if (!stillActive()) return;
      blob = result?.blob || null;
      const objectUrl = result?.objectUrl || String(result);
      if (blob instanceof Blob) {
        await putCachedBlob(url, blob);
        try { await putMediaResponse(url, blob); } catch (e) { /* noop */ }
      }
      markMediaDownloaded(url);
      if (!stillActive()) return;
      task.playSrc = objectUrl;
      task.complete = true;
      task.progress = 1;
      task.buffering = false;
      task.state = 'complete';
      task.mode = 'blob';
      emit(task);
      const out = {
        blobUrl: objectUrl,
        remoteUrl: url,
        streaming: false,
        mode: 'blob',
        complete: true,
      };
      settleReady(task, out);
      settleComplete(task, out);
      return;
    }

    // Plain fetch with AbortSignal + optional Range resume
    const headers = {};
    let resumeFrom = 0;
    let priorChunks = [];
    if (partial?.blob && partial.received > 0) {
      priorChunks = [partial.blob];
      resumeFrom = partial.received;
      task.progress = partial.total > 0 ? partial.received / partial.total : 0;
      reportProgress(task.progress);
      headers.Range = `bytes=${resumeFrom}-`;
    }

    const res = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      headers,
      signal,
    });
    if (!stillActive()) return;

    if (resumeFrom > 0 && res.status === 200) {
      priorChunks = [];
      resumeFrom = 0;
    } else if (!res.ok && res.status !== 206) {
      throw new Error(`HTTP ${res.status}`);
    }

    const totalHeader = Number(res.headers.get('content-length')) || 0;
    let total = resumeFrom + totalHeader;
    if (res.status === 206) {
      const cr = res.headers.get('content-range');
      const m = cr && /\/(\d+)\s*$/.exec(cr);
      if (m) total = Number(m[1]);
    }

    if (!res.body) {
      const rest = await res.blob();
      blob = priorChunks.length ? new Blob([...priorChunks, rest]) : rest;
    } else {
      const reader = res.body.getReader();
      const chunks = [...priorChunks];
      let received = resumeFrom;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read();
        if (done) break;
        if (!stillActive()) {
          // Persist partial for resume
          try {
            await putPartialDownload(url, {
              chunks,
              received,
              total,
              mime: res.headers.get('content-type') || 'application/octet-stream',
            });
          } catch (e) { /* noop */ }
          return;
        }
        chunks.push(value);
        received += value.byteLength || value.length || 0;
        if (total > 0) reportProgress(Math.min(0.99, received / total));
        else reportProgress(Math.min(0.9, received / (received + 256000)));
      }
      blob = new Blob(chunks, {
        type: res.headers.get('content-type') || 'application/octet-stream',
      });
    }

    if (!stillActive()) return;
    await clearPartialDownload(url);
    await putCachedBlob(url, blob);
    try { await putMediaResponse(url, blob); } catch (e) { /* noop */ }
    markMediaDownloaded(url);
    const objectUrl = URL.createObjectURL(blob);
    if (!stillActive()) return;
    task.playSrc = objectUrl;
    task.complete = true;
    task.progress = 1;
    task.buffering = false;
    task.state = 'complete';
    task.mode = 'blob';
    emit(task);
    const out = {
      blobUrl: objectUrl,
      remoteUrl: url,
      streaming: false,
      mode: 'blob',
      complete: true,
    };
    settleReady(task, out);
    settleComplete(task, out);
  } catch (err) {
    if (!stillActive()) return;
    if (isAbortError(err)) return;
    throw err;
  } finally {
    if (stillActive()) reportBuffering(false);
  }
}

export function waitMediaComplete(url) {
  const task = url ? tasks.get(url) : null;
  if (!task) return Promise.reject(new Error('No media task'));
  if (task.complete) {
    return Promise.resolve({
      blobUrl: task.playSrc,
      remoteUrl: url,
      streaming: false,
      mode: task.mode,
      complete: true,
    });
  }
  return new Promise((resolve, reject) => {
    task.completeWaiters.push({ resolve, reject });
  });
}

/** Attach HLS.js to a media element when mode is hls (or forced). */
export async function attachHlsPlayback(videoEl, src, {
  url = null,
  signal = null,
  onError = null,
} = {}) {
  if (!videoEl || !src) return null;
  const canNative = videoEl.canPlayType('application/vnd.apple.mpegurl');
  if (canNative) {
    videoEl.src = src;
    return { mode: 'native-hls', destroy() { /* noop */ } };
  }

  const Hls = (await import('hls.js')).default;
  if (!Hls.isSupported()) {
    videoEl.src = src;
    return { mode: 'fallback', destroy() { /* noop */ } };
  }

  const hls = new Hls({
    enableWorker: true,
    maxBufferLength: 30,
    maxMaxBufferLength: 60,
  });
  hls.loadSource(src);
  hls.attachMedia(videoEl);
  hls.on(Hls.Events.ERROR, (_, data) => {
    if (data?.fatal) onError?.(data);
  });

  if (url) {
    const task = tasks.get(url);
    if (task) {
      if (task.hls) {
        try { task.hls.destroy(); } catch (e) { /* noop */ }
      }
      task.hls = hls;
    }
  }

  const onAbort = () => {
    try { hls.destroy(); } catch (e) { /* noop */ }
  };
  if (signal) {
    if (signal.aborted) onAbort();
    else signal.addEventListener('abort', onAbort, { once: true });
  }

  return {
    mode: 'hls.js',
    hls,
    destroy() {
      try { hls.destroy(); } catch (e) { /* noop */ }
      if (url) {
        const task = tasks.get(url);
        if (task?.hls === hls) task.hls = null;
      }
    },
  };
}

/** Mark task complete when an external path finished caching (compat). */
export function notifyMediaCached(url, playSrc = null) {
  if (!url) return;
  const task = ensureTask(url);
  task.complete = true;
  task.progress = 1;
  task.state = 'complete';
  task.buffering = false;
  if (playSrc) task.playSrc = playSrc;
  markMediaDownloaded(url);
  emit(task);
  const result = {
    blobUrl: task.playSrc,
    remoteUrl: url,
    streaming: false,
    mode: task.mode || 'cache',
    complete: true,
  };
  settleReady(task, result);
  settleComplete(task, result);
}

export function clearMediaTask(url) {
  if (!url) return;
  cancelMediaDownload(url, { persist: true });
  tasks.delete(url);
}
