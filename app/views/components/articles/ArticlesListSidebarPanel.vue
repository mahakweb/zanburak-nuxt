<template>
    <div
        class="articles-sidebar-panel relative rounded-xl border border-blue-100/70 dark:border-gray-700/80 shadow-[0_4px_24px_-4px_rgba(59,130,246,0.12)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.35)] pt-8 pb-9 px-5"
        :class="inSheet ? 'border-0 shadow-none pt-4 pb-2 px-1' : ''">
        <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" aria-hidden="true">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-white to-sky-50/90 dark:from-[#111827] dark:via-gray-900 dark:to-[#0f172a]"></div>
            <div class="absolute -top-14 -end-10 w-36 h-36 rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -start-8 w-32 h-32 rounded-full bg-sky-400/15 dark:bg-sky-500/10 blur-3xl"></div>
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.07),transparent_58%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(96,165,250,0.1),transparent_58%)]"></div>
        </div>

        <div class="relative z-10 overflow-visible">
        <div class="rounded-xl bg-white/55 dark:bg-gray-800/35 backdrop-blur-sm border border-white/70 dark:border-gray-700/50 p-4 mb-7 shadow-sm shadow-blue-500/5">
        <router-link
            :to="{ name: 'panel-followed', query: { filter: 'article' } }"
            class="flex items-center group justify-between mb-4 hover:opacity-80 transition"
            @click="$emit('navigate')">
            <div class="flex text-gray-800 dark:text-white items-center">
                <span class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/15">
                    <svg class="w-[18px] h-[18px]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.094 5.64077C18.094 3.11914 16.3701 2.10828 13.8879 2.10828H8.05895C5.65311 2.10828 3.8501 3.05021 3.8501 5.4726V18.9694C3.8501 19.6348 4.56597 20.0538 5.14584 19.7285L10.996 16.4469L16.7955 19.723C17.3763 20.0501 18.094 19.6311 18.094 18.9648V5.64077Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path opacity="0.4" d="M7.58203 8.27564H14.2905" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <span class="rtl:mr-2.5 ltr:ml-2.5 text-base font-bold">{{ $t('articles.sidebar.savedTitle') }}</span>
            </div>
            <span class="min-w-[1.75rem] h-7 px-2 inline-flex items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold text-sm ring-1 ring-blue-500/15">{{ bookmarked.length }}</span>
        </router-link>

        <ul v-if="bookmarked.length" class="list-disc ps-4 space-y-2.5 mb-3 marker:text-blue-400/70 dark:marker:text-blue-400/50">
            <li v-for="item in bookmarkedPreview" :key="'bm-' + item.id" class="ps-0.5">
                <router-link
                    :to="{ name: 'article-show', params: { articleSlug: item.slug } }"
                    class="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 block transition"
                    @click="$emit('navigate')">
                    {{ item.title }}
                </router-link>
            </li>
        </ul>
        <p v-else-if="isLoggedin" class="text-xs text-gray-500 dark:text-gray-400 mb-3">{{ $t('articles.sidebar.savedEmpty') }}</p>
        <p v-else class="text-xs text-gray-500 dark:text-gray-400 mb-3">{{ $t('articles.sidebar.savedLogin') }}</p>

        <router-link
            v-if="isLoggedin && bookmarked.length"
            :to="{ name: 'panel-followed', query: { filter: 'article' } }"
            class="inline-flex items-center text-blue-700 dark:text-blue-400 text-xs font-bold hover:underline"
            @click="$emit('navigate')">
            {{ $t('articles.sidebar.viewAll') }}
            <LinkArrowIcon size-class="w-3 h-3" margin-class="rtl:mr-1 ltr:ml-1" />
        </router-link>
        </div>

        <div v-if="categories.length" class="mb-8 pt-6 border-t border-blue-100/80 dark:border-gray-700/60">
            <div class="flex text-gray-800 dark:text-white items-center mb-3">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-400/20 rtl:ml-2 ltr:mr-2">
                    <svg class="w-[15px] h-[15px]" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.75 9.5C0.75 11.4387 0.854858 12.9454 1.11637 14.1221C1.37598 15.2903 1.77991 16.0867 2.34661 16.6534C2.91331 17.2201 3.70973 17.624 4.8779 17.8836C6.05459 18.1451 7.56131 18.25 9.5 18.25C11.4387 18.25 12.9454 18.1451 14.1221 17.8836C15.2903 17.624 16.0867 17.2201 16.6534 16.6534C17.2201 16.0867 17.624 15.2903 17.8836 14.1221C18.1451 12.9454 18.25 11.4387 18.25 9.5C18.25 7.56131 18.1451 6.05459 17.8836 4.8779C17.624 3.70973 17.2201 2.91331 16.6534 2.34661C16.0867 1.77991 15.2903 1.37598 14.1221 1.11637C12.9454 0.854858 11.4387 0.75 9.5 0.75C7.56131 0.75 6.05459 0.854858 4.8779 1.11637C3.70973 1.37598 2.91331 1.77991 2.34661 2.34661C1.77991 2.91331 1.37598 3.70973 1.11637 4.8779C0.854858 6.05459 0.75 7.56131 0.75 9.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <span class="text-base font-bold">{{ $t('discuss.sidebar.categories') }}</span>
            </div>
            <div class="flex flex-col rounded-lg bg-white/40 dark:bg-gray-800/25 border border-white/60 dark:border-gray-700/40 px-3 py-2">
                <div
                    class="flex flex-col space-y-3 overflow-hidden transition-all duration-300 ease-in-out"
                    :style="{ maxHeight: categoriesExpanded ? `${categories.length * 2.5}rem` : `${Math.min(categories.length, categoryPreviewCount) * 2.5}rem` }">
                    <button
                        v-for="cat in categories"
                        :key="cat.id"
                        type="button"
                        @click="selectCategory(cat.slug)"
                        class="flex items-center justify-between shrink-0 group text-start w-full"
                        :class="selectedCategorySlug === cat.slug ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'">
                        <span class="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{{ cat.title }}</span>
                        <span v-if="cat.articles_count != null" class="text-[10px] font-bold text-gray-400 dark:text-gray-500">{{ cat.articles_count }}</span>
                    </button>
                </div>
                <button
                    v-if="categories.length > categoryPreviewCount"
                    type="button"
                    @click="categoriesExpanded = !categoriesExpanded"
                    class="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 transition">
                    <svg class="w-4 h-4 transition-transform duration-300" :class="categoriesExpanded ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ categoriesExpanded ? $t('discuss.sidebar.showLess') : $t('discuss.sidebar.showMore') }}
                </button>
            </div>
        </div>

        <div v-if="isLoggedin && myTags.length" class="mb-8 pt-6 border-t border-blue-100/80 dark:border-gray-700/60">
            <div class="flex text-gray-800 dark:text-white items-center mb-3">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/15 rtl:ml-2 ltr:mr-2">
                    <svg class="w-[15px] h-[15px]" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.75 9.5C0.75 11.4387 0.854858 12.9454 1.11637 14.1221C1.37598 15.2903 1.77991 16.0867 2.34661 16.6534C2.91331 17.2201 3.70973 17.624 4.8779 17.8836C6.05459 18.1451 7.56131 18.25 9.5 18.25C11.4387 18.25 12.9454 18.1451 14.1221 17.8836C15.2903 17.624 16.0867 17.2201 16.6534 16.6534C17.2201 16.0867 17.624 15.2903 17.8836 14.1221C18.1451 12.9454 18.25 11.4387 18.25 9.5C18.25 7.56131 18.1451 6.05459 17.8836 4.8779C17.624 3.70973 17.2201 2.91331 16.6534 2.34661C16.0867 1.77991 15.2903 1.37598 14.1221 1.11637C12.9454 0.854858 11.4387 0.75 9.5 0.75C7.56131 0.75 6.05459 0.854858 4.8779 1.11637C3.70973 1.37598 2.91331 1.77991 2.34661 2.34661C1.77991 2.91331 1.37598 3.70973 1.11637 4.8779C0.854858 6.05459 0.75 7.56131 0.75 9.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path opacity="0.4" d="M7.9165 5.54163V7.91663M7.9165 13.4583V7.91663M7.9165 7.91663H5.5415H11.0832M13.4582 7.91663H11.0832M11.0832 7.91663V5.54163V11.0833M11.0832 13.4583V11.0833M11.0832 11.0833H13.4582H5.5415" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <router-link :to="{ name: 'tags-index' }" class="text-base font-bold" @click="$emit('navigate')">{{ $t('discuss.sidebar.myTags') }}</router-link>
            </div>
            <div class="rounded-lg bg-white/40 dark:bg-gray-800/25 border border-white/60 dark:border-gray-700/40 px-3 py-3 flex flex-wrap items-center gap-1.5 overflow-visible">
                <TagChip
                    v-for="(tag, index) in myTags.slice(0, 8)"
                    :key="'my-' + tag.id"
                    :tag="tag"
                    variant="sidebar"
                    :color-index="index"
                    @navigate="$emit('navigate')" />
            </div>
            <router-link :to="{ name: 'tags-index' }" class="mt-3 inline-flex items-center text-blue-700 dark:text-blue-400 dark:hover:text-white hover:text-gray-700 transition duration-200" @click="$emit('navigate')">
                <span class="cursor-pointer text-sm font-bold"><span class="rtl:ml-1 ltr:mr-1">+</span>{{ $t('articles.sidebar.addTag') }}</span>
            </router-link>
        </div>

        <div v-if="popularTags.length" class="pt-6 border-t border-blue-100/80 dark:border-gray-700/60">
            <div class="flex items-center text-gray-800 dark:text-white mb-3">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/15 rtl:ml-2 ltr:mr-2">
                    <svg class="w-[15px] h-[15px]" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.75 9.5C0.75 11.4387 0.854858 12.9454 1.11637 14.1221C1.37598 15.2903 1.77991 16.0867 2.34661 16.6534C2.91331 17.2201 3.70973 17.624 4.8779 17.8836C6.05459 18.1451 7.56131 18.25 9.5 18.25C11.4387 18.25 12.9454 18.1451 14.1221 17.8836C15.2903 17.624 16.0867 17.2201 16.6534 16.6534C17.2201 16.0867 17.624 15.2903 17.8836 14.1221C18.1451 12.9454 18.25 11.4387 18.25 9.5C18.25 7.56131 18.1451 6.05459 17.8836 4.8779C17.624 3.70973 17.2201 2.91331 16.6534 2.34661C16.0867 1.77991 15.2903 1.37598 14.1221 1.11637C12.9454 0.854858 11.4387 0.75 9.5 0.75C7.56131 0.75 6.05459 0.854858 4.8779 1.11637C3.70973 1.37598 2.91331 1.77991 2.34661 2.34661C1.77991 2.91331 1.37598 3.70973 1.11637 4.8779C0.854858 6.05459 0.75 7.56131 0.75 9.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path opacity="0.4" d="M7.9165 5.54163V7.91663M7.9165 13.4583V7.91663M7.9165 7.91663H5.5415H11.0832M13.4582 7.91663H11.0832M11.0832 7.91663V5.54163V11.0833M11.0832 13.4583V11.0833M11.0832 11.0833H13.4582H5.5415" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <span class="text-base font-bold">{{ $t('discuss.sidebar.popularTags') }}</span>
            </div>
            <div class="rounded-lg bg-white/40 dark:bg-gray-800/25 border border-white/60 dark:border-gray-700/40 px-3 py-3 overflow-visible">
                <div class="flex flex-wrap items-center gap-1.5 overflow-visible">
                    <TagChip
                        v-for="(tag, index) in popularTagsPreview"
                        :key="tag.id"
                        :tag="tag"
                        variant="sidebar"
                        :color-index="index"
                        @navigate="$emit('navigate')" />
                </div>
                <router-link
                    v-if="showPopularTagsViewAll"
                    :to="{ name: 'tags-index', query: { sort: 'popular' } }"
                    class="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline transition"
                    @click="$emit('navigate')">
                    {{ $t('tags.viewAll') }}
                    <LinkArrowIcon size-class="w-3 h-3" margin-class="" />
                </router-link>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import TagChip from "@/views/components/tag/TagChip.vue";
