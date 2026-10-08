<script setup>
definePageMeta({
  name: "panel-courses",
  middleware: ['auth'],
})
</script>

<template>
	<PanelMasterPage>
		<div class="space-y-5">
			<div class="w-full">
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
											stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round">
										</path>
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
						<div v-if="filterLoading"
							class="grid xl:grid-cols-4 lg:rid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
							<div v-for="i in 8" :key="i"
								class="h-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col flex-grow px-4 pt-4 pb-5 shadow-sm">
								<div class="animate-pulse w-full h-36 lg:h-32 rounded-lg bg-gray-200 dark:bg-gray-700 mb-4"></div>
								<div class="animate-pulse h-3.5 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
								<hr class="border-gray-350 dark:border-white dark:border-opacity-10 border-opacity-10 my-4" />
								<div class="flex items-center justify-between">
									<div class="animate-pulse h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
									<div class="animate-pulse h-3 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
								</div>
							</div>
						</div>
						<div v-else id="courses-list">
								<div v-if="courses && courses.length > 0"
									class="grid xl:grid-cols-4 lg:rid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
									<div v-for="(course, index) in courses" :key="index"
										class="group h-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col flex-grow px-4 pt-4 pb-5 shadow-sm">
										<router-link :to="{ name: 'course.show', params: { courseSlug: course.slug } }"
											class="inline-block w-full h-36 lg:h-32 rounded-lg overflow-hidden relative mb-4">
											<SeoImage
												:src="course.poster"
												:alt="course.title || ''"
												:width="320"
												:height="180"
												sizes-preset="card"
												img-class="w-full h-full object-cover group-hover:scale-110 transform transition duration-400 z-0"
											/>
											<div class="w-full h-full absolute right-0 top-0 bg-gray-500 bg-opacity-40">
												<div
													class="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
													<svg width="50" height="50" viewBox="0 0 67 67" fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<circle cx="33.5" cy="33.5" r="33.5" class="fill-white">
														</circle>
														<path class="text-gray-500"
															d="M29.9118 47.4749C26.7852 49.2801 22.8769 47.0236 22.8769 43.4133L22.8769 23.4136C22.8769 19.8032 26.7852 17.5468 29.9119 19.352L47.2321 29.3518C50.3587 31.157 50.3587 35.6699 47.2321 37.4751L29.9118 47.4749Z"
															fill="currentColor"></path>
													</svg>
												</div>
											</div>
										</router-link>
										<h5
											class="line-clamp-1 text-start text-gray-800 font-semibold text-sm dark:text-white dark:hover:text-yellow-400 hover:text-orange-400 transition duration-200">
											<router-link
												:to="{ name: 'course.show', params: { courseSlug: course.slug } }">
												{{ course.title }}
											</router-link>
										</h5>
										<hr
											class="border-gray-350 dark:border-white dark:border-opacity-10 border-opacity-10 my-4" />
										<div
											class="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300">
											<div class="">{{ $t("panel.courses.watchPercent") }}</div>
											<div class="text-orange-400 flex items-center">
												{{ Math.floor(course.progressPercentage) }} {{ $t("panel.courses.percentSuffix") }}
												<!-- <svg class="ms-1" width="12" height="12" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path
														class="text-gray-600 dark:text-white"
														d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C11.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z"
														fill="currentColor"
													></path>
												</svg> -->
											</div>
										</div>
									</div>
								</div>
								<div v-else
							class="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 md:p-14 text-center">
							<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/10 text-amber-500">
								<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
								</svg>
							</div>
							<p class="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-200">{{ $t("panel.common.empty") }}</p>
						</div>
							</div>
							<!-- </TabPanel> -->
						</TabPanels>
						<div v-if="courses.length > 0 && pagination.last_page > 1"
							class="my-10 flex items-center justify-center">
							<PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
						</div>
					</TabGroup>
				</div>
			</div>
		</div>
	</PanelMasterPage>
</template>

