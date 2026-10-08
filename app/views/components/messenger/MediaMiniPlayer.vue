<template>
  <transition name="mini-player">
    <div
      v-if="visible"
      class="media-mini-player"
      :class="overlay ? 'is-overlay' : 'is-docked'"
      dir="ltr"
    >
      <div v-if="coverUrl" class="mini-cover" :class="{ 'is-spinning': playing }">
        <img :src="coverUrl" alt="" class="mini-cover-img" draggable="false" />
      </div>
      <div v-else class="mini-cover mini-cover--fallback">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
        </svg>
      </div>

      <div class="mini-controls">
        <button
          type="button"
          class="mini-nav"
          :disabled="!hasPrev || switching"
          aria-label="Previous"
          @click="playAdjacent(-1)"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
          </svg>
        </button>
        <button type="button" class="mini-play" :aria-label="playing ? 'pause' : 'play'" @click="toggle">
          <span v-if="buffering" class="mini-buffer" aria-hidden="true" />
          <svg v-else-if="!playing" class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v13.72L19 12 8 5.14z" />
          </svg>
          <svg v-else class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
          </svg>
        </button>
        <button
          type="button"
          class="mini-nav"
          :disabled="!hasNext || switching"
          aria-label="Next"
          @click="playAdjacent(1)"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6h2v12h-2V6zM6 18l8.5-6L6 6v12z" />
          </svg>
        </button>
        <button
          type="button"
          class="mini-speed"
          :title="'Playback speed'"
          @click="cycleSpeed"
        >
          {{ speedLabel }}
        </button>
      </div>

      <div class="mini-body min-w-0">
        <div class="mini-title truncate">{{ title }}</div>
        <div class="mini-seek" @pointerdown.prevent="onSeekPointer">
          <div class="mini-seek-track">
            <div class="mini-seek-fill" :style="{ width: `${progress * 100}%` }" />
          </div>
        </div>
        <div class="mini-times">
          <span>{{ currentLabel }}</span>
          <span>{{ durationLabel }}</span>
        </div>
      </div>

      <button type="button" class="mini-close" :title="$t('messenger.cancel')" @click="close">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script>
import { mapState } from "@/composables/useStore";
import {
  subscribeMediaPlayer,
  toggleMediaPlayer,
  stopMediaPlayer,
  seekMediaPlayerRatio,
  playMediaTrack,
  setMediaPlayerEndedHook,
  getMediaPlayerState,
  cycleMediaPlaybackRate,
  getMediaPlaybackRate,
} from './mediaPlayer';
import { formatDuration, parseAudioTitle } from './mediaHelpers';
import { downloadMedia, getCachedBlobUrl, isMediaDownloaded, markMediaDownloaded } from './mediaCache';
import { enqueueBackgroundDownload } from './mediaBackground';

export default {
  name: 'MediaMiniPlayer',
  props: {
    /** When true, float over chat without shifting layout. */
    overlay: { type: Boolean, default: false },
  },
  data() {
    return {
      snap: {
        active: false,
        playing: false,
        title: '',
        subtitle: '',
        coverUrl: null,
        current: 0,
        duration: 0,
        type: null,
        messageId: null,
        conversationId: null,
        src: null,
      },
      switching: false,
      unsub: null,
    };
  },
  computed: {
    ...mapState('messenger', ['messages']),
    visible() {
      return !!this.snap.active && (this.snap.type === 'voice' || this.snap.type === 'audio');
    },
    playing() {
      return !!this.snap.playing;
    },
    buffering() {
      return !!this.snap.buffering;
    },
    title() {
      return this.snap.title || (this.snap.type === 'voice'
        ? this.$t('messenger.mediaVoice')
        : this.$t('messenger.mediaAudio'));
    },
    coverUrl() {
      return this.snap.coverUrl || null;
    },
    progress() {
      const d = Number(this.snap.duration) || 0;
      if (!d) return 0;
      return Math.max(0, Math.min(1, (Number(this.snap.current) || 0) / d));
    },
    currentLabel() {
      return formatDuration(this.snap.current);
    },
    durationLabel() {
      return formatDuration(this.snap.duration);
    },
    playlist() {
      const cid = this.snap.conversationId;
      if (cid == null) return [];
      const type = this.snap.type || 'audio';
      const list = this.messages?.[cid] || [];
      return list.filter((m) => m
        && m.type === type
        && !m.deleted
        && (m.meta?.url || m.meta?.local_url));
    },
    currentIndex() {
      const id = this.snap.messageId;
      if (id == null) return -1;
      return this.playlist.findIndex((m) => String(m.id) === String(id));
    },
    hasPrev() {
      return this.currentIndex > 0;
    },
    hasNext() {
      const i = this.currentIndex;
      return i >= 0 && i < this.playlist.length - 1;
    },
    speedLabel() {
      const rate = this.snap.playbackRate || getMediaPlaybackRate() || 1;
      return `${rate}x`;
    },
  },
  mounted() {
    this.unsub = subscribeMediaPlayer((s) => {
      this.snap = s;
    });
    setMediaPlayerEndedHook(() => {
      if (this.hasNext) this.playAdjacent(1);
    });
  },
  watch: {
    // If the playing message was deleted, close the mini player / preview.
    playlist() {
      if (!this.snap.active || this.snap.messageId == null) return;
      if (this.currentIndex < 0) {
        stopMediaPlayer();
      }
    },
  },
  beforeUnmount() {
    if (this.unsub) this.unsub();
    setMediaPlayerEndedHook(null);
  },
  methods: {
    toggle() {
      toggleMediaPlayer().catch(() => {});
    },
    cycleSpeed() {
      cycleMediaPlaybackRate();
    },
    close() {
      stopMediaPlayer();
    },
    onSeekPointer(e) {
      const el = e.currentTarget;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - rect.left;
      seekMediaPlayerRatio(x / Math.max(1, rect.width));
    },
    async playAdjacent(dir) {
      if (this.switching) return;
      const i = this.currentIndex;
      if (i < 0) return;
      const next = this.playlist[i + dir];
      if (!next) return;
      // Prefetch neighbor in background for seamless skip.
      const neighbor = this.playlist[i + dir * 2];
      if (neighbor?.meta?.url) {
        enqueueBackgroundDownload(neighbor.meta.url, {
          message: neighbor,
          priority: 1,
          progressive: true,
        }).catch(() => {});
      }
      this.switching = true;
      try {
        await this.playMessage(next);
      } finally {
        this.switching = false;
      }
    },
    async resolveSrc(message) {
      const meta = message?.meta || {};
      let url = meta.local_url || meta.url || null;
      if (!url) return null;
      if (String(url).startsWith('blob:')) return url;
      const cached = await getCachedBlobUrl(url);
      if (cached) return cached;
      if (isMediaDownloaded(url)) {
        return (await getCachedBlobUrl(url)) || url;
      }
      try {
        const res = await downloadMedia(url);
        markMediaDownloaded(url);
        return res.blobUrl || res.remoteUrl || url;
      } catch (e) {
        return url;
      }
    },
    trackMeta(message) {
      const meta = message?.meta || {};
      const name = meta.name || meta.title || '';
      let title = meta.title || '';
      let artist = meta.artist || '';
      if (!title) {
        const parsed = parseAudioTitle(name);
        title = parsed.title || name || this.$t('messenger.mediaAudio');
        if (!artist) artist = parsed.artist || '';
      }
      if (message.type === 'voice') {
        title = this.$t('messenger.mediaVoice');
        artist = '';
      }
      return {
        title,
        subtitle: artist || (meta.duration != null ? formatDuration(meta.duration) : ''),
        coverUrl: meta.cover_url || meta.local_cover || null,
        duration: Number(meta.duration) || 0,
      };
    },
    async playMessage(message) {
      const src = await this.resolveSrc(message);
      if (!src) return;
      const info = this.trackMeta(message);
      const cid = this.snap.conversationId
        ?? message.conversation_id
        ?? getMediaPlayerState().conversationId;
      await playMediaTrack({
        src,
        title: info.title,
        subtitle: info.subtitle,
        coverUrl: info.coverUrl,
        messageId: message.id,
        conversationId: cid,
        type: message.type,
        duration: info.duration,
      });
    },
  },
};
</script>

