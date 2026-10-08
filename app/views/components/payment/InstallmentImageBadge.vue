<template>
	<span v-if="visible" class="installment-image-badge">{{ $t('course.installment.badgeShort') }}</span>
</template>

<script>
export default {
	props: {
		allowsInstallment: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		visible() {
			return Boolean(this.allowsInstallment);
		},
	},
};
</script>

<style scoped>
.installment-image-badge {
	position: absolute;
	top: 0;
	inset-inline-start: 0;
	z-index: 10;
	padding: 0.125rem 0.375rem;
	font-size: 0.5rem;
	font-weight: 800;
	line-height: 1.2;
	color: #fff;
	background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
	border-end-end-radius: 0.375rem;
	box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
	pointer-events: none;
	white-space: nowrap;
}
</style>
