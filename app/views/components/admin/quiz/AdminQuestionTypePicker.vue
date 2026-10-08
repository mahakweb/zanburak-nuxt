<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
            v-for="(meta, key) in QUESTION_TYPE_META"
            :key="key"
            type="button"
            @click="$emit('select', key)"
            class="text-start rounded-xl border p-3 transition-all"
            :class="modelValue === key
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-400/10 shadow-sm shadow-amber-400/10'
                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'"
        >
            <div
                class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mb-2"
                :class="typeIconClass(meta.color)"
            >
                <svg v-if="meta.icon === 'radio'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
                </svg>
                <svg v-else-if="meta.icon === 'checkbox'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12l3 3 5-6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span v-else-if="meta.icon === 'tf'" class="text-[10px]">T/F</span>
                <span v-else-if="meta.icon === 'text'" class="text-[10px]">Aa</span>
                <span v-else-if="meta.icon === 'essay'" class="text-[10px]">¶</span>
                <span v-else-if="meta.icon === 'blank'" class="text-[10px]">__</span>
                <span v-else-if="meta.icon === 'match'" class="text-[10px]">↔</span>
                <span v-else-if="meta.icon === 'order'" class="text-[10px]">⇅</span>
            </div>
            <div class="text-xs font-bold text-gray-800 dark:text-gray-100">{{ meta.label }}</div>
            <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">{{ meta.desc }}</div>
        </button>
    </div>
</template>

<script>
import { QUESTION_TYPE_META } from '@/views/components/admin/quiz/adminQuizConstants.js';

const COLOR_MAP = {
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
    violet: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    sky: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
    teal: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400',
    rose: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400',
    lime: 'bg-lime-100 text-lime-600 dark:bg-lime-500/15 dark:text-lime-400',
};

export default {
    props: {
        modelValue: { type: String, default: 'single_choice' },
    },
    emits: ['select', 'update:modelValue'],
    data() {
        return { QUESTION_TYPE_META };
    },
    methods: {
        typeIconClass(color) {
            return COLOR_MAP[color] || COLOR_MAP.indigo;
        },
    },
};
</script>
