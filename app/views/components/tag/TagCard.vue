<template>
    <article class="group flex flex-col rounded-2xl bg-white dark:bg-[#151c2c] border border-gray-100 dark:border-[#1e2a3f] p-4 md:p-5 transition duration-300 hover:border-amber-400/40 dark:hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-400/5 h-full">
        <div class="flex items-start justify-between gap-3 mb-3">
            <router-link
                :to="{ name: 'tag-show', params: { tagSlug: localTag.slug } }"
                class="text-base md:text-lg font-extrabold text-gray-800 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition line-clamp-2 shrink-0">
                # {{ localTag.name }}
            </router-link>

            <div class="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-400 shrink min-w-0">
                <span>{{ $t('tags.articlesCount', { count: localTag.articles_count || 0 }) }}</span>
                <span class="text-gray-300 dark:text-gray-600">|</span>
                <span>{{ $t('tags.questionsCount', { count: localTag.questions_count || 0 }) }}</span>
                <span class="text-gray-300 dark:text-gray-600">|</span>
                <span>{{ $t('tags.coursesCount', { count: localTag.courses_count || 0 }) }}</span>
            </div>
        </div>

        <div class="border-t border-gray-100 dark:border-[#243044] mb-3"></div>

        <div class="mt-auto flex items-center justify-between gap-3">
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                <svg class="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ $t('tags.followersCount', { count: localTag.followers_count || 0 }) }}
            </span>

            <button
                v-if="isLoggedin"
                @click="toggleFollow"
                :disabled="followLoading"
                :class="localFollowing
                    ? 'bg-gray-100/90 dark:bg-white/5 text-gray-600 dark:text-gray-300 ring-1 ring-gray-200/90 dark:ring-white/10 hover:ring-gray-300 dark:hover:ring-white/20 hover:bg-gray-200/80 dark:hover:bg-white/10'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 shadow-md shadow-amber-400/30 hover:shadow-amber-400/40 hover:from-amber-300 hover:to-amber-400'"
                class="group/btn inline-flex items-center gap-1.5 h-9 px-3.5 md:px-4 text-xs md:text-sm font-bold rounded-full transition-all duration-200 disabled:opacity-60 whitespace-nowrap">
                <span v-if="followLoading" class="inline-flex items-center">
                    <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                </span>
                <template v-else>
                    <svg v-if="localFollowing" class="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                    <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                    <span>{{ localFollowing ? $t('tags.unfollow') : $t('tags.follow') }}</span>
                </template>
            </button>
            <router-link
                v-else
                :to="{ name: 'login', query: { redirect: $route.fullPath } }"
                class="inline-flex items-center gap-1.5 h-9 px-3.5 md:px-4 text-xs md:text-sm font-bold rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 shadow-md shadow-amber-400/30 hover:shadow-amber-400/40 hover:from-amber-300 hover:to-amber-400 transition-all whitespace-nowrap">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
                {{ $t('tags.follow') }}
            </router-link>
        </div>
    </article>
</template>

<script>
import { tagService } from "@/services/tag.service";
import { toast } from "vue3-toastify";

export default {
    props: {
        tag: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            localTag: { ...this.tag },
            followLoading: false,
            localFollowing: this.tag.is_following ?? false,
        };
    },
    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
    },
    watch: {
        tag: {
            deep: true,
            handler(val) {
                this.localTag = { ...val };
                this.localFollowing = val.is_following ?? false;
            },
        },
    },
    methods: {
        async toggleFollow() {
            this.followLoading = true;
            try {
                const response = await tagService.toggleFollow(this.localTag.id);
                this.localFollowing = response.data.hasFlollow;
                if (response.data.numberOfFollowers != null) {
                    this.localTag.followers_count = response.data.numberOfFollowers;
                }
                toast.success(
                    this.localFollowing ? this.$t("tags.followSuccess") : this.$t("tags.unfollowSuccess"),
                    {
                        theme: "colored",
                        rtl: localStorage.getItem("direction") === "rtl",
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        position: toast.POSITION.BOTTOM_RIGHT,
                    }
                );
            } catch (error) {
                if (error.response?.data?.errorType === "login") {
                    this.$router.push({ name: "login", query: { redirect: this.$route.fullPath } });
                }
            } finally {
                this.followLoading = false;
            }
        },
    },
};
</script>
