<script setup>
definePageMeta({
  name: "admin-index",
  middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button @click="refresh" :disabled="loading"
                class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset] disabled:opacity-60 disabled:cursor-not-allowed">
                <span class="flex items-center">
                    {{ loading ? 'در حال بارگذاری...' : 'به‌روزرسانی آمار' }}
                    <svg class="w-5 h-5 rtl:ms-1 -mt-0.5" :class="{ 'animate-spin': loading }" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8 L8 8 C5.790861 8 4 9.790861 4 12 L4 13 C4 14.6568542 5.34314575 16 7 16 L7 18 C4.23857625 18 2 15.7614237 2 13 L2 12 C2 8.6862915 4.6862915 6 8 6 L12 6 L12 4.72799742 Z" fill="currentColor" />
                    </svg>
                </span>
            </button>
        </template>

        <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-4">
                <span v-if="statsPeriodLabel"
                    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-yellow-400/15 text-yellow-700 dark:text-yellow-400 border border-yellow-400/30">
                    {{ statsPeriodLabel }}
                </span>
                <span v-if="hasLoaded" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatNumber(platform.engagement?.views) }} بازدید • {{ formatNumber(platform.engagement?.likes) }} لایک • {{ formatNumber(users.in_period) }} ثبت‌نام • {{ formatCurrency(payments.summary.total_amount) }} فروش
                </span>
            </div>

            <div v-if="fetchError" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {{ fetchError }}
            </div>

            <!-- Preset Filters -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-3 mb-4 shadow-sm">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">بازه زمانی</span>
                    <button v-for="preset in datePresets" :key="preset.slug" @click="applyPreset(preset)"
                        class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
                        :class="preset.active ? 'bg-yellow-400 text-black shadow-sm ring-1 ring-yellow-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'">
                        {{ preset.title }}
                    </button>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-4 mb-6 shadow-sm">
                <div class="flex flex-wrap items-end gap-4">
                    <div class="flex-1 min-w-[140px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">از تاریخ</label>
                        <input type="date" v-model="filters.date_from"
                            class="w-full h-8 px-3 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none">
                    </div>
                    <div class="flex-1 min-w-[140px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">تا تاریخ</label>
                        <input type="date" v-model="filters.date_to"
                            class="w-full h-8 px-3 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none">
                    </div>
                    <div class="flex-1 min-w-[130px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">گروه‌بندی</label>
                        <select v-model="filters.group_by"
                            class="w-full h-8 px-3 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none">
                            <option value="day">روزانه</option>
                            <option value="week">هفتگی</option>
                            <option value="month">ماهانه</option>
                        </select>
                    </div>
                    <button @click="applyFilters"
                        class="h-8 px-4 text-xs font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors">
                        اعمال فیلتر
                    </button>
                </div>
            </div>

            <!-- Main Content -->
            <div class="p-2 md:p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
                <div v-if="loading && !hasLoaded" class="text-sm font-semibold text-center py-16 text-gray-500">
                    در حال بارگذاری آمار...
                </div>

                <TabGroup v-else>
                    <TabList class="whitespace-nowrap p-1.5 flex items-center gap-1 overflow-x-auto bg-gray-100/70 dark:bg-gray-800 rounded-xl mb-6">
                        <Tab v-for="tab in visibleDashboardTabs" :key="tab.id" as="div">
                            <button @click.prevent="selectedTab = tab.id"
                                class="shrink-0 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                                :class="selectedTab === tab.id ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'">
                                {{ tab.label }}
                            </button>
                        </Tab>
                    </TabList>

                    <TabPanels>
                        <!-- Overview -->
                        <TabPanel v-if="selectedTab === 'overview'" class="space-y-6">
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3">
                                <AdminReportStatCard title="بازدید" :value="formatNumber(platform.engagement?.views)"
                                    :subtitle="formatNumber(platform.engagement?.views_today) + ' امروز • ' + formatNumber(platform.engagement?.guest_views) + ' مهمان'"
                                    accent="blue" :trend="{ change_percent: comparison.views?.change_percent }" />
                                <AdminReportStatCard title="لایک" :value="formatNumber(platform.engagement?.likes)"
                                    :subtitle="formatNumber(platform.engagement?.likes_positive) + ' مثبت • ' + formatNumber(platform.engagement?.dislikes) + ' منفی'"
                                    accent="rose" :trend="{ change_percent: comparison.likes?.change_percent }" />
                                <AdminReportStatCard title="ثبت‌نام" :value="formatNumber(users.in_period)"
                                    :subtitle="formatNumber(users.total) + ' کاربر کل • ' + formatNumber(platform.activity?.active_users) + ' فعال در بازه'"
                                    accent="cyan" :trend="{ change_percent: comparison.registrations?.change_percent }" />
                                <AdminReportStatCard title="فروش" :value="formatCurrency(payments.summary.total_amount)"
                                    :subtitle="formatNumber(payments.summary.paid_payments) + ' تراکنش • AOV ' + formatCurrency(payments.summary.aov)"
                                    accent="emerald" :trend="{ change_percent: comparison.revenue?.change_percent }" value-dir="ltr" />
                            </div>

                            <div v-if="settlement" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <AdminReportStatCard compact title="تسویه شده" :value="formatCurrency(settlement.settled_amount) + ' تومان'"
                                    :subtitle="formatNumber(settlement.settled_count) + ' مورد'" accent="emerald" value-dir="ltr">
                                    <template #icon>
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" />
                                            <path d="M8.5 12.2l2.2 2.2 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </template>
                                </AdminReportStatCard>
                                <AdminReportStatCard compact title="تسویه نشده" :value="formatCurrency(settlement.unsettled_amount) + ' تومان'"
                                    :subtitle="formatNumber(settlement.unsettled_count) + ' مورد'" accent="amber" value-dir="ltr">
                                    <template #icon>
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" />
                                            <path d="M12 8v4.5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                                        </svg>
                                    </template>
                                </AdminReportStatCard>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <AdminReportStatCard title="کامنت" :value="formatNumber(comments.in_period)"
                                    :subtitle="formatNumber(comments.unapproved) + ' در انتظار تایید'" accent="amber"
                                    :trend="{ change_percent: comparison.comments?.change_percent }" />
                                <AdminReportStatCard title="تماشای ویدیو" :value="formatNumber(platform.activity?.video_views)"
                                    :subtitle="formatNumber(platform.activity?.today?.video_views) + ' امروز'" accent="violet"
                                    :trend="{ change_percent: comparison.video_views?.change_percent }" />
                                <AdminReportStatCard title="بوکمارک" :value="formatNumber(platform.engagement?.bookmarks)"
                                    subtitle="ذخیره محتوا توسط کاربران" accent="violet"
                                    :trend="{ change_percent: comparison.bookmarks?.change_percent }" />
                                <AdminReportStatCard title="لایک / ۱۰۰ بازدید" :value="formatRatio(platform.ratios?.likes_per_100_views)"
                                    subtitle="نسبت تعامل به بازدید" accent="amber" />
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <AdminReportChartCard class="lg:col-span-2" title="روند تعامل" subtitle="بازدید، لایک و کامنت در کنار هم">
                                    <ComparisonLineChart v-if="engagementDailyChart.labels.length" class="h-72"
                                        :labels="engagementDailyChart.labels" :datasets="engagementDailyChart.datasets" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="ترکیب فعالیت" subtitle="بازدید، لایک، کامنت و بوکمارک">
                                    <DoughnutChart chart-id="dash-volume-mix" v-if="volumeMixChart.labels.length" class="h-72"
                                        :rawData="volumeMixChart" :legendPosition="'bottom'" />
                                </AdminReportChartCard>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <AdminReportComparisonCard label="بازدید" :current="formatNumber(comparison.views?.current)"
                                    :previous="formatNumber(comparison.views?.previous)" :change="comparison.views?.change"
                                    :change-percent="comparison.views?.change_percent" />
                                <AdminReportComparisonCard label="لایک" :current="formatNumber(comparison.likes?.current)"
                                    :previous="formatNumber(comparison.likes?.previous)" :change="comparison.likes?.change"
                                    :change-percent="comparison.likes?.change_percent" />
                                <AdminReportComparisonCard label="ثبت‌نام" :current="formatNumber(comparison.registrations?.current)"
                                    :previous="formatNumber(comparison.registrations?.previous)" :change="comparison.registrations?.change"
                                    :change-percent="comparison.registrations?.change_percent" />
                                <AdminReportComparisonCard label="فروش" :current="formatCurrency(comparison.revenue?.current)"
                                    :previous="formatCurrency(comparison.revenue?.previous)" :change="comparison.revenue?.change"
                                    :change-percent="comparison.revenue?.change_percent" />
                            </div>
                        </TabPanel>

                        <!-- Platform -->
                        <TabPanel v-if="selectedTab === 'platform'" class="space-y-6">
                            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                                <AdminReportStatCard title="دوره" :value="formatNumber(platform.content?.courses)" accent="blue" />
                                <AdminReportStatCard title="مسیر" :value="formatNumber(platform.content?.paths)" accent="cyan" />
                                <AdminReportStatCard title="قسمت" :value="formatNumber(platform.content?.episodes)" accent="violet" />
                                <AdminReportStatCard title="پرسش" :value="formatNumber(platform.content?.questions)" accent="amber" />
                                <AdminReportStatCard title="مقاله" :value="formatNumber(platform.content?.articles)" accent="yellow" />
                                <AdminReportStatCard title="پلن" :value="formatNumber(platform.content?.plans)" accent="rose" />
                                <AdminReportStatCard title="گواهینامه" :value="formatNumber(platform.content?.certificates)" accent="emerald" />
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="بازدید بر اساس نوع" subtitle="توزیع بازدید محتوا">
                                    <DoughnutChart chart-id="dash-views-type" v-if="viewsByTypeChart.labels.length" class="h-72"
                                        :rawData="viewsByTypeChart" :legendPosition="'bottom'" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="توزیع فعالیت‌ها" subtitle="لاگین، تماشا، سوال، پاسخ و ...">
                                    <DoughnutChart chart-id="dash-activity" v-if="activityDistributionChart.labels.length" class="h-72"
                                        :rawData="activityDistributionChart" :legendPosition="'bottom'" />
                                </AdminReportChartCard>
                            </div>

                            <AdminReportChartCard title="مقایسه نوع محتوا" subtitle="بازدید، لایک و نظر بر اساس نوع">
                                <ComparisonBarChart v-if="engagementTypeChart.labels.length" class="h-72"
                                    :labels="engagementTypeChart.labels" :datasets="engagementTypeChart.datasets" />
                            </AdminReportChartCard>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="بازدید ساعتی" subtitle="بر اساس ساعت روز">
                                    <AdminBarChart v-if="viewsHourlyChart.labels.length" class="h-64"
                                        :rawData="viewsHourlyChart" barColor="rgba(59,130,246,0.85)" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="پربازدیدترین محتوا" subtitle="۱۰ مورد برتر">
                                    <AdminBarChart v-if="topViewedChart.labels.length" class="h-64"
                                        :rawData="topViewedChart" :horizontal="true" barColor="rgba(6,182,212,0.85)" />
                                </AdminReportChartCard>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                <AdminReportStatCard title="سوال جدید" :value="formatNumber(platform.activity?.questions)"
                                    subtitle="در این بازه" accent="amber" :trend="{ change_percent: comparison.questions?.change_percent }" />
                                <AdminReportStatCard title="پاسخ جدید" :value="formatNumber(platform.activity?.answers)"
                                    subtitle="در این بازه" accent="cyan" :trend="{ change_percent: comparison.answers?.change_percent }" />
                                <AdminReportStatCard title="مقاله جدید" :value="formatNumber(platform.activity?.articles)"
                                    subtitle="در این بازه" accent="yellow" :trend="{ change_percent: comparison.articles?.change_percent }" />
                                <AdminReportStatCard title="نظر / ۱۰۰ بازدید" :value="formatRatio(platform.ratios?.comments_per_100_views)"
                                    subtitle="نسبت کامنت به بازدید" accent="emerald" />
                                <AdminReportStatCard title="کامنت در انتظار" :value="formatNumber(platform.moderation?.unapproved_comments)"
                                    subtitle="نیاز به بررسی" accent="rose" />
                            </div>
                        </TabPanel>

                        <!-- Users -->
                        <TabPanel v-if="selectedTab === 'users'" class="space-y-6">
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <AdminReportStatCard title="کاربران کل" :value="formatNumber(users.total)"
                                    :subtitle="formatNumber(users.in_period) + ' ثبت‌نام در بازه'" accent="blue"
                                    :trend="{ change_percent: comparison.registrations?.change_percent }" />
                                <AdminReportStatCard title="فعال در بازه" :value="formatNumber(platform.activity?.active_users)"
                                    :subtitle="formatNumber(platform.activity?.logins) + ' لاگین'" accent="cyan"
                                    :trend="{ change_percent: comparison.active_users?.change_percent }" />
                                <AdminReportStatCard title="فعال ۲۴ ساعت" :value="formatNumber(users.active_24h)"
                                    subtitle="آخرین بازدید" accent="emerald" />
                                <AdminReportStatCard title="کاربر VIP" :value="formatNumber(platform.users?.vip)"
                                    :subtitle="formatNumber(platform.users?.active_accounts) + ' حساب فعال'" accent="amber" />
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="ثبت‌نام‌های روزانه" :subtitle="'در این بازه: ' + formatNumber(users.in_period)">
                                    <AreaChart v-if="users.daily.labels.length" class="h-72"
                                        :rawData="users.daily" :showLegend="false"
                                        :lineColor="'rgba(59, 130, 246, 1)'" :fillColor="'rgba(59, 130, 246, 0.25)'" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="وضعیت حساب‌ها">
                                    <DoughnutChart chart-id="dash-user-status" v-if="userStatusChart.data.some(v => v > 0)" class="h-72"
                                        :rawData="userStatusChart" :legendPosition="'bottom'" />
                                </AdminReportChartCard>
                            </div>

                            <AdminReportChartCard title="ثبت‌نام بر اساس روز هفته">
                                <AdminBarChart v-if="registrationsWeekdayChart.labels.length" class="h-64"
                                    :rawData="registrationsWeekdayChart" barColor="rgba(6,182,212,0.85)" />
                            </AdminReportChartCard>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="کاربران جدید">
                                    <div v-if="users.recent?.length" class="divide-y divide-gray-200 dark:divide-gray-700">
                                        <div v-for="u in users.recent" :key="u.id"
                                            class="py-2.5 flex items-center justify-between text-sm">
                                            <span class="font-medium text-gray-900 dark:text-white">{{ u.first_name }} {{ u.last_name }}</span>
                                            <span class="text-xs text-gray-500">{{ u.username }}</span>
                                        </div>
                                    </div>
                                    <p v-else class="text-sm text-gray-500 text-center py-8">موردی وجود ندارد</p>
                                </AdminReportChartCard>
                                <AdminReportChartCard title="کامنت‌های اخیر">
                                    <div v-if="comments.recent?.length" class="divide-y divide-gray-200 dark:divide-gray-700">
                                        <div v-for="c in comments.recent" :key="c.id" class="py-2.5 text-sm">
                                            <div class="flex items-center justify-between">
                                                <span class="font-medium text-gray-900 dark:text-white">{{ c.user?.username || 'کاربر' }}</span>
                                                <span class="text-xs px-2 py-0.5 rounded"
                                                    :class="c.approved ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'">
                                                    {{ c.approved ? 'تایید' : 'انتظار' }}
                                                </span>
                                            </div>
                                            <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ c.comment }}</p>
                                        </div>
                                    </div>
                                    <p v-else class="text-sm text-gray-500 text-center py-8">موردی وجود ندارد</p>
                                </AdminReportChartCard>
                            </div>
                        </TabPanel>

                        <!-- Sales -->
                        <TabPanel v-if="selectedTab === 'sales'" class="space-y-6">
                            <div v-if="settlement" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <AdminReportStatCard compact title="تسویه شده" :value="formatCurrency(settlement.settled_amount) + ' تومان'"
                                    :subtitle="formatNumber(settlement.settled_count) + ' مورد'" accent="emerald" value-dir="ltr">
                                    <template #icon>
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" />
                                            <path d="M8.5 12.2l2.2 2.2 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </template>
                                </AdminReportStatCard>
                                <AdminReportStatCard compact title="تسویه نشده" :value="formatCurrency(settlement.unsettled_amount) + ' تومان'"
                                    :subtitle="formatNumber(settlement.unsettled_count) + ' مورد'" accent="amber" value-dir="ltr">
                                    <template #icon>
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" />
                                            <path d="M12 8v4.5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                                        </svg>
                                    </template>
                                </AdminReportStatCard>
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                            <AdminReportChartCard class="lg:col-span-2" title="نمودار فروش" subtitle="روند مبلغ یا تعداد تراکنش">
                                <template #actions>
                                    <div class="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-full p-0.5">
                                        <button class="px-3 py-1 text-xs font-medium rounded-full transition-colors"
                                            :class="chartMode === 'amount' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'"
                                            @click="chartMode = 'amount'">مبلغ</button>
                                        <button class="px-3 py-1 text-xs font-medium rounded-full transition-colors"
                                            :class="chartMode === 'count' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'"
                                            @click="chartMode = 'count'">تعداد</button>
                                    </div>
                                </template>
                                <AreaChart v-if="payments.daily.labels.length" class="h-72"
                                    :rawData="{ labels: payments.daily.labels, data: chartMode === 'amount' ? payments.daily.amount : payments.daily.count }"
                                    :chartTitle="chartMode === 'amount' ? 'مبلغ فروش' : 'تعداد فروش'"
                                    :showLegend="false"
                                    :lineColor="'rgba(34, 197, 94, 1)'"
                                    :fillColor="'rgba(34, 197, 94, 0.25)'" />
                            </AdminReportChartCard>
                            <AdminReportChartCard v-if="settlement" title="وضعیت تسویه" subtitle="سهم نهایی بعد از تخفیف">
                                <DoughnutChart chart-id="dash-settlement-chart" class="h-56 mx-auto" legend-position="bottom" value-format="currency"
                                    :rawData="{
                                        labels: ['تسویه شده', 'تسویه نشده'],
                                        data: [settlement.settled_amount || 0, settlement.unsettled_amount || 0],
                                        colors: ['#22c55e', '#f59e0b']
                                    }" />
                            </AdminReportChartCard>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="سهم درگاه‌ها" subtitle="توزیع مبلغ بر اساس درگاه">
                                    <DoughnutChart chart-id="dash-pay-methods" v-if="paymentMethodsChart.data.length" class="h-56 mx-auto" value-format="currency"
                                        :rawData="paymentMethodsChart" :legendPosition="'bottom'" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="درگاه‌ها — نمودار میله‌ای" subtitle="مقایسه مبلغ هر درگاه">
                                    <AdminBarChart v-if="paymentMethodsBarChart.labels.length" class="h-72"
                                        :rawData="paymentMethodsBarChart" barColor="rgba(59,130,246,0.85)" />
                                </AdminReportChartCard>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <AdminReportChartCard title="مشتریان جدید vs بازگشتی">
                                    <DoughnutChart chart-id="dash-customers" v-if="customersChart.data.some(v => v > 0)" class="h-56 mx-auto"
                                        :rawData="customersChart" :legendPosition="'bottom'" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="وضعیت پرداخت‌ها">
                                    <DoughnutChart chart-id="dash-pay-status" v-if="paymentStatusesChart.data.some(v => v > 0)" class="h-56 mx-auto"
                                        :rawData="paymentStatusesChart" :legendPosition="'bottom'" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="درآمد بر حسب نوع محصول">
                                    <AdminBarChart v-if="revenueByTypeChart.data.length" class="h-56"
                                        :rawData="{ labels: revenueByTypeChart.labels, data: revenueByTypeChart.data }"
                                        barColor="rgba(139,92,246,0.85)" />
                                </AdminReportChartCard>
                            </div>

                            <AdminReportChartCard title="درآمد بر اساس نوع محصول — مقایسه‌ای" subtitle="دوره فعلی در برابر دوره قبل">
                                <ComparisonBarChart v-if="revenueTypeComparisonChart.labels.length" class="h-72"
                                    :labels="revenueTypeComparisonChart.labels"
                                    :datasets="revenueTypeComparisonChart.datasets" />
                            </AdminReportChartCard>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="فروش بر اساس روز هفته">
                                    <AdminBarChart v-if="salesWeekdayChart.labels.length" class="h-64"
                                        :rawData="salesWeekdayChart" barColor="rgba(16,185,129,0.85)" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="توزیع ساعتی فروش" subtitle="بر اساس ساعت روز">
                                    <AdminBarChart v-if="salesHourlyChart.labels.length" class="h-64"
                                        :rawData="salesHourlyChart" barColor="rgba(245,158,11,0.85)" />
                                </AdminReportChartCard>
                            </div>
                        </TabPanel>

                        <!-- Compare -->
                        <TabPanel v-if="selectedTab === 'compare'" class="space-y-6">
                            <AdminReportChartCard title="تعامل و ترافیک — مقایسه با دوره قبل"
                                :subtitle="previousPeriodLabel ? 'دوره قبل: ' + previousPeriodLabel : ''">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                    <AdminReportComparisonCard label="بازدید" :current="formatNumber(comparison.views?.current)"
                                        :previous="formatNumber(comparison.views?.previous)" :change="comparison.views?.change"
                                        :change-percent="comparison.views?.change_percent" />
                                    <AdminReportComparisonCard label="لایک" :current="formatNumber(comparison.likes?.current)"
                                        :previous="formatNumber(comparison.likes?.previous)" :change="comparison.likes?.change"
                                        :change-percent="comparison.likes?.change_percent" />
                                    <AdminReportComparisonCard label="تماشای ویدیو" :current="formatNumber(comparison.video_views?.current)"
                                        :previous="formatNumber(comparison.video_views?.previous)" :change="comparison.video_views?.change"
                                        :change-percent="comparison.video_views?.change_percent" />
                                    <AdminReportComparisonCard label="کاربران فعال" :current="formatNumber(comparison.active_users?.current)"
                                        :previous="formatNumber(comparison.active_users?.previous)" :change="comparison.active_users?.change"
                                        :change-percent="comparison.active_users?.change_percent" />
                                </div>
                            </AdminReportChartCard>

                            <AdminReportChartCard title="فروش — مقایسه با دوره قبل">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <AdminReportComparisonCard label="فروش (مبلغ)" :current="formatCurrency(comparison.revenue?.current)"
                                        :previous="formatCurrency(comparison.revenue?.previous)" :change="comparison.revenue?.change"
                                        :change-percent="comparison.revenue?.change_percent" />
                                    <AdminReportComparisonCard label="تراکنش" :current="formatNumber(comparison.transactions?.current)"
                                        :previous="formatNumber(comparison.transactions?.previous)" :change="comparison.transactions?.change"
                                        :change-percent="comparison.transactions?.change_percent" />
                                    <AdminReportComparisonCard label="ثبت‌نام" :current="formatNumber(comparison.registrations?.current)"
                                        :previous="formatNumber(comparison.registrations?.previous)" :change="comparison.registrations?.change"
                                        :change-percent="comparison.registrations?.change_percent" />
                                    <AdminReportComparisonCard label="کامنت" :current="formatNumber(comparison.comments?.current)"
                                        :previous="formatNumber(comparison.comments?.previous)" :change="comparison.comments?.change"
                                        :change-percent="comparison.comments?.change_percent" />
                                    <AdminReportComparisonCard label="بوکمارک" :current="formatNumber(comparison.bookmarks?.current)"
                                        :previous="formatNumber(comparison.bookmarks?.previous)" :change="comparison.bookmarks?.change"
                                        :change-percent="comparison.bookmarks?.change_percent" />
                                    <AdminReportComparisonCard label="میانگین سفارش" :current="formatCurrency(comparison.aov?.current)"
                                        :previous="formatCurrency(comparison.aov?.previous)" :change="comparison.aov?.change"
                                        :change-percent="comparison.aov?.change_percent" />
                                </div>
                            </AdminReportChartCard>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="بازدید روزانه — مقایسه‌ای">
                                    <ComparisonLineChart v-if="engagementViewsComparisonChart.labels.length" class="h-72"
                                        :labels="engagementViewsComparisonChart.labels"
                                        :datasets="engagementViewsComparisonChart.datasets" />
                                </AdminReportChartCard>
                                <AdminReportChartCard title="فروش روزانه — مقایسه‌ای">
                                    <ComparisonLineChart v-if="dailyComparisonAmountChart.labels.length" class="h-72"
                                        :labels="dailyComparisonAmountChart.labels"
                                        :datasets="dailyComparisonAmountChart.datasets" />
                                </AdminReportChartCard>
                            </div>

                            <AdminReportChartCard title="درآمد نوع محصول — مقایسه‌ای">
                                <ComparisonBarChart v-if="revenueTypeComparisonChart.labels.length" class="h-72"
                                    :labels="revenueTypeComparisonChart.labels"
                                    :datasets="revenueTypeComparisonChart.datasets" />
                            </AdminReportChartCard>
                        </TabPanel>

                        <!-- Details -->
                        <TabPanel v-if="selectedTab === 'details'" class="space-y-6">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="پربازدیدترین محتوا">
                                    <div v-if="platform.top_viewed?.length" class="overflow-x-auto">
                                        <table class="min-w-full text-xs">
                                            <thead>
                                                <tr class="text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                                    <th class="py-2 px-2 text-start">#</th>
                                                    <th class="py-2 px-2 text-start">محتوا</th>
                                                    <th class="py-2 px-2 text-start">نوع</th>
                                                    <th class="py-2 px-2 text-start">بازدید</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(row, idx) in platform.top_viewed" :key="idx"
                                                    class="border-b border-gray-50 dark:border-gray-800/60">
                                                    <td class="py-2.5 px-2 font-anjoman text-gray-400">{{ idx + 1 }}</td>
                                                    <td class="py-2.5 px-2 font-semibold truncate max-w-[200px]">{{ row.title }}</td>
                                                    <td class="py-2.5 px-2">{{ row.content_type_label }}</td>
                                                    <td class="py-2.5 px-2 font-anjoman text-blue-600">{{ formatNumber(row.views_count) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p v-else class="text-sm text-gray-500 text-center py-8">موردی وجود ندارد</p>
                                </AdminReportChartCard>

                                <AdminReportChartCard title="تراکنش‌های اخیر">
                                    <div v-if="payments.recent?.length" class="divide-y divide-gray-200 dark:divide-gray-700">
                                        <div v-for="p in payments.recent" :key="p.id"
                                            class="py-2.5 flex items-center justify-between text-sm">
                                            <div class="min-w-0">
                                                <span class="font-medium text-gray-900 dark:text-white truncate block">{{ p.user?.username || 'کاربر' }}</span>
                                                <span class="text-xs text-gray-500">{{ formatDate(p.paid_at || p.created_at) }}</span>
                                            </div>
                                            <div class="text-left shrink-0 ms-2">
                                                <div class="font-semibold text-green-600 dark:text-green-400" dir="ltr">{{ formatCurrency(p.amount) }}</div>
                                                <div class="text-xs text-gray-500">{{ mapDriverName(p.driver) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <p v-else class="text-sm text-gray-500 text-center py-8">موردی وجود ندارد</p>
                                </AdminReportChartCard>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <AdminReportChartCard title="پرفروش‌ترین دوره‌ها">
                                    <div v-if="insights.top_products.courses?.length" class="overflow-x-auto">
                                        <table class="min-w-full text-xs">
                                            <thead>
                                                <tr class="text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                                    <th class="py-2 px-2 text-start">#</th>
                                                    <th class="py-2 px-2 text-start">عنوان</th>
                                                    <th class="py-2 px-2 text-start">تعداد</th>
                                                    <th class="py-2 px-2 text-start">مبلغ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item, idx) in insights.top_products.courses" :key="item.id"
                                                    class="border-b border-gray-50 dark:border-gray-800/60">
                                                    <td class="py-2.5 px-2 font-anjoman text-gray-400">{{ idx + 1 }}</td>
                                                    <td class="py-2.5 px-2 font-semibold">{{ item.title }}</td>
                                                    <td class="py-2.5 px-2 font-anjoman">{{ formatNumber(item.count) }}</td>
                                                    <td class="py-2.5 px-2 font-semibold text-green-600 font-anjoman" dir="ltr">{{ formatCurrency(item.total) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p v-else class="text-sm text-gray-500 text-center py-8">موردی وجود ندارد</p>
                                </AdminReportChartCard>

                                <AdminReportChartCard title="پرفروش‌ترین مسیرها و پلن‌ها">
                                    <AdminBarChart v-if="topProductsBarChart.labels.length" class="h-64 mb-4"
                                        :rawData="topProductsBarChart" :horizontal="true" barColor="rgba(16,185,129,0.85)" />
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-2">مسیرها</p>
                                            <div v-if="insights.top_products.paths?.length" class="space-y-2">
                                                <div v-for="item in insights.top_products.paths" :key="item.id"
                                                    class="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                    <span class="truncate me-2">{{ item.title }}</span>
                                                    <span class="font-semibold text-green-600 shrink-0" dir="ltr">{{ formatCurrency(item.total) }}</span>
                                                </div>
                                            </div>
                                            <p v-else class="text-sm text-gray-500">—</p>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-2">پلن‌ها</p>
                                            <div v-if="insights.top_products.plans?.length" class="space-y-2">
                                                <div v-for="item in insights.top_products.plans" :key="item.id"
                                                    class="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                    <span class="truncate me-2">{{ item.title }}</span>
                                                    <span class="font-semibold text-green-600 shrink-0" dir="ltr">{{ formatCurrency(item.total) }}</span>
                                                </div>
                                            </div>
                                            <p v-else class="text-sm text-gray-500">—</p>
                                        </div>
                                    </div>
                                </AdminReportChartCard>
                            </div>

                            <AdminReportChartCard title="کدهای تخفیف پرمصرف">
                                <div v-if="insights.discounts.top_codes?.length" class="overflow-x-auto">
                                    <table class="min-w-full text-xs">
                                        <thead>
                                            <tr class="text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                                <th class="py-2 px-2 text-start">#</th>
                                                <th class="py-2 px-2 text-start">کد</th>
                                                <th class="py-2 px-2 text-start">تعداد استفاده</th>
                                                <th class="py-2 px-2 text-start">مجموع تخفیف</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(d, idx) in insights.discounts.top_codes" :key="d.discount_code"
                                                class="border-b border-gray-50 dark:border-gray-800/60">
                                                <td class="py-2.5 px-2 font-anjoman text-gray-400">{{ idx + 1 }}</td>
                                                <td class="py-2.5 px-2 font-semibold">{{ d.discount_code }}</td>
                                                <td class="py-2.5 px-2 font-anjoman">{{ formatNumber(d.used_times) }}</td>
                                                <td class="py-2.5 px-2 font-semibold text-yellow-600 font-anjoman" dir="ltr">{{ formatCurrency(d.total_discount) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p v-else class="text-sm text-gray-500 text-center py-8">موردی وجود ندارد</p>
                            </AdminReportChartCard>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>
    </AdminMasterPage>
</template>

<script>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminReportComparisonCard from "@/views/components/admin/report/AdminReportComparisonCard.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import AreaChart from "@/views/components/chart/AreaChart.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
import ComparisonBarChart from "@/views/components/chart/ComparisonBarChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import axiosInstance from "@/store/axiosInstance";

export default {
    components: {
        AdminMasterPage,
        AdminReportStatCard,
        AdminReportComparisonCard,
        AdminReportChartCard,
        AreaChart,
        DoughnutChart,
        ComparisonLineChart,
        ComparisonBarChart,
        AdminBarChart,
        TabGroup,
        TabList,
        Tab,
        TabPanels,
        TabPanel,
    },
    data() {
        return {
            loading: false,
            hasLoaded: false,
            fetchError: "",
            selectedTab: "overview",
            dashboardTabs: [
                { id: "overview", label: "خلاصه" },
                { id: "platform", label: "تعامل و محتوا" },
                { id: "users", label: "کاربران" },
                { id: "sales", label: "فروش" },
                { id: "compare", label: "مقایسه" },
                { id: "details", label: "جداول" },
            ],
            period: { date_from: "", date_to: "", labels: [], group_by: "day" },
            filters: {
                date_from: "",
                date_to: "",
                group_by: "day",
            },
            datePresets: [
                { slug: "7d", title: "۷ روز گذشته", days: 7, active: false },
                { slug: "30d", title: "۳۰ روز گذشته", days: 30, active: true },
                { slug: "90d", title: "۹۰ روز گذشته", days: 90, active: false },
                { slug: "ytd", title: "سال جاری", isYtd: true, active: false },
            ],
            chartMode: "amount",
            comparison: {},
            analytics: {
                daily_combined: [],
                daily_comparison: {},
                revenue_type_comparison: [],
                sales_by_weekday: [],
                sales_by_hour: [],
                registrations_by_weekday: [],
                views_by_type: [],
                engagement_type_comparison: [],
                engagement_daily_comparison: {},
                activity_distribution: { labels: [], values: [], colors: [] },
                volume_mix: { labels: [], values: [] },
                previous_period: {},
            },
            payments: {
                summary: {
                    total_amount: 0,
                    total_discount: 0,
                    total_payments: 0,
                    paid_payments: 0,
                    pending_payments: 0,
                    expired_payments: 0,
                    conversion_rate: 0,
                    arpu: 0,
                    aov: 0,
                },
                daily: { labels: [], amount: [], count: [] },
                methods: [],
                recent: [],
                statuses: { paid: 0, pending: 0, expired: 0 },
                revenue_by_type: [],
            },
            users: {
                total: 0,
                daily: { labels: [], data: [] },
                active_24h: 0,
                in_period: 0,
                recent: [],
            },
            comments: {
                total: 0,
                approved: 0,
                unapproved: 0,
                in_period: 0,
                daily: { labels: [], data: [] },
                recent: [],
            },
            courses: { total: 0 },
            platform: {
                content: {},
                engagement: {},
                activity: { today: {} },
                users: {},
                ratios: {},
                moderation: {},
                top_viewed: [],
            },
            insights: {
                paying_users: { unique: 0, arppu: 0 },
                customers: { new: 0, returning: 0 },
                top_products: { courses: [], paths: [], plans: [] },
                discounts: { total_used: 0, top_codes: [] },
            },
            capabilities: {
                users: true,
                platform: true,
                payments: true,
                comments: true,
                courses: true,
                certificates: true,
            },
            settlement: null,
        };
    },
    computed: {
        visibleDashboardTabs() {
            const caps = this.capabilities || {};
            const rules = {
                overview: true,
                platform: caps.platform || caps.comments,
                users: caps.users,
                sales: caps.payments,
                compare: caps.payments || caps.users || caps.platform,
                details: caps.payments || caps.comments || caps.users || caps.platform,
            };

            return this.dashboardTabs.filter((tab) => rules[tab.id] !== false);
        },
        statsPeriodLabel() {
            if (!this.period.date_from || !this.period.date_to) return "";
            return `${this.formatDateShort(this.period.date_from)} تا ${this.formatDateShort(this.period.date_to)}`;
        },
        previousPeriodLabel() {
            const p = this.analytics.previous_period;
            if (!p?.date_from || !p?.date_to) return "";
            return `${this.formatDateShort(p.date_from)} تا ${this.formatDateShort(p.date_to)}`;
        },
        overviewDailyChart() {
            const rows = this.analytics.daily_combined || [];
            return {
                labels: rows.map((r) => r.date),
                datasets: [
                    { label: "فروش", data: rows.map((r) => r.sales), lineColor: "rgba(34,197,94,1)", fillColor: "rgba(34,197,94,0.12)", fill: false },
                    { label: "ثبت‌نام", data: rows.map((r) => r.users), lineColor: "rgba(59,130,246,1)", fillColor: "rgba(59,130,246,0.12)" },
                    { label: "کامنت", data: rows.map((r) => r.comments), lineColor: "rgba(234,179,8,1)", fillColor: "rgba(234,179,8,0.12)", fill: false },
                ],
            };
        },
        engagementDailyChart() {
            const rows = this.analytics.daily_combined || [];
            return {
                labels: rows.map((r) => r.date),
                datasets: [
                    { label: "بازدید", data: rows.map((r) => r.views), lineColor: "rgba(59,130,246,1)", fillColor: "rgba(59,130,246,0.1)", fill: false },
                    { label: "لایک", data: rows.map((r) => r.likes), lineColor: "rgba(244,63,94,1)", fillColor: "rgba(244,63,94,0.12)" },
                    { label: "کامنت", data: rows.map((r) => r.comments), lineColor: "rgba(6,182,212,1)", fillColor: "rgba(6,182,212,0.12)", fill: false },
                ],
            };
        },
        engagementViewsComparisonChart() {
            const dc = this.analytics.engagement_daily_comparison;
            if (!dc?.labels?.length) return { labels: [], datasets: [] };
            return {
                labels: dc.labels,
                datasets: [
                    { label: "بازدید — دوره فعلی", data: dc.current_views, lineColor: "rgba(59,130,246,1)", fillColor: "rgba(59,130,246,0.12)" },
                    { label: "بازدید — دوره قبل", data: dc.previous_views, lineColor: "rgba(156,163,175,1)", fillColor: "rgba(156,163,175,0.08)", fill: false },
                ],
            };
        },
        viewsByTypeChart() {
            const rows = this.analytics.views_by_type || [];
            return {
                labels: rows.map((r) => r.label),
                data: rows.map((r) => r.count),
                colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ef4444"],
            };
        },
        activityDistributionChart() {
            const d = this.analytics.activity_distribution;
            if (!d?.values?.length) return { labels: [], data: [], colors: [] };
            return {
                labels: d.labels || [],
                data: d.values || [],
                colors: d.colors || [],
            };
        },
        engagementTypeChart() {
            const rows = this.analytics.engagement_type_comparison || [];
            return {
                labels: rows.map((r) => r.label),
                datasets: [
                    { label: "بازدید", data: rows.map((r) => r.views), color: "rgba(59,130,246,0.85)", hoverColor: "rgba(59,130,246,1)" },
                    { label: "لایک", data: rows.map((r) => r.likes), color: "rgba(244,63,94,0.85)", hoverColor: "rgba(244,63,94,1)" },
                    { label: "نظر", data: rows.map((r) => r.comments), color: "rgba(6,182,212,0.85)", hoverColor: "rgba(6,182,212,1)" },
                ],
            };
        },
        viewsHourlyChart() {
            const rows = this.platform.views_by_hour || this.analytics.views_by_hour || [];
            return {
                labels: rows.map((r) => r.label),
                data: rows.map((r) => r.count),
            };
        },
        topViewedChart() {
            const rows = (this.platform.top_viewed || []).slice().reverse();
            return {
                labels: rows.map((r) => r.title),
                data: rows.map((r) => r.views_count),
            };
        },
        userStatusChart() {
            return {
                labels: ["فعال", "غیرفعال"],
                data: [this.platform.users?.active_accounts || 0, this.platform.users?.inactive_accounts || 0],
                colors: ["#10b981", "#ef4444"],
            };
        },
        volumeMixChart() {
            const mix = this.analytics.volume_mix;
            if (!mix?.values?.length) return { labels: [], data: [], colors: [] };
            return {
                labels: mix.labels || [],
                data: mix.values || [],
                colors: ["#3b82f6", "#f43f5e", "#06b6d4", "#8b5cf6"],
            };
        },
        paymentMethodsChart() {
            const labels = (this.payments.methods || []).map((m) => this.mapDriverName(m.driver));
            const data = (this.payments.methods || []).map((m) => m.total || 0);
            return {
                labels,
                data,
                colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
            };
        },
        paymentMethodsBarChart() {
            return {
                labels: this.paymentMethodsChart.labels,
                data: this.paymentMethodsChart.data,
            };
        },
        customersChart() {
            const n = this.insights.customers?.new || 0;
            const r = this.insights.customers?.returning || 0;
            return {
                labels: ["جدید", "بازگشتی"],
                data: [n, r],
                colors: ["#06b6d4", "#3b82f6"],
            };
        },
        paymentStatusesChart() {
            const s = this.payments.statuses || { paid: 0, pending: 0, expired: 0 };
            return {
                labels: ["پرداخت‌شده", "در انتظار", "منقضی‌شده"],
                data: [s.paid || 0, s.pending || 0, s.expired || 0],
                colors: ["#10b981", "#f59e0b", "#ef4444"],
            };
        },
        revenueByTypeChart() {
            const rows = this.payments.revenue_by_type || [];
            const mapTitle = { course: "دوره", path: "مسیر", vip: "پلن VIP", other: "سایر" };
            return {
                labels: rows.map((r) => mapTitle[r.type] || r.type),
                data: rows.map((r) => r.total || 0),
                colors: ["#60a5fa", "#34d399", "#fbbf24", "#c084fc"],
            };
        },
        revenueTypeComparisonChart() {
            const rows = this.analytics.revenue_type_comparison || [];
            return {
                labels: rows.map((r) => r.label),
                datasets: [
                    { label: "دوره فعلی", data: rows.map((r) => r.current), color: "rgba(34,197,94,0.85)", hoverColor: "rgba(34,197,94,1)" },
                    { label: "دوره قبل", data: rows.map((r) => r.previous), color: "rgba(156,163,175,0.65)", hoverColor: "rgba(156,163,175,0.9)" },
                ],
            };
        },
        salesWeekdayChart() {
            const rows = this.analytics.sales_by_weekday || [];
            return {
                labels: rows.map((r) => r.label),
                data: rows.map((r) => r.total),
            };
        },
        salesHourlyChart() {
            const rows = this.analytics.sales_by_hour || [];
            return {
                labels: rows.map((r) => r.label),
                data: rows.map((r) => r.count),
            };
        },
        registrationsWeekdayChart() {
            const rows = this.analytics.registrations_by_weekday || [];
            return {
                labels: rows.map((r) => r.label),
                data: rows.map((r) => r.count),
            };
        },
        dailyComparisonAmountChart() {
            const dc = this.analytics.daily_comparison;
            if (!dc?.labels?.length) return { labels: [], datasets: [] };
            return {
                labels: dc.labels,
                datasets: [
                    { label: "دوره فعلی", data: dc.current_amount, lineColor: "rgba(34,197,94,1)", fillColor: "rgba(34,197,94,0.12)" },
                    { label: "دوره قبل", data: dc.previous_amount, lineColor: "rgba(156,163,175,1)", fillColor: "rgba(156,163,175,0.08)", fill: false },
                ],
            };
        },
        dailyComparisonCountChart() {
            const dc = this.analytics.daily_comparison;
            if (!dc?.labels?.length) return { labels: [], datasets: [] };
            return {
                labels: dc.labels,
                datasets: [
                    { label: "دوره فعلی", data: dc.current_count, lineColor: "rgba(59,130,246,1)", fillColor: "rgba(59,130,246,0.12)" },
                    { label: "دوره قبل", data: dc.previous_count, lineColor: "rgba(156,163,175,1)", fillColor: "rgba(156,163,175,0.08)", fill: false },
                ],
            };
        },
        topProductsBarChart() {
            const courses = (this.insights.top_products.courses || []).slice(0, 5);
            const paths = (this.insights.top_products.paths || []).slice(0, 3);
            const plans = (this.insights.top_products.plans || []).slice(0, 3);
            const items = [...courses, ...paths, ...plans].slice().reverse();
            return {
                labels: items.map((i) => i.title),
                data: items.map((i) => i.total),
            };
        },
    },
    methods: {
        async fetchStats() {
            try {
                this.loading = true;
                this.fetchError = "";
                const params = {
                    date_from: this.filters.date_from,
                    date_to: this.filters.date_to,
                    group_by: this.filters.group_by,
                };
                const { data } = await axiosInstance.get("/admin/dashboard/stats", { params });
                if (data && data.message === "Success") {
                    this.period = data.period || this.period;
                    this.filters.group_by = this.period.group_by || this.filters.group_by;
                    if (data.users) this.mergeSection("users", data.users);
                    if (data.comments) this.mergeSection("comments", data.comments);
                    if (data.courses) this.courses = data.courses;
                    if (data.payments) this.mergeSection("payments", data.payments);
                    if (data.insights) this.mergeSection("insights", data.insights);
                    if (data.platform) this.platform = { ...this.platform, ...data.platform };
                    if (data.comparison) this.comparison = data.comparison;
                    if (data.analytics) this.analytics = { ...this.analytics, ...data.analytics };
                    if (data.capabilities) this.capabilities = { ...this.capabilities, ...data.capabilities };
                    this.settlement = data.settlement || null;
                    if (!this.visibleDashboardTabs.some((tab) => tab.id === this.selectedTab)) {
                        this.selectedTab = this.visibleDashboardTabs[0]?.id || 'overview';
                    }
                    this.hasLoaded = true;
                }
            } catch (e) {
                console.error("Error fetching dashboard stats:", e);
                this.fetchError = "خطا در بارگذاری آمار داشبورد. لطفاً دوباره تلاش کنید.";
            } finally {
                this.loading = false;
            }
        },
        mergeSection(key, incoming) {
            const current = this[key];
            if (key === "insights" || key === "payments") {
                Object.keys(incoming).forEach((k) => {
                    if (incoming[k] !== null && typeof incoming[k] === "object" && !Array.isArray(incoming[k])) {
                        current[k] = { ...(current[k] || {}), ...incoming[k] };
                    } else {
                        current[k] = incoming[k];
                    }
                });
            } else if (key === "users" || key === "comments") {
                Object.assign(current, incoming);
                if (incoming.daily) {
                    current.daily = {
                        labels: incoming.daily.labels || [],
                        data: incoming.daily.data || [],
                    };
                }
            }
        },
        applyPreset(preset) {
            const now = new Date();
            if (preset.isYtd) {
                const startYear = new Date(now.getFullYear(), 0, 1);
                this.filters.date_from = this.formatDateInput(startYear);
                this.filters.date_to = this.formatDateInput(now);
            } else {
                this.filters.date_from = this.formatDateInput(this.shiftDays(now, -(preset.days || 0)));
                this.filters.date_to = this.formatDateInput(now);
            }
            this.datePresets.forEach((p) => (p.active = p.slug === preset.slug));
            this.applyFilters();
        },
        applyFilters() {
            if (!this.filters.date_from || !this.filters.date_to) {
                const now = new Date();
                this.filters.date_to = this.filters.date_to || this.formatDateInput(now);
                this.filters.date_from = this.filters.date_from || this.formatDateInput(this.shiftDays(now, -30));
            }
            this.fetchStats();
        },
        refresh() {
            this.fetchStats();
        },
        shiftDays(date, days) {
            const d = new Date(date);
            d.setDate(d.getDate() + days);
            return d;
        },
        formatDateInput(date) {
            const d = new Date(date);
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${d.getFullYear()}-${m}-${day}`;
        },
        formatDateShort(dateStr) {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return d.toLocaleDateString("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" });
        },
        formatNumber(n) {
            if (n === null || n === undefined) return "۰";
            return new Intl.NumberFormat("fa-IR").format(n);
        },
        formatCurrency(amount) {
            if (!amount && amount !== 0) return "۰";
            return new Intl.NumberFormat("fa-IR").format(amount);
        },
        formatRatio(value) {
            if (value === null || value === undefined) return "۰";
            return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(value);
        },
        formatDate(dateString) {
            if (!dateString) return "—";
            const date = new Date(dateString);
            return date.toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
        mapDriverName(driver) {
            if (!driver) return "نامشخص";
            const map = {
                zarinpal: "زرین‌پال",
                digipay: "دیجی‌پی",
                zibal: "زیبال",
                payir: "پی‌آی‌آر",
                idpay: "آیدی‌پی",
                nextpay: "نکست‌پی",
                manual: "دستی",
                wallet: "کیف پول",
                admin: "ادمین",
            };
            return map[driver] || driver;
        },
    },
    mounted() {
        const defaultPreset = this.datePresets.find((p) => p.slug === "30d");
        if (defaultPreset) this.applyPreset(defaultPreset);
    },
};
</script>
