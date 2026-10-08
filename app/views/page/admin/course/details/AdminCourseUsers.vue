<template>
    <div>
        <AdminTabPanelToolbar>
            <template v-if="!loading && users" #leading>
                <span>{{ pagination?.total ?? users.length }} کاربر ثبت‌نام‌شده</span>
            </template>
            <template #actions>
            <button
                type="button"
                @click.prevent="openAssignModal"
                class="hover:bg-opacity-90 rounded-lg px-3 py-2 flex justify-center items-center text-sm font-semibold bg-yellow-400 text-gray-800 transition-colors"
            >
                اختصاص به کاربران دیگر
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3C9.566 3 7.593 4.957 7.593 7.371C7.593 9.786 9.566 11.743 12 11.743s4.407-1.957 4.407-4.372C16.407 4.957 14.434 3 12 3z" fill="currentColor" />
                    <path d="M14.601 13.688A4.407 4.407 0 009.399 13.688L9.214 13.717A5.617 5.617 0 005 18.617C5 19.933 6.076 21 7.403 21h9.194C17.924 21 19 19.933 19 18.617a5.617 5.617 0 00-4.214-4.9l-.185-.029z" fill="currentColor" />
                </svg>
            </button>
            </template>
        </AdminTabPanelToolbar>

        <AdminInlineLoading v-if="loading" />

        <div v-else id="data-list">
            <div v-if="users && users.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div
                    v-for="user in users"
                    :key="user.id"
                    class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-500/30 transition-colors p-3"
                >
                    <div class="flex items-start justify-between gap-2">
                        <router-link
                            :to="{ name: 'admin-user-details', params: { username: user.username } }"
                            class="flex items-center gap-2.5 min-w-0 group"
                        >
                            <div class="shrink-0 w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 overflow-hidden">
                                <img
                                    onerror="this.style.display='none'"
                                    :src="user.profile_pic"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-150"
                                />
                            </div>
                            <div class="min-w-0">
                                <div class="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                                    {{ user.first_name }} {{ user.last_name }}
                                </div>
                                <div dir="ltr" class="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">@{{ user.username }}</div>
                            </div>
                        </router-link>

                        <div class="flex items-center gap-1.5 shrink-0">
                            <button
                                type="button"
                                title="حذف از دوره"
                                class="w-8 h-8 flex items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                @click.prevent="openRemoveModal(user)"
                            >
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="w-10 h-10 relative flex justify-center items-center">
                            <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-gray-700" stroke-width="4" />
                                <circle
                                    cx="18" cy="18" r="16" fill="none"
                                    class="stroke-current text-amber-400"
                                    stroke-width="4"
                                    stroke-dasharray="100"
                                    :stroke-dashoffset="100 - (user.watched_percent || 0)"
                                    stroke-linecap="round"
                                />
                            </svg>
                            <span class="absolute text-[10px] font-bold text-gray-700 dark:text-gray-300">{{ user.watched_percent }}%</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="user.completed_at" class="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg w-max">
                        <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.836 2.034a1 1 0 011.33.136l1.283.632a1 1 0 001.1 0l1.283-.632a1 1 0 011.33.136l.46 1.354a1 1 0 00.78.732l1.354.46a1 1 0 01.136 1.33l-.632 1.283a1 1 0 000 1.1l.632 1.283a1 1 0 01-.136 1.33l-1.354.46a1 1 0 00-.78.732l-.46 1.354a1 1 0 01-1.33.136l-1.283-.632a1 1 0 00-1.1 0l-1.283.632a1 1 0 01-1.33-.136l-.46-1.354a1 1 0 00-.78-.732l-1.354-.46a1 1 0 01-.136-1.33l.632-1.283a1 1 0 000-1.1l-.632-1.283a1 1 0 01.136-1.33l1.354-.46a1 1 0 00.78-.732l.46-1.354zM15.47 8.97L10.05 14.39l-1.974-2.369a1 1 0 00-1.414.096 1 1 0 00-.096 1.414l2.5 3a1 1 0 001.414.05l6-6a1 1 0 00-1.414-1.414z" />
                        </svg>
                        گواهینامه: {{ formatDate(user.completed_at) }}
                    </div>

                    <hr class="my-2.5 border-t border-dashed border-gray-200 dark:border-gray-700/60" />

                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="text-[11px] font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                            خرید: {{ formatDate(user.purchased_at) }}
                        </span>
                        <span class="text-[11px] font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                            <span v-if="user.price === 0">رایگان</span>
                            <span v-else class="inline-flex items-center gap-0.5">{{ user.price.toLocaleString() }} تومان</span>
                        </span>
                    </div>
                </div>
            </div>

            <AdminEmptyState v-else message="هنوز کاربری در این دوره ثبت‌نام نکرده است" />

            <div v-if="pagination && pagination.last_page > 1" class="mt-6 flex justify-end">
                <PaginationComponent :pagination="pagination" @updatePage="updatePage" />
            </div>
        </div>

        <BottomSheetDrawer
            v-model="isAssignModalOpen"
            :initialHeight="0.7"
            :maxHeight="0.95"
            :minHeight="0.6"
            :autoCloseOnMin="true"
            :closeOnBackdrop="true"
            :lockScroll="true"
            :panelClass="bs.ADMIN_BS_PANEL"
            :contentClass="bs.ADMIN_BS_CONTENT"
            :backdropClass="bs.ADMIN_BS_BACKDROP"
        >
            <AdminBottomSheetHeader
                title="اختصاص کاربر"
                subtitle="حداقل ۳ کاراکتر برای جستجو وارد کنید"
                accent="sky"
                @close="closeAssignModal"
            />
            <div :class="bs.ADMIN_BS_SCROLL">
            <div class="text-start">
                <label for="searchKey" :class="bs.ADMIN_BS_FORM_LABEL">جستجوی کاربر</label>
                <div class="relative w-full flex items-center">
                    <input
                        id="searchKey"
                        ref="searchInput"
                        v-model="searchKey"
                        type="text"
                        :class="[bs.ADMIN_BS_INPUT, 'pe-10', errors && errors.searchKey ? bs.ADMIN_BS_INPUT_ERROR : '']"
                        @input="handleSearch"
                    />
                    <svg v-if="searchLoading" class="absolute end-3 w-4 h-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
                <span v-if="errors && errors.searchKey" class="mt-1 text-rose-500 text-xs font-medium block">
                    {{ errors.searchKey[0] }}
                </span>

                <hr class="my-3 border-t border-dashed border-gray-200 dark:border-gray-700/60" />

                <div v-if="searchResult && searchResult.length > 0" class="space-y-2 max-h-[24rem] overflow-y-auto custom-scrollbar">
                    <div
                        v-for="user in searchResult"
                        :key="user.id"
                        class="bg-gray-100 dark:bg-gray-800 rounded-xl p-2.5 flex items-center justify-between gap-2"
                    >
                        <router-link :to="{ name: 'admin-user-details', params: { username: user.username } }" class="flex items-center gap-2 min-w-0">
                            <div class="w-9 h-9 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shrink-0">
                                <img onerror="this.style.display='none'" :src="user.profile_pic" class="w-full h-full object-cover" />
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{{ user.first_name }} {{ user.last_name }}</div>
                                <div class="text-[11px] text-gray-500 line-clamp-1">@{{ user.username }}</div>
                            </div>
                        </router-link>
                        <button
                            type="button"
                            :disabled="assignedLoading[user.id] || users.some((u) => u.id === user.id)"
                            class="disabled:opacity-50 shrink-0 flex items-center bg-yellow-400 text-gray-800 px-3 py-1.5 rounded-lg hover:bg-opacity-90 text-xs font-semibold"
                            @click.prevent="submitAssignCourse(user.id)"
                        >
                            اختصاص
                        </button>
                    </div>
                </div>
                <AdminEmptyState v-else class="my-4" message="کاربری یافت نشد" />
            </div>
            </div>
        </BottomSheetDrawer>

        <BottomSheetDrawer
            v-model="isRemoveModalOpen"
            :initialHeight="0.4"
            :maxHeight="0.6"
            :minHeight="0.4"
            :autoCloseOnMin="true"
            :closeOnBackdrop="true"
            :lockScroll="true"
            :panelClass="bs.ADMIN_BS_PANEL_SM"
            :contentClass="bs.ADMIN_BS_CONTENT"
            :backdropClass="bs.ADMIN_BS_BACKDROP"
        >
            <AdminBottomSheetHeader
                title="حذف کاربر از دوره"
                :subtitle="userForRemove ? `@${userForRemove.username}` : ''"
                accent="rose"
                @close="closeRemoveModal"
            />
            <AdminBottomSheetConfirm
                message="از حذف این کاربر از دوره اطمینان کامل دارید؟"
                description="دسترسی کاربر به این دوره لغو خواهد شد."
                :loading="userForRemove && removeLoading[userForRemove.id]"
                @cancel="closeRemoveModal"
                @confirm="submitRemoveUser"
            />
        </BottomSheetDrawer>
    </div>
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import AdminTabPanelToolbar from "@/views/components/admin/AdminTabPanelToolbar.vue";
import AdminEmptyState from "@/views/components/admin/AdminEmptyState.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetConfirm from "@/views/components/admin/bottomSheet/AdminBottomSheetConfirm.vue";
import * as bs from "@/views/components/admin/bottomSheet/adminBottomSheetStyles.js";
import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const TOAST_OPTS = {
    theme: "colored",
    hideProgressBar: false,
    rtl: localStorage.getItem("direction") === "rtl",
    bodyClassName: "font-YekanBakh",
    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
    transition: toast.TRANSITIONS.BOUNCE,
    position: toast.POSITION.BOTTOM_RIGHT,
};

