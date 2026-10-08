<script setup>
definePageMeta({
  name: "admin-discounts-list",
  middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link v-can="'discounts.create'" :to="{ name: 'admin-discount-create' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    ایجاد کد تخفیف جدید
                    <svg class="w-[0.85rem] h-[0.85rem]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3a1 1 0 0 0-1 1v7H4a1 1 0 1 0 0 2h7v7a1 1 0 1 0 2 0v-7h7a1 1 0 1 0 0-2h-7V4a1 1 0 0 0-1-1z" fill="currentColor" />
                    </svg>
                </span>
            </router-link>
            <button type="button" @click.prevent="getData" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    تازه‌سازی
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4V10H10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20 20V14H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4 10C4 10 6 4 12 4C18 4 20 10 20 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20 14C20 14 18 20 12 20C6 20 4 14 4 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
            </button>
        </template>

        <div class="min-w-0">
            <AdminBulkActionBar :count="selectedIds.length">
                <button v-can="'discounts.delete'" type="button" @click.prevent="openBulkDeleteModal"
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
                search-placeholder="جستجو کد، عنوان..."
                @search="handleSearch"
                @clear-search="clearSearch"
                @clear-filters="clearFilters"
            >
                <AdminFilterSelect v-model="filterStatus" label="وضعیت" :options="statusOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterType" label="نوع تخفیف" :options="typeOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterValidity" label="بازه اعتبار" :options="validityOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterScope" label="محدوده" :options="scopeOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterSort" label="مرتب‌سازی" :options="sortOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="dataView" label="نمایش" :options="viewOptions" />
            </AdminListFilterBar>

            <div id="data-list">
                <AdminInlineLoading v-if="loading" />

                <template v-else-if="items.length">
                    <!-- Grid -->
                    <div v-if="dataView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 pt-1">
                        <article
                            v-for="item in items"
                            :key="item.id"
                            class="group flex flex-col rounded-xl border border-gray-200/80 bg-white p-3 transition-colors hover:border-amber-300/70 hover:bg-amber-50/30 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-amber-500/30 dark:hover:bg-amber-500/5"
                        >
                            <div class="flex items-start gap-2">
                                <AdminBulkCheckbox v-model="selectedIds" :value="item.id" class="mt-0.5" />

                                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <svg class="h-4 w-4 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>

                                <div class="min-w-0 flex-1">
                                    <div class="flex items-start justify-between gap-2">
                                        <h3 class="font-sans text-[13px] font-bold leading-5 text-gray-900 line-clamp-1 dark:text-white" dir="ltr">
                                            {{ item.code }}
                                        </h3>
                                        <span
                                            class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                                            :class="item.is_active ? 'bg-emerald-400' : 'bg-gray-300 dark:bg-gray-600'"
                                            :title="item.is_active ? 'فعال' : 'غیرفعال'"
                                        ></span>
                                    </div>
                                    <p class="mt-0.5 text-[11px] text-gray-400 line-clamp-1">
                                        {{ item.title || 'بدون عنوان' }}
                                    </p>
                                </div>
                            </div>

                            <div class="mt-2.5 flex flex-wrap items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                <span class="rounded-md bg-gray-100 px-1.5 py-0.5 font-medium dark:bg-gray-800">{{ getTypeLabel(item.type) }}</span>
                                <span class="rounded-md bg-gray-100 px-1.5 py-0.5 font-medium dark:bg-gray-800">{{ getValueDisplay(item.type, item.value) }}</span>
                                <span v-if="item.is_public" class="rounded-md bg-amber-100 px-1.5 py-0.5 font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">عمومی</span>
                                <span v-if="item.apply_automatically" class="rounded-md bg-sky-100 px-1.5 py-0.5 font-medium text-sky-800 dark:bg-sky-900/40 dark:text-sky-200">خودکار</span>
                                <span class="rounded-md bg-gray-100 px-1.5 py-0.5 font-medium dark:bg-gray-800">
                                    {{ usageLabel(item) }}
                                </span>
                                <span class="rounded-md bg-gray-100 px-1.5 py-0.5 font-medium dark:bg-gray-800">{{ validityStatusLabel(item) }}</span>
                            </div>

                            <div class="mt-2.5 flex items-center gap-1.5 border-t border-gray-100 pt-2.5 dark:border-gray-800">
                                <router-link
                                    v-can="'discounts.update'"
                                    :to="{ name: 'admin-discount-edit', params: { id: item.id } }"
                                    class="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-gray-900 text-[11px] font-bold text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                                >
                                    ویرایش
                                </router-link>
                                <button
                                    v-can="'discounts.toggle_status'"
                                    type="button"
                                    class="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-gray-100 text-[11px] font-bold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                    @click="toggleDiscountStatus(item)"
                                >
                                    {{ item.is_active ? 'غیرفعال' : 'فعال' }}
                                </button>
                                <button
                                    v-can="'discounts.delete'"
                                    type="button"
                                    class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                    title="حذف کد تخفیف"
                                    @click="openDeleteModal(item)"
                                >
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                    </svg>
                                </button>
                            </div>
                        </article>
                    </div>

                    <!-- List -->
                    <div v-else class="overflow-x-auto md:custom-scrollbar pt-4">
                        <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                <tr class="text-xs font-semibold text-start">
                                    <th class="px-1 py-2 whitespace-nowrap text-start">
                                        <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                    </th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">کد تخفیف</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">عنوان</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">نوع</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">مقدار</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">استفاده</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">محدوده</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">اعتبار</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-start">وضعیت</th>
                                    <th class="px-2 py-3 whitespace-nowrap text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                <tr
                                    v-for="item in items"
                                    :key="item.id"
                                    class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-amber-50/40 dark:hover:bg-gray-800/60 transition-colors"
                                >
                                    <td class="relative ps-2 pe-2 py-3 whitespace-nowrap text-start">
                                        <div
                                            class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                            :class="item.is_active ? 'bg-emerald-400 dark:bg-emerald-600' : 'bg-gray-400 dark:bg-gray-600'"
                                        ></div>
                                        <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                                    </td>
                                    <td class="px-2 py-3 whitespace-nowrap text-start">
                                        <router-link
                                            v-can="'discounts.update'"
                                            :to="{ name: 'admin-discount-edit', params: { id: item.id } }"
                                            class="font-sans font-bold text-xs px-2 py-1 rounded-lg bg-gray-100/70 dark:bg-gray-800/50 hover:opacity-80 transition-opacity"
                                            dir="ltr"
                                        >{{ item.code }}</router-link>
                                        <span v-if="!$can('discounts.update')" class="font-sans font-bold text-xs px-2 py-1 rounded-lg bg-gray-100/70 dark:bg-gray-800/50" dir="ltr">{{ item.code }}</span>
                                    </td>
                                    <td class="px-2 py-3 text-start">
                                        <span class="text-xs font-medium px-2 py-1 rounded-lg bg-gray-100/70 dark:bg-gray-800/50 line-clamp-1 max-w-[10rem]">{{ item.title || 'بدون عنوان' }}</span>
                                    </td>
                                    <td class="px-2 py-3 whitespace-nowrap text-start">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ getTypeLabel(item.type) }}</span>
                                    </td>
                                    <td class="px-2 py-3 whitespace-nowrap text-start">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ getValueDisplay(item.type, item.value) }}</span>
                                    </td>
                                    <td class="px-2 py-3 whitespace-nowrap text-start">
                                        <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ usageLabel(item) }}
                                        </div>
                                    </td>
                                    <td class="px-2 py-3 whitespace-nowrap text-start">
                                        <div class="flex flex-wrap gap-1">
                                            <span v-if="item.is_public" class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">عمومی</span>
                                            <span v-if="item.apply_automatically" class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200">خودکار</span>
                                            <span v-if="!item.is_public && !item.apply_automatically" class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100/70 dark:bg-gray-800/50">کد</span>
                                        </div>
                                    </td>
                                    <td class="px-2 py-3 whitespace-nowrap text-start">
                                        <div class="text-xs space-y-0.5">
                                            <div class="px-2 py-0.5 rounded-lg bg-gray-100/70 dark:bg-gray-800/50 font-medium">{{ validityLabel(item) }}</div>
                                            <div class="px-2 py-0.5 rounded-lg bg-gray-100/70 dark:bg-gray-800/50 font-medium">{{ validityStatusLabel(item) }}</div>
                                        </div>
                                    </td>
                                    <td class="px-2 py-3 whitespace-nowrap text-start">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">{{ item.is_active ? 'فعال' : 'غیرفعال' }}</span>
                                    </td>
                                    <td class="px-2 py-3 whitespace-nowrap text-center">
                                        <Popover class="group relative flex items-center justify-center">
                                            <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
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
                                                        <li v-can="'discounts.update'">
                                                            <router-link
                                                                :to="{ name: 'admin-discount-edit', params: { id: item.id } }"
                                                                class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            >ویرایش</router-link>
                                                        </li>
                                                        <li v-can="'discounts.toggle_status'">
                                                            <button
                                                                type="button"
                                                                class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                @click="toggleDiscountStatus(item)"
                                                            >{{ item.is_active ? 'غیرفعال کردن' : 'فعال کردن' }}</button>
                                                        </li>
                                                        <li v-can="'discounts.delete'">
                                                            <button
                                                                type="button"
                                                                class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-red-100 dark:hover:bg-red-600 text-red-600 dark:text-red-400"
                                                                @click="openDeleteModal(item)"
                                                            >حذف</button>
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
                </template>

                <p v-else class="py-12 text-center text-sm text-gray-400">کد تخفیفی یافت نشد</p>
            </div>

            <div class="flex lg:flex-row flex-col items-center justify-between gap-4" :class="dataView === 'list' ? '-mt-20' : 'mt-4'">
                <div>
                    <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                </div>
                <div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">تعداد:</div>
                        <select v-model.number="perPage" @change="onPerPageChange"
                            class="h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[4rem] border border-gray-200 dark:border-gray-700">
                            <option v-for="p in perPages" :key="p" :value="p">{{ p }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

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
                <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">حذف کد تخفیف</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ isBulkDelete ? `از حذف ${selectedIds.length} کد تخفیف اطمینان دارید؟` : 'از حذف این کد تخفیف اطمینان دارید؟' }}
                </p>
                <p v-if="!isBulkDelete && discountToDelete" class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    کد: <span class="font-bold font-sans text-gray-700 dark:text-gray-200" dir="ltr">{{ discountToDelete.code }}</span>
                </p>
            </div>
            <div class="shrink-0 -mx-4 px-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:justify-end py-3">
                    <button type="button" @click="closeDeleteModal"
                        class="w-full sm:w-auto flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors">
                        انصراف
                    </button>
                    <button type="button" @click="deleteDiscount" :disabled="deleteLoading"
                        class="disabled:opacity-60 w-full sm:w-auto flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/25 transition-colors">
                        {{ deleteLoading ? 'در حال حذف...' : 'حذف' }}
                    </button>
                </div>
            </div>
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import AdminListFilterBar from "@/views/components/admin/AdminListFilterBar.vue";
import AdminFilterSelect from "@/views/components/admin/AdminFilterSelect.vue";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import { BTN_SECONDARY } from "@/views/components/admin/adminFormStepperMixin.js";
import { showToastSuccess, showToastError } from "@/utils/toastConfig";

export default {
    components: {
        AdminMasterPage, AdminBulkCheckbox, AdminBulkActionBar, AdminListFilterBar, AdminFilterSelect,
        AdminInlineLoading, PaginationComponent, BottomSheetDrawer,
        Popover, PopoverButton, PopoverPanel, PopoverOverlay,
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            BTN_SECONDARY,
            loading: false,
            items: [],
            selectedIds: [],
            pagination: {},
            currentPage: parseInt(urlParams.get("page") || "1", 10),
            perPage: parseInt(urlParams.get("perPage") || "10", 10),
            perPages: [10, 20, 30, 50, 100],
            searchQuery: urlParams.get("search") || "",
            filterStatus: urlParams.get("status") || "all",
            filterType: urlParams.get("type") || "all",
            filterValidity: urlParams.get("validity") || "all",
            filterScope: urlParams.get("scope") || "all",
            filterSort: urlParams.get("sort") || "newest",
            dataView: urlParams.get("view") || "list",
            mounted: false,
            showDeleteModal: false,
            discountToDelete: null,
            deleteLoading: false,
            isBulkDelete: false,
        };
    },
    computed: {
        statusOptions() {
            return [
                { value: "all", label: "همه" },
                { value: "active", label: "فعال" },
                { value: "inactive", label: "غیرفعال" },
            ];
        },
        typeOptions() {
            return [
                { value: "all", label: "همه" },
                { value: "percent", label: "درصدی" },
                { value: "fixed", label: "مبلغ ثابت" },
                { value: "free", label: "رایگان" },
            ];
        },
        validityOptions() {
            return [
                { value: "all", label: "همه" },
                { value: "valid", label: "معتبر" },
                { value: "expired", label: "منقضی" },
                { value: "upcoming", label: "آینده" },
                { value: "no_expiry", label: "بدون انقضا" },
            ];
        },
        scopeOptions() {
            return [
                { value: "all", label: "همه" },
                { value: "public", label: "عمومی / پروموشن" },
                { value: "automatic", label: "تخفیف مستقیم دوره" },
                { value: "course-specific", label: "محدود به دوره" },
            ];
        },
        sortOptions() {
            return [
                { value: "newest", label: "جدیدترین" },
                { value: "oldest", label: "قدیمی‌ترین" },
                { value: "code_asc", label: "کد (الف-ی)" },
                { value: "code_desc", label: "کد (ی-الف)" },
                { value: "usage_desc", label: "پراستفاده‌ترین" },
            ];
        },
        viewOptions() {
            return [
                { value: "list", label: "لیست" },
                { value: "grid", label: "شبکه‌ای" },
            ];
        },
        isAllSelected() {
            return this.items.length > 0 && this.selectedIds.length === this.items.length;
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.isAllSelected;
        },
    },
    methods: {
        getTypeLabel(type) {
            if (type === "percent") return "درصدی";
            if (type === "fixed") return "مبلغ ثابت";
            if (type === "free") return "رایگان";
            return type;
        },
        getValueDisplay(type, value) {
            if (type === "free") return "رایگان";
            if (type === "percent") return `${value}%`;
            if (type === "fixed") return `${Number(value).toLocaleString()} تومان`;
            return value;
        },
        usageLabel(item) {
            const used = item.usages_count ?? 0;
            if (item.usage_limit) {
                const remaining = item.remaining_usage ?? Math.max(0, item.usage_limit - used);
                return `${used} / ${item.usage_limit} · باقی ${remaining}`;
            }
            return `${used} / ∞`;
        },
        formatDate(dateString) {
            if (!dateString) return "";
            return new Date(dateString).toLocaleDateString("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" });
        },
        validityLabel(item) {
            if (!item.starts_at && !item.ends_at) return "بدون محدودیت زمانی";
            const parts = [];
            if (item.starts_at) parts.push(`از ${this.formatDate(item.starts_at)}`);
            if (item.ends_at) parts.push(`تا ${this.formatDate(item.ends_at)}`);
            return parts.join(" ");
        },
        validityStatusLabel(item) {
            const now = new Date();
            if (item.starts_at && new Date(item.starts_at) > now) return "شروع نشده";
            if (item.ends_at && new Date(item.ends_at) < now) return "منقضی";
            return "در حال اجرا";
        },
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
            this.searchQuery = "";
            this.onFilterChange();
        },
        clearFilters() {
            this.filterStatus = "all";
            this.filterType = "all";
            this.filterValidity = "all";
            this.filterScope = "all";
            this.filterSort = "newest";
            this.searchQuery = "";
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        handleSearch() {
            clearTimeout(this._searchTimer);
            this._searchTimer = setTimeout(() => {
                this.currentPage = 1;
                this.mounted = false;
                this.updateUrlAndFetchData();
            }, 800);
        },
        updatePage(value) {
            this.currentPage = value;
            this.updateUrlAndFetchData();
        },
        buildQuery() {
            const params = { page: this.currentPage, perPage: this.perPage };
            if (this.filterStatus !== "all") params.status = this.filterStatus;
            if (this.filterType !== "all") params.type = this.filterType;
            if (this.filterValidity !== "all") params.validity = this.filterValidity;
            if (this.filterScope !== "all") params.scope = this.filterScope;
            if (this.filterSort !== "newest") params.sort = this.filterSort;
            if (this.searchQuery?.trim()) params.search = this.searchQuery.trim();
            return params;
        },
        updateUrlAndFetchData() {
            const params = new URLSearchParams();
            if (this.filterStatus !== "all") params.set("status", this.filterStatus);
            if (this.filterType !== "all") params.set("type", this.filterType);
            if (this.filterValidity !== "all") params.set("validity", this.filterValidity);
            if (this.filterScope !== "all") params.set("scope", this.filterScope);
            if (this.filterSort !== "newest") params.set("sort", this.filterSort);
            if (this.currentPage !== 1) params.set("page", this.currentPage);
            if (this.perPage !== 10) params.set("perPage", this.perPage);
            if (this.dataView !== "list") params.set("view", this.dataView);
            if (this.searchQuery?.trim()) params.set("search", this.searchQuery.trim());

            const queryString = params.toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
            window.history.pushState(null, "", newUrl);
            this.getData();
        },
        async getData() {
            this.loading = true;
            try {
                const response = await axiosInstance.get("admin/discounts", { params: this.buildQuery() });
                this.items = response.data.discounts;
                this.currentPage = response.data.pagination.current_page;
                this.pagination = response.data.pagination;
                if (this.mounted) {
                    setTimeout(() => document.getElementById("data-list")?.scrollIntoView({ behavior: "smooth" }), 200);
                }
            } catch (error) {
                console.error(error);
                showToastError("خطا در دریافت لیست کدهای تخفیف.");
            } finally {
                this.loading = false;
                this.mounted = true;
            }
        },
        toggleSelectAll(event) {
            this.selectedIds = event.target.checked ? this.items.map((item) => item.id) : [];
        },
        openBulkDeleteModal() {
            if (!this.selectedIds.length) return;
            this.isBulkDelete = true;
            this.discountToDelete = null;
            this.showDeleteModal = true;
        },
        openDeleteModal(discount) {
            this.isBulkDelete = false;
            this.discountToDelete = discount;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.discountToDelete = null;
            this.isBulkDelete = false;
            this.showDeleteModal = false;
        },
        async deleteDiscount() {
            const ids = this.isBulkDelete ? [...this.selectedIds] : (this.discountToDelete ? [this.discountToDelete.id] : []);
            if (!ids.length) return;
            this.deleteLoading = true;
            let deleted = 0;
            let failed = 0;
            for (const id of ids) {
                try {
                    await axiosInstance.delete(`admin/discount/${id}`);
                    deleted += 1;
                } catch {
                    failed += 1;
                }
            }
            this.deleteLoading = false;
            if (deleted > 0) {
                this.selectedIds = this.selectedIds.filter((id) => !ids.includes(id));
                this.closeDeleteModal();
                showToastSuccess(`${deleted} کد تخفیف حذف شد.`);
                this.mounted = false;
                this.getData();
            }
            if (failed > 0) {
                showToastError("برخی کدهای تخفیف حذف نشدند.");
            }
        },
        async toggleDiscountStatus(discount) {
            try {
                await axiosInstance.post(`admin/discount/${discount.id}/toggle-status`);
                discount.is_active = !discount.is_active;
                showToastSuccess(discount.is_active ? "کد تخفیف فعال شد." : "کد تخفیف غیرفعال شد.");
            } catch {
                showToastError("خطا در تغییر وضعیت.");
            }
        },
    },
    mounted() {
        document.title = "لیست کدهای تخفیف";
        this.getData();
    },
};
</script>
