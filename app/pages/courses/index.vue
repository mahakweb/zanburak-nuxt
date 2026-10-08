<script setup>
import axiosInstance from '@/store/axiosInstance'

definePageMeta({
  name: 'courses',
})

const { data: ssrCoursesBootstrap } = await useAsyncData('courses-bootstrap', async () => {
  try {
    const [coursesRes, pathsRes, filtersRes] = await Promise.all([
      axiosInstance.get('/courses', { params: { page: 1 } }),
      axiosInstance.get('/paths?limit=5&show_courses=true'),
      axiosInstance.get('/courses-page-filter'),
    ])
    return {
      courses: coursesRes.data?.courses || [],
      pagination: coursesRes.data?.pagination || null,
      paths: pathsRes.data?.paths || [],
      sidebarData: filtersRes.data || null,
    }
  } catch {
    return null
  }
})

provide('ssrCoursesBootstrap', ssrCoursesBootstrap)
</script>

<template>
        <section class="pt-5 pb-2 md:pt-10">
            <div class="mx-auto max-w-screen-xl px-3 md:px-4">
                <div class="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-slate-200/80 dark:ring-white/10 shadow-sm md:rounded-[1.75rem]">
                    <div class="pointer-events-none absolute -top-16 -start-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl"></div>
                    <div class="pointer-events-none absolute -bottom-20 end-10 hidden h-40 w-40 rounded-full bg-amber-300/10 blur-3xl lg:block"></div>
                    <div class="relative flex w-full min-w-0 flex-col lg:grid lg:grid-cols-12">
                        <div class="flex w-full min-w-0 flex-col justify-center px-4 py-5 sm:px-5 md:px-8 md:py-8 lg:col-span-4 lg:py-10">
                            <div class="flex items-start justify-between gap-3">
                                <h2 class="min-w-0 flex-1 text-start text-xl font-extrabold tracking-tight text-gray-800 dark:text-white sm:text-2xl md:text-[1.75rem]">
                                    {{ $t('course.list.pathsTitle') }}
                                </h2>
                                <div class="flex shrink-0 items-center gap-1.5">
                                    <button type="button" class="paths-nav-btn custom-prev-path-swiper" aria-label="prev">
                                        <svg class="h-4 w-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none">
                                            <path d="M15 6L9 12l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                    <button type="button" class="paths-nav-btn custom-next-path-swiper" aria-label="next">
                                        <svg class="h-4 w-4 ltr:rotate-180" viewBox="0 0 24 24" fill="none">
                                            <path d="M15 6L9 12l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p class="mt-2 text-start text-[13px] font-normal leading-6 text-gray-500 dark:text-gray-400 sm:mt-3 sm:text-sm sm:leading-7">
                                {{ $t('course.list.pathsDescription') }}
                            </p>
                            <div class="mt-4 sm:mt-5">
                                <NuxtLink
                                    :to="{ name: 'paths' }"
                                    class="inline-flex h-10 w-full items-center justify-center rounded-lg bg-amber-400 px-4 text-sm font-semibold text-gray-800 shadow-amber-400/40 transition hover:opacity-90 hover:shadow-md sm:w-auto">
                                    {{ $t('course.list.viewAllPaths') }}
                                </NuxtLink>
                            </div>
                        </div>
                        <div class="relative w-full min-w-0 overflow-hidden lg:col-span-8 lg:py-6">
                            <div class="pointer-events-none absolute inset-y-6 end-0 z-10 hidden w-10 bg-gradient-to-l from-white dark:from-gray-900 rtl:bg-gradient-to-r lg:block"></div>
                            <div v-if="pathLoading" class="grid grid-cols-1 gap-3 px-4 pb-5 sm:grid-cols-2 lg:px-2 lg:pe-6">
                                <div v-for="index in 2" :key="index" class="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-gray-800 sm:h-44"></div>
                            </div>
                            <swiper
                                v-else-if="paths && paths.length"
                                class="paths-swiper w-full min-w-0 !px-4 !pb-5 lg:!ps-2 lg:!pe-8"
                                :grab-cursor="true"
                                :dir="direction"
                                :slides-per-view="1.08"
                                :space-between="12"
                                :navigation="{ prevEl: '.custom-prev-path-swiper', nextEl: '.custom-next-path-swiper' }"
                                :breakpoints="{
                                    480: { slidesPerView: 1.2, spaceBetween: 12 },
                                    640: { slidesPerView: 1.45, spaceBetween: 14 },
                                    1024: { slidesPerView: 1.65, spaceBetween: 14 },
                                    1280: { slidesPerView: 2.05, spaceBetween: 16 },
                                }"
                                :modules="modules">
                                <swiper-slide v-for="(path, index) in paths" :key="path.slug || index" class="!h-auto min-w-0 p-1">
                                    <article class="group flex h-full min-w-0 flex-col rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-200/80 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-slate-900/5 dark:bg-gray-800/80 dark:ring-white/10 dark:hover:bg-gray-800 sm:p-4">
                                        <div class="flex items-start justify-between gap-2.5">
                                            <NuxtLink
                                                :to="{ name: 'path.show', params: { pathSlug: path.slug } }"
                                                class="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-gray-900 dark:ring-white/10 sm:h-14 sm:w-14">
                                                <SeoImage
                                                    :src="path.icon"
                                                    :alt="path.title || ''"
                                                    :width="56"
                                                    :height="56"
                                                    sizes-preset="icon"
                                                    img-class="h-full w-full object-cover"
                                                />
                                                <InstallmentImageBadge :allows-installment="path.allows_installment" />
                                            </NuxtLink>
                                            <span class="inline-flex h-7 max-w-[60%] items-center truncate rounded-full bg-white px-2.5 text-[11px] font-bold text-gray-600 ring-1 ring-slate-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-white/10">
                                                {{ $t('course.list.includesCourses', { count: path.published_courses?.length || 0 }) }}
                                            </span>
                                        </div>
                                        <NuxtLink :to="{ name: 'path.show', params: { pathSlug: path.slug } }" class="mt-3 sm:mt-4">
                                            <h3 class="line-clamp-1 text-[15px] font-extrabold leading-6 text-gray-800 transition group-hover:text-amber-600 dark:text-gray-50">
                                                {{ path.title }}
                                            </h3>
                                        </NuxtLink>
                                        <p class="mt-1.5 line-clamp-2 flex-1 text-[13px] font-normal leading-6 text-gray-500 dark:text-gray-400">
                                            {{ path.short_description }}
                                        </p>
                                        <div class="mt-3 border-t border-slate-200/80 pt-3 dark:border-white/10 sm:mt-4">
                                            <NuxtLink
                                                :to="{ name: 'path.show', params: { pathSlug: path.slug } }"
                                                class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 transition hover:text-amber-600 dark:text-gray-100 dark:hover:text-amber-400">
                                                {{ $t('course.list.viewPathInfo') }}
                                                <svg class="h-3.5 w-3.5 ltr:rotate-180" viewBox="0 0 24 24" fill="none">
                                                    <path d="M15 6L9 12l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </NuxtLink>
                                        </div>
                                    </article>
                                </swiper-slide>
                            </swiper>
                            <div v-else class="mx-4 mb-5 flex h-36 items-center justify-center rounded-2xl bg-slate-50 text-sm font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400 lg:me-8">
                                {{ $t('course.list.nothingToShow') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="pb-10 pt-6 md:pb-16 md:pt-8">
            <div class="mx-auto max-w-screen-xl px-3 md:px-4">
                <div class="mb-4 flex items-end justify-between gap-4 px-1">
                    <div>
                        <h2 class="text-xl font-extrabold tracking-tight text-gray-800 dark:text-gray-50 md:text-2xl">
                            {{ $t('course.list.title') }}
                        </h2>
                        <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">{{ $t('course.list.subtitle') }}</p>
                    </div>
                </div>

                <div class="lg:hidden sticky top-3 z-20 mb-4">
                    <button
                        type="button"
                        class="flex h-12 w-full items-center justify-between gap-3 rounded-2xl bg-white px-3 text-gray-800 shadow-md shadow-slate-900/5 ring-1 ring-slate-200/80 dark:bg-gray-900 dark:text-gray-50 dark:ring-white/10"
                        @click="isFilterDrawerOpen = true">
                        <span class="inline-flex min-w-0 items-center gap-2.5">
                            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-gray-900">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                </svg>
                            </span>
                            <span class="truncate text-sm font-extrabold">{{ $t('course.list.filterAndCategories') }}</span>
                        </span>
                        <span class="inline-flex shrink-0 items-center gap-2">
                            <span
                                v-if="activeFilterCount"
                                class="inline-flex h-5 min-w-[1.35rem] items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-extrabold text-gray-900">
                                {{ activeFilterCount }}
                            </span>
                            <svg class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </button>
                </div>

                <div v-if="activeFilterChips.length" class="mb-4 flex flex-wrap items-center gap-2">
                    <button
                        v-for="chip in activeFilterChips"
                        :key="`${chip.group}-${chip.value}`"
                        type="button"
                        class="inline-flex h-8 items-center gap-1.5 rounded-full bg-amber-400/15 px-3 text-xs font-bold text-amber-800 ring-1 ring-amber-400/30 dark:text-amber-200"
                        @click="removeFilterChip(chip)">
                        {{ chip.label }}
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </button>
                    <button type="button" class="h-8 px-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" @click="clearFilters">
                        {{ $t('tags.resetFilters') }}
                    </button>
                </div>

                <div class="mb-8 grid items-start gap-5 lg:grid-cols-12 lg:gap-6">
                    <div id="courses-list" class="lg:col-span-9">
                        <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div v-for="index in 6" :key="index">
                                <CourseCard2Loading />
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="courses.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div v-for="(course, index) in courses" :key="course.id || index">
                                    <CourseCard2 :course="course" />
                                </div>
                            </div>
                            <div v-else class="my-8 flex md:my-16">
                                <div class="m-2 mx-auto w-[90%] space-y-6 rounded-2xl bg-white p-3 ring-1 ring-slate-200/80 dark:bg-gray-900 dark:ring-white/10 md:w-1/2">
                                    <div class="flex min-h-[15rem] flex-col items-center justify-center rounded-3xl p-4 md:p-5">
                                        <svg class="max-w-[5rem]" viewBox="0 0 375 428" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M254.509 253.872L226.509 226.872" class="stroke-gray-400 dark:stroke-white" stroke="currentColor" stroke-width="7" stroke-linecap="round"></path>
                                            <path d="M237.219 54.3721C254.387 76.4666 264.609 104.226 264.609 134.372C264.609 206.445 206.182 264.872 134.109 264.872C62.0355 264.872 3.60864 206.445 3.60864 134.372C3.60864 62.2989 62.0355 3.87207 134.109 3.87207C160.463 3.87207 184.993 11.6844 205.509 25.1196" class="stroke-gray-400 dark:stroke-white" stroke="currentColor" stroke-width="7" stroke-linecap="round"></path>
                                            <rect x="270.524" y="221.872" width="137.404" height="73.2425" rx="36.6212" transform="rotate(40.8596 270.524 221.872)" class="fill-gray-400 dark:fill-white" fill="currentColor"></rect>
                                            <ellipse cx="133.109" cy="404.372" rx="121.5" ry="23.5" class="fill-gray-200 dark:fill-gray-500" fill="currentColor"></ellipse>
                                            <path d="M111.608 188.872C120.959 177.043 141.18 171.616 156.608 188.872" class="stroke-gray-400 dark:stroke-white" stroke="currentColor" stroke-width="7" stroke-linecap="round"></path>
                                            <ellipse cx="96.6084" cy="116.872" rx="9" ry="12" class="fill-gray-400 dark:fill-white" fill="currentColor"></ellipse>
                                            <ellipse cx="172.608" cy="117.872" rx="9" ry="12" class="fill-gray-400 dark:fill-white" fill="currentColor"></ellipse>
                                            <path d="M194.339 147.588C189.547 148.866 189.114 142.999 189.728 138.038C189.918 136.501 191.738 135.958 192.749 137.131C196.12 141.047 199.165 146.301 194.339 147.588Z" class="fill-gray-400 dark:fill-white" fill="currentColor"></path>
                                        </svg>
                                        <p class="mt-5 text-sm font-semibold text-gray-500">{{ $t('course.list.noCourses') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="courses.length != 0" class="my-12 flex items-center justify-center">
                            <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                        </div>
                    </div>

                    <aside class="order-last space-y-4 lg:order-first lg:col-span-3">
                        <div class="hidden lg:block">
                            <CourseListFilters
                                id-prefix="desktop"
                                :sidebar-data="sidebarData"
                                :filters="filters"
                                :categories-expanded="categoriesExpanded"
                                :category-preview-count="categoryPreviewCount"
                                @change="getCourses()"
                                @update:categories-expanded="categoriesExpanded = $event" />
                        </div>
                        <div class="rounded-2xl bg-white p-5 text-center ring-1 ring-slate-200/80 dark:bg-gray-900 dark:ring-white/10">
                            <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-500">
                                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 3l2.1 1.4 2.5-.3 1.3 2.2 2.2 1.3-.3 2.5L21 12l-1.2 2.1.3 2.5-2.2 1.3-1.3 2.2-2.5-.3L12 21l-2.1-1.2-2.5.3-1.3-2.2-2.2-1.3.3-2.5L3 12l1.2-2.1-.3-2.5 2.2-1.3 1.3-2.2 2.5.3L12 3z" stroke="currentColor" stroke-width="1.6" />
                                    <path d="M9 12.2l1.8 1.8L15.2 9.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <h3 class="text-base font-extrabold text-gray-800 dark:text-gray-50">{{ $t('course.list.certificateTitle') }}</h3>
                            <p class="mt-2 text-sm font-normal leading-7 text-gray-500 dark:text-gray-400">{{ $t('course.list.certificateDescription') }}</p>
                            <NuxtLink :to="{ name: 'what-is-certification' }" class="mt-4 inline-flex text-sm font-bold text-amber-600 transition hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
                                {{ $t('course.list.whatIsCertificate') }}
                            </NuxtLink>
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        <BottomSheetDrawer
            v-model="isFilterDrawerOpen"
            :initial-height="0.82"
            :min-height="0.5"
            :max-height="0.94"
            :header-height="56"
            :auto-close-on-min="true"
            content-class="overflow-hidden px-0 pb-0"
            panel-class="bg-slate-100 dark:bg-gray-800 border-t border-slate-200 dark:border-white/10 rounded-t-[1.5rem] md:rounded-b-2xl shadow-[0_-12px_40px_rgba(15,23,42,0.28)]">
            <div class="flex h-full min-h-0 flex-col">
                <div class="shrink-0 px-4 pb-3">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <h3 class="text-base font-extrabold text-gray-800 dark:text-gray-50">{{ $t('course.list.filterAndCategories') }}</h3>
                            <p class="mt-1 text-xs font-normal leading-5 text-gray-500 dark:text-gray-400">{{ $t('course.list.filterDrawerHint') }}</p>
                        </div>
                        <button
                            v-if="activeFilterCount"
                            type="button"
                            class="shrink-0 text-xs font-bold text-amber-600 dark:text-amber-400"
                            @click="clearFilters">
                            {{ $t('tags.resetFilters') }}
                        </button>
                    </div>
                </div>
                <div class="min-h-0 flex-1 overflow-auto px-4 pb-4 custom-scrollbar">
                    <CourseListFilters
                        id-prefix="drawer"
                        :sidebar-data="sidebarData"
                        :filters="filters"
                        :categories-expanded="categoriesExpanded"
                        :category-preview-count="categoryPreviewCount"
                        @change="getCourses()"
                        @update:categories-expanded="categoriesExpanded = $event" />
                </div>
                <div class="shrink-0 border-t border-slate-200 bg-white/95 px-4 py-3 dark:border-white/10 dark:bg-gray-900/95">
                    <button
                        type="button"
                        class="flex h-11 w-full items-center justify-center rounded-xl bg-amber-400 text-sm font-extrabold text-gray-900 shadow-amber-400/30 transition hover:opacity-90"
                        @click="applyFiltersAndClose">
                        {{ $t('course.list.showResults') }}
                    </button>
                </div>
            </div>
        </BottomSheetDrawer>
</template>

<script>
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import CourseCard2 from "@/views/components/course/CourseCard2.vue";
import CourseCard2Loading from "@/views/components/course/CourseCard2Loading.vue";
import CourseListFilters from "@/views/components/course/CourseListFilters.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import InstallmentImageBadge from "@/views/components/payment/InstallmentImageBadge.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import axiosInstance from "@/store/axiosInstance";
import { useSEO } from "@/composables/useSEO";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Navigation } from "swiper/modules";
export default {
    components: {
        MasterPage,
        CourseCard2,
        CourseCard2Loading,
        CourseListFilters,
        PaginationComponent,
        BottomSheetDrawer,
        InstallmentImageBadge,
        SeoImage,
        Swiper,
        SwiperSlide,
    },
    data() {
        return {
            modules: [Navigation],
            direction: import.meta.client
                ? (localStorage.getItem("direction") || "rtl")
                : "rtl",
            loading: true,
            pathLoading: true,
            pagination: {},
            mounted: false,
            sidebarData: null,
            courses: [],
            paths: [],
            currentPage: this.$route.query.page ?? 1,
            filters: {
                type: [],
                order: 'newest',
                cat: [],
                status: [],
            },
            isFilterDrawerOpen: false,
            categoriesExpanded: false,
            categoryPreviewCount: 10,
        };
    },
    computed: {
        activeFilterCount() {
            const orderExtra = this.filters.order && this.filters.order !== 'newest' ? 1 : 0;
            return this.filters.type.length + this.filters.cat.length + this.filters.status.length + orderExtra;
        },
        activeFilterChips() {
            const typeLabels = {
                free: this.$t('course.list.free'),
                cash: this.$t('course.list.cashOnly'),
                'cash-vip': this.$t('course.list.cashAndVip'),
                installment: this.$t('course.list.installmentCourses'),
                discounted: this.$t('course.list.discountedCourses'),
            };
            const chips = this.filters.type.map((value) => ({
                group: 'type',
                value,
                label: typeLabels[value] || value,
            }));
            this.filters.status.forEach((value) => {
                chips.push({ group: 'status', value, label: value });
            });
            this.filters.cat.forEach((value) => {
                chips.push({ group: 'cat', value, label: value });
            });
            if (this.filters.order === 'oldest') {
                chips.push({ group: 'order', value: 'oldest', label: this.$t('course.list.oldest') });
            }
            return chips;
        },
    },
    methods: {
        clearFilters() {
            this.filters.type = [];
            this.filters.cat = [];
            this.filters.status = [];
            this.filters.order = 'newest';
            this.getCourses();
        },
        removeFilterChip(chip) {
            if (chip.group === 'order') {
                this.filters.order = 'newest';
            } else {
                this.filters[chip.group] = this.filters[chip.group].filter((item) => item !== chip.value);
            }
            this.getCourses();
        },
        applyFiltersAndClose() {
            this.isFilterDrawerOpen = false;
            this.$nextTick(() => {
                const el = document.getElementById('courses-list');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        },
        buildReadableQueryString() {
            const parts = [];

            this.filters.cat.forEach((category, index) => {
                parts.push(`cat[${index}]=${category}`);
            });

            let typeIndex = 0;
            this.filters.type.forEach((type) => {
                if (type === 'installment') {
                    parts.push('installment=yes');
                    return;
                }
                if (type === 'discounted') {
                    parts.push('discounted=yes');
                    return;
                }

                parts.push(`type[${typeIndex}]=${type}`);
                typeIndex += 1;
            });

            this.filters.status.forEach((status, index) => {
                parts.push(`status[${index}]=${status}`);
            });

            if (this.filters.order && this.filters.order !== 'newest') {
                parts.push(`order=${this.filters.order}`);
            }

            if (this.currentPage && Number(this.currentPage) !== 1) {
                parts.push(`page=${this.currentPage}`);
            }

            return parts.join('&');
        },
        syncBrowserUrl() {
            const query = this.buildReadableQueryString();
            const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
            // Preserve Vue Router history.state or named navigations stop working.
            window.history.pushState({ ...window.history.state }, '', newUrl);
        },
        getCourseApiParams() {
            const params = {
                page: this.currentPage,
                order: this.filters.order || 'newest',
            };

            if (this.filters.cat.length) {
                params.cat = this.filters.cat;
            }
            const selectedTypes = this.filters.type.filter((type) => type !== 'installment' && type !== 'discounted');

            if (selectedTypes.length) {
                params.type = selectedTypes;
            }
            if (this.filters.status.length) {
                params.status = this.filters.status;
            }
            if (this.filters.type.includes('installment')) {
                params.installment = 'yes';
            }
            if (this.filters.type.includes('discounted')) {
                params.discounted = 'yes';
            }

            return params;
        },
        createUrlWithParams(resetPage = true) {
            if (resetPage) {
                this.currentPage = 1;
            }
            this.syncBrowserUrl();
        },
        getPaths() {
            this.pathLoading = true;
            axiosInstance
                .get("/paths?limit=5&show_courses=true")
                .then((response) => {
                    this.paths = response.data.paths;
                })
                .catch((error) => {
                    console.error("An error occurred:", error);
                })
                .finally(() => {
                    this.pathLoading = false;
                });
        },
        async getCourses(resetPage = true) {
            this.loading = true;
            this.createUrlWithParams(resetPage);
            await axiosInstance
                .get('/courses', { params: this.getCourseApiParams() })
                .then((response) => {
                    this.courses = response.data.courses;
                    this.pagination = response.data.pagination;
                    const el = document.getElementById("courses-list");
                    if (this.mounted && el && !this.isFilterDrawerOpen) {
                        setTimeout(() => {
                            if (el) {
                                el.scrollIntoView({ behavior: "smooth" });
                            }
                        }, 150);
                    }
                })
                .catch((error) => {
                    console.error("An error occurred:", error);
                })
                .finally(() => {
                    this.loading = false;
                    this.mounted = true;
                });
        },
        updatePage(value) {
            this.currentPage = value;
            this.getCourses(false);
        },
        normalizeStatusFilters() {
            if (!this.sidebarData?.statuses?.length || !this.filters.status.length) {
                return false;
            }

            const normalized = this.filters.status.map((value) => {
                const match = this.sidebarData.statuses.find(
                    (status) =>
                        status.title === value
                        || status.slug === value
                        || status.english_title === value
                );
                return match ? match.title : value;
            });

            const changed = normalized.some((value, index) => value !== this.filters.status[index]);
            if (changed) {
                this.filters.status = normalized;
            }

            return changed;
        },
        sidebarDatafunc() {
            axiosInstance.get("/courses-page-filter").then((response) => {
                this.sidebarData = response.data;
                if (this.normalizeStatusFilters()) {
                    this.syncBrowserUrl();
                }
            });
        },
    },
    inject: {
        ssrCoursesBootstrap: { from: 'ssrCoursesBootstrap', default: null },
    },
    mounted() {
        useSEO({
            title: this.$t('course.list.seo.title'),
            description: this.$t('course.list.seo.description'),
            url: "/courses",
            keywords: this.$t('course.list.seo.keywords').split('|')
        });

        if (this.loading || this.pathLoading) {
            this.sidebarDatafunc();
            this.getPaths();
            this.getCourses(false);
        }
    },

    created() {
        const query = this.$route.query;
        this.filters.cat = Object.keys(query)
            .filter((key) => key.startsWith("cat["))
            .map((key) => query[key]);

        this.filters.type = Object.keys(query)
            .filter((key) => key.startsWith("type["))
            .map((key) => query[key]);

        if (query.installment === 'yes' && !this.filters.type.includes('installment')) {
            this.filters.type.push('installment');
        }

        const ssr = this.ssrCoursesBootstrap;
        const payload = ssr && typeof ssr === 'object' && 'value' in ssr ? ssr.value : ssr;
        const hasFilterQuery = Object.keys(query || {}).some((k) =>
            k.startsWith('cat[') || k.startsWith('type[') || k.startsWith('status[') || k === 'order' || k === 'page' || k === 'installment'
        );
        if (payload && !hasFilterQuery) {
            this.courses = payload.courses || [];
            this.pagination = payload.pagination || this.pagination;
            this.paths = payload.paths || [];
            this.sidebarData = payload.sidebarData || this.sidebarData;
            this.loading = false;
            this.pathLoading = false;
            this.mounted = true;
            this.normalizeStatusFilters();
        }

        if (query.discounted === 'yes' && !this.filters.type.includes('discounted')) {
            this.filters.type.push('discounted');
        }

        this.filters.status = Object.keys(query)
            .filter((key) => key.startsWith("status["))
            .map((key) => query[key]);

        const legacyStatusOrders = ['presale', 'upcoming', 'ongoing', 'completed'];
        if (query.order && legacyStatusOrders.includes(query.order)) {
            if (!this.filters.status.length) {
                this.filters.status = [query.order];
            }
            this.filters.order = 'newest';
        } else {
            this.filters.order = query.order || 'newest';
        }

        if (query.page) {
            this.currentPage = Number(query.page) || 1;
        }
    },
};
</script>

<style scoped>
.paths-nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
    background: #f1f5f9;
    color: #334155;
    transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.paths-nav-btn:hover {
    background: #fbbf24;
    color: #111827;
}

.paths-nav-btn.swiper-button-disabled {
    opacity: 0.35;
    pointer-events: none;
}

:global(.dark) .paths-nav-btn {
    background: #1f2937;
    color: #f3f4f6;
}

:global(.dark) .paths-nav-btn:hover {
    background: #fbbf24;
    color: #111827;
}

.paths-swiper {
    overflow: hidden;
    width: 100%;
}

.paths-swiper :deep(.swiper-slide) {
    height: auto;
    display: flex;
    min-width: 0;
}

.paths-swiper :deep(.swiper-slide > article) {
    width: 100%;
    min-width: 0;
}
</style>
