<template>
    <div>
        <!-- Header -->
        <div
            v-if="!initialLoading && total > 0"
            class="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-white dark:bg-gray-900 px-5 py-4">
            <div class="flex items-center gap-3 min-w-0">
                <span
                    class="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl text-white bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 shadow-lg shadow-pink-500/30 dark:shadow-pink-800/40">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V10C21 6.22876 21 4.34315 19.8284 3.17157C18.6569 2 16.7712 2 13 2H11C7.22876 2 5.34315 2 4.17157 3.17157ZM7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8ZM7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12ZM8 15.25C7.58579 15.25 7.25 15.5858 7.25 16C7.25 16.4142 7.58579 16.75 8 16.75H13C13.4142 16.75 13.75 16.4142 13.75 16C13.75 15.5858 13.4142 15.25 13 15.25H8Z" fill="currentColor"></path>
                    </svg>
                </span>
                <div class="min-w-0">
                    <h3 class="font-bold text-base text-gray-800 dark:text-white truncate">
                        {{ headerTitle }}
                    </h3>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {{ $t('profile.articles.count', { count: formatNumber(total) }) }}
                    </p>
                </div>
            </div>
            <span
                class="hidden sm:inline-flex items-center justify-center min-w-[2.25rem] h-9 px-3 rounded-xl text-sm font-bold text-pink-600 dark:text-pink-300 bg-pink-500/10 dark:bg-pink-500/15">
                {{ formatNumber(total) }}
            </span>
        </div>

        <!-- Loading (initial) -->
        <div v-if="initialLoading" class="grid sm:grid-cols-2 gap-4">
            <ArticleCardLoading v-for="i in 4" :key="i" />
        </div>

        <!-- Error -->
        <div
            v-else-if="error"
            class="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-gray-900 py-16 px-6 text-center">
            <span class="flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 mb-4">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8v5M12 16.5v.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
                </svg>
            </span>
            <p class="font-semibold text-gray-600 dark:text-gray-300 mb-4">{{ $t('profile.articles.error') }}</p>
            <button
                type="button"
                @click="reload"
                class="px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br shadow-lg shadow-pink-500/30 transition duration-200">
                {{ $t('profile.articles.retry') }}
            </button>
        </div>

        <!-- Articles -->
        <template v-else-if="articles.length">
            <div class="grid sm:grid-cols-2 gap-4">
                <ArticleCard v-for="item in articles" :key="item.id" :article="item" />
            </div>

            <!-- Load more -->
            <div v-if="hasMore" class="flex justify-center mt-6">
                <button
                    type="button"
                    @click="loadMore"
                    :disabled="loadingMore"
                    class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-gray-700 dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800 shadow-sm transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                    <svg v-if="loadingMore" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    {{ loadingMore ? $t('profile.articles.loading') : $t('profile.articles.loadMore') }}
                </button>
            </div>
        </template>

        <!-- Empty -->
        <div
            v-else
            class="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-gray-900 py-16 px-6 text-center">
            <span class="flex items-center justify-center w-20 h-20 rounded-2xl mb-5 text-pink-500 dark:text-pink-300 bg-pink-500/10 dark:bg-pink-500/15">
                <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V10C21 6.22876 21 4.34315 19.8284 3.17157C18.6569 2 16.7712 2 13 2H11C7.22876 2 5.34315 2 4.17157 3.17157ZM7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8ZM7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12ZM8 15.25C7.58579 15.25 7.25 15.5858 7.25 16C7.25 16.4142 7.58579 16.75 8 16.75H13C13.4142 16.75 13.75 16.4142 13.75 16C13.75 15.5858 13.4142 15.25 13 15.25H8Z" fill="currentColor" opacity="0.85"></path>
                </svg>
            </span>
            <p class="font-bold text-gray-700 dark:text-gray-200 mb-1">{{ $t('profile.articles.empty') }}</p>
            <p class="text-sm text-gray-400 dark:text-gray-500">{{ $t('profile.articles.emptyHint') }}</p>
        </div>
    </div>
</template>

<script>
import ArticleCard from "@/views/components/articles/ArticleCard.vue";
import ArticleCardLoading from "@/views/components/articles/ArticleCardLoading.vue";
import { articleService } from "@/services/article.service";

const PER_PAGE = 8;

export default {
    components: { ArticleCard, ArticleCardLoading },
    props: {
        username: String,
        authorName: { type: String, default: "" },
    },
    data() {
        return {
            articles: [],
            total: 0,
            currentPage: 1,
            lastPage: 1,
            initialLoading: true,
            loadingMore: false,
            error: false,
        };
    },
    computed: {
        hasMore() {
            return this.currentPage < this.lastPage;
        },
        headerTitle() {
            if (this.authorName) {
                return this.$t("profile.articles.titleNamed", { name: this.authorName });
            }
            return this.$t("profile.articles.title");
        },
    },
    watch: {
        username: { immediate: true, handler() { this.reload(); } },
    },
    methods: {
        formatNumber(n) {
            return new Intl.NumberFormat(this.$i18n.locale === "fa" ? "fa-IR" : "en-US").format(n || 0);
        },
        async reload() {
            if (!this.username) return;
            this.initialLoading = true;
            this.error = false;
            this.currentPage = 1;
            try {
                const res = await articleService.userArticles(this.username, { perPage: PER_PAGE, page: 1 });
                this.articles = res.data.articles || [];
                const pagination = res.data.pagination || {};
                this.total = pagination.total ?? this.articles.length;
                this.lastPage = pagination.last_page ?? 1;
                this.currentPage = pagination.current_page ?? 1;
            } catch (e) {
                this.error = true;
                this.articles = [];
                this.total = 0;
            } finally {
                this.initialLoading = false;
            }
        },
        async loadMore() {
            if (this.loadingMore || !this.hasMore) return;
            this.loadingMore = true;
            try {
                const nextPage = this.currentPage + 1;
                const res = await articleService.userArticles(this.username, { perPage: PER_PAGE, page: nextPage });
                const newItems = res.data.articles || [];
                this.articles = [...this.articles, ...newItems];
                const pagination = res.data.pagination || {};
                this.lastPage = pagination.last_page ?? this.lastPage;
                this.currentPage = pagination.current_page ?? nextPage;
            } finally {
                this.loadingMore = false;
            }
        },
    },
};
</script>
