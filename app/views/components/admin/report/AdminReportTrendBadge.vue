<template>
    <span class="inline-flex items-center gap-0.5 shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
        :class="badgeClass">
        <svg v-if="isPositive" class="w-3 h-3" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="isNegative" class="w-3 h-3" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ formattedPercent }}%</span>
    </span>
</template>

<script>
export default {
    props: {
        change: { type: Number, default: 0 },
        changePercent: { type: Number, default: undefined },
        change_percent: { type: Number, default: undefined },
        invertColors: { type: Boolean, default: false },
    },
    computed: {
        resolvedChangePercent() {
            if (typeof this.changePercent === 'number') return this.changePercent;
            if (typeof this.change_percent === 'number') return this.change_percent;
            return 0;
        },
        isPositive() {
            return this.change > 0;
        },
        isNegative() {
            return this.change < 0;
        },
        formattedPercent() {
            const prefix = this.resolvedChangePercent > 0 ? '+' : '';
            return `${prefix}${this.resolvedChangePercent}`;
        },
        badgeClass() {
            if (this.change === 0) {
                return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
            }
            const upIsGood = !this.invertColors;
            const isGood = upIsGood ? this.change > 0 : this.change < 0;
            return isGood
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        },
    },
};
</script>
