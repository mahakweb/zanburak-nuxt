<template>
    <component :is="rowTag" v-bind="rowBind"
        class="group flex items-center justify-between w-full p-2 mb-3 last:mb-0 font-semibold text-gray-500 border border-gray-200 rounded-xl dark:border-gray-700 dark:text-gray-300 transition"
        :class="rowTag === 'router-link' ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''">
        <div class="flex items-center gap-3 min-w-0">
            <span class="flex shrink-0 w-7 h-7 items-center justify-center rounded-lg bg-yellow-400/15 text-gray-700 dark:text-gray-200">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.5 2C8.67157 2 8 2.67157 8 3.5V4.5C8 5.32843 8.67157 6 9.5 6H14.5C15.3284 6 16 5.32843 16 4.5V3.5C16 2.67157 15.3284 2 14.5 2H9.5Z"
                        fill="currentColor"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M6.5 4.03662C5.24209 4.10719 4.44798 4.30764 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.552 4.30764 18.7579 4.10719 17.5 4.03662V4.5C17.5 6.15685 16.1569 7.5 14.5 7.5H9.5C7.84315 7.5 6.5 6.15685 6.5 4.5V4.03662ZM7 13.75C6.58579 13.75 6.25 14.0858 6.25 14.5C6.25 14.9142 6.58579 15.25 7 15.25H15C15.4142 15.25 15.75 14.9142 15.75 14.5C15.75 14.0858 15.4142 13.75 15 13.75H7ZM7 17.25C6.58579 17.25 6.25 17.5858 6.25 18C6.25 18.4142 6.58579 18.75 7 18.75H12.5C12.9142 18.75 13.25 18.4142 13.25 18C13.25 17.5858 12.9142 17.25 12.5 17.25H7Z"
                        fill="currentColor"></path>
                </svg>
            </span>
            <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                    <div class="text-sm text-gray-700 dark:text-gray-200 line-clamp-1">{{ quiz.title }}</div>
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
                    class="mt-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-300"
                >
                    {{ $t('quiz.card.opensAt', { datetime: formatDateTime(quiz.start_at) }) }}
                </p>
                <p
                    v-else-if="scheduleStatus === 'ended' && quiz.end_at"
                    class="mt-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300"
                >
                    {{ $t('quiz.card.endedAt', { datetime: formatDateTime(quiz.end_at) }) }}
                </p>
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-gray-400 bg-gray-100/70 dark:bg-gray-800/70 px-2 py-1 rounded-lg mt-0.5">
                    <span>{{ $t('quiz.card.questionsCount', { count: quiz.questions_count || 0 }) }}</span>
                    <span v-if="quiz.time_limit">· {{ $t('quiz.card.timeMinutes', { count: Math.round(quiz.time_limit / 60) }) }}</span>
                    <span v-else>· {{ $t('quiz.card.noTimeLimit') }}</span>
                    <span v-if="quiz.passing_percentage">· {{ $t('quiz.card.passing', { percent: quiz.passing_percentage }) }}</span>
                    <span v-if="quiz.manual_review_required" class="text-rose-500">· {{ $t('quiz.card.manualReview') }}</span>
                </div>
            </div>
        </div>
        <span class="shrink-0 inline-flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 transition"
            :class="actionClass">
            {{ actionLabel }}
            <svg v-if="showActionArrow" class="w-3.5 h-3.5 rtl:rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </span>
    </component>
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
        locale() {
            return this.$i18n.locale === 'en' ? 'en-US' : 'fa-IR';
        },
        canNavigate() {
            return this.loggedIn && this.canTakeQuiz;
        },
        rowTag() {
            if (!this.loggedIn || this.canNavigate) {
                return 'router-link';
            }
            return 'div';
        },
        rowBind() {
            if (!this.loggedIn) {
                return { to: { name: 'login', query: { redirect: '/quiz/' + this.quiz.uuid } } };
            }
            if (this.canNavigate) {
                return { to: { name: 'quiz-intro', params: { uuid: this.quiz.uuid } } };
            }
            return {};
        },
        actionLabel() {
            if (!this.loggedIn) return this.$t('quiz.card.loginToTake');
            if (!this.canTakeQuiz) return this.$t('quiz.card.enrollFirst');
            if (this.scheduleStatus === 'not_started') return this.$t('quiz.card.viewSchedule');
            if (this.scheduleStatus === 'ended') return this.$t('quiz.card.viewEnded');
            return this.$t('quiz.card.start');
        },
        actionClass() {
            if (!this.loggedIn) {
                return 'text-white bg-gray-800 group-hover:bg-gray-700';
            }
            if (!this.canTakeQuiz) {
                return 'text-gray-600 dark:text-gray-300 bg-yellow-400/20 dark:bg-yellow-400/10 cursor-default select-none';
            }
            if (this.scheduleStatus === 'not_started') {
                return 'text-sky-900 bg-sky-100 group-hover:bg-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:group-hover:bg-sky-500/25';
            }
            if (this.scheduleStatus === 'ended') {
                return 'text-amber-900 bg-amber-100 group-hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:group-hover:bg-amber-500/25';
            }
            return 'text-gray-900 bg-yellow-400 group-hover:bg-yellow-300';
        },
        showActionArrow() {
            return this.canNavigate;
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
