<template>
  <div
    class="reply-quote flex items-stretch gap-2 min-w-0"
    :class="embedded ? 'reply-quote--embedded' : 'reply-quote--bar'"
  >
    <div class="flex-shrink-0 self-stretch w-0.5 rounded-sm bg-[#3390ec]" aria-hidden="true" />
    <div class="min-w-0 flex-1 flex items-center gap-2">
      <div class="min-w-0 flex-1">
        <div
          v-if="showTitleRow"
          class="flex items-center gap-1 min-w-0 font-bold text-[#3390ec] dark:text-[#6ab2f2]"
          :class="embedded ? 'text-[12px]' : 'text-[11px]'"
        >
          <span v-if="showTitleIcon" class="flex-shrink-0 inline-flex" aria-hidden="true">
            <svg v-if="kind === 'location'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <svg v-else-if="kind === 'audio'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
            <svg v-else-if="kind === 'voice'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="9" width="2.2" height="6" rx="1.1" /><rect x="7.2" y="5" width="2.2" height="14" rx="1.1" /><rect x="11.4" y="7" width="2.2" height="10" rx="1.1" /><rect x="15.6" y="4" width="2.2" height="16" rx="1.1" /><rect x="19.8" y="8" width="2.2" height="8" rx="1.1" /></svg>
            <svg v-else-if="kind === 'photo'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <svg v-else-if="kind === 'video'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M16 10l5-3v10l-5-3" /></svg>
            <svg v-else-if="kind === 'file'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 3h6l5 5v12a1.5 1.5 0 01-1.5 1.5h-9.5A1.5 1.5 0 015.5 20V4.5A1.5 1.5 0 017 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13 3v5h5" /></svg>
          </span>
          <span class="truncate">{{ titleText }}</span>
        </div>
        <div class="flex items-center gap-1 min-w-0">
          <span v-if="showBodyIcon" class="flex-shrink-0 inline-flex text-[#3390ec] dark:text-[#6ab2f2]" aria-hidden="true">
            <svg v-if="kind === 'location'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <svg v-else-if="kind === 'audio'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
            <svg v-else-if="kind === 'voice'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="9" width="2.2" height="6" rx="1.1" /><rect x="7.2" y="5" width="2.2" height="14" rx="1.1" /><rect x="11.4" y="7" width="2.2" height="10" rx="1.1" /><rect x="15.6" y="4" width="2.2" height="16" rx="1.1" /><rect x="19.8" y="8" width="2.2" height="8" rx="1.1" /></svg>
            <svg v-else-if="kind === 'photo'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <svg v-else-if="kind === 'video'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M16 10l5-3v10l-5-3" /></svg>
            <svg v-else-if="kind === 'file'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 3h6l5 5v12a1.5 1.5 0 01-1.5 1.5h-9.5A1.5 1.5 0 015.5 20V4.5A1.5 1.5 0 017 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13 3v5h5" /></svg>
          </span>
          <span
            class="truncate"
            :class="embedded ? 'text-[13px] opacity-75' : 'text-xs text-gray-500 dark:text-gray-300'"
          >{{ bodyText }}</span>
        </div>
      </div>

      <div
        v-if="showThumb"
        class="relative flex-shrink-0 w-9 h-9 overflow-hidden rounded-md bg-black/10 dark:bg-white/10"
      >
        <img
          v-if="imageThumbSrc"
          :src="imageThumbSrc"
          alt=""
          class="w-full h-full object-cover"
          draggable="false"
          @error="onThumbError"
        />
        <video
          v-else-if="videoThumbSrc"
          :src="videoThumbSrc"
          muted
          playsinline
          preload="metadata"
          class="w-full h-full object-cover pointer-events-none"
          @error="onThumbError"
        />
        <span
          v-if="kind === 'video'"
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <span class="w-4 h-4 rounded-full bg-black/55 flex items-center justify-center">
            <svg class="w-2.5 h-2.5 text-white ms-px" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDuration, isMediaType, mediaTypeLabelKey, parseAudioTitle } from './mediaHelpers';
import { stripFormatMarkers } from './messageFormat';
import { mapGetters, mapState } from "@/composables/useStore";
import { peerDisplayName } from '@/utils/messengerPeerName';

function parseMeta(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }
  return {};
}

const LOCKED_PLACEHOLDER = '🔒 پیام رمزنگاری‌شده';

/** Opaque E2E / media envelope — never show as a human caption. */
function looksLikeCiphertext(body) {
  const s = String(body || '').trim();
  if (!s) return false;
  if (s === LOCKED_PLACEHOLDER) return true;
  return /^[A-Za-z0-9+/=\s._-]{24,}$/.test(s);
}

function isLockedMsg(m) {
  if (!m) return true;
  if (m._e2e_locked && !m._e2e_decrypted) return true;
  if (m.is_encrypted && !m._e2e_decrypted) return true;
  if (looksLikeCiphertext(m.body)) return true;
  return false;
}

