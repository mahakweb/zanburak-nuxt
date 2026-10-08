<template>
  <div class="messenger-shell fixed inset-0 flex items-stretch p-0 min-[1921px]:items-center min-[1921px]:justify-center min-[1921px]:p-4 z-[60]" :style="[fontStyle, shellViewportStyle]" @keydown="onKeydown" @contextmenu="onShellContextMenu" tabindex="-1" ref="shell">
    <div
      v-if="accessBlocked"
      class="absolute inset-0 z-[80] flex items-center justify-center bg-white/90 dark:bg-[#0e1621]/92 backdrop-blur-sm p-6"
    >
      <div class="max-w-md text-center space-y-3">
        <p class="text-lg font-bold text-gray-800 dark:text-gray-100">پیام‌رسان در دسترس نیست</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ accessBlockedMessage || 'شما اجازه استفاده از پیام‌رسان را ندارید.' }}
        </p>
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-amber-400 text-sm font-semibold text-gray-900"
          @click="exit"
        >
          بازگشت
        </button>
      </div>
    </div>
    <!-- Wallpaper lives in the chat column (see <main>) so desktop resize
         reveals more tiles instead of shifting a full-shell crop. -->
    <div
      ref="layout"
      class="messenger-layout w-full h-full min-h-0 max-w-none min-[1921px]:max-w-screen-2xl mx-auto flex gap-0 relative z-10 select-none overflow-hidden rounded-none shadow-none ring-0 border-0 bg-transparent min-[1921px]:h-[94vh] min-[1921px]:rounded-xl min-[1921px]:shadow-2xl min-[1921px]:ring-1 min-[1921px]:ring-black/5 dark:min-[1921px]:ring-white/10"
    >
      <!-- Sidebar -->
      <aside
        :class="[
          'messenger-col messenger-col--sidebar h-full flex-shrink-0 overflow-hidden bg-[#f4f4f5] dark:bg-[#0e1621] w-full flex flex-col min-h-0',
          // Must stay `flex` (not `block`) so flex-1 + FAB absolute bottom keep working.
          (bootReady && paintConversation) ? 'hidden lg:flex' : 'flex',
        ]"
        :style="sidebarStyle"
      >
        <div class="flex-1 min-h-0 overflow-hidden">
          <MessengerSidebar
            ref="sidebar"
            :conversations="paintConversations"
            :contacts="contacts"
            :active-id="bootReady ? activeConversationId : null"
            :me-id="meId"
            :loading="showListSkeleton"
            :connected="connected"
            :connection-state="connectionState"
            :connection-display-status="connectionDisplayStatus"
            :network-online="networkOnline"
            :conv-has-more="conversationsHasMore"
            :conv-loading-more="conversationsLoadingMore"
            @select="onSelectConversation"
            @load-more-conversations="loadMoreConversations"
            @start-chat="onStartChat"
            @update-contact="onUpdateContact"
            @delete-contact="onRequestDeleteContact"
            @mark-read="onMarkRead"
            @mute="onMute"
            @clear-conversation="onRequestClear"
            @delete-conversation="onRequestDeleteConversation"
            @open-profile="onOpenProfile"
            @rename-contact="onRenameContact"
            @block-user="onBlock"
            @unblock-user="onUnblock"
            @add-user-contact="onAddUserContact"
            @open-saved="onOpenSaved"
            @community-created="onCommunityCreated"
            @exit="exit"
            @request-logout="onRequestLogout"
            @open-message="onOpenSearchMessage"
            @forward-pick-conversation="onForwardPickConversation"
            @forward-pick-user="onForwardPickUser"
            @forward-pick-saved="onForwardPickSaved"
            @forward-send-targets="onForwardSendTargets"
            @forward-cancel="onForwardCancel"
          />
        </div>
      </aside>

      <ResizeHandle @start="(e) => startResize('sidebar', e)" />

      <!-- Chat — flush against 3px dividers (no margin/gap). -->
      <main
        :class="[
          'messenger-col messenger-col--chat h-full flex-1 min-w-0 bg-transparent relative min-h-0 max-w-full',
          chatComposerLift ? 'overflow-visible z-[55]' : 'overflow-hidden',
          (bootReady && paintConversation) ? 'block' : 'hidden lg:block',
          profileOpen || emojiSidebarOpen ? 'hidden lg:block' : '',
        ]"
      >
        <!-- Color/light is CSS (instant). Pattern is a tiled SVG mask.
             Mobile: fixed to the layout viewport so the keyboard does not shift it. -->
        <div v-show="paintConversation" class="messenger-bg-fixed" :style="wallpaperStyle">
          <div class="messenger-wallpaper-image-clip">
            <div class="messenger-wallpaper-image" :style="wallpaperImageStyle"></div>
          </div>
          <div class="messenger-wallpaper-dim" :style="wallpaperDimStyle"></div>
          <div class="messenger-wallpaper-pattern" :style="wallpaperPatternStyle"></div>
          <div
            class="messenger-wallpaper-glow"
            :class="{ 'is-neon': displayWallpaper?.type === 'neon' }"
            :style="wallpaperGlowStyle"
          ></div>
        </div>
        <div id="zb-media-player-overlay" class="pointer-events-none absolute inset-0 z-30" />
        <ChatArea
          ref="chatArea"
          :conversation="paintConversation"
          :messages="paintConversation ? activeMessages : []"
          :me-id="meId"
          :me-user="userInfo"
          :typing-label="paintConversation ? typingLabel : null"
          :typing-activity="paintConversation ? typingActivity : null"
          :sending="sending"
          :has-more="hasMore"
          :messages-loading="paintChatBootLoading || messagesLoading"
          :boot-loading="paintChatBootLoading"
          :profile-open="profileOpen"
          :emoji-sidebar-open="emojiSidebarOpen"
          :connected="connected"
          :connection-state="connectionState"
          :connection-display-status="connectionDisplayStatus"
          :network-online="networkOnline"
          @send="onSend"
          @send-media="onSendMedia"
          @edit="onEdit"
          @request-delete="onRequestDeleteMessage"
          @request-delete-selected="onRequestDeleteSelected"
          @typing="onTyping"
          @clear="onRequestClear"
          @delete-conversation="onRequestDeleteConversation"
          @mute="onMute"
          @load-more="onLoadMore"
          @back="backToList"
          @open-forward="onOpenForward"
          @confirm-forward="onConfirmForward"
          @open-profile="onOpenProfile"
          @open-chat-with-user="onOpenChatWithUser"
          @open-community="onOpenCommunityFromForward"
          @join-community="onJoinFromPreviewBar"
          @reveal-message="onRevealMessage"
          @retry-message="onRetryMessage"
          @delete-failed-message="onDeleteFailedMessage"
          @cancel-upload="onCancelUpload"
          @open-link="onOpenMessageLink"
          @accessory-change="onAccessoryChange"
          @open-wallpaper="onOpenWallpaper"
          @composer-lift="chatComposerLift = $event"
          @emoji-sidebar-change="onEmojiSidebarChange"
          @sticker-packs-changed="onSidebarStickerPacksChanged"
        />

        <!-- Chat wallpaper picker (Telegram-style full panel over the chat) -->
        <div
          v-if="wallpaperPanel.open"
          class="absolute inset-0 z-[80] flex flex-col bg-white dark:bg-[#17212b]"
        >
          <header class="flex items-center gap-1.5 px-2.5 h-[56px] border-b border-black/[0.06] dark:border-white/10 flex-shrink-0 bg-white/90 dark:bg-[#17212b]/90 backdrop-blur-md">
            <button
              type="button"
              class="p-2.5 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/10 text-[#707579] dark:text-gray-300 transition"
              @click="closeWallpaperPanel"
            >
              <svg class="w-5 h-5 ltr:rotate-180" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16m0 0l-6 6m6-6l-6-6"/></svg>
            </button>
            <h3 class="text-[16px] font-semibold tracking-tight text-[#1c2733] dark:text-gray-100">{{ $t('messenger.chatBackground') }}</h3>
          </header>
          <div class="flex-1 min-h-0 overflow-y-auto">
            <WallpaperPicker
              :conversation-id="wallpaperPanel.conversationId"
              :partner-name="wallpaperPanel.partnerName"
              :initial-config="wallpaperPanel.initialConfig"
              @draft-change="onWallpaperDraftChange"
              @request-apply-chat="onWallpaperApplyRequest"
            />
          </div>
        </div>
      </main>

      <Teleport v-if="playerTeleportReady" :to="mediaPlayerTeleportTo">
        <MediaMiniPlayer :overlay="mediaPlayerOverlay" />
      </Teleport>

      <ResizeHandle v-if="profileOpen || emojiSidebarOpen" @start="(e) => startResize('profile', e)" />

      <!-- Profile / group info / emoji side panel -->
      <transition name="side-panel">
        <aside
          v-if="profileOpen || emojiSidebarOpen"
          class="messenger-col messenger-col--profile fixed inset-0 z-[70] bg-[#f4f4f5] dark:bg-[#0e1621] lg:static lg:inset-auto lg:z-auto lg:h-full lg:flex-shrink-0 lg:flex lg:flex-col overflow-hidden w-full min-h-0"
          :style="profileStyle"
        >
          <MessengerEmojiPicker
            v-if="emojiSidebarOpen"
            ref="emojiSidebarPicker"
            variant="sidebar"
            class="h-full min-h-0"
            :initial-mode="emojiSidebarMode"
            @mode-change="onEmojiSidebarModeChange"
            @select="onEmojiSidebarSelect"
            @backspace="onEmojiSidebarBackspace"
            @send-gif="onEmojiSidebarSendGif"
            @send-sticker="onEmojiSidebarSendSticker"
            @compose-stickers="onEmojiSidebarComposeStickers"
            @edit-sticker="onEmojiSidebarEditSticker"
          />
          <GroupInfoPanel
            v-else-if="groupInfoOpen && activeConversation && (activeConversation.type === 'group' || activeConversation.type === 'channel')"
            ref="groupInfoPanel"
            :conversation="activeConversation"
            @close="onCloseProfilePanels"
            @leave="onLeaveCommunity"
            @delete="onRequestDeleteConversation(activeConversation?.id)"
            @mute="onMute"
            @clear="onRequestClear"
            @updated="onCommunityUpdated"
            @open-member="onOpenMemberProfile"
            @go-to-message="onProfileGoToMessage"
            @open-link="onOpenMessageLink"
          />
          <ProfilePanel
            v-else
            ref="profilePanel"
            :open="profileOpen"
            :profile="profileData"
            :loading="profileLoading"
            :contact="profileContact"
            :is-blocked="profileBlocked"
            :is-saved="profileSavedOpen"
            :conversation-id="profileMediaConversationId"
            @close="onCloseProfilePanels"
            @message="onProfileMessage"
            @block="onBlock"
            @unblock="onUnblock"
            @rename-contact="onRenameContact"
            @delete-contact="onRequestDeleteContact"
            @add-contact="onAddUserContact"
            @save-contact="onSaveContactFromProfile"
            @go-to-message="onProfileGoToMessage"
            @open-link="onOpenMessageLink"
            @search-in-chat="onProfileSearchInChat"
            @mute="onMute"
          />
        </aside>
      </transition>
    </div>

    <ActionSheet
      :open="confirm.open"
      :title="confirm.title"
      :message="confirm.message"
      :actions="confirm.actions"
      @close="confirm.open = false; focusActiveComposer()"
      @select="onConfirmSelect"
    />

    <DeleteMessageSheet
      :open="deleteSheet.open"
      :partner-name="deleteSheet.partner"
      :count="deleteSheet.count"
      :is-album="deleteSheet.isAlbum"
      :can-delete-for-everyone="deleteSheet.canDeleteForEveryone"
      :chat-kind="deleteSheet.chatKind"
      @close="deleteSheet.open = false; focusActiveComposer()"
      @confirm="onDeleteConfirm"
    />

    <WallpaperApplySheet
      :open="wallpaperApply.open"
      :partner-name="wallpaperApply.partnerName"
      @close="wallpaperApply.open = false; focusActiveComposer()"
      @confirm="onWallpaperApplyConfirm"
    />

    <InputSheet
      :open="renameSheet.open"
      :title="$t('messenger.renameContact')"
      :hint="$t('messenger.renameContactHint')"
      :placeholder="renameSheet.placeholder"
      :initial-value="renameSheet.value"
      @close="renameSheet.open = false; focusActiveComposer()"
      @confirm="onRenameConfirm"
    />

    <JoinPreviewSheet
      :open="joinPreview.open"
      :conversation="joinPreview.conversation"
      :busy="joinPreview.busy"
      @close="closeJoinPreview"
      @join="confirmJoinPreview"
    />

    <!-- Glass toast for multi-recipient forward (stays on list, no navigation) -->
    <transition name="fwd-glass-toast">
      <div
        v-if="forwardToast.visible"
        class="fwd-glass-toast"
        role="status"
      >
        <span class="fwd-glass-toast__text">{{ forwardToast.text }}</span>
        <span class="fwd-glass-toast__timer">{{ forwardToast.seconds }}</span>
      </div>
    </transition>

    <AppLockOverlay :open="appLocked && !accessBlocked" @unlocked="onAppUnlocked" />

    <E2eRecoveryDialog
      :open="!!e2eRecovery?.prompt && !appLocked && !accessBlocked"
      :mode="e2eRecovery?.prompt === 'restore' ? 'restore' : 'setup'"
    />

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "@/composables/useStore";
import MessengerSidebar from '@/views/components/messenger/MessengerSidebar.vue';
import ChatArea from '@/views/components/messenger/ChatArea.vue';
import MediaMiniPlayer from '@/views/components/messenger/MediaMiniPlayer.vue';
import ProfilePanel from '@/views/components/messenger/ProfilePanel.vue';
import GroupInfoPanel from '@/views/components/messenger/GroupInfoPanel.vue';
import MessengerEmojiPicker from '@/views/components/messenger/MessengerEmojiPicker.vue';
import JoinPreviewSheet from '@/views/components/messenger/JoinPreviewSheet.vue';
import ResizeHandle from '@/views/components/messenger/ResizeHandle.vue';
import {
  buildWallpaperStyle,
  buildWallpaperImageStyle,
  buildWallpaperDimStyle,
  buildWallpaperPatternStyle,
  buildWallpaperGlowStyle,
  warmWallpaperAssets,
} from '@/views/components/messenger/wallpaper';
import { fontSlotStyle } from '@/views/components/messenger/appearance';
import ActionSheet from '@/views/components/messenger/ActionSheet.vue';
import DeleteMessageSheet from '@/views/components/messenger/DeleteMessageSheet.vue';
import WallpaperPicker from '@/views/components/messenger/WallpaperPicker.vue';
import WallpaperApplySheet from '@/views/components/messenger/WallpaperApplySheet.vue';
import InputSheet from '@/views/components/messenger/InputSheet.vue';
import { stopMediaPlayer } from '@/views/components/messenger/mediaPlayer';
import E2eRecoveryDialog from '@/views/components/messenger/E2eRecoveryDialog.vue';
import {
  getUserProfile, presenceOfflineBeacon, leaveCommunity,
  previewJoin, joinByInvite, joinByUsername, joinConversation, getConversation,
} from '@/services/messenger';
import { formatTypingStatus } from '@/views/components/messenger/typingHelpers';
import { peerDisplayName, conversationPartner, conversationIdentityReady } from '@/utils/messengerPeerName';
import { shouldPeriodicSync, contactsFromCache } from '@/utils/contactSync';
import { encodeChatId, decodeChatId } from '@/views/components/messenger/chatIdCodec';
import AppLockOverlay from '@/views/components/messenger/AppLockOverlay.vue';
import {
  subscribeAppLock,
  onAppLockVisibilityChange,
  isAppLocked,
} from '@/views/components/messenger/appLock';
import {
  createNavigationHistory,
  runBackPriority,
  dismissKeyboard,
  isKeyboardOpen,
  closeTopOverlay,
  getTopOverlay,
  openAfterPointerSettled,
} from '@/views/components/messenger/interactionManagers';

