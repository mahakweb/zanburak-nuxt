<template>
    <div class="shrink-0 pt-3 pb-5 -mx-5 px-5 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:justify-end">
        <button type="button" @click="$emit('cancel')"
                class="flex w-full sm:w-auto items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors">
            {{ cancelLabel }}
        </button>
        <button type="button" @click="$emit('submit')" :disabled="loading || disabled"
                class="disabled:opacity-60 flex w-full sm:w-auto items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition-colors shadow-sm"
            :class="submitClass">
            <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span v-else>{{ submitLabel }}</span>
        </button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        cancelLabel: { type: String, default: 'انصراف' },
        submitLabel: { type: String, default: 'ذخیره تغییرات' },
        variant: { type: String, default: 'primary' },
        loading: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
    },
    emits: ['cancel', 'submit'],
    computed: {
        submitClass() {
            if (this.variant === 'danger') {
                return 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25';
            }
            if (this.variant === 'warning') {
                return 'bg-amber-400 hover:bg-amber-500 text-gray-900 shadow-amber-400/25';
            }
            return 'bg-amber-400 hover:bg-amber-500 text-gray-900 shadow-amber-400/25';
        },
    },
};
</script>
