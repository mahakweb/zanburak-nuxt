<template>
    <span
        class="inline-flex shrink-0 items-center justify-center rounded-xl ring-1 ring-inset font-bold"
        :class="[wrapClass, sizeClass]"
        :title="label"
    >
        <svg v-if="icon === 'radio'" class="icon-size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
        </svg>
        <svg v-else-if="icon === 'checkbox'" class="icon-size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12l3 3 5-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="icon === 'tf'" class="icon-size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M7 12h10M12 7v10" stroke-linecap="round" />
            <circle cx="12" cy="12" r="9" />
        </svg>
        <svg v-else-if="icon === 'text'" class="icon-size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M4 7V4h16v3M9 20h6M12 4v16" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="icon === 'essay'" class="icon-size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="icon === 'blank'" class="icon-size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M4 12h6M14 12h6M4 8h16M4 16h10" stroke-linecap="round" />
        </svg>
        <svg v-else-if="icon === 'match'" class="icon-size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M8 8h8v8H8zM16 8l4-4M8 16l-4 4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="icon === 'order'" class="icon-size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" stroke-linecap="round" />
        </svg>
        <svg v-else class="icon-size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" />
        </svg>
    </span>
</template>

<script>
import { QUESTION_TYPE_META, QUESTION_TYPE_LABELS } from '@/views/components/admin/quiz/adminQuizConstants.js';

const COLOR_MAP = {
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-200/60 dark:bg-indigo-900/20 dark:text-indigo-400 dark:ring-indigo-800/40',
    violet: 'bg-violet-50 text-violet-600 ring-violet-200/60 dark:bg-violet-900/20 dark:text-violet-400 dark:ring-violet-800/40',
    sky: 'bg-sky-50 text-sky-600 ring-sky-200/60 dark:bg-sky-900/20 dark:text-sky-400 dark:ring-sky-800/40',
    teal: 'bg-teal-50 text-teal-600 ring-teal-200/60 dark:bg-teal-900/20 dark:text-teal-400 dark:ring-teal-800/40',
    rose: 'bg-rose-50 text-rose-600 ring-rose-200/60 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800/40',
    amber: 'bg-amber-50 text-amber-600 ring-amber-200/60 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/40',
    cyan: 'bg-cyan-50 text-cyan-600 ring-cyan-200/60 dark:bg-cyan-900/20 dark:text-cyan-400 dark:ring-cyan-800/40',
    lime: 'bg-lime-50 text-lime-600 ring-lime-200/60 dark:bg-lime-900/20 dark:text-lime-400 dark:ring-lime-800/40',
};

export default {
    name: 'AdminQuestionTypeIcon',
    props: {
        type: { type: String, default: 'single_choice' },
        size: { type: String, default: 'md' },
        neutral: { type: Boolean, default: false },
    },
    computed: {
        meta() {
            return QUESTION_TYPE_META[this.type] || QUESTION_TYPE_META.single_choice;
        },
        icon() {
            return this.meta.icon;
        },
        label() {
            return QUESTION_TYPE_LABELS[this.type] || this.type;
        },
        wrapClass() {
            if (this.neutral) {
                return 'bg-gray-100 text-gray-500 ring-gray-200/70 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700/50';
            }
            return COLOR_MAP[this.meta.color] || COLOR_MAP.indigo;
        },
        sizeClass() {
            return this.size === 'lg' ? 'w-12 h-12' : this.size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
        },
    },
};
</script>

<style scoped>
.icon-size {
    width: 1.125rem;
    height: 1.125rem;
}
.w-12.h-12 .icon-size {
    width: 1.375rem;
    height: 1.375rem;
}
.w-8.h-8 .icon-size {
    width: 0.875rem;
    height: 0.875rem;
}
</style>
