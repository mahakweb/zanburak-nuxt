<template>
	<ProfileMasterPage>
		<div class="flex flex-col">
			<!-- Loading skeleton (mirrors this page's content) -->
			<div v-if="startLoading" class="mb-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
				<div class="flex items-center gap-3 mb-5">
					<div class="animate-pulse w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
					<div class="animate-pulse h-4 w-40 rounded-full bg-gray-200 dark:bg-gray-700"></div>
				</div>
				<!-- info box skeleton -->
				<div class="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-4 mb-6">
					<div class="animate-pulse h-3.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-3"></div>
					<div class="animate-pulse h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
					<div class="space-y-2.5">
						<div v-for="i in 4" :key="i" class="animate-pulse h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" :class="['w-3/4','w-2/3','w-4/5','w-1/2'][i - 1]"></div>
					</div>
				</div>
				<!-- current number field skeleton -->
				<div class="grid md:grid-cols-2 grid-cols-1 gap-y-6">
					<div class="space-y-6">
						<div class="space-y-2">
							<div class="animate-pulse h-2.5 w-28 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							<div class="animate-pulse h-11 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
						</div>
						<div class="space-y-2">
							<div class="animate-pulse h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							<div class="animate-pulse h-11 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
						</div>
						<div class="animate-pulse h-11 w-32 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
					</div>
				</div>
			</div>
			<div v-else>
				<div class="mb-5 last:mb-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
					<div class="flex items-center gap-3 mb-5">
						<span class="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
							</svg>
						</span>
						<h2 class="text-gray-800 dark:text-white font-bold text-base md:text-lg">{{ $t('profile.phone.title') }}</h2>
					</div>

					<div>
						<div class="mb-6 space-y-2">
							<div
								class="border dark:border-sky-400 border-sky-600 bg-sky-700 bg-opacity-5 rounded-xl p-4 mb-2">
								<div class="mb-6">
									<h6 class="font-bold text-sky-600 dark:text-sky-400 text-sm mb-1.5">{{ $t('profile.phone.noteLabel') }}</h6>
									<p class="font-medium text-sky-600 dark:text-sky-400 text-sm leading-7">
										{{ $t('profile.phone.intro') }}</p>
								</div>
								<ul class="space-y-1 list-disc ps-4 marker:text-sky-500">
									<li class="font-medium text-sm text-sky-600 dark:text-sky-400 leading-7">
										{{ $t('profile.phone.benefit1') }}</li>
									<li class="font-medium text-sm text-sky-600 dark:text-sky-400 leading-7">
										{{ $t('profile.phone.benefit2') }}</li>
									<li class="font-medium text-sm text-sky-600 dark:text-sky-400 leading-7">
										{{ $t('profile.phone.benefit3') }}</li>
									<li class="font-medium text-sm text-sky-600 dark:text-sky-400 leading-7">
										{{ $t('profile.phone.benefit4') }}</li>
								</ul>
							</div>
						</div>
						<div class="grid md:grid-cols-2 grid-cols-1 gap-y-6">
							<div v-if="!isOtpSend">
								<div class="flex flex-col mb-6">
									<label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1"
										for="">{{ $t('profile.phone.currentNumber') }}</label>
									<div dir="ltr" class="relative">
										<span class="absolute start-3 top-1/2 -translate-y-1/2 cursor-not-allowed">
											<svg class="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24"
												fill="none" xmlns="http://www.w3.org/2000/svg">
												<path fill-rule="evenodd" clip-rule="evenodd"
													d="M9.93417 2C9.95604 2 9.97799 2 10 2L14.0658 2C14.9523 1.99995 15.7161 1.99991 16.3278 2.08215C16.9833 2.17028 17.6117 2.36902 18.1213 2.87868C18.631 3.38835 18.8297 4.0167 18.9179 4.67221C19.0001 5.28387 19.0001 6.04769 19 6.93417V17.0658C19.0001 17.9523 19.0001 18.7161 18.9179 19.3278C18.8297 19.9833 18.631 20.6117 18.1213 21.1213C17.6117 21.631 16.9833 21.8297 16.3278 21.9179C15.7161 22.0001 14.9523 22.0001 14.0658 22H9.9342C9.0477 22.0001 8.28388 22.0001 7.67221 21.9179C7.0167 21.8297 6.38835 21.631 5.87868 21.1213C5.36902 20.6117 5.17028 19.9833 5.08215 19.3278C4.99991 18.7161 4.99995 17.9523 5 17.0658L5 7C5 6.97799 5 6.95604 5 6.93417C4.99995 6.04769 4.99991 5.28387 5.08215 4.67221C5.17028 4.0167 5.36902 3.38835 5.87868 2.87868C6.38835 2.36902 7.0167 2.17028 7.67221 2.08215C8.28387 1.99991 9.04769 1.99995 9.93417 2ZM10.5 18C10.5 17.4477 10.9477 17 11.5 17H12.5C13.0523 17 13.5 17.4477 13.5 18C13.5 18.5523 13.0523 19 12.5 19H11.5C10.9477 19 10.5 18.5523 10.5 18Z"
													fill="currentColor"></path>
											</svg>
										</span>
										<input type="tel"
											class="tracking-wider ps-10 h-11 cursor-not-allowed w-full rounded-xl bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 pe-3.5 text-sm font-medium text-gray-500 dark:text-gray-400 outline-none"
											placeholder="" disabled="disabled" :value="oldMobile" />
									</div>
									<div v-if="oldMobile && !mobileVerifiedAt"
										class="border flex items-center border-pink-600 bg-pink-600 bg-opacity-5 rounded-lg py-2 px-3 mt-2">
										<svg class="me-2 text-pink-700 w-4 h-4" viewBox="0 0 14 14" fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path fill-rule="evenodd" clip-rule="evenodd"
												d="M0 7C0 12.7645 1.2355 14 7 14C12.7645 14 14 12.7645 14 7C14 1.2355 12.7645 0 7 0C1.2355 0 0 1.2355 0 7ZM4.93764 4.93758C5.16544 4.70978 5.53479 4.70978 5.7626 4.93758L7.00005 6.17504L8.23746 4.93764C8.46526 4.70983 8.83461 4.70983 9.06242 4.93764C9.29022 5.16544 9.29022 5.53479 9.06242 5.7626L7.82501 7L9.06243 8.23742C9.29023 8.46522 9.29023 8.83457 9.06243 9.06237C8.83462 9.29018 8.46528 9.29018 8.23747 9.06237L7.00005 7.82496L5.76258 9.06243C5.53478 9.29023 5.16543 9.29023 4.93763 9.06243C4.70982 8.83462 4.70982 8.46528 4.93763 8.23747L6.1751 7L4.93764 5.76254C4.70983 5.53474 4.70983 5.16539 4.93764 4.93758Z"
												fill="currentColor"></path>
										</svg>
										<span class="flex ite,s-center font-semibold text-sm text-pink-700">
											{{ $t('profile.phone.notVerified') }}
											<span v-if="verifyCurrentMobileLoading" class="ms-3">
												<svg class="w-4" version="1.1" xmlns="http://www.w3.org/2000/svg"
													xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">

													<circle class="stroke-current text-pink-700 text-opacity-30" cx="50"
														cy="50" r="20" fill="none" stroke-width="8"
														stroke-linecap="round" stroke-dashoffset="0"
														stroke-dasharray="200, 300">

													</circle>
													<circle class="stroke-current text-pink-700" cx="50" cy="50" r="20"
														fill="none" stroke-width="8" stroke-linecap="round"
														stroke-dashoffset="0" stroke-dasharray="100, 200">
														<animateTransform attributeName="transform" attributeType="XML"
															type="rotate" from="0 50 50" to="360 50 50" dur="2.5s"
															repeatCount="indefinite"></animateTransform>
														<animate attributeName="stroke-dashoffset" values="0;-30;-124"
															dur="1.25s" repeatCount="indefinite"></animate>
														<animate attributeName="stroke-dasharray"
															values="0,200;110,200;110,200" dur="1.25s"
															repeatCount="indefinite"></animate>
													</circle>
												</svg>
											</span>
											<button v-else @click.prevent="verifyCurrentMobile"
												class="font-semibold hover:text-gray-500 transition ms-1 duration-200 underline">
												{{ $t('profile.phone.clickToVerify') }}
											</button>

										</span>
									</div>
								</div>
								<div>
									<label for="mobile"
										class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1">
										{{ $t('profile.phone.mobile') }}
									</label>
									<div dir="ltr" class="relative mt-2">
										<div class="absolute inset-y-0 start-0 flex items-center">
											<Listbox v-model="selectedCountry">
												<div
													class="relative scale-90 pe-2 border-e-2 border-gray-400/50 dark:border-opacity-30">
													<ListboxButton
														class="relative flex items-center h-8 my-auto w-28 cursor-default rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white pl-3 pr-7 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
														<span class="me-1">
															<country-flag class="mask mask-circle"
																:country="selectedCountry.code" size="normal" />
														</span>
														<span class="block truncate tracking-wider">{{
															selectedCountry.dial_code
														}}</span>
														<span
															class="pointer-events-none absolute inset-y-0 right-0 flex items-center ps-1 me-1.5">
															<ChevronUpDownIcon class="h-4 w-4 text-gray-400"
																aria-hidden="true" />
														</span>
													</ListboxButton>

													<transition leave-active-class="transition duration-100 ease-in"
														leave-from-class="opacity-100" leave-to-class="opacity-0">
														<ListboxOptions
															class="absolute flex flex-col mt-3 p-2 max-h-52 w-80 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100 shadow-lg shadow-gray-300 dark:shadow-gray-700/60 ring-0 outline-none focus:outline-none sm:text-sm rounded-xl overflow-hidden">
															<!-- Search input (fixed at top) -->
															<div class="mb-3 z-10">
																<input type="text" autofocus v-focus
																	v-model="searchQuery" placeholder=""
																	class="w-full rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400" />
															</div>

															<!-- Country list (scrollable) -->
															<div class="overflow-auto custom-scrollbar max-h-48">
																<ListboxOption v-slot="{ active, selected }"
																	v-for="country in filteredCountries"
																	:key="country.code" :value="country" as="div">
																	<li :class="[
																		active ? 'bg-amber-100 text-amber-900' : 'text-gray-900 dark:text-gray-100',
																		'relative flex items-center mb-1 last:mb-0 rounded-lg cursor-default select-none px-3',
																	]">
																		<span>
																			<country-flag class="mask mask-circle"
																				:country="country.code" size="normal" />
																		</span>
																		<span :class="[
																			selected ? 'font-bold' : 'font-normal',
																			'mx-2 truncate',
																		]">
																			{{ country.name }} <span
																				class="ms-2 tracking-wider">({{
																					country.dial_code }})</span>
																		</span>
																		<span v-if="selected"
																			class="absolute inset-y-0 end-0 flex items-center pe-2 text-amber-600">
																			<CheckIcon class="h-3 w-3"
																				aria-hidden="true" />
																		</span>
																	</li>
																</ListboxOption>
															</div>
														</ListboxOptions>
													</transition>
												</div>
											</Listbox>
										</div>
										<input type="tel" name="mobile" id="mobile"
											:maxlength="selectedCountry.mobile_number_length" v-model="mobile"
											@input="validateMobileInput"
											class="tracking-wider block h-11 w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border pe-3.5 ps-[120px] text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
											:class="errors && errors['mobile'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
											placeholder="" />
									</div>
									<span v-if="errors && errors['mobile']"
										class="mt-3 text-rose-500 text-xs font-semibold">
										{{ errors["mobile"][0] }}
									</span>
								</div>
								<div class="mt-4">
									<button type="button" @click.prevent="sendOtp" :disabled="sendOtpLoading"
										class="inline-flex items-center justify-center gap-2 w-32 h-11 px-5 text-sm font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md">
										<svg v-if="sendOtpLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										<span v-if="!sendOtpLoading">{{ $t('profile.phone.submitNumber') }}</span>
									</button>
								</div>
							</div>
							<div v-else class="flex flex-col justify-start text-start">
								<div
									class="border dark:border-slate-400 border-slate-600 bg-slate-700 bg-opacity-5 rounded-xl p-4 mb-4">
									<div class="">
										<p
											class="font-medium text-slate-600 dark:text-slate-300 text-sm leading-7">
											<span class="inline-block align-middle me-1.5">
												<svg class="w-4 h-4 inline-block" viewBox="0 0 15 15" fill="none"
													xmlns="http://www.w3.org/2000/svg">
													<path
														d="M3.5 6C3.22386 6 3 6.22386 3 6.5V8.5C3 8.77614 3.22386 9 3.5 9C3.77614 9 4 8.77614 4 8.5V6.5C4 6.22386 3.77614 6 3.5 6Z"
														fill="currentColor"></path>
													<path
														d="M11 7H11.5C11.7761 7 12 6.77614 12 6.5C12 6.22386 11.7761 6 11.5 6H11V7Z"
														fill="currentColor"></path>
													<path fill-rule="evenodd" clip-rule="evenodd"
														d="M0 1.5C0 0.671573 0.671573 0 1.5 0H13.5C14.3284 0 15 0.671573 15 1.5V13.5C15 14.3284 14.3284 15 13.5 15H1.5C0.671573 15 0 14.3284 0 13.5V1.5ZM2 6.5C2 5.67157 2.67157 5 3.5 5C4.32843 5 5 5.67157 5 6.5V8.5C5 9.32843 4.32843 10 3.5 10C2.67157 10 2 9.32843 2 8.5V6.5ZM7 6H6V5H9V6H8V10H7V6ZM10 5H11.5C12.3284 5 13 5.67157 13 6.5C13 7.32843 12.3284 8 11.5 8H11V10H10V5Z"
														fill="currentColor"></path>
												</svg>
											</span>
											<span v-if="isNewCode">
												{{ $t('profile.phone.otpSentPre') }} <span dir="ltr"
													class="tracking-wider font-semibold">{{ isVerifyingCurrentMobile ?
														oldMobile : selectedCountry.dial_code + mobile }}</span> {{ $t('profile.phone.otpSentPost') }}
											</span>
											<span v-else>
												{{ $t('profile.phone.otpResentPre') }} <span dir="ltr"
													class="tracking-wider font-semibold">{{ isVerifyingCurrentMobile ?
														oldMobile : selectedCountry.dial_code + mobile }}</span> {{ $t('profile.phone.otpResentPost') }}
												<br>
												&#x2022; {{ $t('profile.phone.otpResendHint') }}
											</span>
										</p>

									</div>
								</div>
								<div class="flex items-center justify-between my-3 px-1">
									<label class="text-xs font-medium text-gray-400 dark:text-gray-300">{{ $t('profile.phone.verificationCode') }}</label>
									<button @click.prevent="wrongNumber"
										class="flex items-center text-xs font-semibold text-sky-600 dark:text-sky-500 hover:text-gray-500 dark:hover:text-gray-100">
										{{ $t('profile.phone.changeNumber') }}
										<svg class="ms-1 w-4 h-4" fill="none" viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg">
											<path fill="currentColor"
												d="M21,11H5.41l1.3-1.29A1,1,0,0,0,5.29,8.29l-3,3a1,1,0,0,0,0,1.42l3,3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L5.41,13H21a1,1,0,0,0,0-2Z">
											</path>
										</svg>
									</button>
								</div>
								<div dir="ltr" class="flex space-x-2 text-end justify-end">
									<input v-for="(digit, index) in otp" :key="index" v-model="otp[index]"
										:id="`otp-part-${index}`" :ref="el => inputRefs[index] = el" :class="errors && errors['otp']
											? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-600 focus:border-rose-400 focus:ring-rose-400/30'
											: 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-800 dark:text-white focus:border-amber-400 focus:ring-amber-400/30'"
										class="w-10 h-12 text-center rounded-xl border font-mono font-bold text-base outline-none focus:ring-2 transition-all duration-200"
										:maxlength="index === 0 ? OTP_LENGTH : 1" @beforeinput="handleBeforeInput($event, index)"
										@input="handleInput($event, index)"
										@change="handleOtpChange($event, index)"
										@keydown.backspace="handleBackspace($event, index)" @paste="handlePaste($event)"
										type="tel" @focus="handleFocus(index)" inputmode="numeric" pattern="[0-9]*"
										:autocomplete="index === 0 ? 'one-time-code' : 'off'" />
								</div>
								<span v-if="errors && errors['otp']" class="mt-3 text-rose-500 text-xs font-semibold">
									{{ errors["otp"][0] }}
								</span>
								<div class="flex items-center justify-between mt-8">
									<div>
										<button type="button" @click.prevent="verifyOtp" :disabled="verifyOtpLoading"
											class="inline-flex items-center justify-center gap-2 w-32 h-11 px-5 text-sm font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md">
											<svg v-if="verifyOtpLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
												<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											<svg v-else class="w-4 h-4" fill="none" viewBox="0 0 32 32" version="1.1">
												<path fill="currentColor"
													d="M24.972,12.288C24.608,7.657,20.723,4,16,4c-4.04,0-7.508,2.624-8.628,6.451C4.181,11.559,2,14.583,2,18 c0,4.411,3.589,8,8,8h13c3.859,0,7-3.14,7-7C30,15.851,27.93,13.148,24.972,12.288z M20.707,14.707l-5,5 C15.512,19.902,15.256,20,15,20s-0.512-0.098-0.707-0.293l-3-3c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0L15,17.586 l4.293-4.293c0.391-0.391,1.023-0.391,1.414,0S21.098,14.316,20.707,14.707z">
												</path>
											</svg>
											<span v-if="!verifyOtpLoading">{{ $t('profile.phone.submitCode') }}</span>
										</button>
									</div>
									<div>
										<div v-if="remainingTime && remainingTime > 0"
											class="text-sm font-medium text-gray-400 dark:text-gray-600" disabled>
											{{ formattedTime }} {{ $t('profile.phone.secondsToResend') }}
										</div>
										<button v-else @click="sendOtp" :disabled="sendOtpLoading"
											class="text-sm font-medium text-sky-400 underline underline-offset-4">{{ $t('profile.phone.resendCode') }}</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</ProfileMasterPage>
