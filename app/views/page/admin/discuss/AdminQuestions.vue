<template>
    <AdminMasterPage>
        
        <template #breadcrumb-actions>
                    <button @click.prevent="openCreateModal"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                افزودن سوال
                                <svg class="w-5 h-5 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
                        </span></button>
                    <router-link :to="{ name: 'admin-question-categories' }"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                دسته‌بندی‌ها
                                <svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                    <path d="M3 7L12 14L21 7" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
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
                            placeholder="جستجو در سوالات..." />
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
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">دسته‌بندی:</div>
                        <select v-model="selectedCategoryId" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[8rem]">
                            <option :value="null">همه</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">انتشار:</div>
                        <select v-model="selectedPublish" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option :value="null">همه</option>
                            <option :value="true">منتشر شده</option>
                            <option :value="false">پیش‌نویس</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">نوع:</div>
                        <select v-model="selectedIsPrivate" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option :value="null">همه</option>
                            <option :value="false">عمومی</option>
                            <option :value="true">خصوصی</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">بهترین پاسخ:</div>
                        <select v-model="selectedHasBestAnswer" @change="onFilterChange"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option :value="null">همه</option>
                            <option :value="true">دارد</option>
                            <option :value="false">ندارد</option>
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

            <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
                <label v-if="!loading && questions.length" class="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                    انتخاب همه
                </label>
                <div v-else class="flex-1"></div>
                <div class="flex flex-wrap items-center justify-end gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-gray-400 dark:bg-gray-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">پیش‌نویس</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-emerald-400 dark:bg-emerald-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">منتشر شده</span>
                </div>
                </div>
            </div>

            <AdminBulkActionBar :count="selectedIds.length">
                <select v-model="bulkAction"
                    class="h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[9rem]">
                    <option value="">انتخاب عملیات...</option>
                    <option value="publish">انتشار</option>
                    <option value="unpublish">پیش‌نویس</option>
                    <option value="delete">حذف</option>
                </select>
                <button type="button" @click="executeBulkAction" :disabled="!bulkAction || bulkLoading"
                    class="h-8 px-3 text-xs font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:opacity-50">
                    {{ bulkLoading ? 'در حال پردازش...' : 'اجرا' }}
                </button>
                <button type="button" @click="clearBulkSelection"
                    class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    لغو انتخاب
                </button>
            </AdminBulkActionBar>

            <div id="data-list">
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 w-10"></th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">کاربر</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start lg:min-w-[14rem]">سوال</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">دسته‌بندی</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">پاسخ‌ها</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">نوع</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">پاسخ برتر</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="question in questions" :key="question.id"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="relative ps-2 pe-2 py-3" @click.stop>
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                        :class="getPublishBarClass(question)"></div>
                                    <AdminBulkCheckbox v-model="selectedIds" :value="question.id" />
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div v-if="question.user" class="flex items-center">
                                        <div
                                            class="flex-shrink-0 w-9 h-9 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-200 border-opacity-30 dark:border-opacity-10 overflow-hidden">
                                            <img onerror="this.style.display='none'" v-if="question.user.profile_pic"
                                                :src="question.user.profile_pic" :alt="question.user.first_name"
                                                class="w-full h-full object-cover" />
                                            <div v-else class="w-full h-full flex items-center justify-center">
                                                <span class="text-amber-400 text-sm font-medium">{{
                                                    question.user.first_name?.charAt(0) || '?' }}</span>
                                            </div>
                                        </div>
                                        <div class="ms-2 min-w-0">
                                            <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {{ question.user.first_name }} {{ question.user.last_name }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                @{{ question.user.username || '-' }}
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-xs text-gray-400">-</div>
                                </td>
                                <td class="px-1 py-3 text-start lg:min-w-[14rem]">
                                    <div class="max-w-xs min-w-0">
                                        <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                            {{ question.subject }}
                                        </div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 question-preview"
                                            v-html="question.question"></div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div v-if="question.category"
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1 w-max">
                                        {{ question.category.title }}
                                    </div>
                                    <div v-else class="text-xs text-gray-400">-</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg w-max font-anjoman">
                                        {{ question.answers_count || 0 }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium px-2 py-1 rounded-lg line-clamp-1 w-max"
                                        :class="question.is_private
                                            ? 'text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-900/20'
                                            : 'text-gray-700 dark:text-gray-300 bg-gray-100/70 dark:bg-gray-800/50'">
                                        {{ question.is_private ? 'خصوصی' : 'عمومی' }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium px-2 py-1 rounded-lg line-clamp-1 w-max"
                                        :class="question.has_best_answer
                                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/20'
                                            : 'text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50'">
                                        {{ question.has_best_answer ? 'دارد' : 'ندارد' }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                        {{ formatDate(question.created_at) }}
                                    </div>
                                </td>
                                <td class="relative px-1 py-3 whitespace-nowrap text-center">
                                    <Popover class="group flex items-center justify-center">
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
                                                        <button type="button" @click="viewQuestion(question)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            مشاهده
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" @click="editQuestion(question)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            ویرایش
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" @click="togglePublish(question)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            {{ question.publish ? 'تبدیل به پیش‌نویس' : 'انتشار سوال' }}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" @click="openDeleteModal(question)"
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
                            <tr v-if="!loading && questions.length === 0">
                                <td colspan="9" class="px-4 py-12 text-center">
                                    <div class="text-gray-400 dark:text-gray-500 text-sm font-medium">سوالی یافت نشد</div>
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

            <!-- Create/Edit Question Bottom Sheet -->
            <BottomSheetDrawer v-model="showQuestionModal" :initialHeight="0.85" :maxHeight="0.95" :minHeight="0.6"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[48rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ questionMode === 'create' ? 'افزودن سوال جدید' : 'ویرایش سوال' }}
                    </h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeQuestionModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 sm:mt-0 w-full">
                        <div v-if="questionFormFetchLoading"
                            class="py-16 flex flex-col items-center justify-center gap-3 text-center">
                            <svg class="w-8 h-8 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">لطفا منتظر بمانید...</p>
                            <p class="text-xs font-medium text-gray-400 dark:text-gray-500">در حال دریافت اطلاعات سوال</p>
                        </div>
                        <form v-else @submit.prevent="submitQuestionForm" class="space-y-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">کاربر</label>
                                <div v-if="selectedUser && !userSearchEditing"
                                    class="flex items-center gap-3 p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <div
                                        class="shrink-0 w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                                        <img v-if="selectedUser.profile_pic" :src="selectedUser.profile_pic"
                                            :alt="selectedUser.first_name" class="w-full h-full object-cover"
                                            onerror="this.style.display='none'" />
                                        <span v-else class="text-sm font-semibold text-yellow-500 dark:text-yellow-400">
                                            {{ selectedUser.first_name?.charAt(0) || '?' }}
                                        </span>
                                    </div>
                                    <div class="min-w-0 flex-1 text-start">
                                        <div class="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                                            {{ selectedUser.first_name }} {{ selectedUser.last_name }}
                                        </div>
                                        <div class="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                                            @{{ selectedUser.username || '-' }}
                                        </div>
                                    </div>
                                    <button type="button" @click="startUserSearch"
                                        class="shrink-0 text-[11px] font-semibold text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 px-2 py-1 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-400/10 transition-colors">
                                        تغییر
                                    </button>
                                </div>
                                <div v-else class="relative">
                                    <input type="text" v-model="questionForm.user_search" @input="handleUserSearch"
                                        @focus="handleUserFocus" @blur="handleUserBlur"
                                        :class="[
                                            'bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white',
                                            questionFormErrors.user_id ? 'focus:ring-red-500 ring-1 ring-red-500' : 'focus:ring-yellow-500'
                                        ]"
                                        placeholder="جستجوی کاربر (حداقل 3 حرف)..." />
                                    <div v-if="userSearchLoading" class="absolute end-3 top-3">
                                        <svg class="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                    <div v-if="showUserDropdown && userSearchResults.length > 0"
                                        class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                                        <div v-for="user in userSearchResults" :key="user.id"
                                            @mousedown.prevent="selectUser(user)"
                                            class="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/80 cursor-pointer flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                            <div
                                                class="shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200/60 dark:border-gray-600">
                                                <img v-if="user.profile_pic" :src="user.profile_pic" :alt="user.first_name"
                                                    class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                                <div v-else
                                                    class="w-full h-full flex items-center justify-center text-xs font-semibold text-amber-500">
                                                    {{ user.first_name?.charAt(0) || '?' }}
                                                </div>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                    {{ user.first_name }} {{ user.last_name }}
                                                </div>
                                                <div class="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                                                    @{{ user.username }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="showUserDropdown && questionForm.user_search.length >= 3 && !userSearchLoading && userSearchResults.length === 0"
                                        class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg p-4 text-center text-xs text-gray-500 dark:text-gray-400">
                                        کاربری یافت نشد
                                    </div>
                                </div>
                                <p v-if="questionFormErrors.user_id" class="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {{ questionFormErrors.user_id[0] }}
                                </p>
                            </div>
                                        <div>
                                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">دسته‌بندی</label>
                                            <select v-model.number="questionForm.category_id" required
                                                :class="[
                                                    'bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:text-white',
                                                    questionFormErrors.category_id ? 'focus:ring-red-500 ring-1 ring-red-500' : 'focus:ring-yellow-500'
                                                ]">
                                                <option :value="null">انتخاب دسته‌بندی</option>
                                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                                            </select>
                                            <p v-if="questionFormErrors.category_id" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ questionFormErrors.category_id[0] }}</p>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">موضوع</label>
                                            <input v-model="questionForm.subject" type="text" required
                                                :class="[
                                                    'bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:text-white',
                                                    questionFormErrors.subject ? 'focus:ring-red-500 ring-1 ring-red-500' : 'focus:ring-yellow-500'
                                                ]" />
                                            <p v-if="questionFormErrors.subject" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ questionFormErrors.subject[0] }}</p>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">سوال</label>
                                            <EditorComponent
                                                :previewClass="['bg-gray-100', 'dark:bg-gray-800']"
                                                :bodyClass="['bg-gray-50', 'dark:bg-gray-700', 'rounded-xl', 'text-gray-700', 'dark:text-gray-100']"
                                                :focusedBorder="'1px #f59e0b solid'"
                                                :errorBorder="'1px #ef4444 solid'"
                                                :submitButton="false"
                                                :cancelButton="false"
                                                :errors="questionFormErrors.question ? questionFormErrors.question[0] : ''"
                                                v-model="questionForm.question"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">کلمات کلیدی (با کاما جدا کنید)</label>
                                            <input v-model="questionForm.meta_keywords" type="text"
                                                :class="[
                                                    'bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white',
                                                    questionFormErrors.meta_keywords ? 'focus:ring-red-500 ring-1 ring-red-500' : 'focus:ring-yellow-500'
                                                ]"
                                                placeholder="کلمه کلیدی 1, کلمه کلیدی 2, ..." />
                                            <p v-if="questionFormErrors.meta_keywords" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ questionFormErrors.meta_keywords[0] }}</p>
                                        </div>
                                        <div
                                            class="p-3 flex flex-wrap items-center gap-x-6 gap-y-3 bg-gray-100/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input v-model="questionForm.is_private" type="checkbox"
                                                    @change="handlePrivateChange" class="sr-only peer" />
                                                <div
                                                    class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500">
                                                </div>
                                                <span class="ms-3 text-xs font-semibold text-gray-700 dark:text-gray-200">سوال خصوصی</span>
                                            </label>
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input v-model="questionForm.publish" type="checkbox" class="sr-only peer" />
                                                <div
                                                    class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400">
                                                </div>
                                                <span class="ms-3 text-xs font-semibold text-gray-700 dark:text-gray-200">منتشر شده</span>
                                            </label>
                                        </div>
                                        <div v-if="questionForm.is_private">
                                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">کاربران مجاز (چندتایی)</label>
                                            <div class="relative">
                                                <input type="text" v-model="allowedUsersSearch" @input="handleAllowedUsersSearch" @focus="handleAllowedUsersFocus" @blur="handleAllowedUsersBlur"
                                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                                    placeholder="جستجوی کاربران مجاز (حداقل 3 حرف)...">
                                                <div v-if="allowedUsersSearchLoading" class="absolute left-3 top-3">
                                                    <svg class="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                                <div v-if="showAllowedUsersDropdown && allowedUsersSearchResults.length > 0" class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                                    <div v-for="user in allowedUsersSearchResults" :key="user.id" @mousedown.prevent="addAllowedUser(user)"
                                                        class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                                        <img v-if="user.profile_pic" :src="user.profile_pic" :alt="user.first_name" class="w-10 h-10 rounded-full object-cover">
                                                        <div v-else class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                            </svg>
                                                        </div>
                                                        <div class="flex-1">
                                                            <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ user.first_name }} {{ user.last_name }}</div>
                                                            <div class="text-xs text-gray-500 dark:text-gray-400">@{{ user.username }}</div>
                                                        </div>
                                                        <div v-if="isUserAlreadySelected(user.id)" class="text-xs text-green-600 dark:text-green-400">
                                                            ✓ انتخاب شده
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="showAllowedUsersDropdown && allowedUsersSearch.length >= 3 && !allowedUsersSearchLoading && allowedUsersSearchResults.length === 0" class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    کاربری یافت نشد
                                                </div>
                                            </div>
                                            <div v-if="selectedAllowedUsers.length > 0" class="mt-2 flex flex-wrap gap-1.5">
                                                <div v-for="user in selectedAllowedUsers" :key="user.id"
                                                    class="inline-flex items-center gap-1 ps-1 pe-1.5 py-0.5 rounded-lg bg-gray-100/70 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                                                    <div
                                                        class="shrink-0 w-5 h-5 rounded overflow-hidden bg-gray-100 dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-700/60">
                                                        <img v-if="user.profile_pic" :src="user.profile_pic"
                                                            :alt="user.first_name" class="w-full h-full object-cover"
                                                            onerror="this.style.display='none'" />
                                                        <div v-else
                                                            class="w-full h-full flex items-center justify-center text-[9px] font-semibold text-amber-400">
                                                            {{ user.first_name?.charAt(0) || '?' }}
                                                        </div>
                                                    </div>
                                                    <span
                                                        class="text-[11px] font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                                        {{ user.first_name }}
                                                        <span class="text-gray-400 dark:text-gray-500 font-normal">@{{
                                                            user.username }}</span>
                                                    </span>
                                                    <button type="button" @click="removeAllowedUser(user.id)"
                                                        class="shrink-0 -ms-0.5 p-0.5 rounded text-gray-400 hover:text-rose-500 transition-colors"
                                                        title="حذف">
                                                        <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor"
                                                            viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex justify-end gap-3 pt-6">
                                            <button type="button" @click="closeQuestionModal"
                                                class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                انصراف
                                            </button>
                                            <button type="submit" :disabled="questionFormLoading"
                                                class="px-5 py-2.5 text-sm font-semibold text-white bg-yellow-400 rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-colors shadow-lg shadow-yellow-400/30">
                                                <span v-if="questionFormLoading">در حال ذخیره...</span>
                                                <span v-else>ذخیره</span>
                                            </button>
                                        </div>
                                    </form>
                    </div>
                </div>
            </BottomSheetDrawer>

            <!-- Delete Question Bottom Sheet -->
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
                    <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">حذف سوال</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        آیا از حذف این سوال مطمئن هستید؟ تمام پاسخ‌های مربوطه نیز حذف خواهند شد.
                    </p>
                </div>
                <div class="shrink-0 -mx-4 px-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:justify-end py-3">
                        <button type="button" @click="closeDeleteModal"
                            class="w-full sm:w-auto flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors">
                            انصراف
                        </button>
                        <button type="button" @click="deleteQuestion" :disabled="deleteLoading"
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
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import { showToastSuccess, showToastError } from "@/utils/toastConfig";
import debounce from "lodash/debounce";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";

