<script setup>
definePageMeta({
  name: "panel-profile-login-statistics",
  middleware: ['auth'],
})
</script>

<template>
	<ProfileMasterPage>
		<!-- Loading skeleton (mirrors this page's content) -->
		<div v-if="loading" class="mb-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
			<div class="flex items-center gap-3 mb-5">
				<div class="animate-pulse w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
				<div class="animate-pulse h-4 w-40 rounded-full bg-gray-200 dark:bg-gray-700"></div>
			</div>
			<!-- "this device" divider -->
			<div class="animate-pulse h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-3"></div>
			<!-- current session row -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
				<div class="lg:col-span-2">
					<div class="flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
						<div class="flex p-4 md:p-5">
							<div class="animate-pulse w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 me-2"></div>
							<div class="flex-1 space-y-2">
								<div class="animate-pulse h-3.5 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
								<div class="animate-pulse h-2.5 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
								<div class="animate-pulse h-2.5 w-2/3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							</div>
						</div>
						<div class="border-t dark:border-gray-700 mx-1 py-1">
							<div class="animate-pulse h-10 rounded-b-xl bg-gray-100 dark:bg-gray-800"></div>
						</div>
					</div>
				</div>
				<div class="flex flex-col justify-between p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
					<div class="animate-pulse h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
					<div class="animate-pulse hidden lg:block h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 mt-3"></div>
				</div>
			</div>
			<!-- "active sessions" divider -->
			<div class="animate-pulse h-2.5 w-28 rounded-full bg-gray-200 dark:bg-gray-700 mt-6 mb-3"></div>
			<!-- other session cards -->
			<div class="grid gap-3 md:grid-cols-2 lg:gap-4">
				<div v-for="i in 2" :key="i" class="flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
					<div class="flex p-4 md:p-5">
						<div class="animate-pulse w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 me-2"></div>
						<div class="flex-1 space-y-2">
							<div class="animate-pulse h-3.5 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							<div class="animate-pulse h-2.5 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							<div class="animate-pulse h-2.5 w-2/3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
						</div>
					</div>
					<div class="border-t dark:border-gray-700 mx-1 py-1">
						<div class="animate-pulse h-10 rounded-b-xl bg-gray-100 dark:bg-gray-800"></div>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="mb-5 last:mb-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
			<div class="flex items-center gap-3 mb-5">
				<span class="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
					</svg>
				</span>
				<h2 class="text-gray-800 dark:text-white font-bold text-base md:text-lg">{{ $t('profile.nav.loginStatistics') }}</h2>
			</div>
			<div>
				<div class="flex flex-col w-full">
					<div class="divider divider-start text-xs font-semibold text-amber-400">{{ $t('profile.login.thisDevice') }}</div>
				</div>
				<!-- current session -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
					<div class="lg:col-span-2">
						<div class="w-full">
							<div class="flex flex-col bg-white rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-900">
								<div class="flex flex-col md:flex-row p-4 md:p-5">
									<div class="me-2 mb-3 md:mb-0">
										<div v-html="getOSIconSVG(current_token.device.os)" class="shadow-lg shadow-gray-400 dark:shadow-gray-600 rounded-lg flex items-center text-white justify-center me-2 w-8 h-8"></div>
									</div>
									<div class="">
										<div class="text-sm font-semibold text-gray-800 dark:text-white">
											{{ $t('profile.login.device') }}
											<span class="ms-1 font-bold">{{ current_token.device.os.name + " " + current_token.device.os.version + "-" + current_token.device.browser.name }}</span>
										</div>
										<div v-if="current_token.ipInfo.countryName.length > 2" class="my-0.5 md:my-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
											<country-flag class="ms-2 rtl:order-2 mask mask-circle" :country="current_token.ipInfo.countryCode" size="small" />
											<span class="rtl:order-1 rtl:mt-1">{{ current_token.ipInfo.countryName + " " + current_token.ipInfo.cityName }}</span>
										</div>
										<p class="text-sm text-gray-500 dark:text-gray-400">
											{{ $t('profile.login.ip') }}
											<span class="ms-1 font-semibold">{{ current_token.ip }}</span>
										</p>
									</div>
								</div>
								<div class="border-t dark:border-gray-700 mx-1 py-1">
									<div class="h-10 flex items-center justify-between bg-gray-100 rounded-b-xl py-1 px-2 md:px-3 dark:bg-gray-800">
										<p class="text-xs text-gray-500 dark:text-gray-500">
											{{ $t('profile.login.lastUsed') }}
											<span class="ms-1 font-semibold text-lime-500">{{ $t('profile.login.online') }}</span>
										</p>
										<div class=""></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="access_tokens.length - 1 > 0" class="flex flex-col justify-between p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
						<div class="">
							<button @click.prevent="terminateAllSessions" class="flex items-center w-full text-start justify-center text-rose-600 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-xs px-2 py-2.5">
								<svg v-if="deleteAllLoading" class="w-6 h-6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
									<circle class="stroke-current text-rose-600 text-opacity-50" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
									<circle class="stroke-current text-rose-700" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
										<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
										<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
										<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
									</circle>
								</svg>
								<svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path class="stroke-current" d="M17 11V9.27308C17 8.75533 17.2588 8.27183 17.6896 7.98463L17.7388 7.95181C18.2041 7.64162 18.806 7.62565 19.287 7.91073V7.91073C19.729 8.17263 20 8.64824 20 9.16196L20 13C20 14.6997 19.4699 16.2756 18.5661 17.5714C17.1204 19.6439 14.7186 21 12 21C9.28145 21 6.8796 19.6439 5.43394 17.5714C4.53009 16.2756 4.00001 14.6997 4.00001 13L4.00001 12.2117C4 11.438 4.44632 10.7336 5.14599 10.4032V10.4032C5.6867 10.1479 6.3133 10.1479 6.85401 10.4032V10.4032C7.55368 10.7336 8 11.438 8.00001 12.2117L8.00001 13" stroke-width="2" stroke-linecap="round"></path>
									<path class="stroke-current" d="M8 12V5.80278C8 5.30125 8.25065 4.8329 8.66795 4.5547V4.5547C9.1718 4.2188 9.8282 4.2188 10.3321 4.5547V4.5547C10.7493 4.8329 11 5.30125 11 5.80278V11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
									<path class="stroke-current" d="M14 11V5.80278C14 5.30125 14.2507 4.8329 14.6679 4.5547V4.5547C15.1718 4.2188 15.8282 4.2188 16.3321 4.5547V4.5547C16.7493 4.8329 17 5.30125 17 5.80278V9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
									<path class="stroke-current" d="M11 6V4.80278C11 4.30125 11.2507 3.8329 11.6679 3.5547V3.5547C12.1718 3.2188 12.8282 3.2188 13.3321 3.5547V3.5547C13.7493 3.8329 14 4.30125 14 4.80278V6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
								</svg>
								<span class="text-xs font-semibold ms-3 text-start">{{ $t('profile.login.terminateAllOthers') }}</span>
							</button>
						</div>
						<div class="hidden lg:flex pt-2 mt-2 border-t border-gray-300 dark:border-opacity-20 font-semibold text-xs text-gray-500 dark:text-gray-600">{{ $t('profile.login.terminateAllHint') }}</div>
					</div>
				</div>

				<!-- other session -->
				<div v-if="access_tokens.length - 1 > 0" class="">
					<div class="flex flex-col w-full">
						<div class="divider divider-start text-xs font-semibold text-amber-400">{{ $t('profile.login.activeSessions') }}</div>
					</div>
					<div class="grid gap-3 md:grid-cols-2 lg:gap-4">
						<div v-for="(access_token, index) in access_tokens" :key="index" v-show="current_token.id !== access_token.id" class="">
							<div class="flex flex-col bg-white rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-900">
								<div class="flex flex-col md:flex-row p-4 md:p-5">
									<div class="me-2 mb-3 md:mb-0">
										<div v-html="getOSIconSVG(access_token.device.os)" class="shadow-lg shadow-gray-400 dark:shadow-gray-600 rounded-lg flex items-center text-white justify-center me-2 w-8 h-8"></div>
									</div>
									<div class="">
										<div class="text-sm font-semibold text-gray-800 dark:text-white">
											{{ $t('profile.login.device') }}
											<span class="ms-1 font-bold">{{ access_token.device.os.name + " " + access_token.device.os.version + "-" + access_token.device.browser.name }}</span>
										</div>
										<div v-if="access_token.ipInfo.countryName.length > 2" class="my-0.5 md:my-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
											<country-flag class="ms-2 rtl:order-2 mask mask-circle" :country="access_token.ipInfo.countryCode" size="small" />
											<span class="rtl:order-1 rtl:mt-1">{{ access_token.ipInfo.countryName + " " + access_token.ipInfo.cityName }}</span>
										</div>
										<p class="mt-0.5 md:mt-1 text-sm text-gray-500 dark:text-gray-400">
											{{ $t('profile.login.ip') }}
											<span class="ms-1 font-semibold">{{ access_token.ip }}</span>
										</p>
									</div>
								</div>
								<div class="border-t dark:border-gray-700 mx-1 py-1">
									<div class="flex items-center justify-between bg-gray-100 rounded-b-xl py-1 px-2 md:px-3 dark:bg-gray-800">
										<p class="text-xs text-gray-500 dark:text-gray-500">
											{{ $t('profile.login.lastUsed') }}
											<span class="ms-1 font-semibold">
												{{ access_token.last_used_at ? moment(access_token.last_used_at).format("jYYYY-jMM-jDD") + " | " + moment(access_token.last_used_at).format("HH:mm a") : $t('profile.login.neverUsed') }}
											</span>
										</p>
										<div class="">
											<button @click.prevent="terminateSession(access_token.id, index)" :disabled="deleteLoading[index]" class="px-1 group h-7 rounded-lg text-xs transition duration-200 text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-500">
												<span v-if="!deleteLoading[index]">
													<svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path opacity="0.4" d="M16.1041 7.89014C16.1041 7.89014 15.6516 13.5026 15.3891 15.8668C15.2641 16.996 14.5666 17.6576 13.4241 17.6785C11.2499 17.7176 9.07326 17.7201 6.89993 17.6743C5.80076 17.6518 5.11493 16.9818 4.99243 15.8726C4.72826 13.4876 4.27826 7.89014 4.27826 7.89014" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
														<path d="M17.2569 5.19975H3.12518" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
														<path d="M14.5339 5.19974C13.8797 5.19974 13.3164 4.73724 13.188 4.0964L12.9855 3.08307C12.8605 2.61557 12.4372 2.29224 11.9547 2.29224H8.42719C7.94469 2.29224 7.52136 2.61557 7.39636 3.08307L7.19386 4.0964C7.06552 4.73724 6.50219 5.19974 5.84802 5.19974" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
													</svg>
												</span>
												<svg v-else class="w-5 h-5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
													<circle class="stroke-current text-rose-600 text-opacity-50" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
													<circle class="stroke-current text-rose-700" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
														<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
														<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
														<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
													</circle>
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else class="w-full mt-4 border-t border-gray-300 dark:border-opacity-20">
					<div class="w-full mt-4 rounded-xl p-4 border border-gray-300 dark:border-opacity-20 flex flex-col items-center">
						<svg class="w-24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 122.88 86.686">
							<path
								class="fill-gray-700 dark:fill-gray-400"
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M53.995,73.994h25.399c0.064,4.396,1.872,8.325,6.783,11.429H47.22 C51.14,82.576,54.013,79.116,53.995,73.994L53.995,73.994L53.995,73.994L53.995,73.994z M41.118,30.451v53.131 c0,1.012-0.829,1.841-1.84,1.841H1.841C0.829,85.423,0,84.594,0,83.582V30.451c0-1.011,0.829-1.84,1.841-1.84h37.432 C40.289,28.611,41.118,29.439,41.118,30.451L41.118,30.451L41.118,30.451z M20.557,79.303c1.164,0,2.11,0.945,2.11,2.109 s-0.946,2.11-2.11,2.11s-2.11-0.946-2.11-2.11C18.452,80.248,19.393,79.303,20.557,79.303L20.557,79.303L20.557,79.303z M38.622,31.895v45.537H2.755V31.895H38.622L38.622,31.895L38.622,31.895z M102.54,44.215h15.942c1.213,0,2.32,0.495,3.109,1.29 c0.8,0.801,1.288,1.902,1.288,3.109v33.673c0,1.214-0.494,2.321-1.288,3.109c-0.802,0.802-1.902,1.289-3.109,1.289H102.54 c-1.214,0-2.321-0.494-3.109-1.289c-0.801-0.8-1.289-1.901-1.289-3.109V48.608c0-1.214,0.494-2.321,1.289-3.11 C100.231,44.698,101.326,44.215,102.54,44.215L102.54,44.215L102.54,44.215z M99.657,80.576h21.701V49.012H99.657V80.576 L99.657,80.576z M110.505,81.952c0.995,0,1.808,0.801,1.808,1.808c0,0.996-0.801,1.809-1.808,1.809 c-0.995,0-1.809-0.801-1.809-1.809C108.696,82.766,109.497,81.952,110.505,81.952L110.505,81.952L110.505,81.952z M17.5,0h97.411 c1.542,0,2.8,1.257,2.8,2.8v31.73h-3.976V6.268c0-1.359-1.11-2.479-2.479-2.479H21.145l0,0c-1.359,0-2.479,1.11-2.479,2.479v16.178 H14.7V2.8C14.7,1.257,15.958,0,17.5,0L17.5,0L17.5,0L17.5,0z M47.03,60.417h45.478v9.713H47.03V60.417L47.03,60.417z"
							/>
						</svg>
						<div class="mt-4 text-center">
							<h5 class="font-bold text-gray-700 dark:text-gray-400">{{ $t('profile.login.noOtherSessions') }}</h5>
							<p class="mt-3 font-semibold text-sm text-gray-500 dark:text-gray-600">{{ $t('profile.login.noOtherSessionsDesc1') }}</p>
							<p class="font-semibold text-sm text-gray-500 dark:text-gray-600">{{ $t('profile.login.noOtherSessionsDesc2') }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</ProfileMasterPage>
</template>

<script>
	import ProfileMasterPage from "@/views/page/panel/profile/ProfileMasterPage.vue";
	import { ref, computed } from "vue";
	import axiosInstance from "@/store/axiosInstance";
	import UAParser from "ua-parser-js";
	import moment from "moment-jalaali";

	import { toast } from "vue3-toastify";
	import "vue3-toastify/dist/index.css";
	import CountryFlag from "vue-country-flag-next";
	export default {
		components: {
			ProfileMasterPage,
			CountryFlag
		},
		data() {
			return {
				loading: ref(true),
				deleteLoading: ref([]),
				deleteAllLoading: ref(false),
				access_tokens: ref(null),
				current_token: ref(null)
			};
		},
		setup() {
			moment().format("jYYYY/jM/jD");
			const isRtl = computed(() => (import.meta.client && localStorage.getItem("direction") === "rtl"));
			if (isRtl.value) moment.loadPersian();

			return {
				moment
			};
		},
		methods: {
			getOSIconSVG(os) {
				if (os.name === "Windows") {
					return `<svg class="bg-blue-600 fill-white w-8 h-8 p-2 rounded-md" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M1863.53 1016.437c31.171 0 56.47 25.299 56.47 56.47v790.589c0 16.376-7.115 31.849-19.313 42.465-10.39 9.149-23.605 14.005-37.158 14.005-2.484 0-5.082-.113-7.567-.452l-903.53-123.331c-28.008-3.84-48.903-27.784-48.903-56.02v-667.256c0-31.171 25.3-56.47 56.471-56.47Zm-1129.412 0c31.171 0 56.47 25.299 56.47 56.47v634.504c0 16.376-7.115 31.85-19.426 42.579-10.39 9.035-23.491 13.891-37.044 13.891-2.485 0-5.196-.113-7.68-.564L48.79 1669.35C20.78 1665.51 0 1641.68 0 1613.444v-540.537c0-31.171 25.299-56.47 56.47-56.47Zm-7.726-859.855c16.151-2.372 32.415 2.597 44.725 13.327 12.424 10.73 19.426 26.315 19.426 42.579V846.99c0 31.285-25.186 56.47-56.47 56.47H56.424c-31.171 0-56.47-25.185-56.47-56.47V306.455c0-28.123 20.781-52.066 48.79-55.906ZM1855.974.474c16.15-2.033 32.414 2.71 44.724 13.44 12.198 10.73 19.313 26.203 19.313 42.466v790.588c0 31.285-25.299 56.471-56.47 56.471H960.01c-31.171 0-56.47-25.186-56.47-56.47V179.711c0-28.235 20.78-52.066 48.903-55.906Z"
									fill-rule="evenodd"
								></path>
							</svg>`;
				} else if (os.name === "Mac OS") {
					return `<svg class="bg-gray-600 fill-white w-8 h-8 p-1.5 rounded-md" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve">
								<path style="display: inline" d="M248.644,123.476c-5.45-29.71,8.598-60.285,25.516-80.89 c18.645-22.735,50.642-40.17,77.986-42.086c4.619,31.149-8.093,61.498-24.826,82.965 C309.37,106.527,278.508,124.411,248.644,123.476z M409.034,231.131c8.461-23.606,25.223-44.845,51.227-59.175 c-26.278-32.792-63.173-51.83-97.99-51.83c-46.065,0-65.542,21.947-97.538,21.947c-32.96,0-57.965-21.947-97.866-21.947 c-39.127,0-80.776,23.848-107.19,64.577c-9.712,15.055-16.291,33.758-19.879,54.59c-9.956,58.439,4.916,134.557,49.279,202.144 c21.57,32.796,50.321,69.737,87.881,70.059c33.459,0.327,42.951-21.392,88.246-21.616c45.362-0.258,53.959,21.841,87.372,21.522 c37.571-0.317,67.906-41.199,89.476-73.991c15.359-23.532,21.167-35.418,33.11-62.023 C414.435,352.487,389.459,285.571,409.034,231.131z"></path>
							</svg>`;
				} else if (os.name === "Linux") {
					return `<svg class="bg-amber-400 fill-gray-900 w-8 h-8 p-1.5 rounded-md" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
								<path
									display="inline"
									d="M242.93,136.455c2.291,0,4.454,0.603,6.408,1.726c1.955,1.098,3.71,2.732,5.19,4.736 c1.455,2.013,2.653,4.425,3.472,7.137c0.823,2.703,1.272,5.697,1.272,8.883c0,3.173-0.453,6.171-1.285,8.891 c-0.831,2.744-2.034,5.189-3.518,7.231c-1.489,2.046-3.277,3.697-5.257,4.841s-4.166,1.768-6.487,1.768 c-2.328,0-4.532-0.624-6.521-1.768c-1.987-1.144-3.768-2.795-5.248-4.841c-1.476-2.042-2.661-4.487-3.46-7.231 c-0.807-2.72-1.23-5.718-1.21-8.891c0.038-3.186,0.512-6.18,1.36-8.883c0.84-2.712,2.063-5.124,3.56-7.137 c1.497-2.004,3.269-3.639,5.248-4.736C238.443,137.058,240.63,136.455,242.93,136.455 M270.464,139.516 c-2.212,0-4.308,0.565-6.213,1.572c-1.908,1.031-3.626,2.503-5.064,4.316c-1.439,1.83-2.604,4.005-3.407,6.421 c-0.803,2.42-1.247,5.094-1.247,7.889c0.004,2.79,0.453,5.451,1.272,7.885c0.819,2.424,1.993,4.641,3.444,6.491 c1.468,1.854,3.197,3.36,5.127,4.399c1.938,1.048,4.059,1.63,6.296,1.63c2.204,0,4.3-0.582,6.213-1.63 c1.905-1.039,3.618-2.553,5.045-4.399c1.435-1.88,2.582-4.084,3.372-6.517c0.795-2.449,1.215-5.14,1.189-7.935 c-0.025-2.782-0.499-5.443-1.322-7.847c-0.823-2.408-2.005-4.574-3.46-6.388c-1.451-1.834-3.169-3.285-5.073-4.316 C274.731,140.081,272.651,139.516,270.464,139.516 M121.173,387.692c1.942-0.396,3.909-0.749,5.872-1.048 c1.971-0.313,3.942-0.562,5.922-0.778c1.979-0.216,3.971-0.374,5.946-0.482c1.988-0.116,3.968-0.187,5.938-0.187 c17.416,0,32.396,1.759,45.063,4.823c12.695,3.062,23.096,7.452,31.334,12.726c8.255,5.29,14.335,11.465,18.352,18.106 c4.034,6.657,5.98,13.781,5.964,20.904c-0.009,1.231-0.059,2.396-0.15,3.51c-0.1,1.106-0.241,2.18-0.433,3.194 c-0.19,0.998-0.428,1.963-0.706,2.878c-0.283,0.914-0.616,1.775-0.99,2.595c1.023,0.066,2.055,0.116,3.086,0.166 c1.022,0.042,2.054,0.083,3.085,0.1c1.023,0.033,2.063,0.05,3.082,0.059c1.035,0.017,2.059,0.017,3.09,0.017 c0.258,0,0.466,0,0.665,0c0.191,0,0.366,0,0.541,0c0.166,0,0.341,0,0.516,0c0.183,0,0.382,0,0.615,0c0.936,0,1.871,0,2.807-0.017 c0.928,0,1.867-0.025,2.799-0.042c0.924-0.024,1.847-0.05,2.77-0.083c0.932-0.033,1.854-0.07,2.762-0.116 c-0.383-0.815-0.716-1.672-1.007-2.595c-0.291-0.915-0.54-1.872-0.748-2.895c-0.2-1.015-0.35-2.088-0.462-3.219 c-0.104-1.123-0.162-2.304-0.162-3.552c-0.017-7.123,1.934-14.247,5.963-20.904c4.018-6.642,10.105-12.816,18.373-18.106 c8.233-5.273,18.639-9.664,31.343-12.726c12.688-3.064,27.675-4.823,45.111-4.823c2.092,0,4.18,0.07,6.267,0.203 c2.088,0.117,4.167,0.296,6.238,0.532c2.079,0.25,4.142,0.533,6.188,0.887c2.055,0.361,4.088,0.761,6.105,1.218 c1.871-3.942,3.501-8.059,4.89-12.351c1.39-4.292,2.521-8.745,3.394-13.387c0.873-4.641,1.489-9.443,1.821-14.417 c0.341-4.974,0.403-10.114,0.184-15.424c-0.475-11.565-2.396-24.166-5.881-36.94c-3.46-12.696-8.458-25.559-15.111-37.801 c-6.612-12.16-14.863-23.729-24.872-33.917c-9.956-10.122-21.662-18.921-35.285-25.642c5.272-1.181,10.196-3.04,14.588-5.456 c4.383-2.412,8.25-5.348,11.439-8.712c3.174-3.344,5.677-7.115,7.349-11.157c1.663-4.042,2.508-8.367,2.379-12.842 c-0.167-5.414-1.73-10.546-4.412-15.212c-2.675-4.641-6.467-8.824-11.083-12.326c-4.616-3.493-10.063-6.32-16.077-8.267 c-6.005-1.946-12.575-3.023-19.437-3.023c-5.979,0-11.71,0.819-17.009,2.325c-5.31,1.488-10.2,3.676-14.492,6.403 c-4.304,2.753-8.005,6.038-10.933,9.756c-2.936,3.718-5.099,7.86-6.296,12.293c-0.599-6.62-2.354-12.858-5.033-18.489 c-2.67-5.613-6.258-10.612-10.563-14.804c-4.283-4.171-9.281-7.511-14.779-9.831c-5.489-2.295-11.481-3.568-17.782-3.568 c0,0-0.017,0-0.024,0c-0.017,0-0.025,0-0.033,0c-0.009,0-0.017,0-0.033,0c-0.009,0-0.025,0-0.033,0 c-6.688,0-13.092,1.423-18.93,4.018c-5.859,2.591-11.174,6.358-15.687,11.004c-4.516,4.665-8.233,10.255-10.87,16.459 c-2.653,6.238-4.217,13.124-4.425,20.352v0.083c-0.142,4.841,0.346,9.565,1.381,14.057c1.031,4.508,2.62,8.791,4.674,12.745 c2.071,3.968,4.6,7.614,7.54,10.858c2.939,3.243,6.275,6.08,9.926,8.408c-11.993,7.22-22.322,16.136-31.122,26.091 c-8.85,10.047-16.156,21.175-22.02,32.744c-5.901,11.66-10.351,23.778-13.436,35.705c-3.111,12.001-4.832,23.799-5.281,34.687 c-0.216,5.293-0.15,10.4,0.191,15.341c0.349,4.957,0.956,9.73,1.821,14.338c0.881,4.604,2.004,9.032,3.381,13.291 C117.705,379.695,119.326,383.787,121.173,387.692 M257.664,43.134c8.825,0.118,17.549,0.882,26.083,2.258 c8.533,1.374,16.883,3.364,24.955,5.949c8.08,2.586,15.897,5.764,23.35,9.487c7.465,3.742,14.572,8.049,21.226,12.896 c6.138,4.46,11.785,9.307,16.879,14.461c5.111,5.155,9.678,10.628,13.603,16.3c3.942,5.688,7.257,11.586,9.873,17.591 c2.619,6.021,4.532,12.168,5.672,18.313c0.715,3.826,1.355,7.395,1.921,10.763c0.574,3.372,1.082,6.529,1.539,9.54 s0.873,5.847,1.256,8.574c0.383,2.72,0.74,5.314,1.09,7.835c0.378,2.67,0.728,5.198,1.081,7.639 c0.357,2.445,0.715,4.804,1.081,7.115c0.374,2.316,0.766,4.592,1.206,6.87c0.44,2.296,0.923,4.566,1.455,6.903 c3.564,6.333,7.228,11.428,10.888,15.636c3.659,4.2,7.327,7.502,10.878,10.288c3.544,2.778,6.995,5.032,10.214,7.137 c3.235,2.104,6.246,4.059,8.949,6.237c4.142,3.339,8.782,6.771,13.61,10.247c4.828,3.484,9.852,7.036,14.722,10.662 c4.891,3.635,9.631,7.327,13.91,11.078c4.283,3.768,8.097,7.606,11.111,11.503c1.771,2.291,3.335,4.665,4.541,6.944 c1.215,2.271,2.097,4.475,2.495,6.421c0.403,1.954,0.333,3.659-0.324,4.957c-0.657,1.28-1.913,2.179-3.888,2.495 c-0.254,0.05-0.512,0.066-0.778,0.116c-0.266,0.025-0.523,0.05-0.79,0.066c-0.266,0.025-0.54,0.033-0.814,0.042 c-0.267,0.008-0.537,0.024-0.815,0.024c-4.125,0-8.75-1.122-13.606-2.877c-4.866-1.738-9.973-4.109-15.096-6.621 c-5.123-2.503-10.247-5.136-15.162-7.41c-4.907-2.296-9.614-4.233-13.881-5.323c-0.587-0.166-1.186-0.312-1.788-0.437 c-0.616-0.125-1.223-0.237-1.847-0.328c-0.615-0.1-1.243-0.191-1.863-0.25c-0.632-0.091-1.256-0.124-1.888-0.17 c0.565,2.823,0.965,5.659,1.16,8.629c0.195,2.985,0.199,6.096,0,9.465c-0.195,3.376-0.603,7.003-1.219,11.003 c-0.623,4.018-1.455,8.4-2.52,13.278c-0.449,2.146-1.239,5.414-2.512,9.544c-1.265,4.134-3.011,9.132-5.381,14.721 c-2.388,5.618-5.39,11.819-9.166,18.373c-3.792,6.57-8.351,13.474-13.848,20.427c6.778,2.274,13.24,5.069,19.171,8.288 c5.938,3.227,11.336,6.874,15.985,10.815c4.666,3.959,8.566,8.218,11.502,12.659c2.944,4.429,4.903,9.049,5.677,13.735 c0.424,2.595,0.628,5.061,0.628,7.398c-0.008,2.345-0.232,4.532-0.665,6.587c-0.433,2.046-1.073,3.926-1.922,5.639 c-0.848,1.726-1.908,3.256-3.177,4.62c-1.147,1.248-2.462,2.346-3.926,3.281c-1.48,0.944-3.103,1.722-4.882,2.357 c-1.78,0.633-3.718,1.094-5.797,1.419c-2.079,0.312-4.309,0.461-6.683,0.461c-6.642,0-13.278,0-19.857,0.013 c-6.57,0-13.1,0-19.516,0c-6.417,0-12.746,0.017-18.917,0.024c-6.172,0.018-12.21,0.029-18.057,0.063c-4.62,0-9.124,0-13.478,0 c-4.354,0-8.571,0-12.613,0s-7.922,0-11.61,0c-3.685,0-7.187,0-10.472,0c-3.451,0-6.944-0.07-10.354-0.332 c-3.41-0.267-6.736-0.716-9.848-1.464c-3.118-0.761-6.021-1.83-8.6-3.327c-2.562-1.477-4.79-3.405-6.554-5.851 c-1.031,0.033-2.063,0.083-3.094,0.12c-1.035,0.05-2.063,0.092-3.11,0.121c-1.04,0.021-2.092,0.058-3.145,0.074 c-1.048,0.017-2.12,0.033-3.193,0.033h-4.5c-1.122,0-2.232-0.017-3.335-0.033c-1.105-0.017-2.204-0.054-3.285-0.083 c-1.09-0.041-2.175-0.083-3.252-0.133c-1.081-0.066-2.162-0.116-3.235-0.188c-1.763,2.482-3.992,4.412-6.562,5.909 c-2.57,1.51-5.469,2.574-8.588,3.344c-3.114,0.761-6.441,1.21-9.852,1.477c-3.41,0.262-6.895,0.332-10.354,0.332 c-3.285,0-6.778,0-10.472,0c-3.685,0-7.568,0-11.602,0c-4.055,0-8.259,0-12.613,0c-4.354,0-8.857,0-13.478,0 c-5.855-0.033-11.885-0.045-18.061-0.063c-6.184-0.008-12.497-0.024-18.917-0.024c-6.429,0-12.95,0-19.529,0 c-6.57-0.013-13.199-0.013-19.844-0.013c-2.396,0-4.633-0.149-6.72-0.461c-2.083-0.325-4.017-0.786-5.797-1.419 c-1.771-0.636-3.394-1.413-4.857-2.357c-1.464-0.936-2.77-2.033-3.917-3.281c-1.264-1.364-2.32-2.895-3.168-4.62 c-0.849-1.713-1.497-3.593-1.921-5.639c-0.433-2.055-0.657-4.242-0.666-6.587c-0.008-2.338,0.2-4.804,0.628-7.398 c0.761-4.703,2.745-9.353,5.718-13.802c2.965-4.458,6.912-8.725,11.61-12.684c4.699-3.968,10.147-7.619,16.144-10.837 c5.972-3.219,12.488-6.005,19.312-8.259c-5.472-6.962-10.022-13.856-13.806-20.41c-3.759-6.537-6.762-12.742-9.132-18.34 c-2.371-5.589-4.117-10.579-5.39-14.704c-1.264-4.113-2.05-7.382-2.503-9.527c-1.064-4.903-1.896-9.294-2.52-13.319 c-0.62-4.018-1.023-7.652-1.223-11.028c-0.2-3.369-0.2-6.487-0.008-9.465c0.2-2.978,0.59-5.818,1.156-8.638 c-0.69,0.046-1.394,0.096-2.092,0.154c-0.703,0.07-1.41,0.166-2.117,0.249c-0.699,0.116-1.397,0.241-2.096,0.37 c-0.69,0.154-1.38,0.3-2.054,0.486c-4.275,1.09-8.974,3.027-13.881,5.323c-4.915,2.274-10.042,4.907-15.153,7.41 c-5.119,2.512-10.222,4.883-15.079,6.621c-4.857,1.755-9.457,2.877-13.565,2.877c-0.274,0-0.541-0.017-0.815-0.024 c-0.274-0.009-0.537-0.017-0.799-0.042c-0.266-0.017-0.532-0.041-0.798-0.066c-0.258-0.05-0.511-0.066-0.765-0.116 c-1.979-0.316-3.235-1.215-3.896-2.495c-0.661-1.298-0.719-3.003-0.32-4.957c0.408-1.946,1.277-4.15,2.495-6.421 c1.214-2.279,2.77-4.653,4.542-6.944c3.019-3.896,6.836-7.735,11.12-11.503c4.267-3.751,9.016-7.443,13.89-11.078 c4.874-3.626,9.872-7.178,14.696-10.662c4.815-3.477,9.439-6.908,13.565-10.247c2.794-2.279,5.938-4.309,9.307-6.495 c3.36-2.188,6.961-4.566,10.671-7.544c3.705-2.957,7.523-6.513,11.328-11.087c3.793-4.565,7.577-10.113,11.228-17.091 c0.441-2.055,0.836-4.075,1.206-6.113c0.358-2.046,0.699-4.092,1.027-6.188c0.32-2.075,0.636-4.222,0.952-6.417 c0.324-2.225,0.641-4.504,0.981-6.891c0.349-2.521,0.707-5.115,1.089-7.835c0.383-2.728,0.799-5.563,1.248-8.574 c0.466-3.011,0.965-6.168,1.539-9.54c0.565-3.368,1.202-6.937,1.921-10.763c1.131-6.146,3.053-12.292,5.672-18.313 c2.611-6.005,5.922-11.902,9.864-17.591c3.93-5.672,8.483-11.145,13.599-16.3c5.09-5.154,10.741-10.001,16.875-14.461 c6.654-4.847,13.757-9.153,21.226-12.896c7.443-3.724,15.253-6.901,23.338-9.487c8.059-2.585,16.4-4.575,24.926-5.949 c8.525-1.376,17.225-2.14,26.032-2.258H257.664 M257.032,166.039c-0.258,1.604-0.583,3.186-0.973,4.749 c-0.399,1.547-0.857,3.077-1.373,4.57c-0.523,1.492-1.102,2.965-1.738,4.396c-0.632,1.431-1.322,2.84-2.059,4.2 c-4.72,0.266-9.485,1.081-13.993,2.204c-4.508,1.105-8.766,2.553-12.492,4.1c-3.718,1.563-6.898,3.239-9.248,4.808 c-2.346,1.563-3.868,3.048-4.25,4.225c-0.383,1.148-0.433,2.296-0.258,3.41c0.17,1.106,0.565,2.163,1.072,3.136 c0.491,0.973,1.094,1.871,1.688,2.637c0.599,0.765,1.182,1.397,1.639,1.867c0.449,0.494,2.403,2.482,5.123,5.227 c2.729,2.753,6.222,6.263,9.748,9.798c3.534,3.526,7.103,7.069,9.955,9.864c2.853,2.794,4.982,4.823,5.639,5.339 c0.666,0.541,1.285,1.048,1.913,1.514c0.641,0.466,1.289,0.882,1.996,1.231c0.707,0.366,1.489,0.648,2.371,0.849 c0.89,0.19,1.892,0.308,3.061,0.308h0.532h0.266h0.528c1.169,0,2.167-0.117,3.044-0.308c0.878-0.2,1.646-0.482,2.346-0.849 c0.698-0.35,1.335-0.766,1.959-1.231c0.623-0.466,1.239-0.973,1.888-1.514c0.669-0.516,2.811-2.545,5.659-5.339 c2.849-2.795,6.417-6.338,9.956-9.864c3.53-3.535,7.023-7.045,9.752-9.798c2.724-2.744,4.683-4.732,5.131-5.227 c0.458-0.47,1.036-1.103,1.631-1.867c0.59-0.766,1.201-1.664,1.696-2.637c0.499-0.973,0.898-2.029,1.073-3.136 c0.175-1.114,0.124-2.262-0.258-3.41c-0.366-1.114-1.714-2.495-3.81-3.959c-2.104-1.48-4.94-3.027-8.301-4.499 c-3.352-1.477-7.21-2.874-11.344-4.025c-4.13-1.147-8.525-2.071-12.975-2.566c0.308,0.021,0.606,0.038,0.915,0.051 c0.295,0.021,0.606,0.045,0.906,0.054c0.3,0.033,0.607,0.046,0.906,0.066c0.304,0.009,0.607,0.029,0.915,0.054 c-1.331-1.326-2.554-2.715-3.651-4.146c-1.114-1.447-2.104-2.944-2.969-4.483c-0.873-1.547-1.605-3.135-2.213-4.773 C257.831,169.424,257.356,167.752,257.032,166.039"
								></path>
							</svg>`;
				} else if (os.name === "Android") {
					return `<svg class="bg-green-400 fill-white w-8 h-8 p-1.5 rounded-md" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
								<path
									display="inline"
									d="M120.606,169h270.788v220.663c0,13.109-10.628,23.737-23.721,23.737h-27.123v67.203 c0,17.066-13.612,30.897-30.415,30.897c-16.846,0-30.438-13.831-30.438-30.897v-67.203h-47.371v67.203 c0,17.066-13.639,30.897-30.441,30.897c-16.799,0-30.437-13.831-30.437-30.897v-67.203h-27.099 c-13.096,0-23.744-10.628-23.744-23.737V169z M67.541,167.199c-16.974,0-30.723,13.963-30.723,31.2v121.937 c0,17.217,13.749,31.204,30.723,31.204c16.977,0,30.723-13.987,30.723-31.204V198.399 C98.264,181.162,84.518,167.199,67.541,167.199z M391.395,146.764H120.606c3.342-38.578,28.367-71.776,64.392-90.998 l-25.746-37.804c-3.472-5.098-2.162-12.054,2.946-15.525c5.102-3.471,12.044-2.151,15.533,2.943l28.061,41.232 c15.558-5.38,32.446-8.469,50.208-8.469c17.783,0,34.672,3.089,50.229,8.476L334.29,5.395c3.446-5.108,10.41-6.428,15.512-2.957 c5.108,3.471,6.418,10.427,2.946,15.525l-25.725,37.804C363.047,74.977,388.055,108.175,391.395,146.764z M213.865,94.345 c0-8.273-6.699-14.983-14.969-14.983c-8.291,0-14.99,6.71-14.99,14.983c0,8.269,6.721,14.976,14.99,14.976 S213.865,102.614,213.865,94.345z M329.992,94.345c0-8.273-6.722-14.983-14.99-14.983c-8.291,0-14.97,6.71-14.97,14.983 c0,8.269,6.679,14.976,14.97,14.976C323.271,109.321,329.992,102.614,329.992,94.345z M444.48,167.156 c-16.956,0-30.744,13.984-30.744,31.222v121.98c0,17.238,13.788,31.226,30.744,31.226c16.978,0,30.701-13.987,30.701-31.226 v-121.98C475.182,181.14,461.458,167.156,444.48,167.156z"
								></path>
							</svg>`;
				} else if (os.name === "iOS") {
					return `<svg class="bg-black fill-white w-8 h-8 p-1.5 rounded-md" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
								<path
									display="inline"
									d="M28.346,170.892c-16.568,0-27.846-11.981-27.846-27.837c0-16.218,11.636-27.845,27.846-27.845 c16.917,0,28.186,11.627,28.186,27.845C56.532,159.971,44.555,170.892,28.346,170.892z M54.773,196.62v196.287H2.617V196.62H54.773 z M318.374,254.063c0,94.444-47.928,142.729-115.237,142.729c-71.543,0-112.064-59.916-112.064-138.5 c0-81.058,44.758-140.612,115.583-140.612C281.725,117.679,318.374,181.82,318.374,254.063z M145.695,257.23 c0,53.213,20.797,96.911,59.2,96.911c38.771,0,58.855-43.345,58.855-97.967c0-49.695-18.68-95.858-58.502-95.858 C164.375,160.316,145.695,207.545,145.695,257.23z M356.44,337.582c14.094,8.458,36.649,15.149,58.498,15.149 c28.898,0,44.052-13.744,44.052-33.829c0-19.388-13.037-31.015-42.995-44.052c-40.878-17.62-66.249-42.995-66.249-78.23 c0-44.409,34.881-78.592,93.384-78.592c25.725,0,45.461,5.988,58.148,12.338l-10.925,42.646 c-9.515-4.936-26.082-11.635-48.276-11.635c-27.487,0-39.826,14.804-39.826,29.958c0,19.378,13.395,28.195,46.521,43.349 c43.345,19.379,62.728,44.396,62.728,79.993c0,47.22-35.593,81.753-98.678,81.753c-26.781,0-53.92-7.402-66.599-15.154 L356.44,337.582z"
								></path>
							</svg>`;
				} else {
					// to do
					return `<svg class="bg-red-500 text-white w-8 h-8  rounded-md" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill="currentColor" d="M9.5 4.75C8.7574 4.75 8.14227 5.03635 7.7208 5.5105C7.31228 5.97009 7.125 6.56049 7.125 7.125C7.125 8.11777 7.70613 8.80342 8.084 9.24925L8.10422 9.27311C8.55066 9.80024 8.70833 10.0224 8.70833 10.2917C8.70833 10.7289 9.06277 11.0833 9.5 11.0833C9.93723 11.0833 10.2917 10.7289 10.2917 10.2917C10.2917 9.39426 9.73429 8.74298 9.38019 8.32923C9.35663 8.30171 9.33398 8.27524 9.31245 8.24982C8.89774 7.76016 8.70833 7.48237 8.70833 7.125C8.70833 6.89785 8.78494 6.69658 8.9042 6.56241C9.0105 6.44282 9.18705 6.33333 9.5 6.33333C9.81295 6.33333 9.9895 6.44282 10.0958 6.56241C10.2151 6.69658 10.2917 6.89785 10.2917 7.125C10.2917 7.56223 10.6461 7.91667 11.0833 7.91667C11.5206 7.91667 11.875 7.56223 11.875 7.125C11.875 6.56049 11.6877 5.97009 11.2792 5.5105C10.8577 5.03635 10.2426 4.75 9.5 4.75Z"></path>
								<path fill="currentColor" d="M9.5 11.875C9.06277 11.875 8.70833 12.2294 8.70833 12.6667C8.70833 13.1039 9.06277 13.4583 9.5 13.4583C9.93723 13.4583 10.2917 13.1039 10.2917 12.6667C10.2917 12.2294 9.93723 11.875 9.5 11.875Z"></path>
							</svg>`;
				}
			},
			terminateSession(id, index) {
				this.deleteLoading[index] = true;
				axiosInstance
					.post("/panel/access-tokens/terminate", { id: id })
					.then((response) => {
						const parser = new UAParser();
						this.access_tokens = response.data.access_tokens.map((token) => {
							const userAgent = token.name;
							const info = parser.setUA(userAgent).getResult();
							// const device = info
							return {
								...token,
								device: info
							};
						});

						toast.success(this.$t('profile.login.terminateSuccess'), {
							theme: "colored",
							hideProgressBar: false,
							rtl: localStorage.getItem("direction") == "rtl" ? true : false,
							bodyClassName: "font-YekanBakh",
							toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
							transition: toast.TRANSITIONS.BOUNCE,
							position: toast.POSITION.BOTTOM_RIGHT
						});
					})
					.catch((error) => {
						console.error(error.response.data.message);

						if (error.response) {
							if (error.response.status === 404) {
								toast.error(this.$t('profile.login.notFound'), {
									theme: "colored",
									hideProgressBar: false,
									rtl: localStorage.getItem("direction") == "rtl" ? true : false,
									bodyClassName: "font-YekanBakh",
									toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
									transition: toast.TRANSITIONS.BOUNCE,
									position: toast.POSITION.BOTTOM_RIGHT
								});
							} else if (error.response.status === 403) {
								toast.error(this.$t('profile.login.securityError'), {
									theme: "colored",
									hideProgressBar: false,
									rtl: localStorage.getItem("direction") == "rtl" ? true : false,
									bodyClassName: "font-YekanBakh",
									toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
									transition: toast.TRANSITIONS.BOUNCE,
									position: toast.POSITION.BOTTOM_RIGHT
								});
							}
						} else {
							console.error("خطا در حذف نشست:", error.message);
						}
					})
					.finally(() => {
						this.deleteLoading[index] = false;
					});
			},
			terminateAllSessions() {
				this.deleteAllLoading = true;
				axiosInstance
					.post("/panel/access-tokens/terminateAll")
					.then((response) => {
						const parser = new UAParser();
						this.access_tokens = response.data.access_tokens.map((token) => {
							const userAgent = token.name;
							const info = parser.setUA(userAgent).getResult();
							// const device = info
							return {
								...token,
								device: info
							};
						});

						toast.success(this.$t('profile.login.terminateAllSuccess'), {
							theme: "colored",
							hideProgressBar: false,
							rtl: localStorage.getItem("direction") == "rtl" ? true : false,
							bodyClassName: "font-YekanBakh",
							toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
							transition: toast.TRANSITIONS.BOUNCE,
							position: toast.POSITION.BOTTOM_RIGHT
						});
					})
					.catch((error) => {
						console.error(error.response.data.message);
						if (error.response) {
							if (error.response.status === 403) {
								toast.error(this.$t('profile.login.securityError'), {
									theme: "colored",
									hideProgressBar: false,
									rtl: localStorage.getItem("direction") == "rtl" ? true : false,
									bodyClassName: "font-YekanBakh",
									toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
									transition: toast.TRANSITIONS.BOUNCE,
									position: toast.POSITION.BOTTOM_RIGHT
								});
							}
						} else {
							console.error("خطا در حذف نشست:", error.message);
						}
					})
					.finally(() => {
						this.deleteAllLoading = false;
					});
			}
		},
		mounted() {
			document.title = this.$t('profile.nav.loginStatistics');
			this.loading = true;
			axiosInstance.post("/panel/access-tokens").then((response) => {
				const parser = new UAParser();
				this.current_token = response.data.current_token;
				this.current_token.device = parser.setUA(this.current_token.name).getResult();
				this.access_tokens = response.data.access_tokens.map((token) => {
					const userAgent = token.name;
					const info = parser.setUA(userAgent).getResult();
					// const device = info
					return {
						...token,
						device: info
					};
				});
				this.loading = false;
			});
		}
	};
</script>
<style></style>
