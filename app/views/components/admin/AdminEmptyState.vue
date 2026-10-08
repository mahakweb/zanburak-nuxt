<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ message }}</p>
        <slot />
    </div>
</template>

<script>
export default {
    name: "AdminEmptyState",
    props: {
        message: { type: String, default: "موردی برای نمایش وجود ندارد" },
    },
};
</script>
