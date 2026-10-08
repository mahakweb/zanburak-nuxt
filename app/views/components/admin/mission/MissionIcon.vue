<template>
    <span
        class="inline-flex items-center justify-center shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200/70 dark:border-gray-700/60"
        :class="sizeClass">
        <img v-if="isUrl" :src="icon" @error="onImgError" alt="" class="w-full h-full object-cover" />
        <span v-else-if="icon && !imgFailed" class="leading-none select-none" :class="emojiClass">{{ icon }}</span>
        <svg v-else class="w-1/2 h-1/2 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" fill="none">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1Z"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
        </svg>
    </span>
</template>

<script>
export default {
    name: "MissionIcon",
    props: {
        icon: { type: String, default: "" },
        sizeClass: { type: String, default: "w-9 h-9" },
    },
    data() {
        return { imgFailed: false };
    },
    computed: {
        isUrl() {
            const v = (this.icon || '').trim();
            return !this.imgFailed && (/^https?:\/\//i.test(v) || v.startsWith('/'));
        },
        emojiClass() {
            if (this.sizeClass.includes('w-14') || this.sizeClass.includes('w-16')) return 'text-2xl';
            if (this.sizeClass.includes('w-12')) return 'text-xl';
            return 'text-base';
        },
    },
    watch: {
        icon() { this.imgFailed = false; },
    },
    methods: {
        onImgError() { this.imgFailed = true; },
    },
};
</script>
