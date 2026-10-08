<template>
    <div class="flex items-start justify-between gap-3 mb-1 shrink-0">
        <div class="flex items-start gap-3 min-w-0">
            <div v-if="$slots.icon || accent"
                class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                :class="accentClass">
                <slot name="icon" />
            </div>
            <div class="min-w-0 pt-0.5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white leading-snug">{{ title }}</h3>
                <p v-if="subtitle" class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{{ subtitle }}</p>
            </div>
        </div>
        <button type="button"
            class="shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 transition-colors"
            @click="$emit('close')">
            <span class="sr-only">بستن</span>
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
    <hr :class="[dividerClass, 'shrink-0']" />
</template>

<script>
import { ADMIN_BS_DIVIDER, ACCENT_CLASSES } from './adminBottomSheetStyles';

export default {
    props: {
        title: { type: String, required: true },
        subtitle: { type: String, default: '' },
        accent: { type: String, default: 'amber' },
    },
    emits: ['close'],
    computed: {
        accentClass() {
            return ACCENT_CLASSES[this.accent] || ACCENT_CLASSES.amber;
        },
        dividerClass() {
            return ADMIN_BS_DIVIDER;
        },
    },
};
</script>
