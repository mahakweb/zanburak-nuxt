<template>
  <div
    class="doc-card"
    :class="[isMine ? 'is-mine' : 'is-other', isUploading ? 'is-uploading' : '']"
    data-media-interactive
  >
    <div
      class="doc-row"
      dir="ltr"
      :class="{ 'is-button': !isUploading }"
      :role="isUploading ? undefined : 'button'"
      :tabindex="isUploading ? undefined : 0"
      :title="fileName"
      @click="onOpen"
      @keydown.enter.prevent="onOpen"
      @keydown.space.prevent="onOpen"
    >
      <!-- Telegram: circular colored badge + square document glyph -->
      <span class="doc-icon" :class="{ 'is-error': loadFailed }" :style="loadFailed ? undefined : { background: iconColor }" aria-hidden="true">
        <UploadProgressRing
          v-if="isUploading"
          size="sm"
          :percent="uploadPercent"
          cancelable
          :cancel-label="$t('messenger.cancelUpload')"
          @cancel="onCancelUpload"
        />
        <svg v-else class="doc-glyph" viewBox="-3 0 32 32" aria-hidden="true">
          <path
            fill="currentColor"
            d="M176,109 C174.896,109 174,108.104 174,107 L174,103 L180,109 L176,109 L176,109 Z M174,101 L174,101.028 C173.872,101.028 160,101 160,101 C157.791,101 156,102.791 156,105 L156,129 C156,131.209 157.791,133 160,133 L178,133 C180.209,133 182,131.209 182,129 L182,111 L182,109 L174,101 L174,101 Z"
            transform="translate(-156 -101)"
          />
        </svg>
      </span>

      <span class="doc-meta min-w-0 flex-1 text-start">
        <span class="doc-name" dir="ltr" lang="en" :title="fileName">
          <span class="doc-basename">{{ displayBaseName }}</span><span
            v-if="extSuffix"
            class="doc-filesuffix"
          >{{ extSuffix }}</span>
        </span>
        <span v-if="loadFailed" class="doc-sub is-err" dir="auto">{{ $t('messenger.mediaDownloadFailed') }}</span>
        <span v-else-if="sizeLabel || extUpper" class="doc-sub" dir="ltr" lang="en">
          <span v-if="sizeLabel">{{ sizeLabel }}</span><span
            v-if="sizeLabel && extUpper"
            class="doc-sub-sep"
          > · </span><span v-if="extUpper" class="doc-sub-ext">{{ extUpper }}</span>
        </span>
      </span>

      <!-- Context menu trigger — opposite the icon, no background -->
      <button
        v-if="showMenuBtn && !isUploading"
        type="button"
        class="doc-menu-btn"
        data-msg-menu-hit
        :aria-label="$t('messenger.more')"
        @click.stop.prevent="onOpenMenu"
      >
        <svg class="doc-menu-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="12" cy="19" r="1.7" />
        </svg>
      </button>
    </div>

    <div v-if="showCaption" class="doc-caption whitespace-pre-wrap break-words" dir="auto">
      <template v-for="(part, i) in captionParts" :key="'dc'+i">
        <a
          v-if="part.type === 'link'"
          :href="part.href"
          class="msg-body-link"
          rel="noopener noreferrer"
          @click="$emit('open-link', part, $event)"
        >{{ part.text }}</a>
        <span v-else>{{ part.text }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { fileExtColor, fileExtension, formatBytes } from './mediaHelpers';
import { formatMessageBody } from './messageFormat';
import { saveMediaToDevice } from './mediaCache';
import { shapeUiDigits } from './appearance';
import UploadProgressRing from './UploadProgressRing.vue';

export default {
  name: 'DocumentMessageCard',
  inject: {
    consumeChatAccessoryTap: { default: null },
  },
  components: { UploadProgressRing },
  props: {
    message: { type: Object, required: true },
    isMine: { type: Boolean, default: false },
    hideCaption: { type: Boolean, default: false },
    showMenuBtn: { type: Boolean, default: false },
  },
  emits: ['open-link', 'cancel-upload', 'open-menu'],
  data() {
    return { opening: false, loadFailed: false };
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
    fileName() {
      return this.meta.name || this.$t('messenger.mediaFile');
    },
    ext() {
      return this.meta.ext || fileExtension(this.fileName) || '';
    },
    baseName() {
      const name = String(this.fileName || '');
      if (!this.ext) return name;
      const suffix = `.${this.ext}`;
      if (name.toLowerCase().endsWith(suffix.toLowerCase())) {
        return name.slice(0, -suffix.length);
      }
      return name;
    },
    /** Single-line name with middle ellipsis when too long; extension always kept. */
    displayBaseName() {
      const raw = String(this.baseName || '');
      const max = 22;
      let out = raw;
      if (raw.length > max) {
        const keep = max - 1;
        const head = Math.ceil(keep / 2);
        const tail = Math.floor(keep / 2);
        out = `${raw.slice(0, head)}…${raw.slice(-tail)}`;
      }
      return shapeUiDigits(out, 'message');
    },
    extSuffix() {
      if (!this.ext) return '';
      return shapeUiDigits(`.${String(this.ext).toLowerCase()}`, 'message');
    },
    extUpper() {
      return this.ext ? shapeUiDigits(String(this.ext).toUpperCase(), 'message') : '';
    },
    iconColor() {
      return fileExtColor(this.ext || 'file');
    },
    sizeLabel() {
      return this.meta.size != null ? formatBytes(this.meta.size) : '';
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
    downloadUrl() {
      const u = this.meta.url || this.meta.local_url || '';
      if (!u || String(u).startsWith('blob:')) return this.meta.url || '';
      return u;
    },
  },
  methods: {
    onCancelUpload() {
      this.$emit('cancel-upload', this.message);
    },
    onOpenMenu(event) {
      if (!this.showMenuBtn || this.isUploading) return;
      this.$emit('open-menu', { event, message: this.message });
    },
    async onOpen() {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      if (this.isUploading || this.opening) return;
      const url = this.downloadUrl || this.meta.local_url;
      if (!url) return;
      this.opening = true;
      this.loadFailed = false;
      try {
        if (String(url).startsWith('blob:')) {
          const a = document.createElement('a');
          a.href = url;
          a.download = this.fileName;
          a.rel = 'noopener';
          document.body.appendChild(a);
          a.click();
          a.remove();
          return;
        }
        const ok = await saveMediaToDevice(url, this.fileName, this.message);
        if (!ok) this.loadFailed = true;
      } catch (e) {
        this.loadFailed = true;
      } finally {
        this.opening = false;
      }
    },
  },
};
</script>

<style scoped>
/* Telegram-style: flat row inside the message bubble — no nested card. */
.doc-card {
  min-width: 210px;
  max-width: min(280px, 72vw);
}
.doc-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
  color: inherit;
  text-align: start;
  direction: ltr;
}
.doc-row.is-button {
  cursor: pointer;
}
.doc-row:not(.is-button) {
  cursor: default;
}

/* Circular badge — Telegram file icon */
.doc-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}
.doc-icon.is-error {
  background: #e11d48 !important;
}
.doc-glyph {
  width: 18px;
  height: 18px;
  display: block;
  color: #fff;
}

