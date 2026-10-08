<template>
    <div>
        <AdminTabPanelToolbar>
            <template v-if="!loading && quizzes.length" #leading>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ quizzes.length.toLocaleString('fa-IR') }} آزمون · {{ entityLabel }}
                </span>
            </template>
            <template #actions>
                <router-link
                    :to="{ name: 'admin-quiz-create', query: createQuizQuery }"
                    class="inline-flex h-8 items-center gap-1 rounded-lg bg-yellow-400 px-2.5 text-xs font-bold text-gray-900 hover:bg-yellow-300"
                >
                    ایجاد آزمون
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                </router-link>
            </template>
        </AdminTabPanelToolbar>

        <AdminInlineLoading v-if="loading" />

        <template v-else>
            <AdminEmptyState v-if="!quizzes.length" :message="emptyMessage">
                <router-link
                    :to="{ name: 'admin-quiz-create', query: createQuizQuery }"
                    class="mt-3 inline-flex h-9 items-center rounded-lg bg-yellow-400 px-4 text-xs font-bold text-gray-900 hover:bg-yellow-300"
                >
                    ایجاد اولین آزمون
                </router-link>
            </AdminEmptyState>

            <template v-else>
                <div class="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div
                        v-for="card in summaryCards"
                        :key="card.label"
                        class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60"
                    >
                        <div class="text-[10px] text-gray-400">{{ card.label }}</div>
                        <div class="mt-0.5 text-base font-extrabold tabular-nums" :class="card.color">{{ card.value }}</div>
                    </div>
                </div>

                <div class="space-y-2">
                    <article
                        v-for="q in quizzes"
                        :key="q.id"
                        class="flex flex-col gap-2 rounded-xl border border-gray-200/80 bg-white p-3 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-1.5">
                                <h3 class="text-[13px] font-bold text-gray-900 line-clamp-1 dark:text-white">{{ q.title }}</h3>
                                <span
                                    class="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                                    :class="q.is_published
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'"
                                >
                                    {{ q.is_published ? 'منتشرشده' : 'پیش‌نویس' }}
                                </span>
                                <span
                                    v-if="!q.is_available && q.is_published"
                                    class="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                                >
                                    خارج از بازه
                                </span>
                            </div>
                            <div class="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                <span class="rounded-md bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">{{ attachLabel(q.attached_type) }}</span>
                                <span v-if="q.attached_title" class="line-clamp-1">{{ q.attached_title }}</span>
                                <span class="text-gray-300 dark:text-gray-600">·</span>
                                <span>{{ (q.summary?.total_attempts || 0).toLocaleString('fa-IR') }} شرکت</span>
                                <span class="text-gray-300 dark:text-gray-600">·</span>
                                <span class="text-emerald-600 dark:text-emerald-400">{{ (q.summary?.passed_count || 0).toLocaleString('fa-IR') }} قبول</span>
                                <span>/</span>
                                <span class="text-rose-500">{{ (q.summary?.failed_count || 0).toLocaleString('fa-IR') }} مردود</span>
                                <span class="text-gray-300 dark:text-gray-600">·</span>
                                <span>قبولی {{ q.summary?.success_rate ?? 0 }}%</span>
                                <span class="text-gray-300 dark:text-gray-600">·</span>
                                <span>میانگین {{ q.summary?.average_percentage ?? 0 }}%</span>
                            </div>
                        </div>

                        <div class="flex shrink-0 items-center gap-1.5">
                            <router-link
                                :to="{ name: 'admin-quiz-reports', params: { id: q.id } }"
                                class="inline-flex h-8 items-center rounded-lg bg-sky-50 px-2.5 text-[11px] font-bold text-sky-700 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20"
                            >
                                گزارش
                            </router-link>
                            <router-link
                                :to="{ name: 'admin-quiz-edit', params: { id: q.id } }"
                                class="inline-flex h-8 items-center rounded-lg bg-gray-100 px-2.5 text-[11px] font-bold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                ویرایش
                            </router-link>
                        </div>
                    </article>
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import AdminTabPanelToolbar from '@/views/components/admin/AdminTabPanelToolbar.vue';
import AdminInlineLoading from '@/views/components/admin/AdminInlineLoading.vue';
import AdminEmptyState from '@/views/components/admin/AdminEmptyState.vue';
import { getEntityQuizzes } from '@/services/quiz.service';

const ENTITY_LABELS = {
    course: 'دوره',
    section: 'فصل',
    episode: 'جلسه',
};

export default {
    components: { AdminTabPanelToolbar, AdminInlineLoading, AdminEmptyState },
    props: {
        entityType: { type: String, default: 'course' },
        entityId: { type: [String, Number], default: null },
        entityTitle: { type: String, default: '' },
        courseId: { type: [String, Number], default: null },
    },
    data() {
        return { loading: false, quizzes: [] };
    },
    computed: {
        resolvedType() {
            return this.entityType || 'course';
        },
        resolvedId() {
            return this.entityId ?? this.courseId;
        },
        entityLabel() {
            return ENTITY_LABELS[this.resolvedType] || 'مورد';
        },
        emptyMessage() {
            if (this.resolvedType === 'episode') return 'برای این جلسه هنوز آزمونی ثبت نشده است.';
            if (this.resolvedType === 'section') return 'برای این فصل و جلسات آن هنوز آزمونی ثبت نشده است.';
            return 'برای این دوره و جلسات آن هنوز آزمونی ثبت نشده است.';
        },
        createQuizQuery() {
            if (!this.resolvedId) return {};
            const idKey = `${this.resolvedType}Id`;
            const titleKey = `${this.resolvedType}Title`;
            const query = {
                quizzableType: this.resolvedType,
                [idKey]: this.resolvedId,
            };
            if (this.entityTitle) query[titleKey] = this.entityTitle;
            return query;
        },
        totalAttempts() {
            return this.quizzes.reduce((s, q) => s + (q.summary?.total_attempts || 0), 0);
        },
        avgSuccessRate() {
            const withData = this.quizzes.filter(q => q.summary?.completed_attempts > 0);
            if (!withData.length) return 0;
            return Math.round(withData.reduce((s, q) => s + q.summary.success_rate, 0) / withData.length);
        },
        avgPercentage() {
            const withData = this.quizzes.filter(q => q.summary?.completed_attempts > 0);
            if (!withData.length) return 0;
            return Math.round(withData.reduce((s, q) => s + q.summary.average_percentage, 0) / withData.length);
        },
        summaryCards() {
            return [
                { label: 'آزمون‌ها', value: this.quizzes.length.toLocaleString('fa-IR'), color: 'text-gray-800 dark:text-white' },
                { label: 'شرکت‌کنندگان', value: this.totalAttempts.toLocaleString('fa-IR'), color: 'text-gray-800 dark:text-white' },
                { label: 'نرخ قبولی', value: `${this.avgSuccessRate}%`, color: 'text-emerald-600' },
                { label: 'میانگین', value: `${this.avgPercentage}%`, color: 'text-sky-600' },
            ];
        },
    },
    watch: {
        resolvedId: { immediate: true, handler(v) { if (v) this.load(); } },
        resolvedType() { if (this.resolvedId) this.load(); },
    },
    methods: {
        attachLabel(type) {
            return { Course: 'دوره', Section: 'فصل', Episode: 'جلسه', standalone: 'مستقل' }[type] || type;
        },
        async load() {
            this.loading = true;
            try {
                const res = await getEntityQuizzes(this.resolvedType, this.resolvedId);
                this.quizzes = res.quizzes || [];
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
