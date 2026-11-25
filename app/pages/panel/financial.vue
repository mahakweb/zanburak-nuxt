<script setup>
definePageMeta({
  name: "panel-financial",
  middleware: ['auth'],
})
</script>

<template>
	<PanelMasterPage>
		<div class="space-y-5">
			<!-- Wallet Hero Skeleton -->
			<div v-if="paymentLoading && !mounted" class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-5 md:p-8 shadow-xl">
				<div class="pointer-events-none absolute -top-24 -end-16 h-64 w-64 rounded-full bg-amber-500/25 blur-3xl"></div>
				<div class="pointer-events-none absolute -bottom-24 -start-16 h-64 w-64 rounded-full bg-yellow-400/15 blur-3xl"></div>
				<div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
					<div class="flex items-center gap-4">
						<div class="animate-pulse bg-white/10 w-14 h-14 md:w-16 md:h-16 rounded-2xl shrink-0"></div>
						<div class="space-y-2">
							<div class="animate-pulse bg-white/10 h-5 w-24 rounded-full"></div>
							<div class="animate-pulse bg-white/10 h-3 w-32 rounded-full"></div>
							<div class="animate-pulse bg-white/10 h-8 w-40 rounded-xl"></div>
						</div>
					</div>
					<div class="rounded-2xl bg-white/95 dark:bg-gray-800/90 backdrop-blur p-4 md:p-5 shadow-lg ring-1 ring-white/10 md:min-w-[12rem] space-y-2.5">
						<div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-3 w-24 rounded-full"></div>
						<div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-20 rounded-xl"></div>
					</div>
				</div>
			</div>

			<!-- Wallet Hero -->
			<div v-else class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-5 md:p-8 shadow-xl">
				<div class="pointer-events-none absolute -top-24 -end-16 h-64 w-64 rounded-full bg-amber-500/25 blur-3xl"></div>
				<div class="pointer-events-none absolute -bottom-24 -start-16 h-64 w-64 rounded-full bg-yellow-400/15 blur-3xl"></div>
				<div class="pointer-events-none absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(circle at 2px 2px, #fff 1px, transparent 0); background-size: 26px 26px;"></div>
				<div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
					<div class="flex items-center gap-4">
						<div class="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-amber-400/15 border border-amber-400/25 text-amber-300 shrink-0">
							<svg class="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M15.0308 3.3303C13.0345 2.8899 10.9655 2.8899 8.96917 3.3303L8.55155 3.42243C5.76343 4.03749 3.56534 6.17136 2.87698 8.93119C2.37434 10.9465 2.37434 13.0536 2.87698 15.0688C3.56534 17.8286 5.76343 19.9625 8.55155 20.5776L8.96917 20.6697C10.9655 21.1101 13.0345 21.1101 15.0308 20.6697L15.4484 20.5776C18.2366 19.9625 20.4347 17.8286 21.123 15.0688C21.6257 13.0535 21.6257 10.9465 21.123 8.9312C20.4347 6.17136 18.2366 4.03749 15.4484 3.42243L15.0308 3.3303ZM17.9433 9.80778C18.3203 9.74389 18.702 9.72114 19.0807 9.73871C19.4968 9.75801 19.8243 10.0825 19.8802 10.4936C20.0163 11.4933 20.0163 12.5067 19.8802 13.5064C19.8243 13.9175 19.4968 14.242 19.0807 14.2613C18.702 14.2789 18.3203 14.2561 17.9433 14.1922L17.8694 14.1797C16.8874 14.0133 16.1287 13.3507 15.8722 12.5159C15.7684 12.1783 15.7684 11.8217 15.8722 11.4841C16.1287 10.6493 16.8874 9.98674 17.8694 9.82032L17.9433 9.80778ZM7.34559 8.97732C7.34559 8.64344 7.61739 8.37278 7.95269 8.37278L12 8.37278C12.3353 8.37278 12.6071 8.64344 12.6071 8.97732C12.6071 9.3112 12.3353 9.58186 12 9.58186H7.95269C7.61739 9.58186 7.34559 9.3112 7.34559 8.97732Z" fill="currentColor"></path>
							</svg>
						</div>
						<div>
							<span class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300 mb-2">
								{{ $t("panel.financial.wallet") }}
							</span>
							<p class="text-xs md:text-sm text-gray-300/80 mb-1">{{ $t("panel.financial.yourWalletBalance") }}</p>
							<p class="text-2xl md:text-3xl font-black text-white flex items-center gap-1.5" dir="ltr">
								{{ walletBalance.toLocaleString() }}
								<TomanIcon customClass="w-4 h-4 md:w-5 md:h-5 text-amber-400 shrink-0" />
							</p>
						</div>
					</div>
					<div class="rounded-2xl bg-white/95 dark:bg-gray-800/90 backdrop-blur p-4 md:p-5 shadow-lg ring-1 ring-white/10 md:min-w-[12rem]">
						<p class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{{ $t("panel.financialTransactions") }}</p>
						<p class="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white">{{ transactionStats.total.toLocaleString() }}</p>
					</div>
				</div>
			</div>

			<!-- Stats Skeleton -->
			<div v-if="paymentLoading && !mounted" class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
				<div v-for="n in 4" :key="n" class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
					<div class="flex items-center gap-3">
						<div class="animate-pulse bg-gray-200 dark:bg-gray-700 w-10 h-10 rounded-xl shrink-0"></div>
						<div class="min-w-0 flex-1 space-y-2">
							<div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 w-12 rounded-full"></div>
							<div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-3 w-16 rounded-full"></div>
						</div>
					</div>
				</div>
			</div>

			<!-- Stats -->
			<div v-else class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
				<div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z" fill="currentColor"></path></svg>
						</div>
						<div class="min-w-0">
							<p class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{{ transactionStats.paid }}</p>
							<p class="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{{ $t("panel.financial.filterDeposit") }}</p>
						</div>
					</div>
				</div>
				<div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM12 10.0854C12.5287 10.0854 12.9573 9.65681 12.9573 9.12812C12.9573 8.59942 12.5287 8.17083 12 8.17083C11.4713 8.17083 11.0427 8.59942 11.0427 9.12812C11.0427 9.65681 11.4713 10.0854 12 10.0854ZM12 10.8034C12.3965 10.8034 12.7179 11.1248 12.7179 11.5213V15.3505C12.7179 15.747 12.3965 16.0684 12 16.0684C11.6035 16.0684 11.282 15.747 11.282 15.3505V11.5213C11.282 11.1248 11.6035 10.8034 12 10.8034Z" fill="currentColor"></path></svg>
						</div>
						<div class="min-w-0">
							<p class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{{ transactionStats.pending }}</p>
							<p class="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{{ $t("panel.financial.attemptPending") }}</p>
						</div>
					</div>
				</div>
				<div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM10.7139 9.90158C10.4896 9.67727 10.1259 9.67727 9.90158 9.90158C9.67727 10.1259 9.67727 10.4896 9.90158 10.7139L11.1877 12L9.90158 13.2861C9.67727 13.5104 9.67727 13.8741 9.90158 14.0984C10.1259 14.3227 10.4896 14.3227 10.7139 14.0984L12 12.8123L13.2861 14.0984C13.5104 14.3227 13.8741 14.3227 14.0984 14.0984C14.3227 13.8741 14.3227 13.5104 14.0984 13.2861L12.8123 12L14.0984 10.7139C14.3227 10.4896 14.3227 10.1259 14.0984 9.90158C13.8741 9.67727 13.5104 9.67727 13.2861 9.90158L12 11.1877L10.7139 9.90158Z" fill="currentColor"></path></svg>
						</div>
						<div class="min-w-0">
							<p class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{{ transactionStats.failed }}</p>
							<p class="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{{ $t("panel.financial.filterFailed") }}</p>
						</div>
					</div>
				</div>
				<div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.19119 3.15595C7.30475 2.94802 6.38222 2.94802 5.49578 3.15595C4.33479 3.42828 3.42828 4.33479 3.15595 5.49578C2.94802 6.38222 2.94802 7.30475 3.15595 8.19119C3.42828 9.35218 4.33479 10.2587 5.49578 10.531C6.38222 10.739 7.30475 10.739 8.19119 10.531C9.35218 10.2587 10.2587 9.35218 10.531 8.19119C10.739 7.30475 10.739 6.38222 10.531 5.49578C10.2587 4.33479 9.35218 3.42828 8.19119 3.15595Z"></path></svg>
						</div>
						<div class="min-w-0">
							<p class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{{ transactionStats.total.toLocaleString() }}</p>
							<p class="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{{ $t("panel.financial.typeAll") }}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Transactions -->
			<div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-3 md:p-5">
			<div class="md:hidden">
				<Listbox v-model="selectedType" v-slot="{ open }" as="div" class="w-full">
					<div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
					<div class="mt-1 relative" :class="open ? ' z-20' : ''">
						<ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-amber-500 ' : ''"
							class="w-full flex justify-between items-center px-3 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-100 rounded-xl text-sm">
							<div class="flex items-center">
								<span class="flex items-center me-2">
									<svg width="22" height="22" viewBox="0 0 22 22" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z"
											stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
											stroke-linejoin="round"></path>
										<path opacity="0.4"
											d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833"
											stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
											stroke-linejoin="round"></path>
									</svg>
								</span>
								<span class="flex items-center line-clamp-1 font-semibold">{{ selectedType.title
								}}</span>
							</div>
							<div class="border-s border-current px-3 py-1.5">
								<svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''"
									viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor"
										stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round">
									</path>
								</svg>
							</div>
						</ListboxButton>
						<ListboxOptions
							class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-sm space-y-1 p-2 rounded-b-xl">
							<ListboxOption v-for="(type, index) in types" :key="index" @click.prevent="selectType(type)"
								:value="type" :disabled="false"
								class="flex items-center px-2 py-3 rounded-lg cursor-pointer"
								:class="selectedType == type ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'">
								<span v-html="type.icon"></span>
								<span class="ms-2 font-semibold">{{ type.title }}</span>
							</ListboxOption>
						</ListboxOptions>
					</div>
				</Listbox>
			</div>
			<TabGroup>
				<div class="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
					<TabList
						class="hidden md:inline-flex space-x-2 rtl:space-x-reverse rounded-xl bg-gray-100/80 dark:bg-gray-800/60 p-1 border border-gray-100 dark:border-gray-800">
						<Tab v-for="(type, index) in types" :key="index" @click.prevent="selectType(type)"
							class="ring-0 outline-none">
							<button :disabled="type.slug == selectedType.slug"
								class="w-full flex items-center rounded-lg py-2.5 px-3 text-sm font-semibold leading-5 ring-0 outline-none transition-colors"
								:class="[
									type.slug === selectedType.slug
										? 'bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 shadow-sm'
										: 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-900/60'
								]">
								<span class="me-2" v-html="type.icon"></span>
								<span>{{ type.title }}</span>
							</button>
						</Tab>
					</TabList>

					<div class="flex items-center space-x-3 rtl:space-x-reverse">
						<Listbox v-model="selectedFilter" v-slot="{ open }" as="div" class="w-44">
							<div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
							<div class="mt-1 relative" :class="open ? ' z-20' : ''">
								<ListboxButton
									:class="open ? 'rounded-b-none outline-none ring-0 text-amber-500 ' : ''"
									class="w-full flex justify-between items-center px-3 py-3 md:py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-100 rounded-xl text-xs">
									<div class="flex items-center">
										<!-- <span class="flex items-center me-2">
											<svg width="22" height="22" viewBox="0 0 22 22" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path
													d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z"
													stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
												<path opacity="0.4"
													d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833"
													stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
											</svg>
										</span> -->
										<span class="mx-1.5 flex items-center line-clamp-1 font-semibold">{{
											selectedFilter.title
										}}</span>
									</div>
									<div class="border-s border-current px-3 py-1.5">
										<svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''"
											viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873"
												stroke="currentColor" stroke-width="1.23077" stroke-linecap="round"
												stroke-linejoin="round">
											</path>
										</svg>
									</div>
								</ListboxButton>
								<ListboxOptions
									class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-xs space-y-1 p-2 rounded-b-xl">
									<ListboxOption v-for="(filter, index) in filters" :key="index"
										@click.prevent="selectFilter(filter)" :value="filter" :disabled="false"
										class="flex items-center px-2 py-3 md:py-2 rounded-lg cursor-pointer"
										:class="selectedFilter == filter ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'">
										<span v-html="filter.icon"></span>
										<span class="ms-2 font-semibold">{{ filter.title }}</span>
									</ListboxOption>
								</ListboxOptions>
							</div>
						</Listbox>
						<Listbox v-model="selectedSort" v-slot="{ open }" as="div" class="w-40">
							<div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
							<div class="mt-1 relative" :class="open ? ' z-20' : ''">
								<ListboxButton
									:class="open ? 'rounded-b-none outline-none ring-0 text-amber-500 ' : ''"
									class="w-full flex justify-between items-center px-3 py-3 md:py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-100 rounded-xl text-xs">
									<div class="flex items-center">
										<!-- <span class="flex items-center me-2">
											<svg width="22" height="22" viewBox="0 0 22 22" fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path
													d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z"
													stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
												<path opacity="0.4"
													d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833"
													stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
													stroke-linejoin="round"></path>
											</svg>
										</span> -->
										<span class="mx-1.5 flex items-center line-clamp-1 font-semibold">{{
											selectedSort.title
										}}</span>
									</div>
									<div class="border-s border-current px-3 py-1.5">
										<svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''"
											viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873"
												stroke="currentColor" stroke-width="1.23077" stroke-linecap="round"
												stroke-linejoin="round">
											</path>
										</svg>
									</div>
								</ListboxButton>
								<ListboxOptions
									class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-xs space-y-1 p-2 rounded-b-xl">
									<ListboxOption v-for="(srt, index) in sort" :key="index"
										@click.prevent="selectSort(srt)" :value="srt" :disabled="false"
										class="flex items-center px-2 py-3 md:py-2 rounded-lg cursor-pointer"
										:class="selectedSort == srt ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'">
										<span v-html="srt.icon"></span>
										<span class="ms-2 font-semibold">{{ srt.title }}</span>
									</ListboxOption>
								</ListboxOptions>
							</div>
						</Listbox>
					</div>
				</div>

				<TabPanels class="mt-4 md:mt-4">

					<div id="payments-list">
						<div v-if="paymentLoading" class="mt-4 space-y-2.5">
							<div v-for="n in 6" :key="n"
								class="relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40 shadow-sm">
								<span class="absolute inset-y-0 start-0 w-1 rounded-e-full bg-gray-200 dark:bg-gray-700"></span>
								<div class="p-3 md:p-4 ps-4 md:ps-5">
									<div class="flex items-center justify-between gap-3">
										<div class="flex items-center gap-2 min-w-0 flex-1">
											<div class="animate-pulse bg-gray-200 dark:bg-gray-700 w-7 h-7 rounded-full shrink-0"></div>
											<div class="min-w-0 flex-1 space-y-2">
												<div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-3.5 w-32 rounded-full"></div>
												<div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-3 w-24 rounded-full"></div>
											</div>
										</div>
										<div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-20 rounded-full shrink-0 hidden sm:block"></div>
										<div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-24 rounded-xl shrink-0"></div>
									</div>
								</div>
							</div>
						</div>
						<div v-else class="mt-4 space-y-2.5">
							<div v-if="!paymentsList || paymentsList.length == 0"
								class="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-10 text-center font-bold text-gray-500 dark:text-gray-400">
								{{ $t("panel.common.empty") }}
							</div>
							<!-- Desktop Table Header -->
							<div v-if="paymentsList && paymentsList.length > 0"
								class="hidden lg:grid lg:grid-cols-12 lg:gap-3 px-5 py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
								<div class="col-span-3 text-start">{{ $t("panel.financial.colPaymentId") }}</div>
								<div class="col-span-2 text-center">{{ $t("panel.financial.colTracking") }}</div>
								<div class="col-span-2 text-center">{{ $t("panel.financial.colAmount") }}</div>
								<div class="col-span-2 text-center">{{ $t("panel.financial.dateTime") }}</div>
								<div class="col-span-1 text-center">{{ $t("panel.financial.colMethod") }}</div>
								<div class="col-span-2 text-center">{{ $t("panel.financial.actions") || 'عملیات' }}</div>
							</div>
							<div v-for="(payment, index) in paymentsList" :key="index"
								class="relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40 shadow-sm">
								<span class="absolute inset-y-0 start-0 w-1 rounded-e-full"
									:class="{
										'bg-gradient-to-b from-emerald-400 to-green-500': payment.is_paid,
										'bg-gradient-to-b from-rose-400 to-red-500': !payment.is_paid && !payment.can_retry,
										'bg-gradient-to-b from-amber-400 to-orange-500': !payment.is_paid && payment.can_retry
									}"></span>
								<div class="p-3 md:p-4 ps-4 md:ps-5">
									<!-- Desktop (lg+) Row -->
									<div class="hidden lg:grid lg:grid-cols-12 lg:gap-3 lg:items-center text-sm">
										<div class="col-span-3 flex items-center gap-2 text-start min-w-0">
											<span class="shrink-0">
												<svg v-if="payment.is_paid" class="text-emerald-500 w-7 h-7" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z" fill="currentColor"></path></svg>
												<svg v-else-if="!payment.is_paid && payment.can_retry" class="text-amber-500 w-7 h-7" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM12 10.0854C12.5287 10.0854 12.9573 9.65681 12.9573 9.12812C12.9573 8.59942 12.5287 8.17083 12 8.17083C11.4713 8.17083 11.0427 8.59942 11.0427 9.12812C11.0427 9.65681 11.4713 10.0854 12 10.0854ZM12 10.8034C12.3965 10.8034 12.7179 11.1248 12.7179 11.5213V15.3505C12.7179 15.747 12.3965 16.0684 12 16.0684C11.6035 16.0684 11.282 15.747 11.282 15.3505V11.5213C11.282 11.1248 11.6035 10.8034 12 10.8034Z" fill="currentColor"></path></svg>
												<svg v-else class="text-rose-500 w-7 h-7" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM10.7139 9.90158C10.4896 9.67727 10.1259 9.67727 9.90158 9.90158C9.67727 10.1259 9.67727 10.4896 9.90158 10.7139L11.1877 12L9.90158 13.2861C9.67727 13.5104 9.67727 13.8741 9.90158 14.0984C10.1259 14.3227 10.4896 14.3227 10.7139 14.0984L12 12.8123L13.2861 14.0984C13.5104 14.3227 13.8741 14.3227 14.0984 14.0984C14.3227 13.8741 14.3227 13.5104 14.0984 13.2861L12.8123 12L14.0984 10.7139C14.3227 10.4896 14.3227 10.1259 14.0984 9.90158C13.8741 9.67727 13.5104 9.67727 13.2861 9.90158L12 11.1877L10.7139 9.90158Z" fill="currentColor"></path></svg>
											</span>
											<span class="font-semibold text-gray-800 dark:text-gray-100 truncate">{{ payment.reference_id }}</span>
										</div>
										<div class="col-span-2 text-center text-gray-600 dark:text-gray-300 font-mono text-xs">{{ payment.tracking_number ? payment.tracking_number : "----------" }}</div>
										<div class="col-span-2 flex items-center justify-center font-bold text-gray-800 dark:text-gray-100">
											{{ (payment.amount).toLocaleString() }}
											<TomanIcon customClass="shrink-0 ms-1 w-3.5 h-3.5" />
										</div>
										<div class="col-span-2 text-center text-gray-600 dark:text-gray-300 text-xs">
											{{ new Date(payment.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\//g, '-').replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ') }}
										</div>
										<div class="col-span-1 flex flex-col items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200">
											<span v-if="payment.payment_method === 'wallet'">{{ $t("panel.financial.wallet") }}</span>
											<span v-else-if="payment.payment_method === 'wallet_bank'" class="text-center leading-4">
												{{ $t("panel.financial.walletAndGateway") }}
												<span v-if="Number(payment.wallet_paid_amount) > 0" class="mt-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">
													{{ Number(payment.wallet_paid_amount).toLocaleString() }} + {{ Number(payment.gateway_paid_amount).toLocaleString() }}
												</span>
											</span>
											<span v-else class="flex items-center">
												<img
													v-if="gatewayLabel(payment.driver, payment.gateway_variant).icon"
													:src="gatewayLabel(payment.driver, payment.gateway_variant).icon"
													:alt="gatewayLabel(payment.driver, payment.gateway_variant).name"
													:title="gatewayLabel(payment.driver, payment.gateway_variant).name"
													class="me-1 h-5 w-5 shrink-0 rounded object-contain"
													loading="lazy"
												/>
												<span>{{ $t("panel.financial.online") }}</span>
											</span>
										</div>
										<div class="col-span-2 flex items-center justify-center gap-1.5">
											<button v-if="payment.can_retry" @click.prevent="openPaymentDetailsModal(payment)"
												class="inline-flex items-center justify-center gap-1 h-8 rounded-xl px-3 text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 shadow-sm hover:shadow-md transition-all active:scale-95">
												{{ $t("panel.financial.retryPayment") }}
											</button>
											<button v-else @click.prevent="openPaymentDetailsModal(payment)"
												class="inline-flex items-center justify-center gap-1 h-8 rounded-xl px-3 text-xs font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
												{{ $t("panel.financial.viewInvoice") }}
											</button>
										</div>
									</div>

									<!-- Mobile & Tablet (< lg) Card Layout -->
									<div class="lg:hidden space-y-3">
										<div class="flex items-start justify-between gap-3">
											<div class="flex items-center gap-2 min-w-0">
												<span class="shrink-0">
													<svg v-if="payment.is_paid" class="text-emerald-500 w-6 h-6" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z" fill="currentColor"></path></svg>
													<svg v-else-if="!payment.is_paid && payment.can_retry" class="text-amber-500 w-6 h-6" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM12 10.0854C12.5287 10.0854 12.9573 9.65681 12.9573 9.12812C12.9573 8.59942 12.5287 8.17083 12 8.17083C11.4713 8.17083 11.0427 8.59942 11.0427 9.12812C11.0427 9.65681 11.4713 10.0854 12 10.0854ZM12 10.8034C12.3965 10.8034 12.7179 11.1248 12.7179 11.5213V15.3505C12.7179 15.747 12.3965 16.0684 12 16.0684C11.6035 16.0684 11.282 15.747 11.282 15.3505V11.5213C11.282 11.1248 11.6035 10.8034 12 10.8034Z" fill="currentColor"></path></svg>
													<svg v-else class="text-rose-500 w-6 h-6" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM10.7139 9.90158C10.4896 9.67727 10.1259 9.67727 9.90158 9.90158C9.67727 10.1259 9.67727 10.4896 9.90158 10.7139L11.1877 12L9.90158 13.2861C9.67727 13.5104 9.67727 13.8741 9.90158 14.0984C10.1259 14.3227 10.4896 14.3227 10.7139 14.0984L12 12.8123L13.2861 14.0984C13.5104 14.3227 13.8741 14.3227 14.0984 14.0984C14.3227 13.8741 14.3227 13.5104 14.0984 13.2861L12.8123 12L14.0984 10.7139C14.3227 10.4896 14.3227 10.1259 14.0984 9.90158C13.8741 9.67727 13.5104 9.67727 13.2861 9.90158L12 11.1877L10.7139 9.90158Z" fill="currentColor"></path></svg>
												</span>
												<div class="min-w-0">
													<p class="text-xs text-gray-500 dark:text-gray-400">{{ $t("panel.financial.colPaymentId") }}</p>
													<p class="font-semibold text-gray-800 dark:text-gray-100 truncate">{{ payment.reference_id }}</p>
												</div>
											</div>
											<div class="text-end shrink-0">
												<p class="text-xs text-gray-500 dark:text-gray-400">{{ $t("panel.financial.colAmount") }}</p>
												<p class="font-bold text-gray-900 dark:text-white flex items-center justify-end">
													{{ (payment.amount).toLocaleString() }}
													<TomanIcon customClass="shrink-0 ms-1 w-3.5 h-3.5" />
												</p>
											</div>
										</div>
										<div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
											<div><span class="text-gray-400">{{ $t("panel.financial.colTracking") }}:</span> {{ payment.tracking_number ? payment.tracking_number : "----------" }}</div>
											<div class="text-end"><span class="text-gray-400">{{ $t("panel.financial.colMethod") }}:</span> {{ paymentMethodText(payment.payment_method) }}</div>
										</div>
										<div class="flex items-center justify-between gap-2">
											<p class="text-xs text-gray-500 dark:text-gray-400">{{ new Date(payment.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\//g, '-').replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ') }}</p>
											<button v-if="payment.can_retry" @click.prevent="openPaymentDetailsModal(payment)"
												class="inline-flex items-center justify-center h-8 rounded-xl px-3 text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 shadow-sm">
												{{ $t("panel.financial.retryPayment") }}
											</button>
											<button v-else @click.prevent="openPaymentDetailsModal(payment)"
												class="inline-flex items-center justify-center h-8 rounded-xl px-3 text-xs font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
												{{ $t("panel.financial.viewInvoice") }}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- </TabPanel> -->
				</TabPanels>
				<div v-if="paymentsList && paymentsList.length > 0 && pagination.last_page > 1"
					class="mt-6 flex items-center justify-center">
					<PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
				</div>
			</TabGroup>
			</div>
		</div>

		<!-- Start Payment Details Modal -->

		<BottomSheetDrawer v-model="isOpenPaymentDetailsModal" :initialHeight="0.85" :maxHeight="0.95" :minHeight="0.6"
			:autoCloseOnMin="!retryPayLoading" :closeOnBackdrop="!retryPayLoading" :lockScroll="true"
			:panelClass="'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 rounded-t-3xl lg:rounded-b-3xl lg:w-[40rem] shadow-2xl'"
			:contentClass="'px-4 pb-4 overflow-auto custom-scrollbar text-center'"
			:backdropClass="'bg-black/50 backdrop-blur-sm'">
			<div class="relative overflow-hidden">
				<button
					v-if="paymentSheetStep === 'gateway'"
					type="button"
					class="absolute top-1 start-1 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-800 shadow-sm disabled:opacity-40 dark:bg-gray-800 dark:text-gray-100"
					:disabled="retryPayLoading"
					@click="paymentSheetStep = 'invoice'"
				>
					<svg class="h-4 w-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
					</svg>
				</button>
				<Transition :name="paymentSheetStep === 'gateway' ? 'pay-step-forward' : 'pay-step-back'" mode="out-in">
					<div v-if="paymentSheetStep === 'invoice'" key="invoice" class="relative">
				<div class="bg-gray-100 dark:bg-gray-200 p-1 mb-3.5 mx-auto w-16 h-16 rounded-3xl">
					<svg v-if="selectedPayment.is_paid" class="text-green-500 w-full h-full" viewBox="0 0 24 24"
						fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd"
							d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z"
							fill="currentColor"></path>
					</svg>
					<svg v-else-if="selectedPayment.can_retry" class="text-gray-600 dark:text-gray-500 w-full h-full"
						viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd"
							d="M7.10711 2.87868C7.66972 2.31607 8.43278 2 9.22843 2H14.7716C15.5672 2 16.3303 2.31607 16.8929 2.87868L21.1213 7.10711C21.6839 7.66972 22 8.43278 22 9.22843V14.7716C22 15.5672 21.6839 16.3303 21.1213 16.8929L16.8929 21.1213C16.3303 21.6839 15.5672 22 14.7716 22H9.22843C8.43278 22 7.66972 21.6839 7.10711 21.1213L2.87868 16.8929C2.31607 16.3303 2 15.5672 2 14.7716V9.22843C2 8.43278 2.31607 7.66972 2.87868 7.10711L7.10711 2.87868ZM13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8V13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13V8ZM13 15.9888C13 15.4365 12.5523 14.9888 12 14.9888C11.4477 14.9888 11 15.4365 11 15.9888V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V15.9888Z"
							fill="currentColor"></path>
					</svg>
					<svg v-else class="text-red-500 w-full h-full" viewBox="0 0 24 24" fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd"
							d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM10.7139 9.90158C10.4896 9.67727 10.1259 9.67727 9.90158 9.90158C9.67727 10.1259 9.67727 10.4896 9.90158 10.7139L11.1877 12L9.90158 13.2861C9.67727 13.5104 9.67727 13.8741 9.90158 14.0984C10.1259 14.3227 10.4896 14.3227 10.7139 14.0984L12 12.8123L13.2861 14.0984C13.5104 14.3227 13.8741 14.3227 14.0984 14.0984C14.3227 13.8741 14.3227 13.5104 14.0984 13.2861L12.8123 12L14.0984 10.7139C14.3227 10.4896 14.3227 10.1259 14.0984 9.90158C13.8741 9.67727 13.5104 9.67727 13.2861 9.90158L12 11.1877L10.7139 9.90158Z"
							fill="currentColor"></path>
					</svg>
				</div>
			<!-- status -->
			<div class="mt-1 mb-2">
				<p v-if="selectedPayment.is_paid"
					class="text-sm font-semibold text-green-600 dark:text-green-800 text-center">
					{{ $t("panel.financial.statusPaid") }}
				</p>
				<p v-else-if="!selectedPayment.can_retry" class="text-sm font-semibold text-rose-700 text-center">
					{{ $t("panel.financial.statusExpired") }}
				</p>
				<p v-else class="text-sm font-semibold text-gray-900 text-center">
					{{ $t("panel.financial.statusUnpaid") }}
				</p>
			</div>
			<div class="text-start">
				<div class="space-y-3">
					<!-- Order Items -->
					<div
						class="bg-gray-50 dark:bg-gray-800/80 rounded-2xl p-3 md:p-4 border border-gray-100 dark:border-gray-700/60 text-xs font-semibold text-gray-700 dark:text-gray-200">
						<div v-for="(item, i) in selectedPayment.items" :key="i" class="">
							<div v-if="item.payable_type === 'Course'" class="flex items-center justify-between">
								<span class="">{{ i + 1 }}.&nbsp; {{ $t("panel.financial.itemCourse") }} {{ item.payable.title
								}}</span>
								<span class="ms-2 whitespace-nowrap flex items-center">{{
									item.final_price.toLocaleString() }}
									<TomanIcon customClass="ms-1 w-3.5 h-3.5" />
								</span>
							</div>
							<div v-if="item.payable_type === 'Path'" class="flex items-center justify-between">
								<span class="">{{ i + 1 }}.&nbsp; {{ $t("panel.financial.itemPath") }} {{ item.payable.title
								}}</span>
								<span class="ms-2 whitespace-nowrap flex items-center">{{
									item.final_price.toLocaleString() }}
									<TomanIcon customClass="ms-1 w-3.5 h-3.5" />
								</span>
							</div>
							<div v-if="item.payable_type === 'Plan'" class="flex items-center justify-between">
								<span class="">{{ i + 1 }}.&nbsp; {{ $t("panel.financial.itemPlan") }} {{ item.payable.title
								}}</span>
								<span class="ms-2 whitespace-nowrap flex items-center">{{
									item.final_price.toLocaleString() }}
									<TomanIcon customClass="ms-1 w-3.5 h-3.5" />
								</span>
							</div>
							<hr class="border-t border-gray-200 dark:border-gray-700 border-dashed my-2.5">
						</div>
						<div class="flex items-center justify-between mt-2">
							<span>{{ $t("panel.financial.dateTime") }}</span>
							<span class="ms-2 whitespace-nowrap flex items-center">
								<span>
									{{ new
										Date(selectedPayment.created_at).toLocaleDateString('fa-IR',
											{
												year: 'numeric',
												month: 'short',
												day: '2-digit',
											}).replace(/\//g, '-') }}
								</span>
								<span class="mx-1">|</span>
								<span class="">
									{{ new
										Date(selectedPayment.created_at).toLocaleTimeString('fa-IR',
											{
												hour: '2-digit',
												minute: '2-digit',
												hour12: true,
											}).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ') }}
								</span>
							</span>
						</div>
						<div class="flex items-center justify-between mt-2">
							<span>{{ $t("panel.financial.subtotal") }}</span>
							<span class="ms-2 whitespace-nowrap flex items-center">{{
								(selectedPayment.amount +
									selectedPayment.discount_amount).toLocaleString() }}
								<TomanIcon customClass="ms-1 w-3.5 h-3.5" />
							</span>
						</div>
						<div class="flex items-center justify-between mt-2">
							<span>{{ $t("panel.financial.discount") }}</span>
							<span class="ms-2 whitespace-nowrap flex items-center">{{
								selectedPayment.discount_amount.toLocaleString() }}
								<TomanIcon customClass="ms-1 w-3.5 h-3.5" />
							</span>
						</div>
						<div v-if="walletSplitActive" class="flex items-center justify-between mt-2">
							<span>{{ $t("cart.fromWallet") }}</span>
							<span class="ms-2 whitespace-nowrap">{{ walletSplitAmount.toLocaleString() }}</span>
						</div>
						<div v-if="walletSplitActive" class="flex items-center justify-between mt-2">
							<span>{{ $t("cart.payAtGateway") }}</span>
							<span class="ms-2 whitespace-nowrap">{{ gatewaySplitAmount.toLocaleString() }}</span>
						</div>
						<div class="flex items-center justify-between text-sm font-bold text-gray-900 dark:text-white mt-2">
							<span class="flex items-center gap-1">{{ $t("panel.financial.finalAmount") }}
								<GatewayFeeHelp
									v-if="selectedPayment.can_retry && showRetryGatewayFee"
									:visible="showRetryGatewayFee"
									:items="retryPricing.items"
									:commission-percent="retryPricing.commissionPercent"
								/>
							</span>
							<span class="ms-2 whitespace-nowrap flex items-center">
								<span v-if="selectedPayment.can_retry && paymentMethodForRetry === 'wallet'">{{ Number(retryPricing.baseTotal || selectedPayment.amount || 0).toLocaleString() }}</span>
								<CartAnimatedPrice
									v-else-if="selectedPayment.can_retry"
									:base-price="retryPricing.baseTotal"
									:charged-price="retryPayableAmount"
									:has-fee="showRetryGatewayFee"
								/>
								<template v-else>{{ selectedPayment.amount.toLocaleString() }}</template>
								<TomanIcon customClass="ms-1 w-3.5 h-3.5" />
							</span>
						</div>
					</div>

					<!-- Warning -->
					<div v-if="selectedPayment.can_retry"
						class="flex items-start bg-amber-100 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 rounded-xl border border-amber-200/60 dark:border-amber-800/40 p-3 text-xs font-medium leading-4">
						<svg class="shrink-0 w-4 h-4 me-1" viewBox="0 0 24 24" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd"
								d="m3.517 17 7.058-11.783a1.667 1.667 0 0 1 2.85 0L20.483 17a1.667 1.667 0 0 1-1.425 2.5H4.942A1.666 1.666 0 0 1 3.517 17ZM12 9a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Zm-1 7a1 1 0 0 1 1-1h.008a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z"
								fill="currentColor"></path>
						</svg>
						<p class="">
							{{ $t("panel.financial.validUntilPrefix") }}
							<b class="font-semibold">&nbsp;
								{{ new Date(selectedPayment.expired_at).toLocaleDateString('fa-IR',
									{
										year: 'numeric',
										month: 'short',
										day: '2-digit',
									}).replace(/\//g, '-') }}
								&nbsp; {{ $t("panel.financial.atHour") }} &nbsp;
								{{ new Date(selectedPayment.expired_at).toLocaleTimeString('fa-IR',
									{
										hour: '2-digit',
										minute: '2-digit',
										hour12: true,
									}) }}
								&nbsp;
							</b> {{ $t("panel.financial.validUntilSuffix") }}
						</p>
					</div>
				</div>

				<!-- Show payment method when not retryable (paid or expired) -->
				<div v-if="!selectedPayment.can_retry" class="my-2 text-xs font-semibold text-gray-700">
					{{ $t("panel.financial.paymentMethodLabel") }}
					<span v-if="selectedPayment.payment_method === 'wallet'"
						class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-200">{{ $t("panel.financial.wallet") }}</span>
					<span v-else-if="selectedPayment.payment_method === 'wallet_bank'"
						class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-200">{{ $t("panel.financial.walletAndGateway") }}</span>
					<span v-else class="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 dark:bg-white">{{ $t("panel.financial.online") }}</span>
				</div>
				<div v-if="Number(selectedPayment.wallet_paid_amount) > 0" class="my-2 space-y-1 text-xs text-gray-700 dark:text-gray-200">
					<div class="flex items-center justify-between">
						<span>{{ $t("panel.financial.walletPart") }}</span>
						<span class="font-semibold">{{ Number(selectedPayment.wallet_paid_amount).toLocaleString() }}</span>
					</div>
					<div class="flex items-center justify-between">
						<span>{{ $t("panel.financial.gatewayPart") }}</span>
						<span class="font-semibold">{{ Number(selectedPayment.gateway_paid_amount).toLocaleString() }}</span>
					</div>
				</div>

				<div v-if="selectedPayment.can_retry" class="my-3 space-y-2">
					<div class="flex items-center justify-between">
						<p class="text-xs font-semibold text-gray-700">{{ $t("panel.financial.paymentMethodLabel") }}</p>
						<div class="grid grid-cols-2 gap-2 bg-white dark:bg-gray-800 rounded-lg p-1">
							<button type="button"
								:class="[paymentMethodForRetry === 'bank' ? 'bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-700' : 'text-gray-600 dark:text-gray-300']"
								class="relative flex items-center justify-center cursor-pointer rounded-lg h-7 px-3 focus:outline-none"
								@click="paymentMethodForRetry = 'bank'">
								<span class="text-xs font-semibold">{{ $t("panel.financial.onlineGateway") }}</span>
							</button>
							<button type="button"
								:class="[paymentMethodForRetry === 'wallet' ? 'bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-700' : 'text-gray-600 dark:text-gray-300']"
								class="relative flex items-center justify-center cursor-pointer rounded-lg h-7 px-3 focus:outline-none"
								@click="paymentMethodForRetry = 'wallet'">
								<span class="text-xs font-semibold">{{ $t("panel.financial.wallet") }}</span>
							</button>
						</div>
					</div>
					<div v-if="paymentMethodForRetry === 'wallet'" class="text-xs flex items-center justify-between">
						<span class="text-gray-600 dark:text-gray-300">{{ $t("panel.financial.yourWalletBalance") }}</span>
						<span
							:class="walletSufficientForRetry ? 'text-emerald-700' : (walletBalance > 0 ? 'text-amber-700' : 'text-rose-600')"
							class="font-bold flex items-center">
							{{ walletBalance.toLocaleString() }}
							<TomanIcon customClass="ms-1 w-3.5 h-3.5" />
						</span>
					</div>
					<p v-if="walletSplitActive" class="text-xs leading-6 text-amber-800 dark:text-amber-200 text-start">
						{{ $t('cart.walletPartialHint', { wallet: walletBalance.toLocaleString(), remainder: gatewaySplitAmount.toLocaleString() }) }}
					</p>
					<p v-else-if="paymentMethodForRetry === 'wallet' && retryPayableAmount > 0 && walletBalance <= 0" class="text-xs leading-6 text-rose-600 text-start">
						{{ $t('cart.walletInsufficient') }}
					</p>
					<div v-if="paymentMethodForRetry === 'bank'" class="space-y-2">
						<p class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ $t("panel.financial.selectGateway") }}</p>
						<PaymentGatewayList v-model="selectedGateway" :gateways="availableGateways" />

						<!-- Installment Phone Warning -->
						<div v-if="isCurrentGatewayInstallment && isRetryFullyInstallment"
							class="flex items-start bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 rounded-xl p-3 text-xs font-medium leading-5">
							<svg class="shrink-0 w-4 h-4 me-1.5 mt-0.5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd"
									d="m3.517 17 7.058-11.783a1.667 1.667 0 0 1 2.85 0L20.483 17a1.667 1.667 0 0 1-1.425 2.5H4.942A1.666 1.666 0 0 1 3.517 17ZM12 9a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Zm-1 7a1 1 0 0 1 1-1h.008a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z"
									fill="currentColor"></path>
							</svg>
							<div class="space-y-1">
								<p class="font-bold text-amber-800 dark:text-amber-300">
									{{ $t('panel.financial.installmentMobileWarningTitle') }}
									<span v-if="currentUser?.mobile" class="ms-1 font-mono font-normal">({{ $t('panel.financial.installmentMobileWarningRegistered') }}: {{ currentUser.mobile }})</span>
								</p>
								<p class="text-xs text-amber-800/90 dark:text-amber-200/90">
									{{ $t('panel.financial.installmentMobileWarningDesc') }}
								</p>
							</div>
						</div>

						<!-- Ineligible items notice -->
						<div v-else-if="isCurrentGatewayInstallment && !isRetryFullyInstallment"
							class="flex items-start bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 rounded-xl p-3 text-xs font-medium leading-5">
							<svg class="shrink-0 w-4 h-4 me-1.5 mt-0.5 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd"
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
									fill="currentColor"></path>
							</svg>
							<p>{{ $t('panel.financial.installmentIneligibleNotice') }}</p>
						</div>
					</div>
				</div>

				

				<!-- Attempts -->
				<p class="mb-1 mt-4 text-xs font-semibold text-gray-700">{{ $t("panel.financial.attemptsHistory") }}</p>
				<div class="space-y-1 text-xs font-semibold text-gray-700 dark:text-gray-900">
					<div v-for="(attempt, i) in selectedPayment.attempts" :key="i"
						class="relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-200">
						<span class="absolute inset-y-0 start-0 w-1 rounded-e-full" :class="{
							'bg-gradient-to-b from-emerald-400 to-green-500': attempt.status === 'paid',
							'bg-gradient-to-b from-rose-400 to-red-500': attempt.status === 'failed' || (attempt.status === 'pending' && !selectedPayment.can_retry),
							'bg-gradient-to-b from-amber-400 to-orange-500': attempt.status === 'pending' && selectedPayment.can_retry,
						}"></span>
						<div class="p-2 md:p-3 ps-3 md:ps-4">
							<div class="">
								<span>
									{{ $t("panel.financial.dateLabel") }} &nbsp;&nbsp;
									{{ new Date(attempt.updated_at).toLocaleDateString('fa-IR',
										{
											year: 'numeric',
											month: 'short',
											day: '2-digit',
										}).replace(/\//g, '-') }}
								</span>
								<span class="ms-2">
									{{ $t("panel.financial.timeLabel") }} &nbsp;&nbsp;
									{{ new Date(attempt.updated_at).toLocaleTimeString('fa-IR',
										{
											hour: '2-digit',
											minute: '2-digit',
											hour12: true,
										}).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ') }}
								</span>
							</div>
							<div class="ms-1 flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200">
								<img
									v-if="gatewayLabel(attempt.gateway).icon"
									:src="gatewayLabel(attempt.gateway).icon"
									:alt="gatewayLabel(attempt.gateway).name"
									class="me-1 h-5 w-5 shrink-0 rounded object-contain"
									loading="lazy"
								/>
								{{ gatewayLabel(attempt.gateway).name || attempt.gateway || '—' }}
							</div>
						</div>
						<hr class="border-t border-gray-300 dark:border-gray-400 border-dashed my-1.5">
						<div class="flex items-center justify-between">
							<div class="">{{ $t("panel.financial.attemptRef") }} &nbsp;&nbsp; {{ attempt.attempt_reference }}</div>
							<div class="ms-1">{{ $t("panel.financial.statusLabel") }} &nbsp;&nbsp; {{ attempt.status === 'paid' ?
								$t("panel.financial.attemptSuccess") :
								(attempt.status === 'failed' ? $t("panel.financial.attemptFailed") : (attempt.status ===
									'pending' && selectedPayment.can_retry
									? $t("panel.financial.attemptPending") : $t("panel.financial.attemptFailed"))) }}
							</div>
						</div>
					</div>
				</div>
			</div>
					</div>
					<div v-else key="gateway" class="space-y-4 px-1 pt-12 text-start">
						<p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ $t('cart.walletInsufficientTitle') }}</p>
						<p class="text-xs leading-6 text-gray-600 dark:text-gray-300">
							{{ $t('cart.walletInsufficientDesc', { wallet: walletBalance.toLocaleString(), remainder: gatewaySplitAmount.toLocaleString() }) }}
						</p>
						<div :class="retryPayLoading ? 'pointer-events-none opacity-60' : ''">
							<p class="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-200">{{ $t('cart.selectGateway') }}</p>
							<PaymentGatewayList v-model="walletSplitGateway" :gateways="directBankGateways" />
						</div>
						<button
							type="button"
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70"
							:disabled="retryPayLoading || !walletSplitGateway"
							@click="confirmWalletSplit"
						>
							<svg v-if="retryPayLoading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
							</svg>
							{{ $t('cart.walletInsufficientConfirm') }}
						</button>
					</div>
				</Transition>
			</div>
		</BottomSheetDrawer>

		<!-- End Payment Details Modal -->

	</PanelMasterPage>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import PanelMasterPage from "@/views/page/panel/layouts/PanelMasterPage.vue";
import TomanIcon from "@/components/icon/TomanIcon.vue";
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import PaymentGatewayList from "@/views/components/payment/PaymentGatewayList.vue";
import { buildPaymentGateways, calculateCartGatewayPricing, cartHasInstallmentEligibleItems, filterDirectBankGateways, filterGatewaysForCart, findGatewayById, findGatewayByVariant, getDefaultGateway, findGatewayByDriver, gatewayPayPayload, getCartItemTitle, isDigipayFeeGateway, isInstallmentGateway, isCartFullyInstallmentEligible, fetchGatewayCommissions } from "@/config/paymentGateways";
import GatewayFeeHelp from "@/views/components/cart/GatewayFeeHelp.vue";
import CartAnimatedPrice from "@/views/components/cart/CartAnimatedPrice.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { TabGroup, TabList, Tab, TabPanels, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

export default {
		setup() { return { authStore: useAuthStore() } },
	components: {
		PanelMasterPage,
		TomanIcon,
		PaginationComponent,
		BottomSheetDrawer,
		PaymentGatewayList,
		GatewayFeeHelp,
		CartAnimatedPrice,
		TabGroup,
		TabList,
		Tab,
		TabPanels,
		// TabPanel,
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption
	},
	data() {
		const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
		const typeSlugFromUrl = urlParams.get('type') || 'all';
		const filterSlugFromUrl = urlParams.get('filter') || 'all';
		const sortSlugFromUrl = urlParams.get('sort') || 'newest';
		const types = {
			all: {
				title: this.$t("panel.financial.typeAll"),
				english_title: "All Transactions",
				slug: "all",
				icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M8.19119 3.15595C7.30475 2.94802 6.38222 2.94802 5.49578 3.15595C4.33479 3.42828 3.42828 4.33479 3.15595 5.49578C2.94802 6.38222 2.94802 7.30475 3.15595 8.19119C3.42828 9.35218 4.33479 10.2587 5.49578 10.531C6.38222 10.739 7.30475 10.739 8.19119 10.531C9.35218 10.2587 10.2587 9.35218 10.531 8.19119C10.739 7.30475 10.739 6.38222 10.531 5.49578C10.2587 4.33479 9.35218 3.42828 8.19119 3.15595Z"
								fill="currentColor"></path>
							<path
								d="M8.19119 13.469C7.30475 13.261 6.38222 13.261 5.49578 13.469C4.33479 13.7413 3.42828 14.6478 3.15595 15.8088C2.94802 16.6952 2.94802 17.6178 3.15595 18.5042C3.42828 19.6652 4.33479 20.5717 5.49578 20.8441C6.38222 21.052 7.30475 21.052 8.19119 20.8441C9.35218 20.5717 10.2587 19.6652 10.531 18.5042C10.739 17.6178 10.739 16.6952 10.531 15.8088C10.2587 14.6478 9.35218 13.7413 8.19119 13.469Z"
								fill="currentColor"></path>
							<path
								d="M18.5042 3.15595C17.6178 2.94802 16.6952 2.94802 15.8088 3.15595C14.6478 3.42828 13.7413 4.33479 13.469 5.49578C13.261 6.38222 13.261 7.30475 13.469 8.19119C13.7413 9.35218 14.6478 10.2587 15.8088 10.531C16.6952 10.739 17.6178 10.739 18.5042 10.531C19.6652 10.2587 20.5717 9.35218 20.8441 8.19119C21.052 7.30475 21.052 6.38222 20.8441 5.49578C20.5717 4.33479 19.6652 3.42828 18.5042 3.15595Z"
								fill="currentColor"></path>
							<path
								d="M18.5042 13.469C17.6178 13.261 16.6952 13.261 15.8088 13.469C14.6478 13.7413 13.7413 14.6478 13.469 15.8088C13.261 16.6952 13.261 17.6178 13.469 18.5042C13.7413 19.6652 14.6478 20.5717 15.8088 20.8441C16.6952 21.052 17.6178 21.052 18.5042 20.8441C19.6652 20.5717 20.5717 19.6652 20.8441 18.5042C21.052 17.6178 21.052 16.6952 20.8441 15.8088C20.5717 14.6478 19.6652 13.7413 18.5042 13.469Z"
								fill="currentColor"></path>
						</svg>`
			},
			course: {
				title: this.$t("panel.financial.typeCourse"),
				english_title: "Course",
				slug: "course",
				icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd"
								d="M13.4822 3.95133C15.51 4.42655 17.1316 5.91484 17.6838 7.83499L18.458 7.37444C20.4352 6.1981 23 7.55122 23 9.77073L23 14.5944C23 16.6951 20.6776 18.0613 18.7037 17.1219L17.5485 16.572C16.8965 18.2938 15.3643 19.6076 13.4822 20.0487C10.9345 20.6457 8.24347 20.653 5.69246 20.0551C3.59198 19.5629 1.96547 17.9809 1.49366 15.9713L1.42818 15.6925C0.857273 13.2608 0.857274 10.7392 1.42818 8.30754L1.49366 8.02865C1.96547 6.0191 3.59198 4.43714 5.69246 3.94488C8.24347 3.34704 10.9345 3.35426 13.4822 3.95133ZM17.9906 14.8481C18.3134 13.1277 18.3414 11.3698 18.0745 9.64278L19.4213 8.84156C20.188 8.38543 21.1825 8.9101 21.1825 9.77073L21.1825 14.5944C21.1825 15.4089 20.2819 15.9387 19.5166 15.5744L17.9906 14.8481Z"
								fill="currentColor"></path>
						</svg>`
			},
			path: {
				title: this.$t("panel.financial.typePath"),
				english_title: "Path",
				slug: "path",
				icon: `<svg class="w-5 h-5" fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 297 297" xml:space="preserve">
							<path
								d="M221.93,183.185L62.208,279.018c-4.585,2.751-6.07,8.697-3.32,13.281c1.814,3.025,5.021,4.701,8.31,4.701 c1.695,0,3.412-0.445,4.971-1.381l159.722-95.832c4.585-2.752,6.07-8.697,3.321-13.281 C232.46,181.92,226.513,180.436,221.93,183.185z">
							</path>
							<polygon points="65.502,153.422 74.061,153.422 69.742,141.602 "></polygon>
							<path
								d="M68.64,255.192c2.284,0,4.568-0.806,6.397-2.415c2.357-2.076,57.754-51.451,57.754-102.631 c0-35.385-28.778-64.174-64.151-64.174c-35.373,0-64.151,28.789-64.151,64.174c0,51.18,55.396,100.555,57.753,102.631 C64.07,254.387,66.355,255.192,68.64,255.192z M59.808,169.244c-0.966,2.591-1.766,4.263-2.516,5.261 c-0.693,0.918-2.053,2.01-4.602,2.01c-1.709,0-3.229-0.623-4.518-1.853c-1.296-1.234-1.982-2.752-1.982-4.391 c0-0.84,0.139-1.705,0.41-2.573c0.231-0.74,0.596-1.724,1.113-3.005l13.281-33.744c0.53-1.356,1.116-2.515,1.738-3.443 c0.712-1.061,1.656-1.93,2.807-2.582c1.182-0.668,2.61-1.007,4.25-1.007c1.659,0,3.099,0.339,4.279,1.007 c1.143,0.647,2.082,1.498,2.793,2.529c0.624,0.906,1.155,1.889,1.579,2.918l13.745,34.064c1.081,2.594,1.588,4.434,1.588,5.772 c0,1.621-0.651,3.093-1.935,4.375c-1.283,1.282-2.852,1.933-4.662,1.933c-1.049,0-1.989-0.204-2.794-0.606 c-0.793-0.396-1.469-0.943-2.005-1.627c-0.469-0.592-0.938-1.425-1.427-2.541c-0.425-0.97-0.79-1.825-1.094-2.566l-1.793-4.712 H61.589L59.808,169.244z">
							</path>
							<path
								d="M228.36,0c-35.373,0-64.151,28.789-64.151,64.176c0,51.179,55.396,100.554,57.754,102.631 c1.829,1.609,4.113,2.415,6.398,2.415c2.285,0,4.569-0.806,6.398-2.415c2.357-2.077,57.753-51.452,57.753-102.631 C292.512,28.789,263.733,0,228.36,0z M249.912,82.351c-1.552,2.427-3.678,4.246-6.315,5.405c-1.622,0.678-3.453,1.149-5.476,1.416 c-1.936,0.256-4.217,0.387-6.778,0.387h-14.398c-2.621,0-4.59-0.672-5.854-1.999c-1.239-1.3-1.868-3.247-1.868-5.787V46.354 c0-2.602,0.65-4.57,1.933-5.853c1.283-1.283,3.231-1.934,5.789-1.934h15.267c2.343,0,4.419,0.149,6.171,0.444 c1.883,0.318,3.605,0.944,5.117,1.86c1.281,0.765,2.439,1.753,3.434,2.931c1.001,1.19,1.774,2.522,2.3,3.959 c0.525,1.441,0.792,2.979,0.792,4.57c0,4.134-1.64,7.546-4.784,10.036c5.689,3.11,7.002,7.985,7.002,11.819 C252.242,77.188,251.459,79.934,249.912,82.351z">
							</path>
							<path
								d="M233.082,68.595v0.04h-10.441v9.884h10.441v0.029c2.748,0,4.977-2.227,4.977-4.976 C238.059,70.823,235.83,68.595,233.082,68.595z">
							</path>
							<path
								d="M236.593,53.673c0-2.343-1.901-4.243-4.245-4.243h-9.707v8.486h9.707C234.691,57.916,236.593,56.018,236.593,53.673z">
							</path>
							</g>
						</svg>`
			},
			wallet: {
				title: this.$t("panel.financial.wallet"),
				english_title: "ٌWallet",
				slug: "wallet",
				icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd"
								d="M15.0308 3.3303C13.0345 2.8899 10.9655 2.8899 8.96917 3.3303L8.55155 3.42243C5.76343 4.03749 3.56534 6.17136 2.87698 8.93119C2.37434 10.9465 2.37434 13.0536 2.87698 15.0688C3.56534 17.8286 5.76343 19.9625 8.55155 20.5776L8.96917 20.6697C10.9655 21.1101 13.0345 21.1101 15.0308 20.6697L15.4484 20.5776C18.2366 19.9625 20.4347 17.8286 21.123 15.0688C21.6257 13.0535 21.6257 10.9465 21.123 8.9312C20.4347 6.17136 18.2366 4.03749 15.4484 3.42243L15.0308 3.3303ZM17.9433 9.80778C18.3203 9.74389 18.702 9.72114 19.0807 9.73871C19.4968 9.75801 19.8243 10.0825 19.8802 10.4936C20.0163 11.4933 20.0163 12.5067 19.8802 13.5064C19.8243 13.9175 19.4968 14.242 19.0807 14.2613C18.702 14.2789 18.3203 14.2561 17.9433 14.1922L17.8694 14.1797C16.8874 14.0133 16.1287 13.3507 15.8722 12.5159C15.7684 12.1783 15.7684 11.8217 15.8722 11.4841C16.1287 10.6493 16.8874 9.98674 17.8694 9.82032L17.9433 9.80778ZM7.34559 8.97732C7.34559 8.64344 7.61739 8.37278 7.95269 8.37278L12 8.37278C12.3353 8.37278 12.6071 8.64344 12.6071 8.97732C12.6071 9.3112 12.3353 9.58186 12 9.58186H7.95269C7.61739 9.58186 7.34559 9.3112 7.34559 8.97732Z"
								fill="currentColor"></path>
						</svg>`
			},
			vip: {
				title: this.$t("panel.financial.typeVip"),
				english_title: "VIP Membership",
				slug: "vip",
				icon: `<svg class="w-4 h-4" viewBox="2 2 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
							fill="none">
							<path
								d="M12.9873,5.73973 C13.5921,5.39577 14,4.74552 14,4 C14,2.89543 13.1046,2 12,2 C10.8954,2 10,2.89543 10,4 C10,4.7472 10.4097,5.39869 11.0168,5.74205 L11.0078,5.76034 C10.3521,7.12693 9.44232,9.08475 8.03664,9.81975 C6.88336,10.4228 5.22628,10.1194 3.99634,9.8944 C3.94215,9.11525 3.29293,8.5 2.5,8.5 C1.67157,8.5 1,9.17157 1,10 C1,10.7347 1.52815,11.346 2.22548,11.4749 L5.17264,19.0836 C5.62005,20.2387 6.7314,21 7.97011,21 L16.0299,21 C17.2686,21 18.3799,20.2387 18.8274,19.0836 L21.7745,11.4749 C22.4718,11.346 23,10.7347 23,10 C23,9.17157 22.3284,8.5 21.5,8.5 C20.7223,8.5 20.0828,9.09186 20.0074,9.84973 C18.7483,10.013 17.1251,10.2213 15.9634,9.61387 C14.5859,8.89364 13.6634,7.07077 12.9873,5.73973 Z"
								fill="currentColor"> </path>

						</svg>`
			}
		};
		const filters = {
			all: {
				title: this.$t("panel.common.statusAll"),
				english_title: "All",
				slug: "all",
				icon: ``
			},
			deposit: {
				title: this.$t("panel.financial.filterDeposit"),
				english_title: "deposit transactions",
				slug: "deposit",
				icon: ``
			},
			failed: {
				title: this.$t("panel.financial.filterFailed"),
				english_title: "failed transactions",
				slug: "failed",
				icon: ``
			}
		};
		const sort = {
			newest: {
				title: this.$t("panel.common.sortNewest"),
				english_title: "newest",
				slug: "newest",
				icon: ``
			},
			oldest: {
				title: this.$t("panel.common.sortOldest"),
				english_title: "oldest",
				slug: "oldest",
				icon: ``
			}
		};
		const selectedFilter = filters[filterSlugFromUrl] || filters['all'];
		const selectedType = types[typeSlugFromUrl] || types['all'];
		const selectedSort = sort[sortSlugFromUrl] || sort['newest'];

		return {
			paymentLoading: false,
			retryPayLoading: false,
			paymentsList: null,
			isOpenIncreaseWalletModal: false,
			isOpenPaymentDetailsModal: false,
			paymentDetails: [],
			types,
			selectedType,
			filters,
			selectedFilter,
			sort,
			selectedSort,
			currentPage: this.$route.query.page ? this.$route.query.page : 1,
			pagination: {},
			mounted: false,
			selectedPayment: null,
			selectedGateway: null,
			paymentMethodForRetry: 'bank',
			showPriceUpdatedToast: false,
			retryPricingSignature: '',
			paymentSheetStep: 'invoice',
			walletSplitGateway: null,
		};
	},
	computed: {
		gateways() {
			return buildPaymentGateways(this.$t);
		},
		retryCartItems() {
			return (this.selectedPayment?.items || []).map((item) => {
				const type = String(item.payable_type || '').toLowerCase();
				const payable = item.payable || {};

				return {
					id: item.id,
					type: type === 'plan' ? 'vip' : type,
					price: Number(item.final_price || item.price || 0),
					discount_amount: 0,
					allows_installment: Boolean(item.allows_installment ?? payable.allows_installment),
					course: type === 'course' ? payable : null,
					path: type === 'path' ? payable : null,
					vip: type === 'plan' ? payable : null,
				};
			});
		},
		availableGateways() {
			return filterGatewaysForCart(this.gateways, this.retryCartItems);
		},
		hasInstallmentEligible() {
			return cartHasInstallmentEligibleItems(this.retryCartItems);
		},
		isRetryFullyInstallment() {
			return isCartFullyInstallmentEligible(this.retryCartItems);
		},
		isCurrentGatewayInstallment() {
			return this.paymentMethodForRetry === 'bank' && isInstallmentGateway(this.selectedGateway);
		},
		retryPricing() {
			const pricing = calculateCartGatewayPricing(
				this.retryCartItems,
				this.selectedGateway,
				this.paymentMethodForRetry,
			);

			return {
				...pricing,
				items: pricing.items.map((row) => {
					const item = this.retryCartItems.find((cartItem) => cartItem.id === row.id);

					return {
						...row,
						title: item ? getCartItemTitle(item, this.$t) : '',
					};
				}),
			};
		},
		retryPayableAmount() {
			return Number(this.retryPricing.chargedTotal || this.selectedPayment?.amount || 0);
		},
		showRetryGatewayFee() {
			return this.paymentMethodForRetry === 'bank' && this.retryPricing.hasFee;
		},
		loggedIn() {
			const auth = this.authStore || (typeof useAuthStore === 'function' ? useAuthStore() : null);
			return Boolean(auth?.status?.loggedIn);
		},
		currentUser() {
			const auth = this.authStore || (typeof useAuthStore === 'function' ? useAuthStore() : null);
			return auth?.status?.userInfo || null;
		},
		walletBalance() {
			return Number(this.currentUser?.wallet_balance || 0);
		},
		walletSufficientForRetry() {
			return this.walletBalance >= this.retryPayableAmount;
		},
		directBankGateways() {
			return filterDirectBankGateways(this.availableGateways);
		},
		walletSplitActive() {
			return this.paymentMethodForRetry === 'wallet'
				&& this.retryPayableAmount > 0
				&& this.walletBalance > 0
				&& !this.walletSufficientForRetry;
		},
		walletSplitAmount() {
			return this.walletSplitActive ? Math.min(this.walletBalance, this.retryPayableAmount) : 0;
		},
		gatewaySplitAmount() {
			return this.walletSplitActive ? Math.max(0, this.retryPayableAmount - this.walletBalance) : 0;
		},
		transactionStats() {
			const list = this.paymentsList || [];
			return {
				total: Number(this.pagination?.total || 0),
				paid: list.filter((p) => p.is_paid).length,
				pending: list.filter((p) => !p.is_paid && p.can_retry).length,
				failed: list.filter((p) => !p.is_paid && !p.can_retry).length,
			};
		},
	},
	mounted() {
		document.title = this.$t("panel.financial.documentTitle");
		fetchGatewayCommissions();
		this.selectedGateway = getDefaultGateway(this.gateways);
		this.getPaymentsList();
	},
	watch: {
		gateways(list) {
			const currentId = this.selectedGateway?.id;
			const resolved = currentId ? findGatewayById(list, currentId) : null;
			const next = resolved || getDefaultGateway(list);
			if (next?.id !== currentId) {
				this.selectedGateway = next;
			}
		},
		selectedGateway(gateway, previous) {
			if (!gateway || !this.isOpenPaymentDetailsModal) {
				return;
			}

			if (isInstallmentGateway(gateway) && !this.isRetryFullyInstallment) {
				toast.error(this.$t('panel.financial.installmentIneligibleNotice'), {
					theme: "colored",
					position: toast.POSITION.BOTTOM_CENTER,
					bodyClassName: "font-YekanBakh",
					toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
				});
				this.selectedGateway = previous || getDefaultGateway(this.availableGateways);
				return;
			}

			const wasDigipay = isDigipayFeeGateway(previous);
			const isDigipay = isDigipayFeeGateway(gateway);
			if (wasDigipay !== isDigipay) {
				this.showPriceUpdatedToast = true;
				setTimeout(() => {
					this.showPriceUpdatedToast = false;
				}, 4000);
			}

			this.retryPricingSignature = `${gateway?.id || ''}|${this.paymentMethodForRetry}|${this.retryPayableAmount}`;
		},
		paymentMethodForRetry(method, previousMethod) {
			if (!this.isOpenPaymentDetailsModal || !previousMethod || method === previousMethod) {
				return;
			}

			if (isDigipayFeeGateway(this.selectedGateway)) {
				this.showPriceUpdatedToast = true;
				setTimeout(() => {
					this.showPriceUpdatedToast = false;
				}, 4000);
			}

			this.retryPricingSignature = `${this.selectedGateway?.id || ''}|${method}|${this.retryPayableAmount}`;
		},
	},
	methods: {
		gatewayLabel(driver, variantId = null) {
			return findGatewayByDriver(this.gateways, driver, variantId);
		},
		selectType(type) {
			this.selectedType = type;
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
		selectSort(sort) {
			this.selectedSort = sort;
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

			if (this.selectedType && this.selectedType.slug !== 'all') {
				query.type = this.selectedType.slug;
			}

			if (this.selectedFilter && this.selectedFilter.slug !== 'all') {
				query.filter = this.selectedFilter.slug;
			}
			if (this.selectedSort && this.selectedSort.slug !== 'newest') {
				query.sort = this.selectedSort.slug;
			}

			if (this.currentPage !== 1) {
				query.page = this.currentPage;
			}

			const queryString = new URLSearchParams(query).toString();
			const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

			window.history.pushState({ ...window.history.state }, '', newUrl);

			this.getPaymentsList();
		},
		async getPaymentsList() {
			try {
				this.paymentLoading = true;

				let params = {
					page: this.currentPage,
					type: this.selectedType ? this.selectedType.slug : undefined,
					filter: this.selectedFilter ? this.selectedFilter.slug : undefined,
					sort: this.selectedSort ? this.selectedSort.slug : undefined,
				};

				Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

				const response = await axiosInstance.post("/panel/financial", params);
				this.paymentsList = response.data.data;
				this.currentPage = response.data.pagination.current_page;
				this.pagination = response.data.pagination;
				if (this.mounted)
					setTimeout(() => {
						document.getElementById('payments-list').scrollIntoView({ behavior: 'smooth' });
					}, 200)

			} catch (error) {
				console.error("Error loading payments:", error);
			} finally {
				this.paymentLoading = false;
				this.mounted = true;
			}
		},
		paymentMethodText(method) {
			if (method === 'wallet') return this.$t('panel.financial.wallet');
			if (method === 'wallet_bank') return this.$t('panel.financial.walletAndGateway');
			return this.$t('panel.financial.online');
		},
		openWalletSplitSheet() {
			this.walletSplitGateway = getDefaultGateway(this.directBankGateways);
			this.paymentSheetStep = 'gateway';
			this.isOpenPaymentDetailsModal = true;
		},
		confirmWalletSplit() {
			if (this.retryPayLoading) return;
			this.retryPay({ walletSplitConfirmed: true });
		},
		onRetryPay() {
			if (this.isCurrentGatewayInstallment && !this.isRetryFullyInstallment) {
				toast.error(this.$t('panel.financial.installmentIneligibleNotice'), {
					theme: "colored",
					bodyClassName: "font-YekanBakh",
					toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
				});
				return;
			}
			if (this.walletSplitActive) {
				this.openWalletSplitSheet();
				return;
			}
			this.retryPay();
		},
		retryPay(options = {}) {
			this.retryPayLoading = true;
			let payload = this.paymentMethodForRetry === 'wallet'
				? { payment_method: 'wallet' }
				: { payment_method: 'bank', ...gatewayPayPayload(this.selectedGateway) };
			if (options.walletSplitConfirmed) {
				payload = {
					payment_method: 'wallet',
					wallet_split_confirmed: true,
					...gatewayPayPayload(this.walletSplitGateway || this.selectedGateway),
				};
			}
			axiosInstance.post(`/payment/retry/${this.selectedPayment.uuid}`, payload).then((response) => {
				if (this.selectedPayment) {
					this.selectedPayment.payment_method = options.walletSplitConfirmed ? 'wallet_bank' : this.paymentMethodForRetry;
					if (this.paymentMethodForRetry === 'bank' && this.selectedGateway) {
						this.selectedPayment.driver = this.selectedGateway.driver || this.selectedGateway.english_name;
					}
				}

				if (response.data.redirect_url) {
					window.location.href = response.data.redirect_url;
					return;
				}
				if (response.data.status === 'paid' && response.data.payment_uuid) {
					this.$router.push({ name: 'payment-receipt', params: { uuid: response.data.payment_uuid } });
				}
				this.retryPayLoading = false;
				this.closePaymentDetailsModal();
			}
			).catch((error) => {
				this.retryPayLoading = false;
				const code = error?.response?.data?.code;
				if (code === 'wallet_insufficient') {
					this.openWalletSplitSheet();
					return;
				}
				toast.error(error?.response?.data?.error || this.$t('panel.financial.retryError'), {
					theme: "colored",
					hideProgressBar: false,
					rtl: localStorage.getItem("direction") == "rtl" ? true : false,
					bodyClassName: "font-YekanBakh",
					toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
					transition: toast.TRANSITIONS.BOUNCE,
					position: toast.POSITION.BOTTOM_RIGHT,
				});
			});
		},
		closePaymentDetailsModal() {
			this.isOpenPaymentDetailsModal = false;
			// this.selectedPayment = null;
		},
		openPaymentDetailsModal(payment) {
			this.selectedPayment = payment;
			this.paymentSheetStep = 'invoice';
			this.paymentMethodForRetry = payment.payment_method === 'wallet' ? 'wallet' : 'bank';
			const fromVariant = findGatewayByVariant(this.gateways, payment.gateway_variant);
			this.selectedGateway = fromVariant || getDefaultGateway(this.gateways);
			this.retryPricingSignature = `${this.selectedGateway?.id || ''}|${this.paymentMethodForRetry}|${payment.amount}`;
			this.isOpenPaymentDetailsModal = true;
		},
	}
};
</script>

<style scoped>
.pay-step-forward-enter-active,
.pay-step-forward-leave-active,
.pay-step-back-enter-active,
.pay-step-back-leave-active {
	transition: transform 0.28s ease, opacity 0.28s ease;
}
.pay-step-forward-enter-from,
.pay-step-back-leave-to {
	opacity: 0;
	transform: translateX(-1.25rem);
}
.pay-step-forward-leave-to,
.pay-step-back-enter-from {
	opacity: 0;
	transform: translateX(1.25rem);
}
</style>
