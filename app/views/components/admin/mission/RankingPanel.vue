<template>
    <div class="rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4 shadow-sm">
        <div class="mb-3">
            <h3 class="text-xs font-bold text-gray-900 dark:text-white">{{ title }}</h3>
            <p v-if="subtitle" class="text-xs text-gray-500 mt-0.5">{{ subtitle }}</p>
        </div>
        <div v-if="items?.length" class="space-y-2">
            <div v-for="(item, i) in items" :key="item.id"
                class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                <span class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{{ i + 1 }}</span>
                <MissionIcon :icon="item.icon" size-class="w-7 h-7" />
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-gray-900 dark:text-white truncate">{{ item.title }}</p>
                    <p class="text-xs text-gray-500">{{ item.category?.title }}</p>
                </div>
                <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg shrink-0">
                    {{ formatValue(item) }}{{ suffix }}
                </span>
            </div>
        </div>
        <p v-else class="text-xs text-gray-400 text-center py-6">داده‌ای موجود نیست</p>
    </div>
</template>

<script>
import MissionIcon from "@/views/components/admin/mission/MissionIcon.vue";
export default {
    components: { MissionIcon },
    props: {
        title: { type: String, required: true },
        subtitle: { type: String, default: '' },
        items: { type: Array, default: () => [] },
        metric: { type: String, default: 'participants_count' },
        suffix: { type: String, default: '' },
    },
    methods: {
        formatValue(item) {
            const v = item[this.metric];
            return v != null ? Number(v).toLocaleString('fa-IR') : '—';
        },
    },
};
</script>
