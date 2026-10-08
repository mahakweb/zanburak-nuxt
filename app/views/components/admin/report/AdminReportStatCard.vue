<template>
    <div
        class="group relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:border-gray-300/80 dark:hover:border-gray-600/80 transition-all duration-300"
        :class="compact ? 'p-3' : 'p-4'">
        <div class="absolute top-0 inset-x-0" :class="[accentBarClass, compact ? 'h-0.5' : 'h-1']"></div>
        <div class="flex items-start justify-between" :class="compact ? 'gap-2' : 'gap-3'">
            <div class="flex items-start min-w-0 flex-1" :class="compact ? 'gap-2' : 'gap-3'">
                <div v-if="$slots.icon || icon" class="shrink-0 ring-1 ring-inset [&_svg]:w-3.5 [&_svg]:h-3.5" :class="[iconWrapClass, compact ? 'p-1.5 rounded-lg' : 'p-2.5 rounded-xl']">
                    <slot name="icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <template v-if="icon === 'eye'">
                                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                                <circle cx="12" cy="12" r="3" />
                            </template>
                            <template v-else-if="icon === 'heart'">
                                <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
                            </template>
                            <template v-else-if="icon === 'message'">
                                <path d="M5 6h14v9H8l-3 3V6z" />
                            </template>
                            <template v-else-if="icon === 'bookmark'">
                                <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1z" />
                            </template>
                            <template v-else-if="icon === 'users'">
                                <circle cx="9" cy="8" r="3" />
                                <path d="M3.5 19c.6-2.6 2.7-4 5.5-4s4.9 1.4 5.5 4" />
                            </template>
                            <template v-else-if="icon === 'clock'">
                                <circle cx="12" cy="12" r="8" />
                                <path d="M12 8v4.5l3 2" />
                            </template>
                            <template v-else-if="icon === 'globe'">
                                <circle cx="12" cy="12" r="8" />
                                <path d="M4 12h16M12 4c2.2 2.4 3.2 5.2 3.2 8s-1 5.6-3.2 8c-2.2-2.4-3.2-5.2-3.2-8s1-5.6 3.2-8z" />
                            </template>
                            <template v-else-if="icon === 'trend'">
                                <path d="M4 16l5-5 3 3 8-8" />
                                <path d="M15 6h5v5" />
                            </template>
                            <template v-else-if="icon === 'activity'">
                                <path d="M4 12h4l2-5 4 10 2-5h4" />
                            </template>
                            <template v-else-if="icon === 'coin'">
                                <path d="M12 3v18M7 7.5h6.5a2.5 2.5 0 0 1 0 5H9a2.5 2.5 0 0 0 0 5H17" />
                            </template>
                            <template v-else-if="icon === 'play'">
                                <circle cx="12" cy="12" r="8" />
                                <path d="M10 9.5v5l4.5-2.5-4.5-2.5z" />
                            </template>
                        </svg>
                    </slot>
                </div>
                <div class="min-w-0">
                    <p class="font-medium text-gray-500 dark:text-gray-400" :class="compact ? 'text-[11px]' : 'text-xs'">{{ title }}</p>
                    <p class="font-semibold text-gray-900 dark:text-white tracking-tight" :class="compact ? 'mt-0.5 text-sm' : 'mt-1 text-xl font-bold'" :dir="valueDir">{{ value }}</p>
                    <p v-if="subtitle" class="text-gray-500 dark:text-gray-400" :class="compact ? 'mt-0.5 text-[11px] leading-snug' : 'mt-1 text-xs leading-relaxed'">{{ subtitle }}</p>
                    <slot name="footer" />
                </div>
            </div>
            <AdminReportTrendBadge v-if="hasTrend" :change="trend.change"
                :change_percent="trend.change_percent ?? trend.changePercent"
                :invert-colors="invertTrendColors" />
        </div>
    </div>
</template>

<script>
import AdminReportTrendBadge from './AdminReportTrendBadge.vue';

const ACCENTS = {
    emerald: {
        bar: 'bg-gradient-to-l from-emerald-500 to-emerald-400',
        icon: 'bg-emerald-50 text-emerald-600 ring-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800/40',
    },
    blue: {
        bar: 'bg-gradient-to-l from-blue-500 to-blue-400',
        icon: 'bg-blue-50 text-blue-600 ring-blue-200/60 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800/40',
    },
    amber: {
        bar: 'bg-gradient-to-l from-amber-500 to-yellow-400',
        icon: 'bg-amber-50 text-amber-600 ring-amber-200/60 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/40',
    },
    violet: {
        bar: 'bg-gradient-to-l from-violet-500 to-purple-400',
        icon: 'bg-violet-50 text-violet-600 ring-violet-200/60 dark:bg-violet-900/20 dark:text-violet-400 dark:ring-violet-800/40',
    },
    rose: {
        bar: 'bg-gradient-to-l from-rose-500 to-pink-400',
        icon: 'bg-rose-50 text-rose-600 ring-rose-200/60 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800/40',
    },
    cyan: {
        bar: 'bg-gradient-to-l from-cyan-500 to-teal-400',
        icon: 'bg-cyan-50 text-cyan-600 ring-cyan-200/60 dark:bg-cyan-900/20 dark:text-cyan-400 dark:ring-cyan-800/40',
    },
};

export default {
    components: { AdminReportTrendBadge },
    props: {
        title: { type: String, required: true },
        value: { type: [String, Number], required: true },
        subtitle: { type: String, default: '' },
        accent: { type: String, default: 'blue' },
        trend: { type: Object, default: null },
        invertTrendColors: { type: Boolean, default: false },
        valueDir: { type: String, default: 'rtl' },
        compact: { type: Boolean, default: true },
        icon: { type: String, default: '' },
    },
    computed: {
        accentBarClass() {
            return (ACCENTS[this.accent] || ACCENTS.blue).bar;
        },
        iconWrapClass() {
            return (ACCENTS[this.accent] || ACCENTS.blue).icon;
        },
        hasTrend() {
            if (!this.trend) return false;
            const percent = this.trend.change_percent ?? this.trend.changePercent;
            return typeof percent === 'number';
        },
    },
};
</script>
