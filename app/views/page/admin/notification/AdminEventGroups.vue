<template>
    <AdminMasterPage>
        
        <template #breadcrumb-actions>
                    <button @click.prevent="openCreateModal"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                افزودن گروه
                                <svg class="w-5 h-5 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
                        </span></button>
                    <router-link :to="{ name: 'admin-events' }"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                رویدادها
                                <svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </span>
                        </span></router-link>
                    <button @click="refreshData"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                بروزرسانی داده‌ها
                                <svg class="w-5 h-5 rtl:ms-1 -mt-0.5" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24" />
                                        <path
                                            d="M12,8 L8,8 C5.790861,8 4,9.790861 4,12 L4,13 C4,14.6568542 5.34314575,16 7,16 L7,18 C4.23857625,18 2,15.7614237 2,13 L2,12 C2,8.6862915 4.6862915,6 8,6 L12,6 L12,4.72799742 C12,4.62015048 12.0348702,4.51519416 12.0994077,4.42878885 C12.264656,4.2075478 12.5779675,4.16215674 12.7992086,4.32740507 L15.656242,6.46136716 C15.6951359,6.49041758 15.7295917,6.52497737 15.7585249,6.56395854 C15.9231063,6.78569617 15.876772,7.09886961 15.6550344,7.263451 L12.798001,9.3840407 C12.7118152,9.44801079 12.607332,9.48254921 12.5,9.48254921 C12.2238576,9.48254921 12,9.25869158 12,8.98254921 L12,8 Z"
                                            fill="currentColor" />
                                        <path
                                            d="M12.0583175,16 L16,16 C18.209139,16 20,14.209139 20,12 L20,11 C20,9.34314575 18.6568542,8 17,8 L17,6 C19.7614237,6 22,8.23857625 22,11 L22,12 C22,15.3137085 19.3137085,18 16,18 L12.0583175,18 L12.0583175,18.9825492 C12.0583175,19.2586916 11.8344599,19.4825492 11.5583175,19.4825492 C11.4509855,19.4825492 11.3465023,19.4480108 11.2603165,19.3840407 L8.40328311,17.263451 C8.18154548,17.0988696 8.13521119,16.7856962 8.29979258,16.5639585 C8.32872576,16.5249774 8.36318164,16.4904176 8.40207551,16.4613672 L11.2591089,14.3274051 C11.48035,14.1621567 11.7936615,14.2075478 11.9589099,14.4287888 C12.0234473,14.5151942 12.0583175,14.6201505 12.0583175,14.7279974 L12.0583175,16 Z"
                                            fill="currentColor" opacity="0.3" />
                                    </g>
                                </svg>
                            </span>
                        </span></button>
        </template>
        <div class="min-w-0">
            <AdminBulkActionBar :count="selectedIds.length">
                <button type="button" @click.prevent="deleteEventGroup(selectedIds, true)"
                    class="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50">
                    حذف
                </button>
                <button type="button" @click="selectedIds = []"
                    class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    لغو انتخاب
                </button>
            </AdminBulkActionBar>
            <div class="gap-y-2 flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div class="">
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" v-model="search" @input="handleSearch"
                            class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 pe-8 p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="جستجو در گروه‌های رویداد..." />
                        <button v-if="search" @click="clearSearch"
                            class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div id="data-list">
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full lg:table-fixed lg:w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <colgroup class="hidden lg:table-column-group">
                            <col class="w-10" />
                            <col />
                            <col class="w-28" />
                            <col class="w-12" />
                        </colgroup>
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 whitespace-nowrap text-start">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 text-start">گروه رویداد</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-28">تعداد رویدادها</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center lg:w-12">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="item in items" :key="item.id"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                                </td>
                                <td class="px-1 py-3 text-start min-w-0">
                                    <div class="flex items-center gap-2 min-w-0 max-w-full">
                                        <div v-if="item.icon"
                                            class="shrink-0 w-9 h-9 flex items-center justify-center bg-gray-100/70 dark:bg-gray-800/50 rounded-lg overflow-hidden group-icon"
                                            v-html="item.icon"></div>
                                        <div v-else
                                            class="shrink-0 w-9 h-9 flex items-center justify-center bg-gray-100/70 dark:bg-gray-800/50 rounded-lg text-gray-500 dark:text-gray-400">
                                            <svg class="w-5 h-5" fill="none" viewBox="0 0 32 32"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path class="fill-current"
                                                    d="M27,22.1414V18a2,2,0,0,0-2-2H17V12h2a2.0023,2.0023,0,0,0,2-2V4a2.0023,2.0023,0,0,0-2-2H13a2.002,2.002,0,0,0-2,2v6a2.002,2.002,0,0,0,2,2h2v4H7a2,2,0,0,0-2,2v4.1421a4,4,0,1,0,2,0V18h8v4.142a4,4,0,1,0,2,0V18h8v4.1414a4,4,0,1,0,2,0ZM13,4h6l.001,6H13ZM8,26a2,2,0,1,1-2-2A2.0023,2.0023,0,0,1,8,26Zm10,0a2,2,0,1,1-2-2A2.0027,2.0027,0,0,1,18,26Zm8,2a2,2,0,1,1,2-2A2.0023,2.0023,0,0,1,26,28Z">
                                                </path>
                                            </svg>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1"
                                                :title="item.title">
                                                {{ item.title }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                                {{ item.english_title }}
                                            </div>
                                            <div v-if="item.description"
                                                class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                                                {{ item.description }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start lg:w-28">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg w-max font-anjoman">
                                        {{ item.events_count || 0 }} رویداد
                                    </div>
                                </td>
                                <td class="relative px-1 py-3 whitespace-nowrap text-center lg:w-12">
                                    <Popover class="group flex items-center justify-center" v-slot="{ close }">
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
                                                        <button type="button"
                                                            @click="() => { editEventGroup(item); close(); }"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            ویرایش
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button"
                                                            @click="() => { openDeleteModal(item); close(); }"
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
                            <tr v-if="!loading && items.length === 0">
                                <td colspan="4" class="px-4 py-12 text-center">
                                    <div class="text-gray-400 dark:text-gray-500 text-sm font-medium">گروه رویدادی یافت نشد</div>
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

            <!-- Create/Edit Event Group Bottom Sheet -->
            <BottomSheetDrawer v-model="showGroupModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ groupMode === 'create' ? 'افزودن گروه رویداد جدید' : 'ویرایش گروه رویداد' }}
                    </h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeGroupModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 sm:mt-0 w-full">
                        <div v-if="formFetchLoading"
                            class="py-16 flex flex-col items-center justify-center gap-3 text-center">
                            <svg class="w-8 h-8 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">لطفا منتظر بمانید...</p>
                            <p class="text-xs font-medium text-gray-400 dark:text-gray-500">در حال دریافت اطلاعات گروه رویداد</p>
                        </div>
                        <form v-else @submit.prevent="submitGroupForm" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان</label>
                                    <input v-model="groupForm.title" type="text" required
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                        :class="formErrors && formErrors.title ? 'ring-1 ring-rose-500' : ''" />
                                    <p v-if="formErrors && formErrors.title" class="mt-1 text-xs text-rose-500">{{ formErrors.title[0] }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان انگلیسی</label>
                                    <input v-model="groupForm.english_title" type="text" required
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                        :class="formErrors && formErrors.english_title ? 'ring-1 ring-rose-500' : ''" />
                                    <p v-if="formErrors && formErrors.english_title" class="mt-1 text-xs text-rose-500">{{ formErrors.english_title[0] }}</p>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">توضیحات</label>
                                <textarea v-model="groupForm.description" rows="3"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                    :class="formErrors && formErrors.description ? 'ring-1 ring-rose-500' : ''"></textarea>
                                <p v-if="formErrors && formErrors.description" class="mt-1 text-xs text-rose-500">{{ formErrors.description[0] }}</p>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">آیکون (SVG)</label>
                                <textarea v-model="groupForm.icon" rows="3"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white font-mono"
                                    placeholder="مثال: &lt;svg&gt;...&lt;/svg&gt;"
                                    :class="formErrors && formErrors.icon ? 'ring-1 ring-rose-500' : ''"></textarea>
                                <p v-if="formErrors && formErrors.icon" class="mt-1 text-xs text-rose-500">{{ formErrors.icon[0] }}</p>
                            </div>
                            <div class="flex justify-end gap-3 pt-6">
                                <button type="button" @click="closeGroupModal"
                                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    انصراف
                                </button>
                                <button type="submit" :disabled="groupFormLoading"
                                    class="px-5 py-2.5 text-sm font-semibold text-white bg-yellow-400 rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-colors shadow-lg shadow-yellow-400/30">
                                    <span v-if="groupFormLoading">در حال ذخیره...</span>
                                    <span v-else>ذخیره</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </BottomSheetDrawer>

            <!-- Delete Event Group Bottom Sheet -->
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
                    <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">حذف گروه رویداد</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        آیا مطمئن هستید که می‌خواهید گروه رویداد «{{ groupForDelete?.title }}» را حذف کنید؟
                    </p>
                </div>
                <div class="shrink-0 -mx-4 px-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:justify-end py-3">
                        <button type="button" @click="closeDeleteModal"
                            class="w-full sm:w-auto flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors">
                            انصراف
                        </button>
                        <button type="button" @click="confirmDelete" :disabled="deleteLoading"
                            class="disabled:opacity-60 w-full sm:w-auto flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/25 transition-colors">
                            {{ deleteLoading ? 'در حال حذف...' : 'حذف' }}
                        </button>
                    </div>
                </div>
            </BottomSheetDrawer>

            <LoadingComponent v-if="loading" class="" />
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import { toast } from "vue3-toastify";
import debounce from "lodash/debounce";
import "vue3-toastify/dist/index.css";

export default {
    components: {
        AdminMasterPage,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        LoadingComponent,
        PaginationComponent,
        BottomSheetDrawer,
        Popover,
        PopoverButton,
        PopoverPanel,
        PopoverOverlay,
    },
    data() {
        return {
            loading: false,
            formErrors: null,
            items: [],
            selectedIds: [],
            currentPage: this.$route.query.page ? this.$route.query.page : 1,
            pagination: {},
            perPage: 10,
            perPages: [10, 20, 30, 50, 100],
            search: '',
            showGroupModal: false,
            showDeleteModal: false,
            groupMode: 'create',
            groupFormLoading: false,
            formFetchLoading: false,
            deleteLoading: false,
            groupForDelete: null,
            editingGroup: null,
            groupForm: {
                title: '',
                english_title: '',
                description: '',
                icon: '',
            },
        };
    },
    computed: {
        isAllSelected() {
            return this.items.length > 0 && this.selectedIds.length === this.items.length;
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.isAllSelected;
        },
    },
    watch: {
        '$route.query.edit'(editId) {
            if (editId) {
                this.openEditFromQuery();
            }
        },
        '$route.query.create'(create) {
            if (create === 'true') {
                this.openCreateFromQuery();
            }
        },
    },
    mounted() {
        document.title = "مدیریت گروه‌های رویداد";
        this.getData().then(() => {
            this.openEditFromQuery();
            this.openCreateFromQuery();
        });
    },
    methods: {
        toastOptions() {
            return {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                bodyClassName: "font-YekanBakh",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            };
        },
        refreshData() {
            this.getData();
        },
        clearSearch() {
            this.search = '';
            this.currentPage = 1;
            this.getData();
        },
        handleSearch: debounce(function() {
            this.currentPage = 1;
            this.getData();
        }, 500),
        updatePage(value) {
            this.currentPage = value;
            this.getData();
        },
        selectPerpage(value) {
            this.perPage = value;
            this.currentPage = 1;
            this.getData();
        },
        async getData() {
            this.loading = true;
            const params = {
                page: this.currentPage,
                perPage: this.perPage,
                search: this.search || undefined,
            };

            Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

            try {
                const response = await axiosInstance.post("admin/notification-management/event-groups", params);
                this.items = response.data.event_groups;
                this.currentPage = response.data.pagination.current_page;
                this.pagination = response.data.pagination;
            } catch (error) {
                console.error(error.response?.data?.errors || error);
                toast.error("خطا در دریافت اطلاعات", this.toastOptions());
            } finally {
                this.loading = false;
            }
        },
        openCreateFromQuery() {
            if (this.$route.query.create !== 'true') return;
            this.openCreateModal();
            this.$router.replace({ name: 'admin-event-groups', query: {} });
        },
        async openEditFromQuery() {
            const editId = this.$route.query.edit;
            if (!editId) return;
            const groupId = Number(editId) || editId;
            await this.editEventGroup({ id: groupId });
            this.$router.replace({ name: 'admin-event-groups', query: {} });
        },
        openCreateModal() {
            this.groupMode = 'create';
            this.groupForm = {
                title: '',
                english_title: '',
                description: '',
                icon: '',
            };
            this.formErrors = null;
            this.editingGroup = null;
            this.formFetchLoading = false;
            this.showGroupModal = true;
        },
        async editEventGroup(item) {
            this.groupMode = 'edit';
            this.editingGroup = item;
            this.formErrors = null;
            this.formFetchLoading = true;
            this.groupForm = {
                title: '',
                english_title: '',
                description: '',
                icon: '',
            };
            this.showGroupModal = true;

            try {
                const response = await axiosInstance.get(`admin/notification-management/event-group/${item.id}`);
                const group = response.data.event_group;
                this.groupForm = {
                    title: group.title || '',
                    english_title: group.english_title || '',
                    description: group.description || '',
                    icon: group.icon || '',
                };
                this.editingGroup = group;
            } catch (error) {
                console.error(error.response?.data?.errors || error);
                toast.error("خطا در دریافت اطلاعات", this.toastOptions());
                this.closeGroupModal();
            } finally {
                this.formFetchLoading = false;
            }
        },
        closeGroupModal() {
            this.showGroupModal = false;
            this.editingGroup = null;
            this.formFetchLoading = false;
        },
        async submitGroupForm() {
            this.groupFormLoading = true;
            this.formErrors = null;

            try {
                if (this.groupMode === 'create') {
                    await axiosInstance.post('admin/notification-management/event-group/create', this.groupForm);
                    toast.success("گروه رویداد با موفقیت ایجاد شد", this.toastOptions());
                } else {
                    await axiosInstance.post(
                        `admin/notification-management/event-group/${this.editingGroup.id}/update`,
                        this.groupForm
                    );
                    toast.success("گروه رویداد با موفقیت به‌روزرسانی شد", this.toastOptions());
                }
                this.closeGroupModal();
                this.getData();
            } catch (error) {
                if (error.response?.data?.errors) {
                    this.formErrors = error.response.data.errors;
                } else {
                    console.error(error.response?.data?.errors || error);
                    toast.error(
                        this.groupMode === 'create' ? "خطا در ایجاد گروه رویداد" : "خطا در به‌روزرسانی گروه رویداد",
                        this.toastOptions()
                    );
                }
            } finally {
                this.groupFormLoading = false;
            }
        },
        openDeleteModal(item) {
            this.groupForDelete = item;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.groupForDelete = null;
            this.showDeleteModal = false;
        },
        async confirmDelete() {
            if (!this.groupForDelete) return;
            const deletedId = this.groupForDelete.id;
            this.deleteLoading = true;

            try {
                await axiosInstance.delete(`admin/notification-management/event-group/${deletedId}`);
                toast.success("گروه رویداد با موفقیت حذف شد.", this.toastOptions());
                this.selectedIds = this.selectedIds.filter(id => id !== deletedId);
                this.closeDeleteModal();
                this.getData();
            } catch (error) {
                console.error(error.response?.data?.errors || error);
                toast.error("خطا در حذف گروه رویداد", this.toastOptions());
            } finally {
                this.deleteLoading = false;
            }
        },
        async deleteEventGroup(value, backToDataList = false) {
            this.loading = true;

            const idsToDelete = Array.isArray(value) ? value : [value];

            try {
                for (const id of idsToDelete) {
                    await axiosInstance.delete(`admin/notification-management/event-group/${id}`);
                }

                this.selectedIds = [];
                this.getData();

                toast.success(
                    `گروه رویداد${idsToDelete.length > 1 ? 'ها' : ''} با موفقیت حذف شد${idsToDelete.length > 1 ? 'ند' : ''}.`,
                    this.toastOptions()
                );

                if (backToDataList) {
                    setTimeout(() => {
                        document.getElementById('data-list').scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            } catch (error) {
                console.error(error.response?.data?.errors || error);
                toast.error("خطا در حذف گروه رویداد", this.toastOptions());
            } finally {
                this.loading = false;
            }
        },
        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedIds = this.items.map(item => item.id);
            } else {
                this.selectedIds = [];
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

.group-icon :deep(svg) {
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
    margin-top: 5px;
}

.custom-checkbox:indeterminate::after,
.custom-checkbox.is-indeterminate::after {
    content: '';
    display: block;
    margin-top: 9px;
    width: 14px;
    height: 3px;
    background-color: white;
    border-radius: 3px;
}
</style>
