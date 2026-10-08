<script setup>
definePageMeta({
  name: "admin-roles-list",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>

        <template #breadcrumb-actions>
            <button @click.prevent="openCreateRoleModal"
                class="group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                    class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        ایجاد نقش جدید
                        <svg class="w-[0.85rem] h-[0.85rem] ms-2" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 3a1 1 0 0 0-1 1v7H4a1 1 0 1 0 0 2h7v7a1 1 0 1 0 2 0v-7h7a1 1 0 1 0 0-2h-7V4a1 1 0 0 0-1-1z"
                                fill="currentColor"></path>
                        </svg>
                    </span>
                </span></button>
        </template>
        <div class="min-w-0">
            <!-- Search and Filters -->
            <div class="mt-6 gap-y-2 flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div class="flex">
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" ref="searchInput" id="searchKey" v-model="searchKey" @input="handleSearch"
                            class="bg-white text-gray-900 text-sm font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 p-2.5  dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white "
                            placeholder="جستجو..." />
                    </div>
                </div>
                <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                        <select v-model="selectedSort" @change.prevent="selectSort(selectedSort)"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option value="newest">جدیدترین</option>
                            <option value="oldest">قدیمی‌ترین</option>
                            <option value="name">نام (الفبا)</option>
                            <option value="most_permissions">بیشترین دسترسی</option>
                            <option value="most_users">بیشترین کاربر</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">نوع نمایش:</div>
                        <div class="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg p-0.5 h-8">
                            <button @click.prevent="selectView('grid')" title="نمای کارتی"
                                :class="selectedView === 'grid' ? 'bg-gray-800 dark:bg-gray-100 text-gray-100 dark:text-gray-800 shadow-sm' : 'text-gray-600 dark:text-gray-400'"
                                class="px-2 py-1 rounded-md text-xs font-semibold transition-colors">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            <button @click.prevent="selectView('list')" title="نمای لیستی"
                                :class="selectedView === 'list' ? 'bg-gray-800 dark:bg-gray-100 text-gray-100 dark:text-gray-800 shadow-sm' : 'text-gray-600 dark:text-gray-400'"
                                class="px-2 py-1 rounded-md text-xs font-semibold transition-colors">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
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

            <!-- Grid (card) view -->
            <div v-if="selectedView === 'grid'" id="data-list-grid">
                <div v-if="items && items.length > 0"
                    class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div v-for="(role, i) in items" :key="i"
                        class="bg-white dark:bg-gray-900 rounded-xl p-2 md:p-4 text-gray-700 dark:text-gray-100 relative">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center flex-1 min-w-0">
                                <div
                                    class="shrink-0 w-12 h-10 rounded-lg overflow-hidden bg-gray-200/40 dark:bg-gray-600 border-2 border-gray-200 dark:border-opacity-20 flex items-center justify-center">
                                    <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 52 52"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor"
                                            d="m27.3 37.6c-3-1.2-3.5-2.3-3.5-3.5 0-1.2 0.8-2.3 1.8-3.2 1.8-1.5 2.6-3.9 2.6-6.4 0-4.7-2.9-8.5-8.3-8.5s-8.3 3.8-8.3 8.5c0 2.5 0.8 4.9 2.6 6.4 1 0.9 1.8 2 1.8 3.2 0 1.2-0.5 2.3-3.5 3.5-4.4 1.8-8.6 3.8-8.7 7.6 0.2 2.6 2.2 4.8 4.7 4.8h23c2.5 0 4.5-2.2 4.5-4.7-0.1-3.8-4.3-5.9-8.7-7.7z m17.2-18.6c0-7.4-6.1-13.5-13.5-13.5v-3.5l-6.8 5.5c-0.3 0.3-0.2 0.8 0.1 1.1l6.7 5.4v-3.5c4.7 0 8.5 3.8 8.5 8.5h-3.5l5.5 6.8c0.3 0.3 0.8 0.3 1.1 0l5.4-6.8h-3.5z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="ms-2 flex-1 min-w-0">
                                    <div class="text-gray-700 dark:text-gray-100 text-sm font-semibold line-clamp-1"
                                        :title="role.label">
                                        {{ role.label }}
                                    </div>
                                    <div dir="ltr"
                                        class="mt-0.5 text-gray-500 dark:text-gray-400 text-xs font-semibold line-clamp-1 text-start"
                                        :title="role.name">
                                        {{ role.name }}
                                    </div>
                                </div>
                            </div>
                            <div class="ms-2 flex items-center space-x-1 rtl:space-x-reverse">
                                <div class="whitespace-nowrap">
                                    <button type="button" @click.prevent="openAssignments(role, 'permissions')"
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition">
                                        {{ role.permissions_count }} دسترسی | {{ role.users_count }} کاربر
                                    </button>
                                </div>
                                <div class="shrink-0">
                                    <Popover class="group relative">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                        <PopoverButton
                                            class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none flex items-center justify-center">
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                viewBox="0 0 16 16">
                                                <path
                                                    d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0">
                                                </path>
                                            </svg>
                                        </PopoverButton>
                                        <transition enter-active-class="transition duration-200 ease-out"
                                            enter-from-class="translate-y-1 opacity-0"
                                            enter-to-class="translate-y-0 opacity-100"
                                            leave-active-class="transition duration-150 ease-in"
                                            leave-from-class="translate-y-0 opacity-100"
                                            leave-to-class="translate-y-1 opacity-0">
                                            <PopoverPanel
                                                class="text-start flex flex-col z-30 mt-3 end-2 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-900 dark:divide-gray-800">
                                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                    <li>
                                                        <button type="button"
                                                            @click.prevent="openAssignments(role, 'permissions')"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">جزئیات
                                                            و تخصیص‌ها</button>
                                                    </li>
                                                    <li>
                                                        <button type="button" @click.prevent="openEditRoleModal(role)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ویرایش</button>
                                                    </li>
                                                    <li>
                                                        <button type="button" @click.prevent="openDeleteRoleModal(role)"
                                                            class="block w-full text-start px-4 py-2 text-rose-500 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">حذف</button>
                                                    </li>
                                                </ul>
                                            </PopoverPanel>
                                        </transition>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="px-2">
                    <p
                        class="mx-auto w-max mt-40 bg-white dark:bg-gray-900 rounded-lg p-2 md:p-4 px-4 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                        موردی جهت نمایش وجود ندارد!</p>
                </div>
            </div>

            <!-- Table (list) view -->
            <div v-else id="data-list">
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-2 py-3 whitespace-nowrap text-start">نقش</th>
                                <th class="px-2 py-3 whitespace-nowrap text-start">نام سیستمی</th>
                                <th class="px-2 py-3 whitespace-nowrap text-start">تخصیص‌ها</th>
                                <th class="px-2 py-3 whitespace-nowrap text-start">تاریخ ایجاد</th>
                                <th class="px-2 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="(role, index) in items" :key="index"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="px-2 py-3 whitespace-nowrap text-start">
                                    <div class="flex items-center">
                                        <div
                                            class="shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-gray-200/40 dark:bg-gray-600 border-2 border-gray-200 dark:border-opacity-20 flex items-center justify-center">
                                            <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none"
                                                viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="currentColor"
                                                    d="m27.3 37.6c-3-1.2-3.5-2.3-3.5-3.5 0-1.2 0.8-2.3 1.8-3.2 1.8-1.5 2.6-3.9 2.6-6.4 0-4.7-2.9-8.5-8.3-8.5s-8.3 3.8-8.3 8.5c0 2.5 0.8 4.9 2.6 6.4 1 0.9 1.8 2 1.8 3.2 0 1.2-0.5 2.3-3.5 3.5-4.4 1.8-8.6 3.8-8.7 7.6 0.2 2.6 2.2 4.8 4.7 4.8h23c2.5 0 4.5-2.2 4.5-4.7-0.1-3.8-4.3-5.9-8.7-7.7z m17.2-18.6c0-7.4-6.1-13.5-13.5-13.5v-3.5l-6.8 5.5c-0.3 0.3-0.2 0.8 0.1 1.1l6.7 5.4v-3.5c4.7 0 8.5 3.8 8.5 8.5h-3.5l5.5 6.8c0.3 0.3 0.8 0.3 1.1 0l5.4-6.8h-3.5z">
                                                </path>
                                            </svg>
                                        </div>
                                        <div class="ms-2">
                                            <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1"
                                                :title="role.label">
                                                {{ role.label }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap text-start">
                                    <div dir="ltr"
                                        class="inline-block text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                        {{ role.name }}
                                    </div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap text-start">
                                    <div class="flex items-center gap-1">
                                        <button type="button" @click.prevent="openAssignments(role, 'permissions')"
                                            class="flex items-center gap-1.5 text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 52 52"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill="currentColor"
                                                    d="m45.2 29.2h-8.8c-2.6 0-4.8-2.2-4.8-4.8 0.4-7.1 3.7-7.5 4-12.1 0.3-4.8-2.7-9.1-7.4-10.1-6.2-1.3-11.8 3.4-11.8 9.4 0 5.3 3.6 5.3 4 12.8 0 2.6-2.2 4.8-4.8 4.8h-8.8c-2.6 0-4.8 2.1-4.8 4.8v3.2c0 0.9 0.7 1.6 1.6 1.6h44.8c0.9 0 1.6-0.7 1.6-1.6v-3.2c0-2.7-2.2-4.8-4.8-4.8z m0.1 14.4h-38.6c-0.9 0-1.5 0.7-1.5 1.5v0.1c0 2.6 2.2 4.8 4.8 4.8h32.1c2.6 0 4.7-2.2 4.7-4.8v-0.1c0-0.8-0.7-1.5-1.5-1.5z">
                                                </path>
                                            </svg>
                                            {{ role.permissions_count }} دسترسی
                                        </button>
                                        <button type="button" @click.prevent="openAssignments(role, 'users')"
                                            class="flex items-center gap-1.5 text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                            <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 6v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-3.33-2.67-6-8-6Z" />
                                            </svg>
                                            {{ role.users_count }} کاربر
                                        </button>
                                    </div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                        {{ formatDate(role.created_at) }}
                                    </div>
                                </td>
                                <td class="relative px-2 py-3 whitespace-nowrap text-center">
                                    <div class="flex items-center justify-center">
                                        <Popover class="group relative">
                                            <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                            <PopoverButton
                                                class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none flex items-center justify-center">
                                                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fill="currentColor"
                                                        d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z" />
                                                    <path fill="currentColor"
                                                        d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z" />
                                                    <path fill="currentColor"
                                                        d="M10 2C10 0.89543 9.10457 -4.82823e-08 8 0C6.89543 4.82823e-08 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z" />
                                                </svg>
                                            </PopoverButton>
                                            <transition enter-active-class="transition duration-200 ease-out"
                                                enter-from-class="translate-y-1 opacity-0"
                                                enter-to-class="translate-y-0 opacity-100"
                                                leave-active-class="transition duration-150 ease-in"
                                                leave-from-class="translate-y-0 opacity-100"
                                                leave-to-class="translate-y-1 opacity-0">
                                                <PopoverPanel
                                                    class="text-start flex flex-col z-30 mt-3 end-6 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-900 dark:divide-gray-800">
                                                    <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                        <li>
                                                            <button type="button"
                                                                @click.prevent="openAssignments(role, 'permissions')"
                                                                class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">جزئیات
                                                                و تخصیص‌ها</button>
                                                        </li>
                                                        <li>
                                                            <button type="button"
                                                                @click.prevent="openEditRoleModal(role)"
                                                                class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ویرایش</button>
                                                        </li>
                                                        <li>
                                                            <button type="button"
                                                                @click.prevent="openDeleteRoleModal(role)"
                                                                class="block w-full text-start px-4 py-2 text-rose-500 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">حذف</button>
                                                        </li>
                                                    </ul>
                                                </PopoverPanel>
                                            </transition>
                                        </Popover>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!items || items.length === 0">
                                <td colspan="5" class="bg-white dark:bg-gray-900">
                                    <p
                                        class="mx-auto w-max my-20 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 md:p-4 px-4 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                                        موردی جهت نمایش وجود ندارد!</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-6 flex lg:flex-row flex-col items-center justify-between gap-4">
                <div>
                    <PaginationComponent v-if="pagination && pagination.last_page > 1" dir="ltr"
                        :pagination="pagination" @updatePage="updatePage" />
                </div>
                <div>
                    <select :value="perPage" @change="selectPerpage(parseInt($event.target.value))"
                        class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                        <option v-for="per in perPages" :key="per" :value="per">
                            {{ per }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Assignments Bottom Sheet -->
        <BottomSheetDrawer v-model="showAssignmentsModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.5"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">تخصیص‌های نقش</h3>
                    <p v-if="assignmentsMeta" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {{ assignmentsMeta.label }} <span dir="ltr" class="text-gray-400">({{ assignmentsMeta.name
                            }})</span>
                    </p>
                </div>
                <button type="button"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                    @click="closeAssignments">
                    <span class="sr-only">Close</span>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Tabs -->
            <div class="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4">
                <button type="button" @click="assignmentsTab = 'permissions'" :class="assignmentsTab === 'permissions'
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow'
                    : 'text-gray-500 dark:text-gray-400'"
                    class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition">
                    دسترسی‌ها
                    <span class="bg-sky-500/15 text-sky-700 dark:text-sky-300 rounded-md px-1.5 py-0.5">{{
                        assignmentsData ? assignmentsData.permissions.length : 0 }}</span>
                </button>
                <button type="button" @click="assignmentsTab = 'users'" :class="assignmentsTab === 'users'
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow'
                    : 'text-gray-500 dark:text-gray-400'"
                    class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition">
                    کاربران
                    <span class="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-md px-1.5 py-0.5">{{
                        assignmentsData ? assignmentsData.users.length : 0 }}</span>
                </button>
            </div>

            <div v-if="assignmentsLoading"
                class="py-10 text-gray-600 dark:text-gray-100 text-sm font-semibold text-center">در حال بارگذاری...
            </div>

            <div v-else-if="assignmentsData">
                <!-- Permissions tab -->
                <div v-show="assignmentsTab === 'permissions'">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">دسترسی‌هایی که به این نقش داده شده است:</p>
                    <div v-if="assignmentsData.permissions.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div v-for="permission in assignmentsData.permissions" :key="permission.id"
                            class="flex items-center bg-gray-100/70 dark:bg-gray-800/50 rounded-xl p-2">
                            <div
                                class="shrink-0 w-9 h-9 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-300 flex items-center justify-center">
                                <svg class="w-4 h-4" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor"
                                        d="m45.2 29.2h-8.8c-2.6 0-4.8-2.2-4.8-4.8 0.4-7.1 3.7-7.5 4-12.1 0.3-4.8-2.7-9.1-7.4-10.1-6.2-1.3-11.8 3.4-11.8 9.4 0 5.3 3.6 5.3 4 12.8 0 2.6-2.2 4.8-4.8 4.8h-8.8c-2.6 0-4.8 2.1-4.8 4.8v3.2c0 0.9 0.7 1.6 1.6 1.6h44.8c0.9 0 1.6-0.7 1.6-1.6v-3.2c0-2.7-2.2-4.8-4.8-4.8z m0.1 14.4h-38.6c-0.9 0-1.5 0.7-1.5 1.5v0.1c0 2.6 2.2 4.8 4.8 4.8h32.1c2.6 0 4.7-2.2 4.7-4.8v-0.1c0-0.8-0.7-1.5-1.5-1.5z">
                                    </path>
                                </svg>
                            </div>
                            <div class="ms-2 min-w-0">
                                <div class="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{{
                                    permission.label }}</div>
                                <div dir="ltr" class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 text-start">
                                    {{ permission.name }}</div>
                            </div>
                        </div>
                    </div>
                    <p v-else
                        class="text-sm text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-100/50 dark:bg-gray-800/40 rounded-xl">
                        هیچ دسترسی‌ای به این نقش داده نشده است.</p>
                </div>

                <!-- Users tab -->
                <div v-show="assignmentsTab === 'users'">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">کاربرانی که این نقش به آن‌ها داده شده است:
                    </p>
                    <div v-if="assignmentsData.users.length > 0" class="space-y-2">
                        <div v-for="user in assignmentsData.users" :key="user.id"
                            class="flex items-center bg-gray-100/70 dark:bg-gray-800/50 rounded-xl p-2">
                            <div
                                class="shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-gray-200 dark:border-opacity-20 flex items-center justify-center">
                                <img onerror="this.style.display='none'" v-if="user.profile_pic" :src="user.profile_pic"
                                    alt="" class="w-full h-full object-cover">
                                <span v-else class="text-amber-400 text-sm font-medium">{{
                                    user.first_name?.charAt(0) }}</span>
                            </div>
                            <div class="ms-2 min-w-0">
                                <div class="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{{
                                    user.first_name }} {{ user.last_name }}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">@{{ user.username }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p v-else
                        class="text-sm text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-100/50 dark:bg-gray-800/40 rounded-xl">
                        این نقش به هیچ کاربری داده نشده است.</p>
                </div>
            </div>
        </BottomSheetDrawer>

        <!-- Create/Edit Role Bottom Sheet -->
        <BottomSheetDrawer v-model="showRoleModal" :initialHeight="0.88" :maxHeight="0.95" :minHeight="0.7"
            :fitContent="false"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="bs.ADMIN_BS_PANEL"
            :contentClass="bs.ADMIN_BS_CONTENT"
            :backdropClass="bs.ADMIN_BS_BACKDROP">
            <AdminBottomSheetHeader
                :title="mode === 'create' ? 'ایجاد نقش جدید' : 'ویرایش نقش'"
                subtitle="نام نقش و دسترسی‌های مرتبط را تنظیم کنید"
                accent="violet"
                @close="closeRoleModal">
                <template #icon>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </template>
            </AdminBottomSheetHeader>
            <form class="flex flex-col flex-1 min-h-0 overflow-hidden" @submit.prevent="roleSubmit">
                <div class="shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label for="name" :class="bs.ADMIN_BS_FORM_LABEL">نام نقش (Name)</label>
                        <input type="text" id="name" v-model="form.name"
                            :class="[bs.ADMIN_BS_INPUT, errors && errors.name ? bs.ADMIN_BS_INPUT_ERROR : '']"
                            placeholder="مثال: admin" required />
                        <span v-if="errors && errors.name" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.name[0] }}</span>
                    </div>
                    <div>
                        <label for="label" :class="bs.ADMIN_BS_FORM_LABEL">برچسب نقش (Label)</label>
                        <input type="text" id="label" v-model="form.label"
                            :class="[bs.ADMIN_BS_INPUT, errors && errors.label ? bs.ADMIN_BS_INPUT_ERROR : '']"
                            placeholder="مثال: مدیر" required />
                        <span v-if="errors && errors.label" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.label[0] }}</span>
                    </div>
                </div>
                <div v-if="loadingPermissions" class="flex-1 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    در حال بارگذاری دسترسی‌ها...
                </div>
                <AdvancedMultiSelect v-else
                    v-model="selectedPermissionItems"
                    layout="panel"
                    panel-accent="sky"
                    search-placeholder="جستجوی دسترسی..."
                    empty-selection-text="هنوز دسترسی انتخاب نشده — از لیست بالا انتخاب کنید"
                    :options="permissionOptionsForSelect"
                    :closeOnSelect="false"
                    optionLabel="__display"
                    optionValue="id"
                    :enableSearch="true"
                    :enableSelectAll="true"
                    :enableClearAll="true"
                    class="flex-1 min-h-0" />
                <span v-if="errors && errors.permissions" class="shrink-0 text-rose-500 text-xs font-medium px-1 pt-1">
                    {{ errors.permissions[0] }}
                </span>
                <AdminBottomSheetActions
                    cancel-label="انصراف"
                    :submit-label="mode === 'create' ? 'ثبت و ایجاد' : 'ذخیره نقش'"
                    :loading="submitLoading"
                    @cancel="closeRoleModal"
                    @submit="roleSubmit" />
            </form>
        </BottomSheetDrawer>

        <!-- Delete Role Bottom Sheet -->
        <BottomSheetDrawer v-model="showDeleteRoleModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">حذف نقش</h3>
                <button type="button"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                    @click="closeDeleteRoleModal">
                    <span class="sr-only">Close</span>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                از حذف این نقش اطمینان کامل دارید؟
            </p>
            <div class="flex justify-end gap-3">
                <button type="button" @click="closeDeleteRoleModal"
                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    انصراف
                </button>
                <button type="button" @click="deleteRole" :disabled="deleteRoleLoading"
                    class="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors shadow-lg shadow-rose-500/30">
                    <span v-if="deleteRoleLoading">در حال حذف...</span>
                    <span v-else>حذف</span>
                </button>
            </div>
        </BottomSheetDrawer>

        <LoadingComponent v-if="loading" class="" />
    </AdminMasterPage>
