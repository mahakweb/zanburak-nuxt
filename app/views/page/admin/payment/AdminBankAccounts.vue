<template>
    <AdminMasterPage>
        <div class="min-w-0 grid grid-cols-1 xl:grid-cols-5 gap-4">
            <form class="xl:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-4" @submit.prevent="save">
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <h2 class="text-sm font-bold text-gray-900 dark:text-white">{{ editingId ? 'ویرایش حساب' : 'افزودن حساب بانکی' }}</h2>
                        <p class="text-xs text-gray-500 mt-1">با چند رقم اول، بانک و لوگوی آن مشخص می‌شود.</p>
                    </div>
                    <button v-if="editingId" type="button" class="text-xs text-gray-500" @click="cancelEdit">انصراف</button>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <button v-for="item in kinds" :key="item.value" type="button" class="h-9 rounded-xl text-xs font-semibold"
                        :class="form.kind === item.value ? 'bg-amber-300 text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'"
                        @click="setKind(item.value)">{{ item.label }}</button>
                </div>
                <div>
                    <label class="field-label">{{ numberLabel }}</label>
                    <input v-model="form.number" type="text" class="form-input font-anjoman" dir="ltr" :placeholder="placeholder" @input="inspect" />
                    <div v-if="result?.bank" class="mt-2 flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
                        <img :src="result.bank.logo" :alt="result.bank.short" class="w-8 h-8 object-contain bg-white rounded-lg" />
                        <span>{{ result.bank.name }}</span>
                    </div>
                </div>
                <div v-if="form.kind === 'account'" class="relative">
                    <label class="field-label">بانک</label>
                    <button type="button" class="form-input flex items-center gap-2 text-right" @click="bankOpen = !bankOpen">
                        <img v-if="selectedBank?.logo" :src="selectedBank.logo" :alt="selectedBank.short" class="w-6 h-6 object-contain" />
                        <span class="truncate">{{ selectedBank?.name || 'انتخاب بانک' }}</span>
                    </button>
                    <div v-if="bankOpen" class="absolute z-20 mt-1 w-full rounded-2xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 p-2">
                        <input v-model="bankQuery" type="text" class="form-input mb-2" placeholder="جستجوی بانک" />
                        <div class="max-h-56 overflow-auto space-y-1">
                            <button v-for="bank in filteredBanks" :key="bank.code" type="button" class="w-full flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700" @click="pickBank(bank)">
                                <img :src="bank.logo" :alt="bank.short" class="w-8 h-8 object-contain bg-white rounded-lg" />
                                <span class="truncate">{{ bank.name }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="field-label">نام صاحب حساب</label>
                    <input v-model="form.owner_name" type="text" class="form-input" placeholder="مطابق کارت یا حساب" />
                </div>
                <button type="button" class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200" @click="form.is_default = !form.is_default">
                    <span class="relative inline-flex h-6 w-11 shrink-0 rounded-full transition" :class="form.is_default ? 'bg-amber-300' : 'bg-gray-200 dark:bg-gray-700'">
                        <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" :class="form.is_default ? 'start-5' : 'start-0.5'"></span>
                    </span>
                    حساب پیش‌فرض تسویه
                </button>
                <div v-if="confirmed" class="flex items-center gap-3 rounded-2xl bg-emerald-50 px-3 py-2.5 dark:bg-emerald-950/40">
                    <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </span>
                    <div>
                        <p class="text-sm font-semibold text-emerald-800 dark:text-emerald-200">{{ confirmTitle }}</p>
                        <p class="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">{{ result.message }}</p>
                    </div>
                </div>
                <p v-else class="text-xs text-gray-500">{{ progressHint }}</p>
                <button type="submit" :disabled="saving || !result?.valid" class="h-10 px-4 rounded-xl bg-amber-300 text-sm font-semibold text-gray-900 disabled:opacity-50">
                    {{ saving ? 'در حال ذخیره...' : (editingId ? 'ذخیره تغییرات' : 'ذخیره حساب') }}
                </button>
                <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>
            </form>

            <div class="xl:col-span-3 space-y-4">
                <div>
                    <p class="text-xs text-gray-500 mb-2">پیش‌نمایش</p>
                    <div :class="previewFrame">
                        <BankAccountCard :bank="previewBank" :kind="form.kind" :formatted="result?.formatted" :owner="form.owner_name" :verified="confirmed" :is-default="form.is_default" />
                    </div>
                </div>
                <div v-if="loading" class="text-xs text-gray-400">در حال دریافت حساب‌ها...</div>
                <div v-else-if="accounts.length === 0" class="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-gray-500">هنوز حسابی ثبت نشده است.</div>
                <div v-else class="space-y-5">
                    <section v-for="item in kinds" :key="item.value">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2">{{ item.list }}</h3>
                        <div v-if="accountsOf(item.value).length === 0" class="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-400">در این دسته موردی نیست.</div>
                        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            <BankAccountCard v-for="account in accountsOf(item.value)" :key="account.id" show-menu :bank="account.bank" :kind="account.kind" :formatted="account.formatted" :owner="account.owner_name" :verified="account.is_verified" :is-default="account.is_default" @edit="startEdit(account)" @make-default="makeDefault(account)" @remove="remove(account)" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import BankAccountCard from "@/views/page/admin/payment/BankAccountCard.vue";
import axiosInstance from "@/store/axiosInstance";
import debounce from "lodash/debounce";

export default {
    name: "AdminBankAccounts",
    components: { AdminMasterPage, BankAccountCard },
    data() {
        return {
            kinds: [
                { value: "sheba", label: "شبا", list: "شبا" },
                { value: "card", label: "کارت", list: "کارت" },
                { value: "account", label: "حساب", list: "حساب" },
            ],
            form: { kind: "sheba", number: "", owner_name: "", bank_code: "", is_default: false },
            editingId: null,
            result: null,
            accounts: [],
            banks: [],
            bankOpen: false,
            bankQuery: "",
            loading: false,
            saving: false,
            error: "",
            inspectTicket: 0,
        };
    },
    computed: {
        numberLabel() {
            return { sheba: "شماره شبا", card: "شماره کارت", account: "شماره حساب" }[this.form.kind];
        },
        placeholder() {
            return { sheba: "IR...", card: "۱۶ رقم", account: "رقم‌های حساب" }[this.form.kind];
        },
        selectedBank() {
            return this.banks.find((bank) => bank.code === this.form.bank_code) || this.result?.bank || null;
        },
        previewBank() {
            return this.result?.bank || this.selectedBank;
        },
        digitCount() {
            return String(this.form.number || "").replace(/[^\d۰-۹٠-٩]/g, "").length;
        },
        shebaDigitCount() {
            return String(this.form.number || "").replace(/\s/g, "").replace(/^ir/i, "").replace(/[^\d۰-۹٠-٩]/g, "").length;
        },
        awaitingDigits() {
            if (this.form.kind === "card") return this.digitCount < 16;
            if (this.form.kind === "account") return this.digitCount < 6;
            return this.shebaDigitCount < 24;
        },
        numberComplete() {
            if (this.form.kind === "card") return this.digitCount === 16;
            if (this.form.kind === "account") return this.digitCount >= 6 && this.digitCount <= 18 && !!this.form.bank_code;
            return this.shebaDigitCount === 24;
        },
        confirmed() {
            return this.numberComplete && !!this.result?.valid;
        },
        confirmTitle() {
            return { sheba: "شماره شبا تأیید شد", card: "شماره کارت تأیید شد", account: "شماره حساب تأیید شد" }[this.form.kind];
        },
        progressHint() {
            if (!this.form.number) return "شماره را وارد کنید.";
            if (this.awaitingDigits) {
                return this.result?.bank
                    ? `${this.result.bank.name} شناسایی شد. رقم‌ها را کامل کنید.`
                    : "با کامل شدن رقم‌ها، نتیجه تأیید نمایش داده می‌شود.";
            }
            return this.result?.message || "در حال بررسی شماره...";
        },
        previewFrame() {
            return {
                card: "w-full max-w-[22.5rem]",
                sheba: "w-full max-w-[34rem]",
                account: "w-full max-w-[18.5rem]",
            }[this.form.kind];
        },
        filteredBanks() {
            const query = this.bankQuery.trim();
            if (!query) return this.banks;
            return this.banks.filter((bank) => bank.name.includes(query) || bank.short.includes(query));
        },
    },
    created() {
        this.fetchAccounts();
        this.inspect = debounce(() => this.inspectNow(), 250);
    },
    methods: {
        accountsOf(kind) {
            return this.accounts.filter((account) => account.kind === kind);
        },
        setKind(kind) {
            this.form.kind = kind;
            this.form.number = "";
            this.form.bank_code = "";
            this.result = null;
            this.error = "";
            this.bankOpen = false;
        },
        pickBank(bank) {
            this.form.bank_code = bank.code;
            this.bankOpen = false;
            this.bankQuery = "";
            this.inspectNow();
        },
        async fetchAccounts() {
            this.loading = true;
            try {
                const response = await axiosInstance.get("/admin/bank-accounts");
                this.accounts = response.data.accounts || [];
                this.banks = response.data.banks || [];
            } finally {
                this.loading = false;
            }
        },
        async inspectNow() {
            if (!this.form.number && this.form.kind !== "account") {
                this.result = null;
                return;
            }
            if (!this.form.number) return;
            const ticket = (this.inspectTicket || 0) + 1;
            this.inspectTicket = ticket;
            try {
                const response = await axiosInstance.post("/admin/bank-accounts/inspect", {
                    kind: this.form.kind,
                    number: this.form.number,
                    bank_code: this.form.bank_code || undefined,
                });
                if (ticket !== this.inspectTicket) return;
                this.result = response.data.result;
                if (this.result?.bank?.code && this.form.kind !== "account") {
                    this.form.bank_code = this.result.bank.code;
                }
            } catch (error) {
                if (ticket !== this.inspectTicket) return;
                this.result = { valid: false, message: error?.response?.data?.message || "بررسی شماره انجام نشد." };
            }
        },
        startEdit(account) {
            this.editingId = account.id;
            this.form = {
                kind: account.kind,
                number: account.number,
                owner_name: account.owner_name,
                bank_code: account.bank?.code || "",
                is_default: account.is_default,
            };
            this.error = "";
            this.inspectNow();
        },
        cancelEdit() {
            this.editingId = null;
            this.form = { kind: "sheba", number: "", owner_name: "", bank_code: "", is_default: false };
            this.result = null;
            this.error = "";
        },
        async save() {
            this.saving = true;
            this.error = "";
            try {
                if (this.editingId) {
                    await axiosInstance.post(`/admin/bank-accounts/${this.editingId}/update`, this.form);
                } else {
                    await axiosInstance.post("/admin/bank-accounts", this.form);
                }
                this.cancelEdit();
                await this.fetchAccounts();
            } catch (error) {
                this.error = error?.response?.data?.message || "ذخیره انجام نشد.";
            } finally {
                this.saving = false;
            }
        },
        async makeDefault(account) {
            await axiosInstance.post(`/admin/bank-accounts/${account.id}/default`);
            await this.fetchAccounts();
        },
        async remove(account) {
            await axiosInstance.delete(`/admin/bank-accounts/${account.id}`);
            if (this.editingId === account.id) this.cancelEdit();
            await this.fetchAccounts();
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
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.375rem;
}
</style>
