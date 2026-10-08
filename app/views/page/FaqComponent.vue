<template>
    <MasterPage>
        <div class="relative overflow-hidden">
            <!-- Decorative background glow -->
            <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div class="absolute -top-40 start-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full bg-amber-300/25 dark:bg-amber-500/10 blur-3xl"></div>
                <div class="absolute top-1/2 -end-40 h-96 w-96 rounded-full bg-yellow-200/40 dark:bg-yellow-500/5 blur-3xl"></div>
            </div>

            <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <!-- Hero -->
                <div class="mx-auto max-w-2xl text-center pt-14 md:pt-20 pb-8">
                    <span class="inline-flex items-center gap-2 rounded-full border border-amber-300/60 dark:border-amber-500/30 bg-amber-100/70 dark:bg-amber-500/10 px-4 py-1.5 text-xs md:text-sm font-bold text-amber-700 dark:text-amber-300">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M9.5 9a2.5 2.5 0 1 1 3.2 2.4c-.6.2-1.2.7-1.2 1.4v.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="11.5" cy="16.5" r="1" fill="currentColor"/></svg>
                        {{ $t('faq.title1') }}
                    </span>
                    <h1 class="mt-6 text-2xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-3xl lg:text-4xl leading-tight">
                        {{ $t('faq.title1') }}
                        <span class="relative mx-1 inline-block">
                            <span class="relative z-10 text-amber-500">{{ $t('faq.title2') }}</span>
                            <span class="absolute inset-x-0 bottom-1 h-3 md:h-4 bg-amber-400/40 dark:bg-amber-400/25 rounded"></span>
                        </span>
                    </h1>
                    <p class="mx-auto mt-5 max-w-2xl text-sm md:text-base font-medium leading-7 md:leading-8 text-gray-500 dark:text-gray-400">{{ $t('faq.subtitle') }}</p>

                    <!-- Search -->
                    <div class="mx-auto mt-7 max-w-xl">
                        <div class="relative">
                            <span class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                            </span>
                            <input
                                v-model="searchQuery"
                                type="text"
                                :placeholder="$t('faq.searchPlaceholder')"
                                class="h-12 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ps-12 pe-11 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm outline-none transition-all duration-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                            />
                            <button
                                v-if="searchQuery"
                                type="button"
                                @click="searchQuery = ''"
                                class="absolute inset-y-0 end-0 flex items-center pe-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="mx-auto mb-20 max-w-screen-lg rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <div class="flex flex-col items-center justify-center gap-4 py-16">
                        <svg class="w-10 h-10 text-amber-500 animate-spin" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="25 25 50 50">
                            <circle class="stroke-current text-amber-500/25" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="200, 300"></circle>
                            <circle class="stroke-current text-amber-500" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="100, 200">
                                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                                <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
                                <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
                            </circle>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 text-sm font-semibold">{{ $t('faq.loading') }}</p>
                    </div>
                </div>

                <!-- Empty (no faq at all) -->
                <div v-else-if="faq.length === 0" class="mx-auto mb-20 max-w-screen-lg rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                    <div class="flex flex-col items-center justify-center gap-3 py-16 text-gray-500 dark:text-gray-400">
                        <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-500">
                            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        </span>
                        <p class="text-sm font-semibold">{{ $t('faq.empty') }}</p>
                    </div>
                </div>

                <!-- Content -->
                <div v-else class="mb-20">
                    <!-- Mobile category chips (hidden while searching) -->
                    <div v-if="!isSearching" class="lg:hidden -mx-4 px-4 mb-5">
                        <div class="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide pb-1">
                            <button
                                v-for="(group, idx) in faq"
                                :key="'chip-' + idx"
                                type="button"
                                @click="selectCategory(idx)"
                                :class="['inline-flex items-center gap-2 flex-shrink-0 rounded-xl py-2.5 px-4 text-sm font-bold leading-5 transition focus:outline-none border',
                                    selectedCategoryIndex === idx
                                        ? 'text-gray-900 bg-gradient-to-r from-amber-400 to-yellow-500 border-transparent shadow-md shadow-amber-500/30'
                                        : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800']"
                            >
                                <span v-html="categoryIcon(group)" class="flex items-center justify-center"></span>
                                {{ group.category }}
                            </button>
                        </div>
                    </div>

                    <div class="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-6 lg:items-start">
                        <!-- Desktop sidebar -->
                        <aside class="hidden lg:block">
                            <div class="sticky top-24 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-sm">
                                <p class="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">{{ $t('faq.categories') }}</p>
                                <div class="space-y-1">
                                    <button
                                        v-for="(group, idx) in faq"
                                        :key="'side-' + idx"
                                        type="button"
                                        @click="selectCategory(idx)"
                                        :class="['group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-bold transition focus:outline-none',
                                            (!isSearching && selectedCategoryIndex === idx)
                                                ? 'bg-gradient-to-r from-amber-400/15 to-yellow-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-400/30'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800']"
                                    >
                                        <span
                                            v-html="categoryIcon(group)"
                                            :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition',
                                                (!isSearching && selectedCategoryIndex === idx)
                                                    ? 'bg-amber-400 text-gray-900'
                                                    : 'bg-amber-400/10 text-amber-500 group-hover:bg-amber-400/20']"
                                        ></span>
                                        <span class="flex-1 min-w-0 truncate">{{ group.category }}</span>
                                        <span :class="['shrink-0 rounded-full px-2 py-0.5 text-xs font-bold',
                                            (!isSearching && selectedCategoryIndex === idx)
                                                ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400']">
                                            {{ group.questions.length }}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </aside>

                        <!-- Main: questions -->
                        <div class="min-w-0 font-anjoman">
                            <!-- Search results header -->
                            <div v-if="isSearching" class="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                {{ $t('faq.searchResults', { count: displayedQuestions.length, query: searchQuery.trim() }) }}
                            </div>
                            <!-- Selected category header (desktop context) -->
                            <div v-else-if="currentGroup" class="mb-4 hidden lg:flex items-center gap-3">
                                <span v-html="categoryIcon(currentGroup)" class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500"></span>
                                <div>
                                    <h2 class="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">{{ currentGroup.category }}</h2>
                                    <p class="text-xs text-gray-400 dark:text-gray-500">{{ $t('faq.questionsCount', { count: currentGroup.questions.length }) }}</p>
                                </div>
                            </div>

                            <!-- No search results -->
                            <div v-if="displayedQuestions.length === 0" class="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-14 text-center">
                                <span class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-500">
                                    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                </span>
                                <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">{{ $t('faq.noResults') }}</p>
                            </div>

                            <!-- Accordion list -->
                            <div v-else class="space-y-3">
                                <div
                                    v-for="item in displayedQuestions"
                                    :key="item.key"
                                    :id="item.order ? `faq-order-${item.order}` : undefined"
                                    class="overflow-hidden rounded-2xl border transition scroll-mt-28"
                                    :class="openKey === item.key ? 'border-amber-400/60 bg-white dark:bg-gray-900 shadow-md shadow-amber-500/5' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'"
                                >
                                    <button
                                        type="button"
                                        @click="toggle(item.key)"
                                        class="flex w-full items-center justify-between gap-3 p-4 md:p-5 text-start focus:outline-none"
                                    >
                                        <div class="flex items-center gap-3 min-w-0">
                                            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition"
                                                :class="openKey === item.key ? 'bg-amber-400 text-gray-900' : 'bg-amber-400/15 text-amber-500'">
                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M9.5 9a2.5 2.5 0 1 1 3.2 2.4c-.6.2-1.2.7-1.2 1.4v.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="11.5" cy="16.5" r="1" fill="currentColor"/></svg>
                                            </span>
                                            <div class="min-w-0">
                                                <p class="text-[15px] md:text-base font-extrabold leading-6" :class="openKey === item.key ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-100'">{{ item.question }}</p>
                                                <p v-if="isSearching" class="mt-0.5 text-[11px] font-semibold text-amber-500">{{ item.category }}</p>
                                            </div>
                                        </div>
                                        <svg class="w-5 h-5 ms-2 shrink-0 text-amber-500 transition-transform duration-300" :class="openKey === item.key && 'rotate-180'" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </button>
                                    <transition
                                        enter-active-class="transition duration-200 ease-out"
                                        enter-from-class="transform -translate-y-2 opacity-0"
                                        enter-to-class="transform translate-y-0 opacity-100"
                                        leave-active-class="transition duration-150 ease-in"
                                        leave-from-class="transform translate-y-0 opacity-100"
                                        leave-to-class="transform -translate-y-2 opacity-0"
                                    >
                                        <div v-show="openKey === item.key">
                                            <div class="mx-4 md:mx-5 mb-5 ps-10 md:ps-11 border-s-2 border-amber-400/30">
                                                <MarkdownRenderer startClass="faq-answer" :source="item.answer" />
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                            </div>

                            <!-- Still need help CTA -->
                            <div class="mt-6 overflow-hidden rounded-2xl border border-amber-200/70 dark:border-amber-500/20 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/5 p-5 md:p-6">
                                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div class="flex items-start gap-3">
                                        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-500">
                                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M12 2a9 9 0 0 0-9 9v4.5A2.5 2.5 0 0 0 5.5 18H7a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5.06A7 7 0 0 1 19 11h-1.9a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h.4a2 2 0 0 1-1.9 1.5h-1.35a1.5 1.5 0 1 0 0 2h1.35a4 4 0 0 0 3.9-3.13A2.5 2.5 0 0 0 21 15.5V11a9 9 0 0 0-9-9Z" fill="currentColor"/></svg>
                                        </span>
                                        <div>
                                            <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ $t('faq.help.title') }}</h3>
                                            <p class="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">{{ $t('faq.help.desc') }}</p>
                                        </div>
                                    </div>
                                    <router-link
                                        :to="{ name: 'contact' }"
                                        class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-sm font-bold text-gray-900 shadow-md shadow-amber-500/30 transition hover:shadow-lg active:scale-95"
                                    >
                                        {{ $t('faq.help.cta') }}
                                        <svg class="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MasterPage>
