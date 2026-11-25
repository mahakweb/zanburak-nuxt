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

    <aside class="article-sidebar-col order-3 lg:order-2 hidden lg:block lg:col-span-3">
        <div
            ref="sidebarPanel"
            class="article-sidebar-panel space-y-4"
            :class="sidebarPinned ? 'is-pinned bg-white dark:bg-gray-900 shadow-xl' : ''">
            <ArticleShowSidebarPanel
                :author="author"
                :related="related"
                :related-courses="relatedCourses"
                :related-questions="relatedQuestions"
                :toc-items="tocItems"
                :active-heading-id="activeHeadingId"
                :is-loggedin="isLoggedin"
                :current-user-id="currentUserId"
                :follow-loading="followLoading"
                @toggle-follow="$emit('toggle-follow')"
                @navigate-toc="$emit('navigate-toc', $event)" />
        </div>
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
            :active-heading-id="activeHeadingId"
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
        activeHeadingId: { type: String, default: "" },
        isLoggedin: { type: Boolean, default: false },
        currentUserId: { type: [Number, String], default: null },
        followLoading: { type: Boolean, default: false },
    },
    emits: ["toggle-follow", "navigate-toc"],
    data() {
        return {
            sheetOpen: false,
            sidebarPinned: false,
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.updateSidebarPin();
        });
        window.addEventListener("scroll", this.onWindowScroll, { passive: true });
        window.addEventListener("resize", this.onWindowResize, { passive: true });
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.onWindowScroll);
        window.removeEventListener("resize", this.onWindowResize);
    },
    methods: {
        onToggleFollow() {
            this.$emit("toggle-follow");
        },
        onNavigateToc(id) {
            this.$emit("navigate-toc", id);
            this.sheetOpen = false;
        },
        clearSidebarPinStyles(panel) {
            this.sidebarPinned = false;
            if (!panel) return;
            panel.style.height = '';
            panel.style.maxHeight = '';
            panel.style.minHeight = '';
            panel.style.width = '';
            panel.style.left = '';
            panel.style.right = '';
            panel.style.top = '';
        },
        updateSidebarPin() {
            const panel = this.$refs.sidebarPanel;
            if (!import.meta.client || window.innerWidth < 1024) {
                this.clearSidebarPinStyles(panel);
                return;
            }
            if (!panel) return;
            const host = panel.parentElement;
            const content = document.querySelector('article') || document.querySelector('.article-content');
            if (!host) {
                this.clearSidebarPinStyles(panel);
                return;
            }

            const hostRect = host.getBoundingClientRect();
            const contentTop = content ? content.getBoundingClientRect().top : hostRect.top;
            const footer = document.querySelector('footer');
            const footerTop = footer
                ? footer.getBoundingClientRect().top - 8
                : Number.POSITIVE_INFINITY;

            if (!this.sidebarPinned && contentTop <= 8) {
                this.sidebarPinned = true;
            } else if (this.sidebarPinned && contentTop > 72) {
                this.sidebarPinned = false;
            }

            const usedTop = this.sidebarPinned ? 0 : Math.max(hostRect.top, 12);
            const viewportAvailable = Math.max(0, Math.min(footerTop, window.innerHeight) - usedTop);

            if (viewportAvailable > 0) {
                panel.style.maxHeight = Math.round(viewportAvailable) + 'px';
                if (this.sidebarPinned) {
                    panel.style.height = Math.round(viewportAvailable) + 'px';
                } else {
                    panel.style.height = '';
                }
            }
            panel.style.minHeight = '0px';
            panel.style.width = '';
            panel.style.left = '';
            panel.style.right = '';
            panel.style.top = '';
        },
        onWindowScroll() {
            this.updateSidebarPin();
        },
        onWindowResize() {
            this.updateSidebarPin();
        },
    },
};
</script>

<style scoped>
@media (min-width: 1024px) {
    .article-sidebar-col {
        min-height: 100%;
        overflow-anchor: none;
    }

    .article-sidebar-panel {
        max-height: calc(100vh - 1.5rem);
        position: sticky;
        top: 0.75rem;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: auto;
        border-radius: 1.5rem;
        overflow-anchor: none;
        scrollbar-width: none;
        -ms-overflow-style: none;
        transition:
            top 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            padding 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            border-radius 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.35s ease;
    }

    .article-sidebar-panel::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
    }

    .article-sidebar-panel.is-pinned {
        max-height: 100vh;
        top: 0;
        padding: 1rem 0.7rem;
        border-radius: 0;
        animation: article-sidebar-dock 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .article-sidebar-panel.is-pinned::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
    }
}

@keyframes article-sidebar-dock {
    from {
        top: 0.75rem;
        padding-top: 0;
        padding-bottom: 0;
        border-radius: 1.5rem;
    }
    to {
        top: 0;
        padding-top: 1rem;
        padding-bottom: 1rem;
        border-radius: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .article-sidebar-panel,
    .article-sidebar-panel.is-pinned {
        transition: none;
        animation: none;
    }
}
</style>
