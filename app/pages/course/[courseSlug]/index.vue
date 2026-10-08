<template>
    <MasterPage>
        <div class="mx-auto max-w-screen-xl px-2">
            <section class="mt-20 mb-8">
                <div v-if="course">
                    <div
                        class="group/outer rounded-2xl md:rounded-[4rem] md:hover:rounded-[3rem] transition-all duration-500 p-1 md:p-1.5 border-2 border-white dark:border-gray-600/80">
                        <div
                            class="mb-2 lg:mb-0 rounded-2xl md:rounded-[4rem] md:group-hover/outer:rounded-[3rem] transition-[border-radius] duration-500 p-1 md:p-2 bg-white dark:bg-gray-900 w-full flex flex-col md:flex-row items-stretch md:items-center justify-between">
                            <div
                                class="w-full md:w-7/12 lg:w-7/12 order-last md:order-first p-2 md:p-3 lg:ps-10 flex flex-col justify-between">
                                <div class="text-center md:text-start mt-3">
                                    <h2
                                        class="text-gray-700 dark:text-white md:text-3xl text-2xl font-extrabold md:line-clamp-1">
                                        {{ displayCourseTitle }}</h2>
                                    <p
                                        class="text-gray-500 md:text-base text-sm font-medium md:leading-8 leading-7 mt-4 md:line-clamp-2">
                                        {{ course.short_description }}</p>
                                    <InstallmentPurchaseBanner
                                        v-if="course.price > 0 && course.allows_installment"
                                        variant="inline"
                                        class="mt-4 md:text-start text-center"
                                        :allows-installment="course.allows_installment"
                                    />
                                </div>
                                <div
                                    class="mt-4 flex flex-col md:flex-row md:items-center md:justify-between justify-center space-y-4">
                                    <div class="flex items-center">
                                        <CourseAvailabilityBanner v-if="isCourseArchived && !userCanSeeCourse"
                                            status-slug="archive"
                                            :title="course?.status?.title || $t('course.show.archived')"
                                            :message="courseAvailability?.message || $t('course.show.archivedMessage')"
                                            class="max-w-md w-full" />
                                        <div v-else-if="!isLoggedin">
                                            <!-- complete -->
                                            <router-link :to="{ name: 'login' }"
                                                class="group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-neutral-950 py-1 ps-6 pe-14 font-medium text-neutral-50"><span
                                                    class="z-10 pe-2">{{ $t('course.show.loginToLearn') }}</span>
                                                <div
                                                    class="absolute end-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-yellow-400/30 transition-[width] group-hover:w-[calc(100%-8px)]">
                                                    <div class="me-3.5 flex items-center justify-center">
                                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="h-5 w-5 text-neutral-50 rtl:rotate-180">
                                                            <path
                                                                d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                                                                fill="currentColor" fill-rule="evenodd"
                                                                clip-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </router-link>
                                        </div>
                                        <div v-else>
                                            <div v-if="userCanSeeCourse">
                                                <div v-if="course.type == 'free'" class="">
                                                    <!-- complete -->
                                                    <button @click.prevent="scrollToSection('episodes-list')"
                                                        type="button"
                                                        class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-neutral-950 px-6 font-medium text-neutral-200">
                                                        <span>{{ $t('course.show.enterEpisodesFree') }}</span>
                                                        <div
                                                            class="ms-1 transition group-hover:translate-x-2 rtl:group-hover:-translate-x-2">
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="h-5 w-5 rtl:rotate-180">
                                                                <path
                                                                    d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                                                                    fill="currentColor" fill-rule="evenodd"
                                                                    clip-rule="evenodd"></path>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>
                                                <div v-else>
                                                    <!-- complete -->
                                                    <button @click.prevent="scrollToSection('episodes-list')"
                                                        type="button"
                                                        class="group relative h-9 overflow-hidden overflow-x-hidden rounded-md bg-gray-300 px-8 py-2 text-gray-900 text-sm font-semibold"><span
                                                            class="relative z-10"> {{ $t('course.show.continueLearning')
                                                            }} </span> <span
                                                            class="absolute inset-0 overflow-hidden rounded-md"><span
                                                                class="absolute start-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-gray-400 transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span></span></button>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <!-- complete -->
                                                <button v-if="!isCourseInCart" @click="addToCart('course', course.id)"
                                                    :disabled="addToCartLoading"
                                                    class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-black px-6 font-medium text-gray-50 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]">
                                                    <span v-if="!addToCartLoading"
                                                        class="flex items-center text-sm font-semibold">
                                                        {{ $t('course.show.buyCourse') }}
                                                        <svg class="ms-1 mb-1" width="23" height="19"
                                                            viewBox="0 0 23 19" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor"
                                                                d="M4.73678 9.95638C10.9561 13.5636 11.7339 13.5637 17.9532 9.95638C24.1726 6.3491 24.1726 6.3491 17.9532 2.74183C11.7339 -0.865436 10.9561 -0.865446 4.73678 2.74183C1.62711 4.54547 0.0722656 5.44729 0.0722656 6.34911V14.4655C0.0722656 14.9635 0.476023 15.3673 0.974084 15.3673C1.47214 15.3673 1.8759 14.9635 1.8759 14.4655L1.8759 8.57971C1.8759 8.43679 2.03439 8.35027 2.15544 8.42626C2.84479 8.85901 3.70524 9.35808 4.73678 9.95638Z">
                                                            </path>
                                                            <path fill="currentColor"
                                                                d="M4.73678 10.8583C10.9561 14.4655 11.7339 14.4655 17.9532 10.8583L18.308 10.6524C18.5895 10.489 18.9445 10.6682 18.9652 10.9931C18.9965 11.4841 19.0104 12.0377 19.0104 12.6618C19.0104 17.1709 17.2068 18.0728 11.314 18.0728C5.02702 18.0728 3.67954 17.1709 3.67954 12.6618C3.67954 12.038 3.69291 11.4846 3.72307 10.9938C3.74307 10.6682 4.09864 10.4879 4.38077 10.6517L4.73678 10.8583Z">
                                                            </path>
                                                        </svg>
                                                    </span>
                                                    <svg v-else class="w-6 h-6" version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        viewBox="25 25 50 50">
                                                        <circle class="stroke-current opacity-30" cx="50" cy="50" r="20"
                                                            fill="none" stroke-width="8" stroke-linecap="round"
                                                            stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
                                                        <circle class="stroke-current" cx="50" cy="50" r="20"
                                                            fill="none" stroke-width="8" stroke-linecap="round"
                                                            stroke-dashoffset="0" stroke-dasharray="100, 200">
                                                            <animateTransform attributeName="transform"
                                                                attributeType="XML" type="rotate" from="0 50 50"
                                                                to="360 50 50" dur="2.5s" repeatCount="indefinite">
                                                            </animateTransform>
                                                            <animate attributeName="stroke-dashoffset"
                                                                values="0;-30;-124" dur="1.25s"
                                                                repeatCount="indefinite"></animate>
                                                            <animate attributeName="stroke-dasharray"
                                                                values="0,200;110,200;110,200" dur="1.25s"
                                                                repeatCount="indefinite"></animate>
                                                        </circle>
                                                    </svg>
                                                </button>
                                                <router-link v-else :to="{ name: 'cart' }"
                                                    class="group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-neutral-950 py-1 ps-6 pe-14 font-medium text-neutral-50"><span
                                                        class="z-10 pe-2">{{ $t('course.show.checkoutAndStart')
                                                        }}</span>
                                                    <div
                                                        class="absolute end-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-neutral-700/60 transition-[width] group-hover:w-[calc(100%-8px)]">
                                                        <div class="me-3.5 flex items-center justify-center">
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="h-5 w-5 text-neutral-50 rtl:rotate-180">
                                                                <path
                                                                    d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                                                                    fill="currentColor" fill-rule="evenodd"
                                                                    clip-rule="evenodd"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="!isCourseArchived" class="flex flex-col items-center md:items-end gap-1.5">
                                        <DiscountBadge
                                            v-if="course.price > 0 && course.has_discount"
                                            :percent="course.discount_percentage"
                                            overlay
                                        />
                                        <div class="flex items-center gap-2">
                                            <span
                                                v-if="course.price > 0 && course.has_discount"
                                                class="text-xs font-medium line-through text-gray-400 dark:text-gray-500"
                                            >
                                                {{ Number(course.original_price || course.price).toLocaleString() }}
                                            </span>
                                            <div
                                                class="group relative inline-flex h-[calc(48px+8px)] shrink-0 items-center justify-center rounded-full bg-neutral-950 py-1 ps-6 pe-14 text-xl font-extrabold text-neutral-50 group-hover:text-black">
                                                <span class="z-10 pe-2 tracking-wider">
                                                    <template v-if="course.price > 0">{{ Number(course.current_price ?? course.price).toLocaleString() }}</template>
                                                    <template v-else>{{ $t('course.show.free') }}</template>
                                                </span>
                                                <div
                                                    class="absolute end-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-neutral-400/70 transition-[width] group-hover:w-[calc(100%-8px)]">
                                                    <div class="me-3.5 flex items-center justify-center">
                                                        <svg v-if="course.price > 0" class="rtl:mr-2 ltr:ml-2" width="15"
                                                            height="15" viewBox="0 0 25 27" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M2.52917 11.5828C3.03731 11.5828 3.48194 11.502 3.86304 11.3403C4.2557 11.1786 4.58484 10.9592 4.85046 10.682C5.11608 10.4048 5.31818 10.0815 5.45677 9.71193C5.59535 9.35392 5.67619 8.97281 5.69929 8.5686H3.96698C3.378 8.5686 2.89295 8.50509 2.51184 8.37805C2.13074 8.25101 1.83047 8.06623 1.61105 7.82371C1.39162 7.58119 1.23571 7.29247 1.14332 6.95756C1.06248 6.6111 1.02206 6.22422 1.02206 5.79691C1.02206 5.35806 1.08558 4.94231 1.21261 4.54965C1.33965 4.157 1.52443 3.81053 1.76695 3.51027C2.00948 3.21 2.30974 2.97325 2.66775 2.80002C3.03731 2.61524 3.45884 2.52285 3.93234 2.52285C4.31344 2.52285 4.67723 2.58637 5.02369 2.71341C5.37015 2.84044 5.67619 3.04254 5.94181 3.31971C6.20743 3.58533 6.41531 3.93757 6.56544 4.37642C6.72712 4.80372 6.80797 5.32342 6.80797 5.9355V7.37331H8.47098C8.60956 7.37331 8.70195 7.42528 8.74815 7.52922C8.80589 7.62161 8.83476 7.76597 8.83476 7.9623C8.83476 8.17017 8.80589 8.32608 8.74815 8.43002C8.70195 8.52241 8.60956 8.5686 8.47098 8.5686H6.77332C6.75022 9.13449 6.63474 9.67151 6.42686 10.1796C6.23053 10.6878 5.95336 11.1324 5.59535 11.5135C5.23734 11.8946 4.81004 12.1949 4.31344 12.4143C3.81685 12.6453 3.25674 12.7608 2.63311 12.7608H0.796861L0.692923 11.5828H2.52917ZM2.09609 5.72762C2.09609 6.01634 2.12496 6.26464 2.18271 6.47251C2.252 6.68039 2.36171 6.85362 2.51184 6.9922C2.67353 7.11924 2.88718 7.2174 3.1528 7.2867C3.41842 7.34444 3.75333 7.37331 4.15754 7.37331H5.71661V6.07408C5.71661 5.21948 5.54916 4.6074 5.21424 4.23784C4.87933 3.86828 4.41738 3.6835 3.8284 3.6835C3.27406 3.6835 2.84676 3.86828 2.54649 4.23784C2.24622 4.6074 2.09609 5.10399 2.09609 5.72762ZM11.3338 7.37331C11.4839 7.37331 11.582 7.42528 11.6282 7.52922C11.686 7.62161 11.7149 7.76597 11.7149 7.9623C11.7149 8.17017 11.686 8.32608 11.6282 8.43002C11.582 8.52241 11.4839 8.5686 11.3338 8.5686H8.47545C8.32531 8.5686 8.22715 8.52241 8.18095 8.43002C8.12321 8.33763 8.09434 8.19327 8.09434 7.99694C8.09434 7.78907 8.12321 7.63316 8.18095 7.52922C8.22715 7.42528 8.32531 7.37331 8.47545 7.37331H11.3338ZM14.1927 7.37331C14.3429 7.37331 14.441 7.42528 14.4872 7.52922C14.545 7.62161 14.5738 7.76597 14.5738 7.9623C14.5738 8.17017 14.545 8.32608 14.4872 8.43002C14.441 8.52241 14.3429 8.5686 14.1927 8.5686H11.3344C11.1843 8.5686 11.0861 8.52241 11.0399 8.43002C10.9822 8.33763 10.9533 8.19327 10.9533 7.99694C10.9533 7.78907 10.9822 7.63316 11.0399 7.52922C11.0861 7.42528 11.1843 7.37331 11.3344 7.37331H14.1927ZM17.0517 7.37331C17.2019 7.37331 17.3 7.42528 17.3462 7.52922C17.404 7.62161 17.4328 7.76597 17.4328 7.9623C17.4328 8.17017 17.404 8.32608 17.3462 8.43002C17.3 8.52241 17.2019 8.5686 17.0517 8.5686H14.1934C14.0433 8.5686 13.9451 8.52241 13.8989 8.43002C13.8412 8.33763 13.8123 8.19327 13.8123 7.99694C13.8123 7.78907 13.8412 7.63316 13.8989 7.52922C13.9451 7.42528 14.0433 7.37331 14.1934 7.37331H17.0517ZM19.9107 7.37331C20.0608 7.37331 20.159 7.42528 20.2052 7.52922C20.2629 7.62161 20.2918 7.76597 20.2918 7.9623C20.2918 8.17017 20.2629 8.32608 20.2052 8.43002C20.159 8.52241 20.0608 8.5686 19.9107 8.5686H17.0524C16.9023 8.5686 16.8041 8.52241 16.7579 8.43002C16.7002 8.33763 16.6713 8.19327 16.6713 7.99694C16.6713 7.78907 16.7002 7.63316 16.7579 7.52922C16.8041 7.42528 16.9023 7.37331 17.0524 7.37331H19.9107ZM21.4705 7.37331C21.9209 7.37331 22.2789 7.25205 22.5445 7.00953C22.8217 6.767 22.9602 6.43209 22.9602 6.00479V3.61421H24.0862V6.00479C24.0862 6.82475 23.8553 7.45993 23.3933 7.91033C22.9429 8.34918 22.3251 8.5686 21.5397 8.5686H19.9114C19.7612 8.5686 19.6631 8.52241 19.6169 8.43002C19.5591 8.33763 19.5303 8.19327 19.5303 7.99694C19.5303 7.78907 19.5591 7.63316 19.6169 7.52922C19.6631 7.42528 19.7612 7.37331 19.9114 7.37331H21.4705ZM24.2595 1.39685H22.8736V0.166916H24.2595V1.39685ZM22.0594 1.39685H20.6736V0.166916H22.0594V1.39685ZM10.2553 22.2221C10.2553 22.8458 10.1571 23.429 9.96076 23.9718C9.76444 24.5261 9.48149 25.0054 9.11193 25.4096C8.74237 25.8253 8.29197 26.1545 7.76073 26.397C7.24104 26.6395 6.65206 26.7608 5.99378 26.7608H4.97172C3.67826 26.7608 2.67353 26.3624 1.95751 25.5655C1.24149 24.7686 0.883476 23.6773 0.883476 22.2914V19.2599H1.99215V22.2568C1.99215 22.7534 2.0499 23.2038 2.16538 23.608C2.29242 24.0122 2.48297 24.3587 2.73704 24.6474C3.00267 24.9476 3.3318 25.1786 3.72446 25.3403C4.11712 25.502 4.59061 25.5828 5.14495 25.5828H5.90717C6.44996 25.5828 6.92345 25.4904 7.32766 25.3056C7.73186 25.1324 8.06678 24.8957 8.3324 24.5954C8.60956 24.2951 8.81167 23.9429 8.9387 23.5387C9.07729 23.1345 9.14658 22.713 9.14658 22.2741V17.6142H10.2553V22.2221ZM6.0804 17.2331H4.62526V15.9685H6.0804V17.2331ZM14.7322 22.5686C14.4319 22.5686 14.1432 22.5282 13.866 22.4473C13.5889 22.355 13.3406 22.2048 13.1211 21.9969C12.9133 21.7891 12.7458 21.5177 12.6188 21.1828C12.4917 20.8363 12.4282 20.409 12.4282 19.9009V11.8283H13.5542V19.693C13.5542 20.178 13.6582 20.5822 13.866 20.9056C14.0855 21.2174 14.4377 21.3733 14.9227 21.3733H15.2172C15.4713 21.3733 15.5983 21.5696 15.5983 21.9623C15.5983 22.3665 15.4713 22.5686 15.2172 22.5686H14.7322ZM15.5025 21.3733C15.9529 21.3733 16.2936 21.2636 16.5246 21.0442C16.7556 20.8247 16.871 20.5303 16.871 20.1607V19.5024C16.871 18.4977 17.1251 17.7124 17.6333 17.1465C18.1529 16.5806 18.869 16.2977 19.7813 16.2977C20.2548 16.2977 20.6706 16.3727 21.0286 16.5229C21.3866 16.673 21.6811 16.8866 21.9121 17.1638C22.1546 17.441 22.3336 17.7701 22.4491 18.1512C22.5646 18.5323 22.6223 18.9539 22.6223 19.4158C22.6223 20.409 22.3625 21.1828 21.8428 21.7371C21.3231 22.2914 20.6128 22.5686 19.712 22.5686C19.2501 22.5686 18.8055 22.482 18.3781 22.3088C17.9508 22.124 17.6159 21.8006 17.3734 21.3387C17.2695 21.6043 17.1424 21.8179 16.9923 21.9796C16.8422 22.1413 16.6863 22.2683 16.5246 22.3607C16.3629 22.4416 16.1897 22.4993 16.0049 22.534C15.8317 22.5571 15.6642 22.5686 15.5025 22.5686H15.2254C15.0752 22.5686 14.9771 22.5224 14.9309 22.43C14.8731 22.3376 14.8442 22.1933 14.8442 21.9969C14.8442 21.7891 14.8731 21.6332 14.9309 21.5292C14.9771 21.4253 15.0752 21.3733 15.2254 21.3733H15.5025ZM21.5136 19.5197C21.5136 18.9192 21.3808 18.4342 21.1152 18.0646C20.8496 17.6835 20.3934 17.4929 19.7467 17.4929C18.5456 17.4929 17.9451 18.1916 17.9451 19.589C17.9451 20.178 18.1068 20.6226 18.4301 20.9229C18.765 21.2232 19.1923 21.3733 19.712 21.3733C20.301 21.3733 20.7456 21.2116 21.0459 20.8883C21.3577 20.5649 21.5136 20.1087 21.5136 19.5197Z"
                                                                fill="currentColor"></path>
                                                        </svg>
                                                        <span v-else class="group-hover:-rotate-90 duration-200">:)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="w-full shrink-0 md:-mt-16 md:w-5/12 lg:w-5/12 h-52 lg:h-72 order-first md:order-last rounded-2xl md:rounded-[4rem] group-hover/outer:rounded-[3rem] transition-[border-radius] duration-500 overflow-hidden border-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/90">
                                <SeoImage
                                    :src="course.poster"
                                    :alt="course.title"
                                    :priority="true"
                                    :width="640"
                                    :height="360"
                                    sizes-preset="hero"
                                    img-class="w-full h-full object-cover transform transition duration-500 hover:scale-110"
                                />
                            </div>
                        </div>
                        <div
                            class="lg:group-hover/outer:mt-2 md:mx-8 px-3 md:px-5 bg-white dark:bg-gray-900 h-12 flex lg:max-h-0 lg:group-hover/outer:max-h-40 overflow-hidden items-center justify-between rounded-2xl md:rounded-[4rem] md:group-hover/outer:rounded-[3rem] transition-all duration-700">
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
                                                <path class="fill-current text-neutral-300 dark:text-neutral-500"
                                                    :class="{ 'text-red-600 dark:text-red-600': isLoggedin && userHasLiked }"
                                                    fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M7.60977 0C3.74605 0 0.511719 2.89525 0.511719 6.5867C0.511719 10.1217 2.52013 12.8603 4.7213 14.8002C6.92648 16.7437 9.42643 17.9791 10.6576 18.5217C11.3636 18.8328 12.1658 18.8328 12.8719 18.5217C14.103 17.9792 16.603 16.7437 18.8081 14.8003C21.0093 12.8604 23.0177 10.1218 23.0177 6.58685C23.0177 2.89543 19.7834 0 15.9197 0C14.3158 0 12.8825 0.676635 11.7647 1.47662C10.647 0.676635 9.21366 0 7.60977 0Z">
                                                </path>
                                            </svg>
                                        </div>
                                    </button>
                                </li>
                                <li class="group/comment flex items-center cursor-pointer">
                                    <button @click.prevent="scrollToSection('comments-list')" type="button"
                                        class="group relative inline-flex h-9 w-8 items-center justify-center overflow-hidden rounded-full bg-transparent font-medium text-black text-shadow-lg dark:text-neutral-200 transition-all duration-300 hover:w-32">
                                        <div
                                            class="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 ltr:group-hover:translate-x-3 group-hover:opacity-100 text-sm font-semibold">
                                            {{ $t('course.show.commentsCount', { count: commentsCount }) }}</div>
                                        <div class="absolute start-1.5">
                                            <svg class="rtl:ml-1 ltr:mr-1 w-5 h-5" viewBox="0 0 23 23" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    class="fill-current text-neutral-300 dark:text-neutral-500 group-hover/comment:text-yellow-400"
                                                    fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M11.6397 0C20.9066 0 22.8927 1.66715 22.8927 10.0027C22.8927 15.4208 21.9552 18.755 17.7353 18.755C15.4802 18.755 14.8094 19.8263 14.1847 20.8238C13.6405 21.6929 13.1313 22.506 11.6399 22.506C10.1487 22.506 9.63949 21.6929 9.09526 20.8238C8.47058 19.8263 7.79973 18.755 5.54457 18.755C1.3247 18.755 0.386719 15.3142 0.386719 10.0027C0.386719 1.76547 2.37287 0 11.6397 0ZM12.5775 7.502C12.5775 6.9841 12.9973 6.56425 13.5152 6.56425H16.3285C16.8464 6.56425 17.2662 6.9841 17.2662 7.502C17.2662 8.01991 16.8464 8.43975 16.3285 8.43975H13.5152C12.9973 8.43975 12.5775 8.01991 12.5775 7.502ZM6.95097 10.3153C6.43306 10.3153 6.01322 10.7351 6.01322 11.253C6.01322 11.7709 6.43306 12.1908 6.95097 12.1908H16.3285C16.8464 12.1908 17.2662 11.7709 17.2662 11.253C17.2662 10.7351 16.8464 10.3153 16.3285 10.3153H6.95097Z">
                                                </path>
                                            </svg>
                                        </div>
                                    </button>
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
                                <!-- <span class="text-gray-400 text-sm font-semibold rtl:ml-3 ltr:mr-3"> {{ $t("course.share") }}: </span> -->
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
                </div>

                <div v-else>
                    <div
                        class="group/outer rounded-2xl md:rounded-[4rem] md:hover:rounded-[3rem] transition-all duration-500 p-1 md:p-1.5 border-2 border-white dark:border-gray-600/80">
                        <div
                            class="mb-2 lg:mb-0 rounded-2xl md:rounded-[4rem] md:group-hover/outer:rounded-[3rem] transition-[border-radius] duration-500 p-1 md:p-2 bg-white dark:bg-gray-900 w-full flex flex-col md:flex-row items-stretch md:items-center justify-between">
                            <div
                                class="w-full md:w-7/12 lg:w-7/12 order-last md:order-first p-2 md:p-3 lg:ps-10 flex flex-col justify-between">
                                <div class="text-center md:text-start mt-3">
                                    <div
                                        class="animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-full dark:bg-gray-700 h-3 w-56 md:w-80 mb-9">
                                    </div>

                                    <div
                                        class="animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-full dark:bg-gray-700 h-1.5 w-[97%] ms-auto">
                                    </div>
                                    <div
                                        class="animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-full dark:bg-gray-700 h-1.5 w-full my-3">
                                    </div>
                                    <div
                                        class="animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-full dark:bg-gray-700 h-1.5 w-8/12">
                                    </div>
                                </div>
                                <div
                                    class="mt-4 flex flex-col md:flex-row md:items-center md:justify-between justify-center space-y-2">
                                    <div
                                        class="mx-auto md:mx-0 w-40 h-12 px-3 flex items-center justify-center rounded-xl bg-gray-300 dark:bg-gray-600">
                                        <div
                                            class="h-2 w-full animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-lg dark:bg-gray-700">
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            class="group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 py-1 ps-6 pe-14">
                                            <div
                                                class="animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-full dark:bg-gray-700 z-10 pe-2 w-16 h-3">
                                            </div>
                                            <div
                                                class="absolute end-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-neutral-400/70 transition-[width] group-hover:w-[calc(100%-8px)]">
                                                <div
                                                    class="me-3 w-6 h-6 animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-lg dark:bg-gray-700">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="w-full shrink-0 md:-mt-16 md:w-5/12 lg:w-5/12 h-52 lg:h-72 order-first md:order-last rounded-2xl md:rounded-[4rem] group-hover/outer:rounded-[3rem] transition-[border-radius] duration-500 overflow-hidden border-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/90">
                                <div
                                    class="animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 flex items-center justify-center w-full h-full bg-gray-300 rounded-xl dark:bg-gray-700">
                                    <svg class="w-10 h-10 text-gray-400 dark:text-gray-800" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path
                                            d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div
                            class="lg:group-hover/outer:mt-2 md:mx-8 px-3 md:px-5 bg-white dark:bg-gray-900 h-12 flex lg:max-h-0 lg:group-hover/outer:max-h-40 overflow-hidden items-center justify-between rounded-2xl md:rounded-[4rem] md:group-hover/outer:rounded-[3rem] transition-all duration-700">
                            <div class="flex items-center space-x-3 rtl:space-x-reverse">
                                <div
                                    class="w-8 h-8 animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-xl dark:bg-gray-700">
                                </div>
                                <div
                                    class="w-8 h-8 animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-xl dark:bg-gray-700">
                                </div>
                                <div
                                    class="w-8 h-8 animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-xl dark:bg-gray-700">
                                </div>
                            </div>
                            <div class="flex items-center">
                                <div class="flex items-center">
                                    <div
                                        class="w-8 h-8 animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-xl dark:bg-gray-700 me-3">
                                    </div>
                                    <div
                                        class="w-8 h-8 animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 rounded-xl dark:bg-gray-700">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="mt-16 md:mx-28 bg-yellow-100 dark:bg-yellow-400 dark:bg-opacity-20 dark:text-slate-200 text-slate-600 border border-dashed border-yellow-300 rounded-xl p-4 font-semibold flex items-center space-x-2 space-x-reverse mb-6">
                        <svg class="w-8 h-8 rtl:ml-2 ltr:mr-2" version="1.1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
                            <circle class="stroke-current text-yellow-500 text-opacity-30" cx="50" cy="50" r="20"
                                fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                                stroke-dasharray="200, 300"></circle>
                            <circle class="stroke-current text-yellow-500" cx="50" cy="50" r="20" fill="none"
                                stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                                stroke-dasharray="100, 200">
                                <animateTransform attributeName="transform" attributeType="XML" type="rotate"
                                    from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite">
                                </animateTransform>
                                <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s"
                                    repeatCount="indefinite"></animate>
                                <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s"
                                    repeatCount="indefinite"></animate>
                            </circle>
                        </svg>
                        <p>{{ $t('course.show.loadingFromServer') }}</p>
                    </div>
                </div>
            </section>
            <section v-if="course" class="mb-8">
                <div class="md:grid lg:grid-cols-12 gap-3 mb-20">
                    <div class="xl:col-span-9 lg:col-span-8">
                        <div v-if="course && trailerSource" class="block md:hidden mb-4 rounded-xl overflow-hidden">
                            <VideoPlayer :source="trailerSource"
                                :title="`${$t('course.show.trailer')} - ${course.title}`" :poster="course.poster"
                                :is-logged-in="false" :stream-video-id="course.trailer_video_id || null"
                                :initial-watched-times="[]" :initial-full-watched="false" :autoplay="false"
                                :controls-config="{
                                    title: true,
                                    restart: false,
                                    play: true,
                                    rewind: false,
                                    fastForward: false,
                                    times: true,
                                    mute: true,
                                    volume: true,
                                    settings: true,
                                    segments: false,
                                    fullscreen: true,
                                    overlaidPlay: true
                                }" />
                        </div>
                        <div ref="scrollSpy"
                            class="sticky top-0 z-10 overflow-hidden rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur border-b border-gray-200 dark:border-gray-700 mb-4">
                            <nav class="px-2 md:px-4 pt-2 pb-2.5">
                                <ul class="flex items-center gap-1 overflow-x-auto">
                                    <li v-for="item in scrollSpyItems" :key="item.id" class="shrink-0">
                                        <button
                                            :ref="(el) => setScrollSpyButtonRef(item.id, el)"
                                            @click.prevent="scrollToSection(item.id)"
                                            class="px-3 py-1.5 text-sm font-semibold transition-colors"
                                            :class="activeSectionId === item.id
                                                ? 'text-yellow-600 dark:text-yellow-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'">
                                            {{ $t(item.labelKey) }}
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                            <span
                                class="pointer-events-none absolute bottom-0 h-1 rounded-t-md bg-yellow-400 transition-[left,width] duration-300 ease-out"
                                :class="indicatorReady ? 'opacity-100' : 'opacity-0'"
                                :style="indicatorStyle"
                                aria-hidden="true"></span>
                        </div>
                        <div class="p-2 md:px-5 mb-8 bg-white dark:bg-gray-900 rounded-xl">
                            <h4
                                class="text-gray-900 dark:text-yellow-400 text-lg font-bold sm:text-right text-center flex sm:justify-start justify-center items-center mb-4">
                                <i
                                    class="bg-gray-900 dark:bg-yellow-400 rtl:ml-1 ltr:mr-1 w-2 h-2 rounded-full sm:flex hidden"></i>
                                {{ $t('course.show.description') }}
                            </h4>

                            <div v-if="!course" role="status" class="animate-pulse">
                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-2.5"></div>
                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                                <span class="sr-only">Loading...</span>
                            </div>

                            <div v-else>
                                <ExpandableDescription
                                    :source="course.description"
                                    @expanded-change="onDescExpandedChange"
                                />
                            </div>
                        </div>
                        <div v-if="course.has_money_back_guarantee !== false" id="guarantee"
                            class="bg-white dark:bg-gray-900 relative sm:pt-7 pt-48 rounded-xl sm:px-5 px-3 pb-8 mb-8">
                            <h4
                                class="text-gray-900 dark:text-yellow-400 text-lg font-bold rtl:sm:text-right ltr:sm:text-left flex sm:justify-start justify-center items-center mb-6">
                                <i
                                    class="bg-gray-900 dark:bg-yellow-400 rtl:ml-1 ltr:mr-1 w-2 h-2 rounded-full sm:flex hidden"></i>
                                {{ $t('course.show.moneyBackGuarantee') }}
                            </h4>

                            <div class="flex">
                                <svg class="rtl:mr-0 ltr:ml-0 sm:relative absolute sm:top-0 top-9 rtl:sm:right-0 ltr:sm:left-0 right-1/2 transform sm:translate-x-0 translate-x-1/2 flex-shrink-0 w-44 h-40 -mt-2"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 819.07045 584"
                                    xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <path
                                        d="M938.36645,683.35934c7.18382,12.69813,1.0921,55.58546,1.0921,55.58546s-39.89068-16.88557-47.07316-29.57842a26.41318,26.41318,0,0,1,45.98106-26.007Z"
                                        transform="translate(-190.46477 -158)" fill="#f1f1f1"></path>
                                    <path
                                        d="M940.037,738.8895l-.84744.17853c-8.16221-38.77834-36.66552-65.075-36.95246-65.33607l.58274-.64064C903.1088,673.35408,931.81545,699.82958,940.037,738.8895Z"
                                        transform="translate(-190.46477 -158)" fill="#fff"></path>
                                    <path
                                        d="M1003.63788,697.81816c-9.74789,17.68309-64.70648,41.63828-64.70648,41.63828s-9.06086-59.2631.68177-76.94077a36.55622,36.55622,0,1,1,64.02471,35.30249Z"
                                        transform="translate(-190.46477 -158)" fill="#f1f1f1"></path>
                                    <path
                                        d="M939.41646,740.09789l-.82555-.869c39.76932-37.7685,50.06448-90.44509,50.16385-90.97274l1.17793.2216C989.83286,649.009,979.47454,702.05508,939.41646,740.09789Z"
                                        transform="translate(-190.46477 -158)" fill="#fff"></path>
                                    <path
                                        d="M383.03037,563.91909a75.18955,75.18955,0,0,1-18.63955-2.41115l-1.19992-.332-1.11309-.55768c-40.242-20.17656-74.192-46.827-100.90712-79.21137a299.86458,299.86458,0,0,1-50.94916-90.47014,348.20978,348.20978,0,0,1-19.69086-122.66453c.017-.87611.03139-1.55256.03139-2.01861,0-20.28912,11.262-38.0913,28.69121-45.35357,13.33947-5.55813,134.45539-55.30526,143.20632-58.89963,16.48038-8.25772,34.062-1.36535,36.87554-.16006,6.31094,2.58025,118.2752,48.375,142.47062,59.89621,24.93578,11.87415,31.5889,33.20566,31.5889,43.93787,0,48.58822-8.415,93.99778-25.01129,134.9674a312.51684,312.51684,0,0,1-56.16213,90.51087c-45.84677,51.59381-91.7057,69.8841-92.14828,70.0453A50.11,50.11,0,0,1,383.03037,563.91909Zm-10.78453-26.71374c3.97586.89138,13.12949,2.22845,19.0957.052,7.57929-2.76408,45.96243-22.668,81.83036-63.03189,49.55709-55.769,74.70242-125.87542,74.73919-208.37177-.08852-1.67134-1.27542-13.59188-17.06153-21.10867C507.12331,233.44669,390.746,185.86014,389.5732,185.38052l-.32154-.13631c-2.43886-1.022-10.20055-3.1747-15.55082-.371l-1.07124.49943c-1.2972.53279-129.86317,53.33754-143.57481,59.05064-9.59168,3.99651-13.00917,13.89729-13.00917,21.83037,0,.57973-.015,1.423-.03619,2.51294C214.91358,325.21375,227.97577,464.11262,372.24584,537.20535Z"
                                        transform="translate(-190.46477 -158)" fill="#3f3d56"></path>
                                    <path
                                        d="M367.78865,173.58611S238.05415,226.86992,224.154,232.66164s-20.85019,19.69184-20.85019,33.592S192.87875,461.53177,367.78865,549.22768c0,0,15.87478,4.39241,27.91882,0s164.9454-78.52642,164.9454-283.55325c0,0,0-20.85018-24.32522-32.43362s-141.93358-59.6547-141.93358-59.6547S379.95125,167.21522,367.78865,173.58611Z"
                                        transform="translate(-190.46477 -158)" fill="#fed700"></path>
                                    <path d="M381.68877,215.28648V499.53673S250.79593,436.53013,251.95428,270.887Z"
                                        transform="translate(-190.46477 -158)" opacity="0.1"></path>
                                    <polygon
                                        points="192.931 261.581 151.235 207.969 175.483 189.11 195.226 214.494 261.921 144.088 284.224 165.219 192.931 261.581"
                                        fill="#fff"></polygon>
                                    <path d="M1008.53523,742h-381a1,1,0,0,1,0-2h381a1,1,0,0,1,0,2Z"
                                        transform="translate(-190.46477 -158)" fill="#cacaca"></path>
                                    <polygon
                                        points="547.206 568.237 562.671 568.236 570.029 508.583 547.203 508.584 547.206 568.237"
                                        fill="#ffb8b8"></polygon>
                                    <path
                                        d="M733.72532,721.18754l30.45762-.00123h.00123a19.411,19.411,0,0,1,19.41,19.40966v.63075l-49.86791.00185Z"
                                        transform="translate(-190.46477 -158)" fill="#2f2e41"></path>
                                    <polygon
                                        points="599.206 568.237 614.671 568.236 622.029 508.583 599.203 508.584 599.206 568.237"
                                        fill="#ffb8b8"></polygon>
                                    <path
                                        d="M785.72532,721.18754l30.45762-.00123h.00123a19.411,19.411,0,0,1,19.41,19.40966v.63075l-49.86791.00185Z"
                                        transform="translate(-190.46477 -158)" fill="#2f2e41"></path>
                                    <polygon
                                        points="571.514 358.75 575.224 548 545.213 546.139 524.393 425.597 517.817 343.408 571.514 358.75"
                                        fill="#2f2e41"></polygon>
                                    <path
                                        d="M813.48315,484.9709,817.68877,709l-35-1-7.56-133.17025-13.15012-48.21688-53.6962-25.20436,8.76674-60.27119,78.90049-1.09584Z"
                                        transform="translate(-190.46477 -158)" fill="#2f2e41"></path>
                                    <circle cx="562.67565" cy="99.59389" r="26.83826" fill="#ffb8b8"></circle>
                                    <polygon
                                        points="584.936 137.738 589.047 143.966 600.006 174.649 591.239 294.095 539.734 295.192 533.16 158.211 546.933 140.995 584.936 137.738"
                                        fill="#ccc"></polygon>
                                    <path
                                        d="M702.80325,319.499l-8.76674-1.09584s-2.19169,1.09584-3.2875,8.76671-14.24592,75.613-14.24592,75.613l17.53342,83.28385,19.7251-26.30016-12.05417-46.02526,12.05424-46.0253Z"
                                        transform="translate(-190.46477 -158)" fill="#2f2e41"></path>
                                    <polygon
                                        points="624.114 160.404 630.689 160.404 647.127 249.166 631.785 318.204 616.443 293 620.826 265.604 618.635 241.496 610.964 227.249 624.114 160.404"
                                        fill="#2f2e41"></polygon>
                                    <path
                                        d="M768.99945,257.59388l-4.87969-1.21993s-3.65974-20.73866-12.19924-18.29882-30.498,4.8797-30.498-4.87969,20.73867-18.29882,32.93783-17.0789,27.77947,5.267,31.71794,23.17848c6.31357,28.713-13.02638,35.96549-13.02638,35.96549l.32185-1.04544a16.28235,16.28235,0,0,0-4.37432-16.62119Z"
                                        transform="translate(-190.46477 -158)" fill="#2f2e41"></path>
                                    <path
                                        d="M695.13238,318.40319l35.06691-14.24592,8.2188-6.02712,24.65642,109.03608,11.5063-112.32365,45.47733,23.56058L804.7164,392.92027l-2.19168,28.49185,6.57505,23.01263s23.0126,16.43761,15.34174,33.971-16.43761,18.6293-16.43761,18.6293-37.25859-35.06688-39.45021-43.83362-5.47918-24.10847-5.47918-24.10847-18.6293,70.13377-40.546,69.0379-21.91679-24.10848-21.91679-24.10848l5.47918-24.10848,8.76674-25.20432-4.38337-41.64192Z"
                                        transform="translate(-190.46477 -158)" fill="#2f2e41"></path>
                                </svg>
                                <div class="rtl:mr-4 ltr:ml-4 flex flex-col sm:items-start items-center">
                                    <p
                                        class="font-medium text-gray-700 dark:text-gray-400 sm:leading-8 leading-6 rtl:sm:text-right ltr:sm:text-left text-center mb-3">
                                        {{ $t('course.show.guaranteeDescription') }}</p>
                                    <router-link
                                        :to="{ name: 'faq', query: { category: 'courses-and-learning', order: 6 } }"
                                        class="group items-center sm:mt-0 mt-3 sm:text-lg text-sm font-semibold inline-flex dark:text-yellow-400 dark:hover:text-white text-yellow-400 transition duration-200 transform hover:text-gray-900">
                                        {{ $t('course.show.guaranteeSteps') }}
                                        <svg class="rtl:mr-2 ltr:ml-2 ltr:rotate-180" width="18" height="15"
                                            viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="currentColor" opacity="0.4"
                                                d="M14.9442 6.2784L19.146 5.9068C20.089 5.9068 20.8535 6.67878 20.8535 7.63094C20.8535 8.5831 20.089 9.35508 19.146 9.35508L14.9442 8.98348C14.2044 8.98348 13.6047 8.3779 13.6047 7.63094C13.6047 6.88273 14.2044 6.2784 14.9442 6.2784">
                                            </path>
                                            <path fill="currentColor"
                                                d="M0.834251 6.3467C0.899925 6.28039 1.14527 6.00012 1.37575 5.7674C2.72019 4.30976 6.23061 1.92624 8.06699 1.1968C8.34579 1.08044 9.05085 0.832702 9.42878 0.815186C9.78936 0.815186 10.1338 0.899015 10.4622 1.06417C10.8724 1.29564 11.1995 1.66099 11.3804 2.0914C11.4956 2.38918 11.6765 3.28378 11.6765 3.30005C11.8562 4.27723 11.9541 5.86624 11.9541 7.62291C11.9541 9.2945 11.8562 10.8185 11.7088 11.8119C11.6926 11.8294 11.5117 12.9392 11.3147 13.3196C10.9541 14.0152 10.2491 14.4457 9.49445 14.4457H9.42878C8.93685 14.4294 7.90342 13.9977 7.90342 13.9827C6.16494 13.2533 2.73754 10.9849 1.35964 9.47718C1.35964 9.47718 0.970554 9.08931 0.802034 8.84783C0.539341 8.5 0.407995 8.06959 0.407995 7.63918C0.407995 7.15872 0.55545 6.71205 0.834251 6.3467">
                                            </path>
                                        </svg>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <div id="episodes-list" class="bg-white dark:bg-gray-900 relative rounded-xl md:p-5 p-3 mb-8">
                            <CourseAvailabilityBanner v-if="isCourseArchived && !userCanSeeCourse"
                                class="mb-5"
                                status-slug="archive"
                                :title="course?.status?.title || $t('course.show.archived')"
                                :message="courseAvailability?.message || $t('course.show.archivedMessage')" />
                            <CourseAvailabilityBanner
                                v-else-if="courseAvailability && !courseAvailability.can_watch_videos && courseAvailability.message"
                                class="mb-5"
                                :status-slug="courseStatusSlug() || 'presale'"
                                :title="course?.status?.title || ''"
                                :message="courseAvailability.message" />
                            <h4
                                class="text-gray-900 dark:text-yellow-400 text-lg font-bold rtl:sm:text-right ltr:sm:text-left flex sm:justify-start justify-center items-center mb-6">
                                <i
                                    class="bg-gray-900 dark:bg-yellow-400 rtl:ml-1 ltr:mr-1 w-2 h-2 rounded-full sm:flex hidden"></i>
                                {{ $t('course.show.courseEpisodes') }}
                            </h4>

                            <div v-if="course" class="">
                                <div v-if="!sortedCourseSections.length"
                                    class="flex flex-col items-center">
                                    <!-- add flex class -->
                                    <svg class="mx-auto" xmlns="http://www.w3.org/2000/svg" width="250" height="250"
                                        viewBox="0 0 972.57 830.55" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <path
                                            d="M379.55,64.39c29.21-26,75.06-31.33,116.79-29.26,131.09,6.51,249.43,69.8,351.79,141.39,37,25.91,73.53,53.84,97.59,89.53,49,72.65,34.44,173.29-33.65,233.13-23.16,20.37-51.25,36-80.07,49.81-51.26,24.61-106.57,44.36-164.75,50-41.49,4-83.49.75-124.73-4.84C427.28,578.5,314.17,543.94,219.37,484.82c-41.58-25.93-80.77-58.17-97.91-100.12s-6.17-95.12,36.29-119.95c17.56-10.27,38.55-14.9,59.11-19.26,30.25-6.41,61-12.73,88.3-25.76,28.2-13.46,61.59-39.5,56-69.29C355.18,118.47,350.37,90.39,379.55,64.39Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700" opacity="0.1"></path>
                                        <path
                                            d="M499.58,314.11V431.68a52.62,52.62,0,0,0,52.66,52.65h70.2A47.27,47.27,0,0,0,669.74,437V314.11a85.08,85.08,0,0,0-170.16,0Z"
                                            transform="translate(-113.71 -34.73)" fill="#65617d"></path>
                                        <path
                                            d="M499.58,314.11V431.68a52.62,52.62,0,0,0,52.66,52.65h70.2A47.27,47.27,0,0,0,669.74,437V314.11a85.08,85.08,0,0,0-170.16,0Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M502.11,315.37V429.45a51.06,51.06,0,0,0,51.09,51.08h68.12a45.86,45.86,0,0,0,45.89-45.88V315.37a82.55,82.55,0,0,0-165.1,0Z"
                                            transform="translate(-113.71 -34.73)" fill="#65617d"></path>
                                        <path
                                            d="M522.61,332.23v94.88a45.51,45.51,0,0,0,6.89,24.29c6.94,11,18.46,18.19,31.51,18.19h51.21c12.44,0,23.34-7.27,29.4-18.19a41,41,0,0,0,5.09-20V332.23c0-37.91-27.78-68.65-62.05-68.65-17.13,0-32.64,7.68-43.87,20.11A72.26,72.26,0,0,0,522.61,332.23Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <circle cx="580.45" cy="623.42" r="9.39" fill="#333f4f"></circle>
                                        <circle cx="563.65" cy="660.16" r="9.39" fill="#333f4f"></circle>
                                        <circle cx="396.12" cy="666.81" r="9.39" fill="#333f4f"></circle>
                                        <circle cx="358.69" cy="618.88" r="9.39" fill="#333f4f"></circle>
                                        <rect x="464.64" y="457.59" width="11.76" height="73.47" fill="#333f4f"></rect>
                                        <rect x="464.64" y="519.17" width="11.76" height="11.9" fill="#333f4f"
                                            opacity="0.1"></rect>
                                        <rect x="576.08" y="556.69" width="16.3" height="81.52"
                                            transform="translate(1054.75 1160.17) rotate(-180)" fill="#333f4f"></rect>
                                        <path
                                            d="M474.44,637.68l106.71-4.37v17.14H457.31A18.92,18.92,0,0,1,474.44,637.68Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f"></path>
                                        <path d="M687.87,637.68l-106.72-4.37v17.14H705A18.92,18.92,0,0,0,687.87,637.68Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f"></path>
                                        <path
                                            d="M592.39,635.06l85.19,42a21.56,21.56,0,0,1,12,19.35v1.27l-99.5-43.38-14-1-82.74,52.83h0a21.58,21.58,0,0,1,8.91-20.49l73.83-52.28Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f"></path>
                                        <path d="M578.36,492.32v7.92q3.07.12,6.29.12c1.85,0,3.67,0,5.46-.09v-7.95Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f" opacity="0.1"></path>
                                        <ellipse cx="470.94" cy="450.15" rx="43.39" ry="12.69" fill="#333f4f"></ellipse>
                                        <path
                                            d="M541.64,484.87a5.16,5.16,0,0,0,1.85,3.67,11.63,11.63,0,0,0,1.38,1.14c6.46,4.62,22,7.88,40.15,7.88s33.82-3.29,40.25-7.95a9.78,9.78,0,0,0,.92-.72,5.46,5.46,0,0,0,2.23-4c0-7-19.42-12.69-43.4-12.69S541.64,477.86,541.64,484.87Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f"></path>
                                        <path
                                            d="M541.64,484.87a5.16,5.16,0,0,0,1.85,3.67,11.63,11.63,0,0,0,1.38,1.14c6.46,4.62,22,7.88,40.15,7.88s33.82-3.29,40.25-7.95a9.78,9.78,0,0,0,.92-.72,5.46,5.46,0,0,0,2.23-4c0-7-19.42-12.69-43.4-12.69S541.64,477.86,541.64,484.87Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f" opacity="0.1"></path>
                                        <path
                                            d="M541.27,484.87a5.15,5.15,0,0,0,1.85,3.67c5.53-1.37,9.35-2.52,9.35-2.52s38.24,2.14,73.35,2.87a5.45,5.45,0,0,0,2.23-4c0-7-19.42-12.69-43.4-12.69S541.27,477.86,541.27,484.87Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f" opacity="0.1"></path>
                                        <path
                                            d="M511.27,458.65a51,51,0,0,0,41.93,21.88h68.12a45.85,45.85,0,0,0,39.12-21.88Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f" opacity="0.1"></path>
                                        <path
                                            d="M541.64,484.87a5.16,5.16,0,0,0,1.85,3.67,11.63,11.63,0,0,0,1.38,1.14,653.62,653.62,0,0,0,80.4-.07,9.78,9.78,0,0,0,.92-.72,5.46,5.46,0,0,0,2.23-4c0-7-19.42-12.69-43.4-12.69S541.64,477.86,541.64,484.87Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f" opacity="0.1"></path>
                                        <path
                                            d="M502.64,483.71a657.47,657.47,0,0,0,164.78,0A11.53,11.53,0,0,0,679,472.18h0a11.53,11.53,0,0,0-11.53-11.53H502.64a11.53,11.53,0,0,0-11.53,11.53h0A11.53,11.53,0,0,0,502.64,483.71Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f"></path>
                                        <path
                                            d="M654.51,609.29s11.37,11.64,19.13,12.75,14.14,26.06,3.33,28-31.61-5.82-34.66-9.15-14.14-23-14.14-23Z"
                                            transform="translate(-113.71 -34.73)" fill="#65617d"></path>
                                        <path
                                            d="M591.85,485.08s27.73,52.95,28.28,60.16S644.25,583,644.25,583L614.86,620.1s-3.88-9.43-10.53-12.76-5.27-10.81-5.27-10.81-6.93,0-11.92-8.32S576.05,571.58,576.05,568s-36.6-41.31-36.6-41.31l2.77-40.2,7.49-12.75Z"
                                            transform="translate(-113.71 -34.73)" fill="#3f3d56"></path>
                                        <path
                                            d="M663.94,488.13l.24.21c3.36,3,41.07,36.42,41.07,37.21s13.58,23.29-3.33,42.7-55.73,51.29-55.73,51.29-16.91,12.2-19.13,14.7-35.76,0-15.8-22.74,38.81-48.24,38.81-48.24-33.27-8-35.48-13.58,43.8-74.86,43.8-74.86Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M665.05,488.13l.24.21c3.36,3,41.07,36.42,41.07,37.21s13.58,23.29-3.33,42.7-55.73,51.29-55.73,51.29-16.91,12.2-19.13,14.7-35.77,0-15.8-22.74,38.81-48.24,38.81-48.24-33.27-8-35.49-13.58-46-73.48-46-73.48l89.83-1.38Z"
                                            transform="translate(-113.71 -34.73)" fill="#3f3d56"></path>
                                        <path
                                            d="M569.12,339l3.32,30.22s34.1,13.59,34.94,13.31,22.73-20,19.13-33c-1.81-6.53-2.64-15.59-3-23s-.31-13.05-.31-13.05-49.63-17.75-45.19-5.55c1.61,4.43.88,9.74-.7,14.7A68.46,68.46,0,0,1,569.12,339Z"
                                            transform="translate(-113.71 -34.73)" fill="#fbbebe"></path>
                                        <path
                                            d="M577.29,322.61c.3.35.61.68.92,1a33.25,33.25,0,0,0,45.28,2.88c-.38-7.34-.31-13.05-.31-13.05s-49.63-17.75-45.19-5.55C579.6,312.34,578.87,317.65,577.29,322.61Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M569.12,299.68a33.26,33.26,0,1,0,33.27-33.27A33.06,33.06,0,0,0,569.12,299.68Z"
                                            transform="translate(-113.71 -34.73)" fill="#fbbebe"></path>
                                        <path
                                            d="M610.15,370.34s13-28.88,17.47-28.88S639,490.85,639,490.85l-67.92,1.06-2.78-78.43L582.15,344S594.62,371.41,610.15,370.34Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M610.15,372.56s13-28.88,17.47-28.88S639,493.06,639,493.06l-77.07,1.17,6.37-78.53,13.87-69.53S594.62,373.63,610.15,372.56Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M610.15,371.45s13-28.88,17.47-28.88S639,492,639,492l-77.07,1.17,6.37-78.53,13.87-69.53S594.62,372.52,610.15,371.45Z"
                                            transform="translate(-113.71 -34.73)" fill="#65617d"></path>
                                        <path
                                            d="M622.79,333.5s2.33-3.41,5.66-2.3,5.82-1.94,9.15,1.11,16.63,7.21,19.13,5.82,11.36,4.72,13.31,8.32,8.31,13.31,8.31,13.31,5.55,6.65,4.72,10.26,1.94,7.76,5.26,9.42,10,18.3,10,18.3S696.52,420,704,423.87s1.94,20.8,1.94,20.8l-35.36-8.39-10-22.74s3.88,66.55,8.59,72.64,5.27,10,5.27,10-18.3,3.88-22.18,7.2-14.14-.83-14.14-.83l-10-88.44s-3.6-16.64-3.6-25.23S622.79,333.5,622.79,333.5Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M623.9,333.5s2.33-3.41,5.66-2.3,5.82-1.94,9.15,1.11,16.63,7.21,19.13,5.82,11.36,4.72,13.3,8.32,8.32,13.31,8.32,13.31,5.55,6.65,4.72,10.26,1.94,7.76,5.26,9.42,10,18.3,10,18.3-1.79,22.25,5.7,26.13c1.87,1,2.93,3.13,3.46,5.83,2.15,10.86-6.76,20.8-17.83,20.46l-19-7.88-10-28.74s3.88,66.55,8.59,72.64,5.27,10,5.27,10-18.3,3.88-22.18,7.2-14.14-.83-14.14-.83l-10-88.44s-3.6-16.64-3.6-25.23S623.9,333.5,623.9,333.5Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path d="M685,381.66s-3.33,9.15-12.48,8.32S685,381.66,685,381.66Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path d="M676.14,367.8s-6.1,1.11-8.32,6.37S676.14,367.8,676.14,367.8Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path d="M659,358.37c0,1.11-3.89,20.52,0,28.56s3.32,17.47,3.32,17.47Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M577.11,326.82s-2.17-2.55-4.39-2.27-3.6,1.66-6.38,2.77-9.42,1.39-9.42,2.22-5.83,4.16-9.71,5-16.08,9.15-19.13,25.23-8.32,20.79-8.32,20.79L549.15,395s-22.73,96.48-25.5,103.41-3,48-3,48,18,8,22.73,10.53,2.77-23.84,12.48-39.09,20.79-37.43,20.79-37.43L593.51,433s10.82-63.21,1.67-74.86S576.28,331,577.11,326.82Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M576,326.82s-2.17-2.55-4.39-2.27-3.6,1.66-6.38,2.77-9.42,1.39-9.42,2.22-5.82,4.16-9.71,5S530,343.68,527,359.76s-8.31,20.79-8.31,20.79L548,395s-22.73,96.48-25.5,103.41-3,48-3,48,18,8,22.73,10.53S545,533,554.7,517.79s20.79-37.43,20.79-37.43L592.4,433s10.82-63.21,1.67-74.86S575.17,331,576,326.82Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M515.88,448.2c.82.13,1.87.26,3.08.37,8.88.81,26.31,1,26.31,1s13-25.79,24.12-25c0,0-10.26-11.64-14.41-10.25-.7.23-1.14-.28-1.35-1.28-1.11-5,2.73-22,2.73-22l5.27-23-30.5,7.48c-2.77.56-11.37,5-11.37,5s-.27,11.92-2.49,14.7-4.71,16.08-4.44,19.4-3.05,18.86.28,23S509,447.09,515.88,448.2Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M629.83,629.8s1.67,9.15-.27,15-1.67,18.58-.28,23,6.1,10.53-6.65,13.3-21.35.28-21.91-1.94-3.32-11.09-1.11-16.08,3-18-1.11-25.51-1.38-19.13,2.5-20.51,10.54-4.44,10.54-4.44-7.21,13-.56,15.81S629.83,629.8,629.83,629.8Z"
                                            transform="translate(-113.71 -34.73)" fill="#65617d"></path>
                                        <path
                                            d="M569.12,299.68a33.06,33.06,0,0,0,9.09,22.84,1.19,1.19,0,0,0,.08-.16c1-2.11,1.93-4.3,1.85-6.61-.09-2.79-1.7-5.31-2.22-8.07-.65-3.48.49-7,1.61-10.38.82-2.46,2.41-5.45,5-5.15a5.76,5.76,0,0,0,1.53.18c1.37-.21,1.65-2,1.81-3.38a15.35,15.35,0,0,1,12.53-13.16,3.88,3.88,0,0,1,2.19.15c1,.43,1.49,1.47,2.36,2.07,2.81,1.95,6.39-1.78,9.81-1.49,2.91.24,4.68,3.21,5.88,5.87s2.69,5.69,5.54,6.31a1.75,1.75,0,0,0,1.35-.15c.88-.65.27-2-.18-3-1.17-2.64-.39-4.73,1-6.61a33.26,33.26,0,0,0-59.25,20.76Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M627.33,284.42c.45,1,1.07,2.38.17,3a1.68,1.68,0,0,1-1.34.15c-2.85-.61-4.35-3.65-5.55-6.31s-3-5.63-5.87-5.87c-3.42-.29-7,3.44-9.82,1.49-.86-.6-1.39-1.64-2.35-2.07a3.88,3.88,0,0,0-2.19-.14,15.35,15.35,0,0,0-12.54,13.15c-.14,1.37-.43,3.17-1.8,3.38a5.72,5.72,0,0,1-1.53-.18c-2.58-.3-4.16,2.68-5,5.14-1.12,3.37-2.26,6.91-1.61,10.39.52,2.76,2.13,5.28,2.22,8.08.07,2.3-.9,4.5-1.85,6.6s-2.52,4.56-4.8,4.26c-1.88-.24-2.91-2.23-3.81-3.9s-2.52-3.45-4.34-2.93c-.82.24-1.66.93-2.4.51a1.75,1.75,0,0,1-.7-1.21c-.89-3.87.39-8.23-1.5-11.73-1.45-2.69-4.39-4.15-6.78-6.06a19.42,19.42,0,0,1-2.63-27.8c2.56-3,6.24-5.64,6.45-9.57.15-3-1.87-5.75-1.89-8.75s1.85-5.52,4-7.51a25.83,25.83,0,0,1,23.22-6.12c2.15.52,4.31,1.32,6.5,1.05,2.55-.32,4.67-2,7-3.18a17.8,17.8,0,0,1,22.21,6c2.62,4.09,3.65,9.42,7.57,12.29,2.57,1.88,6.27,2.59,7.69,5.44.85,1.72.61,3.75.35,5.64a13.2,13.2,0,0,1-4.22,8.08C627.78,278.22,625.73,280.81,627.33,284.42Z"
                                            transform="translate(-113.71 -34.73)" fill="#512e4e"></path>
                                        <g opacity="0.1">
                                            <path
                                                d="M556.57,257.46a14.78,14.78,0,0,1-.59-2.31A14.5,14.5,0,0,1,556.57,257.46Z"
                                                transform="translate(-113.71 -34.73)"></path>
                                            <path
                                                d="M626.77,282a9,9,0,0,0-.55-1.48c-1.6-3.62.45-6.2,2.84-8.62a13.23,13.23,0,0,0,4.21-8.08,20,20,0,0,0,.24-2.56,5.49,5.49,0,0,1,.52.8c.85,1.72.61,3.75.35,5.64a13.2,13.2,0,0,1-4.22,8.08C628.34,277.65,626.72,279.59,626.77,282Z"
                                                transform="translate(-113.71 -34.73)"></path>
                                            <path
                                                d="M564.23,314.8c1.82-.53,3.44,1.27,4.34,2.93s1.93,3.66,3.81,3.9c2.28.29,3.85-2.17,4.8-4.26s1.93-4.3,1.85-6.6a7.77,7.77,0,0,0-.08-.83,15,15,0,0,1,1.19,4.71c.07,2.3-.9,4.5-1.85,6.6s-2.52,4.56-4.8,4.26c-1.88-.24-2.91-2.23-3.81-3.9s-2.52-3.45-4.34-2.93c-.82.24-1.66.93-2.4.51a1.75,1.75,0,0,1-.7-1.21,15.37,15.37,0,0,1-.33-2.64C562.63,315.66,563.45,315,564.23,314.8Z"
                                                transform="translate(-113.71 -34.73)"></path>
                                            <path
                                                d="M552.85,296.31c2.39,1.91,5.34,3.37,6.79,6.06a9.62,9.62,0,0,1,1,3.75c-1.47-2.6-4.35-4.05-6.7-5.93a19.59,19.59,0,0,1-7-11.85A19.46,19.46,0,0,0,552.85,296.31Z"
                                                transform="translate(-113.71 -34.73)"></path>
                                            <path
                                                d="M577.86,306.11a21.77,21.77,0,0,1-1.05-3.42c-.65-3.48.49-7,1.61-10.39.82-2.46,2.41-5.44,5-5.14a5.76,5.76,0,0,0,1.53.18c1.37-.21,1.66-2,1.8-3.39a15.37,15.37,0,0,1,12.54-13.14,3.79,3.79,0,0,1,2.19.14c1,.43,1.49,1.47,2.35,2.07,2.82,2,6.4-1.78,9.82-1.49,2.9.24,4.68,3.21,5.88,5.87s2.7,5.69,5.54,6.31a1.68,1.68,0,0,0,1.34-.15,1.08,1.08,0,0,0,.44-.83,6.55,6.55,0,0,0,.5,1.69c.45,1,1.07,2.38.17,3a1.68,1.68,0,0,1-1.34.15c-2.85-.61-4.35-3.65-5.55-6.31s-3-5.63-5.87-5.87c-3.42-.29-7,3.44-9.82,1.49-.86-.6-1.39-1.64-2.35-2.07a3.88,3.88,0,0,0-2.19-.14,15.35,15.35,0,0,0-12.54,13.15c-.14,1.37-.43,3.17-1.8,3.38a5.72,5.72,0,0,1-1.53-.18c-2.58-.3-4.16,2.68-5,5.14C578.46,299.4,577.39,302.78,577.86,306.11Z"
                                                transform="translate(-113.71 -34.73)"></path>
                                        </g>
                                        <path
                                            d="M519,448.57c8.88.81,26.31,1,26.31,1s13-25.79,24.12-25c0,0-10.26-11.64-14.41-10.25-.7.23-1.14-.28-1.35-1.28-10.86,3.32-31.56,11.43-33.59,25.67C519.5,442.59,519.15,445.83,519,448.57Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M517.85,448.57c8.88.81,26.31,1,26.31,1s13-25.79,24.12-25c0,0-10.25-11.64-14.41-10.25-.7.23-1.13-.28-1.35-1.28-10.86,3.32-31.56,11.43-33.59,25.67C518.39,442.59,518.05,445.83,517.85,448.57Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path d="M595.73,522.78s-25-6.1-28.83-2.77S595.73,522.78,595.73,522.78Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path d="M667.26,546.63s-10.53,6.1-11.64,11.09S667.26,546.63,667.26,546.63Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path d="M625.12,659s-14.42-2.22-18.11.18S625.12,659,625.12,659Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M481.07,852.54s55.88-3,69.5-11,32.9-8,33-8L806.07,785l92.5-22,16.5-2.17-54.5-62.36-1.66-.72L778.57,663s-36,2-43.11,25.46a28.15,28.15,0,0,0-1,5.06,29.33,29.33,0,0,0,5.68,20.53c2.84,3.89,6.33,9.39,7.43,14.25.62,2.74.48,5.27-1,7.2a58.69,58.69,0,0,1-9.88,7.89c-19.59,13-69.11,34.42-155.62,1.61,0,0-37-36.5-65-21S481.07,852.54,481.07,852.54Z"
                                            transform="translate(-113.71 -34.73)" fill="#e1dee5"></path>
                                        <path
                                            d="M747.53,728.34c.62,2.74.48,5.27-1,7.2a58.69,58.69,0,0,1-9.88,7.89L905.07,756l-46.16-58.25L778.57,663s-36,2-43.11,25.46a28.15,28.15,0,0,0-1,5.06,29.33,29.33,0,0,0,5.68,20.53C742.94,718,746.43,723.48,747.53,728.34Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <polygon
                                            points="798.36 464.31 660.36 467.31 660.36 632.5 791.36 721.31 822.86 692.31 816.36 596.31 822.86 506.81 798.36 464.31"
                                            fill="#65617d"></polygon>
                                        <path
                                            d="M990.57,472,829.45,422.39a24.2,24.2,0,0,0-9-1l-384.9,28.1a181.72,181.72,0,0,0-91.66,32.33c-24.91,17.57-49.58,44.54-61,85.37A163,163,0,0,0,284.62,659l33.95,110s-25.5-239,229-251Z"
                                            transform="translate(-113.71 -34.73)" fill="#d9d6df"></path>
                                        <path
                                            d="M740.1,714.09c2.84,3.89,6.33,9.39,7.43,14.25,4.36-5.05,5.3-10.75-1-15.3-7.89-5.74-10.52-15.7-11.11-24.54a28.15,28.15,0,0,0-1,5.06A29.33,29.33,0,0,0,740.1,714.09Z"
                                            transform="translate(-113.71 -34.73)" fill="#fff" opacity="0.1"></path>
                                        <path
                                            d="M336.07,741l19,64.5,43,42,54,11,84-15V545s-14.5-9.5-16-9.5-42,6.5-42,6.5l-91.7,65.77-3.8,2.73-41,61Z"
                                            transform="translate(-113.71 -34.73)" fill="#65617d"></path>
                                        <polygon
                                            points="422.36 497.81 422.36 808.81 414.26 810.26 414.26 497.81 422.36 497.81"
                                            fill="#65617d"></polygon>
                                        <polygon
                                            points="798.36 464.31 660.36 467.31 660.36 632.5 791.36 721.31 822.86 692.31 816.36 596.31 822.86 506.81 798.36 464.31"
                                            opacity="0.1"></polygon>
                                        <polygon
                                            points="422.36 497.81 422.36 808.81 414.26 810.26 414.26 497.81 422.36 497.81"
                                            opacity="0.1"></polygon>
                                        <path
                                            d="M384.57,628.54c60-49.3,126.7-56.55,151.5-57.45V545s-14.5-9.5-16-9.5-42,6.5-42,6.5l-91.7,65.77Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M1051.57,602s-6.19,16.36-12.83,35.41c-5.88,16.93-12.12,36-14.67,47.59-1,4.43-3.51,9-7.06,13.47-16.19,20.55-53.5,40.46-59.94,47.53-7.85,8.62-52,14.83-52,14.83V495.54l29.5-9.5h37.5l48.5,22,25,37Z"
                                            transform="translate(-113.71 -34.73)" fill="#65617d"></path>
                                        <path
                                            d="M537,446.82c1.94,2.36,60.86,2.91,63.91,2.22l5.54-1.25s28.44,15.31,48-9.74c.84-1.07,1.66-2.21,2.46-3.43,19.55-29.8-45.61-8-45.61-8s-24.95.14-31.33.14h-.66c-6.63-.27-19.85-4.29-19.85-4.29S535.07,444.47,537,446.82Z"
                                            transform="translate(-113.71 -34.73)" fill="#fbbebe"></path>
                                        <path
                                            d="M623,437.84s24.95.14,31.33.21h.15c.84-1.07,1.66-2.21,2.46-3.43,19.55-29.8-45.61-8-45.61-8s-24.95.14-31.33.14h-.66c-.63.82-1.25,1.68-1.86,2.59C557.59,458.89,623,437.84,623,437.84Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M674.78,440.58s-14.09-4.46-20.47-4.53-31.33-.2-31.33-.2-65.39,21-45.52-8.55,50.61-12.61,50.61-12.61l5.55-1.19c3.06-.66,62,.55,63.88,2.93S674.78,440.58,674.78,440.58Z"
                                            transform="translate(-113.71 -34.73)" fill="#fbbebe"></path>
                                        <path
                                            d="M704,423.87s-.4,19.23-13.73,20.33c-28,2.29-20.88-8.53-20.88-8.53l2.42-21.54L685,402.19s5.79,2.66,6.54,2.21S704,423.87,704,423.87Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M514.77,448.2c.82.13,1.87.26,3.08.37,8.88.81,26.31,1,26.31,1s13-25.79,24.12-25c0,0-10.25-11.64-14.41-10.25-.7.23-1.13-.28-1.35-1.28-1.1-5,2.73-22,2.73-22l5.27-23L530,375.56c-2.77.56-11.36,5-11.36,5s-.28,11.92-2.5,14.7-4.71,16.08-4.44,19.4-3.05,18.86.28,23S507.84,447.09,514.77,448.2Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path d="M546.1,387.76s-25.5,2.77-26.61,9.15S546.1,387.76,546.1,387.76Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M530.85,412.71c-1.66.56-11.36,3.05-13.3,8.88S530.85,412.71,530.85,412.71Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M519,449.6c8.88.81,26.31,1,26.31,1s13-25.79,24.12-25c0,0-10.26-11.64-14.41-10.25-.7.23-1.14-.28-1.35-1.28-10.86,3.32-31.56,11.43-33.59,25.67C519.5,443.62,519.15,446.86,519,449.6Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M712.58,351.32V462.25c0,1.91-1,2.18-2.69,3.11-5.62,3.12-19.49,8.67-36.13-.12-1.71-.9-2.76-1.21-2.76-3.14V352S692.15,360.56,712.58,351.32Z"
                                            transform="translate(-113.71 -34.73)" fill="#333f4f"></path>
                                        <ellipse cx="578.08" cy="316.52" rx="20.79" ry="4.42" fill="#2d394a"
                                            stroke="#40868e" stroke-miterlimit="10"></ellipse>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="362.66" r="0.47"></circle>
                                            <circle cx="594.61" cy="363.32" r="0.47"></circle>
                                            <circle cx="591.68" cy="364.25" r="0.47"></circle>
                                            <circle cx="586.43" cy="365.38" r="0.47"></circle>
                                            <circle cx="580.9" cy="366.05" r="0.47"></circle>
                                            <circle cx="575.18" cy="366.32" r="0.47"></circle>
                                            <circle cx="566.95" cy="365.19" r="0.47"></circle>
                                            <circle cx="569.68" cy="365.85" r="0.47"></circle>
                                            <circle cx="561.87" cy="364.25" r="0.47"></circle>
                                            <circle cx="564.32" cy="364.72" r="0.47"></circle>
                                            <circle cx="559.18" cy="363.32" r="0.47"></circle>
                                            <circle cx="589" cy="364.92" r="0.47"></circle>
                                            <circle cx="583.59" cy="365.85" r="0.47"></circle>
                                            <circle cx="577.72" cy="366.32" r="0.47"></circle>
                                            <circle cx="572.37" cy="366.32" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="364.95" r="0.47"></circle>
                                            <circle cx="594.61" cy="365.62" r="0.47"></circle>
                                            <circle cx="591.68" cy="366.55" r="0.47"></circle>
                                            <circle cx="586.43" cy="367.68" r="0.47"></circle>
                                            <circle cx="580.9" cy="368.35" r="0.47"></circle>
                                            <circle cx="575.18" cy="368.61" r="0.47"></circle>
                                            <circle cx="566.95" cy="367.48" r="0.47"></circle>
                                            <circle cx="569.68" cy="368.15" r="0.47"></circle>
                                            <circle cx="561.87" cy="366.55" r="0.47"></circle>
                                            <circle cx="564.32" cy="367.02" r="0.47"></circle>
                                            <circle cx="559.18" cy="365.62" r="0.47"></circle>
                                            <circle cx="589" cy="367.21" r="0.47"></circle>
                                            <circle cx="583.59" cy="368.15" r="0.47"></circle>
                                            <circle cx="577.72" cy="368.61" r="0.47"></circle>
                                            <circle cx="572.37" cy="368.61" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="367.25" r="0.47"></circle>
                                            <circle cx="594.61" cy="367.91" r="0.47"></circle>
                                            <circle cx="591.68" cy="368.84" r="0.47"></circle>
                                            <circle cx="586.43" cy="369.97" r="0.47"></circle>
                                            <circle cx="580.9" cy="370.64" r="0.47"></circle>
                                            <circle cx="575.18" cy="370.91" r="0.47"></circle>
                                            <circle cx="566.95" cy="369.78" r="0.47"></circle>
                                            <circle cx="569.68" cy="370.44" r="0.47"></circle>
                                            <circle cx="561.87" cy="368.84" r="0.47"></circle>
                                            <circle cx="564.32" cy="369.31" r="0.47"></circle>
                                            <circle cx="559.18" cy="367.91" r="0.47"></circle>
                                            <circle cx="589" cy="369.51" r="0.47"></circle>
                                            <circle cx="583.59" cy="370.44" r="0.47"></circle>
                                            <circle cx="577.72" cy="370.91" r="0.47"></circle>
                                            <circle cx="572.37" cy="370.91" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="369.55" r="0.47"></circle>
                                            <circle cx="594.61" cy="370.21" r="0.47"></circle>
                                            <circle cx="591.68" cy="371.14" r="0.47"></circle>
                                            <circle cx="586.43" cy="372.27" r="0.47"></circle>
                                            <circle cx="580.9" cy="372.94" r="0.47"></circle>
                                            <circle cx="575.18" cy="373.2" r="0.47"></circle>
                                            <circle cx="566.95" cy="372.07" r="0.47"></circle>
                                            <circle cx="569.68" cy="372.74" r="0.47"></circle>
                                            <circle cx="561.87" cy="371.14" r="0.47"></circle>
                                            <circle cx="564.32" cy="371.61" r="0.47"></circle>
                                            <circle cx="559.18" cy="370.21" r="0.47"></circle>
                                            <circle cx="589" cy="371.8" r="0.47"></circle>
                                            <circle cx="583.59" cy="372.74" r="0.47"></circle>
                                            <circle cx="577.72" cy="373.2" r="0.47"></circle>
                                            <circle cx="572.37" cy="373.2" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="371.84" r="0.47"></circle>
                                            <circle cx="594.61" cy="372.5" r="0.47"></circle>
                                            <circle cx="591.68" cy="373.44" r="0.47"></circle>
                                            <circle cx="586.43" cy="374.57" r="0.47"></circle>
                                            <circle cx="580.9" cy="375.24" r="0.47"></circle>
                                            <circle cx="575.18" cy="375.5" r="0.47"></circle>
                                            <circle cx="566.95" cy="374.37" r="0.47"></circle>
                                            <circle cx="569.68" cy="375.03" r="0.47"></circle>
                                            <circle cx="561.87" cy="373.44" r="0.47"></circle>
                                            <circle cx="564.32" cy="373.9" r="0.47"></circle>
                                            <circle cx="559.18" cy="372.5" r="0.47"></circle>
                                            <circle cx="589" cy="374.1" r="0.47"></circle>
                                            <circle cx="583.59" cy="375.03" r="0.47"></circle>
                                            <circle cx="577.72" cy="375.5" r="0.47"></circle>
                                            <circle cx="572.37" cy="375.5" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="374.14" r="0.47"></circle>
                                            <circle cx="594.61" cy="374.8" r="0.47"></circle>
                                            <circle cx="591.68" cy="375.73" r="0.47"></circle>
                                            <circle cx="586.43" cy="376.86" r="0.47"></circle>
                                            <circle cx="580.9" cy="377.53" r="0.47"></circle>
                                            <circle cx="575.18" cy="377.79" r="0.47"></circle>
                                            <circle cx="566.95" cy="376.66" r="0.47"></circle>
                                            <circle cx="569.68" cy="377.33" r="0.47"></circle>
                                            <circle cx="561.87" cy="375.73" r="0.47"></circle>
                                            <circle cx="564.32" cy="376.2" r="0.47"></circle>
                                            <circle cx="559.18" cy="374.8" r="0.47"></circle>
                                            <circle cx="589" cy="376.39" r="0.47"></circle>
                                            <circle cx="583.59" cy="377.33" r="0.47"></circle>
                                            <circle cx="577.72" cy="377.79" r="0.47"></circle>
                                            <circle cx="572.37" cy="377.79" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="376.43" r="0.47"></circle>
                                            <circle cx="594.61" cy="377.09" r="0.47"></circle>
                                            <circle cx="591.68" cy="378.03" r="0.47"></circle>
                                            <circle cx="586.43" cy="379.16" r="0.47"></circle>
                                            <circle cx="580.9" cy="379.83" r="0.47"></circle>
                                            <circle cx="575.18" cy="380.09" r="0.47"></circle>
                                            <circle cx="566.95" cy="378.96" r="0.47"></circle>
                                            <circle cx="569.68" cy="379.62" r="0.47"></circle>
                                            <circle cx="561.87" cy="378.03" r="0.47"></circle>
                                            <circle cx="564.32" cy="378.49" r="0.47"></circle>
                                            <circle cx="559.18" cy="377.09" r="0.47"></circle>
                                            <circle cx="589" cy="378.69" r="0.47"></circle>
                                            <circle cx="583.59" cy="379.62" r="0.47"></circle>
                                            <circle cx="577.72" cy="380.09" r="0.47"></circle>
                                            <circle cx="572.37" cy="380.09" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="378.73" r="0.47"></circle>
                                            <circle cx="594.61" cy="379.39" r="0.47"></circle>
                                            <circle cx="591.68" cy="380.32" r="0.47"></circle>
                                            <circle cx="586.43" cy="381.45" r="0.47"></circle>
                                            <circle cx="580.9" cy="382.12" r="0.47"></circle>
                                            <circle cx="575.18" cy="382.39" r="0.47"></circle>
                                            <circle cx="566.95" cy="381.26" r="0.47"></circle>
                                            <circle cx="569.68" cy="381.92" r="0.47"></circle>
                                            <circle cx="561.87" cy="380.32" r="0.47"></circle>
                                            <circle cx="564.32" cy="380.79" r="0.47"></circle>
                                            <circle cx="559.18" cy="379.39" r="0.47"></circle>
                                            <circle cx="589" cy="380.99" r="0.47"></circle>
                                            <circle cx="583.59" cy="381.92" r="0.47"></circle>
                                            <circle cx="577.72" cy="382.39" r="0.47"></circle>
                                            <circle cx="572.37" cy="382.39" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="381.02" r="0.47"></circle>
                                            <circle cx="594.61" cy="381.68" r="0.47"></circle>
                                            <circle cx="591.68" cy="382.62" r="0.47"></circle>
                                            <circle cx="586.43" cy="383.75" r="0.47"></circle>
                                            <circle cx="580.9" cy="384.42" r="0.47"></circle>
                                            <circle cx="575.18" cy="384.68" r="0.47"></circle>
                                            <circle cx="566.95" cy="383.55" r="0.47"></circle>
                                            <circle cx="569.68" cy="384.21" r="0.47"></circle>
                                            <circle cx="561.87" cy="382.62" r="0.47"></circle>
                                            <circle cx="564.32" cy="383.08" r="0.47"></circle>
                                            <circle cx="559.18" cy="381.68" r="0.47"></circle>
                                            <circle cx="589" cy="383.28" r="0.47"></circle>
                                            <circle cx="583.59" cy="384.21" r="0.47"></circle>
                                            <circle cx="577.72" cy="384.68" r="0.47"></circle>
                                            <circle cx="572.37" cy="384.68" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="383.32" r="0.47"></circle>
                                            <circle cx="594.61" cy="383.98" r="0.47"></circle>
                                            <circle cx="591.68" cy="384.91" r="0.47"></circle>
                                            <circle cx="586.43" cy="386.04" r="0.47"></circle>
                                            <circle cx="580.9" cy="386.71" r="0.47"></circle>
                                            <circle cx="575.18" cy="386.98" r="0.47"></circle>
                                            <circle cx="566.95" cy="385.85" r="0.47"></circle>
                                            <circle cx="569.68" cy="386.51" r="0.47"></circle>
                                            <circle cx="561.87" cy="384.91" r="0.47"></circle>
                                            <circle cx="564.32" cy="385.38" r="0.47"></circle>
                                            <circle cx="559.18" cy="383.98" r="0.47"></circle>
                                            <circle cx="589" cy="385.58" r="0.47"></circle>
                                            <circle cx="583.59" cy="386.51" r="0.47"></circle>
                                            <circle cx="577.72" cy="386.98" r="0.47"></circle>
                                            <circle cx="572.37" cy="386.98" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="385.61" r="0.47"></circle>
                                            <circle cx="594.61" cy="386.28" r="0.47"></circle>
                                            <circle cx="591.68" cy="387.21" r="0.47"></circle>
                                            <circle cx="586.43" cy="388.34" r="0.47"></circle>
                                            <circle cx="580.9" cy="389.01" r="0.47"></circle>
                                            <circle cx="575.18" cy="389.27" r="0.47"></circle>
                                            <circle cx="566.95" cy="388.14" r="0.47"></circle>
                                            <circle cx="569.68" cy="388.81" r="0.47"></circle>
                                            <circle cx="561.87" cy="387.21" r="0.47"></circle>
                                            <circle cx="564.32" cy="387.68" r="0.47"></circle>
                                            <circle cx="559.18" cy="386.28" r="0.47"></circle>
                                            <circle cx="589" cy="387.87" r="0.47"></circle>
                                            <circle cx="583.59" cy="388.81" r="0.47"></circle>
                                            <circle cx="577.72" cy="389.27" r="0.47"></circle>
                                            <circle cx="572.37" cy="389.27" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="387.91" r="0.47"></circle>
                                            <circle cx="594.61" cy="388.57" r="0.47"></circle>
                                            <circle cx="591.68" cy="389.5" r="0.47"></circle>
                                            <circle cx="586.43" cy="390.63" r="0.47"></circle>
                                            <circle cx="580.9" cy="391.3" r="0.47"></circle>
                                            <circle cx="575.18" cy="391.57" r="0.47"></circle>
                                            <circle cx="566.95" cy="390.44" r="0.47"></circle>
                                            <circle cx="569.68" cy="391.1" r="0.47"></circle>
                                            <circle cx="561.87" cy="389.5" r="0.47"></circle>
                                            <circle cx="564.32" cy="389.97" r="0.47"></circle>
                                            <circle cx="559.18" cy="388.57" r="0.47"></circle>
                                            <circle cx="589" cy="390.17" r="0.47"></circle>
                                            <circle cx="583.59" cy="391.1" r="0.47"></circle>
                                            <circle cx="577.72" cy="391.57" r="0.47"></circle>
                                            <circle cx="572.37" cy="391.57" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="390.21" r="0.47"></circle>
                                            <circle cx="594.61" cy="390.87" r="0.47"></circle>
                                            <circle cx="591.68" cy="391.8" r="0.47"></circle>
                                            <circle cx="586.43" cy="392.93" r="0.47"></circle>
                                            <circle cx="580.9" cy="393.6" r="0.47"></circle>
                                            <circle cx="575.18" cy="393.86" r="0.47"></circle>
                                            <circle cx="566.95" cy="392.73" r="0.47"></circle>
                                            <circle cx="569.68" cy="393.4" r="0.47"></circle>
                                            <circle cx="561.87" cy="391.8" r="0.47"></circle>
                                            <circle cx="564.32" cy="392.27" r="0.47"></circle>
                                            <circle cx="559.18" cy="390.87" r="0.47"></circle>
                                            <circle cx="589" cy="392.46" r="0.47"></circle>
                                            <circle cx="583.59" cy="393.4" r="0.47"></circle>
                                            <circle cx="577.72" cy="393.86" r="0.47"></circle>
                                            <circle cx="572.37" cy="393.86" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="392.5" r="0.47"></circle>
                                            <circle cx="594.61" cy="393.16" r="0.47"></circle>
                                            <circle cx="591.68" cy="394.1" r="0.47"></circle>
                                            <circle cx="586.43" cy="395.23" r="0.47"></circle>
                                            <circle cx="580.9" cy="395.9" r="0.47"></circle>
                                            <circle cx="575.18" cy="396.16" r="0.47"></circle>
                                            <circle cx="566.95" cy="395.03" r="0.47"></circle>
                                            <circle cx="569.68" cy="395.69" r="0.47"></circle>
                                            <circle cx="561.87" cy="394.1" r="0.47"></circle>
                                            <circle cx="564.32" cy="394.56" r="0.47"></circle>
                                            <circle cx="559.18" cy="393.16" r="0.47"></circle>
                                            <circle cx="589" cy="394.76" r="0.47"></circle>
                                            <circle cx="583.59" cy="395.69" r="0.47"></circle>
                                            <circle cx="577.72" cy="396.16" r="0.47"></circle>
                                            <circle cx="572.37" cy="396.16" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="394.8" r="0.47"></circle>
                                            <circle cx="594.61" cy="395.46" r="0.47"></circle>
                                            <circle cx="591.68" cy="396.39" r="0.47"></circle>
                                            <circle cx="586.43" cy="397.52" r="0.47"></circle>
                                            <circle cx="580.9" cy="398.19" r="0.47"></circle>
                                            <circle cx="575.18" cy="398.45" r="0.47"></circle>
                                            <circle cx="566.95" cy="397.32" r="0.47"></circle>
                                            <circle cx="569.68" cy="397.99" r="0.47"></circle>
                                            <circle cx="561.87" cy="396.39" r="0.47"></circle>
                                            <circle cx="564.32" cy="396.86" r="0.47"></circle>
                                            <circle cx="559.18" cy="395.46" r="0.47"></circle>
                                            <circle cx="589" cy="397.05" r="0.47"></circle>
                                            <circle cx="583.59" cy="397.99" r="0.47"></circle>
                                            <circle cx="577.72" cy="398.45" r="0.47"></circle>
                                            <circle cx="572.37" cy="398.45" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="397.09" r="0.47"></circle>
                                            <circle cx="594.61" cy="397.75" r="0.47"></circle>
                                            <circle cx="591.68" cy="398.69" r="0.47"></circle>
                                            <circle cx="586.43" cy="399.82" r="0.47"></circle>
                                            <circle cx="580.9" cy="400.49" r="0.47"></circle>
                                            <circle cx="575.18" cy="400.75" r="0.47"></circle>
                                            <circle cx="566.95" cy="399.62" r="0.47"></circle>
                                            <circle cx="569.68" cy="400.28" r="0.47"></circle>
                                            <circle cx="561.87" cy="398.69" r="0.47"></circle>
                                            <circle cx="564.32" cy="399.15" r="0.47"></circle>
                                            <circle cx="559.18" cy="397.75" r="0.47"></circle>
                                            <circle cx="589" cy="399.35" r="0.47"></circle>
                                            <circle cx="583.59" cy="400.28" r="0.47"></circle>
                                            <circle cx="577.72" cy="400.75" r="0.47"></circle>
                                            <circle cx="572.37" cy="400.75" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="399.39" r="0.47"></circle>
                                            <circle cx="594.61" cy="400.05" r="0.47"></circle>
                                            <circle cx="591.68" cy="400.98" r="0.47"></circle>
                                            <circle cx="586.43" cy="402.11" r="0.47"></circle>
                                            <circle cx="580.9" cy="402.78" r="0.47"></circle>
                                            <circle cx="575.18" cy="403.05" r="0.47"></circle>
                                            <circle cx="566.95" cy="401.92" r="0.47"></circle>
                                            <circle cx="569.68" cy="402.58" r="0.47"></circle>
                                            <circle cx="561.87" cy="400.98" r="0.47"></circle>
                                            <circle cx="564.32" cy="401.45" r="0.47"></circle>
                                            <circle cx="559.18" cy="400.05" r="0.47"></circle>
                                            <circle cx="589" cy="401.65" r="0.47"></circle>
                                            <circle cx="583.59" cy="402.58" r="0.47"></circle>
                                            <circle cx="577.72" cy="403.05" r="0.47"></circle>
                                            <circle cx="572.37" cy="403.05" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="401.68" r="0.47"></circle>
                                            <circle cx="594.61" cy="402.34" r="0.47"></circle>
                                            <circle cx="591.68" cy="403.28" r="0.47"></circle>
                                            <circle cx="586.43" cy="404.41" r="0.47"></circle>
                                            <circle cx="580.9" cy="405.08" r="0.47"></circle>
                                            <circle cx="575.18" cy="405.34" r="0.47"></circle>
                                            <circle cx="566.95" cy="404.21" r="0.47"></circle>
                                            <circle cx="569.68" cy="404.87" r="0.47"></circle>
                                            <circle cx="561.87" cy="403.28" r="0.47"></circle>
                                            <circle cx="564.32" cy="403.74" r="0.47"></circle>
                                            <circle cx="559.18" cy="402.34" r="0.47"></circle>
                                            <circle cx="589" cy="403.94" r="0.47"></circle>
                                            <circle cx="583.59" cy="404.87" r="0.47"></circle>
                                            <circle cx="577.72" cy="405.34" r="0.47"></circle>
                                            <circle cx="572.37" cy="405.34" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="403.98" r="0.47"></circle>
                                            <circle cx="594.61" cy="404.64" r="0.47"></circle>
                                            <circle cx="591.68" cy="405.57" r="0.47"></circle>
                                            <circle cx="586.43" cy="406.7" r="0.47"></circle>
                                            <circle cx="580.9" cy="407.37" r="0.47"></circle>
                                            <circle cx="575.18" cy="407.64" r="0.47"></circle>
                                            <circle cx="566.95" cy="406.51" r="0.47"></circle>
                                            <circle cx="569.68" cy="407.17" r="0.47"></circle>
                                            <circle cx="561.87" cy="405.57" r="0.47"></circle>
                                            <circle cx="564.32" cy="406.04" r="0.47"></circle>
                                            <circle cx="559.18" cy="404.64" r="0.47"></circle>
                                            <circle cx="589" cy="406.24" r="0.47"></circle>
                                            <circle cx="583.59" cy="407.17" r="0.47"></circle>
                                            <circle cx="577.72" cy="407.64" r="0.47"></circle>
                                            <circle cx="572.37" cy="407.64" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="406.27" r="0.47"></circle>
                                            <circle cx="594.61" cy="406.94" r="0.47"></circle>
                                            <circle cx="591.68" cy="407.87" r="0.47"></circle>
                                            <circle cx="586.43" cy="409" r="0.47"></circle>
                                            <circle cx="580.9" cy="409.67" r="0.47"></circle>
                                            <circle cx="575.18" cy="409.93" r="0.47"></circle>
                                            <circle cx="566.95" cy="408.8" r="0.47"></circle>
                                            <circle cx="569.68" cy="409.47" r="0.47"></circle>
                                            <circle cx="561.87" cy="407.87" r="0.47"></circle>
                                            <circle cx="564.32" cy="408.34" r="0.47"></circle>
                                            <circle cx="559.18" cy="406.94" r="0.47"></circle>
                                            <circle cx="589" cy="408.53" r="0.47"></circle>
                                            <circle cx="583.59" cy="409.47" r="0.47"></circle>
                                            <circle cx="577.72" cy="409.93" r="0.47"></circle>
                                            <circle cx="572.37" cy="409.93" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="408.57" r="0.47"></circle>
                                            <circle cx="594.61" cy="409.23" r="0.47"></circle>
                                            <circle cx="591.68" cy="410.16" r="0.47"></circle>
                                            <circle cx="586.43" cy="411.29" r="0.47"></circle>
                                            <circle cx="580.9" cy="411.96" r="0.47"></circle>
                                            <circle cx="575.18" cy="412.23" r="0.47"></circle>
                                            <circle cx="566.95" cy="411.1" r="0.47"></circle>
                                            <circle cx="569.68" cy="411.76" r="0.47"></circle>
                                            <circle cx="561.87" cy="410.16" r="0.47"></circle>
                                            <circle cx="564.32" cy="410.63" r="0.47"></circle>
                                            <circle cx="559.18" cy="409.23" r="0.47"></circle>
                                            <circle cx="589" cy="410.83" r="0.47"></circle>
                                            <circle cx="583.59" cy="411.76" r="0.47"></circle>
                                            <circle cx="577.72" cy="412.23" r="0.47"></circle>
                                            <circle cx="572.37" cy="412.23" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="410.86" r="0.47"></circle>
                                            <circle cx="594.61" cy="411.53" r="0.47"></circle>
                                            <circle cx="591.68" cy="412.46" r="0.47"></circle>
                                            <circle cx="586.43" cy="413.59" r="0.47"></circle>
                                            <circle cx="580.9" cy="414.26" r="0.47"></circle>
                                            <circle cx="575.18" cy="414.52" r="0.47"></circle>
                                            <circle cx="566.95" cy="413.39" r="0.47"></circle>
                                            <circle cx="569.68" cy="414.06" r="0.47"></circle>
                                            <circle cx="561.87" cy="412.46" r="0.47"></circle>
                                            <circle cx="564.32" cy="412.93" r="0.47"></circle>
                                            <circle cx="559.18" cy="411.53" r="0.47"></circle>
                                            <circle cx="589" cy="413.12" r="0.47"></circle>
                                            <circle cx="583.59" cy="414.06" r="0.47"></circle>
                                            <circle cx="577.72" cy="414.52" r="0.47"></circle>
                                            <circle cx="572.37" cy="414.52" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="413.16" r="0.47"></circle>
                                            <circle cx="594.61" cy="413.82" r="0.47"></circle>
                                            <circle cx="591.68" cy="414.76" r="0.47"></circle>
                                            <circle cx="586.43" cy="415.89" r="0.47"></circle>
                                            <circle cx="580.9" cy="416.56" r="0.47"></circle>
                                            <circle cx="575.18" cy="416.82" r="0.47"></circle>
                                            <circle cx="566.95" cy="415.69" r="0.47"></circle>
                                            <circle cx="569.68" cy="416.35" r="0.47"></circle>
                                            <circle cx="561.87" cy="414.76" r="0.47"></circle>
                                            <circle cx="564.32" cy="415.22" r="0.47"></circle>
                                            <circle cx="559.18" cy="413.82" r="0.47"></circle>
                                            <circle cx="589" cy="415.42" r="0.47"></circle>
                                            <circle cx="583.59" cy="416.35" r="0.47"></circle>
                                            <circle cx="577.72" cy="416.82" r="0.47"></circle>
                                            <circle cx="572.37" cy="416.82" r="0.47"></circle>
                                        </g>
                                        <g opacity="0.8">
                                            <circle cx="596.97" cy="415.46" r="0.47"></circle>
                                            <circle cx="594.61" cy="416.12" r="0.47"></circle>
                                            <circle cx="591.68" cy="417.05" r="0.47"></circle>
                                            <circle cx="586.43" cy="418.18" r="0.47"></circle>
                                            <circle cx="580.9" cy="418.85" r="0.47"></circle>
                                            <circle cx="575.18" cy="419.11" r="0.47"></circle>
                                            <circle cx="566.95" cy="417.98" r="0.47"></circle>
                                            <circle cx="569.68" cy="418.65" r="0.47"></circle>
                                            <circle cx="561.87" cy="417.05" r="0.47"></circle>
                                            <circle cx="564.32" cy="417.52" r="0.47"></circle>
                                            <circle cx="559.18" cy="416.12" r="0.47"></circle>
                                            <circle cx="589" cy="417.71" r="0.47"></circle>
                                            <circle cx="583.59" cy="418.65" r="0.47"></circle>
                                            <circle cx="577.72" cy="419.11" r="0.47"></circle>
                                            <circle cx="572.37" cy="419.11" r="0.47"></circle>
                                        </g>
                                        <circle cx="822.99" cy="92.87" r="21.63" fill="#fed700" opacity="0.1"></circle>
                                        <circle cx="918.99" cy="145.87" r="17.01" fill="#fed700" opacity="0.1"></circle>
                                        <circle cx="966.57" cy="63.9" r="6" fill="#fed700" opacity="0.1"></circle>
                                        <path
                                            d="M237.86,724.25s7.13,9.33-3.29,23.41-19,26-15.55,34.76c0,0,15.73-26.16,28.54-26.52S252,740,237.86,724.25Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M237.86,724.25a11.49,11.49,0,0,1,1.46,2.92c12.49,14.68,19.15,28.38,7.14,28.73-11.19.32-24.61,20.32-27.82,25.37a9.11,9.11,0,0,0,.38,1.15s15.73-26.16,28.54-26.52S252,740,237.86,724.25Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M251.12,736.14c0,3.28-.37,5.94-.82,5.94s-.82-2.66-.82-5.94.46-1.74.91-1.74S251.12,732.85,251.12,736.14Z"
                                            transform="translate(-113.71 -34.73)" fill="#ffd037"></path>
                                        <path
                                            d="M255.67,740.06c-2.88,1.57-5.39,2.52-5.61,2.12s1.94-2,4.83-3.57,1.74-.43,2,0S258.56,738.49,255.67,740.06Z"
                                            transform="translate(-113.71 -34.73)" fill="#ffd037"></path>
                                        <path
                                            d="M200.17,724.25s-7.13,9.33,3.29,23.41,19,26,15.56,34.76c0,0-15.74-26.16-28.54-26.52S186.08,740,200.17,724.25Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M200.17,724.25a11.49,11.49,0,0,0-1.46,2.92c-12.49,14.68-19.15,28.38-7.14,28.73,11.19.32,24.61,20.32,27.83,25.37a11.06,11.06,0,0,1-.38,1.15s-15.74-26.16-28.54-26.52S186.08,740,200.17,724.25Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M186.91,736.14c0,3.28.37,5.94.82,5.94s.82-2.66.82-5.94-.46-1.74-.91-1.74S186.91,732.85,186.91,736.14Z"
                                            transform="translate(-113.71 -34.73)" fill="#ffd037"></path>
                                        <path
                                            d="M182.36,740.06c2.88,1.57,5.39,2.52,5.61,2.12s-1.94-2-4.83-3.57-1.74-.43-2,0S179.47,738.49,182.36,740.06Z"
                                            transform="translate(-113.71 -34.73)" fill="#ffd037"></path>
                                        <ellipse cx="219.02" cy="842.35" rx="74.6" ry="11.45"
                                            transform="translate(-172.73 -17.13) rotate(-4.05)" fill="#fed700"
                                            opacity="0.1"></ellipse>
                                        <path
                                            d="M257.41,769.85l-.36,2.91-.5,4.12-.2,1.71-.5,4.12-.22,1.72-.5,4.11-5.71,46.8c-.51,4.18-7.33,7.43-15.57,7.43H204.18c-8.24,0-15.05-3.25-15.56-7.43l-5.72-46.8-.5-4.11-.21-1.72-.51-4.12-.2-1.71-.5-4.12-.36-2.91c-.29-2.37,3.41-4.36,8.07-4.36h60.66C254,765.49,257.7,767.48,257.41,769.85Z"
                                            transform="translate(-113.71 -34.73)" fill="#65617d"></path>
                                        <polygon
                                            points="143.34 738.04 142.84 742.15 67.76 742.15 67.26 738.04 143.34 738.04"
                                            fill="#9d9cb5"></polygon>
                                        <polygon
                                            points="142.63 743.87 142.13 747.99 68.48 747.99 67.97 743.87 142.63 743.87"
                                            fill="#9d9cb5"></polygon>
                                        <polygon
                                            points="141.91 749.7 141.41 753.81 69.19 753.81 68.69 749.7 141.91 749.7"
                                            fill="#9d9cb5"></polygon>
                                        <polygon
                                            points="701.13 403.44 728.45 404.83 683.42 419.01 660.36 417.68 701.13 403.44"
                                            opacity="0.1"></polygon>
                                        <polygon
                                            points="701.12 402.25 728.44 403.65 683.4 417.83 660.34 416.49 701.12 402.25"
                                            fill="#fff"></polygon>
                                        <path
                                            d="M811.61,440.08c1.07-.47,2.23.38,3.38.58.66.12,1.34,0,2,.1,1.34.16,2.68,1,4,.57Z"
                                            transform="translate(-113.71 -34.73)" fill="#d3dae1"></path>
                                        <path
                                            d="M810.21,440.92c1.07-.47,2.23.38,3.38.58.66.12,1.34,0,2,.1,1.34.16,2.68,1,3.95.56Z"
                                            transform="translate(-113.71 -34.73)" fill="#d3dae1"></path>
                                        <path
                                            d="M807,442.6c1.07-.47,2.23.38,3.39.58.65.12,1.33,0,2,.1,1.34.16,2.68,1,4,.56Z"
                                            transform="translate(-113.71 -34.73)" fill="#d3dae1"></path>
                                        <path
                                            d="M876.08,432.82s-3.42,15.92,11.79,17.8l.94-1.76S877,437.77,876.08,432.82Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M893.65,448.74l-3.54.75-.35.07s-9.44-7.66-9.32-24.76a42.22,42.22,0,0,0,4.51,7.13C888.69,436.88,892.94,443.49,893.65,448.74Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M894.84,450.38a2.22,2.22,0,0,1-1.9.24c-9.08-2.12-6-31.71-6-31.71.5.24,1.05,4,3.14,8.86C893.73,436.31,897.76,448.23,894.84,450.38Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path d="M915,432.82s.59,15.92-14.62,17.8l-.94-1.76S914,437.77,915,432.82Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M910.62,424.8c.12,17.1-12.14,24.76-12.14,24.76l-.36-.07-3.53-.75c.7-5.25,5-11.86,8.69-16.81A38.47,38.47,0,0,1,910.62,424.8Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M898.07,448.83a5.74,5.74,0,0,1-2,1.55h0a3.86,3.86,0,0,1-.75.24c-2.23.53-3-1.09-2.88-3.82.21-4.88,3.27-13.33,6-19.65a24.53,24.53,0,0,1,5.7-8.24S904,442,898.07,448.83Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path d="M895.53,408.53s-10.14,36-1.41,41.39S897.77,411.72,895.53,408.53Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M876.08,432.82s-3.42,15.92,11.79,17.8l.94-1.76S877,437.77,876.08,432.82Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M893.65,448.74l-3.54.75-.35.07s-9.44-7.66-9.32-24.76a42.22,42.22,0,0,0,4.51,7.13C888.69,436.88,892.94,443.49,893.65,448.74Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M894.84,450.38a2.22,2.22,0,0,1-1.9.24c-9.08-2.12-6-31.71-6-31.71.5.24,1.05,4,3.14,8.86C893.73,436.31,897.76,448.23,894.84,450.38Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path d="M915,432.82s.59,15.92-14.62,17.8l-.94-1.76S914,437.77,915,432.82Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M910.62,424.8c.12,17.1-12.14,24.76-12.14,24.76l-.36-.07-3.53-.75c.7-5.25,5-11.86,8.69-16.81A38.47,38.47,0,0,1,910.62,424.8Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M898.07,448.83a5.74,5.74,0,0,1-2,1.55h0a3.86,3.86,0,0,1-.75.24c-2.23.53-3-1.09-2.88-3.82.21-4.88,3.27-13.33,6-19.65a24.53,24.53,0,0,1,5.7-8.24S904,442,898.07,448.83Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path d="M895.53,408.53s-10.14,36-1.41,41.39S897.77,411.72,895.53,408.53Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path d="M876.08,432.82s-2,15.92,13.2,17.8l.94-1.76S877,437.77,876.08,432.82Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M895.06,448.74l-3.54.75-.35.07s-10.85-7.66-10.73-24.76c0,0,2.78,3,5.92,7.13C890.1,436.88,894.35,443.49,895.06,448.74Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M895.06,448.74l-3.54.75c-3.35-2.95-4.68-10.63-5.16-17.56C890.1,436.88,894.35,443.49,895.06,448.74Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M896.26,450.38a2.25,2.25,0,0,1-1.91.24c-9.08-2.12-7.42-31.71-7.42-31.71.5.24,2.47,4,4.55,8.86C895.15,436.31,899.17,448.23,896.26,450.38Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path d="M915,432.82s2,15.92-13.2,17.8l-.94-1.76S914,437.77,915,432.82Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M910.62,424.8c.12,17.1-10.73,24.76-10.73,24.76l-.35-.07-3.54-.75c.7-5.25,5-11.86,8.7-16.81C907.84,427.78,910.62,424.8,910.62,424.8Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M904.7,431.93c-.46,6.46-1.64,13.57-4.51,16.9a6.77,6.77,0,0,1-.65.66l-3.54-.75C896.7,443.49,901,436.88,904.7,431.93Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M899.48,448.83a5.62,5.62,0,0,1-2,1.55h0a4,4,0,0,1-.74.24c-2.24.53-3-1.09-2.89-3.82.22-4.88,3.28-13.33,6-19.65,2-4.56,3.81-8,4.29-8.24C904.14,418.91,905.42,442,899.48,448.83Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <path
                                            d="M896.26,450.38a2.55,2.55,0,0,1-1.44-.46c-4.27-2.66-4.36-12.65-3.34-22.15C895.15,436.31,899.17,448.23,896.26,450.38Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path
                                            d="M899.48,448.83c-.49,1.06-1.15,1.62-2,1.55h0a3,3,0,0,1-1.21-.46,6.55,6.55,0,0,1-2.42-3.12c.22-4.88,3.28-13.33,6-19.65C900.83,435.92,901.16,445.23,899.48,448.83Z"
                                            transform="translate(-113.71 -34.73)" opacity="0.1"></path>
                                        <path d="M895.53,408.53s-8.72,36,0,41.39S897.77,411.72,895.53,408.53Z"
                                            transform="translate(-113.71 -34.73)" fill="#fed700"></path>
                                        <polygon
                                            points="795.5 416.96 794.89 420.14 792.67 431.81 771.56 431.81 769.34 420.14 768.73 416.96 795.5 416.96"
                                            fill="#65617d"></polygon>
                                        <polygon
                                            points="795.5 416.96 794.89 420.14 769.34 420.14 768.73 416.96 795.5 416.96"
                                            opacity="0.1"></polygon>
                                        <rect x="763.66" y="413.42" width="36.31" height="6.01" fill="#65617d"></rect>
                                        <path
                                            d="M975.07,499s71.76,45,56.06,117.4c-1.28,5.91-2.39,11.84-3.12,17.83C1025.14,657.69,1007.92,725,905.07,756v7l43.63-12.17,29.62-16.33,22.61-20.29,27.64-33.71L1041.4,653l4.7-36.22,2.67-41.36L1042.16,540l-15.59-23.07-19-14.78Z"
                                            transform="translate(-113.71 -34.73)" fill="#d9d6df"></path>
                                        <path
                                            d="M313.73,692.15c-6.78,36-1.52,73.45,16.18,105.56,51.61,93.62,161.29,66.07,193.65,55.45,7.7-2.53,15.5-4.72,23.4-6.51L903.4,765.87c122.67-21.33,148-120.67,148-120.67,24.29-76.62,7.64-121.26-14.34-146.56a86.77,86.77,0,0,0-70.21-29.34l-42.28,2.24-375.83,41C373.05,514.42,326.12,626.25,313.73,692.15Zm34.81,4.51C360.39,640,406.87,557.82,556.36,552.75c6.86-.24,13.71-.84,20.52-1.75L913,506.1l38.92-2c29.24-1.47,57.46,12.14,73.67,36.51,15.48,23.29,23.85,60,4.7,117.07,0,0-23.43,86.72-136.87,105.35L564.19,833.53c-7.49,1.6-14.89,3.56-22.2,5.82-29.86,9.22-129.15,32.6-177.38-45.92C346.88,764.56,341.6,729.82,348.54,696.66Z"
                                            transform="translate(-113.71 -34.73)" fill="#e1dee5"></path>
                                    </svg>
                                    <p class="my-8 text-normal font-bold text-gray-500 dark:text-gray-200">{{
                                        $t('course.show.noEpisodesYet') }}</p>
                                </div>
                                <div v-else>
                                    <Disclosure :defaultOpen="index === 0 ? true : false" v-slot="{ open }" as="div"
                                        v-for="(section, index) in sortedCourseSections" :key="section.id ?? index" class="mb-3 last:mb-0">
                                        <!-- Use the `open` state to conditionally change the direction of an icon. -->
                                        <DisclosureButton
                                            class="flex items-center justify-between w-full px-4 py-3.5 text-left border rounded-xl transition-colors focus:ring-2 focus:ring-offset-0"
                                            :class="courseAvailability?.can_watch_videos === false
                                                ? 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60 focus:ring-gray-200 dark:focus:ring-gray-700'
                                                : 'text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-200 dark:focus:ring-gray-800'">
                                            <div class="min-w-0">
                                                <div class="text-sm font-bold text-gray-800 dark:text-gray-100">
                                                    {{ $t('course.show.section') }} {{ convertToOrdinal(index + 1) }}
                                                    <span class="font-normal text-gray-500 dark:text-gray-400">—</span>
                                                    <span class="font-semibold">{{ section.title }}</span>
                                                </div>
                                                <p v-if="showSectionAvailabilityMessage(section)"
                                                    class="text-xs font-normal mt-1 leading-relaxed"
                                                    :class="scheduleAccentTextClass()">
                                                    {{ section.availability.message }}
                                                </p>
                                            </div>
                                            <svg class="rtl:mr-2 ltr:ml-2 ltr:rotate-180"
                                                :class="open && '-rotate-90 transform transition duration-300'"
                                                width="21" height="15" viewBox="0 0 21 15" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill="currentColor" opacity="0.4"
                                                    d="M12.4789 4.53947L15.8693 4.23962C16.6302 4.23962 17.2471 4.86253 17.2471 5.63081C17.2471 6.3991 16.6302 7.022 15.8693 7.022L12.4789 6.72216C11.882 6.72216 11.3981 6.23353 11.3981 5.63081C11.3981 5.02709 11.882 4.53947 12.4789 4.53947">
                                                </path>
                                                <path fill="currentColor"
                                                    d="M1.09392 4.5946C1.14691 4.5411 1.34488 4.31495 1.53085 4.12717C2.61567 2.95102 5.44819 1.02779 6.92994 0.439206C7.1549 0.345316 7.7238 0.145421 8.02875 0.131287C8.3197 0.131287 8.59765 0.198928 8.86261 0.332191C9.19355 0.518962 9.45751 0.813757 9.60348 1.16105C9.69647 1.40133 9.84244 2.12317 9.84244 2.1363C9.98742 2.92477 10.0664 4.20693 10.0664 5.62437C10.0664 6.97315 9.98742 8.20281 9.86844 9.00441C9.85544 9.01855 9.70947 9.91404 9.55049 10.2209C9.25954 10.7823 8.69064 11.1296 8.08174 11.1296H8.02875C7.63182 11.1164 6.79796 10.7681 6.79796 10.756C5.3952 10.1674 2.62966 8.33708 1.51785 7.12055C1.51785 7.12055 1.2039 6.80758 1.06793 6.61274C0.855964 6.33208 0.749982 5.98478 0.749982 5.63749C0.749982 5.24981 0.868961 4.8894 1.09392 4.5946">
                                                </path>
                                            </svg>
                                        </DisclosureButton>
                                        <transition enter-active-class="transition duration-300 ease-out"
                                            enter-from-class="transform scale-95 opacity-0"
                                            enter-to-class="transform scale-100 opacity-100"
                                            leave-active-class="transition duration-300 ease-out"
                                            leave-from-class="transform scale-100 opacity-100"
                                            leave-to-class="transform scale-95 opacity-0">
                                            <DisclosurePanel>
                                                <div class="my-4 rtl:md:mr-5 ltr:md:ml-5">
                                                    <!-- Start Episode -->
                                                    <div v-for="(episode, epIndex) in section.episode" :key="episode.id ?? episode.order ?? epIndex">
                                                        <div
                                                            class="group overflow-hidden md:flex-row flex-col flex relative md:items-center justify-between border rounded-xl md:py-3 py-2 rtl:md:pl-5 rtl:pl-2 rtl:md:pr-0 rtl:pr-12 ltr:md:pr-5 ltr:pr-2 ltr:md:pl-0 ltr:pl-12 mb-2 transition-colors"
                                                            :class="isEpisodeScheduleLocked(episode)
                                                                ? 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/80'
                                                                : 'dark:bg-gray-500 bg-gray-200 dark:bg-opacity-10 bg-opacity-10 dark:border-opacity-0 border-gray-200'">
                                                            <div class="flex items-center md:w-1/2 w-full">
                                                                <!-- <div class="w-14 flex md:relative absolute rtl:right-0 ltr:left-0 top-1/2 transform md:-translate-y-0 -translate-y-1/2 rtl:border-l ltr:border-r h-5/6 justify-center items-center">
                                                                    <button :class="episode.lock === 1 && !userCanSeeCourse ? 'flex' : 'hidden'" class="bg-rose-500 w-7 h-7 items-center border border-rose-500 group-hover:hidden transition duration-500 justify-center group rounded-xl">
                                                                        <svg class="w-5 h-5" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path class="stroke-current transition duration-200 text-white group-hover:text-gray-450" d="M16.6444 9.44804V7.30104C16.6444 4.78804 14.6064 2.75004 12.0934 2.75004C9.58044 2.73904 7.53444 4.76704 7.52344 7.28104V7.30104V9.44804" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                            <path class="stroke-current transition duration-200 text-white group-hover:text-gray-450" fill-rule="evenodd" clip-rule="evenodd" d="M15.9037 21.2498H8.2627C6.1687 21.2498 4.4707 19.5528 4.4707 17.4578V13.1688C4.4707 11.0738 6.1687 9.37683 8.2627 9.37683H15.9037C17.9977 9.37683 19.6957 11.0738 19.6957 13.1688V17.4578C19.6957 19.5528 17.9977 21.2498 15.9037 21.2498Z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                            <path class="stroke-current transition duration-200 text-white group-hover:text-gray-450" d="M12.084 14.203V16.424" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                        </svg>
                                                                    </button>
                                                                    <span :class="episode.lock === 1 && !userCanSeeCourse ? 'hidden text-rose-500' : 'flex text-gray-500 dark:text-gray-400'" class="group-hover:flex transition duration-500 md:text-xl text-md font-bold text-center relative">
                                                                        {{ episode.number }}
                                                                        <i :class="episode.lock === 1 && !userCanSeeCourse ? 'bg-red-500' : 'bg-gray-500 dark:bg-gray-400'" class="absolute rounded-full bottom-0 right-2/4 transform translate-x-2/4 w-full flex h-1 min-w-[22px]"></i>
                                                                    </span>
                                                                </div> -->
                                                                <div
                                                                    class="w-14 flex md:relative absolute rtl:right-0 ltr:left-0 top-1/2 transform md:-translate-y-0 -translate-y-1/2 rtl:border-l ltr:border-r h-5/6 justify-center items-center group">
                                                                    <template v-if="isEpisodeScheduleLocked(episode)">
                                                                        <button
                                                                            :title="episodeLockTitle(episode)"
                                                                            class="w-7 h-7 flex items-center justify-center border group-hover:hidden rounded-lg transition duration-500"
                                                                            :class="scheduleLockIconClass()">
                                                                            <svg class="w-5 h-5" viewBox="0 0 25 24"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg">
                                                                                <path
                                                                                    class="stroke-current transition duration-200 text-white"
                                                                                    d="M16.6444 9.44804V7.30104C16.6444 4.78804 14.6064 2.75004 12.0934 2.75004C9.58044 2.73904 7.53444 4.76704 7.52344 7.28104V7.30104V9.44804"
                                                                                    stroke-width="1.8"
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"></path>
                                                                                <path
                                                                                    class="stroke-current transition duration-200 text-white"
                                                                                    fill-rule="evenodd"
                                                                                    clip-rule="evenodd"
                                                                                    d="M15.9037 21.2498H8.2627C6.1687 21.2498 4.4707 19.5528 4.4707 17.4578V13.1688C4.4707 11.0738 6.1687 9.37683 8.2627 9.37683H15.9037C17.9977 9.37683 19.6957 11.0738 19.6957 13.1688V17.4578C19.6957 19.5528 17.9977 21.2498 15.9037 21.2498Z"
                                                                                    stroke-width="1.8"
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"></path>
                                                                                <path
                                                                                    class="stroke-current transition duration-200 text-white"
                                                                                    d="M12.084 14.203V16.424"
                                                                                    stroke-width="1.8"
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"></path>
                                                                            </svg>
                                                                        </button>
                                                                        <span
                                                                            class="hidden group-hover:flex transition duration-500 md:text-xl text-md font-bold text-center relative"
                                                                            :class="scheduleAccentTextClass()">
                                                                            {{ episode.number }}
                                                                            <i
                                                                                class="absolute rounded-full bottom-0 right-2/4 transform translate-x-2/4 w-full flex h-1 min-w-[22px]"
                                                                                :class="scheduleAccentBarClass()"></i>
                                                                        </span>
                                                                    </template>
                                                                    <template
                                                                        v-else-if="(!isLoggedin && episode.lock === 1) || (isLoggedin && episode.lock === 1 && !userCanSeeCourse)">
                                                                        <button
                                                                            class="bg-rose-500 w-7 h-7 flex items-center justify-center border border-rose-500 group-hover:hidden rounded-xl transition duration-500">
                                                                            <!-- ط¢غŒع©ظˆظ† ظ‚ظپظ„ -->
                                                                            <svg class="w-5 h-5" viewBox="0 0 25 24"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg">
                                                                                <path
                                                                                    class="stroke-current transition duration-200 text-white group-hover:text-gray-450"
                                                                                    d="M16.6444 9.44804V7.30104C16.6444 4.78804 14.6064 2.75004 12.0934 2.75004C9.58044 2.73904 7.53444 4.76704 7.52344 7.28104V7.30104V9.44804"
                                                                                    stroke-width="1.8"
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"></path>
                                                                                <path
                                                                                    class="stroke-current transition duration-200 text-white group-hover:text-gray-450"
                                                                                    fill-rule="evenodd"
                                                                                    clip-rule="evenodd"
                                                                                    d="M15.9037 21.2498H8.2627C6.1687 21.2498 4.4707 19.5528 4.4707 17.4578V13.1688C4.4707 11.0738 6.1687 9.37683 8.2627 9.37683H15.9037C17.9977 9.37683 19.6957 11.0738 19.6957 13.1688V17.4578C19.6957 19.5528 17.9977 21.2498 15.9037 21.2498Z"
                                                                                    stroke-width="1.8"
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"></path>
                                                                                <path
                                                                                    class="stroke-current transition duration-200 text-white group-hover:text-gray-450"
                                                                                    d="M12.084 14.203V16.424"
                                                                                    stroke-width="1.8"
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"></path>
                                                                            </svg>
                                                                        </button>
                                                                        <span
                                                                            class="hidden group-hover:flex transition duration-500 md:text-xl text-md font-bold text-rose-500 text-center relative">
                                                                            {{ episode.number }}
                                                                            <i
                                                                                class="absolute rounded-full bottom-0 right-2/4 transform translate-x-2/4 bg-rose-500 w-full flex h-1 min-w-[22px]"></i>
                                                                        </span>
                                                                    </template>

                                                                    <!-- ط§ع¯ط± ع©ط§ط±ط¨ط± ط¯ظˆط±ظ‡ ط±ظˆ ط¯ط§ط±ظ‡ ظˆ ط§ظ¾غŒط²ظˆط¯ ط±ظˆ ع©ط§ظ…ظ„ ط¯غŒط¯ظ‡ -->
                                                                    <template
                                                                        v-else-if="isLoggedin && userCanSeeCourse && episode.fullWatched">
                                                                        <button
                                                                            class="bg-green-500 w-7 h-7 flex items-center justify-center border border-green-500 group-hover:hidden rounded-xl transition duration-500">
                                                                            <!-- ط¢غŒع©ظˆظ† ع†ع© ط³ط¨ط² -->
                                                                            <svg class="w-4 h-4 text-white" fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                                viewBox="0 0 415.582 415.582"
                                                                                xml:space="preserve">
                                                                                <path fill="currentColor"
                                                                                    d="M411.47,96.426l-46.319-46.32c-5.482-5.482-14.371-5.482-19.853,0L152.348,243.058l-82.066-82.064 c-5.48-5.482-14.37-5.482-19.851,0l-46.319,46.32c-5.482,5.481-5.482,14.37,0,19.852l138.311,138.31 c2.741,2.742,6.334,4.112,9.926,4.112c3.593,0,7.186-1.37,9.926-4.112L411.47,116.277c2.633-2.632,4.111-6.203,4.111-9.925 C415.582,102.628,414.103,99.059,411.47,96.426z">
                                                                                </path>
                                                                            </svg>
                                                                        </button>
                                                                        <span
                                                                            class="hidden group-hover:flex transition duration-500 md:text-xl text-md font-bold text-green-500 text-center relative">
                                                                            {{ episode.number }}
                                                                            <i
                                                                                class="absolute rounded-full bottom-0 right-2/4 transform translate-x-2/4 bg-green-500 w-full flex h-1 min-w-[22px]"></i>
                                                                        </span>
                                                                    </template>

                                                                    <!-- ط§ع¯ط± ع©ط§ط±ط¨ط± ط¯ظˆط±ظ‡ ط±ظˆ ط¯ط§ط±ظ‡طŒ ط§ظ¾غŒط²ظˆط¯ ع©ط§ظ…ظ„ ط¯غŒط¯ظ‡ ظ†ط´ط¯ظ‡ ظˆظ„غŒ ط¯ط±طµط¯ ظ…ط´ط§ظ‡ط¯ظ‡ > 0 -->
                                                                    <template
                                                                        v-else-if="isLoggedin && userCanSeeCourse && !episode.fullWatched && episode.progressPercentage > 0">
                                                                        <span
                                                                            class="flex transition duration-500 md:text-xl text-md font-bold text-yellow-400 text-center relative">
                                                                            {{ episode.number }}
                                                                            <i
                                                                                class="absolute rounded-full bottom-0 right-2/4 transform translate-x-2/4 bg-yellow-400 w-full flex h-1 min-w-[22px]"></i>
                                                                        </span>
                                                                    </template>

                                                                    <!-- ط§ع¯ط± ع©ط§ط±ط¨ط± ط¯ظˆط±ظ‡ ط±ظˆ ط¯ط§ط±ظ‡ ظˆ ظ‡ظ†ظˆط² ع†غŒط²غŒ ط§ط² ط§ظ¾غŒط²ظˆط¯ ظ†ط¯غŒط¯ظ‡ -->
                                                                    <template
                                                                        v-else-if="isLoggedin && userCanSeeCourse && !episode.fullWatched && episode.progressPercentage === 0">
                                                                        <span
                                                                            class="flex transition duration-500 md:text-xl text-md font-bold text-gray-500 dark:text-gray-400 text-center relative">
                                                                            {{ episode.number }}
                                                                            <i
                                                                                class="absolute rounded-full bottom-0 right-2/4 transform translate-x-2/4 bg-gray-500 dark:bg-gray-400 w-full flex h-1 min-w-[22px]"></i>
                                                                        </span>
                                                                    </template>

                                                                    <!-- ظˆظ‚طھغŒ ع©ط§ط±ط¨ط± ظ„ط§ع¯غŒظ† ظ†غŒط³طھ ظˆ ط§ظ¾غŒط²ظˆط¯ ظ‚ظپظ„ ظ‡ظ… ظ†غŒط³طھ -->
                                                                    <template v-else>
                                                                        <span
                                                                            class="flex transition duration-500 md:text-xl text-md font-bold text-gray-500 dark:text-gray-400 text-center relative">
                                                                            {{ episode.number }}
                                                                            <i
                                                                                class="absolute rounded-full bottom-0 right-2/4 transform translate-x-2/4 bg-gray-500 dark:bg-gray-400 w-full flex h-1 min-w-[22px]"></i>
                                                                        </span>
                                                                    </template>
                                                                </div>

                                                                <component
                                                                    :is="isEpisodeLinkEnabled(episode) ? 'router-link' : 'span'"
                                                                    v-bind="isEpisodeLinkEnabled(episode) ? {
                                                                        to: episodeShowRoute(course.slug, episode.order),
                                                                    } : {}"
                                                                    :title="!isEpisodeLinkEnabled(episode) ? episodeLockTitle(episode) : undefined"
                                                                    :class="[
                                                                        'font-medium md:text-sm text-sm rtl:pr-5 ltr:pl-5 min-h-7 overflow-hidden leading-7 transition duration-200',
                                                                        isEpisodeLinkEnabled(episode)
                                                                            ? 'text-gray-700 dark:text-gray-300 dark:hover:text-yellow-400 hover:text-gray-900 cursor-pointer'
                                                                            : 'text-gray-500 dark:text-gray-400 cursor-not-allowed select-none',
                                                                    ]">
                                                                    {{ episode.title }}
                                                                </component>
                                                            </div>

                                                            <div
                                                                class="flex items-center md:justify-end sm:mt-0 mt-2 justify-end md:w-1/2 w-full">
                                                                <router-link v-if="episode.attachs.length > 0 && isEpisodeLinkEnabled(episode)" :to="{
                                                                    ...episodeShowRoute(course.slug, episode.order),
                                                                    hash: '#attachments',
                                                                }"
                                                                    class="hidden md:flex rtl:text-left ltr:text-right text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 text-xs items-center font-semibold group hover:text-gray-900 transition duration-200">
                                                                    <span> {{ $t('course.show.attachment') }} </span>
                                                                    <svg class="rtl:mr-1 ltr:ml-1 transform md:scale-100 scale-75"
                                                                        width="13" height="13" viewBox="0 0 18 18"
                                                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path stroke="currentColor"
                                                                            d="M12.5332 8.22469L8.84688 11.911M8.84688 11.911L5.16055 8.22469M8.84688 11.911L8.84688 1.5893"
                                                                            stroke-width="1.278" stroke-linecap="round"
                                                                            stroke-linejoin="round"></path>
                                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                                            fill="currentColor"
                                                                            d="M3.68609 4.62374C3.68609 4.19941 3.28582 3.88402 2.88807 4.03183C0.617579 4.87561 0 6.6709 0 10.2196C0 15.8625 1.56153 17.0719 8.84718 17.0719C16.1328 17.0719 17.6944 15.8625 17.6944 10.2196C17.6944 6.67063 17.0767 4.87533 14.8058 4.03164C14.408 3.88387 14.0078 4.19926 14.0078 4.62357V4.62357C14.0078 4.91368 14.2011 5.16389 14.4703 5.27197C14.7815 5.39688 15.0254 5.53681 15.2203 5.6878C15.993 6.28626 16.4164 7.40022 16.4164 10.2196C16.4164 13.039 15.993 14.153 15.2203 14.7514C14.7991 15.0777 14.1493 15.3523 13.0864 15.5353C12.0239 15.7181 10.6465 15.7939 8.84718 15.7939C7.04784 15.7939 5.67049 15.7181 4.60797 15.5353C3.54511 15.3523 2.89526 15.0777 2.47403 14.7514C1.70134 14.153 1.278 13.039 1.278 10.2196C1.278 7.40022 1.70134 6.28626 2.47403 5.6878C2.66889 5.53688 2.91266 5.39701 3.22362 5.27214C3.49282 5.16404 3.68609 4.91384 3.68609 4.62374V4.62374Z">
                                                                        </path>
                                                                    </svg>
                                                                </router-link>
                                                                <div
                                                                    class="mx-3 md:mx-6 font-mono flex rtl:text-left ltr:text-right items-center text-gray-500 dark:text-gray-200 text-xs">
                                                                    <span>
                                                                        {{ new Date(episode.total_time *
                                                                            1000).toISOString().slice(11, 19) }}
                                                                    </span>
                                                                    <svg class="rtl:mr-1 ltr:ml-1" width="13"
                                                                        height="13" viewBox="0 0 15 15" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M0.593771 7.42999C0.593771 8.88334 0.67242 10.0107 0.867812 10.8899C1.06171 11.7623 1.36257 12.3536 1.78212 12.7731C2.20166 13.1927 2.79289 13.4935 3.66534 13.6874C4.54452 13.8828 5.67189 13.9615 7.12525 13.9615C8.57861 13.9615 9.70598 13.8828 10.5852 13.6874C11.4576 13.4935 12.0488 13.1927 12.4684 12.7731C12.8879 12.3536 13.1888 11.7623 13.3827 10.8899C13.5781 10.0107 13.6567 8.88334 13.6567 7.42999C13.6567 5.97663 13.5781 4.84926 13.3827 3.97007C13.1888 3.09763 12.8879 2.5064 12.4684 2.08685C12.0488 1.66731 11.4576 1.36644 10.5852 1.17255C9.70598 0.977155 8.57861 0.898505 7.12525 0.898505C5.67189 0.898505 4.54452 0.977155 3.66534 1.17255C2.79289 1.36644 2.20166 1.66731 1.78212 2.08685C1.36257 2.5064 1.06171 3.09763 0.867812 3.97007C0.67242 4.84926 0.593771 5.97663 0.593771 7.42999Z"
                                                                            stroke="#98A3B8" stroke-width="1.18754"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"></path>
                                                                        <path
                                                                            d="M7.125 3.86731C7.125 3.86731 7.125 6.24239 7.125 6.83616C7.125 7.42994 7.125 7.42994 7.71877 7.42994C8.31255 7.42994 10.6876 7.42994 10.6876 7.42994"
                                                                            stroke="#98A3B8" stroke-width="1.18754"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"></path>
                                                                    </svg>
                                                                </div>
                                                                <div v-if="episode.quizzes && episode.quizzes.length"
                                                                    class="flex items-center gap-1 me-2">
                                                                    <component
                                                                        v-for="quiz in episode.quizzes"
                                                                        :key="quiz.uuid"
                                                                        :is="episodeQuizTag(quiz)"
                                                                        v-bind="episodeQuizBind(quiz)"
                                                                        :title="quiz.title || $t('quiz.section.episodeTitle')"
                                                                        class="inline-flex h-7 w-7 items-center justify-center rounded-lg text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/15 dark:hover:bg-yellow-400/10 transition"
                                                                    >
                                                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M9.5 2C8.67157 2 8 2.67157 8 3.5V4.5C8 5.32843 8.67157 6 9.5 6H14.5C15.3284 6 16 5.32843 16 4.5V3.5C16 2.67157 15.3284 2 14.5 2H9.5Z" fill="currentColor"></path>
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.5 4.03662C5.24209 4.10719 4.44798 4.30764 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.552 4.30764 18.7579 4.10719 17.5 4.03662V4.5C17.5 6.15685 16.1569 7.5 14.5 7.5H9.5C7.84315 7.5 6.5 6.15685 6.5 4.5V4.03662ZM7 13.75C6.58579 13.75 6.25 14.0858 6.25 14.5C6.25 14.9142 6.58579 15.25 7 15.25H15C15.4142 15.25 15.75 14.9142 15.75 14.5C15.75 14.0858 15.4142 13.75 15 13.75H7ZM7 17.25C6.58579 17.25 6.25 17.5858 6.25 18C6.25 18.4142 6.58579 18.75 7 18.75H12.5C12.9142 18.75 13.25 18.4142 13.25 18C13.25 17.5858 12.9142 17.25 12.5 17.25H7Z" fill="currentColor"></path>
                                                                        </svg>
                                                                    </component>
                                                                </div>
                                                                <div v-if="isEpisodeLinkEnabled(episode)" class="flex items-center justify-end">
                                                                    <router-link :to="episodeShowRoute(course.slug, episode.order)"
                                                                        class="flex items-center bg-gray-200 text-gray-600 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-900 dark:hover:text-yellow-400 pt-2 pb-1.5 px-2 rounded-lg text-xs font-semibold hover:bg-opacity-60 group transition duration-200 hover:text-gray-800">
                                                                        {{ $t('course.show.view') }}
                                                                        <svg class="rtl:mr-1 ltr:ml-1" width="16"
                                                                            height="14" viewBox="0 -1 16 12" fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                            <path class="fill-current"
                                                                                d="M7.24633 5.00009C7.24633 5.31615 7.52993 5.66681 7.99874 5.66681C8.46755 5.66681 8.75115 5.31615 8.75115 5.00009C8.75115 4.68402 8.46755 4.33336 7.99874 4.33336C7.52993 4.33336 7.24633 4.68402 7.24633 5.00009Z">
                                                                            </path>
                                                                            <path fill-rule="evenodd"
                                                                                clip-rule="evenodd" class="fill-current"
                                                                                d="M0.298885 5.75498C-0.100931 5.32192 -0.10093 4.67825 0.298885 4.24519C1.51832 2.92435 4.37283 0.333008 7.99945 0.333008C11.6261 0.333008 14.4806 2.92435 15.7 4.24519C16.0998 4.67825 16.0998 5.32192 15.7 5.75498C14.4806 7.07582 11.6261 9.66716 7.99945 9.66716C4.37283 9.66716 1.51832 7.07582 0.298885 5.75498ZM5.91288 5.00009C5.91288 6.10475 6.84675 7.00026 7.99874 7.00026C9.15073 7.00026 10.0846 6.10475 10.0846 5.00009C10.0846 3.89542 9.15073 2.99991 7.99874 2.99991C6.84675 2.99991 5.91288 3.89542 5.91288 5.00009Z">
                                                                            </path>
                                                                        </svg>
                                                                    </router-link>
                                                                </div>
                                                                <span v-else
                                                                    :title="episodeLockTitle(episode)"
                                                                    class="inline-flex items-center gap-1 bg-gray-100 text-gray-500 dark:text-gray-400 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 pt-2 pb-1.5 px-2.5 rounded-lg text-xs font-semibold cursor-not-allowed select-none">
                                                                    <svg class="w-3.5 h-3.5 opacity-70" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path class="stroke-current" d="M16.6444 9.44804V7.30104C16.6444 4.78804 14.6064 2.75004 12.0934 2.75004C9.58044 2.73904 7.53444 4.76704 7.52344 7.28104V7.30104V9.44804" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                        <path class="stroke-current" fill-rule="evenodd" clip-rule="evenodd" d="M15.9037 21.2498H8.2627C6.1687 21.2498 4.4707 19.5528 4.4707 17.4578V13.1688C4.4707 11.0738 6.1687 9.37683 8.2627 9.37683H15.9037C17.9977 9.37683 19.6957 11.0738 19.6957 13.1688V17.4578C19.6957 19.5528 17.9977 21.2498 15.9037 21.2498Z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                    </svg>
                                                                    {{ $t('course.show.view') }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div v-if="isLoggedin && !episode.fullWatched && episode.progressPercentage > 0"
                                                            class="mx-2 -mt-2 bg-gray-200 rounded-full h-0.5 mb-4 dark:bg-gray-700">
                                                            <div class="bg-yellow-400 h-0.5 rounded-full"
                                                                :style="`width: ${episode.progressPercentage}%`"></div>
                                                        </div>
                                                    </div>
                                                    <!-- End Episode -->
                                                    <div v-if="section.quizzes && section.quizzes.length"
                                                        class="mt-2 space-y-2 border-t border-dashed border-gray-200 dark:border-gray-700 pt-3">
                                                        <QuizSectionRow v-for="quiz in section.quizzes" :key="quiz.uuid"
                                                            :quiz="quiz" :logged-in="isLoggedin"
                                                            :can-take-quiz="userCanSeeCourse" />
                                                    </div>
                                                </div>
                                            </DisclosurePanel>
                                        </transition>
                                    </Disclosure>
                                </div>
                            </div>
                        </div>
                        <CourseAttachmentsSection
                            :attachs="course?.attachs || []"
                            :can-access="userCanSeeCourse"
                            :heading="$t('course.show.attachments')"
                        />
                        <div v-if="courseQuizzes.length" id="quizzes-list"
                            class="bg-white dark:bg-gray-900 relative rounded-xl md:p-5 p-3 mb-8">
                            <h4
                                class="text-gray-900 dark:text-yellow-400 text-lg font-bold rtl:sm:text-right ltr:sm:text-left flex sm:justify-start justify-center items-center mb-6">
                                <i
                                    class="bg-gray-900 dark:bg-yellow-400 rtl:ml-1 ltr:mr-1 w-2 h-2 rounded-full sm:flex hidden"></i>
                                {{ $t('quiz.section.courseTitle') }}
                            </h4>

                            <div id="course-quizzes" class="mt-3">
                                <QuizSectionRow v-for="quiz in courseQuizzes" :key="quiz.uuid" :quiz="quiz"
                                    :logged-in="isLoggedin" :can-take-quiz="userCanSeeCourse" />
                            </div>
                        </div>
                        <div id="comments-list" class="mb-8">
                            <CommentsList v-if="course" :type="'course'" :id="course.id"></CommentsList>
                        </div>
                    </div>
                    <div class="xl:col-span-3 lg:col-span-4 lg:order-last order-first">
                        <div v-if="course && trailerSource" class="hidden md:block mb-5 rounded-xl overflow-hidden">
                            <VideoPlayer :source="trailerSource"
                                :title="`${$t('course.show.trailer')} - ${course.title}`" :poster="course.poster"
                                :is-logged-in="false" :stream-video-id="course.trailer_video_id || null"
                                :initial-watched-times="[]" :initial-full-watched="false" :autoplay="false"
                                :controls-config="{
                                    title: true,
                                    restart: false,
                                    play: true,
                                    rewind: false,
                                    fastForward: false,
                                    times: true,
                                    mute: true,
                                    volume: true,
                                    settings: true,
                                    segments: false,
                                    fullscreen: true,
                                    overlaidPlay: true
                                }" />
                        </div>
                        <CourseSidebar v-if="course" :course="course" :availability="courseAvailability"
                            :userCanSeeCourse="userCanSeeCourse"
                            :userCompletedCourse="userCompletedCourse" :certificateUuid="certificateUuid"
                            :ratings="course.ratings" :quizzes="allCourseQuizzes" />
                        <div
                            class="border border-gray-300 dark:border-opacity-0 mb-5 dark:shadow-white dark:bg-slate-900 border-opacity-60 rounded-xl py-7 px-5">
                            <div class="flex items-start mb-4">
                                <div class="text-gray-800 dark:text-white rtl:ml-2 ltr:mr-2">
                                    <svg width="23" height="22" viewBox="0 0 23 22" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3.7 10C3.7 12.0428 3.81037 13.6365 4.08778 14.8848C4.36343 16.1251 4.79459 16.9809 5.40685 17.5932C6.0191 18.2054 6.87493 18.6366 8.11522 18.9122C9.36346 19.1896 10.9572 19.3 13 19.3C15.0428 19.3 16.6365 19.1896 17.8848 18.9122C19.1251 18.6366 19.9809 18.2054 20.5931 17.5932C21.2054 16.9809 21.6366 16.1251 21.9122 14.8848C22.1896 13.6365 22.3 12.0428 22.3 10C22.3 7.95723 22.1896 6.36346 21.9122 5.11522C21.6366 3.87493 21.2054 3.01911 20.5931 2.40685C19.9809 1.7946 19.1251 1.36343 17.8848 1.08778C16.6365 0.810369 15.0428 0.700001 13 0.700001C10.9572 0.700001 9.36346 0.810369 8.11522 1.08778C6.87493 1.36343 6.0191 1.7946 5.40685 2.40685C4.79459 3.01911 4.36343 3.87493 4.08778 5.11522C3.81037 6.36346 3.7 7.95723 3.7 10Z"
                                            stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                        <path opacity="0.4" d="M11.3335 5.83331H14.6668" stroke="currentColor"
                                            stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M8.8335 10H17.1668" stroke="currentColor" stroke-width="1.4"
                                            stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path opacity="0.4" d="M11.3335 14.1667L14.6668 14.1667" stroke="currentColor"
                                            stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M5.46011 13.7404L6.22153 15.2615C6.29615 15.4109 6.44019 15.5144 6.60723 15.5384L8.31056 15.7836C8.7314 15.8443 8.89887 16.3544 8.5943 16.6466L7.36258 17.8302C7.24153 17.9465 7.18643 18.1139 7.21506 18.2782L7.50575 19.9491C7.57734 20.3624 7.1374 20.6778 6.76125 20.4822L5.23884 19.6928C5.08959 19.6153 4.91084 19.6153 4.76116 19.6928L3.23875 20.4822C2.8626 20.6778 2.42266 20.3624 2.49468 19.9491L2.78494 18.2782C2.81357 18.1139 2.75847 17.9465 2.63742 17.8302L1.4057 16.6466C1.10113 16.3544 1.2686 15.8443 1.68944 15.7836L3.39277 15.5384C3.55981 15.5144 3.70428 15.4109 3.77891 15.2615L4.53989 13.7404C4.72819 13.3643 5.27181 13.3643 5.46011 13.7404Z"
                                            fill="white" stroke="#FFA826" stroke-width="1.16667" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                    </svg>
                                </div>
                                <div>
                                    <span class="mb-4 text-gray-700 dark:text-white text-17 font-bold">{{
                                        $t('course.show.relatedContent')
                                    }}</span>
                                    <p class="font-medium dark:text-gray-400 text-[10px] text-gray-500">{{
                                        $t('course.show.relatedContentHint') }}</p>
                                </div>
                            </div>
                            <div v-if="relatedCourses" class="mb-8">
                                <div v-for="(related, index) in relatedCourses" :key="index"
                                    class="flex items-start bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-3 py-4 px-4">
                                    <div class="space-y-2 w-full">
                                        <div class="relative">
                                            <span
                                                class="w-1 h-full bg-yellow-400 dark:bg-opacity-70 rtl:rounded-l-md ltr:rounded-r-md rtl:-right-4 ltr:-left-4 absolute"></span>
                                            <router-link :to="{
                                                name: 'course.show',
                                                params: { courseSlug: related.slug },
                                            }"
                                                class="text-biscay-700 dark:text-white dark:hover:text-yellow-400 font-bold text-15 hover:text-yellow-400 transition duration-200">
                                                {{ related.title }}
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div
                                    class="bg-gray-100 bg-opacity-40 dark:bg-gray-800 dark:bg-opacity-50 p-4 mx-auto rounded-xl">
                                    <div class="flex items-center flex-col">
                                        <h6 class="text-sm font-semibold text-gray-400">{{
                                            $t('course.show.nothingToShow') }}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> 
        </div>
    </MasterPage>
