<template>
    <span
        v-if="percent > 0"
        class="inline-flex items-center rounded-md font-bold whitespace-nowrap"
        :class="overlay
            ? 'bg-rose-500 text-white shadow-md shadow-black/25 px-2 py-1 text-[11px]'
            : ['bg-rose-500/10 px-1.5 py-0.5 text-[10px] text-rose-600 dark:bg-rose-400/10 dark:text-rose-300', compact ? '' : 'sm:text-[11px]']"
    >
        {{ percent }}% {{ $t('course.card.discount') }}
    </span>
</template>

<script>
export default {
    name: "DiscountBadge",
    props: {
        percent: { type: [Number, String], default: 0 },
        compact: { type: Boolean, default: false },
        overlay: { type: Boolean, default: false },
    },
};
</script>
