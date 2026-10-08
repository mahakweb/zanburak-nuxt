<template>
    <div class="relative">
    <div v-if="!loading">
        <div v-if="walletBalance !== null || activePlan !== undefined" class="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            <AdminReportStatCard title="موجودی کیف پول" :value="formatNumber(walletBalance ?? 0)" accent="violet" value-dir="ltr" />
            <AdminReportStatCard title="اشتراک فعال" :value="activePlan ? activePlan.title : 'ندارد'" accent="amber" />
            <AdminReportStatCard title="تاریخچه اشتراک" :value="formatNumber(subscriptionHistory?.length ?? 0)" accent="emerald" subtitle="مورد ثبت‌شده" />
        </div>

        <div class="mb-6 rounded-2xl border border-gray-200/80 bg-white p-4 md:p-5 dark:border-gray-700/80 dark:bg-gray-900 shadow-sm">
            <div class="grid lg:grid-cols-5 gap-4">
                <div class="lg:col-span-2 rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white dark:from-amber-900/10 dark:to-gray-900 dark:border-amber-800/30 p-4">
                    <h4
                        class="text-sm font-medium text-gray-800 lg:mb-4 dark:text-white/90 mb-3 w-full text-start flex items-center">
                        <svg class="w-6 h-6 me-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.65761 10.2419C7.77191 9.91936 8.22809 9.91936 8.34239 10.2419L8.65494 11.124C8.69152 11.2272 8.77275 11.3085 8.87601 11.3451L9.75807 11.6576C10.0806 11.7719 10.0806 12.2281 9.75807 12.3424L8.87601 12.6549C8.77275 12.6915 8.69152 12.7728 8.65494 12.876L8.34239 13.7581C8.22809 14.0806 7.77191 14.0806 7.65761 13.7581L7.34506 12.876C7.30848 12.7728 7.22725 12.6915 7.12399 12.6549L6.24193 12.3424C5.91936 12.2281 5.91936 11.7719 6.24193 11.6576L7.12399 11.3451C7.22725 11.3085 7.30848 11.2272 7.34506 11.124L7.65761 10.2419Z"
                                fill="currentColor"></path>
                            <path
                                d="M12.6576 15.2419C12.7719 14.9194 13.2281 14.9194 13.3424 15.2419L13.6549 16.124C13.6915 16.2272 13.7728 16.3085 13.876 16.3451L14.7581 16.6576C15.0806 16.7719 15.0806 17.2281 14.7581 17.3424L13.876 17.6549C13.7728 17.6915 13.6915 17.7728 13.6549 17.876L13.3424 18.7581C13.2281 19.0806 12.7719 19.0806 12.6576 18.7581L12.3451 17.876C12.3085 17.7728 12.2272 17.6915 12.124 17.6549L11.2419 17.3424C10.9194 17.2281 10.9194 16.7719 11.2419 16.6576L12.124 16.3451C12.2272 16.3085 12.3085 16.2272 12.3451 16.124L12.6576 15.2419Z"
                                fill="currentColor"></path>
                            <path
                                d="M13.9796 5.36772C14.1533 4.87743 14.8467 4.87743 15.0204 5.36772L15.6158 7.04814C15.6715 7.20508 15.7949 7.32855 15.9519 7.38415L17.6323 7.97958C18.1226 8.15331 18.1226 8.84669 17.6323 9.02042L15.9519 9.61585C15.7949 9.67146 15.6715 9.79492 15.6158 9.95186L15.0204 11.6323C14.8467 12.1226 14.1533 12.1226 13.9796 11.6323L13.3842 9.95186C13.3285 9.79492 13.2051 9.67146 13.0481 9.61585L11.3677 9.02042C10.8774 8.84669 10.8774 8.15331 11.3677 7.97958L13.0481 7.38415C13.2051 7.32855 13.3285 7.20508 13.3842 7.04814L13.9796 5.36772Z"
                                fill="currentColor"></path>
                        </svg>
                        اشتراک فعلی
                    </h4>
                    <div v-if="activePlan" class="w-full space-y-5">
                        <div class="text-sm font-semibold text-gray-800 dark:text-gray-50 w-full text-center">
                            اشتراک {{ activePlan.title }}
                        </div>
                        <div class="">
                            <Countdown dir="ltr" :mainColor="`#ffffff`" :labelSize="`0.8rem`" :countdownSize="`1.5rem`"
                                :deadline="activePlan.expired_at" :labelColor="`gray`"
                                :labels="{ days: 'روز', hours: 'ساعت', minutes: 'دقیقه', seconds: 'ثانیه' }" class="" />
                        </div>
                    </div>
                    <div v-else class="my-2 w-full flex flex-col items-center justify-center text-center">
                        <p class="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                            کاربر اشتراک فعالی ندارد!
                        </p>
                        <button @click.prevent="openAssignPlanModal"
                            class="mt-3 rounded-xl h-8 text-xs font-bold px-4 flex items-center justify-center bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25 hover:bg-amber-500 transition-colors">
                            اختصاص اشتراک جدید
                            <svg class="ms-2 w-4 h-4" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 12H18M12 6V18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="lg:col-span-3 rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white dark:from-emerald-900/10 dark:to-gray-900 dark:border-emerald-800/30 p-4">
                    <h4
                        class="text-sm font-medium text-gray-800 lg:mb-4 dark:text-white/90 mb-3 w-full text-start flex items-center">
                        <svg class="w-5 h-5 me-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M14.9703 3.3437C13.0166 2.88543 10.9834 2.88543 9.02975 3.3437C6.20842 4.00549 4.0055 6.20841 3.3437 9.02975C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C4.0055 17.7916 6.20842 19.9945 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C17.7916 19.9945 19.9945 17.7916 20.6563 14.9703C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20842 17.7916 4.00549 14.9703 3.3437ZM10.9883 8.22523C11.2226 8.45955 11.2226 8.83945 10.9883 9.07376L9.07376 10.9883C8.96124 11.1009 8.80863 11.1641 8.6495 11.1641C8.49037 11.1641 8.33775 11.1009 8.22523 10.9883L7.26795 10.031C7.03363 9.79673 7.03363 9.41683 7.26795 9.18252C7.50226 8.9482 7.88216 8.9482 8.11647 9.18252L8.6495 9.71554L10.1398 8.22523C10.3741 7.99092 10.754 7.99092 10.9883 8.22523ZM12.3573 10.0854C12.3573 9.75406 12.6259 9.48543 12.9573 9.48543H16.3078C16.6392 9.48543 16.9078 9.75406 16.9078 10.0854C16.9078 10.4168 16.6392 10.6854 16.3078 10.6854H12.9573C12.6259 10.6854 12.3573 10.4168 12.3573 10.0854ZM10.9883 13.0117C11.2226 13.246 11.2226 13.6259 10.9883 13.8602L9.07376 15.7748C8.83945 16.0091 8.45955 16.0091 8.22523 15.7748L7.26795 14.8175C7.03363 14.5832 7.03363 14.2033 7.26795 13.969C7.50226 13.7346 7.88216 13.7346 8.11647 13.969L8.6495 14.502L10.1398 13.0117C10.3741 12.7774 10.754 12.7774 10.9883 13.0117ZM12.3573 14.8719C12.3573 14.5405 12.6259 14.2719 12.9573 14.2719H16.3078C16.6392 14.2719 16.9078 14.5405 16.9078 14.8719C16.9078 15.2032 16.6392 15.4719 16.3078 15.4719H12.9573C12.6259 15.4719 12.3573 15.2032 12.3573 14.8719Z"
                                fill="currentColor"></path>
                        </svg>
                        تاریخچه خرید اشتراک
                    </h4>
                    <ul class="w-full max-h-64 overflow-y-auto custom-scrollbar">
                        <li v-for="(plan, index) in subscriptionHistory" :key="plan.id || index"
                            class="mb-2 p-3 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 bg-white/80 dark:bg-gray-900/50 text-gray-700 dark:text-gray-100">
                            <div class="flex items-center justify-between">
                                <div class="text-sm font-semibold line-clamp-1">
                                    اشتراک {{ plan.title }}
                                </div>
                                <div
                                    class="ms-2 rounded-md px-2 py-0.5 text-xs font-light bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 flex items-center">
                                    <span class="me-1.5 text-xs font-light">
                                        {{ getPlanPurchaseTypeLabel(plan.purchase_type) }}
                                    </span>
                                    <svg class="w-5 h-5" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                        preserveAspectRatio="xMidYMid meet" fill="#000000">
                                        <path
                                            d="M116.34 101.95H11.67c-4.2 0-7.63-3.43-7.63-7.63V33.68c0-4.2 3.43-7.63 7.63-7.63h104.67c4.2 0 7.63 3.43 7.63 7.63v60.64c0 4.2-3.43 7.63-7.63 7.63z"
                                            fill="#ffc107"></path>
                                        <path fill="#424242" d="M4.03 38.88h119.95v16.07H4.03z"></path>
                                        <path
                                            d="M114.2 74.14H13.87c-.98 0-1.79-.8-1.79-1.79v-8.41c0-.98.8-1.79 1.79-1.79H114.2c.98 0 1.79.8 1.79 1.79v8.41c-.01.98-.81 1.79-1.79 1.79z"
                                            fill="#ffffff"></path>
                                        <path
                                            d="M23.98 70.49c.56-1.08.71-2.34 1.21-3.45c.5-1.11 1.59-2.14 2.79-1.95c1.11.18 1.8 1.29 2.21 2.33c.57 1.45.88 3 .92 4.56c.01.32-.01.67-.22.92c-.37.42-1.13.21-1.42-.27c-.29-.48-.22-1.09-.09-1.64c.62-2.55 2.62-4.72 5.11-5.54c.26-.09.53-.16.8-.11c.58.11.9.71 1.16 1.23c.61 1.19 1.35 2.32 2.2 3.35c.34.42.73.83 1.25.99c1.71.5 2.7-2.02 4.35-2.69c1.98-.8 3.91 1.29 6.01 1.68c3.07.57 4.7-1.82 7.39-2.43c.36-.08.75-.13 1.11-.03c.66.19 1.07.82 1.46 1.39c.91 1.34 2.21 2.66 3.83 2.67c1.03.01 1.98-.52 2.92-.97c3.33-1.59 7.26-2.25 10.74-1.03"
                                            fill="none" stroke="#424242" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" stroke-miterlimit="10"></path>
                                    </svg>
                                    <svg class="w-4 h-4 fill-yellow-500 hidden" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                        viewBox="0 0 512 512" xml:space="preserve" fill="none">
                                        <path
                                            d="M314.344,321.563c0.031-36.594,29.656-66.234,66.234-66.25H490v-78.719c0-32.781-25.25-59.656-57.375-62.297 v-0.25H78.031c-9.375,0-17-7.609-17-16.984c0-9.406,7.625-17,17-17h354.563c-0.484-34.141-28.281-61.688-62.531-61.688H100.094 c-53.781,0-97.531,42.453-99.859,95.672H0v4.422v72.813v202.25c0,55.281,44.813,100.094,100.094,100.094h327.359 C462,493.625,490,465.609,490,431.063v-43.281H380.578C344,387.781,314.375,358.125,314.344,321.563z">
                                        </path>
                                        <path
                                            d="M502.469,280.563H380.578c-11.359,0-21.531,4.563-28.984,12c-7.438,7.453-12.016,17.625-12.016,29 c0,11.344,4.578,21.531,12.016,28.984c7.453,7.453,17.625,12,28.984,12.016h121.891c5.266,0,9.531-4.281,9.531-9.547v-62.922 C512,284.813,507.734,280.563,502.469,280.563z M381.281,335.219c-7.547,0-13.656-6.125-13.656-13.656 c0-7.563,6.109-13.688,13.656-13.688s13.672,6.125,13.672,13.688C394.953,329.094,388.828,335.219,381.281,335.219z">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            <hr class="my-1.5 mx-2 border-t border-dashed border-gray-300 dark:border-gray-600">
                            <div class="flex items-center justify-start gap-2">
                                <p
                                    class="rounded-md px-2 py-0.5 text-xs font-light bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 flex items-center">
                                    از: {{ formatDateTime(plan.started_at) }}</p>
                                <p
                                    class="rounded-md px-2 py-0.5 text-xs font-light bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 flex items-center">
                                    تا: {{ formatDateTime(plan.expired_at) }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="mb-6 rounded-2xl border border-gray-200/80 bg-white p-4 md:p-5 dark:border-gray-700/80 dark:bg-gray-900 shadow-sm w-full">
            <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">تراکنشات کاربر</h4>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">پرداخت‌های آنلاین و کیف پول</p>
                </div>
            </div>
            <div class="w-full">
                <div>
                    <div class="">
                        <TabGroup :selectedIndex="selectedTabIndex" @change="onTransactionTabChange">
                            <TabList class="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 w-max mb-4">
                                <Tab v-slot="{ selected }" as="template">
                                    <button
                                        class="flex items-center justify-center text-xs font-bold px-4 py-2 rounded-lg transition-all"
                                        :class="selected ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                                        تراکنشات آنلاین
                                    </button>
                                </Tab>
                                <Tab v-slot="{ selected }" as="template">
                                    <button
                                        class="flex items-center justify-center text-xs font-bold px-4 py-2 rounded-lg transition-all"
                                        :class="selected ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                                        تراکنشات کیف‌پول
                                    </button>
                                </Tab>
                            </TabList>
                            <TabPanels class="w-full">
                                <TabPanel>
                                    <div v-if="onlinePayments && onlinePayments.length"
                                        class="max-h-72 overflow-y-auto custom-scrollbar w-full">
                                        <table
                                            class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                            <thead
                                                class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                <tr class="text-xs font-semibold text-start">
                                                    <th class="px-1 py-3 whitespace-nowrap text-start"></th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-start">شناسه‌پرداخت</th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-start">شماره‌پیگیری</th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-center">مبلغ</th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-center">تاریخ</th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-center">مدیریت</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                                <tr v-for="payment in onlinePayments" :key="payment.id"
                                                    class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                                    <td class="px-1 py-3 whitespace-nowrap text-start w-10">
                                                        <svg v-if="payment.is_paid"
                                                            class="w-6 h-6 text-green-400" viewBox="0 0 24 24"
                                                            fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z"
                                                                fill="currentColor"></path> 
                                                        </svg>
                                                        <svg v-else class="w-6 h-6 text-red-400" viewBox="0 0 24 24"
                                                            fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM10.7139 9.90158C10.4896 9.67727 10.1259 9.67727 9.90158 9.90158C9.67727 10.1259 9.67727 10.4896 9.90158 10.7139L11.1877 12L9.90158 13.2861C9.67727 13.5104 9.67727 13.8741 9.90158 14.0984C10.1259 14.3227 10.4896 14.3227 10.7139 14.0984L12 12.8123L13.2861 14.0984C13.5104 14.3227 13.8741 14.3227 14.0984 14.0984C14.3227 13.8741 14.3227 13.5104 14.0984 13.2861L12.8123 12L14.0984 10.7139C14.3227 10.4896 14.3227 10.1259 14.0984 9.90158C13.8741 9.67727 13.5104 9.67727 13.2861 9.90158L12 11.1877L10.7139 9.90158Z"
                                                                fill="currentColor"></path>
                                                        </svg>
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                                        <div
                                                            class="whitespace-nowrap flex items-center text-xs font-semibold tracking-wide text-gray-800 dark:text-gray-100 bg-gray-100/90 dark:bg-gray-800/70 px-3 py-1.5 rounded-lg">
                                                            {{ payment.uuid }}
                                                        </div>
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-start w-20">
                                                        {{ payment.tracking_number ? payment.tracking_number : '----------' }}
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-start w-20">
                                                        <div
                                                            class="whitespace-nowrap flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                                            {{ payment.amount.toLocaleString() }}
                                                            <svg class="ms-1 w-3 h-3" viewBox="0 0 14 16" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path class="text-gray-600 dark:text-white"
                                                                    d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C11.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z"
                                                                    fill="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                        <div v-if="Number(payment.wallet_paid_amount) > 0"
                                                            class="mt-1 text-[10px] leading-4 text-gray-500 dark:text-gray-400">
                                                            کیف پول {{ Number(payment.wallet_paid_amount).toLocaleString() }}
                                                            · درگاه {{ Number(payment.gateway_paid_amount).toLocaleString() }}
                                                        </div>
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-start w-32">
                                                        <div
                                                            class="whitespace-nowrap flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                                            {{ formatDateTime(payment.created_at) }}
                                                        </div>
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-center w-12">
                                                        <button @click.prevent="goToAdminPayments(payment.uuid)"
                                                            class="inline-flex items-center justify-center rounded-lg py-1.5 px-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xxs font-semibold dark:bg-gray-800 dark:text-gray-100"
                                                            title="مدیریت پرداخت">
                                                            <svg class="w-4 h-4 ms-0.5" viewBox="0 0 24 24" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M12 15.5C13.932 15.5 15.5 13.932 15.5 12C15.5 10.068 13.932 8.5 12 8.5C10.068 8.5 8.5 10.068 8.5 12C8.5 13.932 10.068 15.5 12 15.5Z"
                                                                    stroke="currentColor" stroke-width="1.5"
                                                                    stroke-linecap="round" stroke-linejoin="round" />
                                                                <path
                                                                    d="M19.4 15C19.55 14.52 19.63 14.02 19.63 13.5C19.63 12.98 19.55 12.48 19.4 12L21.25 10.39C21.42 10.24 21.48 10 21.39 9.79L19.76 6.21C19.66 6 19.44 5.88 19.21 5.91L16.91 6.21C16.36 5.78 15.75 5.43 15.09 5.18L14.79 2.79C14.76 2.56 14.58 2.38 14.35 2.35H9.65C9.42 2.38 9.24 2.56 9.21 2.79L8.91 5.18C8.25 5.43 7.64 5.78 7.09 6.21L4.79 5.91C4.56 5.88 4.34 6 4.24 6.21L2.61 9.79C2.52 10 2.58 10.24 2.75 10.39L4.6 12C4.45 12.48 4.37 12.98 4.37 13.5C4.37 14.02 4.45 14.52 4.6 15L2.75 16.61C2.58 16.76 2.52 17 2.61 17.21L4.24 20.79C4.34 21 4.56 21.12 4.79 21.09L7.09 20.79C7.64 21.22 8.25 21.57 8.91 21.82L9.21 23.21C9.24 23.44 9.42 23.62 9.65 23.65H14.35C14.58 23.62 14.76 23.44 14.79 23.21L15.09 21.82C15.75 21.57 16.36 21.22 16.91 20.79L19.21 21.09C19.44 21.12 19.66 21 19.76 20.79L21.39 17.21C21.48 17 21.42 16.76 21.25 16.61L19.4 15Z"
                                                                    stroke="currentColor" stroke-width="1.5"
                                                                    stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                            <span class="ms-1">مدیریت</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div v-else class="flex flex-col items-center justify-center py-10 text-center">
                                        <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                            <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        </div>
                                        <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">تراکنش آنلاینی وجود ندارد</p>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div v-if="walletTransactions && walletTransactions.length"
                                        class="max-h-72 overflow-y-auto custom-scrollbar w-full">
                                        <table
                                            class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                                            <thead
                                                class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                <tr class="text-xs font-semibold text-start">
                                                    <th class="px-1 py-3 whitespace-nowrap text-start"></th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-start">شناسه‌پرداخت</th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-start">شماره‌پیگیری</th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-center">مبلغ</th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-center">موجودی‌بعداز‌تراکنش</th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-center">تاریخ</th>
                                                    <th class="px-1 py-3 whitespace-nowrap text-center">مدیریت</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                                <tr v-for="wallet in walletTransactions" :key="wallet.id"
                                                    class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                                    <td class="px-1 py-3 whitespace-nowrap text-start w-10">
                                                        <svg v-if="wallet.type === 'increase'"
                                                            class="w-6 h-6 text-green-400" viewBox="0 0 24 24"
                                                            fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM13.987 13.3634C14.2114 13.5877 14.575 13.5877 14.7993 13.3634C15.0236 13.1391 15.0236 12.7754 14.7993 12.5511L12.4061 10.1579C12.2984 10.0502 12.1523 9.98967 12 9.98967C11.8476 9.98967 11.7015 10.0502 11.5938 10.1579L9.20062 12.5511C8.97631 12.7754 8.97631 13.1391 9.20062 13.3634C9.42492 13.5877 9.7886 13.5877 10.0129 13.3634L12 11.3763L13.987 13.3634Z"
                                                                fill="currentColor"></path>
                                                        </svg>
                                                        <svg v-else class="w-6 h-6 text-red-400" viewBox="0 0 24 24"
                                                            fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM10.0129 10.6365C9.7886 10.4122 9.42492 10.4122 9.20062 10.6365C8.97631 10.8609 8.97631 11.2245 9.20062 11.4488L11.5938 13.842C11.7015 13.9498 11.8476 14.0103 12 14.0103C12.1523 14.0103 12.2984 13.9498 12.4061 13.842L14.7993 11.4488C15.0236 11.2245 15.0236 10.8609 14.7993 10.6365C14.575 10.4122 14.2114 10.4122 13.987 10.6365L12 12.6236L10.0129 10.6365Z"
                                                                fill="currentColor"></path>
                                                        </svg>
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                                        <div
                                                            class="whitespace-nowrap flex items-center text-xs font-semibold tracking-wide text-gray-800 dark:text-gray-100 bg-gray-100/90 dark:bg-gray-800/70 px-3 py-1.5 rounded-lg">
                                                            {{ wallet.reference_id }}
                                                        </div>
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-start w-20">
                                                        {{ wallet.tracking_number ? wallet.tracking_number : '----------' }}
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-start w-16">
                                                        <div
                                                            class="whitespace-nowrap flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                                            {{ wallet.amount.toLocaleString() }}
                                                            <svg class="ms-1 w-3 h-3" viewBox="0 0 14 16" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path class="text-gray-600 dark:text-white"
                                                                    d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C10.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z"
                                                                fill="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-start w-16">
                                                        <div
                                                            class="whitespace-nowrap flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                                            {{ wallet.after_balance.toLocaleString() }}
                                                            <svg class="ms-1 w-3 h-3" viewBox="0 0 14 16" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path class="text-gray-600 dark:text-white"
                                                                    d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C10.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z"
                                                                fill="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-start w-32">
                                                        <div
                                                            class="whitespace-nowrap flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                                            {{ formatDateTime(wallet.created_at) }}
                                                        </div>
                                                    </td>
                                                    <td class="px-1 py-3 whitespace-nowrap text-center w-12">
                                                        <button v-if="wallet.reference_id"
                                                            @click.prevent="goToAdminPayments(wallet.reference_id)"
                                                            class="inline-flex items-center justify-center rounded-lg py-1.5 px-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xxs font-semibold dark:bg-gray-800 dark:text-gray-100"
                                                            title="مدیریت پرداخت">
                                                            <svg class="w-4 h-4 ms-0.5" viewBox="0 0 24 24" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M12 15.5C13.932 15.5 15.5 13.932 15.5 12C15.5 10.068 13.932 8.5 12 8.5C10.068 8.5 8.5 10.068 8.5 12C8.5 13.932 10.068 15.5 12 15.5Z"
                                                                    stroke="currentColor" stroke-width="1.5"
                                                                    stroke-linecap="round" stroke-linejoin="round" />
                                                                <path
                                                                    d="M19.4 15C19.55 14.52 19.63 14.02 19.63 13.5C19.63 12.98 19.55 12.48 19.4 12L21.25 10.39C21.42 10.24 21.48 10 21.39 9.79L19.76 6.21C19.66 6 19.44 5.88 19.21 5.91L16.91 6.21C16.36 5.78 15.75 5.43 15.09 5.18L14.79 2.79C14.76 2.56 14.58 2.38 14.35 2.35H9.65C9.42 2.38 9.24 2.56 9.21 2.79L8.91 5.18C8.25 5.43 7.64 5.78 7.09 6.21L4.79 5.91C4.56 5.88 4.34 6 4.24 6.21L2.61 9.79C2.52 10 2.58 10.24 2.75 10.39L4.6 12C4.45 12.48 4.37 12.98 4.37 13.5C4.37 14.02 4.45 14.52 4.6 15L2.75 16.61C2.58 16.76 2.52 17 2.61 17.21L4.24 20.79C4.34 21 4.56 21.12 4.79 21.09L7.09 20.79C7.64 21.22 8.25 21.57 8.91 21.82L9.21 23.21C9.24 23.44 9.42 23.62 9.65 23.65H14.35C14.58 23.62 14.76 23.44 14.79 23.21L15.09 21.82C15.75 21.57 16.36 21.22 16.91 20.79L19.21 21.09C19.44 21.12 19.66 21 19.76 20.79L21.39 17.21C21.48 17 21.42 16.76 21.25 16.61L19.4 15Z"
                                                                    stroke="currentColor" stroke-width="1.5"
                                                                    stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                            <span class="ms-1">مدیریت</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div v-else class="flex flex-col items-center justify-center py-10 text-center">
                                        <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                            <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        </div>
                                        <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">تراکنش کیف‌پولی وجود ندارد</p>
                                    </div>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </div>
                </div>
            </div>
        </div>

        <BottomSheetDrawer v-model="showAssignPlanModal" :initialHeight="0.75" :maxHeight="0.95" :minHeight="0.55"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="bs.ADMIN_BS_PANEL" :contentClass="bs.ADMIN_BS_CONTENT" :backdropClass="bs.ADMIN_BS_BACKDROP">
            <AdminBottomSheetHeader title="اختصاص اشتراک جدید" subtitle="ثبت دستی پلن اشتراک برای کاربر" accent="amber"
                @close="closeAssignPlanModal">
                <template #icon>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </template>
            </AdminBottomSheetHeader>
            <form class="flex flex-col" @submit.prevent="confirmAssignPlan">
                <div v-if="selectedAssignPlan"
                    class="mb-3 rounded-xl border border-amber-200/60 bg-gradient-to-l from-amber-50/80 to-white dark:from-amber-900/15 dark:to-gray-800/40 dark:border-amber-800/30 p-3.5">
                    <div class="flex items-start gap-3">
                        <div class="shrink-0 w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                            <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ selectedAssignPlan.title }}</p>
                            <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
                                <span>{{ formatNumber(selectedAssignPlan.price) }} تومان</span>
                                <span v-if="selectedAssignPlan.period_time">· {{ selectedAssignPlan.period_time }} روز</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="bs.ADMIN_BS_FORM_BODY">
                <div class="grid grid-cols-1 gap-3.5">
                    <div>
                        <label :class="bs.ADMIN_BS_FORM_LABEL">پلن اشتراک</label>
                        <select v-model="assignForm.plan_id" @change="onPlanChange"
                            :class="[bs.ADMIN_BS_INPUT, assignErrors && assignErrors.plan_id ? bs.ADMIN_BS_INPUT_ERROR : '']">
                            <option disabled value="">یک پلن را انتخاب کنید...</option>
                            <option v-for="plan in plansOptions" :key="plan.id" :value="plan.id">
                                {{ plan.title }} — {{ formatNumber(plan.price) }} تومان
                            </option>
                        </select>
                        <span v-if="assignErrors && assignErrors.plan_id" class="mt-1 text-rose-500 text-xs font-medium block">
                            {{ assignErrors.plan_id[0] }}
                        </span>
                    </div>
                    <div>
                        <label :class="bs.ADMIN_BS_FORM_LABEL">مبلغ (تومان)</label>
                        <div class="relative w-full">
                            <div class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500">تومان</span>
                            </div>
                            <input type="text" v-model="assignFormattedPrice" @input="assignOnPriceInput"
                                class="font-mono font-bold tracking-wider pe-14"
                                :class="[bs.ADMIN_BS_INPUT, assignErrors && assignErrors.price ? bs.ADMIN_BS_INPUT_ERROR : '']" />
                        </div>
                        <span v-if="assignErrors && assignErrors.price" class="mt-1 text-rose-500 text-xs font-medium block">
                            {{ assignErrors.price[0] }}
                        </span>
                    </div>
                    <div>
                        <label :class="bs.ADMIN_BS_FORM_LABEL">تاریخ پایان اشتراک</label>
                        <input type="datetime-local" v-model="assignForm.expired_at"
                            :class="[bs.ADMIN_BS_INPUT, assignErrors && assignErrors.expired_at ? bs.ADMIN_BS_INPUT_ERROR : '']" />
                        <span v-if="assignErrors && assignErrors.expired_at" class="mt-1 text-rose-500 text-xs font-medium block">
                            {{ assignErrors.expired_at[0] }}
                        </span>
                    </div>
                    <div>
                        <label :class="bs.ADMIN_BS_FORM_LABEL">توضیحات <span class="font-normal text-gray-400">(اختیاری)</span></label>
                        <textarea v-model="assignForm.description" rows="3"
                            :class="[bs.ADMIN_BS_INPUT, 'resize-none']"
                            placeholder="دلیل یا توضیح ثبت دستی اشتراک..."></textarea>
                    </div>
                </div>
                </div>
                <div :class="bs.ADMIN_BS_HINT" class="mt-3">
                    اشتراک به‌صورت دستی ثبت می‌شود و در تاریخچه اشتراک کاربر نمایش داده خواهد شد.
                </div>
                <AdminBottomSheetActions cancel-label="انصراف" submit-label="ثبت اشتراک" :loading="assignPlanLoading"
                    @cancel="closeAssignPlanModal" @submit="confirmAssignPlan" />
            </form>
        </BottomSheetDrawer>

    </div>
    <LoadingComponent v-if="loading" />
    </div>
</template>
<script>
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetActions from "@/views/components/admin/bottomSheet/AdminBottomSheetActions.vue";
import * as adminBottomSheetStyles from "@/views/components/admin/bottomSheet/adminBottomSheetStyles";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { Countdown } from "vue3-flip-countdown";
import axiosInstance from "@/store/axiosInstance";
// import PN from "persian-number";

export default {
    components: {
        LoadingComponent,
        AdminReportStatCard,
        BottomSheetDrawer,
        AdminBottomSheetHeader,
        AdminBottomSheetActions,
        TabGroup, TabList, Tab, TabPanels, TabPanel,
        Countdown,
    },
    data() {
        const tabs = ["online", "wallet"];
        return {
            bs: adminBottomSheetStyles,
            username: this.$route.params.username,
            loading: true,

            // summary
            walletBalance: 0,
            activePlan: null,
            subscriptionHistory: [],

            // tabs
            selectedTab: tabs.includes(this.$route.query.tab) ? this.$route.query.tab : tabs[0],
            page: this.$route.query.page ? parseInt(this.$route.query.page, 10) : 1,

            onlinePayments: [],
            walletTransactions: [],
            onlinePagination: null,
            walletPagination: null,

            // assign plan modal
            showAssignPlanModal: false,
            assignPlanLoading: false,
            plansOptions: [],
            assignForm: {
                plan_id: "",
                price: null,
                expired_at: "",
                description: "",
            },
            assignFormattedPrice: "",
            assignErrors: null,
        };
    },
    computed: {
        selectedTabIndex() {
            const tabs = ['online', 'wallet'];
            const index = tabs.indexOf(this.selectedTab);
            return index >= 0 ? index : 0;
        },
        selectedAssignPlan() {
            if (!this.assignForm.plan_id) return null;
            return (
                this.plansOptions.find(
                    (p) => String(p.id) === String(this.assignForm.plan_id)
                ) || null
            );
        },
    },
    methods: {
        formatNumber(n) {
            if (n == null) return '0';
            return Number(n).toLocaleString('fa-IR');
        },
        async onTransactionTabChange(index) {
            const tabs = ['online', 'wallet'];
            this.selectedTab = tabs[index] ?? tabs[0];
            this.page = 1;
            this.buildQueryParams();
            await this.fetchTabData();
        },

        buildQueryParams() {
            const params = new URLSearchParams(window.location.search);

            if (this.selectedTab) {
                params.set("tab", this.selectedTab);
            } else {
                params.delete("tab");
            }

            if (this.page > 1) {
                params.set("page", this.page);
            } else {
                params.delete("page");
            }

            const queryString = params.toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

            window.history.pushState(null, "", newUrl);
        },

        async fetchSummary() {
            const response = await axiosInstance.post(`admin/user/${this.username}/financial/summary`);
            this.walletBalance = response.data.wallet_balance ?? 0;
            this.activePlan = response.data.active_plan || null;
            this.subscriptionHistory = response.data.subscription_history || [];
        },

        async fetchOnlinePayments() {
            const params = {
                page: this.page,
                perPage: 15,
                sort: "newest",
            };
            const response = await axiosInstance.post(
                `admin/user/${this.username}/financial/payments`,
                params
            );
            this.onlinePayments = response.data.data || [];
            this.onlinePagination = response.data.pagination || null;
        },

        async fetchWalletTransactions() {
            const params = {
                page: this.page,
                perPage: 15,
                sort: "newest",
            };
            const response = await axiosInstance.post(
                `admin/user/${this.username}/financial/wallets`,
                params
            );
            this.walletTransactions = response.data.data || [];
            this.walletPagination = response.data.pagination || null;
        },

        async fetchTabData() {
            if (this.selectedTab === "online") {
                await this.fetchOnlinePayments();
            } else if (this.selectedTab === "wallet") {
                await this.fetchWalletTransactions();
            }
        },

        async fetchPlans() {
            const response = await axiosInstance.post("/admin/plans", {
                perPage: 50,
                status: "active",
            });
            this.plansOptions = response.data.plans || [];
            if (!this.assignForm.plan_id && this.plansOptions.length) {
                const firstPlan = this.plansOptions[0];
                this.assignForm.plan_id = firstPlan.id;
                this.assignForm.price = firstPlan.price;
                this.assignFormattedPrice = firstPlan.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                this.assignForm.expired_at = this.getDefaultExpiry(firstPlan.period_time);
            }
        },

        openAssignPlanModal() {
            this.showAssignPlanModal = true;
            if (!this.plansOptions.length) {
                this.fetchPlans().catch((e) => console.error("Error loading plans:", e));
            }
        },

        closeAssignPlanModal() {
            this.showAssignPlanModal = false;
        },

        onPlanChange() {
            const plan = this.plansOptions.find(
                (p) => String(p.id) === String(this.assignForm.plan_id)
            );
            if (plan) {
                this.assignForm.price = plan.price;
                this.assignFormattedPrice = plan.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                this.assignForm.expired_at = this.getDefaultExpiry(plan.period_time);
            }
        },

        getDefaultExpiry(periodDays) {
            const days = Number(periodDays) > 0 ? Number(periodDays) : 30;
            const now = new Date();
            const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
            const pad = (n) => String(n).padStart(2, "0");
            const year = future.getFullYear();
            const month = pad(future.getMonth() + 1);
            const day = pad(future.getDate());
            const hour = pad(future.getHours());
            const minute = pad(future.getMinutes());
            return `${year}-${month}-${day}T${hour}:${minute}`;
        },

        assignOnPriceInput() {
            const raw = this.assignFormattedPrice.replace(/[^0-9]/g, "");
            this.assignFormattedPrice = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            this.assignForm.price = raw ? parseInt(raw, 10) : null;
        },

        async confirmAssignPlan() {
            this.assignErrors = null;
            if (!this.assignForm.plan_id || !this.assignForm.expired_at) {
                if (this.$toast) {
                    this.$toast.error("لطفاً پلن و تاریخ پایان اشتراک را وارد کنید");
                }
                return;
            }
            this.assignPlanLoading = true;
            try {
                await axiosInstance.post(
                    `admin/user/${this.username}/financial/assign-plan`,
                    {
                        plan_id: this.assignForm.plan_id,
                        price: this.assignForm.price,
                        expired_at: this.assignForm.expired_at,
                        description: this.assignForm.description,
                    }
                );
                await this.fetchSummary();
                if (this.$toast) {
                    this.$toast.success("اشتراک با موفقیت برای کاربر ثبت شد");
                }
                this.closeAssignPlanModal();
            } catch (e) {
                console.error("Error assigning plan:", e);
                if (e.response && e.response.status === 422) {
                    this.assignErrors = e.response.data.errors || {};
                }
                if (this.$toast) {
                    this.$toast.error("خطا در ثبت اشتراک برای کاربر");
                }
            } finally {
                this.assignPlanLoading = false;
            }
        },

        goToAdminPayments(identifier) {
            this.$router.push({
                name: "admin-payments-list",
                query: { search: identifier },
            });
        },

        formatDateTime(value) {
            if (!value) return "-";
            const d = new Date(value);
            const date = d
                .toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                })
                .replace(/\//g, "-");
            const time = d
                .toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
                .replace("بعدازظهر", "ب.ظ")
                .replace("قبل‌ازظهر", "ق.ظ");
            return `${date} | ${time}`;
        },

        getPlanPurchaseTypeLabel(type) {
            if (type === "wallet") return "کیف پول";
            if (type === "gift") return "هدیه";
             if (type === "manual") return "ثبت دستی توسط ادمین";
            return "درگاه‌آنلاین";
        },
    },

    async mounted() {
        document.title = "مدیریت کاربر-بخش مالی و تراکنشات";
        this.loading = true;
        try {
            await this.fetchSummary();
            await this.fetchTabData();
        } catch (e) {
            console.error("Error loading user financial data:", e);
        } finally {
            this.loading = false;
        }
    },
};
</script>