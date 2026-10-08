<template>
    <MasterPage>
        <div class="md:mt-16 mx-auto max-w-screen-xl px-2">
            <section class="">
                <div v-if="episode" class="bg-white dark:bg-gray-900 rounded my-4">
                    <div class="grid md:grid-cols-12 gap-1 py-3">
                        <div class="md:col-span-9 flex items-center justify-between px-3">
                            <div class="mb-4 md:mb-0">
                                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {{ episode.title }}
                                </span>
                            </div>
                            <!-- <div class="hidden md:block mt-2 md:mt-0 rtl:md:ml-4 ltr:md:mr-4">
                                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 rtl:ml-2 ltr:mr-2">عنوان دوره:</span>
                                <router-link
                                    :to="{
                                        name: 'course.show',
                                        params: { courseSlug: course.slug },
                                    }"
                                >
                                    <span class="text-lg font-bold text-slate-700 hover:text-yellow-400 dark:text-slate-300 dark:hover:text-yellow-400">
                                        {{ course.title }}
                                    </span>
                                </router-link>
                            </div> -->
                        </div>
                        <div class="md:col-span-3 px-2 md:px-3">
                            <div class="flex flex-col" v-if="isLoggedin && course">
                                <div
                                    class="flex justify-between items-center mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <div class="">{{ $t('course.episode.yourProgress') }}</div>
                                    <div class="">{{ Math.floor(course?.progressPercentage ?? 0) }}%</div>
                                </div>
                                <div class="">
                                    <div class="h-1 rounded-xl bg-blue-100 dark:bg-blue-400/10 overflow-hidden">
                                        <div class="h-full bg-yellow-400" :style="{
                                            width: `${Math.floor(course?.progressPercentage ?? 0)}%`,
                                        }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-12">
                        <div class="md:col-span-9">
                            <EpisodePlayerPlaceholder v-if="contentBlocked"
                                :poster="course?.poster"
                                :poster-alt="course?.title"
                                :message="contentBlocked.message">
                                <template #icon>
                                    <div class="w-16 h-16 rounded-2xl flex items-center justify-center"
                                        :class="contentBlockedIconClass()">
                                        <svg class="w-8 h-8 text-white" viewBox="0 0 25 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path class="stroke-current" d="M16.6444 9.44804V7.30104C16.6444 4.78804 14.6064 2.75004 12.0934 2.75004C9.58044 2.73904 7.53444 4.76704 7.52344 7.28104V7.30104V9.44804" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path class="stroke-current" fill-rule="evenodd" clip-rule="evenodd" d="M15.9037 21.2498H8.2627C6.1687 21.2498 4.4707 19.5528 4.4707 17.4578V13.1688C4.4707 11.0738 6.1687 9.37683 8.2627 9.37683H15.9037C17.9977 9.37683 19.6957 11.0738 19.6957 13.1688V17.4578C19.6957 19.5528 17.9977 21.2498 15.9037 21.2498Z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path class="stroke-current" d="M12.084 14.203V16.424" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </div>
                                </template>
                                <template #actions>
                                    <router-link v-if="!isLoggedin" :to="loginRedirectRoute"
                                        class="inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 py-2.5 px-5 rounded-xl text-sm font-semibold transition duration-200">
                                        {{ $t('course.episode.loginAndRegister') }}
                                    </router-link>
                                    <template v-else-if="canPurchaseBlockedCourse">
                                        <button v-if="!isCourseInCart" @click="addCourseToCart" :disabled="addToCartLoading"
                                            class="inline-flex items-center justify-center gap-2 bg-yellow-400 text-slate-900 hover:bg-yellow-300 disabled:opacity-70 py-2.5 px-5 rounded-xl text-sm font-semibold transition duration-200">
                                            {{ addToCartLoading ? $t('course.show.addingToCart') : $t('course.show.buyCourse') }}
                                        </button>
                                        <router-link v-else :to="{ name: 'cart' }"
                                            class="inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 py-2.5 px-5 rounded-xl text-sm font-semibold transition duration-200">
                                            {{ $t('course.show.checkoutAndStart') }}
                                        </router-link>
                                    </template>
                                    <router-link v-if="course?.slug"
                                        :to="{ name: 'course.show', params: { courseSlug: course.slug } }"
                                        class="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold transition duration-200"
                                        :class="contentBlockedButtonClass()">
                                        {{ $t('course.episode.backToCourse') }}
                                    </router-link>
                                </template>
                            </EpisodePlayerPlaceholder>
                            <div v-else-if="isLoggedin && (episode.lock === 0 || userCanSeeCourse)">
                                <div v-if="isVideoFailed" class="relative bg-gray-900 overflow-hidden">
                                    <div
                                        class="flex flex-col items-center justify-center h-96 lg:h-[29rem] text-white px-6 text-center gap-3">
                                        <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                        </svg>
                                        <p class="text-base md:text-lg font-semibold">{{ $t('course.episode.videoFailedTitle') }}</p>
                                        <p class="text-sm text-gray-300 max-w-md">{{ $t('course.episode.videoFailedHint') }}</p>
                                    </div>
                                </div>
                                <div v-else-if="isVideoProcessing" class="relative bg-gray-900 overflow-hidden">
                                    <div
                                        class="relative flex flex-col items-center justify-center h-72 sm:h-80 lg:h-[29rem] text-white bg-gray-950">
                                        <SeoImage
                                            src="/assets/image/other/video_processing_1.gif"
                                            alt="در حال پردازش ویدیو"
                                            :lazy="false"
                                            img-class="w-auto max-w-[85%] h-auto max-h-[70%] lg:max-h-[58%] object-contain"
                                        />
                                        <div class="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-5 lg:pb-8 px-4 pt-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none">
                                            <p class="text-sm md:text-base font-semibold drop-shadow">
                                                {{ videoProcessingLabel }}
                                            </p>
                                            <p v-if="videoProcessingProgress != null" class="mt-1 text-xs md:text-sm text-gray-200">
                                                {{ videoProcessingProgress }}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <VideoPlayer
                                        v-if="episode && course && canPlayVideo"
                                        :source="computedSource" :title="episode.title" :poster="course.poster"
                                        :is-logged-in="isLoggedin"
                                        :stream-video-id="episode?.stream_video_id || null"
                                        :initial-watched-times="episode.watchedTimes ? JSON.parse(episode.watchedTimes) : []"
                                        :initial-full-watched="Boolean(episode.watched)"
                                        :next-episode="nextEpisodeForPlayer" :is-episode="true"
                                        :description="episode.description || ''" />
                                    <div v-else
                                        class="relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-slate-100 dark:bg-slate-900/80 h-72 sm:h-80 lg:h-[29rem] px-6 text-center">
                                        <SeoImage
                                            :src="noVideoPlaceholder"
                                            :alt="$t('course.episode.videoPreparingTitle')"
                                            :lazy="false"
                                            img-class="w-auto max-w-[min(100%,22rem)] max-h-[55%] object-contain opacity-95"
                                        />
                                        <div class="space-y-1 max-w-md">
                                            <p class="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-100">
                                                {{ $t('course.episode.videoPreparingTitle') }}
                                            </p>
                                            <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                                {{ $t('course.episode.videoPreparingHint') }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="px-2">
                                    <div
                                        class="flex items-center font-semibold my-4 md:text-base text-xs text-green-500 space-x-reverse space-x-1">
                                        <router-link
                                            class="leading-normal hover:underline"
                                            :to="{ name: 'faq', query: { category: 'courses-and-learning' } }">
                                            {{ $t('course.episode.watchOnlineHint') }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                            <EpisodePlayerPlaceholder v-else-if="!isLoggedin"
                                :poster="course?.poster"
                                :poster-alt="course?.title"
                                :message="$t('course.episode.loginToWatch')">
                                <template #icon>
                                    <svg class="w-12 h-12 text-white/90" viewBox="0 0 40 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.4" d="M10.2007 9.42888C10.2007 4.32263 14.4919 0.166382 19.7662 0.166382H30.2501C35.5115 0.166382 39.792 4.31221 39.792 9.40805V32.5664C39.792 37.6747 35.5029 41.833 30.2286 41.833H19.7447C14.4833 41.833 10.2007 37.6851 10.2007 32.5872V30.6289V9.42888Z" fill="white"></path>
                                        <path d="M28.4119 19.8619L22.2288 13.8015C21.5897 13.1765 20.5613 13.1765 19.9244 13.8056C19.2895 14.4348 19.2917 15.4494 19.9286 16.0744L23.3143 19.3931H1.83835C0.939027 19.3931 0.208984 20.1119 0.208984 20.9994C0.208984 21.8848 0.939027 22.6015 1.83835 22.6015H23.3143L19.9286 25.9223C19.2917 26.5473 19.2895 27.5619 19.9244 28.1911C20.2439 28.5057 20.6608 28.664 21.0797 28.664C21.4945 28.664 21.9113 28.5056 22.2288 28.1952L28.4119 22.1348C28.7187 21.8327 28.8922 21.4244 28.8922 20.9994C28.8922 20.5723 28.7187 20.164 28.4119 19.8619" fill="white"></path>
                                    </svg>
                                </template>
                                <template #actions>
                                    <router-link :to="loginRedirectRoute"
                                        class="inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 py-2.5 px-5 rounded-xl font-semibold transition duration-200">
                                        {{ $t('course.episode.loginAndRegister') }}
                                    </router-link>
                                </template>
                            </EpisodePlayerPlaceholder>
                            <EpisodePlayerPlaceholder v-else-if="course?.type === 'cash-vip'"
                                :poster="course?.poster"
                                :poster-alt="course?.title"
                                :message="$t('course.episode.buyOrVipToWatch')">
                                <template #icon>
                                    <svg class="w-14 h-14 text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.74976 12C2.74976 5.063 5.06276 2.75 11.9998 2.75C18.9368 2.75 21.2498 5.063 21.2498 12C21.2498 18.937 18.9368 21.25 11.9998 21.25C5.06276 21.25 2.74976 18.937 2.74976 12Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M11.9998 8.10498V12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </template>
                                <template #actions>
                                    <button v-if="!isCourseInCart" @click="addCourseToCart" :disabled="addToCartLoading"
                                        class="inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-70 py-2.5 px-5 rounded-xl font-semibold transition duration-200">
                                        {{ addToCartLoading ? $t('course.show.addingToCart') : $t('course.episode.buyCourse') }}
                                    </button>
                                    <router-link v-else :to="{ name: 'cart' }"
                                        class="inline-flex items-center justify-center gap-2 bg-yellow-400 text-slate-900 hover:bg-yellow-300 py-2.5 px-5 rounded-xl font-semibold transition duration-200">
                                        {{ $t('course.show.checkoutAndStart') }}
                                    </router-link>
                                    <router-link :to="{ name: 'plans' }"
                                        class="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 py-2.5 px-5 rounded-xl font-semibold transition duration-200">
                                        {{ $t('course.episode.vipMembership') }}
                                    </router-link>
                                </template>
                            </EpisodePlayerPlaceholder>
                            <EpisodePlayerPlaceholder v-else-if="course?.type === 'free'"
                                :poster="course?.poster"
                                :poster-alt="course?.title"
                                :message="$t('course.sidebar.enrollFirst')">
                                <template #icon>
                                    <svg class="w-12 h-12 text-white/90" viewBox="0 0 40 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.4" d="M10.2007 9.42888C10.2007 4.32263 14.4919 0.166382 19.7662 0.166382H30.2501C35.5115 0.166382 39.792 4.31221 39.792 9.40805V32.5664C39.792 37.6747 35.5029 41.833 30.2286 41.833H19.7447C14.4833 41.833 10.2007 37.6851 10.2007 32.5872V30.6289V9.42888Z" fill="white"></path>
                                        <path d="M28.4119 19.8619L22.2288 13.8015C21.5897 13.1765 20.5613 13.1765 19.9244 13.8056C19.2895 14.4348 19.2917 15.4494 19.9286 16.0744L23.3143 19.3931H1.83835C0.939027 19.3931 0.208984 20.1119 0.208984 20.9994C0.208984 21.8848 0.939027 22.6015 1.83835 22.6015H23.3143L19.9286 25.9223C19.2917 26.5473 19.2895 27.5619 19.9244 28.1911C20.2439 28.5057 20.6608 28.664 21.0797 28.664C21.4945 28.664 21.9113 28.5056 22.2288 28.1952L28.4119 22.1348C28.7187 21.8327 28.8922 21.4244 28.8922 20.9994C28.8922 20.5723 28.7187 20.164 28.4119 19.8619" fill="white"></path>
                                    </svg>
                                </template>
                                <template #actions>
                                    <router-link v-if="course?.slug"
                                        :to="{ name: 'course.show', params: { courseSlug: course.slug } }"
                                        class="inline-flex items-center justify-center gap-2 bg-yellow-400 text-slate-900 hover:bg-yellow-300 py-2.5 px-5 rounded-xl font-semibold transition duration-200">
                                        {{ $t('course.show.enterEpisodesFree') }}
                                    </router-link>
                                </template>
                            </EpisodePlayerPlaceholder>
                            <EpisodePlayerPlaceholder v-else
                                :poster="course?.poster"
                                :poster-alt="course?.title"
                                :message="$t('course.episode.buyToWatch')">
                                <template #icon>
                                    <svg class="w-14 h-14 text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.74976 12C2.74976 5.063 5.06276 2.75 11.9998 2.75C18.9368 2.75 21.2498 5.063 21.2498 12C21.2498 18.937 18.9368 21.25 11.9998 21.25C5.06276 21.25 2.74976 18.937 2.74976 12Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M11.9998 8.10498V12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </template>
                                <template #actions>
                                    <button v-if="!isCourseInCart" @click="addCourseToCart" :disabled="addToCartLoading"
                                        class="inline-flex items-center justify-center gap-2 bg-yellow-400 text-slate-900 hover:bg-yellow-300 disabled:opacity-70 py-2.5 px-5 rounded-xl font-semibold transition duration-200">
                                        {{ addToCartLoading ? $t('course.show.addingToCart') : $t('course.show.buyCourse') }}
                                    </button>
                                    <router-link v-else :to="{ name: 'cart' }"
                                        class="inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 py-2.5 px-5 rounded-xl font-semibold transition duration-200">
                                        {{ $t('course.show.checkoutAndStart') }}
                                    </router-link>
                                </template>
                            </EpisodePlayerPlaceholder>
                            <template v-if="!contentBlocked">
                            <hr class="my-2 border-gray-100 border-dashed dark:border-opacity-10 mx-4" />
                            <div class="flex items-center sm:flex-row flex-col justify-between px-2 md:pe-0 py-3">
                                <div class="md:me-2 mb-2 md:mb-0">
                                    <div v-if="canDownload && canPlayVideo">
                                        <div class="relative inline-block" ref="downloadMenuRef">

                                            <div>

                                                <button @click.prevent="onDownloadButtonClick"
                                                    :disabled="downloadBtnLoading"
                                                    class="w-44 whitespace-nowrap disabled:opacity-80 disabled:cursor-not-allowed group relative inline-flex h-[calc(36px+8px)] items-center justify-center rounded-lg bg-neutral-950 dark:bg-neutral-200 dark:text-neutral-900 py-1 ps-3 pe-14 text-neutral-50 text-sm font-semibold">
                                                        <span
                                                            class="z-10 pe-2" style="text-shadow: 0 1px 2px rgba(0,0,0,0.2);">{{ downloadBtnLoading ? $t('course.episode.preparing') : $t('course.episode.downloadLinks') }}</span>
                                                    <div
                                                        class="absolute end-1 inline-flex h-9 w-9 items-center justify-end rounded-lg bg-neutral-700 dark:bg-neutral-400 transition-[width] group-hover:w-[calc(100%-8px)]">
                                                        <div class="me-2.5 flex items-center justify-center">
                                                            <svg v-if="downloadBtnLoading" class="animate-spin w-4 h-4" stroke="currentColor"
                                                                fill="none" stroke-width="2" viewBox="0 0 24 24"
                                                                stroke-linecap="round" stroke-linejoin="round"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <line x1="12" y1="2" x2="12" y2="6"></line>
                                                                <line x1="12" y1="18" x2="12" y2="22"></line>
                                                                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                                                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07">
                                                                </line>
                                                                <line x1="2" y1="12" x2="6" y2="12"></line>
                                                                <line x1="18" y1="12" x2="22" y2="12"></line>
                                                                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                                                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                                            </svg>
                                                            <svg v-else class="w-5 h-5" viewBox="2 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.625 15C5.625 14.5858 5.28921 14.25 4.875 14.25C4.46079 14.25 4.125 14.5858 4.125 15H5.625ZM4.875 16H4.125H4.875ZM19.275 15C19.275 14.5858 18.9392 14.25 18.525 14.25C18.1108 14.25 17.775 14.5858 17.775 15H19.275ZM11.1086 15.5387C10.8539 15.8653 10.9121 16.3366 11.2387 16.5914C11.5653 16.8461 12.0366 16.7879 12.2914 16.4613L11.1086 15.5387ZM16.1914 11.4613C16.4461 11.1347 16.3879 10.6634 16.0613 10.4086C15.7347 10.1539 15.2634 10.2121 15.0086 10.5387L16.1914 11.4613ZM11.1086 16.4613C11.3634 16.7879 11.8347 16.8461 12.1613 16.5914C12.4879 16.3366 12.5461 15.8653 12.2914 15.5387L11.1086 16.4613ZM8.39138 10.5387C8.13662 10.2121 7.66533 10.1539 7.33873 10.4086C7.01212 10.6634 6.95387 11.1347 7.20862 11.4613L8.39138 10.5387ZM10.95 16C10.95 16.4142 11.2858 16.75 11.7 16.75C12.1142 16.75 12.45 16.4142 12.45 16H10.95ZM12.45 5C12.45 4.58579 12.1142 4.25 11.7 4.25C11.2858 4.25 10.95 4.58579 10.95 5H12.45ZM4.125 15V16H5.625V15H4.125ZM4.125 16C4.125 18.0531 5.75257 19.75 7.8 19.75V18.25C6.61657 18.25 5.625 17.2607 5.625 16H4.125ZM7.8 19.75H15.6V18.25H7.8V19.75ZM15.6 19.75C17.6474 19.75 19.275 18.0531 19.275 16H17.775C17.775 17.2607 16.7834 18.25 15.6 18.25V19.75ZM19.275 16V15H17.775V16H19.275ZM12.2914 16.4613L16.1914 11.4613L15.0086 10.5387L11.1086 15.5387L12.2914 16.4613ZM12.2914 15.5387L8.39138 10.5387L7.20862 11.4613L11.1086 16.4613L12.2914 15.5387ZM12.45 16V5H10.95V16H12.45Z" fill="currentColor"></path> </g></svg>
                                                        </div>
                                                    </div>
                                                </button>

                                                <div v-if="isDownloadMenuOpen"
                                                    class="absolute z-20 mt-2 w-48 rounded-lg shadow-md shadow-slate-200 dark:shadow-slate-800 bg-gray-100 dark:bg-gray-300 backdrop-blur-lg ">
                                                    <div class="space-y-0.5 p-1">
                                                        <button v-for="opt in availableDownloadOptions"
                                                            :key="opt.quality"
                                                            @click.prevent="selectDownloadQuality(opt.quality)"
                                                            class="first:rounded-t-lg last:rounded-b-lg w-full flex items-center justify-between text-start px-4 py-2 text-sm text-gray-800  hover:bg-gray-200  hover:dark:bg-gray-200">
                                                            <span class="flex items-center gap-1.5">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 25"
                                                                    fill="currentColor">
                                                                    <path
                                                                        d="M21 14.75V20C21 20.3978 20.842 20.7794 20.5607 21.0607C20.2794 21.342 19.8978 21.5 19.5 21.5H4.5C4.10218 21.5 3.72064 21.342 3.43934 21.0607C3.15804 20.7794 3 20.3978 3 20V14.75C3 14.5511 3.07902 14.3603 3.21967 14.2197C3.36032 14.079 3.55109 14 3.75 14C3.94891 14 4.13968 14.079 4.28033 14.2197C4.42098 14.3603 4.5 14.5511 4.5 14.75V20H19.5V14.75C19.5 14.5511 19.579 14.3603 19.7197 14.2197C19.8603 14.079 20.0511 14 20.25 14C20.4489 14 20.6397 14.079 20.7803 14.2197C20.921 14.3603 21 14.5511 21 14.75ZM11.4694 15.2806C11.539 15.3504 11.6217 15.4057 11.7128 15.4434C11.8038 15.4812 11.9014 15.5006 12 15.5006C12.0986 15.5006 12.1962 15.4812 12.2872 15.4434C12.3783 15.4057 12.461 15.3504 12.5306 15.2806L16.2806 11.5306C16.3503 11.4609 16.4056 11.3782 16.4433 11.2872C16.481 11.1961 16.5004 11.0985 16.5004 11C16.5004 10.9015 16.481 10.8039 16.4433 10.7128C16.4056 10.6218 16.3503 10.5391 16.2806 10.4694C16.2109 10.3997 16.1282 10.3444 16.0372 10.3067C15.9461 10.269 15.8485 10.2496 15.75 10.2496C15.6515 10.2496 15.5539 10.269 15.4628 10.3067C15.3718 10.3444 15.2891 10.3997 15.2194 10.4694L12.75 12.9397V4.25C12.75 4.05109 12.671 3.86032 12.5303 3.71967C12.3897 3.57902 12.1989 3.5 12 3.5C11.8011 3.5 11.6103 3.57902 11.4697 3.71967C11.329 3.86032 11.25 4.05109 11.25 4.25V12.9397L8.78063 10.4694C8.63989 10.3286 8.44902 10.2496 8.25 10.2496C8.05098 10.2496 7.86011 10.3286 7.71937 10.4694C7.57864 10.6101 7.49958 10.801 7.49958 11C7.49958 11.199 7.57864 11.3899 7.71937 11.5306L11.4694 15.2806Z">
                                                                    </path>
                                                                </svg>
                                                                {{ opt.quality }}p</span>
                                                            <span
                                                                class="text-[11px] text-gray-700 dark:text-gray-700 font-medium">{{
                                                                    formatBytes(opt.size, locale) }}</span>
                                                        </button>
                                                        <div v-if="availableDownloadOptions.length === 0"
                                                            class="px-4 py-2 text-sm text-gray-800">
                                                            {{ $t('course.episode.noDownloadQuality') }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="w-full flex md:flex-1 items-center justify-between bg-neutral-100 dark:bg-neutral-800/30 rounded-lg px-2 py-1">
                                    <ul class="flex items-center space-x-3 rtl:space-x-reverse">
                                        <li class="flex items-center cursor-pointer group">
                                            <button @click.prevent="toggleLike()" :disabled="likeLoading"
                                                class="group relative inline-flex h-9 w-8 items-center justify-center overflow-hidden rounded-full bg-transparent font-medium text-black text-shadow-lg dark:text-neutral-200 transition-all duration-300 hover:w-32">
                                                <div
                                                    class="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 ltr:group-hover:translate-x-3 group-hover:opacity-100 text-sm font-semibold">
                                                    {{ $t('course.show.likesCount', { count: likesCount }) }}</div>
                                                <div class="absolute start-1.5">
                                                    <svg class="w-6 h-6" viewBox="0 0 24 19" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            class="fill-current text-neutral-300 dark:text-neutral-500"
                                                            :class="{ 'text-red-600 dark:text-red-600': isLoggedin && userHasLiked }"
                                                            fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M7.60977 0C3.74605 0 0.511719 2.89525 0.511719 6.5867C0.511719 10.1217 2.52013 12.8603 4.7213 14.8002C6.92648 16.7437 9.42643 17.9791 10.6576 18.5217C11.3636 18.8328 12.1658 18.8328 12.8719 18.5217C14.103 17.9792 16.603 16.7437 18.8081 14.8003C21.0093 12.8604 23.0177 10.1218 23.0177 6.58685C23.0177 2.89543 19.7834 0 15.9197 0C14.3158 0 12.8825 0.676635 11.7647 1.47662C10.647 0.676635 9.21366 0 7.60977 0Z">
                                                        </path>
                                                    </svg>
                                                </div>
                                            </button>
                                        </li>
                                        <li class="group/comment flex items-center cursor-pointer">
                                            <a href="#comments-list" v-smooth-scroll
                                                class="group relative inline-flex h-9 w-8 items-center justify-center overflow-hidden rounded-full bg-transparent font-medium text-black text-shadow-lg dark:text-neutral-200 transition-all duration-300 hover:w-32">
                                                <div
                                                    class="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 ltr:group-hover:translate-x-3 group-hover:opacity-100 text-sm font-semibold">
                                                    {{ $t('course.show.commentsCount', { count: commentsCount }) }}</div>
                                                <div class="absolute start-1.5">
                                                    <svg class="rtl:ml-1 ltr:mr-1 w-5 h-5" viewBox="0 0 23 23"
                                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            class="fill-current text-neutral-300 dark:text-neutral-500 group-hover/comment:text-yellow-400"
                                                            fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M11.6397 0C20.9066 0 22.8927 1.66715 22.8927 10.0027C22.8927 15.4208 21.9552 18.755 17.7353 18.755C15.4802 18.755 14.8094 19.8263 14.1847 20.8238C13.6405 21.6929 13.1313 22.506 11.6399 22.506C10.1487 22.506 9.63949 21.6929 9.09526 20.8238C8.47058 19.8263 7.79973 18.755 5.54457 18.755C1.3247 18.755 0.386719 15.3142 0.386719 10.0027C0.386719 1.76547 2.37287 0 11.6397 0ZM12.5775 7.502C12.5775 6.9841 12.9973 6.56425 13.5152 6.56425H16.3285C16.8464 6.56425 17.2662 6.9841 17.2662 7.502C17.2662 8.01991 16.8464 8.43975 16.3285 8.43975H13.5152C12.9973 8.43975 12.5775 8.01991 12.5775 7.502ZM6.95097 10.3153C6.43306 10.3153 6.01322 10.7351 6.01322 11.253C6.01322 11.7709 6.43306 12.1908 6.95097 12.1908H16.3285C16.8464 12.1908 17.2662 11.7709 17.2662 11.253C17.2662 10.7351 16.8464 10.3153 16.3285 10.3153H6.95097Z">
                                                        </path>
                                                    </svg>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="flex items-center cursor-pointer group/bookmark">
                                            <button @click.prevent="toggleBookmark()" :disabled="bookmarkLoading"
                                                class="group relative inline-flex h-9 w-8 items-center justify-center overflow-hidden rounded-full bg-transparent font-medium text-black text-shadow-lg dark:text-neutral-200 transition-all duration-300 hover:w-32">
                                                <div
                                                    class="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 ltr:group-hover:translate-x-3 group-hover:opacity-100 text-sm font-semibold">
                                                    {{ $t('course.show.bookmarksCount', { count: bookmarksCount }) }}</div>
                                                <div class="absolute start-1.5">
                                                    <svg class="rtl:ml-1 ltr:mr-1 text-neutral-300 dark:text-neutral-500 group-hover/bookmark:text-yellow-400"
                                                        :class="{ 'text-yellow-400 dark:text-yellow-400': isLoggedin && userHasBookmarked }"
                                                        width="19" height="23" viewBox="0 0 19 23" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path class="fill-current"
                                                            d="M10.3257 0.986572C10.3265 0.970374 10.327 0.95412 10.327 0.93775C10.327 0.419824 9.9071 0 9.38923 0C8.87136 0 8.45148 0.419824 8.45148 0.93775C8.45148 0.95412 8.45194 0.970432 8.45274 0.986629C5.31347 1.43908 2.35954 4.96961 2.82498 8.90863C3.06605 10.114 2.30699 10.7526 1.51691 11.4173C0.77033 12.0454 -0.00384056 12.6968 0.0119565 13.8716C0.0119565 15.5183 0.949478 16.4106 2.32634 16.8532C2.32634 16.8532 4.84803 17.8173 9.38934 17.8173C13.9307 17.8173 16.4523 16.8532 16.4523 16.8532C17.8292 16.4106 18.767 15.4729 18.7667 13.8716C18.7666 12.6866 17.9929 12.035 17.2504 11.4098C16.4639 10.7474 15.7125 10.1147 15.9537 8.90863C16.4191 4.96949 13.4651 1.43891 10.3257 0.986572Z">
                                                        </path>
                                                        <path class="fill-current"
                                                            d="M6.03899 18.9426C5.62461 19.2533 5.5407 19.841 5.85137 20.2554C7.63312 22.6311 11.1966 22.6311 12.9784 20.2554C13.289 19.841 13.2051 19.2533 12.7907 18.9426C12.3765 18.6318 11.7887 18.7158 11.4779 19.1301C10.4464 20.5054 8.38337 20.5054 7.35187 19.1301C7.04108 18.7158 6.45327 18.6318 6.03899 18.9426Z">
                                                        </path>
                                                    </svg>
                                                </div>
                                            </button>
                                        </li>
                                    </ul>
                                    <div class="flex items-center">
                                        <!-- <span class="text-gray-400 text-sm font-semibold rtl:ml-3 ltr:mr-3">{{ $t("course.share") }}:</span> -->
                                        <div class="flex items-center">
                                            <a target="_blank" :title="$t('course.show.shareTelegram')"
                                                :href="'https://telegram.me/share/url?url=https://zanburak.ir' + route.fullPath + '&text=' + course.title"
                                                class="rtl:ml-3 ltr:mr-3 cursor-pointer group">
                                                <svg width="20" height="20" viewBox="0 0 24 20" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        class="fill-current text-gray-300 dark:text-dark-200 dark:group-hover:text-blue-450 group-hover:text-gray-400"
                                                        fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M18.3844 19.779C18.7064 20.007 19.1214 20.064 19.4914 19.924C19.8614 19.783 20.1334 19.467 20.2154 19.084C21.0844 15 23.1924 4.66303 23.9834 0.948026C24.0434 0.668026 23.9434 0.377026 23.7234 0.190026C23.5034 0.00302622 23.1984 -0.0509739 22.9264 0.0500261C18.7334 1.60203 5.8204 6.44703 0.542398 8.40003C0.207398 8.52402 -0.0106021 8.84603 0.000397854 9.19903C0.0123979 9.55303 0.250398 9.86003 0.593398 9.96303C2.9604 10.671 6.0674 11.656 6.0674 11.656C6.0674 11.656 7.5194 16.041 8.2764 18.271C8.3714 18.551 8.5904 18.771 8.8794 18.847C9.1674 18.922 9.4754 18.843 9.6904 18.64C10.9064 17.492 12.7864 15.717 12.7864 15.717C12.7864 15.717 16.3584 18.336 18.3844 19.779ZM7.3744 11.102L9.0534 16.64L9.4264 13.133C9.4264 13.133 15.9134 7.28203 19.6114 3.94703C19.7194 3.84903 19.7344 3.68503 19.6444 3.57003C19.5554 3.45503 19.3914 3.42803 19.2684 3.50603C14.9824 6.24303 7.3744 11.102 7.3744 11.102Z"
                                                        fill="#98A3B8"></path>
                                                </svg>
                                            </a>
                                            <a target="_blank" :title="$t('course.show.shareTwitter')"
                                                :href="'https://twitter.com/share?text=' + course.title + '&url=https://zanburak.ir' + route.fullPath"
                                                class="cursor-pointer group">
                                                <svg width="20" height="20" viewBox="0 0 24 20" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        class="fill-current text-gray-300 dark:text-dark-200 dark:group-hover:text-blue-450 group-hover:text-gray-400"
                                                        d="M24 2.309C23.117 2.701 22.168 2.965 21.172 3.084C22.189 2.475 22.97 1.51 23.337 0.36C22.386 0.924 21.332 1.334 20.21 1.555C19.313 0.598 18.032 0 16.616 0C13.437 0 11.101 2.966 11.819 6.045C7.728 5.84 4.1 3.88 1.671 0.901C0.381 3.114 1.002 6.009 3.194 7.475C2.388 7.449 1.628 7.228 0.965 6.859C0.911 9.14 2.546 11.274 4.914 11.749C4.221 11.937 3.462 11.981 2.69 11.833C3.316 13.789 5.134 15.212 7.29 15.252C5.22 16.875 2.612 17.6 0 17.292C2.179 18.689 4.768 19.504 7.548 19.504C16.69 19.504 21.855 11.783 21.543 4.858C22.505 4.163 23.34 3.296 24 2.309Z">
                                                    </path>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </template>
                        </div>
                        <div class="md:col-span-3">
                            <div ref="episodeSidebarRef" class="max-h-[400px] md:max-h-[630px] overflow-auto custom-scrollbar">
                                <Disclosure :defaultOpen="section.id === episode.section_id ? true : false" as="div"
                                    class="" v-for="(section, sectionIndex) in sortedCourseSections" :key="section.id ?? sectionIndex" v-slot="{ open }">
                                    <!-- Use the `open` state to conditionally change the direction of an icon. -->
                                    <DisclosureButton
                                        class="py-4 flex items-center justify-between w-full p-3 text-sm font-bold text-start text-gray-500 dark:text-gray-300 bg-gray-200 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <div class="w-full text-start">
                                            <div class="">
                                                {{ $t('course.show.section') }} {{ convertToOrdinal(sectionIndex + 1) }} - <span
                                                    class="text-sm font-medium">{{ section.title }}</span>
                                            </div>
                                        </div>
                                        <ChevronLeftIcon class="w-4 ltr:hidden"
                                            :class="open && '-rotate-90 transform transition duration-300'" />
                                        <ChevronRightIcon class="w-4 rtl:hidden"
                                            :class="open && 'rotate-90 transform transition duration-300'" />
                                    </DisclosureButton>
                                    <transition enter-active-class="transition duration-300 ease-out"
                                        enter-from-class="transform scale-95 opacity-0"
                                        enter-to-class="transform scale-100 opacity-100"
                                        leave-active-class="transition duration-300 ease-out"
                                        leave-from-class="transform scale-100 opacity-100"
                                        leave-to-class="transform scale-95 opacity-0">
                                        <DisclosurePanel>
                                            <div v-for="(ep, epIndex) in section.episode" :key="ep.id ?? ep.order ?? epIndex" class="">
                                                <div class="group overflow-hidden md:flex-row flex-col flex relative md:items-center justify-between py-1 rtl:md:pl-5 rtl:pl-2 rtl:md:pr-0 rtl:pr-12 ltr:md:pr-5 ltr:pr-2 ltr:md:pl-0 ltr:pl-12"
                                                    :data-active-episode="isActiveEpisode(route.params.episodeOrder, ep.order) ? 'true' : undefined"
                                                    :class="isActiveEpisode(route.params.episodeOrder, ep.order) ? 'bg-yellow-400 text-black' : 'border border-gray-200 dark:border-opacity-0 dark:bg-gray-500 bg-gray-200 dark:bg-opacity-10 bg-opacity-10'">
                                                    <div class="flex items-center w-full">
                                                        <div
                                                            class="w-10 flex md:relative absolute rtl:right-0 ltr:left-0 top-1/2 transform md:-translate-y-0 -translate-y-1/2 rtl:border-l ltr:border-r h-5/6 justify-center items-center">
                                                            <span v-if="isLoggedin">
                                                                <svg v-if="ep.lock === 1 && !userCanSeeCourse"
                                                                    class="w-5 h-5 text-rose-500" viewBox="0 0 25 24"
                                                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path class="stroke-current"
                                                                        d="M16.6444 9.44804V7.30104C16.6444 4.78804 14.6064 2.75004 12.0934 2.75004C9.58044 2.73904 7.53444 4.76704 7.52344 7.28104V7.30104V9.44804"
                                                                        stroke-width="1.8" stroke-linecap="round"
                                                                        stroke-linejoin="round"></path>
                                                                    <path class="stroke-current" fill-rule="evenodd"
                                                                        clip-rule="evenodd"
                                                                        d="M15.9037 21.2498H8.2627C6.1687 21.2498 4.4707 19.5528 4.4707 17.4578V13.1688C4.4707 11.0738 6.1687 9.37683 8.2627 9.37683H15.9037C17.9977 9.37683 19.6957 11.0738 19.6957 13.1688V17.4578C19.6957 19.5528 17.9977 21.2498 15.9037 21.2498Z"
                                                                        stroke-width="1.8" stroke-linecap="round"
                                                                        stroke-linejoin="round"></path>
                                                                    <path class="stroke-current"
                                                                        d="M12.084 14.203V16.424" stroke-width="1.8"
                                                                        stroke-linecap="round" stroke-linejoin="round">
                                                                    </path>
                                                                </svg>
                                                                <!-- watched -->
                                                                <svg v-if="ep.fullWatched"
                                                                    class="w-5 h-5 text-green-400"
                                                                    viewBox="0 0 1024 1024"
                                                                    xmlns="http://www.w3.org/2000/svg" fill="none">
                                                                    <path fill="currentColor"
                                                                        d="M512 64a448 448 0 110 896 448 448 0 010-896zm-55.808 536.384l-99.52-99.584a38.4 38.4 0 10-54.336 54.336l126.72 126.72a38.272 38.272 0 0054.336 0l262.4-262.464a38.4 38.4 0 10-54.272-54.336L456.192 600.384z">
                                                                    </path>
                                                                </svg>
                                                                <!-- watching -->
                                                                <svg v-else-if="!ep.fullWatched && ep.progressPercentage > 0"
                                                                    class="w-5 h-5 text-orange-500" viewBox="0 0 24 24"
                                                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path stroke="currentColor"
                                                                        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                        stroke-width="2" stroke-linecap="round"
                                                                        stroke-linejoin="round" stroke-dasharray="4 4">
                                                                    </path>
                                                                </svg>
                                                                <!-- not start watch -->
                                                                <svg v-else class="w-5 h-5 text-blue-500"
                                                                    viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path stroke="currentColor"
                                                                        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                        stroke-width="2" stroke-linecap="round"
                                                                        stroke-linejoin="round"></path>
                                                                </svg>
                                                            </span>
                                                            <span v-else>
                                                                <!-- episode is lock -->
                                                                <svg v-if="ep.lock === 1"
                                                                    class="w-5 h-5 text-rose-500" viewBox="0 0 25 24"
                                                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path class="stroke-current"
                                                                        d="M16.6444 9.44804V7.30104C16.6444 4.78804 14.6064 2.75004 12.0934 2.75004C9.58044 2.73904 7.53444 4.76704 7.52344 7.28104V7.30104V9.44804"
                                                                        stroke-width="1.8" stroke-linecap="round"
                                                                        stroke-linejoin="round"></path>
                                                                    <path class="stroke-current" fill-rule="evenodd"
                                                                        clip-rule="evenodd"
                                                                        d="M15.9037 21.2498H8.2627C6.1687 21.2498 4.4707 19.5528 4.4707 17.4578V13.1688C4.4707 11.0738 6.1687 9.37683 8.2627 9.37683H15.9037C17.9977 9.37683 19.6957 11.0738 19.6957 13.1688V17.4578C19.6957 19.5528 17.9977 21.2498 15.9037 21.2498Z"
                                                                        stroke-width="1.8" stroke-linecap="round"
                                                                        stroke-linejoin="round"></path>
                                                                    <path class="stroke-current"
                                                                        d="M12.084 14.203V16.424" stroke-width="1.8"
                                                                        stroke-linecap="round" stroke-linejoin="round">
                                                                    </path>
                                                                </svg>
                                                                <!-- episode is open -->
                                                                <svg v-else class="w-5 h-5 text-blue-500"
                                                                    viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path stroke="currentColor"
                                                                        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                        stroke-width="2" stroke-linecap="round"
                                                                        stroke-linejoin="round"></path>
                                                                </svg>
                                                            </span>
                                                        </div>

                                                        <div class="flex flex-col rtl:pr-3 ltr:pl-3">
                                                            <router-link :to="episodeShowRoute(course.slug, ep.order)" class="font-medium md:text-normal text-sm h-7 overflow-hidden leading-7 hover:text-black transition duration-200"
                                                                :class="isActiveEpisode(route.params.episodeOrder, ep.order) ? 'text-gray-900' : 'text-gray-600 dark:text-gray-200 dark:hover:text-yellow-400'">
                                                                {{ ep.title }}
                                                            </router-link>
                                                            <div v-if="isLoggedin && !ep.fullWatched && ep.progressPercentage > 0"
                                                                class="text-[0.7rem] mb-1"
                                                                :class="isActiveEpisode(route.params.episodeOrder, ep.order) ? 'text-gray-700' : 'text-orange-500'">
                                                                {{ $t('course.episode.watchedPercent', { percent: Number(ep.progressPercentage).toFixed(2) }) }}
                                                            </div>
                                                            <div class="text-xs"
                                                                :class="isActiveEpisode(route.params.episodeOrder, ep.order) ? 'text-gray-600 dark:text-gray-700' : 'text-gray-700 dark:text-gray-400'">
                                                                {{ $t('course.episode.educationalVideo') }} |
                                                                {{ new Date(ep.total_time *
                                                                    1000).toISOString().slice(11, 19) }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </DisclosurePanel>
                                    </transition>
                                </Disclosure>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="bg-white dark:bg-gray-900 rounded-xl my-4">
                    <div class="grid md:grid-cols-12 gap-1 p-2 md:p-4">
                        <div class="md:col-span-9 mb-4 md:mb-0">
                            <div class="mt-2 md:mt-0">
                                <div
                                    class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 rounded-lg dark:bg-gray-700 h-2 w-48">
                                </div>
                            </div>
                        </div>
                        <div class="md:col-span-3">
                            <div class="flex flex-col">
                                <div
                                    class="flex justify-between items-center mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <div
                                        class="banimate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 rounded-lg dark:bg-gray-700 h-2 w-20">
                                    </div>
                                    <div
                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 rounded-lg dark:bg-gray-700 h-2 w-12">
                                    </div>
                                </div>
                                <div
                                    class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 rounded-lg dark:bg-gray-700 h-1.5">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-12 gap-1 p-2">
                        <div class="md:col-span-9">
                            <div role="status"
                                class="flex items-center justify-center h-56 md:h-80 lg:h-[550px] w-full animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 rounded-lg dark:bg-gray-700">
                                <svg class="w-8 h-8 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                    <path
                                        d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                                </svg>
                                <span class="sr-only">Loading...</span>
                            </div>
                            <hr class="my-3 border-gray-100 border-dashed dark:border-opacity-10 mx-4" />
                            <div class="flex items-center justify-between">
                                <ul class="flex items-center px-1">
                                    <li
                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 dark:bg-gray-700 w-7 h-7 rounded-lg">
                                    </li>
                                    <li
                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 dark:bg-gray-700 w-7 h-7 rounded-lg mx-2">
                                    </li>
                                    <li
                                        class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 dark:bg-gray-700 w-7 h-7 rounded-lg">
                                    </li>
                                </ul>
                                <div class="flex items-center">
                                    <div class="animate-pulse flex items-center">
                                        <a class="rtl:ml-3 ltr:mr-3 group">
                                            <svg width="20" height="20" viewBox="0 0 24 20" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path class="fill-current text-gray-300 dark:text-dark-200"
                                                    fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M18.3844 19.779C18.7064 20.007 19.1214 20.064 19.4914 19.924C19.8614 19.783 20.1334 19.467 20.2154 19.084C21.0844 15 23.1924 4.66303 23.9834 0.948026C24.0434 0.668026 23.9434 0.377026 23.7234 0.190026C23.5034 0.00302622 23.1984 -0.0509739 22.9264 0.0500261C18.7334 1.60203 5.8204 6.44703 0.542398 8.40003C0.207398 8.52402 -0.0106021 8.84603 0.000397854 9.19903C0.0123979 9.55303 0.250398 9.86003 0.593398 9.96303C2.9604 10.671 6.0674 11.656 6.0674 11.656C6.0674 11.656 7.5194 16.041 8.2764 18.271C8.3714 18.551 8.5904 18.771 8.8794 18.847C9.1674 18.922 9.4754 18.843 9.6904 18.64C10.9064 17.492 12.7864 15.717 12.7864 15.717C12.7864 15.717 16.3584 18.336 18.3844 19.779ZM7.3744 11.102L9.0534 16.64L9.4264 13.133C9.4264 13.133 15.9134 7.28203 19.6114 3.94703C19.7194 3.84903 19.7344 3.68503 19.6444 3.57003C19.5554 3.45503 19.3914 3.42803 19.2684 3.50603C14.9824 6.24303 7.3744 11.102 7.3744 11.102Z"
                                                    fill="#98A3B8"></path>
                                            </svg>
                                        </a>
                                        <a class="group">
                                            <svg width="20" height="20" viewBox="0 0 24 20" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path class="fill-current text-gray-300 dark:text-dark-200"
                                                    d="M24 2.309C23.117 2.701 22.168 2.965 21.172 3.084C22.189 2.475 22.97 1.51 23.337 0.36C22.386 0.924 21.332 1.334 20.21 1.555C19.313 0.598 18.032 0 16.616 0C13.437 0 11.101 2.966 11.819 6.045C7.728 5.84 4.1 3.88 1.671 0.901C0.381 3.114 1.002 6.009 3.194 7.475C2.388 7.449 1.628 7.228 0.965 6.859C0.911 9.14 2.546 11.274 4.914 11.749C4.221 11.937 3.462 11.981 2.69 11.833C3.316 13.789 5.134 15.212 7.29 15.252C5.22 16.875 2.612 17.6 0 17.292C2.179 18.689 4.768 19.504 7.548 19.504C16.69 19.504 21.855 11.783 21.543 4.858C22.505 4.163 23.34 3.296 24 2.309Z">
                                                </path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3 md:mt-0 md:col-span-3 space-y-1">
                            <div v-for="index in 7" :key="index" class="p-2 md:p-4 bg-neutral-100 dark:bg-slate-800">
                                <div class="flex items-center mt-2 first:mt-0">
                                    <div
                                        class="me-2 w-10 h-10 flex items-center shrink-0 justify-center rounded-full animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 dark:bg-gray-700">
                                        <svg class="w-4 text-gray-100 dark:text-gray-400" viewBox="0 0 24 24"
                                            fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M15.3276 7.54199H8.67239C5.29758 7.54199 3.61017 7.54199 2.66232 8.52882C1.71447 9.51565 1.93748 11.0403 2.38351 14.0895L2.80648 16.9811C3.15626 19.3723 3.33115 20.5679 4.22834 21.2839C5.12553 21.9999 6.4488 21.9999 9.09534 21.9999H14.9046C17.5512 21.9999 18.8745 21.9999 19.7717 21.2839C20.6689 20.5679 20.8437 19.3723 21.1935 16.9811L21.6165 14.0895C22.0625 11.0403 22.2855 9.51564 21.3377 8.52882C20.3898 7.54199 18.7024 7.54199 15.3276 7.54199ZM14.5812 15.7942C15.1396 15.448 15.1396 14.5519 14.5812 14.2057L11.2096 12.1156C10.6669 11.7792 10 12.2171 10 12.9098V17.0901C10 17.7828 10.6669 18.2207 11.2096 17.8843L14.5812 15.7942Z"
                                                fill="currentColor"></path>
                                            <path opacity="0.4"
                                                d="M8.50956 2.00001H15.4897C15.7221 1.99995 15.9004 1.99991 16.0562 2.01515C17.164 2.12352 18.0708 2.78958 18.4553 3.68678H5.54395C5.92846 2.78958 6.83521 2.12352 7.94303 2.01515C8.09884 1.99991 8.27708 1.99995 8.50956 2.00001Z"
                                                fill="currentColor"></path>
                                            <path opacity="0.7"
                                                d="M6.3102 4.72266C4.91958 4.72266 3.77931 5.56241 3.39878 6.67645C3.39085 6.69967 3.38325 6.72302 3.37598 6.74647C3.77413 6.6259 4.18849 6.54713 4.60796 6.49336C5.68833 6.35485 7.05367 6.35492 8.6397 6.35501H15.5318C17.1178 6.35492 18.4832 6.35485 19.5635 6.49336C19.983 6.54713 20.3974 6.6259 20.7955 6.74647C20.7883 6.72302 20.7806 6.69967 20.7727 6.67645C20.3922 5.56241 19.2519 4.72266 17.8613 4.72266H6.3102Z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </div>
                                    <div class="w-full">
                                        <div
                                            class="h-1.5 w-4/5 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 dark:bg-gray-700 mb-3">
                                        </div>
                                        <div
                                            class="h-1 w-2/4 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 bg-gray-300 dark:bg-gray-700">
                                        </div>
                                    </div>
                                </div>
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="">
                <div v-if="episode" class="">
                    <div class="md:grid lg:grid-cols-12 gap-3 mb-20">
                        <div class="xl:col-span-9 lg:col-span-8">
                            <div v-if="episode && episode.description"
                                class="p-2 md:px-5 mb-8 bg-white dark:bg-gray-900 rounded-xl">
                                <h4
                                    class="text-gray-900 dark:text-yellow-400 text-lg font-bold sm:text-right text-center flex sm:justify-start justify-center items-center mb-4">
                                    <i
                                        class="bg-gray-900 dark:bg-yellow-400 rtl:ml-1 ltr:mr-1 w-2 h-2 rounded-full sm:flex hidden"></i>
                                    {{ $t('course.show.description') }}
                                </h4>
                                <ExpandableDescription :source="episode.description" />
                            </div>
                            <CourseAttachmentsSection
                                :attachs="episode?.attachs || []"
                                :can-access="canSeeEpisodeAttachments"
                                :heading="$t('course.episode.attachments')"
                                section-id="attachments"
                            />
                            <div v-if="episodeQuizzes.length && episode" id="episode-quizzes-list"
                                class="bg-white dark:bg-gray-900 relative rounded-xl md:p-5 p-3 mb-8">
                                <h4
                                    class="text-gray-900 dark:text-yellow-400 text-lg font-bold rtl:sm:text-right ltr:sm:text-left flex sm:justify-start justify-center items-center mb-6">
                                    <i
                                        class="bg-gray-900 dark:bg-yellow-400 rtl:ml-1 ltr:mr-1 w-2 h-2 rounded-full sm:flex hidden"></i>
                                    {{ $t('quiz.section.episodeTitle') }}
                                </h4>

                                <div id="episode-quizzes" class="mt-3">
                                    <QuizSectionRow v-for="quiz in episodeQuizzes" :key="quiz.uuid" :quiz="quiz"
                                        :logged-in="isLoggedin"
                                        :can-take-quiz="episode.lock === 0 || userCanSeeCourse" />
                                </div>
                            </div>
                            <div id="comments-list" class="mb-8">
                                <CommentsList v-if="episode" :type="'episode'" :id="episode.id"></CommentsList>
                            </div>
                        </div>
                        <div class="xl:col-span-3 lg:col-span-4 lg:order-last order-first">
                            <CourseSidebar v-if="course" :course="course" :userCanSeeCourse="userCanSeeCourse"
                                :userCompletedCourse="userCompletedCourse" :certificateUuid="certificateUuid"
                                :ratings="sidebarRatings"
                                :quizzes="quizzes"
                                :can-take-quiz="episode && (episode.lock === 0 || userCanSeeCourse)" />
                        </div>
                    </div>
                </div>
            </section>
        </div>

    </MasterPage>
</template>
<script setup>
    import MasterPage from "@/views/page/layouts/MasterPage.vue";
    import CommentsList from "@/views/components/home/CommentsList.vue";
    import CourseSidebar from "@/views/components/course/CourseSidebar.vue";
    import EpisodePlayerPlaceholder from "@/views/components/course/EpisodePlayerPlaceholder.vue";
    import ExpandableDescription from "@/views/components/course/ExpandableDescription.vue";
    import CourseAttachmentsSection from "@/views/components/course/CourseAttachmentsSection.vue";
    import QuizSectionRow from "@/views/components/quiz/QuizSectionRow.vue";
    import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from "vue";
    import { useRoute } from "vue-router";
    import axiosInstance from "@/store/axiosInstance";
    import config from "@/store/config";
    import router from "@/routes/router";
    import { useStore } from "@/composables/useStore";
    import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
    import { ChevronRightIcon } from "@heroicons/vue/20/solid";
    import { ChevronLeftIcon } from "@heroicons/vue/20/solid";
    // Hls import moved to VideoPlayer component
    import { toast } from "vue3-toastify";
    import "vue3-toastify/dist/index.css";
import { convertToOrdinal } from "@/store/convertToOrdinal";
import VideoPlayer from "@/views/components/player/VideoPlayer.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import noVideoPlaceholder from "@/assets/image/other/video-recording-2.png";
import { useSEO, generateEpisodeSchema, generateBreadcrumbSchema } from "@/composables/useSEO";
import { useI18n } from "vue-i18n";
import { emptyCourseRatings, sortCourseSections, flattenCourseEpisodes } from "@/utils/courseDisplay";
import { episodeShowRoute, episodeShowPath, isActiveEpisode } from "@/utils/episodeRoute";

// Custom controls moved to VideoPlayer component


    // Plyr options moved to VideoPlayer component

    const store = useStore();
    const route = useRoute();
    const { t, locale } = useI18n();
    const courseSlug = ref(route.params.courseSlug);
    const episodeOrder = ref(route.params.episodeOrder);
    const isLoggedin = computed(() => store.state.auth.status.loggedIn);
    const episode = ref(null);
    const course = ref(null);
    const userCompletedCourse = ref(false);
    const certificateUuid = ref(false);
    const userCanSeeCourse = ref(false);
    const canDownload = ref(false);
    const commentsCount = ref(0);
    const likesCount = ref(0);
    const userHasLiked = ref(false);
    const bookmarksCount = ref(0);
    const userHasBookmarked = ref(false);
    const quizzes = ref([]);
    const episodeQuizzes = ref([]);
    const contentBlocked = ref(null);
    const addToCartLoading = ref(false);
    const episodeSidebarRef = ref(null);

    const sortedCourseSections = computed(() => sortCourseSections(course.value?.section || []));

    const scrollActiveEpisodeIntoView = () => {
        nextTick(() => {
            // Wait for Disclosure panel open/close transition
            setTimeout(() => {
                const container = episodeSidebarRef.value;
                if (!container) return;

                const active = container.querySelector('[data-active-episode="true"]');
                if (!active) return;

                const rowTop = active.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
                const rowHeight = active.offsetHeight;
                const containerHeight = container.clientHeight;
                const maxScroll = Math.max(0, container.scrollHeight - containerHeight);
                const centered = rowTop - (containerHeight - rowHeight) / 2;
                const target = Math.min(Math.max(0, centered), maxScroll);

                container.scrollTo({ top: target, behavior: 'smooth' });
            }, 320);
        });
    };

    const loginRedirectRoute = computed(() => ({
        name: 'login',
        query: { redirect: route.fullPath },
    }));

    const isCourseInCart = computed(() => {
        if (!course.value?.id) return false;
        return store.getters["cart/isItemInCart"]('course', course.value.id);
    });

    const sidebarRatings = computed(() => course.value?.ratings || emptyCourseRatings());

    const canPurchaseBlockedCourse = computed(() => {
        if (!course.value || userCanSeeCourse.value) return false;
        return course.value?.availability?.is_purchasable !== false
            && course.value?.type !== 'free';
    });

    async function addCourseToCart() {
        if (!course.value?.id) return;
        addToCartLoading.value = true;
        try {
            await store.dispatch("cart/addToCart", { type: 'course', itemId: course.value.id });
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            addToCartLoading.value = false;
        }
    }

    function blockedStatusSlug() {
        return course.value?.status?.english_title || null;
    }

    function contentBlockedIconClass() {
        if (blockedStatusSlug() === 'upcoming') return 'bg-sky-500';
        return 'bg-amber-500';
    }

    function contentBlockedButtonClass() {
        if (blockedStatusSlug() === 'upcoming') return 'bg-sky-500 hover:bg-sky-600 text-white';
        return 'bg-yellow-400 hover:bg-yellow-400 text-black';
    }
    // Player-related variables moved to VideoPlayer component
    // Deprecated: streamVideo ref is no longer needed since backend exposes stream_video_id
    // const streamVideo = ref(null);
    let downloadLink = ref(null);

    // Compute next episode for VideoPlayer popup
    const nextEpisodeForPlayer = computed(() => {
        if (!course.value || !episode.value) return null;
        const flat = flattenCourseEpisodes(course.value.section, {
            poster: course.value.poster,
            courseSlug: course.value.slug,
        });
        const idx = flat.findIndex((ep) => ep.order === episode.value.order);
        if (idx === -1 || idx + 1 >= flat.length) return null;
        const next = flat[idx + 1];
        const link = episodeShowRoute(next.courseSlug, next.order);
        return {
            title: next.title,
            english_title: next.english_title,
            poster: next.poster,
            order: next.order,
            routeName: 'episode.show',
            link,
        };
    });

    const computedSource = computed(() => {
        return episode.value ? (config.apiBaseUrl + "/episode/" + episode.value.id + "/playlist") : "";
    });

    async function getEpisode() {
        contentBlocked.value = null;
        try {
            const response = await axiosInstance.get("/course/" + courseSlug.value + "/episode/" + episodeOrder.value);

            episode.value = response.data.episode;
            course.value = response.data.course;
            userCanSeeCourse.value = response.data.userCanSeeCourse;
            userCompletedCourse.value = response.data.userCompletedCourse;
            certificateUuid.value = response.data.certificateUuid;
            commentsCount.value = response.data.comments_count;
            likesCount.value = response.data.likes_count;
            userHasLiked.value = response.data.user_has_liked;
            bookmarksCount.value = response.data.bookmarks_count;
            userHasBookmarked.value = response.data.user_has_bookmarked;
            episodeQuizzes.value = response.data.episode_quizzes || response.data.quizzes || [];
            quizzes.value = episodeQuizzes.value;
            // stream video id is provided directly by backend now
            // watchedTimes and fullWatched are now handled by VideoPlayer component

            // Setup SEO
            const episodeImage = course.value?.poster 
                ? (course.value.poster.startsWith('http') ? course.value.poster : `${process.env.VUE_APP_SITE_URL || 'https://zanburak.ir'}${course.value.poster}`)
                : null;
            
            const episodeSchema = generateEpisodeSchema(episode.value, course.value);
            const breadcrumbSchema = generateBreadcrumbSchema([
                { name: t('course.common.breadcrumbHome'), url: '/' },
                { name: t('course.common.breadcrumbCourses'), url: '/courses' },
                { name: course.value.title, url: `/course/${course.value.slug}` },
                { name: episode.value.title, url: episodeShowPath(course.value.slug, episode.value.order) }
            ]);
            
            const episodeDuration = episode.value.time ? Math.floor(episode.value.time) : (episode.value.total_time ? Math.floor(episode.value.total_time) : 0);
            
            // Combine static and dynamic keywords
            const staticKeywords = [
                episode.value.title,
                course.value.title,
                t('course.common.kwProgramming'),
                t('course.episode.seo.kwEducationalVideo'),
                course.value.teacher?.first_name + ' ' + course.value.teacher?.last_name
            ];
            const episodeKeywords = episode.value.meta_keywords 
                ? episode.value.meta_keywords.split(',').map(k => k.trim()).filter(k => k)
                : [];
            const courseKeywords = course.value.meta_keywords 
                ? course.value.meta_keywords.split(',').map(k => k.trim()).filter(k => k)
                : [];
            const allKeywords = [...staticKeywords, ...episodeKeywords, ...courseKeywords];

            useSEO({
                title: `${episode.value.title} - ${course.value.title}`,
                description: episode.value.description || episode.value.title || t('course.episode.seo.descriptionFallback', { episode: episode.value.title, course: course.value.title }),
                image: episodeImage || undefined,
                url: episodeShowPath(course.value.slug, episode.value.order),
                type: 'video.episode',
                keywords: allKeywords,
                publishedTime: episode.value.created_at,
                modifiedTime: episode.value.updated_at,
                articleAuthor: course.value.teacher ? `${course.value.teacher.first_name} ${course.value.teacher.last_name}` : '',
                articleSection: course.value.category?.[0]?.title || t('course.episode.seo.articleSection'),
                articleTags: [
                    episode.value.title,
                    course.value.title,
                    t('course.episode.seo.kwEducationalVideo'),
                    t('course.common.kwProgramming')
                ],
                videoDuration: episodeDuration > 0 ? episodeDuration.toString() : '',
                videoReleaseDate: episode.value.created_at,
                twitterLabel1: t('course.episode.seo.durationLabel'),
                twitterData1: episodeDuration > 0 ? t('course.episode.seo.seconds', { count: episodeDuration }) : '',
                twitterLabel2: t('course.common.instructorLabel'),
                twitterData2: course.value.teacher ? `${course.value.teacher.first_name} ${course.value.teacher.last_name}` : '',
                imageAlt: `${episode.value.title} - ${course.value.title}`,
                schema: [episodeSchema, breadcrumbSchema].filter(Boolean)
            });

            applyVideoProcessingStatus(episode.value);

            // VideoPlayer loads the source itself when conditions are met
            // Determine canDownload: prefer backend flag, fallback to free or purchased cash
            if (Object.prototype.hasOwnProperty.call(response.data, 'can_download')) {
                canDownload.value = Boolean(response.data.can_download);
            } else {
                // Fallback: login is required for any download
                if (!isLoggedin.value) {
                    canDownload.value = false;
                } else {
                    const isFreeCourse = course.value && course.value.type === 'free';
                    const hasPurchasedCashCourse = userCanSeeCourse.value === true && course.value && course.value.type === 'cash';
                    canDownload.value = Boolean(isFreeCourse || hasPurchasedCashCourse);
                }
            }

            scrollActiveEpisodeIntoView();
        } catch (error) {
            if (error?.response?.status === 403 && error?.response?.data?.error === 'content_not_available') {
                const data = error.response.data;
                contentBlocked.value = {
                    message: data.message,
                    code: data.code,
                    available_at: data.available_at,
                };
                course.value = {
                    ...data.course,
                    section: data.course?.section || [],
                    progressPercentage: data.course?.progressPercentage ?? 0,
                    availability: data.course_availability || data.course?.availability || {},
                    ratings: data.course?.ratings || emptyCourseRatings(),
                    teacher: {
                        ...(data.course?.teacher || {}),
                        info: data.course?.teacher?.info || { about: '' },
                    },
                };
                userCanSeeCourse.value = false;
                episode.value = {
                    ...data.episode,
                    attachs: data.episode?.attachs || [],
                    lock: 1,
                };

                useSEO({
                    title: `${episode.value.title} - ${course.value?.title || courseSlug.value}`,
                    description: data.message || episode.value.description || t('course.episode.contentNotAvailable'),
                    url: episodeShowPath(courseSlug.value, episodeOrder.value),
                    type: 'video.episode',
                });
                return;
            }
            if (error?.response?.status === 404) {
                router.push({ name: "NotFound" });
            }
            if (error?.response?.statusText) {
                console.error(error.response.statusText);
            } else {
                console.error(error?.message || error);
            }
        }
    }

    const likeLoading = ref(false);

    const toggleLike = async () => {
        if (!isLoggedin.value) {
            toast.warning(t("course.episode.loginToLike"), {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                bodyClassName: "font-YekanBakh text-gray-800",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        } else {
            likeLoading.value = true;
            await axiosInstance
                .post("/toggleLike", {
                    likeable_id: episode.value.id,
                    likeable_type: "Episode",
                })
                .then((response) => {
                    userHasLiked.value = response.data.user_has_liked;
                    likesCount.value = response.data.likes_count;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    likeLoading.value = false;
                });
        }
    };
    const bookmarkLoading = ref(false);
    const toggleBookmark = async () => {
        if (!isLoggedin.value) {
            toast.warning(t("course.episode.loginToBookmark"), {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                bodyClassName: "font-YekanBakh text-gray-800",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        } else {
            bookmarkLoading.value = true;
            await axiosInstance
                .post("/toggleBookmark", {
                    bookmarkable_id: episode.value.id,
                    bookmarkable_type: "Episode",
                })
                .then((response) => {
                    userHasBookmarked.value = response.data.bookmarked;
                    bookmarksCount.value = response.data.count;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    bookmarkLoading.value = false;
                });
        }
    };

    // video source and events handled inside VideoPlayer

    // trackVideoProgress moved to VideoPlayer component

    // Quality management functions moved to VideoPlayer component

    // getQualityLabel moved to VideoPlayer component

    // getQualityBadge moved to VideoPlayer component

    // All quality/speed management functions moved to VideoPlayer component

    // setupSettingsEventListeners moved to VideoPlayer component

    // All player control functions moved to VideoPlayer component

    let downloadBtnLoading = ref(false);
    const isDownloadMenuOpen = ref(false);
    const availableDownloadOptions = ref([]);
    const downloadMenuRef = ref(null);

    // Video processing status variables
    // Backend statuses: queued | processing | processed | failed
    const videoProcessingStatus = ref(null);
    const isVideoProcessing = ref(false);
    const isVideoFailed = ref(false);
    const videoProcessingProgress = ref(null);
    const videoId = ref(null);
    let videoStatusPollTimer = null;
    let videoStatusPollInFlight = false;

    const canPlayVideo = computed(() => {
        return !!episode.value?.stream_video_id
            && (videoProcessingStatus.value === 'processed' || episode.value?.is_video_processed === true);
    });

    const canSeeEpisodeAttachments = computed(() => {
        if (!isLoggedin.value || !episode.value) return false;
        return Number(episode.value.lock) === 0 || userCanSeeCourse.value === true;
    });

    const videoProcessingLabel = computed(() => {
        const status = videoProcessingStatus.value;
        if (status === 'queued') return t('course.episode.videoQueued');
        if (status === 'processing') return t('course.episode.videoProcessing');
        return t('course.episode.preparing');
    });

    function stopVideoStatusPolling() {
        if (videoStatusPollTimer) {
            clearInterval(videoStatusPollTimer);
            videoStatusPollTimer = null;
        }
        videoStatusPollInFlight = false;
    }

    function startVideoStatusPolling() {
        if (videoStatusPollTimer || !isVideoProcessing.value) return;
        videoStatusPollTimer = setInterval(async () => {
            if (!isVideoProcessing.value || videoStatusPollInFlight) {
                if (!isVideoProcessing.value) stopVideoStatusPolling();
                return;
            }
            videoStatusPollInFlight = true;
            try {
                const response = await axiosInstance.get(
                    "/course/" + courseSlug.value + "/episode/" + episodeOrder.value
                );
                const ep = response.data?.episode;
                if (!ep || !episode.value) return;

                episode.value.video_status = ep.video_status;
                episode.value.video_id = ep.video_id;
                episode.value.is_video_processed = ep.is_video_processed;
                episode.value.stream_video_id = ep.stream_video_id;
                episode.value.video_progress = ep.video_progress;

                applyVideoProcessingStatus(ep);
                if (!isVideoProcessing.value) {
                    stopVideoStatusPolling();
                }
            } catch (e) {
                // keep polling; status may become available later
            } finally {
                videoStatusPollInFlight = false;
            }
        }, 10000);
    }

    function applyVideoProcessingStatus(ep) {
        if (!ep) {
            videoProcessingStatus.value = null;
            videoId.value = null;
            isVideoProcessing.value = false;
            isVideoFailed.value = false;
            videoProcessingProgress.value = null;
            stopVideoStatusPolling();
            return;
        }

        videoProcessingStatus.value = ep.video_status ?? null;
        videoId.value = ep.video_id ?? null;
        videoProcessingProgress.value = typeof ep.video_progress === 'number' ? ep.video_progress : null;

        const status = ep.video_status;
        const hasStream = !!ep.stream_video_id;
        const isProcessed = ep.is_video_processed === true || status === 'processed';

        if (status === 'failed') {
            isVideoFailed.value = true;
            isVideoProcessing.value = false;
            stopVideoStatusPolling();
            return;
        }

        isVideoFailed.value = false;

        // Ready only when a stream record exists (playable).
        if (hasStream && (isProcessed || status === 'processed')) {
            videoProcessingStatus.value = 'processed';
            isVideoProcessing.value = false;
            stopVideoStatusPolling();
            return;
        }

        if (isProcessed && !hasStream) {
            // Inconsistent: marked processed but no stream — keep waiting UI briefly via poll
            isVideoProcessing.value = !!ep.video_id;
            if (isVideoProcessing.value) startVideoStatusPolling();
            return;
        }

        const waitingStatuses = [null, undefined, 'queued', 'processing', 'uploaded'];
        const stillWaiting = !!ep.video_id && waitingStatuses.includes(status);
        isVideoProcessing.value = stillWaiting;

        if (stillWaiting) {
            startVideoStatusPolling();
        } else {
            stopVideoStatusPolling();
        }
    }

    async function onDownloadButtonClick() {
        if (!episode.value) return;
        if (!canDownload.value) {
            toast.warning(t("course.episode.downloadOnlyForBuyers"), {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                bodyClassName: "font-YekanBakh text-gray-800",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            return;
        }
        // If already loaded once, just toggle menu without network
        if (availableDownloadOptions.value.length > 0) {
            isDownloadMenuOpen.value = !isDownloadMenuOpen.value;
            return;
        }
        downloadBtnLoading.value = true;
        try {
            const response = await axiosInstance.post("/episode/" + episode.value.id + "/checkDownload");
            if (response.data && Array.isArray(response.data.qualities)) {
                const list = response.data.qualities;
                if (list.length && typeof list[0] === 'object') {
                    availableDownloadOptions.value = [...list].sort((a, b) => b.quality - a.quality);
                } else {
                    availableDownloadOptions.value = [...list].sort((a, b) => b - a).map(q => ({ quality: q, size: null }));
                }
                isDownloadMenuOpen.value = true;
            } else if (response.data && response.data.url) {
                // Single URL response
                downloadLink.value = response.data.url;
                window.location.href = downloadLink.value;
                isDownloadMenuOpen.value = false;
            }
        } catch (e) {
            // noop
        } finally {
            downloadBtnLoading.value = false;
        }
    }

    async function selectDownloadQuality(quality) {
        if (!episode.value) return;
        if (!canDownload.value) {
            toast.warning(t("course.episode.downloadOnlyForBuyers"), {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                bodyClassName: "font-YekanBakh text-gray-800",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            return;
        }
        downloadBtnLoading.value = true;
        try {
            const response = await axiosInstance.post("/episode/" + episode.value.id + "/checkDownload", { quality });
            if (response.data && response.data.url) {
                downloadLink.value = response.data.url;
                // Trigger download immediately
                window.location.href = downloadLink.value;
            }
        } catch (e) {
            // noop
        } finally {
            downloadBtnLoading.value = false;
            isDownloadMenuOpen.value = false;
        }
    }

    function onClickOutside(event) {
        if (!isDownloadMenuOpen.value) return;
        const root = downloadMenuRef.value;
        if (root && !root.contains(event.target)) {
            isDownloadMenuOpen.value = false;
        }
    }

    function formatBytes(bytes, lang) {
        if (bytes === null || bytes === undefined) return "-";
        const langCode = lang ?? locale.value;
        let units;
        if (langCode === 'fa') {
            units = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت", "ترابایت"];
        } else {
            units = ["B", "KB", "MB", "GB", "TB"];
        }
        let size = Number(bytes);
        if (isNaN(size) || size < 0) return "-";
        let i = 0;
        while (size >= 1024 && i < units.length - 1) {
            size /= 1024;
            i++;
        }
        const value = size >= 100 ? Math.round(size) : size >= 10 ? Math.round(size * 10) / 10 : Math.round(size * 100) / 100;
        return `${value} ${units[i]}`;
    }

    onMounted(async () => {
        await getEpisode();
        document.addEventListener('click', onClickOutside);
    });
    onBeforeUnmount(() => {
        stopVideoStatusPolling();
        document.removeEventListener('click', onClickOutside);
    });
    watch(
        () => [route.params.courseSlug, route.params.episodeOrder],
        async ([newCourseSlug, newEpisodeOrder]) => {
            stopVideoStatusPolling();
            courseSlug.value = newCourseSlug;
            episodeOrder.value = newEpisodeOrder;
            episode.value = null;
            course.value = null;
            contentBlocked.value = null;
            userCanSeeCourse.value = false;
            canDownload.value = false;
            videoProcessingStatus.value = null;
            videoId.value = null;
            isVideoProcessing.value = false;
            isVideoFailed.value = false;
            videoProcessingProgress.value = null;
            await getEpisode();
        }
    );
</script>

<style>
    :root {
        --plyr-color-main: #fed700;
        --plyr-badge-border-radius: 5px;
        --plyr-control-icon-size: 20px;
        --plyr-control-spacing: 8px;
        --plyr-control-radius: 0.2rem;
        --plyr-control-padding: --plyr-control-spacing * 0.2;
        --plyr-video-control-color-hover: black;
        /*--plyr-video-control-background-hover: --plyr-color-main;*/
        --plyr-menu-color: #000000;
        --plyr-menu-radius: 4px;
        --plyr-menu-arrow-size: 6px;
        --plyr-menu-item-arrow-color: #000000;
        --plyr-menu-border-color: red;
        --plyr-menu-border-shadow-color: #ffffff;
        --plyr-progress-loading-size: 25px;
        --plyr-progress-loading-background: rgba(35, 40, 47, 0.6);
        --plyr-video-progress-buffered-background: rgba(255, 255, 255, 0.25);
        --plyr-audio-progress-buffered-background: rgba(193, 200, 209, 0.6);
        --plyr-range-thumb-height: 10px;
        --plyr-range-thumb-background: #ffffff;
        --plyr-range-thumb-shadow: 0 1px 1px rgba(215, 26, 18, 0.15), 0 0 0 1px rgba(215, 26, 18, 0.2);
        --plyr-range-thumb-active-shadow-width: 7px;
        --plyr-range-track-height: 2px;
        /*--plyr-range-fill-background: --plyr-color-main;
  --plyr-video-range-track-background: --plyr-video-progress-buffered-background;*/
        --plyr-video-range-thumb-active-shadow-color: rgba(255, 255, 255, 0.5);
        --plyr-audio-range-track-background: --plyr-video-progress-buffered-background;
        /*--plyr-audio-range-thumb-active-shadow-color: rgba(215, 26, 18, 0.1);*/
        --plyr-tooltip-background: rgba(255, 255, 255, 0.9);
        --plyr-tooltip-color: #373839;
        --plyr-tooltip-padding: calc(var(--plyr-control-spacing) / 2);
        --plyr-tooltip-arrow-size: 4px;
        --plyr-tooltip-radius: 0.5rem;
    }

    .plyr__time--duration::before {
        content: "\007c" !important;
        margin-right: 5px !important;
        margin-left: 5px !important;
    }

    @media only screen and (min-width: 768px) {
        :root {
            --scrollbar-primary: #f1f1f1;
            --scrollbar-secondary: #c1c1c1;
            --scrollbar-secondary-hover: #b7b5b5;
            --scrollbar-secondary-active: #d2d1d1;
        }

        .dark {
            --scrollbar-primary: #424242;
            --scrollbar-secondary: #686868;
            --scrollbar-secondary-hover: #777676;
            --scrollbar-secondary-active: #868585;
        }

        /* .plyr styles are defined in the reusable VideoPlayer component */

        .plyr__controls {
            background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.9)) !important;
        }

    }

</style>
