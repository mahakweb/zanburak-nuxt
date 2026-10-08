<template>
    <div class="quiz-countdown overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 md:p-5">
        <div class="mb-4 flex items-center gap-3">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-500">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 9V13L14 15M9 2H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="min-w-0">
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('quiz.intro.countdownTitle') }}</p>
                <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ $t('quiz.intro.opensAt', { datetime: formattedTarget }) }}</p>
            </div>
        </div>

        <div class="grid grid-cols-4 gap-2" dir="ltr">
            <div
                v-for="unit in units"
                :key="unit.key"
                class="quiz-countdown-unit flex flex-col items-center"
            >
                <div class="quiz-countdown-digit-wrap relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <span
                        :key="`${unit.key}-${unit.value}`"
                        class="quiz-countdown-digit block px-1 py-2.5 text-center text-lg font-black tabular-nums text-gray-900 dark:text-white sm:text-xl"
                    >
                        {{ unit.display }}
                    </span>
                </div>
                <span class="mt-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                    {{ unit.label }}
                </span>
            </div>
        </div>

        <p class="mt-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400">{{ $t('quiz.intro.countdownHint') }}</p>
    </div>
</template>

<script>
import { formatQuizNumber } from '@/utils/quizSecurity';

export default {
    props: {
        target: { type: String, required: true },
        locale: { type: String, default: 'fa-IR' },
        tick: { type: Number, default: 0 },
    },
    computed: {
        remaining() {
            void this.tick;
            const diff = Math.max(0, new Date(this.target).getTime() - Date.now());
            const total = Math.floor(diff / 1000);
            return {
                days: Math.floor(total / 86400),
                hours: Math.floor((total % 86400) / 3600),
                minutes: Math.floor((total % 3600) / 60),
                seconds: total % 60,
            };
        },
        formattedTarget() {
            return new Date(this.target).toLocaleString(this.locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        },
        units() {
            const padUnit = (n) => {
                if (n >= 10) return formatQuizNumber(n, this.locale);
                const zero = formatQuizNumber(0, this.locale);
                return zero + formatQuizNumber(n, this.locale);
            };

            const { days, hours, minutes, seconds } = this.remaining;
            return [
                { key: 'days', value: days, display: padUnit(days), label: this.$t('quiz.intro.countdownDays') },
                { key: 'hours', value: hours, display: padUnit(hours), label: this.$t('quiz.intro.countdownHours') },
                { key: 'minutes', value: minutes, display: padUnit(minutes), label: this.$t('quiz.intro.countdownMinutes') },
                { key: 'seconds', value: seconds, display: padUnit(seconds), label: this.$t('quiz.intro.countdownSeconds') },
            ];
        },
    },
};
</script>
