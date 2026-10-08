<script setup>
definePageMeta({
  name: "admin-quizzes-list",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button @click="refreshData" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    بروزرسانی
                    <svg class="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                    </svg>
                </span>
            </button>
            <router-link :to="{ name: 'admin-quiz-create' }"
                class="shrink-0 h-9 rounded-lg bg-yellow-400 px-3 text-sm font-semibold flex items-center gap-1.5 hover:bg-yellow-300 text-gray-900">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                ایجاد آزمون
            </router-link>
        </template>

        <div class="space-y-4">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <AdminReportStatCard title="کل آزمون‌ها" :value="formatNumber(pagination.total ?? items.length)" accent="cyan">
                    <template #icon>
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="منتشر شده" :value="formatNumber(publishedOnPage)" accent="emerald" subtitle="در صفحه فعلی">
                    <template #icon>
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M3 14C3 9.02944 7.02944 5 12 5C16.9706 5 21 9.02944 21 14M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="پیش‌نویس" :value="formatNumber(draftOnPage)" accent="violet" subtitle="در صفحه فعلی">
                    <template #icon>
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="نیازمند تصحیح" :value="formatNumber(serverStats.pending_review ?? 0)" accent="rose" subtitle="در صف بررسی">
                    <template #icon>
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </template>
                </AdminReportStatCard>
            </div>

            <AdminBulkActionBar :count="selectedIds.length">
                <button type="button" @click="openBulkDelete"
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
                search-placeholder="جستجو عنوان آزمون..."
                @search="handleSearch"
                @clear-search="clearSearch"
                @clear-filters="clearFilters"
            >
                <AdminFilterSelect v-model="publishedFilter" label="وضعیت انتشار" :options="publishedOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="typeFilter" label="نوع اتصال" :options="typeOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="reviewFilter" label="تصحیح" :options="reviewOptions" min-width="sm" @change="onFilterChange" />
                <AdminFilterSelect v-model="dataView" label="نمایش" :options="viewOptions" />
            </AdminListFilterBar>

            <AdminInlineLoading v-if="loading" />

            <div v-else-if="items.length" id="data-list">
                <!-- Grid -->
                <div v-if="dataView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 pt-1">
                    <article
                        v-for="quiz in items"
                        :key="quiz.id"
                        class="group flex flex-col rounded-xl border border-gray-200/80 bg-white p-3 transition-colors hover:border-sky-300/70 hover:bg-sky-50/40 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-sky-500/30 dark:hover:bg-sky-500/5"
                    >
                        <div class="flex items-start gap-2">
                            <AdminBulkCheckbox v-model="selectedIds" :value="quiz.id" class="mt-0.5" />

                            <div
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                :class="typeIconWrap(quiz)"
                            >
                                <AdminQuizAttachIcon :type="shortType(quiz)" bare />
                            </div>

                            <div class="min-w-0 flex-1">
                                <div class="flex items-start justify-between gap-2">
                                    <h3 class="text-[13px] font-bold leading-5 text-gray-900 line-clamp-2 dark:text-white">
                                        {{ quiz.title }}
                                    </h3>
                                    <span
                                        class="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                                        :class="quiz.is_published ? 'bg-emerald-400' : 'bg-gray-300 dark:bg-gray-600'"
                                        :title="publishLabel(quiz)"
                                    ></span>
                                </div>
                                <p class="mt-0.5 text-[11px] text-gray-400 line-clamp-1">
                                    {{ quizzableTitle(quiz) }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-2.5 flex flex-wrap items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                            <span class="rounded-md bg-gray-100 px-1.5 py-0.5 font-medium dark:bg-gray-800">{{ typeLabel(quiz) }}</span>
                            <span class="rounded-md bg-gray-100 px-1.5 py-0.5 font-medium dark:bg-gray-800">{{ quiz.questions_count || 0 }} سوال</span>
                            <span class="rounded-md bg-gray-100 px-1.5 py-0.5 font-medium dark:bg-gray-800">{{ quiz.total_score || 0 }} نمره</span>
                            <span class="rounded-md bg-gray-100 px-1.5 py-0.5 font-medium dark:bg-gray-800">{{ formatTimeLimit(quiz.time_limit) }}</span>
                            <span
                                v-if="quiz.manual_review_required"
                                class="rounded-md bg-violet-50 px-1.5 py-0.5 font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
                            >تصحیح دستی</span>
                        </div>

                        <div class="mt-2.5 flex items-center gap-1.5 border-t border-gray-100 pt-2.5 dark:border-gray-800">
                            <router-link
                                :to="{ name: 'admin-quiz-edit', params: { id: quiz.id } }"
                                class="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-gray-900 text-[11px] font-bold text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                            >
                                ویرایش
                            </router-link>
                            <router-link
                                :to="{ name: 'admin-quiz-reports', params: { id: quiz.id } }"
                                class="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-gray-100 text-[11px] font-bold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                گزارش
                            </router-link>
                            <button
                                type="button"
                                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                title="حذف آزمون"
                                @click="openDelete(quiz)"
                            >
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                </svg>
                            </button>
                        </div>
                    </article>
                </div>

                <!-- Table -->
                <div v-else class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-2 whitespace-nowrap text-start">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">آیکون</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">جزئیات آزمون</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت انتشار</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">سوالات</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">نمره</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">زمان</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">نوع اتصال</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">تصحیح</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="quiz in items" :key="quiz.id"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-amber-50/40 dark:hover:bg-gray-800/60 transition-colors">
                                <td class="relative ps-2 pe-2 py-3 whitespace-nowrap text-start">
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                        :class="quiz.is_published ? 'bg-emerald-400 dark:bg-emerald-600' : 'bg-gray-400 dark:bg-gray-600'"></div>
                                    <AdminBulkCheckbox v-model="selectedIds" :value="quiz.id" />
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="flex-shrink-0 w-16 h-12 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-100 dark:border-opacity-10 flex items-center justify-center">
                                        <AdminQuizAttachIcon :type="shortType(quiz)" />
                                    </div>
                                </td>
                                <td class="px-1 py-3 text-start">
                                    <router-link
                                        :to="{ name: 'admin-quiz-edit', params: { id: quiz.id } }"
                                        class="flex items-center hover:opacity-80 transition-opacity">
                                        <div class="ms-2 w-48">
                                            <div class="mb-2 text-gray-900 dark:text-white font-bold line-clamp-1" :title="quiz.title">
                                                {{ quiz.title }}
                                            </div>
                                            <div class="text-gray-500 text-xs line-clamp-2">{{ quizzableTitle(quiz) }}</div>
                                        </div>
                                    </router-link>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div v-if="quiz.is_published"
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 14C3 9.02944 7.02944 5 12 5C16.9706 5 21 9.02944 21 14M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        منتشر شده
                                    </div>
                                    <div v-else
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.60997 9.60714C8.05503 10.4549 7 12.1043 7 14C7 16.7614 9.23858 19 12 19C13.8966 19 15.5466 17.944 16.3941 16.3878M21 14C21 9.02944 16.9706 5 12 5C11.5582 5 11.1238 5.03184 10.699 5.09334M3 14C3 11.0069 4.46104 8.35513 6.70883 6.71886M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        پیش‌نویس
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        {{ quiz.questions_count || 0 }} سوال
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        {{ quiz.total_score || 0 }} نمره
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        {{ formatTimeLimit(quiz.time_limit) }}
                                        <svg class="ms-1 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0055 2H12.9945C14.3805 1.99999 15.4828 1.99999 16.3716 2.0738C17.2819 2.14939 18.0575 2.30755 18.7658 2.67552C19.8617 3.24477 20.7552 4.13829 21.3245 5.23415C21.6925 5.94253 21.8506 6.71811 21.9262 7.62839C22 8.51722 22 9.6195 22 11.0055V12.9945C22 14.3805 22 15.4828 21.9262 16.3716C21.8506 17.2819 21.6925 18.0575 21.3245 18.7658C20.7552 19.8617 19.8617 20.7552 18.7658 21.3245C18.0575 21.6925 17.2819 21.8506 16.3716 21.9262C15.4828 22 14.3805 22 12.9945 22H11.0055C9.6195 22 8.51722 22 7.62839 21.9262C6.71811 21.8506 5.94253 21.6925 5.23415 21.3245C4.13829 20.7552 3.24477 19.8617 2.67552 18.7658C2.30755 18.0575 2.14939 17.2819 2.0738 16.3716C1.99999 15.4828 1.99999 14.3805 2 12.9945V11.0055C1.99999 9.61949 1.99999 8.51721 2.0738 7.62839C2.14939 6.71811 2.30755 5.94253 2.67552 5.23415C3.24477 4.13829 4.13829 3.24477 5.23415 2.67552C5.94253 2.30755 6.71811 2.14939 7.62839 2.0738C8.51721 1.99999 9.61949 1.99999 11.0055 2ZM7.79391 4.06694C7.00955 4.13207 6.53142 4.25538 6.1561 4.45035C5.42553 4.82985 4.82985 5.42553 4.45035 6.1561C4.25538 6.53142 4.13207 7.00955 4.06694 7.79391C4.0008 8.59025 4 9.60949 4 11.05V12.95C4 14.3905 4.0008 15.4097 4.06694 16.2061C4.13207 16.9905 4.25538 17.4686 4.45035 17.8439C4.82985 18.5745 5.42553 19.1702 6.1561 19.5497C6.53142 19.7446 7.00955 19.8679 7.79391 19.9331C8.59025 19.9992 9.60949 20 11.05 20H12.95C14.3905 20 15.4097 19.9992 16.2061 19.9331C16.9905 19.8679 17.4686 19.7446 17.8439 19.5497C18.5745 19.1702 19.1702 18.5745 19.5497 17.8439C19.7446 17.4686 19.8679 16.9905 19.9331 16.2061C19.9992 15.4097 20 14.3905 20 12.95V11.05C20 9.60949 19.9992 8.59025 19.9331 7.79391C19.8679 7.00955 19.7446 6.53142 19.5497 6.1561C19.1702 5.42553 18.5745 4.82985 17.8439 4.45035C17.4686 4.25538 16.9905 4.13207 16.2061 4.06694C15.4097 4.0008 14.3905 4 12.95 4H11.05C9.60949 4 8.59025 4.0008 7.79391 4.06694ZM11.8284 6.75736C12.3807 6.75736 12.8284 7.20507 12.8284 7.75736V12.7245L16.3553 14.0653C16.8716 14.2615 17.131 14.8391 16.9347 15.3553C16.7385 15.8716 16.1609 16.131 15.6447 15.9347L11.4731 14.349C11.085 14.2014 10.8284 13.8294 10.8284 13.4142V7.75736C10.8284 7.20507 11.2761 6.75736 11.8284 6.75736Z" fill="currentColor"/>
                                        </svg>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        {{ typeLabel(quiz) }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        {{ quiz.manual_review_required ? 'تصحیح دستی' : 'خودکار' }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-center">
                                    <Popover class="group relative flex items-center justify-center">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                        <PopoverButton
                                            class="text-gray-900 dark:text-white me-2 relative group-focus-within:z-30 focus:outline-none flex items-center justify-center">
                                            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z" fill="currentColor"/>
                                                <path d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z" fill="currentColor"/>
                                                <path d="M10 2C10 0.89543 9.10457 -4.82823e-08 8 0C6.89543 4.82823e-08 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z" fill="currentColor"/>
                                            </svg>
                                        </PopoverButton>
                                        <transition enter-active-class="transition duration-200 ease-out"
                                            enter-from-class="translate-y-1 opacity-0"
                                            enter-to-class="translate-y-0 opacity-100"
                                            leave-active-class="transition duration-150 ease-in"
                                            leave-from-class="translate-y-0 opacity-100"
                                            leave-to-class="translate-y-1 opacity-0">
                                            <PopoverPanel
                                                class="text-start flex flex-col z-30 end-10 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-900 dark:divide-gray-800">
                                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                    <li>
                                                        <router-link
                                                            :to="{ name: 'admin-quiz-edit', params: { id: quiz.id } }"
                                                            class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            ویرایش آزمون
                                                        </router-link>
                                                    </li>
                                                    <li>
                                                        <router-link
                                                            :to="{ name: 'admin-quiz-reports', params: { id: quiz.id } }"
                                                            class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            گزارش آزمون
                                                        </router-link>
                                                    </li>
                                                    <li>
                                                        <button type="button"
                                                            @click="openDelete(quiz)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-500 dark:text-red-400">
                                                            حذف آزمون
                                                        </button>
                                                    </li>
                                                </ul>
                                            </PopoverPanel>
                                        </transition>
                                    </Popover>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminEmptyState v-else message="هنوز آزمونی ساخته نشده است.">
                <router-link :to="{ name: 'admin-quiz-create' }" class="inline-block mt-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">+ ساخت اولین آزمون</router-link>
            </AdminEmptyState>

            <div
                v-if="items.length || pagination.total"
                class="mt-4 flex w-full flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-between"
            >
                <div class="w-max max-w-full shrink-0">
                    <PaginationComponent
                        v-if="pagination && pagination.last_page > 1"
                        dir="ltr"
                        :pagination="pagination"
                        class="!w-auto"
                        @updatePage="onPageChanged"
                    />
                </div>
                <div class="w-max shrink-0">
                    <div class="mb-1 px-1 text-xs font-light text-gray-400">تعداد:</div>
                    <select
                        v-model.number="perPage"
                        class="h-8 min-w-[4rem] rounded-lg bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-0 dark:bg-gray-900 dark:text-gray-100"
                        @change="onPerPageChange"
                    >
                        <option v-for="p in perPages" :key="p" :value="p">{{ p }}</option>
                    </select>
                </div>
            </div>
        </div>

        <BottomSheetDrawer v-model="showDeleteSheet" :panel-class="bs.ADMIN_BS_PANEL_SM">
            <AdminBottomSheetConfirm
                :message="deleteConfirmMessage"
                :description="deleteConfirmDescription"
                hint="این عمل قابل بازگشت نیست و تمام گزارش‌های مرتبط حذف می‌شوند."
                :loading="deleting"
                @cancel="closeDeleteSheet"
                @confirm="doDelete"
            />
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>

<script>
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from '@headlessui/vue';
import AdminMasterPage from '@/views/page/admin/layouts/AdminMasterPage.vue';
import AdminInlineLoading from '@/views/components/admin/AdminInlineLoading.vue';
import AdminEmptyState from '@/views/components/admin/AdminEmptyState.vue';
import AdminListFilterBar from '@/views/components/admin/AdminListFilterBar.vue';
import AdminFilterSelect from '@/views/components/admin/AdminFilterSelect.vue';
import AdminReportStatCard from '@/views/components/admin/report/AdminReportStatCard.vue';
import AdminBulkCheckbox from '@/views/components/admin/AdminBulkCheckbox.vue';
import AdminBulkActionBar from '@/views/components/admin/AdminBulkActionBar.vue';
import AdminQuizAttachIcon from '@/views/components/admin/quiz/AdminQuizAttachIcon.vue';
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import AdminBottomSheetConfirm from '@/views/components/admin/bottomSheet/AdminBottomSheetConfirm.vue';
import PaginationComponent from '@/views/components/home/PaginationComponent.vue';
import { BTN_SECONDARY } from '@/views/components/admin/adminFormStepperMixin.js';
import * as bs from '@/views/components/admin/bottomSheet/adminBottomSheetStyles.js';
import debounce from 'lodash/debounce';
import { listQuizzes, deleteQuiz } from '@/services/quiz.service';
import { showToastSuccess, showToastError } from '@/utils/toastConfig';

const TYPE_LABELS = {
    course: 'دوره',
    section: 'فصل',
    episode: 'درس',
    standalone: 'مستقل',
};

export default {
    components: {
        Popover, PopoverButton, PopoverPanel, PopoverOverlay,
        AdminMasterPage, AdminInlineLoading, AdminEmptyState,
        AdminListFilterBar, AdminFilterSelect, AdminReportStatCard,
        AdminBulkCheckbox, AdminBulkActionBar, AdminQuizAttachIcon,
        BottomSheetDrawer, AdminBottomSheetConfirm, PaginationComponent,
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            BTN_SECONDARY,
            bs,
            loading: false,
            deleting: false,
            items: [],
            selectedIds: [],
            pagination: {},
            searchQuery: urlParams.get('search') || '',
            publishedFilter: urlParams.get('published') || '',
            typeFilter: urlParams.get('quizzable_type') || '',
            reviewFilter: urlParams.get('manual_review') || '',
            dataView: urlParams.get('dataView') || 'grid',
            currentPage: parseInt(urlParams.get('page') || '1', 10) || 1,
            perPage: parseInt(urlParams.get('perPage') || '12', 10) || 12,
            serverStats: { pending_review: 0 },
            showDeleteSheet: false,
            deleteTarget: null,
            bulkDeleteIds: null,
            publishedOptions: [
                { value: '', label: 'همه' },
                { value: 'yes', label: 'منتشر شده' },
                { value: 'no', label: 'پیش‌نویس' },
            ],
            typeOptions: [
                { value: '', label: 'همه' },
                { value: 'course', label: 'متصل به دوره' },
                { value: 'section', label: 'متصل به فصل' },
                { value: 'episode', label: 'متصل به درس' },
                { value: 'standalone', label: 'مستقل' },
            ],
            reviewOptions: [
                { value: '', label: 'همه' },
                { value: 'yes', label: 'تصحیح دستی' },
                { value: 'no', label: 'خودکار' },
            ],
            perPages: [12, 24, 48],
        };
    },
    computed: {
        viewOptions() {
            return [
                { value: 'grid', label: 'شبکه‌ای' },
                { value: 'list', label: 'جدول' },
            ];
        },
        publishedOnPage() {
            return this.items.filter(q => q.is_published).length;
        },
        draftOnPage() {
            return this.items.filter(q => !q.is_published).length;
        },
        isAllSelected() {
            return this.items.length > 0 && this.selectedIds.length === this.items.length;
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.isAllSelected;
        },
        deleteConfirmMessage() {
            if (this.bulkDeleteIds?.length > 1) return `حذف ${this.bulkDeleteIds.length} آزمون`;
            return 'حذف آزمون';
        },
        deleteConfirmDescription() {
            if (this.bulkDeleteIds?.length > 1) {
                return `آیا از حذف ${this.bulkDeleteIds.length} آزمون انتخاب‌شده مطمئن هستید؟`;
            }
            if (this.deleteTarget) {
                return `آیا از حذف «${this.deleteTarget.title}» مطمئن هستید؟`;
            }
            return '';
        },
    },
    created() {
        this.debouncedSearch = debounce(() => {
            this.currentPage = 1;
            this.syncUrl();
            this.fetchData();
        }, 1500);
    },
    beforeUnmount() {
        if (this.debouncedSearch?.cancel) this.debouncedSearch.cancel();
    },
    mounted() { this.fetchData(); },
    methods: {
        typeIconWrap(quiz) {
            const map = {
                course: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300',
                section: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300',
                episode: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
                standalone: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300',
            };
            return map[this.shortType(quiz)] || map.standalone;
        },
        formatNumber(v) {
            return Number(v || 0).toLocaleString('fa-IR');
        },
        formatTimeLimit(seconds) {
            if (!seconds) return '∞';
            const mins = Math.round(seconds / 60);
            return `${mins.toLocaleString('fa-IR')}′`;
        },
        shortType(quiz) {
            if (!quiz.quizzable_type) return 'standalone';
            return quiz.quizzable_type.split('\\').pop()?.toLowerCase();
        },
        typeLabel(quiz) {
            return TYPE_LABELS[this.shortType(quiz)] || TYPE_LABELS.standalone;
        },
        publishLabel(quiz) {
            return quiz.is_published ? 'منتشر شده' : 'پیش‌نویس';
        },
        quizzableTitle(quiz) {
            if (!quiz.quizzable) return 'آزمون مستقل';
            return quiz.quizzable.title || ('#' + quiz.quizzable_id);
        },
        buildQueryParams() {
            const params = {
                page: this.currentPage,
                perPage: parseInt(this.perPage, 10) || 12,
            };
            if (this.searchQuery) params.search = this.searchQuery;
            if (this.publishedFilter) params.published = this.publishedFilter;
            if (this.typeFilter) params.quizzable_type = this.typeFilter;
            if (this.reviewFilter) params.manual_review = this.reviewFilter;
            return params;
        },
        syncUrl() {
            const params = new URLSearchParams();
            if (this.searchQuery) params.set('search', this.searchQuery);
            if (this.publishedFilter) params.set('published', this.publishedFilter);
            if (this.typeFilter) params.set('quizzable_type', this.typeFilter);
            if (this.reviewFilter) params.set('manual_review', this.reviewFilter);
            if (this.dataView !== 'grid') params.set('dataView', this.dataView);
            if (this.currentPage > 1) params.set('page', String(this.currentPage));
            if (this.perPage !== 12) params.set('perPage', String(this.perPage));
            const qs = params.toString();
            const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
            window.history.replaceState(null, '', url);
        },
        clearFilters() {
            if (this.debouncedSearch?.cancel) this.debouncedSearch.cancel();
            this.searchQuery = '';
            this.publishedFilter = '';
            this.typeFilter = '';
            this.reviewFilter = '';
            this.dataView = 'grid';
            this.currentPage = 1;
            this.perPage = 12;
            this.syncUrl();
            this.fetchData();
        },
        clearSearch() {
            if (this.debouncedSearch?.cancel) this.debouncedSearch.cancel();
            this.searchQuery = '';
            this.currentPage = 1;
            this.syncUrl();
            this.fetchData();
        },
        onFilterChange() {
            this.currentPage = 1;
            this.syncUrl();
            this.fetchData();
        },
        handleSearch() {
            this.debouncedSearch();
        },
        refreshData() {
            this.fetchData();
        },
        onPageChanged(page) {
            this.currentPage = page;
            this.selectedIds = [];
            this.syncUrl();
            this.fetchData();
        },
        onPerPageChange() {
            this.currentPage = 1;
            this.selectedIds = [];
            this.syncUrl();
            this.fetchData();
        },
        async fetchData() {
            this.loading = true;
            try {
                const res = await listQuizzes(this.buildQueryParams());
                this.items = res.quizzes?.data || [];
                this.serverStats = res.stats || { pending_review: 0 };
                this.pagination = {
                    current_page: res.quizzes?.current_page,
                    last_page: res.quizzes?.last_page,
                    per_page: res.quizzes?.per_page,
                    total: res.quizzes?.total,
                };
            } finally {
                this.loading = false;
            }
        },
        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedIds = this.items.map(q => q.id);
            } else {
                this.selectedIds = [];
            }
        },
        openDelete(quiz) {
            this.deleteTarget = quiz;
            this.bulkDeleteIds = null;
            this.showDeleteSheet = true;
        },
        openBulkDelete() {
            if (!this.selectedIds.length) return;
            this.bulkDeleteIds = [...this.selectedIds];
            this.deleteTarget = null;
            this.showDeleteSheet = true;
        },
        closeDeleteSheet() {
            this.showDeleteSheet = false;
            this.deleteTarget = null;
            this.bulkDeleteIds = null;
        },
        async doDelete() {
            const ids = this.bulkDeleteIds?.length
                ? this.bulkDeleteIds
                : (this.deleteTarget ? [this.deleteTarget.id] : []);
            if (!ids.length) return;

            this.deleting = true;
            try {
                await Promise.all(ids.map(id => deleteQuiz(id)));
                showToastSuccess(ids.length > 1 ? `${ids.length} آزمون حذف شد.` : 'آزمون حذف شد.');
                this.selectedIds = this.selectedIds.filter(id => !ids.includes(id));
                this.closeDeleteSheet();
                this.fetchData();
            } catch {
                showToastError('حذف آزمون با خطا مواجه شد.');
            } finally {
                this.deleting = false;
            }
        },
    },
};
</script>
