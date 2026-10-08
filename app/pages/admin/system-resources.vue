<script setup>
definePageMeta({
  name: "admin-system-resources",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <select v-model.number="refreshInterval"
                class="h-9 px-2 text-xs font-semibold rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <option :value="0">بدون خودکار</option>
                <option :value="10">هر ۱۰ ثانیه</option>
                <option :value="30">هر ۳۰ ثانیه</option>
                <option :value="60">هر ۶۰ ثانیه</option>
            </select>
            <span v-if="refreshInterval > 0 && countdown > 0"
                class="text-xs font-mono text-gray-500 dark:text-gray-400 tabular-nums" dir="ltr">
                {{ countdown }}s
            </span>
            <button @click="refresh" :disabled="loading"
                class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset] disabled:opacity-60 disabled:cursor-not-allowed dark:bg-gray-900 dark:text-white">
                <span class="flex items-center">
                    {{ loading ? 'در حال اسکن...' : 'اسکن مجدد' }}
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
                    در حال اسکن منابع سرور...
                </div>
            </div>

            <template v-else>
                <!-- Hero Health Banner -->
                <div class="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-bl from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
                    <div class="absolute inset-0 opacity-30"
                        style="background-image: radial-gradient(circle at 20% 20%, rgba(250,204,21,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.2), transparent 35%);">
                    </div>
                    <div class="relative p-5 md:p-7">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div class="flex items-center gap-5">
                                <div class="relative shrink-0">
                                    <SystemResourceGauge
                                        :value="data.health?.score"
                                        :status="data.health?.status"
                                        label=""
                                        unit=""
                                        :display-text="healthDisplay"
                                        :size="120"
                                        :stroke-width="8"
                                    />
                                    <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-black rounded-full"
                                        :class="healthGradeClass">
                                        {{ data.health?.grade || '—' }}
                                    </span>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="relative flex h-2.5 w-2.5">
                                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                                :class="pulseClass"></span>
                                            <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="pulseClass"></span>
                                        </span>
                                        <span class="text-xs font-semibold uppercase tracking-wider text-gray-300">System Monitor</span>
                                    </div>
                                    <h2 class="text-2xl md:text-3xl font-black">{{ data.health?.label || 'در حال بررسی' }}</h2>
                                    <p class="mt-1 text-sm text-gray-300">
                                        {{ data.server?.hostname }} • {{ data.server?.os }}
                                    </p>
                                    <p class="mt-2 text-xs text-gray-400">
                                        آخرین اسکن: {{ formatDateTime(data.collected_at) }}
                                        <span v-if="data.performance?.collection_time_ms" dir="ltr">
                                            • {{ data.performance.collection_time_ms }}ms
                                        </span>
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

                <!-- Alerts -->
                <div v-if="data.alerts?.length" class="space-y-2">
                    <div v-for="(alert, i) in data.alerts" :key="i"
                        class="flex items-start gap-3 rounded-xl px-4 py-3 border"
                        :class="alertBoxClass(alert.level)">
                        <span class="shrink-0 mt-0.5 text-lg">{{ alertIcon(alert.level) }}</span>
                        <div>
                            <p class="text-sm font-bold">{{ alert.title }}</p>
                            <p class="text-xs mt-0.5 opacity-90">{{ alert.message }}</p>
                        </div>
                    </div>
                </div>

                <!-- Gauge Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div v-for="gauge in gauges" :key="gauge.key"
                        class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-3 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
                        <SystemResourceGauge
                            :value="gauge.value"
                            :status="gauge.status"
                            :label="gauge.label"
                            :subtitle="gauge.subtitle"
                            :unit="gauge.unit"
                            :display-text="gauge.displayText"
                            :size="110"
                            :stroke-width="8"
                        />
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <AdminReportChartCard title="روند سلامت سیستم" subtitle="امتیاز کلی، CPU و RAM">
                        <ComparisonLineChart v-if="healthTrendChart.labels.length > 1" class="h-80"
                            :labels="healthTrendChart.labels" :datasets="healthTrendChart.datasets" />
                        <p v-else class="text-sm text-gray-500 text-center py-20">پس از چند اسکن، روند نمایش داده می‌شود</p>
                    </AdminReportChartCard>
                    <AdminReportChartCard title="بنچمارک عملکرد" subtitle="زمان پاسخ میلی‌ثانیه‌ای">
                        <AdminBarChart v-if="benchmarkChart.labels.length" class="h-80"
                            :raw-data="benchmarkChart" :horizontal="true" />
                    </AdminReportChartCard>
                    <AdminReportChartCard title="بزرگ‌ترین جداول DB" subtitle="حجم به مگابایت">
                        <AdminBarChart v-if="dbTablesChart.labels.length" class="h-80"
                            :raw-data="dbTablesChart" :horizontal="true"
                            :colors="['#06b6d4','#0891b2','#0e7490','#155e75','#164e63']" />
                        <p v-else class="text-sm text-gray-500 text-center py-20">اطلاعات جداول در دسترس نیست</p>
                    </AdminReportChartCard>
                </div>

                <!-- Tabs -->
                <TabGroup>
                    <TabList class="whitespace-nowrap p-1.5 flex items-center gap-1 overflow-x-auto bg-gray-100/70 dark:bg-gray-800 rounded-xl">
                        <Tab v-for="tab in tabs" :key="tab.id" as="div">
                            <button @click.prevent="selectedTab = tab.id"
                                class="shrink-0 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                                :class="selectedTab === tab.id ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'">
                                {{ tab.label }}
                                <span v-if="tab.badge" class="ms-1 px-1.5 py-0.5 text-[10px] rounded-full bg-red-500 text-white">{{ tab.badge }}</span>
                            </button>
                        </Tab>
                    </TabList>

                    <TabPanels class="mt-5 space-y-4">
                        <!-- Overview -->
                        <TabPanel v-if="selectedTab === 'overview'" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                <InfoPanel title="سرور" :rows="serverRows" />
                                <InfoPanel title="شبکه" :rows="networkRows" />
                                <InfoPanel title="اپلیکیشن" :rows="appMetricsRows" />
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="Load Average" subtitle="بار سیستم در بازه‌های زمانی">
                                    <AdminBarChart v-if="loadChart.labels.length" class="h-64" :raw-data="loadChart" />
                                    <p v-else class="text-sm text-gray-500 text-center py-16">Load average در این سیستم در دسترس نیست</p>
                                </AdminReportChartCard>
                                <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4">
                                    <h3 class="text-sm font-bold mb-4">وضعیت سرویس‌ها</h3>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div v-for="check in data.services?.checks || []" :key="check.name"
                                            class="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5"
                                            :class="check.ok ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'">
                                            <span class="text-sm font-medium">{{ check.label }}</span>
                                            <span class="text-lg">{{ check.ok ? '✓' : '✗' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Performance -->
                        <TabPanel v-if="selectedTab === 'performance'" class="space-y-4">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <AdminReportStatCard v-for="bench in benchmarkCards" :key="bench.title"
                                    :title="bench.title" :value="bench.value" :subtitle="bench.subtitle"
                                    :accent="bench.accent" value-dir="ltr" />
                            </div>
                            <AdminReportChartCard title="روند Latency" subtitle="کش و دیتابیس در زمان">
                                <ComparisonLineChart v-if="latencyChart.labels.length > 1" class="h-72"
                                    :labels="latencyChart.labels" :datasets="latencyChart.datasets" />
                            </AdminReportChartCard>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoPanel title="OPcache" :rows="opcacheRows" />
                                <InfoPanel title="Redis" :rows="redisRows" />
                            </div>
                        </TabPanel>

                        <!-- Database -->
                        <TabPanel v-if="selectedTab === 'database'" class="space-y-4">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <AdminReportStatCard title="حجم DB" :value="data.database?.size_human || '—'"
                                    :subtitle="formatNumber(data.database?.tables_count) + ' جدول'" accent="cyan" />
                                <AdminReportStatCard title="اتصالات" :value="formatNumber(data.database?.connections)"
                                    subtitle="Threads connected" accent="blue" value-dir="ltr" />
                                <AdminReportStatCard title="Slow Queries" :value="formatNumber(data.database?.mysql_status?.Slow_queries)"
                                    subtitle="از بدو راه‌اندازی MySQL" accent="amber" value-dir="ltr" />
                                <AdminReportStatCard title="Uptime DB" :value="data.database?.uptime_human || '—'"
                                    subtitle="MySQL uptime" accent="emerald" />
                            </div>
                            <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 overflow-x-auto">
                                <table class="min-w-full text-sm">
                                    <thead class="bg-gray-50 dark:bg-gray-800/60">
                                        <tr>
                                            <th class="px-4 py-3 text-right font-semibold">جدول</th>
                                            <th class="px-4 py-3 text-right font-semibold">حجم</th>
                                            <th class="px-4 py-3 text-right font-semibold">رکورد</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="table in data.database?.top_tables || []" :key="table.name"
                                            class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40">
                                            <td class="px-4 py-3 font-mono text-xs" dir="ltr">{{ table.name }}</td>
                                            <td class="px-4 py-3" dir="ltr">{{ table.size_human }}</td>
                                            <td class="px-4 py-3">{{ formatNumber(table.row_count) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        <!-- Storage -->
                        <TabPanel v-if="selectedTab === 'storage'" class="space-y-4">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="توزیع فضا" subtitle="پوشه‌های پروژه">
                                    <DoughnutChart v-if="storageChart.labels.length" class="h-72"
                                        :rawData="storageChart" legend-position="bottom" :show-title="false" />
                                </AdminReportChartCard>
                                <div class="space-y-4">
                                    <div v-for="(disk, key) in data.disk?.paths || {}" :key="key"
                                        class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4">
                                        <div class="flex justify-between text-sm mb-2">
                                            <span class="font-bold">{{ diskLabel(key) }}</span>
                                            <span dir="ltr" :class="statusTextClass(disk.status)">{{ formatPercent(disk.usage_percent) }}</span>
                                        </div>
                                        <div class="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                            <div class="h-full rounded-full transition-all duration-500" :class="usageBarClass(disk.status)"
                                                :style="{ width: (disk.usage_percent || 0) + '%' }"></div>
                                        </div>
                                        <p class="mt-2 text-xs text-gray-500" dir="ltr">{{ disk.used_human }} / {{ disk.total_human }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 overflow-x-auto">
                                <table class="min-w-full text-sm">
                                    <thead class="bg-gray-50 dark:bg-gray-800/60">
                                        <tr>
                                            <th class="px-4 py-3 text-right font-semibold">پوشه</th>
                                            <th class="px-4 py-3 text-right font-semibold">حجم</th>
                                            <th class="px-4 py-3 text-right font-semibold">سهم</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in data.storage?.items || []" :key="item.label"
                                            class="border-t border-gray-100 dark:border-gray-800">
                                            <td class="px-4 py-3 font-medium">{{ item.label }}</td>
                                            <td class="px-4 py-3" dir="ltr">{{ item.human }}</td>
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-2">
                                                    <div class="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 max-w-[6rem]">
                                                        <div class="h-full rounded-full bg-blue-500" :style="{ width: item.percent + '%' }"></div>
                                                    </div>
                                                    <span>{{ formatPercent(item.percent) }}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        <!-- Security -->
                        <TabPanel v-if="selectedTab === 'security'" class="space-y-4">
                            <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-5">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-sm font-bold">ممیزی امنیتی</h3>
                                    <span class="text-2xl font-black" :class="securityScoreClass" dir="ltr">
                                        {{ formatPercent(data.security?.score) }}
                                    </span>
                                </div>
                                <div class="space-y-2">
                                    <div v-for="item in data.security?.items || []" :key="item.key"
                                        class="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
                                        :class="item.ok ? 'bg-emerald-50/80 dark:bg-emerald-900/15' : 'bg-amber-50/80 dark:bg-amber-900/15'">
                                        <span class="text-sm font-medium">{{ item.label }}</span>
                                        <span class="text-sm font-bold" :class="item.ok ? 'text-emerald-600' : 'text-amber-600'">
                                            {{ item.ok ? '✓ ایمن' : '⚠ نیاز به بررسی' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <InfoPanel title="پیکربندی حساس" :rows="securityConfigRows" />
                        </TabPanel>

                        <!-- Logs & Queue -->
                        <TabPanel v-if="selectedTab === 'logs'" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <AdminReportStatCard title="حجم laravel.log"
                                    :value="data.logs?.laravel?.size_human || '—'"
                                    :subtitle="formatNumber(data.logs?.laravel?.error_lines_recent) + ' خطای اخیر'"
                                    accent="rose" />
                                <AdminReportStatCard title="Jobs در انتظار"
                                    :value="formatNumber(data.queue?.pending_jobs)"
                                    subtitle="صف پردازش" accent="blue" />
                                <AdminReportStatCard title="Jobs ناموفق"
                                    :value="formatNumber(data.queue?.failed_jobs)"
                                    subtitle="نیاز به بررسی" accent="amber" />
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4">
                                    <h3 class="text-sm font-bold mb-3">بزرگ‌ترین فایل‌های لاگ</h3>
                                    <div class="space-y-2">
                                        <div v-for="log in data.storage?.largest_log_files || []" :key="log.name"
                                            class="flex justify-between text-sm rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800/50">
                                            <span class="font-mono text-xs" dir="ltr">{{ log.name }}</span>
                                            <span dir="ltr" class="font-semibold">{{ log.size_human }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4">
                                    <h3 class="text-sm font-bold mb-3">آخرین Jobهای ناموفق</h3>
                                    <div v-if="data.queue?.recent_failed?.length" class="space-y-2">
                                        <div v-for="job in data.queue.recent_failed" :key="job.id"
                                            class="text-sm rounded-lg px-3 py-2 bg-red-50 dark:bg-red-900/20">
                                            <span class="font-mono text-xs" dir="ltr">#{{ job.id }}</span>
                                            <span class="mx-2 text-gray-400">•</span>
                                            <span dir="ltr">{{ job.queue }}</span>
                                        </div>
                                    </div>
                                    <p v-else class="text-sm text-gray-500 text-center py-8">job ناموفقی وجود ندارد ✓</p>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Runtime -->
                        <TabPanel v-if="selectedTab === 'runtime'" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoPanel title="PHP Runtime" :rows="phpRows" />
                                <InfoPanel title="Laravel Stack" :rows="laravelRows" />
                            </div>
                            <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4">
                                <h3 class="text-sm font-bold mb-3">افزونه‌های PHP ({{ formatNumber(data.php?.extensions_count) }})</h3>
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="ext in data.php?.extensions || []" :key="ext"
                                        class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gradient-to-l from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700"
                                        dir="ltr">{{ ext }}</span>
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </template>
        </div>
    </AdminMasterPage>
</template>

<script>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import SystemResourceGauge from "@/views/components/admin/system/SystemResourceGauge.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import axiosInstance from "@/store/axiosInstance";

const InfoPanel = {
    props: { title: String, rows: Array },
    template: `
        <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3">{{ title }}</h3>
            <dl class="space-y-2 text-sm">
                <div v-for="row in rows" :key="row.label" class="flex justify-between gap-3">
                    <dt class="text-gray-500 dark:text-gray-400 shrink-0">{{ row.label }}</dt>
                    <dd class="font-medium text-gray-900 dark:text-white text-left break-all" dir="ltr">{{ row.value }}</dd>
                </div>
            </dl>
        </div>
    `,
};

export default {
    components: {
        AdminMasterPage,
        AdminReportStatCard,
        AdminReportChartCard,
        SystemResourceGauge,
        DoughnutChart,
        ComparisonLineChart,
        AdminBarChart,
        InfoPanel,
        Tab, TabGroup, TabList, TabPanel, TabPanels,
    },
    data() {
        return {
            loading: false,
            hasLoaded: false,
            fetchError: "",
            refreshInterval: 30,
            refreshTimer: null,
            countdownTimer: null,
            countdown: 0,
            selectedTab: "overview",
            data: {},
            historyCharts: {},
            tabs: [
                { id: "overview", label: "نمای کلی" },
                { id: "performance", label: "عملکرد" },
                { id: "database", label: "دیتابیس" },
                { id: "storage", label: "ذخیره‌سازی" },
                { id: "security", label: "امنیت" },
                { id: "logs", label: "لاگ و صف", badge: null },
                { id: "runtime", label: "Runtime" },
            ],
        };
    },
    computed: {
        healthDisplay() {
            const score = this.data.health?.score;
            if (score == null) return "—";
            return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(score);
        },
        healthGradeClass() {
            const grade = this.data.health?.grade;
            const map = { A: "bg-emerald-500 text-white", B: "bg-blue-500 text-white", C: "bg-amber-500 text-black", D: "bg-orange-500 text-white", F: "bg-red-500 text-white" };
            return map[grade] || "bg-gray-500 text-white";
        },
        pulseClass() {
            const s = this.data.health?.status;
            return { healthy: "bg-emerald-400", warning: "bg-amber-400", critical: "bg-red-400" }[s] || "bg-gray-400";
        },
        securityScoreClass() {
            const s = this.data.security?.score ?? 0;
            if (s >= 80) return "text-emerald-600 dark:text-emerald-400";
            if (s >= 60) return "text-amber-600 dark:text-amber-400";
            return "text-red-600 dark:text-red-400";
        },
        heroStats() {
            return [
                { label: "CPU", value: this.formatPercent(this.data.cpu?.usage_percent) },
                { label: "RAM", value: this.formatPercent(this.data.memory?.system?.usage_percent) },
                { label: "Disk", value: this.formatPercent(this.data.disk?.primary?.usage_percent) },
                { label: "DB Ping", value: this.data.benchmarks?.database_read_ms != null ? this.data.benchmarks.database_read_ms + "ms" : "—" },
            ];
        },
        gauges() {
            const d = this.data;
            return [
                { key: "cpu", value: d.cpu?.usage_percent, status: d.cpu?.status, label: "CPU", subtitle: d.cpu?.cores ? `${this.formatNumber(d.cpu.cores)} هسته` : "", unit: "%" },
                { key: "ram", value: d.memory?.system?.usage_percent, status: d.memory?.system?.status, label: "RAM", subtitle: d.memory?.system?.used_human, unit: "%" },
                { key: "disk", value: d.disk?.primary?.usage_percent, status: d.disk?.primary?.status, label: "Disk", subtitle: d.disk?.primary?.free_human ? `${d.disk.primary.free_human} آزاد` : "", unit: "%" },
                { key: "php", value: d.memory?.php?.usage_percent, status: d.memory?.php?.status, label: "PHP Mem", subtitle: `${d.memory?.php?.current_mb ?? "—"} MB`, unit: "%" },
                { key: "opcache", value: d.php?.opcache?.memory_usage_percent, status: this.usageStatus(d.php?.opcache?.memory_usage_percent), label: "OPcache", subtitle: d.php?.opcache?.enabled ? `${d.php.opcache.hit_rate ?? "—"}% hit` : "غیرفعال", unit: "%" },
                { key: "health", value: d.health?.score, status: d.health?.status, label: "سلامت", subtitle: d.health?.grade, unit: "", displayText: this.healthDisplay },
            ];
        },
        benchmarkChart() {
            const c = this.data.benchmarks?.chart;
            if (!c?.labels?.length) return { labels: [], data: [] };
            return { labels: c.labels, data: c.values, colors: c.colors };
        },
        dbTablesChart() {
            const c = this.data.database?.chart;
            if (!c?.labels?.length) return { labels: [], data: [] };
            return { labels: c.labels, data: c.values };
        },
        storageChart() {
            const c = this.data.storage?.chart;
            if (!c?.labels?.length) return { labels: [], data: [], colors: [] };
            return { labels: c.labels, data: c.values, colors: c.colors };
        },
        loadChart() {
            const c = this.data.cpu?.chart;
            if (!c?.labels?.length) return { labels: [], data: [] };
            return { labels: c.labels, data: c.values, colors: ["#3b82f6", "#6366f1", "#8b5cf6"] };
        },
        healthTrendChart() {
            const h = this.historyCharts;
            return {
                labels: (h.labels || []).map((t) => this.formatTimeShort(t)),
                datasets: [
                    { label: "امتیاز سلامت", data: h.health_score || [], lineColor: "#10b981", fillColor: "rgba(16,185,129,0.12)" },
                    { label: "CPU %", data: h.cpu_usage_percent || [], lineColor: "#3b82f6", fillColor: "rgba(59,130,246,0.08)", fill: false },
                    { label: "RAM %", data: h.memory_usage_percent || [], lineColor: "#8b5cf6", fillColor: "rgba(139,92,246,0.08)", fill: false },
                ],
            };
        },
        latencyChart() {
            const h = this.historyCharts;
            return {
                labels: (h.labels || []).map((t) => this.formatTimeShort(t)),
                datasets: [
                    { label: "Cache ms", data: h.cache_latency_ms || [], lineColor: "#3b82f6", fillColor: "rgba(59,130,246,0.1)" },
                    { label: "DB ms", data: h.db_latency_ms || [], lineColor: "#06b6d4", fillColor: "rgba(6,182,212,0.1)" },
                ],
            };
        },
        benchmarkCards() {
            const b = this.data.benchmarks || {};
            return [
                { title: "DB Read", value: b.database_read_ms != null ? b.database_read_ms + " ms" : "—", subtitle: "SELECT ping", accent: "cyan" },
                { title: "Cache Read", value: b.cache_read_ms != null ? b.cache_read_ms + " ms" : "—", subtitle: "Cache::get", accent: "blue" },
                { title: "Cache Write", value: b.cache_write_ms != null ? b.cache_write_ms + " ms" : "—", subtitle: "Cache::put", accent: "violet" },
                { title: "Disk Write", value: b.disk_write_ms != null ? b.disk_write_ms + " ms" : "—", subtitle: "4KB file", accent: "amber" },
            ];
        },
        serverRows() {
            const s = this.data.server || {};
            return [
                { label: "Hostname", value: s.hostname || "—" },
                { label: "OS", value: s.os || "—" },
                { label: "CPU Model", value: s.cpu_model || "—" },
                { label: "Architecture", value: s.architecture || "—" },
                { label: "Processes", value: s.processes != null ? this.formatNumber(s.processes) : "—" },
                { label: "Uptime", value: s.uptime_human || "—" },
                { label: "SAPI", value: s.sapi || "—" },
            ];
        },
        networkRows() {
            const n = this.data.network || {};
            return [
                { label: "Server IP", value: n.server_addr || "—" },
                { label: "Port", value: n.server_port || "—" },
                { label: "Resolved IPs", value: (n.ips || []).join(", ") || "—" },
            ];
        },
        appMetricsRows() {
            const m = this.data.metrics || {};
            return [
                { label: "Users", value: this.formatNumber(m.users) },
                { label: "Courses", value: this.formatNumber(m.courses) },
                { label: "Payments", value: this.formatNumber(m.payments) },
                { label: "Comments", value: this.formatNumber(m.comments) },
                { label: "Migrations", value: this.formatNumber(m.migrations) },
                { label: "Sessions", value: this.formatNumber(m.active_sessions) },
            ];
        },
        phpRows() {
            const p = this.data.php || {};
            return [
                { label: "Version", value: p.version },
                { label: "Zend", value: p.zend_version },
                { label: "memory_limit", value: this.data.memory?.php?.limit_human },
                { label: "upload_max", value: p.upload_max_filesize },
                { label: "post_max", value: p.post_max_size },
                { label: "max_execution", value: p.max_execution_time },
                { label: "ini", value: p.ini_path || "—" },
            ];
        },
        laravelRows() {
            const a = this.data.application || {};
            const o = a.optimizations || {};
            const c = a.composer || {};
            return [
                { label: "Laravel", value: a.laravel_version },
                { label: "Env", value: a.env },
                { label: "Debug", value: a.debug ? "ON" : "OFF" },
                { label: "Config cached", value: o.config_cached ? "✓" : "✗" },
                { label: "Routes cached", value: o.routes_cached ? "✓" : "✗" },
                { label: "Packages", value: c.packages != null ? this.formatNumber(c.packages) : "—" },
                { label: "Maintenance", value: a.maintenance_mode ? "ON" : "OFF" },
            ];
        },
        opcacheRows() {
            const o = this.data.php?.opcache || {};
            return [
                { label: "Enabled", value: o.enabled ? "بله" : "خیر" },
                { label: "Hit Rate", value: o.hit_rate != null ? o.hit_rate + "%" : "—" },
                { label: "Scripts", value: this.formatNumber(o.cached_scripts) },
                { label: "Memory", value: o.memory_used_human || "—" },
            ];
        },
        redisRows() {
            const r = this.data.redis || {};
            if (!r.available) return [{ label: "Status", value: "غیرفعال / در دسترس نیست" }];
            return [
                { label: "Status", value: this.statusLabel(r.status) },
                { label: "Latency", value: r.latency_ms != null ? r.latency_ms + " ms" : "—" },
                { label: "Version", value: r.version || "—" },
                { label: "Memory", value: r.used_memory_human || "—" },
                { label: "Clients", value: this.formatNumber(r.connected_clients) },
            ];
        },
        securityConfigRows() {
            const a = this.data.application || {};
            return [
                { label: "APP_URL", value: a.url || "—" },
                { label: "APP_ENV", value: a.env },
                { label: "APP_DEBUG", value: a.debug ? "true" : "false" },
                { label: "Cache", value: a.cache_driver },
                { label: "Session", value: a.session_driver },
                { label: "Queue", value: a.queue_connection },
            ];
        },
    },
    watch: {
        refreshInterval() {
            this.setupAutoRefresh();
        },
        "data.alerts"(alerts) {
            const tab = this.tabs.find((t) => t.id === "logs");
            if (tab) tab.badge = (this.data.queue?.failed_jobs || 0) > 0 ? this.data.queue.failed_jobs : (alerts?.length || null);
        },
        "data.queue.failed_jobs"(count) {
            const tab = this.tabs.find((t) => t.id === "logs");
            if (tab && count > 0) tab.badge = count;
        },
    },
    mounted() {
        this.fetchResources();
        this.setupAutoRefresh();
    },
    beforeUnmount() {
        this.clearTimers();
    },
    methods: {
        async fetchResources() {
            try {
                this.loading = true;
                this.fetchError = "";
                const [resourcesRes, historyRes] = await Promise.all([
                    axiosInstance.get("admin/system/resources"),
                    axiosInstance.get("admin/system/resources/history"),
                ]);
                if (resourcesRes.data?.message === "Success") {
                    this.data = resourcesRes.data.data || {};
                    this.hasLoaded = true;
                }
                if (historyRes.data?.message === "Success") {
                    this.historyCharts = historyRes.data.charts || {};
                }
                this.resetCountdown();
            } catch (e) {
                console.error(e);
                this.fetchError = "خطا در اسکن منابع سیستم.";
            } finally {
                this.loading = false;
            }
        },
        refresh() {
            this.fetchResources();
        },
        setupAutoRefresh() {
            this.clearTimers();
            if (!this.refreshInterval) return;
            this.countdown = this.refreshInterval;
            this.countdownTimer = setInterval(() => {
                this.countdown = Math.max(0, this.countdown - 1);
            }, 1000);
            this.refreshTimer = setInterval(() => {
                if (!this.loading) this.fetchResources();
            }, this.refreshInterval * 1000);
        },
        resetCountdown() {
            if (this.refreshInterval > 0) this.countdown = this.refreshInterval;
        },
        clearTimers() {
            if (this.refreshTimer) clearInterval(this.refreshTimer);
            if (this.countdownTimer) clearInterval(this.countdownTimer);
        },
        formatNumber(n) {
            if (n === null || n === undefined) return "—";
            return new Intl.NumberFormat("fa-IR").format(n);
        },
        formatPercent(v) {
            if (v === null || v === undefined) return "—";
            return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(v) + "%";
        },
        formatDateTime(v) {
            if (!v) return "—";
            return new Date(v).toLocaleString("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit", year: "numeric", month: "2-digit", day: "2-digit" });
        },
        formatTimeShort(v) {
            if (!v) return "";
            return new Date(v).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        },
        statusLabel(s) {
            return { healthy: "سالم", warning: "هشدار", critical: "بحرانی", error: "خطا", connected: "متصل", unknown: "—" }[s] || s || "—";
        },
        usageStatus(p) {
            if (p == null) return "unknown";
            if (p >= 90) return "critical";
            if (p >= 75) return "warning";
            return "healthy";
        },
        alertBoxClass(level) {
            return {
                critical: "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200",
                warning: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
                info: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200",
            }[level] || "border-gray-200 bg-gray-50";
        },
        alertIcon(level) {
            return { critical: "🔴", warning: "🟡", info: "🔵" }[level] || "ℹ️";
        },
        usageBarClass(s) {
            return { healthy: "bg-emerald-500", warning: "bg-amber-500", critical: "bg-red-500", unknown: "bg-gray-400" }[s] || "bg-gray-400";
        },
        statusTextClass(s) {
            return { healthy: "text-emerald-600", warning: "text-amber-600", critical: "text-red-600" }[s] || "text-gray-500";
        },
        diskLabel(k) {
            return { application: "Application", storage: "Storage", public: "Public" }[k] || k;
        },
    },
};
</script>
