<template>
	<div class="relative inline-flex items-center overflow-hidden" :class="sizeClass">
		<Transition name="cart-price-swap" mode="out-in">
			<span
				:key="displayPrice"
				class="inline-flex items-center font-semibold"
				:class="[hasFee ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-100']"
			>
				{{ displayPrice.toLocaleString() }}
				<slot name="suffix" />
			</span>
		</Transition>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	basePrice: {
		type: Number,
		default: 0,
	},
	chargedPrice: {
		type: Number,
		default: 0,
	},
	hasFee: {
		type: Boolean,
		default: false,
	},
	sizeClass: {
		type: String,
		default: 'sm:text-xl text-lg',
	},
});

const displayPrice = computed(() => {
	if (props.hasFee && props.chargedPrice > 0) {
		return props.chargedPrice;
	}

	return props.basePrice;
});
</script>

<style scoped>
.cart-price-swap-enter-active,
.cart-price-swap-leave-active {
	transition: transform 0.28s ease, opacity 0.28s ease;
}

.cart-price-swap-enter-from {
	opacity: 0;
	transform: translateY(12px);
}

.cart-price-swap-leave-to {
	opacity: 0;
	transform: translateY(-12px);
}
</style>
