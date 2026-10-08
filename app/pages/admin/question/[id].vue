<script setup>
definePageMeta({
  name: "admin-question-details",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage
        :breadcrumb-title-override="question?.subject"
        :breadcrumb-last-override="question?.subject">
        <template #breadcrumb-actions>
                    <router-link :to="{ name: 'admin-questions' }"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                بازگشت به لیست
                                <svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </span>
                        </span></router-link>
                    <button type="button" @click.prevent="editQuestion"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                ویرایش سوال
                                <svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </span>
                        </span></button>
                    <button type="button" @click="refreshData"
                        class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                بروزرسانی داده‌ها
                                <svg class="w-5 h-5 rtl:ms-1 -mt-0.5" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24" />
                                        <path
                                            d="M12,8 L8,8 C5.790861,8 4,9.790861 4,12 L4,13 C4,14.6568542 5.34314575,16 7,16 L7,18 C4.23857625,18 2,15.7614237 2,13 L2,12 C2,8.6862915 4.6862915,6 8,6 L12,6 L12,4.72799742 C12,4.62015048 12.0348702,4.51519416 12.0994077,4.42878885 C12.264656,4.2075478 12.5779675,4.16215674 12.7992086,4.32740507 L15.656242,6.46136716 C15.6951359,6.49041758 15.7295917,6.52497737 15.7585249,6.56395854 C15.9231063,6.78569617 15.876772,7.09886961 15.6550344,7.263451 L12.798001,9.3840407 C12.7118152,9.44801079 12.607332,9.48254921 12.5,9.48254921 C12.2238576,9.48254921 12,9.25869158 12,8.98254921 L12,8 Z"
                                            fill="currentColor" />
                                        <path
                                            d="M12.0583175,16 L16,16 C18.209139,16 20,14.209139 20,12 L20,11 C20,9.34314575 18.6568542,8 17,8 L17,6 C19.7614237,6 22,8.23857625 22,11 L22,12 C22,15.3137085 19.3137085,18 16,18 L12.0583175,18 L12.0583175,18.9825492 C12.0583175,19.2586916 11.8344599,19.4825492 11.5583175,19.4825492 C11.4509855,19.4825492 11.3465023,19.4480108 11.2603165,19.3840407 L8.40328311,17.263451 C8.18154548,17.0988696 8.13521119,16.7856962 8.29979258,16.5639585 C8.32872576,16.5249774 8.36318164,16.4904176 8.40207551,16.4613672 L11.2591089,14.3274051 C11.48035,14.1621567 11.7936615,14.2075478 11.9589099,14.4287888 C12.0234473,14.5151942 12.0583175,14.6201505 12.0583175,14.7279974 L12.0583175,16 Z"
                                            fill="currentColor" opacity="0.3" />
                                    </g>
                                </svg>
                            </span>
                        </span></button>
        </template>
        <div class="min-w-0">
            <div v-if="question" class="mt-4 flex flex-wrap items-center justify-end gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-gray-400 dark:bg-gray-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">پیش‌نویس</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-emerald-400 dark:bg-emerald-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">منتشر شده</span>
                </div>
            </div>

            <div v-if="!loading && question" class="space-y-4 pt-2">
                <!-- Question Card -->
                <div class="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                    <div class="absolute w-1 h-full start-0 top-0 rounded-e-lg"
                        :class="getPublishBarClass(question)"></div>
                    <div class="p-4 ps-5">
                        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                            <div class="flex items-start gap-3 min-w-0 flex-1">
                                <div v-if="question.user"
                                    class="shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
                                    <img v-if="question.user.profile_pic" :src="question.user.profile_pic"
                                        :alt="question.user.first_name" class="w-full h-full object-cover"
                                        onerror="this.style.display='none'" />
                                    <div v-else class="w-full h-full flex items-center justify-center">
                                        <span class="text-yellow-500 text-sm font-semibold">{{
                                            question.user.first_name?.charAt(0) || '?' }}</span>
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                                        {{ question.subject }}
                                    </h3>
                                    <div class="flex flex-wrap gap-1.5">
                                        <span v-if="question.user"
                                            class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ question.user.first_name }} {{ question.user.last_name }}
                                        </span>
                                        <span v-if="question.category"
                                            class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ question.category.title }}
                                        </span>
                                        <span
                                            class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg font-anjoman">
                                            {{ question.answers_count || 0 }} پاسخ
                                        </span>
                                        <span
                                            class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ formatDate(question.created_at) }}
                                        </span>
                                        <span class="text-xs font-medium px-2 py-1 rounded-lg"
                                            :class="question.publish
                                                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/20'
                                                : 'text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50'">
                                            {{ question.publish ? 'منتشر شده' : 'پیش‌نویس' }}
                                        </span>
                                        <span v-if="question.is_private"
                                            class="text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-900/20 px-2 py-1 rounded-lg">
                                            خصوصی
                                        </span>
                                        <span v-if="question.best_answer || bestAnswer"
                                            class="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                                            پاسخ برتر دارد
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button @click="togglePublish"
                                class="shrink-0 text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 px-3 py-1.5 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-400/10 border border-yellow-200/60 dark:border-yellow-700/40 transition-colors">
                                {{ question.publish ? 'تبدیل به پیش‌نویس' : 'انتشار سوال' }}
                            </button>
                        </div>

                        <div class="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm rendered-content">
                            <MarkdownRenderer startClass="rendered-content" :source="question.question" />
                        </div>

                        <div v-if="question.tags && question.tags.length > 0" class="mt-3 flex flex-wrap gap-1.5">
                            <span v-for="tag in question.tags" :key="tag.id"
                                class="text-[11px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-lg">
                                {{ tag.name }}
                            </span>
                        </div>

                        <div v-if="question.is_private" class="mt-4">
                            <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">کاربران مجاز</div>
                            <div v-if="question.allowed_users && question.allowed_users.length > 0"
                                class="flex flex-wrap gap-1.5">
                                <div v-for="user in question.allowed_users" :key="user.id"
                                    class="inline-flex items-center gap-1 ps-1 pe-1.5 py-0.5 rounded-lg bg-gray-100/70 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                                    <div
                                        class="shrink-0 w-5 h-5 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                        <img v-if="user.profile_pic" :src="user.profile_pic" :alt="user.first_name"
                                            class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                        <span v-else class="text-[9px] font-semibold text-yellow-500">{{
                                            user.first_name?.charAt(0) || '?' }}</span>
                                    </div>
                                    <span class="text-[11px] font-medium text-gray-800 dark:text-gray-100">
                                        {{ user.first_name }}
                                        <span class="text-gray-400 dark:text-gray-500 font-normal">@{{ user.username
                                            }}</span>
                                    </span>
                                </div>
                            </div>
                            <p v-else class="text-xs text-gray-400 dark:text-gray-500">کاربر مجازی تعریف نشده است.</p>
                        </div>
                    </div>
                </div>

                <!-- Answers -->
                <div class="pt-2">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                            پاسخ‌ها
                            <span
                                class="ms-1 text-xs font-medium text-gray-500 dark:text-gray-400 font-anjoman">({{
                                    question.answers_count || 0 }})</span>
                        </h4>
                        <button type="button" @click.prevent="openCreateAnswerModal"
                            class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                                class="block group-active:[transform:translate3d(0,1px,0)]">
                                <span class="flex items-center">
                                    افزودن پاسخ
                                    <svg class="w-5 h-5 ms-2" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
                            </span></button>
                    </div>

                    <div class="space-y-3">
                        <!-- Best Answer -->
                        <div v-if="bestAnswer"
                            class="relative ps-3 pe-3 py-3 rounded-xl bg-white dark:bg-gray-900 border border-emerald-200/70 dark:border-emerald-800/40">
                            <div
                                class="absolute w-1 h-[70%] start-0 top-[15%] rounded-e-lg bg-emerald-400 dark:bg-emerald-600">
                            </div>
                            <AdminAnswerRow :answer="bestAnswer" badge="بهترین پاسخ"
                                badge-class="text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/20"
                                :formatted-date="formatDate(bestAnswer.created_at)">
                                <template #actions>
                                    <li>
                                        <button type="button" @click="removeBestAnswer"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            حذف از بهترین
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" @click="editAnswer(bestAnswer)"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            ویرایش
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" @click="openDeleteAnswerModal(bestAnswer)"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-rose-600 dark:text-rose-400">
                                            حذف
                                        </button>
                                    </li>
                                </template>
                            </AdminAnswerRow>
                        </div>

                        <!-- Pinned -->
                        <div v-for="answer in pinnedAnswers" :key="'pin-' + answer.id"
                            class="relative ps-3 pe-3 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60">
                            <div
                                class="absolute w-1 h-[70%] start-0 top-[15%] rounded-e-lg bg-sky-400 dark:bg-sky-600">
                            </div>
                            <AdminAnswerRow :answer="answer" badge="پین شده"
                                badge-class="text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-900/20"
                                :formatted-date="formatDate(answer.created_at)">
                                <template #actions>
                                    <li>
                                        <button type="button" @click="setBestAnswer(answer)"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            {{ bestAnswerActionLabel }}
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" @click="togglePinAnswer(answer)"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            حذف پین
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" @click="editAnswer(answer)"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            ویرایش
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" @click="openDeleteAnswerModal(answer)"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-rose-600 dark:text-rose-400">
                                            حذف
                                        </button>
                                    </li>
                                </template>
                            </AdminAnswerRow>
                        </div>

                        <!-- Regular -->
                        <div v-for="answer in answers" :key="answer.id"
                            class="relative ps-3 pe-3 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60">
                            <AdminAnswerRow :answer="answer" :formatted-date="formatDate(answer.created_at)">
                                <template #actions>
                                    <li>
                                        <button type="button" @click="setBestAnswer(answer)"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            {{ bestAnswerActionLabel }}
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" @click="togglePinAnswer(answer)"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            {{ answer.pinned_at ? 'حذف پین' : 'پین کردن' }}
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" @click="editAnswer(answer)"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            ویرایش
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" @click="openDeleteAnswerModal(answer)"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-rose-600 dark:text-rose-400">
                                            حذف
                                        </button>
                                    </li>
                                </template>
                            </AdminAnswerRow>
                        </div>

                        <div v-if="answers.length === 0 && !bestAnswer && pinnedAnswers.length === 0 && !answersLoading"
                            class="text-center py-12 rounded-xl bg-gray-50/80 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-700">
                            <p class="text-sm font-medium text-gray-400 dark:text-gray-500">هنوز پاسخی ثبت نشده است.</p>
                        </div>

                        <div v-if="answersLoading"
                            class="text-center py-6 text-xs font-medium text-gray-400 dark:text-gray-500">
                            در حال بارگذاری پاسخ‌ها...
                        </div>
                    </div>

                    <div v-if="answersPagination.total > 0"
                        class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                        <PaginationComponent v-if="answersPagination.last_page > 1" dir="ltr"
                            :pagination="answersPagination" @updatePage="updateAnswersPage" />
                        <div v-else class="flex-1"></div>
                        <select :value="answersPerPage" @change="selectAnswersPerPage(parseInt($event.target.value))"
                            class="h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none border border-gray-200/60 dark:border-gray-700/60">
                            <option v-for="per in answersPerPages" :key="per" :value="per">{{ per }} در هر صفحه</option>
                        </select>
                    </div>
                </div>
            </div>

            <div v-else-if="!loading" class="text-center py-16">
                <p class="text-sm font-medium text-gray-400 dark:text-gray-500">سوال یافت نشد.</p>
            </div>

            <!-- Answer Bottom Sheet -->
            <BottomSheetDrawer v-model="showAnswerModal" :initialHeight="0.75" :maxHeight="0.95" :minHeight="0.55"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[48rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ answerMode === 'create' ? 'افزودن پاسخ جدید' : 'ویرایش پاسخ' }}
                    </h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeAnswerModal">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form @submit.prevent="submitAnswerForm" class="space-y-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">کاربر</label>
                        <div v-if="selectedAnswerUser && !answerUserSearchEditing"
                            class="flex items-center gap-3 p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div
                                class="shrink-0 w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                                <img v-if="selectedAnswerUser.profile_pic" :src="selectedAnswerUser.profile_pic"
                                    class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                <span v-else class="text-sm font-semibold text-yellow-500">{{
                                    selectedAnswerUser.first_name?.charAt(0) || '?' }}</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                                    {{ selectedAnswerUser.first_name }} {{ selectedAnswerUser.last_name }}
                                </div>
                                <div class="text-[11px] text-gray-500 dark:text-gray-400">@{{ selectedAnswerUser.username
                                    }}</div>
                            </div>
                            <button type="button" @click="startAnswerUserSearch"
                                class="text-[11px] font-semibold text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 px-2 py-1 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-400/10">
                                تغییر
                            </button>
                        </div>
                        <div v-else class="relative">
                            <input type="text" v-model="answerForm.user_search" @input="handleAnswerUserSearch"
                                @focus="showAnswerUserDropdown = true" @blur="handleAnswerUserBlur"
                                class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                                placeholder="جستجوی کاربر (حداقل 3 حرف)..." />
                            <div v-if="answerUserSearchLoading" class="absolute end-3 top-3">
                                <svg class="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                            </div>
                            <div v-if="showAnswerUserDropdown && answerUserSearchResults.length > 0"
                                class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                                <div v-for="user in answerUserSearchResults" :key="user.id"
                                    @mousedown.prevent="selectAnswerUser(user)"
                                    class="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/80 cursor-pointer flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                    <div
                                        class="shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                                        <img v-if="user.profile_pic" :src="user.profile_pic"
                                            class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                        <span v-else class="text-xs font-semibold text-yellow-500">{{
                                            user.first_name?.charAt(0) || '?' }}</span>
                                    </div>
                                    <div class="min-w-0">
                                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{
                                            user.first_name }} {{ user.last_name }}</div>
                                        <div class="text-[11px] text-gray-500">@{{ user.username }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">پاسخ</label>
                        <EditorComponent :previewClass="['bg-gray-100', 'dark:bg-gray-800']"
                            :bodyClass="['bg-gray-50', 'dark:bg-gray-700', 'rounded-xl', 'text-gray-700', 'dark:text-gray-100']"
                            :focusedBorder="'1px #f59e0b solid'" :errorBorder="'1px #ef4444 solid'"
                            :submitButton="false" :cancelButton="false" :errors="''" v-model="answerForm.answer" />
                    </div>
                    <div
                        class="p-3 flex items-center bg-gray-100/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input v-model="answerForm.publish" type="checkbox" class="sr-only peer" />
                            <div
                                class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-yellow-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400">
                            </div>
                            <span class="ms-3 text-xs font-semibold text-gray-700 dark:text-gray-200">منتشر شده</span>
                        </label>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="closeAnswerModal"
                            class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            انصراف
                        </button>
                        <button type="submit" :disabled="answerFormLoading"
                            class="px-5 py-2.5 text-sm font-semibold text-white bg-yellow-400 rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-colors shadow-lg shadow-yellow-400/30">
                            <span v-if="answerFormLoading">در حال ذخیره...</span>
                            <span v-else>ذخیره</span>
                        </button>
                    </div>
                </form>
            </BottomSheetDrawer>

            <!-- Delete Answer Bottom Sheet -->
            <BottomSheetDrawer v-model="showDeleteAnswerModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">حذف پاسخ</h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5"
                        @click="closeDeleteAnswerModal">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">آیا مطمئن هستید که می‌خواهید این پاسخ را حذف
                    کنید؟</p>
                <div class="flex justify-end gap-3">
                    <button type="button" @click="closeDeleteAnswerModal"
                        class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700">
                        انصراف
                    </button>
                    <button type="button" @click="deleteAnswer" :disabled="deleteAnswerLoading"
                        class="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 disabled:opacity-50 shadow-lg shadow-rose-500/30">
                        <span v-if="deleteAnswerLoading">در حال حذف...</span>
                        <span v-else>حذف</span>
                    </button>
                </div>
            </BottomSheetDrawer>

            <LoadingComponent v-if="loading" class="" />
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import AdminAnswerRow from "@/views/page/admin/discuss/AdminAnswerRow.vue";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import debounce from "lodash/debounce";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import "vue3-toastify/dist/index.css";

export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        BottomSheetDrawer,
        EditorComponent,
        MarkdownRenderer,
        AdminAnswerRow,
        PaginationComponent,
    },
    props: {
        id: {
            type: [String, Number],
            required: true,
        },
    },
    data() {
        return {
            question: null,
            answers: [],
            bestAnswer: null,
            pinnedAnswers: [],
            loading: false,
            showAnswerModal: false,
            showDeleteAnswerModal: false,
            answerMode: 'create',
            answerFormLoading: false,
            deleteAnswerLoading: false,
            answerForDelete: null,
            editingAnswer: null,
            answerForm: {
                user_id: null,
                user_search: '',
                answer: '',
                publish: true,
            },
            showAnswerUserDropdown: false,
            answerUserSearchResults: [],
            answerUserSearchLoading: false,
            selectedAnswerUser: null,
            answerUserSearchEditing: true,
            answersPagination: {},
            answersCurrentPage: 1,
            answersPerPage: 10,
            answersPerPages: [5, 10, 15, 25],
            answersLoading: false,
        };
    },
    computed: {
        bestAnswerActionLabel() {
            return this.bestAnswer ? 'جایگزینی بهترین پاسخ' : 'انتخاب به عنوان بهترین';
        },
    },
    mounted() {
        this.refreshData();
    },
    methods: {
        refreshData() {
            this.fetchQuestion();
            this.fetchAnswers();
        },
        getPublishBarClass(question) {
            return question?.publish
                ? 'bg-emerald-400 dark:bg-emerald-600'
                : 'bg-gray-400 dark:bg-gray-600';
        },
        formatDate(date) {
            if (!date) return '-';
            const d = new Date(date);
            const dateStr = d.toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
            });
            const timeStr = d.toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                hour12: true,
                minute: '2-digit',
            }).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ');
            return `${dateStr}  ${timeStr}`;
        },
        async fetchQuestion() {
            this.loading = true;
            try {
                const response = await axiosInstance.get(`/admin/discuss/question/${this.id}`);
                this.question = response.data.question;
            } catch (error) {
                console.error('Error fetching question:', error);
                toast.error("خطایی در دریافت اطلاعات رخ داد.", {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.loading = false;
            }
        },
        async fetchAnswers(page = this.answersCurrentPage) {
            this.answersLoading = true;
            try {
                const response = await axiosInstance.post(`/admin/discuss/question/${this.id}/answers`, {
                    page,
                    perPage: this.answersPerPage,
                });
                const paginated = response.data.answers;
                this.answers = Array.isArray(paginated?.data) ? paginated.data : [];
                this.bestAnswer = response.data.best_answer || null;
                this.pinnedAnswers = Array.isArray(response.data.pinned_answers)
                    ? response.data.pinned_answers
                    : [];
                this.answersPagination = {
                    current_page: paginated?.current_page || 1,
                    last_page: paginated?.last_page || 1,
                    per_page: paginated?.per_page || this.answersPerPage,
                    total: paginated?.total || 0,
                };
                this.answersCurrentPage = this.answersPagination.current_page;
            } catch (error) {
                console.error('Error fetching answers:', error);
            } finally {
                this.answersLoading = false;
            }
        },
        updateAnswersPage(page) {
            this.answersCurrentPage = page;
            this.fetchAnswers(page);
        },
        selectAnswersPerPage(per) {
            this.answersPerPage = per;
            this.answersCurrentPage = 1;
            this.fetchAnswers(1);
        },
        editQuestion() {
            this.$router.push({
                name: 'admin-questions',
                query: { edit: this.id },
            });
        },
        async togglePublish() {
            try {
                await axiosInstance.post(`/admin/discuss/question/${this.id}/toggle-publish`);
                toast.success('وضعیت انتشار با موفقیت تغییر کرد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                this.fetchQuestion();
            } catch (error) {
                console.error('Error toggling publish:', error);
                toast.error('خطایی در تغییر وضعیت رخ داد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },
        openCreateAnswerModal() {
            this.answerMode = 'create';
            this.answerForm = {
                user_id: null,
                user_search: '',
                answer: '',
                publish: true,
            };
            this.selectedAnswerUser = null;
            this.answerUserSearchEditing = true;
            this.showAnswerUserDropdown = false;
            this.answerUserSearchResults = [];
            this.showAnswerModal = true;
        },
        editAnswer(answer) {
            this.answerMode = 'edit';
            this.editingAnswer = answer;
            this.answerForm = {
                user_id: answer.user?.id || null,
                user_search: answer.user ? `${answer.user.first_name} ${answer.user.last_name}` : '',
                answer: answer.answer,
                publish: answer.publish !== undefined ? answer.publish : true,
            };
            this.selectedAnswerUser = answer.user;
            this.answerUserSearchEditing = !answer.user;
            this.showAnswerUserDropdown = false;
            this.answerUserSearchResults = [];
            this.showAnswerModal = true;
        },
        closeAnswerModal() {
            this.showAnswerModal = false;
            this.editingAnswer = null;
            this.showAnswerUserDropdown = false;
            this.answerUserSearchEditing = true;
        },
        startAnswerUserSearch() {
            this.answerUserSearchEditing = true;
            this.selectedAnswerUser = null;
            this.answerForm.user_id = null;
            this.answerForm.user_search = '';
            this.answerUserSearchResults = [];
            this.showAnswerUserDropdown = false;
        },
        handleAnswerUserSearch: debounce(function () {
            if (this.answerForm.user_search.length < 3) {
                this.answerUserSearchResults = [];
                this.answerUserSearchLoading = false;
                this.showAnswerUserDropdown = false;
                return;
            }
            this.showAnswerUserDropdown = true;
            this.answerUserSearchLoading = true;
            axiosInstance.post('/admin/searchUser', { key: this.answerForm.user_search })
                .then((response) => {
                    this.answerUserSearchResults = response.data.result || [];
                })
                .catch((error) => {
                    console.error('Error searching users:', error);
                    this.answerUserSearchResults = [];
                })
                .finally(() => {
                    this.answerUserSearchLoading = false;
                });
        }, 2000),
        handleAnswerUserBlur() {
            setTimeout(() => {
                if (this.answerForm.user_search.length < 3) {
                    this.showAnswerUserDropdown = false;
                }
            }, 200);
        },
        selectAnswerUser(user) {
            this.selectedAnswerUser = user;
            this.answerForm.user_id = user.id;
            this.answerForm.user_search = `${user.first_name} ${user.last_name}`;
            this.showAnswerUserDropdown = false;
            this.answerUserSearchResults = [];
            this.answerUserSearchEditing = false;
        },
        clearSelectedAnswerUser() {
            this.startAnswerUserSearch();
        },
        async submitAnswerForm() {
            if (!this.answerForm.user_id) {
                toast.error('لطفا کاربر را انتخاب کنید.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }
            this.answerFormLoading = true;
            try {
                const formData = {
                    user_id: this.answerForm.user_id,
                    answer: this.answerForm.answer,
                    publish: this.answerForm.publish,
                };
                if (this.answerMode === 'create') {
                    await axiosInstance.post(`/admin/discuss/question/${this.id}/answer/create`, formData);
                    toast.success('پاسخ با موفقیت ایجاد شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                } else {
                    await axiosInstance.post(`/admin/discuss/answer/${this.editingAnswer.id}/update`, formData);
                    toast.success('پاسخ با موفقیت به‌روزرسانی شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }
                this.closeAnswerModal();
                this.fetchQuestion();
                if (this.answerMode === 'create') {
                    this.answersCurrentPage = 1;
                    this.fetchAnswers(1);
                } else {
                    this.fetchAnswers();
                }
            } catch (error) {
                console.error('Error submitting answer form:', error);
                toast.error(error.response?.data?.message || 'خطایی رخ داد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.answerFormLoading = false;
            }
        },
        async setBestAnswer(answer) {
            try {
                await axiosInstance.post(`/admin/discuss/question/${this.id}/set-best-answer`, {
                    answer_id: answer.id,
                });
                toast.success('بهترین پاسخ با موفقیت تنظیم شد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                this.fetchQuestion();
                this.answersCurrentPage = 1;
                this.fetchAnswers(1);
            } catch (error) {
                console.error('Error setting best answer:', error);
                toast.error('خطایی در تنظیم بهترین پاسخ رخ داد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },
        async removeBestAnswer() {
            try {
                await axiosInstance.post(`/admin/discuss/question/${this.id}/remove-best-answer`);
                toast.success('بهترین پاسخ با موفقیت حذف شد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                this.fetchQuestion();
                this.answersCurrentPage = 1;
                this.fetchAnswers(1);
            } catch (error) {
                console.error('Error removing best answer:', error);
                toast.error('خطایی در حذف بهترین پاسخ رخ داد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },
        async togglePinAnswer(answer) {
            try {
                await axiosInstance.post(`/admin/discuss/answer/${answer.id}/toggle-pin`);
                toast.success('وضعیت پین با موفقیت تغییر کرد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                this.fetchAnswers();
            } catch (error) {
                console.error('Error toggling pin:', error);
                toast.error('خطایی در تغییر وضعیت پین رخ داد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },
        openDeleteAnswerModal(answer) {
            this.answerForDelete = answer;
            this.showDeleteAnswerModal = true;
        },
        closeDeleteAnswerModal() {
            this.answerForDelete = null;
            this.showDeleteAnswerModal = false;
        },
        async deleteAnswer() {
            if (!this.answerForDelete) return;
            this.deleteAnswerLoading = true;
            try {
                await axiosInstance.delete(`/admin/discuss/answer/${this.answerForDelete.id}`);
                toast.success('پاسخ با موفقیت حذف شد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                this.closeDeleteAnswerModal();
                this.fetchQuestion();
                this.fetchAnswers();
            } catch (error) {
                console.error('Error deleting answer:', error);
                toast.error(error.response?.data?.message || 'خطایی در حذف رخ داد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.deleteAnswerLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.rendered-content :deep(p) {
    margin-bottom: 0.5rem;
}

.rendered-content :deep(p:last-child) {
    margin-bottom: 0;
}
</style>
