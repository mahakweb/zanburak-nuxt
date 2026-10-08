<template>
    <AdminTabPanelToolbar>
        <AdminFilterSelect v-model="filters.approved" label="وضعیت تایید" :options="approvedOptions" @change="onFilterChange" />
        <AdminFilterSelect v-model="filters.sort" label="مرتب‌سازی" :options="sortOptions" @change="onFilterChange" />
    </AdminTabPanelToolbar>
    <AdminInlineLoading v-if="loading" />
    <div v-else id="data-list">
        <div v-if="course && comments && comments.length > 0"
            class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div v-for="(comment, index) in comments" :key="index" class="h-auto self-start">
                <Disclosure v-slot="{ open }" as="div" class="relative rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div class="text-start w-full p-3 md:p-4">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center">
                                <router-link :to="{ name: 'profile-page', params: { username: comment.user.username } }"
                                    class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500">
                                    <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-200"
                                        :src="comment.user.profile_pic" :alt="comment.user.username" />
                                </router-link>
                                <div class="space-y-1 ms-2">
                                    <router-link
                                        :to="{ name: 'profile-page', params: { username: comment.user.username } }"
                                        class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                                        {{ comment.user.first_name + ' ' + comment.user.last_name }}
                                    </router-link>
                                    <p class="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{{
                                        timeAgo(comment.created_at) }}</p>
                                </div>
                            </div>
                            <div class="hidden md:flex items-center gap-1">
                                <button @click.prevent="openReplyCommentModal(comment)"
                                    class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">پاسخ</button>
                                <button v-if="!comment.approved" :disabled="loadingComments[comment.id]"
                                    @click.prevent="commentToggleApproval(comment, comment.id)"
                                    class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">تایید</button>
                                <button v-else @click.prevent="commentToggleApproval(comment, comment.id)"
                                    :disabled="loadingComments[comment.id]"
                                    class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">عدم
                                    تایید</button>
                                <button @click.prevent="openPreviewCommentModal(comment)"
                                    class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">مشاهده</button>
                            </div>
                            <Popover class="md:hidden group relative">
                                <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                <PopoverButton
                                    class="p-1 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 rounded-md relative  group-focus-within:z-30 focus:outline-none  flex items-center justify-center">
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0">
                                        </path>
                                    </svg>
                                </PopoverButton>
                                <transition enter-active-class="transition duration-200 ease-out"
                                    enter-from-class="translate-y-1 opacity-0"
                                    enter-to-class="translate-y-0 opacity-100"
                                    leave-active-class="transition duration-150 ease-in"
                                    leave-from-class="translate-y-0 opacity-100"
                                    leave-to-class="translate-y-1 opacity-0">
                                    <PopoverPanel
                                        class="text-start flex flex-col z-30 mt-3 end-0 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-700 dark:divide-gray-800">
                                        <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                            <li>
                                                <button type="button" @click.prevent="openPreviewCommentModal(comment)"
                                                    class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">مشاهده</button>
                                            </li>
                                            <li>
                                                <button @click.prevent="openReplyCommentModal(comment)"
                                                    class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">پاسخ</button>
                                            </li>
                                            <li>
                                                <button v-if="!comment.approved" :disabled="loadingComments[comment.id]"
                                                    @click.prevent="commentToggleApproval(comment, comment.id)"
                                                    class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">تایید</button>
                                                <button v-else :disabled="loadingComments[comment.id]"
                                                    @click.prevent="commentToggleApproval(comment, comment.id)"
                                                    class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">عدم
                                                    تایید</button>
                                            </li>
                                        </ul>
                                    </PopoverPanel>
                                </transition>
                            </Popover>
                        </div>
                        <hr class="border-t border-gray-300 dark:border-opacity-10 mx-1 my-2">
                        <div class="rounded-xl text-sm leading-6 px-3 py-2 bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800">
                            <p class="line-clamp-3">
                                <MarkdownRenderer :source="comment.comment"></MarkdownRenderer>
                            </p>
                        </div>
                        <DisclosureButton
                            class="mt-3 w-full px-3 py-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 text-xs font-semibold rounded-lg hover:bg-amber-100 dark:hover:bg-amber-400/15 transition-colors"
                            :class="{ 'hidden': !comment.children || comment.children.length == 0 }">{{ !open ? `مشاهده
                            پاسخ‌ها (${comment.children?.length || 0})` : `مخفی کردن پاسخ‌ها` }}</DisclosureButton>
                    </div>
                    <transition enter-active-class="transition-all duration-300 ease-out overflow-hidden"
                        enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[3000px] opacity-100"
                        leave-active-class="transition-all duration-300 ease-in overflow-hidden"
                        leave-from-class="max-h-[3000px] opacity-100" leave-to-class="max-h-0 opacity-0">
                        <DisclosurePanel class="relative px-4 pb-4 pt-0 space-y-3 border-t border-gray-100 dark:border-gray-800"
                            :class="{ 'childs': comment.children && comment.children.length > 0 }"
                            v-if="comment.children && comment.children.length > 0">
                            <div v-for="(child, childIndex) in comment.children" :key="childIndex"
                                :class="{ 'last-child': childIndex === comment.children.length - 1 }"
                                class="relative child-line rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40 p-3">
                                <div class="flex items-center justify-between gap-2">
                                    <div class="flex items-center">
                                        <router-link
                                            :to="{ name: 'profile-page', params: { username: child.user.username } }"
                                            class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500">
                                            <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-200"
                                                :src="child.user.profile_pic" :alt="child.user.username" />
                                        </router-link>
                                        <div class="space-y-1 ms-2">
                                            <router-link
                                                :to="{ name: 'profile-page', params: { username: child.user.username } }"
                                                class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                                                {{ child.user.first_name + ' ' + child.user.last_name }}
                                            </router-link>
                                            <p class="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{{
                                                timeAgo(child.created_at) }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="hidden md:flex items-center gap-1">
                                        <button @click.prevent="openReplyCommentModal(child)"
                                            class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">پاسخ</button>
                                        <button v-if="!child.approved" :disabled="loadingComments[child.id]"
                                            @click.prevent="commentToggleApproval(child, child.id)"
                                            class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">تایید</button>
                                        <button v-else @click.prevent="commentToggleApproval(child, child.id)"
                                            :disabled="loadingComments[child.id]"
                                            class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">عدم
                                            تایید</button>
                                        <button @click.prevent="openPreviewCommentModal(child)"
                                            class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">مشاهده</button>
                                    </div>
                                    <Popover class="md:hidden group relative">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                        <PopoverButton
                                            class="p-1 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 rounded-md relative  group-focus-within:z-30 focus:outline-none  flex items-center justify-center">
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                viewBox="0 0 16 16">
                                                <path
                                                    d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0">
                                                </path>
                                            </svg>
                                        </PopoverButton>
                                        <transition enter-active-class="transition duration-200 ease-out"
                                            enter-from-class="translate-y-1 opacity-0"
                                            enter-to-class="translate-y-0 opacity-100"
                                            leave-active-class="transition duration-150 ease-in"
                                            leave-from-class="translate-y-0 opacity-100"
                                            leave-to-class="translate-y-1 opacity-0">
                                            <PopoverPanel
                                                class="text-start flex flex-col z-30 mt-3 end-0 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-700 dark:divide-gray-800">
                                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                    <li>
                                                        <button type="button"
                                                            @click.prevent="openPreviewCommentModal(child)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">مشاهده</button>
                                                    </li>
                                                    <li>
                                                        <button @click.prevent="openReplyCommentModal(child)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">پاسخ</button>
                                                    </li>
                                                    <li>
                                                        <button v-if="!child.approved"
                                                            :disabled="loadingComments[child.id]"
                                                            @click.prevent="commentToggleApproval(child, child.id)"
                                                            class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">تایید</button>
                                                        <button v-else :disabled="loadingComments[child.id]"
                                                            @click.prevent="commentToggleApproval(child, child.id)"
                                                            class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">عدم
                                                            تایید</button>
                                                    </li>
                                                </ul>
                                            </PopoverPanel>
                                        </transition>
                                    </Popover>
                                </div>
                                <hr class="border-t border-gray-300 dark:border-opacity-10 mx-1 my-2">
                                <div
                                    class="rounded-lg text-sm font-light leading-6 p-2 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
                                    <p class="line-clamp-3">
                                        <MarkdownRenderer :source="child.comment"></MarkdownRenderer>
                                    </p>
                                </div>
                            </div>
                        </DisclosurePanel>
                    </transition>
                </Disclosure>
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-24 text-gray-500 font-semibold">چیزی برای نمایش وجود
            ندارد!
        </div>
        <div class="mt-6 flex w-full items-center justify-end">
            <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
        </div>
    </div>

    <BottomSheetDrawer v-model="isOpenReplyCommentModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetHeader title="پاسخ به کامنت" subtitle="پاسخ شما پس از ثبت نمایش داده می‌شود" @close="closeReplyCommentModal" />
        <div :class="bs.ADMIN_BS_SCROLL">
        <div v-if="selectedCommentForReply && !selectedCommentForReply.approved" class="mb-4">
            <input type="checkbox" v-model="selectedCommentForReplyApprovedCheck" checked id="approve-parent" value="" class="hidden peer" required="">
            <label for="approve-parent"
                class="flex items-center w-full p-3 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer peer-checked:border-amber-400 dark:peer-checked:border-amber-400 peer-checked:bg-amber-50/50 dark:peer-checked:bg-amber-900/10 text-gray-600 dark:text-gray-400">
                <svg v-if="selectedCommentForReplyApprovedCheck" class="me-2 w-5 h-5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.03 3.344A9 9 0 0114.97 3.344 9 9 0 0120.656 9.03a9 9 0 01-3.344 5.94 9 9 0 01-5.94 3.344A9 9 0 013.344 14.97 9 9 0 013.344 9.03 9 9 0 019.03 3.344zm3.57 6.263a.6.6 0 00-.6.6V11.4H9.607a.6.6 0 000 1.2H11.4v1.786a.6.6 0 001.2 0V12.6h1.793a.6.6 0 000-1.2H12.6V9.607a.6.6 0 00-.6-.6z" /></svg>
                <span v-else class="w-4 h-4 me-3 rounded-md border-2 border-gray-300 dark:border-gray-600 shrink-0"></span>
                با ارسال پاسخ، کامنت اصلی نیز منتشر شود
            </label>
        </div>
        <div class="rounded-xl border border-dashed border-gray-200/80 dark:border-gray-700/60 p-3 bg-gray-50/40 dark:bg-gray-800/20">
            <EditorComponent class="relative" :submitButton="false" :cancelButton="false"
                :bodyClass="['bg-white', 'dark:bg-gray-900', 'text-gray-700', 'dark:text-gray-50', 'rounded-lg']"
                :toolbarClass="['bg-gray-100', 'dark:bg-gray-800', 'my-2', 'rounded-lg', 'px-2']"
                v-model="replyForSelectedComment"
                :errors="errors?.parent_approved?.[0] || errors?.comment?.[0] || errors?.parent_id?.[0] || ''" />
        </div>
        </div>
        <AdminBottomSheetActions
            cancel-label="انصراف"
            submit-label="ثبت پاسخ"
            :loading="replyCommentLoading"
            @cancel="closeReplyCommentModal"
            @submit="commentSendReply"
        />
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="isOpenPreviewCommentModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <template v-if="selectedCommentForPreview">
            <AdminBottomSheetHeader title="مشاهده کامنت" @close="closePreviewCommentModal" />
            <div :class="bs.ADMIN_BS_SCROLL">
            <div class="flex items-center mb-4">
                <router-link
                    :to="{ name: 'profile-page', params: { username: selectedCommentForPreview.user.username } }"
                    class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500">
                    <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-200"
                        :src="selectedCommentForPreview.user.profile_pic"
                        :alt="selectedCommentForPreview.user.username" />
                </router-link>
                <div class="space-y-1 ms-2">
                    <router-link
                        :to="{ name: 'profile-page', params: { username: selectedCommentForPreview.user.username } }"
                        class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                        {{ selectedCommentForPreview.user.first_name + ' ' + selectedCommentForPreview.user.last_name }}
                    </router-link>
                    <p class="text-xs text-gray-400 dark:text-gray-500">{{ timeAgo(selectedCommentForPreview.created_at) }}</p>
                </div>
            </div>
            <div
                class="bg-gray-50/80 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-xl p-3 text-start leading-7 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <MarkdownRenderer :source="selectedCommentForPreview.comment" />
            </div>
            </div>
        </template>
    </BottomSheetDrawer>
