<template>
    <span
        class="whitespace-nowrap inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-lg"
        :class="badgeClass">
        <svg v-if="status === 'approved'" class="w-3 h-3 me-1" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="status === 'rejected'" class="w-3 h-3 me-1" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <svg v-else class="w-3 h-3 me-1" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" />
            <path d="M12 8v4l2.5 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ label }}
    </span>
</template>

<script>
import {
    commentStatusBadgeClass,
    commentStatusLabel,
    normalizeCommentStatus,
} from "@/utils/commentStatus";

export default {
    name: "CommentStatusBadge",
    props: {
        comment: { type: [Object, String], default: null },
    },
    computed: {
        status() {
            return normalizeCommentStatus(this.comment);
        },
        label() {
            return commentStatusLabel(this.status);
        },
        badgeClass() {
            return commentStatusBadgeClass(this.status);
        },
    },
};
</script>