<style scoped>
.media-mini-player {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: #ffffff;
  z-index: 30;
  flex-shrink: 0;
  pointer-events: auto;
}
.media-mini-player.is-overlay {
  position: absolute;
  /* Sit under the chat header (h-16 = 4rem) */
  top: 4rem;
  inset-inline: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.media-mini-player.is-docked {
  position: relative;
  margin: 0.75rem 0.75rem 0;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}
.dark .media-mini-player {
  background: #17212b;
  border-color: rgba(255, 255, 255, 0.06);
}
.dark .media-mini-player.is-overlay {
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
}
.dark .media-mini-player.is-docked {
  box-shadow: none;
}
.mini-cover {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 999px;
  overflow: hidden;
  background: #111;
  border: 1.5px solid rgba(15, 23, 42, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fde68a;
}
.mini-cover--fallback {
  background: radial-gradient(circle at 30% 30%, #333 0%, #111 70%);
}
.mini-cover.is-spinning {
  animation: mini-cover-spin 8s linear infinite;
}
.mini-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.mini-controls {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}
.mini-play {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #3390ec;
  border: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
}
.mini-buffer {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  animation: mini-spin 0.7s linear infinite;
}
@keyframes mini-spin {
  to { transform: rotate(360deg); }
}
.mini-nav {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  background: transparent;
  flex-shrink: 0;
  cursor: pointer;
}
.mini-nav:disabled {
  opacity: 0.28;
  cursor: default;
}
.mini-nav:not(:disabled):hover {
  background: rgba(15, 23, 42, 0.06);
  color: #334155;
}
.mini-speed {
  min-width: 2.25rem;
  height: 28px;
  padding: 0 0.35rem;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.85;
}
.mini-speed:hover {
  background: rgba(15, 23, 42, 0.06);
  opacity: 1;
}
.dark .mini-nav {
  color: #94a3b8;
}
.dark .mini-nav:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
}
.mini-close {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #94a3b8;
  border: 0;
  flex-shrink: 0;
  cursor: pointer;
}
.mini-close:hover {
  background: rgba(15, 23, 42, 0.06);
}
.dark .mini-close:hover {
  background: rgba(255, 255, 255, 0.08);
}
.mini-body {
  flex: 1;
  min-width: 0;
}
.mini-title {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 3px;
}
.dark .mini-title {
  color: #e2e8f0;
}
.mini-seek {
  padding: 4px 0;
  cursor: pointer;
}
.mini-seek-track {
  height: 3px;
  border-radius: 999px;
  background: rgba(51, 144, 236, 0.2);
  overflow: hidden;
}
.mini-seek-fill {
  height: 100%;
  background: #3390ec;
  border-radius: 999px;
}
.mini-times {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
  margin-top: 1px;
}
.mini-player-enter-active,
.mini-player-leave-active {
  transition: opacity var(--tg-dur-fast, 140ms) ease,
    transform var(--tg-dur-normal, 200ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}
.mini-player-enter-from,
.mini-player-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
@keyframes mini-cover-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

<style>
@keyframes mini-cover-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
