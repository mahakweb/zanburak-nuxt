<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-articles' }"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                بازگشت به مقالات
            </router-link>
            <button v-can="['articles.categories.manage', 'articles.update.any']" @click.prevent="openCreateSheet"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center gap-1.5">
                    افزودن دسته‌بندی
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5V19M5 12H19" />
                    </svg>
                </span>
            </button>
            <button @click="fetchCategories"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                بروزرسانی
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
                <AdminReportStatCard title="فعال" :value="formatNumber(stats.active_categories)" accent="amber" subtitle="قابل استفاده در سایت" />
                <AdminReportStatCard title="غیرفعال" :value="formatNumber(stats.inactive_categories)" accent="amber" />
                <AdminReportStatCard title="بدون مقاله" :value="formatNumber(stats.empty_categories)" accent="amber" subtitle="دسته خالی" />
                <AdminReportStatCard title="کل مقالات" :value="formatNumber(stats.total_articles)" accent="amber" />
                <AdminReportStatCard title="منتشر شده" :value="formatNumber(stats.published_articles)" accent="amber" />
                <AdminReportStatCard title="پیش‌نویس" :value="formatNumber(stats.draft_articles)" accent="amber" />
                <AdminReportStatCard title="میانگین / دسته" :value="formatNumber(stats.avg_articles_per_category)" accent="amber" subtitle="مقاله به ازای هر دسته" />
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

            <AdminListFilterBar
                v-model:search="searchQuery"
                search-placeholder="جستجو در عنوان، اسلاگ یا توضیحات..."
                @clear-search="searchQuery = ''"
                @clear-filters="clearFilters"
            >
                <AdminFilterSelect v-model="statusFilter" label="وضعیت" :options="statusFilterOptions" min-width="lg" />
                <AdminFilterSelect v-model="sortBy" label="مرتب‌سازی" :options="sortOptions" min-width="lg" />
            </AdminListFilterBar>

            <div class="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{{ formatNumber(displayCategories.length) }} دسته‌بندی نمایش داده می‌شود</span>
                <span v-if="stats.featured_articles > 0">{{ formatNumber(stats.featured_articles) }} مقاله ویژه در کل دسته‌ها</span>
            </div>

            <!-- Table -->
            <div id="data-list">
                <AdminInlineLoading v-if="loading" />

                <div v-else class="overflow-x-auto md:custom-scrollbar">
                    <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-2 py-3 w-10">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-2 py-3 whitespace-nowrap text-start lg:min-w-[12rem]">دسته‌بندی</th>
                                <th class="px-2 py-3 whitespace-nowrap text-start">اسلاگ</th>
                                <th class="px-2 py-3 whitespace-nowrap text-start">وضعیت</th>
                                <th class="px-2 py-3 whitespace-nowrap text-start">مقالات</th>
                                <th class="px-2 py-3 whitespace-nowrap text-start">منتشر</th>
                                <th class="px-2 py-3 whitespace-nowrap text-start">پیش‌نویس</th>
                                <th class="px-2 py-3 whitespace-nowrap text-start">ویژه</th>
                                <th class="px-2 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-if="!displayCategories.length">
                                <td colspan="9" class="px-3 py-12 text-center text-gray-400">دسته‌بندی یافت نشد.</td>
                            </tr>
                            <tr v-for="category in displayCategories" :key="category.id"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-amber-50/40 dark:hover:bg-gray-800/60 transition-colors">
                                <td class="relative ps-2 pe-2 py-3" @click.stop>
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                        :class="category.status ? 'bg-emerald-400' : 'bg-gray-400'"></div>
                                    <AdminBulkCheckbox v-model="selectedIds" :value="category.id" />
                                </td>
                                <td class="px-2 py-3 text-start lg:min-w-[12rem]">
                                    <div>
                                        <div class="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{{ category.title }}</div>
                                        <div v-if="category.description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 max-w-xs">
                                            {{ category.description }}
                                        </div>
                                        <div v-if="category.english_title" class="text-[10px] text-gray-400 mt-0.5 font-sans" dir="ltr">
                                            {{ category.english_title }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-2 py-3 text-start">
                                    <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg font-sans" dir="ltr">
                                        {{ category.slug || '—' }}
                                    </span>
                                </td>
                                <td class="px-2 py-3 text-start">
                                    <button
                                        type="button"
                                        @click="toggleStatus(category)"
                                        :disabled="toggleLoading[category.id]"
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
                                        title="کلیک برای تغییر وضعیت"
                                    >
                                        {{ category.status ? 'فعال' : 'غیرفعال' }}
                                    </button>
                                </td>
                                <td class="px-2 py-3 text-start">
                                    <button
                                        type="button"
                                        @click="openArticlesSheet(category)"
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg w-max font-anjoman hover:opacity-80 transition-opacity"
                                    >
                                        {{ category.articles_count || 0 }}
                                    </button>
                                </td>
                                <td class="px-2 py-3 text-start">
                                    <button
                                        type="button"
                                        @click="openArticlesSheet(category, 'published')"
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg w-max font-anjoman hover:opacity-80 transition-opacity"
                                    >
                                        {{ category.published_articles_count || 0 }}
                                    </button>
                                </td>
                                <td class="px-2 py-3 text-start">
                                    <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg w-max font-anjoman inline-block">
                                        {{ category.draft_articles_count || 0 }}
                                    </span>
                                </td>
                                <td class="px-2 py-3 text-start">
                                    <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg w-max font-anjoman inline-block">
                                        {{ category.featured_articles_count || 0 }}
                                    </span>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap text-center">
                                    <Popover class="group relative flex items-center justify-center">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                        <PopoverButton
                                            class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none flex items-center justify-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z" fill="currentColor"/>
                                                <path d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z" fill="currentColor"/>
                                                <path d="M10 2C10 0.89543 9.10457 0 8 0C6.89543 0 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z" fill="currentColor"/>
                                            </svg>
                                        </PopoverButton>
                                        <transition
                                            enter-active-class="transition duration-200 ease-out"
                                            enter-from-class="translate-y-1 opacity-0"
                                            enter-to-class="translate-y-0 opacity-100"
                                            leave-active-class="transition duration-150 ease-in"
                                            leave-from-class="translate-y-0 opacity-100"
                                            leave-to-class="translate-y-1 opacity-0"
                                        >
                                            <PopoverPanel
                                                class="text-start flex flex-col z-30 end-0 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-900 dark:divide-gray-800"
                                            >
                                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                    <li>
                                                        <button
                                                            type="button"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            @click="openArticlesSheet(category)"
                                                        >مشاهده مقالات</button>
                                                    </li>
                                                    <li v-can="['articles.categories.manage', 'articles.update.any']">
                                                        <button
                                                            type="button"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            @click="openEditSheet(category)"
                                                        >ویرایش</button>
                                                    </li>
                                                    <li v-can="['articles.categories.manage', 'articles.update.any']">
                                                        <button
                                                            type="button"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-500 dark:text-red-400"
                                                            @click="openDeleteSheet(category)"
                                                        >حذف</button>
                                                    </li>
                                                </ul>
                                            </PopoverPanel>
                                        </transition>
                                    </Popover>
                                </td>
                            </tr>
                            <tr class="h-12"></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Create / Edit Bottom Sheet -->
        <BottomSheetDrawer v-model="showFormSheet" :initialHeight="0.72" :maxHeight="0.95" :minHeight="0.55"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="sheetPanelClass" :contentClass="sheetContentClass" :backdropClass="sheetBackdropClass">
            <div class="flex items-center justify-between mb-5">
                <div>
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ categoryMode === 'create' ? 'افزودن دسته‌بندی' : 'ویرایش دسته‌بندی' }}
                    </h3>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">اطلاعات دسته‌بندی مقالات را وارد کنید</p>
                </div>
                <button type="button" @click="closeFormSheet"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 p-1.5">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="space-y-3">
                <div>
                    <label class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">عنوان</label>
                    <input v-model="categoryForm.title" type="text" :class="fieldClass('title')" placeholder="مثلاً برنامه‌نویسی" />
                    <span v-if="errors.title" class="mt-1 text-rose-500 text-xs font-medium">{{ errors.title[0] }}</span>
                </div>
                <div>
                    <label class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">عنوان انگلیسی (اسلاگ)</label>
                    <input v-model="categoryForm.english_title" type="text" dir="ltr" :class="fieldClass('english_title')"
                        placeholder="e.g. programming" @input="filterEnglishTitle" />
                    <span v-if="errors.english_title" class="mt-1 text-rose-500 text-xs font-medium">{{ errors.english_title[0] }}</span>
                    <p v-if="editingCategory?.slug" class="text-xs text-gray-400 mt-1">اسلاگ فعلی: <code dir="ltr">{{ editingCategory.slug }}</code></p>
                </div>
                <div>
                    <label class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">توضیحات</label>
                    <textarea v-model="categoryForm.description" rows="3" :class="baseInputClass" placeholder="توضیح کوتاه درباره این دسته..."></textarea>
                </div>
                <div>
                    <label class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">وضعیت انتشار</label>
                    <ul class="h-10 grid w-full grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <li>
                            <input id="cat-status-0" v-model="categoryForm.status" type="radio" :value="false" class="hidden peer" />
                            <label for="cat-status-0"
                                class="h-full inline-flex items-center justify-center w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                <span class="text-xs font-semibold">غیرفعال</span>
                            </label>
                        </li>
                        <li>
                            <input id="cat-status-1" v-model="categoryForm.status" type="radio" :value="true" class="hidden peer" />
                            <label for="cat-status-1"
                                class="h-full inline-flex items-center justify-center w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                <span class="text-xs font-semibold">فعال</span>
                            </label>
                        </li>
                    </ul>
                </div>
                <details class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
                    <summary class="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none">تنظیمات پیشرفته</summary>
                    <div class="mt-3 space-y-3">
                        <div>
                            <label class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">اولویت نمایش</label>
                            <input v-model.number="categoryForm.order" type="number" min="0" :class="baseInputClass" />
                            <p class="text-xs text-gray-400 mt-1">عدد کمتر = نمایش زودتر در لیست دسته‌ها (فقط در فرم، ستون جدا ندارد)</p>
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">آیکون (اختیاری)</label>
                            <input v-model="categoryForm.icon" type="text" dir="ltr" :class="baseInputClass" placeholder="icon-name or emoji" />
                        </div>
                    </div>
                </details>
            </div>
            <div class="flex justify-end gap-3 mt-6">
                <button type="button" @click="closeFormSheet"
                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700">
                    انصراف
                </button>
                <button type="button" @click="submitCategoryForm" :disabled="categoryFormLoading"
                    class="px-5 py-2.5 text-sm font-semibold text-gray-900 bg-yellow-400 rounded-xl hover:bg-yellow-500 disabled:opacity-50 shadow-sm">
                    {{ categoryFormLoading ? 'در حال ذخیره...' : 'ذخیره' }}
                </button>
            </div>
        </BottomSheetDrawer>

        <!-- Delete Bottom Sheet -->
        <BottomSheetDrawer v-model="showDeleteSheet"
            :initialHeight="deleteSheetInitialHeight"
            :maxHeight="0.95"
            :minHeight="deleteSheetHasArticles ? 0.6 : 0.38"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="deleteSheetHasArticles ? sheetPanelClass : sheetPanelClassSm"
            :contentClass="sheetContentClass" :backdropClass="sheetBackdropClass">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">حذف دسته‌بندی</h3>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {{ deleteSheetHasArticles ? 'مقالات را منتقل کنید، سپس دسته حذف می‌شود' : 'این عملیات قابل بازگشت نیست' }}
                    </p>
                </div>
                <button type="button" @click="closeDeleteSheet"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 p-1.5">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <template v-if="!deleteSheetHasArticles">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    آیا از حذف دسته‌بندی «<strong>{{ categoryToDelete?.title }}</strong>» مطمئن هستید؟
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
                                حذف «{{ categoryToDelete?.title }}» — {{ formatNumber(categoryToDelete.articles_count) }} مقاله
                            </p>
                            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                قبل از حذف، مقصد هر مقاله را مشخص کنید.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Mode toggle -->
                <ul class="h-10 grid w-full grid-cols-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                    <li>
                        <input id="transfer-mode-bulk" v-model="transferMode" type="radio" value="bulk" class="hidden peer" />
                        <label for="transfer-mode-bulk"
                            class="h-full inline-flex items-center justify-center w-full rounded-lg cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-300 peer-checked:text-gray-900 peer-checked:bg-yellow-400">
                            انتقال یکجا
                        </label>
                    </li>
                    <li>
                        <input id="transfer-mode-per" v-model="transferMode" type="radio" value="per_article" class="hidden peer" />
                        <label for="transfer-mode-per"
                            class="h-full inline-flex items-center justify-center w-full rounded-lg cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-300 peer-checked:text-gray-900 peer-checked:bg-yellow-400">
                            انتقال تکی
                        </label>
                    </li>
                </ul>

                <!-- Bulk mode -->
                <template v-if="transferMode === 'bulk'">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="flex-1 min-w-0 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 px-3 py-2.5">
                            <p class="text-[10px] font-medium text-rose-600 dark:text-rose-400 mb-0.5">حذف می‌شود</p>
                            <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ categoryToDelete?.title }}</p>
                            <p class="text-[10px] text-gray-500 mt-0.5 font-anjoman">{{ formatNumber(categoryToDelete?.articles_count) }} مقاله</p>
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
                                <div class="text-[10px] text-gray-500">{{ formatNumber(cat.articles_count) }} مقاله</div>
                            </div>
                        </button>
                    </div>
                </template>

                <!-- Per-article mode -->
                <template v-else>
                    <div v-if="deleteArticlesLoading" class="py-10 text-center text-sm text-gray-500 mb-4">
                        در حال بارگذاری مقالات...
                    </div>
                    <template v-else>
                        <!-- Progress -->
                        <div class="mb-4">
                            <div class="flex items-center justify-between text-xs mb-1.5">
                                <span class="text-gray-600 dark:text-gray-400">پیشرفت تخصیص</span>
                                <span class="font-semibold font-anjoman"
                                    :class="transferProgressComplete ? 'text-emerald-600' : 'text-amber-600'">
                                    {{ formatNumber(transferAssignedCount) }} / {{ formatNumber(deleteArticles.length) }}
                                </span>
                            </div>
                            <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-300"
                                    :class="transferProgressComplete ? 'bg-emerald-500' : 'bg-amber-400'"
                                    :style="{ width: transferProgressPercent + '%' }"></div>
                            </div>
                        </div>

                        <!-- Bulk apply toolbar -->
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
                                <button type="button" @click="applyBulkToSelected" :disabled="!bulkApplyCategoryId || !selectedDeleteArticleIds.length"
                                    class="h-8 px-3 text-xs font-semibold rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-40">
                                    انتخاب‌شده ({{ formatNumber(selectedDeleteArticleIds.length) }})
                                </button>
                                <button type="button" @click="clearArticleTransfers"
                                    class="h-8 px-3 text-xs font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200">
                                    پاک کردن
                                </button>
                            </div>
                            <div class="flex items-center justify-between gap-2">
                                <label class="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                    <input type="checkbox" :checked="allDeleteArticlesSelected"
                                        :indeterminate.prop="isIndeterminateDeleteSelection"
                                        @change="toggleSelectAllDeleteArticles"
                                        class="appearance-none shrink-0 w-5 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-gray-50 dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
                                        :class="[
                                            allDeleteArticlesSelected ? 'is-checked bg-yellow-400' : '',
                                            isIndeterminateDeleteSelection ? 'is-indeterminate bg-yellow-400' : '',
                                        ]" />
                                    انتخاب همه
                                </label>
                                <div class="relative flex-1 max-w-xs">
                                    <input v-model="deleteArticleSearch" type="text" placeholder="جستجو..."
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
                            <div v-for="article in filteredDeleteArticles" :key="article.id"
                                @click="toggleDeleteArticleSelection(article.id, $event)"
                                class="flex items-center gap-2.5 p-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                :class="deleteArticleRowClass(article)">
                                <input type="checkbox" :checked="isDeleteArticleSelected(article.id)"
                                    tabindex="-1" aria-hidden="true"
                                    class="shrink-0 appearance-none w-5 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 checked:bg-yellow-400 focus:outline-none transition relative custom-checkbox pointer-events-none"
                                    :class="isDeleteArticleSelected(article.id) ? 'is-checked bg-yellow-400' : ''" />
                                <div class="shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                    <img v-if="article.cover_image" :src="article.cover_image" :alt="article.title"
                                        class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{{ article.title }}</div>
                                    <div class="flex items-center gap-1.5 mt-0.5">
                                        <span class="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                                            :class="article.publish ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'">
                                            {{ article.publish ? 'منتشر' : 'پیش‌نویس' }}
                                        </span>
                                    </div>
                                </div>
                                <select :value="articleTransfers[article.id] || ''"
                                    @click.stop
                                    @change="setArticleTransfer(article.id, $event.target.value)"
                                    class="shrink-0 w-[7.5rem] h-8 px-1.5 text-[11px] rounded-lg outline-none border-0 transition-colors duration-200"
                                    :class="articleTransfers[article.id]
                                        ? 'bg-emerald-100/90 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                                        : 'bg-white/90 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400'">
                                    <option value="" disabled>مقصد...</option>
                                    <option v-for="cat in otherCategories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                                </select>
                            </div>
                        </div>

                        <div v-if="transferPendingCount > 0"
                            class="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-xl px-3 py-2 mb-2">
                            {{ formatNumber(transferPendingCount) }} مقاله هنوز مقصد ندارند.
                        </div>
                    </template>
                </template>
            </template>

            <div class="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-2 pt-4">
                <button type="button" @click="closeDeleteSheet"
                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700">
                    انصراف
                </button>
                <button type="button" @click="confirmDelete"
                    :disabled="deleteLoading || !canConfirmDelete"
                    class="px-5 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-50 shadow-lg transition-colors"
                    :class="deleteSheetHasArticles
                        ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                        : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'">
                    <span v-if="deleteLoading">در حال پردازش...</span>
                    <span v-else-if="deleteSheetHasArticles && transferMode === 'per_article'">
                        انتقال تکی و حذف دسته
                    </span>
                    <span v-else-if="deleteSheetHasArticles">
                        انتقال {{ formatNumber(categoryToDelete?.articles_count) }} مقاله و حذف
                    </span>
                    <span v-else>حذف دسته‌بندی</span>
                </button>
            </div>
        </BottomSheetDrawer>

        <!-- Articles Bottom Sheet -->
        <BottomSheetDrawer v-model="showArticlesSheet" :initialHeight="0.78" :maxHeight="0.95" :minHeight="0.5"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="sheetPanelClass" :contentClass="sheetContentClass" :backdropClass="sheetBackdropClass">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">مقالات دسته‌بندی</h3>
                    <p v-if="selectedCategory" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {{ selectedCategory.title }}
                        <span v-if="articlesSheetFilter === 'published'" class="text-emerald-600"> — منتشر شده</span>
                        <span class="mx-1">·</span>
                        {{ formatNumber(categoryArticles.length) }} مورد
                    </p>
                </div>
                <button type="button" @click="closeArticlesSheet"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 p-1.5">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div v-if="!articlesLoading" class="relative mb-3">
                <input v-model="articlesSheetSearch" type="text" placeholder="جستجو در مقالات این دسته..."
                    class="w-full h-8 ps-9 pe-3 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 outline-none" />
                <svg class="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>

            <div v-if="articlesLoading" class="py-12 text-center text-sm text-gray-500">در حال بارگذاری مقالات...</div>
            <div v-else-if="filteredSheetArticles.length === 0" class="py-12 text-center text-sm text-gray-500">
                مقاله‌ای یافت نشد.
            </div>
            <div v-else class="space-y-2">
                <div v-for="article in filteredSheetArticles" :key="article.id"
                    class="flex items-center gap-3 p-2.5 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition-colors">
                    <div class="shrink-0 w-11 h-11 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img v-if="article.cover_image" :src="article.cover_image" :alt="article.title"
                            class="w-full h-full object-cover" onerror="this.style.display='none'" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{{ article.title }}</div>
                        <div v-if="article.user" class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            {{ article.user.first_name }} {{ article.user.last_name }}
                        </div>
                    </div>
                    <div class="flex shrink-0 items-center gap-1.5">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                            :class="article.publish ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'">
                            {{ article.publish ? 'منتشر' : 'پیش‌نویس' }}
                        </span>
                        <router-link :to="{ name: 'admin-article-details', params: { id: article.id } }"
                            @click="closeArticlesSheet"
                            class="text-[10px] font-semibold text-blue-600 hover:text-blue-500 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            جزئیات
                        </router-link>
                        <router-link v-can="['articles.update', 'articles.update.own', 'articles.update.any']"
                            :to="{ name: 'admin-article-edit', params: { id: article.id } }"
                            @click="closeArticlesSheet"
                            class="text-[10px] font-semibold text-amber-600 hover:text-amber-500 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                            ویرایش
                        </router-link>
                    </div>
                </div>
            </div>
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import AdminListFilterBar from "@/views/components/admin/AdminListFilterBar.vue";
import AdminFilterSelect from "@/views/components/admin/AdminFilterSelect.vue";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import { showToastSuccess, showToastError } from "@/utils/toastConfig";
import { filterEnglishTitle } from "@/utils/validateArticleForm";