export default {
  name: 'ReplyQuotePreview',
  props: {
    message: { type: Object, default: null },
    showTitle: { type: Boolean, default: true },
    titlePrefix: { type: String, default: '' },
    embedded: { type: Boolean, default: true },
  },
  data() {
    return { thumbFailed: false };
  },
  watch: {
    message: {
      deep: true,
      immediate: true,
      handler() {
        this.thumbFailed = false;
      },
    },
  },
  computed: {
    ...mapGetters('messenger', ['contactNameByUserId']),
    ...mapState('messenger', ['messages', 'activeConversationId']),
    /** Prefer decrypted bubble from the open chat over a locked reply snapshot. */
    resolvedMessage() {
      const m = this.message;
      if (!m) return null;
      if (!isLockedMsg(m)) return m;
      const cid = m.conversation_id || this.activeConversationId;
      if (cid == null || m.id == null) return m;
      const list = this.messages?.[cid] || [];
      const local = list.find((x) => Number(x.id) === Number(m.id));
      if (local && !isLockedMsg(local)) {
        return {
          ...m,
          body: local.body,
          type: local.type || m.type,
          meta: local.meta || m.meta,
          user: local.user || m.user,
          is_encrypted: local.is_encrypted ?? m.is_encrypted,
          _e2e_decrypted: true,
          _e2e_locked: false,
          _decryptFailed: false,
          _mediaKey: local._mediaKey || m._mediaKey,
          _mediaIv: local._mediaIv || m._mediaIv,
        };
      }
      return m;
    },
    kind() {
      const m = this.resolvedMessage;
      if (!m || m.deleted) return 'deleted';
      const meta = this.meta;
      if (m.type === 'location' || (meta.lat != null && meta.lng != null)) return 'location';
      if (isMediaType(m.type)) return m.type;
      return 'text';
    },
    meta() {
      return parseMeta(this.resolvedMessage?.meta);
    },
    senderName() {
      const u = this.resolvedMessage?.user;
      if (!u) return '';
      const nick = u.id != null ? this.contactNameByUserId?.[Number(u.id)] : '';
      return peerDisplayName(u, nick);
    },
    titleText() {
      const name = this.senderName;
      const prefix = (this.titlePrefix || '').trim();
      if (prefix && name) return `${prefix} ${name}`;
      if (prefix) return prefix;
      return name;
    },
    showTitleRow() {
      return this.showTitle && !!this.titleText;
    },
    needsTypeIcon() {
      if (this.kind === 'deleted' || this.kind === 'text') return false;
      if (this.kind === 'location' || this.kind === 'voice') return true;
      return !this.showThumb;
    },
    showTitleIcon() {
      return this.showTitleRow && this.needsTypeIcon;
    },
    showBodyIcon() {
      return !this.showTitleRow && this.needsTypeIcon;
    },
    /** Human caption only — never ciphertext / locked placeholders. */
    caption() {
      const m = this.resolvedMessage;
      if (!m) return '';
      // Voice has no text caption in Telegram-style UX.
      if (m.type === 'voice') return '';
      if (isLockedMsg(m)) return '';
      const raw = stripFormatMarkers(m.body || '').trim();
      if (!raw || raw === LOCKED_PLACEHOLDER || looksLikeCiphertext(raw)) return '';
      return raw;
    },
    bodyText() {
      const m = this.resolvedMessage;
      if (!m) return '';
      if (m.deleted || this.kind === 'deleted') return this.$t('messenger.messageDeleted');
      if (this.kind === 'location') {
        return this.caption || this.$t('messenger.location');
      }
      if (this.kind === 'audio') {
        if (this.caption) return this.caption;
        const fromMeta = this.meta.title || parseAudioTitle(this.meta.name).title;
        return fromMeta || this.$t('messenger.mediaAudio');
      }
      if (this.kind === 'voice') {
        const dur = this.meta.duration != null ? formatDuration(this.meta.duration) : '';
        const label = this.$t('messenger.mediaVoice');
        return dur ? `${label} · ${dur}` : label;
      }
      if (this.kind === 'file') {
        if (this.caption) return this.caption;
        return this.meta.name || this.$t('messenger.mediaFile');
      }
      if (isMediaType(this.kind)) {
        return this.caption || this.$t(mediaTypeLabelKey(this.kind));
      }
      // Plain text: still hide raw ciphertext envelopes — but never show the
      // locked placeholder when we can resolve plaintext from the chat cache.
      if (isLockedMsg(m)) {
        return '…';
      }
      return this.caption;
    },
    imageThumbSrc() {
      if (this.thumbFailed) return null;
      if (this.kind === 'photo') {
        return this.meta.thumb_url || this.meta.local_url || this.meta.url || null;
      }
      if (this.kind === 'video' && this.meta.thumb_url) {
        return this.meta.thumb_url;
      }
      if (this.kind === 'audio') {
        return this.meta.cover_url || this.meta.local_cover || this.meta.thumb_url || null;
      }
      return null;
    },
    videoThumbSrc() {
      if (this.thumbFailed || this.kind !== 'video' || this.imageThumbSrc) return null;
      const raw = this.meta.local_url || this.meta.url || null;
      if (!raw) return null;
      if (String(raw).startsWith('blob:') || String(raw).includes('#')) return raw;
      return `${raw}#t=0.1`;
    },
    showThumb() {
      if (this.thumbFailed) return false;
      // imageThumbSrc/videoThumbSrc already null when thumbFailed, but keep explicit.
      if (this.kind === 'photo') {
        return !!(this.meta.thumb_url || this.meta.local_url || this.meta.url);
      }
      if (this.kind === 'video') {
        return !!(this.meta.thumb_url || this.meta.local_url || this.meta.url);
      }
      if (this.kind === 'audio') {
        return !!(this.meta.cover_url || this.meta.local_cover || this.meta.thumb_url);
      }
      return false;
    },
  },
  methods: {
    onThumbError() {
      this.thumbFailed = true;
    },
  },
};
</script>

<style scoped>
.reply-quote--embedded {
  padding-block: 2px;
  padding-inline-end: 6px;
  border-start-end-radius: 6px;
  border-end-end-radius: 6px;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.15s ease;
}
:global(html.dark) .reply-quote--embedded,
:global(.dark) .reply-quote--embedded {
  background: rgba(255, 255, 255, 0.05);
}
.reply-quote--embedded:hover {
  background: rgba(0, 0, 0, 0.1);
}
:global(html.dark) .reply-quote--embedded:hover,
:global(.dark) .reply-quote--embedded:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
