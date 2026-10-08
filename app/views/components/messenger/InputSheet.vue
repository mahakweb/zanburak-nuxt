<template>
  <BottomSheetDrawer
    :model-value="open"
    :draggable="true"
    :fit-content="true"
    :initial-height="0.3"
    :min-height="0.22"
    :max-height="0.55"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="panelClass"
    content-class="px-4 pb-5 pt-1 overflow-auto"
    :backdrop-class="backdropClass"
    @update:modelValue="(v) => { if (!v) $emit('close'); }"
    @close="$emit('close')"
  >
    <div class="flex items-center gap-2 mb-3">
      <h3 class="text-[15px] font-bold text-gray-800 dark:text-gray-100 truncate flex-1">{{ title }}</h3>
      <button
        type="button"
        class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
        :aria-label="$t('messenger.cancel')"
        @click="$emit('close')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
    <p v-if="hint" class="text-[12px] text-gray-500 dark:text-gray-400 mb-2.5 -mt-1">{{ hint }}</p>

    <div class="flex items-center gap-2">
      <input
        ref="input"
        v-model="value"
        v-no-autofill="'strong'"
        type="text"
        name="messenger-sheet-input"
        @keydown.enter.prevent="confirm"
        :placeholder="placeholder"
        class="flex-1 min-w-0 px-3.5 py-2.5 text-[14px] rounded-xl bg-gray-100 dark:bg-white/5 border-0 focus:ring-2 focus:ring-[#3390ec] focus:outline-none text-gray-800 dark:text-gray-100"
        dir="auto"
      />
      <button
        type="button"
        @click="confirm"
        class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-[#3390ec] hover:bg-[#4ea4f5] text-white active:scale-95 transition shadow-sm"
        :aria-label="$t('messenger.save')"
        :title="$t('messenger.save')"
      >
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';

export default {
  name: 'InputSheet',
  components: { BottomSheetDrawer },
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    hint: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    initialValue: { type: String, default: '' },
  },
  emits: ['close', 'confirm'],
  data() {
    return { value: '' };
  },
  computed: {
    panelClass() { return MESSENGER_SHEET_PANEL; },
    backdropClass() { return MESSENGER_SHEET_BACKDROP; },
  },
  watch: {
    open(val) {
      if (val) {
        this.value = this.initialValue || '';
        this.$nextTick(() => this.$refs.input?.focus());
      }
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.value.trim());
    },
  },
};
</script>
