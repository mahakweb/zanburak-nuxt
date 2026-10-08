<template>
    <div class="space-y-4">
        <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/70 p-4 space-y-4 shadow-sm">
            <div class="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">مدیریت فایل‌های پیوست</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        فایل‌های کمکی دوره را اضافه یا حذف کنید. فرمت‌های مجاز:
                        <span dir="ltr" lang="en" class="font-sans">{{ allowedExtensionsLabel }}</span>
                    </p>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    <label class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-bold bg-yellow-400 text-gray-900 cursor-pointer shadow-sm hover:bg-yellow-300 transition">
                        انتخاب فایل
                        <input
                            ref="fileInput"
                            type="file"
                            multiple
                            :accept="allowedAccept"
                            class="hidden"
                            @change="onFilesSelected"
                        />
                    </label>
                    <button
                        type="button"
                        class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-yellow-400/50 transition disabled:opacity-60"
                        :disabled="loading || uploading"
                        @click="getCourseAttachments">
                        بروزرسانی
                    </button>
                </div>
            </div>

            <p v-if="uploadError && !pendingFiles.length" class="text-xs text-rose-500">{{ uploadError }}</p>

            <div v-if="pendingFiles.length" class="space-y-2">
                <AdminAttachmentCard
                    v-for="item in pendingFiles"
                    :key="item.id"
                    v-model="item.title"
                    :ext="fileExtFromName(item.file.name)"
                    :size-label="formatFileSize(item.file.size)"
                    :status="item.status"
                    :percent="item.percent"
                    :error="item.error"
                    :title-disabled="item.status === 'uploading' || item.status === 'uploaded'"
                    :show-delete="item.status !== 'uploading'"
                    @remove="removePending(item.id)"
                />
                <div class="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-bold bg-yellow-400 text-gray-900 shadow-sm hover:bg-yellow-300 transition disabled:opacity-60"
                        :disabled="uploading || !canUpload"
                        @click="uploadPendingFiles">
                        {{ uploading ? `در حال آپلود ${currentUploadPercent}%` : `آپلود ${pendingFiles.length} فایل` }}
                    </button>
                    <button
                        v-if="uploading"
                        type="button"
                        class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white shadow-sm hover:bg-rose-600 transition"
                        @click="cancelUpload">
                        لغو آپلود
                    </button>
                    <button
                        type="button"
                        class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-gray-900 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition disabled:opacity-60"
                        :disabled="uploading"
                        @click="clearPendingFiles">
                        لغو انتخاب
                    </button>
                </div>
            </div>
        </div>

        <AdminInlineLoading v-if="loading && !attachs.length" />
        <div v-else-if="attachs && attachs.length > 0" class="space-y-2">
            <AdminAttachmentCard
                v-for="attach in attachs"
                :key="attach.id"
                :model-value="attach._editTitle ?? displayTitle(attach)"
                :ext="attachExt(attach)"
                :size-label="formatFileSize(attach.size)"
                :meta="formatDate(attach.created_at)"
                :url="attach.url"
                status="uploaded"
                :saving="savingTitleId === attach.id"
                :removing="removingId === attach.id"
                :can-save="canSaveTitle(attach)"
                :delete-disabled="uploading"
                show-view
                show-save
                show-delete
                @update:model-value="attach._editTitle = $event"
                @save="saveAttachTitle(attach)"
                @remove="openDeleteModal(attach)"
            />
        </div>
        <div v-else class="flex items-center justify-center h-20 text-xs text-gray-500 font-semibold">
            هیچ فایل پیوستی ثبت نشده است
        </div>

        <div v-if="pagination && pagination.last_page > 1"
            class="flex lg:flex-row flex-col items-center justify-between gap-4 mt-2">
            <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
            <select v-model="perPage" @change="selectPerpage(perPage)"
                class="w-max px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none">
                <option v-for="(per, index) in perPages" :key="index" :value="per">{{ per }}</option>
            </select>
        </div>

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
            :backdropClass="bs.ADMIN_BS_BACKDROP">
            <AdminBottomSheetConfirm
                variant="danger"
                :message="deleteConfirmMessage"
                description="این فایل از دوره حذف می‌شود و قابل بازگشت نیست."
                cancel-label="انصراف"
                confirm-label="بله، حذف شود"
                :loading="!!removingId"
                @cancel="closeDeleteModal"
                @confirm="confirmDeleteAttachment"
            />
        </BottomSheetDrawer>
    </div>
