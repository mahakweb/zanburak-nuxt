<template>
    <div
        v-if="visible"
        :id="sectionId"
        class="p-2 md:px-5 mb-8 bg-white dark:bg-gray-900 rounded-xl"
    >
        <h4 class="text-gray-900 dark:text-yellow-400 text-lg font-bold sm:text-right text-center flex sm:justify-start justify-center items-center mb-4">
            <i class="bg-gray-900 dark:bg-yellow-400 rtl:ml-1 ltr:mr-1 w-2 h-2 rounded-full sm:flex hidden"></i>
            {{ headingText }}
        </h4>
        <div class="space-y-2">
            <div
                v-for="(attach, index) in attachs"
                :key="attach.id || index"
                class="relative flex items-center gap-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 ps-4 pe-2 py-2.5"
            >
                <div class="absolute top-1/2 start-0 rounded-e-xl w-1 h-[60%] -translate-y-1/2 bg-yellow-400"></div>
                <FileExtBadgeIcon :file="attach" class="shrink-0" />
                <div class="min-w-0 flex-1 text-start">
                    <p class="line-clamp-1 text-gray-700 text-sm font-semibold dark:text-white leading-6">
                        {{ displayTitle(attach) }}
                    </p>
                    <p v-if="attach.size != null" class="">
                        <span dir="ltr" lang="en" class="inline-block font-sans text-[10px] text-gray-400">
                            {{ formatBytes(attach.size) }}
                        </span>
                    </p>
                </div>
                <a
                    :href="attach.url"
                    :download="displayTitle(attach)"
                    class="w-24 shrink-0 h-9 inline-flex items-center justify-center gap-1 rounded-xl bg-gray-200/80 dark:bg-gray-900/70 border border-gray-300/40 dark:border-gray-700 text-xs font-semibold text-gray-800 dark:text-gray-100 hover:border-yellow-400/70 hover:bg-yellow-400/15 transition"
                >
                    <svg class="w-4 h-4" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="stroke-current" d="M6.98 8.74 7.83 9.6V.67a.17.17 0 0 1 .34 0v8.93l.85-.86 2.2-2.19a.17.17 0 0 1 .23.24L8.12 10.12a.17.17 0 0 1-.24 0L4.55 6.78a.17.17 0 0 1 .23-.23l2.2 2.19Z" />
                        <path class="fill-current" fill-opacity="0.4" d="M3.33 3.53c0-.44-.42-.78-.83-.61C.54 3.7 0 5.32 0 8.47 0 13.57 1.41 14.67 8 14.67s8-1.1 8-6.2c0-3.15-.54-4.77-2.5-5.55-.41-.17-.83.17-.83.61 0 .3.2.56.47.68.21.1.38.2.52.3.62.48 1.01 1.41 1.01 3.96s-.39 3.47-1.01 3.96c-.35.27-.9.51-1.85.67-.95.16-2.18.23-3.8.23s-2.86-.07-3.8-.23c-.95-.16-1.5-.4-1.85-.67C1.72 11.94 1.33 11.02 1.33 8.47s.39-3.47 1.01-3.96c.14-.1.31-.2.52-.3.27-.12.47-.38.47-.68Z" />
                    </svg>
                    دانلود
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { displayAttachmentTitle } from '@/utils/attachmentDisplay';
import FileExtBadgeIcon from '@/views/components/admin/FileExtBadgeIcon.vue';

export default {
    name: 'CourseAttachmentsSection',
    components: { FileExtBadgeIcon },
    props: {
        attachs: { type: Array, default: () => [] },
        canAccess: { type: Boolean, default: false },
        heading: { type: String, default: '' },
        sectionId: { type: String, default: 'course-attachments' },
    },
    computed: {
        visible() {
            return this.canAccess && Array.isArray(this.attachs) && this.attachs.length > 0;
        },
        headingText() {
            return this.heading || this.$t('course.show.attachments');
        },
    },
    methods: {
        displayTitle: displayAttachmentTitle,
        formatBytes(bytes) {
            if (!bytes && bytes !== 0) return '';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 B';
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
        },
    },
};
</script>
