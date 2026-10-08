<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40 px-3 py-2.5">
            <div class="min-w-0">
                <p class="text-xs font-bold text-gray-800 dark:text-gray-100">پردازش ویدیو</p>
                <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ processEnabled
                        ? 'کیفیت، واترمارک و خروجی HLS تریلر'
                        : 'بدون پردازش؛ MP4 همان‌طور که هست ذخیره و پخش می‌شود' }}
                </p>
            </div>
            <AdminToggleSwitch :model-value="processEnabled" size="sm" @update:model-value="$emit('update:processEnabled', $event)" />
        </div>

        <div v-if="!processEnabled" class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
                v-for="t in storageTargets"
                :key="t.id"
                type="button"
                class="rounded-xl border px-3 py-2.5 text-start transition duration-200"
                :class="processOptions.storage_disk === t.id
                    ? 'border-yellow-400 bg-yellow-400/10 shadow-sm ring-1 ring-yellow-400/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-yellow-400/50'"
                @click="setStorageDisk(t.id)">
                <span class="block text-xs font-bold text-gray-900 dark:text-white">{{ t.id }}</span>
                <span class="mt-0.5 block text-[10px] text-gray-500 dark:text-gray-400 leading-snug">{{ t.label }}</span>
            </button>
        </div>

        <VideoProcessOptions
            v-if="processEnabled"
            variant="trailer"
            :model-value="processOptions"
            :watermark-file="watermarkFile"
            :source-height="sourceHeight"
            :preview-file="previewFile"
            @update:model-value="$emit('update:processOptions', $event)"
            @update:watermark-file="$emit('update:watermarkFile', $event)"
        />
    </div>
</template>
<script>
import AdminToggleSwitch from "@/views/components/admin/AdminToggleSwitch.vue";
import VideoProcessOptions from "@/views/components/admin/VideoProcessOptions.vue";
import { VIDEO_STORAGE_TARGETS } from "@/utils/videoProcessOptions.js";

export default {
    components: { AdminToggleSwitch, VideoProcessOptions },
    props: {
        processEnabled: { type: Boolean, default: false },
        processOptions: { type: Object, required: true },
        watermarkFile: { type: [Object, File], default: null },
        sourceHeight: { type: Number, default: 720 },
        previewFile: { type: [Object, File], default: null },
    },
    emits: ['update:processEnabled', 'update:processOptions', 'update:watermarkFile'],
    data() {
        return { storageTargets: VIDEO_STORAGE_TARGETS };
    },
    methods: {
        setStorageDisk(id) {
            this.$emit('update:processOptions', { ...this.processOptions, storage_disk: id, outputs: ['trailer'] });
        },
    },
};
</script>
