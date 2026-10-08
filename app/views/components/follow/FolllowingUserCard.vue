<template>
	<!-- Card -->
	<div class="relative w-full p-[18px] z-10">
		<div :class="[
			'group h-full bg-white/60 dark:bg-gray-950/60 rounded-2xl p-5',
			'before:absolute before:rotate-2 before:hover:rotate-0 before:duration-150 before:top-1.5 before:left-2 before:w-[calc(100%-1rem)] before:h-[calc(100%-2.2rem)] before:bg-white/30 before:dark:bg-gray-950/30 before:-z-10 before:rounded-2xl',
		]">
			<div class="flex">
				<div class="flex items-start me-4">
					<div class="border-gray-100 border-2 rounded-full w-16 h-16 overflow-hidden">
						<img onerror="this.style.display='none'" class="object-cover w-full h-full hover:scale-110 duration-150"
							:src="localeUser.profile_pic" :alt="localeUser.username" />
					</div>
				</div>
				<div class="flex flex-col">
					<div class="mb-2 mt-4">
						<h5 class="font-bold text-md line-clamp-1 text-gray-800 dark:text-white">
							{{ localeUser.first_name + ' ' + localeUser.last_name }}
						</h5>
						<span class="text-sm text-gray-400" dir="ltr">@{{ localeUser.username }}</span>
					</div>
					<p
						class="mb-2 line-clamp-3 md:line-clamp-2 text-gray-800 dark:text-gray-300 text-xs font-light leading-normal">
						{{ localeUser.info.about }}
					</p>
					<div class="rotate-2 group-hover:rotate-0 duration-150">
						<div class="flex items-center bg-gray-200 dark:bg-gray-800/30 w-min px-3 py-1.5 rounded-md">
							<div class="justify-start items-center flex-col md:pe-2">
								<div class="font-bold text-md text-gray-800 dark:text-amber-400">{{
									localeUser.followings_count }}</div>
								<span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.follow.followings') }}</span>
							</div>
							<svg class="w-4 fill-gray-600 dark:fill-gray-400" viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"></path>
							</svg>
							<div class="justify-start items-center flex-col md:px-2">
								<div class="font-bold text-md text-gray-800 dark:text-amber-400">{{
									localeUser.followers_count }}</div>
								<span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.follow.followers') }}</span>
							</div>
							<svg class="w-4 fill-gray-600 dark:fill-gray-400" viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"></path>
							</svg>
							<div class="justify-start items-center flex-col md:ps-2">
								<div class="font-bold text-md text-gray-800 dark:text-amber-400">{{
									localeUser.current_score.toLocaleString() }}</div>
								<span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.public.userExperience') }}</span>
							</div>
						</div>
					</div>
					<div class="mt-4 flex items-center">
						<button :disabled="followLoading" @click="toggleFollow"
							class="me-3 align-middle select-none font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 dark:hover:shadow-gray-700/30 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
							type="button">
							<svg v-if="followLoading" class="w-4 h-4 m-auto" version="1.1"
								xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
								viewBox="25 25 50 50">

								<circle class="stroke-current text-gray-50 text-opacity-30" cx="50" cy="50" r="20"
									fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
									stroke-dasharray="200, 300">

								</circle>
								<circle class="stroke-current text-gray-50" cx="50" cy="50" r="20" fill="none"
									stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
									stroke-dasharray="100, 200">
									<animateTransform attributeName="transform" attributeType="XML" type="rotate"
										from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite">
									</animateTransform>
									<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s"
										repeatCount="indefinite">
									</animate>
									<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s"
										repeatCount="indefinite"></animate>
								</circle>
							</svg>
							<span v-else>{{ localeUser.hasFlollow ? $t('profile.common.unfollow') : $t('profile.common.follow') }}</span>
						</button>
						<router-link :to="{ name: 'profile-page', params: { username: localeUser.username } }"
							class="select-none rounded-lg border border-gray-900 dark:border-gray-50 py-3 px-6 text-center align-middle text-xs font-bold uppercase text-gray-900 dark:text-gray-50 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
							type="button">
							{{ $t('profile.follow.profileButton') }}
						</router-link>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- End Card -->
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
	data() {
		return {
			localeUser: this.user,
			followLoading: false,
		}
	},
	props: {
		user: Object,
	},
	watch: {
		user(newUser) {
			this.localeUser = newUser;
		},
	},
	methods: {
		async toggleFollow() {
			this.followLoading = true;
			await axiosInstance
				.post("/toggleFollow", {
					followable_id: this.localeUser.id,
					followable_type: 'User',
				})
				.then((response) => {
					this.localeUser.hasFlollow = response.data.hasFlollow;
					this.localeUser.followings_count = response.data.numberOfFollowings;
					this.localeUser.followers_count = response.data.numberOfFollowers;
				})
				.catch((error) => {
					if (error.response.status === 403) {
						if (error.response.data.errorType === 'login') {
							toast.warning(this.$t("profile.toast.followLoginRequired"), {
								theme: "colored",
								hideProgressBar: false,
								rtl: localStorage.getItem("direction") == "rtl" ? true : false,
								bodyClassName: "font-YekanBakh text-gray-800",
								toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
								transition: toast.TRANSITIONS.BOUNCE,
								position: toast.POSITION.BOTTOM_RIGHT
							});
						} else if (error.response.data.errorType === 'yourself') {
							toast.error(this.$t("profile.toast.cannotFollowSelf"), {
								theme: "colored",
								hideProgressBar: false,
								rtl: localStorage.getItem("direction") == "rtl" ? true : false,
								bodyClassName: "font-YekanBakh",
								toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
								transition: toast.TRANSITIONS.BOUNCE,
								position: toast.POSITION.BOTTOM_RIGHT
							});
						}
					}
					console.error(error.response.data.errors);
				})
				.finally(() => {
					this.followLoading = false
				});
		},
	}
};
</script>

<style></style>
