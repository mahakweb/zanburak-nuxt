<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button @click.prevent="openCreateModal"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        افزودن دسته‌بندی
                        <svg class="w-5 h-5 ms-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                </span>
            </button>
            <router-link :to="{ name: 'admin-questions' }"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        سوالات
                        <svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                </span>
            </router-link>
            <button @click="refreshData"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        بروزرسانی داده‌ها
                        <svg class="w-5 h-5 rtl:ms-1 -mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <rect x="0" y="0" width="24" height="24" />
                                <path d="M12,8 L8,8 C5.790861,8 4,9.790861 4,12 L4,13 C4,14.6568542 5.34314575,16 7,16 L7,18 C4.23857625,18 2,15.7614237 2,13 L2,12 C2,8.6862915 4.6862915,6 8,6 L12,6 L12,4.72799742 C12,4.62015048 12.0348702,4.51519416 12.0994077,4.42878885 C12.264656,4.2075478 12.5779675,4.16215674 12.7992086,4.32740507 L15.656242,6.46136716 C15.6951359,6.49041758 15.7295917,6.52497737 15.7585249,6.56395854 C15.9231063,6.78569617 15.876772,7.09886961 15.6550344,7.263451 L12.798001,9.3840407 C12.7118152,9.44801079 12.607332,9.48254921 12.5,9.48254921 C12.2238576,9.48254921 12,9.25869158 12,8.98254921 L12,8 Z" fill="currentColor" />
                                <path d="M12.0583175,16 L16,16 C18.209139,16 20,14.209139 20,12 L20,11 C20,9.34314575 18.6568542,8 17,8 L17,6 C19.7614237,6 22,8.23857625 22,11 L22,12 C22,15.3137085 19.3137085,18 16,18 L12.0583175,18 L12.0583175,18.9825492 C12.0583175,19.2586916 11.8344599,19.4825492 11.5583175,19.4825492 C11.4509855,19.4825492 11.3465023,19.4480108 11.2603165,19.3840407 L8.40328311,17.263451 C8.18154548,17.0988696 8.13521119,16.7856962 8.29979258,16.5639585 C8.32872576,16.5249774 8.36318164,16.4904176 8.40207551,16.4613672 L11.2591089,14.3274051 C11.48035,14.1621567 11.7936615,14.2075478 11.9589099,14.4287888 C12.0234473,14.5151942 12.0583175,14.6201505 12.0583175,14.7279974 L12.0583175,16 Z" fill="currentColor" opacity="0.3" />
                            </g>
                        </svg>
                    </span>
                </span>
            </button>
        </template>

        <div class="min-w-0">
            <!-- Stats -->
            <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-4">
                <AdminReportStatCard title="کل دسته‌ها" :value="formatNumber(stats.total_categories)" accent="amber">
                    <template #icon>
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="فعال" :value="formatNumber(stats.active_categories)" accent="emerald" subtitle="قابل استفاده در سایت" />
                <AdminReportStatCard title="غیرفعال" :value="formatNumber(stats.inactive_categories)" accent="rose" />
                <AdminReportStatCard title="بدون سوال" :value="formatNumber(stats.empty_categories)" accent="cyan" subtitle="دسته خالی" />
                <AdminReportStatCard title="کل سوالات" :value="formatNumber(stats.total_questions)" accent="blue" />
                <AdminReportStatCard title="منتشر شده" :value="formatNumber(stats.published_questions)" accent="emerald" />
                <AdminReportStatCard title="پیش‌نویس" :value="formatNumber(stats.draft_questions)" accent="violet" />
                <AdminReportStatCard title="میانگین / دسته" :value="formatNumber(stats.avg_questions_per_category)" accent="amber" subtitle="سوال به ازای هر دسته" />
            </div>

            <div class="gap-y-2 flex flex-col lg:flex-row lg:items-end lg:justify-between mb-4">
                <div class="">
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" v-model="searchQuery" @input="handleSearch"
                            class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 pe-8 p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="جستجو در عنوان، اسلاگ یا توضیحات..." />
                        <button v-if="searchQuery" @click="clearSearch"
                            class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت:</div>
                        <select v-model="statusFilter" @change="onStatusFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[7rem]">
                            <option value="all">همه</option>
                            <option value="active">فعال</option>
                            <option value="inactive">غیرفعال</option>
                            <option value="empty">بدون سوال</option>
                            <option value="has_questions">دارای سوال</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">دسته والد:</div>
                        <select v-model="selectedParentId" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[8rem]">
                            <option :value="null">همه</option>
                            <option value="">بدون والد (ریشه)</option>
                            <option v-for="cat in allCategories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                        <select v-model="sortBy"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[9rem]">
                            <option value="default">پیش‌فرض</option>
                            <option value="title">عنوان (الفبا)</option>
                            <option value="questions_desc">بیشترین سوال</option>
                            <option value="questions_asc">کمترین سوال</option>
                            <option value="newest">جدیدترین</option>
                        </select>
                    </div>
                    <div class="inline-flex">
                        <button @click.prevent="clearFilters"
                            class="flex items-center justify-center h-8 w-8 bg-rose-400/20 hover:bg-opacity-90 rounded-lg focus:ring-1 ring-rose-500 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800">
                            <svg class="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.8809 10C14.2609 10 12.1309 12.13 12.1309 14.75C12.1309 15.64 12.3809 16.48 12.8209 17.2C13.6409 18.58 15.1509 19.5 16.8809 19.5C18.6109 19.5 20.1209 18.57 20.9409 17.2C21.3809 16.49 21.6309 15.64 21.6309 14.75C21.6309 12.13 19.5109 10 16.8809 10ZM18.6809 16.52C18.5309 16.67 18.3409 16.74 18.1509 16.74C17.9609 16.74 17.7709 16.67 17.6209 16.52L16.9009 15.8L16.1509 16.55C16.0009 16.7 15.8109 16.77 15.6209 16.77C15.4309 16.77 15.2409 16.7 15.0909 16.55C14.8009 16.26 14.8009 15.78 15.0909 15.49L15.8409 14.74L15.1209 14.01C14.8309 13.72 14.8309 13.24 15.1209 12.95C15.4109 12.66 15.8909 12.66 16.1809 12.95L16.9009 13.67L17.6009 12.97C17.8909 12.68 18.3709 12.68 18.6609 12.97C18.9509 13.26 18.9509 13.74 18.6609 14.03L17.9609 14.73L18.6809 15.46C18.9809 15.75 18.9809 16.23 18.6809 16.52Z" fill="currentColor" />
                                <path d="M20.5799 4.02V6.24C20.5799 7.05 20.0799 8.06 19.5799 8.57L19.3999 8.73C19.2599 8.86 19.0499 8.89 18.8699 8.83C18.6699 8.76 18.4699 8.71 18.2699 8.66C17.8299 8.55 17.3599 8.5 16.8799 8.5C13.4299 8.5 10.6299 11.3 10.6299 14.75C10.6299 15.89 10.9399 17.01 11.5299 17.97C12.0299 18.81 12.7299 19.51 13.4899 19.98C13.7199 20.13 13.8099 20.45 13.6099 20.63C13.5399 20.69 13.4699 20.74 13.3999 20.79L11.9999 21.7C10.6999 22.51 8.90992 21.6 8.90992 19.98V14.63C8.90992 13.92 8.50992 13.01 8.10992 12.51L4.31992 8.47C3.81992 7.96 3.41992 7.05 3.41992 6.45V4.12C3.41992 2.91 4.31992 2 5.40992 2H18.5899C19.6799 2 20.5799 2.91 20.5799 4.02Z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div class="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{{ formatNumber(displayCategories.length) }} دسته‌بندی در این صفحه نمایش داده می‌شود</span>
                <span v-if="pagination.total">{{ formatNumber(pagination.total) }} دسته در کل</span>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-end gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-gray-400 dark:bg-gray-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">غیرفعال</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-emerald-400 dark:bg-emerald-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">فعال</span>
                </div>
            </div>

            <AdminBulkActionBar :count="selectedIds.length">
                <select v-model="bulkAction"
                    class="h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[9rem]">
                    <option value="">انتخاب عملیات...</option>
                    <option value="activate">فعال‌سازی</option>
                    <option value="deactivate">غیرفعال‌سازی</option>
                </select>
                <button type="button" @click="executeBulkAction" :disabled="!bulkAction || bulkLoading"
                    class="h-8 px-3 text-xs font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:opacity-50">
                    {{ bulkLoading ? 'در حال پردازش...' : 'اجرا' }}
                </button>
                <button type="button" @click="clearBulkSelection"
                    class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    لغو انتخاب
                </button>
            </AdminBulkActionBar>

            <div id="data-list">
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full lg:table-fixed lg:w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <colgroup class="hidden lg:table-column-group">
                            <col />
                            <col class="w-24" />
                            <col class="w-28" />
                            <col class="w-20" />
                            <col class="w-14" />
                            <col class="w-14" />
                            <col class="w-14" />
                            <col class="w-36" />
                            <col class="w-12" />
                        </colgroup>
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 w-10">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 text-start">دسته‌بندی</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">اسلاگ</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-28">دسته والد</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-14">سوالات</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">منتشر</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">پیش‌نویس</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-36">تاریخ</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center lg:w-12">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-if="!loading && !displayCategories.length">
                                <td colspan="10" class="px-3 py-12 text-center text-gray-400">دسته‌بندی یافت نشد.</td>
                            </tr>
                            <tr v-for="category in displayCategories" v-show="!loading" :key="category.id"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="relative ps-2 pe-2 py-3" @click.stop>
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                        :class="getStatusBarClass(category)"></div>
                                    <AdminBulkCheckbox v-model="selectedIds" :value="category.id" />
                                </td>
                                <td class="px-1 py-3 text-start min-w-0">
                                    <div class="flex items-center gap-2 min-w-0 max-w-full">
                                        <div v-if="category.icon"
                                            class="shrink-0 w-9 h-9 flex items-center justify-center bg-gray-100/70 dark:bg-gray-800/50 rounded-lg overflow-hidden category-icon"
                                            v-html="category.icon"></div>
                                        <div class="min-w-0 flex-1">
                                            <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {{ category.title }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                                {{ category.english_title }}
                                            </div>
                                            <div v-if="category.description"
                                                class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                                                {{ category.description }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 text-start">
                                    <code class="text-[11px] text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 px-1.5 py-0.5 rounded">{{ category.slug || '—' }}</code>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start lg:w-28">
                                    <div v-if="category.parent"
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1 max-w-full truncate">
                                        {{ category.parent.title }}
                                    </div>
                                    <div v-else class="text-xs text-gray-400">-</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <button type="button" @click="toggleStatus(category)" :disabled="toggleLoading[category.id]"
                                        class="px-2 py-0.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
                                        :class="category.status
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200/80'
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200/80'"
                                        title="کلیک برای تغییر وضعیت">
                                        {{ category.status ? 'فعال' : 'غیرفعال' }}
                                    </button>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start lg:w-14">
                                    <button type="button" @click="openQuestionsSheet(category)"
                                        class="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/20 px-2 py-1 rounded-lg w-max font-anjoman hover:bg-amber-200/70 transition-colors">
                                        {{ category.questions_count || 0 }}
                                    </button>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <button type="button" @click="openQuestionsSheet(category, 'published')"
                                        class="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/20 px-2 py-1 rounded-lg w-max font-anjoman hover:bg-emerald-200/70 transition-colors">
                                        {{ category.published_questions_count || 0 }}
                                    </button>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <span class="text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-100/70 dark:bg-violet-900/20 px-2 py-1 rounded-lg w-max font-anjoman inline-block">
                                        {{ category.draft_questions_count || 0 }}
                                    </span>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start lg:w-36">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1 truncate max-w-full">
                                        {{ formatDate(category.created_at) }}
                                    </div>
                                </td>
                                <td class="relative px-1 py-3 whitespace-nowrap text-center lg:w-12">
                                    <Popover class="group flex items-center justify-center">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                        <PopoverButton
                                            class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none flex items-center justify-center p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z" fill="currentColor" />
                                                <path d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z" fill="currentColor" />
                                                <path d="M10 2C10 0.89543 9.10457 0 8 0C6.89543 0 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z" fill="currentColor" />
                                            </svg>
                                        </PopoverButton>
                                        <transition enter-active-class="transition duration-200 ease-out"
                                            enter-from-class="translate-y-1 opacity-0"
                                            enter-to-class="translate-y-0 opacity-100"
                                            leave-active-class="transition duration-150 ease-in"
                                            leave-from-class="translate-y-0 opacity-100"
                                            leave-to-class="translate-y-1 opacity-0">
                                            <PopoverPanel
                                                class="text-start flex flex-col z-30 end-10 absolute p-2 bg-white rounded-lg shadow w-max min-w-[10rem] dark:bg-gray-900">
                                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                    <li>
                                                        <button type="button" @click="openQuestionsSheet(category)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            مشاهده سوالات
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" @click="editCategory(category)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            ویرایش
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" @click="openDeleteModal(category)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-rose-600 dark:text-rose-400">
                                                            حذف
                                                        </button>
                                                    </li>
                                                </ul>
                                            </PopoverPanel>
                                        </transition>
                                    </Popover>
                                </td>
                            </tr>
                            <tr class="h-24"></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="flex lg:flex-row flex-col items-center justify-between gap-4 -mt-20">
                <div>
                    <PaginationComponent v-if="pagination && pagination.last_page > 1" dir="ltr"
                        :pagination="pagination" @updatePage="updatePage" />
                </div>
                <div>
                    <select :value="perPage" @change="selectPerpage(parseInt($event.target.value))"
                        class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                        <option v-for="per in perPages" :key="per" :value="per">{{ per }}</option>
                    </select>
                </div>
            </div>

            <!-- Create/Edit Category Bottom Sheet -->
            <BottomSheetDrawer v-model="showCategoryModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="sheetPanelClass" :contentClass="sheetContentClass" :backdropClass="sheetBackdropClass">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ categoryMode === 'create' ? 'افزودن دسته‌بندی جدید' : 'ویرایش دسته‌بندی' }}
                    </h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeCategoryModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 sm:mt-0 w-full">
                        <form @submit.prevent="submitCategoryForm" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان</label>
                                    <input v-model="categoryForm.title" type="text" required
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان انگلیسی</label>
                                    <input v-model="categoryForm.english_title" type="text" required
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">دسته والد</label>
                                <select v-model="categoryForm.parent_id"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
                                    <option :value="null">بدون والد (ریشه)</option>
                                    <option v-for="cat in allCategories" :key="cat.id" :value="cat.id"
                                        :disabled="editingCategory && cat.id === editingCategory.id">{{ cat.title }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">توضیحات</label>
                                <textarea v-model="categoryForm.description" rows="3"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"></textarea>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">آیکون (SVG)</label>
                                <textarea v-model="categoryForm.icon" rows="3"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"></textarea>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">وضعیت</label>
                                <ul class="w-max h-10 grid gap-3 grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <li>
                                        <input v-model="categoryForm.status" type="radio" id="category-status-0"
                                            name="category-status" :value="false" class="hidden peer" />
                                        <label for="category-status-0"
                                            class="h-full inline-flex items-center justify-between w-full px-4 p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                            <div class="block text-xs font-semibold text-center w-full">غیرفعال</div>
                                        </label>
                                    </li>
                                    <li>
                                        <input v-model="categoryForm.status" type="radio" id="category-status-1"
                                            name="category-status" :value="true" class="hidden peer" />
                                        <label for="category-status-1"
                                            class="h-full inline-flex items-center justify-between w-full px-4 p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                            <div class="block text-xs font-semibold text-center w-full">فعال</div>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                            <div class="flex justify-end gap-3 pt-6">
                                <button type="button" @click="closeCategoryModal"
                                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    انصراف
                                </button>
                                <button type="submit" :disabled="categoryFormLoading"
                                    class="px-5 py-2.5 text-sm font-semibold text-white bg-yellow-400 rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-colors shadow-lg shadow-yellow-400/30">
                                    <span v-if="categoryFormLoading">در حال ذخیره...</span>
                                    <span v-else>ذخیره</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </BottomSheetDrawer>

            <!-- Delete Category Bottom Sheet -->
            <BottomSheetDrawer v-model="showDeleteModal"
                :initialHeight="deleteSheetInitialHeight"
                :maxHeight="0.95"
                :minHeight="deleteSheetHasQuestions ? 0.6 : 0.38"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="deleteSheetHasQuestions ? deleteSheetPanelClass : deleteSheetPanelClassSm"
                :contentClass="sheetContentClass" :backdropClass="sheetBackdropClass">
                <div class="flex items-start justify-between gap-3 mb-4">
                    <div class="flex items-start gap-3 min-w-0">
                        <div
                            class="shrink-0 w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center"
                        >
                            <svg class="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div class="min-w-0 pt-0.5">
                            <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">حذف دسته‌بندی</h3>
                            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                {{ deleteSheetHasQuestions ? 'سوالات را منتقل کنید، سپس دسته حذف می‌شود' : 'این عملیات قابل بازگشت نیست' }}
                            </p>
                        </div>
                    </div>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeDeleteModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <template v-if="!deleteSheetHasQuestions">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        آیا از حذف دسته‌بندی «<strong>{{ categoryForDelete?.title }}</strong>» مطمئن هستید؟
                    </p>
                </template>

                <template v-else>
                    <div class="rounded-2xl border border-amber-200/80 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-950/20 p-3.5 mb-4">
                        <div class="flex items-start gap-3">
                            <div class="shrink-0 p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                    حذف «{{ categoryForDelete?.title }}» — {{ formatNumber(categoryForDelete?.questions_count) }} سوال
                                </p>
                                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    قبل از حذف، مقصد هر سوال را مشخص کنید.
                                </p>
                            </div>
                        </div>
                    </div>

                    <ul class="h-10 grid w-full grid-cols-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                        <li>
                            <input id="transfer-mode-bulk" v-model="transferMode" type="radio" value="bulk" class="hidden peer" />
                            <label for="transfer-mode-bulk"
                                class="h-full inline-flex items-center justify-center w-full rounded-lg cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-300 peer-checked:text-gray-900 peer-checked:bg-yellow-400">
                                انتقال یکجا
                            </label>
                        </li>
                        <li>
                            <input id="transfer-mode-per" v-model="transferMode" type="radio" value="per_question" class="hidden peer" />
                            <label for="transfer-mode-per"
                                class="h-full inline-flex items-center justify-center w-full rounded-lg cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-300 peer-checked:text-gray-900 peer-checked:bg-yellow-400">
                                انتقال تکی
                            </label>
                        </li>
                    </ul>

                    <template v-if="transferMode === 'bulk'">
                        <div class="flex items-center gap-2 mb-4">
                            <div class="flex-1 min-w-0 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 px-3 py-2.5">
                                <p class="text-[10px] font-medium text-rose-600 dark:text-rose-400 mb-0.5">حذف می‌شود</p>
                                <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ categoryForDelete?.title }}</p>
                                <p class="text-[10px] text-gray-500 mt-0.5 font-anjoman">{{ formatNumber(categoryForDelete?.questions_count) }} سوال</p>
                            </div>
                            <div class="shrink-0 text-gray-400">
                                <svg class="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 rounded-xl border px-3 py-2.5 transition-colors"
                                :class="transferTargetId
                                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40'
                                    : 'bg-gray-50 dark:bg-gray-800/50 border-dashed border-gray-300 dark:border-gray-600'">
                                <p class="text-[10px] font-medium mb-0.5" :class="transferTargetId ? 'text-emerald-600' : 'text-gray-400'">مقصد همه</p>
                                <p class="text-xs font-semibold truncate" :class="transferTargetId ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
                                    {{ selectedTransferCategory?.title || 'انتخاب دسته' }}
                                </p>
                            </div>
                        </div>
                        <div class="relative mb-2">
                            <input v-model="transferSearch" type="text" placeholder="جستجوی دسته مقصد..."
                                class="w-full h-9 ps-9 pe-3 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-amber-400/50" />
                            <svg class="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <div v-if="!transferTargetOptions.length" class="py-6 text-center text-xs text-gray-500 mb-4">
                            دسته دیگری برای انتقال وجود ندارد.
                        </div>
                        <div v-else class="max-h-40 overflow-y-auto custom-scrollbar space-y-1.5 mb-4 pe-0.5">
                            <button v-for="cat in transferTargetOptions" :key="cat.id" type="button"
                                @click="transferTargetId = cat.id"
                                class="w-full flex items-center gap-3 p-2.5 rounded-xl text-start transition-all"
                                :class="transferTargetId === cat.id
                                    ? 'bg-amber-100 dark:bg-amber-900/30 ring-2 ring-amber-400/70'
                                    : 'bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70'">
                                <div class="shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                    :class="transferTargetId === cat.id ? 'border-amber-500' : 'border-gray-300'">
                                    <div v-if="transferTargetId === cat.id" class="w-2 h-2 rounded-full bg-amber-500"></div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ cat.title }}</div>
                                    <div class="text-[10px] text-gray-500">{{ formatNumber(cat.questions_count || 0) }} سوال</div>
                                </div>
                            </button>
                        </div>
                    </template>

                    <template v-else>
                        <div v-if="deleteQuestionsLoading" class="py-10 text-center text-sm text-gray-500 mb-4">
                            در حال بارگذاری سوالات...
                        </div>
                        <template v-else>
                            <div class="mb-4">
                                <div class="flex items-center justify-between text-xs mb-1.5">
                                    <span class="text-gray-600 dark:text-gray-400">پیشرفت تخصیص</span>
                                    <span class="font-semibold font-anjoman"
                                        :class="transferProgressComplete ? 'text-emerald-600' : 'text-amber-600'">
                                        {{ formatNumber(transferAssignedCount) }} / {{ formatNumber(deleteQuestions.length) }}
                                    </span>
                                </div>
                                <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-300"
                                        :class="transferProgressComplete ? 'bg-emerald-500' : 'bg-amber-400'"
                                        :style="{ width: transferProgressPercent + '%' }"></div>
                                </div>
                            </div>

                            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 p-3 mb-3 space-y-2">
                                <div class="flex flex-wrap items-center gap-2">
                                    <select v-model="bulkApplyCategoryId"
                                        class="flex-1 min-w-[8rem] h-8 px-2 text-xs rounded-lg bg-white dark:bg-gray-900 outline-none">
                                        <option :value="null" disabled>دسته مقصد...</option>
                                        <option v-for="cat in otherCategories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                                    </select>
                                    <button type="button" @click="applyBulkToAll" :disabled="!bulkApplyCategoryId"
                                        class="h-8 px-3 text-xs font-semibold rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 disabled:opacity-40">
                                        همه
                                    </button>
                                    <button type="button" @click="applyBulkToSelected" :disabled="!bulkApplyCategoryId || !selectedDeleteQuestionIds.length"
                                        class="h-8 px-3 text-xs font-semibold rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-40">
                                        انتخاب‌شده ({{ formatNumber(selectedDeleteQuestionIds.length) }})
                                    </button>
                                    <button type="button" @click="clearQuestionTransfers"
                                        class="h-8 px-3 text-xs font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200">
                                        پاک کردن
                                    </button>
                                </div>
                                <div class="flex items-center justify-between gap-2">
                                    <label class="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                        <input type="checkbox" :checked="allDeleteQuestionsSelected"
                                            :indeterminate.prop="isIndeterminateDeleteSelection"
                                            @change="toggleSelectAllDeleteQuestions"
                                            class="appearance-none shrink-0 w-5 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-gray-50 dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
                                            :class="[
                                                allDeleteQuestionsSelected ? 'is-checked bg-yellow-400' : '',
                                                isIndeterminateDeleteSelection ? 'is-indeterminate bg-yellow-400' : '',
                                            ]" />
                                        انتخاب همه
                                    </label>
                                    <div class="relative flex-1 max-w-xs">
                                        <input v-model="deleteQuestionSearch" type="text" placeholder="جستجو..."
                                            class="w-full h-7 ps-8 pe-2 text-[11px] rounded-lg bg-white dark:bg-gray-900 outline-none" />
                                        <svg class="w-3.5 h-3.5 absolute start-2.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div v-if="!otherCategories.length" class="py-6 text-center text-xs text-gray-500 mb-4">
                                دسته دیگری برای انتقال وجود ندارد.
                            </div>
                            <div v-else class="max-h-52 overflow-y-auto custom-scrollbar space-y-1.5 mb-4 pe-0.5">
                                <div v-for="question in filteredDeleteQuestions" :key="question.id"
                                    @click="toggleDeleteQuestionSelection(question.id, $event)"
                                    class="flex items-center gap-2.5 p-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                    :class="deleteQuestionRowClass(question)">
                                    <input type="checkbox" :checked="isDeleteQuestionSelected(question.id)"
                                        tabindex="-1" aria-hidden="true"
                                        class="shrink-0 appearance-none w-5 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 checked:bg-yellow-400 focus:outline-none transition relative custom-checkbox pointer-events-none"
                                        :class="isDeleteQuestionSelected(question.id) ? 'is-checked bg-yellow-400' : ''" />
                                    <div class="min-w-0 flex-1">
                                        <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{{ question.title }}</div>
                                        <div class="flex items-center gap-1.5 mt-0.5">
                                            <span class="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                                                :class="question.publish ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'">
                                                {{ question.publish ? 'منتشر' : 'پیش‌نویس' }}
                                            </span>
                                            <span v-if="question.user" class="text-[10px] text-gray-500">
                                                {{ question.user.first_name }} {{ question.user.last_name }}
                                            </span>
                                        </div>
                                    </div>
                                    <select :value="questionTransfers[question.id] || ''"
                                        @click.stop
                                        @change="setQuestionTransfer(question.id, $event.target.value)"
                                        class="shrink-0 w-[7.5rem] h-8 px-1.5 text-[11px] rounded-lg outline-none border-0 transition-colors duration-200"
                                        :class="questionTransfers[question.id]
                                            ? 'bg-emerald-100/90 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                                            : 'bg-white/90 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400'">
                                        <option value="" disabled>مقصد...</option>
                                        <option v-for="cat in otherCategories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                                    </select>
                                </div>
                            </div>

                            <div v-if="transferPendingCount > 0"
                                class="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-xl px-3 py-2 mb-2">
                                {{ formatNumber(transferPendingCount) }} سوال هنوز مقصد ندارند.
                            </div>
                        </template>
                    </template>
                </template>

                <div class="flex flex-col sm:flex-row sm:justify-end gap-2.5 border-t border-gray-100 dark:border-gray-800 mt-2 pt-4">
                    <button type="button" @click="closeDeleteModal"
                        class="w-full sm:w-auto px-5 py-2.5 text-sm font-bold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors">
                        انصراف
                    </button>
                    <button type="button" @click="deleteCategory" :disabled="deleteLoading || !canConfirmDelete"
                        class="w-full sm:w-auto px-5 py-2.5 text-sm font-bold rounded-xl disabled:opacity-50 shadow-sm transition-colors"
                        :class="deleteSheetHasQuestions
                            ? 'bg-amber-500 hover:bg-amber-600 text-gray-900 shadow-amber-500/30'
                            : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'">
                        <span v-if="deleteLoading">در حال پردازش...</span>
                        <span v-else-if="deleteSheetHasQuestions && transferMode === 'per_question'">
                            انتقال تکی و حذف دسته
                        </span>
                        <span v-else-if="deleteSheetHasQuestions">
                            انتقال {{ formatNumber(categoryForDelete?.questions_count) }} سوال و حذف
                        </span>
                        <span v-else>حذف دسته‌بندی</span>
                    </button>
                </div>
            </BottomSheetDrawer>

            <!-- Questions Bottom Sheet -->
            <BottomSheetDrawer v-model="showQuestionsSheet" :initialHeight="0.78" :maxHeight="0.95" :minHeight="0.5"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="sheetPanelClass" :contentClass="sheetContentClass" :backdropClass="sheetBackdropClass">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">سوالات دسته‌بندی</h3>
                        <p v-if="selectedCategory" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {{ selectedCategory.title }}
                            <span v-if="questionsSheetFilter === 'published'" class="text-emerald-600"> — منتشر شده</span>
                            <span class="mx-1">·</span>
                            {{ formatNumber(categoryQuestions.length) }} مورد
                        </p>
                    </div>
                    <button type="button" @click="closeQuestionsSheet"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 p-1.5">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div v-if="!questionsLoading" class="relative mb-3">
                    <input v-model="questionsSheetSearch" type="text" placeholder="جستجو در سوالات این دسته..."
                        class="w-full h-8 ps-9 pe-3 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 outline-none" />
                    <svg class="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>

                <div v-if="questionsLoading" class="py-12 text-center text-sm text-gray-500">در حال بارگذاری سوالات...</div>
                <div v-else-if="filteredSheetQuestions.length === 0" class="py-12 text-center text-sm text-gray-500">
                    سوالی یافت نشد.
                </div>
                <div v-else class="space-y-2">
                    <div v-for="question in filteredSheetQuestions" :key="question.id"
                        class="flex items-center gap-3 p-2.5 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition-colors">
                        <div class="min-w-0 flex-1">
                            <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{{ question.title }}</div>
                            <div v-if="question.user" class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                {{ question.user.first_name }} {{ question.user.last_name }}
                            </div>
                        </div>
                        <div class="flex shrink-0 items-center gap-1.5">
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                                :class="question.publish ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'">
                                {{ question.publish ? 'منتشر' : 'پیش‌نویس' }}
                            </span>
                            <router-link :to="{ name: 'admin-question-details', params: { id: question.id } }"
                                @click="closeQuestionsSheet"
                                class="text-[10px] font-semibold text-blue-600 hover:text-blue-500 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                جزئیات
                            </router-link>
                        </div>
                    </div>
                </div>
            </BottomSheetDrawer>

            <LoadingComponent v-if="loading" class="" />
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import { showToastSuccess, showToastError } from "@/utils/toastConfig";
import debounce from "lodash/debounce";

