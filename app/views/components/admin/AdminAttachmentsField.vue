<template>
    <div class="space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
            <div class="min-w-0">
                <div class="flex items-center gap-2">
                    <h4 class="text-xs font-bold text-gray-900 dark:text-gray-200">{{ title }}</h4>
                    <MediaStatusBadge v-if="overallStatus !== 'idle'" :status="overallStatus" :percent="overallPercent" />
                </div>
                <p v-if="hint" class="text-[11px] text-gray-400 mt-1 leading-5">{{ hint }}</p>
            </div>
            <label
                class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-yellow-400 text-gray-900 cursor-pointer shadow-sm hover:bg-yellow-300 transition"
                :class="{ 'pointer-events-none opacity-60': uploading }"
            >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
                </svg>
                انتخاب فایل‌ها
                <input
                    ref="fileInput"
                    type="file"
                    multiple
                    :accept="accept"
                    class="hidden"
                    :disabled="uploading"
                    @change="onFilesSelected"
                />
            </label>
        </div>

        <p v-if="localError" class="text-xs text-rose-500">{{ localError }}</p>

        <div v-if="existingFiles.length" class="space-y-2">
            <AdminAttachmentCard
                v-for="item in existingFiles"
                :key="'ex-' + item.id"
                :model-value="item._editTitle ?? displayTitle(item)"
                :ext="extOf(item)"
                :size-label="formatSize(item.size)"
                :url="item.url"
                status="uploaded"
                :saving="savingTitleId === item.id"
                :removing="removingId === item.id"
                :can-save="canSaveTitle(item)"
                :delete-disabled="uploading"
                show-view
                show-save
                show-delete
                @update:model-value="item._editTitle = $event"
                @save="$emit('update-existing-title', item, (item._editTitle ?? displayTitle(item)).trim())"
                @remove="$emit('remove-existing', item)"
            />
        </div>

        <div v-if="pendingFiles.length" class="space-y-2">
            <AdminAttachmentCard
                v-for="item in pendingFiles"
                :key="item.id"
                v-model="item.title"
                :ext="fileExtFromName(item.file.name)"
                :size-label="formatSize(item.file.size)"
                :status="item.status"
                :percent="item.percent"
                :error="item.error"
                :title-disabled="item.status === 'uploading' || item.status === 'uploaded'"
                :show-delete="item.status !== 'uploading' && item.status !== 'uploaded'"
                @remove="removePending(item.id)"
            />
        </div>

        <div v-else-if="!existingFiles.length" class="rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 px-3 py-6 text-center text-[11px] text-gray-400">
            هنوز فایلی انتخاب نشده. می‌توانید چند فایل را با هم انتخاب کنید.
        </div>
    </div>
</template>

<script>
import AdminAttachmentCard from '@/views/components/admin/AdminAttachmentCard.vue';
import MediaStatusBadge from '@/views/components/admin/MediaStatusBadge.vue';
import { getFileExtension } from '@/utils/fileTypeMeta';
import { defaultAttachmentTitle, displayAttachmentTitle, attachmentExtension } from '@/utils/attachmentDisplay';

export default {
    name: 'AdminAttachmentsField',
    components: { AdminAttachmentCard, MediaStatusBadge },
    props: {
        title: { type: String, default: 'فایل پیوست (PDF، ZIP و...)' },
        hint: { type: String, default: '' },
        accept: { type: String, default: '' },
        allowedExtensions: { type: Array, default: () => [] },
        allowedTypes: { type: Array, default: () => [] },
        maxSize: { type: Number, default: 200 * 1024 * 1024 },
        existingFiles: { type: Array, default: () => [] },
        uploading: { type: Boolean, default: false },
        savingTitleId: { type: [Number, String], default: null },
        removingId: { type: [Number, String], default: null },
    },
    emits: ['remove-existing', 'update-existing-title', 'change'],
    data() {
        return {
            pendingFiles: [],
            pendingId: 0,
            localError: null,
        };
    },
    computed: {
        overallStatus() {
            if (this.pendingFiles.some((item) => item.status === 'uploading')) return 'uploading';
            if (this.pendingFiles.some((item) => item.status === 'error')) return 'error';
            if (this.pendingFiles.some((item) => item.status === 'pending')) return 'pending';
            if (this.pendingFiles.length && this.pendingFiles.every((item) => item.status === 'uploaded')) return 'uploaded';
            if (this.existingFiles.length) return 'uploaded';
            return 'idle';
        },
        overallPercent() {
            const current = this.pendingFiles.find((item) => item.status === 'uploading');
            return current ? current.percent : null;
        },
    },
    methods: {
        displayTitle: displayAttachmentTitle,
        fileExtFromName(name) {
            return getFileExtension(name || '');
        },
        extOf(item) {
            return attachmentExtension(item);
        },
        formatSize(bytes) {
            if (!bytes && bytes !== 0) return '';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 B';
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
        },
        canSaveTitle(item) {
            const next = String(item._editTitle ?? this.displayTitle(item)).trim();
            return next.length > 0 && next !== this.displayTitle(item);
        },
        isAllowed(file) {
            const ext = (file?.name?.split('.').pop() || '').toLowerCase();
            const extWithDot = ext ? `.${ext}` : '';
            const byExt = !this.allowedExtensions.length || this.allowedExtensions.includes(extWithDot);
            const byType = !this.allowedTypes.length || (file.type && this.allowedTypes.includes(file.type));
            return byExt || byType;
        },
        onFilesSelected(e) {
            const files = Array.from(e.target.files || []);
            this.localError = null;
            if (this.$refs.fileInput) this.$refs.fileInput.value = '';
            if (!files.length) return;
            const next = [];
            for (const file of files) {
                if (!this.isAllowed(file)) {
                    this.localError = `فرمت «${file.name}» مجاز نیست.`;
                    continue;
                }
                if (file.size > this.maxSize) {
                    this.localError = `حجم «${file.name}» بیشتر از حد مجاز است.`;
                    continue;
                }
                next.push({
                    id: ++this.pendingId,
                    file,
                    title: defaultAttachmentTitle(file.name),
                    status: 'pending',
                    percent: 0,
                    error: null,
                });
            }
            if (next.length) {
                this.pendingFiles = [...this.pendingFiles, ...next];
                this.$emit('change', this.pendingFiles);
            }
        },
        removePending(id) {
            this.pendingFiles = this.pendingFiles.filter((item) => item.id !== id);
            this.$emit('change', this.pendingFiles);
        },
        clearUploaded() {
            this.pendingFiles = this.pendingFiles.filter((item) => item.status !== 'uploaded');
        },
        reset() {
            this.pendingFiles = [];
            this.localError = null;
            if (this.$refs.fileInput) this.$refs.fileInput.value = '';
        },
        pendingForUpload() {
            return this.pendingFiles.filter((item) => item.status !== 'uploaded');
        },
        async uploadAll(uploader) {
            const queue = this.pendingForUpload();
            for (const item of queue) {
                item.status = 'uploading';
                item.percent = 0;
                item.error = null;
                try {
                    await uploader(item, (percent) => {
                        item.percent = percent;
                    });
                    item.status = 'uploaded';
                    item.percent = 100;
                } catch (error) {
                    item.status = 'error';
                    item.error = error?.response?.data?.message || error?.message || 'آپلود ناموفق بود';
                    throw error;
                }
            }
            this.clearUploaded();
        },
    },
};
</script>
