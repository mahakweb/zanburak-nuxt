<template>
  <BottomSheetDrawer
    :model-value="open"
    :initial-height="0.55"
    :min-height="0.3"
    :max-height="0.9"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="sheetPanelClass"
    content-class="px-0 pb-6 flex flex-col min-h-0"
    :backdrop-class="sheetBackdropClass"
    @update:modelValue="(v) => { if (!v) $emit('close'); }"
    @close="$emit('close')"
  >
    <div class="px-4 pb-2.5 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
      <h3 class="text-[15px] font-bold text-gray-800 dark:text-gray-100">{{ $t('messenger.blockedUsers') }}</h3>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar min-h-0">
      <MessengerSkeleton v-if="loading" variant="blocked" :count="5" />
      <div v-else-if="!blockedContacts.length" class="px-4 py-12 text-center text-sm text-gray-400">
        {{ $t('messenger.noBlockedUsers') }}
      </div>
      <div
        v-for="ct in blockedContacts"
        :key="ct.id"
        class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition"
      >
        <img v-if="ct.contact_user && ct.contact_user.profile_pic" :src="ct.contact_user.profile_pic" class="w-11 h-11 rounded-full object-cover flex-shrink-0" />
        <div v-else class="w-11 h-11 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{{ initials(ct) }}</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{{ ct.name }}</div>
          <div class="text-xs text-gray-400 truncate">@{{ ct.contact_user && ct.contact_user.username }}</div>
        </div>
        <button
          @click="unblock(ct)"
          class="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20 transition flex-shrink-0"
        >
          {{ $t('messenger.unblock') }}
        </button>
      </div>
    </div>
  </BottomSheetDrawer>
</template>

<script>
import { mapState } from "@/composables/useStore";
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import MessengerSkeleton from './MessengerSkeleton.vue';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';
import { avatarInitials } from './avatarInitials';

export default {
  components: { BottomSheetDrawer, MessengerSkeleton },
  props: { open: { type: Boolean, default: false } },
  emits: ['close'],
  data() {
    return { loading: false };
  },
  computed: {
    sheetPanelClass() { return MESSENGER_SHEET_PANEL; },
    sheetBackdropClass() { return MESSENGER_SHEET_BACKDROP; },
    ...mapState('messenger', ['blockedContacts']),
  },
  watch: {
    open(val) {
      if (val) this.load();
    },
  },
  methods: {
    async load() {
      this.loading = true;
      try {
        await this.$store.dispatch('messenger/fetchBlocked');
      } finally {
        this.loading = false;
      }
    },
    initials(ct) {
      const u = ct.contact_user || {};
      return avatarInitials({ ...u, name: ct.name || u.name });
    },
    async unblock(ct) {
      const uid = ct.contact_user?.id;
      if (!uid) return;
      await this.$store.dispatch('messenger/unblockUserAction', uid);
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
