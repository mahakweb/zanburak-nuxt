<template>
    <!-- Card -->
    <div class="relative w-full p-[18px] z-10">
        <div :class="['h-full bg-white/80 dark:bg-gray-950/70 rounded-2xl p-5', 'before:absolute before:hover:rotate-3 before:hover:shadow-xl before:hover:shadow-gray-100/80 before:hover:dark:shadow-gray-900/80 before:duration-150 before:top-1.5 before:left-2 before:w-[calc(100%-1rem)] before:h-[calc(100%-2.2rem)] before:bg-white/30 before:dark:bg-gray-950/30 before:-z-10 before:rounded-2xl']">
            <div class="w-full flex flex-col h-full">
                <div v-if="type === 'course'" class="flex items-center">
                    <div class="me-4 w-24 md:w-32 h-16 md:h-20 rounded-box border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
                        <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-150" :src="comment.commentable.poster" :alt="comment.commentable.slug" />
                    </div>
                    <div class="flex-1 flex-col space-y-2">
                        <router-link :to="{ name: 'course.show', params: { courseSlug: comment.commentable.slug } }" class="font-bold text-md text-gray-700 dark:text-gray-50 line-clamp-1">{{ comment.commentable.title }}</router-link>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="me-2 w-7 h-7 rounded-full border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
                                    <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-150" :src="comment.commentable.teacher.profile_pic" :alt="comment.commentable.teacher.username" />
                                </div>
                                <span class="text-xs text-gray-400 line-clamp-1">{{ comment.commentable.teacher.first_name + " " + comment.commentable.teacher.last_name }}</span>
                            </div>
                            <button @click="openViewCommentModal" class="ms-1 flex items-center rounded-lg transition duration-200 bg-gray-200/40 hover:bg-gray-200/90 dark:bg-gray-200/10 dark:hover:bg-gray-200/20 text-gray-700 dark:text-gray-50 px-2 py-1 justify-center text-xs font-semibold h-6">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3.9074 8.65134L3.26013 8.27246H3.26013L3.9074 8.65134ZM20.0926 8.65134L20.7399 8.27246V8.27246L20.0926 8.65134ZM20.0926 15.3487L19.4453 14.9698L20.0926 15.3487ZM3.9074 15.3487L4.55466 14.9698L3.9074 15.3487ZM4.55466 9.03021C7.89524 3.32326 16.1048 3.32326 19.4453 9.03021L20.7399 8.27246C16.82 1.57585 7.18 1.57585 3.26013 8.27246L4.55466 9.03021ZM19.4453 9.03021C20.5182 10.8631 20.5182 13.1369 19.4453 14.9698L20.7399 15.7275C22.0867 13.4266 22.0867 10.5734 20.7399 8.27246L19.4453 9.03021ZM19.4453 14.9698C16.1048 20.6767 7.89523 20.6767 4.55466 14.9698L3.26013 15.7275C7.18 22.4242 16.82 22.4242 20.7399 15.7275L19.4453 14.9698ZM4.55466 14.9698C3.48178 13.1369 3.48178 10.8631 4.55466 9.03021L3.26013 8.27246C1.91329 10.5734 1.91329 13.4266 3.26013 15.7275L4.55466 14.9698ZM14.8067 12.0607C14.8067 13.6528 13.5387 14.9233 11.9994 14.9233V16.4233C14.3887 16.4233 16.3067 14.4595 16.3067 12.0607H14.8067ZM11.9994 14.9233C10.4605 14.9233 9.19331 13.6531 9.19331 12.0607H7.69331C7.69331 14.4592 9.60988 16.4233 11.9994 16.4233V14.9233ZM9.19331 12.0607C9.19331 10.467 10.4606 9.19699 11.9994 9.19699V7.69699C9.60973 7.69699 7.69331 9.66125 7.69331 12.0607H9.19331ZM11.9994 9.19699C13.5385 9.19699 14.8067 10.4673 14.8067 12.0607H16.3067C16.3067 9.66094 14.3888 7.69699 11.9994 7.69699V9.19699Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                                <span class="ms-1 hidden md:block">{{ $t('comment.view') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else-if="type === 'episode'" class="flex flex-col items-center">
                    <div class="flex items-center w-full">
                        <div class="me-4 w-24 md:w-32 h-16 md:h-20 rounded-box border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
                            <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-150" :src="comment.commentable.course.poster" :alt="comment.commentable.course.slug" />
                        </div>
                        <div class="flex-1 flex-col space-y-2">
                            <router-link :to="episodeShowRoute(comment.commentable.course.slug, comment.commentable.order)" class="font-bold text-md text-gray-700 dark:text-gray-50 line-clamp-1">{{ comment.commentable.title }}</router-link>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="me-2 w-7 h-7 rounded-full border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
                                        <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-150" :src="comment.commentable.course.teacher.profile_pic" :alt="comment.commentable.course.teacher.username" />
                                    </div>
                                    <span class="text-xs text-gray-400 line-clamp-1">{{ comment.commentable.course.teacher.first_name + " " + comment.commentable.course.teacher.last_name }}</span>
                                </div>

                                <button @click="openViewCommentModal" class="ms-1 flex items-center rounded-lg transition duration-200 bg-gray-200/40 hover:bg-gray-200/90 dark:bg-gray-200/10 dark:hover:bg-gray-200/20 text-gray-700 dark:text-gray-50 px-2 py-1 justify-center text-xs font-semibold h-6">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3.9074 8.65134L3.26013 8.27246H3.26013L3.9074 8.65134ZM20.0926 8.65134L20.7399 8.27246V8.27246L20.0926 8.65134ZM20.0926 15.3487L19.4453 14.9698L20.0926 15.3487ZM3.9074 15.3487L4.55466 14.9698L3.9074 15.3487ZM4.55466 9.03021C7.89524 3.32326 16.1048 3.32326 19.4453 9.03021L20.7399 8.27246C16.82 1.57585 7.18 1.57585 3.26013 8.27246L4.55466 9.03021ZM19.4453 9.03021C20.5182 10.8631 20.5182 13.1369 19.4453 14.9698L20.7399 15.7275C22.0867 13.4266 22.0867 10.5734 20.7399 8.27246L19.4453 9.03021ZM19.4453 14.9698C16.1048 20.6767 7.89523 20.6767 4.55466 14.9698L3.26013 15.7275C7.18 22.4242 16.82 22.4242 20.7399 15.7275L19.4453 14.9698ZM4.55466 14.9698C3.48178 13.1369 3.48178 10.8631 4.55466 9.03021L3.26013 8.27246C1.91329 10.5734 1.91329 13.4266 3.26013 15.7275L4.55466 14.9698ZM14.8067 12.0607C14.8067 13.6528 13.5387 14.9233 11.9994 14.9233V16.4233C14.3887 16.4233 16.3067 14.4595 16.3067 12.0607H14.8067ZM11.9994 14.9233C10.4605 14.9233 9.19331 13.6531 9.19331 12.0607H7.69331C7.69331 14.4592 9.60988 16.4233 11.9994 16.4233V14.9233ZM9.19331 12.0607C9.19331 10.467 10.4606 9.19699 11.9994 9.19699V7.69699C9.60973 7.69699 7.69331 9.66125 7.69331 12.0607H9.19331ZM11.9994 9.19699C13.5385 9.19699 14.8067 10.4673 14.8067 12.0607H16.3067C16.3067 9.66094 14.3888 7.69699 11.9994 7.69699V9.19699Z"
                                            fill="currentColor"
                                        ></path>
                                    </svg>
                                    <span class="ms-1 hidden md:block">{{ $t('comment.view') }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <router-link :to="{ name: 'course.show', params: { courseSlug: comment.commentable.course.slug } }" class="mt-3 flex items-center text-center font-semibold text-sm line-clamp-1 text-gray-600 dark:text-gray-100 hover:text-amber-400 bg-gray-100 dark:bg-gray-800 rounded-lg py-1 px-2 w-full justify-center">
                        <svg class="w-4 h-4 me-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4822 3.95133C15.51 4.42655 17.1316 5.91484 17.6838 7.83499L18.458 7.37444C20.4352 6.1981 23 7.55122 23 9.77073L23 14.5944C23 16.6951 20.6776 18.0613 18.7037 17.1219L17.5485 16.572C16.8965 18.2938 15.3643 19.6076 13.4822 20.0487C10.9345 20.6457 8.24347 20.653 5.69246 20.0551C3.59198 19.5629 1.96547 17.9809 1.49366 15.9713L1.42818 15.6925C0.857273 13.2608 0.857274 10.7392 1.42818 8.30754L1.49366 8.02865C1.96547 6.0191 3.59198 4.43714 5.69246 3.94488C8.24347 3.34704 10.9345 3.35426 13.4822 3.95133ZM17.9906 14.8481C18.3134 13.1277 18.3414 11.3698 18.0745 9.64278L19.4213 8.84156C20.188 8.38543 21.1825 8.9101 21.1825 9.77073L21.1825 14.5944C21.1825 15.4089 20.2819 15.9387 19.5166 15.5744L17.9906 14.8481Z" fill="currentColor"></path>
                        </svg>
                        <span class="">{{ comment.commentable.course.title }}</span>
                    </router-link>
                </div>
                <div v-if="type === 'path'" class="flex items-center">
                    <div class="me-4 w-24 md:w-32 h-16 md:h-20 rounded-box border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
                        <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-150" :src="comment.commentable.poster" :alt="comment.commentable.slug" />
                    </div>
                    <div class="flex-1 flex-col space-y-2">
                        <router-link :to="{ name: 'course.show', params: { courseSlug: comment.commentable.slug } }" class="font-bold text-md text-gray-700 dark:text-gray-50 line-clamp-1">{{ $t('comment.learning', { title: comment.commentable.title }) }}</router-link>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="me-2 w-7 h-7 rounded-full border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
                                    <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-150" :src="currentUser.profile_pic" :alt="currentUser.username" />
                                </div>
                                <span class="text-xs text-gray-400 line-clamp-1">{{ currentUser.first_name + " " + currentUser.last_name }}</span>
                            </div>
                            <button @click="openViewCommentModal" class="ms-1 flex items-center rounded-lg transition duration-200 bg-gray-200/40 hover:bg-gray-200/90 dark:bg-gray-200/10 dark:hover:bg-gray-200/20 text-gray-700 dark:text-gray-50 px-2 py-1 justify-center text-xs font-semibold h-6">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3.9074 8.65134L3.26013 8.27246H3.26013L3.9074 8.65134ZM20.0926 8.65134L20.7399 8.27246V8.27246L20.0926 8.65134ZM20.0926 15.3487L19.4453 14.9698L20.0926 15.3487ZM3.9074 15.3487L4.55466 14.9698L3.9074 15.3487ZM4.55466 9.03021C7.89524 3.32326 16.1048 3.32326 19.4453 9.03021L20.7399 8.27246C16.82 1.57585 7.18 1.57585 3.26013 8.27246L4.55466 9.03021ZM19.4453 9.03021C20.5182 10.8631 20.5182 13.1369 19.4453 14.9698L20.7399 15.7275C22.0867 13.4266 22.0867 10.5734 20.7399 8.27246L19.4453 9.03021ZM19.4453 14.9698C16.1048 20.6767 7.89523 20.6767 4.55466 14.9698L3.26013 15.7275C7.18 22.4242 16.82 22.4242 20.7399 15.7275L19.4453 14.9698ZM4.55466 14.9698C3.48178 13.1369 3.48178 10.8631 4.55466 9.03021L3.26013 8.27246C1.91329 10.5734 1.91329 13.4266 3.26013 15.7275L4.55466 14.9698ZM14.8067 12.0607C14.8067 13.6528 13.5387 14.9233 11.9994 14.9233V16.4233C14.3887 16.4233 16.3067 14.4595 16.3067 12.0607H14.8067ZM11.9994 14.9233C10.4605 14.9233 9.19331 13.6531 9.19331 12.0607H7.69331C7.69331 14.4592 9.60988 16.4233 11.9994 16.4233V14.9233ZM9.19331 12.0607C9.19331 10.467 10.4606 9.19699 11.9994 9.19699V7.69699C9.60973 7.69699 7.69331 9.66125 7.69331 12.0607H9.19331ZM11.9994 9.19699C13.5385 9.19699 14.8067 10.4673 14.8067 12.0607H16.3067C16.3067 9.66094 14.3888 7.69699 11.9994 7.69699V9.19699Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                                <span class="ms-1 hidden md:block">{{ $t('comment.view') }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="my-3 mx-2 h-[1.5px]" :class="[comment.approved ? 'bg-green-500/50 dark:bg-green-400/50' : 'bg-pink-500/60 dark:bg-pink-400/80']"></div>
                <div class="flex-grow overflow-hidden text-ellipsis rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-50 font-light text-sm py-2 px-2">
                    <div v-text="comment.comment" class="line-clamp-4 leading-relaxed"></div>
                </div>
            </div>
        </div>
    </div>
    <!-- End Card -->
    <BottomSheetDrawer v-model="isOpenViewCommentModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
        :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
        :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
        <div class="flex items-center justify-end mb-4">
            <button type="button"
                class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                @click="closeViewCommentModal">
                <span class="sr-only">Close</span>
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div class="relative flex flex-col">
                                <!-- Modal Header -->

                                <!-- Modal Body (Scrollable part) -->
                                <div class="flex-grow overflow-y-auto mb-4 min-h-[30vh] max-h-[60vh] bg-gray-50 dark:bg-cyan-700/10 p-2 md:p-3 rounded-xl text-gray-500 dark:text-gray-300 text-sm font-light text-start">
                                    <MarkdownRenderer startClass="rendered-content leading-7" :source="comment.comment" />
                                </div>

                                <!-- Modal Footer -->
                                <div class="flex-shrink-0 flex items-center justify-between">
                                    <button @click="closeViewCommentModal" type="button" class="h-8 py-2 px-3 text-xs font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">{{ $t('comment.cancelAndClose') }}</button>
                                    <div class="text-xs font-medium py-2 px-3 rounded-lg bg-gray-50 dark:bg-cyan-700/10 text-gray-500 dark:text-gray-400">{{ $t('comment.submittedAgo', { time: timeAgo(comment.created_at) }) }}</div>
                                </div>
        </div>
    </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import { episodeShowRoute } from "@/utils/episodeRoute";
import moment from "moment";
import "moment/locale/fa";
export default {
    components: {
        BottomSheetDrawer,
        MarkdownRenderer,
    },
    props: {
        comment: Object,
        type: String,
    },
    data() {
        return {
            isOpenViewCommentModal: false,
        };
    },
    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
    },
    methods: {
        episodeShowRoute,
        timeAgo(date) {
            moment.locale(this.$i18n.locale === "en" ? "en" : "fa");
            return moment(date).fromNow();
        },
        closeViewCommentModal() {
            this.isOpenViewCommentModal = false;
        },
        openViewCommentModal() {
            this.isOpenViewCommentModal = true;
        },
    },
    mounted() {},
};
</script>

<style></style>
