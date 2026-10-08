<template>
	<ProfileMasterPage>
		<!-- Loading skeleton (mirrors this page's content) -->
		<div v-if="loading" class="mb-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
			<div class="flex items-center gap-3 mb-5">
				<div class="animate-pulse w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
				<div class="animate-pulse h-4 w-40 rounded-full bg-gray-200 dark:bg-gray-700"></div>
			</div>
			<!-- global toggle box -->
			<div class="mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
				<div class="flex items-center justify-between gap-4">
					<div class="flex items-center gap-3 flex-1">
						<div class="animate-pulse w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0"></div>
						<div class="flex-1 space-y-2">
							<div class="animate-pulse h-3.5 w-28 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							<div class="animate-pulse h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
						</div>
					</div>
					<div class="animate-pulse h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0"></div>
				</div>
			</div>
			<!-- bulk actions box -->
			<div class="mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
				<div class="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
					<div class="animate-pulse w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0"></div>
					<div class="flex-1 space-y-2">
						<div class="animate-pulse h-4 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
						<div class="animate-pulse h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
					</div>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
					<div v-for="i in 4" :key="i" class="animate-pulse h-14 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
				</div>
			</div>
			<!-- tab list -->
			<div class="flex gap-3 rounded-xl p-1 mb-2">
				<div v-for="i in 3" :key="i" class="animate-pulse h-9 w-28 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
			</div>
			<!-- table -->
			<div class="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
				<div class="flex items-center gap-3 bg-gray-300/60 dark:bg-gray-600/40 px-6 py-3">
					<div class="animate-pulse h-3.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
					<div v-for="i in 4" :key="i" class="animate-pulse h-3.5 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
				</div>
				<div v-for="row in 6" :key="row" class="flex items-center gap-3 px-6 py-3 border-t border-gray-100 dark:border-gray-800">
					<div class="animate-pulse h-3 flex-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
					<div v-for="i in 4" :key="i" class="animate-pulse h-5 w-5 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
				</div>
			</div>
		</div>
		<div v-else class="mb-5 last:mb-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
			<div class="flex items-center gap-3 mb-5">
				<span class="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
					</svg>
				</span>
				<h2 class="text-gray-800 dark:text-white font-bold text-base md:text-lg">{{ $t("profile.notif.title") }}</h2>
			</div>
			<div class="relative">
				<!-- Overlay when notifications are disabled -->
				<div v-if="!notificationsEnabled" class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 rounded-xl flex items-start justify-center">
					<div class="text-center p-6">
						<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
							<svg class="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
							</svg>
						</div>
						<p class="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-2">{{ $t("profile.notif.disabledTitle") }}</p>
						<p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t("profile.notif.disabledDesc") }}</p>

						<button @click="toggleAllNotifications" :disabled="toggleLoading" :class="['mt-6 mx-auto px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md', notificationsEnabled ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30', toggleLoading ? 'opacity-50 cursor-not-allowed' : '']">
							<span v-if="toggleLoading" v-html="loadingContent" class="w-4 h-4"></span>

							<span class="">{{ notificationsEnabled ? $t("profile.notif.turnOffNotifications") : $t("profile.notif.turnOnNotifications") }}</span>
						</button>
					</div>
				</div>

				<!-- Global Toggle -->
				<div class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
					<div class="flex items-center justify-between flex-wrap gap-4">
						<div class="flex items-center gap-3 flex-1">
							<div :class="['w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all', notificationsEnabled ? 'bg-gradient-to-br from-green-400 to-green-500' : 'bg-gradient-to-br from-red-400 to-red-500']">
								<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
								</svg>
							</div>
							<div class="flex-1 min-w-0">
								<h3 class="text-sm font-bold text-gray-800 dark:text-white mb-1">{{ $t("profile.notif.status") }}</h3>
								<div class="flex items-center gap-2">
									<div :class="['flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', notificationsEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400']">
										<span :class="['w-1.5 h-1.5 rounded-full', notificationsEnabled ? 'bg-green-500' : 'bg-red-500']"></span>
										{{ notificationsEnabled ? $t("profile.notif.allEnabled") : $t("profile.notif.allDisabled") }}
									</div>
								</div>
							</div>
						</div>
						<button @click="toggleAllNotifications" :disabled="toggleLoading" :class="['px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md', notificationsEnabled ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30', toggleLoading ? 'opacity-50 cursor-not-allowed' : '']">
							<span v-if="toggleLoading" v-html="loadingContent" class="w-4 h-4"></span>
							<svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path v-if="notificationsEnabled" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
								<path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
							<span class="hidden sm:inline">{{ notificationsEnabled ? $t("profile.notif.turnOff") : $t("profile.notif.turnOn") }}</span>
							<span class="sm:hidden">{{ notificationsEnabled ? $t("profile.notif.off") : $t("profile.notif.on") }}</span>
						</button>
					</div>
					<div v-if="!notificationsEnabled" class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
						<p class="text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
							<svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
							</svg>
							<span>{{ $t("profile.notif.allDisabledHint") }}</span>
						</p>
					</div>
				</div>

				<div v-if="adminDisabledChannelLabels().length" class="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
					<p class="text-xs text-amber-800 dark:text-amber-200">{{ $t("profile.notif.adminChannelOff", { channels: adminDisabledChannelLabels().join("، ") }) }}</p>
				</div>

				<!-- Bulk Update Actions - Desktop -->
				<div v-if="isDesktop" class="mb-6 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
					<div class="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
						<div class="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
							</svg>
						</div>
						<div class="flex-1">
							<h3 class="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
								{{ $t("profile.notif.bulkActions") }}
							</h3>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ $t("profile.notif.bulkActionsDesc") }}</p>
						</div>
					</div>
					<div class="grid grid-cols-2 lg:grid-cols-5 gap-2">
						<button @click="toggleChannel('via_email')" :disabled="bulkLoading || !notificationsEnabled || !isAdminChannelEnabled('via_email')" :class="['group relative px-2.5 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', isChannelAllEnabled('via_email') ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30']">
							<div class="flex flex-col items-center justify-center gap-1">
								<svg :class="['w-4 h-4', isChannelAllEnabled('via_email') ? 'text-red-500' : 'text-green-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
								</svg>
								<span :class="['text-xs font-medium', isChannelAllEnabled('via_email') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400']">
									{{ isChannelAllEnabled("via_email") ? $t("profile.notif.disable") : $t("profile.notif.enable") }}
								</span>
							</div>
						</button>
						<button @click="toggleChannel('via_sms')" :disabled="bulkLoading || !notificationsEnabled || !isAdminChannelEnabled('via_sms')" :class="['group relative px-2.5 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', isChannelAllEnabled('via_sms') ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30']">
							<div class="flex flex-col items-center justify-center gap-1">
								<svg :class="['w-4 h-4', isChannelAllEnabled('via_sms') ? 'text-red-500' : 'text-green-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
								</svg>
								<span :class="['text-xs font-medium', isChannelAllEnabled('via_sms') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400']">
									{{ isChannelAllEnabled("via_sms") ? $t("profile.notif.disable") : $t("profile.notif.enable") }}
								</span>
							</div>
						</button>
						<button @click="toggleChannel('via_site')" :disabled="bulkLoading || !notificationsEnabled || !isAdminChannelEnabled('via_site')" :class="['group relative px-2.5 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', isChannelAllEnabled('via_site') ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30']">
							<div class="flex flex-col items-center justify-center gap-1">
								<svg :class="['w-4 h-4', isChannelAllEnabled('via_site') ? 'text-red-500' : 'text-green-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
								</svg>
								<span :class="['text-xs font-medium', isChannelAllEnabled('via_site') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400']">
									{{ isChannelAllEnabled("via_site") ? $t("profile.notif.disable") : $t("profile.notif.enable") }}
								</span>
							</div>
						</button>
						<button @click="toggleChannel('via_telegram')" :disabled="bulkLoading || !notificationsEnabled || !isAdminChannelEnabled('via_telegram')" :class="['group relative px-2.5 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', isChannelAllEnabled('via_telegram') ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30']">
							<div class="flex flex-col items-center justify-center gap-1">
								<svg :class="['w-4 h-4', isChannelAllEnabled('via_telegram') ? 'text-red-500' : 'text-green-500']" fill="currentColor" viewBox="0 0 24 24">
									<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
								</svg>
								<span :class="['text-xs font-medium', isChannelAllEnabled('via_telegram') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400']">
									{{ isChannelAllEnabled("via_telegram") ? $t("profile.notif.disable") : $t("profile.notif.enable") }}
								</span>
							</div>
						</button>
						<button @click="bulkUpdate('reset_to_default')" :disabled="bulkLoading || !notificationsEnabled" class="group relative px-2.5 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
							<div class="flex flex-col items-center justify-center gap-1">
								<svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
								</svg>
								<span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ $t("profile.notif.reset") }}</span>
							</div>
						</button>
					</div>
				</div>

				<!-- Mobile Button to Open Drawer -->
				<div v-else class="mb-4">
					<button @click="isBulkActionsDrawerOpen = true" class="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all">
						<div class="flex items-center gap-2">
							<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
							</svg>
							<span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $t("profile.notif.bulkActions") }}</span>
						</div>
						<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</button>
				</div>

				<!-- Mobile BottomSheetDrawer -->
				<BottomSheetDrawer v-if="!isDesktop" v-model="isBulkActionsDrawerOpen" :initial-height="0.6" :max-height="0.7" :header-height="80" :auto-close-on-min="true" :close-on-backdrop="true" :lock-scroll="true" :panel-class="'bg-white dark:bg-gray-900 border-t border-gray-200/70 dark:border-gray-700/70 rounded-t-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'" :content-class="'px-4 pb-4 overflow-auto'">
					<div class="py-4 space-y-4">
						<div class="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
							<div class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md flex-shrink-0">
								<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
								</svg>
							</div>
							<div class="flex-1">
								<h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ $t("profile.notif.bulkActions") }}</h3>
								<p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ $t("profile.notif.bulkActionsDesc") }}</p>
							</div>
						</div>

						<div class="space-y-1">
							<button
								@click="
									toggleChannel('via_email');
									isBulkActionsDrawerOpen = false;
								"
								:disabled="bulkLoading || !notificationsEnabled || !isAdminChannelEnabled('via_email')"
								class="w-full flex items-center justify-between px-4 py-3 rounded-t-lg rounded-b-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<div class="flex items-center gap-3">
									<svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
									</svg>
									<span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $t("profile.notif.email") }}</span>
								</div>
								<div :class="['flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', isChannelAllEnabled('via_email') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400']">
									<span :class="['w-1.5 h-1.5 rounded-full', isChannelAllEnabled('via_email') ? 'bg-green-500' : 'bg-red-500']"></span>
									{{ isChannelAllEnabled("via_email") ? $t("profile.notif.active") : $t("profile.notif.inactive") }}
								</div>
							</button>
							<button
								@click="
									toggleChannel('via_sms');
									isBulkActionsDrawerOpen = false;
								"
								:disabled="bulkLoading || !notificationsEnabled || !isAdminChannelEnabled('via_sms')"
								class="w-full flex items-center justify-between px-4 py-3 rounded-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<div class="flex items-center gap-3">
									<svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
									</svg>
									<span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $t("profile.notif.sms") }}</span>
								</div>
								<div :class="['flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', isChannelAllEnabled('via_sms') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400']">
									<span :class="['w-1.5 h-1.5 rounded-full', isChannelAllEnabled('via_sms') ? 'bg-green-500' : 'bg-red-500']"></span>
									{{ isChannelAllEnabled("via_sms") ? $t("profile.notif.active") : $t("profile.notif.inactive") }}
								</div>
							</button>
							<button
								@click="
									toggleChannel('via_site');
									isBulkActionsDrawerOpen = false;
								"
								:disabled="bulkLoading || !notificationsEnabled || !isAdminChannelEnabled('via_site')"
								class="w-full flex items-center justify-between px-4 py-3 rounded-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<div class="flex items-center gap-3">
									<svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
									</svg>
									<span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $t("profile.notif.site") }}</span>
								</div>
								<div :class="['flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', isChannelAllEnabled('via_site') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400']">
									<span :class="['w-1.5 h-1.5 rounded-full', isChannelAllEnabled('via_site') ? 'bg-green-500' : 'bg-red-500']"></span>
									{{ isChannelAllEnabled("via_site") ? $t("profile.notif.active") : $t("profile.notif.inactive") }}
								</div>
							</button>
							<button
								@click="
									toggleChannel('via_telegram');
									isBulkActionsDrawerOpen = false;
								"
								:disabled="bulkLoading || !notificationsEnabled || !isAdminChannelEnabled('via_telegram')"
								class="w-full flex items-center justify-between px-4 py-3 rounded-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<div class="flex items-center gap-3">
									<svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
										<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
									</svg>
									<span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $t("profile.notif.telegram") }}</span>
								</div>
								<div :class="['flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', isChannelAllEnabled('via_telegram') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400']">
									<span :class="['w-1.5 h-1.5 rounded-full', isChannelAllEnabled('via_telegram') ? 'bg-green-500' : 'bg-red-500']"></span>
									{{ isChannelAllEnabled("via_telegram") ? $t("profile.notif.active") : $t("profile.notif.inactive") }}
								</div>
							</button>
							<button
								@click="
									bulkUpdate('reset_to_default');
									isBulkActionsDrawerOpen = false;
								"
								:disabled="bulkLoading || !notificationsEnabled"
								class="w-full flex items-center justify-between px-4 py-3 rounded-b-lg rounded-t-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
							>
								<div class="flex items-center gap-3">
									<svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
									</svg>
									<span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $t("profile.notif.reset") }}</span>
								</div>
								<svg class="w-4 h-4 text-gray-400 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</button>
						</div>
					</div>
				</BottomSheetDrawer>

				<TabGroup>
					<TabList class="flex space-x-3 rtl:space-x-reverse rounded-xl bg-blue-900/30 p-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
						<Tab v-for="(group, idx) in groupedPreferences" as="template" :key="idx" v-slot="{ selected }">
							<button :class="['flex items-center text-center justify-center w-max lg:w-full whitespace-nowrap rounded-lg py-2.5 px-6 text-sm font-semibold leading-5 focus:outline-none', selected ? 'bg-white dark:bg-gray-900 text-amber-400 shadow' : 'text-white hover:bg-white/[0.12] hover:text-white']">
								<span v-html="group.group_icon" class="me-2 -mt-1"></span>
								{{ group.group_title }}
							</button>
						</Tab>
					</TabList>

					<TabPanels class="mt-2">
						<TabPanel v-for="(group, idx) in groupedPreferences" :key="idx" class="">
							<div v-if="group.group_description" class="my-6 bg-gray-100 dark:bg-gray-500/10 rounded-xl p-4 text-gray-700 dark:text-gray-200 text-sm font-medium leading-7">
								{{ group.group_description }}
							</div>
							<div class="overflow-x-auto">
								<table class="min-w-full bg-gray-100 dark:bg-gray-500/10">
									<thead class="bg-gray-300 dark:bg-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-100">
										<tr class="">
											<th class="whitespace-nowrap px-6 py-3 text-start">
												{{ $t("profile.notif.colAction") }}
											</th>
											<th class="w-16 whitespace-nowrap p-3 text-center">
												{{ $t("profile.notif.colSms") }}
											</th>
											<th class="w-16 whitespace-nowrap p-3 text-center">
												{{ $t("profile.notif.colEmail") }}
											</th>
											<th class="w-16 whitespace-nowrap p-3 text-center">
												{{ $t("profile.notif.colSiteNotif") }}
											</th>
											<th class="w-16 whitespace-nowrap p-3 text-center">
												{{ $t("profile.notif.colTelegram") }}
											</th>
										</tr>
									</thead>
									<tbody class="text-gray-700 dark:text-gray-100">
										<tr v-for="event in group.events" :key="event.event_id">
											<td class="p-3 whitespace-nowrap text-sm font-medium">{{ event.event_title }}</td>
											<td class="p-3 whitespace-nowrap text-sm text-center">
												<span v-if="preferenceLoading.includes(`${event.event_id}-via_sms`)" v-html="loadingContent"></span>
												<input v-else type="checkbox" class="appearance-none w-5 h-5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ring-offset-white dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox" @change="handlePreferenceChange(event, 'via_sms', $event.target.checked)" :disabled="!event.is_sms_enabled || !notificationsEnabled" :checked="event.via_sms" />
											</td>
											<td class="p-3 whitespace-nowrap text-sm text-center">
												<span v-if="preferenceLoading.includes(`${event.event_id}-via_email`)" v-html="loadingContent"></span>
												<input v-else type="checkbox" class="appearance-none w-5 h-5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ring-offset-white dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox" @change="handlePreferenceChange(event, 'via_email', $event.target.checked)" :disabled="!event.is_email_enabled || !notificationsEnabled" :checked="event.via_email" />
											</td>
											<td class="p-3 whitespace-nowrap text-sm text-center">
												<span v-if="preferenceLoading.includes(`${event.event_id}-via_site`)" v-html="loadingContent"></span>
												<input
													v-else
													type="checkbox"
													class="appearance-none w-5 h-5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ring-offset-white dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
													@change="
														updatePreference(event.event_id, 'via_site', $event.target.checked);
														event.via_site = $event.target.checked;
													"
													:disabled="!event.is_site_enabled || !notificationsEnabled"
													:checked="event.via_site"
												/>
											</td>
											<td class="p-3 whitespace-nowrap text-sm text-center">
												<span v-if="preferenceLoading.includes(`${event.event_id}-via_telegram`)" v-html="loadingContent"></span>
												<input
													v-else
													type="checkbox"
													class="appearance-none w-5 h-5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ring-offset-white dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
													@change="
														updatePreference(event.event_id, 'via_telegram', $event.target.checked);
														event.via_telegram = $event.target.checked;
													"
													:disabled="!event.is_telegram_enabled || !notificationsEnabled"
													:checked="event.via_telegram"
												/>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</div>
		</div>
	</ProfileMasterPage>
