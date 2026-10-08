<template>
    <div class="space-y-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
        <div class="flex items-center justify-between">
            <span>{{ $t('cart.originalPrice') }}</span>
            <span class="font-semibold text-gray-800 dark:text-gray-100 font-anjoman">{{ format(original) }}</span>
        </div>
        <div v-if="courseDiscount > 0" class="flex items-center justify-between">
            <span>{{ $t('cart.courseDiscount') }}</span>
            <span class="font-semibold text-green-600 font-anjoman">-{{ format(courseDiscount) }}</span>
        </div>
        <div v-if="couponDiscount > 0" class="flex items-center justify-between">
            <span>{{ couponLabel }}</span>
            <span class="font-semibold text-green-600 font-anjoman">-{{ format(couponDiscount) }}</span>
        </div>
        <div v-else-if="totalDiscount > 0 && courseDiscount <= 0" class="flex items-center justify-between">
            <span>{{ $t('cart.discount') }}</span>
            <span class="font-semibold text-green-600 font-anjoman">-{{ format(totalDiscount) }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "DiscountBreakdown",
    props: {
        original: { type: Number, default: 0 },
        courseDiscount: { type: Number, default: 0 },
        couponDiscount: { type: Number, default: 0 },
        totalDiscount: { type: Number, default: 0 },
        couponCode: { type: String, default: "" },
    },
    computed: {
        couponLabel() {
            if (this.couponCode) {
                return `${this.$t("cart.couponDiscount")} (${this.couponCode})`;
            }
            return this.$t("cart.couponDiscount");
        },
    },
    methods: {
        format(value) {
            return Number(value || 0).toLocaleString();
        },
    },
};
</script>
