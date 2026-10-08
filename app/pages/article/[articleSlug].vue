<script setup>
import { articleService } from '@/services/article.service'

definePageMeta({
  name: "article-show",
})

const route = useRoute()
await useAsyncData(
  () => `article-show-${route.params.articleSlug}`,
  async () => {
    try {
      const slug = route.params.articleSlug
      const [showRes, relatedRes, navRes] = await Promise.all([
        articleService.show(slug),
        articleService.related(slug, { limit: 12 }),
        articleService.prevNext(slug),
      ])
      return {
        show: showRes.data,
        related: relatedRes.data,
        nav: navRes.data,
      }
    } catch {
      return null
    }
  },
)
</script>

<template>
    <MasterPage>
        <div
            v-if="article && !loading"
            class="fixed top-0 inset-x-0 z-[60] h-1 pointer-events-none"
            role="progressbar"
            :aria-valuenow="Math.round(readingProgress)"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="$t('articles.show.readingProgress') || 'Reading progress'">
            <div
                class="h-full bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-400 transition-[width] duration-100 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                :style="{ width: readingProgress + '%' }"></div>
        </div>

        <ArticleShowLoading v-if="loading" />

        <div v-else-if="article" class="mx-auto max-w-screen-xl px-2 pt-20 pb-20">
            <!-- Breadcrumb -->
            <!-- <nav class="my-5 md:my-8" aria-label="Breadcrumb">
                <router-link
                    :to="{ name: 'articles-index' }"
                    class="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition group">
                    <svg class="w-4 h-4 rtl:rotate-180 transition group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('articles.list.allArticles') }}
                </router-link>
            </nav> -->

            <section class="mb-20">
                <div class="grid lg:grid-cols-12 gap-6">
                    <!-- Main column (right in RTL) -->
                    <div class="order-2 lg:order-1 lg:col-span-9 col-span-12 space-y-6">
                        <!-- Article card -->
                        <article class="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_-4px_rgba(59,130,246,0.08)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)]">
                            <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-sky-50/30 dark:from-[#0f1524] dark:via-gray-900 dark:to-[#0f1a2e]" aria-hidden="true"></div>
                            <div class="pointer-events-none absolute -top-20 -start-16 w-56 h-56 rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-3xl" aria-hidden="true"></div>

                            <div class="relative p-5 sm:p-8 lg:p-10">
                                <!-- Cover -->
                                <div
                                    
                                    class="mb-8 -mx-1 sm:-mx-2 overflow-hidden rounded-xl"
                                    :class="coverImageError ? '' : 'ring-1 ring-black/5 dark:ring-white/10 shadow-lg'">
                                    <div class="h-56 sm:h-64 lg:h-80 w-full bg-gray-200 dark:bg-gray-800">
                                        <SeoImage
                                            v-if="article.cover_image && !coverImageError"
                                            :src="article.cover_image"
                                            :alt="article.title"
                                            :priority="true"
                                            :width="1200"
                                            :height="630"
                                            sizes-preset="hero"
                                            img-class="block w-full h-full object-cover"
                                            @error="coverImageError = true"
                                        />
                                    </div>
                                </div>

                                <!-- Meta row -->
                                <div class="flex flex-wrap items-center gap-3 mb-5">
                                    <router-link
                                        v-if="article.category"
                                        :to="{ name: 'articles-index', query: { category: article.category.slug } }"
                                        class="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 px-3.5 py-1.5 text-xs font-bold ring-1 ring-blue-500/20 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition">
                                        <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 23 22" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7915 11.0486C11.292 11.0486 10.887 11.4535 10.887 11.9531C10.887 12.4526 11.2919 12.8575 11.7915 12.8575L15.4209 12.8575C15.9205 12.8575 16.3254 12.4526 16.3254 11.9531C16.3254 11.4535 15.9205 11.0486 15.4209 11.0486L11.7915 11.0486Z" fill="currentColor"/>
                                            <path d="M16.3021 4.92382C15.3306 4.83267 14.2064 4.79518 12.9123 4.79518C4.92001 4.79518 3.00712 6.22507 2.07443 12.8965C1.93217 13.9141 1.84681 14.8097 1.83266 15.597M16.3021 4.92382C21.3305 5.39564 22.2667 7.30528 21.4851 12.8965C20.5524 19.568 18.6395 20.9979 10.6472 20.9979C3.87388 20.9979 1.75406 19.9709 1.83266 15.597M16.3021 4.92382V2.99488C15.963 0.294405 4.81796 0.647123 3.63956 2.99488C1.83233 6.59543 1.83266 15.597 1.83266 15.597" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                                        </svg>
                                        {{ article.category.title }}
                                    </router-link>
                                    <span class="inline-flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[11px] font-medium">
                                        <svg class="rtl:ml-1 ltr:mr-1 shrink-0 w-3.5 h-3.5"  viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.60509 1.45136C2.44111 1.61533 2.36357 1.8075 2.33008 2.00642C2.93427 1.89004 3.6854 1.84615 4.61527 1.84615C5.54514 1.84615 6.29627 1.89004 6.90046 2.00642C6.86697 1.8075 6.78942 1.61533 6.62545 1.45136C6.37407 1.19998 5.82701 0.923077 4.61527 0.923077C3.40353 0.923077 2.85647 1.19998 2.60509 1.45136ZM1.95237 0.798643C1.44953 1.30148 1.38477 1.91343 1.3845 2.30521C0.299759 2.83849 -0.000112534 3.92458 -0.000112534 6C-0.000112534 8.07542 0.299759 9.16151 1.3845 9.69479C1.38477 10.0866 1.44953 10.6985 1.95237 11.2014C2.45099 11.7 3.28854 12 4.61527 12C5.942 12 6.77955 11.7 7.27817 11.2014C7.78101 10.6985 7.84577 10.0866 7.84604 9.69479C8.93079 9.16151 9.23066 8.07542 9.23066 6C9.23066 3.92458 8.93079 2.83849 7.84604 2.30521C7.84577 1.91344 7.78101 1.30149 7.27817 0.798644C6.77955 0.300024 5.942 0 4.61527 0C3.28854 0 2.45099 0.300024 1.95237 0.798643ZM6.90046 9.99358C6.29626 10.11 5.54514 10.1538 4.61527 10.1538C3.68541 10.1538 2.93428 10.11 2.33008 9.99358C2.36357 10.1925 2.44111 10.3847 2.60509 10.5486C2.85647 10.8 3.40353 11.0769 4.61527 11.0769C5.82701 11.0769 6.37407 10.8 6.62545 10.5486C6.78943 10.3847 6.86696 10.1925 6.90046 9.99358ZM1.4998 8.67356C1.15669 8.36477 0.922964 7.73297 0.922964 6C0.922964 4.26703 1.15669 3.63523 1.4998 3.32643C1.67362 3.16999 1.9565 3.02236 2.47171 2.91931C2.99245 2.81515 3.68384 2.76923 4.61527 2.76923C5.54671 2.76923 6.2381 2.81515 6.75883 2.91931C7.27405 3.02236 7.55692 3.16999 7.73075 3.32643C8.07385 3.63523 8.30758 4.26703 8.30758 6C8.30758 7.73297 8.07385 8.36477 7.73075 8.67356C7.55692 8.83001 7.27405 8.97764 6.75883 9.08069C6.2381 9.18485 5.54671 9.23077 4.61527 9.23077C3.68384 9.23077 2.99245 9.18485 2.47171 9.08069C1.9565 8.97764 1.67362 8.83001 1.4998 8.67356Z" fill="currentColor" />
                                            <path d="M4.61548 4.15381C4.61548 4.15381 4.61548 5.07689 4.61548 5.53842C4.61548 5.99996 4.61547 5.99996 5.07702 5.99996C5.53856 5.99996 6.92317 5.99996 6.92317 5.99996" stroke="currentColor" stroke-width="0.923077" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        {{ $t('articles.card.readTime', { min: article.reading_time_minutes || 1 }) }}
                                    </span>
                                    <span v-if="article.published_at" class="inline-flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[11px] font-medium">
                                        <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7389 2.24634H6.6581C4.19056 2.24634 2.64355 3.99346 2.64355 6.4659V13.1375C2.64355 15.6099 4.18239 17.357 6.6581 17.357H13.7381C16.2138 17.357 17.7542 15.6099 17.7542 13.1375V6.4659C17.7542 3.99346 16.2138 2.24634 13.7389 2.24634Z" stroke="currentColor" stroke-width="1.2"/>
                                            <path d="M12.9685 11.4495L10.1987 9.79715V6.23511" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                                        </svg>
                                        {{ timeAgo(article.published_at) }}
                                    </span>
                                </div>

                                <!-- Title -->
                                <h1 class="mb-3 text-gray-800 dark:text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold text-start leading-tight tracking-tight">{{ article.title }}</h1>
                                <div class="flex mb-8">
                                    <span class="inline-block w-16 h-0.5 bg-blue-500 rounded-full"></span>
                                    <span class="inline-block w-2 h-0.5 mx-1 bg-blue-500/70 rounded-full"></span>
                                    <span class="inline-block w-1 h-0.5 bg-blue-500/40 rounded-full"></span>
                                </div>

                                <!-- Content -->
                                <div ref="contentRef" class="article-content content-area prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                                    <MarkdownRenderer startClass="rendered-content github-markdown-body" :source="article.content" />
                                </div>

                                <!-- Rating -->
                                <div class="mt-10">
                                    <ArticleRating
                                        :article-id="article.id"
                                        :ratings="articleRatings"
                                        :is-logged-in="isLoggedin"
                                        @rated="articleRatings = $event" />
                                </div>

                                <!-- Tags -->
                                <div v-if="article.tags?.length" class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/80">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <TagChip v-for="tag in article.tags" :key="tag.id" :tag="tag" />
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between sm:flex-row flex-col gap-3">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <a
                                            href="#comments"
                                            class="inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/60 hover:border-emerald-300/70 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 transition-all duration-200">
                                            <svg class="shrink-0 opacity-75" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5.99646 0.827528C7.17456 0.827528 8.09169 0.881027 8.80899 1.01903C9.52386 1.15656 10.0045 1.37154 10.3411 1.66825C11.0098 2.25772 11.2804 3.32306 11.2804 5.47101C11.2804 6.85518 11.1561 7.87367 10.8215 8.53718C10.661 8.85564 10.4576 9.07995 10.2017 9.22916C9.94304 9.37996 9.59628 9.474 9.11892 9.474C8.5035 9.474 8.0416 9.61219 7.68041 9.85692C7.32786 10.0958 7.11521 10.4085 6.95703 10.6574C6.9331 10.6951 6.91069 10.7307 6.88949 10.7643C6.75685 10.9749 6.67103 11.1111 6.55187 11.2181C6.44568 11.3134 6.29728 11.3954 5.99659 11.3954C5.69593 11.3954 5.54754 11.3133 5.44133 11.218C5.32218 11.1111 5.23635 10.9749 5.10373 10.7643C5.08251 10.7307 5.0601 10.6951 5.03616 10.6574C4.87797 10.4085 4.66531 10.0958 4.31276 9.8569C3.95156 9.61218 3.48966 9.474 2.87424 9.474C2.39941 9.474 2.05376 9.37759 1.79518 9.22368C1.53855 9.07092 1.33387 8.84146 1.17225 8.51818C0.836472 7.84655 0.712507 6.82628 0.712507 5.47101C0.712507 3.35035 0.982347 2.28225 1.65335 1.68581C1.99094 1.38572 2.47232 1.1667 3.18628 1.02566C3.90284 0.884101 4.81936 0.827528 5.99646 0.827528Z" stroke="currentColor" stroke-width="0.96" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.47668 4.67017H8.39812M3.59465 6.5918H8.39825" stroke="currentColor" stroke-width="0.96" stroke-linecap="round"/></svg>
                                            <span>{{ article.comments_count || 0 }}</span>
                                        </a>

                                        <template v-if="isLoggedin">
                                            <button
                                                type="button"
                                                @click="toggleLike"
                                                :disabled="likeLoading"
                                                :class="[
                                                    'inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-semibold border transition-all duration-200 disabled:opacity-50',
                                                    userHasLiked
                                                        ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200/80 dark:border-rose-500/30 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600'
                                                        : 'text-slate-600 dark:text-slate-300 bg-white dark:bg-gray-800/60 border-gray-200/80 dark:border-gray-700/60 hover:border-rose-200/80 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400'
                                                ]">
                                                <svg v-if="likeLoading" class="w-3.5 h-3.5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                                <svg v-else-if="userHasLiked" class="shrink-0" width="12" height="11" fill="none" viewBox="0 0 15 13"><path fill="currentColor" d="M4.75 0.624878C5.80649 0.624878 6.77021 1.15065 7.5 1.74964C8.22979 1.15065 9.19351 0.624878 10.25 0.624878C12.5282 0.624878 14.375 2.31858 14.375 4.40774C14.375 8.62007 9.57964 11.0733 7.99879 11.7676C7.68036 11.9075 7.31964 11.9075 7.00121 11.7676C5.42036 11.0733 0.625 8.61997 0.625 4.40764C0.625 2.31848 2.47183 0.624878 4.75 0.624878Z" stroke-width="0.77"/></svg>
                                                <svg v-else class="shrink-0 opacity-75" width="12" height="11" fill="none" viewBox="0 0 15 13"><path stroke="currentColor" d="M4.75 0.624878C5.80649 0.624878 6.77021 1.15065 7.5 1.74964C8.22979 1.15065 9.19351 0.624878 10.25 0.624878C12.5282 0.624878 14.375 2.31858 14.375 4.40774C14.375 8.62007 9.57964 11.0733 7.99879 11.7676C7.68036 11.9075 7.31964 11.9075 7.00121 11.7676C5.42036 11.0733 0.625 8.61997 0.625 4.40764C0.625 2.31848 2.47183 0.624878 4.75 0.624878Z" stroke-width="0.77"/></svg>
                                                <span>{{ likesCount }}</span>
                                            </button>

                                            <button
                                                type="button"
                                                @click="toggleBookmark"
                                                :disabled="bookmarkLoading"
                                                :class="[
                                                    'inline-flex items-center justify-center h-7 w-7 rounded-md border transition-all duration-200 disabled:opacity-50',
                                                    article.bookmarked
                                                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200/80 dark:border-amber-500/35 hover:bg-amber-400 hover:text-white dark:hover:bg-amber-500'
                                                        : 'text-slate-600 dark:text-slate-300 bg-white dark:bg-gray-800/60 border-gray-200/80 dark:border-gray-700/60 hover:border-blue-200/80 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400'
                                                ]">
                                                <svg v-if="bookmarkLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                                <svg v-else-if="article.bookmarked" class="w-3.5 h-[15px] shrink-0" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M21 11.0975V16.0909C21 19.1875 21 20.7358 20.2659 21.4123C19.9158 21.735 19.4739 21.9377 19.0031 21.9915C18.016 22.1045 16.8633 21.0849 14.5578 19.0458C13.5388 18.1445 13.0292 17.6938 12.4397 17.5751C12.1494 17.5166 11.8506 17.5166 11.5603 17.5751C10.9708 17.6938 10.4612 18.1445 9.44216 19.0458C7.13673 21.0849 5.98402 22.1045 4.99692 21.9915C4.52615 21.9377 4.08421 21.735 3.73411 21.4123C3 20.7358 3 19.1875 3 16.0909V11.0975C3 6.80891 3 4.6646 4.31802 3.3323C5.63604 2 7.75736 2 12 2C16.2426 2 18.364 2 19.682 3.3323C21 4.6646 21 6.80891 21 11.0975ZM8.25 6C8.25 5.58579 8.58579 5.25 9 5.25H15C15.4142 5.25 15.75 5.58579 15.75 6C15.75 6.41421 15.4142 6.75 15 6.75H9C8.58579 6.75 8.25 6.41421 8.25 6Z"/></svg>
                                                <svg v-else class="w-3.5 h-[15px] shrink-0" viewBox="0 0 10 12" fill="none"><path stroke="currentColor" d="M2.51974 10.651L2.51972 10.651L2.51551 10.654C2.00961 11.009 1.31115 10.6877 1.26272 10.0631C1.20578 9.32899 1.12994 7.98392 1.12995 6.02793V5.99265V5.99264C1.12994 5.21616 1.13036 4.53967 1.18575 3.97518C1.24191 3.40288 1.35849 2.89041 1.62915 2.47298C2.19514 1.60008 3.28533 1.34809 4.99817 1.34104C6.71301 1.33397 7.80474 1.58477 8.37131 2.46321C8.64158 2.88225 8.75804 3.39711 8.81416 3.97134C8.86955 4.538 8.86997 5.21625 8.86995 5.993V6.02794C8.86995 7.98392 8.7941 9.32899 8.73716 10.0631C8.68873 10.6877 7.99029 11.009 7.48439 10.654L7.48441 10.654L7.48016 10.651C7.03638 10.3475 6.6257 10.0207 6.30567 9.76593L6.29989 9.76133C6.15447 9.64555 6.02249 9.54047 5.91897 9.46373C5.7247 9.31973 5.56248 9.2214 5.41218 9.16087C5.24859 9.095 5.11648 9.08089 4.99995 9.08089C4.88342 9.08089 4.75131 9.095 4.58772 9.16088C4.43742 9.2214 4.2752 9.31973 4.08093 9.46373C3.97737 9.54049 3.8453 9.64565 3.69982 9.76147L3.69423 9.76592C3.3742 10.0207 2.96352 10.3475 2.51974 10.651Z" stroke-width="0.86" stroke-linecap="round" stroke-linejoin="round"/><path stroke="currentColor" d="M5.86 3.06262C6.29 3.06262 6.505 3.06099 6.8275 3.38265C7.15 3.70432 7.15 4.78095 7.15 5.21094" stroke-width="0.86" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            </button>

                                            <button
                                                type="button"
                                                @click="openReportModal"
                                                class="inline-flex items-center justify-center h-7 w-7 rounded-md text-rose-500 dark:text-rose-400 bg-white dark:bg-gray-800/60 border border-rose-200/70 dark:border-rose-500/25 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 transition-all duration-200"
                                                :title="$t('discuss.common.reportTitle')">
                                                <svg class="w-3.5 h-3.5 shrink-0 opacity-85" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13V10C13 9.44772 12.5523 9 12 9C11.4477 9 11 9.44772 11 10V13ZM13 15.9888C13 15.4365 12.5523 14.9888 12 14.9888C11.4477 14.9888 11 15.4365 11 15.9888V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V15.9888ZM9.37735 4.66136C10.5204 2.60393 13.4793 2.60393 14.6223 4.66136L21.2233 16.5431C22.3341 18.5427 20.8882 21 18.6008 21H5.39885C3.11139 21 1.66549 18.5427 2.77637 16.5431L9.37735 4.66136Z" fill="currentColor"/></svg>
                                            </button>
                                        </template>
                                    </div>
                                    <div dir="ltr" class="flex items-center relative rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-sm">
                                        <input readonly :value="shareUrl" dir="ltr" class="font-sans outline-none py-2 ps-9 pe-3 bg-transparent border-none font-normal text-xs text-gray-500 dark:text-gray-400 w-44 sm:w-52 max-w-full" />
                                        <button type="button" @click="copyLink" class="absolute start-3 flex items-center justify-center w-[14px] h-[13px] cursor-pointer transition" :title="$t('articles.show.copyLink')">
                                            <svg v-if="linkCopied" width="14" height="13" viewBox="0 0 24 24" fill="none" class="text-emerald-500">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <svg v-else width="14" height="13" viewBox="0 0 14 13" fill="none" class="text-gray-400 hover:text-blue-600 transition"><path d="M11.1251 9.37753C11.1735 9.03246 11.2048 8.65154 11.2224 8.23142C11.342 8.16599 11.4325 8.09594 11.5044 8.02404C11.6726 7.85578 11.8308 7.58558 11.9433 7.07954C12.0583 6.56181 12.1108 5.86547 12.1108 4.91155C12.1108 3.00521 11.8476 2.22592 11.4625 1.84091C11.0775 1.45589 10.2983 1.19269 8.3919 1.19269C7.43799 1.19269 6.74164 1.24514 6.22392 1.3602C5.71788 1.47266 5.44768 1.63081 5.27942 1.79907C5.20752 1.87097 5.13746 1.96148 5.07203 2.08106C5.36761 2.06867 5.68259 2.06306 6.01814 2.06306C10.3187 2.06306 11.2404 2.98479 11.2404 7.2853C11.2404 11.5858 10.3187 12.5075 6.01814 12.5075C1.71762 12.5075 0.795898 11.5858 0.795898 7.2853C0.795898 3.79726 1.40225 2.53194 3.92593 2.17833C4.4152 0.577466 5.64584 0.164062 8.3919 0.164062C12.1899 0.164062 13.1394 1.11356 13.1394 4.91155C13.1394 7.65762 12.726 8.88826 11.1251 9.37753Z" fill="currentColor" fill-opacity="0.56"/></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <!-- Author card -->
                        <div v-if="author?.user" class="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-transparent dark:from-[#111827] dark:via-gray-900 dark:to-transparent" aria-hidden="true"></div>
                            <div class="relative flex sm:flex-row flex-col items-center gap-5 px-6 sm:px-10 py-8">
                                <router-link :to="{ name: 'profile-page', params: { username: author.user.username } }" class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden ring-[3px] ring-blue-500/30 shadow-md">
                                    <SeoImage
                                        :src="author.user.profile_pic"
                                        :alt="authorName || 'نویسنده'"
                                        :width="64"
                                        :height="64"
                                        sizes-preset="avatar"
                                        img-class="w-full h-full hover:scale-110 transition duration-200 object-cover"
                                    />
                                </router-link>
                                <div class="w-full text-center sm:text-start flex-1">
                                    <div class="flex sm:flex-row flex-col justify-between items-center gap-3">
                                        <div>
                                            <router-link :to="{ name: 'profile-page', params: { username: author.user.username } }" class="text-gray-800 sm:text-xl dark:text-white dark:hover:text-blue-400 hover:text-blue-700 transition duration-200 text-lg font-bold">{{ authorName }}</router-link>
                                            <p v-if="author.user.info" class="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-lg">{{ author.user.info }}</p>
                                        </div>
                                        <button
                                            v-if="isLoggedin && currentUser?.id !== author.user.id"
                                            type="button"
                                            @click="toggleFollowAuthor"
                                            :disabled="followLoading"
                                            class="inline-flex items-center justify-center gap-1.5 h-9 min-w-[7.5rem] text-xs font-bold px-6 border border-blue-700 dark:border-blue-400 dark:text-blue-400 rounded-lg text-blue-700 hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition duration-200 shrink-0 disabled:opacity-60">
                                            <svg v-if="followLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            <span v-else>{{ author.is_following ? $t('articles.show.unfollowAuthor') : $t('articles.show.followAuthor') }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Related courses -->
                        <div v-if="relatedCourses.length">
                            <div class="flex items-center gap-2 mb-5">
                                <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/15">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M8.5 2H15.5C17 2 18 3 18 4.5V19.5C18 21 17 22 15.5 22H8.5C7 22 6 21 6 19.5V4.5C6 3 7 2 8.5 2Z" stroke="currentColor" stroke-width="1.5"/><path d="M9 7H15M9 11H15M9 15H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                </span>
                                <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ $t('articles.show.relatedCourses') }}</h3>
                            </div>
                            <div class="grid sm:grid-cols-2 gap-4">
                                <router-link
                                    v-for="course in relatedCourses.slice(0, 4)"
                                    :key="course.id"
                                    :to="{ name: 'course.show', params: { courseSlug: course.slug } }"
                                    class="group flex gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-violet-300/60 dark:hover:border-violet-500/30 shadow-sm hover:shadow-md transition">
                                    <div class="w-20 h-14 rounded-lg shrink-0 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden bg-gradient-to-br from-violet-100 via-blue-50 to-sky-100 dark:from-gray-800 dark:via-gray-900 dark:to-violet-950/40 flex items-center justify-center">
                                        <SeoImage
                                            v-if="course.poster && !coursePosterErrors[course.id]"
                                            :src="course.poster"
                                            :alt="course.title || ''"
                                            :width="80"
                                            :height="56"
                                            sizes-preset="thumb"
                                            img-class="w-full h-full object-cover"
                                            @error="coursePosterErrors[course.id] = true"
                                        />
                                        <svg v-else class="w-6 h-6 text-violet-400/60 dark:text-violet-500/50" viewBox="0 0 24 24" fill="none"><path d="M8.5 2H15.5C17 2 18 3 18 4.5V19.5C18 21 17 22 15.5 22H8.5C7 22 6 21 6 19.5V4.5C6 3 7 2 8.5 2Z" stroke="currentColor" stroke-width="1.5"/><path d="M9 7H15M9 11H15M9 15H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="font-bold text-sm text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 line-clamp-2 transition">{{ course.title }}</p>
                                        <p v-if="course.teacher" class="text-xs text-gray-400 mt-1">{{ course.teacher.first_name }} {{ course.teacher.last_name }}</p>
                                    </div>
                                </router-link>
                            </div>
                        </div>

                        <!-- Prev / Next -->
                        <div v-if="previous || next" class="grid sm:grid-cols-2 gap-4">
                            <router-link v-if="previous" :to="{ name: 'article-show', params: { articleSlug: previous.slug } }" class="group p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-300/60 dark:hover:border-blue-500/30 shadow-sm hover:shadow-md transition">
                                <span class="inline-flex items-center gap-1 text-xs text-gray-400 font-semibold mb-2">
                                    <svg class="w-3 h-3 rtl:rotate-180" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                    {{ $t('articles.show.prev') }}
                                </span>
                                <p class="font-bold text-sm text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 line-clamp-2 transition">{{ previous.title }}</p>
                            </router-link>
                            <router-link v-if="next" :to="{ name: 'article-show', params: { articleSlug: next.slug } }" class="group p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-300/60 dark:hover:border-blue-500/30 shadow-sm hover:shadow-md transition sm:text-end">
                                <span class="inline-flex items-center gap-1 text-xs text-gray-400 font-semibold mb-2 sm:justify-end">
                                    {{ $t('articles.show.next') }}
                                    <svg class="w-3 h-3 rtl:rotate-180" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                </span>
                                <p class="font-bold text-sm text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 line-clamp-2 transition">{{ next.title }}</p>
                            </router-link>
                        </div>

                        <!-- Comments -->
                        <section id="comments" class="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-transparent dark:from-[#111827] dark:via-gray-900 dark:to-transparent" aria-hidden="true"></div>
                            <div class="relative px-5 sm:px-10 pt-8 pb-6">
                                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                                    <div class="flex items-center gap-2 self-start">
                                        <span class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/15">
                                            <svg class="w-[18px] h-[18px]" viewBox="0 0 25 24" fill="none">
                                                <path stroke="currentColor" d="M12.877 1C15.3295 1 17.2387 1.11137 18.732 1.39866C20.2202 1.68498 21.2207 2.13251 21.9215 2.75018C23.3136 3.97734 23.877 6.19513 23.877 10.6667C23.877 13.5482 23.6182 15.6685 22.9217 17.0498C22.5874 17.7127 22.164 18.1797 21.6313 18.4903C21.0928 18.8042 20.371 19 19.3772 19C18.096 19 17.1345 19.2877 16.3825 19.7971C15.6486 20.2944 15.2059 20.9455 14.8766 21.4637C14.8268 21.542 14.7802 21.6161 14.736 21.6862C14.4599 22.1245 14.2813 22.4082 14.0332 22.6307C13.8121 22.8291 13.5032 23 12.8772 23C12.2513 23 11.9424 22.8291 11.7213 22.6307C11.4732 22.4081 11.2946 22.1245 11.0185 21.6862C10.9743 21.6161 10.9277 21.542 10.8778 21.4636C10.5485 20.9454 10.1058 20.2944 9.37185 19.7971C8.61993 19.2877 7.65835 19 6.3772 19C5.3887 19 4.66913 18.7993 4.13083 18.4789C3.59659 18.1609 3.17049 17.6832 2.83402 17.0102C2.13502 15.612 1.87695 13.488 1.87695 10.6667C1.87695 6.25195 2.4387 4.02841 3.83557 2.78674C4.53837 2.16203 5.54048 1.70608 7.02679 1.41246C8.5185 1.11777 10.4265 1 12.877 1Z" stroke-width="1.5"/>
                                            </svg>
                                        </span>
                                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">{{ $t('articles.show.comments') }}</h2>
                                    </div>
                                    <button
                                        v-if="isLoggedin"
                                        type="button"
                                        @click="$refs.commentsList?.commentForm(null, $event)"
                                        class="group border justify-center w-full sm:w-max border-yellow-400 bg-yellow-400 text-sm focus:ring-2 ring-yellow-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 text-gray-800 px-3 h-10 rounded-lg inline-flex items-center font-semibold transition duration-200 self-end sm:self-auto">
                                        {{ $t('comments.addNew') }}
                                        <svg class="ms-1" width="25" height="25" viewBox="0 0 25 25" fill="none"><path stroke="currentColor" opacity="0.5" d="M4.75 12.5C4.75 14.2328 4.84383 15.5741 5.07592 16.6184C5.30612 17.6543 5.66226 18.3514 6.15542 18.8446C6.64859 19.3377 7.34575 19.6939 8.38157 19.9241C9.4259 20.1562 10.7672 20.25 12.5 20.25C14.2328 20.25 15.5741 20.1562 16.6184 19.9241C17.6543 19.6939 18.3514 19.3377 18.8446 18.8446C19.3377 18.3514 19.6939 17.6543 19.9241 16.6184C20.1562 15.5741 20.25 14.2328 20.25 12.5C20.25 10.7672 20.1562 9.4259 19.9241 8.38157C19.6939 7.34575 19.3377 6.64859 18.8446 6.15542C18.3514 5.66226 17.6543 5.30613 16.6184 5.07592C15.5741 4.84383 14.2328 4.75 12.5 4.75C10.7672 4.75 9.4259 4.84383 8.38157 5.07592C7.34575 5.30613 6.64859 5.66226 6.15542 6.15542C5.66226 6.64859 5.30612 7.34575 5.07592 8.38157C4.84383 9.4259 4.75 10.7672 4.75 12.5Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path stroke="currentColor" d="M9.66699 12.4997H12.5003M15.3337 12.4997H12.5003M12.5003 12.4997V9.66634V15.333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </button>
                                </div>
                                <CommentsList ref="commentsList" v-if="article" type="article" :id="article.id" hide-title hide-add-button />
                            </div>
                        </section>
                    </div>

                    <!-- Sidebar (left in RTL) -->
                    <ArticleShowSidebar
                        :author="author"
                        :related="related"
                        :related-courses="relatedCourses"
                        :related-questions="relatedQuestions"
                        :toc-items="tocItems"
                        :is-loggedin="isLoggedin"
                        :current-user-id="currentUser?.id"
                        :follow-loading="followLoading"
                        @toggle-follow="toggleFollowAuthor"
                        @navigate-toc="scrollToHeading" />
                </div>
            </section>
        </div>

        <BottomSheetDrawer v-model="isOpenReportModal" :initialHeight="0.7" :maxHeight="0.8" :minHeight="0.6" :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true" :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:w-[40rem] lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'" :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'" :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="relative w-full max-h-full">
                <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" viewBox="0 0 20 20" fill="none">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 class="mb-2 text-start text-base font-bold text-gray-500 dark:text-gray-200">{{ $t('discuss.common.reportTitle') }}</h3>
                <div class="flex flex-col space-y-2 my-3">
                    <div class="flex flex-col space-y-2 text-sm text-start text-gray-700 dark:text-gray-400">
                        <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                            <input id="article-report-spam" v-model="report" type="radio" class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" value="spam">
                            <label for="article-report-spam" class="ms-1.5">{{ $t('discuss.common.reportSpamBefore') }} <span class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportSpamHighlight') }}</span> {{ $t('discuss.common.reportSpamAfter') }}</label>
                        </div>
                        <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                            <input id="article-report-offensive" v-model="report" type="radio" class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" value="offensive-writing">
                            <label for="article-report-offensive" class="ms-1.5">{{ $t('discuss.common.reportOffensiveBefore') }} <span class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportOffensiveHighlight') }}</span> {{ $t('discuss.common.reportOffensiveAfter') }}</label>
                        </div>
                        <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                            <input id="article-report-rules" v-model="report" type="radio" class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" value="violation-of-rules">
                            <label for="article-report-rules" class="ms-1.5">{{ $t('discuss.common.reportRulesBefore') }} <span class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportRulesHighlight') }}</span> {{ $t('discuss.common.reportRulesAfter') }}</label>
                        </div>
                        <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                            <input id="article-report-other" v-model="report" type="radio" class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" value="other">
                            <label for="article-report-other" class="ms-1.5">{{ $t('discuss.common.reportOther') }}</label>
                        </div>
                    </div>
                    <span v-if="reportErrors?.report" class="mt-2 text-red-500 text-xs font-semibold">{{ reportErrors.report[0] }}</span>
                </div>
                <div class="flex justify-start items-center space-x-4 rtl:space-x-reverse">
                    <button type="button" @click="closeReportModal" class="h-9 py-2 px-3 text-sm font-semibold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">{{ $t('discuss.common.cancel') }}</button>
                    <button type="button" @click="sendReport" :disabled="reportLoading" class="w-32 h-9 py-2 px-3 text-sm font-semibold text-center text-white bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 disabled:opacity-60">
                        <svg v-if="reportLoading" class="w-4 h-4 m-auto animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        <span v-else>{{ $t('discuss.common.reportTitle') }}</span>
                    </button>
                </div>
            </div>
        </BottomSheetDrawer>
    </MasterPage>
