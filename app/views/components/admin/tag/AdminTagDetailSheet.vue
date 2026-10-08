<template>
    <BottomSheetDrawer
        v-model="open"
        :initialHeight="0.9"
        :maxHeight="0.96"
        :minHeight="0.55"
        :autoCloseOnMin="true"
        :closeOnBackdrop="true"
        :lockScroll="true"
        :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[52rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
        :contentClass="'px-4 pb-4 overflow-hidden flex flex-col min-h-0'"
        :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'"
        @update:modelValue="onDrawerToggle">
        <div v-if="tag" class="flex flex-col min-h-0 h-full">
            <!-- Hero header -->
            <div class="shrink-0 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-50 to-white dark:from-amber-500/10 dark:via-gray-800 dark:to-gray-900 border border-amber-200/60 dark:border-amber-500/20 p-4 mb-3">
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                        <div class="inline-flex items-center gap-2 mb-1">
                            <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-400 text-gray-900 text-sm font-bold">#</span>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white truncate">{{ tag.name }}</h3>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 font-mono" dir="ltr">{{ tag.slug }}</p>
                        <p v-if="tag.created_at" class="text-[11px] text-gray-400 mt-1.5">ایجاد: {{ formatDate(tag.created_at) }}</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-1.5 shrink-0 justify-end">
                        <router-link :to="{ name: 'tag-show', params: { tagSlug: tag.slug } }" target="_blank"
                            class="h-8 px-2.5 text-xs font-semibold rounded-lg bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-gray-700 hover:bg-white transition-colors">
                            سایت
                        </router-link>
                        <router-link :to="{ name: 'admin-tag-details', params: { id: tag.id } }"
                            class="h-8 px-2.5 text-xs font-semibold rounded-lg bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-gray-700 hover:bg-white transition-colors">
                            صفحه کامل
                        </router-link>
                        <button type="button" @click="emitEdit"
                            class="h-8 px-3 text-xs font-semibold rounded-lg bg-amber-400 text-gray-900 hover:bg-amber-500 transition-colors">
                            ویرایش
                        </button>
                    </div>
                </div>

                <!-- Stat pills -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                    <button v-for="pill in statPills" :key="pill.key" type="button" @click="switchTab(pill.key)"
                        class="rounded-xl p-2.5 text-start border transition-all"
                        :class="activeTab === pill.key
                            ? 'bg-white dark:bg-gray-900 border-amber-300 dark:border-amber-500/50 shadow-sm ring-1 ring-amber-200/50'
                            : 'bg-white/60 dark:bg-gray-900/40 border-transparent hover:border-gray-200 dark:hover:border-gray-700'">
                        <div class="text-[10px] font-medium text-gray-500 dark:text-gray-400">{{ pill.label }}</div>
                        <div class="text-lg font-bold font-anjoman mt-0.5" :class="pill.color">{{ pill.count }}</div>
                    </button>
                </div>
            </div>

            <!-- Tabs -->
            <div class="shrink-0 flex gap-1 overflow-x-auto scrollbar-hide pb-2 border-b border-gray-100 dark:border-gray-800">
                <button v-for="tab in tabs" :key="tab.key" type="button" @click="switchTab(tab.key)"
                    class="shrink-0 inline-flex items-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition whitespace-nowrap"
                    :class="activeTab === tab.key
                        ? 'bg-amber-400 text-gray-900 shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700'">
                    {{ tab.label }}
                    <span v-if="tab.count != null"
                        class="font-anjoman text-[10px] px-1.5 py-0.5 rounded-md"
                        :class="activeTab === tab.key ? 'bg-black/10' : 'bg-gray-200/80 dark:bg-gray-700'">
                        {{ tab.count }}
                    </span>
                </button>
            </div>

            <!-- Scrollable body -->
            <div ref="scrollBody" class="flex-1 min-h-0 overflow-y-auto custom-scrollbar pt-3" @scroll="handleScroll">
                <!-- Overview -->
                <div v-if="activeTab === 'overview'" class="space-y-3 pb-4">
                    <div v-if="analyticsLoading" class="py-12 text-center">
                        <svg class="w-7 h-7 mx-auto text-amber-400 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p class="text-xs text-gray-400 mt-2">بارگذاری نمودارها...</p>
                    </div>
                    <template v-else-if="analytics">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AdminReportChartCard title="توزیع محتوا" subtitle="سوالات، دوره‌ها و مقالات">
                                <DoughnutChart class="h-48 mx-auto" :rawData="analytics.content_distribution" legendPosition="bottom" :showTitle="false" />
                            </AdminReportChartCard>
                            <AdminReportChartCard title="نمای کلی" subtitle="اتصالات و دنبال‌کننده">
                                <DoughnutChart class="h-48 mx-auto" :rawData="analytics.usage_overview" legendPosition="bottom" :showTitle="false" />
                            </AdminReportChartCard>
                        </div>
                        <AdminReportChartCard title="اتصال سوالات — ۳۰ روز">
                            <AreaChart class="h-52" :rawData="analytics.questions_timeline" :showLegend="false" lineColor="rgba(251,191,36,1)" fillColor="rgba(251,191,36,0.15)" />
                        </AdminReportChartCard>
                        <AdminReportChartCard title="اتصال دوره‌ها — ۳۰ روز">
                            <AreaChart class="h-52" :rawData="analytics.courses_timeline" :showLegend="false" lineColor="rgba(96,165,250,1)" fillColor="rgba(96,165,250,0.15)" />
                        </AdminReportChartCard>
                        <AdminReportChartCard title="اتصال مقالات — ۳۰ روز">
                            <AreaChart class="h-52" :rawData="analytics.articles_timeline" :showLegend="false" lineColor="rgba(52,211,153,1)" fillColor="rgba(52,211,153,0.15)" />
                        </AdminReportChartCard>
                        <AdminReportChartCard title="دنبال‌کنندگان — ۳۰ روز">
                            <AdminBarChart class="h-52" :rawData="analytics.followers_timeline" barColor="rgba(167,139,250,0.85)" />
                        </AdminReportChartCard>
                    </template>
                </div>

                <!-- Questions -->
                <div v-else-if="activeTab === 'questions'" class="space-y-2 pb-4">
                    <ListState :loading="questionsLoading && !questions.length" :empty="!questionsLoading && !questions.length" emptyText="سوالی متصل نیست" />
                    <article v-for="q in questions" :key="q.id"
                        class="group rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 p-3 hover:border-amber-200 dark:hover:border-amber-500/30 transition-colors">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0 flex-1">
                                <router-link :to="{ name: 'admin-question-details', params: { id: q.id } }"
                                    class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 line-clamp-2 transition-colors">
                                    {{ q.subject }}
                                </router-link>
                                <div class="flex flex-wrap items-center gap-2 mt-2">
                                    <span class="text-[11px] text-gray-500">{{ formatUser(q.user) }}</span>
                                    <span v-if="q.created_at" class="text-[11px] text-gray-400">{{ formatDate(q.created_at) }}</span>
                                </div>
                            </div>
                            <StatusBadge :published="q.publish" />
                        </div>
                    </article>
                    <LoadMoreSpinner v-if="questionsLoadingMore" />
                </div>

                <!-- Courses -->
                <div v-else-if="activeTab === 'courses'" class="space-y-2 pb-4">
                    <ListState :loading="coursesLoading && !courses.length" :empty="!coursesLoading && !courses.length" emptyText="دوره‌ای متصل نیست" />
                    <article v-for="c in courses" :key="c.id"
                        class="group rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 p-3 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
                        <div class="flex items-center justify-between gap-3">
                            <div class="min-w-0 flex-1">
                                <div class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{{ c.title }}</div>
                                <div v-if="c.english_title" class="text-[11px] text-gray-400 mt-0.5 line-clamp-1" dir="ltr">{{ c.english_title }}</div>
                                <div class="flex flex-wrap items-center gap-2 mt-2">
                                    <StatusBadge :published="c.publish" />
                                    <span v-if="c.created_at" class="text-[11px] text-gray-400">{{ formatDate(c.created_at) }}</span>
                                </div>
                            </div>
                            <router-link :to="{ name: 'admin-course-details', params: { courseSlug: c.slug } }"
                                class="shrink-0 h-8 px-3 inline-flex items-center text-xs font-semibold rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200/80 transition-colors">
                                مشاهده
                            </router-link>
                        </div>
                    </article>
                    <LoadMoreSpinner v-if="coursesLoadingMore" />
                </div>

                <!-- Articles -->
                <div v-else-if="activeTab === 'articles'" class="space-y-2 pb-4">
                    <ListState :loading="articlesLoading && !articles.length" :empty="!articlesLoading && !articles.length" emptyText="مقاله‌ای متصل نیست" />
                    <article v-for="a in articles" :key="a.id"
                        class="group rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 p-3 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors">
                        <div class="flex items-start gap-3">
                            <div class="shrink-0 w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-200/60 dark:border-gray-600/60">
                                <img v-if="a.cover_image" :src="a.cover_image" :alt="a.title" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                                    </svg>
                                </div>
                            </div>
                            <div class="min-w-0 flex-1">
                                <router-link :to="{ name: 'admin-article-details', params: { id: a.id } }"
                                    class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 line-clamp-2 transition-colors">
                                    {{ a.title }}
                                </router-link>
                                <div class="flex flex-wrap items-center gap-2 mt-1.5">
                                    <span v-if="a.category" class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-200/80 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{{ a.category.title }}</span>
                                    <span class="text-[11px] text-gray-500">{{ formatUser(a.user) }}</span>
                                </div>
                                <div class="flex flex-wrap items-center gap-2 mt-1.5">
                                    <StatusBadge :published="a.publish" />
                                    <span v-if="a.is_featured" class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">ویژه</span>
                                    <span class="text-[11px] text-gray-400">{{ formatDate(a.published_at || a.created_at) }}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                    <LoadMoreSpinner v-if="articlesLoadingMore" />
                </div>

                <!-- Followers -->
                <div v-else-if="activeTab === 'followers'" class="space-y-2 pb-4">
                    <ListState :loading="followersLoading && !followers.length" :empty="!followersLoading && !followers.length" emptyText="دنبال‌کننده‌ای نیست" />
                    <article v-for="u in followers" :key="u.id"
                        class="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 p-3 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-200 to-amber-200 dark:from-violet-900/40 dark:to-amber-900/40 overflow-hidden shrink-0 border border-white/50 dark:border-gray-700">
                            <img v-if="u.profile_pic" :src="u.profile_pic" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                            <div v-else class="w-full h-full flex items-center justify-center text-sm font-bold text-violet-700 dark:text-violet-300">
                                {{ (u.first_name || u.username || '?').charAt(0) }}
                            </div>
                        </div>
                        <div class="min-w-0 flex-1">
                            <router-link :to="{ name: 'admin-user-details', params: { username: u.username } }"
                                class="text-sm font-semibold text-gray-900 dark:text-white hover:text-violet-600 transition-colors">
                                {{ formatUser(u) }}
                            </router-link>
                            <div class="text-[11px] text-gray-400 mt-0.5">@{{ u.username || '—' }}</div>
                        </div>
                        <div class="text-[11px] text-gray-400 shrink-0">{{ formatDate(u.followed_at) }}</div>
                    </article>
                    <LoadMoreSpinner v-if="followersLoadingMore" />
                </div>
            </div>
        </div>
    </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import AreaChart from "@/views/components/chart/AreaChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import axiosInstance from "@/store/axiosInstance";

const PER_PAGE = 12;

const StatusBadge = {
    props: { published: { type: Boolean, default: false } },
    template: `<span class="text-[10px] font-semibold px-2 py-0.5 rounded-md"
        :class="published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'">
        {{ published ? 'منتشر' : 'پیش‌نویس' }}
    </span>`,
};

const ListState = {
    props: {
        loading: Boolean,
        empty: Boolean,
        emptyText: { type: String, default: "موردی یافت نشد" },
    },
    template: `
        <div v-if="loading" class="py-12 text-center text-xs text-gray-400">در حال بارگذاری...</div>
        <p v-else-if="empty" class="py-12 text-center text-sm text-gray-400">{{ emptyText }}</p>
    `,
};

const LoadMoreSpinner = {
    template: `<div class="py-4 flex justify-center">
        <svg class="w-6 h-6 text-amber-400 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    </div>`,
};

export default {
    name: "AdminTagDetailSheet",
    components: {
        BottomSheetDrawer,
        AdminReportChartCard,
        DoughnutChart,
        AreaChart,
        AdminBarChart,
        StatusBadge,
        ListState,
        LoadMoreSpinner,
    },
    props: {
        modelValue: { type: Boolean, default: false },
        tagSummary: { type: Object, default: null },
        initialTab: { type: String, default: "overview" },
    },
    emits: ["update:modelValue", "edit"],
    data() {
        return {
            tag: null,
            activeTab: "overview",
            analytics: null,
            analyticsLoading: false,
            questions: [],
            questionsPage: 1,
            questionsLastPage: 1,
            questionsLoading: false,
            questionsLoadingMore: false,
            courses: [],
            coursesPage: 1,
            coursesLastPage: 1,
            coursesLoading: false,
            coursesLoadingMore: false,
            articles: [],
            articlesPage: 1,
            articlesLastPage: 1,
            articlesLoading: false,
            articlesLoadingMore: false,
            followers: [],
            followersPage: 1,
            followersLastPage: 1,
            followersLoading: false,
            followersLoadingMore: false,
        };
    },
    computed: {
        open: {
            get() { return this.modelValue; },
            set(v) { this.$emit("update:modelValue", v); },
        },
        statPills() {
            if (!this.tag) return [];
            return [
                { key: "questions", label: "سوالات", count: this.tag.questions_count ?? 0, color: "text-amber-600 dark:text-amber-400" },
                { key: "courses", label: "دوره‌ها", count: this.tag.courses_count ?? 0, color: "text-blue-600 dark:text-blue-400" },
                { key: "articles", label: "مقالات", count: this.tag.articles_count ?? 0, color: "text-emerald-600 dark:text-emerald-400" },
                { key: "followers", label: "دنبال‌کننده", count: this.tag.followers_count ?? 0, color: "text-violet-600 dark:text-violet-400" },
            ];
        },
        tabs() {
            if (!this.tag) return [];
            return [
                { key: "overview", label: "آمار", count: null },
                { key: "questions", label: "سوالات", count: this.tag.questions_count ?? 0 },
                { key: "courses", label: "دوره‌ها", count: this.tag.courses_count ?? 0 },
                { key: "articles", label: "مقالات", count: this.tag.articles_count ?? 0 },
                { key: "followers", label: "دنبال‌کنندگان", count: this.tag.followers_count ?? 0 },
            ];
        },
    },
    watch: {
        modelValue(val) {
            if (val && this.tagSummary) {
                this.openSheet(this.tagSummary, this.initialTab);
            } else if (!val) {
                this.resetState();
            }
        },
        tagSummary(val) {
            if (val && this.modelValue) {
                this.openSheet(val, this.initialTab);
            }
        },
    },
    methods: {
        onDrawerToggle(val) {
            if (!val) this.resetState();
        },
        resetState() {
            this.tag = null;
            this.analytics = null;
            this.questions = [];
            this.courses = [];
            this.articles = [];
            this.followers = [];
            this.activeTab = "overview";
        },
        async openSheet(summary, tab = "overview") {
            this.analytics = null;
            this.questions = [];
            this.courses = [];
            this.articles = [];
            this.followers = [];
            this.questionsPage = 1;
            this.coursesPage = 1;
            this.articlesPage = 1;
            this.followersPage = 1;
            this.tag = { ...summary };
            this.activeTab = tab;
            await this.fetchTagDetail();
            if (tab === "overview") {
                this.fetchAnalytics();
            } else {
                this.resetList(tab);
                this.fetchList(tab, false);
            }
        },
        switchTab(key) {
            this.activeTab = key;
            if (key === "overview" && !this.analytics) {
                this.fetchAnalytics();
            } else if (key !== "overview" && this.getList(key).length === 0) {
                this.resetList(key);
                this.fetchList(key, false);
            }
        },
        getList(key) {
            const map = {
                questions: this.questions,
                courses: this.courses,
                articles: this.articles,
                followers: this.followers,
            };
            return map[key] || [];
        },
        resetList(key) {
            const resets = {
                questions: () => { this.questions = []; this.questionsPage = 1; this.questionsLastPage = 1; },
                courses: () => { this.courses = []; this.coursesPage = 1; this.coursesLastPage = 1; },
                articles: () => { this.articles = []; this.articlesPage = 1; this.articlesLastPage = 1; },
                followers: () => { this.followers = []; this.followersPage = 1; this.followersLastPage = 1; },
            };
            resets[key]?.();
        },
        async fetchTagDetail() {
            try {
                const res = await axiosInstance.get(`/admin/tag/${this.tag.id}`);
                this.tag = res.data.tag;
            } catch (e) {
                console.error(e);
            }
        },
        async fetchAnalytics() {
            this.analyticsLoading = true;
            try {
                const res = await axiosInstance.get(`/admin/tag/${this.tag.id}/analytics`);
                this.analytics = res.data.analytics;
            } catch (e) {
                console.error(e);
            } finally {
                this.analyticsLoading = false;
            }
        },
        async fetchList(key, loadMore = false) {
            const meta = this.listMeta(key);
            if (!meta || meta.loading || meta.loadingMore) return;
            if (loadMore && meta.page > meta.lastPage) return;

            meta.setLoadingMore(loadMore);
            meta.setLoading(!loadMore);

            const endpoints = {
                questions: `/admin/tag/${this.tag.id}/questions`,
                courses: `/admin/tag/${this.tag.id}/courses`,
                articles: `/admin/tag/${this.tag.id}/articles`,
                followers: `/admin/tag/${this.tag.id}/followers`,
            };

            try {
                const res = await axiosInstance.post(endpoints[key], { page: meta.page, perPage: PER_PAGE });
                const payload = res.data[key];
                const items = payload.data || [];
                meta.append(items, loadMore);
                meta.setPage(payload.current_page + 1);
                meta.setLastPage(payload.last_page);
            } catch (e) {
                console.error(e);
            } finally {
                meta.setLoading(false);
                meta.setLoadingMore(false);
            }
        },
        listMeta(key) {
            const configs = {
                questions: {
                    page: this.questionsPage,
                    lastPage: this.questionsLastPage,
                    loading: this.questionsLoading,
                    loadingMore: this.questionsLoadingMore,
                    setPage: (v) => { this.questionsPage = v; },
                    setLastPage: (v) => { this.questionsLastPage = v; },
                    setLoading: (v) => { this.questionsLoading = v; },
                    setLoadingMore: (v) => { this.questionsLoadingMore = v; },
                    append: (items, loadMore) => { this.questions = loadMore ? [...this.questions, ...items] : items; },
                },
                courses: {
                    page: this.coursesPage,
                    lastPage: this.coursesLastPage,
                    loading: this.coursesLoading,
                    loadingMore: this.coursesLoadingMore,
                    setPage: (v) => { this.coursesPage = v; },
                    setLastPage: (v) => { this.coursesLastPage = v; },
                    setLoading: (v) => { this.coursesLoading = v; },
                    setLoadingMore: (v) => { this.coursesLoadingMore = v; },
                    append: (items, loadMore) => { this.courses = loadMore ? [...this.courses, ...items] : items; },
                },
                articles: {
                    page: this.articlesPage,
                    lastPage: this.articlesLastPage,
                    loading: this.articlesLoading,
                    loadingMore: this.articlesLoadingMore,
                    setPage: (v) => { this.articlesPage = v; },
                    setLastPage: (v) => { this.articlesLastPage = v; },
                    setLoading: (v) => { this.articlesLoading = v; },
                    setLoadingMore: (v) => { this.articlesLoadingMore = v; },
                    append: (items, loadMore) => { this.articles = loadMore ? [...this.articles, ...items] : items; },
                },
                followers: {
                    page: this.followersPage,
                    lastPage: this.followersLastPage,
                    loading: this.followersLoading,
                    loadingMore: this.followersLoadingMore,
                    setPage: (v) => { this.followersPage = v; },
                    setLastPage: (v) => { this.followersLastPage = v; },
                    setLoading: (v) => { this.followersLoading = v; },
                    setLoadingMore: (v) => { this.followersLoadingMore = v; },
                    append: (items, loadMore) => { this.followers = loadMore ? [...this.followers, ...items] : items; },
                },
            };
            return configs[key] || null;
        },
        handleScroll() {
            const el = this.$refs.scrollBody;
            if (!el || this.activeTab === "overview") return;
            const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
            if (!nearBottom) return;

            const meta = this.listMeta(this.activeTab);
            if (meta && meta.page <= meta.lastPage && !meta.loadingMore && !meta.loading) {
                this.fetchList(this.activeTab, true);
            }
        },
        emitEdit() {
            this.$emit("edit", this.tag);
            this.open = false;
        },
        formatUser(user) {
            if (!user) return "—";
            const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
            return name || user.username || "—";
        },
        formatDate(date) {
            if (!date) return "—";
            return new Date(date).toLocaleDateString("fa-IR", { year: "numeric", month: "short", day: "2-digit" });
        },
    },
};
</script>
