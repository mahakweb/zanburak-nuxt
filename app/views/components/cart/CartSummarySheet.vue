<script setup>
import { computed, ref } from "vue";
import { useStore } from "@/composables/useStore";
import { useI18n } from "vue-i18n";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue"]);

const store = useStore();
const { t } = useI18n();

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const cartItems = computed(() => store.state.cart.cartItems);
const totalCartPrice = computed(() => store.getters["cart/totalCartPrice"]);
const totalDiscount = computed(() => store.getters["cart/totalDiscount"]);
const payableAmount = computed(() => Math.max(0, Number(store.getters["cart/finalPrice"] ?? totalCartPrice.value - totalDiscount.value)));

const removeFromCartLoading = ref({});

function itemPrices(item, fallback = 0) {
    const original = Number(item.original_price ?? item.price ?? fallback ?? 0);
    const current = Number(
        item.current_price ?? item.cart_price ?? Math.max(0, original - Number(item.discount_amount ?? 0))
    );
    return {
        price: current,
        originalPrice: original,
        hasDiscount: !!item.has_discount || (original > 0 && current < original),
    };
}

function teacherName(teacher) {
    if (!teacher) return "";
    return `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.trim();
}

function getItemMeta(item) {
    if (item.type === "course") {
        return {
            title: item.course?.title ?? "",
            prefix: t("cart.coursePrefix"),
            poster: item.course?.poster,
            subtitle: teacherName(item.course?.teacher),
            to: item.course?.slug
                ? { name: "course.show", params: { courseSlug: item.course.slug } }
                : null,
            ...itemPrices(item, item.course?.price ?? 0),
        };
    }

    if (item.type === "path") {
        return {
            title: item.path?.title ?? "",
            prefix: t("cart.pathPrefix"),
            poster: item.path?.poster,
            subtitle: t("cart.pathActivation"),
            to: item.path?.slug
                ? { name: "path.show", params: { pathSlug: item.path.slug } }
                : null,
            ...itemPrices(item, item.path?.price ?? 0),
        };
    }

    if (item.type === "vip") {
        return {
            title: item.vip?.title ?? "",
            prefix: t("cart.vipPrefix"),
            poster: item.vip?.icon,
            subtitle: "",
            to: null,
            isVip: true,
            ...itemPrices(item, item.vip?.price ?? 0),
        };
    }

    return {
        title: "",
        prefix: "",
        poster: null,
        subtitle: "",
        to: null,
        ...itemPrices(item),
    };
}

async function removeFromCart(idForDelete, index) {
    removeFromCartLoading.value[index] = true;

    try {
        await store.dispatch("cart/removeFromCart", idForDelete);
    } catch (error) {
        console.error("Error removing from cart:", error);
    } finally {
        removeFromCartLoading.value[index] = false;
    }
}

function closeSheet() {
    isOpen.value = false;
}
</script>

<template>
    <BottomSheetDrawer
        v-model="isOpen"
        :initialHeight="0.5"
        :maxHeight="0.92"
        :minHeight="0.28"
        :fitContent="true"
        :autoCloseOnMin="true"
        :closeOnBackdrop="true"
        :lockScroll="true"
        backdrop-z-class="z-[2000000010]"
        panel-z-class="z-[2000000020]"
        :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-200/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.22)]'"
        :contentClass="'px-0 pb-0 overflow-hidden'"
        :backdropClass="'bg-gray-900/30 dark:bg-black/45 backdrop-blur-sm'"
    >
        <div class="flex h-full min-h-0 flex-col">
            <!-- Header -->
            <div class="shrink-0 px-4 pb-3 pt-1">
                <div class="flex items-center gap-3">
                    <div class="relative shrink-0">
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <svg class="h-5 w-5" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                                <path
                                    class="fill-current"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M19.1705 14.9551L18.4657 9.27669C18.0363 7.25046 16.8211 6.41663 15.6626 6.41663H6.35407C5.17937 6.41663 3.92365 7.1921 3.55909 9.27669L2.84616 14.9551C2.26286 19.1243 4.40973 20.1666 7.21282 20.1666H14.8119C17.6069 20.1666 19.689 18.6574 19.1705 14.9551ZM8.33901 11.1362C7.89158 11.1362 7.52887 10.7629 7.52887 10.3024C7.52887 9.84187 7.89158 9.46855 8.33901 9.46855C8.78644 9.46855 9.14915 9.84187 9.14915 10.3024C9.14915 10.7629 8.78644 11.1362 8.33901 11.1362ZM12.8353 10.3024C12.8353 10.7629 13.198 11.1362 13.6454 11.1362C14.0928 11.1362 14.4555 10.7629 14.4555 10.3024C14.4555 9.84187 14.0928 9.46855 13.6454 9.46855C13.198 9.46855 12.8353 9.84187 12.8353 10.3024Z"
                                />
                                <path
                                    class="fill-current"
                                    opacity="0.4"
                                    d="M15.5594 6.20972C15.5623 6.28082 15.5486 6.35162 15.5195 6.41658H14.2021C14.1766 6.35053 14.1631 6.28049 14.1622 6.20972C14.1622 4.45201 12.7324 3.0271 10.9686 3.0271C9.20486 3.0271 7.77504 4.45201 7.77504 6.20972C7.78713 6.27815 7.78713 6.34815 7.77504 6.41658H6.42575C6.41367 6.34815 6.41367 6.27815 6.42575 6.20972C6.52827 3.76367 8.54793 1.83325 11.0046 1.83325C13.4612 1.83325 15.4808 3.76367 15.5834 6.20972H15.5594Z"
                                />
                            </svg>
                        </div>
                        <span
                            v-if="cartItems.length > 0"
                            class="absolute -top-1 ltr:-right-1 rtl:-left-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white dark:border-gray-900"
                        >
                            {{ cartItems.length }}
                        </span>
                    </div>

                    <div class="min-w-0 flex-1">
                        <h2 class="truncate text-sm font-bold text-gray-900 dark:text-white">
                            {{ $t("cart.summary") }}
                        </h2>
                        <p class="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                            <template v-if="cartItems.length > 0">
                                {{ cartItems.length.toLocaleString() }} {{ $t("cart.itemsCount") }}
                            </template>
                            <template v-else>
                                {{ $t("cart.empty") }}
                            </template>
                        </p>
                    </div>

                    <button
                        type="button"
                        class="shrink-0 rounded-xl bg-gray-100 p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        @click="closeSheet"
                    >
                        <span class="sr-only">{{ $t("discuss.common.close") }}</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <i class="block h-full w-16 rounded-full bg-yellow-400"></i>
                </div>
            </div>

            <!-- Items -->
            <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-3 custom-scrollbar">
                <div v-if="cartItems.length > 0" class="space-y-1">
                    <article
                        v-for="(item, index) in cartItems"
                        :key="item.id ?? index"
                        class="group bg-gray-50 p-2.5 first:rounded-t-2xl last:rounded-b-2xl dark:bg-gray-800/80"
                    >
                        <template v-for="meta in [getItemMeta(item)]" :key="`${item.id}-${meta.title}`">
                            <div class="flex items-center gap-2.5">
                                <component
                                    :is="meta.to ? 'router-link' : 'div'"
                                    :to="meta.to || undefined"
                                    class="relative h-16 w-[4.75rem] shrink-0 overflow-hidden rounded-md bg-gray-300 dark:bg-gray-600"
                                >
                                    <SeoImage
                                        v-if="meta.poster"
                                        :src="meta.poster"
                                        :alt="meta.title || ''"
                                        :width="76"
                                        :height="64"
                                        sizes-preset="thumb"
                                        img-class="h-full w-full object-cover sepia transition duration-500 group-hover:scale-110 group-hover:sepia-0"
                                    />
                                    <div
                                        v-if="!meta.poster"
                                        class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500"
                                    >
                                        <svg
                                            v-if="meta.isVip"
                                            class="h-5 w-5 text-yellow-400"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 2.8l2.4 4.7 5.2.8-3.8 3.7.9 5.2L12 14.9 7.3 17.2l.9-5.2L4.4 8.3l5.2-.8L12 2.8z" />
                                        </svg>
                                        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" stroke-width="1.6" />
                                            <circle cx="9" cy="10.5" r="1.4" fill="currentColor" />
                                            <path d="M4.5 16.5l4.2-3.6 3.1 2.4 3.4-3.8 4.3 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </component>

                                <div class="min-w-0 flex-1">
                                    <component
                                        :is="meta.to ? 'router-link' : 'p'"
                                        :to="meta.to || undefined"
                                        class="line-clamp-2 text-[13px] font-semibold leading-5 text-gray-800 dark:text-gray-100 font-anjoman"
                                    >
                                        <span v-if="meta.prefix">{{ meta.prefix }} </span>{{ meta.title }}
                                    </component>
                                    <p
                                        v-if="meta.subtitle"
                                        class="mt-1 line-clamp-1 text-[11px] font-semibold text-gray-400 dark:text-gray-400"
                                    >
                                        {{ meta.subtitle }}
                                    </p>
                                </div>

                                <div class="flex shrink-0 items-center gap-1.5">
                                    <div class="flex flex-col items-end">
                                        <span
                                            v-if="meta.hasDiscount && meta.originalPrice > meta.price"
                                            class="text-[11px] font-semibold leading-4 text-gray-400 line-through font-anjoman"
                                        >
                                            {{ Number(meta.originalPrice).toLocaleString() }}
                                        </span>
                                        <span class="flex items-center text-sm font-bold text-gray-800 dark:text-gray-100 font-anjoman">
                                            {{ Number(meta.price).toLocaleString() }}
                                            <span class="ms-0.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500">تومان</span>
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        :disabled="removeFromCartLoading[index]"
                                        class="cursor-pointer rounded-full p-1.5 text-gray-700 transition duration-200 hover:bg-rose-500 hover:text-white disabled:opacity-50 dark:bg-gray-950 dark:text-white dark:hover:bg-rose-500"
                                        :aria-label="$t('cart.itemRemoved')"
                                        @click="removeFromCart(item.id, index)"
                                    >
                                        <svg
                                            v-if="!removeFromCartLoading[index]"
                                            class="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                opacity="0.4"
                                                d="M16.1041 7.89014C16.1041 7.89014 15.6516 13.5026 15.3891 15.8668C15.2641 16.996 14.5666 17.6576 13.4241 17.6785C11.2499 17.7176 9.07326 17.7201 6.89993 17.6743C5.80076 17.6518 5.11493 16.9818 4.99243 15.8726C4.72826 13.4876 4.27826 7.89014 4.27826 7.89014"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M17.2569 5.19975H3.12518"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M14.5339 5.19974C13.8797 5.19974 13.3164 4.73724 13.188 4.0964L12.9855 3.08307C12.8605 2.61557 12.4372 2.29224 11.9547 2.29224H8.42719C7.94469 2.29224 7.52136 2.61557 7.39636 3.08307L7.19386 4.0964C7.06552 4.73724 6.50219 5.19974 5.84802 5.19974"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <svg v-else class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                                            <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </template>
                    </article>
                </div>

                <div v-else class="flex flex-col items-center px-2 py-8 text-center">
                    <div
                        class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    >
                        <svg class="h-7 w-7" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                            <path
                                class="fill-current"
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M19.1705 14.9551L18.4657 9.27669C18.0363 7.25046 16.8211 6.41663 15.6626 6.41663H6.35407C5.17937 6.41663 3.92365 7.1921 3.55909 9.27669L2.84616 14.9551C2.26286 19.1243 4.40973 20.1666 7.21282 20.1666H14.8119C17.6069 20.1666 19.689 18.6574 19.1705 14.9551ZM8.33901 11.1362C7.89158 11.1362 7.52887 10.7629 7.52887 10.3024C7.52887 9.84187 7.89158 9.46855 8.33901 9.46855C8.78644 9.46855 9.14915 9.84187 9.14915 10.3024C9.14915 10.7629 8.78644 11.1362 8.33901 11.1362ZM12.8353 10.3024C12.8353 10.7629 13.198 11.1362 13.6454 11.1362C14.0928 11.1362 14.4555 10.7629 14.4555 10.3024C14.4555 9.84187 14.0928 9.46855 13.6454 9.46855C13.198 9.46855 12.8353 9.84187 12.8353 10.3024Z"
                            />
                            <path
                                class="fill-current"
                                opacity="0.4"
                                d="M15.5594 6.20972C15.5623 6.28082 15.5486 6.35162 15.5195 6.41658H14.2021C14.1766 6.35053 14.1631 6.28049 14.1622 6.20972C14.1622 4.45201 12.7324 3.0271 10.9686 3.0271C9.20486 3.0271 7.77504 4.45201 7.77504 6.20972C7.78713 6.27815 7.78713 6.34815 7.77504 6.41658H6.42575C6.41367 6.34815 6.41367 6.27815 6.42575 6.20972C6.52827 3.76367 8.54793 1.83325 11.0046 1.83325C13.4612 1.83325 15.4808 3.76367 15.5834 6.20972H15.5594Z"
                            />
                        </svg>
                    </div>
                    <p class="text-sm font-bold text-gray-700 dark:text-gray-200">
                        {{ $t("cart.empty") }}
                    </p>
                </div>
            </div>

            <!-- Footer: matches CartPage summary sidebar -->
            <div class="shrink-0 px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-1">
                <div
                    class="relative overflow-hidden rounded-2xl bg-lime-100 p-3 dark:bg-gray-800"
                >
                    <i class="absolute -end-10 -top-8 h-24 w-24 rounded-full bg-gray-500/10">
                        <i class="absolute start-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/10">
                            <i class="absolute start-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/10"></i>
                        </i>
                    </i>

                    <template v-if="cartItems.length > 0">
                        <div
                            v-if="totalDiscount > 0"
                            class="relative mb-2 flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400"
                        >
                            <span>{{ $t("cart.discountColon") }}</span>
                            <span class="font-semibold text-green-600 dark:text-green-400 font-anjoman">
                                {{ totalDiscount.toLocaleString() }}
                                <span class="ms-0.5 text-[10px] font-medium">تومان</span>
                            </span>
                        </div>

                        <div class="relative mb-3 flex items-center justify-between gap-3 text-sm font-bold text-gray-800 dark:text-gray-100">
                            <span>{{ $t("cart.payable") }}</span>
                            <span class="flex items-center font-anjoman">
                                {{ payableAmount.toLocaleString() }}
                                <span class="ms-1 text-xs font-semibold text-gray-500 dark:text-gray-400">تومان</span>
                            </span>
                        </div>

                        <router-link
                            :to="{ name: 'cart' }"
                            class="group relative inline-flex h-[calc(48px+8px)] w-full items-center justify-center rounded-full bg-neutral-950 py-1 ps-6 pe-14 font-medium text-neutral-50"
                            @click="closeSheet"
                        >
                            <span class="z-10 pe-2 text-sm">{{ $t("cart.continueCheckout") }}</span>
                            <div
                                class="absolute end-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-neutral-700/60 transition-[width] group-hover:w-[calc(100%-8px)]"
                            >
                                <div class="me-3.5 flex items-center justify-center">
                                    <svg
                                        class="h-5 w-5 text-neutral-50 rtl:rotate-180"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                                            fill="currentColor"
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </router-link>
                    </template>

                    <router-link
                        v-else
                        :to="{ name: 'courses' }"
                        class="relative flex w-full items-center justify-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-opacity-80"
                        @click="closeSheet"
                    >
                        {{ $t("nav.browseCourses") }}
                    </router-link>
                </div>
            </div>
        </div>
    </BottomSheetDrawer>
</template>
