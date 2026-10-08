<script setup>
definePageMeta({
  name: "admin-articles",
  middleware: ['auth'],
})
</script>

﻿<template>
    <div class="min-w-0">
            <AdminBulkActionBar v-if="selectedIds.length > 0 && canBulkManage" :count="selectedIds.length">
                <select v-model="bulkAction"
                    class="h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                    <option value="">انتخاب عملیات...</option>
                    <option v-if="!selectedTrashed" value="publish">انتشار</option>
                    <option v-if="!selectedTrashed" value="unpublish">پیش‌نویس</option>
                    <option v-if="!selectedTrashed" value="archive">بایگانی</option>
                    <option v-if="!selectedTrashed" value="feature">ویژه کردن</option>
                    <option v-if="!selectedTrashed" value="unfeature">حذف از ویژه</option>
                    <option v-if="!selectedTrashed" value="delete">حذف</option>
                    <option v-if="selectedTrashed" value="restore">بازیابی</option>
                    <option v-if="selectedTrashed" value="force_delete">حذف دائمی</option>
                </select>
                <button type="button" @click.prevent="executeBulkAction" :disabled="!bulkAction || bulkLoading"
                    class="h-8 px-3 text-xs font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:opacity-50">
                    {{ bulkLoading ? 'در حال انجام...' : 'اعمال' }}
                </button>
                <button type="button" @click="clearBulkSelection"
                    class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    لغو انتخاب
                </button>
            </AdminBulkActionBar>

            <div v-else class="gap-y-2 flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div class="">
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" v-model="searchQuery" @input="handleSearch"
                            class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 pe-8 p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="جستجو در مقالات..." />
                        <button v-if="searchQuery" @click="clearSearch"
                            class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">دسته‌بندی:</div>
                        <select v-model="selectedCategoryId" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[8rem]">
                            <option :value="null">همه</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                        <select v-model="selectedSort" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[9rem]">
                            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت:</div>
                        <select v-model="selectedStatus" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[7rem]">
                            <option :value="null">همه</option>
                            <option value="draft">پیش‌نویس</option>
                            <option value="pending">در انتظار</option>
                            <option value="published">منتشر شده</option>
                            <option value="archived">بایگانی</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">ویژه:</div>
                        <select v-model="selectedIsFeatured" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option :value="null">همه</option>
                            <option :value="true">ویژه</option>
                            <option :value="false">عادی</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">سطل زباله:</div>
                        <select v-model="selectedTrashed" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option :value="false">فعال</option>
                            <option :value="true">حذف‌شده</option>
                        </select>
                    </div>
                    <div class="inline-flex">
                        <button @click.prevent="clearFilters"
                            class="flex items-center justify-center h-8 w-8 bg-rose-400/20 hover:bg-opacity-90 rounded-lg focus:ring-1 ring-rose-500 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800">
                            <svg class="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16.8809 10C14.2609 10 12.1309 12.13 12.1309 14.75C12.1309 15.64 12.3809 16.48 12.8209 17.2C13.6409 18.58 15.1509 19.5 16.8809 19.5C18.6109 19.5 20.1209 18.57 20.9409 17.2C21.3809 16.49 21.6309 15.64 21.6309 14.75C21.6309 12.13 19.5109 10 16.8809 10ZM18.6809 16.52C18.5309 16.67 18.3409 16.74 18.1509 16.74C17.9609 16.74 17.7709 16.67 17.6209 16.52L16.9009 15.8L16.1509 16.55C16.0009 16.7 15.8109 16.77 15.6209 16.77C15.4309 16.77 15.2409 16.7 15.0909 16.55C14.8009 16.26 14.8009 15.78 15.0909 15.49L15.8409 14.74L15.1209 14.01C14.8309 13.72 14.8309 13.24 15.1209 12.95C15.4109 12.66 15.8909 12.66 16.1809 12.95L16.9009 13.67L17.6009 12.97C17.8909 12.68 18.3709 12.68 18.6609 12.97C18.9509 13.26 18.9509 13.74 18.6609 14.03L17.9609 14.73L18.6809 15.46C18.9809 15.75 18.9809 16.23 18.6809 16.52Z"
                                    fill="currentColor" />
                                <path
                                    d="M20.5799 4.02V6.24C20.5799 7.05 20.0799 8.06 19.5799 8.57L19.3999 8.73C19.2599 8.86 19.0499 8.89 18.8699 8.83C18.6699 8.76 18.4699 8.71 18.2699 8.66C17.8299 8.55 17.3599 8.5 16.8799 8.5C13.4299 8.5 10.6299 11.3 10.6299 14.75C10.6299 15.89 10.9399 17.01 11.5299 17.97C12.0299 18.81 12.7299 19.51 13.4899 19.98C13.7199 20.13 13.8099 20.45 13.6099 20.63C13.5399 20.69 13.4699 20.74 13.3999 20.79L11.9999 21.7C10.6999 22.51 8.90992 21.6 8.90992 19.98V14.63C8.90992 13.92 8.50992 13.01 8.10992 12.51L4.31992 8.47C3.81992 7.96 3.41992 7.05 3.41992 6.45V4.12C3.41992 2.91 4.31992 2 5.40992 2H18.5899C19.6799 2 20.5799 2.91 20.5799 4.02Z"
                                    fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
                <label class="w-max flex items-center text-gray-700 dark:text-white text-xs font-semibold cursor-pointer">
                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" class="me-2" />
                    انتخاب همه
                </label>
                <div class="flex flex-wrap items-center justify-end gap-3">
                    <div class="flex items-center gap-1.5">
                        <div class="w-5 h-1 rounded bg-emerald-400"></div>
                        <span class="text-[10px] font-medium text-gray-400">منتشر</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <div class="w-5 h-1 rounded bg-gray-400"></div>
                        <span class="text-[10px] font-medium text-gray-400">پیش‌نویس</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <div class="w-5 h-1 rounded bg-amber-400"></div>
                        <span class="text-[10px] font-medium text-gray-400">در انتظار</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <div class="w-5 h-1 rounded bg-slate-400"></div>
                        <span class="text-[10px] font-medium text-gray-400">بایگانی</span>
                    </div>
                </div>
            </div>

            <div id="data-list">
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 whitespace-nowrap text-start w-10"></th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">کاربر</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">عنوان</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">دسته‌بندی</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">بازدید</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">لایک</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">بوکمارک</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">امتیاز</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">نظر</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">زمان مطالعه</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="article in articles" :key="article.id"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start">
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                        :class="getPublishBarClass(article)"></div>
                                    <AdminBulkCheckbox v-model="selectedIds" :value="article.id" />
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    
                                    <div v-if="article.user" class="flex items-center">
                                        <div
                                            class="flex-shrink-0 w-9 h-9 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-200 border-opacity-30 dark:border-opacity-10 overflow-hidden">
                                            <img onerror="this.style.display='none'" v-if="article.user.profile_pic"
                                                :src="article.user.profile_pic" :alt="article.user.first_name"
                                                class="w-full h-full object-cover" />
                                            <div v-else class="w-full h-full flex items-center justify-center">
                                                <span class="text-amber-400 text-sm font-medium">{{
                                                    article.user.first_name?.charAt(0) || '?' }}</span>
                                            </div>
                                        </div>
                                        <div class="ms-2 min-w-0">
                                            <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {{ article.user.first_name }} {{ article.user.last_name }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                @{{ article.user.username || '-' }}
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-xs text-gray-400">-</div>
                                </td>
                                <td class="px-1 py-3 text-start lg:min-w-[14rem]">
                                    <div class="flex items-center gap-2 max-w-xs min-w-0">
                                        <div
                                            class="shrink-0 w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
                                            <img v-if="article.cover_image" :src="article.cover_image"
                                                :alt="article.title" class="w-full h-full object-cover"
                                                onerror="this.style.display='none'" />
                                            <div v-else
                                                class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {{ article.title }}
                                                <span v-if="article.is_featured"
                                                    class="ms-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">★</span>
                                            </div>
                                            <div v-if="article.excerpt"
                                                class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                                {{ article.excerpt }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div v-if="article.category"
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1 w-max">
                                        {{ article.category.title }}
                                    </div>
                                    <div v-else class="text-xs text-gray-400">-</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg w-max font-anjoman">
                                        {{ article.views_count || 0 }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-900/20 px-2 py-1 rounded-lg w-max font-anjoman">
                                        {{ article.likes_count || 0 }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-100/70 dark:bg-violet-900/20 px-2 py-1 rounded-lg w-max font-anjoman">
                                        {{ article.bookmarks_count || 0 }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/20 px-2 py-1 rounded-lg w-max font-anjoman">
                                        <svg class="w-3.5 h-3.5 shrink-0 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        <span>{{ formatAverageRating(article.average_rating) }}</span>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-100/70 dark:bg-cyan-900/20 px-2 py-1 rounded-lg w-max font-anjoman">
                                        {{ article.comments_count || 0 }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg w-max font-anjoman">
                                        {{ article.reading_time_minutes || 0 }} دقیقه
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                        {{ formatDate(article.created_at) }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-center">
                                    <AdminArticleRowActions
                                        :article="article"
                                        :trashed="selectedTrashed"
                                        @view="viewArticle"
                                        @toggle-publish="togglePublish"
                                        @restore="restoreArticle"
                                        @force-delete="forceDeleteArticle"
                                        @delete="openDeleteModal" />
                                </td>
                            </tr>
                            <tr v-if="!loading && articles.length === 0">
                                <td colspan="12" class="px-4 py-12 text-center">
                                    <div class="text-gray-400 dark:text-gray-500 text-sm font-medium">مقاله‌ای یافت نشد
                                    </div>
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

            <!-- Delete Article Bottom Sheet -->
            <BottomSheetDrawer v-model="showDeleteModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[30rem] lg:max-w-[30rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="text-center py-3">
                    <div class="mx-auto mb-4 w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                        <svg class="w-7 h-7 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">حذف مقاله</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        آیا از حذف این مقاله مطمئن هستید؟ مقاله به سطل زباله منتقل می‌شود.
                    </p>
                </div>
                <div class="shrink-0 -mx-4 px-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:justify-end py-3">
                        <button type="button" @click="closeDeleteModal"
                            class="w-full sm:w-auto flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors">
                            انصراف
                        </button>
                        <button type="button" @click="deleteArticle" :disabled="deleteLoading"
                            class="disabled:opacity-60 w-full sm:w-auto flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/25 transition-colors">
                            {{ deleteLoading ? 'در حال حذف...' : 'حذف' }}
                        </button>
                    </div>
                </div>
            </BottomSheetDrawer>

            <LoadingComponent v-if="loading" class="" />
    </div>
</template>

<script>
import AdminArticleRowActions from "@/views/components/admin/articles/AdminArticleRowActions.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import axiosInstance from "@/store/axiosInstance";
import { showToastSuccess, showToastError } from "@/utils/toastConfig";
import debounce from "lodash/debounce";

export default {
    components: {
        AdminArticleRowActions,
        LoadingComponent,
        PaginationComponent,
        BottomSheetDrawer,
        AdminBulkCheckbox,
        AdminBulkActionBar,
    },
    emits: ['list-total'],
    data() {
        return {
            articles: [],
            categories: [],
            loading: false,
            searchQuery: '',
            selectedCategoryId: null,
            selectedStatus: null,
            selectedSort: 'newest',
            sortOptions: [
                { value: 'newest', label: 'جدیدترین' },
                { value: 'oldest', label: 'قدیمی‌ترین' },
                { value: 'updated', label: 'آخرین ویرایش' },
                { value: 'most_views', label: 'پربازدیدترین' },
                { value: 'most_likes', label: 'بیشترین لایک' },
                { value: 'most_bookmarks', label: 'محبوب‌ترین (بوکمارک)' },
                { value: 'most_comments', label: 'بیشترین نظر' },
                { value: 'most_rating', label: 'بیشترین امتیاز' },
                { value: 'author', label: 'گروه‌بندی نویسنده' },
            ],
            selectedIsFeatured: null,
            selectedTrashed: false,
            pagination: {},
            currentPage: 1,
            perPage: 15,
            perPages: [10, 15, 20, 30, 50],
            selectedIds: [],
            bulkAction: '',
            bulkLoading: false,
            showDeleteModal: false,
            deleteLoading: false,
            articleForDelete: null,
        };
    },
    computed: {
        canBulkManage() {
            return this.$can([
                'articles.update', 'articles.update.own', 'articles.update.any',
                'articles.delete', 'articles.delete.own', 'articles.delete.any',
                'articles.publish', 'articles.publish.own', 'articles.publish.any',
            ]);
        },
        isAllSelected() {
            return this.articles.length > 0 && this.selectedIds.length === this.articles.length;
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.isAllSelected;
        },
    },
    mounted() {
        this.fetchCategories();
        this.fetchArticles().then(() => this.openEditFromQuery());
    },
    watch: {
        '$route.query.edit'(editId) {
            if (editId) {
                this.openEditFromQuery();
            }
        },
    },
    methods: {
        refresh() {
            this.fetchCategories();
            this.fetchArticles();
        },
        openEditFromQuery() {
            const editId = this.$route.query.edit;
            if (!editId) return;
            this.$router.replace({ name: 'admin-article-edit', params: { id: editId } });
        },
        onFilterChange() {
            this.currentPage = 1;
            this.selectedIds = [];
            this.bulkAction = '';
            this.fetchArticles();
        },
        clearSearch() {
            this.searchQuery = '';
            this.currentPage = 1;
            this.fetchArticles();
        },
        selectPerpage(per) {
            this.perPage = per;
            this.currentPage = 1;
            this.fetchArticles();
        },
        updatePage(page) {
            this.currentPage = page;
            this.fetchArticles();
        },
        toggleSelectAll(e) {
            this.selectedIds = e.target.checked ? this.articles.map((a) => a.id) : [];
        },
        getPublishBarClass(article) {
            const map = {
                published: 'bg-emerald-400 dark:bg-emerald-600',
                draft: 'bg-gray-400 dark:bg-gray-600',
                pending: 'bg-amber-400 dark:bg-amber-600',
                archived: 'bg-slate-400 dark:bg-slate-600',
            };
            return map[article.status] || 'bg-gray-400 dark:bg-gray-600';
        },
        formatAverageRating(rating) {
            const n = Number(rating || 0);
            return n.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        },
        formatDate(date) {
            if (!date) return '-';
            const d = new Date(date);
            const dateStr = d.toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            });
            const timeStr = d.toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                hour12: true,
                minute: '2-digit'
            }).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ');
            return `${dateStr}  ${timeStr}`;
        },
        handleSearch: debounce(function () {
            this.currentPage = 1;
            this.fetchArticles();
        }, 500),
        async fetchCategories() {
            try {
                const response = await axiosInstance.post('/admin/article-categories');
                this.categories = response.data.categories || [];
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async fetchArticles() {
            this.loading = true;
            try {
                const params = {
                    page: this.currentPage,
                    perPage: this.perPage,
                    search: this.searchQuery || undefined,
                    category_id: this.selectedCategoryId || undefined,
                    status: this.selectedStatus || undefined,
                    sort: this.selectedSort || undefined,
                    is_featured: this.selectedIsFeatured !== null ? this.selectedIsFeatured : undefined,
                    trashed: this.selectedTrashed || undefined,
                };
                Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
                const response = await axiosInstance.post('/admin/articles', params);
                const paginated = response.data.articles;
                this.articles = paginated.data || paginated;
                this.pagination = {
                    current_page: paginated.current_page,
                    last_page: paginated.last_page,
                    per_page: paginated.per_page,
                    total: paginated.total
                };
                this.$emit('list-total', paginated.total ?? null);
                this.selectedIds = this.selectedIds.filter(id => this.articles.some(a => a.id === id));
            } catch (error) {
                console.error('Error fetching articles:', error);
                showToastError("خطایی در دریافت اطلاعات رخ داد.");
            } finally {
                this.loading = false;
            }
        },
        clearFilters() {
            this.searchQuery = '';
            this.selectedCategoryId = null;
            this.selectedStatus = null;
            this.selectedSort = 'newest';
            this.selectedIsFeatured = null;
            this.selectedTrashed = false;
            this.currentPage = 1;
            this.selectedIds = [];
            this.bulkAction = '';
            this.fetchArticles();
        },
        viewArticle(article) {
            this.$router.push({ name: 'admin-article-details', params: { id: article.id } });
        },
        async togglePublish(article) {
            try {
                await axiosInstance.post(`/admin/article/${article.id}/toggle-publish`);
                showToastSuccess('وضعیت انتشار با موفقیت تغییر کرد.');
                this.fetchArticles();
            } catch (error) {
                console.error('Error toggling publish:', error);
                showToastError('خطایی در تغییر وضعیت رخ داد.');
            }
        },
        async restoreArticle(article) {
            try {
                await axiosInstance.post(`/admin/article/${article.id}/restore`);
                showToastSuccess('مقاله با موفقیت بازیابی شد.');
                this.fetchArticles();
            } catch (error) {
                console.error('Error restoring article:', error);
                showToastError(error.response?.data?.message || 'خطایی در بازیابی رخ داد.');
            }
        },
        async forceDeleteArticle(article) {
            if (!confirm('آیا از حذف دائمی این مقاله مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) return;
            try {
                await axiosInstance.delete(`/admin/article/${article.id}/force`);
                showToastSuccess('مقاله به طور دائمی حذف شد.');
                this.fetchArticles();
            } catch (error) {
                console.error('Error force deleting article:', error);
                showToastError(error.response?.data?.message || 'خطایی در حذف رخ داد.');
            }
        },
        async executeBulkAction() {
            if (!this.bulkAction || this.selectedIds.length === 0) return;
            this.bulkLoading = true;
            try {
                await axiosInstance.post('/admin/articles/bulk', {
                    ids: this.selectedIds,
                    action: this.bulkAction,
                });
                showToastSuccess('عملیات گروهی با موفقیت انجام شد.');
                this.selectedIds = [];
                this.bulkAction = '';
                this.fetchArticles();
            } catch (error) {
                console.error('Error executing bulk action:', error);
                showToastError(error.response?.data?.message || 'خطایی در عملیات گروهی رخ داد.');
            } finally {
                this.bulkLoading = false;
            }
        },
        openDeleteModal(article) {
            this.articleForDelete = article;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.articleForDelete = null;
            this.showDeleteModal = false;
        },
        async deleteArticle() {
            if (!this.articleForDelete) return;
            this.deleteLoading = true;
            try {
                await axiosInstance.delete(`/admin/article/${this.articleForDelete.id}`);
                showToastSuccess('مقاله با موفقیت حذف شد.');
                this.closeDeleteModal();
                this.fetchArticles();
            } catch (error) {
                console.error('Error deleting article:', error);
                showToastError(error.response?.data?.message || 'خطایی در حذف رخ داد.');
            } finally {
                this.deleteLoading = false;
            }
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
</style>
