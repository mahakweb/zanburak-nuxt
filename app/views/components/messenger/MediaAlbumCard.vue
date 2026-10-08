<template>
  <div
    class="album-card"
    :class="[
      isMine ? 'is-mine' : 'is-other',
      flush ? 'is-flush' : '',
    ]"
  >
    <div
      class="album-grid"
      :class="gridClass"
      :style="gridStyle"
      data-media-interactive
    >
      <button
        v-for="cell in cells"
        :key="cell.key"
        type="button"
        class="album-cell"
        :class="cell.layoutClass"
        data-media-interactive
        @click="onCellClick(cell)"
      >
        <!-- Always paint a tile background (destination undownloaded / loading). -->
        <div class="album-ph" :class="{ 'is-glass': cell.placeholder || (!cell.downloaded && !cell.displayThumb && !cell.poster) }" aria-hidden="true" />

        <template v-if="cell.overflow">
          <span class="album-more">+{{ cell.moreCount }}</span>
        </template>
        <template v-else-if="cell.placeholder">
          <!-- Reserved album slot while sibling media is still arriving. -->
          <div class="album-ph-glass" aria-hidden="true" />
        </template>
        <template v-else>
          <!-- Photo preview (blob thumb or local) -->
          <img
            v-if="cell.type === 'photo' && cell.displayThumb"
            :src="cell.displayThumb"
            alt=""
            class="album-img"
            :class="{ 'is-blur': !cell.downloaded && !cell.uploading }"
            draggable="false"
            @error="onThumbError(cell)"
          />

          <!-- Video: poster thumb, else muted frame once downloaded -->
          <template v-else-if="cell.type === 'video'">
            <img
              v-if="cell.poster"
              :src="cell.poster"
              alt=""
              class="album-img"
              :class="{ 'is-blur': !cell.downloaded && !cell.uploading }"
              draggable="false"
              @error="onThumbError(cell)"
            />
            <video
              v-else-if="cell.videoSrc"
              class="album-img"
              :src="cell.videoSrc"
              muted
              playsinline
              preload="metadata"
              @loadeddata="onVideoLoaded(cell, $event)"
            />

            <span v-if="cell.animation" class="album-badge">GIF</span>
            <span v-else-if="cell.durationLabel" class="album-badge">{{ cell.durationLabel }}</span>

            <span
              v-if="!cell.uploading && !cell.downloading && (cell.downloaded || cell.poster || cell.videoSrc) && !cell.animation"
              class="album-play"
              aria-hidden="true"
            >
              <svg class="w-4 h-4 ms-px" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
            </span>
          </template>

          <div v-if="cell.uploading" class="album-overlay">
            <UploadProgressRing
              size="xs"
              :percent="cell.uploadPercent"
              cancelable
              :cancel-label="$t('messenger.cancelUpload')"
              @cancel="$emit('cancel-upload', cell.message)"
            />
          </div>
          <div v-else-if="cell.downloading" class="album-overlay" data-media-interactive>
            <UploadProgressRing
              size="xs"
              :percent="cell.downloadPercent"
              cancelable
              stop-icon
              :cancel-label="$t('messenger.cancel')"
              @cancel="onCancelDownload(cell.message)"
            />
          </div>
          <button
            v-else-if="cell.loadFailed || !cell.downloaded"
            type="button"
            class="album-dl"
            :class="{ 'album-dl--error': cell.loadFailed }"
            data-media-interactive
            :aria-label="cell.loadFailed ? $t('messenger.mediaDownloadFailed') : $t('messenger.download')"
            @click.stop="onDownload(cell.message)"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 20h14" />
            </svg>
          </button>
          <span v-if="cell.loadFailed && !cell.downloading && !cell.uploading" class="album-fail-chip">{{ $t('messenger.mediaDownloadFailed') }}</span>
        </template>
      </button>
    </div>

    <slot name="overlay" />
  </div>
</template>

<script>
import UploadProgressRing from './UploadProgressRing.vue';
import { captureVideoPoster, formatDuration, isImageThumbUrl } from './mediaHelpers';
import { downloadMedia, getCachedBlobUrl, isMediaDownloaded, isEncryptedMediaMessage, requiresBlobPlayback } from './mediaCache';
import { cancelMediaDownload } from './mediaManager';

