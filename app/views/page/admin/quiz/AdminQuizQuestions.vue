<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button type="button" @click="refreshData" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    بروزرسانی
                    <svg class="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                    </svg>
                </span>
            </button>
            <router-link :to="{ name: 'admin-quiz-question-create' }"
                class="shrink-0 h-9 rounded-lg bg-yellow-400 px-3 text-sm font-semibold flex items-center gap-1.5 hover:bg-yellow-300 text-gray-900">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                سوال جدید
            </router-link>
        </template>

        <div class="space-y-4">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <AdminReportStatCard title="کل سوالات" :value="formatNumber(pagination.total ?? items.length)" accent="cyan">
                    <template #icon>
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="فعال" :value="formatNumber(activeOnPage)" accent="emerald" subtitle="در صفحه فعلی">
                    <template #icon>
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M3 14C3 9.02944 7.02944 5 12 5C16.9706 5 21 9.02944 21 14M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="غیرفعال" :value="formatNumber(inactiveOnPage)" accent="rose" subtitle="در صفحه فعلی">
                    <template #icon>
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M9.61 9.61a4 4 0 105.78 5.78M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3 3l18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="تصحیح دستی" :value="formatNumber(manualOnPage)" accent="violet" subtitle="در صفحه فعلی">
                    <template #icon>
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </template>
                </AdminReportStatCard>
            </div>

            <AdminListFilterBar
                v-model:search="searchQuery"
                search-placeholder="جستجو متن سوال..."
                @search="handleSearch"
                @clear-search="clearSearch"
                @clear-filters="clearFilters"
            >
                <AdminFilterSelect v-model="typeFilter" label="نوع" :options="typeOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="difficultyFilter" label="سطح" :options="difficultyOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="statusFilter" label="وضعیت" :options="statusOptions" min-width="sm" @change="onFilterChange" />
                <AdminFilterSelect v-model="dataView" label="نمایش" :options="viewOptions" />
            </AdminListFilterBar>

            <AdminInlineLoading v-if="loading" />

            <div v-else-if="items.length" id="data-list">
                <!-- Grid -->
                <div v-if="dataView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 pt-1 items-stretch">
                    <article
                        v-for="q in items"
                        :key="q.id"
                        class="group flex h-full flex-col rounded-xl border border-gray-200/80 bg-white p-3 transition-colors hover:border-gray-300 hover:bg-gray-50/60 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800/40"
                    >
                        <div class="flex min-h-[3.25rem] flex-1 items-start gap-2">
                            <AdminQuestionTypeIcon :type="q.type" size="sm" neutral />
                            <div class="min-w-0 flex-1">
                                <div class="flex items-start justify-between gap-2">
                                    <router-link
                                        :to="{ name: 'admin-quiz-question-edit', params: { id: q.id } }"
                                        class="min-w-0"
                                    >
                                        <h3 class="text-[13px] font-bold leading-5 text-gray-900 line-clamp-2 dark:text-white">
                                            {{ q.text }}
                                        </h3>
                                    </router-link>
                                    <span
                                        class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                                        :class="q.is_active ? 'bg-emerald-400' : 'bg-gray-300 dark:bg-gray-600'"
                                        :title="q.is_active ? 'فعال' : 'غیرفعال'"
                                    ></span>
                                </div>
                                <p class="mt-0.5 text-[11px] text-gray-400 line-clamp-1">
                                    #{{ q.id }}
                                    <template v-if="q.category"> · {{ q.category.name }}</template>
                                </p>
                            </div>
                        </div>

                        <div class="mt-auto pt-2.5">
                            <div class="flex flex-wrap items-center gap-1 text-[10px] text-gray-600 dark:text-gray-300">
                                <span class="meta-chip">{{ QUESTION_TYPE_LABELS[q.type] }}</span>
                                <span class="meta-chip">{{ DIFFICULTY_LABELS[q.difficulty] }}</span>
                                <span class="meta-chip">{{ formatScore(q.default_score) }} نمره</span>
                                <span v-if="hasOptions(q)" class="meta-chip">{{ q.options_count }} گزینه</span>
                                <span v-if="q.requires_manual_review" class="meta-chip">تصحیح دستی</span>
                                <span v-if="!q.is_active" class="meta-chip">غیرفعال</span>
                            </div>

                            <div class="mt-2.5 flex items-center gap-1.5 border-t border-gray-100 pt-2.5 dark:border-gray-800">
                                <router-link
                                    :to="{ name: 'admin-quiz-question-edit', params: { id: q.id } }"
                                    class="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-gray-900 text-[11px] font-bold text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                                >
                                    ویرایش
                                </router-link>
                                <button
                                    type="button"
                                    class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                    title="حذف سوال"
                                    @click="openDelete(q)"
                                >
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </article>
                </div>

                <!-- Table -->
                <div v-else class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 whitespace-nowrap text-start">آیکون</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start min-w-[14rem]">متن سوال</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">نوع</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">سطح</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">نمره</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">گزینه</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">دسته</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr
                                v-for="q in items"
                                :key="q.id"
                                class="bg-white text-gray-800 transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800/60"
                            >
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="flex h-11 w-14 flex-shrink-0 items-center justify-center rounded-lg border-2 border-gray-100 bg-gray-100 dark:border-opacity-10 dark:bg-opacity-10">
                                        <AdminQuestionTypeIcon :type="q.type" size="sm" neutral />
                                    </div>
                                </td>
                                <td class="px-1 py-3 text-start">
                                    <router-link
                                        :to="{ name: 'admin-quiz-question-edit', params: { id: q.id } }"
                                        class="block max-w-md transition-opacity hover:opacity-80"
                                    >
                                        <div class="text-xs font-bold leading-5 text-gray-900 line-clamp-2 dark:text-white">{{ q.text }}</div>
                                        <div v-if="q.category || (q.tags || []).length" class="mt-1 text-[10px] text-gray-400 line-clamp-1">
                                            <span v-if="q.category">{{ q.category.name }}</span>
                                            <template v-for="t in (q.tags || []).slice(0, 2)" :key="t.id">
                                                <span v-if="q.category || t !== (q.tags || [])[0]"> · </span>
                                                #{{ t.name }}
                                            </template>
                                        </div>
                                    </router-link>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="table-chip">{{ QUESTION_TYPE_LABELS[q.type] }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="table-chip">{{ DIFFICULTY_LABELS[q.difficulty] }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="table-chip">{{ formatScore(q.default_score) }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="table-chip">{{ hasOptions(q) ? q.options_count : '—' }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="table-chip">{{ q.category?.name || '—' }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="table-chip">{{ q.is_active ? 'فعال' : 'غیرفعال' }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-center">
                                    <div class="inline-flex items-center gap-1">
                                        <router-link
                                            :to="{ name: 'admin-quiz-question-edit', params: { id: q.id } }"
                                            class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800"
                                            title="ویرایش"
                                        >
                                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/></svg>
                                        </router-link>
                                        <button
                                            type="button"
                                            class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10"
                                            title="حذف"
                                            @click="openDelete(q)"
                                        >
                                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminEmptyState v-else message="سوالی یافت نشد.">
                <router-link :to="{ name: 'admin-quiz-question-create' }" class="inline-block mt-3 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                    + ایجاد اولین سوال
                </router-link>
            </AdminEmptyState>

            <div
                v-if="items.length || pagination.total"
                class="mt-4 flex w-full flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-between"
            >
                <div class="w-max max-w-full shrink-0">
                    <PaginationComponent
                        v-if="pagination && pagination.last_page > 1"
                        dir="ltr"
                        :pagination="pagination"
                        class="!w-auto"
                        @updatePage="onPageChanged"
                    />
                </div>
                <div class="w-max shrink-0">
                    <div class="mb-1 px-1 text-xs font-light text-gray-400">تعداد:</div>
                    <select
                        v-model.number="perPage"
                        class="h-8 min-w-[4rem] rounded-lg bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-0 dark:bg-gray-900 dark:text-gray-100"
                        @change="onPerPageChange"
                    >
                        <option v-for="p in perPages" :key="p" :value="p">{{ p }}</option>
                    </select>
                </div>
            </div>
        </div>

        <BottomSheetDrawer v-model="showDeleteSheet" :panel-class="bs.ADMIN_BS_PANEL_SM">
            <AdminBottomSheetConfirm
                message="حذف سوال"
                :description="deleteTarget ? `آیا از حذف این سوال مطمئن هستید؟` : ''"
                hint="این سوال از بانک حذف می‌شود و آزمون‌های مرتبط تحت تأثیر قرار می‌گیرند."
                :loading="deleting"
                @cancel="showDeleteSheet = false"
                @confirm="doDelete"
            />
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from '@/views/page/admin/layouts/AdminMasterPage.vue';
import AdminInlineLoading from '@/views/components/admin/AdminInlineLoading.vue';
import AdminEmptyState from '@/views/components/admin/AdminEmptyState.vue';
import AdminListFilterBar from '@/views/components/admin/AdminListFilterBar.vue';
import AdminFilterSelect from '@/views/components/admin/AdminFilterSelect.vue';
import AdminReportStatCard from '@/views/components/admin/report/AdminReportStatCard.vue';
import AdminQuestionTypeIcon from '@/views/components/admin/quiz/AdminQuestionTypeIcon.vue';
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import AdminBottomSheetConfirm from '@/views/components/admin/bottomSheet/AdminBottomSheetConfirm.vue';
import PaginationComponent from '@/views/components/home/PaginationComponent.vue';
import { BTN_SECONDARY } from '@/views/components/admin/adminFormStepperMixin.js';
import * as bs from '@/views/components/admin/bottomSheet/adminBottomSheetStyles.js';
import { listQuizQuestions, deleteQuizQuestion } from '@/services/quiz.service';
import { QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from '@/views/components/admin/quiz/adminQuizConstants.js';
import { showToastSuccess, showToastError } from '@/utils/toastConfig';

const OPTION_TYPES = ['single_choice', 'multiple_choice', 'true_false', 'short_answer', 'fill_blank', 'matching', 'ordering'];

export default {
    components: {
        AdminMasterPage, AdminInlineLoading, AdminEmptyState,
        AdminListFilterBar, AdminFilterSelect, AdminReportStatCard,
        AdminQuestionTypeIcon, BottomSheetDrawer, AdminBottomSheetConfirm,
        PaginationComponent,
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        const typeOptions = [{ value: '', label: 'همه' }, ...Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => ({ value, label }))];
        const difficultyOptions = [{ value: '', label: 'همه' }, ...Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({ value, label }))];
        return {
            BTN_SECONDARY,
            bs,
            QUESTION_TYPE_LABELS,
            DIFFICULTY_LABELS,
            loading: false,
            deleting: false,
            items: [],
            pagination: {},
            searchQuery: urlParams.get('search') || '',
            typeFilter: urlParams.get('type') || '',
            difficultyFilter: urlParams.get('difficulty') || '',
            statusFilter: urlParams.get('status') || '',
            dataView: urlParams.get('dataView') || 'grid',
            currentPage: parseInt(urlParams.get('page') || '1', 10) || 1,
            perPage: parseInt(urlParams.get('perPage') || '12', 10) || 12,
            typeOptions,
            difficultyOptions,
            statusOptions: [
                { value: '', label: 'همه' },
                { value: 'active', label: 'فعال' },
                { value: 'inactive', label: 'غیرفعال' },
            ],
            perPages: [12, 24, 50],
            showDeleteSheet: false,
            deleteTarget: null,
        };
    },
    computed: {
        viewOptions() {
            return [
                { value: 'grid', label: 'شبکه‌ای' },
                { value: 'list', label: 'جدول' },
            ];
        },
        activeOnPage() {
            return this.items.filter(q => q.is_active).length;
        },
        inactiveOnPage() {
            return this.items.filter(q => !q.is_active).length;
        },
        manualOnPage() {
            return this.items.filter(q => q.requires_manual_review).length;
        },
    },
    watch: {
        dataView() { this.syncUrl(); },
    },
    mounted() { this.fetchData(); },
    methods: {
        formatNumber(v) {
            return Number(v || 0).toLocaleString('fa-IR');
        },
        formatScore(v) {
            const n = Number(v || 0);
            return Number.isInteger(n) ? n.toLocaleString('fa-IR') : n.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        },
        hasOptions(q) {
            return OPTION_TYPES.includes(q.type);
        },
        syncUrl() {
            const params = new URLSearchParams();
            if (this.searchQuery) params.set('search', this.searchQuery);
            if (this.typeFilter) params.set('type', this.typeFilter);
            if (this.difficultyFilter) params.set('difficulty', this.difficultyFilter);
            if (this.statusFilter) params.set('status', this.statusFilter);
            if (this.dataView !== 'grid') params.set('dataView', this.dataView);
            if (this.currentPage > 1) params.set('page', String(this.currentPage));
            if (this.perPage !== 12) params.set('perPage', String(this.perPage));
            const qs = params.toString();
            const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
            window.history.replaceState({}, '', url);
        },
        clearSearch() {
            this.searchQuery = '';
            this.currentPage = 1;
            this.syncUrl();
            this.fetchData();
        },
        clearFilters() {
            this.searchQuery = '';
            this.typeFilter = '';
            this.difficultyFilter = '';
            this.statusFilter = '';
            this.dataView = 'grid';
            this.currentPage = 1;
            this.perPage = 12;
            this.syncUrl();
            this.fetchData();
        },
        onFilterChange() {
            this.currentPage = 1;
            this.syncUrl();
            this.fetchData();
        },
        handleSearch() {
            clearTimeout(this._t);
            this._t = setTimeout(() => {
                this.currentPage = 1;
                this.syncUrl();
                this.fetchData();
            }, 400);
        },
        onPageChanged(page) {
            this.currentPage = page;
            this.syncUrl();
            this.fetchData();
            document.getElementById('data-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
        onPerPageChange() {
            this.currentPage = 1;
            this.syncUrl();
            this.fetchData();
        },
        refreshData() {
            this.fetchData();
        },
        reload() {
            this.fetchData();
        },
        async fetchData() {
            this.loading = true;
            try {
                const res = await listQuizQuestions({
                    search: this.searchQuery || undefined,
                    type: this.typeFilter || undefined,
                    difficulty: this.difficultyFilter || undefined,
                    status: this.statusFilter || undefined,
                    page: this.currentPage,
                    perPage: this.perPage,
                });
                const paginated = res.questions;
                this.items = paginated?.data || [];
                this.pagination = {
                    current_page: paginated?.current_page || 1,
                    last_page: paginated?.last_page || 1,
                    per_page: paginated?.per_page || this.perPage,
                    total: paginated?.total || this.items.length,
                };
            } catch {
                showToastError('بارگذاری سوالات با خطا مواجه شد.');
            } finally {
                this.loading = false;
            }
        },
        openDelete(q) {
            this.deleteTarget = q;
            this.showDeleteSheet = true;
        },
        async doDelete() {
            if (!this.deleteTarget) return;
            this.deleting = true;
            try {
                await deleteQuizQuestion(this.deleteTarget.id);
                showToastSuccess('سوال حذف شد.');
                this.showDeleteSheet = false;
                this.deleteTarget = null;
                this.fetchData();
            } catch {
                showToastError('حذف سوال با خطا مواجه شد.');
            } finally {
                this.deleting = false;
            }
        },
    },
};
</script>

<style scoped>
.meta-chip,
.table-chip {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    border-radius: 0.375rem;
    background: rgb(243 244 246 / 0.8);
    font-weight: 500;
    color: rgb(31 41 55);
}

.meta-chip {
    font-size: 10px;
    padding: 0.125rem 0.375rem;
}

.table-chip {
    font-size: 11px;
    line-height: 1.25;
    padding: 0.125rem 0.375rem;
}

.dark .meta-chip,
.dark .table-chip {
    background: rgb(31 41 55 / 0.5);
    color: rgb(243 244 246);
}
</style>
