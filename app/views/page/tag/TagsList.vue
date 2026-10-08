<template>
    <MasterPage>
        <div class="mx-auto max-w-screen-xl px-2 pb-16">
            <!-- Hero -->
            <section class="relative my-5 md:my-7 rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1e2a3f]">
                <div class="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-[#0f1524] dark:via-[#151c2c] dark:to-[#1a1220]"></div>
                <div class="absolute -top-20 -start-20 w-56 h-56 rounded-full bg-amber-400/20 dark:bg-amber-400/10 blur-3xl"></div>
                <div class="absolute -bottom-12 -end-12 w-48 h-48 rounded-full bg-orange-400/15 dark:bg-rose-500/10 blur-3xl"></div>

                <div class="relative grid lg:grid-cols-12 gap-5 px-4 py-6 md:px-8 md:py-8 items-center">
                    <div class="lg:col-span-7 flex flex-col justify-center text-center lg:text-start">
                        <span class="inline-flex w-fit mx-auto lg:mx-0 items-center gap-1.5 rounded-full bg-amber-400/15 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 px-3 py-1 text-[11px] font-bold mb-3 ring-1 ring-amber-400/20">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.049 3.062A3.5 3.5 0 0 1 10.5 0h3A3.5 3.5 0 0 1 17 3.062l.19.95a2 2 0 0 0 1.632 1.588l.958.192A3.5 3.5 0 0 1 22.938 9.05l-.95.19a2 2 0 0 0-1.588 1.632l-.192.958A3.5 3.5 0 0 1 17 15.938l-.95-.19a2 2 0 0 0-1.632 1.588l-.192.958A3.5 3.5 0 0 1 10.5 24h-3A3.5 3.5 0 0 1 4.062 20.95l-.19-.958a2 2 0 0 0-1.632-1.588l-.958-.192A3.5 3.5 0 0 1 1.062 14.95l.95-.19a2 2 0 0 0 1.588-1.632l.192-.958A3.5 3.5 0 0 1 6.05 7.012l.958.19a2 2 0 0 0 1.632-1.588l.19-.958A3.5 3.5 0 0 1 10.5 3h3c.34 0 .672.049.988.141z" fill="currentColor"/>
                            </svg>
                            {{ $t('tags.heroBadge') }}
                        </span>

                        <h1 class="text-2xl md:text-3xl xl:text-4xl font-extrabold tracking-tight text-gray-800 dark:text-white mb-2">
                            {{ $t('tags.listTitle') }}
                        </h1>

                        <div class="flex justify-center lg:justify-start mb-3">
                            <span class="inline-block w-20 h-0.5 bg-amber-400 rounded-full"></span>
                            <span class="inline-block w-2 h-0.5 mx-1 bg-amber-400 rounded-full"></span>
                            <span class="inline-block w-1 h-0.5 bg-amber-400 rounded-full"></span>
                        </div>

                        <p class="text-sm md:text-base font-light text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-4">
                            {{ $t('tags.heroDescription') }}
                        </p>

                        <div class="flex flex-wrap items-center gap-2.5 justify-center lg:justify-start">
                            <a
                                href="#tags-list"
                                class="h-9 px-5 rounded-xl flex items-center justify-center text-sm font-bold text-gray-900 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/20 transition">
                                {{ $t('tags.browseTags') }}
                            </a>
                            <router-link
                                :to="{ name: 'discuss-index' }"
                                class="h-9 px-5 rounded-xl flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-[#1e2a3f] border border-gray-200 dark:border-[#2a3850] hover:border-amber-400/50 transition">
                                {{ $t('tags.goToDiscuss') }}
                            </router-link>
                        </div>
                    </div>

                    <div class="lg:col-span-5 flex items-center justify-center">
                        <div class="relative w-full max-w-sm h-36 md:h-40">
                            <div class="absolute inset-0 rounded-2xl bg-white/60 dark:bg-[#1e2a3f]/60 backdrop-blur-sm border border-gray-100 dark:border-[#2a3850]"></div>
                            <div class="relative px-4 py-3 flex flex-wrap content-center justify-center gap-2 h-full">
                                <span
                                    v-for="(pill, i) in heroPills"
                                    :key="pill"
                                    class="px-2.5 py-1 rounded-full text-[11px] md:text-xs font-bold"
                                    :class="pillClasses[i % pillClasses.length]">
                                    # {{ pill }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Filters + List -->
            <section id="tags-list">
                <div class="rounded-2xl bg-[#f8fafc] dark:bg-[#121a28] border border-gray-100 dark:border-[#1e2a3f] p-3 md:p-4 mb-5">
                    <div class="flex flex-col md:flex-row md:items-center gap-3">
                        <!-- Scope toggle (logged in only) -->
                        <div
                            v-if="isLoggedin"
                            class="flex items-center justify-center md:justify-start gap-3 shrink-0 px-1">
                            <span
                                class="text-sm font-semibold transition"
                                :class="tagScope === 'all' ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'">
                                {{ $t('tags.filterAll') }}
                            </span>
                            <button
                                type="button"
                                role="switch"
                                :aria-checked="tagScope === 'followed'"
                                @click="toggleScope"
                                class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-[#121a28]"
                                :class="tagScope === 'followed' ? 'bg-amber-400' : 'bg-gray-300 dark:bg-gray-600'">
                                <span
                                    class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200"
                                    :class="tagScope === 'followed' ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'"></span>
                            </button>
                            <span
                                class="text-sm font-semibold transition"
                                :class="tagScope === 'followed' ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'">
                                {{ $t('tags.myTags') }}
                            </span>
                        </div>

                        <!-- Search -->
                        <div class="relative flex-1 min-w-0">
                            <svg
                                class="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
                                <path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>

                            <input
                                ref="searchInput"
                                v-model="search"
                                @input="onSearchInput"
                                @keydown.esc="clearSearch"
                                type="text"
                                role="searchbox"
                                :placeholder="$t('tags.searchPlaceholderLong')"
                                autocomplete="off"
                                autocorrect="off"
                                spellcheck="false"
                                class="tag-page-search-input w-full h-11 rounded-lg border border-gray-200 dark:border-[#2a3850] bg-white dark:bg-[#1a2332] ps-10 pe-10 text-sm font-semibold text-gray-600 dark:text-gray-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition" />

                            <div class="absolute end-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                <svg
                                    v-if="searchLoading"
                                    class="w-5 h-5 text-amber-400 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                                <button
                                    v-if="search.trim()"
                                    type="button"
                                    @click="clearSearch"
                                    class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#243044] transition"
                                    :aria-label="$t('tags.searchClear')">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Sort + content filters -->
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 mt-3 pt-3 border-t border-gray-200/80 dark:border-[#243044]">
                        <div class="flex flex-wrap items-center gap-1.5">
                            <button
                                v-for="option in sortOptions"
                                :key="option.value"
                                type="button"
                                @click="setSort(option.value)"
                                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                                :class="sort === option.value
                                    ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25'
                                    : 'bg-white dark:bg-[#1a2332] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3850] hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400'">
                                {{ option.label }}
                            </button>
                        </div>

                        <div class="flex flex-wrap items-center gap-1.5 sm:ms-auto">
                            <button
                                v-for="option in contentFilterOptions"
                                :key="option.value"
                                type="button"
                                @click="setContentFilter(option.value)"
                                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                                :class="contentFilter === option.value
                                    ? 'bg-white dark:bg-[#243044] text-amber-600 dark:text-amber-400 ring-1 ring-amber-400/50'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'">
                                {{ option.label }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Skeleton (initial) -->
                <div v-if="loading && tags.length === 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div
                        v-for="n in 9"
                        :key="n"
                        class="h-36 rounded-2xl bg-white dark:bg-[#151c2c] border border-gray-100 dark:border-[#1e2a3f] animate-pulse">
                        <div class="p-5 space-y-4">
                            <div class="h-5 w-2/5 bg-gray-100 dark:bg-[#243044] rounded-lg"></div>
                            <div class="h-3 w-3/5 bg-gray-100 dark:bg-[#243044] rounded-lg ms-auto"></div>
                            <div class="border-t border-gray-100 dark:border-[#243044] pt-4 flex justify-between">
                                <div class="h-3 w-1/4 bg-gray-100 dark:bg-[#243044] rounded-lg"></div>
                                <div class="h-8 w-24 bg-gray-100 dark:bg-[#243044] rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tags grid with refetch overlay -->
                <div v-else class="relative min-h-[12rem]">
                    <div
                        v-if="loading && tags.length > 0"
                        class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 dark:bg-[#121a28]/75 backdrop-blur-[2px] border border-gray-100/80 dark:border-[#1e2a3f]/80">
                        <svg class="w-9 h-9 text-amber-400 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">{{ $t('tags.loading') }}</span>
                    </div>

                    <div
                        v-if="tags.length > 0"
                        ref="listContainer"
                        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity duration-200"
                        :class="loading ? 'opacity-40 pointer-events-none' : ''">
                        <TagCard v-for="tag in tags" :key="tag.id" :tag="tag" />
                    </div>

                    <!-- Empty -->
                    <div v-else-if="!loading" class="py-20 text-center rounded-2xl bg-white dark:bg-[#151c2c] border border-gray-100 dark:border-[#1e2a3f]">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-[#1e2a3f] flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none">
                            <path d="M7.049 3.062A3.5 3.5 0 0 1 10.5 0h3A3.5 3.5 0 0 1 17 3.062l.19.95a2 2 0 0 0 1.632 1.588l.958.192A3.5 3.5 0 0 1 22.938 9.05l-.95.19a2 2 0 0 0-1.588 1.632l-.192.958A3.5 3.5 0 0 1 17 15.938l-.95-.19a2 2 0 0 0-1.632 1.588l-.192.958A3.5 3.5 0 0 1 10.5 24h-3A3.5 3.5 0 0 1 4.062 20.95l-.19-.958a2 2 0 0 0-1.632-1.588l-.958-.192A3.5 3.5 0 0 1 1.062 14.95l.95-.19a2 2 0 0 0 1.588-1.632l.192-.958A3.5 3.5 0 0 1 6.05 7.012l.958.19a2 2 0 0 0 1.632-1.588l.19-.958A3.5 3.5 0 0 1 10.5 3h3c.34 0 .672.049.988.141z" fill="currentColor"/>
                        </svg>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 font-bold mb-1">{{ emptyTitle }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ emptyHint }}</p>
                    <button
                        v-if="search.trim() || tagScope === 'followed'"
                        type="button"
                        @click="resetFilters"
                        class="mt-5 h-10 px-5 rounded-xl text-sm font-semibold text-amber-600 dark:text-amber-400 border border-amber-400/50 hover:bg-amber-400/10 transition">
                        {{ $t('tags.resetFilters') }}
                    </button>
                    </div>
                </div>

                <div ref="listEnd" class="h-1"></div>

                <div v-if="loadingMore" class="py-8 flex justify-center">
                    <svg class="w-8 h-8 text-amber-400 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                </div>
            </section>
        </div>
    </MasterPage>
</template>

<script>
import MasterPage from "@/views/page/discuss/layouts/MasterPage.vue";
import TagCard from "@/views/components/tag/TagCard.vue";
import { tagService } from "@/services/tag.service";
import { useSEO, generateBreadcrumbSchema } from "@/composables/useSEO";

export default {
    inject: {
        ssrTagsBootstrap: { from: 'ssrTagsBootstrap', default: null },
    },
    components: { MasterPage, TagCard },
    data() {
        return {
            tags: [],
            loading: false,
            loadingMore: false,
            searchLoading: false,
            search: "",
            sort: "popular",
            contentFilter: "all",
            tagScope: "all",
            searchTimer: null,
            currentPage: 1,
            lastPage: 1,
            hasReachedEnd: false,
            reachedEnd: false,
            heroPills: ["لاراول", "Vue", "PHP", "JavaScript", "طراحی-وب", "React", "CSS", "API"],
            pillClasses: [
                "bg-amber-400/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30",
                "bg-blue-400/15 text-blue-700 dark:text-blue-300 ring-1 ring-blue-400/25",
                "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400/25",
                "bg-violet-400/15 text-violet-700 dark:text-violet-300 ring-1 ring-violet-400/25",
                "bg-rose-400/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-400/25",
            ],
        };
    },
    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        sortOptions() {
            return [
                { value: "popular", label: this.$t("tags.sortPopular") },
                { value: "followers", label: this.$t("tags.sortFollowers") },
                { value: "name", label: this.$t("tags.sortName") },
            ];
        },
        contentFilterOptions() {
            return [
                { value: "all", label: this.$t("tags.filterAll") },
                { value: "with_questions", label: this.$t("tags.filterWithQuestions") },
                { value: "with_courses", label: this.$t("tags.filterWithCourses") },
                { value: "with_articles", label: this.$t("tags.filterWithArticles") },
            ];
        },
        emptyTitle() {
            if (this.tagScope === "followed") {
                return this.$t("tags.emptyFollowed");
            }
            if (this.search.trim()) {
                return this.$t("tags.emptySearch");
            }
            return this.$t("tags.empty");
        },
        emptyHint() {
            if (this.tagScope === "followed") {
                return this.$t("tags.emptyFollowedHint");
            }
            if (this.search.trim()) {
                return this.$t("tags.emptySearchHint");
            }
            return this.$t("tags.emptyHint");
        },
    },
    methods: {
        applySeo() {
            const breadcrumb = generateBreadcrumbSchema([
                { name: "خانه", url: "/" },
                { name: this.$t("tags.listTitle"), url: "/tags" },
            ]);
            useSEO({
                title: this.$t("tags.seo.title"),
                description: this.$t("tags.seo.description"),
                url: "/tags",
                keywords: this.$t("tags.seo.keywords").split("|"),
                schema: [breadcrumb].filter(Boolean),
            });
        },
        onSearchInput() {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => this.resetAndFetch(), 350);
        },
        clearSearch() {
            this.search = "";
            this.resetAndFetch();
        },
        toggleScope() {
            this.tagScope = this.tagScope === "all" ? "followed" : "all";
            this.resetAndFetch();
        },
        setSort(value) {
            if (this.sort === value) return;
            this.sort = value;
            this.resetAndFetch();
        },
        setContentFilter(value) {
            if (this.contentFilter === value) return;
            this.contentFilter = value;
            if (this.tagScope === "followed") {
                this.tagScope = "all";
            }
            this.resetAndFetch();
        },
        resetFilters() {
            this.search = "";
            this.sort = "popular";
            this.contentFilter = "all";
            this.tagScope = "all";
            this.resetAndFetch();
        },
        resetAndFetch() {
            this.currentPage = 1;
            this.lastPage = 1;
            this.hasReachedEnd = false;
            this.reachedEnd = false;
            this.fetchTags(false);
        },
        async fetchTags(loadMore = false) {
            if (this.loading || this.loadingMore) return;
            if (loadMore && this.currentPage > this.lastPage) {
                this.reachedEnd = true;
                return;
            }

            if (loadMore) {
                this.loadingMore = true;
            } else {
                this.loading = true;
                this.searchLoading = !!this.search.trim();
            }

            try {
                const filter = this.tagScope === "followed"
                    ? "followed"
                    : this.contentFilter !== "all"
                        ? this.contentFilter
                        : undefined;

                const response = await tagService.list({
                    page: this.currentPage,
                    search: this.search.trim() || undefined,
                    sort: this.sort,
                    filter,
                    perPage: 12,
                });

                if (loadMore) {
                    this.tags.push(...response.data.tags);
                } else {
                    this.tags = response.data.tags;
                }

                this.currentPage = response.data.pagination.current_page + 1;
                this.lastPage = response.data.pagination.last_page;
                this.reachedEnd = response.data.pagination.current_page >= response.data.pagination.last_page;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
                this.loadingMore = false;
                this.searchLoading = false;
            }
        },
        handleScroll() {
            const el = this.$refs.listEnd;
            if (!el || this.loading || this.loadingMore || this.reachedEnd) return;

            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight + 120 && !this.hasReachedEnd) {
                this.fetchTags(true);
                this.hasReachedEnd = true;
            }
            if (rect.top > window.innerHeight + 200) {
                this.hasReachedEnd = false;
            }
        },
    },
    created() {
        // Prefer useNuxtData (same-request SSR cache). inject/provide also works for this child.
        const fromNuxt = useNuxtData('tags-bootstrap').data.value;
        const ssr = fromNuxt ?? this.ssrTagsBootstrap;
        const payload = ssr && typeof ssr === 'object' && 'value' in ssr ? ssr.value : ssr;
        const querySort = this.$route.query.sort;
        const hasCustomSort = querySort && String(querySort) !== 'popular';
        this.applySeo();
        if (!payload || hasCustomSort) return;
        if (Array.isArray(payload.tags) && payload.tags.length) {
            this.tags = payload.tags;
            this.currentPage = (payload.pagination?.current_page || 1) + 1;
            this.lastPage = payload.pagination?.last_page || 1;
            this.reachedEnd = (payload.pagination?.current_page || 1) >= (payload.pagination?.last_page || 1);
            this.loading = false;
        }
    },
    mounted() {
        const querySort = this.$route.query.sort;
        if (querySort && ["popular", "followers", "name"].includes(String(querySort))) {
            this.sort = String(querySort);
        }
        if (!this.tags?.length) {
            this.fetchTags(false);
        }
        window.addEventListener("scroll", this.handleScroll);
    },
    beforeUnmount() {
        clearTimeout(this.searchTimer);
        window.removeEventListener("scroll", this.handleScroll);
    },
};
</script>

<style scoped>
.tag-page-search-input:focus {
    outline: none;
    border-color: rgb(251 191 36 / 0.5);
    box-shadow: 0 0 0 2px rgb(251 191 36 / 0.25);
}
</style>
