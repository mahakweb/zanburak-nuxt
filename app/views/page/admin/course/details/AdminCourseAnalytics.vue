<template>
    <div>
        <AdminInlineLoading v-if="loading" />
        <div v-else class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                <AdminReportStatCard title="بازدیدها" :value="formatNumber(statistics.views_count)" accent="blue">
                    <template #icon>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="لایک‌ها" :value="formatNumber(statistics.likes_count)" accent="emerald">
                    <template #icon>
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="کامنت‌ها" :value="formatNumber(statistics.comments_count)" accent="violet">
                    <template #icon>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="بوکمارک‌ها" :value="formatNumber(statistics.bookmarks_count)" accent="amber">
                    <template #icon>
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
            </div>

            <div v-if="analytics" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                <AdminReportStatCard
                    title="نرخ تعامل"
                    :value="`${analytics.engagement_rate || 0}%`"
                    subtitle="لایک + کامنت + بوکمارک نسبت به بازدید"
                    accent="violet">
                    <template #icon>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard
                    title="میانگین بازدید روزانه"
                    :value="formatNumber(analytics.avg_views_per_day || 0)"
                    accent="rose">
                    <template #icon>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard
                    title="نرخ رشد بازدید"
                    :value="`${analytics.views_growth_rate || 0}%`"
                    subtitle="۷ روز گذشته"
                    accent="cyan">
                    <template #icon>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard
                    title="روز از ایجاد"
                    :value="formatNumber(analytics.days_since_creation || 0)"
                    accent="amber">
                    <template #icon>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
            </div>

            <div v-if="analytics" class="space-y-4">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <AdminReportChartCard title="بازدیدها" subtitle="روند ۳۰ روز گذشته" badge="۳۰ روز">
                        <AreaChart
                            v-if="viewsChart.labels.length"
                            class="h-64"
                            :rawData="viewsChart"
                            :showLegend="false"
                            :showTitle="false"
                            :dateFormatOptions="shortDateFormat"
                            lineColor="rgba(59, 130, 246, 1)"
                            fillColor="rgba(59, 130, 246, 0.18)"
                        />
                        <p v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-12">داده‌ای برای نمایش وجود ندارد</p>
                    </AdminReportChartCard>

                    <AdminReportChartCard title="لایک‌ها" subtitle="روند ۳۰ روز گذشته" badge="۳۰ روز">
                        <AreaChart
                            v-if="likesChart.labels.length"
                            class="h-64"
                            :rawData="likesChart"
                            :showLegend="false"
                            :showTitle="false"
                            :dateFormatOptions="shortDateFormat"
                            lineColor="rgba(16, 185, 129, 1)"
                            fillColor="rgba(16, 185, 129, 0.18)"
                        />
                        <p v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-12">داده‌ای برای نمایش وجود ندارد</p>
                    </AdminReportChartCard>

                    <AdminReportChartCard title="کامنت‌ها" subtitle="روند ۳۰ روز گذشته" badge="۳۰ روز">
                        <AreaChart
                            v-if="commentsChart.labels.length"
                            class="h-64"
                            :rawData="commentsChart"
                            :showLegend="false"
                            :showTitle="false"
                            :dateFormatOptions="shortDateFormat"
                            lineColor="rgba(139, 92, 246, 1)"
                            fillColor="rgba(139, 92, 246, 0.18)"
                        />
                        <p v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-12">داده‌ای برای نمایش وجود ندارد</p>
                    </AdminReportChartCard>

                    <AdminReportChartCard title="بوکمارک‌ها" subtitle="روند ۳۰ روز گذشته" badge="۳۰ روز">
                        <AreaChart
                            v-if="bookmarksChart.labels.length"
                            class="h-64"
                            :rawData="bookmarksChart"
                            :showLegend="false"
                            :showTitle="false"
                            :dateFormatOptions="shortDateFormat"
                            lineColor="rgba(245, 158, 11, 1)"
                            fillColor="rgba(245, 158, 11, 0.18)"
                        />
                        <p v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-12">داده‌ای برای نمایش وجود ندارد</p>
                    </AdminReportChartCard>
                </div>

                <AdminReportChartCard
                    title="فعالیت ترکیبی"
                    subtitle="مقایسه بازدید، لایک، کامنت و بوکمارک در ۳۰ روز"
                    badge="۳۰ روز">
                    <ComparisonBarChart
                        v-if="combinedLabels.length"
                        class="h-80"
                        :labels="combinedLabels"
                        :datasets="combinedDatasets"
                    />
                    <p v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-12">داده‌ای برای نمایش وجود ندارد</p>
                </AdminReportChartCard>

                <AdminReportChartCard
                    title="بازدید بر اساس ساعت روز"
                    subtitle="توزیع بازدیدها در ساعات شبانه‌روز">
                    <AdminBarChart
                        v-if="hourlyChart.labels.length"
                        class="h-72"
                        :rawData="hourlyChart"
                        barColor="rgba(245, 158, 11, 0.85)"
                        hoverColor="rgba(245, 158, 11, 1)"
                    />
                    <p v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-12">داده‌ای برای نمایش وجود ندارد</p>
                </AdminReportChartCard>
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import AreaChart from "@/views/components/chart/AreaChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import ComparisonBarChart from "@/views/components/chart/ComparisonBarChart.vue";

