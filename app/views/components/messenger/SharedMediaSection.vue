<template>
  <div v-if="conversationId" class="shared-media mx-3 mb-3">
    <div class="sm-shell" :class="{ 'sm-shell--embedded': embedded }">
      <div
        ref="tabsEl"
        class="sm-tabs hide-scrollbar select-none"
        @mousedown="onTabDragStart"
        @mousemove="onTabDragMove"
        @mouseup="onTabDragEnd"
        @mouseleave="onTabDragEnd"
        @touchstart.passive="onTabTouchStart"
        @touchmove.passive="onTabTouchMove"
        @touchend="onTabDragEnd"
      >
        <button
          v-for="t in tabs"
          :key="t.id"
          type="button"
          :class="['sm-tab', tab === t.id ? 'is-active' : '']"
          @click="onTabClick(t.id)"
        >
          {{ t.label }}
        </button>
      </div>

      <div class="sm-body">
        <template v-if="tab === 'members' && showMembersTab">
          <slot name="members" />
        </template>
        <template v-else>
        <MessengerSkeleton
          v-if="loading && !items.length"
          :variant="isListTab ? 'media-list' : 'media-grid'"
          :count="isListTab ? 5 : 12"
        />
        <div v-else-if="!loading && !items.length" class="sm-empty">
          {{ emptyLabel }}
        </div>

        <!-- Combined photo + video feed -->
        <div v-else-if="tab === 'media'" class="sm-grid">
          <div
            v-for="m in items"
            :key="m.id"
            class="sm-tile group"
            @click="onOpenItem(m)"
          >
            <template v-if="itemKind(m) === 'photo'">
              <img
                v-if="thumbOf(m)"
                :src="thumbOf(m)"
                alt=""
                class="sm-tile-media"
                loading="lazy"
                draggable="false"
              />
              <div v-else class="sm-tile-fallback" />
            </template>
            <template v-else>
              <video
                v-if="itemKind(m) === 'gif' && mediaUrl(m)"
                class="sm-tile-media"
                :src="mediaUrl(m)"
                muted
                playsinline
                preload="metadata"
                loop
                autoplay
                @loadedmetadata="onVideoMeta($event, true)"
                @error="onVideoError(m.id)"
              />
              <template v-else-if="itemKind(m) === 'gif'">
                <img
                  v-if="thumbOf(m)"
                  :src="thumbOf(m)"
                  alt=""
                  class="sm-tile-media"
                  loading="lazy"
                  draggable="false"
                />
                <div v-else class="sm-tile-fallback" />
              </template>
              <template v-else>
                <!-- Video tile: always prefer video frame; never show a broken thumb img -->
                <video
                  v-if="videoSrcOf(m)"
                  class="sm-tile-media"
                  :src="videoSrcOf(m)"
                  muted
                  playsinline
                  preload="metadata"
                  @loadedmetadata="onVideoMeta($event, false)"
                  @seeked="onVideoSeeked($event, m)"
                  @error="onVideoError(m.id)"
                />
                <img
                  v-else-if="safeFrameThumbOf(m)"
                  :src="safeFrameThumbOf(m)"
                  alt=""
                  class="sm-tile-media"
                  loading="lazy"
                  draggable="false"
                  @error="onThumbError(m.id)"
                />
                <div v-else class="sm-tile-fallback" />
                <div class="sm-tile-shade" />
                <span class="sm-play sm-play--glass">
                  <svg class="sm-play-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                </span>
                <span v-if="durationOf(m)" class="sm-badge sm-badge--end">{{ durationOf(m) }}</span>
              </template>
              <div v-if="itemKind(m) === 'gif'" class="sm-tile-shade" />
              <span v-if="itemKind(m) === 'gif'" class="sm-badge">GIF</span>
            </template>
            <button
              type="button"
              class="sm-eye"
              :title="$t('messenger.goToMessage')"
              @click.stop="onGoTo(m)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- GIFs -->
        <div v-else-if="tab === 'gif'" class="sm-grid">
          <div
            v-for="m in items"
            :key="m.id"
            class="sm-tile group"
            @click="onOpenItem(m)"
          >
            <video
              v-if="mediaUrl(m)"
              class="sm-tile-media"
              :src="mediaUrl(m)"
              muted
              playsinline
              preload="metadata"
              loop
              autoplay
              @loadedmetadata="onVideoMeta($event, true)"
              @error="onVideoError(m.id)"
            />
            <template v-else>
              <img
                v-if="thumbOf(m)"
                :src="thumbOf(m)"
                alt=""
                class="sm-tile-media"
                loading="lazy"
                draggable="false"
              />
              <div v-else class="sm-tile-fallback" />
            </template>
            <div class="sm-tile-shade" />
            <span class="sm-badge">GIF</span>
            <button
              type="button"
              class="sm-eye"
              :title="$t('messenger.goToMessage')"
              @click.stop="onGoTo(m)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Music / Voice -->
        <div v-else-if="tab === 'audio' || tab === 'voice'" class="sm-list">
          <div
            v-for="m in items"
            :key="m.id"
            class="sm-row group"
            @click="onOpenItem(m)"
          >
            <div
              class="sm-row-icon"
              :class="tab === 'voice' ? 'is-voice' : 'is-audio'"
            >
              <img
                v-if="tab === 'audio' && coverOf(m)"
                :src="coverOf(m)"
                alt=""
                class="sm-row-cover"
                loading="lazy"
                draggable="false"
              />
              <svg v-else-if="tab === 'voice'" class="sm-ico" fill="none" stroke="currentColor" stroke-width="1.85" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
              </svg>
              <svg v-else class="sm-ico" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/>
              </svg>
            </div>
            <div class="sm-row-text">
              <div class="sm-row-title">{{ audioTitle(m) }}</div>
              <div class="sm-row-sub" dir="ltr">
                <span v-if="durationOf(m)">{{ durationOf(m) }}</span>
                <span v-if="durationOf(m) && sizeOf(m)"> · </span>
                <span v-if="sizeOf(m)">{{ sizeOf(m) }}</span>
                <span v-if="audioArtist(m)">
                  <span v-if="durationOf(m) || sizeOf(m)"> · </span>{{ audioArtist(m) }}
                </span>
                <span v-if="!audioArtist(m) && !durationOf(m) && !sizeOf(m)">{{ timeLabel(m) }}</span>
              </div>
            </div>
            <button
              type="button"
              class="sm-eye-inline"
              :title="$t('messenger.goToMessage')"
              @click.stop="onGoTo(m)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Files / documents -->
        <div v-else-if="tab === 'file'" class="sm-list">
          <div
            v-for="m in items"
            :key="m.id"
            class="sm-row group"
            @click="onOpenItem(m)"
          >
            <div class="sm-row-icon is-file" :style="{ background: fileIconColor(m) }">
              <svg class="sm-ico sm-ico--file" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm1 7V3.5L18.5 9H15z"/>
              </svg>
              <span class="sm-file-ext">{{ fileExtLabel(m) }}</span>
            </div>
            <div class="sm-row-text">
              <div class="sm-row-top">
                <div class="sm-row-title truncate" dir="auto">{{ fileNameLabel(m) }}</div>
                <div v-if="timeLabel(m)" class="sm-row-meta sm-row-meta--inline">{{ timeLabel(m) }}</div>
              </div>
              <div class="sm-row-sub line-clamp-1">{{ fileSizeLabel(m) }}</div>
            </div>
            <button
              type="button"
              class="sm-eye-inline"
              :title="$t('messenger.goToMessage')"
              @click.stop="onGoTo(m)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Links -->
        <div v-else-if="tab === 'links'" class="sm-list">
          <div
            v-for="m in items"
            :key="m.id"
            class="sm-row group"
            @click="onOpenItem(m)"
          >
            <div class="sm-row-icon is-link">
              <svg class="sm-ico" fill="none" stroke="currentColor" stroke-width="1.85" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div class="sm-row-text">
              <div class="sm-row-top">
                <div class="sm-row-title is-link truncate" dir="ltr">{{ linkHost(m) || firstLink(m) || '—' }}</div>
                <div v-if="timeLabel(m)" class="sm-row-meta sm-row-meta--inline">{{ timeLabel(m) }}</div>
              </div>
              <div class="sm-row-sub line-clamp-2" dir="auto">{{ linkSnippet(m) }}</div>
            </div>
            <button
              type="button"
              class="sm-eye-inline"
              :title="$t('messenger.goToMessage')"
              @click.stop="onGoTo(m)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div ref="sentinel" class="h-1" />
        <MessengerSkeleton
          v-if="loadingMore"
          :variant="isListTab ? 'media-list' : 'media-grid'"
          :count="isListTab ? 2 : 4"
        />
        </template>
      </div>
    </div>

    <MediaViewerOverlay
      :open="viewer.open"
      :src="viewer.src"
      :media-type="viewer.type"
      :message="viewer.message"
      :items="viewer.items"
      :index="viewer.index"
      :can-forward="false"
      @close="closeViewer"
      @navigate="onViewerNavigate"
      @need-download="onViewerNeedDownload"
      @need-more="onViewerNeedMore"
      @go-to-message="onViewerGoToMessage"
    />
  </div>
