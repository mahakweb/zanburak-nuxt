<script setup>
definePageMeta({
  name: "payment-receipt",
  middleware: ['auth'],
  layout: 'default',
})
</script>

<template>
    <MasterPage>
        <div class="mx-auto max-w-4xl px-4 py-10 md:py-16">
            <div class="flex flex-col items-center">
                <!-- Loading State -->
                <div v-if="receiptLoading" class="max-w-lg w-full text-center bg-white dark:bg-gray-900 p-8 mx-auto rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                    <div class="animate-pulse mx-auto avatar">
                        <div class="bg-gray-200 dark:bg-gray-700 w-20 h-20 mask mask-squircle"></div>
                    </div>

                    <div class="animate-pulse justify-center mx-auto text-center w-[95%] md:w-[90%]">
                        <div class="mx-auto mt-6 bg-gray-200 dark:bg-gray-700 rounded-full h-3 w-32 text-center"></div>

                        <div class="mt-4 w-full justify-between flex items-center pt-4 border-gray-100 border-t border-dashed dark:border-opacity-10">
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16"></div>
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-24"></div>
                        </div>
                        <div class="mt-4 w-full justify-between flex items-center pt-4 border-gray-100 border-t border-dashed dark:border-opacity-10">
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-24"></div>
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16"></div>
                        </div>
                        <div class="my-4 w-full justify-between flex items-center pt-4 border-gray-100 border-t border-dashed dark:border-opacity-10">
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16"></div>
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-24"></div>
                        </div>
                        <hr class="my-4 border-gray-100 border-t dark:border-opacity-10 mx-2" />
                        <div class="mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 w-40"></div>
                    </div>
                </div>

                <!-- Printable Receipt Area -->
                <div v-else id="printable-area" ref="printableArea" class="max-w-lg w-full bg-white dark:bg-gray-900 p-6 md:p-8 mx-auto rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 transition">
                    <div v-if="receiptDetail">
                        <!-- Status Icon -->
                        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl p-3" :class="[receiptDetail.status ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500']">
                            <svg v-if="receiptDetail.status" class="w-12 h-12 stroke-emerald-500 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            <svg v-else class="w-12 h-12 stroke-rose-500 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                        </div>

                        <!-- Status Title -->
                        <div class="mx-auto text-center w-full mt-5">
                            <h2 v-if="receiptDetail.status" class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                {{ $t("payment.success") || "پرداخت با موفقیت انجام شد" }}
                            </h2>
                            <h2 v-else class="text-2xl font-black text-rose-600 dark:text-rose-500">
                                {{ $t("payment.failed") || "تراکنش ناموفق" }}
                            </h2>

                            <p v-if="receiptDetail.status === 0" class="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                {{ $t("payment.failedDesc") || "پرداخت انجام نشد یا توسط کاربر لغو گردید." }}
                            </p>

                            <!-- Amount -->
                            <div class="mt-6 w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-gray-800 py-3">
                                <div class="text-start text-gray-600 dark:text-gray-300 font-semibold text-sm">{{ $t("payment.amount") || "مبلغ پرداختی" }}:</div>
                                <div class="flex items-center gap-1.5 text-end font-black text-lg text-gray-900 dark:text-white">
                                    <span>{{ receiptDetail.amount?.toLocaleString() }}</span>
                                    <span class="text-xs text-gray-400 font-medium">تومان</span>
                                </div>
                            </div>

                            <!-- Wallet Part -->
                            <div v-if="Number(receiptDetail.wallet_paid_amount) > 0" class="w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-gray-800 py-2.5">
                                <div class="text-start text-gray-600 dark:text-gray-300 font-semibold text-xs sm:text-sm">{{ $t('panel.financial.walletPart') || 'سهم کیف پول:' }}</div>
                                <div class="text-end text-gray-800 dark:text-gray-200 font-bold text-sm">{{ Number(receiptDetail.wallet_paid_amount).toLocaleString() }} تومان</div>
                            </div>

                            <!-- Gateway Part -->
                            <div v-if="Number(receiptDetail.gateway_paid_amount) > 0" class="w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-gray-800 py-2.5">
                                <div class="text-start text-gray-600 dark:text-gray-300 font-semibold text-xs sm:text-sm">{{ $t('panel.financial.gatewayPart') || 'سهم درگاه:' }}</div>
                                <div class="text-end text-gray-800 dark:text-gray-200 font-bold text-sm">{{ Number(receiptDetail.gateway_paid_amount).toLocaleString() }} تومان</div>
                            </div>

                            <!-- Tracking Code -->
                            <div v-if="receiptDetail.status === 1 && receiptDetail.tracking_number" class="w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-gray-800 py-2.5">
                                <div class="text-start text-gray-600 dark:text-gray-300 font-semibold text-xs sm:text-sm">{{ $t("payment.trackingCode") || "کد پیگیری" }}:</div>
                                <div class="text-end font-mono text-sm text-gray-800 dark:text-gray-200 font-bold">
                                    {{ receiptDetail.tracking_number }}
                                </div>
                            </div>

                            <!-- Reference ID -->
                            <div v-if="receiptDetail.reference_id" class="w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-gray-800 py-2.5">
                                <div class="text-start text-gray-600 dark:text-gray-300 font-semibold text-xs sm:text-sm">{{ $t('receipt.referenceId') || 'شناسه مرجع' }}:</div>
                                <div class="font-mono text-xs sm:text-sm text-end text-gray-800 dark:text-gray-200 font-bold">
                                    {{ receiptDetail.reference_id }}
                                </div>
                            </div>

                            <!-- Date -->
                            <div class="w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-gray-800 py-2.5">
                                <div class="text-start text-gray-600 dark:text-gray-300 font-semibold text-xs sm:text-sm">{{ $t("payment.date") || "تاریخ تراکنش" }}:</div>
                                <div class="ltr:hidden text-end text-gray-800 dark:text-gray-200 font-bold text-sm">
                                    {{ moment(receiptDetail.updated_at).format("jYYYY/jM/jD") }}
                                </div>
                                <div class="rtl:hidden text-end text-gray-800 dark:text-gray-200 font-bold text-sm">
                                    {{ moment(receiptDetail.updated_at).format("YYYY/M/D") }}
                                </div>
                            </div>

                            <!-- Time -->
                            <div class="w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-gray-800 py-2.5">
                                <div class="text-start text-gray-600 dark:text-gray-300 font-semibold text-xs sm:text-sm">{{ $t("payment.time") || "زمان تراکنش" }}:</div>
                                <div class="text-end text-gray-800 dark:text-gray-200 font-bold text-sm">
                                    {{ moment(receiptDetail.updated_at).format("HH:mm a") }}
                                </div>
                            </div>

                            <!-- Activated Items -->
                            <div v-if="receiptDetail.status === true && receiptDetail.items && receiptDetail.items.length" class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <div class="text-start text-gray-800 dark:text-gray-200 text-sm font-bold mb-3 flex items-center gap-2">
                                    <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                                    {{ $t('receipt.activatedItems') || 'اقلام فعال‌شده:' }}
                                </div>
                                <ul class="space-y-2">
                                    <li v-for="(pItem, pIndex) in receiptDetail.items" :key="pIndex" class="group p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-center transition hover:border-amber-400/40">
                                        <!-- Course -->
                                        <template v-if="pItem.payable_type === 'Course' && pItem.payable">
                                            <router-link :to="{ name: 'course.show', params: { courseSlug: pItem.payable.slug } }" class="flex items-center w-full">
                                                <div class="flex-shrink-0 w-12 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                                    <SeoImage
                                                        :src="pItem.payable.poster"
                                                        :alt="pItem.payable.title || ''"
                                                        :width="48"
                                                        :height="40"
                                                        sizes-preset="icon"
                                                        img-class="w-full h-full object-cover transition duration-200 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div class="flex-1 min-w-0 ms-3 text-start">
                                                    <p class="line-clamp-1 text-sm font-bold text-gray-900 dark:text-white">
                                                        {{ $t('receipt.coursePrefix', { title: pItem.payable.title }) }}
                                                    </p>
                                                    <p v-if="pItem.payable.english_title" class="line-clamp-1 text-xs text-gray-400 mt-0.5 truncate">
                                                        {{ pItem.payable.english_title }}
                                                    </p>
                                                </div>
                                            </router-link>
                                        </template>

                                        <!-- Path -->
                                        <template v-else-if="pItem.payable_type === 'Path' && pItem.payable">
                                            <router-link :to="{ name: 'path.show', params: { pathSlug: pItem.payable.slug } }" class="flex items-center w-full">
                                                <div class="flex-shrink-0 w-12 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                                    <SeoImage
                                                        v-if="pItem.payable.poster"
                                                        :src="pItem.payable.poster"
                                                        :alt="pItem.payable.title || ''"
                                                        :width="48"
                                                        :height="40"
                                                        sizes-preset="icon"
                                                        img-class="w-full h-full object-cover"
                                                    />
                                                    <SeoImage
                                                        v-else-if="pItem.payable.icon"
                                                        :src="pItem.payable.icon"
                                                        :alt="pItem.payable.title || ''"
                                                        :width="48"
                                                        :height="40"
                                                        sizes-preset="icon"
                                                        img-class="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div class="flex-1 min-w-0 ms-3 text-start">
                                                    <p class="line-clamp-1 text-sm font-bold text-gray-900 dark:text-white">
                                                        {{ $t('receipt.pathPrefix', { title: pItem.payable.title }) }}
                                                    </p>
                                                </div>
                                            </router-link>
                                        </template>

                                        <!-- Plan (VIP) -->
                                        <template v-else-if="pItem.payable_type === 'Plan' && pItem.payable">
                                            <div class="flex items-center w-full">
                                                <div class="flex-shrink-0 w-12 h-10 rounded-xl overflow-hidden bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-500">
                                                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                    </svg>
                                                </div>
                                                <div class="flex-1 min-w-0 ms-3 text-start">
                                                    <p class="line-clamp-1 text-sm font-bold text-gray-900 dark:text-white">
                                                        {{ $t('receipt.subscriptionPrefix', { title: pItem.payable.title }) }}
                                                    </p>
                                                </div>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                            </div>

                            <!-- Footer Note -->
                            <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs leading-6 text-gray-400 dark:text-gray-500">
                                <span v-if="receiptDetail.status">
                                    {{ $t("payment.thankYou") || "با تشکر، وبسایت آموزشی زنبورک" }}
                                </span>
                                <span v-else>
                                    {{ $t("payment.failedRefundNote") || "در صورت کسر وجه از حساب، ظرف ۷۲ ساعت بازگردانده می‌شود." }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="errorCode" class="w-full">
                        <div class="border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl justify-center text-center p-6 md:p-8">
                            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                                <svg class="w-8 h-8 stroke-rose-500 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="15" y1="9" x2="9" y2="15"/>
                                    <line x1="9" y1="9" x2="15" y2="15"/>
                                </svg>
                            </div>
                            <div class="my-3 text-rose-700 dark:text-rose-400 text-lg font-bold">
                                {{ $t("payment.error") || 'خطا در دریافت رسید' }}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                {{ $t("payment.unknownError") || 'اطلاعات این رسید پرداخت یافت نشد یا معتبر نمی‌باشد.' }}
                            </div>
                            <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
                                <router-link :to="{ name: 'cart' }" class="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition">
                                    {{ $t("payment.backToCart") || 'سبد خرید' }}
                                </router-link>
                                <router-link to="/" class="rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 transition">
                                    {{ $t("home.title") || 'صفحه اصلی' }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Export & Navigation Actions -->
                <div v-if="receiptDetail" class="py-6 text-center flex flex-wrap items-center justify-center gap-3 mt-6 receipt-export-actions">
                    <!-- Split Dropdown Action Button -->
                    <div ref="exportDropdownRef" class="relative inline-flex items-stretch rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <!-- Primary Action (Default: Print) -->
                        <button
                            type="button"
                            :disabled="exporting"
                            @click="triggerExport(selectedExportAction)"
                            class="inline-flex items-center gap-2 rounded-s-2xl px-5 py-2.5 text-sm font-bold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg v-if="exporting" class="w-4 h-4 animate-spin text-amber-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
                            <svg v-else-if="selectedExportAction === 'print'" class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                <rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                            <svg v-else-if="selectedExportAction === 'png'" class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                            </svg>
                            <svg v-else class="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            <span>{{ exportButtonLabel }}</span>
                        </button>

                        <!-- Vertical Divider -->
                        <span class="w-[1px] bg-gray-200 dark:bg-gray-700 my-1.5"></span>

                        <!-- Arrow Dropdown Toggle -->
                        <button
                            type="button"
                            :disabled="exporting"
                            @click="exportDropdownOpen = !exportDropdownOpen"
                            class="inline-flex items-center justify-center px-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition rounded-e-2xl focus:outline-none disabled:opacity-50"
                            aria-label="سایر روش‌های خروجی"
                        >
                            <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': exportDropdownOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </button>

                        <!-- Dropdown Menu -->
                        <div
                            v-if="exportDropdownOpen"
                            class="absolute start-0 top-full mt-2 w-52 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-1.5 z-50 text-start animate-in fade-in duration-150"
                        >
                            <button
                                type="button"
                                @click="chooseAndTrigger('print')"
                                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-700/60"
                                :class="selectedExportAction === 'print' ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' : 'text-gray-700 dark:text-gray-200'"
                            >
                                <svg class="w-4 h-4 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                    <rect x="6" y="14" width="12" height="8"></rect>
                                </svg>
                                <span>{{ $t('receipt.print') || 'چاپ رسید' }}</span>
                                <span v-if="selectedExportAction === 'print'" class="ms-auto text-[10px] text-amber-500 font-normal">پیش‌فرض</span>
                            </button>
                            <button
                                type="button"
                                @click="chooseAndTrigger('png')"
                                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-700/60"
                                :class="selectedExportAction === 'png' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-gray-700 dark:text-gray-200'"
                            >
                                <svg class="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <polyline points="21 15 16 10 5 21"/>
                                </svg>
                                <span>{{ $t('receipt.exportPng') || 'دریافت تصویر (PNG)' }}</span>
                            </button>
                            <button
                                type="button"
                                @click="chooseAndTrigger('pdf')"
                                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-700/60"
                                :class="selectedExportAction === 'pdf' ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10' : 'text-gray-700 dark:text-gray-200'"
                            >
                                <svg class="w-4 h-4 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10 9 9 9 8 9"/>
                                </svg>
                                <span>{{ $t('receipt.exportPdf') || 'دریافت فایل (PDF)' }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Return Button -->
                    <router-link
                        :to="{ name: 'courses' }"
                        class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 px-5 py-2.5 text-sm font-bold text-gray-900 shadow-md shadow-amber-500/20 hover:shadow-lg transition"
                    >
                        <span>{{ $t("course.plural") || "دوره‌های آموزشی" }}</span>
                        <svg class="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12H19M19 12L13 6M19 12L13 18"/>
                        </svg>
                    </router-link>
                </div>
            </div>
        </div>
    </MasterPage>
</template>

<script>
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import axiosInstance from "@/store/axiosInstance";
import { computed } from "vue";
import moment from "moment-jalaali";
import {
    buildPaymentReceiptFilename,
    downloadPaymentReceiptPdf,
    downloadPaymentReceiptPng,
    printPaymentReceipt,
} from "@/utils/paymentReceiptExport";
import { showToastError } from "@/utils/toastConfig";
import SeoImage from "@/views/components/seo/SeoImage.vue";

export default {
    components: {
        MasterPage,
        SeoImage,
    },
    setup() {
        moment().format("jYYYY/jM/jD");
        const isRtl = computed(() => (import.meta.client && localStorage.getItem("direction") === "rtl"));
        if (isRtl.value) moment.loadPersian();

        return {
            moment,
        };
    },
    data() {
        return {
            receiptDetail: null,
            errorCode: null,
            receiptLoading: false,
            exporting: false,
            selectedExportAction: 'print',
            exportDropdownOpen: false,
        };
    },
    computed: {
        exportButtonLabel() {
            if (this.exporting) {
                return this.$t('receipt.exporting') || 'در حال آماده‌سازی...';
            }
            if (this.selectedExportAction === 'png') {
                return this.$t('receipt.exportPng') || 'دریافت تصویر (PNG)';
            }
            if (this.selectedExportAction === 'pdf') {
                return this.$t('receipt.exportPdf') || 'دریافت فایل (PDF)';
            }
            return this.$t('receipt.print') || 'چاپ رسید';
        },
    },
    mounted() {
        document.title = this.$t("receipt.pageTitle") || "رسید پرداخت";
        this.getReceiptDetail();
        if (import.meta.client) {
            document.addEventListener('click', this.handleOutsideClick);
        }
    },
    beforeUnmount() {
        if (import.meta.client) {
            document.removeEventListener('click', this.handleOutsideClick);
        }
    },
    methods: {
        handleOutsideClick(event) {
            const dropdown = this.$refs.exportDropdownRef;
            if (dropdown && !dropdown.contains(event.target)) {
                this.exportDropdownOpen = false;
            }
        },
        chooseAndTrigger(action) {
            this.selectedExportAction = action;
            this.exportDropdownOpen = false;
            this.triggerExport(action);
        },
        triggerExport(action) {
            if (action === 'png') {
                this.exportPng();
            } else if (action === 'pdf') {
                this.exportPdf();
            } else {
                this.printReceipt();
            }
        },
        getReceiptDetail() {
            this.receiptLoading = true;
            axiosInstance.post("/payment/receipt/detail", { uuid: this.$route.params.uuid }).then(
                (response) => {
                    this.receiptDetail = response?.data?.detail || null;
                    if (!this.receiptDetail) {
                        this.errorCode = 404;
                    }
                    this.receiptLoading = false;
                },
                (error) => {
                    this.errorCode = error?.response?.status || 500;
                    this.receiptLoading = false;
                }
            );
        },
        getPrintableElement() {
            return this.$refs.printableArea || document.getElementById('printable-area');
        },
        exportFilename(ext) {
            return buildPaymentReceiptFilename(this.receiptDetail?.reference_id, ext);
        },
        async printReceipt() {
            const element = this.getPrintableElement();
            if (!element) return;
            this.exporting = true;
            try {
                await printPaymentReceipt(element);
            } catch (error) {
                console.error('Payment receipt print failed:', error);
                showToastError(this.$t('receipt.exportError') || 'خطا در چاپ رسید');
            } finally {
                this.exporting = false;
            }
        },
        async exportPng() {
            const element = this.getPrintableElement();
            if (!element) return;

            this.exporting = true;
            try {
                await downloadPaymentReceiptPng(element, this.exportFilename('png'));
            } catch (error) {
                console.error('Payment receipt PNG export failed:', error);
                showToastError(this.$t('receipt.exportError') || 'خطا در ذخیره تصویر رسید');
            } finally {
                this.exporting = false;
            }
        },
        async exportPdf() {
            const element = this.getPrintableElement();
            if (!element) return;

            this.exporting = true;
            try {
                await downloadPaymentReceiptPdf(element, this.exportFilename('pdf'));
            } catch (error) {
                console.error('Payment receipt PDF export failed:', error);
                showToastError(this.$t('receipt.exportError') || 'خطا در ذخیره PDF رسید');
            } finally {
                this.exporting = false;
            }
        },
    },
};
</script>

<style>
@media print {
    @page {
        size: A5 portrait;
        margin: 10mm 8mm;
    }

    /* 1. Hide all website chrome, banners and action buttons */
    nav,
    header,
    footer,
    aside,
    #promotion-banner,
    .receipt-export-actions,
    .pwa-install-banner,
    [class*="Navbar"],
    [class*="Footer"],
    [class*="PromotionBanner"] {
        display: none !important;
    }

    /* 2. Reset document root and parent containers so nothing collapses */
    html,
    body,
    #__nuxt,
    #__nuxt > div,
    main {
        background: transparent !important;
        margin: 0 !important;
        padding: 0 !important;
        min-height: auto !important;
        height: auto !important;
        width: 100% !important;
        display: block !important;
        overflow: visible !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    /* Reset page content wrappers */
    .mx-auto.max-w-4xl,
    .flex.flex-col.items-center {
        display: block !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    /* 3. Render printable card centered on page */
    #printable-area {
        display: block !important;
        margin: 0 auto !important;
        width: 100% !important;
        max-width: 480px !important;
        box-shadow: none !important;
        border: 1px solid #e2e8f0 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    .dark #printable-area {
        border-color: #334155 !important;
        background-color: #111827 !important;
    }
}
</style>
