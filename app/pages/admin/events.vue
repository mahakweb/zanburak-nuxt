<script setup>
definePageMeta({
  name: "admin-events",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        
        <template #breadcrumb-actions>
                    <button @click.prevent="openCreateModal"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                افزودن رویداد
                                <svg class="w-5 h-5 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
                        </span></button>
                    <router-link :to="{ name: 'admin-event-groups' }"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                گروه‌ها
                                <svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 11H5M14 7l-5 4 5 4" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
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
            <div class="mb-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div class="flex flex-col gap-1 mb-3">
                    <h2 class="text-sm font-bold text-gray-800 dark:text-white">کانال‌های سراسری</h2>
                    <p class="text-xs text-gray-500 dark:text-gray-400">اگر کانالی را خاموش کنید، برای هیچ کاربری از آن کانال پیامی نمی‌رود. این تنظیم جدا از تنظیم هر رویداد است.</p>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <button v-for="channel in eventChannelOptions" :key="channel.key" type="button"
                        @click="toggleGlobalChannel(channel.key)"
                        :disabled="channelSettingsLoading"
                        :class="['flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-60', globalChannelOn(channel.key) ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300']">
                        <span class="flex items-center gap-2">
                            <span class="w-4 h-4" v-html="getChannelIcon(channel.key)"></span>
                            {{ channel.label }}
                        </span>
                        <span>{{ globalChannelOn(channel.key) ? 'فعال' : 'خاموش' }}</span>
                    </button>
                </div>
                <p v-if="globalChannelOn('email') === false" class="mt-3 text-xs text-amber-700 dark:text-amber-300">ایمیل خاموش است؛ کد ورود، تأیید ایمیل و بازیابی رمز هم ارسال نمی‌شود.</p>
            </div>
            <AdminBulkActionBar :count="selectedIds.length">
                <button type="button" @click.prevent="openBulkDeleteModal"
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
                        <input type="text" v-model="searchQuery" @input="handleSearch"
                            class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 pe-8 p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="جستجو در رویدادها..." />
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
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">گروه رویداد:</div>
                        <select v-model="selectedEventGroupId" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[8rem]">
                            <option :value="null">همه گروه‌ها</option>
                            <option v-for="group in eventGroups" :key="group.id" :value="group.id">{{ group.title }}</option>
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

            <div id="data-list">
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full lg:table-fixed lg:w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <colgroup class="hidden lg:table-column-group">
                            <col class="w-10" />
                            <col class="w-14" />
                            <col />
                            <col class="w-28" />
                            <col class="w-40" />
                            <col class="w-12" />
                        </colgroup>
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-10">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-14">آیکون</th>
                                <th class="px-1 py-3 text-start">جزئیات رویداد</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:w-28">گروه</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center lg:w-40">کانال‌ها</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center lg:w-12">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="item in items" :key="item.id"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="px-1 py-3 whitespace-nowrap text-start lg:w-10">
                                    <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start lg:w-14">
                                    <div v-if="item.icon"
                                        class="shrink-0 w-9 h-9 flex items-center justify-center bg-gray-100/70 dark:bg-gray-800/50 rounded-lg overflow-hidden event-icon"
                                        v-html="item.icon"></div>
                                    <div v-else
                                        class="shrink-0 w-9 h-9 flex items-center justify-center bg-gray-100/70 dark:bg-gray-800/50 rounded-lg text-gray-400">
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                            <path class="fill-current"
                                                d="M27,22.1414V18a2,2,0,0,0-2-2H17V12h2a2.0023,2.0023,0,0,0,2-2V4a2.0023,2.0023,0,0,0-2-2H13a2.002,2.002,0,0,0-2,2v6a2.002,2.002,0,0,0,2,2h2v4H7a2,2,0,0,0-2,2v4.1421a4,4,0,1,0,2,0V18h8v4.142a4,4,0,1,0,2,0V18h8v4.1414a4,4,0,1,0,2,0ZM13,4h6l.001,6H13ZM8,26a2,2,0,1,1-2-2A2.0023,2.0023,0,0,1,8,26Zm10,0a2,2,0,1,1-2-2A2.0027,2.0027,0,0,1,18,26Zm8,2a2,2,0,1,1,2-2A2.0023,2.0023,0,0,1,26,28Z">
                                            </path>
                                        </svg>
                                    </div>
                                </td>
                                <td class="px-1 py-3 text-start min-w-0">
                                    <div class="min-w-0">
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
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start lg:w-28">
                                    <div v-if="item.event_group"
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1 max-w-full truncate">
                                        {{ item.event_group.title }}
                                    </div>
                                    <div v-else class="text-xs text-gray-400">-</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-center lg:w-40">
                                    <div
                                        class="inline-flex items-center gap-1 p-1 rounded-lg bg-gray-100/70 dark:bg-gray-800/50 mx-auto w-max">
                                        <span v-for="channel in getEventChannels(item)" :key="channel.key"
                                            class="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                                            :class="channel.enabled
                                                ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-[0_1px_2px_rgba(15,23,42,0.06)] ring-1 ring-gray-200/70 dark:ring-gray-600/50'
                                                : 'text-gray-300 dark:text-gray-600'"
                                            :title="channel.label + (channel.enabled ? ' · فعال' : ' · غیرفعال')">
                                            <span class="inline-flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5"
                                                v-html="getChannelIcon(channel.key)" />
                                        </span>
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
                                                            @click="() => { editEvent(item); close(); }"
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
                                <td colspan="6" class="px-4 py-12 text-center">
                                    <div class="text-gray-400 dark:text-gray-500 text-sm font-medium">رویدادی یافت نشد</div>
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

            <!-- Create/Edit Event Bottom Sheet -->
            <BottomSheetDrawer v-model="showEventModal" :initialHeight="0.75" :maxHeight="0.95" :minHeight="0.6"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ eventMode === 'create' ? 'افزودن رویداد جدید' : 'ویرایش رویداد' }}
                    </h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeEventModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 sm:mt-0 w-full">
                        <div v-if="eventFormFetchLoading"
                            class="py-16 flex flex-col items-center justify-center gap-3 text-center">
                            <svg class="w-8 h-8 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">لطفا منتظر بمانید...</p>
                            <p class="text-xs font-medium text-gray-400 dark:text-gray-500">در حال دریافت اطلاعات رویداد</p>
                        </div>
                        <form v-else @submit.prevent="submitEventForm" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        عنوان فارسی <span class="text-rose-500">*</span>
                                    </label>
                                    <input v-model="eventForm.title" type="text" required
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                        :class="fieldErrorClass('title')" />
                                    <span v-if="formErrors && formErrors.title" class="mt-1 text-rose-500 text-xs font-medium block">
                                        {{ formErrors.title[0] }}
                                    </span>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        عنوان انگلیسی <span class="text-rose-500">*</span>
                                    </label>
                                    <input v-model="eventForm.english_title" type="text" required
                                        :disabled="eventMode === 'edit'"
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                        :class="fieldErrorClass('english_title')" />
                                    <span v-if="formErrors && formErrors.english_title" class="mt-1 text-rose-500 text-xs font-medium block">
                                        {{ formErrors.english_title[0] }}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    گروه رویداد <span class="text-rose-500">*</span>
                                </label>
                                <select v-model="eventForm.event_group_id" required
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                                    :class="fieldErrorClass('event_group_id')">
                                    <option value="" disabled>انتخاب گروه</option>
                                    <option v-for="group in eventGroups" :key="group.id" :value="group.id">{{ group.title }}</option>
                                </select>
                                <span v-if="formErrors && formErrors.event_group_id" class="mt-1 text-rose-500 text-xs font-medium block">
                                    {{ formErrors.event_group_id[0] }}
                                </span>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">توضیحات</label>
                                <textarea v-model="eventForm.description" rows="3"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                    :class="fieldErrorClass('description')"></textarea>
                                <span v-if="formErrors && formErrors.description" class="mt-1 text-rose-500 text-xs font-medium block">
                                    {{ formErrors.description[0] }}
                                </span>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">آیکون (HTML)</label>
                                <textarea v-model="eventForm.icon" rows="3"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white font-mono"
                                    :class="fieldErrorClass('icon')"
                                    placeholder="مثال: &lt;svg&gt;...&lt;/svg&gt;"></textarea>
                                <span v-if="formErrors && formErrors.icon" class="mt-1 text-rose-500 text-xs font-medium block">
                                    {{ formErrors.icon[0] }}
                                </span>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">کانال‌های اطلاع‌رسانی</label>
                                <p class="text-xs text-gray-400 dark:text-gray-500 mb-2">برای فعال یا غیرفعال کردن هر کانال روی آیکون آن کلیک کنید.</p>
                                <div
                                    class="inline-flex items-center gap-1 p-1 rounded-lg bg-gray-100/70 dark:bg-gray-800/50">
                                    <button v-for="channel in eventChannelOptions" :key="channel.key" type="button"
                                        @click="toggleFormChannel(channel.formKey)"
                                        class="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                                        :class="eventForm[channel.formKey]
                                            ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-[0_1px_2px_rgba(15,23,42,0.06)] ring-1 ring-gray-200/70 dark:ring-gray-600/50'
                                            : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500'"
                                        :title="channel.label + (eventForm[channel.formKey] ? ' · فعال' : ' · غیرفعال')">
                                        <span class="inline-flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5"
                                            v-html="getChannelIcon(channel.key)" />
                                    </button>
                                </div>
                            </div>
                            <div class="flex justify-end gap-3 pt-6">
                                <button type="button" @click="closeEventModal"
                                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    انصراف
                                </button>
                                <button type="submit" :disabled="eventFormLoading"
                                    class="px-5 py-2.5 text-sm font-semibold text-white bg-yellow-400 rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-colors shadow-lg shadow-yellow-400/30">
                                    <span v-if="eventFormLoading">در حال ذخیره...</span>
                                    <span v-else>{{ eventMode === 'create' ? 'ایجاد رویداد' : 'ذخیره تغییرات' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </BottomSheetDrawer>

            <!-- Delete Event Bottom Sheet -->
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
                    <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">حذف رویداد</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <template v-if="deleteIds.length > 1">
                        آیا مطمئن هستید که می‌خواهید {{ deleteIds.length }} رویداد انتخاب‌شده را حذف کنید؟
                    </template>
                    <template v-else-if="eventForDelete">
                        آیا مطمئن هستید که می‌خواهید رویداد «{{ eventForDelete.title }}» را حذف کنید؟
                    </template>
                    <template v-else>
                        آیا مطمئن هستید که می‌خواهید این رویداد را حذف کنید؟
                    </template>
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
            items: [],
            selectedIds: [],
            eventGroups: [],
            searchQuery: '',
            selectedEventGroupId: null,
            currentPage: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
            pagination: {},
            perPage: 10,
            perPages: [10, 20, 30, 50, 100],
            showEventModal: false,
            showDeleteModal: false,
            eventMode: 'create',
            eventFormLoading: false,
            eventFormFetchLoading: false,
            deleteLoading: false,
            eventForDelete: null,
            deleteIds: [],
            editingEvent: null,
            formErrors: null,
            channelSettings: { email: true, sms: true, telegram: true, site: true },
            channelSettingsLoading: false,
            eventChannelOptions: [
                { key: 'email', label: 'ایمیل', formKey: 'is_email_enabled' },
                { key: 'sms', label: 'پیامک', formKey: 'is_sms_enabled' },
                { key: 'telegram', label: 'تلگرام', formKey: 'is_telegram_enabled' },
                { key: 'site', label: 'سایت', formKey: 'is_site_enabled' },
            ],
            eventForm: {
                title: '',
                english_title: '',
                description: '',
                icon: '',
                event_group_id: '',
                is_email_enabled: true,
                is_sms_enabled: true,
                is_telegram_enabled: true,
                is_site_enabled: true,
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
    mounted() {
        document.title = "مدیریت رویدادها";
        this.fetchChannelSettings();
        this.fetchEventGroups();
        this.getData().then(() => {
            this.openCreateFromQuery();
            this.openEditFromQuery();
        });
    },
    watch: {
        '$route.query.edit'(editId) {
            if (editId) {
                this.openEditFromQuery();
            }
        },
        '$route.query.create'(val) {
            if (val) {
                this.openCreateFromQuery();
            }
        },
    },
    methods: {
        toastOptions() {
            return {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") == "rtl",
                bodyClassName: "font-YekanBakh",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            };
        },
        fieldErrorClass(field) {
            return this.formErrors && this.formErrors[field]
                ? 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900'
                : '';
        },
        getEventChannels(item) {
            return this.eventChannelOptions.map(channel => ({
                ...channel,
                enabled: !!item[channel.formKey],
            }));
        },
        getChannelIcon(key) {
            const icons = {
                email: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
                sms: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
                telegram: '<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
                site: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>',
            };
            return icons[key] || '';
        },
        toggleFormChannel(formKey) {
            this.eventForm[formKey] = !this.eventForm[formKey];
        },
        getDefaultEventForm() {
            return {
                title: '',
                english_title: '',
                description: '',
                icon: '',
                event_group_id: '',
                is_email_enabled: true,
                is_sms_enabled: true,
                is_telegram_enabled: true,
                is_site_enabled: true,
            };
        },
        openCreateFromQuery() {
            if (this.$route.query.create !== 'true') return;
            this.openCreateModal();
            this.$router.replace({ name: 'admin-events', query: {} });
        },
        async openEditFromQuery() {
            const editId = this.$route.query.edit;
            if (!editId) return;
            const eventId = Number(editId) || editId;
            await this.editEvent({ id: eventId });
            this.$router.replace({ name: 'admin-events', query: {} });
        },
        refreshData() {
            this.fetchEventGroups();
            this.getData();
        },
        onFilterChange() {
            this.currentPage = 1;
            this.getData();
        },
        clearSearch() {
            this.searchQuery = '';
            this.currentPage = 1;
            this.getData();
        },
        clearFilters() {
            this.searchQuery = '';
            this.selectedEventGroupId = null;
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
        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedIds = this.items.map(item => item.id);
            } else {
                this.selectedIds = [];
            }
        },
        globalChannelOn(key) {
            return this.channelSettings[key] !== false;
        },
        async fetchChannelSettings() {
            try {
                const response = await axiosInstance.get('admin/notification-management/channels');
                this.channelSettings = response.data.channels || this.channelSettings;
            } catch (error) {
                console.error('Error fetching channel settings:', error);
            }
        },
        async toggleGlobalChannel(key) {
            const next = {
                email: this.globalChannelOn('email'),
                sms: this.globalChannelOn('sms'),
                telegram: this.globalChannelOn('telegram'),
                site: this.globalChannelOn('site'),
            };
            next[key] = !next[key];
            this.channelSettingsLoading = true;
            try {
                const response = await axiosInstance.post('admin/notification-management/channels', next);
                this.channelSettings = response.data.channels || next;
                toast.success(response.data.message || 'کانال‌ها به‌روزرسانی شد', this.toastOptions());
            } catch (error) {
                toast.error('ذخیره کانال‌ها انجام نشد', this.toastOptions());
            } finally {
                this.channelSettingsLoading = false;
            }
        },
        async fetchEventGroups() {
            try {
                const response = await axiosInstance.get('admin/notification-management/event-groups/all');
                this.eventGroups = response.data.event_groups;
            } catch (error) {
                console.error('Error fetching event groups:', error);
            }
        },
        async getData() {
            this.loading = true;
            const params = {
                page: this.currentPage,
                perPage: this.perPage,
                search: this.searchQuery || undefined,
                event_group_id: this.selectedEventGroupId || undefined,
            };
            Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

            try {
                const response = await axiosInstance.post("admin/notification-management/events", params);
                this.items = response.data.events;
                this.currentPage = response.data.pagination.current_page;
                this.pagination = response.data.pagination;
                this.selectedIds = this.selectedIds.filter(id => this.items.some(item => item.id === id));
            } catch (error) {
                console.error(error.response?.data?.errors || error);
                toast.error("خطا در دریافت اطلاعات", this.toastOptions());
            } finally {
                this.loading = false;
            }
        },
        openCreateModal() {
            this.eventMode = 'create';
            this.eventForm = this.getDefaultEventForm();
            this.formErrors = null;
            this.editingEvent = null;
            this.eventFormFetchLoading = false;
            this.showEventModal = true;
        },
        async editEvent(event) {
            this.eventMode = 'edit';
            this.editingEvent = event;
            this.formErrors = null;
            this.eventFormFetchLoading = true;
            this.eventForm = this.getDefaultEventForm();
            this.showEventModal = true;

            try {
                const response = await axiosInstance.get(`admin/notification-management/event/${event.id}`);
                const fullEvent = response.data.event;
                this.eventForm = {
                    title: fullEvent.title || '',
                    english_title: fullEvent.english_title || '',
                    description: fullEvent.description || '',
                    icon: fullEvent.icon || '',
                    event_group_id: fullEvent.event_group_id || fullEvent.event_group?.id || '',
                    is_email_enabled: Boolean(fullEvent.is_email_enabled),
                    is_sms_enabled: Boolean(fullEvent.is_sms_enabled),
                    is_telegram_enabled: Boolean(fullEvent.is_telegram_enabled),
                    is_site_enabled: Boolean(fullEvent.is_site_enabled),
                };
            } catch (error) {
                console.error('Error loading event details:', error);
                toast.error("خطا در دریافت اطلاعات رویداد", this.toastOptions());
                if (event.title) {
                    this.eventForm = {
                        title: event.title,
                        english_title: event.english_title || '',
                        description: event.description || '',
                        icon: event.icon || '',
                        event_group_id: event.event_group_id || event.event_group?.id || '',
                        is_email_enabled: Boolean(event.is_email_enabled),
                        is_sms_enabled: Boolean(event.is_sms_enabled),
                        is_telegram_enabled: Boolean(event.is_telegram_enabled),
                        is_site_enabled: Boolean(event.is_site_enabled),
                    };
                } else {
                    this.closeEventModal();
                }
            } finally {
                this.eventFormFetchLoading = false;
            }
        },
        closeEventModal() {
            this.showEventModal = false;
            this.editingEvent = null;
            this.eventFormFetchLoading = false;
            this.formErrors = null;
        },
        async submitEventForm() {
            this.eventFormLoading = true;
            this.formErrors = null;

            try {
                if (this.eventMode === 'create') {
                    await axiosInstance.post('admin/notification-management/event/create', this.eventForm);
                    toast.success("رویداد با موفقیت ایجاد شد", this.toastOptions());
                } else {
                    await axiosInstance.post(
                        `admin/notification-management/event/${this.editingEvent.id}/update`,
                        this.eventForm
                    );
                    toast.success("رویداد با موفقیت به‌روزرسانی شد", this.toastOptions());
                }
                this.closeEventModal();
                this.getData();
            } catch (error) {
                if (error.response?.data?.errors) {
                    this.formErrors = error.response.data.errors;
                } else {
                    toast.error(
                        this.eventMode === 'create' ? "خطا در ایجاد رویداد" : "خطا در به‌روزرسانی رویداد",
                        this.toastOptions()
                    );
                }
            } finally {
                this.eventFormLoading = false;
            }
        },
        openDeleteModal(item) {
            this.eventForDelete = item;
            this.deleteIds = [item.id];
            this.showDeleteModal = true;
        },
        openBulkDeleteModal() {
            this.eventForDelete = null;
            this.deleteIds = [...this.selectedIds];
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
            this.eventForDelete = null;
            this.deleteIds = [];
        },
        async confirmDelete() {
            if (!this.deleteIds.length) return;
            this.deleteLoading = true;

            try {
                for (const id of this.deleteIds) {
                    await axiosInstance.delete(`admin/notification-management/event/${id}`);
                }

                const count = this.deleteIds.length;
                toast.success(
                    `رویداد${count > 1 ? 'ها' : ''} با موفقیت حذف شد${count > 1 ? 'ند' : ''}.`,
                    this.toastOptions()
                );

                this.closeDeleteModal();
                this.selectedIds = [];
                await this.getData();

                if (count > 1) {
                    setTimeout(() => {
                        document.getElementById('data-list')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            } catch (error) {
                console.error(error.response?.data?.errors || error);
                toast.error("خطا در حذف رویداد", this.toastOptions());
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

.event-icon :deep(svg) {
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
