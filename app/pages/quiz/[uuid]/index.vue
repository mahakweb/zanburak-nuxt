<script setup>
definePageMeta({
  name: "quiz-intro",
  middleware: ['auth'],
})
</script>

<template>
    <MasterPage>
        <div class="min-h-[calc(100vh-12rem)] md:mt-6">
            <div class="mx-auto max-w-5xl px-4 py-8 md:py-14">
                <LoadingComponent v-if="loading" />

                <div v-else-if="quiz" class="quiz-exam-root">
                    <div v-if="showInstructions" class="mx-auto max-w-2xl">
                        <button
                            type="button"
                            class="quiz-exam-btn mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            @click="showInstructions = false"
                        >
                            <svg class="h-4 w-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            {{ $t('quiz.intro.back') }}
                        </button>
                        <MarkdownRenderer
                            :source="quiz.instructions"
                            start-class="rendered-content github-markdown-body leading-8 text-gray-700 dark:text-gray-200"
                        />
                    </div>

                    <div v-else class="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-12">
                        <section>
                            <p class="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-gray-400 dark:text-gray-500">
                                <span class="h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
                                {{ $t('quiz.intro.badge') }}
                            </p>

                            <h1 class="mt-4 text-[1.75rem] font-black leading-[1.35] text-gray-900 md:text-4xl dark:text-white">
                                {{ quiz.title }}
                            </h1>

                            <p v-if="quiz.description" class="mt-3 max-w-xl text-[15px] leading-8 text-gray-500 dark:text-gray-400">
                                {{ quiz.description }}
                            </p>

                            <button
                                v-if="hasInstructions"
                                type="button"
                                class="quiz-exam-btn mt-4 text-sm font-bold text-gray-900 underline decoration-yellow-400 underline-offset-[6px] transition hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
                                @click="showInstructions = true"
                            >
                                {{ $t('quiz.intro.instructions') }}
                            </button>

                            <QuizCountdown
                                v-if="scheduleStatus === 'not_started' && quiz.start_at"
                                class="mt-8"
                                :target="quiz.start_at"
                                :locale="locale"
                                :tick="nowTick"
                            />

                            <div
                                v-else-if="scheduleStatus === 'ended'"
                                class="mt-8 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300"
                            >
                                {{ $t('quiz.intro.scheduleEnded') }}
                            </div>

                            <div
                                v-if="attemptsExhausted && !activeAttemptUuid"
                                class="mt-8 rounded-xl bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300"
                            >
                                {{ $t('quiz.intro.attemptsExhausted') }}
                            </div>

                            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <router-link
                                    v-if="activeAttemptUuid && canAccessQuiz"
                                    :to="{ name: 'quiz-resume', params: { attemptUuid: activeAttemptUuid } }"
                                    class="quiz-intro-cta quiz-exam-btn"
                                >
                                    <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                    {{ $t('quiz.intro.resume') }}
                                </router-link>
                                <router-link
                                    v-else-if="canStartQuiz"
                                    :to="{ name: 'quiz-start', params: { uuid } }"
                                    class="quiz-intro-cta quiz-exam-btn"
                                >
                                    {{ $t('quiz.intro.start') }}
                                    <svg class="h-4 w-4 shrink-0 rtl:rotate-180" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </router-link>
                                <span
                                    v-else-if="attemptsExhausted"
                                    class="quiz-intro-cta quiz-intro-cta--locked"
                                    role="button"
                                    aria-disabled="true"
                                >
                                    {{ $t('quiz.intro.start') }}
                                </span>
                                <span
                                    v-else-if="scheduleStatus === 'not_started'"
                                    class="quiz-intro-cta quiz-intro-cta--locked"
                                    role="button"
                                    aria-disabled="true"
                                >
                                    {{ $t('quiz.intro.startLocked') }}
                                </span>
                                <span
                                    v-else-if="scheduleStatus === 'ended'"
                                    class="quiz-intro-cta quiz-intro-cta--locked"
                                    role="button"
                                    aria-disabled="true"
                                >
                                    {{ $t('quiz.intro.start') }}
                                </span>
                                <span
                                    v-else
                                    class="quiz-intro-cta quiz-intro-cta--locked"
                                    role="button"
                                    aria-disabled="true"
                                >
                                    {{ $t('quiz.intro.notAvailable') }}
                                </span>

                                <router-link
                                    :to="{ name: 'quiz-history' }"
                                    class="quiz-exam-btn inline-flex h-12 items-center justify-center px-2 text-sm font-semibold text-gray-400 transition hover:text-gray-900 dark:hover:text-white"
                                >
                                    {{ $t('quiz.intro.history') }}
                                </router-link>
                            </div>
                        </section>

                        <aside class="lg:sticky lg:top-24">
                            <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <span class="absolute inset-y-0 start-0 w-1 bg-yellow-400"></span>

                                <dl>
                                    <div
                                        v-for="(stat, index) in stats"
                                        :key="stat.key"
                                        class="flex items-center justify-between gap-4 px-5 py-3.5"
                                        :class="index !== stats.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''"
                                    >
                                        <dt class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-300" v-html="stat.icon"></span>
                                            {{ stat.label }}
                                        </dt>
                                        <dd class="text-lg font-black tabular-nums text-gray-900 dark:text-white">{{ stat.value }}</dd>
                                    </div>
                                </dl>

                                <ul v-if="rules.length" class="space-y-2.5 border-t border-gray-100 px-5 py-4 dark:border-gray-800">
                                    <li
                                        v-for="(rule, i) in rules"
                                        :key="i"
                                        class="flex items-start gap-2.5 text-[13px] leading-7 text-gray-500 dark:text-gray-400"
                                    >
                                        <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400"></span>
                                        <span>{{ rule }}</span>
                                    </li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>

                <div v-else class="py-20 text-center text-sm text-gray-400">
                    {{ $t('quiz.intro.notFound') }}
                </div>
            </div>
        </div>
    </MasterPage>
