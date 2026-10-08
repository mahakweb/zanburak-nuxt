<template>
	<Teleport to="body">
		<Transition name="pwa-banner">
			<div
				v-if="bannerVisible"
				class="pwa-install-banner font-YekanBakh"
				role="dialog"
				aria-live="polite"
				:aria-label="$t('pwa.install.ariaLabel')"
			>
				<div class="pwa-install-banner__inner">
					<div class="pwa-install-banner__glow" aria-hidden="true" />

					<img
						class="pwa-install-banner__logo"
						src="/assets/image/logo/icon-192x192.png"
						width="48"
						height="48"
						alt=""
					/>

					<div class="pwa-install-banner__copy">
						<p class="pwa-install-banner__title font-anjoman">{{ $t('pwa.install.title') }}</p>
						<p class="pwa-install-banner__desc">
							{{ isIos && !canInstall ? $t('pwa.install.iosHint') : $t('pwa.install.description') }}
						</p>
						<p v-if="isIos && !canInstall" class="pwa-install-banner__ios-steps">
							{{ $t('pwa.install.iosSteps') }}
						</p>
					</div>

					<div class="pwa-install-banner__actions">
						<button
							v-if="canInstall"
							type="button"
							class="pwa-install-banner__install"
							:disabled="installing"
							@click="onInstall"
						>
							<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<span>{{ installing ? $t('pwa.install.installing') : $t('pwa.install.cta') }}</span>
						</button>

						<button
							type="button"
							class="pwa-install-banner__close"
							:aria-label="$t('pwa.install.dismiss')"
							@click="dismissBanner"
						>
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M6 6l12 12M18 6L6 18"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script>
import { ref } from 'vue';
import { usePwaInstall } from '@/composables/usePwaInstall';

export default {
	name: 'PwaInstallBanner',
	setup() {
		const {
			canInstall,
			isIos,
			bannerVisible,
			promptInstall,
			dismissBanner,
		} = usePwaInstall();

		const installing = ref(false);

		async function onInstall() {
			if (installing.value) return;
			installing.value = true;
			try {
				await promptInstall();
			} finally {
				installing.value = false;
			}
		}

		return {
			canInstall,
			isIos,
			bannerVisible,
			dismissBanner,
			installing,
			onInstall,
		};
	},
};
</script>

<style scoped>
.pwa-install-banner {
	position: fixed;
	inset-inline: 0;
	top: 0;
	z-index: 2000000100;
	padding: calc(0.75rem + env(safe-area-inset-top, 0px)) 0.75rem 0;
	pointer-events: none;
}

.pwa-install-banner__inner {
	pointer-events: auto;
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	max-width: 36rem;
	margin-inline: auto;
	padding: 0.875rem 0.875rem 0.875rem 1rem;
	border-radius: 1.125rem;
	border: 1px solid rgb(253 224 71 / 0.55);
	background: linear-gradient(
		135deg,
		rgb(255 255 255 / 0.96) 0%,
		rgb(254 249 195 / 0.95) 55%,
		rgb(255 255 255 / 0.96) 100%
	);
	box-shadow:
		0 12px 40px rgb(15 23 42 / 0.14),
		0 2px 8px rgb(254 215 0 / 0.25),
		inset 0 1px 0 rgb(255 255 255 / 0.8);
	backdrop-filter: blur(14px);
	-webkit-backdrop-filter: blur(14px);
	overflow: hidden;
}

:global(.dark) .pwa-install-banner__inner {
	border-color: rgb(253 224 71 / 0.28);
	background: linear-gradient(
		135deg,
		rgb(15 23 42 / 0.96) 0%,
		rgb(30 41 59 / 0.96) 50%,
		rgb(15 23 42 / 0.96) 100%
	);
	box-shadow:
		0 16px 44px rgb(0 0 0 / 0.45),
		0 2px 10px rgb(254 215 0 / 0.12),
		inset 0 1px 0 rgb(255 255 255 / 0.06);
}

