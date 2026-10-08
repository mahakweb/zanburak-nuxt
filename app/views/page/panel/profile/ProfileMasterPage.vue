<template>
	<PanelMasterPage>
		<div class="">
			<div class="w-full">
				<div class="md:hidden mb-4">
					<Listbox v-model="selectedType" v-slot="{ open }" as="div" class="w-full">
						<div v-if="open" class="fixed inset-0 z-10 bg-black opacity-40 dark:opacity-60"></div>
						<div class="mt-1 relative" :class="open ? ' z-20' : ''">
							<ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''" class="w-full flex justify-between items-center px-3 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-xl text-sm">
								<div class="flex items-center">
									<span class="flex items-center me-2">
										<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
											<path opacity="0.4" d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
										</svg>
									</span>
									<span class="flex items-center line-clamp-1 font-semibold">{{ selectedType.title }}</span>
								</div>
								<div class="border-s border-current px-3 py-1.5">
									<svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor" stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
								</div>
							</ListboxButton>
							<ListboxOptions class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-sm p-2 rounded-b-xl">
								<ListboxOption v-for="(type, index) in types" :key="index" class="rounded-lg px-2 py-3 cursor-pointer" :class="selectedType == type ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:bg-opacity-50'">
									<router-link :to="{ name: type.route_name }" class="flex items-center">
										<span v-html="type.icon"></span>
										<span class="ms-2 font-semibold">{{ type.title }}</span>
									</router-link>
								</ListboxOption>
							</ListboxOptions>
						</div>
					</Listbox>
				</div>
				<div class="flex rtl:md:space-x-reverse md:space-x-6">
					<div class="hidden md:flex flex-col min-w-[13rem] max-w-sm text-start">
						<div
							class="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 p-2 shadow-sm space-y-0.5">
							<div v-for="(type, index) in types" :key="index">
								<router-link
									:to="{ name: type.route_name }"
									class="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-200"
									:class="
										this.$route.name === type.route_name
											? 'bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 shadow-sm ring-1 ring-yellow-400/20'
											: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
									">
									<span
										v-html="type.icon"
										:class="
											this.$route.name === type.route_name
												? 'bg-yellow-400 text-gray-900 shadow-sm'
												: 'bg-gray-100/80 text-gray-500 group-hover:bg-yellow-400/20 group-hover:text-yellow-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-yellow-400/15 dark:group-hover:text-yellow-400'
										"
										class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200"></span>
									<span>{{ type.title }}</span>
								</router-link>
							</div>
						</div>
					</div>

					<div class="w-full">
						<slot></slot>
					</div>
				</div>
			</div>
		</div>
	</PanelMasterPage>
</template>

<script>
	import PanelMasterPage from "@/views/page/panel/layouts/PanelMasterPage.vue";
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
	export default {
		components: {
			PanelMasterPage,
			Listbox,
			ListboxButton,
			ListboxOptions,
			ListboxOption
		},
		data() {
			return {
				types: {
					account_information: {
						title: this.$t("profile.nav.accountInformation"),
						english_title: "account information",
						route_name: "panel-profile",
						icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path class="stroke-current" d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z" stroke-width="1.5"></path>
								<path class="stroke-current" d="M8 12H16" stroke-width="1.5" stroke-linecap="round"></path>
								<path class="stroke-current" d="M8 8H16" stroke-width="1.5" stroke-linecap="round"></path>
								<path class="stroke-current" d="M8 16H13" stroke-width="1.5" stroke-linecap="round"></path>
							</svg>`
					},
					phone_number: {
						title: this.$t("profile.nav.phoneNumber"),
						english_title: "phone number",
						route_name: "panel-profile-manage-phone",
						icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path class="stroke-current" d="M4 10C4 6.22876 4 4.34315 5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C20 4.34315 20 6.22876 20 10V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V10Z" stroke-width="1.5"></path>
								<path class="stroke-current" d="M15 19H9" stroke-width="1.5" stroke-linecap="round"></path>
							</svg>`
					},
					change_password: {
						title: this.$t("profile.nav.changePassword"),
						english_title: "change password",
						route_name: "panel-profile-change-password",
						icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path class="stroke-current" d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z" stroke-width="1.5"></path>
								<path class="stroke-current" d="M6 10V8C6 4.68629 8.68629 2 12 2C14.7958 2 17.1449 3.91216 17.811 6.5" stroke-width="1.5" stroke-linecap="round"></path>
								<path class="stroke-current" d="M8 16H8.009M11.991 16H12M15.991 16H16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
							</svg>`
					},
					login_statistics: {
						title: this.$t("profile.nav.loginStatistics"),
						english_title: "login statistics",
						route_name: "panel-profile-login-statistics",
						icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path class="stroke-current" d="M22 22H2" stroke-width="1.5" stroke-linecap="round"></path>
								<path class="stroke-current" d="M21 22V14.5C21 13.6716 20.3284 13 19.5 13H16.5C15.6716 13 15 13.6716 15 14.5V22" stroke-width="1.5"></path>
								<path class="stroke-current" d="M15 22V5C15 3.58579 15 2.87868 14.5607 2.43934C14.1213 2 13.4142 2 12 2C10.5858 2 9.87868 2 9.43934 2.43934C9 2.87868 9 3.58579 9 5V22" stroke-width="1.5"></path>
								<path class="stroke-current" d="M9 22V9.5C9 8.67157 8.32843 8 7.5 8H4.5C3.67157 8 3 8.67157 3 9.5V22" stroke-width="1.5"></path>
							</svg>`
					},
					information_management: {
						title: this.$t("profile.nav.informationManagement"),
						english_title: "information management",
						route_name: "panel-profile-information-management",
						icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path class="stroke-current" d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z" stroke-width="1.5"></path>
									<path class="stroke-current" d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke-width="1.5" stroke-linecap="round"></path>
									<path class="stroke-current" d="M12 6V10" stroke-width="1.5" stroke-linecap="round"></path>
								</svg>`
					},
					invite: {
						title: this.$t("profile.nav.invite"),
						english_title: "invite friends",
						route_name: "panel-profile-invite",
						icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path class="stroke-current" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
								</svg>`
					}
				},
				selectedType: {
					title: "",
					english_title: "",
					route_name: "",
					icon: ``
				}
			};
		},
		methods: {
			checkCurrentRoute() {
				const currentRouteName = this.$route.name;
				for (const key in this.types) {
					const type = this.types[key];
					if (type.route_name === currentRouteName) {
						this.selectedType = type;
						break;
					}
				}
			}
		},
		mounted() {
			document.title = this.$t("profile.account.title");
			this.checkCurrentRoute();
		}
	};
</script>
<style></style>
