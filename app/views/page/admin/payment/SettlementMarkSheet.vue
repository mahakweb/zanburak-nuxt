<template>
    <BottomSheetDrawer :model-value="modelValue" :initialHeight="0.72" :maxHeight="0.92" :minHeight="0.45"
        :autoCloseOnMin="true" :closeOnBackdrop="!loading" :lockScroll="true"
        :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[44rem] xl:w-[48rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
        :contentClass="'px-4 pb-6 overflow-auto custom-scrollbar'"
        :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'"
        @update:model-value="$emit('update:modelValue', $event)">
        <form class="space-y-4" @submit.prevent="submit">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">ثبت تسویه</h3>
                    <p class="text-xs text-gray-500 mt-1">یک رسید و یک مقصد برای همه پرداخت‌های انتخاب‌شده.</p>
                </div>
                <span class="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-gray-800 dark:bg-amber-300/20 dark:text-amber-100">{{ paymentIds.length }} پرداخت</span>
            </div>
            <div v-if="share">
                <SettlementShareCard
                    variant="strip"
                    :gross-amount="share.gross_amount"
                    :platform-amount="share.platform_amount"
                    :teacher-amount="share.teacher_amount"
                    :site-percent="share.site_percent"
                    :teacher-percent="share.teacher_percent"
                    :explain="share.explain"
                    payout-label="مدرس"
                />
            </div>
            <div>
                <label class="field-label">وضعیت</label>
                <div class="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1 dark:bg-gray-800">
                    <button type="button" class="h-10 rounded-xl text-sm font-semibold transition" :class="form.status === 'settled' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white' : 'text-gray-500'" @click="chooseSettled">تسویه شده</button>
                    <button type="button" class="h-10 rounded-xl text-sm font-semibold transition" :class="form.status === 'unsettled' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white' : 'text-gray-500'" @click="form.status = 'unsettled'">تسویه نشده</button>
                </div>
            </div>
            <div v-if="form.status === 'settled'" class="space-y-3 rounded-2xl border border-gray-200 p-3 dark:border-gray-700" :class="showPayoutError ? 'border-rose-300 dark:border-rose-800' : ''">
                <div class="flex items-center justify-between gap-2">
                    <label class="field-label !mb-0">مقصد واریز</label>
                    <span class="text-[10px] font-semibold text-rose-500">الزامی</span>
                </div>
                <p v-if="accountsLoading" class="text-xs text-gray-400">در حال دریافت حساب‌های کاربر...</p>
                <p v-else-if="recipients.length === 0" class="text-xs text-rose-600">برای این پرداخت حساب بانکی پیدا نشد.</p>
                <div v-for="person in recipients" :key="person.user_id" class="space-y-2">
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ person.name }}</div>
                    <div class="grid grid-cols-3 gap-2">
                        <button v-for="item in kinds" :key="item.value" type="button" class="h-8 rounded-lg text-xs font-semibold" :class="kindOf(person) === item.value ? 'bg-amber-300 text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'" @click="setKind(person, item.value)">{{ item.label }}</button>
                    </div>
                    <p v-if="accountsOf(person).length === 0" class="text-xs text-rose-600">در این دسته شبا، کارت یا حسابی نیست.</p>
                    <button v-for="account in accountsOf(person)" :key="account.id" type="button" class="w-full flex items-center gap-2 rounded-xl border px-2 py-2 text-start transition" :class="choices[person.user_id] === account.id ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20' : 'border-transparent bg-gray-50 dark:bg-gray-800/60'" @click="pickAccount(person, account.id)">
                        <img v-if="account.bank?.logo" :src="account.bank.logo" :alt="account.bank.short" class="w-8 h-8 object-contain bg-white rounded-lg" />
                        <span class="min-w-0 flex-1">
                            <span class="block text-xs text-gray-500">{{ account.bank?.name }}<span v-if="account.is_default"> · پیش‌فرض</span></span>
                            <span dir="ltr" class="block text-sm font-anjoman text-gray-900 dark:text-white truncate">{{ account.formatted }}</span>
                        </span>
                        <span v-if="choices[person.user_id] === account.id" class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-300 text-gray-900">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        </span>
                    </button>
                </div>
                <p v-if="showPayoutError" class="text-xs text-rose-600">یک شبا، کارت یا حساب را انتخاب کنید.</p>
            </div>
            <div class="grid grid-cols-1 gap-3">
                <div>
                    <label class="field-label">شماره پیگیری</label>
                    <input v-model="form.tracking_number" type="text" class="form-input" placeholder="اختیاری" />
                </div>
                <div>
                    <label class="field-label">توضیح</label>
                    <textarea v-model="form.description" rows="2" class="form-input" placeholder="اختیاری"></textarea>
                </div>
            </div>
            <div v-if="form.status === 'settled'">
                <div class="mb-1.5 flex items-center justify-between gap-2">
                    <label class="field-label !mb-0">تصویر رسید</label>
                    <span class="text-[10px] font-semibold text-rose-500">الزامی</span>
                </div>
                <label class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-5 cursor-pointer transition" :class="showReceiptError ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/20' : (file ? 'border-amber-300 bg-amber-50/60 dark:bg-amber-900/10' : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40')">
                    <img v-if="preview" :src="preview" alt="پیش‌نمایش رسید" class="max-h-48 rounded-xl object-contain" />
                    <template v-else>
                        <svg class="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-2-2l1.2-1.2a2 2 0 012.8 0L20 15M8 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <span class="text-xs text-gray-500">تصویر رسید را انتخاب کنید</span>
                    </template>
                    <span v-if="file && !preview" class="text-xs font-medium text-gray-700 dark:text-gray-200">{{ file.name }}</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" class="hidden" @change="onFile" />
                </label>
                <p v-if="showReceiptError" class="mt-1.5 text-xs text-rose-600">بدون تصویر رسید نمی‌توان تسویه را ثبت کرد.</p>
                <p v-else-if="!canUpload" class="mt-1.5 text-xs text-rose-600">اجازه آپلود رسید را ندارید.</p>
            </div>
            <div v-if="loading && file" class="space-y-1.5 rounded-2xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div class="h-1.5 rounded-full bg-amber-400 transition-all" :style="{ width: percent + '%' }"></div>
                </div>
                <p class="text-xs text-gray-500">{{ phase === 'save' ? 'در حال ذخیره رسید...' : 'در حال آپلود ' + percent + '٪' }}</p>
            </div>
            <p v-if="error" class="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ error }}</p>
            <button type="submit" :disabled="loading || paymentIds.length === 0" class="h-11 w-full rounded-xl bg-amber-300 text-sm font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-50">
                {{ loading ? 'در حال ذخیره...' : (form.status === 'unsettled' ? 'برداشتن تسویه' : 'ثبت تسویه') }}
            </button>
        </form>
    </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import SettlementShareCard from "@/views/components/admin/SettlementShareCard.vue";
