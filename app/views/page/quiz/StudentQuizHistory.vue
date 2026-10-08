<template>
    <PanelMasterPage>
        <div class="w-full max-w-4xl mx-auto px-2 md:px-0 py-4 md:py-6 space-y-5">
            <!-- Header -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-6 shadow-xl">
                <div class="pointer-events-none absolute -top-24 -end-16 h-56 w-56 rounded-full bg-amber-500/25 blur-3xl"></div>
                <div class="pointer-events-none absolute -bottom-24 -start-16 h-56 w-56 rounded-full bg-yellow-400/15 blur-3xl"></div>
                <div class="pointer-events-none absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(circle at 2px 2px, #fff 1px, transparent 0); background-size: 26px 26px;"></div>

                <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <span class="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400 ring-1 ring-amber-400/20">
                            <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </span>
                        <div>
                            <h1 class="text-base md:text-lg font-bold text-white leading-tight">{{ $t('quiz.history.title') }}</h1>
                            <p class="text-xs text-gray-300/80 mt-1">{{ $t('quiz.history.subtitle') }}</p>
                        </div>
                    </div>

                    <!-- Summary stats -->
                    <div v-if="!loading && history.length" class="grid grid-cols-3 gap-2 sm:gap-3">
                        <div class="rounded-2xl bg-white/10 backdrop-blur px-3 py-2 text-center ring-1 ring-white/10">
                            <p class="text-base md:text-xl font-extrabold text-white leading-none">{{ history.length }}</p>
                            <p class="text-[10px] md:text-xs text-gray-300/80 mt-1">{{ $t('quiz.history.statAttempts') }}</p>
                        </div>
                        <div class="rounded-2xl bg-white/10 backdrop-blur px-3 py-2 text-center ring-1 ring-white/10">
                            <p class="text-base md:text-xl font-extrabold text-green-400 leading-none">{{ passedCount }}</p>
                            <p class="text-[10px] md:text-xs text-gray-300/80 mt-1">{{ $t('quiz.history.statPassed') }}</p>
                        </div>
                        <div class="rounded-2xl bg-white/10 backdrop-blur px-3 py-2 text-center ring-1 ring-white/10">
                            <p class="text-base md:text-xl font-extrabold text-amber-400 leading-none">{{ bestScore != null ? bestScore + '%' : '—' }}</p>
                            <p class="text-[10px] md:text-xs text-gray-300/80 mt-1">{{ $t('quiz.history.statBest') }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading" class="space-y-3">
                <div v-for="i in 5" :key="i"
                    class="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-5 shadow-sm">
                    <span class="absolute inset-y-0 start-0 w-1.5 bg-gray-200 dark:bg-gray-700"></span>
                    <div class="flex items-center gap-4 ms-1">
                        <div class="animate-pulse shrink-0 w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div class="flex-1 min-w-0 space-y-3">
                            <div class="animate-pulse h-3.5 w-2/3 max-w-[16rem] rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <div class="flex flex-wrap items-center gap-2">
                                <div class="animate-pulse h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div class="animate-pulse h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div class="animate-pulse h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                        </div>
                        <div class="animate-pulse shrink-0 h-9 w-20 md:w-24 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                </div>
            </div>

            <!-- List -->
            <div v-else-if="history.length" class="space-y-3">
                <div v-for="item in history" :key="item.uuid"
                    class="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                    <span class="absolute inset-y-0 start-0 w-1.5" :class="accentBar(item)"></span>

                    <div class="flex items-center gap-4 ms-1">
                        <!-- Score ring -->
                        <div class="relative shrink-0 w-16 h-16 md:w-[4.5rem] md:h-[4.5rem]">
                            <svg class="w-full h-full -rotate-90" viewBox="0 0 48 48">
                                <circle cx="24" cy="24" r="20" fill="none" stroke-width="5"
                                    class="stroke-current text-gray-100 dark:text-gray-800" />
                                <circle v-if="scorePct(item) != null" cx="24" cy="24" r="20" fill="none" stroke-width="5"
                                    stroke-linecap="round"
                                    class="stroke-current transition-all duration-700"
                                    :class="ringColor(item)"
                                    :stroke-dasharray="ringCircumference"
                                    :stroke-dashoffset="ringOffset(item)" />
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <template v-if="scorePct(item) != null">
                                    <span class="text-sm md:text-base font-extrabold leading-none" :class="scoreText(item)">{{ scorePct(item) }}<span class="text-[10px]">%</span></span>
                                </template>
                                <svg v-else class="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <h3 class="font-bold text-gray-800 dark:text-white text-sm md:text-base line-clamp-1">{{ item.quiz?.title || $t('quiz.history.untitled') }}</h3>
                            <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-2 text-[11px] md:text-xs text-gray-500 dark:text-gray-400">
                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold" :class="statusBadge(item.status)">
                                    <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(item.status)"></span>
                                    {{ statusLabel(item.status) }}
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7l8 5 8-5M4 7h16" /></svg>
                                    {{ $t('quiz.history.attemptNumber', { number: item.attempt_number }) }}
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {{ formatTime(item.time_spent) }}
                                </span>
                                <span v-if="formatDate(item.created_at)" class="inline-flex items-center gap-1" dir="ltr">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {{ formatDate(item.created_at) }}
                                </span>
                            </div>
                        </div>

                        <!-- CTA -->
                        <div class="shrink-0 self-stretch flex items-center">
                            <router-link v-if="item.status === 'in_progress'"
                                :to="{ name: 'quiz-resume', params: { attemptUuid: item.uuid } }"
                                class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:shadow-md rounded-xl px-3.5 md:px-4 py-2 transition-all active:scale-95">
                                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                <span class="hidden sm:inline">{{ $t('quiz.history.resume') }}</span>
                            </router-link>
                            <router-link v-else
                                :to="{ name: 'quiz-result', params: { attemptUuid: item.uuid } }"
                                class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl px-3.5 md:px-4 py-2 transition-all active:scale-95">
                                <span class="hidden sm:inline">{{ $t('quiz.history.result') }}</span>
                                <svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty -->
            <div v-else class="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 md:p-14 text-center">
                <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/10 text-amber-500">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
                <p class="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-200">{{ $t('quiz.history.empty') }}</p>
                <p class="text-xs md:text-sm text-gray-400 dark:text-gray-500 mt-1.5">{{ $t('quiz.history.emptyHint') }}</p>
            </div>
        </div>
    </PanelMasterPage>
</template>

<script>
import PanelMasterPage from '@/views/page/panel/layouts/PanelMasterPage.vue';
import { getQuizHistory } from '@/services/quiz.service';

const RING_RADIUS = 20;

export default {
    components: { PanelMasterPage },
    data() {
        return { loading: true, history: [] };
    },
    computed: {
        ringCircumference() {
            return 2 * Math.PI * RING_RADIUS;
        },
        passedCount() {
            return this.history.filter((i) => i.passed === true).length;
        },
        bestScore() {
            const scored = this.history
                .filter((i) => i.percentage != null && i.passed !== null)
                .map((i) => Math.round(Number(i.percentage)));
            return scored.length ? Math.max(...scored) : null;
        },
    },
    async mounted() {
        try {
            const res = await getQuizHistory();
            this.history = res.history || [];
        } finally {
            this.loading = false;
        }
    },
    methods: {
        scorePct(item) {
            if (item.percentage == null || item.passed === null) return null;
            return Math.round(Number(item.percentage));
        },
        ringOffset(item) {
            const pct = this.scorePct(item) ?? 0;
            return this.ringCircumference * (1 - pct / 100);
        },
        formatTime(seconds) {
            if (!seconds) return this.$t('quiz.time.seconds', { count: 0 });
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return m ? this.$t('quiz.time.minutesSeconds', { m, s }) : this.$t('quiz.time.seconds', { count: s });
        },
        formatDate(value) {
            if (!value) return '';
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return '';
            const localeMap = { fa: 'fa-IR', ar: 'ar-EG', tr: 'tr-TR', en: 'en-US' };
            const locale = localeMap[this.$i18n?.locale] || 'en-US';
            return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
        },
        statusLabel(s) {
            const map = {
                in_progress: 'quiz.status.inProgress',
                submitted: 'quiz.status.submitted',
                grading: 'quiz.status.grading',
                completed: 'quiz.status.completed',
                expired: 'quiz.status.expired',
            };
            return this.$t(map[s] || s);
        },
        statusBadge(s) {
            const map = {
                in_progress: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400',
                grading: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
                completed: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
                submitted: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400',
                expired: 'bg-gray-100 text-gray-500 dark:bg-gray-700/40 dark:text-gray-400',
            };
            return map[s] || 'bg-gray-100 text-gray-500 dark:bg-gray-700/40 dark:text-gray-400';
        },
        statusDot(s) {
            const map = {
                in_progress: 'bg-yellow-500',
                grading: 'bg-amber-500',
                completed: 'bg-green-500',
                submitted: 'bg-sky-500',
                expired: 'bg-gray-400',
            };
            return map[s] || 'bg-gray-400';
        },
        accentBar(item) {
            if (item.status === 'in_progress') return 'bg-gradient-to-b from-yellow-400 to-amber-500';
            if (item.passed === true) return 'bg-gradient-to-b from-green-400 to-emerald-500';
            if (item.passed === false) return 'bg-gradient-to-b from-rose-400 to-red-500';
            return 'bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700';
        },
        ringColor(item) {
            if (item.passed === true) return 'text-green-500';
            if (item.passed === false) return 'text-rose-500';
            return 'text-amber-400';
        },
        scoreText(item) {
            if (item.passed === true) return 'text-green-600 dark:text-green-400';
            if (item.passed === false) return 'text-rose-500 dark:text-rose-400';
            return 'text-gray-600 dark:text-gray-300';
        },
    },
};
</script>
