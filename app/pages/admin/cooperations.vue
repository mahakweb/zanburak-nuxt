<script setup>
definePageMeta({
  name: "admin-cooperations",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        
        <template #breadcrumb-actions>
                    <button @click="fetchData"
                        class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
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
            <div class="gap-y-2 flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div class="">
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="simple-search" v-model="searchQuery" @input="debounceSearch"
                            class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 p-2.5  dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white "
                            placeholder="جستجو..." required />
                    </div>
                </div>
                <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت:</div>
                        <select v-model="selectedStatus" @change="selectStatus(selectedStatus)"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option value="all">همه</option>
                            <option value="approved">تایید‌شده</option>
                            <option value="not_approved">تایید‌نشده</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">نقش:</div>
                        <select v-model="selectedRole" @change="selectRole(selectedRole)"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option value="all">همه</option>
                            <option v-for="(role, index) in roles" :key="index" :value="role">{{ mapRole(role) }}</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                        <select v-model="selectedSort" @change.prevent="selectSort(selectedSort)"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option value="newest">جدیدترین</option>
                            <option value="oldest">قدیمی‌ترین</option>
                        </select>
                    </div>
                    <div class="inline-flex">
                        <button @click.prevent="resetFilters"
                            class="flex items-center justify-center h-8 w-8 bg-rose-400/20 hover:bg-opacity-90 rounded-lg focus:ring-1 ring-rose-500 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800">
                            <svg class="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16.8809 10C14.2609 10 12.1309 12.13 12.1309 14.75C12.1309 15.64 12.3809 16.48 12.8209 17.2C13.6409 18.58 15.1509 19.5 16.8809 19.5C18.6109 19.5 20.1209 18.57 20.9409 17.2C21.3809 16.49 21.6309 15.64 21.6309 14.75C21.6309 12.13 19.5109 10 16.8809 10ZM18.6809 16.52C18.5309 16.67 18.3409 16.74 18.1509 16.74C17.9609 16.74 17.7709 16.67 17.6209 16.52L16.9009 15.8L16.1509 16.55C16.0009 16.7 15.8109 16.77 15.6209 16.77C15.4309 16.77 15.2409 16.7 15.0909 16.55C14.8009 16.26 14.8009 15.78 15.0909 15.49L15.8409 14.74L15.1209 14.01C14.8309 13.72 14.8309 13.24 15.1209 12.95C15.4109 12.66 15.8909 12.66 16.1809 12.95L16.9009 13.67L17.6009 12.97C17.8909 12.68 18.3709 12.68 18.6609 12.97C18.9509 13.26 18.9509 13.74 18.6609 14.03L17.9609 14.73L18.6809 15.46C18.9809 15.75 18.9809 16.23 18.6809 16.52Z"
                                    fill="currentColor"></path>
                                <path
                                    d="M20.5799 4.02V6.24C20.5799 7.05 20.0799 8.06 19.5799 8.57L19.3999 8.73C19.2599 8.86 19.0499 8.89 18.8699 8.83C18.6699 8.76 18.4699 8.71 18.2699 8.66C17.8299 8.55 17.3599 8.5 16.8799 8.5C13.4299 8.5 10.6299 11.3 10.6299 14.75C10.6299 15.89 10.9399 17.01 11.5299 17.97C12.0299 18.81 12.7299 19.51 13.4899 19.98C13.7199 20.13 13.8099 20.45 13.6099 20.63C13.5399 20.69 13.4699 20.74 13.3999 20.79L11.9999 21.7C10.6999 22.51 8.90992 21.6 8.90992 19.98V14.63C8.90992 13.92 8.50992 13.01 8.10992 12.51L4.31992 8.47C3.81992 7.96 3.41992 7.05 3.41992 6.45V4.12C3.41992 2.91 4.31992 2 5.40992 2H18.5899C19.6799 2 20.5799 2.91 20.5799 4.02Z"
                                    fill="currentColor"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


            <div id="data-list">
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 whitespace-nowrap text-start">نام</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">کدملی</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">ایمیل</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">موبایل</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">نقش</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ‌درخواست</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="(item, index) in items" :key="index"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">{{ item.name }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1" dir="ltr">{{ item.melli_code }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1" dir="ltr">{{ item.email }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1" dir="ltr">{{ item.mobile }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">{{ mapRole(item.role) }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                        {{ new Date(item.created_at).toLocaleDateString('fa-IR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: '2-digit'
                                        }) }} &nbsp;&nbsp; {{ new Date(item.created_at).toLocaleTimeString('fa-IR', {
                                            hour: '2-digit', hour12: true,
                                            minute: '2-digit',
                                            second: '2-digit'
                                        }).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ') }}
                                    </div>
                                </td>
                                
                                <td class="relative px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                        <Popover class="group  flex items-center justify-center">
                                            <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                            <PopoverButton
                                                class="text-gray-900 dark:text-white me-2 relative group-focus-within:z-30 focus:outline-none flex items-center justify-center">
                                                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M10 2C10 0.89543 9.10457 -4.82823e-08 8 0C6.89543 4.82823e-08 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </PopoverButton>
                                            <transition enter-active-class="transition duration-200 ease-out"
                                                enter-from-class="translate-y-1 opacity-0"
                                                enter-to-class="translate-y-0 opacity-100"
                                                leave-active-class="transition duration-150 ease-in"
                                                leave-from-class="translate-y-0 opacity-100"
                                                leave-to-class="translate-y-1 opacity-0">
                                                <PopoverPanel
                                                    class="text-start flex flex-col z-30 end-10 absolute p-2 bg-white rounded-lg shadow w-max min-w-[7rem] dark:bg-gray-900 dark:divide-gray-800">
                                                    <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                        <li>
                                                            <button type="button" @click="viewDetails(item.id)"
                                                                class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">جزئیات</button>
                                                        </li>
                                                        <li>
                                                            <button type="button" @click="openDeleteModal(item.id)"
                                                                class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">حذف</button>
                                                        </li>
                                                    </ul>
                                                </PopoverPanel>
                                            </transition>
                                        </Popover>
                                    </div>
                                </td>
                            </tr>
                            <tr class="h-24"></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="flex lg:flex-row flex-col items-center justify-between gap-4 -mt-20">
                <div class="">
                    <PaginationComponent v-if="pagination && pagination.last_page > 1" dir="ltr"
                        :pagination="pagination" @updatePage="updatePage" />
                </div>

                <div class="">
                    <select v-model="perPage" @change="selectPerpage(perPage)"
                        class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                        <option v-for="per in perPages" :key="per" :value="per">
                            {{ per }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Details Modal -->
            <BottomSheetDrawer v-model="showDetailsModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div v-if="detailsLoading"
                    class="py-8 text-gray-600 dark:text-gray-100 text-sm font-semibold text-center">در حال بارگذاری...
                </div>
                <div v-else-if="selectedCooperation" class="">
                    <div class="mb-6">
                        <div class="rounded-md border border-gray-100 dark:border-opacity-10 p-2">
                            <h4
                                class="font-anjoman text-sm font-semibold text-gray-900 dark:text-white flex items-center mb-2">
                                <svg class="w-5 h-5 me-1" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24" />
                                        <circle fill="currentColor" opacity="0.3" cx="12" cy="12" r="10" />
                                        <rect fill="currentColor" x="11" y="10" width="2" height="7" rx="1" />
                                        <rect fill="currentColor" x="11" y="7" width="2" height="2" rx="1" />
                                    </g>
                                </svg>
                               جزئیات درخواست
                            </h4>
                            <hr class="border-t border-gray-100 dark:border-opacity-10 m-2" />
                            <div class="">
                                <table class="w-full border-spacing-0.5 border-separate">
                                    <tbody class="text-xs whitespace-nowrap">
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                نام‌متقاضی</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ selectedCooperation.name }}</td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                شغل درخواستی</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ mapRole(selectedCooperation.role) }}</td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                ایمیل</td>
                                            <td dir="ltr"
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ selectedCooperation.email }}</td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                موبایل</td>
                                            <td dir="ltr"
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ selectedCooperation.mobile }}</td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                کدملی</td>
                                            <td dir="ltr"
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ selectedCooperation.melli_code }}</td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                وضعیت</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold" :class="[selectedCooperation.status ? 'text-green-500' : 'text-pink-600']">
                                                {{ selectedCooperation.status ? 'تایید شده' : 'تایید نشده' }}</td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                تاریخ ثبت درخواست</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ new Date(selectedCooperation.created_at).toLocaleDateString('fa-IR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: '2-digit'
                                                }) }} &nbsp;&nbsp; {{ new
                                                    Date(selectedCooperation.created_at).toLocaleTimeString('fa-IR', {
                                                        hour: '2-digit', hour12: true,
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    }).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ') }}
                                            </td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                لینک‌ها</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                <a v-if="selectedCooperation.links" :href="selectedCooperation.links"
                                                    target="_blank"
                                                    class="text-blue-600 underline hover:no-underline">مشاهده</a>
                                                <span v-else>-</span>
                                            </td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                               تصویر‌ کارت‌ملی</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                <a v-if="selectedCooperation.melli_card_image" :href="selectedCooperation.melli_card_image"
                                                    target="_blank"
                                                    class="text-blue-600 underline hover:no-underline">مشاهده</a>
                                                <span v-else>-</span>
                                            </td>
                                        </tr>
                                        <tr v-if="selectedCooperation.role === 'teacher'" class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                نمونه تدریس</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                <a v-if="selectedCooperation.samples"
                                                    :href="selectedCooperation.samples" target="_blank"
                                                    class="text-blue-600 underline hover:no-underline">دانلود</a>
                                                <span v-else>-</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <div class="rounded-md border border-gray-100 dark:border-opacity-10 p-2">
                            <h4
                                class="font-anjoman text-sm font-semibold text-gray-900 dark:text-white flex items-center mb-2">
                                <svg class="w-5 h-5 me-1" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24" />
                                        <circle fill="currentColor" opacity="0.3" cx="12" cy="12" r="10" />
                                        <rect fill="currentColor" x="11" y="10" width="2" height="7" rx="1" />
                                        <rect fill="currentColor" x="11" y="7" width="2" height="2" rx="1" />
                                    </g>
                                </svg>
                                توضیحات 
                            </h4>
                            <hr class="border-t border-gray-100 dark:border-opacity-10 m-2" />
                            <div class="bg-gray-100/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 p-2 text-xs">
                                <MarkdownRenderer startClass="desc" :source="selectedCooperation.description" />
                            </div>
                        </div>
                    </div>
                </div>
            </BottomSheetDrawer>

            <!-- Delete Modal -->
            <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                <div class="bg-white dark:bg-gray-900 rounded-lg w-[95%] md:w-[480px] p-4">
                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-50 mb-2">حذف درخواست</div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">آیا از حذف این درخواست مطمئن هستید؟</div>
                    <div class="flex items-center justify-end gap-2">
                        <button @click="closeDelete"
                            class="text-xs font-semibold px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-200">انصراف</button>
                        <button :disabled="deleteLoading" @click="confirmDelete"
                            class="text-xs font-semibold px-4 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50">حذف</button>
                    </div>
                </div>
            </div>
        </div>

        <LoadingComponent v-if="loading" class="" />
    </AdminMasterPage>

</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import axiosInstance from "@/store/axiosInstance";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";

export default {
    components: { AdminMasterPage, Popover, PopoverButton, PopoverPanel, PopoverOverlay, LoadingComponent, PaginationComponent, BottomSheetDrawer, MarkdownRenderer, },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            items: [],
            ppagination: {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0
            },
            currentPage: 1,
            perPage: parseInt(urlParams.get('perPage')) || 10,
            perPages: [10, 20, 30, 50, 100],
            roles: ['teacher', 'support', 'content_creator', 'dev', 'marketing', 'design',],
            selectedStatus: urlParams.get('status') || 'all',
            selectedRole: urlParams.get('role') || 'all',
            selectedSort: urlParams.get('sort') || 'newest',
            searchQuery: urlParams.get('search') || '',
            searchTimeout: null,
            loading: false,
            mounted: false,
            // details
            showDetailsModal: false,
            detailsLoading: false,
            selectedCooperation: null,
            // delete
            showDeleteModal: false,
            deleteLoading: false,
            deleteId: null,
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        selectPerpage(per) {
            this.perPage = per;
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        selectSort(value) {
            this.selectedSort = value;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        selectStatus(value) {
            this.selectedStatus = value;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        selectRole(value) {
            this.selectedRole = value;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        debounceSearch() {
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            this.searchTimeout = setTimeout(() => {
                this.currentPage = 1;
                this.updateUrlAndFetchData();
            }, 1000);
        },
        mapRole(role) {
            const map = { teacher: 'مدرس آموزشی', support: 'پشتیبان آموزشی', content_creator: 'تولیدکننده محتوا', dev: 'توسعه‌دهنده', marketing: 'بازاریابی و رشد', design: 'طراحی و گرافیک' };
            return map[role] || role;
        },

        buildQuery() {
            const params = {
                page: this.currentPage,
                perPage: this.perPage,
                sort: this.selectedSort,
            };
            if (this.selectedRole !== 'all') params.role = this.selectedRole;
            if (this.selectedStatus !== 'all') params.status = this.selectedStatus;
            if (this.searchQuery) params.search = this.searchQuery;
            return params;
        },
        async fetchData() {
            this.loading = true;
            try {
                const params = this.buildQuery();
                const res = await axiosInstance.post('/admin/cooperations', params);
                if (res.data.message === 'Success') {
                    this.items = res.data.cooperations;
                    this.pagination = res.data.pagination;
                }
            } catch (e) {
                console.error('Error fetching cooperations', e);
            } finally {
                this.loading = false;
                this.mounted = true;
            }
        },
        updateUrlAndFetchData() {
            const params = new URLSearchParams(window.location.search);

            params.forEach((value, key) => {
                if (!["role", "sort", "page", "search", "status"].includes(key)) {
                    // نگه داشتن
                }
            });

            if (this.selectedRole && this.selectedRole !== "all") {
                params.set("role", this.selectedRole);
            } else {
                params.delete("role");
            }

            if (this.selectedStatus && this.selectedStatus !== "all") {
                params.set("status", this.selectedStatus);
            } else {
                params.delete("status");
            }

            if (this.selectedSort && this.selectedSort !== "newest") {
                params.set("sort", this.selectedSort);
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

            this.fetchData();
        },
        updatePage(page) {
            this.currentPage = page;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        resetFilters() {
            this.selectedRole = 'all';
            this.selectedStatus = 'all';
            this.selectedSort = 'newest';
            this.searchQuery = '';
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        async viewDetails(id) {
            this.showDetailsModal = true;
            this.detailsLoading = true;
            this.selectedCooperation = null;
            try {
                const res = await axiosInstance.get(`/admin/cooperation/${id}`);
                if (res.data.message === 'Success') {
                    this.selectedCooperation = res.data.cooperation;
                }
            } catch (e) {
                console.error('Error loading cooperation details', e);
            } finally {
                this.detailsLoading = false;
            }
        },
        closeDetails() {
            this.showDetailsModal = false;
            this.selectedCooperation = null;
        },
        openDeleteModal(id) {
            this.deleteId = id;
            this.showDeleteModal = true;
        },
        closeDelete() {
            this.showDeleteModal = false;
            this.deleteId = null;
            this.deleteLoading = false;
        },
        async confirmDelete() {
            if (!this.deleteId) return;
            this.deleteLoading = true;
            try {
                await axiosInstance.delete(`/admin/cooperation/${this.deleteId}`);
                this.closeDelete();
                this.fetchData();
            } catch (e) {
                console.error('Error deleting cooperation', e);
            } finally {
                this.deleteLoading = false;
            }
        },
    },
};
</script>

<style scoped></style>
