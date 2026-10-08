import zibalIcon from '@/assets/image/gateways/has-bg/zibal.png';
import zarinpalIcon from '@/assets/image/gateways/has-bg/zarinpal.png';
import digipayIcon from '@/assets/image/gateways/has-bg/digipay.png';

export function buildPaymentGateways(t) {
	return [
		{
			id: 'zibal',
			driver: 'zibal',
			english_name: 'zibal',
			directBank: true,
			commissionPercent: 0,
			name: t('cart.gatewayZibal'),
			description: t('cart.gatewayZibalDesc'),
			icon: zibalIcon,
		},
		{
			id: 'zarinpal',
			driver: 'zarinpal',
			english_name: 'zarinpal',
			directBank: true,
			commissionPercent: 0,
			name: t('cart.gatewayZarinpal'),
			description: t('cart.gatewayZarinpalDesc'),
			icon: zarinpalIcon,
		},
		{
			id: 'digipay-installment',
			driver: 'digipay',
			english_name: 'digipay',
			digipayUnified: true,
			requiresInstallment: true,
			commissionPercent: 15,
			name: t('cart.gatewayDigipayInstallment'),
			description: t('cart.gatewayDigipayInstallmentDesc'),
			icon: digipayIcon,
		},
		{
			id: 'digipay-ipg',
			driver: 'digipay',
			english_name: 'digipay',
			preferredGateway: 2,
			directBank: true,
			cartHidden: true,
			commissionPercent: 0,
			name: t('cart.gatewayDigipayIpg'),
			description: t('cart.gatewayDigipayIpgDesc'),
			icon: digipayIcon,
		},
	];
}

export function filterDirectBankGateways(gateways) {
	return gateways.filter((gateway) => gateway.directBank);
}

export function getDefaultGateway(gateways) {
	return gateways.find((gateway) => gateway.id === 'zibal') || gateways[0] || null;
}

export function findGatewayById(gateways, id) {
	return gateways.find((gateway) => gateway.id === id) || null;
}

export function findGatewayByDriver(gateways, driver, variantId = null) {
	if (variantId) {
		const byVariant = findGatewayByVariant(gateways, variantId);
		if (byVariant) {
			return byVariant;
		}
	}

	const match = gateways.find((gateway) => gateway.driver === driver || gateway.english_name === driver);

	return match || {
		name: driver,
		icon: null,
	};
}

const LEGACY_DIGIPAY_VARIANT_MAP = {
	'digipay-wallet': 'digipay-installment',
	'digipay-facilities': 'digipay-installment',
	'digipay-credit': 'digipay-installment',
	digipay: 'digipay-installment',
};

export function findGatewayByVariant(gateways, variantId) {
	if (!variantId) {
		return null;
	}

	const normalizedId = LEGACY_DIGIPAY_VARIANT_MAP[variantId] || variantId;

	return gateways.find((gateway) => gateway.id === normalizedId) || null;
}

export function isInstallmentGateway(gateway) {
	return Boolean(gateway?.requiresInstallment || gateway?.digipayUnified);
}

export function isDigipayFeeGateway(gateway) {
	return gateway?.id === 'digipay-installment' || Boolean(gateway?.digipayUnified);
}

export function cartHasInstallmentEligibleItems(cartItems) {
	return (cartItems || []).some((item) => Boolean(item?.allows_installment));
}

export function filterGatewaysForCart(gateways, cartItems) {
	const hasInstallmentItems = cartHasInstallmentEligibleItems(cartItems);

	return (gateways || []).filter((gateway) => {
		if (gateway.cartHidden) {
			return false;
		}

		if (!isInstallmentGateway(gateway)) {
			return true;
		}

		return hasInstallmentItems;
	});
}

export function gatewayRequestPayload(gateway) {
	const payload = gatewayPayPayload(gateway);

	if (payload.driver) {
		payload.gateway = payload.driver;
		delete payload.driver;
	}

	return payload;
}

export function gatewayPayPayload(gateway) {
	if (!gateway) {
		return {};
	}

	const payload = {
		driver: gateway.driver || gateway.english_name,
	};

	if (payload.driver === 'digipay') {
		if (gateway.digipayUnified) {
			payload.digipay_unified = true;
		} else {
			if (gateway.preferredGateway !== undefined && gateway.preferredGateway !== null) {
				payload.digipay_preferred_gateway = gateway.preferredGateway;
			}
			if (gateway.digipayMode) {
				payload.digipay_mode = gateway.digipayMode;
			}
		}
	}

	return payload;
}

export function getGatewayCommissionPercent(gateway) {
	return Number(gateway?.commissionPercent || 0);
}

export function applyGatewayCommission(baseAmount, percent) {
	const base = Math.max(0, Number(baseAmount) || 0);
	const rate = Number(percent) || 0;

	if (!rate || !base) {
		return {
			baseAmount: base,
			feeAmount: 0,
			chargedAmount: base,
		};
	}

	const feeAmount = Math.round(base * rate / 100);

	return {
		baseAmount: base,
		feeAmount,
		chargedAmount: base + feeAmount,
	};
}

export function getCartItemBasePrice(item) {
	const current = item?.current_price ?? item?.cart_price ?? item?.final_price;
	if (current != null && current !== "") {
		return Math.max(0, Number(current) || 0);
	}
	return Math.max(0, Number(item?.price || 0) - Number(item?.discount_amount || 0));
}

export function getCartItemTitle(item, t) {
	if (item?.type === 'course') {
		return `${t('cart.coursePrefix')} ${item.course?.title || ''}`.trim();
	}
	if (item?.type === 'path') {
		return `${t('cart.pathPrefix')} ${item.path?.title || ''}`.trim();
	}
	if (item?.type === 'vip') {
		return `${t('cart.vipPrefix')} ${item.vip?.title || ''}`.trim();
	}

	return '';
}

export function getItemGatewayCommissionPercent(gateway, item, paymentMethod = 'bank') {
	if (paymentMethod !== 'bank') {
		return 0;
	}

	const percent = getGatewayCommissionPercent(gateway);

	if (!percent) {
		return 0;
	}

	if (isDigipayFeeGateway(gateway)) {
		return item?.allows_installment ? percent : 0;
	}

	return percent;
}

export function calculateCartGatewayPricing(cartItems, gateway, paymentMethod = 'bank') {
	let baseTotal = 0;
	let feeTotal = 0;
	let chargedTotal = 0;

	const items = (cartItems || []).map((item) => {
		const basePrice = getCartItemBasePrice(item);
		const itemCommissionPercent = getItemGatewayCommissionPercent(gateway, item, paymentMethod);
		const breakdown = applyGatewayCommission(basePrice, itemCommissionPercent);

		baseTotal += breakdown.baseAmount;
		feeTotal += breakdown.feeAmount;
		chargedTotal += breakdown.chargedAmount;

		return {
			id: item.id,
			type: item.type,
			title: '',
			basePrice: breakdown.baseAmount,
			feeAmount: breakdown.feeAmount,
			chargedPrice: breakdown.chargedAmount,
			hasFee: breakdown.feeAmount > 0,
			allowsInstallment: Boolean(item?.allows_installment),
		};
	});

	const commissionPercent = paymentMethod === 'bank'
		? getGatewayCommissionPercent(gateway)
		: 0;

	return {
		commissionPercent,
		hasFee: feeTotal > 0,
		baseTotal,
		feeTotal,
		chargedTotal,
		items,
	};
}
