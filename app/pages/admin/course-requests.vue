<script setup>
definePageMeta({
    name: 'admin-course-requests',
    middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button @click.prevent="getData"
                class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">تازه‌سازی داده‌ها</span>
            </button>
        </template>
        <div class="min-w-0">
            <AdminBulkActionBar :count="selectedKeys.length">
                <button
                    v-if="canModerate"
                    type="button"
                    :disabled="bulkLoading"
                    class="h-8 px-3 text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 disabled:opacity-50"
                    @click="openBulkSheet('approve')"
                >
                    تایید
                </button>
                <button
                    v-if="canModerate"
                    type="button"
                    :disabled="bulkLoading"
                    class="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 disabled:opacity-50"
                    @click="openBulkSheet('reject')"
                >
                    رد
                </button>
                <button
                    v-if="canModerate"
                    type="button"
                    :disabled="bulkLoading"
                    class="h-8 px-3 text-xs font-semibold text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 disabled:opacity-50"
                    @click="openBulkSheet('unpublish')"
                >
                    لغو انتشار
                </button>
                <button
                    type="button"
                    class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    @click="clearBulkSelection"
                >
                    لغو انتخاب
                </button>
            </AdminBulkActionBar>
            <AdminListFilterBar
                v-model:search="searchQuery"
                search-placeholder="جستجو عنوان دوره یا اپیزود..."
                @search="handleSearch"
                @clear-search="clearSearch"
                @clear-filters="clearFilters"
            >
                <AdminFilterSelect v-model="filterAction" label="نوع درخواست" :options="actionOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterTarget" label="مورد" :options="targetOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterStatus" label="وضعیت" :options="statusOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterSort" label="مرتب‌سازی" :options="sortOptions" @change="onFilterChange" />
            </AdminListFilterBar>

            <AdminStatusLegend :items="legendItems" />

            <div id="data-list" class="overflow-x-auto md:custom-scrollbar pt-4">
                <table
                    class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                    <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <tr class="text-xs font-semibold text-start">
                            <th class="px-1 py-2 whitespace-nowrap text-start">
                                <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                            </th>
                            <th class="px-1 py-3 whitespace-nowrap text-start">پوستر</th>
                            <th class="px-1 py-3 whitespace-nowrap text-start">جزییات</th>
                            <th class="px-1 py-3 whitespace-nowrap text-start">نوع درخواست</th>
                            <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت</th>
                            <th class="px-1 py-3 whitespace-nowrap text-start">مدت زمان</th>
                            <th v-if="showTeacherColumn" class="px-1 py-3 whitespace-nowrap text-start">مدرس</th>
                            <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <tr v-for="item in items" v-show="!loading" :key="rowKey(item)"
                            class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-amber-50/40 dark:hover:bg-gray-800/60 transition-colors">
                            <td class="relative ps-2 pe-2 py-3 whitespace-nowrap text-start">
                                <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg" :class="rowBarClass(item)"></div>
                                <AdminBulkCheckbox v-model="selectedKeys" :value="rowKey(item)" />
                            </td>
                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                <div class="flex items-center">
                                    <router-link
                                        :to="rowLink(item)"
                                        class="flex-shrink-0 w-28 h-16 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-100 dark:border-opacity-10 overflow-hidden">
                                        <img onerror="this.style.display='none'"
                                            class="w-full h-full object-cover hover:scale-105 duration-150"
                                            :src="rowPoster(item)" :alt="item.title" />
                                    </router-link>
                                </div>
                            </td>
                            <td class="px-1 py-3 text-start">
                                <router-link
                                    :to="rowLink(item)"
                                    class="flex items-center hover:opacity-80 transition-opacity">
                                    <div class="ms-2 w-48">
                                        <div class="mb-2 text-gray-900 dark:text-white font-bold line-clamp-1" :title="item.title">
                                            {{ item.title }}
                                        </div>
                                        <div class="text-gray-500 text-xs line-clamp-2">{{ rowSubtitle(item) }}</div>
                                    </div>
                                </router-link>
                            </td>
                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                <div class="whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                    {{ requestKindLabel(item) }}
                                </div>
                            </td>
                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                <button type="button" class="whitespace-nowrap flex items-center text-xs font-medium px-2 py-1 rounded-lg"
                                    :class="rowChipClass(item)"
                                    @click="openQuickPublish(item)">
                                    {{ rowStatusLabel(item) }}
                                </button>
                            </td>
                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                <div
                                    class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                    {{ formatDuration(item.total_time) }}
                                </div>
                            </td>
                            <td v-if="showTeacherColumn" class="px-1 py-3 whitespace-nowrap text-start">
                                <AdminCourseTeacherCell :teacher="item.teacher" />
                            </td>
                            <td class="px-1 py-3 whitespace-nowrap text-center">
                                <AdminCourseRowActions
                                    v-if="!isEpisodeRow(item)"
                                    :course="item"
                                    :show-delete="true"
                                    @publish-action="openPublishModal"
                                />
                                <button
                                    v-else
                                    type="button"
                                    class="inline-flex h-8 items-center rounded-xl px-2.5 text-xs font-bold text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/30"
                                    @click="openPublishModal({ action: defaultPublishAction(item), course: item.course, episode: item })"
                                >
                                    {{ isUnpublishRow(item) ? 'لغو انتشار' : 'بررسی' }}
                                </button>
                            </td>
                        </tr>
                        <tr class="h-24"></tr>
                    </tbody>
                </table>
                <p v-if="!loading && !items.length" class="py-12 text-center text-sm text-gray-400">موردی یافت نشد</p>
            </div>
            <div class="flex lg:flex-row flex-col items-center justify-between gap-4 -mt-20">
                <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                <select v-model.number="perPage" @change="onPerPageChange"
                    class="h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[4rem]">
                    <option v-for="p in perPages" :key="p" :value="p">{{ p }}</option>
                </select>
            </div>
        </div>
        <AdminCoursePublishReviewModal
            v-model="showPublishModal"
            :kind="reviewKind"
            :course="publishCourse"
            :episode="publishEpisode"
            :action="publishAction"
            @updated="onPublishUpdated"
        />
        <BottomSheetDrawer
            v-model="showBulkSheet"
            :initial-height="0.42"
            :max-height="0.72"
            :min-height="0.32"
            :auto-close-on-min="true"
            :close-on-backdrop="true"
            :lock-scroll="true"
            panel-class="bg-white dark:bg-gray-900 border-t border-gray-200/80 dark:border-gray-700/80 rounded-t-2xl lg:rounded-b-2xl lg:w-[36rem] lg:max-w-[36rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]"
            content-class="px-5 flex flex-col flex-1 min-h-0 overflow-hidden"
            backdrop-class="z-50 bg-gray-900/20 dark:bg-gray-900/40 backdrop-blur-sm"
        >
            <AdminBottomSheetHeader
                :title="bulkSheetMeta.title"
                :subtitle="bulkSheetMeta.subtitle"
                :accent="bulkSheetMeta.accent"
                @close="closeBulkSheet"
            />
            <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-1">
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {{ bulkEligibleRows.length.toLocaleString('fa-IR') }} مورد واجد شرایط برای این عملیات است.
                    <span v-if="bulkSkippedCount"> {{ bulkSkippedCount.toLocaleString('fa-IR') }} مورد نادیده گرفته می‌شود.</span>
                </p>
                <p v-if="bulkSheetMeta.warning" class="mt-3 rounded-xl border border-rose-200/70 bg-rose-50/70 px-3 py-2 text-[11px] leading-relaxed text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/20 dark:text-rose-300">
                    {{ bulkSheetMeta.warning }}
                </p>
                <div v-if="bulkIntent === 'reject' || bulkIntent === 'unpublish'" class="mt-4">
                    <label class="block mb-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {{ bulkIntent === 'reject' ? 'دلیل رد برای مدرس' : 'توضیح (اختیاری)' }}
                    </label>
                    <textarea
                        v-model="bulkComment"
                        rows="4"
                        class="relative z-10 bg-gray-100 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 text-gray-900 text-sm rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-amber-400/50 focus:border-amber-400 block w-full px-3 py-2.5 dark:text-white"
                        :class="bulkCommentError ? 'ring-2 ring-inset ring-rose-500/30 border-rose-400' : ''"
                        placeholder="توضیح برای مدرس..."
                    />
                    <p v-if="bulkCommentError" class="mt-1.5 text-xs font-medium text-rose-500">{{ bulkCommentError }}</p>
                </div>
            </div>
            <AdminBottomSheetActions
                hide-cancel
                :submit-label="bulkLoading ? 'در حال انجام...' : bulkSheetMeta.submitLabel"
                :variant="bulkSheetMeta.variant"
                :loading="bulkLoading"
                :disabled="!bulkEligibleRows.length"
                @submit="executeBulkAction"
            />
        </BottomSheetDrawer>
        <LoadingComponent v-if="loading" />
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from '@/views/page/admin/layouts/AdminMasterPage.vue'
import LoadingComponent from '@/views/components/LoadingComponent.vue'
import PaginationComponent from '@/views/components/home/PaginationComponent.vue'
import AdminListFilterBar from '@/views/components/admin/AdminListFilterBar.vue'
import AdminFilterSelect from '@/views/components/admin/AdminFilterSelect.vue'
import AdminCoursePublishReviewModal from '@/views/components/admin/AdminCoursePublishReviewModal.vue'
import AdminCourseTeacherCell from '@/views/components/admin/AdminCourseTeacherCell.vue'
import AdminCourseRowActions from '@/views/components/admin/AdminCourseRowActions.vue'
import AdminStatusLegend from '@/views/components/admin/AdminStatusLegend.vue'
import AdminBulkActionBar from '@/views/components/admin/AdminBulkActionBar.vue'
import AdminBulkCheckbox from '@/views/components/admin/AdminBulkCheckbox.vue'
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue'
import AdminBottomSheetHeader from '@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue'
import AdminBottomSheetActions from '@/views/components/admin/bottomSheet/AdminBottomSheetActions.vue'
import axiosInstance from '@/store/axiosInstance'
import { useAdminCoursePublishStore } from '@/stores/adminCoursePublish'
import { showToastSuccess, showToastError } from '@/utils/toastConfig'
import {
    applyPublishResponse,
    COURSE_PUBLISH_APPROVE_PERMS,
    COURSE_PUBLISH_REQUEST_PERMS,
    publishStatus,
} from '@/utils/coursePublish'

const LEGACY_TYPE_MAP = {
    all: { action: 'all', target: 'all' },
    publish: { action: 'publish', target: 'all' },
    delete: { action: 'delete', target: 'all' },
    episode: { action: 'publish', target: 'episode' },
    'course-publish': { action: 'publish', target: 'course' },
    'course-unpublish': { action: 'unpublish', target: 'course' },
    'course-delete': { action: 'delete', target: 'course' },
    'episode-publish': { action: 'publish', target: 'episode' },
    'episode-unpublish': { action: 'unpublish', target: 'episode' },
}

function filtersFromQuery(query = {}) {
    let action = query.action || 'all'
    let target = query.target || query.entity || 'all'
    const legacyKey = query.type || query.tab
    if (!query.action && !query.target && !query.entity && legacyKey && LEGACY_TYPE_MAP[legacyKey]) {
        action = LEGACY_TYPE_MAP[legacyKey].action
        target = LEGACY_TYPE_MAP[legacyKey].target
    }
    const allowedActions = ['all', 'publish', 'unpublish', 'delete']
    const allowedTargets = ['all', 'course', 'episode']
    const allowedStatuses = ['all', 'pending', 'approved', 'rejected']
    let status = query.status || query.publish_status || 'all'
    if (status === 'published') status = 'approved'
    return {
        action: allowedActions.includes(action) ? action : 'all',
        target: allowedTargets.includes(target) ? target : 'all',
        status: allowedStatuses.includes(status) ? status : 'all',
    }
}

export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        PaginationComponent,
        AdminListFilterBar,
        AdminFilterSelect,
        AdminCoursePublishReviewModal,
        AdminCourseTeacherCell,
        AdminCourseRowActions,
        AdminStatusLegend,
        AdminBulkActionBar,
        AdminBulkCheckbox,
        BottomSheetDrawer,
        AdminBottomSheetHeader,
        AdminBottomSheetActions,
    },
    data() {
        const initial = filtersFromQuery(this.$route.query)
        return {
            filterAction: initial.action,
            filterTarget: initial.target,
            filterStatus: initial.status,
            filterSort: this.$route.query.sort || 'newest',
            searchQuery: this.$route.query.search || '',
            loading: false,
            items: [],
            currentPage: this.$route.query.page ? Number(this.$route.query.page) : 1,
            pagination: {},
            perPage: 10,
            perPages: [10, 20, 30, 50],
            showPublishModal: false,
            publishCourse: null,
            publishEpisode: null,
            publishAction: 'review',
            reviewKind: 'publish',
            selectedKeys: [],
            selectedSnapshots: {},
            bulkLoading: false,
            showBulkSheet: false,
            bulkIntent: '',
            bulkComment: '',
            bulkCommentError: '',
            actionOptions: [
                { title: 'همه', slug: 'all' },
                { title: 'انتشار', slug: 'publish' },
                { title: 'عدم انتشار', slug: 'unpublish' },
                { title: 'حذف', slug: 'delete' },
            ],
            targetOptions: [
                { title: 'همه', slug: 'all' },
                { title: 'دوره', slug: 'course' },
                { title: 'اپیزود', slug: 'episode' },
            ],
            statusOptions: [
                { title: 'همه', slug: 'all' },
                { title: 'در انتظار', slug: 'pending' },
                { title: 'تایید شده', slug: 'approved' },
                { title: 'رد شده', slug: 'rejected' },
            ],
            sortOptions: [
                { title: 'جدیدترین', slug: 'newest' },
                { title: 'قدیمی‌ترین', slug: 'oldest' },
            ],
            legendItems: [
                { label: 'در انتظار', barClass: 'bg-amber-400 dark:bg-amber-500' },
                { label: 'تایید شده', barClass: 'bg-emerald-400 dark:bg-emerald-600' },
                { label: 'رد شده', barClass: 'bg-rose-400 dark:bg-rose-600' },
            ],
        }
    },
    computed: {
        showTeacherColumn() {
            return this.$scopeAny('courses')
        },
        canModerate() {
            return this.$can(COURSE_PUBLISH_APPROVE_PERMS)
        },
        visibleKeys() {
            return this.items.map((item) => this.rowKey(item))
        },
        isAllSelected() {
            return this.visibleKeys.length > 0 && this.visibleKeys.every((key) => this.selectedKeys.includes(key))
        },
        isIndeterminate() {
            const selectedOnPage = this.visibleKeys.filter((key) => this.selectedKeys.includes(key)).length
            return selectedOnPage > 0 && selectedOnPage < this.visibleKeys.length
        },
        bulkEligibleRows() {
            return Object.values(this.selectedSnapshots).filter((row) => this.rowMatchesBulkIntent(row, this.bulkIntent))
        },
        bulkSkippedCount() {
            return Math.max(0, this.selectedKeys.length - this.bulkEligibleRows.length)
        },
        bulkSheetMeta() {
            const count = this.bulkEligibleRows.length
            const deleteCount = this.bulkEligibleRows.filter((row) => String(row.kind).endsWith('-delete')).length
            if (this.bulkIntent === 'reject') {
                return {
                    title: 'رد گروهی',
                    subtitle: `برای ${count.toLocaleString('fa-IR')} مورد انتخاب‌شده`,
                    accent: 'rose',
                    variant: 'danger',
                    submitLabel: 'رد درخواست‌ها',
                    warning: '',
                }
            }
            if (this.bulkIntent === 'unpublish') {
                return {
                    title: 'لغو انتشار گروهی',
                    subtitle: `برای ${count.toLocaleString('fa-IR')} مورد منتشرشده`,
                    accent: 'rose',
                    variant: 'danger',
                    submitLabel: 'لغو انتشار',
                    warning: '',
                }
            }
            return {
                title: 'تایید گروهی',
                subtitle: `برای ${count.toLocaleString('fa-IR')} مورد در انتظار`,
                accent: 'emerald',
                variant: deleteCount ? 'danger' : 'primary',
                submitLabel: deleteCount ? 'تایید و اعمال' : 'تایید',
                warning: deleteCount
                    ? `${deleteCount.toLocaleString('fa-IR')} درخواست حذف با تایید برای همیشه پاک می‌شود.`
                    : '',
            }
        },
        queueQueries() {
            const actions = this.filterAction === 'all' ? ['publish', 'unpublish', 'delete'] : [this.filterAction]
            const targets = this.filterTarget === 'all' ? ['course', 'episode'] : [this.filterTarget]
            const queries = []
            actions.forEach((action) => {
                targets.forEach((target) => {
                    const kind = `${target}-${action}`
                    if (kind === 'episode-delete') return
                    this.statusesForKind(kind).forEach((status) => {
                        queries.push({ kind, status })
                    })
                })
            })
            return queries
        },
    },
    watch: {
        selectedKeys: {
            handler() {
                this.syncSelectedSnapshots()
            },
        },
    },
    methods: {
        statusesForKind(kind) {
            const isUnpublish = kind.endsWith('-unpublish')
            const isDelete = kind.endsWith('-delete')
            const isPublish = kind.endsWith('-publish')
            const status = this.filterStatus

            if (status === 'pending') {
                if (isUnpublish) return []
                return ['pending']
            }
            if (status === 'rejected') {
                if (isUnpublish) return []
                return ['rejected']
            }
            if (status === 'approved') {
                if (isDelete) return []
                if (isUnpublish) return ['published']
                if (isPublish && this.filterAction === 'publish') return ['published']
                return []
            }
            if (isUnpublish) return ['published']
            if (isDelete) return ['all']
            if (isPublish && this.filterAction === 'publish') return ['pending', 'rejected', 'published']
            return ['pending', 'rejected']
        },
        rowKind(item) {
            return item?._queueKind || ''
        },
        rowKey(item) {
            return `${this.rowKind(item)}-${item?.id}`
        },
        isEpisodeRow(item) {
            return String(this.rowKind(item)).startsWith('episode-')
        },
        isDeleteRow(item) {
            return String(this.rowKind(item)).endsWith('-delete')
        },
        isUnpublishRow(item) {
            return String(this.rowKind(item)).includes('unpublish')
        },
        requestKindLabel(item) {
            const target = this.isEpisodeRow(item) ? 'اپیزود' : 'دوره'
            let action = 'انتشار'
            if (this.isUnpublishRow(item)) action = 'عدم انتشار'
            else if (this.isDeleteRow(item)) action = 'حذف'
            return `${target} - ${action}`
        },
        rowReviewStatus(item) {
            if (this.isDeleteRow(item)) {
                if (item?.delete_status === 'rejected') return 'rejected'
                if (item?.delete_status === 'pending') return 'pending'
                return 'approved'
            }
            const status = publishStatus(item)
            if (status === 'published') return 'approved'
            if (status === 'rejected') return 'rejected'
            if (status === 'pending') return 'pending'
            return status || 'pending'
        },
        rowStatusLabel(item) {
            switch (this.rowReviewStatus(item)) {
                case 'approved':
                    return 'تایید شده'
                case 'rejected':
                    return 'رد شده'
                default:
                    return 'در انتظار'
            }
        },
        rowBarClass(item) {
            switch (this.rowReviewStatus(item)) {
                case 'approved':
                    return 'bg-emerald-400 dark:bg-emerald-600'
                case 'rejected':
                    return 'bg-rose-400 dark:bg-rose-600'
                default:
                    return 'bg-amber-400 dark:bg-amber-500'
            }
        },
        rowChipClass(item) {
            switch (this.rowReviewStatus(item)) {
                case 'approved':
                    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                case 'rejected':
                    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                default:
                    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            }
        },
        rowLink(item) {
            if (this.isEpisodeRow(item)) {
                return {
                    name: 'admin-episode-details',
                    params: {
                        courseSlug: item.course?.slug,
                        sectionSlug: item.section?.slug,
                        episodeSlug: item.slug,
                    },
                }
            }
            return { name: 'admin-course-details', params: { courseSlug: item.slug } }
        },
        rowPoster(item) {
            return this.isEpisodeRow(item) ? item.course?.poster : item.poster
        },
        rowSubtitle(item) {
            if (this.isEpisodeRow(item)) return item.course?.title || item.english_title || ''
            return item.short_description
        },
        tagRow(item, kind) {
            return {
                ...item,
                _queueKind: kind,
                teacher: item.teacher || item.course?.teacher || null,
            }
        },
        formatDuration(totalTime) {
            if (!totalTime) return '—'
            const raw = new Date(totalTime * 1000).toISOString().slice(11, 19)
            return raw.startsWith('00:') ? raw.slice(3) : raw
        },
        defaultPublishAction(item) {
            if (this.isDeleteRow(item)) {
                return item.delete_status === 'pending' ? 'delete-review' : 'delete-request'
            }
            if (this.isUnpublishRow(item)) {
                return this.$can(COURSE_PUBLISH_APPROVE_PERMS) ? 'unpublish' : null
            }
            const status = publishStatus(item)
            if (status === 'pending') {
                return this.$can(COURSE_PUBLISH_APPROVE_PERMS) ? 'review' : 'cancel'
            }
            if (status === 'published') return this.$can(COURSE_PUBLISH_APPROVE_PERMS) ? 'unpublish' : null
            if (this.$can(COURSE_PUBLISH_APPROVE_PERMS)) return 'publish'
            if (this.$can(COURSE_PUBLISH_REQUEST_PERMS)) return 'request'
            return null
        },
        openQuickPublish(item) {
            const action = this.defaultPublishAction(item)
            if (!action) return
            if (this.isEpisodeRow(item)) {
                this.openPublishModal({ action, course: item.course, episode: item })
                return
            }
            this.openPublishModal({ action, course: item })
        },
        snapshotRow(item) {
            return {
                key: this.rowKey(item),
                kind: this.rowKind(item),
                id: item.id,
                slug: item.slug,
                courseSlug: item.course?.slug || item.slug,
                title: item.title,
                publish_status: item.publish_status,
                delete_status: item.delete_status,
            }
        },
        rowMatchesBulkIntent(row, intent) {
            if (!row || !intent) return false
            const kind = String(row.kind || '')
            if (intent === 'unpublish') {
                return kind.includes('unpublish') || (row.publish_status === 'published' && !kind.endsWith('-delete'))
            }
            if (kind.endsWith('-delete')) return row.delete_status === 'pending'
            if (kind.includes('unpublish')) return false
            return row.publish_status === 'pending'
        },
        itemActionUrl(row, endpoint) {
            if (String(row.kind).endsWith('-delete')) {
                return `admin/course/${row.slug}/delete/${endpoint}`
            }
            if (String(row.kind).startsWith('episode-')) {
                return `admin/course/${row.courseSlug}/episode/${row.slug}/publish/${endpoint}`
            }
            return `admin/course/${row.slug}/publish/${endpoint}`
        },
        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedKeys = [...this.visibleKeys]
                const next = {}
                this.items.forEach((item) => {
                    next[this.rowKey(item)] = this.snapshotRow(item)
                })
                this.selectedSnapshots = next
                return
            }
            this.selectedKeys = []
            this.selectedSnapshots = {}
        },
        clearBulkSelection() {
            this.selectedKeys = []
            this.selectedSnapshots = {}
        },
        syncSelectedSnapshots() {
            const next = {}
            this.selectedKeys.forEach((key) => {
                const item = this.items.find((row) => this.rowKey(row) === key)
                next[key] = item ? this.snapshotRow(item) : this.selectedSnapshots[key]
            })
            this.selectedSnapshots = next
        },
        openBulkSheet(intent) {
            this.bulkIntent = intent
            this.bulkComment = ''
            this.bulkCommentError = ''
            if (!this.bulkEligibleRows.length) {
                showToastError('هیچ مورد واجد شرایطی برای این عملیات انتخاب نشده است.')
                return
            }
            this.showBulkSheet = true
        },
        closeBulkSheet() {
            this.showBulkSheet = false
            this.bulkCommentError = ''
        },
        async executeBulkAction() {
            const rows = this.bulkEligibleRows
            if (!rows.length || this.bulkLoading) return
            const comment = this.bulkComment.trim()
            if (this.bulkIntent === 'reject' && comment.length < 3) {
                this.bulkCommentError = 'لطفاً دلیل را حداقل در ۳ حرف بنویسید.'
                return
            }
            this.bulkLoading = true
            this.bulkCommentError = ''
            let succeeded = 0
            let failed = 0
            const succeededKeys = []
            for (const row of rows) {
                try {
                    await axiosInstance.post(this.itemActionUrl(row, this.bulkIntent), {
                        comment: comment || null,
                    })
                    succeeded += 1
                    succeededKeys.push(row.key)
                } catch {
                    failed += 1
                }
            }
            if (succeeded) {
                showToastSuccess(`${succeeded.toLocaleString('fa-IR')} مورد با موفقیت انجام شد.`)
            }
            if (failed) {
                showToastError(`${failed.toLocaleString('fa-IR')} مورد انجام نشد.`)
            }
            this.selectedKeys = this.selectedKeys.filter((key) => !succeededKeys.includes(key))
            this.syncSelectedSnapshots()
            this.bulkLoading = false
            this.closeBulkSheet()
            useAdminCoursePublishStore().fetchPendingCount()
            this.getData()
        },
        onFilterChange() {
            this.currentPage = 1
            this.updateUrlAndFetchData()
        },
        onPerPageChange() {
            this.currentPage = 1
            this.updateUrlAndFetchData()
        },
        clearSearch() {
            this.searchQuery = ''
            this.onFilterChange()
        },
        clearFilters() {
            this.filterAction = 'all'
            this.filterTarget = 'all'
            this.filterStatus = 'all'
            this.filterSort = 'newest'
            this.searchQuery = ''
            this.currentPage = 1
            this.updateUrlAndFetchData()
        },
        updatePage(value) {
            this.currentPage = value
            this.updateUrlAndFetchData()
        },
        handleSearch() {
            clearTimeout(this._searchTimer)
            this._searchTimer = setTimeout(() => {
                this.currentPage = 1
                this.updateUrlAndFetchData()
            }, 700)
        },
        updateUrlAndFetchData() {
            const params = new URLSearchParams()
            if (this.filterAction !== 'all') params.set('action', this.filterAction)
            if (this.filterTarget !== 'all') params.set('target', this.filterTarget)
            if (this.filterStatus !== 'all') params.set('status', this.filterStatus)
            if (this.filterSort && this.filterSort !== 'newest') params.set('sort', this.filterSort)
            if (this.searchQuery) params.set('search', this.searchQuery)
            if (this.currentPage !== 1) params.set('page', String(this.currentPage))
            const qs = params.toString()
            window.history.pushState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname)
            this.getData()
        },
        emptyPagination() {
            this.items = []
            this.pagination = {
                total: 0,
                per_page: this.perPage,
                current_page: 1,
                last_page: 1,
                prev_page: null,
                next_page: null,
            }
            this.currentPage = 1
        },
        paginateLocally(rows) {
            const total = rows.length
            const lastPage = Math.max(1, Math.ceil(total / this.perPage) || 1)
            const page = Math.min(Math.max(1, this.currentPage), lastPage)
            const start = (page - 1) * this.perPage
            this.items = rows.slice(start, start + this.perPage)
            this.currentPage = page
            this.pagination = {
                total,
                per_page: this.perPage,
                current_page: page,
                last_page: lastPage,
                prev_page: page > 1 ? page - 1 : null,
                next_page: page < lastPage ? page + 1 : null,
            }
        },
        async fetchQueueRows(kind, status, { page = 1, perPage = 500 } = {}) {
            const payload = {
                page,
                perPage,
                sort: this.filterSort,
                search: this.searchQuery || undefined,
            }
            if (kind.endsWith('-delete')) {
                payload.delete_status = status
                const { data } = await axiosInstance.post('admin/course/delete-requests', payload)
                return {
                    rows: (data.courses || []).map((item) => this.tagRow(item, kind)),
                    pagination: data.pagination || {},
                }
            }
            payload.publish_status = status
            if (kind.startsWith('episode-')) {
                const { data } = await axiosInstance.post('admin/course/episode-publish-requests', payload)
                return {
                    rows: (data.episodes || []).map((item) => this.tagRow(item, kind)),
                    pagination: data.pagination || {},
                }
            }
            const { data } = await axiosInstance.post('admin/course/publish-requests', payload)
            return {
                rows: (data.courses || []).map((item) => this.tagRow(item, kind)),
                pagination: data.pagination || {},
            }
        },
        async getData() {
            const queries = this.queueQueries
            this.loading = true
            try {
                if (!queries.length) {
                    this.emptyPagination()
                    return
                }
                if (queries.length === 1) {
                    const { kind, status } = queries[0]
                    const { rows, pagination } = await this.fetchQueueRows(kind, status, {
                        page: this.currentPage,
                        perPage: this.perPage,
                    })
                    this.items = rows
                    this.pagination = pagination || {}
                    this.currentPage = pagination?.current_page || this.currentPage
                    return
                }
                const batches = await Promise.all(
                    queries.map(({ kind, status }) => this.fetchQueueRows(kind, status))
                )
                const seen = new Set()
                const rows = batches.flatMap((batch) => batch.rows).filter((item) => {
                    const key = this.rowKey(item)
                    if (seen.has(key)) return false
                    seen.add(key)
                    return true
                })
                rows.sort((a, b) => {
                    const left = new Date(a.updated_at || a.created_at || 0).getTime()
                    const right = new Date(b.updated_at || b.created_at || 0).getTime()
                    return this.filterSort === 'oldest' ? left - right : right - left
                })
                this.paginateLocally(rows)
            } catch (error) {
                console.error(error)
            } finally {
                this.loading = false
            }
        },
        openPublishModal({ action, course, episode }) {
            if (!action) return
            this.publishEpisode = episode || null
            this.publishCourse = course || episode?.course || null
            this.publishAction = action
            const source = episode || course
            this.reviewKind = this.isDeleteRow(source) || String(action).startsWith('delete')
                ? 'delete'
                : (this.isEpisodeRow(source) || episode ? 'episode' : 'publish')
            this.showPublishModal = true
        },
        onPublishUpdated(payload) {
            if (payload?.deleted) {
                this.items = this.items.filter((row) => row.id !== payload.id && row.slug !== payload.slug)
            } else if (payload) {
                const item = this.items.find((row) => row.id === payload.id || row.slug === payload.slug)
                if (item) applyPublishResponse(item, payload)
            }
            useAdminCoursePublishStore().fetchPendingCount()
            this.getData()
        },
    },
    mounted() {
        document.title = 'درخواست‌های دوره'
        this.getData()
        useAdminCoursePublishStore().fetchPendingCount()
    },
}
</script>
