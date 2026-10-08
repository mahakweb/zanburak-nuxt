<script setup>
definePageMeta({
  name: "admin-episode-details",
  middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage
        :breadcrumb-title-override="episode?.title"
        :breadcrumb-last-override="episode?.title">
        <template #breadcrumb-actions>
            <template v-if="episode">
                <button
                    type="button"
                    @click.prevent="togglePublish"
                    :disabled="quickActionLoading"
                    class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset] disabled:opacity-60">
                    <span class="block group-active:[transform:translate3d(0,1px,0)]">
                        {{ episode.publish ? 'منتشر شده' : 'پیش‌نویس' }}
                    </span>
                </button>
                <button
                    type="button"
                    @click.prevent="toggleLock"
                    :disabled="quickActionLoading"
                    class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset] disabled:opacity-60">
                    <span class="block group-active:[transform:translate3d(0,1px,0)]">
                        {{ episode.lock ? 'قفل شده' : 'باز' }}
                    </span>
                </button>
                <button
                    type="button"
                    @click.prevent="copyEpisodeLink"
                    class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                    <span class="block group-active:[transform:translate3d(0,1px,0)]">کپی لینک</span>
                </button>
                <a
                    :href="episodePreviewUrl"
                    target="_blank"
                    class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                    <span class="block group-active:[transform:translate3d(0,1px,0)]">پیش‌نمایش</span>
                </a>
                <router-link
                    :to="{ name: 'admin-episode-edit', params: { courseSlug: courseSlug, sectionSlug: sectionSlug, episodeSlug: episodeSlug } }"
                    class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                    <span class="block group-active:[transform:translate3d(0,1px,0)]">
                        <span class="flex items-center">
                            ویرایش جلسه
                            <svg class="w-4 h-4 ms-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M15.5395 3C14.6303 3 13.7583 3.3599 13.1154 4.00052L9.07222 8.02925C7.21527 9.87957 5.89791 12.198 5.26098 14.7366L5.06561 15.5153C4.86299 16.3229 5.59714 17.0544 6.40764 16.8525L7.1891 16.6578C9.73681 16.0232 12.0635 14.7105 13.9205 12.8602L17.9636 8.83146C18.6066 8.19084 18.9678 7.32196 18.9678 6.41599C18.9678 4.52939 17.4329 3 15.5395 3ZM14.3776 7.57378C14.9965 8.19047 15.714 8.45317 16.2462 8.36088L16.8688 7.74049C17.2213 7.38921 17.4194 6.91278 17.4194 6.41599C17.4194 5.38149 16.5777 4.54286 15.5395 4.54286C15.041 4.54286 14.5628 4.7402 14.2103 5.09149L13.5877 5.71187C13.495 6.24217 13.7587 6.95709 14.3776 7.57378Z"
                                    fill="currentColor"></path>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M4 20.2286C4 19.8025 4.34662 19.4571 4.77419 19.4571H19.2258C19.6534 19.4571 20 19.8025 20 20.2286C20 20.6546 19.6534 21 19.2258 21H4.77419C4.34662 21 4 20.6546 4 20.2286Z"
                                    fill="currentColor"></path>
                            </svg>
                        </span>
                    </span>
                </router-link>
            </template>
        </template>
        <div v-if="episode">
            <div class="mb-4 p-4 md:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-br from-white via-white to-gray-50/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/40 shadow-sm">
                <div class="flex flex-col md:flex-row md:justify-between gap-6">
                    <div class="order-1 md:order-0 min-w-0">
                        <div class="flex items-center md:flex-wrap gap-1">
                            <div class="shrink-0 text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                <span class="w-1 h-1 rounded-full bg-gray-700 dark:bg-gray-200 me-2"></span>
                                <span>جلسه {{ episode.order }}</span>
                            </div>
                            <div class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                <span class="w-1 h-1 rounded-full bg-gray-700 dark:bg-gray-200 me-2"></span>
                                <span>{{ episode.publish ? 'منتشرشده' : 'پیش‌نویس' }}</span>
                            </div>
                            <div class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                <span class="w-1 h-1 rounded-full bg-gray-700 dark:bg-gray-200 me-2"></span>
                                <span>{{ episode.lock ? 'قفل شده' : 'باز' }}</span>
                            </div>
                        </div>

                        <h3 v-if="episode.english_title" class="mt-0.5 text-lg font-bold text-gray-700 dark:text-gray-100">
                            {{ episode.english_title }}
                        </h3>
                        <h3 v-else class="mt-0.5 text-lg font-bold text-gray-700 dark:text-gray-100">
                            {{ episode.title }}
                        </h3>

                        <div v-if="episode.course" class="mt-3 flex flex-wrap gap-1.5 items-center">
                            <router-link
                                :to="{ name: 'admin-course-details', params: { courseSlug: episode.course.slug } }"
                                class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-300 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg hover:bg-gray-200/70 dark:hover:bg-gray-700/50 transition-colors">
                                {{ episode.course.title }}
                            </router-link>
                            <div
                                v-if="episode.section?.title"
                                class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-300 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                {{ episode.section.title }}
                            </div>
                        </div>

                        <div class="mt-3 flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 flex-wrap gap-y-1">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5.50063L11.4596 6.02073C11.463 6.02421 11.4664 6.02765 11.4698 6.03106L12 5.50063ZM8.96173 18.9109L8.49742 19.4999L8.96173 18.9109ZM15.0383 18.9109L14.574 18.3219L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM13.4698 8.03034C13.7627 8.32318 14.2376 8.32309 14.5304 8.03014C14.8233 7.7372 14.8232 7.26232 14.5302 6.96948L13.4698 8.03034ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55955 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917ZM11.4698 6.03106L13.4698 8.03034L14.5302 6.96948L12.5302 4.97021L11.4698 6.03106Z" fill="currentColor"></path>
                            </svg>
                            <span class="ms-1.5">{{ statistics.likes_count }}&nbsp; لایک</span>
                            <span class="w-0.5 h-0.5 rounded-full bg-gray-500 dark:bg-gray-200 mx-2"></span>
                            <svg class="w-5 h-5" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 12.9543C5.51239 14.0398 5.95555 15.076 6.73197 15.8348C7.50838 16.5936 8.55445 17.0128 9.64 17.0003H10.2L11.86 18.7323C12.0291 18.9036 12.2598 19 12.5005 19C12.7412 19 12.9719 18.9036 13.141 18.7323L14.8 17.0003H15.36C16.4456 17.0128 17.4916 16.5936 18.268 15.8348C19.0444 15.076 19.4876 14.0398 19.5 12.9543V8.04428C19.4731 5.7845 17.6198 3.97417 15.36 4.00028H9.64C7.38021 3.97417 5.5269 5.7845 5.5 8.04428V12.9543Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M9.5 8.25024C9.08579 8.25024 8.75 8.58603 8.75 9.00024C8.75 9.41446 9.08579 9.75024 9.5 9.75024V8.25024ZM15.5 9.75024C15.9142 9.75024 16.25 9.41446 16.25 9.00024C16.25 8.58603 15.9142 8.25024 15.5 8.25024V9.75024ZM9.5 11.2502C9.08579 11.2502 8.75 11.586 8.75 12.0002C8.75 12.4145 9.08579 12.7502 9.5 12.7502V11.2502ZM15.5 12.7502C15.9142 12.7502 16.25 12.4145 16.25 12.0002C16.25 11.586 15.9142 11.2502 15.5 11.2502V12.7502ZM9.5 9.75024H15.5V8.25024H9.5V9.75024ZM9.5 12.7502H15.5V11.2502H9.5V12.7502Z" fill="currentColor"></path>
                            </svg>
                            <span class="ms-1.5">{{ statistics.comments_count }} &nbsp; کامنت</span>
                            <span class="w-0.5 h-0.5 rounded-full bg-gray-500 dark:bg-gray-200 mx-2"></span>
                            <span class="font-medium text-gray-500 dark:text-gray-400">تاریخ ایجاد: &nbsp; {{ formatDate(episode.created_at) }}</span>
                        </div>

                        <div class="mt-6 flex flex-wrap items-center gap-y-5 divide-x-2 rtl:divide-x-reverse divide-gray-100 dark:divide-gray-600">
                            <div class="h-10 space-y-3 px-4 first:ps-0">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">مدت زمان</div>
                                <div class="text-gray-700 dark:text-gray-50 text-sm font-bold">{{ episodeDuration }}</div>
                            </div>
                            <div class="h-10 space-y-3 px-4">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">بازدید</div>
                                <div class="text-gray-700 dark:text-gray-50 text-sm font-bold">{{ statistics.views_count }}</div>
                            </div>
                            <div class="h-10 space-y-3 px-4">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">بوکمارک</div>
                                <div class="text-gray-700 dark:text-gray-50 text-sm font-bold">{{ statistics.bookmarks_count }}</div>
                            </div>
                            <div class="h-10 space-y-3 px-4">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">تاریخ انتشار</div>
                                <div class="text-gray-700 dark:text-gray-50 text-sm font-bold">
                                    {{ episode.publish_date ? formatDate(episode.publish_date) : 'تعیین نشده' }}
                                </div>
                            </div>
                            <div class="h-10 space-y-3 px-4">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">وضعیت</div>
                                <div class="text-gray-700 dark:text-gray-50 text-sm font-bold">
                                    {{ episode.publish ? 'منتشرشده' : 'پیش‌نویس' }}
                                    ·
                                    {{ episode.lock ? 'قفل' : 'باز' }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="order-0 md:order-1 w-full md:w-72 lg:w-96 h-44 md:h-48 lg:h-56 overflow-hidden rounded-xl bg-gray-500">
                        <div v-if="rawVideoUrl" class="w-full h-full bg-black">
                            <VideoPlayer
                                :source="rawVideoUrl"
                                :title="episode.title"
                                :poster="null"
                                :is-logged-in="true"
                            />
                        </div>
                        <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700">
                            <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.25">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div v-if="episode.title && episode.english_title" class="mt-6 flex items-center justify-between gap-3">
                    <div class="flex gap-1.5 items-center overflow-x-auto scrollbar-hide min-w-0">
                        <span class="text-xs font-light text-gray-400 dark:text-gray-400 shrink-0">عنوان:</span>
                        <div class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-300 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                            {{ episode.title }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 shadow-sm">
                <TabGroup :selectedIndex="selectedTabIndex" @change="onTabChange">
                    <div class="relative z-10 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 pt-3 pb-2">
                        <AdminHorizontalScroll fade-variant="card">
                            <TabList :class="tabListClass">
                                <Tab v-for="tab in episodeTabs" :key="tab.key" v-slot="{ selected }" as="template">
                                    <button type="button" :class="tabButtonClass(selected)">
                                        <span>{{ tab.label }}</span>
                                        <span v-if="tab.key === 'comments' && unapprovedCommentsCount > 0" :class="tabBadgeClass">{{ unapprovedCommentsCount }}</span>
                                    </button>
                                </Tab>
                            </TabList>
                        </AdminHorizontalScroll>
                    </div>
                </TabGroup>
                <div class="p-4 md:p-5 min-h-[12rem]">
                    <AdminEpisodeAnalytics v-if="selectedSection === 'analytics'" :courseSlug="courseSlug" :episodeSlug="episodeSlug" />
                    <AdminCourseQuizzes
                        v-if="selectedSection === 'quizzes'"
                        entity-type="episode"
                        :entity-id="episode?.id"
                        :entity-title="episode?.title || episode?.english_title || ''"
                    />
                    <AdminEpisodeComments v-if="selectedSection === 'comments'" :courseSlug="courseSlug" :episodeSlug="episodeSlug" />
                    <AdminEpisodeViews v-if="selectedSection === 'views'" :courseSlug="courseSlug" :episodeSlug="episodeSlug" />
                    <AdminEpisodeVideos
                        v-if="selectedSection === 'videos'"
                        :courseSlug="courseSlug"
                        :episodeSlug="episodeSlug"
                        :courseId="episode?.course?.id"
                        :episodeId="episode?.id"
                    />
                    <AdminEpisodeAttachments
                        v-if="selectedSection === 'attachments'"
                        :courseSlug="courseSlug"
                        :episodeSlug="episodeSlug"
                        :episodeId="episode?.id"
                    />
                    <AdminEpisodeLikes v-if="selectedSection === 'likes'" :courseSlug="courseSlug" :episodeSlug="episodeSlug" />
                    <AdminEpisodeBookmarks v-if="selectedSection === 'bookmarks'" :courseSlug="courseSlug" :episodeSlug="episodeSlug" />
                </div>
            </div>
        </div>
        <LoadingComponent v-if="loading" class="" />
    </AdminMasterPage>
</template>
<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import axiosInstance from "@/store/axiosInstance";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import AdminHorizontalScroll from "@/views/components/admin/AdminHorizontalScroll.vue";
import { ADMIN_TAB_LIST, ADMIN_TAB_BADGE, adminTabButtonClass } from "@/views/components/admin/adminTabStyles.js";
import AdminEpisodeVideos from "@/views/page/admin/course/details/episode/AdminEpisodeVideos.vue";
import AdminEpisodeComments from "@/views/page/admin/course/details/episode/AdminEpisodeComments.vue";
import AdminEpisodeLikes from "@/views/page/admin/course/details/episode/AdminEpisodeLikes.vue";
import AdminEpisodeBookmarks from "@/views/page/admin/course/details/episode/AdminEpisodeBookmarks.vue";
import AdminEpisodeViews from "@/views/page/admin/course/details/episode/AdminEpisodeViews.vue";
import AdminEpisodeAttachments from "@/views/page/admin/course/details/episode/AdminEpisodeAttachments.vue";
import AdminEpisodeAnalytics from "@/views/page/admin/course/details/episode/AdminEpisodeAnalytics.vue";
import AdminCourseQuizzes from "@/views/page/admin/course/details/AdminCourseQuizzes.vue";
import { toast } from "vue3-toastify";
import VideoPlayer from "@/views/components/player/VideoPlayer.vue";

export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        AdminHorizontalScroll,
        TabGroup, TabList, Tab,
        AdminEpisodeVideos,
        AdminEpisodeComments,
        AdminEpisodeLikes,
        AdminEpisodeBookmarks,
        AdminEpisodeViews,
        AdminEpisodeAttachments,
        AdminCourseQuizzes,
        AdminEpisodeAnalytics,
        VideoPlayer,
    },
    data() {
        const sections = ['analytics', 'quizzes', 'comments', 'views', 'videos', 'attachments', 'likes', 'bookmarks']
        const episodeTabs = [
            { key: 'analytics', label: 'آمار و نمودارها' },
            { key: 'quizzes', label: 'آزمون‌ها' },
            { key: 'comments', label: 'کامنت‌ها' },
            { key: 'views', label: 'بازدیدها' },
            { key: 'videos', label: 'ویدیوها' },
            { key: 'attachments', label: 'فایل‌های پیوست' },
            { key: 'likes', label: 'لایک‌ها' },
            { key: 'bookmarks', label: 'بوکمارک‌ها' },
        ]
        return {
            courseSlug: this.$route.params.courseSlug,
            sectionSlug: this.$route.params.sectionSlug,
            episodeSlug: this.$route.params.episodeSlug,
            selectedSection: sections.includes(this.$route.query.section) ? this.$route.query.section : sections[0],
            episodeTabs,
            episode: null,
            rawVideoUrl: null,
            statistics: {
                likes_count: 0,
                comments_count: 0,
                views_count: 0,
                bookmarks_count: 0,
            },
            errors: null,
            loading: false,
            quickActionLoading: false,
            unapprovedCommentsCount: 0,
        };
    },
    computed: {
        episodePreviewUrl() {
            if (!this.episode) return '#';
            return `/course/${this.courseSlug}/episode/${this.episode.order}`;
        },
        selectedTabIndex() {
            const idx = this.episodeTabs.findIndex(t => t.key === this.selectedSection);
            return idx >= 0 ? idx : 0;
        },
        tabListClass() {
            return [ADMIN_TAB_LIST, 'w-max min-w-0'];
        },
        tabBadgeClass() {
            return ADMIN_TAB_BADGE;
        },
        episodeDuration() {
            if (!this.episode?.total_time && this.episode?.total_time !== 0) return '00:00:00';
            try {
                return new Date(this.episode.total_time * 1000).toISOString().slice(11, 19);
            } catch (e) {
                return '00:00:00';
            }
        },
    },
    methods: {
        tabButtonClass(selected) {
            return adminTabButtonClass(selected);
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('fa-IR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        },
        onTabChange(index) {
            const tab = this.episodeTabs[index];
            if (tab) this.changeSections(tab.key);
        },
        changeSections(value) {
            this.selectedSection = value;
            this.buildQueryParams();
        },
        buildQueryParams() {
            let query = {};

            if (this.selectedSection !== "analytics") { // Default tab is now analytics
                query.section = this.selectedSection;
            }

            const queryString = new URLSearchParams(query).toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

            window.history.pushState(null, "", newUrl);
        },
        async getEpisode() {
            this.loading = true;
            try {
                const response = await axiosInstance.post(
                    `admin/course/${this.courseSlug}/episode/${this.episodeSlug}/details`,
                    { data_type: 'overview' }
                );
                this.episode = response.data.episode;
                this.statistics = response.data.statistics;
                this.rawVideoUrl = response.data.raw_video_url || null;
            } catch (error) {
                console.error('Error fetching episode details:', error);
                console.error('Error response:', error.response?.data);
            } finally {
                this.loading = false;
            }
        },
        async fetchUnapprovedCommentsCount() {
            try {
                const response = await axiosInstance.post(
                    `admin/course/${this.courseSlug}/episode/${this.episodeSlug}/details`,
                    {
                        data_type: 'comments',
                        page: 1,
                        perPage: 1,
                        sort: 'desc',
                        filter: 'unapproved',
                        viewMode: 'table'
                    }
                );
                if (response.data && response.data.pagination) {
                    this.unapprovedCommentsCount = response.data.pagination.total || 0;
                }
            } catch (error) {
                console.error('Error fetching unapproved comments count:', error);
            }
        },
        decreaseUnapprovedCount() {
            if (this.unapprovedCommentsCount > 0) {
                this.unapprovedCommentsCount -= 1;
            }
            // Also decrease from Vuex
            this.$store.dispatch('adminComments/decreaseUnapprovedComments');
        },
        async togglePublish() {
            this.quickActionLoading = true;
            try {
                await axiosInstance.post(
                    `admin/course/${this.courseSlug}/episode/status`,
                    {
                        episode_id: this.episode.id,
                        publish: !this.episode.publish
                    }
                );
                this.episode.publish = !this.episode.publish;
                toast.success(`اپیزود ${this.episode.publish ? 'منتشر' : 'غیرمنتشر'} شد.`, {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } catch (error) {
                console.error('Error toggling publish:', error);
                toast.error('خطا در تغییر وضعیت انتشار', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.quickActionLoading = false;
            }
        },
        async toggleLock() {
            this.quickActionLoading = true;
            try {
                await axiosInstance.post(
                    `admin/course/${this.courseSlug}/episode/status`,
                    {
                        episode_id: this.episode.id,
                        lock: !this.episode.lock
                    }
                );
                this.episode.lock = !this.episode.lock;
                toast.success(`اپیزود ${this.episode.lock ? 'قفل' : 'باز'} شد.`, {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } catch (error) {
                console.error('Error toggling lock:', error);
                toast.error('خطا در تغییر وضعیت قفل', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.quickActionLoading = false;
            }
        },
        copyEpisodeLink() {
            const link = `${window.location.origin}${this.episodePreviewUrl}`;
            navigator.clipboard.writeText(link).then(() => {
                toast.success('لینک کپی شد', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }).catch(() => {
                toast.error('خطا در کپی لینک', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            });
        },
    },
    mounted() {
        this.getEpisode();
        this.fetchUnapprovedCommentsCount();
    }
};
</script>
<style></style>
