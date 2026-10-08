<template>
    <div
        ref="examRoot"
        class="quiz-exam-root fixed inset-0 z-[100] flex flex-col bg-gray-50 dark:bg-gray-950"
        @copy.prevent
        @cut.prevent
        @paste.prevent
        @contextmenu.prevent
        @dragstart.prevent
        @drop.prevent
    >
        <div
            v-if="screenshotBlackout"
            class="quiz-screenshot-blackout"
            aria-hidden="true"
        ></div>

        <div
            v-if="securityShield"
            class="quiz-security-shield"
            role="alertdialog"
            aria-modal="true"
        >
            <div class="quiz-security-shield__icon">
                <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L4 7V11C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 11V7L12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                    <path d="M12 8V13M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
            <h2 class="quiz-security-shield__title">{{ securityShieldTitle }}</h2>
            <p class="quiz-security-shield__hint">{{ securityShieldHint }}</p>
            <button
                v-if="securityShieldActionLabel"
                type="button"
                class="quiz-security-shield__btn"
                @click="handleSecurityShieldAction"
            >
                {{ securityShieldActionLabel }}
            </button>
        </div>

        <LoadingComponent v-if="loading" fullscreen class="z-[110]" />

        <template v-else-if="attempt && examContentVisible">
            <div
                v-if="watermarkText"
                class="quiz-exam-watermark"
                aria-hidden="true"
            >
                <span v-for="n in 20" :key="n">{{ watermarkText }}</span>
            </div>

            <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
                <QuizExamSidebar
                    :quiz="attempt.quiz"
                    :user="currentUser"
                    :attempt-number="attempt.attempt_number"
                    :locale="locale"
                    class="hidden shrink-0 lg:block lg:max-h-full"
                />

                <div class="flex min-h-0 min-w-0 flex-1 flex-col">
            <!-- Header -->
            <header class="shrink-0 border-b border-gray-200/80 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
                <div class="px-4 py-3 lg:px-6">
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex min-w-0 flex-1 items-center gap-2 lg:hidden">
                            <button
                                type="button"
                                class="quiz-exam-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                :aria-label="$t('quiz.take.infoPanelTitle')"
                                @click="mobileInfoOpen = true"
                            >
                                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                                    <path d="M12 11V16M12 8H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                            </button>
                            <p class="truncate text-sm font-bold text-gray-900 dark:text-white">
                                {{ attempt.quiz?.title }}
                            </p>
                        </div>
                        <p class="hidden text-xs font-semibold text-gray-500 dark:text-gray-400 lg:block">
                            {{ $t('quiz.take.progressLabel') }}
                        </p>
                        <div class="flex shrink-0 items-center gap-2">
                            <QuizThemeToggle />
                        <div
                            v-if="timeRemaining !== null"
                            class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold"
                            :class="timeRemaining < 60
                                ? 'bg-rose-50 text-rose-600 animate-pulse dark:bg-rose-500/15'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'"
                        >
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.5"/>
                                <path d="M12 9V13L14 15M9 2H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            {{ formatClock(timeRemaining) }}
                        </div>
                        </div>
                    </div>

                    <div class="mt-3 flex items-center gap-3">
                        <div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                                class="h-full rounded-full bg-gradient-to-l from-yellow-400 to-amber-400 transition-all duration-500 ease-out"
                                :style="{ width: progress + '%' }"
                            ></div>
                        </div>
                        <span class="shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400">
                            <template v-if="oneQuestionMode">
                                {{ formatQuizNumber(currentQuestionIndex + 1, locale) }}/{{ formatQuizNumber(questions.length, locale) }}
                            </template>
                            <template v-else>
                                {{ formatQuizNumber(answeredCount, locale) }}/{{ formatQuizNumber(questions.length, locale) }}
                            </template>
                        </span>
                    </div>
                </div>
            </header>

            <!-- Questions -->
            <main
                class="flex min-h-0 flex-1 flex-col overscroll-contain"
                :class="oneQuestionMode ? 'overflow-hidden' : 'overflow-y-auto'"
            >
                <div
                    class="w-full px-4 lg:px-6"
                    :class="oneQuestionMode
                        ? 'mx-auto flex min-h-0 max-w-3xl flex-1 flex-col justify-center overflow-y-auto py-4'
                        : 'mx-auto max-w-3xl space-y-5 py-5 pb-8'"
                >
                    <article
                        v-for="{ q, qIndex } in displayedQuestions"
                        :key="q.id"
                        class="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div class="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                            <div class="flex items-start gap-3">
                                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-400 text-sm font-black text-gray-900 shadow-sm">
                                    {{ formatQuizNumber(qIndex + 1, locale) }}
                                </span>
                                <div
                                    v-if="q.type === 'fill_blank' && fillBlankParts(q).mode !== 'none'"
                                    class="min-w-0 flex-1 pt-0.5 text-base font-semibold leading-9 text-gray-800 dark:text-gray-100"
                                >
                                    <template v-for="(part, partIdx) in fillBlankParts(q).parts" :key="partIdx">
                                        <span v-if="part.type === 'text'" class="whitespace-pre-wrap">{{ part.value }}</span>
                                        <input
                                            v-else
                                            v-model="answers[q.id].blanks[part.index]"
                                            type="text"
                                            autocomplete="off"
                                            class="quiz-exam-input mx-1 inline-block h-9 min-w-[5.5rem] max-w-[11rem] rounded-lg border border-sky-300 bg-sky-50/80 px-2.5 text-center text-sm font-bold text-gray-900 align-middle dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-gray-100"
                                            :placeholder="formatQuizNumber(part.index + 1, locale)"
                                            @copy.prevent
                                            @cut.prevent
                                            @paste.prevent
                                            @contextmenu.prevent
                                        />
                                    </template>
                                </div>
                                <p v-else class="pt-0.5 text-base font-semibold leading-8 text-gray-800 dark:text-gray-100">{{ q.text }}</p>
                            </div>
                        </div>

                        <div class="space-y-2.5 p-5" :class="{ 'hidden': q.type === 'fill_blank' && fillBlankParts(q).mode !== 'none' }">
                            <!-- Single / True-False -->
                            <template v-if="['single_choice', 'true_false'].includes(q.type)">
                                <button
                                    v-for="opt in q.options"
                                    :key="opt.id"
                                    type="button"
                                    class="quiz-option-card quiz-exam-btn flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3.5 text-start text-sm dark:border-gray-700"
                                    :class="isSelected(q.id, opt.id) ? 'is-selected' : 'hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-600 dark:hover:bg-gray-800/60'"
                                    @click="onSingleSelect(q.id, opt.id)"
                                >
                                    <span class="quiz-option-indicator quiz-option-indicator--radio">
                                        <span class="quiz-option-indicator__dot"></span>
                                    </span>
                                    <span class="text-gray-700 dark:text-gray-200">{{ opt.text }}</span>
                                </button>
                            </template>

                            <!-- Multiple choice -->
                            <template v-else-if="q.type === 'multiple_choice'">
                                <button
                                    v-for="opt in q.options"
                                    :key="opt.id"
                                    type="button"
                                    class="quiz-option-card quiz-exam-btn flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3.5 text-start text-sm dark:border-gray-700"
                                    :class="isSelected(q.id, opt.id) ? 'is-selected' : 'hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-600 dark:hover:bg-gray-800/60'"
                                    @click="toggleMultiple(q.id, opt.id)"
                                >
                                    <span class="quiz-option-indicator quiz-option-indicator--checkbox">
                                        <svg class="quiz-option-indicator__check" viewBox="0 0 12 12" fill="none">
                                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span class="text-gray-700 dark:text-gray-200">{{ opt.text }}</span>
                                </button>
                            </template>

                            <!-- Long answer -->
                            <textarea
                                v-else-if="q.type === 'long_answer'"
                                v-model="answers[q.id].text"
                                rows="6"
                                class="quiz-exam-input w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-7 text-gray-800 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-100"
                                :placeholder="$t('quiz.take.answerLongPlaceholder')"
                                @copy.prevent
                                @cut.prevent
                                @paste.prevent
                                @contextmenu.prevent
                            />

                            <!-- Short answer -->
                            <input
                                v-else-if="q.type === 'short_answer'"
                                v-model="answers[q.id].text"
                                type="text"
                                autocomplete="off"
                                class="quiz-exam-input h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-100"
                                :placeholder="$t('quiz.take.answerShortPlaceholder')"
                                @copy.prevent
                                @cut.prevent
                                @paste.prevent
                                @contextmenu.prevent
                            />

                            <!-- Fill blank (fallback when no markers in question text) -->
                            <div v-else-if="q.type === 'fill_blank'" class="space-y-2">
                                <div
                                    v-for="i in blankCount(q)"
                                    :key="i"
                                    class="flex items-center gap-3"
                                >
                                    <span class="flex h-8 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                        {{ $t('quiz.take.blankLabel', { index: i }) }}
                                    </span>
                                    <input
                                        v-model="answers[q.id].blanks[i - 1]"
                                        type="text"
                                        autocomplete="off"
                                        class="quiz-exam-input h-11 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-100"
                                        @copy.prevent
                                        @cut.prevent
                                        @paste.prevent
                                        @contextmenu.prevent
                                    />
                                </div>
                            </div>

                            <!-- Ordering -->
                            <div v-else-if="q.type === 'ordering'" class="space-y-2">
                                <p class="mb-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M4 8H20M4 16H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                    {{ $t('quiz.take.orderingHint') }}
                                </p>
                                <div
                                    v-for="(item, i) in orderingItems[q.id]"
                                    :key="item.id"
                                    class="quiz-order-item flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800/60"
                                >
                                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-xs font-bold text-yellow-700 dark:bg-yellow-400/15 dark:text-yellow-400">
                                        {{ formatQuizNumber(i + 1, locale) }}
                                    </span>
                                    <span class="flex-1 text-sm text-gray-700 dark:text-gray-200">{{ item.text }}</span>
                                    <div class="flex gap-1">
                                        <button
                                            type="button"
                                            class="quiz-exam-btn flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-500 transition hover:bg-gray-100 disabled:opacity-30 dark:bg-gray-900 dark:hover:bg-gray-700"
                                            :disabled="i === 0"
                                            @click="moveItem(q.id, i, -1)"
                                        >
                                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M6 14L12 8L18 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        </button>
                                        <button
                                            type="button"
                                            class="quiz-exam-btn flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-500 transition hover:bg-gray-100 disabled:opacity-30 dark:bg-gray-900 dark:hover:bg-gray-700"
                                            :disabled="i === orderingItems[q.id].length - 1"
                                            @click="moveItem(q.id, i, 1)"
                                        >
                                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M6 10L12 16L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Matching -->
                            <div v-else-if="q.type === 'matching'" class="space-y-3">
                                <div
                                    v-for="opt in q.options"
                                    :key="opt.id"
                                    class="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 sm:gap-4"
                                >
                                    <div class="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                                        <svg class="h-4 w-4 shrink-0 text-yellow-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 5V3M12 21V19M5 12H3M21 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                        {{ opt.match_key || opt.text }}
                                    </div>
                                    <input
                                        v-model="answers[q.id].matches[opt.id]"
                                        type="text"
                                        autocomplete="off"
                                        class="quiz-exam-input h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                        :placeholder="$t('quiz.take.matchPlaceholder')"
                                        @copy.prevent
                                        @cut.prevent
                                        @paste.prevent
                                        @contextmenu.prevent
                                    />
                                </div>
                            </div>
                        </div>
                    </article>

                    <!-- One-question navigation -->
                    <div
                        v-if="oneQuestionMode"
                        class="mt-4 flex shrink-0 items-center justify-between gap-2"
                    >
                        <button
                            v-if="allowPreviousQuestion"
                            type="button"
                            class="quiz-exam-btn flex h-11 items-center gap-1.5 rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-30 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            :disabled="currentQuestionIndex === 0"
                            @click="prevQuestion"
                        >
                            <svg class="h-4 w-4 rotate-180 rtl:rotate-0" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            سوال قبل
                        </button>
                        <div v-else class="h-11 min-w-[1px]"></div>
                        <button
                            v-if="canSkipCurrent"
                            type="button"
                            class="quiz-exam-btn h-11 rounded-xl px-4 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            @click="skipQuestion"
                        >
                            {{ $t('quiz.take.skipQuestion') }}
                        </button>
                        <button
                            v-if="!isLastQuestion"
                            type="button"
                            class="quiz-exam-btn flex h-11 items-center gap-1.5 rounded-xl bg-gradient-to-l from-yellow-400 to-amber-400 px-5 text-sm font-bold text-gray-900 shadow-sm transition hover:from-yellow-300 hover:to-amber-300 disabled:opacity-30"
                            :disabled="!canGoNext"
                            @click="nextQuestion"
                        >
                            {{ $t('quiz.take.nextQuestion') }}
                            <svg class="h-4 w-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <p v-else class="flex-1 text-center text-xs text-gray-500 dark:text-gray-400">
                            {{ $t('quiz.take.useSubmitBar') }}
                        </p>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="shrink-0 border-t border-gray-200/80 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
                <div class="flex gap-2 px-4 py-3 lg:px-6">
                    <button
                        type="button"
                        class="quiz-exam-btn h-12 flex-1 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        :disabled="saving"
                        @click="saveProgress"
                    >
                        {{ saving ? $t('quiz.take.saving') : $t('quiz.take.saveProgress') }}
                    </button>
                    <button
                        type="button"
                        class="quiz-exam-btn h-12 flex-1 rounded-xl bg-gradient-to-l from-yellow-400 to-amber-400 text-sm font-bold text-gray-900 shadow-sm transition hover:from-yellow-300 hover:to-amber-300 disabled:opacity-50"
                        :disabled="saving"
                        @click="submitQuiz"
                    >
                        {{ saving ? $t('quiz.take.submitting') : $t('quiz.take.submitFinal') }}
                    </button>
                </div>
            </footer>
                </div>
            </div>

            <!-- Mobile: quiz/user info as a separate sheet -->
            <div
                v-if="mobileInfoOpen"
                class="fixed inset-0 z-[130] flex flex-col justify-end lg:hidden"
            >
                <button
                    type="button"
                    class="absolute inset-0 bg-gray-950/50"
                    :aria-label="$t('quiz.take.infoPanelClose')"
                    @click="mobileInfoOpen = false"
                ></button>
                <div class="relative max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                    <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('quiz.take.infoPanelTitle') }}</h3>
                        <button
                            type="button"
                            class="quiz-exam-btn flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            :aria-label="$t('quiz.take.infoPanelClose')"
                            @click="mobileInfoOpen = false"
                        >
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <QuizExamSidebar
                        :quiz="attempt.quiz"
                        :user="currentUser"
                        :attempt-number="attempt.attempt_number"
                        :locale="locale"
                        embedded
                    />
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import LoadingComponent from '@/views/components/LoadingComponent.vue';
import QuizExamSidebar from '@/views/components/quiz/QuizExamSidebar.vue';
import QuizThemeToggle from '@/views/components/quiz/QuizThemeToggle.vue';
import debounce from 'lodash/debounce';
import { startQuizAttempt, saveQuizProgress, submitQuizAttempt, resumeQuizAttempt } from '@/services/quiz.service';
import { showToastSuccess, showToastError } from '@/utils/toastConfig';
import { enableQuizSecurity, requestExamFullscreen, exitExamFullscreen, formatQuizNumber, QUIZ_SCREENSHOT_BLACKOUT_MS } from '@/utils/quizSecurity';
import { parseFillBlankText, blankCountFromQuestion } from '@/utils/quizFillBlank';
import '@/assets/css/quiz-exam.css';

