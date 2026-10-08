<template>
    <BottomSheetDrawer
        v-model="isOpen"
        :initialHeight="0.75"
        :maxHeight="0.95"
        :minHeight="0.5"
        :autoCloseOnMin="true"
        :closeOnBackdrop="true"
        :lockScroll="true"
        :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[28rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
        :contentClass="'px-4 pb-4 flex flex-col flex-1 min-h-0 overflow-hidden'"
        :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'"
        @close="resetSheet"
    >
        <div class="shrink-0 pt-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <h3 class="text-center text-base font-bold text-gray-900 dark:text-gray-50">
                {{ profileDisplayName }}
            </h3>
            <div
                class="mt-3 flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1 text-sm font-semibold"
            >
                <button
                    type="button"
                    class="w-1/2 py-2 rounded-lg transition-all duration-200"
                    :class="
                        activeTab === 'followers'
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-amber-400 shadow'
                            : 'text-gray-600 dark:text-gray-300'
                    "
                    @click="switchTab('followers')"
                >
                    {{ $t('profile.follow.followersTab') }} ({{ followersCount }})
                </button>
                <button
                    type="button"
                    class="w-1/2 py-2 rounded-lg transition-all duration-200"
                    :class="
                        activeTab === 'followings'
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-amber-400 shadow'
                            : 'text-gray-600 dark:text-gray-300'
                    "
                    @click="switchTab('followings')"
                >
                    {{ $t('profile.follow.followingsTab') }} ({{ followingsCount }})
                </button>
            </div>
        </div>

        <div
            ref="listScrollEl"
            class="flex-1 min-h-0 overflow-auto -mx-1 px-1 custom-scrollbar"
            @scroll="onListScroll"
        >
            <div v-if="listLoading && !users.length" class="py-10 flex justify-center">
                <svg class="w-8 h-8 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </div>

            <template v-else-if="users.length">
                <ProfileFollowListRow
                    v-for="listUser in users"
                    :key="`${activeTab}-${listUser.id}`"
                    :user="listUser"
                    :is-logged-in="isLoggedIn"
                    @navigate="closeSheet"
                    @follow-changed="$emit('follow-changed', $event)"
                />
                <div v-if="loadingMore" class="py-2 flex items-center justify-center gap-1.5">
                    <span
                        class="inline-block w-3.5 h-3.5 rounded-full border-[1.5px] border-gray-300 dark:border-gray-600 border-t-gray-700 dark:border-t-amber-400 animate-spin"
                        aria-hidden="true"
                    ></span>
                    <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ $t('profile.common.loading') }}</span>
                </div>
            </template>

            <p v-else class="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                {{ emptyMessage }}
            </p>
        </div>
    </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import ProfileFollowListRow from "@/views/components/profile/ProfileFollowListRow.vue";
import axiosInstance from "@/store/axiosInstance";

export default {
    components: {
        BottomSheetDrawer,
        ProfileFollowListRow,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        username: {
            type: String,
            required: true,
        },
        initialTab: {
            type: String,
            default: "followers",
            validator: (v) => ["followers", "followings"].includes(v),
        },
        followersCount: {
            type: Number,
            default: 0,
        },
        followingsCount: {
            type: Number,
            default: 0,
        },
        profileDisplayName: {
            type: String,
            default: "",
        },
        isLoggedIn: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue", "follow-changed"],
    data() {
        return {
            activeTab: this.initialTab,
            users: [],
            listLoading: false,
            loadingMore: false,
            currentPage: 1,
            lastPage: null,
            listResizeObserver: null,
        };
    },
    beforeUnmount() {
        this.teardownListResizeObserver();
    },
    computed: {
        isOpen: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
        emptyMessage() {
            return this.activeTab === "followers"
                ? this.$t("profile.follow.noFollowers")
                : this.$t("profile.follow.noFollowings");
        },
        /** هنوز صفحهٔ بعدی از API مانده است */
        hasMore() {
            if (this.lastPage === null) return false;
            return this.currentPage <= this.lastPage;
        },
    },
    watch: {
        modelValue(open) {
            if (open) {
                this.activeTab = this.initialTab;
                this.resetAndLoad();
                this.$nextTick(() => this.setupListResizeObserver());
            } else {
                this.teardownListResizeObserver();
            }
        },
        initialTab(tab) {
            if (this.modelValue) {
                this.activeTab = tab;
                this.resetAndLoad();
            }
        },
    },
    methods: {
        closeSheet() {
            this.isOpen = false;
        },
        resetSheet() {
            this.teardownListResizeObserver();
            this.users = [];
            this.currentPage = 1;
            this.lastPage = null;
            this.listLoading = false;
            this.loadingMore = false;
        },
        setupListResizeObserver() {
            this.teardownListResizeObserver();
            const el = this.$refs.listScrollEl;
            if (!el || typeof ResizeObserver === "undefined") return;

            this.listResizeObserver = new ResizeObserver(() => {
                this.checkNeedMoreIfListShort();
            });
            this.listResizeObserver.observe(el);
        },
        teardownListResizeObserver() {
            if (this.listResizeObserver) {
                this.listResizeObserver.disconnect();
                this.listResizeObserver = null;
            }
        },
        switchTab(tab) {
            if (this.activeTab === tab) return;
            this.activeTab = tab;
            this.resetAndLoad();
        },
        resetAndLoad() {
            this.users = [];
            this.currentPage = 1;
            this.lastPage = null;
            this.fetchUsers(false);
        },
        async fetchUsers(loadMore = false) {
            if (this.listLoading || this.loadingMore) return;
            if (loadMore && !this.hasMore) return;

            if (loadMore) {
                this.loadingMore = true;
            } else {
                this.listLoading = true;
            }

            const endpoint =
                this.activeTab === "followers"
                    ? `/@${this.username}/followers`
                    : `/@${this.username}/followings`;

            try {
                const response = await axiosInstance.post(endpoint, {
                    page: loadMore ? this.currentPage : 1,
                    perPage: 15,
                });

                const newUsers = response.data.users || [];
                if (loadMore) {
                    this.users.push(...newUsers);
                } else {
                    this.users = newUsers;
                }

                const pagination = response.data.pagination;
                this.lastPage = pagination.last_page;
                this.currentPage = pagination.next_page ?? pagination.last_page + 1;
            } catch (error) {
                console.error(error);
            } finally {
                this.listLoading = false;
                this.loadingMore = false;
                this.$nextTick(() => this.checkNeedMoreIfListShort());
            }
        },
        /** لیست از ارتفاع باکس اسکرول کوتاه‌تر است → بدون اسکرول صفحه بعد را بگیر */
        checkNeedMoreIfListShort() {
            const el = this.$refs.listScrollEl;
            if (!el || this.listLoading || this.loadingMore || !this.hasMore) return;

            const thresholdPx = 80;
            if (el.scrollHeight <= el.clientHeight + thresholdPx) {
                this.fetchUsers(true);
            }
        },
        /**
         * وقتی اسکرول به ~۸۰px مانده به انتهای لیست برسد، صفحه بعد را می‌گیرد.
         * scrollTop + clientHeight >= scrollHeight - threshold
         */
        onListScroll() {
            const el = this.$refs.listScrollEl;
            if (!el || this.listLoading || this.loadingMore || !this.hasMore) return;

            const thresholdPx = 80;
            const scrolledToBottom =
                el.scrollTop + el.clientHeight >= el.scrollHeight - thresholdPx;

            if (scrolledToBottom) {
                this.fetchUsers(true);
            }
        },
    },
};
</script>
