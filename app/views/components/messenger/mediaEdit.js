/**
 * Client-side media edit helpers for messenger compose (crop/filter photos,
 * trim/mute videos via canvas + MediaRecorder). No ffmpeg.wasm.
 */

/** Telegram-like compression presets (smaller upload). */
export const PHOTO_QUALITY_COMPRESSED = { quality: 0.72, maxEdge: 1280 };
export const PHOTO_QUALITY_ORIGINAL = { quality: 0.92, maxEdge: 2560 };
export const VIDEO_COMPRESS = { videoBitsPerSecond: 1_200_000, maxEdge: 720 };
export const VIDEO_ORIGINAL = { videoBitsPerSecond: 2_500_000, maxEdge: null };

export const PHOTO_FILTERS = [
  { id: 'original', css: 'none', labelKey: 'messenger.filterOriginal' },
  { id: 'warm', css: 'sepia(0.28) saturate(1.25) brightness(1.05)', labelKey: 'messenger.filterWarm' },
  { id: 'cool', css: 'saturate(0.9) hue-rotate(195deg) brightness(1.05)', labelKey: 'messenger.filterCool' },
  { id: 'mono', css: 'grayscale(1) contrast(1.05)', labelKey: 'messenger.filterMono' },
  { id: 'noir', css: 'grayscale(1) contrast(1.35) brightness(0.92)', labelKey: 'messenger.filterNoir' },
  { id: 'fade', css: 'contrast(0.88) brightness(1.1) saturate(0.75)', labelKey: 'messenger.filterFade' },
  { id: 'vivid', css: 'saturate(1.55) contrast(1.12)', labelKey: 'messenger.filterVivid' },
  { id: 'cartoon', css: 'contrast(1.45) saturate(1.35) brightness(1.05)', labelKey: 'messenger.filterCartoon' },
];

export function getPhotoFilter(id) {
  return PHOTO_FILTERS.find((f) => f.id === id) || PHOTO_FILTERS[0];
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/**
 * Draw an HTMLImageElement / canvas / URL with optional CSS-like filter
 * onto a new canvas and return a JPEG File.
 */
export async function exportFilteredImage(source, {
  filterId = 'original',
  fileName = 'photo.jpg',
  quality = 0.92,
  maxEdge = 2560,
} = {}) {
  let base;
  if (source instanceof HTMLCanvasElement) {
    base = source;
  } else {
    const img = typeof source === 'string' ? await loadImage(source) : source;
    const w0 = img.naturalWidth || img.width || 1;
    const h0 = img.naturalHeight || img.height || 1;
    const scale = Math.min(1, maxEdge / Math.max(w0, h0));
    base = document.createElement('canvas');
    base.width = Math.max(1, Math.round(w0 * scale));
    base.height = Math.max(1, Math.round(h0 * scale));
    base.getContext('2d').drawImage(img, 0, 0, base.width, base.height);
  }

  const filter = getPhotoFilter(filterId);
  let canvas = base;
  if (filter.css && filter.css !== 'none') {
    canvas = document.createElement('canvas');
    canvas.width = base.width;
    canvas.height = base.height;
    const ctx = canvas.getContext('2d');
    ctx.filter = filter.css;
    ctx.drawImage(base, 0, 0);
    ctx.filter = 'none';
  }

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
      'image/jpeg',
      quality,
    );
  });
  const name = `${String(fileName || 'photo.jpg').replace(/\.[^.]+$/, '')}.jpg`;
  return {
    file: new File([blob], name, { type: 'image/jpeg' }),
    width: canvas.width,
    height: canvas.height,
    previewUrl: URL.createObjectURL(blob),
  };
}

function pickRecorderMime() {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  for (const m of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) return m;
  }
  return '';
}

/**
 * Re-encode a video segment (and optionally strip audio) via canvas + MediaRecorder.
 * Falls back by rejecting so caller can send the original file.
 */
