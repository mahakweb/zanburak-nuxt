<template>
    <div class="space-y-4">
        <!-- Step 1: User -->
        <section v-show="stepId === 'user'" class="admin-form-section">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div class="space-y-4">
                    <div>
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white">انتخاب کاربر</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">ابتدا کاربر پرداخت‌کننده را مشخص کنید</p>
                    </div>

                    <div>
                        <label class="field-label">جستجوی کاربر <span class="text-rose-500">*</span></label>
                        <div class="relative">
                            <input
                                v-model="root.searchQuery"
                                type="text"
                                placeholder="نام، ایمیل یا نام کاربری"
                                class="form-input"
                                @input="root.handleSearch"
                            />
                            <div v-if="root.searchLoading" class="absolute end-3 top-1/2 -translate-y-1/2">
                                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                            </div>
                            <div
                                v-if="root.searchResults.length > 0 && root.searchQuery"
                                class="absolute z-20 w-full p-2 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/80 dark:border-gray-700 max-h-60 overflow-y-auto custom-scrollbar"
                            >
                                <button
                                    v-for="user in root.searchResults"
                                    :key="user.id"
                                    type="button"
                                    @click="root.selectUser(user)"
                                    class="w-full text-start px-3 py-2.5 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                                >
                                    <div class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                                        <img v-if="user.profile_pic" :src="user.profile_pic" :alt="user.first_name" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                        <div v-else class="w-full h-full flex items-center justify-center text-amber-500 text-sm font-bold">{{ user.first_name?.charAt(0) }}</div>
                                    </div>
                                    <div class="min-w-0">
                                        <div class="font-semibold text-gray-800 dark:text-gray-100 truncate">{{ user.first_name }} {{ user.last_name }}</div>
                                        <div class="text-xs text-gray-400 truncate">{{ user.email }}</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="root.selectedUser" class="rounded-xl border border-emerald-200/80 bg-emerald-50/60 dark:bg-emerald-900/15 dark:border-emerald-800/40 p-4">
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 overflow-hidden ring-2 ring-emerald-200/80 dark:ring-emerald-700/50 shrink-0">
                                    <img v-if="root.selectedUser.profile_pic" :src="root.selectedUser.profile_pic" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                    <div v-else class="w-full h-full flex items-center justify-center text-amber-500 font-bold">{{ root.selectedUser.first_name?.charAt(0) }}</div>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ root.selectedUser.first_name }} {{ root.selectedUser.last_name }}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ root.selectedUser.email }}</p>
                                    <p class="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                        موجودی:
                                        <span class="font-anjoman">{{ root.formatCurrency(root.selectedUser.wallet_balance) }}</span>
                                        <img :src="tomanIcon" alt="" class="w-3 h-3 opacity-70" />
                                    </p>
                                </div>
                            </div>
                            <button type="button" @click="root.clearSelectedUser()" class="shrink-0 p-1.5 rounded-lg bg-white/80 dark:bg-gray-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="hidden lg:flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-amber-50/50 dark:from-gray-800/50 dark:via-gray-900 dark:to-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 min-h-[280px]">
                    <ManualPaymentIllustration />
                </div>
            </div>

            <div class="lg:hidden mt-4 rounded-2xl bg-gradient-to-br from-rose-50/60 to-amber-50/40 dark:from-gray-800/40 dark:to-gray-900/30 border border-gray-100 dark:border-gray-800 p-3">
                <ManualPaymentIllustration />
            </div>
        </section>

        <!-- Step 2: Items -->
        <section v-show="stepId === 'items'" class="admin-form-section space-y-4">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">آیتم‌های پرداخت</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">دوره، اشتراک، مسیر یا شارژ کیف پول را اضافه کنید</p>
            </div>

            <div v-if="root.selectedUser" class="inline-flex items-center gap-2 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                کاربر: {{ root.selectedUser.first_name }} {{ root.selectedUser.last_name }}
            </div>

            <div class="space-y-3">
                <div
                    v-for="(item, index) in root.paymentItems"
                    :key="item._key || index"
                    class="rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/30 p-4"
                >
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="text-xs font-bold text-amber-600 dark:text-amber-400">آیتم {{ index + 1 }}</h4>
                        <button v-if="root.paymentItems.length > 1" type="button" @click="root.removeItem(index)" class="p-1 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="field-label">نوع آیتم <span class="text-rose-500">*</span></label>
                            <select
                                :value="item.itemType"
                                @change="root.setItemType(item, $event.target.value)"
                                class="form-input"
                                :class="{ 'ring-2 ring-rose-500': errorAt(`items.${index}.itemType`) }"
                            >
                                <option value="">انتخاب کنید</option>
                                <option value="course">دوره</option>
                                <option value="plan">اشتراک</option>
                                <option value="path">مسیر یادگیری</option>
                                <option value="wallet">موجودی کیف پول</option>
                            </select>
                        </div>

                        <div v-if="item.itemType && item.itemType !== 'wallet'">
                            <label class="field-label">
                                انتخاب {{ root.getItemTypeLabel(item.itemType) }}
                                <span class="text-rose-500">*</span>
                            </label>

                            <div v-if="root.hasItemSelection(item)" class="flex items-center justify-between gap-2 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-900/15 px-3 py-2">
                                <span class="text-xs font-semibold text-emerald-800 dark:text-emerald-300 truncate">
                                    {{ item.selected?.title || 'انتخاب شد' }}
                                </span>
                                <button type="button" @click="root.clearItemSelection(item)" class="shrink-0 text-[11px] font-semibold text-rose-600 hover:underline">
                                    تغییر
                                </button>
                            </div>

                            <div v-else class="relative">
                                <input
                                    v-model="item.search"
                                    type="text"
                                    :placeholder="`جستجوی ${root.getItemTypeLabel(item.itemType)}...`"
                                    class="form-input"
                                    @input="root.handleItemSearch(item, index)"
                                />
                                <div v-if="item.searchLoading" class="absolute end-3 top-1/2 -translate-y-1/2">
                                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
                                </div>
                                <div v-if="item.searchResults.length > 0 && item.search" class="absolute z-20 w-full p-2 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/80 dark:border-gray-700 max-h-52 overflow-y-auto custom-scrollbar">
                                    <button
                                        v-for="searchItem in item.searchResults"
                                        :key="searchItem.id"
                                        type="button"
                                        @mousedown.prevent
                                        @click="root.selectItem(item, searchItem)"
                                        class="w-full text-start px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
                                    >
                                        <div class="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                                            <img v-if="searchItem.poster || searchItem.icon" :src="searchItem.poster || searchItem.icon" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                        </div>
                                        <div class="min-w-0">
                                            <div class="text-xs font-semibold truncate">{{ searchItem.title }}</div>
                                            <div v-if="searchItem.price" class="text-[10px] text-gray-400 flex items-center gap-0.5">
                                                {{ root.formatCurrency(searchItem.price) }}
                                                <img :src="tomanIcon" alt="" class="w-3 h-3 opacity-60" />
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-if="item.itemType === 'wallet'" class="md:col-span-2">
                            <div class="rounded-lg bg-amber-50/80 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-800/30 px-3 py-2 text-[11px] text-amber-800 dark:text-amber-300">
                                مبلغ واردشده به موجودی کیف پول کاربر اضافه می‌شود.
                            </div>
                        </div>

                        <div>
                            <label class="field-label">قیمت (تومان) <span class="text-rose-500">*</span></label>
                            <input v-model.number="item.price" type="number" min="0" class="form-input" @input="root.updateTotals" :class="{ 'ring-2 ring-rose-500': errorAt(`items.${index}.price`) }" />
                        </div>

                        <div v-if="item.itemType !== 'wallet'">
                            <label class="field-label">مبلغ تخفیف (تومان)</label>
                            <input v-model.number="item.discount_amount" type="number" min="0" class="form-input" @input="root.updateTotals" />
                        </div>
                    </div>
                </div>

                <button type="button" @click="root.addItem()" class="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs font-semibold text-gray-500 hover:border-amber-400 hover:text-amber-600 transition-colors">
                    افزودن آیتم جدید
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11,11 L11,7 C11,6.44771525 11.4477153,6 12,6 C12.5522847,6 13,6.44771525 13,7 L13,11 L17,11 C17.5522847,11 18,11.4477153 18,12 C18,12.5522847 17.5522847,13 17,13 L13,13 L13,17 C13,17.5522847 12.5522847,18 12,18 C11.4477153,18 11,17.5522847 11,17 L11,13 L7,13 C6.44771525,13 6,12.5522847 6,12 C6,11.4477153 6.44771525,11 7,11 L11,11 Z" /></svg>
                </button>
            </div>
        </section>

        <!-- Step 3: Details -->
        <section v-show="stepId === 'details'" class="admin-form-section space-y-4">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">مشخصات پرداخت</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">روش پرداخت، تخفیف و تنظیمات تکمیلی</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="field-label">مبلغ کل (تومان) <span class="text-rose-500">*</span></label>
                    <input v-model.number="root.totalAmount" type="number" min="0" class="form-input font-anjoman" @input="root.updateTotals" :class="{ 'ring-2 ring-rose-500': errorAt('amount') }" />
                </div>
                <div>
                    <label class="field-label">تخفیف کل (تومان)</label>
                    <input v-model.number="root.totalDiscount" type="number" min="0" class="form-input font-anjoman" @input="root.updateTotals" />
                </div>
                <div>
                    <label class="field-label">کد تخفیف کل</label>
                    <div class="relative">
                        <input v-model="root.totalDiscountCode" type="text" class="form-input" @input="root.validateTotalDiscount" />
                        <div v-if="root.totalDiscountLoading" class="absolute end-3 top-1/2 -translate-y-1/2">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="field-label">روش پرداخت <span class="text-rose-500">*</span></label>
                    <select v-model="root.paymentMethod" @change="root.onPaymentMethodChange" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('payment_method') }">
                        <option value="">انتخاب کنید</option>
                        <option value="wallet" :disabled="root.hasWalletItem()">کیف پول</option>
                        <option value="bank">درگاه بانکی</option>
                        <option value="wallet_bank">کیف پول + درگاه</option>
                    </select>
                    <p v-if="root.hasWalletItem()" class="mt-1 text-[10px] text-amber-600 dark:text-amber-400">برای شارژ کیف پول نمی‌توان از کیف پول پرداخت کرد.</p>
                </div>
                <div v-if="root.paymentMethod === 'bank' || root.paymentMethod === 'wallet_bank'">
                    <label class="field-label">درگاه پرداخت <span class="text-rose-500">*</span></label>
                    <select v-model="root.gateway" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('driver') }">
                        <option value="">انتخاب کنید</option>
                        <option value="zibal">زیبال</option>
                        <option value="zarinpal">زرین‌پال</option>
                        <option value="digipay">دیجی‌پی</option>
                    </select>
                </div>
                <div>
                    <label class="field-label">تاریخ انقضا</label>
                    <input v-model="root.expiredAt" type="datetime-local" class="form-input" />
                </div>
                <div v-if="!root.isEditMode" class="flex items-center md:col-span-2">
                    <input v-model="root.autoApprove" type="checkbox" id="payment-auto-approve" class="custom-checkbox" :class="root.autoApprove ? 'is-checked' : ''" />
                    <label for="payment-auto-approve" class="ms-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">تایید خودکار پرداخت</label>
                </div>
                <div class="md:col-span-2">
                    <label class="field-label">توضیحات</label>
                    <textarea v-model="root.description" rows="3" class="form-input resize-none"></textarea>
                </div>
            </div>
        </section>

        <!-- Step 4: Confirm -->
        <section v-show="stepId === 'confirm'" class="admin-form-section space-y-4">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">تایید و ثبت</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">خلاصه پرداخت را بررسی کنید</p>
            </div>

            <div class="rounded-xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                <div class="px-4 py-3 bg-gray-50/80 dark:bg-gray-800/40">
                    <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">کاربر</p>
                    <p class="text-sm font-bold text-gray-900 dark:text-white">{{ root.selectedUser?.first_name }} {{ root.selectedUser?.last_name }}</p>
                    <p class="text-xs text-gray-500">{{ root.selectedUser?.email }}</p>
                </div>

                <div class="px-4 py-3">
                    <p class="text-[10px] font-semibold text-gray-400 mb-2">آیتم‌ها</p>
                    <ul class="space-y-2">
                        <li v-for="(item, index) in root.paymentItems" :key="index" class="flex items-center justify-between gap-2 text-xs">
                            <span class="text-gray-600 dark:text-gray-300 truncate">{{ item.selected?.title || root.getItemTypeLabel(item.itemType) }}</span>
                            <span class="font-semibold text-gray-900 dark:text-white shrink-0 flex items-center gap-0.5 font-anjoman">
                                {{ root.formatCurrency(item.price - (item.discount_amount || 0)) }}
                                <img :src="tomanIcon" alt="" class="w-3 h-3 opacity-60" />
                            </span>
                        </li>
                    </ul>
                </div>

                <div class="px-4 py-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <span class="text-gray-400">روش پرداخت</span>
                        <p class="font-semibold text-gray-800 dark:text-gray-100 mt-0.5">{{ root.paymentMethodLabel(root.paymentMethod) }}</p>
                    </div>
                    <div v-if="root.paymentMethod === 'bank' || root.paymentMethod === 'wallet_bank'">
                        <span class="text-gray-400">درگاه</span>
                        <p class="font-semibold text-gray-800 dark:text-gray-100 mt-0.5">{{ root.gatewayLabel(root.gateway) }}</p>
                    </div>
                    <div>
                        <span class="text-gray-400">مبلغ کل</span>
                        <p class="font-semibold text-gray-800 dark:text-gray-100 mt-0.5 font-anjoman flex items-center gap-0.5">
                            {{ root.formatCurrency(root.totalAmount) }}
                            <img :src="tomanIcon" alt="" class="w-3 h-3 opacity-60" />
                        </p>
                    </div>
                    <div>
                        <span class="text-gray-400">تخفیف</span>
                        <p class="font-semibold text-gray-800 dark:text-gray-100 mt-0.5 font-anjoman">{{ root.formatCurrency(root.totalDiscount) }}</p>
                    </div>
                </div>

                <div class="px-4 py-3 bg-emerald-50/60 dark:bg-emerald-900/15 flex items-center justify-between">
                    <span class="text-sm font-bold text-emerald-800 dark:text-emerald-300">مبلغ نهایی</span>
                    <span class="text-base font-black text-emerald-700 dark:text-emerald-400 font-anjoman flex items-center gap-1">
                        {{ root.formatCurrency(root.finalAmount) }}
                        <img :src="tomanIcon" alt="" class="w-3.5 h-3.5 opacity-70" />
                    </span>
                </div>
            </div>

            <div class="flex justify-end">
                <router-link :to="{ name: 'admin-payments-list' }" class="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2">
                    انصراف و بازگشت به لیست
                </router-link>
            </div>
        </section>
    </div>
</template>

<script>
import ManualPaymentIllustration from '@/views/components/payment/ManualPaymentIllustration.vue';
import tomanIcon from '@/assets/image/svg/Toman.svg';

export default {
    name: 'PaymentFormSections',
    components: { ManualPaymentIllustration },
    props: {
        stepId: { type: String, required: true },
    },
    inject: {
        paymentFormRoot: { default: null },
    },
    data() {
        return { tomanIcon };
    },
    computed: {
        root() {
            return this.paymentFormRoot;
        },
    },
    methods: {
        errorAt(path) {
            return this.root?.errorAt(path);
        },
    },
};
</script>
