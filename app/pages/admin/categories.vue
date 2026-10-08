<script setup>
definePageMeta({
  name: "admin-categories-list",
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
                    <router-link :to="{ name: 'admin-category-create' }"
                        class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                ایجاد دسته‌بندی جدید

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
<!-- <div class="my-5 border-t-2 border-gray-200 dark:border-gray-900"></div> -->
            <AdminBulkActionBar :count="selectedIds.length">
                <button type="button" @click.prevent="deleteCategory(selectedIds, true)"
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
                            class="bg-white text-gray-900 text-sm font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 p-2.5  dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white "
                            placeholder="جستجو..." required />
                    </div>
                </div>
                <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                    <Listbox v-model="selectedSort" v-slot="{ open }" as="div" class="w-max">
                        <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
                        <div class="relative" :class="open ? ' z-20' : ''">
                            <div class="text-xs font-light text-gray-400 px-1"> مرتب‌سازی:</div>
                            <ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''"
                                class="w-full flex justify-between items-center px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs">
                                <div class="flex items-center">
                                    <span class="mx-2 flex items-center line-clamp-1 font-semibold">{{
                                        selectedSort.title
                                        }}</span>
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
                                    <span v-html="srt.icon"></span>
                                    <span class="ms-2 font-semibold">{{ srt.title }}</span>
                                </ListboxOption>
                            </ListboxOptions>
                        </div>
                    </Listbox>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">نوع نمایش:</div>
                        <div class="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg p-0.5">
                            <button @click.prevent="selectView('list')"
                                :class="selectedView === 'list' ? 'bg-gray-800 dark:bg-gray-100 text-gray-100 dark:text-gray-800 shadow-sm' : 'text-gray-600 dark:text-gray-400'"
                                class="px-2 py-1 rounded-md text-xs font-semibold transition-colors">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3H21V21H3V3Z" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3 9H21M9 3V21" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <button @click.prevent="selectView('tree')"
                                :class="selectedView === 'tree' ? 'bg-gray-800 dark:bg-gray-100 text-gray-100 dark:text-gray-800 shadow-sm' : 'text-gray-600 dark:text-gray-400'"
                                class="px-2 py-1 rounded-md text-xs font-semibold transition-colors">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3H10V10H3V3Z" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M14 3H21V10H14V3Z" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3 14H10V21H3V14Z" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M14 14H21V21H14V14Z" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
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

            <div class="my-3 flex items-center justify-end gap-4">
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
                <div v-if="selectedView === 'tree'" class="">
                    <div class="columns-1 md:columns-2 gap-4">
                        <div v-for="(item, i) in items" :key="i" class="break-inside-avoid mb-4">
                            <!-- <CategoryItem :category="item" :is-last="i === items.length - 1" :is-root="true" -->
                            <CategoryItem :category="item" :isLast="true" :is-root="true"
                                @update:selected-ids="selectedIds = $event" @delete="deleteCategory">
                            </CategoryItem>
                        </div>
                    </div>
                </div>
                <div v-else class="overflow-x-auto md:custom-scrollbar">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-2 whitespace-nowrap text-start">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 whitespace-nowrap text-start w-24">آیکون</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">جزییات دسته‌بندی</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">دوره‌های مرتبط</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">اختصاص دوره‌ها</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="(item, i) in items" :key="i"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="px-1 py-2 whitespace-nowrap text-start">
                                    <div class="">
                                        <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start w-24">
                                    <div class="flex items-center">
                                        <div
                                            class="flex-shrink-0 w-20 h-12 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-100 dark:border-opacity-10 overflow-hidden">
                                            <img onerror="this.style.display='none'" v-if="item.icon"
                                                class="w-full h-full object-cover hover:scale-105 duration-150"
                                                :src="item.icon" :alt="item.title" />
                                            <div v-else
                                                class="w-full h-full flex justify-center items-center text-gray-600 dark:text-gray-300">
                                                <svg class="w-6 h-6" fill="none" viewBox="0 0 32 32"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path class="fill-current"
                                                        d="M27,22.1414V18a2,2,0,0,0-2-2H17V12h2a2.0023,2.0023,0,0,0,2-2V4a2.0023,2.0023,0,0,0-2-2H13a2.002,2.002,0,0,0-2,2v6a2.002,2.002,0,0,0,2,2h2v4H7a2,2,0,0,0-2,2v4.1421a4,4,0,1,0,2,0V18h8v4.142a4,4,0,1,0,2,0V18h8v4.1414a4,4,0,1,0,2,0ZM13,4h6l.001,6H13ZM8,26a2,2,0,1,1-2-2A2.0023,2.0023,0,0,1,8,26Zm10,0a2,2,0,1,1-2-2A2.0027,2.0027,0,0,1,18,26Zm8,2a2,2,0,1,1,2-2A2.0023,2.0023,0,0,1,26,28Z">
                                                    </path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3  text-start">
                                    <div class="flex items-center">
                                        <div class="ms-2 min-w-[12rem]">
                                            <div class="mb-2 text-gray-900 dark:text-white font-bold line-clamp-1"
                                                :title="item.title">
                                                {{ item.title }}
                                            </div>
                                            <div class="text-gray-500 text-xs line-clamp-1">{{ item.description }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div v-if="item.status"
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M3 14C3 9.02944 7.02944 5 12 5C16.9706 5 21 9.02944 21 14M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"></path>
                                        </svg>
                                        فعال
                                    </div>
                                    <div v-else
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M9.60997 9.60714C8.05503 10.4549 7 12.1043 7 14C7 16.7614 9.23858 19 12 19C13.8966 19 15.5466 17.944 16.3941 16.3878M21 14C21 9.02944 16.9706 5 12 5C11.5582 5 11.1238 5.03184 10.699 5.09334M3 14C3 11.0069 4.46104 8.35513 6.70883 6.71886M3 3L21 21"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"></path>
                                        </svg>
                                        غیرفعال
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <router-link
                                        :to="{ name: 'admin-courses-list', query: { category: item.slug } }"
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20 hover:text-yellow-800 dark:hover:text-yellow-300 transition-colors"
                                        :title="'مشاهده دوره‌های ' + item.title"
                                    >
                                        <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M15.3276 7.54199H8.67239C5.29758 7.54199 3.61017 7.54199 2.66232 8.52882C1.71447 9.51565 1.93748 11.0403 2.38351 14.0895L2.80648 16.9811C3.15626 19.3723 3.33115 20.5679 4.22834 21.2839C5.12553 21.9999 6.4488 21.9999 9.09534 21.9999H14.9046C17.5512 21.9999 18.8745 21.9999 19.7717 21.2839C20.6689 20.5679 20.8437 19.3723 21.1935 16.9811L21.6165 14.0895C22.0625 11.0403 22.2855 9.51564 21.3377 8.52882C20.3898 7.54199 18.7024 7.54199 15.3276 7.54199ZM14.5812 15.7942C15.1396 15.448 15.1396 14.5519 14.5812 14.2057L11.2096 12.1156C10.6669 11.7792 10 12.2171 10 12.9098V17.0901C10 17.7828 10.6669 18.2207 11.2096 17.8843L14.5812 15.7942Z"
                                                fill="currentColor"></path>
                                            <path opacity="0.4"
                                                d="M8.50956 2.00001H15.4897C15.7221 1.99995 15.9004 1.99991 16.0562 2.01515C17.164 2.12352 18.0708 2.78958 18.4553 3.68678H5.54395C5.92846 2.78958 6.83521 2.12352 7.94303 2.01515C8.09884 1.99991 8.27708 1.99995 8.50956 2.00001Z"
                                                fill="currentColor"></path>
                                            <path opacity="0.7"
                                                d="M6.3102 4.72266C4.91958 4.72266 3.77931 5.56241 3.39878 6.67645C3.39085 6.69967 3.38325 6.72302 3.37598 6.74647C3.77413 6.6259 4.18849 6.54713 4.60796 6.49336C5.68833 6.35485 7.05367 6.35492 8.6397 6.35501H15.5318C17.1178 6.35492 18.4832 6.35485 19.5635 6.49336C19.983 6.54713 20.3974 6.6259 20.7955 6.74647C20.7883 6.72302 20.7806 6.69967 20.7727 6.67645C20.3922 5.56241 19.2519 4.72266 17.8613 4.72266H6.3102Z"
                                                fill="currentColor"></path>
                                        </svg>
                                        {{ item.courses_count }} دوره
                                    </router-link>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div v-if="item.assignment_type == 'manual'"
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        <svg class="w-3 h-3 me-2" fill="currentColor" version="1.1"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 328.862 328.862">
                                            <path
                                                d="M281.103,30h-15V15c0-8.284-6.716-15-15-15s-15,6.716-15,15v15h-15c-8.284,0-15,6.716-15,15 c0,8.284,6.716,15,15,15h15v15c0,8.284,6.716,15,15,15s15-6.716,15-15V60h15c8.284,0,15-6.716,15-15 C296.103,36.716,289.387,30,281.103,30z">
                                            </path>
                                            <path
                                                d="M251.217,195.25L56.286,69.063c-4.609-2.984-10.48-3.21-15.308-0.591c-4.826,2.62-7.835,7.667-7.844,13.158 l-0.375,232.206c-0.01,6.371,4.006,12.054,10.016,14.172c1.633,0.576,3.315,0.854,4.981,0.854c4.464,0,8.802-1.997,11.704-5.617 l71.455-89.101l113.645-11.378c6.34-0.635,11.587-5.206,13.085-11.398C259.143,205.176,256.566,198.712,251.217,195.25z">
                                            </path>
                                        </svg>
                                        دستی
                                    </div>
                                    <div v-else
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                        <svg class="w-3 h-3 me-2" fill="currentColor" viewBox="0 0 24 24" role="img"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 6.768v.002-1.237c-.485.033-.754.293-.99.71L5.87 16.72h2.464l-.753-.96.654-1.363.005.007L12 6.774v-.006zM10.526 13.123h2.946L12 10.076M8.233 14.416h.017l-.01-.013M13.473 13.123v.002M21.496 5.066L13.26.308c-.693-.4-1.827-.4-2.52 0L2.504 5.066c-.693.398-1.26 1.38-1.26 2.182v9.507c0 .802.567 1.782 1.26 2.18l8.236 4.757c.693.4 1.826.4 2.52 0l8.235-4.768c.692-.39 1.26-1.38 1.26-2.174V7.246c0-.8-.567-1.78-1.26-2.18zm-6.066 12.05l-.687-1.384h-5.5l-.673 1.384H5.287l5.396-11.033c.305-.607.777-.9 1.317-.9s1.034.328 1.316.89l5.396 11.043H15.43zM12 6.77V9.244l2.518 5.173H8.25l.758.94h5.972l.674 1.35h2.474l-1.708-.99v.04L12 6.77">
                                            </path>
                                        </svg>
                                        خودکار
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-center">
                                    <Popover class="group relative flex items-center justify-center text-center"
                                        v-slot="{ close }">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                        <PopoverButton
                                            class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none  flex items-center justify-center">
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
                                                class="text-start flex flex-col z-30 mt-3 end-10 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-900 dark:divide-gray-800">
                                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                    <li>
                                                        <router-link
                                                            :to="{ name: 'admin-category-create', query: { parent: item.slug } }"
                                                            class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">افزودن
                                                            زیر دسته</router-link>
                                                    </li>
                                                    <li>
                                                        <button type="button"
                                                            @click="() => { deleteCategory(item.id); close(); }"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">حذف</button>
                                                    </li>
                                                    <li>
                                                        <router-link
                                                            :to="{ name: 'admin-courses-list', query: { category: item.slug } }"
                                                            class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">مشاهده
                                                            دوره‌ها</router-link>
                                                    </li>
                                                    <li>
                                                        <router-link
                                                            :to="{ name: 'admin-category-edit', params: { categorySlug: item.slug } }"
                                                            class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ویرایش</router-link>
                                                    </li>
                                                    <li>
                                                        <a href="#"
                                                            class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">جزئیات</a>
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
            <div class="flex lg:flex-row flex-col items-center justify-between gap-4">
                <div class="">
                    <PaginationComponent :pagination="pagination" @updatePage="updatePage" />
                </div>
                <div class="">
                    <Listbox v-model="perPage" v-slot="{ open }" as="div" class="w-max">
                        <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
                        <div class="relative" :class="open ? ' z-20' : ''">
                            <ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''"
                                class="w-full flex justify-between items-center px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs">
                                <div class="flex items-center">
                                    <!-- <span class="flex items-center me-2">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 8L5 16" stroke="currentColor" stroke-width="2"
                                                stroke-linejoin="round"></path>
                                            <path
                                                d="M5.20801 2.31202L8.17083 6.75624C8.52526 7.28788 8.14414 8 7.50519 8L2.49481 8C1.85586 8 1.47474 7.28788 1.82917 6.75624L4.79199 2.31202C4.89094 2.16359 5.10906 2.16359 5.20801 2.31202Z"
                                                fill="currentColor"></path>
                                            <path
                                                d="M5.20801 21.688L8.17083 17.2438C8.52526 16.7121 8.14414 16 7.50519 16L2.49481 16C1.85586 16 1.47474 16.7121 1.82917 17.2438L4.79199 21.688C4.89094 21.8364 5.10906 21.8364 5.20801 21.688Z"
                                                fill="currentColor"></path>
                                            <path d="M11 7H19" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round"></path>
                                            <path d="M11 12H19" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round"></path>
                                            <path d="M11 17H19" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round"></path>
                                        </svg>
                                    </span> -->
                                    <span class="mx-2 flex items-center line-clamp-1 font-semibold">{{
                                        perPage
                                        }}</span>
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
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import CategoryItem from "@/views/components/admin/category/CategoryItem.vue";
import { provide } from 'vue';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    components: {
        AdminMasterPage,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        LoadingComponent,
        Listbox, ListboxButton, ListboxOptions, ListboxOption,
        Popover, PopoverButton, PopoverPanel, PopoverOverlay,
        PaginationComponent,
        CategoryItem
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        const sortSlugFromUrl = urlParams.get('sort') || 'newest';
        const sort = {
            newest: {
                title: "جدیدترین",
                english_title: "newest",
                slug: "newest",
                icon: ``
            },
            oldest: {
                title: "قدیمی ترین",
                english_title: "oldest",
                slug: "oldest",
                icon: ``
            }
        };
        const selectedSort = sort[sortSlugFromUrl] || sort['newest'];
        return {
            urlParams,
            sort,
            selectedSort,
            loading: false,
            errors: null,
            searchQuery: this.$route.query.search || '',
            items: [],
            selectedIds: [],
            mounted: false,
            currentPage: this.$route.query.page ? this.$route.query.page : 1,
            pagination: {},
            perPage: 10,
            perPages: [10, 20, 30, 50, 100],
            selectedView: this.$route.query.view || 'list',
        };
    },
    computed: {
        isAllSelected() {
            return this.items.length > 0 && this.selectedIds.length === this.items.length
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.isAllSelected
        },
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
    },
    methods: {
        selectSort(sort) {
            this.selectedSort = sort;
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        selectView(view) {
            this.selectedView = view;
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        updatePage(value) {
            this.currentPage = value;
            this.updateUrlAndFetchData();
        },
        selectPerpage(value) {
            this.perPage = value;
            this.currentPage = 1;
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
        buildQuery() {
            const params = {
                page: this.currentPage,
                perPage: this.perPage,
                sort: this.selectedSort.slug,
                view: this.selectedView,
            };
            if (this.searchQuery) params.search = this.searchQuery;
            return params;
        },
        updateUrlAndFetchData() {
            const params = new URLSearchParams(window.location.search);

            params.forEach((value, key) => {
                if (!["sort", "page", "view", "search"].includes(key)) {
                    // نگه داشتن
                }
            });

            if (this.selectedSort && this.selectedSort.slug !== "newest") {
                params.set("sort", this.selectedSort.slug);
            } else {
                params.delete("sort");
            }

            if (this.selectedView && this.selectedView !== "list") {
                params.set("view", this.selectedView);
            } else {
                params.delete("view");
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
        clearFilters() {
            this.selectedSort = this.sort['newest'];
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        async fetchData() {
            this.loading = true;
            const params = this.buildQuery();
            await axiosInstance
                .post("admin/categories", params)
                .then((response) => {
                    this.items = response.data.categories;
                    this.currentPage = response.data.pagination.current_page;
                    this.pagination = response.data.pagination;
                    if (this.mounted)
                        setTimeout(() => {
                            document.getElementById('data-list').scrollIntoView({ behavior: 'smooth' });
                        }, 200)

                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.loading = false;
                    this.mounted = true;
                });
        },
        async deleteCategory(value, backToDataList = false) {
            this.loading = true;

            await axiosInstance
                .post("admin/category/delete", { id: value })
                .then(() => {
                    const idsToRemove = Array.isArray(value) ? value : [value];
                    this.items = this.items.filter(item => !idsToRemove.includes(item.id));
                    this.fetchData()

                    toast.success(`دسته‌بندی‌${idsToRemove.length > 1 ? 'ها' : ''} با موفقیت حذف شد${idsToRemove.length > 1 ? 'ند' : ''}.`, {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });

                    if (backToDataList) {
                        setTimeout(() => {
                            document.getElementById('data-list').scrollIntoView({ behavior: 'smooth' });
                        }, 100)
                    }
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.loading = false;
                    this.mounted = false;
                });
        },
        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedIds = this.items.map(item => item.id)
            } else {
                this.selectedIds = []
            }
        },
        formatFileSize(bytes, decimal = 1, lang = 'en') {
            const units = {
                fa: ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'],
                en: ['B', 'KB', 'MB', 'GB']
            };

            const selectedUnits = units[lang] || units['en'];

            if (bytes < 1024) {
                return `${bytes} ${selectedUnits[0]}`;
            }
            if (bytes < 1024 * 1024) {
                return `${(bytes / 1024).toFixed(decimal)} ${selectedUnits[1]}`;
            }
            if (bytes < 1024 * 1024 * 1024) {
                return `${(bytes / (1024 * 1024)).toFixed(decimal)} ${selectedUnits[2]}`;
            }
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(decimal)} ${selectedUnits[3]}`;
        },
    },
    created() {
        provide('deleteCategory', this.deleteCategory);
    },
    mounted() {
        document.title = "مدیریت دسته‌بندی‌ها";
        this.fetchData();
    }
};
</script>
<style scoped>
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
    margin-top: 0px;
}

.custom-checkbox:indeterminate::after,
.custom-checkbox.is-indeterminate::after {
    content: '';
    display: block;
    margin-top: 0px;
    width: 14px;
    height: 3px;
    background-color: white;
    border-radius: 3px;
}

</style>
