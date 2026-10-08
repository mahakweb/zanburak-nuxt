<template>
  <div
    ref="root"
    class="tg-player"
    :class="{
      'is-fs': isFullscreen,
      'is-ready': !!playSrc,
      'is-playing': playing,
      'is-downloading': downloading,
    }"
    @mousemove="onActivity"
    @touchstart.passive="onActivity"
  >
    <video
      ref="video"
      class="tg-video"
      playsinline
      webkit-playsinline
      :poster="poster || undefined"
      preload="auto"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onMeta"
      @durationchange="onMeta"
      @loadeddata="onLoadedData"
      @waiting="buffering = true"
      @playing="onPlaying"
      @pause="onPause"
      @canplay="buffering = false"
      @ended="onEnded"
      @click.stop="onVideoClick"
    />

    <!-- Center: download progress only while not yet playable -->
    <button
      v-if="downloading && !playSrc"
      type="button"
      class="tg-center-btn tg-glass"
      :aria-label="cancelLabel"
      @click.stop="cancelDownload"
    >
      <svg class="tg-ring-svg" viewBox="0 0 48 48" aria-hidden="true">
        <circle class="tg-ring-track" cx="24" cy="24" r="20" fill="none" stroke-width="3" />
        <circle
          class="tg-ring-prog"
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke-width="3"
          stroke-linecap="round"
          :stroke-dasharray="ringCirc"
          :stroke-dashoffset="ringOffset"
        />
      </svg>
      <span class="tg-stop" aria-hidden="true" />
    </button>

    <!-- Corner glass download badge while streaming + background cache -->
    <button
      v-else-if="downloading && playSrc"
      type="button"
      class="tg-corner-dl tg-glass"
      :aria-label="cancelLabel"
      @click.stop="cancelDownload"
    >
      <svg class="tg-ring-svg tg-ring-svg--sm" viewBox="0 0 48 48" aria-hidden="true">
        <circle class="tg-ring-track" cx="24" cy="24" r="20" fill="none" stroke-width="3.5" />
        <circle
          class="tg-ring-prog"
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke-width="3.5"
          stroke-linecap="round"
          :stroke-dasharray="ringCirc"
          :stroke-dashoffset="ringOffset"
        />
      </svg>
      <span class="tg-stop tg-stop--sm" aria-hidden="true" />
    </button>

    <!-- Center: buffering while progressive play -->
    <div v-else-if="buffering && playSrc && playing" class="tg-center-btn tg-glass tg-buffer-only" aria-hidden="true">
      <span class="tg-spinner" />
    </div>

    <!-- Center: play -->
    <button
      v-else-if="!playing"
      type="button"
      class="tg-center-btn tg-glass"
      :aria-label="'Play'"
      @click.stop="onPlayClick"
    >
      <svg class="tg-play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5.14v13.72L19 12 8 5.14z" />
      </svg>
    </button>

    <!-- Bottom glass chrome (Telegram-like) -->
    <div class="tg-chrome" :class="{ 'is-visible': showChrome || !playing || downloading }">
      <div class="tg-seek-wrap" @pointerdown.stop.prevent="onSeekPointer">
        <div class="tg-seek-track">
          <div class="tg-seek-buf" :style="{ width: `${bufferRatio * 100}%` }" />
          <div class="tg-seek-fill" :style="{ width: `${progressRatio * 100}%` }" />
        </div>
      </div>
      <div class="tg-chrome-row">
        <span class="tg-time">{{ timeLabel }}</span>
        <div class="tg-chrome-actions">
          <button type="button" class="tg-chip" @click.stop="cycleSpeed">{{ speedLabel }}</button>
          <button
            v-if="pipSupported"
            type="button"
            class="tg-icon-btn"
            :aria-label="'Picture in picture'"
            @click.stop="togglePiP"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[18px] h-[18px]">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <rect x="12" y="11" width="7" height="5" rx="1" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <button type="button" class="tg-icon-btn" :aria-label="'Fullscreen'" @click.stop="toggleFullscreen">
            <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[18px] h-[18px]">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[18px] h-[18px]">
              <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCachedBlobUrl,
  isMediaDownloaded,
  isEncryptedMediaMessage,
} from './mediaCache';
import {
  startMediaDownload,
  cancelMediaDownload,
  subscribeMediaTask,
  getMediaTaskState,
  attachHlsPlayback,
} from './mediaManager';
import { formatDuration } from './mediaHelpers';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const RING_R = 20;
const RING_CIRC = 2 * Math.PI * RING_R;

