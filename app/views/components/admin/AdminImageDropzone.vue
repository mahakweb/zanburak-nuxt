<template>
    <div>
        <label :for="inputId"
            class="flex items-center justify-between mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
            {{ label }}
            <span v-if="uploading" class="text-xs font-medium text-amber-600 dark:text-amber-400">در حال آپلود...</span>
        </label>
        <div class="flex items-center justify-center w-full">
            <label :for="inputId"
                class="relative border-2 group flex flex-col items-center justify-center w-full h-48 rounded-lg cursor-pointer transition overflow-hidden"
                :class="[
                    error ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700',
                    hasPreview
                        ? 'p-0'
                        : 'bg-gray-50 dark:bg-gray-700 border-dashed hover:bg-gray-100 dark:hover:bg-gray-600',
                ]"
                @dragover.prevent
                @drop.prevent="onDrop">
                <div v-if="!hasPreview" class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M20,3 C21.1046,3 22,3.89543 22,5 L22,19 C22,20.1046 21.1046,21 20,21 L4,21 C2.89543,21 2,20.1046 2,19 L2,5 C2,3.89543 2.89543,3 4,3 L20,3 Z M20,5 L4,5 L4,15.1005 L8.9948,10.1057 C9.48296,9.61757 10.2744,9.61757 10.7626,10.1057 L14.8284,14.1716 L16.0659,12.9342 C16.554,12.446 17.3455,12.446 17.8336,12.9342 L20,15.1005 L20,5 Z M15.5,7 C16.3284,7 17,7.67157 17,8.5 C17,9.32843 16.3284,10 15.5,10 C14.6716,10 14,9.32843 14,8.5 C14,7.67157 14.6716,7 15.5,7 Z"
                            fill="currentColor" />
                    </svg>
                    <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        <span class="font-semibold">کلیک برای انتخاب</span> یا کشیدن و رها کردن
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ acceptLabel }} (حداکثر {{ maxSizeLabel }})
                    </p>
                </div>
                <div v-else class="absolute inset-0">
                    <img onerror="this.style.display='none'" :src="previewUrl" class="w-full h-full object-cover" alt="" />
                    <button type="button" title="تغییر تصویر"
                        class="z-10 absolute top-2 start-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 text-xs font-semibold px-2 py-[3px] rounded-lg shadow hover:bg-opacity-100 dark:hover:bg-opacity-100 flex items-center"
                        @click.stop="openPicker">
                        <svg class="w-5 h-5 me-1.5" viewBox="0 0 512 512" fill="currentColor">
                            <path
                                d="M307.81,212.18c-3.24,0-6.07-2.17-6.91-5.3l-4.82-17.88c-0.84-3.12-3.68-5.3-6.91-5.3h-21.46h-25.44H220.8 c-3.24,0-6.07,2.17-6.91,5.3l-4.82,17.88c-0.84,3.12-3.68,5.3-6.91,5.3H169.5c-3.96,0-7.16,3.21-7.16,7.16v101.78 c0,3.96,3.21,7.16,7.16,7.16h170.95c3.96,0,7.16-3.21,7.16-7.16V219.35c0-3.96-3.21-7.16-7.16-7.16H307.81z M282.33,264.94 c-0.86,13.64-11.93,24.71-25.58,25.58c-16.54,1.05-30.18-12.59-29.14-29.14c0.86-13.64,11.93-24.71,25.58-25.58 C269.74,234.76,283.38,248.4,282.33,264.94z" />
                        </svg>
                        تغییر
                    </button>
                    <div class="z-10 absolute top-2 end-2">
                        <button type="button" title="حذف" @click.prevent="onRemove"
                            class="w-6 h-6 shadow rounded-lg bg-rose-500 text-white flex items-center justify-center">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L20.2286 5.50879C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z"
                                    fill="currentColor" />
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12404C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001Z"
                                    fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                    <div v-if="fileMeta.name"
                        class="absolute start-0 bottom-2 me-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 text-xs font-semibold px-2 py-1 rounded-e-lg shadow flex items-center">
                        <div dir="ltr" class="flex flex-col items-center font-sans shrink-0 text-start">
                            <span>size:</span>
                            <span>{{ fileMeta.size }}</span>
                        </div>
                        <div class="mx-2">|</div>
                        <div dir="ltr" class="flex flex-col items-center font-sans shrink-0 text-start max-w-[8rem]">
                            <span>name:</span>
                            <span class="line-clamp-1">{{ fileMeta.name }}</span>
                        </div>
                    </div>
                </div>
                <input :id="inputId" ref="fileInput" type="file" :accept="accept.join(',')" class="hidden"
                    @change="onSelect" />
                <div v-if="uploading"
                    class="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <div class="px-3 py-1.5 rounded-lg bg-white/90 dark:bg-gray-900/90 text-xs font-semibold text-gray-800 dark:text-gray-100">
                        در حال آپلود تصویر...
                    </div>
                </div>
            </label>
        </div>
        <span v-if="error" class="mt-1 text-rose-500 text-xs font-medium block">{{ error }}</span>
        <p v-if="hint" class="text-xs text-gray-400 mt-1">{{ hint }}</p>
    </div>