export function remuxVideoSegment(srcUrl, {
  start = 0,
  end = null,
  mute = false,
  fileName = 'video.webm',
  onProgress = null,
  videoBitsPerSecond = 2_500_000,
  maxEdge = null,
} = {}) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = srcUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';

    let recorder = null;
    let stream = null;
    let raf = 0;
    let canvas = null;
    let ctx = null;
    let finished = false;
    const chunks = [];

    const cleanup = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      try { video.pause(); } catch (e) { /* noop */ }
      try { video.removeAttribute('src'); video.load(); } catch (e) { /* noop */ }
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
    };

    const fail = (err) => {
      if (finished) return;
      finished = true;
      cleanup();
      reject(err instanceof Error ? err : new Error(String(err || 'remux failed')));
    };

    const done = (file, meta) => {
      if (finished) return;
      finished = true;
      cleanup();
      resolve({ file, ...meta });
    };

    video.onerror = () => fail(new Error('Video load failed'));

    video.onloadedmetadata = async () => {
      try {
        const duration = Number(video.duration) || 0;
        if (!Number.isFinite(duration) || duration <= 0) {
          fail(new Error('Invalid video duration'));
          return;
        }
        const t0 = Math.max(0, Math.min(duration - 0.05, Number(start) || 0));
        let t1 = end == null || end === '' ? duration : Number(end);
        if (!Number.isFinite(t1) || t1 <= t0) t1 = duration;
        t1 = Math.min(duration, Math.max(t0 + 0.1, t1));

        const srcW = video.videoWidth || 640;
        const srcH = video.videoHeight || 360;
        let w = srcW;
        let h = srcH;
        const edge = Number(maxEdge) || 0;
        if (edge > 0 && Math.max(srcW, srcH) > edge) {
          const scale = edge / Math.max(srcW, srcH);
          w = Math.max(2, Math.round((srcW * scale) / 2) * 2);
          h = Math.max(2, Math.round((srcH * scale) / 2) * 2);
        }
        canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        ctx = canvas.getContext('2d');
        stream = canvas.captureStream(30);

        if (!mute) {
          try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
              const actx = new AudioCtx();
              const source = actx.createMediaElementSource(video);
              const dest = actx.createMediaStreamDestination();
              source.connect(dest);
              source.connect(actx.destination);
              dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
              // Keep element muted so we don't double-play through speakers;
              // audio still flows through the graph to the recorder.
              video.muted = true;
              if (actx.state === 'suspended') await actx.resume();
            }
          } catch (e) {
            // Silent remux if audio graph fails.
          }
        }

        const mime = pickRecorderMime();
        if (!mime || typeof MediaRecorder === 'undefined') {
          fail(new Error('MediaRecorder unsupported'));
          return;
        }

        const bits = Math.max(400_000, Number(videoBitsPerSecond) || 2_500_000);
        recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: bits });
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size) chunks.push(e.data);
        };
        recorder.onerror = () => fail(new Error('Recorder error'));
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mime.split(';')[0] });
          const ext = mime.includes('mp4') ? 'mp4' : 'webm';
          const base = String(fileName || 'video').replace(/\.[^.]+$/, '');
          const file = new File([blob], `${base}.${ext}`, { type: blob.type });
          done(file, {
            width: w,
            height: h,
            duration: Math.max(1, Math.round(t1 - t0)),
            previewUrl: URL.createObjectURL(blob),
            mime: blob.type,
          });
        };

        const draw = () => {
          if (finished) return;
          if (video.currentTime >= t1 - 0.04) {
            try { recorder.stop(); } catch (e) { fail(e); }
            return;
          }
          ctx.drawImage(video, 0, 0, w, h);
          if (typeof onProgress === 'function') {
            const span = t1 - t0;
            const pct = span > 0 ? Math.min(99, Math.round(((video.currentTime - t0) / span) * 100)) : 0;
            onProgress(pct);
          }
          raf = requestAnimationFrame(draw);
        };

        video.currentTime = t0;
        video.onseeked = async () => {
          video.onseeked = null;
          try {
            recorder.start(200);
            await video.play();
            draw();
          } catch (e) {
            fail(e);
          }
        };
      } catch (e) {
        fail(e);
      }
    };
  });
}

