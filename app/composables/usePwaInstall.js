import { ref, onMounted } from 'vue';

const DISMISS_KEY = 'zanburak-pwa-install-dismissed';
const DISMISS_DAYS = 3;

const deferredPrompt = ref(null);
const canInstall = ref(false);
const isStandalone = ref(false);
const isIos = ref(false);
const bannerVisible = ref(false);
/** Survives repeated beforeinstallprompt events in the same page. localStorage covers the next visit. */
let dismissedThisSession = false;

function readDismissed() {
	try {
		const raw = localStorage.getItem(DISMISS_KEY);
		if (!raw) return false;
		const until = Number(raw);
		if (!Number.isFinite(until)) return false;
		if (Date.now() > until) {
			localStorage.removeItem(DISMISS_KEY);
			return false;
		}
		return true;
	} catch {
		return false;
	}
}

function detectStandalone() {
	return (
		window.matchMedia('(display-mode: standalone)').matches ||
		window.matchMedia('(display-mode: fullscreen)').matches ||
		window.navigator.standalone === true
	);
}

function detectIos() {
	const ua = window.navigator.userAgent || '';
	const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
	return iOS && !window.MSStream;
}

function isDismissed() {
	if (dismissedThisSession) return true;
	if (readDismissed()) {
		dismissedThisSession = true;
		return true;
	}
	return false;
}

let showTimer = null;

function rememberDismiss() {
	dismissedThisSession = true;
	bannerVisible.value = false;
	if (showTimer) {
		clearTimeout(showTimer);
		showTimer = null;
	}
	try {
		localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 86400000));
	} catch {
		/* ignore */
	}
}

function shouldShowBanner() {
	if (detectStandalone()) return false;
	if (isDismissed()) return false;
	return canInstall.value || isIos.value;
}

function onBeforeInstallPrompt(e) {
	e.preventDefault();
	deferredPrompt.value = e;
	canInstall.value = true;
	if (shouldShowBanner()) {
		scheduleShow();
	}
}

function onAppInstalled() {
	deferredPrompt.value = null;
	canInstall.value = false;
	rememberDismiss();
}

function scheduleShow() {
	if (isDismissed()) return;
	if (showTimer) clearTimeout(showTimer);
	showTimer = setTimeout(() => {
		showTimer = null;
		if (shouldShowBanner()) bannerVisible.value = true;
	}, 2200);
}

let listenersReady = false;

export function initPwaInstallListeners() {
	if (listenersReady || typeof window === 'undefined') return;
	listenersReady = true;
	isStandalone.value = detectStandalone();
	isIos.value = detectIos();
	window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
	window.addEventListener('appinstalled', onAppInstalled);
	if (!isStandalone.value && isIos.value && !isDismissed()) {
		scheduleShow();
	}
}

export function usePwaInstall() {
	onMounted(() => {
		initPwaInstallListeners();
		if (!isStandalone.value && isIos.value && !isDismissed()) {
			scheduleShow();
		}
	});

	async function promptInstall() {
		if (!deferredPrompt.value) return false;
		const promptEvent = deferredPrompt.value;
		deferredPrompt.value = null;
		canInstall.value = false;
		promptEvent.prompt();
		const { outcome } = await promptEvent.userChoice;
		rememberDismiss();
		return outcome === 'accepted';
	}

	function dismissBanner() {
		rememberDismiss();
	}

	function hideBanner() {
		bannerVisible.value = false;
	}

	return {
		deferredPrompt,
		canInstall,
		isStandalone,
		isIos,
		bannerVisible,
		promptInstall,
		dismissBanner,
		hideBanner,
	};
}

export async function promptPwaInstall() {
	if (!deferredPrompt.value) return false;
	const promptEvent = deferredPrompt.value;
	deferredPrompt.value = null;
	canInstall.value = false;
	promptEvent.prompt();
	const { outcome } = await promptEvent.userChoice;
	rememberDismiss();
	return outcome === 'accepted';
}

export function getPwaInstallState() {
	return {
		canInstall: canInstall.value || !!deferredPrompt.value,
		isStandalone: isStandalone.value || detectStandalone(),
		isIos: isIos.value || detectIos(),
		hasDeferredPrompt: !!deferredPrompt.value,
	};
}

export function registerPwaServiceWorker() {
	if (!('serviceWorker' in navigator)) return;

	const register = () => {
		navigator.serviceWorker
			.register('/sw.js', { scope: '/' })
			.catch((err) => {
				if (process.env.NODE_ENV === 'development') {
					console.warn('[PWA] SW registration failed:', err);
				}
			});
	};

	if (document.readyState === 'complete') {
		register();
	} else {
		window.addEventListener('load', register, { once: true });
	}
}
