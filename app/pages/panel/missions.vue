<script setup>
definePageMeta({
  name: "panel-missions",
  middleware: ['auth'],
})
</script>

<template>
	<PanelMasterPage>
		<div class="space-y-5">
			<div class="md:hidden w-full text-start">
				<button
					class="flex items-center text-white dark:text-gray-800 bg-amber-400 hover:bg-amber-500/50 focus:ring-2 focus:ring-amber-300 rounded-lg px-5 py-2.5 mb-2 dark:bg-amber-400 dark:hover:bg-amber-400/70 focus:outline-none dark:focus:ring-amber-600 text-sm font-semibold"
					type="button" data-drawer-target="categories-bottom-sheet"
					data-drawer-show="categories-bottom-sheet" data-drawer-placement="bottom" data-drawer-edge="true"
					data-drawer-edge-offset="bottom-[0px]" aria-controls="categories-bottom-sheet">
					<svg class="w-5 h-5 me-2" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z"
							stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						</path>
						<path opacity="0.4" d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833"
							stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						</path>
					</svg>
					{{ $t("panel.missions.selectCategory") }}
				</button>
			</div>
			<TabGroup>
				<TabList v-if="loadingCategories"
					class="hidden md:inline-flex space-x-1 rtl:space-x-reverse rounded-xl bg-gray-100/80 dark:bg-gray-800/60 p-1">
					<Tab v-for="i in 4" :key="i" class="ring-0 outline-none">
						<div class="w-full flex items-center rounded-lg py-3.5 px-3 text-sm font-semibold leading-5 ring-0 outline-none"
							:class="['text-gray-600 dark:text-gray-200 bg-slate-100/50 dark:bg-slate-900/30 hover:bg-slate-700 hover:text-white']">
							<div
								class="animate-shimmer shimmer-gray-50 dark:shimmer-gray-500 w-10 h-1.5 rounded-full bg-gray-200 dark:bg-gray-600">
							</div>
						</div>
					</Tab>
				</TabList>
				<TabList v-else
					class="hidden md:inline-flex space-x-1 rtl:space-x-reverse rounded-xl bg-gray-100/80 dark:bg-gray-800/60 p-1">
					<Tab v-for="(category, index) in categories" :key="index"
						@click.prevent="getMissions(category.slug)" class="ring-0 outline-none">
						<button
							class="w-full flex items-center rounded-lg py-2 px-3 text-sm font-semibold leading-5 ring-0 outline-none transition-colors duration-200"
							:class="[category.slug === selectedCategory ? 'bg-white dark:bg-gray-900 shadow-sm text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100']">
							<span>{{ category.title }}</span>
						</button>
					</Tab>
				</TabList>
			</TabGroup>

		<div v-if="loadingMissions"
			class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
			<MissionCardLoading v-for="i in 6" :key="i" />
		</div>
		<div v-else>
			<div v-if="missions && missions.length > 0"
				class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
				<MissionCard v-for="mission in missions" :key="mission.id" :mission="mission"
					@mission-details="handleMissionDetails" />
			</div>
			<div v-else
							class="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 md:p-14 text-center">
							<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/10 text-amber-500">
								<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
								</svg>
							</div>
							<p class="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-200">{{ $t("panel.common.empty") }}</p>
						</div>
		</div>
		</div>
	</PanelMasterPage>



	<div id="categories-bottom-sheet"
		class="md:hidden fixed z-40 w-full overflow-y-auto bg-white rounded-t-2xl dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 translate-y-full"
		tabindex="-1" aria-labelledby="categories-bottom-sheet-label">
		<div class="p-4 cursor-pointer" data-drawer-toggle="categories-bottom-sheet">
			<span
				class="absolute w-24 h-1 -translate-x-1/2 bg-gray-400 rounded-lg top-3 left-1/2 dark:bg-gray-400"></span>
			<span id="sidebar-drawer-swipe-label"
				class="w-full mt-6 mb-3 inline-flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
				<svg class="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path opacity="0.2"
						d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z"
						fill="currentColor"></path>
					<path
						d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z"
						fill="currentColor"></path>
					<path
						d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
						fill="currentColor"></path>
				</svg>
				{{ $t("panel.missions.selectCategoryHint") }}
			</span>
		</div>

		<div class="max-h-[60vh] overflow-auto mx-1 px-1.5">
			<div class="px-6 pt-3 pb-5">
				<button @click.prevent="getMissions(category.slug)" v-for="(category, i) in categories" :key="i"
					class="mb-2 last:mb-0 align-middle select-none font-bold text-center  disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-xl bg-gray-900 text-white   block w-full"
					:class="{ 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300 bg-sky-900/75': selectedCategory === category.slug }"
					type="button">
					{{ category.title }}
				</button>
			</div>
		</div>
	</div>


	<BottomSheetDrawer v-model="isOpenMissionDetailsModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
		:autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
		:panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:w-[40rem] lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
		:contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
		:backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
		<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
			<div class="order-1 md:order-0 flex items-center text-start text-gray-900 dark:text-gray-50 font-bold">
				<span class="text-sm text-gray-500 dark:text-amber-400 me-2">{{ $t("panel.missions.titleLabel") }}
				</span>
				{{ missionDetails.title }}
			</div>
			<button @click="closeMissionDetailsModal" type="button"
				class="order-0 md:order-1 focus:ring-0 focus:outline-none bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-gray-900 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-gray-100 dark:hover:text-white">
				<svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
					viewBox="0 0 14 14">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
				</svg>
				<span class="sr-only">Close modal</span>
			</button>
		</div>
		<hr class="my-4 border-gray-200 border-t dark:border-opacity-10 mx-3" />
		<div class="flex items-center">
			<div
				class="w-24 h-24 me-2 shadow-md shadow-gray-400 dark:shadow-gray-700 rounded-xl hover:rounded-full transition-all duration-200 border-2 border-gray-200 dark:border-opacity-20 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800">
				<SeoImage
					:src="missionDetails.icon"
					:alt="missionDetails.title || 'mission'"
					:width="96"
					:height="96"
					sizes-preset="icon"
					img-class="w-full h-full object-cover hover:scale-105 transition-all duration-150"
				/>
			</div>
			<div class="flex-1 flex-col relative">
				<div class="mb-10 flex items-center text-xs">
					<div class="flex items-center">
						<span class="text-gray-500 dark:text-gray-400">{{ $t("panel.missions.currentLevel") }} </span>
						<span
							class="ms-2 bg-gray-200/60 dark:bg-gray-200/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded">{{
								missionDetails.currentLevel }}</span>
					</div>
					<div class="mx-3 dark:text-gray-500">-</div>
					<div class="flex items-center">
						<span class="text-gray-500 dark:text-gray-400">{{ $t("panel.missions.totalLevels") }} </span>
						<span
							class="ms-2 bg-gray-200/60 dark:bg-gray-200/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded">{{
								missionDetails.maxLevel }}</span>
					</div>
				</div>
				<div dir="ltr"
					class="flex items-center my-1 h-[6px] p-[1.5px] md:h-[8px] md:p-[2px] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
					<div class="h-full rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-600"
						:style="{ width: `${missionDetails.progressPercent}%` }"></div>
					<div dir="rtl"
						class="flex items-center justify-center absolute -mt-7 lg:-mt-10 rounded px-2 py-0.5 text-[7px] md:text-[10px] text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-950">
						{{ missionDetails.progressPercent }}%
						<span class="ms-1"> {{ $t("panel.missions.completed") }}</span>
					</div>
				</div>
			</div>
		</div>
		<hr class="my-4 border-gray-200 border-t dark:border-opacity-10 mx-3" />
		<div>
			<h5 class="mb-1 text-sm text-start font-semibold text-gray-600 dark:text-amber-400">
				{{ $t("panel.missions.descriptionLabel") }}
			</h5>
			<div
				class="bg-gray-100/50 dark:bg-slate-800/50 text-sm text-gray-700 dark:text-gray-300 rounded-lg p-2 md:p-3 text-start">
				<p v-html="missionDetails.description" class=""></p>
			</div>
		</div>
		<hr class="my-4 border-gray-200 border-t dark:border-opacity-10 mx-3" />
		<div>
			<h5 class="mb-2 text-sm text-start font-semibold text-gray-600 dark:text-amber-400 flex items-center">
				{{ $t("panel.missions.levelsTable") }}
				<svg class="mt-2 w-4 h-4 ms-2 ltr:hidden" viewBox="0 0 24 24" fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M10.6013 6.84996C10.6023 5.74539 11.4986 4.85079 12.6032 4.85181L20.6032 4.8592L20.605 2.8592L12.605 2.85181C10.3959 2.84977 8.60335 4.63897 8.60131 6.84811L8.59179 17.1538L4.81054 13.3656L3.39502 14.7785L9.7531 21.1483L16.1229 14.7902L14.71 13.3747L10.5915 17.4856L10.6013 6.84996Z"
						fill="currentColor"></path>
				</svg>
				<svg class="mt-2 w-4 h-4 ms-2 rtl:hidden" viewBox="0 0 24 24" fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M13.3987 6.84996C13.3977 5.74539 12.5014 4.85079 11.3969 4.85181L3.39687 4.8592L3.39502 2.8592L11.395 2.85181C13.6042 2.84977 15.3967 4.63897 15.3987 6.84811L15.4082 17.1538L19.1895 13.3656L20.605 14.7785L14.2469 21.1483L7.87709 14.7902L9.28999 13.3747L13.4085 17.4856L13.3987 6.84996Z"
						fill="currentColor"></path>
				</svg>
			</h5>
			<div class="relative overflow-x-auto shadow-md rounded-lg">
				<table class="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
					<thead class="text-xs text-gray-700 dark:text-white bg-gray-300 dark:bg-gray-700/40">
						<tr>
							<th scope="col" class="w-10 px-2 py-2 text-center">
								{{ $t("panel.missions.level") }}
							</th>
							<th scope="col" class="w-16 px-4 py-2 text-center">
								{{ $t("panel.missions.status") }}
							</th>
							<th scope="col" class="w-10 px-4 py-2 text-center">
								{{ $t("panel.missions.goal") }}
							</th>
							<th scope="col" class="w-16 px-4 py-2 text-center">
								{{ $t("panel.missions.points") }}
							</th>
							<th scope="col" class="px-4 py-2 text-start">
								{{ $t("panel.missions.prerequisite") }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(level, i) in missionDetails.levels" :key="i"
							class="text-sm font-semibold text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-500/40 border-b-2 border-white dark:border-gray-900 last:border-b-0">
							<th scope="row" class="w-10 px-2 py-2 text-center ">
								{{ i }}
							</th>
							<td class="w-16 px-4 py-2 text-center">
								<svg v-if="missionDetails.currentLevel >= i" class="w-4 h-4 m-auto" viewBox="0 0 24 24"
									fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd"
										d="M7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782ZM15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L12.0243 14.3899C11.4586 14.9556 10.5414 14.9556 9.97568 14.3899L11 13.3656L9.97568 14.3899L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929C8.68342 10.9024 9.31658 10.9024 9.70711 11.2929L11 12.5858L14.2929 9.29289C14.6834 8.90237 15.3166 8.90237 15.7071 9.29289Z"
										fill="currentColor"></path>
								</svg>
							</td>
							<td class="w-10 px-4 py-2 text-center">
								{{ level.goal }}
							</td>
							<td class="w-16 px-4 py-2 text-center">
								{{ level.exp }}
							</td>
							<td class="px-4 py-2 text-start whitespace-nowrap">
								<div v-if="level.requirements && level.requirements.length > 0" class="">
									<div v-for="(requirement, i) in level.requirements" :key="i"
										class="flex items-center text-xs py-2 border-b-2 border-white dark:border-gray-900/50 last:border-b-0 first:pt-0 last:pb-0">
										<span class="me-1">{{ i + 1 }} - </span>
										<span class="">{{ $t("panel.missions.level") }}</span>
										<span class="mx-2 rounded bg-white dark:bg-gray-900/30 px-1.5 py-0.5">{{
											requirement.level }}</span>
										<span class="">{{ $t("panel.missions.fromMission") }}</span>
										<span class="ms-2 rounded bg-white dark:bg-gray-900/30 px-1.5 py-0.5">{{
											requirement.title }}</span>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</BottomSheetDrawer>
</template>

<script>
import PanelMasterPage from "@/views/page/panel/layouts/PanelMasterPage.vue";
import MissionCard from "@/views/components/mission/MissionCard.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { ref } from "vue";
import MissionCardLoading from "@/views/components/mission/MissionCardLoading.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import axiosInstance from "@/store/axiosInstance";
import { initDrawers } from "flowbite";
export default {
	components: {
		PanelMasterPage,
		BottomSheetDrawer,
		MissionCard,
		MissionCardLoading,
		SeoImage,
	},
	data() {
		return {
			loadingCategories: false,
			loadingMissions: false,
			isOpenMissionDetailsModal: false,
			missionDetails: {},
			categories: ref(null),
			selectedCategory: null,
			missions: ref(null),
			categoriesLoaded: false
		}
	},
	methods: {
		handleMissionDetails(missionId) {
			const index = this.missions.findIndex((n) => n.id === missionId);
			if (index !== -1) {
				this.missionDetails = this.missions[index];
			}
			this.openMissionDetailsModal()

		},
		closeMissionDetailsModal() {
			this.isOpenMissionDetailsModal = false;
		},
		openMissionDetailsModal() {
			this.isOpenMissionDetailsModal = true;
		},
		getMissions(category) {
			// If categories haven't been loaded yet, load them too
			if (!this.categoriesLoaded) {
				this.loadingCategories = true;
			}

			// Always show loading for missions when switching categories
			this.loadingMissions = true;

			const params = new URLSearchParams();
			if (category) {
				this.selectedCategory = category
				params.set("category", category);
			} else {
				params.delete("category");
			}

			const decaodeParams = decodeURIComponent(params.toString());

			if (decaodeParams.length > 0) window.history.replaceState({}, "", `${window.location.origin + window.location.pathname}?${decaodeParams}`);
			else window.history.replaceState({}, "", `${window.location.origin + window.location.pathname}`);
			axiosInstance
				.post(`/panel/missions?${decaodeParams}`)
				.then((response) => {
					// Only update categories on first load
					if (!this.categoriesLoaded) {
						this.categories = response.data.categories;
						this.categoriesLoaded = true;
						if (this.selectedCategory == null) {
							this.selectedCategory = this.categories[0] ? this.categories[0].slug : null
						}
					}
					// Always update missions
					this.missions = response.data.missions;
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					this.loadingCategories = false;
					this.loadingMissions = false;
				});
		}

	},
	mounted() {
		document.title = this.$t("panel.missions.documentTitle");
		initDrawers();
		this.getMissions()
	}

}
</script>

<style></style>