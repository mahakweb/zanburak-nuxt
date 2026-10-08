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
								<svg class="w-4 h-4 md:w-5 md:h-5 text-amber-400 shrink-0" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M1.39223 9.60081C2.01809 9.60081 2.46646 9.45602 2.73736 9.16644C3.00825 8.88621 3.16705 8.54059 3.21376 8.12958H2.55521C2.06947 8.12958 1.67247 8.0782 1.36421 7.97545C1.05595 7.8727 0.813083 7.71857 0.635601 7.51306C0.45812 7.30756 0.332014 7.06002 0.257285 6.77044C0.191897 6.47153 0.159203 6.13057 0.159203 5.74759C0.159203 5.38328 0.21058 5.03766 0.313332 4.71072C0.416085 4.37444 0.565543 4.08486 0.761707 3.84199C0.967212 3.59912 1.21942 3.40763 1.51834 3.26751C1.8266 3.11806 2.18156 3.04333 2.58323 3.04333C2.90083 3.04333 3.19974 3.0947 3.47998 3.19746C3.76955 3.30021 4.02176 3.46368 4.23661 3.68787C4.45146 3.91205 4.6196 4.2063 4.74103 4.5706C4.87181 4.93491 4.9372 5.37861 4.9372 5.90172V6.20997H5.94604C6.15154 6.20997 6.2543 6.51823 6.2543 7.13475C6.2543 7.79797 6.15154 8.12958 5.94604 8.12958H4.92318C4.89516 8.58729 4.79708 9.02166 4.62894 9.43267C4.4608 9.84368 4.22727 10.2033 3.92835 10.5116C3.63878 10.8198 3.28381 11.0627 2.86346 11.2402C2.44311 11.427 1.97606 11.5204 1.46229 11.5204H0.0891448L0.0050746 9.60081H1.39223Z" fill="currentColor"></path>
								</svg>
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
							<div v-for="(payment, index) in paymentsList" :key="index"
								class="relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40 shadow-sm">
								<span class="absolute inset-y-0 start-0 w-1 rounded-e-full"
									:class="{
										'bg-gradient-to-b from-emerald-400 to-green-500': payment.is_paid,
										'bg-gradient-to-b from-rose-400 to-red-500': !payment.is_paid && !payment.can_retry,
										'bg-gradient-to-b from-amber-400 to-orange-500': !payment.is_paid && payment.can_retry
									}"></span>
								<div class="p-3 md:p-4 ps-4 md:ps-5">
									<div class="hidden md:grid md:grid-cols-11 md:gap-2 md:items-center text-sm">
										<div class="col-span-3 flex items-center gap-2 text-start min-w-0">
											<span class="shrink-0">
												<svg v-if="payment.is_paid" class="text-emerald-500 w-7 h-7" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z" fill="currentColor"></path></svg>
												<svg v-else-if="!payment.is_paid && payment.can_retry" class="text-amber-500 w-7 h-7" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM12 10.0854C12.5287 10.0854 12.9573 9.65681 12.9573 9.12812C12.9573 8.59942 12.5287 8.17083 12 8.17083C11.4713 8.17083 11.0427 8.59942 11.0427 9.12812C11.0427 9.65681 11.4713 10.0854 12 10.0854ZM12 10.8034C12.3965 10.8034 12.7179 11.1248 12.7179 11.5213V15.3505C12.7179 15.747 12.3965 16.0684 12 16.0684C11.6035 16.0684 11.282 15.747 11.282 15.3505V11.5213C11.282 11.1248 11.6035 10.8034 12 10.8034Z" fill="currentColor"></path></svg>
												<svg v-else class="text-rose-500 w-7 h-7" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM10.7139 9.90158C10.4896 9.67727 10.1259 9.67727 9.90158 9.90158C9.67727 10.1259 9.67727 10.4896 9.90158 10.7139L11.1877 12L9.90158 13.2861C9.67727 13.5104 9.67727 13.8741 9.90158 14.0984C10.1259 14.3227 10.4896 14.3227 10.7139 14.0984L12 12.8123L13.2861 14.0984C13.5104 14.3227 13.8741 14.3227 14.0984 14.0984C14.3227 13.8741 14.3227 13.5104 14.0984 13.2861L12.8123 12L14.0984 10.7139C14.3227 10.4896 14.3227 10.1259 14.0984 9.90158C13.8741 9.67727 13.5104 9.67727 13.2861 9.90158L12 11.1877L10.7139 9.90158Z" fill="currentColor"></path></svg>
											</span>
											<span class="font-semibold text-gray-800 dark:text-gray-100 truncate">{{ payment.reference_id }}</span>
										</div>
										<div class="col-span-1 text-center text-gray-600 dark:text-gray-300">{{ payment.tracking_number ? payment.tracking_number : "----------" }}</div>
										<div class="col-span-2 flex items-center justify-center font-semibold text-gray-800 dark:text-gray-100">
											{{ (payment.amount).toLocaleString() }}
											<svg class="shrink-0 ms-1 w-3.5 h-3.5" width="14" height="14" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.39223 9.60081C2.01809 9.60081 2.46646 9.45602 2.73736 9.16644C3.00825 8.88621 3.16705 8.54059 3.21376 8.12958H2.55521C2.06947 8.12958 1.67247 8.0782 1.36421 7.97545C1.05595 7.8727 0.813083 7.71857 0.635601 7.51306C0.45812 7.30756 0.332014 7.06002 0.257285 6.77044C0.191897 6.47153 0.159203 6.13057 0.159203 5.74759C0.159203 5.38328 0.21058 5.03766 0.313332 4.71072C0.416085 4.37444 0.565543 4.08486 0.761707 3.84199C0.967212 3.59912 1.21942 3.40763 1.51834 3.26751C1.8266 3.11806 2.18156 3.04333 2.58323 3.04333C2.90083 3.04333 3.19974 3.0947 3.47998 3.19746C3.76955 3.30021 4.02176 3.46368 4.23661 3.68787C4.45146 3.91205 4.6196 4.2063 4.74103 4.5706C4.87181 4.93491 4.9372 5.37861 4.9372 5.90172V6.20997H5.94604C6.15154 6.20997 6.2543 6.51823 6.2543 7.13475C6.2543 7.79797 6.15154 8.12958 5.94604 8.12958H4.92318C4.89516 8.58729 4.79708 9.02166 4.62894 9.43267C4.4608 9.84368 4.22727 10.2033 3.92835 10.5116C3.63878 10.8198 3.28381 11.0627 2.86346 11.2402C2.44311 11.427 1.97606 11.5204 1.46229 11.5204H0.0891448L0.0050746 9.60081H1.39223Z" fill="currentColor"></path></svg>
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
										<div class="col-span-2 flex items-center justify-center">
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
									<div class="md:hidden space-y-3">
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
												<p class="font-bold text-gray-900 dark:text-white flex items-center justify-end">{{ (payment.amount).toLocaleString() }}</p>
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
			:panelClass="'bg-gray-200 dark:bg-gray-400 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[40rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
			:contentClass="'px-4 pb-4 overflow-auto custom-scrollbar text-center'"
			:backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
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
						class="bg-white dark:bg-gray-200 rounded-lg p-2 md:p-3 text-xs font-semibold text-gray-700 dark:text-gray-900">
						<div v-for="(item, i) in selectedPayment.items" :key="i" class="">
							<div v-if="item.payable_type === 'Course'" class="flex items-center justify-between">
								<span class="">{{ i + 1 }}.&nbsp; {{ $t("panel.financial.itemCourse") }} {{ item.payable.title
								}}</span>
								<span class="ms-2 whitespace-nowrap flex items-center">{{
									item.final_price.toLocaleString() }}
									<svg class="ms-1 w-3 h-3" viewBox="0 0 19 20" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M1.88439 8.9046C2.26299 8.9046 2.59427 8.84436 2.87821 8.7239C3.17077 8.60344 3.416 8.43995 3.6139 8.23344C3.81181 8.02693 3.96239 7.78601 4.06564 7.51066C4.16889 7.24392 4.22913 6.95997 4.24634 6.65881H2.95566C2.51682 6.65881 2.15543 6.61149 1.87149 6.51684C1.58754 6.42219 1.36382 6.28452 1.20033 6.10382C1.03685 5.92313 0.920685 5.70801 0.851848 5.45848C0.791617 5.20035 0.761501 4.91209 0.761501 4.59373C0.761501 4.26675 0.808826 3.95699 0.903475 3.66444C0.998125 3.37188 1.1358 3.11375 1.31649 2.89003C1.49719 2.66631 1.72091 2.48992 1.98765 2.36085C2.26299 2.22318 2.57706 2.15434 2.92984 2.15434C3.21379 2.15434 3.48483 2.20167 3.74297 2.29632C4.00111 2.39097 4.22913 2.54155 4.42703 2.74806C4.62493 2.94596 4.77982 3.2084 4.89167 3.53537C5.01214 3.85374 5.07237 4.24094 5.07237 4.69698V5.76824H6.31142C6.41468 5.76824 6.48351 5.80697 6.51793 5.88441C6.56095 5.95324 6.58246 6.0608 6.58246 6.20708C6.58246 6.36196 6.56095 6.47812 6.51793 6.55556C6.48351 6.6244 6.41468 6.65881 6.31142 6.65881H5.04656C5.02935 7.08044 4.9433 7.48055 4.78842 7.85915C4.64214 8.23774 4.43563 8.56902 4.16889 8.85297C3.90215 9.13692 3.58379 9.36064 3.21379 9.52412C2.8438 9.69621 2.42648 9.78226 1.96183 9.78226H0.593713L0.516272 8.9046H1.88439ZM1.56172 4.5421C1.56172 4.75721 1.58323 4.94221 1.62626 5.09709C1.67788 5.25197 1.75963 5.38104 1.87149 5.4843C1.99195 5.57895 2.15113 5.65208 2.34904 5.70371C2.54694 5.74673 2.79647 5.76824 3.09763 5.76824H4.25924V4.80024C4.25924 4.1635 4.13448 3.70746 3.88494 3.43212C3.63541 3.15677 3.29123 3.0191 2.8524 3.0191C2.43938 3.0191 2.12102 3.15677 1.8973 3.43212C1.67358 3.70746 1.56172 4.07745 1.56172 4.5421ZM8.44437 5.76824C8.55623 5.76824 8.62937 5.80697 8.66379 5.88441C8.70681 5.95324 8.72832 6.0608 8.72832 6.20708C8.72832 6.36196 8.70681 6.47812 8.66379 6.55556C8.62937 6.6244 8.55623 6.65881 8.44437 6.65881H6.31475C6.20289 6.65881 6.12975 6.6244 6.09533 6.55556C6.05231 6.48672 6.0308 6.37917 6.0308 6.23289C6.0308 6.07801 6.05231 5.96185 6.09533 5.88441C6.12975 5.80697 6.20289 5.76824 6.31475 5.76824H8.44437ZM10.5745 5.76824C10.6864 5.76824 10.7595 5.80697 10.7939 5.88441C10.8369 5.95324 10.8584 6.0608 10.8584 6.20708C10.8584 6.36196 10.8369 6.47812 10.7939 6.55556C10.7595 6.6244 10.6864 6.65881 10.5745 6.65881H8.44487C8.33301 6.65881 8.25988 6.6244 8.22546 6.55556C8.18244 6.48672 8.16092 6.37917 8.16092 6.23289C8.16092 6.07801 8.18244 5.96185 8.22546 5.88441C8.25988 5.80697 8.33301 5.76824 8.44487 5.76824H10.5745ZM12.7046 5.76824C12.8165 5.76824 12.8896 5.80697 12.924 5.88441C12.9671 5.95324 12.9886 6.0608 12.9886 6.20708C12.9886 6.36196 12.9671 6.47812 12.924 6.55556C12.8896 6.6244 12.8165 6.65881 12.7046 6.65881H10.575C10.4631 6.65881 10.39 6.6244 10.3556 6.55556C10.3126 6.48672 10.291 6.37917 10.291 6.23289C10.291 6.07801 10.3126 5.96185 10.3556 5.88441C10.39 5.80697 10.4631 5.76824 10.575 5.76824H12.7046ZM14.8347 5.76824C14.9466 5.76824 15.0197 5.80697 15.0542 5.88441C15.0972 5.95324 15.1187 6.0608 15.1187 6.20708C15.1187 6.36196 15.0972 6.47812 15.0542 6.55556C15.0197 6.6244 14.9466 6.65881 14.8347 6.65881H12.7051C12.5933 6.65881 12.5201 6.6244 12.4857 6.55556C12.4427 6.48672 12.4212 6.37917 12.4212 6.23289C12.4212 6.07801 12.4427 5.96185 12.4857 5.88441C12.5201 5.80697 12.5933 5.76824 12.7051 5.76824H14.8347ZM15.9969 5.76824C16.3324 5.76824 16.5992 5.6779 16.7971 5.4972C17.0036 5.31651 17.1068 5.06698 17.1068 4.74861V2.96747H17.9458V4.74861C17.9458 5.35953 17.7737 5.83278 17.4295 6.16836C17.0939 6.49533 16.6336 6.65881 16.0485 6.65881H14.8352C14.7234 6.65881 14.6503 6.6244 14.6158 6.55556C14.5728 6.48672 14.5513 6.37917 14.5513 6.23289C14.5513 6.07801 14.5728 5.96185 14.6158 5.88441C14.6503 5.80697 14.7234 5.76824 14.8352 5.76824H15.9969ZM18.0749 1.3154H17.0423V0.399019H18.0749V1.3154ZM16.4357 1.3154H15.4031V0.399019H16.4357V1.3154ZM7.64082 16.4007C7.64082 16.8653 7.56768 17.2999 7.42141 17.7043C7.27513 18.1173 7.06432 18.4744 6.78897 18.7755C6.51363 19.0853 6.17805 19.3305 5.78224 19.5112C5.39504 19.6919 4.95621 19.7823 4.46575 19.7823H3.70425C2.74054 19.7823 1.99195 19.4854 1.45847 18.8917C0.924987 18.298 0.658246 17.4848 0.658246 16.4523V14.1936H1.48428V16.4265C1.48428 16.7965 1.5273 17.1321 1.61335 17.4332C1.708 17.7344 1.84997 17.9925 2.03927 18.2076C2.23718 18.4313 2.48241 18.6034 2.77496 18.7239C3.06751 18.8444 3.4203 18.9046 3.83332 18.9046H4.40122C4.80563 18.9046 5.15841 18.8358 5.45957 18.6981C5.76073 18.569 6.01026 18.3926 6.20817 18.1689C6.41468 17.9452 6.56526 17.6828 6.65991 17.3816C6.76316 17.0804 6.81479 16.7664 6.81479 16.4394V12.9675H7.64082V16.4007ZM4.53028 12.6835H3.44611V11.7413H4.53028V12.6835ZM10.9764 16.6588C10.7527 16.6588 10.5376 16.6287 10.3311 16.5685C10.1246 16.4996 9.93957 16.3878 9.77609 16.2329C9.62121 16.078 9.49644 15.8758 9.40179 15.6263C9.30714 15.3681 9.25982 15.0498 9.25982 14.6712V8.6566H10.0988V14.5163C10.0988 14.8777 10.1762 15.1788 10.3311 15.4198C10.4946 15.6521 10.757 15.7682 11.1184 15.7682H11.3378C11.5271 15.7682 11.6218 15.9145 11.6218 16.2071C11.6218 16.5082 11.5271 16.6588 11.3378 16.6588H10.9764ZM11.5504 15.7682C11.8859 15.7682 12.1398 15.6865 12.3119 15.523C12.484 15.3595 12.57 15.1401 12.57 14.8648V14.3743C12.57 13.6257 12.7593 13.0406 13.1379 12.619C13.5251 12.1974 14.0586 11.9866 14.7383 11.9866C15.0911 11.9866 15.4009 12.0425 15.6676 12.1543C15.9344 12.2662 16.1538 12.4254 16.3259 12.6319C16.5066 12.8384 16.6399 13.0836 16.726 13.3676C16.812 13.6515 16.8551 13.9656 16.8551 14.3098C16.8551 15.0498 16.6615 15.6263 16.2743 16.0393C15.8871 16.4523 15.3579 16.6588 14.6867 16.6588C14.3425 16.6588 14.0113 16.5943 13.6929 16.4652C13.3745 16.3275 13.125 16.0866 12.9443 15.7424C12.8669 15.9403 12.7722 16.0995 12.6604 16.22C12.5485 16.3404 12.4323 16.4351 12.3119 16.5039C12.1914 16.5642 12.0623 16.6072 11.9247 16.633C11.7956 16.6502 11.6708 16.6588 11.5504 16.6588H11.3439C11.232 16.6588 11.1589 16.6244 11.1244 16.5556C11.0814 16.4867 11.0599 16.3792 11.0599 16.2329C11.0599 16.078 11.0814 15.9618 11.1244 15.8844C11.1589 15.807 11.232 15.7682 11.3439 15.7682H11.5504ZM16.029 14.3872C16.029 13.9398 15.9301 13.5784 15.7322 13.303C15.5343 13.0191 15.1944 12.8771 14.7125 12.8771C13.8177 12.8771 13.3702 13.3977 13.3702 14.4388C13.3702 14.8777 13.4907 15.209 13.7316 15.4327C13.9811 15.6564 14.2995 15.7682 14.6867 15.7682C15.1256 15.7682 15.4568 15.6478 15.6805 15.4069C15.9129 15.1659 16.029 14.826 16.029 14.3872Z"
											fill="currentColor"></path>
									</svg>
								</span>
							</div>
							<div v-if="item.payable_type === 'Path'" class="flex items-center justify-between">
								<span class="">{{ i + 1 }}.&nbsp; {{ $t("panel.financial.itemPath") }} {{ item.payable.title
								}}</span>
								<span class="ms-2 whitespace-nowrap flex items-center">{{
									item.final_price.toLocaleString() }}
									<svg class="ms-1 w-3 h-3" viewBox="0 0 19 20" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M1.88439 8.9046C2.26299 8.9046 2.59427 8.84436 2.87821 8.7239C3.17077 8.60344 3.416 8.43995 3.6139 8.23344C3.81181 8.02693 3.96239 7.78601 4.06564 7.51066C4.16889 7.24392 4.22913 6.95997 4.24634 6.65881H2.95566C2.51682 6.65881 2.15543 6.61149 1.87149 6.51684C1.58754 6.42219 1.36382 6.28452 1.20033 6.10382C1.03685 5.92313 0.920685 5.70801 0.851848 5.45848C0.791617 5.20035 0.761501 4.91209 0.761501 4.59373C0.761501 4.26675 0.808826 3.95699 0.903475 3.66444C0.998125 3.37188 1.1358 3.11375 1.31649 2.89003C1.49719 2.66631 1.72091 2.48992 1.98765 2.36085C2.26299 2.22318 2.57706 2.15434 2.92984 2.15434C3.21379 2.15434 3.48483 2.20167 3.74297 2.29632C4.00111 2.39097 4.22913 2.54155 4.42703 2.74806C4.62493 2.94596 4.77982 3.2084 4.89167 3.53537C5.01214 3.85374 5.07237 4.24094 5.07237 4.69698V5.76824H6.31142C6.41468 5.76824 6.48351 5.80697 6.51793 5.88441C6.56095 5.95324 6.58246 6.0608 6.58246 6.20708C6.58246 6.36196 6.56095 6.47812 6.51793 6.55556C6.48351 6.6244 6.41468 6.65881 6.31142 6.65881H5.04656C5.02935 7.08044 4.9433 7.48055 4.78842 7.85915C4.64214 8.23774 4.43563 8.56902 4.16889 8.85297C3.90215 9.13692 3.58379 9.36064 3.21379 9.52412C2.8438 9.69621 2.42648 9.78226 1.96183 9.78226H0.593713L0.516272 8.9046H1.88439ZM1.56172 4.5421C1.56172 4.75721 1.58323 4.94221 1.62626 5.09709C1.67788 5.25197 1.75963 5.38104 1.87149 5.4843C1.99195 5.57895 2.15113 5.65208 2.34904 5.70371C2.54694 5.74673 2.79647 5.76824 3.09763 5.76824H4.25924V4.80024C4.25924 4.1635 4.13448 3.70746 3.88494 3.43212C3.63541 3.15677 3.29123 3.0191 2.8524 3.0191C2.43938 3.0191 2.12102 3.15677 1.8973 3.43212C1.67358 3.70746 1.56172 4.07745 1.56172 4.5421ZM8.44437 5.76824C8.55623 5.76824 8.62937 5.80697 8.66379 5.88441C8.70681 5.95324 8.72832 6.0608 8.72832 6.20708C8.72832 6.36196 8.70681 6.47812 8.66379 6.55556C8.62937 6.6244 8.55623 6.65881 8.44437 6.65881H6.31475C6.20289 6.65881 6.12975 6.6244 6.09533 6.55556C6.05231 6.48672 6.0308 6.37917 6.0308 6.23289C6.0308 6.07801 6.05231 5.96185 6.09533 5.88441C6.12975 5.80697 6.20289 5.76824 6.31475 5.76824H8.44437ZM10.5745 5.76824C10.6864 5.76824 10.7595 5.80697 10.7939 5.88441C10.8369 5.95324 10.8584 6.0608 10.8584 6.20708C10.8584 6.36196 10.8369 6.47812 10.7939 6.55556C10.7595 6.6244 10.6864 6.65881 10.5745 6.65881H8.44487C8.33301 6.65881 8.25988 6.6244 8.22546 6.55556C8.18244 6.48672 8.16092 6.37917 8.16092 6.23289C8.16092 6.07801 8.18244 5.96185 8.22546 5.88441C8.25988 5.80697 8.33301 5.76824 8.44487 5.76824H10.5745ZM12.7046 5.76824C12.8165 5.76824 12.8896 5.80697 12.924 5.88441C12.9671 5.95324 12.9886 6.0608 12.9886 6.20708C12.9886 6.36196 12.9671 6.47812 12.924 6.55556C12.8896 6.6244 12.8165 6.65881 12.7046 6.65881H10.575C10.4631 6.65881 10.39 6.6244 10.3556 6.55556C10.3126 6.48672 10.291 6.37917 10.291 6.23289C10.291 6.07801 10.3126 5.96185 10.3556 5.88441C10.39 5.80697 10.4631 5.76824 10.575 5.76824H12.7046ZM14.8347 5.76824C14.9466 5.76824 15.0197 5.80697 15.0542 5.88441C15.0972 5.95324 15.1187 6.0608 15.1187 6.20708C15.1187 6.36196 15.0972 6.47812 15.0542 6.55556C15.0197 6.6244 14.9466 6.65881 14.8347 6.65881H12.7051C12.5933 6.65881 12.5201 6.6244 12.4857 6.55556C12.4427 6.48672 12.4212 6.37917 12.4212 6.23289C12.4212 6.07801 12.4427 5.96185 12.4857 5.88441C12.5201 5.80697 12.5933 5.76824 12.7051 5.76824H14.8347ZM15.9969 5.76824C16.3324 5.76824 16.5992 5.6779 16.7971 5.4972C17.0036 5.31651 17.1068 5.06698 17.1068 4.74861V2.96747H17.9458V4.74861C17.9458 5.35953 17.7737 5.83278 17.4295 6.16836C17.0939 6.49533 16.6336 6.65881 16.0485 6.65881H14.8352C14.7234 6.65881 14.6503 6.6244 14.6158 6.55556C14.5728 6.48672 14.5513 6.37917 14.5513 6.23289C14.5513 6.07801 14.5728 5.96185 14.6158 5.88441C14.6503 5.80697 14.7234 5.76824 14.8352 5.76824H15.9969ZM18.0749 1.3154H17.0423V0.399019H18.0749V1.3154ZM16.4357 1.3154H15.4031V0.399019H16.4357V1.3154ZM7.64082 16.4007C7.64082 16.8653 7.56768 17.2999 7.42141 17.7043C7.27513 18.1173 7.06432 18.4744 6.78897 18.7755C6.51363 19.0853 6.17805 19.3305 5.78224 19.5112C5.39504 19.6919 4.95621 19.7823 4.46575 19.7823H3.70425C2.74054 19.7823 1.99195 19.4854 1.45847 18.8917C0.924987 18.298 0.658246 17.4848 0.658246 16.4523V14.1936H1.48428V16.4265C1.48428 16.7965 1.5273 17.1321 1.61335 17.4332C1.708 17.7344 1.84997 17.9925 2.03927 18.2076C2.23718 18.4313 2.48241 18.6034 2.77496 18.7239C3.06751 18.8444 3.4203 18.9046 3.83332 18.9046H4.40122C4.80563 18.9046 5.15841 18.8358 5.45957 18.6981C5.76073 18.569 6.01026 18.3926 6.20817 18.1689C6.41468 17.9452 6.56526 17.6828 6.65991 17.3816C6.76316 17.0804 6.81479 16.7664 6.81479 16.4394V12.9675H7.64082V16.4007ZM4.53028 12.6835H3.44611V11.7413H4.53028V12.6835ZM10.9764 16.6588C10.7527 16.6588 10.5376 16.6287 10.3311 16.5685C10.1246 16.4996 9.93957 16.3878 9.77609 16.2329C9.62121 16.078 9.49644 15.8758 9.40179 15.6263C9.30714 15.3681 9.25982 15.0498 9.25982 14.6712V8.6566H10.0988V14.5163C10.0988 14.8777 10.1762 15.1788 10.3311 15.4198C10.4946 15.6521 10.757 15.7682 11.1184 15.7682H11.3378C11.5271 15.7682 11.6218 15.9145 11.6218 16.2071C11.6218 16.5082 11.5271 16.6588 11.3378 16.6588H10.9764ZM11.5504 15.7682C11.8859 15.7682 12.1398 15.6865 12.3119 15.523C12.484 15.3595 12.57 15.1401 12.57 14.8648V14.3743C12.57 13.6257 12.7593 13.0406 13.1379 12.619C13.5251 12.1974 14.0586 11.9866 14.7383 11.9866C15.0911 11.9866 15.4009 12.0425 15.6676 12.1543C15.9344 12.2662 16.1538 12.4254 16.3259 12.6319C16.5066 12.8384 16.6399 13.0836 16.726 13.3676C16.812 13.6515 16.8551 13.9656 16.8551 14.3098C16.8551 15.0498 16.6615 15.6263 16.2743 16.0393C15.8871 16.4523 15.3579 16.6588 14.6867 16.6588C14.3425 16.6588 14.0113 16.5943 13.6929 16.4652C13.3745 16.3275 13.125 16.0866 12.9443 15.7424C12.8669 15.9403 12.7722 16.0995 12.6604 16.22C12.5485 16.3404 12.4323 16.4351 12.3119 16.5039C12.1914 16.5642 12.0623 16.6072 11.9247 16.633C11.7956 16.6502 11.6708 16.6588 11.5504 16.6588H11.3439C11.232 16.6588 11.1589 16.6244 11.1244 16.5556C11.0814 16.4867 11.0599 16.3792 11.0599 16.2329C11.0599 16.078 11.0814 15.9618 11.1244 15.8844C11.1589 15.807 11.232 15.7682 11.3439 15.7682H11.5504ZM16.029 14.3872C16.029 13.9398 15.9301 13.5784 15.7322 13.303C15.5343 13.0191 15.1944 12.8771 14.7125 12.8771C13.8177 12.8771 13.3702 13.3977 13.3702 14.4388C13.3702 14.8777 13.4907 15.209 13.7316 15.4327C13.9811 15.6564 14.2995 15.7682 14.6867 15.7682C15.1256 15.7682 15.4568 15.6478 15.6805 15.4069C15.9129 15.1659 16.029 14.826 16.029 14.3872Z"
											fill="currentColor"></path>
									</svg>
								</span>
							</div>
							<div v-if="item.payable_type === 'Plan'" class="flex items-center justify-between">
								<span class="">{{ i + 1 }}.&nbsp; {{ $t("panel.financial.itemPlan") }} {{ item.payable.title
								}}</span>
								<span class="ms-2 whitespace-nowrap flex items-center">{{
									item.final_price.toLocaleString() }}
									<svg class="ms-1 w-3 h-3" viewBox="0 0 19 20" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M1.88439 8.9046C2.26299 8.9046 2.59427 8.84436 2.87821 8.7239C3.17077 8.60344 3.416 8.43995 3.6139 8.23344C3.81181 8.02693 3.96239 7.78601 4.06564 7.51066C4.16889 7.24392 4.22913 6.95997 4.24634 6.65881H2.95566C2.51682 6.65881 2.15543 6.61149 1.87149 6.51684C1.58754 6.42219 1.36382 6.28452 1.20033 6.10382C1.03685 5.92313 0.920685 5.70801 0.851848 5.45848C0.791617 5.20035 0.761501 4.91209 0.761501 4.59373C0.761501 4.26675 0.808826 3.95699 0.903475 3.66444C0.998125 3.37188 1.1358 3.11375 1.31649 2.89003C1.49719 2.66631 1.72091 2.48992 1.98765 2.36085C2.26299 2.22318 2.57706 2.15434 2.92984 2.15434C3.21379 2.15434 3.48483 2.20167 3.74297 2.29632C4.00111 2.39097 4.22913 2.54155 4.42703 2.74806C4.62493 2.94596 4.77982 3.2084 4.89167 3.53537C5.01214 3.85374 5.07237 4.24094 5.07237 4.69698V5.76824H6.31142C6.41468 5.76824 6.48351 5.80697 6.51793 5.88441C6.56095 5.95324 6.58246 6.0608 6.58246 6.20708C6.58246 6.36196 6.56095 6.47812 6.51793 6.55556C6.48351 6.6244 6.41468 6.65881 6.31142 6.65881H5.04656C5.02935 7.08044 4.9433 7.48055 4.78842 7.85915C4.64214 8.23774 4.43563 8.56902 4.16889 8.85297C3.90215 9.13692 3.58379 9.36064 3.21379 9.52412C2.8438 9.69621 2.42648 9.78226 1.96183 9.78226H0.593713L0.516272 8.9046H1.88439ZM1.56172 4.5421C1.56172 4.75721 1.58323 4.94221 1.62626 5.09709C1.67788 5.25197 1.75963 5.38104 1.87149 5.4843C1.99195 5.57895 2.15113 5.65208 2.34904 5.70371C2.54694 5.74673 2.79647 5.76824 3.09763 5.76824H4.25924V4.80024C4.25924 4.1635 4.13448 3.70746 3.88494 3.43212C3.63541 3.15677 3.29123 3.0191 2.8524 3.0191C2.43938 3.0191 2.12102 3.15677 1.8973 3.43212C1.67358 3.70746 1.56172 4.07745 1.56172 4.5421ZM8.44437 5.76824C8.55623 5.76824 8.62937 5.80697 8.66379 5.88441C8.70681 5.95324 8.72832 6.0608 8.72832 6.20708C8.72832 6.36196 8.70681 6.47812 8.66379 6.55556C8.62937 6.6244 8.55623 6.65881 8.44437 6.65881H6.31475C6.20289 6.65881 6.12975 6.6244 6.09533 6.55556C6.05231 6.48672 6.0308 6.37917 6.0308 6.23289C6.0308 6.07801 6.05231 5.96185 6.09533 5.88441C6.12975 5.80697 6.20289 5.76824 6.31475 5.76824H8.44437ZM10.5745 5.76824C10.6864 5.76824 10.7595 5.80697 10.7939 5.88441C10.8369 5.95324 10.8584 6.0608 10.8584 6.20708C10.8584 6.36196 10.8369 6.47812 10.7939 6.55556C10.7595 6.6244 10.6864 6.65881 10.5745 6.65881H8.44487C8.33301 6.65881 8.25988 6.6244 8.22546 6.55556C8.18244 6.48672 8.16092 6.37917 8.16092 6.23289C8.16092 6.07801 8.18244 5.96185 8.22546 5.88441C8.25988 5.80697 8.33301 5.76824 8.44487 5.76824H10.5745ZM12.7046 5.76824C12.8165 5.76824 12.8896 5.80697 12.924 5.88441C12.9671 5.95324 12.9886 6.0608 12.9886 6.20708C12.9886 6.36196 12.9671 6.47812 12.924 6.55556C12.8896 6.6244 12.8165 6.65881 12.7046 6.65881H10.575C10.4631 6.65881 10.39 6.6244 10.3556 6.55556C10.3126 6.48672 10.291 6.37917 10.291 6.23289C10.291 6.07801 10.3126 5.96185 10.3556 5.88441C10.39 5.80697 10.4631 5.76824 10.575 5.76824H12.7046ZM14.8347 5.76824C14.9466 5.76824 15.0197 5.80697 15.0542 5.88441C15.0972 5.95324 15.1187 6.0608 15.1187 6.20708C15.1187 6.36196 15.0972 6.47812 15.0542 6.55556C15.0197 6.6244 14.9466 6.65881 14.8347 6.65881H12.7051C12.5933 6.65881 12.5201 6.6244 12.4857 6.55556C12.4427 6.48672 12.4212 6.37917 12.4212 6.23289C12.4212 6.07801 12.4427 5.96185 12.4857 5.88441C12.5201 5.80697 12.5933 5.76824 12.7051 5.76824H14.8347ZM15.9969 5.76824C16.3324 5.76824 16.5992 5.6779 16.7971 5.4972C17.0036 5.31651 17.1068 5.06698 17.1068 4.74861V2.96747H17.9458V4.74861C17.9458 5.35953 17.7737 5.83278 17.4295 6.16836C17.0939 6.49533 16.6336 6.65881 16.0485 6.65881H14.8352C14.7234 6.65881 14.6503 6.6244 14.6158 6.55556C14.5728 6.48672 14.5513 6.37917 14.5513 6.23289C14.5513 6.07801 14.5728 5.96185 14.6158 5.88441C14.6503 5.80697 14.7234 5.76824 14.8352 5.76824H15.9969ZM18.0749 1.3154H17.0423V0.399019H18.0749V1.3154ZM16.4357 1.3154H15.4031V0.399019H16.4357V1.3154ZM7.64082 16.4007C7.64082 16.8653 7.56768 17.2999 7.42141 17.7043C7.27513 18.1173 7.06432 18.4744 6.78897 18.7755C6.51363 19.0853 6.17805 19.3305 5.78224 19.5112C5.39504 19.6919 4.95621 19.7823 4.46575 19.7823H3.70425C2.74054 19.7823 1.99195 19.4854 1.45847 18.8917C0.924987 18.298 0.658246 17.4848 0.658246 16.4523V14.1936H1.48428V16.4265C1.48428 16.7965 1.5273 17.1321 1.61335 17.4332C1.708 17.7344 1.84997 17.9925 2.03927 18.2076C2.23718 18.4313 2.48241 18.6034 2.77496 18.7239C3.06751 18.8444 3.4203 18.9046 3.83332 18.9046H4.40122C4.80563 18.9046 5.15841 18.8358 5.45957 18.6981C5.76073 18.569 6.01026 18.3926 6.20817 18.1689C6.41468 17.9452 6.56526 17.6828 6.65991 17.3816C6.76316 17.0804 6.81479 16.7664 6.81479 16.4394V12.9675H7.64082V16.4007ZM4.53028 12.6835H3.44611V11.7413H4.53028V12.6835ZM10.9764 16.6588C10.7527 16.6588 10.5376 16.6287 10.3311 16.5685C10.1246 16.4996 9.93957 16.3878 9.77609 16.2329C9.62121 16.078 9.49644 15.8758 9.40179 15.6263C9.30714 15.3681 9.25982 15.0498 9.25982 14.6712V8.6566H10.0988V14.5163C10.0988 14.8777 10.1762 15.1788 10.3311 15.4198C10.4946 15.6521 10.757 15.7682 11.1184 15.7682H11.3378C11.5271 15.7682 11.6218 15.9145 11.6218 16.2071C11.6218 16.5082 11.5271 16.6588 11.3378 16.6588H10.9764ZM11.5504 15.7682C11.8859 15.7682 12.1398 15.6865 12.3119 15.523C12.484 15.3595 12.57 15.1401 12.57 14.8648V14.3743C12.57 13.6257 12.7593 13.0406 13.1379 12.619C13.5251 12.1974 14.0586 11.9866 14.7383 11.9866C15.0911 11.9866 15.4009 12.0425 15.6676 12.1543C15.9344 12.2662 16.1538 12.4254 16.3259 12.6319C16.5066 12.8384 16.6399 13.0836 16.726 13.3676C16.812 13.6515 16.8551 13.9656 16.8551 14.3098C16.8551 15.0498 16.6615 15.6263 16.2743 16.0393C15.8871 16.4523 15.3579 16.6588 14.6867 16.6588C14.3425 16.6588 14.0113 16.5943 13.6929 16.4652C13.3745 16.3275 13.125 16.0866 12.9443 15.7424C12.8669 15.9403 12.7722 16.0995 12.6604 16.22C12.5485 16.3404 12.4323 16.4351 12.3119 16.5039C12.1914 16.5642 12.0623 16.6072 11.9247 16.633C11.7956 16.6502 11.6708 16.6588 11.5504 16.6588H11.3439C11.232 16.6588 11.1589 16.6244 11.1244 16.5556C11.0814 16.4867 11.0599 16.3792 11.0599 16.2329C11.0599 16.078 11.0814 15.9618 11.1244 15.8844C11.1589 15.807 11.232 15.7682 11.3439 15.7682H11.5504ZM16.029 14.3872C16.029 13.9398 15.9301 13.5784 15.7322 13.303C15.5343 13.0191 15.1944 12.8771 14.7125 12.8771C13.8177 12.8771 13.3702 13.3977 13.3702 14.4388C13.3702 14.8777 13.4907 15.209 13.7316 15.4327C13.9811 15.6564 14.2995 15.7682 14.6867 15.7682C15.1256 15.7682 15.4568 15.6478 15.6805 15.4069C15.9129 15.1659 16.029 14.826 16.029 14.3872Z"
											fill="currentColor"></path>
									</svg>
								</span>
							</div>
							<hr class="border-t border-gray-300 dark:border-gray-400 border-dashed my-2.5">
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
								<svg class="ms-1 w-3 h-3" viewBox="0 0 19 20" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M1.88439 8.9046C2.26299 8.9046 2.59427 8.84436 2.87821 8.7239C3.17077 8.60344 3.416 8.43995 3.6139 8.23344C3.81181 8.02693 3.96239 7.78601 4.06564 7.51066C4.16889 7.24392 4.22913 6.95997 4.24634 6.65881H2.95566C2.51682 6.65881 2.15543 6.61149 1.87149 6.51684C1.58754 6.42219 1.36382 6.28452 1.20033 6.10382C1.03685 5.92313 0.920685 5.70801 0.851848 5.45848C0.791617 5.20035 0.761501 4.91209 0.761501 4.59373C0.761501 4.26675 0.808826 3.95699 0.903475 3.66444C0.998125 3.37188 1.1358 3.11375 1.31649 2.89003C1.49719 2.66631 1.72091 2.48992 1.98765 2.36085C2.26299 2.22318 2.57706 2.15434 2.92984 2.15434C3.21379 2.15434 3.48483 2.20167 3.74297 2.29632C4.00111 2.39097 4.22913 2.54155 4.42703 2.74806C4.62493 2.94596 4.77982 3.2084 4.89167 3.53537C5.01214 3.85374 5.07237 4.24094 5.07237 4.69698V5.76824H6.31142C6.41468 5.76824 6.48351 5.80697 6.51793 5.88441C6.56095 5.95324 6.58246 6.0608 6.58246 6.20708C6.58246 6.36196 6.56095 6.47812 6.51793 6.55556C6.48351 6.6244 6.41468 6.65881 6.31142 6.65881H5.04656C5.02935 7.08044 4.9433 7.48055 4.78842 7.85915C4.64214 8.23774 4.43563 8.56902 4.16889 8.85297C3.90215 9.13692 3.58379 9.36064 3.21379 9.52412C2.8438 9.69621 2.42648 9.78226 1.96183 9.78226H0.593713L0.516272 8.9046H1.88439ZM1.56172 4.5421C1.56172 4.75721 1.58323 4.94221 1.62626 5.09709C1.67788 5.25197 1.75963 5.38104 1.87149 5.4843C1.99195 5.57895 2.15113 5.65208 2.34904 5.70371C2.54694 5.74673 2.79647 5.76824 3.09763 5.76824H4.25924V4.80024C4.25924 4.1635 4.13448 3.70746 3.88494 3.43212C3.63541 3.15677 3.29123 3.0191 2.8524 3.0191C2.43938 3.0191 2.12102 3.15677 1.8973 3.43212C1.67358 3.70746 1.56172 4.07745 1.56172 4.5421ZM8.44437 5.76824C8.55623 5.76824 8.62937 5.80697 8.66379 5.88441C8.70681 5.95324 8.72832 6.0608 8.72832 6.20708C8.72832 6.36196 8.70681 6.47812 8.66379 6.55556C8.62937 6.6244 8.55623 6.65881 8.44437 6.65881H6.31475C6.20289 6.65881 6.12975 6.6244 6.09533 6.55556C6.05231 6.48672 6.0308 6.37917 6.0308 6.23289C6.0308 6.07801 6.05231 5.96185 6.09533 5.88441C6.12975 5.80697 6.20289 5.76824 6.31475 5.76824H8.44437ZM10.5745 5.76824C10.6864 5.76824 10.7595 5.80697 10.7939 5.88441C10.8369 5.95324 10.8584 6.0608 10.8584 6.20708C10.8584 6.36196 10.8369 6.47812 10.7939 6.55556C10.7595 6.6244 10.6864 6.65881 10.5745 6.65881H8.44487C8.33301 6.65881 8.25988 6.6244 8.22546 6.55556C8.18244 6.48672 8.16092 6.37917 8.16092 6.23289C8.16092 6.07801 8.18244 5.96185 8.22546 5.88441C8.25988 5.80697 8.33301 5.76824 8.44487 5.76824H10.5745ZM12.7046 5.76824C12.8165 5.76824 12.8896 5.80697 12.924 5.88441C12.9671 5.95324 12.9886 6.0608 12.9886 6.20708C12.9886 6.36196 12.9671 6.47812 12.924 6.55556C12.8896 6.6244 12.8165 6.65881 12.7046 6.65881H10.575C10.4631 6.65881 10.39 6.6244 10.3556 6.55556C10.3126 6.48672 10.291 6.37917 10.291 6.23289C10.291 6.07801 10.3126 5.96185 10.3556 5.88441C10.39 5.80697 10.4631 5.76824 10.575 5.76824H12.7046ZM14.8347 5.76824C14.9466 5.76824 15.0197 5.80697 15.0542 5.88441C15.0972 5.95324 15.1187 6.0608 15.1187 6.20708C15.1187 6.36196 15.0972 6.47812 15.0542 6.55556C15.0197 6.6244 14.9466 6.65881 14.8347 6.65881H12.7051C12.5933 6.65881 12.5201 6.6244 12.4857 6.55556C12.4427 6.48672 12.4212 6.37917 12.4212 6.23289C12.4212 6.07801 12.4427 5.96185 12.4857 5.88441C12.5201 5.80697 12.5933 5.76824 12.7051 5.76824H14.8347ZM15.9969 5.76824C16.3324 5.76824 16.5992 5.6779 16.7971 5.4972C17.0036 5.31651 17.1068 5.06698 17.1068 4.74861V2.96747H17.9458V4.74861C17.9458 5.35953 17.7737 5.83278 17.4295 6.16836C17.0939 6.49533 16.6336 6.65881 16.0485 6.65881H14.8352C14.7234 6.65881 14.6503 6.6244 14.6158 6.55556C14.5728 6.48672 14.5513 6.37917 14.5513 6.23289C14.5513 6.07801 14.5728 5.96185 14.6158 5.88441C14.6503 5.80697 14.7234 5.76824 14.8352 5.76824H15.9969ZM18.0749 1.3154H17.0423V0.399019H18.0749V1.3154ZM16.4357 1.3154H15.4031V0.399019H16.4357V1.3154ZM7.64082 16.4007C7.64082 16.8653 7.56768 17.2999 7.42141 17.7043C7.27513 18.1173 7.06432 18.4744 6.78897 18.7755C6.51363 19.0853 6.17805 19.3305 5.78224 19.5112C5.39504 19.6919 4.95621 19.7823 4.46575 19.7823H3.70425C2.74054 19.7823 1.99195 19.4854 1.45847 18.8917C0.924987 18.298 0.658246 17.4848 0.658246 16.4523V14.1936H1.48428V16.4265C1.48428 16.7965 1.5273 17.1321 1.61335 17.4332C1.708 17.7344 1.84997 17.9925 2.03927 18.2076C2.23718 18.4313 2.48241 18.6034 2.77496 18.7239C3.06751 18.8444 3.4203 18.9046 3.83332 18.9046H4.40122C4.80563 18.9046 5.15841 18.8358 5.45957 18.6981C5.76073 18.569 6.01026 18.3926 6.20817 18.1689C6.41468 17.9452 6.56526 17.6828 6.65991 17.3816C6.76316 17.0804 6.81479 16.7664 6.81479 16.4394V12.9675H7.64082V16.4007ZM4.53028 12.6835H3.44611V11.7413H4.53028V12.6835ZM10.9764 16.6588C10.7527 16.6588 10.5376 16.6287 10.3311 16.5685C10.1246 16.4996 9.93957 16.3878 9.77609 16.2329C9.62121 16.078 9.49644 15.8758 9.40179 15.6263C9.30714 15.3681 9.25982 15.0498 9.25982 14.6712V8.6566H10.0988V14.5163C10.0988 14.8777 10.1762 15.1788 10.3311 15.4198C10.4946 15.6521 10.757 15.7682 11.1184 15.7682H11.3378C11.5271 15.7682 11.6218 15.9145 11.6218 16.2071C11.6218 16.5082 11.5271 16.6588 11.3378 16.6588H10.9764ZM11.5504 15.7682C11.8859 15.7682 12.1398 15.6865 12.3119 15.523C12.484 15.3595 12.57 15.1401 12.57 14.8648V14.3743C12.57 13.6257 12.7593 13.0406 13.1379 12.619C13.5251 12.1974 14.0586 11.9866 14.7383 11.9866C15.0911 11.9866 15.4009 12.0425 15.6676 12.1543C15.9344 12.2662 16.1538 12.4254 16.3259 12.6319C16.5066 12.8384 16.6399 13.0836 16.726 13.3676C16.812 13.6515 16.8551 13.9656 16.8551 14.3098C16.8551 15.0498 16.6615 15.6263 16.2743 16.0393C15.8871 16.4523 15.3579 16.6588 14.6867 16.6588C14.3425 16.6588 14.0113 16.5943 13.6929 16.4652C13.3745 16.3275 13.125 16.0866 12.9443 15.7424C12.8669 15.9403 12.7722 16.0995 12.6604 16.22C12.5485 16.3404 12.4323 16.4351 12.3119 16.5039C12.1914 16.5642 12.0623 16.6072 11.9247 16.633C11.7956 16.6502 11.6708 16.6588 11.5504 16.6588H11.3439C11.232 16.6588 11.1589 16.6244 11.1244 16.5556C11.0814 16.4867 11.0599 16.3792 11.0599 16.2329C11.0599 16.078 11.0814 15.9618 11.1244 15.8844C11.1589 15.807 11.232 15.7682 11.3439 15.7682H11.5504ZM16.029 14.3872C16.029 13.9398 15.9301 13.5784 15.7322 13.303C15.5343 13.0191 15.1944 12.8771 14.7125 12.8771C13.8177 12.8771 13.3702 13.3977 13.3702 14.4388C13.3702 14.8777 13.4907 15.209 13.7316 15.4327C13.9811 15.6564 14.2995 15.7682 14.6867 15.7682C15.1256 15.7682 15.4568 15.6478 15.6805 15.4069C15.9129 15.1659 16.029 14.826 16.029 14.3872Z"
										fill="currentColor"></path>
								</svg>
							</span>
						</div>
						<div class="flex items-center justify-between mt-2">
							<span>{{ $t("panel.financial.discount") }}</span>
							<span class="ms-2 whitespace-nowrap flex items-center">{{
								selectedPayment.discount_amount.toLocaleString() }}
								<svg class="ms-1 w-3 h-3" viewBox="0 0 19 20" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M1.88439 8.9046C2.26299 8.9046 2.59427 8.84436 2.87821 8.7239C3.17077 8.60344 3.416 8.43995 3.6139 8.23344C3.81181 8.02693 3.96239 7.78601 4.06564 7.51066C4.16889 7.24392 4.22913 6.95997 4.24634 6.65881H2.95566C2.51682 6.65881 2.15543 6.61149 1.87149 6.51684C1.58754 6.42219 1.36382 6.28452 1.20033 6.10382C1.03685 5.92313 0.920685 5.70801 0.851848 5.45848C0.791617 5.20035 0.761501 4.91209 0.761501 4.59373C0.761501 4.26675 0.808826 3.95699 0.903475 3.66444C0.998125 3.37188 1.1358 3.11375 1.31649 2.89003C1.49719 2.66631 1.72091 2.48992 1.98765 2.36085C2.26299 2.22318 2.57706 2.15434 2.92984 2.15434C3.21379 2.15434 3.48483 2.20167 3.74297 2.29632C4.00111 2.39097 4.22913 2.54155 4.42703 2.74806C4.62493 2.94596 4.77982 3.2084 4.89167 3.53537C5.01214 3.85374 5.07237 4.24094 5.07237 4.69698V5.76824H6.31142C6.41468 5.76824 6.48351 5.80697 6.51793 5.88441C6.56095 5.95324 6.58246 6.0608 6.58246 6.20708C6.58246 6.36196 6.56095 6.47812 6.51793 6.55556C6.48351 6.6244 6.41468 6.65881 6.31142 6.65881H5.04656C5.02935 7.08044 4.9433 7.48055 4.78842 7.85915C4.64214 8.23774 4.43563 8.56902 4.16889 8.85297C3.90215 9.13692 3.58379 9.36064 3.21379 9.52412C2.8438 9.69621 2.42648 9.78226 1.96183 9.78226H0.593713L0.516272 8.9046H1.88439ZM1.56172 4.5421C1.56172 4.75721 1.58323 4.94221 1.62626 5.09709C1.67788 5.25197 1.75963 5.38104 1.87149 5.4843C1.99195 5.57895 2.15113 5.65208 2.34904 5.70371C2.54694 5.74673 2.79647 5.76824 3.09763 5.76824H4.25924V4.80024C4.25924 4.1635 4.13448 3.70746 3.88494 3.43212C3.63541 3.15677 3.29123 3.0191 2.8524 3.0191C2.43938 3.0191 2.12102 3.15677 1.8973 3.43212C1.67358 3.70746 1.56172 4.07745 1.56172 4.5421ZM8.44437 5.76824C8.55623 5.76824 8.62937 5.80697 8.66379 5.88441C8.70681 5.95324 8.72832 6.0608 8.72832 6.20708C8.72832 6.36196 8.70681 6.47812 8.66379 6.55556C8.62937 6.6244 8.55623 6.65881 8.44437 6.65881H6.31475C6.20289 6.65881 6.12975 6.6244 6.09533 6.55556C6.05231 6.48672 6.0308 6.37917 6.0308 6.23289C6.0308 6.07801 6.05231 5.96185 6.09533 5.88441C6.12975 5.80697 6.20289 5.76824 6.31475 5.76824H8.44437ZM10.5745 5.76824C10.6864 5.76824 10.7595 5.80697 10.7939 5.88441C10.8369 5.95324 10.8584 6.0608 10.8584 6.20708C10.8584 6.36196 10.8369 6.47812 10.7939 6.55556C10.7595 6.6244 10.6864 6.65881 10.5745 6.65881H8.44487C8.33301 6.65881 8.25988 6.6244 8.22546 6.55556C8.18244 6.48672 8.16092 6.37917 8.16092 6.23289C8.16092 6.07801 8.18244 5.96185 8.22546 5.88441C8.25988 5.80697 8.33301 5.76824 8.44487 5.76824H10.5745ZM12.7046 5.76824C12.8165 5.76824 12.8896 5.80697 12.924 5.88441C12.9671 5.95324 12.9886 6.0608 12.9886 6.20708C12.9886 6.36196 12.9671 6.47812 12.924 6.55556C12.8896 6.6244 12.8165 6.65881 12.7046 6.65881H10.575C10.4631 6.65881 10.39 6.6244 10.3556 6.55556C10.3126 6.48672 10.291 6.37917 10.291 6.23289C10.291 6.07801 10.3126 5.96185 10.3556 5.88441C10.39 5.80697 10.4631 5.76824 10.575 5.76824H12.7046ZM14.8347 5.76824C14.9466 5.76824 15.0197 5.80697 15.0542 5.88441C15.0972 5.95324 15.1187 6.0608 15.1187 6.20708C15.1187 6.36196 15.0972 6.47812 15.0542 6.55556C15.0197 6.6244 14.9466 6.65881 14.8347 6.65881H12.7051C12.5933 6.65881 12.5201 6.6244 12.4857 6.55556C12.4427 6.48672 12.4212 6.37917 12.4212 6.23289C12.4212 6.07801 12.4427 5.96185 12.4857 5.88441C12.5201 5.80697 12.5933 5.76824 12.7051 5.76824H14.8347ZM15.9969 5.76824C16.3324 5.76824 16.5992 5.6779 16.7971 5.4972C17.0036 5.31651 17.1068 5.06698 17.1068 4.74861V2.96747H17.9458V4.74861C17.9458 5.35953 17.7737 5.83278 17.4295 6.16836C17.0939 6.49533 16.6336 6.65881 16.0485 6.65881H14.8352C14.7234 6.65881 14.6503 6.6244 14.6158 6.55556C14.5728 6.48672 14.5513 6.37917 14.5513 6.23289C14.5513 6.07801 14.5728 5.96185 14.6158 5.88441C14.6503 5.80697 14.7234 5.76824 14.8352 5.76824H15.9969ZM18.0749 1.3154H17.0423V0.399019H18.0749V1.3154ZM16.4357 1.3154H15.4031V0.399019H16.4357V1.3154ZM7.64082 16.4007C7.64082 16.8653 7.56768 17.2999 7.42141 17.7043C7.27513 18.1173 7.06432 18.4744 6.78897 18.7755C6.51363 19.0853 6.17805 19.3305 5.78224 19.5112C5.39504 19.6919 4.95621 19.7823 4.46575 19.7823H3.70425C2.74054 19.7823 1.99195 19.4854 1.45847 18.8917C0.924987 18.298 0.658246 17.4848 0.658246 16.4523V14.1936H1.48428V16.4265C1.48428 16.7965 1.5273 17.1321 1.61335 17.4332C1.708 17.7344 1.84997 17.9925 2.03927 18.2076C2.23718 18.4313 2.48241 18.6034 2.77496 18.7239C3.06751 18.8444 3.4203 18.9046 3.83332 18.9046H4.40122C4.80563 18.9046 5.15841 18.8358 5.45957 18.6981C5.76073 18.569 6.01026 18.3926 6.20817 18.1689C6.41468 17.9452 6.56526 17.6828 6.65991 17.3816C6.76316 17.0804 6.81479 16.7664 6.81479 16.4394V12.9675H7.64082V16.4007ZM4.53028 12.6835H3.44611V11.7413H4.53028V12.6835ZM10.9764 16.6588C10.7527 16.6588 10.5376 16.6287 10.3311 16.5685C10.1246 16.4996 9.93957 16.3878 9.77609 16.2329C9.62121 16.078 9.49644 15.8758 9.40179 15.6263C9.30714 15.3681 9.25982 15.0498 9.25982 14.6712V8.6566H10.0988V14.5163C10.0988 14.8777 10.1762 15.1788 10.3311 15.4198C10.4946 15.6521 10.757 15.7682 11.1184 15.7682H11.3378C11.5271 15.7682 11.6218 15.9145 11.6218 16.2071C11.6218 16.5082 11.5271 16.6588 11.3378 16.6588H10.9764ZM11.5504 15.7682C11.8859 15.7682 12.1398 15.6865 12.3119 15.523C12.484 15.3595 12.57 15.1401 12.57 14.8648V14.3743C12.57 13.6257 12.7593 13.0406 13.1379 12.619C13.5251 12.1974 14.0586 11.9866 14.7383 11.9866C15.0911 11.9866 15.4009 12.0425 15.6676 12.1543C15.9344 12.2662 16.1538 12.4254 16.3259 12.6319C16.5066 12.8384 16.6399 13.0836 16.726 13.3676C16.812 13.6515 16.8551 13.9656 16.8551 14.3098C16.8551 15.0498 16.6615 15.6263 16.2743 16.0393C15.8871 16.4523 15.3579 16.6588 14.6867 16.6588C14.3425 16.6588 14.0113 16.5943 13.6929 16.4652C13.3745 16.3275 13.125 16.0866 12.9443 15.7424C12.8669 15.9403 12.7722 16.0995 12.6604 16.22C12.5485 16.3404 12.4323 16.4351 12.3119 16.5039C12.1914 16.5642 12.0623 16.6072 11.9247 16.633C11.7956 16.6502 11.6708 16.6588 11.5504 16.6588H11.3439C11.232 16.6588 11.1589 16.6244 11.1244 16.5556C11.0814 16.4867 11.0599 16.3792 11.0599 16.2329C11.0599 16.078 11.0814 15.9618 11.1244 15.8844C11.1589 15.807 11.232 15.7682 11.3439 15.7682H11.5504ZM16.029 14.3872C16.029 13.9398 15.9301 13.5784 15.7322 13.303C15.5343 13.0191 15.1944 12.8771 14.7125 12.8771C13.8177 12.8771 13.3702 13.3977 13.3702 14.4388C13.3702 14.8777 13.4907 15.209 13.7316 15.4327C13.9811 15.6564 14.2995 15.7682 14.6867 15.7682C15.1256 15.7682 15.4568 15.6478 15.6805 15.4069C15.9129 15.1659 16.029 14.826 16.029 14.3872Z"
										fill="currentColor"></path>
								</svg>
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
						<div class="flex items-center justify-between text-sm font-bold text-black mt-2">
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
								<svg class="ms-1 w-3 h-3" viewBox="0 0 19 20" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M1.88439 8.9046C2.26299 8.9046 2.59427 8.84436 2.87821 8.7239C3.17077 8.60344 3.416 8.43995 3.6139 8.23344C3.81181 8.02693 3.96239 7.78601 4.06564 7.51066C4.16889 7.24392 4.22913 6.95997 4.24634 6.65881H2.95566C2.51682 6.65881 2.15543 6.61149 1.87149 6.51684C1.58754 6.42219 1.36382 6.28452 1.20033 6.10382C1.03685 5.92313 0.920685 5.70801 0.851848 5.45848C0.791617 5.20035 0.761501 4.91209 0.761501 4.59373C0.761501 4.26675 0.808826 3.95699 0.903475 3.66444C0.998125 3.37188 1.1358 3.11375 1.31649 2.89003C1.49719 2.66631 1.72091 2.48992 1.98765 2.36085C2.26299 2.22318 2.57706 2.15434 2.92984 2.15434C3.21379 2.15434 3.48483 2.20167 3.74297 2.29632C4.00111 2.39097 4.22913 2.54155 4.42703 2.74806C4.62493 2.94596 4.77982 3.2084 4.89167 3.53537C5.01214 3.85374 5.07237 4.24094 5.07237 4.69698V5.76824H6.31142C6.41468 5.76824 6.48351 5.80697 6.51793 5.88441C6.56095 5.95324 6.58246 6.0608 6.58246 6.20708C6.58246 6.36196 6.56095 6.47812 6.51793 6.55556C6.48351 6.6244 6.41468 6.65881 6.31142 6.65881H5.04656C5.02935 7.08044 4.9433 7.48055 4.78842 7.85915C4.64214 8.23774 4.43563 8.56902 4.16889 8.85297C3.90215 9.13692 3.58379 9.36064 3.21379 9.52412C2.8438 9.69621 2.42648 9.78226 1.96183 9.78226H0.593713L0.516272 8.9046H1.88439ZM1.56172 4.5421C1.56172 4.75721 1.58323 4.94221 1.62626 5.09709C1.67788 5.25197 1.75963 5.38104 1.87149 5.4843C1.99195 5.57895 2.15113 5.65208 2.34904 5.70371C2.54694 5.74673 2.79647 5.76824 3.09763 5.76824H4.25924V4.80024C4.25924 4.1635 4.13448 3.70746 3.88494 3.43212C3.63541 3.15677 3.29123 3.0191 2.8524 3.0191C2.43938 3.0191 2.12102 3.15677 1.8973 3.43212C1.67358 3.70746 1.56172 4.07745 1.56172 4.5421ZM8.44437 5.76824C8.55623 5.76824 8.62937 5.80697 8.66379 5.88441C8.70681 5.95324 8.72832 6.0608 8.72832 6.20708C8.72832 6.36196 8.70681 6.47812 8.66379 6.55556C8.62937 6.6244 8.55623 6.65881 8.44437 6.65881H6.31475C6.20289 6.65881 6.12975 6.6244 6.09533 6.55556C6.05231 6.48672 6.0308 6.37917 6.0308 6.23289C6.0308 6.07801 6.05231 5.96185 6.09533 5.88441C6.12975 5.80697 6.20289 5.76824 6.31475 5.76824H8.44437ZM10.5745 5.76824C10.6864 5.76824 10.7595 5.80697 10.7939 5.88441C10.8369 5.95324 10.8584 6.0608 10.8584 6.20708C10.8584 6.36196 10.8369 6.47812 10.7939 6.55556C10.7595 6.6244 10.6864 6.65881 10.5745 6.65881H8.44487C8.33301 6.65881 8.25988 6.6244 8.22546 6.55556C8.18244 6.48672 8.16092 6.37917 8.16092 6.23289C8.16092 6.07801 8.18244 5.96185 8.22546 5.88441C8.25988 5.80697 8.33301 5.76824 8.44487 5.76824H10.5745ZM12.7046 5.76824C12.8165 5.76824 12.8896 5.80697 12.924 5.88441C12.9671 5.95324 12.9886 6.0608 12.9886 6.20708C12.9886 6.36196 12.9671 6.47812 12.924 6.55556C12.8896 6.6244 12.8165 6.65881 12.7046 6.65881H10.575C10.4631 6.65881 10.39 6.6244 10.3556 6.55556C10.3126 6.48672 10.291 6.37917 10.291 6.23289C10.291 6.07801 10.3126 5.96185 10.3556 5.88441C10.39 5.80697 10.4631 5.76824 10.575 5.76824H12.7046ZM14.8347 5.76824C14.9466 5.76824 15.0197 5.80697 15.0542 5.88441C15.0972 5.95324 15.1187 6.0608 15.1187 6.20708C15.1187 6.36196 15.0972 6.47812 15.0542 6.55556C15.0197 6.6244 14.9466 6.65881 14.8347 6.65881H12.7051C12.5933 6.65881 12.5201 6.6244 12.4857 6.55556C12.4427 6.48672 12.4212 6.37917 12.4212 6.23289C12.4212 6.07801 12.4427 5.96185 12.4857 5.88441C12.5201 5.80697 12.5933 5.76824 12.7051 5.76824H14.8347ZM15.9969 5.76824C16.3324 5.76824 16.5992 5.6779 16.7971 5.4972C17.0036 5.31651 17.1068 5.06698 17.1068 4.74861V2.96747H17.9458V4.74861C17.9458 5.35953 17.7737 5.83278 17.4295 6.16836C17.0939 6.49533 16.6336 6.65881 16.0485 6.65881H14.8352C14.7234 6.65881 14.6503 6.6244 14.6158 6.55556C14.5728 6.48672 14.5513 6.37917 14.5513 6.23289C14.5513 6.07801 14.5728 5.96185 14.6158 5.88441C14.6503 5.80697 14.7234 5.76824 14.8352 5.76824H15.9969ZM18.0749 1.3154H17.0423V0.399019H18.0749V1.3154ZM16.4357 1.3154H15.4031V0.399019H16.4357V1.3154ZM7.64082 16.4007C7.64082 16.8653 7.56768 17.2999 7.42141 17.7043C7.27513 18.1173 7.06432 18.4744 6.78897 18.7755C6.51363 19.0853 6.17805 19.3305 5.78224 19.5112C5.39504 19.6919 4.95621 19.7823 4.46575 19.7823H3.70425C2.74054 19.7823 1.99195 19.4854 1.45847 18.8917C0.924987 18.298 0.658246 17.4848 0.658246 16.4523V14.1936H1.48428V16.4265C1.48428 16.7965 1.5273 17.1321 1.61335 17.4332C1.708 17.7344 1.84997 17.9925 2.03927 18.2076C2.23718 18.4313 2.48241 18.6034 2.77496 18.7239C3.06751 18.8444 3.4203 18.9046 3.83332 18.9046H4.40122C4.80563 18.9046 5.15841 18.8358 5.45957 18.6981C5.76073 18.569 6.01026 18.3926 6.20817 18.1689C6.41468 17.9452 6.56526 17.6828 6.65991 17.3816C6.76316 17.0804 6.81479 16.7664 6.81479 16.4394V12.9675H7.64082V16.4007ZM4.53028 12.6835H3.44611V11.7413H4.53028V12.6835ZM10.9764 16.6588C10.7527 16.6588 10.5376 16.6287 10.3311 16.5685C10.1246 16.4996 9.93957 16.3878 9.77609 16.2329C9.62121 16.078 9.49644 15.8758 9.40179 15.6263C9.30714 15.3681 9.25982 15.0498 9.25982 14.6712V8.6566H10.0988V14.5163C10.0988 14.8777 10.1762 15.1788 10.3311 15.4198C10.4946 15.6521 10.757 15.7682 11.1184 15.7682H11.3378C11.5271 15.7682 11.6218 15.9145 11.6218 16.2071C11.6218 16.5082 11.5271 16.6588 11.3378 16.6588H10.9764ZM11.5504 15.7682C11.8859 15.7682 12.1398 15.6865 12.3119 15.523C12.484 15.3595 12.57 15.1401 12.57 14.8648V14.3743C12.57 13.6257 12.7593 13.0406 13.1379 12.619C13.5251 12.1974 14.0586 11.9866 14.7383 11.9866C15.0911 11.9866 15.4009 12.0425 15.6676 12.1543C15.9344 12.2662 16.1538 12.4254 16.3259 12.6319C16.5066 12.8384 16.6399 13.0836 16.726 13.3676C16.812 13.6515 16.8551 13.9656 16.8551 14.3098C16.8551 15.0498 16.6615 15.6263 16.2743 16.0393C15.8871 16.4523 15.3579 16.6588 14.6867 16.6588C14.3425 16.6588 14.0113 16.5943 13.6929 16.4652C13.3745 16.3275 13.125 16.0866 12.9443 15.7424C12.8669 15.9403 12.7722 16.0995 12.6604 16.22C12.5485 16.3404 12.4323 16.4351 12.3119 16.5039C12.1914 16.5642 12.0623 16.6072 11.9247 16.633C11.7956 16.6502 11.6708 16.6588 11.5504 16.6588H11.3439C11.232 16.6588 11.1589 16.6244 11.1244 16.5556C11.0814 16.4867 11.0599 16.3792 11.0599 16.2329C11.0599 16.078 11.0814 15.9618 11.1244 15.8844C11.1589 15.807 11.232 15.7682 11.3439 15.7682H11.5504ZM16.029 14.3872C16.029 13.9398 15.9301 13.5784 15.7322 13.303C15.5343 13.0191 15.1944 12.8771 14.7125 12.8771C13.8177 12.8771 13.3702 13.3977 13.3702 14.4388C13.3702 14.8777 13.4907 15.209 13.7316 15.4327C13.9811 15.6564 14.2995 15.7682 14.6867 15.7682C15.1256 15.7682 15.4568 15.6478 15.6805 15.4069C15.9129 15.1659 16.029 14.826 16.029 14.3872Z"
										fill="currentColor"></path>
								</svg>
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
							<svg class="ms-1 w-3 h-3" viewBox="0 0 13 14" fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M1.30583 6.0764C1.56819 6.0764 1.79775 6.03467 1.99452 5.95119C2.19725 5.86771 2.36719 5.75442 2.50433 5.61131C2.64147 5.46821 2.74582 5.30125 2.81737 5.11045C2.88892 4.9256 2.93066 4.72884 2.94259 4.52014H2.04818C1.74409 4.52014 1.49365 4.48735 1.29689 4.42176C1.10012 4.35617 0.945087 4.26076 0.831796 4.13555C0.718504 4.01033 0.638008 3.86126 0.590307 3.68835C0.548568 3.50947 0.527698 3.30972 0.527698 3.0891C0.527698 2.86251 0.560493 2.64786 0.626083 2.44512C0.691672 2.24239 0.787075 2.06351 0.912292 1.90848C1.03751 1.75345 1.19254 1.63122 1.37738 1.54178C1.56819 1.44637 1.78583 1.39867 2.0303 1.39867C2.22707 1.39867 2.41489 1.43147 2.59377 1.49706C2.77265 1.56265 2.93066 1.66699 3.06781 1.8101C3.20495 1.94724 3.31228 2.1291 3.38979 2.35568C3.47327 2.5763 3.51501 2.84462 3.51501 3.16065V3.903H4.37363C4.44519 3.903 4.49289 3.92984 4.51674 3.9835C4.54655 4.0312 4.56146 4.10573 4.56146 4.2071C4.56146 4.31443 4.54655 4.39493 4.51674 4.44859C4.49289 4.49629 4.44519 4.52014 4.37363 4.52014H3.49712C3.48519 4.81231 3.42557 5.08958 3.31824 5.35194C3.21687 5.6143 3.07377 5.84386 2.88892 6.04063C2.70408 6.2374 2.48346 6.39243 2.22707 6.50572C1.97067 6.62497 1.68148 6.6846 1.35949 6.6846H0.411426L0.357762 6.0764H1.30583ZM1.08223 3.05332C1.08223 3.20239 1.09714 3.33058 1.12695 3.43791C1.16272 3.54524 1.21937 3.63468 1.29689 3.70623C1.38036 3.77182 1.49067 3.82251 1.62782 3.85828C1.76496 3.8881 1.93788 3.903 2.14657 3.903H2.95153V3.2322C2.95153 2.79096 2.86507 2.47494 2.69216 2.28413C2.51924 2.09333 2.28073 1.99792 1.97663 1.99792C1.69042 1.99792 1.4698 2.09333 1.31477 2.28413C1.15974 2.47494 1.08223 2.73133 1.08223 3.05332ZM5.85171 3.903C5.92922 3.903 5.97991 3.92984 6.00376 3.9835C6.03357 4.0312 6.04848 4.10573 6.04848 4.2071C6.04848 4.31443 6.03357 4.39493 6.00376 4.44859C5.97991 4.49629 5.92922 4.52014 5.85171 4.52014H4.37594C4.29843 4.52014 4.24774 4.49629 4.22389 4.44859C4.19408 4.40089 4.17917 4.32635 4.17917 4.22499C4.17917 4.11766 4.19408 4.03716 4.22389 3.9835C4.24774 3.92984 4.29843 3.903 4.37594 3.903H5.85171ZM7.32782 3.903C7.40534 3.903 7.45602 3.92984 7.47987 3.9835C7.50969 4.0312 7.52459 4.10573 7.52459 4.2071C7.52459 4.31443 7.50969 4.39493 7.47987 4.44859C7.45602 4.49629 7.40534 4.52014 7.32782 4.52014H5.85206C5.77454 4.52014 5.72386 4.49629 5.70001 4.44859C5.67019 4.40089 5.65529 4.32635 5.65529 4.22499C5.65529 4.11766 5.67019 4.03716 5.70001 3.9835C5.72386 3.92984 5.77454 3.903 5.85206 3.903H7.32782ZM8.80394 3.903C8.88145 3.903 8.93214 3.92984 8.95599 3.9835C8.9858 4.0312 9.00071 4.10573 9.00071 4.2071C9.00071 4.31443 8.9858 4.39493 8.95599 4.44859C8.93214 4.49629 8.88145 4.52014 8.80394 4.52014H7.32817C7.25066 4.52014 7.19997 4.49629 7.17612 4.44859C7.14631 4.40089 7.1314 4.32635 7.1314 4.22499C7.1314 4.11766 7.14631 4.03716 7.17612 3.9835C7.19997 3.92984 7.25066 3.903 7.32817 3.903H8.80394ZM10.2801 3.903C10.3576 3.903 10.4083 3.92984 10.4321 3.9835C10.4619 4.0312 10.4768 4.10573 10.4768 4.2071C10.4768 4.31443 10.4619 4.39493 10.4321 4.44859C10.4083 4.49629 10.3576 4.52014 10.2801 4.52014H8.80429C8.72677 4.52014 8.67609 4.49629 8.65224 4.44859C8.62243 4.40089 8.60752 4.32635 8.60752 4.22499C8.60752 4.11766 8.62243 4.03716 8.65224 3.9835C8.67609 3.92984 8.72677 3.903 8.80429 3.903H10.2801ZM11.0854 3.903C11.3179 3.903 11.5028 3.84039 11.6399 3.71518C11.783 3.58996 11.8546 3.41704 11.8546 3.19642V1.96215H12.4359V3.19642C12.4359 3.61978 12.3167 3.94772 12.0782 4.18027C11.8456 4.40685 11.5266 4.52014 11.1211 4.52014H10.2804C10.2029 4.52014 10.1522 4.49629 10.1284 4.44859C10.0985 4.40089 10.0836 4.32635 10.0836 4.22499C10.0836 4.11766 10.0985 4.03716 10.1284 3.9835C10.1522 3.92984 10.2029 3.903 10.2804 3.903H11.0854ZM12.5254 0.817309H11.8098V0.182283H12.5254V0.817309ZM11.3895 0.817309H10.6739V0.182283H11.3895V0.817309ZM5.29487 11.3413C5.29487 11.6632 5.24419 11.9644 5.14282 12.2446C5.04146 12.5308 4.89537 12.7783 4.70456 12.987C4.51376 13.2016 4.28121 13.3716 4.00693 13.4968C3.73861 13.622 3.43451 13.6846 3.09464 13.6846H2.56694C1.89912 13.6846 1.38036 13.4789 1.01068 13.0675C0.640989 12.656 0.456146 12.0926 0.456146 11.377V9.81183H1.02856V11.3591C1.02856 11.6155 1.05838 11.8481 1.118 12.0568C1.18359 12.2655 1.28198 12.4444 1.41316 12.5934C1.5503 12.7485 1.72024 12.8677 1.92297 12.9512C2.1257 13.0347 2.37017 13.0764 2.65638 13.0764H3.04992C3.33016 13.0764 3.57463 13.0287 3.78333 12.9333C3.99202 12.8439 4.16494 12.7216 4.30208 12.5666C4.44519 12.4116 4.54953 12.2297 4.61512 12.021C4.68668 11.8123 4.72245 11.5947 4.72245 11.3681V8.96215H5.29487V11.3413ZM3.13936 8.76538H2.38806V8.11246H3.13936V8.76538ZM7.60635 11.5201C7.45132 11.5201 7.30225 11.4993 7.15914 11.4575C7.01604 11.4098 6.88784 11.3323 6.77455 11.225C6.66722 11.1177 6.58076 10.9775 6.51517 10.8046C6.44958 10.6257 6.41679 10.4051 6.41679 10.1428V5.97484H6.99815V10.0354C6.99815 10.2859 7.05182 10.4946 7.15914 10.6615C7.27243 10.8225 7.4543 10.903 7.70473 10.903H7.85678C7.98796 10.903 8.05355 11.0044 8.05355 11.2071C8.05355 11.4158 7.98796 11.5201 7.85678 11.5201H7.60635ZM8.00408 10.903C8.23662 10.903 8.41252 10.8464 8.53177 10.7331C8.65103 10.6198 8.71065 10.4677 8.71065 10.2769V9.93705C8.71065 9.41829 8.84183 9.01283 9.10419 8.72066C9.37251 8.42849 9.7422 8.2824 10.2133 8.2824C10.4577 8.2824 10.6724 8.32116 10.8572 8.39867C11.0421 8.47619 11.1941 8.5865 11.3134 8.7296C11.4386 8.87271 11.531 9.04264 11.5906 9.23941C11.6503 9.43618 11.6801 9.65382 11.6801 9.89233C11.6801 10.4051 11.5459 10.8046 11.2776 11.0908C11.0093 11.377 10.6426 11.5201 10.1775 11.5201C9.93897 11.5201 9.70941 11.4754 9.48879 11.386C9.26817 11.2906 9.09525 11.1236 8.97003 10.8851C8.91637 11.0223 8.85078 11.1326 8.77326 11.216C8.69575 11.2995 8.61525 11.3651 8.53177 11.4128C8.4483 11.4546 8.35886 11.4844 8.26345 11.5023C8.17401 11.5142 8.08755 11.5201 8.00408 11.5201H7.86097C7.78346 11.5201 7.73277 11.4963 7.70892 11.4486C7.67911 11.4009 7.6642 11.3264 7.6642 11.225C7.6642 11.1177 7.67911 11.0372 7.70892 10.9835C7.73277 10.9298 7.78346 10.903 7.86097 10.903H8.00408ZM11.1077 9.94599C11.1077 9.63593 11.0391 9.3855 10.9019 9.19469C10.7648 8.99792 10.5293 8.89954 10.1954 8.89954C9.57525 8.89954 9.26519 9.26028 9.26519 9.98177C9.26519 10.2859 9.34866 10.5154 9.51562 10.6705C9.68854 10.8255 9.90916 10.903 10.1775 10.903C10.4816 10.903 10.7111 10.8195 10.8662 10.6526C11.0272 10.4856 11.1077 10.2501 11.1077 9.94599Z"
									fill="currentColor"></path>
							</svg>
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
					</div>
				</div>

				<!-- Footer -->
				<div v-if="!selectedPayment.is_paid && selectedPayment.can_retry"
					class="mt-6 flex items-center justify-end gap-1">
					<button @click="closePaymentDetailsModal" :disabled="retryPayLoading"
						class="px-4 h-9 flex items-center justify-center rounded-s-lg bg-gray-300 dark:bg-gray-700 dark:text-gray-100 hover:bg-opacity-90 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
						:class="selectedPayment.can_retry ? 'rounded-s-lg' : 'rounded-lg'">
						{{ $t("panel.financial.close") }}
					</button>
					<button v-if="retryPayLoading" disabled="disabled"
						class="px-4 h-9 flex items-center justify-center rounded-e-lg bg-gray-800/80 dark:bg-gray-700 text-white text-sm font-semibold opacity-70 cursor-not-allowed">
						{{ $t("panel.financial.pleaseWait") }}
					</button>
					<button v-else @click="onRetryPay"
						:disabled="paymentMethodForRetry === 'wallet' && retryPayableAmount > 0 && walletBalance <= 0"
						class="px-4 h-9 flex items-center justify-center rounded-e-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:shadow-md text-gray-900 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95">
						{{ paymentMethodForRetry === 'wallet'
							? (walletSufficientForRetry ? $t("panel.financial.confirmReceipt") : $t("cart.payWalletAndGateway"))
							: $t("panel.financial.retryConnect") }}
					</button>
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
							<div class="ms-1 flex items-center px-2 py-0.5 bg-gray-100 dark:bg-white rounded-md">
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
import PanelMasterPage from "@/views/page/panel/layouts/PanelMasterPage.vue";
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import PaymentGatewayList from "@/views/components/payment/PaymentGatewayList.vue";
import { buildPaymentGateways, calculateCartGatewayPricing, cartHasInstallmentEligibleItems, filterDirectBankGateways, filterGatewaysForCart, findGatewayById, findGatewayByVariant, getDefaultGateway, findGatewayByDriver, gatewayPayPayload, getCartItemTitle, isDigipayFeeGateway, isInstallmentGateway } from "@/config/paymentGateways";
import GatewayFeeHelp from "@/views/components/cart/GatewayFeeHelp.vue";
import CartAnimatedPrice from "@/views/components/cart/CartAnimatedPrice.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { TabGroup, TabList, Tab, TabPanels, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

export default {
	components: {
		PanelMasterPage,
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
		const urlParams = new URLSearchParams(window.location.search);
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
			return this.$store.state.auth.status.loggedIn;
		},
		currentUser() {
			return this.$store.state.auth.status.userInfo;
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

			if (isInstallmentGateway(gateway) && !this.hasInstallmentEligible) {
				toast.error(this.$t('cart.noInstallmentEligible'), {
					theme: "colored",
					position: toast.POSITION.BOTTOM_CENTER,
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

			window.history.pushState(null, '', newUrl);

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