/** True when video needs client remux (trim). Mute-only uses meta flags. */
export function videoNeedsRemux({ start, end, duration }) {
  const d = Number(duration) || 0;
  if (d <= 0) return false;
  const s = Math.max(0, Number(start) || 0);
  const e = end == null || end === '' ? d : Number(end);
  return s > 0.15 || (Number.isFinite(e) && e < d - 0.15);
}

/** Remux when trimming or when compression is requested. */
export function videoNeedsProcessing({ start, end, duration, compress }) {
  return !!compress || videoNeedsRemux({ start, end, duration });
}

/** Human resolution label like Telegram (1080, 720, 480…). */
export function resolutionLabel(width, height) {
  const w = Number(width) || 0;
  const h = Number(height) || 0;
  const edge = Math.max(w, h);
  if (edge >= 2000) return '1440';
  if (edge >= 1600) return '1080';
  if (edge >= 1100) return '720';
  if (edge >= 700) return '480';
  if (edge >= 400) return '360';
  if (edge > 0) return String(Math.round(edge));
  return '';
}

function clampEdge(width, height, maxEdge) {
  const w = Number(width) || 0;
  const h = Number(height) || 0;
  if (!w || !h || !maxEdge) return { width: w || null, height: h || null };
  const scale = Math.min(1, maxEdge / Math.max(w, h));
  return {
    width: Math.max(1, Math.round(w * scale)),
    height: Math.max(1, Math.round(h * scale)),
  };
}

/**
 * Estimate output size / resolution for the quality picker (Telegram-style).
 * These are approximate client-side estimates before actual encode.
 */
export function estimateMediaOutput({
  type = 'photo',
  originalSize = 0,
  width = null,
  height = null,
  duration = null,
  trimStart = 0,
  trimEnd = null,
  compress = true,
} = {}) {
  const srcSize = Math.max(0, Number(originalSize) || 0);
  const fullDur = Math.max(0, Number(duration) || 0);
  const t0 = Math.max(0, Number(trimStart) || 0);
  const t1 = trimEnd == null || trimEnd === ''
    ? fullDur
    : Math.max(t0, Number(trimEnd) || fullDur);
  const clipDur = fullDur > 0 ? Math.max(0.4, t1 - t0) : 0;
  const trimRatio = fullDur > 0 ? Math.min(1, clipDur / fullDur) : 1;

  if (type === 'photo') {
    const opts = compress ? PHOTO_QUALITY_COMPRESSED : PHOTO_QUALITY_ORIGINAL;
    const dims = clampEdge(width, height, opts.maxEdge);
    let size = srcSize;
    if (compress) {
      // Typical JPEG recompress + downscale for camera photos.
      const areaScale = (dims.width && width)
        ? (dims.width * dims.height) / Math.max(1, width * height)
        : 0.45;
      size = Math.max(28_000, Math.round(srcSize * Math.min(0.55, 0.18 + areaScale * 0.55)));
    }
    return {
      size,
      width: dims.width,
      height: dims.height,
      label: resolutionLabel(dims.width, dims.height) || (compress ? 'HD' : 'Original'),
      bitsPerSecond: null,
      duration: null,
    };
  }

  // video
  const opts = compress ? VIDEO_COMPRESS : VIDEO_ORIGINAL;
  const dims = clampEdge(width, height, opts.maxEdge);
  let size;
  if (compress || videoNeedsRemux({ start: t0, end: t1, duration: fullDur })) {
    const bps = (opts.videoBitsPerSecond || 2_500_000) + (compress ? 96_000 : 128_000);
    const dur = clipDur || fullDur || 1;
    size = Math.max(48_000, Math.round((bps / 8) * dur));
  } else {
    size = Math.max(48_000, Math.round(srcSize * trimRatio));
  }
  return {
    size,
    width: dims.width,
    height: dims.height,
    label: resolutionLabel(dims.width, dims.height)
      || (compress ? String(opts.maxEdge || 720) : 'Original'),
    bitsPerSecond: opts.videoBitsPerSecond || null,
    duration: clipDur || fullDur || null,
  };
}

