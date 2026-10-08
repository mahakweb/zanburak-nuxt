<template>

    <BottomSheetDrawer v-model="bottomSheetVisible" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        backdrop-z-class="z-[2000000010]"
        panel-z-class="z-[2000000020]"
        :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[35rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
        :contentClass="'px-2 pb-4 overflow-auto'"
        :backdropClass="'bg-white-40 dark:bg-black/45 backdrop-blur-sm'">
        <div class="h-full flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-2 rounded-t dark:border-gray-600">
                <div class="relative w-full flex items-center">
                    <div class="absolute rtl:-mt-0.5 start-3 flex items-center pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" width="16" height="17" viewBox="0 0 16 17"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="7.82495" cy="7.82492" r="6.74142" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round"></circle>
                            <path d="M12.5137 12.8638L15.1568 15.4999" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                    <svg v-if="searchLoading" class="absolute rtl:-mt-0.5 end-3 w-4 h-4" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="25 25 50 50">
                        <circle class="stroke-current text-rose-600 text-opacity-30" cx="50" cy="50" r="20" fill="none"
                            stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300">
                        </circle>
                        <circle class="stroke-current text-rose-600" cx="50" cy="50" r="20" fill="none" stroke-width="8"
                            stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
                            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50"
                                to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                            <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s"
                                repeatCount="indefinite"></animate>
                            <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s"
                                repeatCount="indefinite"></animate>
                        </circle>
                    </svg>
                    <input @input="handleSearch" ref="searchKey" v-model="searchKey" type="text"
                        class="rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 font-semibold ltr:tracking-wide text-sm w-full px-10 py-2.5 dark:text-white focus:outline-none placeholder:font-light placeholder:text-gray-400/80 dark:placeholder:text-gray-400/70 placeholder:text-xs placeholder:text-medium"
                        :placeholder="$t('search.minChars')" required autocomplete="off" autocorrect="off"
                        autocapitalize="off" enterkeyhint="go" spellcheck="false" maxlength="" aria-activedescendant=""
                        aria-controls="" />
                </div>
            </div>

            <div v-if="searchKey && searchKey.trim().length > 2" class="px-2 pb-2 flex flex-wrap items-center gap-2">
                <button v-for="filter in typeFilters" :key="filter.value" type="button"
                    @click="setActiveType(filter.value)" class="px-2.5 py-1 rounded-lg text-xs font-medium transition"
                    :class="activeType === filter.value
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'">
                    {{ filter.label }}
                    <span v-if="facetCount(filter.value)" class="opacity-70">({{ facetCount(filter.value) }})</span>
                </button>

                <select v-model="activeSort" @change="performSearch"
                    class="ms-auto rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs px-2 py-1 border-0 focus:ring-1 focus:ring-yellow-400">
                    <option value="relevance">{{ $t('search.sort.relevance') }}</option>
                    <option value="newest">{{ $t('search.sort.newest') }}</option>
                    <option value="popular">{{ $t('search.sort.popular') }}</option>
                </select>
            </div>


            <!-- Body -->
            <div ref="searchScrollContainer" class="flex-1 mt-2 overflow-y-auto custom-scrollbar">
                <div v-if="searchResult && searchResult.length > 0" class="max-w-full">
                    <div class="">
                        <ul class="grid gap-0.5">
                            <li v-for="(item, index) in searchResult" :key="item.type + '-' + item.id"
                                :ref="'searchItem-' + index"
                                class="group flex flex-col bg-gray-100 hover:bg-gray-700 focus:bg-gray-700 hover:text-gray-100 rounded-sm first:rounded-t-lg last:rounded-b-lg transition dark:hover:bg-blue-600/30 dark:focus:bg-blue-600/30 dark:bg-slate-800/50"
                                :class="{ 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-800': activeIndex === index }">
                                <!-- course -->
                                <router-link v-if="item.type === 'course'" class=""
                                    :to="{ name: 'course.show', params: { courseSlug: item.slug } }">
                                    <div class="px-3 py-1.5">
                                        <div class="flex justify-between items-center">
                                            <div>
                                                <h3 class="group-hover:text-gray-100 text-sm font-semibold text-gray-800 dark:group-hover:text-gray-100 dark:text-gray-200 line-clamp-1"
                                                    v-html="highlightText(item, 'title')"></h3>
                                                <p
                                                    class="mt-0.5 text-xs font-light text-gray-500 dark:text-gray-400 group-hover:text-gray-100">
                                                    {{ $t('search.contains') }} <span class="font-semibold mx-0.5">{{
                                                        item.number_of_episodes }}</span> {{ $t('search.sessions') }}
                                                </p>
                                            </div>
                                            <div class="flex py-1 px-2.5 bg-gray-200 text-gray-800 rounded-md">
                                                <span class="hidden md:block me-1 font-normal text-xs">{{
                                                    $t('course.word') }}</span>
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M19.5617 7C19.7904 5.69523 18.7863 4.5 17.4617 4.5H6.53788C5.21323 4.5 4.20922 5.69523 4.43784 7"
                                                        stroke="currentColor" stroke-width="1.5"></path>
                                                    <path
                                                        d="M17.4999 4.5C17.5283 4.24092 17.5425 4.11135 17.5427 4.00435C17.545 2.98072 16.7739 2.12064 15.7561 2.01142C15.6497 2 15.5194 2 15.2588 2H8.74099C8.48035 2 8.35002 2 8.24362 2.01142C7.22584 2.12064 6.45481 2.98072 6.45704 4.00434C6.45727 4.11135 6.47146 4.2409 6.49983 4.5"
                                                        stroke="currentColor" stroke-width="1.5"></path>
                                                    <path
                                                        d="M14.5812 13.6159C15.1396 13.9621 15.1396 14.8582 14.5812 15.2044L11.2096 17.2945C10.6669 17.6309 10 17.1931 10 16.5003L10 12.32C10 11.6273 10.6669 11.1894 11.2096 11.5258L14.5812 13.6159Z"
                                                        stroke="currentColor" stroke-width="1.5"></path>
                                                    <path
                                                        d="M2.38351 13.793C1.93748 10.6294 1.71447 9.04765 2.66232 8.02383C3.61017 7 5.29758 7 8.67239 7H15.3276C18.7024 7 20.3898 7 21.3377 8.02383C22.2855 9.04765 22.0625 10.6294 21.6165 13.793L21.1935 16.793C20.8437 19.2739 20.6689 20.5143 19.7717 21.2572C18.8745 22 17.5512 22 14.9046 22H9.09536C6.44881 22 5.12553 22 4.22834 21.2572C3.33115 20.5143 3.15626 19.2739 2.80648 16.793L2.38351 13.793Z"
                                                        stroke="currentColor" stroke-width="1.5"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>

                                <!-- episode -->
                                <router-link v-if="item.type === 'episode'" class=""
                                    :to="episodeShowRoute(item.course.slug, item.order)">
                                    <div class="px-3 py-1">
                                        <div class="flex justify-between items-center">
                                            <div>
                                                <h3 class="group-hover:text-gray-100 text-sm font-semibold text-gray-800 dark:group-hover:text-gray-100 dark:text-gray-200 line-clamp-1"
                                                    v-html="highlightText(item, 'title')"></h3>
                                                <router-link
                                                    :to="{ name: 'course.show', params: { courseSlug: item.course.slug } }"
                                                    class="mt-0.5 underline underline-offset-2 text-xs font-light text-gray-500 dark:text-gray-400 group-hover:text-gray-100 line-clamp-1">
                                                    {{ $t('course.word') }}: <span class="font-semibold">{{
                                                        item.course.title }}</span>
                                                </router-link>
                                            </div>
                                            <div class="flex py-1 px-2.5 bg-gray-200 text-gray-800 rounded-md">
                                                <span class="hidden md:block me-1 font-normal text-xs">{{
                                                    $t('search.video') }}</span>
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 16 15" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M1.21523 7.71005C1.21523 9.17121 1.29415 10.313 1.49311 11.2082C1.69087 12.098 2.00086 12.7149 2.4431 13.1572C2.88535 13.5994 3.50225 13.9094 4.39209 14.1072C5.28732 14.3061 6.42907 14.385 7.89023 14.385C9.3514 14.385 10.4931 14.3061 11.3884 14.1072C12.2782 13.9094 12.8951 13.5994 13.3374 13.1572C13.7796 12.7149 14.0896 12.098 14.2874 11.2082C14.4863 10.313 14.5652 9.17121 14.5652 7.71005C14.5652 6.24888 14.4863 5.10713 14.2874 4.2119C14.0896 3.32206 13.7796 2.70516 13.3374 2.26291C12.8951 1.82067 12.2782 1.51068 11.3884 1.31292C10.4931 1.11396 9.3514 1.03505 7.89023 1.03505C6.42907 1.03505 5.28732 1.11396 4.39209 1.31292C3.50225 1.51068 2.88535 1.82067 2.4431 2.26291C2.00086 2.70516 1.69087 3.32206 1.49311 4.2119C1.29415 5.10713 1.21523 6.24888 1.21523 7.71005Z"
                                                        stroke="currentColor" stroke-width="0.95" stroke-linecap="round"
                                                        stroke-linejoin="round"></path>
                                                    <path
                                                        d="M10.6851 7.71005C10.6851 7.30547 10.4465 7.02332 10.1923 6.81277C9.95068 6.61264 9.60427 6.404 9.20383 6.16282C9.19322 6.15643 9.18258 6.15002 9.1719 6.14359L8.2094 5.5638C8.19848 5.55722 8.18759 5.55066 8.17675 5.54412C7.77698 5.30327 7.43037 5.09445 7.14271 4.97588C6.8428 4.85228 6.47141 4.76934 6.11504 4.98401C5.76624 5.19412 5.65515 5.55632 5.60915 5.87961C5.56425 6.19511 5.56428 6.60966 5.56431 7.09408C5.56431 7.1061 5.56431 7.11816 5.56431 7.13026L5.56431 8.28985C5.56431 8.30195 5.56431 8.31401 5.56431 8.32603C5.56428 8.81045 5.56425 9.225 5.60915 9.5405C5.65515 9.86379 5.76624 10.226 6.11504 10.4361C6.47141 10.6508 6.8428 10.5678 7.14271 10.4442C7.43037 10.3257 7.77698 10.1168 8.17674 9.87599C8.18759 9.86945 8.19848 9.86289 8.20941 9.85631L9.1719 9.27652C9.18258 9.27009 9.19323 9.26368 9.20383 9.25729C9.60427 9.01611 9.95068 8.80747 10.1923 8.60734C10.4465 8.39679 10.6851 8.11464 10.6851 7.71005Z"
                                                        stroke="currentColor" stroke-width="0.95" stroke-linecap="round"
                                                        stroke-linejoin="round"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>

                                <!-- question -->
                                <router-link v-if="item.type === 'question'" class=""
                                    :to="{ name: 'question-show', params: { questionSlug: item.slug } }">
                                    <div class="px-3 py-1">
                                        <div class="flex justify-between items-center">
                                            <div>
                                                <h3 class="group-hover:text-gray-100 text-sm font-semibold text-gray-800 dark:group-hover:text-gray-100 dark:text-gray-200 line-clamp-1"
                                                    v-html="highlightText(item, 'subject')"></h3>
                                                <p
                                                    class="mt-0.5 text-xs font-light text-gray-500 dark:text-gray-400 group-hover:text-gray-100 line-clamp-1">
                                                    {{ $t('search.has') }} <span class="font-semibold mx-0.5">{{
                                                        item.number_of_answers }}</span>
                                                    {{ $t('search.answers') }}
                                                </p>
                                            </div>
                                            <div class="flex py-1 px-2.5 bg-gray-200 text-gray-800 rounded-md">
                                                <span class="hidden md:block me-1 font-normal text-xs">{{
                                                    $t('search.question') }}</span>
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.83834 14.1056 10.6796 13.3353 11.1354C13.1385 11.2518 12.9761 11.3789 12.8703 11.5036C12.7675 11.6246 12.75 11.7036 12.75 11.75V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V11.75C11.25 11.2441 11.4715 10.8336 11.7266 10.533C11.9786 10.236 12.2929 10.0092 12.5715 9.84439C12.9044 9.64739 13.125 9.28655 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                                                        fill="currentColor"></path>
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M11.9426 1.25H12.0574C14.3658 1.24999 16.1748 1.24998 17.5863 1.43975C19.031 1.63399 20.1711 2.03933 21.0659 2.93414C21.9607 3.82895 22.366 4.96897 22.5603 6.41371C22.75 7.82519 22.75 9.63423 22.75 11.9426V12.0574C22.75 14.3658 22.75 16.1748 22.5603 17.5863C22.366 19.031 21.9607 20.1711 21.0659 21.0659C20.1711 21.9607 19.031 22.366 17.5863 22.5603C16.1748 22.75 14.3658 22.75 12.0574 22.75H11.9426C9.63423 22.75 7.82519 22.75 6.41371 22.5603C4.96897 22.366 3.82895 21.9607 2.93414 21.0659C2.03933 20.1711 1.63399 19.031 1.43975 17.5863C1.24998 16.1748 1.24999 14.3658 1.25 12.0574V11.9426C1.24999 9.63424 1.24998 7.82519 1.43975 6.41371C1.63399 4.96897 2.03933 3.82895 2.93414 2.93414C3.82895 2.03933 4.96897 1.63399 6.41371 1.43975C7.82519 1.24998 9.63424 1.24999 11.9426 1.25ZM6.61358 2.92637C5.33517 3.09825 4.56445 3.42514 3.9948 3.9948C3.42514 4.56445 3.09825 5.33517 2.92637 6.61358C2.75159 7.91356 2.75 9.62177 2.75 12C2.75 14.3782 2.75159 16.0864 2.92637 17.3864C3.09825 18.6648 3.42514 19.4355 3.9948 20.0052C4.56445 20.5749 5.33517 20.9018 6.61358 21.0736C7.91356 21.2484 9.62177 21.25 12 21.25C14.3782 21.25 16.0864 21.2484 17.3864 21.0736C18.6648 20.9018 19.4355 20.5749 20.0052 20.0052C20.5749 19.4355 20.9018 18.6648 21.0736 17.3864C21.2484 16.0864 21.25 14.3782 21.25 12C21.25 9.62177 21.2484 7.91356 21.0736 6.61358C20.9018 5.33517 20.5749 4.56445 20.0052 3.9948C19.4355 3.42514 18.6648 3.09825 17.3864 2.92637C16.0864 2.75159 14.3782 2.75 12 2.75C9.62177 2.75 7.91356 2.75159 6.61358 2.92637Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>

                                <!-- article -->
                                <router-link v-if="item.type === 'article'"
                                    :to="{ name: 'article-show', params: { articleSlug: item.slug } }">
                                    <div class="px-3 py-1">
                                        <div class="flex justify-between items-center">
                                            <div>
                                                <h3 class="group-hover:text-gray-100 text-sm font-semibold text-gray-800 dark:group-hover:text-gray-100 dark:text-gray-200 line-clamp-1"
                                                    v-html="highlightText(item, 'title')"></h3>
                                                <p v-if="item.excerpt"
                                                    class="mt-0.5 text-xs font-light text-gray-500 dark:text-gray-400 line-clamp-1"
                                                    v-html="highlightText(item, 'excerpt')"></p>
                                            </div>
                                            <div class="flex py-1 px-2.5 bg-gray-200 text-gray-800 rounded-md">
                                                <span class="hidden md:block me-1 font-normal text-xs">{{
                                                    $t('nav.article') }}</span>
                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M5 3H3v18h18V3H5zm14 2v14H5V5h14zm-2 2H7v2h10V7zM7 11h10v2H7v-2zm7 4H7v2h7v-2z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </li>
                        </ul>
                    </div>

                    <div ref="loadMoreSentinel" class="h-2 w-full"></div>

                    <div v-if="searchLoadingMore" class="py-3 text-center">
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('search.loadingMore') }}</span>
                    </div>
                </div>

                <div v-else-if="searchKey && searchKey.trim().length > 2 && !searchLoading"
                    class="flex flex-col px-4 py-8 text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('search.noResults') }}</p>
                </div>
            </div>

        </div>
    </BottomSheetDrawer>
