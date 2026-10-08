<template>
    <aside
        class="quiz-exam-sidebar shrink-0"
        :class="embedded
            ? 'bg-transparent'
            : 'border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900 lg:w-72 lg:border-e'"
    >
        <div
            class="space-y-4 p-4"
            :class="embedded ? '' : 'lg:sticky lg:top-0 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto'"
        >
            <!-- User -->
            <div class="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                <div class="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-yellow-400 to-amber-400 text-sm font-black text-gray-900">
                    <span
                        class="flex h-full w-full items-center justify-center"
                        :class="{ 'absolute inset-0': showAvatar }"
                    >{{ userInitials }}</span>
                    <img
                        v-if="showAvatar"
                        :src="userAvatar"
                        :alt="userName"
                        class="absolute inset-0 h-full w-full object-cover"
                        @error="onAvatarError"
                    />
                </div>
                <div class="min-w-0">
                    <p class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ userName }}</p>
                    <p v-if="user?.username" class="truncate text-[11px] text-gray-500">@{{ user.username }}</p>
                </div>
            </div>

            <!-- Quiz -->
            <div class="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
                <p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                    {{ $t('quiz.take.sidebarQuiz') }}
                </p>
                <h2 class="text-sm font-bold leading-6 text-gray-900 dark:text-white">{{ quiz?.title }}</h2>
                <p v-if="quiz?.description" class="mt-2 line-clamp-3 text-xs leading-6 text-gray-500 dark:text-gray-400">
                    {{ quiz.description }}
                </p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-2">
                <div
                    v-for="item in metaItems"
                    :key="item.key"
                    class="rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/40"
                >
                    <p class="text-[10px] text-gray-400">{{ item.label }}</p>
                    <p class="mt-0.5 text-sm font-bold text-gray-800 dark:text-gray-100">{{ item.value }}</p>
                </div>
            </div>

            <div v-if="attemptNumber" class="rounded-xl bg-yellow-50 px-3 py-2 text-center text-xs font-semibold text-yellow-800 dark:bg-yellow-400/10 dark:text-yellow-300">
                {{ $t('quiz.take.attemptNumber', { number: attemptNumber }) }}
            </div>
        </div>
    </aside>
</template>

<script>
import { formatQuizNumber } from '@/utils/quizSecurity';

export default {
    props: {
        quiz: { type: Object, default: null },
        user: { type: Object, default: null },
        attemptNumber: { type: [Number, String], default: null },
        locale: { type: String, default: 'fa-IR' },
        embedded: { type: Boolean, default: false },
    },
    data() {
        return { avatarError: false };
    },
    watch: {
        user() {
            this.avatarError = false;
        },
    },
    computed: {
        userName() {
            if (!this.user) return '—';
            const name = [this.user.first_name, this.user.last_name].filter(Boolean).join(' ').trim();
            return name || this.user.username || '—';
        },
        userInitials() {
            const parts = this.userName.split(' ').filter(Boolean);
            if (!parts.length) return '?';
            return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
        },
        userAvatar() {
            return this.user?.profile_pic || this.user?.avatar || this.user?.profile_picture || null;
        },
        showAvatar() {
            return !!this.userAvatar && !this.avatarError;
        },
        metaItems() {
            if (!this.quiz) return [];
            const fmt = (v) => formatQuizNumber(v, this.locale);
            const time = this.quiz.time_limit
                ? `${fmt(Math.round(this.quiz.time_limit / 60))}′`
                : '∞';
            const passing = this.quiz.passing_percentage
                ? `${fmt(this.quiz.passing_percentage)}%`
                : (this.quiz.passing_score ? fmt(this.quiz.passing_score) : '—');
            return [
                { key: 'q', label: this.$t('quiz.intro.statQuestions'), value: fmt(this.quiz.questions_count || 0) },
                { key: 's', label: this.$t('quiz.intro.statTotalScore'), value: fmt(this.quiz.total_score || 0) },
                { key: 't', label: this.$t('quiz.intro.statTime'), value: time },
                { key: 'p', label: this.$t('quiz.take.passingLabel'), value: passing },
            ];
        },
    },
    methods: {
        onAvatarError() {
            this.avatarError = true;
        },
    },
};
</script>
