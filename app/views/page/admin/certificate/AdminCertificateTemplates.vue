<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-certificates' }" :class="btnSecondary">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center gap-1.5">
                        گواهینامه‌ها
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </span>
                </span>
            </router-link>
            <router-link :to="{ name: 'admin-certificate-template-create' }" :class="btnSecondary">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center gap-1.5">
                        {{ $t('cert.admin.createTemplate') }}
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5V19M5 12H19" />
                        </svg>
                    </span>
                </span>
            </router-link>
            <button type="button" @click="load" :class="btnSecondary">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center gap-1.5">بروزرسانی</span>
                </span>
            </button>
        </template>

        <div class="min-w-0">
            <!-- Stats -->
            <div v-if="!loading" class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                <AdminReportStatCard title="کل قالب‌ها" :value="formatNumber(stats.total)" accent="amber">
                    <template #icon>
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="فعال" :value="formatNumber(stats.active)" accent="amber" subtitle="قابل استفاده" />
                <AdminReportStatCard title="غیرفعال" :value="formatNumber(stats.inactive)" accent="amber" />
                <AdminReportStatCard title="صدور شده" :value="formatNumber(stats.certificates)" accent="amber" subtitle="با این قالب‌ها" />
            </div>

            <!-- Filters -->
            <div class="flex flex-col sm:flex-row sm:items-end gap-3 mb-5">
                <div class="relative flex-1 max-w-md">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input v-model="searchQuery" type="text" placeholder="جستجو در نام قالب..."
                        class="w-full h-9 ps-10 pe-8 text-xs font-medium rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200/80 dark:border-gray-700/80 outline-none focus:ring-2 focus:ring-yellow-400/40" />
                    <button v-if="searchQuery" type="button" @click="searchQuery = ''"
                        class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="w-max">
                    <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت</div>
                    <select v-model="statusFilter"
                        class="h-9 px-3 text-xs font-medium rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700/80 outline-none focus:ring-2 focus:ring-yellow-400/40 min-w-[8rem]">
                        <option value="all">همه</option>
                        <option value="active">فعال</option>
                        <option value="inactive">غیرفعال</option>
                    </select>
                </div>
            </div>

            <p v-if="!loading" class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {{ formatNumber(displayTemplates.length) }} قالب نمایش داده می‌شود
            </p>

            <LoadingComponent v-if="loading" />

            <div v-else-if="displayTemplates.length" class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                <article v-for="tpl in displayTemplates" :key="tpl.id"
                    class="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
                    <!-- Status accent -->
                    <div class="absolute top-0 inset-x-0 h-1 z-10"
                        :class="tpl.is_active ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'"></div>

                    <!-- Preview (fixed frame, centered thumbnail) -->
                    <div class="relative px-3 pt-3 pb-0">
                        <div class="relative h-40 rounded-xl bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200/60 dark:ring-gray-700/60 overflow-hidden flex items-center justify-center">
                            <img
                                v-if="tpl.background_image_url"
                                :src="tpl.background_image_url"
                                :alt="tpl.name"
                                class="max-h-[8.5rem] max-w-[88%] w-auto h-auto object-contain rounded shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50 bg-white dark:bg-gray-900"
                                onerror="this.style.display='none'"
                            />
                            <div
                                v-else
                                class="rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-900/60 flex flex-col items-center justify-center gap-1.5 p-2 shadow-sm"
                                :class="tpl.orientation === 'portrait' ? 'w-16 h-[5.25rem]' : 'w-[6.25rem] h-12'"
                            >
                                <div class="w-6 h-0.5 rounded-full bg-yellow-400"></div>
                                <div class="w-10 h-1 rounded bg-gray-200 dark:bg-gray-700"></div>
                                <div class="w-8 h-0.5 rounded bg-gray-100 dark:bg-gray-800"></div>
                                <div class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 ring-1 ring-yellow-400/40 mt-0.5"></div>
                            </div>

                            <div class="absolute top-2 start-2 flex flex-wrap gap-1 z-10">
                                <span v-if="tpl.is_default"
                                    class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-yellow-400 text-gray-900 shadow-sm">
                                    {{ $t('cert.admin.default') }}
                                </span>
                                <span class="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-black/60 text-white backdrop-blur-sm">
                                    {{ tpl.orientation === 'portrait' ? $t('cert.admin.portrait') : $t('cert.admin.landscape') }}
                                </span>
                            </div>
                            <img
                                v-if="tpl.logo_image_url"
                                :src="tpl.logo_image_url"
                                alt=""
                                class="absolute bottom-2 end-2 w-6 h-6 object-contain opacity-90 drop-shadow-sm z-10"
                                onerror="this.style.display='none'"
                            />
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="flex flex-col flex-1 p-4 pt-3">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{{ tpl.name }}</h3>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                            {{ tpl.description || 'بدون توضیحات' }}
                        </p>

                        <div class="mt-3 flex flex-wrap gap-2">
                            <span class="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {{ formatNumber(tpl.courses_count || 0) }} {{ $t('cert.admin.courses') }}
                            </span>
                            <span class="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-anjoman">
                                {{ formatNumber(tpl.certificates_count || 0) }} صدور
                            </span>
                        </div>

                        <!-- Quick toggles -->
                        <div class="mt-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                            <div class="flex items-center justify-between gap-3 px-3 py-2.5">
                                <div class="min-w-0">
                                    <p class="text-xs font-semibold text-gray-800 dark:text-gray-200">{{ $t('cert.admin.active') }}</p>
                                    <p class="text-[10px] text-gray-400 mt-0.5">قابل استفاده در صدور</p>
                                </div>
                                <button type="button" @click="toggleActive(tpl)"
                                    :disabled="isToggleBusy(tpl.id, 'active') || (tpl.is_default && tpl.is_active)"
                                    class="relative shrink-0 w-10 h-5 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    :class="tpl.is_active ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'"
                                    :title="tpl.is_default && tpl.is_active ? 'قالب پیش‌فرض را نمی‌توان غیرفعال کرد' : (tpl.is_active ? 'غیرفعال کردن' : 'فعال کردن')">
                                    <span class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                                        :class="tpl.is_active ? 'start-0.5' : 'start-[calc(100%-1.125rem)]'"></span>
                                </button>
                            </div>
                            <div class="flex items-center justify-between gap-3 px-3 py-2.5">
                                <div class="min-w-0">
                                    <p class="text-xs font-semibold text-gray-800 dark:text-gray-200">{{ $t('cert.admin.default') }}</p>
                                    <p class="text-[10px] text-gray-400 mt-0.5">قالب پیش‌فرض دوره‌ها</p>
                                </div>
                                <button type="button" @click="toggleDefault(tpl)"
                                    :disabled="isToggleBusy(tpl.id, 'default') || (tpl.is_default && templates.length <= 1)"
                                    class="relative shrink-0 w-10 h-5 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    :class="tpl.is_default ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'"
                                    :title="tpl.is_default ? (templates.length <= 1 ? 'حداقل یک قالب پیش‌فرض لازم است' : 'برداشتن پیش‌فرض') : 'تنظیم به‌عنوان پیش‌فرض'">
                                    <span class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                                        :class="tpl.is_default ? 'start-0.5' : 'start-[calc(100%-1.125rem)]'"></span>
                                </button>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                            <router-link :to="{ name: 'admin-certificate-template-edit', params: { id: tpl.id } }"
                                class="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-bold transition-colors shadow-sm">
                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {{ $t('cert.admin.edit') }}
                            </router-link>
                            <button type="button" @click="duplicate(tpl.id)" :disabled="duplicatingId === tpl.id"
                                class="h-9 px-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 shadow-sm">
                                {{ duplicatingId === tpl.id ? '...' : $t('cert.admin.duplicate') }}
                            </button>
                            <button v-if="!tpl.is_default" type="button" @click="openDeleteSheet(tpl)"
                                class="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </article>
            </div>

            <!-- Empty state -->
            <div v-else-if="!loading"
                class="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">{{ $t('cert.admin.noTemplates') }}</p>
                <router-link :to="{ name: 'admin-certificate-template-create' }"
                    class="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-bold transition-colors">
                    {{ $t('cert.admin.createTemplate') }}
                </router-link>
            </div>
        </div>

        <!-- Delete sheet -->
        <BottomSheetDrawer v-model="showDeleteSheet" :initialHeight="0.38" :maxHeight="0.5" :minHeight="0.32"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="sheetPanelClass" :contentClass="sheetContentClass" :backdropClass="sheetBackdropClass">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-900 dark:text-white">حذف قالب</h3>
                <button type="button" @click="closeDeleteSheet"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 p-1.5 text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
                آیا از حذف قالب «<strong class="text-gray-900 dark:text-white">{{ templateToDelete?.name }}</strong>» مطمئن هستید؟
            </p>
            <div class="flex justify-end gap-3">
                <button type="button" @click="closeDeleteSheet"
                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200">
                    انصراف
                </button>
                <button type="button" @click="confirmDelete" :disabled="deleteLoading"
                    class="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 dark:bg-gray-700 rounded-xl hover:bg-black disabled:opacity-50">
                    {{ deleteLoading ? 'در حال حذف...' : $t('cert.admin.delete') }}
                </button>
            </div>
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from '@/views/page/admin/layouts/AdminMasterPage.vue';
import AdminReportStatCard from '@/views/components/admin/report/AdminReportStatCard.vue';
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import LoadingComponent from '@/views/components/LoadingComponent.vue';
import { listCertificateTemplates, deleteCertificateTemplate, duplicateCertificateTemplate, updateCertificateTemplate } from '@/services/certificate.service';
import { showToastSuccess, showToastError } from '@/utils/toastConfig';