</template>

<script>
import MasterPage from "@/views/page/discuss/layouts/MasterPage.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import CommentsList from "@/views/components/home/CommentsList.vue";
import ArticleShowSidebar from "@/views/components/articles/ArticleShowSidebar.vue";
import ArticleShowLoading from "@/views/components/articles/ArticleShowLoading.vue";
import ArticleRating from "@/views/components/articles/ArticleRating.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import TagChip from "@/views/components/tag/TagChip.vue";
import { articleService } from "@/services/article.service";
import { useSEO, generateArticleSchema, generateBreadcrumbSchema } from "@/composables/useSEO";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import { emptyCourseRatings } from "@/utils/courseDisplay";
import axiosInstance from "@/store/axiosInstance";
import { useClipboard } from "@vueuse/core";
import { toast } from "vue3-toastify";
import moment from "moment";

function applyArticleBootstrap(vm, payload) {
    if (!payload?.show?.article) return false;
    vm.article = payload.show.article;
    vm.author = payload.show.article.author;
    vm.articleRatings = payload.show.article.ratings || emptyCourseRatings();
    vm.userHasLiked = vm.article.user_has_liked;
    vm.likesCount = vm.article.likes_count || 0;
    vm.related = payload.related?.articles || [];
    vm.relatedCourses = payload.related?.courses || [];
    vm.relatedQuestions = payload.related?.questions || [];
    vm.previous = payload.nav?.previous || null;
    vm.next = payload.nav?.next || null;
    vm.loading = false;
    return true;
}

