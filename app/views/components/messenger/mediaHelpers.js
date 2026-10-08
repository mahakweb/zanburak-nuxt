import { shapeUiDigits } from './appearance';

export const MEDIA_TYPES = ['photo', 'video', 'voice', 'audio', 'file'];

/** Max upload size per media message (defaults; overridden by admin /messenger/config). */
export const MEDIA_MAX_BYTES = 50 * 1024 * 1024;
export const MEDIA_MAX_MB = 50;

/** Runtime limits hydrated from GET /messenger/config */
let runtimeLimits = {
  maxBytesByType: {
    photo: MEDIA_MAX_BYTES,
    video: MEDIA_MAX_BYTES,
    audio: MEDIA_MAX_BYTES,
    voice: MEDIA_MAX_BYTES,
    file: MEDIA_MAX_BYTES,
  },
  maxPick: 10,
  uploadsEnabled: true,
  allowByType: {
    photo: true,
    video: true,
    audio: true,
    voice: true,
    file: true,
  },
};

export function applyMessengerUploadLimits(uploads = {}) {
  const kb = (key, fallbackKb = 51200) => {
    const n = Number(uploads[key]);
    return (Number.isFinite(n) && n > 0 ? n : fallbackKb) * 1024;
  };
  runtimeLimits = {
    maxBytesByType: {
      photo: kb('max_photo_kb'),
      video: kb('max_video_kb'),
      audio: kb('max_audio_kb'),
      voice: kb('max_voice_kb'),
      file: kb('max_file_kb'),
    },
    maxPick: Math.max(1, Number(uploads.max_album_items) || 10),
    uploadsEnabled: uploads.enabled !== false,
    allowByType: {
      photo: uploads.allow_photo !== false,
      video: uploads.allow_video !== false,
      audio: uploads.allow_audio !== false,
      voice: uploads.allow_voice !== false,
      file: uploads.allow_file !== false,
    },
  };
}

export function getMediaMaxBytes(type = 'file') {
  return runtimeLimits.maxBytesByType[type] || MEDIA_MAX_BYTES;
}

export function getMediaMaxMb(type = 'file') {
  return Math.round((getMediaMaxBytes(type) / (1024 * 1024)) * 10) / 10;
}

export function isMediaTypeAllowed(type) {
  if (!runtimeLimits.uploadsEnabled) return false;
  return runtimeLimits.allowByType[type] !== false;
}

export const PHOTO_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp,image/bmp,.jpg,.jpeg,.png,.gif,.webp,.bmp';
export const VIDEO_ACCEPT = 'video/mp4,video/webm,video/quicktime,video/x-m4v,.mp4,.webm,.mov,.m4v,.3gp';
export const AUDIO_ACCEPT = 'audio/mpeg,audio/mp4,audio/aac,audio/ogg,audio/wav,audio/flac,audio/x-m4a,.mp3,.m4a,.aac,.ogg,.wav,.flac,.opus';
/** Telegram-style gallery: photos + videos in one picker. */
export const GALLERY_ACCEPT = `${PHOTO_ACCEPT},${VIDEO_ACCEPT}`;
/** Document / generic file picker (filter blocked types client-side). */
export const FILE_ACCEPT = '*/*';
/** Max items selectable in one gallery / multi-send batch. */
export const MEDIA_MAX_PICK = 10;

export function getMediaMaxPick() {
  return runtimeLimits.maxPick || MEDIA_MAX_PICK;
}

/** Dangerous executables — never send as chat documents. */
export const FILE_BLOCKED_EXTS = [
  'exe', 'bat', 'cmd', 'com', 'scr', 'msi', 'msp', 'pif',
  'vbs', 'vbe', 'wsf', 'wsh', 'ps1', 'psc1',
  'dll', 'sys', 'drv', 'cpl', 'reg', 'inf', 'lnk', 'url', 'jar', 'jnlp',
];

export function isMediaType(type) {
  return MEDIA_TYPES.includes(type);
}

