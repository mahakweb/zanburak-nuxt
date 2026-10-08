<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button @click="refreshAll" :disabled="loading || listLoading || refreshing" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    {{ refreshing ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی' }}
                    <svg class="w-4 h-4" :class="{ 'animate-spin': refreshing || loading }" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8 L8 8 C5.790861 8 4 9.790861 4 12 L4 13 C4 14.6568542 5.34314575 16 7 16 L7 18 C4.23857625 18 2 15.7614237 2 13 L2 12 C2 8.6862915 4.6862915 6 8 6 L12 6 L12 4.72799742 Z" fill="currentColor" />
                    </svg>
                </span>
            </button>
        </template>

        <div class="min-w-0 space-y-4">
            <!-- Mode tabs -->
            <div class="p-2 md:p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
                <div class="p-1.5 flex items-center gap-1 overflow-x-auto custom-scrollbar bg-gray-100/70 dark:bg-gray-800/70 rounded-xl">
                    <button v-for="mode in engagementModes" :key="mode.id" @click="switchMode(mode.id)"
                        class="shrink-0 flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                        :class="engagementMode === mode.id
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200'">
                        {{ mode.label }}
                    </button>
                    <span v-if="statsPeriodLabel" class="ms-auto shrink-0 px-2 py-1 text-[10px] font-medium rounded-md bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">{{ statsPeriodLabel }}</span>
                </div>
                <p v-if="headerSummary" class="mt-2 px-1 text-xs text-gray-500 dark:text-gray-400">{{ headerSummary }}</p>
            </div>

            <div v-if="fetchError" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                {{ fetchError }}
            </div>

            <!-- Date presets -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-3 shadow-sm">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">بازه زمانی</span>
                    <span class="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
                    <button v-for="preset in datePresets" :key="preset.slug" @click="applyPreset(preset)"
                        class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                        :class="preset.active
                            ? 'bg-amber-400 text-gray-900 shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'">
                        {{ preset.title }}
                    </button>
                </div>
            </div>

            <!-- Filters (hidden in overview) -->
            <div v-if="engagementMode !== 'overview'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-3 shadow-sm">
                <div class="flex flex-wrap items-end gap-2">
                    <div class="min-w-[130px]">
                        <label class="block text-xs font-light text-gray-400 px-1 mb-1">از تاریخ</label>
                        <input type="date" v-model="dateFrom" @change="applyFilters"
                            class="w-full h-8 px-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none">
                    </div>
                    <div class="min-w-[130px]">
                        <label class="block text-xs font-light text-gray-400 px-1 mb-1">تا تاریخ</label>
                        <input type="date" v-model="dateTo" @change="applyFilters"
                            class="w-full h-8 px-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none">
                    </div>
                    <div class="min-w-[120px]">
                        <label class="block text-xs font-light text-gray-400 px-1 mb-1">نوع محتوا</label>
                        <Listbox v-model="selectedContentType" v-slot="{ open }" as="div">
                            <div class="relative">
                                <ListboxButton class="w-full h-8 px-2 text-start text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">{{ selectedContentType.title }}</ListboxButton>
                                <ListboxOptions v-if="open" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-lg shadow-lg">
                                    <ListboxOption v-for="type in activeContentTypes" :key="type.slug" :value="type" class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">{{ type.title }}</ListboxOption>
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>
                    <div v-if="engagementMode === 'likes'" class="min-w-[110px]">
                        <label class="block text-xs font-light text-gray-400 px-1 mb-1">واکنش</label>
                        <Listbox v-model="selectedReaction" v-slot="{ open }" as="div">
                            <div class="relative">
                                <ListboxButton class="w-full h-8 px-2 text-start text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">{{ selectedReaction.title }}</ListboxButton>
                                <ListboxOptions v-if="open" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-lg shadow-lg">
                                    <ListboxOption v-for="type in reactionTypes" :key="type.slug" :value="type" class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">{{ type.title }}</ListboxOption>
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>
                    <button @click="clearFilters" class="h-8 px-3 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">پاک کردن</button>
                </div>
            </div>

            <!-- Content -->
            <div class="p-2 md:p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
                <!-- Overview mode -->
                <div v-if="engagementMode === 'overview'">
                    <div v-if="loading && !overviewStats" class="flex flex-col items-center justify-center py-16 text-center">
                        <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 animate-pulse">
                            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M12 8V12L15 15M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                        </div>
                        <p class="text-xs font-medium text-gray-500">در حال بارگذاری آمار...</p>
                    </div>
                    <div v-else-if="overviewStats" class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                            <AdminReportStatCard icon="eye" title="بازدید" :value="formatNumber(overviewStats.views_total)" :subtitle="formatNumber(overviewStats.views_today) + ' امروز'" accent="amber" :trend="{ change_percent: overviewStats.trend?.views?.change_percent }" />
                            <AdminReportStatCard icon="heart" title="لایک" :value="formatNumber(overviewStats.likes_total)" :subtitle="formatNumber(overviewStats.likes_positive) + ' مثبت'" accent="rose" :trend="{ change_percent: overviewStats.trend?.likes?.change_percent }" />
                            <AdminReportStatCard icon="message" title="نظر" :value="formatNumber(overviewStats.comments_total)" :subtitle="formatNumber(overviewStats.comments_today) + ' امروز'" accent="violet" :trend="{ change_percent: overviewStats.trend?.comments?.change_percent }" />
                            <AdminReportStatCard icon="trend" title="لایک / ۱۰۰ بازدید" :value="formatRatio(overviewStats.ratios?.likes_per_100_views)" subtitle="نسبت لایک به بازدید" accent="rose" :trend="{ change_percent: overviewStats.ratios_comparison?.likes_per_100_views?.change_percent }" />
                            <AdminReportStatCard icon="trend" title="نظر / ۱۰۰ بازدید" :value="formatRatio(overviewStats.ratios?.comments_per_100_views)" subtitle="نسبت نظر به بازدید" accent="violet" :trend="{ change_percent: overviewStats.ratios_comparison?.comments_per_100_views?.change_percent }" />
                            <AdminReportStatCard icon="activity" title="لایک به ازای هر نظر" :value="formatDecimal(overviewStats.ratios?.likes_per_comment)" subtitle="نسبت لایک به کامنت" accent="amber" :trend="{ change_percent: overviewStats.ratios_comparison?.likes_per_comment?.change_percent }" />
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <AdminReportStatCard icon="activity" title="تعامل / ۱۰۰ بازدید" :value="formatRatio(overviewStats.ratios?.interaction_per_100_views)" subtitle="(لایک + نظر) ÷ بازدید" accent="cyan" />
                            <AdminReportStatCard icon="message" title="نظر به ازای هر لایک" :value="formatDecimal(overviewStats.ratios?.comments_per_like)" subtitle="نسبت معکوس" accent="violet" />
                            <AdminReportStatCard icon="bookmark" title="بوکمارک" :value="formatNumber(overviewStats.bookmarks_total)" subtitle="ذخیره محتوا" accent="amber" />
                            <AdminReportStatCard icon="users" title="کاربران فعال" :value="formatNumber(overviewStats.unique_like_users + overviewStats.unique_comment_users)" :subtitle="formatNumber(overviewStats.unique_like_users) + ' لایک • ' + formatNumber(overviewStats.unique_comment_users) + ' نظر'" accent="blue" />
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <AdminReportChartCard class="lg:col-span-2" title="روند روزانه" subtitle="بازدید، لایک و نظر در کنار هم">
                                <ComparisonLineChart v-if="overviewDailyChart.labels.length" class="h-72"
                                    :labels="overviewDailyChart.labels" :datasets="overviewDailyChart.datasets" />
                            </AdminReportChartCard>
                            <AdminReportChartCard title="ترکیب حجم" subtitle="نسبت بازدید، لایک و نظر">
                                <DoughnutChart v-if="overviewVolumeMix.labels.length" class="h-72"
                                    :rawData="overviewVolumeMix" :legendPosition="'bottom'" />
                            </AdminReportChartCard>
                        </div>

                        <AdminReportChartCard title="مقایسه نوع محتوا" subtitle="بازدید، لایک و نظر بر اساس نوع">
                            <ComparisonBarChart v-if="overviewTypeChart.labels.length" class="h-72"
                                :labels="overviewTypeChart.labels" :datasets="overviewTypeChart.datasets" />
                        </AdminReportChartCard>

                        <AdminReportChartCard title="پرتعامل‌ترین محتوا" subtitle="امتیاز = (لایک + نظر) ÷ بازدید × ۱۰۰">
                            <div v-if="overviewStats.top_engaged_content?.length" class="overflow-x-auto">
                                <table class="min-w-full text-xs">
                                    <thead>
                                        <tr class="text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                            <th class="py-2 px-2 text-start">#</th>
                                            <th class="py-2 px-2 text-start">محتوا</th>
                                            <th class="py-2 px-2 text-start">نوع</th>
                                            <th class="py-2 px-2 text-start">بازدید</th>
                                            <th class="py-2 px-2 text-start">نظر</th>
                                            <th class="py-2 px-2 text-start">لایک</th>
                                            <th class="py-2 px-2 text-start">لایک/۱۰۰ب</th>
                                            <th class="py-2 px-2 text-start">نظر/۱۰۰ب</th>
                                            <th class="py-2 px-2 text-start">امتیاز</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, idx) in overviewStats.top_engaged_content" :key="idx" class="border-b border-gray-50 dark:border-gray-800/60">
                                            <td class="py-2.5 px-2 font-anjoman text-gray-400">{{ idx + 1 }}</td>
                                            <td class="py-2.5 px-2 text-xs font-medium truncate max-w-[200px]">{{ row.short_title || row.title }}</td>
                                            <td class="py-2.5 px-2"><span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">{{ row.content_type_label }}</span></td>
                                            <td class="py-2.5 px-2 font-anjoman">{{ formatNumber(row.views_count) }}</td>
                                            <td class="py-2.5 px-2 font-anjoman">{{ formatNumber(row.comments_count) }}</td>
                                            <td class="py-2.5 px-2 font-anjoman">{{ formatNumber(row.likes_count) }}</td>
                                            <td class="py-2.5 px-2 font-anjoman text-gray-600">{{ formatRatio(row.ratios?.likes_per_100_views) }}</td>
                                            <td class="py-2.5 px-2 font-anjoman text-gray-600">{{ formatRatio(row.ratios?.comments_per_100_views) }}</td>
                                            <td class="py-2.5 px-2 font-semibold text-amber-700 font-anjoman">{{ formatRatio(row.engagement_score) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p v-else class="text-sm text-gray-500 text-center py-8">داده‌ای نیست</p>
                        </AdminReportChartCard>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <AdminReportComparisonCard label="بازدید" :current="formatNumber(overviewStats.trend.views.current)" :previous="formatNumber(overviewStats.trend.views.previous)" :change="overviewStats.trend.views.change" :change-percent="overviewStats.trend.views.change_percent" />
                            <AdminReportComparisonCard label="لایک" :current="formatNumber(overviewStats.trend.likes.current)" :previous="formatNumber(overviewStats.trend.likes.previous)" :change="overviewStats.trend.likes.change" :change-percent="overviewStats.trend.likes.change_percent" />
                            <AdminReportComparisonCard label="نظر" :current="formatNumber(overviewStats.trend.comments.current)" :previous="formatNumber(overviewStats.trend.comments.previous)" :change="overviewStats.trend.comments.change" :change-percent="overviewStats.trend.comments.change_percent" />
                            <AdminReportComparisonCard label="تعامل (لایک+نظر)" :current="formatNumber(overviewStats.trend.interactions.current)" :previous="formatNumber(overviewStats.trend.interactions.previous)" :change="overviewStats.trend.interactions.change" :change-percent="overviewStats.trend.interactions.change_percent" />
                        </div>
                    </div>
                </div>

                <TabGroup v-else>
                    <TabList class="whitespace-nowrap p-1.5 flex items-center gap-1 overflow-x-auto bg-gray-100/70 dark:bg-gray-800 rounded-xl">
                        <Tab v-for="tab in activeTabs" :key="tab.id" as="div">
                            <button @click.prevent="switchTab(tab.id)"
                                class="shrink-0 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                                :class="selectedTab === tab.id ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'">
                                {{ tab.label }}
                            </button>
                        </Tab>
                    </TabList>

                    <TabPanels class="mt-4">
                        <!-- Stats -->
                        <TabPanel v-if="selectedTab === 'stats'">
                            <div v-if="loading && !stats" class="py-16 text-center text-sm text-gray-500">در حال بارگذاری...</div>
                            <div v-else-if="!stats" class="py-16 text-center text-sm text-gray-500">آماری برای نمایش وجود ندارد.</div>
                            <div v-else class="space-y-6">
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                                    <AdminReportStatCard :icon="engagementMode === 'likes' ? 'heart' : 'bookmark'" :title="modeLabel + ' در بازه'" :value="formatNumber(stats.total)" :subtitle="'میانگین روزانه: ' + formatNumber(avgDaily)" :accent="engagementMode === 'likes' ? 'rose' : 'violet'" :trend="stats.trend" />
                                    <AdminReportStatCard icon="clock" title="امروز" :value="formatNumber(stats.today)" :subtitle="formatNumber(stats.week) + ' در ۷ روز'" accent="blue" />
                                    <AdminReportStatCard icon="users" title="کاربران یکتا" :value="formatNumber(stats.unique_users)" subtitle="کاربر فعال" accent="cyan" />
                                    <AdminReportStatCard v-if="engagementMode === 'likes'" icon="heart" title="لایک" :value="formatNumber(stats.likes_count)" :subtitle="formatNumber(stats.dislikes_count) + ' دیسلایک'" accent="emerald" />
                                    <AdminReportStatCard v-if="engagementMode === 'likes'" icon="trend" title="امتیاز خالص" :value="formatNumber(stats.net_score)" subtitle="لایک − دیسلایک" accent="amber" />
                                    <AdminReportStatCard v-if="stats.insights" icon="users" title="میانگین هر کاربر" :value="formatNumber(stats.insights.avg_per_user)" :subtitle="'اوج: ' + stats.insights.peak_hour" accent="violet" />
                                    <AdminReportStatCard icon="activity" :title="'کل ' + modeLabel" :value="formatNumber(stats.all_time)" subtitle="از ابتدا" accent="rose" />
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <AdminReportChartCard class="lg:col-span-2" :title="'روند ' + modeLabel + ' روزانه'" :subtitle="'تعداد در هر روز'">
                                        <AreaChart class="h-72" :rawData="dailyChartData" :showLegend="false"
                                            :lineColor="engagementMode === 'likes' ? 'rgba(244,63,94,1)' : 'rgba(139,92,246,1)'"
                                            :fillColor="engagementMode === 'likes' ? 'rgba(244,63,94,0.2)' : 'rgba(139,92,246,0.2)'" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard v-if="stats.by_type?.length" title="بر اساس نوع محتوا">
                                        <DoughnutChart class="h-72" :rawData="{ labels: stats.by_type.map(t => t.label), data: stats.by_type.map(t => t.count), colors: ['#8b5cf6','#f59e0b','#06b6d4','#10b981','#ec4899','#ef4444'] }" :legendPosition="'bottom'" />
                                    </AdminReportChartCard>
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <AdminReportChartCard :title="'پربازدیدترین محتوا'" subtitle="۱۵ مورد برتر — نمودار میله‌ای">
                                        <AdminBarChart v-if="topContentChart.labels.length" class="h-80" :rawData="topContentChart" :horizontal="true"
                                            :colors="topContentChartColors" :barColor="engagementMode === 'likes' ? 'rgba(244,63,94,0.85)' : 'rgba(139,92,246,0.85)'" />
                                        <p v-else class="text-sm text-gray-500 text-center py-8">داده‌ای نیست</p>
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="توزیع ساعتی" subtitle="بر اساس ساعت روز">
                                        <AdminBarChart v-if="hourlyChart.labels.length" class="h-80" :rawData="hourlyChart"
                                            :barColor="engagementMode === 'likes' ? 'rgba(244,63,94,0.75)' : 'rgba(139,92,246,0.75)'"
                                            :hoverColor="engagementMode === 'likes' ? 'rgba(244,63,94,1)' : 'rgba(139,92,246,1)'" />
                                    </AdminReportChartCard>
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <AdminReportChartCard v-if="stats.by_weekday?.length" title="بر اساس روز هفته">
                                        <AdminBarChart class="h-56" :rawData="weekdayChart" barColor="rgba(6,182,212,0.8)" hoverColor="rgba(6,182,212,1)" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard v-if="engagementMode === 'likes' && stats.likes_count + stats.dislikes_count > 0" title="لایک در برابر دیسلایک">
                                        <DoughnutChart class="h-56" :rawData="{ labels: ['لایک', 'دیسلایک'], data: [stats.likes_count, stats.dislikes_count], colors: ['#10b981', '#ef4444'] }" :legendPosition="'bottom'" />
                                    </AdminReportChartCard>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Compare -->
                        <TabPanel v-if="selectedTab === 'compare'">
                            <div v-if="loading && !stats" class="py-16 text-center text-sm text-gray-500">در حال بارگذاری...</div>
                            <div v-else-if="stats?.comparison" class="space-y-6">
                                <AdminReportChartCard title="مقایسه با دوره قبل" subtitle="تغییرات نسبت به بازه معادل قبل">
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <AdminReportComparisonCard label="کل"
                                            :current="formatNumber(stats.comparison.total.current)"
                                            :previous="formatNumber(stats.comparison.total.previous)"
                                            :change="stats.comparison.total.change"
                                            :change-percent="stats.comparison.total.change_percent" />
                                        <AdminReportComparisonCard v-if="engagementMode === 'likes'" label="لایک"
                                            :current="formatNumber(stats.comparison.likes.current)"
                                            :previous="formatNumber(stats.comparison.likes.previous)"
                                            :change="stats.comparison.likes.change"
                                            :change-percent="stats.comparison.likes.change_percent" />
                                        <AdminReportComparisonCard v-if="engagementMode === 'likes'" label="دیسلایک"
                                            :current="formatNumber(stats.comparison.dislikes.current)"
                                            :previous="formatNumber(stats.comparison.dislikes.previous)"
                                            :change="stats.comparison.dislikes.change"
                                            :change-percent="stats.comparison.dislikes.change_percent" />
                                        <AdminReportComparisonCard label="کاربران یکتا"
                                            :current="formatNumber(stats.comparison.unique_users.current)"
                                            :previous="formatNumber(stats.comparison.unique_users.previous)"
                                            :change="stats.comparison.unique_users.change"
                                            :change-percent="stats.comparison.unique_users.change_percent" />
                                    </div>
                                </AdminReportChartCard>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <AdminReportChartCard title="روند روزانه — مقایسه‌ای" subtitle="دوره فعلی در برابر قبل">
                                        <ComparisonLineChart v-if="dailyComparisonChart.labels.length" class="h-72"
                                            :labels="dailyComparisonChart.labels"
                                            :datasets="dailyComparisonChart.datasets" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard v-if="engagementMode === 'likes' && stats.reaction_comparison" title="لایک vs دیسلایک — مقایسه‌ای">
                                        <ComparisonBarChart class="h-72"
                                            :labels="stats.reaction_comparison.labels"
                                            :datasets="reactionComparisonChart.datasets" />
                                    </AdminReportChartCard>
                                </div>

                                <AdminReportChartCard title="بر اساس نوع محتوا — مقایسه‌ای">
                                    <ComparisonBarChart v-if="typeComparisonChart.labels.length" class="h-72"
                                        :labels="typeComparisonChart.labels"
                                        :datasets="typeComparisonChart.datasets" />
                                </AdminReportChartCard>
                            </div>
                        </TabPanel>

                        <!-- Insights -->
                        <TabPanel v-if="selectedTab === 'insights'">
                            <div v-if="loading && !stats" class="py-16 text-center text-sm text-gray-500">در حال بارگذاری...</div>
                            <div v-else-if="stats" class="space-y-6">
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div v-for="item in insightCards" :key="item.label" class="px-2.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80">
                                        <p class="text-[11px] text-gray-500 mb-0.5">{{ item.label }}</p>
                                        <p class="text-sm font-semibold text-gray-900 dark:text-white font-anjoman">{{ item.value }}</p>
                                        <p v-if="item.sub" class="text-[11px] text-gray-400 mt-0.5">{{ item.sub }}</p>
                                    </div>
                                </div>
                                <AdminReportChartCard title="کاربران یکتا — روند روزانه" subtitle="تعداد کاربر فعال در هر روز">
                                    <AreaChart class="h-64" :rawData="dailyUniqueChart" :showLegend="false" lineColor="rgba(59,130,246,1)" fillColor="rgba(59,130,246,0.15)" />
                                </AdminReportChartCard>
                                <AdminReportChartCard v-if="monthlyChart.labels.length" title="روند ماهانه" subtitle="تجمیع ماه به ماه">
                                    <AdminBarChart class="h-64" :rawData="monthlyChart" barColor="rgba(139,92,246,0.85)" />
                                </AdminReportChartCard>
                            </div>
                        </TabPanel>

                        <!-- Heatmap -->
                        <TabPanel v-if="selectedTab === 'heatmap'">
                            <div v-if="loading && !stats" class="py-16 text-center text-sm text-gray-500">در حال بارگذاری...</div>
                            <div v-else-if="stats?.heatmap?.cells?.length" class="space-y-4">
                                <AdminReportChartCard title="نقشه حرارتی فعالیت" subtitle="روز هفته × ساعت — تیرگی = فعالیت بیشتر">
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <div class="min-w-[640px]">
                                            <div class="grid grid-cols-[72px_repeat(24,minmax(0,1fr))] gap-0.5 text-[10px]">
                                                <div></div>
                                                <div v-for="h in 24" :key="'h'+h" class="text-center text-gray-400 pb-1">{{ String(h - 1).padStart(2,'0') }}</div>
                                                <template v-for="day in 7" :key="'d'+day">
                                                    <div class="text-gray-500 text-xs flex items-center">{{ weekdayLabels[day - 1] }}</div>
                                                    <div v-for="hour in 24" :key="day+'-'+hour"
                                                        class="aspect-square rounded-sm flex items-center justify-center font-anjoman"
                                                        :style="heatmapCellStyle(day, hour - 1)"
                                                        :title="heatmapCellTitle(day, hour - 1)">
                                                        <span v-if="heatmapCellCount(day, hour - 1) > 0" class="text-[9px] font-bold">{{ heatmapCellCount(day, hour - 1) }}</span>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </AdminReportChartCard>
                            </div>
                            <p v-else class="py-16 text-center text-sm text-gray-500">داده‌ای برای heatmap نیست</p>
                        </TabPanel>

                        <!-- Top users -->
                        <TabPanel v-if="selectedTab === 'users'">
                            <div v-if="loading && !stats" class="py-16 text-center text-sm text-gray-500">در حال بارگذاری...</div>
                            <div v-else-if="stats?.top_users?.length" class="space-y-6">
                                <AdminReportChartCard :title="'فعال‌ترین کاربران'" :subtitle="'بر اساس تعداد ' + modeLabel">
                                    <AdminBarChart class="h-80" :rawData="topUsersChart" :horizontal="true" barColor="rgba(59,130,246,0.85)" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="فهرست کاربران">
                                    <div class="overflow-x-auto">
                                        <table class="min-w-full text-xs">
                                            <thead>
                                                <tr class="text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                                    <th class="py-2 px-2 text-start">کاربر</th>
                                                    <th class="py-2 px-2 text-start">تعداد</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(row, idx) in stats.top_users" :key="idx" class="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer" @click="openUserSheet(row.user)">
                                                    <td class="py-2.5 px-2">
                                                        <span v-if="row.user" class="font-semibold">@{{ row.user.username }}</span>
                                                        <span v-else class="text-gray-400">—</span>
                                                    </td>
                                                    <td class="py-2.5 px-2 font-bold text-amber-600 font-anjoman">{{ formatNumber(row.count) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </AdminReportChartCard>
                            </div>
                            <p v-else class="py-16 text-center text-sm text-gray-500">داده‌ای نیست</p>
                        </TabPanel>

                        <!-- List -->
                        <TabPanel v-if="selectedTab === 'list'">
                            <div class="mb-4 flex flex-wrap gap-3">
                                <div class="relative flex-1 min-w-[180px] max-w-sm">
                                    <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="جستجو کاربر..."
                                        class="w-full h-8 ps-3 pe-3 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none" />
                                </div>
                                <div class="relative flex-1 min-w-[180px] max-w-sm">
                                    <input type="text" v-model="contentSearch" @input="handleSearch" placeholder="جستجو عنوان محتوا..."
                                        class="w-full h-8 ps-3 pe-3 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none" />
                                </div>
                                <Listbox v-model="selectedSort" v-slot="{ open }" as="div" class="min-w-[120px]">
                                    <div class="relative">
                                        <ListboxButton class="w-full h-8 px-3 text-start text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">{{ selectedSort.title }}</ListboxButton>
                                        <ListboxOptions v-if="open" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                                            <ListboxOption v-for="s in sortOptions" :key="s.slug" :value="s" class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">{{ s.title }}</ListboxOption>
                                        </ListboxOptions>
                                    </div>
                                </Listbox>
                            </div>
                            <div class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-3 py-3">محتوا</th>
                                            <th class="px-2 py-3">نوع</th>
                                            <th v-if="engagementMode === 'likes'" class="px-2 py-3">واکنش</th>
                                            <th class="px-2 py-3">کاربر</th>
                                            <th class="px-2 py-3 text-end">تاریخ</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <template v-if="listLoading">
                                            <tr v-for="n in 5" :key="'sk-'+n" class="animate-pulse bg-white dark:bg-gray-900"><td :colspan="engagementMode === 'likes' ? 5 : 4" class="px-3 py-4"><div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div></td></tr>
                                        </template>
                                        <tr v-else-if="!items.length" class="bg-white dark:bg-gray-900"><td :colspan="engagementMode === 'likes' ? 5 : 4" class="px-3 py-12 text-center text-sm text-gray-400">موردی یافت نشد</td></tr>
                                        <tr v-else v-for="item in items" :key="item.id" class="bg-white dark:bg-gray-900 hover:bg-amber-50/40 dark:hover:bg-gray-800/60">
                                            <td class="px-3 py-3"><p class="text-xs font-medium truncate max-w-[200px]">{{ item.content?.title || '—' }}</p></td>
                                            <td class="px-2 py-3"><span class="px-2 py-0.5 text-[11px] font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">{{ item.content_type_label }}</span></td>
                                            <td v-if="engagementMode === 'likes'" class="px-2 py-3">
                                                <span class="px-2 py-0.5 text-[11px] font-medium rounded-md" :class="item.type === 'like' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'">
                                                    {{ item.type === 'like' ? 'لایک' : 'دیسلایک' }}
                                                </span>
                                            </td>
                                            <td class="px-2 py-3"><span v-if="item.user" class="text-xs text-gray-700 dark:text-gray-200 cursor-pointer hover:underline" @click="openUserSheet(item.user)">@{{ item.user.username }}</span><span v-else class="text-xs text-gray-400">—</span></td>
                                            <td class="px-2 py-3 text-xs text-gray-500 whitespace-nowrap text-end">{{ formatDate(item.created_at) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="pagination?.last_page > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <p class="text-xs text-gray-500">{{ pagination.from }}–{{ pagination.to }} از {{ formatNumber(pagination.total) }}</p>
                                <div class="flex gap-1">
                                    <button @click="goToPage(pagination.current_page - 1)" :disabled="pagination.current_page <= 1" class="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-40">قبلی</button>
                                    <button @click="goToPage(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page" class="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-40">بعدی</button>
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>

        <!-- User detail bottom sheet -->
        <BottomSheetDrawer v-model="userSheetOpen" :initialHeight="0.65" :maxHeight="0.9" :minHeight="0.45" :autoCloseOnMin="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[28rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 flex flex-col flex-1 min-h-0 overflow-auto custom-scrollbar'">
            <div class="shrink-0 pb-3 border-b border-gray-100 dark:border-gray-800 text-center">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">جزئیات فعالیت کاربر</h3>
                <p v-if="userDetail?.user" class="text-xs text-gray-500 mt-1">@{{ userDetail.user.username }}</p>
            </div>
            <div v-if="userDetailLoading" class="flex flex-col items-center justify-center py-10 text-center">
                <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 animate-pulse">
                    <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M12 8V12L15 15M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                </div>
                <p class="text-xs font-medium text-gray-500">در حال بارگذاری...</p>
            </div>
            <div v-else-if="userDetail" class="space-y-3 pt-3 text-xs">
                <div class="grid grid-cols-2 gap-2">
                    <div class="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
                        <p class="text-gray-500 mb-0.5">لایک</p>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white font-anjoman">{{ formatNumber(userDetail.summary.likes_total) }}</p>
                    </div>
                    <div class="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
                        <p class="text-gray-500 mb-0.5">بوکمارک</p>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white font-anjoman">{{ formatNumber(userDetail.summary.bookmarks_total) }}</p>
                    </div>
                </div>
                <div v-if="userDetail.likes_by_type?.length">
                    <p class="font-semibold text-gray-700 dark:text-gray-300 mb-2">لایک بر اساس نوع</p>
                    <div class="flex flex-wrap gap-1.5">
                        <span v-for="t in userDetail.likes_by_type" :key="t.type" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px]">{{ t.label }}: {{ formatNumber(t.count) }}</span>
                    </div>
                </div>
                <div v-if="userDetail.recent_likes?.length">
                    <p class="font-semibold text-gray-700 dark:text-gray-300 mb-2">آخرین لایک‌ها</p>
                    <ul class="space-y-1.5">
                        <li v-for="r in userDetail.recent_likes" :key="r.id" class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                            <p class="font-semibold truncate">{{ r.content?.title || '—' }}</p>
                            <p class="text-gray-400 mt-0.5">{{ r.content_type_label }} • {{ r.type === 'like' ? 'لایک' : 'دیسلایک' }}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <button @click="userSheetOpen = false" class="mt-4 shrink-0 w-full h-9 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800">بستن</button>
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>

<script>
import { TabGroup, TabList, Tab, TabPanels, TabPanel, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import AdminReportComparisonCard from "@/views/components/admin/report/AdminReportComparisonCard.vue";
import AreaChart from "@/views/components/chart/AreaChart.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
import ComparisonBarChart from "@/views/components/chart/ComparisonBarChart.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import axiosInstance from "@/store/axiosInstance";
import { BTN_SECONDARY } from "@/views/components/admin/adminFormStepperMixin.js";

const BAR_COLORS = ['#f59e0b','#fbbf24','#fcd34d','#d97706','#b45309','#92400e','#fde68a','#78350f','#a16207','#ca8a04','#eab308','#facc15','#fef08a','#713f12','#451a03'];

function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

const LIKE_CONTENT_TYPES = [
    { slug: "all", title: "همه" }, { slug: "Course", title: "دوره" },
    { slug: "Episode", title: "قسمت" }, { slug: "Question", title: "پرسش" },
    { slug: "Article", title: "مقاله" },
    { slug: "Answer", title: "پاسخ" }, { slug: "Comment", title: "نظر" },
];

const BOOKMARK_CONTENT_TYPES = [
    { slug: "all", title: "همه" }, { slug: "Course", title: "دوره" },
    { slug: "Episode", title: "قسمت" }, { slug: "Question", title: "پرسش" },
    { slug: "Article", title: "مقاله" },
];

export default {
    components: {
        AdminMasterPage, AdminReportStatCard, AdminReportChartCard, AdminReportComparisonCard, BottomSheetDrawer,
        AreaChart, DoughnutChart, AdminBarChart, ComparisonLineChart, ComparisonBarChart,
        TabGroup, TabList, Tab, TabPanels, TabPanel,
        Listbox, ListboxButton, ListboxOptions, ListboxOption,
    },
    data() {
        const today = new Date();
        const monthAgo = new Date();
        monthAgo.setDate(today.getDate() - 30);
        return {
            BTN_SECONDARY,
            engagementMode: "overview",
            engagementModes: [
                { id: "overview", label: "نمای کلی" },
                { id: "likes", label: "لایک‌ها" },
                { id: "bookmarks", label: "بوکمارک‌ها" },
            ],
            loading: false, listLoading: false, refreshing: false, fetchError: null,
            stats: null, overviewStats: null, items: [], pagination: null,
            selectedTab: "stats", dateFrom: formatLocalDate(monthAgo), dateTo: formatLocalDate(today),
            searchQuery: "", contentSearch: "", searchTimeout: null, currentPage: 1, datePresets: [],
            userSheetOpen: false, userDetail: null, userDetailLoading: false,
            weekdayLabels: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
            tabs: [
                { id: "stats", label: "آمار و نمودارها" },
                { id: "compare", label: "مقایسه دوره‌ها" },
                { id: "insights", label: "بینش‌ها" },
                { id: "heatmap", label: "نقشه حرارتی" },
                { id: "users", label: "کاربران فعال" },
                { id: "list", label: "فهرست" },
            ],
            selectedContentType: { slug: "all", title: "همه" },
            reactionTypes: [
                { slug: "all", title: "همه" }, { slug: "like", title: "لایک" }, { slug: "dislike", title: "دیسلایک" },
            ],
            selectedReaction: { slug: "all", title: "همه" },
            sortOptions: [
                { slug: "newest", title: "جدیدترین" },
                { slug: "oldest", title: "قدیمی‌ترین" },
            ],
            selectedSort: { slug: "newest", title: "جدیدترین" },
        };
    },
    computed: {
        activeTabs() {
            return this.tabs;
        },
        headerSummary() {
            if (this.engagementMode === "overview" && this.overviewStats) {
                return `${this.formatNumber(this.overviewStats.views_all_time)} بازدید • ${this.formatNumber(this.overviewStats.likes_all_time)} لایک • ${this.formatNumber(this.overviewStats.comments_all_time)} نظر`;
            }
            if (this.stats) {
                return `${this.formatNumber(this.stats.all_time)} کل • ${this.formatNumber(this.stats.today)} امروز`;
            }
            return "";
        },
        overviewDailyChart() {
            const rows = this.overviewStats?.daily_combined || [];
            return {
                labels: rows.map(r => r.date),
                datasets: [
                    { label: "بازدید", data: rows.map(r => r.views), lineColor: "rgba(59,130,246,1)", fillColor: "rgba(59,130,246,0.1)", fill: false },
                    { label: "لایک", data: rows.map(r => r.likes), lineColor: "rgba(244,63,94,1)", fillColor: "rgba(244,63,94,0.12)" },
                    { label: "نظر", data: rows.map(r => r.comments), lineColor: "rgba(6,182,212,1)", fillColor: "rgba(6,182,212,0.12)", fill: false },
                ],
            };
        },
        overviewVolumeMix() {
            const mix = this.overviewStats?.volume_mix;
            if (!mix?.values?.length) return { labels: [], data: [], colors: [] };
            return {
                labels: mix.labels || [],
                data: mix.values || [],
                colors: ["#3b82f6", "#f43f5e", "#06b6d4"],
            };
        },
        overviewTypeChart() {
            const rows = this.overviewStats?.type_comparison || [];
            return {
                labels: rows.map(r => r.label),
                datasets: [
                    { label: "بازدید", data: rows.map(r => r.views), color: "rgba(59,130,246,0.85)", hoverColor: "rgba(59,130,246,1)" },
                    { label: "لایک", data: rows.map(r => r.likes), color: "rgba(244,63,94,0.85)", hoverColor: "rgba(244,63,94,1)" },
                    { label: "نظر", data: rows.map(r => r.comments), color: "rgba(6,182,212,0.85)", hoverColor: "rgba(6,182,212,1)" },
                ],
            };
        },
        dailyUniqueChart() {
            return {
                labels: (this.stats?.daily_unique_users || []).map(d => d.date),
                data: (this.stats?.daily_unique_users || []).map(d => d.count),
            };
        },
        monthlyChart() {
            const rows = this.stats?.monthly || [];
            return {
                labels: rows.map(m => m.label),
                data: rows.map(m => m.count),
            };
        },
        insightCards() {
            const ins = this.stats?.insights;
            if (!ins) return [];
            const cards = [
                { label: "میانگین هر کاربر", value: this.formatNumber(ins.avg_per_user) },
                { label: "ساعت اوج", value: ins.peak_hour, sub: this.formatNumber(ins.peak_hour_count) + " مورد" },
                { label: "روز اوج", value: ins.peak_day, sub: this.formatNumber(ins.peak_day_count) + " مورد" },
            ];
            if (ins.positive_ratio != null) {
                cards.push({ label: "نسبت لایک مثبت", value: ins.positive_ratio + "%" });
            }
            return cards;
        },
        heatmapMap() {
            const map = {};
            (this.stats?.heatmap?.cells || []).forEach(c => {
                map[`${c.weekday}-${c.hour}`] = c.count;
            });
            return map;
        },
        heatmapMax() {
            return this.stats?.heatmap?.max || 1;
        },
        modeLabel() {
            return this.engagementMode === "likes" ? "لایک" : "بوکمارک";
        },
        activeContentTypes() {
            return this.engagementMode === "likes" ? LIKE_CONTENT_TYPES : BOOKMARK_CONTENT_TYPES;
        },
        statsPeriodLabel() {
            if (!this.dateFrom || !this.dateTo) return "";
            return `${this.formatDateShort(this.dateFrom)} تا ${this.formatDateShort(this.dateTo)}`;
        },
        avgDaily() {
            if (!this.stats?.daily?.length) return 0;
            return Math.round(this.stats.daily.reduce((s, d) => s + d.count, 0) / this.stats.daily.length);
        },
        dailyChartData() {
            return {
                labels: (this.stats?.daily || []).map(d => d.date),
                data: (this.stats?.daily || []).map(d => d.count),
            };
        },
        hourlyChart() {
            return {
                labels: (this.stats?.hourly || []).map(h => h.label),
                data: (this.stats?.hourly || []).map(h => h.count),
            };
        },
        weekdayChart() {
            return {
                labels: (this.stats?.by_weekday || []).map(w => w.label),
                data: (this.stats?.by_weekday || []).map(w => w.count),
            };
        },
        topContentChart() {
            const items = (this.stats?.top_content || []).slice().reverse();
            return {
                labels: items.map(i => i.short_title || i.title),
                data: items.map(i => i.items_count),
            };
        },
        topContentChartColors() {
            return this.topContentChart.data.map((_, i) => BAR_COLORS[i % BAR_COLORS.length]);
        },
        topUsersChart() {
            const rows = (this.stats?.top_users || []).slice().reverse();
            return {
                labels: rows.map(r => r.user ? `@${r.user.username}` : "—"),
                data: rows.map(r => r.count),
            };
        },
        dailyComparisonChart() {
            const dc = this.stats?.daily_comparison;
            if (!dc) return { labels: [], datasets: [] };
            const color = this.engagementMode === "likes" ? "rgba(244, 63, 94, 1)" : "rgba(139, 92, 246, 1)";
            const fill = this.engagementMode === "likes" ? "rgba(244, 63, 94, 0.15)" : "rgba(139, 92, 246, 0.15)";
            return {
                labels: dc.labels || [],
                datasets: [
                    { label: "دوره فعلی", data: dc.current || [], lineColor: color, fillColor: fill },
                    { label: "دوره قبل", data: dc.previous || [], lineColor: "rgba(107, 114, 128, 0.9)", fillColor: "rgba(107, 114, 128, 0.08)", fill: false },
                ],
            };
        },
        typeComparisonChart() {
            const tc = this.stats?.by_type_comparison;
            if (!tc) return { labels: [], datasets: [] };
            const color = this.engagementMode === "likes" ? "rgba(244, 63, 94, 0.85)" : "rgba(139, 92, 246, 0.85)";
            return {
                labels: tc.labels || [],
                datasets: [
                    { label: "دوره فعلی", data: tc.current || [], color, hoverColor: color.replace("0.85", "1") },
                    { label: "دوره قبل", data: tc.previous || [], color: "rgba(156, 163, 175, 0.75)", hoverColor: "rgba(107, 114, 128, 1)" },
                ],
            };
        },
        reactionComparisonChart() {
            const rc = this.stats?.reaction_comparison;
            if (!rc) return { labels: [], datasets: [] };
            return {
                labels: rc.labels || [],
                datasets: [
                    { label: "دوره فعلی", data: rc.current || [], color: "rgba(16, 185, 129, 0.85)", hoverColor: "rgba(16, 185, 129, 1)" },
                    { label: "دوره قبل", data: rc.previous || [], color: "rgba(239, 68, 68, 0.75)", hoverColor: "rgba(239, 68, 68, 1)" },
                ],
            };
        },
    },
    watch: {
        selectedContentType() { this.applyFilters(); },
        selectedReaction() { if (this.engagementMode === "likes") this.applyFilters(); },
        selectedSort() { if (this.selectedTab === "list") this.fetchItems(1); },
    },
    methods: {
        switchMode(mode) {
            if (this.engagementMode === mode) return;
            this.engagementMode = mode;
            this.selectedContentType = { slug: "all", title: "همه" };
            this.selectedReaction = { slug: "all", title: "همه" };
            this.items = [];
            this.stats = null;
            this.overviewStats = null;
            this.selectedTab = mode === "overview" ? "stats" : this.selectedTab;
            this.applyFilters();
        },
        switchTab(tab) {
            this.selectedTab = tab;
            if (tab === "list") this.fetchItems(this.currentPage || 1);
        },
        initDatePresets() {
            const fmt = (d) => formatLocalDate(d);
            const presets = [
                { slug: "today", title: "امروز", days: 0 },
                { slug: "7d", title: "۷ روز", days: 7 },
                { slug: "30d", title: "۳۰ روز", days: 30 },
                { slug: "90d", title: "۹۰ روز", days: 90 },
            ];
            this.datePresets = presets.map((p) => ({
                ...p, active: p.slug === "30d",
                getRange() {
                    const end = new Date(), start = new Date();
                    if (p.days === 0) return { from: fmt(end), to: fmt(end) };
                    start.setDate(end.getDate() - p.days);
                    return { from: fmt(start), to: fmt(end) };
                },
            }));
        },
        applyPreset(preset) {
            this.datePresets.forEach((p) => { p.active = p.slug === preset.slug; });
            const range = preset.getRange();
            this.dateFrom = range.from;
            this.dateTo = range.to;
            this.applyFilters();
        },
        buildParams() {
            const params = { date_from: this.dateFrom, date_to: this.dateTo };
            if (this.selectedContentType.slug !== "all") params.content_type = this.selectedContentType.slug;
            if (this.engagementMode === "likes" && this.selectedReaction.slug !== "all") {
                params.reaction_type = this.selectedReaction.slug;
            }
            return params;
        },
        statsEndpoint() {
            return this.engagementMode === "likes" ? "/admin/likes/stats" : "/admin/bookmarks/stats";
        },
        listEndpoint() {
            return this.engagementMode === "likes" ? "/admin/likes" : "/admin/bookmarks";
        },
        async fetchOverviewStats() {
            try {
                this.loading = true;
                this.fetchError = null;
                const { data } = await axiosInstance.get("/admin/engagement/overview/stats", { params: this.buildParams() });
                if (data?.message === "Success") {
                    this.overviewStats = data.stats;
                } else {
                    this.fetchError = "پاسخ نامعتبر از سرور دریافت شد.";
                }
            } catch (e) {
                console.error("Error fetching overview stats:", e);
                this.fetchError = "خطا در دریافت آمار کلی. لطفاً دوباره تلاش کنید.";
            } finally {
                this.loading = false;
            }
        },
        async fetchStats() {
            if (this.engagementMode === "overview") {
                return this.fetchOverviewStats();
            }
            try {
                this.loading = true;
                this.fetchError = null;
                const { data } = await axiosInstance.get(this.statsEndpoint(), { params: this.buildParams() });
                if (data?.message === "Success") {
                    this.stats = data.stats;
                } else {
                    this.fetchError = "پاسخ نامعتبر از سرور دریافت شد.";
                }
            } catch (e) {
                console.error("Error fetching engagement stats:", e);
                this.fetchError = "خطا در دریافت آمار. لطفاً دوباره تلاش کنید.";
            } finally {
                this.loading = false;
            }
        },
        async fetchItems(page = 1) {
            try {
                this.listLoading = true;
                this.fetchError = null;
                this.currentPage = page;
                const params = { ...this.buildParams(), page, perPage: 20, sort: this.selectedSort.slug };
                if (this.searchQuery) params.search = this.searchQuery;
                if (this.contentSearch) params.content_search = this.contentSearch;
                const { data } = await axiosInstance.post(this.listEndpoint(), params);
                if (data?.message === "Success") {
                    this.items = data.items || [];
                    this.pagination = data.pagination;
                } else {
                    this.fetchError = "پاسخ نامعتبر از سرور دریافت شد.";
                }
            } catch (e) {
                console.error("Error fetching engagement list:", e);
                this.fetchError = "خطا در دریافت فهرست. لطفاً دوباره تلاش کنید.";
            } finally {
                this.listLoading = false;
            }
        },
        applyFilters() {
            this.fetchStats();
            if (this.selectedTab === "list") this.fetchItems(1);
        },
        clearFilters() {
            const today = new Date(), monthAgo = new Date();
            monthAgo.setDate(today.getDate() - 30);
            this.dateFrom = formatLocalDate(monthAgo);
            this.dateTo = formatLocalDate(today);
            this.selectedContentType = { slug: "all", title: "همه" };
            this.selectedReaction = { slug: "all", title: "همه" };
            this.searchQuery = "";
            this.contentSearch = "";
            this.selectedSort = this.sortOptions[0];
            this.datePresets.forEach((p) => { p.active = p.slug === "30d"; });
            this.applyFilters();
        },
        async refreshAll() {
            this.refreshing = true;
            this.fetchError = null;
            try {
                await this.fetchStats();
                if (this.engagementMode !== "overview" && this.selectedTab === "list") {
                    await this.fetchItems(this.currentPage || 1);
                }
            } finally {
                this.refreshing = false;
            }
        },
        async openUserSheet(user) {
            if (!user?.id) return;
            this.userSheetOpen = true;
            this.userDetail = null;
            this.userDetailLoading = true;
            try {
                const { data } = await axiosInstance.get("/admin/engagement/user-detail", {
                    params: { ...this.buildParams(), user_id: user.id },
                });
                if (data?.message === "Success") this.userDetail = data;
            } catch (e) {
                console.error("User detail failed:", e);
            } finally {
                this.userDetailLoading = false;
            }
        },
        heatmapCellCount(day, hour) {
            return this.heatmapMap[`${day}-${hour}`] || 0;
        },
        heatmapCellTitle(day, hour) {
            const count = this.heatmapCellCount(day, hour);
            return `${this.weekdayLabels[day - 1]} ${String(hour).padStart(2, "0")}:00 — ${count} مورد`;
        },
        heatmapCellStyle(day, hour) {
            const count = this.heatmapCellCount(day, hour);
            const ratio = this.heatmapMax > 0 ? count / this.heatmapMax : 0;
            const alpha = count > 0 ? 0.15 + ratio * 0.85 : 0.04;
            const color = this.engagementMode === "likes"
                ? `rgba(244, 63, 94, ${alpha})`
                : `rgba(139, 92, 246, ${alpha})`;
            return { backgroundColor: color };
        },
        handleSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                if (this.selectedTab === "list") this.fetchItems(1);
            }, 400);
        },
        goToPage(page) {
            if (page < 1 || (this.pagination && page > this.pagination.last_page)) return;
            this.fetchItems(page);
        },
        formatNumber(n) { return Number(n || 0).toLocaleString("fa-IR"); },
        formatRatio(n) {
            const val = Number(n || 0);
            return val.toLocaleString("fa-IR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "٪";
        },
        formatDecimal(n) {
            const val = Number(n || 0);
            return val.toLocaleString("fa-IR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        },
        formatDate(d) {
            if (!d) return "—";
            return new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
        },
        formatDateShort(d) {
            if (!d) return "";
            return new Date(d).toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
        },
        typeBadgeClass(type) {
            return {
                Course: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
                Episode: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                Question: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
                Article: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                Answer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                Comment: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
            }[type] || "bg-gray-100 text-gray-700";
        },
    },
    mounted() {
        this.initDatePresets();
        this.fetchStats();
    },
};
</script>