export default {
    components: {
        AdminInlineLoading,
        AdminReportStatCard,
        AdminReportChartCard,
        AreaChart,
        AdminBarChart,
        ComparisonBarChart,
    },
    props: {
        courseSlug: { type: String, required: true },
    },
    data() {
        return {
            statistics: {
                likes_count: 0,
                comments_count: 0,
                views_count: 0,
                bookmarks_count: 0,
            },
            analytics: null,
            loading: false,
            shortDateFormat: { day: "numeric", month: "short" },
        };
    },
    computed: {
        viewsChart() {
            return this.seriesFrom(this.analytics?.views_by_date);
        },
        likesChart() {
            return this.seriesFrom(this.analytics?.likes_by_date);
        },
        commentsChart() {
            return this.seriesFrom(this.analytics?.comments_by_date);
        },
        bookmarksChart() {
            return this.seriesFrom(this.analytics?.bookmarks_by_date);
        },
        hourlyChart() {
            const rows = this.analytics?.views_by_hour || [];
            return {
                labels: rows.map((h) => `${String(h.hour).padStart(2, "0")}:00`),
                data: rows.map((h) => Number(h.count) || 0),
            };
        },
        combinedLabels() {
            return (this.analytics?.views_by_date || []).map((d) => this.formatShortLabel(d.date));
        },
        combinedDatasets() {
            if (!this.analytics?.views_by_date?.length) return [];
            return [
                {
                    label: "بازدید",
                    data: (this.analytics.views_by_date || []).map((d) => Number(d.count) || 0),
                    color: "rgba(59, 130, 246, 0.85)",
                    hoverColor: "rgba(59, 130, 246, 1)",
                },
                {
                    label: "لایک",
                    data: (this.analytics.likes_by_date || []).map((d) => Number(d.count) || 0),
                    color: "rgba(16, 185, 129, 0.85)",
                    hoverColor: "rgba(16, 185, 129, 1)",
                },
                {
                    label: "کامنت",
                    data: (this.analytics.comments_by_date || []).map((d) => Number(d.count) || 0),
                    color: "rgba(139, 92, 246, 0.85)",
                    hoverColor: "rgba(139, 92, 246, 1)",
                },
                {
                    label: "بوکمارک",
                    data: (this.analytics.bookmarks_by_date || []).map((d) => Number(d.count) || 0),
                    color: "rgba(245, 158, 11, 0.85)",
                    hoverColor: "rgba(245, 158, 11, 1)",
                },
            ];
        },
    },
    methods: {
        formatNumber(value) {
            return Number(value || 0).toLocaleString("fa-IR");
        },
        seriesFrom(rows) {
            const list = Array.isArray(rows) ? rows : [];
            return {
                labels: list.map((d) => d.date),
                data: list.map((d) => Number(d.count) || 0),
            };
        },
        formatShortLabel(date) {
            const parsed = new Date(date);
            if (Number.isNaN(parsed.getTime())) return date;
            return parsed.toLocaleDateString("fa-IR", this.shortDateFormat);
        },
        async getCourseStatistics() {
            this.loading = true;
            try {
                const [overviewResponse, analyticsResponse] = await Promise.all([
                    axiosInstance.post(
                        `admin/course/${this.courseSlug}/details`,
                        { data_type: "overview" }
                    ),
                    axiosInstance.post(
                        `admin/course/${this.courseSlug}/details`,
                        { data_type: "analytics" }
                    ),
                ]);
                this.statistics = overviewResponse.data.statistics || {};
                this.analytics = analyticsResponse.data.analytics || null;
            } catch (error) {
                console.error("Error fetching course statistics:", error);
                this.statistics = {};
                this.analytics = null;
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
        this.getCourseStatistics();
    },
};
</script>
