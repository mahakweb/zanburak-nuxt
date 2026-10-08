<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useStore } from "@/composables/useStore";
import { useRouter } from "vue-router";
import moment from "moment-jalaali";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";

try {
    if (import.meta.client && localStorage.getItem("direction") === "rtl") {
        moment.loadPersian();
    }
} catch {
    /* ignore */
}

defineProps({
    buttonClass: {
        type: String,
        default:
            "relative text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 rounded-full text-sm p-3",
    },
});

const emit = defineEmits(["open"]);

const store = useStore();
const router = useRouter();

const isOpen = ref(false);
const sheetView = ref("list");
const selectedId = ref(null);
const markingAll = ref(false);
const markingRead = ref(false);
const detailNotification = ref(null);

const notifications = computed(() => store.state.notification.unreadItems);
const listLoading = computed(() => store.state.notification.unreadListLoading);
const loadingMore = computed(() => store.state.notification.unreadLoadingMore);
const hasMore = computed(() => store.getters["notification/hasMoreUnreadItems"]);
const unreadCount = computed(() => store.state.notification.unreadNotifications);

const selectedNotification = computed(() => {
    if (!selectedId.value) return null;
    return (
        store.getters["notification/getItemById"](selectedId.value) ||
        (detailNotification.value?.id === selectedId.value ? detailNotification.value : null)
    );
});

const badgeLabel = computed(() => {
    const count = unreadCount.value;
    if (!count) return "";
    return count < 100 ? String(count) : "99+";
});

function formatTime(dateStr) {
    if (!dateStr) return "";
    try {
        return moment(dateStr).fromNow();
    } catch {
        return new Date(dateStr).toLocaleDateString("fa-IR");
    }
}

function formatPanelDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr)
        .toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "2-digit" })
        .replace(/\//g, "-");
}

function formatPanelTime(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr)
        .toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", hour12: true })
        .replace("بعدازظهر", "ب.ظ")
        .replace("قبل‌ازظهر", "ق.ظ");
}

function getNotificationIcon(notification) {
    return notification?.data?.icon || notification?.data?.event_icon || defaultBellIcon;
}

const defaultBellIcon =
    '<svg class="w-4 h-4" viewBox="-2 -1 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fill-current" d="M13.3014 8.50275C12.709 7.81089 12.4397 7.21133 12.4397 6.19274V5.8464C12.4397 4.51905 12.1342 3.66382 11.47 2.8086C10.4463 1.48043 8.72294 0.679932 7.03584 0.679932H6.9641C5.31247 0.679932 3.64311 1.44367 2.60167 2.71793C1.90119 3.59031 1.56023 4.48229 1.56023 5.8464V6.19274C1.56023 7.21133 1.30873 7.81089 0.698539 8.50275C0.249559 9.01245 0.106079 9.66755 0.106079 10.3766C0.106079 11.0864 0.339033 11.7586 0.806552 12.3051C1.41675 12.9602 2.27843 13.3784 3.15866 13.4511C4.43305 13.5965 5.70744 13.6512 7.00038 13.6512C8.2925 13.6512 9.5669 13.5598 10.8421 13.4511C11.7215 13.3784 12.5832 12.9602 13.1934 12.3051C13.6601 11.7586 13.8939 11.0864 13.8939 10.3766C13.8939 9.66755 13.7504 9.01245 13.3014 8.50275"></path></svg>';

function openSheet() {
    isOpen.value = true;
    emit("open");
}

function closeSheet() {
    isOpen.value = false;
}

function resetSheetView() {
    sheetView.value = "list";
    selectedId.value = null;
    detailNotification.value = null;
    markingRead.value = false;
}

const listScrollEl = ref(null);

function checkNeedMoreIfListShort() {
    const el = listScrollEl.value;
    if (!el || listLoading.value || loadingMore.value || !hasMore.value) return;
    if (el.scrollHeight <= el.clientHeight + 80) {
        store.dispatch("notification/loadMoreUnreadFeed");
    }
}

function onListScroll() {
    const el = listScrollEl.value;
    if (!el || listLoading.value || loadingMore.value || !hasMore.value) return;

    const thresholdPx = 80;
    const scrolledToBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - thresholdPx;

    if (scrolledToBottom) {
        store.dispatch("notification/loadMoreUnreadFeed");
    }
}

function openNotificationDetail(notification) {
    selectedId.value = notification.id;
    detailNotification.value = { ...notification };
    sheetView.value = "detail";

    if (!notification.read_at) {
        markingRead.value = true;
        store
            .dispatch("notification/markAsRead", notification.id)
            .then((updated) => {
                if (updated && selectedId.value === notification.id) {
                    detailNotification.value = updated;
                }
            })
            .finally(() => {
                if (selectedId.value === notification.id) {
                    markingRead.value = false;
                }
            });
    }
}

