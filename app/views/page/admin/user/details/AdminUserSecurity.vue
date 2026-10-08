<template>
    <div class="relative">
    <div v-if="!loading && user" class="">
        <!-- رمزعبور -->
        <div class="mb-6 rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white via-white to-gray-50/60 p-4 md:p-5 dark:border-gray-700/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/40 shadow-sm">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex items-start gap-3 min-w-0">
                    <div class="shrink-0 w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                            <rect x="5" y="11" width="14" height="10" rx="2"/>
                            <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke-linecap="round"/>
                        </svg>
                    </div>
                <div>
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white">رمزعبور</h4>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">رمزعبور فعلی کاربر مخفی است</p>
                        <div dir="ltr" class="mt-2 inline-flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 font-mono text-sm tracking-widest text-gray-600 dark:text-gray-300">
                            <span v-for="n in 8" :key="n" class="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                            </div>
                        </div>
                    </div>
                <button @click.prevent="openEditPasswordModal"
                    class="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 h-9 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-amber-300 hover:text-gray-900 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-amber-500/40 dark:hover:bg-gray-700 transition-colors">
                    <svg class="fill-current w-4 h-4" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"/>
                    </svg>
                    تغییر رمزعبور
                </button>
            </div>
        </div>

        <!-- نقش‌ها و دسترسی‌ها -->
        <div class="mb-6 rounded-2xl border border-gray-200/80 bg-white p-4 md:p-5 dark:border-gray-700/80 dark:bg-gray-900 shadow-sm w-full">
            <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">نقش‌ها و دسترسی‌ها</h4>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">مدیریت سطح دسترسی و نقش‌های کاربر</p>
                </div>
            </div>

            <TabGroup :selectedIndex="selectedTabIndex" @change="onAccessTabChange">
                <TabList class="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 w-max mb-4">
                    <Tab v-slot="{ selected }" as="template">
                        <button
                            class="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all outline-none"
                            :class="selected
                                ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        دسترسی‌ها
                            <span v-if="user.permissions?.length" class="font-anjoman text-[10px] px-1.5 py-0.5 rounded-md" :class="selected ? 'bg-black/10' : 'bg-gray-200/80 dark:bg-gray-700'">{{ user.permissions.length }}</span>
                                    </button>
                                </Tab>
                    <Tab v-slot="{ selected }" as="template">
                        <button
                            class="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all outline-none"
                            :class="selected
                                ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        نقش‌ها
                            <span v-if="user.roles?.length" class="font-anjoman text-[10px] px-1.5 py-0.5 rounded-md" :class="selected ? 'bg-black/10' : 'bg-gray-200/80 dark:bg-gray-700'">{{ user.roles.length }}</span>
                                    </button>
                                </Tab>
                            </TabList>

                <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <button type="button" @click="showToggleSuperUserModal = true"
                        class="group flex items-center gap-3 rounded-xl border p-3 text-start transition-all w-full md:w-auto"
                        :class="user.is_superuser
                            ? 'border-violet-300 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/10 dark:border-violet-500/40 hover:border-violet-400'
                            : 'border-gray-200 bg-gray-50/80 dark:border-gray-700 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'">
                        <div class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                            :class="user.is_superuser ? 'bg-violet-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="text-xs font-bold text-gray-900 dark:text-white">دسترسی مدیرکل</p>
                            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                {{ user.is_superuser ? 'فعال — دسترسی کامل به سیستم' : 'غیرفعال — برای تغییر کلیک کنید' }}
                            </p>
                        </div>
                        <div class="shrink-0 relative w-10 h-5 rounded-full transition-colors"
                            :class="user.is_superuser ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'">
                            <span class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                                :class="user.is_superuser ? 'start-0.5 translate-x-5' : 'start-0.5'"></span>
                        </div>
                    </button>

                    <button v-if="selectedTab === 'permissions'" @click.prevent="openAddPermissionModal"
                        class="h-9 flex w-full md:w-auto items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 text-xs font-bold text-gray-900 shadow-sm shadow-amber-400/20 hover:bg-amber-300 transition-colors">
                        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
                                            اعطای دسترسی جدید
                                        </button>
                                        <button v-else @click.prevent="openAddRoleModal"
                        class="h-9 flex w-full md:w-auto items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 text-xs font-bold text-gray-900 shadow-sm shadow-amber-400/20 hover:bg-amber-300 transition-colors">
                        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
                                            اعطای نقش جدید
                                        </button>
                                    </div>

                <TabPanels>
                    <TabPanel>
                                    <div v-if="user.permissions && user.permissions.length > 0"
                            class="max-h-80 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-2 gap-2.5 w-full">
                            <div v-for="(permission, i) in user.permissions" :key="permission.id ?? i"
                                class="group flex items-center justify-between gap-2 rounded-xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50/50 to-white p-3 dark:border-emerald-800/30 dark:from-emerald-900/10 dark:to-gray-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-sm transition-all">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <div class="shrink-0 w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <svg class="w-4 h-4 fill-current" viewBox="0 0 52 52"><path d="m45.2 29.2h-8.8c-2.6 0-4.8-2.2-4.8-4.8 0.4-7.1 3.7-7.5 4-12.1 0.3-4.8-2.7-9.1-7.4-10.1-6.2-1.3-11.8 3.4-11.8 9.4 0 5.3 3.6 5.3 4 12.8 0 2.6-2.2 4.8-4.8 4.8h-8.8c-2.6 0-4.8 2.1-4.8 4.8v3.2c0 0.9 0.7 1.6 1.6 1.6h44.8c0.9 0 1.6-0.7 1.6-1.6v-3.2c0-2.7-2.2-4.8-4.8-4.8z m0.1 14.4h-38.6c-0.9 0-1.5 0.7-1.5 1.5v0.1c0 2.6 2.2 4.8 4.8 4.8h32.1c2.6 0 4.7-2.2 4.7-4.8v-0.1c0-0.8-0.7-1.5-1.5-1.5z"/></svg>
                                                </div>
                                    <div class="min-w-0">
                                        <p class="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">{{ permission.name }}</p>
                                        <p class="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ permission.label }}</p>
                                                </div>
                                            </div>
                                                <button @click.prevent="openRemovePermissionModal(permission)"
                                    class="shrink-0 opacity-60 group-hover:opacity-100 rounded-lg p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all"
                                    title="حذف دسترسی">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.5001 6H3.5M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4" stroke-linecap="round"/></svg>
                                                </button>
                                            </div>
                                        </div>
                        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </div>
                            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">دسترسی‌ای ثبت نشده</p>
                            <p class="text-xs text-gray-400 mt-1">با دکمه بالا می‌توانید دسترسی جدید اضافه کنید</p>
                        </div>
                                </TabPanel>
                    <TabPanel>
                                    <div v-if="user.roles && user.roles.length > 0"
                            class="max-h-80 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-2 gap-2.5 w-full">
                            <div v-for="(role, i) in user.roles" :key="role.id ?? i"
                                class="group flex items-center justify-between gap-2 rounded-xl border border-violet-200/60 bg-gradient-to-r from-violet-50/50 to-white p-3 dark:border-violet-800/30 dark:from-violet-900/10 dark:to-gray-900/50 hover:border-violet-300 dark:hover:border-violet-700/50 hover:shadow-sm transition-all">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <div class="shrink-0 w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                                        <svg class="w-4 h-4 fill-current" viewBox="0 0 52 52"><path d="m27.3 37.6c-3-1.2-3.5-2.3-3.5-3.5 0-1.2 0.8-2.3 1.8-3.2 1.8-1.5 2.6-3.9 2.6-6.4 0-4.7-2.9-8.5-8.3-8.5s-8.3 3.8-8.3 8.5c0 2.5 0.8 4.9 2.6 6.4 1 0.9 1.8 2 1.8 3.2 0 1.2-0.5 2.3-3.5 3.5-4.4 1.8-8.6 3.8-8.7 7.6 0.2 2.6 2.2 4.8 4.7 4.8h23c2.5 0 4.5-2.2 4.5-4.7-0.1-3.8-4.3-5.9-8.7-7.7z m17.2-18.6c0-7.4-6.1-13.5-13.5-13.5v-3.5l-6.8 5.5c-0.3 0.3-0.2 0.8 0.1 1.1l6.7 5.4v-3.5c4.7 0 8.5 3.8 8.5 8.5h-3.5l5.5 6.8c0.3 0.3 0.8 0.3 1.1 0l5.4-6.8h-3.5z"/></svg>
                                                </div>
                                    <div class="min-w-0">
                                        <p class="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">{{ role.name }}</p>
                                        <p class="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ role.label }}</p>
                                                </div>
                                            </div>
                                                <button @click.prevent="openRemoveRoleModal(role)"
                                    class="shrink-0 opacity-60 group-hover:opacity-100 rounded-lg p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all"
                                    title="حذف نقش">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.5001 6H3.5M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4" stroke-linecap="round"/></svg>
                                                </button>
                                            </div>
                                        </div>
                        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </div>
                            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">نقشی ثبت نشده</p>
                            <p class="text-xs text-gray-400 mt-1">با دکمه بالا می‌توانید نقش جدید اضافه کنید</p>
                        </div>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </div>

        <!-- نشست‌ها و تاریخچه ورود -->
        <div class="mb-6 rounded-2xl border border-gray-200/80 bg-white p-4 md:p-5 dark:border-gray-700/80 dark:bg-gray-900 shadow-sm w-full">
            <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">نشست‌ها و تاریخچه ورود</h4>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">ردیابی ورودها و نشست‌های فعال کاربر</p>
            </div>
        </div>

            <TabGroup :selectedIndex="selectedHistoryIndex" @change="onHistoryTabChange">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <TabList class="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 w-max">
                        <Tab v-slot="{ selected }" as="template">
                            <button
                                class="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all outline-none"
                                :class="selected
                                    ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        تاریخچه ورود
                                <span v-if="user.logins?.length" class="font-anjoman text-[10px] px-1.5 py-0.5 rounded-md" :class="selected ? 'bg-black/10' : 'bg-gray-200/80 dark:bg-gray-700'">{{ user.logins.length }}</span>
                                    </button>
                                </Tab>
                        <Tab v-slot="{ selected }" as="template">
                            <button
                                class="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all outline-none"
                                :class="selected
                                    ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M8.464 15.536a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 12a1 1 0 100-2 1 1 0 000 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        نشست‌های فعال
                                <span v-if="user.sessions?.length" class="font-anjoman text-[10px] px-1.5 py-0.5 rounded-md" :class="selected ? 'bg-black/10' : 'bg-gray-200/80 dark:bg-gray-700'">{{ user.sessions.length }}</span>
                                    </button>
                                </Tab>
                            </TabList>

                    <button v-if="selectedHistory === 'loginHistory'" @click.prevent="clearLoginHistory"
                                            :disabled="clearLoginHistoryLoading || (!user.logins || !user.logins.length)"
                        class="disabled:opacity-50 h-9 flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50 transition-colors">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.5001 6H3.5M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4" stroke-linecap="round"/></svg>
                        پاک کردن تاریخچه
                                        </button>
                                        <button v-else @click.prevent="terminateAllSession"
                                            :disabled="terminateAllSessionLoading || (!user.sessions || !user.sessions.length)"
                        class="disabled:opacity-50 h-9 flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50 transition-colors">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.5001 6H3.5M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4" stroke-linecap="round"/></svg>
                                            اتمام همه نشست‌ها
                                        </button>
                                    </div>

                <TabPanels>
                    <TabPanel>
                                    <div v-if="user.logins && user.logins.length > 0"
                            class="max-h-96 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
                            <div v-for="(login, i) in user.logins" :key="login.id ?? i"
                                class="group rounded-xl border border-gray-200/80 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/30 dark:border-gray-700/80 overflow-hidden hover:border-blue-300/60 dark:hover:border-blue-700/40 hover:shadow-sm transition-all">
                                <div class="p-3 flex items-start justify-between gap-2">
                                    <div class="flex items-start gap-2.5 min-w-0 flex-1">
                                                        <div v-html="getOSIconSVG(login.device.os)"
                                            class="shrink-0 rounded-xl flex items-center justify-center w-11 h-11 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="flex flex-wrap items-center gap-1.5 mb-1">
                                                <p class="text-xs font-bold text-gray-900 dark:text-white">
                                                    {{ new Date(login.logged_in_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: '2-digit' }) }}
                                                </p>
                                                <span class="text-[10px] font-medium text-gray-400">·</span>
                                                <p class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                    {{ new Date(login.logged_in_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}
                                                </p>
                                                        </div>
                                            <p dir="ltr" class="font-mono text-[11px] text-gray-500 dark:text-gray-400">{{ login.ip_address }}</p>
                                            <div class="mt-2 flex flex-wrap gap-1.5">
                                                <span class="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                                                    {{ login.device.os.name }} {{ login.device.os.version }}
                                                </span>
                                                <span class="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                                                    {{ login.device.browser.name }}
                                                </span>
                                                <span class="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                                                    <span v-html="getSocialIconSvg(login.login_type)" class="w-3 h-3"></span>
                                                    {{ login.login_type }}
                                                </span>
                                                    </div>
                                                        </div>
                                                        </div>
                                                    <button @click.prevent="removeUserLoginRecord(login.id)"
                                                        :disabled="removeloginRecordLoading[login.id]"
                                        class="shrink-0 opacity-0 group-hover:opacity-100 disabled:opacity-50 rounded-lg p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all"
                                        title="حذف رکورد">
                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.5001 6H3.5M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4" stroke-linecap="round"/></svg>
                                                    </button>
                                                </div>
                                <div class="px-3 py-2 border-t border-dashed border-gray-200 dark:border-gray-700/80 bg-gray-50/80 dark:bg-gray-800/40 flex items-center justify-between gap-2">
                                    <span class="text-[11px] text-gray-500 dark:text-gray-400">زمان خروج</span>
                                    <span v-if="login.logged_out_at" class="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                                        {{ new Date(login.logged_out_at).toLocaleDateString('fa-IR', { month: 'short', day: '2-digit' }) }}
                                        ·
                                        {{ new Date(login.logged_out_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}
                                                </span>
                                    <span v-else class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        هنوز آنلاین
                                    </span>
                                        </div>
                                    </div>
                        </div>
                        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </div>
                            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">تاریخچه ورودی ثبت نشده</p>
                        </div>
                                </TabPanel>
                    <TabPanel>
                                    <div v-if="user.sessions && user.sessions.length > 0"
                            class="max-h-96 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
                            <div v-for="(session, i) in user.sessions" :key="session.id ?? i"
                                class="group rounded-xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-900/5 dark:to-gray-900 dark:border-emerald-800/30 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-sm transition-all">
                                <div class="p-3 flex items-start gap-2.5">
                                    <div class="relative shrink-0">
                                                        <div v-html="getOSIconSVG(session.name.os)"
                                            class="rounded-xl flex items-center justify-center w-11 h-11 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                                                        </div>
                                        <span class="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900"></span>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                فعال
                                            </span>
                                            <p class="text-xs font-bold text-gray-900 dark:text-white">
                                                {{ new Date(session.created_at).toLocaleDateString('fa-IR', { month: 'short', day: '2-digit' }) }}
                                                ·
                                                {{ new Date(session.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}
                                            </p>
                                                        </div>
                                        <p dir="ltr" class="font-mono text-[11px] text-gray-500 dark:text-gray-400">{{ session.ip }}</p>
                                        <p class="mt-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300">
                                            {{ session.name.os.name }} {{ session.name.os.version }} · {{ session.name.browser.name }}
                                        </p>
                                                    </div>
                                                        </div>
                                <div class="px-3 py-2 border-t border-dashed border-emerald-200/60 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-900/10 flex items-center justify-between gap-2">
                                    <div class="text-[11px] text-gray-500 dark:text-gray-400">
                                        آخرین استفاده:
                                        <span v-if="session.last_used_at" class="font-semibold text-gray-700 dark:text-gray-200 ms-1">{{ timeAgo(session.last_used_at) }}</span>
                                        <span v-else class="font-semibold text-gray-400 ms-1">هنوز استفاده نشده</span>
                                                    </div>
                                                <button @click.prevent="terminateSession(session.id)"
                                                    :disabled="terminateSessionLoading[session.id]"
                                        class="shrink-0 disabled:opacity-50 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 bg-rose-100/80 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50 transition-colors">
                                        قطع نشست
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M8.464 15.536a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 12a1 1 0 100-2 1 1 0 000 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </div>
                            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">نشست فعالی وجود ندارد</p>
                        </div>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
        </div>

        <!-- منطقه خطرناک -->
        <div v-can="'users.delete'" class="mb-6 rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/80 via-white to-white p-4 md:p-5 dark:border-rose-900/40 dark:from-rose-950/20 dark:via-gray-900 dark:to-gray-900 shadow-sm">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex items-start gap-3">
                    <div class="shrink-0 w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                <div>
                        <h4 class="text-sm font-bold text-rose-700 dark:text-rose-400">منطقه خطرناک</h4>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-md">
                            با حذف کاربر، تمام اطلاعات، دسترسی‌ها و سوابق مرتبط برای همیشه پاک می‌شود. این عمل غیرقابل بازگشت است.
                    </p>
                </div>
                </div>
                <button type="button" @click.prevent="showDeleteUserModal = true"
                    class="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-500 px-5 h-10 text-xs font-bold text-white shadow-sm shadow-rose-500/20 hover:bg-rose-600 lg:inline-flex lg:w-auto transition-colors">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.5001 6H3.5M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4" stroke-linecap="round"/></svg>
                    حذف دائمی کاربر
                </button>
            </div>
        </div>

    </div>

    <LoadingComponent v-if="loading" />

    <AdminDeleteUserModal
        v-model="showDeleteUserModal"
        :user-ids="user?.id"
        @deleted="onUserDeleted"
    />

    <BottomSheetDrawer v-model="showEditPasswordModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetHeader
            title="ویرایش رمزعبور"
            subtitle="رمزعبور جدید باید شرایط امنیتی را داشته باشد"
            accent="violet"
            @close="closeEditPasswordModal">
            <template #icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
        </AdminBottomSheetHeader>
        <form class="flex flex-col">
            <div :class="bs.ADMIN_BS_FORM_BODY">
                                            <div class="grid grid-cols-1 gap-x-3 gap-y-3">
                                                <div>
                        <label for="password" :class="bs.ADMIN_BS_FORM_LABEL">رمزعبور</label>
                                                    <div class="relative">
                            <button type="button" @click="authPasswordVisibility = !authPasswordVisibility"
                                                            class="absolute end-4 top-1/2 -translate-y-1/2 focus:outline-none">
                                <span v-show="!authPasswordVisibility">
                                    <svg class="w-4 h-4 text-gray-800 dark:text-gray-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.5" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"/>
                                        <path opacity="0.5" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 3.25C7.48587 3.25 4.44529 5.9542 2.68057 8.24686L2.64874 8.2882C2.24964 8.80653 1.88206 9.28392 1.63269 9.8484C1.36564 10.4529 1.25 11.1117 1.25 12C1.25 12.8883 1.36564 13.5471 1.63269 14.1516C1.88206 14.7161 2.24964 15.1935 2.64875 15.7118L2.68057 15.7531C4.44529 18.0458 7.48587 20.75 12 20.75C16.5141 20.75 19.5547 18.0458 21.3194 15.7531L21.3512 15.7118C21.7504 15.1935 22.1179 14.7161 22.3673 14.1516C22.6344 13.5471 22.75 12.8883 22.75 12C22.75 11.1117 22.6344 10.4529 22.3673 9.8484C22.1179 9.28391 21.7504 8.80652 21.3512 8.28818L21.3194 8.24686C19.5547 5.9542 16.5141 3.25 12 3.25ZM3.86922 9.1618C5.49864 7.04492 8.15036 4.75 12 4.75C15.8496 4.75 18.5014 7.04492 20.1308 9.1618C20.5694 9.73159 20.8263 10.0721 20.9952 10.4545C21.1532 10.812 21.25 11.2489 21.25 12C21.25 12.7511 21.1532 13.188 20.9952 13.5455C20.8263 13.9279 20.5694 14.2684 20.1308 14.8382C18.5014 16.9551 15.8496 19.25 12 19.25C8.15036 19.25 5.49864 16.9551 3.86922 14.8382C3.43064 14.2684 3.17374 13.9279 3.00476 13.5455C2.84684 13.188 2.75 12.7511 2.75 12C2.75 11.2489 2.84684 10.812 3.00476 10.4545C3.17374 10.0721 3.43063 9.73159 3.86922 9.1618Z"/>
                                                                </svg>
                                                            </span>
                                <span v-show="authPasswordVisibility">
                                    <svg class="w-4 h-4 text-gray-800 dark:text-gray-200" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.94557 10.1681C7.41849 9.64191 7.09766 8.92691 7.09766 8.12482C7.09766 6.51791 8.39199 5.22266 9.99799 5.22266C10.7927 5.22266 11.5242 5.54441 12.0422 6.07057" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12.8451 8.64062C12.6324 9.82312 11.7011 10.7563 10.5195 10.9708" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M5.09911 13.0145C3.64436 11.8724 2.41236 10.204 1.51953 8.1241C2.42153 6.03502 3.66178 4.35752 5.1257 3.20619C6.58045 2.05485 8.25887 1.42969 9.9987 1.42969C11.7486 1.42969 13.4261 2.06402 14.89 3.2236" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M16.8241 5.24023C17.4548 6.07807 18.0094 7.04515 18.4759 8.12407C16.6729 12.3013 13.4865 14.8176 9.99678 14.8176C9.2057 14.8176 8.42561 14.6892 7.67578 14.439" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M17.229 0.894531L2.76953 15.354" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </span>
                                                        </button>
                                                        <input v-model="password" id="Password"
                                :type="authPasswordVisibility ? 'text' : 'password'"
                                :class="[bs.ADMIN_BS_INPUT, errors && errors.password ? bs.ADMIN_BS_INPUT_ERROR : '']" />
                                                    </div>
                        <span v-if="errors && errors.password" class="mt-2 text-rose-500 text-xs font-semibold">
                                                        {{ errors.password[0] }}
                                                    </span>
                                                </div>
                                                <div>
                        <label for="password_confirmation" :class="bs.ADMIN_BS_FORM_LABEL">تایید رمزعبور</label>
                                                    <div class="relative">
                            <button type="button" @click="authPasswordVisibility = !authPasswordVisibility"
                                                            class="absolute end-4 top-1/2 -translate-y-1/2 focus:outline-none">
                                <span v-show="!authPasswordVisibility">
                                    <svg class="w-4 h-4 text-gray-800 dark:text-gray-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.5" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"/>
                                        <path opacity="0.5" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 3.25C7.48587 3.25 4.44529 5.9542 2.68057 8.24686L2.64874 8.2882C2.24964 8.80653 1.88206 9.28392 1.63269 9.8484C1.36564 10.4529 1.25 11.1117 1.25 12C1.25 12.8883 1.36564 13.5471 1.63269 14.1516C1.88206 14.7161 2.24964 15.1935 2.64875 15.7118L2.68057 15.7531C4.44529 18.0458 7.48587 20.75 12 20.75C16.5141 20.75 19.5547 18.0458 21.3194 15.7531L21.3512 15.7118C21.7504 15.1935 22.1179 14.7161 22.3673 14.1516C22.6344 13.5471 22.75 12.8883 22.75 12C22.75 11.1117 22.6344 10.4529 22.3673 9.8484C22.1179 9.28391 21.7504 8.80652 21.3512 8.28818L21.3194 8.24686C19.5547 5.9542 16.5141 3.25 12 3.25ZM3.86922 9.1618C5.49864 7.04492 8.15036 4.75 12 4.75C15.8496 4.75 18.5014 7.04492 20.1308 9.1618C20.5694 9.73159 20.8263 10.0721 20.9952 10.4545C21.1532 10.812 21.25 11.2489 21.25 12C21.25 12.7511 21.1532 13.188 20.9952 13.5455C20.8263 13.9279 20.5694 14.2684 20.1308 14.8382C18.5014 16.9551 15.8496 19.25 12 19.25C8.15036 19.25 5.49864 16.9551 3.86922 14.8382C3.43064 14.2684 3.17374 13.9279 3.00476 13.5455C2.84684 13.188 2.75 12.7511 2.75 12C2.75 11.2489 2.84684 10.812 3.00476 10.4545C3.17374 10.0721 3.43063 9.73159 3.86922 9.1618Z"/>
                                                                </svg>
                                                            </span>
                                <span v-show="authPasswordVisibility">
                                    <svg class="w-4 h-4 text-gray-800 dark:text-gray-200" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.94557 10.1681C7.41849 9.64191 7.09766 8.92691 7.09766 8.12482C7.09766 6.51791 8.39199 5.22266 9.99799 5.22266C10.7927 5.22266 11.5242 5.54441 12.0422 6.07057" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12.8451 8.64062C12.6324 9.82312 11.7011 10.7563 10.5195 10.9708" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M5.09911 13.0145C3.64436 11.8724 2.41236 10.204 1.51953 8.1241C2.42153 6.03502 3.66178 4.35752 5.1257 3.20619C6.58045 2.05485 8.25887 1.42969 9.9987 1.42969C11.7486 1.42969 13.4261 2.06402 14.89 3.2236" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M16.8241 5.24023C17.4548 6.07807 18.0094 7.04515 18.4759 8.12407C16.6729 12.3013 13.4865 14.8176 9.99678 14.8176C9.2057 14.8176 8.42561 14.6892 7.67578 14.439" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M17.229 0.894531L2.76953 15.354" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </span>
                                                        </button>
                                                        <input v-model="password_confirmation" id="RepeatPassword"
                                                            :type="authPasswordVisibility ? 'text' : 'password'"
                                :class="bs.ADMIN_BS_INPUT" />
                                                    </div>
                                                </div>
                                                <ul v-if="!allConditionsMet"
                                                    class="border border-pink-500 dark:border-pink-400 dark:bg-pink-400 dark:bg-opacity-10 bg-pink-500 bg-opacity-5 rounded-xl px-4 py-2 mt-4">
                        <li v-if="!hasLowercase" class="font-semibold text-[0.8rem] text-pink-700 dark:text-pink-600 mb-2 last:mb-0">- حداقل یک حرف کوچک استفاده کنید</li>
                        <li v-if="!hasUppercase" class="font-semibold text-[0.8rem] text-pink-700 dark:text-pink-600 mb-2 last:mb-0">- حداقل یک حرف بزرگ استفاده کنید</li>
                        <li v-if="!hasMinLength" class="font-semibold text-[0.8rem] text-pink-700 dark:text-pink-600 mb-2 last:mb-0">- پسورد حداقل باید ۸ کاراکتر باشد</li>
                        <li v-if="!hasSpecialChar" class="font-semibold text-[0.8rem] text-pink-700 dark:text-pink-600 mb-2 last:mb-0">- حداقل یک کاراکتر خاص استفاده کنید (#?!@$%^&*-)</li>
                        <li v-if="!hasNumber" class="font-semibold text-[0.8rem] text-pink-700 dark:text-pink-600 mb-2 last:mb-0">- حداقل از یک عدد استفاده کنید</li>
                                                </ul>
                                            </div>
                                        </div>
            <AdminBottomSheetActions
                cancel-label="بستن"
                submit-label="ذخیره تغییرات"
                :loading="passwordLoading"
                @cancel="closeEditPasswordModal"
                @submit="updateUserPassword"
            />
        </form>
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="showAddPermissionModal" :initialHeight="0.82" :maxHeight="0.95" :minHeight="0.65"
        :fitContent="false"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetHeader
            title="اعطای دسترسی جدید"
            subtitle="دسترسی‌های مورد نظر را جستجو و انتخاب کنید"
            accent="emerald"
            @close="closeAddPermissionModal">
            <template #icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
        </AdminBottomSheetHeader>
        <form class="flex flex-col flex-1 min-h-0 overflow-hidden" @submit.prevent="addUserPermissions">
                                            <AdvancedMultiSelect v-model="permissions"
                layout="panel"
                panel-accent="emerald"
                search-placeholder="جستجوی دسترسی..."
                empty-selection-text="هنوز دسترسی انتخاب نشده — از لیست بالا انتخاب کنید"
                                                :options="availablePermissionsOptions"
                :closeOnSelect="false"
                optionLabel="__display"
                optionValue="id"
                :enableSearch="true"
                :enableSelectAll="true"
                :enableClearAll="true"
                class="flex-1 min-h-0 pt-1" />
            <span v-if="errors && errors.permissions" class="shrink-0 text-rose-500 text-xs font-medium px-1 pt-1">
                                                {{ errors.permissions[0] }}
                                            </span>
            <AdminBottomSheetActions
                cancel-label="انصراف"
                submit-label="ثبت دسترسی‌ها"
                :loading="permissionLoading"
                @cancel="closeAddPermissionModal"
                @submit="addUserPermissions"
            />
        </form>
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="showAddRoleModal" :initialHeight="0.82" :maxHeight="0.95" :minHeight="0.65"
        :fitContent="false"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetHeader
            title="اعطای نقش جدید"
            subtitle="نقش‌های مورد نظر را جستجو و انتخاب کنید"
            accent="violet"
            @close="closeAddRoleModal">
            <template #icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
        </AdminBottomSheetHeader>
        <form class="flex flex-col flex-1 min-h-0 overflow-hidden" @submit.prevent="addUserRoles">
                                            <AdvancedMultiSelect v-model="roles"
                layout="panel"
                panel-accent="violet"
                search-placeholder="جستجوی نقش..."
                empty-selection-text="هنوز نقشی انتخاب نشده — از لیست بالا انتخاب کنید"
                                                :options="availableRolesOptions"
                :closeOnSelect="false"
                optionLabel="__display"
                optionValue="id"
                :enableSearch="true"
                :enableSelectAll="true"
                :enableClearAll="true"
                class="flex-1 min-h-0 pt-1" />
            <span v-if="errors && errors.roles" class="shrink-0 text-rose-500 text-xs font-medium px-1 pt-1">
                                                {{ errors.roles[0] }}
                                            </span>
            <AdminBottomSheetActions
                cancel-label="انصراف"
                submit-label="ثبت نقش‌ها"
                :loading="roleLoading"
                @cancel="closeAddRoleModal"
                @submit="addUserRoles"
            />
        </form>
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="showRemovePermissionModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL_SM"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetHeader
            title="سلب دسترسی"
            accent="rose"
            @close="closeRemovePermissionModal">
            <template #icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
        </AdminBottomSheetHeader>
        <AdminBottomSheetConfirm
            variant="danger"
            message="از سلب کاربر از این دسترسی اطمینان دارید؟"
            cancel-label="دست نگه دار"
            confirm-label="بله، حذف کن"
            :loading="deletePermissionLoading"
            @cancel="closeRemovePermissionModal"
            @confirm="RemoveUserPermission"
        />
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="showRemoveRoleModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL_SM"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetHeader
            title="سلب نقش"
            accent="rose"
            @close="closeRemoveRoleModal">
            <template #icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
        </AdminBottomSheetHeader>
        <AdminBottomSheetConfirm
            variant="danger"
            message="از سلب کاربر از این نقش اطمینان دارید؟"
            cancel-label="دست نگه دار"
            confirm-label="بله، حذف کن"
            :loading="deleteRoleLoading"
            @cancel="closeRemoveRoleModal"
            @confirm="RemoveUserRole"
        />
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="showToggleSuperUserModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL_SM"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetHeader
            title="دسترسی مدیرکل"
            accent="warning"
            @close="showToggleSuperUserModal = false">
            <template #icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
        </AdminBottomSheetHeader>
        <AdminBottomSheetConfirm
            variant="warning"
            :message="user.is_superuser ? 'آیا اطمینان دارید که میخواهید دسترسی مدیرکل را از این کاربر بگیرید؟' : 'آیا اطمینان دارید که دسترسی مدیر کل به این کابر داده شود؟'"
            :hint="user.is_superuser ? '' : 'دقت کنید که با دادن این دسترسی، کاربر به تمامی بخش های سایت از جمله پنل ادمین دسترسی کامل خواهد داشت'"
            cancel-label="دست نگه دار"
            :confirm-label="user.is_superuser ? 'گرفتن دسترسی' : 'دادن دسترسی'"
            :loading="superUserLoading"
            @cancel="showToggleSuperUserModal = false"
            @confirm="toggleSuperUser"
        />
    </BottomSheetDrawer>
    </div>
</template>
<script>
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminDeleteUserModal from "@/views/components/admin/AdminDeleteUserModal.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetActions from "@/views/components/admin/bottomSheet/AdminBottomSheetActions.vue";
import AdminBottomSheetConfirm from "@/views/components/admin/bottomSheet/AdminBottomSheetConfirm.vue";
import {
    ADMIN_BS_PANEL,
    ADMIN_BS_PANEL_SM,
    ADMIN_BS_CONTENT,
    ADMIN_BS_SCROLL,
    ADMIN_BS_BACKDROP,
    ADMIN_BS_HINT,
    ADMIN_BS_FORM_BODY,
    ADMIN_BS_FORM_LABEL,
    ADMIN_BS_INPUT,
    ADMIN_BS_INPUT_ERROR,
} from "@/views/components/admin/bottomSheet/adminBottomSheetStyles";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import AdvancedMultiSelect from "@/views/components/multiselect/AdvancedMultiSelect.vue";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import UAParser from "ua-parser-js";

import moment from "moment";
import "moment/locale/fa";

export default {
    components: {
        LoadingComponent,
        BottomSheetDrawer,
        TabGroup, TabList, Tab, TabPanels, TabPanel,
        AdvancedMultiSelect,
        AdminDeleteUserModal,
        AdminBottomSheetHeader,
        AdminBottomSheetActions,
        AdminBottomSheetConfirm,
    },
    data() {
        const tabs = ['permissions', 'roles']
        const histories = ['loginHistory', 'activeSession']
        return {
            bs: {
                ADMIN_BS_PANEL,
                ADMIN_BS_PANEL_SM,
                ADMIN_BS_CONTENT,
                ADMIN_BS_SCROLL,
                ADMIN_BS_BACKDROP,
                ADMIN_BS_HINT,
                ADMIN_BS_FORM_BODY,
                ADMIN_BS_FORM_LABEL,
                ADMIN_BS_INPUT,
                ADMIN_BS_INPUT_ERROR,
            },
            username: this.$route.params.username,
            user: null,
            access: null,
            errors: null,
            loading: true,
            showEditPasswordModal: this.$route.query.editPassword ? true : false,
            authPasswordVisibility: false,
            passwordLoading: false,
            password: '',
            password_confirmation: '',

            selectedTab: tabs.includes(this.$route.query.tab) ? this.$route.query.tab : tabs[0],
            selectedHistory: histories.includes(this.$route.query.history) ? this.$route.query.history : histories[0],


            permissions: [],
            permissionForDelete: null,
            permissionLoading: false,
            deletePermissionLoading: false,
            showAddPermissionModal: false,
            showRemovePermissionModal: false,

            roles: [],
            roleForDelete: null,
            roleLoading: false,
            deleteRoleLoading: false,
            showAddRoleModal: false,
            showRemoveRoleModal: false,


            superUserLoading: false,
            showToggleSuperUserModal: false,
            showDeleteUserModal: false,

            removeloginRecordLoading: [],
            clearLoginHistoryLoading: false,

            terminateSessionLoading: [],
            terminateAllSessionLoading: false,

        }
    },

    computed: {

        hasLowercase() {
            return /[a-z]/.test(this.password);
        },

        hasUppercase() {
            return /[A-Z]/.test(this.password);
        },

        hasNumber() {
            return /\d/.test(this.password);
        },

        hasSpecialChar() {
            return /[#?!@$%^&*-]/.test(this.password);
        },

        hasMinLength() {
            return (this.password || '').length >= 8;
        },

        allConditionsMet() {
            return this.hasLowercase && this.hasUppercase && this.hasNumber && this.hasSpecialChar && this.hasMinLength;
        },

        selectedTabIndex() {
            const tabs = ['permissions', 'roles'];
            const index = tabs.indexOf(this.selectedTab);
            return index >= 0 ? index : 0;
        },

        selectedHistoryIndex() {
            const histories = ['loginHistory', 'activeSession'];
            const index = histories.indexOf(this.selectedHistory);
            return index >= 0 ? index : 0;
        },

        availablePermissionsOptions() {
            if (!this.access || !this.user) return [];
            const accessPermissions = Array.isArray(this.access && this.access.permissions) ? this.access.permissions : [];
            const userPermissions = Array.isArray(this.user && this.user.permissions) ? this.user.permissions : [];
            return accessPermissions
                .filter(p => !userPermissions.some(up => up.id === p.id))
                .map(p => ({
                    ...p,
                    __display: `${p.name} - ${p.label}`,
                }));
        },

        availableRolesOptions() {
            if (!this.access || !this.user) return [];
            const accessRoles = Array.isArray(this.access && this.access.roles) ? this.access.roles : [];
            const userRoles = Array.isArray(this.user && this.user.roles) ? this.user.roles : [];
            return accessRoles
                .filter(r => !userRoles.some(ur => ur.id === r.id))
                .map(r => ({
                    ...r,
                    __display: `${r.name} - ${r.label}`,
                }));
        }

    },

    methods: {

        timeAgo(date) {
            moment.locale("fa");
            return moment(date).fromNow();
        },

        onAccessTabChange(index) {
            const tabs = ['permissions', 'roles'];
            this.selectedTab = tabs[index] ?? tabs[0];
            this.buildQueryParams();
        },

        onHistoryTabChange(index) {
            const histories = ['loginHistory', 'activeSession'];
            this.selectedHistory = histories[index] ?? histories[0];
            this.buildQueryParams();
        },

        buildQueryParams() {
            const params = new URLSearchParams(window.location.search);

            if (this.selectedTab) {
                params.set("tab", this.selectedTab);
            } else {
                params.delete("tab");
            }

            if (this.selectedHistory) {
                params.set("history", this.selectedHistory);
            } else {
                params.delete("history");
            }

            const queryString = params.toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

            window.history.pushState(null, "", newUrl);
        },

        async toggleSuperUser() {
            this.superUserLoading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/toggleSuperUser`)
                .then((response) => {

                    setTimeout(() => {
                        this.user.is_superuser = !!response.data.is_superuser;
                    }, 500)

                    toast.success(this.user.is_superuser ? 'دسترسی مدیرکل با موفقیت به کاربر داده شد.' : 'دسترسی مدیرکل با موفقیت از کاربر گرفته شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.showToggleSuperUserModal = false;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                    toast.error('خطا! لطفا دوباره اقدام کنید.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .finally(() => {
                    this.superUserLoading = false;
                });
        },

        async getUserSecurity() {
            this.loading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/security`)
                .then((response) => {
                    this.user = response.data.user;

                    const parser = new UAParser();

                    this.user.logins = response.data.user.logins.map((login) => {
                        const info = parser.setUA(login.device).getResult();
                        return {
                            ...login,
                            device: info
                        };
                    });

                    this.user.sessions = response.data.user.sessions.map((session) => {
                        const info = parser.setUA(session.name).getResult();
                        return {
                            ...session,
                            name: info
                        };
                    });
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        getAllAccess() {
            // this.loading = true;
            axiosInstance
                .post(`admin/security/access`)
                .then((response) => {
                    this.access = response.data.access;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    // this.loading = false;
                });
        },

        async updateUserPassword() {
            this.errors = null;
            this.passwordLoading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/updatePassword`, { password: this.password, password_confirmation: this.password_confirmation })
                .then(() => {
                    this.password = '';
                    this.password_confirmation = '';
                    toast.success('رمزعبور با موفقیت آپدیت شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeEditPasswordModal();
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response.data.errors);
                    toast.error('خطا! لطفا خطاها را برطرف کنید و دوباره اقدام کنید.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .finally(() => {
                    this.passwordLoading = false;
                });
        },


        async addUserPermissions() {
            this.errors = null;
            this.permissionLoading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/access/addPermission`, {
                    permissions: Array.isArray(this.permissions) && typeof this.permissions[0] === "object"
                        ? this.permissions.map(per => per.id)
                        : this.permissions
                })
                .then(() => {
                    this.user.permissions.push(...this.permissions)
                    toast.success('دسترسی(ها) با موفقیت به کاربر داده شدند.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeAddPermissionModal();
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response.data.errors);
                    toast.error('خطا! لطفا خطاها را برطرف کنید و دوباره اقدام کنید.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .finally(() => {
                    this.permissionLoading = false;
                });
        },

        async RemoveUserPermission() {
            this.errors = null;
            this.deletePermissionLoading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/access/removePermission`, {
                    permission: this.permissionForDelete.id
                })
                .then(() => {
                    this.user.permissions = this.user.permissions.filter(p => p.id !== this.permissionForDelete.id)
                    toast.success('دسترسی با موفقیت از کاربر گرفته شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeRemovePermissionModal();
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response.data.errors);
                    toast.error('خطا! لطفا خطاها را برطرف کنید و دوباره اقدام کنید.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .finally(() => {
                    this.deletePermissionLoading = false;
                });
        },

        async addUserRoles() {
            this.errors = null;
            this.roleLoading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/access/addRole`, {
                    roles: Array.isArray(this.roles) && typeof this.roles[0] === "object"
                        ? this.roles.map(per => per.id)
                        : this.roles
                })
                .then(() => {
                    this.user.roles.push(...this.roles)
                    toast.success('نقش(ها) با موفقیت به کاربر داده شدند.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeAddRoleModal();
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response.data.errors);
                    toast.error('خطا! لطفا خطاها را برطرف کنید و دوباره اقدام کنید.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .finally(() => {
                    this.roleLoading = false;
                });
        },

        async RemoveUserRole() {
            this.errors = null;
            this.deleteRoleLoading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/access/removeRole`, {
                    role: this.roleForDelete.id
                })
                .then(() => {
                    this.user.roles = this.user.roles.filter(r => r.id !== this.roleForDelete.id)
                    toast.success('نقش با موفقیت از کاربر گرفته شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeRemoveRoleModal();
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response.data.errors);
                    toast.error('خطا! لطفا خطاها را برطرف کنید و دوباره اقدام کنید.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .finally(() => {
                    this.deleteRoleLoading = false;
                });
        },

        openEditPasswordModal() {
            this.showEditPasswordModal = true;
        },

        closeEditPasswordModal() {
            this.showEditPasswordModal = false;
        },

        openAddPermissionModal() {
            this.showAddPermissionModal = true;
        },

        closeAddPermissionModal() {
            this.showAddPermissionModal = false;
            this.permissions = [];
        },

        openRemovePermissionModal(value) {
            this.permissionForDelete = value;
            this.showRemovePermissionModal = true;
        },

        closeRemovePermissionModal() {
            this.permissionForDelete = null;
            this.showRemovePermissionModal = false;
        },


        openAddRoleModal() {
            this.showAddRoleModal = true;
        },

        closeAddRoleModal() {
            this.showAddRoleModal = false;
            this.roles = [];
        },

        openRemoveRoleModal(value) {
            this.roleForDelete = value;
            this.showRemoveRoleModal = true;
        },

        closeRemoveRoleModal() {
            this.roleForDelete = null;
            this.showRemoveRoleModal = false;
        },


        async removeUserLoginRecord(id) {
            this.errors = null;
            this.removeloginRecordLoading[id] = true;
            await axiosInstance
                .post(`admin/user/${this.username}/removeLoginRecord`, {
                    id: id
                })
                .then(() => {
                    this.user.logins = this.user.logins.filter(l => l.id !== id)
                    toast.success('رکورد با موفقیت حذف شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response.data.errors);
                    toast.error('خطا! لطفا دوباره اقدام کنید.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .finally(() => {
                    this.removeloginRecordLoading[id] = false;
                });
        },


        async clearLoginHistory() {
            this.errors = null;
            this.clearLoginHistoryLoading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/clearLoginHistory`)
                .then(() => {
                    this.user.logins = null;
                    toast.success('تاریخچه ورود با موفقیت پاک شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response.data.errors);
                    toast.error('خطا! لطفا دوباره اقدام کنید.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .finally(() => {
                    this.clearLoginHistoryLoading = false;
                });
        },


        async terminateSession(id) {
            this.errors = null;
            this.terminateSessionLoading[id] = true;
            await axiosInstance
                .post(`admin/user/${this.username}/terminateSession`, {
                    id: id
                })
                .then(() => {
                    this.user.sessions = this.user.sessions.filter(s => s.id !== id)
                    toast.success('نشست مورد نظر با موفقیت حذف شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response.data.errors);
                    toast.error('خطا! لطفا دوباره اقدام کنید.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .finally(() => {
                    this.terminateSessionLoading[id] = false;
                });
        },


        async terminateAllSession() {
            this.errors = null;
            this.terminateAllSessionLoading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/terminateAllSession`)
                .then(() => {
                    this.user.sessions = null;
                    toast.success('همه نشست‌های کاربر با موفقیت حذف شدند.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response.data.errors);
                    toast.error('خطا! لطفا دوباره اقدام کنید.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .finally(() => {
                    this.terminateAllSessionLoading = false;
                });
        },




        getSocialIconSvg(social) {
            if (social === "google") {
                return `<svg class="w-full h-full" viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </g></svg>`;
            } else if (social === "github") {
                return `<svg class="w-full h-full" viewBox="0 -0.5 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Github-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-700.000000, -560.000000)" fill="#3E75C3"> <path d="M723.9985,560 C710.746,560 700,570.787092 700,584.096644 C700,594.740671 706.876,603.77183 716.4145,606.958412 C717.6145,607.179786 718.0525,606.435849 718.0525,605.797328 C718.0525,605.225068 718.0315,603.710086 718.0195,601.699648 C711.343,603.155898 709.9345,598.469394 709.9345,598.469394 C708.844,595.686405 707.2705,594.94548 707.2705,594.94548 C705.091,593.450075 707.4355,593.480194 707.4355,593.480194 C709.843,593.650366 711.1105,595.963499 711.1105,595.963499 C713.2525,599.645538 716.728,598.58234 718.096,597.964902 C718.3135,596.407754 718.9345,595.346062 719.62,594.743683 C714.2905,594.135281 708.688,592.069123 708.688,582.836167 C708.688,580.205279 709.6225,578.054788 711.1585,576.369634 C710.911,575.759726 710.0875,573.311058 711.3925,569.993458 C711.3925,569.993458 713.4085,569.345902 717.9925,572.46321 C719.908,571.928599 721.96,571.662047 724.0015,571.651505 C726.04,571.662047 728.0935,571.928599 730.0105,572.46321 C734.5915,569.345902 736.603,569.993458 736.603,569.993458 C737.9125,573.311058 737.089,575.759726 736.8415,576.369634 C738.3805,578.054788 739.309,580.205279 739.309,582.836167 C739.309,592.091712 733.6975,594.129257 728.3515,594.725612 C729.2125,595.469549 729.9805,596.939353 729.9805,599.18773 C729.9805,602.408949 729.9505,605.006706 729.9505,605.797328 C729.9505,606.441873 730.3825,607.191834 731.6005,606.9554 C741.13,603.762794 748,594.737659 748,584.096644 C748,570.787092 737.254,560 723.9985,560" id="Github"> </path> </g> </g> </g></svg>`;
            } else if (social === "facebook") {
                return `<svg class="w-full h-full" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Facebook-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0"> <path d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z" id="Facebook"> </path> </g> </g> </g></svg>`;
            } else if (social === "linkedin") {
                return `<svg class="w-full h-full" viewBox="0 -2 44 44" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>LinkedIn-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-702.000000, -265.000000)" fill="#007EBB"> <path d="M746,305 L736.2754,305 L736.2754,290.9384 C736.2754,287.257796 734.754233,284.74515 731.409219,284.74515 C728.850659,284.74515 727.427799,286.440738 726.765522,288.074854 C726.517168,288.661395 726.555974,289.478453 726.555974,290.295511 L726.555974,305 L716.921919,305 C716.921919,305 717.046096,280.091247 716.921919,277.827047 L726.555974,277.827047 L726.555974,282.091631 C727.125118,280.226996 730.203669,277.565794 735.116416,277.565794 C741.21143,277.565794 746,281.474355 746,289.890824 L746,305 L746,305 Z M707.17921,274.428187 L707.117121,274.428187 C704.0127,274.428187 702,272.350964 702,269.717936 C702,267.033681 704.072201,265 707.238711,265 C710.402634,265 712.348071,267.028559 712.41016,269.710252 C712.41016,272.34328 710.402634,274.428187 707.17921,274.428187 L707.17921,274.428187 L707.17921,274.428187 Z M703.109831,277.827047 L711.685795,277.827047 L711.685795,305 L703.109831,305 L703.109831,277.827047 L703.109831,277.827047 Z" id="LinkedIn"> </path> </g> </g> </g></svg>`;
            } else if (social === "apple") {
                return `<svg class="w-full h-full" viewBox="-3.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Apple-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-204.000000, -560.000000)" fill="#0B0B0A"> <path d="M231.174735,567.792499 C232.740177,565.771699 233.926883,562.915484 233.497649,560 C230.939077,560.177808 227.948466,561.814769 226.203475,563.948463 C224.612784,565.88177 223.305444,568.757742 223.816036,571.549042 C226.613071,571.636535 229.499881,569.960061 231.174735,567.792499 L231.174735,567.792499 Z M245,595.217241 C243.880625,597.712195 243.341978,598.827022 241.899976,601.03692 C239.888467,604.121745 237.052156,607.962958 233.53412,607.991182 C230.411652,608.02505 229.606488,605.94498 225.367451,605.970382 C221.128414,605.99296 220.244696,608.030695 217.116618,607.999649 C213.601387,607.968603 210.913765,604.502761 208.902256,601.417937 C203.27452,592.79849 202.68257,582.680377 206.152914,577.298162 C208.621711,573.476705 212.515678,571.241407 216.173986,571.241407 C219.89682,571.241407 222.239372,573.296075 225.322563,573.296075 C228.313175,573.296075 230.133913,571.235762 234.440281,571.235762 C237.700215,571.235762 241.153726,573.022307 243.611302,576.10431 C235.554045,580.546683 236.85858,592.121127 245,595.217241 L245,595.217241 Z" id="Apple"> </path> </g> </g> </g></svg>`;
            } else {
                // to do
                return `<svg class="w-full h-full" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Slack-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-600.000000, -460.000000)" fill="#77D4B6"> <path d="M645.990672,477.402355 C641.043664,460.908326 633.896151,457.060819 617.402122,462.009328 C600.909592,466.956336 597.060585,474.103849 602.009094,490.597878 C606.957603,507.090408 614.105116,510.939415 630.597645,505.990906 C647.091674,501.042397 650.939181,493.894884 645.990672,477.402355 M637.649158,488.109374 L634.539652,489.150376 L635.616654,492.369382 C636.053155,493.671384 635.351154,495.081386 634.047651,495.517887 C633.764151,495.613887 633.47615,495.654387 633.19415,495.646887 C632.177148,495.619887 631.239646,494.968886 630.899146,493.948884 L629.820644,490.731379 L623.408132,492.879383 L624.485134,496.096888 C624.921635,497.400391 624.219634,498.810393 622.916131,499.246894 C622.632631,499.341394 622.34463,499.381894 622.06263,499.374394 C621.045628,499.348894 620.108126,498.696393 619.767626,497.677891 L618.689124,494.458885 L615.579618,495.501387 C615.296118,495.595887 615.006617,495.636387 614.724617,495.628887 C613.709115,495.603387 612.771613,494.950886 612.429613,493.930884 C611.993112,492.628882 612.695113,491.21888 613.998615,490.782379 L617.109621,489.739877 L615.041117,483.567366 L611.931612,484.609868 C611.648111,484.704368 611.360111,484.744868 611.07661,484.737368 C610.061108,484.711868 609.123607,484.059367 608.781606,483.039365 C608.345105,481.737363 609.048607,480.32736 610.350609,479.890859 L613.461614,478.848358 L612.383113,475.630852 C611.946612,474.327349 612.648613,472.917347 613.952115,472.482346 C615.255618,472.045845 616.66562,472.747847 617.102121,474.051349 L618.179123,477.268855 L624.593134,475.120851 L623.514632,471.903345 C623.078132,470.599843 623.781633,469.18984 625.083635,468.75334 C626.387138,468.316839 627.79714,469.02034 628.233641,470.322342 L629.310643,473.541348 L632.421648,472.498846 C633.725151,472.062345 635.133653,472.765847 635.570154,474.067849 C636.006655,475.371351 635.304653,476.781354 634.001151,477.217855 L630.891646,478.258856 L632.958649,484.432867 L636.069655,483.390366 C637.371657,482.955365 638.78166,483.657366 639.21816,484.959368 C639.654661,486.262871 638.95266,487.672873 637.649158,488.109374 Z M619.759676,481.987413 L621.826679,488.159924 L628.240691,486.01192 L626.173687,479.839409 L619.759676,481.987413 Z" id="Slack"> </path> </g> </g> </g></svg>`;
            }
        },

        getOSIconSVG(os) {
            if (os.name === "Windows") {
                return `<svg class="w-full h-full" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="17" y="17" width="10" height="10" fill="#FEBA08"></rect> <rect x="5" y="17" width="10" height="10" fill="#05A6F0"></rect> <rect x="17" y="5" width="10" height="10" fill="#80BC06"></rect> <rect x="5" y="5" width="10" height="10" fill="#F25325"></rect> </g></svg>`;
            } else if (os.name === "Windows Phone") {
                return `<svg class="w-full h-full" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="17" y="17" width="10" height="10" fill="#FEBA08"></rect> <rect x="5" y="17" width="10" height="10" fill="#05A6F0"></rect> <rect x="17" y="5" width="10" height="10" fill="#80BC06"></rect> <rect x="5" y="5" width="10" height="10" fill="#F25325"></rect> </g></svg>`;
            } else if (os.name === "Mac OS") {
                return `<svg class="w-full h-full fill-gray-800 dark:fill-white" viewBox="-45.5 0 350 350" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M213.803394,167.030943 C214.2452,214.609646 255.542482,230.442639 256,230.644727 C255.650812,231.761357 249.401383,253.208293 234.24263,275.361446 C221.138555,294.513969 207.538253,313.596333 186.113759,313.991545 C165.062051,314.379442 158.292752,301.507828 134.22469,301.507828 C110.163898,301.507828 102.642899,313.596301 82.7151126,314.379442 C62.0350407,315.16201 46.2873831,293.668525 33.0744079,274.586162 C6.07529317,235.552544 -14.5576169,164.286328 13.147166,116.18047 C26.9103111,92.2909053 51.5060917,77.1630356 78.2026125,76.7751096 C98.5099145,76.3877456 117.677594,90.4371851 130.091705,90.4371851 C142.497945,90.4371851 165.790755,73.5415029 190.277627,76.0228474 C200.528668,76.4495055 229.303509,80.1636878 247.780625,107.209389 C246.291825,108.132333 213.44635,127.253405 213.803394,167.030988 M174.239142,50.1987033 C185.218331,36.9088319 192.607958,18.4081019 190.591988,0 C174.766312,0.636050225 155.629514,10.5457909 144.278109,23.8283506 C134.10507,35.5906758 125.195775,54.4170275 127.599657,72.4607932 C145.239231,73.8255433 163.259413,63.4970262 174.239142,50.1987249"> </path> </g> </g></svg>`;
            } else if (os.name === "Linux") {
                return `<svg class="w-full h-full" viewBox="-19.5 0 295 295" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1"> <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"> </feOffset> <feGaussianBlur stdDeviation="6.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"> </feGaussianBlur> </filter> <linearGradient x1="48.5477412%" y1="115.276174%" x2="51.0473804%" y2="41.3637237%" id="linearGradient-2"> <stop stop-color="#FFEED7" offset="0%"> </stop> <stop stop-color="#BDBFC2" offset="100%"> </stop> </linearGradient> <linearGradient x1="54.4065463%" y1="2.40410545%" x2="46.1753957%" y2="90.5422349%" id="linearGradient-3"> <stop stop-color="#FFFFFF" stop-opacity="0.8" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> <linearGradient x1="51.859653%" y1="88.2477484%" x2="47.9469396%" y2="9.74782136%" id="linearGradient-4"> <stop stop-color="#FFEED7" offset="0%"> </stop> <stop stop-color="#BDBFC2" offset="100%"> </stop> </linearGradient> <linearGradient x1="49.9251097%" y1="85.4900173%" x2="49.9236843%" y2="13.8109272%" id="linearGradient-5"> <stop stop-color="#FFEED7" offset="0%"> </stop> <stop stop-color="#BDBFC2" offset="100%"> </stop> </linearGradient> <linearGradient x1="53.9014071%" y1="3.10177585%" x2="45.9555354%" y2="93.8949571%" id="linearGradient-6"> <stop stop-color="#FFFFFF" stop-opacity="0.65" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> <linearGradient x1="45.5928761%" y1="5.47459052%" x2="54.811359%" y2="93.5235162%" id="linearGradient-7"> <stop stop-color="#FFFFFF" stop-opacity="0.65" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> <linearGradient x1="49.9844987%" y1="89.8452442%" x2="49.9844987%" y2="40.6316864%" id="linearGradient-8"> <stop stop-color="#FFEED7" offset="0%"> </stop> <stop stop-color="#BDBFC2" offset="100%"> </stop> </linearGradient> <linearGradient x1="53.5047131%" y1="99.97524%" x2="42.7455968%" y2="23.5451715%" id="linearGradient-9"> <stop stop-color="#FFEED7" offset="0%"> </stop> <stop stop-color="#BDBFC2" offset="100%"> </stop> </linearGradient> <linearGradient x1="49.8413363%" y1="13.2289558%" x2="50.2412612%" y2="94.6729694%" id="linearGradient-10"> <stop stop-color="#FFFFFF" stop-opacity="0.8" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> <linearGradient x1="49.9272298%" y1="37.3270337%" x2="50.7270446%" y2="92.7824735%" id="linearGradient-11"> <stop stop-color="#FFFFFF" stop-opacity="0.65" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> <linearGradient x1="49.8755597%" y1="2.29900584%" x2="49.8755597%" y2="81.203617%" id="linearGradient-12"> <stop stop-color="#FFFFFF" stop-opacity="0.65" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> <linearGradient x1="49.8334391%" y1="2.27189065%" x2="49.8240398%" y2="71.7989617%" id="linearGradient-13"> <stop stop-color="#FFFFFF" stop-opacity="0.65" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> <linearGradient x1="53.4670683%" y1="48.9213861%" x2="38.9488708%" y2="98.0999776%" id="linearGradient-14"> <stop stop-color="#FFA63F" offset="0%"> </stop> <stop stop-color="#FFFF00" offset="100%"> </stop> </linearGradient> <linearGradient x1="52.3731508%" y1="143.008909%" x2="47.57909%" y2="-64.6215389%" id="linearGradient-15"> <stop stop-color="#FFEED7" offset="0%"> </stop> <stop stop-color="#BDBFC2" offset="100%"> </stop> </linearGradient> <linearGradient x1="30.580815%" y1="34.0241079%" x2="65.8867024%" y2="89.175349%" id="linearGradient-16"> <stop stop-color="#FFA63F" offset="0%"> </stop> <stop stop-color="#FFFF00" offset="100%"> </stop> </linearGradient> <linearGradient x1="59.5715091%" y1="-17.2155207%" x2="48.3608522%" y2="66.1184465%" id="linearGradient-17"> <stop stop-color="#FFFFFF" stop-opacity="0.65" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> <linearGradient x1="47.7689553%" y1="1.56481301%" x2="51.3733028%" y2="104.312856%" id="linearGradient-18"> <stop stop-color="#FFFFFF" stop-opacity="0.65" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> <linearGradient x1="43.5495626%" y1="4.5334861%" x2="57.1143288%" y2="92.8267174%" id="linearGradient-19"> <stop stop-color="#FFFFFF" stop-opacity="0.65" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> <linearGradient x1="49.7328042%" y1="17.6085216%" x2="50.5582487%" y2="99.3854667%" id="linearGradient-20"> <stop stop-color="#FFA63F" offset="0%"> </stop> <stop stop-color="#FFFF00" offset="100%"> </stop> </linearGradient> <linearGradient x1="50.1697217%" y1="2.89048531%" x2="49.6802359%" y2="94.1704279%" id="linearGradient-21"> <stop stop-color="#FFFFFF" stop-opacity="0.65" offset="0%"> </stop> <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"> </stop> </linearGradient> </defs> <g fill="none"> <g transform="translate(10.000000, 0.000000)"> <path d="M235.125423,249.358628 C235.125423,266.714271 182.507524,280.855905 117.584567,280.855905 C52.6616093,280.855905 0.0437105058,266.806099 0.0437105058,249.358628 L0.0437105058,249.358628 C0.0437105058,232.002986 52.6616093,217.861352 117.584567,217.861352 C182.507524,217.861352 235.033594,232.002986 235.125423,249.358628 L235.125423,249.358628 L235.125423,249.358628 Z" fill="#000000" fill-opacity="0.2" filter="url(#filter-1)"> </path> <path d="M53.2125821,215.473804 C41.8258117,199.128278 39.6219206,145.867578 66.160442,113.084699 C79.2919595,97.3819748 82.6896249,86.4543483 83.6997416,71.6699125 C84.434372,54.8652433 71.8538272,4.81855066 119.237485,1.05357012 C167.263944,-2.80323922 164.600909,44.5804184 164.325423,69.6496791 C164.141765,90.7703016 179.844489,102.799874 190.680286,119.329056 C210.607135,149.632558 208.954216,201.791313 186.915306,230.074582 C158.999353,265.428667 135.123866,250.093259 119.237485,251.378862 C89.4849556,253.123609 88.4748389,268.918162 53.2125821,215.473804 L53.2125821,215.473804 Z" fill="#000000"> </path> <path d="M169.10052,122.451235 C177.365111,130.073025 198.76122,164.141508 164.876395,185.445788 C152.938652,192.88392 175.528535,221.167189 186.364333,207.484699 C205.556551,182.874582 193.343321,143.571858 181.772893,129.522053 C174.059275,119.604543 162.121532,115.747734 169.10052,122.451235 L169.10052,122.451235 Z" fill="url(#linearGradient-2)"> </path> <path d="M166.8048,117.859796 C180.395461,128.879251 205.097407,167.447344 169.008691,192.608434 C157.162777,200.413881 179.477174,225.115827 192.057718,212.535282 C235.676395,168.641119 190.955773,118.227111 175.528535,100.871469 C161.754216,85.719718 149.540987,104.360963 166.8048,117.859796 L166.8048,117.859796 Z" stroke="#000000" stroke-width="0.9773" fill="#000000"> </path> <path d="M147.245267,25.0208853 C146.786123,37.60143 132.919975,48.5290565 116.298963,49.5391732 C99.6779518,50.54929 86.638263,40.9990954 87.097407,28.4185507 L87.097407,28.4185507 C87.556551,15.8380059 101.422699,4.91037946 118.043711,3.90026272 C134.664722,2.98197479 147.704411,12.4403405 147.245267,25.0208853 L147.245267,25.0208853 L147.245267,25.0208853 Z" fill="url(#linearGradient-3)"> </path> <path d="M107.483399,54.9570721 C107.942543,63.1298347 104.085734,70.0169942 98.7596638,70.2924806 C93.4335938,70.567967 88.7503253,64.2317802 88.2911813,56.0590176 L88.2911813,56.0590176 C87.8320374,47.8862549 91.6888467,40.9990954 97.0149167,40.723609 C102.340987,40.4481226 107.024255,46.7843094 107.483399,54.9570721 L107.483399,54.9570721 L107.483399,54.9570721 Z" fill="url(#linearGradient-4)"> </path> <path d="M117.125423,55.5998736 C117.30908,65.0582394 123.461609,72.5882005 130.807913,72.4045429 C138.154216,72.2208853 143.93943,64.4154378 143.755773,54.8652433 L143.755773,54.8652433 C143.572115,45.4068775 137.419586,37.8769164 130.073282,38.060574 C122.726979,38.2442316 116.849936,46.1415079 117.125423,55.5998736 L117.125423,55.5998736 L117.125423,55.5998736 Z" fill="url(#linearGradient-5)"> </path> <path d="M123.186123,57.7119359 C123.094294,62.9461771 125.6655,67.1703016 129.063166,67.1703016 C132.369002,67.1703016 135.215695,62.9461771 135.307524,57.8037647 L135.307524,57.8037647 C135.399353,52.5695234 132.828146,48.3453989 129.430481,48.3453989 C126.032816,48.3453989 123.277952,52.5695234 123.186123,57.7119359 L123.186123,57.7119359 L123.186123,57.7119359 Z" fill="#000000"> </path> <path d="M101.973672,57.8037647 C102.432816,62.119718 100.779897,65.7928697 98.3923486,66.1601849 C96.0048,66.4356713 93.7090802,63.2216635 93.2499362,58.9057102 L93.2499362,58.9057102 C92.7907922,54.5897569 94.4437105,50.9166051 96.8312591,50.54929 C99.2188078,50.2738036 101.514528,53.4878114 101.973672,57.8037647 L101.973672,57.8037647 L101.973672,57.8037647 Z" fill="#000000"> </path> <path d="M124.563555,54.7734145 C124.288068,57.7119359 125.6655,60.0994845 127.593905,60.2831421 C129.52231,60.4667997 131.358886,58.1710798 131.634372,55.3243872 L131.634372,55.3243872 C131.909858,52.3858658 130.532426,49.9983172 128.604022,49.8146596 C126.675617,49.631002 124.839041,51.9267219 124.563555,54.7734145 L124.563555,54.7734145 L124.563555,54.7734145 Z" fill="url(#linearGradient-6)"> </path> <path d="M99.9534381,55.5080448 C100.228925,57.8955935 99.2188078,60.0076557 97.7495471,60.1913133 C96.2802864,60.3749709 94.9028545,58.538395 94.6273681,56.0590176 L94.6273681,56.0590176 C94.3518817,53.6714689 95.3619984,51.5594067 96.8312591,51.3757491 C98.3005198,51.1920915 99.6779518,53.1204962 99.9534381,55.5080448 L99.9534381,55.5080448 L99.9534381,55.5080448 Z" fill="url(#linearGradient-7)"> </path> <path d="M71.0273681,145.68392 C77.5472125,130.899485 91.4133603,104.911936 91.6888467,84.80143 C91.6888467,68.8232199 139.531648,64.9664106 143.388458,80.9446207 C147.245267,96.9228308 156.979119,120.798317 163.223477,132.368745 C169.467835,143.847344 187.558107,180.487033 168.274061,212.443453 C150.918419,240.726722 98.3005198,263.132948 70.2009089,208.586644 C60.6507144,189.669913 62.3954615,166.25357 71.0273681,145.68392 L71.0273681,145.68392 Z" fill="url(#linearGradient-8)"> </path> <path d="M65.1503253,134.664465 C59.5487689,145.224776 47.9783409,172.957072 76.2616093,188.108823 C106.65694,204.270691 106.565111,237.420885 70.0172514,221.626333 C36.5915704,207.39287 51.3760062,149.724387 60.7425432,135.950068 C66.8032436,126.308045 75.986123,114.46213 65.1503253,134.664465 L65.1503253,134.664465 Z" fill="url(#linearGradient-9)"> </path> <path d="M69.9254226,122.726722 C61.0180296,137.235671 39.7137494,171.395983 68.2725043,189.210769 C106.65694,212.810769 95.8211424,236.31894 60.7425432,215.106488 C11.3386521,185.537617 54.7736716,125.848901 74.5168623,103.07536 C97.1067455,77.5469553 78.8328156,107.758628 69.9254226,122.726722 L69.9254226,122.726722 Z" stroke="#000000" stroke-width="1.25" fill="#000000"> </path> <path d="M156.428146,151.285477 C156.428146,167.447344 140.90908,188.384309 114.27873,188.200652 C86.8219206,188.384309 75.1596638,167.447344 75.1596638,151.285477 C75.1596638,135.123609 93.341765,121.992092 115.747991,121.992092 C138.246045,122.08392 156.428146,135.123609 156.428146,151.285477 L156.428146,151.285477 Z" fill="url(#linearGradient-10)"> </path> <path d="M141.919197,100.504154 C141.643711,117.216994 130.716084,121.165632 116.941765,121.165632 C103.167446,121.165632 93.1581074,118.686255 91.9643331,100.504154 C91.9643331,89.1173833 103.167446,82.5057102 116.941765,82.5057102 C130.716084,82.4138814 141.919197,89.0255546 141.919197,100.504154 L141.919197,100.504154 Z" fill="url(#linearGradient-11)"> </path> <path d="M58.6304809,126.216216 C67.6297027,112.533726 86.638263,91.504932 62.2118039,129.154737 C42.3767844,160.19287 54.8655004,180.119718 61.293516,185.629446 C79.8429323,202.158628 79.1083019,213.269913 64.5075237,204.546177 C33.1939051,185.904932 39.7137494,154.499485 58.6304809,126.216216 L58.6304809,126.216216 Z" fill="url(#linearGradient-12)"> </path> <path d="M188.935539,131.817772 C181.130092,115.747734 156.336318,74.9757491 190.129314,122.359407 C220.89196,165.243453 199.312193,195.087811 195.455384,198.026333 C191.598574,200.964854 178.650714,206.933726 182.415695,196.557072 C186.272504,186.180418 205.372893,166.529056 188.935539,131.817772 L188.935539,131.817772 Z" fill="url(#linearGradient-13)"> </path> <path d="M51.8351502,258.541508 C31.2655004,247.613881 1.42114241,260.65357 12.2569401,231.084699 C14.4608311,224.381197 9.0429323,214.280029 12.5324265,207.760185 C16.6647222,199.77108 25.5721152,201.515827 30.8981852,196.189757 C36.1324265,190.680029 39.438263,181.129835 49.263944,182.599095 C58.9977961,184.068356 65.5176405,196.006099 72.3129712,210.698706 C77.3635549,221.167189 95.1783409,235.951625 93.9845665,247.70571 C92.5153058,265.704154 72.0374848,269.101819 51.8351502,258.541508 L51.8351502,258.541508 Z" stroke="#E68C3F" stroke-width="6.25" fill="url(#linearGradient-14)"> </path> <path d="M201.607913,189.11894 C198.485734,194.995983 185.446045,204.454348 176.72231,201.974971 C167.906746,199.587422 163.866279,186.180418 165.611026,175.987422 C167.263944,164.600652 176.72231,163.95785 188.660053,169.651235 C201.516084,175.987422 205.372893,181.313492 201.607913,189.11894 L201.607913,189.11894 Z" fill="url(#linearGradient-15)"> </path> <path d="M194.445267,253.490924 C209.505189,235.216994 243.022699,238.981975 220.432816,213.912714 C215.657718,208.494815 217.126979,196.924387 211.249936,191.965632 C204.362777,185.904932 196.740987,190.863687 189.761998,187.741508 C182.78301,184.343842 175.436707,177.823998 166.896629,182.415438 C158.356551,187.098706 157.438263,199.220107 156.611804,215.198317 C155.877174,226.676916 145.408691,245.869134 151.010247,256.429446 C159.091181,272.774971 180.119975,270.57108 194.445267,253.490924 L194.445267,253.490924 Z" stroke="#E68C3F" stroke-width="6.2507" fill="url(#linearGradient-16)"> </path> <path d="M187.925423,229.064465 C211.249936,194.628667 193.894294,194.904154 188.017251,192.241119 C182.140209,189.486255 175.987679,184.068356 169.10052,187.833337 C162.21336,191.690146 161.846045,201.607656 161.662388,214.647344 C161.386901,224.013881 153.581454,239.716605 158.264722,248.440341 C163.958107,258.633337 177.732426,243.848901 187.925423,229.064465 L187.925423,229.064465 Z" fill="url(#linearGradient-17)"> </path> <path d="M47.0600529,234.02322 C12.1651113,211.433337 28.5106366,203.719718 33.7448778,200.138395 C40.0810646,195.546955 40.1728934,186.731391 47.9783409,187.55785 C55.7837883,188.384309 60.375228,198.026333 65.6094693,209.964076 C69.4662786,218.504154 82.8732825,229.890924 81.8631658,239.716605 C80.5775626,251.287033 62.1199751,243.665243 47.0600529,234.02322 L47.0600529,234.02322 Z" fill="url(#linearGradient-18)"> </path> <path d="M199.587679,188.843453 C196.832816,193.618551 185.629703,201.148512 178.19157,199.128278 C170.569781,197.199874 167.080286,186.455905 168.641376,178.374971 C170.018808,169.192092 178.19157,168.732948 188.476395,173.324387 C199.404022,178.283142 202.801687,182.507267 199.587679,188.843453 L199.587679,188.843453 Z" fill="#000000"> </path> <path d="M192.057718,186.180418 C190.312971,189.486255 182.966668,194.720496 177.824255,193.343064 C172.681843,191.965632 170.110637,184.5275 170.937096,178.925944 C171.671726,172.589757 177.181454,172.222442 184.160442,175.344621 C191.690403,178.834115 194.077952,181.772636 192.057718,186.180418 L192.057718,186.180418 Z" fill="url(#linearGradient-19)"> </path> <path d="M97.1067455,66.3438425 C100.779897,62.9461771 109.68729,52.5695234 126.583788,63.4053211 C129.705967,65.4255546 132.277174,65.6092121 138.246045,68.1804184 C150.275617,73.1391732 144.582232,85.0769164 131.726201,89.1173833 C126.216473,90.8621304 121.257718,97.5656324 111.340209,96.9228308 C102.800131,96.4636868 100.59624,90.8621304 95.3619984,87.8317802 C86.0872903,82.597539 84.7098584,75.5267219 89.760442,71.7617413 C94.8110257,67.9967608 96.7394304,66.6193289 97.1067455,66.3438425 L97.1067455,66.3438425 Z" stroke="#E68C3F" stroke-width="3.75" fill="url(#linearGradient-20)"> </path> <path d="M138.429703,75.9858658 C133.379119,76.2613522 122.451493,87.1889787 110.972893,87.1889787 C99.4942942,87.1889787 92.6071346,76.5368386 90.8623875,76.5368386" stroke="#E68C3F" stroke-width="2.5"> </path> <path d="M102.800131,65.4255546 C104.636707,63.7726363 110.421921,59.2730254 118.043711,63.8644651 C119.696629,64.782753 121.349547,65.7928697 123.737096,67.1703016 C128.604022,70.0169942 126.216473,74.14929 120.33943,76.7204962 C117.676395,77.8224417 113.268613,80.2099904 109.962777,80.0263328 C106.289625,79.6590176 103.810247,77.2714689 101.422699,75.7103795 C96.9230879,72.7718581 97.1985743,70.2924806 99.3106366,68.364076 C100.871726,66.8948153 102.616473,65.5173833 102.800131,65.4255546 L102.800131,65.4255546 Z" fill="url(#linearGradient-21)"> </path> </g> </g> </g></svg>`;
            } else if (os.name === "Android") {
                return `<svg class="w-full h-full" viewBox="-45.5 0 350 350" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M78.3890161,0.858476242 C76.9846593,0.871877584 75.5269206,1.21067383 74.1988355,1.94683705 C69.9813154,4.28464966 68.4344792,9.70448752 70.7705059,13.9187887 L80.2936432,31.1148585 C57.3501835,45.3109605 42.146676,69.5583356 42.146676,97.23264 C42.146676,97.3488107 42.1463538,97.5233203 42.146676,97.6951925 C42.1467894,97.7558421 42.1461099,97.7904107 42.146676,97.8584397 C42.1467112,97.9488816 42.146676,98.0809536 42.146676,98.1033235 L42.146676,102.37513 C37.7401995,97.3051619 31.2627337,94.103607 24.0255064,94.103607 C10.766574,94.103607 0,104.870185 0,118.129121 L0,192.137501 C0,205.396437 10.766574,216.163015 24.0255064,216.163015 C31.2627337,216.163015 37.7401995,212.96146 42.146676,207.891492 L42.146676,218.258109 C42.146676,232.234601 53.5833566,243.671281 67.5598484,243.671281 L74.0083724,243.671281 L74.0083724,276.594135 C74.0083724,289.853131 84.774955,300.619649 98.0338856,300.619649 C111.292821,300.619649 122.0594,289.853131 122.0594,276.594135 L122.0594,243.671281 L133.215081,243.671281 L133.215081,276.594135 C133.215081,289.853131 143.981659,300.619649 157.240595,300.619649 C170.499522,300.619649 181.266118,289.853131 181.266118,276.594135 L181.266118,243.671281 L187.714637,243.671281 C201.691129,243.671281 213.127809,232.234601 213.127809,218.258109 L213.127809,207.891492 C217.534299,212.96146 224.011752,216.163015 231.248984,216.163015 C244.507919,216.163015 255.274498,205.396437 255.274498,192.137501 L255.274498,118.129121 C255.274498,104.870185 244.507919,94.103607 231.248984,94.103607 C224.011752,94.103607 217.534299,97.3051619 213.127809,102.37513 L213.127809,98.1849514 L213.127809,98.1033407 C213.128367,97.9723769 213.127955,97.8421262 213.127809,97.8584655 C213.129527,97.5976548 213.127809,97.3898395 213.127809,97.2326572 C213.127809,69.5631979 197.890397,45.339215 174.95363,31.1420821 L184.503985,13.918763 C186.840011,9.70446174 185.293178,4.28462389 181.075655,1.94681128 C179.747565,1.21064805 178.289834,0.871868993 176.885477,0.85845047 C173.770979,0.828641074 170.714038,2.4700306 169.103704,5.37514094 L159.118011,23.4146964 C149.353914,19.811505 138.730068,17.8368515 127.637245,17.8368515 C116.555726,17.8368515 105.912363,19.7912913 96.1564693,23.3874813 L86.1707769,5.37514094 C84.5604527,2.47002201 81.503506,0.828709799 78.3890161,0.85845047 L78.3890161,0.858476242 Z" fill="#FFFFFF"> </path> <path d="M24.0260725,100.361664 C14.1317,100.361664 6.25861893,108.234747 6.25861893,118.129121 L6.25861893,192.137501 C6.25861893,202.031875 14.1317,209.904958 24.0260725,209.904958 C33.9204441,209.904958 41.7935257,202.031875 41.7935257,192.137501 L41.7935257,118.129121 C41.7935257,108.234747 33.9204441,100.361664 24.0260725,100.361664 L24.0260725,100.361664 Z M231.249551,100.361664 C221.355176,100.361664 213.482094,108.234747 213.482094,118.129121 L213.482094,192.137501 C213.482094,202.031875 221.355176,209.904958 231.249551,209.904958 C241.143925,209.904958 249.016999,202.031875 249.016999,192.137501 L249.016999,118.129121 C249.016999,108.234747 241.143925,100.361664 231.249551,100.361664 L231.249551,100.361664 Z" fill="#A4C639"> </path> <path d="M98.0338856,184.818075 C88.1395114,184.818075 80.2664341,192.691157 80.2664341,202.585531 L80.2664341,276.593963 C80.2664341,286.488363 88.1395114,294.361308 98.0338856,294.361308 C107.92826,294.361308 115.801342,286.488363 115.801342,276.593963 L115.801342,202.585531 C115.801342,192.691157 107.92826,184.818075 98.0338856,184.818075 L98.0338856,184.818075 Z M157.240595,184.818075 C147.346221,184.818075 139.473138,192.691157 139.473138,202.585531 L139.473138,276.593963 C139.473138,286.488363 147.346221,294.361308 157.240595,294.361308 C167.134969,294.361308 175.008043,286.488363 175.008043,276.593963 L175.008043,202.585531 C175.008043,192.691157 167.134969,184.818075 157.240595,184.818075 L157.240595,184.818075 Z" fill="#A4C639"> </path> <path d="M78.4434341,7.11654228 C78.0234231,7.12083758 77.6320498,7.22919946 77.2462398,7.44304537 C75.9792855,8.14533584 75.5626532,9.60121987 76.2667168,10.8713836 L88.782836,33.4820338 C64.7023936,46.0117562 48.4373365,69.8232526 48.4047377,97.1510121 L206.869751,97.1510121 C206.837193,69.8232526 190.572096,46.0117562 166.491645,33.4820338 L179.007777,10.8713836 C179.711837,9.60121987 179.295201,8.14533584 178.02825,7.44304537 C177.642438,7.22919946 177.251067,7.1205455 176.831055,7.11654228 C175.931919,7.10786577 175.079646,7.55712 174.599912,8.42257181 L161.920533,31.2781058 C151.548297,26.6773219 139.914231,24.0949434 127.637245,24.0949434 C115.360249,24.0949434 103.726174,26.6773219 93.3539479,31.2781058 L80.6745686,8.42257181 C80.1948375,7.55712 79.3425576,7.10791732 78.4434341,7.11654228 L78.4434341,7.11654228 Z M48.4047377,103.40907 L48.4047377,218.258109 C48.4047377,228.870039 56.9479173,237.413214 67.5598484,237.413214 L187.714637,237.413214 C198.326576,237.413214 206.869751,228.870039 206.869751,218.258109 L206.869751,103.40907 L48.4047377,103.40907 L48.4047377,103.40907 Z" fill="#A4C639"> </path> <path d="M91.0681772,54.9226953 C87.4507168,54.9226953 84.4563973,57.9170105 84.4563973,61.5344795 C84.4563973,65.1519399 87.4507168,68.146255 91.0681772,68.146255 C94.6856376,68.146255 97.6799528,65.1519399 97.6799528,61.5344795 C97.6799528,57.9170105 94.6856376,54.9226953 91.0681772,54.9226953 L91.0681772,54.9226953 Z M164.205874,54.9226953 C160.588413,54.9226953 157.59409,57.9170105 157.59409,61.5344795 C157.59409,65.1519399 160.588413,68.146255 164.205874,68.146255 C167.823326,68.146255 170.817649,65.1519399 170.817649,61.5344795 C170.817649,57.9170105 167.823326,54.9226953 164.205874,54.9226953 L164.205874,54.9226953 Z" fill="#FFFFFF"> </path> </g> </g></svg>`;
            } else if (os.name === "iOS") {
                return `<svg class="w-full h-full" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M30 16C30 23.728 23.735 30 16 30C8.265 30 2 23.728 2 16C2 8.265 8.265 2 16 2C23.735 2 30 8.265 30 16Z" fill="#283544"></path> <path d="M7.08597 20.8394H8.61506V13.7443H7.08597V20.8394ZM7.84745 12.8139C8.3203 12.8139 8.70103 12.4123 8.70103 11.9103C8.70103 11.3949 8.3203 11 7.84745 11C7.38074 11 7 11.3949 7 11.9103C7 12.4123 7.38074 12.8139 7.84745 12.8139Z" fill="white"></path> <path d="M13.9577 11.0201C11.3723 11.0201 9.75113 12.9411 9.75113 16.0134C9.75113 19.0857 11.3723 21 13.9577 21C16.5368 21 18.158 19.0857 18.158 16.0134C18.158 12.9411 16.5368 11.0201 13.9577 11.0201ZM13.9577 12.4926C15.5359 12.4926 16.543 13.8581 16.543 16.0134C16.543 18.162 15.5359 19.5274 13.9577 19.5274C12.3733 19.5274 11.3723 18.162 11.3723 16.0134C11.3723 13.8581 12.3733 12.4926 13.9577 12.4926Z" fill="white"></path> <path d="M19.0608 18.1218C19.1283 19.9023 20.467 21 22.5058 21C24.649 21 26 19.8487 26 18.0147C26 16.5756 25.2385 15.7657 23.4392 15.3173L22.4198 15.0629C21.3329 14.7818 20.8846 14.407 20.8846 13.7644C20.8846 12.9612 21.5601 12.4257 22.5611 12.4257C23.5743 12.4257 24.2683 12.9679 24.342 13.8715H25.8526C25.8158 12.1714 24.5262 11.0201 22.5734 11.0201C20.6451 11.0201 19.2757 12.178 19.2757 13.8916C19.2757 15.2704 20.0495 16.1272 21.6829 16.5355L22.8313 16.83C23.9489 17.1178 24.4034 17.5194 24.4034 18.2155C24.4034 19.0187 23.6603 19.5944 22.5918 19.5944C21.511 19.5944 20.6942 19.012 20.596 18.1218H19.0608Z" fill="white"></path> </g></svg>`;
            } else if (os.name === 'BlackBerry') {
                return `<svg class="w-full h-full" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M30 16C30 23.728 23.735 30 16 30C8.265 30 2 23.728 2 16C2 8.265 8.265 2 16 2C23.735 2 30 8.265 30 16Z" fill="#1D1D1D"></path> <path d="M8.95479 8L7.97739 12H11.3381C12.2351 12 13.017 11.3754 13.2345 10.4851C13.543 9.22278 12.6098 8 11.3381 8H8.95479Z" fill="white"></path> <path d="M7.97739 14L7 18H10.3607C11.2577 18 12.0396 17.3754 12.2571 16.4851C12.5656 15.2228 11.6325 14 10.3607 14H7.97739Z" fill="white"></path> <path d="M13.8418 18L14.8192 14H17.2025C18.4742 14 19.4073 15.2228 19.0989 16.4851C18.8814 17.3754 18.0995 18 17.2025 18H13.8418Z" fill="white"></path> <path d="M13.8418 20L12.8644 24H16.2251C17.1221 24 17.904 23.3754 18.1215 22.4851C18.43 21.2228 17.4968 20 16.2251 20H13.8418Z" fill="white"></path> <path d="M23.0669 22H19.7061L20.6835 18H23.0669C24.3386 18 25.2717 19.2228 24.9633 20.4851C24.7457 21.3754 23.9638 22 23.0669 22Z" fill="white"></path> <path d="M21.6609 12L20.6835 16H24.0442C24.9412 16 25.7231 15.3754 25.9407 14.4851C26.2491 13.2228 25.316 12 24.0442 12H21.6609Z" fill="white"></path> <path d="M14.8192 12L15.7966 8H18.1799C19.4516 8 20.3847 9.22278 20.0763 10.4851C19.8588 11.3754 19.0769 12 18.1799 12H14.8192Z" fill="white"></path> </g></svg>`;
            } else {
                return `<svg class="bg-yellow-400 text-black w-full h-full scale-[0.85] rounded-2xl" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill="currentColor" d="M9.5 4.75C8.7574 4.75 8.14227 5.03635 7.7208 5.5105C7.31228 5.97009 7.125 6.56049 7.125 7.125C7.125 8.11777 7.70613 8.80342 8.084 9.24925L8.10422 9.27311C8.55066 9.80024 8.70833 10.0224 8.70833 10.2917C8.70833 10.7289 9.06277 11.0833 9.5 11.0833C9.93723 11.0833 10.2917 10.7289 10.2917 10.2917C10.2917 9.39426 9.73429 8.74298 9.38019 8.32923C9.35663 8.30171 9.33398 8.27524 9.31245 8.24982C8.89774 7.76016 8.70833 7.48237 8.70833 7.125C8.70833 6.89785 8.78494 6.69658 8.9042 6.56241C9.0105 6.44282 9.18705 6.33333 9.5 6.33333C9.81295 6.33333 9.9895 6.44282 10.0958 6.56241C10.2151 6.69658 10.2917 6.89785 10.2917 7.125C10.2917 7.56223 10.6461 7.91667 11.0833 7.91667C11.5206 7.91667 11.875 7.56223 11.875 7.125C11.875 6.56049 11.6877 5.97009 11.2792 5.5105C10.8577 5.03635 10.2426 4.75 9.5 4.75Z"></path>
								<path fill="currentColor" d="M9.5 11.875C9.06277 11.875 8.70833 12.2294 8.70833 12.6667C8.70833 13.1039 9.06277 13.4583 9.5 13.4583C9.93723 13.4583 10.2917 13.1039 10.2917 12.6667C10.2917 12.2294 9.93723 11.875 9.5 11.875Z"></path>
							</svg>`;
            }
        },

        onUserDeleted() {
            this.$router.replace({ name: "admin-users-list" });
        },
    },

    mounted() {
        document.title = 'مدیریت کاربر-بخش امنیت';
        this.getAllAccess();
        this.getUserSecurity();
    }
}
</script>

