/**
 * Shared single-track audio player for messenger voice / music.
 * Only one clip plays at a time; UI components subscribe for mini-player state.
 */

const listeners = new Set();
let audioEl = null;
let endedHook = null;
let wakeLock = null;
let state = {
  active: false,
  playing: false,
  buffering: false,
  src: null,
  title: '',
  subtitle: '',
  coverUrl: null,
  messageId: null,
  conversationId: null,
  type: null, // voice | audio
  current: 0,
  duration: 0,
  downloadProgress: 1,
  playbackRate: 1,
};

function emit() {
  const snap = { ...state };
  listeners.forEach((fn) => {
    try { fn(snap); } catch (e) { /* noop */ }
  });
}

async function requestWakeLock() {
  try {
    if (typeof navigator !== 'undefined' && navigator.wakeLock?.request) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener?.('release', () => { wakeLock = null; });
    }
  } catch (e) { /* unsupported / denied */ }
}

function releaseWakeLock() {
  try { wakeLock?.release?.(); } catch (e) { /* noop */ }
  wakeLock = null;
}

function ensureAudio() {
  if (audioEl) return audioEl;
  audioEl = new Audio();
  audioEl.preload = 'auto';
  // Keep playing when the tab is backgrounded (mobile browsers honor this best-effort).
  try { audioEl.setAttribute('playsinline', 'true'); } catch (e) { /* noop */ }
  try { audioEl.setAttribute('playsInline', 'true'); } catch (e) { /* noop */ }
  // Background audio: stay active when page is hidden.
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (!audioEl || !state.active) return;
      // Do not pause on hide — Media Session + wake lock keep playback going.
      if (document.hidden && state.playing) {
        syncMediaSession();
      }
    });
  }
  audioEl.addEventListener('timeupdate', () => {
    state.current = audioEl.currentTime || 0;
    if (Number.isFinite(audioEl.duration) && audioEl.duration > 0) {
      state.duration = audioEl.duration;
    }
    emit();
  });
  audioEl.addEventListener('ended', () => {
    state.playing = false;
    state.buffering = false;
    state.current = 0;
    releaseWakeLock();
    emit();
    if (typeof endedHook === 'function') {
      try { endedHook(); } catch (e) { /* noop */ }
    }
  });
  audioEl.addEventListener('pause', () => {
    state.playing = false;
    releaseWakeLock();
    emit();
  });
  audioEl.addEventListener('play', () => {
    state.playing = true;
    state.active = true;
    requestWakeLock();
    emit();
  });
  audioEl.addEventListener('waiting', () => {
    state.buffering = true;
    emit();
  });
  audioEl.addEventListener('playing', () => {
    state.buffering = false;
    emit();
  });
  audioEl.addEventListener('canplay', () => {
    state.buffering = false;
    emit();
  });
  audioEl.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(audioEl.duration) && audioEl.duration > 0) {
      state.duration = audioEl.duration;
      emit();
    }
  });
  // Media Session API — lock-screen / notification controls (background audio UX).
  if (typeof navigator !== 'undefined' && navigator.mediaSession) {
    try {
      navigator.mediaSession.setActionHandler('play', () => { toggleMediaPlayer(); });
      navigator.mediaSession.setActionHandler('pause', () => { pauseMediaPlayer(); });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details?.seekTime != null) seekMediaPlayer(details.seekTime);
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        seekMediaPlayer(Math.max(0, (state.current || 0) - (details?.seekOffset || 10)));
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const d = state.duration || 0;
        seekMediaPlayer(Math.min(d || 1e9, (state.current || 0) + (details?.seekOffset || 10)));
      });
    } catch (e) { /* some handlers unsupported */ }
  }
  return audioEl;
}

export function subscribeMediaPlayer(fn) {
  listeners.add(fn);
  fn({ ...state });
  return () => listeners.delete(fn);
}

/** Called when the current track finishes (for auto-advance). */
export function setMediaPlayerEndedHook(fn) {
  endedHook = typeof fn === 'function' ? fn : null;
}

export function getMediaPlayerState() {
  return { ...state };
}

function syncMediaSession() {
  if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: state.title || (state.type === 'voice' ? 'Voice message' : 'Audio'),
      artist: state.subtitle || 'Zanburak',
      artwork: state.coverUrl ? [{ src: state.coverUrl, sizes: '256x256', type: 'image/jpeg' }] : [],
    });
    navigator.mediaSession.playbackState = state.playing ? 'playing' : 'paused';
  } catch (e) { /* noop */ }
}

