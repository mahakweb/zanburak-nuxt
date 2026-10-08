<template>
	<ProfileMasterPage>
		<div class="mb-5 last:mb-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
			<div class="flex items-center gap-3 mb-5">
				<span class="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
					</svg>
				</span>
				<h2 class="text-gray-800 dark:text-white font-bold text-base md:text-lg">{{ $t('profile.nav.invite') }}</h2>
			</div>

			<!-- Loading skeleton -->
			<div v-if="loading" class="space-y-5">
				<!-- HERO skeleton -->
				<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-6 shadow-xl">
					<div class="pointer-events-none absolute -top-24 -end-16 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl"></div>
					<div class="relative grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center">
						<div class="lg:col-span-2 flex flex-col items-center lg:items-start">
							<div class="animate-pulse h-6 w-28 rounded-full bg-white/10 mb-4"></div>
							<div class="animate-pulse w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white/10 mb-4"></div>
							<div class="animate-pulse h-4 w-48 rounded-full bg-white/10 mb-3"></div>
							<div class="animate-pulse h-3 w-56 rounded-full bg-white/5"></div>
						</div>
						<div class="lg:col-span-3 space-y-4">
							<div class="rounded-2xl bg-white/95 dark:bg-gray-800/90 p-4 shadow-lg">
								<div class="animate-pulse h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-3"></div>
								<div class="animate-pulse h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
							</div>
							<div class="rounded-2xl bg-white/95 dark:bg-gray-800/90 p-4 shadow-lg">
								<div class="animate-pulse h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-3"></div>
								<div class="animate-pulse h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-700 mb-3.5"></div>
								<div class="flex items-center justify-end gap-2">
									<div v-for="i in 3" :key="i" class="animate-pulse w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- STAT skeleton -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div v-for="i in 2" :key="i" class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
						<div class="flex items-center gap-3">
							<div class="animate-pulse w-10 h-10 rounded-2xl bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
							<div class="flex-1 space-y-2.5">
								<div class="animate-pulse h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
								<div class="animate-pulse h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- INVITED LIST skeleton -->
				<div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
					<div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
						<div class="animate-pulse h-4 w-40 rounded-full bg-gray-200 dark:bg-gray-700"></div>
						<div class="animate-pulse h-6 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
					</div>
					<div class="divide-y divide-gray-50 dark:divide-gray-800/60">
						<div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 md:px-4 md:py-3.5">
							<div class="animate-pulse w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
							<div class="flex-1 space-y-2">
								<div class="animate-pulse h-3 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
								<div class="animate-pulse h-2.5 w-44 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							</div>
							<div class="animate-pulse h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
						</div>
					</div>
				</div>
			</div>

			<div v-else class="space-y-5">
				<!-- ===================== HERO ===================== -->
				<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-6 shadow-xl">
					<!-- Decorative glows -->
					<div class="pointer-events-none absolute -top-24 -end-16 h-64 w-64 rounded-full bg-amber-500/25 blur-3xl"></div>
					<div class="pointer-events-none absolute -bottom-24 -start-16 h-64 w-64 rounded-full bg-yellow-400/15 blur-3xl"></div>
					<div class="pointer-events-none absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(circle at 2px 2px, #fff 1px, transparent 0); background-size: 26px 26px;"></div>

					<div class="relative grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center">
						<!-- Left: message + illustration -->
						<div class="lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-start">
							<span class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] md:text-xs font-bold text-amber-300 mb-4">
								<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
									<path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clip-rule="evenodd"></path>
								</svg>
								{{ $t('profile.nav.invite') }}
							</span>
							<div class="w-20 h-20 md:w-28 md:h-28 mb-4 drop-shadow-2xl">
								<img
									src="@/assets/image/other/undraw_add-friends.svg"
									:alt="$t('profile.nav.invite')"
									class="w-full h-full object-contain"
								/>
							</div>
							<h3 class="text-base md:text-lg font-bold text-white leading-snug mb-2">{{ $t('profile.invite.heading') }}</h3>
							<p class="text-xs md:text-sm text-gray-300/90 leading-6 max-w-sm">{{ $t('profile.invite.subheading') }}</p>
						</div>

						<!-- Right: code, link, share -->
						<div class="lg:col-span-3 space-y-4">
							<!-- کد دعوت -->
							<div class="rounded-2xl bg-white/95 dark:bg-gray-800/90 backdrop-blur p-4 shadow-lg ring-1 ring-white/10">
								<label class="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5">
									<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
									</svg>
									{{ $t('profile.invite.yourCode') }}
								</label>
								<div class="flex items-center gap-2 rounded-xl border-2 border-dashed border-amber-400/60 dark:border-amber-500/50 bg-amber-50/60 dark:bg-amber-900/10 px-3 md:px-4 py-3">
									<span class="flex-1 text-center text-lg md:text-xl font-black tracking-[0.2em] font-mono text-gray-900 dark:text-white break-all" dir="ltr">{{ referralCode }}</span>
									<button
										@click="copyReferralCode"
										class="flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all touch-manipulation shadow-sm active:scale-95"
										:class="copiedCode ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 hover:shadow-md'"
									>
										<svg v-if="!copiedCode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
										</svg>
										<svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
										</svg>
										<span class="hidden sm:inline">{{ copiedCode ? $t('profile.invite.codeCopied') : $t('profile.invite.copy') }}</span>
									</button>
								</div>
							</div>

							<!-- لینک دعوت -->
							<div class="rounded-2xl bg-white/95 dark:bg-gray-800/90 backdrop-blur p-4 shadow-lg ring-1 ring-white/10">
								<label class="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5">
									<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5m8.656-1.828l1.5-1.5a4 4 0 10-5.656-5.656l-3 3a4 4 0 000 5.656"></path>
									</svg>
									{{ $t('profile.invite.inviteLink') }}
								</label>
								<div class="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 px-3 md:px-4 py-2.5">
									<span class="flex-1 text-[11px] md:text-sm text-gray-600 dark:text-gray-300 word-break-all" dir="ltr">{{ inviteLink }}</span>
									<button
										@click="copyInviteLink"
										class="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg transition-all touch-manipulation active:scale-95"
										:class="copiedLink ? 'bg-green-500 text-white' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50'"
									>
										<svg v-if="!copiedLink" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
										</svg>
										<svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
										</svg>
									</button>
								</div>

								<!-- Share buttons -->
								<div class="mt-3.5 flex items-center gap-2">
									<span class="text-[11px] md:text-xs font-semibold text-gray-400 dark:text-gray-500 me-1">{{ $t('profile.invite.shareHint') }}</span>
									<div class="flex items-center gap-2 ms-auto">
										<a :href="telegramShareUrl" target="_blank" rel="noopener" aria-label="Telegram"
											class="w-9 h-9 flex items-center justify-center rounded-full bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all active:scale-95">
											<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
										</a>
										<a :href="whatsappShareUrl" target="_blank" rel="noopener" aria-label="WhatsApp"
											class="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all active:scale-95">
											<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.01 2C6.5 2 2.02 6.48 2.02 12c0 1.77.46 3.45 1.34 4.95L2 22l5.2-1.36c1.45.79 3.08 1.21 4.81 1.21 5.51 0 9.99-4.48 9.99-10S17.52 2 12.01 2z"/></svg>
										</a>
										<a :href="twitterShareUrl" target="_blank" rel="noopener" aria-label="X"
											class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-500/10 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white transition-all active:scale-95">
											<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
										</a>
										<button v-if="canNativeShare" @click="nativeShare" aria-label="Share"
											class="w-9 h-9 flex items-center justify-center rounded-full bg-amber-400/15 text-amber-500 hover:bg-amber-400 hover:text-gray-900 transition-all active:scale-95">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- ===================== STAT ===================== -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
						<span class="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500"></span>
						<div class="flex items-center gap-3 ms-1.5">
							<div class="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
								</svg>
							</div>
							<div>
								<p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ $t('profile.invite.totalInvited') }}</p>
								<p class="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white leading-tight">{{ totalInvited.toLocaleString() }}</p>
							</div>
						</div>
					</div>
					<div class="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
						<span class="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500"></span>
						<div class="flex items-center gap-3 ms-1.5">
							<div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
							<div>
								<p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ $t('profile.invite.heading') }}</p>
								<p class="text-sm font-bold text-gray-700 dark:text-gray-200 leading-tight mt-0.5">{{ $t('profile.invite.shareHint') }}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- ===================== INVITED LIST ===================== -->
				<div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
					<div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
						<h3 class="text-gray-700 dark:text-gray-200 font-bold text-sm md:text-base flex items-center gap-2">
							<span class="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center">
								<svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
								</svg>
							</span>
							{{ $t('profile.invite.invitedPeople') }}
						</h3>
						<span v-if="invitedUsers.length" class="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-bold text-gray-600 dark:text-gray-300">
							{{ pagination.total.toLocaleString() }}
						</span>
					</div>

					<div v-if="invitedUsers.length === 0" class="p-8 md:p-12 text-center">
						<div class="w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 opacity-60">
							<img
								src="@/assets/image/other/undraw_add-friends.svg"
								:alt="$t('profile.nav.invite')"
								class="w-full h-full object-contain"
							/>
						</div>
						<p class="text-sm md:text-base text-gray-600 dark:text-gray-300 font-semibold">{{ $t('profile.invite.noneInvited') }}</p>
						<p class="text-xs md:text-sm text-gray-400 dark:text-gray-500 mt-1.5">{{ $t('profile.invite.shareHint') }}</p>
					</div>

					<div v-else class="divide-y divide-gray-50 dark:divide-gray-800/60">
						<div
							v-for="(user, index) in invitedUsers"
							:key="user.id"
							class="flex items-center gap-3 p-3 md:px-4 md:py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
						>
							<span class="hidden sm:flex w-6 flex-shrink-0 items-center justify-center text-xs font-bold text-gray-300 dark:text-gray-600">
								{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
							</span>
							<div class="relative w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 ring-2 ring-white dark:ring-gray-900 shadow-md">
								<img
									v-if="user.profile_pic"
									:src="user.profile_pic"
									:alt="user.first_name + ' ' + user.last_name"
									class="w-full h-full object-cover"
								/>
								<div v-else class="w-full h-full flex items-center justify-center text-white">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
									</svg>
								</div>
							</div>

							<div class="flex-1 min-w-0">
								<p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
									{{ user.first_name }} {{ user.last_name }}
								</p>
								<div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
									<span v-if="user.username" class="truncate max-w-[120px] sm:max-w-none" dir="ltr">@{{ user.username }}</span>
									<span v-if="user.username" class="text-gray-300 dark:text-gray-600">•</span>
									<span class="inline-flex items-center gap-1 flex-shrink-0">
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
										</svg>
										{{ user.joined_at_jalali }}
									</span>
								</div>
							</div>

							<span class="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2.5 py-1 text-[10px] sm:text-xs font-semibold">
								<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
								</svg>
								<span class="hidden sm:inline">{{ $t('profile.invite.joined') }}</span>
							</span>
						</div>
					</div>

					<!-- Pagination -->
					<div v-if="pagination.last_page > 1" class="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
							<div class="flex items-center gap-2">
								<label class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{{ $t('profile.invite.show') }}</label>
								<select v-model="pagination.per_page" @change="changePerPage"
									class="h-8 font-semibold focus:outline-none bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-amber-500 focus:border-amber-500 px-2 text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500">
									<option :value="10">10</option>
									<option :value="15">15</option>
									<option :value="20">20</option>
									<option :value="50">50</option>
								</select>
							</div>
							<div class="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-start">
								{{ $t('profile.invite.showingRange', {
									from: (pagination.current_page - 1) * pagination.per_page + 1,
									to: Math.min(pagination.current_page * pagination.per_page, pagination.total),
									total: pagination.total
								}) }}
							</div>
						</div>
						<div class="flex items-center justify-center gap-2">
							<button
								@click="loadPage(pagination.current_page - 1)"
								:disabled="pagination.current_page === 1"
								class="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all touch-manipulation"
							>
								<svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
								{{ $t('profile.invite.prev') }}
							</button>
							<span class="px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
								{{ pagination.current_page }} / {{ pagination.last_page }}
							</span>
							<button
								@click="loadPage(pagination.current_page + 1)"
								:disabled="pagination.current_page === pagination.last_page"
								class="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all touch-manipulation"
							>
								{{ $t('profile.invite.next') }}
								<svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</ProfileMasterPage>
</template>

<script>
import ProfileMasterPage from "@/views/page/panel/profile/ProfileMasterPage.vue";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
	components: {
		ProfileMasterPage,
	},
	data() {
		return {
			loading: true,
			referralCode: "",
			inviteLink: "",
			totalInvited: 0,
			invitedUsers: [],
			pagination: {
				current_page: 1,
				last_page: 1,
				per_page: 15,
				total: 0,
			},
			copiedCode: false,
			copiedLink: false,
		};
	},
	computed: {
		shareText() {
			return `${this.$t('profile.invite.heading')}\n${this.inviteLink}`;
		},
		telegramShareUrl() {
			return `https://t.me/share/url?url=${encodeURIComponent(this.inviteLink)}&text=${encodeURIComponent(this.$t('profile.invite.heading'))}`;
		},
		whatsappShareUrl() {
			return `https://wa.me/?text=${encodeURIComponent(this.shareText)}`;
		},
		twitterShareUrl() {
			return `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.$t('profile.invite.heading'))}&url=${encodeURIComponent(this.inviteLink)}`;
		},
		canNativeShare() {
			return typeof navigator !== "undefined" && !!navigator.share;
		},
	},
	methods: {
		async nativeShare() {
			if (!navigator.share) return;
			try {
				await navigator.share({
					title: this.$t("profile.nav.invite"),
					text: this.$t("profile.invite.heading"),
					url: this.inviteLink,
				});
			} catch (error) {
				if (error?.name !== "AbortError") {
					console.error("Share failed:", error);
				}
			}
		},
		async getInviteInfo(page = 1) {
			this.loading = true;
			try {
				const response = await axiosInstance.post("panel/profile/invite-info", {
					page: page,
					per_page: this.pagination.per_page,
				});

				this.referralCode = response.data.referral_code;
				this.inviteLink = response.data.invite_link;
				this.totalInvited = response.data.total_invited;
				this.invitedUsers = response.data.invited_users;
				this.pagination = {
					...this.pagination,
					...response.data.pagination,
				};
			} catch (error) {
				console.error(error);
				toast.error(this.$t('profile.invite.fetchError'), {
					theme: "colored",
					hideProgressBar: false,
					rtl: localStorage.getItem("direction") == "rtl" ? true : false,
					bodyClassName: "font-YekanBakh",
					toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
					transition: toast.TRANSITIONS.BOUNCE,
					position: toast.POSITION.BOTTOM_RIGHT,
				});
			} finally {
				this.loading = false;
			}
		},
		async copyReferralCode() {
			try {
				await navigator.clipboard.writeText(this.referralCode);
				this.copiedCode = true;
				toast.success(this.$t('profile.invite.codeCopied'), {
					theme: "colored",
					hideProgressBar: false,
					rtl: localStorage.getItem("direction") == "rtl" ? true : false,
					bodyClassName: "font-YekanBakh",
					toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
					transition: toast.TRANSITIONS.BOUNCE,
					position: toast.POSITION.BOTTOM_RIGHT,
				});
				setTimeout(() => {
					this.copiedCode = false;
				}, 2000);
			} catch (error) {
				console.error("Failed to copy:", error);
			}
		},
		async copyInviteLink() {
			try {
				await navigator.clipboard.writeText(this.inviteLink);
				this.copiedLink = true;
				toast.success(this.$t('profile.invite.linkCopied'), {
					theme: "colored",
					hideProgressBar: false,
					rtl: localStorage.getItem("direction") == "rtl" ? true : false,
					bodyClassName: "font-YekanBakh",
					toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
					transition: toast.TRANSITIONS.BOUNCE,
					position: toast.POSITION.BOTTOM_RIGHT,
				});
				setTimeout(() => {
					this.copiedLink = false;
				}, 2000);
			} catch (error) {
				console.error("Failed to copy:", error);
			}
		},
		loadPage(page) {
			if (page >= 1 && page <= this.pagination.last_page) {
				this.getInviteInfo(page);
			}
		},
		changePerPage() {
			this.pagination.current_page = 1;
			this.getInviteInfo(1);
		},
	},
	mounted() {
		document.title = this.$t('profile.invite.documentTitle');
		this.getInviteInfo();
	},
};
</script>

<style scoped>
.word-break-all {
	word-break: break-all;
	overflow-wrap: anywhere;
}
</style>