</template>
<script>
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import moment from "moment";
import "moment/locale/fa";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminTabPanelToolbar from "@/views/components/admin/AdminTabPanelToolbar.vue";
import AdminFilterSelect from "@/views/components/admin/AdminFilterSelect.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetActions from "@/views/components/admin/bottomSheet/AdminBottomSheetActions.vue";
import * as bs from "@/views/components/admin/bottomSheet/adminBottomSheetStyles.js";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
export default {
    components: {
        AdminInlineLoading,
        PaginationComponent,
        EditorComponent,
        Popover, PopoverButton, PopoverPanel, PopoverOverlay,
        MarkdownRenderer,
        Disclosure, DisclosureButton, DisclosurePanel,
        BottomSheetDrawer,
        AdminTabPanelToolbar,
        AdminFilterSelect,
        AdminBottomSheetHeader,
        AdminBottomSheetActions,
    },
    props: {
        courseSlug: {
            type: String,
            required: true,
        },
    },
    data() {
        const query = new URLSearchParams(window.location.search);

        const approvedParam = query.get('approved');
        const approved = approvedParam === 'true' ? 'true'
            : approvedParam === 'false' ? 'false'
                : 'all';

        const sortParam = query.get('sort');
        const sort = (sortParam && ['asc', 'desc'].includes(sortParam))
            ? sortParam
            : 'desc';

        const pageParam = parseInt(query.get('page'));
        const currentPage = pageParam > 0 ? pageParam : 1;
        return {
            bs,
            filters: {
                approved,
                sort
            },
            errors: null,
            course: null,
            comments: null,
            currentPage,
            perPage: 10,
            pagination: {},
            loading: false,
            mounted: false,
            loadingComments: [],
            isOpenReplyCommentModal: false,
            selectedCommentForReply: null,
            selectedCommentForReplyApprovedCheck: true,
            replyForSelectedComment: "",
            replyCommentLoading: false,
            isOpenPreviewCommentModal: false,
            selectedCommentForPreview: null,
        };
    },
    computed: {
        approvedOptions() {
            return [
                { value: "all", label: "همه" },
                { value: "true", label: "تایید‌شده" },
                { value: "false", label: "تایید‌نشده" },
            ];
        },
        sortOptions() {
            return [
                { value: "desc", label: "جدیدترین" },
                { value: "asc", label: "قدیمی‌ترین" },
            ];
        },
    },
    methods: {
        onFilterChange() {
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        timeAgo(date) {
            moment.locale("fa");
            return moment(date).fromNow();
        },
        updatePage(value) {
            this.currentPage = value;
            this.updateUrlAndFetchData();
        },
        updateUrlAndFetchData() {
            const params = new URLSearchParams(window.location.search);

            if (this.filters.approved !== 'all') {
                params.set('approved', this.filters.approved);
            } else {
                params.delete('approved');
            }

            if (this.filters.sort !== 'desc') {
                params.set('sort', this.filters.sort);
            } else {
                params.delete('sort');
            }

            if (this.currentPage !== 1) {
                params.set('page', this.currentPage);
            } else {
                params.delete('page');
            }

            const queryString = params.toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

            window.history.pushState(null, '', newUrl);

            this.getCourseComments();
        },
        async commentToggleApproval(comment, id) {
            this.loadingComments[id] = true;
            const wasUnapproved = !comment.approved;
            try {
                await axiosInstance.post(
                    'admin/comments/toggle-approval', { comment_id: comment.id }
                );

                comment.approved = !comment.approved;
                
                // Update Vuex if comment was unapproved and now is approved
                if (wasUnapproved && comment.approved) {
                    this.$store.dispatch('adminComments/decreaseUnapprovedComments');
                    // Also update parent component if it has the method
                    if (this.$parent && typeof this.$parent.decreaseUnapprovedCount === 'function') {
                        this.$parent.decreaseUnapprovedCount();
                    }
                }
                // If comment was approved and now is unapproved, increment
                if (!wasUnapproved && !comment.approved) {
                    this.$store.dispatch('adminComments/incrementUnapprovedComments');
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.loadingComments[id] = false;
            }
        },
        getCourseComments() {
            this.loading = true;
            let params = {
                page: this.currentPage,
                perPage: this.perPage,
                approved: this.filters.approved === 'all' ? null : this.filters.approved,
                order: this.filters.sort,
            };
            axiosInstance.post(
                `admin/course/${this.courseSlug}/comments`, params
            ).then((response) => {
                // console.log(response)
                this.course = response.data.course;
                this.comments = response.data.comments;
                this.pagination = response.data.pagination;
                if (this.mounted === true) {
                    setTimeout(() => {
                        document.getElementById('data-list').scrollIntoView({ behavior: 'smooth' });
                    }, 100)
                }
            }).catch((error) => {
                console.error(error.response?.data?.errors || error);
            }).finally(() => {
                this.loading = false;
                this.mounted = true;
            })
        },

        closePreviewCommentModal() {
            this.isOpenPreviewCommentModal = false;
            this.selectedCommentForPreview = null;
        },
        openPreviewCommentModal(comment) {
            this.selectedCommentForPreview = comment;
            this.isOpenPreviewCommentModal = true;
        },

        closeReplyCommentModal() {
            this.isOpenReplyCommentModal = false;
            // this.selectedCommentForReply = null;
            this.selectedCommentForReplyApprovedCheck = true;
            this.replyForSelectedComment = "";
        },
        openReplyCommentModal(comment) {
            this.selectedCommentForReply = comment;
            this.isOpenReplyCommentModal = true;
        },
        async commentSendReply() {
            this.errors = null;
            this.replyCommentLoading = true;
            try {
                const response = await axiosInstance.post(
                    'admin/comments/send-reply', { parent_id: this.selectedCommentForReply.id, comment: this.replyForSelectedComment, parent_approved: this.selectedCommentForReplyApprovedCheck }
                );

                const newComment = response.data.comment;

                if (!newComment.parent_id) {
                    this.comments.unshift(newComment);
                } else {
                    const added = this.addReplyToRootComment(this.comments, newComment.parent_id, newComment);
                    if (!added) {
                        console.error("Parent comment not found for parent_id:", newComment.parent_id);
                    }
                }

                toast.success('پاسخ کامنت با موفقیت ثبت شد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });

                this.closeReplyCommentModal();

            } catch (error) {
                console.error(error);
                this.errors = error.response.data.errors;
            } finally {
                this.replyCommentLoading = false;
            }
        },
        addReplyToRootComment(comments, parentId, newComment) {
            for (const comment of comments) {
                if (comment.id === parentId) {
                    comment.children.push(newComment);
                    return true;
                }

                if (comment.children && comment.children.length > 0) {
                    const parentFoundInChild = this.findParentInChildren(comment.children, parentId);
                    if (parentFoundInChild) {
                        comment.children.push(newComment);
                        return true;
                    }
                }
            }
            return false;
        },
        findParentInChildren(children, parentId) {
            for (const child of children) {
                if (child.id === parentId) {
                    return true;
                }
                if (child.children && child.children.length > 0) {
                    const found = this.findParentInChildren(child.children, parentId);
                    if (found) return true;
                }
            }
            return false;
        },

    },
    mounted() {
        this.updateUrlAndFetchData();
    },
}
</script>
<style scoped>

.childs::before {
    display: block;
    content: '';
    position: absolute;
    top: -1.55rem;
    left: 0.7rem;
    width: 2px;
    height: 100%;
    background-color: #d1d5db;
    /* gray-300 */
}

.child-line::before {
    content: '';
    position: absolute;
    top: 20%;
    left: -0.5rem;
    width: 0.5rem;
    height: 2px;
    background-color: #d1d5db;
    transform: translateY(-50%);
}

.dark .childs::before,
.dark .child-line::before {
    background-color: #374151;
    /* gray-700 */
}

:dir(rtl) .childs::before {
    left: auto;
    right: 0.7rem;
}

:dir(rtl) .child-line::before {
    left: auto;
    right: -0.5rem;
}


.last-child::after {
    content: "";
    display: block;
    position: absolute;
    left: -0.6rem;
    top: calc(20% + 5px);
    width: 5px;
    height: calc(80% + 5px);
    background: #ffffff;
}

:dir(rtl) .last-child::after {
    left: auto;
    right: -0.6rem;
}

.dark .last-child::after {
    background: #111827;
}
</style>