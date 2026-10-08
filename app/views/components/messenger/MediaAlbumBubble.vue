<template>
  <div
    :data-mid="primaryId"
    :class="[
      'msg-row relative flex w-full',
      tight ? 'msg-row--tight' : 'msg-row--loose',
      selectionMode ? 'cursor-pointer' : '',
    ]"
    @click="onRootClick"
  >
    <div
      v-show="selectionMode && selected"
      class="msg-select-tint pointer-events-none absolute inset-y-0 inset-x-[-8px] rounded-lg"
      aria-hidden="true"
    />

    <button
      type="button"
      class="msg-select-circle"
      :class="{ 'is-on': selectionMode, 'is-selected': selected, 'is-mine': isMine }"
      :tabindex="selectionMode ? 0 : -1"
      :aria-hidden="!selectionMode"
      :aria-pressed="selected"
      :aria-label="$t('messenger.select')"
      @click.stop="$emit('toggle-select-album', messageIds)"
    >
      <svg v-if="selected" class="msg-select-check" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <div
      :class="[
        'msg-row-body flex-1 flex items-end gap-2.5 min-w-0 relative',
        isMine ? 'justify-end is-mine' : 'justify-start',
        selectionMode ? 'is-selecting' : '',
      ]"
    >
      <div v-if="!isMine && showAvatarColumn" :class="avatarColumnClass">
        <button
          v-if="showAvatar && avatarUser && !isOwnAvatar"
          type="button"
          class="msg-avatar-btn block leading-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3390ec]"
          @click.stop="$emit('avatar-click', avatarUser?.id != null ? avatarUser : { ...avatarUser, id: avatarUser?.user_id })"
        >
          <MessengerAvatar :user="avatarUser" size="xs" />
        </button>
        <div v-else-if="showAvatar && avatarUser" class="leading-none">
          <MessengerAvatar :user="avatarUser" size="xs" />
        </div>
      </div>

      <span
        v-if="isMine && primary?.failed"
        class="flex-shrink-0 self-center w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center shadow-sm ring-2 ring-red-500/30"
        :title="$t('messenger.sendError')"
      >!</span>

      <div
        data-msg-bubble
        :class="[
          'relative album-bubble max-w-[82%] sm:max-w-[70%] text-[15px] p-0.5',
          isMine
            ? 'msg-bubble-mine text-gray-900 dark:text-gray-100 is-mine-fwd'
            : 'msg-bubble-other bg-white dark:bg-[#1e2c3a] text-gray-900 dark:text-gray-100',
          bubbleShape,
        ]"
        @contextmenu.prevent="onContext"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="clearLp"
      >
        <span
          v-if="hasTail"
          :class="[
            'msg-tail absolute bottom-[1px] w-[12px] h-[15px] pointer-events-none z-[2]',
            isMine ? 'msg-tail-mine text-[#eeffde] dark:text-[#3e6b41]' : 'msg-tail-other text-white dark:text-[#1e2c3a]',
          ]"
        >
          <svg class="w-4 h-4 block transform rtl:scale-x-[-1]" fill="none" viewBox="0 0 20 20">
            <path
              d="M20 20 V6 C20 10 18 13 16 15 C14.5 16.5 13 17.5 12 18 C10.8 18.5 10 18.8 10 19.4 C10 20 11 20 13 20 Z"
              fill="currentColor"
            />
          </svg>
        </span>

        <div
          v-if="forwardedFromName"
          data-forward-preview
          class="msg-fwd msg-fwd--padded"
          :class="{ 'is-tappable': forwardTapEnabled }"
          @click.stop="onForwardHeaderTap"
        >
          <div class="msg-fwd-row">
            <svg class="msg-fwd-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.5 5.5v3.4C8.15 9.35 5.2 10.9 3.5 14.85c.9-2.55 3.05-4.2 6.5-4.5v3.15L16.5 9.5 12.5 5.5z" />
            </svg>
            <span class="msg-fwd-label">{{ $t('messenger.forwardedFrom') }}</span>
          </div>
          <button
            type="button"
            class="msg-fwd-name"
            dir="auto"
            :tabindex="forwardTapEnabled ? 0 : -1"
            :aria-disabled="!forwardTapEnabled"
            @click.stop="onForwardHeaderTap"
          >{{ forwardedFromName }}</button>
        </div>

        <div
          v-else-if="senderLabel"
          class="text-[12px] font-bold mb-px truncate px-1"
          :style="{ color: senderColor }"
        >
          {{ senderLabel }}
        </div>

        <div :class="['msg-body-stack', 'msg-media-frame', hasCaption ? 'has-caption' : '']">
          <div class="msg-media-clip msg-media-stage relative overflow-hidden" :style="{ borderRadius: '12px' }">
            <MediaAlbumCard
              :messages="orderedMessages"
              :is-mine="isMine"
              flush
              @open-lightbox="$emit('open-lightbox', $event)"
              @cancel-upload="$emit('cancel-upload', $event)"
            >
              <template v-if="!hasCaption" #overlay>
                <div
                  data-msg-menu-hit
                  class="msg-meta msg-meta--on-media msg-meta--menu-hit"
                  :style="{ borderRadius: '10px' }"
                  @click.stop="onMetaMenuTap"
                >
                  <span v-if="isEdited" class="msg-meta-text" dir="auto">{{ $t('messenger.edited') }}</span>
                  <span class="msg-meta-text" dir="auto">{{ formattedTime }}</span>
                  <template v-if="isMine">
                    <PendingClockIcon v-if="anyPending" />
                    <template v-else-if="!anyFailed">
                      <svg
                        v-if="allRead"
                        class="msg-meta-icon text-sky-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        aria-hidden="true"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                      </svg>
                      <svg
                        v-else-if="anyDelivered"
                        class="msg-meta-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        aria-hidden="true"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                      </svg>
                      <svg
                        v-else
                        class="msg-meta-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        aria-hidden="true"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                      </svg>
                    </template>
                  </template>
                </div>
              </template>
            </MediaAlbumCard>
          </div>

          <div v-if="hasCaption" class="msg-album-caption px-1.5 pt-1.5 pb-0.5">
            <p class="text-[14px] leading-snug whitespace-pre-wrap break-words" dir="auto">{{ caption }}</p>
            <div class="msg-meta msg-meta--badge msg-meta--media mt-1" dir="ltr">
              <span v-if="isEdited" class="msg-meta-text" dir="auto">{{ $t('messenger.edited') }}</span>
              <span class="msg-meta-text" dir="auto">{{ formattedTime }}</span>
              <template v-if="isMine">
                <PendingClockIcon v-if="anyPending" />
                <template v-else-if="!anyFailed">
                  <svg
                    v-if="allRead"
                    class="msg-meta-icon text-sky-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                  </svg>
                  <svg
                    v-else-if="anyDelivered"
                    class="msg-meta-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                  </svg>
                  <svg
                    v-else
                    class="msg-meta-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                  </svg>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isMine && showAvatarColumn" :class="avatarColumnClass">
        <div v-if="showAvatar && avatarUser" class="leading-none">
          <MessengerAvatar :user="avatarUser" size="xs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessengerAvatar from './MessengerAvatar.vue';
