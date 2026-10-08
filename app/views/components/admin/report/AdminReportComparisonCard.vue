<template>
    <div
        class="rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-900 px-3 py-2.5">
        <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">{{ label }}</p>
        <div class="flex items-end justify-between gap-2">
            <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate" dir="ltr">{{ formattedCurrent }}</p>
                <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">دوره قبل: {{ formattedPrevious }}</p>
            </div>
            <AdminReportTrendBadge :change="change" :change-percent="changePercent" :invert-colors="invertColors" />
        </div>
    </div>
</template>

<script>
import AdminReportTrendBadge from './AdminReportTrendBadge.vue';

export default {
    components: { AdminReportTrendBadge },
    props: {
        label: { type: String, required: true },
        current: { type: [String, Number], required: true },
        previous: { type: [String, Number], required: true },
        change: { type: Number, default: 0 },
        changePercent: { type: Number, default: 0 },
        invertColors: { type: Boolean, default: false },
    },
    computed: {
        formattedCurrent() {
            return this.current;
        },
        formattedPrevious() {
            return this.previous;
        },
    },
};
</script>