export function playMediaTrack({
  src,
  title = '',
  subtitle = '',
  coverUrl = null,
  messageId = null,
  conversationId = null,
  type = 'voice',
  duration = 0,
  downloadProgress = 1,
} = {}) {
  if (!src) return Promise.reject(new Error('missing src'));
  const el = ensureAudio();
  const same = state.src === src && String(state.messageId) === String(messageId);
  state.src = src;
  state.title = title;
  state.subtitle = subtitle;
  state.coverUrl = coverUrl || null;
  state.messageId = messageId;
  state.conversationId = conversationId ?? state.conversationId;
  state.type = type;
  state.downloadProgress = Number.isFinite(downloadProgress) ? downloadProgress : 1;
  if (duration) state.duration = duration;
  state.active = true;

  if (!same || el.src !== src) {
    el.src = src;
    state.current = 0;
    state.buffering = true;
  }
  el.playbackRate = state.playbackRate || 1;
  syncMediaSession();
  emit();
  return el.play().then(() => {
    state.playing = true;
    state.buffering = false;
    syncMediaSession();
    emit();
  }).catch((err) => {
    // Autoplay / decode race while still buffering — keep active for retry.
    state.buffering = true;
    emit();
    throw err;
  });
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function setMediaPlaybackRate(rate) {
  const el = ensureAudio();
  const next = Number(rate);
  if (!Number.isFinite(next) || next <= 0) return state.playbackRate;
  state.playbackRate = next;
  el.playbackRate = next;
  emit();
  return next;
}

export function cycleMediaPlaybackRate() {
  const i = PLAYBACK_SPEEDS.indexOf(state.playbackRate);
  const next = PLAYBACK_SPEEDS[(i + 1) % PLAYBACK_SPEEDS.length];
  return setMediaPlaybackRate(next);
}

export function getMediaPlaybackRate() {
  return state.playbackRate || 1;
}

/** Update download progress for the active track (progressive stream). */
export function setMediaPlayerDownloadProgress(ratio) {
  state.downloadProgress = Math.max(0, Math.min(1, Number(ratio) || 0));
  emit();
}

export function setMediaPlayerBuffering(buffering) {
  state.buffering = !!buffering;
  emit();
}

export function toggleMediaPlayer() {
  const el = ensureAudio();
  if (!state.src) return Promise.resolve();
  if (el.paused) {
    return el.play().then(() => {
      state.playing = true;
      emit();
    });
  }
  el.pause();
  state.playing = false;
  emit();
  return Promise.resolve();
}

export function pauseMediaPlayer() {
  if (!audioEl) return;
  audioEl.pause();
  state.playing = false;
  emit();
}

export function seekMediaPlayer(seconds) {
  const el = ensureAudio();
  if (!Number.isFinite(seconds)) return;
  const d = Number.isFinite(el.duration) ? el.duration : state.duration;
  el.currentTime = Math.max(0, Math.min(d || seconds, seconds));
  state.current = el.currentTime;
  emit();
}

export function seekMediaPlayerRatio(ratio) {
  const clamped = Math.max(0, Math.min(1, Number(ratio) || 0));
  const el = ensureAudio();
  const d = state.duration || (el && Number.isFinite(el.duration) ? el.duration : 0) || 0;
  if (d > 0) {
    seekMediaPlayer(clamped * d);
    return;
  }
  // Duration not ready yet (fresh play) — apply once metadata loads.
  const apply = () => {
    const dur = state.duration || (el && Number.isFinite(el.duration) ? el.duration : 0) || 0;
    if (!dur) return;
    el.removeEventListener('loadedmetadata', apply);
    seekMediaPlayer(clamped * dur);
  };
  el.addEventListener('loadedmetadata', apply);
  // Fallback if metadata already fired before we subscribed.
  if (el.readyState >= 1) apply();
}

export function stopMediaPlayer() {
  if (audioEl) {
    try {
      audioEl.pause();
      audioEl.removeAttribute('src');
      audioEl.load();
    } catch (e) { /* noop */ }
  }
  releaseWakeLock();
  state = {
    active: false,
    playing: false,
    buffering: false,
    src: null,
    title: '',
    subtitle: '',
    coverUrl: null,
    messageId: null,
    conversationId: null,
    type: null,
    current: 0,
    duration: 0,
    downloadProgress: 1,
    playbackRate: state.playbackRate || 1,
  };
  syncMediaSession();
  emit();
}

/** Stop the shared player if it is currently bound to this message. */
export function stopMediaPlayerIfMessage(messageId) {
  if (messageId == null || !state.active) return false;
  if (String(state.messageId) !== String(messageId)) return false;
  stopMediaPlayer();
  return true;
}

/** Stop if the active track belongs to any of the given message ids. */
export function stopMediaPlayerIfMessages(messageIds) {
  if (!state.active || state.messageId == null) return false;
  const set = new Set((messageIds || []).map((id) => String(id)));
  if (!set.has(String(state.messageId))) return false;
  stopMediaPlayer();
  return true;
}

export function isTrackActive(messageId) {
  return state.active && String(state.messageId) === String(messageId);
}

/** Build Telegram-like waveform peaks (0..1) from an ArrayBuffer / fetchable URL. */
export async function analyzeWaveform(src, bars = 42) {
  if (!src || (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined')) {
    return fakePeaks(bars, src);
  }
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const res = await fetch(src);
    const buf = await res.arrayBuffer();
    const decoded = await ctx.decodeAudioData(buf.slice(0));
    const channel = decoded.getChannelData(0);
    const block = Math.floor(channel.length / bars) || 1;
    const peaks = [];
    for (let i = 0; i < bars; i += 1) {
      let sum = 0;
      const start = i * block;
      for (let j = 0; j < block; j += 1) sum += Math.abs(channel[start + j] || 0);
      peaks.push(sum / block);
    }
    const max = Math.max(...peaks, 0.0001);
    try { ctx.close(); } catch (e) { /* noop */ }
    return peaks.map((p) => Math.max(0.12, Math.min(1, p / max)));
  } catch (e) {
    return fakePeaks(bars, src);
  }
}

function fakePeaks(bars, seedStr) {
  let seed = 0;
  const s = String(seedStr || 'x');
  for (let i = 0; i < s.length; i += 1) seed = (seed * 31 + s.charCodeAt(i)) >>> 0;
  const out = [];
  for (let i = 0; i < bars; i += 1) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const r = (seed % 1000) / 1000;
    out.push(0.18 + r * 0.82);
  }
  return out;
}
