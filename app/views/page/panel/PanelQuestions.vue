<template>
	<PanelMasterPage>
		<div class="w-full space-y-5">
			<div class="md:hidden">
				<Listbox v-model="selectedFilter" v-slot="{ open }" as="div" class="w-full">
					<div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
					<div class="mt-1 relative" :class="open ? ' z-20' : ''">
						<ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''"
							class="w-full flex justify-between items-center px-3 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-xl text-sm">
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
								<span class="flex items-center line-clamp-1 font-semibold">{{ selectedFilter.title
									}}</span>
							</div>
							<div class="border-s border-current px-3 py-1.5">
								<svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''"
									viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor"
										stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round"></path>
								</svg>
							</div>
						</ListboxButton>
						<ListboxOptions
							class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-sm space-y-1 p-2 rounded-b-xl">
							<ListboxOption v-for="(filter, index) in filters" :key="index"
								@click.prevent="selectFilter(filter)" :value="filter" :disabled="false"
								class="flex items-center px-2 py-3 rounded-lg cursor-pointer"
								:class="selectedFilter == filter ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:bg-opacity-50'">
								<span v-html="filter.icon"></span>
								<span class="ms-2 font-semibold">{{ filter.title }}</span>
							</ListboxOption>
						</ListboxOptions>
					</div>
				</Listbox>
			</div>
			<div class="">
				<TabGroup>
					<TabList
						class="hidden md:inline-flex space-x-1 rtl:space-x-reverse rounded-xl bg-gray-100/80 dark:bg-gray-800/60 p-1">
						<Tab v-for="(filter, index) in filters" :key="index" @click.prevent="selectFilter(filter)"
							class="ring-0 outline-none">
							<button :disabled="filter.slug == selectedFilter.slug"
								class="w-full flex items-center rounded-lg py-2 px-3 text-sm font-semibold leading-5 ring-0 outline-none transition-colors duration-200"
								:class="[
									filter.slug === selectedFilter.slug ? 'bg-white dark:bg-gray-900 shadow-sm text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
								]">
								<span class="me-2" v-html="filter.icon"></span>
								<span>{{ filter.title }}</span>
							</button>
						</Tab>
					</TabList>
					<TabPanels class="mt-4 md:mt-8">
						<!-- <TabPanel class="rounded-xl bg-white dark:bg-gray-900 p-3 outline-none"> -->
						<div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-3">
							<QuestionCardLoading v-for="i in 6" :key="i" />
						</div>
						<div v-else id="data-list">
							<div v-if="data && data.length > 0" class="">
								<div class="grid grid-cols-1 lg:grid-cols-2  gap-3"
									v-if="selectedFilter.slug == 'current' || selectedFilter.slug == 'locked'">
									<QuestionCard v-for="(question, i) in data" :key="i" :question="question"
										:locked="selectedFilter.slug == 'locked'" />
								</div>
								<div class="grid grid-cols-1 lg:grid-cols-2  gap-3"
									v-else-if="selectedFilter.slug == 'replies'">
									<AnswerCard v-for="(answer, i) in data" :key="i" :answer="answer" />
								</div>
							</div>
							<div v-else
								class="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 md:p-14 text-center">
								<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/10 text-amber-500">
									<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<p class="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-200">{{ $t("panel.common.empty") }}</p>
							</div>
						</div>
						<!-- </TabPanel> -->
					</TabPanels>
					<div v-if="data.length > 0 && pagination.last_page > 1"
						class="my-10 flex items-center justify-center">
						<PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
					</div>
				</TabGroup>
			</div>
		</div>
	</PanelMasterPage>
</template>

