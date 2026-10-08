<template>
    <AdminMasterPage
        breadcrumb-title-override="دسترسی محدود"
        breadcrumb-subtitle-override="مجوز کافی برای این بخش وجود ندارد">
        <div class="flex min-h-[calc(100vh-9rem)] items-center justify-center px-4 py-8">
            <div
                class="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-600/40 dark:bg-gray-900">
                <!-- illustration header -->
                <div class="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-yellow-50/80 px-6 pt-8 pb-6 dark:from-amber-500/5 dark:via-gray-900 dark:to-yellow-500/5">
                    <!-- bg shapes -->
                    <div class="pointer-events-none absolute -start-6 -top-6 h-28 w-28 rounded-full bg-amber-200/30 blur-2xl dark:bg-amber-500/10" />
                    <div class="pointer-events-none absolute -bottom-4 end-0 h-24 w-24 rounded-full bg-yellow-300/25 blur-2xl dark:bg-yellow-400/10" />
                    <svg class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35] dark:opacity-[0.12]"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="forbidden-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="1" cy="1" r="0.8" fill="currentColor" class="text-amber-400/60" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#forbidden-grid)" />
                    </svg>

                    <!-- main svg -->
                    <div class="relative mx-auto flex h-36 w-full max-w-[13rem] items-end justify-center">
                        <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-full w-full">
                            <!-- shield -->
                            <path
                                d="M100 12L148 32V72C148 98 128 118 100 128C72 118 52 98 52 72V32L100 12Z"
                                class="fill-amber-100 stroke-amber-300 dark:fill-amber-500/15 dark:stroke-amber-500/40"
                                stroke-width="2" stroke-linejoin="round" />
                            <path
                                d="M100 24L136 40V70C136 90 120 104 100 112C80 104 64 90 64 70V40L100 24Z"
                                class="fill-white/80 dark:fill-gray-800/60" />
                            <!-- lock body -->
                            <rect x="82" y="62" width="36" height="30" rx="6"
                                class="fill-amber-400 stroke-amber-500 dark:fill-amber-500 dark:stroke-amber-400"
                                stroke-width="1.5" />
                            <!-- lock shackle -->
                            <path d="M88 62V54C88 45.716 94.716 39 103 39H97C105.284 39 112 45.716 112 54V62"
                                class="stroke-amber-600 dark:stroke-amber-300" stroke-width="3" stroke-linecap="round"
                                fill="none" />
                            <!-- keyhole -->
                            <circle cx="100" cy="74" r="3" class="fill-white dark:fill-gray-900" />
                            <path d="M100 77V82" class="stroke-white dark:stroke-gray-900" stroke-width="2"
                                stroke-linecap="round" />
                            <!-- decorative bars -->
                            <rect x="24" y="108" width="152" height="10" rx="5"
                                class="fill-amber-200/70 dark:fill-amber-500/20" />
                            <rect x="36" y="122" width="32" height="8" rx="4" class="fill-amber-300/60 dark:fill-amber-500/25" />
                            <rect x="132" y="122" width="32" height="8" rx="4" class="fill-amber-300/60 dark:fill-amber-500/25" />
                        </svg>
                        <span
                            class="absolute start-0 top-0 rounded-lg bg-rose-500 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white shadow-sm">
                            403
                        </span>
                    </div>
                </div>

                <!-- content -->
                <div class="px-6 pb-6 pt-5 text-center">
                    <h1 class="text-base font-bold text-gray-800 dark:text-gray-100">
                        دسترسی به این صفحه مجاز نیست
                    </h1>
                    <p class="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500 dark:text-gray-400">
                        حساب شما دسترسی لازم برای این بخش را ندارد. در صورت نیاز با مدیر سیستم تماس بگیرید.
                    </p>

                    <div
                        v-if="attemptedPath"
                        class="mx-auto mt-4 flex max-w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500 ring-1 ring-gray-200/80 dark:bg-gray-800/50 dark:text-gray-400 dark:ring-gray-700/50">
                        <svg class="h-3.5 w-3.5 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor"
                                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor"
                                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span dir="ltr" class="truncate font-medium">{{ attemptedPath }}</span>
                    </div>

                    <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <router-link
                            :to="{ name: 'admin-index' }"
                            class="group inline-flex h-9 select-none items-center gap-2 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-amber-500 dark:text-gray-900 dark:hover:bg-amber-400">
                            <span class="flex items-center gap-2 group-active:[transform:translate3d(0,1px,0)]">
                                <svg class="h-4 w-4 rtl:-mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
                                        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                    <path d="M9 21V12H15V21" stroke="currentColor" stroke-width="1.5"
                                        stroke-linejoin="round" />
                                </svg>
                                بازگشت به داشبورد
                            </span>
                        </router-link>
                        <button
                            type="button"
                            @click="goBack"
                            class="group inline-flex h-9 select-none items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-gray-700 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] transition hover:bg-zinc-100 dark:bg-gray-800 dark:text-gray-200 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset] dark:hover:bg-gray-700">
                            <span class="flex items-center gap-2 group-active:[transform:translate3d(0,1px,0)]">
                                صفحه قبل
                                <svg class="h-4 w-4 ltr:rotate-180" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="currentColor" stroke-width="1.5"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                               
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from '@/views/page/admin/layouts/AdminMasterPage.vue';

export default {
    name: 'AdminForbidden',
    components: { AdminMasterPage },
    computed: {
        attemptedPath() {
            return this.$route.query.from || this.$route.redirectedFrom?.fullPath || null;
        },
    },
    methods: {
        goBack() {
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.push({ name: 'admin-index' });
            }
        },
    },
};
</script>