const SHEET_PANEL = 'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]';
const SHEET_PANEL_SM = 'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]';
const DELETE_SHEET_PANEL = 'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[30rem] lg:max-w-[30rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]';
const DELETE_SHEET_PANEL_SM = DELETE_SHEET_PANEL;
const SHEET_CONTENT = 'px-4 pb-4 overflow-auto custom-scrollbar';
const SHEET_BACKDROP = 'z-50 bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm';

export default {
    components: {
        AdminMasterPage,
        AdminReportStatCard,
        LoadingComponent,
        PaginationComponent,
        BottomSheetDrawer,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        Popover,
        PopoverButton,
        PopoverPanel,
        PopoverOverlay,
    },
    data() {
        return {
            categories: [],
            allCategories: [],
            stats: {
                total_categories: 0,
                active_categories: 0,
                inactive_categories: 0,
                empty_categories: 0,
                total_questions: 0,
                published_questions: 0,
                draft_questions: 0,
                avg_questions_per_category: 0,
            },
            loading: false,
            searchQuery: '',
            statusFilter: 'all',
            selectedParentId: null,
            sortBy: 'default',
            pagination: {},
            currentPage: 1,
            perPage: 15,
            perPages: [10, 15, 20, 30, 50],
            selectedIds: [],
            bulkAction: '',
            bulkLoading: false,
            showCategoryModal: false,
            showDeleteModal: false,
            showQuestionsSheet: false,
            categoryMode: 'create',
            categoryFormLoading: false,
            deleteLoading: false,
            deleteQuestionsLoading: false,
            categoryForDelete: null,
            editingCategory: null,
            selectedCategory: null,
            questionsSheetFilter: 'all',
            categoryQuestions: [],
            questionsSheetSearch: '',
            questionsLoading: false,
            toggleLoading: {},
            transferMode: 'bulk',
            transferTargetId: null,
            transferSearch: '',
            deleteQuestions: [],
            deleteQuestionSearch: '',
            questionTransfers: {},
            bulkApplyCategoryId: null,
            selectedDeleteQuestionIds: [],
            categoryForm: {
                title: '',
                english_title: '',
                parent_id: null,
                description: '',
                icon: '',
                status: true,
            },
            sheetPanelClass: SHEET_PANEL,
            sheetPanelClassSm: SHEET_PANEL_SM,
            deleteSheetPanelClass: DELETE_SHEET_PANEL,
            deleteSheetPanelClassSm: DELETE_SHEET_PANEL_SM,
            sheetContentClass: SHEET_CONTENT,
            sheetBackdropClass: SHEET_BACKDROP,
        };
    },
    computed: {
        displayCategories() {
            let list = [...this.categories];

            if (this.statusFilter === 'empty') {
                list = list.filter((c) => !(c.questions_count || 0));
            } else if (this.statusFilter === 'has_questions') {
                list = list.filter((c) => (c.questions_count || 0) > 0);
            }

            switch (this.sortBy) {
                case 'title':
                    list.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'fa'));
                    break;
                case 'questions_desc':
                    list.sort((a, b) => (b.questions_count || 0) - (a.questions_count || 0));
                    break;
                case 'questions_asc':
                    list.sort((a, b) => (a.questions_count || 0) - (b.questions_count || 0));
                    break;
                case 'newest':
                    list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
                    break;
                default:
                    break;
            }

            return list;
        },
        isAllSelected() {
            const ids = this.displayCategories.map((c) => c.id);
            return ids.length > 0 && ids.every((id) => this.selectedIds.includes(id));
        },
        isIndeterminate() {
            const ids = this.displayCategories.map((c) => c.id);
            const selectedOnPage = ids.filter((id) => this.selectedIds.includes(id)).length;
            return selectedOnPage > 0 && selectedOnPage < ids.length;
        },
        filteredSheetQuestions() {
            const q = this.questionsSheetSearch.trim().toLowerCase();
            if (!q) return this.categoryQuestions;
            return this.categoryQuestions.filter((item) =>
                (item.title || '').toLowerCase().includes(q)
                || (item.slug || '').toLowerCase().includes(q)
            );
        },
        deleteSheetHasQuestions() {
            return (this.categoryForDelete?.questions_count || 0) > 0;
        },
        deleteSheetInitialHeight() {
            if (!this.deleteSheetHasQuestions) return 0.42;
            if (this.transferMode === 'per_question') return 0.88;
            return 0.68;
        },
        transferCategoriesPool() {
            const map = new Map();
            this.allCategories.forEach((cat) => map.set(cat.id, cat));
            this.categories.forEach((cat) => {
                if (!map.has(cat.id)) map.set(cat.id, cat);
            });
            return Array.from(map.values());
        },
        otherCategories() {
            if (!this.categoryForDelete) return [];
            return this.transferCategoriesPool
                .filter((c) => c.id !== this.categoryForDelete.id)
                .sort((a, b) => (a.title || '').localeCompare(b.title || '', 'fa'));
        },
        transferTargetOptions() {
            const q = this.transferSearch.trim().toLowerCase();
            return this.otherCategories.filter((c) =>
                !q || (c.title || '').toLowerCase().includes(q) || (c.slug || '').toLowerCase().includes(q)
            );
        },
        selectedTransferCategory() {
            if (!this.transferTargetId) return null;
            return this.transferCategoriesPool.find((c) => c.id === this.transferTargetId) || null;
        },
        filteredDeleteQuestions() {
            const q = this.deleteQuestionSearch.trim().toLowerCase();
            if (!q) return this.deleteQuestions;
            return this.deleteQuestions.filter((item) =>
                (item.title || '').toLowerCase().includes(q)
                || (item.slug || '').toLowerCase().includes(q)
            );
        },
        transferAssignedCount() {
            return this.deleteQuestions.filter((q) => !!this.questionTransfers[q.id]).length;
        },
        transferPendingCount() {
            return this.deleteQuestions.length - this.transferAssignedCount;
        },
        transferProgressPercent() {
            if (!this.deleteQuestions.length) return 0;
            return Math.round((this.transferAssignedCount / this.deleteQuestions.length) * 100);
        },
        transferProgressComplete() {
            return this.deleteQuestions.length > 0 && this.transferPendingCount === 0;
        },
        allDeleteQuestionsSelected() {
            return this.deleteQuestions.length > 0
                && this.selectedDeleteQuestionIds.length === this.deleteQuestions.length;
        },
        isIndeterminateDeleteSelection() {
            const count = this.selectedDeleteQuestionIds.length;
            return count > 0 && count < this.deleteQuestions.length;
        },
        canConfirmDelete() {
            if (!this.categoryForDelete) return false;
            if (!this.deleteSheetHasQuestions) return true;
            if (!this.otherCategories.length) return false;
            if (this.transferMode === 'bulk') return !!this.transferTargetId;
            if (this.deleteQuestionsLoading) return false;
            return this.transferProgressComplete;
        },
    },
    mounted() {
        this.fetchAllCategories();
        this.fetchCategories();
    },
    methods: {
        formatNumber(value) {
            return Number(value || 0).toLocaleString('fa-IR');
        },
        toggleSelectAll(e) {
            const pageIds = this.displayCategories.map((c) => c.id);
            if (e.target.checked) {
                this.selectedIds = [...new Set([...this.selectedIds, ...pageIds])];
            } else {
                this.selectedIds = this.selectedIds.filter((id) => !pageIds.includes(id));
            }
        },
        clearBulkSelection() {
            this.selectedIds = [];
            this.bulkAction = '';
        },
        async executeBulkAction() {
            if (!this.bulkAction || !this.selectedIds.length) return;
            this.bulkLoading = true;
            try {
                const response = await axiosInstance.post('/admin/question-categories/bulk', {
                    ids: this.selectedIds,
                    action: this.bulkAction,
                });
                showToastSuccess(`${this.formatNumber(response.data?.affected ?? this.selectedIds.length)} مورد پردازش شد`);
                this.clearBulkSelection();
                this.fetchCategories();
            } catch (error) {
                showToastError(error.response?.data?.message || 'خطا در عملیات گروهی');
            } finally {
                this.bulkLoading = false;
            }
        },
        refreshData() {
            this.fetchAllCategories();
            this.fetchCategories();
        },
        onFilterChange() {
            this.currentPage = 1;
            this.fetchCategories();
        },
        onStatusFilterChange() {
            this.currentPage = 1;
            this.fetchCategories();
        },
        clearSearch() {
            this.searchQuery = '';
            this.currentPage = 1;
            this.fetchCategories();
        },
        selectPerpage(per) {
            this.perPage = per;
            this.currentPage = 1;
            this.fetchCategories();
        },
        updatePage(page) {
            this.currentPage = page;
            this.fetchCategories();
        },
        getStatusBarClass(category) {
            return category.status
                ? 'bg-emerald-400 dark:bg-emerald-600'
                : 'bg-gray-400 dark:bg-gray-600';
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
        handleSearch: debounce(function() {
            this.currentPage = 1;
            this.fetchCategories();
        }, 500),
        async fetchAllCategories() {
            try {
                const response = await axiosInstance.get('/admin/question-categories/tree');
                this.allCategories = this.flattenCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching all categories:', error);
            }
        },
        flattenCategories(categories, result = []) {
            categories.forEach((cat) => {
                result.push(cat);
                if (cat.children && cat.children.length > 0) {
                    this.flattenCategories(cat.children, result);
                }
            });
            return result;
        },
        async fetchCategories() {
            this.loading = true;
            try {
                const params = {
                    page: this.currentPage,
                    perPage: this.perPage,
                    search: this.searchQuery || undefined,
                    status: this.statusFilter === 'active' ? true
                        : this.statusFilter === 'inactive' ? false
                        : undefined,
                    parent_id: this.selectedParentId !== null ? (this.selectedParentId === '' ? 'null' : this.selectedParentId) : undefined,
                };
                Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
                const response = await axiosInstance.post('/admin/question-categories', params);
                this.categories = response.data.categories.data || response.data.categories;
                this.pagination = response.data.categories;
                if (response.data.stats) {
                    this.stats = response.data.stats;
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                showToastError(error.response?.data?.message || 'خطایی در دریافت اطلاعات رخ داد.');
            } finally {
                this.loading = false;
            }
        },
        clearFilters() {
            this.searchQuery = '';
            this.statusFilter = 'all';
            this.selectedParentId = null;
            this.sortBy = 'default';
            this.currentPage = 1;
            this.fetchCategories();
        },
        openCreateModal() {
            this.categoryMode = 'create';
            this.categoryForm = {
                title: '',
                english_title: '',
                parent_id: null,
                description: '',
                icon: '',
                status: true,
            };
            this.editingCategory = null;
            this.showCategoryModal = true;
        },
        editCategory(category) {
            this.categoryMode = 'edit';
            this.editingCategory = category;
            this.categoryForm = {
                title: category.title,
                english_title: category.english_title,
                parent_id: category.parent_id,
                description: category.description || '',
                icon: category.icon || '',
                status: !!category.status,
            };
            this.showCategoryModal = true;
        },
        closeCategoryModal() {
            this.showCategoryModal = false;
            this.editingCategory = null;
        },
        async submitCategoryForm() {
            this.categoryFormLoading = true;
            try {
                const formData = { ...this.categoryForm };
                if (this.categoryMode === 'create') {
                    await axiosInstance.post('/admin/question-category/create', formData);
                    showToastSuccess('دسته‌بندی با موفقیت ایجاد شد.');
                } else {
                    await axiosInstance.post(`/admin/question-category/${this.editingCategory.id}/update`, formData);
                    showToastSuccess('دسته‌بندی با موفقیت به‌روزرسانی شد.');
                }
                this.closeCategoryModal();
                this.fetchAllCategories();
                this.fetchCategories();
            } catch (error) {
                console.error('Error submitting category form:', error);
                showToastError(error.response?.data?.message || 'خطایی رخ داد.');
            } finally {
                this.categoryFormLoading = false;
            }
        },
        async toggleStatus(category) {
            this.toggleLoading = { ...this.toggleLoading, [category.id]: true };
            try {
                await axiosInstance.post(`/admin/question-category/${category.id}/update`, {
                    status: !category.status,
                });
                category.status = !category.status;
                showToastSuccess(category.status ? 'دسته فعال شد' : 'دسته غیرفعال شد');
                this.fetchCategories();
            } catch (error) {
                console.error('Error toggling status:', error);
                showToastError(error.response?.data?.message || 'خطایی در تغییر وضعیت رخ داد.');
            } finally {
                this.toggleLoading = { ...this.toggleLoading, [category.id]: false };
            }
        },
        openDeleteModal(category) {
            this.categoryForDelete = category;
            this.transferMode = (category.questions_count || 0) > 3 ? 'per_question' : 'bulk';
            this.transferTargetId = null;
            this.transferSearch = '';
            this.deleteQuestions = [];
            this.deleteQuestionSearch = '';
            this.questionTransfers = {};
            this.bulkApplyCategoryId = null;
            this.selectedDeleteQuestionIds = [];
            const others = this.transferCategoriesPool.filter((c) => c.id !== category.id);
            if ((category.questions_count || 0) > 0 && others.length === 1) {
                this.transferTargetId = others[0].id;
                this.bulkApplyCategoryId = others[0].id;
            }
            this.showDeleteModal = true;
            if ((category.questions_count || 0) > 0) {
                this.loadDeleteQuestions(category);
            }
        },
        closeDeleteModal() {
            this.categoryForDelete = null;
            this.showDeleteModal = false;
            this.transferMode = 'bulk';
            this.transferTargetId = null;
            this.transferSearch = '';
            this.deleteQuestions = [];
            this.deleteQuestionSearch = '';
            this.questionTransfers = {};
            this.bulkApplyCategoryId = null;
            this.selectedDeleteQuestionIds = [];
            this.deleteQuestionsLoading = false;
        },
        async loadDeleteQuestions(category) {
            this.deleteQuestionsLoading = true;
            try {
                const response = await axiosInstance.get(`/admin/question-category/${category.id}/questions`, {
                    params: { perPage: 500 },
                });
                this.deleteQuestions = response.data.questions?.data || response.data.questions || [];
            } catch (error) {
                showToastError(error.response?.data?.message || 'خطا در دریافت سوالات');
                this.deleteQuestions = [];
            } finally {
                this.deleteQuestionsLoading = false;
            }
        },
        setQuestionTransfer(questionId, value) {
            const categoryId = value ? Number(value) : null;
            if (!categoryId) {
                const next = { ...this.questionTransfers };
                delete next[questionId];
                this.questionTransfers = next;
                return;
            }
            this.questionTransfers = { ...this.questionTransfers, [questionId]: categoryId };
        },
        applyBulkToAll() {
            if (!this.bulkApplyCategoryId) return;
            const next = { ...this.questionTransfers };
            this.deleteQuestions.forEach((q) => {
                next[q.id] = this.bulkApplyCategoryId;
            });
            this.questionTransfers = next;
        },
        applyBulkToSelected() {
            if (!this.bulkApplyCategoryId || !this.selectedDeleteQuestionIds.length) return;
            const next = { ...this.questionTransfers };
            this.selectedDeleteQuestionIds.forEach((id) => {
                next[id] = this.bulkApplyCategoryId;
            });
            this.questionTransfers = next;
        },
        clearQuestionTransfers() {
            this.questionTransfers = {};
            this.selectedDeleteQuestionIds = [];
        },
        isDeleteQuestionSelected(questionId) {
            return this.selectedDeleteQuestionIds.includes(questionId);
        },
        deleteQuestionRowClass(question) {
            const selected = this.isDeleteQuestionSelected(question.id);
            const assigned = !!this.questionTransfers[question.id];

            if (selected) {
                return 'bg-amber-100/90 dark:bg-amber-900/35 hover:bg-amber-100 dark:hover:bg-amber-900/40';
            }
            if (assigned) {
                return 'bg-emerald-50/90 dark:bg-emerald-950/25 hover:bg-emerald-50 dark:hover:bg-emerald-950/30';
            }
            return 'bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-800/70';
        },
        toggleDeleteQuestionSelection(questionId, event) {
            if (event.target.closest('select')) return;
            const idx = this.selectedDeleteQuestionIds.indexOf(questionId);
            if (idx === -1) {
                this.selectedDeleteQuestionIds = [...this.selectedDeleteQuestionIds, questionId];
            } else {
                this.selectedDeleteQuestionIds = this.selectedDeleteQuestionIds.filter((id) => id !== questionId);
            }
        },
        toggleSelectAllDeleteQuestions(event) {
            if (event.target.checked) {
                this.selectedDeleteQuestionIds = this.deleteQuestions.map((q) => q.id);
            } else {
                this.selectedDeleteQuestionIds = [];
            }
        },
        buildDeletePayload() {
            if (!this.deleteSheetHasQuestions) return undefined;
            if (this.transferMode === 'bulk') {
                return { transfer_to: this.transferTargetId };
            }
            return {
                transfers: this.deleteQuestions.map((q) => ({
                    question_id: q.id,
                    category_id: this.questionTransfers[q.id],
                })),
            };
        },
        formatDeleteSuccessMessage(response) {
            const summary = response.data?.transfer_summary;
            if (summary?.length) {
                const parts = summary.map((row) =>
                    `${this.formatNumber(row.count)} سوال → «${row.category?.title || '—'}»`
                );
                return `دسته حذف شد. ${parts.join(' · ')}`;
            }
            const transferred = response.data?.transferred_questions;
            const targetTitle = response.data?.transfer_to?.title;
            if (transferred && targetTitle) {
                return `${this.formatNumber(transferred)} سوال به «${targetTitle}» منتقل شد و دسته حذف شد`;
            }
            return 'دسته‌بندی با موفقیت حذف شد';
        },
        async deleteCategory() {
            if (!this.categoryForDelete || !this.canConfirmDelete) return;
            this.deleteLoading = true;
            try {
                const payload = this.buildDeletePayload();
                const response = await axiosInstance.delete(
                    `/admin/question-category/${this.categoryForDelete.id}`,
                    payload ? { data: payload } : undefined
                );
                showToastSuccess(this.formatDeleteSuccessMessage(response));
                this.closeDeleteModal();
                this.fetchAllCategories();
                this.fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                showToastError(error.response?.data?.message || 'خطایی در حذف رخ داد.');
            } finally {
                this.deleteLoading = false;
            }
        },
        async openQuestionsSheet(category, filter = 'all') {
            this.selectedCategory = category;
            this.questionsSheetFilter = filter;
            this.categoryQuestions = [];
            this.questionsSheetSearch = '';
            this.showQuestionsSheet = true;
            this.questionsLoading = true;
            try {
                const response = await axiosInstance.get(`/admin/question-category/${category.id}/questions`, {
                    params: {
                        perPage: 100,
                        published_only: filter === 'published' ? 1 : undefined,
                    },
                });
                this.categoryQuestions = response.data.questions?.data || response.data.questions || [];
            } catch (error) {
                showToastError(error.response?.data?.message || 'خطا در دریافت سوالات');
            } finally {
                this.questionsLoading = false;
            }
        },
        closeQuestionsSheet() {
            this.showQuestionsSheet = false;
            this.selectedCategory = null;
            this.categoryQuestions = [];
            this.questionsSheetSearch = '';
        },
    },
};
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.category-icon :deep(svg) {
    width: 1.25rem;
    height: 1.25rem;
}

.custom-checkbox::after {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    display: none;
    color: white;
    font-size: 13px;
    font-weight: bold;
    line-height: 1;
    text-align: center;
    user-select: none;
}

.custom-checkbox.is-checked::after {
    content: '✔';
    display: block;
    margin-top: 1px;
}

.custom-checkbox.is-indeterminate::after {
    content: '−';
    display: block;
    margin-top: -1px;
    font-size: 16px;
    font-weight: 700;
}
</style>