<script>
import PanelMasterPage from "@/views/page/panel/layouts/PanelMasterPage.vue";
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import QuestionCard from "@/views/components/discuss/QuestionCard.vue";
import QuestionCardLoading from "@/views/components/discuss/QuestionCardLoading.vue";
import AnswerCard from "@/views/components/discuss/AnswerCard.vue";
import { TabGroup, TabList, Tab, TabPanels, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
export default {
	components: {
		PanelMasterPage,
		PaginationComponent,
		QuestionCard,
		QuestionCardLoading,
		AnswerCard,
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
		const slugFromUrl = urlParams.get('filter') || 'current';
		const filters = {
			current: {
				title: this.$t("panel.questions.filterCurrent"),
				english_title: "current",
				slug: "current",
				icon: `<svg class="w-4 h-4"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
								d="M0 10C0 18.235 1.765 20 10 20C18.235 20 20 18.235 20 10C20 1.765 18.235 0 10 0C1.765 0 0 1.765 0 10ZM9.16667 13.3333C9.16667 12.8731 9.53976 12.5 10 12.5C10.4602 12.5 10.8333 12.8731 10.8333 13.3333C10.8333 13.7936 10.4602 14.1667 10 14.1667C9.53976 14.1667 9.16667 13.7936 9.16667 13.3333ZM10 5C9.21831 5 8.57081 5.30142 8.12716 5.80053C7.69714 6.28431 7.5 6.90577 7.5 7.5C7.5 8.54502 8.11172 9.26676 8.50947 9.73605L8.53076 9.76117C9.0007 10.316 9.16667 10.5499 9.16667 10.8333C9.16667 11.2936 9.53976 11.6667 10 11.6667C10.4602 11.6667 10.8333 11.2936 10.8333 10.8333C10.8333 9.8887 10.2466 9.20314 9.87388 8.76761C9.84909 8.73864 9.82524 8.71078 9.80258 8.68402C9.36604 8.16859 9.16667 7.87618 9.16667 7.5C9.16667 7.26089 9.24731 7.04903 9.37284 6.9078C9.48474 6.78191 9.67058 6.66667 10 6.66667C10.3294 6.66667 10.5153 6.78191 10.6272 6.9078C10.7527 7.04903 10.8333 7.26089 10.8333 7.5C10.8333 7.96024 11.2064 8.33333 11.6667 8.33333C12.1269 8.33333 12.5 7.96024 12.5 7.5C12.5 6.90577 12.3029 6.28431 11.8728 5.80053C11.4292 5.30142 10.7817 5 10 5Z">
							</path>
						</svg>`
			},
			locked: {
				title: this.$t("panel.questions.filterLocked"),
				english_title: "locked",
				slug: "locked",
				icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd"
								d="M7.22703 3.22703C8.4929 1.96116 10.2098 1.25 12 1.25C13.7902 1.25 15.5071 1.96116 16.773 3.22703C18.0388 4.4929 18.75 6.20979 18.75 8C18.75 8.41421 18.4142 8.75 18 8.75C17.5858 8.75 17.25 8.41421 17.25 8C17.25 6.60761 16.6969 5.27226 15.7123 4.28769C14.7277 3.30312 13.3924 2.75 12 2.75C10.6076 2.75 9.27226 3.30312 8.28769 4.28769C7.30312 5.27225 6.75 6.60761 6.75 8C6.75 8.41421 6.41421 8.75 6 8.75C5.58579 8.75 5.25 8.41421 5.25 8C5.25 6.20979 5.96116 4.4929 7.22703 3.22703Z"
								fill="currentColor"></path>
							<path fill-rule="evenodd" clip-rule="evenodd"
								d="M7 7.25C3.82436 7.25 1.25 9.82436 1.25 13V17C1.25 20.1756 3.82436 22.75 7 22.75H17C20.1756 22.75 22.75 20.1756 22.75 17V13C22.75 9.82436 20.1756 7.25 17 7.25H7ZM12.75 13C12.75 12.5858 12.4142 12.25 12 12.25C11.5858 12.25 11.25 12.5858 11.25 13V17C11.25 17.4142 11.5858 17.75 12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V13Z"
								fill="currentColor"></path>
						</svg>`
			},
			replies: {
				title: this.$t("panel.questions.filterReplies"),
				english_title: "replies",
				slug: "replies",
				icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd"
								d="M9.31745 3.32481C6.34246 3.99738 4.00813 6.28371 3.29193 9.22642C2.90031 10.8355 2.90389 12.5287 3.29551 14.1378C4.0229 17.1265 6.16258 19.6138 9.03293 20.7728L9.15805 20.8233C10.4002 21.3249 11.8231 20.7208 12.3327 19.4902C12.473 19.1515 12.807 18.9268 13.1761 18.9268H14.2999C17.3564 18.9268 20.0154 16.8499 20.7328 13.9021C21.0891 12.4382 21.0891 10.9113 20.7328 9.44741L20.6387 9.06088C19.9472 6.21958 17.6933 4.01204 14.8209 3.36264L14.4173 3.27141C12.8166 2.90953 11.1543 2.90953 9.55362 3.27141L9.31745 3.32481ZM8.50194 8.36669C8.11716 8.36669 7.80524 8.67616 7.80524 9.05792C7.80524 9.43968 8.11716 9.74916 8.50194 9.74916H14.8884C15.2732 9.74916 15.5851 9.43968 15.5851 9.05792C15.5851 8.67616 15.2732 8.36669 14.8884 8.36669H8.50194ZM9.66312 11.8229C9.27834 11.8229 8.96642 12.1323 8.96642 12.5141C8.96642 12.8958 9.27834 13.2053 9.66312 13.2053H13.7272C14.112 13.2053 14.4239 12.8958 14.4239 12.5141C14.4239 12.1323 14.112 11.8229 13.7272 11.8229H9.66312Z"
								fill="currentColor"></path>
						</svg>`
			}
		};
		const selectedFilter = filters[slugFromUrl] || filters['current'];
		return {
			data: [],
			filters,
			selectedFilter,
			currentPage: this.$route.query.page ? this.$route.query.page : 1,
			loading: false,
			pagination: {},
			mounted: false
		}
	},
	methods: {
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

			if (this.selectedFilter && this.selectedFilter.slug !== 'current') {
				query.filter = this.selectedFilter.slug;
			}

			if (this.currentPage !== 1) {
				query.page = this.currentPage;
			}

			const queryString = new URLSearchParams(query).toString();
			const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

			window.history.pushState(null, '', newUrl);

			this.getData();
		},

		async getData() {
			try {
				this.loading = true;

				let params = {
					page: this.currentPage,
					filter: this.selectedFilter ? this.selectedFilter.slug : undefined,
				};

				Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

				const response = await axiosInstance.post('/panel/questions', params);
				this.data = response.data.data;
				this.currentPage = response.data.pagination.current_page;
				this.pagination = response.data.pagination;
				if (this.mounted)
					setTimeout(() => {
						document.getElementById('data-list').scrollIntoView({ behavior: 'smooth' });
					}, 200)

			} catch (error) {
				console.error("Error loading questions:", error);
			} finally {
				this.loading = false;
				this.mounted = true;
			}
		},
	},

	mounted() {
		document.title = this.$t("panel.questions.documentTitle");
		this.updateUrlAndFetchData()
	},
};
</script>

<style></style>