const PANEL_WIDTHS_KEY = 'messenger_panel_widths';
function loadPanelWidths() {
  if (!import.meta.client) return { sidebar: 380, profile: 340 };
  try {
    const v = JSON.parse(localStorage.getItem(PANEL_WIDTHS_KEY));
    return { sidebar: v?.sidebar || 380, profile: v?.profile || 340 };
  } catch (e) {
    return { sidebar: 380, profile: 340 };
  }
}

export default {
  components: {
    MessengerSidebar, ChatArea, MediaMiniPlayer, ProfilePanel, GroupInfoPanel,
    MessengerEmojiPicker, JoinPreviewSheet, ResizeHandle, ActionSheet, DeleteMessageSheet,
    WallpaperPicker, WallpaperApplySheet, InputSheet, AppLockOverlay, E2eRecoveryDialog,
  },
  data() {
    const pw = loadPanelWidths();
    return {
      panelWidths: { ...pw },
      resizing: null,
      hasMore: false,
      profileOpen: false,
      emojiSidebarOpen: false,
      emojiSidebarMode: 'emoji',
      groupInfoOpen: false,
      profileSavedOpen: false,
      profileData: null,
      profileLoading: false,
      /** Bumps on each profile-panel sync so stale getUserProfile results are ignored. */
      profileSyncGen: 0,
      confirm: { open: false, title: '', message: '', actions: [], kind: null, payload: null },
      deleteSheet: {
        open: false,
        count: 1,
        kind: null,
        payload: null,
        partner: '',
        isAlbum: false,
        canDeleteForEveryone: false,
        chatKind: 'private',
      },
      wallpaperPanel: { open: false, conversationId: null, partnerName: '', initialConfig: null },
      wallpaperLiveDraft: null,
      wallpaperApply: { open: false, config: null, conversationId: null, partnerName: '' },
      /** ChatArea mic waves / lock rail need overflow escape on mobile. */
      chatComposerLift: false,
      renameSheet: { open: false, contactId: null, value: '', placeholder: '' },
      revealingMessage: false,
      revealToken: 0,
      // Visual viewport tracking so the chat shrinks above the soft keyboard.
      vvHeight: null,
      vvOffsetTop: 0,
      /** Locks shell height while the mobile emoji panel replaces the soft keyboard. */
      accessoryLock: null,
      appLocked: isAppLocked(),
      unsubAppLock: null,
      joinPreview: { open: false, conversation: null, inviteCode: null, busy: false },
      pendingInviteCode: null,
      playerTeleportReady: false,
      isDesktopLayout: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
      forwardToast: { visible: false, text: '', seconds: 5 },
      forwardToastTimer: null,
      forwardToastTick: null,
      /** Skip route→select while we are the ones writing the URL. */
      syncingChatUrl: false,
      /**
       * False until auth + bootstrap + route sync + stream init finish.
       * Prevents painting a stale conversation that then disappears.
       */
      bootReady: false,
    };
  },
  computed: {
    ...mapState('messenger', ['conversations', 'activeConversationId', 'contacts', 'sending', 'loading', 'messagesLoading', 'connected', 'connectionState', 'connectionDisplayStatus', 'networkOnline', 'conversationsHasMore', 'conversationsLoadingMore', 'font', 'fontSlots', 'draftConversation', 'forwardPick', 'pendingForward', 'accessBlocked', 'accessBlockedMessage', 'e2eRecovery', 'wallpaper']),
    ...mapState('auth', { userInfo: (s) => s.status.userInfo }),
    ...mapGetters('messenger', ['activeConversation', 'activeMessages', 'typingInActive', 'sidebarConversations', 'effectiveWallpaper']),
    /** Hide hollow "— / ?" rows until boot + conversation fetch finish. */
    showListSkeleton() {
      return !this.bootReady || !this.meId || this.loading;
    },
    paintConversations() {
      // Never feed the sidebar a partial list during boot — skeleton only.
      if (this.showListSkeleton) return [];
      return this.sidebarConversations;
    },
    /** Chat pane: never mount a conversation shell before identity is known. */
    paintConversation() {
      if (!this.bootReady || !this.meId) return null;
      const c = this.activeConversation;
      if (!c) return null;
      if (c.type === 'private' && !conversationIdentityReady(c, this.meId)) return null;
      return c;
    },
    paintChatBootLoading() {
      if (!this.bootReady) return true;
      // Route selected a chat but partner/title not ready yet → skeleton, not "—".
      if (this.activeConversationId && !this.paintConversation) return true;
      return false;
    },
    /** Desktop: dock above conversation tiles. Mobile chat: overlay under chat header. */
    mediaPlayerTeleportTo() {
      const mobileChat = !this.isDesktopLayout && !!this.paintConversation;
      return mobileChat ? '#zb-media-player-overlay' : '#zb-media-player-dock';
    },
    mediaPlayerOverlay() {
      return this.mediaPlayerTeleportTo === '#zb-media-player-overlay';
    },
    /** Live picker draft while editing a chat wallpaper; else resolved effective. */
    displayWallpaper() {
      if (this.wallpaperPanel.open && this.wallpaperLiveDraft) {
        return this.wallpaperLiveDraft;
      }
      return this.effectiveWallpaper;
    },
    wallpaperStyle() {
      return buildWallpaperStyle(this.displayWallpaper);
    },
    wallpaperImageStyle() {
      return buildWallpaperImageStyle(this.displayWallpaper);
    },
    wallpaperDimStyle() {
      return buildWallpaperDimStyle(this.displayWallpaper);
    },
    wallpaperPatternStyle() {
      return buildWallpaperPatternStyle(this.displayWallpaper);
    },
    wallpaperGlowStyle() {
      return buildWallpaperGlowStyle(this.displayWallpaper);
    },
    fontStyle() {
      return fontSlotStyle(this.fontSlots);
    },
    sidebarStyle() {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) return {};
      return { width: `${this.panelWidths.sidebar}px`, maxWidth: '42vw' };
    },
    profileStyle() {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) return {};
      return { width: `${this.panelWidths.profile}px`, maxWidth: '36vw' };
    },
    // On touch devices the soft keyboard shrinks the visual viewport but not the
    // layout viewport, so a `fixed inset-0` shell would keep its full height and
    // hide the composer behind the keyboard. Pin the shell to the visual
    // viewport instead so the chat area collapses to the remaining space.
    shellViewportStyle() {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) return {};
      const lock = this.accessoryLock;
      // Emoji dock lives INSIDE ChatArea. While it (or the keyboard-pending
      // spacer) is active, grow the shell so the dock occupies the same band
      // the soft keyboard used — without jumping `top` from vvOffsetTop → 0
      // (that was the residual layout jump on iOS).
      if (lock?.active && typeof window !== 'undefined') {
        const vvTop = Math.max(0, Math.round(this.vvOffsetTop || 0));
        const lockTop = Number.isFinite(lock.offsetTop)
          ? Math.max(0, Math.round(lock.offsetTop))
          : vvTop;
        // Follow the live viewport top downward as the keyboard closes, but
        // never jump above the captured lock top mid-animation.
        const offsetTop = Math.min(lockTop, vvTop || lockTop);
        const height = Math.max(0, Math.round(window.innerHeight - offsetTop));
        if (height > 0) {
          return {
            height: `${height}px`,
            top: `${offsetTop}px`,
            bottom: 'auto',
          };
        }
      }
      if (this.vvHeight == null) return {};
      const vv = typeof window !== 'undefined' ? window.visualViewport : null;
      const vvTop = Math.max(0, vv ? (vv.offsetTop || 0) : (this.vvOffsetTop || 0));
      const vvH = vv ? vv.height : this.vvHeight;
      const kh = Math.max(0, window.innerHeight - vvH - vvTop);
      // Keyboard closed: pin to the layout viewport so a 1–2px visualViewport
      // mismatch cannot flash wallpaper under the composer.
      if (kh < 80 && vvTop < 2) {
        return {
          top: '0px',
          bottom: '0px',
          height: 'auto',
        };
      }
      // Keyboard open: pin with top + bottom (not rounded height) so a hairline
      // gap cannot appear between the composer bar and the soft keyboard.
      // floor(bottom) grows the shell by <1px into the keyboard band when VV
      // reports fractional pixels — matches the flush emoji-dock look.
      const bottomInset = Math.max(0, Math.floor(window.innerHeight - vvTop - vvH));
      return {
        top: `${Math.max(0, Math.round(vvTop))}px`,
        bottom: `${bottomInset}px`,
        height: 'auto',
      };
    },
    meId() {
      const u = this.userInfo;
      if (!u) return null;
      if (typeof u === 'object' && u.value != null && typeof u.value === 'object') return u.value.id ?? null;
      return u.id ?? null;
    },
    typingStatus() {
      const users = this.typingInActive || [];
      const c = this.activeConversation;
      const privateChat = !!c && c.type !== 'group' && c.type !== 'channel' && c.type !== 'saved';
      return formatTypingStatus(this.$t.bind(this), users, {
        privateChat,
        fallbackName: this.$t('messenger.user'),
      });
    },
    typingLabel() {
      return this.typingStatus?.label || null;
    },
    typingActivity() {
      return this.typingStatus?.activity || null;
    },
    profileBlocked() {
      if (!this.profileData?.id) return false;
      return this.contacts.some((ct) => ct.contact_user?.id === this.profileData.id && ct.is_blocked);
    },
    profileContact() {
      if (!this.profileData?.id || this.profileSavedOpen) return null;
      return this.contacts.find((ct) => ct.contact_user?.id === this.profileData.id) || null;
    },
    /** Conversation whose shared media should appear in the user/saved profile panel. */
    profileMediaConversationId() {
      if (this.profileSavedOpen) {
        return this.activeConversation?.type === 'saved' ? this.activeConversation.id : null;
      }
      const p = this.profileData;
      if (!p?.id) return null;
      const active = this.activeConversation;
      if (active && active.type !== 'group' && active.type !== 'channel' && active.type !== 'saved') {
        const partnerId = this.partnerIdOf(active);
        if (Number(partnerId) === Number(p.id)) return active.id;
      }
      const dm = (this.conversations || []).find((c) => (
        c.type !== 'group' && c.type !== 'channel' && c.type !== 'saved'
        && Number(this.partnerIdOf(c)) === Number(p.id)
      ));
      return dm?.id || null;
    },
    anySheetOpen() {
      return this.confirm.open
        || this.deleteSheet.open
        || this.renameSheet.open
        || this.joinPreview?.open
        || this.wallpaperApply.open;
    },
    activePartner() {
      return conversationPartner(this.activeConversation, this.meId);
    },
    activeIsPrivate() {
      const c = this.activeConversation;
      if (!c) return false;
      return c.type !== 'group' && c.type !== 'channel' && c.type !== 'saved' && !!this.activePartner;
    },
    activeIsSaved() {
      return this.activeConversation?.type === 'saved';
    },
    activeIsCommunity() {
      const t = this.activeConversation?.type;
      return t === 'group' || t === 'channel';
    },
    activeChatKind() {
      if (this.activeIsSaved) return 'saved';
      if (this.activeConversation?.type === 'channel') return 'channel';
      if (this.activeConversation?.type === 'group') return 'group';
      return 'private';
    },
    canDeleteOthersInActive() {
      if (!this.activeIsCommunity) return false;
      const role = this.activeConversation?.my_role || this.activeConversation?.pivot?.role;
      return ['owner', 'admin', 'moderator'].includes(role);
    },
    activePartnerName() {
      const p = this.activePartner;
      if (!p) return '';
      const nick = (this.contacts || []).find((ct) => Number(ct.contact_user?.id) === Number(p.id))?.name;
      return peerDisplayName(p, nick);
    },
    /**
     * Identity of the open chat for the profile rail. Includes partner id so
     * draft→draft contact switches (same conversation id `"draft"`) still sync.
     */
    activeProfileSyncKey() {
      const c = this.activeConversation;
      if (!c?.id && c?.id !== 0) return '';
      const t = c.type || 'private';
      if (t === 'group' || t === 'channel' || t === 'saved') return `${t}:${c.id}`;
      const pid = this.partnerIdOf(c) || conversationPartner(c, this.meId)?.id || '';
      return `dm:${c.id}:${pid}`;
    },
  },
  watch: {
    displayWallpaper: {
      immediate: true,
      handler(cfg) {
        warmWallpaperAssets(cfg);
      },
    },
    '$route.fullPath'() {
      if (!this.bootReady) return;
      if (this.$route?.params?.code || this.$route?.params?.username) {
        this.handleJoinRoute();
        return;
      }
      if (this.$route?.name === 'panel-messenger-chat' || this.$route?.name === 'panel-messenger') {
        this.applyChatRoute();
      }
    },
    activeConversationId(id) {
      if (!this.bootReady) return;
      if (this.syncingChatUrl) return;
      // Keep the address bar in sync with the open chat (skip drafts / join flows).
      if (this.$route?.params?.code || this.$route?.params?.username) return;
      this.syncChatUrl(id);
    },
    // Keep the open profile/group rail aligned with the chat being viewed.
    activeProfileSyncKey(key) {
      if (!this.profileOpen || !key) return;
      this.syncProfilePanelToConversation(this.activeConversation);
    },
    fontSlots: {
      deep: true,
      immediate: true,
      handler(slots) {
        // Teleported menus (body) need CSS vars outside .messenger-shell.
        if (typeof document === 'undefined') return;
        const style = fontSlotStyle(slots);
        const root = document.documentElement;
        Object.keys(style).forEach((k) => {
          if (k.startsWith('--')) root.style.setProperty(k, style[k]);
        });
      },
    },
  },
  async created() {
    // Hold chat paint until auth + conversation list HTTP finish. Route sync
    // (deep-link select / join) must not block the sidebar first paint.
    this.bootReady = false;
    this.$store.commit('messenger/SET_SESSION_READY', false);
    this.syncFontsToDirection();

    await this.waitForAuthReady();
    // One orchestrated boot: settings + stream + conversations (+ unread via meta).
    // The socket must not hold the first paint — the header already shows connecting.
    await this.$store.dispatch('messenger/bootstrapSession');
    this.waitForStreamReady(2000);

    this.maybePeriodicContactSync();
    this.bootReady = true;
    this.$store.commit('messenger/SET_SESSION_READY', true);

    // Deep-link / join after first paint — chat skeleton covers the interim.
    this.handleJoinRoute()
      .then(() => this.applyChatRoute())
      .catch((e) => console.warn('[messenger] route sync failed', e));
  },
  mounted() {
    this.$refs.shell?.focus?.();
    warmWallpaperAssets(this.wallpaper);
    this.appLocked = isAppLocked();
    this.unsubAppLock = subscribeAppLock((snap) => {
      this.appLocked = !!snap.locked;
    });
    window.addEventListener('beforeunload', this.onBeforeUnload);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    document.addEventListener('mousemove', this.onResizeMove);
    document.addEventListener('mouseup', this.stopResize);
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (vv) {
      this.onViewportResize();
      vv.addEventListener('resize', this.onViewportResize);
      vv.addEventListener('scroll', this.onViewportResize);
    }
    // Block page refresh (F5 / Ctrl+R / Cmd+R) and pull-to-refresh.
    window.addEventListener('keydown', this.onGlobalKeydown, true);
    document.documentElement.classList.add('messenger-no-refresh');
    document.body.classList.add('messenger-no-refresh');
    // Trap the browser/mobile back button so it steps one logical level back
    // (overlay → keyboard → panel → chat → list → exit confirm).
    this._navHistory = createNavigationHistory({
      isAtRoot: () => this.isAtListRoot(),
      onBack: () => this.handleMessengerBack(),
      onRootBack: () => this.openExitConfirm(),
    });
    this._navHistory.arm();
    // Notifications click-to-open kept for legacy; browser OS toasts are disabled.
    window.addEventListener('messenger:open-conversation', this.onOpenConversationEvent);
    // Block pinch / double-tap / ctrl-wheel zoom while the messenger is open.
    this.disableZoom();
    this.bindDesktopLayoutMq();
    this.$nextTick(() => { this.playerTeleportReady = true; });
    document.documentElement.addEventListener('onChangeLanguage', this.syncFontsToDirection);
  },
  beforeUnmount() {
    this.bootReady = false;
    this.$store.commit('messenger/SET_SESSION_READY', false);
    stopMediaPlayer();
    this.unbindDesktopLayoutMq();
    this.clearForwardToastTimers();
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.stopResize);
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (vv) {
      vv.removeEventListener('resize', this.onViewportResize);
      vv.removeEventListener('scroll', this.onViewportResize);
    }
    window.removeEventListener('keydown', this.onGlobalKeydown, true);
    document.documentElement.classList.remove('messenger-no-refresh');
    document.body.classList.remove('messenger-no-refresh');
    if (this._navHistory) {
      this._navHistory.disarm();
      this._navHistory = null;
    }
    window.removeEventListener('messenger:open-conversation', this.onOpenConversationEvent);
    document.documentElement.removeEventListener('onChangeLanguage', this.syncFontsToDirection);
    if (typeof this.unsubAppLock === 'function') this.unsubAppLock();
    this.restoreZoom();
    this.$store.dispatch('messenger/stopStream');
  },
  methods: {
    syncFontsToDirection() {
      const dir = typeof document !== 'undefined' ? document.documentElement.dir : undefined;
      this.$store.commit('messenger/APPLY_FONT_DIRECTION', dir);
    },
    maybePeriodicContactSync() {
      if (!shouldPeriodicSync()) return;
      const cached = contactsFromCache();
      if (cached.length) {
        this.$store.dispatch('messenger/syncContactsAction', cached).catch(() => {});
      } else {
        this.$store.dispatch('messenger/refreshContactSyncAction').catch(() => {});
      }
    },
    bindDesktopLayoutMq() {
      if (typeof window === 'undefined' || !window.matchMedia) return;
      this._desktopLayoutMq = window.matchMedia('(min-width: 1024px)');
      this._onDesktopLayoutMq = () => {
        this.isDesktopLayout = !!this._desktopLayoutMq.matches;
      };
      this._onDesktopLayoutMq();
      if (this._desktopLayoutMq.addEventListener) {
        this._desktopLayoutMq.addEventListener('change', this._onDesktopLayoutMq);
      } else if (this._desktopLayoutMq.addListener) {
        this._desktopLayoutMq.addListener(this._onDesktopLayoutMq);
      }
    },
    unbindDesktopLayoutMq() {
      if (!this._desktopLayoutMq || !this._onDesktopLayoutMq) return;
      if (this._desktopLayoutMq.removeEventListener) {
        this._desktopLayoutMq.removeEventListener('change', this._onDesktopLayoutMq);
      } else if (this._desktopLayoutMq.removeListener) {
        this._desktopLayoutMq.removeListener(this._onDesktopLayoutMq);
      }
      this._desktopLayoutMq = null;
      this._onDesktopLayoutMq = null;
    },
    ...mapActions('messenger', [
      'fetchConversations',
      'fetchContacts',
      'selectConversation',
      'openSavedMessages',
      'sendMessageAction',
      'sendMediaAction',
      'editMessageAction',
      'deleteMessageAction',
      'startChatWithUser',
      'forwardMessagesAction',
      'fetchSettings',
      'fetchUnreadCount',
      'deleteConversationAction',
      'clearConversationAction',
      'muteConversationAction',
      'markConversationReadAction',
      'addContactAction',
      'updateContactAction',
      'deleteContactAction',
      'sendTypingAction',
      'fetchMessages',
      'loadMoreConversations',
      'startStream',
      'blockUserAction',
      'unblockUserAction',
      'presenceVisibility',
      'retryFailedMessage',
      'deleteFailedMessage',
      'cancelMediaUpload',
      'applyConversationWallpaper',
    ]),

    /** Resolve once auth has a real user id (router gate alone can race Vuex restore). */
    async waitForAuthReady(timeoutMs = 5000) {
      const started = Date.now();
      while (Date.now() - started < timeoutMs) {
        const status = this.$store.state.auth?.status || {};
        const loggedIn = !!status.loggedIn;
        const user = status.userInfo?.value || status.userInfo;
        const userId = user?.id ?? null;
        if (loggedIn && userId) return true;
        // Logged out after a short settle — leave boot; route guard should redirect.
        if (!loggedIn && Date.now() - started > 400) return false;
        await new Promise((r) => setTimeout(r, 30));
      }
      const status = this.$store.state.auth?.status || {};
      const user = status.userInfo?.value || status.userInfo;
      return !!(status.loggedIn && user?.id);
    },

    /**
     * Soft-wait for Echo/Pusher to leave "connecting" so the first paint is not
     * mid-socket. Times out so offline / slow networks never block the UI.
     */
    async waitForStreamReady(timeoutMs = 2000) {
      if (!this.networkOnline) return;
      if (this.connectionState === 'connected' || this.connectionState === 'unavailable') return;
      const started = Date.now();
      while (Date.now() - started < timeoutMs) {
        if (this.connectionState === 'connected' || this.connectionState === 'unavailable') return;
        await new Promise((r) => setTimeout(r, 40));
      }
    },

    async onOpenWallpaper() {
      const c = this.activeConversation;
      if (!c?.id || c.id === 'draft') return;
      const partner = (c.type === 'private') ? this.activePartnerName : '';
      let initial = null;
      try {
        initial = await this.$store.dispatch('messenger/fetchConversationWallpaper', c.id);
      } catch (e) { /* fall back to global */ }
      // Do NOT mutate the global default — chat editing uses a local draft.
      this.wallpaperLiveDraft = null;
      this.wallpaperPanel = {
        open: true,
        conversationId: c.id,
        partnerName: partner || '',
        initialConfig: initial || this.$store.state.messenger.wallpaper,
      };
    },

    onWallpaperDraftChange(cfg) {
      if (!this.wallpaperPanel.open) return;
      this.wallpaperLiveDraft = cfg || null;
    },

    closeWallpaperPanel() {
      this.wallpaperPanel = {
        open: false,
        conversationId: null,
        partnerName: '',
        initialConfig: null,
      };
      this.wallpaperLiveDraft = null;
      this.focusActiveComposer();
    },

    onCloseProfilePanels() {
      this.groupInfoOpen = false;
      this.profileOpen = false;
      this.profileSavedOpen = false;
      this.emojiSidebarOpen = false;
      this.focusActiveComposer();
    },

    onEmojiSidebarChange({ open, mode } = {}) {
      if (open) {
        // Swap into the same right rail; close profile content.
        this.profileOpen = false;
        this.groupInfoOpen = false;
        this.profileSavedOpen = false;
        if (mode && ['emoji', 'gif', 'stickers'].includes(mode)) {
          this.emojiSidebarMode = mode;
        }
        this.emojiSidebarOpen = true;
        return;
      }
      this.emojiSidebarOpen = false;
    },
    onEmojiSidebarModeChange(mode) {
      if (!['emoji', 'gif', 'stickers'].includes(mode)) return;
      this.emojiSidebarMode = mode;
      this.$refs.chatArea?.onEmojiPanelModeChange?.(mode);
    },
    onEmojiSidebarSelect(emoji) {
      this.$refs.chatArea?.onEmojiSelect?.(emoji);
    },
    onEmojiSidebarBackspace() {
      this.$refs.chatArea?.onEmojiBackspace?.();
    },
    onEmojiSidebarSendGif(payload) {
      this.$refs.chatArea?.onSendGifFromPanel?.(payload);
    },
    onEmojiSidebarSendSticker(payload) {
      this.$refs.chatArea?.onSendStickerFromPanel?.(payload);
    },
    onEmojiSidebarComposeStickers(payload) {
      this.$refs.chatArea?.openStickerComposer?.(payload);
    },
    onEmojiSidebarEditSticker(sticker) {
      this.$refs.chatArea?.openStickerEditor?.(sticker);
    },
    onSidebarStickerPacksChanged(payload) {
      const picker = this.$refs.emojiSidebarPicker;
      if (!picker || typeof picker.refreshStickerPacks !== 'function') return;
      picker.refreshStickerPacks({ sync: false });
      if (payload?.packId) {
        picker.packViewId = payload.packId;
        picker.activePackId = payload.packId;
      }
      setTimeout(() => {
        if (typeof picker.syncRemotePacks === 'function') picker.syncRemotePacks();
      }, 800);
    },

    focusActiveComposer() {
      this.$nextTick(() => {
        this.$refs.chatArea?.focusInput?.(true);
      });
    },

    wallpaperCanShareCommunity() {
      const type = this.activeConversation?.type;
      if (type !== 'group' && type !== 'channel') return false;
      const role = String(this.activeConversation?.my_role || this.activeConversation?.pivot?.role || '');
      return ['owner', 'admin', 'moderator'].includes(role);
    },

    onWallpaperApplyRequest({ config, partnerName, cleared = false } = {}) {
      const cid = this.wallpaperPanel.conversationId || this.activeConversationId;
      if (!cid || cid === 'draft') return;
      const isPrivate = this.activeConversation?.type === 'private';
      const canShareCommunity = this.wallpaperCanShareCommunity();

      // "Use my default" — staff clear shared wallpaper for everyone (badge); others only self.
      if (cleared || config == null) {
        const forBoth = !isPrivate && canShareCommunity;
        this.$store.dispatch('messenger/clearConversationWallpaper', { conversationId: cid, forBoth })
          .catch(() => {})
          .finally(() => { this.closeWallpaperPanel(); });
        return;
      }
      if (!isPrivate) {
        this.applyConversationWallpaper({
          conversationId: cid,
          config,
          forBoth: canShareCommunity,
        }).then(() => { this.closeWallpaperPanel(); }).catch(() => {});
        return;
      }
      this.wallpaperApply = {
        open: true,
        config,
        conversationId: cid,
        partnerName: partnerName || this.wallpaperPanel.partnerName || '',
      };
    },

    async onWallpaperApplyConfirm(forBoth) {
      const { config, conversationId } = this.wallpaperApply;
      this.wallpaperApply.open = false;
      if (!conversationId) return;
      try {
        await this.applyConversationWallpaper({
          conversationId,
          config,
          forBoth: !!forBoth,
        });
        this.closeWallpaperPanel();
      } catch (e) { /* noop */ }
    },

    onRetryMessage(message) {
      if (!message || !this.activeConversationId) return;
      // Failure is shown inline on the bubble (red ! + retry), no toast.
      this.retryFailedMessage({ conversationId: this.activeConversationId, message }).catch(() => {});
    },

    onDeleteFailedMessage(message) {
      if (!message?.client_id || !this.activeConversationId) return;
      this.deleteFailedMessage({ conversationId: this.activeConversationId, clientId: message.client_id });
    },

    onCancelUpload(message) {
      if (!message?.client_id || !this.activeConversationId) return;
      this.cancelMediaUpload({ conversationId: this.activeConversationId, clientId: message.client_id });
    },

    onBeforeUnload() {
      presenceOfflineBeacon();
    },

    onVisibilityChange() {
      this.presenceVisibility(document.hidden);
      onAppLockVisibilityChange(document.hidden);
      this.appLocked = isAppLocked();
    },

    onAppUnlocked() {
      this.appLocked = false;
    },

    onViewportResize() {
      const vv = window.visualViewport;
      if (!vv) return;
      this.vvHeight = Math.round(vv.height);
      this.vvOffsetTop = Math.round(vv.offsetTop || 0);
      this.$refs.chatArea?.onVisualViewportChange?.();
    },

    onAccessoryChange(payload) {
      this.accessoryLock = payload?.active ? payload : null;
    },

    // Swallow refresh shortcuts so the chat session is never reloaded.
    onGlobalKeydown(e) {
      const key = (e.key || '').toLowerCase();
      const isReload = key === 'f5'
        || ((e.ctrlKey || e.metaKey) && key === 'r');
      if (isReload) {
        e.preventDefault();
        e.stopPropagation();
      }
    },

    /** Block custom menus on chrome, but keep native OS/browser menus on text fields. */
    onShellContextMenu(e) {
      const t = e?.target;
      if (t && typeof t.closest === 'function') {
        if (t.closest('textarea, input, [contenteditable="true"]')) return;
      }
      if (e?.preventDefault) e.preventDefault();
    },

    // The messenger's true root: the conversation list with nothing layered on
    // top of it. Used to decide when the back button should offer "Exit messenger?".
    isAtListRoot() {
      if (this.anySheetOpen) return false;
      if (this.wallpaperPanel.open) return false;
      if (this.profileOpen) return false;
      if (this.emojiSidebarOpen) return false;
      if (this.activeConversationId) return false;
      if (this.$store.state.messenger.selectionMode) return false;
      const chat = this.$refs.chatArea;
      if (chat && typeof chat.hasOverlay === 'function' && chat.hasOverlay()) return false;
      const sb = this.$refs.sidebar;
      if (sb && typeof sb.isAtListRoot === 'function' && !sb.isAtListRoot()) return false;
      if (isKeyboardOpen()) return false;
      return true;
    },

    profilePanelHasOverlay() {
      const panel = this.groupInfoOpen ? this.$refs.groupInfoPanel : this.$refs.profilePanel;
      return panel && typeof panel.hasOverlay === 'function' && panel.hasOverlay();
    },

    /** Telegram-style exit confirmation — never leave on the first root back press. */
    openExitConfirm() {
      if (this.confirm.open && this.confirm.kind === 'exit-messenger') return;
      this.openConfirmSheet({
        title: this.$t('messenger.exitMessenger') || 'Exit messenger?',
        message: '',
        actions: [
          { label: this.$t('messenger.exit') || 'Exit', value: 'exit', danger: true },
        ],
        kind: 'exit-messenger',
        payload: null,
      });
    },

    // Returns true if a navigation level was popped (stay in messenger),
    // false when nothing was left to close (allow leaving).
    handleMessengerBack() {
      return runBackPriority([
        // 1) Highest: any overlay / confirmation / sheet registered or known locally.
        () => {
          const top = getTopOverlay();
          if (top?.kind === 'confirm' || this.anySheetOpen) {
            // Close only the active confirm/sheet layer — not every sheet at once
            // when a registered overlay already owns close().
            if (top && typeof top.close === 'function' && (top.kind === 'confirm' || top.kind === 'sheet')) {
              return closeTopOverlay();
            }
            this.confirm.open = false;
            this.deleteSheet.open = false;
            this.renameSheet.open = false;
            this.joinPreview.open = false;
            this.wallpaperApply.open = false;
            return true;
          }
          return false;
        },
        () => {
          if (!this.wallpaperPanel.open) return false;
          this.closeWallpaperPanel();
          return true;
        },
        // 2) Chat overlays (menus, media viewer, emoji panel, …).
        () => !!(this.$refs.chatArea && typeof this.$refs.chatArea.handleBack === 'function'
          && this.$refs.chatArea.handleBack()),
        // 2b) Soft keyboard — dismiss and stay on the current screen.
        () => {
          if (!isKeyboardOpen()) return false;
          if (this.$refs.chatArea && typeof this.$refs.chatArea.dismissSoftKeyboard === 'function') {
            this.$refs.chatArea.dismissSoftKeyboard();
            return true;
          }
          return dismissKeyboard();
        },
        // 2c) Sidebar conversation context menu (list long-press).
        () => {
          if (!this.$refs.sidebar?.convMenu?.visible) return false;
          this.$refs.sidebar.convMenu.visible = false;
          return true;
        },
        // 3) Multi-select mode.
        () => {
          if (!this.$store.state.messenger.selectionMode) return false;
          this.$store.commit('messenger/CLEAR_SELECTION');
          return true;
        },
        // 4) Sidebar sub-panels / nested settings.
        () => !!(this.$refs.sidebar && typeof this.$refs.sidebar.handleBack === 'function'
          && this.$refs.sidebar.handleBack()),
        // 5) Emoji / profile side panels.
        () => {
          if (!this.emojiSidebarOpen) return false;
          this.emojiSidebarOpen = false;
          return true;
        },
        () => {
          if (!this.profileOpen) return false;
          const panel = this.groupInfoOpen ? this.$refs.groupInfoPanel : this.$refs.profilePanel;
          if (panel && typeof panel.handleBack === 'function' && panel.handleBack()) return true;
          this.profileOpen = false;
          this.groupInfoOpen = false;
          this.profileSavedOpen = false;
          return true;
        },
        // 6) Open conversation → chat list (preserve list scroll / selection state).
        () => {
          if (!this.activeConversationId) return false;
          this.backToList();
          return true;
        },
      ]);
    },

    startResize(which, e) {
      this.resizing = { which, startX: e.clientX, startW: this.panelWidths[which] };
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    onResizeMove(e) {
      if (!this.resizing) return;
      const rtl = document.documentElement.dir === 'rtl';
      const dx = e.clientX - this.resizing.startX;
      const delta = rtl ? -dx : dx;
      let next = this.resizing.startW + (this.resizing.which === 'sidebar' ? delta : -delta);
      if (this.resizing.which === 'sidebar') {
        next = Math.min(520, Math.max(300, next));
        this.panelWidths.sidebar = next;
      } else {
        next = Math.min(480, Math.max(280, next));
        this.panelWidths.profile = next;
      }
    },
    stopResize() {
      if (!this.resizing) return;
      try {
        localStorage.setItem(PANEL_WIDTHS_KEY, JSON.stringify(this.panelWidths));
      } catch (e) { /* noop */ }
      this.resizing = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    },

    onKeydown(e) {
      if (e.key !== 'Escape') return;
      // Sheets handle their own ESC; only act when nothing is open.
      if (this.anySheetOpen) return;
      if (this.profileOpen) {
        this.profileOpen = false;
        this.groupInfoOpen = false;
        this.profileSavedOpen = false;
        return;
      }
      if (this.activeConversationId) {
        this.backToList();
      }
    },

    async onSelectConversation(conv, opts) {
      // Switching chats cancels an unfinished forward compose — unless we are
      // opening the target chat for an in-progress forward pick.
      const keepPending = !!(opts && typeof opts === 'object' && opts.keepPendingForward);
      if (!keepPending) {
        this.$store.commit('messenger/CLEAR_PENDING_FORWARD');
      }
      this.$store.commit('messenger/CLEAR_DRAFT_CONVERSATION');

      // Forward target: arm the chat shell immediately and let history load in
      // the background so the forward bar above the input is never gated on fetch.
      if (keepPending) {
        this.selectConversation(conv.id).then((meta) => {
          this.hasMore = meta?.has_more || false;
          if (this.profileOpen) {
            this.syncProfilePanelToConversation(conv);
          }
        }).catch(() => {});
        return;
      }

      const meta = await this.selectConversation(conv.id);
      this.hasMore = meta?.has_more || false;
      if (this.profileOpen) {
        await this.syncProfilePanelToConversation(conv);
      }
    },

    async onOpenSearchMessage({ conversation, messageId } = {}) {
      if (!conversation?.id || messageId == null) return;
      const existing = this.conversations.find((c) => Number(c.id) === Number(conversation.id));
      await this.onSelectConversation(existing || conversation);
      await this.$nextTick();
      await this.onRevealMessage({ id: Number(messageId), duration: 5000 });
    },

    async syncProfilePanelToConversation(conv) {
      if (!this.profileOpen) return;
      // Prefer the store-backed active chat (draft partner, overlay, enriched row).
      const active = this.activeConversation;
      let resolved = conv || active;
      if (active && conv?.id != null) {
        const same = String(active.id) === String(conv.id)
          || (Number(active.id) === Number(conv.id) && Number.isFinite(Number(conv.id)));
        if (same) resolved = active;
      } else if (!resolved) {
        resolved = active;
      }
      if (!resolved) return;

      if (resolved.type === 'group' || resolved.type === 'channel') {
        this.groupInfoOpen = true;
        this.profileSavedOpen = false;
        this.profileData = null;
        return;
      }
      if (resolved.type === 'saved') {
        this.groupInfoOpen = false;
        this.profileSavedOpen = true;
        this.profileData = null;
        return;
      }
      this.groupInfoOpen = false;
      this.profileSavedOpen = false;

      const partner = conversationPartner(resolved, this.meId)
        || resolved.partner
        || (resolved.users || []).find((u) => Number(u.id) !== Number(this.meId));
      const partnerId = partner?.id ?? this.partnerIdOf(resolved);
      if (!partnerId) {
        // Never keep the previous peer visible when the new chat has no partner yet.
        this.profileData = null;
        return;
      }
      if (Number(this.profileData?.id) === Number(partnerId) && !this.profileSavedOpen) return;

      this.profileData = partner || { id: partnerId };
      const gen = (this.profileSyncGen += 1);
      this.profileLoading = true;
      try {
        const fresh = await getUserProfile(partnerId);
        if (gen !== this.profileSyncGen || !this.profileOpen) return;
        this.profileData = fresh;
      } catch (e) { /* keep brief data */ }
      finally {
        if (gen === this.profileSyncGen) this.profileLoading = false;
      }
    },

    partnerIdOf(c) {
      if (!c) return null;
      if (c.partner) return c.partner.id;
      const u = (c.users || []).find((x) => x.id !== this.meId);
      return u ? u.id : null;
    },

    // `payload` is a single string, an array of chunks when a long message
    // was split (Telegram-style), or a rich object `{ body, type, meta }`
    // (e.g. location). Chunks are sent sequentially to keep order.
    async onSend(payload) {
      const items = this.normalizeSendPayload(payload);
      if (!items.length) return;
      const conversationId = this.activeConversationId;
      if (!conversationId) return;
      // Draft or existing: paint bubbles immediately. Store promotes draft→real
      // in the background (Telegram-style — never block the composer on create).
      this.sendBodiesSequentially(conversationId, items).catch(() => {});
    },

    async onSendMedia(payload) {
      if (!payload?.type) return;
      const hasFile = !!payload.file;
      const hasMediaId = payload.mediaId != null && payload.mediaId !== '';
      if (!hasFile && !hasMediaId) return;
      const conversationId = this.activeConversationId;
      if (!conversationId) return;
      this.sendMediaAction({
        conversationId,
        file: payload.file || null,
        mediaId: hasMediaId ? payload.mediaId : null,
        type: payload.type,
        caption: payload.caption || '',
        duration: payload.duration,
        width: payload.width,
        height: payload.height,
        localUrl: payload.localUrl || null,
        coverFile: payload.coverFile || null,
        localCover: payload.localCover || null,
        silent: !!payload.silent,
        animation: !!payload.animation,
        albumId: payload.albumId || null,
        albumIndex: payload.albumIndex != null ? payload.albumIndex : null,
        albumCount: payload.albumCount != null ? payload.albumCount : null,
        sticker: !!payload.sticker,
        stickerId: payload.stickerId || null,
        stickerPackId: payload.stickerPackId || null,
        stickerEmoji: payload.stickerEmoji || null,
        stickerKind: payload.stickerKind || null,
      }).catch(() => {});
    },

    normalizeSendPayload(payload) {
      if (payload == null) return [];
      if (Array.isArray(payload)) {
        return payload.map((p) => this.normalizeSendPayload(p)).flat();
      }
      if (typeof payload === 'object' && payload.body != null) {
        return [{
          body: payload.body,
          type: payload.type || 'text',
          meta: payload.meta || null,
        }];
      }
      return [{ body: String(payload), type: 'text', meta: null }];
    },

    sendBodiesSequentially(conversationId, items) {
      // The store keeps a per-conversation send queue, so enqueueing each body
      // in order is enough — ordering is guaranteed and one failed chunk won't
      // abort the rest (each failed bubble stays retriable).
      let last = Promise.resolve();
      items.forEach((item) => {
        last = this.sendMessageAction({
          conversationId,
          body: item.body,
          type: item.type || 'text',
          meta: item.meta || null,
        });
      });
      return last;
    },

    async onEdit({ messageId, body }) {
      try {
        await this.editMessageAction({ conversationId: this.activeConversationId, messageId, body });
      } catch (e) { /* noop */ }
    },

    // -------- Confirm / action sheet plumbing --------
    openDeleteSheet(partial) {
      // Defer past the context-menu ghost click (same pattern as pin confirm).
      openAfterPointerSettled(() => {
        this.deleteSheet = {
          count: 1,
          kind: null,
          payload: null,
          partner: '',
          isAlbum: false,
          canDeleteForEveryone: false,
          chatKind: 'private',
          ...partial,
          open: true,
        };
      });
    },

    openConfirmSheet(partial) {
      openAfterPointerSettled(() => {
        this.confirm = {
          title: '',
          message: '',
          actions: [],
          kind: null,
          payload: null,
          ...partial,
          open: true,
        };
      });
    },

    onRequestDeleteMessage(message) {
      const mine = Number(message.user_id) === Number(this.meId);
      const chatKind = this.activeChatKind;
      let canDeleteForEveryone = false;
      let partner = '';

      if (chatKind === 'saved') {
        canDeleteForEveryone = true;
      } else if (chatKind === 'private' && mine) {
        canDeleteForEveryone = true;
        partner = this.activePartnerName;
      } else if (this.activeIsCommunity && (mine || this.canDeleteOthersInActive)) {
        canDeleteForEveryone = true;
      }

      this.openDeleteSheet({
        count: 1,
        kind: 'delete-message',
        payload: { messageId: message.id, mine },
        partner,
        isAlbum: false,
        canDeleteForEveryone,
        chatKind,
      });
    },

    onRequestDeleteSelected(payload) {
      // Accept either an id array (selection bar) or { messageIds, isAlbum }.
      const messageIds = Array.isArray(payload) ? payload : (payload?.messageIds || []);
      const isAlbum = !Array.isArray(payload) && !!payload?.isAlbum;
      if (!messageIds.length) return;

      const chatKind = this.activeChatKind;
      const selected = (this.activeMessages || []).filter((m) => messageIds.some((id) => Number(id) === Number(m.id)));
      const allMine = selected.length > 0 && selected.every((m) => Number(m.user_id) === Number(this.meId));
      let canDeleteForEveryone = false;
      let partner = '';

      if (chatKind === 'saved') {
        canDeleteForEveryone = true;
      } else if (chatKind === 'private' && allMine) {
        canDeleteForEveryone = true;
        partner = this.activePartnerName;
      } else if (this.activeIsCommunity && (allMine || this.canDeleteOthersInActive)) {
        canDeleteForEveryone = true;
      }

      this.openDeleteSheet({
        count: messageIds.length,
        kind: 'delete-selected',
        payload: { messageIds, mine: allMine || this.canDeleteOthersInActive },
        partner,
        isAlbum,
        canDeleteForEveryone,
        chatKind,
      });
    },

    async onDeleteConfirm(scope) {
      const { kind, payload, canDeleteForEveryone, chatKind } = this.deleteSheet;
      this.deleteSheet.open = false;
      // Saved Messages always permanently deletes (self-chat).
      let effectiveScope = scope;
      if (chatKind === 'saved') {
        effectiveScope = 'everyone';
      } else if (!payload.mine && !canDeleteForEveryone) {
        effectiveScope = 'me';
      } else if (scope === 'everyone' && !canDeleteForEveryone) {
        effectiveScope = 'me';
      }
      try {
        if (kind === 'delete-message') {
          await this.deleteMessageAction({
            conversationId: this.activeConversationId,
            messageId: payload.messageId,
            scope: effectiveScope,
          });
        } else if (kind === 'delete-selected') {
          await this.$store.dispatch('messenger/bulkDeleteAction', {
            conversationId: this.activeConversationId,
            messageIds: payload.messageIds,
            scope: effectiveScope,
          });
          this.$store.commit('messenger/CLEAR_SELECTION');
        }
      } catch (e) { /* noop */ }
      this.focusActiveComposer();
    },

    onRequestClear(conversationId) {
      const id = conversationId || this.activeConversationId;
      if (!id) return;
      this.openConfirmSheet({
        title: this.$t('messenger.clearConversation'),
        message: this.$t('messenger.confirmClear'),
        actions: [{ label: this.$t('messenger.clearConversation'), value: 'ok', danger: true }],
        kind: 'clear',
        payload: { id },
      });
    },

    onRequestDeleteConversation(conversationId) {
      const id = conversationId || this.activeConversationId;
      if (!id) return;
      this.openConfirmSheet({
        title: this.$t('messenger.deleteConversation'),
        message: this.$t('messenger.confirmDeleteConversation'),
        actions: [{ label: this.$t('messenger.deleteConversation'), value: 'ok', danger: true }],
        kind: 'delete-conversation',
        payload: { id },
      });
    },

    onRequestDeleteContact(contactId) {
      this.openConfirmSheet({
        title: this.$t('messenger.deleteContact'),
        message: this.$t('messenger.confirmDelete'),
        actions: [{ label: this.$t('messenger.delete'), value: 'ok', danger: true }],
        kind: 'delete-contact',
        payload: { contactId },
      });
    },

    onRequestLogout() {
      this.openConfirmSheet({
        title: this.$t('messenger.logoutConfirm'),
        message: this.$t('messenger.logoutConfirmHint'),
        actions: [{ label: this.$t('user.logoutAccount'), value: 'ok', danger: true }],
        kind: 'logout',
        payload: null,
      });
    },

    async onConfirmSelect(value) {
      const { kind, payload } = this.confirm;
      this.confirm.open = false;
      if (value === 'cancel') {
        this.focusActiveComposer();
        return;
      }
      try {
        if (kind === 'exit-messenger' && value === 'exit') {
          this.exit();
          return;
        }
        if (kind === 'clear') {
          await this.clearConversationAction(payload.id);
        } else if (kind === 'delete-conversation') {
          await this.deleteConversationAction(payload.id);
          this.groupInfoOpen = false;
          this.profileOpen = false;
          if (payload.id === this.activeConversationId) {
            this.$store.commit('messenger/SET_ACTIVE_CONVERSATION', null);
          }
        } else if (kind === 'delete-contact') {
          await this.deleteContactAction(payload.contactId);
        } else if (kind === 'leave-community' && value === 'leave') {
          await this.doLeaveCommunity(payload);
        } else if (kind === 'block-user') {
          await this.blockUserAction(payload.id);
          this.profileOpen = false;
          this.groupInfoOpen = false;
        } else if (kind === 'logout') {
          await this.$store.dispatch('auth/logout');
          this.exit();
        }
      } catch (e) { /* noop */ }
      this.focusActiveComposer();
    },

    onTyping(activity = 'typing') {
      // Never emit typing for a draft (it has no server-side conversation yet).
      if (this.draftConversation && this.activeConversationId === this.draftConversation.id) return;
      if (!this.activeConversationId) return;
      this.sendTypingAction({
        conversationId: this.activeConversationId,
        activity: activity || 'typing',
      });
    },

    async onMarkRead(conversationId) {
      if (!conversationId) return;
      await this.markConversationReadAction(conversationId);
    },

    async onMute(conversationId) {
      if (!conversationId) return;
      await this.muteConversationAction(conversationId);
    },

    // Reveal a (possibly not-yet-loaded) message: keep page-loading older
    // history until the target id appears, then scroll to + highlight it.
    async onRevealMessage(payload) {
      const messageId = (payload && typeof payload === 'object') ? payload.id : payload;
      const duration = (payload && typeof payload === 'object' && payload.duration) || 3000;
      if (messageId == null) return;
      const target = Number(messageId);
      if (!Number.isFinite(target)) return;
      const token = ++this.revealToken;
      const has = () => this.activeMessages.some((m) => Number(m.id) === target);
      if (has()) {
        this.$refs.chatArea?.scrollToMessage?.(target, { duration });
        return;
      }
      this.revealingMessage = true;
      this.$refs.chatArea?.setRevealLoading?.(true);
      try {
        let guard = 0;
        // Bound the loop so a missing/deleted target can never spin forever.
        // Enough headroom for deep history (e.g. page 16 of a long chat).
        while (this.hasMore && !has() && guard < 120) {
          if (token !== this.revealToken) return;
          guard += 1;
          const msgs = this.activeMessages;
          const firstReal = msgs.find((m) => typeof m.id === 'number' || (typeof m.id === 'string' && /^\d+$/.test(m.id)));
          if (!firstReal) break;
          const meta = await this.fetchMessages({
            conversationId: this.activeConversationId,
            beforeId: firstReal.id,
          });
          this.hasMore = meta?.has_more || false;
        }
      } catch (e) {
        /* swallow — we simply won't scroll if loading failed */
      } finally {
        if (token === this.revealToken) {
          this.revealingMessage = false;
          this.$refs.chatArea?.setRevealLoading?.(false);
        }
      }
      if (token !== this.revealToken) return;
      if (has()) {
        await this.$nextTick();
        this.$refs.chatArea?.scrollToMessage?.(target, { duration });
      }
    },

    async onLoadMore() {
      const msgs = this.activeMessages;
      if (!msgs.length) return;
      // Use the oldest *real* message id as the cursor (skip system notes).
      const firstReal = msgs.find((m) => typeof m.id === 'number');
      if (!firstReal) return;
      const meta = await this.fetchMessages({ conversationId: this.activeConversationId, beforeId: firstReal.id });
      this.hasMore = meta?.has_more || false;
    },

    onStartChat(user) {
      if (!user || !user.id) return;
      // Reuse an existing private conversation only when it already has messages.
      const existing = this.conversations.find(
        (c) => c.type === 'private'
          && this.partnerIdOf(c) === user.id
          && (c.last_message || c.last_message_at),
      );
      if (existing) {
        this.onSelectConversation(existing);
        return;
      }
      // Drop any empty private leftover so it cannot resurface in the list.
      const empty = this.conversations.find(
        (c) => c.type === 'private' && this.partnerIdOf(c) === user.id,
      );
      if (empty) {
        this.$store.commit('messenger/REMOVE_CONVERSATION', empty.id);
      }
      // Otherwise open a draft chat: it's not created on the server and never
      // appears in the sidebar until the first message is sent.
      this.$store.commit('messenger/CLEAR_OVERLAY_CONVERSATION');
      this.$store.commit('messenger/SET_DRAFT_CONVERSATION', {
        id: 'draft',
        type: 'private',
        isDraft: true,
        partner: user,
        users: [user],
        unread_count: 0,
      });
      this.$store.commit('messenger/SET_ACTIVE_CONVERSATION', 'draft');
      // Profile rail must follow the new peer (draft id stays `"draft"` so id-only
      // watchers miss contact→contact switches).
      if (this.profileOpen) {
        this.syncProfilePanelToConversation(this.activeConversation);
      }
      // Create conversation + warm crypto while the user types (Telegram-fast first send).
      this.$store.dispatch('messenger/prefetchDraftConversation').catch(() => {});
    },

    async onOpenSaved() {
      try {
        const conv = await this.openSavedMessages();
        await this.onSelectConversation(conv);
      } catch (e) { /* noop */ }
    },

    async onForwardPickSaved() {
      await this.applyForwardTarget(async () => {
        const conv = await this.openSavedMessages();
        await this.onSelectConversation(conv, { keepPendingForward: true });
      });
    },

    onOpenForward(payload) {
      let messageIds;
      let dropAuthor = false;
      if (Array.isArray(payload)) {
        messageIds = payload;
      } else {
        messageIds = payload?.messageIds || [];
        dropAuthor = !!payload?.dropAuthor;
      }
      if (!messageIds.length) return;

      const idSet = new Set(messageIds.map(Number));
      const fromActive = (this.activeMessages || []).filter((m) => idSet.has(Number(m.id)));
      const fromSelected = (this.$store.getters['messenger/selectedMessages'] || [])
        .filter((m) => idSet.has(Number(m.id)));
      const resolved = fromActive.length ? fromActive : fromSelected;
      const messages = resolved.length
        ? resolved
        : messageIds.map((id) => ({ id, body: '', type: 'text', user: null }));

      this.$store.commit('messenger/CLEAR_PENDING_FORWARD');
      this.$store.commit('messenger/SET_FORWARD_PICK', { messageIds, messages, dropAuthor });
      this.$store.commit('messenger/CLEAR_SELECTION');
      this.profileOpen = false;
      this.groupInfoOpen = false;

      // Open the forward panel BEFORE leaving the chat so a leftover finger-up
      // from the menu/toolbar never lands on the conversation list underneath.
      this.$refs.sidebar?.openForward?.();

      // Mobile: leave chat so the sidebar forward list is visible (Telegram-style).
      const mobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      if (mobile && this.activeConversationId) {
        this.backToList();
      }
    },

    async applyForwardTarget(openTarget) {
      const pick = this.forwardPick;
      if (!pick?.messageIds?.length) return;
      this.$refs.sidebar?.closeForward?.({ cancel: false });
      this.$store.commit('messenger/CLEAR_FORWARD_PICK');
      // Arm the forward bar BEFORE opening the chat so it appears immediately,
      // even while message history is still loading.
      this.$store.commit('messenger/SET_PENDING_FORWARD', {
        messageIds: pick.messageIds,
        messages: pick.messages || [],
        dropAuthor: !!pick.dropAuthor,
      });
      this.$store.commit('messenger/SET_REPLY', null);
      try {
        await openTarget();
        this.$nextTick(() => {
          // Mobile: keep the soft keyboard closed until the user taps the input.
          if (this.$refs.chatArea?.isCoarsePointer?.()) {
            this.$refs.chatArea?.blurComposer?.();
          } else {
            this.$refs.chatArea?.focusInput?.(true);
          }
        });
      } catch (e) {
        this.$store.commit('messenger/CLEAR_PENDING_FORWARD');
      }
    },

    async onForwardPickConversation({ conversationId }) {
      if (!conversationId) return;
      await this.applyForwardTarget(async () => {
        await this.onSelectConversation({ id: conversationId }, { keepPendingForward: true });
      });
    },

    async onForwardPickUser({ user }) {
      if (!user) return;
      await this.applyForwardTarget(async () => {
        const conv = await this.startChatWithUser(user);
        await this.onSelectConversation(conv, { keepPendingForward: true });
      });
    },

    onForwardCancel() {
      this.$store.commit('messenger/CLEAR_FORWARD_PICK');
    },

    /**
     * Multi-recipient forward: send in place on the picker/list — do not open a chat.
     * Shows a glass toast with a countdown.
     */
    async onForwardSendTargets({ targets }) {
      const pick = this.forwardPick;
      const list = Array.isArray(targets) ? targets : [];
      if (!pick?.messageIds?.length || list.length < 2) return;

      const { messageIds, messages, dropAuthor } = pick;
      this.$refs.sidebar?.closeForward?.({ cancel: false });
      this.$store.commit('messenger/CLEAR_FORWARD_PICK');

      // Resolve destinations first (saved / new DM need a network hop).
      const destIds = [];
      for (const t of list) {
        try {
          let convId = null;
          if (t.type === 'saved') {
            // eslint-disable-next-line no-await-in-loop
            const conv = await this.openSavedMessages();
            convId = conv?.id;
          } else if (t.type === 'user' && t.user) {
            // eslint-disable-next-line no-await-in-loop
            const conv = await this.startChatWithUser(t.user);
            convId = conv?.id;
          } else if (t.conversationId) {
            convId = t.conversationId;
          }
          if (convId) destIds.push(convId);
        } catch (e) {
          /* skip failed destination */
        }
      }

      let sent = 0;
      destIds.forEach((convId) => {
        this.forwardMessagesAction({
          messageIds,
          toConversationId: convId,
          dropAuthor: !!dropAuthor,
          sourceMessages: messages || [],
        }).catch(() => {});
        sent += messageIds.length;
      });
      this.showForwardGlassToast(sent);
    },

    showForwardGlassToast(count) {
      this.clearForwardToastTimers();
      const n = Number(count) || 0;
      if (n <= 0) return;
      const durationSec = 5;
      this.forwardToast = {
        visible: true,
        text: this.$t('messenger.messagesSentCount', { n }),
        seconds: durationSec,
      };
      this.forwardToastTick = setInterval(() => {
        if (this.forwardToast.seconds <= 1) {
          this.hideForwardGlassToast();
          return;
        }
        this.forwardToast = {
          ...this.forwardToast,
          seconds: this.forwardToast.seconds - 1,
        };
      }, 1000);
      this.forwardToastTimer = setTimeout(() => {
        this.hideForwardGlassToast();
      }, durationSec * 1000);
    },

    hideForwardGlassToast() {
      this.clearForwardToastTimers();
      this.forwardToast = { visible: false, text: '', seconds: 5 };
    },

    clearForwardToastTimers() {
      if (this.forwardToastTimer) {
        clearTimeout(this.forwardToastTimer);
        this.forwardToastTimer = null;
      }
      if (this.forwardToastTick) {
        clearInterval(this.forwardToastTick);
        this.forwardToastTick = null;
      }
    },

    async onConfirmForward({ messageIds, dropAuthor, caption }) {
      const ids = messageIds || this.pendingForward?.messageIds || [];
      const sourceMessages = this.pendingForward?.messages || [];
      const toId = this.activeConversationId;
      if (!ids.length || !toId || toId === 'draft') return;
      // Fire-and-forget: optimistic bubbles paint in the same tick; do not block the UI.
      this.forwardMessagesAction({
        messageIds: ids,
        toConversationId: toId,
        dropAuthor: !!dropAuthor,
        sourceMessages,
      }).catch((e) => {
        console.warn(
          '[messenger] confirm forward failed',
          e?.response?.data?.message || e?.message || e,
          { toId, ids },
        );
      });
      if (caption) {
        this.sendMessageAction({ conversationId: toId, body: caption }).catch(() => {});
      }
      this.$store.commit('messenger/CLEAR_PENDING_FORWARD');
      this.focusActiveComposer();
    },

    async onCommunityCreated(conversation) {
      const conv = conversation?.id ? conversation : conversation?.data;
      if (!conv?.id) return;
      this.$store.commit('messenger/UPSERT_CONVERSATION', conv);
      await this.selectConversation(conv.id);
    },

    onCommunityUpdated(conversation) {
      this.$store.commit('messenger/UPSERT_CONVERSATION', conversation);
    },

    async onOpenProfile(userOrConversation) {
      if (!userOrConversation) return;

      // Opening profile swaps the right rail away from emoji.
      this.emojiSidebarOpen = false;

      const active = this.activeConversation;
      const isCommunityPayload = userOrConversation.type === 'group'
        || userOrConversation.type === 'channel';
      // Fake "partner" for communities reuses conversation.id without a type —
      // never treat that as a user profile.
      const looksLikeActiveCommunity = active
        && (active.type === 'group' || active.type === 'channel')
        && Number(userOrConversation.id) === Number(active.id)
        && !userOrConversation.type;

      if (userOrConversation.type === 'saved' || (active?.type === 'saved' && Number(userOrConversation.id) === Number(active.id))) {
        this.groupInfoOpen = false;
        this.profileSavedOpen = true;
        this.profileData = null;
        this.profileOpen = true;
        return;
      }

      if (isCommunityPayload || looksLikeActiveCommunity) {
        this.groupInfoOpen = true;
        this.profileSavedOpen = false;
        this.profileOpen = true;
        this.profileData = null;
        return;
      }

      if (!userOrConversation.id) return;
      // Never open "my profile" from chat avatars/names — only Saved Messages menu.
      if (Number(userOrConversation.id) === Number(this.meId)) return;

      this.groupInfoOpen = false;
      this.profileSavedOpen = false;
      this.profileData = userOrConversation;
      this.profileOpen = true;
      this.profileLoading = true;
      try {
        this.profileData = await getUserProfile(userOrConversation.id);
      } catch (e) {
        /* keep the brief data we already have */
      } finally {
        this.profileLoading = false;
      }
    },

    onProfileGoToMessage(messageId) {
      if (messageId == null) return;
      this.profileOpen = false;
      this.groupInfoOpen = false;
      this.profileSavedOpen = false;
      this.$nextTick(() => this.onRevealMessage({ id: messageId, duration: 5000 }));
    },

    async handleJoinRoute() {
      const code = this.$route?.params?.code;
      const username = this.$route?.params?.username;
      if (!code && !username) return;
      await this.openJoinTarget({ code, username });
    },

    /** Open invite / @username destination from a route or in-message link. */
    async openJoinTarget({ code = null, username = null } = {}) {
      if (!code && !username) return;
      try {
        const preview = await previewJoin({
          code: code || undefined,
          username: username || undefined,
        });
        const conv = preview?.conversation;
        if (!conv?.id) return;

        if (preview.is_member) {
          this.$store.commit('messenger/CLEAR_OVERLAY_CONVERSATION');
          this.$store.commit('messenger/UPSERT_CONVERSATION', { ...conv, is_preview: false });
          await this.selectConversation(conv.id);
          this.normalizeMessengerUrl();
          return;
        }

        if (preview.can_preview && conv.is_public) {
          // Public: open chat in preview mode with Join bar — not in sidebar.
          this.pendingInviteCode = preview.invite_code || null;
          this.$store.commit('messenger/SET_OVERLAY_CONVERSATION', { ...conv, is_preview: true });
          this.$store.commit('messenger/REMOVE_FROM_SIDEBAR', conv.id);
          await this.selectConversation({ conversationId: conv.id, asPreview: true });
          this.normalizeMessengerUrl();
          return;
        }

        // Private invite: ask first.
        this.joinPreview = {
          open: true,
          conversation: conv,
          inviteCode: preview.invite_code || code || null,
          busy: false,
        };
      } catch (e) {
        /* ignore invalid links */
      }
    },

    onOpenMessageLink(info) {
      if (!info) return;
      if (info.kind === 'invite') {
        this.openJoinTarget({ code: info.value });
        return;
      }
      if (info.kind === 'community') {
        this.openJoinTarget({ username: info.value });
        return;
      }
      if (info.kind === 'internal' && info.href) {
        this.$router.push(info.href).catch(() => {});
      }
    },

    normalizeMessengerUrl() {
      this.syncChatUrl(this.activeConversationId);
    },

    /**
     * Keep the address bar in sync with the open chat without page-level loading.
     * Uses replace so selecting chats does not spam history (back still uses mzrTrap).
     * Messenger-internal swaps skip NProgress / cancelAllPending in the router.
     */
    syncChatUrl(conversationId) {
      if (this.$route?.params?.code || this.$route?.params?.username) return;
      const name = this.$route?.name;
      if (name && name !== 'panel-messenger' && name !== 'panel-messenger-chat') return;

      const key = encodeChatId(conversationId);
      this.syncingChatUrl = true;
      const done = () => {
        this.$nextTick(() => { this.syncingChatUrl = false; });
      };
      if (key) {
        if (name === 'panel-messenger-chat' && this.$route.params.chatId === key) {
          this.syncingChatUrl = false;
          return;
        }
        Promise.resolve(
          this.$router.replace({ name: 'panel-messenger-chat', params: { chatId: key } }),
        ).catch(() => {}).finally(done);
        return;
      }
      if (name === 'panel-messenger') {
        this.syncingChatUrl = false;
        return;
      }
      Promise.resolve(
        this.$router.replace({ name: 'panel-messenger' }),
      ).catch(() => {}).finally(done);
    },

    /** Open the chat encoded in /messenger/:chatId (deep link / refresh). */
    async applyChatRoute() {
      if (this.syncingChatUrl) return;
      if (this.$route?.params?.code || this.$route?.params?.username) return;
      const chatId = this.$route?.params?.chatId;
      if (!chatId) {
        // Bare /messenger with an open chat → keep URL in sync.
        if (this.activeConversationId && this.$route?.name === 'panel-messenger') {
          this.syncChatUrl(this.activeConversationId);
        }
        return;
      }
      const id = decodeChatId(chatId);
      if (id == null) {
        this.$store.commit('messenger/SET_ACTIVE_CONVERSATION', null);
        this.syncChatUrl(null);
        return;
      }
      if (Number(this.activeConversationId) === Number(id)) return;
      await this.openConversationAt({ conversationId: id });
    },

    closeJoinPreview() {
      this.joinPreview = { open: false, conversation: null, inviteCode: null, busy: false };
      this.normalizeMessengerUrl();
    },

    async confirmJoinPreview() {
      if (this.joinPreview.busy) return;
      this.joinPreview.busy = true;
      try {
        let conv = null;
        if (this.joinPreview.inviteCode) {
          conv = await joinByInvite(this.joinPreview.inviteCode);
        } else if (this.joinPreview.conversation?.username) {
          conv = await joinByUsername(this.joinPreview.conversation.username);
        } else if (this.joinPreview.conversation?.id) {
          conv = await joinConversation(this.joinPreview.conversation.id);
        }
        conv = conv?.id ? conv : (conv?.conversation || conv?.data || null);
        if (conv?.id) {
          this.$store.commit('messenger/CLEAR_OVERLAY_CONVERSATION');
          this.$store.commit('messenger/UPSERT_CONVERSATION', { ...conv, is_preview: false });
          await this.selectConversation(conv.id);
        }
        this.closeJoinPreview();
      } catch (e) {
        this.joinPreview.busy = false;
      }
    },

    async onJoinFromPreviewBar(conversation) {
      const id = conversation?.id;
      if (!id) return;
      try {
        let conv = null;
        if (this.pendingInviteCode) {
          conv = await joinByInvite(this.pendingInviteCode);
        } else if (conversation.username) {
          conv = await joinByUsername(conversation.username);
        } else {
          conv = await joinConversation(id);
        }
        conv = conv?.id ? conv : (conv?.conversation || conv?.data || null);
        this.pendingInviteCode = null;
        if (conv?.id) {
          this.$store.commit('messenger/CLEAR_OVERLAY_CONVERSATION');
          this.$store.commit('messenger/UPSERT_CONVERSATION', { ...conv, is_preview: false });
          await this.selectConversation(conv.id);
        }
      } catch (e) { /* noop */ }
    },

    async onOpenCommunityFromForward(chat) {
      if (!chat?.id) return;
      const existing = (this.conversations || []).find((c) => c.id === chat.id);
      if (existing) {
        await this.selectConversation(existing.id);
        return;
      }
      try {
        if (chat.username) {
          const preview = await previewJoin({ username: chat.username });
          const conv = preview?.conversation;
          if (!conv?.id) return;
          if (preview.is_member) {
            this.$store.commit('messenger/CLEAR_OVERLAY_CONVERSATION');
            this.$store.commit('messenger/UPSERT_CONVERSATION', { ...conv, is_preview: false });
            await this.selectConversation(conv.id);
            return;
          }
          if (preview.can_preview) {
            this.$store.commit('messenger/SET_OVERLAY_CONVERSATION', { ...conv, is_preview: true });
            this.$store.commit('messenger/REMOVE_FROM_SIDEBAR', conv.id);
            await this.selectConversation({ conversationId: conv.id, asPreview: true });
            return;
          }
          this.joinPreview = {
            open: true,
            conversation: conv,
            inviteCode: null,
            busy: false,
          };
        } else {
          const conv = await getConversation(chat.id);
          if (!conv?.id) return;
          if (conv.is_preview) {
            this.$store.commit('messenger/SET_OVERLAY_CONVERSATION', { ...conv, is_preview: true });
            this.$store.commit('messenger/REMOVE_FROM_SIDEBAR', conv.id);
            await this.selectConversation({ conversationId: conv.id, asPreview: true });
            return;
          }
          this.$store.commit('messenger/CLEAR_OVERLAY_CONVERSATION');
          this.$store.commit('messenger/UPSERT_CONVERSATION', conv);
          await this.selectConversation(conv.id);
        }
      } catch (e) { /* noop */ }
    },

    async onLeaveCommunity() {
      const c = this.activeConversation;
      if (!c) return;
      const isChannel = c.type === 'channel';
      this.openConfirmSheet({
        title: isChannel ? this.$t('messenger.leaveChannel') : this.$t('messenger.leaveGroup'),
        message: isChannel ? this.$t('messenger.leaveChannelConfirm') : this.$t('messenger.leaveGroupConfirm'),
        actions: [
          { label: isChannel ? this.$t('messenger.leaveChannel') : this.$t('messenger.leaveGroup'), value: 'leave', danger: true },
        ],
        kind: 'leave-community',
        payload: { id: c.id, isChannel },
      });
    },

    async doLeaveCommunity(payload) {
      if (!payload?.id) return;
      try {
        await leaveCommunity(payload.id);
        this.groupInfoOpen = false;
        this.profileOpen = false;
        this.$store.commit('messenger/REMOVE_CONVERSATION', payload.id);
      } catch (e) {
        const raw = e?.response?.data?.message || '';
        let message = raw || this.$t('messenger.saveError');
        if (/transfer ownership/i.test(raw)) {
          message = this.$t('messenger.ownerMustTransfer');
        } else if (/forbidden/i.test(raw)) {
          message = this.$t('messenger.leaveForbidden');
        }
        this.confirm = {
          open: true,
          title: this.$t('messenger.error'),
          message,
          actions: [{ label: this.$t('messenger.ok'), value: 'ok' }],
          kind: null,
          payload: null,
        };
      }
    },

    async onOpenMemberProfile(member) {
      if (!member?.user?.id) return;
      this.groupInfoOpen = false;
      await this.onOpenProfile(member.user);
    },

    // Open an existing conversation with a user (avatar / forwarded-author tap).
    // Does nothing when no matching conversation exists in the sidebar list.
    async onOpenChatWithUser(user) {
      if (!user?.id) return;
      let target = null;
      if (user.id === this.meId) {
        target = this.conversations.find((c) => c.type === 'saved');
      } else {
        target = this.conversations.find(
          (c) => c.type !== 'saved' && this.partnerIdOf(c) === user.id,
        );
      }
      if (!target) return;
      await this.onSelectConversation(target);
      this.$nextTick(() => this.$refs.sidebar?.scrollToConversation?.(target.id));
    },

    async onProfileMessage(profile) {
      this.profileOpen = false;
      if (!profile || !profile.id) return;
      await this.onStartChat(profile);
    },

    onProfileSearchInChat() {
      this.profileOpen = false;
      this.$nextTick(() => {
        this.$refs.chatArea?.enterSearchMode?.();
      });
    },

    async onBlock(target) {
      const id = (target && typeof target === 'object') ? target.id : target;
      if (!id) return;
      const name = (target && typeof target === 'object')
        ? (target.name || target.username || target.first_name || '')
        : (this.profileData?.name || this.profileData?.username || '');
      this.openConfirmSheet({
        title: name
          ? this.$t('messenger.blockConfirmNamed', { name })
          : this.$t('messenger.blockConfirm'),
        message: this.$t('messenger.blockConfirmHint'),
        actions: [{ label: this.$t('messenger.block'), value: 'ok', danger: true }],
        kind: 'block-user',
        payload: { id },
      });
    },

    async onUnblock(target) {
      const id = (target && typeof target === 'object') ? target.id : target;
      if (!id) return;
      try {
        await this.unblockUserAction(id);
      } catch (e) { /* noop */ }
    },

    async onUpdateContact({ contactId, data }) {
      await this.updateContactAction({ contactId, data });
    },

    onRenameContact(contact) {
      if (!contact?.id) return;
      this.renameSheet = {
        open: true,
        contactId: contact.id,
        value: contact.name || '',
        placeholder: contact.contact_user?.username || contact.name || '',
      };
    },

    async onRenameConfirm(name) {
      const { contactId } = this.renameSheet;
      this.renameSheet.open = false;
      if (!contactId) return;
      try {
        await this.updateContactAction({ contactId, data: { name: name || null } });
      } catch (e) { /* noop */ }
    },

    async onAddUserContact(user) {
      if (!user?.id) return;
      try {
        await this.addContactAction({ contactUserId: user.id, name: null });
      } catch (e) { /* noop */ }
    },

    async onSaveContactFromProfile({ contactId, userId, name }) {
      try {
        if (contactId) {
          await this.updateContactAction({ contactId, data: { name: name || null } });
        } else if (userId) {
          await this.addContactAction({ contactUserId: userId, name: name || null });
        }
      } catch (e) { /* noop */ }
    },

    backToList() {
      this.emojiSidebarOpen = false;
      this.profileOpen = false;
      this.groupInfoOpen = false;
      this.profileSavedOpen = false;
      const active = this.activeConversation;
      this.$store.commit('messenger/CLEAR_DRAFT_CONVERSATION');
      this.$store.commit('messenger/CLEAR_OVERLAY_CONVERSATION');
      this.pendingInviteCode = null;
      // Defensive: drop any leaked preview / empty private from the list.
      if (active?.id && active.id !== 'draft') {
        if (active.is_preview || (active.type === 'private' && !active.last_message && !active.last_message_at)) {
          this.$store.commit('messenger/REMOVE_CONVERSATION', active.id);
        }
      }
      this.$store.commit('messenger/SET_ACTIVE_CONVERSATION', null);
      this.syncChatUrl(null);
    },

    exit() {
      stopMediaPlayer();
      const go = () => {
        // Prefer history.back() so we return to the previous website page when possible.
        if (typeof window !== 'undefined' && window.history.length > 1) {
          try {
            this.$router.push('/');
            return;
          } catch { /* fall through */ }
        }
        this.$router.push('/');
      };
      if (this._navHistory) {
        this._navHistory.allowExit(go);
        this._navHistory = null;
        return;
      }
      go();
    },

    // -------- Notifications (browser-native only) --------
    onOpenConversationEvent(e) {
      const d = (e && e.detail) || {};
      if (d.conversationId == null) return;
      this.openConversationAt({ conversationId: d.conversationId, messageId: d.messageId });
    },
    async openConversationAt({ conversationId, messageId }) {
      let target = this.conversations.find((c) => Number(c.id) === Number(conversationId));
      if (!target) {
        await this.fetchConversations();
        target = this.conversations.find((c) => Number(c.id) === Number(conversationId));
      }
      if (!target) {
        try {
          const conv = await getConversation(conversationId);
          const c = conv?.id ? conv : conv?.data;
          if (c?.id) {
            this.$store.commit('messenger/UPSERT_CONVERSATION', c);
            target = c;
          }
        } catch (e) { /* invalid / unauthorized */ }
      }
      if (!target) {
        this.$store.commit('messenger/SET_ACTIVE_CONVERSATION', null);
        this.syncChatUrl(null);
        return;
      }
      await this.onSelectConversation(target);
      if (messageId != null) {
        this.$nextTick(() => this.$refs.chatArea?.scrollToMessage?.(messageId, { fallbackToBottom: true }));
      }
    },
    requestNotificationPermission() {
      // Browser notifications disabled — never prompt.
    },

    // -------- Zoom lock (messenger only) --------
    disableZoom() {
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        this._origViewport = meta.getAttribute('content');
        meta.setAttribute(
          'content',
          'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no',
        );
      }
      this._onGestureZoom = (e) => { e.preventDefault(); };
      document.addEventListener('gesturestart', this._onGestureZoom, { passive: false });
      document.addEventListener('gesturechange', this._onGestureZoom, { passive: false });
      this._onWheelZoom = (e) => { if (e.ctrlKey) e.preventDefault(); };
      window.addEventListener('wheel', this._onWheelZoom, { passive: false });
    },
    restoreZoom() {
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta && this._origViewport != null) meta.setAttribute('content', this._origViewport);
      if (this._onGestureZoom) {
        document.removeEventListener('gesturestart', this._onGestureZoom);
        document.removeEventListener('gesturechange', this._onGestureZoom);
      }
      if (this._onWheelZoom) window.removeEventListener('wheel', this._onWheelZoom);
    },

  },
};
</script>

