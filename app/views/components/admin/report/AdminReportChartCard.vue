<template>
    <div
        class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4 md:p-5 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div class="min-w-0">
                <div class="flex items-center gap-2">
                    <div v-if="$slots.icon"
                        class="shrink-0 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        <slot name="icon" />
                    </div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ title }}</h3>
                </div>
                <p v-if="subtitle" class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
            </div>
            <div v-if="$slots.actions" class="shrink-0">
                <slot name="actions" />
            </div>
            <span v-else-if="badge"
                class="shrink-0 self-start text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                {{ badge }}
            </span>
        </div>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        title: { type: String, required: true },
        subtitle: { type: String, default: '' },
        badge: { type: String, default: '' },
    },
};
</script>