function backToList() {
    sheetView.value = "list";
    selectedId.value = null;
    detailNotification.value = null;
    markingRead.value = false;
}

async function handleMarkAllRead() {
    if (!unreadCount.value || markingAll.value) return;
    markingAll.value = true;
    try {
        await store.dispatch("notification/markAllAsRead");
    } catch (error) {
        console.error("Error marking all as read:", error);
    } finally {
        markingAll.value = false;
    }
}

function goToAllNotifications() {
    closeSheet();
    router.push({ name: "panel-notifications" });
}

function openActionUrl() {
    const actionUrl = selectedNotification.value?.data?.action_url;
    if (!actionUrl) return;
    closeSheet();
    if (/^https?:\/\//i.test(actionUrl)) {
        window.location.href = actionUrl;
    } else {
        router.push(actionUrl);
    }
}

watch(isOpen, (open) => {
    if (open) {
        store.dispatch("notification/ensureUnreadFeedLoaded");
        store.dispatch("notification/fetchUnreadCount");
    } else {
        resetSheetView();
    }
});

watch(
    () => [notifications.value.length, loadingMore.value, listLoading.value],
    () => nextTick(checkNeedMoreIfListShort)
);
</script>

<template>
    <div class="inline-flex">
        <button
            type="button"
            :class="buttonClass"
            class="focus:outline-none transition-transform duration-200 active:scale-95"
            :aria-label="$t('panel.notifications')"
            @click="openSheet"
        >
            <svg class="w-5 h-5" viewBox="-2 -1 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    class="fill-current"
                    d="M13.3014 8.50275C12.709 7.81089 12.4397 7.21133 12.4397 6.19274V5.8464C12.4397 4.51905 12.1342 3.66382 11.47 2.8086C10.4463 1.48043 8.72294 0.679932 7.03584 0.679932H6.9641C5.31247 0.679932 3.64311 1.44367 2.60167 2.71793C1.90119 3.59031 1.56023 4.48229 1.56023 5.8464V6.19274C1.56023 7.21133 1.30873 7.81089 0.698539 8.50275C0.249559 9.01245 0.106079 9.66755 0.106079 10.3766C0.106079 11.0864 0.339033 11.7586 0.806552 12.3051C1.41675 12.9602 2.27843 13.3784 3.15866 13.4511C4.43305 13.5965 5.70744 13.6512 7.00038 13.6512C8.2925 13.6512 9.5669 13.5598 10.8421 13.4511C11.7215 13.3784 12.5832 12.9602 13.1934 12.3051C13.6601 11.7586 13.8939 11.0864 13.8939 10.3766C13.8939 9.66755 13.7504 9.01245 13.3014 8.50275"
                />
                <path
                    class="fill-current"
                    opacity="0.4"
                    d="M8.62912 14.653C8.22367 14.5664 5.75307 14.5664 5.34762 14.653C5.00101 14.733 4.62619 14.9192 4.62619 15.3277C4.64634 15.7173 4.87446 16.0612 5.19044 16.2793L5.18963 16.2801C5.59831 16.5986 6.07792 16.8012 6.5801 16.8739C6.84771 16.9107 7.12016 16.909 7.39745 16.8739C7.89883 16.8012 8.37844 16.5986 8.78711 16.2801L8.78631 16.2793C9.10229 16.0612 9.3304 15.7173 9.35055 15.3277C9.35055 14.9192 8.97573 14.733 8.62912 14.653"
                />
            </svg>
            <div
                v-if="unreadCount > 0"
                class="absolute inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-gray-900 bg-yellow-400 border-2 border-white rounded-full -top-1 ltr:-right-1 rtl:-left-1 dark:border-gray-900 ring-2 ring-yellow-400/30"
            >
                {{ badgeLabel }}
            </div>
        </button>

        <BottomSheetDrawer
            v-model="isOpen"
            :initialHeight="0.72"
            :maxHeight="0.92"
            :minHeight="0.45"
            :autoCloseOnMin="true"
            :closeOnBackdrop="true"
            :lockScroll="true"
            backdrop-z-class="z-[2000000010]"
            panel-z-class="z-[2000000020]"
            :panelClass="'bg-gray-100 dark:bg-gray-800 border-t border-gray-200/70 dark:border-gray-700/70 rounded-t-2xl md:rounded-b-2xl lg:w-[35rem] shadow-md shadow-[0_-12px_40px_rgba(15,23,42,0.4)] dark:shadow-gray-600'"
            :contentClass="'px-0 pb-0 flex flex-col flex-1 min-h-0 overflow-hidden'"
            :backdropClass="'bg-white-40 dark:bg-black/45 backdrop-blur-sm'"
            @close="resetSheetView"
        >
            <!-- List header -->
            <div
                v-if="sheetView === 'list'"
                class="shrink-0 px-4 pt-1 pb-3 border-b border-gray-100 dark:border-gray-800"
            >
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div
                            class="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center text-gray-900 shadow-sm"
                        >
                        <svg data-v-53c5b1b3="" class="w-5 h-5" viewBox="-2 -1 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-53c5b1b3="" class="fill-current" d="M13.3014 8.50275C12.709 7.81089 12.4397 7.21133 12.4397 6.19274V5.8464C12.4397 4.51905 12.1342 3.66382 11.47 2.8086C10.4463 1.48043 8.72294 0.679932 7.03584 0.679932H6.9641C5.31247 0.679932 3.64311 1.44367 2.60167 2.71793C1.90119 3.59031 1.56023 4.48229 1.56023 5.8464V6.19274C1.56023 7.21133 1.30873 7.81089 0.698539 8.50275C0.249559 9.01245 0.106079 9.66755 0.106079 10.3766C0.106079 11.0864 0.339033 11.7586 0.806552 12.3051C1.41675 12.9602 2.27843 13.3784 3.15866 13.4511C4.43305 13.5965 5.70744 13.6512 7.00038 13.6512C8.2925 13.6512 9.5669 13.5598 10.8421 13.4511C11.7215 13.3784 12.5832 12.9602 13.1934 12.3051C13.6601 11.7586 13.8939 11.0864 13.8939 10.3766C13.8939 9.66755 13.7504 9.01245 13.3014 8.50275"></path><path data-v-53c5b1b3="" class="fill-current" opacity="0.4" d="M8.62912 14.653C8.22367 14.5664 5.75307 14.5664 5.34762 14.653C5.00101 14.733 4.62619 14.9192 4.62619 15.3277C4.64634 15.7173 4.87446 16.0612 5.19044 16.2793L5.18963 16.2801C5.59831 16.5986 6.07792 16.8012 6.5801 16.8739C6.84771 16.9107 7.12016 16.909 7.39745 16.8739C7.89883 16.8012 8.37844 16.5986 8.78711 16.2801L8.78631 16.2793C9.10229 16.0612 9.3304 15.7173 9.35055 15.3277C9.35055 14.9192 8.97573 14.733 8.62912 14.653"></path></svg>
                        </div>
                        <div class="min-w-0">
                            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-50 truncate">
                                {{ $t("panel.notifications") }}
                            </h3>
                            <p
                                v-if="unreadCount > 0"
                                class="text-[11px] text-amber-600 dark:text-yellow-400 font-medium"
                            >
                                {{ unreadCount }} {{ $t("panel.notifications.filterUnread") }}
                            </p>
                        </div>
                    </div>
                    <button
                        v-if="unreadCount > 0"
                        type="button"
                        class="shrink-0 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-400/10 dark:text-yellow-400 dark:hover:bg-amber-400/20 transition-colors disabled:opacity-50"
                        :disabled="markingAll"
                        @click="handleMarkAllRead"
                    >
                        {{ $t("panel.notifications.markAllRead") }}
                    </button>
                </div>
            </div>

            <!-- Detail header -->
            <div
                v-else
                class="shrink-0 px-3 pt-1 pb-3 border-b border-gray-100 dark:border-gray-800"
            >
                <button
                    type="button"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-yellow-400 transition-colors"
                    @click="backToList"
                >
                    <svg class="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M15 18L9 12L15 6"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    {{ $t("cart.back") }}
                </button>
            </div>

            <!-- List view -->
            <div
                v-if="sheetView === 'list'"
                ref="listScrollEl"
                class="flex-1 min-h-0 overflow-auto px-3 py-2 custom-scrollbar"
                @scroll="onListScroll"
            >
                <div v-if="listLoading && !notifications.length" class="py-14 flex flex-col items-center gap-3">
                    <span
                        class="inline-block w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-amber-400 animate-spin"
                    ></span>
                    <span class="text-xs text-gray-400">{{ $t("profile.common.loading") }}</span>
                </div>

                <template v-else-if="notifications.length">
                    <button
                        v-for="notification in notifications"
                        :key="notification.id"
                        type="button"
                        class="relative group w-full flex items-center gap-2.5 mb-2 last:mb-0 rounded-xl border px-2.5 py-2 text-start transition-all duration-200 outline-none ring-0 active:scale-[0.99] border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 hover:bg-gray-50 dark:hover:bg-gray-800/80"
                        
                        @click="openNotificationDetail(notification)"
                    >
                        <div
                            v-if="!notification.read_at"
                            class="absolute start-0 h-[60%] top-[20%] shrink-0 w-1 self-stretch rounded-e-full bg-gradient-to-b from-yellow-300 to-amber-500"
                        ></div>

                        <div
                            class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border"
                            :class="
                                notification.read_at
                                    ? 'bg-gray-100 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'
                                    : 'bg-yellow-400/90 border-yellow-300 text-gray-800'
                            "
                            v-html="getNotificationIcon(notification)"
                        ></div>

                        <div class="flex-1 min-w-0">
                            <div
                                v-html="notification.data?.message"
                                class="text-xs leading-5 line-clamp-1 notification-sheet-message"
                                :class="
                                    notification.read_at
                                        ? 'text-gray-500 dark:text-gray-400'
                                        : 'text-gray-800 dark:text-gray-100 font-medium'
                                "
                            ></div>
                            <span class="text-[10px] text-gray-400 dark:text-gray-500">
                                {{ formatTime(notification.created_at) }}
                            </span>
                        </div>
                    </button>

                    <div v-if="loadingMore" class="py-3 flex items-center justify-center gap-2">
                        <span
                            class="inline-block w-4 h-4 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-amber-400 animate-spin"
                        ></span>
                        <span class="text-[11px] text-gray-400">{{ $t("profile.common.loading") }}</span>
                    </div>
                </template>

                <div v-else class="py-16 px-4 text-center">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t("panel.common.empty") }}</p>
                </div>
            </div>

            <!-- Detail view -->
            <div v-else class="flex-1 min-h-0 flex flex-col px-4 py-3">
                <template v-if="selectedNotification">
                    <div class="shrink-0 flex items-start gap-3 mb-4">
                        <div
                            class="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-yellow-400/90 text-gray-800 border border-yellow-300"
                            v-html="getNotificationIcon(selectedNotification)"
                        ></div>
                        <div class="min-w-0 pt-1 space-y-1">
                            <p class="text-[11px] text-gray-500 dark:text-gray-400">
                                {{ $t("panel.notifications.createdDate") }}
                                <span class="ms-1 text-gray-600 dark:text-gray-300">
                                    {{ formatPanelDate(selectedNotification.created_at) }}
                                </span>
                                <span class="mx-1.5 text-gray-300 dark:text-gray-600">|</span>
                                <span class="text-gray-600 dark:text-gray-300">
                                    {{ formatPanelTime(selectedNotification.created_at) }}
                                </span>
                            </p>

                            <div v-if="markingRead" class="text-[11px] flex items-center gap-1">
                                <span class="text-gray-500 dark:text-gray-400">
                                    {{ $t("panel.notifications.firstViewDate") }}
                                </span>
                                <span
                                    class="h-1.5 w-40 max-w-full rounded-full animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-200 dark:bg-gray-700"
                                    aria-hidden="true"
                                ></span>
                            </div>
                            <p
                                v-else-if="selectedNotification.read_at"
                                class="text-[11px] text-gray-500 dark:text-gray-400"
                            >
                                {{ $t("panel.notifications.firstViewDate") }}
                                <span class="ms-1 text-gray-600 dark:text-gray-300">
                                    {{ formatPanelDate(selectedNotification.read_at) }}
                                </span>
                                <span class="mx-1.5 text-gray-300 dark:text-gray-600">|</span>
                                <span class="text-gray-600 dark:text-gray-300">
                                    {{ formatPanelTime(selectedNotification.read_at) }}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div
                        class="flex-1 min-h-0 overflow-auto custom-scrollbar"
                    >
                        <div
                            v-html="selectedNotification.data?.message"
                            class="text-sm leading-7 text-gray-700 dark:text-gray-200 notification-sheet-message rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4"
                        ></div>

                        <button
                            v-if="selectedNotification.data?.action_url"
                            type="button"
                            class="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 hover:opacity-90 transition-opacity"
                            @click="openActionUrl"
                        >
                            {{ selectedNotification.data?.action_text || $t("panel.common.show") }}
                        </button>
                    </div>
                </template>
            </div>

            <div
                v-if="sheetView === 'list'"
                class="shrink-0 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80"
            >
                <button
                    type="button"
                    class="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-amber-300 hover:text-amber-700 dark:hover:text-yellow-400 dark:hover:border-yellow-400/40 transition-colors"
                    @click="goToAllNotifications"
                >
                    {{ $t("panel.common.viewAll") }}
                </button>
            </div>
        </BottomSheetDrawer>
    </div>
</template>

<style scoped>
.notification-sheet-message :deep(.text-primary) {
    color: rgb(217 119 6);
}

.dark .notification-sheet-message :deep(.text-primary) {
    color: rgb(250 204 21);
}
</style>
