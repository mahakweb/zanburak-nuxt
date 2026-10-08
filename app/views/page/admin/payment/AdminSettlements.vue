<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button type="button" @click="fetchData"
                class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">بروزرسانی</span>
            </button>
        </template>

        <div class="min-w-0">
            <FinanceTrendCard
                title="روند تسویه‌ها"
                subtitle="تسویه‌شده و تسویه‌نشده در بازه انتخاب‌شده"
                endpoint="/admin/settlements/chart"
                positive-label="تسویه شده"
                negative-label="تسویه نشده"
                @update:metric="financeMetric = $event"
            />
            <div v-if="stats" class="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 mb-6">
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">کل پرداخت‌ها</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ displayStat(stats.total_payments, shareTotal) }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">تسویه شده</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ displayStat(stats.settled_payments, stats.settled_amount) }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-200/40 dark:bg-gray-800/50 rounded-lg">
                            <svg class="w-6 h-6 text-gray-800 dark:text-gray-50" viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <div class="ms-2">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-300">تسویه نشده</p>
                            <p class="font-bold text-gray-900 dark:text-white text-sm font-anjoman">{{ displayStat(stats.unsettled_payments, stats.unsettled_amount) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <AdminBulkActionBar :count="selectedIds.length">
                <button v-if="canChange" type="button" @click="openMark(selectedIds)"
                    class="h-8 px-3 text-xs font-semibold text-amber-800 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    تغییر وضعیت تسویه
                </button>
                <button type="button" @click="selectedIds = []"
                    class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    لغو انتخاب
                </button>
            </AdminBulkActionBar>

            <AdminListFilterBar
                v-model:search="searchQuery"
                search-placeholder="جستجو شناسه، پرداخت‌کننده..."
                @search="handleSearch"
                @clear-search="clearSearch"
                @clear-filters="clearFilters"
            >
                <AdminFilterSelect v-model="filterStatus" label="وضعیت تسویه" :options="statusOptions" min-width="sm" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterSort" label="مرتب‌سازی" :options="sortOptions" @change="onFilterChange" />
            </AdminListFilterBar>

            <div class="mt-4 flex items-center justify-end gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-amber-400 dark:bg-amber-600"></div>
                    <span class="text-xs font-medium text-gray-400">تسویه نشده</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-green-400 dark:bg-green-600"></div>
                    <span class="text-xs font-medium text-gray-400">تسویه شده</span>
                </div>
            </div>

            <div id="data-list">
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-2 whitespace-nowrap text-start w-10">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">شناسه پرداخت</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">پرداخت‌کننده</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">مبلغ نهایی</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ تسویه</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">مقصد واریز</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">رسید</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-if="!mounted">
                                <td colspan="8" class="py-10"><LoadingComponent /></td>
                            </tr>
                            <tr v-else-if="items.length === 0">
                                <td colspan="8" class="py-10 text-center text-sm text-gray-400">پرداختی برای نمایش نیست.</td>
                            </tr>
                            <tr v-for="item in items" :key="item.id" class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="relative ps-3 pe-1 py-2 whitespace-nowrap text-start w-10">
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                        :class="item.settlement_status === 'settled' ? 'bg-green-400 dark:bg-green-600' : 'bg-amber-400 dark:bg-amber-600'"></div>
                                    <div class="flex items-center justify-center">
                                        <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-medium text-gray-900 dark:text-white">{{ item.uuid }}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.reference_id }}</div>
                                </td>
                                <td class="px-1 py-3 text-start">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-opacity-10 rounded-full border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
                                            <img onerror="this.style.display='none'" class="w-full h-full object-cover" :src="item.user?.profile_pic" :alt="personName(item.user)" />
                                        </div>
                                        <div class="ms-2">
                                            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ personName(item.user) }}</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.user?.email || 'ایمیل نامشخص' }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-sm font-medium font-anjoman text-gray-900 dark:text-white">{{ formatCurrency(item.settle_amount) }} تومان</div>
                                    <div v-if="Number(item.platform_amount) > 0" class="text-[10px] text-rose-500 font-anjoman">کسر {{ formatCurrency(item.platform_amount) }}</div>
                                    <div v-if="Number(item.discount_amount) > 0" class="text-xs text-green-600 dark:text-green-400">
                                        تخفیف {{ formatCurrency(item.discount_amount) }}
                                        <span v-if="item.discount_code"> · {{ item.discount_code }}</span>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div v-if="item.settled_at" dir="ltr" class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg w-max">{{ formatDate(item.settled_at) }}</div>
                                    <div v-else class="text-xs text-gray-500">-</div>
                                </td>
                                <td class="px-1 py-3 text-start">
                                    <div v-if="!item.payouts?.length" class="text-xs text-gray-400">—</div>
                                    <div v-for="(payout, index) in item.payouts" :key="index" class="flex items-center gap-1.5 mb-1 last:mb-0">
                                        <img v-if="payout.bank?.logo" :src="payout.bank.logo" :alt="payout.bank.short" class="w-7 h-7 object-contain bg-white rounded-lg shrink-0" />
                                        <div class="min-w-0">
                                            <div class="text-[11px] text-gray-500">{{ payout.kind_label }} · {{ payout.bank?.short || payout.bank?.name }}</div>
                                            <div dir="ltr" class="text-xs font-anjoman text-gray-800 dark:text-gray-100">{{ payout.number }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start text-xs">{{ item.has_receipt ? 'دارد' : 'ندارد' }}</td>
                                <td class="px-1 py-3 whitespace-nowrap text-center">
                                    <div class="flex items-center justify-center gap-1">
                                        <button type="button" title="جزئیات" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-900/30" @click="openDetails(item)">
                                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.5"/></svg>
                                        </button>
                                        <button v-if="canChange" type="button" title="تغییر وضعیت" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-900/30" @click="openMark([item.id], item.settlement_status)">
                                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4 11.5-11.5z"/></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="h-24"></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="flex lg:flex-row flex-col items-center justify-between gap-4 -mt-20">
                <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                <div>
                    <div class="text-xs font-light text-gray-400 px-1 mb-1">تعداد:</div>
                    <select v-model.number="perPage" @change="onFilterChange" class="text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-2">
                        <option v-for="size in perPages" :key="size" :value="size">{{ size }}</option>
                    </select>
                </div>
            </div>
        </div>

        <BottomSheetDrawer v-model="showDetails" :initialHeight="0.75" :maxHeight="0.95" :minHeight="0.55"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[48rem] xl:w-[52rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-6 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div v-if="detailLoading" class="py-10"><LoadingComponent /></div>
            <div v-else-if="detail">
                <div class="mb-4 flex items-center justify-between gap-3">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">جزئیات تسویه</h3>
                    <button v-if="detail.can_change" type="button" class="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200" @click="openMark([detail.payment.id], detail.settlement_status)">
                        تغییر وضعیت
                    </button>
                </div>

                <table class="w-full text-sm rounded-lg overflow-hidden">
                    <tbody>
                        <tr v-for="row in detailRows" :key="row.label">
                            <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300 w-36">{{ row.label }}</td>
                            <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">{{ row.value }}</td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="detail.share" class="mt-3">
                    <SettlementShareCard
                        variant="strip"
                        :gross-amount="detail.share.gross_amount"
                        :platform-amount="detail.share.platform_amount"
                        :teacher-amount="detail.share.teacher_amount"
                        :site-percent="detail.share.site_percent"
                        :teacher-percent="detail.share.teacher_percent"
                        :explain="detail.share.explain"
                        payout-label="مدرس"
                    />
                </div>

                <div class="mt-4 rounded-md border border-gray-100 dark:border-opacity-10 p-2">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">موارد پرداخت</h4>
                    <p v-if="detail.limited_items" class="text-xs text-gray-500 mb-2">فقط موردهای مربوط به شما نمایش داده می‌شود.</p>
                    <div v-if="!detail.items.length" class="text-xs text-gray-400 px-2 py-3">موردی برای این پرداخت ثبت نشده است.</div>
                    <div v-for="line in detail.items" :key="line.id" class="bg-gray-100/70 dark:bg-gray-800/70 p-2 first:rounded-t-lg last:rounded-b-lg rounded-sm mb-0.5">
                        <div class="flex justify-between items-center gap-3">
                            <div class="min-w-0">
                                <div class="text-gray-800 dark:text-gray-50 text-xs font-semibold line-clamp-1">{{ line.title }}</div>
                                <div class="text-xs font-light text-gray-400">{{ line.kind }}</div>
                            </div>
                            <div class="text-end shrink-0">
                                <div class="text-gray-800 dark:text-gray-50 text-sm font-semibold font-anjoman">{{ formatCurrency(line.amount) }} تومان</div>
                                <div v-if="Number(line.gross_amount) > Number(line.amount)" class="text-[11px] text-gray-400 font-anjoman">اصلی {{ formatCurrency(line.gross_amount) }}</div>
                                <div v-if="Number(line.platform_amount) > 0" class="text-[11px] text-rose-500 font-anjoman">کسر سایت {{ formatCurrency(line.platform_amount) }}</div>
                                <div v-if="Number(line.discount_amount) > 0" class="text-xs text-green-600 dark:text-green-400">تخفیف {{ formatCurrency(line.discount_amount) }}</div>
                                <div v-if="line.discount_code" class="text-xs text-gray-500">کد {{ line.discount_code }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 rounded-md border border-gray-100 dark:border-opacity-10 p-2">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">تسویه و رسید</h4>
                    <p v-if="detail.receipt_error" class="text-xs text-rose-600 mb-2">رسید پیوست‌شده بارگذاری نشد.</p>
                    <div v-if="!detail.settlements.length" class="text-xs text-gray-400 px-2 py-3">برای این پرداخت هنوز تسویه‌ای ثبت نشده است.</div>
                    <div v-for="settlement in detail.settlements" :key="settlement.uuid" class="mb-3">
                        <table class="w-full text-sm">
                            <tbody>
                                <tr>
                                    <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 w-36">تسویه‌کننده</td>
                                    <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">{{ settlement.settled_by || '—' }}</td>
                                </tr>
                                <tr>
                                    <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500">تاریخ</td>
                                    <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">{{ formatDate(settlement.paid_at) }}</td>
                                </tr>
                                <tr v-if="settlement.payout">
                                    <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500">مقصد واریز</td>
                                    <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                        <div class="flex items-center gap-2">
                                            <img v-if="settlement.payout.bank?.logo" :src="settlement.payout.bank.logo" :alt="settlement.payout.bank.short" class="w-8 h-8 object-contain bg-white rounded-lg" />
                                            <div>
                                                <div class="text-xs font-medium">{{ settlement.payout.kind_label }} · {{ settlement.payout.bank?.name }}</div>
                                                <div dir="ltr" class="text-sm font-anjoman">{{ settlement.payout.number }}</div>
                                                <div v-if="settlement.payout.holder" class="text-xs font-normal text-gray-500">{{ settlement.payout.holder }}</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500">پیگیری</td>
                                    <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">{{ settlement.tracking_number || '—' }}</td>
                                </tr>
                                <tr v-if="settlement.description">
                                    <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500">توضیح</td>
                                    <td class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">{{ settlement.description }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="settlement.receipt && receiptUrls[settlement.uuid]" class="mt-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3">
                            <img v-if="isImage(settlement.receipt.mime)" :src="receiptUrls[settlement.uuid]" alt="رسید تسویه" class="max-h-72 w-full object-contain rounded-lg bg-gray-50 dark:bg-gray-800" />
                            <div v-else class="text-xs text-gray-500 mb-2">{{ settlement.receipt.original_name || 'فایل رسید' }}</div>
                            <button type="button" class="mt-3 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200" @click="downloadReceipt(settlement)">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v10m0 0l-3.5-3.5M12 14l3.5-3.5M5 19h14"/></svg>
                                دانلود رسید
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </BottomSheetDrawer>

        <SettlementMarkSheet v-model="showMark" :payment-ids="markIds" :initial-status="markInitial" :can-upload="canUpload" @saved="onMarked" />
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import AdminListFilterBar from "@/views/components/admin/AdminListFilterBar.vue";
import AdminFilterSelect from "@/views/components/admin/AdminFilterSelect.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import SettlementMarkSheet from "@/views/page/admin/payment/SettlementMarkSheet.vue";
import SettlementShareCard from "@/views/components/admin/SettlementShareCard.vue";
import FinanceTrendCard from "@/views/components/admin/FinanceTrendCard.vue";
import axiosInstance from "@/store/axiosInstance";
import debounce from "lodash/debounce";
import { hasAnyPermission } from "@/utils/acl";

export default {
    name: "AdminSettlements",
    components: {
        AdminMasterPage,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        AdminListFilterBar,
        AdminFilterSelect,
        LoadingComponent,
        PaginationComponent,
        BottomSheetDrawer,
        SettlementMarkSheet,
        SettlementShareCard,
        FinanceTrendCard,
    },
    data() {
        return {
            items: [],
            pagination: {},
            stats: null,
            financeMetric: "count",
            mounted: false,
            currentPage: Number(this.$route.query.page || 1),
            perPage: 20,
            perPages: [10, 20, 30, 50, 100],
            searchQuery: this.$route.query.search || "",
            filterStatus: this.$route.query.settlement_status || "all",
            filterSort: this.$route.query.sort || "newest",
            selectedIds: [],
            showDetails: false,
            detailLoading: false,
            detail: null,
            receiptUrls: {},
            showMark: false,
            markIds: [],
            markInitial: "settled",
            canChange: false,
            canUpload: false,
        };
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
        shareTotal() {
            return Number(this.stats?.settled_amount || 0) + Number(this.stats?.unsettled_amount || 0);
        },
        statusOptions() {
            return [
                { value: "all", label: "همه" },
                { value: "settled", label: "تسویه شده" },
                { value: "unsettled", label: "تسویه نشده" },
            ];
        },
        sortOptions() {
            return [
                { value: "newest", label: "جدیدترین" },
                { value: "oldest", label: "قدیمی‌ترین" },
                { value: "amount_high", label: "بیشترین مبلغ" },
                { value: "amount_low", label: "کمترین مبلغ" },
            ];
        },
        isAllSelected() {
            return this.items.length > 0 && this.selectedIds.length === this.items.length;
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.isAllSelected;
        },
        detailRows() {
            if (!this.detail) return [];
            const payment = this.detail.payment;
            const rows = [
                { label: "شناسه", value: payment.uuid },
                { label: "پرداخت‌کننده", value: this.personName(payment.user) },
                { label: "مبلغ واریزی", value: this.formatCurrency(payment.settle_amount) + " تومان" },
            ];
            if (Number(payment.gross_amount) > 0 && Number(payment.gross_amount) !== Number(payment.settle_amount)) {
                rows.push({ label: "مبلغ اصلی", value: this.formatCurrency(payment.gross_amount) + " تومان" });
            }
            if (Number(payment.platform_amount) > 0) {
                rows.push({ label: "کسر سایت", value: this.formatCurrency(payment.platform_amount) + " تومان" });
            }
            if (Number(payment.discount_amount) > 0) {
                rows.push({ label: "مبلغ تخفیف", value: this.formatCurrency(payment.discount_amount) + " تومان" });
            }
            if (payment.discount_code) {
                rows.push({ label: "کد تخفیف", value: payment.discount_code });
            }
            rows.push(
                { label: "وضعیت پرداخت", value: payment.status ? "پرداخت شده" : "پرداخت نشده" },
                { label: "تاریخ پرداخت", value: this.formatDate(payment.paid_at) },
                { label: "تاریخ تسویه", value: this.formatDate(payment.settled_at) },
                { label: "توضیح پرداخت", value: this.detail.description || "—" },
            );
            return rows;
        },
    },
    created() {
        this.canChange = hasAnyPermission(this.currentUser, ["settlements.change_status"]);
        this.canUpload = hasAnyPermission(this.currentUser, ["settlements.upload_receipt"]);
        this.fetchData();
    },
    beforeUnmount() {
        this.revokeReceipts();
    },
    methods: {
        onFilterChange() {
            this.currentPage = 1;
            this.fetchData();
        },
        clearSearch() {
            this.searchQuery = "";
            this.onFilterChange();
        },
        handleSearch: debounce(function () {
            this.onFilterChange();
        }, 700),
        clearFilters() {
            this.filterStatus = "all";
            this.filterSort = "newest";
            this.searchQuery = "";
            this.onFilterChange();
        },
        updatePage(page) {
            this.currentPage = page;
            this.fetchData();
        },
        toggleSelectAll() {
            this.selectedIds = this.isAllSelected ? [] : this.items.map((item) => item.id);
        },
        async fetchData() {
            this.mounted = false;
            try {
                const response = await axiosInstance.post("/admin/settlements/ledger", {
                    page: this.currentPage,
                    perPage: this.perPage,
                    search: this.searchQuery,
                    settlement_status: this.filterStatus,
                    sort: this.filterSort,
                });
                this.items = response.data.payments || [];
                this.pagination = response.data.pagination || {};
                this.stats = response.data.stats || null;
                this.canChange = !!response.data.can_change;
                this.canUpload = !!response.data.can_upload;
                this.selectedIds = [];
            } finally {
                this.mounted = true;
            }
        },
        async openDetails(item) {
            this.showDetails = true;
            this.detailLoading = true;
            this.detail = null;
            this.revokeReceipts();
            try {
                const response = await axiosInstance.get(`/admin/settlements/payments/${item.uuid}`);
                this.detail = response.data.payment;
                try {
                    await this.loadReceipts();
                } catch (error) {
                    this.detail = { ...this.detail, receipt_error: true };
                }
            } finally {
                this.detailLoading = false;
            }
        },
        async loadReceipts() {
            if (!this.detail?.can_view_receipt) return;
            for (const settlement of this.detail.settlements || []) {
                if (!settlement.receipt) continue;
                const response = await axiosInstance.get(`/admin/settlements/${settlement.uuid}/receipt`, { responseType: "blob" });
                this.receiptUrls = {
                    ...this.receiptUrls,
                    [settlement.uuid]: URL.createObjectURL(response.data),
                };
            }
        },
        async downloadReceipt(settlement) {
            const response = await axiosInstance.get(`/admin/settlements/${settlement.uuid}/receipt`, {
                params: { download: 1 },
                responseType: "blob",
            });
            const url = URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.download = settlement.receipt?.original_name || "receipt";
            link.click();
            URL.revokeObjectURL(url);
        },
        revokeReceipts() {
            Object.values(this.receiptUrls).forEach((url) => URL.revokeObjectURL(url));
            this.receiptUrls = {};
        },
        openMark(ids, status = null) {
            this.markIds = [...ids];
            this.markInitial = status === "settled" ? "unsettled" : "settled";
            this.showMark = true;
        },
        async onMarked() {
            this.showDetails = false;
            await this.fetchData();
        },
        personName(user) {
            if (!user) return "نامشخص";
            return `${user.first_name || ""} ${user.last_name || ""}`.trim() || "نامشخص";
        },
        displayStat(count, amount) {
            if (this.financeMetric === "amount") {
                return `${this.formatCurrency(amount)} تومان`;
            }
            return this.formatCurrency(count);
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat("fa-IR").format(Number(amount || 0));
        },
        formatDate(value) {
            if (!value) return "—";
            return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
        },
        isImage(mime) {
            return typeof mime === "string" && mime.startsWith("image/");
        },
    },
};
</script>
