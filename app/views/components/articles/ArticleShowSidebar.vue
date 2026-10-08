<template>
    <button
        type="button"
        class="order-1 lg:hidden col-span-12 flex items-center justify-center mx-auto w-full sm:w-auto text-gray-800 dark:text-gray-800 bg-amber-400 hover:bg-amber-500/80 focus:ring-2 focus:ring-amber-300 rounded-lg px-5 py-2.5 mb-2 dark:bg-amber-400 dark:hover:bg-amber-400/70 focus:outline-none dark:focus:ring-amber-600 text-sm font-semibold transition"
        @click="sheetOpen = true">
        {{ $t('articles.show.readingTools') }}
        <svg class="w-5 h-5 ms-2 shrink-0" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path opacity="0.4" d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </button>

    <aside class="order-3 lg:order-2 hidden lg:block lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
        <ArticleShowSidebarPanel
            :author="author"
            :related="related"
            :related-courses="relatedCourses"
            :related-questions="relatedQuestions"
            :toc-items="tocItems"
            :is-loggedin="isLoggedin"
            :current-user-id="currentUserId"
            :follow-loading="followLoading"
            @toggle-follow="$emit('toggle-follow')"
            @navigate-toc="$emit('navigate-toc', $event)" />
    </aside>

    <BottomSheetDrawer
        v-model="sheetOpen"
        :fit-content="false"
        :initial-height="0.82"
        :min-height="0.45"
        :max-height="0.92"
        :header-height="72"
        :auto-close-on-min="true"
        :lock-scroll="true"
        :panel-class="'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-t-2xl'"
        :content-class="'px-3 pb-6 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar'">
        <ArticleShowSidebarPanel
            in-sheet
            :author="author"
            :related="related"
            :related-courses="relatedCourses"
            :related-questions="relatedQuestions"
            :toc-items="tocItems"
            :is-loggedin="isLoggedin"
            :current-user-id="currentUserId"
            :follow-loading="followLoading"
            @toggle-follow="onToggleFollow"
            @navigate-toc="onNavigateToc" />
    </BottomSheetDrawer>
</template>

<script>
import ArticleShowSidebarPanel from "@/views/components/articles/ArticleShowSidebarPanel.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";

export default {
    components: { ArticleShowSidebarPanel, BottomSheetDrawer },
    props: {
        author: { type: Object, default: null },
        related: { type: Array, default: () => [] },
        relatedCourses: { type: Array, default: () => [] },
        relatedQuestions: { type: Array, default: () => [] },
        tocItems: { type: Array, default: () => [] },
        isLoggedin: { type: Boolean, default: false },
        currentUserId: { type: [Number, String], default: null },
        followLoading: { type: Boolean, default: false },
    },
    emits: ["toggle-follow", "navigate-toc"],
    data() {
        return { sheetOpen: false };
    },
    methods: {
        onToggleFollow() {
            this.$emit("toggle-follow");
        },
        onNavigateToc(id) {
            this.$emit("navigate-toc", id);
            this.sheetOpen = false;
        },
    },
};
</script>
