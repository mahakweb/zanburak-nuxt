<template>
    <div class="relative flex flex-col gap-4 bg-gray-100/60 dark:bg-gray-800/40 rounded-xl p-3 border border-gray-200/60 dark:border-gray-700/40">
        <div
            class="absolute top-1/2 start-0 rounded-e-xl w-1 h-[55%] -translate-y-1/2"
            :class="accentClass"
        ></div>

        <div class="flex-1 min-w-0 ps-2">
            <div class="mb-2 flex flex-wrap items-center gap-2">
                <h4 class="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2">{{ quiz.title }}</h4>
                <span
                    v-if="scheduleStatus === 'not_started'"
                    class="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
                >
                    {{ $t('quiz.card.opensSoon') }}
                </span>
                <span
                    v-else-if="scheduleStatus === 'ended'"
                    class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                >
                    {{ $t('quiz.card.scheduleEnded') }}
                </span>
            </div>

            <p
                v-if="scheduleStatus === 'not_started' && quiz.start_at"
                class="mb-2 text-[11px] font-medium text-sky-700 dark:text-sky-300"
            >
                {{ $t('quiz.card.opensAt', { datetime: formatDateTime(quiz.start_at) }) }}
            </p>
            <p
                v-else-if="scheduleStatus === 'ended' && quiz.end_at"
                class="mb-2 text-[11px] font-medium text-amber-700 dark:text-amber-300"
            >
                {{ $t('quiz.card.endedAt', { datetime: formatDateTime(quiz.end_at) }) }}
            </p>

            <p v-if="quiz.description" class="text-xs font-light text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ quiz.description }}</p>
            <div class="flex flex-wrap items-center gap-2 my-3 text-[10px] font-light text-gray-500 dark:text-gray-400">
                <span class="inline-flex items-center gap-1 bg-white/70 dark:bg-gray-900 px-2 py-0.5 rounded-full">
                    {{ $t('quiz.card.questionsCount', { count: quiz.questions_count || 0 }) }}
                </span>
                <span v-if="quiz.time_limit" class="inline-flex items-center gap-1 bg-white/70 dark:bg-gray-900 px-2 py-0.5 rounded-full">
                    {{ $t('quiz.card.timeMinutes', { count: Math.round(quiz.time_limit / 60) }) }}
                </span>
                <span v-else class="inline-flex items-center gap-1 bg-white/70 dark:bg-gray-900 px-2 py-0.5 rounded-full">
                    {{ $t('quiz.card.noTimeLimit') }}
                </span>
                <span v-if="quiz.passing_percentage" class="inline-flex items-center gap-1 bg-white/70 dark:bg-gray-900 px-2 py-0.5 rounded-full">
                    {{ $t('quiz.card.passing', { percent: quiz.passing_percentage }) }}
                </span>
                <span v-if="quiz.manual_review_required" class="inline-flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
                    {{ $t('quiz.card.manualReview') }}
                </span>
            </div>
        </div>

        <router-link
            v-if="loggedIn && canTakeQuiz"
            :to="{ name: 'quiz-intro', params: { uuid: quiz.uuid } }"
            class="shrink-0 inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl px-5 py-2.5 transition"
            :class="actionClass"
        >
            {{ actionLabel }}
            <svg class="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </router-link>
        <router-link
            v-else-if="!loggedIn"
            :to="{ name: 'login', query: { redirect: '/quiz/' + quiz.uuid } }"
            class="shrink-0 inline-flex items-center justify-center text-xs font-bold text-white bg-gray-800 hover:bg-gray-700 rounded-xl px-5 py-2.5 transition"
        >
            {{ $t('quiz.card.loginToTake') }}
        </router-link>
        <span
            v-else
            class="shrink-0 inline-flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 bg-yellow-400/20 dark:bg-yellow-400/10 rounded-xl px-5 py-2.5 cursor-default select-none"
        >
            {{ $t('quiz.card.enrollFirst') }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        quiz: { type: Object, required: true },
        loggedIn: { type: Boolean, default: false }, 
        canTakeQuiz: { type: Boolean, default: true },
    },
    computed: {
        scheduleStatus() {
            if (this.quiz.schedule_status) return this.quiz.schedule_status;
            const now = Date.now();
            if (this.quiz.start_at && new Date(this.quiz.start_at).getTime() > now) return 'not_started';
            if (this.quiz.end_at && new Date(this.quiz.end_at).getTime() < now) return 'ended';
            return 'open';
        },
        accentClass() {
            if (this.scheduleStatus === 'not_started') return 'bg-sky-400';
            if (this.scheduleStatus === 'ended') return 'bg-amber-400'; 
            return 'bg-yellow-400';
        },
        actionClass() {
            if (this.scheduleStatus === 'not_started') {
                return 'text-sky-900 bg-sky-100 hover:bg-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:hover:bg-sky-500/25';
            }
            if (this.scheduleStatus === 'ended') {
                return 'text-amber-900 bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:hover:bg-amber-500/25';
            }
            return 'text-gray-900 bg-gradient-to-tr from-pink-300 via-pink-500 to-pink-600 hover:bg-opacity-80';
        },
        actionLabel() {
            if (this.scheduleStatus === 'not_started') return this.$t('quiz.card.viewSchedule');
            if (this.scheduleStatus === 'ended') return this.$t('quiz.card.viewEnded');
            return this.$t('quiz.card.start');
        },
        locale() {
            return this.$i18n.locale === 'en' ? 'en-US' : 'fa-IR';
        },
    },
    methods: {
        formatDateTime(value) {
            if (!value) return '';
            return new Date(value).toLocaleString(this.locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        },
    },
};
</script>