export default {
    components: { LoadingComponent, QuizExamSidebar, QuizThemeToggle },
    props: { uuid: { type: String, default: null }, attemptUuid: { type: String, default: null } },
    data() {
        return {
            loading: true,
            saving: false,
            attempt: null,
            answers: {},
            orderingItems: {},
            timeSpent: 0,
            timer: null,
            startedAt: null,
            tick: 0,
            currentQuestionIndex: 0,
            cleanupSecurity: null,
            autoSaveReady: false,
            autoSaving: false,
            autoSavePending: false,
            autoSubmitting: false,
            examFinished: false,
            securityShield: null,
            screenshotBlackout: false,
            screenshotBlackoutTimer: null,
            securityFlags: {
                hidden: false,
                blurred: false,
                fullscreenMissing: false,
            },
            mobileInfoOpen: false,
        };
    },
    beforeRouteLeave(to, from, next) {
        if (this.examFinished || !this.attempt) {
            next();
            return;
        }
        next(window.confirm(this.$t('quiz.take.leaveConfirm')));
    },
    watch: {
        answers: {
            deep: true,
            handler() {
                if (!this.autoSaveReady || this.loading || !this.attempt) return;
                this.scheduleAutoSave();
            },
        },
    },
    created() {
        this.debouncedAutoSave = debounce(() => this.saveProgress({ silent: true }), 1200);
    },
    computed: {
        locale() {
            return this.$i18n.locale === 'en' ? 'en-US' : 'fa-IR';
        },
        currentUser() {
            return this.$store.state.auth?.status?.userInfo || null;
        },
        quizSettings() {
            return this.attempt?.quiz?.settings || {};
        },
        oneQuestionMode() {
            return !!this.quizSettings.one_question_at_a_time;
        },
        allowPreviousQuestion() {
            if (!this.oneQuestionMode) return false;
            return this.quizSettings.allow_previous_question !== false;
        },
        displayedQuestions() {
            if (!this.oneQuestionMode) {
                return this.questions.map((q, qIndex) => ({ q, qIndex }));
            }
            const q = this.questions[this.currentQuestionIndex];
            return q ? [{ q, qIndex: this.currentQuestionIndex }] : [];
        },
        canGoNext() {
            if (!this.oneQuestionMode || this.currentQuestionIndex >= this.questions.length - 1) return false;
            const q = this.questions[this.currentQuestionIndex];
            if (this.quizSettings.require_answer_before_next && !this.isAnswered(q)) return false;
            if (!this.quizSettings.allow_skip_questions && !this.isAnswered(q)) return false;
            return true;
        },
        canSkipCurrent() {
            if (!this.oneQuestionMode || this.isLastQuestion) return false;
            if (this.quizSettings.require_answer_before_next) return false;
            return !!this.quizSettings.allow_skip_questions;
        },
        isLastQuestion() {
            return this.currentQuestionIndex >= this.questions.length - 1;
        },
        questions() {
            const order = this.attempt?.question_order || [];
            const map = Object.fromEntries(
                (this.attempt?.answers || []).map(a => [a.question_id, a.question]).filter(([, q]) => q)
            );
            return order.map(id => map[id]).filter(Boolean);
        },
        answeredCount() {
            return this.questions.filter(q => this.isAnswered(q)).length;
        },
        progress() {
            if (!this.questions.length) return 0;
            return Math.round((this.answeredCount / this.questions.length) * 100);
        },
        timeRemaining() {
            void this.tick;
            if (!this.attempt?.expires_at) return null;
            const diff = Math.floor((new Date(this.attempt.expires_at) - Date.now()) / 1000);
            return Math.max(0, diff);
        },
        securityShieldTitle() {
            if (this.securityShield === 'tab') return this.$t('quiz.take.securityTabTitle');
            if (this.securityShield === 'fullscreen') return this.$t('quiz.take.securityFullscreenTitle');
            if (this.securityShield === 'screenshot') return this.$t('quiz.take.securityScreenshotTitle');
            return '';
        },
        securityShieldHint() {
            if (this.securityShield === 'tab') return this.$t('quiz.take.securityTabHint');
            if (this.securityShield === 'fullscreen') return this.$t('quiz.take.securityFullscreenHint');
            if (this.securityShield === 'screenshot') return this.$t('quiz.take.securityScreenshotHint');
            return '';
        },
        securityShieldActionLabel() {
            if (this.securityShield === 'fullscreen' || this.securityFlags.fullscreenMissing) {
                return this.$t('quiz.take.securityFullscreenBtn');
            }
            if (this.securityShield === 'tab') {
                return this.$t('quiz.take.securityReturnBtn');
            }
            return '';
        },
        examContentVisible() {
            return !this.securityShield && !this.screenshotBlackout;
        },
        watermarkText() {
            const settings = this.quizSettings;
            if (!settings.exam_watermark_enabled) return '';
            return (settings.exam_watermark_text || '').trim();
        },
    },
    async mounted() {
        try {
            if (this.attemptUuid) {
                const res = await resumeQuizAttempt(this.attemptUuid);
                this.attempt = res.attempt;
            } else {
                const res = await startQuizAttempt(this.uuid);
                this.attempt = res.attempt;
            }
            this.initAnswers();

            if (this.attempt?.expires_at && this.timeRemaining === 0) {
                await this.autoSubmit();
                return;
            }

            this.startedAt = Date.now();
            this.timer = setInterval(() => {
                this.timeSpent = Math.floor((Date.now() - this.startedAt) / 1000);
                this.tick++;
                if (this.timeRemaining === 0 && !this.autoSubmitting) this.autoSubmit();
            }, 1000);

            await this.$nextTick();
            this.autoSaveReady = true;
            this.cleanupSecurity = enableQuizSecurity(this.$refs.examRoot, {
                onTabHidden: () => {
                    this.securityFlags.hidden = true;
                    this.syncSecurityShield();
                },
                onTabVisible: () => {
                    this.securityFlags.hidden = false;
                    this.syncSecurityShield();
                },
                onFullscreenExit: () => {
                    this.securityFlags.fullscreenMissing = true;
                    this.syncSecurityShield();
                },
                onFullscreenEntered: () => {
                    this.securityFlags.fullscreenMissing = false;
                    this.syncSecurityShield();
                },
                onScreenshotAttempt: () => this.activateScreenshotDefense(),
                onWindowBlur: () => {
                    this.securityFlags.blurred = true;
                    this.syncSecurityShield();
                },
                onWindowFocus: () => {
                    this.securityFlags.blurred = false;
                    this.syncSecurityShield();
                },
                onSecurityAudit: ({ fullscreenActive, fullscreenRequired, focused, visible }) => {
                    this.securityFlags.hidden = !visible;
                    this.securityFlags.blurred = !focused;
                    this.securityFlags.fullscreenMissing = fullscreenRequired && !fullscreenActive;
                    this.syncSecurityShield();
                },
            });
            await requestExamFullscreen();
            this.syncSecurityShield();
        } catch (e) {
            const status = e?.response?.status;
            if (this.uuid && (status === 404 || status === 403 || status === 422)) {
                this.$router.replace({ name: 'quiz-intro', params: { uuid: this.uuid } });
                return;
            }
            if (status === 404 || status === 403 || status === 422) {
                this.$router.replace({ name: 'NotFound' });
                return;
            }
            if (this.uuid) {
                this.$router.replace({ name: 'quiz-intro', params: { uuid: this.uuid } });
            } else {
                this.$router.replace({ name: 'NotFound' });
            }
        } finally {
            this.loading = false;
        }
    },
    beforeUnmount() {
        if (this.timer) clearInterval(this.timer);
        if (this.screenshotBlackoutTimer) clearTimeout(this.screenshotBlackoutTimer);
        if (this.debouncedAutoSave?.cancel) this.debouncedAutoSave.cancel();
        if (this.cleanupSecurity) this.cleanupSecurity();
        exitExamFullscreen();
    },
    methods: {
        formatQuizNumber,
        syncSecurityShield() {
            if (this.screenshotBlackout) {
                this.securityShield = 'screenshot';
                this.mobileInfoOpen = false;
                return;
            }
            if (this.securityFlags.hidden || this.securityFlags.blurred) {
                this.securityShield = 'tab';
                this.mobileInfoOpen = false;
                return;
            }
            if (this.securityFlags.fullscreenMissing) {
                this.securityShield = 'fullscreen';
                this.mobileInfoOpen = false;
                return;
            }
            this.securityShield = null;
        },
        activateScreenshotDefense() {
            this.screenshotBlackout = true;
            this.syncSecurityShield();
            if (this.screenshotBlackoutTimer) clearTimeout(this.screenshotBlackoutTimer);
            this.screenshotBlackoutTimer = window.setTimeout(() => {
                this.screenshotBlackout = false;
                this.syncSecurityShield();
            }, QUIZ_SCREENSHOT_BLACKOUT_MS);
        },
        async restoreFullscreen() {
            await requestExamFullscreen();
            this.securityFlags.fullscreenMissing = false;
            this.syncSecurityShield();
        },
        async handleSecurityShieldAction() {
            try {
                window.focus();
            } catch {
                /* ignore */
            }
            this.securityFlags.blurred = false;
            this.securityFlags.hidden = document.visibilityState === 'hidden';
            if (this.securityFlags.fullscreenMissing || this.securityShield === 'fullscreen') {
                await this.restoreFullscreen();
                return;
            }
            this.syncSecurityShield();
        },
        formatClock(seconds) {
            const m = String(Math.floor(seconds / 60)).padStart(2, '0');
            const s = String(seconds % 60).padStart(2, '0');
            return `${m}:${s}`;
        },
        fillBlankParts(q) {
            return parseFillBlankText(q?.text || '');
        },
        blankCount(q) {
            return blankCountFromQuestion(q) || 1;
        },
        shuffleItems(items) {
            const list = [...items];
            for (let i = list.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [list[i], list[j]] = [list[j], list[i]];
            }
            return list;
        },
        defaultAnswer(q) {
            if (q.type === 'multiple_choice') return { option_ids: [] };
            if (q.type === 'single_choice' || q.type === 'true_false') return { option_ids: [] };
            if (q.type === 'fill_blank') return { blanks: [] };
            if (q.type === 'matching') return { matches: {} };
            if (q.type === 'ordering') return { order: [] };
            return { text: '' };
        },
        initAnswers() {
            this.questions.forEach(q => {
                const existing = (this.attempt.answers || []).find(a => a.question_id === q.id);
                const base = this.defaultAnswer(q);
                this.answers[q.id] = { ...base, ...(existing?.answer || {}) };

                if (q.type === 'ordering') {
                    const opts = q.options || [];
                    const savedOrder = existing?.answer?.order || [];
                    let items;
                    if (savedOrder.length) {
                        const byId = Object.fromEntries(opts.map(o => [o.id, o]));
                        items = savedOrder.map(id => byId[id]).filter(Boolean);
                        opts.forEach((o) => {
                            if (!items.find(x => x.id === o.id)) items.push(o);
                        });
                    } else {
                        items = this.shuffleItems([...opts]);
                    }
                    this.orderingItems[q.id] = items;
                    this.answers[q.id].order = items.map(o => o.id);
                }
            });
        },
        isSelected(qid, optId) {
            return (this.answers[qid]?.option_ids || []).includes(optId);
        },
        isAnswered(q) {
            const a = this.answers[q.id];
            if (!a) return false;
            if (['single_choice', 'multiple_choice', 'true_false'].includes(q.type)) return (a.option_ids || []).length > 0;
            if (q.type === 'fill_blank') return (a.blanks || []).some(b => b && b.trim());
            if (q.type === 'matching') return Object.values(a.matches || {}).some(v => v && v.trim());
            if (q.type === 'ordering') return (a.order || []).length > 0;
            return !!(a.text && a.text.trim());
        },
        onSingleSelect(qid, optId) {
            this.answers[qid].option_ids = [optId];
        },
        toggleMultiple(qid, optId) {
            const ids = this.answers[qid].option_ids || [];
            const idx = ids.indexOf(optId);
            if (idx >= 0) ids.splice(idx, 1);
            else ids.push(optId);
            this.answers[qid].option_ids = [...ids];
        },
        prevQuestion() {
            if (!this.allowPreviousQuestion) return;
            if (this.currentQuestionIndex > 0) this.currentQuestionIndex -= 1;
        },
        nextQuestion() {
            if (this.canGoNext) this.currentQuestionIndex += 1;
        },
        skipQuestion() {
            if (this.canSkipCurrent && this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex += 1;
            }
        },
        moveItem(qid, index, dir) {
            const arr = this.orderingItems[qid];
            const target = index + dir;
            if (target < 0 || target >= arr.length) return;
            const tmp = arr[index];
            arr.splice(index, 1);
            arr.splice(target, 0, tmp);
            this.answers[qid].order = arr.map(o => o.id);
        },
        scheduleAutoSave() {
            if (this.saving) {
                this.autoSavePending = true;
                return;
            }
            this.debouncedAutoSave();
        },
        buildPayload() {
            return {
                time_spent: this.timeSpent,
                answers: Object.entries(this.answers).map(([question_id, answer]) => ({
                    question_id: parseInt(question_id, 10),
                    answer,
                })),
            };
        },
        async saveProgress({ silent = false } = {}) {
            if (!this.attempt) return;
            if (silent) {
                if (this.saving) {
                    this.autoSavePending = true;
                    return;
                }
                if (this.autoSaving) {
                    this.autoSavePending = true;
                    return;
                }
                this.autoSaving = true;
            } else {
                if (this.debouncedAutoSave?.cancel) this.debouncedAutoSave.cancel();
                this.autoSavePending = false;
                this.saving = true;
            }
            try {
                const res = await saveQuizProgress(this.attempt.uuid, this.buildPayload());
                this.attempt = res.attempt;
                if (!silent) showToastSuccess(this.$t('quiz.take.saveSuccess'));
            } catch {
                if (!silent) showToastError(this.$t('quiz.take.saveError'));
            } finally {
                if (silent) {
                    this.autoSaving = false;
                    if (this.autoSavePending) {
                        this.autoSavePending = false;
                        this.debouncedAutoSave();
                    }
                } else {
                    this.saving = false;
                }
            }
        },
        async autoSubmit() {
            if (this.autoSubmitting || this.saving) return;
            this.autoSubmitting = true;
            if (this.debouncedAutoSave?.cancel) this.debouncedAutoSave.cancel();
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            await this.submitQuiz(true);
        },
        async submitQuiz(auto = false) {
            if (!auto && !confirm(this.$t('quiz.take.submitConfirm'))) return;
            if (this.debouncedAutoSave?.cancel) this.debouncedAutoSave.cancel();
            this.saving = true;
            try {
                await submitQuizAttempt(this.attempt.uuid, this.buildPayload());
                if (this.timer) clearInterval(this.timer);
                this.examFinished = true;
                if (this.cleanupSecurity) {
                    this.cleanupSecurity();
                    this.cleanupSecurity = null;
                }
                await exitExamFullscreen();
                this.$router.push({ name: 'quiz-result', params: { attemptUuid: this.attempt.uuid } });
            } finally {
                this.saving = false;
            }
        },
    },
};
</script>