import axiosInstance from "@/store/axiosInstance";

export default {
    name: "SettlementMarkSheet",
    components: { BottomSheetDrawer, SettlementShareCard },
    props: {
        modelValue: { type: Boolean, default: false },
        paymentIds: { type: Array, default: () => [] },
        initialStatus: { type: String, default: "settled" },
        canUpload: { type: Boolean, default: false },
    },
    emits: ["update:modelValue", "saved"],
    data() {
        return {
            form: { status: "settled", tracking_number: "", description: "" },
            kinds: [
                { value: "sheba", label: "شبا" },
                { value: "card", label: "کارت" },
                { value: "account", label: "حساب" },
            ],
            recipients: [],
            share: null,
            choices: {},
            kindByUser: {},
            accountsLoading: false,
            file: null,
            preview: "",
            loading: false,
            percent: 0,
            phase: "upload",
            tried: false,
            error: "",
        };
    },
    computed: {
        missingPeople() {
            return this.recipients.filter((person) => !this.choices[person.user_id]);
        },
        payoutReady() {
            return this.recipients.length > 0 && this.missingPeople.length === 0;
        },
        showPayoutError() {
            return this.form.status === "settled" && this.tried && !this.accountsLoading && !this.payoutReady;
        },
        showReceiptError() {
            return this.form.status === "settled" && this.tried && !this.file;
        },
        canSubmit() {
            if (this.loading || this.paymentIds.length === 0) return false;
            if (this.form.status !== "settled") return true;
            return !this.accountsLoading && this.payoutReady && !!this.file && this.canUpload;
        },
    },
    watch: {
        modelValue(open) {
            if (open) this.reset();
        },
    },
    beforeUnmount() {
        this.clearPreview();
    },
    methods: {
        reset() {
            this.form = {
                status: this.initialStatus === "unsettled" ? "unsettled" : "settled",
                tracking_number: "",
                description: "",
            };
            this.file = null;
            this.recipients = [];
            this.share = null;
            this.choices = {};
            this.kindByUser = {};
            this.clearPreview();
            this.loadRecipients();
            this.loading = false;
            this.percent = 0;
            this.phase = "upload";
            this.tried = false;
            this.error = "";
        },
        clearPreview() {
            if (this.preview) URL.revokeObjectURL(this.preview);
            this.preview = "";
        },
        chooseSettled() {
            this.form.status = "settled";
            if (this.recipients.length === 0) this.loadRecipients();
        },
        kindOf(person) {
            return this.kindByUser[person.user_id] || "sheba";
        },
        accountsOf(person) {
            return (person.accounts || []).filter((account) => account.kind === this.kindOf(person));
        },
        setKind(person, kind) {
            this.kindByUser[person.user_id] = kind;
            const current = (person.accounts || []).find((account) => account.id === this.choices[person.user_id]);
            if (current && current.kind === kind) return;
            const next = (person.accounts || []).find((account) => account.kind === kind && account.is_default)
                || (person.accounts || []).find((account) => account.kind === kind);
            this.choices[person.user_id] = next ? next.id : null;
        },
        async loadRecipients() {
            if (!this.paymentIds.length) return;
            this.accountsLoading = true;
            try {
                const response = await axiosInstance.post("/admin/settlements/payments/payout-options", {
                    payment_ids: this.paymentIds,
                });
                this.share = response?.data?.share || null;
                this.recipients = response?.data?.recipients || [];
                if (this.form.status !== "settled") return;
                this.recipients.forEach((person) => {
                    const preferred = (person.accounts || []).find((account) => account.is_default) || person.accounts?.[0];
                    this.kindByUser[person.user_id] = preferred?.kind || "sheba";
                    this.choices[person.user_id] = preferred?.id || null;
                });
            } catch (error) {
                this.error = error?.response?.data?.message || "حساب‌های بانکی کاربر دریافت نشد.";
            } finally {
                this.accountsLoading = false;
            }
        },
        pickAccount(person, accountId) {
            this.choices[person.user_id] = accountId;
            this.error = "";
        },
        onFile(event) {
            const file = event.target.files?.[0] || null;
            this.file = file;
            this.clearPreview();
            this.error = "";
            if (file && file.type.startsWith("image/")) {
                this.preview = URL.createObjectURL(file);
            }
        },
        async submit() {
            this.error = "";
            if (this.form.status === "settled" && !this.canSubmit) {
                this.tried = true;
                if (!this.payoutReady) this.error = "یک شبا، کارت یا حساب را انتخاب کنید.";
                else if (!this.file) this.error = "تصویر رسید را انتخاب کنید.";
                else if (!this.canUpload) this.error = "اجازه آپلود رسید را ندارید.";
                return;
            }
            this.loading = true;
            this.percent = 0;
            this.phase = "upload";
            try {
                const body = new FormData();
                this.paymentIds.forEach((id) => body.append("payment_ids[]", id));
                body.append("status", this.form.status);
                if (this.form.tracking_number) body.append("tracking_number", this.form.tracking_number);
                if (this.form.description) body.append("description", this.form.description);
                if (this.form.status === "settled") {
                    let index = 0;
                    this.recipients.forEach((person) => {
                        const accountId = this.choices[person.user_id];
                        if (!accountId) return;
                        body.append(`payouts[${index}][user_id]`, person.user_id);
                        body.append(`payouts[${index}][bank_account_id]`, accountId);
                        index += 1;
                    });
                }
                if (this.file && this.form.status === "settled") body.append("receipt", this.file);
                const response = await axiosInstance.post("/admin/settlements/payments/mark", body, {
                    timeout: 120000,
                    onUploadProgress: (event) => {
                        if (!event.total) return;
                        const next = Math.round((event.loaded * 100) / event.total);
                        this.percent = Math.min(next, 99);
                        if (event.loaded >= event.total) this.phase = "save";
                    },
                });
                if (this.file) this.percent = 100;
                if (this.$toast && response?.data?.message) this.$toast.success(response.data.message);
                this.$emit("update:modelValue", false);
                this.$emit("saved");
            } catch (error) {
                this.error = error?.response?.data?.message || "ذخیره تسویه انجام نشد.";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.form-input {
    display: block;
    width: 100%;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.75rem;
    outline: none;
    background: #f3f4f6;
    color: #111827;
    border: 1px solid transparent;
}
.form-input:focus { box-shadow: 0 0 0 2px #facc15; }
.dark .form-input { background: #374151; color: #fff; }
.field-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.375rem;
}
.dark .field-label { color: #9ca3af; }
</style>
