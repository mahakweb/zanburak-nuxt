<template>
    <div class="relative group/tag inline-flex" @mouseenter="onEnter" @mouseleave="onLeave">
        <router-link
            :to="{ name: 'tag-show', params: { tagSlug: tagSlug } }"
            :class="chipClass"
            class="rounded-lg text-xs font-semibold px-2.5 h-7 align-middle items-center justify-center flex transition duration-200 border shadow-sm"
            @click="$emit('navigate')">
            # {{ tag.name }}
        </router-link>

        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1">
            <div
                v-if="showPopover"
                :class="popoverWrapperClass"
                @mouseenter="onEnter"
                @mouseleave="onLeave">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-3.5">
                    <div class="flex items-center justify-between gap-3">
                        <router-link
                            :to="{ name: 'tag-show', params: { tagSlug: tagSlug } }"
                            class="text-gray-800 dark:text-white font-bold text-sm line-clamp-1 hover:text-amber-500 transition"
                            @click="$emit('navigate')">
                            # {{ tag.name }}
                        </router-link>
                        <button
                            v-if="isLoggedin"
                            @click.prevent.stop="toggleFollow"
                            :disabled="followLoading"
                            :class="followActionClass">
                            <span v-if="followLoading" class="inline-flex items-center justify-center">
                                <svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            </span>
                            <span v-else>{{ localFollowing ? $t('tags.unfollow') : $t('tags.follow') }}</span>
                        </button>
                        <router-link
                            v-else
                            :to="{ name: 'login', query: { redirect: $route.fullPath } }"
                            @click.stop
                            :class="followActionClass">
                            {{ $t('tags.follow') }}
                        </router-link>
                    </div>
                </div>
                <svg
                    v-if="popoverOnTop"
                    class="w-5 h-4 absolute text-white dark:text-gray-800 -mt-px start-4 drop-shadow-sm"
                    viewBox="0 0 44 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.5981 36.5C23.4434 38.5 20.5566 38.5 19.4019 36.5L1.21539 5C0.060688 3 1.50407 0.5 3.81347 0.5L40.1865 0.5C42.4959 0.5 43.9393 3 42.7846 5L24.5981 36.5Z" fill="currentColor" />
                </svg>
                <svg
                    v-else
                    class="w-5 h-4 absolute text-white dark:text-gray-800 -top-px start-4 drop-shadow-sm rotate-180"
                    viewBox="0 0 44 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.5981 36.5C23.4434 38.5 20.5566 38.5 19.4019 36.5L1.21539 5C0.060688 3 1.50407 0.5 3.81347 0.5L40.1865 0.5C42.4959 0.5 43.9393 3 42.7846 5L24.5981 36.5Z" fill="currentColor" />
                </svg>
            </div>
        </Transition>
    </div>
</template>

<script>
import { tagService } from "@/services/tag.service";
import { toast } from "vue3-toastify";

const SIDEBAR_PALETTES = [
    "bg-amber-400/15 text-amber-800 dark:text-amber-300 border-amber-400/30 ring-1 ring-amber-400/20 hover:bg-amber-400/25 hover:border-amber-400/50 hover:ring-amber-400/40 hover:shadow-amber-200/40 dark:hover:shadow-amber-900/30",
    "bg-blue-400/12 text-blue-800 dark:text-blue-300 border-blue-400/25 ring-1 ring-blue-400/15 hover:bg-blue-400/20 hover:border-blue-400/45 hover:ring-blue-400/35 hover:shadow-blue-200/40 dark:hover:shadow-blue-900/30",
    "bg-emerald-400/12 text-emerald-800 dark:text-emerald-300 border-emerald-400/25 ring-1 ring-emerald-400/15 hover:bg-emerald-400/20 hover:border-emerald-400/45 hover:ring-emerald-400/35 hover:shadow-emerald-200/40 dark:hover:shadow-emerald-900/30",
    "bg-violet-400/12 text-violet-800 dark:text-violet-300 border-violet-400/25 ring-1 ring-violet-400/15 hover:bg-violet-400/20 hover:border-violet-400/45 hover:ring-violet-400/35 hover:shadow-violet-200/40 dark:hover:shadow-violet-900/30",
    "bg-rose-400/12 text-rose-800 dark:text-rose-300 border-rose-400/25 ring-1 ring-rose-400/15 hover:bg-rose-400/20 hover:border-rose-400/45 hover:ring-rose-400/35 hover:shadow-rose-200/40 dark:hover:shadow-rose-900/30",
    "bg-sky-400/12 text-sky-800 dark:text-sky-300 border-sky-400/25 ring-1 ring-sky-400/15 hover:bg-sky-400/20 hover:border-sky-400/45 hover:ring-sky-400/35 hover:shadow-sky-200/40 dark:hover:shadow-sky-900/30",
];

export default {
    emits: ["navigate"],
    props: {
        tag: {
            type: Object,
            required: true,
        },
        variant: {
            type: String,
            default: "default",
        },
        colorIndex: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            showPopover: false,
            hideTimer: null,
            followLoading: false,
            localFollowing: this.tag.is_following ?? false,
        };
    },
    computed: {
        tagSlug() {
            return this.tag.slug || this.tag.normalized;
        },
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        popoverOnTop() {
            return this.variant !== "sidebar";
        },
        popoverWrapperClass() {
            const base = "absolute z-[60] start-0 min-w-[14rem] max-w-xs";
            if (this.popoverOnTop) {
                return `${base} bottom-full pb-2`;
            }
            return `${base} top-full pt-2`;
        },
        chipClass() {
            if (this.variant === "sidebar") {
                const idx = ((this.colorIndex % SIDEBAR_PALETTES.length) + SIDEBAR_PALETTES.length) % SIDEBAR_PALETTES.length;
                return SIDEBAR_PALETTES[idx];
            }
            return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200/80 dark:border-gray-700/80 hover:border-amber-400/60 hover:text-amber-700 dark:hover:text-amber-300 hover:shadow-sm";
        },
        followActionClass() {
            return "shrink-0 inline-flex items-center justify-center min-w-[4.75rem] py-1.5 px-3.5 text-center font-bold text-xs rounded-lg bg-amber-400 text-gray-900 hover:bg-amber-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-70 shadow-sm";
        },
    },
    watch: {
        "tag.is_following"(val) {
            this.localFollowing = val ?? false;
        },
    },
    methods: {
        onEnter() {
            clearTimeout(this.hideTimer);
            this.showPopover = true;
        },
        onLeave() {
            this.hideTimer = setTimeout(() => {
                this.showPopover = false;
            }, 120);
        },
        async toggleFollow() {
            this.followLoading = true;
            try {
                const response = await tagService.toggleFollow(this.tag.id);
                this.localFollowing = response.data.hasFlollow;
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
    beforeUnmount() {
        clearTimeout(this.hideTimer);
    },
};
</script>