/** Telegram chat albums show at most 6 tiles; 7+ → 5 visible + "+N" on the 6th. */
const ALBUM_VISIBLE_MAX = 6;

function aspectOf(m) {
  const w = Number(m?.meta?.width) || 0;
  const h = Number(m?.meta?.height) || 0;
  if (w > 0 && h > 0) return h / w;
  return 1;
}

export default {
  name: 'MediaAlbumCard',
  inject: {
    consumeChatAccessoryTap: { default: null },
  },
  components: { UploadProgressRing },
  props: {
    messages: { type: Array, default: () => [] },
    isMine: { type: Boolean, default: false },
    flush: { type: Boolean, default: true },
  },
  emits: ['open-lightbox', 'download', 'cancel-upload'],
  data() {
    return {
      localSrc: {},
      ready: {},
      posters: {},
      posterBusy: {},
      downloading: {},
      downloadPercent: {},
      downloadGen: {},
      loadFailed: {},
      thumbBroken: {},
      /** Auth/proxy thumbs hydrated to blob: (or clear http) for <img>. */
      thumbSrc: {},
      thumbLoading: {},
      thumbBusy: {},
    };
  },
  computed: {
    totalCount() {
      return this.messages.length;
    },
    /** Messages actually laid out in the grid (Telegram cap). */
    visibleMessages() {
      const list = this.messages || [];
      if (list.length <= ALBUM_VISIBLE_MAX) return list;
      return list.slice(0, ALBUM_VISIBLE_MAX - 1);
    },
    overflowCount() {
      const n = this.totalCount;
      if (n <= ALBUM_VISIBLE_MAX) return 0;
      return n - (ALBUM_VISIBLE_MAX - 1);
    },
    count() {
      return this.visibleMessages.length + (this.overflowCount > 0 ? 1 : 0);
    },
    gridClass() {
      const n = this.count;
      if (n <= 1) return 'cols-1';
      if (n === 2) return 'cols-2';
      if (n === 3) return this.mosaic3Class;
      if (n === 4) return 'cols-2';
      if (n === 5) return 'cols-5-mosaic';
      return 'cols-3';
    },
    mosaic3Class() {
      const first = aspectOf(this.visibleMessages[0]);
      if (first >= 1.15) return 'cols-3-stack';
      return 'cols-3-mosaic';
    },
    gridStyle() {
      const n = this.count;
      const aspects = this.visibleMessages.map(aspectOf);
      if (!aspects.length) aspects.push(1);
      const avg = aspects.reduce((s, a) => s + a, 0) / Math.max(1, aspects.length);
      const maxA = Math.max(...aspects, 0.6);
      const minA = Math.min(...aspects, 1.4);
      let row;
      if (n <= 1) {
        const h = Math.round(Math.min(420, Math.max(180, 320 * (aspects[0] || 0.75))));
        return { '--album-row': `${h}px` };
      }
      if (n === 2) {
        row = Math.round(Math.min(248, Math.max(148, 158 * Math.min(maxA, 1.55))));
      } else if (n === 3) {
        row = this.mosaic3Class === 'cols-3-stack'
          ? Math.round(Math.min(140, Math.max(112, 118 * Math.min(avg, 1.3))))
          : Math.round(Math.min(150, Math.max(108, 122 * Math.min(avg, 1.25))));
      } else if (n === 4) {
        row = Math.round(Math.min(156, Math.max(118, minA < 0.7 ? 148 : 128)));
      } else if (n === 5) {
        row = Math.round(Math.min(118, Math.max(96, 104)));
      } else {
        row = maxA > 1.35 ? 92 : (minA < 0.75 ? 108 : 100);
      }
      return { '--album-row': `${row}px` };
    },
    cells() {
      const n = this.count;
      const mosaic3 = n === 3 ? this.mosaic3Class : '';
      const visible = this.visibleMessages;
      const cells = visible.map((m, idx) => this.buildCell(m, idx, n, mosaic3));
      if (this.overflowCount > 0) {
        const last = this.messages[ALBUM_VISIBLE_MAX - 1] || this.messages[this.messages.length - 1];
        cells.push({
          ...this.buildCell(last, cells.length, n, mosaic3),
          key: 'overflow',
          overflow: true,
          moreCount: this.overflowCount,
          downloaded: true,
          uploading: false,
          downloading: false,
        });
      }
      return cells;
    },
  },
  watch: {
    messages: {
      immediate: true,
      deep: true,
      handler() {
        this.hydrateCache();
        this.hydrateThumbs();
      },
    },
    cells: {
      immediate: true,
      handler(list) {
        (list || []).forEach((cell) => {
          if (cell.overflow) return;
          if (cell.type === 'video' && !cell.poster && cell.videoSrc) {
            this.ensurePoster(cell);
          }
        });
      },
    },
  },
  beforeUnmount() {
    Object.values(this.posters).forEach((url) => {
      // Only revoke posters we captured locally (canvas → blob), not shared cache thumbs.
      if (url && String(url).startsWith('blob:') && !Object.values(this.thumbSrc).includes(url)) {
        try { URL.revokeObjectURL(url); } catch (e) { /* noop */ }
      }
    });
  },
  methods: {
    buildCell(m, idx, n, mosaic3) {
      const meta = m.meta || {};
      const type = m.type === 'video' ? 'video' : 'photo';
      const id = String(m.id || m.client_id);
      const placeholder = !!meta._album_placeholder;
      const uploading = !placeholder && !!m.pending && !m.failed;
      const local = this.localSrc[id] || meta.local_url || null;
      const remote = meta.url && !String(meta.url).startsWith('blob:') ? meta.url : null;
      const encrypted = isEncryptedMediaMessage(m);
      const hasBlobLocal = !!(local && String(local).startsWith('blob:'));
      const cachedReady = !!(this.ready[id] && hasBlobLocal);
      const downloaded = placeholder
        ? false
        : (encrypted || requiresBlobPlayback(remote, m)
          ? !!(cachedReady || hasBlobLocal || (this.ready[id] && this.localSrc[id]))
          : !!(remote || local || this.ready[id] || (meta.url && isMediaDownloaded(meta.url))));

      let mediaUrl = uploading ? (local || remote) : (local || null);
      if (!placeholder && !encrypted && !requiresBlobPlayback(remote, m)) {
        mediaUrl = uploading ? (local || remote) : (remote || local);
      }
      if (!mediaUrl && downloaded) mediaUrl = this.localSrc[id] || local || null;
      if (!mediaUrl && uploading) mediaUrl = local || null;
      if (!mediaUrl && this.isMine && !encrypted) mediaUrl = remote || local || meta.url || null;

      // Prefer hydrated blob thumb; never paint raw /messenger/media ciphertext in <img>.
      let displayThumb = null;
      if (!placeholder && !this.thumbBroken[id]) {
        const hydrated = this.thumbSrc[id] || null;
        if (hydrated) {
          displayThumb = hydrated;
        } else if (type === 'photo') {
          if (local && String(local).startsWith('blob:')) {
            displayThumb = local;
          } else if (meta.thumb_url && !requiresBlobPlayback(meta.thumb_url, m)) {
            displayThumb = meta.thumb_url;
          } else if (mediaUrl && !requiresBlobPlayback(mediaUrl, m)) {
            displayThumb = mediaUrl;
          }
        }
      }

      const poster = placeholder
        ? null
        : (this.posters[id]
        || this.thumbSrc[id]
        || (isImageThumbUrl(meta.thumb_url) && !requiresBlobPlayback(meta.thumb_url, m) ? meta.thumb_url : null)
        || (isImageThumbUrl(meta.cover_url) && !requiresBlobPlayback(meta.cover_url, m) ? meta.cover_url : null)
        || null);

      const videoSrc = type === 'video'
        ? ((mediaUrl && String(mediaUrl).startsWith('blob:')) ? mediaUrl : (local && String(local).startsWith('blob:') ? local : null))
        : null;

      const aspect = aspectOf(m);
      const isTall = aspect >= 1.25;

      let layoutClass = '';
      if (n === 3 && mosaic3 === 'cols-3-mosaic') {
        if (idx === 2) layoutClass = 'span-full is-bottom';
      } else if (n === 3 && mosaic3 === 'cols-3-stack') {
        if (idx === 0) layoutClass = 'is-lead';
      } else if (n === 5) {
        if (idx === 0) layoutClass = 'span-2 is-lead';
      } else if (n >= 6 && isTall && idx >= n - 2) {
        layoutClass = 'is-tall';
      }

      return {
        key: id,
        id,
        message: m,
        type,
        placeholder,
        displayThumb,
        poster,
        videoSrc,
        src: mediaUrl || meta.url || null,
        downloaded: downloaded || !!(this.isMine && (meta.local_url || meta.url)),
        uploading,
        uploadPercent: Number(m.upload_progress) || 0,
        downloading: !!this.downloading[id],
        downloadPercent: Number(this.downloadPercent[id]) || 0,
        thumbLoading: !!this.thumbLoading[id],
        loadFailed: !!this.loadFailed[id],
        animation: !!(meta.animation || meta.silent),
        durationLabel: meta.duration != null ? formatDuration(meta.duration) : '',
        layoutClass,
        overflow: false,
        moreCount: 0,
      };
    },
    previewRemoteFor(m) {
      const meta = m?.meta || {};
      const encrypted = isEncryptedMediaMessage(m);
      // E2E: no cleartext thumb — keep placeholder until full decrypt/download.
      if (encrypted) return null;
      if (m.type === 'photo') return meta.thumb_url || null;
      if (m.type === 'video') {
        if (meta.thumb_url) return meta.thumb_url;
        if (meta.cover_url && isImageThumbUrl(meta.cover_url)) return meta.cover_url;
        return null;
      }
      return meta.thumb_url || null;
    },
    async hydrateThumbs() {
      for (const m of this.messages || []) {
        if (!m || (m.type !== 'photo' && m.type !== 'video')) continue;
        if (m?.meta?._album_placeholder) continue;
        const id = String(m.id || m.client_id);
        if (!id || this.thumbSrc[id] || this.thumbBusy[id] || this.thumbBroken[id]) continue;

        const meta = m.meta || {};
        const local = meta.local_url || null;
        if (local && (String(local).startsWith('blob:') || String(local).startsWith('data:'))) {
          this.thumbSrc = { ...this.thumbSrc, [id]: local };
          continue;
        }

        const remote = this.previewRemoteFor(m);
        if (!remote) continue;

        // Public/clear URL can paint directly.
        if (!requiresBlobPlayback(remote, m)) {
          this.thumbSrc = { ...this.thumbSrc, [id]: remote };
          continue;
        }

        this.thumbBusy = { ...this.thumbBusy, [id]: true };
        this.thumbLoading = { ...this.thumbLoading, [id]: true };
        try {
          const cached = await getCachedBlobUrl(remote);
          if (cached) {
            this.thumbSrc = { ...this.thumbSrc, [id]: cached };
            continue;
          }
          const { blobUrl } = await downloadMedia(remote, { message: m });
          if (blobUrl) {
            this.thumbSrc = { ...this.thumbSrc, [id]: blobUrl };
          }
        } catch (e) {
          /* leave placeholder */
        } finally {
          const busy = { ...this.thumbBusy };
          delete busy[id];
          this.thumbBusy = busy;
          const loading = { ...this.thumbLoading };
          delete loading[id];
          this.thumbLoading = loading;
        }
      }
    },
    async hydrateCache() {
      for (const m of this.messages) {
        if (m?.meta?._album_placeholder) continue;
        const id = String(m.id || m.client_id);
        if (this.localSrc[id] && String(this.localSrc[id]).startsWith('blob:')) continue;
        if (m?.meta?.local_url && String(m.meta.local_url).startsWith('blob:')) {
          this.localSrc = { ...this.localSrc, [id]: m.meta.local_url };
          this.ready = { ...this.ready, [id]: true };
          continue;
        }
        const url = m?.meta?.url;
        if (!url) continue;
        try {
          const obj = await getCachedBlobUrl(url);
          if (obj) {
            this.localSrc = { ...this.localSrc, [id]: obj };
            this.ready = { ...this.ready, [id]: true };
            if (!this.thumbSrc[id]) {
              this.thumbSrc = { ...this.thumbSrc, [id]: obj };
            }
          }
        } catch (e) { /* noop */ }
      }
    },
    async ensurePoster(cell) {
      const id = cell.id;
      if (!id || this.posters[id] || this.posterBusy[id]) return;
      const src = cell.videoSrc;
      if (!src) return;
      this.posterBusy = { ...this.posterBusy, [id]: true };
      try {
        const cacheKey = cell.message?.meta?.url || src;
        const poster = await captureVideoPoster(src, { cacheKey });
        if (poster) {
          this.posters = { ...this.posters, [id]: poster };
        }
      } finally {
        const next = { ...this.posterBusy };
        delete next[id];
        this.posterBusy = next;
      }
    },
    onVideoLoaded(cell, event) {
      if (cell.poster || !cell.id || this.posters[cell.id]) return;
      const video = event?.target;
      if (!video || !video.videoWidth) return;
      try {
        const canvas = document.createElement('canvas');
        const maxEdge = 640;
        const scale = Math.min(1, maxEdge / Math.max(video.videoWidth, video.videoHeight));
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob || this.posters[cell.id]) return;
          this.posters = { ...this.posters, [cell.id]: URL.createObjectURL(blob) };
        }, 'image/jpeg', 0.72);
      } catch (e) { /* noop */ }
    },
    onThumbError(cell) {
      if (!cell?.id) return;
      this.thumbBroken = { ...this.thumbBroken, [cell.id]: true };
    },
    async onDownload(message) {
      const url = message?.meta?.url;
      if (!url) return;
      const id = String(message.id || message.client_id);
      if (this.downloading[id]) return;
      this.downloading = { ...this.downloading, [id]: true };
      this.downloadPercent = { ...this.downloadPercent, [id]: 0 };
      const failed = { ...this.loadFailed };
      delete failed[id];
      this.loadFailed = failed;
      const gen = (this.downloadGen?.[id] || 0) + 1;
      this.downloadGen = { ...(this.downloadGen || {}), [id]: gen };
      try {
        const res = await downloadMedia(url, {
          message,
          progressive: message?.type === 'video',
          preferSigned: true,
          onProgress: (ratio) => {
            if (this.downloadGen?.[id] !== gen) return;
            const pct = Math.max(1, Math.min(99, Math.round((Number(ratio) || 0) * 100)));
            this.downloadPercent = { ...this.downloadPercent, [id]: pct };
          },
        });
        if (this.downloadGen?.[id] !== gen) return;
        const src = res?.blobUrl || (await getCachedBlobUrl(url));
        if (!src) throw new Error('download empty');
        this.localSrc = { ...this.localSrc, [id]: src };
        this.ready = { ...this.ready, [id]: true };
        if (!this.thumbSrc[id]) {
          this.thumbSrc = { ...this.thumbSrc, [id]: src };
        }
        if (message.type === 'video' && !this.posters[id]) {
          this.ensurePoster({ id, type: 'video', videoSrc: src, poster: null });
        }
      } catch (e) {
        if (this.downloadGen?.[id] !== gen) return;
        if (e?.name === 'AbortError') return;
        this.loadFailed = { ...this.loadFailed, [id]: true };
      } finally {
        if (this.downloadGen?.[id] === gen) {
          const next = { ...this.downloading };
          delete next[id];
          this.downloading = next;
          const pct = { ...this.downloadPercent };
          delete pct[id];
          this.downloadPercent = pct;
        }
      }
    },
    onCancelDownload(message) {
      const url = message?.meta?.url;
      const id = String(message?.id || message?.client_id || '');
      if (id) {
        this.downloadGen = { ...(this.downloadGen || {}), [id]: (this.downloadGen?.[id] || 0) + 1 };
        const next = { ...this.downloading };
        delete next[id];
        this.downloading = next;
        const pct = { ...this.downloadPercent };
        delete pct[id];
        this.downloadPercent = pct;
      }
      if (url) cancelMediaDownload(url, { persist: true });
    },
    onCellClick(cell) {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      if (cell.placeholder || cell.message?.meta?._album_placeholder) return;
      if (cell.overflow) {
        // Open lightbox starting at the first hidden item (Telegram "+N").
        const start = this.messages[ALBUM_VISIBLE_MAX - 1] || this.messages[0];
        if (!start) return;
        if (!this.isCellDownloaded(start)) {
          this.onDownload(start);
          return;
        }
        const src = start.meta?.local_url || this.localSrc[String(start.id || start.client_id)] || start.meta?.url;
        if (!src) return;
        this.$emit('open-lightbox', {
          src,
          type: start.type === 'video' ? 'video' : 'photo',
          message: start,
          album: this.messages,
        });
        return;
      }
      if (cell.uploading || cell.downloading) return;
      if (!cell.downloaded) {
        this.onDownload(cell.message);
        this.$emit('download', cell.message);
        return;
      }
      const src = cell.src
        || cell.videoSrc
        || cell.message?.meta?.url
        || cell.message?.meta?.local_url;
      if (!src) return;
      this.$emit('open-lightbox', {
        src,
        type: cell.type,
        message: cell.message,
        album: this.messages,
      });
    },
    isCellDownloaded(m) {
      const id = String(m.id || m.client_id);
      return !!(this.ready[id] || this.localSrc[id] || m?.meta?.local_url);
    },
  },
};
</script>

