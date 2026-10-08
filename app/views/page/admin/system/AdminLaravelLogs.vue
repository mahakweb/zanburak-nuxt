<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <select v-model="selectedFile"
                class="h-9 px-2 text-xs font-semibold rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 max-w-[14rem]">
                <option v-for="f in files" :key="f.name" :value="f.name">
                    {{ f.name }} ({{ f.size_human }})
                </option>
            </select>
            <select v-model.number="refreshInterval"
                class="h-9 px-2 text-xs font-semibold rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <option :value="0">بدون خودکار</option>
                <option :value="30">هر ۳۰ ثانیه</option>
                <option :value="60">هر ۶۰ ثانیه</option>
            </select>
            <button v-if="$can('system.logs.download')" @click="downloadFile" :disabled="loading"
                class="shrink-0 h-9 rounded-lg bg-white px-3 text-sm font-semibold text-gray-800 border border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-700 hover:bg-zinc-100 disabled:opacity-60">
                دانلود
            </button>
            <button v-if="$can('system.logs.clear')" @click="confirmClear" :disabled="loading"
                class="shrink-0 h-9 rounded-lg bg-red-50 px-3 text-sm font-semibold text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50 hover:bg-red-100 disabled:opacity-60">
                پاک‌سازی
            </button>
            <button @click="refreshAll" :disabled="loading"
                class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 disabled:opacity-60 dark:bg-gray-900 dark:text-white">
                <span class="flex items-center">
                    {{ loading ? 'در حال بارگذاری...' : 'به‌روزرسانی' }}
                    <svg class="w-5 h-5 rtl:ms-1 -mt-0.5" :class="{ 'animate-spin': loading }" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8 L8 8 C5.790861 8 4 9.790861 4 12 L4 13 C4 14.6568542 5.34314575 16 7 16 L7 18 C4.23857625 18 2 15.7614237 2 13 L2 12 C2 8.6862915 4.6862915 6 8 6 L12 6 L12 4.72799742 Z" fill="currentColor" />
                    </svg>
                </span>
            </button>
        </template>

        <div class="space-y-5">
            <div v-if="fetchError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {{ fetchError }}
            </div>

            <div v-if="loading && !hasLoaded" class="text-sm font-semibold text-center py-24 text-gray-500">
                <div class="inline-flex flex-col items-center gap-3">
                    <div class="w-12 h-12 rounded-full border-4 border-yellow-400/30 border-t-yellow-400 animate-spin"></div>
                    در حال خواندن و تحلیل لاگ‌ها...
                </div>
            </div>

            <template v-else>
                <!-- Hero -->
                <div class="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-bl from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
                    <div class="absolute inset-0 opacity-30"
                        style="background-image: radial-gradient(circle at 15% 20%, rgba(239,68,68,0.2), transparent 40%), radial-gradient(circle at 85% 10%, rgba(250,204,21,0.2), transparent 35%);">
                    </div>
                    <div class="relative p-5 md:p-7">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div class="flex items-center gap-5">
                                <div class="relative shrink-0">
                                    <SystemResourceGauge
                                        :value="stats.health?.score"
                                        :status="stats.health?.status"
                                        label=""
                                        unit=""
                                        :display-text="healthDisplay"
                                        :size="120"
                                        :stroke-width="8"
                                    />
                                    <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-black rounded-full"
                                        :class="healthGradeClass">
                                        {{ stats.health?.grade || '—' }}
                                    </span>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="relative flex h-2.5 w-2.5">
                                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="pulseClass"></span>
                                            <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="pulseClass"></span>
                                        </span>
                                        <span class="text-xs font-semibold uppercase tracking-wider text-gray-300">Laravel Log Analyzer</span>
                                    </div>
                                    <h2 class="text-2xl md:text-3xl font-black">{{ stats.health?.label || 'تحلیل لاگ' }}</h2>
                                    <p class="mt-1 text-sm text-gray-300" dir="ltr">{{ selectedFile }}</p>
                                    <p class="mt-2 text-xs text-gray-400">
                                        حجم: {{ stats.size_human || '—' }}
                                        <span v-if="stats.modified_at"> • آخرین تغییر: {{ formatDateTime(stats.modified_at) }}</span>
                                        <span v-if="stats.analyzed_entries"> • {{ formatNumber(stats.analyzed_entries) }} رکورد تحلیل‌شده</span>
                                    </p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:min-w-[28rem]">
                                <div v-for="stat in heroStats" :key="stat.label"
                                    class="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-3 py-2.5">
                                    <p class="text-[10px] text-gray-400 font-medium">{{ stat.label }}</p>
                                    <p class="text-lg font-bold mt-0.5" dir="ltr">{{ stat.value }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stat cards -->
                <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
                    <AdminReportStatCard v-for="card in levelStatCards" :key="card.key"
                        :title="card.title" :value="formatNumber(card.value)" :accent="card.accent" value-dir="ltr">
                        <template #icon>
                            <span class="text-sm font-bold">{{ card.icon }}</span>
                        </template>
                    </AdminReportStatCard>
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <AdminReportChartCard title="توزیع سطح لاگ" subtitle="Emergency تا Debug">
                        <DoughnutChart v-if="levelChart.data.length" class="h-72" :raw-data="levelChart" legend-position="bottom" />
                        <p v-else class="text-sm text-gray-500 text-center py-20">داده‌ای برای نمایش نیست</p>
                    </AdminReportChartCard>
                    <AdminReportChartCard title="روند ساعتی" subtitle="کل، خطا و هشدار">
                        <ComparisonLineChart v-if="hourlyChart.labels.length" class="h-72"
                            :labels="hourlyChart.labels" :datasets="hourlyChart.datasets" />
                        <p v-else class="text-sm text-gray-500 text-center py-20">داده ساعتی موجود نیست</p>
                    </AdminReportChartCard>
                    <AdminReportChartCard title="روند روزانه" subtitle="تعداد لاگ در هر روز">
                        <AreaChart v-if="dailyChart.data.length" class="h-72" :raw-data="dailyChart"
                            line-color="rgba(59, 130, 246, 1)" fill-color="rgba(59, 130, 246, 0.15)" :parse-labels-as-dates="false" />
                        <p v-else class="text-sm text-gray-500 text-center py-20">داده روزانه موجود نیست</p>
                    </AdminReportChartCard>
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <AdminReportChartCard title="کانال‌های لاگ" subtitle="local، stack و ...">
                        <AdminBarChart v-if="channelChart.labels.length" class="h-72" :raw-data="channelChart" :horizontal="true" />
                        <p v-else class="text-sm text-gray-500 text-center py-20">کانالی شناسایی نشد</p>
                    </AdminReportChartCard>
                    <AdminReportChartCard title="برترین Exceptionها" subtitle="کلاس‌های خطای پرتکرار">
                        <AdminBarChart v-if="exceptionChart.labels.length" class="h-72" :raw-data="exceptionChart" :horizontal="true"
                            :colors="['#ef4444','#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#14b8a6','#06b6d4']" />
                        <p v-else class="text-sm text-gray-500 text-center py-20">Exception شناسایی نشد</p>
                    </AdminReportChartCard>
                </div>

                <!-- Filters -->
                <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-4 shadow-sm">
                    <div class="flex flex-wrap items-end gap-3">
                        <div class="min-w-[10rem]">
                            <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">سطح</label>
                            <select v-model="filters.level"
                                class="w-full h-9 px-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                <option value="">همه</option>
                                <option v-for="lv in levelOptions" :key="lv" :value="lv">{{ lv }}</option>
                            </select>
                        </div>
                        <div class="min-w-[12rem]">
                            <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">جستجو</label>
                            <input v-model="filters.search" type="search" placeholder="پیام، exception، context..."
                                class="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">از تاریخ</label>
                            <input v-model="filters.from" type="datetime-local"
                                class="h-9 px-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">تا تاریخ</label>
                            <input v-model="filters.to" type="datetime-local"
                                class="h-9 px-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                        </div>
                        <button @click="applyFilters"
                            class="h-9 px-4 text-sm font-semibold rounded-lg bg-yellow-400 text-black hover:bg-yellow-500">
                            اعمال فیلتر
                        </button>
                        <button @click="resetFilters"
                            class="h-9 px-4 text-sm font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            پاک کردن
                        </button>
                    </div>
                </div>

                <!-- Log table -->
                <TabGroup>
                    <TabList class="whitespace-nowrap p-1.5 flex items-center gap-1 overflow-x-auto bg-gray-100/70 dark:bg-gray-800 rounded-xl">
                        <Tab v-for="tab in tabs" :key="tab.id" as="div">
                            <button @click.prevent="selectedTab = tab.id"
                                class="shrink-0 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                                :class="selectedTab === tab.id ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'">
                                {{ tab.label }}
                                <span v-if="tab.badge" class="ms-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">{{ tab.badge }}</span>
                            </button>
                        </Tab>
                    </TabList>
                    <TabPanels class="mt-4">
                        <TabPanel>
                            <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                                <div class="overflow-x-auto">
                                    <table class="min-w-full text-sm">
                                        <thead class="bg-gray-50 dark:bg-gray-800/80 text-xs text-gray-500 dark:text-gray-400">
                                            <tr>
                                                <th class="px-4 py-3 text-start font-semibold">زمان</th>
                                                <th class="px-4 py-3 text-start font-semibold">سطح</th>
                                                <th class="px-4 py-3 text-start font-semibold">کانال</th>
                                                <th class="px-4 py-3 text-start font-semibold">پیام</th>
                                                <th class="px-4 py-3 text-start font-semibold">Exception</th>
                                                <th class="px-4 py-3 text-start font-semibold w-20">عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                                            <tr v-if="!entries.length">
                                                <td colspan="6" class="px-4 py-12 text-center text-gray-500">لاگی با این فیلتر پیدا نشد</td>
                                            </tr>
                                            <tr v-for="entry in entries" :key="entry.id"
                                                class="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                                                <td class="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400" dir="ltr">{{ entry.datetime }}</td>
                                                <td class="px-4 py-3">
                                                    <span class="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase" :class="levelBadgeClass(entry.level)">
                                                        {{ entry.level }}
                                                    </span>
                                                </td>
                                                <td class="px-4 py-3 text-xs text-gray-600 dark:text-gray-400" dir="ltr">{{ entry.channel }}</td>
                                                <td class="px-4 py-3 max-w-md">
                                                    <p class="text-gray-800 dark:text-gray-200 line-clamp-2">{{ entry.message }}</p>
                                                    <p v-if="entry.context_preview" class="mt-1 text-[11px] text-gray-500 font-mono truncate" dir="ltr">{{ entry.context_preview }}</p>
                                                </td>
                                                <td class="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 font-mono" dir="ltr">
                                                    {{ entry.exception_class || '—' }}
                                                </td>
                                                <td class="px-4 py-3">
                                                    <button @click="openEntry(entry.id)"
                                                        class="text-xs font-semibold text-yellow-600 hover:text-yellow-700 dark:text-yellow-400">
                                                        جزئیات
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div v-if="pagination.total > 0" class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                                    <p class="text-xs text-gray-500">
                                        {{ formatNumber(pagination.from) }} تا {{ formatNumber(pagination.to) }} از {{ formatNumber(pagination.total) }}
                                    </p>
                                    <div class="flex items-center gap-2">
                                        <button :disabled="pagination.current_page <= 1" @click="goPage(pagination.current_page - 1)"
                                            class="h-8 px-3 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40">
                                            قبلی
                                        </button>
                                        <span class="text-xs font-mono" dir="ltr">{{ pagination.current_page }} / {{ pagination.last_page }}</span>
                                        <button :disabled="pagination.current_page >= pagination.last_page" @click="goPage(pagination.current_page + 1)"
                                            class="h-8 px-3 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40">
                                            بعدی
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>

                <!-- Top exceptions table -->
                <div v-if="stats.top_exceptions?.length" class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3">جزئیات Exceptionهای پرتکرار</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div v-for="ex in stats.top_exceptions" :key="ex.class"
                            class="flex items-center justify-between gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 px-3 py-2">
                            <span class="text-xs font-mono text-gray-700 dark:text-gray-300 truncate" dir="ltr">{{ ex.class }}</span>
                            <span class="shrink-0 text-xs font-bold text-red-600 dark:text-red-400">{{ formatNumber(ex.count) }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Detail modal -->
        <div v-if="detailEntry" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50" @click.self="detailEntry = null">
            <div class="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
                <div class="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">جزئیات لاگ #{{ detailEntry.id }}</p>
                        <p class="text-xs text-gray-500 mt-0.5 font-mono" dir="ltr">{{ detailEntry.datetime }}</p>
                    </div>
                    <button @click="detailEntry = null" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                </div>
                <div class="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-4rem)]">
                    <div class="flex flex-wrap gap-2">
                        <span class="px-2 py-1 rounded-md text-xs font-bold uppercase" :class="levelBadgeClass(detailEntry.level)">{{ detailEntry.level }}</span>
                        <span class="px-2 py-1 rounded-md text-xs font-mono bg-gray-100 dark:bg-gray-800" dir="ltr">{{ detailEntry.channel }}</span>
                        <span v-if="detailEntry.exception_class" class="px-2 py-1 rounded-md text-xs font-mono bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300" dir="ltr">{{ detailEntry.exception_class }}</span>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-500 mb-1">پیام</p>
                        <p class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ detailEntry.message }}</p>
                    </div>
                    <div v-if="detailEntry.context">
                        <p class="text-xs font-semibold text-gray-500 mb-1">Context (JSON)</p>
                        <pre class="text-xs font-mono p-3 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-x-auto" dir="ltr">{{ JSON.stringify(detailEntry.context, null, 2) }}</pre>
                    </div>
                    <div v-if="detailEntry.stack">
                        <p class="text-xs font-semibold text-gray-500 mb-1">Stack Trace</p>
                        <pre class="text-xs font-mono p-3 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-x-auto whitespace-pre-wrap" dir="ltr">{{ detailEntry.stack }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import SystemResourceGauge from "@/views/components/admin/system/SystemResourceGauge.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import AreaChart from "@/views/components/chart/AreaChart.vue";
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
import axiosInstance from "@/store/axiosInstance";

export default {
    name: "AdminLaravelLogs",
    components: {
        AdminMasterPage,
        AdminReportStatCard,
        AdminReportChartCard,
        SystemResourceGauge,
        DoughnutChart,
        AreaChart,
        ComparisonLineChart,
        AdminBarChart,
        Tab, TabGroup, TabList, TabPanel, TabPanels,
    },
    data() {
        return {
            loading: false,
            hasLoaded: false,
            fetchError: "",
            refreshInterval: 0,
            refreshTimer: null,
            files: [],
            selectedFile: "laravel.log",
            stats: {},
            entries: [],
            pagination: { current_page: 1, per_page: 25, total: 0, last_page: 1, from: 0, to: 0 },
            filters: { level: "", search: "", from: "", to: "" },
            selectedTab: "logs",
            detailEntry: null,
            levelOptions: ["emergency", "alert", "critical", "error", "warning", "notice", "info", "debug"],
            tabs: [
                { id: "logs", label: "لیست لاگ‌ها" },
            ],
        };
    },
    computed: {
        healthDisplay() {
            const score = this.stats.health?.score;
            if (score == null) return "—";
            return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(score);
        },
        healthGradeClass() {
            const grade = this.stats.health?.grade;
            const map = { A: "bg-emerald-500 text-white", B: "bg-blue-500 text-white", C: "bg-amber-500 text-black", D: "bg-orange-500 text-white", F: "bg-red-500 text-white" };
            return map[grade] || "bg-gray-500 text-white";
        },
        pulseClass() {
            const s = this.stats.health?.status;
            return { healthy: "bg-emerald-400", warning: "bg-amber-400", critical: "bg-red-400" }[s] || "bg-gray-400";
        },
        heroStats() {
            const t = this.stats.totals || {};
            return [
                { label: "کل لاگ", value: this.formatNumber(t.all) },
                { label: "خطا", value: this.formatNumber(t.errors) },
                { label: "هشدار", value: this.formatNumber(t.warnings) },
                { label: "نرخ خطا", value: (this.stats.error_rate_percent ?? 0) + "%" },
            ];
        },
        levelStatCards() {
            const l = this.stats.levels || {};
            return [
                { key: "emergency", title: "Emergency", value: l.emergency || 0, accent: "rose", icon: "⛔" },
                { key: "alert", title: "Alert", value: l.alert || 0, accent: "rose", icon: "🚨" },
                { key: "critical", title: "Critical", value: l.critical || 0, accent: "rose", icon: "🔴" },
                { key: "error", title: "Error", value: l.error || 0, accent: "rose", icon: "✖" },
                { key: "warning", title: "Warning", value: l.warning || 0, accent: "amber", icon: "⚠" },
                { key: "notice", title: "Notice", value: l.notice || 0, accent: "blue", icon: "ℹ" },
                { key: "info", title: "Info", value: l.info || 0, accent: "emerald", icon: "✓" },
                { key: "debug", title: "Debug", value: l.debug || 0, accent: "cyan", icon: "🔧" },
            ];
        },
        levelChart() {
            const c = this.stats.charts?.levels || {};
            return { labels: c.labels || [], data: c.data || [], colors: c.colors || [] };
        },
        hourlyChart() {
            const c = this.stats.charts?.hourly || {};
            return {
                labels: c.labels || [],
                datasets: [
                    { label: "کل", data: c.total || [], lineColor: "#3b82f6", fillColor: "rgba(59,130,246,0.1)" },
                    { label: "خطا", data: c.errors || [], lineColor: "#ef4444", fillColor: "rgba(239,68,68,0.08)", fill: false },
                    { label: "هشدار", data: c.warnings || [], lineColor: "#f59e0b", fillColor: "rgba(245,158,11,0.08)", fill: false },
                ],
            };
        },
        dailyChart() {
            const c = this.stats.charts?.daily || {};
            return { labels: c.labels || [], data: c.data || [] };
        },
        channelChart() {
            const c = this.stats.charts?.channels || {};
            return { labels: c.labels || [], data: c.data || [], colors: c.colors || [] };
        },
        exceptionChart() {
            const c = this.stats.charts?.exceptions || {};
            return { labels: c.labels || [], data: c.data || [] };
        },
    },
    watch: {
        selectedFile() {
            this.pagination.current_page = 1;
            this.refreshAll();
        },
        refreshInterval() {
            this.setupAutoRefresh();
        },
        "stats.totals.errors"(count) {
            const tab = this.tabs.find((t) => t.id === "logs");
            if (tab && count > 0) tab.badge = count;
        },
    },
    mounted() {
        this.refreshAll();
        this.setupAutoRefresh();
    },
    beforeUnmount() {
        if (this.refreshTimer) clearInterval(this.refreshTimer);
    },
    methods: {
        async refreshAll() {
            try {
                this.loading = true;
                this.fetchError = "";
                await this.fetchFiles();
                await Promise.all([this.fetchStats(), this.fetchEntries()]);
                this.hasLoaded = true;
            } catch (e) {
                console.error(e);
                this.fetchError = "خطا در خواندن لاگ‌های Laravel.";
            } finally {
                this.loading = false;
            }
        },
        async fetchFiles() {
            const res = await axiosInstance.get("admin/system/logs/files");
            if (res.data?.message === "Success") {
                this.files = res.data.files || [];
                if (!this.files.find((f) => f.name === this.selectedFile) && this.files.length) {
                    this.selectedFile = this.files[0].name;
                }
            }
        },
        async fetchStats() {
            const params = { file: this.selectedFile };
            if (this.filters.from) params.from = this.filters.from;
            if (this.filters.to) params.to = this.filters.to;
            const res = await axiosInstance.get("admin/system/logs/stats", { params });
            if (res.data?.message === "Success") {
                this.stats = res.data.data || {};
            }
        },
        async fetchEntries() {
            const payload = {
                file: this.selectedFile,
                page: this.pagination.current_page,
                per_page: this.pagination.per_page,
                level: this.filters.level || undefined,
                search: this.filters.search || undefined,
                from: this.filters.from || undefined,
                to: this.filters.to || undefined,
            };
            const res = await axiosInstance.post("admin/system/logs", payload);
            if (res.data?.message === "Success") {
                this.entries = res.data.data || [];
                this.pagination = res.data.pagination || this.pagination;
            }
        },
        async openEntry(id) {
            try {
                const res = await axiosInstance.get(`admin/system/logs/${id}`, {
                    params: { file: this.selectedFile },
                });
                if (res.data?.message === "Success") {
                    this.detailEntry = res.data.data;
                }
            } catch (e) {
                console.error(e);
            }
        },
        applyFilters() {
            this.pagination.current_page = 1;
            this.fetchStats();
            this.fetchEntries();
        },
        resetFilters() {
            this.filters = { level: "", search: "", from: "", to: "" };
            this.pagination.current_page = 1;
            this.fetchStats();
            this.fetchEntries();
        },
        goPage(page) {
            this.pagination.current_page = page;
            this.fetchEntries();
        },
        async downloadFile() {
            try {
                const res = await axiosInstance.get("admin/system/logs/download", {
                    params: { file: this.selectedFile },
                    responseType: "blob",
                });
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", this.selectedFile);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (e) {
                console.error(e);
                this.fetchError = "خطا در دانلود فایل لاگ.";
            }
        },
        async confirmClear() {
            if (!confirm(`فایل «${this.selectedFile}» پاک شود؟ این عمل قابل بازگشت نیست.`)) return;
            try {
                await axiosInstance.post("admin/system/logs/clear", { file: this.selectedFile });
                await this.refreshAll();
            } catch (e) {
                console.error(e);
                this.fetchError = "خطا در پاک‌سازی فایل لاگ.";
            }
        },
        setupAutoRefresh() {
            if (this.refreshTimer) clearInterval(this.refreshTimer);
            if (!this.refreshInterval) return;
            this.refreshTimer = setInterval(() => {
                if (!this.loading) this.refreshAll();
            }, this.refreshInterval * 1000);
        },
        levelBadgeClass(level) {
            const map = {
                EMERGENCY: "bg-red-900 text-white",
                ALERT: "bg-red-800 text-white",
                CRITICAL: "bg-red-700 text-white",
                ERROR: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
                WARNING: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
                NOTICE: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
                INFO: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
                DEBUG: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
            };
            return map[level] || "bg-gray-100 text-gray-700";
        },
        formatNumber(n) {
            if (n === null || n === undefined) return "—";
            return new Intl.NumberFormat("fa-IR").format(n);
        },
        formatDateTime(value) {
            if (!value) return "—";
            try {
                return new Date(value).toLocaleString("fa-IR");
            } catch {
                return value;
            }
        },
    },
};
</script>
