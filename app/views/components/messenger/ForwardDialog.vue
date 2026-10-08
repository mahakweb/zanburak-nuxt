<template>
  <BottomSheetDrawer
    :model-value="open"
    :initial-height="0.7"
    :min-height="0.3"
    :max-height="0.92"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="sheetPanelClass"
    content-class="flex flex-col min-h-0 px-0 pb-2"
    :backdrop-class="sheetBackdropClass"
    @update:modelValue="(v) => { if (!v) $emit('close'); }"
    @close="$emit('close')"
  >
    <div class="flex items-center gap-3 px-4 pb-2.5 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
      <h3 class="text-[15px] font-bold text-gray-800 dark:text-gray-100">{{ $t('messenger.forwardTo') }}</h3>
      <span class="ms-auto text-[11px] text-gray-400 tabular-nums">{{ count }}</span>
    </div>

    <!-- Forward without quote toggle -->
    <label class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5 cursor-pointer flex-shrink-0">
      <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.forwardWithoutQuote') }}</span>
      <input type="checkbox" v-model="dropAuthor" class="toggle toggle-warning toggle-sm" />
    </label>

    <div class="px-3 py-2 flex-shrink-0">
      <input
        v-model="query"
        v-no-autofill="'strong'"
        type="search"
        name="messenger-forward-search"
        :placeholder="$t('messenger.searchPlaceholder')"
        class="w-full px-3 py-2 text-sm rounded-full bg-gray-100 dark:bg-white/5 border-0 focus:ring-2 focus:ring-[#3390ec] focus:outline-none text-gray-800 dark:text-gray-100"
      />
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar min-h-0">
      <!-- Saved Messages is always the first forward target. -->
      <button
        v-if="!query"
        @click="pickSaved"
        class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition text-start border-b border-gray-100 dark:border-white/5"
      >
        <span class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#3390ec] to-[#5eb3f6] text-white flex-shrink-0">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 3a2 2 0 00-2 2v15.382a.5.5 0 00.724.447L12 17.5l7.276 3.329A.5.5 0 0020 20.382V5a2 2 0 00-2-2H6z"/></svg>
        </span>
        <span class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{{ $t('messenger.savedMessages') }}</span>
      </button>

      <button
        v-for="c in filteredConversations"
        :key="'c' + c.id"
        @click="pickConversation(c.id)"
        class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition text-start"
      >
        <MessengerAvatar :user="partnerOf(c)" size="sm" />
        <span class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{{ partnerName(partnerOf(c)) }}</span>
      </button>

      <template v-if="filteredContacts.length">
        <p class="px-4 pt-2 pb-1 text-[11px] font-bold text-gray-400 uppercase">{{ $t('messenger.contacts') }}</p>
        <button
          v-for="ct in filteredContacts"
          :key="'ct' + ct.id"
          @click="pickUser(ct.contact_user)"
          class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition text-start"
        >
          <MessengerAvatar :user="ct.contact_user" size="sm" />
          <span class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{{ ct.name }}</span>
        </button>
      </template>

      <div v-if="!filteredConversations.length && !filteredContacts.length" class="px-4 py-10 text-center text-sm text-gray-400">
        {{ $t('messenger.noResults') }}
      </div>
    </div>
  </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import MessengerAvatar from './MessengerAvatar.vue';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';
import { peerDisplayName } from '@/utils/messengerPeerName';

export default {
  components: { BottomSheetDrawer, MessengerAvatar },
  props: {
    open: { type: Boolean, default: false },
    conversations: { type: Array, default: () => [] },
    contacts: { type: Array, default: () => [] },
    meId: { type: Number, default: null },
    count: { type: String, default: '' },
    initialDropAuthor: { type: Boolean, default: false },
  },
  emits: ['close', 'pick-conversation', 'pick-user', 'pick-saved'],
  data() {
    return { query: '', dropAuthor: false };
  },
  computed: {
    sheetPanelClass() { return MESSENGER_SHEET_PANEL; },
    sheetBackdropClass() { return MESSENGER_SHEET_BACKDROP; },
    filteredConversations() {
      const list = this.conversations.filter((c) => c.type !== 'saved');
      const q = this.query.trim().toLowerCase();
      if (!q) return list;
      return list.filter((c) => this.partnerName(this.partnerOf(c)).toLowerCase().includes(q));
    },
    filteredContacts() {
      const q = this.query.trim().toLowerCase();
      if (!q) return this.contacts;
      return this.contacts.filter((ct) => (ct.name || '').toLowerCase().includes(q));
    },
  },
  watch: {
    open(val) {
      if (val) {
        this.dropAuthor = this.initialDropAuthor;
      } else {
        this.query = '';
      }
    },
  },
  methods: {
    partnerOf(c) {
      return c.partner || c.users?.find((u) => u.id !== this.meId) || {};
    },
    partnerName(u) {
      if (!u || !u.id) return '—';
      const nick = (this.contacts || []).find((ct) => Number(ct.contact_user?.id) === Number(u.id))?.name;
      return peerDisplayName(u, nick) || '—';
    },
    pickConversation(id) {
      this.$emit('pick-conversation', { conversationId: id, dropAuthor: this.dropAuthor });
    },
    pickSaved() {
      this.$emit('pick-saved', { dropAuthor: this.dropAuthor });
    },
    pickUser(user) {
      this.$emit('pick-user', { user, dropAuthor: this.dropAuthor });
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
</style>