import MediaAlbumCard from './MediaAlbumCard.vue';
import PendingClockIcon from './PendingClockIcon.vue';
import { mapGetters } from "@/composables/useStore";
import { peerDisplayName } from '@/utils/messengerPeerName';
import { LONG_PRESS_MS } from './motion';
import { shapeUiDigits } from './appearance';

export default {
  name: 'MediaAlbumBubble',
  inject: {
    consumeChatAccessoryTap: { default: null },
  },
  components: { MessengerAvatar, MediaAlbumCard, PendingClockIcon },
  props: {
    messages: { type: Array, default: () => [] },
    isMine: { type: Boolean, default: false },
    selectionMode: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    groupPos: { type: String, default: 'single' },
    tight: { type: Boolean, default: false },
    showAvatar: { type: Boolean, default: false },
    avatarUser: { type: Object, default: null },
    chatType: { type: String, default: 'private' },
    showSenderName: { type: Boolean, default: false },
  },
  emits: [
    'toggle-select-album',
    'enter-select-album',
    'avatar-click',
    'context',
    'open-lightbox',
    'cancel-upload',
    'forward-tap',
    'forward-chat-tap',
  ],
  data() {
    return {
      lpTimer: null,
      lpFired: false,
      lpStartPos: null,
      touchMoved: false,
    };
  },
  computed: {
    ...mapGetters('messenger', ['contactNameByUserId']),
    isOwnAvatar() {
      return !!this.isMine;
    },
    primary() {
      const real = (this.messages || []).filter((m) => !m?.meta?._album_placeholder);
      return real[real.length - 1] || real[0] || this.messages[this.messages.length - 1] || this.messages[0] || null;
    },
    /** Prefer any album item that carries forward attribution. */
    forwardSource() {
      return (this.messages || []).find((m) => (
        m?.forward_from_chat || m?.meta?.fwd_chat || m?.forwarded_from
      )) || this.primary;
    },
    fwdChat() {
      const m = this.forwardSource;
      return m?.forward_from_chat || m?.meta?.fwd_chat || null;
    },
    forwardTapEnabled() {
      if (this.fwdChat?.id) return true;
      const u = this.forwardSource?.forwarded_from;
      if (!u) return false;
      if (u.forward_tap_to_chat === false || u.forward_tap_to_chat === 0) return false;
      return true;
    },
    forwardedFromName() {
      if (this.fwdChat?.title) return this.fwdChat.title;
      const u = this.forwardSource?.forwarded_from;
      if (!u) return '';
      const nick = u.id != null ? this.contactNameByUserId?.[Number(u.id)] : '';
      return peerDisplayName(u, nick);
    },
    /** Message that owns the album caption (edit target). */
    captionMessage() {
      const withCap = this.messages.find((m) => !m?.meta?._album_placeholder && String(m?.body || '').trim());
      if (withCap) return withCap;
      return this.messages.find((m) => !m?.meta?._album_placeholder) || this.messages[0] || null;
    },
    menuMessage() {
      return this.captionMessage || this.primary;
    },
    primaryId() {
      return this.primary?.id || this.primary?.client_id || '';
    },
    messageIds() {
      return this.messages
        .filter((m) => !m?.meta?._album_placeholder)
        .map((m) => m.id)
        .filter((id) => id != null && !String(id).startsWith('albph_'));
    },
    /** Preserve composer order via album_index (Telegram); aspect is layout-only. */
    orderedMessages() {
      return [...(this.messages || [])].sort((a, b) => {
        const ai = Number(a?.meta?.album_index);
        const bi = Number(b?.meta?.album_index);
        const aOk = Number.isFinite(ai);
        const bOk = Number.isFinite(bi);
        if (aOk && bOk && ai !== bi) return ai - bi;
        if (aOk && !bOk) return -1;
        if (!aOk && bOk) return 1;
        return 0;
      });
    },
    caption() {
      const m = this.captionMessage;
      return m ? String(m.body || '').trim() : '';
    },
    hasCaption() {
      return !!this.caption;
    },
    isEdited() {
      return this.messages.some((m) => !!m.edited_at);
    },
    anyPending() {
      return this.messages.some((m) => m.pending && !m.failed && !m?.meta?._album_placeholder);
    },
    anyFailed() {
      return this.messages.some((m) => m.failed && !m?.meta?._album_placeholder);
    },
    allRead() {
      const real = this.messages.filter((m) => !m?.meta?._album_placeholder);
      return real.length > 0 && real.every((m) => !!m.read_at);
    },
    anyDelivered() {
      return this.messages.some((m) => !m?.meta?._album_placeholder && (!!m.delivered_at || !!m.read_at));
    },
    metaLocale() {
      const loc = this.$i18n?.locale || 'fa';
      if (String(loc).startsWith('fa')) return 'fa-IR';
      if (String(loc).startsWith('ar')) return 'ar';
      if (String(loc).startsWith('tr')) return 'tr-TR';
      return 'en-US';
    },
    formattedTime() {
      const raw = this.primary?.created_at;
      if (!raw) return '';
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return '';
      return d.toLocaleTimeString(this.metaLocale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },
    hasTail() {
      return this.groupPos === 'single' || this.groupPos === 'last';
    },
    showAvatarColumn() {
      if (this.chatType === 'channel') return false;
      if (this.chatType === 'group') return true;
      if (this.chatType === 'private' || this.chatType === 'saved') return true;
      return false;
    },
    avatarColumnClass() {
      const base = 'w-8 flex-shrink-0 self-end items-end';
      if (this.chatType === 'group' && !this.isMine) return `${base} flex`;
      return `${base} hidden lg:flex`;
    },
    senderLabel() {
      if (!this.showSenderName || this.isMine) return '';
      if (this.groupPos === 'middle' || this.groupPos === 'last') return '';
      const u = this.avatarUser;
      if (!u) return '';
      const nick = u.id != null ? this.contactNameByUserId?.[Number(u.id)] : '';
      return peerDisplayName(u, nick);
    },
    senderColor() {
      const id = Number(this.avatarUser?.id || this.primary?.user_id || 0);
      const palette = ['#e17076', '#eda86c', '#a695e7', '#7bc862', '#6ec9cb', '#65aadd', '#ee7aae'];
      return palette[Math.abs(id) % palette.length];
    },
    bubbleShape() {
      const g = this.groupPos;
      if (this.isMine) {
        if (g === 'first') return 'rounded-2xl rounded-ee-md';
        if (g === 'middle') return 'rounded-s-2xl rounded-e-md';
        if (g === 'last') return 'rounded-s-2xl rounded-ee-none rounded-e-md';
        return 'rounded-2xl rounded-ee-none';
      }
      if (g === 'first') return 'rounded-2xl rounded-es-md';
      if (g === 'middle') return 'rounded-e-2xl rounded-s-md';
      if (g === 'last') return 'rounded-s-md rounded-es-none rounded-e-2xl';
      return 'rounded-2xl rounded-es-none';
    },
  },
  beforeUnmount() {
    this.clearLp();
  },
  methods: {
    onRootClick(e) {
      if (this.selectionMode) {
        this.$emit('toggle-select-album', this.messageIds);
        return;
      }
      if (this.anyPending) return;
      // Empty gutter beside album → open message menu.
      if (e.target.closest('[data-msg-bubble], button, a, label, .msg-avatar-btn')) return;
      this.emitContext(e);
    },
    onForwardHeaderTap() {
      if (!this.forwardTapEnabled) return;
      if (this.fwdChat?.id) {
        this.$emit('forward-chat-tap', this.fwdChat);
        return;
      }
      const u = this.forwardSource?.forwarded_from;
      if (!u?.id) return;
      this.$emit('forward-tap', u);
    },
    onContext(e) {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) {
        if (e?.preventDefault) e.preventDefault();
        return;
      }
      if (this.selectionMode || this.anyPending) return;
      // Touch long-press must not open the menu — selection owns hold.
      if (this.lpStartPos || (e && e.pointerType === 'touch')) {
        if (e?.preventDefault) e.preventDefault();
        return;
      }
      if (typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        if (e?.preventDefault) e.preventDefault();
        return;
      }
      this.emitContext(e);
    },
    onMetaMenuTap(e) {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      if (this.selectionMode || this.anyPending) return;
      this.emitContext(e);
    },
    emitContext(event) {
      this.$emit('context', {
        event,
        message: this.menuMessage,
        albumMessageIds: this.messageIds,
        albumMessages: this.messages,
      });
    },
    isMediaOpenTarget(target) {
      if (!target || typeof target.closest !== 'function') return false;
      if (target.closest('[data-msg-menu-hit], .media-menu-btn')) return false;
      return !!target.closest('[data-media-interactive], button, a, video, audio');
    },
    isMediaControlTarget(target) {
      if (!target || typeof target.closest !== 'function') return false;
      return !!target.closest(
        'button, a, audio, .media-menu-btn, .media-dl-btn, .media-upload-overlay, [data-media-control]'
      );
    },
    onTouchStart(e) {
      if (this.selectionMode || this.anyPending) return;
      const t = e.touches && e.touches[0];
      const target = t && document.elementFromPoint(t.clientX, t.clientY);
      if (this.isMediaControlTarget(target)) {
        this.lpStartPos = null;
        this.clearLp();
        return;
      }
      this.lpStartPos = t ? { x: t.clientX, y: t.clientY } : null;
      this.lpFired = false;
      this.touchMoved = false;
      this.clearLp();
      this.lpTimer = setTimeout(() => {
        this.lpFired = true;
        if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) { /* noop */ } }
        this.$emit('enter-select-album', this.messageIds);
      }, LONG_PRESS_MS);
    },
    onTouchMove(e) {
      if (this.selectionMode || !this.lpStartPos) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      const dx = Math.abs(t.clientX - this.lpStartPos.x);
      const dy = Math.abs(t.clientY - this.lpStartPos.y);
      if (dx > 10 || dy > 10) {
        this.touchMoved = true;
        this.clearLp();
      }
    },
    onTouchEnd(e) {
      if (this.selectionMode || this.anyPending) return;
      this.clearLp();
      const touch = e.changedTouches && e.changedTouches[0];
      const target = touch && document.elementFromPoint(touch.clientX, touch.clientY);
      if (this.lpFired) {
        if (e.cancelable) e.preventDefault();
        return;
      }
      if (this.isMediaOpenTarget(target)) return;
      if (this.touchMoved) return;
      if (!this.lpStartPos) return;
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) {
        if (e.cancelable) e.preventDefault();
        return;
      }
      if (e.cancelable) e.preventDefault();
      this.$emit('context', {
        event: { clientX: this.lpStartPos.x, clientY: this.lpStartPos.y },
        message: this.menuMessage,
      });
    },
    clearLp() {
      if (this.lpTimer) {
        clearTimeout(this.lpTimer);
        this.lpTimer = null;
      }
    },
  },
};
</script>

