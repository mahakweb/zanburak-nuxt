<template>
  <teleport to="body" :disabled="docked">
    <transition name="mv-fade">
      <div
        v-if="open"
        ref="root"
        class="mv-root flex flex-col bg-black/92 text-white"
        :class="{
          'chrome-hidden': !chromeVisible,
          'is-dismissing': dismissDragY > 0,
          'mv-root--docked': docked,
          'fixed inset-0 z-[2000000060]': !docked,
          'absolute inset-0 z-[80]': docked,
        }"
        :style="rootDismissStyle"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        @mousemove="onMouseActivity"
        @keydown.esc.prevent="close"
      >
        <!-- Profile / avatar header (Telegram-like) -->
        <header
          v-if="profileMode"
          class="mv-header mv-chrome flex items-center justify-between gap-2 px-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 flex-shrink-0"
        >
          <button type="button" class="mv-btn mv-glass" :aria-label="$t('messenger.back')" @click="close">
            <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="min-w-0 text-start flex-1 px-1">
            <div class="text-[14px] font-semibold truncate leading-tight">{{ headerTitle }}</div>
            <div v-if="headerSubtitle || timeLabel" class="text-[11px] text-white/55 truncate leading-tight mt-0.5">
              {{ headerSubtitle || timeLabel }}
            </div>
          </div>
          <div class="flex items-center gap-0.5 flex-shrink-0">
            <button
              v-if="showChangePhoto"
              type="button"
              class="mv-btn mv-glass"
              :aria-label="$t('messenger.changePhoto')"
              @click.stop="$emit('change-photo')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <circle cx="12" cy="13" r="3" stroke-width="2.2" />
              </svg>
            </button>
            <button
              v-if="showDelete"
              type="button"
              class="mv-btn mv-glass text-red-400"
              :aria-label="$t('messenger.deletePhoto')"
              @click.stop="$emit('delete')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <div v-if="hasProfileMenu" ref="profileMenuWrap" class="relative">
              <button
                type="button"
                class="mv-btn mv-glass"
                :aria-label="$t('messenger.more')"
                @click.stop="profileMenuOpen = !profileMenuOpen"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect width="4" height="4" x="10" y="3" rx="2" />
                  <rect width="4" height="4" x="10" y="10" rx="2" />
                  <rect width="4" height="4" x="10" y="17" rx="2" />
                </svg>
              </button>
              <div
                v-if="profileMenuOpen"
                class="mv-menu absolute top-full mt-1 end-0 z-10"
                @click.stop
              >
                <button
                  v-if="showSave"
                  type="button"
                  class="mv-menu-item"
                  @click="onProfileMenuAction('save')"
                >
                  {{ $t('messenger.saveToGallery') }}
                </button>
                <template v-for="(action, idx) in menuActions" :key="action.id || idx">
                  <div v-if="action.divider" class="mv-menu-divider" />
                  <button
                    v-else
                    type="button"
                    :class="['mv-menu-item', { 'is-danger': action.danger }]"
                    @click="onProfileMenuAction(action.id)"
                  >
                    {{ action.label }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </header>

        <div
          class="mv-stage relative flex-1 min-h-0 flex items-center justify-center overflow-hidden touch-none"
          dir="ltr"
          :style="stageDismissStyle"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel.prevent="onWheel"
          @dblclick.prevent="onDblClick"
        >
          <button
            v-if="hasPrevious"
            type="button"
            class="mv-nav mv-nav--prev mv-chrome"
            :aria-label="$t('messenger.previous')"
            @pointerdown.stop
            @click.stop.prevent="previous"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            v-if="hasNext"
            type="button"
            class="mv-nav mv-nav--next mv-chrome"
            :aria-label="$t('messenger.next')"
            @pointerdown.stop
            @click.stop.prevent="next"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            class="mv-frame"
            :class="{ 'has-caption': !!caption, 'is-video': currentType === 'video' && !isAnimation, 'is-photo': currentType === 'photo' || isAnimation }"
            :style="frameBoxStyle"
          >
            <!-- Photo -->
            <img
              v-if="currentType === 'photo' && displayPhotoSrc"
              ref="img"
              :src="displayPhotoSrc"
              alt=""
              class="mv-media select-none"
              :style="mediaTransform"
              draggable="false"
              @load="onMediaLoad"
            />
            <div
              v-else-if="currentType === 'photo' && !displayPhotoSrc"
              class="mv-locked"
            >
              <button type="button" class="mv-download mv-glass pointer-events-auto" @pointerdown.stop @click.stop="requestDownload">
                {{ $t('messenger.download') }}
              </button>
            </div>

            <!-- GIF / animation -->
            <video
              v-else-if="currentType === 'video' && isAnimation && currentSrc"
              ref="video"
              :src="currentSrc"
              class="mv-media"
              :style="mediaTransform"
              muted
              loop
              playsinline
              preload="auto"
              autoplay
              @loadedmetadata="onMediaLoad"
              @click.stop
            />

            <!-- Telegram-style video player (progressive) -->
            <div
              v-else-if="currentType === 'video' && !isAnimation"
              class="mv-player-wrap"
            >
              <MessengerMediaPlayer
                :key="playerKey"
                ref="tgPlayer"
                :src="blobOrLocalSrc"
                :remote-url="remoteMediaUrl"
                :poster="posterSrc"
                :message="currentMessage"
                :autoplay="false"
                :download-request="downloadTick"
                @download-state="onPlayerDownloadState"
                @ready="onPlayerReady"
                @ended="onPlayerEnded"
              />
            </div>

            <span
              v-if="currentSrc && isAnimation"
              class="absolute top-3 inset-inline-end-3 text-[11px] font-black tracking-wide px-2 py-0.5 rounded-md bg-black/55 z-10"
            >GIF</span>

            <!-- Glass caption overlay on media -->
            <div
              v-if="caption"
              class="mv-caption-wrap mv-chrome"
              :class="{ 'is-expanded': captionExpanded, 'is-clamped': captionClamped && !captionExpanded }"
              @pointerdown.stop
              @click.stop="onCaptionClick"
            >
              <div
                ref="captionBody"
                class="mv-caption chat-messages-scroll"
                dir="auto"
              >{{ caption }}</div>
            </div>
          </div>
        </div>

        <!-- Nearby media filmstrip -->
        <div
          v-if="!profileMode && filmstripItems.length > 1"
          class="mv-filmstrip mv-chrome"
          dir="ltr"
        >
          <button
            v-for="entry in filmstripItems"
            :key="entry.key"
            type="button"
            class="mv-thumb"
            :class="{ 'is-active': entry.index === activeIndex }"
            @click.stop="goTo(entry.index)"
          >
            <img v-if="entry.thumb" :src="entry.thumb" alt="" draggable="false" @error="onFilmstripThumbError(entry)" />
            <span v-else class="mv-thumb-fallback" />
            <span v-if="entry.isVideo" class="mv-thumb-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72L19 12 8 5.14z" /></svg>
            </span>
          </button>
        </div>

        <!-- Telegram-style footer -->
        <footer
          v-if="!profileMode"
          class="mv-footer mv-chrome flex items-end justify-between gap-3 px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex-shrink-0"
        >
          <div class="min-w-0 text-start">
            <div v-if="counterLabel" class="text-[13px] font-semibold text-white/95 truncate">{{ counterLabel }}</div>
            <div v-if="metaLine" class="text-[12px] text-white/55 truncate mt-0.5">{{ metaLine }}</div>
          </div>
          <div class="flex items-center gap-0.5 flex-shrink-0">
            <button
              v-if="canGoToMessage"
              type="button"
              class="mv-btn mv-glass mv-eye"
              :aria-label="$t('messenger.goToMessage')"
              :title="$t('messenger.goToMessage')"
              @click.stop="onGoToMessage"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              v-if="canForward"
              type="button"
              class="mv-btn mv-glass"
              :aria-label="$t('messenger.forward')"
              @click.stop="$emit('forward', currentMessage)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h1" />
              </svg>
            </button>
            <button
              v-if="showHeaderDownload"
              type="button"
              class="mv-btn mv-glass"
              :aria-label="$t('messenger.download')"
              @click.stop="onHeaderDownload"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 20h14" />
              </svg>
            </button>
            <button
              v-if="currentType === 'photo' && displayPhotoSrc"
              type="button"
              class="mv-btn mv-glass"
              :aria-label="$t('messenger.zoom')"
              @click.stop="toggleZoom"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path stroke-linecap="round" d="M21 21l-3.5-3.5M8 11h6M11 8v6" />
              </svg>
            </button>
            <button
              type="button"
              class="mv-btn mv-glass"
              :aria-label="$t('messenger.close')"
              @click.stop="close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { formatDuration, mediaTypeLabelKey } from './mediaHelpers';
import MessengerMediaPlayer from './MessengerMediaPlayer.vue';
import { peerDisplayName, contactNameMap } from '@/utils/messengerPeerName';

const CHROME_HIDE_MS = 2400;
const SWIPE_THRESHOLD = 56;
const DISMISS_THRESHOLD = 120;
const FILMSTRIP_RADIUS = 6;
const MIN_ZOOM = 1;
const MAX_ZOOM = 12;
const DOUBLE_TAP_ZOOM = 3.2;
const DOUBLE_TAP_MS = 300;
const WHEEL_STEP = 0.18;
const INERTIA_FRICTION = 0.92;
const INERTIA_MIN = 0.15;

export default {
  name: 'MediaViewerOverlay',
  components: { MessengerMediaPlayer },
  props: {
    open: { type: Boolean, default: false },
    src: { type: String, default: '' },
    mediaType: { type: String, default: 'photo' },
    message: { type: Object, default: null },
    items: { type: Array, default: () => [] },
    index: { type: Number, default: 0 },
    showDelete: { type: Boolean, default: false },
    showChangePhoto: { type: Boolean, default: false },
    profileMode: { type: Boolean, default: false },
    /** Render inside parent (profile sidebar width) instead of full-viewport teleport. */
    docked: { type: Boolean, default: false },
    showSave: { type: Boolean, default: false },
    menuActions: { type: Array, default: () => [] },
    headerTitleOverride: { type: String, default: '' },
    headerSubtitle: { type: String, default: '' },
    canForward: { type: Boolean, default: true },
    senderName: { type: String, default: '' },
  },
  emits: ['close', 'delete', 'change-photo', 'menu-action', 'navigate', 'need-download', 'forward', 'need-more', 'go-to-message'],
  data() {
    return {
      scale: 1,
      tx: 0,
      ty: 0,
      profileMenuOpen: false,
      activeIndex: 0,
      pointers: new Map(),
      pinch: null,
      panVelocity: { x: 0, y: 0 },
      inertiaRaf: 0,
      lastTap: null,
      captionExpanded: false,
      captionClamped: false,
      chromeVisible: true,
      chromeTimer: null,
      isCoarse: false,
      downloadTick: 0,
      playerState: {
        downloading: false,
        percent: 0,
        complete: false,
        playSrc: '',
      },
      brokenThumbs: {},
      stageSize: { w: 0, h: 0 },
      dismissDragY: 0,
      dismissAxis: null,
    };
  },
  computed: {
    rootDismissStyle() {
      if (this.dismissDragY <= 0) return undefined;
      const opacity = Math.max(0.22, 0.92 * (1 - this.dismissDragY / 380));
      return { backgroundColor: `rgba(0, 0, 0, ${opacity})` };
    },
    stageDismissStyle() {
      if (this.dismissDragY <= 0) return undefined;
      return {
        transform: `translate3d(0, ${this.dismissDragY}px, 0)`,
        transition: this.pointers.size ? 'none' : 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
      };
    },
    meta() {
      return this.currentMessage?.meta || {};
    },
    currentItem() {
      return this.items?.length ? (this.items[this.activeIndex] || {}) : null;
    },
    currentSrc() {
      return this.currentItem ? (this.currentItem.src || '') : this.src;
    },
    currentType() {
      return this.currentItem ? (this.currentItem.type || 'photo') : this.mediaType;
    },
    currentMessage() {
      return this.currentItem ? (this.currentItem.message || null) : this.message;
    },
    remoteMediaUrl() {
      const u = this.meta.url;
      if (u && !String(u).startsWith('blob:') && !String(u).startsWith('data:')) return u;
      return '';
    },
    blobOrLocalSrc() {
      const s = this.currentSrc || this.playerState.playSrc || '';
      if (s && (String(s).startsWith('blob:') || String(s).startsWith('data:'))) return s;
      if (s && !String(s).includes('/messenger/media/')) return s;
      return '';
    },
    displayPhotoSrc() {
      return this.currentSrc || '';
    },
    posterSrc() {
      const candidates = [
        this.currentItem?.thumb,
        this.currentItem?.poster,
        this.meta.thumb_url,
        this.meta.cover_url,
        this.meta.local_url,
      ].filter(Boolean);
      for (const c of candidates) {
        const s = String(c);
        if (!s || s.includes('/messenger/media/')) continue;
        return s;
      }
      return '';
    },
    playerKey() {
      const id = this.currentMessage?.id || this.currentMessage?.client_id || this.activeIndex;
      return `tg-vid-${id}`;
    },
    showHeaderDownload() {
      if (this.profileMode) return false;
      if (this.currentType === 'video' && !this.isAnimation) {
        if (this.playerState.downloading) return false;
        if (this.playerState.complete) return false;
        return !!(this.remoteMediaUrl || this.currentSrc);
      }
      return !!(this.currentSrc || this.remoteMediaUrl);
    },
    hasPrevious() {
      return !!this.items?.length && this.activeIndex > 0;
    },
    hasNext() {
      return !!this.items?.length && this.activeIndex < this.items.length - 1;
    },
    isAnimation() {
      return !!(this.meta.animation || this.meta.silent);
    },
    caption() {
      return (this.currentMessage?.body || '').trim();
    },
    headerTitle() {
      if (this.headerTitleOverride) return this.headerTitleOverride;
      if (this.profileMode) return this.$t('messenger.profilePhoto');
      if (this.isAnimation) return this.$t('messenger.mediaGif');
      return this.$t(mediaTypeLabelKey(this.currentType));
    },
    counterLabel() {
      if (!this.items?.length) return '';
      const label = this.isAnimation
        ? this.$t('messenger.mediaGif')
        : this.$t(mediaTypeLabelKey(this.currentType === 'video' ? 'video' : 'photo'));
      return this.$t('messenger.mediaCounter', {
        label,
        current: this.activeIndex + 1,
        total: this.items.length,
      });
    },
    senderLabel() {
      if (this.senderName) return this.senderName;
      if (this.currentItem?.senderName) return this.currentItem.senderName;
      const m = this.currentMessage;
      if (!m) return '';
      const contactMap = contactNameMap(this.$store?.state?.messenger?.contacts);
      const u = m.user || m.forwarded_from || null;
      if (u) {
        const nick = u.id != null ? contactMap[u.id] : '';
        return peerDisplayName(u, nick, this.$t('messenger.user'));
      }
      return '';
    },
    timeLabel() {
      const t = this.currentMessage?.created_at;
      if (!t) return '';
      try {
        return new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        return '';
      }
    },
    dateTimeLabel() {
      const t = this.currentMessage?.created_at;
      if (!t) return '';
      try {
        const d = new Date(t);
        const date = d.toLocaleDateString(undefined);
        const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        return this.$t('messenger.mediaDateAt', { date, time });
      } catch (e) {
        return '';
      }
    },
    metaLine() {
      const parts = [this.senderLabel, this.dateTimeLabel].filter(Boolean);
      return parts.join(' · ');
    },
    downloadName() {
      return this.meta.name || (this.currentType === 'video' ? 'video' : 'photo');
    },
    mediaTransform() {
      return {
        transform: `translate3d(${this.tx}px, ${this.ty}px, 0) scale(${this.scale})`,
        transition: this.pinch || this.pointers.size ? 'none' : undefined,
      };
    },
    canGoToMessage() {
      if (this.profileMode) return false;
      const id = this.currentMessage?.id;
      return id != null && Number.isFinite(Number(id));
    },
    canZoomMedia() {
      return this.currentType === 'photo' && !!this.displayPhotoSrc;
    },
    hasProfileMenu() {
      return this.showSave || (this.menuActions && this.menuActions.length > 0);
    },
    filmstripItems() {
      if (!this.items?.length) return [];
      const start = Math.max(0, this.activeIndex - FILMSTRIP_RADIUS);
      const end = Math.min(this.items.length - 1, this.activeIndex + FILMSTRIP_RADIUS);
      const out = [];
      for (let i = start; i <= end; i += 1) {
        const item = this.items[i];
        const m = item?.message;
        const meta = m?.meta || {};
        const isVideo = (item?.type || m?.type) === 'video';
        const candidates = [
          item?.thumb,
          item?.poster,
          meta.thumb_url,
          meta.cover_url,
          (!isVideo ? item?.src : ''),
          meta.local_url,
        ].filter(Boolean);
        let thumb = '';
        for (const c of candidates) {
          const s = String(c);
          if (!s || this.brokenThumbs[s]) continue;
          if (s.includes('/messenger/media/')) continue;
          thumb = s;
          break;
        }
        out.push({
          key: m?.id != null ? `id:${m.id}` : `i:${i}`,
          index: i,
          thumb,
          isVideo: isVideo && !(meta.animation || meta.silent),
        });
      }
      return out;
    },
    /** Telegram-like: size media box to intrinsic aspect, not full stage. */
    frameBoxStyle() {
      const stageW = this.stageSize.w || (typeof window !== 'undefined' ? window.innerWidth : 800);
      const stageH = this.stageSize.h || (typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.7) : 600);
      const isMobile = stageW < 1024;
      const maxW = Math.max(160, Math.floor(stageW * (isMobile ? 0.96 : 0.72)));
      const maxH = Math.max(160, Math.floor(stageH * (isMobile ? 0.92 : 0.86)));
      const w = Number(this.meta.width) || 0;
      const h = Number(this.meta.height) || 0;
      if (w > 0 && h > 0) {
        const scale = Math.min(maxW / w, maxH / h, 1);
        return {
          width: `${Math.max(1, Math.round(w * scale))}px`,
          height: `${Math.max(1, Math.round(h * scale))}px`,
        };
      }
      if (this.currentType === 'video' && !this.isAnimation) {
        const boxW = Math.min(maxW, isMobile ? maxW : 720);
        const boxH = Math.min(maxH, Math.round(boxW * 9 / 16));
        return { width: `${boxW}px`, height: `${boxH}px` };
      }
      return {
        maxWidth: `${maxW}px`,
        maxHeight: `${maxH}px`,
        width: 'auto',
        height: 'auto',
      };
    },
  },
  watch: {
    open(v) {
      if (v) {
        this.syncIndexFromProp();
        this.resetTransform();
        this.pointers = new Map();
        this.pinch = null;
        this.lastTap = null;
        this.profileMenuOpen = false;
        this.captionExpanded = false;
        this.chromeVisible = true;
        this.isCoarse = this.detectCoarse();
        this.brokenThumbs = {};
        this.dismissDragY = 0;
        this.dismissAxis = null;
        this.playerState = { downloading: false, percent: 0, complete: false, playSrc: '' };
        this.$nextTick(() => {
          this.$refs.root?.focus?.({ preventScroll: true });
          this.measureStage();
          this.measureCaption();
          this.ensureCurrentMedia();
          const vEl = this.$refs.video;
          if (!vEl || !this.isAnimation || !this.currentSrc) return;
          vEl.muted = true;
          vEl.loop = true;
          vEl.play().catch(() => {});
        });
        this.armChromeTimer();
        window.addEventListener('keydown', this.onKey);
        window.addEventListener('resize', this.measureStage);
        document.addEventListener('click', this.onDocClick, true);
      } else {
        this.pauseVideo();
        this.clearChromeTimer();
        window.removeEventListener('keydown', this.onKey);
        window.removeEventListener('resize', this.measureStage);
        document.removeEventListener('click', this.onDocClick, true);
      }
    },
    index() {
      this.syncIndexFromProp();
    },
    items() {
      this.syncIndexFromProp();
      this.$nextTick(() => this.measureCaption());
    },
    activeIndex() {
      this.resetTransform();
      this.captionExpanded = false;
      this.playerState = { downloading: false, percent: 0, complete: false, playSrc: '' };
      this.$nextTick(() => {
        this.measureCaption();
        this.ensureCurrentMedia();
      });
      this.emitNeedMoreIfNearEdge();
    },
    caption() {
      this.captionExpanded = false;
      this.$nextTick(() => this.measureCaption());
    },
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('resize', this.measureStage);
    document.removeEventListener('click', this.onDocClick, true);
    this.clearChromeTimer();
    this.stopInertia();
    this.pauseVideo();
  },
  methods: {
    formatDuration,
    measureStage() {
      const stage = this.$el?.querySelector?.('.mv-stage') || this.$refs.root?.querySelector?.('.mv-stage');
      if (stage) {
        this.stageSize = { w: stage.clientWidth || 0, h: stage.clientHeight || 0 };
        return;
      }
      if (typeof window !== 'undefined') {
        this.stageSize = { w: window.innerWidth, h: Math.round(window.innerHeight * 0.72) };
      }
    },
    onFilmstripThumbError(entry) {
      const src = entry?.thumb;
      if (!src) return;
      this.brokenThumbs = { ...this.brokenThumbs, [String(src)]: true };
    },
    detectCoarse() {
      try {
        return !!(typeof window !== 'undefined'
          && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024));
      } catch (e) {
        return false;
      }
    },
    syncIndexFromProp() {
      if (!this.items?.length) {
        this.activeIndex = 0;
        return;
      }
      this.activeIndex = Math.max(0, Math.min(Number(this.index) || 0, this.items.length - 1));
    },
    close() {
      this.pauseVideo();
      this.profileMenuOpen = false;
      this.$emit('close');
    },
    onGoToMessage() {
      const m = this.currentMessage;
      if (!m?.id) return;
      this.$emit('go-to-message', m);
    },
    onMouseActivity() {
      if (this.isCoarse) return;
      this.showChrome();
      this.armChromeTimer();
    },
    showChrome() {
      this.chromeVisible = true;
    },
    hideChrome() {
      if (this.captionExpanded || this.profileMenuOpen) return;
      this.chromeVisible = false;
    },
    armChromeTimer() {
      this.clearChromeTimer();
      if (this.isCoarse || this.captionExpanded) return;
      this.chromeTimer = setTimeout(() => this.hideChrome(), CHROME_HIDE_MS);
    },
    clearChromeTimer() {
      if (this.chromeTimer) {
        clearTimeout(this.chromeTimer);
        this.chromeTimer = null;
      }
    },
    toggleChrome() {
      this.chromeVisible = !this.chromeVisible;
      if (this.chromeVisible && !this.isCoarse) this.armChromeTimer();
    },
    onCaptionClick() {
      if (!this.captionClamped && !this.captionExpanded) return;
      this.captionExpanded = !this.captionExpanded;
      this.chromeVisible = true;
      this.clearChromeTimer();
      this.$nextTick(() => this.measureCaption());
    },
    measureCaption() {
      const el = this.$refs.captionBody;
      if (!el || !this.caption) {
        this.captionClamped = false;
        return;
      }
      if (this.captionExpanded) {
        this.captionClamped = true;
        return;
      }
      // 3-line clamp: overflow means more text is available.
      this.captionClamped = el.scrollHeight > el.clientHeight + 2;
    },
    onHeaderDownload() {
      if (this.currentType === 'video' && !this.isAnimation) {
        this.downloadTick += 1;
        return;
      }
      if (this.currentSrc) {
        const a = document.createElement('a');
        a.href = this.currentSrc;
        a.download = this.downloadName;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
      this.requestDownload();
    },
    onPlayerDownloadState(state) {
      this.playerState = { ...this.playerState, ...state };
    },
    onPlayerReady({ src, complete }) {
      if (!src) return;
      this.playerState = { ...this.playerState, playSrc: src, complete: !!complete };
      if (this.currentItem && complete) {
        this.$emit('navigate', {
          index: this.activeIndex,
          item: { ...this.currentItem, src, downloaded: true },
          patchOnly: true,
        });
      }
    },
    onPlayerEnded() {},
    onDocClick(e) {
      if (!this.profileMenuOpen) return;
      const wrap = this.$refs.profileMenuWrap;
      if (wrap && wrap.contains(e.target)) return;
      this.profileMenuOpen = false;
    },
    onProfileMenuAction(id) {
      this.profileMenuOpen = false;
      if (id === 'save') {
        this.saveProfilePhoto();
        return;
      }
      this.$emit('menu-action', id);
    },
    async saveProfilePhoto() {
      if (!this.src) return;
      try {
        const res = await fetch(this.src, { mode: 'cors' });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.downloadName || 'profile-photo.jpg';
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        const a = document.createElement('a');
        a.href = this.src;
        a.download = this.downloadName || 'profile-photo.jpg';
        a.target = '_blank';
        a.rel = 'noopener';
        a.click();
      }
    },
    onKey(e) {
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowLeft') this.previous();
      else if (e.key === 'ArrowRight') this.next();
    },
    handleBack() {
      if (this.profileMenuOpen) {
        this.profileMenuOpen = false;
        return true;
      }
      if (this.captionExpanded) {
        this.captionExpanded = false;
        return true;
      }
      if (this.scale > 1.05) {
        this.resetTransform();
        return true;
      }
      return false;
    },
    pauseVideo() {
      const v = this.$refs.video;
      if (v) {
        try { v.pause(); } catch (e) { /* noop */ }
      }
    },
    resetTransform() {
      this.stopInertia();
      this.scale = 1;
      this.tx = 0;
      this.ty = 0;
      this.panVelocity = { x: 0, y: 0 };
      this.pinch = null;
    },
    onMediaLoad() {
      this.resetTransform();
    },
    clampScale(v) {
      return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, v));
    },
    /** Keep panned image edges from leaving a huge empty gap. */
    clampPan() {
      if (this.scale <= 1.01) {
        this.tx = 0;
        this.ty = 0;
        return;
      }
      const stageW = this.stageSize.w || window.innerWidth || 1;
      const stageH = this.stageSize.h || window.innerHeight || 1;
      const maxX = (stageW * (this.scale - 1)) / 2 + stageW * 0.15;
      const maxY = (stageH * (this.scale - 1)) / 2 + stageH * 0.15;
      this.tx = Math.max(-maxX, Math.min(maxX, this.tx));
      this.ty = Math.max(-maxY, Math.min(maxY, this.ty));
    },
    zoomAt(nextScale, clientX, clientY) {
      const prev = this.scale;
      const next = this.clampScale(nextScale);
      if (next === prev) {
        if (next === MIN_ZOOM) {
          this.tx = 0;
          this.ty = 0;
        }
        return;
      }
      const stage = this.$el?.querySelector?.('.mv-stage') || this.$refs.root?.querySelector?.('.mv-stage');
      const rect = stage?.getBoundingClientRect?.();
      const cx = clientX != null && rect ? (clientX - rect.left - rect.width / 2) : 0;
      const cy = clientY != null && rect ? (clientY - rect.top - rect.height / 2) : 0;
      const ratio = next / prev;
      this.tx = cx - (cx - this.tx) * ratio;
      this.ty = cy - (cy - this.ty) * ratio;
      this.scale = next;
      if (this.scale <= 1.01) {
        this.scale = 1;
        this.tx = 0;
        this.ty = 0;
      } else {
        this.clampPan();
      }
    },
    toggleZoom(clientX, clientY) {
      if (!this.canZoomMedia) return;
      this.stopInertia();
      if (this.scale > 1.08) this.resetTransform();
      else this.zoomAt(DOUBLE_TAP_ZOOM, clientX, clientY);
    },
    onDblClick(e) {
      this.toggleZoom(e.clientX, e.clientY);
    },
    onWheel(e) {
      if (!this.canZoomMedia) return;
      this.stopInertia();
      const delta = e.deltaY < 0 ? WHEEL_STEP : -WHEEL_STEP;
      this.zoomAt(this.scale + delta * Math.max(1, this.scale * 0.35), e.clientX, e.clientY);
    },
    pointerList() {
      return Array.from(this.pointers.values());
    },
    pinchDistance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.hypot(dx, dy) || 1;
    },
    pinchCenter(a, b) {
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    },
    stopInertia() {
      if (this.inertiaRaf) {
        cancelAnimationFrame(this.inertiaRaf);
        this.inertiaRaf = 0;
      }
    },
    startInertia() {
      this.stopInertia();
      if (this.scale <= 1.01) return;
      const step = () => {
        this.panVelocity.x *= INERTIA_FRICTION;
        this.panVelocity.y *= INERTIA_FRICTION;
        if (
          Math.abs(this.panVelocity.x) < INERTIA_MIN
          && Math.abs(this.panVelocity.y) < INERTIA_MIN
        ) {
          this.inertiaRaf = 0;
          this.clampPan();
          return;
        }
        this.tx += this.panVelocity.x;
        this.ty += this.panVelocity.y;
        this.clampPan();
        this.inertiaRaf = requestAnimationFrame(step);
      };
      this.inertiaRaf = requestAnimationFrame(step);
    },
    onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target?.closest?.('button, a, .mv-nav, .mv-download, .mv-caption-wrap, video, .tg-player, .mv-player-wrap, .mv-filmstrip')) return;
      this.stopInertia();
      this.pointers.set(e.pointerId, {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        startX: e.clientX,
        startY: e.clientY,
        type: e.pointerType || 'mouse',
        moved: false,
        t: performance.now?.() || Date.now(),
      });
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }

      const pts = this.pointerList();
      if (pts.length === 2 && this.canZoomMedia) {
        const [a, b] = pts;
        this.pinch = {
          startDist: this.pinchDistance(a, b),
          startScale: this.scale,
          startTx: this.tx,
          startTy: this.ty,
          center: this.pinchCenter(a, b),
        };
      }
    },
    onPointerMove(e) {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      const prevX = p.x;
      const prevY = p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (Math.abs(e.clientX - p.startX) > 6 || Math.abs(e.clientY - p.startY) > 6) p.moved = true;

      const pts = this.pointerList();
      if (pts.length >= 2 && this.pinch && this.canZoomMedia) {
        const [a, b] = pts;
        const dist = this.pinchDistance(a, b);
        const center = this.pinchCenter(a, b);
        const nextScale = this.clampScale(this.pinch.startScale * (dist / this.pinch.startDist));
        this.zoomAt(nextScale, center.x, center.y);
        // Pan with pinch midpoint drift.
        this.tx += center.x - this.pinch.center.x;
        this.ty += center.y - this.pinch.center.y;
        this.pinch.center = center;
        this.clampPan();
        return;
      }

      if (pts.length === 1 && this.scale > 1.01 && this.canZoomMedia) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        this.tx += dx;
        this.ty += dy;
        this.panVelocity = { x: dx, y: dy };
        this.clampPan();
        return;
      }

      // Telegram-style vertical drag to dismiss when not zoomed.
      if (pts.length === 1 && this.scale <= 1.01 && !this.pinch) {
        const totalDx = e.clientX - p.startX;
        const totalDy = e.clientY - p.startY;
        if (!this.dismissAxis) {
          if (Math.abs(totalDx) < 8 && Math.abs(totalDy) < 8) return;
          this.dismissAxis = Math.abs(totalDy) > Math.abs(totalDx) * 1.15 ? 'y' : 'x';
        }
        if (this.dismissAxis === 'y') {
          this.dismissDragY = Math.max(0, totalDy);
        }
      }
    },
    onPointerUp(e) {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      this.pointers.delete(e.pointerId);
      const now = performance.now?.() || Date.now();
      const dx = e.clientX - p.startX;
      const dy = e.clientY - p.startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const dismissY = this.dismissDragY;
      const axis = this.dismissAxis;

      if (this.pointers.size < 2) this.pinch = null;

      if (this.pointers.size === 0) {
        this.dismissAxis = null;

        // Vertical swipe-down closes the viewer (Telegram mobile).
        if (this.scale <= 1.01 && (axis === 'y' || (absY > SWIPE_THRESHOLD && absY > absX * 1.2 && dy > 0))) {
          if (dismissY >= DISMISS_THRESHOLD || (dy > DISMISS_THRESHOLD && absY > absX * 1.2)) {
            this.dismissDragY = 0;
            this.close();
            return;
          }
          this.dismissDragY = 0;
        } else {
          this.dismissDragY = 0;
        }

        // Double-tap zoom toward tap point (Telegram).
        if (!p.moved && this.canZoomMedia) {
          const tap = this.lastTap;
          if (tap && (now - tap.t) < DOUBLE_TAP_MS && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 36) {
            this.lastTap = null;
            this.toggleZoom(e.clientX, e.clientY);
            return;
          }
          this.lastTap = { t: now, x: e.clientX, y: e.clientY };
        }

        // Inertial pan after flick while zoomed.
        if (this.scale > 1.01 && p.moved && this.canZoomMedia) {
          this.startInertia();
        }

        // Swipe between gallery items when not zoomed.
        if (this.scale <= 1.01 && axis !== 'y' && absX > SWIPE_THRESHOLD && absX > absY * 1.2) {
          if (dx < 0) this.next();
          else this.previous();
          return;
        }

        // Tap toggles chrome on touch / coarse pointers.
        if (!p.moved && (p.type === 'touch' || this.isCoarse)) {
          // Delay slightly so double-tap can win.
          const scheduled = this.lastTap;
          setTimeout(() => {
            if (this.lastTap !== scheduled) return;
            this.toggleChrome();
          }, DOUBLE_TAP_MS + 20);
        }
      }
    },
    emitNeedMoreIfNearEdge() {
      if (!this.items?.length) return;
      if (this.activeIndex <= 2) {
        this.$emit('need-more', { direction: 'older', index: this.activeIndex });
      }
      if (this.activeIndex >= this.items.length - 3) {
        this.$emit('need-more', { direction: 'newer', index: this.activeIndex });
      }
    },
    goTo(index) {
      if (!this.items?.length) return;
      if (index < 0 || index >= this.items.length) return;
      this.pauseVideo();
      this.activeIndex = index;
      this.$emit('navigate', { index, item: this.items[index] });
      this.showChrome();
      this.armChromeTimer();
      this.$nextTick(() => {
        this.ensureCurrentMedia();
        const vEl = this.$refs.video;
        if (!vEl || !this.isAnimation || !this.currentSrc) return;
        vEl.muted = true;
        vEl.loop = true;
        vEl.play().catch(() => {});
      });
    },
    previous() { this.goTo(this.activeIndex - 1); },
    next() { this.goTo(this.activeIndex + 1); },
    /** Auto-fetch missing photo/video blobs (Telegram opens media immediately). */
    ensureCurrentMedia() {
      if (this.profileMode) return;
      const item = this.currentItem;
      if (!item?.message) return;
      if (this.currentType === 'video' && !this.isAnimation) {
        // Progressive player fetches via remote url; only nudge if nothing is available.
        if (this.currentSrc || this.remoteMediaUrl) return;
      }
      if (this.currentSrc) return;
      this.requestDownload();
    },
    requestDownload() {
      if (this.currentItem) this.$emit('need-download', { index: this.activeIndex, item: this.currentItem });
    },
  },
};
</script>

