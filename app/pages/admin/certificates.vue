<script setup>
definePageMeta({
  name: "admin-certificates",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        
        <template #breadcrumb-actions>
                    <button @click="openCreateModal"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                صدور گواهینامه جدید
                                <svg class="w-5 h-5 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
                        </span></button>
                    <button @click="exportCertificates"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                خروجی اکسل
                                <svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
                        </span></button>
                    <button @click="getCertificateStats"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                آمار گواهینامه‌ها
                                <svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"></path>
                                    <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
                        </span></button>
        </template>
        <div class="min-w-0">
            <!-- Stats Cards -->
            <div v-if="stats" class="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4 mb-6">
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <rect x="0" y="0" width="24" height="24" />
                                    <path
                                        d="M4,9.67471899 L10.880262,13.6470401 C10.9543486,13.689814 11.0320333,13.7207107 11.1111111,13.740321 L11.1111111,21.4444444 L4.49070127,17.526473 C4.18655139,17.3464765 4,17.0193034 4,16.6658832 L4,9.67471899 Z M20,9.56911707 L20,16.6658832 C20,17.0193034 19.8134486,17.3464765 19.5092987,17.526473 L12.8888889,21.4444444 L12.8888889,13.6728275 C12.9050191,13.6647696 12.9210067,13.6561758 12.9368301,13.6470401 L20,9.56911707 Z"
                                        fill="currentColor" />
                                    <path
                                        d="M4.21611835,7.74669402 C4.30015839,7.64056877 4.40623188,7.55087574 4.5299008,7.48500698 L11.5299008,3.75665466 C11.8237589,3.60013944 12.1762411,3.60013944 12.4700992,3.75665466 L19.4700992,7.48500698 C19.5654307,7.53578262 19.6503066,7.60071528 19.7226939,7.67641889 L12.0479413,12.1074394 C11.9974761,12.1365754 11.9509488,12.1699127 11.9085461,12.2067543 C11.8661433,12.1699127 11.819616,12.1365754 11.7691509,12.1074394 L4.21611835,7.74669402 Z"
                                        fill="currentColor" opacity="0.3" />
                                </g>
                            </svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">کل گواهینامه‌ها</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ stats.total_certificates }}
                            </p>
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
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">صادر شده</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ stats.issued_certificates }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/60 rounded-lg">
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
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">در انتظار</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ stats.pending_certificates }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4" title="کاربران دارای گواهینامه">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <polygon points="0 0 24 0 24 24 0 24" />
                                    <path
                                        d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z"
                                        fill="currentColor" fill-rule="nonzero" opacity="0.3" />
                                    <path
                                        d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z"
                                        fill="currentColor" fill-rule="nonzero" />
                                </g>
                            </svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">کاربران</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{
                                stats.total_users_with_certificates }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4" title="دوره‌های دارای گواهینامه">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <rect x="0" y="0" width="24" height="24" />
                                    <rect fill="currentColor" x="2" y="6" width="13" height="12" rx="2" />
                                    <path
                                        d="M22,8.4142119 L22,15.5857848 C22,16.1380695 21.5522847,16.5857848 21,16.5857848 C20.7347833,16.5857848 20.4804293,16.4804278 20.2928929,16.2928912 L16.7071064,12.7071013 C16.3165823,12.3165768 16.3165826,11.6834118 16.7071071,11.2928877 L20.2928936,7.70710477 C20.683418,7.31658067 21.316583,7.31658098 21.7071071,7.70710546 C21.8946433,7.89464181 22,8.14899558 22,8.4142119 Z"
                                        fill="currentColor" opacity="0.3" />
                                </g>
                            </svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">دوره‌ها</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{
                                stats.total_courses_with_certificates }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <AdminBulkActionBar :count="selectedIds.length">
                <button type="button" @click.prevent="openDeleteCertificateModal(selectedIds, true)"
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
                            class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 p-2.5  dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white "
                            placeholder="جستجو..." required />
                    </div>
                </div>
                <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت صدور:</div>
                        <select :value="selectedIssued.slug" @change="selectIssued(issuedStatuses[$event.target.value])"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option v-for="(sts, key) in issuedStatuses" :key="key" :value="sts.slug">
                                {{ sts.title }}
                            </option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                        <select :value="selectedSort.slug" @change="selectSort(sort[$event.target.value])"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option v-for="(srt, key) in sort" :key="key" :value="srt.slug">
                                {{ srt.title }}
                            </option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">نمایش:</div>
                        <select v-model="dataView"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[5.5rem]">
                            <option v-for="opt in viewOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                        </select>
                    </div>
                    <div class="inline-flex">
                        <button @click.prevent="clearFilters"
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
            <div id="data-list" class="mt-4">
                <div v-if="dataView === 'grid' && items.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 pt-1">
                    <CertificateGridCard
                        v-for="item in items"
                        :key="item.uuid"
                        :item="item"
                        v-model:selected-ids="selectedIds"
                        @details="viewCertificateDetails"
                        @issue="issueCertificate"
                        @edit="openEditModal"
                        @delete="openDeleteCertificateModal"
                    />
                </div>

                <div v-else-if="dataView === 'list'" class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-2 whitespace-nowrap text-start w-10">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 whitespace-nowrap text-start w-40">سریال</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">کاربر</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start min-w-[15rem]">دوره</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">زمان تکمیل (دقیقه)</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ صدور</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ ایجاد</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="(item, i) in items" :key="i"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="relative ps-3 pe-1 py-2 whitespace-nowrap text-start w-10">
                                    <div class="absolute w-1 start-0 top-[25%] h-[50%] rounded-e-lg"
                                        :class="[item.issued_at ? 'bg-green-400' : 'bg-yellow-400']"></div>
                                    <div class="flex items-center justify-center">
                                        <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                                    </div>
                                </td>
                                <td class="px-1 py-5 text-start w-40" :title="item.serial_number || item.uuid">
                                    <div class="flex items-center gap-1 min-w-0">
                                        <span class="text-xs font-medium font-mono text-gray-900 dark:text-white truncate">
                                            {{ item.serial_number || '—' }}
                                        </span>
                                        <CopyTextButton v-if="item.serial_number" :value="item.serial_number" />
                                    </div>
                                </td>
                                <td class="px-1 py-5 text-start">
                                    <div class="flex items-center">
                                        <div
                                            class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-opacity-10 rounded-full border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
                                            <img onerror="this.style.display='none'" class="w-full h-full object-cover"
                                                :src="item.user?.profile_pic" :alt="item.user?.first_name" />
                                        </div>
                                        <div class="ms-2">
                                            <div class="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">
                                                {{ item.user_name || (item.user ? item.user.first_name + ' ' +
                                                    item.user.last_name : 'نامشخص') }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {{ item.user?.email || 'ایمیل نامشخص' }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-5 text-start min-w-[15rem]">
                                    <div class="flex items-center">
                                        <div
                                            class="flex-shrink-0 w-12 h-8 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
                                            <img onerror="this.style.display='none'" class="w-full h-full object-cover"
                                                :src="item.course?.poster" :alt="item.course_title" />
                                        </div>
                                        <div class="ms-2">
                                            <div class="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">
                                                {{ item.course_title || (item.course ? item.course.title : 'نامشخص') }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {{ item.course ? item.course.english_title : 'unknown' }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-5 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        {{ formatCertificateDuration(item.time_completed, 'fa') }}
                                    </div>
                                </td>
                                <td class="px-1 py-5 whitespace-nowrap text-start">
                                    <div v-if="item.issued_at" dir="ltr"
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        {{ formatDate(item.issued_at) }}
                                    </div>
                                    <div v-else class="text-xs text-gray-500 dark:text-gray-400">
                                        -
                                    </div>
                                </td>
                                <td class="px-1 py-5 whitespace-nowrap text-start">
                                    <div dir="ltr"
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        {{ formatDate(item.created_at) }}
                                    </div>
                                </td>
                                <td class="px-1 py-5 whitespace-nowrap text-center">
                                    <Popover class="group relative flex items-center justify-center">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                        <PopoverButton
                                            class="text-gray-900 dark:text-white me-2 relative  group-focus-within:z-30 focus:outline-none  flex items-center justify-center">
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
                                                class="text-start flex flex-col z-30 end-10 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-900 dark:divide-gray-800">
                                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                    <li>
                                                        <button @click="viewCertificateDetails(item.uuid)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">جزئیات</button>
                                                    </li>
                                                    <li v-if="!item.issued_at">
                                                        <button @click="issueCertificate(item.uuid)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">صدور
                                                            گواهینامه</button>
                                                    </li>
                                                    <li>
                                                        <button @click="openEditModal(item)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ویرایش</button>
                                                    </li>
                                                    <li>
                                                        <button @click="openDeleteCertificateModal(item.uuid)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-600">حذف</button>
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

                <div v-else-if="!loading && mounted" class="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                    <div class="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <svg class="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">گواهینامه‌ای یافت نشد</p>
                </div>
            </div>
            <div class="flex lg:flex-row flex-col items-center justify-between gap-4" :class="dataView === 'list' && items.length ? '-mt-20' : 'mt-4'">
                <div class="">
                    <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                </div>
                <div class="">
                    <select :value="perPage" @change="selectPerpage(parseInt($event.target.value))"
                        class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                        <option v-for="per in perPages" :key="per" :value="per">
                            {{ per }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Certificate Details BottomSheetDrawer -->
        <BottomSheetDrawer v-model="showCertificateDetailsModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="w-full">
                <div class="">
                    <div v-if="selectedCertificate" class="">
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
                                    اطلاعات گواهینامه
                                </h4>
                                <hr class="border-t border-gray-100 dark:border-opacity-10 m-2" />
                                <div class="">
                                    <table class="w-full border-spacing-0.5 border-separate">
                                        <tbody class="text-xs whitespace-nowrap">
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    سریال</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    <div class="flex items-center gap-1 min-w-0">
                                                        <span class="font-mono truncate">{{ selectedCertificate.serial_number || '—' }}</span>
                                                        <CopyTextButton v-if="selectedCertificate.serial_number" :value="selectedCertificate.serial_number" />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    UUID</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    <div class="flex items-center gap-1 min-w-0">
                                                        <span class="font-mono text-[11px] truncate">{{ selectedCertificate.uuid }}</span>
                                                        <CopyTextButton :value="selectedCertificate.uuid" />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    نام کاربر</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        selectedCertificate.user_name }}</td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    عنوان دوره</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        selectedCertificate.course_title }}</td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    زمان تکمیل</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        formatCertificateDuration(selectedCertificate.time_completed, 'fa') }}</td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    قالب</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{ selectedCertificate.template?.name || 'پیش‌فرض دوره' }}
                                                </td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    وضعیت</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    <span
                                                        :class="selectedCertificate.issued_at ? 'text-green-600' : 'text-yellow-600'">
                                                        {{ selectedCertificate.issued_at ? 'صادر شده' : 'در انتظار'
                                                        }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    تاریخ صدور</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        formatDate(selectedCertificate.issued_at)
                                                    }}
                                                </td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    تاریخ ایجاد</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        formatDate(selectedCertificate.created_at)
                                                    }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    اطلاعات کاربر
                                </h4>
                                <hr class="border-t border-gray-100 dark:border-opacity-10 m-2" />
                                <div v-if="selectedCertificate.user" class="">
                                    <table class="w-full border-spacing-0.5 border-separate">
                                        <tbody class="text-xs whitespace-nowrap gap-1">
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    نام</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        selectedCertificate.user.first_name }} {{
                                                        selectedCertificate.user.last_name }}</td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    ایمیل</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        selectedCertificate.user.email }}</td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    نام کاربری</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        selectedCertificate.user.username }}</td>
                                            </tr>
                                            <tr v-if="selectedCertificate.user.mobile" class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    موبایل</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        selectedCertificate.user.mobile }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div v-else class="text-gray-500">اطلاعات کاربر موجود نیست</div>
                            </div>

                            <div v-if="selectedCertificate.course"
                                class="rounded-md border border-gray-100 dark:border-opacity-10 p-2">
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
                                    اطلاعات دوره
                                </h4>
                                <hr class="border-t border-gray-100 dark:border-opacity-10 m-2" />
                                <div class="">
                                    <table class="w-full border-spacing-0.5 border-separate">
                                        <tbody class="text-xs whitespace-nowrap gap-1">
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    عنوان</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        selectedCertificate.course.title }}</td>
                                            </tr>
                                            <tr v-if="selectedCertificate.course.english_title" class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    عنوان‌انگلیسی</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        selectedCertificate.course.english_title }}</td>
                                            </tr>
                                            <tr v-if="selectedCertificate.course.teacher" class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    مدرس</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                    {{
                                                        selectedCertificate.course.teacher.first_name
                                                    }} {{
                                                        selectedCertificate.course.teacher.last_name }}</td>
                                            </tr>
                                            <tr class="">
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                    &nbsp;</td>
                                                <td
                                                    class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BottomSheetDrawer>

        <!-- Create/Edit Certificate BottomSheetDrawer -->
        <BottomSheetDrawer v-model="showCreateEditModal" :initialHeight="0.88" :maxHeight="0.95" :minHeight="0.55"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[44rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="sticky top-0 z-10 -mx-4 px-4 pt-1 pb-4 mb-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm shadow-amber-500/20">
                            <svg class="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                                {{ certificateFormMode === 'create' ? 'صدور گواهینامه جدید' : 'ویرایش گواهینامه' }}
                            </h3>
                            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                کاربر، دوره و قالب گواهینامه را انتخاب کنید
                            </p>
                        </div>
                    </div>
                    <button type="button" @click="closeCreateEditModal"
                        class="shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <form @submit.prevent="submitCertificateForm" class="space-y-5">
                <!-- Template picker -->
                <section class="rounded-2xl border border-amber-200/60 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/80 to-white dark:from-amber-500/5 dark:to-gray-900 p-4">
                    <div class="flex items-center justify-between gap-2 mb-3">
                        <div>
                            <h4 class="text-xs font-bold text-gray-900 dark:text-white">انتخاب قالب گواهینامه</h4>
                            <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">قالب مورد نظر را به صورت تصویری انتخاب کنید</p>
                        </div>
                        <router-link :to="{ name: 'admin-certificate-templates' }"
                            class="shrink-0 text-[10px] font-semibold text-amber-700 dark:text-amber-400 hover:underline">
                            مدیریت قالب‌ها
                        </router-link>
                    </div>
                    <CertificateTemplatePicker
                        v-model="certificateForm.certificate_template_id"
                        :templates="certificateTemplates"
                        :loading="templatesLoading"
                    />
                </section>

                <!-- User & Course -->
                <section class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/50 p-4 space-y-4">
                    <h4 class="text-xs font-bold text-gray-900 dark:text-white">اطلاعات اصلی</h4>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">کاربر *</label>
                            <div class="relative">
                                <input type="text" v-model="certificateForm.user_search" @input="searchUsers"
                                    placeholder="جستجوی کاربر..."
                                    class="bg-gray-50 text-gray-900 text-sm rounded-xl outline-none focus:ring-2 focus:ring-amber-400/50 border border-gray-200/80 dark:border-gray-700 block w-full p-2.5 dark:bg-gray-800 dark:text-white" />
                                <div v-if="userSearchResults.length > 0"
                                    class="absolute z-20 w-full p-1 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                                    <div v-for="user in userSearchResults" :key="user.id" @click="selectUser(user)"
                                        class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                                        <div class="text-sm font-medium line-clamp-1">{{ user.first_name }} {{ user.last_name }}</div>
                                        <div class="text-xs text-gray-500 line-clamp-1">{{ user.email }}</div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="certificateForm.user_id"
                                class="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                                {{ selectedUserDisplay }}
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">دوره *</label>
                            <div class="relative">
                                <input type="text" v-model="certificateForm.course_search" @input="searchCourses"
                                    placeholder="جستجوی دوره..."
                                    class="bg-gray-50 text-gray-900 text-sm rounded-xl outline-none focus:ring-2 focus:ring-amber-400/50 border border-gray-200/80 dark:border-gray-700 block w-full p-2.5 dark:bg-gray-800 dark:text-white" />
                                <div v-if="courseSearchResults.length > 0"
                                    class="absolute z-20 w-full p-1 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                                    <div v-for="course in courseSearchResults" :key="course.id"
                                        @click="selectCourse(course)"
                                        class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                                        <div class="text-sm font-medium line-clamp-1">{{ course.title }}</div>
                                        <div v-if="course.english_title" class="text-xs text-gray-500 line-clamp-1">{{ course.english_title }}</div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="certificateForm.course_id"
                                class="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                                {{ selectedCourseDisplay }}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Optional fields -->
                <section class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/50 p-4 space-y-4">
                    <h4 class="text-xs font-bold text-gray-900 dark:text-white">جزئیات تکمیلی</h4>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">نام کاربر (اختیاری)</label>
                            <input type="text" v-model="certificateForm.user_name"
                                class="bg-gray-50 text-gray-900 text-sm rounded-xl outline-none focus:ring-2 focus:ring-amber-400/50 border border-gray-200/80 dark:border-gray-700 block w-full p-2.5 dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">عنوان دوره (اختیاری)</label>
                            <input type="text" v-model="certificateForm.course_title"
                                class="bg-gray-50 text-gray-900 text-sm rounded-xl outline-none focus:ring-2 focus:ring-amber-400/50 border border-gray-200/80 dark:border-gray-700 block w-full p-2.5 dark:bg-gray-800 dark:text-white" />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">زمان تکمیل دوره (ثانیه)</label>
                            <input type="number" v-model.number="certificateForm.time_completed" min="0"
                                class="bg-gray-50 text-gray-900 text-sm rounded-xl outline-none focus:ring-2 focus:ring-amber-400/50 border border-gray-200/80 dark:border-gray-700 block w-full p-2.5 dark:bg-gray-800 dark:text-white" />
                            <p v-if="certificateForm.time_completed" class="mt-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                                معادل: {{ formatCertificateDuration(certificateForm.time_completed, 'fa') }}
                            </p>
                            <p v-else class="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                                با انتخاب دوره، مدت زمان آن به‌صورت خودکار پر می‌شود.
                            </p>
                        </div>
                        <div v-if="certificateFormMode === 'create'">
                            <label class="flex items-center gap-2 cursor-pointer rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 px-3 py-2.5">
                                <input type="checkbox" v-model="certificateForm.auto_issue"
                                    class="appearance-none w-5 h-5 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox" />
                                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">صدور خودکار گواهینامه</span>
                            </label>
                        </div>
                    </div>
                </section>

                <div class="flex justify-end gap-2 pt-2 sticky bottom-0 -mx-4 px-4 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800">
                    <button type="button" @click="closeCreateEditModal"
                        class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        انصراف
                    </button>
                    <button type="submit" :disabled="certificateFormLoading"
                        class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-900 bg-yellow-400 rounded-xl hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-amber-500/20">
                        <svg v-if="certificateFormLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ certificateFormMode === 'create' ? 'صدور گواهینامه' : 'ذخیره تغییرات' }}
                    </button>
                </div>
            </form>
        </BottomSheetDrawer>


        <!-- Delete Certificate Bottom Sheet -->
        <BottomSheetDrawer v-model="showDeleteCertificateModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">حذف گواهینامه</h3>
                <button type="button"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                    @click="closeDeleteCertificateModal">
                    <span class="sr-only">Close</span>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">از حذف این گواهینامه اطمینان کامل دارید؟</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">این عمل قابل بازگشت نیست.</p>
            <label class="flex items-center cursor-pointer mb-6">
                <input type="checkbox" v-model="forceDelete"
                    class="me-2 appearance-none w-5 h-5 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    حذف کامل (غیر قابل بازگشت)
                </span>
            </label>
            <div class="flex justify-end gap-3">
                <button type="button" @click="closeDeleteCertificateModal"
                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    انصراف
                </button>
                <button type="button" @click="deleteCertificate" :disabled="deleteCertificateLoading"
                    class="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors shadow-lg shadow-rose-500/30">
                    <span v-if="deleteCertificateLoading">در حال حذف...</span>
                    <span v-else>{{ forceDelete ? 'حذف کامل' : 'لغو گواهینامه' }}</span>
                </button>
            </div>
        </BottomSheetDrawer>

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
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import CopyTextButton from "@/views/components/common/CopyTextButton.vue";
import CertificateTemplatePicker from "@/views/components/certificate/CertificateTemplatePicker.vue";
import CertificateGridCard from "@/views/components/certificate/CertificateGridCard.vue";
import { listCertificateTemplates } from "@/services/certificate.service";
import { formatCertificateDuration } from "@/utils/certificateDisplay";
import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";

export default {
    components: {
        AdminMasterPage,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        LoadingComponent,
        Popover, PopoverButton, PopoverPanel, PopoverOverlay,
        PaginationComponent,
        BottomSheetDrawer,
        CopyTextButton,
        CertificateTemplatePicker,
        CertificateGridCard
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        const issuedSlugFromUrl = urlParams.get('issued') || 'all';
        const sortSlugFromUrl = urlParams.get('sort') || 'newest';

        const issuedStatuses = {
            all: {
                title: "همه",
                slug: "all"
            },
            yes: {
                title: "صادر شده",
                slug: "yes"
            },
            no: {
                title: "در انتظار",
                slug: "no"
            }
        };

        const sort = {
            newest: {
                title: "جدیدترین",
                slug: "newest"
            },
            oldest: {
                title: "قدیمی‌ترین",
                slug: "oldest"
            },
            issued_newest: {
                title: "جدیدترین صادر شده",
                slug: "issued_newest"
            },
            issued_oldest: {
                title: "قدیمی‌ترین صادر شده",
                slug: "issued_oldest"
            },
            user_name: {
                title: "نام کاربر",
                slug: "user_name"
            },
            course_title: {
                title: "نام دوره",
                slug: "course_title"
            }
        };

        return {
            loading: false,
            items: [],
            pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 20,
                total: 0
            },
            currentPage: parseInt(urlParams.get('page')) || 1,
            perPage: parseInt(urlParams.get('perPage')) || 20,
            perPages: [10, 20, 30, 50, 100],
            searchQuery: urlParams.get('search') || '',
            selectedIssued: issuedStatuses[issuedSlugFromUrl] || issuedStatuses.all,
            selectedSort: sort[sortSlugFromUrl] || sort.newest,
            issuedStatuses,
            sort,
            selectedIds: [],
            stats: null,
            dataView: 'grid',
            viewOptions: [
                { value: 'grid', label: 'شبکه‌ای' },
                { value: 'list', label: 'جدول' },
            ],
            certificateTemplates: [],
            templatesLoading: false,

            // Modals
            showCertificateDetailsModal: false,
            showCreateEditModal: false,
            showDeleteCertificateModal: false,
            selectedCertificate: null,
            certificateIdForDelete: null,
            deleteCertificateLoading: false,
            forceDelete: false,

            // Certificate Form
            certificateFormMode: 'create', // 'create' or 'edit'
            certificateForm: {
                user_id: null,
                course_id: null,
                user_name: '',
                course_title: '',
                time_completed: null,
                auto_issue: false,
                certificate_template_id: null,
                user_search: '',
                course_search: ''
            },
            certificateFormLoading: false,
            userSearchResults: [],
            courseSearchResults: [],
            selectedUserDisplay: '',
            selectedCourseDisplay: '',

            mounted: false
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
    mounted() {
        this.initializeFromUrl();
        this.fetchData();
        this.getCertificateStats();
        this.loadCertificateTemplates();
    },
    methods: {
        formatCertificateDuration,

        async loadCertificateTemplates() {
            this.templatesLoading = true;
            try {
                const res = await listCertificateTemplates({ perPage: 100, active: 'yes' });
                this.certificateTemplates = res.templates?.data || res.templates || [];
            } catch (error) {
                console.error('Error loading certificate templates:', error);
            } finally {
                this.templatesLoading = false;
            }
        },

        defaultTemplateId() {
            const def = this.certificateTemplates.find((t) => t.is_default && t.is_active !== false);
            return def?.id || this.certificateTemplates.find((t) => t.is_active !== false)?.id || null;
        },

        initializeFromUrl() {
            const query = this.$route.query;
            if (query.page) this.currentPage = parseInt(query.page);
            if (query.perPage) this.perPage = parseInt(query.perPage);
            if (query.search) this.searchQuery = query.search;
            if (query.issued) this.selectedIssued = this.issuedStatuses[query.issued] || this.issuedStatuses.all;
            if (query.sort) this.selectedSort = this.sort[query.sort] || this.sort.newest;
        },

        handleSearch: debounce(function () {
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        }, 1000),

        selectIssued(status) {
            this.selectedIssued = status;
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },

        selectSort(sort) {
            this.selectedSort = sort;
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },

        selectPerpage(per) {
            this.perPage = per;
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },

        clearFilters() {
            this.selectedIssued = this.issuedStatuses.all;
            this.selectedSort = this.sort.newest;
            this.searchQuery = '';
            this.currentPage = 1;
            this.perPage = 20;
            this.mounted = false;

            // Clear URL completely
            window.history.replaceState(
                { ...window.history.state },
                '',
                this.$route.path
            );

            this.fetchData();
        },

        updateUrlAndFetchData() {
            const query = {
                page: this.currentPage,
                perPage: this.perPage,
                issued: this.selectedIssued.slug !== 'all' ? this.selectedIssued.slug : undefined,
                sort: this.selectedSort.slug,
                search: this.searchQuery || undefined
            };

            Object.keys(query).forEach(key => {
                if (query[key] === undefined) {
                    delete query[key];
                }
            });

            // Use replaceState to avoid triggering navigation and NProgress
            const queryString = Object.keys(query)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
                .join('&');

            const newUrl = queryString
                ? `${this.$route.path}?${queryString}`
                : this.$route.path;

            window.history.replaceState(
                { ...window.history.state },
                '',
                newUrl
            );

            this.fetchData();
        },

        async fetchData() {
            this.loading = true;
            try {
                const params = {
                    page: this.currentPage,
                    perPage: this.perPage,
                    issued: this.selectedIssued.slug !== 'all' ? this.selectedIssued.slug : undefined,
                    sort: this.selectedSort.slug,
                    search: this.searchQuery || undefined
                };

                Object.keys(params).forEach(key => {
                    if (params[key] === undefined) {
                        delete params[key];
                    }
                });

                const response = await axiosInstance.post('/admin/certificates', params);

                if (response.data.message === 'Success') {
                    this.items = response.data.certificates;
                    this.pagination = response.data.pagination;
                }
            } catch (error) {
                console.error('Error fetching certificates:', error);
                toast.error(error.response?.data?.message || 'خطا در دریافت اطلاعات', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.loading = false;
                this.mounted = true;
            }
        },

        async getCertificateStats() {
            try {
                const response = await axiosInstance.get('/admin/certificates/stats');
                if (response.data.message === 'Success') {
                    this.stats = response.data.stats;
                }
            } catch (error) {
                console.error('Error fetching certificate stats:', error);
            }
        },

        async viewCertificateDetails(uuid) {
            try {
                const response = await axiosInstance.get(`/admin/certificates/${uuid}/details`);
                if (response.data.message === 'Success') {
                    this.selectedCertificate = response.data.certificate;
                    this.showCertificateDetailsModal = true;
                }
            } catch (error) {
                console.error('Error fetching certificate details:', error);
                toast.error('خطا در دریافت جزئیات گواهینامه', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },

        closeCertificateDetailsModal() {
            this.showCertificateDetailsModal = false;
            this.selectedCertificate = null;
        },

        async openCreateModal() {
            this.certificateFormMode = 'create';
            if (!this.certificateTemplates.length) {
                await this.loadCertificateTemplates();
            }
            this.certificateForm = {
                user_id: null,
                course_id: null,
                user_name: '',
                course_title: '',
                time_completed: null,
                auto_issue: false,
                certificate_template_id: this.defaultTemplateId(),
                user_search: '',
                course_search: ''
            };
            this.userSearchResults = [];
            this.courseSearchResults = [];
            this.selectedUserDisplay = '';
            this.selectedCourseDisplay = '';
            this.showCreateEditModal = true;
        },

        openEditModal(item) {
            this.certificateFormMode = 'edit';
            this.certificateForm = {
                user_id: item.user?.id || null,
                course_id: item.course?.id || null,
                user_name: item.user_name || '',
                course_title: item.course_title || '',
                time_completed: item.time_completed || null,
                auto_issue: false,
                certificate_template_id: item.template?.id || null,
                user_search: item.user ? `${item.user.first_name} ${item.user.last_name}` : '',
                course_search: item.course ? item.course.title : '',
                uuid: item.uuid
            };
            this.selectedUserDisplay = item.user ? `${item.user.first_name} ${item.user.last_name}` : '';
            this.selectedCourseDisplay = item.course ? item.course.title : '';
            this.userSearchResults = [];
            this.courseSearchResults = [];
            this.showCreateEditModal = true;
            if (!this.certificateTemplates.length) {
                this.loadCertificateTemplates();
            }
        },

        closeCreateEditModal() {
            this.showCreateEditModal = false;
            this.certificateForm = {
                user_id: null,
                course_id: null,
                user_name: '',
                course_title: '',
                time_completed: null,
                auto_issue: false,
                certificate_template_id: null,
                user_search: '',
                course_search: ''
            };
            this.userSearchResults = [];
            this.courseSearchResults = [];
        },

        searchUsers: debounce(async function () {
            if (this.certificateForm.user_search.length < 2) {
                this.userSearchResults = [];
                return;
            }
            try {
                const response = await axiosInstance.get('/admin/certificates/users', {
                    params: { search: this.certificateForm.user_search }
                });
                if (response.data.message === 'Success') {
                    this.userSearchResults = response.data.users;
                }
            } catch (error) {
                console.error('Error searching users:', error);
            }
        }, 500),

        searchCourses: debounce(async function () {
            if (this.certificateForm.course_search.length < 2) {
                this.courseSearchResults = [];
                return;
            }
            try {
                const response = await axiosInstance.get('/admin/certificates/courses', {
                    params: { search: this.certificateForm.course_search }
                });
                if (response.data.message === 'Success') {
                    this.courseSearchResults = response.data.courses;
                }
            } catch (error) {
                console.error('Error searching courses:', error);
            }
        }, 500),

        selectUser(user) {
            this.certificateForm.user_id = user.id;
            this.selectedUserDisplay = `${user.first_name} ${user.last_name}`;
            this.certificateForm.user_search = this.selectedUserDisplay;
            this.userSearchResults = [];
        },

        selectCourse(course) {
            this.certificateForm.course_id = course.id;
            this.selectedCourseDisplay = course.title;
            this.certificateForm.course_search = this.selectedCourseDisplay;
            this.courseSearchResults = [];
            if (course.total_time != null && course.total_time > 0) {
                this.certificateForm.time_completed = course.total_time;
            }
            if (!this.certificateForm.course_title) {
                this.certificateForm.course_title = course.title;
            }
        },

        async submitCertificateForm() {
            if (!this.certificateForm.user_id || !this.certificateForm.course_id) {
                toast.error('لطفا کاربر و دوره را انتخاب کنید', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }

            this.certificateFormLoading = true;
            try {
                if (this.certificateFormMode === 'create') {
                    await axiosInstance.post('/admin/certificates/create', {
                        user_id: this.certificateForm.user_id,
                        course_id: this.certificateForm.course_id,
                        user_name: this.certificateForm.user_name || undefined,
                        course_title: this.certificateForm.course_title || undefined,
                        time_completed: this.certificateForm.time_completed || undefined,
                        certificate_template_id: this.certificateForm.certificate_template_id || undefined,
                        auto_issue: this.certificateForm.auto_issue
                    });

                    toast.success('گواهینامه با موفقیت صادر شد', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                } else {
                    await axiosInstance.post(`/admin/certificates/${this.certificateForm.uuid}/update`, {
                        user_name: this.certificateForm.user_name || undefined,
                        course_title: this.certificateForm.course_title || undefined,
                        time_completed: this.certificateForm.time_completed !== null ? this.certificateForm.time_completed : undefined,
                        certificate_template_id: this.certificateForm.certificate_template_id ?? undefined,
                    });

                    toast.success('گواهینامه با موفقیت به‌روزرسانی شد', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }

                this.closeCreateEditModal();
                this.fetchData();
                this.getCertificateStats();
            } catch (error) {
                console.error('Error submitting certificate form:', error);
                toast.error(error.response?.data?.message || 'خطا در ثبت اطلاعات', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.certificateFormLoading = false;
            }
        },

        async issueCertificate(uuid) {
            try {
                const response = await axiosInstance.post(`/admin/certificates/${uuid}/issue`);
                if (response.data.message) {
                    toast.success('گواهینامه با موفقیت صادر شد', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.fetchData();
                    this.getCertificateStats();
                }
            } catch (error) {
                console.error('Error issuing certificate:', error);
                toast.error(error.response?.data?.message || 'خطا در صدور گواهینامه', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },

        openDeleteCertificateModal(uuid, isMultiple = false) {
            this.certificateIdForDelete = isMultiple ? uuid : uuid;
            this.forceDelete = false;
            this.showDeleteCertificateModal = true;
        },

        closeDeleteCertificateModal() {
            this.showDeleteCertificateModal = false;
            this.certificateIdForDelete = null;
            this.forceDelete = false;
        },

        async deleteCertificate() {
            this.deleteCertificateLoading = true;
            try {
                if (Array.isArray(this.certificateIdForDelete)) {
                    for (const uuid of this.certificateIdForDelete) {
                        await axiosInstance.delete(`/admin/certificates/${uuid}/delete`, {
                            data: { force_delete: this.forceDelete }
                        });
                    }
                    toast.success(`${this.certificateIdForDelete.length} گواهینامه ${this.forceDelete ? 'حذف شد' : 'لغو شد'}`, {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                } else {
                    await axiosInstance.delete(`/admin/certificates/${this.certificateIdForDelete}/delete`, {
                        data: { force_delete: this.forceDelete }
                    });
                    toast.success(this.forceDelete ? 'گواهینامه به طور کامل حذف شد' : 'گواهینامه لغو شد', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }

                this.selectedIds = [];
                this.fetchData();
                this.getCertificateStats();
                this.closeDeleteCertificateModal();
            } catch (error) {
                console.error('Error deleting certificate:', error);
                toast.error(error.response?.data?.message || 'خطا در حذف گواهینامه', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.deleteCertificateLoading = false;
            }
        },

        async exportCertificates() {
            try {
                const params = {
                    issued: this.selectedIssued.slug !== 'all' ? this.selectedIssued.slug : undefined,
                    search: this.searchQuery || undefined
                };

                Object.keys(params).forEach(key => {
                    if (params[key] === undefined) {
                        delete params[key];
                    }
                });

                const response = await axiosInstance.get('/admin/certificates/export', {
                    params: params,
                    responseType: 'blob'
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `certificates_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();

                toast.success('فایل با موفقیت دانلود شد', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } catch (error) {
                console.error('Error exporting certificates:', error);
                toast.error('خطا در خروجی گرفتن از گواهینامه‌ها', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },

        updatePage(page) {
            this.currentPage = page;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },

        toggleSelectAll() {
            if (this.isAllSelected) {
                this.selectedIds = [];
            } else {
                this.selectedIds = this.items.map(item => item.id);
            }
        },

        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
    }
}
</script>