<script setup>
definePageMeta({
  name: "admin-user-details",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage
        :breadcrumb-title-override="userFullName"
        :breadcrumb-subtitle-override="userSubtitle"
        :breadcrumb-last-override="userFullName">
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-users-list' }"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">لیست کاربران</span>
            </router-link>
            <button type="button" @click="refreshUser"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">بروزرسانی</span>
            </button>
            <router-link v-if="user" :to="{ name: 'profile-page', params: { username: user.username } }" target="_blank"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">مشاهده پروفایل</span>
            </router-link>
        </template>

        <div v-if="user" class="relative">
            <!-- Hero -->
            <div class="rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 mb-4 shadow-sm">
                <div class="relative h-28 md:h-36 bg-gradient-to-br from-amber-400/30 via-amber-100 to-gray-100 dark:from-amber-500/15 dark:via-gray-800 dark:to-gray-900">
                    <img v-if="user.cover_pic" :src="user.cover_pic" class="absolute inset-0 w-full h-full object-cover opacity-60" onerror="this.style.display='none'" />
                    <div class="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-gray-900/95 dark:via-gray-900/50"></div>
                </div>
                <div class="relative px-4 pb-4 -mt-12 md:-mt-14">
                    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-4 min-w-0">
                            <div class="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-lg bg-gray-200 dark:bg-gray-700">
                                <img onerror="this.style.display='none'" :src="user.profile_pic" :alt="user.username" class="w-full h-full object-cover">
                            </div>
                            <div class="min-w-0 text-center sm:text-start pb-1">
                                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                                    <h1 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">{{ user.first_name }} {{ user.last_name }}</h1>
                                    <span v-if="user.subscription === 'vip'" class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-gray-900">VIP</span>
                                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                        :class="isUserActive(user) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'">
                                        {{ isUserActive(user) ? 'فعال' : 'غیرفعال' }}
                                    </span>
                                    <span v-if="user.is_superuser" class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">مدیرکل</span>
                                </div>
                                <p dir="ltr" class="text-sm text-gray-500 dark:text-gray-400">@{{ user.username }}</p>
                                <p v-if="user.info?.job" class="text-xs text-gray-400 mt-0.5">{{ user.info.job }}</p>
                                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                                    <span v-if="user.email" class="inline-flex items-center gap-1">
                                        <span dir="ltr" class="truncate max-w-[10rem]">{{ user.email }}</span>
                                        <span class="shrink-0 w-3.5 h-3.5 rounded-full inline-flex items-center justify-center"
                                            :class="user.email_verified_at ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-rose-100 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400'"
                                            :title="user.email_verified_at ? 'ایمیل تأیید شده' : 'ایمیل تأیید نشده'">
                                            <svg v-if="user.email_verified_at" class="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                            <svg v-else class="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                        </span>
                                    </span>
                                    <span v-if="user.mobile" class="inline-flex items-center gap-1">
                                        <span dir="ltr">{{ user.mobile }}</span>
                                        <span class="shrink-0 w-3.5 h-3.5 rounded-full inline-flex items-center justify-center"
                                            :class="user.mobile_verified_at ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'"
                                            :title="user.mobile_verified_at ? 'موبایل تأیید شده' : 'موبایل تأیید نشده'">
                                            <svg v-if="user.mobile_verified_at" class="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                            <svg v-else class="w-2 h-2" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>
                                        </span>
                                    </span>
                                    <span v-if="user.last_seen">آخرین بازدید: {{ formatRelative(user.last_seen) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center justify-center lg:justify-end gap-2 shrink-0">
                            <div class="flex items-center gap-1.5">
                                <a v-for="social in socialLinks" :key="social.key" :title="social.label" target="_blank" :href="social.href"
                                    :class="social.href ? 'opacity-100 hover:scale-105' : 'opacity-30 pointer-events-none'"
                                    class="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200/80 bg-white/80 dark:bg-gray-800 dark:border-gray-700 transition-transform">
                                    <span v-html="social.icon" class="w-3.5 h-3.5"></span>
                                </a>
                            </div>
                            <button @click.prevent="openEditUserInfoModal"
                                class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 h-8 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <svg class="w-3.5 h-3.5" viewBox="0 0 18 18" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"/></svg>
                                شبکه‌ها
                            </button>
                            <button v-can="'users.delete'" type="button" @click.prevent="showDeleteUserModal = true"
                                class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/20 px-3 h-8 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40">
                                حذف
                            </button>
                        </div>
                    </div>

                    <!-- Stat pills -->
                    <div v-if="user.stats" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
                        <button v-for="pill in statPills" :key="pill.key" type="button" @click="changeSections(pill.key)"
                            class="rounded-xl p-2.5 text-start border transition-all"
                            :class="selectedSection === pill.key
                                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-500/40 shadow-sm ring-1 ring-amber-200/50'
                                : 'bg-gray-50/80 dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700'">
                            <div class="text-[10px] font-medium text-gray-500 dark:text-gray-400">{{ pill.label }}</div>
                            <div class="text-base font-bold font-anjoman mt-0.5" :class="pill.color">{{ pill.value }}</div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-2 lg:p-3">
                <div class="flex gap-1 overflow-x-auto scrollbar-hide pb-2 border-b border-gray-100 dark:border-gray-800 mb-3">
                    <button v-for="tab in sectionTabs" :key="tab.key" type="button" @click.prevent="changeSections(tab.key)"
                        class="shrink-0 inline-flex items-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition whitespace-nowrap"
                        :class="selectedSection === tab.key
                            ? 'bg-amber-400 text-gray-900 shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700'">
                        {{ tab.label }}
                        <span v-if="tab.count != null"
                            class="font-anjoman text-[10px] px-1.5 py-0.5 rounded-md"
                            :class="selectedSection === tab.key ? 'bg-black/10' : 'bg-gray-200/80 dark:bg-gray-700'">
                            {{ tab.count }}
                        </span>
                    </button>
                </div>
                <div>
                    <AdminUserOverview v-if="selectedSection === 'overview'" :username="username" />
                    <AdminUserSecurity v-if="selectedSection === 'security'" :username="username" />
                    <AdminUserFinancial v-if="selectedSection === 'financial'" :username="username" />
                    <AdminUserBankAccounts v-if="selectedSection === 'banks'" :username="username" />
                    <AdminUserCourses v-if="selectedSection === 'courses'" :username="username" />
                    <AdminUserComments v-if="selectedSection === 'comments'" :username="username" />
                </div>
            </div>
        </div>

        <BottomSheetDrawer v-model="showEditUserInfoModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="bs.ADMIN_BS_PANEL"
            :contentClass="bs.ADMIN_BS_CONTENT"
            :backdropClass="bs.ADMIN_BS_BACKDROP">
            <AdminBottomSheetHeader
                title="ویرایش شبکه‌های اجتماعی"
                subtitle="فقط نام کاربری یا شناسه را وارد کنید، نه آدرس کامل"
                accent="sky"
                @close="closeEditUserInfoModal">
                <template #icon>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </template>
            </AdminBottomSheetHeader>
            <div :class="bs.ADMIN_BS_HINT" class="mb-4 space-y-1">
                <p>لطفا فقط id یا نام‌کاربری کاربر را وارد کنید، مانند مثال با رنگ زرد:</p>
                <p>https://instagram.com/<span class="text-amber-500 font-semibold">zanburak</span></p>
            </div>
            <form class="flex flex-col gap-4" @submit.prevent>
                <div :class="bs.ADMIN_BS_FORM_BODY">
                    <div class="grid grid-cols-1 gap-x-3 gap-y-3 lg:grid-cols-2">
                        <div>
                            <label for="telegram" :class="bs.ADMIN_BS_FORM_LABEL">تلگرام</label>
                            <input v-model="social.telegram" type="text" id="telegram"
                                :class="[bs.ADMIN_BS_INPUT, errors && errors.telegram ? bs.ADMIN_BS_INPUT_ERROR : '']"
                                placeholder="zanburak" required />
                            <span v-if="errors && errors.telegram" class="mt-1 text-rose-500 text-xs font-medium">
                                {{ errors.telegram[0] }}
                            </span>
                        </div>
                        <div>
                            <label for="twitter" :class="bs.ADMIN_BS_FORM_LABEL">ایکس (توییتر سابق)</label>
                            <input v-model="social.twitter" type="text" id="twitter"
                                :class="[bs.ADMIN_BS_INPUT, errors && errors.twitter ? bs.ADMIN_BS_INPUT_ERROR : '']"
                                placeholder="zanburak" required />
                            <span v-if="errors && errors.twitter" class="mt-1 text-rose-500 text-xs font-medium">
                                {{ errors.twitter[0] }}
                            </span>
                        </div>
                        <div>
                            <label for="linkedin" :class="bs.ADMIN_BS_FORM_LABEL">لینکدین</label>
                            <input v-model="social.linkedin" type="text" id="linkedin"
                                :class="[bs.ADMIN_BS_INPUT, errors && errors.linkedin ? bs.ADMIN_BS_INPUT_ERROR : '']"
                                placeholder="zanburak" required />
                            <span v-if="errors && errors.linkedin" class="mt-1 text-rose-500 text-xs font-medium">
                                {{ errors.linkedin[0] }}
                            </span>
                        </div>
                        <div>
                            <label for="instagram" :class="bs.ADMIN_BS_FORM_LABEL">اینستاگرام</label>
                            <input v-model="social.instagram" type="text" id="instagram"
                                :class="[bs.ADMIN_BS_INPUT, errors && errors.instagram ? bs.ADMIN_BS_INPUT_ERROR : '']"
                                placeholder="zanburak" required />
                            <span v-if="errors && errors.instagram" class="mt-1 text-rose-500 text-xs font-medium">
                                {{ errors.instagram[0] }}
                            </span>
                        </div>
                        <div>
                            <label for="github" :class="bs.ADMIN_BS_FORM_LABEL">گیت‌هاب</label>
                            <input v-model="social.github" type="text" id="github"
                                :class="[bs.ADMIN_BS_INPUT, errors && errors.github ? bs.ADMIN_BS_INPUT_ERROR : '']"
                                placeholder="zanburak" required />
                            <span v-if="errors && errors.github" class="mt-1 text-rose-500 text-xs font-medium">
                                {{ errors.github[0] }}
                            </span>
                        </div>
                        <div>
                            <label for="website" :class="bs.ADMIN_BS_FORM_LABEL">وبسایت (شخصی)</label>
                            <input v-model="social.website" type="text" id="website"
                                :class="[bs.ADMIN_BS_INPUT, errors && errors.website ? bs.ADMIN_BS_INPUT_ERROR : '']"
                                placeholder="" required />
                            <span v-if="errors && errors.website" class="mt-1 text-rose-500 text-xs font-medium">
                                {{ errors.website[0] }}
                            </span>
                        </div>
                    </div>
                </div>
                <AdminBottomSheetActions
                    cancel-label="بستن"
                    submit-label="ذخیره تغییرات"
                    :loading="socialLoading"
                    @cancel="closeEditUserInfoModal"
                    @submit="updateUserSocial"
                />
            </form>
        </BottomSheetDrawer>

        <AdminDeleteUserModal
            v-model="showDeleteUserModal"
            :user-ids="user?.id"
            @deleted="onUserDeleted"
        />

        <LoadingComponent v-if="loading" class="" />
    </AdminMasterPage>
</template>
<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import AdminDeleteUserModal from "@/views/components/admin/AdminDeleteUserModal.vue";
import axiosInstance from "@/store/axiosInstance";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetActions from "@/views/components/admin/bottomSheet/AdminBottomSheetActions.vue";
import * as adminBottomSheetStyles from "@/views/components/admin/bottomSheet/adminBottomSheetStyles";
import AdminUserOverview from "@/views/page/admin/user/details/AdminUserOverview.vue";
import AdminUserComments from "@/views/page/admin/user/details/AdminUserComments.vue";
import AdminUserCourses from "@/views/page/admin/user/details/AdminUserCourses.vue";
import AdminUserFinancial from "@/views/page/admin/user/details/AdminUserFinancial.vue";
import AdminUserBankAccounts from "@/views/page/admin/user/details/AdminUserBankAccounts.vue";
import AdminUserSecurity from "@/views/page/admin/user/details/AdminUserSecurity.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        BottomSheetDrawer,
        AdminBottomSheetHeader,
        AdminBottomSheetActions,
        AdminUserOverview,
        AdminUserComments,
        AdminUserCourses,
        AdminUserFinancial,
        AdminUserBankAccounts,
        AdminUserSecurity,
        AdminDeleteUserModal,
    },
    computed: {
        userFullName() {
            if (!this.user) return '';
            return `${this.user.first_name} ${this.user.last_name}`.trim();
        },
        userSubtitle() {
            if (!this.user?.username) return '';
            return `@${this.user.username}`;
        },
        sectionTabs() {
            const s = this.user?.stats;
            return [
                { key: 'overview', label: 'مشخصات', count: null },
                { key: 'security', label: 'امنیت', count: s ? (s.roles_count + s.permissions_count) || null : null },
                { key: 'financial', label: 'مالی', count: s?.payments_count ?? null },
                { key: 'banks', label: 'حساب‌های بانکی', count: s?.bank_accounts_count ?? null },
                { key: 'courses', label: 'دوره‌ها', count: s?.courses_count ?? null },
                { key: 'comments', label: 'کامنت‌ها', count: s?.comments_count ?? null },
            ];
        },
        statPills() {
            const s = this.user?.stats;
            if (!s) return [];
            return [
                { key: 'courses', label: 'دوره‌ها', value: this.formatNumber(s.courses_count), color: 'text-amber-600 dark:text-amber-400' },
                { key: 'comments', label: 'کامنت‌ها', value: this.formatNumber(s.comments_count), color: 'text-blue-600 dark:text-blue-400' },
                { key: 'financial', label: 'تراکنش موفق', value: this.formatNumber(s.payments_count), color: 'text-emerald-600 dark:text-emerald-400' },
                { key: 'overview', label: 'موجودی کیف', value: this.formatNumber(s.wallet_balance), color: 'text-violet-600 dark:text-violet-400' },
                { key: 'security', label: 'نقش / دسترسی', value: `${s.roles_count} / ${s.permissions_count}`, color: 'text-cyan-600 dark:text-cyan-400' },
                { key: 'overview', label: 'حساب متصل', value: this.formatNumber(s.providers_count), color: 'text-rose-600 dark:text-rose-400' },
            ];
        },
        socialLinks() {
            const info = this.user?.info || {};
            return [
                { key: 'instagram', label: 'اینستاگرام', href: info.instagram ? `https://instagram.com/${info.instagram}` : null, icon: '<svg class="fill-current w-full h-full" viewBox="0 0 20 20"><path d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z"/></svg>' },
                { key: 'linkedin', label: 'لینکدین', href: info.linkedin ? `https://linkedin.com/in/${info.linkedin}` : null, icon: '<svg class="fill-current w-full h-full" viewBox="0 0 20 20"><path d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"/></svg>' },
                { key: 'twitter', label: 'ایکس', href: info.twitter ? `https://x.com/${info.twitter}` : null, icon: '<svg class="fill-current w-full h-full" viewBox="0 0 20 20"><path d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"/></svg>' },
                { key: 'github', label: 'گیت‌هاب', href: info.github ? `https://github.com/${info.github}` : null, icon: '<svg class="fill-current w-full h-full" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>' },
                { key: 'telegram', label: 'تلگرام', href: info.telegram ? `https://t.me/${info.telegram}` : null, icon: '<svg class="fill-current w-full h-full" viewBox="0 0 48 48"><path d="M41.4193 7.30899C41.4193 7.30899 45.3046 5.79399 44.9808 9.47328C44.8729 10.9883 43.9016 16.2908 43.1461 22.0262L40.5559 39.0159C40.5559 39.0159 40.3401 41.5048 38.3974 41.9377C36.4547 42.3705 33.5408 40.4227 33.0011 39.9898C32.5694 39.6652 24.9068 34.7955 22.2086 32.4148C21.4531 31.7655 20.5897 30.4669 22.3165 28.9519L33.6487 18.1305C34.9438 16.8319 36.2389 13.8019 30.8426 17.4812L15.7331 27.7616C15.7331 27.7616 14.0063 28.8437 10.7686 27.8698L3.75342 25.7055C3.75342 25.7055 1.16321 24.0823 5.58815 22.459C16.3807 17.3729 29.6555 12.1786 41.4193 7.30899Z"/></svg>' },
                { key: 'website', label: 'وبسایت', href: info.website || null, icon: '<svg class="fill-current w-full h-full" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>' },
            ];
        },
    },
    data() {
        const sections = ['overview', 'security', 'courses', 'financial', 'banks', 'comments']
        return {
            bs: adminBottomSheetStyles,
            username: this.$route.params.username,
            selectedSection: sections.includes(this.$route.query.section) ? this.$route.query.section : sections[0],
            user: null,
            errors: null,
            loading: false,
            showEditUserInfoModal: this.$route.query.editSocial ? true : false,
            showDeleteUserModal: false,

            social: {
                telegram: '',
                twitter: '',
                linkedin: '',
                instagram: '',
                github: '',
                website: '',
            },
            socialLoading: false,

        };
    },
    methods: {
        formatNumber(n) {
            if (n == null) return '0';
            return Number(n).toLocaleString('fa-IR');
        },
        formatRelative(dateStr) {
            if (!dateStr) return '—';
            const diff = Date.now() - new Date(dateStr).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 1) return 'همین الان';
            if (mins < 60) return `${mins.toLocaleString('fa-IR')} دقیقه پیش`;
            const hours = Math.floor(mins / 60);
            if (hours < 24) return `${hours.toLocaleString('fa-IR')} ساعت پیش`;
            const days = Math.floor(hours / 24);
            if (days < 30) return `${days.toLocaleString('fa-IR')} روز پیش`;
            return new Date(dateStr).toLocaleDateString('fa-IR');
        },
        isUserActive(u) {
            if (!u) return false;
            if (!u.active) return false;
            if (u.deactivated_until && new Date(u.deactivated_until) > new Date()) return false;
            return true;
        },
        refreshUser() {
            this.getUser();
        },
        changeSections(value) {
            this.selectedSection = value;
            this.buildQueryParams();
        },

        buildQueryParams() {
            let query = {};

            if (this.selectedSection !== "overview") {
                query.section = this.selectedSection;
            }

            const queryString = new URLSearchParams(query).toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

            window.history.pushState(null, "", newUrl);
        },

        async getUser() {
            this.loading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/base`)
                .then((response) => {
                    this.user = response.data.user;
                    this.social = response.data.user.info || this.social;
                })
                .catch((error) => {
                    console.error(error.response?.data?.errors || error.response?.data || error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        async updateUserSocial() {
            this.errors = null;
            this.socialLoading = true;
            await axiosInstance
                .post(`admin/user/${this.username}/updateSocial`, this.social)
                .then((response) => {
                    this.social = response.data.social;
                    toast.success('اطلاعات شبکه‌های اجتماعی کاربر با موفقیت آپدیت شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeEditUserInfoModal();
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
                    this.socialLoading = false;
                });
        },

        openEditUserInfoModal() {
            this.showEditUserInfoModal = true;
        },

        closeEditUserInfoModal() {
            this.showEditUserInfoModal = false;
        },

        onUserDeleted() {
            this.$router.replace({ name: "admin-users-list" });
        },
    },

    mounted() {
        document.title="مدیریت کاربر"
        this.getUser();
    }
};
</script>
<style></style>
