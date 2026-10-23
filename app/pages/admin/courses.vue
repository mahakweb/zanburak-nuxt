<script setup>
import { useAuthStore } from '@/stores/auth'
definePageMeta({
  name: "admin-courses-list",
  middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link v-can="'courses.create'" :to="{ name: 'admin-course-create' }"
                class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                    class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        ایجاد دوره جدید
                        <svg class="w-[0.85rem] h-[0.85rem] ms-2" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 3a1 1 0 0 0-1 1v7H4a1 1 0 1 0 0 2h7v7a1 1 0 1 0 2 0v-7h7a1 1 0 1 0 0-2h-7V4a1 1 0 0 0-1-1z"
                                fill="currentColor"></path>
                        </svg>
                    </span>
                </span></router-link>
            <button @click.prevent="getData"
                class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                    class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        تازه‌سازی داده‌ها
                        <svg class="w-4 h-4 rtl:ms-1 -mt-0.5" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4V10H10" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                            <path d="M20 20V14H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                            <path d="M4 10C4 10 6 4 12 4C18 4 20 10 20 10" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M20 14C20 14 18 20 12 20C6 20 4 14 4 14" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </span>
                </span></button>
        </template>
        <div class="min-w-0">
            <AdminBulkActionBar :count="selectedIds.length">
                <button v-can="'courses.delete'" type="button" @click.prevent="openDeleteCourseModal(selectedIds, true)"
                    class="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50">
                    حذف
                </button>
                <button type="button" @click="selectedIds = []"
                    class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    لغو انتخاب
                </button>
            </AdminBulkActionBar> 
            <AdminListFilterBar
                v-model:search="searchQuery"
                search-placeholder="جستجو عنوان، توضیحات..."
                @search="handleSearch"
                @clear-search="clearSearch"
                @clear-filters="clearFilters"
            >
                <AdminFilterSelect v-model="filterPublish" label="وضعیت انتشار" :options="publishOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterType" label="نوع دوره" :options="typeOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterCategory" label="دسته‌بندی" :options="categoryOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterStatus" label="وضعیت" :options="statusOptions" min-width="sm" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterSort" label="مرتب‌سازی" :options="sortOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="dataView" label="نمایش" :options="viewOptions" />
            </AdminListFilterBar>

            <AdminStatusLegend :items="publishLegendItems" />

            <div id="data-list">
                <div v-if="dataView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 pt-1">
                    <article
                        v-for="item in items"
                        v-show="!loading"
                        :key="item.id"
                        class="group flex flex-col rounded-xl border border-gray-200/80 bg-white transition-all hover:border-amber-300/70 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-amber-500/30"
                    >
                        <div class="relative aspect-[16/9] overflow-visible bg-gray-100 dark:bg-gray-800">
                            <router-link
                                :to="{ name: 'admin-course-details', params: { courseSlug: item.slug } }"
                                class="block h-full w-full overflow-hidden rounded-t-xl"
                            >
                                <img
                                    v-if="item.poster"
                                    :src="item.poster"
                                    :alt="item.title"
                                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                    onerror="this.style.display='none'"
                                />
                                <div
                                    v-else
                                    class="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600"
                                >
                                    <svg class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m9 9 6 3-6 3V9Z" />
                                    </svg>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/75 via-gray-900/15 to-transparent" />
                            </router-link>

                            <div class="absolute top-2.5 start-2.5 z-10" @click.stop>
                                <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                            </div>

                            <div class="absolute top-2.5 end-2.5 z-10" @click.stop>
                                <AdminCourseRowActions
                                    :course="item"
                                    tone="overlay"
                                    @publish-action="openPublishModal"
                                    @delete="onRowDelete"
                                />
                            </div>

                            <div class="pointer-events-none absolute bottom-2.5 start-2.5 end-2.5 flex items-end justify-between gap-2">
                                <span
                                    class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm"
                                    :class="publishBadgeClass(item)"
                                >
                                    <span class="h-1.5 w-1.5 rounded-full bg-white/90" />
                                    {{ publishLabel(item) }}
                                </span>
                                <span class="rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm font-anjoman">
                                    {{ formatDuration(item.total_time) }}
                                </span>
                            </div>
                        </div>

                        <div class="flex flex-1 flex-col gap-2.5 p-3">
                            <div class="min-w-0">
                                <router-link
                                    :to="{ name: 'admin-course-details', params: { courseSlug: item.slug } }"
                                    class="block hover:opacity-80 transition-opacity"
                                >
                                    <h3
                                        class="text-[13px] font-bold leading-5 text-gray-900 line-clamp-2 dark:text-white"
                                        :title="item.title"
                                    >
                                        {{ item.title }}
                                    </h3>
                                </router-link>
                                <span
                                    v-if="item.allows_installment"
                                    class="mt-1 inline-flex items-center rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-300"
                                >خرید اقساطی</span>
                                <p
                                    v-if="item.short_description"
                                    class="mt-1 text-[11px] leading-5 text-gray-500 line-clamp-2 dark:text-gray-400"
                                >
                                    {{ item.short_description }}
                                </p>
                            </div>

                            <div class="flex flex-wrap items-center gap-1 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                <span class="rounded-md bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">{{ typeLabel(item.type) }}</span>
                                <span class="rounded-md bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">{{ item.section_count }} فصل</span>
                                <span class="rounded-md bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">{{ item.episode_count }} قسمت</span>
                                <span v-if="item.status?.title" class="rounded-md bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">{{ item.status.title }}</span>
                            </div>

                            <div v-if="item.categories?.length" class="flex flex-wrap items-center gap-1">
                                <span
                                    v-for="cat in item.categories.slice(0, 3)"
                                    :key="cat.id"
                                    class="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                >{{ cat.title }}</span>
                                <span v-if="item.categories.length > 3" class="text-[10px] text-gray-400">+{{ item.categories.length - 3 }}</span>
                            </div>

                            <div class="mt-auto flex items-center gap-2 border-t border-gray-100 pt-2.5 dark:border-gray-800">
                                <AdminCourseTeacherCell
                                    v-if="item.teacher && showTeacherColumn"
                                    :teacher="item.teacher"
                                    compact
                                    class="min-w-0 flex-1"
                                />

                                <div class="flex shrink-0 items-center gap-1">
                                    <router-link
                                        :to="{ name: 'admin-course-details', params: { courseSlug: item.slug } }"
                                        class="inline-flex h-8 items-center justify-center rounded-lg bg-gray-900 px-2.5 text-[11px] font-bold text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                                    >
                                        جزئیات
                                    </router-link>
                                    <router-link
                                        :to="{ name: 'admin-course-edit', params: { courseSlug: item.slug } }"
                                        class="inline-flex h-8 items-center justify-center rounded-lg bg-gray-100 px-2.5 text-[11px] font-bold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                    >
                                        ویرایش
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </article>

                    <p v-if="!loading && !items.length" class="col-span-full py-12 text-center text-sm text-gray-400">دوره‌ای یافت نشد</p>
                </div>
                <div v-else class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-2 whitespace-nowrap text-start">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">پوستر</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">جزییات دوره</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت انتشار</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">مدت زمان</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">سرفصل‌ها</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">نوع دوره</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">دسته‌بندی(ها)</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت دوره</th>
                                <th v-if="showTeacherColumn" class="px-1 py-3 whitespace-nowrap text-start">مدرس</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="item in items" v-show="!loading" :key="item.id"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-amber-50/40 dark:hover:bg-gray-800/60 transition-colors">
                                <td class="relative ps-2 pe-2 py-3 whitespace-nowrap text-start">
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                        :class="publishBarClass(item)"></div>
                                    <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="flex items-center">
                                        <router-link
                                            :to="{ name: 'admin-course-details', params: { courseSlug: item.slug } }"
                                            class="flex-shrink-0 w-28 h-16 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-100 dark:border-opacity-10 overflow-hidden">
                                            <img onerror="this.style.display='none'"
                                                class="w-full h-full object-cover hover:scale-105 duration-150"
                                                :src="item.poster" :alt="item.title" />
                                        </router-link>
                                    </div>
                                </td>
                                <td class="px-1 py-3  text-start">
                                    <router-link
                                        :to="{ name: 'admin-course-details', params: { courseSlug: item.slug } }"
                                        class="flex items-center hover:opacity-80 transition-opacity">
                                        <div class="ms-2 w-48">
                                            <div class="mb-2 text-gray-900 dark:text-white font-bold line-clamp-1"
                                                :title="item.title">
                                                {{ item.title }}
                                            </div>
                                            <div class="text-gray-500 text-xs line-clamp-2">{{ item.short_description }}
                                            </div>
                                        </div>
                                    </router-link>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <button type="button" class="whitespace-nowrap flex items-center text-xs font-medium px-2 py-1 rounded-lg"
                                        :class="publishChipClass(item)"
                                        @click="openQuickPublish(item)">
                                        {{ publishLabel(item) }}
                                    </button>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        {{ new Date(item.total_time * 1000).toISOString().slice(11, 19) }}
                                        <svg class="ms-1 w-4 h-4" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M11.0055 2H12.9945C14.3805 1.99999 15.4828 1.99999 16.3716 2.0738C17.2819 2.14939 18.0575 2.30755 18.7658 2.67552C19.8617 3.24477 20.7552 4.13829 21.3245 5.23415C21.6925 5.94253 21.8506 6.71811 21.9262 7.62839C22 8.51722 22 9.6195 22 11.0055V12.9945C22 14.3805 22 15.4828 21.9262 16.3716C21.8506 17.2819 21.6925 18.0575 21.3245 18.7658C20.7552 19.8617 19.8617 20.7552 18.7658 21.3245C18.0575 21.6925 17.2819 21.8506 16.3716 21.9262C15.4828 22 14.3805 22 12.9945 22H11.0055C9.6195 22 8.51722 22 7.62839 21.9262C6.71811 21.8506 5.94253 21.6925 5.23415 21.3245C4.13829 20.7552 3.24477 19.8617 2.67552 18.7658C2.30755 18.0575 2.14939 17.2819 2.0738 16.3716C1.99999 15.4828 1.99999 14.3805 2 12.9945V11.0055C1.99999 9.61949 1.99999 8.51721 2.0738 7.62839C2.14939 6.71811 2.30755 5.94253 2.67552 5.23415C3.24477 4.13829 4.13829 3.24477 5.23415 2.67552C5.94253 2.30755 6.71811 2.14939 7.62839 2.0738C8.51721 1.99999 9.61949 1.99999 11.0055 2ZM7.79391 4.06694C7.00955 4.13207 6.53142 4.25538 6.1561 4.45035C5.42553 4.82985 4.82985 5.42553 4.45035 6.1561C4.25538 6.53142 4.13207 7.00955 4.06694 7.79391C4.0008 8.59025 4 9.60949 4 11.05V12.95C4 14.3905 4.0008 15.4097 4.06694 16.2061C4.13207 16.9905 4.25538 17.4686 4.45035 17.8439C4.82985 18.5745 5.42553 19.1702 6.1561 19.5497C6.53142 19.7446 7.00955 19.8679 7.79391 19.9331C8.59025 19.9992 9.60949 20 11.05 20H12.95C14.3905 20 15.4097 19.9992 16.2061 19.9331C16.9905 19.8679 17.4686 19.7446 17.8439 19.5497C18.5745 19.1702 19.1702 18.5745 19.5497 17.8439C19.7446 17.4686 19.8679 16.9905 19.9331 16.2061C19.9992 15.4097 20 14.3905 20 12.95V11.05C20 9.60949 19.9992 8.59025 19.9331 7.79391C19.8679 7.00955 19.7446 6.53142 19.5497 6.1561C19.1702 5.42553 18.5745 4.82985 17.8439 4.45035C17.4686 4.25538 16.9905 4.13207 16.2061 4.06694C15.4097 4.0008 14.3905 4 12.95 4H11.05C9.60949 4 8.59025 4.0008 7.79391 4.06694ZM11.8284 6.75736C12.3807 6.75736 12.8284 7.20507 12.8284 7.75736V12.7245L16.3553 14.0653C16.8716 14.2615 17.131 14.8391 16.9347 15.3553C16.7385 15.8716 16.1609 16.131 15.6447 15.9347L11.4731 14.349C11.085 14.2014 10.8284 13.8294 10.8284 13.4142V7.75736C10.8284 7.20507 11.2761 6.75736 11.8284 6.75736Z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        {{ item.section_count + ' فصل | ' + item.episode_count + ' قسمت' }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        <span v-if="item.type === 'free'">رایگان</span>
                                        <span v-if="item.type === 'cash'">نقدی</span>
                                        <span v-if="item.type === 'cash-vip'">نقدی/اعضای‌ویژه</span>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div v-if="item.categories.length > 3" class="flex items-center flex-wrap gap-1">
                                        <div v-for="(cat, index) in item.categories" :key="index" v-show="index < 3"
                                            class="w-max whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ cat.title }}
                                        </div>
                                        <div
                                            class="w-max whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            + &nbsp; {{ item.categories.length - 3 }} &nbsp; مورد دیگر
                                        </div>
                                    </div>
                                    <div v-else class="flex items-center flex-wrap gap-1">
                                        <div v-for="(cat, index) in item.categories" :key="index"
                                            class="w-max whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ cat.title }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.4"
                                                d="M2.44922 14.9702C3.51922 18.4102 6.39923 21.0602 9.97923 21.7902"
                                                stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
                                                stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path
                                                d="M2.05078 10.98C2.56078 5.93 6.82078 2 12.0008 2C17.1808 2 21.4408 5.94 21.9508 10.98"
                                                stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
                                                stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M14.0098 21.8C17.5798 21.07 20.4498 18.45 21.5398 15.02"
                                                stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
                                                stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        {{ item.status.title }}
                                    </div>
                                </td>
                                <td v-if="showTeacherColumn" class="px-1 py-3 whitespace-nowrap text-start">
                                    <AdminCourseTeacherCell :teacher="item.teacher" />
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-center">
                                    <AdminCourseRowActions
                                        :course="item"
                                        @publish-action="openPublishModal"
                                        @delete="onRowDelete"
                                    />
                                </td>
                            </tr>
                            <tr class="h-24"></tr>
                        </tbody>
                    </table>
                    <p v-if="!loading && !items.length" class="py-12 text-center text-sm text-gray-400">دوره‌ای یافت نشد</p>
                </div>
            </div>
            <div class="flex lg:flex-row flex-col items-center justify-between gap-4"
                :class="dataView === 'list' ? '-mt-20' : 'mt-4'">
                <div class="">
                    <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                </div>
                <div class="">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">تعداد:</div>
                        <select v-model.number="perPage" @change="onPerPageChange"
                            class="h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[4rem]">
                            <option v-for="p in perPages" :key="p" :value="p">{{ p }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <AdminDeleteCourseModal v-model="showDeleteCourseModal" :course-ids="coursesIdForDelete"
            @deleted="onCoursesDeleted" />
        <AdminCoursePublishReviewModal
            v-model="showPublishModal"
            :course="publishCourse"
            :action="publishAction"
            :kind="reviewKind"
            @updated="onPublishUpdated"
        />
        <LoadingComponent v-if="loading" class="" />
    </AdminMasterPage>
</template>
<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import AdminDeleteCourseModal from "@/views/components/admin/AdminDeleteCourseModal.vue";
import AdminCoursePublishReviewModal from "@/views/components/admin/AdminCoursePublishReviewModal.vue";
import AdminCourseTeacherCell from "@/views/components/admin/AdminCourseTeacherCell.vue";
import AdminCourseRowActions from "@/views/components/admin/AdminCourseRowActions.vue";
import AdminStatusLegend from "@/views/components/admin/AdminStatusLegend.vue";
import AdminListFilterBar from "@/views/components/admin/AdminListFilterBar.vue";
import AdminFilterSelect from "@/views/components/admin/AdminFilterSelect.vue";
import {
    applyPublishResponse,
    publishBadgeClass as publishBadgeTone,
    publishBarClass as publishBarTone,
    publishChipClass as publishChipTone,
    publishLabel as resolvePublishLabel,
    publishStatus,
    COURSE_PUBLISH_APPROVE_PERMS,
    COURSE_PUBLISH_REQUEST_PERMS,
} from "@/utils/coursePublish";

export default {
		setup() { return { authStore: useAuthStore() } },
    components: {
        AdminMasterPage,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        LoadingComponent,
        PaginationComponent,
        AdminDeleteCourseModal,
        AdminCoursePublishReviewModal,
        AdminCourseTeacherCell,
        AdminCourseRowActions,
        AdminStatusLegend,
        AdminListFilterBar,
        AdminFilterSelect,
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        const sortSlugFromUrl = urlParams.get('sort') || 'newest';
        const publishSlugFromUrl = urlParams.get('publish') || 'all';
        const typeSlugFromUrl = urlParams.get('installment') === 'yes'
            ? 'installment'
            : (urlParams.get('type') || 'all');
        const categorySlugFromUrl = urlParams.get('category') || 'all';
        const statusSlugFromUrl = urlParams.get('status') || 'all';
        const publishs = {
            all: {
                title: "همه",
                english_title: "All",
                slug: "all",
                icon: ``
            },
            published: {
                title: "منتشر شده",
                english_title: "published",
                slug: "published",
                icon: ``
            },
            draft: {
                title: "پیش نویس",
                english_title: "draft",
                slug: "draft",
                icon: ``
            },
            pending: {
                title: "در انتظار تایید",
                english_title: "pending",
                slug: "pending",
                icon: ``
            },
            rejected: {
                title: "رد شده",
                english_title: "rejected",
                slug: "rejected",
                icon: ``
            }
        };
        const types = {
            all: {
                title: "همه",
                english_title: "All",
                slug: "all",
                icon: ``
            },
            free: {
                title: "رایگان",
                english_title: "free",
                slug: "free",
                icon: ``
            },
            cash: {
                title: "نقدی",
                english_title: "cash",
                slug: "cash",
                icon: ``
            },
            cash_vip: {
                title: "نقدی/اعضای‌ویژه",
                english_title: "cash-vip",
                slug: "cash-vip",
                icon: ``
            },
            installment: {
                title: "فقط اقساطی",
                english_title: "installment",
                slug: "installment",
                icon: ``
            }

        };
        const categories = {
            all: {
                title: "همه",
                english_title: "All",
                slug: "all",
                icon: ``
            },

        };
        const statuses = {
            all: {
                title: "همه",
                english_title: "All",
                slug: "all",
                icon: ``
            },

        };
        const sort = {
            newest: {
                title: "جدیدترین",
                english_title: "newest",
                slug: "newest",
                icon: ``
            },
            oldest: {
                title: "قدیمی ترین",
                english_title: "oldest",
                slug: "oldest",
                icon: ``
            }
        };
        return {
            urlParams,
            publishs,
            types,
            categories,
            statuses,
            sort,
            filterPublish: publishSlugFromUrl,
            filterType: typeSlugFromUrl,
            filterCategory: categorySlugFromUrl,
            filterStatus: statusSlugFromUrl,
            filterSort: sortSlugFromUrl,
            loading: false,
            errors: null,
            items: [],
            selectedIds: [],
            mounted: false,
            currentPage: this.$route.query.page ? this.$route.query.page : 1,
            pagination: {},
            perPage: 10,
            perPages: [10, 20, 30, 50, 100],
            dataView: 'list',
            showDeleteCourseModal: false,
            coursesIdForDelete: null,
            showPublishModal: false,
            publishCourse: null,
            publishAction: 'request',
            reviewKind: 'publish',
            searchQuery: this.$route.query.search || '',
        };
    },
    computed: {
        publishOptions() {
            return Object.values(this.publishs);
        },
        typeOptions() {
            return Object.values(this.types);
        },
        categoryOptions() {
            return Object.values(this.categories);
        },
        statusOptions() {
            return Object.values(this.statuses);
        },
        sortOptions() {
            return Object.values(this.sort);
        },
        viewOptions() {
            return [
                { value: "list", label: "لیست" },
                { value: "grid", label: "شبکه‌ای" },
            ];
        },
        isAllSelected() {
            return this.items.length > 0 && this.selectedIds.length === this.items.length
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.isAllSelected
        },
        isLoggedin() {
            return this.authStore.status.loggedIn;
        },
        currentUser() {
            return this.authStore.status.userInfo;
        },
        showTeacherColumn() {
            return this.$scopeAny('courses');
        },
        publishLegendItems() {
            return [
                { label: 'در انتظار بررسی', barClass: 'bg-amber-400 dark:bg-amber-500' },
                { label: 'منتشر شده', barClass: 'bg-emerald-400 dark:bg-emerald-600' },
                { label: 'رد شده', barClass: 'bg-rose-400 dark:bg-rose-600' },
                { label: 'پیش‌نویس', barClass: 'bg-gray-400 dark:bg-gray-600' },
            ];
        },
    },
    methods: {
        onFilterChange() {
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        onPerPageChange() {
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        clearSearch() {
            this.searchQuery = '';
            this.onFilterChange();
        },
        updatePage(value) {
            this.currentPage = value;
            this.updateUrlAndFetchData();
        },
        handleSearch() {
            clearTimeout(this._searchTimer);
            this._searchTimer = setTimeout(() => {
                this.currentPage = 1;
                this.mounted = false;
                this.updateUrlAndFetchData();
            }, 1000);
        },
        buildQuery() {
            const params = {
                page: this.currentPage,
                perPage: this.perPage,
            };
            if (this.filterPublish !== 'all') params.publish = this.filterPublish;
            if (this.filterType === 'installment') {
                params.installment = 'yes';
            } else if (this.filterType !== 'all') {
                params.type = this.filterType;
            }
            if (this.filterCategory !== 'all') params.category = this.filterCategory;
            if (this.filterStatus !== 'all') params.status = this.filterStatus;
            if (this.filterSort !== 'newest') params.sort = this.filterSort;
            if (this.searchQuery) params.search = this.searchQuery;
            return params;
        },

        updateUrlAndFetchData() {
            const params = new URLSearchParams(window.location.search);

            params.forEach((value, key) => {
                if (!["publish", "type", "category", "status", "sort", "page", "search"].includes(key)) {
                    // نگه داشتن
                }
            });

            if (this.filterPublish && this.filterPublish !== "all") {
                params.set("publish", this.filterPublish);
            } else {
                params.delete("publish");
            }

            if (this.filterType && this.filterType !== "all") {
                if (this.filterType === "installment") {
                    params.set("installment", "yes");
                    params.delete("type");
                } else {
                    params.set("type", this.filterType);
                    params.delete("installment");
                }
            } else {
                params.delete("type");
                params.delete("installment");
            }

            if (this.filterCategory && this.filterCategory !== "all") {
                params.set("category", this.filterCategory);
            } else {
                params.delete("category");
            }

            if (this.filterStatus && this.filterStatus !== "all") {
                params.set("status", this.filterStatus);
            } else {
                params.delete("status");
            }

            if (this.filterSort && this.filterSort !== "newest") {
                params.set("sort", this.filterSort);
            } else {
                params.delete("sort");
            }

            if (this.currentPage !== 1) {
                params.set("page", this.currentPage);
            } else {
                params.delete("page");
            }

            if (this.searchQuery) {
                params.set("search", this.searchQuery);
            } else {
                params.delete("search");
            }


            const queryString = params.toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
            window.history.pushState(null, "", newUrl);

            this.getData();
        },
        clearFilters() {
            this.filterPublish = 'all';
            this.filterCategory = 'all';
            this.filterStatus = 'all';
            this.filterType = 'all';
            this.filterSort = 'newest';
            this.searchQuery = '';
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        addItemsToObject(targetObjectName, itemList) {
            itemList.forEach(item => {
                const safeKey = item.slug.toLowerCase().replace(/-/g, '_');
                this[targetObjectName][safeKey] = {
                    title: item.title,
                    english_title: item.english_title,
                    slug: item.slug,
                    icon: ''
                };

                // if (this.urlParams.get('level') === item.slug || this.urlParams.get('level') === item.slug.toLowerCase().replace(/-/g, '_')) {
                //     this.selectedLevel = this[targetObjectName][safeKey];
                // }
            });
        },
        getInitData() {
            axiosInstance
                .post("admin/course/layouts/getInitData")
                .then((response) => {
                    this.addItemsToObject('categories', response.data.categories);
                    this.addItemsToObject('statuses', response.data.statuses);
                    // this.addItemsToObject('levels', response.data.levels);
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {

                });
        },
        async getData() {
            this.loading = true;
            const params = this.buildQuery();
            await axiosInstance
                .post("admin/courses", params)
                .then((response) => {
                    this.items = response.data.courses;
                    this.currentPage = response.data.pagination.current_page;
                    this.pagination = response.data.pagination;
                    if (this.mounted)
                        setTimeout(() => {
                            document.getElementById('data-list').scrollIntoView({ behavior: 'smooth' });
                        }, 200)

                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.loading = false;
                    this.mounted = true;
                });
        },
        onCoursesDeleted({ deletedIds }) {
            const idsToRemove = deletedIds || [];
            this.items = this.items.filter(item => !idsToRemove.includes(item.id));
            this.selectedIds = this.selectedIds.filter(id => !idsToRemove.includes(id));
            this.closeDeleteCourseModal();
            this.mounted = false;
            this.getData();

            if (idsToRemove.length > 1) {
                setTimeout(() => {
                    document.getElementById('data-list')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        },
        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedIds = this.items.map(item => item.id)
            } else {
                this.selectedIds = []
            }
        },
        formatFileSize(bytes, decimal = 1, lang = 'en') {
            const units = {
                fa: ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'],
                en: ['B', 'KB', 'MB', 'GB']
            };

            const selectedUnits = units[lang] || units['en'];

            if (bytes < 1024) {
                return `${bytes} ${selectedUnits[0]}`;
            }
            if (bytes < 1024 * 1024) {
                return `${(bytes / 1024).toFixed(decimal)} ${selectedUnits[1]}`;
            }
            if (bytes < 1024 * 1024 * 1024) {
                return `${(bytes / (1024 * 1024)).toFixed(decimal)} ${selectedUnits[2]}`;
            }
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(decimal)} ${selectedUnits[3]}`;
        },


        publishBadgeClass(item) {
            return publishBadgeTone(item);
        },
        publishBarClass(item) {
            return publishBarTone(item);
        },
        publishChipClass(item) {
            return publishChipTone(item);
        },
        typeLabel(type) {
            if (type === 'free') return 'رایگان';
            if (type === 'cash') return 'نقدی';
            if (type === 'cash-vip') return 'نقدی/اعضای‌ویژه';
            return type || '—';
        },
        publishLabel(item) {
            return resolvePublishLabel(item);
        },
        defaultPublishAction(item) {
            const status = publishStatus(item);
            if (status === 'pending') {
                return this.$can(COURSE_PUBLISH_APPROVE_PERMS) ? 'review' : 'cancel';
            }
            if (status === 'published') return this.$can(COURSE_PUBLISH_APPROVE_PERMS) ? 'unpublish' : null;
            if (this.$can(COURSE_PUBLISH_APPROVE_PERMS)) return 'publish';
            if (this.$can(COURSE_PUBLISH_REQUEST_PERMS)) return 'request';
            return 'request';
        },
        openQuickPublish(item) {
            const action = this.defaultPublishAction(item);
            if (!action) return;
            if (action === 'unpublish' && !this.$can(COURSE_PUBLISH_APPROVE_PERMS)) return;
            if (action === 'cancel' && !this.$can(COURSE_PUBLISH_REQUEST_PERMS)) return;
            if (action === 'request' && !this.$can(COURSE_PUBLISH_REQUEST_PERMS) && !this.$can(COURSE_PUBLISH_APPROVE_PERMS)) return;
            this.openPublishModal({ action, course: item });
        },
        openPublishModal({ action, course }) {
            this.publishCourse = course;
            this.publishAction = action;
            this.reviewKind = String(action || '').startsWith('delete') ? 'delete' : 'publish';
            this.showPublishModal = true;
        },
        onPublishUpdated(payload) {
            if (!payload) {
                this.getData();
                return;
            }
            if (payload.deleted) {
                this.items = this.items.filter((row) => row.id !== payload.id && row.slug !== payload.slug);
                this.selectedIds = this.selectedIds.filter((id) => id !== payload.id);
                this.getData();
                return;
            }
            const item = this.items.find((row) => row.id === payload.id || row.slug === payload.slug);
            if (item) applyPublishResponse(item, payload);
            else this.getData();
        },
        formatDuration(totalTime) {
            if (!totalTime) return '—';
            const raw = new Date(totalTime * 1000).toISOString().slice(11, 19);
            return raw.startsWith('00:') ? raw.slice(3) : raw;
        },
        onRowDelete(course) {
            this.openDeleteCourseModal(course?.id);
        },
        openDeleteCourseModal(value) {
            this.coursesIdForDelete = value;
            this.showDeleteCourseModal = true;
        },
        closeDeleteCourseModal() {
            this.coursesIdForDelete = null;
            this.showDeleteCourseModal = false;
        },
    },
    mounted() {
        document.title = "لیست دوره‌ها";
        this.getInitData();
        this.getData();
    }
};
</script>

