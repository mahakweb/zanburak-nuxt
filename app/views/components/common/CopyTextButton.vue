<template>
    <button
        type="button"
        class="inline-flex shrink-0 items-center justify-center w-7 h-7 rounded-lg transition"
        :class="copied
            ? 'text-green-600 bg-green-50 dark:bg-green-500/10'
            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200'"
        :title="copied ? '' : (title || 'کپی')"
        @click="copy"
    >
        <svg v-if="copied" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    </button>
</template>

<script>
import { copyTextToClipboard } from '@/utils/certificateDisplay';

export default {
    props: {
        value: { type: [String, Number], default: '' },
        title: { type: String, default: '' },
    },
    data() {
        return {
            copied: false,
            resetTimer: null,
        };
    },
    beforeUnmount() {
        clearTimeout(this.resetTimer);
    },
    methods: {
        async copy() {
            if (!this.value || this.copied) return;
            const ok = await copyTextToClipboard(this.value);
            if (!ok) return;
            this.copied = true;
            clearTimeout(this.resetTimer);
            this.resetTimer = setTimeout(() => {
                this.copied = false;
            }, 2000);
        },
    },
};
</script>
