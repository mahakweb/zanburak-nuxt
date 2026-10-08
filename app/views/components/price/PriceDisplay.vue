<template>
    <div v-if="isFree" class="text-gray-700 dark:text-white font-bold text-sm">
        <span>{{ $t('course.card.free') }}</span>
    </div>
    <div v-else class="flex flex-col items-end gap-0.5 min-w-0 max-w-full">
        <DiscountBadge v-if="showBadge && hasDiscount" :percent="percent" :compact="compact" />
        <div class="flex items-baseline gap-1.5 flex-wrap justify-end">
            <span
                v-if="hasDiscount"
                class="line-through decoration-gray-400 text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium"
            >
                <span class="sr-only">{{ $t('course.card.originalPrice') }}</span>
                {{ formattedOriginal }}
            </span>
            <span class="text-gray-800 dark:text-white font-bold" :class="sizeClass">
                <span class="sr-only">{{ hasDiscount ? $t('course.card.currentPrice') : $t('course.card.price') }}</span>
                {{ formattedCurrent }}
            </span>
        </div>
    </div>
</template>

<script>
import DiscountBadge from "@/views/components/price/DiscountBadge.vue";
import { courseCurrentPrice, courseDiscountPercent, courseHasDiscount, courseOriginalPrice, formatToman } from "@/utils/priceDisplay";

export default {
    name: "PriceDisplay",
    components: { DiscountBadge },
    props: {
        course: { type: Object, default: null },
        original: { type: [Number, String], default: null },
        current: { type: [Number, String], default: null },
        compact: { type: Boolean, default: false },
        showBadge: { type: Boolean, default: true },
        sizeClass: { type: String, default: "text-sm lg:text-md" },
    },
    computed: {
        originalPrice() {
            if (this.original != null) {
                return Number(this.original) || 0;
            }
            return courseOriginalPrice(this.course);
        },
        currentPrice() {
            if (this.current != null) {
                return Math.max(0, Number(this.current) || 0);
            }
            return courseCurrentPrice(this.course);
        },
        isFree() {
            return this.originalPrice <= 0;
        },
        hasDiscount() {
            if (this.course) {
                return courseHasDiscount(this.course);
            }
            return this.originalPrice > 0 && this.currentPrice < this.originalPrice;
        },
        percent() {
            if (this.course) {
                return courseDiscountPercent(this.course);
            }
            if (this.originalPrice <= 0) {
                return 0;
            }
            return Math.round(((this.originalPrice - this.currentPrice) / this.originalPrice) * 100);
        },
        formattedOriginal() {
            return formatToman(this.originalPrice);
        },
        formattedCurrent() {
            return formatToman(this.currentPrice);
        },
    },
};
</script>
