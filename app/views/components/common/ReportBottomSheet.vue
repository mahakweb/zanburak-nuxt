<template>
    <BottomSheetDrawer
        v-model="open"
        :initial-height="0.82"
        :min-height="0.56"
        :max-height="0.94"
        :header-height="56"
        :auto-close-on-min="true"
        :close-on-backdrop="true"
        :lock-scroll="true"
        content-class="overflow-hidden px-0 pb-0"
        panel-class="bg-slate-50 dark:bg-gray-900 border-t border-slate-200 dark:border-white/10 rounded-t-[1.5rem] md:rounded-b-2xl shadow-[0_-12px_40px_rgba(15,23,42,0.28)] !max-w-lg">
        <div class="flex h-full min-h-0 flex-col">
            <div class="relative z-10 shrink-0 bg-slate-50 px-5 pb-3 pt-1 dark:bg-gray-900">
                <div class="flex items-center gap-3">
                    <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/15">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M6 3.75A.75.75 0 0 1 6.75 3h.5A.75.75 0 0 1 8 3.75V21a.75.75 0 0 1-1.5 0V3.75Z" />
                            <path d="M8 4.6c2.12 1.36 4.38 1.9 7.12.86 1.7-.64 3.12-.5 4.13.18A.75.75 0 0 1 20.5 6.2v7.16a.75.75 0 0 1-1.12.65c-1.38-.86-3.14-1.12-5.13-.37-2.5.94-4.5.5-6.25-.58V4.6Z" />
                        </svg>
                    </span>
                    <p class="min-w-0 text-sm font-normal leading-6 text-gray-500 dark:text-gray-400">{{ $t('discuss.common.reportTitle') }}</p>
                </div>
            </div>

            <div class="min-h-0 flex-1 overflow-auto px-5 pb-3 pt-2.5 custom-scrollbar">
                <div class="space-y-2.5">
                    <button
                        v-for="option in options"
                        :key="option.value"
                        type="button"
                        class="report-option"
                        :class="reason === option.value ? 'is-selected' : ''"
                        @click="reason = option.value">
                        <span class="report-option__text min-w-0 flex-1 text-start text-[13px] font-normal leading-6">
                            <template v-if="option.highlight">
                                {{ option.before }}
                                <span class="report-option__hl">{{ option.highlight }}</span>
                                {{ option.after }}
                            </template>
                            <template v-else>{{ option.label }}</template>
                        </span>
                        <span class="report-option__check" aria-hidden="true">
                            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                <path d="M6 12.2l3.6 3.6L18 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </button>
                </div>

                <div v-if="reason === 'other'" class="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-gray-900">
                    <textarea
                        v-model="description"
                        maxlength="256"
                        rows="4"
                        class="w-full resize-none bg-transparent text-sm font-normal leading-6 text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                        :placeholder="$t('discuss.common.reportOtherPlaceholder')"
                    />
                    <div class="mt-2 flex items-center justify-between gap-3 text-[11px] font-normal">
                        <span class="text-gray-400 dark:text-gray-500">{{ $t('discuss.common.reportOtherHint') }}</span>
                        <span :class="descriptionLength >= 256 ? 'text-rose-500' : 'text-gray-400 dark:text-gray-500'">
                            {{ descriptionLength }}/256
                        </span>
                    </div>
                </div>

                <p v-if="firstError" class="mt-3 text-xs font-normal text-rose-500">{{ firstError }}</p>
            </div>

            <div class="shrink-0 px-5 pb-3 pt-1">
                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        class="flex h-11 flex-1 items-center justify-center rounded-xl bg-slate-200/90 text-sm font-normal text-gray-600 transition hover:bg-slate-300/90 hover:text-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                        @click="open = false">
                        {{ $t('discuss.common.cancel') }}
                    </button>
                    <button
                        type="button"
                        class="flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl bg-rose-500 text-sm font-normal text-white shadow-rose-500/25 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="!canSubmit"
                        @click="$emit('submit')">
                        <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span v-else>{{ $t('discuss.common.sendReport') }}</span>
                    </button>
                </div>
            </div>
        </div>
    </BottomSheetDrawer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue'

const props = defineProps({
    loading: { type: Boolean, default: false },
    errors: { type: Object, default: null },
})

defineEmits(['submit'])

const open = defineModel({ type: Boolean, default: false })
const reason = defineModel('reason', { default: null })
const description = defineModel('description', { default: '' })
const { t } = useI18n()

const options = computed(() => [
    {
        value: 'spam',
        before: t('discuss.common.reportSpamBefore'),
        highlight: t('discuss.common.reportSpamHighlight'),
        after: t('discuss.common.reportSpamAfter'),
    },
    {
        value: 'offensive-writing',
        before: t('discuss.common.reportOffensiveBefore'),
        highlight: t('discuss.common.reportOffensiveHighlight'),
        after: t('discuss.common.reportOffensiveAfter'),
    },
    {
        value: 'violation-of-rules',
        before: t('discuss.common.reportRulesBefore'),
        highlight: t('discuss.common.reportRulesHighlight'),
        after: t('discuss.common.reportRulesAfter'),
    },
    {
        value: 'other',
        label: t('discuss.common.reportOther'),
    },
])

const descriptionLength = computed(() => String(description.value || '').length)

const canSubmit = computed(() => {
    if (props.loading || !reason.value) return false
    if (reason.value === 'other') {
        const text = String(description.value || '').trim()
        return text.length > 0 && text.length <= 256
    }
    return true
})

const firstError = computed(() => {
    const errors = props.errors
    if (!errors) return ''
    return errors.report?.[0] || errors.description?.[0] || errors.reportable_id?.[0] || errors.reportable_type?.[0] || ''
})
</script>

<style scoped>
.report-option {
    display: flex;
    width: 100%;
    align-items: flex-start;
    gap: 0.75rem;
    border-radius: 1rem;
    background: white;
    padding: 0.85rem 0.9rem;
    text-align: start;
    border: 1.5px solid rgba(15, 23, 42, 0.08);
    color: rgb(71 85 105);
    transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease;
}

.dark .report-option {
    background: rgb(17 24 39);
    border-color: rgba(255, 255, 255, 0.08);
    color: rgb(203 213 225);
}

.report-option.is-selected {
    border-color: rgb(244 63 94);
    color: rgb(244 63 94);
    background: rgb(255 241 242);
}

.dark .report-option.is-selected {
    background: rgba(244, 63, 94, 0.12);
    color: rgb(251 113 133);
    border-color: rgb(244 63 94);
}

.report-option__hl {
    font-weight: 400;
}

.report-option__check {
    display: flex;
    height: 1.35rem;
    width: 1.35rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    margin-top: 0.2rem;
    color: transparent;
    border: 1.5px solid rgb(203 213 225);
}

.dark .report-option__check {
    border-color: rgb(75 85 99);
}

.report-option.is-selected .report-option__check {
    background: rgb(244 63 94);
    color: white;
    border-color: rgb(244 63 94);
}
</style>
