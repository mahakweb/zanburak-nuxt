<template>
    <span
        class="inline-flex shrink-0 items-center justify-center"
        :class="[
            bare ? 'text-current' : 'rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
            size === 'md' ? 'w-9 h-9' : 'w-7 h-7',
        ]"
    >
        <svg :class="size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <!-- course -->
            <template v-if="type === 'course'">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M8 7h8M8 11h6" />
            </template>
            <!-- section -->
            <template v-else-if="type === 'section'">
                <path d="M4 5h16M4 12h16M4 19h10" />
            </template>
            <!-- episode -->
            <template v-else-if="type === 'episode'">
                <polygon points="8,5 19,12 8,19" fill="currentColor" stroke="none" />
                <rect x="4" y="5" width="3" height="14" rx="0.5" fill="currentColor" stroke="none" />
            </template>
            <!-- standalone -->
            <template v-else>
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" />
            </template>
        </svg>
    </span>
</template>

<script>
export default {
    name: 'AdminQuizAttachIcon',
    props: {
        type: { type: String, default: 'standalone' },
        size: { type: String, default: 'sm' },
        bare: { type: Boolean, default: false },
    },
};
</script>
