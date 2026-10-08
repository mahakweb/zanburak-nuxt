<script setup>
definePageMeta({
  name: "quiz-result",
  middleware: ['auth'],
})
</script>

<template>
    <div class="quiz-result-page min-h-screen bg-gray-50 dark:bg-gray-950">
        <LoadingComponent v-if="loading" />

        <template v-else-if="result">
            <div class="mx-auto max-w-3xl px-4 py-8 md:py-12">
                <div class="mb-4 flex items-center justify-between gap-3 quiz-result-screen-only">
                    <div v-if="showScores" class="quiz-result-export-actions mb-0">
                        <button
                            type="button"
                            class="quiz-result-export-btn"
                            :disabled="exporting"
                            @click="exportPng"
                        >
                            {{ exporting ? $t('quiz.result.exporting') : $t('quiz.result.exportPng') }}
                        </button>
                        <button
                            type="button"
                            class="quiz-result-export-btn"
                            :disabled="exporting"
                            @click="exportPdf"
                        >
                            {{ $t('quiz.result.exportPdf') }}
                        </button>
                    </div>
                    <div v-else></div>
                    <QuizThemeToggle />
                </div>
                <!-- Pending / submitted — no scores -->
                <div
                    v-if="!showScores"
                    class="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none"
                >
                    <div class="px-6 py-8 text-center md:px-10 md:py-12">
                        <div
                            class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg"
                            :class="pendingIconWrap"
                        >
                            <component :is="pendingIcon" class="h-10 w-10" :class="pendingIconColor" />
                        </div>

                        <h1 class="text-xl font-black text-gray-900 dark:text-white md:text-2xl">
                            {{ pendingTitle }}
                        </h1>
                        <p class="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500 dark:text-gray-400">
                            {{ result.result_message || pendingHint }}
                        </p>

                        <div class="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            <span class="h-2 w-2 rounded-full bg-yellow-400"></span>
                            {{ result.quiz?.title }}
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-px border-t border-gray-100 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
                        <div class="bg-white px-4 py-4 text-center dark:bg-gray-900">
                            <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{{ $t('quiz.result.timeSpent') }}</p>
                            <p class="mt-1 text-sm font-bold text-gray-800 dark:text-gray-100">{{ formatTime(result.time_spent) }}</p>
                        </div>
                        <div class="bg-white px-4 py-4 text-center dark:bg-gray-900">
                            <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{{ $t('quiz.result.statusLabel') }}</p>
                            <p class="mt-1 text-sm font-bold text-gray-800 dark:text-gray-100">{{ statusLabel }}</p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2.5 p-4 sm:flex-row sm:p-6">
                        <button
                            type="button"
                            class="quiz-result-action quiz-result-action--secondary"
                            :disabled="refreshing"
                            @click="refreshResult"
                        >
                            {{ refreshing ? $t('quiz.result.refreshing') : $t('quiz.result.checkAgain') }}
                        </button>
                        <router-link
                            :to="{ name: 'quiz-history' }"
                            class="quiz-result-action quiz-result-action--primary"
                        >
                            {{ $t('quiz.result.backToHistory') }}
                        </router-link>
                    </div>
                </div>

                <!-- Full results -->
                <template v-else>
                    <div
                        id="quiz-result-printable"
                        ref="printableArea"
                        class="quiz-result-printable overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none"
                    >
                        <header class="quiz-result-print-header">
                            <div class="quiz-result-print-header__top">
                                <div class="quiz-result-print-avatar">{{ userInitials }}</div>
                                <div class="min-w-0 flex-1">
                                    <p class="quiz-result-print-kicker">{{ $t('quiz.result.printTitle') }}</p>
                                    <h2 class="quiz-result-print-header__title">{{ result.quiz?.title }}</h2>
                                    <p class="quiz-result-print-sub">{{ userDisplayName }}</p>
                                </div>
                            </div>
                            <div class="quiz-result-print-chips">
                                <div v-if="currentUser?.username" class="quiz-result-print-chip">
                                    <span class="quiz-result-print-chip__label">{{ $t('quiz.result.studentUsername') }}</span>
                                    <span class="quiz-result-print-chip__value">{{ currentUser.username }}</span>
                                </div>
                                <div v-if="userContact" class="quiz-result-print-chip">
                                    <span class="quiz-result-print-chip__label">{{ $t('quiz.result.studentContact') }}</span>
                                    <span class="quiz-result-print-chip__value">{{ userContact }}</span>
                                </div>
                                <div class="quiz-result-print-chip">
                                    <span class="quiz-result-print-chip__label">{{ $t('quiz.result.attemptNumber') }}</span>
                                    <span class="quiz-result-print-chip__value">{{ formatQuizNumber(result.attempt_number || 1, locale) }}</span>
                                </div>
                                <div v-if="resultDateTime" class="quiz-result-print-chip">
                                    <span class="quiz-result-print-chip__label">{{ $t('quiz.result.completedAt') }}</span>
                                    <span class="quiz-result-print-chip__value">{{ resultDateTime }}</span>
                                </div>
                                <div class="quiz-result-print-chip">
                                    <span class="quiz-result-print-chip__label">{{ $t('quiz.result.timeSpent') }}</span>
                                    <span class="quiz-result-print-chip__value">{{ formatTime(result.time_spent) }}</span>
                                </div>
                            </div>
                        </header>

                    <div class="overflow-hidden">
                        <div class="relative px-6 py-10 text-center md:px-10">
                            <div
                                class="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b opacity-60"
                                :class="resultGradient"
                            ></div>

                            <div class="relative mx-auto mb-6 h-36 w-36">
                                <svg viewBox="0 0 36 36" class="h-36 w-36 -rotate-90">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        class="text-gray-100 dark:text-gray-800"
                                        stroke-width="2.5"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        :stroke="gaugeColor"
                                        stroke-width="2.5"
                                        stroke-linecap="round"
                                        :stroke-dasharray="`${displayPercentage}, 100`"
                                        class="transition-all duration-700 ease-out"
                                    />
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center">
                                    <span class="text-4xl font-black text-gray-900 dark:text-white">
                                        {{ formatQuizNumber(displayPercentage, locale) }}%
                                    </span>
                                    <span class="mt-1 text-xs text-gray-400">
                                        {{ $t('quiz.result.scoreOf', { score: formatQuizNumber(result.score, locale), max: formatQuizNumber(result.max_score, locale) }) }}
                                    </span>
                                </div>
                            </div>

                            <div class="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold" :class="statusBadge">
                                <span class="h-2 w-2 rounded-full" :class="statusDot"></span>
                                {{ statusLabel }}
                            </div>

                            <h1 class="relative mt-4 text-lg font-black text-gray-900 dark:text-white md:text-xl">
                                {{ result.quiz?.title }}
                            </h1>
                            <p class="relative mt-1 text-xs text-gray-400">
                                {{ $t('quiz.result.timeSpentLabel', { time: formatTime(result.time_spent) }) }}
                            </p>
                        </div>

                        <div class="grid grid-cols-3 gap-px border-t border-gray-100 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
                            <div class="bg-white px-3 py-4 text-center dark:bg-gray-900">
                                <p class="text-[10px] text-gray-400">{{ $t('quiz.result.score') }}</p>
                                <p class="mt-0.5 text-sm font-bold text-gray-800 dark:text-gray-100">{{ formatQuizNumber(result.score, locale) }}</p>
                            </div>
                            <div class="bg-white px-3 py-4 text-center dark:bg-gray-900">
                                <p class="text-[10px] text-gray-400">{{ $t('quiz.result.percentage') }}</p>
                                <p class="mt-0.5 text-sm font-bold text-gray-800 dark:text-gray-100">{{ formatQuizNumber(displayPercentage, locale) }}%</p>
                            </div>
                            <div class="bg-white px-3 py-4 text-center dark:bg-gray-900">
                                <p class="text-[10px] text-gray-400">{{ $t('quiz.result.timeSpent') }}</p>
                                <p class="mt-0.5 text-sm font-bold text-gray-800 dark:text-gray-100">{{ formatTime(result.time_spent) }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="showQuestionsInResult && result.answers?.length" class="border-t border-gray-100 dark:border-gray-800">
                        <h2 class="px-5 pt-5 pb-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                            {{ showCorrectAnswers ? $t('quiz.result.reviewAnswers') : $t('quiz.result.scoreBreakdown') }}
                        </h2>
                        <div
                            v-for="(a, i) in result.answers"
                            :key="a.question_id"
                            class="overflow-hidden border-t border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div
                                class="flex items-start gap-3 border-s-4 p-4"
                                :class="showCorrectAnswers ? answerBorder(a) : 'border-gray-200 dark:border-gray-700'"
                            >
                                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                                    {{ formatQuizNumber(i + 1, locale) }}
                                </span>
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-medium leading-7 text-gray-800 dark:text-gray-100">{{ a.question?.text }}</p>
                                    <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                        <span
                                            v-if="showCorrectAnswers && a.is_correct != null"
                                            class="rounded-full px-2 py-0.5 font-semibold"
                                            :class="answerPill(a)"
                                        >
                                            {{ answerStatus(a) }}
                                        </span>
                                        <span class="text-gray-400">
                                            {{ formatQuizNumber(a.score, locale) }}/{{ formatQuizNumber(a.max_score, locale) }} {{ $t('quiz.result.points') }}
                                        </span>
                                    </div>

                                    <template v-if="showCorrectAnswers">
                                        <div
                                            v-if="studentAnswerText(a)"
                                            class="mt-3 rounded-xl bg-gray-50 p-3 text-xs leading-6 text-gray-600 dark:bg-gray-800/80 dark:text-gray-300"
                                        >
                                            <span class="mb-1 block text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                {{ $t('quiz.result.yourAnswer') }}
                                            </span>
                                            <span class="whitespace-pre-wrap">{{ studentAnswerText(a) }}</span>
                                        </div>
                                        <div
                                            v-if="correctAnswerText(a.question)"
                                            class="mt-3 rounded-xl bg-emerald-50 p-3 text-xs leading-6 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
                                        >
                                            <span class="mb-1 block text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                                                {{ $t('quiz.result.correctAnswer') }}
                                            </span>
                                            <span class="whitespace-pre-wrap">{{ correctAnswerText(a.question) }}</span>
                                        </div>
                                        <p
                                            v-if="a.question?.explanation"
                                            class="mt-3 rounded-xl bg-amber-50/70 p-3 text-xs leading-6 text-amber-900/80 dark:bg-amber-500/10 dark:text-amber-100/90"
                                        >
                                            {{ a.question.explanation }}
                                        </p>
                                    </template>

                                    <p
                                        v-if="a.reviewer_comment"
                                        class="mt-3 rounded-xl bg-sky-50 p-3 text-xs leading-6 text-sky-800 dark:bg-sky-500/10 dark:text-sky-200"
                                    >
                                        <span class="mb-1 block text-[10px] font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                                            {{ $t('quiz.result.reviewerComment') }}
                                        </span>
                                        {{ a.reviewer_comment }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    <div class="mt-6 quiz-result-screen-only">
                        <router-link
                            :to="{ name: 'quiz-history' }"
                            class="quiz-result-action quiz-result-action--secondary"
                        >
                            {{ $t('quiz.result.backToHistory') }}
                        </router-link>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
import LoadingComponent from '@/views/components/LoadingComponent.vue';
import QuizThemeToggle from '@/views/components/quiz/QuizThemeToggle.vue';
import { getQuizAttemptResult } from '@/services/quiz.service';
import { formatQuizNumber } from '@/utils/quizSecurity';
import {
    downloadQuizResultPng,
    downloadQuizResultPdf,
    buildQuizResultFilename,
} from '@/utils/quizResultExport';
import { showToastError } from '@/utils/toastConfig';
import '@/assets/css/quiz-result-export.css';

const CheckIcon = {
    template: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
const ClockIcon = {
    template: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M12 9V13L14 15M9 2H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};
const ReviewIcon = {
    template: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

export default {
    components: { LoadingComponent, QuizThemeToggle },
    props: { attemptUuid: { type: String, required: true } },
    data() {
        return { loading: true, refreshing: false, result: null, exporting: false };
    },
    computed: {
        locale() {
            return this.$i18n.locale === 'en' ? 'en-US' : 'fa-IR';
        },
        showScores() {
            return this.result?.result_available === true
                && this.result?.percentage != null;
        },
        showCorrectAnswers() {
            return this.result?.show_correct_answers === true;
        },
        showQuestionsInResult() {
            return this.result?.show_questions_in_result === true;
        },
        currentUser() {
            return this.$store.state.auth?.status?.userInfo || null;
        },
        userDisplayName() {
            const u = this.currentUser;
            if (!u) return '—';
            const full = [u.first_name, u.last_name].filter(Boolean).join(' ').trim();
            return full || u.username || u.email || u.mobile || '—';
        },
        userInitials() {
            const name = this.userDisplayName;
            if (!name || name === '—') return '?';
            const parts = name.trim().split(/\s+/);
            if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            return name.slice(0, 2).toUpperCase();
        },
        userContact() {
            const u = this.currentUser;
            if (!u) return '';
            return u.email || u.mobile || '';
        },
        resultDateTime() {
            const raw = this.result?.completed_at || this.result?.submitted_at;
            if (!raw) return '';
            return new Date(raw).toLocaleString(this.locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        },
        displayPercentage() {
            return Math.round(Number(this.result?.percentage) || 0);
        },
        displayMode() {
            return this.result?.result_display || this.result?.quiz?.result_display || 'immediately';
        },
        pendingTitle() {
            if (this.result?.status === 'grading') return this.$t('quiz.result.gradingLabel');
            if (this.displayMode === 'after_end') return this.$t('quiz.result.notAvailableTitle');
            if (this.displayMode === 'after_review') return this.$t('quiz.result.pendingReview');
            return this.$t('quiz.result.submittedTitle');
        },
        pendingHint() {
            if (this.displayMode === 'after_end') return this.$t('quiz.result.notAvailableHint');
            if (this.displayMode === 'after_review') return this.$t('quiz.result.submittedHint');
            return this.$t('quiz.result.submittedHint');
        },
        pendingIcon() {
            if (this.result?.status === 'grading' || this.displayMode === 'after_review') return ReviewIcon;
            if (this.displayMode === 'after_end') return ClockIcon;
            return CheckIcon;
        },
        pendingIconWrap() {
            if (this.result?.status === 'grading' || this.displayMode === 'after_review') {
                return 'bg-amber-50 dark:bg-amber-500/10';
            }
            if (this.displayMode === 'after_end') {
                return 'bg-sky-50 dark:bg-sky-500/10';
            }
            return 'bg-emerald-50 dark:bg-emerald-500/10';
        },
        pendingIconColor() {
            if (this.result?.status === 'grading' || this.displayMode === 'after_review') return 'text-amber-500';
            if (this.displayMode === 'after_end') return 'text-sky-500';
            return 'text-emerald-500';
        },
        gaugeColor() {
            if (this.result.passed === true) return '#22c55e';
            if (this.result.passed === false) return '#f43f5e';
            return '#f59e0b';
        },
        resultGradient() {
            if (this.result.passed === true) return 'from-green-400/20 to-transparent';
            if (this.result.passed === false) return 'from-rose-400/20 to-transparent';
            return 'from-yellow-400/25 to-transparent';
        },
        statusLabel() {
            if (this.result.status === 'grading') return this.$t('quiz.result.gradingLabel');
            if (!this.showScores) return this.$t('quiz.result.submittedTitle');
            if (this.result.passed === true) return this.$t('quiz.result.passedCelebration');
            if (this.result.passed === false) return this.$t('quiz.result.failedLabel');
            return this.$t('quiz.result.completedLabel');
        },
        statusBadge() {
            if (this.result.passed === true) return 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400';
            if (this.result.passed === false) return 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400';
            return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
        },
        statusDot() {
            if (this.result.passed === true) return 'bg-green-500';
            if (this.result.passed === false) return 'bg-rose-500';
            return 'bg-amber-500';
        },
    },
    async mounted() {
        await this.loadResult();
    },
    methods: {
        formatQuizNumber,
        exportFilename(ext) {
            return buildQuizResultFilename(this.result?.quiz?.title, ext);
        },
        async exportPng() {
            const el = this.$refs.printableArea;
            if (!el) return;
            this.exporting = true;
            try {
                await downloadQuizResultPng(el, this.exportFilename('png'));
            } catch {
                showToastError(this.$t('quiz.result.exportError'));
            } finally {
                this.exporting = false;
            }
        },
        async exportPdf() {
            const el = this.$refs.printableArea;
            if (!el) return;
            this.exporting = true;
            try {
                await downloadQuizResultPdf(el, this.exportFilename('pdf'));
            } catch {
                showToastError(this.$t('quiz.result.exportError'));
            } finally {
                this.exporting = false;
            }
        },
        async loadResult() {
            try {
                const res = await getQuizAttemptResult(this.attemptUuid);
                this.result = res.attempt;
            } finally {
                this.loading = false;
            }
        },
        async refreshResult() {
            this.refreshing = true;
            try {
                const res = await getQuizAttemptResult(this.attemptUuid);
                this.result = res.attempt;
            } finally {
                this.refreshing = false;
            }
        },
        formatTime(seconds) {
            if (!seconds) return `۰ ${this.$t('quiz.time.secondUnit')}`;
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            const fmt = (n) => formatQuizNumber(n, this.locale);
            if (m) return `${fmt(m)} ${this.$t('quiz.time.minuteUnit')} ${fmt(s)} ${this.$t('quiz.time.secondUnit')}`;
            return `${fmt(s)} ${this.$t('quiz.time.secondUnit')}`;
        },
        answerStatus(a) {
            if (a.is_correct === true) return this.$t('quiz.result.correct');
            if (a.is_correct === false) return this.$t('quiz.result.incorrect');
            return this.$t('quiz.result.pending');
        },
        answerPill(a) {
            if (a.is_correct === true) return 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400';
            if (a.is_correct === false) return 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400';
            return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
        },
        answerBorder(a) {
            if (a.is_correct === true) return 'border-green-400';
            if (a.is_correct === false) return 'border-rose-400';
            return 'border-amber-400';
        },
        studentAnswerText(a) {
            const ans = a.answer;
            const q = a.question;
            if (!ans || !q) return '';
            const opts = q.options || [];
            const optById = Object.fromEntries(opts.map((o) => [o.id, o]));

            if (['single_choice', 'multiple_choice', 'true_false'].includes(q.type)) {
                const labels = (ans.option_ids || []).map((id) => optById[id]?.text).filter(Boolean);
                return labels.join('، ') || '';
            }
            if (q.type === 'short_answer' || q.type === 'long_answer') {
                return (ans.text || '').trim();
            }
            if (q.type === 'fill_blank') {
                return (ans.blanks || [])
                    .map((b, i) => `${this.$t('quiz.take.blankLabel', { index: i + 1 })}: ${b || '—'}`)
                    .join('\n');
            }
            if (q.type === 'matching') {
                return opts
                    .filter((o) => o.match_key || o.text)
                    .map((o) => {
                        const key = o.match_key || o.text;
                        const val = (ans.matches || {})[o.id] || '—';
                        return `${key} → ${val}`;
                    })
                    .join('\n');
            }
            if (q.type === 'ordering') {
                return (ans.order || [])
                    .map((id, i) => `${formatQuizNumber(i + 1, this.locale)}. ${optById[id]?.text || '—'}`)
                    .join('\n');
            }
            return '';
        },
        correctAnswerText(q) {
            if (!q) return '';
            const opts = q.options || [];

            if (['single_choice', 'multiple_choice', 'true_false'].includes(q.type)) {
                const labels = opts.filter((o) => o.is_correct).map((o) => o.text);
                return labels.join('، ') || '';
            }
            if (q.type === 'short_answer') {
                const labels = opts.filter((o) => o.is_correct).map((o) => o.text);
                return labels.join('، ') || '';
            }
            if (q.type === 'long_answer') {
                return '';
            }
            if (q.type === 'fill_blank') {
                const byBlank = {};
                opts.filter((o) => o.blank_index != null && o.is_correct !== false).forEach((o) => {
                    const key = o.blank_index;
                    if (!byBlank[key]) byBlank[key] = [];
                    byBlank[key].push(o.text || '—');
                });
                return Object.keys(byBlank)
                    .sort((a, b) => Number(a) - Number(b))
                    .map((key) => `${this.$t('quiz.take.blankLabel', { index: Number(key) + 1 })}: ${byBlank[key].join(' / ')}`)
                    .join('\n');
            }
            if (q.type === 'matching') {
                return opts
                    .filter((o) => (o.match_key || o.text) && o.match_value)
                    .map((o) => `${o.match_key || o.text} → ${o.match_value}`)
                    .join('\n');
            }
            if (q.type === 'ordering') {
                return [...opts]
                    .sort((a, b) => (a.correct_position ?? a.position ?? 0) - (b.correct_position ?? b.position ?? 0))
                    .map((o, i) => `${formatQuizNumber(i + 1, this.locale)}. ${o.text}`)
                    .join('\n');
            }
            return '';
        },
    },
};
</script>
