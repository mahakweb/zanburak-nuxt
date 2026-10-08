/**
 * Telegram-style auto-download / auto-play helpers for messenger settings.
 */

export const AUTO_DOWNLOAD_CONTEXTS = ['private', 'groups', 'channels'];
export const AUTO_DOWNLOAD_MEDIA = ['photos', 'videos', 'files', 'voice', 'audio'];

export function emptyMediaFlags() {
  return {
    photos: false,
    videos: false,
    files: false,
    voice: false,
    audio: false,
  };
}

export function defaultAutoDownload() {
  return {
    private: emptyMediaFlags(),
    groups: emptyMediaFlags(),
    channels: emptyMediaFlags(),
  };
}

export function defaultAutoPlay() {
  return { gifs: true, videos: false };
}

/** Normalize API / local settings into nested auto_download. */
export function normalizeAutoDownload(raw, legacy = {}) {
  const base = defaultAutoDownload();
  if (raw && typeof raw === 'object') {
    AUTO_DOWNLOAD_CONTEXTS.forEach((ctx) => {
      const slice = raw[ctx] && typeof raw[ctx] === 'object' ? raw[ctx] : null;
      if (!slice) return;
      AUTO_DOWNLOAD_MEDIA.forEach((key) => {
        if (slice[key] != null) base[ctx][key] = !!slice[key];
      });
    });
    return base;
  }
  // Legacy flat → all contexts
  const flat = {
    photos: !!legacy.auto_download_photos,
    videos: !!legacy.auto_download_videos,
    files: !!legacy.auto_download_files,
    voice: !!legacy.auto_download_voice,
    audio: !!legacy.auto_download_audio,
  };
  AUTO_DOWNLOAD_CONTEXTS.forEach((ctx) => {
    base[ctx] = { ...flat };
  });
  return base;
}

export function normalizeAutoPlay(raw) {
  const base = defaultAutoPlay();
  if (raw && typeof raw === 'object') {
    if (raw.gifs != null) base.gifs = !!raw.gifs;
    if (raw.videos != null) base.videos = !!raw.videos;
  }
  return base;
}

/** Map chat type → auto-download context key. */
export function chatTypeToDownloadContext(chatType) {
  const t = String(chatType || 'private');
  if (t === 'group') return 'groups';
  if (t === 'channel') return 'channels';
  return 'private'; // private | saved | draft
}

/** Media message type → settings key. */
export function mediaTypeToDownloadKey(type) {
  switch (String(type || '')) {
    case 'photo': return 'photos';
    case 'video': return 'videos';
    case 'file': return 'files';
    case 'voice': return 'voice';
    case 'audio': return 'audio';
    default: return null;
  }
}

export function isAutoDownloadEnabled(settings, chatType, mediaType) {
  const ctx = chatTypeToDownloadContext(chatType);
  const key = mediaTypeToDownloadKey(mediaType);
  if (!key) return false;
  const ad = settings?.auto_download;
  if (ad && typeof ad === 'object' && ad[ctx]) {
    return !!ad[ctx][key];
  }
  // Legacy flat fallback
  const legacyKey = `auto_download_${key}`;
  return !!settings?.[legacyKey];
}

export function isAutoPlayEnabled(settings, kind) {
  const ap = settings?.auto_play || defaultAutoPlay();
  if (kind === 'gif' || kind === 'gifs') return ap.gifs !== false;
  if (kind === 'video' || kind === 'videos') return !!ap.videos;
  return false;
}

/** Short summary for a context row (e.g. "Photos, Voice"). */
export function autoDownloadContextSummary(settings, context, t) {
  const slice = settings?.auto_download?.[context] || emptyMediaFlags();
  const labels = [];
  if (slice.photos) labels.push(t('messenger.autoDownloadPhotos'));
  if (slice.videos) labels.push(t('messenger.autoDownloadVideos'));
  if (slice.files) labels.push(t('messenger.autoDownloadFiles'));
  if (slice.voice) labels.push(t('messenger.autoDownloadVoice'));
  if (slice.audio) labels.push(t('messenger.autoDownloadAudio'));
  if (!labels.length) return t('messenger.autoDownloadOff');
  if (labels.length === 5) return t('messenger.autoDownloadAll');
  return labels.join('، ');
}