/** Photo/video suitable for chat media gallery (excludes stickers). */
export function isGalleryMediaMessage(message) {
  if (!message) return false;
  const type = message.type;
  if (type !== 'photo' && type !== 'video') return false;
  if (message.meta?.sticker) return false;
  return true;
}

/** Detect photo vs video from a File (MIME + extension). */
export function detectGalleryMediaType(file) {
  if (!file) return null;
  const mime = String(file.type || '').toLowerCase();
  const name = String(file.name || '').toLowerCase();
  if (mime.startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp)$/i.test(name)) return 'photo';
  if (mime.startsWith('video/') || /\.(mp4|webm|mov|m4v|3gp)$/i.test(name)) return 'video';
  return null;
}

export function newMediaClientId(prefix = 'm') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function isMediaWithinLimit(file, type = 'file') {
  if (!file) return true;
  return Number(file.size || 0) <= getMediaMaxBytes(type);
}

export function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  let raw;
  if (n < 1024) raw = `${n} B`;
  else if (n < 1024 * 1024) {
    const kb = n / 1024;
    raw = `${kb >= 100 ? Math.round(kb) : kb.toFixed(1)} KB`;
  } else {
    const mb = n / (1024 * 1024);
    raw = `${mb >= 100 ? Math.round(mb) : mb.toFixed(1)} MB`;
  }
  return shapeUiDigits(raw, 'meta');
}

export function formatDuration(seconds) {
  const n = Number(seconds);
  if (!Number.isFinite(n) || n < 0) return shapeUiDigits('0:00', 'meta');
  const s = Math.max(0, Math.round(n));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return shapeUiDigits(`${m}:${String(r).padStart(2, '0')}`, 'meta');
}

/** Split "Artist - Title.mp3" style names. */
export function parseAudioTitle(name) {
  const raw = String(name || '').replace(/\.[^.]+$/, '').trim();
  if (!raw) return { title: '', artist: '' };
  const parts = raw.split(/\s[-–—]\s/);
  if (parts.length >= 2) {
    return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() };
  }
  return { title: raw, artist: '' };
}

export function mediaTypeLabelKey(type) {
  if (type === 'photo') return 'messenger.mediaPhoto';
  if (type === 'video') return 'messenger.mediaVideo';
  if (type === 'voice') return 'messenger.mediaVoice';
  if (type === 'audio') return 'messenger.mediaAudio';
  if (type === 'file') return 'messenger.mediaFile';
  return 'messenger.mediaFile';
}

export function fileExtension(nameOrFile) {
  const name = typeof nameOrFile === 'string'
    ? nameOrFile
    : (nameOrFile?.name || '');
  const m = String(name).match(/\.([a-z0-9]{1,12})$/i);
  return m ? m[1].toLowerCase() : '';
}

export function isBlockedFileExt(ext) {
  return FILE_BLOCKED_EXTS.includes(String(ext || '').toLowerCase());
}

/**
 * Classify a File for chat send.
 * @param {File} file
 * @param {{ forceFile?: boolean }} [opts] — forceFile = Telegram "Send as file"
 */
export function detectMediaTypeFromFile(file, opts = {}) {
  if (!file) return null;
  if (opts.forceFile) {
    const ext = fileExtension(file);
    return isBlockedFileExt(ext) ? null : 'file';
  }
  const mime = String(file.type || '').toLowerCase();
  const name = String(file.name || '').toLowerCase();
  // SVG is a document in Telegram (not an inline photo).
  if (mime === 'image/svg+xml' || /\.svg$/i.test(name)) return 'file';
  if (mime.startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp|heic|heif)$/i.test(name)) return 'photo';
  if (mime.startsWith('video/') || /\.(mp4|webm|mov|m4v|3gp|mkv|avi)$/i.test(name)) return 'video';
  if (mime.startsWith('audio/') || /\.(mp3|m4a|aac|ogg|wav|flac|opus)$/i.test(name)) return 'audio';
  const ext = fileExtension(name);
  if (isBlockedFileExt(ext)) return null;
  return 'file';
}

