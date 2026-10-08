<template>
  <button
    type="button"
    class="sticker-msg"
    :class="{ 'is-mine': isMine, 'is-loading': !ready }"
    :aria-label="$t('messenger.panelStickers')"
    @click.stop="onTap"
    @contextmenu.prevent="onContextMenu"
  >
    <div v-if="!ready" class="sticker-msg__skel" aria-hidden="true" />
    <img
      v-show="ready && displaySrc"
      :src="displaySrc"
      alt=""
      class="sticker-msg__img"
      draggable="false"
      @load="onImgLoad"
      @error="onImgError"
    >
    <div v-if="isUploading" class="sticker-msg__upload">
      <UploadProgressRing size="sm" :percent="uploadPercent" />
    </div>
  </button>
</template>

<script>
import UploadProgressRing from './UploadProgressRing.vue';
import {
  resolveStickerDisplaySrc,
  putCachedStickerBlob,
  getCachedStickerBlob,
} from './stickerGifLibrary';
import { findStickerById } from './stickerPacks';
import { downloadMedia } from './mediaCache';
import { isMessengerMediaProxyUrl } from '@/crypto/messenger/mediaAuth';

const STICKER_SIZE = 160;

function isUsableInlineSrc(src) {
  if (!src) return false;
  const s = String(src);
  return s.startsWith('data:') || s.startsWith('blob:');
}