</template>
<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetActions from "@/views/components/admin/bottomSheet/AdminBottomSheetActions.vue";
import AdvancedMultiSelect from "@/views/components/multiselect/AdvancedMultiSelect.vue";
import {
    ADMIN_BS_PANEL,
    ADMIN_BS_PANEL_SM,
    ADMIN_BS_CONTENT,
    ADMIN_BS_BACKDROP,
    ADMIN_BS_FORM_LABEL,
    ADMIN_BS_INPUT,
    ADMIN_BS_INPUT_ERROR,
} from "@/views/components/admin/bottomSheet/adminBottomSheetStyles";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        BottomSheetDrawer,
        AdminBottomSheetHeader,
        AdminBottomSheetActions,
        AdvancedMultiSelect,
        Popover, PopoverButton, PopoverPanel, PopoverOverlay,
        PaginationComponent
    },
    data() {
        return {
            bs: {
                ADMIN_BS_PANEL,
                ADMIN_BS_PANEL_SM,
                ADMIN_BS_CONTENT,
                ADMIN_BS_BACKDROP,
                ADMIN_BS_FORM_LABEL,
                ADMIN_BS_INPUT,
                ADMIN_BS_INPUT_ERROR,
            },
            loading: false,
            errors: null,
            items: [],
            pagination: {
                total: 0,
                per_page: 15,
                current_page: 1,
                last_page: 1,
                prev_page: null,
                next_page: null,
            },
            searchKey: '',
            searchTimeout: null,
            currentPage: 1,
            perPage: 15,
            perPages: [15, 30, 50, 100],
            selectedSort: 'newest',
            selectedView: localStorage.getItem('adminRolesView') || 'grid',
            deleteRoleLoading: false,
            showDeleteRoleModal: false,
            roleForDelete: null,
            showRoleModal: this.$route.query.createRole && this.$route.query.createRole === 'true' ? true : false,
            submitLoading: false,
            allPermissions: [],
            loadingPermissions: false,
            selectedPermissionItems: [],

            // assignments bottom sheet
            showAssignmentsModal: false,
            assignmentsLoading: false,
            assignmentsTab: 'permissions',
            assignmentsMeta: null,
            assignmentsData: null,

            mode: 'create', // create or edit
            form: {
                name: '',
                label: '',
            },
        }
    },
    methods: {
        formatDate(date) {
            if (!date) return '-';
            return new Date(date).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
            });
        },
        async getAllPermissions() {
            this.loadingPermissions = true;
            await axiosInstance
                .get("admin/permissions/all")
                .then((response) => {
                    this.allPermissions = response.data.permissions;
                })
                .catch((error) => {
                    console.error(error.response?.data?.errors);
                })
                .finally(() => {
                    this.loadingPermissions = false;
                });
        },
        async getData() {
            this.loading = true;
            const params = {
                search: this.searchKey || null,
                sort: this.selectedSort,
                page: this.currentPage,
                perPage: this.perPage,
            };
            await axiosInstance
                .post("admin/roles", params)
                .then((response) => {
                    this.items = response.data.roles;
                    this.pagination = response.data.pagination;
                })
                .catch((error) => {
                    console.error(error.response?.data?.errors);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.currentPage = 1;
                this.getData();
            }, 1000);
        },
        selectSort(value) {
            this.selectedSort = value;
            this.currentPage = 1;
            this.getData();
        },
        selectPerpage(per) {
            this.perPage = per;
            this.currentPage = 1;
            this.getData();
        },
        selectView(view) {
            this.selectedView = view;
            localStorage.setItem('adminRolesView', view);
        },
        resetFilters() {
            this.searchKey = '';
            this.selectedSort = 'newest';
            this.currentPage = 1;
            this.getData();
        },
        updatePage(page) {
            this.currentPage = page;
            this.getData();
        },
        async openAssignments(role, tab = 'permissions') {
            this.assignmentsMeta = { id: role.id, name: role.name, label: role.label };
            this.assignmentsTab = tab;
            this.assignmentsData = null;
            this.showAssignmentsModal = true;
            this.assignmentsLoading = true;
            try {
                const response = await axiosInstance.get(`admin/role/${role.id}/details`);
                this.assignmentsData = {
                    permissions: response.data.role.permissions || [],
                    users: response.data.role.users || [],
                };
            } catch (error) {
                console.error(error.response?.data?.errors);
                toast.error("خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید.", {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                this.showAssignmentsModal = false;
            } finally {
                this.assignmentsLoading = false;
            }
        },
        closeAssignments() {
            this.showAssignmentsModal = false;
            this.assignmentsData = null;
            this.assignmentsMeta = null;
        },
        openDeleteRoleModal(role) {
            this.roleForDelete = role;
            this.showDeleteRoleModal = true;
        },
        closeDeleteRoleModal() {
            this.roleForDelete = null;
            this.showDeleteRoleModal = false;
        },

        async deleteRole() {
            this.deleteRoleLoading = true;
            await axiosInstance.delete(
                `admin/role/${this.roleForDelete.id}/delete`)
                .then(() => {
                    this.items = this.items.filter(role => role.id != this.roleForDelete.id)
                    toast.success("نقش مورد نظر با موفقیت حذف شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.getData();

                }).catch((error) => {
                    this.errors = error.response?.data?.errors;
                    if (error.response?.status == '409') {
                        toast.error("امکان حذف وجود ندارد. این نقش به کاربری متصل است.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    } else {
                        toast.error("خطا! لطفا دوباره تلاش کنید.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    }

                }).finally(() => {
                    this.deleteRoleLoading = false;
                    this.closeDeleteRoleModal();
                })
        },

        openCreateRoleModal() {
            this.mode = 'create';
            this.resetRoleForm();
            this.getAllPermissions();
            this.showRoleModal = true;
        },
        openEditRoleModal(role) {
            this.mode = 'edit';
            this.form = {
                id: role.id,
                name: role.name,
                label: role.label,
            };
            this.selectedPermissionItems = role.permissions
                ? role.permissions.map((p) => ({
                    ...p,
                    __display: `${p.label} — ${p.name}`,
                }))
                : [];
            this.getAllPermissions();
            this.showRoleModal = true;
        },
        closeRoleModal() {
            this.showRoleModal = false;
        },
        resetRoleForm() {
            this.form = {
                name: '',
                label: '',
            };
            this.selectedPermissionItems = [];
            this.errors = null;
        },
        async roleSubmit() {
            this.errors = null;
            this.submitLoading = true;
            const formData = {
                name: this.form.name,
                label: this.form.label,
                permissions: this.selectedPermissionItems.map((p) => p.id),
            };

            if (this.mode === 'create') {
                await axiosInstance.post(
                    `admin/role/create`, formData
                ).then(() => {
                    toast.success("نقش جدید با موفقیت ایجاد شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeRoleModal();
                    this.getData();
                }).catch((error) => {
                    this.errors = error.response?.data?.errors;
                    console.log(error.response?.data?.errors)
                }).finally(() => {
                    this.submitLoading = false;
                })
            } else {
                await axiosInstance.post(
                    `admin/role/${this.form.id}/update`, formData
                ).then(() => {
                    toast.success("نقش مورد نظر  با موفقیت ویرایش شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeRoleModal();
                    this.getData();
                }).catch((error) => {
                    this.errors = error.response?.data?.errors;
                    console.log(error.response?.data?.errors)
                }).finally(() => {
                    this.submitLoading = false;
                })
            }
        },
    },
    computed: {
        permissionOptionsForSelect() {
            return this.allPermissions.map((p) => ({
                ...p,
                __display: `${p.label} — ${p.name}`,
            }));
        },
    },
    mounted() {
        document.title = 'مدیریت نقش‌ها'
        this.getData();
    },
}
</script>
