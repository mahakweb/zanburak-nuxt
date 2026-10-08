<template>
    <aside class="lg:sticky lg:top-4 space-y-2">
        <nav class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-2 shadow-sm">
            <ol class="space-y-0.5">
                <li v-for="(step, index) in steps" :key="step.id">
                    <button
                        type="button"
                        @click="$emit('go-to-step', index)"
                        class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-start transition-all"
                        :class="stepButtonClass(index)"
                    >
                        <span class="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold" :class="stepIndexClass(index)">
                            <svg v-if="index < currentStep" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <svg v-else-if="step.id === confirmStepId" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span v-else>{{ index + 1 }}</span>
                        </span>
                        <span class="min-w-0">
                            <span class="block text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{{ step.label }}</span>
                            <span class="block text-[10px] text-gray-400 truncate">{{ step.hint }}</span>
                        </span>
                    </button>
                </li>
            </ol>

            <div class="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800 px-1">
                <button
                    type="button"
                    @click="$emit('prev')"
                    :disabled="currentStep === 0"
                    title="مرحله قبل"
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <span class="text-[10px] font-medium text-gray-400 text-center leading-tight px-1">{{ footerLabel }}</span>
                <button
                    type="button"
                    @click="$emit('next')"
                    :disabled="currentStep >= steps.length - 1"
                    title="مرحله بعد"
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <button
                v-if="showSubmit"
                type="button"
                :disabled="submitLoading"
                @click="$emit('submit')"
                class="w-full mt-2 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 transition-colors"
            >
                <svg v-if="!submitLoading" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {{ submitLoading ? submitLoadingLabel : submitLabel }}
            </button>

            <button
                v-if="showReset"
                type="button"
                @click="$emit('reset')"
                class="w-full mt-2 flex items-center justify-center gap-2 h-9 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                {{ resetLabel }}
            </button>
        </nav>
    </aside>
</template>

<script>
export default {
    name: 'AdminFormStepperNav',
    props: {
        steps: { type: Array, required: true },
        currentStep: { type: Number, default: 0 },
        footerLabel: { type: String, default: '' },
        confirmStepId: { type: String, default: 'confirm' },
        showSubmit: { type: Boolean, default: false },
        submitLoading: { type: Boolean, default: false },
        submitLabel: { type: String, default: 'ثبت' },
        submitLoadingLabel: { type: String, default: 'در حال ثبت...' },
        showReset: { type: Boolean, default: false },
        resetLabel: { type: String, default: 'خالی کردن فرم' },
    },
    emits: ['go-to-step', 'prev', 'next', 'submit', 'reset'],
    methods: {
        stepButtonClass(index) {
            if (index === this.currentStep) return 'bg-yellow-400/15 ring-1 ring-yellow-400/40';
            if (index < this.currentStep) return 'hover:bg-gray-50 dark:hover:bg-gray-800/60';
            return 'hover:bg-gray-50 dark:hover:bg-gray-800/40 opacity-80';
        },
        stepIndexClass(index) {
            if (index === this.currentStep) return 'bg-yellow-400 text-gray-900';
            if (index < this.currentStep) return 'bg-gray-800 dark:bg-gray-600 text-white';
            return 'bg-gray-100 dark:bg-gray-800 text-gray-500';
        },
    },
};
</script>