<style scoped>
.album-card {
  position: relative;
  width: 100%;
  max-width: 320px;
  min-width: 0;
  overflow: hidden;
  border-radius: inherit;
}
.album-card.is-flush {
  width: 100%;
  max-width: 320px;
}
.album-grid {
  display: grid;
  gap: 1.5px;
  background: rgba(15, 23, 42, 0.35);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  grid-auto-rows: var(--album-row, 108px);
  align-content: start;
}
.album-grid.cols-1 {
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: var(--album-row, 240px);
}
.album-grid.cols-2 {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: var(--album-row, 180px);
}
.album-grid.cols-2 .album-cell {
  height: var(--album-row, 180px);
  max-height: var(--album-row, 180px);
}
.album-grid.cols-3 {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
}
.album-grid.cols-3-mosaic {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}
.album-grid.cols-3-stack {
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  grid-template-rows: var(--album-row, 120px) var(--album-row, 120px);
}
.album-grid.cols-3-stack .album-cell.is-lead {
  grid-row: 1 / span 2;
}
.album-grid.cols-5-mosaic {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
}
.album-cell {
  position: relative;
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #1a2433;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  color: inherit;
  isolation: isolate;
  box-sizing: border-box;
  align-self: stretch;
  justify-self: stretch;
}
.album-cell.span-full {
  grid-column: 1 / -1;
}
.album-cell.span-2 {
  grid-column: span 2;
}
.album-cell.is-tall {
  grid-row: span 2;
}
.album-cell.is-bottom {
  min-height: calc(var(--album-row, 108px) * 1.12);
}
.album-cell.is-lead {
  min-height: 0;
}
.album-img {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: transparent;
  pointer-events: none;
}
.album-img.is-blur {
  filter: blur(8px) saturate(0.85);
  transform: scale(1.08);
  transform-origin: center center;
}
.album-ph {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #243447 0%, #15202b 48%, #0f1720 100%);
  pointer-events: none;
}
.album-ph.is-glass,
.album-ph-glass {
  background:
    linear-gradient(145deg, rgba(80, 110, 140, 0.28) 0%, rgba(30, 45, 60, 0.55) 45%, rgba(18, 28, 38, 0.72) 100%);
  backdrop-filter: blur(18px) saturate(1.15);
  -webkit-backdrop-filter: blur(18px) saturate(1.15);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}
.album-ph-glass {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  animation: album-ph-pulse 1.4s ease-in-out infinite;
}
@keyframes album-ph-pulse {
  0%, 100% { opacity: 0.78; }
  50% { opacity: 1; }
}
.album-more {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.48);
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.02em;
  z-index: 4;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}
.album-badge {
  position: absolute;
  bottom: 5px;
  inset-inline-start: 5px;
  z-index: 2;
  font-size: 9.5px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  direction: ltr;
}
.album-play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.42);
  color: #fff;
  pointer-events: none;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
  z-index: 2;
}
.album-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 3;
  box-sizing: border-box;
}
.album-overlay :deep(.up-ring) {
  max-width: calc(100% - 2px);
  max-height: calc(100% - 2px);
}
.album-dl {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 34px;
  height: 34px;
  margin: 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  backdrop-filter: blur(4px);
  z-index: 3;
}
.album-dl--error {
  background: rgba(185, 28, 28, 0.82);
}
.album-fail-chip {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  max-width: calc(100% - 8px);
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 8px;
  font-weight: 700;
  line-height: 1.15;
  color: #fff;
  background: rgba(185, 28, 28, 0.88);
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
