<template>
  <div class="flex flex-col h-full bg-[#f4f4f5] dark:bg-[#0e1621]">
    <!-- Header: back · title · search -->
    <div class="flex items-center gap-1 px-2 h-14 border-b border-black/[0.06] dark:border-white/5 flex-shrink-0 bg-white dark:bg-[#17212b]">
      <button
        type="button"
        class="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] transition active:scale-90 flex-shrink-0"
        :title="$t('messenger.back')"
        @click="$emit('close')"
      >
        <svg class="w-5 h-5 ltr:rotate-180" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 12h16m0 0l-6 6m6-6l-6-6" />
        </svg>
      </button>
      <h2 class="flex-1 text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate">
        {{ searchMode ? $t('messenger.searchContacts') : $t('messenger.forwardTo') }}
      </h2>
      <button
        v-if="!searchMode"
        type="button"
        class="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] transition flex-shrink-0"
        :title="$t('messenger.searchContacts')"
        @click="openSearch"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      <span v-else class="w-9 flex-shrink-0" />
    </div>

    <!-- Contact search -->
    <div v-if="searchMode" class="px-3 py-2 flex-shrink-0 bg-white dark:bg-[#17212b] border-b border-black/[0.06] dark:border-white/5">
      <div class="relative">
        <span class="absolute inset-y-0 rtl:right-3 ltr:left-3 flex items-center text-[#a2acb4]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </span>
        <input
          ref="searchInput"
          v-model="query"
          v-no-autofill="'strong'"
          type="search"
          name="forward-search"
          inputmode="search"
          enterkeyhint="search"
          :placeholder="$t('messenger.searchContacts')"
          class="w-full rtl:pr-9 ltr:pl-9 pe-9 py-2 text-[13px] rounded-full bg-white dark:bg-[#17212b] shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06] border-0 focus:ring-2 focus:ring-[#3390ec]/30 focus:outline-none text-gray-800 dark:text-gray-100 placeholder:text-[#a2acb4]"
        />
        <button
          v-if="query"
          type="button"
          class="absolute inset-y-0 rtl:left-2 ltr:right-2 flex items-center text-[#a2acb4] hover:text-gray-600"
          @click="query = ''"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div
      class="flex-1 overflow-y-auto custom-scrollbar min-h-0"
      :class="{ 'pointer-events-none': !picksEnabled, 'pb-20': selectedCount > 0 }"
    >
      <!-- Contacts search results -->
      <template v-if="searchMode">
        <div class="pt-3 pb-5">
          <div class="tg-card mx-3 overflow-hidden">
            <div v-if="!filteredContacts.length" class="px-4 py-10 text-center text-[14px] text-[#a2acb4]">
              {{ query ? $t('messenger.noResults') : $t('messenger.noContacts') }}
            </div>
            <div
              v-for="(ct, idx) in filteredContacts"
              :key="'ct' + ct.id"
              role="button"
              tabindex="0"
              :class="[
                'w-full flex items-center gap-2.5 py-1.5 ps-3 pe-3 hover:bg-black/[0.04] dark:hover:bg-white/5 transition cursor-pointer select-none',
                idx < filteredContacts.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '',
                isSelected(userKey(ct.contact_user)) ? 'bg-[#3390ec]/8 dark:bg-[#3390ec]/15' : '',
              ]"
              @click="toggleUser(ct.contact_user)"
              @keydown.enter.prevent="toggleUser(ct.contact_user)"
            >
              <span
                class="fwd-check"
                :class="{ 'is-on': isSelected(userKey(ct.contact_user)) }"
                role="checkbox"
                :aria-checked="isSelected(userKey(ct.contact_user))"
                @click.stop="onCheckUser(ct.contact_user, $event)"
              >
                <svg v-if="isSelected(userKey(ct.contact_user))" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <MessengerAvatar :user="ct.contact_user" :name="ct.name" size="sm" :online="!!ct.contact_user?.is_online" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1">
                  <span class="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate leading-snug">{{ ct.name }}</span>
                  <svg v-if="ct.is_favorite" class="w-2.5 h-2.5 text-[#3390ec] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <div class="text-[12px] truncate leading-snug" :class="ct.contact_user?.is_online ? 'text-[#3390ec]' : 'text-[#a2acb4]'">
                  {{ presenceLabel(ct.contact_user) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Conversation list -->
      <template v-else>
        <div class="pt-3 pb-4">
          <div v-if="!listConversations.length" class="tg-card mx-3 px-4 py-12 text-center text-[13px] text-[#a2acb4]">
            {{ $t('messenger.noConversations') }}
          </div>
          <div v-else class="tg-card mx-3 overflow-hidden">
            <button
              v-for="(c, idx) in listConversations"
              :key="'c' + c.id"
              type="button"
              :class="[
                'conv-row',
                idx < listConversations.length - 1 ? 'has-divider' : '',
                isSelected(convKey(c)) ? 'is-selected' : '',
              ]"
              @click="toggleConversationRow(c)"
            >
              <span
                class="fwd-check"
                :class="{ 'is-on': isSelected(convKey(c)) }"
                role="checkbox"
                :aria-checked="isSelected(convKey(c))"
                @click.stop="onCheckConversation(c, $event)"
              >
                <svg v-if="isSelected(convKey(c))" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <MessengerAvatar
                :user="convUser(c)"
                size="md"
                :saved="isSaved(c)"
                :online="showOnline(c)"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1 min-w-0">
                    <svg
                      v-if="c.type === 'group'"
                      class="conv-row-type"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                    <svg
                      v-else-if="c.type === 'channel'"
                      class="conv-row-type"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      aria-hidden="true"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 11l18-5v12L3 13v-2z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.6 16.8a3 3 0 11-5.8-1.6" />
                    </svg>
                    <span class="conv-row-name">{{ convName(c) }}</span>
                    <svg
                      v-if="isMuted(c)"
                      class="conv-row-mute"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M13.73 21a2 2 0 01-3.46 0M18.63 13A17.89 17.89 0 0118 8M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14M18 8a6 6 0 00-9.33-5M1 1l22 22" />
                    </svg>
                  </div>
                  <span class="conv-row-time">{{ lastTime(c) }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 mt-0.5">
                  <span
                    class="conv-row-preview flex-1"
                    :class="{ 'is-typing': !!typingLabelFor(c), 'is-draft': hasDraftPreview(c) }"
                  >
                    <span v-if="typingLabelFor(c)" class="truncate conv-typing-text">
                      <span class="conv-typing-label">{{ typingLabelFor(c) }}</span>
                      <span class="typing-dots" aria-hidden="true">
                        <span class="typing-dot" />
                        <span class="typing-dot" />
                        <span class="typing-dot" />
                      </span>
                    </span>
                    <template v-else>
                      <span
                        v-if="lastIsMine(c) && !hasDraftPreview(c)"
                        class="conv-row-ticks flex-shrink-0 leading-none"
                        :class="{
                          'is-read': lastRead(c),
                          'is-delivered': lastDelivered(c) && !lastRead(c),
                        }"
                      >
                        <PendingClockIcon
                          v-if="lastPending(c)"
                          icon-class="w-3.5 h-3.5 opacity-80"
                        />
                        <svg v-else-if="lastRead(c)" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                        </svg>
                        <svg v-else-if="lastDelivered(c)" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                        </svg>
                        <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                        </svg>
                      </span>
                      <span class="truncate">{{ lastSnippet(c) }}</span>
                    </template>
                  </span>
                  <span
                    v-if="c.unread_count > 0"
                    class="conv-row-badge"
                    :class="{ 'is-muted': isMuted(c) }"
                  >
                    {{ unreadLabel(c.unread_count) }}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Multi-select send bar -->
    <transition name="fwd-send-bar">
      <div
        v-if="selectedCount > 0"
        class="fwd-send-bar flex-shrink-0"
      >
        <span class="fwd-send-bar__count">{{ $t('messenger.selectedCount', { count: selectedCount }) }}</span>
        <button
          type="button"
          class="fwd-send-bar__btn"
          :disabled="sending"
          :title="$t('messenger.send')"
          @click="confirmSelection"
        >
          <svg class="w-5 h-5 rtl:-scale-x-100" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "@/composables/useStore";
import MessengerAvatar from './MessengerAvatar.vue';
import PendingClockIcon from './PendingClockIcon.vue';
import { peerDisplayName, conversationPartner as resolveConversationPartner } from '@/utils/messengerPeerName';
import { formatPresenceText } from '@/utils/messengerPresence';
import { stripFormatMarkers } from './messageFormat';
import { formatTypingLabel } from './typingHelpers';
import { shapeUiDigits } from './appearance';

export default {
  name: 'ForwardPickerPanel',
  components: { MessengerAvatar, PendingClockIcon },
  props: {
    conversations: { type: Array, default: () => [] },
    contacts: { type: Array, default: () => [] },
    meId: { type: Number, default: null },
  },
  emits: ['close', 'pick-conversation', 'pick-user', 'pick-saved', 'send-targets'],
  data() {
    return {
      searchMode: false,
      query: '',
      // Ignore leftover tap from the gesture that opened this panel (menu / toolbar).
      picksEnabled: false,
      // Map key → target payload for multi-select.
      selectedMap: {},
      sending: false,
    };
  },
  computed: {
    ...mapGetters('messenger', ['typingByConversation', 'draftForConversation']),
    listConversations() {
      const raw = (this.conversations || []).filter((c) => c && c.id !== 'draft');
      const saved = raw.find((c) => c.type === 'saved');
      const rest = raw.filter((c) => c.type !== 'saved');
      // Telegram-style: Saved Messages is always the first forward target,
      // even when swipe-hidden / not yet opened (synthetic stub until pick).
      const pinned = saved || {
        id: 'saved-stub',
        type: 'saved',
        users: [],
        last_message: null,
        unread_count: 0,
      };
      return [pinned, ...rest];
    },
    filteredContacts() {
      const q = this.query.trim().toLowerCase();
      const list = this.contacts || [];
      if (!q) return list;
      return list.filter((ct) => {
        const name = (ct.name || '').toLowerCase();
        const u = ct.contact_user || {};
        const uname = (u.username || '').toLowerCase();
        const full = `${u.first_name || ''} ${u.last_name || ''}`.trim().toLowerCase();
        return name.includes(q) || uname.includes(q) || full.includes(q);
      });
    },
    selectedCount() {
      return Object.keys(this.selectedMap).length;
    },
    selectedTargets() {
      return Object.values(this.selectedMap);
    },
    typingLabelMap() {
      const by = this.typingByConversation || {};
      const fallback = this.$t('messenger.user');
      const out = {};
      this.listConversations.forEach((c) => {
        if (!c?.id) return;
        const users = by[c.id] || by[String(c.id)];
        if (!users?.length) return;
        const label = formatTypingLabel(this.$t.bind(this), users, {
          privateChat: !this.isCommunity(c) && !this.isSaved(c),
          fallbackName: fallback,
        });
        if (label) out[String(c.id)] = label;
      });
      return out;
    },
  },
  mounted() {
    this.armPicks();
  },
  beforeUnmount() {
    this.clearArmTimer();
  },
  methods: {
    presenceLabel(user) {
      return formatPresenceText(user, (k, p) => this.$t(k, p), {
        locale: this.$i18n?.locale === 'fa' ? 'fa-IR' : 'en-US',
      });
    },
    /** Block picks briefly so the opening gesture cannot auto-select a chat. */
    armPicks() {
      this.clearArmTimer();
      this.picksEnabled = false;
      this.selectedMap = {};
      this.sending = false;
      this._armTimer = setTimeout(() => {
        this.picksEnabled = true;
        this._armTimer = null;
      }, 400);
    },
    clearArmTimer() {
      if (this._armTimer) {
        clearTimeout(this._armTimer);
        this._armTimer = null;
      }
    },
    openSearch() {
      this.searchMode = true;
      this.$nextTick(() => this.$refs.searchInput?.focus());
    },
    handleBack() {
      if (this.searchMode) {
        this.searchMode = false;
        this.query = '';
        return true;
      }
      return false;
    },

    isSaved(c) {
      return c?.type === 'saved';
    },
    isCommunity(c) {
      return c?.type === 'group' || c?.type === 'channel';
    },
    showOnline(c) {
      if (!c || this.isSaved(c) || this.isCommunity(c)) return false;
      return !!this.partnerOf(c)?.is_online;
    },
    typingLabelFor(c) {
      if (!c?.id) return null;
      return this.typingLabelMap[String(c.id)] || null;
    },
    hasDraftPreview(c) {
      if (!c?.id || this.typingLabelFor(c)) return false;
      return !!this.draftForConversation(c.id)?.trim();
    },
    convUser(c) {
      if (this.isSaved(c)) return c.users?.find((u) => u.id === this.meId) || {};
      if (this.isCommunity(c)) {
        return { id: c.id, first_name: c.title, profile_pic: c.avatar, username: c.username };
      }
      return this.partnerOf(c);
    },
    convName(c) {
      if (this.isSaved(c)) return this.$t('messenger.savedMessages');
      if (this.isCommunity(c)) return c.title || (c.type === 'channel' ? this.$t('messenger.channel') : this.$t('messenger.group'));
      return this.partnerName(this.partnerOf(c));
    },
    partnerOf(c) {
      return resolveConversationPartner(c, this.meId) || {};
    },
    isMuted(c) {
      return !!(c.pivot && (c.pivot.muted_at || (c.pivot.notification_mode === 'mute')));
    },
    unreadLabel(count) {
      const n = Number(count) || 0;
      return shapeUiDigits(n > 99 ? '99+' : String(n), 'sidebar');
    },
    partnerName(u) {
      if (!u || !u.id) return '—';
      const nick = (this.contacts || []).find((ct) => Number(ct.contact_user?.id) === Number(u.id))?.name;
      return peerDisplayName(u, nick, this.$t('messenger.user'));
    },
    lastSnippet(c) {
      const draft = this.draftForConversation(c.id);
      if (draft?.trim() && !this.typingLabelFor(c)) {
        const preview = stripFormatMarkers(draft).trim();
        const snippet = preview.length > 32 ? `${preview.slice(0, 32)}…` : preview;
        return `${this.$t('messenger.draft')}: ${snippet}`;
      }
      const msg = c.last_message;
      if (!msg) return this.$t('messenger.startConversation');
      if (msg.type === 'system') {
        const text = this.systemSnippet(c, msg);
        return text.length > 38 ? `${text.slice(0, 38)}…` : text;
      }
      if (msg.type === 'location') {
        return this.$t('messenger.location');
      }
      if (['photo', 'video', 'voice', 'audio'].includes(msg.type)) {
        const lockedCap = !!(
          msg.is_encrypted
          && msg.body
          && msg.body !== '🔒 پیام رمزنگاری‌شده'
          && /^[A-Za-z0-9+/=\s]{24,}$/.test(String(msg.body).trim())
        );
        const cap = (!msg.is_encrypted || msg._e2e_decrypted) && !lockedCap
          ? stripFormatMarkers(msg.body || '').trim()
          : '';
        if (cap && cap !== '🔒 پیام رمزنگاری‌شده') {
          return cap.length > 38 ? `${cap.slice(0, 38)}…` : cap;
        }
        if (msg.meta?.album_id) return this.$t('messenger.mediaAlbum');
        if (msg.type === 'photo') return this.$t('messenger.mediaPhoto');
        if (msg.type === 'video') return this.$t('messenger.mediaVideo');
        if (msg.type === 'voice') return this.$t('messenger.mediaVoice');
        return this.$t('messenger.mediaAudio');
      }
      if (msg.type === 'file') {
        return msg.meta?.name || this.$t('messenger.mediaFile');
      }
      const locked = !!(
        msg._e2e_locked
        || msg._decryptFailed
        || (msg.is_encrypted && !msg._e2e_decrypted)
        || msg.body === '🔒 پیام رمزنگاری‌شده'
        || (msg.is_encrypted && msg.body && /^[A-Za-z0-9+/=\s]{24,}$/.test(String(msg.body).trim()))
      );
      if (locked) return '…';
      const body = stripFormatMarkers(msg.body || '');
      return body.length > 38 ? `${body.slice(0, 38)}…` : body;
    },
    systemSnippet(c, msg) {
      try {
        const meta = typeof msg.body === 'string' ? JSON.parse(msg.body) : msg.body;
        const name = meta?.target_name || meta?.actor_name || '';
        const event = meta?.event;
        if (!event) return this.$t('messenger.systemMessage');

        let key = `messenger.sys_${event}`;
        if (event === 'created') {
          key = c?.type === 'channel'
            ? 'messenger.sys_channel_created'
            : 'messenger.sys_group_created';
        } else if (event === 'group_photo_changed' && c?.type === 'channel') {
          key = 'messenger.sys_channel_photo_changed';
        } else if (event === 'group_name_changed' && c?.type === 'channel') {
          key = 'messenger.sys_channel_name_changed';
        } else if (event === 'user_joined' && c?.type === 'channel') {
          key = 'messenger.sys_channel_user_joined';
        } else if (event === 'user_left' && c?.type === 'channel') {
          key = 'messenger.sys_channel_user_left';
        }

        const t = this.$t(key, { name: name || '…' });
        if (t !== key) return t;
      } catch (e) { /* fall through */ }
      return this.$t('messenger.systemMessage');
    },
    lastTime(c) {
      const t = c.last_message_at || c.last_message?.created_at;
      if (!t) return '';
      const d = new Date(t);
      if (Number.isNaN(d.getTime())) return '';
      const now = new Date();
      const locale = (this.$i18n && this.$i18n.locale === 'en') ? 'en-US' : 'fa-IR';
      if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
      }
      const opts = { month: 'long', day: 'numeric' };
      if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric';
      return d.toLocaleDateString(locale, opts);
    },
    lastIsMine(c) {
      const msg = c.last_message;
      if (!msg || msg.type === 'system') return false;
      return !!(this.meId && msg.user_id === this.meId);
    },
    lastPending(c) {
      const msg = c.last_message;
      return !!(msg && msg.pending && !msg.failed);
    },
    lastDelivered(c) {
      const msg = c.last_message;
      return !!(msg && (msg.delivered_at || msg.read_at));
    },
    lastRead(c) {
      return !!c.last_message?.read_at;
    },

    convKey(c) {
      if (this.isSaved(c)) return 'saved';
      return `c:${c.id}`;
    },
    userKey(user) {
      return `u:${user?.id}`;
    },
    isSelected(key) {
      return !!this.selectedMap[key];
    },
    toggleTarget(key, target) {
      if (!this.picksEnabled || !key) return;
      if (this.selectedMap[key]) {
        const next = { ...this.selectedMap };
        delete next[key];
        this.selectedMap = next;
        return;
      }
      this.selectedMap = { ...this.selectedMap, [key]: target };
    },
    toggleConversationRow(c) {
      if (!this.picksEnabled || !c) return;
      const key = this.convKey(c);
      // Empty selection + tap → immediate single-recipient flow (open chat compose).
      if (!this.selectedCount) {
        if (this.isSaved(c)) {
          this.$emit('pick-saved');
          return;
        }
        this.$emit('pick-conversation', { conversationId: c.id });
        return;
      }
      // Already selecting → toggle this row for multi-send.
      if (this.isSaved(c)) {
        this.toggleTarget('saved', { type: 'saved' });
        return;
      }
      this.toggleTarget(key, { type: 'conversation', conversationId: c.id });
    },
    toggleUser(user) {
      if (!this.picksEnabled || !user?.id) return;
      const key = this.userKey(user);
      if (!this.selectedCount) {
        this.$emit('pick-user', { user });
        return;
      }
      this.toggleTarget(key, { type: 'user', user });
    },
    /** Explicit checkbox / re-tap path to enter multi-select without navigating. */
    armSelect(key, target) {
      if (!this.picksEnabled || !key) return;
      this.toggleTarget(key, target);
    },
    onCheckConversation(c, e) {
      e?.stopPropagation?.();
      e?.preventDefault?.();
      if (!this.picksEnabled || !c) return;
      if (this.isSaved(c)) {
        this.armSelect('saved', { type: 'saved' });
        return;
      }
      this.armSelect(`c:${c.id}`, { type: 'conversation', conversationId: c.id });
    },
    onCheckUser(user, e) {
      e?.stopPropagation?.();
      e?.preventDefault?.();
      if (!this.picksEnabled || !user?.id) return;
      this.armSelect(`u:${user.id}`, { type: 'user', user });
    },
    confirmSelection() {
      if (!this.picksEnabled || this.sending || !this.selectedCount) return;
      const targets = this.selectedTargets;
      // Single recipient → existing chat-compose forward flow.
      if (targets.length === 1) {
        const t = targets[0];
        if (t.type === 'saved') this.$emit('pick-saved');
        else if (t.type === 'user') this.$emit('pick-user', { user: t.user });
        else this.$emit('pick-conversation', { conversationId: t.conversationId });
        return;
      }
      // Multiple recipients → send in place (no navigation).
      this.sending = true;
      this.$emit('send-targets', { targets });
    },
  },
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.conv-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 12px;
  text-align: start;
  transition: background-color 0.12s ease;
  cursor: pointer;
  user-select: none;
}

