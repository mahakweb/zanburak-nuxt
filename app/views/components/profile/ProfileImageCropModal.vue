<template>
    <BottomSheetDrawer
        v-model="isOpen"
        :initial-height="0.88"
        :max-height="0.95"
        :min-height="0.7"
        :close-on-backdrop="!uploading"
        :draggable="!uploading"
        :auto-close-on-min="!uploading"
        :lock-scroll="true"
        backdrop-z-class="z-[2000000010]"
        panel-z-class="z-[2000000020]"
        panel-class="bg-white dark:bg-gray-900 border-t border-gray-200/70 dark:border-gray-700/70 lg:w-[40rem] rounded-t-2xl md:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]"
        content-class="px-4 pb-5 overflow-y-auto custom-scrollbar"
        backdrop-class="bg-black/50 backdrop-blur-sm"
        @close="onSheetClose"
    >
        <div class="flex items-center justify-between mb-3 shrink-0">
            <div class="min-w-0 pe-3">
                <h3 class="text-base font-bold text-gray-800 dark:text-white truncate">
                    {{ cropType === 'profile' ? $t('profile.account.cropTitleProfile') : $t('profile.account.cropTitleCover') }}
                </h3>
                <p class="text-xs text-gray-400 mt-0.5">{{ $t('profile.account.cropHint') }}</p>
            </div>
            <button
                type="button"
                :disabled="uploading"
                class="shrink-0 w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                @click="close"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div v-if="!uploading">
            <div
                ref="cropperWrap"
                class="profile-cropper-wrap h-[min(42vh,360px)] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-950"
                :class="{
                    'profile-cropper-round': cropType === 'profile',
                    'profile-cropper-transparent-bg': preserveTransparency,
                }"
            >
                <vue-cropper
                    v-if="imageSrc"
                    ref="cropper"
                    :key="cropperKey"
                    :src="imageSrc"
                    :aspect-ratio="cropConfig.aspectRatio"
                    :view-mode="1"
                    :drag-mode="'move'"
                    :auto-crop-area="0.9"
                    :background="false"
                    :responsive="true"
                    :restore="false"
                    :guides="true"
                    :center="true"
                    :highlight="true"
                    :crop-box-movable="true"
                    :crop-box-resizable="true"
                    :toggle-drag-mode-on-dblclick="false"
                    :ready="onCropperReady"
                    :container-style="{ width: '100%', height: '100%' }"
                    :img-style="{ display: 'block', maxWidth: '100%' }"
                />
            </div>

            <div class="crop-editor-toolbar mt-4 space-y-3">
                <!-- Filters -->
                <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-950/50 p-3">
                    <div class="flex items-center justify-between gap-2 mb-2.5">
                        <p class="text-xs font-bold text-gray-600 dark:text-gray-300">{{ $t('profile.account.cropFilters') }}</p>
                        <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500">{{ $t('profile.account.cropFiltersHint') }}</span>
                    </div>
                    <div class="filter-scroll scrollbar-hide -mx-1 px-1 pb-0.5">
                        <div class="flex gap-2.5 min-w-max">
                            <button
                                v-for="filter in imageFilters"
                                :key="filter.id"
                                type="button"
                                class="filter-chip"
                                :class="{ 'filter-chip-active': activeFilterId === filter.id }"
                                @click="setFilter(filter.id)"
                            >
                                <span class="filter-chip-preview-wrap">
                                    <span
                                        class="filter-chip-preview"
                                        :style="{
                                            backgroundImage: imageSrc ? `url(${imageSrc})` : 'none',
                                            filter: filter.css,
                                        }"
                                    ></span>
                                </span>
                                <span class="filter-chip-label">{{ $t(filter.labelKey) }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Crop tools -->
                <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-950/50 p-2.5">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 flex-1 justify-center">
                            <button type="button" class="crop-tool-btn" :title="$t('profile.account.cropZoomOut')" @click="zoom(-0.1)">
                                <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                </svg>
                            </button>
                            <button type="button" class="crop-tool-btn" :title="$t('profile.account.cropZoomIn')" @click="zoom(0.1)">
                                <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        <span class="crop-tool-divider" aria-hidden="true"></span>

                        <div class="flex items-center gap-1.5 flex-1 justify-center">
                            <button type="button" class="crop-tool-btn" :title="$t('profile.account.cropRotate')" @click="rotate">
                                <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                            <button type="button" class="crop-tool-btn crop-tool-btn-reset" :title="$t('profile.account.cropReset')" @click="resetAll">
                                <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="crop-editor-actions flex items-stretch gap-2.5 pt-1">
                    <button
                        type="button"
                        class="crop-action-btn crop-action-btn-secondary flex-1"
                        @click="close"
                    >
                        {{ $t('profile.common.cancel') }}
                    </button>
                    <button
                        type="button"
                        :disabled="!imageSrc"
                        class="crop-action-btn crop-action-btn-primary flex-[1.4]"
                        @click="confirmCrop"
                    >
                        {{ $t('profile.account.cropConfirm') }}
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-10 min-h-[280px]">
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">{{ $t('profile.account.uploading') }}</p>
            <div class="w-full max-w-sm" dir="ltr">
                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>{{ uploadPercentage }}%</span>
                </div>
                <div class="flex w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" role="progressbar" :aria-valuenow="uploadPercentage" aria-valuemin="0" aria-valuemax="100">
                    <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="uploadPercentage === 100 ? 'bg-green-500' : 'bg-amber-400'"
                        :style="{ width: uploadPercentage + '%' }"
                    ></div>
                </div>
            </div>
        </div>
    </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { defineAsyncComponent } from 'vue'
const VueCropper = import.meta.client
  ? defineAsyncComponent(async () => {
      await import('cropperjs/dist/cropper.css')
      return (await import('vue-cropperjs')).default
    })
  : { name: 'VueCropperStub', render() { return null } }

import "cropperjs/dist/cropper.css";

const CROP_CONFIGS = {
    profile: {
        aspectRatio: 1,
        outputWidth: 512,
        outputHeight: 512,
        fileBaseName: "profile",
    },
    cover: {
        aspectRatio: 4,
        outputWidth: 1600,
        outputHeight: 400,
        fileBaseName: "cover",
    },
};

const TRANSPARENT_MIME_TYPES = new Set(["image/png", "image/webp", "image/gif"]);

const IMAGE_FILTERS = [
    { id: "none", css: "none", labelKey: "profile.account.filterOriginal" },
    { id: "grayscale", css: "grayscale(100%)", labelKey: "profile.account.filterGrayscale" },
    { id: "sepia", css: "sepia(100%)", labelKey: "profile.account.filterSepia" },
    { id: "brightness", css: "brightness(118%) contrast(108%)", labelKey: "profile.account.filterBrightness" },
    { id: "vivid", css: "saturate(155%) contrast(108%)", labelKey: "profile.account.filterVivid" },
    { id: "contrast", css: "contrast(135%) brightness(102%)", labelKey: "profile.account.filterContrast" },
    { id: "warm", css: "sepia(38%) saturate(145%) brightness(106%)", labelKey: "profile.account.filterWarm" },
    { id: "cool", css: "saturate(88%) hue-rotate(18deg) brightness(106%)", labelKey: "profile.account.filterCool" },
];

export default {
    components: {
        BottomSheetDrawer,
        VueCropper,
    },
    props: {
        modelValue: { type: Boolean, default: false },
        imageSrc: { type: String, default: "" },
        sourceMimeType: { type: String, default: "" },
        cropType: {
            type: String,
            default: "profile",
            validator: (value) => ["profile", "cover"].includes(value),
        },
        uploading: { type: Boolean, default: false },
        uploadPercentage: { type: Number, default: 0 },
    },
    emits: ["update:modelValue", "confirm", "cancel"],
    data() {
        return {
            activeFilterId: "none",
            imageFilters: IMAGE_FILTERS,
            originalImage: null,
            filteredImageUrl: null,
            pendingCropData: null,
            pendingFilterApply: false,
            cropperResetKey: 0,
        };
    },
    computed: {
        isOpen: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
        cropConfig() {
            return CROP_CONFIGS[this.cropType] || CROP_CONFIGS.profile;
        },
        activeFilterCss() {
            const filter = IMAGE_FILTERS.find((item) => item.id === this.activeFilterId);
            return filter?.css || "none";
        },
        preserveTransparency() {
            return TRANSPARENT_MIME_TYPES.has(this.sourceMimeType);
        },
        outputFileConfig() {
            const baseName = this.cropConfig.fileBaseName;
            if (this.preserveTransparency) {
                return {
                    mime: "image/png",
                    fileName: `${baseName}.png`,
                    quality: 0.92,
                };
            }
            return {
                mime: "image/jpeg",
                fileName: `${baseName}.jpg`,
                quality: 0.92,
            };
        },
        cropperKey() {
            return `${this.imageSrc}-${this.cropType}-${this.sourceMimeType}-${this.cropperResetKey}`;
        },
    },
    watch: {
        imageSrc: {
            immediate: true,
            handler(src) {
                this.activeFilterId = "none";
                this.cropperResetKey = 0;
                this.revokeFilteredImageUrl();
                this.loadOriginalImage(src);
            },
        },
    },
    beforeUnmount() {
        this.revokeFilteredImageUrl();
    },
    methods: {
        close() {
            if (this.uploading) return;
            this.activeFilterId = "none";
            this.pendingFilterApply = false;
            this.pendingCropData = null;
            this.revokeFilteredImageUrl();
            this.isOpen = false;
            this.$emit("cancel");
        },
        onSheetClose() {
            if (this.uploading) {
                this.isOpen = true;
                return;
            }
            this.activeFilterId = "none";
            this.pendingFilterApply = false;
            this.pendingCropData = null;
            this.revokeFilteredImageUrl();
            this.$emit("cancel");
        },
        setFilter(filterId) {
            this.activeFilterId = filterId;

            if (filterId === "none") {
                this.restoreOriginalImage();
                return;
            }

            this.applyFilterToCropper();
        },
        restoreOriginalImage() {
            this.pendingFilterApply = false;
            this.pendingCropData = null;
            this.revokeFilteredImageUrl();
            this.cropperResetKey += 1;
        },
        loadOriginalImage(src) {
            this.originalImage = null;

            if (!src) return;

            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                if (this.pendingFilterApply) {
                    this.applyFilterToCropper();
                }
            };
            img.src = src;
        },
        revokeFilteredImageUrl() {
            if (this.filteredImageUrl && this.filteredImageUrl.startsWith("blob:")) {
                URL.revokeObjectURL(this.filteredImageUrl);
            }
            this.filteredImageUrl = null;
        },
        buildFilteredImageUrl(filterCss) {
            if (!this.originalImage || filterCss === "none") {
                return this.imageSrc;
            }

            const img = this.originalImage;
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.filter = filterCss;
            ctx.drawImage(img, 0, 0);

            const { mime, quality } = this.outputFileConfig;
            if (mime === "image/png") {
                return canvas.toDataURL("image/png");
            }
            return canvas.toDataURL("image/jpeg", quality);
        },
        getCropperRef() {
            return this.$refs.cropper;
        },
        isCropperReady() {
            return Boolean(this.getCropperRef()?.cropper);
        },
        onCropperReady() {
            const cropper = this.getCropperRef();
            if (!cropper) return;

            if (this.pendingCropData) {
                cropper.setData(this.pendingCropData);
                this.pendingCropData = null;
            }

            if (this.pendingFilterApply) {
                this.applyFilterToCropper(true);
            }
        },
        applyFilterToCropper(fromReady = false) {
            if (!this.originalImage) {
                this.pendingFilterApply = true;
                return;
            }

            const cropper = this.getCropperRef();
            if (!cropper || !this.isCropperReady()) {
                this.pendingFilterApply = true;
                return;
            }

            this.pendingFilterApply = false;
            const nextSrc = this.buildFilteredImageUrl(this.activeFilterCss);

            if (!fromReady && cropper.getData) {
                try {
                    this.pendingCropData = cropper.getData();
                } catch (error) {
                    this.pendingCropData = null;
                }
            }

            this.revokeFilteredImageUrl();
            if (nextSrc.startsWith("blob:")) {
                this.filteredImageUrl = nextSrc;
            }

            cropper.replace(nextSrc, false);
        },
        zoom(ratio) {
            this.$refs.cropper?.relativeZoom(ratio);
        },
        rotate() {
            this.$refs.cropper?.rotate(90);
        },
        resetAll() {
            this.activeFilterId = "none";
            this.restoreOriginalImage();
        },
        confirmCrop() {
            const cropper = this.$refs.cropper;
            if (!cropper) return;

            const canvasOptions = {
                width: this.cropConfig.outputWidth,
                height: this.cropConfig.outputHeight,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: "high",
            };

            if (this.preserveTransparency) {
                canvasOptions.fillColor = "rgba(0,0,0,0)";
            }

            const croppedCanvas = cropper.getCroppedCanvas(canvasOptions);

            if (!croppedCanvas) return;

            const { mime, fileName, quality } = this.outputFileConfig;

            croppedCanvas.toBlob(
                (blob) => {
                    if (!blob) return;
                    const file = new File([blob], fileName, {
                        type: mime,
                        lastModified: Date.now(),
                    });
                    this.$emit("confirm", file);
                },
                mime,
                quality
            );
        },
    },
};
</script>

