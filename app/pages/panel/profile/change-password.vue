<script setup>
definePageMeta({
  name: "panel-profile-change-password",
  middleware: ['auth'],
})
</script>

<template>
	<ProfileMasterPage>
		<div class="flex flex-col">
			<div>
				<div class="mb-5 last:mb-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
					<div class="flex items-center gap-3 mb-5">
						<span class="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</span>
						<h2 class="text-gray-800 dark:text-white font-bold text-base md:text-lg">{{ $t('profile.password.title') }}</h2>
					</div>
					<div class="grid md:grid-cols-2 grid-cols-1 md:gap-x-14 gap-y-6">
						<div class="md:col-span-2 col-span-1 grid md:grid-cols-2 grid-cols-1 md:gap-x-14">
							<div class="flex flex-col col-span-1 mb-3">
								<label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1"
									for="">{{ $t('profile.password.current') }}</label>
								<div class="relative text-white-dark">
									<button type="button" @click="authPasswordVisibility = !authPasswordVisibility"
										class="absolute end-3.5 top-1/2 -translate-y-1/2 focus:outline-none text-gray-400 dark:text-gray-400 z-10">
										<span v-show="!authPasswordVisibility" class="">
											<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path class="stroke-current"
													d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
													stroke-width="1.5"></path>
												<path class="stroke-current"
													d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
													stroke-width="1.5"></path>
											</svg>
										</span>
										<span v-show="authPasswordVisibility" class="">
											<svg class="w-5 h-5" viewBox="0 0 20 17" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path class="stroke-current"
													d="M7.94557 10.1681C7.41849 9.64191 7.09766 8.92691 7.09766 8.12482C7.09766 6.51791 8.39199 5.22266 9.99799 5.22266C10.7927 5.22266 11.5242 5.54441 12.0422 6.07057"
													stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
												<path class="stroke-current"
													d="M12.8451 8.64062C12.6324 9.82312 11.7011 10.7563 10.5195 10.9708"
													stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
												<path class="stroke-current"
													d="M5.09911 13.0145C3.64436 11.8724 2.41236 10.204 1.51953 8.1241C2.42153 6.03502 3.66178 4.35752 5.1257 3.20619C6.58045 2.05485 8.25887 1.42969 9.9987 1.42969C11.7486 1.42969 13.4261 2.06402 14.89 3.2236"
													stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
												<path class="stroke-current"
													d="M16.8241 5.24023C17.4548 6.07807 18.0094 7.04515 18.4759 8.12407C16.6729 12.3013 13.4865 14.8176 9.99678 14.8176C9.2057 14.8176 8.42561 14.6892 7.67578 14.439"
													stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
												<path class="stroke-current" d="M17.229 0.894531L2.76953 15.354"
													stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
											</svg>
										</span>
									</button>
									<input v-model="password" autocomplete="off" id="Password"
										:type="authPasswordVisibility ? 'text' : 'password'"
										class="font-mono h-11 w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border pe-11 ps-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
										:class="errors && errors.oldPassword ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'" />
								</div>
								<span v-if="errors && errors.oldPassword"
									class="mt-1.5 text-rose-500 text-xs font-semibold">
									{{ errors.oldPassword[0] }}
								</span>
								<button class="text-start w-max" @click="openForgetPasswordModal">
									<span
										class="block text-gray-500 dark:text-gray-500 dark:hover:text-white hover:text-gray-700 text-xs mt-2">{{ $t('profile.password.forgotCurrent') }}</span>
								</button>
							</div>
						</div>
						<div class="flex flex-col col-span-1 mb-3">
							<div>
								<label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1"
									for="">{{ $t('profile.password.new') }}</label>
								<div class="relative text-white-dark">
									<button type="button"
										@click="authNewPasswordVisibility = !authNewPasswordVisibility"
										class="absolute end-3.5 top-1/2 -translate-y-1/2 focus:outline-none text-gray-400 dark:text-gray-400 z-10">
										<span v-show="!authNewPasswordVisibility" class="">
											<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path class="stroke-current"
													d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
													stroke-width="1.5"></path>
												<path class="stroke-current"
													d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
													stroke-width="1.5"></path>
											</svg>
										</span>
										<span v-show="authNewPasswordVisibility" class="">
											<svg class="w-5 h-5" viewBox="0 0 20 17" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path class="stroke-current"
													d="M7.94557 10.1681C7.41849 9.64191 7.09766 8.92691 7.09766 8.12482C7.09766 6.51791 8.39199 5.22266 9.99799 5.22266C10.7927 5.22266 11.5242 5.54441 12.0422 6.07057"
													stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
												<path class="stroke-current"
													d="M12.8451 8.64062C12.6324 9.82312 11.7011 10.7563 10.5195 10.9708"
													stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
												<path class="stroke-current"
													d="M5.09911 13.0145C3.64436 11.8724 2.41236 10.204 1.51953 8.1241C2.42153 6.03502 3.66178 4.35752 5.1257 3.20619C6.58045 2.05485 8.25887 1.42969 9.9987 1.42969C11.7486 1.42969 13.4261 2.06402 14.89 3.2236"
													stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
												<path class="stroke-current"
													d="M16.8241 5.24023C17.4548 6.07807 18.0094 7.04515 18.4759 8.12407C16.6729 12.3013 13.4865 14.8176 9.99678 14.8176C9.2057 14.8176 8.42561 14.6892 7.67578 14.439"
													stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
												<path class="stroke-current" d="M17.229 0.894531L2.76953 15.354"
													stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
											</svg>
										</span>
									</button>
									<input v-model="newPassword" autocomplete="off" id="Password"
										:type="authNewPasswordVisibility ? 'text' : 'password'"
										class="font-mono h-11 w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border pe-11 ps-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
										:class="errors && errors.newPassword ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'" />
								</div>
								<span v-if="errors && errors.newPassword"
									class="mt-1.5 text-rose-500 text-xs font-semibold">
									{{ errors.newPassword[0] }}
								</span>
							</div>
							<ul v-if="!allConditionsMet"
								class="border border-pink-500 dark:border-pink-400 dark:bg-pink-400 dark:bg-opacity-10 bg-pink-500 bg-opacity-5 rounded-xl px-4 py-2 mt-4">
								<li v-if="!hasLowercase"
									class="font-semibold text-[0.8rem] text-pink-700 dark:text-pink-600 mb-2 last:mb-0">
									{{ $t('profile.password.ruleLowercase') }}</li>
								<li v-if="!hasUppercase"
									class="font-semibold text-[0.8rem] text-pink-700 dark:text-pink-600 mb-2 last:mb-0">
									{{ $t('profile.password.ruleUppercase') }}</li>
								<li v-if="!hasMinLength"
									class="font-semibold text-[0.8rem] text-pink-700 dark:text-pink-600 mb-2 last:mb-0">
									{{ $t('profile.password.ruleMinLength') }}</li>
								<li v-if="!hasSpecialChar"
									class="font-semibold text-[0.8rem] text-pink-700 dark:text-pink-600 mb-2 last:mb-0">
									{{ $t('profile.password.ruleSpecialChar') }}
								</li>
								<li v-if="!hasNumber"
									class="font-semibold text-[0.8rem] text-pink-700 dark:text-pink-600 mb-2 last:mb-0">
									{{ $t('profile.password.ruleNumber') }}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<button @click.prevent="setPassword" :disabled="loading" type="submit"
				class="inline-flex items-center justify-center gap-2 min-w-[10rem] h-11 px-6 text-sm font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md self-end mt-10">
				<svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span>{{ loading ? $t('profile.common.loading') : $t('profile.common.saveChanges') }}</span>
			</button>
		</div>

		<BottomSheetDrawer v-model="isOpenForgetPasswordModal" :initialHeight="0.5" :maxHeight="0.6" :minHeight="0.4"
			:autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
			:panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:w-[30rem] lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
			:contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
			:backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">

			<div class="relative p-4 text-center sm:p-5">

									<svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
										aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
										viewBox="0 0 20 20">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
											stroke-width="2"
											d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
									</svg>
									<p
										class="mb-4 rounded-xl p-3 bg-gray-100 dark:bg-gray-900/30 text-gray-500 dark:text-gray-300 text-sm font-medium">
										{{ $t('profile.password.forgotModalDesc') }}
									</p>
									<div class="flex justify-center items-center space-x-4 rtl:space-x-reverse">
										<button @click="closeForgetPasswordModal" type="button"
											class="h-9 py-2 px-3 text-sm font-semibold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
											{{ $t('profile.common.cancel') }}
										</button>
										<button type="submit" @click="forgetPassword" :disabled="forgetPasswordLoading"
											class="w-32 h-9 py-2 px-3 text-sm font-semibold text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
											<svg v-if="forgetPasswordLoading" class="w-4 h-4 m-auto" version="1.1"
												xmlns="http://www.w3.org/2000/svg"
												xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">

												<circle class="stroke-current text-gray-50 text-opacity-30" cx="50"
													cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round"
													stroke-dashoffset="0" stroke-dasharray="200, 300">

												</circle>
												<circle class="stroke-current text-gray-50" cx="50" cy="50" r="20"
													fill="none" stroke-width="8" stroke-linecap="round"
													stroke-dashoffset="0" stroke-dasharray="100, 200">
													<animateTransform attributeName="transform" attributeType="XML"
														type="rotate" from="0 50 50" to="360 50 50" dur="2.5s"
														repeatCount="indefinite"></animateTransform>
													<animate attributeName="stroke-dashoffset" values="0;-30;-124"
														dur="1.25s" repeatCount="indefinite">
													</animate>
													<animate attributeName="stroke-dasharray"
														values="0,200;110,200;110,200" dur="1.25s"
														repeatCount="indefinite"></animate>
												</circle>
											</svg>
											<span v-else>{{ $t('profile.password.continue') }}</span>
										</button>
									</div>
			</div>
		</BottomSheetDrawer>
	</ProfileMasterPage>
