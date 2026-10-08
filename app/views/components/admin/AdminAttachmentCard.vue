<template>
    <div
        class="relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-700/70 bg-white dark:bg-gray-900/80 shadow-sm"
    >
        <div
            v-if="status === 'uploading'"
            class="absolute inset-y-0 start-0 bg-yellow-400/10 pointer-events-none transition-all duration-300"
            :style="{ width: (percent || 0) + '%' }"
        />
        <div class="absolute top-0 bottom-0 start-0 w-1 bg-yellow-400"></div>

        <div class="relative z-10 flex items-center gap-3 ps-4 pe-2.5 py-2.5">
            <div class="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <FileExtBadgeIcon :file="{ ext, url, title: modelValue }" />
            </div>

            <div class="min-w-0 flex-1">
                <input
                    :value="modelValue"
                    type="text"
                    :disabled="titleDisabled || saving"
                    :placeholder="placeholder"
                    class="w-full h-8 bg-transparent text-[13px] font-semibold text-gray-800 dark:text-gray-100 outline-none rounded-lg px-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-yellow-400/80 focus:bg-gray-50 dark:focus:bg-gray-800/80 transition disabled:opacity-70"
                    @input="$emit('update:modelValue', $event.target.value)"
                    @keydown.enter.prevent="canSave && $emit('save')"
                />
                <div class="flex items-center gap-2 px-2 mt-0.5 min-h-[18px]">
                    <span v-if="sizeLabel" dir="ltr" lang="en" class="font-sans text-[10px] text-gray-400">{{ sizeLabel }}</span>
                    <span v-if="sizeLabel && meta" class="text-gray-300 dark:text-gray-600 text-[10px]">·</span>
                    <span v-if="meta" class="text-[10px] text-gray-400 truncate">{{ meta }}</span>
                    <MediaStatusBadge v-if="status && status !== 'idle'" :status="status" :percent="percent" />
                </div>
            </div>

            <div class="flex items-center gap-1 shrink-0">
                <a
                    v-if="showView && url"
                    :href="url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :title="viewLabel"
                    class="w-8 h-8 rounded-lg inline-flex items-center justify-center text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-yellow-400/20 hover:text-gray-900 dark:hover:text-white transition"
                >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12s-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </a>
                <button
                    v-if="showSave"
                    type="button"
                    :title="saveLabel"
                    :disabled="saving || !canSave"
                    class="w-8 h-8 rounded-lg inline-flex items-center justify-center text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-300 transition disabled:opacity-40 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-800"
                    @click="$emit('save')"
                >
                    <svg v-if="saving" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </button>
                <button
                    v-if="showDelete"
                    type="button"
                    :title="deleteLabel"
                    :disabled="removing || deleteDisabled"
                    class="w-8 h-8 rounded-lg inline-flex items-center justify-center text-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-500 hover:text-white transition disabled:opacity-40"
                    @click="$emit('remove')"
                >
                    <svg v-if="removing" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 7h15M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7m-7 0V18a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7M10 11v6M14 11v6" />
                    </svg>
                </button>
            </div>
        </div>

        <div v-if="status === 'uploading'" class="relative z-10 mx-4 mb-2.5 h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div class="h-full bg-yellow-400 transition-all duration-300" :style="{ width: (percent || 0) + '%' }"></div>
        </div>
        <p v-if="error" class="relative z-10 px-4 pb-2.5 text-[11px] text-rose-500">{{ error }}</p>
    </div>
</template>

<script>
import FileExtBadgeIcon from '@/views/components/admin/FileExtBadgeIcon.vue';
import MediaStatusBadge from '@/views/components/admin/MediaStatusBadge.vue';

export default {
    name: 'AdminAttachmentCard',
    components: { FileExtBadgeIcon, MediaStatusBadge },
    props: {
        modelValue: { type: String, default: '' },
        ext: { type: String, default: '' },
        sizeLabel: { type: String, default: '' },
        meta: { type: String, default: '' },
        status: { type: String, default: 'idle' },
        percent: { type: [Number, String], default: null },
        url: { type: String, default: '' },
        error: { type: String, default: '' },
        placeholder: { type: String, default: 'نام نمایشی فایل' },
        titleDisabled: { type: Boolean, default: false },
        saving: { type: Boolean, default: false },
        removing: { type: Boolean, default: false },
        canSave: { type: Boolean, default: false },
        showView: { type: Boolean, default: false },
        showSave: { type: Boolean, default: false },
        showDelete: { type: Boolean, default: true },
        deleteDisabled: { type: Boolean, default: false },
        viewLabel: { type: String, default: 'مشاهده' },
        saveLabel: { type: String, default: 'ذخیره نام' },
        deleteLabel: { type: String, default: 'حذف' },
    },
    emits: ['update:modelValue', 'save', 'remove'],
};
</script>