</template>
<script setup>
definePageMeta({
  name: "course.show",
})

import MasterPage from "@/views/page/layouts/MasterPage.vue";
import CommentsList from "@/views/components/home/CommentsList.vue";
import CourseSidebar from "@/views/components/course/CourseSidebar.vue";
import CourseAvailabilityBanner from "@/views/components/course/CourseAvailabilityBanner.vue";
import InstallmentPurchaseBanner from "@/views/components/payment/InstallmentPurchaseBanner.vue";
import ExpandableDescription from "@/views/components/course/ExpandableDescription.vue";
import QuizSectionRow from "@/views/components/quiz/QuizSectionRow.vue";
import CourseAttachmentsSection from "@/views/components/course/CourseAttachmentsSection.vue";
import DiscountBadge from "@/views/components/price/DiscountBadge.vue";
import { initAccordions } from "flowbite";
import { ref, onMounted, onUpdated, onBeforeUnmount, computed, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
// import axios from "axios";
import axiosInstance from "@/store/axiosInstance";
import router from "@/routes/router";
import { useStore } from "@/composables/useStore";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import moment from "moment-jalaali";
moment().format("jYYYY/jM/jD");
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { convertToOrdinal } from "@/store/convertToOrdinal";
import VideoPlayer from "@/views/components/player/VideoPlayer.vue";
import config from "@/store/config";
import { useSEO, generateCourseSchema, generateBreadcrumbSchema } from "@/composables/useSEO";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import { cleanCourseTitle, sortCourseSections } from "@/utils/courseDisplay";
import { episodeShowRoute, episodeShowPath } from "@/utils/episodeRoute";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const displayCourseTitle = computed(() => cleanCourseTitle(course.value?.title, course.value?.status));
const route = useRoute();
const courseSlug = ref(route.params.courseSlug);
const course = ref(null);
const relatedCourses = ref(null);
const userCanSeeCourse = ref(false);
const userCompletedCourse = ref(false);
const certificateUuid = ref(false);
const courseSections = ref(null);
const sortedCourseSections = computed(() => sortCourseSections(courseSections.value || []));
const commentsCount = ref(0);
const likesCount = ref(0);
const userHasLiked = ref(false);

const { data: ssrCoursePayload } = await useAsyncData(
  () => `course-show-${route.params.courseSlug}`,
  async () => {
    try {
      const { data } = await axiosInstance.get("/course/" + route.params.courseSlug);
      return data;
    } catch {
      return null;
    }
  },
);
const bookmarksCount = ref(0);
const userHasBookmarked = ref(false);
const courseQuizzes = ref([]);
const allCourseQuizzes = ref([]);
const courseAvailability = ref(null);
const canDownload = ref(false);

function isEpisodeScheduleLocked(episode) {
    if (courseAvailability.value?.can_watch_videos === false) {
        return true;
    }
    if (isCourseArchived.value && !userCanSeeCourse.value) {
        return true;
    }
    return episode?.is_playable === false;
}

function isEpisodeLinkEnabled(episode) {
    if (isEpisodeScheduleLocked(episode)) {
        return false;
    }
    if (episode?.lock === 1 && !userCanSeeCourse.value) {
        return false;
    }
    return true;
}

const isCourseArchived = computed(() => {
    return courseAvailability.value?.is_archive === true
        || course.value?.status?.english_title === 'archive';
});

function episodeLockTitle(episode) {
    if (isCourseArchived.value && !userCanSeeCourse.value) {
        return courseAvailability.value?.message || t('course.show.archivedMessage');
    }
    if (courseAvailability.value?.can_watch_videos === false && courseAvailability.value?.message) {
        return courseAvailability.value.message;
    }
    return episode?.availability?.message || t('course.show.contentLocked');
}

function showSectionAvailabilityMessage(section) {
    if (courseAvailability.value?.can_watch_videos === false) {
        return false;
    }
    return section?.is_available === false && section?.availability?.message;
}

function courseStatusSlug() {
    return course.value?.status?.english_title || null;
}

function scheduleLockIconClass() {
    const slug = courseStatusSlug();
    if (slug === 'archive') return 'bg-slate-500 border-slate-500';
    if (slug === 'upcoming') return 'bg-sky-500 border-sky-500';
    return 'bg-amber-500 border-amber-500';
}

function scheduleAccentTextClass() {
    const slug = courseStatusSlug();
    if (slug === 'archive') return 'text-slate-600 dark:text-slate-400';
    if (slug === 'upcoming') return 'text-sky-600 dark:text-sky-400';
    return 'text-amber-600 dark:text-amber-400';
}

function scheduleAccentBarClass() {
    const slug = courseStatusSlug();
    if (slug === 'archive') return 'bg-slate-500';
    if (slug === 'upcoming') return 'bg-sky-500';
    return 'bg-amber-500';
}

function applyCoursePayload(data) {
            if (!data?.course) return false;
            course.value = data.course;
            courseSections.value = data.course.section;
            relatedCourses.value = data.relatedCourses;
            userCanSeeCourse.value = data.userCanSeeCourse;
            userCompletedCourse.value = data.userCompletedCourse;
            certificateUuid.value = data.certificateUuid;
            commentsCount.value = data.comments_count;
            likesCount.value = data.likes_count;
            userHasLiked.value = data.user_has_liked;
            bookmarksCount.value = data.bookmarks_count;
            userHasBookmarked.value = data.user_has_bookmarked;
            courseQuizzes.value = data.course_quizzes || [];
            allCourseQuizzes.value = data.quizzes || data.course_quizzes || [];
            courseAvailability.value = data.course_availability || data.course?.availability || null;
            canDownload.value = !!data.can_download;
            // Setup SEO
            const courseImage = course.value.poster
                ? (course.value.poster.startsWith('http') ? course.value.poster : `${process.env.VUE_APP_SITE_URL || 'https://zanburak.ir'}${course.value.poster}`)
                : null;

            const courseSchema = generateCourseSchema(course.value);
            // Build ItemList of episodes (cap to 12 items)
            const episodesList = (() => {
                const elements = []
                let pos = 1
                if (sortedCourseSections.value.length) {
                    sortedCourseSections.value.forEach(section => {
                        const eps = section?.episode || section?.episodes || section?.items || []
                        if (Array.isArray(eps)) {
                            eps.forEach(ep => {
                                if (!ep?.slug || elements.length >= 12) return
                                elements.push({
                                    '@type': 'ListItem',
                                    position: pos++,
                                    url: episodeShowPath(course.value.slug, ep.order),
                                    ...(ep?.title ? { name: ep.title } : {})
                                })
                            })
                        }
                    })
                }
                return elements.length > 0 ? {
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    itemListOrder: 'https://schema.org/ItemListOrderAscending',
                    numberOfItems: elements.length,
                    itemListElement: elements
                } : null
            })();
            const breadcrumbSchema = generateBreadcrumbSchema([
                { name: t('course.common.breadcrumbHome'), url: '/' },
                { name: t('course.common.breadcrumbCourses'), url: '/courses' },
                { name: course.value.title, url: `/course/${course.value.slug}` }
            ]);

            // Combine static and dynamic keywords
            const staticKeywords = [
                course.value.title,
                t('course.common.kwProgramming'),
                t('course.common.kwOnlineCourse'),
                course.value.teacher?.first_name + ' ' + course.value.teacher?.last_name,
                ...(course.value.category?.map(cat => cat.title) || [])
            ];
            const dynamicKeywords = course.value.meta_keywords
                ? course.value.meta_keywords.split(',').map(k => k.trim()).filter(k => k)
                : [];
            const allKeywords = [...staticKeywords, ...dynamicKeywords];

            useSEO({
                title: `${t('course.show.seo.titlePrefix')} ${course.value.title}`,
                description: course.value.short_description || course.value.description || t('course.show.seo.descriptionFallback', { title: course.value.title }),
                image: courseImage || undefined,
                url: `/course/${course.value.slug}`,
                type: 'article',
                keywords: allKeywords,
                publishedTime: course.value.created_at,
                modifiedTime: course.value.updated_at,
                articleAuthor: course.value.teacher ? `${course.value.teacher.first_name} ${course.value.teacher.last_name}` : '',
                articleSection: course.value.category?.[0]?.title || t('course.show.seo.articleSection'),
                articleTags: [
                    ...(course.value.category?.map(cat => cat.title) || []),
                    t('course.common.kwProgramming'),
                    t('course.common.kwOnlineCourse')
                ],
                rating: course.value.avgRating ? course.value.avgRating.toString() : '',
                reviewCount: course.value.reviews_count ? course.value.reviews_count.toString() : '',
                imageAlt: course.value.title,
                // See also: list episode URLs (when available)
                seeAlso: (() => {
                    const urls = [];
                    if (sortedCourseSections.value.length) {
                        sortedCourseSections.value.forEach(section => {
                            const eps = section?.episode || section?.episodes || section?.items || [];
                            if (Array.isArray(eps)) {
                                eps.forEach(ep => {
                                    if (ep?.order != null) urls.push(episodeShowPath(course.value.slug, ep.order));
                                });
                            }
                        });
                    }
                    return urls.slice(0, 12); // cap to reasonable number
                })(),
                // Twitter extras
                twitterLabel1: t('course.common.instructorLabel'),
                twitterData1: course.value.teacher ? `${course.value.teacher.first_name} ${course.value.teacher.last_name}` : '',
                twitterLabel2: t('course.show.seo.priceLabel'),
                twitterData2: (course.value.price !== undefined && course.value.price !== null) ? `${course.value.price} IRR` : t('course.show.free'),
                schema: [courseSchema, breadcrumbSchema, episodesList].filter(Boolean)
            });

            nextTick(() => { refreshScrollSpy(); });
            return true;
}

async function getCourse() {
    try {
        const { data } = await axiosInstance.get("/course/" + courseSlug.value);
        applyCoursePayload(data);
    } catch (error) {
        if (error.response?.status === 404) {
            router.push({ name: "NotFound" });
        }
        console.error(error.response?.statusText);
    }
}

if (ssrCoursePayload.value) {
    applyCoursePayload(ssrCoursePayload.value);
}

const isLoggedin = computed(() => store.state.auth.status.loggedIn);
const store = useStore();
const isCourseInCart = computed(() => {
    return store.getters["cart/isItemInCart"]('course', course.value.id);
});
const addToCartLoading = ref(false);

const addToCart = async (type, itemId) => {
    if (isCourseArchived.value && !userCanSeeCourse.value) {
        toast.warning(t('course.show.archivedMessage'), {
            theme: "colored",
            rtl: localStorage.getItem("direction") == "rtl",
        });
        return;
    }
    addToCartLoading.value = true;

    try {
        await store.dispatch("cart/addToCart", { type: type, itemId: itemId });
        addToCartLoading.value = false;
    } catch (error) {
        addToCartLoading.value = false;
        console.error("Error adding to cart:", error);
    }
};

const trailerSource = computed(() => {
    if (!course.value) return "";
    const processed = course.value.trailer_status === 'processed' || course.value.has_stream_trailer === true;
    if (processed && course.value.id) {
        return `${config.apiBaseUrl}/course/${course.value.id}/playlist`;
    }
    return course.value.trailer || "";
});

const likeLoading = ref(false);

const toggleLike = async () => {
    if (!isLoggedin.value) {
        toast.warning(t("course.show.loginToLike"), {
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
                likeable_id: course.value.id,
                likeable_type: "Course",
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
        toast.warning(t("course.show.loginToBookmark"), {
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
                bookmarkable_id: course.value.id,
                bookmarkable_type: "Course",
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

watch(
    () => route.params.courseSlug,
    () => {
        courseSlug.value = route.params.courseSlug;
        course.value = null;
        userCanSeeCourse.value = false;
    }
);
onUpdated(() => {
    getCourse();
});
function onDescExpandedChange() {
    setTimeout(refreshScrollSpy, 300);
}

// ScrollSpy state and behavior
const scrollSpy = ref(null);
const scrollSpyButtonRefs = ref({});
const activeSectionId = ref('desc');
const indicatorReady = ref(false);
const indicatorStyle = ref({
    width: '0px',
    left: '0px',
});
const baseScrollSpyItems = [
    { id: 'desc', labelKey: 'course.show.description' },
    { id: 'guarantee', labelKey: 'course.show.guarantee' },
    { id: 'episodes-list', labelKey: 'course.show.episodes' },
    { id: 'course-attachments', labelKey: 'course.show.attachments' },
    { id: 'quizzes-list', labelKey: 'course.show.quizzes' },
    { id: 'comments-list', labelKey: 'course.show.comments' },
];
const scrollSpyItems = computed(() =>
    baseScrollSpyItems.filter((item) => {
        if (item.id === 'quizzes-list') {
            return allCourseQuizzes.value.length > 0;
        }
        if (item.id === 'course-attachments') {
            return userCanSeeCourse.value && (course.value?.attachs || []).length > 0;
        }
        if (item.id === 'guarantee') {
            return course.value?.has_money_back_guarantee !== false;
        }
        return true;
    })
);

function episodeQuizTag() {
    if (!isLoggedin.value || userCanSeeCourse.value) {
        return 'router-link';
    }
    return 'span';
}

function episodeQuizBind(quiz) {
    if (!isLoggedin.value) {
        return { to: { name: 'login', query: { redirect: '/quiz/' + quiz.uuid } } };
    }
    if (userCanSeeCourse.value) {
        return { to: { name: 'quiz-intro', params: { uuid: quiz.uuid } } };
    }
    return {};
}

function setScrollSpyButtonRef(id, el) {
    if (el) {
        scrollSpyButtonRefs.value[id] = el;
    } else {
        delete scrollSpyButtonRefs.value[id];
    }
}

function updateScrollSpyIndicator() {
    const container = scrollSpy.value;
    const button = scrollSpyButtonRefs.value[activeSectionId.value];
    if (!container || !button) {
        indicatorReady.value = false;
        return;
    }

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    indicatorStyle.value = {
        width: `${buttonRect.width}px`,
        left: `${buttonRect.left - containerRect.left}px`,
    };
    indicatorReady.value = true;
}

function getOffsetTop(element) {
    const rect = element.getBoundingClientRect();
    return rect.top + window.scrollY;
}

function getScrollOffset() {
    const barHeight = scrollSpy.value ? scrollSpy.value.offsetHeight : 0;
    return barHeight + 8; // slight padding so section title is visible
}

function scrollToSection(id) {
    // set active immediately for better UX
    activeSectionId.value = id;
    const el = document.getElementById(id);
    if (!el) return;
    const y = getOffsetTop(el) - getScrollOffset();
    window.scrollTo({ top: y, behavior: 'smooth' });
}

// Stable active section computation based on scroll position
function updateActiveByScroll() {
    const topOffset = getScrollOffset();
    const scrollY = window.scrollY + topOffset + 4;
    const ids = scrollSpyItems.value.map((i) => i.id);
    let current = ids[0];
    for (const id of ids) {
        const el = document.getElementById(id);
        if (el && getOffsetTop(el) <= scrollY) current = id;
    }
    if (current !== activeSectionId.value) activeSectionId.value = current;
}

let scrollRaf = null;
function onScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        updateActiveByScroll();
    });
}

let intersectionObserver = null;
function setupIntersectionObserver() {
    const topOffset = getScrollOffset();
    const rootMargin = `-${topOffset + 8}px 0px -60% 0px`;
    intersectionObserver = new IntersectionObserver(() => {
        // On content/visibility changes, recompute based on scroll position for stability
        updateActiveByScroll();
    }, { root: null, rootMargin, threshold: [0, 0.25, 0.5, 0.75, 1] });

    for (const item of scrollSpyItems.value) {
        const el = document.getElementById(item.id);
        if (el) intersectionObserver.observe(el);
    }
}

function teardownIntersectionObserver() {
    if (intersectionObserver) {
        intersectionObserver.disconnect();
        intersectionObserver = null;
    }
}

function refreshScrollSpy() {
    teardownIntersectionObserver();
    setupIntersectionObserver();
    updateActiveByScroll();
    nextTick(() => updateScrollSpyIndicator());
}

watch(activeSectionId, () => {
    nextTick(() => updateScrollSpyIndicator());
});

watch([courseQuizzes, allCourseQuizzes], async () => {
    const ids = scrollSpyItems.value.map((item) => item.id);
    if (!ids.includes(activeSectionId.value)) {
        activeSectionId.value = ids[0] || 'desc';
    }
    await nextTick();
    refreshScrollSpy();
});

watch(course, async (val) => {
    if (val) {
        await nextTick();
        refreshScrollSpy();
    }
});

onMounted(async () => {
    initAccordions();
    await nextTick();
    refreshScrollSpy();
    window.addEventListener('resize', updateScrollSpyIndicator);
    window.addEventListener('scroll', onScroll, { passive: true });
    await getCourse();
    await nextTick();
    refreshScrollSpy();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScrollSpyIndicator);
    window.removeEventListener('scroll', onScroll);
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    teardownIntersectionObserver();
});
</script>
