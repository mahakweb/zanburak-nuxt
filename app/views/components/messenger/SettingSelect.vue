<template>
  <div ref="root" class="relative">
    <button
      type="button"
      @click="open = !open"
      :class="[
        'w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 transition text-start',
        open ? 'border-[#3390ec] bg-[#3390ec]/10' : 'border-transparent bg-gray-100 dark:bg-white/5 hover:bg-gray-200/70 dark:hover:bg-white/10',
      ]"
    >
      <span class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate" :style="selectedFontStyle">{{ selectedLabel }}</span>
      <svg
        class="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
      ><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
    </button>

    <transition name="select-pop">
      <div
        v-if="open"
        class="absolute z-30 mt-2 w-full rounded-xl bg-white dark:bg-[#1e2c3a] shadow-xl ring-1 ring-black/5 dark:ring-white/10 py-1 overflow-hidden max-h-64 overflow-y-auto custom-scrollbar"
      >
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          @click="choose(opt.value)"
          :style="opt.family ? { fontFamily: opt.family } : null"
          :class="[
            'w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-start transition',
            opt.value === modelValue ? 'text-gray-900 dark:text-gray-50 bg-[#3390ec]/10 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5',
          ]"
        >
          <span class="truncate">{{ opt.label }}</span>
          <svg v-if="opt.value === modelValue" class="w-4 h-4 text-[#3390ec] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { type: [String, Number], default: '' },
    // options: [{ value, label, family? }]
    options: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue'],
  data() {
    return { open: false };
  },
  computed: {
    selected() {
      return this.options.find((o) => o.value === this.modelValue) || null;
    },
    selectedLabel() {
      return this.selected ? this.selected.label : '';
    },
    selectedFontStyle() {
      return this.selected && this.selected.family ? { fontFamily: this.selected.family } : null;
    },
  },
  mounted() {
    document.addEventListener('click', this.onDocClick);
    document.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onDocClick);
    document.removeEventListener('keydown', this.onKey);
  },
  methods: {
    choose(value) {
      this.open = false;
      if (value !== this.modelValue) this.$emit('update:modelValue', value);
    },
    onDocClick(e) {
      if (this.open && this.$refs.root && !this.$refs.root.contains(e.target)) this.open = false;
    },
    onKey(e) {
      if (e.key === 'Escape') this.open = false;
    },
  },
};
</script>

<style scoped>
.select-pop-enter-active,
.select-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: top;
}
.select-pop-enter-from,
.select-pop-leave-to {
  opacity: 0;
  transform: scaleY(0.9) translateY(-4px);
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
</style>
