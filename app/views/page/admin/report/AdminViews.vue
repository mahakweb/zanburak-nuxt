<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button @click="refreshAll" :disabled="loading || listLoading || refreshing"
                class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 disabled:opacity-60 disabled:cursor-not-allowed">
                <span class="flex items-center">
                    {{ refreshing ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی آمار' }}
                    <svg class="w-5 h-5 rtl:ms-1 -mt-0.5" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <rect x="0" y="0" width="24" height="24"></rect>
                            <path
                                d="M12,8 L8,8 C5.790861,8 4,9.790861 4,12 L4,13 C4,14.6568542 5.34314575,16 7,16 L7,18 C4.23857625,18 2,15.7614237 2,13 L2,12 C2,8.6862915 4.6862915,6 8,6 L12,6 L12,4.72799742 C12,4.62015048 12.0348702,4.51519416 12.0994077,4.42878885 C12.264656,4.2075478 12.5779675,4.16215674 12.7992086,4.32740507 L15.656242,6.46136716 C15.6951359,6.49041758 15.7295917,6.52497737 15.7585249,6.56395854 C15.9231063,6.78569617 15.876772,7.09886961 15.6550344,7.263451 L12.798001,9.3840407 C12.7118152,9.44801079 12.607332,9.48254921 12.5,9.48254921 C12.2238576,9.48254921 12,9.25869158 12,8.98254921 L12,8 Z"
                                fill="currentColor"></path>
                            <path
                                d="M12.0583175,16 L16,16 C18.209139,16 20,14.209139 20,12 L20,11 C20,9.34314575 18.6568542,8 17,8 L17,6 C19.7614237,6 22,8.23857625 22,11 L22,12 C22,15.3137085 19.3137085,18 16,18 L12.0583175,18 L12.0583175,18.9825492 C12.0583175,19.2586916 11.8344599,19.4825492 11.5583175,19.4825492 C11.4509855,19.4825492 11.3465023,19.4480108 11.2603165,19.3840407 L8.40328311,17.263451 C8.18154548,17.0988696 8.13521119,16.7856962 8.29979258,16.5639585 C8.32872576,16.5249774 8.36318164,16.4904176 8.40207551,16.4613672 L11.2591089,14.3274051 C11.48035,14.1621567 11.7936615,14.2075478 11.9589099,14.4287888 C12.0234473,14.5151942 12.0583175,14.6201505 12.0583175,14.7279974 L12.0583175,16 Z"
                                fill="currentColor" opacity="0.3"></path>
                        </g>
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
                <span v-if="stats" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatNumber(stats.all_time_views) }} بازدید کل • {{ formatNumber(stats.today_views) }} امروز
                    <span v-if="stats.countries_count"> • {{ formatNumber(stats.countries_count) }} کشور</span>
                </span>
            </div>

            <div v-if="fetchError"
                class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {{ fetchError }}
            </div>

            <!-- Date presets -->
            <div
                class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-3 mb-4 shadow-sm">
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
            <div
                class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-4 mb-6 shadow-sm">
                <div class="flex flex-wrap items-end gap-4">
                    <div class="flex-1 min-w-[140px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">از تاریخ</label>
                        <input type="date" v-model="dateFrom" @change="applyFilters"
                            class="w-full h-8 px-3 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none">
                    </div>
                    <div class="flex-1 min-w-[140px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">تا تاریخ</label>
                        <input type="date" v-model="dateTo" @change="applyFilters"
                            class="w-full h-8 px-3 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none">
                    </div>
                    <div class="flex-1 min-w-[130px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">نوع محتوا</label>
                        <Listbox v-model="selectedContentType" v-slot="{ open }" as="div">
                            <div class="relative">
                                <ListboxButton
                                    class="w-full h-8 px-3 text-start text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                                    {{ selectedContentType.title }}</ListboxButton>
                                <ListboxOptions v-if="open"
                                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                                    <ListboxOption v-for="type in contentTypes" :key="type.slug" :value="type"
                                        class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {{
                                        type.title }}</ListboxOption>
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>
                    <div class="flex-1 min-w-[130px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">بازدیدکننده</label>
                        <Listbox v-model="selectedUserType" v-slot="{ open }" as="div">
                            <div class="relative">
                                <ListboxButton
                                    class="w-full h-8 px-3 text-start text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                                    {{ selectedUserType.title }}</ListboxButton>
                                <ListboxOptions v-if="open"
                                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                                    <ListboxOption v-for="type in userTypes" :key="type.slug" :value="type"
                                        class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {{
                                        type.title }}</ListboxOption>
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>
                    <button @click="clearFilters"
                        class="h-8 px-4 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">پاک
                        کردن</button>
                </div>
            </div>

            <!-- Tabs -->
            <div
                class="mb-6 p-2 md:p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
                <TabGroup>
                    <TabList
                        class="whitespace-nowrap p-1.5 flex items-center gap-1 overflow-x-auto bg-gray-100/70 dark:bg-gray-800 rounded-xl">
                        <Tab v-for="tab in tabs" :key="tab.id" as="div">
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
                            <div v-if="loading && !stats" class="py-16 text-center text-sm text-gray-500">در حال
                                بارگذاری...
                            </div>
                            <div v-else-if="!stats" class="py-16 text-center text-sm text-gray-500">آماری برای نمایش
                                وجود ندارد.
                            </div>
                            <div v-else class="space-y-6">
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                                    <AdminReportStatCard icon="eye" title="بازدید در بازه" :value="formatNumber(stats.total_views)"
                                        :subtitle="'میانگین روزانه: ' + formatNumber(avgDailyViews)" accent="amber"
                                        :trend="stats.trend" />
                                    <AdminReportStatCard icon="clock" title="امروز" :value="formatNumber(stats.today_views)"
                                        :subtitle="formatNumber(stats.week_views) + ' در ۷ روز'" accent="blue" />
                                    <AdminReportStatCard icon="users" title="کاربران یکتا" :value="formatNumber(stats.unique_users)"
                                        :subtitle="formatNumber(stats.authenticated_views) + ' با ورود'"
                                        accent="violet" />
                                    <AdminReportStatCard icon="users" title="مهمان" :value="formatNumber(stats.guest_views)"
                                        :subtitle="formatNumber(stats.unique_ips) + ' IP'" accent="cyan" />
                                    <AdminReportStatCard icon="globe" title="کشورها" :value="formatNumber(stats.countries_count)"
                                        :subtitle="formatNumber(stats.cities_count) + ' شهر'" accent="emerald" />
                                    <AdminReportStatCard icon="eye" title="کل بازدیدها" :value="formatNumber(stats.all_time_views)"
                                        subtitle="از ابتدا" accent="rose" />
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <AdminReportChartCard class="lg:col-span-2" title="روند بازدید روزانه"
                                        subtitle="تعداد بازدید در هر روز">
                                        <AreaChart class="h-72" :rawData="dailyChartData" :showLegend="false"
                                            lineColor="rgba(245,158,11,1)" fillColor="rgba(245,158,11,0.2)" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard v-if="stats.by_type?.length" title="بر اساس نوع محتوا">
                                        <DoughnutChart class="h-72"
                                            :rawData="{ labels: stats.by_type.map(t => t.label), data: stats.by_type.map(t => t.count), colors: ['#8b5cf6', '#f59e0b', '#06b6d4', '#10b981', '#ec4899'] }"
                                            :legendPosition="'bottom'" />
                                    </AdminReportChartCard>
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <AdminReportChartCard title="پربازدیدترین محتوا"
                                        subtitle="۱۵ مورد برتر — نمودار میله‌ای">
                                        <AdminBarChart v-if="topContentChart.labels.length" class="h-80"
                                            :rawData="topContentChart" :horizontal="true"
                                            :colors="topContentChartColors" barColor="rgba(139,92,246,0.85)" />
                                        <p v-else class="text-sm text-gray-500 text-center py-8">داده‌ای نیست</p>
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="بازدید ساعتی" subtitle="توزیع بر اساس ساعت روز">
                                        <AdminBarChart v-if="hourlyChart.labels.length" class="h-80"
                                            :rawData="hourlyChart" barColor="rgba(139,92,246,0.75)"
                                            hoverColor="rgba(139,92,246,1)" />
                                    </AdminReportChartCard>
                                </div>

                                <AdminReportChartCard v-if="stats.by_weekday?.length" title="بازدید بر اساس روز هفته">
                                    <AdminBarChart class="h-56" :rawData="weekdayChart" barColor="rgba(6,182,212,0.8)"
                                        hoverColor="rgba(6,182,212,1)" />
                                </AdminReportChartCard>
                            </div>
                        </TabPanel>

                        <!-- Comparison -->
                        <TabPanel v-if="selectedTab === 'compare'">
                            <div v-if="loading && !stats" class="py-16 text-center text-sm text-gray-500">در حال
                                بارگذاری...
                            </div>
                            <div v-else-if="stats?.comparison" class="space-y-6">
                                <AdminReportChartCard title="مقایسه با دوره قبل"
                                    subtitle="تغییرات نسبت به بازه زمانی معادل قبل از دوره انتخاب‌شده">
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                                        <AdminReportComparisonCard label="کل بازدیدها"
                                            :current="formatNumber(stats.comparison.total_views.current)"
                                            :previous="formatNumber(stats.comparison.total_views.previous)"
                                            :change="stats.comparison.total_views.change"
                                            :change-percent="stats.comparison.total_views.change_percent" />
                                        <AdminReportComparisonCard label="بازدید مهمان"
                                            :current="formatNumber(stats.comparison.guest_views.current)"
                                            :previous="formatNumber(stats.comparison.guest_views.previous)"
                                            :change="stats.comparison.guest_views.change"
                                            :change-percent="stats.comparison.guest_views.change_percent" />
                                        <AdminReportComparisonCard label="کاربر واردشده"
                                            :current="formatNumber(stats.comparison.authenticated_views.current)"
                                            :previous="formatNumber(stats.comparison.authenticated_views.previous)"
                                            :change="stats.comparison.authenticated_views.change"
                                            :change-percent="stats.comparison.authenticated_views.change_percent" />
                                        <AdminReportComparisonCard label="کاربران یکتا"
                                            :current="formatNumber(stats.comparison.unique_users.current)"
                                            :previous="formatNumber(stats.comparison.unique_users.previous)"
                                            :change="stats.comparison.unique_users.change"
                                            :change-percent="stats.comparison.unique_users.change_percent" />
                                        <AdminReportComparisonCard label="IP یکتا"
                                            :current="formatNumber(stats.comparison.unique_ips.current)"
                                            :previous="formatNumber(stats.comparison.unique_ips.previous)"
                                            :change="stats.comparison.unique_ips.change"
                                            :change-percent="stats.comparison.unique_ips.change_percent" />
                                    </div>
                                </AdminReportChartCard>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <AdminReportChartCard title="روند روزانه — مقایسه‌ای"
                                        subtitle="بازدید روزانه: دوره فعلی در برابر دوره قبل">
                                        <ComparisonLineChart v-if="dailyComparisonChart.labels.length" class="h-72"
                                            :labels="dailyComparisonChart.labels"
                                            :datasets="dailyComparisonChart.datasets" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="مهمان vs کاربر"
                                        subtitle="مقایسه نوع بازدیدکننده در دو دوره">
                                        <ComparisonBarChart v-if="visitorComparisonChart.labels.length" class="h-72"
                                            :labels="visitorComparisonChart.labels"
                                            :datasets="visitorComparisonChart.datasets" />
                                    </AdminReportChartCard>
                                </div>

                                <AdminReportChartCard title="بازدید بر اساس نوع محتوا — مقایسه‌ای"
                                    subtitle="دوره، قسمت، پرسش و مسیر: فعلی در برابر قبل">
                                    <ComparisonBarChart v-if="typeComparisonChart.labels.length" class="h-72"
                                        :labels="typeComparisonChart.labels" :datasets="typeComparisonChart.datasets" />
                                </AdminReportChartCard>
                            </div>
                        </TabPanel>

                        <!-- Geo -->
                        <TabPanel v-if="selectedTab === 'geo'">
                            <div v-if="loading && !stats" class="py-16 text-center text-sm text-gray-500">در حال
                                بارگذاری
                                موقعیت‌ها...</div>
                            <div v-else-if="stats?.geo" class="space-y-6">
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <AdminReportChartCard title="بازدید بر اساس کشور" subtitle="توزیع جغرافیایی">
                                        <AdminBarChart v-if="countryChart.labels.length" class="h-72"
                                            :rawData="countryChart" :horizontal="true"
                                            barColor="rgba(16,185,129,0.85)" />
                                        <p v-else class="text-sm text-gray-500 text-center py-8">داده‌ای نیست</p>
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="شهرهای برتر" subtitle="پربازدیدترین شهرها">
                                        <AdminBarChart v-if="cityChart.labels.length" class="h-72" :rawData="cityChart"
                                            :horizontal="true" barColor="rgba(59,130,246,0.85)" />
                                        <p v-else class="text-sm text-gray-500 text-center py-8">داده‌ای نیست</p>
                                    </AdminReportChartCard>
                                </div>

                                <AdminReportChartCard title="IPهای پربازدید"
                                    subtitle="با جزئیات موقعیت، ISP و timezone">
                                    <div v-if="stats.geo.top_ips?.length" class="overflow-x-auto">
                                        <table class="min-w-full text-xs">
                                            <thead>
                                                <tr class="text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                                    <th class="py-2 px-2 text-start">IP</th>
                                                    <th class="py-2 px-2 text-start">موقعیت</th>
                                                    <th class="py-2 px-2 text-start">ISP</th>
                                                    <th class="py-2 px-2 text-start">Timezone</th>
                                                    <th class="py-2 px-2 text-start">بازدید</th>
                                                    <th class="py-2 px-2 text-start">برچسب</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="row in stats.geo.top_ips" :key="row.ip"
                                                    class="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer"
                                                    @click="openIpModal(row.ip, row.geo)">
                                                    <td class="py-2.5 px-2 font-mono" dir="ltr">{{ row.ip }}</td>
                                                    <td class="py-2.5 px-2">{{ row.geo?.location_label || '—' }}</td>
                                                    <td class="py-2.5 px-2 truncate max-w-[140px]">{{ row.geo?.isp ||
                                                        '—' }}
                                                    </td>
                                                    <td class="py-2.5 px-2" dir="ltr">{{ row.geo?.timezone || '—' }}
                                                    </td>
                                                    <td class="py-2.5 px-2 font-bold text-amber-600 font-anjoman">{{
                                                        formatNumber(row.views_count) }}</td>
                                                    <td class="py-2.5 px-2">
                                                        <span v-if="row.geo?.is_proxy"
                                                            class="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px]">پروکسی</span>
                                                        <span v-if="row.geo?.is_hosting"
                                                            class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] ms-1">هاست</span>
                                                        <span v-if="row.geo?.is_mobile"
                                                            class="px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 text-[10px] ms-1">موبایل</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p v-else class="text-sm text-gray-500 text-center py-8">IP یافت نشد</p>
                                </AdminReportChartCard>
                            </div>
                        </TabPanel>

                        <!-- Devices -->
                        <TabPanel v-if="selectedTab === 'devices'">
                            <div v-if="loading && !stats" class="py-16 text-center text-sm text-gray-500">در حال
                                بارگذاری...
                            </div>
                            <div v-else-if="stats?.devices" class="space-y-6">
                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <AdminReportChartCard title="نوع دستگاه">
                                        <DoughnutChart v-if="stats.devices.by_device_type?.length" class="h-64"
                                            :rawData="{ labels: stats.devices.by_device_type.map(d => d.label), data: stats.devices.by_device_type.map(d => d.count), colors: ['#8b5cf6', '#f59e0b', '#06b6d4', '#9ca3af'] }"
                                            :legendPosition="'bottom'" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="مرورگرها" class="lg:col-span-2">
                                        <AdminBarChart v-if="browserChart.labels.length" class="h-64"
                                            :rawData="browserChart" barColor="rgba(245,158,11,0.85)" />
                                    </AdminReportChartCard>
                                </div>
                                <AdminReportChartCard title="سیستم‌عامل">
                                    <AdminBarChart v-if="platformChart.labels.length" class="h-56"
                                        :rawData="platformChart" barColor="rgba(99,102,241,0.85)" />
                                </AdminReportChartCard>
                            </div>
                        </TabPanel>

                        <!-- List -->
                        <TabPanel v-if="selectedTab === 'list'">
                            <div class="mb-4 flex flex-wrap gap-3">
                                <div class="relative flex-1 min-w-[200px] max-w-sm">
                                    <input type="text" v-model="searchQuery" @input="handleSearch"
                                        placeholder="جستجو IP، کاربر، شهر..."
                                        class="w-full h-8 ps-3 pe-3 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none" />
                                </div>
                            </div>

                            <div class="overflow-x-auto">
                                <table
                                    class="min-w-full text-sm rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead
                                        class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-3 py-3">محتوا</th>
                                            <th class="px-3 py-3">نوع</th>
                                            <th class="px-3 py-3">کاربر</th>
                                            <th class="px-3 py-3">IP / موقعیت</th>
                                            <th class="px-3 py-3">دستگاه</th>
                                            <th class="px-3 py-3">تاریخ</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <template v-if="listLoading">
                                            <tr v-for="n in 5" :key="'sk-' + n" class="animate-pulse">
                                                <td colspan="6" class="px-3 py-4">
                                                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                                </td>
                                            </tr>
                                        </template>
                                        <tr v-else-if="!views.length">
                                            <td colspan="6" class="px-3 py-12 text-center text-gray-500">بازدیدی یافت
                                                نشد</td>
                                        </tr>
                                        <tr v-else v-for="view in views" :key="view.id"
                                            class="bg-white dark:bg-gray-900 hover:bg-gray-50/80 dark:hover:bg-gray-800/60">
                                            <td class="px-3 py-3">
                                                <p class="text-xs font-semibold truncate max-w-[180px]">{{
                                                    view.content?.title
                                                    || '—' }}</p>
                                            </td>
                                            <td class="px-3 py-3"><span
                                                    class="px-2 py-0.5 text-[11px] font-semibold rounded-md"
                                                    :class="typeBadgeClass(view.viewable_type)">{{
                                                    view.viewable_type_label
                                                    }}</span></td>
                                            <td class="px-3 py-3">
                                                <span v-if="view.user" class="text-xs">@{{ view.user.username }}</span>
                                                <span v-else class="text-xs text-gray-500">مهمان</span>
                                            </td>
                                            <td class="px-3 py-3">
                                                <button @click="openIpModal(view.ip_address, view.geo)"
                                                    class="text-start group">
                                                    <p class="text-xs font-mono text-blue-600 dark:text-blue-400 group-hover:underline"
                                                        dir="ltr">{{ view.ip_address || '—' }}</p>
                                                    <p class="text-[11px] text-gray-500 mt-0.5">{{
                                                        view.geo?.location_label ||
                                                        '—' }}</p>
                                                </button>
                                            </td>
                                            <td class="px-3 py-3">
                                                <p class="text-[11px] text-gray-600 dark:text-gray-400">{{
                                                    view.device?.device_label || '—' }}</p>
                                            </td>
                                            <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{
                                                formatDate(view.created_at) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div v-if="pagination?.last_page > 1"
                                class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <p class="text-xs text-gray-500">{{ pagination.from }}–{{ pagination.to }} از {{
                                    formatNumber(pagination.total) }}</p>
                                <div class="flex gap-1">
                                    <button @click="goToPage(pagination.current_page - 1)"
                                        :disabled="pagination.current_page <= 1"
                                        class="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-40">قبلی</button>
                                    <button @click="goToPage(pagination.current_page + 1)"
                                        :disabled="pagination.current_page >= pagination.last_page"
                                        class="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-40">بعدی</button>
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>

        <!-- IP Detail Bottom Sheet -->
        <BottomSheetDrawer v-model="ipModalOpen" :initialHeight="0.7" :maxHeight="0.85" :minHeight="0.6"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[28rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 flex flex-col flex-1 min-h-0 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="shrink-0 pb-3 border-b border-gray-100 dark:border-gray-800">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 21C16.4183 21 20 16.9706 20 12C20 7.02944 16.4183 3 12 3C7.58172 3 4 7.02944 4 12C4 16.9706 7.58172 21 12 21Z"
                            stroke="currentColor" stroke-width="1.5" />
                        <path d="M12 11V7M12 15H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    جزئیات IP
                </h3>
            </div>

            <div v-if="selectedIpGeo" class="space-y-3 text-xs pt-3">
                <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 font-mono text-sm text-center" dir="ltr">{{
                    selectedIpGeo.ip }}</div>
                <div class="grid grid-cols-2 gap-2">
                    <div v-for="item in ipDetailRows" :key="item.label"
                        class="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                        <p class="text-gray-500 mb-0.5">{{ item.label }}</p>
                        <p class="font-semibold text-gray-900 dark:text-white break-all">{{ item.value || '—' }}</p>
                    </div>
                </div>
                <div v-if="selectedIpGeo.latitude && selectedIpGeo.longitude" class="pt-2">
                    <a :href="'https://www.google.com/maps?q=' + selectedIpGeo.latitude + ',' + selectedIpGeo.longitude"
                        target="_blank"
                        class="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs font-semibold">
                        مشاهده روی نقشه
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" />
                        </svg>
                    </a>
                </div>
            </div>
            <div v-else class="py-6 text-center text-sm text-gray-500">در حال دریافت اطلاعات...</div>

            <button @click="ipModalOpen = false"
                class="mt-4 shrink-0 w-full h-9 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">بستن</button>
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>

