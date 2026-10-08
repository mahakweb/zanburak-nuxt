<template>
    <MasterPage>
        <section class="mx-2 mt-14">
            <div class="mx-auto max-w-screen-xl">
                <div v-if="loading" class="flex overflow-hidden rounded-2xl bg-white dark:bg-gray-900">
                    <div class="flex w-16 shrink-0 flex-col items-center gap-2 bg-gray-50 px-2 py-4 dark:bg-gray-800/80 sm:w-[4.75rem] sm:py-5">
                        <div class="h-11 w-11 rounded-xl animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600 sm:h-12 sm:w-12"></div>
                        <div class="h-1.5 w-8 rounded-full animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600"></div>
                    </div>
                    <div class="min-w-0 flex-1 p-4 sm:p-5">
                        <div class="flex items-start justify-between gap-3">
                            <div class="mt-1 h-3.5 w-3/5 rounded-full animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600"></div>
                            <div class="flex gap-1">
                                <div class="h-8 w-8 rounded-xl animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600"></div>
                                <div class="h-8 w-8 rounded-xl animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600"></div>
                                <div class="h-8 w-8 rounded-xl animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600"></div>
                            </div>
                        </div>
                        <div class="mt-5 space-y-2.5">
                            <div class="h-2 w-full rounded-full animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600"></div>
                            <div class="h-2 w-full rounded-full animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600"></div>
                            <div class="h-2 w-2/3 rounded-full animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600"></div>
                        </div>
                        <div class="mt-5 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                            <div class="h-9 w-9 rounded-full animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600"></div>
                            <div class="h-2 w-28 rounded-full animate-shimmer shimmer-gray-100 dark:shimmer-gray-500 bg-gray-200 dark:bg-gray-600"></div>
                        </div>
                    </div>
                </div>
                <article v-else class="flex overflow-hidden rounded-2xl bg-white dark:bg-gray-900">
                    <a
                        href="#answers-list"
                        class="flex w-16 shrink-0 flex-col items-center gap-2 bg-gray-50 px-2 py-4 dark:bg-gray-800/80 sm:w-[4.75rem] sm:py-5"
                    >
                        <span
                            class="flex h-11 w-11 flex-col items-center justify-center rounded-xl font-anjoman text-lg font-black leading-none sm:h-12 sm:w-12"
                            :class="question.best_answer
                                ? 'bg-emerald-500 text-white'
                                : question.total_answers > 0
                                    ? 'bg-yellow-400 text-gray-900'
                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'"
                        >
                            {{ question.total_answers }}
                        </span>
                        <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400">{{ $t('discuss.common.answers') }}</span>
                        <span
                            v-if="question.best_answer"
                            class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            :title="$t('discuss.question.hasBestAnswer')"
                        >
                            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                        <span
                            v-if="question.is_private"
                            class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-yellow-400/20 text-gray-800 dark:text-yellow-300"
                        >
                            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907 10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 10.0036V8Z" />
                            </svg>
                        </span>
                    </a>

                    <div class="min-w-0 flex-1 p-4 sm:p-5">
                        <div class="flex items-start justify-between gap-3">
                            <h1 class="min-w-0 text-lg font-bold leading-8 text-gray-800 dark:text-white sm:text-xl md:text-[1.35rem]">
                                {{ question.subject }}
                            </h1>
                            <div class="flex shrink-0 items-center gap-1">
                                <button
                                    v-if="isLoggedin"
                                    type="button"
                                    :disabled="bookamrkLoading"
                                    class="flex h-8 w-8 items-center justify-center rounded-xl transition disabled:opacity-60"
                                    :class="question.bookmarked
                                        ? 'bg-yellow-400/20 text-amber-600 dark:text-amber-400'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
                                    @click.prevent="toggleBookmark"
                                >
                                    <svg v-if="question.bookmarked" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
                                    @click="copyToClipboard(appUrl + $router.resolve({ name: 'question-show', params: { questionSlug: question.slug } }).href)"
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

                        <div class="mt-4 text-base font-medium leading-8 text-gray-600 dark:text-gray-300">
                            <MarkdownRenderer startClass="rendered-content" :source="question.question" />
                        </div>

                        <div class="mt-4 flex flex-wrap items-center gap-2">
                            <TagChip v-for="(tag, i) in question.tags" :key="i" :tag="tag" />
                            <button
                                v-if="isLoggedin && question.user && (currentUser.username === question.user.username) && (!question.tags || question.tags.length < 3)"
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

                        <div class="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                            <router-link
                                v-if="question.user"
                                :to="{ name: 'profile-page', params: { username: question.user.username } }"
                                class="flex min-w-0 items-center gap-2"
                            >
                                <span class="h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-yellow-400 bg-gray-200 dark:bg-gray-700">
                                    <SeoImage
                                        :src="question.user.profile_pic"
                                        :alt="question.user.username || 'user'"
                                        :width="36"
                                        :height="36"
                                        sizes-preset="avatar"
                                        img-class="h-full w-full object-cover transition duration-200 hover:scale-110"
                                    />
                                </span>
                                <span class="min-w-0">
                                    <span class="block truncate text-sm font-bold text-gray-800 dark:text-gray-100">
                                        {{ question.user.first_name }} {{ question.user.last_name }}
                                    </span>
                                    <span
                                        v-if="question.last_answer"
                                        class="block truncate text-[11px] font-medium text-gray-400"
                                    >
                                        {{ $t('discuss.common.updatedBy', { time: timeAgo(question.last_answer.created_at), name: question.last_answer.user.first_name }) }}
                                    </span>
                                    <span v-else class="block truncate text-[11px] font-medium text-gray-400">
                                        {{ $t('discuss.common.postedBy', { time: timeAgo(question.created_at), name: question.user.first_name }) }}
                                    </span>
                                </span>
                            </router-link>

                            <div class="flex flex-wrap items-center gap-2">
                                <router-link
                                    v-if="isLoggedin && question.is_editable"
                                    :to="{ name: 'question-edit', params: { questionSlug: question.slug } }"
                                    class="inline-flex h-8 items-center rounded-xl bg-gray-100 px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    {{ $t('discuss.question.editShort') }}
                                </router-link>
                                <button
                                    v-if="isLoggedin && question.is_editable"
                                    type="button"
                                    class="inline-flex h-8 items-center rounded-xl bg-rose-500/10 px-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white"
                                    @click="openDeleteModal"
                                >
                                    {{ $t('discuss.question.delete') }}
                                </button>
                                <a
                                    href="#answer-form"
                                    class="inline-flex h-8 items-center rounded-xl bg-yellow-400 px-3.5 text-xs font-semibold text-gray-900 transition hover:bg-opacity-80"
                                >
                                    {{ $t('discuss.question.sendAnswer') }}
                                </a>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </section>
        <section class="mx-2 mt-6 mb-14">
            <div class="mx-auto max-w-screen-xl md:grid lg:grid-cols-12 gap-3 md:gap-5 lg:gap-7 mb-20">
                <div id="answers-list" class="xl:col-span-9 lg:col-span-8">
                    <router-link :to="{ name: 'discuss-create' }"
                        class="mb-5 lg:hidden flex h-12 rounded-lg items-center justify-center px-4 text-base font-semibold focus:outline-none focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-800 text-gray-800 bg-amber-400 hover:shadow-sm shadow-amber-400 hover:opacity-90">
                        {{ $t('discuss.question.createNew') }}
                        <svg class="ms-2 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12H18M12 6V18" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </svg>
                    </router-link>
                    <div>
                        <div v-if="bestAnswer" class="mb-6">
                            <AnswerCard2 class="mb-8 last:mb-0" :answer="bestAnswer" :question="question" :best="true"
                                @pin-toggled="handlePinToggled" :ratingClass="'bg-gray-100 dark:bg-gray-800'" />
                        </div>
                        <div v-if="pinnedAnswers && pinnedAnswers.length > 0" class="mb-6 space-y-5">
                            <AnswerCard2 v-for="(answer, i) in pinnedAnswers" :key="i" class="" :answer="answer"
                                :question="question" :pinned="true" @pin-toggled="handlePinToggled"
                                @set-best-answer="handleBestAnswer" :ratingClass="'bg-gray-100 dark:bg-gray-800'" />
                        </div>
                    </div>
                    <div v-if="answersLoading"
                        class="bg-yellow-100 dark:bg-yellow-400 dark:bg-opacity-20 dark:text-amber-400 text-amber-500 border border-dashed border-yellow-300 rounded-xl p-4 font-semibold flex items-center space-x-2 space-x-reverse mb-6">
                        <svg class="w-8 h-8 rtl:ml-2 ltr:mr-2" version="1.1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">

                            <circle class="stroke-current text-yellow-500 text-opacity-30" cx="50" cy="50" r="20"
                                fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                                stroke-dasharray="200, 300">

                            </circle>
                            <circle class="stroke-current text-yellow-500" cx="50" cy="50" r="20" fill="none"
                                stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                                stroke-dasharray="100, 200">
                                <animateTransform attributeName="transform" attributeType="XML" type="rotate"
                                    from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite">
                                </animateTransform>
                                <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s"
                                    repeatCount="indefinite">
                                </animate>
                                <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s"
                                    repeatCount="indefinite"></animate>
                            </circle>
                        </svg>
                        <p>{{ $t('discuss.question.loadingAnswers') }}</p>
                    </div>
                    <div v-else id="answers-list-update" class="">
                        <div v-if="answers && answers.length > 0" class="space-y-5">
                            <AnswerCard2 v-for="(answer, i) in answers" :key="i" class="" :answer="answer"
                                :question="question" @pin-toggled="handlePinToggled" @delete-answer="handleDeleteAnswer"
                                @set-best-answer="handleBestAnswer" :ratingClass="'bg-gray-100 dark:bg-gray-800'" />
                        </div>

                        <div v-else-if="!answers.length && !pinnedAnswers.length && !bestAnswer" class="flex mb-6">
                            <div v-if="question && question.user"
                                class="w-full flex items-center border-2 border-orange-500 px-8 rounded-xl py-6 bg-orange-500 bg-opacity-10">
                                <svg width="82" height="80" viewBox="0 0 82 80" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M37.0183 1.30894L28.9189 8.36141H40.5344V2.79688e-05C39.2808 -0.0040244 38.026 0.43228 37.0183 1.30894Z"
                                        fill="#FDF0BC"></path>
                                    <path
                                        d="M44.0058 1.30081C43.0089 0.437656 41.773 0.00405237 40.5356 0V8.36138H52.1511L44.0058 1.30081Z"
                                        fill="url(#paint0_linear_3240_36296)"></path>
                                    <path
                                        d="M12.2798 12.8717L10.6089 23.4807L19.5065 16.0149L14.1317 9.6095C13.1686 10.4119 12.4878 11.5533 12.2798 12.8717Z"
                                        fill="#FDF0BC"></path>
                                    <path
                                        d="M17.6278 8.37493C16.3094 8.35332 15.0829 8.81664 14.1333 9.60955L19.5081 16.015L28.4057 8.54918L17.6278 8.37493Z"
                                        fill="url(#paint1_linear_3240_36296)"></path>
                                    <path
                                        d="M0.763061 37.6316L6.3013 46.8332L8.31802 35.3947L0.084965 33.9413C-0.137915 35.1759 0.0741587 36.4875 0.763061 37.6316Z"
                                        fill="#FDF0BC"></path>
                                    <path
                                        d="M1.96796 30.7494C0.945413 31.5815 0.303789 32.7243 0.0849609 33.9413L8.31937 35.3934L10.3361 23.955L1.96796 30.7494Z"
                                        fill="url(#paint2_linear_3240_36296)"></path>
                                    <path
                                        d="M7.85456 64.0018L18.0125 67.4896L12.2054 57.4302L4.96387 61.6109C5.58658 62.6997 6.59157 63.5682 7.85456 64.0018Z"
                                        fill="url(#paint3_linear_3240_36296)"></path>
                                    <path
                                        d="M4.35488 57.9556C4.10499 59.2497 4.34813 60.5383 4.96274 61.6122L12.2043 57.4315L6.39728 47.3722L4.35488 57.9556Z"
                                        fill="url(#paint4_linear_3240_36296)"></path>
                                    <path
                                        d="M30.2375 79.6439L40.2603 75.7874L29.3459 71.8147L26.4863 79.6723C27.6629 80.1045 28.992 80.1234 30.2375 79.6439Z"
                                        fill="url(#paint5_linear_3240_36296)"></path>
                                    <path
                                        d="M23.6695 77.2611C24.3098 78.4133 25.3242 79.2441 26.4859 79.6709L29.3455 71.8134L18.4312 67.8407L23.6695 77.2611Z"
                                        fill="url(#paint6_linear_3240_36296)"></path>
                                    <path
                                        d="M57.4393 77.2395L62.6385 67.842L51.7241 71.8147L54.5837 79.6723C55.7616 79.2468 56.7923 78.4079 57.4393 77.2395Z"
                                        fill="url(#paint7_linear_3240_36296)"></path>
                                    <path
                                        d="M50.876 79.6358C52.1079 80.1072 53.4182 80.091 54.5826 79.6709L51.723 71.8134L40.8086 75.786L50.876 79.6358Z"
                                        fill="url(#paint8_linear_3240_36296)"></path>
                                    <path
                                        d="M76.73 57.9124L74.6728 47.3722L68.8657 57.4315L76.1073 61.6122C76.7368 60.5275 76.9867 59.2227 76.73 57.9124Z"
                                        fill="url(#paint9_linear_3240_36296)"></path>
                                    <path
                                        d="M73.2439 63.9667C74.4893 63.5358 75.4835 62.6808 76.1062 61.6109L68.8647 57.4302L63.0576 67.4896L73.2439 63.9667Z"
                                        fill="url(#paint10_linear_3240_36296)"></path>
                                    <path
                                        d="M79.0843 30.7062L70.7324 23.955L72.7491 35.3934L80.9836 33.9413C80.7715 32.7067 80.1231 31.5464 79.0843 30.7062Z"
                                        fill="url(#paint11_linear_3240_36296)"></path>
                                    <path
                                        d="M80.3058 37.5857C80.9839 36.4551 81.196 35.161 80.9839 33.9413L72.7495 35.3934L74.7662 46.8319L80.3058 37.5857Z"
                                        fill="url(#paint12_linear_3240_36296)"></path>
                                    <path
                                        d="M63.402 8.35197L52.6646 8.54783L61.5622 16.0136L66.937 9.6082C65.9793 8.80043 64.7379 8.32765 63.402 8.35197Z"
                                        fill="url(#paint13_linear_3240_36296)"></path>
                                    <path
                                        d="M68.759 12.8379C68.551 11.5358 67.8824 10.4092 66.9368 9.6109L61.562 16.0163L70.4597 23.4822L68.759 12.8379Z"
                                        fill="url(#paint14_linear_3240_36296)"></path>
                                    <path
                                        d="M40.534 69.4414C56.2005 69.4414 68.9006 56.7412 68.9006 41.0748C68.9006 25.4084 56.2005 12.7083 40.534 12.7083C24.8676 12.7083 12.1675 25.4084 12.1675 41.0748C12.1675 56.7412 24.8676 69.4414 40.534 69.4414Z"
                                        fill="url(#paint15_radial_3240_36296)"></path>
                                    <path
                                        d="M40.5339 10.1742C23.4681 10.1742 9.6333 24.0076 9.6333 41.0735C9.6333 58.1394 23.4681 71.9741 40.5339 71.9741C57.5998 71.9741 71.4346 58.1394 71.4346 41.0735C71.4346 24.0076 57.5998 10.1742 40.5339 10.1742ZM40.5339 69.4374C24.8688 69.4374 12.1701 56.7386 12.1701 41.0735C12.1701 25.4084 24.8688 12.7096 40.5339 12.7096C56.199 12.7096 68.8978 25.4084 68.8978 41.0735C68.8978 56.7386 56.199 69.4374 40.5339 69.4374Z"
                                        fill="url(#paint16_linear_3240_36296)"></path>
                                    <path
                                        d="M40.5341 6.2312C21.2908 6.2312 5.69189 21.8301 5.69189 41.0735C5.69189 60.3168 21.2908 75.9157 40.5341 75.9157C59.7775 75.9157 75.3764 60.3168 75.3764 41.0735C75.3764 21.8301 59.7775 6.2312 40.5341 6.2312ZM40.5341 71.9592C23.4764 71.9592 9.64836 58.1312 9.64836 41.0735C9.64836 24.0157 23.4764 10.189 40.5341 10.189C57.5919 10.189 71.4199 24.017 71.4199 41.0748C71.4199 58.1326 57.5919 71.9592 40.5341 71.9592Z"
                                        fill="url(#paint17_linear_3240_36296)"></path>
                                    <path
                                        d="M32.7133 55.2892C32.2405 55.2892 31.8015 55.1379 31.4138 54.8677C31.3638 54.834 31.3301 54.8002 31.2963 54.7664C31.2625 54.7502 31.245 54.7165 31.2288 54.6989C31.1612 54.6476 31.1275 54.5976 31.0775 54.5476C31.0437 54.5138 31.0261 54.4801 30.9937 54.4463L30.9775 54.4301C30.9437 54.3963 30.9262 54.3625 30.91 54.3288L30.8762 54.2774C30.8087 54.1761 30.7587 54.0748 30.7074 53.9735C30.6912 53.9235 30.6736 53.8722 30.656 53.8222C30.6398 53.7709 30.6223 53.7047 30.6061 53.6534C30.5885 53.5858 30.5723 53.5021 30.5547 53.417C30.5547 53.3832 30.5385 53.3332 30.5385 53.2995C30.5385 53.2319 30.5223 53.1644 30.5223 53.0969C30.5223 52.9793 30.5385 52.8605 30.5561 52.7254L31.8555 45.1664L26.3713 39.8172C26.27 39.7159 26.1687 39.5984 26.085 39.4796C25.9837 39.3283 25.9161 39.2094 25.8661 39.0743C25.8499 39.0243 25.8162 38.9568 25.7986 38.8717C25.7473 38.6691 25.7148 38.4665 25.7148 38.2476C25.7148 38.1801 25.7148 38.1301 25.7148 38.0626C25.7148 37.9613 25.7311 37.86 25.7648 37.7586C25.7648 37.7424 25.781 37.7087 25.781 37.6911C25.7986 37.6398 25.7986 37.5898 25.8148 37.5398C25.8148 37.5236 25.831 37.4885 25.8486 37.4385C25.8648 37.3872 25.8823 37.3372 25.9161 37.2872C25.9661 37.1859 26.0174 37.0846 26.1012 36.9671C26.1349 36.8995 26.1849 36.8496 26.2362 36.7982C26.2362 36.7982 26.2362 36.782 26.2525 36.782L26.5226 36.343H26.759C26.7928 36.3255 26.809 36.3093 26.8428 36.2917C26.8765 36.2755 26.9441 36.2417 26.994 36.2079C27.0616 36.1742 27.1453 36.1404 27.2466 36.1066C27.2804 36.0904 27.3304 36.0729 27.3817 36.0729C27.4493 36.0567 27.5168 36.0391 27.6005 36.0215L35.1933 34.9247L38.5338 28.0911C38.9053 27.3319 39.6644 26.8591 40.5073 26.8591C41.1152 26.8591 41.7055 27.1117 42.1269 27.5507C42.1945 27.6345 42.262 27.702 42.312 27.7871C42.3795 27.8884 42.4471 27.9897 42.497 28.0911L45.8889 34.9409L53.4641 36.0377C54.3083 36.1553 55 36.7469 55.2526 37.556C55.2701 37.6074 55.2863 37.6398 55.2863 37.6911C55.2863 37.7073 55.2863 37.7073 55.3025 37.7249C55.3187 37.7762 55.3363 37.8262 55.3363 37.8937C55.3363 37.9099 55.3363 37.9099 55.3363 37.9275C55.3525 37.995 55.3525 38.045 55.3525 38.1126C55.3701 38.4327 55.3187 38.7704 55.1837 39.0743C55.1323 39.2094 55.0661 39.3269 54.981 39.4458L54.9635 39.462C54.8797 39.5795 54.7784 39.6984 54.6771 39.7997L49.1929 45.1488L50.4924 52.6903C50.6274 53.517 50.3073 54.3436 49.6144 54.8502C49.4455 54.9677 49.2429 55.0866 49.0403 55.1541C49.0227 55.1541 49.0065 55.1717 48.9727 55.1717C48.7539 55.2392 48.5337 55.273 48.3149 55.273C47.961 55.273 47.6057 55.1892 47.2856 55.0204L40.5033 51.4597L33.721 55.0204C33.4211 55.2054 33.0672 55.2892 32.7133 55.2892Z"
                                        fill="#DF771E"></path>
                                    <path
                                        d="M40.5071 27.9384V41.8921L35.8496 35.9364L39.494 28.5638C39.7142 28.1586 40.1195 27.9384 40.5071 27.9384Z"
                                        fill="#FFFAF6"></path>
                                    <path
                                        d="M54.2245 37.9112L40.5234 41.8934L45.1796 35.9377L53.3127 37.1183C53.7693 37.2021 54.0894 37.5222 54.2245 37.9112Z"
                                        fill="#FEE0AC"></path>
                                    <path
                                        d="M48.9782 53.9898L40.5088 41.8921L48.034 44.7774L49.4172 52.8767C49.5172 53.3495 49.3146 53.7534 48.9782 53.9898Z"
                                        fill="#ECB76B"></path>
                                    <path
                                        d="M40.5074 41.8921V50.244L33.2348 54.0735C32.8133 54.2923 32.3743 54.2248 32.0366 53.9898L40.5074 41.8921Z"
                                        fill="#F1A341"></path>
                                    <path
                                        d="M45.1648 35.9364L40.5073 41.8921V27.9384C40.8113 27.9384 41.1152 28.0559 41.334 28.2923C41.3678 28.3261 41.4015 28.3761 41.4353 28.4274C41.4691 28.4787 41.5029 28.5287 41.5191 28.5787L45.1648 35.9364Z"
                                        fill="#FFE9BA"></path>
                                    <path
                                        d="M54.1908 38.6704C54.1571 38.738 54.1233 38.8055 54.0895 38.873C54.0382 38.9406 53.9882 38.9906 53.9382 39.0581L48.0501 44.7949L40.5249 41.9096L54.226 37.9275C54.226 37.9437 54.2422 37.9613 54.2422 37.9788C54.2422 37.9964 54.2597 38.0126 54.2597 38.0464C54.2597 38.0639 54.2597 38.0639 54.2597 38.0639C54.2597 38.0801 54.2597 38.0977 54.2597 38.1139C54.2597 38.1477 54.2597 38.1652 54.2597 38.1976C54.2759 38.3489 54.2584 38.5178 54.1908 38.6704Z"
                                        fill="#E49632"></path>
                                    <path
                                        d="M48.9781 53.9898C48.8944 54.0573 48.7931 54.1073 48.6742 54.141C48.658 54.141 48.658 54.141 48.6404 54.1573C48.3703 54.241 48.0663 54.2248 47.78 54.0735L40.5073 50.244V41.8921L48.9781 53.9898Z"
                                        fill="#E29136"></path>
                                    <path
                                        d="M40.5072 41.8921L32.0378 53.9898C32.0215 53.9722 32.004 53.956 31.9878 53.9384C31.9716 53.9222 31.954 53.9047 31.9364 53.8871C31.9202 53.8709 31.9027 53.8533 31.8689 53.8196C31.8513 53.8033 31.8351 53.7858 31.8176 53.7682C31.8 53.7507 31.8014 53.752 31.8014 53.7345C31.7852 53.7182 31.7676 53.7007 31.7676 53.6831C31.7338 53.6331 31.7001 53.5818 31.6838 53.5318C31.6676 53.5156 31.6676 53.4805 31.6501 53.4481C31.6339 53.4143 31.6339 53.3968 31.6163 53.3643C31.6001 53.3306 31.6001 53.2806 31.6001 53.2468C31.6001 53.2306 31.6001 53.1955 31.6001 53.1793C31.6001 53.1455 31.6001 53.1117 31.6001 53.078C31.6001 53.0104 31.6001 52.9429 31.6163 52.8754L32.9995 44.776L40.5072 41.8921Z"
                                        fill="#FED891"></path>
                                    <path
                                        d="M40.5072 41.8921L26.8062 37.9099C26.8062 37.8937 26.8224 37.8762 26.8224 37.8586C26.8386 37.8248 26.8386 37.7911 26.8561 37.7748C26.8899 37.7073 26.9237 37.6573 26.9574 37.606C26.9737 37.5722 26.9912 37.5547 27.025 37.5223C27.0425 37.506 27.0588 37.4709 27.0925 37.4547C27.1087 37.4385 27.1439 37.4047 27.1601 37.3872C27.1763 37.3696 27.21 37.3534 27.2276 37.3358C27.2614 37.3196 27.2951 37.2845 27.3289 37.2683C27.3451 37.2521 27.3789 37.2345 27.4127 37.2345C27.464 37.2183 27.4964 37.2008 27.5477 37.1832C27.5639 37.1832 27.5815 37.167 27.6153 37.167C27.649 37.1508 27.699 37.1508 27.7504 37.1332L35.8835 35.9526L40.5072 41.8921Z"
                                        fill="#FFF3D9"></path>
                                    <path
                                        d="M40.5074 41.8921L32.9997 44.7936L27.1116 39.0568C27.0441 39.0054 27.0103 38.9392 26.9603 38.8717C26.9266 38.8042 26.8766 38.7366 26.859 38.6691C26.8428 38.6353 26.8253 38.6015 26.8253 38.5678C26.7915 38.4665 26.7739 38.349 26.7739 38.2476C26.7739 38.2139 26.7739 38.1801 26.7739 38.1463C26.7739 38.0964 26.7739 38.0626 26.7915 38.0113C26.7915 37.995 26.8077 37.9775 26.8077 37.9437C26.8077 37.9275 26.8239 37.9099 26.8239 37.8937L40.5074 41.8921Z"
                                        fill="#ECB76B"></path>
                                    <defs>
                                        <linearGradient id="paint0_linear_3240_36296" x1="41.1036" y1="4.18069"
                                            x2="51.7699" y2="4.18069" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FEE998"></stop>
                                            <stop offset="1" stop-color="#FCC15B"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_3240_36296" x1="17.3811" y1="12.3392"
                                            x2="28.0262" y2="3.40617" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FEE998"></stop>
                                            <stop offset="1" stop-color="#FCC15B"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint2_linear_3240_36296" x1="10.5266" y1="23.931"
                                            x2="4.51958" y2="33.7997" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FCC15B"></stop>
                                            <stop offset="1" stop-color="#FEE998"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint3_linear_3240_36296" x1="7.70257" y1="59.2865"
                                            x2="18.1434" y2="66.1517" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FFC05F"></stop>
                                            <stop offset="1" stop-color="#ED892B"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint4_linear_3240_36296" x1="6.51635" y1="47.5911"
                                            x2="8.37567" y2="59.3192" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FCC15B"></stop>
                                            <stop offset="1" stop-color="#FEE998"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint5_linear_3240_36296" x1="28.4389" y1="75.8835"
                                            x2="38.7366" y2="78.1719" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FEAC3E"></stop>
                                            <stop offset="1" stop-color="#F08223"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint6_linear_3240_36296" x1="17.9161" y1="67.7511"
                                            x2="27.3557" y2="75.4744" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FFA135"></stop>
                                            <stop offset="1" stop-color="#FEB431"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint7_linear_3240_36296" x1="62.6794" y1="67.7748"
                                            x2="53.2637" y2="75.8796" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FFAA3D"></stop>
                                            <stop offset="1" stop-color="#ED8B1C"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint8_linear_3240_36296" x1="40.8499" y1="76.5382"
                                            x2="52.864" y2="75.8708" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FF962D"></stop>
                                            <stop offset="1" stop-color="#E56005"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint9_linear_3240_36296" x1="75.1143" y1="47.4145"
                                            x2="72.6987" y2="59.1743" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FDBD41"></stop>
                                            <stop offset="1" stop-color="#FEB334"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint10_linear_3240_36296" x1="78.2796" y1="49.4848"
                                            x2="66.6643" y2="69.6026" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#F6942F"></stop>
                                            <stop offset="1" stop-color="#EA6F11"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint11_linear_3240_36296" x1="70.1494" y1="24.2932"
                                            x2="77.1417" y2="34.6546" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FDBD41"></stop>
                                            <stop offset="1" stop-color="#FEB334"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint12_linear_3240_36296" x1="74.3309" y1="46.8026"
                                            x2="77.0643" y2="34.725" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FD9D24"></stop>
                                            <stop offset="1" stop-color="#FF9515"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint13_linear_3240_36296" x1="64.1149" y1="12.6534"
                                            x2="53.3085" y2="7.441" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FCC15B"></stop>
                                            <stop offset="1" stop-color="#FEE998"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint14_linear_3240_36296" x1="64.1667" y1="11.9916"
                                            x2="69.3156" y2="23.4335" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FF9515"></stop>
                                            <stop offset="1" stop-color="#FFBE41"></stop>
                                        </linearGradient>
                                        <radialGradient id="paint15_radial_3240_36296" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(40.5342 41.0743) scale(28.3666)">
                                            <stop offset="0.8428" stop-color="#FAAA31"></stop>
                                            <stop offset="1" stop-color="#F57E16"></stop>
                                        </radialGradient>
                                        <linearGradient id="paint16_linear_3240_36296" x1="40.5342" y1="10.1737"
                                            x2="40.5342" y2="71.9749" gradientUnits="userSpaceOnUse">
                                            <stop offset="0.0226" stop-color="#FD9A18"></stop>
                                            <stop offset="0.3764" stop-color="#FEC752"></stop>
                                            <stop offset="1" stop-color="#FFA422"></stop>
                                        </linearGradient>
                                        <linearGradient id="paint17_linear_3240_36296" x1="40.5344" y1="6.12908"
                                            x2="40.5344" y2="75.8139" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FFDB69"></stop>
                                            <stop offset="0.1799" stop-color="#FEE7B0"></stop>
                                            <stop offset="0.24" stop-color="#FEE9BA"></stop>
                                            <stop offset="0.2592" stop-color="#FDECD0"></stop>
                                            <stop offset="0.2953" stop-color="#FEDA92"></stop>
                                            <stop offset="0.3254" stop-color="#FFCD64"></stop>
                                            <stop offset="0.3405" stop-color="#FFC853"></stop>
                                            <stop offset="0.7613" stop-color="#FF9114"></stop>
                                            <stop offset="1" stop-color="#F57E16"></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div class="ms-9 space-y-2">
                                    <h4 class="text-orange-600  text-xl font-bold">
                                        {{ $t('discuss.question.firstAnswerTitle') }}
                                    </h4>
                                    <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {{ $t('discuss.question.firstAnswerDescription', { name: question.user.first_name }) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="answers.length > 0 && pagination.last_page > 1"
                        class="my-16 flex items-center justify-center">
                        <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                    </div>
                    <div id="answer-form" class="my-6 ">
                        <div v-if="isLoggedin">
                            <div v-if="!loading"
                                class="rounded-xl border-2 border-white dark:border-gray-900 p-3 py-5 md:p-6">
                                <form>
                                    <div class="mb-4 flex items-center">
                                        <i class="dark:bg-amber-400 rounded-full bg-slate-700 w-2 h-2 ml-2"></i>
                                        <h4 class="dark:text-amber-400 text-lg font-bold text-slate-700">{{ $t('discuss.question.sendAnswer') }}</h4>
                                    </div>
                                    <div class="mb-3 border-b dark:border-white dark:border-opacity-10 border-gray-210">
                                        <div class="flex items-start">
                                            <div class="relative" style="">
                                                <div
                                                    class="w-14 h-14 flex me-2 bg-gray-300 group relative rounded-full overflow-hidden border-4 border-solid border-amber-400">
                                                    <router-link
                                                        :to="{ name: 'profile-page', params: { username: currentUser.username } }">
                                                        <SeoImage
                                                            :src="currentUser.profile_pic"
                                                            alt="user-avatar"
                                                            :width="56"
                                                            :height="56"
                                                            sizes-preset="avatar"
                                                            img-class="transition duration-200 transform group-hover:scale-110 w-full h-full object-cover"
                                                        />
                                                        <div
                                                            class="w-full h-full absolute top-0 right-0 bg-biscay-700 bg-opacity-20 z-0">
                                                        </div>
                                                    </router-link>
                                                </div>
                                            </div>
                                            <div class="flex relative justify-center flex-col pb-5">
                                                <h6
                                                    class="font-semibold text-base dark:text-white text-chambray-700 leading-6">
                                                    <router-link
                                                        :to="{ name: 'profile-page', params: { username: currentUser.username } }">
                                                        {{ currentUser.first_name + ' ' + currentUser.last_name }}
                                                    </router-link>
                                                </h6>
                                                <router-link
                                                    :to="{ name: 'profile-page', params: { username: currentUser.username } }"
                                                    class="mt-1 dark:text-gray-200 text-gray-360 text-sm" dir="ltr"> @{{
                                                        currentUser.username }} </router-link>
                                                <i
                                                    class="absolute w-full border-b dark:border-amber-400 border-amber-400 flex bottom-0"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <EditorComponent :submitButton="false" :cancelButton="false"
                                        :errors="(errors && errors.answer) ? errors.answer[0] : ''" v-model="newAnswer">
                                    </EditorComponent>
                                    <div class="-mt-10 flex items-center justify-end">
                                        <button type="button" @click.prevent="sendNewAnswer"
                                            :disabled="newAnswerLoading"
                                            class="w-24 whitespace-nowrap text-rose-800 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl hover:shadow-md hover:shadow-yellow-200 duration-150 focus:ring-2 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-semibold rounded-lg text-sm px-5 py-2.5 text-center">
                                            <svg v-if="newAnswerLoading" class="w-4 h-4 m-auto" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">

                                                <circle class="stroke-current text-rose-500 text-opacity-30" cx="50"
                                                    cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round"
                                                    stroke-dashoffset="0" stroke-dasharray="200, 300">

                                                </circle>
                                                <circle class="stroke-current text-rose-500" cx="50" cy="50" r="20"
                                                    fill="none" stroke-width="8" stroke-linecap="round"
                                                    stroke-dashoffset="0" stroke-dasharray="100, 200">
                                                    <animateTransform attributeName="transform" attributeType="XML"
                                                        type="rotate" from="0 50 50" to="360 50 50" dur="2.5s"
                                                        repeatCount="indefinite"></animateTransform>
                                                    <animate attributeName="stroke-dashoffset" values="0;-30;-124"
                                                        dur="1.25s" repeatCount="indefinite"></animate>
                                                    <animate attributeName="stroke-dasharray"
                                                        values="0,200;110,200;110,200" dur="1.25s"
                                                        repeatCount="indefinite"></animate>
                                                </circle>
                                            </svg>
                                            <span v-else>{{ $t('discuss.question.submitAnswer') }}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div v-else
                            class="py-4 md:px-8 px-5 flex justify-between items-center md:flex-row flex-col bg-rose-500/20 border border-dashed border-rose-600  rounded-lg mb-6">
                            <h3 class="text-base text-rose-600 font-semibold flex items-center md:mb-0 mb-5">
                                <span class="me-3">
                                    <svg class="w-5 h-5" viewBox="0 0 21 22" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor"
                                            d="M0 17.4167C0 21.191 1.77971 22 10.0833 22C18.387 22 20.1667 21.191 20.1667 17.4167C20.1667 13.6423 18.387 12.8333 10.0833 12.8333C1.77971 12.8333 0 13.6423 0 17.4167Z">
                                        </path>
                                        <path fill="currentColor"
                                            d="M4.58333 5.5C4.58333 8.53757 7.04577 11 10.0833 11C13.1209 11 15.5833 8.53757 15.5833 5.5C15.5833 2.46243 13.1209 0 10.0833 0C7.04577 0 4.58333 2.46243 4.58333 5.5Z">
                                        </path>
                                    </svg> </span>
                                {{ $t('discuss.question.loginToAnswer') }}
                            </h3>

                            <router-link
                                class="text-base text-rose-600 font-bold flex items-center underline hover:text-white duration-200 transition "
                                :to="{ name: 'login' }">
                                {{ $t('discuss.question.loginOrRegister') }}
                                <span class="ms-2">
                                    <svg class="w-4 h-4" viewBox="0 0 18 12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor" opacity="0.4"
                                            d="M12.7975 4.80957L16.4967 4.48242C17.3269 4.48242 18 5.16206 18 6.00032C18 6.83858 17.3269 7.51822 16.4967 7.51822L12.7975 7.19107C12.1463 7.19107 11.6183 6.65793 11.6183 6.00032C11.6183 5.34161 12.1463 4.80957 12.7975 4.80957Z">
                                        </path>
                                        <path fill="currentColor"
                                            d="M0.37534 4.86984C0.433157 4.81146 0.649155 4.56471 0.852061 4.35983C2.03568 3.07656 5.12619 0.978153 6.7429 0.335965C6.98835 0.233523 7.60907 0.0154213 7.94179 0C8.25924 0 8.56251 0.0738021 8.8516 0.219203C9.21269 0.422985 9.50068 0.74463 9.65995 1.12355C9.76141 1.38572 9.92068 2.17331 9.92068 2.18763C10.0789 3.04792 10.165 4.44685 10.165 5.99339C10.165 7.46503 10.0789 8.80668 9.94904 9.68129C9.93486 9.69671 9.77559 10.6738 9.60214 11.0086C9.28469 11.6211 8.66397 12 7.99961 12H7.94179C7.50871 11.9857 6.5989 11.6057 6.5989 11.5924C5.06837 10.9502 2.05096 8.95319 0.837879 7.62585C0.837879 7.62585 0.495338 7.28438 0.346976 7.07178C0.115706 6.76556 7.15256e-05 6.38663 7.15256e-05 6.00771C7.15256e-05 5.58473 0.129888 5.19148 0.37534 4.86984Z">
                                        </path>
                                    </svg> </span>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="xl:col-span-3 lg:col-span-4 lg:order-first order-last">
                    <router-link :to="{ name: 'discuss-create' }"
                        class="mb-5 hidden lg:flex h-12 rounded-lg items-center justify-center px-4 text-base font-semibold focus:outline-none focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-gray-200 dark:ring-offset-gray-800 text-gray-800 bg-amber-400 hover:shadow-md shadow-amber-400 hover:opacity-90">
                        {{ $t('discuss.question.createNew') }}
                        <svg class="ms-2 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12H18M12 6V18" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </svg>
                    </router-link>
                    <div class="lg:hidden w-full text-center">
                        <button
                            class="flex items-center mx-auto text-white dark:text-gray-800 bg-amber-400 hover:bg-amber-500/50 focus:ring-2 focus:ring-amber-300 rounded-lg px-5 py-2.5 mb-2 dark:bg-amber-400 dark:hover:bg-amber-400/70 focus:outline-none dark:focus:ring-amber-600 text-sm font-semibold"
                            type="button" data-drawer-target="bottom-sheet" data-drawer-show="bottom-sheet"
                            data-drawer-placement="bottom" data-drawer-edge="true"
                            data-drawer-edge-offset="bottom-[0px]" aria-controls="bottom-sheet">
                            {{ $t('discuss.list.filters') }}
                            <svg class="w-5 h-5 ms-2" viewBox="0 0 22 22" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z"
                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                </path>
                                <path opacity="0.4"
                                    d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833"
                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <div class="hidden lg:block">
                        <div v-if="initLoadingSidebar" class="flex flex-col">
                            <div class="w-full">
                                <div class="bg-white dark:bg-gray-900 p-2  rounded-xl">
                                    <div>
                                        <div
                                            class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold  focus:outline-none">
                                            <div
                                                class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-2">
                                            </div>
                                            <div
                                                class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-5 w-5 ">
                                            </div>
                                        </div>
                                        <div class="px-4 pb-2 pt-2 text-sm text-gray-500">
                                            <div
                                                class="pt-4 flex flex-col border-t space-y-6 border-gray-100 dark:border-opacity-20">
                                                <div v-for="i in 6" :key="i" class="flex items-center">
                                                    <div
                                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-6 w-6 me-3 ">
                                                    </div>
                                                    <div
                                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-1.5">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-6 w-full">
                                <div class="bg-white dark:bg-gray-900 p-2  rounded-xl">
                                    <div>
                                        <div
                                            class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold  focus:outline-none">
                                            <div
                                                class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-2">
                                            </div>
                                            <div
                                                class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-5 w-5 ">
                                            </div>
                                        </div>
                                        <div class="px-4 pb-2 pt-2 text-sm text-gray-500">
                                            <div
                                                class="pt-4 flex flex-col border-t space-y-6 border-gray-100 dark:border-opacity-20">
                                                <div v-for="i in 6" :key="i" class="flex items-center">
                                                    <div
                                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full h-6 w-6 me-3 ">
                                                    </div>
                                                    <div
                                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-1.5">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SideBar v-else :showLinkFilterQuestions="true" :showLinkCategories="true"
                            :categories="initData.categories" :showPopularTags="true"
                            :popularTags="initData.popularTags" :showMyTags="isLoggedin" :myTags="initData.myTags || []"
                            :showTopUsers="true" :topUsers="initData.topUsers" />
                    </div>
                </div>
                <!-- bottom sheet component -->
                <div id="bottom-sheet"
                    class="lg:hidden fixed z-40 w-full overflow-y-auto bg-white shadow-xl border-t border-gray-200 rounded-t-xl dark:border-gray-800 dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 translate-y-full"
                    tabindex="-1" aria-labelledby="bottom-sheet-label">
                    <div class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        data-drawer-toggle="bottom-sheet">
                        <span
                            class="absolute w-24 h-1 -translate-x-1/2 bg-gray-300 rounded-lg top-3 left-1/2 dark:bg-gray-600"></span>
                    </div>

                    <div class="max-h-[60vh] overflow-auto mx-1 px-1.5">
                        <div v-if="initLoadingSidebar" class="flex flex-col">
                            <div class="w-full">
                                <div class="bg-white dark:bg-gray-900 p-2  rounded-xl">
                                    <div>
                                        <div
                                            class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold  focus:outline-none">
                                            <div
                                                class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-2">
                                            </div>
                                            <div
                                                class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-5 w-5 ">
                                            </div>
                                        </div>
                                        <div class="px-4 pb-2 pt-2 text-sm text-gray-500">
                                            <div
                                                class="pt-4 flex flex-col border-t space-y-6 border-gray-100 dark:border-opacity-20">
                                                <div v-for="i in 6" :key="i" class="flex items-center">
                                                    <div
                                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-6 w-6 me-3 ">
                                                    </div>
                                                    <div
                                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-1.5">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-6 w-full">
                                <div class="bg-white dark:bg-gray-900 p-2  rounded-xl">
                                    <div>
                                        <div
                                            class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold  focus:outline-none">
                                            <div
                                                class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-2">
                                            </div>
                                            <div
                                                class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-5 w-5 ">
                                            </div>
                                        </div>
                                        <div class="px-4 pb-2 pt-2 text-sm text-gray-500">
                                            <div
                                                class="pt-4 flex flex-col border-t space-y-6 border-gray-100 dark:border-opacity-20">
                                                <div v-for="i in 6" :key="i" class="flex items-center">
                                                    <div
                                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full h-6 w-6 me-3 ">
                                                    </div>
                                                    <div
                                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-1.5">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SideBar v-else :showLinkFilterQuestions="true" :showLinkCategories="true"
                            :categories="initData.categories" :showPopularTags="true"
                            :popularTags="initData.popularTags" :showMyTags="isLoggedin" :myTags="initData.myTags || []"
                            :showTopUsers="true" :topUsers="initData.topUsers" />
                    </div>
                </div>
            </div>
        </section>

        <BottomSheetDrawer v-model="isOpenReportModal" :initialHeight="0.7" :maxHeight="0.8" :minHeight="0.6"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:w-[40rem] lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="relative w-full max-h-full">
                <div class="">
                    <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <h3 class="mb-2 text-start text-base font-bold text-gray-500 dark:text-gray-200">
                        {{ $t('discuss.common.reportTitle') }}
                    </h3>
                    <div class="flex flex-col space-y-2 my-3">
                        <div class="flex flex-col space-y-2 text-sm text-start text-gray-700 dark:text-gray-400">
                            <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                <input id="report-spam" v-model="report" type="radio"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900"
                                    name="" value="spam">
                                <label for="report-spam" class="ms-1.5">
                                    {{ $t('discuss.common.reportSpamBefore') }} <span class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportSpamHighlight') }}</span> {{ $t('discuss.common.reportSpamAfter') }}
                                </label>
                            </div>
                            <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                <input id="report-offensive-writing" v-model="report" type="radio"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900"
                                    name="" value="offensive-writing">
                                <label for="report-offensive-writing" class="ms-1.5">
                                    {{ $t('discuss.common.reportOffensiveBefore') }} <span
                                        class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportOffensiveHighlight') }}</span> {{ $t('discuss.common.reportOffensiveAfter') }}
                                </label>
                            </div>
                            <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                <input id="report-violation-of-rules" v-model="report" type="radio"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900"
                                    name="" value="violation-of-rules">
                                <label for="report-violation-of-rules" class="ms-1.5">
                                    {{ $t('discuss.common.reportRulesBefore') }} <span class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportRulesHighlight') }}</span> {{ $t('discuss.common.reportRulesAfter') }}
                                </label>
                            </div>
                            <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                <input id="report-other" v-model="report" type="radio"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900"
                                    name="" value="other">
                                <label for="report-other" class="ms-1.5">
                                    {{ $t('discuss.common.reportOther') }}
                                </label>
                            </div>
                        </div>

                        <span v-if="errors && errors.report" class="mt-2 text-red-500 text-xs font-semibold">
                            {{ errors.report[0] }}
                        </span>
                        <span v-if="errors && errors.reportable_id" class="mt-2 text-red-500 text-xs font-semibold">
                            {{ errors.reportable_id[0] }}
                        </span>
                        <span v-if="errors && errors.reportable_type" class="mt-2 text-red-500 text-xs font-semibold">
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
                                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="25 25 50 50">

                                <circle class="stroke-current text-gray-50 text-opacity-30" cx="50" cy="50" r="20"
                                    fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                                    stroke-dasharray="200, 300">

                                </circle>
                                <circle class="stroke-current text-gray-50" cx="50" cy="50" r="20" fill="none"
                                    stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                                    stroke-dasharray="100, 200">
                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate"
                                        from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite">
                                    </animateTransform>
                                    <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s"
                                        repeatCount="indefinite">
                                    </animate>
                                    <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s"
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
            </div>
        </BottomSheetDrawer>
        <BottomSheetDrawer v-model="isOpenDeleteModal" :initialHeight="0.5" :maxHeight="0.6" :minHeight="0.4"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:w-[25rem] lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">

            <!-- Modal content -->
            <div class="text-center">

                <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true"
                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"></path>
                </svg>
                <p class="mb-4 text-gray-500 dark:text-gray-300 font-medium">{{ $t('discuss.question.deleteConfirm') }}</p>
                <div class="flex justify-center items-center space-x-4 rtl:space-x-reverse">
                    <button @click="closeDeleteModal" type="button"
                        class="h-9 py-2 px-3 text-sm font-semibold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                        {{ $t('discuss.common.keepIt') }}
                    </button>
                    <button type="submit" @click="deleteQuestion" :disabled="deleteLoading"
                        class="w-32 h-9 py-2 px-3 text-sm font-semibold text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                        <svg v-if="deleteLoading" class="w-4 h-4 m-auto" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="25 25 50 50">

                            <circle class="stroke-current text-gray-50 text-opacity-30" cx="50" cy="50" r="20"
                                fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                                stroke-dasharray="200, 300">

                            </circle>
                            <circle class="stroke-current text-gray-50" cx="50" cy="50" r="20" fill="none"
                                stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                                stroke-dasharray="100, 200">
                                <animateTransform attributeName="transform" attributeType="XML" type="rotate"
                                    from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite">
                                </animateTransform>
                                <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s"
                                    repeatCount="indefinite">
                                </animate>
                                <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s"
                                    repeatCount="indefinite"></animate>
                            </circle>
                        </svg>
                        <span v-else>{{ $t('discuss.common.yesDelete') }}</span>
                    </button>
                </div>
            </div>
        </BottomSheetDrawer>

        <AddTagSheet
            :open="isOpenAddTagSheet"
            :question-slug="question.slug"
            :question-subject="question.subject"
            :tags="question.tags"
            @close="closeAddTagSheet"
            @updated="onTagsUpdated"
        />
    </MasterPage>
</template>
<script>
import MasterPage from "@/views/page/discuss/layouts/MasterPage.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import SideBar from "@/views/page/discuss/layouts/SideBar.vue";
import AnswerCard2 from "@/views/components/discuss/AnswerCard2.vue";
import axiosInstance from "@/store/axiosInstance";
import { useClipboard } from '@vueuse/core';
import config from "@/store/config";
import moment from 'moment';
import 'moment/locale/fa';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { ref } from "vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue"
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import TagChip from "@/views/components/tag/TagChip.vue";
import AddTagSheet from "@/views/components/tag/AddTagSheet.vue";
import { useSEO, generateQuestionSchema, generateBreadcrumbSchema } from "@/composables/useSEO";
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
    components: {
        MasterPage,
        SideBar,
        TagChip,
        AddTagSheet,
        AnswerCard2,
        BottomSheetDrawer,
        MarkdownRenderer,
        EditorComponent,
        PaginationComponent,
        SeoImage,
    },

    data() {
        return {
            isOpenReportModal: false,
            reportLoading: false,
            report: null,
            initLoadingSidebar: true,
            initData: [],
            questionSlug: this.$route.params.questionSlug,
            question: {},
            answers: [],
            pinnedAnswers: [],
            bestAnswer: null,
            newAnswer: "",
            newAnswerLoading: false,
            currentPage: this.$route.query.page ? this.$route.query.page : 1,
            pagination: {},
            loading: true,
            answersLoading: false,
            bookamrkLoading: false,
            isCopied: false,
            appUrl: config.appUrl,
            errors: ref(null),
            mounted: false,
            isOpenDeleteModal: false,
            deleteLoading: false,
            isOpenAddTagSheet: false,
        };
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
        updatePage(value) {
            let query = '';
            if (value) {
                query += `page=${value}&`;
            }
            query = query.slice(0, -1);
            const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
            window.history.pushState({ ...window.history.state }, '', newUrl);

            this.getAnswers(value);
        },
        deleteQuestion() {
            this.deleteLoading = true
            axiosInstance
                .delete("/discuss/" + this.question.slug + "/delete", {
                    data: { id: this.question.id }
                })
                .then(() => {
                    toast.success(this.$t('discuss.question.deleteSuccess'), {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    setTimeout(() => {
                        this.$router.push({ name: "discuss-index" });
                    }, 3000)
                })
                .catch((error) => {
                    // if (error.response.status === 422) {
                    //   this.errors = error.response.data.errors;
                    // }
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.deleteLoading = false
                    this.closeDeleteModal()
                });
        },
        timeAgo(date) {
            moment.locale('fa');
            return moment(date).fromNow();
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
        async toggleBookmark() {
            this.bookamrkLoading = true;
            await axiosInstance
                .post("/toggleBookmark", {
                    bookmarkable_id: this.question.id,
                    bookmarkable_type: 'Question',
                })
                .then((response) => {
                    this.question.bookmarked = response.data.bookmarked;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.bookamrkLoading = false
                });
        },
        getInitData() {
            axiosInstance
                .post("/discuss/layouts/getInitData")
                .then((response) => {
                    this.initData = response.data.initData;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.initLoadingSidebar = false
                });
        },
        async getQuestion() {
            try {
                const response = await axiosInstance.post('/discuss/' + this.questionSlug);
                this.question = response.data.question;

                // Setup SEO
                const questionSchema = generateQuestionSchema(this.question);
                const breadcrumbSchema = generateBreadcrumbSchema([
                    { name: this.$t('discuss.question.breadcrumbHome'), url: '/' },
                    { name: this.$t('discuss.question.breadcrumbDiscuss'), url: '/discuss' },
                    { name: this.question.subject, url: `/discuss/${this.question.slug}` }
                ]);

                const questionBody = this.question.question || this.question.body || ''
                const questionAuthor = this.question.user ? `${this.question.user.first_name || ''} ${this.question.user.last_name || ''}`.trim() : ''

                // Combine static and dynamic keywords
                const staticKeywords = [
                    this.question.subject,
                    this.$t('discuss.question.seoSection'),
                    this.$t('discuss.question.seoProgrammingQuestion'),
                    'Q&A'
                ];
                const dynamicKeywords = this.question.meta_keywords
                    ? this.question.meta_keywords.split(',').map(k => k.trim()).filter(k => k)
                    : [];
                const allKeywords = [...staticKeywords, ...dynamicKeywords];

                useSEO({
                    title: this.question.subject,
                    description: questionBody ? (questionBody.substring(0, 160).replace(/<[^>]*>/g, '') + '...') : this.$t('discuss.question.seoDescriptionFallback', { subject: this.question.subject }),
                    url: `/discuss/${this.question.slug}`,
                    type: 'article',
                    keywords: allKeywords,
                    publishedTime: this.question.created_at,
                    modifiedTime: this.question.updated_at,
                    articleAuthor: questionAuthor,
                    articleSection: this.$t('discuss.question.seoSection'),
                    articleTags: [
                        this.question.subject,
                        this.$t('discuss.question.seoSection'),
                        this.$t('discuss.question.seoProgrammingQuestion'),
                        ...(this.question.category ? [this.question.category] : [])
                    ],
                    schema: [questionSchema, breadcrumbSchema].filter(Boolean)
                });
            } catch (error) {
                console.error("Error loading questions:", error);
                this.$router.push({ name: 'NotFound' });
            } finally {
                this.loading = false;
            }
        },
        async getAnswers(page) {
            try {
                this.currentPage = page ? page : this.currentPage
                this.answersLoading = true;
                const response = await axiosInstance.post('/discuss/' + this.questionSlug + '/answers', { page: this.currentPage });
                this.answers = response.data.answers;
                this.bestAnswer = response.data.best_answer;
                this.pinnedAnswers = response.data.pinned_answers;
                this.currentPage = response.data.pagination.current_page;
                this.pagination = response.data.pagination;
                if (this.mounted)
                    setTimeout(() => {
                        document.getElementById('answers-list-update').scrollIntoView({ behavior: 'smooth' });
                    }, 200)
            } catch (error) {
                console.error("Error loading questions:", error);
            } finally {
                this.loading = false;
                this.answersLoading = false;
                this.mounted = true
            }
        },
        handlePinToggled(answer) {
            if (answer.pinned_at) {
                if (!this.bestAnswer.id || (answer.id !== this.bestAnswer.id)) {
                    if (!this.pinnedAnswers.find(a => a.id === answer.id)) {
                        this.pinnedAnswers.push(answer);
                        this.answers = this.answers.filter(a => a.id !== answer.id);
                    }
                }
            } else {
                this.pinnedAnswers = this.pinnedAnswers.filter(a => a.id !== answer.id);
                if (!this.bestAnswer.id || (answer.id !== this.bestAnswer.id)) {
                    if (!this.answers.find(a => a.id === answer.id)) {
                        this.answers.push(answer);
                    }
                }
            }
        },
        handleDeleteAnswer(answer) {
            if (answer.pinned_at) {
                this.pinnedAnswers = this.pinnedAnswers.filter(a => a.id !== answer.id);
            } else {
                this.answers = this.answers.filter(a => a.id !== answer.id);
            }
        },
        handleBestAnswer(answer) {
            this.question.best_answer = answer.id;
            this.bestAnswer = answer;
            // if answer in pinnedAnswer or answers then remove it from answers and pinnedAnswers
            if (answer.pinned_at) {
                this.pinnedAnswers = this.pinnedAnswers.filter(a => a.id !== answer.id);
            } else {
                this.answers = this.answers.filter(a => a.id !== answer.id);
            }
        },
        async sendReport() {
            this.reportLoading = true;
            this.errors = null
            await axiosInstance
                .post("/sendReport", {
                    reportable_id: this.question.id,
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
        closeReportModal() {
            this.isOpenReportModal = false;
        },
        openReportModal() {
            this.isOpenReportModal = true;
        },
        closeDeleteModal() {
            this.isOpenDeleteModal = false;
        },
        openDeleteModal() {
            this.isOpenDeleteModal = true;
        },
        openAddTagSheet() {
            this.isOpenAddTagSheet = true;
        },
        closeAddTagSheet() {
            this.isOpenAddTagSheet = false;
        },
        onTagsUpdated(tags) {
            this.question.tags = tags;
        },
        async sendNewAnswer() {
            this.newAnswerLoading = true;
            this.errors = null
            await axiosInstance
                .post("/discuss/" + this.questionSlug + "/newAnswer", {
                    answer: this.newAnswer,
                })
                .then((response) => {
                    toast.success(this.$t('discuss.question.answerSuccess'), {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    this.answers.push(response.data.answer);
                    this.newAnswer = "";
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                    this.errors = error.response.data.errors
                })
                .finally(() => {
                    this.newAnswerLoading = false;
                });
        }
    },
    mounted() {
        document.title = this.$t('discuss.question.seoTitle');
        this.getInitData();
        this.getQuestion()
        this.getAnswers()
    },
}
</script>
<style></style>