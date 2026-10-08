<template>
    <div class="">
        <CourseSidebarStatusCard
            v-if="course"
            :course="course"
            :availability="availability" />
        <CourseSidebarInstallmentCard
            v-if="course"
            :course="course" />
        <div class="">
            <div v-if="course"
                class="space-y-3 bg-white dark:bg-gray-900 py-4 px-5 rounded-xl shadow-sm mb-4 overflow-hidden relative">
                <div class="justify-between flex">
                    <div class="flex items-center">
                        <i
                            class="w-24 h-24 bg-yellow-400 rounded-full bg-opacity-5 absolute top-10 transform -translate-y-1/2 rtl:-right-6 ltr:-left-6">
                            <i
                                class="w-14 h-14 bg-yellow-400 rounded-full bg-opacity-5 absolute top-10 transform -translate-y-1/2 right-1/2 translate-x-1/2">
                                <i
                                    class="w-8 h-8 bg-yellow-400 rounded-full bg-opacity-5 absolute top-10 transform -translate-y-1/2 right-1/2 translate-x-1/2"></i>
                            </i>
                        </i>
                        <i class="flex w-2 h-2 bg-yellow-400 dark:bg-white rtl:ml-2 ltr:mr-2 rounded-full"></i>
                        <span class="text-sm font-bold dark:text-white text-gray-400">
                            <!-- {{ course.status.title }} -->
                            {{ isLoggedIn && localRatings.currentUserRate && localRatings.currentUserRate.rating ?
                                $t('course.sidebar.yourRating', { rating: localRatings.currentUserRate.rating }) :
                                $t('course.sidebar.submitYourRating') }}
                        </span>
                    </div>
                    <div v-if="localRatings" class="space-y-2 flex flex-col items-center">
                        <div class="relative">
                            <span dir="ltr"
                                class="flex w-full whitespace-nowrap text-gray-300 dark:text-gray-400 relative z-10">
                                <button :disabled="rateLoading" class="cursor-pointer relative"
                                    :class="{ '!text-yellow-300': rate >= 1 || localRatings.averageRating >= 1 }"
                                    @click.prevent="setRate(1)" @mouseover="rate = 1" @mouseout="rate = 0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                                        stroke="currentColor" class="w-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                                        </path>
                                    </svg>
                                    <div class="absolute text-sm bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold"
                                        v-show="rate == 1" style="display: none">{{ $t('course.sidebar.rateVeryBad') }}
                                    </div>
                                </button>
                                <button :disabled="rateLoading" class="cursor-pointer relative"
                                    :class="{ '!text-yellow-300': rate >= 2 || localRatings.averageRating >= 2 }"
                                    @click.prevent="setRate(2)" @mouseover="rate = 2" @mouseout="rate = 0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                                        stroke="currentColor" class="w-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                                        </path>
                                    </svg>
                                    <div class="absolute text-sm bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold"
                                        v-show="rate == 2" style="display: none">{{ $t('course.sidebar.rateBad') }}
                                    </div>
                                </button>
                                <button :disabled="rateLoading" class="cursor-pointer relative"
                                    :class="{ '!text-yellow-300': rate >= 3 || localRatings.averageRating >= 3 }"
                                    @click.prevent="setRate(3)" @mouseover="rate = 3" @mouseout="rate = 0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                                        stroke="currentColor" class="w-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                                        </path>
                                    </svg>
                                    <div class="absolute text-sm bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold"
                                        v-show="rate == 3" style="display: none">{{ $t('course.sidebar.rateAverage') }}
                                    </div>
                                </button>
                                <button :disabled="rateLoading" class="cursor-pointer relative"
                                    :class="{ '!text-yellow-300': rate >= 4 || localRatings.averageRating >= 4 }"
                                    @click.prevent="setRate(4)" @mouseover="rate = 4" @mouseout="rate = 0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                                        stroke="currentColor" class="w-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                                        </path>
                                    </svg>
                                    <div class="absolute text-sm bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold"
                                        v-show="rate == 4" style="display: none">{{ $t('course.sidebar.rateGood') }}
                                    </div>
                                </button>
                                <button :disabled="rateLoading" class="cursor-pointer relative"
                                    :class="{ '!text-yellow-300': rate >= 5 || localRatings.averageRating >= 5 }"
                                    @click.prevent="setRate(5)" @mouseover="rate = 5" @mouseout="rate = 0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                                        stroke="currentColor" class="w-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                                        </path>
                                    </svg>
                                    <div class="absolute text-sm bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold"
                                        v-show="rate == 5" style="display: none">{{ $t('course.sidebar.rateExcellent')
                                        }}</div>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <div v-if="localRatings" class="space-y-2" dir="ltr">
                    <div class="flex items-center">
                        <div
                            class="w-6 text-xs justify-between font-medium text-gray-500 dark:text-gray-300 hover:underline flex items-center">
                            5
                            <svg class="w-3 h-3 ms-1 text-yellow-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        </div>
                        <div class="flex-1 items-center h-1.5 mx-1 bg-gray-200 rounded-xl dark:bg-gray-700">
                            <div class="h-1.5 bg-yellow-300 rounded-xl"
                                :style="`width: ${localRatings.countOfAll != 0 ? (localRatings.countOfFive / localRatings.countOfAll) * 100 : 0}%`">
                            </div>
                        </div>
                        <span class="w-7 text-xs text-center font-medium text-gray-500 dark:text-gray-300">{{
                            localRatings.countOfAll != 0 ? (localRatings.countOfFive / localRatings.countOfAll) * 100 :
                                0 }}%</span>
                    </div>
                    <div class="flex items-center">
                        <div
                            class="w-6 text-xs justify-between font-medium text-gray-500 dark:text-gray-300 hover:underline flex items-center">
                            4
                            <svg class="w-3 h-3 ms-1 text-yellow-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        </div>
                        <div class="flex-1 items-center h-1.5 mx-1 bg-gray-200 rounded-xl dark:bg-gray-700">
                            <div class="h-1.5 bg-yellow-300 rounded-xl"
                                :style="`width: ${localRatings.countOfAll != 0 ? (localRatings.countOfFour / localRatings.countOfAll) * 100 : 0}%`">
                            </div>
                        </div>
                        <span class="w-7 text-xs text-center font-medium text-gray-500 dark:text-gray-300">{{
                            localRatings.countOfAll != 0 ? (localRatings.countOfFour / localRatings.countOfAll) * 100 :
                                0 }}%</span>
                    </div>
                    <div class="flex items-center">
                        <div
                            class="w-6 text-xs justify-between font-medium text-gray-500 dark:text-gray-300 hover:underline flex items-center">
                            3
                            <svg class="w-3 h-3 ms-1 text-yellow-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        </div>
                        <div class="flex-1 items-center h-1.5 mx-1 bg-gray-200 rounded-xl dark:bg-gray-700">
                            <div class="h-1.5 bg-yellow-300 rounded-xl"
                                :style="`width: ${localRatings.countOfAll != 0 ? (localRatings.countOfThree / localRatings.countOfAll) * 100 : 0}%`">
                            </div>
                        </div>
                        <span class="w-7 text-xs text-center font-medium text-gray-500 dark:text-gray-300">{{
                            localRatings.countOfAll != 0 ? (localRatings.countOfThree / localRatings.countOfAll) * 100 :
                                0 }}%</span>
                    </div>
                    <div class="flex items-center">
                        <div
                            class="w-6 text-xs justify-between font-medium text-gray-500 dark:text-gray-300 hover:underline flex items-center">
                            2
                            <svg class="w-3 h-3 ms-1 text-yellow-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        </div>
                        <div class="flex-1 items-center h-1.5 mx-1 bg-gray-200 rounded-xl dark:bg-gray-700">
                            <div class="h-1.5 bg-yellow-300 rounded-xl"
                                :style="`width: ${localRatings.countOfAll != 0 ? (localRatings.countOfTwo / localRatings.countOfAll) * 100 : 0}%`">
                            </div>
                        </div>
                        <span class="w-7 text-xs text-center font-medium text-gray-500 dark:text-gray-300">{{
                            localRatings.countOfAll != 0 ? (localRatings.countOfTwo / localRatings.countOfAll) * 100 : 0
                        }}%</span>
                    </div>
                    <div class="flex items-center">
                        <div
                            class="w-6 text-xs justify-between font-medium text-gray-500 dark:text-gray-300 hover:underline flex items-center">
                            1
                            <svg class="w-3 h-3 ms-1 text-yellow-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        </div>
                        <div class="flex-1 items-center h-1.5 mx-1 bg-gray-200 rounded-xl dark:bg-gray-700">
                            <div class="h-1.5 bg-yellow-300 rounded-xl"
                                :style="`width: ${localRatings.countOfAll != 0 ? (localRatings.countOfOne / localRatings.countOfAll) * 100 : 0}%`">
                            </div>
                        </div>
                        <span class="w-7 text-xs text-center font-medium text-gray-500 dark:text-gray-300">{{
                            localRatings.countOfAll != 0 ? (localRatings.countOfOne / localRatings.countOfAll) * 100 : 0
                        }}%</span>
                    </div>
                </div>
                <div v-if="localRatings" class="text-center font-semibold text-gray-500 dark:text-gray-200">{{
                    $t('course.sidebar.averageOfTotal', {
                        avg: Number(Number(localRatings.averageRating).toFixed(2)),
                        count: localRatings.countOfAll
                    }) }}</div>
            </div>
        </div>

        <div v-if="course" class="grid lg:grid-cols-3 sm:grid-cols-4 grid-cols-3 gap-3 mb-4 rounded-xl">
            <div
                class="flex flex-col items-center justify-center shadow-sm bg-white dark:bg-gray-900 rounded-xl pt-3 pb-2">
                <span class="mt-1 inline-flex text-yellow-400">
                    <svg class="mb-3" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M12.1792 23.9333C2.54046 23.9333 0.474609 21.8674 0.474609 12.2287C0.474609 2.59002 2.54046 0.52417 12.1792 0.52417C21.8178 0.52417 23.8837 2.59002 23.8837 12.2287C23.8837 21.8674 21.8178 23.9333 12.1792 23.9333ZM11.2038 6.37644C11.2038 5.83773 11.6405 5.40106 12.1792 5.40106C12.7178 5.40106 13.1545 5.83773 13.1545 6.37644V11.2533H18.0314C18.5701 11.2533 19.0068 11.69 19.0068 12.2287C19.0068 12.7674 18.5701 13.2041 18.0314 13.2041H12.1792C11.6405 13.2041 11.2038 12.7674 11.2038 12.2287V6.37644Z"
                            fill="currentColor"></path>
                    </svg>
                </span>

                <span class="text-xs text-gray-400 dark:text-gray-400"> {{ $t('course.sidebar.courseDuration') }}</span>
                <span class="text-sm text-chambray-700 font-bold dark:text-gray-200">
                    {{ new Date(courseDuration * 1000).toISOString().slice(11, 19) }}
                </span>
            </div>
            <div
                class="flex flex-col items-center dark:bg-gray-900 justify-center shadow-sm bg-white rounded-xl pt-3 pb-2">
                <span class="mt-1 inline-flex text-yellow-400">
                    <svg class="mb-3" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0.452148 5.7989C0.452148 10.1426 1.38314 11.0736 5.72688 11.0736C10.0706 11.0736 11.0016 10.1426 11.0016 5.7989C11.0016 1.45516 10.0706 0.52417 5.72688 0.52417C1.38314 0.52417 0.452148 1.45516 0.452148 5.7989Z"
                            fill="currentColor"></path>
                        <path
                            d="M0.452148 18.2664C0.452148 22.6102 1.38314 23.5412 5.72688 23.5412C10.0706 23.5412 11.0016 22.6102 11.0016 18.2664C11.0016 13.9227 10.0706 12.9917 5.72688 12.9917C1.38314 12.9917 0.452148 13.9227 0.452148 18.2664Z"
                            fill="currentColor"></path>
                        <path
                            d="M12.9197 5.7989C12.9197 10.1426 13.8507 11.0736 18.1944 11.0736C22.5382 11.0736 23.4691 10.1426 23.4691 5.7989C23.4691 1.45516 22.5382 0.52417 18.1944 0.52417C13.8507 0.52417 12.9197 1.45516 12.9197 5.7989Z"
                            fill="currentColor"></path>
                        <path
                            d="M12.9197 18.2664C12.9197 22.6102 13.8507 23.5412 18.1944 23.5412C22.5382 23.5412 23.4691 22.6102 23.4691 18.2664C23.4691 13.9227 22.5382 12.9917 18.1944 12.9917C13.8507 12.9917 12.9197 13.9227 12.9197 18.2664Z"
                            fill="currentColor"></path>
                    </svg>
                </span>
                <span class="text-xs text-gray-400 dark:text-gray-400"> {{ $t('course.sidebar.episodesCount') }}</span>
                <span class="text-sm text-chambray-700 font-bold dark:text-gray-200">
                    {{ numberOfEpisodes }}
                </span>
            </div>
            <div
                class="flex flex-col items-center dark:bg-gray-900 justify-center shadow-sm bg-white rounded-xl pt-3 pb-2">
                <span class="mt-1 inline-flex text-yellow-400">
                    <svg class="mb-3" width="23" height="23" viewBox="0 0 23 23" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M8.57753 1.67007C9.81824 0.0338038 12.2781 0.0338038 13.5188 1.67007L14.5518 3.03246L16.2456 2.79957C18.28 2.51986 20.0193 4.25924 19.7396 6.29356L19.5067 7.98737L20.8691 9.0204C22.5054 10.2611 22.5054 12.721 20.8691 13.9617L19.5067 14.9947L19.7396 16.6885C20.0193 18.7228 18.28 20.4622 16.2456 20.1825L14.5518 19.9496L13.5188 21.312C12.2781 22.9483 9.81824 22.9483 8.57753 21.312L7.5445 19.9496L5.85069 20.1825C3.81636 20.4622 2.07699 18.7228 2.3567 16.6885L2.58958 14.9947L1.2272 13.9617C-0.409067 12.721 -0.409067 10.2611 1.2272 9.0204L2.58958 7.98737L2.3567 6.29356C2.07699 4.25923 3.81637 2.51986 5.85069 2.79957L7.5445 3.03246L8.57753 1.67007ZM15.3819 10.3007C15.7415 9.94114 15.7415 9.3582 15.3819 8.99865C15.0224 8.6391 14.4394 8.6391 14.0799 8.99865L10.1275 12.951L8.93717 11.7607C8.57762 11.4011 7.99468 11.4011 7.63513 11.7607C7.27558 12.1202 7.27558 12.7032 7.63513 13.0627L9.47649 14.9041C9.83604 15.2636 10.419 15.2636 10.7785 14.9041L15.3819 10.3007Z"
                            fill="currentColor"></path>
                    </svg>
                </span>
                <span class="text-xs text-gray-400 dark:text-gray-400">{{ $t('course.sidebar.courseType') }}</span>
                <span v-if="course.type === 'cash'" class="text-sm text-chambray-700 font-bold dark:text-gray-200"> {{
                    $t('course.sidebar.paid') }} </span>
                <span v-else-if="course.type === 'cash-vip'"
                    class="text-sm text-chambray-700 font-bold dark:text-gray-200"> {{ $t('course.sidebar.vipPaid') }}
                </span>
                <span v-else class="text-sm text-chambray-700 font-bold dark:text-gray-200"> {{
                    $t('course.sidebar.free') }} </span>
            </div>
            <div
                class="flex flex-col items-center dark:bg-gray-900 justify-center shadow-sm bg-white rounded-xl pt-3 pb-2">
                <span class="mt-1 inline-flex text-yellow-400">
                    <svg class="mb-3" width="34" height="21" viewBox="0 0 34 21" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.8 10.5C13.9005 10.5 11.55 8.14949 11.55 5.25C11.55 2.3505 13.9005 0 16.8 0C19.6995 0 22.05 2.3505 22.05 5.25C22.05 8.14949 19.6995 10.5 16.8 10.5Z"
                            fill="currentColor"></path>
                        <path
                            d="M16.8 21C9.8826 21 8.4 20.2587 8.4 16.8C8.4 13.3413 9.8826 12.6 16.8 12.6C23.7174 12.6 25.2 13.3413 25.2 16.8C25.2 20.2587 23.7174 21 16.8 21Z"
                            fill="currentColor"></path>
                        <path
                            d="M28.35 6.3C28.35 4.21451 26.687 2.1 24.15 2.1C23.5701 2.1 23.1 2.5701 23.1 3.15C23.1 3.7299 23.5701 4.2 24.15 4.2C25.393 4.2 26.25 5.23549 26.25 6.3C26.25 7.36451 25.393 8.4 24.15 8.4C23.5701 8.4 23.1 8.8701 23.1 9.45C23.1 10.0299 23.5701 10.5 24.15 10.5C26.687 10.5 28.35 8.38549 28.35 6.3Z"
                            fill="currentColor"></path>
                        <path
                            d="M9.45 2.1C6.91305 2.1 5.25 4.21451 5.25 6.3C5.25 8.38549 6.91305 10.5 9.45 10.5C10.0299 10.5 10.5 10.0299 10.5 9.45C10.5 8.8701 10.0299 8.4 9.45 8.4C8.20696 8.4 7.35 7.36451 7.35 6.3C7.35 5.23549 8.20696 4.2 9.45 4.2C10.0299 4.2 10.5 3.7299 10.5 3.15C10.5 2.5701 10.0299 2.1 9.45 2.1Z"
                            fill="currentColor"></path>
                        <path
                            d="M25.2 12.6C25.2 12.0201 25.6701 11.55 26.25 11.55C27.4155 11.55 28.4302 11.578 29.2926 11.6682C30.148 11.7576 30.9181 11.9139 31.5643 12.2054C32.2354 12.5081 32.7807 12.9613 33.1375 13.6167C33.4816 14.2487 33.6 14.9771 33.6 15.75C33.6 16.5271 33.4801 17.2303 33.1873 17.8373C32.8862 18.4619 32.4304 18.9252 31.8634 19.2492C30.8058 19.8535 29.3849 19.95 27.93 19.95C27.3501 19.95 26.88 19.4799 26.88 18.9C26.88 18.3201 27.3501 17.85 27.93 17.85C29.4151 17.85 30.3042 17.7215 30.8216 17.4258C31.0421 17.2998 31.1901 17.1444 31.2958 16.9252C31.4099 16.6885 31.5 16.3229 31.5 15.75C31.5 15.1729 31.4084 14.8325 31.2931 14.6208C31.1906 14.4325 31.0271 14.2669 30.7007 14.1196C30.3494 13.9611 29.8333 13.8361 29.0743 13.7568C28.3223 13.6782 27.3946 13.65 26.25 13.65C25.6701 13.65 25.2 13.1799 25.2 12.6Z"
                            fill="currentColor"></path>
                        <path
                            d="M7.35 11.55C7.9299 11.55 8.4 12.0201 8.4 12.6C8.4 13.1799 7.9299 13.65 7.35 13.65C6.20545 13.65 5.27769 13.6782 4.52572 13.7568C3.76673 13.8361 3.25061 13.9611 2.89928 14.1196C2.57288 14.2669 2.40942 14.4325 2.30687 14.6208C2.19162 14.8325 2.1 15.1729 2.1 15.75C2.1 16.3229 2.19007 16.6885 2.30422 16.9252C2.40993 17.1444 2.55791 17.2998 2.77845 17.4258C3.29579 17.7215 4.18491 17.85 5.67 17.85C6.2499 17.85 6.72 18.3201 6.72 18.9C6.72 19.4799 6.2499 19.95 5.67 19.95C4.21509 19.95 2.79421 19.8535 1.73655 19.2492C1.16959 18.9252 0.713821 18.4619 0.41266 17.8373C0.11993 17.2303 0 16.5271 0 15.75C0 14.9771 0.118379 14.2487 0.462506 13.6167C0.819327 12.9613 1.36462 12.5081 2.03572 12.2054C2.68189 11.9139 3.45202 11.7576 4.3074 11.6682C5.16981 11.578 6.18455 11.55 7.35 11.55Z"
                            fill="currentColor"></path>
                    </svg>
                </span>

                <span class="text-xs text-gray-400 dark:text-gray-400">{{ $t('course.sidebar.participants') }}</span>
                <span class="text-sm text-chambray-700 font-bold dark:text-gray-200">{{ $t('course.sidebar.peopleCount',
                    { count: course.users_count }) }}</span>
            </div>
            <div
                class="flex flex-col items-center dark:bg-gray-900 justify-center shadow-sm bg-white rounded-xl pt-3 pb-2">
                <span class="mt-1 inline-flex text-yellow-400">
                    <svg class="mb-3" width="23" height="23" viewBox="0 0 23 23" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill="#fed700" fill-rule="evenodd" clip-rule="evenodd"
                            d="M20.125 7.66667C17.4786 7.66667 15.3333 5.52136 15.3333 2.875C15.3333 1.90785 15.6199 1.00763 16.1127 0.254587C14.817 0.0726507 13.2917 0 11.5 0C2.02975 0 0 2.02975 0 11.5C0 20.9702 2.02975 23 11.5 23C20.9702 23 23 20.9702 23 11.5C23 9.70834 22.9273 8.183 22.7454 6.88733C21.9924 7.38013 21.0921 7.66667 20.125 7.66667ZM5.39746 14.3078C5.88929 14.5024 6.4457 14.2617 6.64075 13.7702C6.64075 13.7702 6.64113 13.7692 5.75 13.4167L6.64113 13.7692L6.64511 13.7594C6.64891 13.7501 6.65517 13.7349 6.6638 13.7144C6.68109 13.6733 6.70783 13.6111 6.74348 13.5322C6.81496 13.3739 6.92116 13.1506 7.05756 12.8963C7.33667 12.376 7.7155 11.7765 8.15035 11.3302C8.60321 10.8655 8.96617 10.7168 9.23262 10.7343C9.47541 10.7502 9.99147 10.9311 10.6951 12.0201C11.5395 13.327 12.5162 14.1044 13.6419 14.1783C14.7438 14.2506 15.6248 13.6207 16.2224 13.0073C16.8381 12.3755 17.3162 11.5974 17.6315 11.0096C17.7923 10.7099 17.9176 10.4465 18.0033 10.2567C18.0463 10.1615 18.0796 10.0842 18.1027 10.0294C18.1142 10.0019 18.1233 9.98002 18.1297 9.96426L18.1374 9.94528L18.1398 9.93935L18.1406 9.9373C18.1406 9.9373 18.1411 9.93587 17.25 9.58333L18.1411 9.93587C18.3358 9.44371 18.0947 8.8869 17.6025 8.6922C17.1107 8.49762 16.5542 8.73834 16.3592 9.2299L16.3589 9.2308L16.3549 9.2406L16.3454 9.26355L16.3362 9.28564C16.3189 9.3267 16.2922 9.38886 16.2565 9.46779C16.185 9.62607 16.0788 9.84937 15.9424 10.1037C15.6633 10.624 15.2845 11.2235 14.8497 11.6698C14.3968 12.1345 14.0339 12.2832 13.7674 12.2657C13.5246 12.2498 13.0086 12.0689 12.3049 10.9799C11.4605 9.67304 10.4838 8.89562 9.35819 8.82172C8.25625 8.74937 7.37521 9.37932 6.77758 9.99267C6.16194 10.6245 5.68379 11.4026 5.36854 11.9904C5.20775 12.2901 5.08243 12.5535 4.99669 12.7433C4.95372 12.8385 4.92042 12.9158 4.89732 12.9706C4.88576 12.9981 4.87674 13.02 4.87031 13.0357L4.86262 13.0547L4.86025 13.0606L4.85944 13.0627C4.85944 13.0627 4.85887 13.0641 5.75 13.4167L4.85887 13.0641C4.66416 13.5563 4.9053 14.1131 5.39746 14.3078Z">
                        </path>
                        <path fill="#fed700"
                            d="M20.125 5.75C18.5372 5.75 17.25 4.46282 17.25 2.875C17.25 1.28718 18.5372 0 20.125 0C21.7128 0 23 1.28718 23 2.875C23 4.46282 21.7128 5.75 20.125 5.75Z">
                        </path>
                    </svg>
                </span>

                <span class="text-xs text-gray-400 dark:text-gray-400"> {{ $t('course.sidebar.lastUpdate') }}</span>
                <span class="text-sm text-chambray-700 font-bold dark:text-gray-200">
                    {{
                        lastUpdateDate
                            .toLocaleDateString($i18n.locale === 'en' ? 'en-US' : 'fa-IR', {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })
                            .replace(/\//g, "-")
                    }}
                </span>
            </div>
            <component :is="quizTarget ? 'router-link' : 'div'" :to="quizTarget" v-if="quizzes && quizzes.length"
                class="flex flex-col items-center justify-center shadow-sm bg-white dark:bg-gray-900 rounded-xl pt-3 pb-2"
                :class="quizTarget ? 'hover:ring-1 hover:ring-yellow-400 transition' : ''">
                <span class="mt-1 inline-flex text-yellow-400">
                    <svg class="mb-3 w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.58584 14.3415 10.232 13.883 10.704C13.7907 10.7989 13.7027 10.8869 13.6187 10.9708C13.4029 11.1864 13.2138 11.3753 13.0479 11.5885C12.8289 11.8699 12.75 12.0768 12.75 12.25V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V12.25C11.25 11.5948 11.555 11.0644 11.8642 10.6672C12.0929 10.3733 12.3804 10.0863 12.6138 9.85346C12.6842 9.78321 12.7496 9.71789 12.807 9.65877C13.0046 9.45543 13.125 9.18004 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                            fill="currentColor"></path>
                    </svg>
                </span>
                <span class="text-xs text-gray-400 dark:text-gray-400">{{ $t('quiz.sidebar.hasQuiz') }}</span>
                <span class="text-sm text-chambray-700 font-bold dark:text-gray-200">
                    {{ $t('quiz.sidebar.quizCount', { count: quizzes.length }) }}
                </span>
            </component>
        </div>
        <div v-if="course && course.type === 'cash-vip'"
            class="flex bg-white dark:bg-gray-900 py-3 px-5 items-center rounded-xl shadow-sm mb-4">
            <span
                class="bg-amber-500 w-9 h-9 rounded-full flex justify-center items-center bg-opacity-10 rtl:ml-2 ltr:mr-2">
                <svg class="" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M7.51948 0C7.20651 0 6.97288 0.170496 6.84031 0.290642C6.69449 0.422804 6.56604 0.590066 6.45512 0.757278C6.23117 1.09488 6.0115 1.53595 5.81242 1.98501C5.41124 2.88996 5.04899 3.93049 4.85966 4.49853C4.85688 4.50686 4.8487 4.51341 4.8388 4.51375C4.24561 4.5338 3.15848 4.587 2.21094 4.72596C1.74282 4.79461 1.27138 4.88927 0.903294 5.02633C0.722052 5.09382 0.524397 5.1864 0.361363 5.3207C0.196358 5.45663 0 5.69486 0 6.0384C0 6.27599 0.0898927 6.48632 0.171263 6.63641C0.258481 6.79729 0.373748 6.95673 0.497041 7.10728C0.744163 7.40905 1.07092 7.73208 1.40876 8.03931C2.08766 8.65669 2.87387 9.26634 3.32118 9.60341C3.32824 9.60872 3.33152 9.6176 3.3286 9.62718C3.15682 10.1912 2.85847 11.2231 2.66868 12.1802C2.57441 12.6556 2.50162 13.1382 2.49068 13.5458C2.48525 13.7485 2.49418 13.9584 2.53471 14.1508C2.57247 14.33 2.65544 14.5816 2.86777 14.7693C3.10609 14.9799 3.39291 15.0078 3.59151 14.9955C3.7946 14.983 3.99799 14.9242 4.17924 14.8558C4.54528 14.7176 4.95846 14.4865 5.35463 14.2369C6.15498 13.7327 7.00245 13.0782 7.4844 12.6934C7.49312 12.6864 7.50593 12.6863 7.51508 12.6936C7.99693 13.0787 8.84509 13.7336 9.65143 14.2381C10.0508 14.488 10.4682 14.7192 10.8406 14.8572C11.0254 14.9256 11.2309 14.9834 11.4358 14.9956C11.637 15.0076 11.9159 14.9794 12.1539 14.784C12.3769 14.601 12.4695 14.3495 12.5125 14.163C12.5578 13.9666 12.5683 13.7533 12.5633 13.549C12.5532 13.1384 12.4766 12.654 12.3774 12.1788C12.1776 11.2215 11.8614 10.1893 11.6785 9.62293C11.6752 9.61289 11.6787 9.60353 11.686 9.59801C12.1355 9.25907 12.92 8.65026 13.5966 8.03439C13.9333 7.72792 14.2588 7.4058 14.5049 7.10485C14.6278 6.95469 14.7426 6.79564 14.8294 6.6351C14.9105 6.48527 15 6.27544 15 6.0384C15 5.69522 14.804 5.45711 14.6392 5.32114C14.4763 5.18683 14.2789 5.09425 14.0979 5.02677C13.7303 4.88973 13.2595 4.79507 12.792 4.72639C11.8457 4.58739 10.7594 4.53404 10.1649 4.51387C10.1549 4.51353 10.1468 4.507 10.1441 4.4986C9.95906 3.92888 9.6059 2.88924 9.21283 1.98553C9.0178 1.53715 8.80202 1.09651 8.58089 0.759047C8.47137 0.59192 8.34406 0.424329 8.19875 0.291738C8.06628 0.170864 7.83292 0 7.51948 0Z"
                        fill="#FFA826"></path>
                </svg>
            </span>

            <p class="text-slate-600 dark:text-gray-400 text-8 font-bold text-sm w-10/12 leading-6">
                {{ $t('course.sidebar.freeForVipNotice') }}

                <router-link to="/"
                    class="ms-1 inline-flex align-middle items-center text-black hover:text-yellow-400 dark:text-gray-200">
                    {{ $t('course.sidebar.vipMembership') }}
                    <svg class="ms-2 ltr:rotate-180 w-3 h-3" viewBox="0 0 18 12" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-current gruop-hover:text-gray-900" opacity="0.4"
                            d="M12.4789 4.53947L15.8693 4.23962C16.6302 4.23962 17.2471 4.86253 17.2471 5.63081C17.2471 6.3991 16.6302 7.022 15.8693 7.022L12.4789 6.72216C11.882 6.72216 11.3981 6.23353 11.3981 5.63081C11.3981 5.02709 11.882 4.53947 12.4789 4.53947">
                        </path>
                        <path class="fill-current gruop-hover:text-gray-900"
                            d="M1.09392 4.5946C1.14691 4.5411 1.34488 4.31495 1.53085 4.12717C2.61567 2.95102 5.44819 1.02779 6.92994 0.439206C7.1549 0.345316 7.7238 0.145421 8.02875 0.131287C8.3197 0.131287 8.59765 0.198928 8.86261 0.332191C9.19355 0.518962 9.45751 0.813757 9.60348 1.16105C9.69647 1.40133 9.84244 2.12317 9.84244 2.1363C9.98742 2.92477 10.0664 4.20693 10.0664 5.62437C10.0664 6.97315 9.98742 8.20281 9.86844 9.00441C9.85544 9.01855 9.70947 9.91404 9.55049 10.2209C9.25954 10.7823 8.69064 11.1296 8.08174 11.1296H8.02875C7.63182 11.1164 6.79796 10.7681 6.79796 10.756C5.3952 10.1674 2.62966 8.33708 1.51785 7.12055C1.51785 7.12055 1.2039 6.80758 1.06793 6.61274C0.855964 6.33208 0.749982 5.98478 0.749982 5.63749C0.749982 5.24981 0.868961 4.8894 1.09392 4.5946">
                        </path>
                    </svg>
                </router-link>
            </p>
        </div>
        <div v-if="course?.certificate_enabled" class="bg-white dark:bg-gray-900 py-3 sm:px-5 px-2 rounded-xl shadow-sm mb-4">
            <div class="flex items-center mb-4">
                <span
                    class="flex justify-center items-center w-12 h-12 bg-yellow-400 bg-opacity-10 rounded-full rtl:ml-3 ltr:mr-3">
                    <svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M5.50847 10.9168C12.107 14.744 12.9322 14.744 19.5307 10.9168C26.1292 7.08956 26.1292 7.08956 19.5307 3.26237C12.9322 -0.564826 12.107 -0.564837 5.50847 3.26237C2.20921 5.17597 0.55957 6.13277 0.55957 7.08957V15.7008C0.55957 16.2292 0.987944 16.6576 1.51637 16.6576C2.0448 16.6576 2.47317 16.2292 2.47317 15.7008L2.47317 9.45617C2.47317 9.30453 2.64132 9.21274 2.76975 9.29336C3.50113 9.75249 4.41404 10.282 5.50847 10.9168Z"
                            fill="#FACC15"></path>
                        <path
                            d="M5.50847 11.8736C12.107 15.7008 12.9322 15.7008 19.5307 11.8736L19.9071 11.6553C20.2058 11.4819 20.5824 11.672 20.6043 12.0167C20.6375 12.5376 20.6524 13.125 20.6524 13.7872C20.6524 18.5712 18.7388 19.528 12.4867 19.528C5.81641 19.528 4.38677 18.5712 4.38677 13.7872C4.38677 13.1253 4.40096 12.5382 4.43295 12.0175C4.45418 11.672 4.83143 11.4807 5.13075 11.6545L5.50847 11.8736Z"
                            fill="#FACC15"></path>
                    </svg>
                </span>
                <div>
                    <h6 class="flex text-xs text-gray-400 dark:text-gray-400 mb-2">
                        {{ $t('course.sidebar.completionCertificate') }}
                        <svg class="rtl:mr-1 ltr:ml-1" width="15" height="15" viewBox="0 0 15 15" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="7.62407" cy="7.3676" r="7.25688" fill="#98A3B8" fill-opacity="0.14"></circle>
                            <rect x="8.34961" y="3.01349" width="5.8055" height="1.45138" rx="0.725688"
                                transform="rotate(90 8.34961 3.01349)" fill="#98A3B8"></rect>
                            <path
                                d="M6.89844 10.2704C6.89844 9.86958 7.22334 9.54468 7.62413 9.54468C8.02491 9.54468 8.34981 9.86958 8.34981 10.2704C8.34981 10.6712 8.02491 10.9961 7.62413 10.9961C7.22334 10.9961 6.89844 10.6712 6.89844 10.2704Z"
                                fill="#98A3B8"></path>
                        </svg>
                    </h6>
                    <div class="flex items-center">
                        <span class="text-slate-500 text-sm dark:text-gray-200 font-semibold rtl:ml-1 ltr:mr-1">{{
                            $t('course.sidebar.status') }}</span>
                        <span v-if="!isLoggedIn"
                            class="text-[10px] text-gray-600 dark:text-slate-200 py-0.5 rounded px-2 bg-yellow-400 bg-opacity-30">{{
                                $t('course.sidebar.loginFirst') }}</span>
                        <span v-else-if="!userCanSeeCourse"
                            class="text-[10px] text-gray-600 dark:text-slate-200 py-0.5 rounded px-2 bg-yellow-400 bg-opacity-30">{{
                                $t('course.sidebar.enrollFirst') }}</span>
                        <span v-else-if="!userCompletedCourse"
                            class="text-[10px] text-gray-700 dark:text-slate-200 py-0.5 rounded px-2 bg-gray-200 dark:bg-opacity-30">{{
                                $t('course.sidebar.awaitingFullOnlineView') }}</span>
                        <router-link v-else
                            class="flex items-center py-0.5 text-[10px] text-white rounded px-2 bg-green-500"
                            :to="{ name: 'certificate', params: { uuid: certificateUuid }, query: { type: 'download' } }"
                            target="_blank">
                            {{ $t('course.sidebar.activeDownloadCertificate') }}
                            <svg class="ms-1 w-3 h-3" viewBox="0 1 17 13" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.0028 6.5421C11.0028 7.92435 9.88178 9.04456 8.49953 9.04456C7.11728 9.04456 5.99707 7.92435 5.99707 6.5421C5.99707 5.15906 7.11728 4.03885 8.49953 4.03885C9.88178 4.03885 11.0028 5.15906 11.0028 6.5421Z"
                                    stroke="currentColor" stroke-width="1.1" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M8.49809 12.3227C11.5128 12.3227 14.2701 10.1551 15.8226 6.54195C14.2701 2.92878 11.5128 0.7612 8.49809 0.7612H8.50126C5.48659 0.7612 2.72922 2.92878 1.17676 6.54195C2.72922 10.1551 5.48659 12.3227 8.50126 12.3227H8.49809Z"
                                    stroke="currentColor" stroke-width="1.1" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                            </svg>
                        </router-link>
                    </div>
                </div>
            </div>
            <router-link
                class="flex items-center font-bold text-sm justify-center border-t border-dashed border-gray-300 border-opacity-50 dark:border-opacity-20 pt-3 text-yellow-400 dark:text-white group transition dark:hover:text-yellow-400 duration-200 transform hover:text-gray-800"
                :to="{ name: 'what-is-certification' }">
                {{ $t('course.sidebar.whatIsCertificate') }}
                <svg class="rtl:mr-2 ltr:ml-2 ltr:rotate-180 mb-1" width="18" height="12" viewBox="0 0 18 12"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" opacity="0.4"
                        d="M12.4789 4.53947L15.8693 4.23962C16.6302 4.23962 17.2471 4.86253 17.2471 5.63081C17.2471 6.3991 16.6302 7.022 15.8693 7.022L12.4789 6.72216C11.882 6.72216 11.3981 6.23353 11.3981 5.63081C11.3981 5.02709 11.882 4.53947 12.4789 4.53947">
                    </path>
                    <path fill="currentColor"
                        d="M1.09392 4.5946C1.14691 4.5411 1.34488 4.31495 1.53085 4.12717C2.61567 2.95102 5.44819 1.02779 6.92994 0.439206C7.1549 0.345316 7.7238 0.145421 8.02875 0.131287C8.3197 0.131287 8.59765 0.198928 8.86261 0.332191C9.19355 0.518962 9.45751 0.813757 9.60348 1.16105C9.69647 1.40133 9.84244 2.12317 9.84244 2.1363C9.98742 2.92477 10.0664 4.20693 10.0664 5.62437C10.0664 6.97315 9.98742 8.20281 9.86844 9.00441C9.85544 9.01855 9.70947 9.91404 9.55049 10.2209C9.25954 10.7823 8.69064 11.1296 8.08174 11.1296H8.02875C7.63182 11.1164 6.79796 10.7681 6.79796 10.756C5.3952 10.1674 2.62966 8.33708 1.51785 7.12055C1.51785 7.12055 1.2039 6.80758 1.06793 6.61274C0.855964 6.33208 0.749982 5.98478 0.749982 5.63749C0.749982 5.24981 0.868961 4.8894 1.09392 4.5946">
                    </path>
                </svg>
            </router-link>
        </div>
        <!-- Episode/Course quizzes -->
        <div v-if="quizzes && quizzes.length"
            class="bg-white dark:bg-gray-900 py-3 sm:px-5 px-2 rounded-xl shadow-sm mb-4">
            <component
                :is="quizzes.length > 1 ? 'button' : 'div'"
                type="button"
                class="flex w-full items-center text-start"
                :class="quizzes.length > 1 ? 'cursor-pointer' : ''"
                @click="quizzes.length > 1 && (quizzesOpen = !quizzesOpen)"
            >
                <span
                    class="flex justify-center items-center w-12 h-12 bg-yellow-400 bg-opacity-10 rounded-full rtl:ml-3 ltr:mr-3 shrink-0">
                    <svg class="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9 12L10.5 13.5L13 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M9 17H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </span>
                <div class="min-w-0 flex-1">
                    <h6 class="text-sm font-bold text-gray-700 dark:text-white">{{ $t('quiz.sidebar.title') }}</h6>
                    <p class="text-xs text-gray-400 dark:text-gray-400">
                        {{ $t('quiz.sidebar.quizCount', { count: quizzes.length }) }}
                    </p>
                </div>
                <svg
                    v-if="quizzes.length > 1"
                    class="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200"
                    :class="quizzesOpen ? 'rotate-180' : ''"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </component>
            <div v-show="quizzes.length === 1 || quizzesOpen" class="mt-3 space-y-2">
                <QuizCard
                    v-for="quiz in quizzes"
                    :key="quiz.uuid"
                    :quiz="quiz"
                    :logged-in="isLoggedIn"
                    :can-take-quiz="effectiveCanTakeQuiz"
                />
            </div>
        </div>
        <div v-if="course?.teacher" class="bg-white dark:bg-gray-900 p-6 flex flex-col items-center rounded-xl shadow-sm mb-4">
            <div class="relative" style="">
                <div
                    class="w-16 h-16 bg-gray-300 group relative rounded-full overflow-hidden border-4 border-solid border-gray-200">
                    <router-link v-if="course.teacher.username"
                        :to="{ name: 'profile-page', params: { username: course.teacher.username } }">
                        <SeoImage
                            :src="course.teacher.profile_pic"
                            alt="user-avatar"
                            :width="64"
                            :height="64"
                            sizes-preset="avatar"
                            img-class="object-cover transition duration-200 transform group-hover:scale-110 w-full h-full"
                        />
                        <div class="w-full h-full absolute top-0 right-0 bg-biscay-700 bg-opacity-20 z-0"></div>
                    </router-link>
                </div>
            </div>
            <div class="text-center mt-2">
                <h6>
                    <router-link v-if="course.teacher.username"
                        class="text-gray-500 dark:text-white group dark:hover:text-yellow-400 hover:text-yellow-400 transition duration-200 font-bold text-xl flex items-center leading-3"
                        :to="'/@' + course.teacher.username">
                        {{ (course.teacher.first_name || '') + " " + (course.teacher.last_name || '') }}
                        <svg class="rtl:mr-1 ltr:ml-1 text-yellow-400 dark:text-white transition duration-200 dark:group-hover:text-yellow-400"
                            width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.6936 9.39221C16.6936 9.97583 16.5534 10.5171 16.273 11.0127C15.9926 11.5083 15.6176 11.8962 15.1448 12.1669C15.1579 12.2549 15.1644 12.3918 15.1644 12.5777C15.1644 13.4613 14.8677 14.2112 14.2808 14.8307C13.6907 15.4534 12.9799 15.7632 12.1485 15.7632C11.7768 15.7632 11.4214 15.6947 11.0856 15.5577C10.8247 16.0925 10.4498 16.5228 9.95745 16.8521C9.46838 17.1847 8.9304 17.3477 8.34678 17.3477C7.75012 17.3477 7.20888 17.188 6.72633 16.8619C6.24052 16.5391 5.86883 16.1055 5.60799 15.5577C5.27217 15.6947 4.92004 15.7632 4.54508 15.7632C3.71367 15.7632 2.99962 15.4534 2.40296 14.8307C1.8063 14.2112 1.50959 13.458 1.50959 12.5777C1.50959 12.4799 1.52264 12.3429 1.54546 12.1669C1.07269 11.893 0.697739 11.5083 0.417339 11.0127C0.1402 10.5171 0 9.97583 0 9.39221C0 8.77272 0.156502 8.20214 0.466246 7.68699C0.77599 7.17184 1.19333 6.79036 1.715 6.54257C1.57806 6.17088 1.50959 5.79592 1.50959 5.42423C1.50959 4.5439 1.8063 3.79074 2.40296 3.17125C2.99962 2.55176 3.71367 2.23876 4.54508 2.23876C4.91678 2.23876 5.27217 2.30723 5.60799 2.44417C5.86883 1.90945 6.24378 1.47907 6.73611 1.14976C7.22518 0.820458 7.76316 0.654175 8.34678 0.654175C8.9304 0.654175 9.46838 0.820458 9.95745 1.1465C10.4465 1.47581 10.8247 1.90619 11.0856 2.44091C11.4214 2.30397 11.7735 2.2355 12.1485 2.2355C12.9799 2.2355 13.6907 2.54524 14.2808 3.16799C14.871 3.79074 15.1644 4.54064 15.1644 5.42097C15.1644 5.83179 15.1025 6.20348 14.9786 6.53931C15.5002 6.7871 15.9176 7.16858 16.2273 7.68373C16.5371 8.20214 16.6936 8.77272 16.6936 9.39221ZM7.99139 11.906L11.4377 6.74472C11.5257 6.60778 11.5518 6.4578 11.5225 6.29803C11.4899 6.13827 11.4084 6.01111 11.2714 5.92634C11.1345 5.83831 10.9845 5.80896 10.8247 5.83179C10.6617 5.85787 10.5313 5.93612 10.4335 6.07306L7.39799 10.6377L5.99925 9.24223C5.87535 9.11833 5.73189 9.05964 5.57213 9.06616C5.4091 9.07269 5.26891 9.13137 5.14501 9.24223C5.03415 9.35308 4.97872 9.49328 4.97872 9.66283C4.97872 9.82911 5.03415 9.96931 5.14501 10.0834L7.06542 12.0038L7.15997 12.0788C7.27083 12.1538 7.38494 12.1897 7.4958 12.1897C7.71425 12.1864 7.88053 12.0951 7.99139 11.906Z"
                                fill="currentColor"></path>
                        </svg>
                    </router-link>
                </h6>
                <span class="text-gray-400 dark:text-gray-400 text-sm -mt-2">{{ $t('course.sidebar.courseInstructor')
                }}</span>
            </div>
            <p v-if="course?.teacher?.info?.about"
                class="line-clamp-5 text-gray-500 text-15 mt-1.5 leading-7 dark:text-gray-400 text-center">
                {{ course?.teacher?.info?.about }}
            </p>
        </div>
        <div class="bg-white dark:bg-gray-900 lg:flex hidden flex-col px-12 pt-3 pb-3 items-center mb-4 rounded-xl">
            <router-link :to="{ name: 'discuss-index' }">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 722.11262 558.1509"
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path
                        d="M892.0771,705.04148h-585.082a68.4964,68.4964,0,0,1-66.89649-83.21289l26.13379-118.78711H932.83979l26.13379,118.78711a68.49639,68.49639,0,0,1-66.89648,83.21289Zm-624.23731-200-25.78808,117.2168a66.49673,66.49673,0,0,0,64.94336,80.7832h585.082a66.49674,66.49674,0,0,0,64.94336-80.7832l-25.78809-117.2168Z"
                        transform="translate(-238.47977 -171.03678)" fill="#f2f2f2"></path>
                    <path
                        d="M817.7855,249.41514l30.69046-4.5739-4.84758-21.34916-18.4,9.26659-37.961-14.30669a7.71684,7.71684,0,1,0-5.0485,10.199Z"
                        transform="translate(-238.47977 -171.03678)" fill="#ffb6b6"></path>
                    <path
                        d="M880.164,233.45546c-2.37275,8.99484-57.04774,19.14085-57.02046,17.19492.07752-5.53051,3.5933-17.135,1.58543-20.14555-1.14827-1.72168,14.31267-6.121,14.31267-6.121s8.53341-3.28453,19.59642-7.29317a19.72107,19.72107,0,0,1,18.85049,2.60441S882.5367,224.46062,880.164,233.45546Z"
                        transform="translate(-238.47977 -171.03678)" fill="#fed700"></path>
                    <path d="M351.24671,608.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M412.24671,608.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M473.24671,608.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M534.24671,608.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M595.24671,608.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M656.24671,608.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M717.24671,608.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M778.24671,608.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M839.24671,608.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M351.24671,541.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M412.24671,541.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M473.24671,541.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#fed700"></path>
                    <path d="M534.24671,541.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M595.24671,541.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M656.24671,541.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M717.24671,541.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M778.24671,541.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M839.24671,541.03678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M379.74671,575.53678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M440.74671,575.53678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M501.74671,575.53678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M562.74671,575.53678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M623.74671,575.53678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M684.74671,575.53678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M745.74671,575.53678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M806.74671,575.53678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M867.74671,575.53678h-19a16,16,0,0,0,0,32h19a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path
                        d="M797.37855,504.03678H402.61488a23.64479,23.64479,0,0,1-23.61817-23.61816l.02588-.22559c13.96582-60.42773,13.96045-136.18164-.0166-238.40234l-.00928-.13574a23.64512,23.64512,0,0,1,23.61817-23.61817H797.37855A23.64511,23.64511,0,0,1,820.99671,241.655l-.022.209a566.87235,566.87235,0,0,0,0,238.3457l.022.209A23.64478,23.64478,0,0,1,797.37855,504.03678Z"
                        transform="translate(-238.47977 -171.03678)" fill="#fff"></path>
                    <path
                        d="M797.37855,504.03678H402.61488a23.64479,23.64479,0,0,1-23.61817-23.61816l.02588-.22559c13.96582-60.42773,13.96045-136.18164-.0166-238.40234l-.00928-.13574a23.64512,23.64512,0,0,1,23.61817-23.61817H797.37855A23.64511,23.64511,0,0,1,820.99671,241.655l-.022.209a566.87235,566.87235,0,0,0,0,238.3457l.022.209A23.64478,23.64478,0,0,1,797.37855,504.03678ZM380.9972,480.53092a21.64307,21.64307,0,0,0,21.61768,21.50586H797.37855a21.64279,21.64279,0,0,0,21.61767-21.51367,568.84463,568.84463,0,0,1,0-238.97266,21.64279,21.64279,0,0,0-21.61767-21.51367H402.61488a21.64308,21.64308,0,0,0-21.61817,21.55078C394.98939,343.95622,394.99036,419.89274,380.9972,480.53092Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M755.99671,288.53678h-319a6.5,6.5,0,0,1,0-13h319a6.5,6.5,0,0,1,0,13Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M755.99671,320.03678h-319a6.5,6.5,0,0,1,0-13h319a6.5,6.5,0,0,1,0,13Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M755.99671,351.53678h-319a6.5,6.5,0,0,1,0-13h319a6.5,6.5,0,0,1,0,13Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M755.99671,383.03678h-319a6.5,6.5,0,0,1,0-13h319a6.5,6.5,0,0,1,0,13Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M755.99671,414.53678h-319a6.5,6.5,0,0,1,0-13h319a6.5,6.5,0,0,1,0,13Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M579.99671,446.03678h-143a6.5,6.5,0,0,1,0-13h143a6.5,6.5,0,0,1,0,13Z"
                        transform="translate(-238.47977 -171.03678)" fill="#fed700"></path>
                    <path
                        d="M598.17835,495.53678H571.85511a2.65765,2.65765,0,0,1-2.06885-1.01953,3.174,3.174,0,0,1-.60058-2.65234l12.3872-56.0459a2.69956,2.69956,0,0,1,5.32032-.08106l13.936,56.04493a3.1748,3.1748,0,0,1-.55762,2.7041A2.65706,2.65706,0,0,1,598.17835,495.53678Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                    <path d="M928.99671,516.53678h-658a13.5,13.5,0,0,1,0-27h658a13.5,13.5,0,0,1,0,27Z"
                        transform="translate(-238.47977 -171.03678)" fill="#f2f2f2"></path>
                    <polygon points="607.193 311.693 597.591 311.692 593.024 274.657 607.195 274.658 607.193 311.693"
                        fill="#ffb6b6"></polygon>
                    <path
                        d="M848.12137,492.03678l-30.95975-.00114v-.39159a12.051,12.051,0,0,1,12.0504-12.05021h.00076l5.65521-4.29034,10.55135,4.291,2.7026.0001Z"
                        transform="translate(-238.47977 -171.03678)" fill="#2f2e41"></path>
                    <polygon points="693.95 299.209 685.357 303.492 664.747 272.384 677.431 266.063 693.95 299.209"
                        fill="#ffb6b6"></polygon>
                    <path
                        d="M938.77356,477.48361l-27.709,13.81-.17469-.35047a12.051,12.051,0,0,1,5.40937-16.16039l.00069-.00034,3.14742-6.36255,11.3575-.86655,2.41883-1.20552Z"
                        transform="translate(-238.47977 -171.03678)" fill="#2f2e41"></path>
                    <path
                        d="M841.41862,314.52925l52.94493,1.85308,3.95881,7.35208s4.14634,30.07924,2.02286,32.20272-3.18522,2.12348-2.12348,5.83957,3.80663,39.22214,3.80663,39.22214,21.87145,45.36626,22.93319,48.02061,2.12348,1.59261,1.06174,2.65435A39.09813,39.09813,0,0,0,923.369,454.859H906.0645s-9.31724-23.50265-17.846-32.59349a51.63525,51.63525,0,0,1-13.61219-29.178l-7.175-33.96517L852.036,411.14763s-2.65436,51.49442-2.12349,54.14877l.53087,2.65435-20.39562.22781s-2.12348-4.47477-1.06174-6.06738.998-1.15789-.29729-3.76417-.76445-7.02253-.76445-7.02253,7.65474-104.41215,7.65474-106.00476a5.29511,5.29511,0,0,0-.441-2.38825V340.7697l2.03361-7.66Z"
                        transform="translate(-238.47977 -171.03678)" fill="#2f2e41"></path>
                    <path
                        d="M864.24632,218.46691c-3.44619,2.04877-5.50772,5.81313-6.69112,9.64368a91.38867,91.38867,0,0,0-3.9272,21.83492l-1.24993,22.18655a91.3502,91.3502,0,0,1-11.627,40.78356,7.12994,7.12994,0,0,0,4.45968,10.32456c19.18914,5.03527,55.533-1.28668,55.533-1.28668s1.548-.516,0-2.064-5.02085-9.28825-5.02085-9.28825l4.12808-27.117,5.16009-54.69713c-6.19215-7.74017-18.64533-12.30294-18.64533-12.30294l-3.21775-5.79194-16.08872,1.28709Z"
                        transform="translate(-238.47977 -171.03678)" fill="#fed700"></path>
                    <circle cx="635.97946" cy="20.8342" r="15.4554" fill="#ffb8b8"></circle>
                    <path
                        d="M893.50263,190.95324a26.87734,26.87734,0,0,1-3.67594,8.807,5.99486,5.99486,0,0,1-2.00508,2.27656,2.19153,2.19153,0,0,1-2.78481-.34811l-.376-.30633a7.97635,7.97635,0,0,0,1.9494-1.69177,2.71626,2.71626,0,0,0,.52216-2.42975,1.67252,1.67252,0,0,0-2.04685-1.093c-.9051.35507-1.45508,1.66393-2.40191,1.46205-.76585-.16712-.926-1.17659-.926-1.97027.02783-4.1494-1.97724-10.04623-3.52977-9.86521a12.51866,12.51866,0,0,1-4.62973-.61963,12.12965,12.12965,0,0,0-4.63675-.5918c-.11138.01394-.22279.03484-.34114.05571a10.267,10.267,0,0,0-1.03036-2.24873,12.01386,12.01386,0,0,1-.12532,2.54809,23.83181,23.83181,0,0,1-3.857,1.21836c-1.43418.20192-4.588,4.49053-4.73418,4.05191a10.2676,10.2676,0,0,0-1.03037-2.24872,12.01386,12.01386,0,0,1-.12531,2.54809c-.007.0348-.007.06267-.01394.09748-.69621-.926-1.12088-2.05382-.88419-1.19053-2.33227-5.2772-1.42722-9.05759,2.2418-13.50635a7.05517,7.05517,0,0,1,2.75-2.207,3.46792,3.46792,0,0,1,3.38359.33421,11.38389,11.38389,0,0,1,11.29242-2.40888c3.82216,1.32977,6.76713,2.10952,7.35192,6.11966a8.50874,8.50874,0,0,1,8.15257,3.96834A12.84965,12.84965,0,0,1,893.50263,190.95324Z"
                        transform="translate(-238.47977 -171.03678)" fill="#2f2e41"></path>
                    <path
                        d="M909.99671,291.38527l.02514-31.02941-21.83183,1.63,6.43726,19.57017-19.77475,35.42138a7.71685,7.71685,0,1,0,9.33816,6.5043Z"
                        transform="translate(-238.47977 -171.03678)" fill="#ffb6b6"></path>
                    <path
                        d="M903.45817,227.33035c8.54385,3.67964,10.47463,59.25452,8.55424,58.93915-5.458-.89632-16.41325-6.09313-19.68811-4.55362-1.87284.88042-3.93214-15.06177-3.93214-15.06177s-1.98355-8.926-4.30831-20.4609a19.721,19.721,0,0,1,5.36941-18.25633S894.91432,223.65073,903.45817,227.33035Z"
                        transform="translate(-238.47977 -171.03678)" fill="#fed700"></path>
                    <path
                        d="M375.81748,570.22737a5.23881,5.23881,0,0,1,.34211-8.02572l-5.8656-17.66857,9.34295,2.51,4.1377,16.39356a5.26714,5.26714,0,0,1-7.95716,6.79069Z"
                        transform="translate(-238.47977 -171.03678)" fill="#ffb6b6"></path>
                    <path
                        d="M392.75058,474.23094c1.55025.88871,10.72239-1.31335,12.51367-.68693-.98881,6.03322,4.38179,3.76921-1.45026,11.69239s-17.57849,31.679-20.24693,40.55766-.02734,21.391-.427,25.599a43.66668,43.66668,0,0,0,.036,7.32415c-3.151-.03982-6.25679.61406-9.457.19641-3.41282-9.657-5.70752-23.40286-7.26568-30.99974s-1.61516-4.38419-.90051-8.18286.88769-1.03827.137-4.67233,2.28537-8.2,5.09062-10.80348c1.20952-3.47889,2.77265-6.72266,3.97008-10.16523C383.52546,486.4351,384.1024,482.01317,392.75058,474.23094Z"
                        transform="translate(-238.47977 -171.03678)" fill="#3f3d56"></path>
                    <path
                        d="M474.88381,559.02692a5.23879,5.23879,0,0,1-5.97865-5.36516l-17.36876-6.70149,7.87608-5.61769,15.28618,7.2251a5.26715,5.26715,0,0,1,.18515,10.45924Z"
                        transform="translate(-238.47977 -171.03678)" fill="#ffb6b6"></path>
                    <path
                        d="M411.53417,484.94c1.67143-.632,5.80107-9.11275,7.4232-10.09752,4.02934,4.598,5.69494-.98721,8.1051,8.55116s13.28449,33.70588,18.443,41.40914,16.49713,13.61695,19.49177,16.6a43.66635,43.66635,0,0,0,5.67736,4.62732c-2.03347,2.40735-3.50266,5.22071-5.85913,7.42595-9.62465-3.50308-21.69532-10.46818-28.55069-14.0937s-4.4113-1.53959-6.88976-4.50569-.23737-1.34524-3.52012-3.07542-4.87812-6.9762-5.10508-10.79665c-1.91706-3.14492-3.42783-6.4134-5.32453-9.52591C415.09278,499.81889,412.04562,496.563,411.53417,484.94Z"
                        transform="translate(-238.47977 -171.03678)" fill="#3f3d56"></path>
                    <polygon points="186.123 366.39 194.791 405.071 139.247 401.616 154.351 363.627 186.123 366.39"
                        fill="#ffb6b6"></polygon>
                    <polygon points="176.874 544.917 183.113 544.916 186.081 520.851 176.873 520.851 176.874 544.917"
                        fill="#ffb6b6"></polygon>
                    <path
                        d="M413.24084,712.87544l9.86294-.58869v4.22572l9.377,6.47607a2.63953,2.63953,0,0,1-1.49987,4.81163h-11.7422l-2.024-4.17987-.79025,4.17987h-4.42727Z"
                        transform="translate(-238.47977 -171.03678)" fill="#2f2e41"></path>
                    <polygon points="117.905 541.813 124.002 543.135 132.005 520.246 123.006 518.294 117.905 541.813"
                        fill="#ffb6b6"></polygon>
                    <path
                        d="M354.97208,709.39342l9.76355,1.51568-.89587,4.12965,7.79087,8.31682a2.63954,2.63954,0,0,1-2.48586,4.38428l-11.47529-2.48939-1.09179-4.51394-1.65844,3.91732-4.32664-.93859Z"
                        transform="translate(-238.47977 -171.03678)" fill="#2f2e41"></path>
                    <path
                        d="M434.68851,608.453c-4.37873,24.06477-5.4734,34.45515-5.4734,34.45515s3.28406,3.82832,1.09467,6.01771,0,6.562,0,6.562l-4.923,53.05259-3.96291-.64217-9.5464-1.535-3.44307-.5565,2.18938-49.76853s-2.18938-4.37873-1.09467-5.47345c1.09467-1.09467-1.09471-7.65667-1.09471-7.65667l-2.73365-51.95791-16.95847,56.88094s1.64506,2.18939,0,3.82836c-1.639,1.639-4.91694,9.846-4.91694,9.846l-10.08457,35.28686-.8562,2.99661-5.25938-.9846-5.72416-1.07634-1.0519-.19567-1.87136-.35471-1.20475-.22628-.40977-.07338-1.98144-.37308.59935-2.66026.31186-1.40045,8.53123-37.8921.1957-.87452.20795-.92346s-1.09471-2.73364.54426-4.37873a4.27375,4.27375,0,0,0,1.09471-3.82836,1.49325,1.49325,0,0,1-.14677-.18346,2.27029,2.27029,0,0,1-.3914-.89288,2.96057,2.96057,0,0,1,1.08855-2.752,4.66973,4.66973,0,0,0,.77669-1.113c1.66345-3.14953,2.50128-9.82161,2.50128-9.82161s1.48-52.84464,6.32348-60.9172c.25689-.422,5.39871-8.523,5.66779-8.68811,5.46733-3.27793,48.06278,1.24967,48.06278,1.24967s2.57993,6.93083,2.69613,7.65247C434.07529,573.13556,438.40067,588.03921,434.68851,608.453Z"
                        transform="translate(-238.47977 -171.03678)" fill="#2f2e41"></path>
                    <path
                        d="M421.7457,481.16455s.92165-4.78429-7.93483-13.64077c-4.68873-1.56291-12.81266-.652-15.62908,0-13.02424,17.192-10.69228,14.15858-14.08253,23.7643a13.52866,13.52866,0,0,0-.928,6.83773c1.5629,7.81454,4.10025,47.92846,3.57928,50.01234s-4.16776,4.68872-.521,4.68872,50.67527-.82322,49.63333-2.38613S421.7457,481.16455,421.7457,481.16455Z"
                        transform="translate(-238.47977 -171.03678)" fill="#3f3d56"></path>
                    <circle cx="168.57659" cy="278.54491" r="14.93754" fill="#ffb6b6"></circle>
                    <path
                        d="M394.40092,455.22963c-.08162,1.81151-1.21709,3.37347-2.09351,4.95938a19.78854,19.78854,0,0,0-.18369,18.45966c1.21928,2.31278,2.90747,4.37677,3.8749,6.80567a7.73112,7.73112,0,0,1-.06058,6.52172c-2.61823-2.51922-3.89582-1.189-6.869-3.388,1.16921,3.27673.17249,3.38345,1.34621,6.65666q-7.56916,2.16111-15.14392,4.33382a18.25213,18.25213,0,0,0,5.22148-21.48155c-1.846-3.95845-5.14554-7.22129-6.34675-11.4272a12.39871,12.39871,0,0,1,17.04247-14.71269C392.88618,451.472,394.4831,453.44685,394.40092,455.22963Z"
                        transform="translate(-238.47977 -171.03678)" fill="#2f2e41"></path>
                    <path
                        d="M413.16307,432.8393c-2.0088-4.38928-7.309-3.4962-12.10128-2.91722a14.894,14.894,0,0,0-11.15917,8.28094,20.35278,20.35278,0,0,0-1.10354,14.1278,15.47841,15.47841,0,0,0,4.88706,8.23865c2.53091,2.03537,14.42859,6.84906,15.419,2.70413-1.23813,5.40754-4.45963,8.48642-.77251,12.63124,1.90974-5.73678,9.9854-11.18566,11.89514-16.92244.28747-.86355-.89305-11.01274-.60558-11.87629.606-1.82026,1.21278-3.64358,1.65064-5.51142.55-2.34638.76172-5.03695-.69576-6.95627s-5.12912-1.994-5.86577.30066"
                        transform="translate(-238.47977 -171.03678)" fill="#2f2e41"></path>
                    <path
                        d="M410.75815,451.10681l-.63851-4.06484c.43393-5.05554-.27442-13.097,3.04343-14.20267l2.029,2.029C413.90857,435.29624,411.46749,442.85627,410.75815,451.10681Z"
                        transform="translate(-238.47977 -171.03678)" fill="#ff6584"></path>
                    <path
                        d="M556.26874,727.99768a1.18647,1.18647,0,0,1-1.19006,1.19h-280.29a1.19,1.19,0,1,1,0-2.38h280.29A1.18651,1.18651,0,0,1,556.26874,727.99768Z"
                        transform="translate(-238.47977 -171.03678)" fill="#ccc"></path>
                    <path d="M702.99671,654.04148h-206a16,16,0,0,0,0,32h206a16,16,0,0,0,0-32Z"
                        transform="translate(-238.47977 -171.03678)" fill="#e6e6e6"></path>
                </svg>
            </router-link>
            <h6>
                <span
                    class="text-gray-700 dark:text-white dark:hover:text-yellow-400 transform transition duration-200 font-bold text-xl flex items-center mb-2">
                    {{ $t('course.sidebar.developersChat') }} </span>
            </h6>
            <p class="text-gray-500 dark:text-gray-400 text-center text-xs font-semibold leading-6 mb-4">{{
                $t('course.sidebar.developersChatDescription') }}</p>
            <router-link :to="{ name: 'discuss-index' }"
                class="flex items-center font-semibold text-17 justify-center text-gray-600 dark:text-gray-400 hover:text-yellow-400 dark:hover:text-yellow-400 group transition duration-200 transform">
                {{ $t('course.sidebar.clickToEnter') }}
                <svg class="rtl:mr-2 ltr:ml-2 ltr:rotate-180" width="21" height="15" viewBox="0 0 21 15" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" opacity="0.4"
                        d="M12.4789 4.53947L15.8693 4.23962C16.6302 4.23962 17.2471 4.86253 17.2471 5.63081C17.2471 6.3991 16.6302 7.022 15.8693 7.022L12.4789 6.72216C11.882 6.72216 11.3981 6.23353 11.3981 5.63081C11.3981 5.02709 11.882 4.53947 12.4789 4.53947">
                    </path>
                    <path fill="currentColor"
                        d="M1.09392 4.5946C1.14691 4.5411 1.34488 4.31495 1.53085 4.12717C2.61567 2.95102 5.44819 1.02779 6.92994 0.439206C7.1549 0.345316 7.7238 0.145421 8.02875 0.131287C8.3197 0.131287 8.59765 0.198928 8.86261 0.332191C9.19355 0.518962 9.45751 0.813757 9.60348 1.16105C9.69647 1.40133 9.84244 2.12317 9.84244 2.1363C9.98742 2.92477 10.0664 4.20693 10.0664 5.62437C10.0664 6.97315 9.98742 8.20281 9.86844 9.00441C9.85544 9.01855 9.70947 9.91404 9.55049 10.2209C9.25954 10.7823 8.69064 11.1296 8.08174 11.1296H8.02875C7.63182 11.1164 6.79796 10.7681 6.79796 10.756C5.3952 10.1674 2.62966 8.33708 1.51785 7.12055C1.51785 7.12055 1.2039 6.80758 1.06793 6.61274C0.855964 6.33208 0.749982 5.98478 0.749982 5.63749C0.749982 5.24981 0.868961 4.8894 1.09392 4.5946">
                    </path>
                </svg>
            </router-link>
        </div>
    </div>
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import QuizCard from "@/views/components/quiz/QuizCard.vue";
import CourseSidebarStatusCard from "@/views/components/course/CourseSidebarStatusCard.vue";
import CourseSidebarInstallmentCard from "@/views/components/course/CourseSidebarInstallmentCard.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
    components: { QuizCard, CourseSidebarStatusCard, CourseSidebarInstallmentCard, SeoImage },
    props: {
        course: {
            type: Object,
        },
        availability: {
            type: Object,
            default: null,
        },
        userCanSeeCourse: {
            type: Boolean,
            default: false,
        },
        userCompletedCourse: {
            type: Boolean,
            default: false,
        },
        certificateUuid: {
            type: String,
            default: null,
        },
        ratings: {
            type: Object,
            default: () => ({
                countOfOne: 0,
                countOfTwo: 0,
                countOfThree: 0,
                countOfFour: 0,
                countOfFive: 0,
                countOfAll: 0,
                sumOfAll: 0,
                averageRating: 0,
                currentUserRate: null,
            }),
        },
        quizzes: {
            type: Array,
            default: () => [],
        },
        canTakeQuiz: {
            type: Boolean,
            default: null,
        },
    },
    data() {
        return {
            rateLoading: false,
            rate: null,
            localRatings: this.ratings,
            courseDuration: 0,
            numberOfEpisodes: 0,
            quizzesOpen: false,
        };
    },
    computed: {
        isLoggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
        quizTarget() {
            if (!this.quizzes || !this.quizzes.length) return null;
            const first = this.quizzes[0];
            if (!first?.uuid) return null;
            if (this.isLoggedIn && this.effectiveCanTakeQuiz) {
                return { name: 'quiz-intro', params: { uuid: first.uuid } };
            }
            if (!this.isLoggedIn) {
                return { name: 'login', query: { redirect: '/quiz/' + first.uuid } };
            }
            return null;
        },
        effectiveCanTakeQuiz() {
            return this.canTakeQuiz !== null ? this.canTakeQuiz : this.userCanSeeCourse;
        },
        lastUpdateDate() {
            const raw = this.course?.last_content_update || this.course?.availability?.last_content_update;
            return raw ? new Date(raw) : new Date(this.course?.updated_at || Date.now());
        },
    },
    methods: {
        async setRate(value) {
            if (!this.isLoggedIn) {
                toast.warning(this.$t("course.sidebar.loginToRate"), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh text-gray-800",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
            else if (this.localRatings.currentUserRate) {
                toast.warning(this.$t("course.sidebar.alreadyRated"), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh text-gray-800",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
            else {
                this.rateLoading = true;
                await axiosInstance
                    .post("/setRate", {
                        rateable_id: this.course.id,
                        rateable_type: "Course",
                        rating: value,
                    })
                    .then((response) => {
                        this.localRatings = response.data.ratings;
                        toast.success(this.$t("course.sidebar.rateSuccess"), {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh text-white",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    })
                    .catch((error) => {
                        console.error(error.response.data.message);
                        if (error.response.status === 409) {
                            toast.warning(this.$t("course.sidebar.rateAlreadyRegistered"), {
                                theme: "colored",
                                hideProgressBar: false,
                                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                                bodyClassName: "font-YekanBakh text-gray-800",
                                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                                transition: toast.TRANSITIONS.BOUNCE,
                                position: toast.POSITION.BOTTOM_RIGHT,
                            });
                        } else if (error.response.status === 403) {
                            toast.warning(this.$t("course.sidebar.enrollToRate"), {
                                theme: "colored",
                                hideProgressBar: false,
                                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                                bodyClassName: "font-YekanBakh text-gray-800",
                                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                                transition: toast.TRANSITIONS.BOUNCE,
                                position: toast.POSITION.BOTTOM_RIGHT,
                            });
                        } else {
                            toast.error(error.response.data.message, {
                                theme: "colored",
                                hideProgressBar: false,
                                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                                bodyClassName: "font-YekanBakh text-gray-800",
                                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                                transition: toast.TRANSITIONS.BOUNCE,
                                position: toast.POSITION.BOTTOM_RIGHT,
                            });
                        }
                    })
                    .finally(() => {
                        this.rateLoading = false;
                    });
            }
        },
        updateCourseStats() {
            this.courseDuration = 0;
            this.numberOfEpisodes = 0;
            if (!this.course?.section?.length) {
                return;
            }
            this.course.section.forEach((section) => {
                const episodes = section.episode || [];
                this.numberOfEpisodes += episodes.length;
                episodes.forEach((episode) => {
                    this.courseDuration += parseInt(episode.total_time, 10) || 0;
                });
            });
        },
    },
    watch: {
        course: {
            immediate: true,
            handler() {
                this.updateCourseStats();
            },
        },
        ratings: {
            immediate: true,
            handler(val) {
                this.localRatings = val || {
                    countOfOne: 0,
                    countOfTwo: 0,
                    countOfThree: 0,
                    countOfFour: 0,
                    countOfFive: 0,
                    countOfAll: 0,
                    sumOfAll: 0,
                    averageRating: 0,
                    currentUserRate: null,
                };
            },
        },
        quizzes: {
            immediate: true,
            handler(list) {
                this.quizzesOpen = !list || list.length <= 1;
            },
        },
    },
};
</script>

<style scoped>
.text-slate-400 {
    color: #94a3b8;
    /* Tailwind Slate-400 */
}

.text-yellow-400 {
    color: #facc15;
    /* Tailwind Yellow-400 */
}
</style>