<style scoped>
.msg-bubble-mine {
  background: var(--tg-bubble-out, #eeffde);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);
}
.dark .msg-bubble-mine {
  background: var(--tg-bubble-out-dark, #3e6b41);
  box-shadow: none;
}
.msg-bubble-other {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.dark .msg-bubble-other {
  box-shadow: none;
}
.msg-tail-other {
  inset-inline-start: -14px;
}
.msg-tail-mine {
  inset-inline-end: -14px;
  transform: scaleX(-1);
}
.msg-avatar-btn {
  line-height: 0;
  transform: translateY(2px);
}

/* Shared cluster spacing (MessageBubble + MediaAlbumBubble). */
.msg-row--tight {
  margin-top: 3px;
}
.msg-row--loose {
  margin-top: 0.5rem;
}
.msg-body-stack {
  display: flex;
  flex-direction: column;
}
.msg-media-frame {
  width: 100%;
  max-width: 320px;
  min-width: 0;
  overflow: hidden;
}
.album-bubble {
  width: min(320px, 100%);
}
.msg-media-frame.has-caption {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.msg-album-caption {
  width: 100%;
  box-sizing: border-box;
}
.msg-meta {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 3px;
  width: max-content;
  max-width: 100%;
  color: inherit;
  user-select: none;
}
.msg-meta--badge {
  align-self: flex-end;
  margin-top: 3px;
  margin-inline-start: auto;
  margin-inline-end: 0;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.07);
  opacity: 0.75;
}
.dark .msg-meta--badge {
  background: rgba(255, 255, 255, 0.08);
}
.msg-meta--on-media {
  position: absolute;
  bottom: 6px;
  inset-inline-end: 6px;
  inset-inline-start: auto;
  left: auto;
  right: auto;
  z-index: 5;
  padding: 2px 7px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  color: #fff;
  pointer-events: none;
}
.msg-meta--menu-hit {
  pointer-events: auto;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.msg-meta--on-media .msg-meta-text,
.msg-meta--on-media .msg-meta-icon {
  color: #fff;
}
.msg-meta--on-media .text-sky-400 {
  color: #7dd3fc !important;
}
.msg-meta-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
.msg-meta-text {
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

/* Selection overlay — shared Telegram-like rail (no layout shift) */
.msg-select-tint {
  background: rgba(51, 144, 236, 0.12);
  z-index: 0;
  transition: opacity var(--tg-dur-fast, 140ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}
.dark .msg-select-tint {
  background: rgba(106, 178, 242, 0.14);
}
.msg-select-circle {
  position: absolute;
  right: 6px;
  left: auto;
  top: 50%;
  z-index: 6;
  width: 22px;
  height: 22px;
  margin-top: -11px;
  border-radius: 999px;
  border: 2px solid rgba(160, 170, 180, 0.85);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  opacity: 0;
  transform: scale(0.55);
  pointer-events: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    opacity var(--tg-dur-normal, 200ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
    transform var(--tg-dur-med, 240ms) var(--tg-ease-spring, cubic-bezier(0.34, 1.3, 0.64, 1)),
    background var(--tg-dur-fast, 140ms) ease,
    border-color var(--tg-dur-fast, 140ms) ease,
    box-shadow var(--tg-dur-fast, 140ms) ease;
}
.msg-select-circle.is-on {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.msg-select-circle.is-selected {
  background: #31b545;
  border-color: #fff;
  box-shadow: 0 0 0 2px rgba(49, 181, 69, 0.22);
  animation: msg-select-pop var(--tg-dur-med, 240ms) var(--tg-ease-spring, cubic-bezier(0.34, 1.3, 0.64, 1)) both;
}
.dark .msg-select-circle.is-selected {
  border-color: #0e1621;
  box-shadow: 0 0 0 2px rgba(49, 181, 69, 0.28);
}
.msg-select-check {
  width: 12px;
  height: 12px;
  color: #fff;
  animation: msg-check-in 0.22s var(--tg-ease-spring, cubic-bezier(0.34, 1.3, 0.64, 1)) both;
}
@keyframes msg-select-pop {
  0% { transform: scale(0.72); }
  55% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
@keyframes msg-check-in {
  0% { opacity: 0; transform: scale(0.4); }
  100% { opacity: 1; transform: scale(1); }
}
.msg-row-body {
  transition: transform var(--tg-dur-med, 240ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  will-change: transform;
}
[dir="rtl"] .msg-row-body.is-selecting:not(.is-mine),
[dir="ltr"] .msg-row-body.is-selecting.is-mine {
  transform: translateX(-38px);
}
[dir="rtl"] .msg-row-body.is-selecting.is-mine,
[dir="ltr"] .msg-row-body.is-selecting:not(.is-mine) {
  transform: none;
}
</style>