<script>
import { TabGroup, TabList, Tab, TabPanels, TabPanel, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import AreaChart from "@/views/components/chart/AreaChart.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
import ComparisonBarChart from "@/views/components/chart/ComparisonBarChart.vue";
import AdminReportComparisonCard from "@/views/components/admin/report/AdminReportComparisonCard.vue";
import axiosInstance from "@/store/axiosInstance";

const BAR_COLORS = ['#8b5cf6', '#f59e0b', '#06b6d4', '#10b981', '#ef4444', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#a855f7', '#0ea5e9', '#d946ef', '#22c55e', '#eab308'];

function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

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
            loading: false, listLoading: false, refreshing: false, fetchError: null,
            stats: null, views: [], pagination: null,
            selectedTab: "stats", dateFrom: formatLocalDate(monthAgo), dateTo: formatLocalDate(today),
            searchQuery: "", searchTimeout: null, currentPage: 1, datePresets: [],
            ipModalOpen: false, selectedIpGeo: null,
            tabs: [
                { id: "stats", label: "آمار و نمودارها" },
                { id: "compare", label: "مقایسه دوره‌ها" },
                { id: "geo", label: "موقعیت جغرافیایی" },
                { id: "devices", label: "دستگاه و مرورگر" },
                { id: "list", label: "فهرست بازدیدها" },
            ],
            contentTypes: [
                { slug: "all", title: "همه" }, { slug: "Course", title: "دوره" },
                { slug: "Episode", title: "قسمت" }, { slug: "Question", title: "پرسش" },
                { slug: "Path", title: "مسیر" },
                { slug: "User", title: "پروفایل" },
            ],
            selectedContentType: { slug: "all", title: "همه" },
            userTypes: [
                { slug: "all", title: "همه" }, { slug: "authenticated", title: "واردشده" }, { slug: "guest", title: "مهمان" },
            ],
            selectedUserType: { slug: "all", title: "همه" },
        };
    },
    computed: {
        statsPeriodLabel() {
            if (!this.dateFrom || !this.dateTo) return "";
            return `${this.formatDateShort(this.dateFrom)} تا ${this.formatDateShort(this.dateTo)}`;
        },
        avgDailyViews() {
            if (!this.stats?.daily_views?.length) return 0;
            return Math.round(this.stats.daily_views.reduce((s, d) => s + d.count, 0) / this.stats.daily_views.length);
        },
        dailyChartData() {
            return {
                labels: (this.stats?.daily_views || []).map(d => d.date),
                data: (this.stats?.daily_views || []).map(d => d.count),
            };
        },
        hourlyChart() {
            return {
                labels: (this.stats?.hourly_views || []).map(h => h.label),
                data: (this.stats?.hourly_views || []).map(h => h.count),
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
                data: items.map(i => i.views_count),
            };
        },
        topContentChartColors() {
            return this.topContentChart.data.map((_, i) => BAR_COLORS[i % BAR_COLORS.length]);
        },
        countryChart() {
            const items = (this.stats?.geo?.by_country || []).slice().reverse();
            return { labels: items.map(c => c.country), data: items.map(c => c.count) };
        },
        cityChart() {
            const items = (this.stats?.geo?.by_city || []).slice().reverse();
            return { labels: items.map(c => c.label), data: items.map(c => c.count) };
        },
        browserChart() {
            return {
                labels: (this.stats?.devices?.by_browser || []).map(b => b.label),
                data: (this.stats?.devices?.by_browser || []).map(b => b.count),
            };
        },
        platformChart() {
            return {
                labels: (this.stats?.devices?.by_platform || []).map(p => p.label),
                data: (this.stats?.devices?.by_platform || []).map(p => p.count),
            };
        },
        dailyComparisonChart() {
            const dc = this.stats?.daily_comparison;
            if (!dc) return { labels: [], datasets: [] };
            return {
                labels: dc.labels || [],
                datasets: [
                    {
                        label: 'دوره فعلی',
                        data: dc.current || [],
                        lineColor: 'rgba(245, 158, 11, 1)',
                        fillColor: 'rgba(245, 158, 11, 0.15)',
                    },
                    {
                        label: 'دوره قبل',
                        data: dc.previous || [],
                        lineColor: 'rgba(107, 114, 128, 0.9)',
                        fillColor: 'rgba(107, 114, 128, 0.08)',
                        fill: false,
                    },
                ],
            };
        },
        visitorComparisonChart() {
            const vc = this.stats?.visitor_comparison;
            if (!vc) return { labels: [], datasets: [] };
            return {
                labels: vc.labels || [],
                datasets: [
                    { label: 'دوره فعلی', data: vc.current || [], color: 'rgba(245, 158, 11, 0.85)', hoverColor: 'rgba(245, 158, 11, 1)' },
                    { label: 'دوره قبل', data: vc.previous || [], color: 'rgba(156, 163, 175, 0.75)', hoverColor: 'rgba(107, 114, 128, 1)' },
                ],
            };
        },
        typeComparisonChart() {
            const tc = this.stats?.by_type_comparison;
            if (!tc) return { labels: [], datasets: [] };
            return {
                labels: tc.labels || [],
                datasets: [
                    { label: 'دوره فعلی', data: tc.current || [], color: 'rgba(139, 92, 246, 0.85)', hoverColor: 'rgba(139, 92, 246, 1)' },
                    { label: 'دوره قبل', data: tc.previous || [], color: 'rgba(156, 163, 175, 0.75)', hoverColor: 'rgba(107, 114, 128, 1)' },
                ],
            };
        },
        ipDetailRows() {
            const g = this.selectedIpGeo;
            if (!g) return [];
            return [
                { label: 'کشور', value: g.country },
                { label: 'شهر', value: g.city },
                { label: 'منطقه', value: g.region },
                { label: 'کد کشور', value: g.country_code },
                { label: 'ISP', value: g.isp },
                { label: 'سازمان', value: g.org },
                { label: 'Timezone', value: g.timezone },
                { label: 'AS', value: g.as },
            ];
        },
    },
    watch: {
        selectedContentType() { this.applyFilters(); },
        selectedUserType() { this.applyFilters(); },
    },
    methods: {
        switchTab(tab) {
            this.selectedTab = tab;
            if (tab === 'list') this.fetchViews(this.currentPage || 1);
        },
        formatLocalDate(date) {
            return formatLocalDate(date);
        },
        initDatePresets() {
            const fmt = (d) => this.formatLocalDate(d);
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
            if (this.selectedContentType.slug !== "all") params.viewable_type = this.selectedContentType.slug;
            if (this.selectedUserType.slug !== "all") params.user_type = this.selectedUserType.slug;
            return params;
        },
        async fetchStats() {
            try {
                this.loading = true;
                this.fetchError = null;
                const { data } = await axiosInstance.get("/admin/views/stats", { params: this.buildParams() });
                if (data?.message === "Success") {
                    this.stats = data.stats;
                } else {
                    this.fetchError = "پاسخ نامعتبر از سرور دریافت شد.";
                }
            } catch (e) {
                console.error("Error fetching view stats:", e);
                this.fetchError = "خطا در دریافت آمار بازدید. لطفاً دوباره تلاش کنید.";
            } finally {
                this.loading = false;
            }
        },
        async fetchViews(page = 1) {
            try {
                this.listLoading = true;
                this.fetchError = null;
                this.currentPage = page;
                const params = { ...this.buildParams(), page, perPage: 20 };
                if (this.searchQuery) params.search = this.searchQuery;
                const { data } = await axiosInstance.post("/admin/views", params);
                if (data?.message === "Success") {
                    this.views = data.views || [];
                    this.pagination = data.pagination;
                } else {
                    this.fetchError = "پاسخ نامعتبر از سرور دریافت شد.";
                }
            } catch (e) {
                console.error("Error fetching views:", e);
                this.fetchError = "خطا در دریافت فهرست بازدیدها. لطفاً دوباره تلاش کنید.";
            } finally {
                this.listLoading = false;
            }
        },
        applyFilters() {
            this.fetchStats();
            if (this.selectedTab === "list") this.fetchViews(1);
        },
        clearFilters() {
            const today = new Date(), monthAgo = new Date();
            monthAgo.setDate(today.getDate() - 30);
            this.dateFrom = this.formatLocalDate(monthAgo);
            this.dateTo = this.formatLocalDate(today);
            this.selectedContentType = this.contentTypes[0];
            this.selectedUserType = this.userTypes[0];
            this.searchQuery = "";
            this.datePresets.forEach((p) => { p.active = p.slug === "30d"; });
            this.applyFilters();
        },
        async refreshAll() {
            this.refreshing = true;
            this.fetchError = null;
            try {
                await this.fetchStats();
                if (this.selectedTab === "list") {
                    await this.fetchViews(this.currentPage || 1);
                }
            } finally {
                this.refreshing = false;
            }
        },
        handleSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                if (this.selectedTab === "list") this.fetchViews(1);
            }, 400);
        },
        goToPage(page) {
            if (page < 1 || (this.pagination && page > this.pagination.last_page)) return;
            this.fetchViews(page);
        },
        async openIpModal(ip, geo) {
            if (!ip) return;
            this.selectedIpGeo = geo || { ip };
            this.ipModalOpen = true;
            if (!geo || !geo.country) {
                try {
                    const { data } = await axiosInstance.get("/admin/views/ip-info", { params: { ip } });
                    if (data?.geo) this.selectedIpGeo = data.geo;
                } catch (e) {
                    console.error("IP lookup failed:", e);
                }
            }
        },
        formatNumber(n) { return Number(n || 0).toLocaleString("fa-IR"); },
        formatDate(d) {
            if (!d) return "—";
            return new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
        },
        formatDateShort(d) {
            if (!d) return "";
            return new Date(d).toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
        },
        typeBadgeClass(type) {
            return { Course: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300", Episode: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", Question: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300", Path: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", User: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" }[type] || "bg-gray-100 text-gray-700";
        },
    },
    mounted() {
        this.initDatePresets();
        this.fetchStats();
    },
};
</script>