export default {
    components: {
        PaginationComponent,
        BottomSheetDrawer,
        AdminTabPanelToolbar,
        AdminInlineLoading,
        AdminEmptyState,
        AdminBottomSheetHeader,
        AdminBottomSheetConfirm,
    },
    props: {
        courseSlug: { type: String, required: true },
    },
    data() {
        return {
            bs,
            errors: null,
            course: null,
            users: [],
            currentPage: parseInt(this.$route.query.page || "1", 10) || 1,
            perPage: 12,
            pagination: {},
            loading: false,
            mounted: false,
            isAssignModalOpen: false,
            searchLoading: false,
            searchKey: "",
            previousSearchKey: "",
            searchResult: [],
            assignedLoading: {},
            isRemoveModalOpen: false,
            userForRemove: null,
            removeLoading: {},
        };
    },
    methods: {
        formatDate(value) {
            if (!value) return "—";
            return new Date(value).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "2-digit" });
        },
        handleSearch: debounce(function () {
            if (this.searchKey === this.previousSearchKey) return;
            const key = (this.searchKey || "").trim();
            if (key.length > 2) {
                this.searchLoading = true;
                axiosInstance
                    .post("/admin/searchUser", { key, limit: 20 })
                    .then((response) => {
                        this.searchResult = response.data.result || [];
                    })
                    .catch((error) => {
                        console.error(error.response?.data?.errors || error);
                    })
                    .finally(() => {
                        this.searchLoading = false;
                    });
                this.previousSearchKey = this.searchKey;
            } else if (key.length === 0) {
                this.searchResult = [];
                this.previousSearchKey = "";
            }
        }, 400),
        submitAssignCourse(userId) {
            this.assignedLoading[userId] = true;
            axiosInstance
                .post(`/admin/course/${this.courseSlug}/users/assign`, { user_id: userId })
                .then((response) => {
                    this.users.push(response.data.result);
                    toast.success("دوره با موفقیت به کاربر اختصاص داده شد.", TOAST_OPTS);
                })
                .catch((error) => {
                    console.error(error.response?.data?.errors || error);
                    if (error.response?.status === 409) {
                        toast.error("این دوره قبلاً به این کاربر اختصاص داده شده است.", TOAST_OPTS);
                    } else if (error.response?.status === 403) {
                        toast.warning("شما اجازه این عملیات را ندارید.", TOAST_OPTS);
                    } else {
                        toast.error("خطایی رخ داد. لطفاً دوباره تلاش کنید.", TOAST_OPTS);
                    }
                })
                .finally(() => {
                    this.assignedLoading[userId] = false;
                });
        },
        openRemoveModal(user) {
            this.userForRemove = user;
            this.isRemoveModalOpen = true;
        },
        closeRemoveModal() {
            this.isRemoveModalOpen = false;
            this.userForRemove = null;
        },
        submitRemoveUser() {
            if (!this.userForRemove) return;
            const userId = this.userForRemove.id;
            this.removeLoading[userId] = true;
            axiosInstance
                .post(`/admin/course/${this.courseSlug}/users/remove`, { user_id: userId })
                .then(() => {
                    this.users = this.users.filter((u) => u.id !== userId);
                    if (this.pagination?.total) {
                        this.pagination = { ...this.pagination, total: this.pagination.total - 1 };
                    }
                    this.closeRemoveModal();
                    toast.success("کاربر با موفقیت از دوره حذف شد.", TOAST_OPTS);
                })
                .catch((error) => {
                    console.error(error.response?.data?.errors || error);
                    if (error.response?.status === 404) {
                        toast.error("این کاربر در این دوره ثبت‌نام نشده است.", TOAST_OPTS);
                    } else if (error.response?.status === 403) {
                        toast.warning("شما اجازه این عملیات را ندارید.", TOAST_OPTS);
                    } else {
                        toast.error("خطایی رخ داد. لطفاً دوباره تلاش کنید.", TOAST_OPTS);
                    }
                })
                .finally(() => {
                    this.removeLoading[userId] = false;
                });
        },
        updatePage(value) {
            this.currentPage = value;
            this.updateUrlAndFetchData();
        },
        updateUrlAndFetchData() {
            const params = new URLSearchParams(window.location.search);
            if (this.currentPage !== 1) params.set("page", this.currentPage);
            else params.delete("page");
            const queryString = params.toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
            window.history.pushState(null, "", newUrl);
            this.getCourseUsers();
        },
        async getCourseUsers() {
            this.loading = true;
            try {
                const response = await axiosInstance.post(`admin/course/${this.courseSlug}/users`, {
                    page: this.currentPage,
                    perPage: this.perPage,
                });
                this.course = response.data.course;
                this.users = response.data.users || [];
                this.pagination = response.data.pagination || {};
                if (this.mounted) {
                    setTimeout(() => {
                        document.getElementById("data-list")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                }
            } catch (error) {
                console.error(error.response?.data?.errors || error);
            } finally {
                this.loading = false;
                this.mounted = true;
            }
        },
        openAssignModal() {
            this.isAssignModalOpen = true;
            this.$nextTick(() => this.$refs.searchInput?.focus());
        },
        closeAssignModal() {
            this.isAssignModalOpen = false;
            this.searchLoading = false;
            this.searchKey = "";
            this.previousSearchKey = "";
            this.searchResult = [];
        },
    },
    mounted() {
        this.getCourseUsers();
    },
};
</script>
