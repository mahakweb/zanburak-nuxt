export const OTP_LENGTH = 6;

export function normalizeOtpCode(code, length = OTP_LENGTH) {
	return String(code ?? "").replace(/\D/g, "").slice(0, length);
}

export function splitOtpDigits(code, length = OTP_LENGTH) {
	const digits = normalizeOtpCode(code, length);
	return Array.from({ length }, (_, i) => digits[i] || "");
}

export function isOtpComplete(otp, length = OTP_LENGTH) {
	return otp.length === length && otp.every((digit) => digit !== "");
}

export function syncOtpInputElements(inputRefs, otp) {
	if (!inputRefs) return;
	inputRefs.forEach((el, index) => {
		if (el) el.value = otp[index] || "";
	});
}
