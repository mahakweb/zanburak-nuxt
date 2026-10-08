<template>
    <div v-if="visiblePromotion" class="relative z-30">
        <div class="bg-gradient-to-l from-amber-400 via-yellow-400 to-orange-400 text-slate-900">
            <div class="mx-auto max-w-screen-xl px-3 sm:px-4 py-2.5">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                    <div class="flex items-start sm:items-center gap-2 min-w-0 flex-1">
                        <span v-if="visiblePromotion.banner_icon" class="hidden sm:inline text-lg" aria-hidden="true">{{ visiblePromotion.banner_icon }}</span>
                        <div class="min-w-0">
                            <div v-if="visiblePromotion.banner_title || discountLabel" class="flex flex-wrap items-center gap-2">
                                <p v-if="visiblePromotion.banner_title" class="font-bold text-sm sm:text-[15px] leading-snug line-clamp-2">
                                    {{ visiblePromotion.banner_title }}
                                </p>
                                <span
                                    v-if="discountLabel"
                                    class="inline-flex rounded-full bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-yellow-300"
                                >
                                    {{ discountLabel }}
                                </span>
                            </div>
                            <p
                                v-if="visiblePromotion.banner_description"
                                class="mt-0.5 text-[11px] sm:text-xs text-slate-800/80 line-clamp-1"
                            >
                                {{ visiblePromotion.banner_description }}
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                            v-if="visiblePromotion.code"
                            type="button"
                            class="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold font-sans tracking-wide"
                            :aria-label="$t('promo.copyCode')"
                            @click="copyCode"
                        >
                            <span dir="ltr">{{ visiblePromotion.code }}</span>
                            <span
                                class="inline-flex h-5 w-5 items-center justify-center rounded-full transition"
                                :class="copied ? 'bg-emerald-500 text-white' : 'bg-slate-900/10 text-slate-700'"
                            >
                                <svg v-if="copied" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                    <rect x="9" y="9" width="13" height="13" rx="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            </span>
                        </button>

                        <CountdownTimer
                            v-if="visiblePromotion.ends_at"
                            :ends-at="visiblePromotion.ends_at"
                            :server-now="visiblePromotion.server_now || serverNow"
                            @expired="onExpired"
                        />

                        <a
                            v-if="isExternalCta"
                            :href="ctaHref"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-yellow-300 hover:bg-slate-800"
                        >
                            {{ visiblePromotion.cta_text || $t('promo.viewDetails') }}
                        </a>
                        <router-link
                            v-else
                            :to="ctaTarget"
                            class="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-yellow-300 hover:bg-slate-800"
                        >
                            {{ visiblePromotion.cta_text || $t('promo.viewDetails') }}
                        </router-link>

                        <button
                            type="button"
                            class="p-1 rounded-full hover:bg-black/10"
                            :aria-label="$t('promo.dismiss')"
                            @click="dismiss"
                        >
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import CountdownTimer from "@/views/components/promotion/CountdownTimer.vue";

const STORAGE_PREFIX = "promo_dismissed_";

export default {
    name: "PromotionBanner",
    components: { CountdownTimer },
    data() {
        return {
            promotions: [],
            serverNow: null,
            copied: false,
            expiredIds: {},
        };
    },
    computed: {
        visiblePromotion() {
            return this.promotions.find((promo) => {
                if (this.expiredIds[promo.id]) {
                    return false;
                }
                if (this.isDismissed(promo)) {
                    return false;
                }
                if (promo.ends_at && Date.parse(promo.ends_at) <= Date.now()) {
                    return false;
                }
                return true;
            }) || null;
        },
        discountLabel() {
            const promo = this.visiblePromotion;
            if (!promo) {
                return "";
            }
            if (promo.type === "percent") {
                return `${promo.value}% ${this.$t("course.card.discount")}`;
            }
            if (promo.type === "fixed") {
                return `${Number(promo.value || 0).toLocaleString()} ${this.$t("promo.tomanOff")}`;
            }
            if (promo.type === "free") {
                return this.$t("course.card.free");
            }
            return "";
        },
        ctaTarget() {
            const promo = this.visiblePromotion;
            if (!promo) {
                return { name: "courses" };
            }
            const url = promo.destination_url || `/promotions/${promo.code}`;
            if (url.startsWith("http")) {
                return url;
            }
            return url;
        },
        isExternalCta() {
            return typeof this.ctaTarget === "string" && this.ctaTarget.startsWith("http");
        },
        ctaHref() {
            return this.isExternalCta ? this.ctaTarget : "#";
        },
    },
    mounted() {
        this.loadPromotions();
    },
    methods: {
        async loadPromotions() {
            try {
                const response = await axiosInstance.get("/promotions/active");
                this.serverNow = response.data.server_now || null;
                this.promotions = response.data.promotions || [];
            } catch (error) {
                this.promotions = [];
            }
        },
        dismissKey(promo) {
            return `${STORAGE_PREFIX}${promo.id}_${promo.ends_at || "open"}`;
        },
        isDismissed(promo) {
            try {
                return localStorage.getItem(this.dismissKey(promo)) === "1";
            } catch {
                return false;
            }
        },
        dismiss() {
            const promo = this.visiblePromotion;
            if (!promo) {
                return;
            }
            try {
                localStorage.setItem(this.dismissKey(promo), "1");
            } catch {
                // ignore
            }
            this.expiredIds = { ...this.expiredIds, [promo.id]: true };
        },
        onExpired() {
            const promo = this.visiblePromotion;
            if (promo) {
                this.expiredIds = { ...this.expiredIds, [promo.id]: true };
            }
        },
        async copyCode() {
            const code = this.visiblePromotion?.code;
            if (!code) {
                return;
            }
            try {
                await navigator.clipboard.writeText(code);
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
