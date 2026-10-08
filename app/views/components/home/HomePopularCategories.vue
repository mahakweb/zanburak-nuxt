<template>
    <section v-if="categories && categories.length > 0" class="">
        <div class="flex flex-col items-center justify-center mb-6">
            <h4 class="flex items-center gap-2 dark:text-white text-gray-700 font-extrabold text-3xl">
                {{ $t('index.popularCategories') }}
            </h4>
            <div class="flex justify-center md:justify-start">
                <span class="inline-block w-40 h-1 bg-pink-600 rounded-full"></span>
                <span class="inline-block w-3 h-1 mx-1 bg-pink-600 rounded-full"></span>
                <span class="inline-block w-1 h-1 bg-pink-600 rounded-full"></span>
            </div>
        </div>

        <!-- Mobile: 2-row horizontal scroll (old card style) -->
        <div class="mx-auto max-w-screen-lg px-2 lg:hidden">
            <div
                class="popular-cats-scroll -mx-1 px-1 overflow-x-auto overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div
                    class="grid grid-rows-2 grid-flow-col gap-x-3 gap-y-4 w-max pb-2"
                    style="grid-auto-columns: 6rem;">
                    <router-link
                        v-for="cat in categories"
                        :key="`mobile-${cat.id}`"
                        :to="{ name: 'courses', query: { 'cat[0]': cat.title } }"
                        class="popular-cat-card group relative shrink-0 w-24">
                        <div
                            class="w-24 h-24 bg-gray-300 dark:bg-gray-600 overflow-hidden rounded-xl transition-transform duration-200 group-active:-translate-y-1">
                            <SeoImage
                                v-if="isImageIcon(cat.icon)"
                                :src="cat.icon"
                                :alt="cat.title || 'دسته‌بندی'"
                                :width="96"
                                :height="96"
                                sizes-preset="icon"
                                img-class="w-full h-full rounded-lg object-cover transition-transform duration-200 group-active:scale-110"
                            />
                            <div
                                v-else-if="cat.icon"
                                class="category-icon flex h-full w-full items-center justify-center p-3"
                                v-html="cat.icon" />
                        </div>
                        <h6
                            class="mt-2 w-24 text-center text-xs font-medium leading-tight text-gray-700 line-clamp-2 dark:text-gray-100">
                            {{ cat.title }}
                        </h6>
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Desktop: wrapped grid with old card style -->
        <div class="mx-auto hidden max-w-screen-lg px-2 lg:block">
            <div class="flex w-full flex-wrap justify-center gap-4 xl:gap-5">
                <router-link
                    v-for="cat in categories"
                    :key="`desktop-${cat.id}`"
                    :to="{ name: 'courses', query: { 'cat[0]': cat.title } }"
                    class="popular-cat-card group relative w-28">
                    <div
                        class="h-28 w-28 overflow-hidden rounded-xl bg-gray-300 transition-transform duration-200 group-hover:-translate-y-5 dark:bg-gray-600">
                        <SeoImage
                            v-if="isImageIcon(cat.icon)"
                            :src="cat.icon"
                            :alt="cat.title || 'دسته‌بندی'"
                            :width="112"
                            :height="112"
                            sizes-preset="icon"
                            img-class="h-full w-full rounded-lg object-cover transition-transform duration-200 group-hover:scale-110"
                        />
                        <div
                            v-else-if="cat.icon"
                            class="category-icon flex h-full w-full items-center justify-center p-4"
                            v-html="cat.icon" />
                    </div>
                    <h6
                        class="absolute -bottom-2 mt-2 w-28 text-center text-sm font-medium leading-tight text-gray-700 opacity-0 transition duration-200 line-clamp-1 group-hover:opacity-100 dark:text-gray-100">
                        {{ cat.title }}
                    </h6>
                </router-link>
            </div>
        </div>
    </section>
</template>

<script>
import SeoImage from "@/views/components/seo/SeoImage.vue";

export default {
    name: "HomePopularCategories",
    components: { SeoImage },
    props: {
        categories: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        isImageIcon(icon) {
            if (!icon || typeof icon !== "string") return false;
            const value = icon.trim();
            if (!value || value.startsWith("<")) return false;
            return (
                value.startsWith("http") ||
                value.startsWith("/") ||
                value.startsWith("data:image") ||
                /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(value)
            );
        },
    },
};
</script>

<style scoped>
.category-icon :deep(svg) {
    width: 100%;
    height: 100%;
    max-width: 3.5rem;
    max-height: 3.5rem;
}
</style>