</template>

<script>
import ProfileMasterPage from "@/views/page/panel/profile/ProfileMasterPage.vue";
import { ref } from "vue";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";

export default {
	components: {
		ProfileMasterPage,
		BottomSheetDrawer,
	},
	data() {
		return {
			authPasswordVisibility: ref(false),
			authNewPasswordVisibility: ref(false),
			password: '',
			newPassword: '',
			loading: ref(false),
			errors: ref(null),
			isOpenForgetPasswordModal: false,
			forgetPasswordLoading: false
		};
	},
	computed: {
		hasLowercase() {
			return /[a-z]/.test(this.newPassword);
		},
		hasUppercase() {
			return /[A-Z]/.test(this.newPassword);
		},
		hasNumber() {
			return /\d/.test(this.newPassword);
		},
		hasSpecialChar() {
			return /[#?!@$%^&*-]/.test(this.newPassword);
		},
		hasMinLength() {
			return (this.newPassword || '').length >= 8;
		},
		allConditionsMet() {
			return this.hasLowercase && this.hasUppercase && this.hasNumber && this.hasSpecialChar && this.hasMinLength;
		}
	},
	methods: {
		setPassword() {
			this.loading = true;
			this.errors = null;
			axiosInstance
				.post("/panel/profile/change-password", { oldPassword: this.password, newPassword: this.newPassword })
				.then(() => {
					toast.success(this.$t("profile.password.changeSuccess"), {
						theme: "colored",
						hideProgressBar: false,
						rtl: localStorage.getItem("direction") == "rtl" ? true : false,
						bodyClassName: "font-YekanBakh",
						toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
						transition: toast.TRANSITIONS.BOUNCE,
						position: toast.POSITION.BOTTOM_RIGHT
					});
					this.password = null;
					this.newPassword = null;
				})
				.catch((error) => {
					if (error.response.status === 422) {
						this.errors = error.response.data.errors;
					}
					console.error(error.response.data.errors);
				})
				.finally(() => {
					this.loading = false;
				});
		},
		forgetPassword() {
			this.forgetPasswordLoading = true
			this.$store.dispatch("auth/logout").then(() => {
				this.forgetPasswordLoading = false
				this.closeForgetPasswordModal();
				this.$router.push({ name: "login", query: { step: "forgot_start" } });
			});
		},
		closeForgetPasswordModal() {
			this.isOpenForgetPasswordModal = false;
		},
		openForgetPasswordModal() {
			this.isOpenForgetPasswordModal = true;
		},
	},
	mounted() {
		document.title = this.$t("profile.password.title");
	}
};
</script>
<style></style>
