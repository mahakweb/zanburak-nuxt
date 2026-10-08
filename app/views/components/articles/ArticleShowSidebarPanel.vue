<template>
    <div
        class="article-show-sidebar-panel relative rounded-xl border border-blue-100/70 dark:border-gray-700/80 shadow-[0_4px_24px_-4px_rgba(59,130,246,0.12)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.35)] pt-8 pb-9 px-5"
        :class="inSheet ? 'border-0 shadow-none pt-4 pb-2 px-1' : ''">
        <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" aria-hidden="true">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-white to-sky-50/90 dark:from-[#111827] dark:via-gray-900 dark:to-[#0f172a]"></div>
            <div class="absolute -top-14 -end-10 w-36 h-36 rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -start-8 w-32 h-32 rounded-full bg-sky-400/15 dark:bg-sky-500/10 blur-3xl"></div>
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.07),transparent_58%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(96,165,250,0.1),transparent_58%)]"></div>
        </div>

        <div class="relative z-10 space-y-7">
            <!-- Author -->
            <div v-if="author?.user" class="rounded-xl bg-white/55 dark:bg-gray-800/35 backdrop-blur-sm border border-white/70 dark:border-gray-700/50 p-4 shadow-sm shadow-blue-500/5">
                <div class="flex items-start gap-3">
                    <router-link
                        :to="{ name: 'profile-page', params: { username: author.user.username } }"
                        class="rounded-full flex-shrink-0 flex ring-2 ring-blue-500/30 overflow-hidden w-14 h-14">
                        <SeoImage
                            :src="author.user.profile_pic"
                            :alt="authorName || 'نویسنده'"
                            :width="56"
                            :height="56"
                            sizes-preset="avatar"
                            img-class="w-full h-full hover:scale-110 transition duration-200 object-cover"
                        />
                    </router-link>
                    <div class="min-w-0 flex-1">
                        <router-link
                            :to="{ name: 'profile-page', params: { username: author.user.username } }"
                            class="text-gray-800 dark:hover:text-blue-400 hover:text-blue-700 dark:text-white transition duration-200 text-base font-bold mb-1 block line-clamp-1">
                            {{ authorName }}
                        </router-link>
                        <p v-if="author.user.info" class="text-gray-500 dark:text-gray-400 font-normal text-xs mb-3 line-clamp-2 leading-5">{{ author.user.info }}</p>
                        <button
                            v-if="isLoggedin && currentUserId !== author.user.id"
                            type="button"
                            :disabled="followLoading"
                            @click="$emit('toggle-follow')"
                            class="inline-flex items-center justify-center gap-1.5 min-w-[6.5rem] font-semibold text-xs text-white dark:hover:text-blue-400 dark:hover:bg-transparent dark:bg-blue-600 bg-blue-700 py-1.5 px-4 rounded-lg border border-blue-700 transition hover:text-blue-700 hover:bg-transparent disabled:opacity-60">
                            <svg v-if="followLoading" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span v-else>{{ author.is_following ? $t('articles.show.unfollowAuthor') : $t('articles.show.followAuthor') }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- TOC -->
            <ArticleToc v-if="tocItems.length" :items="tocItems" @navigate="$emit('navigate-toc', $event)" />

            <!-- Recent by author -->
            <div v-if="author?.recent_articles?.length" class="pt-6 border-t border-blue-100/80 dark:border-gray-700/60">
                <div class="flex items-center mb-4">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/15 rtl:ml-2 ltr:mr-2">
                        <svg class="w-[15px] h-[15px]" viewBox="0 0 20 20" fill="none"><path d="M0.7 10C0.7 12.0428 0.81037 13.6365 1.08778 14.8848C1.36343 16.1251 1.79459 16.9809 2.40685 17.5932C3.0191 18.2054 3.87493 18.6366 5.11522 18.9122C6.36346 19.1896 7.95723 19.3 10 19.3C12.0428 19.3 13.6365 19.1896 14.8848 18.9122C16.1251 18.6366 16.9809 18.2054 17.5931 17.5932C18.2054 16.9809 18.6366 16.1251 18.9122 14.8848C19.1896 13.6365 19.3 12.0428 19.3 10C19.3 7.95723 19.1896 6.36346 18.9122 5.11522C18.6366 3.87493 18.2054 3.01911 17.5931 2.40685C16.9809 1.7946 16.1251 1.36343 14.8848 1.08778C13.6365 0.810369 12.0428 0.700001 10 0.700001C7.95723 0.700001 6.36346 0.810369 5.11522 1.08778C3.87493 1.36343 3.0191 1.7946 2.40685 2.40685C1.79459 3.01911 1.36343 3.87493 1.08778 5.11522C0.81037 6.36346 0.7 7.95723 0.7 10Z" stroke="currentColor" stroke-width="1.4"/><path opacity="0.4" d="M8.3335 5.83337H11.6668" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.8335 10H14.1668" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path opacity="0.4" d="M8.3335 14.1666L11.6668 14.1666" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                    </span>
                    <div>
                        <span class="text-gray-800 dark:text-white text-sm font-bold block">{{ $t('articles.show.recentByAuthor', { count: author.recent_articles.length }) }}</span>
                        <p class="font-normal text-[11px] text-gray-500 dark:text-gray-400">{{ $t('articles.show.recentArticlesDesc') }}</p>
                    </div>
                </div>
                <div class="space-y-2 mb-5">
                    <router-link
                        v-for="item in author.recent_articles"
                        :key="item.id"
                        :to="{ name: 'article-show', params: { articleSlug: item.slug } }"
                        class="group flex items-start gap-2 rounded-lg bg-white/40 dark:bg-gray-800/25 border border-white/60 dark:border-gray-700/40 px-3 py-3 hover:border-blue-300/60 dark:hover:border-blue-500/30 transition">
                        <span class="w-0.5 self-stretch rounded-full bg-blue-500/70 dark:bg-blue-400/70 shrink-0"></span>
                        <div class="min-w-0 flex-1 flex flex-col gap-2">
                            <span class="text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 font-semibold text-xs line-clamp-2 transition">{{ item.title }}</span>
                            <div class="flex items-center justify-end gap-2 flex-wrap">
                                <span class="inline-flex items-center gap-1 min-w-0 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                    <svg class="w-3 h-3 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="1.5"/>
                                        <path d="M20 21C20 17.134 16.4183 14 12 14C7.58172 14 4 17.134 4 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                    <span class="truncate">{{ articleAuthorName(item) }}</span>
                                </span>
                                <span class="inline-flex items-center gap-0.5 shrink-0 text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                    <svg class="w-2.5 h-3 shrink-0 opacity-75" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.60509 1.45136C2.44111 1.61533 2.36357 1.8075 2.33008 2.00642C2.93427 1.89004 3.6854 1.84615 4.61527 1.84615C5.54514 1.84615 6.29627 1.89004 6.90046 2.00642C6.86697 1.8075 6.78942 1.61533 6.62545 1.45136C6.37407 1.19998 5.82701 0.923077 4.61527 0.923077C3.40353 0.923077 2.85647 1.19998 2.60509 1.45136ZM1.95237 0.798643C1.44953 1.30148 1.38477 1.91343 1.3845 2.30521C0.299759 2.83849 -0.000112534 3.92458 -0.000112534 6C-0.000112534 8.07542 0.299759 9.16151 1.3845 9.69479C1.38477 10.0866 1.44953 10.6985 1.95237 11.2014C2.45099 11.7 3.28854 12 4.61527 12C5.942 12 6.77955 11.7 7.27817 11.2014C7.78101 10.6985 7.84577 10.0866 7.84604 9.69479C8.93079 9.16151 9.23066 8.07542 9.23066 6C9.23066 3.92458 8.93079 2.83849 7.84604 2.30521C7.84577 1.91344 7.78101 1.30149 7.27817 0.798644C6.77955 0.300024 5.942 0 4.61527 0C3.28854 0 2.45099 0.300024 1.95237 0.798643ZM6.90046 9.99358C6.29626 10.11 5.54514 10.1538 4.61527 10.1538C3.68541 10.1538 2.93428 10.11 2.33008 9.99358C2.36357 10.1925 2.44111 10.3847 2.60509 10.5486C2.85647 10.8 3.40353 11.0769 4.61527 11.0769C5.82701 11.0769 6.37407 10.8 6.62545 10.5486C6.78943 10.3847 6.86696 10.1925 6.90046 9.99358ZM1.4998 8.67356C1.15669 8.36477 0.922964 7.73297 0.922964 6C0.922964 4.26703 1.15669 3.63523 1.4998 3.32643C1.67362 3.16999 1.9565 3.02236 2.47171 2.91931C2.99245 2.81515 3.68384 2.76923 4.61527 2.76923C5.54671 2.76923 6.2381 2.81515 6.75883 2.91931C7.27405 3.02236 7.55692 3.16999 7.73075 3.32643C8.07385 3.63523 8.30758 4.26703 8.30758 6C8.30758 7.73297 8.07385 8.36477 7.73075 8.67356C7.55692 8.83001 7.27405 8.97764 6.75883 9.08069C6.2381 9.18485 5.54671 9.23077 4.61527 9.23077C3.68384 9.23077 2.99245 9.18485 2.47171 9.08069C1.9565 8.97764 1.67362 8.83001 1.4998 8.67356Z" fill="currentColor"/>
                                        <path d="M4.61548 4.15381C4.61548 4.15381 4.61548 5.07689 4.61548 5.53842C4.61548 5.99996 4.61547 5.99996 5.07702 5.99996C5.53856 5.99996 6.92317 5.99996 6.92317 5.99996" stroke="currentColor" stroke-width="0.923077" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    {{ $t('articles.card.readTime', { min: item.reading_time_minutes || 1 }) }}
                                </span>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div class="flex justify-center">
                    <router-link
                        :to="{ name: 'articles-index' }"
                        class="group inline-flex items-center justify-center text-blue-700 dark:text-blue-400 font-semibold text-xs border border-blue-500/30 dark:border-blue-400/30 py-2 px-4 rounded-lg hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition">
                        {{ $t('articles.show.viewAllArticles') }}
                        <LinkArrowIcon />
                    </router-link>
                </div>
            </div>

            <!-- Related articles -->
            <div v-if="related.length" class="pt-6 border-t border-blue-100/80 dark:border-gray-700/60">
                <div class="flex items-center mb-4">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/15 rtl:ml-2 ltr:mr-2">
                        <svg class="w-[15px] h-[15px]" viewBox="0 0 23 22" fill="none"><path d="M3.7 10C3.7 12.0428 3.81037 13.6365 4.08778 14.8848C4.36343 16.1251 4.79459 16.9809 5.40685 17.5932C6.0191 18.2054 6.87493 18.6366 8.11522 18.9122C9.36346 19.1896 10.9572 19.3 13 19.3C15.0428 19.3 16.6365 19.1896 17.8848 18.9122C19.1251 18.6366 19.9809 18.2054 20.5931 17.5932C21.2054 16.9809 21.6366 16.1251 21.9122 14.8848C22.1896 13.6365 22.3 12.0428 22.3 10C22.3 7.95723 22.1896 6.36346 21.9122 5.11522C21.6366 3.87493 21.2054 3.01911 20.5931 2.40685C19.9809 1.7946 19.1251 1.36343 17.8848 1.08778C16.6365 0.810369 15.0428 0.700001 13 0.700001C10.9572 0.700001 9.36346 0.810369 8.11522 1.08778C6.87493 1.36343 6.0191 1.7946 5.40685 2.40685C4.79459 3.01911 4.36343 3.87493 4.08778 5.11522C3.81037 6.36346 3.7 7.95723 3.7 10Z" stroke="currentColor" stroke-width="1.4"/><path opacity="0.4" d="M11.3335 5.83331H14.6668" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M8.8335 10H17.1668" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path opacity="0.4" d="M11.3335 14.1667L14.6668 14.1667" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                    </span>
                    <div>
                        <span class="text-gray-800 dark:text-white text-sm font-bold block">{{ $t('articles.show.related') }}</span>
                        <p class="font-normal text-[11px] text-gray-500 dark:text-gray-400">{{ $t('articles.show.relatedDesc') }}</p>
                    </div>
                </div>
                <div class="space-y-2">
                    <router-link
                        v-for="item in related.slice(0, 5)"
                        :key="item.id"
                        :to="{ name: 'article-show', params: { articleSlug: item.slug } }"
                        class="group flex items-start gap-2 rounded-lg bg-white/40 dark:bg-gray-800/25 border border-white/60 dark:border-gray-700/40 px-3 py-3 hover:border-emerald-300/60 dark:hover:border-emerald-500/30 transition">
                        <span class="w-0.5 self-stretch rounded-full bg-emerald-500/70 dark:bg-emerald-400/70 shrink-0"></span>
                        <div class="min-w-0 flex-1 flex flex-col gap-2">
                            <span class="text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 font-semibold text-xs line-clamp-2 transition">{{ item.title }}</span>
                            <div class="flex items-center justify-end gap-2 flex-wrap">
                                <span class="inline-flex items-center gap-1 min-w-0 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                    <svg class="w-3 h-3 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="1.5"/>
                                        <path d="M20 21C20 17.134 16.4183 14 12 14C7.58172 14 4 17.134 4 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                    <span class="truncate">{{ articleAuthorName(item) }}</span>
                                </span>
                                <span class="inline-flex items-center gap-0.5 shrink-0 text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                    <svg class="w-2.5 h-3 shrink-0 opacity-75" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.60509 1.45136C2.44111 1.61533 2.36357 1.8075 2.33008 2.00642C2.93427 1.89004 3.6854 1.84615 4.61527 1.84615C5.54514 1.84615 6.29627 1.89004 6.90046 2.00642C6.86697 1.8075 6.78942 1.61533 6.62545 1.45136C6.37407 1.19998 5.82701 0.923077 4.61527 0.923077C3.40353 0.923077 2.85647 1.19998 2.60509 1.45136ZM1.95237 0.798643C1.44953 1.30148 1.38477 1.91343 1.3845 2.30521C0.299759 2.83849 -0.000112534 3.92458 -0.000112534 6C-0.000112534 8.07542 0.299759 9.16151 1.3845 9.69479C1.38477 10.0866 1.44953 10.6985 1.95237 11.2014C2.45099 11.7 3.28854 12 4.61527 12C5.942 12 6.77955 11.7 7.27817 11.2014C7.78101 10.6985 7.84577 10.0866 7.84604 9.69479C8.93079 9.16151 9.23066 8.07542 9.23066 6C9.23066 3.92458 8.93079 2.83849 7.84604 2.30521C7.84577 1.91344 7.78101 1.30149 7.27817 0.798644C6.77955 0.300024 5.942 0 4.61527 0C3.28854 0 2.45099 0.300024 1.95237 0.798643ZM6.90046 9.99358C6.29626 10.11 5.54514 10.1538 4.61527 10.1538C3.68541 10.1538 2.93428 10.11 2.33008 9.99358C2.36357 10.1925 2.44111 10.3847 2.60509 10.5486C2.85647 10.8 3.40353 11.0769 4.61527 11.0769C5.82701 11.0769 6.37407 10.8 6.62545 10.5486C6.78943 10.3847 6.86696 10.1925 6.90046 9.99358ZM1.4998 8.67356C1.15669 8.36477 0.922964 7.73297 0.922964 6C0.922964 4.26703 1.15669 3.63523 1.4998 3.32643C1.67362 3.16999 1.9565 3.02236 2.47171 2.91931C2.99245 2.81515 3.68384 2.76923 4.61527 2.76923C5.54671 2.76923 6.2381 2.81515 6.75883 2.91931C7.27405 3.02236 7.55692 3.16999 7.73075 3.32643C8.07385 3.63523 8.30758 4.26703 8.30758 6C8.30758 7.73297 8.07385 8.36477 7.73075 8.67356C7.55692 8.83001 7.27405 8.97764 6.75883 9.08069C6.2381 9.18485 5.54671 9.23077 4.61527 9.23077C3.68384 9.23077 2.99245 9.18485 2.47171 9.08069C1.9565 8.97764 1.67362 8.83001 1.4998 8.67356Z" fill="currentColor"/>
                                        <path d="M4.61548 4.15381C4.61548 4.15381 4.61548 5.07689 4.61548 5.53842C4.61548 5.99996 4.61547 5.99996 5.07702 5.99996C5.53856 5.99996 6.92317 5.99996 6.92317 5.99996" stroke="currentColor" stroke-width="0.923077" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    {{ $t('articles.card.readTime', { min: item.reading_time_minutes || 1 }) }}
                                </span>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>

            <!-- Tag-related content (courses + questions) -->
            <div v-if="tagRelatedItems.length" class="pt-6 border-t border-blue-100/80 dark:border-gray-700/60">
                <div class="flex items-center mb-4">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/15 rtl:ml-2 ltr:mr-2">
                        <svg class="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none"><path d="M7.5 3H16.5C18 3 19 4 19 5.5V18.5C19 20 18 21 16.5 21H7.5C6 21 5 20 5 18.5V5.5C5 4 6 3 7.5 3Z" stroke="currentColor" stroke-width="1.5"/><path d="M9 8H15M9 12H15M9 16H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 7H5M3 12H5M3 17H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </span>
                    <div>
                        <span class="text-gray-800 dark:text-white text-sm font-bold block">{{ $t('articles.show.tagRelated') }}</span>
                        <p class="font-normal text-[11px] text-gray-500 dark:text-gray-400">{{ $t('articles.show.tagRelatedDesc') }}</p>
                    </div>
                </div>
                <div class="space-y-2">
                    <router-link
                        v-for="item in visibleTagRelatedItems"
                        :key="item.id"
                        :to="tagRelatedLink(item)"
                        class="group flex items-center gap-2.5 rounded-lg bg-white/40 dark:bg-gray-800/25 border border-white/60 dark:border-gray-700/40 px-3 py-2.5 hover:border-violet-300/60 dark:hover:border-violet-500/30 transition">
                        <div
                            v-if="item.type === 'course'"
                            class="w-14 h-10 rounded-md shrink-0 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden bg-gradient-to-br from-violet-100 via-blue-50 to-sky-100 dark:from-gray-800 dark:via-gray-900 dark:to-violet-950/40 flex items-center justify-center">
                            <SeoImage
                                v-if="item.poster && !coursePosterErrors[item.rawId]"
                                :src="item.poster"
                                :alt="item.title || ''"
                                :width="56"
                                :height="40"
                                sizes-preset="thumb"
                                img-class="w-full h-full object-cover"
                                @error="coursePosterErrors[item.rawId] = true"
                            />
                            <svg v-else class="w-4 h-4 text-violet-400/60 dark:text-violet-500/50" viewBox="0 0 24 24" fill="none"><path d="M8.5 2H15.5C17 2 18 3 18 4.5V19.5C18 21 17 22 15.5 22H8.5C7 22 6 21 6 19.5V4.5C6 3 7 2 8.5 2Z" stroke="currentColor" stroke-width="1.5"/><path d="M9 7H15M9 11H15M9 15H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                        </div>
                        <div
                            v-else
                            class="w-11 h-8 rounded-md shrink-0 ring-1 ring-emerald-500/15 bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><path d="M12 3C7.58172 3 4 6.13401 4 10C4 13.866 7.58172 17 12 17C16.4183 17 20 13.866 20 10C20 6.13401 16.4183 3 12 3Z" stroke="currentColor" stroke-width="1.5"/><path d="M8 14C8 14 9.5 17 12 20C14.5 17 16 14 16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                        </div>
                        <div class="min-w-0 flex-1 flex flex-col gap-1">
                            <span class="text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 font-semibold text-xs line-clamp-2 transition">{{ item.title }}</span>
                            <div class="flex items-center justify-between gap-2">
                                <span
                                    class="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                                    :class="item.type === 'course' ? 'text-violet-600 dark:text-violet-400 bg-violet-500/10' : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'">
                                    {{ item.type === 'course' ? $t('articles.show.courseType') : $t('articles.show.questionType') }}
                                </span>
                                <span v-if="item.type === 'question' && item.answersCount != null" class="text-[10px] text-gray-400 dark:text-gray-500 font-medium shrink-0">
                                    {{ item.answersCount }} {{ $t('discuss.common.answers') }}
                                </span>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div v-if="hasMoreTagRelated" class="flex justify-center mt-4">
                    <button
                        type="button"
                        @click="tagRelatedExpanded = !tagRelatedExpanded"
                        class="inline-flex items-center justify-center text-violet-700 dark:text-violet-400 font-semibold text-xs border border-violet-500/30 dark:border-violet-400/30 py-2 px-4 rounded-lg hover:bg-violet-700 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white transition">
                        {{ tagRelatedExpanded ? $t('articles.show.viewLess') : $t('articles.show.viewMore') }} 
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ArticleToc from "@/views/components/articles/ArticleToc.vue";
import LinkArrowIcon from "@/views/components/articles/LinkArrowIcon.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";

export default {
    components: { ArticleToc, LinkArrowIcon, SeoImage },
    props: {
        author: { type: Object, default: null },
        related: { type: Array, default: () => [] },
        relatedCourses: { type: Array, default: () => [] },
        relatedQuestions: { type: Array, default: () => [] },
        tocItems: { type: Array, default: () => [] },
        isLoggedin: { type: Boolean, default: false },
        currentUserId: { type: [Number, String], default: null },
        followLoading: { type: Boolean, default: false },
        inSheet: { type: Boolean, default: false },
    },
    data() {
        return {
            coursePosterErrors: {},
            tagRelatedExpanded: false,
            tagRelatedPreviewLimit: 10,
        };
    },
    emits: ["toggle-follow", "navigate-toc"],
    computed: {
        authorName() {
            if (!this.author?.user) return "";
            return `${this.author.user.first_name || ""} ${this.author.user.last_name || ""}`.trim();
        },
        tagRelatedItems() {
            const courses = (this.relatedCourses || []).map((course) => ({
                type: "course",
                id: `course-${course.id}`,
                rawId: course.id,
                title: course.title,
                slug: course.slug,
                poster: course.poster,
            }));
            const questions = (this.relatedQuestions || []).map((question) => ({
                type: "question",
                id: `question-${question.id}`,
                rawId: question.id,
                title: question.subject,
                slug: question.slug,
                answersCount: question.answers_count,
            }));
            return [...courses, ...questions];
        },
        visibleTagRelatedItems() {
            if (this.tagRelatedExpanded) return this.tagRelatedItems;
            return this.tagRelatedItems.slice(0, this.tagRelatedPreviewLimit);
        },
        hasMoreTagRelated() {
            return this.tagRelatedItems.length > this.tagRelatedPreviewLimit;
        },
    },
    methods: {
        articleAuthorName(item) {
            const user = item?.user;
            if (!user) return "";
            const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
            return name || user.username || "";
        },
        tagRelatedLink(item) {
            if (item.type === "course") {
                return { name: "course.show", params: { courseSlug: item.slug } };
            }
            return { name: "question-show", params: { questionSlug: item.slug } };
        },
    },
};
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