export default {
  name: 'StickerMessageCard',
  inject: {
    consumeChatAccessoryTap: { default: null },
  },
  components: { UploadProgressRing },
  props: {
    message: { type: Object, required: true },
    isMine: { type: Boolean, default: false },
    autoUnlock: { type: Boolean, default: true },
  },
  emits: ['open-pack', 'open-menu', 'cancel-upload'],
  data() {
    return {
      displaySrc: null,
      ready: false,
      objectUrl: null,
      loadToken: 0,
    };
  },
  computed: {
    meta() {
      return this.message?.meta || {};
    },
    isUploading() {
      return !!(this.message?.pending && !this.message?.failed);
    },
    uploadPercent() {
      const p = Number(this.message?.upload_progress);
      if (!Number.isFinite(p)) return 0;
      return Math.max(0, Math.min(99, Math.round(p)));
    },
    stickerId() {
      return this.meta.sticker_id || this.message?.client_id || this.message?.id;
    },
    proxyUrl() {
      const url = this.meta.url;
      if (url && isMessengerMediaProxyUrl(String(url))) return String(url);
      const mid = this.message?.id;
      if (mid && Number(mid) > 0) return `/api/messenger/media/${mid}`;
      return null;
    },
  },
    watch: {
      message: {
        deep: true,
        handler(next, prev) {
          // Only reload when the media identity / URLs actually change.
          const n = next?.meta || {};
          const p = prev?.meta || {};
          const changed = !prev
            || next?.id !== prev?.id
            || next?.client_id !== prev?.client_id
            || n.cdn_url !== p.cdn_url
            || n.url !== p.url
            || n.local_url !== p.local_url
            || n.sticker_id !== p.sticker_id
            || n.media_id !== p.media_id;
          if (changed) this.load();
        },
      },
    },
  mounted() {
    this.load();
  },
  beforeUnmount() {
    this.revoke();
  },
  methods: {
    onContextMenu(event) {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      this.$emit('open-menu', { event, message: this.message });
    },
    revoke() {
      if (this.objectUrl && String(this.objectUrl).startsWith('blob:')) {
        try { URL.revokeObjectURL(this.objectUrl); } catch (e) { /* noop */ }
      }
      this.objectUrl = null;
    },
    setDisplay(src, { objectUrl = null } = {}) {
      this.revoke();
      if (objectUrl) this.objectUrl = objectUrl;
      else if (src && String(src).startsWith('blob:')) this.objectUrl = src;
      this.displaySrc = src;
      this.ready = !!src;
    },
    async load() {
      const token = ++this.loadToken;
      // Don't flash the skeleton if we already painted a sticker — meta patches
      // (upload settle / cdn_url) used to blank the image on every deep watch.
      const keepVisible = !!this.displaySrc && this.ready;

      // 1) Local blob / data (optimistic send) — always safe for <img>.
      const local = this.meta.local_url;
      if (isUsableInlineSrc(local)) {
        if (token !== this.loadToken) return;
        this.setDisplay(local);
        return;
      }

      // 2) IndexedDB cache by sticker id.
      const id = this.stickerId;
      if (id) {
        try {
          const cached = await getCachedStickerBlob(id);
          if (token !== this.loadToken) return;
          if (cached) {
            const url = URL.createObjectURL(cached);
            this.setDisplay(url, { objectUrl: url });
            return;
          }
        } catch (e) { /* noop */ }
      }

      // 3) Pack data: preview (never prefer broken http CDN over media proxy).
      const fromPack = id ? findStickerById(id) : null;
      if (isUsableInlineSrc(fromPack?.src)) {
        if (token !== this.loadToken) return;
        this.setDisplay(fromPack.src);
        return;
      }

      if (!keepVisible) this.ready = false;

      // 4) Public sticker CDN first when available (pack / public sticker uploads).
      const cdn = this.meta.cdn_url;
      if (cdn && /^https?:\/\//i.test(String(cdn))) {
        if (token !== this.loadToken) return;
        this.setDisplay(cdn);
        return;
      }

      // 5) Authenticated message media proxy — stickers always download (Telegram-like).
      // Recipients lack local pack/blob cache; photo auto-download must not hide stickers.
      const remote = this.proxyUrl || this.meta.url || null;
      if (remote && (this.autoUnlock || this.isMine || !!this.meta.sticker)) {
        try {
          const { blobUrl } = await downloadMedia(remote, { message: this.message });
          if (token !== this.loadToken) return;
          if (blobUrl) {
            try {
              const res = await fetch(blobUrl);
              const blob = await res.blob();
              if (id && blob) await putCachedStickerBlob(id, blob);
            } catch (e) { /* noop */ }
            this.setDisplay(blobUrl, { objectUrl: blobUrl });
            return;
          }
        } catch (e) { /* fall through */ }
      }

      // 6) Public http pack/src only as last resort (may 404 on static host).
      const httpCandidate = [fromPack?.src, this.meta.url, local]
        .find((u) => u && /^https?:\/\//i.test(String(u)) && !isMessengerMediaProxyUrl(String(u)));
      if (httpCandidate) {
        if (token !== this.loadToken) return;
        this.setDisplay(httpCandidate);
        return;
      }

      // 7) Emoji render fallback only when there is truly no image asset.
      const kind = this.meta.sticker_kind || (this.meta.sticker_emoji ? 'emoji' : 'image');
      if (kind === 'emoji' && this.meta.sticker_emoji) {
        const resolved = await resolveStickerDisplaySrc({
          id: this.meta.sticker_id,
          emoji: this.meta.sticker_emoji,
          kind: 'emoji',
        });
        if (token !== this.loadToken) return;
        if (resolved?.url) {
          this.setDisplay(resolved.url, {
            objectUrl: String(resolved.url).startsWith('blob:') ? resolved.url : null,
          });
          return;
        }
      }

      if (token !== this.loadToken) return;
      if (!keepVisible) this.setDisplay(null);
    },
    onImgLoad() {
      this.ready = true;
    },
    async onImgError() {
      // Broken http/static preview → retry via authenticated media proxy.
      const remote = this.proxyUrl;
      if (remote && this.displaySrc !== remote && !String(this.displaySrc || '').startsWith('blob:')) {
        try {
          const { blobUrl } = await downloadMedia(remote, { message: this.message });
          if (blobUrl) {
            this.setDisplay(blobUrl, { objectUrl: blobUrl });
            return;
          }
        } catch (e) { /* noop */ }
      }
      this.ready = false;
      this.displaySrc = null;
    },
    onTap() {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      this.$emit('open-pack', {
        packId: this.meta.sticker_pack_id || null,
        stickerId: this.meta.sticker_id || null,
        emoji: this.meta.sticker_emoji || null,
        kind: this.meta.sticker_kind || (this.displaySrc ? 'image' : 'emoji'),
        src: this.displaySrc || this.meta.cdn_url || this.meta.local_url || null,
        cdn_url: this.meta.cdn_url || null,
        mediaId: this.meta.media_id || null,
        width: this.meta.width || null,
        height: this.meta.height || null,
        message: this.message,
      });
    },
  },
  STICKER_SIZE,
};
</script>

<style scoped>
.sticker-msg {
  position: relative;
  display: block;
  width: 160px;
  height: 160px;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}

.sticker-msg__skel {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: linear-gradient(
    110deg,
    rgba(120, 140, 160, 0.18) 25%,
    rgba(120, 140, 160, 0.32) 37%,
    rgba(120, 140, 160, 0.18) 63%
  );
  background-size: 200% 100%;
  animation: sticker-skel 1.15s ease-in-out infinite;
}

.sticker-msg__img {
  display: block;
  width: 160px;
  height: 160px;
  object-fit: contain;
  background: transparent;
  border-radius: 0;
  pointer-events: none;
}

.sticker-msg__upload {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.18);
  border-radius: 12px;
}

@keyframes sticker-skel {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 640px) {
  .sticker-msg,
  .sticker-msg__img {
    width: 140px;
    height: 140px;
  }
}
</style>