</template>

<script>
import ProfileMasterPage from "@/views/page/panel/profile/ProfileMasterPage.vue";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import CountryFlag from "vue-country-flag-next";
import countries from '@/assets/json/countries-with-number-length.json';
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { ref } from "vue";
import {
	isOtpComplete,
	normalizeOtpCode,
	splitOtpDigits,
	syncOtpInputElements,
	OTP_LENGTH,
} from "@/utils/otpInput";
export default {
	components: {
		ProfileMasterPage,
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption,
		CheckIcon,
		ChevronUpDownIcon,
		CountryFlag,
	},
	data() {
		return {
			startLoading: true,
			OTP_LENGTH,
			countries,
			selectedCountry: {},
			searchQuery: '',
			oldMobile: '',
			mobile: '',
			mobileVerifiedAt: null,
			isVerifyingCurrentMobile: false,
			verifyCurrentMobileLoading: false,
			sendOtpLoading: false,
			verifyOtpLoading: false,
			remainingTime: null,
			intervalId: null,
			isOtpSend: false,
			isNewCode: true,
			otp: Array(6).fill(""),
			inputRefs: [],
			otpAbortController: null,
			errors: ref(null),
		};
	},
	methods: {
		validateMobileInput() {
			this.mobile = this.mobile.replace(/\D/g, '');

			if (this.mobile.startsWith('0')) {
				this.mobile = this.mobile.substring(1);
			}
		},
		handleInput(event, index) {
			const digitsOnly = normalizeOtpCode(event.target.value, OTP_LENGTH);

			if (digitsOnly.length > 1) {
				this.applyOtpCode(digitsOnly);
				return;
			}

			if (/^[0-9]$/.test(digitsOnly)) {
				this.otp[index] = digitsOnly;
				if (index < OTP_LENGTH - 1) {
					this.inputRefs[index + 1].focus();
					this.inputRefs[index + 1].select();
				}
			} else {
				this.otp[index] = "";
				event.target.value = "";
			}

			if (isOtpComplete(this.otp) && index === this.otp.length - 1) {
				this.verifyOtp();
			}
		},

		handleOtpChange(event, index) {
			const digitsOnly = normalizeOtpCode(event.target.value, OTP_LENGTH);
			if (digitsOnly.length > 1) {
				this.applyOtpCode(digitsOnly);
			} else if (index === 0 && digitsOnly.length === 1 && !this.otp[0]) {
				this.otp[0] = digitsOnly;
			}
		},

		applyOtpCode(code) {
			const digits = normalizeOtpCode(code, OTP_LENGTH);
			if (digits.length !== OTP_LENGTH) return;

			this.otp = splitOtpDigits(digits, OTP_LENGTH);
			this.$nextTick(() => {
				syncOtpInputElements(this.inputRefs, this.otp);
				if (isOtpComplete(this.otp)) {
					this.verifyOtp();
				}
			});
		},

		handleBackspace(event, index) {
			if (event.key === 'Backspace') {
				this.otp[index] = "";

				if (index > 0) {
					this.inputRefs[index - 1].focus();
					this.inputRefs[index - 1].select();
				}

				event.preventDefault();
			}
		},

		handleFocus(index) {
			this.inputRefs[index].select();
		},
		handlePaste(event) {
			const pastedData = (event.clipboardData || window.clipboardData).getData('text');
			const digits = normalizeOtpCode(pastedData, OTP_LENGTH);
			if (digits.length === OTP_LENGTH) {
				this.applyOtpCode(digits);
			}
			event.preventDefault();
		},
		handleBeforeInput() {
			// TO DO
		},
		cancelOtpAutoFill() {
			if (this.otpAbortController) {
				this.otpAbortController.abort();
				this.otpAbortController = null;
			}
		},
		async getOtpFromSms() {
			// Web OTP API is only available on supporting browsers (mainly Chrome on Android)
			// served over HTTPS. On unsupported environments we simply skip auto-fill silently.
			if (!('OTPCredential' in window)) {
				return;
			}
			// Cancel any previously pending request before starting a new listener.
			this.cancelOtpAutoFill();
			this.otpAbortController = new AbortController();
			const controller = this.otpAbortController;
			try {
				const content = await navigator.credentials.get({
					otp: { transport: ['sms'] },
					signal: controller.signal
				});
				if (content && content.code) {
					this.applyOtpCode(content.code);
				}
			} catch (err) {
				// AbortError simply means we stopped listening (e.g. changed number / left the page).
				if (err && err.name !== 'AbortError') {
					console.debug('Web OTP auto-fill skipped:', err);
				}
			} finally {
				if (this.otpAbortController === controller) {
					this.otpAbortController = null;
				}
			}
		},

		async getMobileInfo() {
			try {
				this.startLoading = true;
				const response = await axiosInstance.post('/panel/profile/get-mobile-info');
				this.oldMobile = response.data.data.mobile;
				this.mobileVerifiedAt = response.data.data.mobile_verified_at;
			} catch (error) {
				console.error("Error loading mobile data:", error);
			} finally {
				this.startLoading = false;
			}
		},
		async sendOtp() {
			try {
				this.sendOtpLoading = this.verifyCurrentMobileLoading ? false : true;
				this.errors = null;
				if (this.intervalId) {
					clearInterval(this.intervalId);
				}
				const params = {};
				if (this.isVerifyingCurrentMobile) {
					params.is_verifying_current_mobile = this.isVerifyingCurrentMobile
				} else {
					params.country_dial_code = this.selectedCountry.dial_code,
						params.country_code = this.selectedCountry.code,
						params.mobile = this.mobile
				}

				const response = await axiosInstance.post('/panel/profile/send-otp', params);
				this.remainingTime = Math.floor((new Date(response.data.expired_at) - new Date()) / 1000);
				this.isNewCode = response.data.is_new_code
				this.intervalId = setInterval(() => {
					if (this.remainingTime > 0) {
						this.remainingTime--;
					} else {
						clearInterval(this.intervalId);
						this.intervalId = null;
					}
				}, 1000);
				this.isOtpSend = true;
				setTimeout(() => {
					document.getElementById('otp-part-0').focus();
				}, 100)
				this.getOtpFromSms();
			} catch (error) {
				if (error.response.status === 422) {
					this.errors = error.response.data.errors;
				}
				console.error("Error loading mobile data:", error);
			} finally {
				this.otp.fill("")
				this.sendOtpLoading = false;
				this.verifyCurrentMobileLoading = false;
			}
		},
		async verifyOtp() {
			try {
				this.verifyOtpLoading = true;
				let otpCode = this.otp.length > 0 && this.otp.join('') !== '' ? parseInt(this.otp.join(''), 10) : null
				this.errors = null;
				const params = {};
				params.otp = otpCode;
				if (this.isVerifyingCurrentMobile) {
					params.is_verifying_current_mobile = this.isVerifyingCurrentMobile
				} else {
					params.country_dial_code = this.selectedCountry.dial_code,
						params.country_code = this.selectedCountry.code,
						params.mobile = this.mobile
				}
				const response = await axiosInstance.post('/panel/profile/verify-otp', params);
				this.oldMobile = response.data.new_mobile
				this.mobileVerifiedAt = response.data.mobile_verified_at
				this.mobile = ''
				this.otp.fill("")

				const currentUser = this.$store.state.auth.status.userInfo || {};
				this.$store.commit('auth/setUserInfo', {
					...currentUser,
					mobile: response.data.new_mobile || currentUser.mobile,
					mobile_verified_at: response.data.mobile_verified_at,
				});

				let verifyNewMobileMessage = this.$t('profile.phone.changeSuccess')
				let verifyCurrentMobileMessage = this.$t('profile.phone.verifySuccess')
				toast.success(this.isVerifyingCurrentMobile ? verifyCurrentMobileMessage : verifyNewMobileMessage, {
					theme: "colored",
					hideProgressBar: false,
					rtl: localStorage.getItem("direction") == "rtl" ? true : false,
					bodyClassName: "font-YekanBakh",
					toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
					transition: toast.TRANSITIONS.BOUNCE,
					position: toast.POSITION.BOTTOM_RIGHT
				});
				this.wrongNumber();
				this.isVerifyingCurrentMobile = false;

				const redirect = this.$route.query.redirect;
				if (typeof redirect === 'string' && redirect.startsWith('/')) {
					this.$router.replace(redirect);
				} else if (this.$route.query.force_verify === '1') {
					this.$router.replace({ name: 'home' });
				}
			} catch (error) {
				if (error.response.status === 422) {
					this.errors = error.response.data.errors;
				}

				document.getElementById('otp-part-0').focus();

				console.error("Error validating OTP:", error);
			} finally {
				this.verifyOtpLoading = false;
			}
		},
		wrongNumber() {
			this.isOtpSend = false;
			this.remainingTime = null;
			this.isVerifyingCurrentMobile = false;
			this.cancelOtpAutoFill();
			if (this.intervalId) {
				clearInterval(this.intervalId);
			}
		},
		verifyCurrentMobile() {
			this.verifyCurrentMobileLoading = true;
			this.isVerifyingCurrentMobile = true;
			this.sendOtp();
			// this.isVerifyingCurrentMobile = false;
			// this.verifyCurrentMobileLoading = false;
		}
	},
	computed: {
		filteredCountries() {
			return this.countries.filter(country =>
				country.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
				country.dial_code.includes(this.searchQuery)
			);
		},
		formattedTime() {
			const minutes = String(Math.floor(this.remainingTime / 60)).padStart(2, '0');
			const seconds = String(this.remainingTime % 60).padStart(2, '0');
			return `${minutes}:${seconds}`;
		},
		forceVerifyMobile() {
			return this.$route.query.force_verify === '1' && !!this.oldMobile && !this.mobileVerifiedAt;
		}
	},
	mounted() {
		document.title = this.$t('profile.nav.phoneNumber');
		this.selectedCountry = this.countries.find(country => country.code === 'IR')
		this.getMobileInfo().then(() => {
			if (this.forceVerifyMobile) {
				this.verifyCurrentMobile();
			}
		});
	},
	beforeUnmount() {
		this.cancelOtpAutoFill();
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}
};
</script>