export default {
  name: 'MessengerMediaPlayer',
  props: {
    /** Initial playable src (blob / local). May be empty if not downloaded yet. */
    src: { type: String, default: '' },
    /** Remote API/CDN url for progressive download. */
    remoteUrl: { type: String, default: '' },
    poster: { type: String, default: '' },
    autoplay: { type: Boolean, default: false },
    message: { type: Object, default: null },
    /** External trigger: parent wants to start/cancel download. */
    downloadRequest: { type: Number, default: 0 },
  },
  emits: ['ended', 'timeupdate', 'play', 'pause', 'download-state', 'ready'],
  data() {
    return {
      playSrc: '',
      playing: false,
      buffering: false,
      downloading: false,
      downloadPercent: 0,
      current: 0,
      duration: 0,
      bufferRatio: 0,
      speed: 1,
      showChrome: true,
      isFullscreen: false,
      pipSupported: false,
      hideTimer: 0,
      streamSession: null,
      complete: false,
      wantPlay: false,
      downloadGeneration: 0,
      unsubDl: null,
      hlsHandle: null,
    };
  },
  computed: {
    cancelLabel() {
      return this.$t?.('messenger.cancel') || 'Cancel';
    },
    metaDuration() {
      const d = Number(this.message?.meta?.duration);
      return Number.isFinite(d) && d > 0 ? d : 0;
    },
    effectiveDuration() {
      if (Number.isFinite(this.duration) && this.duration > 0 && this.duration !== Infinity) {
        return this.duration;
      }
      return this.metaDuration;
    },
    progressRatio() {
      const d = this.effectiveDuration;
      if (!d) return 0;
      return Math.max(0, Math.min(1, this.current / d));
    },
    timeLabel() {
      const cur = formatDuration(this.current || 0);
      const dur = this.effectiveDuration > 0 ? formatDuration(this.effectiveDuration) : '--:--';
      return `${cur} / ${dur}`;
    },
    speedLabel() {
      return `${this.speed}x`;
    },
    ringCirc() {
      return RING_CIRC;
    },
    ringOffset() {
      const p = Math.max(0, Math.min(99, this.downloadPercent)) / 100;
      return RING_CIRC * (1 - p);
    },
    resolvedRemote() {
      if (this.remoteUrl && !String(this.remoteUrl).startsWith('blob:')) return this.remoteUrl;
      const u = this.message?.meta?.url;
      if (u && !String(u).startsWith('blob:')) return u;
      return '';
    },
  },
  watch: {
    src: {
      immediate: true,
      handler(v) {
        if (v && String(v).startsWith('blob:')) {
          this.applyPlaySrc(v, { complete: true });
        }
      },
    },
    downloadRequest(n, prev) {
      if (n && n !== prev) this.toggleDownload();
    },
    message: {
      immediate: true,
      handler() {
        this.bootstrap();
      },
    },
  },
  mounted() {
    this.pipSupported = !!(document.pictureInPictureEnabled);
    document.addEventListener('fullscreenchange', this.onFsChange);
    document.addEventListener('webkitfullscreenchange', this.onFsChange);
    this.bootstrap();
    if (this.autoplay) this.onPlayClick();
    this.scheduleHide();
  },
  beforeUnmount() {
    // Do not cancel the network task on close — Telegram keeps caching in background.
    // User must press Stop to abort.
    if (this.unsubDl) this.unsubDl();
    if (this.hlsHandle) {
      try { this.hlsHandle.destroy(); } catch (e) { /* noop */ }
      this.hlsHandle = null;
    }
    document.removeEventListener('fullscreenchange', this.onFsChange);
    document.removeEventListener('webkitfullscreenchange', this.onFsChange);
    if (this.hideTimer) clearTimeout(this.hideTimer);
  },
  methods: {
    emitState() {
      this.$emit('download-state', {
        downloading: this.downloading,
        percent: this.downloadPercent,
        complete: this.complete,
        playSrc: this.playSrc,
      });
    },
    bindDownloadSubscription(remote) {
      if (this.unsubDl) {
        this.unsubDl();
        this.unsubDl = null;
      }
      if (!remote) return;
      this.unsubDl = subscribeMediaTask(remote, (s) => {
        if (!s || s.url !== remote) return;
        if (s.downloading) {
          this.downloading = true;
          this.downloadPercent = s.percent || this.downloadPercent;
          this.bufferRatio = Math.max(this.bufferRatio, s.progress || 0);
          // Apply playable src as soon as signed/HLS/partial is ready — don't wait for full cache.
          if (s.playSrc && (!this.playSrc || s.complete || s.mode === 'signed' || s.mode === 'hls')) {
            this.applyPlaySrc(s.playSrc, {
              complete: s.complete,
              force: !this.playSrc,
              mode: s.mode,
            });
          }
        } else if (s.complete) {
          this.complete = true;
          this.downloading = false;
          this.downloadPercent = 100;
          this.bufferRatio = 1;
          if (s.playSrc) {
            this.applyPlaySrc(s.playSrc, { complete: true, force: false, mode: s.mode });
          }
        } else if (s.cancelled || s.paused) {
          this.downloading = false;
        }
        this.emitState();
      });
    },
    async bootstrap() {
      const remote = this.resolvedRemote;
      this.bindDownloadSubscription(remote);
      // Prefer fully cached blob — no streaming needed.
      if (remote) {
        try {
          const cached = await getCachedBlobUrl(remote);
          if (cached) {
            this.applyPlaySrc(cached, { complete: true });
            this.emitState();
            return;
          }
        } catch (e) { /* noop */ }
        const task = getMediaTaskState(remote);
        if (task.downloading) {
          this.downloading = true;
          this.downloadPercent = task.percent;
          if (task.playSrc) this.applyPlaySrc(task.playSrc, { complete: false, mode: task.mode });
          this.emitState();
          return;
        }
      }
      if (this.src && String(this.src).startsWith('blob:')) {
        this.applyPlaySrc(this.src, { complete: isMediaDownloaded(remote) });
        this.emitState();
        return;
      }
      // Not cached: wait for user play/download. Use meta duration for chrome.
      if (this.metaDuration) this.duration = this.metaDuration;
      this.emitState();
    },
    applyPlaySrc(url, { complete = false, force = false, mode = null } = {}) {
      if (!url) return;
      const video = this.$refs.video;
      const prev = this.playSrc;
      const same = prev && prev === url;
      this.complete = !!complete || this.complete;

      // Already playing this URL — just update complete flag.
      if (same && video && video.src && !force) {
        this.playSrc = url;
        this.$emit('ready', { src: url, complete: this.complete });
        return;
      }

      // Don't replace a working signed/https src with a growing blob mid-play.
      if (
        !force
        && !complete
        && prev
        && /^https?:/i.test(prev)
        && String(url).startsWith('blob:')
      ) {
        return;
      }

      // Don't thrash: if already playing a blob and this is another partial, ignore.
      if (
        !force
        && !complete
        && this.playing
        && prev
        && String(prev).startsWith('blob:')
        && String(url).startsWith('blob:')
        && prev !== url
      ) {
        return;
      }

      this.playSrc = url;
      if (video) {
        const t = video.currentTime || 0;
        const wasPlaying = !video.paused && this.playing;
        try {
          video.pause();
        } catch (e) { /* noop */ }
        // Clear previous src/source nodes so the demuxer fully re-inits (fixes audio-only).
        try {
          video.removeAttribute('src');
          while (video.firstChild) video.removeChild(video.firstChild);
        } catch (e) { /* noop */ }

        if (this.hlsHandle) {
          try { this.hlsHandle.destroy(); } catch (e) { /* noop */ }
          this.hlsHandle = null;
        }

        const isHls = mode === 'hls'
          || /\.m3u8(\?|$)/i.test(String(url))
          || String(url).includes('/hls/');

        const finishAttach = () => {
          video.playbackRate = this.speed;
          const restore = () => {
            if (t > 0.25 && Number.isFinite(video.duration) && video.duration > t) {
              try { video.currentTime = t; } catch (err) { /* noop */ }
            }
            if (wasPlaying || this.wantPlay) {
              video.play().then(() => {
                this.playing = true;
                this.buffering = false;
              }).catch(() => {});
            }
          };
          video.addEventListener('loadeddata', restore, { once: true });
          video.addEventListener('loadedmetadata', () => { this.onMeta(); }, { once: true });
        };

        if (isHls) {
          attachHlsPlayback(video, url, {
            url: this.resolvedRemote,
            onError: () => { this.buffering = false; },
          }).then((handle) => {
            this.hlsHandle = handle;
            finishAttach();
          }).catch(() => {
            video.src = url;
            video.load();
            finishAttach();
          });
        } else {
          const mime = this.message?.meta?.mime;
          if (String(url).startsWith('blob:') && mime && String(mime).startsWith('video/')) {
            const source = document.createElement('source');
            source.src = url;
            source.type = mime;
            video.appendChild(source);
          } else {
            video.src = url;
          }
          video.load();
          finishAttach();
        }
      }
      this.$emit('ready', { src: url, complete: this.complete });
    },
    onLoadedData() {
      // First decoded frame available — clear buffering overlay.
      this.buffering = false;
    },
    onPlayClick() {
      this.wantPlay = true;
      if (this.playSrc) {
        this.togglePlay();
        return;
      }
      // Start progressive stream + play as soon as first chunk is ready.
      this.startProgressive({ play: true });
    },
    onVideoClick() {
      // Allow play/pause once a stream is playable, even while background-caching.
      if (this.downloading && !this.playSrc) return;
      if (!this.playSrc) {
        this.onPlayClick();
        return;
      }
      this.togglePlay();
      this.onActivity();
    },
    togglePlay() {
      const video = this.$refs.video;
      if (!video || !this.playSrc) return;
      if (video.paused) {
        video.play().then(() => {
          this.playing = true;
          this.$emit('play');
        }).catch(() => {
          this.buffering = true;
        });
      } else {
        video.pause();
        this.playing = false;
        this.$emit('pause');
      }
    },
    toggleDownload() {
      if (this.complete && this.playSrc) return;
      if (this.downloading) {
        this.cancelDownload();
        return;
      }
      this.startProgressive({ play: false });
    },
    startProgressive({ play = false } = {}) {
      const remote = this.resolvedRemote;
      if (!remote) {
        // Public / already-local src
        if (this.src) {
          this.applyPlaySrc(this.src, { complete: true, force: true });
          if (play) this.$nextTick(() => this.togglePlay());
        }
        return;
      }
      if (isEncryptedMediaMessage(this.message) && !(this.message?._mediaKey && this.message?._mediaIv)) {
        return;
      }

      this.downloadGeneration += 1;
      const gen = this.downloadGeneration;
      this.downloading = true;
      this.downloadPercent = 0;
      this.wantPlay = play || this.wantPlay;
      this.bindDownloadSubscription(remote);
      this.emitState();

      const preferHls = !!(this.message?.meta?.stream?.hls || this.message?.meta?.hls_status === 'ready');

      startMediaDownload(remote, {
        message: this.message,
        progressive: true,
        preferHls,
        preferSigned: !preferHls,
        backgroundCache: true,
        onProgress: (r) => {
          if (gen !== this.downloadGeneration) return;
          this.downloadPercent = Math.max(1, Math.min(99, Math.round((Number(r) || 0) * 100)));
          this.bufferRatio = Math.max(this.bufferRatio, Number(r) || 0);
          this.emitState();
        },
        onBuffering: (b) => {
          if (gen !== this.downloadGeneration) return;
          if (!this.playSrc) this.buffering = !!b;
        },
      }).then((res) => {
        if (gen !== this.downloadGeneration) return;
        const task = getMediaTaskState(remote);
        if (task.cancelled) return;
        if (res?.blobUrl) {
          this.applyPlaySrc(res.blobUrl, {
            complete: !!res.complete || task.complete,
            force: !this.playSrc,
            mode: res.mode,
          });
        }
        // Keep download ring until fully cached — Telegram-style cancel still works.
        this.downloading = !!task.downloading;
        if (task.complete) {
          this.complete = true;
          this.downloading = false;
          this.downloadPercent = 100;
          this.bufferRatio = 1;
        }
        this.emitState();
        if (this.wantPlay && this.playSrc) {
          this.$nextTick(() => {
            const video = this.$refs.video;
            if (!video) return;
            video.play().then(() => {
              this.playing = true;
              this.buffering = false;
              this.$emit('play');
            }).catch(() => {
              this.buffering = true;
            });
          });
        }
        // Continue waiting for full cache in background via subscription.
        if (task.downloading) {
          // Subscription will clear ring on complete.
        }
      }).catch((err) => {
        if (gen !== this.downloadGeneration) return;
        if (err?.name === 'AbortError') {
          this.downloading = false;
          this.emitState();
          return;
        }
        this.downloading = false;
        this.buffering = false;
        this.emitState();
      });
    },
    cancelDownload() {
      this.downloadGeneration += 1;
      this.teardownStream({ persist: true });
      this.downloading = false;
      this.wantPlay = false;
      this.emitState();
    },
    teardownStream({ persist = true } = {}) {
      const remote = this.resolvedRemote;
      if (remote) cancelMediaDownload(remote, { persist });
      this.streamSession = null;
    },
    onTimeUpdate() {
      const video = this.$refs.video;
      if (!video) return;
      this.current = video.currentTime || 0;
      this.updateBuffered(video);
      this.$emit('timeupdate', this.current);
    },
    onMeta() {
      const video = this.$refs.video;
      if (!video) return;
      const d = video.duration;
      if (Number.isFinite(d) && d > 0) this.duration = d;
      else if (this.metaDuration) this.duration = this.metaDuration;
      this.updateBuffered(video);
    },
    updateBuffered(video) {
      try {
        if (video.buffered?.length) {
          const end = video.buffered.end(video.buffered.length - 1);
          const d = this.effectiveDuration || end;
          if (d > 0) this.bufferRatio = Math.max(this.bufferRatio, Math.min(1, end / d));
        }
      } catch (e) { /* noop */ }
    },
    onPlaying() {
      this.playing = true;
      this.buffering = false;
    },
    onPause() {
      this.playing = false;
    },
    onEnded() {
      this.playing = false;
      this.wantPlay = false;
      this.$emit('ended');
    },
    onSeekPointer(e) {
      const el = e.currentTarget;
      const video = this.$refs.video;
      const d = this.effectiveDuration;
      if (!el || !video || !d) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX ?? 0) - rect.left;
      const ratio = Math.max(0, Math.min(1, x / Math.max(1, rect.width)));
      // Only seek within downloaded/buffered range for partial progressive blobs.
      // Signed/HLS: browser handles Range seeks natively — allow full timeline.
      const streamingNative = !String(this.playSrc || '').startsWith('blob:') || this.complete;
      const maxRatio = streamingNative ? 1 : Math.max(this.bufferRatio, this.progressRatio);
      const target = Math.min(ratio, maxRatio) * d;
      try { video.currentTime = target; } catch (err) { /* noop */ }
      this.current = target;
      this.onActivity();
    },
    cycleSpeed() {
      const i = SPEEDS.indexOf(this.speed);
      this.speed = SPEEDS[(i + 1) % SPEEDS.length];
      const video = this.$refs.video;
      if (video) video.playbackRate = this.speed;
    },
    async togglePiP() {
      const video = this.$refs.video;
      if (!video || !document.pictureInPictureEnabled) return;
      try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else await video.requestPictureInPicture();
      } catch (e) { /* noop */ }
    },
    async toggleFullscreen() {
      const root = this.$refs.root;
      if (!root) return;
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (root.requestFullscreen) await root.requestFullscreen();
          else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
          else if (this.$refs.video?.webkitEnterFullscreen) this.$refs.video.webkitEnterFullscreen();
        } else if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } catch (e) { /* noop */ }
    },
    onFsChange() {
      this.isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    },
    onActivity() {
      this.showChrome = true;
      this.scheduleHide();
    },
    scheduleHide() {
      if (this.hideTimer) clearTimeout(this.hideTimer);
      this.hideTimer = setTimeout(() => {
        if (this.playing && !this.downloading) this.showChrome = false;
      }, 2600);
    },
  },
};
</script>