</template>
<script>
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import { useSEO, generateFAQSchema, generateBreadcrumbSchema } from "@/composables/useSEO";
import axiosInstance from "@/store/axiosInstance";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";

export default {
    inject: {
        ssrFaqs: { from: 'ssrFaqs', default: null },
    },
    components: {
        MasterPage,
        MarkdownRenderer,
    },
    data() {
        return {
            faq: [],
            loading: true,
            selectedCategoryIndex: 0,
            searchQuery: "",
            openKey: null,
            // Modern filled icons keyed by category slug. Overrides the icon that
            // comes from the backend so the FAQ tabs get a nicer, consistent look.
            categoryIcons: {
                "getting-started": '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.83 2.3a1 1 0 0 0-1.66 0L4.6 13.44A1 1 0 0 0 5.43 15H10l-1.3 6.35a1 1 0 0 0 1.78.79l7.92-11.58A1 1 0 0 0 17.57 9H13l1.6-6.03a1 1 0 0 0-.77-.67Z"/></svg>',
                "courses-and-learning": '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.7 2.84a1 1 0 0 1 .6 0l9 3a1 1 0 0 1 0 1.9l-9 3a1 1 0 0 1-.6 0L6 8.83v.01l-1.7-.57v4.48c.6.35 1 1 1 1.75a2 2 0 0 1-1 1.73l.9 2.44a.5.5 0 0 1-.47.67H3.27a.5.5 0 0 1-.47-.67l.9-2.44a2 2 0 0 1 .3-3.71V7.6L2.7 7.74a1 1 0 0 1 0-1.9l9-3Z"/><path d="M6.5 11.02 11.4 12.66a2 2 0 0 0 1.2 0l4.9-1.64v3.09c0 .8-.44 1.55-1.16 1.88-1.24.57-3.2 1.35-5.34 1.35s-4.1-.78-5.34-1.35A2.07 2.07 0 0 1 4.5 14.1v-3.09l2 .67Z"/></svg>',
                "payment-and-vip": '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.3 8.2a1 1 0 0 1 1.5-.55l3.02 1.9 3.35-4.9a1 1 0 0 1 1.66 0l3.35 4.9 3.02-1.9a1 1 0 0 1 1.5 1.06l-1.6 8.04a1 1 0 0 1-.98.8H5.88a1 1 0 0 1-.98-.8L3.3 8.2Z"/><path d="M5.5 19.5a1 1 0 0 1 1-1h11a1 1 0 1 1 0 2h-11a1 1 0 0 1-1-1Z"/></svg>',
                "learning-paths": '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2a3 3 0 0 0-1 5.83V16a3 3 0 0 0 3 3h4a1 1 0 0 1 0 2h-1a1 1 0 1 0 0 0h1a3 3 0 0 0 0-6H9a1 1 0 0 1-1-1V7.83A3 3 0 0 0 7 2Zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/><path d="M17 9a3 3 0 0 0-1 5.83V16a1 1 0 1 0 2 0v-1.17A3 3 0 0 0 17 9Zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>',
                "support-and-help": '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9 9 0 0 0-9 9v4.5A2.5 2.5 0 0 0 5.5 18H7a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5.06A7 7 0 0 1 19 11h-1.9a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h.4a2 2 0 0 1-1.9 1.5h-1.35a1.5 1.5 0 1 0 0 2h1.35a4 4 0 0 0 3.9-3.13A2.5 2.5 0 0 0 21 15.5V11a9 9 0 0 0-9-9Z"/></svg>',
                "programming-and-technology": '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4Zm5.7 6.3a1 1 0 0 1 0 1.4L8.42 12l1.3 1.3a1 1 0 1 1-1.42 1.4l-2-2a1 1 0 0 1 0-1.4l2-2a1 1 0 0 1 1.42 0Zm4.6 0a1 1 0 0 1 1.4 0l2 2a1 1 0 0 1 0 1.4l-2 2a1 1 0 0 1-1.4-1.4l1.28-1.3-1.29-1.3a1 1 0 0 1 0-1.4Z"/></svg>',
                "messenger": '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>',
            },
        };
    },
    computed: {
        currentGroup() {
            return this.faq[this.selectedCategoryIndex] || null;
        },
        isSearching() {
            return this.searchQuery.trim().length > 0;
        },
        displayedQuestions() {
            if (this.isSearching) {
                const q = this.searchQuery.trim().toLowerCase();
                const results = [];
                this.faq.forEach((group, gIdx) => {
                    (group.questions || []).forEach((question, qIdx) => {
                        const inQuestion = (question.question || "").toLowerCase().includes(q);
                        const inAnswer = (question.answer || "").toLowerCase().includes(q);
                        if (inQuestion || inAnswer) {
                            results.push({
                                ...question,
                                category: group.category,
                                key: `s-${gIdx}-${qIdx}`,
                            });
                        }
                    });
                });
                return results;
            }
            if (!this.currentGroup) return [];
            return (this.currentGroup.questions || []).map((question, qIdx) => ({
                ...question,
                category: this.currentGroup.category,
                key: `c-${this.selectedCategoryIndex}-${qIdx}`,
            }));
        },
    },
    methods: {
        categoryIcon(group) {
            if (group && group.slug && this.categoryIcons[group.slug]) {
                return this.categoryIcons[group.slug];
            }
            return group ? group.icon : "";
        },
        toggle(key) {
            this.openKey = this.openKey === key ? null : key;
        },
        selectCategory(index) {
            this.selectedCategoryIndex = index;
            this.searchQuery = "";
            this.openKey = null;
            this.updateUrl({ category: this.faq[index]?.slug || null });
        },
        openQuestionByCategoryAndOrder(categorySlug, order, shouldUpdateUrl = true) {
            if (!categorySlug || order == null) return false;

            const gIdx = this.faq.findIndex((cat) => cat.slug === categorySlug);
            if (gIdx === -1) return false;

            const qIdx = (this.faq[gIdx].questions || []).findIndex(
                (q) => Number(q.order) === Number(order)
            );
            if (qIdx === -1) return false;

            this.selectedCategoryIndex = gIdx;
            this.searchQuery = "";
            this.openKey = `c-${gIdx}-${qIdx}`;

            this.$nextTick(() => {
                const el = document.getElementById(`faq-order-${order}`);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });

            if (shouldUpdateUrl) {
                this.updateUrl({ category: categorySlug, order: String(order) });
            }
            return true;
        },
        async fetchFaqs() {
            this.loading = true;
            try {
                const response = await axiosInstance.get("/faqs");
                if (response.data && response.data.faqs) {
                    this.faq = response.data.faqs;
                    this.initializeFromUrl();
                    this.applyFaqSeo();
                }
            } catch (error) {
                console.error("Error fetching FAQs:", error);
                this.faq = [];
            } finally {
                this.loading = false;
            }
        },
        applyFaqSeo() {
            const items = [];
            (this.faq || []).forEach((group) => {
                (group.questions || []).forEach((q) => {
                    items.push({
                        question: q.question || q.title,
                        answer: q.answer || q.body,
                    });
                });
            });
            const faqSchema = generateFAQSchema(items.slice(0, 50));
            const breadcrumb = generateBreadcrumbSchema([
                { name: "خانه", url: "/" },
                { name: this.$t("faq.seo.title"), url: "/faq" },
            ]);
            useSEO({
                title: this.$t("faq.seo.title"),
                description: this.$t("faq.seo.description"),
                url: "/faq",
                keywords: ["سوالات متداول", "FAQ", "راهنما", "پاسخ سوالات", "زنبورک", "سوالات پر تکرار"],
                schema: [faqSchema, breadcrumb].filter(Boolean),
            });
        },
        initializeFromUrl() {
            const query = this.$route.query;
            if (query.category) {
                const categoryIndex = this.faq.findIndex((cat) => cat.slug === query.category);
                if (categoryIndex !== -1) {
                    this.selectedCategoryIndex = categoryIndex;
                }
            }
            if (query.category && query.order) {
                this.openQuestionByCategoryAndOrder(query.category, query.order, false);
            }
        },
        updateUrl({ category = null, order = null } = {}) {
            const query = {};
            if (category) {
                query.category = category;
            } else if (this.faq[this.selectedCategoryIndex]?.slug) {
                query.category = this.faq[this.selectedCategoryIndex].slug;
            }
            if (order != null) {
                query.order = String(order);
            }
            const queryString = Object.keys(query)
                .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
                .join("&");
            const newUrl = queryString ? `${this.$route.path}?${queryString}` : this.$route.path;
            window.history.replaceState({ ...window.history.state }, "", newUrl);
        },
    },
    watch: {
        "$route.query"(newQuery, oldQuery) {
            if (
                (newQuery.category !== oldQuery?.category || newQuery.order !== oldQuery?.order)
                && newQuery.category
                && newQuery.order
            ) {
                this.openQuestionByCategoryAndOrder(newQuery.category, newQuery.order, false);
                return;
            }
            if (newQuery.category !== oldQuery?.category && newQuery.category) {
                const categoryIndex = this.faq.findIndex((cat) => cat.slug === newQuery.category);
                if (categoryIndex !== -1 && categoryIndex !== this.selectedCategoryIndex) {
                    this.selectedCategoryIndex = categoryIndex;
                    this.openKey = null;
                }
            }
        },
    },
    created() {
        const ssr = this.ssrFaqs;
        const payload = ssr && typeof ssr === 'object' && 'value' in ssr ? ssr.value : ssr;
        if (Array.isArray(payload) && payload.length) {
            this.faq = payload;
            this.loading = false;
            this.initializeFromUrl();
            this.applyFaqSeo();
        }
    },
    mounted() {
        if (!this.faq?.length) {
            this.fetchFaqs();
        }
    },
};
</script>

<style>
/* FAQ answer: lighter, smaller and more muted than the bold question,
   overriding the default .zan-md-content typography. */
.faq-answer.zan-md-content {
    font-size: 0.8125rem;
    line-height: 1.75rem;
    font-weight: 400;
    color: #6b7280;
}

.dark .faq-answer.zan-md-content {
    color: #9ca3af;
}

@media (min-width: 768px) {
    .faq-answer.zan-md-content {
        font-size: 0.875rem;
    }
}

.faq-answer.zan-md-content p {
    margin-top: 0.35rem;
    margin-bottom: 0.35rem;
    font-weight: 400;
}

.faq-answer.zan-md-content li {
    font-weight: 400;
}
</style>
