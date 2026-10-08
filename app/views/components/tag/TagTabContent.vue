<template>
    <div>
        <div v-if="loading && items.length === 0" :class="layoutClass">
            <div
                v-for="n in skeletonCount"
                :key="n"
                :class="skeletonHeightClass"
                class="rounded-2xl bg-white/90 dark:bg-[#151c2c] border border-gray-100/80 dark:border-[#2a3850]/50 shadow-sm dark:shadow-none animate-pulse">
                <div class="p-4 space-y-3">
                    <div class="h-4 w-3/5 bg-gray-100 dark:bg-[#243044] rounded-lg"></div>
                    <div class="h-3 w-2/5 bg-gray-100 dark:bg-[#243044] rounded-lg"></div>
                    <div class="h-3 w-4/5 bg-gray-100 dark:bg-[#243044] rounded-lg"></div>
                </div>
            </div>
        </div>
        <template v-else>
            <div class="relative min-h-[8rem]">
                <div
                    v-if="loading && items.length > 0"
                    class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/70 dark:bg-[#121a28]/75 backdrop-blur-[2px]">
                    <svg class="w-8 h-8 text-amber-400 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                </div>
                <div
                    v-if="items.length > 0"
                    :class="[layoutClass, 'transition-opacity duration-200', loading ? 'opacity-40 pointer-events-none' : '']">
                    <slot></slot>
                </div>
                <div v-else class="py-14 text-center rounded-2xl bg-white/90 dark:bg-[#151c2c] border border-gray-100/80 dark:border-[#2a3850]/50 shadow-sm dark:shadow-none">
                    <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 dark:bg-[#1e2a3f] flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
                            <path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ emptyText }}</p>
                </div>
            </div>

            <div v-if="pagination && pagination.last_page > 1" class="mt-6">
                <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="onPageUpdate" />
            </div>
        </template>
    </div>
</template>

<script>
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";

export default {
    components: { PaginationComponent },
    props: {
        type: String,
        loading: Boolean,
        items: { type: Array, default: () => [] },
        emptyText: String,
        pagination: {
            type: Object,
            default: null,
        },
    },
    emits: ["updatePage"],
    computed: {
        layoutClass() {
            if (this.type === "articles") {
                return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5";
            }
            if (this.type === "courses") {
                return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5";
            }
            return "space-y-3 md:space-y-4";
        },
        skeletonCount() {
            if (this.type === "articles") return 4;
            if (this.type === "courses") return 4;
            return 3;
        },
        skeletonHeightClass() {
            if (this.type === "questions") return "h-28";
            return "h-48";
        },
    },
    methods: {
        onPageUpdate(page) {
            this.$emit("updatePage", page);
        },
    },
};
</script>
