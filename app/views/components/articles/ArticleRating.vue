<template>
    <div class="px-5 py-4 flex items-center justify-between rounded-xl bg-white/55 dark:bg-gray-800/35 backdrop-blur-sm border border-white/70 dark:border-gray-700/50 shadow-sm shadow-blue-500/5 sm:flex-row flex-col gap-4">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0 mb-2">
            {{ $t('articles.show.ratePrompt') }}
        </p>

        <div class="flex rtl:space-x-reverse space-x-2 items-center">
            <div class="relative">
                <span dir="ltr" class="flex w-full whitespace-nowrap text-gray-300 dark:text-gray-500 relative z-10">
                    <button
                        v-for="star in 5"
                        :key="star"
                        type="button"
                        :disabled="rateLoading"
                        class="cursor-pointer relative disabled:opacity-50"
                        :class="{ '!text-yellow-300': hoverRate >= star || displayRate >= star }"
                        @click.prevent="setRate(star)"
                        @mouseover="hoverRate = star"
                        @mouseout="hoverRate = 0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <div
                            v-show="hoverRate === star"
                            class="absolute text-xs bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold whitespace-nowrap z-20">
                            {{ rateLabels[star] }}
                        </div>
                    </button>
                </span>
            </div>
            <div v-if="localRatings.countOfAll" class="font-bold text-gray-400 dark:text-gray-500 text-sm whitespace-nowrap">
                {{ $t('articles.show.rateSummary', { average: formattedAverage, count: localRatings.countOfAll }) }}
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import { emptyCourseRatings } from "@/utils/courseDisplay";

export default {
    props: {
        articleId: { type: Number, required: true },
        ratings: { type: Object, default: () => emptyCourseRatings() },
        isLoggedIn: { type: Boolean, default: false },
    },
    emits: ["rated"],
    data() {
        return {
            localRatings: { ...emptyCourseRatings(), ...this.ratings },
            hoverRate: 0,
            rateLoading: false,
        };
    },
    computed: {
        displayRate() {
            if (this.hoverRate) return this.hoverRate;
            if (this.localRatings.currentUserRate?.rating) return this.localRatings.currentUserRate.rating;
            return Math.round(this.localRatings.averageRating || 0);
        },
        formattedAverage() {
            const avg = Number(this.localRatings.averageRating || 0);
            return avg ? avg.toFixed(1) : "0";
        },
        rateLabels() {
            return {
                1: this.$t("course.sidebar.rateVeryBad"),
                2: this.$t("course.sidebar.rateBad"),
                3: this.$t("course.sidebar.rateAverage"),
                4: this.$t("course.sidebar.rateGood"),
                5: this.$t("course.sidebar.rateExcellent"),
            };
        },
    },
    watch: {
        ratings: {
            deep: true,
            handler(value) {
                this.localRatings = { ...emptyCourseRatings(), ...value };
            },
        },
    },
    methods: {
        toastOptions(type = "warning") {
            return {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") === "rtl",
                bodyClassName: type === "success" ? "font-YekanBakh text-white" : "font-YekanBakh text-gray-800",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            };
        },
        async setRate(value) {
            if (!this.isLoggedIn) {
                toast.warning(this.$t("course.sidebar.loginToRate"), this.toastOptions());
                return;
            }
            if (this.localRatings.currentUserRate) {
                toast.warning(this.$t("course.sidebar.alreadyRated"), this.toastOptions());
                return;
            }

            this.rateLoading = true;
            try {
                const response = await axiosInstance.post("/setRate", {
                    rateable_id: this.articleId,
                    rateable_type: "Article",
                    rating: value,
                });
                this.localRatings = response.data.ratings;
                this.$emit("rated", this.localRatings);
                toast.success(this.$t("course.sidebar.rateSuccess"), this.toastOptions("success"));
            } catch (error) {
                const status = error.response?.status;
                if (status === 409) {
                    toast.warning(this.$t("course.sidebar.rateAlreadyRegistered"), this.toastOptions());
                } else {
                    toast.error(error.response?.data?.message || this.$t("common.error"), this.toastOptions());
                }
            } finally {
                this.rateLoading = false;
            }
        },
    },
};
</script>