</template>

<script>
import { formatFileSize } from '@/utils/formatFileSize';
import { showToastError } from '@/utils/toastConfig';

let dropzoneId = 0;

export default {
    props: {
        modelValue: { type: File, default: null },
        existingUrl: { type: String, default: '' },
        label: { type: String, default: 'تصویر' },
        hint: { type: String, default: '' },
        error: { type: String, default: '' },
        uploading: { type: Boolean, default: false },
        maxSize: { type: Number, default: 5 * 1024 * 1024 },
        accept: {
            type: Array,
            default: () => ['image/jpeg', 'image/png', 'image/webp'],
        },
    },
    emits: ['update:modelValue', 'remove-existing'],
    data() {
        dropzoneId += 1;
        return {
            inputId: `admin-image-dropzone-${dropzoneId}`,
            localPreview: '',
            fileMeta: { name: '', size: '' },
            existingHidden: false,
        };
    },
    computed: {
        acceptLabel() {
            return this.accept.map((t) => t.replace('image/', '').toUpperCase()).join(', ');
        },
        maxSizeLabel() {
            return formatFileSize(this.maxSize, 0, 'fa');
        },
        previewUrl() {
            if (this.localPreview) return this.localPreview;
            if (!this.existingHidden && this.existingUrl) return this.existingUrl;
            return '';
        },
        hasPreview() {
            return !!this.previewUrl;
        },
    },
    watch: {
        modelValue(file) {
            if (!file) {
                this.revokeLocalPreview();
                this.fileMeta = { name: '', size: '' };
            }
        },
        existingUrl() {
            this.existingHidden = false;
        },
    },
    beforeUnmount() {
        this.revokeLocalPreview();
    },
    methods: {
        openPicker() {
            this.$refs.fileInput?.click();
        },
        revokeLocalPreview() {
            if (this.localPreview) {
                URL.revokeObjectURL(this.localPreview);
                this.localPreview = '';
            }
        },
        validate(file) {
            if (!this.accept.includes(file.type)) {
                showToastError(`فرمت مجاز: ${this.acceptLabel}`);
                return false;
            }
            if (file.size > this.maxSize) {
                showToastError(`حداکثر حجم ${this.maxSizeLabel} است`);
                return false;
            }
            return true;
        },
        applyFile(file) {
            if (!this.validate(file)) return;
            this.revokeLocalPreview();
            this.existingHidden = true;
            this.localPreview = URL.createObjectURL(file);
            this.fileMeta = {
                name: file.name,
                size: formatFileSize(file.size),
            };
            this.$emit('update:modelValue', file);
        },
        onSelect(e) {
            const file = e.target.files?.[0];
            if (file) this.applyFile(file);
            e.target.value = '';
        },
        onDrop(e) {
            const file = e.dataTransfer?.files?.[0];
            if (file) this.applyFile(file);
        },
        onRemove() {
            if (this.modelValue) {
                this.$emit('update:modelValue', null);
                this.revokeLocalPreview();
                this.fileMeta = { name: '', size: '' };
                if (this.existingUrl) {
                    this.existingHidden = false;
                }
                return;
            }
            this.existingHidden = true;
            this.$emit('remove-existing');
        },
    },
};
</script>