/**
 * Normalize a FileList / File[] into compose items (photo/video/audio/file).
 * Returns { items, skippedLarge, skippedBlocked, truncated }.
 */
export async function classifyDroppedFiles(fileList, {
  forceFile = false,
  maxPick = getMediaMaxPick(),
  probe = null,
} = {}) {
  const list = Array.from(fileList || []).filter(Boolean);
  const truncated = list.length > maxPick;
  const capped = list.slice(0, maxPick);
  const items = [];
  let skippedLarge = 0;
  let skippedBlocked = 0;

  for (const file of capped) {
    const type = detectMediaTypeFromFile(file, { forceFile });
    if (!type || !isMediaTypeAllowed(type)) {
      skippedBlocked += 1;
      continue;
    }
    if (!isMediaWithinLimit(file, type)) {
      skippedLarge += 1;
      continue;
    }
    const previewUrl = (type === 'photo' || type === 'video' || type === 'audio')
      ? URL.createObjectURL(file)
      : '';
    let probed = { duration: null, width: null, height: null };
    if (typeof probe === 'function' && (type === 'photo' || type === 'video' || type === 'audio')) {
      try { probed = await probe(file, type) || probed; } catch (e) { /* noop */ }
    }
    items.push({
      id: newMediaClientId('pick'),
      type,
      file,
      fileName: file.name || (type === 'file' ? 'file' : 'media'),
      previewUrl,
      size: file.size || 0,
      duration: probed.duration,
      width: probed.width,
      height: probed.height,
      selected: true,
      ext: fileExtension(file),
    });
  }

  return { items, skippedLarge, skippedBlocked, truncated };
}

/** Accent color for document icon by extension (Telegram-ish). */
export function fileExtColor(ext) {
  const e = String(ext || '').toLowerCase();
  if (['pdf'].includes(e)) return '#e53935';
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(e)) return '#8e24aa';
  if (['doc', 'docx', 'odt', 'rtf', 'pages', 'txt', 'md'].includes(e)) return '#1e88e5';
  if (['xls', 'xlsx', 'ods', 'csv', 'numbers'].includes(e)) return '#43a047';
  if (['ppt', 'pptx', 'odp', 'key'].includes(e)) return '#fb8c00';
  if (['svg', 'ai', 'psd', 'eps', 'sketch'].includes(e)) return '#00acc1';
  if (['apk', 'aab', 'ipa', 'dmg', 'iso'].includes(e)) return '#6d4c41';
  if (['json', 'xml', 'yaml', 'yml', 'html', 'css', 'js', 'ts', 'py', 'php', 'java'].includes(e)) return '#546e7a';
  if (['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(e)) return '#8e24aa';
  if (['mp3', 'm4a', 'wav', 'flac', 'ogg'].includes(e)) return '#2ea66a';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'heic'].includes(e)) return '#3390ec';
  return '#607d8b';
}

/**
 * Size a photo/video bubble like Telegram: keep aspect, fit in max box.
 * Tall portraits (phone screenshots) stay compact — no album-like empty gaps.
 */
export function mediaBubbleSize(meta, {
  maxW = 320,
  maxH = 360,
  minW = 100,
  minH = 80,
} = {}) {
  const w = Number(meta?.width) || 0;
  const h = Number(meta?.height) || 0;
  if (w > 0 && h > 0) {
    let boxW = maxW;
    let boxH = maxH;
    // Portrait / screenshot: prefer a tighter height so a single photo
    // does not leave huge empty chat gaps (unlike multi-item albums).
    if (h > w * 1.25) {
      boxW = Math.min(maxW, 260);
      boxH = Math.min(maxH, 300);
    }
    let scale = Math.min(boxW / w, boxH / h);
    if (scale > 1) scale = 1;
    let bw = Math.max(1, Math.round(w * scale));
    let bh = Math.max(1, Math.round(h * scale));
    if (bw < minW) {
      const up = minW / bw;
      bw = minW;
      bh = Math.min(boxH, Math.round(bh * up));
    }
    if (bh < minH) {
      const up = minH / bh;
      bh = minH;
      bw = Math.min(boxW, Math.round(bw * up));
    }
    return {
      width: `${bw}px`,
      height: `${bh}px`,
    };
  }
  return {
    width: `${Math.min(maxW, 280)}px`,
    height: `${Math.min(maxH, 210)}px`,
  };
}