</template>

<script>
import ProfileMasterPage from "@/views/page/panel/profile/ProfileMasterPage.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import axiosInstance from "@/store/axiosInstance";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
	components: {
		ProfileMasterPage,
		BottomSheetDrawer,
		TabGroup, TabList, Tab, TabPanels, TabPanel
	},
	data() {
		return {
			groupedPreferences: [],
			userChannels: {},
			adminChannels: { email: true, sms: true, telegram: true, site: true },
			loading: true,
			preferenceLoading: [],
			notificationsEnabled: true,
			toggleLoading: false,
			bulkLoading: false,
			isBulkActionsDrawerOpen: false,
			isDesktop: typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
			userData: null,
			loadingContent: `<svg
								class="w-4 h-4 m-auto" version="1.1" xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">

								<circle class="stroke-current text-pink-700 text-opacity-30" cx="50"
									cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round"
									stroke-dashoffset="0" stroke-dasharray="200, 300">

								</circle>
								<circle class="stroke-current text-pink-700" cx="50" cy="50" r="20"
								fill="none" stroke-width="8" stroke-linecap="round"
								stroke-dashoffset="0" stroke-dasharray="100, 200">
									<animateTransform attributeName="transform" attributeType="XML"
										type="rotate" from="0 50 50" to="360 50 50" dur="2.5s"
										repeatCount="indefinite">
									</animateTransform>
									<animate attributeName="stroke-dashoffset" values="0;-30;-124"
										dur="1.25s" repeatCount="indefinite">
									</animate>
									<animate attributeName="stroke-dasharray"
										values="0,200;110,200;110,200" dur="1.25s"
										repeatCount="indefinite"></animate>
								</circle>
							</svg>`
		};
	},
	methods: {
		async getUserData() {
			try {
				const response = await axiosInstance.get('/user');
				this.userData = response.data;
			} catch (error) {
				console.error("خطا در دریافت اطلاعات کاربر", error);
			}
		},
		checkEmailSmsRequirements(channel) {
			if (!this.userData) {
				return { valid: false, message: this.$t('profile.notif.loadingUser') };
			}

			const needsEmail = channel === 'via_email';
			const needsSms = channel === 'via_sms';

			if (needsEmail || needsSms) {
				const hasEmail = !!this.userData.email;
				const hasMobile = !!this.userData.mobile;
				const emailVerified = !!this.userData.email_verified_at;
				const mobileVerified = !!this.userData.mobile_verified_at;

				if (needsEmail && needsSms) {
					// Both email and SMS need to be enabled
					if (!hasEmail || !hasMobile) {
						return {
							valid: false,
							message: this.$t('profile.notif.reqEmailSmsRegistered')
						};
					}
					if (!emailVerified || !mobileVerified) {
						return {
							valid: false,
							message: this.$t('profile.notif.reqEmailSmsVerified')
						};
					}
				} else if (needsEmail) {
					if (!hasEmail) {
						return {
							valid: false,
							message: this.$t('profile.notif.reqEmailRegistered')
						};
					}
					if (!emailVerified) {
						return {
							valid: false,
							message: this.$t('profile.notif.reqEmailVerified')
						};
					}
				} else if (needsSms) {
					if (!hasMobile) {
						return {
							valid: false,
							message: this.$t('profile.notif.reqSmsRegistered')
						};
					}
					if (!mobileVerified) {
						return {
							valid: false,
							message: this.$t('profile.notif.reqSmsVerified')
						};
					}
				}
			}

			return { valid: true };
		},
		getPreferences() {
			axiosInstance.post(`/panel/profile/information-management`)
				.then(response => {
					this.groupedPreferences = response.data.grouped_preferences;
					this.userChannels = response.data.user_channels || {};
					this.adminChannels = response.data.admin_channels || this.adminChannels;
					this.notificationsEnabled = response.data.notifications_enabled !== undefined
						? response.data.notifications_enabled
						: true;
				})
				.catch(error => {
					console.error("خطا در دریافت تنظیمات", error);
				})
				.finally(() => {
					this.loading = false;
				});
		},
		handlePreferenceChange(event, field, newValue) {
			// اگر در حال فعال کردن ایمیل یا پیامک است، اول بررسی کن
			if (newValue && (field === 'via_email' || field === 'via_sms')) {
				const validation = this.checkEmailSmsRequirements(field);
				if (!validation.valid) {
					toast.error(validation.message, {
						theme: "colored",
						hideProgressBar: false,
						rtl: localStorage.getItem("direction") == "rtl" ? true : false,
						bodyClassName: "font-YekanBakh",
						toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
						transition: toast.TRANSITIONS.BOUNCE,
						position: toast.POSITION.BOTTOM_RIGHT,
					});
					// checkbox را تغییر نده - همان حالت قبلی بماند
					return;
				}
			}

			// اگر اعتبارسنجی موفق بود، checkbox را تغییر بده
			event[field] = newValue;

			// حالا درخواست را ارسال کن
			this.updatePreference(event.event_id, field, newValue);
		},
		updatePreference(eventId, field, value) {
			this.preferenceLoading.push(`${eventId}-${field}`);
			axiosInstance.post(`/panel/profile/update-preference`, {
				field: field,
				value: value,
				eventId: eventId
			})
				.then(() => {
					// تنظیمات با موفقیت به‌روزرسانی شد
				})
				.catch(error => {
					console.error("خطا در به‌روزرسانی تنظیمات", error);
					const errorMsg = error.response?.data?.message || this.$t('profile.notif.updateError');
					toast.error(errorMsg, {
						theme: "colored",
						hideProgressBar: false,
						rtl: localStorage.getItem("direction") == "rtl" ? true : false,
						bodyClassName: "font-YekanBakh",
						toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
						transition: toast.TRANSITIONS.BOUNCE,
						position: toast.POSITION.BOTTOM_RIGHT,
					});
					// برگرداندن checkbox به حالت قبلی در صورت خطا
					const event = this.findEventById(eventId);
					if (event) {
						event[field] = !value;
					}
				})
				.finally(() => {
					const index = this.preferenceLoading.indexOf(`${eventId}-${field}`);
					if (index !== -1) {
						this.preferenceLoading.splice(index, 1);
					}
				});
		},
		findEventById(eventId) {
			for (const group of this.groupedPreferences) {
				const event = group.events.find(e => e.event_id === eventId);
				if (event) return event;
			}
			return null;
		},
		toggleAllNotifications() {
			this.toggleLoading = true;
			axiosInstance.post(`/panel/profile/toggle-all-notifications`)
				.then(response => {
					if (response.data && response.data.notifications_enabled !== undefined) {
						this.notificationsEnabled = response.data.notifications_enabled;
						toast.success(
							response.data.notifications_enabled
								? this.$t('profile.notif.allEnabledSuccess')
								: this.$t('profile.notif.allDisabledSuccess'),
							{
								theme: "colored",
								hideProgressBar: false,
								rtl: localStorage.getItem("direction") == "rtl" ? true : false,
								bodyClassName: "font-YekanBakh",
								toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
								transition: toast.TRANSITIONS.BOUNCE,
								position: toast.POSITION.BOTTOM_RIGHT,
							}
						);
					}
				})
				.catch(error => {
					console.error("خطا در تغییر وضعیت اطلاع‌رسانی‌ها", error);
					const errorMsg = error.response?.data?.message || this.$t('profile.notif.toggleError');
					toast.error(errorMsg, {
						theme: "colored",
						hideProgressBar: false,
						rtl: localStorage.getItem("direction") == "rtl" ? true : false,
						bodyClassName: "font-YekanBakh",
						toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
						transition: toast.TRANSITIONS.BOUNCE,
						position: toast.POSITION.BOTTOM_RIGHT,
					});
				})
				.finally(() => {
					this.toggleLoading = false;
				});
		},
		bulkUpdate(action, channel = null) {
			// اگر در حال فعال کردن ایمیل یا پیامک است، بررسی کن
			if (action === 'enable_channel' && channel && (channel === 'via_email' || channel === 'via_sms')) {
				const validation = this.checkEmailSmsRequirements(channel);
				if (!validation.valid) {
					toast.error(validation.message, {
						theme: "colored",
						hideProgressBar: false,
						rtl: localStorage.getItem("direction") == "rtl" ? true : false,
						bodyClassName: "font-YekanBakh",
						toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
						transition: toast.TRANSITIONS.BOUNCE,
						position: toast.POSITION.BOTTOM_RIGHT,
					});
					return;
				}
			}
			// اجرای مستقیم عملیات
			this.executeBulkUpdate(action, channel);
		},
		executeBulkUpdate(action, channel = null) {
			this.bulkLoading = true;
			const payload = {
				action: action
			};

			if (channel) {
				payload.channel = channel;
			}

			axiosInstance.post(`/panel/profile/bulk-update-preferences`, payload)
				.then(response => {
					if (response.data && response.data.updated_count !== undefined) {
						toast.success(
							this.$t('profile.notif.bulkSuccess', { count: response.data.updated_count }),
							{
								theme: "colored",
								hideProgressBar: false,
								rtl: localStorage.getItem("direction") == "rtl" ? true : false,
								bodyClassName: "font-YekanBakh",
								toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
								transition: toast.TRANSITIONS.BOUNCE,
								position: toast.POSITION.BOTTOM_RIGHT,
							}
						);
						// Refresh data
						this.getPreferences();
					} else {
						toast.warning(this.$t('profile.notif.bulkNoUpdate'), {
							theme: "colored",
							hideProgressBar: false,
							rtl: localStorage.getItem("direction") == "rtl" ? true : false,
							bodyClassName: "font-YekanBakh",
							toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
							transition: toast.TRANSITIONS.BOUNCE,
							position: toast.POSITION.BOTTOM_RIGHT,
						});
					}
				})
				.catch(error => {
					console.error("خطا در به‌روزرسانی دسته‌جمعی", error);
					let errorMsg = this.$t('profile.notif.bulkError');
					if (error.response?.data?.message) {
						errorMsg = error.response.data.message;
					} else if (error.response?.data?.errors) {
						errorMsg = Object.values(error.response.data.errors).flat().join('\n');
					}
					toast.error(errorMsg, {
						theme: "colored",
						hideProgressBar: false,
						rtl: localStorage.getItem("direction") == "rtl" ? true : false,
						bodyClassName: "font-YekanBakh",
						toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
						transition: toast.TRANSITIONS.BOUNCE,
						position: toast.POSITION.BOTTOM_RIGHT,
					});
				})
				.finally(() => {
					this.bulkLoading = false;
				});
		},
		isAdminChannelEnabled(channel) {
			const map = { via_email: 'email', via_sms: 'sms', via_telegram: 'telegram', via_site: 'site' };
			const key = map[channel];
			if (!key || !this.adminChannels || this.adminChannels[key] === undefined) return true;
			return !!this.adminChannels[key];
		},
		adminDisabledChannelLabels() {
			const labels = {
				email: this.$t('profile.notif.email'),
				sms: this.$t('profile.notif.sms'),
				telegram: this.$t('profile.notif.telegram'),
				site: this.$t('profile.notif.site'),
			};
			return Object.keys(labels).filter((key) => this.adminChannels && this.adminChannels[key] === false).map((key) => labels[key]);
		},
		isChannelAllEnabled(channel) {
			if (this.userChannels && Object.prototype.hasOwnProperty.call(this.userChannels, channel)) {
				return !!this.userChannels[channel];
			}
			// بررسی اینکه آیا همه Event ها برای این کانال فعال هستند یا نه
			let allEnabled = true;
			let hasAnyEvent = false;

			for (const group of this.groupedPreferences) {
				for (const event of group.events) {
					hasAnyEvent = true;
					// بررسی اینکه آیا Event این کانال را پشتیبانی می‌کند
					const isChannelSupported =
						(channel === 'via_email' && event.is_email_enabled) ||
						(channel === 'via_sms' && event.is_sms_enabled) ||
						(channel === 'via_site' && event.is_site_enabled) ||
						(channel === 'via_telegram' && event.is_telegram_enabled);

					if (isChannelSupported) {
						// بررسی اینکه آیا این Event برای این کانال فعال است
						const isEnabled = event[channel];
						if (!isEnabled) {
							allEnabled = false;
							break;
						}
					}
				}
				if (!allEnabled) break;
			}

			return hasAnyEvent && allEnabled;
		},
		toggleChannel(channel) {
			// بررسی وضعیت فعلی
			const isAllEnabled = this.isChannelAllEnabled(channel);

			// اگر در حال فعال کردن است، بررسی کن
			if (!isAllEnabled && (channel === 'via_email' || channel === 'via_sms')) {
				const validation = this.checkEmailSmsRequirements(channel);
				if (!validation.valid) {
					toast.error(validation.message, {
						theme: "colored",
						hideProgressBar: false,
						rtl: localStorage.getItem("direction") == "rtl" ? true : false,
						bodyClassName: "font-YekanBakh",
						toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
						transition: toast.TRANSITIONS.BOUNCE,
						position: toast.POSITION.BOTTOM_RIGHT,
					});
					return;
				}
			}

			// اگر همه فعال هستند، غیرفعال کن، وگرنه فعال کن
			const action = isAllEnabled ? 'disable_channel' : 'enable_channel';
			this.executeBulkUpdate(action, channel);
		},
		handleResize() {
			if (typeof window === "undefined") return;
			this.isDesktop = window.innerWidth >= 1024;
		}
	},
	mounted() {
		document.title = this.$t('profile.nav.informationManagement');
		this.getUserData();
		this.getPreferences();
		this.handleResize();
		window.addEventListener("resize", this.handleResize);
	},
	beforeUnmount() {
		window.removeEventListener("resize", this.handleResize);
	}
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.custom-checkbox::after {
	content: "";
	position: absolute;
	inset: 0;
	margin: auto;
	display: none;
	color: white;
	font-size: 13px;
	font-weight: bold;
	line-height: 1;
	text-align: center;
	user-select: none;
}

.custom-checkbox:checked::after {
	content: "✔";
	display: block;
	margin-top: -4px;
	margin-left: 4px;
}

.custom-checkbox:indeterminate::after,
.custom-checkbox.is-indeterminate::after {
	content: "";
	display: block;
	margin-top: 9px;
	width: 14px;
	height: 3px;
	background-color: white;
	border-radius: 3px;
}
</style>
