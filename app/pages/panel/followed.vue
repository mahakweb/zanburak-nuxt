<script setup>
definePageMeta({
  name: "panel-followed",
  middleware: ['auth'],
})
</script>

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
						<div v-if="loading" class="grid gap-3"
							:class="selectedFilter.slug === 'article' ? 'grid-cols-1 lg:grid-cols-3 gap-x-3 gap-y-10' : 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'">
							<template v-if="selectedFilter.slug === 'user'">
								<FolllowingUserCardLoading v-for="i in 6" :key="i" />
							</template>
							<template v-else-if="selectedFilter.slug === 'tag'">
								<div v-for="i in 6" :key="i"
									class="relative flex flex-col rounded-2xl bg-white dark:bg-gray-900 p-4 md:p-5 border border-gray-100 dark:border-gray-800">
									<div class="animate-pulse h-4 w-2/3 rounded-full bg-gray-200 dark:bg-gray-700 mb-3"></div>
									<div class="flex items-center gap-3 mb-4">
										<div class="animate-pulse h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
										<div class="animate-pulse h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
									</div>
									<div class="animate-pulse mt-auto h-9 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
								</div>
							</template>
							<template v-else-if="selectedFilter.slug === 'article'">
								<ArticleCardLoading v-for="i in 6" :key="i" />
							</template>
							<template v-else>
								<div v-for="i in 6" :key="i"
									class="rounded-2xl bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
									<div class="animate-pulse h-4 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700 mb-2.5"></div>
									<div class="animate-pulse h-4 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
								</div>
							</template>
						</div>
						<div v-else id="data-list">
							<div v-if="followeds && followeds.length > 0"
								class="grid gap-3"
								:class="selectedFilter.slug === 'article' ? 'grid-cols-1 lg:grid-cols-3 gap-x-3 gap-y-10' : 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'">
								<template v-if="selectedFilter.slug === 'user'">
									<FolllowingUserCard v-for="(followed, i) in followeds" :key="i" :user="followed" />
								</template>
								<template v-else-if="selectedFilter.slug === 'tag'">
									<FollowedTagCard v-for="(followed, i) in followeds" :key="i" :tag="followed" />
								</template>
								<template v-else-if="selectedFilter.slug === 'question'">
									<router-link v-for="(followed, i) in followeds" :key="i"
										:to="{ name: 'question-show', params: { questionSlug: followed.slug } }"
										class="rounded-2xl bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
										<h3 class="font-bold text-gray-800 dark:text-white line-clamp-2">{{ followed.subject }}</h3>
									</router-link>
								</template>
								<template v-else-if="selectedFilter.slug === 'course'">
									<router-link v-for="(followed, i) in followeds" :key="i"
										:to="{ name: 'course.show', params: { courseSlug: followed.slug } }"
										class="rounded-2xl bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
										<h3 class="font-bold text-gray-800 dark:text-white line-clamp-2">{{ followed.title }}</h3>
									</router-link>
								</template>
								<template v-else-if="selectedFilter.slug === 'article'">
									<ArticleCard v-for="followed in followeds" :key="followed.id" :article="followed" variant="panel" />
								</template>
							</div>
							<div v-else
							class="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 md:p-14 text-center">
							<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/10 text-amber-500">
								<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</div>
							<p class="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-200">{{ $t("panel.common.empty") }}</p>
						</div>
						</div>
						<!-- </TabPanel> -->
					</TabPanels>
					<div v-if="followeds.length > 0 && pagination.last_page > 1"
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
import FolllowingUserCard from "@/views/components/follow/FolllowingUserCard.vue";
import FolllowingUserCardLoading from "@/views/components/follow/FolllowingUserCardLoading.vue";
import FollowedTagCard from "@/views/components/tag/FollowedTagCard.vue";
import ArticleCard from "@/views/components/articles/ArticleCard.vue";
import ArticleCardLoading from "@/views/components/articles/ArticleCardLoading.vue";
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import { TabGroup, TabList, Tab, TabPanels, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
export default {
	components: {
		PanelMasterPage,
		PaginationComponent,
		FolllowingUserCard,
		FolllowingUserCardLoading,
		FollowedTagCard,
		ArticleCard,
		ArticleCardLoading,
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
		const slugFromUrl = urlParams.get('filter') || 'user';
		const filters = {
			user: {
				title: this.$t("panel.followed.filterUser"),
				english_title: "user",
				slug: "user",
				icon: `<svg class="w-4 h-4"  viewBox="0 0 16 20" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
										d="M13.294 5.29105C13.294 8.22808 10.9391 10.5831 8 10.5831C5.0619 10.5831 2.70601 8.22808 2.70601 5.29105C2.70601 2.35402 5.0619 0 8 0C10.9391 0 13.294 2.35402 13.294 5.29105ZM8 20C3.66237 20 0 19.295 0 16.575C0 13.8539 3.68538 13.1739 8 13.1739C12.3386 13.1739 16 13.8789 16 16.599C16 19.32 12.3146 20 8 20Z">
									</path>
								</svg>`
			},
			question: {
				title: this.$t("panel.followed.filterQuestion"),
				english_title: "question",
				slug: "question",
				icon: `<svg class="w-4 h-4"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
								<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
									d="M0 10C0 18.235 1.765 20 10 20C18.235 20 20 18.235 20 10C20 1.765 18.235 0 10 0C1.765 0 0 1.765 0 10ZM9.16667 13.3333C9.16667 12.8731 9.53976 12.5 10 12.5C10.4602 12.5 10.8333 12.8731 10.8333 13.3333C10.8333 13.7936 10.4602 14.1667 10 14.1667C9.53976 14.1667 9.16667 13.7936 9.16667 13.3333ZM10 5C9.21831 5 8.57081 5.30142 8.12716 5.80053C7.69714 6.28431 7.5 6.90577 7.5 7.5C7.5 8.54502 8.11172 9.26676 8.50947 9.73605L8.53076 9.76117C9.0007 10.316 9.16667 10.5499 9.16667 10.8333C9.16667 11.2936 9.53976 11.6667 10 11.6667C10.4602 11.6667 10.8333 11.2936 10.8333 10.8333C10.8333 9.8887 10.2466 9.20314 9.87388 8.76761C9.84909 8.73864 9.82524 8.71078 9.80258 8.68402C9.36604 8.16859 9.16667 7.87618 9.16667 7.5C9.16667 7.26089 9.24731 7.04903 9.37284 6.9078C9.48474 6.78191 9.67058 6.66667 10 6.66667C10.3294 6.66667 10.5153 6.78191 10.6272 6.9078C10.7527 7.04903 10.8333 7.26089 10.8333 7.5C10.8333 7.96024 11.2064 8.33333 11.6667 8.33333C12.1269 8.33333 12.5 7.96024 12.5 7.5C12.5 6.90577 12.3029 6.28431 11.8728 5.80053C11.4292 5.30142 10.7817 5 10 5Z">
								</path>
							</svg>`
			},
			course: {
				title: this.$t("panel.followed.filterCourse"),
				english_title: "course",
				slug: "course",
				icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M8.50989 2.00001H15.49C15.7225 1.99995 15.9007 1.99991 16.0565 2.01515C17.1643 2.12352 18.0711 2.78958 18.4556 3.68678H5.54428C5.92879 2.78958 6.83555 2.12352 7.94337 2.01515C8.09917 1.99991 8.27741 1.99995 8.50989 2.00001Z"
									fill="currentColor"></path>
								<path
									d="M6.31052 4.72312C4.91989 4.72312 3.77963 5.56287 3.3991 6.67691C3.39117 6.70013 3.38356 6.72348 3.37629 6.74693C3.77444 6.62636 4.18881 6.54759 4.60827 6.49382C5.68865 6.35531 7.05399 6.35538 8.64002 6.35547H15.5321C17.1181 6.35538 18.4835 6.35531 19.5639 6.49382C19.9833 6.54759 20.3977 6.62636 20.7958 6.74693C20.7886 6.72348 20.781 6.70013 20.773 6.67691C20.3925 5.56287 19.2522 4.72312 17.8616 4.72312H6.31052Z"
									fill="currentColor"></path>
								<path fill-rule="evenodd" clip-rule="evenodd"
									d="M15.3276 7.54204H8.67239C5.29758 7.54204 3.61017 7.54204 2.66232 8.52887C1.71447 9.5157 1.93748 11.0403 2.38351 14.0896L2.80648 16.9811C3.15626 19.3724 3.33115 20.568 4.22834 21.284C5.12553 22 6.4488 22 9.09534 22H14.9046C17.5512 22 18.8745 22 19.7717 21.284C20.6689 20.568 20.8437 19.3724 21.1935 16.9811L21.6165 14.0896C22.0625 11.0404 22.2855 9.51569 21.3377 8.52887C20.3898 7.54204 18.7024 7.54204 15.3276 7.54204ZM14.5812 15.7942C15.1396 15.4481 15.1396 14.5519 14.5812 14.2058L11.2096 12.1156C10.6669 11.7792 10 12.2171 10 12.9099V17.0901C10 17.7829 10.6669 18.2208 11.2096 17.8844L14.5812 15.7942Z"
									fill="currentColor"></path>
							</svg>`
			},
			tag: {
				title: this.$t("panel.followed.filterTag"),
				english_title: "tag",
				slug: "tag",
				icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7.049 3.062A3.5 3.5 0 0 1 10.5 0h3A3.5 3.5 0 0 1 17 3.062l.19.95a2 2 0 0 0 1.632 1.588l.958.192A3.5 3.5 0 0 1 22.938 9.05l-.95.19a2 2 0 0 0-1.588 1.632l-.192.958A3.5 3.5 0 0 1 17 15.938l-.95-.19a2 2 0 0 0-1.632 1.588l-.192.958A3.5 3.5 0 0 1 10.5 24h-3A3.5 3.5 0 0 1 4.062 20.95l-.19-.958a2 2 0 0 0-1.632-1.588l-.958-.192A3.5 3.5 0 0 1 1.062 14.95l.95-.19a2 2 0 0 0 1.588-1.632l.192-.958A3.5 3.5 0 0 1 6.05 7.012l.958.19a2 2 0 0 0 1.632-1.588l.19-.958A3.5 3.5 0 0 1 10.5 3h3c.34 0 .672.049.988.141z"/></svg>`
			},
			article: {
				title: this.$t("panel.followed.filterArticle"),
				english_title: "article",
				slug: "article",
				icon: `<svg class="w-4 h-4" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.094 5.64077C18.094 3.11914 16.3701 2.10828 13.8879 2.10828H8.05895C5.65311 2.10828 3.8501 3.05021 3.8501 5.4726V18.9694C3.8501 19.6348 4.56597 20.0538 5.14584 19.7285L10.996 16.4469L16.7955 19.723C17.3763 20.0501 18.094 19.6311 18.094 18.9648V5.64077Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M7.58203 8.27564H14.2905" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
			}
		};
		const selectedFilter = filters[slugFromUrl] || filters['user'];
		return {
			followeds: [],
			filters,
			selectedFilter,
			currentPage: this.$route.query.page ? this.$route.query.page : 1,
			loading: false,
			pagination: {},
			mounted: false
		}
	},
	methods: {
		authorName(user) {
			if (!user) return "";
			return [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "";
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

			if (this.selectedFilter && this.selectedFilter.slug !== 'user') {
				query.filter = this.selectedFilter.slug;
			}

			if (this.currentPage !== 1) {
				query.page = this.currentPage;
			}

			const queryString = new URLSearchParams(query).toString();
			const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

			window.history.pushState(null, '', newUrl);

			this.getFollowed();
		},

		async getFollowed() {
			try {
				this.loading = true;

				let params = {
					page: this.currentPage,
					filter: this.selectedFilter ? this.selectedFilter.slug : undefined,
				};

				Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

				const response = await axiosInstance.post('/panel/followed', params);
				this.followeds = response.data.followeds;
				this.currentPage = response.data.pagination.current_page;
				this.pagination = response.data.pagination;
				if (this.mounted)
					setTimeout(() => {
						document.getElementById('data-list').scrollIntoView({ behavior: 'smooth' });
					}, 200)

			} catch (error) {
				console.error("Error loading followed:", error);
			} finally {
				this.loading = false;
				this.mounted = true;
			}
		},
	},

	mounted() {
		document.title = this.$t("panel.followed.documentTitle");
		this.updateUrlAndFetchData()
	},
};
</script>

<style></style>
