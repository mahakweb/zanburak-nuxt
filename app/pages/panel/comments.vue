<script setup>
definePageMeta({
  name: "panel-comments",
  middleware: ['auth'],
})
</script>

﻿<template>
    <PanelMasterPage>
        <div class="w-full space-y-5">
            <div class="md:hidden">
                <Listbox v-model="selectedFilter" v-slot="{ open }" as="div" class="w-full">
                    <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
                    <div class="mt-1 relative" :class="open ? ' z-20' : ''">
                        <ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''" class="w-full flex justify-between items-center px-3 py-3 md:py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-xl text-sm">
                            <div class="flex items-center">
                                <span class="flex items-center me-2">
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path opacity="0.4" d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
                                <span class="flex items-center line-clamp-1 font-semibold">{{ selectedFilter.title }}</span>
                            </div>
                            <div class="border-s border-current px-3 py-1.5">
                                <svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor" stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </div>
                        </ListboxButton>
                        <ListboxOptions class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-sm space-y-1 p-2 rounded-b-xl">
                            <ListboxOption v-for="(filter, index) in filters" :key="index" @click.prevent="filter.slug == 'article' || loading ? null : selectFilter(filter)" :value="filter" :disabled="filter.slug == 'article' || filter.slug == selectedFilter.slug || loading" class="flex items-center px-2 py-3 md:py-2 rounded-lg cursor-pointer" :class="selectedFilter == filter ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:bg-opacity-50'">
                                <span v-html="filter.icon"></span>
                                <span class="ms-2 font-semibold">{{ filter.title }}</span>
                            </ListboxOption>
                        </ListboxOptions>
                    </div>
                </Listbox>
            </div>
            <div class="">
                <TabGroup>
                    <div class="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0">
                        <TabList class="hidden md:inline-flex space-x-1 rtl:space-x-reverse rounded-xl bg-gray-100/80 dark:bg-gray-800/60 p-1">
                            <Tab v-for="(filter, index) in filters" :key="index" @click.prevent="selectFilter(filter)" class="ring-0 outline-none">
                                <button :disabled="filter.slug == 'article' || filter.slug == selectedFilter.slug || loading" class="w-full flex items-center rounded-lg py-2 px-3 text-sm font-semibold leading-5 ring-0 outline-none transition-colors duration-200" :class="[filter.slug === selectedFilter.slug ? 'bg-white dark:bg-gray-900 shadow-sm text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100']">
                                    <span class="me-2" v-html="filter.icon"></span>
                                    <span>{{ filter.title }}</span>
                                </button>
                            </Tab>
                        </TabList>
                        <div class="flex items-center space-x-3 rtl:space-x-reverse">
                            <Listbox v-model="selectedStatus" v-slot="{ open }" as="div" class="w-40">
                                <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
                                <div class="mt-1 relative" :class="open ? ' z-20' : ''">
                                    <ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''" class="w-full flex justify-between items-center px-3 py-3 md:py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs">
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
                                            <span class="mx-1.5 flex items-center line-clamp-1 font-semibold">{{ selectedStatus.title }}</span>
                                        </div>
                                        <div class="border-s border-current px-3 py-1.5">
                                            <svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor" stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                        </div>
                                    </ListboxButton>
                                    <ListboxOptions class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-xs space-y-1 p-2 rounded-b-xl">
                                        <ListboxOption v-for="(sta, index) in status" :key="index" @click.prevent="selectStatus(sta)" :value="sta" :disabled="false" class="flex items-center px-2 py-3 md:py-2 rounded-lg cursor-pointer" :class="selectedStatus == sta ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:bg-opacity-50'">
                                            <span v-html="sta.icon"></span>
                                            <span class="ms-2 font-semibold">{{ sta.title }}</span>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                            <Listbox v-model="selectedSort" v-slot="{ open }" as="div" class="w-40">
                                <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
                                <div class="mt-1 relative" :class="open ? ' z-20' : ''">
                                    <ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''" class="w-full flex justify-between items-center px-3 py-3 md:py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs">
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
                                            <span class="mx-1.5 flex items-center line-clamp-1 font-semibold">{{ selectedSort.title }}</span>
                                        </div>
                                        <div class="border-s border-current px-3 py-1.5">
                                            <svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor" stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                        </div>
                                    </ListboxButton>
                                    <ListboxOptions class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-xs space-y-1 p-2 rounded-b-xl">
                                        <ListboxOption v-for="(srt, index) in sort" :key="index" @click.prevent="selectSort(srt)" :value="srt" :disabled="false" class="flex items-center px-2 py-3 md:py-2 rounded-lg cursor-pointer" :class="selectedSort == srt ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:bg-opacity-50'">
                                            <span v-html="srt.icon"></span>
                                            <span class="ms-2 font-semibold">{{ srt.title }}</span>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                        </div>
                    </div>

                    <TabPanels class="mt-4 md:mt-8">
                        <!-- <TabPanel class="rounded-xl bg-white dark:bg-gray-900 p-3 outline-none"> -->
                        <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
                            <CommentCardLoading v-for="i in 4" :key="i" />
                        </div>
                        <div v-else id="data-list">
                            <div v-if="comments && comments.length > 0" class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
                                <CommentCard v-for="(comment, i) in comments" :key="i" :type="selectedFilter.slug" :comment="comment" />
                            </div>
                            <div v-else class="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 md:p-14 text-center">
                                <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/10 text-amber-500">
                                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.84L3 20l1.34-3.34A7.9 7.9 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p class="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-200">{{ $t("panel.common.empty") }}</p>
                            </div>
                        </div>
                        <!-- </TabPanel> -->
                    </TabPanels>
                    <div v-if="comments.length > 0 && pagination.last_page > 1" class="my-10 flex items-center justify-center">
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
import CommentCard from "@/views/components/comment/CommentCard.vue";
import CommentCardLoading from "@/views/components/comment/CommentCardLoading.vue";
import { TabGroup, TabList, Tab, TabPanels, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
export default {
    components: {
        PanelMasterPage,
        PaginationComponent,
        CommentCard,
        CommentCardLoading,
        TabGroup,
        TabList,
        Tab,
        TabPanels,
        // TabPanel,
        Listbox,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        const slugFilterFromUrl = urlParams.get("filter") || "course";
        const slugSortFromUrl = urlParams.get("sort") || "newest";
        const slugStatusFromUrl = urlParams.get("status") || "all";
        const filters = {
            course: {
                title: this.$t("panel.comments.filterCourse"),
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
							</svg>`,
            },
            episode: {
                title: this.$t("panel.comments.filterEpisode"),
                english_title: "episode",
                slug: "episode",
                icon: `<svg class="w-5 h-5" viewBox="0 2 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M8.5138 3.21242C8.22014 2.92817 7.74524 2.92935 7.45307 3.21505C7.1609 3.50075 7.16211 3.96278 7.45577 4.24703L9.52322 6.24825C9.23242 6.28633 8.9428 6.3357 8.65504 6.39637L8.21242 6.48969C6.05299 6.94497 4.34427 8.54982 3.80051 10.6334C3.39983 12.1687 3.39983 13.7771 3.80051 15.3125C4.23255 16.968 5.40001 18.3212 6.94466 19.0358L6.37616 19.8654C6.14638 20.2007 6.23952 20.6538 6.58419 20.8774C6.92886 21.1009 7.39454 21.0103 7.62432 20.675L8.4283 19.5017L8.65504 19.5495C10.2004 19.8753 11.7996 19.8753 13.345 19.5495L13.5726 19.5015L14.3767 20.675C14.6065 21.0103 15.0722 21.1009 15.4169 20.8774C15.7615 20.6538 15.8547 20.2007 15.6249 19.8654L15.0561 19.0354C16.6004 18.3207 17.7675 16.9677 18.1995 15.3125C18.6002 13.7771 18.6002 12.1687 18.1995 10.6334C17.6557 8.54982 15.947 6.94497 13.7876 6.48969L13.345 6.39637C13.0574 6.33573 12.7679 6.28638 12.4773 6.24832L14.5448 4.24703C14.8385 3.96278 14.8397 3.50075 14.5475 3.21505C14.2554 2.92935 13.7804 2.92817 13.4868 3.21242L11.0003 5.61926L8.5138 3.21242Z"
								fill="currentColor"></path>
						</svg>`,
            },
            article: {
                title: this.$t("panel.comments.filterArticle"),
                english_title: "article",
                slug: "article",
                icon: `<svg class="w-5 h-5" viewBox="0 2 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd"
								d="M14.9703 3.3437C13.0166 2.88543 10.9834 2.88543 9.02975 3.3437C6.20842 4.00549 4.0055 6.20841 3.3437 9.02975C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C4.0055 17.7916 6.20842 19.9945 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C17.7916 19.9945 19.9945 17.7916 20.6563 14.9703C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20842 17.7916 4.00549 14.9703 3.3437ZM8.55377 9.12812C8.55377 8.8109 8.81093 8.55374 9.12815 8.55374H12.9573C13.2745 8.55374 13.5317 8.8109 13.5317 9.12812C13.5317 9.44533 13.2745 9.70249 12.9573 9.70249H9.12815C8.81093 9.70249 8.55377 9.44533 8.55377 9.12812ZM8.55377 12C8.55377 11.6828 8.81093 11.4256 9.12815 11.4256H14.8719C15.1891 11.4256 15.4462 11.6828 15.4462 12C15.4462 12.3172 15.1891 12.5743 14.8719 12.5743H9.12815C8.81093 12.5743 8.55377 12.3172 8.55377 12ZM8.55377 14.8718C8.55377 14.5546 8.81093 14.2975 9.12815 14.2975H12C12.3172 14.2975 12.5744 14.5546 12.5744 14.8718C12.5744 15.189 12.3172 15.4462 12 15.4462H9.12815C8.81093 15.4462 8.55377 15.189 8.55377 14.8718Z"
								fill="currentColor"></path>
						</svg>`,
            },
            path: {
                title: this.$t("panel.comments.filterPath"),
                english_title: "path",
                slug: "path",
                icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M16.3027 15.3365H6.68V20.1818C6.68 20.6337 6.30392 21 5.84 21C5.37608 21 5 20.6337 5 20.1818V3.81818C5 3.36631 5.37608 3 5.84 3H16.3027C17.4037 3 18.2506 3.65926 18.6739 4.48207C19.0965 5.30334 19.1414 6.35681 18.6123 7.28021L18.1096 8.15756C17.757 8.77312 17.757 9.56335 18.1096 10.1789L18.6123 11.0563C19.1414 11.9797 19.0965 13.0331 18.6739 13.8544C18.2506 14.6772 17.4037 15.3365 16.3027 15.3365Z" fill="currentColor"></path>
						</svg>`,
            },
        };
        const sort = {
            newest: {
                title: this.$t("panel.common.sortNewest"),
                english_title: "newest",
                slug: "newest",
                icon: ``,
            },
            oldest: {
                title: this.$t("panel.common.sortOldest"),
                english_title: "oldest",
                slug: "oldest",
                icon: ``,
            },
        };
        const status = {
            all: {
                title: this.$t("panel.common.statusAll"),
                english_title: "all",
                slug: "all",
                icon: ``,
            },
            published: {
                title: this.$t("panel.common.statusPublished"),
                english_title: "published",
                slug: "published",
                icon: ``,
            },
            unpublished: {
                title: this.$t("panel.common.statusUnpublished"),
                english_title: "unpublished",
                slug: "unpublished",
                icon: ``,
            },
        };
        const selectedFilter = filters[slugFilterFromUrl] || filters["course"];
        const selectedSort = sort[slugSortFromUrl] || sort["newest"];
        const selectedStatus = status[slugStatusFromUrl] || status["all"];
        return {
            comments: [],
            filters,
            selectedFilter,
            sort,
            selectedSort,
            status,
            selectedStatus,
            currentPage: this.$route.query.page ? this.$route.query.page : 1,
            loading: false,
            pagination: {},
            mounted: false,
        };
    },
    methods: {
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

        selectStatus(status) {
            this.selectedStatus = status;
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

            if (this.selectedFilter && this.selectedFilter.slug !== "course") {
                query.filter = this.selectedFilter.slug;
            }
            if (this.selectedStatus && this.selectedStatus.slug !== "all") {
                query.status = this.selectedStatus.slug;
            }
            if (this.selectedSort && this.selectedSort.slug !== "newest") {
                query.sort = this.selectedSort.slug;
            }

            if (this.currentPage !== 1) {
                query.page = this.currentPage;
            }

            const queryString = new URLSearchParams(query).toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

            window.history.pushState(null, "", newUrl);

            this.getComments();
        },

        async getComments() {
            try {
                this.loading = true;

                let params = {
                    page: this.currentPage,
                    filter: this.selectedFilter ? this.selectedFilter.slug : undefined,
                    sort: this.selectedSort ? this.selectedSort.slug : undefined,
                    status: this.selectedStatus ? this.selectedStatus.slug : undefined,
                };

                Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

                const response = await axiosInstance.post("/panel/comments", params);
                this.comments = response.data.comments;
                this.currentPage = response.data.pagination.current_page;
                this.pagination = response.data.pagination;
                if (this.mounted)
                    setTimeout(() => {
                        document.getElementById("data-list").scrollIntoView({ behavior: "smooth" });
                    }, 200);
            } catch (error) {
                console.error("Error loading comments:", error);
            } finally {
                this.loading = false;
                this.mounted = true;
            }
        },
    },

    mounted() {
        document.title = this.$t("panel.comments.documentTitle");
        this.updateUrlAndFetchData();
    },
};
</script>

<style></style>
