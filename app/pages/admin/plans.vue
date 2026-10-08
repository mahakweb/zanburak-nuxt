<script setup>
definePageMeta({
  name: "admin-plans-list",
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
                        </span>
                    </button>
                    <router-link :to="{ name: 'admin-plan-create' }"
                        class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                ایجاد پلن جدید

                                <svg class="w-5 h-5 rtl:ms-1 -mt-0.5" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24" />
                                        <path
                                            d="M11,11 L11,7 C11,6.44771525 11.4477153,6 12,6 C12.5522847,6 13,6.44771525 13,7 L13,11 L17,11 C17.5522847,11 18,11.4477153 18,12 C18,12.5522847 17.5522847,13 17,13 L13,13 L13,17 C13,17.5522847 12.5522847,18 12,18 C11.4477153,18 11,17.5522847 11,17 L11,13 L7,13 C6.44771525,13 6,12.5522847 6,12 C6,11.4477153 6.44771525,11 7,11 L11,11 Z"
                                            fill="currentColor" />
                                    </g>
                                </svg>
                            </span>
                        </span>
                    </router-link>
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
                        <input type="text" v-model="searchQuery" @input="handleSearch"
                            class="bg-white text-gray-900 text-sm font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="جستجو پلن..." />
                    </div>
                </div>
                <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                    <Listbox v-model="selectedStatus" v-slot="{ open }" as="div" class="w-max min-w-[6rem]">
                        <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
                        <div class="relative" :class="open ? ' z-20' : ''">
                            <div class="text-xs font-light text-gray-400 px-1">وضعیت:</div>
                            <ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''"
                                class="w-full flex justify-between items-center px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs">
                                <div class="flex items-center">
                                    <span class="mx-2 flex items-center line-clamp-1 font-semibold">{{
                                        selectedStatus.title }}</span>
                                </div>
                                <div class="ms-4 py-1.5">
                                    <svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''"
                                        viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor"
                                            stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round">
                                        </path>
                                    </svg>
                                </div>
                            </ListboxButton>
                            <ListboxOptions
                                class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-xs space-y-1 p-1 rounded-b-xl">
                                <ListboxOption v-for="(sts, index) in statuses" :key="index"
                                    @click.prevent="selectStatus(sts)" :value="sts" :disabled="false"
                                    class="flex items-center px-2 py-3 md:py-2 rounded-lg cursor-pointer"
                                    :class="selectedStatus == sts ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:bg-opacity-50'">
                                    <span class="ms-2 font-semibold">{{ sts.title }}</span>
                                </ListboxOption>
                            </ListboxOptions>
                        </div>
                    </Listbox>

                    <Listbox v-model="selectedSort" v-slot="{ open }" as="div" class="w-max min-w-[7rem]">
                        <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
                        <div class="relative" :class="open ? ' z-20' : ''">
                            <div class="text-xs font-light text-gray-400 px-1">مرتب‌سازی:</div>
                            <ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''"
                                class="w-full flex justify-between items-center px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs">
                                <div class="flex items-center">
                                    <span class="mx-2 flex items-center line-clamp-1 font-semibold">{{
                                        selectedSort.title }}</span>
                                </div>
                                <div class="ms-4 py-1.5">
                                    <svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''"
                                        viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor"
                                            stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round">
                                        </path>
                                    </svg>
                                </div>
                            </ListboxButton>
                            <ListboxOptions
                                class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-xs space-y-1 p-1 rounded-b-xl">
                                <ListboxOption v-for="(srt, index) in sort" :key="index"
                                    @click.prevent="selectSort(srt)" :value="srt" :disabled="false"
                                    class="flex items-center px-2 py-3 md:py-2 rounded-lg cursor-pointer"
                                    :class="selectedSort == srt ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:bg-opacity-50'">
                                    <span class="ms-2 font-semibold">{{ srt.title }}</span>
                                </ListboxOption>
                            </ListboxOptions>
                        </div>
                    </Listbox>

                    <div claass="inline-flex ">
                        <button @click.prevent="clearFilters"
                            class="flex items-center justify-center h-8 w-8 bg-rose-400/20 hover:bg-opacity-90 rounded-lg focus:ring-2 ring-rose-500 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800">
                            <svg class="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none"
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

            <div class="mt-4 flex items-center justify-end gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-gray-400 dark:bg-gray-600"></div>
                    <span class="text-xs font-medium text-gray-400">غیرفعال</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-green-400 dark:bg-green-600"></div>
                    <span class="text-xs font-medium text-gray-400">فعال</span>
                </div>
            </div>

            <div id="data-list">
                <AdminBulkActionBar :count="selectedIds.length">
                    <button type="button" @click="openBulkDeleteModal"
                        class="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50">
                        حذف
                    </button>
                    <button type="button" @click="selectedIds = []"
                        class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                        لغو انتخاب
                    </button>
                </AdminBulkActionBar>
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 w-8">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[20rem]">پلن</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">قیمت</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">مدت (روز)</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">تعداد خرید</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">کاربران فعال</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">ویژگی‌ها</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">زمان ایجاد</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="(plan, i) in items" :key="i"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="relative ps-2 pe-3 py-3" @click.stop>
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                        :class="[plan.status ? 'bg-green-400 dark:bg-green-600' : 'bg-gray-400']">
                                    </div>
                                    <AdminBulkCheckbox v-model="selectedIds" :value="plan.id" />
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[20rem]">
                                    <div class="flex items-center">
                                        <div
                                            class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-opacity-10 rounded-full border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
                                            <img v-if="plan.icon" :src="plan.icon" alt=""
                                                class="w-full h-full object-cover">
                                        </div>
                                        <div class="ms-2">
                                            <div class="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                                                <span>{{ plan.title }}</span>
                                                <span v-if="plan.allows_installment" class="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:text-sky-300">اقساطی</span>
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">{{ plan.english_title
                                            }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="flex items-center gap-1 text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">
                                        {{ formatCurrency(plan.price) }}
                                        <svg class="w-3 h-3" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="text-gray-600 dark:text-white" d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C11.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z" fill="currentColor"></path></svg>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">
                                        {{ plan.period_time }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">
                                        {{ plan.purchases_count }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">
                                        {{ plan.active_users_count }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="flex items-center gap-1">
                                        <div
                                            class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">
                                            {{ plan.features.length }} مورد</div>
                                        <button @click.prevent="{ showPlanFeature = true; selectedPlan = plan }"
                                            class="flex items-center gap-1 text-xs font-light text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">
                                            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"
                                                version="1.1">
                                                <rect fill="currentColor" x="4" y="4" width="7" height="7" rx="1.5" />
                                                <path
                                                    d="M5.5,13 L9.5,13 C10.3284271,13 11,13.6715729 11,14.5 L11,18.5 C11,19.3284271 10.3284271,20 9.5,20 L5.5,20 C4.67157288,20 4,19.3284271 4,18.5 L4,14.5 C4,13.6715729 4.67157288,13 5.5,13 Z M14.5,4 L18.5,4 C19.3284271,4 20,4.67157288 20,5.5 L20,9.5 C20,10.3284271 19.3284271,11 18.5,11 L14.5,11 C13.6715729,11 13,10.3284271 13,9.5 L13,5.5 C13,4.67157288 13.6715729,4 14.5,4 Z M14.5,13 L18.5,13 C19.3284271,13 20,13.6715729 20,14.5 L20,18.5 C20,19.3284271 19.3284271,20 18.5,20 L14.5,20 C13.6715729,20 13,19.3284271 13,18.5 L13,14.5 C13,13.6715729 13.6715729,13 14.5,13 Z"
                                                    fill="currentColor" opacity="0.3" />
                                            </svg>
                                            مشاهده</button>
                                    </div>

                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div dir="ltr"
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">
                                        {{ formatDate(plan.created_at) }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-center">
                                    <Popover class="group relative inline-flex items-center">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                        <PopoverButton
                                            class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none flex items-center justify-center">
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
                                                        <button
                                                            @click="$router.push({ name: 'admin-plan-edit', params: { id: plan.id } })"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ویرایش
                                                            پلن</button>
                                                    </li>
                                                    <li>
                                                        <button @click="openDeletePlanModal(plan.id)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-600">حذف
                                                            پلن</button>
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
            </div>

            <div class="flex lg:flex-row flex-col items-center justify-between gap-4 -mt-20">
                <div class="">
                    <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                </div>
                <div class="">
                    <Listbox v-model="perPage" v-slot="{ open }" as="div" class="w-max min-w-[5rem]">
                        <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
                        <div class="relative" :class="open ? ' z-20' : ''">
                            <ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''"
                                class="w-full flex justify-between items-center px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs">
                                <div class="flex items-center">
                                    <span class="mx-2 flex items-center line-clamp-1 font-semibold">{{ perPage }}</span>
                                </div>
                                <div class="ms-4 py-1.5">
                                    <svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''"
                                        viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor"
                                            stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round">
                                        </path>
                                    </svg>
                                </div>
                            </ListboxButton>
                            <ListboxOptions
                                class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-xs space-y-1 p-1 rounded-b-xl">
                                <ListboxOption v-for="(per, index) in perPages" :key="index"
                                    @click.prevent="selectPerpage(per)" :value="per" :disabled="false"
                                    class="flex items-center px-2 py-3 md:py-2 rounded-lg cursor-pointer"
                                    :class="perPage == per ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:bg-opacity-50'">
                                    <span class="ms-2 font-semibold">{{ per }}</span>
                                </ListboxOption>
                            </ListboxOptions>
                        </div>
                    </Listbox>
                </div>
            </div>

            <LoadingComponent v-if="loading" class="" />

            <BottomSheetDrawer v-model="showDeletePlanModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">حذف پلن</h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeDeletePlanModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {{ isBulkDelete ? `از حذف ${selectedIds.length} پلن اطمینان کامل دارید؟` : 'از حذف این پلن اطمینان کامل دارید؟' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">این عمل قابل بازگشت نیست.</p>
                <div class="flex justify-end gap-3">
                    <button type="button" @click="closeDeletePlanModal"
                        class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        انصراف
                    </button>
                    <button type="button" @click="deletePlan" :disabled="deleteLoading"
                        class="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors shadow-lg shadow-rose-500/30">
                        <span v-if="deleteLoading">در حال حذف...</span>
                        <span v-else>حذف</span>
                    </button>
                </div>
            </BottomSheetDrawer>

            <BottomSheetDrawer v-model="showPlanFeature" :initialHeight="0.5" :maxHeight="0.95" :minHeight="0.4"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[25rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="">
                    <div class="text-sm font-bold text-gray-900 dark:text-white mb-2">ویژگی‌های پلن</div>
                    <div v-if="selectedPlan.features.length > 0" class="w-max space-y-1">
                        <div v-for="(feat, fi) in selectedPlan.features" :key="fi" class="">
                            <div class="flex items-start text-xs text-gray-700 dark:text-gray-200">
                                <span class="mt-1 w-1.5 h-1.5 rounded-full bg-current"></span>
                                <span class="ms-2">{{ formatFeature(feat) }}</span>
                            </div>
                            <div v-if="fi + 1 < selectedPlan.features.length"
                                class="ms-4 my-1.5 h-0.5 border-b border-dashed border-gray-100 dark:border-opacity-20">
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-xs text-gray-500">-</div>
                </div>
            </BottomSheetDrawer>
        </div>
    </AdminMasterPage>

</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import axiosInstance from "@/store/axiosInstance";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";

export default {
    components: { AdminMasterPage, AdminBulkCheckbox, AdminBulkActionBar, LoadingComponent, PaginationComponent, Listbox, ListboxButton, ListboxOptions, ListboxOption, Popover, PopoverButton, PopoverPanel, PopoverOverlay, BottomSheetDrawer },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        const statuses = {
            all: { title: "همه", slug: "all" },
            active: { title: "فعال", slug: "active" },
            inactive: { title: "غیرفعال", slug: "inactive" },
            installment: { title: "فقط اقساطی", slug: "installment" },
        };
        const sort = {
            newest: { title: "جدیدترین", slug: "newest" },
            oldest: { title: "قدیمی‌ترین", slug: "oldest" },
            price_high: { title: "بالاترین قیمت", slug: "price_high" },
            price_low: { title: "کمترین قیمت", slug: "price_low" },
            purchases_high: { title: "بیشترین خرید", slug: "purchases_high" },
            active_high: { title: "بیشترین فعال", slug: "active_high" },
        };
        return {
            loading: false,
            items: [],
            pagination: {},
            perPage: 10,
            perPages: [10, 20, 30, 50, 100],
            searchQuery: '',
            statuses,
            selectedStatus: urlParams.get('installment') === 'yes'
                ? statuses.installment
                : (statuses[urlParams.get('status')] || statuses.all),
            sort,
            selectedSort: sort.newest,
            mounted: false,
            currentPage: this.$route.query.page ? this.$route.query.page : 1,
            stats: null,
            showDeletePlanModal: false,
            planIdForDelete: null,
            deleteLoading: false,
            selectedIds: [],
            isBulkDelete: false,
            showPlanFeature: false,
            selectedPlan: null,
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
    methods: {
        toggleSelectAll() {
            if (this.isAllSelected) {
                this.selectedIds = [];
            } else {
                this.selectedIds = this.items.map((item) => item.id);
            }
        },
        openBulkDeleteModal() {
            if (!this.selectedIds.length) return;
            this.isBulkDelete = true;
            this.planIdForDelete = null;
            this.showDeletePlanModal = true;
        },
        selectStatus(status) {
            this.selectedStatus = status;
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
        handleSearch() {
            clearTimeout(this._searchTimer);
            this._searchTimer = setTimeout(() => {
                this.currentPage = 1;
                this.mounted = false;
                this.updateUrlAndFetchData();
            }, 1000);
        },
        clearFilters() {
            this.selectedSort = this.sort['newest'];
            this.selectedStatus = this.statuses.all;
            this.searchQuery = '';
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        updateUrlAndFetchData() {
            const params = new URLSearchParams(window.location.search);

            params.forEach((value, key) => {
                if (!["sort", "page", "search", "status"].includes(key)) {
                    // نگه داشتن
                }
            });


            if (this.selectedStatus && this.selectedStatus.slug !== "all") {
                if (this.selectedStatus.slug === "installment") {
                    params.set("installment", "yes");
                    params.delete("status");
                } else {
                    params.set("status", this.selectedStatus.slug);
                    params.delete("installment");
                }
            } else {
                params.delete("status");
                params.delete("installment");
            }

            if (this.selectedSort && this.selectedSort.slug !== "newest") {
                params.set("sort", this.selectedSort.slug);
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
        buildQuery() {
            const params = {
                page: this.currentPage,
                perPage: this.perPage,
                sort: this.selectedSort.slug,
            };
            if (this.selectedStatus.slug === 'installment') {
                params.installment = 'yes';
            } else if (this.selectedStatus.slug !== 'all') {
                params.status = this.selectedStatus.slug;
            }
            if (this.searchQuery) params.search = this.searchQuery;
            return params;
        },
        async fetchData() {
            this.loading = true;
            try {
                const params = this.buildQuery();
                const res = await axiosInstance.post('/admin/plans', params);
                if (res.data.message === 'Success') {
                    this.items = res.data.plans;
                    this.pagination = res.data.pagination;
                }
            } catch (e) {
                console.error('Error fetching plans', e);
            } finally {
                this.loading = false;
                this.mounted = true;
            }
        },
        updatePage(page) {
            this.currentPage = page;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        formatCurrency(amount) {
            if (!amount) return 0;
            return new Intl.NumberFormat('fa-IR').format(amount);
        },
        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        },
        formatFeature(feat) {
            if (typeof feat === 'string') return feat;
            if (feat == null) return '';
            try {
                return JSON.stringify(feat);
            } catch (e) {
                return String(feat);
            }
        },
        openDeletePlanModal(id) {
            this.isBulkDelete = false;
            this.planIdForDelete = id;
            this.showDeletePlanModal = true;
        },
        closeDeletePlanModal() {
            this.showDeletePlanModal = false;
            this.planIdForDelete = null;
            this.isBulkDelete = false;
        },
        async deletePlan() {
            const ids = this.isBulkDelete ? [...this.selectedIds] : (this.planIdForDelete ? [this.planIdForDelete] : []);
            if (!ids.length) return;
            this.deleteLoading = true;
            try {
                for (const id of ids) {
                    await axiosInstance.delete(`/admin/plan/${id}`);
                }
                this.selectedIds = [];
                this.$toast?.success?.(ids.length > 1 ? `${ids.length} پلن حذف شد` : 'پلن حذف شد');
                this.closeDeletePlanModal();
                this.fetchData();
            } catch (e) {
                console.error('Error deleting plan', e);
                this.$toast?.error?.('خطا در حذف پلن');
            } finally {
                this.deleteLoading = false;
            }
        }
    },
    async mounted() {
        await this.fetchData();
    },
    watch: {
        '$route.query': {
            handler() {
                if (this.mounted) {
                    this.currentPage = parseInt(this.$route.query.page) || 1;
                    this.perPage = parseInt(this.$route.query.perPage) || 20;
                    this.searchQuery = this.$route.query.search || '';
                    const statusSlug = this.$route.query.status || 'all';
                    const sortSlug = this.$route.query.sort || 'newest';
                    this.selectedStatus = this.statuses[statusSlug] || this.statuses['all'];
                    this.selectedSort = this.sort[sortSlug] || this.sort['newest'];
                    this.fetchData();
                }
            },
            deep: true
        }
    }
};
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
    height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(107, 114, 128, 0.5);
    border-radius: 9999px;
}
</style>