</template>
<script>
import debounce from "lodash/debounce";
import axiosInstance from "@/store/axiosInstance";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { episodeShowRoute } from "@/utils/episodeRoute";
export default {
    components: {

        BottomSheetDrawer,
    },
    props: {
        autoFocus: {
            type: Boolean,
            default: true,
        },
        visible: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:visible"],
    data() {
        return {
            searchLoading: false,
            searchKey: "",
            previousSearchKey: "",
            searchResult: [],
            searchFacets: {
                types: {
                    course: 0,
                    episode: 0,
                    question: 0,
                    article: 0,
                },
            },
            activeIndex: null,
            activeType: "all",
            activeSort: "relevance",
            currentPage: 1,
            hasMore: false,
            searchLoadingMore: false,
            pageSize: 10,
            loadMoreObserver: null,
        };
    },
    computed: {
        bottomSheetVisible: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            },
        },
        typeFilters() {
            return [
                { value: "all", label: this.$t("search.filters.all") },
                { value: "course", label: this.$t("course.word") },
                { value: "episode", label: this.$t("search.video") },
                { value: "question", label: this.$t("search.question") },
                { value: "article", label: this.$t("nav.article") },
            ];
        },
    },
    watch: {
        visible(newVal) {
            if (newVal && this.autoFocus) {
                // بعد از رندر کامل، اینپوت سرچ را فوکوس کن
                this.$nextTick(() => {
                    if (this.$refs.searchKey && typeof this.$refs.searchKey.focus === "function") {
                        this.$refs.searchKey.focus();
                    }
                    this.setupLoadMoreObserver();
                });
            } else if (!newVal) {
                this.teardownLoadMoreObserver();
            }
        },
        activeIndex(newIndex) {
            if (newIndex !== null) {
                const activeItem = this.$refs[`searchItem-${newIndex}`];
                if (activeItem && activeItem[0]) {
                    activeItem[0].scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "start",
                    });
                }
            }
        },
    },
    methods: {
        episodeShowRoute,
        setActiveType(type) {
            this.activeType = type;
            this.performSearch();
        },
        facetCount(type) {
            if (type === "all") {
                const facets = this.searchFacets?.types || {};
                return Object.values(facets).reduce((sum, count) => sum + count, 0);
            }

            return this.searchFacets?.types?.[type] || 0;
        },
        highlightText(item, field) {
            const highlighted = item?._highlight?.[field];
            if (highlighted) {
                return highlighted.replace(/<mark>/g, '<mark class="bg-yellow-300 text-gray-900 rounded px-0.5">');
            }

            const fallback = item?.[field] || "";
            return this.escapeHtml(String(fallback));
        },
        escapeHtml(value) {
            return value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        },
        buildSearchPayload(page = 1) {
            const payload = {
                key: this.searchKey,
                limit: this.pageSize,
                page,
                sort: this.activeSort,
            };

            if (this.activeType !== "all") {
                payload.types = [this.activeType];
            }

            return payload;
        },
        fetchSearchPage(page, { replace = false } = {}) {
            if (!this.searchKey || this.searchKey.trim().length <= 2) {
                this.searchResult = [];
                this.searchFacets = { types: { course: 0, episode: 0, question: 0, article: 0 } };
                this.hasMore = false;
                this.currentPage = 1;
                return;
            }

            if (replace) {
                this.searchLoading = true;
            } else {
                this.searchLoadingMore = true;
            }

            axiosInstance
                .post("/search", this.buildSearchPayload(page))
                .then((response) => {
                    const results = response.data.result || [];
                    this.searchResult = replace ? results : [...this.searchResult, ...results];
                    this.searchFacets = response.data.facets || { types: { course: 0, episode: 0, question: 0, article: 0 } };
                    this.currentPage = response.data.meta?.page || page;
                    this.hasMore = Boolean(response.data.meta?.has_more);

                    if (replace) {
                        this.activeIndex = null;
                    }

                    this.$nextTick(() => {
                        this.setupLoadMoreObserver();
                    });
                })
                .catch((error) => {
                    console.error(error?.response?.data || error);
                    if (replace) {
                        this.searchResult = [];
                        this.hasMore = false;
                    }
                })
                .finally(() => {
                    this.searchLoading = false;
                    this.searchLoadingMore = false;
                });
        },
        performSearch() {
            this.currentPage = 1;
            this.hasMore = false;
            this.fetchSearchPage(1, { replace: true });
        },
        loadMoreResults() {
            if (this.searchLoading || this.searchLoadingMore || !this.hasMore) {
                return;
            }

            this.fetchSearchPage(this.currentPage + 1, { replace: false });
        },
        setupLoadMoreObserver() {
            this.teardownLoadMoreObserver();

            const root = this.$refs.searchScrollContainer;
            const sentinel = this.$refs.loadMoreSentinel;

            if (!root || !sentinel || !this.hasMore) {
                return;
            }

            this.loadMoreObserver = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        this.loadMoreResults();
                    }
                },
                {
                    root,
                    rootMargin: "120px",
                    threshold: 0,
                }
            );

            this.loadMoreObserver.observe(sentinel);
        },
        teardownLoadMoreObserver() {
            if (this.loadMoreObserver) {
                this.loadMoreObserver.disconnect();
                this.loadMoreObserver = null;
            }
        },
        handleSearch: debounce(function () {
            if (this.searchKey === this.previousSearchKey && this.activeType === this.lastActiveType && this.activeSort === this.lastActiveSort) {
                return;
            }

            this.lastActiveType = this.activeType;
            this.lastActiveSort = this.activeSort;

            if (this.searchKey.trim().length > 2) {
                this.performSearch();
                this.previousSearchKey = this.searchKey;
            } else if (this.searchKey.length === 0) {
                this.searchResult = null;
                this.searchFacets = { types: { course: 0, episode: 0, question: 0, article: 0 } };
                this.previousSearchKey = "";
                this.currentPage = 1;
                this.hasMore = false;
                this.teardownLoadMoreObserver();
            }
        }, 500),

        handleKeyDown(event) {
            if (event.key === "ArrowUp") {
                if (this.activeIndex === null) {
                    this.activeIndex = 0;
                } else {
                    this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : this.searchResult.length - 1;
                }
                this.$refs.searchKey.blur();
            } else if (event.key === "ArrowDown") {
                if (this.activeIndex === null) {
                    this.activeIndex = 0;
                } else {
                    this.activeIndex = this.activeIndex < this.searchResult.length - 1 ? this.activeIndex + 1 : 0;
                }
                this.$refs.searchKey.blur();
            } else if (event.key === "Enter") {
                if (this.activeIndex !== null) {
                    const activeElement = this.$refs[`searchItem-${this.activeIndex}`][0];

                    if (activeElement) {
                        const routerLink = activeElement.querySelector("a");
                        if (routerLink) {
                            routerLink.click();
                        }
                    }
                }
            }
        },
    },
    mounted() {
        this.setupLoadMoreObserver();
    },
    beforeUnmount() {
        this.teardownLoadMoreObserver();
    },
};
</script>
