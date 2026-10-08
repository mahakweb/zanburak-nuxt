<template>
  <div class="profile-panel relative flex flex-col h-full min-h-0 overflow-hidden bg-[#f4f4f5] dark:bg-[#0e1621]">
    <!-- Header — Telegram-style: back + name/presence | more -->
    <div class="flex items-center gap-1.5 px-1.5 h-14 flex-shrink-0 bg-[#f4f4f5] dark:bg-[#0e1621] border-b border-black/[0.06] dark:border-white/[0.06]">
      <button
        @click="onHeaderBack"
        class="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] transition"
        :title="$t('messenger.back')"
      >
        <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="flex-1 min-w-0 px-0.5">
        <template v-if="contactForm.mode === 'add'">
          <h2 class="text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate">{{ $t('messenger.addContact') }}</h2>
        </template>
        <template v-else-if="contactForm.mode === 'edit'">
          <h2 class="text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate">{{ $t('messenger.editContact') }}</h2>
        </template>
        <template v-else-if="isSaved">
          <h2 class="text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate">{{ $t('messenger.savedMessagesInfo') }}</h2>
        </template>
        <template v-else>
          <h2 class="text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">{{ fullName || $t('messenger.userInfo') }}</h2>
          <p class="text-[12px] truncate leading-tight mt-0.5" :class="profile?.is_online ? 'text-[#3390ec]' : 'text-[#a2acb4]'">
            {{ presenceText }}
          </p>
        </template>
      </div>
      <div v-if="!contactForm.mode && !isSaved && !avatarViewer.open" class="w-9 flex justify-end">
        <button
          ref="moreMenuHeaderBtn"
          type="button"
          class="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] transition"
          :title="$t('messenger.more')"
          @click.stop="toggleMoreMenu('header')"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect width="4" height="4" x="10" y="3" rx="2" />
            <rect width="4" height="4" x="10" y="10" rx="2" />
            <rect width="4" height="4" x="10" y="17" rx="2" />
          </svg>
        </button>
      </div>
      <div v-else class="w-9" />
    </div>

    <div v-if="contactForm.mode" class="flex-1 overflow-y-auto custom-scrollbar pt-3 pb-5">
      <div class="tg-card mx-3 mb-3 overflow-hidden">
        <div class="flex items-center gap-2.5 px-3 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
          <MessengerAvatar :user="profile" size="md" />
          <div class="min-w-0">
            <div class="text-[13.5px] font-medium text-gray-900 dark:text-gray-100 truncate">{{ fullName }}</div>
            <div v-if="profile?.username" class="text-[12px] text-[#a2acb4] truncate" dir="ltr">@{{ profile.username }}</div>
          </div>
        </div>
        <div class="px-3 py-3">
          <label class="block text-[12px] font-medium text-[#707579] mb-1.5">{{ $t('messenger.renameContact') }}</label>
          <input
            ref="contactNameInput"
            v-model="contactForm.name"
            v-no-autofill="'strong'"
            type="text"
            name="messenger-contact-name"
            class="w-full px-3 py-2.5 rounded-xl bg-[#f4f4f5] dark:bg-[#0e1621] border-0 text-[15px] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3390ec]/30"
            :placeholder="fullName || profile?.username || ''"
            @keydown.enter.prevent="saveContactForm"
          />
        </div>
      </div>
      <p class="px-5 text-[12.5px] text-[#a2acb4] mb-3">{{ $t('messenger.renameContactHint') }}</p>
      <div class="tg-form-footer">
        <button
          type="button"
          class="tg-form-btn tg-form-btn--primary tg-form-btn--full"
          :disabled="contactForm.saving"
          @click="saveContactForm"
        >
          {{ contactForm.saving ? '…' : $t('messenger.save') }}
        </button>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto custom-scrollbar">
      <MessengerSkeleton v-if="showProfileSkeleton" variant="profile" />

      <template v-else>
      <!-- Saved hero -->
      <div v-if="isSaved" class="flex flex-col items-center pt-8 pb-5 bg-[#f4f4f5] dark:bg-[#0e1621]">
        <MessengerAvatar size="xl" saved />
        <h3 class="mt-4 text-[17px] font-semibold text-gray-900 dark:text-gray-100">{{ $t('messenger.savedMessages') }}</h3>
        <p class="mt-0.5 text-[14px] text-[#707579]">{{ $t('messenger.savedMessagesHint') }}</p>
      </div>

      <!-- User hero -->
      <div v-else class="flex flex-col items-center pt-8 pb-2 bg-[#f4f4f5] dark:bg-[#0e1621]">
        <button
          type="button"
          class="relative overflow-visible rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3390ec]/50"
          :disabled="!hasRealAvatar()"
          @click="openAvatarViewer"
        >
          <MessengerAvatar :user="profile" size="xl" :online="!!profile?.is_online" />
        </button>
        <h3 class="mt-4 text-[17px] font-semibold text-gray-900 dark:text-gray-100">{{ fullName }}</h3>
        <p class="mt-0.5 text-[14px]" :class="profile?.is_online ? 'text-[#3390ec]' : 'text-[#707579]'">
          {{ presenceText }}
        </p>

        <!-- Telegram-style quick actions -->
        <div class="tg-profile-actions mt-5 px-3 w-full max-w-md mx-auto">
          <button
            type="button"
            class="tg-profile-action"
            :title="$t('messenger.sendMessage')"
            @click="$emit('message', profile)"
          >
            <svg class="tg-profile-action-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3C6.5 3 2 6.58 2 11c0 2.43 1.37 4.61 3.5 6.03V21l3.75-2.25c.83.22 1.77.35 2.75.35 5.5 0 10-3.58 10-8s-4.5-8-10-8z"/>
            </svg>
            <span class="tg-profile-action-label">{{ $t('messenger.sendMessage') }}</span>
          </button>
          <button
            type="button"
            class="tg-profile-action"
            :class="{ 'is-muted': isMuted }"
            :title="$t('messenger.notifications')"
            @click="toggleMute"
          >
            <svg v-if="!isMuted" class="tg-profile-action-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 22a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22zm7-6V11a7 7 0 10-14 0v5l-2 2v1h18v-1l-2-2z"/>
            </svg>
            <svg v-else class="tg-profile-action-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.27 3L2 4.27l3.18 3.18A6.9 6.9 0 005 11v5l-2 2v1h13.73l2 2L20 19.73 3.27 3zM19 15.59V11c0-2.65-1.35-5-3.5-6.26V3.5a2.5 2.5 0 00-5 0v.12c-.55.17-1.07.4-1.55.68L19 15.59zM12 22a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22z"/>
            </svg>
            <span class="tg-profile-action-label">{{ isMuted ? $t('messenger.unmute') : $t('messenger.mute') }}</span>
          </button>
          <button
            type="button"
            class="tg-profile-action"
            :title="$t('messenger.search')"
            @click="$emit('search-in-chat')"
          >
            <svg class="tg-profile-action-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <span class="tg-profile-action-label">{{ $t('messenger.search') }}</span>
          </button>
          <div ref="moreMenuWrap" class="tg-profile-action-wrap relative min-w-0">
            <button
              ref="moreBtn"
              type="button"
              class="tg-profile-action w-full"
              :title="$t('messenger.more')"
              @click.stop="toggleMoreMenu('badge')"
            >
              <svg class="tg-profile-action-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
              <span class="tg-profile-action-label">{{ $t('messenger.more') }}</span>
            </button>
            <Teleport to="body">
              <div
                v-if="moreMenuOpen"
                ref="moreMenu"
                class="tg-menu tg-profile-more-menu"
                :style="moreMenuStyle"
                @click.stop
              >
                <template v-for="(action, idx) in profileMenuActions" :key="action.id || idx">
                  <div v-if="action.divider" class="tg-menu-divider" />
                  <button
                    v-else
                    type="button"
                    :class="['tg-menu-item', { 'is-danger': action.danger }]"
                    @click="onMenuAction(action.id)"
                  >
                    <span v-if="action.icon" class="tg-menu-item-glyph" aria-hidden="true">
                      <svg
                        class="tg-menu-item-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path v-for="(d, di) in iconPaths(action.icon)" :key="di" :d="d" />
                      </svg>
                    </span>
                    <span class="tg-menu-item-label">{{ action.label }}</span>
                  </button>
                </template>
              </div>
            </Teleport>
          </div>
        </div>
      </div>

      <!-- Info card (user only) -->
      <div v-if="!isSaved" class="tg-card mx-3 mb-3">
        <div v-if="profile?.mobile" class="tg-info-row">
          <div class="tg-info-content">
            <div class="tg-info-value-row">
              <svg class="tg-info-icon-sm" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <span class="tg-info-value msg-plain-nums" dir="ltr">{{ displayMobile }}</span>
            </div>
            <div class="tg-info-label">{{ $t('messenger.phone') }}</div>
          </div>
        </div>
        <div v-if="profile?.username" class="tg-info-row">
          <div class="tg-info-content">
            <div class="tg-info-value-row">
              <svg class="tg-info-icon-sm" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"/></svg>
              <button
                ref="usernameCopyEl"
                type="button"
                :class="['tg-info-value tg-copyable', { 'is-copy-flash': usernameCopied }]"
                :title="$t('messenger.tapToCopy')"
              >
                <span dir="ltr">@{{ profile.username }}</span>
              </button>
            </div>
            <div class="tg-info-label">{{ $t('messenger.username') }}</div>
          </div>
        </div>
        <div v-if="profile?.bio" class="tg-info-row">
          <div class="tg-info-content">
            <div class="tg-info-value-row">
              <svg class="tg-info-icon-sm" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <button
                ref="bioCopyEl"
                type="button"
                :class="['tg-info-value tg-copyable break-words', { 'is-copy-flash': bioCopied }]"
                :title="$t('messenger.tapToCopy')"
              >{{ profile.bio }}</button>
            </div>
            <div class="tg-info-label">{{ $t('messenger.bio') }}</div>
          </div>
        </div>
        <div v-if="profile?.email" class="tg-info-row">
          <div class="tg-info-content">
            <div class="tg-info-value-row">
              <svg class="tg-info-icon-sm" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span class="tg-info-value" dir="ltr">{{ profile.email }}</span>
            </div>
            <div class="tg-info-label">{{ $t('messenger.email') }}</div>
          </div>
        </div>
      </div>

      <!-- Notifications row (user only) -->
      <div v-if="!isSaved" class="tg-card mx-3 mb-3">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center gap-4">
            <svg class="w-[21px] h-[21px] text-[#707579]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span class="text-[15px] text-gray-900 dark:text-gray-100">{{ $t('messenger.notifications') }}</span>
          </div>
          <MessengerToggle :model-value="!isMuted" @update:modelValue="onNotifToggle" />
        </div>
      </div>

      <!-- Shared media -->
      <SharedMediaSection
        ref="sharedMedia"
        :conversation-id="conversationId"
        @go-to-message="$emit('go-to-message', $event)"
        @open-link="$emit('open-link', $event)"
      />

      <div class="h-4" />
      </template>
    </div>

    <MediaViewerOverlay
      ref="avatarViewerOverlay"
      :open="avatarViewer.open"
      :src="avatarViewer.src"
      media-type="photo"
      profile-mode
      docked
      show-save
      :header-title-override="fullName"
      :header-subtitle="presenceText"
      :menu-actions="avatarViewerMenuActions"
      @close="avatarViewer.open = false"
      @menu-action="onAvatarViewerMenuAction"
    />
    <SafetyNumberSheet
      :open="safetyOpen"
      :user-id="profile?.id"
      @close="safetyOpen = false"
    />
  </div>
