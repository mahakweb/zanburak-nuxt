<template>
  <div class="media-card" :class="[
    `media-card--${type}`,
    isMine ? 'is-mine' : 'is-other',
    downloaded ? 'is-ready' : 'is-locked',
    isUploading ? 'is-uploading' : '',
    flush ? 'is-flush' : '',
    showCaption ? 'has-caption' : '',
    roundMedia ? 'is-round-media' : '',
  ]">
    <!-- Photo -->
    <div
      v-if="type === 'photo'"
      class="media-visual"
      :style="bubbleSize"
      data-media-interactive
      @click="onVisualClick"
    >
      <img
        v-if="displaySrc"
        :src="displaySrc"
        alt=""
        class="media-img"
        :class="{ 'is-blur': !downloaded && !isUploading }"
        draggable="false"
        @error="onMediaSrcError"
      />
      <div v-else class="media-placeholder" />
      <span v-if="!downloaded && !isUploading && sizeLabel" class="media-size-badge" :class="{ 'has-menu': showMenuBtn }">{{ sizeLabel }}</span>
      <button
        v-if="showMenuBtn"
        type="button"
        class="media-menu-btn"
        data-media-interactive
        :aria-label="$t('messenger.more')"
        @click.stop="onOpenMenu"
      >
        <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="1.75" />
          <circle cx="12" cy="12" r="1.75" />
          <circle cx="12" cy="19" r="1.75" />
        </svg>
      </button>
      <div v-if="isUploading" class="media-upload-overlay is-cancelable" data-media-interactive>
        <UploadProgressRing
          size="sm"
          :percent="uploadPercent"
          cancelable
          :cancel-label="$t('messenger.cancelUpload')"
          @cancel="onCancelUpload"
        />
      </div>
      <div v-else-if="downloading" class="media-upload-overlay is-cancelable" data-media-interactive>
        <UploadProgressRing
          size="sm"
          :percent="downloadPercent"
          cancelable
          stop-icon
          :cancel-label="$t('messenger.cancel')"
          @cancel="onCancelDownload"
        />
      </div>
      <button
        v-else-if="!downloaded"
        type="button"
        class="media-dl-btn"
        :class="{ 'media-dl-btn--error': loadFailed }"
        data-media-interactive
        :aria-label="loadFailed ? $t('messenger.mediaDownloadFailed') : $t('messenger.download')"
        @click.stop="onDownload"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 20h14" />
        </svg>
      </button>
      <span v-if="loadFailed && !downloading && !isUploading" class="media-fail-chip">{{ $t('messenger.mediaDownloadFailed') }}</span>
      <slot name="overlay" />
    </div>

    <!-- Video -->
    <div
      v-else-if="type === 'video'"
      class="media-visual media-visual--video"
      :style="bubbleSize"
      data-media-interactive
      @click="onVisualClick"
    >
      <video
        v-if="downloaded && playSrc && !isUploading && isAnimation"
        ref="video"
        class="media-video"
        :src="playSrc"
        muted
        loop
        autoplay
        playsinline
        preload="auto"
        data-media-interactive
      />
      <template v-else-if="downloaded && playSrc && !isUploading">
        <video
          ref="video"
          class="media-video"
          :src="playSrc"
          muted
          playsinline
          preload="metadata"
          @waiting="streamBuffering = true"
          @playing="streamBuffering = false"
          @canplay="streamBuffering = false"
        />
        <span class="media-play-btn" aria-hidden="true">
          <svg class="w-6 h-6 ms-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v13.72L19 12 8 5.14z" />
          </svg>
        </span>
        <span v-if="durationLabel" class="media-duration-badge">{{ durationLabel }}</span>
        <span v-if="streamBuffering" class="media-buffer-badge">{{ $t('messenger.mediaBuffering') }}</span>
      </template>
      <template v-else>
        <img
          v-if="videoPosterSrc"
          :src="videoPosterSrc"
          alt=""
          class="media-img media-video-poster"
          draggable="false"
        />
        <video
          v-else-if="meta.local_url || (displaySrc && String(displaySrc).startsWith('blob:'))"
          class="media-video"
          :src="meta.local_url || displaySrc"
          muted
          :loop="isAnimation"
          :autoplay="isAnimation"
          playsinline
          preload="metadata"
        />
        <div v-else class="media-placeholder media-placeholder--video" />
        <span v-if="!isUploading && isAnimation" class="media-gif-badge">GIF</span>
        <span v-else-if="!isUploading && durationLabel" class="media-duration-badge">{{ durationLabel }}</span>
        <span
          v-if="!isUploading && sizeLabel && (isAnimation || downloaded || downloading || loadFailed)"
          class="media-size-badge"
          :class="{ 'has-menu': showMenuBtn }"
        >{{ sizeLabel }}</span>
        <div v-if="isUploading" class="media-upload-overlay is-cancelable" data-media-interactive>
          <UploadProgressRing
            size="sm"
            :percent="uploadPercent"
            cancelable
            :cancel-label="$t('messenger.cancelUpload')"
            @cancel="onCancelUpload"
          />
        </div>
        <template v-else-if="downloading">
          <button
            type="button"
            class="media-corner-dl media-corner-dl--progress"
            data-media-interactive
            :aria-label="$t('messenger.cancel')"
            @click.stop="onCancelDownload"
          >
            <UploadProgressRing
              size="xs"
              :percent="downloadPercent"
              cancelable
              stop-icon
              :cancel-label="$t('messenger.cancel')"
              @cancel="onCancelDownload"
            />
          </button>
        </template>
        <button
          v-else-if="isAnimation && !downloaded"
          type="button"
          class="media-dl-btn"
          :class="{ 'media-dl-btn--error': loadFailed }"
          data-media-interactive
          :aria-label="loadFailed ? $t('messenger.mediaDownloadFailed') : $t('messenger.download')"
          @click.stop="onDownload"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 20h14" />
          </svg>
        </button>
        <!-- Telegram: undownloaded video shows play (opens progressive viewer); corner download -->
        <span
          v-if="!isUploading && !isAnimation && !downloaded && !loadFailed"
          class="media-play-btn"
          aria-hidden="true"
        >
          <svg class="w-6 h-6 ms-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v13.72L19 12 8 5.14z" />
          </svg>
        </span>
        <button
          v-if="!isUploading && !isAnimation && !downloaded && !downloading"
          type="button"
          class="media-corner-dl"
          :class="{ 'media-corner-dl--error': loadFailed }"
          data-media-interactive
          :aria-label="loadFailed ? $t('messenger.mediaDownloadFailed') : $t('messenger.download')"
          @click.stop="onDownload"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 20h14" />
          </svg>
        </button>
        <span v-if="loadFailed && !downloading && !isUploading" class="media-fail-chip">{{ $t('messenger.mediaDownloadFailed') }}</span>
      </template>
      <span v-if="downloaded && isAnimation && !isUploading" class="media-gif-badge">GIF</span>
      <button
        v-if="showMenuBtn"
        type="button"
        class="media-menu-btn"
        data-media-interactive
        :aria-label="$t('messenger.more')"
        @click.stop="onOpenMenu"
      >
        <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="1.75" />
          <circle cx="12" cy="12" r="1.75" />
          <circle cx="12" cy="19" r="1.75" />
        </svg>
      </button>
      <slot name="overlay" />
    </div>

    <!-- Voice -->
    <div
      v-else-if="type === 'voice'"
      class="voice-card"
      dir="ltr"
      data-media-interactive
      @click="onVoiceCardTap"
    >
      <button
        type="button"
        class="vplay"
        :class="{
          'is-dl': !downloaded && !isUploading && !loadFailed,
          'is-err': loadFailed,
          'is-up': isUploading,
          'is-playing': isThisPlaying,
        }"
        data-media-interactive
        :aria-label="isUploading ? `${uploadPercent}%` : (loadFailed ? $t('messenger.mediaDownloadFailed') : (downloaded ? (isThisPlaying ? 'pause' : 'play') : $t('messenger.download')))"
        @click.stop.prevent="onVoicePrimary"
      >
        <span class="vplay-halo" aria-hidden="true" />
        <span class="vplay-orb">
          <span class="vplay-shine" aria-hidden="true" />
          <UploadProgressRing
            v-if="isUploading"
            :percent="uploadPercent"
            size="sm"
            cancelable
            :cancel-label="$t('messenger.cancelUpload')"
            @cancel="onCancelUpload"
          />
          <UploadProgressRing
            v-else-if="downloading"
            :percent="downloadPercent"
            size="sm"
            cancelable
            stop-icon
            :cancel-label="$t('messenger.cancel')"
            @cancel="onCancelDownload"
          />
          <svg
            v-else-if="downloadPaused"
            class="vplay-ico"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5.14v13.72L19 12 8 5.14z" />
          </svg>
          <svg v-else-if="!downloaded || loadFailed" class="vplay-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v9.5" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" />
            <path d="M8.6 11.2L12 14.6l3.4-3.4" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.5 18.5h11" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" />
          </svg>
          <!-- Playing: soft equalizer (tap to pause) -->
          <span v-else-if="isThisPlaying" class="vplay-eq" aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          <svg v-else class="vplay-ico is-play" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M10.05 6.9a1.35 1.35 0 00-2.05 1.15v8a1.35 1.35 0 002.05 1.15l6.7-4a1.35 1.35 0 000-2.3l-6.7-4z"
            />
          </svg>
        </span>
      </button>

      <div class="voice-body min-w-0" data-media-interactive>
        <div
          class="voice-wave"
          :class="{ 'is-locked': !downloaded || isUploading, 'is-scrubbing': waveScrubbing, 'is-live': isThisPlaying }"
          data-media-interactive
          @pointerdown.stop.prevent="onWavePointerDown"
          @click.stop.prevent="onWaveClick"
        >
          <span
            v-for="(p, i) in peaks"
            :key="i"
            class="voice-bar"
            :class="{ played: downloaded && !isUploading && (i / Math.max(peaks.length, 1)) < waveProgress }"
            :style="{ height: `${Math.round(20 + p * 80)}%` }"
          />
        </div>
        <div class="voice-meta">
          <span class="voice-duration" :class="{ 'is-err': loadFailed && !isUploading && !downloading }">
            <template v-if="isUploading">{{ uploadPercent }}%</template>
            <template v-else-if="loadFailed">{{ $t('messenger.mediaDownloadFailed') }}</template>
            <template v-else-if="downloaded && (isThisPlaying || waveProgress > 0)">{{ formatDuration(waveTimeSeconds) }}</template>
            <template v-else>{{ durationLabel || sizeLabel || '0:00' }}</template>
          </span>
          <span class="voice-stamp" dir="ltr">
            <span v-if="formattedTime" class="msg-meta-text" dir="auto">{{ formattedTime }}</span>
            <template v-if="isMine">
              <PendingClockIcon v-if="(message.pending || message.send_status === 'queued' || message.send_status === 'sending') && !(message.awaiting_server && !message.pending)" />
              <template v-else-if="!message.failed">
                <svg v-if="message.read_at" class="msg-meta-icon is-read" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else-if="message.delivered_at" class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                </svg>
              </template>
            </template>
          </span>
        </div>
      </div>
    </div>

    <!-- Audio / music (Telegram) -->
    <div v-else class="music-card" dir="ltr" data-media-interactive>
      <div class="tg-play-wrap music-play-wrap">
        <span v-if="isThisPlaying" class="tg-play-waves" aria-hidden="true">
          <i class="tg-play-wave" />
          <i class="tg-play-wave" />
          <i class="tg-play-wave" />
        </span>
        <button
          type="button"
          class="tg-play music-play"
          :class="{
            'has-cover': !!resolvedCover,
            'is-dl': !downloaded && !isUploading && !loadFailed,
            'is-err': loadFailed,
            'is-up': isUploading,
            'is-playing': isThisPlaying,
          }"
          data-media-interactive
          :aria-label="isUploading ? `${uploadPercent}%` : (loadFailed ? $t('messenger.mediaDownloadFailed') : (downloaded ? (isThisPlaying ? 'pause' : 'play') : $t('messenger.download')))"
          @click.stop.prevent="onVoicePrimary"
        >
          <span v-if="resolvedCover" class="music-play-art" aria-hidden="true">
            <img :src="resolvedCover" alt="" draggable="false" />
            <span class="music-play-veil" />
          </span>
          <UploadProgressRing
            v-if="isUploading"
            :percent="uploadPercent"
            size="sm"
            cancelable
            :cancel-label="$t('messenger.cancelUpload')"
            @cancel="onCancelUpload"
          />
          <template v-else-if="!downloaded || loadFailed">
            <UploadProgressRing
              v-if="downloading"
              :percent="downloadPercent"
              size="sm"
              cancelable
              stop-icon
              :cancel-label="$t('messenger.cancel')"
              @cancel="onCancelDownload"
            />
            <svg v-else-if="downloadPaused" class="tg-ico tg-ico-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9.35 6.55c0-1.28 1.38-2.08 2.48-1.44l7.55 4.42a1.66 1.66 0 010 2.88l-7.55 4.42c-1.1.64-2.48-.16-2.48-1.44V6.55z" />
            </svg>
            <svg v-else class="tg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 4v11" />
              <path d="M8.2 11.2L12 15l3.8-3.8" />
              <path d="M5.5 19.5h13" />
            </svg>
          </template>
          <template v-else>
            <svg v-if="!isThisPlaying" class="tg-ico tg-ico-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9.35 6.55c0-1.28 1.38-2.08 2.48-1.44l7.55 4.42a1.66 1.66 0 010 2.88l-7.55 4.42c-1.1.64-2.48-.16-2.48-1.44V6.55z" />
            </svg>
            <svg v-else class="tg-ico tg-ico-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6.6" y="6.2" width="3.7" height="11.6" rx="1.85" />
              <rect x="13.7" y="6.2" width="3.7" height="11.6" rx="1.85" />
            </svg>
          </template>
        </button>
      </div>

      <div class="music-body min-w-0" data-media-interactive>
        <div class="music-head">
          <div class="music-title truncate">{{ songTitle }}</div>
          <button
            v-if="showMenuBtn"
            type="button"
            class="music-menu-btn"
            data-media-interactive
            :aria-label="$t('messenger.more')"
            @click.stop="onOpenMenu"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="5" r="1.7" />
              <circle cx="12" cy="12" r="1.7" />
              <circle cx="12" cy="19" r="1.7" />
            </svg>
          </button>
        </div>
        <div class="music-mid">
          <div v-if="!showMusicWave" class="music-artist truncate">{{ songArtist || extLabel }}</div>
          <div
            v-else
            class="music-wave"
            :class="{ 'is-scrubbing': waveScrubbing }"
            data-media-interactive
            @pointerdown.stop.prevent="onWavePointerDown"
            @click.stop.prevent="onWaveClick"
          >
            <span
              v-for="(p, i) in peaks"
              :key="i"
              class="music-bar"
              :class="{ played: (i / Math.max(peaks.length, 1)) < waveProgress }"
              :style="{ height: `${Math.round(22 + p * 78)}%` }"
            />
          </div>
        </div>
        <div class="music-meta">
          <span class="music-duration" :class="{ 'is-err': loadFailed && !isUploading && !downloading }">
            <template v-if="isUploading">{{ uploadPercent }}%</template>
            <template v-else-if="loadFailed">{{ $t('messenger.mediaDownloadFailed') }}</template>
            <template v-else-if="downloaded && (isThisPlaying || waveProgress > 0)">{{ formatDuration(waveTimeSeconds) }}</template>
            <template v-else>{{ durationLabel || sizeLabel || '0:00' }}</template>
          </span>
          <span class="music-stamp" dir="ltr">
            <span v-if="formattedTime" class="msg-meta-text" dir="auto">{{ formattedTime }}</span>
            <template v-if="isMine">
              <PendingClockIcon v-if="(message.pending || message.send_status === 'queued' || message.send_status === 'sending') && !(message.awaiting_server && !message.pending)" />
              <template v-else-if="!message.failed">
                <svg v-if="message.read_at" class="msg-meta-icon is-read" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else-if="message.delivered_at" class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                </svg>
              </template>
            </template>
          </span>
        </div>
      </div>
    </div>

    <p v-if="showCaption" class="media-caption whitespace-pre-wrap break-words leading-snug" dir="auto">
      <template v-for="(part, i) in captionParts" :key="i">
        <a
          v-if="part.type === 'link'"
          :href="part.href"
          class="msg-body-link"
          rel="noopener noreferrer"
          @click="$emit('open-link', part, $event)"
        >{{ part.text }}</a>
        <span v-else-if="part.styles && part.styles.length" :class="formatClass(part)">{{ part.text }}</span>
        <template v-else>{{ part.text }}</template>
      </template>
    </p>
  </div>
