<template>
    <div class="relative flex flex-col items-center justify-center">
        <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="transform -rotate-90">
            <circle
                :cx="center"
                :cy="center"
                :r="radius"
                fill="none"
                :stroke="trackColor"
                :stroke-width="strokeWidth"
            />
            <circle
                :cx="center"
                :cy="center"
                :r="radius"
                fill="none"
                :stroke="gaugeColor"
                :stroke-width="strokeWidth"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"
                class="transition-all duration-700 ease-out"
            />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
            <span class="text-2xl font-black tracking-tight" :class="valueColorClass" dir="ltr">
                {{ displayValue }}
            </span>
            <span v-if="unit" class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{{ unit }}</span>
            <span class="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">{{ label }}</span>
            <span v-if="subtitle" class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{{ subtitle }}</span>
        </div>
    </div>
</template>

<script>
const STATUS_COLORS = {
    healthy: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
    unknown: '#9ca3af',
};

export default {
    props: {
        value: { type: Number, default: null },
        max: { type: Number, default: 100 },
        label: { type: String, required: true },
        subtitle: { type: String, default: '' },
        unit: { type: String, default: '%' },
        status: { type: String, default: 'unknown' },
        size: { type: Number, default: 140 },
        strokeWidth: { type: Number, default: 10 },
        displayText: { type: String, default: '' },
    },
    computed: {
        center() {
            return this.size / 2;
        },
        radius() {
            return (this.size - this.strokeWidth) / 2;
        },
        circumference() {
            return 2 * Math.PI * this.radius;
        },
        normalized() {
            if (this.value === null || this.value === undefined) return 0;
            return Math.min(100, Math.max(0, (this.value / this.max) * 100));
        },
        dashOffset() {
            return this.circumference - (this.normalized / 100) * this.circumference;
        },
        gaugeColor() {
            return STATUS_COLORS[this.status] || STATUS_COLORS.unknown;
        },
        trackColor() {
            return 'currentColor';
        },
        displayValue() {
            if (this.displayText) return this.displayText;
            if (this.value === null || this.value === undefined) return '—';
            return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(this.value);
        },
        valueColorClass() {
            const map = {
                healthy: 'text-emerald-600 dark:text-emerald-400',
                warning: 'text-amber-600 dark:text-amber-400',
                critical: 'text-red-600 dark:text-red-400',
                unknown: 'text-gray-500 dark:text-gray-400',
            };
            return map[this.status] || map.unknown;
        },
    },
};
</script>

<style scoped>
svg circle:first-child {
    color: rgb(243 244 246);
}
:global(.dark) svg circle:first-child {
    color: rgb(31 41 55);
}
</style>
