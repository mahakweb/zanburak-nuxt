/**
 * Coordinates the early HTML splash (#zan-pwa-boot).
 * The visual splash lives in index.html so animation starts on first paint
 * and is never restarted by Vue.
 */
export function finishPwaBootSplash() {
	if (typeof window === 'undefined') return;
	const api = window.__zanPwaSplash;
	if (api && typeof api.markAppReady === 'function') {
		api.markAppReady();
	}
}

export function isPwaBootSplashActive() {
	if (typeof window === 'undefined') return false;
	return Boolean(window.__zanPwaSplash && window.__zanPwaSplash.active);
}
