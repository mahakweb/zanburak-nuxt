<template>
    <AdminMasterPage
        :breadcrumb-title-override="article?.title"
        :breadcrumb-last-override="article?.title">
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-articles' }"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                    class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        بازگشت به لیست
                        <svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                </span></router-link>
            <button type="button" @click.prevent="editArticle"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                    class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        ویرایش مقاله
                        <svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                </span></button>
            <button type="button" @click="refreshData"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                    class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        بروزرسانی داده‌ها
                        <svg class="w-5 h-5 rtl:ms-1 -mt-0.5" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <rect x="0" y="0" width="24" height="24" />
                                <path
                                    d="M12,8 L8,8 C5.790861,8 4,9.790861 4,12 L4,13 C4,14.6568542 5.34314575,16 7,16 L7,18 C4.23857625,18 2,15.7614237 2,13 L2,12 C2,8.6862915 4.6862915,6 8,6 L12,6 L12,4.72799742 C12,4.62015048 12.0348702,4.51519416 12.0994077,4.42878885 C12.264656,4.2075478 12.5779675,4.16215674 12.7992086,4.32740507 L15.656242,6.46136716 C15.6951359,6.49041758 15.7295917,6.52497737 15.7585249,6.56395854 C15.9231063,6.78569617 15.876772,7.09886961 15.6550344,7.263451 L12.798001,9.3840407 C12.7118152,9.44801079 12.607332,9.48254921 12.5,9.48254921 C12.2238576,9.48254921 12,9.25869158 12,8.98254921 L12,8 Z"
                                    fill="currentColor" />
                                <path
                                    d="M12.0583175,16 L16,16 C18.209139,16 20,14.209139 20,12 L20,11 C20,9.34314575 18.6568542,8 17,8 L17,6 C19.7614237,6 22,8.23857625 22,11 L22,12 C22,15.3137085 19.3137085,18 16,18 L12.0583175,18 L12.0583175,18.9825492 C12.0583175,19.2586916 11.8344599,19.4825492 11.5583175,19.4825492 C11.4509855,19.4825492 11.3465023,19.4480108 11.2603165,19.3840407 L8.40328311,17.263451 C8.18154548,17.0988696 8.13521119,16.7856962 8.29979258,16.5639585 C8.32872576,16.5249774 8.36318164,16.4904176 8.40207551,16.4613672 L11.2591089,14.3274051 C11.48035,14.1621567 11.7936615,14.2075478 11.9589099,14.4287888 C12.0234473,14.5151942 12.0583175,14.6201505 12.0583175,14.7279974 L12.0583175,16 Z"
                                    fill="currentColor" opacity="0.3" />
                            </g>
                        </svg>
                    </span>
                </span></button>
        </template>
        <div class="min-w-0">
            <div v-if="article" class="mt-4 flex flex-wrap items-center justify-end gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-gray-400 dark:bg-gray-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">پیش‌نویس</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-emerald-400 dark:bg-emerald-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">منتشر شده</span>
                </div>
            </div>

            <div v-if="!loading && article" class="space-y-4 pt-2">
                <div class="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                    <div class="absolute w-1 h-full start-0 top-0 rounded-e-lg" :class="getPublishBarClass(article)">
                    </div>
                    <div class="p-4 ps-5">
                        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                            <div class="flex items-start gap-3 min-w-0 flex-1">
                                <div v-if="article.user"
                                    class="shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
                                    <img v-if="article.user.profile_pic" :src="article.user.profile_pic"
                                        :alt="article.user.first_name" class="w-full h-full object-cover"
                                        onerror="this.style.display='none'" />
                                    <div v-else class="w-full h-full flex items-center justify-center">
                                        <span class="text-yellow-500 text-sm font-semibold">{{
                                            article.user.first_name?.charAt(0) || '?' }}</span>
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                                        {{ article.title }}
                                    </h3>
                                    <p v-if="article.excerpt"
                                        class="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                        {{ article.excerpt }}
                                    </p>
                                    <div class="flex flex-wrap gap-1.5">
                                        <span v-if="article.user"
                                            class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ article.user.first_name }} {{ article.user.last_name }}
                                        </span>
                                        <span v-if="article.category"
                                            class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ article.category.title }}
                                        </span>
                                        <span
                                            class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ formatDate(article.created_at) }}
                                        </span>
                                        <span class="text-xs font-medium px-2 py-1 rounded-lg" :class="article.publish
                                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/20'
                                            : 'text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50'">
                                            {{ article.publish ? 'منتشر شده' : 'پیش‌نویس' }}
                                        </span>
                                        <span class="text-xs font-medium px-2 py-1 rounded-lg"
                                            :class="getStatusClass(article.status)">
                                            {{ getStatusLabel(article.status) }}
                                        </span>
                                        <span v-if="article.is_featured"
                                            class="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                                            ویژه
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button @click="togglePublish"
                                class="shrink-0 text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 px-3 py-1.5 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-400/10 border border-yellow-200/60 dark:border-yellow-700/40 transition-colors">
                                {{ article.publish ? 'تبدیل به پیش‌نویس' : 'انتشار مقاله' }}
                            </button>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                            <div
                                class="p-3 rounded-lg bg-gray-100/80 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 text-center">
                                <div class="text-lg font-bold text-gray-900 dark:text-white font-anjoman">{{
                                    article.views_count || 0 }}</div>
                                <div class="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">بازدید
                                </div>
                            </div>
                            <div
                                class="p-3 rounded-lg bg-rose-50/80 dark:bg-rose-900/20 border border-rose-200/60 dark:border-rose-800/40 text-center">
                                <div class="text-lg font-bold text-rose-700 dark:text-rose-300 font-anjoman">{{
                                    article.likes_count || 0 }}</div>
                                <div class="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">لایک</div>
                            </div>
                            <div
                                class="p-3 rounded-lg bg-violet-50/80 dark:bg-violet-900/20 border border-violet-200/60 dark:border-violet-800/40 text-center">
                                <div class="text-lg font-bold text-violet-700 dark:text-violet-300 font-anjoman">{{
                                    article.bookmarks_count || 0 }}</div>
                                <div class="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">بوکمارک
                                </div>
                            </div>
                            <div
                                class="p-3 rounded-lg bg-cyan-50/80 dark:bg-cyan-900/20 border border-cyan-200/60 dark:border-cyan-800/40 text-center">
                                <div class="text-lg font-bold text-cyan-700 dark:text-cyan-300 font-anjoman">{{
                                    article.comments_count || 0 }}</div>
                                <div class="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">نظر</div>
                            </div>
                            <div
                                class="p-3 rounded-lg bg-gray-100/80 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 text-center">
                                <div class="text-lg font-bold text-gray-900 dark:text-white font-anjoman">{{
                                    article.reading_time_minutes || 0 }}</div>
                                <div class="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">دقیقه مطالعه
                                </div>
                            </div>
                        </div>

                        <div v-if="analytics" class="mb-6 space-y-4">
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <AdminReportChartCard class="lg:col-span-2" title="روند تعامل" subtitle="۳۰ روز اخیر">
                                    <ComparisonLineChart v-if="articleDailyChart.labels.length" class="h-56"
                                        :labels="articleDailyChart.labels" :datasets="articleDailyChart.datasets" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="ترکیب تعامل">
                                    <DoughnutChart v-if="engagementMix.labels.length" class="h-56"
                                        :rawData="engagementMix" legendPosition="bottom" />
                                </AdminReportChartCard>
                            </div>
                            <div v-if="analytics.totals" class="grid grid-cols-3 gap-3">
                                <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
                                    <div class="text-sm font-bold text-amber-700 dark:text-amber-300 font-anjoman">{{ analytics.totals.likes_per_100_views }}</div>
                                    <div class="text-[10px] text-gray-500">لایک / ۱۰۰ بازدید</div>
                                </div>
                                <div class="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-center">
                                    <div class="text-sm font-bold text-cyan-700 dark:text-cyan-300 font-anjoman">{{ analytics.totals.comments_per_100_views }}</div>
                                    <div class="text-[10px] text-gray-500">نظر / ۱۰۰ بازدید</div>
                                </div>
                                <div class="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-center">
                                    <div class="text-sm font-bold text-violet-700 dark:text-violet-300 font-anjoman">{{ analytics.totals.bookmarks_per_100_views }}</div>
                                    <div class="text-[10px] text-gray-500">بوکمارک / ۱۰۰ بازدید</div>
                                </div>
                            </div>
                        </div>

                        <div v-if="article.cover_image" class="mb-4 rounded-xl overflow-hidden aspect-[16/9] max-w-3xl border border-gray-200/60 dark:border-gray-700/60">
                            <img :src="article.cover_image" :alt="article.title" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                        </div>

                        <div v-if="article.tags?.length" class="flex flex-wrap gap-1.5 mb-4">
                            <span v-for="tag in article.tags" :key="tag.id"
                                class="text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-900/20 px-2 py-1 rounded-lg">
                                #{{ tag.name }}
                            </span>
                        </div>

                        <div class="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm article-content">
                            <MarkdownRenderer startClass="rendered-content github-markdown-body" :source="article.content || ''" />
                        </div>

                        <div v-if="article.seo_title || article.seo_description || article.meta_keywords"
                            class="mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                            <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">اطلاعات SEO</h4>
                            <div class="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                                <p v-if="article.seo_title"><span class="font-semibold">عنوان:</span> {{
                                    article.seo_title }}</p>
                                <p v-if="article.seo_description"><span class="font-semibold">توضیحات:</span> {{
                                    article.seo_description }}</p>
                                <p v-if="article.meta_keywords"><span class="font-semibold">کلمات کلیدی:</span> {{
                                    article.meta_keywords }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="!loading" class="text-center py-16">
                <p class="text-sm font-medium text-gray-400 dark:text-gray-500">مقاله یافت نشد.</p>
            </div>

            <LoadingComponent v-if="loading" class="" />
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        MarkdownRenderer,
        AdminReportChartCard,
        ComparisonLineChart,
        DoughnutChart,
    },
    props: {
        id: {
            type: [String, Number],
            required: true,
        },
    },
    data() {
        return {
            article: null,
            analytics: null,
            loading: false,
        };
    },
    computed: {
        engagementMix() {
            const mix = this.analytics?.engagement_mix;
            return mix ? { labels: mix.labels, data: mix.data, colors: mix.colors } : { labels: [], data: [], colors: [] };
        },
        articleDailyChart() {
            const trend = this.analytics?.daily_trend || [];
            return {
                labels: trend.map((d) => d.date),
                datasets: [
                    { label: 'بازدید', data: trend.map((d) => d.views), borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.1)' },
                    { label: 'لایک', data: trend.map((d) => d.likes), borderColor: '#f472b6', backgroundColor: 'rgba(244,114,182,0.1)' },
                    { label: 'نظر', data: trend.map((d) => d.comments), borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.1)' },
                ],
            };
        },
    },
    mounted() {
        this.refreshData();
    },
    methods: {
        toastConfig() {
            return {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                bodyClassName: "font-YekanBakh",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            };
        },
        refreshData() {
            this.fetchArticle();
            this.fetchAnalytics();
        },
        getPublishBarClass(article) {
            return article?.publish
                ? 'bg-emerald-400 dark:bg-emerald-600'
                : 'bg-gray-400 dark:bg-gray-600';
        },
        getStatusLabel(status) {
            const labels = {
                draft: 'پیش‌نویس',
                pending: 'در انتظار',
                published: 'منتشر شده',
                archived: 'بایگانی',
            };
            return labels[status] || status || '-';
        },
        getStatusClass(status) {
            const classes = {
                draft: 'text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50',
                pending: 'text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/20',
                published: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/20',
                archived: 'text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/50',
            };
            return classes[status] || 'text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50';
        },
        formatDate(date) {
            if (!date) return '-';
            const d = new Date(date);
            const dateStr = d.toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
            });
            const timeStr = d.toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                hour12: true,
                minute: '2-digit',
            }).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ');
            return `${dateStr}  ${timeStr}`;
        },
        async fetchAnalytics() {
            try {
                const response = await axiosInstance.get(`/admin/article/${this.id}/analytics`);
                this.analytics = response.data.analytics;
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        },
        async fetchArticle() {
            this.loading = true;
            try {
                const response = await axiosInstance.get(`/admin/article/${this.id}`);
                this.article = response.data.article;
            } catch (error) {
                console.error('Error fetching article:', error);
                toast.error("خطایی در دریافت اطلاعات رخ داد.", this.toastConfig());
            } finally {
                this.loading = false;
            }
        },
        editArticle() {
            this.$router.push({
                name: 'admin-article-edit',
                params: { id: this.id },
            });
        },
        async togglePublish() {
            try {
                await axiosInstance.post(`/admin/article/${this.id}/toggle-publish`);
                toast.success('وضعیت انتشار با موفقیت تغییر کرد.', this.toastConfig());
                this.fetchArticle();
            } catch (error) {
                console.error('Error toggling publish:', error);
                toast.error('خطایی در تغییر وضعیت رخ داد.', this.toastConfig());
            }
        },
    },
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-content {
    line-height: 1.75;
}
</style>