export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        PaginationComponent,
        BottomSheetDrawer,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        Popover,
        PopoverButton,
        PopoverPanel,
        PopoverOverlay,
        EditorComponent,
    },
    data() {
        return {
            questions: [],
            categories: [],
            loading: false,
            searchQuery: '',
            selectedCategoryId: null,
            selectedPublish: null,
            selectedIsPrivate: null,
            selectedHasBestAnswer: null,
            pagination: {},
            currentPage: 1,
            perPage: 15,
            perPages: [10, 15, 20, 30, 50],
            selectedIds: [],
            bulkAction: '',
            bulkLoading: false,
            showQuestionModal: false,
            showDeleteModal: false,
            questionMode: 'create',
            questionFormLoading: false,
            questionFormFetchLoading: false,
            userSearchEditing: true,
            deleteLoading: false,
            questionForDelete: null,
            editingQuestion: null,
            questionForm: {
                user_id: null,
                user_search: '',
                category_id: null,
                subject: '',
                question: '',
                meta_keywords: '',
                is_private: false,
                publish: true,
            },
            questionFormErrors: {},
            showUserDropdown: false,
            userSearchResults: [],
            selectedUser: null,
            userSearchLoading: false,
            userSearchTimeout: null,
            allowedUsersSearch: '',
            allowedUsersSearchResults: [],
            allowedUsersSearchLoading: false,
            showAllowedUsersDropdown: false,
            allowedUsersSearchTimeout: null,
            selectedAllowedUsers: [],
        };
    },
    computed: {
        isAllSelected() {
            return this.questions.length > 0 && this.selectedIds.length === this.questions.length;
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.isAllSelected;
        },
    },
    mounted() {
        this.fetchCategories();
        this.fetchQuestions().then(() => this.openEditFromQuery());
    },
    watch: {
        '$route.query.edit'(editId) {
            if (editId) {
                this.openEditFromQuery();
            }
        },
    },
    methods: {
        async openEditFromQuery() {
            const editId = this.$route.query.edit;
            if (!editId) return;
            const questionId = Number(editId) || editId;
            await this.editQuestion({ id: questionId });
            this.$router.replace({ name: 'admin-questions', query: {} });
        },
        refreshData() {
            this.fetchCategories();
            this.fetchQuestions();
        },
        onFilterChange() {
            this.currentPage = 1;
            this.fetchQuestions();
        },
        clearSearch() {
            this.searchQuery = '';
            this.currentPage = 1;
            this.fetchQuestions();
        },
        selectPerpage(per) {
            this.perPage = per;
            this.currentPage = 1;
            this.fetchQuestions();
        },
        updatePage(page) {
            this.currentPage = page;
            this.fetchQuestions();
        },
        toggleSelectAll(e) {
            this.selectedIds = e.target.checked ? this.questions.map((q) => q.id) : [];
        },
        clearBulkSelection() {
            this.selectedIds = [];
            this.bulkAction = '';
        },
        async executeBulkAction() {
            if (!this.bulkAction || !this.selectedIds.length) return;
            this.bulkLoading = true;
            try {
                const response = await axiosInstance.post('/admin/discuss/questions/bulk', {
                    ids: this.selectedIds,
                    action: this.bulkAction,
                });
                showToastSuccess(`${Number(response.data?.affected ?? this.selectedIds.length).toLocaleString('fa-IR')} مورد پردازش شد`);
                this.clearBulkSelection();
                this.fetchQuestions();
            } catch (error) {
                showToastError(error.response?.data?.message || 'خطا در عملیات گروهی');
            } finally {
                this.bulkLoading = false;
            }
        },
        getPublishBarClass(question) {
            return question.publish
                ? 'bg-emerald-400 dark:bg-emerald-600'
                : 'bg-gray-400 dark:bg-gray-600';
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
        handleSearch: debounce(function() {
            this.currentPage = 1;
            this.fetchQuestions();
        }, 500),
        async fetchCategories() {
            try {
                const response = await axiosInstance.get('/admin/question-categories/tree');
                this.categories = this.flattenCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        flattenCategories(categories, result = []) {
            categories.forEach(cat => {
                result.push(cat);
                if (cat.children && cat.children.length > 0) {
                    this.flattenCategories(cat.children, result);
                }
            });
            return result;
        },
        async fetchQuestions() {
            this.loading = true;
            try {
                const params = {
                    page: this.currentPage,
                    perPage: this.perPage,
                    search: this.searchQuery || undefined,
                    category_id: this.selectedCategoryId || undefined,
                    publish: this.selectedPublish !== null ? this.selectedPublish : undefined,
                    is_private: this.selectedIsPrivate !== null ? this.selectedIsPrivate : undefined,
                    has_best_answer: this.selectedHasBestAnswer !== null ? this.selectedHasBestAnswer : undefined,
                };
                Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
                const response = await axiosInstance.post('/admin/discuss/questions', params);
                const paginated = response.data.questions;
                this.questions = paginated.data || paginated;
                this.pagination = {
                    current_page: paginated.current_page,
                    last_page: paginated.last_page,
                    per_page: paginated.per_page,
                    total: paginated.total
                };
                this.selectedIds = [];
            } catch (error) {
                console.error('Error fetching questions:', error);
                showToastError('خطایی در دریافت اطلاعات رخ داد.');
            } finally {
                this.loading = false;
            }
        },
        clearFilters() {
            this.searchQuery = '';
            this.selectedCategoryId = null;
            this.selectedPublish = null;
            this.selectedIsPrivate = null;
            this.selectedHasBestAnswer = null;
            this.currentPage = 1;
            this.fetchQuestions();
        },
        openCreateModal() {
            this.questionMode = 'create';
            this.questionForm = {
                user_id: null,
                user_search: '',
                category_id: null,
                subject: '',
                question: '',
                meta_keywords: '',
                is_private: false,
                publish: true,
            };
            this.questionFormErrors = {};
            this.selectedUser = null;
            this.selectedAllowedUsers = [];
            this.allowedUsersSearch = '';
            this.showUserDropdown = false;
            this.showAllowedUsersDropdown = false;
            this.userSearchResults = [];
            this.allowedUsersSearchResults = [];
            this.questionFormFetchLoading = false;
            this.userSearchEditing = true;
            this.showQuestionModal = true;
        },
        async editQuestion(question) {
            this.questionMode = 'edit';
            this.editingQuestion = question;
            this.questionFormErrors = {};
            this.questionFormFetchLoading = true;
            this.userSearchEditing = false;
            this.showUserDropdown = false;
            this.showAllowedUsersDropdown = false;
            this.allowedUsersSearch = '';
            this.userSearchResults = [];
            this.allowedUsersSearchResults = [];
            this.selectedAllowedUsers = [];
            this.selectedUser = question.user || null;
            this.questionForm = {
                user_id: question.user?.id || null,
                user_search: question.user ? `${question.user.first_name} ${question.user.last_name}` : '',
                category_id: null,
                subject: '',
                question: '',
                meta_keywords: '',
                is_private: false,
                publish: true,
            };
            this.showQuestionModal = true;

            try {
                const response = await axiosInstance.get(`/admin/discuss/question/${question.id}`);
                const fullQuestion = response.data.question;
                
                // Ensure category_id is a number
                let categoryId = null;
                if (fullQuestion.category?.id) {
                    categoryId = parseInt(fullQuestion.category.id);
                } else if (fullQuestion.category_id) {
                    categoryId = parseInt(fullQuestion.category_id);
                } else if (question.category_id) {
                    categoryId = parseInt(question.category_id);
                } else if (question.category?.id) {
                    categoryId = parseInt(question.category.id);
                }
                
                this.questionForm = {
                    user_id: fullQuestion.user?.id || question.user?.id || null,
                    user_search: fullQuestion.user ? `${fullQuestion.user.first_name} ${fullQuestion.user.last_name}` : (question.user ? `${question.user.first_name} ${question.user.last_name}` : ''),
                    category_id: categoryId,
                    subject: fullQuestion.subject || question.subject,
                    question: fullQuestion.question || question.question,
                    meta_keywords: fullQuestion.meta_keywords || question.meta_keywords || '',
                    is_private: fullQuestion.is_private !== undefined ? fullQuestion.is_private : (question.is_private || false),
                    publish: fullQuestion.publish !== undefined ? fullQuestion.publish : (question.publish !== undefined ? question.publish : true),
                };
                
                this.selectedUser = fullQuestion.user || question.user;
                this.userSearchEditing = !this.selectedUser;
                this.showUserDropdown = false;
                
                // Load allowed users if question is private
                this.selectedAllowedUsers = [];
                if (this.questionForm.is_private && (fullQuestion.allowed_user_ids || question.allowed_user_ids)) {
                    try {
                        let userIds = [];
                        const allowedUserIds = fullQuestion.allowed_user_ids || question.allowed_user_ids;
                        
                        if (Array.isArray(allowedUserIds)) {
                            userIds = allowedUserIds.map(id => parseInt(id));
                        } else if (typeof allowedUserIds === 'string') {
                            const parsed = JSON.parse(allowedUserIds || '[]');
                            userIds = Array.isArray(parsed) ? parsed.map(id => parseInt(id)) : [];
                        }
                        
                        if (userIds.length > 0) {
                            // Use allowed_users from response if available
                            if (fullQuestion.allowed_users && Array.isArray(fullQuestion.allowed_users) && fullQuestion.allowed_users.length > 0) {
                                this.selectedAllowedUsers = fullQuestion.allowed_users.map(u => ({
                                    id: parseInt(u.id),
                                    first_name: u.first_name,
                                    last_name: u.last_name,
                                    username: u.username,
                                    profile_pic: u.profile_pic,
                                }));
                            } else {
                                // Fallback: fetch users by IDs from users endpoint
                                try {
                                    // Get all users and filter by IDs
                                    const usersResponse = await axiosInstance.post('/admin/users', {
                                        perPage: 1000, // Get more users to find matches
                                        search: '',
                                    });
                                    const allUsers = usersResponse.data.users || [];
                                    this.selectedAllowedUsers = allUsers
                                        .filter(u => userIds.includes(parseInt(u.id)))
                                        .map(u => ({
                                            id: parseInt(u.id),
                                            first_name: u.first_name,
                                            last_name: u.last_name,
                                            username: u.username,
                                            profile_pic: u.profile_pic,
                                        }));
                                } catch (err) {
                                    console.error('Error loading allowed users from users endpoint:', err);
                                    // Last resort: try to get from question data
                                    if (question.allowed_users && Array.isArray(question.allowed_users)) {
                                        this.selectedAllowedUsers = question.allowed_users.map(u => ({
                                            id: parseInt(u.id),
                                            first_name: u.first_name,
                                            last_name: u.last_name,
                                            username: u.username,
                                            profile_pic: u.profile_pic,
                                        }));
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing allowed users:', error);
                        this.selectedAllowedUsers = [];
                    }
                }
            } catch (error) {
                console.error('Error loading question details:', error);
                // Fallback to using question data directly
                let categoryId = null;
                if (question.category_id) {
                    categoryId = parseInt(question.category_id);
                } else if (question.category?.id) {
                    categoryId = parseInt(question.category.id);
                }
                
                this.questionForm = {
                    user_id: question.user?.id || null,
                    user_search: question.user ? `${question.user.first_name} ${question.user.last_name}` : '',
                    category_id: categoryId,
                    subject: question.subject,
                    question: question.question,
                    meta_keywords: question.meta_keywords || '',
                    is_private: question.is_private || false,
                    publish: question.publish !== undefined ? question.publish : true,
                };
                this.selectedUser = question.user;
                this.userSearchEditing = !this.selectedUser;
                this.selectedAllowedUsers = [];
            } finally {
                this.questionFormFetchLoading = false;
            }

            this.allowedUsersSearch = '';
            this.showAllowedUsersDropdown = false;
            this.userSearchResults = [];
            this.allowedUsersSearchResults = [];
        },
        closeQuestionModal() {
            this.showQuestionModal = false;
            this.editingQuestion = null;
            this.questionFormErrors = {};
            this.questionFormFetchLoading = false;
            this.userSearchEditing = true;
            this.showUserDropdown = false;
            this.showAllowedUsersDropdown = false;
            this.selectedAllowedUsers = [];
            this.allowedUsersSearch = '';
            this.userSearchResults = [];
            this.allowedUsersSearchResults = [];
        },
        startUserSearch() {
            this.userSearchEditing = true;
            this.selectedUser = null;
            this.questionForm.user_id = null;
            this.questionForm.user_search = '';
            this.userSearchResults = [];
            this.showUserDropdown = false;
        },
        handleUserFocus() {
            // If user has already selected someone and starts typing, show dropdown
            if (this.selectedUser) {
                // If search text doesn't match selected user, clear selection
                const expectedText = `${this.selectedUser.first_name} ${this.selectedUser.last_name}`;
                if (this.questionForm.user_search !== expectedText) {
                    this.selectedUser = null;
                    this.questionForm.user_id = null;
                }
            }
            // Show dropdown if there are results or if search is active
            if (this.questionForm.user_search.length >= 3) {
                if (this.userSearchResults.length > 0) {
                    this.showUserDropdown = true;
                } else if (!this.userSearchLoading) {
                    // Trigger search if not already loading
                    this.handleUserSearch();
                }
            }
        },
        handleUserSearch: debounce(function() {
            if (this.questionForm.user_search.length < 3) {
                this.userSearchResults = [];
                this.userSearchLoading = false;
                this.showUserDropdown = false;
                // If search is cleared, check if we should keep selected user
                if (this.selectedUser) {
                    const expectedText = `${this.selectedUser.first_name} ${this.selectedUser.last_name}`;
                    if (this.questionForm.user_search !== expectedText && this.questionForm.user_search.length === 0) {
                        // User cleared the search, clear selection
                        this.selectedUser = null;
                        this.questionForm.user_id = null;
                    }
                }
                return;
            }
            // If user is searching and has a selected user, check if search matches
            if (this.selectedUser) {
                const expectedText = `${this.selectedUser.first_name} ${this.selectedUser.last_name}`;
                if (this.questionForm.user_search !== expectedText) {
                    // User is searching for someone else, clear current selection
                    this.selectedUser = null;
                    this.questionForm.user_id = null;
                }
            }
            // Always show dropdown when searching
            this.showUserDropdown = true;
            this.userSearchLoading = true;
            axiosInstance.post('/admin/searchUser', { key: this.questionForm.user_search })
                .then((response) => {
                    this.userSearchResults = response.data.result || [];
                })
                .catch((error) => {
                    console.error('Error searching users:', error);
                    this.userSearchResults = [];
                })
                .finally(() => {
                    this.userSearchLoading = false;
                });
        }, 2000),
        handleUserBlur() {
            // Delay to allow click event on dropdown items
            setTimeout(() => {
                // Only close if user is not actively searching (less than 3 chars)
                if (this.questionForm.user_search.length < 3) {
                    this.showUserDropdown = false;
                }
            }, 200);
        },
        selectUser(user) {
            this.selectedUser = user;
            this.questionForm.user_id = user.id;
            this.questionForm.user_search = `${user.first_name} ${user.last_name}`;
            this.userSearchResults = [];
            this.showUserDropdown = false;
            this.userSearchEditing = false;
        },
        clearSelectedUser() {
            this.startUserSearch();
        },
        handleAllowedUsersFocus() {
            // Always show dropdown when focusing if there are results or search is active
            if (this.allowedUsersSearch.length >= 3 && this.allowedUsersSearchResults.length > 0) {
                this.showAllowedUsersDropdown = true;
            }
        },
        handleAllowedUsersSearch: debounce(function() {
            if (this.allowedUsersSearch.length < 3) {
                this.allowedUsersSearchResults = [];
                this.allowedUsersSearchLoading = false;
                this.showAllowedUsersDropdown = false;
                return;
            }
            // Always show dropdown when searching
            this.showAllowedUsersDropdown = true;
            this.allowedUsersSearchLoading = true;
            axiosInstance.post('/admin/searchUser', { key: this.allowedUsersSearch })
                .then((response) => {
                    this.allowedUsersSearchResults = response.data.result || [];
                })
                .catch((error) => {
                    console.error('Error searching allowed users:', error);
                    this.allowedUsersSearchResults = [];
                })
                .finally(() => {
                    this.allowedUsersSearchLoading = false;
                });
        }, 2000),
        handleAllowedUsersBlur() {
            setTimeout(() => {
                // Only close if user is not actively searching (less than 3 chars)
                if (this.allowedUsersSearch.length < 3) {
                    this.showAllowedUsersDropdown = false;
                }
            }, 200);
        },
        addAllowedUser(user) {
            if (!this.isUserAlreadySelected(user.id)) {
                this.selectedAllowedUsers.push(user);
                // Clear search but keep dropdown open for next search
                this.allowedUsersSearch = '';
                this.allowedUsersSearchResults = [];
                // Don't close dropdown - allow user to search again and add more users
            }
        },
        removeAllowedUser(userId) {
            this.selectedAllowedUsers = this.selectedAllowedUsers.filter(u => u.id !== userId);
        },
        isUserAlreadySelected(userId) {
            return this.selectedAllowedUsers.some(u => u.id === userId);
        },
        handlePrivateChange() {
            if (!this.questionForm.is_private) {
                this.selectedAllowedUsers = [];
                this.allowedUsersSearch = '';
            }
        },
        async submitQuestionForm() {
            this.questionFormLoading = true;
            try {
                const formData = { ...this.questionForm };
                delete formData.user_search;
                
                // Add allowed_user_ids if question is private
                if (formData.is_private && this.selectedAllowedUsers.length > 0) {
                    formData.allowed_user_ids = this.selectedAllowedUsers.map(u => u.id);
                } else {
                    formData.allowed_user_ids = [];
                }
                
                if (this.questionMode === 'create') {
                    await axiosInstance.post('/admin/discuss/question/create', formData);
                    showToastSuccess('سوال با موفقیت ایجاد شد.');
                } else {
                    await axiosInstance.post(`/admin/discuss/question/${this.editingQuestion.id}/update`, formData);
                    showToastSuccess('سوال با موفقیت به‌روزرسانی شد.');
                }
                this.closeQuestionModal();
                this.fetchQuestions();
            } catch (error) {
                console.error('Error submitting question form:', error);
                if (error.response?.status === 422 && error.response?.data?.errors) {
                    this.questionFormErrors = error.response.data.errors;
                } else {
                    this.questionFormErrors = {};
                    showToastError(error.response?.data?.message || 'خطایی رخ داد.');
                }
            } finally {
                this.questionFormLoading = false;
            }
        },
        viewQuestion(question) {
            this.$router.push({ name: 'admin-question-details', params: { id: question.id } });
        },
        async togglePublish(question) {
            try {
                await axiosInstance.post(`/admin/discuss/question/${question.id}/toggle-publish`);
                showToastSuccess('وضعیت انتشار با موفقیت تغییر کرد.');
                this.fetchQuestions();
            } catch (error) {
                console.error('Error toggling publish:', error);
                showToastError('خطایی در تغییر وضعیت رخ داد.');
            }
        },
        openDeleteModal(question) {
            this.questionForDelete = question;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.questionForDelete = null;
            this.showDeleteModal = false;
        },
        async deleteQuestion() {
            if (!this.questionForDelete) return;
            this.deleteLoading = true;
            try {
                await axiosInstance.delete(`/admin/discuss/question/${this.questionForDelete.id}`);
                showToastSuccess('سوال با موفقیت حذف شد.');
                this.closeDeleteModal();
                this.fetchQuestions();
            } catch (error) {
                console.error('Error deleting question:', error);
                showToastError(error.response?.data?.message || 'خطایی در حذف رخ داد.');
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
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.question-preview :deep(p),
.question-preview :deep(div) {
    display: inline;
}
.question-preview :deep(img) {
    display: none;
}
</style>