</template>

<script>
import {
  downloadMedia,
  getCachedBlobUrl,
  isMediaDownloaded,
  markMediaDownloaded,
  isEncryptedMediaMessage,
  requiresBlobPlayback,
} from './mediaCache';
import {
  cancelMediaDownload,
  subscribeMediaTask,
  getMediaTaskState,
  pauseMediaDownload,
  resumeMediaDownload,
} from './mediaManager';
import { extractAudioArtwork, formatBytes, formatDuration, mediaBubbleSize, parseAudioTitle } from './mediaHelpers';
import { shapeUiDigits } from './appearance';
import { formatMessageBody } from './messageFormat';
import {
  analyzeWaveform,
  isTrackActive,
  playMediaTrack,
  seekMediaPlayerRatio,
  subscribeMediaPlayer,
  toggleMediaPlayer,
  setMediaPlayerDownloadProgress,
} from './mediaPlayer';
import UploadProgressRing from './UploadProgressRing.vue';
import PendingClockIcon from './PendingClockIcon.vue';

export default {
  name: 'MediaMessageCard',
  inject: {
    consumeChatAccessoryTap: { default: null },
  },
  components: { UploadProgressRing, PendingClockIcon },
  props: {
    message: { type: Object, required: true },
    autoUnlock: { type: Boolean, default: false },
    /** Auto-play GIF/video once downloaded (settings-gated). */
    autoPlay: { type: Boolean, default: false },
    /** Own message — show send ticks next to time. */
    isMine: { type: Boolean, default: false },
    /** When true, media fills the bubble; parent clips to bubble border-radius. */
    flush: { type: Boolean, default: false },
    /** Telegram-style ⋮ on photo / video / music. */
    showMenuBtn: { type: Boolean, default: false },
    /** Parent renders caption + time row (photo/video with caption). */
    hideCaption: { type: Boolean, default: false },
    /** Round media corners even when flush (caption sits below). */
    roundMedia: { type: Boolean, default: false },
  },
  emits: ['open-link', 'open-lightbox', 'cancel-upload', 'open-menu'],
  data() {
    return {
      downloaded: false,
      downloading: false,
      downloadPercent: 0,
      streamBuffering: false,
      loadFailed: false,
      playSrc: null,
      /** Hydrated auth thumb / frame poster (blob:) for gallery tiles. */
      hydratedThumb: null,
      /** Keep showing blob only while upload is in flight / remote not ready. */
      forceLocalPreview: false,
      extractedCover: null,
      peaks: Array.from({ length: 72 }, (_, i) => 0.18 + ((i * 17) % 11) / 14),
      playerPlaying: false,
      playerCurrent: 0,
      playerDuration: 0,
      coverWasPlaying: false,
      /** Mini-player session is open for this message (play/pause). Cleared on X / stop. */
      musicSessionOpen: false,
      waveScrubbing: false,
      scrubRatio: null,
      /** Seek position chosen by scrubbing while paused / before first play. */
      heldSeekRatio: null,
      wavePointerId: null,
      waveRectEl: null,
      waveStartX: 0,
      waveStartY: 0,
      waveDidScrub: false,
      unsub: null,
      unsubDl: null,
      /** Generation guard for local onDownload awaits. */
      downloadGeneration: 0,
      /** Audio: download paused (resume from partial). */
      downloadPaused: false,
    };
  },
  computed: {
    type() {
      return this.message?.type || 'photo';
    },
    meta() {
      return this.message?.meta || {};
    },
    isUploading() {
      return !!(this.message?.pending && !this.message?.failed);
    },
    isAnimation() {
      return !!(this.meta?.animation || this.meta?.silent);
    },
    uploadPercent() {
      const p = Number(this.message?.upload_progress);
      if (!Number.isFinite(p)) return 0;
      return Math.max(0, Math.min(99, Math.round(p)));
    },
    caption() {
      return (this.message?.body || '').trim();
    },
    showCaption() {
      return !!this.caption && !this.hideCaption;
    },
    captionParts() {
      return formatMessageBody(this.caption);
    },
    durableRemoteUrl() {
      const u = this.meta.url || null;
      if (u && !String(u).startsWith('blob:')) return u;
      return null;
    },
    isEncryptedMedia() {
      return isEncryptedMediaMessage(this.message);
    },
    canDecryptMedia() {
      return !!(this.message?._mediaKey && this.message?._mediaIv);
    },
    /** Fetch+decrypt automatically only when parent opted in via settings. */
    shouldAutoFetch() {
      if (this.autoUnlock) return true;
      return false;
    },
    remoteUrl() {
      // After settle, prefer the durable CDN URL. Blob previews are only kept as a
      // hard reference while uploading — once the File is dropped from memory the
      // blob: URL can be GC'd and the image "vanishes" until refresh.
      const remote = this.durableRemoteUrl;
      const local = this.meta.local_url || null;
      if (this.forceLocalPreview && local) return local;
      if (remote) return remote;
      if (local) return local;
      const u = this.meta.url || null;
      return u;
    },
    thumbSrc() {
      if (this.hydratedThumb) return this.hydratedThumb;
      // Never use encrypted proxy URL as a "thumb" — it is ciphertext.
      if (this.meta.thumb_url && !requiresBlobPlayback(this.meta.thumb_url, this.message)) {
        return this.meta.thumb_url;
      }
      if (this.durableRemoteUrl && requiresBlobPlayback(this.durableRemoteUrl, this.message)) {
        return null;
      }
      if (this.meta.local_url) return this.meta.local_url;
      return null;
    },
    resolvedCover() {
      return this.meta.cover_url
        || this.meta.local_cover
        || this.extractedCover
        || this.hydratedThumb
        || (this.meta.thumb_url && !requiresBlobPlayback(this.meta.thumb_url, this.message)
          ? this.meta.thumb_url
          : null)
        || null;
    },
    /** Preview image for undownloaded video (server frame thumb or local). */
    videoPosterSrc() {
      return this.hydratedThumb
        || this.thumbSrc
        || (this.meta.local_url && String(this.meta.local_url).startsWith('blob:') ? this.meta.local_url : null)
        || null;
    },
    displaySrc() {
      // Only blob:/data:/local preview — never raw /messenger/media ciphertext.
      if (this.downloaded) {
        const src = this.playSrc || this.thumbSrc;
        if (src && requiresBlobPlayback(src, this.message) && !String(src).startsWith('blob:')) {
          return null;
        }
        return src || null;
      }
      const preview = this.thumbSrc;
      if (preview && requiresBlobPlayback(preview, this.message) && !String(preview).startsWith('blob:')) {
        return null;
      }
      // Blur preview from local blob while locked / uploading.
      if (this.meta.local_url) return this.meta.local_url;
      return preview || null;
    },
    sizeLabel() {
      return this.meta.size != null ? formatBytes(this.meta.size) : '';
    },
    durationLabel() {
      return this.meta.duration != null ? formatDuration(this.meta.duration) : '';
    },
    voiceTimeLabel() {
      if (this.downloaded && this.isThisPlaying) return formatDuration(this.playerCurrent);
      if (this.downloaded && this.playerCurrent > 0 && !this.playerPlaying) {
        return formatDuration(this.playerCurrent);
      }
      return this.durationLabel || '0:00';
    },
    fileName() {
      return this.meta.name || this.$t('messenger.mediaAudio');
    },
    parsedAudio() {
      if (this.meta.title || this.meta.artist) {
        return {
          title: this.meta.title || parseAudioTitle(this.fileName).title,
          artist: this.meta.artist || '',
        };
      }
      return parseAudioTitle(this.fileName);
    },
    songTitle() {
      return this.parsedAudio.title || this.$t('messenger.mediaAudio');
    },
    songArtist() {
      return this.parsedAudio.artist || '';
    },
    extLabel() {
      const ext = String(this.meta.ext || '').toUpperCase();
      return ext || (this.meta.mime || '').split('/').pop()?.toUpperCase() || 'FILE';
    },
    bubbleSize() {
      const base = mediaBubbleSize(this.meta);
      // Captioned flush media: fill bubble width, crop with object-cover (Telegram).
      if (this.flush && (this.roundMedia || this.showCaption || this.hideCaption)) {
        const w = Number(this.meta?.width) || 0;
        const h = Number(this.meta?.height) || 0;
        const maxH = h > w * 1.25 ? 300 : 360;
        if (w > 0 && h > 0) {
          const boxW = 320;
          let bh = Math.round(h * (boxW / w));
          bh = Math.min(maxH, Math.max(120, bh));
          return { width: '100%', height: `${bh}px` };
        }
        return {
          width: '100%',
          height: base.height || '210px',
        };
      }
      return base;
    },
    isThisPlaying() {
      return this.playerPlaying && this.musicSessionOpen;
    },
    showMusicWave() {
      // Wave while this track's mini-player session is open (playing or paused).
      // Closing with X clears musicSessionOpen → artist/details return.
      return !this.isUploading && this.type === 'audio' && this.musicSessionOpen;
    },
    coverSpinPaused() {
      return this.coverWasPlaying && !this.isThisPlaying;
    },
    formattedTime() {
      if (!this.message?.created_at) return '';
      const d = new Date(this.message.created_at);
      const loc = this.$i18n?.locale || 'fa';
      let locale = 'en-US';
      if (String(loc).startsWith('fa')) locale = 'fa-IR';
      else if (String(loc).startsWith('ar')) locale = 'ar';
      else if (String(loc).startsWith('tr')) locale = 'tr-TR';
      return shapeUiDigits(d.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }));
    },
    progress() {
      const d = this.playerDuration || Number(this.meta.duration) || 0;
      if (!d || !this.musicSessionOpen) return 0;
      return Math.max(0, Math.min(1, this.playerCurrent / d));
    },
    waveProgress() {
      if (this.scrubRatio != null) return this.scrubRatio;
      if (this.heldSeekRatio != null && !this.isThisPlaying) return this.heldSeekRatio;
      return this.progress;
    },
    waveTimeSeconds() {
      const d = this.playerDuration || Number(this.meta.duration) || 0;
      if (this.scrubRatio != null && d) return this.scrubRatio * d;
      if (this.heldSeekRatio != null && d && !this.isThisPlaying) return this.heldSeekRatio * d;
      if (this.isThisPlaying || this.playerCurrent > 0) return this.playerCurrent;
      return 0;
    },
  },
  watch: {
    isThisPlaying(playing) {
      if (playing) this.coverWasPlaying = true;
      if (!playing && !this.musicSessionOpen) this.coverWasPlaying = false;
    },
    downloaded(v) {
      if (v) this.$nextTick(() => this.tryAutoPlay());
    },
    autoPlay(v) {
      if (v && this.downloaded) this.$nextTick(() => this.tryAutoPlay());
    },
    message: {
      deep: true,
      immediate: true,
      handler(next, prev) {
        // While uploading, pin the local blob so the bubble never blanks mid-send.
        this.forceLocalPreview = !!(this.isUploading && this.meta.local_url);
        // Re-bootstrap when E2E media keys arrive after envelope decrypt.
        const keysNow = !!(next?._mediaKey && next?._mediaIv);
        const keysBefore = !!(prev?._mediaKey && prev?._mediaIv);
        if (keysNow && !keysBefore && !this.downloaded) {
          this.bootstrap();
          return;
        }
        this.bootstrap();
      },
    },
    remoteUrl(url) {
      this.bindDownloadSubscription(url);
    },
  },
  mounted() {
    this.unsub = subscribeMediaPlayer((s) => {
      const mid = this.message?.id;
      const sameId = mid != null && String(s.messageId) === String(mid);
      const sameSrc = !!(s.src && this.playSrc && s.src === this.playSrc && s.type === 'audio');
      const mine = !!(s.active && (sameId || sameSrc));

      if (!mine) {
        this.musicSessionOpen = false;
        this.playerPlaying = false;
        this.playerCurrent = 0;
        this.playerDuration = Number(this.meta.duration) || 0;
        this.coverWasPlaying = false;
        return;
      }

      this.musicSessionOpen = true;
      this.playerPlaying = !!s.playing;
      this.playerCurrent = s.current || 0;
      this.playerDuration = s.duration || Number(this.meta.duration) || 0;
      if (s.playing) this.coverWasPlaying = true;
      // Keep mini-player download ring in sync while progressive audio loads.
      if (typeof s.downloadProgress === 'number' && s.downloadProgress < 1 && this.downloading) {
        this.downloadPercent = Math.max(1, Math.min(99, Math.round(s.downloadProgress * 100)));
      }
    });
    this.bindDownloadSubscription(this.remoteUrl);
  },
  beforeUnmount() {
    this.unbindWavePointer();
    if (this.unsub) this.unsub();
    if (this.unsubDl) this.unsubDl();
    if (this.extractedCover && String(this.extractedCover).startsWith('blob:')) {
      try { URL.revokeObjectURL(this.extractedCover); } catch (e) { /* noop */ }
    }
  },
  methods: {
    formatDuration,
    bindDownloadSubscription(url) {
      if (this.unsubDl) {
        this.unsubDl();
        this.unsubDl = null;
      }
      if (!url) return;
      this.unsubDl = subscribeMediaTask(url, (s) => {
        if (!s || s.url !== url) return;
        if (s.downloading) {
          this.downloading = true;
          this.downloadPaused = false;
          this.downloadPercent = s.percent || this.downloadPercent;
          this.streamBuffering = !!s.buffering;
          setMediaPlayerDownloadProgress(s.progress);
          if (s.playSrc && !this.playSrc) {
            this.playSrc = s.playSrc;
          }
        } else if (s.paused) {
          this.downloading = false;
          this.downloadPaused = true;
          this.downloadPercent = s.percent || this.downloadPercent;
          this.streamBuffering = false;
        } else if (s.complete) {
          this.downloading = false;
          this.downloadPaused = false;
          this.downloadPercent = 100;
          this.streamBuffering = false;
          if (s.playSrc) {
            this.playSrc = s.playSrc;
            this.downloaded = true;
          }
        } else if (s.cancelled) {
          this.downloading = false;
          this.downloadPaused = false;
          this.streamBuffering = false;
          // Keep percent for resume affordance on audio; reset for video/photo.
          if (this.type === 'photo' || this.type === 'video') {
            this.downloadPercent = 0;
          }
        } else if (s.state === 'error') {
          this.downloading = false;
          this.downloadPaused = false;
          this.streamBuffering = false;
          this.loadFailed = true;
        }
      });
      // Hydrate from existing task (e.g. background / viewer started it).
      const cur = getMediaTaskState(url);
      if (cur.downloading) {
        this.downloading = true;
        this.downloadPercent = cur.percent;
      } else if (cur.paused) {
        this.downloadPaused = true;
        this.downloadPercent = cur.percent;
      } else if (cur.complete && cur.playSrc) {
        this.playSrc = cur.playSrc;
        this.downloaded = true;
      }
    },
    formatClass(part) {
      const styles = part.styles || [];
      return {
        'font-bold': styles.includes('bold'),
        italic: styles.includes('italic'),
        underline: styles.includes('underline'),
        'align-super text-[0.75em]': styles.includes('superscript'),
        'align-sub text-[0.75em]': styles.includes('subscript'),
      };
    },
    onMediaSrcError() {
      const remote = this.durableRemoteUrl;
      const local = this.meta.local_url || null;
      // Never fall back to ciphertext proxy URLs — they cannot render in <img>.
      if (remote && requiresBlobPlayback(remote, this.message)) {
        if (local && this.playSrc !== local) {
          this.playSrc = local;
          this.forceLocalPreview = true;
        } else if (this.downloaded) {
          // Cached blob died — re-fetch decrypted.
          this.downloaded = false;
          this.playSrc = null;
          this.bootstrap();
        }
        return;
      }
      // Dead blob: preview was GC'd — fall back to CDN / thumb immediately.
      if (this.playSrc && String(this.playSrc).startsWith('blob:') && remote) {
        this.forceLocalPreview = false;
        this.playSrc = remote;
        this.downloaded = true;
        markMediaDownloaded(remote);
        return;
      }
      if (this.displaySrc && String(this.displaySrc).startsWith('blob:') && remote) {
        this.forceLocalPreview = false;
        this.playSrc = remote;
        this.downloaded = true;
        return;
      }
      if (remote && this.playSrc !== remote) {
        this.playSrc = remote;
        this.downloaded = true;
        return;
      }
      if (local && this.playSrc !== local) {
        this.playSrc = local;
        this.forceLocalPreview = true;
        this.downloaded = true;
        return;
      }
      this.loadFailed = true;
      this.downloaded = false;
    },
    async bootstrap() {
      this.hydrateThumbPreview();
      const local = this.meta.local_url || null;
      const remote = this.durableRemoteUrl;
      const url = this.remoteUrl;
      const needsBlob = requiresBlobPlayback(url || remote, this.message);

      // Already painted with a decrypted/local blob — ignore meta flicker.
      if (this.playSrc && this.downloaded && String(this.playSrc).startsWith('blob:')) {
        this.forceLocalPreview = false;
        return;
      }
      if (this.playSrc && this.downloaded && remote && !needsBlob && (
        this.playSrc === remote
        || (!String(this.playSrc).startsWith('blob:') && !String(url || '').startsWith('blob:'))
      )) {
        this.forceLocalPreview = false;
        return;
      }
      if (!url) {
        if (!this.playSrc && local) {
          this.playSrc = local;
          this.downloaded = true;
          this.forceLocalPreview = true;
        }
        return;
      }

      // Prefer cached plaintext blob for any auth/E2E URL.
      if (needsBlob || isMediaDownloaded(url)) {
        const cached = await getCachedBlobUrl(url);
        if (cached) {
          this.forceLocalPreview = false;
          this.playSrc = cached;
          this.downloaded = true;
          this.loadPeaks(this.playSrc);
          this.ensureCover(this.playSrc);
          return;
        }
      }

      // Auto-fetch when settings allow (or we already have a local blob preview).
      if (String(url).startsWith('blob:') || this.shouldAutoFetch) {
        if (String(url).startsWith('blob:')) {
          this.downloaded = true;
          if (!this.playSrc || String(this.playSrc).startsWith('blob:')) {
            this.playSrc = url;
          }
          this.loadPeaks(this.playSrc || url);
          this.ensureCover(this.playSrc || url);
          if (remote) {
            // Prefer an already-cached blob; never kick off a network download
            // unless auto-download is enabled for this media type.
            getCachedBlobUrl(remote).then((cached) => {
              this.forceLocalPreview = false;
              if (cached) {
                this.playSrc = cached;
                markMediaDownloaded(remote);
              } else if (this.shouldAutoFetch && needsBlob) {
                downloadMedia(remote, { message: this.message }).then((res) => {
                  if (res?.blobUrl) {
                    this.playSrc = res.blobUrl;
                    this.downloaded = true;
                  }
                }).catch(() => {
                  if (this.playSrc && String(this.playSrc).startsWith('blob:')) {
                    this.forceLocalPreview = true;
                  }
                });
              } else if (this.shouldAutoFetch && !needsBlob) {
                this.playSrc = remote;
                markMediaDownloaded(remote);
              } else {
                this.forceLocalPreview = true;
              }
            }).catch(() => {
              if (this.playSrc && String(this.playSrc).startsWith('blob:')) {
                this.forceLocalPreview = true;
              } else if (this.shouldAutoFetch && !needsBlob) {
                this.forceLocalPreview = false;
                this.playSrc = remote;
                markMediaDownloaded(remote);
              }
            });
          }
          return;
        }

        // Auth proxy / E2E — always decrypt into a blob URL.
        if (needsBlob) {
          // Encrypted without keys yet — keep placeholder (blur empty / size badge).
          if (this.isEncryptedMedia && !this.canDecryptMedia) {
            if (local) this.playSrc = local;
            else if (!this.playSrc) {
              this.downloaded = false;
              this.playSrc = null;
            }
            return;
          }
          try {
            this.downloading = true;
            const res = await downloadMedia(url, { message: this.message });
            this.forceLocalPreview = false;
            this.playSrc = res.blobUrl || local || this.playSrc;
            this.downloaded = !!this.playSrc && String(this.playSrc).startsWith('blob:');
            if (!this.downloaded && local) {
              this.playSrc = local;
              this.downloaded = true;
              this.forceLocalPreview = true;
            }
            this.loadPeaks(this.playSrc);
            this.ensureCover(this.playSrc);
          } catch (e) {
            if (local) {
              this.playSrc = local;
              this.forceLocalPreview = true;
              this.downloaded = true;
            } else {
              this.downloaded = false;
              this.playSrc = null;
            }
          } finally {
            this.downloading = false;
          }
          return;
        }

        // Public CDN path
        if (this.playSrc && remote && (
          this.playSrc === remote
          || (String(this.playSrc).startsWith('blob:') && this.downloaded)
        )) {
          this.forceLocalPreview = false;
          if (!String(this.playSrc).startsWith('blob:')) {
            getCachedBlobUrl(url).then((cached) => {
              if (cached) this.playSrc = cached;
            }).catch(() => {});
          }
          return;
        }
        const cached = (await getCachedBlobUrl(url)) || null;
        this.forceLocalPreview = false;
        this.playSrc = cached || url || local || this.playSrc;
        this.downloaded = true;
        if (url && !String(url).startsWith('blob:')) markMediaDownloaded(url);
        this.loadPeaks(this.playSrc);
        this.ensureCover(this.playSrc || url);
        return;
      }

      // Locked recipient without auto-fetch: show local blur preview only.
      if (local) {
        this.playSrc = local;
      } else if (!this.playSrc) {
        this.downloaded = false;
        this.playSrc = null;
      }
    },
    async hydrateThumbPreview() {
      if (this.hydratedThumb) return;
      if (this.type !== 'photo' && this.type !== 'video') return;
      if (isEncryptedMediaMessage(this.message) && !(this.message?._mediaKey && this.message?._mediaIv)) {
        return;
      }
      const thumb = this.meta.thumb_url || (this.type === 'video' ? this.meta.cover_url : null);
      if (!thumb) {
        // Fall back to cached frame poster keyed by durable media URL.
        const remote = this.durableRemoteUrl;
        if (this.type === 'video' && remote) {
          try {
            const { getCachedPosterUrl } = await import('./mediaCache');
            const poster = await getCachedPosterUrl(remote);
            if (poster) this.hydratedThumb = poster;
          } catch (e) { /* noop */ }
        }
        return;
      }
      if (!requiresBlobPlayback(thumb, this.message)) {
        this.hydratedThumb = thumb;
        return;
      }
      try {
        const cached = await getCachedBlobUrl(thumb);
        if (cached) {
          this.hydratedThumb = cached;
          return;
        }
        const { blobUrl } = await downloadMedia(thumb, { message: this.message });
        if (blobUrl) this.hydratedThumb = blobUrl;
      } catch (e) { /* leave placeholder */ }
    },
    async ensureCover(src) {
      if (this.type !== 'audio') return;
      if (this.meta.cover_url || this.meta.local_cover) return;
      if (this.extractedCover) return;
      if (!src) return;
      const art = await extractAudioArtwork(src);
      if (art) this.extractedCover = art;
    },
    tryAutoPlay() {
      if (!this.autoPlay || !this.downloaded) return;
      const isAnim = !!(this.meta?.animation || this.meta?.silent);
      if (this.type !== 'video' && !isAnim) return;
      const el = this.$refs.video;
      const video = Array.isArray(el) ? el[0] : el;
      if (!video || typeof video.play !== 'function') return;
      video.muted = true;
      video.playsInline = true;
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    },
    async loadPeaks(src) {
      if ((this.type !== 'voice' && this.type !== 'audio') || !src) return;
      const bars = this.type === 'audio' ? 64 : 78;
      const peaks = await analyzeWaveform(src, bars);
      if (peaks?.length) this.peaks = peaks;
    },
    async onDownload() {
      if (this.downloading || this.downloaded) return;
      const url = this.remoteUrl;
      if (!url) return;
      this.bindDownloadSubscription(url);
      this.downloadGeneration += 1;
      const gen = this.downloadGeneration;
      this.downloading = true;
      this.downloadPaused = false;
      this.downloadPercent = 0;
      this.loadFailed = false;
      this.streamBuffering = false;
      const progressive = this.type === 'video' || this.type === 'audio' || this.type === 'voice';
      try {
        const preferHls = this.type === 'video'
          && !!(this.meta?.stream?.hls || this.meta?.hls_status === 'ready');
        const res = await downloadMedia(url, {
          message: this.message,
          progressive,
          preferHls,
          preferSigned: true,
          background: true,
          onBuffering: (b) => {
            if (gen !== this.downloadGeneration) return;
            this.streamBuffering = !!b;
          },
          onProgress: (ratio) => {
            if (gen !== this.downloadGeneration) return;
            this.downloadPercent = Math.max(1, Math.min(99, Math.round((Number(ratio) || 0) * 100)));
            setMediaPlayerDownloadProgress(ratio);
          },
        });
        // Cancelled / superseded — do not apply.
        if (gen !== this.downloadGeneration) return;
        const task = getMediaTaskState(url);
        if (task.cancelled || task.paused) return;

        // Signed/HLS playable immediately — mark ready for playback while cache continues.
        if (res?.blobUrl && (res.mode === 'signed' || res.mode === 'hls' || res.streaming)) {
          this.playSrc = res.blobUrl;
          // Video/audio can play before full download; keep ring until complete unless signed.
          if (res.mode === 'signed' || res.mode === 'hls' || res.complete) {
            this.downloaded = true;
          }
        }
        this.playSrc = res.blobUrl || (requiresBlobPlayback(url, this.message) ? null : res.remoteUrl);
        // Progressive: playable while download may still be finishing.
        this.downloaded = !!this.playSrc;
        if (!this.downloaded) this.loadFailed = true;
        else {
          this.loadPeaks(this.playSrc);
          this.ensureCover(this.playSrc);
        }
        // Keep ring visible until manager reports complete (not just first ready).
        if (task.downloading) {
          this.downloading = true;
        } else {
          this.downloading = false;
          this.downloadPercent = this.downloaded ? 100 : 0;
        }
      } catch (e) {
        if (gen !== this.downloadGeneration) return;
        if (e?.name === 'AbortError') {
          this.downloading = false;
          return;
        }
        this.loadFailed = true;
        this.downloading = false;
        this.downloadPercent = 0;
      } finally {
        if (gen === this.downloadGeneration) {
          const task = getMediaTaskState(url);
          if (!task.downloading) {
            this.streamBuffering = false;
            if (task.complete) {
              this.downloading = false;
              this.downloadPercent = 100;
            } else if (task.cancelled || task.paused) {
              this.downloading = false;
            } else if (!this.downloaded) {
              this.downloading = false;
            }
          }
        }
      }
    },
    onCancelUpload() {
      if (!this.isUploading) return;
      this.$emit('cancel-upload', this.message);
    },
    onCancelDownload() {
      const url = this.remoteUrl;
      if (!url && !this.downloading) return;
      this.downloadGeneration += 1;
      if (url) cancelMediaDownload(url, { persist: true });
      this.downloading = false;
      this.downloadPaused = false;
      this.downloadPercent = 0;
      this.streamBuffering = false;
    },
    onPauseDownload() {
      const url = this.remoteUrl;
      if (!url || !this.downloading) return;
      this.downloadGeneration += 1;
      pauseMediaDownload(url);
      this.downloading = false;
      this.downloadPaused = true;
      this.streamBuffering = false;
    },
    onResumeDownload() {
      const url = this.remoteUrl;
      if (!url || this.downloaded) return;
      this.downloadPaused = false;
      this.bindDownloadSubscription(url);
      this.downloadGeneration += 1;
      const gen = this.downloadGeneration;
      this.downloading = true;
      resumeMediaDownload(url, {
        message: this.message,
        progressive: this.type === 'video' || this.type === 'audio' || this.type === 'voice',
        onProgress: (ratio) => {
          if (gen !== this.downloadGeneration) return;
          this.downloadPercent = Math.max(1, Math.min(99, Math.round((Number(ratio) || 0) * 100)));
        },
      }).then((res) => {
        if (gen !== this.downloadGeneration) return;
        if (res?.blobUrl) {
          this.playSrc = res.blobUrl;
          this.downloaded = true;
          this.loadPeaks(this.playSrc);
          this.ensureCover(this.playSrc);
        }
      }).catch((e) => {
        if (gen !== this.downloadGeneration) return;
        if (e?.name === 'AbortError') return;
        this.loadFailed = true;
        this.downloading = false;
      });
    },
    onOpenMenu(event) {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      if (!this.showMenuBtn || this.isUploading) return;
      this.$emit('open-menu', { event, message: this.message });
    },
    onVisualClick() {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      if (this.isUploading) {
        this.onCancelUpload();
        return;
      }
      // Telegram: open viewer immediately. Progressive play/download happens inside viewer.
      if (this.type === 'video' && !this.isAnimation) {
        this.openLightbox();
        return;
      }
      if (!this.downloaded) {
        this.onDownload().then(() => {
          if (this.downloaded) this.openLightbox();
        });
        return;
      }
      this.openLightbox();
    },
    openLightbox() {
      if (this.type !== 'photo' && this.type !== 'video') return;
      const src = this.playSrc
        || (this.meta.local_url && String(this.meta.local_url).startsWith('blob:') ? this.meta.local_url : null)
        || '';
      // Allow opening video viewer without a blob — player streams on demand.
      if (!src && this.type === 'photo') return;
      if (!src && this.type === 'video' && !this.remoteUrl && !this.meta.url) return;
      this.$emit('open-lightbox', {
        src: src || '',
        type: this.type,
        message: this.message,
      });
    },
    async onVoicePrimary() {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      if (this.isUploading) {
        this.onCancelUpload();
        return;
      }
      // Stop / cancel in-flight download (Telegram: tap stop on ring).
      if (this.downloading) {
        this.onCancelDownload();
        return;
      }
      // Resume paused download.
      if (this.downloadPaused && !this.downloaded) {
        this.onResumeDownload();
        return;
      }
      if (!this.downloaded) {
        await this.onDownload();
        if (this.downloaded && this.playSrc) this.startPlayback();
        return;
      }
      if (this.musicSessionOpen || isTrackActive(this.message?.id)) {
        toggleMediaPlayer().catch(() => {});
        return;
      }
      this.startPlayback();
    },
    startPlayback() {
      const src = this.playSrc || this.remoteUrl;
      if (!src) return;
      // Show waveform / progress immediately for voice + music.
      this.musicSessionOpen = true;
      const pendingSeek = this.heldSeekRatio;
      this.heldSeekRatio = null;
      const dlState = getMediaTaskState(this.remoteUrl);
      playMediaTrack({
        src,
        title: this.type === 'voice' ? this.$t('messenger.mediaVoice') : this.songTitle,
        subtitle: this.songArtist || this.durationLabel,
        coverUrl: this.resolvedCover || null,
        messageId: this.message.id,
        conversationId: this.message.conversation_id
          ?? this.$store?.state?.messenger?.activeConversationId
          ?? null,
        type: this.type,
        duration: Number(this.meta.duration) || 0,
        downloadProgress: dlState.complete ? 1 : (dlState.progress || (this.downloaded ? 1 : 0)),
      }).then(() => {
        if (pendingSeek != null) {
          seekMediaPlayerRatio(pendingSeek);
        }
      }).catch(() => {
        this.musicSessionOpen = false;
        if (pendingSeek != null) this.heldSeekRatio = pendingSeek;
      });
    },
    ratioFromEvent(e, el) {
      const target = el || e.currentTarget;
      if (!target) return 0;
      const rect = target.getBoundingClientRect();
      const x = (e.clientX ?? 0) - rect.left;
      return Math.max(0, Math.min(1, x / Math.max(1, rect.width)));
    },
    seekToRatio(ratio, { startIfNeeded = false } = {}) {
      const r = Math.max(0, Math.min(1, Number(ratio) || 0));
      if (!this.downloaded) {
        // Wave never auto-downloads / auto-plays — only the play button does.
        return;
      }
      if (!this.musicSessionOpen && !isTrackActive(this.message?.id)) {
        if (startIfNeeded) {
          this.heldSeekRatio = r;
          this.startPlayback();
          return;
        }
        // Scrub while idle: remember position until the user hits play.
        this.heldSeekRatio = r;
        return;
      }
      seekMediaPlayerRatio(r);
    },
    onWaveClick() {
      // Handled by pointer up (tap → play/pause) or card click.
    },
    onVoiceCardTap(e) {
      // Ignore if this tap was a waveform scrub, or landed on the play button
      // (button already handles it with .stop).
      if (this.waveDidScrub || this.waveScrubbing) return;
      if (e?.target?.closest?.('.vplay, .voice-wave')) return;
      this.onVoicePrimary();
    },
    onWavePointerDown(e) {
      if (this.isUploading) return;
      if (!this.downloaded) {
        // Tap on locked wave → download / play (same as play button).
        this.onVoicePrimary();
        return;
      }
      const el = e.currentTarget;
      if (!el) return;
      this.waveRectEl = el;
      this.waveStartX = e.clientX ?? 0;
      this.waveStartY = e.clientY ?? 0;
      this.waveDidScrub = false;
      this.waveScrubbing = false;
      this.wavePointerId = e.pointerId;
      this.scrubRatio = null;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      window.addEventListener('pointermove', this.onWavePointerMove);
      window.addEventListener('pointerup', this.onWavePointerUp);
      window.addEventListener('pointercancel', this.onWavePointerUp);
    },
    onWavePointerMove(e) {
      if (this.wavePointerId != null && e.pointerId !== this.wavePointerId) return;
      if (!this.waveRectEl) return;
      const dx = Math.abs((e.clientX ?? 0) - this.waveStartX);
      const dy = Math.abs((e.clientY ?? 0) - this.waveStartY);
      // Require a clear horizontal drag before treating this as a seek.
      if (!this.waveDidScrub) {
        if (dx < 8 || dx < dy * 0.85) return;
        this.waveDidScrub = true;
        this.waveScrubbing = true;
      }
      const ratio = this.ratioFromEvent(e, this.waveRectEl);
      this.scrubRatio = ratio;
      // Live seek while dragging (follow the finger).
      this.seekToRatio(ratio, { startIfNeeded: false });
    },
    onWavePointerUp(e) {
      if (this.wavePointerId != null && e.pointerId !== this.wavePointerId) return;
      const didScrub = this.waveDidScrub;
      const ratio = this.scrubRatio != null
        ? this.scrubRatio
        : this.ratioFromEvent(e, this.waveRectEl);
      this.unbindWavePointer();
      if (!didScrub) {
        // Plain tap on the wave → play / pause (Telegram).
        this.scrubRatio = null;
        this.onVoicePrimary();
        return;
      }
      this.seekToRatio(ratio, { startIfNeeded: false });
      this.scrubRatio = null;
    },
    unbindWavePointer() {
      this.waveScrubbing = false;
      this.wavePointerId = null;
      this.waveRectEl = null;
      // Keep waveDidScrub briefly so the bubbling card click doesn't also toggle.
      const did = this.waveDidScrub;
      window.removeEventListener('pointermove', this.onWavePointerMove);
      window.removeEventListener('pointerup', this.onWavePointerUp);
      window.removeEventListener('pointercancel', this.onWavePointerUp);
      if (did) {
        setTimeout(() => { this.waveDidScrub = false; }, 0);
      } else {
        this.waveDidScrub = false;
      }
    },
  },
};
</script>