<script>
import PanelMasterPage from "@/views/page/panel/layouts/PanelMasterPage.vue";
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import { TabGroup, TabList, Tab, TabPanels, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
export default {
	components: {
		PanelMasterPage,
		PaginationComponent,
		SeoImage,
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
				title: this.$t("panel.courses.filterCurrent"),
				english_title: "current course",
				slug: "current",
				icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd"
									d="M13.4822 3.95133C15.51 4.42655 17.1316 5.91484 17.6838 7.83499L18.458 7.37444C20.4352 6.1981 23 7.55122 23 9.77073L23 14.5944C23 16.6951 20.6776 18.0613 18.7037 17.1219L17.5485 16.572C16.8965 18.2938 15.3643 19.6076 13.4822 20.0487C10.9345 20.6457 8.24347 20.653 5.69246 20.0551C3.59198 19.5629 1.96547 17.9809 1.49366 15.9713L1.42818 15.6925C0.857273 13.2608 0.857274 10.7392 1.42818 8.30754L1.49366 8.02865C1.96547 6.0191 3.59198 4.43714 5.69246 3.94488C8.24347 3.34704 10.9345 3.35426 13.4822 3.95133ZM17.9906 14.8481C18.3134 13.1277 18.3414 11.3698 18.0745 9.64278L19.4213 8.84156C20.188 8.38543 21.1825 8.9101 21.1825 9.77073L21.1825 14.5944C21.1825 15.4089 20.2819 15.9387 19.5166 15.5744L17.9906 14.8481Z"
									fill="currentColor"></path>
							</svg>`
			},
			purchased: {
				title: this.$t("panel.courses.filterPurchased"),
				english_title: "purchased course",
				slug: "purchased",
				icon: `<svg class="w-5 h-5" viewBox="2 2 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd"
									d="M3.91927 3.01138C3.49208 2.93917 3.08574 3.21821 3.01167 3.63461C2.9376 4.05102 3.22386 4.44711 3.65104 4.51931C4.58738 4.67757 5.32458 5.38577 5.50056 6.29609L5.60154 6.81848C5.19116 7.4158 4.88139 8.08586 4.69556 8.80661C4.25365 10.5206 4.25365 12.3145 4.69556 14.0284C4.73327 14.1747 4.7761 14.3189 4.82383 14.4608C4.85833 14.5634 4.8954 14.6648 4.93496 14.765L5.1228 15.2436H5.14759C5.51791 15.9914 6.03256 16.6558 6.65658 17.2038C6.52518 17.3665 6.41631 17.5466 6.33367 17.7396C6.16044 18.1442 6.10969 18.5887 6.18743 19.0205C6.26516 19.4524 6.46814 19.8535 6.77235 20.1764C7.07655 20.4994 7.46927 20.7306 7.90406 20.8429C8.33885 20.9552 8.79752 20.9437 9.22584 20.8099C9.65416 20.6761 10.0342 20.4255 10.3211 20.0878C10.6034 19.7553 10.7839 19.3521 10.8418 18.9245C12.0089 19.0972 13.1952 19.1047 14.364 18.9469C14.4036 19.3101 14.5317 19.66 14.739 19.9669C14.9871 20.3341 15.3382 20.6242 15.7505 20.8026C16.1628 20.981 16.6191 21.0402 17.0649 20.9732C17.5108 20.9061 17.9275 20.7157 18.2655 20.4245C18.6035 20.1333 18.8486 19.7535 18.9717 19.3305C19.0947 18.9074 19.0905 18.4588 18.9595 18.038C18.8777 17.775 18.7486 17.5299 18.5794 17.3134C19.2613 16.7453 19.8212 16.042 20.2165 15.2436H20.2413L20.4292 14.7648C20.4657 14.6724 20.5001 14.5789 20.5323 14.4844C20.5833 14.3349 20.6288 14.1828 20.6686 14.0284C21.1105 12.3145 21.1105 10.5206 20.6686 8.80662C20.0651 6.46603 18.1546 4.66002 15.736 4.14388L15.3038 4.05165C13.5764 3.68301 11.7877 3.68301 10.0603 4.05165L9.62809 4.14388C8.60153 4.36296 7.6665 4.81442 6.88409 5.4405C6.42206 4.1841 5.29858 3.2445 3.91927 3.01138ZM9.96387 17.1961C8.7257 16.9319 7.66287 16.2225 6.96131 15.2436H18.4028C17.7013 16.2225 16.6384 16.9319 15.4003 17.1961L14.968 17.2884C13.4619 17.6098 11.9022 17.6098 10.3961 17.2884L9.96387 17.1961ZM15.9209 18.7132C15.9207 18.6915 15.9213 18.6699 15.923 18.6485C16.3919 18.5343 16.8405 18.3712 17.2628 18.165C17.3529 18.2535 17.4198 18.3623 17.4571 18.4822C17.5008 18.6225 17.5022 18.772 17.4611 18.913C17.4201 19.0541 17.3384 19.1806 17.2258 19.2777C17.1131 19.3748 16.9742 19.4383 16.8256 19.4606C16.6769 19.483 16.5249 19.4632 16.3874 19.4038C16.25 19.3443 16.1329 19.2476 16.0502 19.1252C15.9675 19.0028 15.9226 18.8598 15.9209 18.7132ZM7.94727 18.0873C8.36964 18.3074 8.81998 18.4838 9.29195 18.6103C9.2926 18.6459 9.2907 18.6816 9.2862 18.7173C9.26788 18.8623 9.20734 18.9992 9.11172 19.1118C9.01611 19.2243 8.88942 19.3079 8.74665 19.3525C8.60388 19.3971 8.45098 19.4009 8.30606 19.3635C8.16113 19.3261 8.03022 19.249 7.92882 19.1413C7.82742 19.0337 7.75976 18.9 7.73384 18.756C7.70793 18.6121 7.72485 18.4639 7.78259 18.329C7.82134 18.2386 7.87738 18.1566 7.94727 18.0873ZM13.6327 7.23572C13.6897 6.90222 14.0133 6.67693 14.3554 6.73251L14.3981 6.73945C16.4883 7.07903 18.0202 8.84183 18.0202 10.9074C18.0202 11.2455 17.7391 11.5195 17.3922 11.5195C17.0454 11.5195 16.7642 11.2455 16.7642 10.9074C16.7642 9.44034 15.6761 8.18832 14.1916 7.94714L14.1489 7.9402C13.8068 7.88462 13.5756 7.56921 13.6327 7.23572Z"
									fill="currentColor"></path>
							</svg>`
			},
			completed: {
				title: this.$t("panel.courses.filterCompleted"),
				english_title: "completed course",
				slug: "completed",
				icon: `<svg class="w-5 h-5" viewBox="2 2 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd"
									d="M18.2526 11.6367C17.9818 12.7883 17.3596 13.7938 16.5071 14.5397L17.427 18.2625C17.8898 20.1352 15.9606 21.575 14.3395 20.7733L12.6066 19.9163C12.225 19.7276 11.775 19.7276 11.3934 19.9163L9.66052 20.7733C8.03944 21.575 6.11016 20.1352 6.57295 18.2625L7.49294 14.5397C6.64042 13.7938 6.01824 12.7883 5.74739 11.6367C5.41754 10.2343 5.41754 8.77447 5.74739 7.37205C6.23153 5.31362 7.83822 3.7219 9.87641 3.24508C11.2733 2.91831 12.7267 2.91831 14.1236 3.24508C16.1618 3.7219 17.7685 5.31363 18.2526 7.37205C18.5825 8.77447 18.5825 10.2343 18.2526 11.6367ZM14.1236 15.7636C14.1873 15.7487 14.2506 15.7328 14.3134 15.7157C14.6626 15.6209 14.998 15.4932 15.3161 15.3358L16.1238 18.604C16.2784 19.2298 15.6122 19.8665 14.9217 19.525L13.1888 18.668C12.4392 18.2973 11.5608 18.2973 10.8112 18.668L9.07832 19.525C8.3878 19.8665 7.72159 19.2298 7.87624 18.604L8.68389 15.3358C8.98322 15.4839 9.2979 15.6057 9.62497 15.6986C9.70801 15.7222 9.79184 15.7439 9.87641 15.7636C11.2733 16.0904 12.7267 16.0904 14.1236 15.7636Z"
									fill="currentColor"></path>
							</svg>`
			},
			inactive: {
				title: this.$t("panel.courses.filterInactive"),
				english_title: "inactive course",
				slug: "inactive",
				icon: `<svg class="w-5 h-5" fill="none" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530 530"
								xml:space="preserve">
								<path fill="currentColor"
									d="M256,0C114.615,0,0,114.616,0,256s114.615,256,256,256s256-114.616,256-256S397.385,0,256,0z M66.783,256 c0-104.503,84.716-189.217,189.217-189.217c40.19,0,77.446,12.541,108.089,33.907L100.689,364.089 C79.323,333.446,66.783,296.19,66.783,256z M256,445.217c-40.19,0-77.446-12.541-108.089-33.907l263.399-263.399 c21.366,30.643,33.907,67.899,33.907,108.089C445.217,360.501,360.501,445.217,256,445.217z">
								</path>
							</svg>`
			}
		};
		const selectedFilter = filters[slugFromUrl] || filters['current'];
		return {
			courses: [],
			filterLoading: false,
			filters,
			selectedFilter,
			currentPage: this.$route.query.page ? this.$route.query.page : 1,
			pagination: {},
			mounted: false
		};
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

			this.getCourses();
		},
		async getCourses() {
			try {
				this.filterLoading = true;

				let params = {
					page: this.currentPage,
					filter: this.selectedFilter ? this.selectedFilter.slug : undefined,
				};

				Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

				const response = await axiosInstance.post('/panel/courses', params);
				this.courses = response.data.data;
				this.currentPage = response.data.pagination.current_page;
				this.pagination = response.data.pagination;
				if (this.mounted)
					setTimeout(() => {
						document.getElementById('courses-list').scrollIntoView({ behavior: 'smooth' });
					}, 200)

			} catch (error) {
				console.error("Error loading courses:", error);
			} finally {
				this.filterLoading = false;
				this.mounted = true;
			}
		}
	},
	mounted() {
		document.title = this.$t("panel.courses.documentTitle");
		this.updateUrlAndFetchData()
	},
};
</script>
