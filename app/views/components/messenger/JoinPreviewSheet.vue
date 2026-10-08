<template>
  <BottomSheetDrawer
    :model-value="open"
    :draggable="true"
    :fit-content="true"
    :initial-height="0.55"
    :min-height="0.35"
    :max-height="0.85"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="panelClass"
    content-class="px-0 pb-5 pt-0 overflow-auto"
    :backdrop-class="backdropClass"
    @update:modelValue="(v) => { if (!v) $emit('close'); }"
    @close="$emit('close')"
  >
    <div class="relative h-24 mx-3 rounded-xl overflow-hidden bg-gradient-to-br from-[#3390ec]/30 via-[#8ec7f7]/15 to-transparent"
      :style="coverStyle" />

    <div class="px-4 -mt-9 relative">
      <div class="flex justify-center">
        <MessengerAvatar :user="avatarUser" size="xl" class="ring-[3px] ring-white dark:ring-gray-900 shadow-md" />
      </div>
      <h2 class="mt-2.5 text-center text-[16px] font-bold text-gray-900 dark:text-gray-100 truncate">
        {{ conversation?.title || '—' }}
      </h2>
      <p class="mt-0.5 text-center text-[12px] text-[#707579]">
        <span v-if="conversation?.username" dir="ltr">@{{ conversation.username }} · </span>
        {{ memberLabel }}
      </p>
      <p v-if="conversation?.description" class="mt-2.5 text-[12px] text-[#707579] text-center leading-relaxed line-clamp-3">
        {{ conversation.description }}
      </p>
      <p v-if="!conversation?.is_public" class="mt-2 text-center text-[11px] text-amber-600 dark:text-amber-400">
        {{ $t('messenger.privateJoinHint') }}
      </p>

      <div class="mt-4 flex gap-2">
        <button
          type="button"
          class="flex-1 h-11 rounded-xl text-[13px] font-semibold text-gray-500 hover:bg-black/[0.04] dark:hover:bg-white/5 disabled:opacity-50"
          :disabled="busy"
          @click="$emit('close')"
        >
          {{ $t('messenger.cancel') }}
        </button>
        <button
          type="button"
          class="flex-[1.4] h-11 rounded-xl bg-[#3390ec] hover:bg-[#4ea4f5] text-white text-[14px] font-semibold disabled:opacity-50 shadow-sm shadow-[#3390ec]/25 active:scale-[.99] transition"
          :disabled="busy"
          @click="$emit('join')"
        >
          {{ busy ? '…' : (isChannel ? $t('messenger.joinChannel') : $t('messenger.joinGroup')) }}
        </button>
      </div>
    </div>
  </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import MessengerAvatar from './MessengerAvatar.vue';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';

export default {
  name: 'JoinPreviewSheet',
  components: { MessengerAvatar, BottomSheetDrawer },
  props: {
    open: { type: Boolean, default: false },
    conversation: { type: Object, default: null },
    busy: { type: Boolean, default: false },
  },
  emits: ['close', 'join'],
  computed: {
    panelClass() { return MESSENGER_SHEET_PANEL; },
    backdropClass() { return MESSENGER_SHEET_BACKDROP; },
    isChannel() {
      return this.conversation?.type === 'channel';
    },
    avatarUser() {
      const c = this.conversation;
      if (!c) return {};
      return { id: c.id, first_name: c.title, profile_pic: c.avatar, username: c.username };
    },
    coverStyle() {
      const cover = this.conversation?.cover;
      return cover
        ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};
    },
    memberLabel() {
      const count = this.conversation?.member_count || 0;
      return this.isChannel
        ? this.$t('messenger.subscribersCount', { count })
        : this.$t('messenger.membersCount', { count });
    },
  },
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