<style scoped>
.mv-fade-enter-active,
.mv-fade-leave-active {
  transition: opacity 0.18s ease;
}
.mv-fade-enter-from,
.mv-fade-leave-to {
  opacity: 0;
}
.mv-root {
  outline: none;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.92);
}
.mv-root--docked {
  border-radius: 0;
  /* Fill the profile panel column (mobile = full screen panel already). */
  width: 100%;
  height: 100%;
  max-width: 100%;
}
.mv-root.is-dismissing {
  background-color: rgba(0, 0, 0, calc(0.92 * var(--mv-dismiss-opacity, 1)));
  transition: none;
}
.mv-chrome {
  transition: opacity 0.22s ease, visibility 0.22s ease;
  opacity: 1;
  visibility: visible;
}
.mv-root.chrome-hidden .mv-chrome {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.mv-glass {
  background: rgba(28, 28, 30, 0.42) !important;
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.22);
}
.mv-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.mv-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  flex-shrink: 1;
  overflow: hidden;
}
.mv-frame.is-video {
  background: #000;
  border-radius: 2px;
}
.mv-media {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transform-origin: center center;
  will-change: transform;
  /* High-quality scaling while zoomed (Telegram-like sharpness). */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.mv-frame.is-photo .mv-media {
  /* Prefer crisp resampling for photos when browsers support it. */
  image-rendering: auto;
}
.mv-player-wrap {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
.mv-locked {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}
.mv-nav,
.mv-download {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  color: #fff;
  background: rgba(20, 20, 20, 0.62);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.mv-nav {
  position: absolute;
  z-index: 20;
  top: 50%;
  width: 52px;
  height: 52px;
  margin-top: -26px;
  border-radius: 999px;
  display: none;
  pointer-events: auto;
}
@media (min-width: 1024px) {
  .mv-nav { display: inline-flex; }
}
.mv-nav--prev { left: 18px; }
.mv-nav--next { right: 18px; }
.mv-download {
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
}

/* Glass caption on media (Telegram Web) */
.mv-caption-wrap {
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  z-index: 15;
  max-width: min(560px, calc(100% - 24px));
  width: max-content;
  min-width: 120px;
  border-radius: 12px;
  background: rgba(20, 22, 26, 0.55);
  border: none;
  backdrop-filter: blur(16px) saturate(1.15);
  -webkit-backdrop-filter: blur(16px) saturate(1.15);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  pointer-events: auto;
}
.mv-frame.is-video .mv-caption-wrap {
  bottom: 64px;
}
.mv-frame.has-caption .mv-player-wrap {
  /* Keep player chrome clear of caption when collapsed */
  padding-bottom: 0;
}
.mv-caption {
  margin: 0;
  padding: 8px 14px;
  font-size: 14px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.94);
  white-space: pre-wrap;
  word-break: break-word;
  text-align: center;
  max-height: calc(1.45em * 3);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
.mv-caption-wrap.is-expanded {
  width: min(560px, calc(100% - 24px));
  cursor: default;
}
.mv-caption-wrap.is-expanded .mv-caption {
  display: block;
  -webkit-line-clamp: unset;
  line-clamp: unset;
  max-height: min(42vh, 320px);
  overflow: auto;
  text-align: start;
  padding-inline-end: 10px;
}

/* Custom scrollbar (same language as chat-messages-scroll) */
.mv-caption.chat-messages-scroll {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.25s ease;
}
.mv-caption.chat-messages-scroll:hover {
  scrollbar-color: rgba(180, 180, 180, 0.5) transparent;
}
.mv-caption.chat-messages-scroll::-webkit-scrollbar {
  width: 10px;
}
.mv-caption.chat-messages-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.mv-caption.chat-messages-scroll::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}
.mv-caption.chat-messages-scroll::-webkit-scrollbar-thumb {
  background-color: transparent;
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 999px;
}
.mv-caption.chat-messages-scroll:hover::-webkit-scrollbar-thumb {
  background-color: rgba(180, 180, 180, 0.45);
}
.mv-caption.chat-messages-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(200, 200, 200, 0.7);
  border-width: 2px;
}

.mv-filmstrip {
  display: flex;
  justify-content: center;
  gap: 5px;
  padding: 0 12px 10px;
  flex-shrink: 0;
  overflow-x: auto;
  max-width: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.mv-filmstrip::-webkit-scrollbar {
  display: none;
}
.mv-thumb {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 9px;
  overflow: hidden;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  padding: 0;
  transition: border-color 140ms ease, transform 140ms ease;
}
.mv-thumb.is-active {
  border-color: #fff;
  transform: scale(1.04);
}
.mv-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.mv-thumb-fallback {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #2a3648 0%, #1a2433 100%);
}
.mv-thumb-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
  pointer-events: none;
}
.mv-thumb-play svg {
  width: 16px;
  height: 16px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.45));
}

.mv-footer {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent);
}

.mv-menu {
  width: max-content;
  min-width: 0;
  max-width: min(260px, calc(100vw - 1.5rem));
  background: rgba(28, 28, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  backdrop-filter: blur(40px) saturate(1.8);
  -webkit-backdrop-filter: blur(40px) saturate(1.8);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.35), 0 1px 0 rgba(255, 255, 255, 0.08) inset;
  overflow: hidden;
  padding: 4px;
}
.mv-menu-item {
  display: block;
  width: 100%;
  text-align: start;
  padding: 0.45rem 0.75rem;
  font-size: 13.5px;
  font-weight: 500;
  color: #fff;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}
.mv-menu-item:hover { background: rgba(255, 255, 255, 0.08); }
.mv-menu-item.is-danger { color: #f87171; }
.mv-menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0.2rem 0;
}
</style>