/** @deprecated use mediaBubbleSize */
export function mediaAspectStyle(meta) {
  return mediaBubbleSize(meta);
}

/**
 * Grab a JPEG poster frame from a video URL (blob or remote).
 * Returns an object URL, or null on failure.
 * When cacheKey is set, results are read/written from IndexedDB for gallery reuse.
 */
export function captureVideoPoster(src, { seekTo = 0.05, quality = 0.72, cacheKey = null } = {}) {
  return new Promise((resolve) => {
    if (!src || typeof document === 'undefined') {
      resolve(null);
      return;
    }

    const runCapture = () => {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      // Needed for canvas export from remote CDN when CORS allows it.
      if (!String(src).startsWith('blob:')) {
        video.crossOrigin = 'anonymous';
      }

      let done = false;
      const finish = (url) => {
        if (done) return;
        done = true;
        try {
          video.pause();
          video.removeAttribute('src');
          video.load();
        } catch (e) { /* noop */ }
        if (url && cacheKey) {
          fetch(url).then((r) => r.blob()).then((blob) => {
            import('./mediaCache').then(({ putCachedPoster }) => putCachedPoster(cacheKey, blob)).catch(() => {});
          }).catch(() => {});
        }
        resolve(url || null);
      };

      const timeout = setTimeout(() => finish(null), 8000);

      video.onerror = () => {
        clearTimeout(timeout);
        finish(null);
      };

      const draw = () => {
        try {
          const w = video.videoWidth || 0;
          const h = video.videoHeight || 0;
          if (!w || !h) {
            clearTimeout(timeout);
            finish(null);
            return;
          }
          const maxEdge = 640;
          const scale = Math.min(1, maxEdge / Math.max(w, h));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(w * scale));
          canvas.height = Math.max(1, Math.round(h * scale));
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              clearTimeout(timeout);
              if (!blob) {
                finish(null);
                return;
              }
              finish(URL.createObjectURL(blob));
            },
            'image/jpeg',
            quality,
          );
        } catch (e) {
          clearTimeout(timeout);
          finish(null);
        }
      };

      video.onloadeddata = () => {
        const d = Number(video.duration) || 0;
        const t = d > 0 ? Math.min(Math.max(seekTo, 0.01), Math.max(0.01, d * 0.1)) : seekTo;
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          draw();
        };
        video.addEventListener('seeked', onSeeked);
        try {
          video.currentTime = t;
        } catch (e) {
          video.removeEventListener('seeked', onSeeked);
          draw();
        }
      };

      video.src = src;
      try { video.load(); } catch (e) { /* noop */ }
    };

    if (cacheKey) {
      import('./mediaCache').then(({ getCachedPosterUrl }) => getCachedPosterUrl(cacheKey))
        .then((cached) => {
          if (cached) {
            resolve(cached);
            return;
          }
          runCapture();
        })
        .catch(() => runCapture());
      return;
    }
    runCapture();
  });
}

