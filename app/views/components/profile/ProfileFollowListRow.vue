<template>
    <div class="flex items-center justify-between gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <router-link
            :to="{ name: 'profile-page', params: { username: listUser.username } }"
            class="flex items-center gap-3 min-w-0 flex-1"
            @click="$emit('navigate')"
        >
            <div class="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                <img
                    onerror="this.style.display='none'"
                    class="w-full h-full object-cover"
                    :src="listUser.profile_pic"
                    :alt="listUser.username"
                />
            </div>
            <div class="min-w-0 text-start">
                <p class="font-semibold text-sm text-gray-900 dark:text-gray-50 truncate">
                    {{ listUser.first_name }} {{ listUser.last_name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate text-start">
                    <span dir="ltr" class="w-max">@{{ listUser.username }}</span>
                </p>
            </div>
        </router-link>

        <button
            v-if="showFollowButton"
            type="button"
            :disabled="followLoading"
            @click="toggleFollow"
            class="shrink-0 px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            :class="
                listUser.hasFlollow
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                    : 'bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900'
            "
        >
            <svg
                v-if="followLoading"
                class="w-4 h-4 mx-auto animate-spin text-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <span v-else>{{ listUser.hasFlollow ? $t('profile.common.unfollow') : $t('profile.common.follow') }}</span>
        </button>
    </div>
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    props: {
        user: {
            type: Object,
            required: true,
        },
        isLoggedIn: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["navigate", "follow-changed"],
    data() {
        return {
            listUser: { ...this.user },
            followLoading: false,
        };
    },
    computed: {
        showFollowButton() {
            return !this.listUser.is_self;
        },
    },
    watch: {
        user: {
            deep: true,
            handler(newUser) {
                this.listUser = { ...newUser };
            },
        },
    },
    methods: {
        async toggleFollow() {
            if (!this.isLoggedIn) {
                toast.warning(this.$t("profile.toast.followLoginRequired"), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl",
                    bodyClassName: "font-YekanBakh text-gray-800",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }

            this.followLoading = true;
            try {
                const response = await axiosInstance.post("/toggleFollow", {
                    followable_id: this.listUser.id,
                    followable_type: "User",
                });
                this.listUser.hasFlollow = response.data.hasFlollow;
                this.$emit("follow-changed", {
                    userId: this.listUser.id,
                    hasFlollow: response.data.hasFlollow,
                });
            } catch (error) {
                if (error.response?.status === 403) {
                    if (error.response.data.errorType === "login") {
                        toast.warning(this.$t("profile.toast.followLoginRequired"), {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl",
                            bodyClassName: "font-YekanBakh text-gray-800",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    } else if (error.response.data.errorType === "yourself") {
                        toast.error(this.$t("profile.toast.cannotFollowSelf"), {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl",
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    }
                }
            } finally {
                this.followLoading = false;
            }
        },
    },
};
</script>
