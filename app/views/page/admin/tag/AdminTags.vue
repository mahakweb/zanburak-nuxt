<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button @click.prevent="openCreateModal"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        افزودن تگ
                        <svg class="w-5 h-5 ms-2" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </span>
                </span>
            </button>
            <button @click.prevent="openMergeModal"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">ادغام تگ‌ها</span>
            </button>
            <router-link :to="{ name: 'admin-questions' }"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">سوالات</span>
            </router-link>
            <button @click="refreshData"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">بروزرسانی</span>
            </button>
        </template>

        <div class="min-w-0">
            <!-- Stats -->
            <div v-if="stats" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-5">
                <AdminReportStatCard title="کل تگ‌ها" :value="formatNumber(stats.total_tags)" accent="amber">
                    <template #icon>
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="با سوال" :value="formatNumber(stats.tags_with_questions)" accent="blue" />
                <AdminReportStatCard title="با دوره" :value="formatNumber(stats.tags_with_courses)" accent="violet" />
                <AdminReportStatCard title="با مقاله" :value="formatNumber(stats.tags_with_articles)" accent="emerald" />
                <AdminReportStatCard title="بدون محتوا" :value="formatNumber(stats.empty_tags)" accent="rose" subtitle="تگ خالی" />
                <AdminReportStatCard title="دنبال‌کننده" :value="formatNumber(stats.total_followers)" accent="cyan" />
                <AdminReportStatCard title="این ماه" :value="formatNumber(stats.created_this_month)" accent="emerald" />
                <AdminReportStatCard title="امروز" :value="formatNumber(stats.created_today)" accent="amber" subtitle="تگ جدید" />
            </div>

            <!-- Report tabs (charts, rankings, list) -->
            <div class="mb-6 p-2 md:p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
                <TabGroup>
                    <TabList class="whitespace-nowrap p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-hide bg-gray-100/70 dark:bg-gray-800 rounded-xl">
                        <Tab v-for="tab in reportTabs" :key="tab.id" as="div">
                            <button type="button" @click.prevent="selectedReportTab = tab.id"
                                class="shrink-0 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                                :class="reportTabButtonClass(tab.id)">
                                {{ tab.label }}
                            </button>
                        </Tab>
                    </TabList>

                    <TabPanels class="mt-4">
                        <!-- Charts -->
                        <TabPanel v-if="selectedReportTab === 'charts'">
                            <div v-if="!analytics" class="py-16 text-center text-sm text-gray-400">در حال بارگذاری نمودارها...</div>
                            <div v-else class="space-y-3">
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <AdminReportChartCard title="نوع استفاده تگ‌ها" subtitle="تفکیک بر اساس محتوا">
                                        <DoughnutChart class="h-52 mx-auto" :rawData="analytics.tag_usage_distribution" legendPosition="bottom" :showTitle="false" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="وضعیت تگ‌ها" subtitle="سوالات، دوره‌ها، دنبال‌کننده">
                                        <DoughnutChart class="h-52 mx-auto" :rawData="analytics.tag_status_distribution" legendPosition="bottom" :showTitle="false" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="اکوسیستم تگ‌ها" subtitle="تگ، اتصال‌ها و دنبال‌کننده">
                                        <DoughnutChart class="h-52 mx-auto" :rawData="analytics.ecosystem_overview" legendPosition="bottom" :showTitle="false" />
                                    </AdminReportChartCard>
                                </div>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    <AdminReportChartCard title="تگ‌های جدید — ۳۰ روز گذشته">
                                        <AreaChart class="h-56" :rawData="analytics.tags_created_timeline" :showLegend="false" lineColor="rgba(245,158,11,1)" fillColor="rgba(245,158,11,0.15)" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="اتصال سوالات — ۳۰ روز گذشته">
                                        <AreaChart class="h-56" :rawData="analytics.question_links_timeline" :showLegend="false" lineColor="rgba(251,191,36,1)" fillColor="rgba(251,191,36,0.15)" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="اتصال دوره‌ها — ۳۰ روز گذشته">
                                        <AreaChart class="h-56" :rawData="analytics.course_links_timeline" :showLegend="false" lineColor="rgba(96,165,250,1)" fillColor="rgba(96,165,250,0.15)" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="اتصال مقالات — ۳۰ روز گذشته">
                                        <AreaChart class="h-56" :rawData="analytics.article_links_timeline" :showLegend="false" lineColor="rgba(52,211,153,1)" fillColor="rgba(52,211,153,0.15)" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="دنبال‌کنندگان — ۳۰ روز گذشته">
                                        <AdminBarChart class="h-56" :rawData="analytics.followers_timeline" barColor="rgba(167,139,250,0.85)" />
                                    </AdminReportChartCard>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Rankings -->
                        <TabPanel v-if="selectedReportTab === 'rankings'">
                            <div v-if="!stats" class="py-16 text-center text-sm text-gray-400">در حال بارگذاری...</div>
                            <div v-else class="space-y-3">
                                <AdminReportChartCard v-if="analytics" title="محبوب‌ترین تگ‌ها (سوالات)" subtitle="۸ تگ با بیشترین سوال">
                                    <AdminBarChart class="h-64" :rawData="topTagsBarChart" horizontal barColor="rgba(251,191,36,0.85)" />
                                </AdminReportChartCard>
                                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                                    <div class="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                        <h3 class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3">محبوب‌ترین (سوالات)</h3>
                                        <div class="space-y-2">
                                            <div v-for="item in stats.top_by_questions" :key="item.id" class="flex items-center justify-between text-xs">
                                                <button type="button" @click="openTagSheet(item, 'questions')" class="font-semibold text-amber-600 dark:text-amber-400 hover:underline">#{{ item.name }}</button>
                                                <span class="font-anjoman text-gray-500">{{ item.questions_count }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                        <h3 class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3">محبوب‌ترین (دوره‌ها)</h3>
                                        <div class="space-y-2">
                                            <div v-for="item in stats.top_by_courses" :key="item.id" class="flex items-center justify-between text-xs">
                                                <button type="button" @click="openTagSheet(item, 'courses')" class="font-semibold text-amber-600 dark:text-amber-400 hover:underline">#{{ item.name }}</button>
                                                <span class="font-anjoman text-gray-500">{{ item.courses_count }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                        <h3 class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3">محبوب‌ترین (مقالات)</h3>
                                        <div class="space-y-2">
                                            <div v-for="item in stats.top_by_articles" :key="item.id" class="flex items-center justify-between text-xs">
                                                <button type="button" @click="openTagSheet(item, 'articles')" class="font-semibold text-amber-600 dark:text-amber-400 hover:underline">#{{ item.name }}</button>
                                                <span class="font-anjoman text-gray-500">{{ item.articles_count }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                        <h3 class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3">بیشترین دنبال‌کننده</h3>
                                        <div class="space-y-2">
                                            <div v-for="item in stats.top_by_followers" :key="item.id" class="flex items-center justify-between text-xs">
                                                <button type="button" @click="openTagSheet(item, 'followers')" class="font-semibold text-amber-600 dark:text-amber-400 hover:underline">#{{ item.name }}</button>
                                                <span class="font-anjoman text-gray-500">{{ item.followers_count }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="stats.recent_tags?.length" class="rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                                    <h3 class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3">تگ‌های اخیر</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <button v-for="item in stats.recent_tags" :key="item.id" type="button"
                                            @click="openTagSheet(item)"
                                            class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                                            #{{ item.name }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Tags list -->
                        <TabPanel v-if="selectedReportTab === 'list'">
                            <div class="gap-y-2 flex flex-col lg:flex-row lg:items-end lg:justify-between mb-4">
                <div class="relative w-full max-w-md">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" /></svg>
                    </div>
                    <input type="text" v-model="searchQuery" @input="handleSearch"
                        class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 pe-8 p-2.5 dark:bg-gray-600 dark:text-white"
                        placeholder="جستجو در تگ‌ها..." />
                    <button v-if="searchQuery" @click="clearSearch" class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="flex flex-wrap items-end gap-1">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                        <select v-model="selectedSort" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option value="popular">محبوب (سوالات)</option>
                            <option value="courses">بیشترین دوره</option>
                            <option value="articles">بیشترین مقاله</option>
                            <option value="followers">دنبال‌کننده</option>
                            <option value="name">نام</option>
                            <option value="created_at">جدیدترین</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">فیلتر:</div>
                        <select v-model="selectedFilter" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[8rem]">
                            <option value="all">همه</option>
                            <option value="with_questions">با سوال</option>
                            <option value="with_courses">با دوره</option>
                            <option value="with_articles">با مقاله</option>
                            <option value="empty">بدون محتوا</option>
                            <option value="with_followers">با دنبال‌کننده</option>
                        </select>
                    </div>
                    <button @click.prevent="clearFilters"
                        class="flex items-center justify-center h-8 w-8 bg-rose-400/20 hover:bg-opacity-90 rounded-lg">
                        <svg class="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none"><path d="M16.8809 10C14.2609 10 12.1309 12.13 12.1309 14.75C12.1309 15.64 12.3809 16.48 12.8209 17.2C13.6409 18.58 15.1509 19.5 16.8809 19.5C18.6109 19.5 20.1209 18.57 20.9409 17.2C21.3809 16.49 21.6309 15.64 21.6309 14.75C21.6309 12.13 19.5109 10 16.8809 10Z" fill="currentColor" /></svg>
                    </button>
                </div>
            </div>

            <div id="data-list" class="mt-4">
                <AdminBulkActionBar :count="selectedIds.length">
                    <button type="button" @click="openBulkDeleteModal"
                        class="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50">
                        حذف
                    </button>
                    <button type="button" @click="selectedIds = []"
                        class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                        لغو انتخاب
                    </button>
                </AdminBulkActionBar>
                <div class="overflow-x-auto md:custom-scrollbar">
                    <table class="min-w-full lg:table-fixed text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 w-8">
                                    <AdminBulkCheckbox :checked="allSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 text-start">تگ</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-16">سوالات</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-16">دوره‌ها</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-16">مقالات</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-20">دنبال‌کننده</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-36">تاریخ</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center lg:w-12">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="tag in tags" v-show="!loading" :key="tag.id" @click="openTagSheet(tag)"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 cursor-pointer hover:bg-amber-50/50 dark:hover:bg-gray-800/60 transition-colors">
                                <td class="relative ps-2 pe-2 py-3" @click.stop>
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-amber-400 dark:bg-amber-500"></div>
                                    <AdminBulkCheckbox v-model="selectedIds" :value="tag.id" />
                                </td>
                                <td class="px-1 py-3 text-start min-w-0">
                                    <span class="text-xs font-bold text-amber-600 dark:text-amber-400">#{{ tag.name }}</span>
                                    <div class="text-xs text-gray-400 mt-0.5">{{ tag.slug }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap" @click.stop="openTagSheet(tag, 'questions')">
                                    <span class="text-xs font-medium bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg font-anjoman hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">{{ tag.questions_count }}</span>
                                </td> 
                                <td class="px-1 py-3 whitespace-nowrap" @click.stop="openTagSheet(tag, 'courses')">
                                    <span class="text-xs font-medium bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg font-anjoman hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">{{ tag.courses_count }}</span>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap" @click.stop="openTagSheet(tag, 'articles')">
                                    <span class="text-xs font-medium bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg font-anjoman hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">{{ tag.articles_count || 0 }}</span>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap" @click.stop="openTagSheet(tag, 'followers')">
                                    <span class="text-xs font-medium bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg font-anjoman hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">{{ tag.followers_count }}</span>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-xs">{{ formatDate(tag.created_at) }}</td>
                                <td class="relative px-1 py-3 text-center" @click.stop>
                                    <Popover class="group flex items-center justify-center">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                        <PopoverButton class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z" /><path d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z" /><path d="M10 2C10 0.89543 9.10457 0 8 0C6.89543 0 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z" /></svg>
                                        </PopoverButton>
                                        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
                                            <PopoverPanel class="text-start flex flex-col z-30 end-10 absolute p-2 bg-white rounded-lg shadow w-max min-w-[10rem] dark:bg-gray-900">
                                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                    <li><button type="button" @click="openTagSheet(tag)" class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">جزئیات</button></li>
                                                    <li><router-link :to="{ name: 'tag-show', params: { tagSlug: tag.slug } }" target="_blank" class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">مشاهده در سایت</router-link></li>
                                                    <li><button type="button" @click="editTag(tag)" class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">ویرایش</button></li>
                                                    <li><button type="button" @click="openDeleteModal(tag)" class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-rose-600">حذف</button></li>
                                                </ul>
                                            </PopoverPanel>
                                        </transition>
                                    </Popover>
                                </td>
                            </tr>
                            <tr v-if="!loading && tags.length === 0">
                                <td colspan="8" class="px-4 py-12 text-center text-sm text-gray-400">تگی یافت نشد</td>
                            </tr>
                            <tr class="h-24"></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="flex lg:flex-row flex-col items-center justify-between gap-4 -mt-20">
                <PaginationComponent v-if="pagination && pagination.last_page > 1" dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                <select :value="perPage" @change="selectPerpage(parseInt($event.target.value))"
                    class="h-8 px-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                    <option v-for="per in perPages" :key="per" :value="per">{{ per }}</option>
                </select>
            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <BottomSheetDrawer v-model="showTagModal" :initialHeight="0.45" :maxHeight="0.6" :minHeight="0.35"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4'" :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ tagMode === 'create' ? 'افزودن تگ' : 'ویرایش تگ' }}</h3>
                <button type="button" @click="closeTagModal" class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form @submit.prevent="submitTagForm" class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">نام تگ</label>
                    <input v-model="tagForm.name" type="text" required maxlength="20" @input="onTagNameInput"
                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white" placeholder="مثال: javascript" />
                    <p v-if="tagFormError" class="text-xs text-rose-500 mt-1">{{ tagFormError }}</p>
                    <p class="text-xs text-gray-400 mt-1">۲ تا ۲۰ کاراکتر، بدون فاصله — حروف، اعداد، - و _</p>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="closeTagModal" class="h-9 px-4 text-sm font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">انصراف</button>
                    <button type="submit" :disabled="tagFormLoading" class="h-9 px-4 text-sm font-semibold rounded-lg bg-amber-400 text-gray-900 disabled:opacity-60">{{ tagFormLoading ? '...' : 'ذخیره' }}</button>
                </div>
            </form>
        </BottomSheetDrawer>

        <!-- Delete Modal -->
        <BottomSheetDrawer v-model="showDeleteModal" :initialHeight="0.35" :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-200/80 dark:border-gray-700/80 rounded-t-2xl lg:rounded-b-2xl lg:w-[30rem] lg:max-w-[30rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4'" :backdropClass="'bg-gray-300/30 backdrop-blur-sm'">
            <div class="text-center py-3">
                <div class="mx-auto mb-4 w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                    <svg class="w-7 h-7 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">حذف تگ</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    تگ «#{{ tagForDelete?.name }}» حذف شود؟
                    ارتباط با سوالات، دوره‌ها و مقالات هم پاک می‌شود.
                </p>
            </div>
            <div class="shrink-0 -mx-4 px-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:justify-end py-3">
                    <button @click="showDeleteModal = false"
                        class="w-full sm:w-auto flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors">
                        انصراف
                    </button>
                    <button @click="confirmDelete" :disabled="deleteLoading"
                        class="disabled:opacity-60 w-full sm:w-auto flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/25 transition-colors">
                        {{ deleteLoading ? 'در حال حذف...' : 'حذف' }}
                    </button>
                </div>
            </div>
        </BottomSheetDrawer>

        <!-- Bulk Delete Modal -->
        <BottomSheetDrawer v-model="showBulkDeleteModal" :initialHeight="0.35" :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-200/80 dark:border-gray-700/80 rounded-t-2xl lg:rounded-b-2xl lg:w-[30rem] lg:max-w-[30rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4'" :backdropClass="'bg-gray-300/30 backdrop-blur-sm'">
            <div class="text-center py-3">
                <div class="mx-auto mb-4 w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                    <svg class="w-7 h-7 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">حذف گروهی</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ selectedIds.length }} تگ حذف شوند؟</p>
            </div>
            <div class="shrink-0 -mx-4 px-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:justify-end py-3">
                    <button @click="showBulkDeleteModal = false"
                        class="w-full sm:w-auto flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors">
                        انصراف
                    </button>
                    <button @click="confirmBulkDelete" :disabled="deleteLoading"
                        class="disabled:opacity-60 w-full sm:w-auto flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/25 transition-colors">
                        {{ deleteLoading ? 'در حال حذف...' : 'حذف' }}
                    </button>
                </div>
            </div>
        </BottomSheetDrawer>

        <!-- Merge Modal -->
        <BottomSheetDrawer v-model="showMergeModal" :initialHeight="0.55" :panelClass="'bg-white dark:bg-gray-900 rounded-t-2xl lg:w-[36rem]'"
            :contentClass="'px-4 pb-4'" :backdropClass="'bg-gray-300/30 backdrop-blur-sm'">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">ادغام تگ‌ها</h3>
            <p class="text-xs text-gray-500 mb-4">تگ مبدأ حذف می‌شود و محتوای آن به تگ مقصد منتقل می‌شود.</p>
            <div class="space-y-3">
                <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">تگ مبدأ (حذف می‌شود)</label>
                    <select v-model="mergeForm.source_id" class="w-full h-9 px-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white">
                        <option :value="null" disabled>انتخاب کنید</option>
                        <option v-for="t in mergeTagOptions" :key="t.id" :value="t.id" :disabled="t.id === mergeForm.target_id">#{{ t.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">تگ مقصد</label>
                    <select v-model="mergeForm.target_id" class="w-full h-9 px-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white">
                        <option :value="null" disabled>انتخاب کنید</option>
                        <option v-for="t in mergeTagOptions" :key="t.id" :value="t.id" :disabled="t.id === mergeForm.source_id">#{{ t.name }}</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end gap-2 mt-4">
                <button @click="showMergeModal = false" class="h-9 px-4 text-sm font-semibold rounded-lg bg-gray-100">انصراف</button>
                <button @click="confirmMerge" :disabled="mergeLoading || !mergeForm.source_id || !mergeForm.target_id" class="h-9 px-4 text-sm font-semibold rounded-lg bg-amber-400 text-gray-900 disabled:opacity-60">ادغام</button>
            </div>
        </BottomSheetDrawer>

        <AdminTagDetailSheet
            v-model="showDetailSheet"
            :tag-summary="detailTagSummary"
            :initial-tab="detailInitialTab"
            @edit="editTag" />
        <LoadingComponent v-if="loading" />
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminTagDetailSheet from "@/views/components/admin/tag/AdminTagDetailSheet.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import AreaChart from "@/views/components/chart/AreaChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import { Popover, PopoverButton, PopoverOverlay, PopoverPanel, TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import axiosInstance from "@/store/axiosInstance";
import { showToastSuccess, showToastError } from "@/utils/toastConfig";
import debounce from "lodash/debounce";
import { sanitizeTagInput, validateTagName } from "@/utils/tagFormat";

export default {
    name: "AdminTags",
    components: {
        AdminMasterPage, PaginationComponent, BottomSheetDrawer, AdminTagDetailSheet,
        AdminReportStatCard, AdminReportChartCard, DoughnutChart, AreaChart, AdminBarChart,
        AdminBulkCheckbox, AdminBulkActionBar, LoadingComponent,
        Popover, PopoverButton, PopoverOverlay, PopoverPanel,
        TabGroup, TabList, Tab, TabPanels, TabPanel,
    },
    data() {
        return {
            loading: false,
            stats: null,
            tags: [],
            pagination: {},
            currentPage: 1,
            perPage: 15,
            perPages: [10, 15, 20, 30, 50],
            searchQuery: "",
            selectedSort: "popular",
            selectedFilter: "all",
            selectedIds: [],
            showTagModal: false,
            tagMode: "create",
            tagForm: { name: "" },
            tagFormError: "",
            tagFormLoading: false,
            editingTag: null,
            showDeleteModal: false,
            showBulkDeleteModal: false,
            deleteLoading: false,
            tagForDelete: null,
            showMergeModal: false,
            mergeLoading: false,
            mergeForm: { source_id: null, target_id: null },
            mergeTagOptions: [],
            showDetailSheet: false,
            detailTagSummary: null,
            detailInitialTab: "overview",
            selectedReportTab: "charts",
            reportTabs: [
                { id: "charts", label: "آمار و نمودارها" },
                { id: "rankings", label: "رتبه‌بندی و محبوب‌ها" },
                { id: "list", label: "لیست تگ‌ها" },
            ],
        };
    },
    computed: {
        allSelected() {
            return this.tags.length > 0 && this.selectedIds.length === this.tags.length;
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.allSelected;
        },
        analytics() {
            return this.stats?.analytics || null;
        },
        topTagsBarChart() {
            const raw = this.stats?.analytics?.top_tags_questions_bar;
            if (!raw) return { labels: [], data: [] };
            return {
                labels: (raw.labels || []).map((n) => `#${n}`),
                data: raw.data || [],
            };
        },
    },
    mounted() {
        this.fetchStats();
        this.fetchTags();
    },
    methods: {
        formatNumber(value) {
            return Number(value || 0).toLocaleString("fa-IR");
        },
        refreshData() {
            this.fetchStats();
            this.fetchTags();
        },
        reportTabButtonClass(id) {
            return this.selectedReportTab === id
                ? "text-gray-700 dark:text-black bg-yellow-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/60";
        },
        onFilterChange() {
            this.currentPage = 1;
            this.fetchTags();
        },
        clearSearch() {
            this.searchQuery = "";
            this.currentPage = 1;
            this.fetchTags();
        },
        clearFilters() {
            this.searchQuery = "";
            this.selectedSort = "popular";
            this.selectedFilter = "all";
            this.currentPage = 1;
            this.fetchTags();
        },
        handleSearch: debounce(function () {
            this.currentPage = 1;
            this.fetchTags();
        }, 400),
        selectPerpage(per) {
            this.perPage = per;
            this.currentPage = 1;
            this.fetchTags();
        },
        updatePage(page) {
            this.currentPage = page;
            this.fetchTags();
        },
        toggleSelectAll(e) {
            this.selectedIds = e.target.checked ? this.tags.map((t) => t.id) : [];
        },
        formatDate(date) {
            if (!date) return "-";
            const d = new Date(date);
            return d.toLocaleDateString("fa-IR", { year: "numeric", month: "short", day: "2-digit" });
        },
        async fetchStats() {
            try {
                const res = await axiosInstance.get("/admin/tags/stats");
                this.stats = res.data.stats;
            } catch (e) {
                console.error(e);
            }
        },
        async fetchTags() {
            this.loading = true;
            try {
                const params = {
                    page: this.currentPage,
                    perPage: this.perPage,
                    search: this.searchQuery || undefined,
                    sort: this.selectedSort,
                    filter: this.selectedFilter,
                };
                Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);
                const res = await axiosInstance.post("/admin/tags", params);
                this.tags = res.data.tags.data || [];
                this.pagination = res.data.tags;
                this.selectedIds = [];
            } catch (e) {
                this.showError("خطا در دریافت تگ‌ها");
            } finally {
                this.loading = false;
            }
        },
        openTagSheet(tag, tab = "overview") {
            this.detailTagSummary = { ...tag };
            this.detailInitialTab = tab;
            this.showDetailSheet = true;
        },
        openCreateModal() {
            this.tagMode = "create";
            this.editingTag = null;
            this.tagForm = { name: "" };
            this.tagFormError = "";
            this.showTagModal = true;
        },
        editTag(tag) {
            this.tagMode = "edit";
            this.editingTag = tag;
            this.tagForm = { name: tag.name };
            this.tagFormError = "";
            this.showTagModal = true;
        },
        closeTagModal() {
            this.showTagModal = false;
        },
        onTagNameInput() {
            this.tagForm.name = sanitizeTagInput(this.tagForm.name);
            this.tagFormError = validateTagName(this.tagForm.name, (k) => this.$t(k)) || "";
        },
        async submitTagForm() {
            const err = validateTagName(this.tagForm.name, (k) => this.$t(k));
            if (err) {
                this.tagFormError = err;
                return;
            }
            this.tagFormLoading = true;
            try {
                if (this.tagMode === "create") {
                    await axiosInstance.post("/admin/tag/create", { name: this.tagForm.name.trim() });
                    this.showSuccess("تگ ایجاد شد");
                } else {
                    await axiosInstance.post(`/admin/tag/${this.editingTag.id}/update`, { name: this.tagForm.name.trim() });
                    this.showSuccess("تگ بروزرسانی شد");
                }
                this.closeTagModal();
                this.refreshData();
            } catch (e) {
                const msg = e.response?.data?.errors?.name?.[0] || e.response?.data?.message || "خطا در ذخیره";
                this.tagFormError = msg;
            } finally {
                this.tagFormLoading = false;
            }
        },
        openDeleteModal(tag) {
            this.tagForDelete = tag;
            this.showDeleteModal = true;
        },
        openBulkDeleteModal() {
            this.showBulkDeleteModal = true;
        },
        async confirmDelete() {
            if (!this.tagForDelete) return;
            this.deleteLoading = true;
            try {
                await axiosInstance.delete(`/admin/tag/${this.tagForDelete.id}`);
                this.showSuccess("تگ حذف شد");
                this.showDeleteModal = false;
                this.refreshData();
            } catch (e) {
                this.showError("خطا در حذف تگ");
            } finally {
                this.deleteLoading = false;
            }
        },
        async confirmBulkDelete() {
            this.deleteLoading = true;
            try {
                await axiosInstance.post("/admin/tags/bulk-delete", { ids: this.selectedIds });
                this.showSuccess("تگ‌ها حذف شدند");
                this.showBulkDeleteModal = false;
                this.refreshData();
            } catch (e) {
                this.showError("خطا در حذف");
            } finally {
                this.deleteLoading = false;
            }
        },
        async openMergeModal() {
            try {
                const res = await axiosInstance.get("/admin/tags/search", { params: { limit: 100 } });
                this.mergeTagOptions = res.data.tags || [];
                this.mergeForm = { source_id: null, target_id: null };
                this.showMergeModal = true;
            } catch (e) {
                this.showError("خطا در بارگذاری تگ‌ها");
            }
        },
        async confirmMerge() {
            this.mergeLoading = true;
            try {
                await axiosInstance.post("/admin/tag/merge", {
                    source_id: this.mergeForm.source_id,
                    target_id: this.mergeForm.target_id,
                });
                this.showSuccess("تگ‌ها ادغام شدند");
                this.showMergeModal = false;
                this.refreshData();
            } catch (e) {
                this.showError(e.response?.data?.message || "خطا در ادغام");
            } finally {
                this.mergeLoading = false;
            }
        },
        showSuccess(msg) {
            showToastSuccess(msg);
        },
        showError(msg) {
            showToastError(msg);
        },
    },
};
</script>
