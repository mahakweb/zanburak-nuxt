<template>
    <div
        class="relative overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/50 px-2.5 py-2 hover:border-yellow-400/40 dark:hover:border-yellow-500/30 transition-colors">
        <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-[11px] font-medium text-gray-500 dark:text-gray-400">{{ label }}</span>
            <span class="text-[11px] font-semibold text-gray-400 dark:text-gray-500">{{ percent }}%</span>
        </div>
        <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ value }}</p>
        <div class="mt-2 h-1.5 rounded-full bg-gray-200/80 dark:bg-gray-700/80 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" :class="barClass"
                :style="{ width: `${percent}%` }"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: { type: String, required: true },
        value: { type: [String, Number], required: true },
        percent: { type: Number, default: 0 },
        color: { type: String, default: 'blue' },
    },
    computed: {
        barClass() {
            const colors = {
                blue: 'bg-blue-500',
                emerald: 'bg-emerald-500',
                violet: 'bg-violet-500',
                amber: 'bg-amber-500',
                rose: 'bg-rose-500',
                cyan: 'bg-cyan-500',
            };
            return colors[this.color] || colors.blue;
        },
    },
};
</script>
