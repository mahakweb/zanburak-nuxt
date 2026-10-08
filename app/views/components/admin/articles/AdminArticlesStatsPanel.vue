<template>
    <div class="space-y-6">
        <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-3 shadow-sm">
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">بازه زمانی</span>
                <button v-for="preset in datePresets" :key="preset.days" type="button" @click="applyPreset(preset)"
                    class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                    :class="activePreset === preset.days ? 'bg-yellow-400 text-black ring-1 ring-yellow-500/30 shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
                    {{ preset.title }}
                </button>
                <div class="flex flex-wrap items-center gap-2 ms-auto">
                    <input type="date" :value="dateFrom" @change="onDateFromChange"
                        class="h-8 px-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 outline-none border-0" />
                    <span class="text-xs text-gray-400">تا</span>
                    <input type="date" :value="dateTo" @change="onDateToChange"
                        class="h-8 px-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 outline-none border-0" />
                </div>
            </div>
        </div>

        <div v-if="summaryStats && !loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-3">
            <AdminReportStatCard title="کل مقالات" :value="formatNumber(summaryStats.total)" accent="amber" />
            <AdminReportStatCard title="منتشر شده" :value="formatNumber(summaryStats.published)" accent="emerald" />
            <AdminReportStatCard title="پیش‌نویس" :value="formatNumber(summaryStats.drafts)" accent="blue" />
            <AdminReportStatCard title="ویژه" :value="formatNumber(summaryStats.featured)" accent="violet" />
            <AdminReportStatCard title="بازدید کل" :value="formatNumber(summaryStats.total_views)" accent="blue" />
            <AdminReportStatCard title="لایک کل" :value="formatNumber(summaryStats.total_likes)" accent="rose" />
            <AdminReportStatCard title="بوکمارک" :value="formatNumber(summaryStats.total_bookmarks)" accent="violet" />
            <AdminReportStatCard title="نظرات" :value="formatNumber(summaryStats.total_comments)" accent="cyan" />
            <AdminReportStatCard title="میانگین مطالعه" :value="summaryStats.avg_reading_time + ' دقیقه'" accent="amber" value-dir="rtl" />
            <AdminReportStatCard title="جدید این ماه" :value="formatNumber(summaryStats.new_this_month)" accent="emerald" />
        </div>

        <div v-if="loading" class="py-20 text-center text-sm text-gray-500">در حال بارگذاری آمار...</div>

        <div v-else-if="analytics" class="space-y-6">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <AdminReportStatCard title="بازدید دوره" :value="formatNumber(analytics.summary.views)" accent="blue" :trend="analytics.trends?.views" />
                <AdminReportStatCard title="لایک دوره" :value="formatNumber(analytics.summary.likes)" accent="rose" :trend="analytics.trends?.likes" />
                <AdminReportStatCard title="نظر دوره" :value="formatNumber(analytics.summary.comments)" accent="cyan" />
                <AdminReportStatCard title="بوکمارک دوره" :value="formatNumber(analytics.summary.bookmarks)" accent="violet" />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <AdminReportChartCard class="lg:col-span-2" title="روند روزانه تعامل" subtitle="بازدید، لایک، نظر و بوکمارک">
                    <ComparisonLineChart v-if="dailyChart.labels.length" :key="chartKey" class="h-72" :labels="dailyChart.labels" :datasets="dailyChart.datasets" />
                </AdminReportChartCard>
                <AdminReportChartCard title="ترکیب تعامل" subtitle="نسبت انواع تعامل در بازه">
                    <DoughnutChart v-if="engagementMix.labels.length" class="h-72" :rawData="engagementMix" legendPosition="bottom" />
                </AdminReportChartCard>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AdminReportChartCard title="وضعیت مقالات" subtitle="توزیع بر اساس وضعیت انتشار">
                    <DoughnutChart v-if="statusChart.labels.length" class="h-64" :rawData="statusChart" legendPosition="bottom" />
                </AdminReportChartCard>
                <AdminReportChartCard title="مقالات بر اساس دسته" subtitle="۱۰ دسته برتر">
                    <AdminBarChart v-if="categoryChart.labels.length" class="h-64" :rawData="categoryChart" :colors="categoryChart.colors" />
                </AdminReportChartCard>
            </div>

            <AdminReportChartCard title="بازدید ساعتی" subtitle="الگوی بازدید در ۲۴ ساعت">
                <AdminBarChart v-if="hourlyChart.labels.length" class="h-56" :rawData="hourlyChart" barColor="#60a5fa" />
            </AdminReportChartCard>

            <div class="flex flex-wrap gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/60 w-max max-w-full">
                <button v-for="tab in topTabs" :key="tab.key" type="button" @click="activeTopTab = tab.key"
                    class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap"
                    :class="activeTopTab === tab.key ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'">
                    {{ tab.label }}
                </button>
            </div>

            <AdminReportChartCard :title="activeTopTabLabel" subtitle="۱۰ مقاله برتر">
                <div class="overflow-x-auto">
                    <table class="min-w-full text-xs">
                        <thead>
                            <tr class="text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                <th class="py-2 px-2 text-start">#</th>
                                <th class="py-2 px-2 text-start">عنوان</th>
                                <th class="py-2 px-2 text-start">دسته</th>
                                <th class="py-2 px-2 text-start">بازدید</th>
                                <th class="py-2 px-2 text-start">لایک</th>
                                <th class="py-2 px-2 text-start">بوکمارک</th>
                                <th class="py-2 px-2 text-start">نظر</th>
                                <th class="py-2 px-2 text-start">امتیاز</th>
                                <th class="py-2 px-2 text-start"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, idx) in activeTopList" :key="row.id"
                                class="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/40">
                                <td class="py-2.5 px-2 font-anjoman text-gray-400">{{ idx + 1 }}</td>
                                <td class="py-2.5 px-2 font-semibold max-w-[200px] truncate">{{ row.title }}</td>
                                <td class="py-2.5 px-2 text-gray-500">{{ row.category || '—' }}</td>
                                <td class="py-2.5 px-2 font-anjoman">{{ formatNumber(row.views_count) }}</td>
                                <td class="py-2.5 px-2 font-anjoman text-rose-600">{{ formatNumber(row.likes_count) }}</td>
                                <td class="py-2.5 px-2 font-anjoman text-violet-600">{{ formatNumber(row.bookmarks_count) }}</td>
                                <td class="py-2.5 px-2 font-anjoman text-cyan-600">{{ formatNumber(row.comments_count) }}</td>
                                <td class="py-2.5 px-2 font-anjoman font-bold text-amber-600">{{ row.engagement_score }}</td>
                                <td class="py-2.5 px-2">
                                    <router-link :to="{ name: 'admin-article-details', params: { id: row.id } }"
                                        class="text-yellow-600 hover:text-yellow-700 font-semibold">جزئیات</router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </AdminReportChartCard>
        </div>
    </div>
