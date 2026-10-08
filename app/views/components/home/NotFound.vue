<template>
	<MasterPage>
		<div class="mx-auto flex min-h-[calc(100vh-12rem)] max-w-screen-xl items-center justify-center px-4 py-12 md:px-8">
			<div
				class="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-600/40 dark:bg-gray-900">
				<!-- illustration -->
				<div
					class="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-50/80 px-6 pt-10 pb-8 dark:from-yellow-500/5 dark:via-gray-900 dark:to-amber-500/5">
					<div
						class="pointer-events-none absolute -start-8 -top-8 h-32 w-32 rounded-full bg-yellow-200/40 blur-2xl dark:bg-yellow-500/10" />
					<div
						class="pointer-events-none absolute -bottom-6 end-0 h-28 w-28 rounded-full bg-amber-300/30 blur-2xl dark:bg-amber-400/10" />
					<svg
						class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35] dark:opacity-[0.12]"
						xmlns="http://www.w3.org/2000/svg">
						<defs>
							<pattern id="notfound-grid" width="20" height="20" patternUnits="userSpaceOnUse">
								<circle cx="1" cy="1" r="0.8" fill="currentColor" class="text-yellow-400/60" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#notfound-grid)" />
					</svg>

					<div class="relative mx-auto flex h-40 w-full max-w-[15rem] items-end justify-center">
						<svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-full w-full">
							<!-- shadow -->
							<ellipse cx="100" cy="138" rx="52" ry="6"
								class="fill-gray-300/50 dark:fill-gray-700/40" />
							<!-- browser window -->
							<rect x="38" y="28" width="124" height="96" rx="10"
								class="fill-white stroke-gray-200 dark:fill-gray-800 dark:stroke-gray-600"
								stroke-width="2" />
							<rect x="38" y="28" width="124" height="22" rx="10"
								class="fill-gray-100 dark:fill-gray-700/80" />
							<rect x="38" y="40" width="124" height="10" class="fill-gray-100 dark:fill-gray-700/80" />
							<circle cx="52" cy="39" r="3" class="fill-rose-400" />
							<circle cx="62" cy="39" r="3" class="fill-amber-400" />
							<circle cx="72" cy="39" r="3" class="fill-emerald-400" />
							<!-- broken page lines -->
							<rect x="54" y="62" width="56" height="5" rx="2.5"
								class="fill-gray-200 dark:fill-gray-600" />
							<rect x="54" y="74" width="40" height="5" rx="2.5"
								class="fill-gray-200 dark:fill-gray-600" />
							<rect x="54" y="86" width="48" height="5" rx="2.5"
								class="fill-gray-200 dark:fill-gray-600" />
							<!-- broken link icon -->
							<path
								d="M118 78C118 74.134 121.134 71 125 71H131C134.866 71 138 74.134 138 78C138 81.866 134.866 85 131 85H125"
								class="stroke-amber-400 dark:stroke-yellow-400" stroke-width="3" stroke-linecap="round"
								fill="none" />
							<path
								d="M82 78C82 81.866 78.866 85 75 85H69C65.134 85 62 81.866 62 78C62 74.134 65.134 71 69 71H75"
								class="stroke-amber-400 dark:stroke-yellow-400" stroke-width="3" stroke-linecap="round"
								fill="none" />
							<path d="M92 78H108" class="stroke-rose-400" stroke-width="3" stroke-linecap="round"
								stroke-dasharray="4 4" />
							<!-- magnifying glass -->
							<circle cx="148" cy="52" r="16"
								class="fill-yellow-100 stroke-amber-400 dark:fill-yellow-500/15 dark:stroke-yellow-400"
								stroke-width="3" />
							<path d="M160 64L172 76" class="stroke-amber-500 dark:stroke-yellow-400" stroke-width="4"
								stroke-linecap="round" />
							<text x="148" y="57" text-anchor="middle" class="fill-amber-600 dark:fill-yellow-300"
								font-size="13" font-weight="700" font-family="system-ui, sans-serif">?</text>
							<!-- floating 404 digits -->
							<text x="22" y="58" class="fill-yellow-400/70 dark:fill-yellow-400/40" font-size="22"
								font-weight="800" font-family="system-ui, sans-serif">4</text>
							<text x="168" y="118" class="fill-amber-400/60 dark:fill-amber-400/35" font-size="18"
								font-weight="800" font-family="system-ui, sans-serif">4</text>
						</svg>
						<span
							class="absolute start-0 top-0 rounded-lg bg-gray-900 px-2.5 py-0.5 text-xs font-bold tracking-wide text-yellow-400 shadow-sm dark:bg-yellow-400 dark:text-gray-900">
							404
						</span>
					</div>
				</div>

				<!-- content -->
				<div class="px-6 pb-8 pt-6 text-center">
					<h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">
						{{ $t('error.pageNotFound') }}
					</h1>
					<p class="mx-auto mt-3 max-w-sm text-sm leading-7 text-gray-500 dark:text-gray-400">
						{{
							$t(
								'error.pageNotFoundDesc'
							)
						}}.
					</p>

					<div
						v-if="attemptedPath"
						class="mx-auto mt-5 flex max-w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-500 ring-1 ring-gray-200/80 dark:bg-gray-800/50 dark:text-gray-400 dark:ring-gray-700/50">
						<svg class="h-3.5 w-3.5 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor"
								stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor"
								stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<span dir="ltr" class="truncate font-medium">{{ attemptedPath }}</span>
					</div>

					<div class="mt-7 flex flex-wrap items-center justify-center gap-3">
						<router-link
							:to="{ name: 'home' }"
							class="group inline-flex h-10 select-none items-center gap-2 rounded-lg bg-yellow-400 px-5 text-sm font-semibold text-gray-900 transition hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
							<span class="flex items-center gap-2 group-active:[transform:translate3d(0,1px,0)]">
								<svg class="h-4 w-4 rtl:-mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
										stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
									<path d="M9 21V12H15V21" stroke="currentColor" stroke-width="1.5"
										stroke-linejoin="round" />
								</svg>
								{{ $t('error.returnHome') }}
							</span>
						</router-link>
						<button
							type="button"
							@click="goBack"
							class="group inline-flex h-10 select-none items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
							<span class="flex items-center gap-2 group-active:[transform:translate3d(0,1px,0)]">
								{{ $t('error.goBack') }}
								<svg class="h-4 w-4 ltr:rotate-180" viewBox="0 0 24 24" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="currentColor" stroke-width="1.5"
										stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
						</button>
					</div>

					<router-link
						:to="{ name: 'courses' }"
						class="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 transition hover:text-amber-700 dark:text-yellow-400 dark:hover:text-yellow-300">
						{{ $t('error.browseCourses') }}
						<svg class="h-4 w-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="1.5"
								stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</router-link>
				</div>
			</div>
		</div>
	</MasterPage>
</template>

<script>
import MasterPage from '@/views/page/layouts/MasterPage.vue';
import { useSEO } from '@/composables/useSEO';

export default {
	name: 'NotFound',
	components: { MasterPage },
	computed: {
		attemptedPath() {
			const path = this.$route.path;
			return path && path !== '/' ? path : null;
		},
	},
	mounted() {
		useSEO({
			title: this.$t('error.pageNotFound'),
			description: this.$t('error.pageNotFoundDesc'),
			url: this.$route.fullPath,
			noindex: true,
			nofollow: true,
		});
	},
	methods: {
		goBack() {
			if (window.history.length > 1) {
				this.$router.back();
			} else {
				this.$router.push({ name: 'home' });
			}
		},
	},
};
</script>
