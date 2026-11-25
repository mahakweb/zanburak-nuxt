export const OTP_LENGTH = 6;

export function toEnglishDigits(str) {
	if (!str) return "";
	return String(str)
		.replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776 + 48))
		.replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48));
}

export function normalizeOtpCode(code, length = OTP_LENGTH) {
	const converted = toEnglishDigits(code);
	// Try to extract exact 6-digit code or fallback to numeric characters
	const match = converted.match(/\b\d{6}\b/) || converted.match(/\d{4,8}/);
	const raw = match ? match[0] : converted.replace(/\D/g, "");
	return raw.slice(0, length);
}

export function splitOtpDigits(code, length = OTP_LENGTH) {
	const digits = normalizeOtpCode(code, length);
	return Array.from({ length }, (_, i) => digits[i] || "");
}

export function isOtpComplete(otp, length = OTP_LENGTH) {
	return Array.isArray(otp) && otp.length === length && otp.every((digit) => digit !== "" && digit !== null && digit !== undefined);
}

export function syncOtpInputElements(inputRefs, otp) {
	if (typeof document === "undefined") return;

	// Resolve input elements from refs or query selector fallback
	let elements = Array.isArray(inputRefs) && inputRefs.filter(Boolean).length > 0 ? inputRefs : null;
	if (!elements || elements.length === 0) {
		const queried = document.querySelectorAll('input[id^="otp-part-"]');
		if (queried && queried.length > 0) {
			elements = Array.from(queried);
		}
	}

	if (!elements) return;

	elements.forEach((el, index) => {
		if (el && typeof el.value !== "undefined") {
			const val = (otp && otp[index]) || "";
			if (el.value !== val) {
				el.value = val;
			}
		}
	});
}