.conv-row.has-divider {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .conv-row.has-divider {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.conv-row:hover {
  background: rgba(0, 0, 0, 0.035);
}

.dark .conv-row:hover {
  background: rgba(255, 255, 255, 0.045);
}

.conv-row.is-selected {
  background: rgba(51, 144, 236, 0.08);
}

.dark .conv-row.is-selected {
  background: rgba(51, 144, 236, 0.15);
}

.fwd-check {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #a2acb4;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: background-color 0.12s ease, border-color 0.12s ease;
  /* Larger hit target without shifting layout */
  position: relative;
}

.fwd-check::before {
  content: '';
  position: absolute;
  inset: -10px;
}

.fwd-check.is-on {
  background: #3390ec;
  border-color: #3390ec;
}

.tg-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.dark .tg-card {
  background: #17212b;
}

.conv-row-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .conv-row-name {
  color: #f3f4f6;
}

.conv-row-type,
.conv-row-mute {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  color: #a2acb4;
}

.conv-row-time {
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1.2;
  color: #707579;
}

.conv-row-preview {
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
  flex: 1 1 auto;
  font-size: 13px;
  line-height: 1.3;
  color: #707579;
}

.dark .conv-row-preview {
  color: #9ca3af;
}

.conv-row-preview.is-typing {
  color: #3390ec;
  font-weight: 500;
}

.conv-row-preview.is-draft {
  color: #e53935;
}

.dark .conv-row-preview.is-draft {
  color: #ff6b6b;
}

.dark .conv-row-preview.is-typing {
  color: #6ab2f2;
}

.conv-typing-text {
  letter-spacing: 0.01em;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 100%;
  line-height: 1;
}
.conv-typing-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1;
}
.typing-dots {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 2.5px;
  height: 9px;
}
.typing-dot {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.45;
  animation: typing-bounce 1.05s ease-in-out infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.16s; }
.typing-dot:nth-child(3) { animation-delay: 0.32s; }
@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-3px); opacity: 1; }
}

