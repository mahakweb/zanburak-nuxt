<template>
    <div v-if="count > 0"
        class="flex flex-wrap justify-between items-center gap-3 mb-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
        <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {{ formatNumber(count) }} مورد انتخاب شده
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: "AdminBulkActionBar",
    props: {
        count: { type: Number, default: 0 },
    },
    methods: {
        formatNumber(value) {
            return Number(value || 0).toLocaleString("fa-IR");
        },
    },
};
</script>