.doc-name {
  display: flex;
  align-items: baseline;
  min-width: 0;
  max-width: 100%;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.25;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
}
.doc-basename {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  direction: ltr;
  unicode-bidi: isolate;
}
.doc-filesuffix {
  flex-shrink: 0;
  white-space: nowrap;
}
.doc-sub {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.25;
  opacity: 0.85;
  font-weight: 600;
  color: inherit;
  white-space: nowrap;
  letter-spacing: 0.01em;
}
.doc-sub.is-err {
  color: #e11d48;
  opacity: 1;
  font-size: 11px;
  font-weight: 700;
}
.doc-sub-ext {
  font-weight: 600;
  letter-spacing: 0.02em;
}
.doc-caption {
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.35;
}

.doc-menu-btn {
  flex-shrink: 0;
  width: 26px;
  height: 28px;
  margin: 0;
  margin-left: auto; /* keep name glued to icon; push ⋮ to the far edge */
  margin-right: -10px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  opacity: 0.55;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.doc-menu-btn:hover,
.doc-menu-btn:focus-visible {
  opacity: 0.9;
  outline: none;
}
.doc-menu-btn:active {
  transform: scale(0.92);
  opacity: 1;
}
.doc-menu-ico {
  width: 16px;
  height: 16px;
  display: block;
}
</style>