</template>

<script>
import { mapState } from "@/composables/useStore";
import MessengerAvatar from './MessengerAvatar.vue';
import MessengerToggle from './MessengerToggle.vue';
import SharedMediaSection from './SharedMediaSection.vue';
import MessengerSkeleton from './MessengerSkeleton.vue';
import MediaViewerOverlay from './MediaViewerOverlay.vue';
import SafetyNumberSheet from './SafetyNumberSheet.vue';
import { bindCopyOnPress } from './clipboardPress';
import { userProfileUrl, copyText } from './inviteLinks';
import { peerDisplayName } from '@/utils/messengerPeerName';
import { formatPresenceText } from '@/utils/messengerPresence';
import { iconPaths } from './messengerIcons';
import { shapeUiDigits } from './appearance';

const DEFAULT_AVATAR = 'https://static.zanburak.ir/images/avatar/default.png';

export default {
  components: {
    MessengerAvatar,
    MessengerToggle,
    SharedMediaSection,
    MessengerSkeleton,
    MediaViewerOverlay,
    SafetyNumberSheet,
  },
  props: {
    open: { type: Boolean, default: false },
    profile: { type: Object, default: null },
    loading: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isSaved: { type: Boolean, default: false },
    contact: { type: Object, default: null },
    conversationId: { type: [Number, String], default: null },
  },
  emits: ['close', 'message', 'block', 'unblock', 'go-to-message', 'open-link', 'rename-contact', 'delete-contact', 'add-contact', 'save-contact', 'search-in-chat', 'mute'],
  data() {
    return {
      avatarViewer: { open: false, src: '' },
      moreMenuOpen: false,
      moreMenuStyle: {},
      moreMenuAnchor: 'badge',
      safetyOpen: false,
      usernameCopied: false,
      bioCopied: false,
      usernameCopiedTimer: null,
      bioCopiedTimer: null,
      unbindCopy: [],
      contactForm: { mode: '', name: '', saving: false },
    };
  },
  computed: {
    ...mapState('messenger', ['conversations', 'overlayConversation']),
    conversation() {
      const id = Number(this.conversationId);
      if (!Number.isFinite(id)) return null;
      return this.conversations.find((c) => Number(c.id) === id)
        || (this.overlayConversation && Number(this.overlayConversation.id) === id
          ? this.overlayConversation
          : null);
    },
    isMuted() {
      return !!(this.conversation?.pivot?.muted_at);
    },
    fullName() {
      return peerDisplayName(this.profile, this.contact?.name);
    },
    displayMobile() {
      return shapeUiDigits(this.profile?.mobile || '', 'profile');
    },
    presenceText() {
      return formatPresenceText(this.profile, (k, p) => this.$t(k, p), {
        locale: this.$i18n?.locale === 'fa' ? 'fa-IR' : 'en-US',
      });
    },
    showProfileSkeleton() {
      if (this.isSaved || !this.loading) return false;
      const p = this.profile;
      if (!p) return true;
      return !(p.first_name || p.last_name || p.username || p.profile_pic || p.name);
    },
    isContact() {
      return !!this.contact?.id;
    },
    profileMenuActions() {
      const items = [];
      if (this.profile?.username) {
        items.push({ id: 'copy-link', label: this.$t('messenger.copyLink'), icon: 'link' });
      }
      if (this.isContact) {
        items.push({ id: 'edit-contact', label: this.$t('messenger.editContact'), icon: 'edit' });
        items.push({ id: 'delete-contact', label: this.$t('messenger.deleteContact'), icon: 'trash', danger: true });
      } else {
        items.push({ id: 'add-contact', label: this.$t('messenger.addContact'), icon: 'userPlus' });
      }
      items.push({ divider: true });
      items.push({ id: 'safety-number', label: this.$t('messenger.safetyNumber'), icon: 'shield' });
      items.push({ divider: true });
      if (this.isBlocked) {
        items.push({ id: 'unblock', label: this.$t('messenger.unblock'), icon: 'check' });
      } else {
        items.push({ id: 'block', label: this.$t('messenger.block'), icon: 'block', danger: true });
      }
      return items;
    },
    /** Photo viewer: save to gallery + OS share only (Telegram-like). */
    avatarViewerMenuActions() {
      return [
        { id: 'share', label: this.$t('messenger.share'), icon: 'share' },
      ];
    },
  },
  watch: {
    profile: {
      handler() {
        this.closeContactForm();
        this.$nextTick(() => this.setupCopyBindings());
      },
      deep: true,
    },
    open(v) {
      if (v) this.$nextTick(() => this.setupCopyBindings());
      else {
        this.teardownCopyBindings();
        this.moreMenuOpen = false;
        this.closeContactForm();
        this.safetyOpen = false;
      }
    },
    moreMenuOpen(open) {
      if (open) {
        this.$nextTick(() => {
          this.positionMoreMenu();
          // Second pass after menu paints (real width/height).
          requestAnimationFrame(() => this.positionMoreMenu());
        });
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.onDocClick, true);
    window.addEventListener('resize', this.onMoreMenuReposition);
    window.addEventListener('scroll', this.onMoreMenuReposition, true);
    this.setupCopyBindings();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onDocClick, true);
    window.removeEventListener('resize', this.onMoreMenuReposition);
    window.removeEventListener('scroll', this.onMoreMenuReposition, true);
    this.teardownCopyBindings();
    if (this.usernameCopiedTimer) clearTimeout(this.usernameCopiedTimer);
    if (this.bioCopiedTimer) clearTimeout(this.bioCopiedTimer);
  },
  methods: {
    iconPaths,
    toggleMute() {
      if (this.conversationId == null) return;
      this.$emit('mute', this.conversationId);
    },
    onNotifToggle(enabled) {
      // Toggle is "notifications enabled"; mute when turning off.
      if (!!enabled === !this.isMuted) return;
      this.toggleMute();
    },
    toggleMoreMenu(anchor = 'badge') {
      if (this.moreMenuOpen && this.moreMenuAnchor === anchor) {
        this.moreMenuOpen = false;
        return;
      }
      this.moreMenuAnchor = anchor;
      this.moreMenuOpen = true;
      this.$nextTick(() => this.positionMoreMenu());
    },
    onMoreMenuReposition() {
      if (!this.moreMenuOpen) return;
      this.positionMoreMenu();
    },
    /** Open below the trigger, growing inward so it stays on-screen (RTL→right, LTR→left). */
    positionMoreMenu() {
      if (typeof window === 'undefined') return;
      const btn = this.moreMenuAnchor === 'header'
        ? this.$refs.moreMenuHeaderBtn
        : this.$refs.moreBtn;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const margin = 8;
      const menuEl = this.$refs.moreMenu;
      const maxW = Math.min(280, window.innerWidth - margin * 2);
      // Measure natural content width; don't force a wide rail.
      const natural = menuEl?.scrollWidth || menuEl?.offsetWidth || 0;
      const menuW = Math.min(Math.max(natural, 140), maxW);
      const rtl = document.documentElement.dir === 'rtl';
      // Inward: RTL More is on the left → grow right; LTR More is on the right → grow left.
      let left = rtl ? rect.left : rect.right - menuW;
      left = Math.max(margin, Math.min(left, window.innerWidth - menuW - margin));
      let top = rect.bottom + 8;
      const menuH = menuEl?.offsetHeight || 220;
      if (top + menuH > window.innerHeight - margin) {
        top = Math.max(margin, rect.top - menuH - 8);
      }
      this.moreMenuStyle = {
        position: 'fixed',
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        width: 'max-content',
        maxWidth: `${Math.round(maxW)}px`,
        right: 'auto',
        bottom: 'auto',
        zIndex: 2000000100,
      };
    },
    hasRealAvatar() {
      const pic = this.profile?.profile_pic;
      return !!pic && !pic.includes('avatar/default') && pic !== DEFAULT_AVATAR;
    },
    openAvatarViewer() {
      if (!this.hasRealAvatar()) return;
      this.avatarViewer = { open: true, src: this.profile.profile_pic };
    },
    async onAvatarViewerMenuAction(id) {
      if (id === 'share') {
        await this.shareProfilePhoto();
        return;
      }
      this.onMenuAction(id);
    },
    async shareProfilePhoto() {
      const src = this.avatarViewer.src || this.profile?.profile_pic;
      if (!src) return;
      try {
        if (typeof navigator !== 'undefined' && navigator.share) {
          let file;
          try {
            const res = await fetch(src, { mode: 'cors' });
            const blob = await res.blob();
            const type = blob.type || 'image/jpeg';
            const ext = (type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
            file = new File([blob], `profile.${ext}`, { type });
          } catch (e) {
            file = null;
          }
          if (file && navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: this.fullName || this.$t('messenger.profilePhoto'),
            });
            return;
          }
          await navigator.share({
            title: this.fullName || this.$t('messenger.profilePhoto'),
            url: src,
          });
          return;
        }
      } catch (e) {
        if (e?.name === 'AbortError') return;
      }
      // Fallback: copy / open when Web Share is unavailable.
      try {
        await copyText(src);
      } catch (e2) {
        window.open(src, '_blank', 'noopener,noreferrer');
      }
    },
    onHeaderBack() {
      if (this.contactForm.mode) {
        this.closeContactForm();
        return;
      }
      this.$emit('close');
    },
    openContactForm(mode) {
      this.moreMenuOpen = false;
      this.contactForm = {
        mode,
        name: mode === 'edit' ? (this.contact?.name || this.fullName || '') : (this.fullName || ''),
        saving: false,
      };
      this.$nextTick(() => this.$refs.contactNameInput?.focus?.());
    },
    closeContactForm() {
      this.contactForm = { mode: '', name: '', saving: false };
    },
    async saveContactForm() {
      if (this.contactForm.saving) return;
      const name = String(this.contactForm.name || '').trim() || null;
      this.contactForm.saving = true;
      try {
        if (this.contactForm.mode === 'edit' && this.contact?.id) {
          this.$emit('save-contact', { contactId: this.contact.id, name });
        } else if (this.profile?.id) {
          this.$emit('save-contact', { userId: this.profile.id, name });
        }
        this.closeContactForm();
      } finally {
        if (this.contactForm) this.contactForm.saving = false;
      }
    },
    onMenuAction(type) {
      this.moreMenuOpen = false;
      if (type === 'block') this.$emit('block', this.profile);
      else if (type === 'unblock') this.$emit('unblock', this.profile);
      else if (type === 'edit-contact') this.openContactForm('edit');
      else if (type === 'delete-contact' && this.contact) this.$emit('delete-contact', this.contact.id);
      else if (type === 'add-contact') this.openContactForm('add');
      else if (type === 'safety-number') this.safetyOpen = true;
      else if (type === 'copy-link' && this.profile?.username) {
        copyText(userProfileUrl(this.profile.username));
      }
    },
    onDocClick(e) {
      if (!this.moreMenuOpen) return;
      const wrap = this.$refs.moreMenuWrap;
      const headerBtn = this.$refs.moreMenuHeaderBtn;
      const menu = this.$refs.moreMenu;
      if (wrap && wrap.contains(e.target)) return;
      if (headerBtn && headerBtn.contains(e.target)) return;
      if (menu && menu.contains(e.target)) return;
      this.moreMenuOpen = false;
    },
    hasOverlay() {
      if (this.contactForm.mode) return true;
      if (this.moreMenuOpen) return true;
      if (this.avatarViewer.open) return true;
      const sm = this.$refs.sharedMedia;
      return sm && typeof sm.hasOverlay === 'function' && sm.hasOverlay();
    },
    handleBack() {
      if (this.contactForm.mode) {
        this.closeContactForm();
        return true;
      }
      if (this.moreMenuOpen) {
        this.moreMenuOpen = false;
        return true;
      }
      if (this.avatarViewer.open) {
        const mv = this.$refs.avatarViewerOverlay;
        if (mv && typeof mv.handleBack === 'function' && mv.handleBack()) return true;
        this.avatarViewer.open = false;
        return true;
      }
      const sm = this.$refs.sharedMedia;
      if (sm && typeof sm.handleBack === 'function' && sm.handleBack()) return true;
      return false;
    },
    flashCopy(field) {
      if (field === 'username') {
        this.usernameCopied = true;
        if (this.usernameCopiedTimer) clearTimeout(this.usernameCopiedTimer);
        this.usernameCopiedTimer = setTimeout(() => { this.usernameCopied = false; }, 650);
      } else if (field === 'bio') {
        this.bioCopied = true;
        if (this.bioCopiedTimer) clearTimeout(this.bioCopiedTimer);
        this.bioCopiedTimer = setTimeout(() => { this.bioCopied = false; }, 650);
      }
    },
    setupCopyBindings() {
      this.teardownCopyBindings();
      if (this.isSaved) return;
      if (this.$refs.usernameCopyEl) {
        this.unbindCopy.push(bindCopyOnPress(
          this.$refs.usernameCopyEl,
          () => `@${this.profile?.username || ''}`,
          () => this.flashCopy('username'),
        ));
      }
      if (this.$refs.bioCopyEl && this.profile?.bio) {
        this.unbindCopy.push(bindCopyOnPress(
          this.$refs.bioCopyEl,
          () => this.profile?.bio || '',
          () => this.flashCopy('bio'),
        ));
      }
    },
    teardownCopyBindings() {
      this.unbindCopy.forEach((fn) => { try { fn(); } catch (e) { /* noop */ } });
      this.unbindCopy = [];
    },
  },
};
</script>