const BTN_SECONDARY = 'flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 dark:bg-gray-900 dark:text-gray-100 dark:shadow-none dark:border dark:border-gray-700 dark:hover:bg-gray-800';
const SHEET_PANEL = 'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]';
const SHEET_CONTENT = 'px-4 pb-4 overflow-auto custom-scrollbar';
const SHEET_BACKDROP = 'z-50 bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm';

export default {
    components: { AdminMasterPage, AdminReportStatCard, BottomSheetDrawer, LoadingComponent },
    data() {
        return {
            loading: false,
            templates: [],
            searchQuery: '',
            statusFilter: 'all',
            duplicatingId: null,
            toggleLoading: {},
            showDeleteSheet: false,
            templateToDelete: null,
            deleteLoading: false,
            btnSecondary: BTN_SECONDARY,
            sheetPanelClass: SHEET_PANEL,
            sheetContentClass: SHEET_CONTENT,
            sheetBackdropClass: SHEET_BACKDROP,
        };
    },
    computed: {
        stats() {
            const list = this.templates;
            return {
                total: list.length,
                active: list.filter((t) => t.is_active).length,
                inactive: list.filter((t) => !t.is_active).length,
                certificates: list.reduce((s, t) => s + (t.certificates_count || 0), 0),
            };
        },
        displayTemplates() {
            let list = [...this.templates];
            const q = this.searchQuery.trim().toLowerCase();
            if (q) {
                list = list.filter((t) =>
                    (t.name || '').toLowerCase().includes(q)
                    || (t.description || '').toLowerCase().includes(q)
                );
            }
            if (this.statusFilter === 'active') list = list.filter((t) => t.is_active);
            else if (this.statusFilter === 'inactive') list = list.filter((t) => !t.is_active);
            return list;
        },
    },
    mounted() {
        this.load();
    },
    methods: {
        formatNumber(value) {
            return Number(value || 0).toLocaleString('fa-IR');
        },
        isToggleBusy(id, field) {
            return !!this.toggleLoading[`${field}-${id}`];
        },
        setToggleBusy(id, field, busy) {
            const key = `${field}-${id}`;
            if (busy) {
                this.toggleLoading = { ...this.toggleLoading, [key]: true };
            } else {
                const next = { ...this.toggleLoading };
                delete next[key];
                this.toggleLoading = next;
            }
        },
        applyTemplatePatch(id, patch) {
            const idx = this.templates.findIndex((t) => t.id === id);
            if (idx === -1) return;
            this.templates.splice(idx, 1, { ...this.templates[idx], ...patch });
        },
        syncDefaultFlags(defaultId) {
            this.templates = this.templates.map((t) => ({
                ...t,
                is_default: t.id === defaultId,
            }));
        },
        async toggleActive(tpl) {
            if (this.isToggleBusy(tpl.id, 'active')) return;
            const next = !tpl.is_active;
            if (tpl.is_default && !next) {
                showToastError('قالب پیش‌فرض را نمی‌توان غیرفعال کرد');
                return;
            }
            this.setToggleBusy(tpl.id, 'active', true);
            const prev = tpl.is_active;
            this.applyTemplatePatch(tpl.id, { is_active: next });
            try {
                await updateCertificateTemplate(tpl.id, { is_active: next });
                showToastSuccess(next ? 'قالب فعال شد' : 'قالب غیرفعال شد');
            } catch (error) {
                this.applyTemplatePatch(tpl.id, { is_active: prev });
                showToastError(error.response?.data?.message || 'خطا در تغییر وضعیت');
            } finally {
                this.setToggleBusy(tpl.id, 'active', false);
            }
        },
        async toggleDefault(tpl) {
            if (this.isToggleBusy(tpl.id, 'default')) return;

            if (tpl.is_default) {
                const others = this.templates.filter((t) => t.id !== tpl.id);
                if (others.length === 0) {
                    showToastError('حداقل یک قالب پیش‌فرض لازم است');
                    return;
                }
                const replacement = others.find((t) => t.is_active) || others[0];
                await this.setAsDefault(replacement, { fromUnset: tpl });
                return;
            }

            await this.setAsDefault(tpl);
        },
        async setAsDefault(tpl, { fromUnset = null } = {}) {
            this.setToggleBusy(tpl.id, 'default', true);
            const snapshot = this.templates.map((t) => ({
                id: t.id,
                is_default: t.is_default,
                is_active: t.is_active,
            }));
            const shouldActivate = !tpl.is_active;
            this.syncDefaultFlags(tpl.id);
            if (shouldActivate) {
                this.applyTemplatePatch(tpl.id, { is_active: true });
            }
            try {
                const payload = { is_default: true };
                if (shouldActivate) payload.is_active = true;
                await updateCertificateTemplate(tpl.id, payload);
                if (fromUnset) {
                    showToastSuccess(`پیش‌فرض به «${tpl.name}» منتقل شد`);
                } else {
                    showToastSuccess('قالب به‌عنوان پیش‌فرض تنظیم شد');
                }
            } catch (error) {
                snapshot.forEach((item) => {
                    this.applyTemplatePatch(item.id, {
                        is_default: item.is_default,
                        is_active: item.is_active,
                    });
                });
                showToastError(error.response?.data?.message || 'خطا در تنظیم پیش‌فرض');
            } finally {
                this.setToggleBusy(tpl.id, 'default', false);
            }
        },
        async load() {
            this.loading = true;
            try {
                const res = await listCertificateTemplates({ perPage: 100 });
                this.templates = res.templates?.data || res.templates || [];
            } catch (error) {
                showToastError(error.response?.data?.message || 'خطا در دریافت قالب‌ها');
            } finally {
                this.loading = false;
            }
        },
        async duplicate(id) {
            this.duplicatingId = id;
            try {
                await duplicateCertificateTemplate(id);
                showToastSuccess('قالب کپی شد');
                await this.load();
            } catch (error) {
                showToastError(error.response?.data?.message || 'خطا در کپی قالب');
            } finally {
                this.duplicatingId = null;
            }
        },
        openDeleteSheet(tpl) {
            this.templateToDelete = tpl;
            this.showDeleteSheet = true;
        },
        closeDeleteSheet() {
            this.showDeleteSheet = false;
            this.templateToDelete = null;
        },
        async confirmDelete() {
            if (!this.templateToDelete) return;
            this.deleteLoading = true;
            try {
                await deleteCertificateTemplate(this.templateToDelete.id);
                showToastSuccess('قالب حذف شد');
                this.closeDeleteSheet();
                await this.load();
            } catch (error) {
                showToastError(error.response?.data?.message || 'حذف امکان‌پذیر نیست');
            } finally {
                this.deleteLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
