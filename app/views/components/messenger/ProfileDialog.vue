<template>
  <BottomSheetDrawer
    :model-value="open"
    :initial-height="0.6"
    :min-height="0.3"
    :max-height="0.92"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="sheetPanelClass"
    content-class="px-0 pb-6 overflow-auto custom-scrollbar"
    :backdrop-class="sheetBackdropClass"
    @update:modelValue="(v) => { if (!v) $emit('close'); }"
    @close="$emit('close')"
  >
    <!-- Cover -->
    <div class="relative h-28 -mt-1 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl mx-3 overflow-hidden">
      <img v-if="profile && profile.cover_pic" :src="profile.cover_pic" class="absolute inset-0 w-full h-full object-cover" />
    </div>

    <div class="px-5 -mt-12">
      <div class="relative inline-block">
        <img v-if="profile && profile.profile_pic" :src="profile.profile_pic" class="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-[#17212b]" />
        <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-2xl font-bold text-white ring-4 ring-white dark:ring-[#17212b]">{{ initials }}</div>
        <span v-if="profile && profile.is_online" class="absolute bottom-2 rtl:left-2 ltr:right-2 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#17212b] rounded-full"></span>
      </div>

      <h3 class="mt-3 text-xl font-extrabold text-gray-800 dark:text-gray-100">{{ fullName }}</h3>
      <p class="text-sm text-gray-400">@{{ profile && profile.username }}</p>
      <p class="text-xs mt-0.5" :class="profile && profile.is_online ? 'text-green-500' : 'text-gray-400'">
        {{ presenceText }}
      </p>

      <div v-if="profile && profile.bio" class="mt-4">
        <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">{{ $t('messenger.bio') }}</p>
        <p class="text-sm text-gray-700 dark:text-gray-200 break-words">{{ profile.bio }}</p>
      </div>

      <!-- Contact info (respecting privacy) -->
      <div v-if="profile && (profile.mobile || profile.email)" class="mt-4 space-y-2">
        <div v-if="profile.mobile" class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
          <svg class="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          <div class="min-w-0">
            <div class="text-[11px] text-gray-400">{{ $t('messenger.phone') }}</div>
            <div class="text-sm text-gray-700 dark:text-gray-200 truncate" dir="ltr">{{ profile.mobile }}</div>
          </div>
        </div>
        <div v-if="profile.email" class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
          <svg class="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <div class="min-w-0">
            <div class="text-[11px] text-gray-400">{{ $t('messenger.email') }}</div>
            <div class="text-sm text-gray-700 dark:text-gray-200 truncate" dir="ltr">{{ profile.email }}</div>
          </div>
        </div>
      </div>

      <button
        @click="$emit('message', profile)"
        class="mt-5 w-full py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm transition flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9C3.5 15 3 13.6 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        {{ $t('messenger.sendMessageAction') }}
      </button>

      <button
        v-if="isBlocked"
        @click="$emit('unblock', profile)"
        class="mt-2 w-full py-3 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-sm transition"
      >
        {{ $t('messenger.unblock') }}
      </button>
      <button
        v-else
        @click="$emit('block', profile)"
        class="mt-2 w-full py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm transition"
      >
        {{ $t('messenger.block') }}
      </button>
    </div>
  </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';
import { avatarInitials } from './avatarInitials';
import { formatPresenceText } from '@/utils/messengerPresence';

export default {
  components: { BottomSheetDrawer },
  props: {
    open: { type: Boolean, default: false },
    profile: { type: Object, default: null },
    isBlocked: { type: Boolean, default: false },
  },
  emits: ['close', 'message', 'block', 'unblock'],
  computed: {
    sheetPanelClass() { return MESSENGER_SHEET_PANEL; },
    sheetBackdropClass() { return MESSENGER_SHEET_BACKDROP; },
    fullName() {
      const p = this.profile;
      if (!p) return '';
      return (p.first_name || p.last_name) ? `${p.first_name || ''} ${p.last_name || ''}`.trim() : p.username || '';
    },
    initials() {
      return avatarInitials(this.profile);
    },
    presenceText() {
      return formatPresenceText(this.profile, (k, p) => this.$t(k, p), {
        locale: this.$i18n?.locale === 'fa' ? 'fa-IR' : 'en-US',
      });
    },
  },
  methods: {},
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
