<template>
	<RadioGroup :model-value="selectedId" @update:model-value="onSelect">
		<div class="space-y-1.5 rounded-2xl bg-gray-100/70 p-1.5 dark:bg-gray-800/50">
			<RadioGroupOption
				v-for="gateway in gateways"
				:key="gateway.id"
				as="div"
				:value="gateway.id"
				v-slot="{ checked }"
			>
				<div
					:class="[
						'flex min-h-[3.25rem] cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-[opacity,background-color,box-shadow] duration-200',
						checked
							? 'bg-white opacity-100 shadow-sm ring-1 ring-blue-200/80 dark:bg-gray-900 dark:ring-blue-800/60'
							: 'opacity-[0.34] hover:opacity-50',
					]"
				>
					<div class="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
						<img
							v-if="gateway.icon"
							:src="gateway.icon"
							:alt="gateway.name"
							:class="[
								'h-full w-full scale-[1.14] object-cover transition-all duration-200',
								checked ? '' : 'grayscale',
							]"
							loading="lazy"
							draggable="false"
						/>
					</div>

					<div class="min-w-0 flex-1 text-start">
						<div
							:class="[
								'text-[13px] font-semibold leading-5',
								checked ? 'text-gray-900 dark:text-gray-50' : 'text-gray-600 dark:text-gray-400',
							]"
						>
							{{ gateway.name }}
						</div>
						<div
							v-if="gateway.description"
							class="mt-0.5 line-clamp-2 text-[11px] leading-4 text-gray-500 dark:text-gray-500"
						>
							{{ gateway.description }}
						</div>
					</div>

					<div
						:class="[
							'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
							checked
								? 'border-blue-600 bg-blue-600 shadow-[0_0_0_3px_rgba(37,99,235,0.14)]'
								: 'border-gray-300/90 bg-transparent dark:border-gray-600',
						]"
					>
						<svg
							v-if="checked"
							class="h-2.5 w-2.5 text-white"
							viewBox="0 0 12 12"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M2.5 6L5 8.5L9.5 3.5"
								stroke="currentColor"
								stroke-width="1.75"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
			</RadioGroupOption>
		</div>
	</RadioGroup>
</template>

<script>
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';

export default {
	name: 'PaymentGatewayList',
	components: {
		RadioGroup,
		RadioGroupOption,
	},
	props: {
		modelValue: {
			type: Object,
			default: null,
		},
		gateways: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['update:modelValue'],
	computed: {
		selectedId() {
			return this.modelValue?.id ?? null;
		},
	},
	methods: {
		onSelect(gatewayId) {
			if (gatewayId === this.selectedId) {
				return;
			}

			const gateway = this.gateways.find((item) => item.id === gatewayId);
			if (gateway) {
				this.$emit('update:modelValue', gateway);
			}
		},
	},
};
</script>