</template>
<script>
import axios from "axios";
import axiosInstance from "@/store/axiosInstance";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import AdminAttachmentCard from "@/views/components/admin/AdminAttachmentCard.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBottomSheetConfirm from "@/views/components/admin/bottomSheet/AdminBottomSheetConfirm.vue";
import * as bs from "@/views/components/admin/bottomSheet/adminBottomSheetStyles.js";
import { toast } from "vue3-toastify";
import { getFileExtension } from "@/utils/fileTypeMeta";
import { defaultAttachmentTitle, displayAttachmentTitle, attachmentExtension } from "@/utils/attachmentDisplay";

const ALLOWED_EXTENSIONS = [
    '.pdf', '.txt', '.zip', '.csv', '.png', '.jpg', '.jpeg',
    '.doc', '.docx', '.docm', '.xls', '.xlsx', '.xlsm',
    '.ppt', '.pptx', '.pptm',
];
const ALLOWED_TYPES = [
    'application/pdf',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed',
    'text/csv',
    'image/png',
    'image/jpeg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word.document.macroEnabled.12',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
];
const MAX_SIZE = 200 * 1024 * 1024;

export default {
    components: {
        AdminInlineLoading,
        AdminAttachmentCard,
        PaginationComponent,
        BottomSheetDrawer,
        AdminBottomSheetConfirm,
    },
    props: {
        courseSlug: { type: String, required: true },
        courseId: { type: [Number, String], default: null },
    },
    data() {
        return {
            bs,
            attachs: [],
            resolvedCourseId: this.courseId,
            loading: false,
            uploading: false,
            uploadError: null,
            uploadController: null,
            pendingFiles: [],
            pendingId: 0,
            removingId: null,
            savingTitleId: null,
            showDeleteModal: false,
            attachToDelete: null,
            pagination: {},
            perPage: 20,
            perPages: [10, 20, 30, 50, 100],
            currentPage: 1,
        };
    },
    computed: {
        allowedAccept() {
            return ALLOWED_EXTENSIONS.join(',');
        },
        allowedExtensionsLabel() {
            return ALLOWED_EXTENSIONS.map((ext) => ext.replace('.', '')).join(', ');
        },
        deleteConfirmMessage() {
            const title = this.displayTitle(this.attachToDelete) || 'پیوست';
            return `از حذف فایل «${title}» اطمینان دارید؟`;
        },
        canUpload() {
            return !!(this.pendingFiles.length && (this.resolvedCourseId || this.courseId) && this.courseSlug);
        },
        currentUploadPercent() {
            const current = this.pendingFiles.find((item) => item.status === 'uploading');
            return current ? current.percent : 0;
        },
    },
    watch: {
        courseId(value) {
            if (value) this.resolvedCourseId = value;
        },
    },
    methods: {
        toastOptions() {
            return {
                theme: 'colored',
                hideProgressBar: false,
                rtl: localStorage.getItem('direction') == 'rtl',
                bodyClassName: 'font-YekanBakh',
                toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            };
        },
        displayTitle: displayAttachmentTitle,
        canSaveTitle(item) {
            const next = String(item._editTitle ?? this.displayTitle(item)).trim();
            return next.length > 0 && next !== this.displayTitle(item);
        },
        fileExtFromName(name) {
            return getFileExtension(name || '');
        },
        attachExt(attach) {
            return attachmentExtension(attach);
        },
        truncateUrl(url) {
            if (!url) return '';
            const maxLength = 52;
            if (url.length <= maxLength) return url;
            try {
                const urlObj = new URL(url);
                const start = `${urlObj.protocol}//${urlObj.host}`;
                const fullPath = `${urlObj.pathname}${urlObj.search}`;
                if (fullPath.length <= maxLength - start.length) return url;
                const pathMaxLength = Math.max(12, maxLength - start.length - 3);
                const pathStart = fullPath.substring(0, Math.floor(pathMaxLength / 2));
                const pathEnd = fullPath.substring(fullPath.length - Math.ceil(pathMaxLength / 2));
                return `${start}${pathStart}...${pathEnd}`;
            } catch (e) {
                return `${url.substring(0, 22)}...${url.substring(url.length - 22)}`;
            }
        },
        formatDate(value) {
            if (!value) return '';
            return new Date(value).toLocaleDateString('fa-IR-u-nu-latn', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        },
        formatFileSize(bytes) {
            if (!bytes && bytes !== 0) return '';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 B';
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            const size = Math.round((bytes / Math.pow(k, i)) * 100) / 100;
            return `${size} ${sizes[i]}`;
        },
        isAllowedFile(file) {
            const ext = (file?.name?.split('.').pop() || '').toLowerCase();
            const extWithDot = ext ? `.${ext}` : '';
            return ALLOWED_EXTENSIONS.includes(extWithDot) || (file.type && ALLOWED_TYPES.includes(file.type));
        },
        onFilesSelected(e) {
            const files = Array.from(e.target.files || []);
            this.uploadError = null;
            if (this.$refs.fileInput) this.$refs.fileInput.value = '';
            if (!files.length) return;
            const next = [];
            for (const file of files) {
                if (!this.isAllowedFile(file)) {
                    this.uploadError = `فرمت «${file.name}» مجاز نیست.`;
                    toast.warning(this.uploadError, this.toastOptions());
                    continue;
                }
                if (file.size > MAX_SIZE) {
                    this.uploadError = `حجم «${file.name}» نباید بیشتر از ${this.formatFileSize(MAX_SIZE)} باشد.`;
                    toast.warning(this.uploadError, this.toastOptions());
                    continue;
                }
                next.push({ id: ++this.pendingId, file, title: defaultAttachmentTitle(file.name), status: 'pending', percent: 0, error: null });
            }
            if (next.length) this.pendingFiles = [...this.pendingFiles, ...next];
        },
        clearPendingFiles() {
            this.cancelUpload({ silent: true });
            this.pendingFiles = [];
            this.uploadError = null;
            if (this.$refs.fileInput) this.$refs.fileInput.value = '';
        },
        removePending(id) {
            if (this.uploading) return;
            this.pendingFiles = this.pendingFiles.filter((item) => item.id !== id);
        },
        cancelUpload({ silent = false } = {}) {
            if (this.uploadController) {
                this.uploadController.abort();
                this.uploadController = null;
            }
            if (this.uploading) {
                this.uploading = false;
                this.pendingFiles = this.pendingFiles.map((item) => ({
                    ...item,
                    status: item.status === 'uploading' ? 'pending' : item.status,
                    percent: 0,
                }));
                if (!silent) toast.info('آپلود لغو شد.', this.toastOptions());
            }
        },
        async uploadPendingFiles() {
            if (!this.canUpload || this.uploading) return;
            this.uploading = true;
            this.uploadError = null;
            this.uploadController = new AbortController();
            const courseId = this.resolvedCourseId || this.courseId;
            try {
                for (const item of this.pendingFiles) {
                    if (item.status === 'uploaded') continue;
                    item.status = 'uploading';
                    item.percent = 0;
                    item.error = null;
                    await this.uploadOneFile(item, courseId);
                    item.status = 'uploaded';
                    item.percent = 100;
                }
                toast.success('فایل‌های پیوست با موفقیت آپلود شدند.', this.toastOptions());
                this.pendingFiles = [];
                this.currentPage = 1;
                await this.getCourseAttachments();
            } catch (error) {
                if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED' || axios.isCancel?.(error)) {
                    this.pendingFiles = this.pendingFiles.filter((item) => item.status !== 'uploaded');
                    await this.getCourseAttachments();
                    return;
                }
                const msg = error?.response?.data?.message || error?.message || 'آپلود ناموفق بود';
                this.uploadError = msg;
                this.pendingFiles = this.pendingFiles
                    .map((item) => item.status === 'uploading' ? { ...item, status: 'error', error: msg } : item)
                    .filter((item) => item.status !== 'uploaded');
                await this.getCourseAttachments();
                toast.error(msg, this.toastOptions());
            } finally {
                this.uploading = false;
                this.uploadController = null;
            }
        },
        async uploadOneFile(item, courseId) {
            const file = item.file;
            const initRes = await axiosInstance.post('admin/course/uploadAttachedFile', {
                course_id: courseId,
                filename: file.name,
                mime: file.type || 'application/octet-stream',
                size: file.size,
                title: item.title || file.name,
            });
            const { uploadPath, uploadToken, workerUploadUrl } = initRes.data;
            const formData = new FormData();
            formData.append('path', uploadPath);
            formData.append('file', file);
            await axios.post(workerUploadUrl, formData, {
                timeout: 3600 * 1000,
                headers: { Authorization: `Bearer ${uploadToken}` },
                signal: this.uploadController?.signal,
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    item.percent = total ? Math.round((loaded * 100) / total) : 0;
                },
            });
        },
        async saveAttachTitle(attach) {
            const title = String(attach._editTitle ?? this.displayTitle(attach)).trim();
            const courseId = this.resolvedCourseId || this.courseId;
            if (!attach?.id || !courseId || !title) return;
            this.savingTitleId = attach.id;
            try {
                const res = await axiosInstance.post('admin/course/updateAttachedFile', {
                    course_id: courseId,
                    attach_id: attach.id,
                    title,
                });
                this.attachs = this.attachs.map((row) => row.id === attach.id ? { ...row, ...res.data.attach, _editTitle: undefined } : row);
                toast.success('نام فایل ذخیره شد.', this.toastOptions());
            } catch (error) {
                toast.error(error?.response?.data?.message || 'خطا در ذخیره نام فایل', this.toastOptions());
            } finally {
                this.savingTitleId = null;
            }
        },
        openDeleteModal(attach) {
            if (!attach?.id || this.removingId || this.uploading) return;
            this.attachToDelete = attach;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            if (this.removingId) return;
            this.showDeleteModal = false;
            this.attachToDelete = null;
        },
        async confirmDeleteAttachment() {
            const attach = this.attachToDelete;
            const courseId = this.resolvedCourseId || this.courseId;
            if (!attach?.id || !courseId || this.removingId) return;
            this.removingId = attach.id;
            try {
                await axiosInstance.post('admin/course/removeFile', {
                    course_id: courseId,
                    file_type: 'attached_file',
                    attach_id: attach.id,
                });
                this.attachs = this.attachs.filter((item) => item.id !== attach.id);
                this.showDeleteModal = false;
                this.attachToDelete = null;
                toast.success('فایل پیوست حذف شد.', this.toastOptions());
            } catch (error) {
                toast.error(error?.response?.data?.message || 'خطا در حذف فایل پیوست', this.toastOptions());
            } finally {
                this.removingId = null;
            }
        },
        selectPerpage(value) {
            this.perPage = value;
            this.currentPage = 1;
            this.getCourseAttachments();
        },
        updatePage(page) {
            this.currentPage = page;
            this.getCourseAttachments();
        },
        async getCourseAttachments() {
            this.loading = true;
            try {
                const response = await axiosInstance.post(`admin/course/${this.courseSlug}/details`, {
                    data_type: 'attachments',
                    page: this.currentPage,
                    perPage: this.perPage,
                });
                this.attachs = response.data.attachs || [];
                this.pagination = response.data.pagination || {};
                if (response.data.course?.id) this.resolvedCourseId = response.data.course.id;
            } catch (error) {
                console.error('Error fetching course attachments:', error);
                this.attachs = [];
                this.pagination = {};
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
        this.getCourseAttachments();
    },
}
</script>
<style></style>
