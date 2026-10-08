<template>
    <!-- 
    <div class="absolute bottom-full z-50 pb-8 hidden group-hover:block transition duration-200 max-w-screen">
        <div class="bg-white dark:bg-gray-600 rounded-xl shadow-lg p-3">
            <div class="flex items-center">
                <router-link to=""
                    class="hashtag text-biscay-700 dark:text-white font-bold text-base three-point-overflow max-w-150">#
                    پایتون</router-link>
                <button
                    class="bg-amber-400 dark:bg-transparent dark:border-white dark:hover:border-amber-400 dark:hover:text-amber-400 py-2 px-3 ms-8 w-24 text-center text-white font-bold text-xs rounded border border-amber-600 transition duration-200 hover:shadow-lg hover:text-amber-500 hover:bg-white">
                    لغو دنبال کردن
                </button>
            </div>
        </div>
        <svg class="w-5 h-6 absolute text-white dark:text-gray-600 -mt-2 start-3" viewBox="0 0 44 38"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M24.5981 36.5C23.4434 38.5 20.5566 38.5 19.4019 36.5L1.21539 5C0.060688 3 1.50407 0.5 3.81347 0.5L40.1865 0.5C42.4959 0.5 43.9393 3 42.7846 5L24.5981 36.5Z"
                fill="currentColor"></path>
        </svg>
    </div> -->







    <article
        class="group relative flex overflow-hidden rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-transparent transition hover:ring-yellow-400/50"
    >
        <router-link
            :to="{ name: 'question-show', params: { questionSlug: localQuestion.slug } }"
            class="flex w-16 shrink-0 flex-col items-center justify-center gap-2 bg-gray-50 px-2 py-4 dark:bg-gray-800/80 sm:w-[4.75rem]"
        >
            <span
                class="flex h-11 w-11 flex-col items-center justify-center rounded-xl font-anjoman text-lg font-black leading-none sm:h-12 sm:w-12"
                :class="localQuestion.best_answer
                    ? 'bg-emerald-500 text-white'
                    : localQuestion.total_answers > 0
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'"
            >
                {{ localQuestion.total_answers }}
            </span>
            <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400">{{ $t('discuss.common.answers') }}</span>
            <span
                v-if="localQuestion.best_answer"
                class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                :title="$t('discuss.question.hasBestAnswer')"
            >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>
            <span
                v-if="localQuestion.is_private"
                class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-yellow-400/20 text-gray-800 dark:text-yellow-300"
            >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907 10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 10.0036V8Z" />
                </svg>
            </span>
        </router-link>

        <div class="min-w-0 flex-1 p-3 sm:p-4">
            <div class="flex items-start justify-between gap-3">
                <router-link
                    :to="{ name: 'question-show', params: { questionSlug: localQuestion.slug } }"
                    class="min-w-0 text-[15px] font-bold leading-7 text-gray-800 transition hover:text-yellow-500 dark:text-white dark:hover:text-yellow-400 sm:text-lg"
                >
                    {{ localQuestion.subject }}
                </router-link>
                <div class="flex shrink-0 items-center gap-1">
                    <button
                        v-if="isLoggedin"
                        type="button"
                        :disabled="bookamrkLoading"
                        class="flex h-8 w-8 items-center justify-center rounded-xl transition disabled:opacity-60"
                        :class="localQuestion.bookmarked
                            ? 'bg-yellow-400/20 text-amber-600 dark:text-amber-400'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
                        @click.prevent="toggleBookmark"
                    >
                        <svg v-if="localQuestion.bookmarked" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M21 11.0975V16.0909C21 19.1875 21 20.7358 20.2659 21.4123C19.9158 21.735 19.4739 21.9377 19.0031 21.9915C18.016 22.1045 16.8633 21.0849 14.5578 19.0458C13.5388 18.1445 13.0292 17.6938 12.4397 17.5751C12.1494 17.5166 11.8506 17.5166 11.5603 17.5751C10.9708 17.6938 10.4612 18.1445 9.44216 19.0458C7.13673 21.0849 5.98402 22.1045 4.99692 21.9915C4.52615 21.9377 4.08421 21.735 3.73411 21.4123C3 20.7358 3 19.1875 3 16.0909V11.0975C3 6.80891 3 4.6646 4.31802 3.3323C5.63604 2 7.75736 2 12 2C16.2426 2 18.364 2 19.682 3.3323C21 4.6646 21 6.80891 21 11.0975ZM8.25 6C8.25 5.58579 8.58579 5.25 9 5.25H15C15.4142 5.25 15.75 5.58579 15.75 6C15.75 6.41421 15.4142 6.75 15 6.75H9C8.58579 6.75 8.25 6.41421 8.25 6Z" />
                        </svg>
                        <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path opacity="0.5" fill="currentColor"
                                d="M21 11.0975V16.0909C21 19.1875 21 20.7358 20.2659 21.4123C19.9158 21.735 19.4739 21.9377 19.0031 21.9915C18.016 22.1045 16.8633 21.0849 14.5578 19.0458C13.5388 18.1445 13.0292 17.6938 12.4397 17.5751C12.1494 17.5166 11.8506 17.5166 11.5603 17.5751C10.9708 17.6938 10.4612 18.1445 9.44216 19.0458C7.13673 21.0849 5.98402 22.1045 4.99692 21.9915C4.52615 21.9377 4.08421 21.735 3.73411 21.4123C3 20.7358 3 19.1875 3 16.0909V11.0975C3 6.80891 3 4.6646 4.31802 3.3323C5.63604 2 7.75736 2 12 2C16.2426 2 18.364 2 19.682 3.3323C21 4.6646 21 6.80891 21 11.0975Z" />
                            <path fill="currentColor" d="M9 5.25C8.58579 5.25 8.25 5.58579 8.25 6C8.25 6.41421 8.58579 6.75 9 6.75H15C15.4142 6.75 15.75 6.41421 15.75 6C15.75 5.58579 15.4142 5.25 15 5.25H9Z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        class="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        @click="copyToClipboard(appUrl + $router.resolve({ name: 'question-show', params: { questionSlug: localQuestion.slug } }).href)"
                    >
                        <svg v-if="isCopied" class="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" />
                            <path opacity="0.4" d="M17.0998 2H12.8998C9.44976 2 8.04977 3.37 8.00977 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V15.99C20.6298 15.95 21.9998 14.55 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z" />
                        </svg>
                    </button>
                    <button
                        v-if="isLoggedin"
                        type="button"
                        class="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-rose-500 transition hover:bg-rose-500 hover:text-white dark:bg-gray-800 dark:hover:bg-rose-500"
                        @click="openReportModal"
                    >
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M11 13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13V10C13 9.44772 12.5523 9 12 9C11.4477 9 11 9.44772 11 10V13ZM13 15.9888C13 15.4365 12.5523 14.9888 12 14.9888C11.4477 14.9888 11 15.4365 11 15.9888V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V15.9888ZM9.37735 4.66136C10.5204 2.60393 13.4793 2.60393 14.6223 4.66136L21.2233 16.5431C22.3341 18.5427 20.8882 21 18.6008 21H5.39885C3.11139 21 1.66549 18.5427 2.77637 16.5431L9.37735 4.66136Z" />
                        </svg>
                    </button>
                </div>
            </div>

            <p
                v-if="localQuestion.question"
                v-text="localQuestion.question"
                class="mt-2 line-clamp-2 text-sm font-medium leading-7 text-gray-500 dark:text-gray-400"
            ></p>

            <div class="mt-3 flex flex-wrap items-center gap-2">
                <TagChip v-for="(tag, index) in localQuestion.tags" :key="index" :tag="tag" />
                <button
                    v-if="isLoggedin && currentUser.username === localQuestion.user.username && localQuestion.tags && localQuestion.tags.length < 3"
                    type="button"
                    class="flex h-7 items-center rounded-lg border border-dashed border-gray-300 px-2.5 text-xs font-semibold text-gray-600 transition hover:border-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-yellow-400"
                    @click="openAddTagSheet"
                >
                    <svg class="me-1 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    {{ $t('discuss.sidebar.addTag') }}
                </button>
            </div>

            <div class="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                <router-link
                    :to="{ name: 'profile-page', params: { username: localQuestion.user.username } }"
                    class="flex min-w-0 items-center gap-2"
                >
                    <span class="h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-yellow-400 bg-gray-200 dark:bg-gray-700">
                        <SeoImage
                            :src="localQuestion.user.profile_pic"
                            :alt="localQuestion.user.username || 'user'"
                            :width="36"
                            :height="36"
                            sizes-preset="avatar"
                            img-class="h-full w-full object-cover transition duration-200 hover:scale-110"
                        />
                    </span>
                    <span class="min-w-0">
                        <span class="block truncate text-sm font-bold text-gray-800 dark:text-gray-100">
                            {{ localQuestion.user.first_name }} {{ localQuestion.user.last_name }}
                        </span>
                        <span
                            v-if="localQuestion.last_answer"
                            class="block truncate text-[11px] font-medium text-gray-400"
                        >
                            {{ $t('discuss.common.updatedBy', { time: timeAgo(localQuestion.last_answer.created_at), name: localQuestion.last_answer.user.first_name }) }}
                        </span>
                        <span v-else class="block truncate text-[11px] font-medium text-gray-400">
                            {{ $t('discuss.common.postedBy', { time: timeAgo(localQuestion.created_at), name: localQuestion.user.first_name }) }}
                        </span>
                    </span>
                </router-link>

                <router-link
                    v-if="isLoggedin && question.is_editable"
                    :to="{ name: 'question-edit', params: { questionSlug: question.slug } }"
                    class="inline-flex h-8 shrink-0 items-center rounded-xl bg-yellow-400 px-3 text-xs font-semibold text-gray-900 transition hover:bg-opacity-80"
                >
                    {{ $t('discuss.question.editShort') }}
                </router-link>
            </div>
        </div>
    </article>

    <BottomSheetDrawer v-model="isOpenReportModal" :initialHeight="0.7" :maxHeight="0.8" :minHeight="0.6"
    :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
    :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:w-[40rem] lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
    :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
    :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">

        <div>
                                        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <h3
                                            class="mb-2 text-start text-base font-bold text-gray-500 dark:text-gray-200">
                                            {{ $t('discuss.common.reportTitle') }}
                                        </h3>
                                        <div class="flex flex-col space-y-2 my-3">
                                            <div
                                                class="flex flex-col space-y-2 text-sm text-start text-gray-700 dark:text-gray-400">
                                                <div
                                                    class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                                    <input id="report-spam" v-model="report" type="radio"
                                                        class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" name="" value="spam">
                                                    <label for="report-spam" class="ms-1.5">
                                                        {{ $t('discuss.common.reportSpamBefore') }} <span
                                                            class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportSpamHighlight') }}</span> {{ $t('discuss.common.reportSpamAfter') }}
                                                    </label>
                                                </div>
                                                <div
                                                    class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                                    <input id="report-offensive-writing" v-model="report" type="radio"
                                                        class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" name=""
                                                        value="offensive-writing">
                                                    <label for="report-offensive-writing" class="ms-1.5">
                                                        {{ $t('discuss.common.reportOffensiveBefore') }} <span
                                                            class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportOffensiveHighlight') }}</span> {{ $t('discuss.common.reportOffensiveAfter') }}
                                                    </label>
                                                </div>
                                                <div
                                                    class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                                    <input id="report-violation-of-rules" v-model="report" type="radio"
                                                        class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" name=""
                                                        value="violation-of-rules">
                                                    <label for="report-violation-of-rules" class="ms-1.5">
                                                        {{ $t('discuss.common.reportRulesBefore') }} <span
                                                            class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportRulesHighlight') }}</span> {{ $t('discuss.common.reportRulesAfter') }}
                                                    </label>
                                                </div>
                                                <div
                                                    class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                                    <input id="report-other" v-model="report" type="radio"
                                                        class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" name="" value="other">
                                                    <label for="report-other" class="ms-1.5">
                                                        {{ $t('discuss.common.reportOther') }}
                                                    </label>
                                                </div>
                                            </div>

                                            <span v-if="errors && errors.report"
                                                class="mt-2 text-red-500 text-xs font-semibold">
                                                {{ errors.report[0] }}
                                            </span>
                                            <span v-if="errors && errors.reportable_id"
                                                class="mt-2 text-red-500 text-xs font-semibold">
                                                {{ errors.reportable_id[0] }}
                                            </span>
                                            <span v-if="errors && errors.reportable_type"
                                                class="mt-2 text-red-500 text-xs font-semibold">
                                                {{ errors.reportable_type[0] }}
                                            </span>
                                        </div>


                                        <div class="flex justify-start items-center space-x-4 rtl:space-x-reverse">
                                            <button @click="closeReportModal" type="button"
                                                class="h-9 py-2 px-3 text-sm font-semibold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                                {{ $t('discuss.common.cancel') }}
                                            </button>
                                            <button type="submit" @click="sendReport" :disabled="reportLoading"
                                                class="w-32 h-9 py-2 px-3 text-sm font-semibold text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                                                <svg v-if="reportLoading" class="w-4 h-4 m-auto" version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">

                                                    <circle class="stroke-current text-gray-50 text-opacity-30" cx="50"
                                                        cy="50" r="20" fill="none" stroke-width="8"
                                                        stroke-linecap="round" stroke-dashoffset="0"
                                                        stroke-dasharray="200, 300">

                                                    </circle>
                                                    <circle class="stroke-current text-gray-50" cx="50" cy="50" r="20"
                                                        fill="none" stroke-width="8" stroke-linecap="round"
                                                        stroke-dashoffset="0" stroke-dasharray="100, 200">
                                                        <animateTransform attributeName="transform" attributeType="XML"
                                                            type="rotate" from="0 50 50" to="360 50 50" dur="2.5s"
                                                            repeatCount="indefinite">
                                                        </animateTransform>
                                                        <animate attributeName="stroke-dashoffset" values="0;-30;-124"
                                                            dur="1.25s" repeatCount="indefinite">
                                                        </animate>
                                                        <animate attributeName="stroke-dasharray"
                                                            values="0,200;110,200;110,200" dur="1.25s"
                                                            repeatCount="indefinite"></animate>
                                                    </circle>
                                                </svg>
                                                <span v-else class="flex items-center">
                                                    <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M16.3027 15.3365H6.68V20.1818C6.68 20.6337 6.30392 21 5.84 21C5.37608 21 5 20.6337 5 20.1818V3.81818C5 3.36631 5.37608 3 5.84 3H16.3027C17.4037 3 18.2506 3.65926 18.6739 4.48207C19.0965 5.30334 19.1414 6.35681 18.6123 7.28021L18.1096 8.15756C17.757 8.77312 17.757 9.56335 18.1096 10.1789L18.6123 11.0563C19.1414 11.9797 19.0965 13.0331 18.6739 13.8544C18.2506 14.6772 17.4037 15.3365 16.3027 15.3365Z"
                                                            fill="currentColor"></path>
                                                    </svg>
                                                    {{ $t('discuss.common.sendReport') }}
                                                </span>
                                            </button>
                                        </div>
        </div>
    </BottomSheetDrawer>

    <AddTagSheet
        :open="isOpenAddTagSheet"
        :question-slug="localQuestion.slug"
        :question-subject="localQuestion.subject"
        :tags="localQuestion.tags"
        @close="closeAddTagSheet"
        @updated="onTagsUpdated"
    />