const SHEET_PANEL = 'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]';
const SHEET_PANEL_SM = 'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]';
const SHEET_CONTENT = 'px-4 pb-4 overflow-auto custom-scrollbar';
const SHEET_BACKDROP = 'z-50 bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm';

export default {
    components: {
        AdminMasterPage,
        AdminReportStatCard,
        BottomSheetDrawer,
        AdminInlineLoading,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        AdminListFilterBar,
        AdminFilterSelect,
        Popover,
        PopoverButton,
        PopoverPanel,
        PopoverOverlay,
    },
    data() {
        return {
            loading: false,
            categories: [],
            stats: {
                total_categories: 0,
                active_categories: 0,
                inactive_categories: 0,
                empty_categories: 0,
                total_articles: 0,
                published_articles: 0,
                draft_articles: 0,
                featured_articles: 0,
                avg_articles_per_category: 0,
            },
            searchQuery: "",
            statusFilter: "all",
            sortBy: "default",
            selectedIds: [],
            bulkAction: "",
            bulkLoading: false,
            showFormSheet: false,
            showDeleteSheet: false,
            categoryMode: "create",
            categoryFormLoading: false,
            deleteLoading: false,
            editingCategory: null,
            categoryToDelete: null,
            transferMode: "bulk",
            transferTargetId: null,
            transferSearch: "",
            deleteArticlesLoading: false,
            deleteArticles: [],
            deleteArticleSearch: "",
            articleTransfers: {},
            bulkApplyCategoryId: null,
            selectedDeleteArticleIds: [],
            errors: {},
            toggleLoading: {},
            categoryForm: {
                title: "",
                english_title: "",
                description: "",
                icon: "",
                order: 0,
                status: true,
            },
            showArticlesSheet: false,
            selectedCategory: null,
            articlesSheetFilter: "all",
            categoryArticles: [],
            articlesSheetSearch: "",
            articlesLoading: false,
            sheetPanelClass: SHEET_PANEL,
            sheetPanelClassSm: SHEET_PANEL_SM,
            sheetContentClass: SHEET_CONTENT,
            sheetBackdropClass: SHEET_BACKDROP,
            baseInputClass:
                "bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white",
        };
    },
    computed: {
        statusFilterOptions() {
            return [
                { value: "all", label: "همه" },
                { value: "active", label: "فعال" },
                { value: "inactive", label: "غیرفعال" },
                { value: "empty", label: "بدون مقاله" },
                { value: "has_articles", label: "دارای مقاله" },
            ];
        },
        sortOptions() {
            return [
                { value: "default", label: "پیش‌فرض" },
                { value: "title", label: "عنوان (الفبا)" },
                { value: "articles_desc", label: "بیشترین مقاله" },
                { value: "articles_asc", label: "کمترین مقاله" },
                { value: "newest", label: "جدیدترین" },
            ];
        },
        displayCategories() {
            let list = [...this.categories];

            const q = this.searchQuery.trim().toLowerCase();
            if (q) {
                list = list.filter((cat) =>
                    (cat.title || "").toLowerCase().includes(q)
                    || (cat.english_title || "").toLowerCase().includes(q)
                    || (cat.slug || "").toLowerCase().includes(q)
                    || (cat.description || "").toLowerCase().includes(q)
                );
            }

            if (this.statusFilter === "active") list = list.filter((c) => c.status);
            else if (this.statusFilter === "inactive") list = list.filter((c) => !c.status);
            else if (this.statusFilter === "empty") list = list.filter((c) => !(c.articles_count || 0));
            else if (this.statusFilter === "has_articles") list = list.filter((c) => (c.articles_count || 0) > 0);

            switch (this.sortBy) {
                case "title":
                    list.sort((a, b) => (a.title || "").localeCompare(b.title || "", "fa"));
                    break;
                case "articles_desc":
                    list.sort((a, b) => (b.articles_count || 0) - (a.articles_count || 0));
                    break;
                case "articles_asc":
                    list.sort((a, b) => (a.articles_count || 0) - (b.articles_count || 0));
                    break;
                case "newest":
                    list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
                    break;
                default:
                    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.title || "").localeCompare(b.title || "", "fa"));
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
        filteredSheetArticles() {
            const q = this.articlesSheetSearch.trim().toLowerCase();
            if (!q) return this.categoryArticles;
            return this.categoryArticles.filter((a) =>
                (a.title || "").toLowerCase().includes(q)
                || (a.excerpt || "").toLowerCase().includes(q)
            );
        },
        deleteSheetHasArticles() {
            return (this.categoryToDelete?.articles_count || 0) > 0;
        },
        deleteSheetInitialHeight() {
            if (!this.deleteSheetHasArticles) return 0.42;
            if (this.transferMode === "per_article") return 0.88;
            return 0.68;
        },
        otherCategories() {
            if (!this.categoryToDelete) return [];
            return this.categories
                .filter((c) => c.id !== this.categoryToDelete.id)
                .sort((a, b) => (a.title || "").localeCompare(b.title || "", "fa"));
        },
        transferTargetOptions() {
            const q = this.transferSearch.trim().toLowerCase();
            return this.otherCategories.filter((c) =>
                !q || (c.title || "").toLowerCase().includes(q) || (c.slug || "").toLowerCase().includes(q)
            );
        },
        selectedTransferCategory() {
            if (!this.transferTargetId) return null;
            return this.categories.find((c) => c.id === this.transferTargetId) || null;
        },
        filteredDeleteArticles() {
            const q = this.deleteArticleSearch.trim().toLowerCase();
            if (!q) return this.deleteArticles;
            return this.deleteArticles.filter((a) =>
                (a.title || "").toLowerCase().includes(q)
                || (a.excerpt || "").toLowerCase().includes(q)
            );
        },
        transferAssignedCount() {
            return this.deleteArticles.filter((a) => !!this.articleTransfers[a.id]).length;
        },
        transferPendingCount() {
            return this.deleteArticles.length - this.transferAssignedCount;
        },
        transferProgressPercent() {
            if (!this.deleteArticles.length) return 0;
            return Math.round((this.transferAssignedCount / this.deleteArticles.length) * 100);
        },
        transferProgressComplete() {
            return this.deleteArticles.length > 0 && this.transferPendingCount === 0;
        },
        allDeleteArticlesSelected() {
            return this.deleteArticles.length > 0
                && this.selectedDeleteArticleIds.length === this.deleteArticles.length;
        },
        isIndeterminateDeleteSelection() {
            const count = this.selectedDeleteArticleIds.length;
            return count > 0 && count < this.deleteArticles.length;
        },
        canConfirmDelete() {
            if (!this.categoryToDelete) return false;
            if (!this.deleteSheetHasArticles) return true;
            if (!this.otherCategories.length) return false;
            if (this.transferMode === "bulk") return !!this.transferTargetId;
            if (this.deleteArticlesLoading) return false;
            return this.transferProgressComplete;
        },
    },
    mounted() {
        this.fetchCategories();
    },
    methods: {
        formatNumber(value) {
            return Number(value || 0).toLocaleString("fa-IR");
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
            this.bulkAction = "";
        },
        async executeBulkAction() {
            if (!this.bulkAction || !this.selectedIds.length) return;
            this.bulkLoading = true;
            try {
                const response = await axiosInstance.post("/admin/article-categories/bulk", {
                    ids: this.selectedIds,
                    action: this.bulkAction,
                });
                showToastSuccess(`${this.formatNumber(response.data?.affected ?? this.selectedIds.length)} مورد پردازش شد`);
                this.clearBulkSelection();
                this.fetchCategories();
            } catch (error) {
                showToastError(error.response?.data?.message || "خطا در عملیات گروهی");
            } finally {
                this.bulkLoading = false;
            }
        },
        fieldClass(field) {
            return [
                this.baseInputClass,
                this.errors[field] ? "ring-2 ring-rose-500 text-rose-500" : "",
            ];
        },
        filterEnglishTitle() {
            this.categoryForm.english_title = filterEnglishTitle(this.categoryForm.english_title);
        },
        clearFilters() {
            this.searchQuery = "";
            this.statusFilter = "all";
            this.sortBy = "default";
        },
        async fetchCategories() {
            this.loading = true;
            try {
                const response = await axiosInstance.post("/admin/article-categories");
                this.categories = response.data.categories || [];
                if (response.data.stats) {
                    this.stats = response.data.stats;
                }
            } catch (error) {
                showToastError(error.response?.data?.message || "خطا در دریافت دسته‌بندی‌ها");
            } finally {
                this.loading = false;
            }
        },
        openCreateSheet() {
            this.categoryMode = "create";
            this.editingCategory = null;
            this.errors = {};
            this.categoryForm = {
                title: "",
                english_title: "",
                description: "",
                icon: "",
                order: 0,
                status: true,
            };
            this.showFormSheet = true;
        },
        openEditSheet(category) {
            this.categoryMode = "edit";
            this.editingCategory = category;
            this.errors = {};
            this.categoryForm = {
                title: category.title,
                english_title: category.english_title || "",
                description: category.description || "",
                icon: category.icon || "",
                order: category.order ?? 0,
                status: !!category.status,
            };
            this.showFormSheet = true;
        },
        closeFormSheet() {
            this.showFormSheet = false;
            this.editingCategory = null;
            this.errors = {};
        },
        validateForm() {
            this.errors = {};
            if (!(this.categoryForm.title || "").trim()) {
                this.errors.title = ["عنوان الزامی است."];
            } else if (this.categoryForm.title.trim().length < 2) {
                this.errors.title = ["عنوان باید حداقل ۲ کاراکتر باشد."];
            }
            const en = (this.categoryForm.english_title || "").trim();
            if (en && !/^[a-zA-Z0-9 _-]+$/.test(en)) {
                this.errors.english_title = ["فقط حروف انگلیسی، عدد، خط تیره و زیرخط مجاز است."];
            }
            return Object.keys(this.errors).length === 0;
        },
        async submitCategoryForm() {
            if (!this.validateForm()) return;
            this.categoryFormLoading = true;
            try {
                const payload = {
                    ...this.categoryForm,
                    title: this.categoryForm.title.trim(),
                    english_title: this.categoryForm.english_title?.trim() || null,
                    description: this.categoryForm.description?.trim() || null,
                    icon: this.categoryForm.icon?.trim() || null,
                };
                if (this.categoryMode === "create") {
                    await axiosInstance.post("/admin/article-category/create", payload);
                    showToastSuccess("دسته‌بندی ایجاد شد");
                } else {
                    await axiosInstance.post(`/admin/article-category/${this.editingCategory.id}/update`, payload);
                    showToastSuccess("دسته‌بندی به‌روزرسانی شد");
                }
                this.closeFormSheet();
                this.fetchCategories();
            } catch (error) {
                this.errors = error.response?.data?.errors || {};
                showToastError(error.response?.data?.message || "خطایی رخ داد");
            } finally {
                this.categoryFormLoading = false;
            }
        },
        openDeleteSheet(category) {
            this.categoryToDelete = category;
            this.transferMode = (category.articles_count || 0) > 3 ? "per_article" : "bulk";
            this.transferTargetId = null;
            this.transferSearch = "";
            this.deleteArticles = [];
            this.deleteArticleSearch = "";
            this.articleTransfers = {};
            this.bulkApplyCategoryId = null;
            this.selectedDeleteArticleIds = [];
            const others = this.categories.filter((c) => c.id !== category.id);
            if ((category.articles_count || 0) > 0 && others.length === 1) {
                this.transferTargetId = others[0].id;
                this.bulkApplyCategoryId = others[0].id;
            }
            this.showDeleteSheet = true;
            if ((category.articles_count || 0) > 0) {
                this.loadDeleteArticles(category);
            }
        },
        closeDeleteSheet() {
            this.showDeleteSheet = false;
            this.categoryToDelete = null;
            this.transferMode = "bulk";
            this.transferTargetId = null;
            this.transferSearch = "";
            this.deleteArticles = [];
            this.deleteArticleSearch = "";
            this.articleTransfers = {};
            this.bulkApplyCategoryId = null;
            this.selectedDeleteArticleIds = [];
            this.deleteArticlesLoading = false;
        },
        async loadDeleteArticles(category) {
            this.deleteArticlesLoading = true;
            try {
                const response = await axiosInstance.get(`/admin/article-category/${category.id}/articles`, {
                    params: { perPage: 500 },
                });
                this.deleteArticles = response.data.articles?.data || response.data.articles || [];
            } catch (error) {
                showToastError(error.response?.data?.message || "خطا در دریافت مقالات");
                this.deleteArticles = [];
            } finally {
                this.deleteArticlesLoading = false;
            }
        },
        setArticleTransfer(articleId, value) {
            const categoryId = value ? Number(value) : null;
            if (!categoryId) {
                const next = { ...this.articleTransfers };
                delete next[articleId];
                this.articleTransfers = next;
                return;
            }
            this.articleTransfers = { ...this.articleTransfers, [articleId]: categoryId };
        },
        applyBulkToAll() {
            if (!this.bulkApplyCategoryId) return;
            const next = { ...this.articleTransfers };
            this.deleteArticles.forEach((a) => {
                next[a.id] = this.bulkApplyCategoryId;
            });
            this.articleTransfers = next;
        },
        applyBulkToSelected() {
            if (!this.bulkApplyCategoryId || !this.selectedDeleteArticleIds.length) return;
            const next = { ...this.articleTransfers };
            this.selectedDeleteArticleIds.forEach((id) => {
                next[id] = this.bulkApplyCategoryId;
            });
            this.articleTransfers = next;
        },
        clearArticleTransfers() {
            this.articleTransfers = {};
            this.selectedDeleteArticleIds = [];
        },
        isDeleteArticleSelected(articleId) {
            return this.selectedDeleteArticleIds.includes(articleId);
        },
        deleteArticleRowClass(article) {
            const selected = this.isDeleteArticleSelected(article.id);
            const assigned = !!this.articleTransfers[article.id];

            if (selected) {
                return "bg-amber-100/90 dark:bg-amber-900/35 hover:bg-amber-100 dark:hover:bg-amber-900/40";
            }
            if (assigned) {
                return "bg-emerald-50/90 dark:bg-emerald-950/25 hover:bg-emerald-50 dark:hover:bg-emerald-950/30";
            }
            return "bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-800/70";
        },
        toggleDeleteArticleSelection(articleId, event) {
            if (event.target.closest("select")) return;
            const idx = this.selectedDeleteArticleIds.indexOf(articleId);
            if (idx === -1) {
                this.selectedDeleteArticleIds = [...this.selectedDeleteArticleIds, articleId];
            } else {
                this.selectedDeleteArticleIds = this.selectedDeleteArticleIds.filter((id) => id !== articleId);
            }
        },
        toggleSelectAllDeleteArticles(event) {
            if (event.target.checked) {
                this.selectedDeleteArticleIds = this.deleteArticles.map((a) => a.id);
            } else {
                this.selectedDeleteArticleIds = [];
            }
        },
        buildDeletePayload() {
            if (!this.deleteSheetHasArticles) return undefined;
            if (this.transferMode === "bulk") {
                return { transfer_to: this.transferTargetId };
            }
            return {
                transfers: this.deleteArticles.map((a) => ({
                    article_id: a.id,
                    category_id: this.articleTransfers[a.id],
                })),
            };
        },
        formatDeleteSuccessMessage(response) {
            const summary = response.data?.transfer_summary;
            if (summary?.length) {
                const parts = summary.map((row) =>
                    `${this.formatNumber(row.count)} مقاله → «${row.category?.title || "—"}»`
                );
                return `دسته حذف شد. ${parts.join(" · ")}`;
            }
            const transferred = response.data?.transferred_articles;
            const targetTitle = response.data?.transfer_to?.title;
            if (transferred && targetTitle) {
                return `${this.formatNumber(transferred)} مقاله به «${targetTitle}» منتقل شد و دسته حذف شد`;
            }
            return "دسته‌بندی حذف شد";
        },
        async confirmDelete() {
            if (!this.categoryToDelete || !this.canConfirmDelete) return;
            this.deleteLoading = true;
            try {
                const payload = this.buildDeletePayload();
                const response = await axiosInstance.delete(
                    `/admin/article-category/${this.categoryToDelete.id}`,
                    payload ? { data: payload } : undefined
                );
                showToastSuccess(this.formatDeleteSuccessMessage(response));
                this.closeDeleteSheet();
                this.fetchCategories();
            } catch (error) {
                showToastError(error.response?.data?.message || "حذف امکان‌پذیر نیست");
            } finally {
                this.deleteLoading = false;
            }
        },
        async toggleStatus(category) {
            this.toggleLoading = { ...this.toggleLoading, [category.id]: true };
            try {
                await axiosInstance.post(`/admin/article-category/${category.id}/update`, {
                    status: !category.status,
                });
                category.status = !category.status;
                showToastSuccess(category.status ? "دسته فعال شد" : "دسته غیرفعال شد");
                this.fetchCategories();
            } catch (error) {
                showToastError(error.response?.data?.message || "خطا در تغییر وضعیت");
            } finally {
                this.toggleLoading = { ...this.toggleLoading, [category.id]: false };
            }
        },
        async openArticlesSheet(category, filter = "all") {
            this.selectedCategory = category;
            this.articlesSheetFilter = filter;
            this.categoryArticles = [];
            this.articlesSheetSearch = "";
            this.showArticlesSheet = true;
            this.articlesLoading = true;
            try {
                const response = await axiosInstance.get(`/admin/article-category/${category.id}/articles`, {
                    params: {
                        perPage: 100,
                        published_only: filter === "published" ? 1 : undefined,
                    },
                });
                this.categoryArticles = response.data.articles?.data || response.data.articles || [];
            } catch (error) {
                showToastError(error.response?.data?.message || "خطا در دریافت مقالات");
            } finally {
                this.articlesLoading = false;
            }
        },
        closeArticlesSheet() {
            this.showArticlesSheet = false;
            this.selectedCategory = null;
            this.categoryArticles = [];
            this.articlesSheetSearch = "";
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