<style scoped>
.tg-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  outline: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
.dark .tg-card {
  background: #17212b;
  outline-color: rgba(255, 255, 255, 0.06);
  box-shadow: none;
}
.tg-info-row {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.tg-info-row:last-child { border-bottom: none; }
.dark .tg-info-row { border-bottom-color: rgba(255, 255, 255, 0.06); }
.tg-info-content {
  min-width: 0;
  text-align: start;
}
.tg-info-value-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  min-width: 0;
}
.tg-info-icon-sm {
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  color: #707579;
}
.tg-info-value {
  font-size: 15px;
  color: #000;
  line-height: 1.3;
  min-width: 0;
  text-align: start;
}
.dark .tg-info-value { color: #fff; }
.tg-info-label {
  font-size: 13px;
  color: #707579;
  margin-top: 4px;
  padding-inline-start: 31px;
  text-align: start;
}
.tg-copyable {
  cursor: pointer;
  background: none;
  border: 0;
  padding: 0;
  transition: color 0.15s ease;
}
.tg-copyable:hover { color: #3390ec; }
.tg-copyable.is-copy-flash {
  animation: copyFlash 0.65s ease;
}
@keyframes copyFlash {
  0% { color: inherit; }
  30% { color: #3390ec; transform: scale(1.02); }
  100% { color: inherit; transform: scale(1); }
}
.custom-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.tg-profile-actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  align-items: stretch;
}
.tg-profile-action-wrap {
  display: flex;
  min-width: 0;
  width: 100%;
}
/* Teleported: position set via moreMenuStyle (fixed, opens inward). */
.tg-profile-more-menu {
  width: max(12.5rem, 100%);
  max-width: min(18rem, calc(100vw - 16px));
  padding: 4px;
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(15, 23, 42, 0.08);
  animation: tg-profile-more-in 0.16s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.dark .tg-profile-more-menu {
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.25);
}
@keyframes tg-profile-more-in {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.tg-profile-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
  min-height: 64px;
  height: 100%;
  padding: 10px 4px 8px;
  border-radius: 1rem;
  background: rgba(51, 144, 236, 0.12);
  color: #3390ec;
  transition: background var(--tg-dur-fast, 140ms) ease,
    color var(--tg-dur-fast, 140ms) ease,
    transform var(--tg-dur-instant, 100ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  box-sizing: border-box;
}
.tg-profile-action.is-muted {
  background: rgba(112, 117, 121, 0.12);
  color: #707579;
}
.tg-profile-action:active {
  transform: scale(0.96);
  background: rgba(51, 144, 236, 0.18);
}
.tg-profile-action.is-muted:active {
  background: rgba(112, 117, 121, 0.18);
}
.dark .tg-profile-action:active {
  background: rgba(51, 144, 236, 0.22);
}
.tg-profile-action-svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
.tg-profile-action-label {
  font-size: 11px;
  font-weight: 500;
  color: inherit;
  text-align: center;
  line-height: 1.15;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