<style scoped>
.media-card {
  max-width: 320px;
  width: max-content;
}
.media-card--photo,
.media-card--video {
  max-width: none;
}
.media-card--audio {
  min-width: 240px;
  max-width: 320px;
  width: 100%;
}
.media-visual {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: #0b1220;
  cursor: pointer;
}
.media-card.is-flush .media-visual {
  border-radius: 0;
}
/* Caption below (internal or parent-rendered): keep media corners rounded. */
.media-card.is-flush.has-caption .media-visual,
.media-card.is-flush.is-round-media .media-visual {
  border-radius: 12px;
}
.media-card.is-flush {
  max-width: none;
  width: max-content;
}
.media-card.is-flush.is-round-media,
.media-card.is-flush.has-caption {
  width: 100%;
  max-width: 100%;
}
.media-img,
.media-video,
.media-video-poster {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #0b1220;
}
.media-card.is-flush.is-round-media .media-visual,
.media-card.is-flush.has-caption .media-visual {
  width: 100%;
  overflow: hidden;
}
.media-card.is-flush.is-round-media .media-img,
.media-card.is-flush.is-round-media .media-video,
.media-card.is-flush.is-round-media .media-video-poster,
.media-card.is-flush.has-caption .media-img,
.media-card.is-flush.has-caption .media-video,
.media-card.is-flush.has-caption .media-video-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.media-video {
  background: #000;
}
.media-img.is-blur {
  filter: blur(16px);
  transform: scale(1.14);
  object-fit: cover;
}
.media-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, rgba(51, 144, 236, 0.22), rgba(15, 23, 42, 0.18));
}
.media-placeholder--video {
  background: linear-gradient(160deg, #1a2332, #2a3a4e);
}
.media-size-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  right: auto;
  z-index: 6;
  padding: 3px 7px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0;
  color: #fff;
  background: rgba(15, 23, 42, 0.62);
  font-family: var(--msg-font-meta);
  pointer-events: none;
  white-space: nowrap;
  direction: ltr;
  unicode-bidi: isolate;
  max-width: calc(100% - 48px);
  overflow: visible;
  box-sizing: border-box;
}
.media-size-badge.has-menu {
  max-width: calc(100% - 44px);
}
.media-menu-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  left: auto;
  z-index: 4;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9999px;
  color: #fff;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(6px);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.media-menu-btn:hover,