/** True when a URL is safe to use as an <img> for album tiles. */
export function isImageThumbUrl(url) {
  if (!url) return false;
  const s = String(url);
  if (s.startsWith('data:image/')) return true;
  if (s.startsWith('blob:')) return false; // ambiguous — only use known image posters
  // Auth proxy thumbs: /messenger/media/{id}?v=thumb
  if (/\/messenger\/media\/\d+/i.test(s) && /[?&]v=thumb(?:&|$)/i.test(s)) return true;
  return /\.(jpe?g|png|gif|webp|bmp)(\?|#|$)/i.test(s);
}

/** Read image/video dimensions + duration from a local File. */
export function probeLocalFile(file, type) {
  return new Promise((resolve) => {
    const result = { width: null, height: null, duration: null };
    if (!file) {
      resolve(result);
      return;
    }
    if (type === 'photo') {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        result.width = img.naturalWidth;
        result.height = img.naturalHeight;
        URL.revokeObjectURL(url);
        resolve(result);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(result);
      };
      img.src = url;
      return;
    }
    if (type === 'video' || type === 'audio' || type === 'voice') {
      const url = URL.createObjectURL(file);
      const el = document.createElement(type === 'video' ? 'video' : 'audio');
      el.preload = 'metadata';
      const finish = () => {
        if (type === 'video') {
          result.width = el.videoWidth || null;
          result.height = el.videoHeight || null;
        }
        if (Number.isFinite(el.duration) && el.duration > 0) {
          result.duration = el.duration;
        }
        URL.revokeObjectURL(url);
        resolve(result);
      };
      el.onloadedmetadata = finish;
      el.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(result);
      };
      // Some browsers need this for webm voice blobs.
      setTimeout(() => {
        if (result.duration == null && Number.isFinite(el.duration) && el.duration > 0) finish();
      }, 800);
      el.src = url;
      return;
    }
    resolve(result);
  });
}

/**
 * Extract embedded album art (ID3 APIC) from an audio File/Blob/URL.
 * Returns the image Blob, or null.
 */
export async function extractAudioArtworkBlob(source, { maxBytes = 768 * 1024 } = {}) {
  try {
    let blob;
    if (typeof source === 'string') {
      if (source.startsWith('blob:')) {
        const res = await fetch(source).catch(() => null);
        if (!res || !res.ok) return null;
        blob = (await res.blob()).slice(0, maxBytes);
      } else {
        const res = await fetch(source, {
          headers: { Range: `bytes=0-${maxBytes - 1}` },
          mode: 'cors',
          credentials: 'omit',
        }).catch(() => null);
        if (!res || !res.ok) {
          const full = await fetch(source, { mode: 'cors', credentials: 'omit' }).catch(() => null);
          if (!full || !full.ok) return null;
          blob = (await full.blob()).slice(0, maxBytes);
        } else {
          blob = await res.blob();
        }
      }
    } else if (source instanceof Blob) {
      blob = source.slice(0, maxBytes);
    } else {
      return null;
    }

    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    if (bytes.length < 10) return null;

    // ID3v2
    if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
      return parseId3Artwork(bytes);
    }
    return null;
  } catch (e) {
    return null;
  }
}

/** Returns a blob: object URL for embedded album art, or null. */
export async function extractAudioArtwork(source, opts) {
  const art = await extractAudioArtworkBlob(source, opts);
  return art ? URL.createObjectURL(art) : null;
}

function synchsafeToSize(b0, b1, b2, b3) {
  return ((b0 & 0x7f) << 21) | ((b1 & 0x7f) << 14) | ((b2 & 0x7f) << 7) | (b3 & 0x7f);
}

function parseId3Artwork(bytes) {
  const ver = bytes[3];
  const flags = bytes[5];
  let tagSize = synchsafeToSize(bytes[6], bytes[7], bytes[8], bytes[9]);
  let offset = 10;
  if (flags & 0x40) {
    // Extended header
    if (ver === 4) {
      const ext = synchsafeToSize(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
      offset += ext;
    } else {
      const ext = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
      offset += 4 + ext;
    }
  }
  const end = Math.min(bytes.length, 10 + tagSize);
  while (offset + 10 < end) {
    let frameId;
    let frameSize;
    if (ver === 2) {
      frameId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2]);
      frameSize = (bytes[offset + 3] << 16) | (bytes[offset + 4] << 8) | bytes[offset + 5];
      offset += 6;
    } else {
      frameId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
      if (ver === 4) {
        frameSize = synchsafeToSize(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
      } else {
        frameSize = (bytes[offset + 4] << 24) | (bytes[offset + 5] << 16) | (bytes[offset + 6] << 8) | bytes[offset + 7];
      }
      offset += 10;
    }
    if (!frameId || frameId === '\u0000\u0000\u0000\u0000' || frameSize <= 0) break;
    if (offset + frameSize > bytes.length) break;

    if (frameId === 'APIC' || frameId === 'PIC') {
      const frame = bytes.subarray(offset, offset + frameSize);
      const pic = decodeApicFrame(frame, frameId === 'PIC');
      if (pic) return pic;
    }
    offset += frameSize;
  }
  return null;
}