.pwa-install-banner__glow {
	position: absolute;
	inset-inline-start: -20%;
	top: -60%;
	width: 55%;
	height: 160%;
	background: radial-gradient(circle, rgb(254 215 0 / 0.28), transparent 68%);
	pointer-events: none;
}

.pwa-install-banner__logo {
	position: relative;
	width: 2.75rem;
	height: 2.75rem;
	border-radius: 0.75rem;
	object-fit: cover;
	flex-shrink: 0;
	box-shadow: 0 4px 12px rgb(254 215 0 / 0.35);
}

.pwa-install-banner__copy {
	position: relative;
	min-width: 0;
	flex: 1;
	text-align: start;
}

.pwa-install-banner__title {
	margin: 0;
	font-size: 1rem;
	font-weight: 800;
	letter-spacing: -0.01em;
	line-height: 1.4;
	color: rgb(28 25 23);
}

:global(.dark) .pwa-install-banner__title {
	color: rgb(254 243 199);
}

.pwa-install-banner__desc {
	margin: 0.25rem 0 0;
	font-size: 0.78rem;
	font-weight: 400;
	line-height: 1.65;
	color: rgb(87 83 78);
}

:global(.dark) .pwa-install-banner__desc {
	color: rgb(168 162 158);
}

.pwa-install-banner__ios-steps {
	margin: 0.35rem 0 0;
	font-size: 0.7rem;
	font-weight: 300;
	line-height: 1.55;
	color: rgb(120 113 108);
}

:global(.dark) .pwa-install-banner__ios-steps {
	color: rgb(168 162 158);
}

.pwa-install-banner__actions {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.35rem;
	flex-shrink: 0;
}

.pwa-install-banner__install {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.35rem;
	min-height: 2.35rem;
	padding: 0.45rem 0.95rem;
	border-radius: 0.8rem;
	border: none;
	background: linear-gradient(135deg, #fed700 0%, #f6ab00 100%);
	color: rgb(28 25 23);
	font-family: inherit;
	font-size: 0.84rem;
	font-weight: 700;
	line-height: 1;
	cursor: pointer;
	box-shadow: 0 4px 14px rgb(254 215 0 / 0.4);
	transition: transform 0.15s ease, filter 0.15s ease, opacity 0.15s ease;
}

.pwa-install-banner__install:hover:not(:disabled) {
	filter: brightness(1.04);
	transform: translateY(-1px);
}

.pwa-install-banner__install:active:not(:disabled) {
	transform: translateY(0);
}

.pwa-install-banner__install:disabled {
	opacity: 0.7;
	cursor: wait;
}

.pwa-install-banner__close {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.25rem;
	height: 2.25rem;
	border-radius: 0.75rem;
	border: none;
	background: transparent;
	color: rgb(120 113 108);
	cursor: pointer;
	transition: background 0.15s ease, color 0.15s ease;
}

.pwa-install-banner__close:hover {
	background: rgb(28 25 23 / 0.06);
	color: rgb(28 25 23);
}

:global(.dark) .pwa-install-banner__close {
	color: rgb(168 162 158);
}

:global(.dark) .pwa-install-banner__close:hover {
	background: rgb(255 255 255 / 0.08);
	color: rgb(250 250 249);
}

.pwa-banner-enter-active,
.pwa-banner-leave-active {
	transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.pwa-banner-enter-from,
.pwa-banner-leave-to {
	opacity: 0;
	transform: translateY(-120%);
}

@media (max-width: 420px) {
	.pwa-install-banner__inner {
		flex-wrap: wrap;
		padding: 0.75rem;
	}

	.pwa-install-banner__actions {
		width: 100%;
		justify-content: stretch;
		padding-inline-start: 3.5rem;
	}

	.pwa-install-banner__install {
		flex: 1;
	}
}
</style>