<style scoped>
.profile-cropper-wrap :deep(.cropper-container) {
    width: 100% !important;
    height: 100% !important;
}

.profile-cropper-round :deep(.cropper-view-box),
.profile-cropper-round :deep(.cropper-face) {
    border-radius: 50%;
}

.profile-cropper-transparent-bg {
    background-color: #e5e7eb;
    background-image:
        linear-gradient(45deg, #d1d5db 25%, transparent 25%),
        linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #d1d5db 75%),
        linear-gradient(-45deg, transparent 75%, #d1d5db 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0;
}

.crop-tool-btn {
    @apply w-11 h-11 rounded-xl bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 flex items-center justify-center border border-gray-200/80 dark:border-gray-700/80 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white active:scale-95 transition;
}

.crop-tool-btn-reset {
    @apply text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/10;
}

.crop-tool-divider {
    @apply w-px h-8 bg-gray-200 dark:bg-gray-700 shrink-0;
}

.filter-scroll {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}

.filter-chip {
    @apply flex flex-col items-center gap-1.5 w-[4.25rem] shrink-0 transition-transform active:scale-95;
}

.filter-chip-preview-wrap {
    @apply p-0.5 rounded-2xl border-2 border-transparent transition;
}

.filter-chip-preview {
    @apply block w-[3.25rem] h-[3.25rem] rounded-[0.9rem] bg-gray-200 dark:bg-gray-800 bg-cover bg-center shadow-sm;
}

.filter-chip-active .filter-chip-preview-wrap {
    @apply border-amber-400 bg-amber-400/10;
}

.filter-chip-label {
    @apply text-[10px] font-semibold text-gray-500 dark:text-gray-400 text-center leading-tight max-w-full truncate px-0.5;
}

.filter-chip-active .filter-chip-label {
    @apply text-amber-600 dark:text-amber-400;
}

.crop-action-btn {
    @apply min-h-[2.75rem] rounded-xl px-4 text-sm font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100;
}

.crop-action-btn-secondary {
    @apply bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800;
}

.crop-action-btn-primary {
    @apply bg-amber-400 text-gray-900 hover:bg-amber-500 shadow-sm shadow-amber-400/25;
}
</style>
