<template>
	<header class="bg-white dark:bg-slate-900 transition-all duration-300">
		<div v-if="currentUser" class="flex items-center justify-between py-5 xl:pe-8 xl:ps-8 px-4">
			<div class="flex items-center">
				<Popover class="group relative">
					<PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-70" />
					<PopoverButton class="lg:hidden me-2 relative z-10 group-focus-within:z-30 focus:outline-none w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center">
						<svg width="19" height="19" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M7.01554 14.0316C1.23804 14.0316 -0.000244141 12.7933 -0.000244141 7.01579C-0.000244141 1.23829 1.23804 0 7.01554 0C12.793 0 14.0313 1.23829 14.0313 7.01579C14.0313 12.7933 12.793 14.0316 7.01554 14.0316ZM4.0923 3.50789C3.76941 3.50789 3.50765 3.76965 3.50765 4.09254C3.50765 4.41543 3.76941 4.67719 4.0923 4.67719H5.84624C6.16914 4.67719 6.43089 4.41543 6.43089 4.09254C6.43089 3.76965 6.16914 3.50789 5.84624 3.50789H4.0923ZM3.50765 7.01579C3.50765 6.69289 3.76941 6.43114 4.0923 6.43114H9.93879C10.2617 6.43114 10.5234 6.69289 10.5234 7.01579C10.5234 7.33868 10.2617 7.60044 9.93879 7.60044H4.0923C3.7694 7.60044 3.50765 7.33868 3.50765 7.01579ZM8.18484 9.35438C7.86195 9.35438 7.60019 9.61614 7.60019 9.93903C7.60019 10.2619 7.86195 10.5237 8.18484 10.5237H9.93879C10.2617 10.5237 10.5234 10.2619 10.5234 9.93903C10.5234 9.61614 10.2617 9.35438 9.93879 9.35438H8.18484Z" fill="white"></path>
						</svg>
					</PopoverButton>
					<transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
						<PopoverPanel class="lg:hidden flex flex-col max-h-[80vh] z-30 mt-3 start-0 absolute p-2 bg-white rounded-lg shadow w-56 dark:bg-gray-900 dark:divide-gray-800">
							<div class="">
								
								<div class="pb-5 border-b dark:border-opacity-10 border-zinc-200">
									
									<div class="bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-xl">
										<span class="flex items-center py-2 mx-2 group border-b dark:border-opacity-10 border-zinc-200">
											<ChangeLang class="w-full z-50 text-sm" />
										</span>

										<div class="p-2 inline-flex items-center">
											<button type="button" class="scale-75 inline-flex items-center">
												<DarkMode />
											</button>
											<router-link :to="{ name: 'cart' }" type="button" class="scale-75 relative text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 rounded-full text-sm p-3">
												<svg class="w-5 h-5" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path class="fill-current" fill-rule="evenodd" clip-rule="evenodd" d="M19.1705 14.9551L18.4657 9.27669C18.0363 7.25046 16.8211 6.41663 15.6626 6.41663H6.35407C5.17937 6.41663 3.92365 7.1921 3.55909 9.27669L2.84616 14.9551C2.26286 19.1243 4.40973 20.1666 7.21282 20.1666H14.8119C17.6069 20.1666 19.689 18.6574 19.1705 14.9551ZM8.33901 11.1362C7.89158 11.1362 7.52887 10.7629 7.52887 10.3024C7.52887 9.84187 7.89158 9.46855 8.33901 9.46855C8.78644 9.46855 9.14915 9.84187 9.14915 10.3024C9.14915 10.7629 8.78644 11.1362 8.33901 11.1362ZM12.8353 10.3024C12.8353 10.7629 13.198 11.1362 13.6454 11.1362C14.0928 11.1362 14.4555 10.7629 14.4555 10.3024C14.4555 9.84187 14.0928 9.46855 13.6454 9.46855C13.198 9.46855 12.8353 9.84187 12.8353 10.3024Z"></path>
													<path class="fill-current" opacity="0.4" d="M15.5594 6.20972C15.5623 6.28082 15.5486 6.35162 15.5195 6.41658H14.2021C14.1766 6.35053 14.1631 6.28049 14.1622 6.20972C14.1622 4.45201 12.7324 3.0271 10.9686 3.0271C9.20486 3.0271 7.77504 4.45201 7.77504 6.20972C7.78713 6.27815 7.78713 6.34815 7.77504 6.41658H6.42575C6.41367 6.34815 6.41367 6.27815 6.42575 6.20972C6.52827 3.76367 8.54793 1.83325 11.0046 1.83325C13.4612 1.83325 15.4808 3.76367 15.5834 6.20972H15.5594Z"></path>
												</svg>
												<div class="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 ltr:-right-1 rtl:-left-1 dark:border-gray-900">
													{{ cartItems.length }}
												</div>
											</router-link>
											<NotificationBell
												button-class="scale-75 relative text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 rounded-full text-sm p-3"
											/>
											<router-link to="" type="button" class="scale-75 relative text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 rounded-full text-sm p-3">
												<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path class="fill-yellow-400" d="M22 5C22 6.65685 20.6569 8 19 8C17.3431 8 16 6.65685 16 5C16 3.34315 17.3431 2 19 2C20.6569 2 22 3.34315 22 5Z"></path>
													<path class="fill-current" opacity="0.9" d="M15.6361 2.01096C15.0111 2 14.3051 2 13.5 2H10.5C7.22657 2 5.58985 2 4.38751 2.7368C3.71473 3.14908 3.14908 3.71473 2.7368 4.38751C2 5.58985 2 7.22657 2 10.5V11.5C2 13.8297 2 14.9946 2.3806 15.9134C2.88807 17.1386 3.86144 18.1119 5.08658 18.6194C5.74689 18.8929 6.53422 18.9698 7.78958 18.9915C8.63992 19.0061 9.06509 19.0134 9.40279 19.2098C9.74049 19.4063 9.95073 19.7614 10.3712 20.4718L10.9133 21.3877C11.3965 22.204 12.6035 22.204 13.0867 21.3877L13.6288 20.4718C14.0492 19.7614 14.2595 19.4062 14.5972 19.2098C14.9349 19.0134 15.36 19.0061 16.2104 18.9915C17.4658 18.9698 18.2531 18.8929 18.9134 18.6194C20.1386 18.1119 21.1119 17.1386 21.6194 15.9134C22 14.9946 22 13.8297 22 11.5V10.5C22 9.69494 22 8.98889 21.989 8.36394C21.1942 9.07068 20.1473 9.5 19 9.5C16.5147 9.5 14.5 7.48528 14.5 5C14.5 3.85275 14.9293 2.80577 15.6361 2.01096Z"></path>
												</svg>
											</router-link>
										</div>
									</div>
								</div>
							</div>
							<SidebarMenu class="mt-2 flex-l overflow-y-auto font-semibold" />
						</PopoverPanel>
					</transition>
				</Popover>
				<div class="flex sm:flex-row flex-col sm:items-center">
					<!-- <h6 class="font-bold sm:text-lg dark:text-white text-sm text-gray-800">{{ currentUser.first_name }} عزیز ؛خوش اومدی. 👋</h6>
					<i class="sm:flex hidden mx-3 h-6 border-e border-gray-300 border-opacity-30"></i>
					<span class="ltr:hidden text-gray-400 dark:text-gray-400 sm:text-base text-xs">{{ moment().format("jYYYY-jMMMM-jD | HH:mm a") }}</span>
					<span dir="ltr" class="rtl:hidden text-gray-400 dark:text-gray-400 sm:text-base text-xs">{{ moment().format("YYYY-MMMM-D | HH:mm a") }}</span> -->
				</div>
			</div>
			<div class="flex items-center">
				<DarkMode class="scale-90 hidden lg:flex" />
				<router-link :to="{ name: 'cart' }" class="scale-90 mx-2 focus:outline-none relative hidden lg:inline-flex text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 rounded-full text-sm p-3">
					<svg class="w-5 h-5" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path class="fill-current" fill-rule="evenodd" clip-rule="evenodd" d="M19.1705 14.9551L18.4657 9.27669C18.0363 7.25046 16.8211 6.41663 15.6626 6.41663H6.35407C5.17937 6.41663 3.92365 7.1921 3.55909 9.27669L2.84616 14.9551C2.26286 19.1243 4.40973 20.1666 7.21282 20.1666H14.8119C17.6069 20.1666 19.689 18.6574 19.1705 14.9551ZM8.33901 11.1362C7.89158 11.1362 7.52887 10.7629 7.52887 10.3024C7.52887 9.84187 7.89158 9.46855 8.33901 9.46855C8.78644 9.46855 9.14915 9.84187 9.14915 10.3024C9.14915 10.7629 8.78644 11.1362 8.33901 11.1362ZM12.8353 10.3024C12.8353 10.7629 13.198 11.1362 13.6454 11.1362C14.0928 11.1362 14.4555 10.7629 14.4555 10.3024C14.4555 9.84187 14.0928 9.46855 13.6454 9.46855C13.198 9.46855 12.8353 9.84187 12.8353 10.3024Z"></path>
						<path class="fill-current" opacity="0.4" d="M15.5594 6.20972C15.5623 6.28082 15.5486 6.35162 15.5195 6.41658H14.2021C14.1766 6.35053 14.1631 6.28049 14.1622 6.20972C14.1622 4.45201 12.7324 3.0271 10.9686 3.0271C9.20486 3.0271 7.77504 4.45201 7.77504 6.20972C7.78713 6.27815 7.78713 6.34815 7.77504 6.41658H6.42575C6.41367 6.34815 6.41367 6.27815 6.42575 6.20972C6.52827 3.76367 8.54793 1.83325 11.0046 1.83325C13.4612 1.83325 15.4808 3.76367 15.5834 6.20972H15.5594Z"></path>
					</svg>
					<!-- <div
                        class="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 ltr:-right-1 rtl:-left-1 dark:border-gray-900">
                        {{ cartItems.length }}
                    </div> -->
				</router-link>
				<NotificationBell
					button-class="scale-90 relative hidden lg:inline-flex text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 rounded-full text-sm p-3"
				/>
				<div class="w-10 h-10 text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 border-2 border-gray-200 dark:border-gray-400 rounded-full md:ms-2 overflow-hidden">
					<router-link to="/" class="">
						<img onerror="this.style.display='none'" class="w-full h-full object-cover transform transition duration-200 hover:scale-110" :src="currentUser.profile_pic" :alt="currentUser.username" />
					</router-link>
				</div>
			</div>
		</div>
		<div v-else class="flex items-center justify-between pt-8 pb-5 xl:pe-8 xl:ps-14 px-4">
			<div class="animate-pulse flex items-center">
				<div class="h-2 w-32 md:w-60 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
				<div class="h-2 hidden md:flex ms-4 md:w-20 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
			</div>
			<div class="animate-pulse inline-flex items-center">
				<div class="mx-4 relative hidden lg:inline-flex bg-gray-300 dark:bg-gray-700 rounded-full text-sm p-3">
					<svg class="w-4 h-4 text-gray-200 dark:text-gray-600" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path class="fill-current" fill-rule="evenodd" clip-rule="evenodd" d="M19.1705 14.9551L18.4657 9.27669C18.0363 7.25046 16.8211 6.41663 15.6626 6.41663H6.35407C5.17937 6.41663 3.92365 7.1921 3.55909 9.27669L2.84616 14.9551C2.26286 19.1243 4.40973 20.1666 7.21282 20.1666H14.8119C17.6069 20.1666 19.689 18.6574 19.1705 14.9551ZM8.33901 11.1362C7.89158 11.1362 7.52887 10.7629 7.52887 10.3024C7.52887 9.84187 7.89158 9.46855 8.33901 9.46855C8.78644 9.46855 9.14915 9.84187 9.14915 10.3024C9.14915 10.7629 8.78644 11.1362 8.33901 11.1362ZM12.8353 10.3024C12.8353 10.7629 13.198 11.1362 13.6454 11.1362C14.0928 11.1362 14.4555 10.7629 14.4555 10.3024C14.4555 9.84187 14.0928 9.46855 13.6454 9.46855C13.198 9.46855 12.8353 9.84187 12.8353 10.3024Z"></path>
						<path class="fill-current" opacity="0.4" d="M15.5594 6.20972C15.5623 6.28082 15.5486 6.35162 15.5195 6.41658H14.2021C14.1766 6.35053 14.1631 6.28049 14.1622 6.20972C14.1622 4.45201 12.7324 3.0271 10.9686 3.0271C9.20486 3.0271 7.77504 4.45201 7.77504 6.20972C7.78713 6.27815 7.78713 6.34815 7.77504 6.41658H6.42575C6.41367 6.34815 6.41367 6.27815 6.42575 6.20972C6.52827 3.76367 8.54793 1.83325 11.0046 1.83325C13.4612 1.83325 15.4808 3.76367 15.5834 6.20972H15.5594Z"></path>
					</svg>
					<div class="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-gray-200 dark:bg-gray-600 border-2 border-white rounded-full -top-1 ltr:-right-1 rtl:-left-1 dark:border-gray-900"></div>
				</div>

				<div class="relative hidden lg:inline-flex bg-gray-300 dark:bg-gray-700 rounded-full text-sm p-3">
					<svg class="w-4 h-4 text-gray-200 dark:text-gray-600" viewBox="-2 -1 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path class="fill-current" d="M13.3014 8.50275C12.709 7.81089 12.4397 7.21133 12.4397 6.19274V5.8464C12.4397 4.51905 12.1342 3.66382 11.47 2.8086C10.4463 1.48043 8.72294 0.679932 7.03584 0.679932H6.9641C5.31247 0.679932 3.64311 1.44367 2.60167 2.71793C1.90119 3.59031 1.56023 4.48229 1.56023 5.8464V6.19274C1.56023 7.21133 1.30873 7.81089 0.698539 8.50275C0.249559 9.01245 0.106079 9.66755 0.106079 10.3766C0.106079 11.0864 0.339033 11.7586 0.806552 12.3051C1.41675 12.9602 2.27843 13.3784 3.15866 13.4511C4.43305 13.5965 5.70744 13.6512 7.00038 13.6512C8.2925 13.6512 9.5669 13.5598 10.8421 13.4511C11.7215 13.3784 12.5832 12.9602 13.1934 12.3051C13.6601 11.7586 13.8939 11.0864 13.8939 10.3766C13.8939 9.66755 13.7504 9.01245 13.3014 8.50275"></path>
						<path class="fill-current" opacity="0.4" d="M8.62912 14.653C8.22367 14.5664 5.75307 14.5664 5.34762 14.653C5.00101 14.733 4.62619 14.9192 4.62619 15.3277C4.64634 15.7173 4.87446 16.0612 5.19044 16.2793L5.18963 16.2801C5.59831 16.5986 6.07792 16.8012 6.5801 16.8739C6.84771 16.9107 7.12016 16.909 7.39745 16.8739C7.89883 16.8012 8.37844 16.5986 8.78711 16.2801L8.78631 16.2793C9.10229 16.0612 9.3304 15.7173 9.35055 15.3277C9.35055 14.9192 8.97573 14.733 8.62912 14.653"></path>
					</svg>
					<div class="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-gray-200 dark:bg-gray-600 border-2 border-white rounded-full -top-1 ltr:-right-1 rtl:-left-1 dark:border-gray-900"></div>
				</div>

				<div class="w-10 h-10 ltr:ml-4 rtl:mr-4 inline-flex items-center bg-gray-300 dark:bg-gray-700 rounded-full">
					<svg class="m-auto w-5 h-5 text-gray-200 dark:text-gray-600" viewBox="-2 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M8.90975 13.681C5.25731 13.681 2.13892 14.265 2.13892 16.598C2.13892 18.9301 5.23834 19.5351 8.90975 19.5351C12.5613 19.5351 15.6806 18.9511 15.6806 16.6181C15.6806 14.2851 12.5812 13.681 8.90975 13.681" fill="currentColor"></path>
						<path d="M8.90984 11.459C11.3966 11.459 13.39 9.43996 13.39 6.92114C13.39 4.40232 11.3966 2.38232 8.90984 2.38232C6.42308 2.38232 4.42969 4.40232 4.42969 6.92114C4.42969 9.43996 6.42308 11.459 8.90984 11.459" fill="currentColor"></path>
					</svg>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
	import DarkMode from "@/views/components/DarkMode.vue";
	import ChangeLang from "@/views/components/ChangeLang.vue";
	import SidebarMenu from "@/views/components/panel/SidebarMenu.vue";
	import NotificationBell from "@/views/components/notification/NotificationBell.vue";
	import { computed } from "vue";
	import moment from "moment-jalaali";
	import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
	export default {
		setup() {
			moment().format("jYYYY/jM/jD");
			const isRtl = computed(() => (import.meta.client && localStorage.getItem("direction") === "rtl"));
			if (isRtl.value) moment.loadPersian();

			return {
				moment
			};
		},
		computed: {
			loggedIn() {
				return this.$store.state.auth.status.loggedIn;
			},
			currentUser() {
				return this.$store.state.auth.status.userInfo;
			},
			cartItems() {
				return this.$store.state.cart.cartItems;
			}
		},
		mounted() {
			this.$store.dispatch("notification/initForUser")
		},
		components: {
			DarkMode,
			ChangeLang,
			SidebarMenu,
			NotificationBell,
			Popover,
			PopoverButton,
			PopoverPanel,
			PopoverOverlay
		}
	};
</script>

<style></style>
