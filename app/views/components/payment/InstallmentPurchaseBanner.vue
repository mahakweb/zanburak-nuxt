<template>
	<section
		v-if="allowsInstallment"
		class="installment-purchase-banner"
		:class="{ 'installment-purchase-banner--inline': variant === 'inline' }"
	>
		<h3 v-if="variant !== 'inline'" class="installment-purchase-banner__heading">
			{{ $t('course.installment.sectionTitle') }}
		</h3>
		<div class="installment-purchase-banner__card">
			<img
				:src="digipayIcon"
				alt="DigiPay"
				class="installment-purchase-banner__logo"
				loading="lazy"
			/>
			<div class="min-w-0 flex-1 text-start">
				<p class="installment-purchase-banner__title">{{ $t('cart.gatewayDigipayInstallment') }}</p>
				<p class="installment-purchase-banner__desc">{{ $t('cart.gatewayDigipayInstallmentDesc') }}</p>
			</div>
		</div>
	</section>
</template>

<script>
import digipayIcon from '@/assets/image/gateways/has-bg/digipay.png';

export default {
	props: {
		allowsInstallment: {
			type: Boolean,
			default: false,
		},
		variant: {
			type: String,
			default: 'default',
			validator: (value) => ['default', 'inline'].includes(value),
		},
	},
	data() {
		return { digipayIcon };
	},
};
</script>

<style scoped>
.installment-purchase-banner__heading {
	font-size: 0.9375rem;
	font-weight: 800;
	color: rgb(15 23 42);
	margin-bottom: 0.75rem;
	text-align: start;
}

:global(.dark) .installment-purchase-banner__heading {
	color: rgb(248 250 252);
}

.installment-purchase-banner__card {
	display: flex;
	align-items: center;
	gap: 0.875rem;
	padding: 1rem 1.125rem;
	border-radius: 1rem;
	border: 1px solid rgb(226 232 240);
	background: #fff;
}

:global(.dark) .installment-purchase-banner__card {
	border-color: rgb(51 65 85 / 0.6);
	background: rgb(15 23 42);
}

.installment-purchase-banner--inline .installment-purchase-banner__card {
	padding: 0.75rem 1rem;
	border-radius: 0.875rem;
	border-color: rgb(191 219 254 / 0.8);
	background: linear-gradient(135deg, rgb(239 246 255) 0%, rgb(255 255 255) 100%);
}

:global(.dark) .installment-purchase-banner--inline .installment-purchase-banner__card {
	border-color: rgb(37 99 235 / 0.35);
	background: linear-gradient(135deg, rgb(15 23 42) 0%, rgb(30 41 59 / 0.85) 100%);
}

.installment-purchase-banner__logo {
	width: 2.75rem;
	height: 2.75rem;
	border-radius: 0.625rem;
	object-fit: contain;
	flex-shrink: 0;
}

.installment-purchase-banner--inline .installment-purchase-banner__logo {
	width: 2.25rem;
	height: 2.25rem;
}

.installment-purchase-banner__title {
	font-size: 0.875rem;
	font-weight: 700;
	color: rgb(15 23 42);
	line-height: 1.4;
}

:global(.dark) .installment-purchase-banner__title {
	color: rgb(248 250 252);
}

.installment-purchase-banner__desc {
	margin-top: 0.2rem;
	font-size: 0.75rem;
	line-height: 1.55;
	color: rgb(100 116 139);
}

:global(.dark) .installment-purchase-banner__desc {
	color: rgb(148 163 184);
}

.installment-purchase-banner--inline .installment-purchase-banner__desc {
	font-size: 0.6875rem;
}
</style>
