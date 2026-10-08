<script setup>
definePageMeta({
  name: "admin-reports",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        
        <template #breadcrumb-actions>
                    <button @click="refreshData"
                        class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                        <span class="block group-active:[transform:translate3d(0,1px,0)]">
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
                        </span>
                    </button>
        </template>
        <div class="min-w-0">
            <!-- Stats Cards -->
            <div v-if="stats" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-4 mb-6">
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">کل گزارش‌ها</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ stats.total }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <rect x="0" y="0" width="24" height="24" />
                                    <path
                                        d="M10.9630156,7.5 L11.0475062,7.5 C11.3043819,7.5 11.5194647,7.69464724 11.5450248,7.95024814 L12,12.5 L15.2480695,14.3560397 C15.403857,14.4450611 15.5,14.6107328 15.5,14.7901613 L15.5,15 C15.5,15.2109164 15.3290185,15.3818979 15.1181021,15.3818979 C15.0841582,15.3818979 15.0503659,15.3773725 15.0176181,15.3684413 L10.3986612,14.1087258 C10.1672824,14.0456225 10.0132986,13.8271186 10.0316926,13.5879956 L10.4644883,7.96165175 C10.4845267,7.70115317 10.7017474,7.5 10.9630156,7.5 Z"
                                        fill="currentColor" />
                                    <path
                                        d="M7.38979581,2.8349582 C8.65216735,2.29743306 10.0413491,2 11.5,2 C17.2989899,2 22,6.70101013 22,12.5 C22,18.2989899 17.2989899,23 11.5,23 C5.70101013,23 1,18.2989899 1,12.5 C1,11.5151324 1.13559454,10.5619345 1.38913364,9.65805651 L3.31481075,10.1982117 C3.10672013,10.940064 3,11.7119264 3,12.5 C3,17.1944204 6.80557963,21 11.5,21 C16.1944204,21 20,17.1944204 20,12.5 C20,7.80557963 16.1944204,4 11.5,4 C10.54876,4 9.62236069,4.15592757 8.74872191,4.45446326 L9.93948308,5.87355717 C10.0088058,5.95617272 10.0495583,6.05898805 10.05566,6.16666224 C10.0712834,6.4423623 9.86044965,6.67852665 9.5847496,6.69415008 L4.71777931,6.96995273 C4.66931162,6.97269931 4.62070229,6.96837279 4.57348157,6.95710938 C4.30487471,6.89303938 4.13906482,6.62335149 4.20313482,6.35474463 L5.33163823,1.62361064 C5.35654118,1.51920756 5.41437908,1.4255891 5.49660017,1.35659741 C5.7081375,1.17909652 6.0235153,1.2066885 6.2010162,1.41822583 L7.38979581,2.8349582 Z"
                                        fill="currentColor" opacity="0.3" />
                                </g>
                            </svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">در انتظار بررسی</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ stats.pending }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <rect x="0" y="0" width="24" height="24" />
                                    <path
                                        d="M4,4 L11.6314229,2.5691082 C11.8750185,2.52343403 12.1249815,2.52343403 12.3685771,2.5691082 L20,4 L20,13.2830094 C20,16.2173861 18.4883464,18.9447835 16,20.5 L12.5299989,22.6687507 C12.2057287,22.8714196 11.7942713,22.8714196 11.4700011,22.6687507 L8,20.5 C5.51165358,18.9447835 4,16.2173861 4,13.2830094 L4,4 Z"
                                        fill="currentColor" opacity="0.3" />
                                    <path
                                        d="M11.1750002,14.75 C10.9354169,14.75 10.6958335,14.6541667 10.5041669,14.4625 L8.58750019,12.5458333 C8.20416686,12.1625 8.20416686,11.5875 8.58750019,11.2041667 C8.97083352,10.8208333 9.59375019,10.8208333 9.92916686,11.2041667 L11.1750002,12.45 L14.3375002,9.2875 C14.7208335,8.90416667 15.2958335,8.90416667 15.6791669,9.2875 C16.0625002,9.67083333 16.0625002,10.2458333 15.6791669,10.6291667 L11.8458335,14.4625 C11.6541669,14.6541667 11.4145835,14.75 11.1750002,14.75 Z"
                                        fill="currentColor" />
                                </g>
                            </svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">بررسی شده</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ stats.resolved }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 10H16M8 14H16M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">سوالات</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ stats.by_type?.question || 0 }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M7 8H17M7 12H17M7 16H13M5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20Z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">کامنت‌ها</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ stats.by_type?.comment || 0 }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" viewBox="0 0 23 22" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7915 11.0486C11.292 11.0486 10.887 11.4535 10.887 11.9531C10.887 12.4526 11.2919 12.8575 11.7915 12.8575L15.4209 12.8575C15.9205 12.8575 16.3254 12.4526 16.3254 11.9531C16.3254 11.4535 15.9205 11.0486 15.4209 11.0486L11.7915 11.0486Z" fill="currentColor"/>
                                <path d="M16.3021 4.92382C15.3306 4.83267 14.2064 4.79518 12.9123 4.79518C4.92001 4.79518 3.00712 6.22507 2.07443 12.8965C1.93217 13.9141 1.84681 14.8097 1.83266 15.597M16.3021 4.92382C21.3305 5.39564 22.2667 7.30528 21.4851 12.8965C20.5524 19.568 18.6395 20.9979 10.6472 20.9979C3.87388 20.9979 1.75406 19.9709 1.83266 15.597M16.3021 4.92382V2.99488C15.963 0.294405 4.81796 0.647123 3.63956 2.99488C1.83233 6.59543 1.83266 15.597 1.83266 15.597" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">مقالات</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ stats.by_type?.article || 0 }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <AdminBulkActionBar :count="selectedIds.length">
                <button type="button" @click.prevent="openDeleteReportsModal(selectedIds, true)"
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
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="simple-search" v-model="searchQuery" @input="handleSearch"
                            class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 pe-8 p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="جستجو در گزارش‌ها..." />
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
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت:</div>
                        <select v-model="selectedStatus" @change="selectStatus(selectedStatus)"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option v-for="(sts, index) in statuses" :key="index" :value="sts.value">{{ sts.title }}</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">نوع:</div>
                        <select v-model="selectedType" @change="selectType(selectedType)"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option v-for="(typ, index) in types" :key="index" :value="typ.value">{{ typ.title }}</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                        <select v-model="selectedSort" @change="selectSort(selectedSort)"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option v-for="(srt, index) in sort" :key="index" :value="srt.value">{{ srt.title }}</option>
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

            <div class="mt-4 flex flex-wrap items-center justify-end gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-amber-400 dark:bg-amber-500"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">در انتظار بررسی</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-emerald-400 dark:bg-emerald-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">بررسی شده</span>
                </div>
            </div>

            <div id="data-list">
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 whitespace-nowrap text-start w-10">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">گزارش‌دهنده</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">نوع محتوا</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">محتوا</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">صاحب محتوا</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">متن گزارش</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت محتوا</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="item in items" :key="item.id"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start w-10">
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                        :class="getReportStatusBarClass(item)"></div>
                                    <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                                </td>
                                <td class="pط-1 py-3 whitespace-nowrap text-start">
                                    <div class="flex items-center">
                                        <div
                                            class="flex-shrink-0 w-9 h-9 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-200 border-opacity-30 dark:border-opacity-10 overflow-hidden">
                                            <img onerror="this.style.display='none'" v-if="item.user?.profile_pic"
                                                :src="item.user.profile_pic" :alt="item.user.name"
                                                class="w-full h-full object-cover" />
                                            <div v-else class="w-full h-full flex items-center justify-center">
                                                <span class="text-amber-400 text-sm font-medium">{{
                                                    item.user?.name?.charAt(0) || '?' }}</span>
                                            </div>
                                        </div>
                                        <div class="ms-2">
                                            <router-link v-if="item.user?.username"
                                                :to="{ name: 'admin-user-details', params: { username: item.user.username } }"
                                                class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1 hover:text-yellow-500">
                                                {{ item.user?.name || 'نامشخص' }}
                                            </router-link>
                                            <div v-else
                                                class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {{ item.user?.name || 'نامشخص' }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                @{{ item.user?.username || '-' }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1 w-max">
                                        {{ getTypeName(item.reportable_type) }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 text-start">
                                    <div class="max-w-xs">
                                        <div v-if="item.reportable_type === 'question' && item.reportable" class="text-xs">
                                            <div class="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {{ item.reportable.subject || 'بدون عنوان' }}
                                            </div>
                                            <div class="text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                                                {{ item.reportable.question?.substring(0, 80) || '' }}
                                            </div>
                                        </div>
                                        <div v-else-if="item.reportable_type === 'answer' && item.reportable" class="text-xs">
                                            <div class="text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {{ item.reportable.answer?.substring(0, 80) || '' }}
                                            </div>
                                        </div>
                                        <div v-else-if="item.reportable_type === 'comment' && item.reportable" class="text-xs">
                                            <div class="text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {{ item.reportable.comment?.substring(0, 80) || '' }}
                                            </div>
                                        </div>
                                        <div v-else-if="item.reportable_type === 'course' && item.reportable" class="text-xs">
                                            <div class="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {{ item.reportable.title || 'بدون عنوان' }}
                                            </div>
                                        </div>
                                        <div v-else-if="item.reportable_type === 'article' && item.reportable" class="text-xs">
                                            <router-link
                                                :to="{ name: 'admin-article-details', params: { id: item.reportable.id } }"
                                                class="font-semibold text-gray-900 dark:text-white line-clamp-1 hover:text-yellow-500 transition block">
                                                {{ item.reportable.title || 'بدون عنوان' }}
                                            </router-link>
                                            <div v-if="item.reportable.excerpt" class="text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                                                {{ item.reportable.excerpt?.substring(0, 80) || '' }}
                                            </div>
                                        </div>
                                        <div v-else
                                            class="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100/50 dark:bg-gray-800/30 px-2 py-1 rounded-lg w-max">
                                            محتوای حذف شده
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div v-if="getContentOwner(item)" class="flex items-center">
                                        <div
                                            class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-200 border-opacity-30 dark:border-opacity-10 overflow-hidden">
                                            <div class="w-full h-full flex items-center justify-center">
                                                <span class="text-amber-400 text-xs font-medium">{{
                                                    getContentOwner(item).name?.charAt(0) || '?' }}</span>
                                            </div>
                                        </div>
                                        <div class="ms-2 min-w-0">
                                            <router-link v-if="getContentOwner(item).username"
                                                :to="{ name: 'admin-user-details', params: { username: getContentOwner(item).username } }"
                                                class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1 hover:text-yellow-500 block">
                                                {{ getContentOwner(item).name }}
                                            </router-link>
                                            <div v-else
                                                class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {{ getContentOwner(item).name }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                @{{ getContentOwner(item).username || '-' }}
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-xs text-gray-400 dark:text-gray-500">-</div>
                                </td>
                                <td class="px-1 py-3 text-start">
                                    <div
                                        class="max-w-xs text-xs text-gray-600 dark:text-gray-300 line-clamp-2 bg-gray-50/80 dark:bg-gray-800/30 px-2 py-1 rounded-lg">
                                        {{ item.report || '-' }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium px-2 py-1 rounded-lg line-clamp-1 w-max"
                                        :class="getContentStatusClass(item)">
                                        {{ getContentStatusLabel(item) }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                        {{ formatDate(item.created_at) }}
                                    </div>
                                </td>
                                <td class="relative px-1 py-3 whitespace-nowrap text-center">
                                    <Popover class="group flex items-center justify-center">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                        <PopoverButton
                                            class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none flex items-center justify-center p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z"
                                                    fill="currentColor" />
                                                <path
                                                    d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z"
                                                    fill="currentColor" />
                                                <path
                                                    d="M10 2C10 0.89543 9.10457 -4.82823e-08 8 0C6.89543 4.82823e-08 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z"
                                                    fill="currentColor" />
                                            </svg>
                                        </PopoverButton>
                                        <transition enter-active-class="transition duration-200 ease-out"
                                            enter-from-class="translate-y-1 opacity-0"
                                            enter-to-class="translate-y-0 opacity-100"
                                            leave-active-class="transition duration-150 ease-in"
                                            leave-from-class="translate-y-0 opacity-100"
                                            leave-to-class="translate-y-1 opacity-0">
                                            <PopoverPanel
                                                class="text-start flex flex-col z-30 end-10 absolute p-2 bg-white rounded-lg shadow w-max min-w-[10rem] dark:bg-gray-900 dark:divide-gray-800">
                                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                    <li v-if="!item.status">
                                                        <button type="button" @click="updateReportStatus(item.id, true)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            علامت‌گذاری بررسی شده
                                                        </button>
                                                    </li>
                                                    <li v-if="item.status">
                                                        <button type="button" @click="updateReportStatus(item.id, false)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            علامت‌گذاری بررسی نشده
                                                        </button>
                                                    </li>
                                                    <li v-if="item.reportable && !isContentDeactivated(item)">
                                                        <button type="button" @click="deactivateContent(item.id)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-orange-600 dark:text-orange-400">
                                                            غیرفعال کردن محتوا
                                                        </button>
                                                    </li>
                                                    <li v-if="item.reportable && isContentDeactivated(item)">
                                                        <button type="button" @click="activateContent(item.id)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-green-600 dark:text-green-400">
                                                            فعال کردن محتوا
                                                        </button>
                                                    </li>
                                                    <li v-if="item.reportable">
                                                        <button type="button" @click="openDeleteContentModal(item.id)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-rose-600 dark:text-rose-400">
                                                            حذف محتوا
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" @click="openDeleteReportModal(item.id)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-rose-600 dark:text-rose-400">
                                                            حذف گزارش
                                                        </button>
                                                    </li>
                                                </ul>
                                            </PopoverPanel>
                                        </transition>
                                    </Popover>
                                </td>
                            </tr>
                            <tr v-if="!loading && items.length === 0">
                                <td colspan="9" class="px-4 py-12 text-center">
                                    <div class="text-gray-400 dark:text-gray-500 text-sm font-medium">گزارشی یافت نشد</div>
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
                    <select :value="perPage" @change="selectPerpage(parseInt($event.target.value))"
                        class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                        <option v-for="per in perPages" :key="per" :value="per">{{ per }}</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Delete Report Modal -->
        <div v-if="showDeleteReportModal"
            class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-900 rounded-xl w-[95%] md:w-[480px] p-5 shadow-xl">
                <div class="text-sm font-semibold text-gray-800 dark:text-gray-50 mb-1">حذف گزارش</div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-5">
                    از حذف این گزارش اطمینان دارید؟ این عمل قابل بازگشت نیست.
                </div>
                <div class="flex items-center justify-end gap-2">
                    <button @click="closeDeleteReportModal"
                        class="text-xs font-semibold px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                        انصراف
                    </button>
                    <button :disabled="deleteReportLoading" @click="deleteReport"
                        class="text-xs font-semibold px-4 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 min-w-[5rem]">
                        <span v-if="deleteReportLoading">...</span>
                        <span v-else>حذف</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Content Modal -->
        <div v-if="showDeleteContentModal"
            class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-900 rounded-xl w-[95%] md:w-[480px] p-5 shadow-xl">
                <div class="text-sm font-semibold text-gray-800 dark:text-gray-50 mb-1">حذف محتوا</div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-5">
                    از حذف این محتوا اطمینان دارید؟ تمام گزارش‌های مربوطه نیز حذف خواهند شد.
                </div>
                <div class="flex items-center justify-end gap-2">
                    <button @click="closeDeleteContentModal"
                        class="text-xs font-semibold px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                        انصراف
                    </button>
                    <button :disabled="deleteContentLoading" @click="deleteContent"
                        class="text-xs font-semibold px-4 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 min-w-[5rem]">
                        <span v-if="deleteContentLoading">...</span>
                        <span v-else>حذف</span>
                    </button>
                </div>
            </div>
        </div>

        <LoadingComponent v-if="loading" class="" />
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import debounce from "lodash/debounce";

export default {
    components: {
        AdminMasterPage,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        LoadingComponent,
        Popover, PopoverButton, PopoverPanel, PopoverOverlay,
        PaginationComponent,
    },
    data() {
        const statuses = [
            { title: "همه", value: "all" },
            { title: "در انتظار", value: "pending" },
            { title: "بررسی شده", value: "resolved" }
        ];

        const types = [
            { title: "همه", value: "all" },
            { title: "سوال", value: "question" },
            { title: "جواب", value: "answer" },
            { title: "کامنت", value: "comment" },
            { title: "دوره", value: "course" },
            { title: "مقاله", value: "article" }
        ];

        const sort = [
            { title: "جدیدترین", value: "newest" },
            { title: "قدیمی‌ترین", value: "oldest" }
        ];

        return {
            loading: false,
            items: [],
            pagination: {},
            stats: null,
            searchQuery: '',
            selectedStatus: statuses[0].value,
            selectedType: types[0].value,
            selectedSort: sort[0].value,
            statuses,
            types,
            sort,
            perPage: 20,
            perPages: [10, 20, 30, 50, 100],
            selectedIds: [],
            showDeleteReportModal: false,
            showDeleteContentModal: false,
            deleteReportLoading: false,
            deleteContentLoading: false,
            reportToDelete: null,
            contentToDelete: null,
            currentPage: 1
        };
    },
    computed: {
        isAllSelected() {
            return this.items.length > 0 && this.selectedIds.length === this.items.length;
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && this.selectedIds.length < this.items.length;
        }
    },
    created() {
        this.handleSearch = debounce(() => {
            this.currentPage = 1;
            this.fetchReports();
        }, 500);
    },
    mounted() {
        this.fetchStats();
        this.fetchReports();
    },
    methods: {
        refreshData() {
            this.fetchStats();
            this.fetchReports();
        },
        async fetchStats() {
            try {
                const response = await axiosInstance.get('/admin/reports/stats');
                if (response.data && response.data.stats) {
                    this.stats = response.data.stats;
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        },
        async fetchReports() {
            this.loading = true;
            try {
                const params = {
                    page: this.currentPage,
                    perPage: this.perPage,
                    sort: this.selectedSort,
                };

                if (this.selectedStatus !== 'all') {
                    params.status = this.selectedStatus;
                }

                if (this.selectedType !== 'all') {
                    params.type = this.selectedType;
                }

                if (this.searchQuery) {
                    params.search = this.searchQuery;
                }

                const response = await axiosInstance.post('/admin/reports', params);
                if (response.data && response.data.reports) {
                    this.items = response.data.reports.data || [];
                    this.pagination = {
                        current_page: response.data.reports.current_page,
                        last_page: response.data.reports.last_page,
                        per_page: response.data.reports.per_page,
                        total: response.data.reports.total
                    };
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                this.loading = false;
            }
        },
        selectStatus(status) {
            this.selectedStatus = status;
            this.currentPage = 1;
            this.fetchReports();
        },
        selectType(type) {
            this.selectedType = type;
            this.currentPage = 1;
            this.fetchReports();
        },
        selectSort(sort) {
            this.selectedSort = sort;
            this.currentPage = 1;
            this.fetchReports();
        },
        selectPerpage(per) {
            this.perPage = per;
            this.currentPage = 1;
            this.fetchReports();
        },
        clearFilters() {
            this.selectedStatus = this.statuses[0].value;
            this.selectedType = this.types[0].value;
            this.selectedSort = this.sort[0].value;
            this.searchQuery = '';
            this.currentPage = 1;
            this.fetchReports();
        },
        clearSearch() {
            this.searchQuery = '';
            this.currentPage = 1;
            this.fetchReports();
        },
        toggleSelectAll() {
            if (this.isAllSelected) {
                this.selectedIds = [];
            } else {
                this.selectedIds = this.items.map(item => item.id);
            }
        },
        updatePage(page) {
            this.currentPage = page;
            this.fetchReports();
        },
        getTypeName(type) {
            const typeNames = {
                'question': 'سوال',
                'answer': 'جواب',
                'comment': 'کامنت',
                'course': 'دوره',
                'article': 'مقاله'
            };
            return typeNames[type] || type;
        },
        getContentOwner(item) {
            if (!item.reportable) return null;
            if (item.reportable_type === 'course') {
                return item.reportable.teacher || null;
            }
            return item.reportable.user || null;
        },
        isContentActive(item) {
            if (!item.reportable) return null;
            if (item.reportable_type === 'comment') {
                return item.reportable.approved !== false;
            }
            return item.reportable.publish !== false;
        },
        getContentStatusLabel(item) {
            if (!item.reportable) return 'حذف شده';
            return this.isContentActive(item) ? 'فعال' : 'غیرفعال';
        },
        getContentStatusClass(item) {
            if (!item.reportable) {
                return 'text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50';
            }
            return this.isContentActive(item)
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/20'
                : 'text-rose-700 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-900/20';
        },
        getReportStatusBarClass(item) {
            return item.status
                ? 'bg-emerald-400 dark:bg-emerald-600'
                : 'bg-amber-400 dark:bg-amber-500';
        },
        isRequestCanceled(error) {
            return error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError';
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
        isContentDeactivated(item) {
            if (!item.reportable) return false;
            return !this.isContentActive(item);
        },
        async updateReportStatus(id, status) {
            try {
                const response = await axiosInstance.post(`/admin/report/${id}/update-status`, { status });
                if (response.status >= 200 && response.status < 300) {
                    await this.fetchReports();
                    await this.fetchStats();
                }
            } catch (error) {
                if (this.isRequestCanceled(error)) return;
                console.error('Error updating report status:', error);
                alert('خطا در به‌روزرسانی وضعیت گزارش');
            }
        },
        async deactivateContent(id) {
            try {
                const response = await axiosInstance.post(`/admin/report/${id}/deactivate-content`);
                if (response.status >= 200 && response.status < 300) {
                    await this.fetchReports();
                    await this.fetchStats();
                }
            } catch (error) {
                if (this.isRequestCanceled(error)) return;
                console.error('Error deactivating content:', error);
                alert('خطا در غیرفعال کردن محتوا');
            }
        },
        async activateContent(id) {
            try {
                const response = await axiosInstance.post(`/admin/report/${id}/activate-content`);
                if (response.status >= 200 && response.status < 300) {
                    await this.fetchReports();
                    await this.fetchStats();
                }
            } catch (error) {
                if (this.isRequestCanceled(error)) return;
                console.error('Error activating content:', error);
                alert('خطا در فعال کردن محتوا');
            }
        },
        openDeleteReportModal(id) {
            this.reportToDelete = id;
            this.showDeleteReportModal = true;
        },
        closeDeleteReportModal() {
            this.showDeleteReportModal = false;
            this.reportToDelete = null;
        },
        async deleteReport() {
            if (!this.reportToDelete) return;

            if (Array.isArray(this.reportToDelete)) {
                await this.deleteMultipleReports();
                return;
            }

            this.deleteReportLoading = true;
            try {
                const response = await axiosInstance.delete(`/admin/report/${this.reportToDelete}`);
                if (response.data.message) {
                    this.fetchReports();
                    this.fetchStats();
                    this.closeDeleteReportModal();
                }
            } catch (error) {
                console.error('Error deleting report:', error);
                alert('خطا در حذف گزارش');
            } finally {
                this.deleteReportLoading = false;
            }
        },
        openDeleteReportsModal(ids, isMultiple = false) {
            if (isMultiple) {
                this.reportToDelete = ids;
            } else {
                this.reportToDelete = [ids];
            }
            this.showDeleteReportModal = true;
        },
        async deleteMultipleReports() {
            if (!this.reportToDelete || !Array.isArray(this.reportToDelete)) return;
            this.deleteReportLoading = true;
            try {
                const response = await axiosInstance.post('/admin/reports/delete-multiple', {
                    ids: this.reportToDelete
                });
                if (response.data.message) {
                    this.selectedIds = [];
                    this.fetchReports();
                    this.fetchStats();
                    this.closeDeleteReportModal();
                }
            } catch (error) {
                console.error('Error deleting reports:', error);
                alert('خطا در حذف گزارش‌ها');
            } finally {
                this.deleteReportLoading = false;
            }
        },
        openDeleteContentModal(id) {
            this.contentToDelete = id;
            this.showDeleteContentModal = true;
        },
        closeDeleteContentModal() {
            this.showDeleteContentModal = false;
            this.contentToDelete = null;
        },
        async deleteContent() {
            if (!this.contentToDelete) return;
            this.deleteContentLoading = true;
            try {
                const response = await axiosInstance.post(`/admin/report/${this.contentToDelete}/delete-content`);
                if (response.data.message) {
                    this.fetchReports();
                    this.fetchStats();
                    this.closeDeleteContentModal();
                }
            } catch (error) {
                console.error('Error deleting content:', error);
                alert('خطا در حذف محتوا');
            } finally {
                this.deleteContentLoading = false;
            }
        }
    }
}
</script>

<style scoped></style>
