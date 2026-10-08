<template>
    <div v-if="kind === 'sheba'" class="relative overflow-hidden rounded-2xl bg-white text-gray-900 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] ring-1 ring-gray-200 dark:bg-gray-900 dark:text-white dark:ring-gray-700 w-full min-h-[8.75rem]">
        <div class="h-1.5" :style="{ background: bank?.color || '#334155' }"></div>
        <div class="p-4">
            <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                    <span class="shrink-0 w-10 h-10 rounded-xl bg-gray-50 ring-1 ring-gray-200 flex items-center justify-center overflow-hidden">
                        <img v-if="bank?.logo && !logoFailed" :src="bank.logo" :alt="bank.short || bank.name" class="w-8 h-8 object-contain" @error="logoFailed = true" />
                        <span v-else class="text-xs font-bold" :style="{ color: bank?.color || '#111827' }">{{ bank?.mark || '؟' }}</span>
                    </span>
                    <div class="min-w-0">
                        <p class="text-sm font-bold truncate">{{ bank?.name || 'بانک' }}</p>
                        <p class="text-[11px] text-gray-400">شماره شبا</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <span v-if="verified" class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white" title="تأیید شده">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </span>
                    <Menu v-if="showMenu" as="div" class="relative">
                        <MenuButton class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200" title="عملیات">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
                        </MenuButton>
                        <MenuItems class="absolute left-0 z-20 mt-1 w-40 origin-top-left rounded-xl bg-white text-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none py-1">
                            <MenuItem v-slot="{ active }"><button type="button" class="w-full text-right px-3 py-2 text-xs" :class="active ? 'bg-gray-100' : ''" @click="$emit('edit')">ویرایش</button></MenuItem>
                            <MenuItem v-if="!isDefault" v-slot="{ active }"><button type="button" class="w-full text-right px-3 py-2 text-xs" :class="active ? 'bg-gray-100' : ''" @click="$emit('make-default')">پیش‌فرض</button></MenuItem>
                            <MenuItem v-slot="{ active }"><button type="button" class="w-full text-right px-3 py-2 text-xs text-rose-600" :class="active ? 'bg-rose-50' : ''" @click="$emit('remove')">حذف</button></MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
            <div class="mt-4 flex items-center gap-2" dir="ltr">
                <span class="shrink-0 rounded-lg bg-gray-900 px-2 py-1 text-xs font-bold tracking-wider text-white">IR</span>
                <p class="font-anjoman text-[15px] sm:text-base tracking-[0.12em] text-gray-800 dark:text-gray-100 break-all">{{ shebaBody || '•••• •••• •••• •••• •••• ••••' }}</p>
            </div>
            <div class="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-gray-200 dark:border-gray-700 pt-2">
                <p class="text-xs text-gray-500 truncate">{{ owner || 'نام صاحب حساب' }}</p>
                <span v-if="isDefault" class="shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 text-white" :style="{ background: bank?.color || '#111827' }">پیش‌فرض</span>
            </div>
        </div>
    </div>

    <div v-else-if="kind === 'account'" class="relative overflow-hidden rounded-xl border-s-4 bg-[#f6f1e7] text-gray-900 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.7)] w-full min-h-[12.5rem] dark:bg-gray-800 dark:text-gray-50" :style="{ borderColor: bank?.color || '#334155' }">
        <div class="absolute inset-y-3 end-3 border-e border-dashed border-gray-300 dark:border-gray-600"></div>
        <div class="relative h-full p-4 pe-6 flex flex-col">
            <div class="flex items-start justify-between gap-2">
                <span class="shrink-0 w-11 h-11 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden">
                    <img v-if="bank?.logo && !logoFailed" :src="bank.logo" :alt="bank.short || bank.name" class="w-8 h-8 object-contain" @error="logoFailed = true" />
                    <span v-else class="text-sm font-bold" :style="{ color: bank?.color || '#111827' }">{{ bank?.mark || '؟' }}</span>
                </span>
                <div class="flex items-center gap-1.5">
                    <span v-if="verified" class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white" title="تأیید شده">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </span>
                    <Menu v-if="showMenu" as="div" class="relative">
                        <MenuButton class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-700 shadow-sm" title="عملیات">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
                        </MenuButton>
                        <MenuItems class="absolute left-0 z-20 mt-1 w-40 origin-top-left rounded-xl bg-white text-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none py-1">
                            <MenuItem v-slot="{ active }"><button type="button" class="w-full text-right px-3 py-2 text-xs" :class="active ? 'bg-gray-100' : ''" @click="$emit('edit')">ویرایش</button></MenuItem>
                            <MenuItem v-if="!isDefault" v-slot="{ active }"><button type="button" class="w-full text-right px-3 py-2 text-xs" :class="active ? 'bg-gray-100' : ''" @click="$emit('make-default')">پیش‌فرض</button></MenuItem>
                            <MenuItem v-slot="{ active }"><button type="button" class="w-full text-right px-3 py-2 text-xs text-rose-600" :class="active ? 'bg-rose-50' : ''" @click="$emit('remove')">حذف</button></MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
            <p class="mt-3 text-[11px] text-gray-500">{{ bank?.name || 'حساب بانکی' }}</p>
            <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">شماره حساب</p>
            <p class="mt-1 font-anjoman text-xl tracking-[0.18em]" dir="ltr">{{ formatted || '••••••••' }}</p>
            <div class="mt-auto pt-3 border-t border-gray-300/80 dark:border-gray-600 flex items-end justify-between gap-2">
                <p class="text-xs truncate">{{ owner || 'نام صاحب حساب' }}</p>
                <span v-if="isDefault" class="shrink-0 text-[10px] font-bold bg-gray-900 text-white rounded-full px-2 py-0.5">پیش‌فرض</span>
            </div>
        </div>
    </div>

    <div v-else class="relative overflow-hidden rounded-[1.35rem] text-white shadow-[0_18px_40px_-22px_rgba(15,23,42,0.85)] aspect-[1.62/1] w-full min-h-[12.5rem]" :style="cardStyle">
        <div class="absolute -left-8 -top-10 w-36 h-36 rounded-full bg-white/10"></div>
        <div class="absolute -right-8 bottom-0 w-40 h-40 rounded-full bg-black/10"></div>
        <div class="relative h-full p-4 sm:p-5 flex flex-col">
            <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                    <span class="shrink-0 w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
                        <img v-if="bank?.logo && !logoFailed" :src="bank.logo" :alt="bank.short || bank.name" class="w-8 h-8 object-contain" @error="logoFailed = true" />
                        <span v-else class="text-sm font-bold" :style="{ color: bank?.color || '#111827' }">{{ bank?.mark || '؟' }}</span>
                    </span>
                    <div class="min-w-0">
                        <p class="text-sm font-bold truncate">{{ bank?.name || 'بانک' }}</p>
                        <p class="text-[11px] text-white/75">کارت بانکی</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <span v-if="verified" class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-400 text-white" title="تأیید شده">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </span>
                    <Menu v-if="showMenu" as="div" class="relative">
                        <MenuButton class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/20 hover:bg-black/30" title="عملیات">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
                        </MenuButton>
                        <MenuItems class="absolute left-0 z-20 mt-1 w-40 origin-top-left rounded-xl bg-white text-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none py-1">
                            <MenuItem v-slot="{ active }"><button type="button" class="w-full text-right px-3 py-2 text-xs" :class="active ? 'bg-gray-100' : ''" @click="$emit('edit')">ویرایش</button></MenuItem>
                            <MenuItem v-if="!isDefault" v-slot="{ active }"><button type="button" class="w-full text-right px-3 py-2 text-xs" :class="active ? 'bg-gray-100' : ''" @click="$emit('make-default')">پیش‌فرض</button></MenuItem>
                            <MenuItem v-slot="{ active }"><button type="button" class="w-full text-right px-3 py-2 text-xs text-rose-600" :class="active ? 'bg-rose-50' : ''" @click="$emit('remove')">حذف</button></MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
            <div class="mt-5">
                <svg class="w-9 h-7" viewBox="0 0 36 26" fill="none"><rect x="1" y="1" width="34" height="24" rx="4" fill="#f5d58a" stroke="#e2c178"/><path d="M1 9h34M12 1v24" stroke="#e2c178"/></svg>
            </div>
            <p class="mt-auto pt-3 font-anjoman tracking-[0.16em] text-lg" dir="ltr">{{ formatted || '•••• •••• •••• ••••' }}</p>
            <div class="mt-2 flex items-end justify-between gap-2">
                <p class="text-xs truncate text-white/90">{{ owner || 'نام صاحب کارت' }}</p>
                <span v-if="isDefault" class="shrink-0 text-[10px] font-bold bg-white text-gray-900 rounded-full px-2 py-0.5">پیش‌فرض</span>
            </div>
        </div>
    </div>
</template>

<script>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

export default {
    name: "BankAccountCard",
    components: { Menu, MenuButton, MenuItems, MenuItem },
    props: {
        bank: { type: Object, default: null },
        kind: { type: String, default: "card" },
        formatted: { type: String, default: "" },
        owner: { type: String, default: "" },
        verified: { type: Boolean, default: false },
        isDefault: { type: Boolean, default: false },
        showMenu: { type: Boolean, default: false },
    },
    emits: ["edit", "make-default", "remove"],
    data() {
        return { logoFailed: false };
    },
    computed: {
        cardStyle() {
            const color = this.bank?.color || "#334155";
            return { background: `linear-gradient(145deg, ${color} 0%, #0f172a 125%)` };
        },
        shebaBody() {
            return (this.formatted || "").replace(/^IR\s*/i, "").trim();
        },
    },
    watch: {
        "bank.logo"() {
            this.logoFailed = false;
        },
        kind() {
            this.logoFailed = false;
        },
    },
};
</script>