</template>

<script>
import MasterPage from '@/views/page/layouts/MasterPage.vue';
import LoadingComponent from '@/views/components/LoadingComponent.vue';
import MarkdownRenderer from '@/views/components/home/MarkdownRenderer.vue';
import QuizCountdown from '@/views/components/quiz/QuizCountdown.vue';
import { getStudentQuiz } from '@/services/quiz.service';
import { formatQuizNumber } from '@/utils/quizSecurity';
import '@/assets/css/quiz-exam.css';

const STAT_ICONS = {
    questions: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M8 6H20M8 12H20M8 18H14M4 6H4.01M4 12H4.01M4 18H4.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    score: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M12 15L8.5 17.5L9.5 13.5L6.5 10.5L10.5 10L12 6.5L13.5 10L17.5 10.5L14.5 13.5L15.5 17.5L12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    time: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M12 9V13L14 15M9 2H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    attempts: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M4 4V9H9M20 20V15H15M4 20L9 15M20 4L15 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

export default {
    components: { MasterPage, LoadingComponent, MarkdownRenderer, QuizCountdown },
    props: { uuid: { type: String, required: true } },
    data() {
        return {
            loading: true,
            quiz: null,
            activeAttemptUuid: null,
            userAttemptsCount: 0,
            attemptsExhausted: false,
            canStartNewAttempt: false,
            showInstructions: false,
            nowTick: 0,
            scheduleTimer: null,
        };
    },
    computed: {
        hasInstructions() {
            return !!(this.quiz?.instructions?.trim());
        },
        scheduleStatus() {
            void this.nowTick;
            if (!this.quiz) return 'unpublished';
            const now = Date.now();
            if (this.quiz.start_at && new Date(this.quiz.start_at).getTime() > now) return 'not_started';
            if (this.quiz.end_at && new Date(this.quiz.end_at).getTime() < now) return 'ended';
            return 'open';
        },
        canStartQuiz() {
            if (!this.quiz || this.activeAttemptUuid) return false;
            if (this.attemptsExhausted) return false;
            return this.scheduleStatus === 'open';
        },
        canAccessQuiz() {
            return this.scheduleStatus === 'open';
        },
        locale() {
            return this.$i18n.locale === 'en' ? 'en-US' : 'fa-IR';
        },
        stats() {
            if (!this.quiz) return [];
            const timeVal = this.quiz.time_limit
                ? `${formatQuizNumber(Math.round(this.quiz.time_limit / 60), this.locale)}′`
                : '∞';
            const used = formatQuizNumber(this.userAttemptsCount, this.locale);
            const attemptsVal = this.quiz.max_attempts
                ? this.$t('quiz.intro.attemptsRatio', {
                    used,
                    max: formatQuizNumber(this.quiz.max_attempts, this.locale),
                })
                : used;
            return [
                { key: 'questions', value: formatQuizNumber(this.quiz.questions_count || 0, this.locale), label: this.$t('quiz.intro.statQuestions'), icon: STAT_ICONS.questions },
                { key: 'score', value: formatQuizNumber(this.quiz.total_score || 0, this.locale), label: this.$t('quiz.intro.statTotalScore'), icon: STAT_ICONS.score },
                { key: 'time', value: timeVal, label: this.$t('quiz.intro.statTime'), icon: STAT_ICONS.time },
                { key: 'attempts', value: attemptsVal, label: this.$t('quiz.intro.statAttempts'), icon: STAT_ICONS.attempts },
            ];
        },
        rules() {
            if (!this.quiz) return [];
            const list = [];
            if (this.quiz.passing_percentage) {
                list.push(this.$t('quiz.intro.rulePassing', { percent: this.quiz.passing_percentage }));
            } else if (this.quiz.passing_score) {
                list.push(this.$t('quiz.intro.rulePassingScore', { score: this.quiz.passing_score }));
            }
            if (this.quiz.manual_review_required) {
                list.push(this.$t('quiz.intro.ruleManualReview'));
            }
            if (this.quiz.start_at || this.quiz.end_at) {
                list.push(this.scheduleText);
            } else {
                list.push(this.$t('quiz.intro.rulePermanent'));
            }
            list.push(this.$t('quiz.intro.ruleResume'));
            return list;
        },
        scheduleText() {
            if (!this.quiz) return '';
            const fmt = (d) => new Date(d).toLocaleString(this.locale, {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            });
            if (this.quiz.start_at && this.quiz.end_at) {
                return this.$t('quiz.intro.scheduleRange', { start: fmt(this.quiz.start_at), end: fmt(this.quiz.end_at) });
            }
            if (this.quiz.start_at) {
                return this.$t('quiz.intro.scheduleFrom', { start: fmt(this.quiz.start_at) });
            }
            return this.$t('quiz.intro.scheduleUntil', { end: fmt(this.quiz.end_at) });
        },
    },
    async mounted() {
        this.scheduleTimer = setInterval(() => { this.nowTick++; }, 1000);
        try {
            const res = await getStudentQuiz(this.uuid);
            this.quiz = res.quiz;
            this.activeAttemptUuid = res.active_attempt_uuid || null;
            this.userAttemptsCount = res.user_attempts_count ?? 0;
            this.attemptsExhausted = !!res.attempts_exhausted;
            this.canStartNewAttempt = !!res.can_start_new_attempt;
        } catch {
            this.quiz = null;
        } finally {
            this.loading = false;
        }
    },
    beforeUnmount() {
        if (this.scheduleTimer) clearInterval(this.scheduleTimer);
    },
};
</script>
