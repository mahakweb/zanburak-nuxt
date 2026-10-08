<template>
    <AdminMasterPage>
        
        <template #breadcrumb-actions>
                    <button @click="exportSales"
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
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ stats.total_transactions }} تراکنش</span>
                        <span class="text-gray-300 dark:text-gray-600">•</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">میانگین {{ formatCurrency(stats.average_transaction) }}</span>
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
                            <p class="text-xs text-gray-500 dark:text-gray-400">نتایج را بر اساس تاریخ، روش پرداخت و مبلغ محدود کنید</p>
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
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">روش
                            پرداخت</label>
                        <Listbox v-model="selectedPaymentMethod" v-slot="{ open }" as="div">
                            <div class="relative">
                                <ListboxButton
                                    class="w-full h-8 px-3 py-1.5 text-start text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                                    {{ selectedPaymentMethod.title }}
                                </ListboxButton>
                                <ListboxOptions v-if="open"
                                    class="absolute z-10 w-full mt-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    <ListboxOption v-for="method in paymentMethods" :key="method.slug" :value="method"
                                        class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {{ method.title }}
                                    </ListboxOption>
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>
                    <div class="flex-1 min-w-[150px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">درگاه
                            پرداخت</label>
                        <Listbox v-model="selectedDriver" v-slot="{ open }" as="div">
                            <div class="relative">
                                <ListboxButton
                                    class="w-full h-8 px-3 py-1.5 text-start text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                                    {{ selectedDriver.title }}
                                </ListboxButton>
                                <ListboxOptions v-if="open"
                                    class="absolute z-10 w-full mt-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                                    <ListboxOption v-for="driver in drivers" :key="driver.slug" :value="driver"
                                        class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {{ driver.title }}
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
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">حداقل
                                    مبلغ
                                    (تومان)</label>
                                <input type="number" v-model.number="amountMin" @change="applyFilters" placeholder=""
                                    class="w-full h-8 px-3 py-1.5 text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                            </div>
                            <div class="flex-1 min-w-[150px]">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">حداکثر
                                    مبلغ
                                    (تومان)</label>
                                <input type="number" v-model.number="amountMax" @change="applyFilters" placeholder=""
                                    class="w-full h-8 px-3 py-1.5 text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                            </div>
                            <div class="flex-1 min-w-[200px]">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">نوع
                                    پرداخت</label>
                                <Listbox v-model="selectedPayableType" v-slot="{ open }" as="div">
                                    <div class="relative">
                                        <ListboxButton
                                            class="w-full h-8 px-3 py-1.5 text-start text-sm rounded-lg outline-none ring-0 focus:ring-0 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                                            {{ selectedPayableType.title }}
                                        </ListboxButton>
                                        <ListboxOptions v-if="open"
                                            class="absolute z-10 w-full mt-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                                            <ListboxOption v-for="type in payableTypes" :key="type.slug" :value="type"
                                                class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                                {{ type.title }}
                                            </ListboxOption>
                                        </ListboxOptions>
                                    </div>
                                </Listbox>
                            </div>
                            <div class="flex-1 min-w-[200px]">
                                <label
                                    class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">مرتب‌سازی</label>
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
                        <Tab v-for="tab in salesTabs" :key="tab.id" as="div">
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
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <AdminReportStatCard compact title="فروش خالص" :value="formatCurrency(stats.net_sales) + ' تومان'"
                                        :subtitle="'ناخالص ' + formatCurrency(stats.total_sales)"
                                        accent="emerald" value-dir="ltr"
                                        :trend="stats.comparison ? stats.comparison.net_sales : null">
                                        <template #icon>
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 3v18M7 7.5h6.5a2.5 2.5 0 0 1 0 5H9a2.5 2.5 0 0 0 0 5H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                                            </svg>
                                        </template>
                                    </AdminReportStatCard>
                                    <AdminReportStatCard compact title="تراکنش‌ها" :value="stats.total_transactions"
                                        :subtitle="dailySalesSummary" accent="blue" value-dir="ltr"
                                        :trend="stats.comparison ? stats.comparison.transactions : null">
                                        <template #icon>
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                                <path d="M8 7h8M8 12h8M8 17h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                                                <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.8" />
                                            </svg>
                                        </template>
                                    </AdminReportStatCard>
                                    <AdminReportStatCard compact title="میانگین تراکنش" :value="formatCurrency(stats.average_transaction) + ' تومان'"
                                        subtitle="هر سفارش پرداخت‌شده" accent="violet" value-dir="ltr"
                                        :trend="stats.comparison ? stats.comparison.average_transaction : null">
                                        <template #icon>
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 16l5-5 3 3 8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M15 6h5v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                                            </svg>
                                        </template>
                                    </AdminReportStatCard>
                                    <AdminReportStatCard compact title="تخفیف" :value="formatCurrency(stats.total_discount) + ' تومان'"
                                        :subtitle="'نرخ ' + discountRate + '٪'" accent="amber" value-dir="ltr"
                                        :trend="stats.comparison ? stats.comparison.discount : null" :invert-trend-colors="true">
                                        <template #icon>
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 13l-7 7-9-9V4h7l9 9z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                                                <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                                            </svg>
                                        </template>
                                    </AdminReportStatCard>
                                </div>

                                <div v-if="stats.settlement" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                    <AdminReportStatCard compact title="تسویه شده" :value="formatCurrency(stats.settlement.settled_amount) + ' تومان'"
                                        :subtitle="(stats.settlement.settled_count || 0) + ' مورد'" accent="emerald" value-dir="ltr">
                                        <template #icon>
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" />
                                                <path d="M8.5 12.2l2.2 2.2 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </template>
                                    </AdminReportStatCard>
                                    <AdminReportStatCard compact title="تسویه نشده" :value="formatCurrency(stats.settlement.unsettled_amount) + ' تومان'"
                                        :subtitle="(stats.settlement.unsettled_count || 0) + ' مورد'" accent="amber" value-dir="ltr">
                                        <template #icon>
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" />
                                                <path d="M12 8v4.5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                                            </svg>
                                        </template>
                                    </AdminReportStatCard>
                                </div>

                                <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 mt-3">
                                    <div class="flex items-center gap-2 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 px-2.5 py-2">
                                        <span class="shrink-0 p-1 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.8"/></svg>
                                        </span>
                                        <div class="min-w-0">
                                            <p class="text-[10px] text-gray-500 dark:text-gray-400">روش پرداخت</p>
                                            <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ topPaymentMethod.label }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 px-2.5 py-2">
                                        <span class="shrink-0 p-1 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><path d="M4 10h16M6 10V7a6 6 0 0 1 12 0v3M5 10v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                                        </span>
                                        <div class="min-w-0">
                                            <p class="text-[10px] text-gray-500 dark:text-gray-400">درگاه</p>
                                            <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ topDriver.label }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 px-2.5 py-2">
                                        <span class="shrink-0 p-1 rounded-md bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><path d="M4 7l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
                                        </span>
                                        <div class="min-w-0">
                                            <p class="text-[10px] text-gray-500 dark:text-gray-400">نوع محصول</p>
                                            <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ topProductType.label }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 px-2.5 py-2">
                                        <span class="shrink-0 p-1 rounded-md bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400">
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                                        </span>
                                        <div class="min-w-0">
                                            <p class="text-[10px] text-gray-500 dark:text-gray-400">میانگین روزانه</p>
                                            <p class="text-xs font-semibold text-gray-900 dark:text-white truncate" dir="ltr">{{ formatCurrency(dailyAverageSales) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 px-2.5 py-2">
                                        <span class="shrink-0 p-1 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 19c.6-2.6 2.7-4 5.5-4s4.9 1.4 5.5 4M17 11a2.5 2.5 0 1 0 0-5M16 15c1.8.3 3.2 1.4 3.8 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                                        </span>
                                        <div class="min-w-0">
                                            <p class="text-[10px] text-gray-500 dark:text-gray-400">خریدار یکتا</p>
                                            <p class="text-xs font-semibold text-gray-900 dark:text-white">{{ stats.unique_buyers || 0 }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 px-2.5 py-2">
                                        <span class="shrink-0 p-1 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                                        </span>
                                        <div class="min-w-0">
                                            <p class="text-[10px] text-gray-500 dark:text-gray-400">فروش امروز</p>
                                            <p class="text-xs font-semibold text-gray-900 dark:text-white truncate" dir="ltr">{{ formatCurrency(stats.today?.net_sales || 0) }}</p>
                                        </div>
                                    </div>
                                </div>

                                <AdminReportChartCard v-if="stats.comparison" class="mt-6" title="مقایسه با دوره قبل"
                                    subtitle="تغییرات نسبت به بازه زمانی معادل قبل از دوره انتخاب‌شده">
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        <AdminReportComparisonCard label="فروش خالص"
                                            :current="formatCurrency(stats.comparison.net_sales.current) + ' تومان'"
                                            :previous="formatCurrency(stats.comparison.net_sales.previous) + ' تومان'"
                                            :change="stats.comparison.net_sales.change"
                                            :change-percent="stats.comparison.net_sales.change_percent" />
                                        <AdminReportComparisonCard label="تراکنش‌ها"
                                            :current="stats.comparison.transactions.current"
                                            :previous="stats.comparison.transactions.previous"
                                            :change="stats.comparison.transactions.change"
                                            :change-percent="stats.comparison.transactions.change_percent" />
                                        <AdminReportComparisonCard label="میانگین تراکنش"
                                            :current="formatCurrency(stats.comparison.average_transaction.current) + ' تومان'"
                                            :previous="formatCurrency(stats.comparison.average_transaction.previous) + ' تومان'"
                                            :change="stats.comparison.average_transaction.change"
                                            :change-percent="stats.comparison.average_transaction.change_percent" />
                                        <AdminReportComparisonCard label="تخفیف"
                                            :current="formatCurrency(stats.comparison.discount.current) + ' تومان'"
                                            :previous="formatCurrency(stats.comparison.discount.previous) + ' تومان'"
                                            :change="stats.comparison.discount.change"
                                            :change-percent="stats.comparison.discount.change_percent"
                                            :invert-colors="true" />
                                    </div>
                                </AdminReportChartCard>

                                <div class="mt-6 space-y-4">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                                    <AdminReportChartCard class="lg:col-span-2" v-if="stats.daily_sales && stats.daily_sales.length > 0"
                                        title="فروش روزانه" :subtitle="chartMode === 'amount' ? 'روند مبلغ فروش در بازه انتخاب‌شده' : 'تعداد تراکنش‌های روزانه'"
                                        :badge="stats.daily_sales.length + ' روز'">
                                        <template #actions>
                                            <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-0.5">
                                                <button class="px-3 py-1 text-xs font-semibold rounded-full transition-colors"
                                                    :class="chartMode === 'amount' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
                                                    @click="chartMode = 'amount'">مبلغ</button>
                                                <button class="px-3 py-1 text-xs font-semibold rounded-full transition-colors"
                                                    :class="chartMode === 'count' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
                                                    @click="chartMode = 'count'">تعداد</button>
                                            </div>
                                        </template>
                                        <AreaChart class="h-72 mx-auto flex items-center justify-center"
                                            :rawData="{
                                                labels: stats.daily_sales.map(d => d.date),
                                                data: stats.daily_sales.map(d => chartMode === 'amount' ? d.total : d.count)
                                            }"
                                            :showLegend="false"
                                            :lineColor="chartMode === 'amount' ? 'rgba(34, 197, 94, 1)' : 'rgba(59, 130, 246, 1)'"
                                            :fillColor="chartMode === 'amount' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(59, 130, 246, 0.25)'" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard v-if="stats.settlement" title="وضعیت تسویه" subtitle="سهم نهایی بعد از تخفیف">
                                        <DoughnutChart chart-id="sales-settlement-chart" class="h-56 mx-auto" legend-position="bottom" value-format="currency"
                                            :rawData="{
                                                labels: ['تسویه شده', 'تسویه نشده'],
                                                data: [stats.settlement.settled_amount || 0, stats.settlement.unsettled_amount || 0],
                                                colors: ['#22c55e', '#f59e0b']
                                            }" />
                                    </AdminReportChartCard>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <AdminReportChartCard v-if="stats.sales_by_method && stats.sales_by_method.length > 0"
                                            title="فروش بر اساس روش پرداخت" subtitle="سهم کیف پول در مقابل درگاه بانکی">
                                            <DoughnutChart chart-id="sales-method-chart" class="h-56 mx-auto" value-format="currency" :rawData="{
                                                labels: stats.sales_by_method.map(m => getPaymentMethodName(m.method)),
                                                data: stats.sales_by_method.map(m => m.total),
                                                colors: ['#3b82f6', '#10b981', '#8b5cf6']
                                            }" legend-position="bottom" />
                                        </AdminReportChartCard>
                                        <AdminReportChartCard v-if="stats.sales_by_driver && stats.sales_by_driver.length > 0"
                                            title="فروش بر اساس درگاه" subtitle="توزیع درآمد بین درگاه‌های پرداخت">
                                            <AdminBarChart class="h-56" value-format="currency" :rawData="{
                                                labels: stats.sales_by_driver.map(d => getDriverName(d.driver)),
                                                data: stats.sales_by_driver.map(d => d.total)
                                            }" barColor="rgba(245,158,11,0.85)" hoverColor="rgba(245,158,11,1)" />
                                        </AdminReportChartCard>
                                        <AdminReportChartCard v-if="stats.sales_by_type && stats.sales_by_type.length > 0"
                                            title="فروش بر اساس نوع" subtitle="دوره، مسیر و پلن">
                                            <AdminBarChart class="h-56" value-format="currency" :rawData="{
                                                labels: stats.sales_by_type.map(t => t.type === 'Course' ? 'دوره' : t.type === 'Path' ? 'مسیر' : 'پلن'),
                                                data: stats.sales_by_type.map(t => t.total)
                                            }" barColor="rgba(139,92,246,0.85)" hoverColor="rgba(139,92,246,1)" />
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
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                    <AdminReportComparisonCard label="فروش خالص"
                                        :current="formatCurrency(stats.comparison.net_sales.current) + ' تومان'"
                                        :previous="formatCurrency(stats.comparison.net_sales.previous) + ' تومان'"
                                        :change="stats.comparison.net_sales.change"
                                        :change-percent="stats.comparison.net_sales.change_percent" />
                                    <AdminReportComparisonCard label="تراکنش‌ها"
                                        :current="stats.comparison.transactions.current"
                                        :previous="stats.comparison.transactions.previous"
                                        :change="stats.comparison.transactions.change"
                                        :change-percent="stats.comparison.transactions.change_percent" />
                                    <AdminReportComparisonCard label="خریداران یکتا"
                                        :current="stats.comparison.unique_buyers?.current || 0"
                                        :previous="stats.comparison.unique_buyers?.previous || 0"
                                        :change="stats.comparison.unique_buyers?.change || 0"
                                        :change-percent="stats.comparison.unique_buyers?.change_percent || 0" />
                                    <AdminReportComparisonCard label="میانگین تراکنش"
                                        :current="formatCurrency(stats.comparison.average_transaction.current) + ' تومان'"
                                        :previous="formatCurrency(stats.comparison.average_transaction.previous) + ' تومان'"
                                        :change="stats.comparison.average_transaction.change"
                                        :change-percent="stats.comparison.average_transaction.change_percent" />
                                    <AdminReportComparisonCard label="تخفیف"
                                        :current="formatCurrency(stats.comparison.discount.current) + ' تومان'"
                                        :previous="formatCurrency(stats.comparison.discount.previous) + ' تومان'"
                                        :change="stats.comparison.discount.change"
                                        :change-percent="stats.comparison.discount.change_percent"
                                        :invert-colors="true" />
                                </div>
                                <AdminReportChartCard title="روند روزانه — مقایسه‌ای" subtitle="دوره فعلی در برابر دوره معادل قبل">
                                    <template #actions>
                                        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-0.5">
                                            <button class="px-3 py-1 text-xs font-semibold rounded-full transition-colors"
                                                :class="compareChartMode === 'amount' ? 'bg-white dark:bg-gray-900 shadow-sm' : ''"
                                                @click="compareChartMode = 'amount'">مبلغ</button>
                                            <button class="px-3 py-1 text-xs font-semibold rounded-full transition-colors"
                                                :class="compareChartMode === 'count' ? 'bg-white dark:bg-gray-900 shadow-sm' : ''"
                                                @click="compareChartMode = 'count'">تعداد</button>
                                        </div>
                                    </template>
                                    <ComparisonLineChart v-if="salesDailyComparisonChart.labels.length" class="h-72"
                                        :value-format="compareChartMode === 'amount' ? 'currency' : 'number'"
                                        :labels="salesDailyComparisonChart.labels" :datasets="salesDailyComparisonChart.datasets" />
                                </AdminReportChartCard>
                                <AdminReportChartCard v-if="stats.sales_by_type?.length" title="فروش بر اساس نوع — مقایسه‌ای">
                                    <ComparisonBarChart class="h-72"
                                        :labels="salesTypeChart.labels"
                                        :datasets="salesTypeChart.datasets" />
                                </AdminReportChartCard>
                            </div>
                            <p v-else class="py-16 text-center text-sm text-gray-500">در حال بارگذاری...</p>
                        </TabPanel>

                        <!-- Insights Tab -->
                        <TabPanel v-if="selectedTab === 'insights'">
                            <div v-if="stats" class="space-y-6">
                                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                    <div v-for="item in salesInsightCards" :key="item.label" class="px-2.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80">
                                        <p class="text-[11px] text-gray-500 mb-0.5">{{ item.label }}</p>
                                        <p class="text-sm font-semibold text-gray-900 dark:text-white font-anjoman" :dir="item.dir || 'rtl'">{{ item.value }}</p>
                                        <p v-if="item.sub" class="text-[11px] text-gray-400 mt-0.5">{{ item.sub }}</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <AdminReportChartCard title="فروش ساعتی" subtitle="توزیع تراکنش‌ها در ساعات روز">
                                        <AdminBarChart v-if="salesHourlyChart.labels.length" class="h-64"
                                            :rawData="salesHourlyChart" barColor="rgba(34,197,94,0.85)" hoverColor="rgba(34,197,94,1)" />
                                    </AdminReportChartCard>
                                    <AdminReportChartCard v-if="salesMonthlyChart.labels.length" title="روند ماهانه" subtitle="فروش تجمیع‌شده ماه به ماه">
                                        <AdminBarChart class="h-64" :rawData="salesMonthlyChart" barColor="rgba(59,130,246,0.85)" />
                                    </AdminReportChartCard>
                                </div>
                                <AdminReportChartCard v-if="analytics?.top_courses?.length" title="پرفروش‌ترین دوره‌ها" subtitle="۱۰ دوره برتر — درآمد">
                                    <AdminBarChart class="h-80" :rawData="topCoursesChart" :horizontal="true" barColor="rgba(139,92,246,0.85)" />
                                </AdminReportChartCard>
                            </div>
                            <p v-else class="py-16 text-center text-sm text-gray-500">در حال بارگذاری...</p>
                        </TabPanel>

                        <!-- Heatmap Tab -->
                        <TabPanel v-if="selectedTab === 'heatmap'">
                            <div v-if="stats?.heatmap?.cells?.length" class="space-y-4">
                                <AdminReportChartCard title="نقشه حرارتی خرید" subtitle="روز هفته × ساعت — تیرگی = تراکنش بیشتر">
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <div class="min-w-[640px]">
                                            <div class="grid grid-cols-[72px_repeat(24,minmax(0,1fr))] gap-0.5 text-[10px]">
                                                <div></div>
                                                <div v-for="h in 24" :key="'h'+h" class="text-center text-gray-400 pb-1">{{ String(h - 1).padStart(2,'0') }}</div>
                                                <template v-for="day in 7" :key="'d'+day">
                                                    <div class="text-gray-500 text-xs flex items-center">{{ weekdayLabels[day - 1] }}</div>
                                                    <div v-for="hour in 24" :key="day+'-'+hour"
                                                        class="aspect-square rounded-sm flex items-center justify-center font-anjoman"
                                                        :style="salesHeatmapStyle(day, hour - 1)"
                                                        :title="salesHeatmapTitle(day, hour - 1)">
                                                        <span v-if="salesHeatmapCount(day, hour - 1) > 0" class="text-[9px] font-bold">{{ salesHeatmapCount(day, hour - 1) }}</span>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </AdminReportChartCard>
                            </div>
                            <p v-else class="py-16 text-center text-sm text-gray-500">داده‌ای برای heatmap نیست</p>
                        </TabPanel>

                        <!-- Transactions Tab -->
                        <TabPanel v-if="selectedTab === 'transactions'">
                            <div class="overflow-x-auto md:custom-scrollbar">
                                <table
                                    class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[12rem]">شناسه پرداخت</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">مبلغ</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تخفیف</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">مبلغ نهایی</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">روش پرداخت</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">درگاه</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ پرداخت</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(item, i) in items" :key="i"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[12rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ item.uuid }}</div>
                                                <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.reference_id }}</div>
                                            </td>
                                            <td class="px-1 py-3 text-start">
                                                <div v-if="item.user" class="flex items-center">
                                                    <div
                                                        class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="item.user.profile_pic || defaultAvatar"
                                                            :alt="item.user.first_name + ' ' + item.user.last_name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <div class="text-xs font-semibold text-gray-900 dark:text-white">
                                                            {{ item.user.first_name }} {{ item.user.last_name }}
                                                        </div>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.user.email }}</div>
                                                    </div>
                                                </div>
                                                <div v-else class="text-xs text-gray-400">نامشخص</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(item.amount) }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(item.discount_amount) }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(item.final_amount) }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max">
                                                    {{ getPaymentMethodName(item.payment_method) }}
                                                    <div v-if="Number(item.wallet_paid_amount) > 0" class="mt-0.5 text-[10px] font-medium leading-4 text-gray-500 dark:text-gray-400">
                                                        کیف پول {{ formatCurrency(item.wallet_paid_amount) }} · درگاه {{ formatCurrency(item.gateway_paid_amount) }}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max">
                                                    {{ getDriverName(item.driver) }}
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div dir="ltr"
                                                    class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max">
                                                    {{ formatDate(item.paid_at) }}
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-center">
                                                <button @click="viewDetails(item)"
                                                    class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/50 px-3 py-1 rounded-lg">
                                                    جزئیات
                                                </button>
                                            </td>
                                        </tr>
                                        <tr v-if="items.length === 0 && !loading">
                                            <td colspan="9" class="py-14 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                تراکنشی یافت نشد
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

                        <!-- Courses Tab -->
                        <TabPanel v-if="selectedTab === 'courses'">
                            <div v-if="analytics && analytics.top_courses && analytics.top_courses.length > 0"
                                class="overflow-x-auto md:custom-scrollbar">
                                <table
                                    class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[16rem]">دوره</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">مدرس</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد فروش</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">درآمد کل</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تخفیف</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(course, idx) in analytics.top_courses" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[16rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div
                                                        class="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="course.poster || defaultPoster" :alt="course.title"
                                                            @error="handleImageError($event, 'poster')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ course.title }}</div>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{{ formatCurrency(course.price) }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max">
                                                    {{ course.teacher?.name || 'نامشخص' }}
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ course.sales_count }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(course.total_revenue) }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(course.total_discount) }}</div>
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

                        <!-- Paths Tab -->
                        <TabPanel v-if="selectedTab === 'paths'">
                            <div v-if="analytics.top_paths && analytics.top_paths.length > 0"
                                class="overflow-x-auto md:custom-scrollbar">
                                <table
                                    class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[16rem]">مسیر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد فروش</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">درآمد کل</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تخفیف</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(path, idx) in analytics.top_paths" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[16rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div
                                                        class="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="path.poster || defaultPoster" :alt="path.title"
                                                            @error="handleImageError($event, 'poster')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2 text-xs font-semibold text-gray-900 dark:text-white">{{ path.title }}</div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ path.sales_count }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(path.total_revenue) }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(path.total_discount) }}</div>
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

                        <!-- Plans Tab -->
                        <TabPanel v-if="selectedTab === 'plans'">
                            <div v-if="analytics.top_plans && analytics.top_plans.length > 0"
                                class="overflow-x-auto md:custom-scrollbar">
                                <table
                                    class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">پلن</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد فروش</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">درآمد کل</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تخفیف</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(plan, idx) in analytics.top_plans" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div
                                                        class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="plan.icon || defaultPoster" :alt="plan.title"
                                                            @error="handleImageError($event, 'poster')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ plan.title }}</div>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{{ formatCurrency(plan.price) }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ plan.sales_count }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(plan.total_revenue) }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(plan.total_discount) }}</div>
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

                        <!-- Users Tab -->
                        <TabPanel v-if="selectedTab === 'users'">
                            <div v-if="analytics.active_users && analytics.active_users.length > 0"
                                class="overflow-x-auto md:custom-scrollbar">
                                <table
                                    class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">کاربر</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد خرید</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">مجموع پرداختی</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(user, idx) in analytics.active_users" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div
                                                        class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="user.profile_pic || defaultAvatar" :alt="user.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ user.name }}</div>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ user.purchase_count }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(user.total_spent) }}</div>
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

                        <!-- Categories Tab -->
                        <TabPanel v-if="selectedTab === 'categories'">
                            <div v-if="analytics.top_categories && analytics.top_categories.length > 0">
                                <div class="mb-4 flex items-center justify-between">
                                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">پرفروش‌ترین دسته‌بندی‌ها</h3>
                                    <span class="text-xs text-gray-400">{{ analytics.top_categories.length }} مورد</span>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div v-for="(cat, idx) in analytics.top_categories" :key="idx"
                                        class="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                                        <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                        <div class="flex items-start justify-between gap-3 mb-3 ps-2">
                                            <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ cat.title }}</div>
                                            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50 px-2.5 py-0.5 rounded-lg">#{{ idx + 1 }}</span>
                                        </div>
                                        <div class="space-y-2 ps-2">
                                            <div class="flex items-center justify-between gap-2">
                                                <span class="text-xs text-gray-500 dark:text-gray-400">درآمد</span>
                                                <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg" dir="ltr">{{ formatCurrency(cat.total_revenue) }}</span>
                                            </div>
                                            <div class="flex items-center justify-between gap-2">
                                                <span class="text-xs text-gray-500 dark:text-gray-400">تعداد دوره</span>
                                                <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">{{ cat.courses_count }}</span>
                                            </div>
                                            <div class="flex items-center justify-between gap-2">
                                                <span class="text-xs text-gray-500 dark:text-gray-400">تعداد فروش</span>
                                                <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">{{ cat.sales_count }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Levels Tab -->
                        <TabPanel v-if="selectedTab === 'levels'">
                            <div v-if="analytics.top_levels && analytics.top_levels.length > 0">
                                <div class="mb-4 flex items-center justify-between">
                                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">پرفروش‌ترین سطح‌ها</h3>
                                    <span class="text-xs text-gray-400">{{ analytics.top_levels.length }} مورد</span>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div v-for="(level, idx) in analytics.top_levels" :key="idx"
                                        class="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                                        <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                        <div class="flex items-start justify-between gap-3 mb-3 ps-2">
                                            <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ level.title }}</div>
                                            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50 px-2.5 py-0.5 rounded-lg">#{{ idx + 1 }}</span>
                                        </div>
                                        <div class="space-y-2 ps-2">
                                            <div class="flex items-center justify-between gap-2">
                                                <span class="text-xs text-gray-500 dark:text-gray-400">درآمد</span>
                                                <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg" dir="ltr">{{ formatCurrency(level.total_revenue) }}</span>
                                            </div>
                                            <div class="flex items-center justify-between gap-2">
                                                <span class="text-xs text-gray-500 dark:text-gray-400">تعداد دوره</span>
                                                <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">{{ level.courses_count }}</span>
                                            </div>
                                            <div class="flex items-center justify-between gap-2">
                                                <span class="text-xs text-gray-500 dark:text-gray-400">تعداد فروش</span>
                                                <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">{{ level.sales_count }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-14 text-center">
                                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد</p>
                            </div>
                        </TabPanel>

                        <!-- Teachers Tab -->
                        <TabPanel v-if="selectedTab === 'teachers'">
                            <div v-if="analytics.top_teachers && analytics.top_teachers.length > 0"
                                class="overflow-x-auto md:custom-scrollbar">
                                <table
                                    class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">مدرس</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد دوره</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد فروش</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">درآمد کل</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(teacher, idx) in analytics.top_teachers" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div class="flex items-center">
                                                    <div
                                                        class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                        <img :src="teacher.profile_pic || defaultAvatar" :alt="teacher.name"
                                                            @error="handleImageError($event, 'avatar')"
                                                            class="w-full h-full object-cover">
                                                    </div>
                                                    <div class="ms-2">
                                                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ teacher.name }}</div>
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ teacher.email }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ teacher.courses_count }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ teacher.sales_count }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(teacher.total_revenue) }}</div>
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

                        <!-- Discounts Tab -->
                        <TabPanel v-if="selectedTab === 'discounts'">
                            <div v-if="analytics.top_discount_codes && analytics.top_discount_codes.length > 0"
                                class="overflow-x-auto md:custom-scrollbar">
                                <table
                                    class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                    <thead class="bg-gradient-to-l from-amber-400/90 to-yellow-300/80 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200">
                                        <tr class="text-xs font-semibold text-start">
                                            <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[12rem]">کد تخفیف</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">تعداد استفاده</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">مجموع تخفیف</th>
                                            <th class="px-1 py-3 whitespace-nowrap text-start">مبلغ کل</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                        <tr v-for="(discount, idx) in analytics.top_discount_codes" :key="idx"
                                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors">
                                            <td class="relative ps-3 pe-1 py-3 whitespace-nowrap text-start lg:min-w-[12rem]">
                                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg bg-gray-300 dark:bg-gray-600"></div>
                                                <div>
                                                    <span class="inline-flex text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg">{{ discount.code }}</span>
                                                    <div v-if="discount.discount" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{
                                                        discount.discount.title || '' }}</div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ discount.usage_count }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(discount.total_discount) }}</div>
                                            </td>
                                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                                <div class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-3 py-1 rounded-lg w-max"
                                                    dir="ltr">{{ formatCurrency(discount.total_original_amount) }}</div>
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
                    </TabPanels>
                </TabGroup>
            </div>


            <BottomSheetDrawer v-model="showDetailsModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[48rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">جزئیات فروش</h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeDetailsModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div v-if="selectedSale" class="text-right">
                                        <div class="space-y-4">
                                            <div v-if="selectedSale.user">
                                                <h4 class="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">اطلاعات کاربر</h4>
                                                <div
                                                    class="rounded-xl bg-gray-100/80 dark:bg-gray-800/80 p-4 space-y-2 text-sm">
                                                    <div class="flex items-center gap-3">
                                                        <div
                                                            class="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                                            <img :src="selectedSale.user.profile_pic || defaultAvatar"
                                                                :alt="selectedSale.user.first_name + ' ' + selectedSale.user.last_name"
                                                                @error="handleImageError($event, 'avatar')"
                                                                class="w-full h-full object-cover">
                                                        </div>
                                                        <div>
                                                            <div><span class="font-medium">نام:</span> {{
                                                                selectedSale.user.first_name }} {{
                                                                    selectedSale.user.last_name }}</div>
                                                            <div><span class="font-medium">ایمیل:</span> {{
                                                                selectedSale.user.email }}</div>
                                                            <div v-if="selectedSale.user.username"><span
                                                                    class="font-medium">نام کاربری:</span> {{
                                                                        selectedSale.user.username }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 class="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">اطلاعات پرداخت</h4>
                                                <div
                                                    class="rounded-xl bg-gray-100/80 dark:bg-gray-800/80 p-4 space-y-2 text-sm">
                                                    <div><span class="font-medium">UUID:</span> {{ selectedSale.uuid }}
                                                    </div>
                                                    <div><span class="font-medium">مرجع:</span> {{
                                                        selectedSale.reference_id }}</div>
                                                    <div><span class="font-medium">مبلغ:</span> {{
                                                        formatCurrency(selectedSale.amount) }}</div>
                                                    <div v-if="selectedSale.discount_amount > 0">
                                                        <span class="font-medium">تخفیف:</span> {{
                                                            formatCurrency(selectedSale.discount_amount) }}
                                                    </div>
                                                    <div v-if="selectedSale.discount_code">
                                                        <span class="font-medium">کد تخفیف:</span>
                                                        <span class="font-semibold text-gray-800 dark:text-gray-100">{{
                                                            selectedSale.discount_code }}</span>
                                                    </div>
                                                    <div><span class="font-medium">مبلغ نهایی:</span> {{
                                                        formatCurrency(selectedSale.final_amount || 0) }}</div>
                                                    <div><span class="font-medium">روش پرداخت:</span>
                                                        {{ getPaymentMethodName(selectedSale.payment_method) }}
                                                    </div>
                                                    <div v-if="Number(selectedSale.wallet_paid_amount) > 0">
                                                        <span class="font-medium">سهم کیف پول:</span>
                                                        {{ formatCurrency(selectedSale.wallet_paid_amount) }}
                                                    </div>
                                                    <div v-if="Number(selectedSale.gateway_paid_amount) > 0">
                                                        <span class="font-medium">سهم درگاه:</span>
                                                        {{ formatCurrency(selectedSale.gateway_paid_amount) }}
                                                    </div>
                                                    <div><span class="font-medium">درگاه:</span> {{
                                                        getDriverName(selectedSale.driver) }}</div>
                                                    <div><span class="font-medium">تاریخ:</span> {{
                                                        formatDate(selectedSale.paid_at) }}</div>
                                                </div>
                                            </div>
                                            <div v-if="selectedSale.items && selectedSale.items.length > 0">
                                                <h4 class="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">آیتم‌های خرید</h4>
                                                <div class="rounded-xl bg-gray-100/80 dark:bg-gray-800/80 p-4 space-y-2">
                                                    <div v-for="item in selectedSale.items" :key="item.id"
                                                        class="text-sm border-b pb-2 last:border-b-0">
                                                        <div class="font-medium">{{ item.payable?.title || 'نامشخص' }}
                                                        </div>
                                                        <div class="text-gray-500">{{ item.payable_type }}</div>
                                                        <div class="flex items-center justify-between">
                                                            <div>
                                                                <div class="font-semibold text-gray-800 dark:text-gray-100">{{
                                                                    formatCurrency(item.final_price) }}</div>
                                                                <div v-if="item.discount_amount > 0"
                                                                    class="text-xs text-gray-500 mt-1">
                                                                    تخفیف: {{ formatCurrency(item.discount_amount) }}
                                                                </div>
                                                            </div>
                                                            <div v-if="item.discount_code" class="text-xs">
                                                                <span
                                                                    class="font-semibold text-gray-800 dark:text-gray-100">{{
                                                                        item.discount_code }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
import ComparisonBarChart from "@/views/components/chart/ComparisonBarChart.vue";
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
        ComparisonLineChart,
        ComparisonBarChart,
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
            if (this.selectedPaymentMethod.slug !== 'all') chips.push(`روش: ${this.selectedPaymentMethod.title}`);
            if (this.selectedDriver.slug !== 'all') chips.push(`درگاه: ${this.selectedDriver.title}`);
            if (this.selectedPayableType.slug !== 'all') chips.push(`نوع: ${this.selectedPayableType.title}`);
            if (this.searchQuery) chips.push(`جستجو: ${this.searchQuery}`);
            if (this.amountMin) chips.push(`حداقل: ${this.formatCurrency(this.amountMin)}`);
            if (this.amountMax) chips.push(`حداکثر: ${this.formatCurrency(this.amountMax)}`);
            return chips;
        },
        activeFilterCount() {
            return this.activeFilterChips.length;
        },
        discountRate() {
            if (!this.stats?.total_sales) return 0;
            return Math.round((this.stats.total_discount / this.stats.total_sales) * 100);
        },
        dailySalesSummary() {
            if (!this.stats?.daily_sales?.length) return 'بدون داده روزانه';
            const totalCount = this.stats.daily_sales.reduce((sum, d) => sum + (d.count || 0), 0);
            return `${totalCount} تراکنش در ${this.stats.daily_sales.length} روز`;
        },
        dailyAverageSales() {
            if (!this.stats?.daily_sales?.length) return 0;
            const total = this.stats.daily_sales.reduce((sum, d) => sum + (d.total || 0), 0);
            return Math.round(total / this.stats.daily_sales.length);
        },
        topPaymentMethod() {
            const methods = this.stats?.sales_by_method || [];
            if (!methods.length) return { label: '—', total: 0 };
            const top = [...methods].sort((a, b) => b.total - a.total)[0];
            return {
                label: this.getPaymentMethodName(top.method),
                total: top.total,
            };
        },
        topDriver() {
            const drivers = this.stats?.sales_by_driver || [];
            if (!drivers.length) return { label: '—', total: 0 };
            const top = [...drivers].sort((a, b) => b.total - a.total)[0];
            return { label: this.getDriverName(top.driver), total: top.total };
        },
        topProductType() {
            const types = this.stats?.sales_by_type || [];
            if (!types.length) return { label: '—', total: 0 };
            const top = [...types].sort((a, b) => b.total - a.total)[0];
            const labels = { Course: 'دوره', Path: 'مسیر', Plan: 'پلن' };
            return { label: labels[top.type] || top.type, total: top.total };
        },
        salesDailyComparisonChart() {
            const dc = this.stats?.daily_comparison;
            if (!dc) return { labels: [], datasets: [] };
            const isAmount = this.compareChartMode === 'amount';
            return {
                labels: dc.labels || [],
                datasets: [
                    { label: 'دوره فعلی', data: isAmount ? dc.current_amount : dc.current_count, lineColor: 'rgba(34,197,94,1)', fillColor: 'rgba(34,197,94,0.15)' },
                    { label: 'دوره قبل', data: isAmount ? dc.previous_amount : dc.previous_count, lineColor: 'rgba(107,114,128,0.9)', fillColor: 'rgba(107,114,128,0.08)', fill: false },
                ],
            };
        },
        salesTypeChart() {
            const types = this.stats?.sales_by_type || [];
            const labels = { Course: 'دوره', Path: 'مسیر', Plan: 'پلن' };
            return {
                labels: types.map(t => labels[t.type] || t.type),
                datasets: [{ label: 'فروش', data: types.map(t => t.total), color: 'rgba(139,92,246,0.85)', hoverColor: 'rgba(139,92,246,1)' }],
            };
        },
        salesInsightCards() {
            const ins = this.stats?.insights;
            if (!ins) return [];
            return [
                { label: 'میانگین هر خریدار', value: this.formatCurrency(ins.avg_per_buyer) + ' تومان', dir: 'ltr' },
                { label: 'تراکنش به ازای خریدار', value: ins.avg_transactions_per_buyer },
                { label: 'روز اوج فروش', value: ins.peak_day, sub: this.formatCurrency(ins.peak_day_total) + ' تومان' },
                { label: 'ساعت اوج', value: ins.peak_hour, sub: ins.peak_hour_count + ' تراکنش', dir: 'ltr' },
                { label: 'نرخ تخفیف', value: ins.discount_rate + '٪' },
                { label: 'میانگین روزانه', value: this.formatCurrency(this.dailyAverageSales) + ' تومان', dir: 'ltr' },
            ];
        },
        salesHourlyChart() {
            return {
                labels: (this.stats?.hourly || []).map(h => h.label),
                data: (this.stats?.hourly || []).map(h => h.count),
            };
        },
        salesMonthlyChart() {
            return {
                labels: (this.stats?.monthly || []).map(m => m.label),
                data: (this.stats?.monthly || []).map(m => m.total),
            };
        },
        topCoursesChart() {
            const rows = (this.analytics?.top_courses || []).slice().reverse();
            return {
                labels: rows.map(c => c.title),
                data: rows.map(c => c.total_revenue),
            };
        },
        salesHeatmapMap() {
            const map = {};
            (this.stats?.heatmap?.cells || []).forEach(c => { map[`${c.weekday}-${c.hour}`] = c; });
            return map;
        },
        salesHeatmapMax() {
            return this.stats?.heatmap?.max || 1;
        },
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentMethodSlug = urlParams.get('payment_method') || 'all';
        const driverSlug = urlParams.get('driver') || 'all';

        const paymentMethods = [
            { slug: 'all', title: 'همه' },
            { slug: 'wallet', title: 'کیف پول' },
            { slug: 'bank', title: 'درگاه بانکی' },
            { slug: 'wallet_bank', title: 'کیف پول + درگاه' }
        ];

        const drivers = [
            { slug: 'all', title: 'همه' },
            { slug: 'zarinpal', title: 'زرین‌پال' },
            { slug: 'digipay', title: 'دیجی‌پی' },
            { slug: 'zibal', title: 'زیبال' },
            { slug: 'payir', title: 'پی‌آی‌آر' },
            { slug: 'idpay', title: 'آیدی‌پی' }
        ];

        const sortOptions = [
            { slug: 'newest', title: 'جدیدترین' },
            { slug: 'oldest', title: 'قدیمی‌ترین' },
            { slug: 'amount_high', title: 'بیشترین مبلغ' },
            { slug: 'amount_low', title: 'کمترین مبلغ' }
        ];

        const payableTypes = [
            { slug: 'all', title: 'همه' },
            { slug: 'Course', title: 'دوره' },
            { slug: 'Path', title: 'مسیر' },
            { slug: 'Plan', title: 'پلن' }
        ];

        const datePresets = [
            { slug: 'today', title: 'امروز', days: 0 },
            { slug: 'week', title: 'این هفته', days: 7 },
            { slug: 'month', title: 'این ماه', isMonth: true },
            { slug: '30d', title: '۳۰ روز گذشته', days: 30 },
            { slug: '90d', title: '۹۰ روز گذشته', days: 90 }
        ];

        const selectedPaymentMethod = paymentMethods.find(m => m.slug === paymentMethodSlug) || paymentMethods[0];
        const selectedDriver = drivers.find(d => d.slug === driverSlug) || drivers[0];
        const selectedSort = sortOptions.find(s => s.slug === (urlParams.get('sort') || 'newest')) || sortOptions[0];
        const selectedPayableType = payableTypes.find(t => t.slug === (urlParams.get('payable_type') || 'all')) || payableTypes[0];

        return {
            loading: false,
            items: [],
            pagination: {},
            stats: null,
            currentPage: parseInt(urlParams.get('page')) || 1,
            // perPage is no longer in URL, use default or keep from previous session
            perPage: 20,
            perPages: [5, 10, 20, 30, 50, 100],
            dateFrom: urlParams.get('date_from') || '',
            dateTo: urlParams.get('date_to') || '',
            searchQuery: urlParams.get('search') || '',
            selectedPaymentMethod,
            paymentMethods,
            selectedDriver,
            drivers,
            selectedSort,
            sortOptions,
            selectedPayableType,
            payableTypes,
            datePresets,
            showAdvancedFilters: false,
            amountMin: urlParams.get('amount_min') ? parseInt(urlParams.get('amount_min')) : null,
            amountMax: urlParams.get('amount_max') ? parseInt(urlParams.get('amount_max')) : null,
            showDetailsModal: false,
            selectedSale: null,
            mounted: false,
            analytics: null,
            selectedTab: 'stats',
            salesTabs: [
                { id: 'stats', label: 'آمار کلی' },
                { id: 'compare', label: 'مقایسه دوره‌ها' },
                { id: 'insights', label: 'بینش‌ها' },
                { id: 'heatmap', label: 'نقشه حرارتی' },
                { id: 'transactions', label: 'لیست تراکنشات' },
                { id: 'courses', label: 'دوره‌ها' },
                { id: 'paths', label: 'مسیرها' },
                { id: 'plans', label: 'پلن‌ها' },
                { id: 'users', label: 'کاربران' },
                { id: 'categories', label: 'دسته‌بندی‌ها' },
                { id: 'levels', label: 'سطح‌ها' },
                { id: 'teachers', label: 'مدرسین' },
                { id: 'discounts', label: 'کدهای تخفیف' },
            ],
            isInitializing: true,
            chartMode: 'amount',
            compareChartMode: 'amount',
            weekdayLabels: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
            fetchError: null,
            refreshing: false,
            defaultAvatar: 'https://static.zanburak.ir/images/avatar/default.png',
            defaultPoster: 'https://static.zanburak.ir/images/cover/default.png',
        };
    },
    methods: {
        tabButtonClass(id) {
            return this.selectedTab === id
                ? 'text-gray-700 dark:text-black bg-yellow-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/60';
        },

        handleImageError(event, type = 'avatar') {
            event.target.onerror = null;
            event.target.src = type === 'poster' ? this.defaultPoster : this.defaultAvatar;
        },

        handleSearch: debounce(function () {
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        }, 1000),

        applyFilters() {
            this.currentPage = 1;
            this.updateUrlAndFetchData();
            this.fetchStats();
            this.fetchAnalytics();
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
            this.selectedPaymentMethod = this.paymentMethods[0];
            this.selectedDriver = this.drivers[0];
            this.selectedSort = this.sortOptions[0];
            this.selectedPayableType = this.payableTypes[0];
            this.amountMin = null;
            this.amountMax = null;
            this.datePresets.forEach(p => p.active = false);
            this.currentPage = 1;
            this.updateUrlAndFetchData();
            this.fetchStats();
            this.fetchAnalytics();
        },

        updateUrlAndFetchData() {
            const query = {
                // Only add page to URL if it's greater than 1
                ...(this.currentPage > 1 ? { page: this.currentPage } : {}),
                // perPage should NOT be in URL, only sent to backend
                payment_method: this.selectedPaymentMethod.slug !== 'all' ? this.selectedPaymentMethod.slug : undefined,
                driver: this.selectedDriver.slug !== 'all' ? this.selectedDriver.slug : undefined,
                date_from: this.dateFrom || undefined,
                date_to: this.dateTo || undefined,
                search: this.searchQuery || undefined,
                sort: this.selectedSort.slug !== 'newest' ? this.selectedSort.slug : undefined,
                payable_type: this.selectedPayableType.slug !== 'all' ? this.selectedPayableType.slug : undefined,
                amount_min: this.amountMin || undefined,
                amount_max: this.amountMax || undefined
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
            this.fetchSales();
        },

        async fetchSales() {
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
                if (this.selectedPaymentMethod.slug !== 'all') params.payment_method = this.selectedPaymentMethod.slug;
                if (this.selectedDriver.slug !== 'all') params.driver = this.selectedDriver.slug;
                if (this.selectedPayableType.slug !== 'all') params.payable_type = this.selectedPayableType.slug;
                if (this.amountMin) params.amount_min = this.amountMin;
                if (this.amountMax) params.amount_max = this.amountMax;

                const response = await axiosInstance.post('/admin/sales-report', params);
                if (response.data.message === 'Success') {
                    this.items = response.data.sales || [];
                    this.pagination = response.data.pagination || {
                        current_page: 1,
                        last_page: 1,
                        per_page: this.perPage,
                        total: 0
                    };
                }
            } catch (error) {
                console.error('Error fetching sales:', error);
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
                if (this.selectedPaymentMethod.slug !== 'all') params.payment_method = this.selectedPaymentMethod.slug;
                if (this.selectedDriver.slug !== 'all') params.driver = this.selectedDriver.slug;

                const response = await axiosInstance.get('/admin/sales-report/stats', { params });
                if (response.data.message === 'Success') {
                    this.stats = response.data.stats;
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                this.fetchError = 'خطا در دریافت آمار فروش.';
            }
        },

        async fetchAnalytics() {
            try {
                const params = {};
                if (this.dateFrom) params.date_from = this.dateFrom;
                if (this.dateTo) params.date_to = this.dateTo;
                if (this.selectedPaymentMethod.slug !== 'all') params.payment_method = this.selectedPaymentMethod.slug;
                if (this.selectedDriver.slug !== 'all') params.driver = this.selectedDriver.slug;

                const response = await axiosInstance.get('/admin/sales-report/analytics', { params });
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
            } finally {
                this.refreshing = false;
            }
        },

        salesHeatmapCount(day, hour) {
            return this.salesHeatmapMap[`${day}-${hour}`]?.count || 0;
        },
        salesHeatmapTitle(day, hour) {
            const cell = this.salesHeatmapMap[`${day}-${hour}`];
            const count = cell?.count || 0;
            return `${this.weekdayLabels[day - 1]} ${String(hour).padStart(2, '0')}:00 — ${count} تراکنش`;
        },
        salesHeatmapStyle(day, hour) {
            const count = this.salesHeatmapCount(day, hour);
            const ratio = this.salesHeatmapMax > 0 ? count / this.salesHeatmapMax : 0;
            const alpha = count > 0 ? 0.15 + ratio * 0.85 : 0.04;
            return { backgroundColor: `rgba(34, 197, 94, ${alpha})` };
        },

        async exportSales() {
            try {
                const params = {};
                if (this.dateFrom) params.date_from = this.dateFrom;
                if (this.dateTo) params.date_to = this.dateTo;
                if (this.selectedDriver.slug !== 'all') params.driver = this.selectedDriver.slug;
                if (this.selectedPaymentMethod.slug !== 'all') params.payment_method = this.selectedPaymentMethod.slug;

                const response = await axiosInstance.get('/admin/sales-report/export', { params });
                // Convert to CSV and download
                const csv = this.convertToCSV(response.data.data);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
            } catch (error) {
                console.error('Error exporting sales:', error);
            }
        },

        convertToCSV(data) {
            if (!data || data.length === 0) return '';
            const headers = Object.keys(data[0]);
            const rows = data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','));
            return [headers.join(','), ...rows].join('\n');
        },

        viewDetails(item) {
            this.selectedSale = item;
            this.showDetailsModal = true;
        },

        closeDetailsModal() {
            this.showDetailsModal = false;
            this.selectedSale = null;
        },

        updatePage(page) {
            this.currentPage = page;
            this.updateUrlAndFetchData();
        },

        formatCurrency(amount) {
            if (!amount) return 0;
            return new Intl.NumberFormat('fa-IR').format(amount);
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

        getDriverName(driver) {
            const driverNames = {
                'zarinpal': 'زرین‌پال',
                'digipay': 'دیجی‌پی',
                'zibal': 'زیبال',
                'payir': 'پی‌آی‌آر',
                'idpay': 'آیدی‌پی',
                'admin': 'ادمین'
            };
            return driverNames[driver] || driver || 'نامشخص';
        },

        getPaymentMethodName(method) {
            const methodNames = {
                'wallet': 'کیف پول',
                'bank': 'پرداخت بانکی',
                'wallet_bank': 'کیف پول + درگاه'
            };
            return methodNames[method] || method || 'نامشخص';
        }
    },
    watch: {
        selectedPaymentMethod(newVal, oldVal) {
            if (this.mounted && newVal !== oldVal) {
                this.applyFilters();
            }
        },
        selectedDriver(newVal, oldVal) {
            if (this.mounted && newVal !== oldVal) {
                this.applyFilters();
            }
        },
        selectedSort(newVal, oldVal) {
            if (this.mounted && newVal !== oldVal) {
                this.applyFilters();
            }
        },
        selectedPayableType(newVal, oldVal) {
            if (this.mounted && newVal !== oldVal) {
                this.applyFilters();
            }
        },
        // perPage watcher removed - handled directly in selectPerpage method
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
                    const paymentMethodSlug = this.$route.query.payment_method || 'all';
                    const driverSlug = this.$route.query.driver || 'all';
                    const sortSlug = this.$route.query.sort || 'newest';
                    const payableTypeSlug = this.$route.query.payable_type || 'all';

                    this.selectedPaymentMethod = this.paymentMethods.find(m => m.slug === paymentMethodSlug) || this.paymentMethods[0];
                    this.selectedDriver = this.drivers.find(d => d.slug === driverSlug) || this.drivers[0];
                    this.selectedSort = this.sortOptions.find(s => s.slug === sortSlug) || this.sortOptions[0];
                    this.selectedPayableType = this.payableTypes.find(t => t.slug === payableTypeSlug) || this.payableTypes[0];
                    this.amountMin = this.$route.query.amount_min ? parseInt(this.$route.query.amount_min) : null;
                    this.amountMax = this.$route.query.amount_max ? parseInt(this.$route.query.amount_max) : null;

                    this.fetchSales();
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
                this.fetchStats();
            }
        },
        dateTo() {
            if (this.mounted) {
                this.currentPage = 1;
                this.updateUrlAndFetchData();
                this.fetchStats();
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
            // Don't call fetchSales here as it will be called after URL update by the watcher
            // But we need to prevent watcher from running, so we'll handle it manually
            this.isInitializing = true;
            const query = {
                ...(this.currentPage > 1 ? { page: this.currentPage } : {}),
                payment_method: this.selectedPaymentMethod.slug !== 'all' ? this.selectedPaymentMethod.slug : undefined,
                driver: this.selectedDriver.slug !== 'all' ? this.selectedDriver.slug : undefined,
                date_from: this.dateFrom || undefined,
                date_to: this.dateTo || undefined,
                search: this.searchQuery || undefined,
                sort: this.selectedSort.slug !== 'newest' ? this.selectedSort.slug : undefined,
                payable_type: this.selectedPayableType.slug !== 'all' ? this.selectedPayableType.slug : undefined,
                amount_min: this.amountMin || undefined,
                amount_max: this.amountMax || undefined
            };

            Object.keys(query).forEach(key => {
                if (query[key] === undefined) {
                    delete query[key];
                }
            });

            await this.$router.push({ query });
            this.isInitializing = false;
            await this.fetchSales();
        } else {
            // Load from URL if filters exist, otherwise just fetch with defaults
            if (Object.keys(this.$route.query).length > 0) {
                // Update data from URL
                this.currentPage = parseInt(this.$route.query.page) || 1;
                this.searchQuery = this.$route.query.search || '';
                this.dateFrom = this.$route.query.date_from || '';
                this.dateTo = this.$route.query.date_to || '';

                const paymentMethodSlug = this.$route.query.payment_method || 'all';
                const driverSlug = this.$route.query.driver || 'all';
                const sortSlug = this.$route.query.sort || 'newest';
                const payableTypeSlug = this.$route.query.payable_type || 'all';

                this.selectedPaymentMethod = this.paymentMethods.find(m => m.slug === paymentMethodSlug) || this.paymentMethods[0];
                this.selectedDriver = this.drivers.find(d => d.slug === driverSlug) || this.drivers[0];
                this.selectedSort = this.sortOptions.find(s => s.slug === sortSlug) || this.sortOptions[0];
                this.selectedPayableType = this.payableTypes.find(t => t.slug === payableTypeSlug) || this.payableTypes[0];
                this.amountMin = this.$route.query.amount_min ? parseInt(this.$route.query.amount_min) : null;
                this.amountMax = this.$route.query.amount_max ? parseInt(this.$route.query.amount_max) : null;
            }

            await this.fetchSales();
        }

        await this.fetchStats();
        await this.fetchAnalytics();
        this.isInitializing = false;
    }
};
</script>
