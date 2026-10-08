<template>
	<div v-if="visible" class="inline-flex items-center">
		<button
			type="button"
			class="inline-flex h-5 w-5 items-center justify-center text-amber-600 transition hover:opacity-80 dark:text-amber-400"
			:aria-label="t('cart.gatewayFeeHelpTitle')"
			@click.stop="openSheet"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 8.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"
				/>
			</svg>
		</button>

		<BottomSheetDrawer
			v-if="renderSheet"
			v-model="isOpen"
			@close="emit('close')"
			:initial-height="0.55"
			:min-height="0.35"
			:max-height="0.85"
			:fit-content="true"
			:draggable="true"
			:close-on-backdrop="true"
			:lock-scroll="true"
			:panel-class="'bg-white dark:bg-gray-900 border-t border-amber-200/60 dark:border-amber-500/20 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
			:content-class="'px-4 pb-5 overflow-auto custom-scrollbar'"
		>
			<div class="space-y-3 text-start">
				<p class="text-sm font-bold text-gray-900 dark:text-gray-100">
					{{ t('cart.gatewayFeeHelpTitle') }}
				</p>
				<p class="text-xs leading-6 text-gray-600 dark:text-gray-300">
					{{ t('cart.gatewayFeeHelpDesc', { percent: commissionPercent }) }}
				</p>

				<ul class="space-y-2">
					<li
						v-for="item in pricedItems"
						:key="item.id"
						class="rounded-xl border border-amber-200/70 bg-amber-50 px-3 py-2.5 text-[11px] dark:border-amber-500/20 dark:bg-amber-500/10"
					>
						<p class="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">{{ item.title }}</p>
						<div class="mt-1.5 flex items-center justify-between gap-2 text-gray-600 dark:text-gray-300">
							<span>{{ t('cart.gatewayFeeOldPrice') }}</span>
							<span class="font-anjoman line-through">{{ item.basePrice.toLocaleString() }}</span>
						</div>
						<div class="mt-0.5 flex items-center justify-between gap-2 font-semibold text-amber-700 dark:text-amber-300">
							<span>{{ t('cart.gatewayFeeNewPrice') }}</span>
							<span class="font-anjoman">{{ item.chargedPrice.toLocaleString() }}</span>
						</div>
					</li>
				</ul>
			</div>
		</BottomSheetDrawer>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	items: {
		type: Array,
		default: () => [],
	},
	commissionPercent: {
		type: Number,
		default: 0,
	},
	renderSheet: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['before-open', 'close']);

const { t } = useI18n();
const isOpen = ref(false);
const pricedItems = computed(() => props.items.filter((item) => item.hasFee));

function openSheet() {
	emit('before-open');
	if (props.renderSheet) {
		isOpen.value = true;
	}
}

defineExpose({
	open: () => {
		isOpen.value = true;
	},
});
</script>
