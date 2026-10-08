<script setup>
definePageMeta({
  name: "admin-user-activity-report",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        
        <template #breadcrumb-actions>
                    <button @click="exportActivities"
                        class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                خروجی اکسل
                                <svg class="w-4 h-4 ms-1" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
                        </span>
                    </button>
                    <button @click="refreshAll"
                        class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                به‌روزرسانی آمار
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
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 mb-4">
                <div class="text-start min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2 mb-1"><span v-if="statsPeriodLabel"
                            class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-yellow-400/15 text-yellow-700 dark:text-yellow-400 border border-yellow-400/30">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            </svg>
                            {{ statsPeriodLabel }}
                        </span>
                    </div><div v-if="stats" class="flex flex-wrap items-center gap-2 mt-2">
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ stats.total_users }} کاربر</span>
                        <span class="text-gray-300 dark:text-gray-600">•</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ stats.active_users }} فعال</span>
                        <span class="text-gray-300 dark:text-gray-600">•</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatWatchTime(stats.total_watch_time_seconds) }} تماشا</span>
                        <span v-if="activeFilterCount" class="text-gray-300 dark:text-gray-600">•</span>
                        <span v-if="activeFilterCount" class="text-xs font-medium text-amber-600 dark:text-amber-400">{{ activeFilterCount }} فیلتر فعال</span>
                    </div>
                </div>
            </div>
            <!-- Preset Filters -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-3 mb-4 shadow-sm">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">فیلترهای سریع</span>
                    <span class="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
                    <button v-for="preset in datePresets" :key="preset.slug" @click="applyPreset(preset)"
                        class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
                        :class="preset.active ? 'bg-yellow-400 text-black shadow-sm ring-1 ring-yellow-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:ring-1 hover:ring-gray-200 dark:hover:ring-gray-600'">
                        {{ preset.title }}
                    </button>
                </div>
            </div>

            <div v-if="fetchError" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {{ fetchError }}
            </div>

            <!-- Filters -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-4 mb-6 shadow-sm">
                <div class="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div class="flex items-center gap-2">
                        <div class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none">
                                <path d="M3 7H21M7 12H17M10 17H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            </svg>
                        </div>
                        <div>
                            <h6 class="text-sm font-bold text-gray-900 dark:text-white">فیلترها و جستجو</h6>
                            <p class="text-xs text-gray-500 dark:text-gray-400">کاربران را بر اساس فعالیت، نقش و وضعیت فیلتر کنید</p>
                        </div>
                    </div>
                    <button @click="showAdvancedFilters = !showAdvancedFilters"
                        class="text-xs font-semibold text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors">
                        جستجوی پیشرفته
                        <svg class="w-4 h-4 transition-transform duration-200" :class="showAdvancedFilters ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
                <div v-if="activeFilterChips.length" class="flex flex-wrap items-center gap-2 mb-4">
                    <span class="text-xs text-gray-500 dark:text-gray-400">فعال:</span>
                    <span v-for="chip in activeFilterChips" :key="chip"
                        class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
                        {{ chip }}
                    </span>
                </div>
                <div class="flex flex-wrap items-center gap-4">
                    <div class="flex-1 min-w-[200px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">از تاریخ</label>
                        <input type="date" v-model="dateFrom" @change="applyFilters"
                            class="w-full h-8 px-3 py-1.5 text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                    </div>
                    <div class="flex-1 min-w-[200px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">تا تاریخ</label>
                        <input type="date" v-model="dateTo" @change="applyFilters"
                            class="w-full h-8 px-3 py-1.5 text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                    </div>
                    <div class="flex-1 min-w-[150px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">نوع فعالیت</label>
                        <Listbox v-model="selectedActivityType" v-slot="{ open }" as="div">
                            <div class="relative">
                                <ListboxButton
                                    class="w-full h-8 px-3 py-1.5 text-start text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                                    {{ selectedActivityType.title }}
                                </ListboxButton>
                                <ListboxOptions v-if="open"
                                    class="absolute z-10 w-full mt-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    <ListboxOption v-for="type in activityTypes" :key="type.slug" :value="type"
                                        class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {{ type.title }}
                                    </ListboxOption>
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>
                    <div class="flex-1 min-w-[150px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">مرتب‌سازی</label>
                        <Listbox v-model="selectedSort" v-slot="{ open }" as="div">
                            <div class="relative">
                                <ListboxButton
                                    class="w-full h-8 px-3 py-1.5 text-start text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                                    {{ selectedSort.title }}
                                </ListboxButton>
                                <ListboxOptions v-if="open"
                                    class="absolute z-10 w-full mt-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                                    <ListboxOption v-for="sort in sortOptions" :key="sort.slug" :value="sort"
                                        class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {{ sort.title }}
                                    </ListboxOption>
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>
                    <div class="flex-1 min-w-[200px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">جستجو</label>
                        <input type="text" v-model="searchQuery" @input="handleSearch" placeholder=""
                            class="w-full h-8 px-3 py-1.5 text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                    </div>
                    <!-- Advanced Filters -->
                    <div v-if="showAdvancedFilters" class="">
                        <div class="flex flex-wrap items-center gap-4">
                            <div class="flex-1 min-w-[150px]">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">نقش کاربر</label>
                                <Listbox v-model="selectedRole" v-slot="{ open }" as="div">
                                    <div class="relative">
                                        <ListboxButton
                                            class="w-full h-8 px-3 py-1.5 text-start text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                                            {{ selectedRole.title }}
                                        </ListboxButton>
                                        <ListboxOptions v-if="open"
                                            class="absolute z-10 w-full mt-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                                            <ListboxOption v-for="role in roles" :key="role.slug" :value="role"
                                                class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                                {{ role.title }}
                                            </ListboxOption>
                                        </ListboxOptions>
                                    </div>
                                </Listbox>
                            </div>
                            <div class="flex-1 min-w-[150px]">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">وضعیت</label>
                                <Listbox v-model="selectedActiveStatus" v-slot="{ open }" as="div">
                                    <div class="relative">
                                        <ListboxButton
                                            class="w-full h-8 px-3 py-1.5 text-start text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                                            {{ selectedActiveStatus.title }}
                                        </ListboxButton>
                                        <ListboxOptions v-if="open"
                                            class="absolute z-10 w-full mt-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                                            <ListboxOption v-for="status in activeStatuses" :key="status.slug" :value="status"
                                                class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                                {{ status.title }}
                                            </ListboxOption>
                                        </ListboxOptions>
                                    </div>
                                </Listbox>
                            </div>
                            <div class="flex-1 min-w-[150px]">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">وضعیت VIP</label>
                                <Listbox v-model="selectedVipStatus" v-slot="{ open }" as="div">
                                    <div class="relative">
                                        <ListboxButton
                                            class="w-full h-8 px-3 py-1.5 text-start text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                                            {{ selectedVipStatus.title }}
                                        </ListboxButton>
                                        <ListboxOptions v-if="open"
                                            class="absolute z-10 w-full mt-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                                            <ListboxOption v-for="vip in vipStatuses" :key="vip.slug" :value="vip"
                                                class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                                {{ vip.title }}
                                            </ListboxOption>
                                        </ListboxOptions>
                                    </div>
                                </Listbox>
                            </div>
                            <div class="flex-1 min-w-[150px]">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">حداقل خرج (تومان)</label>
                                <input type="number" v-model.number="spentMin" @change="applyFilters" placeholder=""
                                    class="w-full h-8 px-3 py-1.5 text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                            </div>
                            <div class="flex-1 min-w-[150px]">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">حداکثر خرج (تومان)</label>
                                <input type="number" v-model.number="spentMax" @change="applyFilters" placeholder=""
                                    class="w-full h-8 px-3 py-1.5 text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                            </div>
                            <div class="flex-1 min-w-[200px]">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">از تاریخ عضویت</label>
                                <input type="date" v-model="registrationDateFrom" @change="applyFilters"
                                    class="w-full h-8 px-3 py-1.5 text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                            </div>
                            <div class="flex-1 min-w-[200px]">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">تا تاریخ عضویت</label>
                                <input type="date" v-model="registrationDateTo" @change="applyFilters"
                                    class="w-full h-8 px-3 py-1.5 text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                            </div>
                            <div class="flex-1 min-w-[150px]">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">غیرفعال از (روز)</label>
                                <input type="number" v-model.number="inactiveDays" @change="applyFilters" placeholder=""
                                    class="w-full h-8 px-3 py-1.5 text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5">
                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"></label>
                    <button @click="clearFilters"
                        class="flex items-center gap-1 px-4 py-1.5 h-8 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-opacity-80 focus:outline-none focus:ring-0">
                        پاک کردن فیلترها
                        <svg class="w-4 h-4 -mt-0.5" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                            <path
                                d="M8.43296491,7.17429118 L9.40782327,7.85689436 C9.49616631,7.91875282 9.56214077,8.00751728 9.5959027,8.10994332 C9.68235021,8.37220548 9.53982427,8.65489052 9.27756211,8.74133803 L5.89079566,9.85769242 C5.84469033,9.87288977 5.79661753,9.8812917 5.74809064,9.88263369 C5.4720538,9.8902674 5.24209339,9.67268366 5.23445968,9.39664682 L5.13610134,5.83998177 C5.13313425,5.73269078 5.16477113,5.62729274 5.22633424,5.53937151 C5.384723,5.31316892 5.69649589,5.25819495 5.92269848,5.4165837 L6.72910242,5.98123382 C8.16546398,4.72182424 10.0239806,4 12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 C7.581722,20 4,16.418278 4,12 L6,12 C6,15.3137085 8.6862915,18 12,18 C15.3137085,18 18,15.3137085 18,12 C18,8.6862915 15.3137085,6 12,6 C10.6885336,6 9.44767246,6.42282109 8.43296491,7.17429118 Z"
                                fill="currentColor" fill-rule="nonzero" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Main Tabs Section -->
            <div class="mb-6 p-2 md:p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
                <TabGroup>
                    <TabList
                        class="whitespace-nowrap p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-hide bg-gray-100/70 dark:bg-gray-800 rounded-xl">
                        <Tab v-for="tab in activityTabs" :key="tab.id" as="div">
                            <button @click.prevent="selectedTab = tab.id"
                                class="shrink-0 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                                :class="tabButtonClass(tab.id)">
                                {{ tab.label }}
                            </button>
                        </Tab>
                    </TabList>
                    <TabPanels class="mt-4">
                        <!-- Stats Tab -->
                        <TabPanel v-if="selectedTab === 'stats'">
                            <div v-if="stats">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <AdminReportStatCard title="کل کاربران" :value="stats.total_users"
                                        :subtitle="`${stats.active_users} کاربر فعال در این بازه`" accent="blue" value-dir="ltr">
                                        <template #icon>
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" />
                                                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" stroke-width="2" />
                                            </svg>
                                        </template>
                                    </AdminReportStatCard>
                                    <AdminReportStatCard title="کاربران فعال" :value="stats.active_users"
                                        :subtitle="activeUserRate + '% از کل کاربران'" accent="emerald" value-dir="ltr"
                                        :trend="stats.comparison ? stats.comparison.active_users : null">
                                        <template #icon>
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                            </svg>
                                        </template>
                                    </AdminReportStatCard>
                                    <AdminReportStatCard title="میانگین فعالیت" :value="stats.average_activities_per_user"
                                        subtitle="میانگین تعامل به ازای هر کاربر" accent="violet" value-dir="ltr">
                                        <template #icon>
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 19H20M7 16V10M12 16V6M17 16V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                            </svg>
                                        </template>
                                    </AdminReportStatCard>
                                    <AdminReportStatCard title="کل درآمد" :value="formatCurrency(stats.total_revenue)"
                                        :subtitle="`${totalActivityCount} تعامل ثبت‌شده`" accent="amber" value-dir="ltr"
                                        :trend="stats.comparison ? stats.comparison.revenue : null">
                                        <template #icon>
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 3V21M17 5H9.5C8.11929 5 7 6.11929 7 7.5S8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5S15.8807 15 14.5 15H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                            </svg>
                                        </template>
                                    </AdminReportStatCard>
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                                    <div class="lg:col-span-2 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4 md:p-5 shadow-sm">
                                        <div class="flex items-center justify-between gap-3 mb-4">
                                            <div>
                                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">جزئیات فعالیت‌ها</h3>
                                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">توزیع انواع تعامل کاربران</p>
                                            </div>
                                            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">{{ totalActivityCount }} کل</span>
                                        </div>
                                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            <AdminReportActivityMetric v-for="item in activityBreakdownItems" :key="item.key"
                                                :label="item.label"
                                                :value="stats.total_activities[item.key]"
                                                :percent="getActivityPercent(item.key)"
                                                :color="activityMetricColor(item.key)" />
                                        </div>
                                    </div>
                                    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-3 shadow-sm">
                                        <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400">کل زمان تماشا</p>
                                        <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ formatWatchTime(stats.total_watch_time_seconds) }}</p>
                                        <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">مجموع زمان مشاهده ویدیوها در این بازه</p>
                                        <div class="mt-4 pt-4 border-t border-gray-200/70 dark:border-gray-700/70 space-y-2">
                                            <div class="flex items-center justify-between text-xs">
                                                <span class="text-gray-500 dark:text-gray-400">تماشا</span>
                                                <span class="font-semibold text-gray-900 dark:text-white">{{ stats.total_activities.video_views }}</span>
                                            </div>
                                            <div class="flex items-center justify-between text-xs">
                                                <span class="text-gray-500 dark:text-gray-400">میانگین به ازای کاربر</span>
                                                <span class="font-semibold text-gray-900 dark:text-white">{{ averageWatchPerUser }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <AdminReportChartCard v-if="stats.comparison" class="mt-6" title="مقایسه با دوره قبل"
                                    subtitle="تغییرات نسبت به بازه زمانی معادل قبل از دوره انتخاب‌شده">
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        <AdminReportComparisonCard label="کاربران فعال"
                                            :current="stats.comparison.active_users.current"
                                            :previous="stats.comparison.active_users.previous"
                                            :change="stats.comparison.active_users.change"
                                            :change-percent="stats.comparison.active_users.change_percent" />
                                        <AdminReportComparisonCard label="تماشا"
                                            :current="stats.comparison.video_views.current"
                                            :previous="stats.comparison.video_views.previous"
                                            :change="stats.comparison.video_views.change"
                                            :change-percent="stats.comparison.video_views.change_percent" />
                                        <AdminReportComparisonCard label="کامنت"
                                            :current="stats.comparison.comments.current"
                                            :previous="stats.comparison.comments.previous"
                                            :change="stats.comparison.comments.change"
                                            :change-percent="stats.comparison.comments.change_percent" />
                                        <AdminReportComparisonCard label="درآمد"
                                            :current="formatCurrency(stats.comparison.revenue.current)"
                                            :previous="formatCurrency(stats.comparison.revenue.previous)"
                                            :change="stats.comparison.revenue.change"
                                            :change-percent="stats.comparison.revenue.change_percent" />
                                    </div>
                                </AdminReportChartCard>

                                <div class="mt-6 space-y-4">
                                    <AdminReportChartCard v-if="stats.daily_activity && stats.daily_activity.length > 0"
                                        title="فعالیت روزانه" subtitle="لاگین، تماشا و کامنت در کنار هم"
                                        :badge="stats.daily_activity.length + ' روز'">
                                        <ComparisonLineChart class="h-72"
                                            :labels="activityDailyChart.labels"
                                            :datasets="activityDailyChart.datasets" />
                                    </AdminReportChartCard>

                                    <div v-if="stats.ratios" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                        <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-center">
                                            <p class="text-[11px] text-gray-500">کامنت / تماشا</p>
                                            <p class="text-sm font-semibold text-cyan-600 font-anjoman">{{ stats.ratios.comments_per_view }}</p>
                                        </div>
                                        <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-center">
                                            <p class="text-[11px] text-gray-500">تماشا / کاربر فعال</p>
                                            <p class="text-sm font-semibold text-emerald-600 font-anjoman">{{ stats.ratios.views_per_active_user }}</p>
                                        </div>
                                        <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-center">
                                            <p class="text-[11px] text-gray-500">لاگین / کاربر فعال</p>
                                            <p class="text-sm font-semibold text-blue-600 font-anjoman">{{ stats.ratios.logins_per_active_user }}</p>
                                        </div>
                                        <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-center">
                                            <p class="text-[11px] text-gray-500">تعامل / تماشا</p>
                                            <p class="text-sm font-semibold text-violet-600 font-anjoman">{{ stats.ratios.interactions_per_view }}</p>
                                        </div>
                                        <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-center">
                                            <p class="text-[11px] text-gray-500">نرخ کاربر فعال</p>
                                            <p class="text-sm font-semibold text-amber-600 font-anjoman">{{ stats.ratios.active_user_rate }}٪</p>
                                        </div>
                                        <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-center">
                                            <p class="text-[11px] text-gray-500">نرخ خرید</p>
                                            <p class="text-sm font-semibold text-rose-600 font-anjoman">{{ stats.ratios.payment_rate }}٪</p>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <AdminReportChartCard v-if="stats.activity_distribution" title="توزیع فعالیت‌ها"
                                            subtitle="سهم هر نوع تعامل از کل فعالیت‌ها">
                                            <DoughnutChart class="h-72 mx-auto" :rawData="stats.activity_distribution" :legendPosition="'bottom'" />
                                        </AdminReportChartCard>
                                        <AdminReportChartCard v-if="stats.status_distribution" title="وضعیت کاربران"
                                            subtitle="کاربران فعال در مقابل غیرفعال">
                                            <DoughnutChart class="h-72 mx-auto" :rawData="stats.status_distribution" :legendPosition="'bottom'" />
                                        </AdminReportChartCard>
                                        <AdminReportChartCard v-if="stats.vip_distribution" title="توزیع VIP"
                                            subtitle="کاربران VIP در مقابل عادی">
                                            <DoughnutChart class="h-72 mx-auto" :rawData="stats.vip_distribution" :legendPosition="'bottom'" />
                                        </AdminReportChartCard>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="flex flex-col items-center justify-center py-16 text-center">
                                <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 animate-pulse">
                                    <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" />
                                    </svg>
                                </div>
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">در حال بارگذاری آمار...</p>
                            </div>
                        </TabPanel>

                        <!-- Compare Tab -->
                        <TabPanel v-if="selectedTab === 'compare'">
                            <div v-if="stats?.comparison" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                                    <AdminReportComparisonCard label="کاربران فعال"
                                        :current="stats.comparison.active_users.current"
                                        :previous="stats.comparison.active_users.previous"
                                        :change="stats.comparison.active_users.change"
                                        :change-percent="stats.comparison.active_users.change_percent" />
                                    <AdminReportComparisonCard label="لاگین"
                                        :current="stats.comparison.logins?.current || 0"
                                        :previous="stats.comparison.logins?.previous || 0"
                                        :change="stats.comparison.logins?.change || 0"
                                        :change-percent="stats.comparison.logins?.change_percent || 0" />
                                    <AdminReportComparisonCard label="تماشا"
                                        :current="stats.comparison.video_views.current"
                                        :previous="stats.comparison.video_views.previous"
                                        :change="stats.comparison.video_views.change"
                                        :change-percent="stats.comparison.video_views.change_percent" />
                                    <AdminReportComparisonCard label="کامنت"
                                        :current="stats.comparison.comments.current"
                                        :previous="stats.comparison.comments.previous"
                                        :change="stats.comparison.comments.change"
                                        :change-percent="stats.comparison.comments.change_percent" />
                                    <AdminReportComparisonCard label="تعامل"
                                        :current="stats.comparison.interactions?.current || 0"
                                        :previous="stats.comparison.interactions?.previous || 0"
                                        :change="stats.comparison.interactions?.change || 0"
                                        :change-percent="stats.comparison.interactions?.change_percent || 0" />
                                    <AdminReportComparisonCard label="درآمد"
                                        :current="formatCurrency(stats.comparison.revenue.current)"
                                        :previous="formatCurrency(stats.comparison.revenue.previous)"
                                        :change="stats.comparison.revenue.change"
                                        :change-percent="stats.comparison.revenue.change_percent" />
                                </div>
                                <AdminReportChartCard title="روند روزانه — مقایسه‌ای">
                                    <template #actions>
                                        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-0.5">
                                            <button v-for="m in [{id:'total',label:'کل'},{id:'logins',label:'لاگین'},{id:'views',label:'تماشا'},{id:'comments',label:'کامنت'}]" :key="m.id"
                                                class="px-2.5 py-1 text-xs font-semibold rounded-full"
                                                :class="activityChartMode === m.id ? 'bg-white dark:bg-gray-900 shadow-sm' : ''"
                                                @click="activityChartMode = m.id">{{ m.label }}</button>
                                        </div>
                                    </template>
                                    <ComparisonLineChart v-if="activityDailyComparisonChart.labels.length" class="h-72"
                                        :labels="activityDailyComparisonChart.labels"
                                        :datasets="activityDailyComparisonChart.datasets" />
                                </AdminReportChartCard>
                            </div>
                            <p v-else class="py-16 text-center text-sm text-gray-500">در حال بارگذاری...</p>
                        </TabPanel>

                        <!-- Insights Tab -->
                        <TabPanel v-if="selectedTab === 'insights'">
                            <div v-if="stats" class="space-y-6">
                                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                    <div v-for="item in activityInsightCards" :key="item.label" class="px-2.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80">
                                        <p class="text-[11px] text-gray-500 mb-0.5">{{ item.label }}</p>
                                        <p class="text-sm font-semibold text-gray-900 dark:text-white font-anjoman">{{ item.value }}</p>
                                        <p v-if="item.sub" class="text-[11px] text-gray-400 mt-0.5">{{ item.sub }}</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <AdminReportChartCard title="کاربران یکتا — روند روزانه">
                                        <AreaChart class="h-64" :rawData="dailyUniqueChart" :showLegend="false" lineColor="rgba(59,130,246,1)" fillColor="rgba(59,130,246,0.15)" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard title="فعالیت ساعتی">
                                        <AdminBarChart v-if="activityHourlyChart.labels.length" class="h-64"
                                            :rawData="activityHourlyChart" barColor="rgba(59,130,246,0.85)" />
                                    </AdminReportChartCard>
                                </div>
                                <AdminReportChartCard v-if="activityMonthlyChart.labels.length" title="روند ماهانه (لاگین)">
                                    <AdminBarChart class="h-64" :rawData="activityMonthlyChart" barColor="rgba(139,92,246,0.85)" />
                                </AdminReportChartCard>
                            </div>
                            <p v-else class="py-16 text-center text-sm text-gray-500">در حال بارگذاری...</p>
                        </TabPanel>

                        <!-- Heatmap Tab -->
                        <TabPanel v-if="selectedTab === 'heatmap'">
                            <div v-if="stats?.heatmap?.cells?.length" class="space-y-4">
                                <AdminReportChartCard title="نقشه حرارتی فعالیت" subtitle="لاگین + کامنت — روز هفته × ساعت">
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <div class="min-w-[640px]">
                                            <div class="grid grid-cols-[72px_repeat(24,minmax(0,1fr))] gap-0.5 text-[10px]">
                                                <div></div>
                                                <div v-for="h in 24" :key="'h'+h" class="text-center text-gray-400 pb-1">{{ String(h - 1).padStart(2,'0') }}</div>
                                                <template v-for="day in 7" :key="'d'+day">
                                                    <div class="text-gray-500 text-xs flex items-center">{{ weekdayLabels[day - 1] }}</div>
                                                    <div v-for="hour in 24" :key="day+'-'+hour"
                                                        class="aspect-square rounded-sm flex items-center justify-center font-anjoman"
                                                        :style="activityHeatmapStyle(day, hour - 1)"
                                                        :title="activityHeatmapTitle(day, hour - 1)">
                                                        <span v-if="activityHeatmapCount(day, hour - 1) > 0" class="text-[9px] font-bold">{{ activityHeatmapCount(day, hour - 1) }}</span>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </AdminReportChartCard>
                            </div>
                            <p v-else class="py-16 text-center text-sm text-gray-500">داده‌ای برای heatmap نیست</p>
                        </TabPanel>


                        <!-- Users Tab -->
                        <TabPanel v-if="selectedTab === 'users'">
                            <div class="overflow-x-auto md:custom-scrollbar">
                                <table
                                    class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">لاگین</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تماشا</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">کامنت</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">سوال</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">جواب</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">لایک</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">پرداخت</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">مجموع پرداختی</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">زمان تماشا</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">دوره‌ها</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">آخرین فعالیت</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(item, i) in items" :key="i"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div
                                                        class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="item.profile_pic || defaultAvatar"
                                                            :alt="item.first_name + ' ' + item.last_name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <div class="flex items-center gap-2">
                                                            <a :href="`/admin/user/@${item.username}/details`" target="_blank"
                                                                class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">
                                                                {{ item.first_name }} {{ item.last_name }}
                                                            </a>
                                                            <span v-if="item.has_vip"
                                                                class="px-1.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-lg">VIP</span>
                                                            <span v-if="!item.active"
                                                                class="px-1.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg">غیرفعال</span>
                                                        </div>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.email }}</div>
                                                        <div class="text-xs text-gray-400">{{ item.role || 'کاربر' }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ item.activities.logins }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ item.activities.video_views }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ item.activities.comments }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ item.activities.questions }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ item.activities.answers }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ item.activities.likes }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ item.activities.payments }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ formatCurrency(item.total_spent) }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ formatWatchTime(item.total_watch_time_seconds) }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">
                                                    <div>خریداری: {{ item.purchased_courses || 0 }}</div>
                                                    <div class="text-gray-500">تکمیل: {{ item.completed_courses || 0 }}</div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div v-if="item.last_activity_date" class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">
                                                    <div>{{ formatDate(item.last_activity_date) }}</div>
                                                    <div class="text-gray-500">{{ getActivityTypeName(item.last_activity_type) }}</div>
                                                </div>
                                                <div v-else class="text-xs text-gray-400">-</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-center">
                                                <div class="flex items-center justify-center gap-2">
                                                    <a :href="`/admin/user/@${item.username}/details`" target="_blank"
                                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/50 px-3 py-1 rounded-lg">پروفایل</a>
                                                    <button @click="viewUserDetails(item)"
                                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/50 px-3 py-1 rounded-lg">جزئیات</button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="items.length === 0 && !loading">
                                            <td colspan="14" class="py-14 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                کاربری یافت نشد
                                            </td>
                                        </tr>
                                        <tr class="h-16"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="items.length > 0 || loading" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 -mt-12 pt-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">نمایش</span>
                                    <select :value="perPage" @change="selectPerpage($event)"
                                        class="h-8 px-3 text-xs font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-yellow-400/40">
                                        <option v-for="per in perPages" :key="per" :value="per">{{ per }} در صفحه</option>
                                    </select>
                                </div>
                                <PaginationComponent v-if="pagination && pagination.last_page > 1"
                                    :pagination="pagination" @updatePage="updatePage" />
                            </div>
                        </TabPanel>

                        <!-- Most Active Users Tab -->
                        <TabPanel v-if="selectedTab === 'most_active'">
                            <div v-if="analytics && analytics.most_active_users && analytics.most_active_users.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                            <tr class="text-xs font-semibold text-start">
                                                <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                                <th class="px-1 py-3 whitespace-nowrap text-start">کل فعالیت</th>
                                                <th class="px-1 py-3 whitespace-nowrap text-start">لاگین</th>
                                                <th class="px-1 py-3 whitespace-nowrap text-start">تماشا</th>
                                                <th class="px-1 py-3 whitespace-nowrap text-start">کامنت</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                            <tr v-for="(user, idx) in analytics.most_active_users" :key="idx"
                                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                                <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                    <div class="flex items-center">
                                                        <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                            <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                                @error="handleImageError($event, 'avatar')"
                                                                class="w-full h-full object-cover">
                                                        </div>
                                                        <div class="ms-2">
                                                            <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                                class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                            <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                                    <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.total_activities }}</div>
                                                </td>
                                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                                    <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.logins }}</div>
                                                </td>
                                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                                    <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.views }}</div>
                                                </td>
                                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                                    <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.comments }}</div>
                                                </td>
                                            </tr>
                                            <tr class="h-12"></tr>
                                        </tbody>
                                    </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Top Viewers Tab -->
                        <TabPanel v-if="selectedTab === 'viewers'">
                            <div v-if="analytics && analytics.top_viewers && analytics.top_viewers.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد تماشا</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.top_viewers" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.view_count }}</div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Top Commenters Tab -->
                        <TabPanel v-if="selectedTab === 'commenters'">
                            <div v-if="analytics && analytics.top_commenters && analytics.top_commenters.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد کامنت</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.top_commenters" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.comment_count }}</div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Top Questioners Tab -->
                        <TabPanel v-if="selectedTab === 'questioners'">
                            <div v-if="analytics && analytics.top_questioners && analytics.top_questioners.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد سوال</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.top_questioners" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.question_count }}</div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Top Answerers Tab -->
                        <TabPanel v-if="selectedTab === 'answerers'">
                            <div v-if="analytics && analytics.top_answerers && analytics.top_answerers.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد جواب</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.top_answerers" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.answer_count }}</div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- New Users Tab -->
                        <TabPanel v-if="selectedTab === 'new_users'">
                            <div v-if="analytics && analytics.new_users && analytics.new_users.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ عضویت</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.new_users" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ formatDate(user.created_at) }}</div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Inactive Users Tab -->
                        <TabPanel v-if="selectedTab === 'inactive'">
                            <div v-if="analytics && analytics.inactive_users && analytics.inactive_users.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">آخرین بازدید</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.inactive_users" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">
                                                    {{ user.last_seen ? formatDate(user.last_seen) : 'هرگز' }}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- VIP Users Tab -->
                        <TabPanel v-if="selectedTab === 'vip'">
                            <div v-if="analytics && analytics.vip_users && analytics.vip_users.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">پلن</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ انقضا</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.vip_users" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max">
                                                    {{ user.plan ? user.plan.title : 'نامشخص' }}
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">
                                                    {{ user.plan ? formatDate(user.plan.expired_at) : '-' }}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Top Watch Time Tab -->
                        <TabPanel v-if="selectedTab === 'watch_time'">
                            <div v-if="analytics && analytics.top_watch_time_users && analytics.top_watch_time_users.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">زمان تماشا</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد تماشا</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.top_watch_time_users" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max">
                                                    {{ formatWatchTime(user.watch_time_seconds) }}
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.view_count }}</div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Top Certificates Tab -->
                        <TabPanel v-if="selectedTab === 'certificates'">
                            <div v-if="analytics && analytics.top_certificate_holders && analytics.top_certificate_holders.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد گواهینامه</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.top_certificate_holders" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.certificate_count }}</div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Top Raters Tab -->
                        <TabPanel v-if="selectedTab === 'ratings'">
                            <div v-if="analytics && analytics.top_raters && analytics.top_raters.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد امتیاز</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.top_raters" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.rating_count }}</div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Most Interactive Tab -->
                        <TabPanel v-if="selectedTab === 'interactive'">
                            <div v-if="analytics && analytics.most_interactive_users && analytics.most_interactive_users.length > 0" class="overflow-x-auto md:custom-scrollbar">
                                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">کل تعامل</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">لایک</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">کامنت</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">سوال</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">جواب</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.most_interactive_users" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <a :href="`/admin/user/@${user.username}/details`" target="_blank"
                                                            class="text-xs font-semibold text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">{{ user.name }}</a>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.total_interactions }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.likes }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.comments }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.questions }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max" dir="ltr">{{ user.answers }}</div>
                                            </td>
                                        </tr>
                                        <tr class="h-12"></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Analytics Tab -->
                        <TabPanel v-if="selectedTab === 'analytics'">
                            <div v-if="analytics" class="space-y-4">
                                <!-- Activity by Hour Chart -->
                                <div class="p-4 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl">
                                    <h3 class="text-sm font-semibold mb-4 text-gray-900 dark:text-white">فعالیت بر اساس ساعت روز</h3>
                                    <AreaChart
                                        v-if="analytics.activity_by_hour && analytics.activity_by_hour.length > 0"
                                        class="h-72 mx-auto"
                                        :rawData="{
                                            labels: analytics.activity_by_hour.map(h => h.hour + ':00'),
                                            data: analytics.activity_by_hour.map(h => h.total)
                                        }"
                                        :chartTitle="'فعالیت ساعتی'"
                                        :showLegend="false"
                                        :lineColor="'rgba(59, 130, 246, 1)'"
                                        :fillColor="'rgba(59, 130, 246, 0.25)'"
                                    />
                                    <div v-else class="text-sm text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</div>
                                </div>

                                <!-- Activity by Day Chart -->
                                <div class="p-4 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl">
                                    <h3 class="text-sm font-semibold mb-4 text-gray-900 dark:text-white">فعالیت بر اساس روز هفته</h3>
                                    <AreaChart
                                        v-if="analytics.activity_by_day && analytics.activity_by_day.length > 0"
                                        class="h-72 mx-auto"
                                        :rawData="{
                                            labels: analytics.activity_by_day.map(d => d.day),
                                            data: analytics.activity_by_day.map(d => d.total)
                                        }"
                                        :chartTitle="'فعالیت هفتگی'"
                                        :showLegend="false"
                                        :lineColor="'rgba(16, 185, 129, 1)'"
                                        :fillColor="'rgba(16, 185, 129, 0.25)'"
                                    />
                                    <div v-else class="text-sm text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</div>
                                </div>

                                <!-- Activity by Hour Grid -->
                                <div class="p-4 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl">
                                    <h3 class="text-sm font-semibold mb-4 text-gray-900 dark:text-white">جزئیات فعالیت ساعتی</h3>
                                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                        <div v-for="hour in analytics.activity_by_hour" :key="hour.hour"
                                            class="p-2 bg-white/60 dark:bg-gray-900/40 rounded-xl text-center">
                                            <div class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ hour.hour }}:00</div>
                                            <div class="text-sm font-semibold text-gray-900 dark:text-white mt-1">{{ hour.total }}</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                <div>لاگین: {{ hour.logins }}</div>
                                                <div>کامنت: {{ hour.comments }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Activity by Day Grid -->
                                <div class="p-4 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl">
                                    <h3 class="text-sm font-semibold mb-4 text-gray-900 dark:text-white">جزئیات فعالیت هفتگی</h3>
                                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                                        <div v-for="day in analytics.activity_by_day" :key="day.day_number"
                                            class="p-3 bg-white/60 dark:bg-gray-900/40 rounded-xl text-center">
                                            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ day.day }}</div>
                                            <div class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{{ day.total }}</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                <div>لاگین: {{ day.logins }}</div>
                                                <div>کامنت: {{ day.comments }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-sm font-semibold text-center py-8 text-gray-500 dark:text-gray-400">
                                در حال بارگذاری آنالیتیکس...
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>

            <BottomSheetDrawer v-model="showDetailsModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[48rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">جزئیات فعالیت کاربر</h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeDetailsModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div v-if="selectedUser" class="text-right">
                                        <div class="space-y-4">
                                            <div>
                                                <h4 class="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">اطلاعات کاربر</h4>
                                                <div class="rounded-xl bg-gray-100/80 dark:bg-gray-800/80 p-4 space-y-2 text-sm">
                                                    <div class="flex items-center gap-3">
                                                        <div class="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                            <img :src="selectedUser.profile_pic || defaultAvatar"
                                                                :alt="selectedUser.first_name + ' ' + selectedUser.last_name"
                                                                @error="handleImageError($event, 'avatar')"
                                                                class="w-full h-full object-cover">
                                                        </div>
                                                        <div>
                                                            <div><span class="font-medium">نام:</span> {{ selectedUser.first_name }} {{ selectedUser.last_name }}</div>
                                                            <div><span class="font-medium">ایمیل:</span> {{ selectedUser.email }}</div>
                                                            <div v-if="selectedUser.username"><span class="font-medium">نام کاربری:</span> {{ selectedUser.username }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 class="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">اطلاعات تکمیلی</h4>
                                                <div class="rounded-xl bg-gray-100/80 dark:bg-gray-800/80 p-4 space-y-2 text-sm">
                                                    <div><span class="font-medium">نقش:</span> {{ selectedUser.role || 'کاربر' }}</div>
                                                    <div><span class="font-medium">وضعیت:</span> 
                                                        <span :class="selectedUser.active ? 'text-green-600' : 'text-red-600'">
                                                            {{ selectedUser.active ? 'فعال' : 'غیرفعال' }}
                                                        </span>
                                                    </div>
                                                    <div><span class="font-medium">VIP:</span> 
                                                        <span :class="selectedUser.has_vip ? 'text-yellow-600 font-semibold' : 'text-gray-500'">
                                                            {{ selectedUser.has_vip ? 'بله' : 'خیر' }}
                                                        </span>
                                                    </div>
                                                    <div><span class="font-medium">دوره‌های خریداری شده:</span> {{ selectedUser.purchased_courses || 0 }}</div>
                                                    <div><span class="font-medium">دوره‌های تکمیل شده:</span> {{ selectedUser.completed_courses || 0 }}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 class="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">فعالیت‌ها</h4>
                                                <div class="rounded-xl bg-gray-100/80 dark:bg-gray-800/80 p-4 grid grid-cols-2 gap-2 text-sm">
                                                    <div><span class="font-medium">لاگین:</span> {{ selectedUser.activities.logins }}</div>
                                                    <div><span class="font-medium">تماشا:</span> {{ selectedUser.activities.video_views }}</div>
                                                    <div><span class="font-medium">کامنت:</span> {{ selectedUser.activities.comments }}</div>
                                                    <div><span class="font-medium">سوال:</span> {{ selectedUser.activities.questions }}</div>
                                                    <div><span class="font-medium">جواب:</span> {{ selectedUser.activities.answers }}</div>
                                                    <div><span class="font-medium">لایک:</span> {{ selectedUser.activities.likes }}</div>
                                                    <div><span class="font-medium">پرداخت:</span> {{ selectedUser.activities.payments }}</div>
                                                    <div><span class="font-medium">امتیاز:</span> {{ selectedUser.activities.ratings }}</div>
                                                    <div><span class="font-medium">گواهینامه:</span> {{ selectedUser.activities.certificates }}</div>
                                                    <div><span class="font-medium">کل تعامل:</span> {{ selectedUser.activities.total_interactions || 0 }}</div>
                                                </div>
                                            </div>
                                            <div v-if="selectedUser.last_login_details">
                                                <h4 class="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">آخرین لاگین</h4>
                                                <div class="rounded-xl bg-gray-100/80 dark:bg-gray-800/80 p-4 space-y-2 text-sm">
                                                    <div><span class="font-medium">تاریخ:</span> {{ formatDate(selectedUser.last_login_details.logged_in_at) }}</div>
                                                    <div><span class="font-medium">IP:</span> {{ selectedUser.last_login_details.ip_address || 'نامشخص' }}</div>
                                                    <div><span class="font-medium">دستگاه:</span> {{ selectedUser.last_login_details.device || 'نامشخص' }}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 class="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">اطلاعات مالی</h4>
                                                <div class="rounded-xl bg-gray-100/80 dark:bg-gray-800/80 p-4 space-y-2 text-sm">
                                                    <div><span class="font-medium">مجموع پرداختی:</span> {{ formatCurrency(selectedUser.total_spent) }}</div>
                                                    <div><span class="font-medium">زمان تماشا:</span> {{ formatWatchTime(selectedUser.total_watch_time_seconds) }}</div>
                                                </div>
                                            </div>
                                            <div v-if="selectedUser.last_activity_date">
                                                <h4 class="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">آخرین فعالیت</h4>
                                                <div class="rounded-xl bg-gray-100/80 dark:bg-gray-800/80 p-4 text-sm">
                                                    <div><span class="font-medium">نوع:</span> {{ getActivityTypeName(selectedUser.last_activity_type) }}</div>
                                                    <div><span class="font-medium">تاریخ:</span> {{ formatDate(selectedUser.last_activity_date) }}</div>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                <a :href="`/admin/user/@${selectedUser.username}/details`" target="_blank"
                                                    class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/50 px-3 py-1 rounded-lg">
                                                    مشاهده پروفایل کامل
                                                </a>
                                                <button @click="closeDetailsModal"
                                                    class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/50 px-3 py-1 rounded-lg">
                                                    بستن
                                                </button>
                                            </div>
                                        </div>
                </div>
            </BottomSheetDrawer>

            <LoadingComponent v-if="loading" />
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import AreaChart from "@/views/components/chart/AreaChart.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminReportChartCard from "@/views/components/admin/report/AdminReportChartCard.vue";
import AdminReportComparisonCard from "@/views/components/admin/report/AdminReportComparisonCard.vue";
import AdminReportActivityMetric from "@/views/components/admin/report/AdminReportActivityMetric.vue";
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
// import ComparisonBarChart from "@/views/components/chart/ComparisonBarChart.vue";
import AdminBarChart from "@/views/components/chart/AdminBarChart.vue";
import axiosInstance from "@/store/axiosInstance";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import debounce from "lodash/debounce";

function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        PaginationComponent,
        AreaChart,
        DoughnutChart,
        Listbox, ListboxButton, ListboxOptions, ListboxOption,
        BottomSheetDrawer,
        TabGroup, TabList, Tab, TabPanels, TabPanel,
        AdminReportStatCard,
        AdminReportChartCard,
        AdminReportComparisonCard,
        AdminReportActivityMetric,
        ComparisonLineChart,
        // ComparisonBarChart,
        AdminBarChart,
    },
    computed: {
        statsPeriodLabel() {
            if (this.dateFrom && this.dateTo) return `${this.dateFrom} تا ${this.dateTo}`;
            if (this.dateFrom) return `از ${this.dateFrom}`;
            if (this.dateTo) return `تا ${this.dateTo}`;
            return '';
        },
        activeFilterChips() {
            const chips = [];
            if (this.selectedActivityType.slug !== 'all') chips.push(`نوع: ${this.selectedActivityType.title}`);
            if (this.selectedRole.slug !== 'all') chips.push(`نقش: ${this.selectedRole.title}`);
            if (this.selectedActiveStatus.slug !== 'all') chips.push(`وضعیت: ${this.selectedActiveStatus.title}`);
            if (this.selectedVipStatus.slug !== 'all') chips.push(`VIP: ${this.selectedVipStatus.title}`);
            if (this.searchQuery) chips.push(`جستجو: ${this.searchQuery}`);
            if (this.spentMin) chips.push(`حداقل خرج: ${this.formatCurrency(this.spentMin)}`);
            if (this.spentMax) chips.push(`حداکثر خرج: ${this.formatCurrency(this.spentMax)}`);
            if (this.registrationDateFrom) chips.push(`عضویت از: ${this.registrationDateFrom}`);
            if (this.registrationDateTo) chips.push(`عضویت تا: ${this.registrationDateTo}`);
            if (this.inactiveDays) chips.push(`غیرفعال ${this.inactiveDays} روز`);
            return chips;
        },
        activeFilterCount() {
            return this.activeFilterChips.length;
        },
        totalActivityCount() {
            if (!this.stats?.total_activities) return 0;
            return Object.values(this.stats.total_activities).reduce((sum, val) => sum + (val || 0), 0);
        },
        activeUserRate() {
            if (!this.stats?.total_users) return 0;
            return Math.round((this.stats.active_users / this.stats.total_users) * 100);
        },
        averageWatchPerUser() {
            if (!this.stats?.total_users || !this.stats?.total_watch_time_seconds) return '0 ثانیه';
            return this.formatWatchTime(Math.round(this.stats.total_watch_time_seconds / this.stats.total_users));
        },
        activityDailyChart() {
            const rows = this.stats?.daily_activity || [];
            return {
                labels: rows.map(r => r.date),
                datasets: [
                    { label: 'لاگین', data: rows.map(r => r.logins), lineColor: 'rgba(59,130,246,1)', fillColor: 'rgba(59,130,246,0.12)' },
                    { label: 'تماشا', data: rows.map(r => r.views), lineColor: 'rgba(16,185,129,1)', fillColor: 'rgba(16,185,129,0.1)', fill: false },
                    { label: 'کامنت', data: rows.map(r => r.comments), lineColor: 'rgba(139,92,246,1)', fillColor: 'rgba(139,92,246,0.1)', fill: false },
                ],
            };
        },
        activityDailyComparisonChart() {
            const dc = this.stats?.daily_comparison;
            if (!dc) return { labels: [], datasets: [] };
            const mode = this.activityChartMode;
            const currentKey = mode === 'logins' ? 'current_logins' : mode === 'views' ? 'current_views' : mode === 'comments' ? 'current_comments' : 'current_total';
            const previousKey = mode === 'logins' ? 'previous_logins' : mode === 'views' ? 'previous_views' : mode === 'comments' ? 'previous_comments' : 'previous_total';
            return {
                labels: dc.labels || [],
                datasets: [
                    { label: 'دوره فعلی', data: dc[currentKey] || [], lineColor: 'rgba(59,130,246,1)', fillColor: 'rgba(59,130,246,0.15)' },
                    { label: 'دوره قبل', data: dc[previousKey] || [], lineColor: 'rgba(107,114,128,0.9)', fillColor: 'rgba(107,114,128,0.08)', fill: false },
                ],
            };
        },
        activityInsightCards() {
            const ins = this.stats?.insights;
            if (!ins) return [];
            return [
                { label: 'روز اوج', value: ins.peak_day, sub: ins.peak_day_count + ' لاگین' },
                { label: 'ساعت اوج', value: ins.peak_hour, sub: ins.peak_hour_count + ' لاگین' },
                { label: 'میانگین تماشا/کاربر فعال', value: this.formatWatchTime(ins.avg_watch_per_active_user) },
                { label: 'میانگین لاگین/کاربر فعال', value: ins.avg_logins_per_active_user },
                { label: 'کاربران امروز', value: this.stats.today?.logins || 0, sub: (this.stats.today?.new_users || 0) + ' عضو جدید' },
                { label: 'تماشای امروز', value: this.stats.today?.video_views || 0 },
            ];
        },
        dailyUniqueChart() {
            return {
                labels: (this.stats?.daily_unique_users || []).map(d => d.date),
                data: (this.stats?.daily_unique_users || []).map(d => d.count),
            };
        },
        activityHourlyChart() {
            return {
                labels: (this.stats?.hourly || []).map(h => h.label),
                data: (this.stats?.hourly || []).map(h => h.total),
            };
        },
        activityMonthlyChart() {
            return {
                labels: (this.stats?.monthly || []).map(m => m.label),
                data: (this.stats?.monthly || []).map(m => m.count),
            };
        },
        activityHeatmapMap() {
            const map = {};
            (this.stats?.heatmap?.cells || []).forEach(c => { map[`${c.weekday}-${c.hour}`] = c; });
            return map;
        },
        activityHeatmapMax() {
            return this.stats?.heatmap?.max || 1;
        },
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        
        const activityTypes = [
            { slug: 'all', title: 'همه' },
            { slug: 'active', title: 'کاربران فعال' },
            { slug: 'viewers', title: 'تماشاکنندگان' },
            { slug: 'commenters', title: 'کامنت‌دهندگان' },
            { slug: 'purchasers', title: 'خریداران' },
            { slug: 'new_users', title: 'کاربران جدید' },
            { slug: 'inactive', title: 'غیرفعال' }
        ];
        
        const sortOptions = [
            { slug: 'newest', title: 'جدیدترین' },
            { slug: 'oldest', title: 'قدیمی‌ترین' },
            { slug: 'most_active', title: 'فعال‌ترین' },
            { slug: 'most_views', title: 'بیشترین تماشا' },
            { slug: 'most_comments', title: 'بیشترین کامنت' }
        ];

        const roles = [
            { slug: 'all', title: 'همه' },
            { slug: 'admin', title: 'ادمین' },
            { slug: 'teacher', title: 'مدرس' },
            { slug: 'user', title: 'کاربر' }
        ];

        const activeStatuses = [
            { slug: 'all', title: 'همه' },
            { slug: 'active', title: 'فعال' },
            { slug: 'inactive', title: 'غیرفعال' }
        ];

        const vipStatuses = [
            { slug: 'all', title: 'همه' },
            { slug: 'vip', title: 'VIP' },
            { slug: 'non_vip', title: 'غیر VIP' }
        ];

        const datePresets = [
            { slug: 'today', title: 'امروز', days: 0 },
            { slug: 'week', title: 'این هفته', days: 7 },
            { slug: 'month', title: 'این ماه', isMonth: true },
            { slug: '30d', title: '۳۰ روز گذشته', days: 30 },
            { slug: '90d', title: '۹۰ روز گذشته', days: 90 }
        ];
        
        const selectedActivityType = activityTypes.find(t => t.slug === (urlParams.get('activity_type') || 'all')) || activityTypes[0];
        const selectedSort = sortOptions.find(s => s.slug === (urlParams.get('sort') || 'newest')) || sortOptions[0];
        const selectedRole = roles.find(r => r.slug === (urlParams.get('role') || 'all')) || roles[0];
        const selectedActiveStatus = activeStatuses.find(s => s.slug === (urlParams.get('active_status') || 'all')) || activeStatuses[0];
        const selectedVipStatus = vipStatuses.find(v => v.slug === (urlParams.get('vip_status') || 'all')) || vipStatuses[0];
        
        return {
            loading: false,
            items: [],
            pagination: {},
            stats: null,
            analytics: null,
            currentPage: parseInt(urlParams.get('page')) || 1,
            // perPage is no longer in URL, use default or keep from previous session
            perPage: 20,
            perPages: [5, 10, 20, 30, 50, 100],
            dateFrom: urlParams.get('date_from') || '',
            dateTo: urlParams.get('date_to') || '',
            searchQuery: urlParams.get('search') || '',
            selectedActivityType,
            activityTypes,
            selectedSort,
            sortOptions,
            selectedRole,
            roles,
            selectedActiveStatus,
            activeStatuses,
            selectedVipStatus,
            vipStatuses,
            datePresets,
            showAdvancedFilters: false,
            spentMin: null,
            spentMax: null,
            registrationDateFrom: '',
            registrationDateTo: '',
            inactiveDays: null,
            showDetailsModal: false,
            selectedUser: null,
            mounted: false,
            selectedTab: 'stats',
            activityTabs: [
                { id: 'stats', label: 'آمار کلی' },
                { id: 'compare', label: 'مقایسه دوره‌ها' },
                { id: 'insights', label: 'بینش‌ها' },
                { id: 'heatmap', label: 'نقشه حرارتی' },
                { id: 'users', label: 'لیست کاربران' },
                { id: 'most_active', label: 'فعال‌ترین' },
                { id: 'viewers', label: 'تماشاکنندگان' },
                { id: 'commenters', label: 'کامنت‌دهندگان' },
                { id: 'questioners', label: 'پرسشگران' },
                { id: 'answerers', label: 'پاسخ‌دهندگان' },
                { id: 'new_users', label: 'کاربران جدید' },
                { id: 'inactive', label: 'غیرفعال' },
                { id: 'vip', label: 'VIP' },
                { id: 'watch_time', label: 'زمان تماشا' },
                { id: 'certificates', label: 'گواهینامه' },
                { id: 'ratings', label: 'امتیازها' },
                { id: 'interactive', label: 'تعامل' },
                { id: 'analytics', label: 'آنالیتیکس' },
            ],
            activityBreakdownItems: [
                { key: 'logins', label: 'لاگین' },
                { key: 'video_views', label: 'تماشا' },
                { key: 'comments', label: 'کامنت' },
                { key: 'questions', label: 'سوال' },
                { key: 'answers', label: 'جواب' },
                { key: 'likes', label: 'لایک' },
                { key: 'payments', label: 'پرداخت' },
                { key: 'ratings', label: 'امتیاز' },
                { key: 'certificates', label: 'گواهینامه' },
            ],
            isInitializing: true,
            defaultAvatar: 'https://static.zanburak.ir/images/avatar/default.png',
            weekdayLabels: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
            fetchError: null,
            refreshing: false,
            activityChartMode: 'total',
        };
    },
    methods: {
        tabButtonClass(id) {
            return this.selectedTab === id
                ? 'text-gray-700 dark:text-black bg-yellow-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/60';
        },

        handleImageError(event) {
            event.target.onerror = null;
            event.target.src = this.defaultAvatar;
        },

        handleSearch: debounce(function() {
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        }, 1000),

        applyFilters() {
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },

        applyPreset(preset) {
            const today = new Date();
            let fromDate;
            
            if (preset.isMonth) {
                // از اول ماه جاری
                fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
            } else {
                // از N روز گذشته
                fromDate = new Date(today);
                fromDate.setDate(today.getDate() - (preset.days || 0));
            }
            
            this.dateFrom = formatLocalDate(fromDate);
            this.dateTo = formatLocalDate(today);
            
            // Update preset active state
            this.datePresets.forEach(p => p.active = p.slug === preset.slug);
            
            this.applyFilters();
        },

        clearFilters() {
            this.dateFrom = '';
            this.dateTo = '';
            this.searchQuery = '';
            this.selectedActivityType = this.activityTypes[0];
            this.selectedSort = this.sortOptions[0];
            this.selectedRole = this.roles[0];
            this.selectedActiveStatus = this.activeStatuses[0];
            this.selectedVipStatus = this.vipStatuses[0];
            this.spentMin = null;
            this.spentMax = null;
            this.registrationDateFrom = '';
            this.registrationDateTo = '';
            this.inactiveDays = null;
            this.datePresets.forEach(p => p.active = false);
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },

        updateUrlAndFetchData() {
            const query = {
                // Only add page to URL if it's greater than 1
                ...(this.currentPage > 1 ? { page: this.currentPage } : {}),
                // perPage should NOT be in URL, only sent to backend
                activity_type: this.selectedActivityType.slug !== 'all' ? this.selectedActivityType.slug : undefined,
                sort: this.selectedSort.slug !== 'newest' ? this.selectedSort.slug : undefined,
                date_from: this.dateFrom || undefined,
                date_to: this.dateTo || undefined,
                search: this.searchQuery || undefined,
                role: this.selectedRole.slug !== 'all' ? this.selectedRole.slug : undefined,
                active_status: this.selectedActiveStatus.slug !== 'all' ? this.selectedActiveStatus.slug : undefined,
                vip_status: this.selectedVipStatus.slug !== 'all' ? this.selectedVipStatus.slug : undefined,
                spent_min: this.spentMin || undefined,
                spent_max: this.spentMax || undefined,
                registration_date_from: this.registrationDateFrom || undefined,
                registration_date_to: this.registrationDateTo || undefined,
                inactive_days: this.inactiveDays || undefined
            };
            
            // Remove undefined values
            Object.keys(query).forEach(key => {
                if (query[key] === undefined) {
                    delete query[key];
                }
            });
            
            // Update URL - the watcher will handle fetching data
            this.$router.push({ query }).catch(() => {
                // Ignore navigation duplicated errors
            });
        },

        selectPerpage(event) {
            const newPerPage = parseInt(event.target.value);
            this.perPage = newPerPage;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },

        async fetchActivities() {
            this.loading = true;
            try {
                const params = {
                    page: this.currentPage,
                    perPage: this.perPage,
                    sort: this.selectedSort.slug
                };

                if (this.dateFrom) params.date_from = this.dateFrom;
                if (this.dateTo) params.date_to = this.dateTo;
                if (this.searchQuery) params.search = this.searchQuery;
                if (this.selectedActivityType.slug !== 'all') params.activity_type = this.selectedActivityType.slug;

                const response = await axiosInstance.post('/admin/user-activity-report', params);
                if (response.data.message === 'Success') {
                    this.items = response.data.activities || [];
                    this.pagination = response.data.pagination || {
                        current_page: 1,
                        last_page: 1,
                        per_page: this.perPage,
                        total: 0
                    };
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchStats() {
            try {
                this.fetchError = null;
                const params = {};
                if (this.dateFrom) params.date_from = this.dateFrom;
                if (this.dateTo) params.date_to = this.dateTo;

                const response = await axiosInstance.get('/admin/user-activity-report/stats', { params });
                if (response.data.message === 'Success') {
                    this.stats = response.data.stats;
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                this.fetchError = 'خطا در دریافت آمار فعالیت کاربران.';
            }
        },

        async fetchAnalytics() {
            try {
                const params = {};
                if (this.dateFrom) params.date_from = this.dateFrom;
                if (this.dateTo) params.date_to = this.dateTo;

                const response = await axiosInstance.get('/admin/user-activity-report/analytics', { params });
                if (response.data.message === 'Success') {
                    this.analytics = response.data.analytics;
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        },

        async refreshAll() {
            this.refreshing = true;
            try {
                await this.fetchStats();
                await this.fetchAnalytics();
                await this.fetchActivities();
            } finally {
                this.refreshing = false;
            }
        },

        activityHeatmapCount(day, hour) {
            return this.activityHeatmapMap[`${day}-${hour}`]?.count || 0;
        },
        activityHeatmapTitle(day, hour) {
            const cell = this.activityHeatmapMap[`${day}-${hour}`];
            return `${this.weekdayLabels[day - 1]} ${String(hour).padStart(2, '0')}:00 — ${cell?.count || 0} (${cell?.logins || 0} لاگین، ${cell?.comments || 0} کامنت)`;
        },
        activityHeatmapStyle(day, hour) {
            const count = this.activityHeatmapCount(day, hour);
            const ratio = this.activityHeatmapMax > 0 ? count / this.activityHeatmapMax : 0;
            const alpha = count > 0 ? 0.15 + ratio * 0.85 : 0.04;
            return { backgroundColor: `rgba(59, 130, 246, ${alpha})` };
        },

        async exportActivities() {
            try {
                const params = {};
                if (this.dateFrom) params.date_from = this.dateFrom;
                if (this.dateTo) params.date_to = this.dateTo;
                if (this.searchQuery) params.search = this.searchQuery;
                if (this.selectedActivityType.slug !== 'all') params.activity_type = this.selectedActivityType.slug;

                const response = await axiosInstance.get('/admin/user-activity-report/export', { params });
                const csv = this.convertToCSV(response.data.data);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `user_activity_report_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
            } catch (error) {
                console.error('Error exporting activities:', error);
            }
        },

        convertToCSV(data) {
            if (!data || data.length === 0) return '';
            const headers = Object.keys(data[0]);
            const rows = data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','));
            return [headers.join(','), ...rows].join('\n');
        },

        viewUserDetails(item) {
            this.selectedUser = item;
            this.showDetailsModal = true;
        },

        closeDetailsModal() {
            this.showDetailsModal = false;
            this.selectedUser = null;
        },

        updatePage(page) {
            this.currentPage = page;
            this.updateUrlAndFetchData();
        },

        formatCurrency(amount) {
            if (!amount) return '0 تومان';
            return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
        },

        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        formatWatchTime(seconds) {
            if (!seconds) return '0 ثانیه';
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            if (hours > 0) {
                return `${hours} ساعت و ${minutes} دقیقه`;
            } else if (minutes > 0) {
                return `${minutes} دقیقه و ${secs} ثانیه`;
            } else {
                return `${secs} ثانیه`;
            }
        },

        getActivityTypeName(type) {
            const names = {
                'login': 'لاگین',
                'view': 'تماشا',
                'comment': 'کامنت'
            };
            return names[type] || type || 'نامشخص';
        },

        getActivityPercent(key) {
            if (!this.stats?.total_activities || !this.totalActivityCount) return 0;
            const value = this.stats.total_activities[key] || 0;
            return Math.round((value / this.totalActivityCount) * 100);
        },

        activityMetricColor(key) {
            const colors = {
                logins: 'blue',
                video_views: 'emerald',
                comments: 'violet',
                questions: 'amber',
                answers: 'rose',
                likes: 'cyan',
                payments: 'emerald',
                ratings: 'amber',
                certificates: 'violet',
            };
            return colors[key] || 'blue';
        },
    },
    watch: {
        selectedActivityType(newVal, oldVal) {
            if (this.mounted && newVal !== oldVal) {
                this.applyFilters();
            }
        },
        selectedSort(newVal, oldVal) {
            if (this.mounted && newVal !== oldVal) {
                this.applyFilters();
            }
        },
        selectedRole(newVal, oldVal) {
            if (this.mounted && newVal !== oldVal) {
                this.applyFilters();
            }
        },
        selectedActiveStatus(newVal, oldVal) {
            if (this.mounted && newVal !== oldVal) {
                this.applyFilters();
            }
        },
        selectedVipStatus(newVal, oldVal) {
            if (this.mounted && newVal !== oldVal) {
                this.applyFilters();
            }
        },
        '$route.query': {
            handler(newQuery, oldQuery) {
                if (this.mounted && !this.isInitializing) {
                    // Only update if query actually changed (prevent infinite loops)
                    if (JSON.stringify(newQuery) === JSON.stringify(oldQuery)) {
                        return;
                    }
                    
                    this.currentPage = parseInt(this.$route.query.page) || 1;
                    // perPage is not in URL anymore, keep current value or default
                    this.searchQuery = this.$route.query.search || '';
                    this.dateFrom = this.$route.query.date_from || '';
                    this.dateTo = this.$route.query.date_to || '';
                    
                    // Update selected filters based on URL
                    const activityTypeSlug = this.$route.query.activity_type || 'all';
                    const sortSlug = this.$route.query.sort || 'newest';
                    const roleSlug = this.$route.query.role || 'all';
                    const activeStatusSlug = this.$route.query.active_status || 'all';
                    const vipStatusSlug = this.$route.query.vip_status || 'all';
                    
                    this.selectedActivityType = this.activityTypes.find(t => t.slug === activityTypeSlug) || this.activityTypes[0];
                    this.selectedSort = this.sortOptions.find(s => s.slug === sortSlug) || this.sortOptions[0];
                    this.selectedRole = this.roles.find(r => r.slug === roleSlug) || this.roles[0];
                    this.selectedActiveStatus = this.activeStatuses.find(s => s.slug === activeStatusSlug) || this.activeStatuses[0];
                    this.selectedVipStatus = this.vipStatuses.find(v => v.slug === vipStatusSlug) || this.vipStatuses[0];
                    this.spentMin = this.$route.query.spent_min ? parseInt(this.$route.query.spent_min) : null;
                    this.spentMax = this.$route.query.spent_max ? parseInt(this.$route.query.spent_max) : null;
                    this.registrationDateFrom = this.$route.query.registration_date_from || '';
                    this.registrationDateTo = this.$route.query.registration_date_to || '';
                    this.inactiveDays = this.$route.query.inactive_days ? parseInt(this.$route.query.inactive_days) : null;
                    
                    this.fetchActivities();
                    this.fetchStats();
                    this.fetchAnalytics();
                }
            },
            deep: true
        },
        dateFrom() {
            if (this.mounted) {
                this.currentPage = 1;
                this.updateUrlAndFetchData();
            }
        },
        dateTo() {
            if (this.mounted) {
                this.currentPage = 1;
                this.updateUrlAndFetchData();
            }
        }
    },
    async mounted() {
        this.mounted = true;
        
        // Check if we need to update URL (remove perPage if exists, adjust page)
        const needsUrlUpdate = this.$route.query.perPage || 
                              (this.$route.query.page && parseInt(this.$route.query.page) === 1);
        
        if (needsUrlUpdate) {
            // Update URL without perPage and remove page if it's 1
            // Don't call fetchActivities here as it will be called after URL update by the watcher
            // But we need to prevent watcher from running, so we'll handle it manually
            this.isInitializing = true;
            const query = {
                ...(this.currentPage > 1 ? { page: this.currentPage } : {}),
                activity_type: this.selectedActivityType.slug !== 'all' ? this.selectedActivityType.slug : undefined,
                sort: this.selectedSort.slug !== 'newest' ? this.selectedSort.slug : undefined,
                date_from: this.dateFrom || undefined,
                date_to: this.dateTo || undefined,
                search: this.searchQuery || undefined,
                role: this.selectedRole.slug !== 'all' ? this.selectedRole.slug : undefined,
                active_status: this.selectedActiveStatus.slug !== 'all' ? this.selectedActiveStatus.slug : undefined,
                vip_status: this.selectedVipStatus.slug !== 'all' ? this.selectedVipStatus.slug : undefined,
                spent_min: this.spentMin || undefined,
                spent_max: this.spentMax || undefined,
                registration_date_from: this.registrationDateFrom || undefined,
                registration_date_to: this.registrationDateTo || undefined,
                inactive_days: this.inactiveDays || undefined
            };
            
            Object.keys(query).forEach(key => {
                if (query[key] === undefined) {
                    delete query[key];
                }
            });
            
            await this.$router.push({ query });
            this.isInitializing = false;
            await this.fetchActivities();
        } else {
            // Load from URL if filters exist, otherwise just fetch with defaults
            if (Object.keys(this.$route.query).length > 0) {
                // Update data from URL
                this.currentPage = parseInt(this.$route.query.page) || 1;
                this.searchQuery = this.$route.query.search || '';
                this.dateFrom = this.$route.query.date_from || '';
                this.dateTo = this.$route.query.date_to || '';
                
                const activityTypeSlug = this.$route.query.activity_type || 'all';
                const sortSlug = this.$route.query.sort || 'newest';
                const roleSlug = this.$route.query.role || 'all';
                const activeStatusSlug = this.$route.query.active_status || 'all';
                const vipStatusSlug = this.$route.query.vip_status || 'all';
                
                this.selectedActivityType = this.activityTypes.find(t => t.slug === activityTypeSlug) || this.activityTypes[0];
                this.selectedSort = this.sortOptions.find(s => s.slug === sortSlug) || this.sortOptions[0];
                this.selectedRole = this.roles.find(r => r.slug === roleSlug) || this.roles[0];
                this.selectedActiveStatus = this.activeStatuses.find(s => s.slug === activeStatusSlug) || this.activeStatuses[0];
                this.selectedVipStatus = this.vipStatuses.find(v => v.slug === vipStatusSlug) || this.vipStatuses[0];
                this.spentMin = this.$route.query.spent_min ? parseInt(this.$route.query.spent_min) : null;
                this.spentMax = this.$route.query.spent_max ? parseInt(this.$route.query.spent_max) : null;
                this.registrationDateFrom = this.$route.query.registration_date_from || '';
                this.registrationDateTo = this.$route.query.registration_date_to || '';
                this.inactiveDays = this.$route.query.inactive_days ? parseInt(this.$route.query.inactive_days) : null;
            }
            
            await this.fetchActivities();
        }
        
        await this.fetchStats();
        await this.fetchAnalytics();
        this.isInitializing = false;
    }
};
</script>