function decodeApicFrame(frame, isV2) {
  if (frame.length < 4) return null;
  let i = 0;
  const encoding = frame[i++];
  let mime = 'image/jpeg';
  if (isV2) {
    // Image format 3 chars
    i += 3;
  } else {
    const mimeStart = i;
    while (i < frame.length && frame[i] !== 0) i += 1;
    const mimeStr = String.fromCharCode(...frame.subarray(mimeStart, i));
    if (mimeStr) mime = mimeStr;
    i += 1; // null
  }
  if (i >= frame.length) return null;
  i += 1; // picture type
  // description
  if (encoding === 0 || encoding === 3) {
    while (i < frame.length && frame[i] !== 0) i += 1;
    i += 1;
  } else {
    while (i + 1 < frame.length && !(frame[i] === 0 && frame[i + 1] === 0)) i += 2;
    i += 2;
  }
  if (i >= frame.length) return null;
  const imgBytes = frame.subarray(i);
  if (imgBytes.length < 24) return null;
  return new Blob([imgBytes], { type: mime || 'image/jpeg' });
}

/** Ensure getUserMedia works across browsers / insecure-context messaging. */
export function getMicrophoneStream() {
  const md = navigator.mediaDevices;
  if (md && typeof md.getUserMedia === 'function') {
    return md.getUserMedia({ audio: true });
  }
  const legacy = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia;
  if (legacy) {
    return new Promise((resolve, reject) => {
      legacy.call(navigator, { audio: true }, resolve, reject);
    });
  }
  const err = new Error('Microphone API unavailable');
  err.name = 'NotSupportedError';
  return Promise.reject(err);
}

/** Encode an AudioBuffer as a 16-bit PCM WAV Blob. */
export function audioBufferToWavBlob(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;
  const samples = buffer.length;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = samples * blockAlign;
  const headerSize = 44;
  const ab = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(ab);

  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i += 1) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  const channels = [];
  for (let c = 0; c < numChannels; c += 1) channels.push(buffer.getChannelData(c));

  let offset = 44;
  for (let i = 0; i < samples; i += 1) {
    for (let c = 0; c < numChannels; c += 1) {
      let sample = channels[c][i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([ab], { type: 'audio/wav' });
}

/**
 * Slice an audio Blob to [startSec, endSec] and return a WAV File.
 * Used for Telegram-style trim-before-send on paused voice recordings.
 */
export async function sliceAudioBlob(blob, startSec, endSec, fileName = `voice_${Date.now()}.wav`) {
  if (!blob) return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  try {
    const raw = await blob.arrayBuffer();
    const decoded = await ctx.decodeAudioData(raw.slice(0));
    const sr = decoded.sampleRate;
    const start = Math.max(0, Math.floor((Number(startSec) || 0) * sr));
    const end = Math.min(decoded.length, Math.floor((Number(endSec) || decoded.duration) * sr));
    const length = Math.max(1, end - start);
    const sliced = ctx.createBuffer(decoded.numberOfChannels, length, sr);
    for (let c = 0; c < decoded.numberOfChannels; c += 1) {
      const src = decoded.getChannelData(c).subarray(start, end);
      sliced.copyToChannel(src, c);
    }
    const wav = audioBufferToWavBlob(sliced);
    return new File([wav], fileName, { type: 'audio/wav' });
  } finally {
    try { await ctx.close(); } catch (e) { /* noop */ }
  }
}

