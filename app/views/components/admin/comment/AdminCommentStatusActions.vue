<template>
    <div :class="variant === 'menu' ? 'flex flex-col' : 'inline-flex items-center gap-1'">
        <button
            v-if="current !== 'approved'"
            type="button"
            :disabled="disabled"
            :class="buttonClass('approved')"
            @click.prevent="$emit('set-status', comment, 'approved')">
            تایید
        </button>
        <button
            v-if="current !== 'rejected'"
            type="button"
            :disabled="disabled"
            :class="buttonClass('rejected')"
            @click.prevent="$emit('set-status', comment, 'rejected')">
            رد
        </button>
        <button
            v-if="current !== 'pending'"
            type="button"
            :disabled="disabled"
            :class="buttonClass('pending')"
            @click.prevent="$emit('set-status', comment, 'pending')">
            در انتظار
        </button>
    </div>
</template>

<script>
import { normalizeCommentStatus } from "@/utils/commentStatus";

export default {
    name: "AdminCommentStatusActions",
    props: {
        comment: { type: Object, required: true },
        disabled: { type: Boolean, default: false },
        variant: { type: String, default: "inline" },
    },
    emits: ["set-status"],
    computed: {
        current() {
            return normalizeCommentStatus(this.comment);
        },
    },
    methods: {
        buttonClass(status) {
            if (this.variant === "menu") {
                const tone = {
                    approved: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 text-emerald-600 dark:text-emerald-400",
                    rejected: "hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 text-rose-600 dark:text-rose-400",
                    pending: "hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-300 text-amber-600 dark:text-amber-400",
                }[status];
                return `disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg ${tone}`;
            }

            const tone = {
                approved: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300",
                rejected: "hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300",
                pending: "hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-300",
            }[status];
            return `disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 ${tone}`;
        },
    },
};
</script>
