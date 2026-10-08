<script setup>
definePageMeta({
  name: "admin-missions-list",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button v-if="selectedTab === 'missions'" v-can="'missions.create'" @click.prevent="openCreateMissionModal" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    ایجاد ماموریت
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 3a1 1 0 0 0-1 1v7H4a1 1 0 1 0 0 2h7v7a1 1 0 1 0 2 0v-7h7a1 1 0 1 0 0-2h-7V4a1 1 0 0 0-1-1z" fill="currentColor"/></svg>
                </span>
            </button>
            <button v-if="selectedTab === 'categories'" v-can="'mission-categories.manage'" @click.prevent="openCreateCategoryModal" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">ایجاد دسته‌بندی</span>
            </button>
            <button @click.prevent="refreshAll" :disabled="loading" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    بروزرسانی
                    <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8 L8 8 C5.790861 8 4 9.790861 4 12 L4 13 C4 14.6568542 5.34314575 16 7 16 L7 18 C4.23857625 18 2 15.7614237 2 13 L2 12 C2 8.6862915 4.6862915 6 8 6 L12 6 L12 4.72799742 Z" fill="currentColor"/>
                    </svg>
                </span>
            </button>
        </template>

        <div class="min-w-0 space-y-4">
            <!-- Tab bar -->
            <div class="p-2 md:p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
                <div class="p-1.5 flex items-center gap-1 overflow-x-auto custom-scrollbar bg-gray-100/70 dark:bg-gray-800/70 rounded-xl">
                    <button v-for="tab in tabs" :key="tab.id" @click.prevent="switchTab(tab.id)"
                        class="shrink-0 flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                        :class="selectedTab === tab.id
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200'">
                        <span>{{ tab.label }}</span>
                        <span v-if="tab.badge" class="ms-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{{ tab.badge }}</span>
                    </button>
                </div>
            </div>

            <LoadingComponent v-if="loading && !hasLoaded" />

            <template v-else>
                <!-- ===== OVERVIEW ===== -->
                <div v-if="selectedTab === 'overview'" class="space-y-4">
                    <div v-if="overviewLoading && !stats" class="flex flex-col items-center justify-center py-16 text-center">
                        <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 animate-pulse">
                            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M12 8V12L15 15M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                        </div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">در حال بارگذاری آمار...</p>
                    </div>
                    <template v-else-if="stats">
                    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-3 shadow-sm">
                        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">داشبورد ماموریت‌ها</h2>
                        <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">کنترل ماموریت‌ها، امتیازات و مشارکت کاربران — {{ statsDays }} روز اخیر</p>
                    </div>

                    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-3 shadow-sm">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">بازه زمانی</span>
                            <span class="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
                            <button v-for="opt in statsDaysOptions" :key="opt.days" @click.prevent="setStatsDays(opt.days)"
                                class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                                :class="statsDays === opt.days
                                    ? 'bg-amber-400 text-gray-900 shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'">
                                {{ opt.title }}
                            </button>
                        </div>
                    </div>

                    <div v-if="stats.summary?.missing_daily_login" class="flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-200">
                        <svg class="w-4 h-4 shrink-0 mt-0.5 text-amber-500" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        <div>
                            <p class="font-semibold">ماموریت <code class="font-mono text-[11px] bg-amber-100/80 dark:bg-amber-900/50 px-1 rounded">daily-login</code> هنوز در دیتابیس نیست.</p>
                            <p class="mt-1 text-amber-800/80 dark:text-amber-200/70">سیدر به‌روز را اجرا کنید: <code class="font-mono">php artisan db:seed --class=MissionsSeeder</code></p>
                        </div>
                    </div>

                    <!-- Stat cards -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                        <AdminReportStatCard title="کل ماموریت‌ها" :value="formatNumber(stats.summary.total_missions)" :subtitle="formatNumber(stats.summary.active_missions) + ' فعال'" accent="amber">
                            <template #icon>
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </template>
                        </AdminReportStatCard>
                        <AdminReportStatCard title="شرکت‌کنندگان" :value="formatNumber(stats.summary.total_participants)" :subtitle="formatNumber(stats.summary.new_participants_period) + ' جدید'" accent="amber">
                            <template #icon>
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </template>
                        </AdminReportStatCard>
                        <AdminReportStatCard title="تکمیل‌شده" :value="formatNumber(stats.summary.total_completions)" :subtitle="formatNumber(stats.summary.completions_period) + ' در بازه'" accent="amber">
                            <template #icon>
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M9 12.5l2 2 4-4.5M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </template>
                        </AdminReportStatCard>
                        <AdminReportStatCard title="در حال انجام" :value="formatNumber(stats.summary.active_participants)" subtitle="ماموریت ناتمام" accent="amber">
                            <template #icon>
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 7v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </template>
                        </AdminReportStatCard>
                        <AdminReportStatCard title="نرخ تکمیل" :value="stats.summary.avg_completion_rate + '%'" subtitle="میانگین کل" accent="amber" value-dir="ltr">
                            <template #icon>
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M19 5 5 19M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </template>
                        </AdminReportStatCard>
                        <AdminReportStatCard title="امتیاز اعطاشده" :value="formatNumber(stats.summary.total_scores_awarded)" subtitle="کل سیستم" accent="amber" value-dir="ltr">
                            <template #icon>
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85L12 3.5Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </template>
                        </AdminReportStatCard>
                    </div>

                    <!-- Charts row 1 -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <AdminReportChartCard class="lg:col-span-2" title="روند فعالیت روزانه" :subtitle="'شرکت‌کنندگان و تکمیل‌ها — ' + statsDays + ' روز'">
                            <ComparisonLineChart v-if="stats.charts?.daily_activity?.labels?.length" class="h-72"
                                :labels="stats.charts.daily_activity.labels" :datasets="stats.charts.daily_activity.datasets" />
                        </AdminReportChartCard>
                        <AdminReportChartCard title="وضعیت مشارکت" subtitle="تکمیل‌شده در مقابل در حال انجام">
                            <DoughnutChart v-if="stats.charts?.status_distribution?.data?.length" class="h-72"
                                :rawData="stats.charts.status_distribution" legend-position="bottom" :show-title="false" />
                        </AdminReportChartCard>
                    </div>

                    <!-- Charts row 2 -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <AdminReportChartCard title="محبوب‌ترین ماموریت‌ها" subtitle="بر اساس تعداد شرکت‌کننده">
                            <AdminBarChart v-if="stats.charts?.top_by_participants?.labels?.length" class="h-72"
                                :raw-data="stats.charts.top_by_participants" :horizontal="true"
                                :colors="['#f59e0b','#fbbf24','#fcd34d','#fde68a','#fef3c7','#fffbeb','#d97706','#b45309','#92400e','#78350f']" />
                        </AdminReportChartCard>
                        <AdminReportChartCard title="بیشترین تکمیل" subtitle="ماموریت‌هایی با بیشترین تکمیل">
                            <AdminBarChart v-if="stats.charts?.top_by_completions?.labels?.length" class="h-72"
                                :raw-data="stats.charts.top_by_completions" :horizontal="true"
                                :colors="['#10b981','#34d399','#6ee7b7','#a7f3d0','#d1fae5','#ecfdf5','#059669','#047857','#065f46','#064e3b']" />
                        </AdminReportChartCard>
                    </div>

                    <!-- Charts row 3 -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <AdminReportChartCard title="مقایسه دسته‌بندی‌ها" subtitle="شرکت‌کنندگان و تکمیل‌ها">
                            <ComparisonBarChart v-if="stats.charts?.category_comparison?.labels?.length" class="h-72"
                                :labels="stats.charts.category_comparison.labels"
                                :datasets="categoryComparisonDatasets" />
                        </AdminReportChartCard>
                        <AdminReportChartCard title="توزیع دسته‌بندی" subtitle="تعداد ماموریت در هر دسته">
                            <DoughnutChart v-if="stats.charts?.category_distribution?.data?.length" class="h-72"
                                :rawData="stats.charts.category_distribution" legend-position="bottom" :show-title="false" />
                        </AdminReportChartCard>
                    </div>

                    <!-- Rankings -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <RankingPanel title="محبوب‌ترین" subtitle="بیشترین مشارکت" :items="stats.rankings?.most_popular" metric="participants_count" />
                        <RankingPanel title="بیشترین تکمیل" subtitle="بیشترین اتمام" :items="stats.rankings?.most_completed" metric="completed_count" />
                        <RankingPanel title="بالاترین نرخ" subtitle="درصد تکمیل" :items="stats.rankings?.highest_rate" metric="completion_rate" suffix="%" />
                    </div>

                    <!-- Recent completions -->
                    <AdminReportChartCard title="آخرین تکمیل‌ها" subtitle="فعالیت اخیر کاربران">
                        <div v-if="stats.recent_completions?.length" class="divide-y divide-gray-100 dark:divide-gray-800">
                            <div v-for="(item, i) in stats.recent_completions" :key="i"
                                class="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                                <MissionIcon :icon="item.mission?.icon" size-class="w-8 h-8" />
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs font-bold text-gray-900 dark:text-white truncate">{{ item.mission?.title }}</p>
                                    <p class="text-xs text-gray-500">@{{ item.user?.username }}</p>
                                </div>
                                <span class="text-xs text-gray-400 shrink-0">{{ formatRelativeDate(item.completed_at) }}</span>
                            </div>
                        </div>
                        <p v-else class="text-xs text-gray-400 text-center py-8">هنوز تکمیلی ثبت نشده</p>
                    </AdminReportChartCard>
                    </template>
                </div>

                <!-- ===== MISSIONS ===== -->
                <div v-if="selectedTab === 'missions'" class="space-y-4">
                    <div v-if="missionsLoading && !missions.length" class="flex flex-col items-center justify-center py-16 text-center">
                        <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 animate-pulse">
                            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M12 8V12L15 15M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                        </div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">در حال بارگذاری ماموریت‌ها...</p>
                    </div>
                    <template v-else>
                    <div class="gap-y-2 flex flex-col lg:flex-row lg:items-end lg:justify-between">
                        <div class="lg:max-w-xs w-full">
                            <div class="relative w-full">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input v-model="searchKey" @input="debouncedFetchMissions" type="text"
                                    class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="جستجو عنوان یا شناسه..." />
                            </div>
                        </div>
                        <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                            <div class="w-max">
                                <div class="text-xs font-light text-gray-400 px-1 mb-1">دسته‌بندی:</div>
                                <select v-model="filterCategory" @change="applyMissionFilters"
                                    class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                                    <option v-for="opt in categoryFilterOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                </select>
                            </div>
                            <div class="w-max">
                                <div class="text-xs font-light text-gray-400 px-1 mb-1">Listener:</div>
                                <select v-model="filterListener" @change="applyMissionFilters"
                                    class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                                    <option v-for="opt in listenerFilterOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                </select>
                            </div>
                            <div class="w-max">
                                <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت:</div>
                                <select v-model="filterActive" @change="applyMissionFilters"
                                    class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                                    <option v-for="opt in activeFilterOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                </select>
                            </div>
                            <div class="w-max">
                                <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                                <select v-model="filterSort" @change="applyMissionFilters"
                                    class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                                    <option v-for="opt in sortFilterOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                </select>
                            </div>
                            <div class="w-max">
                                <div class="text-xs font-light text-gray-400 px-1 mb-1">نمایش:</div>
                                <select v-model="missionDataView"
                                    class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                                    <option v-for="opt in dataViewOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                </select>
                            </div>
                            <div class="inline-flex">
                                <button @click.prevent="clearMissionFilters" title="پاک کردن فیلترها"
                                    class="flex items-center justify-center h-8 w-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg">
                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.8809 10C14.2609 10 12.1309 12.13 12.1309 14.75C12.1309 15.64 12.3809 16.48 12.8209 17.2C13.6409 18.58 15.1509 19.5 16.8809 19.5C18.6109 19.5 20.1209 18.57 20.9409 17.2C21.3809 16.49 21.6309 15.64 21.6309 14.75C21.6309 12.13 19.5109 10 16.8809 10ZM18.6809 16.52C18.5309 16.67 18.3409 16.74 18.1509 16.74C17.9609 16.74 17.7709 16.67 17.6209 16.52L16.9009 15.8L16.1509 16.55C16.0009 16.7 15.8109 16.77 15.6209 16.77C15.4309 16.77 15.2409 16.7 15.0909 16.55C14.8009 16.26 14.8009 15.78 15.0909 15.49L15.8409 14.74L15.1209 14.01C14.8309 13.72 14.8309 13.24 15.1209 12.95C15.4109 12.66 15.8909 12.66 16.1809 12.95L16.9009 13.67L17.6009 12.97C17.8909 12.68 18.3709 12.68 18.6609 12.97C18.9509 13.26 18.9509 13.74 18.6609 14.03L17.9609 14.73L18.6809 15.46C18.9809 15.75 18.9809 16.23 18.6809 16.52Z" fill="currentColor"></path>
                                    <path d="M20.5799 4.02V6.24C20.5799 7.05 20.0799 8.06 19.5799 8.57L19.3999 8.73C19.2599 8.86 19.0499 8.89 18.8699 8.83C18.6699 8.76 18.4699 8.71 18.2699 8.66C17.8299 8.55 17.3599 8.5 16.8799 8.5C13.4299 8.5 10.6299 11.3 10.6299 14.75C10.6299 15.89 10.9399 17.01 11.5299 17.97C12.0299 18.81 12.7299 19.51 13.4899 19.98C13.7199 20.13 13.8099 20.45 13.6099 20.63C13.5399 20.69 13.4699 20.74 13.3999 20.79L11.9999 21.7C10.6999 22.51 8.90992 21.6 8.90992 19.98V14.63C8.90992 13.92 8.50992 13.01 8.10992 12.51L4.31992 8.47C3.81992 7.96 3.41992 7.05 3.41992 6.45V4.12C3.41992 2.91 4.31992 2 5.40992 2H18.5899C19.6799 2 20.5799 2.91 20.5799 4.02Z" fill="currentColor"></path>
                                </svg>
                            </button>
                            </div>
                        </div>
                    </div>

                    <!-- TABLE VIEW -->
                    <div v-if="missionDataView === 'list' && missions.length" class="overflow-x-auto md:custom-scrollbar">
                        <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                <tr class="text-xs font-semibold text-start">
                                    <th class="px-3 py-3 whitespace-nowrap text-start">ماموریت</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">دسته‌بندی</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center">سطوح / امتیاز</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center">شرکت‌کننده</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center">تکمیل</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center">نرخ</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center">Listener</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center">فعال</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center w-12">عملیات</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                <tr v-for="mission in missions" :key="mission.id" class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-amber-50/40 dark:hover:bg-gray-800/60 transition-colors" :class="{ 'opacity-60': !mission.is_active }">
                                    <td class="px-3 py-3 text-start">
                                        <div class="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity" @click="openMissionDetail(mission)">
                                            <MissionIcon :icon="mission.icon" size-class="w-9 h-9" />
                                            <div class="min-w-0 max-w-[14rem]">
                                                <div class="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{{ mission.title }}</div>
                                                <div class="text-xs text-gray-500 font-mono line-clamp-1" dir="ltr">{{ mission.id }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-2 py-3 text-start">
                                        <span class="whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ mission.category?.title }}</span>
                                    </td>
                                    <td class="px-2 py-3 text-center whitespace-nowrap">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ mission.levels_count }} سطح</span>
                                        <span class="mt-1 block text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ formatNumber(mission.total_exp) }} امتیاز</span>
                                    </td>
                                    <td class="px-2 py-3 text-center">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ formatNumber(mission.participants_count) }}</span>
                                    </td>
                                    <td class="px-2 py-3 text-center">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ formatNumber(mission.completed_count) }}</span>
                                    </td>
                                    <td class="px-2 py-3 text-center">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ mission.completion_rate }}%</span>
                                    </td>
                                    <td class="px-2 py-3 text-center">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ mission.is_wired ? 'متصل' : 'ندارد' }}</span>
                                    </td>
                                    <td class="px-2 py-3 text-center">
                                        <button v-can="'missions.update'" @click.prevent="toggleMissionActive(mission)"
                                            class="relative inline-block w-9 h-5 rounded-full transition-colors duration-200 align-middle"
                                            :class="mission.is_active ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'">
                                            <span class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200" :class="mission.is_active ? 'start-0.5' : 'start-[calc(100%-1.125rem)]'"></span>
                                        </button>
                                    </td>
                                    <td class="px-2 py-3 text-center">
                                        <Popover class="group relative flex items-center justify-center">
                                            <PopoverButton class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 focus:outline-none">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg>
                                            </PopoverButton>
                                            <PopoverPanel class="absolute top-full end-0 z-30 mt-2 flex w-max min-w-[9rem] flex-col rounded-lg bg-white p-2 text-start shadow-lg dark:bg-gray-900">
                                                <button @click.prevent="openMissionDetail(mission)" class="block w-full text-start px-3 py-2 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">جزئیات و شرکت‌کنندگان</button>
                                                <button v-can="'missions.update'" @click.prevent="openEditMissionModal(mission)" class="block w-full text-start px-3 py-2 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">ویرایش</button>
                                                <button v-can="'missions.delete'" @click.prevent="openDeleteMissionModal(mission)" class="block w-full text-start px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">حذف</button>
                                            </PopoverPanel>
                                        </Popover>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- GRID VIEW -->
                    <div v-else-if="missionDataView === 'grid' && missions.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        <div v-for="mission in missions" :key="mission.id"
                            class="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden shadow-sm hover:shadow-md transition-all"
                            :class="{ 'opacity-60': !mission.is_active }">
                            <div class="p-4">
                                <div class="flex items-start justify-between gap-2">
                                    <div class="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition-opacity" @click="openMissionDetail(mission)">
                                        <MissionIcon :icon="mission.icon" size-class="w-10 h-10" />
                                        <div class="min-w-0">
                                            <h4 class="text-xs font-bold text-gray-900 dark:text-white truncate">{{ mission.title }}</h4>
                                            <p class="text-xs text-gray-500 font-mono truncate" dir="ltr">{{ mission.id }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1 shrink-0">
                                        <button v-can="'missions.update'" @click.prevent="toggleMissionActive(mission)"
                                            class="relative w-9 h-5 rounded-full transition-colors duration-200"
                                            :class="mission.is_active ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'"
                                            :title="mission.is_active ? 'غیرفعال کردن' : 'فعال کردن'">
                                            <span class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                                                :class="mission.is_active ? 'start-0.5' : 'start-[calc(100%-1.125rem)]'"></span>
                                        </button>
                                        <Popover class="relative">
                                            <PopoverButton class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg>
                                            </PopoverButton>
                                            <PopoverPanel class="absolute top-full end-0 z-30 mt-2 p-1.5 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200/80 dark:border-gray-700/80 min-w-[9rem]">
                                                <button @click.prevent="openMissionDetail(mission)" class="block w-full text-start px-3 py-2 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">جزئیات و شرکت‌کنندگان</button>
                                                <button v-can="'missions.update'" @click.prevent="openEditMissionModal(mission)" class="block w-full text-start px-3 py-2 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">ویرایش</button>
                                                <button v-can="'missions.delete'" @click.prevent="openDeleteMissionModal(mission)" class="block w-full text-start px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">حذف</button>
                                            </PopoverPanel>
                                        </Popover>
                                    </div>
                                </div>

                                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ mission.description }}</p>

                                <div class="mt-3 flex flex-wrap gap-1.5">
                                    <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ mission.category?.title }}</span>
                                    <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ mission.is_wired ? 'Listener متصل' : 'بدون Listener' }}</span>
                                    <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ mission.levels_count }} سطح · {{ formatNumber(mission.total_exp) }} امتیاز</span>
                                    <span v-if="!mission.is_active" class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">غیرفعال</span>
                                </div>

                                <div class="mt-3 grid grid-cols-3 gap-2">
                                    <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatNumber(mission.participants_count) }}</p>
                                        <p class="text-xs text-gray-400">شرکت‌کننده</p>
                                    </div>
                                    <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatNumber(mission.completed_count) }}</p>
                                        <p class="text-xs text-gray-400">تکمیل</p>
                                    </div>
                                    <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <p class="text-xs font-medium text-gray-900 dark:text-white">{{ mission.completion_rate }}%</p>
                                        <p class="text-xs text-gray-400">نرخ</p>
                                    </div>
                                </div>

                                <div class="mt-3 space-y-1">
                                    <div v-for="(level, lvl) in Object.entries(mission.levels || {}).slice(0, 3)" :key="lvl"
                                        class="flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-300">
                                        <span>سطح {{ level[0] }}</span>
                                        <span class="font-medium">هدف: {{ level[1].goal }} · امتیاز: {{ level[1].exp }}</span>
                                    </div>
                                    <p v-if="mission.levels_count > 3" class="text-xs text-gray-400 text-center">+ {{ mission.levels_count - 3 }} سطح دیگر</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-center py-20 text-sm text-gray-400">ماموریتی یافت نشد</p>
                    <div v-if="pagination && pagination.last_page > 1" class="pt-2">
                        <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="onPageChanged" />
                    </div>
                    </template>
                </div>

                <!-- ===== PARTICIPANTS ===== -->
                <div v-if="selectedTab === 'participants'" class="space-y-4">
                    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-3 shadow-sm">
                        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">شرکت‌کنندگان ماموریت‌ها</h2>
                        <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">نمای کلی همه کاربران، یا فیلتر روی یک ماموریت</p>
                    </div>

                    <div class="flex flex-wrap items-end gap-2">
                        <div class="w-full sm:w-44">
                            <div class="text-xs font-light text-gray-400 px-1 mb-1">ماموریت:</div>
                            <select v-model="participantMissionId" @change="onParticipantFiltersChanged"
                                class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                                <option v-for="opt in participantMissionOptions" :key="String(opt.value)" :value="opt.value">{{ opt.label }}</option>
                            </select>
                        </div>
                        <div class="w-max">
                            <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت:</div>
                            <select v-model="participantStatus" @change="onParticipantFiltersChanged"
                                class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                                <option v-for="opt in participantStatusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                            </select>
                        </div>
                        <div class="flex-1 min-w-[10rem] max-w-xs">
                            <div class="text-xs font-light text-gray-400 px-1 mb-1">جستجو کاربر:</div>
                            <input v-model="participantSearch" @input="debouncedFetchParticipants" type="text"
                                class="w-full h-8 px-2.5 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none"
                                placeholder="نام یا نام کاربری..." />
                        </div>
                    </div>

                    <div v-if="participantsLoading" class="flex flex-col items-center justify-center py-16 text-center">
                        <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 animate-pulse">
                            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M12 8V12L15 15M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                        </div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">در حال بارگذاری شرکت‌کنندگان...</p>
                    </div>

                    <template v-else>
                        <div v-if="participantSummary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <AdminReportStatCard title="کل رکوردها" :value="formatNumber(participantSummary.total)" accent="amber" />
                            <AdminReportStatCard title="کاربران یکتا" :value="formatNumber(participantSummary.unique_users ?? participantSummary.total)" accent="amber" />
                            <AdminReportStatCard title="تکمیل‌شده" :value="formatNumber(participantSummary.completed)" accent="amber" />
                            <AdminReportStatCard title="در حال انجام" :value="formatNumber(participantSummary.in_progress)" accent="amber" />
                        </div>

                        <div v-if="participants.length" class="overflow-x-auto md:custom-scrollbar">
                            <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                    <tr class="text-xs font-semibold text-start">
                                        <th class="px-3 py-3 whitespace-nowrap text-start">کاربر</th>
                                        <th class="px-2 py-3 whitespace-nowrap text-start">ماموریت</th>
                                        <th class="px-2 py-3 whitespace-nowrap text-center">سطح</th>
                                        <th class="px-2 py-3 whitespace-nowrap text-center">پیشرفت</th>
                                        <th class="px-2 py-3 whitespace-nowrap text-center">وضعیت</th>
                                        <th class="px-2 py-3 whitespace-nowrap text-end">آخرین فعالیت</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <tr v-for="p in participants" :key="(p.id || p.user_id) + '-' + (p.mission_id || '')" class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-amber-50/40 dark:hover:bg-gray-800/60 transition-colors">
                                        <td class="px-3 py-3">
                                            <div class="flex items-center gap-2">
                                                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                                                    <img v-if="p.profile_pic" :src="p.profile_pic" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                                    <div v-else class="w-full h-full flex items-center justify-center text-xs font-medium text-gray-500">{{ (p.name || p.username || '?')[0] }}</div>
                                                </div>
                                                <div class="min-w-0">
                                                    <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ p.name || p.username }}</p>
                                                    <p class="text-xs text-gray-500">@{{ p.username }}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-2 py-3 text-start">
                                            <div class="flex items-center gap-2 min-w-0">
                                                <MissionIcon :icon="p.mission?.icon" size-class="w-7 h-7" />
                                                <div class="min-w-0">
                                                    <p class="text-xs font-medium text-gray-800 dark:text-gray-100 truncate max-w-[12rem]">{{ p.mission?.title || '—' }}</p>
                                                    <p class="text-[10px] text-gray-400 font-mono truncate" dir="ltr">{{ p.mission_id || p.mission?.id }}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-2 py-3 text-center">
                                            <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ p.current_level }}</span>
                                        </td>
                                        <td class="px-2 py-3">
                                            <div class="flex items-center gap-2 min-w-[7rem]">
                                                <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div class="h-full bg-amber-400 rounded-full transition-all" :style="{ width: p.progress_percent + '%' }"></div>
                                                </div>
                                                <span class="text-xs font-medium text-gray-600 dark:text-gray-300 w-8 text-end">{{ p.progress_percent }}%</span>
                                            </div>
                                        </td>
                                        <td class="px-2 py-3 text-center">
                                            <span class="text-xs font-medium px-2 py-1 rounded-lg"
                                                :class="p.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100/70 dark:bg-gray-800/50 text-gray-800 dark:text-gray-100'">
                                                {{ p.status === 'completed' ? 'تکمیل' : 'در حال انجام' }}
                                            </span>
                                        </td>
                                        <td class="px-2 py-3 text-end text-xs text-gray-500">{{ formatRelativeDate(p.updated_at) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p v-else class="text-center py-16 text-sm text-gray-400">شرکت‌کننده‌ای یافت نشد</p>

                        <div v-if="participantPagination && participantPagination.last_page > 1" class="pt-2">
                            <PaginationComponent dir="ltr" :pagination="participantPagination" @updatePage="onParticipantPageChanged" />
                        </div>
                    </template>
                </div>

                <!-- ===== CATEGORIES ===== -->
                <div v-if="selectedTab === 'categories'" class="space-y-3">
                    <div v-if="categoriesLoading && !categories.length" class="flex flex-col items-center justify-center py-16 text-center">
                        <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 animate-pulse">
                            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M12 8V12L15 15M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                        </div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">در حال بارگذاری دسته‌بندی‌ها...</p>
                    </div>
                    <template v-else>
                        <div v-if="categories.length" class="overflow-x-auto md:custom-scrollbar">
                        <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                <tr class="text-xs font-semibold text-start">
                                    <th class="px-3 py-3 whitespace-nowrap text-start">عنوان</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">عنوان انگلیسی</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">slug</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center">ماموریت‌ها</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center">فعال</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center w-12">عملیات</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                <tr v-for="cat in categories" :key="cat.id" class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-amber-50/40 dark:hover:bg-gray-800/60 transition-colors">
                                    <td class="px-3 py-3 text-start">
                                        <span class="text-xs font-semibold text-gray-900 dark:text-white">{{ cat.title }}</span>
                                    </td>
                                    <td class="px-2 py-3 text-start">
                                        <span class="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{{ cat.english_title }}</span>
                                    </td>
                                    <td class="px-2 py-3 text-start">
                                        <span class="text-xs font-mono text-gray-500" dir="ltr">{{ cat.slug }}</span>
                                    </td>
                                    <td class="px-2 py-3 text-center">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ cat.missions_count }}</span>
                                    </td>
                                    <td class="px-2 py-3 text-center">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ cat.active_missions_count ?? cat.missions_count }}</span>
                                    </td>
                                    <td class="px-2 py-3 text-center">
                                        <Popover class="group relative flex items-center justify-center">
                                            <PopoverButton class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 focus:outline-none">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg>
                                            </PopoverButton>
                                            <PopoverPanel class="absolute top-full end-0 z-30 mt-2 flex w-max min-w-[8rem] flex-col rounded-lg bg-white p-2 text-start shadow-lg dark:bg-gray-900">
                                                <button v-can="'mission-categories.manage'" @click.prevent="openEditCategoryModal(cat)" class="block w-full text-start px-3 py-2 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">ویرایش</button>
                                                <button v-can="'mission-categories.manage'" @click.prevent="openDeleteCategoryModal(cat)" class="block w-full text-start px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg">حذف</button>
                                            </PopoverPanel>
                                        </Popover>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        <p v-else class="text-center py-16 text-sm text-gray-400">دسته‌بندی‌ای یافت نشد</p>
                    </template>
                </div>

                <!-- ===== SCORES ===== -->
                <div v-if="selectedTab === 'scores'" class="space-y-4">
                    <div v-if="overviewLoading && !stats" class="flex flex-col items-center justify-center py-16 text-center">
                        <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 animate-pulse">
                            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M12 8V12L15 15M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                        </div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">در حال بارگذاری امتیازات...</p>
                    </div>
                    <template v-else-if="stats">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AdminReportStatCard title="کل امتیازات اعطاشده" :value="formatNumber(stats.summary?.total_scores_awarded)" subtitle="در کل سیستم" accent="amber" value-dir="ltr" />
                        <AdminReportStatCard title="رکوردهای امتیاز" :value="formatNumber(stats.summary?.total_score_records)" subtitle="تعداد تراکنش‌ها" accent="amber" value-dir="ltr" />
                    </div>

                    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                        <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40">
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">تنظیمات تبدیل امتیاز</h3>
                                <p class="text-[11px] text-gray-500 mt-0.5">قابل ویرایش توسط ادمین — در دیتابیس ذخیره می‌شود</p>
                            </div>
                            <button v-can="'missions.update'" type="button" @click="saveScoreSettings" :disabled="scoreSettingsSaving"
                                class="h-8 px-3 text-xs font-semibold rounded-lg bg-amber-400 text-gray-900 hover:bg-amber-500 disabled:opacity-50 transition-colors">
                                {{ scoreSettingsSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}
                            </button>
                        </div>
                        <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">نرخ تبدیل (هر ۱ امتیاز = چند تومان)</label>
                                <input v-model.number="scoreSettingsForm.conversion_rate" type="number" min="0" step="0.01" dir="ltr" :class="fieldClass" />
                            </div>
                            <div>
                                <label class="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">حداقل امتیاز برای تبدیل</label>
                                <input v-model.number="scoreSettingsForm.min_scores" type="number" min="0" step="100" dir="ltr" :class="fieldClass" />
                            </div>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-gray-50/80 dark:bg-gray-800/40 px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                        امتیاز هر ماموریت (ثبت‌نام، ورود روزانه، لایک و…) در فیلد سطوح همان ماموریت است و از بخش «ماموریت‌ها» هنگام ایجاد/ویرایش تنظیم می‌شود.
                    </div>
                    </template>
                </div>
            </template>
        </div>

        <!-- Mission Detail Drawer -->
        <BottomSheetDrawer v-model="showDetailModal" :initialHeight="0.8" :maxHeight="0.95"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[36rem] lg:max-w-[36rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4'" :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div v-if="selectedMission" class="space-y-3">
                <div class="flex items-start justify-between gap-2 mb-1">
                    <div class="flex items-center gap-2 min-w-0">
                        <MissionIcon :icon="selectedMission.icon" size-class="w-9 h-9" />
                        <div class="min-w-0">
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ selectedMission.title }}</h3>
                            <p class="text-[10px] text-gray-400 font-mono" dir="ltr">{{ selectedMission.id }}</p>
                        </div>
                    </div>
                    <button type="button" @click="showDetailModal = false" class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{{ selectedMission.description }}</p>

                <div class="grid grid-cols-4 gap-1.5">
                    <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <p class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ formatNumber(detailParticipants.length || selectedMission.participants_count) }}</p>
                        <p class="text-[10px] text-gray-400 mt-0.5">شرکت‌کننده</p>
                    </div>
                    <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <p class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ formatNumber(selectedMission.completed_count) }}</p>
                        <p class="text-[10px] text-gray-400 mt-0.5">تکمیل</p>
                    </div>
                    <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <p class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ selectedMission.completion_rate }}%</p>
                        <p class="text-[10px] text-gray-400 mt-0.5">نرخ</p>
                    </div>
                    <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <p class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ formatNumber(selectedMission.total_exp) }}</p>
                        <p class="text-[10px] text-gray-400 mt-0.5">امتیاز کل</p>
                    </div>
                </div>

                <div>
                    <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">سطوح و امتیازات</h4>
                    <div class="rounded-lg border border-gray-200/80 dark:border-gray-700/80 overflow-hidden">
                        <table class="w-full text-xs text-gray-700 dark:text-gray-300">
                            <thead class="bg-gray-50 dark:bg-gray-800">
                                <tr class="text-[11px] font-semibold text-gray-500">
                                    <th class="px-2.5 py-2 text-start">سطح</th>
                                    <th class="px-2.5 py-2 text-center">هدف</th>
                                    <th class="px-2.5 py-2 text-center">امتیاز</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                                <tr v-for="(level, num) in selectedMission.levels" :key="num">
                                    <td class="px-2.5 py-1.5 text-xs font-medium">سطح {{ num }}</td>
                                    <td class="px-2.5 py-1.5 text-center">
                                        <span class="text-xs font-medium bg-gray-100/70 dark:bg-gray-800/50 px-1.5 py-0.5 rounded-md">{{ level.goal }}</span>
                                    </td>
                                    <td class="px-2.5 py-1.5 text-center">
                                        <span class="text-xs font-medium bg-gray-100/70 dark:bg-gray-800/50 px-1.5 py-0.5 rounded-md">{{ level.exp }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">شرکت‌کنندگان</h4>
                    <div v-if="detailParticipants.length" class="space-y-1.5 max-h-52 overflow-y-auto">
                        <div v-for="p in detailParticipants" :key="p.user_id"
                            class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div class="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                                <img v-if="p.profile_pic" :src="p.profile_pic" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{{ p.name || p.username }}</p>
                                <div class="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div class="h-full bg-amber-400 rounded-full" :style="{ width: p.progress_percent + '%' }"></div>
                                </div>
                            </div>
                            <span class="text-[10px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100/70 dark:bg-gray-800/50 px-1.5 py-0.5 rounded-md shrink-0">
                                {{ p.status === 'completed' ? 'تکمیل' : p.progress_percent + '%' }}
                            </span>
                        </div>
                    </div>
                    <p v-else class="text-xs text-gray-400 text-center py-4">هنوز شرکت‌کننده‌ای ندارد</p>
                </div>

                <div class="flex justify-end gap-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                    <button v-can="'missions.update'" type="button" @click="openEditMissionModal(selectedMission); showDetailModal = false"
                        class="h-8 px-3 text-xs font-semibold rounded-lg bg-amber-400 text-gray-900 hover:bg-amber-500">ویرایش ماموریت</button>
                </div>
            </div>
        </BottomSheetDrawer>

        <!-- Mission Create/Edit Drawer -->
        <BottomSheetDrawer v-model="showMissionModal" :initialHeight="0.85" :maxHeight="0.95"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[36rem] lg:max-w-[36rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto'" :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ missionMode === 'create' ? 'ایجاد ماموریت جدید' : 'ویرایش ماموریت' }}</h3>
                <button type="button" @click="closeMissionModal" class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="space-y-2.5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div>
                        <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">عنوان ماموریت *</label>
                        <input v-model="missionForm.title" type="text" :class="fieldClass" />
                        <span v-if="missionErrors?.title" class="text-xs text-rose-500">{{ missionErrors.title[0] }}</span>
                    </div>
                    <div v-if="missionMode === 'create'">
                        <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">شناسه (slug)</label>
                        <input v-model="missionForm.id" type="text" dir="ltr" placeholder="auto-generated" :class="[fieldClass, 'font-mono']" />
                    </div>
                    <div>
                        <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">دسته‌بندی *</label>
                        <select v-model="missionForm.category_id" :class="fieldClass">
                            <option value="">انتخاب کنید</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                        </select>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">تصویر ماموریت</label>
                        <div class="flex items-center gap-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-2">
                            <div class="relative w-11 h-11 rounded-lg overflow-hidden border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 flex items-center justify-center shrink-0">
                                <img v-if="iconPreviewIsUrl" :src="iconPreviewSrc" @error="onPreviewError" alt="" class="w-full h-full object-cover" />
                                <span v-else-if="iconPreviewSrc" class="text-lg leading-none">{{ iconPreviewSrc }}</span>
                                <svg v-else class="w-5 h-5 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <div v-if="iconUploading" class="absolute inset-0 bg-black/45 flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" class="opacity-25" />
                                        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <input id="mission-icon-input" ref="iconInput" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,.svg,.png,.jpg,.jpeg,.webp" class="hidden" @change="onIconSelected" />
                                <div class="flex flex-wrap items-center gap-1.5">
                                    <label for="mission-icon-input"
                                        class="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-semibold rounded-lg bg-amber-400 text-gray-900 hover:bg-amber-500 cursor-pointer"
                                        :class="{ 'pointer-events-none opacity-60': iconUploading }">
                                        {{ missionForm.icon ? 'تغییر تصویر' : 'انتخاب تصویر' }}
                                    </label>
                                    <button v-if="missionForm.icon && !iconUploading" type="button" @click="removeIcon"
                                        class="inline-flex items-center h-8 px-2.5 text-xs font-medium rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                                        حذف
                                    </button>
                                </div>
                                <p class="mt-1 text-[10px] text-gray-400">PNG، JPG، WEBP یا SVG — حداکثر ۳ مگابایت</p>
                                <span v-if="missionErrors?.icon" class="text-xs text-rose-500">{{ missionErrors.icon[0] }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">توضیحات</label>
                    <textarea v-model="missionForm.description" rows="2" :class="fieldClass"></textarea>
                </div>
                <label class="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input v-model="missionForm.is_active" type="checkbox" class="rounded text-amber-500 focus:ring-amber-500" />
                    ماموریت فعال باشد
                </label>

                <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40 p-2.5">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h4 class="text-xs font-semibold text-gray-800 dark:text-gray-100">سطوح و امتیازات</h4>
                            <p class="text-[10px] text-gray-400 mt-0.5">هدف = تعداد عمل · امتیاز = پاداش هر سطح</p>
                        </div>
                        <button type="button" @click="addLevel" class="text-xs font-semibold text-amber-700 dark:text-amber-400 px-2 py-1 rounded-md bg-amber-100/80 dark:bg-amber-900/30">+ سطح</button>
                    </div>
                    <div class="space-y-1.5">
                        <div v-for="(level, index) in missionForm.levels" :key="index"
                            class="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-700/70">
                            <span class="text-[11px] font-semibold text-amber-600 w-7 text-center">#{{ index + 1 }}</span>
                            <div class="flex-1 grid grid-cols-2 gap-2">
                                <div>
                                    <label class="text-[10px] font-medium text-gray-400">هدف</label>
                                    <input v-model.number="level.goal" type="number" min="1" :class="[fieldClass, 'mt-0.5 !p-2']" />
                                </div>
                                <div>
                                    <label class="text-[10px] font-medium text-gray-400">امتیاز</label>
                                    <input v-model.number="level.exp" type="number" min="0" :class="[fieldClass, 'mt-0.5 !p-2']" />
                                </div>
                            </div>
                            <button v-if="missionForm.levels.length > 1" type="button" @click="removeLevel(index)" class="p-1 text-rose-400 hover:text-rose-600 rounded-md">
                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                    </div>
                    <p class="mt-1.5 text-[10px] text-gray-400">مجموع: <span class="font-semibold text-amber-600">{{ totalFormExp }}</span></p>
                </div>

                <div>
                    <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">تاریخ انقضا (اختیاری)</label>
                    <input v-model="missionForm.expired_at" type="datetime-local" :class="fieldClass" />
                </div>

                <div class="flex justify-end gap-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                    <button type="button" @click="closeMissionModal" class="h-8 px-3 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">انصراف</button>
                    <button type="button" @click="submitMission" :disabled="missionSubmitLoading"
                        class="h-8 px-3 text-xs font-semibold rounded-lg bg-amber-400 text-gray-900 disabled:opacity-60">
                        {{ missionSubmitLoading ? '...' : (missionMode === 'create' ? 'ایجاد' : 'ذخیره') }}
                    </button>
                </div>
            </div>
        </BottomSheetDrawer>

        <!-- Category & Delete modals -->
        <BottomSheetDrawer v-model="showCategoryModal" :initialHeight="0.4"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] lg:max-w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4'" :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ categoryMode === 'create' ? 'ایجاد دسته‌بندی' : 'ویرایش دسته‌بندی' }}</h3>
                <button type="button" @click="showCategoryModal = false" class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="space-y-2.5">
                <div>
                    <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">عنوان فارسی *</label>
                    <input v-model="categoryForm.title" type="text" :class="fieldClass" />
                    <span v-if="categoryErrors?.title" class="text-xs text-rose-500">{{ categoryErrors.title[0] }}</span>
                </div>
                <div>
                    <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">عنوان انگلیسی *</label>
                    <input v-model="categoryForm.english_title" type="text" dir="ltr" :class="[fieldClass, 'font-mono']" />
                    <span v-if="categoryErrors?.english_title" class="text-xs text-rose-500">{{ categoryErrors.english_title[0] }}</span>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" @click="showCategoryModal = false" class="h-8 px-3 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">انصراف</button>
                    <button type="button" @click="submitCategory" :disabled="categorySubmitLoading" class="h-8 px-3 text-xs font-semibold rounded-lg bg-amber-400 text-gray-900 disabled:opacity-60">ذخیره</button>
                </div>
            </div>
        </BottomSheetDrawer>

        <BottomSheetDrawer v-model="showDeleteMissionModal" :initialHeight="0.32"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-200/80 dark:border-gray-700/80 rounded-t-2xl lg:rounded-b-2xl lg:w-[30rem] lg:max-w-[30rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4'" :backdropClass="'bg-gray-300/30 backdrop-blur-sm'">
            <div class="text-center py-2">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">حذف ماموریت</h3>
                <p class="text-xs text-gray-600 dark:text-gray-300">آیا از حذف «{{ missionToDelete?.title }}» مطمئن هستید؟</p>
                <label v-if="missionToDelete?.participants_count > 0" class="inline-flex items-center gap-2 mt-3 text-xs text-gray-700 dark:text-gray-200">
                    <input v-model="forceDelete" type="checkbox" class="rounded text-amber-500 focus:ring-amber-500" />
                    حذف اجباری ({{ missionToDelete.participants_count }} شرکت‌کننده)
                </label>
            </div>
            <div class="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
                <button type="button" @click="showDeleteMissionModal = false" class="h-8 px-3 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800">انصراف</button>
                <button type="button" @click="confirmDeleteMission" :disabled="deleteLoading" class="h-8 px-3 text-xs font-semibold rounded-lg bg-rose-500 text-white">حذف</button>
            </div>
        </BottomSheetDrawer>

        <BottomSheetDrawer v-model="showDeleteCategoryModal" :initialHeight="0.32"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-200/60 dark:border-gray-700/80 rounded-t-2xl lg:rounded-b-2xl lg:w-[30rem] lg:max-w-[30rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4'" :backdropClass="'bg-gray-300/30 backdrop-blur-sm'">
            <div class="text-center py-2">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">حذف دسته‌بندی</h3>
                <p class="text-xs text-gray-600 dark:text-gray-300">آیا از حذف «{{ categoryToDelete?.title }}» مطمئن هستید؟</p>
                <label v-if="categoryToDelete?.missions_count > 0" class="inline-flex items-center gap-2 mt-3 text-xs text-gray-700 dark:text-gray-200">
                    <input v-model="forceDeleteCategory" type="checkbox" class="rounded text-amber-500 focus:ring-amber-500" />
                    حذف اجباری ({{ categoryToDelete.missions_count }} ماموریت)
                </label>
            </div>
            <div class="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
                <button type="button" @click="showDeleteCategoryModal = false" class="h-8 px-3 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800">انصراف</button>
                <button type="button" @click="confirmDeleteCategory" :disabled="deleteCategoryLoading" class="h-8 px-3 text-xs font-semibold rounded-lg bg-rose-500 text-white">حذف</button>
            </div>
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
import ComparisonBarChart from "@/views/components/chart/ComparisonBarChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";
import RankingPanel from "@/views/components/admin/mission/RankingPanel.vue";
import MissionIcon from "@/views/components/admin/mission/MissionIcon.vue";
import { BTN_SECONDARY } from "@/views/components/admin/adminFormStepperMixin.js";

export default {
    components: {
        AdminMasterPage, LoadingComponent, BottomSheetDrawer, PaginationComponent,
        AdminReportStatCard, AdminReportChartCard,
        ComparisonLineChart, ComparisonBarChart, AdminBarChart, DoughnutChart,
        Popover, PopoverButton, PopoverPanel, RankingPanel, MissionIcon,
    },
    data() {
        return {
            BTN_SECONDARY,
            loading: false, hasLoaded: false, statsDays: 30,
            overviewLoading: false, missionsLoading: false, categoriesLoading: false,
            selectedTab: 'overview',
            tabs: [
                { id: 'overview', label: 'داشبورد' },
                { id: 'missions', label: 'ماموریت‌ها' },
                { id: 'participants', label: 'شرکت‌کنندگان' },
                { id: 'categories', label: 'دسته‌بندی‌ها' },
                { id: 'scores', label: 'امتیازات' },
            ],
            statsDaysOptions: [
                { days: 7, title: '۷ روز' },
                { days: 30, title: '۳۰ روز' },
                { days: 90, title: '۹۰ روز' },
                { days: 365, title: '۱ سال' },
            ],
            stats: null, missions: [], categories: [], allMissionsList: [],
            pagination: null, currentPage: 1, perPage: 18,
            searchKey: '', filterCategory: '', filterListener: '', filterActive: '', filterSort: 'newest',
            missionDataView: 'list',
            showMissionModal: false, missionMode: 'create', missionForm: {}, missionErrors: null, missionSubmitLoading: false,
            iconUploading: false, iconLocalPreview: null,
            showCategoryModal: false, categoryMode: 'create', categoryForm: { id: null, title: '', english_title: '' },
            categoryErrors: null, categorySubmitLoading: false,
            showDeleteMissionModal: false, missionToDelete: null, forceDelete: false, deleteLoading: false,
            showDeleteCategoryModal: false, categoryToDelete: null, forceDeleteCategory: false, deleteCategoryLoading: false,
            showDetailModal: false, selectedMission: null, detailParticipants: [],
            participantMissionId: '', participantStatus: '', participants: [], participantSummary: null,
            participantsLoading: false, participantSearch: '', participantPage: 1, participantPagination: null,
            reportSyncDone: false,
            scoreSettingsForm: { conversion_rate: 1, min_scores: 1000 },
            scoreSettingsSaving: false,
        };
    },
    computed: {
        categoryFilterOptions() {
            return [{ value: '', label: 'همه دسته‌ها' }, ...this.categories.map(c => ({ value: c.id, label: c.title }))];
        },
        listenerFilterOptions() {
            return [
                { value: '', label: 'همه Listenerها' },
                { value: 'wired', label: 'متصل' },
                { value: 'unwired', label: 'بدون Listener' },
            ];
        },
        activeFilterOptions() {
            return [
                { value: '', label: 'همه وضعیت‌ها' },
                { value: 'active', label: 'فعال' },
                { value: 'inactive', label: 'غیرفعال' },
            ];
        },
        sortFilterOptions() {
            return [
                { value: 'newest', label: 'جدیدترین' },
                { value: 'participants', label: 'بیشترین مشارکت' },
                { value: 'completions', label: 'بیشترین تکمیل' },
                { value: 'title', label: 'عنوان' },
            ];
        },
        dataViewOptions() {
            return [
                { value: 'list', label: 'جدولی' },
                { value: 'grid', label: 'شبکه‌ای' },
            ];
        },
        participantMissionOptions() {
            return [{ value: '', label: 'همه ماموریت‌ها' }, ...this.allMissionsList.map(m => ({ value: m.id, label: m.title }))];
        },
        participantStatusOptions() {
            return [
                { value: '', label: 'همه' },
                { value: 'in_progress', label: 'در حال انجام' },
                { value: 'completed', label: 'تکمیل‌شده' },
            ];
        },
        fieldClass() {
            return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 text-xs rounded-lg border-0 outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 block w-full p-2';
        },
        iconPreviewSrc() {
            return this.iconLocalPreview || this.missionForm.icon || '';
        },
        iconPreviewIsUrl() {
            const v = (this.iconPreviewSrc || '').trim();
            return /^https?:\/\//i.test(v) || v.startsWith('blob:') || v.startsWith('/');
        },
        categoryComparisonDatasets() {
            const cc = this.stats?.charts?.category_comparison;
            if (!cc) return [];
            return [
                { label: 'شرکت‌کنندگان', data: cc.datasets?.[0]?.data, color: 'rgba(59, 130, 246, 0.85)' },
                { label: 'تکمیل‌ها', data: cc.datasets?.[1]?.data, color: 'rgba(16, 185, 129, 0.85)' },
            ];
        },
        totalFormExp() {
            return (this.missionForm.levels || []).reduce((s, l) => s + (Number(l.exp) || 0), 0);
        },
    },
    methods: {
        emptyMissionForm() {
            return { id: '', title: '', category_id: '', icon: '', description: '', is_active: true, levels: [{ goal: 1, exp: 50, requirements: [] }], expired_at: null };
        },
        formatNumber(n) { return n == null ? '—' : Number(n).toLocaleString('fa-IR'); },
        formatRelativeDate(d) {
            if (!d) return '';
            const diff = (Date.now() - new Date(d)) / 1000;
            if (diff < 3600) return Math.floor(diff / 60) + ' دقیقه پیش';
            if (diff < 86400) return Math.floor(diff / 3600) + ' ساعت پیش';
            return Math.floor(diff / 86400) + ' روز پیش';
        },
        toastOk(msg) { toast.success(msg, { theme: 'colored', rtl: true, bodyClassName: 'font-YekanBakh', position: toast.POSITION.BOTTOM_RIGHT }); },
        toastErr(msg) { toast.error(msg, { theme: 'colored', rtl: true, bodyClassName: 'font-YekanBakh', position: toast.POSITION.BOTTOM_RIGHT }); },

        switchTab(tab) {
            this.selectedTab = tab;
            if (tab === 'overview' && !this.stats) this.fetchStats();
            if (tab === 'missions') this.fetchMissions();
            if (tab === 'participants') {
                if (!this.allMissionsList.length) this.fetchAllMissionsList();
                this.fetchParticipants();
            }
            if (tab === 'categories') this.fetchCategories();
            if (tab === 'scores' && !this.stats) this.fetchStats();
        },

        setStatsDays(days) {
            if (this.statsDays === days) return;
            this.statsDays = days;
            this.fetchStats();
        },
        async fetchStats() {
            this.overviewLoading = true;
            try {
                const res = await axiosInstance.get('admin/missions/stats', { params: { days: this.statsDays } });
                this.stats = res.data.stats;
                const t = this.tabs.find(t => t.id === 'missions');
                if (t) t.badge = null;
                if (this.stats?.score_settings) {
                    this.scoreSettingsForm = {
                        conversion_rate: this.stats.score_settings.conversion_rate,
                        min_scores: this.stats.score_settings.min_scores,
                    };
                }
            } catch {
                this.toastErr('خطا در دریافت آمار');
            } finally {
                this.overviewLoading = false;
            }
        },
        async saveScoreSettings() {
            this.scoreSettingsSaving = true;
            try {
                const res = await axiosInstance.post('admin/missions/score-settings/update', {
                    conversion_rate: Number(this.scoreSettingsForm.conversion_rate) || 0,
                    min_scores: Number(this.scoreSettingsForm.min_scores) || 0,
                });
                if (this.stats) this.stats.score_settings = res.data.score_settings;
                this.scoreSettingsForm = { ...res.data.score_settings };
                this.toastOk(res.data.message || 'تنظیمات ذخیره شد');
            } catch (e) {
                this.toastErr(e?.response?.data?.message || 'خطا در ذخیره تنظیمات');
            } finally {
                this.scoreSettingsSaving = false;
            }
        },
        async fetchCategories() {
            this.categoriesLoading = true;
            try {
                const res = await axiosInstance.get('admin/missions/categories');
                this.categories = res.data.categories;
            } catch {
                this.toastErr('خطا در دریافت دسته‌بندی‌ها');
            } finally {
                this.categoriesLoading = false;
            }
        },
        async fetchAllMissionsList() {
            const res = await axiosInstance.post('admin/missions/list', { perPage: 200 });
            this.allMissionsList = res.data.missions;
        },
        async fetchMissions() {
            this.missionsLoading = true;
            const params = { page: this.currentPage, perPage: this.perPage, search: this.searchKey || undefined, category_id: this.filterCategory || undefined, listener_status: this.filterListener || undefined, active_status: this.filterActive || undefined, sort: this.filterSort };
            Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);
            try {
                const res = await axiosInstance.post('admin/missions/list', params);
                this.missions = res.data.missions;
                this.pagination = res.data.pagination;
                this.currentPage = res.data.pagination.current_page;
            } catch { this.toastErr('خطا در دریافت ماموریت‌ها'); }
            finally { this.missionsLoading = false; this.hasLoaded = true; }
        },
        async fetchParticipants() {
            this.participantsLoading = true;
            try {
                if (!this.reportSyncDone) {
                    try {
                        await axiosInstance.post('admin/missions/sync-report-progress');
                    } catch { /* optional catch-up */ }
                    this.reportSyncDone = true;
                }
                const res = await axiosInstance.post('admin/missions/participants', {
                    page: this.participantPage,
                    perPage: 30,
                    mission_id: this.participantMissionId || undefined,
                    status: this.participantStatus || undefined,
                    search: this.participantSearch || undefined,
                });
                this.participants = res.data.participants || [];
                this.participantSummary = res.data.summary;
                this.participantPagination = res.data.pagination;
            } catch { this.toastErr('خطا در دریافت شرکت‌کنندگان'); }
            finally { this.participantsLoading = false; }
        },
        onParticipantFiltersChanged() {
            this.participantPage = 1;
            this.fetchParticipants();
        },
        onParticipantPageChanged(page) {
            this.participantPage = page;
            this.fetchParticipants();
        },
        async refreshAll() {
            this.loading = true;
            try {
                await Promise.all([this.fetchStats(), this.fetchCategories()]);
                if (this.selectedTab === 'missions') await this.fetchMissions();
                if (this.selectedTab === 'participants') await this.fetchParticipants();
            } finally { this.loading = false; this.hasLoaded = true; }
        },
        onPageChanged(page) { this.currentPage = page; this.fetchMissions(); },
        applyMissionFilters() { this.currentPage = 1; this.fetchMissions(); },
        onIconSelected(e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            if (this.iconLocalPreview) URL.revokeObjectURL(this.iconLocalPreview);
            this.iconLocalPreview = URL.createObjectURL(file);
            this.uploadMissionIcon(file);
            e.target.value = '';
        },
        onPreviewError() {
            // keep emoji/text fallback via iconPreviewIsUrl
        },
        async uploadMissionIcon(file) {
            this.iconUploading = true;
            if (!this.missionErrors) this.missionErrors = {};
            this.missionErrors.icon = null;

            const maxBytes = 3 * 1024 * 1024;
            if (file.size > maxBytes) {
                this.missionErrors.icon = ['حداکثر حجم تصویر ۳ مگابایت است.'];
                this.toastErr(this.missionErrors.icon[0]);
                this.iconUploading = false;
                return;
            }

            const fd = new FormData();
            fd.append('icon', file);
            if (this.missionForm.icon && /^https?:\/\//i.test(this.missionForm.icon)) {
                fd.append('old_icon', this.missionForm.icon);
            }
            try {
                const res = await axiosInstance.post('admin/missions/upload-icon', fd, {
                    timeout: 120000,
                });
                this.missionForm.icon = res.data.icon;
                this.toastOk(res.data.message || 'تصویر آپلود شد');
            } catch (err) {
                const msg = err?.response?.data?.errors?.icon?.[0]
                    || err?.response?.data?.message
                    || 'خطا در آپلود تصویر';
                this.missionErrors.icon = [msg];
                this.toastErr(msg);
            } finally {
                this.iconUploading = false;
                if (this.iconLocalPreview) {
                    URL.revokeObjectURL(this.iconLocalPreview);
                    this.iconLocalPreview = null;
                }
            }
        },
        removeIcon() {
            this.missionForm.icon = '';
            if (this.iconLocalPreview) {
                URL.revokeObjectURL(this.iconLocalPreview);
                this.iconLocalPreview = null;
            }
        },
        clearMissionFilters() {
            this.searchKey = '';
            this.filterCategory = '';
            this.filterListener = '';
            this.filterActive = '';
            this.filterSort = 'newest';
            this.currentPage = 1;
            this.fetchMissions();
        },

        async openMissionDetail(mission) {
            this.selectedMission = mission;
            this.detailParticipants = [];
            this.showDetailModal = true;
            try {
                const res = await axiosInstance.get(`admin/missions/${mission.id}/participants`, { params: { limit: 20 } });
                this.detailParticipants = res.data.participants;
            } catch { /* silent */ }
        },

        async toggleMissionActive(mission) {
            try {
                const res = await axiosInstance.post(`admin/missions/${mission.id}/toggle-active`);
                mission.is_active = res.data.mission.is_active;
                this.toastOk(res.data.message);
            } catch { this.toastErr('خطا در تغییر وضعیت'); }
        },

        resetIconUpload() {
            this.iconUploading = false;
            if (this.iconLocalPreview) { URL.revokeObjectURL(this.iconLocalPreview); this.iconLocalPreview = null; }
        },
        openCreateMissionModal() { this.resetIconUpload(); this.missionMode = 'create'; this.missionForm = this.emptyMissionForm(); this.missionErrors = null; this.showMissionModal = true; },
        openEditMissionModal(mission) {
            this.resetIconUpload();
            this.missionMode = 'edit';
            const levels = Object.values(mission.levels || {}).map(l => ({ goal: l.goal, exp: l.exp, requirements: l.requirements || [] }));
            this.missionForm = { id: mission.id, title: mission.title, category_id: mission.category_id, icon: mission.icon, description: mission.description, is_active: mission.is_active, levels: levels.length ? levels : [{ goal: 1, exp: 0, requirements: [] }], expired_at: mission.expired_at ? mission.expired_at.slice(0, 16) : null };
            this.missionErrors = null; this.showMissionModal = true;
        },
        closeMissionModal() { this.showMissionModal = false; this.resetIconUpload(); },
        addLevel() { this.missionForm.levels.push({ goal: 1, exp: 0, requirements: [] }); },
        removeLevel(i) { this.missionForm.levels.splice(i, 1); },
        async submitMission() {
            this.missionErrors = null; this.missionSubmitLoading = true;
            const payload = { ...this.missionForm };
            if (!payload.id) delete payload.id;
            try {
                if (this.missionMode === 'create') { await axiosInstance.post('admin/missions/create', payload); this.toastOk('ماموریت ایجاد شد'); }
                else { await axiosInstance.post(`admin/missions/${payload.id}/update`, payload); this.toastOk('ماموریت ویرایش شد'); }
                this.closeMissionModal();
                await Promise.all([this.fetchMissions(), this.fetchStats(), this.fetchCategories()]);
            } catch (e) { if (e.response?.status === 422) this.missionErrors = e.response.data.errors; else this.toastErr('خطا در ذخیره'); }
            finally { this.missionSubmitLoading = false; }
        },
        openDeleteMissionModal(m) { this.missionToDelete = m; this.forceDelete = false; this.showDeleteMissionModal = true; },
        async confirmDeleteMission() {
            this.deleteLoading = true;
            try {
                await axiosInstance.delete(`admin/missions/${this.missionToDelete.id}`, { params: { force: this.forceDelete } });
                this.toastOk('ماموریت حذف شد'); this.showDeleteMissionModal = false;
                await Promise.all([this.fetchMissions(), this.fetchStats()]);
            } catch (e) { this.toastErr(e.response?.data?.message || 'خطا در حذف'); }
            finally { this.deleteLoading = false; }
        },
        openCreateCategoryModal() { this.categoryMode = 'create'; this.categoryForm = { id: null, title: '', english_title: '' }; this.categoryErrors = null; this.showCategoryModal = true; },
        openEditCategoryModal(cat) { this.categoryMode = 'edit'; this.categoryForm = { id: cat.id, title: cat.title, english_title: cat.english_title }; this.categoryErrors = null; this.showCategoryModal = true; },
        async submitCategory() {
            this.categorySubmitLoading = true; this.categoryErrors = null;
            try {
                if (this.categoryMode === 'create') await axiosInstance.post('admin/mission-category/create', this.categoryForm);
                else await axiosInstance.post(`admin/mission-category/${this.categoryForm.id}/update`, this.categoryForm);
                this.toastOk('دسته‌بندی ذخیره شد'); this.showCategoryModal = false;
                await Promise.all([this.fetchCategories(), this.fetchStats()]);
            } catch (e) { if (e.response?.status === 422) this.categoryErrors = e.response.data.errors; else this.toastErr('خطا'); }
            finally { this.categorySubmitLoading = false; }
        },
        openDeleteCategoryModal(cat) { this.categoryToDelete = cat; this.forceDeleteCategory = false; this.showDeleteCategoryModal = true; },
        async confirmDeleteCategory() {
            this.deleteCategoryLoading = true;
            try {
                await axiosInstance.delete(`admin/mission-category/${this.categoryToDelete.id}`, { params: { force: this.forceDeleteCategory } });
                this.toastOk('دسته‌بندی حذف شد'); this.showDeleteCategoryModal = false;
                await Promise.all([this.fetchCategories(), this.fetchStats()]);
            } catch (e) { this.toastErr(e.response?.data?.message || 'خطا'); }
            finally { this.deleteCategoryLoading = false; }
        },
    },
    created() {
        this.missionForm = this.emptyMissionForm();
        this.debouncedFetchMissions = debounce(() => { this.currentPage = 1; this.fetchMissions(); }, 400);
        this.debouncedFetchParticipants = debounce(() => { this.participantPage = 1; this.fetchParticipants(); }, 400);
    },
    async mounted() {
        document.title = 'مدیریت ماموریت‌ها';
        await this.refreshAll();
    },
};
</script>