.conv-row-ticks {
  color: #707579;
}

.conv-row-ticks.is-delivered {
  color: #707579;
}

.conv-row-ticks.is-read {
  color: #4fc3f7;
}

.conv-row-badge {
  flex: 0 0 auto;
  flex-shrink: 0;
  box-sizing: border-box;
  height: 22px;
  min-width: 22px;
  padding: 0 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0;
  white-space: nowrap;
  border-radius: 999px;
  background: #3390ec;
  color: #fff;
  transform: none;
}

.conv-row-badge.is-muted {
  background: #8e959a;
  color: #fff;
}

.dark .conv-row-badge.is-muted {
  background: #6b7280;
  color: #f3f4f6;
}

.fwd-send-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px max(10px, env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.82);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  backdrop-filter: blur(16px) saturate(1.2);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .fwd-send-bar {
  background: rgba(23, 33, 43, 0.88);
  border-top-color: rgba(255, 255, 255, 0.08);
}

.fwd-send-bar__count {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.dark .fwd-send-bar__count {
  color: #f3f4f6;
}

.fwd-send-bar__btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #3390ec;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(51, 144, 236, 0.35);
  transition: transform 0.12s ease, opacity 0.12s ease;
}

.fwd-send-bar__btn:active {
  transform: scale(0.94);
}

.fwd-send-bar__btn:disabled {
  opacity: 0.55;
}

.fwd-send-bar-enter-active,
.fwd-send-bar-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.fwd-send-bar-enter-from,
.fwd-send-bar-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