import LinkArrowIcon from "@/views/components/articles/LinkArrowIcon.vue";

const BOOKMARK_PREVIEW_LIMIT = 3;
const POPULAR_TAGS_PREVIEW_LIMIT = 20;

export default {
    components: { TagChip, LinkArrowIcon },
    emits: ["select-category", "navigate"],
    props: {
        bookmarked: { type: Array, default: () => [] },
        popularTags: { type: Array, default: () => [] },
        myTags: { type: Array, default: () => [] },
        categories: { type: Array, default: () => [] },
        selectedCategorySlug: { type: String, default: null },
        isLoggedin: { type: Boolean, default: false },
        inSheet: { type: Boolean, default: false },
    },
    data() {
        return {
            categoriesExpanded: false,
            categoryPreviewCount: 6,
        };
    },
    computed: {
        bookmarkedPreview() {
            return this.bookmarked.slice(0, BOOKMARK_PREVIEW_LIMIT);
        },
        popularTagsPreview() {
            return this.popularTags.slice(0, POPULAR_TAGS_PREVIEW_LIMIT);
        },
        showPopularTagsViewAll() {
            return this.popularTags.length > POPULAR_TAGS_PREVIEW_LIMIT;
        },
    },
    methods: {
        selectCategory(slug) {
            this.$emit("select-category", slug);
        },
    },
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
