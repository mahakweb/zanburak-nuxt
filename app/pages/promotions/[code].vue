<script setup>
definePageMeta({
  name: "promotion.show",
})
</script>

<template>
    <MasterPage>
        <section class="my-8">
            <div class="mx-auto max-w-screen-xl px-2">
                <div v-if="loading" class="rounded-xl bg-white dark:bg-gray-900 p-8 text-sm text-gray-500 dark:text-gray-400">
                    {{ $t('promo.loading') }}
                </div>
                <div v-else-if="error" class="rounded-xl bg-white dark:bg-gray-900 p-8 text-sm text-rose-500">
                    {{ error }}
                </div>
                <template v-else-if="promotion">
                    <div class="mb-4 flex items-center justify-between gap-3 px-2 lg:px-0">
                        <div>
                            <h3 class="text-lg lg:text-xl font-extrabold text-gray-800 dark:text-gray-50">
                                {{ pageHeading }}
                            </h3>
                            <p class="text-sm font-light text-gray-500 dark:text-gray-400">{{ $t('promo.pageSubtitle') }}</p>
                        </div>
                        <router-link
                            :to="{ name: 'courses' }"
                            class="hidden sm:inline-flex items-center rounded-lg bg-yellow-400 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-opacity-80"
                        >
                            {{ $t('promo.viewCourses') }}
                        </router-link>
                    </div>

                    <div class="rounded-xl bg-white dark:bg-gray-900 p-5 sm:p-8 mb-8">
                        <div class="flex flex-col lg:flex-row lg:items-start gap-6">
                            <div class="min-w-0 flex-1">
                                <p v-if="promotion.is_expired" class="mb-3 inline-flex rounded-md bg-rose-500/10 px-2 py-1 text-xs font-bold text-rose-600">
                                    {{ $t('promo.expired') }}
                                </p>
                                <div v-if="promotion.banner_icon || promotion.banner_description" class="flex items-start gap-3">
                                    <span v-if="promotion.banner_icon" class="text-2xl leading-none mt-0.5" aria-hidden="true">{{ promotion.banner_icon }}</span>
                                    <p v-if="promotion.banner_description" class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                        {{ promotion.banner_description }}
                                    </p>
                                </div>
                                <div class="mt-5 flex flex-wrap items-center gap-2">
                                    <button
                                        v-if="promotion.code"
                                        type="button"
                                        class="inline-flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-bold font-sans text-gray-800 dark:text-gray-100"
                                        @click="copyCode"
                                    >
                                        <span dir="ltr">{{ promotion.code }}</span>
                                        <span class="text-xs font-medium text-gray-500">{{ copied ? $t('promo.copied') : $t('promo.copy') }}</span>
                                    </button>
                                    <span v-if="discountLabel" class="inline-flex rounded-md bg-rose-500/10 px-2 py-1 text-xs font-bold text-rose-600 dark:text-rose-300">
                                        {{ discountLabel }}
                                    </span>
                                </div>
                            </div>
                            <div
                                v-if="promotion.ends_at && !promotion.is_expired"
                                class="shrink-0 rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3"
                            >
                                <p class="mb-2 text-[11px] font-bold text-gray-400">{{ $t('promo.timeLeft') }}</p>
                                <CountdownTimer
                                    :ends-at="promotion.ends_at"
                                    :server-now="promotion.server_now || serverNow"
                                    @expired="promotion.is_expired = true"
                                />
                            </div>
                        </div>
                    </div>

                    <h2 class="text-lg font-extrabold text-gray-800 dark:text-gray-50 mb-4 px-2 lg:px-0">{{ $t('promo.eligibleCourses') }}</h2>
                    <div v-if="courses.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <CourseCard2 v-for="course in courses" :key="course.id" :course="course" />
                    </div>
                    <p v-else class="rounded-xl bg-white dark:bg-gray-900 px-4 py-8 text-sm text-gray-500 dark:text-gray-400 text-center">
                        {{ $t('promo.noCourses') }}
                    </p>
                </template>
            </div>
        </section>
    </MasterPage>
</template>

<script>
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import CourseCard2 from "@/views/components/course/CourseCard2.vue";
import CountdownTimer from "@/views/components/promotion/CountdownTimer.vue";
import axiosInstance from "@/store/axiosInstance";

export default {
    name: "PromotionShow",
    components: { MasterPage, CourseCard2, CountdownTimer },
    data() {
        return {
            loading: true,
            error: "",
            promotion: null,
            courses: [],
            serverNow: null,
            copied: false,
        };
    },
    computed: {
        pageHeading() {
            return this.promotion?.banner_title || this.$t("promo.pageTitle");
        },
        discountLabel() {
            const promo = this.promotion;
            if (!promo) {
                return "";
            }
            if (promo.type === "percent") {
                return `${promo.value}% ${this.$t("course.card.discount")}`;
            }
            if (promo.type === "fixed") {
                return `${Number(promo.value || 0).toLocaleString()} ${this.$t("promo.tomanOff")}`;
            }
            return this.$t("course.card.free");
        },
    },
    watch: {
        "$route.params.code": {
            immediate: true,
            handler() {
                this.load();
            },
        },
    },
    methods: {
        async load() {
            this.loading = true;
            this.error = "";
            try {
                const response = await axiosInstance.get(`/promotions/${this.$route.params.code}`);
                this.promotion = response.data.promotion;
                this.courses = response.data.courses || [];
                this.serverNow = response.data.server_now;
                document.title = this.promotion?.banner_title || this.promotion?.title || this.$t("promo.pageTitle");
            } catch {
                this.error = this.$t("promo.notFound");
            } finally {
                this.loading = false;
            }
        },
        async copyCode() {
            try {
                await navigator.clipboard.writeText(this.promotion?.code || "");
                this.copied = true;
                setTimeout(() => {
                    this.copied = false;
                }, 1800);
            } catch {
                this.copied = false;
            }
        },
    },
};
</script>