<style scoped>
.tg-player {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  overflow: hidden;
}
.tg-video {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
  /* Force a compositor layer so decoded frames actually paint (Chrome quirk). */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}
.tg-glass {
  background: rgba(28, 28, 30, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
}
.tg-center-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border-radius: 999px;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  padding: 0;
}
.tg-center-btn.tg-buffer-only {
  pointer-events: none;
  width: 52px;
  height: 52px;
}
.tg-play-icon {
  width: 28px;
  height: 28px;
  margin-inline-start: 3px;
}
.tg-ring-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
}
.tg-ring-track {
  stroke: rgba(255, 255, 255, 0.22);
}
.tg-ring-prog {
  stroke: #fff;
  transition: stroke-dashoffset 0.12s linear;
}
.tg-stop {
  position: relative;
  z-index: 1;
  width: 14px;
  height: 14px;
  border-radius: 2.5px;
  background: #fff;
}
.tg-corner-dl {
  position: absolute;
  top: 12px;
  inset-inline-end: 12px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 6;
  padding: 0;
}
.tg-ring-svg--sm {
  inset: 3px;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
}
.tg-stop--sm {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
.tg-spinner {
  width: 22px;
  height: 22px;
  border: 2.5px solid rgba(255, 255, 255, 0.28);
  border-top-color: #fff;
  border-radius: 50%;
  animation: tg-spin 0.7s linear infinite;
}
@keyframes tg-spin {
  to { transform: rotate(360deg); }
}
.tg-chrome {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.55rem 0.85rem calc(0.65rem + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 4;
}
.tg-chrome.is-visible {
  opacity: 1;
  pointer-events: auto;
}
.tg-seek-wrap {
  padding: 0.35rem 0;
  cursor: pointer;
}
.tg-seek-track {
  position: relative;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  overflow: hidden;
}
.tg-seek-buf {
  position: absolute;
  inset: 0 auto 0 0;
  background: rgba(255, 255, 255, 0.35);
}
.tg-seek-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: #fff;
}
.tg-chrome-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
.tg-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.88);
  font-variant-numeric: tabular-nums;
  direction: ltr;
}
.tg-chrome-actions {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}
.tg-chip,
.tg-icon-btn {
  border: none;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.tg-chip {
  font-size: 11px;
  font-weight: 700;
  padding: 0.28rem 0.55rem;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.tg-icon-btn {
  width: 34px;
  height: 34px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.tg-chip:hover,
.tg-icon-btn:hover {
  background: rgba(255, 255, 255, 0.16);
}
</style>