</template>

<script>
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AddTagSheet from "@/views/components/tag/AddTagSheet.vue";
import TagChip from "@/views/components/tag/TagChip.vue";
import { useClipboard } from '@vueuse/core';
import config from "@/store/config";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { ref } from "vue";
import moment from 'moment';
import 'moment/locale/fa';
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
    components: {
        SeoImage,
        BottomSheetDrawer,
        AddTagSheet,
        TagChip,
    },
    data() {
        return {
            isOpenReportModal: false,
            isOpenAddTagSheet: false,
            report: null,
            reportLoading: false,
            isCopied: false,
            appUrl: config.appUrl,
            localQuestion: this.question,
            bookamrkLoading: false,
            errors: ref(null)

        }
    },
    props: {
        question: Object
    },
    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        }
    },
    methods: {
        timeAgo(date) {
            moment.locale('fa');
            return moment(date).fromNow();
        },
        async toggleBookmark() {
            this.bookamrkLoading = true;
            await axiosInstance
                .post("/toggleBookmark", {
                    bookmarkable_id: this.localQuestion.id,
                    bookmarkable_type: 'Question',
                })
                .then((response) => {
                    this.localQuestion.bookmarked = response.data.bookmarked;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.bookamrkLoading = false
                });
        },
        async sendReport() {
            this.reportLoading = true;
            this.errors = null
            await axiosInstance
                .post("/sendReport", {
                    reportable_id: this.localQuestion.id,
                    reportable_type: 'Question',
                    report: this.report
                })
                .then(() => {
                    toast.success(this.$t('discuss.common.reportSuccess'), {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    this.closeReportModal();
                    this.report = null;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                    this.errors = error.response.data.errors
                })
                .finally(() => {
                    this.reportLoading = false;
                });
        },
        async copyToClipboard(value) {
            try {
                const { copy, isSupported } = useClipboard();
                if (isSupported) {
                    await copy(value);
                    this.isCopied = true;
                    setTimeout(() => {
                        this.isCopied = false;
                    }, 4000);
                } else {
                    console.error('عملیات کپی پشتیبانی نمی‌شود');
                }
            } catch (error) {
                console.error('خطا در کپی به کلیپبورد:', error);
            }
        },
        closeReportModal() {
            this.isOpenReportModal = false;
        },
        openReportModal() {
            this.isOpenReportModal = true;
        },
        openAddTagSheet() {
            this.isOpenAddTagSheet = true;
        },
        closeAddTagSheet() {
            this.isOpenAddTagSheet = false;
        },
        onTagsUpdated(tags) {
            this.localQuestion.tags = tags;
        },
    },
    updated() {
        this.localQuestion = this.question
    },
    mounted() {
    }
}
</script>
<style></style>