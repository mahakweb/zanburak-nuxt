<template>
	<div v-if="visible" class="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl">
		<div class="installment-ribbon" :class="cornerClass">
			<span class="installment-ribbon__text">{{ $t('course.installment.badge') }}</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		allowsInstallment: {
			type: Boolean,
			default: false,
		},
		alternateCorner: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		visible() {
			return Boolean(this.allowsInstallment);
		},
		cornerClass() {
			return this.alternateCorner ? 'installment-ribbon--top-end' : 'installment-ribbon--bottom-start';
		},
	},
};
</script>

<style scoped>
.installment-ribbon {
	position: absolute;
	width: 5.5rem;
	height: 5.5rem;
	overflow: hidden;
	pointer-events: none;
}

.installment-ribbon--bottom-start {
	bottom: 0;
	inset-inline-start: 0;
}

.installment-ribbon--top-end {
	top: 0;
	inset-inline-end: 0;
}

.installment-ribbon__text {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 9rem;
	min-height: 1.5rem;
	padding: 0.45rem 0.75rem;
	font-size: 0.6875rem;
	font-weight: 700;
	line-height: 1;
	text-align: center;
	color: #fff;
	box-shadow: 0 3px 10px rgba(0, 0, 0, 0.28);
	background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
	white-space: nowrap;
	transform-origin: center center;
}

.installment-ribbon--bottom-start .installment-ribbon__text {
	bottom: 1.35rem;
	inset-inline-start: -2.35rem;
	transform: rotate(45deg);
}

[dir='rtl'] .installment-ribbon--bottom-start .installment-ribbon__text {
	transform: rotate(-45deg);
}

.installment-ribbon--top-end .installment-ribbon__text {
	top: 1.35rem;
	inset-inline-end: -2.35rem;
	transform: rotate(-45deg);
}

[dir='rtl'] .installment-ribbon--top-end .installment-ribbon__text {
	transform: rotate(45deg);
}
</style>
