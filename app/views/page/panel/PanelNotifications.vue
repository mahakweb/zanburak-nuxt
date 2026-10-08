<template>
	<PanelMasterPage>
		<div class="md:grid md:grid-cols-12 gap-5">
			<div class="hidden md:block md:col-span-3">
				<div class="w-full p-4 border-2 border-gray-50/90 dark:border-gray-800/60 rounded-xl">
					<h4 class="font-bold text-base text-gray-50 dark:text-white flex items-center">
						<svg class="me-2 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path class="stroke-amber-400 dark:stroke=yellow-400"
								d="M7.60848 4C6.03761 4 5.07993 5.7279 5.91249 7.06L8.08798 10.5408C8.68397 11.4944 8.99999 12.5963 8.99999 13.7208V16.7639C8.99999 17.5215 9.42799 18.214 10.1056 18.5528L13.5528 20.2764C14.2177 20.6088 15 20.1253 15 19.382V13.7208C15 12.5963 15.316 11.4944 15.912 10.5408L18.0875 7.06C18.9201 5.7279 17.9624 4 16.3915 4H7.60848Z"
								stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
						{{ $t("panel.notifications.filters") }}
					</h4>
					<hr class="my-3 border-t-2 border-gray-50/90 dark:border-gray-800/60" />
					<div class="mx-auto w-full max-w-md">
						<RadioGroup v-model="filters.filter">
							<div class="space-y-2">
								<RadioGroupOption as="template" value="all" @click="selectFilter('all')"
									v-slot="{ active, checked }">
									<div :class="[active ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300' : '', checked ? 'bg-sky-900/75 text-white ' : 'bg-white dark:bg-gray-900']"
										class="relative flex cursor-pointer rounded-xl px-4 py-3 shadow-md focus:outline-none">
										<div class="flex w-full items-center justify-between">
											<div class="flex items-center">
												<div class="text-sm flex items-center">
													<span
														:class="checked ? 'bg-amber-400' : 'bg-gray-400 group-hover:bg-opacity-100'"
														class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 me-3 flex items-center justify-center rounded-lg text-white">
														<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
															xmlns="http://www.w3.org/2000/svg">
															<path class="stroke-current"
																d="M1.97998 13H5.76998C6.52998 13 7.21998 13.43 7.55998 14.11L8.44998 15.9C8.99998 17 9.99998 17 10.24 17H13.77C14.53 17 15.22 16.57 15.56 15.89L16.45 14.1C16.79 13.42 17.48 12.99 18.24 12.99H21.98"
																stroke-width="1.5" stroke-linecap="round"
																stroke-linejoin="round"></path>
															<path class="stroke-current"
																d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z"
																stroke-width="1.5" stroke-linecap="round"
																stroke-linejoin="round"></path>
															<path class="stroke-current"
																d="M14 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10"
																stroke-width="1.5" stroke-linecap="round"
																stroke-linejoin="round"></path>
														</svg>
													</span>
													<RadioGroupLabel as="p"
														:class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
														class="font-semibold">{{ $t("panel.notifications.filterAll") }}</RadioGroupLabel>
												</div>
											</div>
										</div>
									</div>
								</RadioGroupOption>
								<RadioGroupOption as="template" value="unread" @click="selectFilter('unread')"
									v-slot="{ active, checked }">
									<div :class="[active ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300' : '', checked ? 'bg-sky-900/75 text-white ' : 'bg-white dark:bg-gray-900']"
										class="relative flex cursor-pointer rounded-xl px-4 py-3 shadow-md focus:outline-none">
										<div class="flex w-full items-center justify-between">
											<div class="flex items-center">
												<div class="text-sm flex items-center">
													<span
														:class="checked ? 'bg-amber-400' : 'bg-gray-400 group-hover:bg-opacity-100'"
														class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 me-3 flex items-center justify-center rounded-lg text-white">
														<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
															xmlns="http://www.w3.org/2000/svg">
															<path class="fill-current"
																d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V10.5C22.75 10.0858 22.4142 9.75 22 9.75C21.5858 9.75 21.25 10.0858 21.25 10.5V12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62178 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62178 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62178 2.75 12 2.75H13.5C13.9142 2.75 14.25 2.41421 14.25 2C14.25 1.58579 13.9142 1.25 13.5 1.25H11.9426Z">
															</path>
															<path fill-rule="evenodd" clip-rule="evenodd"
																d="M19 1.25C16.9289 1.25 15.25 2.92893 15.25 5C15.25 7.07107 16.9289 8.75 19 8.75C21.0711 8.75 22.75 7.07107 22.75 5C22.75 2.92893 21.0711 1.25 19 1.25ZM16.75 5C16.75 3.75736 17.7574 2.75 19 2.75C20.2426 2.75 21.25 3.75736 21.25 5C21.25 6.24264 20.2426 7.25 19 7.25C17.7574 7.25 16.75 6.24264 16.75 5Z"
																class="fill-current"></path>
															<path
																d="M6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H16C16.4142 13.25 16.75 13.5858 16.75 14C16.75 14.4142 16.4142 14.75 16 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14Z"
																class="fill-current"></path>
															<path
																d="M7 16.75C6.58579 16.75 6.25 17.0858 6.25 17.5C6.25 17.9142 6.58579 18.25 7 18.25H13C13.4142 18.25 13.75 17.9142 13.75 17.5C13.75 17.0858 13.4142 16.75 13 16.75H7Z"
																class="fill-current"></path>
														</svg>
													</span>
													<RadioGroupLabel as="p"
														:class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
														class="font-semibold">{{ $t("panel.notifications.filterUnread") }}</RadioGroupLabel>
												</div>
											</div>
										</div>
									</div>
								</RadioGroupOption>
								<RadioGroupOption as="template" value="read" @click="selectFilter('read')"
									v-slot="{ active, checked }">
									<div :class="[active ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300' : '', checked ? 'bg-sky-900/75 text-white ' : 'bg-white dark:bg-gray-900']"
										class="relative flex cursor-pointer rounded-xl px-4 py-3 shadow-md focus:outline-none">
										<div class="flex w-full items-center justify-between">
											<div class="flex items-center">
												<div class="text-sm flex items-center">
													<span
														:class="checked ? 'bg-amber-400' : 'bg-gray-400 group-hover:bg-opacity-100'"
														class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 me-3 flex items-center justify-center rounded-lg text-white">
														<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
															xmlns="http://www.w3.org/2000/svg">
															<path fill-rule="evenodd" clip-rule="evenodd"
																d="M10.9436 1.25H13.0564C14.8942 1.24998 16.3498 1.24997 17.489 1.40314C18.6614 1.56076 19.6104 1.89288 20.3588 2.64124C21.1071 3.38961 21.4392 4.33856 21.5969 5.51098C21.75 6.65019 21.75 8.10583 21.75 9.94359V14.0564C21.75 15.8942 21.75 17.3498 21.5969 18.489C21.4392 19.6614 21.1071 20.6104 20.3588 21.3588C19.6104 22.1071 18.6614 22.4392 17.489 22.5969C16.3498 22.75 14.8942 22.75 13.0564 22.75H10.9436C9.10583 22.75 7.65019 22.75 6.51098 22.5969C5.33856 22.4392 4.38961 22.1071 3.64124 21.3588C2.89288 20.6104 2.56076 19.6614 2.40314 18.489C2.24997 17.3498 2.24998 15.8942 2.25 14.0564V9.94358C2.24998 8.10582 2.24997 6.65019 2.40314 5.51098C2.56076 4.33856 2.89288 3.38961 3.64124 2.64124C4.38961 1.89288 5.33856 1.56076 6.51098 1.40314C7.65019 1.24997 9.10582 1.24998 10.9436 1.25ZM6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V14C3.75 15.9068 3.75159 17.2615 3.88976 18.2892C4.02502 19.2952 4.27869 19.8749 4.7019 20.2981C5.12511 20.7213 5.70476 20.975 6.71085 21.1102C7.73851 21.2484 9.09318 21.25 11 21.25H13C14.9068 21.25 16.2615 21.2484 17.2892 21.1102C18.2952 20.975 18.8749 20.7213 19.2981 20.2981C19.7213 19.8749 19.975 19.2952 20.1102 18.2892C20.2484 17.2615 20.25 15.9068 20.25 14V10C20.25 8.09318 20.2484 6.73851 20.1102 5.71085C19.975 4.70476 19.7213 4.12511 19.2981 3.7019C18.8749 3.27869 18.2952 3.02502 17.2892 2.88976C16.2615 2.75159 14.9068 2.75 13 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976ZM7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8ZM7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12ZM7.25 16C7.25 15.5858 7.58579 15.25 8 15.25H13C13.4142 15.25 13.75 15.5858 13.75 16C13.75 16.4142 13.4142 16.75 13 16.75H8C7.58579 16.75 7.25 16.4142 7.25 16Z"
																class="fill-current"></path>
														</svg>
													</span>
													<RadioGroupLabel as="p"
														:class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
														class="font-semibold">{{ $t("panel.notifications.filterRead") }}</RadioGroupLabel>
												</div>
											</div>
										</div>
									</div>
								</RadioGroupOption>
							</div>
						</RadioGroup>
					</div>
				</div>

				<div class="mt-8 w-full p-4 border-2 border-gray-50/90 dark:border-gray-800/60 rounded-xl">
					<h4 class="font-bold text-base text-gray-50 dark:text-white flex items-center">
						<svg class="me-2 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path class="stroke-amber-400 dark:stroke-yellow-400" d="M4 8H13" stroke-width="1.8"
								stroke-linecap="round"></path>
							<path class="stroke-amber-400 dark:stroke-yellow-400" d="M6 13H13" stroke-width="1.8"
								stroke-linecap="round"></path>
							<path class="stroke-amber-400 dark:stroke-yellow-400" d="M8 18H13" stroke-width="1.8"
								stroke-linecap="round"></path>
							<path class="stroke-amber-400 dark:stroke-yellow-400" d="M17 20V4L20 8" stroke-width="1.8"
								stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
						{{ $t("panel.notifications.sort") }}
					</h4>
					<hr class="my-3 border-t-2 border-gray-50/90 dark:border-gray-800/60" />
					<div class="mx-auto w-full max-w-md">
						<RadioGroup v-model="filters.sort">
							<div class="space-y-2">
								<RadioGroupOption as="template" value="newest" @click="selectSort('newest')"
									v-slot="{ active, checked }">
									<div :class="[active ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300' : '', checked ? 'bg-sky-900/75 text-white ' : 'bg-white dark:bg-gray-900']"
										class="relative flex cursor-pointer rounded-xl px-4 py-3 shadow-md focus:outline-none">
										<div class="flex w-full items-center justify-between">
											<div class="flex items-center">
												<div class="text-sm">
													<RadioGroupLabel as="p"
														:class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
														class="font-semibold">{{ $t("panel.common.sortNewest") }}</RadioGroupLabel>
												</div>
											</div>
											<div v-show="checked" class="shrink-0 text-white">
												<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
													<circle class="fill-yellow-400" cx="12" cy="12" r="12"
														fill-opacity="0.9" />
													<path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="1.5"
														stroke-linecap="round" stroke-linejoin="round" />
												</svg>
											</div>
										</div>
									</div>
								</RadioGroupOption>
								<RadioGroupOption as="template" value="oldest" @click="selectSort('oldest')"
									v-slot="{ active, checked }">
									<div :class="[active ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300' : '', checked ? 'bg-sky-900/75 text-white ' : 'bg-white dark:bg-gray-900']"
										class="relative flex cursor-pointer rounded-xl px-4 py-3 shadow-md focus:outline-none">
										<div class="flex w-full items-center justify-between">
											<div class="flex items-center">
												<div class="text-sm">
													<RadioGroupLabel as="p"
														:class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
														class="font-semibold">{{ $t("panel.common.sortOldest") }}</RadioGroupLabel>
												</div>
											</div>
											<div v-show="checked" class="shrink-0 text-white">
												<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
													<circle class="fill-yellow-400" cx="12" cy="12" r="12"
														fill-opacity="0.9" />
													<path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="1.5"
														stroke-linecap="round" stroke-linejoin="round" />
												</svg>
											</div>
										</div>
									</div>
								</RadioGroupOption>
							</div>
						</RadioGroup>
					</div>
				</div>

				<!-- Actions & Settings Section -->
				<div class="mt-8 w-full p-4 border-2 border-gray-50/90 dark:border-gray-800/60 rounded-xl">
					<h4 class="font-bold text-base text-gray-50 dark:text-white flex items-center">
						<svg class="me-2 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path class="stroke-amber-400 dark:stroke-yellow-400"
								d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
								stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
							<path class="stroke-amber-400 dark:stroke-yellow-400"
								d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01131 9.77251C4.28062 9.5799 4.48568 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
								stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						{{ $t("panel.notifications.actionsSettings") }}
					</h4>
					<hr class="my-3 border-t-2 border-gray-50/90 dark:border-gray-800/60" />

					<div class="mb-4">
						<!-- Toggle Checkboxes -->
						<div
							class="bg-white dark:bg-gray-900 relative flex cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
							<label
								class="w-full flex items-center text-gray-700 dark:text-white text-xs font-semibold cursor-pointer">
								<input type="checkbox" :checked="showCheckboxes" @change="toggleCheckboxes"
									class="appearance-none me-2 w-5 h-5 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
									:class="showCheckboxes ? 'is-checked bg-yellow-400' : ''" />
								{{ $t("panel.notifications.selectNotifications") }}
							</label>
						</div>
						<!-- Select All -->
						<div v-if="showCheckboxes && notifications && notifications.length > 0"
							class="mt-0.5 bg-white dark:bg-gray-900 relative flex cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
							<label
								class="w-full flex items-center text-gray-700 dark:text-white text-xs font-semibold cursor-pointer">
								<input type="checkbox"
									:checked="selectedNotifications.size === notifications.length && notifications.length > 0"
									:indeterminate.prop="selectedNotifications.size > 0 && selectedNotifications.size < notifications.length"
									@change="toggleSelectAll"
									class="appearance-none me-2 w-5 h-5 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
									:class="(selectedNotifications.size === notifications.length && notifications.length > 0) || (selectedNotifications.size > 0 && selectedNotifications.size < notifications.length) ? 'is-checked bg-yellow-400' : ''" />
								{{ $t("panel.notifications.selectAll") }}
							</label>
						</div>
					</div>


					<!-- Bulk Actions -->
					<div v-if="showCheckboxes && selectedNotifications.size > 0" class="mb-4 space-y-0.5">
						<button @click="handleBulkMarkAsRead" :disabled="bulkLoading"
							class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-between gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
							<div class="flex items-center gap-2">
								<span
									class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
									<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd"
											d="M10.9436 1.25H13.0564C14.8942 1.24998 16.3498 1.24997 17.489 1.40314C18.6614 1.56076 19.6104 1.89288 20.3588 2.64124C21.1071 3.38961 21.4392 4.33856 21.5969 5.51098C21.75 6.65019 21.75 8.10583 21.75 9.94359V14.0564C21.75 15.8942 21.75 17.3498 21.5969 18.489C21.4392 19.6614 21.1071 20.6104 20.3588 21.3588C19.6104 22.1071 18.6614 22.4392 17.489 22.5969C16.3498 22.75 14.8942 22.75 13.0564 22.75H10.9436C9.10583 22.75 7.65019 22.75 6.51098 22.5969C5.33856 22.4392 4.38961 22.1071 3.64124 21.3588C2.89288 20.6104 2.56076 19.6614 2.40314 18.489C2.24997 17.3498 2.24998 15.8942 2.25 14.0564V9.94358C2.24998 8.10582 2.24997 6.65019 2.40314 5.51098C2.56076 4.33856 2.89288 3.38961 3.64124 2.64124C4.38961 1.89288 5.33856 1.56076 6.51098 1.40314C7.65019 1.24997 9.10582 1.24998 10.9436 1.25ZM6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V14C3.75 15.9068 3.75159 17.2615 3.88976 18.2892C4.02502 19.2952 4.27869 19.8749 4.7019 20.2981C5.12511 20.7213 5.70476 20.975 6.71085 21.1102C7.73851 21.2484 9.09318 21.25 11 21.25H13C14.9068 21.25 16.2615 21.2484 17.2892 21.1102C18.2952 20.975 18.8749 20.7213 19.2981 20.2981C19.7213 19.8749 19.975 19.2952 20.1102 18.2892C20.2484 17.2615 20.25 15.9068 20.25 14V10C20.25 8.09318 20.2484 6.73851 20.1102 5.71085C19.975 4.70476 19.7213 4.12511 19.2981 3.7019C18.8749 3.27869 18.2952 3.02502 17.2892 2.88976C16.2615 2.75159 14.9068 2.75 13 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976ZM7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8ZM7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12ZM7.25 16C7.25 15.5858 7.58579 15.25 8 15.25H13C13.4142 15.25 13.75 15.5858 13.75 16C13.75 16.4142 13.4142 16.75 13 16.75H8C7.58579 16.75 7.25 16.4142 7.25 16Z"
											class="fill-current"></path>
									</svg>
								</span>
								{{ $t("panel.notifications.markRead") }}
							</div>
							<div>{{ selectedNotifications.size }}</div>
						</button>
						<button @click="handleBulkMarkAsUnread" :disabled="bulkLoading"
							class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-between gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
							<div class="flex items-center gap-2">
								<span
									class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
									<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path class="fill-current"
											d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V10.5C22.75 10.0858 22.4142 9.75 22 9.75C21.5858 9.75 21.25 10.0858 21.25 10.5V12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62178 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62178 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62178 2.75 12 2.75H13.5C13.9142 2.75 14.25 2.41421 14.25 2C14.25 1.58579 13.9142 1.25 13.5 1.25H11.9426Z">
										</path>
										<path fill-rule="evenodd" clip-rule="evenodd"
											d="M19 1.25C16.9289 1.25 15.25 2.92893 15.25 5C15.25 7.07107 16.9289 8.75 19 8.75C21.0711 8.75 22.75 7.07107 22.75 5C22.75 2.92893 21.0711 1.25 19 1.25ZM16.75 5C16.75 3.75736 17.7574 2.75 19 2.75C20.2426 2.75 21.25 3.75736 21.25 5C21.25 6.24264 20.2426 7.25 19 7.25C17.7574 7.25 16.75 6.24264 16.75 5Z"
											class="fill-current"></path>
										<path
											d="M6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H16C16.4142 13.25 16.75 13.5858 16.75 14C16.75 14.4142 16.4142 14.75 16 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14Z"
											class="fill-current"></path>
										<path
											d="M7 16.75C6.58579 16.75 6.25 17.0858 6.25 17.5C6.25 17.9142 6.58579 18.25 7 18.25H13C13.4142 18.25 13.75 17.9142 13.75 17.5C13.75 17.0858 13.4142 16.75 13 16.75H7Z"
											class="fill-current"></path>
									</svg>
								</span>
								{{ $t("panel.notifications.markUnread") }}
							</div>
							<div>{{ selectedNotifications.size }}</div>
						</button>
						<button @click="handleBulkDelete" :disabled="bulkLoading"
							class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-between gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
							<div class="flex items-center gap-2">
								<span
									class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
									<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
											stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								{{ $t("panel.notifications.delete") }}
							</div>
							<div>{{ selectedNotifications.size }}</div>
						</button>
					</div>

					<!-- General Actions - Only show when no items are selected -->
					<div v-if="selectedNotifications.size === 0" class="mb-4 space-y-0.5">
						<button @click="handleMarkAllAsRead" :disabled="bulkLoading"
							class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-start gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
							<span
								class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
								<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd"
										d="M10.9436 1.25H13.0564C14.8942 1.24998 16.3498 1.24997 17.489 1.40314C18.6614 1.56076 19.6104 1.89288 20.3588 2.64124C21.1071 3.38961 21.4392 4.33856 21.5969 5.51098C21.75 6.65019 21.75 8.10583 21.75 9.94359V14.0564C21.75 15.8942 21.75 17.3498 21.5969 18.489C21.4392 19.6614 21.1071 20.6104 20.3588 21.3588C19.6104 22.1071 18.6614 22.4392 17.489 22.5969C16.3498 22.75 14.8942 22.75 13.0564 22.75H10.9436C9.10583 22.75 7.65019 22.75 6.51098 22.5969C5.33856 22.4392 4.38961 22.1071 3.64124 21.3588C2.89288 20.6104 2.56076 19.6614 2.40314 18.489C2.24997 17.3498 2.24998 15.8942 2.25 14.0564V9.94358C2.24998 8.10582 2.24997 6.65019 2.40314 5.51098C2.56076 4.33856 2.89288 3.38961 3.64124 2.64124C4.38961 1.89288 5.33856 1.56076 6.51098 1.40314C7.65019 1.24997 9.10582 1.24998 10.9436 1.25ZM6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V14C3.75 15.9068 3.75159 17.2615 3.88976 18.2892C4.02502 19.2952 4.27869 19.8749 4.7019 20.2981C5.12511 20.7213 5.70476 20.975 6.71085 21.1102C7.73851 21.2484 9.09318 21.25 11 21.25H13C14.9068 21.25 16.2615 21.2484 17.2892 21.1102C18.2952 20.975 18.8749 20.7213 19.2981 20.2981C19.7213 19.8749 19.975 19.2952 20.1102 18.2892C20.2484 17.2615 20.25 15.9068 20.25 14V10C20.25 8.09318 20.2484 6.73851 20.1102 5.71085C19.975 4.70476 19.7213 4.12511 19.2981 3.7019C18.8749 3.27869 18.2952 3.02502 17.2892 2.88976C16.2615 2.75159 14.9068 2.75 13 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976ZM7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8ZM7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12ZM7.25 16C7.25 15.5858 7.58579 15.25 8 15.25H13C13.4142 15.25 13.75 15.5858 13.75 16C13.75 16.4142 13.4142 16.75 13 16.75H8C7.58579 16.75 7.25 16.4142 7.25 16Z"
										class="fill-current"></path>
								</svg>
							</span>
							{{ $t("panel.notifications.markAllRead") }}
						</button>
						<button @click="handleMarkAllAsUnread" :disabled="bulkLoading"
							class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-start gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
							<span
								class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
								<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path class="fill-current"
										d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V10.5C22.75 10.0858 22.4142 9.75 22 9.75C21.5858 9.75 21.25 10.0858 21.25 10.5V12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62178 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62178 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62178 2.75 12 2.75H13.5C13.9142 2.75 14.25 2.41421 14.25 2C14.25 1.58579 13.9142 1.25 13.5 1.25H11.9426Z">
									</path>
									<path fill-rule="evenodd" clip-rule="evenodd"
										d="M19 1.25C16.9289 1.25 15.25 2.92893 15.25 5C15.25 7.07107 16.9289 8.75 19 8.75C21.0711 8.75 22.75 7.07107 22.75 5C22.75 2.92893 21.0711 1.25 19 1.25ZM16.75 5C16.75 3.75736 17.7574 2.75 19 2.75C20.2426 2.75 21.25 3.75736 21.25 5C21.25 6.24264 20.2426 7.25 19 7.25C17.7574 7.25 16.75 6.24264 16.75 5Z"
										class="fill-current"></path>
									<path
										d="M6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H16C16.4142 13.25 16.75 13.5858 16.75 14C16.75 14.4142 16.4142 14.75 16 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14Z"
										class="fill-current"></path>
									<path
										d="M7 16.75C6.58579 16.75 6.25 17.0858 6.25 17.5C6.25 17.9142 6.58579 18.25 7 18.25H13C13.4142 18.25 13.75 17.9142 13.75 17.5C13.75 17.0858 13.4142 16.75 13 16.75H7Z"
										class="fill-current"></path>
								</svg>
							</span>
							{{ $t("panel.notifications.markAllUnread") }}
						</button>
						<button @click="handleDeleteAll" :disabled="bulkLoading"
							class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-start gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
							<span
								class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
								<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
										stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
							{{ $t("panel.notifications.deleteAll") }}
						</button>
					</div>

					<!-- View Mode Toggle -->
					<div class="mb-4">
						<label class="block text-xs font-semibold text-gray-50 dark:text-white mb-2">{{ $t("panel.notifications.displayMode") }}
							</label>
						<div class="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl p-1">
							<button @click="toggleViewMode('grid')"
								:class="viewMode === 'grid' ? 'bg-yellow-400 dark:bg-yellow-400 text-gray-900' : 'text-gray-600 dark:text-gray-100'"
								class="group flex-1 items-center justify-center p-1 rounded-md transition-all duration-200">
								<span class="text-current">
									<svg class="w-4 h-4 mx-auto my-1" viewBox="0 0 24 24" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor"
											stroke-width="2" />
										<rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor"
											stroke-width="2" />
										<rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor"
											stroke-width="2" />
										<rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor"
											stroke-width="2" />
									</svg>
								</span>
							</button>
							<button @click="toggleViewMode('table')"
								:class="viewMode === 'table' ? 'bg-yellow-400 dark:bg-yellow-400 text-gray-900' : 'text-gray-600 dark:text-gray-100'"
								class="group flex-1 items-center justify-center p-1 rounded-md transition-all duration-200">
								<span class="text-current">
									<svg class="w-4 h-4 mx-auto my-1" viewBox="0 0 24 24" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path d="M3 10H21M3 14H21M3 18H21M3 6H21" stroke="currentColor" stroke-width="2"
											stroke-linecap="round" />
									</svg>
								</span>
							</button>
						</div>
					</div>

					<!-- Per Page Selector -->
					<div>
						<label class="block text-xs font-semibold text-gray-700 dark:text-white mb-2">{{ $t("panel.notifications.perPage") }}
							</label>
						<select v-model="perPage" @change="selectPerpage(perPage)"
							class="w-full px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent">
							<option v-for="(per, index) in perPages" :key="index" :value="per">{{ per }}</option>
						</select>
					</div>
				</div>
			</div>

			<div class="md:col-span-9">
				<!-- Mobile Filter Button -->
				<div class="md:hidden mb-8">
					<button @click="isFilterDrawerOpen = true"
						class="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all">
						<div class="flex items-center gap-2">
							<svg class="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path class="stroke-amber-400 dark:stroke-yellow-400"
									d="M7.60848 4C6.03761 4 5.07993 5.7279 5.91249 7.06L8.08798 10.5408C8.68397 11.4944 8.99999 12.5963 8.99999 13.7208V16.7639C8.99999 17.5215 9.42799 18.214 10.1056 18.5528L13.5528 20.2764C14.2177 20.6088 15 20.1253 15 19.382V13.7208C15 12.5963 15.316 11.4944 15.912 10.5408L18.0875 7.06C18.9201 5.7279 17.9624 4 16.3915 4H7.60848Z"
									stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
							</svg>
							<span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $t("panel.notifications.filterAndSort") }}
								</span>
						</div>
						<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
							</path>
						</svg>
					</button>
				</div>

				<!-- Mobile BottomSheetDrawer -->
				<BottomSheetDrawer v-model="isFilterDrawerOpen" :initial-height="0.6" :max-height="0.85"
					:header-height="80" :auto-close-on-min="true" :close-on-backdrop="true" :lock-scroll="true"
					:panel-class="'bg-gray-100 dark:bg-gray-800 border-t border-gray-200/70 dark:border-gray-700/70 rounded-t-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
					:content-class="'px-4 pb-4 overflow-auto'">
					<div class="py-4 space-y-6">
						<div class="w-full p-4 border-2 border-gray-300 dark:border-gray-600/60 rounded-xl">
							<h4 class="font-bold text-base text-gray-700 dark:text-white flex items-center">
								<svg class="me-2 w-6 h-6" viewBox="0 0 24 24" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path class="stroke-amber-400 dark:stroke=yellow-400"
										d="M7.60848 4C6.03761 4 5.07993 5.7279 5.91249 7.06L8.08798 10.5408C8.68397 11.4944 8.99999 12.5963 8.99999 13.7208V16.7639C8.99999 17.5215 9.42799 18.214 10.1056 18.5528L13.5528 20.2764C14.2177 20.6088 15 20.1253 15 19.382V13.7208C15 12.5963 15.316 11.4944 15.912 10.5408L18.0875 7.06C18.9201 5.7279 17.9624 4 16.3915 4H7.60848Z"
										stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
								</svg>
								{{ $t("panel.notifications.filters") }}
							</h4>
							<hr class="my-3 border-t-2 border-gray-300 dark:border-gray-600/60" />
							<div class="mx-auto w-full max-w-md">
								<RadioGroup v-model="filters.filter">
									<div class="space-y-2">
										<RadioGroupOption as="template" value="all" @click="selectFilter('all')"
											v-slot="{ active, checked }">
											<div :class="[active ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300' : '', checked ? 'bg-sky-900/75 text-white ' : 'bg-white dark:bg-gray-900']"
												class="relative flex cursor-pointer rounded-xl px-4 py-3 shadow-md focus:outline-none">
												<div class="flex w-full items-center justify-between">
													<div class="flex items-center">
														<div class="text-sm flex items-center">
															<span
																:class="checked ? 'bg-amber-400' : 'bg-gray-400 group-hover:bg-opacity-100'"
																class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 me-3 flex items-center justify-center rounded-lg text-white">
																<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
																	xmlns="http://www.w3.org/2000/svg">
																	<path class="stroke-current"
																		d="M1.97998 13H5.76998C6.52998 13 7.21998 13.43 7.55998 14.11L8.44998 15.9C8.99998 17 9.99998 17 10.24 17H13.77C14.53 17 15.22 16.57 15.56 15.89L16.45 14.1C16.79 13.42 17.48 12.99 18.24 12.99H21.98"
																		stroke-width="1.5" stroke-linecap="round"
																		stroke-linejoin="round"></path>
																	<path class="stroke-current"
																		d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z"
																		stroke-width="1.5" stroke-linecap="round"
																		stroke-linejoin="round"></path>
																	<path class="stroke-current"
																		d="M14 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10"
																		stroke-width="1.5" stroke-linecap="round"
																		stroke-linejoin="round"></path>
																</svg>
															</span>
															<RadioGroupLabel as="p"
																:class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
																class="font-semibold">{{ $t("panel.notifications.filterAll") }}</RadioGroupLabel>
														</div>
													</div>
												</div>
											</div>
										</RadioGroupOption>
										<RadioGroupOption as="template" value="unread" @click="selectFilter('unread')"
											v-slot="{ active, checked }">
											<div :class="[active ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300' : '', checked ? 'bg-sky-900/75 text-white ' : 'bg-white dark:bg-gray-900']"
												class="relative flex cursor-pointer rounded-xl px-4 py-3 shadow-md focus:outline-none">
												<div class="flex w-full items-center justify-between">
													<div class="flex items-center">
														<div class="text-sm flex items-center">
															<span
																:class="checked ? 'bg-amber-400' : 'bg-gray-400 group-hover:bg-opacity-100'"
																class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 me-3 flex items-center justify-center rounded-lg text-white">
																<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
																	xmlns="http://www.w3.org/2000/svg">
																	<path class="fill-current"
																		d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V10.5C22.75 10.0858 22.4142 9.75 22 9.75C21.5858 9.75 21.25 10.0858 21.25 10.5V12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62178 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62178 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62178 2.75 12 2.75H13.5C13.9142 2.75 14.25 2.41421 14.25 2C14.25 1.58579 13.9142 1.25 13.5 1.25H11.9426Z">
																	</path>
																	<path fill-rule="evenodd" clip-rule="evenodd"
																		d="M19 1.25C16.9289 1.25 15.25 2.92893 15.25 5C15.25 7.07107 16.9289 8.75 19 8.75C21.0711 8.75 22.75 7.07107 22.75 5C22.75 2.92893 21.0711 1.25 19 1.25ZM16.75 5C16.75 3.75736 17.7574 2.75 19 2.75C20.2426 2.75 21.25 3.75736 21.25 5C21.25 6.24264 20.2426 7.25 19 7.25C17.7574 7.25 16.75 6.24264 16.75 5Z"
																		class="fill-current"></path>
																	<path
																		d="M6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H16C16.4142 13.25 16.75 13.5858 16.75 14C16.75 14.4142 16.4142 14.75 16 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14Z"
																		class="fill-current"></path>
																	<path
																		d="M7 16.75C6.58579 16.75 6.25 17.0858 6.25 17.5C6.25 17.9142 6.58579 18.25 7 18.25H13C13.4142 18.25 13.75 17.9142 13.75 17.5C13.75 17.0858 13.4142 16.75 13 16.75H7Z"
																		class="fill-current"></path>
																</svg>
															</span>
															<RadioGroupLabel as="p"
																:class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
																class="font-semibold">{{ $t("panel.notifications.filterUnread") }}</RadioGroupLabel>
														</div>
													</div>
												</div>
											</div>
										</RadioGroupOption>
										<RadioGroupOption as="template" value="read" @click="selectFilter('read')"
											v-slot="{ active, checked }">
											<div :class="[active ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300' : '', checked ? 'bg-sky-900/75 text-white ' : 'bg-white dark:bg-gray-900']"
												class="relative flex cursor-pointer rounded-xl px-4 py-3 shadow-md focus:outline-none">
												<div class="flex w-full items-center justify-between">
													<div class="flex items-center">
														<div class="text-sm flex items-center">
															<span
																:class="checked ? 'bg-amber-400' : 'bg-gray-400 group-hover:bg-opacity-100'"
																class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 me-3 flex items-center justify-center rounded-lg text-white">
																<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
																	xmlns="http://www.w3.org/2000/svg">
																	<path fill-rule="evenodd" clip-rule="evenodd"
																		d="M10.9436 1.25H13.0564C14.8942 1.24998 16.3498 1.24997 17.489 1.40314C18.6614 1.56076 19.6104 1.89288 20.3588 2.64124C21.1071 3.38961 21.4392 4.33856 21.5969 5.51098C21.75 6.65019 21.75 8.10583 21.75 9.94359V14.0564C21.75 15.8942 21.75 17.3498 21.5969 18.489C21.4392 19.6614 21.1071 20.6104 20.3588 21.3588C19.6104 22.1071 18.6614 22.4392 17.489 22.5969C16.3498 22.75 14.8942 22.75 13.0564 22.75H10.9436C9.10583 22.75 7.65019 22.75 6.51098 22.5969C5.33856 22.4392 4.38961 22.1071 3.64124 21.3588C2.89288 20.6104 2.56076 19.6614 2.40314 18.489C2.24997 17.3498 2.24998 15.8942 2.25 14.0564V9.94358C2.24998 8.10582 2.24997 6.65019 2.40314 5.51098C2.56076 4.33856 2.89288 3.38961 3.64124 2.64124C4.38961 1.89288 5.33856 1.56076 6.51098 1.40314C7.65019 1.24997 9.10582 1.24998 10.9436 1.25ZM6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V14C3.75 15.9068 3.75159 17.2615 3.88976 18.2892C4.02502 19.2952 4.27869 19.8749 4.7019 20.2981C5.12511 20.7213 5.70476 20.975 6.71085 21.1102C7.73851 21.2484 9.09318 21.25 11 21.25H13C14.9068 21.25 16.2615 21.2484 17.2892 21.1102C18.2952 20.975 18.8749 20.7213 19.2981 20.2981C19.7213 19.8749 19.975 19.2952 20.1102 18.2892C20.2484 17.2615 20.25 15.9068 20.25 14V10C20.25 8.09318 20.2484 6.73851 20.1102 5.71085C19.975 4.70476 19.7213 4.12511 19.2981 3.7019C18.8749 3.27869 18.2952 3.02502 17.2892 2.88976C16.2615 2.75159 14.9068 2.75 13 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976ZM7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8ZM7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12ZM7.25 16C7.25 15.5858 7.58579 15.25 8 15.25H13C13.4142 15.25 13.75 15.5858 13.75 16C13.75 16.4142 13.4142 16.75 13 16.75H8C7.58579 16.75 7.25 16.4142 7.25 16Z"
																		class="fill-current"></path>
																</svg>
															</span>
															<RadioGroupLabel as="p"
																:class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
																class="font-semibold">{{ $t("panel.notifications.filterRead") }}</RadioGroupLabel>
														</div>
													</div>
												</div>
											</div>
										</RadioGroupOption>
									</div>
								</RadioGroup>
							</div>
						</div>

						<div class="mt-8 w-full p-4 border-2 border-gray-300 dark:border-gray-600/60 rounded-xl">
							<h4 class="font-bold text-base text-gray-700 dark:text-white flex items-center">
								<svg class="me-2 w-6 h-6" viewBox="0 0 24 24" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path class="stroke-amber-400 dark:stroke-yellow-400" d="M4 8H13" stroke-width="1.8"
										stroke-linecap="round"></path>
									<path class="stroke-amber-400 dark:stroke-yellow-400" d="M6 13H13"
										stroke-width="1.8" stroke-linecap="round"></path>
									<path class="stroke-amber-400 dark:stroke-yellow-400" d="M8 18H13"
										stroke-width="1.8" stroke-linecap="round"></path>
									<path class="stroke-amber-400 dark:stroke-yellow-400" d="M17 20V4L20 8"
										stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
								</svg>
								{{ $t("panel.notifications.sort") }}
							</h4>
							<hr class="my-3 border-t-2 border-gray-300 dark:border-gray-600/60" />
							<div class="mx-auto w-full max-w-md">
								<RadioGroup v-model="filters.sort">
									<div class="space-y-2">
										<RadioGroupOption as="template" value="newest" @click="selectSort('newest')"
											v-slot="{ active, checked }">
											<div :class="[active ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300' : '', checked ? 'bg-sky-900/75 text-white ' : 'bg-white dark:bg-gray-900']"
												class="relative flex cursor-pointer rounded-xl px-4 py-3 shadow-md focus:outline-none">
												<div class="flex w-full items-center justify-between">
													<div class="flex items-center">
														<div class="text-sm">
															<RadioGroupLabel as="p"
																:class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
																class="font-semibold">{{ $t("panel.common.sortNewest") }}</RadioGroupLabel>
														</div>
													</div>
													<div v-show="checked" class="shrink-0 text-white">
														<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
															<circle class="fill-yellow-400" cx="12" cy="12" r="12"
																fill-opacity="0.9" />
															<path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="1.5"
																stroke-linecap="round" stroke-linejoin="round" />
														</svg>
													</div>
												</div>
											</div>
										</RadioGroupOption>
										<RadioGroupOption as="template" value="oldest" @click="selectSort('oldest')"
											v-slot="{ active, checked }">
											<div :class="[active ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300' : '', checked ? 'bg-sky-900/75 text-white ' : 'bg-white dark:bg-gray-900']"
												class="relative flex cursor-pointer rounded-xl px-4 py-3 shadow-md focus:outline-none">
												<div class="flex w-full items-center justify-between">
													<div class="flex items-center">
														<div class="text-sm">
															<RadioGroupLabel as="p"
																:class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
																class="font-semibold">{{ $t("panel.common.sortOldest") }}</RadioGroupLabel>
														</div>
													</div>
													<div v-show="checked" class="shrink-0 text-white">
														<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
															<circle class="fill-yellow-400" cx="12" cy="12" r="12"
																fill-opacity="0.9" />
															<path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="1.5"
																stroke-linecap="round" stroke-linejoin="round" />
														</svg>
													</div>
												</div>
											</div>
										</RadioGroupOption>
									</div>
								</RadioGroup>
							</div>
						</div>

						<!-- Actions & Settings Section -->
						<div class="mt-8 w-full p-4 border-2 border-gray-300 dark:border-gray-600/60 rounded-xl">
							<h4 class="font-bold text-base text-gray-700 dark:text-white flex items-center">
								<svg class="me-2 w-6 h-6" viewBox="0 0 24 24" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path class="stroke-amber-400 dark:stroke-yellow-400"
										d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
										stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
									<path class="stroke-amber-400 dark:stroke-yellow-400"
										d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01131 9.77251C4.28062 9.5799 4.48568 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
										stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
								{{ $t("panel.notifications.actionsSettings") }}
							</h4>
							<hr class="my-3 border-t-2 border-gray-300 dark:border-gray-600/60" />

							<div class="mb-4">
								<!-- Toggle Checkboxes -->
								<div
									class="bg-white dark:bg-gray-900 relative flex cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
									<label
										class="w-full flex items-center text-gray-700 dark:text-white text-xs font-semibold cursor-pointer">
										<input type="checkbox" :checked="showCheckboxes" @change="toggleCheckboxes"
											class="appearance-none me-2 w-5 h-5 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
											:class="showCheckboxes ? 'is-checked bg-yellow-400' : ''" />
										{{ $t("panel.notifications.selectNotifications") }}
									</label>
								</div>
								<!-- Select All -->
								<div v-if="showCheckboxes && notifications && notifications.length > 0"
									class="mt-0.5 bg-white dark:bg-gray-900 relative flex cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
									<label
										class="w-full flex items-center text-gray-700 dark:text-white text-xs font-semibold cursor-pointer">
										<input type="checkbox"
											:checked="selectedNotifications.size === notifications.length && notifications.length > 0"
											:indeterminate.prop="selectedNotifications.size > 0 && selectedNotifications.size < notifications.length"
											@change="toggleSelectAll"
											class="appearance-none me-2 w-5 h-5 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
											:class="(selectedNotifications.size === notifications.length && notifications.length > 0) || (selectedNotifications.size > 0 && selectedNotifications.size < notifications.length) ? 'is-checked bg-yellow-400' : ''" />
										{{ $t("panel.notifications.selectAll") }}
									</label>
								</div>
							</div>


							<!-- Bulk Actions -->
							<div v-if="showCheckboxes && selectedNotifications.size > 0" class="mb-4 space-y-0.5">
								<button @click="handleBulkMarkAsRead" :disabled="bulkLoading"
									class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-between gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
									<div class="flex items-center gap-2">
										<span
											class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
											<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path fill-rule="evenodd" clip-rule="evenodd"
													d="M10.9436 1.25H13.0564C14.8942 1.24998 16.3498 1.24997 17.489 1.40314C18.6614 1.56076 19.6104 1.89288 20.3588 2.64124C21.1071 3.38961 21.4392 4.33856 21.5969 5.51098C21.75 6.65019 21.75 8.10583 21.75 9.94359V14.0564C21.75 15.8942 21.75 17.3498 21.5969 18.489C21.4392 19.6614 21.1071 20.6104 20.3588 21.3588C19.6104 22.1071 18.6614 22.4392 17.489 22.5969C16.3498 22.75 14.8942 22.75 13.0564 22.75H10.9436C9.10583 22.75 7.65019 22.75 6.51098 22.5969C5.33856 22.4392 4.38961 22.1071 3.64124 21.3588C2.89288 20.6104 2.56076 19.6614 2.40314 18.489C2.24997 17.3498 2.24998 15.8942 2.25 14.0564V9.94358C2.24998 8.10582 2.24997 6.65019 2.40314 5.51098C2.56076 4.33856 2.89288 3.38961 3.64124 2.64124C4.38961 1.89288 5.33856 1.56076 6.51098 1.40314C7.65019 1.24997 9.10582 1.24998 10.9436 1.25ZM6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V14C3.75 15.9068 3.75159 17.2615 3.88976 18.2892C4.02502 19.2952 4.27869 19.8749 4.7019 20.2981C5.12511 20.7213 5.70476 20.975 6.71085 21.1102C7.73851 21.2484 9.09318 21.25 11 21.25H13C14.9068 21.25 16.2615 21.2484 17.2892 21.1102C18.2952 20.975 18.8749 20.7213 19.2981 20.2981C19.7213 19.8749 19.975 19.2952 20.1102 18.2892C20.2484 17.2615 20.25 15.9068 20.25 14V10C20.25 8.09318 20.2484 6.73851 20.1102 5.71085C19.975 4.70476 19.7213 4.12511 19.2981 3.7019C18.8749 3.27869 18.2952 3.02502 17.2892 2.88976C16.2615 2.75159 14.9068 2.75 13 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976ZM7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8ZM7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12ZM7.25 16C7.25 15.5858 7.58579 15.25 8 15.25H13C13.4142 15.25 13.75 15.5858 13.75 16C13.75 16.4142 13.4142 16.75 13 16.75H8C7.58579 16.75 7.25 16.4142 7.25 16Z"
													class="fill-current"></path>
											</svg>
										</span>
										{{ $t("panel.notifications.markRead") }}
									</div>
									<div>{{ selectedNotifications.size }}</div>
								</button>
								<button @click="handleBulkMarkAsUnread" :disabled="bulkLoading"
									class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-between gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
									<div class="flex items-center gap-2">
										<span
											class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
											<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path class="fill-current"
													d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V10.5C22.75 10.0858 22.4142 9.75 22 9.75C21.5858 9.75 21.25 10.0858 21.25 10.5V12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62178 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62178 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62178 2.75 12 2.75H13.5C13.9142 2.75 14.25 2.41421 14.25 2C14.25 1.58579 13.9142 1.25 13.5 1.25H11.9426Z">
												</path>
												<path fill-rule="evenodd" clip-rule="evenodd"
													d="M19 1.25C16.9289 1.25 15.25 2.92893 15.25 5C15.25 7.07107 16.9289 8.75 19 8.75C21.0711 8.75 22.75 7.07107 22.75 5C22.75 2.92893 21.0711 1.25 19 1.25ZM16.75 5C16.75 3.75736 17.7574 2.75 19 2.75C20.2426 2.75 21.25 3.75736 21.25 5C21.25 6.24264 20.2426 7.25 19 7.25C17.7574 7.25 16.75 6.24264 16.75 5Z"
													class="fill-current"></path>
												<path
													d="M6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H16C16.4142 13.25 16.75 13.5858 16.75 14C16.75 14.4142 16.4142 14.75 16 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14Z"
													class="fill-current"></path>
												<path
													d="M7 16.75C6.58579 16.75 6.25 17.0858 6.25 17.5C6.25 17.9142 6.58579 18.25 7 18.25H13C13.4142 18.25 13.75 17.9142 13.75 17.5C13.75 17.0858 13.4142 16.75 13 16.75H7Z"
													class="fill-current"></path>
											</svg>
										</span>
										{{ $t("panel.notifications.markUnread") }}
									</div>
									<div>{{ selectedNotifications.size }}</div>
								</button>
								<button @click="handleBulkDelete" :disabled="bulkLoading"
									class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-between gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
									<div class="flex items-center gap-2">
										<span
											class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
											<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path
													d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
													stroke="currentColor" stroke-linecap="round"
													stroke-linejoin="round" />
											</svg>
										</span>
										{{ $t("panel.notifications.delete") }}
									</div>
									<div>{{ selectedNotifications.size }}</div>
								</button>
							</div>

							<!-- General Actions - Only show when no items are selected -->
							<div v-if="selectedNotifications.size === 0" class="mb-4 space-y-0.5">
								<button @click="handleMarkAllAsRead" :disabled="bulkLoading"
									class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-start gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
									<span
										class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
										<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path fill-rule="evenodd" clip-rule="evenodd"
												d="M10.9436 1.25H13.0564C14.8942 1.24998 16.3498 1.24997 17.489 1.40314C18.6614 1.56076 19.6104 1.89288 20.3588 2.64124C21.1071 3.38961 21.4392 4.33856 21.5969 5.51098C21.75 6.65019 21.75 8.10583 21.75 9.94359V14.0564C21.75 15.8942 21.75 17.3498 21.5969 18.489C21.4392 19.6614 21.1071 20.6104 20.3588 21.3588C19.6104 22.1071 18.6614 22.4392 17.489 22.5969C16.3498 22.75 14.8942 22.75 13.0564 22.75H10.9436C9.10583 22.75 7.65019 22.75 6.51098 22.5969C5.33856 22.4392 4.38961 22.1071 3.64124 21.3588C2.89288 20.6104 2.56076 19.6614 2.40314 18.489C2.24997 17.3498 2.24998 15.8942 2.25 14.0564V9.94358C2.24998 8.10582 2.24997 6.65019 2.40314 5.51098C2.56076 4.33856 2.89288 3.38961 3.64124 2.64124C4.38961 1.89288 5.33856 1.56076 6.51098 1.40314C7.65019 1.24997 9.10582 1.24998 10.9436 1.25ZM6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V14C3.75 15.9068 3.75159 17.2615 3.88976 18.2892C4.02502 19.2952 4.27869 19.8749 4.7019 20.2981C5.12511 20.7213 5.70476 20.975 6.71085 21.1102C7.73851 21.2484 9.09318 21.25 11 21.25H13C14.9068 21.25 16.2615 21.2484 17.2892 21.1102C18.2952 20.975 18.8749 20.7213 19.2981 20.2981C19.7213 19.8749 19.975 19.2952 20.1102 18.2892C20.2484 17.2615 20.25 15.9068 20.25 14V10C20.25 8.09318 20.2484 6.73851 20.1102 5.71085C19.975 4.70476 19.7213 4.12511 19.2981 3.7019C18.8749 3.27869 18.2952 3.02502 17.2892 2.88976C16.2615 2.75159 14.9068 2.75 13 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976ZM7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8ZM7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12ZM7.25 16C7.25 15.5858 7.58579 15.25 8 15.25H13C13.4142 15.25 13.75 15.5858 13.75 16C13.75 16.4142 13.4142 16.75 13 16.75H8C7.58579 16.75 7.25 16.4142 7.25 16Z"
												class="fill-current"></path>
										</svg>
									</span>
									{{ $t("panel.notifications.markAllRead") }}
								</button>
								<button @click="handleMarkAllAsUnread" :disabled="bulkLoading"
									class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-start gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
									<span
										class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
										<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path class="fill-current"
												d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V10.5C22.75 10.0858 22.4142 9.75 22 9.75C21.5858 9.75 21.25 10.0858 21.25 10.5V12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62178 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62178 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62178 2.75 12 2.75H13.5C13.9142 2.75 14.25 2.41421 14.25 2C14.25 1.58579 13.9142 1.25 13.5 1.25H11.9426Z">
											</path>
											<path fill-rule="evenodd" clip-rule="evenodd"
												d="M19 1.25C16.9289 1.25 15.25 2.92893 15.25 5C15.25 7.07107 16.9289 8.75 19 8.75C21.0711 8.75 22.75 7.07107 22.75 5C22.75 2.92893 21.0711 1.25 19 1.25ZM16.75 5C16.75 3.75736 17.7574 2.75 19 2.75C20.2426 2.75 21.25 3.75736 21.25 5C21.25 6.24264 20.2426 7.25 19 7.25C17.7574 7.25 16.75 6.24264 16.75 5Z"
												class="fill-current"></path>
											<path
												d="M6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H16C16.4142 13.25 16.75 13.5858 16.75 14C16.75 14.4142 16.4142 14.75 16 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14Z"
												class="fill-current"></path>
											<path
												d="M7 16.75C6.58579 16.75 6.25 17.0858 6.25 17.5C6.25 17.9142 6.58579 18.25 7 18.25H13C13.4142 18.25 13.75 17.9142 13.75 17.5C13.75 17.0858 13.4142 16.75 13 16.75H7Z"
												class="fill-current"></path>
										</svg>
									</span>
									{{ $t("panel.notifications.markAllUnread") }}
								</button>
								<button @click="handleDeleteAll" :disabled="bulkLoading"
									class="group disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-start gap-2 text-gray-900 dark:text-white text-xs font-semibold bg-white dark:bg-gray-900 relative cursor-pointer first:rounded-t-xl last:rounded-b-xl px-4 py-3 shadow-md focus:outline-none">
									<span
										class="bg-opacity-100 w-7 h-7 p-1.5 transition duration-200 flex items-center justify-center rounded-lg text-white group-hover:text-gray-900 bg-gray-400 group-hover:bg-amber-400 group-hover:bg-opacity-100">
										<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
												stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
										</svg>
									</span>
									{{ $t("panel.notifications.deleteAll") }}
								</button>
							</div>

							<!-- View Mode Toggle -->
							<div class="mb-4">
								<label class="block text-xs font-semibold text-gray-50 dark:text-white mb-2">{{ $t("panel.notifications.displayMode") }}
									</label>
								<div class="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl p-1">
									<button @click="toggleViewMode('grid')"
										:class="viewMode === 'grid' ? 'bg-yellow-400 dark:bg-yellow-400 text-gray-900' : 'text-gray-600 dark:text-gray-100'"
										class="group flex-1 items-center justify-center p-1 rounded-md transition-all duration-200">
										<span class="text-current">
											<svg class="w-4 h-4 mx-auto my-1" viewBox="0 0 24 24" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor"
													stroke-width="2" />
												<rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor"
													stroke-width="2" />
												<rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor"
													stroke-width="2" />
												<rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor"
													stroke-width="2" />
											</svg>
										</span>
									</button>
									<button @click="toggleViewMode('table')"
										:class="viewMode === 'table' ? 'bg-yellow-400 dark:bg-yellow-400 text-gray-900' : 'text-gray-600 dark:text-gray-100'"
										class="group flex-1 items-center justify-center p-1 rounded-md transition-all duration-200">
										<span class="text-current">
											<svg class="w-4 h-4 mx-auto my-1" viewBox="0 0 24 24" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path d="M3 10H21M3 14H21M3 18H21M3 6H21" stroke="currentColor"
													stroke-width="2" stroke-linecap="round" />
											</svg>
										</span>
									</button>
								</div>
							</div>

							<!-- Per Page Selector -->
							<div>
								<label class="block text-xs font-semibold text-gray-700 dark:text-white mb-2">{{ $t("panel.notifications.perPage") }}
									</label>
								<select v-model="perPage" @change="selectPerpage(perPage)"
									class="w-full px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent">
									<option v-for="(per, index) in perPages" :key="index" :value="per">{{ per }}
									</option>
								</select>
							</div>
						</div>
					</div>
				</BottomSheetDrawer>

				<div class="">
					<div v-if="startLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-3 gap-y-6">
						<NotificationCardLoading v-for="i in 5" :key="i" />
					</div>
					<div v-else id="notifications-list">
						<!-- Grid View -->
						<div v-if="viewMode === 'grid' && notifications && notifications.length > 0"
							class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-3 gap-y-6">
							<NotificationCard v-for="(notification, index) in notifications" :key="index"
								:notification="notification" @notification-details="handleNotificationDetails"
								:isDeleting="isDeleting[notification.id]"
								:delete-notification-func="handleDeleteNotification" :show-checkbox="showCheckboxes"
								:is-selected="isNotificationSelected(notification.id)"
								@toggle-selection="toggleSelection" />
						</div>

						<!-- Table View -->
						<div v-else-if="viewMode === 'table' && notifications && notifications.length > 0"
							class="overflow-x-auto custom-scrollbar">
							<table class="min-w-full border-separate border-spacing-y-0.5">
								<thead class="bg-gray-200/70 dark:bg-gray-700">
									<tr>
										<th class="w-3" :class="{ 'rounded-ss-xl': notifications.length > 0 }"></th>
										<th v-if="showCheckboxes" class="px-4 py-3 text-start">
											<input type="checkbox"
												:checked="selectedNotifications.size === notifications.length && notifications.length > 0"
												:indeterminate.prop="selectedNotifications.size > 0 && selectedNotifications.size < notifications.length"
												@change="toggleSelectAll"
												class="shrink-0 appearance-none w-5 h-5 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
												:class="(selectedNotifications.size === notifications.length && notifications.length > 0) || (selectedNotifications.size > 0 && selectedNotifications.size < notifications.length) ? 'is-checked' : ''" />
										</th>
										<th class=""></th>
										<th
											class="px-4 py-3 text-start text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[15rem]">
											{{ $t("panel.notifications.message") }}</th>
										<th
											class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
											{{ $t("panel.notifications.date") }}</th>
										<th
											class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300" :class="{ 'rounded-se-xl': notifications.length > 0 }">
											{{ $t("panel.notifications.operations") }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(notification, index) in notifications" :key="index"
										:class="isNotificationSelected(notification.id) ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
										class="group relative transition-colors duration-150 bg-white dark:bg-gray-900">
										<td class="w-3" :class="{ 'rounded-es-xl': index + 1 === notifications.length }">
											<div v-if="!notification.read_at"
												class="absolute start-0 top-4 w-1 h-[50%] rounded-e-lg bg-yellow-400">
											</div>
										</td>
										<td v-if="showCheckboxes" class="px-4 py-2">
											<input type="checkbox" :checked="isNotificationSelected(notification.id)"
												@change="() => toggleSelection(notification.id)"
												class="shrink-0 appearance-none mt-2 w-5 h-5 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
												:class="isNotificationSelected(notification.id) ? 'is-checked' : ''" />
										</td>
										<td class="">
											<div v-html="notification.data.icon"
												class=" flex items-center justify-center  w-6 h-6  text-gray-500 dark:text-gray-400"
												:class="{ 'text-gray-700 dark:text-white': !notification.read_at }">
											</div>
										</td>
										<td class="px-4 py-2 min-w-[15rem]">
											<div @click="handleNotificationDetails(notification.id)"
												v-html="notification.data.message"
												class="min-h-[3rem] cursor-pointer p-1 px-2 line-clamp-2 leading-5 max-w-sm w-full rounded-lg bg-gray-100/50 dark:bg-gray-600/10 text-start text-xs text-gray-600 dark:text-gray-400"
												:class="{ 'font-semibold text-gray-700 dark:text-zinc-300': !notification.read_at }">
											</div>
										</td>
										<td class="px-4 py-2 whitespace-nowrap">
											<div
												class="-rotate-12 group-hover:rotate-0 duration-200 px-2 py-1 rounded-lg bg-gray-100/50 dark:bg-gray-600/10 text-start text-xs text-gray-600 dark:text-gray-400">
												{{ new Date(notification.created_at).toLocaleDateString('fa-IR', {
													year: 'numeric', month: 'long', day: '2-digit'
												}).replace(/\//g, '-') }}
											</div>
										</td>
										<td class="px-4 py-2" :class="{ 'rounded-ee-xl': index + 1 === notifications.length }">
											<div class="flex items-center gap-0.5">
												<button @click="handleNotificationDetails(notification.id)"
													class="py-1 px-2.5 bg-gray-200 dark:bg-gray-300 hover:bg-opacity-50 text-gray-900 rounded rounded-e-none transition-colors duration-200">
													<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<path
															d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
															stroke="currentColor" stroke-linecap="round"
															stroke-linejoin="round" />
														<circle cx="12" cy="12" r="3" stroke="currentColor" />
													</svg>
												</button>
												<button @click="handleDeleteNotification(notification.id)"
													:disabled="isDeleting[notification.id]"
													class="py-1 px-2.5 bg-gray-200 dark:bg-gray-300 hover:bg-opacity-50 text-gray-900 rounded rounded-s-none transition-colors duration-200 disabled:opacity-50">
													<svg v-if="!isDeleting[notification.id]" class="w-4 h-4"
														viewBox="0 0 24 24" fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<path
															d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
															stroke="currentColor" stroke-linecap="round"
															stroke-linejoin="round" />
													</svg>
													<svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24"
														fill="none" xmlns="http://www.w3.org/2000/svg">
														<circle class="opacity-25" cx="12" cy="12" r="10"
															stroke="currentColor" stroke-width="4"></circle>
														<path class="opacity-75" fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
														</path>
													</svg>
												</button>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div v-else>
							<div class="flex flex-col items-center md:mt-16 lg:mt-28">
								<div class="font-bold text-gray-500 dark:text-gray-400">{{ $t("panel.common.empty") }}
								</div>
								<div
									class="mt-5 mx-auto w-[80%] md:w-[60%] lg:w-[40%] mb-8 rounded-ss-[4rem] rounded-ee-[4rem] rounded-se-xl rounded-es-xl p-8 bg-white dark:bg-slate-900 shadow-2xl shadow-gray-300 dark:shadow-gray-950">
									<svg class="scale-75 md:scale-95" viewBox="0 0 390 278" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<g class="opacity-100 dark:opacity-70">
											<path
												d="M201.086 68.018H116.479C115.181 68.018 114.171 67.0082 114.171 65.7099V16.3736C114.171 15.0752 115.181 14.0654 116.479 14.0654H201.086C202.385 14.0654 203.395 15.0752 203.395 16.3736V65.6377C203.395 66.9361 202.385 68.018 201.086 68.018Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path d="M114.17 23.8032H203.394" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10"></path>
											<path
												d="M119.94 20.4848C120.736 20.4848 121.382 19.8389 121.382 19.0422C121.382 18.2455 120.736 17.5996 119.94 17.5996C119.143 17.5996 118.497 18.2455 118.497 19.0422C118.497 19.8389 119.143 20.4848 119.94 20.4848Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M125.782 20.4848C126.579 20.4848 127.225 19.8389 127.225 19.0422C127.225 18.2455 126.579 17.5996 125.782 17.5996C124.986 17.5996 124.34 18.2455 124.34 19.0422C124.34 19.8389 124.986 20.4848 125.782 20.4848Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M131.697 20.4848C132.494 20.4848 133.14 19.8389 133.14 19.0422C133.14 18.2455 132.494 17.5996 131.697 17.5996C130.901 17.5996 130.255 18.2455 130.255 19.0422C130.255 19.8389 130.901 20.4848 131.697 20.4848Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M2.58684 107.257C3.46323 107.257 4.17368 106.547 4.17368 105.67C4.17368 104.794 3.46323 104.083 2.58684 104.083C1.71045 104.083 1 104.794 1 105.67C1 106.547 1.71045 107.257 2.58684 107.257Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"
												stroke-linecap="round" stroke-linejoin="round"></path>
											<path
												d="M272.639 192.946C273.515 192.946 274.225 192.235 274.225 191.359C274.225 190.482 273.515 189.772 272.639 189.772C271.762 189.772 271.052 190.482 271.052 191.359C271.052 192.235 271.762 192.946 272.639 192.946Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"
												stroke-linecap="round" stroke-linejoin="round"></path>
											<path
												d="M383.067 60.9496C383.944 60.9496 384.654 60.2391 384.654 59.3627C384.654 58.4863 383.944 57.7759 383.067 57.7759C382.191 57.7759 381.48 58.4863 381.48 59.3627C381.48 60.2391 382.191 60.9496 383.067 60.9496Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"
												stroke-linecap="round" stroke-linejoin="round"></path>
											<path
												d="M296.296 11.2533C297.172 11.2533 297.883 10.5428 297.883 9.66643C297.883 8.79005 297.172 8.07959 296.296 8.07959C295.419 8.07959 294.709 8.79005 294.709 9.66643C294.709 10.5428 295.419 11.2533 296.296 11.2533Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"
												stroke-linecap="round" stroke-linejoin="round"></path>
											<path d="M381.481 111.945V116.922" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M383.934 114.469H378.957" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M251.36 207.805V212.782" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M253.885 210.329H248.908" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M146.122 0.505371V5.48228" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M148.575 2.95752H143.598" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M34.6846 48.6162V53.5931" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M37.1371 51.0684H32.1602" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M26.6064 163.156V168.133" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M29.0589 165.681H24.082" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M308.702 28.6357V33.6127" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path d="M311.227 31.1602H306.25" stroke="#C0CCD8" stroke-width="0.724522"
												stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
											</path>
											<path
												d="M63.6087 134.882H13.7675C12.902 134.882 12.1807 134.161 12.1807 133.295C12.1807 132.43 12.902 131.708 13.7675 131.708H63.6087C64.4743 131.708 65.1956 132.43 65.1956 133.295C65.1956 134.161 64.4743 134.882 63.6087 134.882Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M356.884 95.0672H307.043C306.177 95.0672 305.456 94.346 305.456 93.4804C305.456 92.6149 306.177 91.8936 307.043 91.8936H356.884C357.75 91.8936 358.471 92.6149 358.471 93.4804C358.471 94.346 357.75 95.0672 356.884 95.0672Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M364.171 105.67H345.778C345.345 105.67 344.984 105.31 344.984 104.877C344.984 104.444 345.345 104.083 345.778 104.083H364.171C364.603 104.083 364.964 104.444 364.964 104.877C364.964 105.31 364.603 105.67 364.171 105.67Z"
												fill="#C0CCD8"></path>
											<path
												d="M315.411 68.1625H297.018C296.585 68.1625 296.225 67.8019 296.225 67.3691C296.225 66.9363 296.585 66.5757 297.018 66.5757H315.411C315.844 66.5757 316.204 66.9363 316.204 67.3691C316.204 67.8019 315.844 68.1625 315.411 68.1625Z"
												fill="#C0CCD8"></path>
											<path
												d="M45.0705 120.961H31.0053C30.5726 120.961 30.2119 120.601 30.2119 120.168C30.2119 119.735 30.5726 119.375 31.0053 119.375H45.0705C45.5033 119.375 45.8639 119.735 45.8639 120.168C45.8639 120.601 45.5033 120.961 45.0705 120.961Z"
												fill="#C0CCD8"></path>
											<path
												d="M329.404 51.4289H344.623C346.066 51.4289 347.292 50.2027 347.292 48.7601V33.5408C347.292 32.0983 346.066 30.8721 344.623 30.8721H329.404C327.962 30.8721 326.735 32.0983 326.735 33.5408V48.7601C326.735 50.2027 327.889 51.4289 329.404 51.4289Z"
												stroke="#C0CCD8" stroke-width="0.724522" stroke-miterlimit="10"
												stroke-linejoin="round"></path>
											<path
												d="M339.935 40.2489L339.575 42.0522H341.522V43.639H339.286L338.709 46.7406H337.05L337.627 43.639H335.463L334.886 46.7406H333.227L333.804 43.639H332.001V42.0522H334.093L334.453 40.2489H332.506V38.6621H334.742L335.319 35.5605H336.978L336.401 38.6621H338.565L339.142 35.5605H340.801L340.224 38.6621H342.027V40.2489H339.935ZM335.68 42.0522H337.843L338.204 40.2489H336.04L335.68 42.0522Z"
												fill="#C0CCD8"></path>
											<path
												d="M163.651 193.812L149.225 98.9624H84.0928L99.6727 199.438C100.755 206.218 106.381 211.051 113.449 211.051H222.941L223.735 201.818H173.172C168.267 201.891 164.372 198.573 163.651 193.812Z"
												fill="#64748B"></path>
											<path
												d="M101.982 193.812L88.0606 102.497C87.7721 100.405 86.041 98.9624 83.9492 98.9624H83.805C80.8477 98.9624 78.3953 101.775 78.8281 104.588L93.5424 199.438C94.6243 206.218 100.25 211.051 107.319 211.051H177.861L178.655 201.818H111.503C106.67 201.891 102.703 198.573 101.982 193.812Z"
												fill="#717A91"></path>
											<path d="M146.123 211.123V262.839" stroke="#98A3B8" stroke-width="1.08678"
												stroke-miterlimit="10"></path>
											<path
												d="M117.058 267.455C117.058 264.93 119.077 262.911 121.602 262.911H170.505C173.03 262.911 175.049 264.93 175.049 267.455"
												stroke="#98A3B8" stroke-width="1.08678" stroke-miterlimit="10"></path>
											<path d="M141.077 267.455C141.077 264.931 143.097 262.911 145.621 262.911"
												stroke="#98A3B8" stroke-width="1.08678" stroke-miterlimit="10"></path>
											<path
												d="M117.057 276.687C119.606 276.687 121.673 274.62 121.673 272.071C121.673 269.521 119.606 267.455 117.057 267.455C114.507 267.455 112.44 269.521 112.44 272.071C112.44 274.62 114.507 276.687 117.057 276.687Z"
												fill="#717A91"></path>
											<g opacity="0.45">
												<path opacity="0.45"
													d="M117.058 273.803C118.014 273.803 118.789 273.028 118.789 272.071C118.789 271.115 118.014 270.34 117.058 270.34C116.102 270.34 115.327 271.115 115.327 272.071C115.327 273.028 116.102 273.803 117.058 273.803Z"
													fill="#8E9DB2"></path>
											</g>
											<path
												d="M141.076 276.687C143.626 276.687 145.692 274.62 145.692 272.071C145.692 269.521 143.626 267.455 141.076 267.455C138.527 267.455 136.46 269.521 136.46 272.071C136.46 274.62 138.527 276.687 141.076 276.687Z"
												fill="#717A91"></path>
											<g opacity="0.45">
												<path opacity="0.45"
													d="M141.078 273.803C142.034 273.803 142.809 273.028 142.809 272.071C142.809 271.115 142.034 270.34 141.078 270.34C140.122 270.34 139.347 271.115 139.347 272.071C139.347 273.028 140.122 273.803 141.078 273.803Z"
													fill="#8E9DB2"></path>
											</g>
											<path
												d="M175.123 276.687C177.673 276.687 179.739 274.62 179.739 272.071C179.739 269.521 177.673 267.455 175.123 267.455C172.574 267.455 170.507 269.521 170.507 272.071C170.507 274.62 172.574 276.687 175.123 276.687Z"
												fill="#717A91"></path>
											<g opacity="0.45">
												<path opacity="0.45"
													d="M175.124 273.802C176.08 273.802 176.855 273.027 176.855 272.071C176.855 271.115 176.08 270.34 175.124 270.34C174.168 270.34 173.393 271.115 173.393 272.071C173.393 273.027 174.168 273.802 175.124 273.802Z"
													fill="#8E9DB2"></path>
											</g>
											<path
												d="M196.976 109.132L213.493 84.4634L218.614 85.5453C214.719 98.7449 212.123 103.938 212.123 103.938"
												fill="#D6DAE3"></path>
											<path
												d="M216.017 89.6566L218.614 85.5453C218.614 85.5453 223.519 84.3912 225.322 83.5257C227.125 82.588 228.279 81.0011 228.784 79.6307C229.145 78.6209 229 75.5193 228.568 75.4472C227.486 75.3029 225.394 79.27 224.456 79.4864C223.446 79.7028 220.273 79.4864 218.542 79.7028C215.584 80.0635 214.358 82.8765 214.358 82.8765L211.689 87.7813"
												fill="#D6DAE3"></path>
											<path d="M207.794 91.7483L210.679 87.4927L218.181 90.8827L215.8 97.2301"
												fill="#E6E8EF"></path>
											<path
												d="M147.566 82.9489C147.566 82.9489 159.756 77.3228 170.576 86.916C181.323 96.5091 188.608 105.381 192.575 108.266L208.804 89.5847L217.892 93.8404C215.512 107.329 208.804 128.895 192.359 131.131C174.615 133.511 148.576 111.656 148.576 111.656"
												fill="#7C8692"></path>
											<path d="M187.309 114.469L192.574 108.266" stroke="#475466"
												stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M213.204 268.898L211.834 274.164C211.473 275.462 212.483 276.688 213.781 276.688H229.722C230.659 276.688 231.453 275.895 231.453 274.957C231.453 274.236 230.948 273.515 230.227 273.298L219.335 268.898"
												fill="#64748B"></path>
											<path
												d="M204.043 186.527C201.518 213.359 213.275 268.826 213.275 268.826C213.275 268.826 216.088 272.216 219.478 268.826C219.478 268.826 222.291 215.883 225.321 192.081"
												fill="#D6DAE3"></path>
											<path
												d="M165.959 155.151L184.28 164.744V164.96C184.28 164.96 221.715 162.436 227.341 175.78C236.213 196.697 237.728 264.715 237.728 264.715H210.319C210.319 264.715 200.148 207.589 196.614 204.127C193.152 200.664 178.798 200.881 152.327 200.881C122.682 200.881 137.108 162.652 148.215 159.334"
												fill="#98A3B8"></path>
											<path
												d="M212.195 264.715C212.195 264.715 204.044 205.786 198.058 201.458C190.773 196.193 156.295 199.655 156.295 199.655"
												stroke="#64748B" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M155.788 268.898L154.418 274.164C154.057 275.462 155.067 276.688 156.365 276.688H172.306C173.243 276.688 174.037 275.895 174.037 274.957C174.037 274.236 173.532 273.515 172.811 273.298L161.919 268.898"
												fill="#64748B"></path>
											<path
												d="M158.458 186.527C155.933 213.359 155.789 268.826 155.789 268.826C155.789 268.826 158.602 272.216 161.992 268.826C161.992 268.826 171.585 215.883 174.615 192.081"
												fill="#D6DAE3"></path>
											<path
												d="M133.575 163.59C133.575 163.59 181.685 164.384 187.96 178.954C195.678 196.842 182.911 264.787 182.911 264.787H153.916V204.055C153.916 202.901 152.978 201.819 151.824 201.819C147.785 201.891 138.841 201.891 127.516 201.891C97.8712 201.891 112.297 155.728 123.405 152.41"
												fill="#98A3B8"></path>
											<path
												d="M133.575 163.59C133.575 163.59 181.685 164.384 187.961 178.954C190.052 183.786 191.134 192.081 190.557 201.891"
												stroke="#64748B" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M158.028 264.715C158.028 264.715 158.317 203.766 156.946 200.52C154.999 195.976 148.363 198.212 132.927 198.212C103.282 198.212 115.328 155.728 126.363 152.482"
												stroke="#64748B" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M115.111 171.02C115.111 171.02 130.331 171.38 132.639 169.072C134.947 166.764 132.639 156.305 132.639 156.305"
												stroke="#64748B" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M114.751 173.039C114.751 173.039 132.134 173.4 134.803 171.092C137.472 168.783 134.803 158.325 134.803 158.325"
												stroke="#64748B" stroke-width="0.724522" stroke-miterlimit="10"
												stroke-dasharray="2.17 2.17"></path>
											<path
												d="M111.789 100.116C111.789 100.116 108.111 164.96 113.665 164.96C119.218 164.96 180.6 164.744 184.207 164.744C187.813 164.744 179.374 109.277 167.256 97.5919C167.256 97.5919 149.296 78.0449 141.362 79.9203C133.428 81.7956 111.789 100.116 111.789 100.116Z"
												fill="#7C8692"></path>
											<path d="M180.385 129.617L172.739 98.3135" stroke="#475466"
												stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M80.7745 111.874L64.2569 87.2056L59.1357 88.2875C63.0307 101.487 65.6274 106.68 65.6274 106.68"
												fill="#D6DAE3"></path>
											<path
												d="M61.733 92.3266L59.1363 88.2152C59.1363 88.2152 54.2315 87.0611 52.4283 86.1956C50.6251 85.2579 49.471 83.6711 48.9661 82.3006C48.6055 81.2908 48.7497 78.1893 49.1825 78.1171C50.2644 77.9729 52.3562 81.94 53.2939 82.1563C54.3037 82.3727 57.4774 82.1563 59.2085 82.3727C62.1657 82.7334 63.3919 85.5464 63.3919 85.5464L66.0607 90.4512"
												fill="#D6DAE3"></path>
											<path d="M69.955 94.4183L67.0698 90.2349L59.5684 93.5528L61.9486 99.9723"
												fill="#E6E8EF"></path>
											<path
												d="M134.513 83.3104C134.513 83.3104 122.467 74.727 109.989 85.2579C98.3763 95.0675 90.5864 114.903 87.9897 114.903C86.1865 114.903 75.0065 100.621 68.2985 91.8938L60.3643 96.1494C65.3412 111.441 76.3048 137.407 92.606 137.407C105.445 137.407 131.7 107.402 131.7 107.402"
												fill="#7C8692"></path>
											<path d="M110.78 127.886L130.255 111.657" stroke="#475466"
												stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path d="M135.666 84.8254L147.279 97.2316L148.793 82.8779" fill="#E6E8EF">
											</path>
											<path d="M135.666 84.8254L147.279 97.2316L148.793 82.8779" stroke="#475466"
												stroke-width="0.724522" stroke-miterlimit="10" stroke-linejoin="round">
											</path>
											<path
												d="M144.97 72.2745L148.216 79.4153C148.216 79.4153 149.514 83.5266 144.104 85.402C138.118 87.4216 134.511 83.3102 134.511 83.3102L133.646 72.0581"
												fill="#D6DAE3"></path>
											<path
												d="M134.225 79.1992C134.225 79.1992 138.552 84.6089 144.178 85.4023L140.067 91.4612C136.749 89.5858 132.71 82.3008 132.71 82.3008L134.225 79.1992Z"
												fill="white"></path>
											<path
												d="M147.927 78.478C147.927 78.478 147.206 82.3009 144.177 85.4024L148.865 88.9367C149.947 86.268 149.803 82.1566 149.803 82.1566L147.927 78.478Z"
												fill="white"></path>
											<path
												d="M149.875 60.7342C149.875 60.7342 152.977 72.5634 148.361 75.5206C143.744 78.4779 135.666 73.9338 135.233 72.4912C134.8 70.9765 132.636 58.426 135.666 57.4884C141.003 55.7573 148.288 55.6851 149.875 60.7342Z"
												fill="#D6DAE3"></path>
											<path
												d="M149.305 65.2584C149.615 65.1855 149.808 64.875 149.735 64.5647C149.662 64.2544 149.352 64.0619 149.041 64.1348C148.731 64.2076 148.539 64.5181 148.611 64.8284C148.684 65.1387 148.995 65.3312 149.305 65.2584Z"
												fill="#64748B"></path>
											<path
												d="M148.723 61.022C148.939 61.022 149.805 61.1663 149.66 61.5991C149.588 61.8155 149.228 61.8155 149.083 61.8155C148.867 61.8155 148.723 61.7433 148.506 61.8155C148.578 61.8876 148.578 61.9597 148.651 62.0318C148.723 62.1761 148.29 62.1761 148.218 62.1761C147.785 62.1761 147.208 62.104 146.703 62.4646C146.992 61.1663 148.362 60.9499 148.723 61.022Z"
												fill="#64748B"></path>
											<path
												d="M142.993 66.7219C143.311 66.7043 143.555 66.432 143.537 66.1138C143.519 65.7956 143.247 65.5519 142.929 65.5696C142.61 65.5872 142.367 65.8595 142.385 66.1777C142.402 66.4959 142.674 66.7396 142.993 66.7219Z"
												fill="#64748B"></path>
											<path
												d="M140.572 63.7625C140.14 63.9788 139.779 64.3395 139.851 64.7001C139.923 64.9887 140.212 64.9165 140.356 64.7723C140.644 64.5559 141.005 64.3395 141.366 64.2674C141.221 64.4116 141.149 64.628 141.149 64.8444C142.303 64.7001 143.241 63.7625 143.385 62.6084C143.385 62.6805 142.664 63.1133 142.52 63.1854C141.871 63.4739 141.149 63.4739 140.572 63.7625Z"
												fill="#64748B"></path>
											<path
												d="M146.774 65.2778C146.774 65.2778 148.433 69.3892 147.856 69.7498C147.279 70.1105 145.188 70.0384 145.188 70.0384"
												stroke="#98A3B8" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path d="M146.774 76.1695C146.774 76.1695 142.086 77.9727 137.975 74.6548"
												stroke="#98A3B8" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path d="M144.177 73.4287C144.177 73.4287 144.61 71.6255 147.567 71.6255"
												stroke="#98A3B8" stroke-width="0.724522" stroke-miterlimit="10"></path>
											<path
												d="M152.472 54.3865C152.4 53.8095 152.328 53.2325 151.967 52.7997C151.534 52.2948 150.813 52.2227 150.164 52.2227C147.928 52.2227 145.62 52.9439 143.816 54.2423C144.321 53.8095 144.826 53.3767 145.331 52.9439C145.764 52.5833 146.629 52.0784 146.197 51.4292C145.836 50.8522 144.754 51.2128 144.177 51.1407C141.58 51.1407 139.128 52.0063 136.748 52.9439C135.594 53.3767 134.367 53.8816 133.358 54.5308C132.276 55.18 131.338 56.1176 130.833 57.2717C130.4 58.2815 130.328 59.4356 130.328 60.5175C130.328 62.465 130.617 64.4846 130.977 66.4321C131.338 68.596 131.843 72.7794 134.656 72.9958C135.233 73.068 135.81 73.068 136.243 72.7794C136.675 72.4909 136.82 71.8418 136.892 71.3369C137.036 70.4713 136.964 69.5336 136.748 68.6681C137.253 68.9566 137.757 69.4615 138.407 69.3894C138.623 69.3894 138.839 69.2451 138.912 69.0287C138.984 68.8845 138.912 68.8123 138.912 68.6681C138.695 66.6485 138.551 64.6289 138.407 62.5371C141.364 61.888 144.249 61.3831 147.206 60.9503C148.505 60.7339 149.875 60.5175 150.957 59.6519C152.4 58.4258 152.616 56.2619 152.472 54.3865Z"
												fill="#64748B"></path>
											<path
												d="M137.324 69.3893C136.82 68.1631 135.954 66.7205 134.656 67.5861C134.151 67.8746 133.934 68.5238 133.718 69.1008C133.141 71.0483 134.511 74.1498 136.459 73.8613C137.397 73.7171 137.902 72.563 138.334 71.6974"
												fill="#D6DAE3"></path>
											<path d="M58.2695 276.688L81.423 165.609" stroke="#98A3B8"
												stroke-width="1.08678" stroke-miterlimit="10"></path>
											<path d="M104.576 276.688L81.4229 165.609" stroke="#98A3B8"
												stroke-width="1.08678" stroke-miterlimit="10"></path>
											<path d="M292.184 276.688L315.337 165.609" stroke="#98A3B8"
												stroke-width="1.08678" stroke-miterlimit="10"></path>
											<path d="M338.563 276.688L315.338 165.609" stroke="#98A3B8"
												stroke-width="1.08678" stroke-miterlimit="10"></path>
											<path d="M335.678 158.973H58.9912V165.609H335.678V158.973Z" fill="#E7EAF2">
											</path>
											<path
												d="M322.333 146.279H224.599C222.867 146.279 221.569 144.692 221.858 142.961L233.11 79.7757C233.47 77.7561 235.202 76.3135 237.221 76.3135H334.956C336.687 76.3135 337.985 77.9003 337.697 79.6314L326.517 142.817C326.156 144.836 324.353 146.279 322.333 146.279Z"
												fill="#64748B"></path>
											<path
												d="M324.641 146.278H226.834C225.103 146.278 223.804 144.691 224.093 142.96L235.345 79.7752C235.706 77.7556 237.437 76.313 239.457 76.313H337.264C338.995 76.313 340.293 77.8998 340.004 79.6309L328.752 142.816C328.392 144.836 326.661 146.278 324.641 146.278Z"
												fill="#C0CCD8"></path>
											<path opacity="0.45"
												d="M306.61 146.279H250.132C249.123 146.279 248.329 145.341 248.546 144.403L255.037 107.906C255.254 106.752 256.263 105.886 257.417 105.886H313.895C314.904 105.886 315.698 106.824 315.481 107.762L308.99 144.259C308.846 145.413 307.836 146.279 306.61 146.279Z"
												fill="#8E9DB2"></path>
											<path
												d="M307.981 146.279H251.504C250.494 146.279 249.7 145.341 249.917 144.403L256.408 107.906C256.625 106.752 257.634 105.886 258.789 105.886H315.266C316.275 105.886 317.069 106.824 316.853 107.762L310.361 144.259C310.144 145.413 309.135 146.279 307.981 146.279Z"
												fill="#98A3B8"></path>
											<path d="M295.501 124.784H272.564V146.278H295.501V124.784Z" fill="#8E9DB2">
											</path>
											<path
												d="M294.131 124.784H272.492V130.915L278.407 155.366H301.344L294.131 124.784ZM288.577 148.947C285.98 148.947 283.312 145.918 282.518 142.239C281.725 138.56 283.167 135.531 285.764 135.531C288.361 135.531 291.029 138.56 291.823 142.239C292.616 145.918 291.174 148.947 288.577 148.947Z"
												fill="#64748B"></path>
											<path
												d="M259.942 155.439H311.298V158.901H256.48C256.408 157.026 257.995 155.439 259.942 155.439Z"
												fill="#64748B"></path>
											<path d="M311.226 155.439H270.185V158.901H311.226V155.439Z" fill="#C0CCD8">
											</path>
											<path
												d="M295.502 124.784H272.564L279.777 155.439H302.714L295.502 124.784ZM289.875 148.947C287.279 148.947 284.61 145.918 283.817 142.239C283.023 138.56 284.466 135.531 287.062 135.531C289.659 135.531 292.328 138.56 293.121 142.239C293.843 145.918 292.4 148.947 289.875 148.947Z"
												fill="#C0CCD8"></path>
											<g opacity="0.65">
												<path opacity="0.65"
													d="M241.909 82.5894L240.538 90.235H241.909L243.279 82.5894H241.909Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M245.876 82.5884L244.506 90.2341H245.876L247.247 82.5884H245.876Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M249.771 82.5884L248.4 90.2341H249.771L251.141 82.5884H249.771Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M253.739 82.5884L252.368 90.2341H253.739L255.109 82.5884H253.739Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M257.634 82.5884L256.264 90.2341H257.634L259.005 82.5884H257.634Z"
													fill="#8E9DB2"></path>
											</g>
											<g opacity="0.65">
												<path opacity="0.65"
													d="M293.555 82.5894L292.185 90.235H293.555L294.853 82.5894H293.555Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M297.665 82.5884L296.295 90.2341H297.665L299.036 82.5884H297.665Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M301.778 82.5884L300.407 90.2341H301.778L303.148 82.5884H301.778Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M305.889 82.5884L304.519 90.2341H305.889L307.259 82.5884H305.889Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M310.072 82.5884L308.701 90.2341H310.072L311.37 82.5884H310.072Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M314.183 82.5884L312.812 90.2341H314.183L315.553 82.5884H314.183Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M318.296 82.5884L316.926 90.2341H318.296L319.667 82.5884H318.296Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M322.406 82.5884L321.107 90.2341H322.406L323.776 82.5884H322.406Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M326.59 82.5884L325.22 90.2341H326.59L327.961 82.5884H326.59Z"
													fill="#8E9DB2"></path>
												<path opacity="0.65"
													d="M330.701 82.5884L329.33 90.2341H330.701L332.071 82.5884H330.701Z"
													fill="#8E9DB2"></path>
											</g>
											<g opacity="0.55">
												<path opacity="0.55"
													d="M136.959 141.662C136.959 141.662 137.608 141.518 137.825 141.157C138.33 140.436 137.464 139.642 136.887 139.282C136.166 138.777 135.156 138.633 134.795 137.767C134.363 136.757 135.084 135.603 135.949 135.026C136.671 134.521 137.464 134.305 138.33 134.016C139.195 133.656 140.133 133.151 140.638 132.285C141.287 131.275 141.143 129.905 141.215 128.751C141.576 124.135 146.264 121.899 150.231 121.754C152.178 121.682 155.208 122.404 156.578 123.99C157.011 124.495 157.372 125.144 157.516 125.794C157.732 126.803 157.3 127.813 156.65 128.535C156.001 129.328 155.064 129.761 154.27 130.482C153.477 131.203 154.054 131.997 153.837 132.862C153.621 133.8 152.972 134.233 152.178 134.666C150.447 135.675 148.356 135.892 146.408 136.397C145.831 136.541 145.182 136.757 144.749 137.118C144.1 137.623 143.739 138.344 143.307 138.993C142.441 140.147 141.143 141.013 139.7 141.301"
													fill="url(#paint0_linear_212:517)"></path>
											</g>
											<path
												d="M147.924 153.203H144.173V151.4H147.924C149.15 151.4 150.087 150.39 150.087 149.236V146.134C150.087 144.908 149.078 143.97 147.924 143.97H144.173V142.167H147.924C150.16 142.167 151.891 143.97 151.891 146.134V149.236C151.963 151.4 150.16 153.203 147.924 153.203Z"
												fill="#E8EAEF"></path>
											<path
												d="M142.586 157.963H136.239C133.786 157.963 131.839 156.016 131.839 153.563V139.643H146.986V153.563C146.986 155.944 145.038 157.963 142.586 157.963Z"
												fill="#E8EAEF"></path>
											<path
												d="M129.387 155.367C129.387 155.367 129.531 158.901 135.085 158.901H143.813C149.366 158.901 149.511 155.367 149.511 155.367H129.387Z"
												fill="#98A3B8"></path>
											<path d="M251.36 157.53H171.08V158.973H251.36V157.53Z" fill="#64748B">
											</path>
											<path d="M179.593 156.376H173.822V157.531H179.593V156.376Z" fill="#64748B">
											</path>
											<path d="M188.248 156.376H182.478V157.531H188.248V156.376Z" fill="#64748B">
											</path>
											<path d="M196.975 156.376H191.205V157.531H196.975V156.376Z" fill="#64748B">
											</path>
											<path d="M205.701 156.376H199.931V157.531H205.701V156.376Z" fill="#64748B">
											</path>
											<path d="M214.357 156.376H208.587V157.531H214.357V156.376Z" fill="#64748B">
											</path>
											<path d="M223.086 156.376H217.315V157.531H223.086V156.376Z" fill="#64748B">
											</path>
											<path d="M231.812 156.376H226.042V157.531H231.812V156.376Z" fill="#64748B">
											</path>
											<path d="M240.542 156.376H234.771V157.531H240.542V156.376Z" fill="#64748B">
											</path>
											<path d="M249.196 156.376H243.426V157.531H249.196V156.376Z" fill="#64748B">
											</path>
											<path d="M252.37 157.53H172.09V158.973H252.37V157.53Z" fill="#C0CCD8">
											</path>
											<path d="M180.602 156.376H174.832V157.531H180.602V156.376Z" fill="#C0CCD8">
											</path>
											<path d="M189.328 156.376H183.558V157.531H189.328V156.376Z" fill="#C0CCD8">
											</path>
											<path d="M198.056 156.376H192.286V157.531H198.056V156.376Z" fill="#C0CCD8">
											</path>
											<path d="M206.711 156.376H200.94V157.531H206.711V156.376Z" fill="#C0CCD8">
											</path>
											<path d="M215.439 156.376H209.669V157.531H215.439V156.376Z" fill="#C0CCD8">
											</path>
											<path d="M224.168 156.376H218.397V157.531H224.168V156.376Z" fill="#C0CCD8">
											</path>
											<path d="M232.822 156.376H227.052V157.531H232.822V156.376Z" fill="#C0CCD8">
											</path>
											<path d="M241.552 156.376H235.781V157.531H241.552V156.376Z" fill="#C0CCD8">
											</path>
											<path d="M250.277 156.376H244.507V157.531H250.277V156.376Z" fill="#C0CCD8">
											</path>
											<path d="M21.0527 276.688H389.2" stroke="#64748B" stroke-width="1.44904"
												stroke-miterlimit="10"></path>
										</g>
										<defs>
											<linearGradient id="paint0_linear_212:517" x1="146.066" y1="141.636"
												x2="146.066" y2="121.725" gradientUnits="userSpaceOnUse">
												<stop stop-color="white" stop-opacity="0.1"></stop>
												<stop offset="1" stop-color="white" stop-opacity="0.4"></stop>
											</linearGradient>
										</defs>
									</svg>
								</div>
							</div>
						</div>
					</div>
					<div v-if="!startLoading && notifications && pagination.last_page > 1"
						class="my-16 flex items-center justify-center">
						<PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
					</div>
				</div>
			</div>
		</div>
	</PanelMasterPage>

	<BottomSheetDrawer v-model="isOpenNotificationDetailsModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
		:autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
		:panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:w-[40rem] lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
		:contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
		:backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
		<div class="flex flex-col mb-4">
			<div class="flex items-center justify-between">
				<div class="text-gray-900 dark:text-gray-50 font-bold">{{ $t("panel.notifications.detailsTitle") }}</div>
				<button @click="closeNotificationDetailsModal" type="button"
					class="focus:ring-0 focus:outline-none bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-gray-100 dark:hover:text-white">
					<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
						fill="none" viewBox="0 0 14 14">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
							stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
					</svg>
					<span class="sr-only">Close modal</span>
				</button>
			</div>
			<div
				class="flex items-center text-gray-500 dark:text-gray-400 font-light text-xs text-start mt-2">
				<span>{{ $t("panel.notifications.firstViewDate") }}</span>
				<div
					v-if="markingRead"
					class="ms-1 h-1.5 w-44 max-w-full rounded-full animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-200 dark:bg-gray-700"
					aria-hidden="true"
				></div>
				<template v-else-if="notificationDetails.read_at">
					<span class="ms-1">
						{{ new
							Date(notificationDetails.read_at).toLocaleDateString('fa-IR', {
								year:
									'numeric', month: 'long', day: '2-digit'
							}).replace(/\//g, '-') }}
					</span>
					<span class="mx-1.5">|</span>
					<span>
						{{ new Date(notificationDetails.read_at).toLocaleTimeString('fa-IR', {
							hour: '2-digit',
							minute: '2-digit', hour12: true,
						}).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر',
							'ق.ظ') }}
					</span>
				</template>
			</div>
		</div>
		<hr class="my-4 border-gray-200 border-t dark:border-opacity-10 mx-3" />
							<div v-html="notificationDetails.data?.message"
								class="mt-4 text-xs bg-gray-100/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-xl p-2 md:p-3 text-start leading-6 max-h-[70vh] overflow-y-auto">
							</div>
							<div class="flex text-end justify-end justify-items-end">
								<p
									class="mt-3 text-gray-500 dark:text-gray-400 text-xs  px-2 py-1 bg-gray-100/30 dark:bg-gray-700/40 rounded-lg w-max">
									{{ $t("panel.notifications.createdDate") }}

									<span class="ms-1">
										{{ new
											Date(notificationDetails.created_at).toLocaleDateString('fa-IR', {
												year:
													'numeric', month: 'long', day: '2-digit'
											}).replace(/\//g, '-') }}
									</span>
									<span class="mx-1.5">|</span>
									<span>
										{{ new Date(notificationDetails.created_at).toLocaleTimeString('fa-IR', {
											hour: '2-digit',
											minute: '2-digit', hour12: true,
										}).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر',
											'ق.ظ') }}
									</span>
								</p>
							</div>
	</BottomSheetDrawer>

	<!-- Confirmation Modal -->
	<BottomSheetDrawer v-model="showConfirmModal" :initialHeight="0.5" :maxHeight="0.6" :minHeight="0.4"
		:autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
		:panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[30rem] lg:max-w-[30rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
		:contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
		:backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
		<div class="flex items-center justify-end mb-2">
			<button type="button" @click="closeConfirmModal"
				class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
				<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"></path>
				</svg>
				<span class="sr-only">Close modal</span>
			</button>
		</div>
		<div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
			<div
				class="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
				:class="confirmModalData.type === 'danger'
					? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
					: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'"
			>
				<svg v-if="confirmModalData.type === 'danger'" class="w-7 h-7" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
				</svg>
				<svg v-else class="w-7 h-7" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
				</svg>
			</div>
			<p class="mb-2 text-gray-800 dark:text-gray-100 font-bold text-sm">{{ confirmModalData.title }}</p>
			<p class="mb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{{ confirmModalData.message }}</p>
			<div class="flex flex-col sm:flex-row gap-2.5 sm:justify-end">
				<button v-if="confirmModalData.cancelText" @click="closeConfirmModal" type="button"
					class="w-full sm:w-auto flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors">
					{{ confirmModalData.cancelText }}
				</button>
				<button
					type="button"
					@click="confirmAction"
					:class="[
						'w-full sm:w-auto flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-rose-500/25 transition-colors',
						confirmModalData.type === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-600 hover:bg-blue-700'
					]"
				>
					{{ confirmModalData.confirmText }}
				</button>
			</div>
		</div>
	</BottomSheetDrawer>



</template>

<script>
import PanelMasterPage from "@/views/page/panel/layouts/PanelMasterPage.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import { ref, computed, reactive } from "vue";
import moment from "moment-jalaali";
import NotificationCard from "@/views/components/notification/NotificationCard.vue";
import NotificationCardLoading from "@/views/components/notification/NotificationCardLoading.vue";
// import axiosInstance from "@/store/axiosInstance";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
import { initDrawers } from "flowbite";
export default {
	components: {
		PanelMasterPage,
		BottomSheetDrawer,
		PaginationComponent,
		NotificationCard,
		NotificationCardLoading,
		RadioGroup,
		RadioGroupLabel,
		RadioGroupOption
	},
	data() {
		return {
			isOpenNotificationDetailsModal: false,
			selectedNotificationId: null,
			markingRead: false,
			isDeleting: reactive({}),
			filters: {
				filter: ref(this.$route.query.filter ? this.$route.query.filter : 'all'),
				sort: ref(this.$route.query.sort ? this.$route.query.sort : 'newest')
			},
			currentPage: this.$route.query.page ? this.$route.query.page : 1,
			mounted: false,
			isFilterDrawerOpen: false,
			selectedNotifications: new Set(),
			showCheckboxes: false,
			viewMode: this.$route.query.viewMode ? this.$route.query.viewMode : 'table', // 'grid' or 'table'
			bulkLoading: false,
			perPage: this.$route.query.perPage ? parseInt(this.$route.query.perPage) : 9,
			perPages: [6, 9, 12, 18, 24, 30],
			showConfirmModal: false,
			confirmModalData: {
				title: '',
				message: '',
				confirmText: this.$t("panel.common.confirm"),
				cancelText: this.$t("panel.common.cancel"),
				resolve: null,
				type: 'danger' // 'danger', 'warning', 'info'
			}
		};
	},
	setup() {
		moment().format("jYYYY/jM/jD");
		const isRtl = computed(() => (localStorage.getItem("direction") === "rtl" ? true : false));
		if (isRtl.value) moment.loadPersian();

		return {
			moment
		};
	},
	computed: {
		filterValue() {
			const f = this.filters.filter;
			return f && typeof f === "object" && "value" in f ? f.value : f;
		},
		sortValue() {
			const s = this.filters.sort;
			return s && typeof s === "object" && "value" in s ? s.value : s;
		},
		allFilteredNotifications() {
			return this.$store.getters["notification/filteredItems"](this.filterValue, this.sortValue);
		},
		notifications() {
			const all = this.allFilteredNotifications;
			const page = Number(this.currentPage) || 1;
			const start = (page - 1) * this.perPage;
			return all.slice(start, start + this.perPage);
		},
		pagination() {
			const total = this.allFilteredNotifications.length;
			const last_page = Math.max(1, Math.ceil(total / this.perPage) || 1);
			const current_page = Math.min(Number(this.currentPage) || 1, last_page);
			return {
				total,
				current_page,
				per_page: this.perPage,
				last_page,
				prev_page: current_page > 1 ? current_page - 1 : null,
				next_page: current_page < last_page ? current_page + 1 : null,
			};
		},
		startLoading() {
			return this.$store.state.notification.listLoading;
		},
		notificationDetails() {
			if (!this.selectedNotificationId) return {};
			return this.$store.getters["notification/getItemById"](this.selectedNotificationId) || {};
		},
	},
	methods: {
		selectSort(sort) {
			this.filters.sort = sort;
			this.currentPage = 1;
			this.mounted = false;
			this.updateUrlAndFetchData();
		},
		selectFilter(filter) {
			this.selectedFilter = filter;
			this.currentPage = 1;
			this.mounted = false;
			this.updateUrlAndFetchData();
		},
		updatePage(value) {
			this.currentPage = value;

			this.updateUrlAndFetchData();
		},

		updateUrlAndFetchData() {
			let query = {};

			if (this.filters.filter && this.filters.filter !== 'all') {
				query.filter = this.filters.filter;
			}

			if (this.filters.sort && this.filters.sort !== 'newest') {
				query.sort = this.filters.sort;
			}

			if (this.currentPage !== 1) {
				query.page = this.currentPage;
			}

			if (this.viewMode && this.viewMode !== 'grid') {
				query.viewMode = this.viewMode;
			}

			if (this.perPage && this.perPage !== 9) {
				query.perPage = this.perPage;
			}

			const queryString = new URLSearchParams(query).toString();
			const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

			window.history.pushState(null, '', newUrl);

			this.syncFeedData();
		},
		async syncFeedData() {
			try {
				const needed = (Number(this.currentPage) || 1) * this.perPage;
				await this.$store.dispatch("notification/ensureEnoughItems", { neededCount: needed });
				if (this.mounted) {
					setTimeout(() => {
						const el = document.getElementById("notifications-list");
						if (el) el.scrollIntoView({ behavior: "smooth" });
					}, 200);
				}
			} catch (error) {
				console.error("Error syncing notifications:", error);
			} finally {
				this.mounted = true;
			}
		},
		handleNotificationDetails(notificationId) {
			const notification = this.$store.getters["notification/getItemById"](notificationId);
			if (!notification) return;

			this.selectedNotificationId = notificationId;
			this.openNotificationDetailsModal();

			if (!notification.read_at) {
				this.markingRead = true;
				this.$store
					.dispatch("notification/markAsRead", notificationId)
					.finally(() => {
						if (this.selectedNotificationId === notificationId) {
							this.markingRead = false;
						}
					});
			}
		},
		async handleDeleteNotification(notificationId) {
			this.isDeleting[notificationId] = true;
			try {
				await this.$store.dispatch("notification/deleteNotification", notificationId);
			} catch (error) {
				console.error(error);
			} finally {
				this.isDeleting[notificationId] = false;
			}
		},
		closeNotificationDetailsModal() {
			this.isOpenNotificationDetailsModal = false;
			this.selectedNotificationId = null;
			this.markingRead = false;
		},
		openNotificationDetailsModal() {
			this.isOpenNotificationDetailsModal = true;
		},
		toggleSelection(notificationId) {
			if (this.selectedNotifications.has(notificationId)) {
				this.selectedNotifications.delete(notificationId);
			} else {
				this.selectedNotifications.add(notificationId);
			}
		},
		toggleSelectAll() {
			if (this.selectedNotifications.size === this.notifications.length) {
				this.selectedNotifications.clear();
			} else {
				this.notifications.forEach(notification => {
					this.selectedNotifications.add(notification.id);
				});
			}
		},
		toggleCheckboxes() {
			this.showCheckboxes = !this.showCheckboxes;
			if (!this.showCheckboxes) {
				this.selectedNotifications.clear();
			}
		},
		toggleViewMode(mode) {
			this.viewMode = mode;
			this.updateUrlAndFetchData();
		},
		isNotificationSelected(notificationId) {
			return this.selectedNotifications.has(notificationId);
		},
		showConfirmDialog(title, message, confirmText = this.$t("panel.common.confirm"), cancelText = this.$t("panel.common.cancel"), type = 'danger') {
			return new Promise((resolve) => {
				this.confirmModalData = {
					title,
					message,
					confirmText,
					cancelText,
					type,
					resolve: resolve
				};
				this.showConfirmModal = true;
			});
		},
		closeConfirmModal() {
			this.showConfirmModal = false;
			if (this.confirmModalData.resolve) {
				this.confirmModalData.resolve(false);
				this.confirmModalData.resolve = null;
			}
		},
		confirmAction() {
			if (this.confirmModalData.resolve) {
				this.confirmModalData.resolve(true);
				this.confirmModalData.resolve = null;
			}
			this.closeConfirmModal();
		},
		async handleBulkDelete() {
			if (this.selectedNotifications.size === 0) return;

			const confirmed = await this.showConfirmDialog(
				this.$t("panel.notifications.deleteTitle"),
				this.$t("panel.notifications.deleteConfirm", { count: this.selectedNotifications.size }),
				this.$t("panel.notifications.yesDelete"),
				this.$t("panel.common.cancel"),
				'danger'
			);

			if (!confirmed) {
				return;
			}

			this.bulkLoading = true;
			try {
				await this.$store.dispatch("notification/bulkDelete", Array.from(this.selectedNotifications));
				this.selectedNotifications.clear();
			} catch (error) {
				console.error("Error deleting notifications:", error);
				await this.showConfirmDialog(
					this.$t("panel.common.error"),
					this.$t("panel.notifications.deleteError"),
					this.$t("panel.common.understood"),
					'',
					'danger'
				);
			} finally {
				this.bulkLoading = false;
			}
		},
		async handleDeleteAll() {
			const confirmed = await this.showConfirmDialog(
				this.$t("panel.notifications.deleteAllTitle"),
				this.$t("panel.notifications.deleteAllConfirm"),
				this.$t("panel.notifications.yesDelete"),
				this.$t("panel.common.cancel"),
				'danger'
			);

			if (!confirmed) {
				return;
			}

			this.bulkLoading = true;
			try {
				await this.$store.dispatch("notification/deleteAll");
				this.selectedNotifications.clear();
			} catch (error) {
				console.error("Error deleting all notifications:", error);
				await this.showConfirmDialog(
					this.$t("panel.common.error"),
					this.$t("panel.notifications.deleteError"),
					this.$t("panel.common.understood"),
					'',
					'danger'
				);
			} finally {
				this.bulkLoading = false;
			}
		},
		async handleBulkMarkAsRead() {
			if (this.selectedNotifications.size === 0) return;

			this.bulkLoading = true;
			try {
				await this.$store.dispatch("notification/bulkMarkAsRead", Array.from(this.selectedNotifications));
				this.selectedNotifications.clear();
			} catch (error) {
				console.error("Error marking notifications as read:", error);
				await this.showConfirmDialog(
					this.$t("panel.common.error"),
					this.$t("panel.notifications.markError"),
					this.$t("panel.common.understood"),
					'',
					'danger'
				);
			} finally {
				this.bulkLoading = false;
			}
		},
		async handleBulkMarkAsUnread() {
			if (this.selectedNotifications.size === 0) return;

			this.bulkLoading = true;
			try {
				await this.$store.dispatch("notification/bulkMarkAsUnread", Array.from(this.selectedNotifications));
				this.selectedNotifications.clear();
			} catch (error) {
				console.error("Error marking notifications as unread:", error);
				await this.showConfirmDialog(
					this.$t("panel.common.error"),
					this.$t("panel.notifications.markError"),
					this.$t("panel.common.understood"),
					'',
					'danger'
				);
			} finally {
				this.bulkLoading = false;
			}
		},
		async handleMarkAllAsRead() {
			this.bulkLoading = true;
			try {
				await this.$store.dispatch("notification/markAllAsRead");
			} catch (error) {
				console.error("Error marking all as read:", error);
				await this.showConfirmDialog(
					this.$t("panel.common.error"),
					this.$t("panel.notifications.markError"),
					this.$t("panel.common.understood"),
					'',
					'danger'
				);
			} finally {
				this.bulkLoading = false;
			}
		},
		async handleMarkAllAsUnread() {
			this.bulkLoading = true;
			try {
				await this.$store.dispatch("notification/markAllAsUnread");
			} catch (error) {
				console.error("Error marking all as unread:", error);
				await this.showConfirmDialog(
					this.$t("panel.common.error"),
					this.$t("panel.notifications.markError"),
					this.$t("panel.common.understood"),
					'',
					'danger'
				);
			} finally {
				this.bulkLoading = false;
			}
		},
		selectPerpage(per) {
			this.perPage = typeof per === 'string' ? parseInt(per) : per;
			this.currentPage = 1;
			this.mounted = false;
			this.updateUrlAndFetchData();
		}
	},
	mounted() {
		document.title = this.$t("panel.notifications.documentTitle");
		initDrawers();
		this.$store.dispatch("notification/initForUser");
		this.updateUrlAndFetchData();
	}
};
</script>

<style></style>
