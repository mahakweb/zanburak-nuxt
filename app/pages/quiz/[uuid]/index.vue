<script setup>
definePageMeta({
  name: "quiz-intro",
  middleware: ['auth'],
  layout: 'default',
  props: true,
})
</script>

<template>
    <MasterPage>
        <div class="min-h-[calc(100vh-14rem)] py-8 md:py-14">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <!-- Loading State -->
                <LoadingComponent v-if="loading" />

                <!-- Quiz Not Found -->
                <div v-else-if="!quiz" class="mx-auto max-w-md text-center py-20">
                    <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 mb-6">
                        <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <h2 class="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                        {{ $t('quiz.intro.notFound') || 'آزمون یافت نشد' }}
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        متأسفانه آزمون مورد نظر شما یافت نشد یا در دسترس نمی‌باشد.
                    </p>
                    <div class="flex items-center justify-center gap-3">
                        <router-link
                            :to="{ name: 'quiz-history' }"
                            class="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition"
                        >
                            {{ $t('quiz.intro.history') || 'تاریخچه آزمون‌ها' }}
                        </router-link>
                        <router-link
                            to="/"
                            class="rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 transition"
                        >
                            {{ $t('home.title') || 'صفحه اصلی' }}
                        </router-link>
                    </div>
                </div>

                <!-- Quiz Detail Content -->
                <div v-else class="space-y-8">
                    <!-- Top Navigation Bar & Breadcrumb -->
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <nav class="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-400 dark:text-gray-500">
                            <router-link to="/" class="hover:text-amber-500 transition">
                                {{ $t('home.title') || 'صفحه اصلی' }}
                            </router-link>
                            <span>/</span>
                            <router-link :to="{ name: 'quiz-history' }" class="hover:text-amber-500 transition">
                                {{ $t('quiz.intro.history') || 'آزمون‌ها' }}
                            </router-link>
                            <span>/</span>
                            <span class="text-gray-700 dark:text-gray-300 font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                                {{ quiz.title }}
                            </span>
                        </nav>

                        <!-- Status Pill -->
                        <div>
                            <span
                                v-if="scheduleStatus === 'open'"
                                class="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400"
                            >
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                در حال برگزاری
                            </span>
                            <span
                                v-else-if="scheduleStatus === 'not_started'"
                                class="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400"
                            >
                                <span class="h-2 w-2 rounded-full bg-amber-500"></span>
                                شروع نشده
                            </span>
                            <span
                                v-else
                                class="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 px-3.5 py-1 text-xs font-bold text-rose-700 dark:text-rose-400"
                            >
                                <span class="h-2 w-2 rounded-full bg-rose-500"></span>
                                مهلت پایان یافته
                            </span>
                        </div>
                    </div>

                    <!-- Main Grid Layout -->
                    <div class="grid items-start gap-8 lg:grid-cols-12">
                        <!-- Left / Primary Column -->
                        <div class="lg:col-span-7 xl:col-span-8 space-y-6">
                            <!-- Hero Title Card -->
                            <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm">
                                <div class="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 mb-4">
                                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    {{ $t('quiz.intro.badge') || 'مشخصات و راهنمای آزمون' }}
                                </div>

                                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black leading-snug text-gray-900 dark:text-white">
                                    {{ quiz.title }}
                                </h1>

                                <p v-if="quiz.description" class="mt-4 text-sm sm:text-base leading-8 text-gray-600 dark:text-gray-300 font-medium">
                                    {{ quiz.description }}
                                </p>

                                <!-- Countdown if not started -->
                                <div v-if="scheduleStatus === 'not_started' && quiz.start_at" class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                                        زمان باقی‌مانده تا شروع آزمون
                                    </p>
                                    <QuizCountdown
                                        :target="quiz.start_at"
                                        :locale="locale"
                                        :tick="nowTick"
                                    />
                                </div>

                                <!-- Schedule Ended Notice -->
                                <div
                                    v-else-if="scheduleStatus === 'ended'"
                                    class="mt-6 flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-800 dark:text-amber-300"
                                >
                                    <svg class="w-5 h-5 shrink-0 mt-0.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    <div class="leading-relaxed">
                                        {{ $t('quiz.intro.scheduleEnded') || 'مهلت زمان برگزاری این آزمون به پایان رسیده است.' }}
                                    </div>
                                </div>

                                <!-- Attempts Exhausted Notice -->
                                <div
                                    v-if="attemptsExhausted && !activeAttemptUuid"
                                    class="mt-6 flex items-start gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-800 dark:text-rose-300"
                                >
                                    <svg class="w-5 h-5 shrink-0 mt-0.5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="15" y1="9" x2="9" y2="15"/>
                                        <line x1="9" y1="9" x2="15" y2="15"/>
                                    </svg>
                                    <div class="leading-relaxed">
                                        {{ $t('quiz.intro.attemptsExhausted') || 'شما حداکثر دفعات مجاز برای شرکت در این آزمون را استفاده کرده‌اید.' }}
                                    </div>
                                </div>

                                <!-- Action / Start Buttons -->
                                <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4">
                                    <router-link
                                        v-if="activeAttemptUuid && canAccessQuiz"
                                        :to="{ name: 'quiz-resume', params: { attemptUuid: activeAttemptUuid } }"
                                        class="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 px-8 py-3.5 text-base font-extrabold text-gray-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition duration-200 active:scale-95"
                                    >
                                        <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        {{ $t('quiz.intro.resume') || 'ادامه آزمون فعال' }}
                                    </router-link>

                                    <router-link
                                        v-else-if="canStartQuiz"
                                        :to="{ name: 'quiz-start', params: { uuid } }"
                                        class="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 px-8 py-3.5 text-base font-extrabold text-gray-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition duration-200 active:scale-95"
                                    >
                                        <span>{{ $t('quiz.intro.start') || 'شروع آزمون' }}</span>
                                        <svg class="h-5 w-5 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M5 12H19M19 12L13 6M19 12L13 18"/>
                                        </svg>
                                    </router-link>

                                    <span
                                        v-else
                                        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 px-8 py-3.5 text-sm font-bold cursor-not-allowed select-none"
                                    >
                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                        <span v-if="attemptsExhausted">{{ $t('quiz.intro.start') || 'فرصت‌ها پایان یافته' }}</span>
                                        <span v-else-if="scheduleStatus === 'not_started'">{{ $t('quiz.intro.startLocked') || 'آزمون هنوز شروع نشده است' }}</span>
                                        <span v-else-if="scheduleStatus === 'ended'">{{ $t('quiz.intro.start') || 'مهلت آزمون تمام شده' }}</span>
                                        <span v-else>{{ $t('quiz.intro.notAvailable') || 'آزمون در دسترس نیست' }}</span>
                                    </span>

                                    <router-link
                                        :to="{ name: 'quiz-history' }"
                                        class="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-300 transition"
                                    >
                                        <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        {{ $t('quiz.intro.history') || 'سوابق و کارنامه‌ها' }}
                                    </router-link>
                                </div>
                            </div>

                            <!-- Instructions Accordion / Section -->
                            <div v-if="hasInstructions" class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm transition">
                                <button
                                    type="button"
                                    @click="showInstructions = !showInstructions"
                                    class="w-full flex items-center justify-between p-6 sm:p-7 text-start hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition"
                                >
                                    <div class="flex items-center gap-3">
                                        <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                <polyline points="14 2 14 8 20 8"/>
                                                <line x1="16" y1="13" x2="8" y2="13"/>
                                                <line x1="16" y1="17" x2="8" y2="17"/>
                                                <polyline points="10 9 9 9 8 9"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 class="text-base font-bold text-gray-900 dark:text-white">
                                                {{ $t('quiz.intro.instructions') || 'راهنما و دستورالعمل‌های آزمون' }}
                                            </h3>
                                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                نکات ضروری پیش از شروع پاسخ‌دهی به آزمون
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                            {{ showInstructions ? 'بستن' : 'مشاهده' }}
                                        </span>
                                        <svg
                                            class="w-5 h-5 text-gray-400 transition-transform duration-200"
                                            :class="{ 'rotate-180': showInstructions }"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    </div>
                                </button>

                                <div v-if="showInstructions" class="border-t border-gray-100 dark:border-gray-800 p-6 sm:p-8 bg-gray-50/50 dark:bg-gray-800/20">
                                    <MarkdownRenderer
                                        :source="quiz.instructions"
                                        start-class="rendered-content github-markdown-body leading-8 text-gray-700 dark:text-gray-200 text-sm md:text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Right / Sidebar Column -->
                        <div class="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
                            <!-- Stats Grid Card -->
                            <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                                <h3 class="text-base font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                    <span class="h-2 w-2 rounded-full bg-amber-400"></span>
                                    مشخصات آزمون
                                </h3>

                                <div class="grid grid-cols-2 gap-3.5">
                                    <div
                                        v-for="stat in stats"
                                        :key="stat.key"
                                        class="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/70 dark:bg-gray-800/40 p-4 transition hover:border-amber-400/30"
                                    >
                                        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                            <span class="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400/15 text-amber-600 dark:text-amber-400 shrink-0" v-html="stat.icon"></span>
                                            <span class="truncate">{{ stat.label }}</span>
                                        </div>
                                        <div class="text-xl font-black tabular-nums text-gray-900 dark:text-white">
                                            {{ stat.value }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Rules & Passing Criteria Card -->
                            <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                                <h3 class="text-base font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                    قوانین و شرایط قبولی
                                </h3>

                                <ul v-if="rules.length" class="space-y-3">
                                    <li
                                        v-for="(rule, i) in rules"
                                        :key="i"
                                        class="flex items-start gap-2.5 text-xs sm:text-[13px] leading-6 text-gray-600 dark:text-gray-300 font-medium"
                                    >
                                        <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"></span>
                                        <span>{{ rule }}</span>
                                    </li>
                                </ul>

                                <div class="mt-5 rounded-2xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/15 p-3.5 text-xs leading-6 text-amber-800 dark:text-amber-300">
                                    💡 <strong>توصیه مهم:</strong> پیش از فشردن دکمه شروع، از پایداری اتصال اینترنت و شارژ دستگاه خود اطمینان حاصل فرمایید.
                                </div>
                            </div>
                        </div>
                    </div>
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
    questions: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M8 6H20M8 12H20M8 18H14M4 6H4.01M4 12H4.01M4 18H4.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    score: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M12 15L8.5 17.5L9.5 13.5L6.5 10.5L10.5 10L12 6.5L13.5 10L17.5 10.5L14.5 13.5L15.5 17.5L12 15Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    time: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="2"/><path d="M12 9V13L14 15M9 2H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    attempts: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M4 4V9H9M20 20V15H15M4 20L9 15M20 4L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
                ? `${formatQuizNumber(Math.round(this.quiz.time_limit / 60), this.locale)} دقیقه`
                : 'بدون محدودیت';
            const used = formatQuizNumber(this.userAttemptsCount, this.locale);
            const attemptsVal = this.quiz.max_attempts
                ? this.$t('quiz.intro.attemptsRatio', {
                    used,
                    max: formatQuizNumber(this.quiz.max_attempts, this.locale),
                })
                : `${used} بار`;
            return [
                { key: 'questions', value: formatQuizNumber(this.quiz.questions_count || 0, this.locale), label: this.$t('quiz.intro.statQuestions') || 'تعداد سوالات', icon: STAT_ICONS.questions },
                { key: 'score', value: formatQuizNumber(this.quiz.total_score || 0, this.locale), label: this.$t('quiz.intro.statTotalScore') || 'نمره کل آزمون', icon: STAT_ICONS.score },
                { key: 'time', value: timeVal, label: this.$t('quiz.intro.statTime') || 'مدت زمان', icon: STAT_ICONS.time },
                { key: 'attempts', value: attemptsVal, label: this.$t('quiz.intro.statAttempts') || 'دفعات مجاز', icon: STAT_ICONS.attempts },
            ];
        },
        rules() {
            if (!this.quiz) return [];
            const list = [];
            if (this.quiz.passing_percentage) {
                list.push(this.$t('quiz.intro.rulePassing', { percent: this.quiz.passing_percentage }) || `حد نصاب قبولی: ${this.quiz.passing_percentage}٪`);
            } else if (this.quiz.passing_score) {
                list.push(this.$t('quiz.intro.rulePassingScore', { score: this.quiz.passing_score }) || `حد نصاب قبولی: نمره ${this.quiz.passing_score}`);
            }
            if (this.quiz.manual_review_required) {
                list.push(this.$t('quiz.intro.ruleManualReview') || 'این آزمون نیازمند بازبینی و تصحیح دستی توسط مدرس می‌باشد.');
            }
            if (this.quiz.start_at || this.quiz.end_at) {
                list.push(this.scheduleText);
            } else {
                list.push(this.$t('quiz.intro.rulePermanent') || 'این آزمون محدودیت تقویمی نداشته و در هر زمان قابل شرکت است.');
            }
            list.push(this.$t('quiz.intro.ruleResume') || 'در صورت قطع ارتباط اینترنت، با بازگشت به همین صفحه می‌توانید آزمون را ادامه دهید.');
            return list;
        },
        scheduleText() {
            if (!this.quiz) return '';
            const fmt = (d) => new Date(d).toLocaleString(this.locale, {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            });
            if (this.quiz.start_at && this.quiz.end_at) {
                return this.$t('quiz.intro.scheduleRange', { start: fmt(this.quiz.start_at), end: fmt(this.quiz.end_at) }) || `بازه برگزاری: از ${fmt(this.quiz.start_at)} تا ${fmt(this.quiz.end_at)}`;
            }
            if (this.quiz.start_at) {
                return this.$t('quiz.intro.scheduleFrom', { start: fmt(this.quiz.start_at) }) || `زمان شروع: از ${fmt(this.quiz.start_at)}`;
            }
            return this.$t('quiz.intro.scheduleUntil', { end: fmt(this.quiz.end_at) }) || `مهلت اتمام: تا ${fmt(this.quiz.end_at)}`;
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