</template>

<script>
import { getSharedMedia } from '@/services/messenger';
import { mapState } from "@/composables/useStore";
import { decryptMessageList } from '@/crypto/messenger';
import MediaViewerOverlay from './MediaViewerOverlay.vue';
import MessengerSkeleton from './MessengerSkeleton.vue';
import { fileExtColor, fileExtension, formatBytes, formatDuration, parseAudioTitle } from './mediaHelpers';
import { shapeUiDigits } from './appearance';
import { playMediaTrack } from './mediaPlayer';
import { linkifyMessageBody, classifyMessageHref } from './messageLinks';
import {
  downloadMedia,
  getCachedBlobUrl,
  isEncryptedMediaMessage,
  requiresBlobPlayback,
} from './mediaCache';

const TAB_IDS = ['members', 'media', 'gif', 'audio', 'voice', 'file', 'links'];

export default {
  name: 'SharedMediaSection',
  components: { MediaViewerOverlay, MessengerSkeleton },
  props: {
    conversationId: { type: [Number, String], default: null },
    embedded: { type: Boolean, default: false },
    showMembersTab: { type: Boolean, default: false },
    isChannel: { type: Boolean, default: false },
  },
  emits: ['go-to-message', 'open-link', 'tab-change'],
  data() {
    return {
      tab: 'media',
      items: [],
      hasMore: false,
      loading: false,
      loadingMore: false,
      loadToken: 0,
      observer: null,
      failedVideos: {},
      failedThumbs: {},
      frameCaptures: {},
      videoUrls: {},
      /** messageId → decrypted/blob preview URL for grid tiles */
      previewUrls: {},
      hydrateToken: 0,
      tabDrag: { active: false, startX: 0, scrollLeft: 0, moved: false },
      viewer: { open: false, src: '', type: 'photo', message: null, items: [], index: 0 },
      viewerDownloading: false,
    };
  },
  computed: {
    ...mapState('messenger', ['messages']),
    tabs() {
      const mediaTabs = [
        { id: 'media', label: this.$t('messenger.media') },
        { id: 'gif', label: this.$t('messenger.sharedMediaGifs') },
        { id: 'audio', label: this.$t('messenger.sharedMediaMusic') },
        { id: 'voice', label: this.$t('messenger.sharedMediaVoice') },
        { id: 'file', label: this.$t('messenger.sharedMediaFiles') },
        { id: 'links', label: this.$t('messenger.sharedMediaLinks') },
      ];
      if (!this.showMembersTab) return mediaTabs;
      return [
        {
          id: 'members',
          label: this.isChannel ? this.$t('messenger.subscribers') : this.$t('messenger.members'),
        },
        ...mediaTabs,
      ];
    },
    emptyLabel() {
      const map = {
        media: 'messenger.sharedMediaEmptyMedia',
        gif: 'messenger.sharedMediaEmptyGifs',
        audio: 'messenger.sharedMediaEmptyMusic',
        voice: 'messenger.sharedMediaEmptyVoice',
        file: 'messenger.sharedMediaEmptyFiles',
        links: 'messenger.sharedMediaEmptyLinks',
      };
      return this.$t(map[this.tab] || 'messenger.sharedMediaEmpty');
    },
    isListTab() {
      return this.tab === 'audio' || this.tab === 'voice' || this.tab === 'file' || this.tab === 'links';
    },
  },
  watch: {
    conversationId: {
      immediate: true,
      handler() {
        this.resetAndLoad();
      },
    },
    showMembersTab: {
      immediate: true,
      handler(v) {
        if (v) {
          if (this.tab === 'media') this.tab = 'members';
        } else if (this.tab === 'members') {
          this.tab = 'media';
        }
      },
    },
  },
  mounted() {
    this.setupObserver();
    if (this.showMembersTab) {
      this.tab = 'members';
      this.$emit('tab-change', 'members');
    }
  },
  beforeUnmount() {
    this.teardownObserver();
    this.revokePreviewUrls();
  },
  methods: {
    setupObserver() {
      this.teardownObserver();
      if (typeof IntersectionObserver === 'undefined') return;
      this.observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) this.loadMore();
      }, { root: null, rootMargin: '120px', threshold: 0 });
      this.$nextTick(() => {
        if (this.$refs.sentinel) this.observer.observe(this.$refs.sentinel);
      });
    },
    teardownObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },
    revokePreviewUrls() {
      Object.values(this.previewUrls || {}).forEach((url) => {
        if (url && String(url).startsWith('blob:')) {
          try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ }
        }
      });
      this.previewUrls = {};
    },
    resetAndLoad() {
      this.revokePreviewUrls();
      this.items = [];
      this.hasMore = false;
      this.loading = false;
      this.loadingMore = false;
      this.failedVideos = {};
      this.failedThumbs = {};
      this.frameCaptures = {};
      this.videoUrls = {};
      this.loadToken += 1;
      this.hydrateToken += 1;
      if (!this.conversationId || this.tab === 'members') return;
      this.fetchPage(true);
      this.$nextTick(() => this.setupObserver());
    },
    onTabClick(id) {
      if (this.tabDrag.moved) {
        this.tabDrag.moved = false;
        return;
      }
      if (!TAB_IDS.includes(id) || this.tab === id) return;
      this.tab = id;
      this.$emit('tab-change', id);
      if (id === 'members') return;
      this.resetAndLoad();
    },
    enrichFromStore(rows) {
      const cached = this.messages?.[this.conversationId] || [];
      if (!cached.length) return rows;
      const byId = new Map();
      cached.forEach((m) => {
        if (m?.id != null) byId.set(Number(m.id), m);
      });
      return rows.map((row) => {
        const prev = byId.get(Number(row.id));
        if (!prev) return row;
        const body = (prev._e2e_decrypted && prev.body != null) ? prev.body : row.body;
        const meta = { ...(row.meta || {}), ...(prev.meta || {}) };
        // Prefer decrypted local filename / size when server meta is sparse.
        if (prev.meta?.name && !meta.name) meta.name = prev.meta.name;
        if (prev.meta?.size != null && meta.size == null) meta.size = prev.meta.size;
        if (prev.meta?.ext && !meta.ext) meta.ext = prev.meta.ext;
        return {
          ...row,
          body,
          meta,
          is_encrypted: row.is_encrypted ?? prev.is_encrypted,
          e2e: row.e2e || prev.e2e,
          _e2e_decrypted: prev._e2e_decrypted || false,
          _e2e_locked: prev._e2e_locked,
          _mediaKey: prev._mediaKey || null,
          _mediaIv: prev._mediaIv || null,
          _e2e_ciphertext: prev._e2e_ciphertext || null,
        };
      });
    },
    /** Supplement API link rows with decrypted in-memory messages (E2E / mixed text). */
    mergeLinkRowsFromStore(rows) {
      const byId = new Map();
      (rows || []).forEach((m) => {
        if (m?.id != null) byId.set(Number(m.id), m);
      });
      const cached = this.messages?.[this.conversationId] || [];
      cached.forEach((m) => {
        if (!m || m.id == null || m.type === 'system') return;
        if (!this.firstLink(m)) return;
        const id = Number(m.id);
        if (!byId.has(id)) byId.set(id, m);
        else {
          const cur = byId.get(id);
          byId.set(id, {
            ...cur,
            body: (m._e2e_decrypted && m.body != null) ? m.body : (cur.body || m.body),
            meta: { ...(cur.meta || {}), ...(m.meta || {}) },
            _e2e_decrypted: m._e2e_decrypted || cur._e2e_decrypted,
          });
        }
      });
      return Array.from(byId.values()).sort((a, b) => Number(b.id) - Number(a.id));
    },
    async fetchPage(reset = false) {
      if (!this.conversationId || this.tab === 'members') return;
      if (reset) {
        if (this.loading) return;
        this.loading = true;
      } else {
        if (this.loadingMore || this.loading || !this.hasMore) return;
        this.loadingMore = true;
      }
      const token = this.loadToken;
      const beforeId = reset ? null : (this.items[this.items.length - 1]?.id || null);
      try {
        const res = await getSharedMedia(this.conversationId, this.tab, beforeId, 40);
        if (token !== this.loadToken) return;
        let rows = Array.isArray(res?.data) ? res.data : [];
        rows = this.enrichFromStore(rows);
        try {
          rows = await decryptMessageList(rows);
        } catch (e) {
          console.warn('[shared-media] decrypt failed', e);
        }
        if (this.tab === 'links') {
          // First page: merge any decrypted store messages the SQL filter missed.
          if (reset) rows = this.mergeLinkRowsFromStore(rows);
          rows = rows.filter((m) => !!this.firstLink(m));
        }
        if (this.tab === 'file') {
          rows = rows.filter((m) => m && (m.type === 'file' || m.meta?.name || m.meta?.url));
        }
        const cleaned = rows.filter((m) => !m?.meta?.sticker);
        this.items = reset
          ? cleaned
          : this.items.concat(cleaned.filter((m) => !this.items.some((x) => Number(x.id) === Number(m.id))));
        this.hasMore = !!res?.meta?.has_more;
        this.hydratePreviews(rows, token);
      } catch (e) {
        if (token !== this.loadToken) return;
        if (reset) this.items = [];
        this.hasMore = false;
      } finally {
        if (token === this.loadToken) {
          this.loading = false;
          this.loadingMore = false;
        }
      }
    },
    async hydratePreviews(rows, loadToken) {
      const token = this.hydrateToken;
      const queue = (Array.isArray(rows) ? rows : [])
        .filter((m) => m && ['photo', 'video', 'audio', 'voice', 'file'].includes(m.type));
      const concurrency = 4;
      let idx = 0;
      const worker = async () => {
        while (idx < queue.length) {
          if (token !== this.hydrateToken || loadToken !== this.loadToken) return;
          const i = idx;
          idx += 1;
          // eslint-disable-next-line no-await-in-loop
          await this.hydrateOnePreview(queue[i]);
        }
      };
      await Promise.all(Array.from({ length: Math.min(concurrency, queue.length || 1) }, () => worker()));
    },
    async hydrateOnePreview(m) {
      if (!m?.id) return;
      const meta = m.meta || {};
      const encrypted = isEncryptedMediaMessage(m);

      // Always try to hydrate the playable video URL for video tiles (first-frame seek).
      if (m.type === 'video' && !this.videoUrls[m.id] && !this.failedVideos[m.id]) {
        const videoRemote = meta.url || meta.cdn_url || meta.local_url || null;
        if (videoRemote) {
          try {
            if (String(videoRemote).startsWith('blob:') || String(videoRemote).startsWith('data:')) {
              this.videoUrls = { ...this.videoUrls, [m.id]: videoRemote };
            } else if (!requiresBlobPlayback(videoRemote, m) && !encrypted) {
              this.videoUrls = { ...this.videoUrls, [m.id]: videoRemote };
            } else if (!encrypted || (m._mediaKey && m._mediaIv)) {
              const cached = await getCachedBlobUrl(videoRemote);
              if (cached) {
                this.videoUrls = { ...this.videoUrls, [m.id]: cached };
              } else {
                const { blobUrl } = await downloadMedia(videoRemote, { message: m });
                if (blobUrl) this.videoUrls = { ...this.videoUrls, [m.id]: blobUrl };
              }
            }
          } catch (e) {
            console.warn('[shared-media] video hydrate failed', m.id, e);
          }
        }
      }

      if (this.previewUrls[m.id]) return;
      const local = meta.local_url || meta.local_cover || null;
      if (local && (String(local).startsWith('blob:') || String(local).startsWith('data:'))) {
        this.previewUrls = { ...this.previewUrls, [m.id]: local };
        return;
      }
      let remote = null;
      if (m.type === 'photo') {
        remote = encrypted ? (meta.url || meta.thumb_url) : (meta.thumb_url || meta.url);
      } else if (m.type === 'video') {
        remote = encrypted
          ? (meta.thumb_url || null)
          : (meta.thumb_url || meta.cover_url || null);
      } else {
        remote = meta.url || null;
      }
      if (!remote) return;

      if (!requiresBlobPlayback(remote, m) && !encrypted) {
        if (m.type === 'photo' || m.type === 'video') {
          this.previewUrls = { ...this.previewUrls, [m.id]: remote };
        }
        return;
      }

      if (encrypted && !(m._mediaKey && m._mediaIv)) {
        return;
      }

      try {
        const cached = await getCachedBlobUrl(remote);
        if (cached) {
          this.previewUrls = { ...this.previewUrls, [m.id]: cached };
          return;
        }
        const { blobUrl } = await downloadMedia(remote, { message: m });
        if (blobUrl) {
          this.previewUrls = { ...this.previewUrls, [m.id]: blobUrl };
        }
      } catch (e) {
        console.warn('[shared-media] preview hydrate failed', m.id, e);
      }
    },
    loadMore() {
      return this.fetchPage(false);
    },
    itemKind(m) {
      if (!m) return 'photo';
      if (m.type === 'photo') return 'photo';
      const meta = this.metaOf(m);
      if (m.type === 'video' && (meta.animation || meta.silent)) return 'gif';
      if (m.type === 'video') return 'video';
      return 'photo';
    },
    metaOf(m) {
      return m?.meta || {};
    },
    resolvedSrc(m) {
      if (!m?.id) return '';
      return this.previewUrls[m.id] || '';
    },
    async ensureResolvedSrc(m) {
      const existing = this.resolvedSrc(m);
      if (existing) return existing;
      await this.hydrateOnePreview(m);
      return this.resolvedSrc(m) || '';
    },
    buildViewerItems(pool, selected, selectedSrc = '') {
      // Shared-media API is newest→oldest; gallery wants oldest→newest.
      const chronological = (pool || []).slice().reverse();
      return chronological.map((row) => {
        const rowKind = this.itemKind(row);
        const isSelected = selected && Number(row.id) === Number(selected.id);
        const rowSrc = isSelected
          ? (selectedSrc || this.resolvedSrc(row) || '')
          : (this.resolvedSrc(row) || this.videoUrls[row.id] || '');
        const meta = this.metaOf(row);
        const thumb = this.thumbOf(row)
          || this.safeFrameThumbOf(row)
          || (rowKind === 'photo' ? rowSrc : '')
          || '';
        // Videos can open with empty src — progressive player uses meta.url.
        const canProgressive = rowKind !== 'photo' && !!(meta.url || meta.cdn_url);
        return {
          src: rowSrc,
          thumb: thumb && !String(thumb).includes('/messenger/media/') ? thumb : '',
          type: rowKind === 'photo' ? 'photo' : 'video',
          message: row,
          downloaded: !!rowSrc || canProgressive,
        };
      });
    },
    async onOpenItem(m) {
      if (!m) return;
      if (this.tab === 'media' || this.tab === 'gif') {
        if (m?.meta?.sticker) return;
        const kind = this.tab === 'media' ? this.itemKind(m) : this.tab;
        const mediaKind = kind === 'photo' ? 'photo' : 'video';
        let src = this.resolvedSrc(m);
        if (!src) src = await this.ensureResolvedSrc(m);
        const raw = this.metaOf(m).url || this.metaOf(m).cdn_url || this.metaOf(m).thumb_url || '';
        if (!src && raw && !requiresBlobPlayback(raw, m) && !isEncryptedMediaMessage(m)) src = raw;
        // Open even without a local blob: videos use progressive URL; photos auto-download in the viewer.
        if (!src && !raw) return;

        const pool = (this.items || []).filter((row) => {
          if (!row || row.meta?.sticker) return false;
          if (this.tab === 'media') return row.type === 'photo' || row.type === 'video';
          if (this.tab === 'gif') return this.itemKind(row) === 'gif';
          return true;
        });
        const items = this.buildViewerItems(pool, m, src);
        let index = items.findIndex((it) => Number(it.message?.id) === Number(m.id));
        if (index < 0) index = 0;
        if (items[index] && src) {
          items[index] = { ...items[index], src, downloaded: true };
        }

        this.viewer = {
          open: true,
          src: src || items[index]?.src || '',
          type: mediaKind,
          message: m,
          items,
          index,
        };
        return;
      }
      if (this.tab === 'audio' || this.tab === 'voice') {
        const meta = this.metaOf(m);
        const remote = meta.url;
        let src = this.resolvedSrc(m);
        if (!src && remote) {
          try {
            const { downloadMedia } = await import('./mediaCache');
            const res = await downloadMedia(remote, {
              message: m,
              progressive: true,
              preferSigned: true,
              background: true,
            });
            src = res?.blobUrl || '';
            if (src) this.previewUrls = { ...this.previewUrls, [m.id]: src };
          } catch (e) {
            src = await this.ensureResolvedSrc(m);
          }
        }
        if (!src && remote && !requiresBlobPlayback(remote, m)) src = remote;
        if (!src) return;
        playMediaTrack({
          src,
          title: this.audioTitle(m),
          subtitle: this.audioArtist(m),
          coverUrl: this.coverOf(m) || null,
          messageId: m.id,
          conversationId: this.conversationId,
          type: this.tab === 'voice' ? 'voice' : 'audio',
          duration: meta.duration || 0,
        }).catch(() => {});
        return;
      }
      if (this.tab === 'file') {
        let src = this.resolvedSrc(m);
        if (!src) src = await this.ensureResolvedSrc(m);
        const raw = this.metaOf(m).url;
        if (!src && raw && !requiresBlobPlayback(raw, m)) src = raw;
        if (!src) return;
        try {
          const a = document.createElement('a');
          a.href = src;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.download = this.metaOf(m).name || 'file';
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (e) {
          window.open(src, '_blank', 'noopener,noreferrer');
        }
        return;
      }
      if (this.tab === 'links') {
        const href = this.firstLink(m);
        if (!href) return;
        const classified = classifyMessageHref(href);
        this.$emit('open-link', classified);
        if (classified?.kind === 'external') {
          window.open(classified.href || href, '_blank', 'noopener,noreferrer');
        } else if (classified?.kind === 'internal' && classified.href && this.$router) {
          this.$router.push(classified.href).catch(() => {});
        }
      }
    },
    fileExtLabel(m) {
      const ext = (this.metaOf(m).ext || fileExtension(this.metaOf(m).name || '') || 'FILE').toUpperCase();
      return ext.length > 4 ? ext.slice(0, 4) : ext;
    },
    fileIconColor(m) {
      return fileExtColor(this.metaOf(m).ext || fileExtension(this.metaOf(m).name || ''));
    },
    fileSizeLabel(m) {
      const size = this.metaOf(m).size;
      return size != null ? formatBytes(size) : this.$t('messenger.mediaFile');
    },
    fileNameLabel(m) {
      const name = (m.meta && m.meta.name) || this.$t('messenger.mediaFile');
      return shapeUiDigits(name, 'message');
    },
    mediaUrl(m) {
      if (!m?.id || this.failedVideos[m.id]) return '';
      const resolved = this.resolvedSrc(m);
      if (resolved) return resolved;
      const raw = this.metaOf(m).url || '';
      if (raw && !requiresBlobPlayback(raw, m)) return raw;
      return '';
    },
    thumbOf(m) {
      const preview = m?.id != null ? this.previewUrls[m.id] : null;
      if (preview) return preview;
      const meta = this.metaOf(m);
      // Prefer frame thumb / cover over full media blob for video tiles.
      const thumb = meta.thumb_url || meta.cover_url || '';
      if (thumb && !requiresBlobPlayback(thumb, m)) return thumb;
      if (m?.type === 'photo') {
        const resolved = this.resolvedSrc(m);
        if (resolved) return resolved;
      }
      return '';
    },
    /** Image frame only (never the full video URL) for gallery tiles. */
    frameThumbOf(m) {
      if (m?.id != null && this.frameCaptures[m.id]) return this.frameCaptures[m.id];
      const meta = this.metaOf(m);
      const thumb = meta.thumb_url || meta.cover_url || meta.local_cover || '';
      if (thumb && (String(thumb).startsWith('blob:') || String(thumb).startsWith('data:') || !requiresBlobPlayback(thumb, m))) {
        return thumb;
      }
      const preview = m?.id != null ? this.previewUrls[m.id] : null;
      const videoUrl = meta.url || '';
      if (preview && preview !== videoUrl && !String(preview).match(/\.(mp4|webm|mov)(\?|$)/i)) {
        return preview;
      }
      return '';
    },
    /** Thumb that has not failed to load (avoids broken-image icon). */
    safeFrameThumbOf(m) {
      if (!m?.id || this.failedThumbs[m.id]) return '';
      return this.frameThumbOf(m);
    },
    /** Video file URL for first-frame seek in tiles. */
    videoSrcOf(m) {
      if (!m?.id || this.failedVideos[m.id]) return '';
      if (this.videoUrls[m.id]) return this.videoUrls[m.id];
      const meta = this.metaOf(m);
      const raw = meta.url || meta.cdn_url || '';
      if (!raw) return '';
      if (!requiresBlobPlayback(raw, m) && !isEncryptedMediaMessage(m)) return raw;
      return '';
    },
    coverOf(m) {
      // Audio/file blob URLs are not image covers — keep the icon fallback.
      if (m?.type === 'audio' || m?.type === 'voice' || m?.type === 'file') {
        const cover = this.metaOf(m).cover_url || '';
        if (cover && !requiresBlobPlayback(cover, m)) return cover;
        return '';
      }
      const resolved = this.resolvedSrc(m);
      if (resolved) return resolved;
      const cover = this.metaOf(m).cover_url || '';
      if (cover && !requiresBlobPlayback(cover, m)) return cover;
      return '';
    },
    durationOf(m) {
      const d = this.metaOf(m).duration;
      if (d == null || d === '') return '';
      return formatDuration(d);
    },
    sizeOf(m) {
      const s = this.metaOf(m).size;
      if (!s) return '';
      return formatBytes(s);
    },
    audioTitle(m) {
      const meta = this.metaOf(m);
      if (this.tab === 'voice') return this.$t('messenger.mediaVoice');
      const parsed = parseAudioTitle(meta.name);
      return parsed.title || meta.name || this.$t('messenger.mediaAudio');
    },
    audioArtist(m) {
      if (this.tab === 'voice') return '';
      return parseAudioTitle(this.metaOf(m).name).artist || '';
    },
    timeLabel(m) {
      const t = m?.created_at;
      if (!t) return '';
      try {
        return new Date(t).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) {
        return '';
      }
    },
    firstLink(m) {
      const body = m?.body;
      if (body == null || body === '') return '';
      // Skip obvious ciphertext / undecrypted payloads.
      if (m?.is_encrypted && !m?._e2e_decrypted && typeof body === 'string' && !/\s/.test(body) && body.length > 40) {
        return '';
      }
      const parts = linkifyMessageBody(body);
      const link = parts.find((p) => p.type === 'link');
      return link?.href || link?.text || '';
    },
    linkHost(m) {
      const href = this.firstLink(m);
      if (!href) return '';
      try {
        const u = new URL(href.startsWith('http') || href.startsWith('/') ? href : `https://${href}`, 'https://local.invalid');
        if (href.startsWith('/')) return u.pathname;
        return (u.hostname || '').replace(/^www\./, '') || href;
      } catch (e) {
        return href.replace(/^https?:\/\//i, '').split('/')[0] || href;
      }
    },
    linkSnippet(m) {
      const body = String(m?.body || '').trim();
      const href = this.firstLink(m);
      if (!body) return href || '';
      if (href && (body === href || body === href.replace(/^https?:\/\//i, ''))) return href;
      return body;
    },
    onVideoMeta(e, isGif) {
      const v = e?.target;
      if (!v) return;
      if (isGif) {
        try { v.play?.(); } catch (err) { /* autoplay may fail */ }
        return;
      }
      try {
        const dur = Number(v.duration);
        const t = Number.isFinite(dur) && dur > 0
          ? Math.min(0.45, Math.max(0.05, dur * 0.04))
          : 0.1;
        if (Math.abs((v.currentTime || 0) - t) > 0.01) {
          v.currentTime = t;
        } else {
          this.captureVideoFrame(v, null);
        }
      } catch (err) { /* seek may fail for some codecs */ }
    },
    onVideoSeeked(e, m) {
      this.captureVideoFrame(e?.target, m?.id);
    },
    captureVideoFrame(v, messageId) {
      if (!v || v.videoWidth < 2 || v.videoHeight < 2) return;
      try {
        const canvas = document.createElement('canvas');
        const w = Math.min(320, v.videoWidth);
        const h = Math.round((w / v.videoWidth) * v.videoHeight);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(v, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
        if (messageId != null && dataUrl) {
          this.frameCaptures = { ...this.frameCaptures, [messageId]: dataUrl };
          // Keep showing the video element; capture is a backup for future renders.
        }
      } catch (err) { /* CORS / tainted canvas */ }
    },
    onThumbError(id) {
      if (id == null) return;
      this.failedThumbs = { ...this.failedThumbs, [id]: true };
    },
    onVideoError(id) {
      if (id == null) return;
      this.failedVideos = { ...this.failedVideos, [id]: true };
    },
    closeViewer() {
      this.viewerDownloading = false;
      this.viewer = { open: false, src: '', type: 'photo', message: null, items: [], index: 0 };
    },
    onViewerNavigate({ index, item, patchOnly }) {
      if (patchOnly && item && Number.isFinite(index)) {
        const items = this.viewer.items.slice();
        items[index] = { ...items[index], ...item };
        this.viewer = {
          ...this.viewer,
          items,
          src: items[index]?.src || this.viewer.src,
        };
        return;
      }
      this.viewer = {
        ...this.viewer,
        index,
        src: item?.src || '',
        type: item?.type || this.viewer.type,
        message: item?.message || this.viewer.message,
      };
    },
    async onViewerNeedDownload({ index, item } = {}) {
      const message = item?.message;
      if (!message || this.viewerDownloading) return;
      const url = message?.meta?.url || message?.meta?.cdn_url || message?.meta?.local_url;
      if (!url) return;
      this.viewerDownloading = true;
      try {
        let src = '';
        try {
          const cached = await getCachedBlobUrl(url);
          if (cached) src = cached;
        } catch (e) { /* fall through */ }
        if (!src) {
          const result = await downloadMedia(url, { message });
          src = result?.blobUrl || result?.remoteUrl || '';
        }
        if (!src || !this.viewer.open) return;
        const items = this.viewer.items.slice();
        const i = Number.isFinite(index) ? index : this.viewer.index;
        if (!items[i]) return;
        const thumb = items[i].thumb || this.thumbOf(message) || (items[i].type === 'photo' ? src : '');
        items[i] = { ...items[i], src, downloaded: true, thumb };
        if (message?.id != null && String(src).startsWith('blob:')) {
          this.previewUrls = { ...this.previewUrls, [message.id]: src };
        }
        this.viewer = {
          ...this.viewer,
          items,
          src: i === this.viewer.index ? src : this.viewer.src,
          index: this.viewer.index,
          message: i === this.viewer.index ? message : this.viewer.message,
          type: items[i].type || this.viewer.type,
        };
      } catch (e) {
        console.warn('[shared-media] viewer download failed', message?.id, e);
      } finally {
        this.viewerDownloading = false;
      }
    },
    onViewerNeedMore({ direction } = {}) {
      // Shared media loads newest→oldest pages; near the start of chronological gallery
      // means we need older (further) API pages — which is loadMore.
      if (direction === 'older' || direction === 'newer') {
        if (this.hasMore && !this.loadingMore && !this.loading) {
          this.loadMore().then?.(() => {
            if (!this.viewer.open) return;
            const pool = (this.items || []).filter((row) => {
              if (!row || row.meta?.sticker) return false;
              if (this.tab === 'media') return row.type === 'photo' || row.type === 'video';
              if (this.tab === 'gif') return this.itemKind(row) === 'gif';
              return true;
            });
            const preferred = this.viewer.message;
            const items = this.buildViewerItems(pool, preferred, this.viewer.src);
            // Preserve already-downloaded blob urls from the open viewer.
            const prevById = new Map(
              (this.viewer.items || [])
                .filter((it) => it?.message?.id != null)
                .map((it) => [Number(it.message.id), it]),
            );
            const merged = items.map((it) => {
              const prev = prevById.get(Number(it.message?.id));
              if (!prev) return it;
              return {
                ...it,
                src: prev.src || it.src,
                thumb: prev.thumb || it.thumb,
                downloaded: prev.downloaded || it.downloaded,
              };
            });
            let index = merged.findIndex((it) => Number(it.message?.id) === Number(preferred?.id));
            if (index < 0) index = Math.min(this.viewer.index || 0, Math.max(0, merged.length - 1));
            const cur = merged[index];
            this.viewer = {
              ...this.viewer,
              items: merged,
              index,
              src: cur?.src || this.viewer.src,
              type: cur?.type || this.viewer.type,
              message: cur?.message || this.viewer.message,
            };
          }).catch(() => {});
        }
      }
    },
    hasOverlay() {
      return this.viewer.open;
    },
    handleBack() {
      if (this.viewer.open) {
        this.closeViewer();
        return true;
      }
      return false;
    },
    onGoTo(m) {
      if (!m?.id) return;
      this.closeViewer();
      this.$emit('go-to-message', m.id);
    },
    onViewerGoToMessage(message) {
      this.onGoTo(message);
    },
    onTabDragStart(e) {
      const el = this.$refs.tabsEl;
      if (!el) return;
      this.tabDrag = { active: true, startX: e.pageX, scrollLeft: el.scrollLeft, moved: false };
    },
    onTabDragMove(e) {
      if (!this.tabDrag.active) return;
      const el = this.$refs.tabsEl;
      if (!el) return;
      const dx = e.pageX - this.tabDrag.startX;
      if (Math.abs(dx) > 4) this.tabDrag.moved = true;
      el.scrollLeft = this.tabDrag.scrollLeft - dx;
    },
    onTabDragEnd() {
      this.tabDrag.active = false;
    },
    onTabTouchStart(e) {
      const el = this.$refs.tabsEl;
      if (!el || !e.touches?.[0]) return;
      this.tabDrag = { active: true, startX: e.touches[0].pageX, scrollLeft: el.scrollLeft, moved: false };
    },
    onTabTouchMove(e) {
      if (!this.tabDrag.active || !e.touches?.[0]) return;
      const el = this.$refs.tabsEl;
      if (!el) return;
      const dx = e.touches[0].pageX - this.tabDrag.startX;
      if (Math.abs(dx) > 4) this.tabDrag.moved = true;
      el.scrollLeft = this.tabDrag.scrollLeft - dx;
    },
  },
};
</script>

<style scoped>
.sm-shell {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}
.dark .sm-shell {
  background: #17212b;
  box-shadow: none;
}
.sm-shell--embedded {
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}
.dark .sm-shell--embedded {
  background: transparent;
}

.sm-tabs {
  display: flex;
  gap: 0;
  overflow-x: auto;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  padding: 0 2px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.sm-tabs::-webkit-scrollbar {
  display: none;
}
.dark .sm-tabs {
  background: #17212b;
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.sm-tab {
  position: relative;
  flex: 0 0 auto;
  min-width: 3.75rem;
  padding: 0.55rem 0.75rem 0.45rem;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #707579;
  background: transparent;
  border: 0;
  border-radius: 0;
  transition: color 0.15s ease;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}
.sm-tab:hover {
  color: #4a5560;
}
.dark .sm-tab:hover {
  color: #c5ccd3;
}
.sm-tab.is-active {
  color: #3390ec;
  background: transparent;
}
.dark .sm-tab.is-active {
  color: #6ab2f2;
  background: transparent;
}
.sm-tab.is-active::after {
  content: '';
  position: absolute;
  left: 0.35rem;
  right: 0.35rem;
  bottom: -1px;
  height: 3.5px;
  background: currentColor;
  border-radius: 4px 4px 0 0;
  z-index: 1;
}

.sm-body {
  min-height: 7.5rem;
  background: #fff;
}
.dark .sm-body {
  background: #17212b;
}

.sm-empty {
  padding: 2.4rem 1rem;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #a2acb4;
  animation: tg-empty-in var(--tg-dur-med, 240ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)) both;
}

.sm-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5px;
  margin: 0;
  border-radius: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.06);
}
.dark .sm-grid {
  background: rgba(255, 255, 255, 0.06);
}
@media (min-width: 640px) {
  .sm-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.sm-tile {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  background: #e9eef2;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 120ms ease, transform 120ms ease;
}
.sm-tile:active {
  opacity: 0.92;
  transform: scale(0.985);
}
.dark .sm-tile {
  background: #0e1621;
}
.sm-tile-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #dfe5ea;
  pointer-events: none;
}
.sm-tile-media--under {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.sm-tile > img.sm-tile-media {
  position: relative;
  z-index: 1;
}
.dark .sm-tile-media {
  background: #0e1621;
}
.sm-tile-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a2acb4;
}
.sm-tile-shade {
  position: absolute;
  inset: auto 0 0 0;
  height: 42%;
  z-index: 2;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.45), transparent);
  pointer-events: none;
}
.sm-play {
  position: absolute;
  inset: 0;
  margin: auto;
  z-index: 3;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  border: none;
  box-shadow: none;
}
.sm-play--glass {
  background: rgba(255, 255, 255, 0.16);
  border: none;
  backdrop-filter: blur(8px) saturate(1.2);
  -webkit-backdrop-filter: blur(8px) saturate(1.2);
  box-shadow: none;
  color: #fff;
}
.sm-play-icon {
  width: 11px;
  height: 11px;
  margin-inline-start: 1px;
}
.sm-badge {
  position: absolute;
  bottom: 4px;
  inset-inline-start: 4px;
  z-index: 3;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1;
  padding: 2.5px 4px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  pointer-events: none;
  border: none;
}
.sm-badge--end {
  inset-inline-start: auto;
  inset-inline-end: 4px;
  font-weight: 650;
  letter-spacing: 0;
}

.sm-list {
  display: flex;
  flex-direction: column;
}
.sm-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.045);
  transition: background 0.12s ease;
}
.sm-row:last-child {
  border-bottom: none;
}
.dark .sm-row {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}
.sm-row:hover {
  background: rgba(0, 0, 0, 0.03);
}
.dark .sm-row:hover {
  background: rgba(255, 255, 255, 0.04);
}
.sm-row-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}
.sm-ico {
  width: 15px;
  height: 15px;
}
.sm-ico--file {
  width: 13px;
  height: 13px;
  opacity: 0.92;
  position: absolute;
  top: 3px;
  inset-inline-start: 3px;
}
.sm-row-icon.is-audio {
  background: rgba(52, 199, 89, 0.12);
  color: #2ea66a;
}
.sm-row-icon.is-voice {
  background: rgba(255, 45, 85, 0.1);
  color: #e14b66;
}
.sm-row-icon.is-link {
  background: rgba(51, 144, 236, 0.12);
  color: #3390ec;
}
.sm-row-icon.is-file {
  color: #fff;
}
.sm-file-ext {
  font-size: 7.5px;
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1;
  position: absolute;
  bottom: 3px;
  inset-inline-end: 3px;
  max-width: calc(100% - 4px);
  overflow: hidden;
  text-overflow: ellipsis;
}
.sm-row-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sm-row-text {
  flex: 1;
  min-width: 0;
}
.sm-row-top {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
}
.sm-row-title {
  font-size: 12px;
  font-weight: 550;
  color: #1c1c1e;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  flex: 1;
}
.dark .sm-row-title {
  color: #f2f4f6;
}
.sm-row-title.is-link {
  color: #3390ec;
}
.dark .sm-row-title.is-link {
  color: #6ab2f2;
}
.sm-row-sub {
  margin-top: 1px;
  font-size: 10.5px;
  font-weight: 450;
  color: #8a949c;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sm-row-meta {
  margin-top: 3px;
  font-size: 10.5px;
  color: #a2acb4;
}
.sm-row-meta--inline {
  margin-top: 0;
  flex-shrink: 0;
  font-size: 11px;
  line-height: 1.25;
}
.sm-more {
  padding: 0.65rem;
  text-align: center;
  font-size: 12px;
  color: #a2acb4;
}

.sm-eye {
  position: absolute;
  top: 5px;
  inset-inline-end: 5px;
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 2;
  backdrop-filter: blur(4px);
}
.sm-tile:hover .sm-eye,
.sm-tile:focus-within .sm-eye {
  opacity: 1;
}
@media (hover: none) {
  .sm-eye { opacity: 0.9; }
}
.sm-eye-inline {
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  color: #8e98a0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.45;
  transition: opacity 0.15s ease, background 0.15s ease, color 0.15s ease;
}
.sm-eye-inline:hover,
.group:hover .sm-eye-inline {
  opacity: 1;
  color: #3390ec;
  background: rgba(51, 144, 236, 0.1);
}

.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}
</style>
