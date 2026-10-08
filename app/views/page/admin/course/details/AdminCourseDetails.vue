<template>
    <AdminMasterPage
        :breadcrumb-title-override="course?.title"
        :breadcrumb-last-override="course?.title">
        <template #breadcrumb-actions>
            <router-link
                v-if="course"
                :to="{ name: 'admin-course-edit', params: { courseSlug: courseSlug } }"
                class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        ویرایش دوره
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
        <div v-if="course" >
            <div class="mb-4 p-4 md:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-br from-white via-white to-gray-50/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/40 shadow-sm">
                <div class="flex flex-col md:flex-row md:justify-between gap-6">
                    <div class="order-1 md:order-0">
                        <div class="flex items-center md:flex-wrap gap-1">
                            <div class="shrink-0 text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.4" d="M2.44922 14.9702C3.51922 18.4102 6.39923 21.0602 9.97923 21.7902" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M2.05078 10.98C2.56078 5.93 6.82078 2 12.0008 2C17.1808 2 21.4408 5.94 21.9508 10.98" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M14.0098 21.8C17.5798 21.07 20.4498 18.45 21.5398 15.02" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </div>
                            <div class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                <span class="w-1 h-1 rounded-full bg-gray-700 dark:bg-gray-200 me-2"></span>
                                <span>{{ course.status.title }}</span>
                            </div>
                            <div class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                <span class="w-1 h-1 rounded-full bg-gray-700 dark:bg-gray-200 me-2"></span>
                                <span>{{ course.level.title }}</span>
                            </div>
                            <div class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                <span class="w-1 h-1 rounded-full bg-gray-700 dark:bg-gray-200 me-2"></span>
                                <span>{{ course.publish ? 'منتشرشده' : 'پیش‌نویس' }}</span>
                            </div>
                        </div>
                        <h3 class="mt-0.5 w-max text-lg font-bold text-gray-700 dark:text-gray-100">{{ course.english_title }}</h3>
                        <div class="mt-3 flex flex-wrap gap-1.5 items-center">
                            <div v-for="(cat, i) in course.categories" :key="i"
                                class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-300 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                <span>{{ cat.title }}</span>
                            </div>
                        </div>
                        <div class="mt-3 flex items-center text-xs font-medium text-gray-800 dark:text-gray-100">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5.50063L11.4596 6.02073C11.463 6.02421 11.4664 6.02765 11.4698 6.03106L12 5.50063ZM8.96173 18.9109L8.49742 19.4999L8.96173 18.9109ZM15.0383 18.9109L14.574 18.3219L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM13.4698 8.03034C13.7627 8.32318 14.2376 8.32309 14.5304 8.03014C14.8233 7.7372 14.8232 7.26232 14.5302 6.96948L13.4698 8.03034ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55955 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917ZM11.4698 6.03106L13.4698 8.03034L14.5302 6.96948L12.5302 4.97021L11.4698 6.03106Z" fill="currentColor"></path>
                            </svg>
                            <span class="ms-1.5">{{ course.likesCount }}&nbsp; لایک</span>
                            <span class="w-0.5 h-0.5 rounded-full bg-gray-500 dark:bg-gray-200 mx-2"></span>
                            <svg class="w-5 h-5" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 12.9543C5.51239 14.0398 5.95555 15.076 6.73197 15.8348C7.50838 16.5936 8.55445 17.0128 9.64 17.0003H10.2L11.86 18.7323C12.0291 18.9036 12.2598 19 12.5005 19C12.7412 19 12.9719 18.9036 13.141 18.7323L14.8 17.0003H15.36C16.4456 17.0128 17.4916 16.5936 18.268 15.8348C19.0444 15.076 19.4876 14.0398 19.5 12.9543V8.04428C19.4731 5.7845 17.6198 3.97417 15.36 4.00028H9.64C7.38021 3.97417 5.5269 5.7845 5.5 8.04428V12.9543Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M9.5 8.25024C9.08579 8.25024 8.75 8.58603 8.75 9.00024C8.75 9.41446 9.08579 9.75024 9.5 9.75024V8.25024ZM15.5 9.75024C15.9142 9.75024 16.25 9.41446 16.25 9.00024C16.25 8.58603 15.9142 8.25024 15.5 8.25024V9.75024ZM9.5 11.2502C9.08579 11.2502 8.75 11.586 8.75 12.0002C8.75 12.4145 9.08579 12.7502 9.5 12.7502V11.2502ZM15.5 12.7502C15.9142 12.7502 16.25 12.4145 16.25 12.0002C16.25 11.586 15.9142 11.2502 15.5 11.2502V12.7502ZM9.5 9.75024H15.5V8.25024H9.5V9.75024ZM9.5 12.7502H15.5V11.2502H9.5V12.7502Z" fill="currentColor"></path>
                            </svg>
                            <span class="ms-1.5">{{ course.commentsCount }} &nbsp; کامنت</span>
                            <span class="w-0.5 h-0.5 rounded-full bg-gray-500 dark:bg-gray-200 mx-2"></span>
                            <span class="font-medium text-gray-500 dark:text-gray-400">تاریخ ایجاد: &nbsp; {{ new Date(course.created_at).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                        </div>
                        <div class="mt-6 flex flex-wrap items-center gap-y-5 divide-x-2 rtl:divide-x-reverse divide-gray-100 dark:divide-gray-600">
                            <div class="h-10 space-y-3 px-4">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">مدت زمان</div>
                                <div class="text-gray-700 dark:text-gray-50 text-sm font-bold">{{ new Date(course.totalTime * 1000).toISOString().slice(11, 19) }}</div>
                            </div>
                            <div class="h-10 space-y-3 px-4">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">تعداد جلسات</div>
                                <div class="text-gray-700 dark:text-gray-50 text-sm font-bold">{{ course.episodesCount }}</div>
                            </div>
                            <div class="h-10 space-y-3 px-4">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">تعداد کاربران</div>
                                <div class="text-gray-700 dark:text-gray-50 text-sm font-bold">{{ course.usersCount }}</div>
                            </div>
                            <div class="h-10 space-y-3 px-4">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">نوع دوره</div>
                                <div class="text-gray-700 dark:text-gray-50 text-sm font-bold">{{ { free: 'رایگان', cash: 'نقدی', 'cash-vip': 'ویژه / نقدی' }[course.type] }}</div>
                            </div>
                            <div class="h-10 space-y-3 px-4">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">امتیاز</div>
                                <div dir="ltr" class="text-gray-700 dark:text-gray-50 text-sm font-bold flex items-center">
                                    <svg class="rtl:-mt-0.5 w-4 h-4 me-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" fill="#fed700"></path>
                                    </svg>
                                    {{ Number(course.averageRating).toFixed(2).replace(/\.?0+$/, '') }}
                                </div>
                            </div>
                            <div class="h-10 space-y-3 px-4">
                                <div class="text-xs font-semibold text-gray-400 dark:text-gray-500">بازدید</div>
                                <div class="text-gray-700 dark:text-gray-50 text-sm font-bold">{{ course.viewsCount }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="order-0 md:order-1 w-full md:w-72 lg:w-96 bg-gray-500 h-44 md:h-48 lg:h-56 overflow-hidden rounded-xl">
                        <img onerror="this.style.display='none'" :src="course.poster" :title="course.title"
                            class="w-full h-full object-cover sepia hover:sepia-0 duration-200" />
                    </div>
                </div>
                <div class="mt-6 flex items-center justify-between gap-3">
                    <div class="flex gap-1.5 items-center overflow-x-auto scrollbar-hide">
                        <span class="text-xs font-light text-gray-400 dark:text-gray-400">برچسب‌ها:</span>
                        <div v-for="(tag, i) in course.tags" :key="i"
                            class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-300 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                            <span>#&nbsp; {{ tag }}</span>
                        </div>
                    </div>
                    <div class="whitespace-nowrap font-bold text-gray-800 dark:text-gray-50">
                        <span v-if="course.price === 0">رایگان :)</span>
                        <span v-else class="flex items-center">
                            {{ course.price.toLocaleString() }}
                            <svg class="ms-1 w-3 h-3" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path class="text-gray-600 dark:text-white" d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878Z" fill="currentColor"></path>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="mt-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 shadow-sm">
                <TabGroup :selectedIndex="selectedTabIndex" @change="onTabChange">
                    <div class="relative z-10 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 pt-3 pb-2">
                        <AdminHorizontalScroll fade-variant="card">
                            <TabList :class="tabListClass">
                                <Tab v-for="tab in courseTabs" :key="tab.key" v-slot="{ selected }" as="template">
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
                    <AdminCourseOverview v-if="selectedSection === 'overview'" :courseSlug="courseSlug" @go-to-attachments="changeSections('attachments')" />
                    <AdminCourseEpisodes v-if="selectedSection === 'episodes'" :courseSlug="courseSlug" />
                    <AdminCourseUsers v-if="selectedSection === 'users'" :courseSlug="courseSlug" />
                    <AdminCourseComments v-if="selectedSection === 'comments'" :courseSlug="courseSlug" />
                    <AdminCourseQuizzes
                        v-if="selectedSection === 'quizzes'"
                        entity-type="course"
                        :entity-id="course?.id"
                        :entity-title="course?.title || course?.english_title || ''"
                    />
                    <AdminCourseAnalytics v-if="selectedSection === 'analytics'" :courseSlug="courseSlug" />
                    <AdminCourseViews v-if="selectedSection === 'views'" :courseSlug="courseSlug" />
                    <AdminCourseVideos v-if="selectedSection === 'videos'" :courseSlug="courseSlug" :courseId="course?.id" />
                    <AdminCourseAttachments v-if="selectedSection === 'attachments'" :courseSlug="courseSlug" :courseId="course?.id" />
                    <AdminCourseLikes v-if="selectedSection === 'likes'" :courseSlug="courseSlug" />
                    <AdminCourseBookmarks v-if="selectedSection === 'bookmarks'" :courseSlug="courseSlug" />
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
import AdminCourseOverview from "@/views/page/admin/course/details/AdminCourseOverview.vue";
import AdminCourseEpisodes from "@/views/page/admin/course/details/AdminCourseEpisodes.vue";
import AdminCourseUsers from "@/views/page/admin/course/details/AdminCourseUsers.vue";
import AdminCourseComments from "@/views/page/admin/course/details/AdminCourseComments.vue";
import AdminCourseQuizzes from "@/views/page/admin/course/details/AdminCourseQuizzes.vue";
import AdminCourseAnalytics from "@/views/page/admin/course/details/AdminCourseAnalytics.vue";
import AdminCourseViews from "@/views/page/admin/course/details/AdminCourseViews.vue";
import AdminCourseVideos from "@/views/page/admin/course/details/AdminCourseVideos.vue";
import AdminCourseAttachments from "@/views/page/admin/course/details/AdminCourseAttachments.vue";
import AdminCourseLikes from "@/views/page/admin/course/details/AdminCourseLikes.vue";
import AdminCourseBookmarks from "@/views/page/admin/course/details/AdminCourseBookmarks.vue";
export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        AdminHorizontalScroll,
        TabGroup, TabList, Tab,
        AdminCourseOverview,
        AdminCourseEpisodes,
        AdminCourseUsers,
        AdminCourseComments,
        AdminCourseQuizzes,
        AdminCourseAnalytics,
        AdminCourseViews,
        AdminCourseVideos,
        AdminCourseAttachments,
        AdminCourseLikes,
        AdminCourseBookmarks,
    },
    data() {
        const sections = ['overview', 'users', 'episodes', 'comments', 'quizzes', 'analytics', 'views', 'videos', 'attachments', 'likes', 'bookmarks']
        const courseTabs = [
            { key: 'overview', label: 'جزئیات' },
            { key: 'episodes', label: 'مدیریت سرفصل‌ها' },
            { key: 'users', label: 'مدیریت کاربران' },
            { key: 'comments', label: 'کامنت‌ها' },
            { key: 'quizzes', label: 'آزمون‌ها' },
            { key: 'analytics', label: 'آمار و نمودارها' },
            { key: 'views', label: 'بازدیدها' },
            { key: 'videos', label: 'ویدیوها' },
            { key: 'attachments', label: 'فایل‌های پیوست' },
            { key: 'likes', label: 'لایک‌ها' },
            { key: 'bookmarks', label: 'بوکمارک‌ها' },
        ]
        return {
            courseSlug: this.$route.params.courseSlug,
            selectedSection: sections.includes(this.$route.query.section) ? this.$route.query.section : sections[0],
            courseTabs,
            course: null,
            errors: null,
            loading: false,
            unapprovedCommentsCount: 0,
        };
    },
    computed: {
        tabListClass() {
            return [ADMIN_TAB_LIST, 'w-max min-w-0'];
        },
        tabBadgeClass() {
            return ADMIN_TAB_BADGE;
        },
        selectedTabIndex() {
            const idx = this.courseTabs.findIndex(t => t.key === this.selectedSection);
            return idx >= 0 ? idx : 0;
        },
    },
    methods: {
        tabButtonClass(selected) {
            return adminTabButtonClass(selected);
        },
        onTabChange(index) {
            const tab = this.courseTabs[index];
            if (tab) this.changeSections(tab.key);
        },
        changeSections(value) {
            this.selectedSection = value;
            this.buildQueryParams();
        },
        buildQueryParams() {
            let query = {};

            if (this.selectedSection !== "overview") {
                query.section = this.selectedSection;
            }

            const queryString = new URLSearchParams(query).toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

            window.history.pushState(null, "", newUrl);
        },
        async getCourse() {
            this.loading = true;
            await axiosInstance
                .post(`admin/course/${this.courseSlug}/baseDetails`)
                .then((response) => {
                    this.course = response.data.course;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        async fetchUnapprovedCommentsCount() {
            try {
                const response = await axiosInstance.post(
                    `admin/course/${this.courseSlug}/comments`,
                    {
                        page: 1,
                        perPage: 1,
                        approved: false,
                        order: 'desc',
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
    },

    mounted() {
        this.getCourse();
        this.fetchUnapprovedCommentsCount();
    }
};
</script>
<style></style>
