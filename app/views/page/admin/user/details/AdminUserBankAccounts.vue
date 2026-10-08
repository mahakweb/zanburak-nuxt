<template>
    <div>
        <div v-if="loading" class="py-8"><LoadingComponent /></div>
        <div v-else-if="accounts.length === 0" class="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-8 text-center text-sm text-gray-400">
            حساب، شبا یا کارتی برای این کاربر ثبت نشده است.
        </div>
        <div v-else class="space-y-5">
            <section v-for="group in groups" :key="group.value">
                <div class="mb-2 flex items-center gap-2">
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ group.label }}</h3>
                    <span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-[10px] font-anjoman text-gray-500 dark:bg-gray-800">{{ group.items.length }}</span>
                </div>
                <p v-if="group.items.length === 0" class="inline-flex rounded-full bg-gray-50 px-3 py-1.5 text-[11px] text-gray-400 dark:bg-gray-800/60">موردی نیست</p>
                <div v-else class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                    <article v-for="account in group.items" :key="account.id" class="group relative">
                        <div class="relative overflow-hidden" :class="shellClass(account.kind)" :style="shellStyle(account)">
                            <div v-if="account.kind === 'sheba'" class="absolute inset-x-0 top-0 h-1" :style="{ background: account.bank?.color || '#334155' }"></div>
                            <div v-if="account.kind === 'card'" class="pointer-events-none absolute -left-5 -top-6 h-16 w-16 rounded-full bg-white/10"></div>
                            <div class="relative flex h-full flex-col p-3.5">
                                <div class="flex items-center gap-2 pe-8">
                                    <span class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                                        <img v-if="account.bank?.logo" :src="account.bank.logo" :alt="account.bank.short" class="h-6 w-6 object-contain" />
                                        <span v-else class="text-[10px] font-bold text-gray-700">{{ account.bank?.mark || '؟' }}</span>
                                    </span>
                                    <span class="truncate text-[11px] font-bold" :class="account.kind === 'card' ? 'text-white' : 'text-gray-800 dark:text-gray-100'">{{ account.bank?.name || 'بانک' }}</span>
                                    <span v-if="account.is_default" class="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold" :class="account.kind === 'card' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'">پیش‌فرض</span>
                                </div>
                                <div v-if="account.kind === 'card'" class="mt-3">
                                    <svg class="h-5 w-7" viewBox="0 0 36 26" fill="none"><rect x="1" y="1" width="34" height="24" rx="4" fill="#f5d58a" stroke="#e2c178"/><path d="M1 9h34M12 1v24" stroke="#e2c178"/></svg>
                                </div>
                                <div class="mt-auto flex items-center gap-1.5 pt-3" dir="ltr">
                                    <span v-if="account.kind === 'sheba'" class="shrink-0 rounded-full bg-gray-900 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white">IR</span>
                                    <p class="truncate font-anjoman text-[13px] tracking-wide" :class="account.kind === 'card' ? 'text-white' : 'text-gray-800 dark:text-gray-100'">{{ displayNumber(account) }}</p>
                                </div>
                                <div class="mt-1.5 flex items-center justify-between gap-2">
                                    <p class="truncate text-[10px]" :class="account.kind === 'card' ? 'text-white/80' : 'text-gray-500'">{{ account.owner_name }}</p>
                                    <span v-if="account.is_verified" class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white" title="تأیید شده">
                                        <svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                    </span>
                                </div>
                            </div>
                            <div v-if="confirmId === account.id" class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-gray-950/70 px-3 text-center">
                                <p class="text-xs font-semibold text-white">این مورد حذف شود؟</p>
                                <div class="flex gap-2">
                                    <button type="button" class="h-7 rounded-full bg-white px-3 text-[11px] font-semibold text-gray-900" @click="confirmId = null">انصراف</button>
                                    <button type="button" class="h-7 rounded-full bg-rose-500 px-3 text-[11px] font-semibold text-white" :disabled="acting" @click="remove(account)">حذف</button>
                                </div>
                            </div>
                        </div>
                        <div v-can="'users.update'" class="absolute top-2 end-2 z-30 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                        <Menu as="div" class="relative">
                            <MenuButton class="inline-flex h-7 w-7 items-center justify-center rounded-full shadow-sm" :class="account.kind === 'card' ? 'bg-black/30 text-white' : 'bg-white text-gray-700 ring-1 ring-black/5'" title="عملیات">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
                            </MenuButton>
                            <MenuItems class="absolute end-0 z-40 mt-1 w-32 origin-top-left rounded-xl bg-white py-1 text-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                <MenuItem v-slot="{ active }">
                                    <button type="button" class="w-full px-3 py-2 text-right text-xs" :class="active ? 'bg-gray-100' : ''" @click="startEdit(account)">ویرایش</button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <button type="button" class="w-full px-3 py-2 text-right text-xs text-rose-600" :class="active ? 'bg-rose-50' : ''" @click="confirmId = account.id">حذف</button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                        </div>
                    </article>
                </div>
            </section>
        </div>
        <p v-if="error" class="mt-3 text-sm text-rose-600">{{ error }}</p>

        <BottomSheetDrawer v-model="showEdit" :initialHeight="0.62" :maxHeight="0.9" :minHeight="0.4"
            :autoCloseOnMin="true" :closeOnBackdrop="!saving" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-6 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <form class="space-y-3" @submit.prevent="save">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">ویرایش {{ kindLabel }}</h3>
                <div>
                    <label class="field-label">شماره</label>
                    <input v-model="form.number" type="text" class="form-input font-anjoman" dir="ltr" @input="inspect" />
                </div>
                <div v-if="form.kind === 'account'" class="relative">
                    <label class="field-label">بانک</label>
                    <button type="button" class="form-input flex items-center gap-2 text-right" @click="bankOpen = !bankOpen">
                        <img v-if="selectedBank?.logo" :src="selectedBank.logo" class="h-6 w-6 object-contain" alt="" />
                        <span class="truncate">{{ selectedBank?.name || 'انتخاب بانک' }}</span>
                    </button>
                    <div v-if="bankOpen" class="absolute z-20 mt-1 w-full rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 dark:bg-gray-800">
                        <input v-model="bankQuery" type="text" class="form-input mb-2" placeholder="جستجوی بانک" />
                        <div class="max-h-48 space-y-1 overflow-auto">
                            <button v-for="bank in filteredBanks" :key="bank.code" type="button" class="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700" @click="pickBank(bank)">
                                <img :src="bank.logo" :alt="bank.short" class="h-7 w-7 rounded-lg bg-white object-contain" />
                                <span class="truncate">{{ bank.name }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="field-label">نام صاحب حساب</label>
                    <input v-model="form.owner_name" type="text" class="form-input" />
                </div>
                <button type="button" class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200" @click="form.is_default = !form.is_default">
                    <span class="relative inline-flex h-6 w-11 shrink-0 rounded-full transition" :class="form.is_default ? 'bg-amber-300' : 'bg-gray-200 dark:bg-gray-700'">
                        <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" :class="form.is_default ? 'start-5' : 'start-0.5'"></span>
                    </span>
                    حساب پیش‌فرض
                </button>
                <p class="text-xs" :class="result?.valid ? 'text-emerald-600' : 'text-gray-500'">{{ result?.message || 'شماره را کامل کنید.' }}</p>
                <button type="submit" :disabled="saving || !result?.valid" class="h-10 w-full rounded-xl bg-amber-300 text-sm font-semibold text-gray-900 disabled:opacity-50">
                    {{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
                </button>
            </form>
        </BottomSheetDrawer>
    </div>
</template>

<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import axiosInstance from "@/store/axiosInstance";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { toast } from "vue3-toastify";

export default {
    name: "AdminUserBankAccounts",
    components: { LoadingComponent, BottomSheetDrawer, Menu, MenuButton, MenuItems, MenuItem },
    props: {
        username: { type: String, required: true },
    },
    data() {
        return {
            loading: false,
            acting: false,
            saving: false,
            accounts: [],
            banks: [],
            confirmId: null,
            showEdit: false,
            editingId: null,
            form: { kind: "sheba", number: "", owner_name: "", bank_code: "", is_default: false },
            result: null,
            bankOpen: false,
            bankQuery: "",
            error: "",
            groupsOrder: [
                { value: "sheba", label: "شبا" },
                { value: "card", label: "کارت" },
                { value: "account", label: "حساب" },
            ],
        };
    },
    computed: {
        groups() {
            return this.groupsOrder.map((group) => ({
                ...group,
                items: this.accounts.filter((account) => account.kind === group.value),
            }));
        },
        kindLabel() {
            return { sheba: "شبا", card: "کارت", account: "حساب" }[this.form.kind] || "";
        },
        selectedBank() {
            return this.banks.find((bank) => bank.code === this.form.bank_code) || null;
        },
        filteredBanks() {
            const query = this.bankQuery.trim();
            if (!query) return this.banks;
            return this.banks.filter((bank) => bank.name.includes(query) || bank.short.includes(query));
        },
    },
    watch: {
        username: {
            immediate: true,
            handler() {
                this.fetchAccounts();
            },
        },
    },
    methods: {
        shellClass(kind) {
            if (kind === "card") return "h-[9.6rem] rounded-2xl text-white shadow-sm";
            if (kind === "account") return "h-[7.4rem] rounded-2xl border-s-4 bg-[#f7f3ea] text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-50";
            return "h-[6.6rem] rounded-2xl bg-white text-gray-900 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:text-white dark:ring-gray-700";
        },
        shellStyle(account) {
            const color = account.bank?.color || "#334155";
            if (account.kind === "card") return { background: `linear-gradient(145deg, ${color} 0%, #0f172a 130%)` };
            if (account.kind === "account") return { borderColor: color };
            return {};
        },
        displayNumber(account) {
            if (account.kind !== "sheba") return account.formatted;
            return (account.formatted || "").replace(/^IR\s*/i, "").trim();
        },
        async fetchAccounts() {
            if (!this.username) return;
            this.loading = true;
            try {
                const response = await axiosInstance.get(`/admin/user/${this.username}/bank-accounts`);
                this.accounts = response?.data?.accounts || [];
                this.banks = response?.data?.banks || [];
            } finally {
                this.loading = false;
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
            this.result = { valid: true, message: "شماره فعلی ذخیره شده است." };
            this.bankOpen = false;
            this.bankQuery = "";
            this.error = "";
            this.showEdit = true;
        },
        pickBank(bank) {
            this.form.bank_code = bank.code;
            this.bankOpen = false;
            this.inspectNow();
        },
        inspect() {
            clearTimeout(this.inspectTimer);
            this.inspectTimer = setTimeout(() => this.inspectNow(), 250);
        },
        async inspectNow() {
            try {
                const response = await axiosInstance.post("/admin/bank-accounts/inspect", {
                    kind: this.form.kind,
                    number: this.form.number,
                    bank_code: this.form.bank_code || undefined,
                });
                this.result = response.data.result;
                if (this.result?.bank?.code && this.form.kind !== "account") {
                    this.form.bank_code = this.result.bank.code;
                }
            } catch (error) {
                this.result = { valid: false, message: error?.response?.data?.message || "بررسی شماره انجام نشد." };
            }
        },
        async save() {
            if (!this.editingId) return;
            this.saving = true;
            this.error = "";
            try {
                const response = await axiosInstance.post(`/admin/user/${this.username}/bank-accounts/${this.editingId}/update`, this.form);
                if (toast) toast.success(response?.data?.message || "ویرایش شد.");
                this.showEdit = false;
                await this.fetchAccounts();
            } catch (error) {
                this.error = error?.response?.data?.message || "ویرایش انجام نشد.";
            } finally {
                this.saving = false;
            }
        },
        async remove(account) {
            this.acting = true;
            this.error = "";
            try {
                const response = await axiosInstance.delete(`/admin/user/${this.username}/bank-accounts/${account.id}`);
                if (toast) toast.success(response?.data?.message || "حذف شد.");
                this.confirmId = null;
                await this.fetchAccounts();
            } catch (error) {
                this.error = error?.response?.data?.message || "حذف انجام نشد.";
            } finally {
                this.acting = false;
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
.group:hover,
.group:focus-within { z-index: 20; }
</style>
