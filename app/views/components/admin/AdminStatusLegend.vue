<script setup>
defineProps({
    items: {
        type: Array,
        default: () => [],
    },
})
</script>

<template>
    <div v-if="items.length" class="mt-4 flex flex-wrap items-center justify-end gap-4">
        <div v-for="item in items" :key="item.label" class="flex items-center gap-2">
            <div class="h-1 w-6 rounded" :class="item.barClass"></div>
            <span class="text-xs font-medium text-gray-400 dark:text-gray-500">{{ item.label }}</span>
        </div>
    </div>
</template>