</template>

<script>
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import axiosInstance from "@/store/axiosInstance";

export default {
    components: {
        AdminReportStatCard,
        AdminReportChartCard,
        ComparisonLineChart,
        DoughnutChart,
        AdminBarChart,
    },
    data() {
        const today = new Date().toISOString().slice(0, 10);
        const monthAgo = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
        return {
            loading: true,
            summaryStats: null,
            analytics: null,
            chartKey: 0,
            refreshSeq: 0,
            dateFrom: monthAgo,
            dateTo: today,
            activePreset: 30,
            activeTopTab: 'views',
            topTabs: [
                { key: 'views', label: 'پربازدیدترین' },
                { key: 'likes', label: 'بیشترین لایک' },
                { key: 'bookmarks', label: 'بیشترین بوکمارک' },
                { key: 'comments', label: 'بیشترین نظر' },
                { key: 'engagement', label: 'بیشترین تعامل' },
            ],
            datePresets: [
                { days: 7, title: '۷ روز' },
                { days: 30, title: '۳۰ روز' },
                { days: 90, title: '۹۰ روز' },
            ],
        };
    },
    computed: {
        activeTopTabLabel() {
            return this.topTabs.find((t) => t.key === this.activeTopTab)?.label || '';
        },
        activeTopList() {
            if (!this.analytics) return [];
            const map = {
                views: 'top_by_views',
                likes: 'top_by_likes',
                bookmarks: 'top_by_bookmarks',
                comments: 'top_by_comments',
                engagement: 'top_by_engagement',
            };
            return this.analytics[map[this.activeTopTab]] || [];
        },
        dailyChart() {
            const trend = this.analytics?.daily_trend || [];
            return {
                labels: trend.map((d) => d.date),
                datasets: [
                    { label: 'بازدید', data: trend.map((d) => d.views), lineColor: '#3b82f6', fillColor: 'rgba(59,130,246,0.18)' },
                    { label: 'لایک', data: trend.map((d) => d.likes), lineColor: '#f43f5e', fillColor: 'rgba(244,63,94,0.15)' },
                    { label: 'نظر', data: trend.map((d) => d.comments), lineColor: '#06b6d4', fillColor: 'rgba(6,182,212,0.15)' },
                    { label: 'بوکمارک', data: trend.map((d) => d.bookmarks), lineColor: '#8b5cf6', fillColor: 'rgba(139,92,246,0.15)' },
                ],
            };
        },
        engagementMix() {
            const mix = this.analytics?.engagement_mix;
            return mix ? { labels: mix.labels, data: mix.data, colors: mix.colors } : { labels: [], data: [], colors: [] };
        },
        statusChart() {
            const s = this.analytics?.status_distribution;
            return s ? { labels: s.labels, data: s.data, colors: s.colors } : { labels: [], data: [], colors: [] };
        },
        categoryChart() {
            const c = this.analytics?.category_distribution;
            return c ? { labels: c.labels, data: c.data, colors: c.colors } : { labels: [], data: [], colors: [] };
        },
        hourlyChart() {
            const h = this.analytics?.hourly_views || [];
            return { labels: h.map((x) => x.label), data: h.map((x) => x.count) };
        },
    },
    methods: {
        formatNumber(n) {
            if (n == null) return '0';
            return Number(n).toLocaleString('fa-IR');
        },
        applyPreset(preset) {
            this.activePreset = preset.days;
            const to = new Date();
            const from = new Date(Date.now() - (preset.days - 1) * 86400000);
            this.dateTo = to.toISOString().slice(0, 10);
            this.dateFrom = from.toISOString().slice(0, 10);
            this.fetchAnalytics();
        },
        onDateFromChange(e) {
            this.dateFrom = e.target.value;
            this.activePreset = null;
            this.fetchAnalytics();
        },
        onDateToChange(e) {
            this.dateTo = e.target.value;
            this.activePreset = null;
            this.fetchAnalytics();
        },
        async refresh() {
            const seq = ++this.refreshSeq;
            this.loading = true;
            try {
                const [statsRes, analyticsRes] = await Promise.all([
                    axiosInstance.get('/admin/articles/stats'),
                    axiosInstance.get('/admin/articles/analytics', { params: { date_from: this.dateFrom, date_to: this.dateTo } }),
                ]);
                if (seq !== this.refreshSeq) return;
                this.summaryStats = statsRes.data.stats;
                this.analytics = analyticsRes.data.analytics;
                this.chartKey += 1;
            } catch (e) {
                console.error(e);
            } finally {
                if (seq === this.refreshSeq) {
                    this.loading = false;
                }
            }
        },
        async fetchAnalytics() {
            const seq = ++this.refreshSeq;
            this.loading = true;
            try {
                const res = await axiosInstance.get('/admin/articles/analytics', {
                    params: { date_from: this.dateFrom, date_to: this.dateTo },
                });
                if (seq !== this.refreshSeq) return;
                this.analytics = res.data.analytics;
                this.chartKey += 1;
                if (!this.summaryStats) {
                    const statsRes = await axiosInstance.get('/admin/articles/stats');
                    if (seq !== this.refreshSeq) return;
                    this.summaryStats = statsRes.data.stats;
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (seq === this.refreshSeq) {
                    this.loading = false;
                }
            }
        },
    },
    mounted() {
        this.refresh();
    },
};
</script>
