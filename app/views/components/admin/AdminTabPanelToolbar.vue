<template>
    <div class="mb-4 pb-4 border-b border-dashed border-gray-200/70 dark:border-gray-700/50 space-y-3">
        <div
            v-if="$slots.leading || $slots.actions"
            class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
            <div v-if="$slots.leading" class="text-xs font-semibold text-gray-500 dark:text-gray-400">
                <slot name="leading" />
            </div>
            <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:shrink-0">
                <slot name="actions" />
            </div>
        </div>
        <div v-if="hasDefaultSlot" class="flex flex-wrap items-end gap-1">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        hasDefaultSlot() {
            return !!this.$slots.default;
        },
    },
};
</script>
