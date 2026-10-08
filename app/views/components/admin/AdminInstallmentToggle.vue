<template>
	<div
		class="relative overflow-hidden rounded-2xl border transition-all duration-300"
		:class="modelValue
			? 'border-sky-300/80 bg-gradient-to-br from-sky-50 via-white to-blue-50/60 dark:from-sky-950/40 dark:via-gray-900 dark:to-blue-950/30 dark:border-sky-500/40 shadow-sm shadow-sky-100/80 dark:shadow-none'
			: 'border-gray-200/80 bg-gray-50/50 dark:bg-gray-800/30 dark:border-gray-700/80'"
	>
		<div class="absolute -top-8 -end-8 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />
		<div class="relative flex items-start gap-4 p-4">
			<div
				class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors"
				:class="modelValue ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'bg-gray-200/80 text-gray-500 dark:bg-gray-700 dark:text-gray-400'"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" />
				</svg>
			</div>
			<div class="min-w-0 flex-1">
				<div class="flex items-center justify-between gap-3">
					<h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ title }}</h4>
					<AdminToggleSwitch :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
				</div>
				<p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">{{ description }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import AdminToggleSwitch from '@/views/components/admin/AdminToggleSwitch.vue';

export default {
	components: { AdminToggleSwitch },
	props: {
		modelValue: { type: Boolean, default: false },
		title: { type: String, default: 'خرید اقساطی' },
		description: {
			type: String,
			default: 'امکان پرداخت اقساطی با دیجی‌پی برای این مورد فعال می‌شود.',
		},
	},
	emits: ['update:modelValue'],
};
</script>
