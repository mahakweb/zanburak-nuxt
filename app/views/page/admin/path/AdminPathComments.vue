<template>
    <div>
        <AdminTabPanelToolbar>
            <AdminFilterSelect v-model="filters.status" label="وضعیت نظر" :options="statusOptions" @change="onFilterChange" />
            <AdminFilterSelect v-model="filters.sort" label="مرتب‌سازی" :options="sortOptions" @change="onFilterChange" />
        </AdminTabPanelToolbar>

        <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
            <label v-if="!loading && comments.length" class="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                انتخاب همه
            </label>
            <div v-else class="flex-1"></div>
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-4 h-1 rounded bg-amber-400 dark:bg-amber-500"></div>
                    <span class="text-xs font-medium text-gray-400">در انتظار بررسی</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-4 h-1 rounded bg-green-400 dark:bg-green-600"></div>
                    <span class="text-xs font-medium text-gray-400">تایید شده</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-4 h-1 rounded bg-rose-400 dark:bg-rose-600"></div>
                    <span class="text-xs font-medium text-gray-400">رد شده</span>
                </div>
            </div>
        </div>

        <AdminBulkActionBar :count="selectedIds.length">
            <button type="button" :disabled="bulkLoading" @click="executeBulkAction('approve')"
                class="h-8 px-3 text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 disabled:opacity-50">
                تایید
            </button>
            <button type="button" :disabled="bulkLoading" @click="executeBulkAction('reject')"
                class="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 disabled:opacity-50">
                رد
            </button>
            <button type="button" :disabled="bulkLoading" @click="executeBulkAction('pending')"
                class="h-8 px-3 text-xs font-semibold text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 disabled:opacity-50">
                در انتظار بررسی
            </button>
            <button type="button" :disabled="bulkLoading" @click="executeBulkAction('delete')"
                class="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 disabled:opacity-50">
                حذف
            </button>
            <button type="button" @click="clearBulkSelection"
                class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                لغو انتخاب
            </button>
        </AdminBulkActionBar>

        <AdminInlineLoading v-if="loading" />

        <div v-else id="path-comments-list">
            <div v-if="comments.length" class="overflow-x-auto md:custom-scrollbar">
                <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                    <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <tr class="text-xs font-semibold text-start">
                            <th class="px-1 py-3 w-10"></th>
                            <th class="px-1 py-3 whitespace-nowrap text-start">کاربر</th>
                            <th class="px-1 py-3 whitespace-nowrap text-start">پیش‌نمایش کامنت</th>
                            <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت</th>
                            <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ ارسال</th>
                            <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <tr v-for="item in comments" :key="item.id" class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                            <td class="relative ps-2 pe-2 py-3 text-center" @click.stop>
                                <div class="absolute start-0 top-[25%] w-1 h-[50%] rounded-e-lg" :class="commentStatusBarClass(item)"></div>
                                <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                            </td>
                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                <router-link v-if="item.user" :to="{ name: 'admin-user-details', params: { username: item.user.username } }" class="flex items-center gap-2 hover:opacity-80">
                                    <img v-if="item.user.profile_pic" :src="item.user.profile_pic" class="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" alt="" onerror="this.style.display='none'" />
                                    <div>
                                        <div class="text-xs font-semibold">{{ item.user.first_name }} {{ item.user.last_name }}</div>
                                        <div class="text-[11px] text-gray-400" dir="ltr">@{{ item.user.username }}</div>
                                    </div>
                                </router-link>
                                <span v-else class="text-xs text-gray-400">کاربر حذف شده</span>
                            </td>
                            <td class="px-1 py-3 text-start">
                                <AdminCommentPreview :text="item.comment" wide @open="openPreview(item)" />
                            </td>
                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                <CommentStatusBadge :comment="item" />
                            </td>
                            <td class="px-1 py-3 whitespace-nowrap text-start">
                                <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg" dir="ltr">
                                    {{ formatDateTime(item.created_at) }}
                                </span>
                            </td>
                            <td class="px-1 py-3 text-center">
                                <AdminCommentRowActions
                                    :item="item"
                                    :approving="!!loadingComments[item.id]"
                                    :deleting="!!deleteLoading[item.id]"
                                    @view="openPreview"
                                    @edit="openPreview"
                                    @reply="openPreview"
                                    @set-status="setCommentStatus"
                                    @delete="openDeleteModal"
                                />
                            </td>
                        </tr>
                        <tr class="h-8"></tr>
                    </tbody>
                </table>
            </div>
            <p v-else class="py-10 text-center text-sm text-gray-400">کامنتی برای این مسیر ثبت نشده است.</p>

            <div v-if="comments.length" class="flex lg:flex-row flex-col items-center justify-between gap-4 mt-4">
                <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
            </div>
        </div>

        <BottomSheetDrawer
            v-model="showPreview"
            :initialHeight="0.55"
            :maxHeight="0.9"
            :minHeight="0.4"
            :autoCloseOnMin="true"
            :closeOnBackdrop="true"
            :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[36rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'"
        >
            <div v-if="previewComment" class="space-y-3">
                <div class="text-sm font-bold text-gray-800 dark:text-gray-100">مشاهده کامنت</div>
                <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-sm text-gray-600 dark:text-gray-300 leading-7">
                    <MarkdownRenderer startClass="rendered-content" :source="previewComment.comment" />
                </div>
            </div>
        </BottomSheetDrawer>

        <BottomSheetDrawer
            v-model="showDeleteModal"
            :initialHeight="0.4"
            :maxHeight="0.6"
            :minHeight="0.4"
            :autoCloseOnMin="true"
            :closeOnBackdrop="true"
            :lockScroll="true"
            :panelClass="bs.ADMIN_BS_PANEL_SM"
            :contentClass="bs.ADMIN_BS_CONTENT"
            :backdropClass="bs.ADMIN_BS_BACKDROP"
        >
            <AdminBottomSheetHeader title="حذف کامنت" subtitle="این عملیات قابل بازگشت نیست" accent="rose" @close="showDeleteModal = false">
                <template #icon>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </template>
            </AdminBottomSheetHeader>
            <AdminBottomSheetConfirm
                message="از حذف این کامنت اطمینان کامل دارید؟"
                description="این کامنت به‌طور کامل حذف می‌شود و قابل بازیابی نیست."
                :loading="!!(commentForDelete && deleteLoading[commentForDelete.id])"
                @cancel="showDeleteModal = false"
                @confirm="executeSingleDelete(commentForDelete)"
            />
        </BottomSheetDrawer>
    </div>
</template>

<script>
import AdminTabPanelToolbar from "@/views/components/admin/AdminTabPanelToolbar.vue";
import AdminFilterSelect from "@/views/components/admin/AdminFilterSelect.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import AdminCommentPreview from "@/views/components/admin/comment/AdminCommentPreview.vue";
import AdminCommentRowActions from "@/views/components/admin/comment/AdminCommentRowActions.vue";
import CommentStatusBadge from "@/views/components/comment/CommentStatusBadge.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetConfirm from "@/views/components/admin/bottomSheet/AdminBottomSheetConfirm.vue";
import * as adminBottomSheetStyles from "@/views/components/admin/bottomSheet/adminBottomSheetStyles";
import axiosInstance from "@/store/axiosInstance";
import commentModerationMixin from "@/utils/commentModerationMixin";
import { commentStatusBarClass, commentStatusFilterOptions } from "@/utils/commentStatus";
import { showToastError, showToastSuccess } from "@/utils/toastConfig";
import { useAdminCommentsStore } from "@/stores/adminComments";

export default {
    setup() { return { adminCommentsStore: useAdminCommentsStore() } },
    mixins: [commentModerationMixin],
    components: {
        AdminTabPanelToolbar,
        AdminFilterSelect,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        AdminInlineLoading,
        AdminCommentPreview,
        AdminCommentRowActions,
        CommentStatusBadge,
        PaginationComponent,
        MarkdownRenderer,
        BottomSheetDrawer,
        AdminBottomSheetHeader,
        AdminBottomSheetConfirm,
    },
    props: {
        pathId: { type: [Number, String], required: true },
    },
    emits: ["pending-count"],
    data() {
        return {
            loading: false,
            bulkLoading: false,
            comments: [],
            pagination: {},
            currentPage: 1,
            perPage: 10,
            selectedIds: [],
            loadingComments: {},
            deleteLoading: {},
            filters: {
                status: "all",
                sort: "newest",
            },
            showPreview: false,
            previewComment: null,
            showDeleteModal: false,
            commentForDelete: null,
            bs: adminBottomSheetStyles,
        };
    },
    computed: {
        statusOptions() {
            return commentStatusFilterOptions().map((item) => ({ value: item.slug, label: item.title }));
        },
        sortOptions() {
            return [
                { value: "newest", label: "جدیدترین" },
                { value: "oldest", label: "قدیمی‌ترین" },
            ];
        },
        visibleCommentIds() {
            return this.comments.map((item) => item.id);
        },
        isAllSelected() {
            return this.visibleCommentIds.length > 0 && this.visibleCommentIds.every((id) => this.selectedIds.includes(id));
        },
        isIndeterminate() {
            const selectedOnPage = this.visibleCommentIds.filter((id) => this.selectedIds.includes(id)).length;
            return selectedOnPage > 0 && selectedOnPage < this.visibleCommentIds.length;
        },
    },
    created() {
        this.getComments();
        this.fetchPendingCount();
    },
    methods: {
        commentStatusBarClass,
        formatDateTime(value) {
            if (!value) return "—";
            return new Date(value).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        },
        onFilterChange() {
            this.currentPage = 1;
            this.getComments();
        },
        updatePage(page) {
            this.currentPage = page;
            this.getComments();
        },
        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedIds = [...new Set([...this.selectedIds, ...this.visibleCommentIds])];
            } else {
                this.selectedIds = this.selectedIds.filter((id) => !this.visibleCommentIds.includes(id));
            }
        },
        clearBulkSelection() {
            this.selectedIds = [];
        },
        buildParams() {
            const params = {
                page: this.currentPage,
                perPage: this.perPage,
                filter: "path",
                commentable_id: this.pathId,
                sort: this.filters.sort,
                viewMode: "table",
            };
            if (this.filters.status !== "all") params.status = this.filters.status;
            return params;
        },
        async getComments() {
            if (!this.pathId) return;
            this.loading = true;
            try {
                const { data } = await axiosInstance.post("admin/comments", this.buildParams());
                this.comments = data.comments || [];
                this.pagination = data.pagination || {};
                this.selectedIds = this.selectedIds.filter((id) => this.comments.some((item) => item.id === id));
            } catch (error) {
                console.error(error);
                showToastError("بارگذاری کامنت‌های مسیر ناموفق بود.");
            } finally {
                this.loading = false;
            }
        },
        async fetchPendingCount() {
            if (!this.pathId) return;
            try {
                const { data } = await axiosInstance.post("admin/comments", {
                    page: 1,
                    perPage: 1,
                    filter: "path",
                    commentable_id: this.pathId,
                    status: "pending",
                    viewMode: "table",
                });
                this.$emit("pending-count", data.pagination?.total || 0);
            } catch {
                this.$emit("pending-count", 0);
            }
        },
        async executeBulkAction(action) {
            if (!this.selectedIds.length || this.bulkLoading) return;
            this.bulkLoading = true;
            try {
                const { data } = await axiosInstance.post("/admin/comments/bulk", {
                    ids: this.selectedIds,
                    action,
                });
                showToastSuccess(`${Number(data?.affected ?? this.selectedIds.length).toLocaleString("fa-IR")} مورد پردازش شد`);
                this.clearBulkSelection();
                await this.getComments();
                await this.fetchPendingCount();
            } catch (error) {
                showToastError(error.response?.data?.message || "خطا در عملیات گروهی");
            } finally {
                this.bulkLoading = false;
            }
        },
        openPreview(comment) {
            this.previewComment = comment;
            this.showPreview = true;
        },
        openDeleteModal(comment) {
            this.commentForDelete = comment;
            this.showDeleteModal = true;
        },
        async executeSingleDelete(comment) {
            if (!comment?.id) return;
            this.deleteLoading[comment.id] = true;
            try {
                await axiosInstance.post("admin/comments/delete", { comment_id: comment.id });
                showToastSuccess("کامنت با موفقیت حذف شد.");
                this.showDeleteModal = false;
                this.commentForDelete = null;
                this.getComments();
                this.fetchPendingCount();
            } catch {
                showToastError("حذف کامنت با خطا مواجه شد.");
            } finally {
                this.deleteLoading[comment.id] = false;
            }
        },
    },
};
</script>