<style>
/* Disable text selection everywhere inside the messenger, except editable inputs. */
.messenger-shell,
.messenger-shell * {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.messenger-shell input,
.messenger-shell textarea,
.messenger-shell [contenteditable="true"] {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
.messenger-shell:focus {
  outline: none;
}
/* Block pull-to-refresh / overscroll bounce while the messenger is open. */
html.messenger-no-refresh,
body.messenger-no-refresh {
  overscroll-behavior: none;
  overflow: hidden;
}
.messenger-shell {
  overscroll-behavior: none;
  overflow: hidden;
  /* Kill double-tap-to-zoom; pinch zoom is blocked via the viewport meta. */
  touch-action: manipulation;
}
/* Laptops (≤1920px): edge-to-edge shell. Keep column dividers (ResizeHandle 3px). */
@media (max-width: 1920.98px) {
  .messenger-shell {
    padding: 0 !important;
    align-items: stretch !important;
    justify-content: flex-start !important;
  }
  .messenger-shell .messenger-layout {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}

/* Flush columns — no margin/gap between sidebar, chat, profile. */
.messenger-layout {
  gap: 0;
}
.messenger-col {
  margin: 0;
  border: 0;
}
.messenger-shell .custom-scrollbar {
  overscroll-behavior: contain;
  /* Hide native/custom scrollbars everywhere in the shell; ChatArea messages
     keep their own scoped scrollbar styles. */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.messenger-shell .custom-scrollbar::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  display: none !important;
}
.messenger-shell .hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.messenger-shell .hide-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* Bio / description: single line, horizontal overflow, no visible scrollbar.
   Scroll with touch swipe or mouse wheel (mapped to X). */
.messenger-hline {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  resize: none;
  field-sizing: fixed;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior-x: contain;
  touch-action: pan-x;
}
.messenger-hline::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
/* Wallpaper stays fixed to the layout viewport on mobile so soft-keyboard /
   shell resize does not shift the chat background (Telegram-like). */
.messenger-bg-fixed {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
@media (max-width: 1023px) {
  .messenger-bg-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
.messenger-wallpaper-image-clip {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.messenger-wallpaper-image,
.messenger-wallpaper-dim,
.messenger-wallpaper-pattern,
.messenger-wallpaper-glow {
  position: absolute;
  inset: 0;
}
.messenger-wallpaper-glow.is-neon {
  animation: messenger-neon-drift 18s ease-in-out infinite alternate;
}
@keyframes messenger-neon-drift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(14px, -10px, 0) scale(1.05); }
}
.conn-fade-enter-active,
.conn-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.conn-fade-enter-from,
.conn-fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Profile side panel: soft, quick slide-in from the end side */
.side-panel-enter-active,
.side-panel-leave-active {
  transition: opacity var(--tg-dur-normal, 200ms) ease,
    transform var(--tg-dur-med, 240ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  will-change: transform, opacity;
}
.side-panel-enter-from,
.side-panel-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
[dir="rtl"] .side-panel-enter-from,
[dir="rtl"] .side-panel-leave-to {
  transform: translateX(-24px);
}
@media (max-width: 1023px) {
  .side-panel-enter-from,
  .side-panel-leave-to {
    transform: translateY(12px) scale(0.985);
  }
  [dir="rtl"] .side-panel-enter-from,
  [dir="rtl"] .side-panel-leave-to {
    transform: translateY(12px) scale(0.985);
  }
}

/* Multi-forward success: small glass toast at the bottom of the shell */
.fwd-glass-toast {
  position: absolute;
  z-index: 90;
  left: 50%;
  bottom: max(18px, env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: min(92vw, 360px);
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  -webkit-backdrop-filter: blur(18px) saturate(1.25);
  backdrop-filter: blur(18px) saturate(1.25);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  pointer-events: none;
}

.dark .fwd-glass-toast {
  background: rgba(30, 44, 58, 0.78);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.fwd-glass-toast__text {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .fwd-glass-toast__text {
  color: #f3f4f6;
}

.fwd-glass-toast__timer {
  flex-shrink: 0;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  background: rgba(51, 144, 236, 0.15);
  color: #3390ec;
}

.dark .fwd-glass-toast__timer {
  background: rgba(106, 178, 242, 0.18);
  color: #6ab2f2;
}

.fwd-glass-toast-enter-active,
.fwd-glass-toast-leave-active {
  transition: opacity var(--tg-dur-normal, 200ms) ease,
    transform var(--tg-dur-med, 240ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

.fwd-glass-toast-enter-from,
.fwd-glass-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(14px) scale(0.96);
}
</style>