export default {
    components: { MasterPage, MarkdownRenderer, CommentsList, ArticleShowSidebar, ArticleShowLoading, ArticleRating, BottomSheetDrawer, TagChip, SeoImage },
    data() {
        return {
            article: null,
            author: null,
            related: [],
            relatedCourses: [],
            relatedQuestions: [],
            previous: null,
            next: null,
            loading: true,
            likeLoading: false,
            followLoading: false,
            bookmarkLoading: false,
            userHasLiked: false,
            likesCount: 0,
            tocItems: [],
            isOpenReportModal: false,
            report: null,
            reportLoading: false,
            reportErrors: null,
            coursePosterErrors: {},
            coverImageError: false,
            linkCopied: false,
            linkCopiedTimer: null,
            readingProgress: 0,
            scrollRafId: null,
            articleRatings: emptyCourseRatings(),
        };
    },
    computed: {
        articleSlug() {
            return this.$route.params.articleSlug;
        },
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
        shareUrl() {
            if (typeof window === "undefined") return "";
            return window.location.href;
        },
        authorName() {
            if (!this.author?.user) return "";
            return `${this.author.user.first_name || ""} ${this.author.user.last_name || ""}`.trim();
        },
    },
    watch: {
        "$route.params.articleSlug"(slug, prev) {
            if (prev === undefined) return;
            if (slug === prev) return;
            this.loadArticle();
        },
    },
    created() {
        const payload = useNuxtData(`article-show-${this.$route.params.articleSlug}`).data.value;
        if (applyArticleBootstrap(this, payload)) {
            this.applySeo();
        } else {
            this.loadArticle();
        }
    },
    mounted() {
        window.addEventListener("scroll", this.onScroll, { passive: true });
        window.addEventListener("resize", this.onScroll, { passive: true });
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.onScroll);
        window.removeEventListener("resize", this.onScroll);
        if (this.scrollRafId) cancelAnimationFrame(this.scrollRafId);
        if (this.linkCopiedTimer) clearTimeout(this.linkCopiedTimer);
    },
    methods: {
        onScroll() {
            if (this.scrollRafId) return;
            this.scrollRafId = requestAnimationFrame(() => {
                this.scrollRafId = null;
                this.updateReadingProgress();
            });
        },
        updateReadingProgress() {
            const el = this.$refs.contentRef;
            if (!el || !this.article) {
                this.readingProgress = 0;
                return;
            }
            const rect = el.getBoundingClientRect();
            const viewport = window.innerHeight;
            const contentTop = rect.top + window.scrollY;
            const contentHeight = el.offsetHeight;
            const start = contentTop - viewport * 0.15;
            const end = contentTop + contentHeight - viewport * 0.35;
            const scrollY = window.scrollY;
            if (end <= start) {
                this.readingProgress = scrollY >= contentTop ? 100 : 0;
                return;
            }
            if (scrollY <= start) {
                this.readingProgress = 0;
            } else if (scrollY >= end) {
                this.readingProgress = 100;
            } else {
                this.readingProgress = ((scrollY - start) / (end - start)) * 100;
            }
        },
        async loadArticle() {
            this.readingProgress = 0;
            this.loading = true;
            try {
                const [showRes, relatedRes, navRes] = await Promise.all([
                    articleService.show(this.articleSlug),
                    articleService.related(this.articleSlug, { limit: 12 }),
                    articleService.prevNext(this.articleSlug),
                ]);
                this.article = showRes.data.article;
                this.author = showRes.data.article.author;
                this.articleRatings = showRes.data.article.ratings || emptyCourseRatings();
                this.userHasLiked = this.article.user_has_liked;
                this.likesCount = this.article.likes_count || 0;
                this.related = relatedRes.data.articles || [];
                this.relatedCourses = relatedRes.data.courses || [];
                this.relatedQuestions = relatedRes.data.questions || [];
                this.coursePosterErrors = {};
                this.coverImageError = false;
                this.linkCopied = false;
                if (this.linkCopiedTimer) clearTimeout(this.linkCopiedTimer);
                this.linkCopiedTimer = null;
                this.previous = navRes.data.previous;
                this.next = navRes.data.next;
                this.applySeo();
            } catch {
                this.article = null;
            } finally {
                this.loading = false;
                this.$nextTick(() => {
                    this.$nextTick(() => {
                        this.syncTocFromDom();
                        this.updateReadingProgress();
                    });
                });
            }
        },
        syncTocFromDom() {
            const contentEl = this.$refs.contentRef;
            if (!contentEl || !this.article?.content) {
                this.tocItems = [];
                return;
            }
            const items = [];
            contentEl.querySelectorAll("h2, h3, h4").forEach((el) => {
                const text = el.textContent?.trim();
                if (!text) return;
                let id = el.getAttribute("id");
                if (!id) {
                    id = text
                        .replace(/\s+/g, "-")
                        .replace(/[^\w\u0600-\u06FF-]/g, "")
                        .toLowerCase();
                    el.id = id;
                }
                items.push({ id, text, level: parseInt(el.tagName.slice(1), 10) });
            });
            this.tocItems = items;
        },
        scrollToHeading(id) {
            const contentEl = this.$refs.contentRef;
            if (!contentEl) return;

            let el = document.getElementById(id);
            if (!el || !contentEl.contains(el)) {
                const item = this.tocItems.find((entry) => entry.id === id);
                if (item) {
                    el = [...contentEl.querySelectorAll("h2, h3, h4")].find(
                        (heading) => heading.textContent?.trim() === item.text
                    );
                }
            }
            if (!el) return;

            const headerOffset = 96;
            const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        },
        applySeo() {
            if (!this.article) return;
            const pathCanonical = `/article/${this.article.slug}`;
            // Always canonicalize to /article/{slug} to avoid duplicate index variants
            const canonical = pathCanonical;
            const title = this.article.seo_title || this.article.title;
            const description =
                this.article.seo_description ||
                this.article.excerpt ||
                `${this.article.title} — آموزش و مقاله برنامه‌نویسی در زنبورک`;
            const articleSchema = generateArticleSchema(this.article);
            const breadcrumb = generateBreadcrumbSchema([
                { name: "خانه", url: "/" },
                { name: this.$t("articles.list.title"), url: "/articles" },
                ...(this.article.category?.title
                    ? [{ name: this.article.category.title, url: `/articles?category=${this.article.category.slug || ""}` }]
                    : []),
                { name: this.article.title, url: pathCanonical },
            ]);
            useSEO({
                title,
                description,
                image: this.article.og_image || this.article.cover_image,
                url: pathCanonical,
                canonical,
                type: "article",
                publishedTime: this.article.published_at,
                modifiedTime: this.article.updated_at,
                articleAuthor: this.authorName,
                articleSection: this.article.category?.title || this.$t("articles.seo.section"),
                articleTags: (this.article.tags || []).map((t) => t.name),
                imageAlt: this.article.title,
                keywords: [
                    this.article.title,
                    ...(this.article.tags || []).map((t) => t.name),
                    "آموزش برنامه‌نویسی",
                    "مقاله",
                ].filter(Boolean),
                schema: [articleSchema, breadcrumb].filter(Boolean),
            });
        },
        timeAgo(date) {
            moment.locale("fa");
            return moment(date).fromNow();
        },
        async toggleLike() {
            this.likeLoading = true;
            try {
                const res = await axiosInstance.post("/toggleLike", { likeable_id: this.article.id, likeable_type: "Article" });
                this.userHasLiked = res.data.user_has_liked;
                this.likesCount = res.data.likes_count;
            } finally {
                this.likeLoading = false;
            }
        },
        async toggleBookmark() {
            this.bookmarkLoading = true;
            try {
                const res = await axiosInstance.post("/toggleBookmark", { bookmarkable_id: this.article.id, bookmarkable_type: "Article" });
                this.article.bookmarked = res.data.bookmarked;
            } finally {
                this.bookmarkLoading = false;
            }
        },
        async toggleFollowAuthor() {
            if (!this.author?.user || this.followLoading) return;
            this.followLoading = true;
            try {
                await axiosInstance.post("/toggleFollow", { followable_id: this.author.user.id, followable_type: "User" });
                this.author.is_following = !this.author.is_following;
            } finally {
                this.followLoading = false;
            }
        },
        async copyLink() {
            const { copy, isSupported } = useClipboard();
            if (isSupported) await copy(this.shareUrl);
            this.linkCopied = true;
            if (this.linkCopiedTimer) clearTimeout(this.linkCopiedTimer);
            this.linkCopiedTimer = setTimeout(() => {
                this.linkCopied = false;
                this.linkCopiedTimer = null;
            }, 2500);
        },
        openReportModal() { this.isOpenReportModal = true; },
        closeReportModal() { this.isOpenReportModal = false; this.report = null; this.reportErrors = null; },
        async sendReport() {
            if (!this.report || !this.article) return;
            this.reportLoading = true;
            this.reportErrors = null;
            try {
                await axiosInstance.post("/sendReport", {
                    reportable_id: this.article.id,
                    reportable_type: "Article",
                    report: this.report,
                });
                toast.success(this.$t("discuss.common.reportSuccess") || "گزارش ثبت شد", {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") === "rtl",
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                this.closeReportModal();
            } catch (error) {
                this.reportErrors = error.response?.data?.errors || null;
                if (!this.reportErrors) {
                    toast.error(error.response?.data?.message || "خطا");
                }
            } finally {
                this.reportLoading = false;
            }
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
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4) {
    scroll-margin-top: 6rem;
}
</style>