.media-menu-btn:focus-visible {
  background: rgba(15, 23, 42, 0.68);
  outline: none;
}
.media-menu-btn--inline {
  position: static;
  flex-shrink: 0;
  align-self: center;
  margin-inline-start: 2px;
  color: rgba(15, 23, 42, 0.72);
  background: rgba(15, 23, 42, 0.06);
}
.dark .media-menu-btn--inline {
  color: rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.08);
}
.media-duration-badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  right: auto;
  z-index: 2;
  padding: 1px 5px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.35;
  color: #fff;
  background: rgba(15, 23, 42, 0.55);
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  direction: ltr;
}
.media-buffer-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  pointer-events: none;
}
.media-gif-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  right: auto;
  z-index: 2;
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #fff;
  background: rgba(15, 23, 42, 0.55);
  pointer-events: none;
}
.media-gif-badge + .media-size-badge,
.media-visual .media-size-badge.has-gif {
  top: 28px;
}
.media-dl-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(28, 28, 30, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(12px) saturate(1.15);
  -webkit-backdrop-filter: blur(12px) saturate(1.15);
  z-index: 3;
  margin: 0;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}
.media-dl-btn--error {
  background: rgba(185, 28, 28, 0.78);
  border-color: rgba(255, 255, 255, 0.32);
}
.media-fail-chip {
  position: absolute;
  left: 50%;
  bottom: 7px;
  transform: translateX(-50%);
  z-index: 4;
  max-width: calc(100% - 14px);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0;
  color: #fff;
  background: rgba(185, 28, 28, 0.86);
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.media-play-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(28, 28, 30, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(12px) saturate(1.15);
  -webkit-backdrop-filter: blur(12px) saturate(1.15);
  pointer-events: none;
  z-index: 2;
  margin: 0;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}
.media-corner-dl {
  position: absolute;
  top: 6px;
  left: 6px;
  right: auto;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(28, 28, 30, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px) saturate(1.15);
  -webkit-backdrop-filter: blur(12px) saturate(1.15);
  z-index: 5;
  margin: 0;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
}
.media-corner-dl:hover {
  background: rgba(28, 28, 30, 0.62);
}
.media-corner-dl--error {
  background: rgba(185, 28, 28, 0.82);
  border-color: rgba(255, 255, 255, 0.32);
}
.media-corner-dl--error:hover {
  background: rgba(185, 28, 28, 0.92);
}
.media-corner-dl--progress {
  width: auto;
  height: auto;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.media-corner-dl--progress:hover {
  background: transparent;
}
.media-upload-overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: rgba(0, 0, 0, 0.22);
  pointer-events: none;
  box-sizing: border-box;
}
.media-upload-overlay.is-cancelable {
  pointer-events: auto;
}
.media-upload-overlay :deep(.up-ring) {
  max-width: calc(100% - 4px);
  max-height: calc(100% - 4px);
}
.media-card.is-uploading .media-img,
.media-card.is-uploading .media-video {
  filter: brightness(0.9);
}
.tg-play.is-up,
.vplay.is-up {
  background: transparent !important;
  box-shadow: none;
  padding: 0;
}
.vplay.is-up .vplay-orb {
  background: transparent;
  box-shadow: none;
}
.vplay.is-up .vplay-shine,
.vplay.is-up .vplay-halo {
  display: none;
}
.media-dl-spin {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: media-spin 0.7s linear infinite;
}
.media-dl-spin--sm {
  width: 14px;
  height: 14px;
}
@keyframes media-spin {
  to { transform: rotate(360deg); }
}
.media-caption {
  margin-top: 6px;
  font-size: 15px;
  padding-inline: 2px;
}
.media-card.is-flush .media-caption {
  padding-inline: 8px;
  padding-bottom: 2px;
}

/* ——— Shared soft play button (Telegram) ——— */
.tg-play-wrap {
  position: relative;
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}
.tg-play {
  position: relative;
  z-index: 2;
  width: 42px;
  height: 42px;
  border: 0;
  padding: 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #3390ec;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  transition: transform 0.14s ease, background 0.15s ease, box-shadow 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}
.tg-play:active {
  transform: scale(0.94);
}
.media-card.is-mine .tg-play {
  background: #2a8de3;
}
.dark .media-card.is-mine .tg-play {
  background: #3390ec;
}
.tg-play.is-dl {
  background: rgba(15, 23, 42, 0.42);
  box-shadow: none;
}
.tg-play.is-err {
  background: #e11d48;
  box-shadow: none;
}
.media-card.is-mine .tg-play.is-err,
.dark .media-card.is-mine .tg-play.is-err {
  background: #e11d48;
}
.tg-ico {
  width: 18px;
  height: 18px;
  display: block;
  position: relative;
  z-index: 1;
}
.tg-ico-play {
  width: 18px;
  height: 18px;
  margin-inline-start: 2px;
}
.tg-ico-pause {
  width: 16px;
  height: 16px;
}
.tg-play-waves {
  position: absolute;
  inset: 2px;
  pointer-events: none;
  z-index: 1;
}
.tg-play-wave {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 1.6px solid rgba(51, 144, 236, 0.5);
  opacity: 0;
  animation: tg-wave-out 1.65s cubic-bezier(0.22, 0.7, 0.3, 1) infinite;
}
.media-card.is-mine .tg-play-wave {
  border-color: rgba(42, 141, 227, 0.55);
}
.dark .media-card.is-mine .tg-play-wave {
  border-color: rgba(106, 178, 242, 0.55);
}
.dark .media-card.is-other .tg-play-wave {
  border-color: rgba(106, 178, 242, 0.5);
}
.tg-play-wave:nth-child(2) {
  animation-delay: 0.55s;
}
.tg-play-wave:nth-child(3) {
  animation-delay: 1.1s;
}
@keyframes tg-wave-out {
  0% {
    opacity: 0.65;
    transform: scale(1);
  }
  75% {
    opacity: 0;
    transform: scale(1.42);
  }
  100% {
    opacity: 0;
    transform: scale(1.42);
  }
}

/* ——— Voice ——— */
.media-card--voice {
  min-width: 232px;
  max-width: 280px;
  width: 100%;
  padding: 4px 6px 3px 4px;
  box-sizing: border-box;
  overflow: visible;
}
.voice-card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: inherit;
  overflow: visible;
}

/* Custom voice play orb */
.vplay {
  --vplay-ink: #152033;
  --vplay-ink-2: #24364f;
  --vplay-accent: #5eb1ff;
  position: relative;
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.media-card--voice.is-mine .vplay {
  --vplay-ink: #1a2330;
  --vplay-ink-2: #2a3648;
  --vplay-accent: #7ec4ff;
}
.dark .media-card--voice.is-other .vplay {
  --vplay-ink: #0f1724;
  --vplay-ink-2: #1c2a3d;
  --vplay-accent: #79bfff;
}
.vplay-halo {
  position: absolute;
  inset: 1px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(94, 177, 255, 0.35) 0%, rgba(94, 177, 255, 0) 68%);
  opacity: 0;
  transform: scale(0.85);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.vplay.is-playing .vplay-halo {
  opacity: 1;
  transform: scale(1.08);
  animation: vplay-breathe 1.8s ease-in-out infinite;
}
.vplay-orb {
  position: relative;
  z-index: 1;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 30% 18%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 42%),
    linear-gradient(160deg, var(--vplay-ink-2) 0%, var(--vplay-ink) 55%, #0d1520 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 -10px 18px rgba(0, 0, 0, 0.28),
    0 4px 12px rgba(15, 23, 42, 0.18);
  transition: transform 0.14s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.vplay:active .vplay-orb {
  transform: scale(0.94);
}
.vplay.is-playing .vplay-orb {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -10px 18px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(94, 177, 255, 0.22),
    0 6px 16px rgba(15, 23, 42, 0.22);
}
.vplay.is-dl .vplay-orb {
  background: linear-gradient(160deg, #334155 0%, #1e293b 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.vplay.is-err .vplay-orb {
  background: linear-gradient(160deg, #f43f5e 0%, #e11d48 55%, #be123c 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.vplay.is-err .vplay-halo {
  opacity: 0;
}
.vplay-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 46%);
  pointer-events: none;
}
.vplay-ico {
  width: 17px;
  height: 17px;
  position: relative;
  z-index: 1;
  display: block;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
}
.vplay-ico.is-play {
  width: 19px;
  height: 19px;
  margin-inline-start: 2px;
  color: #f4f8ff;
}
.vplay-eq {
  position: relative;
  z-index: 1;
  width: 18px;
  height: 14px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2.5px;
}
.vplay-eq i {
  display: block;
  width: 2.5px;
  border-radius: 999px;
  background: linear-gradient(180deg, #eaf4ff 0%, var(--vplay-accent) 100%);
  transform-origin: center bottom;
  animation: vplay-eq 0.85s ease-in-out infinite;
}
.vplay-eq i:nth-child(1) {
  height: 42%;
  animation-delay: 0s;
}
.vplay-eq i:nth-child(2) {
  height: 78%;
  animation-delay: 0.12s;
}
.vplay-eq i:nth-child(3) {
  height: 56%;
  animation-delay: 0.24s;
}
.vplay-eq i:nth-child(4) {
  height: 90%;
  animation-delay: 0.08s;
}
@keyframes vplay-eq {
  0%, 100% { transform: scaleY(0.45); opacity: 0.85; }
  50% { transform: scaleY(1); opacity: 1; }
}
@keyframes vplay-breathe {
  0%, 100% { opacity: 0.55; transform: scale(1.02); }
  50% { opacity: 0.9; transform: scale(1.12); }
}

.voice-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 1px;
  padding-inline-end: 2px;
}
.voice-wave {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1px;
  height: 26px;
  width: 100%;
  cursor: pointer;
  touch-action: none;
  user-select: none;
}
.voice-bar {
  flex: 1 1 0;
  min-width: 1.5px;
  max-width: 2.25px;
  border-radius: 999px;
  /* Incoming / light bubble — muted black so bars read on white / slate-100 */
  background: rgba(15, 23, 42, 0.42);
  transition: background-color 0.08s ease, height 0.05s linear;
}
.media-card--voice.is-mine .voice-bar {
  background: rgba(15, 23, 42, 0.4);
}
.dark .media-card--voice.is-mine .voice-bar {
  background: rgba(255, 255, 255, 0.28);
}
.voice-bar.played {
  background: #1a7ad9;
}
.media-card--voice.is-mine .voice-bar.played {
  background: #1a7ad9;
}
.dark .media-card--voice.is-mine .voice-bar.played {
  background: #6ab2f2;
}
.dark .media-card--voice.is-other .voice-bar {
  background: rgba(226, 232, 240, 0.38);
}
.dark .media-card--voice.is-other .voice-bar.played {
  background: #6ab2f2;
}
.voice-wave.is-scrubbing .voice-bar {
  transition: none;
}
.voice-wave.is-locked .voice-bar {
  opacity: 0.55;
}
.voice-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: 14px;
  direction: ltr;
}
.voice-duration {
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: rgba(15, 23, 42, 0.78);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dark .voice-duration {
  color: rgba(226, 232, 240, 0.7);
}
.voice-duration.is-err,
.dark .voice-duration.is-err {
  font-size: 10px;
  font-weight: 700;
  color: #e11d48;
}
.voice-stamp {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 999px;
  color: rgba(15, 23, 42, 0.82);
  background: rgba(15, 23, 42, 0.1);
  user-select: none;
}
.dark .voice-stamp {
  color: rgba(226, 232, 240, 0.78);
  background: rgba(0, 0, 0, 0.28);
}
.voice-stamp .msg-meta-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: block;
}
.voice-stamp .msg-meta-icon.is-read {
  color: #3390ec;
}
.voice-stamp .msg-meta-text {
  font-size: 11px;
  line-height: 1;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

/* ——— Audio / music ——— */
.media-card--audio {
  min-width: 248px;
  max-width: 300px;
  width: 100%;
  padding: 6px 6px 4px 6px;
  box-sizing: border-box;
  overflow: visible;
}
.music-card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: inherit;
  overflow: visible;
}
.music-play-wrap {
  width: 50px;
  height: 50px;
}
.music-play {
  width: 46px;
  height: 46px;
}
.music-play.has-cover {
  background: #1a2332;
  color: #fff;
}
.music-play-art {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  z-index: 0;
}
.music-play-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.music-play-veil {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.32);
}
.music-play .tg-ico,
.music-play .media-dl-spin,
.music-play :deep(.up-ring) {
  position: relative;
  z-index: 2;
}
.music-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  padding-inline-end: 2px;
  padding-block: 1px;
}
.music-head {
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
}
.music-title {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: rgba(15, 23, 42, 0.92);
}
.dark .music-title {
  color: rgba(248, 250, 252, 0.95);
}
.media-card--audio.is-mine .music-title {
  color: rgba(15, 23, 42, 0.92);
}
.dark .media-card--audio.is-mine .music-title {
  color: rgba(255, 255, 255, 0.95);
}
.music-menu-btn {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin-inline-end: -2px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9999px;
  color: rgba(15, 23, 42, 0.4);
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.music-menu-btn:hover,
.music-menu-btn:focus-visible {
  color: rgba(15, 23, 42, 0.75);
  background: rgba(15, 23, 42, 0.06);
  outline: none;
}
.dark .music-menu-btn {
  color: rgba(248, 250, 252, 0.45);
}
.dark .music-menu-btn:hover,
.dark .music-menu-btn:focus-visible {
  color: rgba(248, 250, 252, 0.85);
  background: rgba(255, 255, 255, 0.08);
}
.music-mid {
  height: 20px;
  margin-top: 1px;
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
}
.music-artist {
  width: 100%;
  font-size: 12.5px;
  line-height: 20px;
  height: 20px;
  margin: 0;
  color: rgba(15, 23, 42, 0.5);
}
.dark .music-artist {
  color: rgba(226, 232, 240, 0.55);
}
.media-card--audio.is-mine .music-artist {
  color: rgba(15, 23, 42, 0.52);
}
.dark .media-card--audio.is-mine .music-artist {
  color: rgba(255, 255, 255, 0.55);
}
.music-wave {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25px;
  height: 20px;
  width: 100%;
  cursor: pointer;
  touch-action: none;
  user-select: none;
}
.music-bar {
  flex: 1;
  min-width: 2px;
  max-width: 3px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.42);
  transition: background-color 0.1s ease;
}
.music-bar.played {
  background: #1a7ad9;
}
.media-card--audio.is-mine .music-bar {
  background: rgba(15, 23, 42, 0.4);
}
.media-card--audio.is-mine .music-bar.played {
  background: #1a7ad9;
}
.dark .music-bar {
  background: rgba(226, 232, 240, 0.38);
}
.dark .music-bar.played {
  background: #6ab2f2;
}
.dark .media-card--audio.is-mine .music-bar {
  background: rgba(255, 255, 255, 0.26);
}
.dark .media-card--audio.is-mine .music-bar.played {
  background: #6ab2f2;
}
.music-wave.is-scrubbing .music-bar {
  transition: none;
}
.music-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: 14px;
  margin-top: 2px;
  direction: ltr;
}
.music-duration {
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: rgba(15, 23, 42, 0.78);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dark .music-duration {
  color: rgba(226, 232, 240, 0.7);
}
.media-card--audio.is-mine .music-duration {
  color: rgba(15, 23, 42, 0.78);
}
.dark .media-card--audio.is-mine .music-duration {
  color: rgba(255, 255, 255, 0.65);
}
.music-duration.is-err,
.dark .music-duration.is-err,
.media-card--audio.is-mine .music-duration.is-err,
.dark .media-card--audio.is-mine .music-duration.is-err {
  font-size: 10px;
  font-weight: 700;
  color: #e11d48;
}
.music-stamp {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 999px;
  color: rgba(15, 23, 42, 0.82);
  background: rgba(15, 23, 42, 0.1);
  user-select: none;
}
.dark .music-stamp {
  color: rgba(226, 232, 240, 0.78);
  background: rgba(0, 0, 0, 0.28);
}
.music-stamp .msg-meta-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: block;
}
.music-stamp .msg-meta-icon.is-read {
  color: #3390ec;
}
.music-stamp .msg-meta-text {
  font-size: 11px;
  line-height: 1;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
</style>
