<template>
    <MasterPage>
        <section v-if="loading" class="mx-auto max-w-screen-xl px-2">
            <div class="px-2 gap-16 mt-28 mb-24">
                <div class="grid gap-10 lg:px-10 lg:grid-cols-2 mb-20">
                    <div class="lg:order-first md:pl-8 lg:mt-0 sm:mt-40 mt-3 order-last">
                        <svg class="w-8 h-8 text-gray-500 mb-4" viewBox="0 0 33 42" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M33 0H6V9C6 23.9117 18.0883 36 33 36V36V0Z" fill="currentColor" fill-opacity="0.2">
                            </path>
                            <path d="M27 6H-7.00355e-07V15C-7.00355e-07 29.9117 12.0883 42 27 42V42V6Z"
                                fill="currentColor"></path>
                        </svg>
                        <div
                            class="mb-6 w-40 h-3 rounded-full animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700">
                        </div>

                        <div
                            class="mb-5 w-11/12 h-1 rounded-full animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700">
                        </div>
                        <div
                            class="mb-5 w-full h-1 rounded-full animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700">
                        </div>
                        <div
                            class="mb-5 w-11/12 h-1 rounded-full animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700">
                        </div>
                        <div
                            class="mb-10 w-9/12 h-1 rounded-full animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700">
                        </div>
                        <div class="flex items-center mt-auto gap-2 justify-center md:justify-start">
                            <div
                                class="w-40 h-9 rounded-lg animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700 me-2">
                            </div>
                            <div
                                class="w-32 h-9 rounded-lg animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700">
                            </div>
                        </div>
                    </div>
                    <div class="md:h-80 h-56 lg:pe-0 md:pe-20 sm:pl-10 relative">
                        <span
                            class="flex absolute bg-white dark:bg-gray-900 z-negative lg:-end-12 end-0 -top-12 sm:w-64 w-52 md:h-[400px] h-80 rounded-es-[35rem]">
                        </span>
                        <span
                            class="flex absolute border-2 border-white dark:border-gray-900 z-negative lg:-end-0 end-6 -top-0 sm:w-64 w-52 md:h-[400px] h-80 rounded-es-[35rem]">
                        </span>
                        <span class="absolute z-negative -top-7 lg:-end-7 end-5">
                            <svg width="67" height="67" viewBox="0 0 67 67" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="2.39778" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                            </svg>
                        </span>
                        <div
                            class="flex items-center justify-center animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700 z-10 relative w-full h-full rounded-xl overflow-hidden">
                            <svg class="w-5 h-5 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path
                                    d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                        </div>
                        <span class="absolute xl:flex hidden z-0 -start-7 -bottom-7">
                            <svg width="67" height="67" viewBox="0 0 67 67" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="2.39778" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                            </svg>
                        </span>
                    </div>
                </div>

                <div class="flex flex-wrap relative items-center md:px-11">
                    <b class="text-gray-500 dark:text-white font-semibold md:me-7 md:mb-0 mb-5 text-lg"> {{ $t('path.show.roadmap_label') }} </b>
                    <div
                        class="border-yellow-500 border-opacity-20 border-2 lg:px-8 px-5 py-7 md:w-max w-full rounded-3xl rounded-se-[4rem] rounded-ee-none relative">
                        <ul class="flex flex-col md:flex-row items-center whitespace-nowrap">
                            <li
                                class="md:w-max sm:w-1/2 lg:me-14 md:me-7 w-full md:mb-0 mb-8 flex items-center z-10 justify-start font-semibold text-gray-500 dark:text-gray-300">
                                {{ $t('path.show.prerequisites_steps_label') }}
                                <span
                                    class="w-9 pt-1 h-9 relative rounded-full animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700 shadow-sm flex items-center justify-center ms-2">
                                    <i
                                        class="flex w-9 h-9 -z-10 bg-amber-400 top-0.5 start-1 bg-opacity-10 rounded-full absolute"></i>
                                </span>
                            </li>
                            <li
                                class="md:w-max sm:w-1/2 w-full lg:me-14 md:me-7 md:mb-0 mb-8 flex items-center z-10 justify-start font-semibold text-gray-500 dark:text-gray-300">
                                {{ $t('path.show.main_steps_label') }}
                                <span
                                    class="w-9 h-9 relative rounded-full animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700 shadow-sm flex items-center justify-center ms-2">
                                    <i
                                        class="flex w-9 h-9 -z-10 bg-blue-700 top-0.5 start-1 bg-opacity-10 rounded-full absolute"></i>
                                </span>
                            </li>
                            <li
                                class="md:w-max sm:w-1/2 w-full flex items-center font-semibold z-10 justify-start text-gray-500 dark:text-gray-300">
                                {{ $t('path.show.next_steps_label') }}
                                <span
                                    class="w-9 h-9 relative rounded-full animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700 shadow-sm flex items-center justify-center ms-2">
                                    <i
                                        class="flex w-9 h-9 -z-10 bg-green-500 top-0.5 start-1 bg-opacity-10 rounded-full absolute"></i>
                                </span>
                            </li>
                        </ul>
                        <span class="absolute -bottom-2 -end-2">
                            <svg width="26" height="32" viewBox="0 0 26 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.00390625 32L20.5753 32L20.5753 25.1429C20.5753 13.7816 11.3652 4.57143 0.00390865 4.57143V4.57143L0.00390625 32Z"
                                    fill="#BFD5FB" fill-opacity="0.2"></path>
                                <path
                                    d="M4.57422 27.4287L25.1456 27.4287L25.1456 20.5716C25.1456 9.21028 15.9355 0.000140137 4.57422 0.000139143V0.000139143L4.57422 27.4287Z"
                                    fill="#BFD5FB"></path>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <div id="steps" class="md:mx-16 lg:mx-32">
                <div class="mb-14 bg-white dark:bg-gray-900 rounded-xl p-3 md:p-5 lg:p-7">
                    <div class="relative flex items-center w-max mx-auto mb-6">
                        <h3 class="ms-2 md:text-4xl text-2xl dark:text-white text-gray-700 font-bold">{{ $t('path.show.what_is_learning_path') }}
                        </h3>
                        <svg class="stroke-current absolute mt-11 text-yellow-300" viewBox="0 0 410 18"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 6.4c16.8 16.8 380.8-11.2 397.6 5.602" stroke-width="12" fill="none"
                                fill-rule="evenodd" stroke-linecap="round"></path>
                        </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 md:text-lg font-light">{{ $t('path.show.learning_path_desc') }}</p>
                </div>
            </div>

            <div class="py-7 lg:px-7 px-4 bg-gray-50/20 dark:bg-gray-600/10 shadow rounded-2xl mb-10">
                <h3
                    class="w-max bg-gray-100 dark:bg-gray-800 pb-2 ps-2 pe-5 -mt-10 rounded-lg text-xl flex items-center font-bold mb-7 text-gray-700 dark:text-white">
                    <span class="me-3 -mt-1">
                        <svg class="w-5 h-5 text-gray-400" viewBox="0 0 33 42" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M33 0H6V9C6 23.9117 18.0883 36 33 36V36V0Z" fill="currentColor" fill-opacity="0.2">
                            </path>
                            <path d="M27 6H-7.00355e-07V15C-7.00355e-07 29.9117 12.0883 42 27 42V42V6Z"
                                fill="currentColor"></path>
                        </svg>
                    </span>
                    <div
                        class="w-28 h-2 rounded-full animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700">
                    </div>
                </h3>
                <div class="grid lg:gap-9 gap-3 lg:grid-cols-3 sm:grid-cols-2">
                    <CourseCard4Loading v-for="i in 3" :key="i" />
                </div>
            </div>
        </section>
        <section v-else class="mx-auto max-w-screen-xl px-2">
            <div class="px-2 gap-16 mt-28 mb-24">
                <div class="grid gap-10 lg:px-10 lg:grid-cols-2 mb-20">
                    <div class="lg:order-first md:pl-8 lg:mt-0 sm:mt-40 mt-3 order-last">
                        <svg class="w-8 h-8 text-amber-500 mb-4" viewBox="0 0 33 42" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M33 0H6V9C6 23.9117 18.0883 36 33 36V36V0Z" fill="currentColor" fill-opacity="0.2">
                            </path>
                            <path d="M27 6H-7.00355e-07V15C-7.00355e-07 29.9117 12.0883 42 27 42V42V6Z"
                                fill="currentColor"></path>
                        </svg>
                        <h1
                            class="font-extrabold md:leading-68 leading-10 text-4xl lg:text-5xl text-gray-800 dark:text-white">
                            {{ $t('path.show.learning_title', { title: path.title }) }}</h1>
                        <p class="md:text-lg leading-relaxed text-gray-500 dark:text-gray-300 mt-4 mb-9 line-clamp-5">{{
                            path.short_description }}</p>
                        <div class="flex items-center mt-auto gap-2 justify-center md:justify-start">
                            <a href="#steps"
                                class="whitespace-nowrap h-10 rounded-lg flex items-center justify-center px-4 text-sm font-semibold focus:outline-none focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 text-gray-800 bg-amber-400 hover:shadow-md shadow-amber-400 hover:opacity-90">
                                {{ $t('path.show.view_steps') }}
                                <svg class="ms-1 w-4 h-4" viewBox="0 0 23 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.4"
                                        d="M16.5073 6.34863L21.0752 5.94466C22.1003 5.94466 22.9315 6.7839 22.9315 7.81901C22.9315 8.85412 22.1003 9.69336 21.0752 9.69336L16.5073 9.28938C15.7031 9.28938 15.0511 8.63105 15.0511 7.81901C15.0511 7.00561 15.7031 6.34863 16.5073 6.34863"
                                        fill="currentColor"></path>
                                    <path
                                        d="M1.16786 6.42292C1.23926 6.35083 1.50598 6.04614 1.75653 5.79314C3.21811 4.20852 7.03437 1.61734 9.03073 0.824345C9.33382 0.697847 10.1003 0.428528 10.5112 0.409485C10.9032 0.409485 11.2776 0.500618 11.6346 0.680164C12.0805 0.931801 12.4361 1.32898 12.6328 1.79689C12.7581 2.12061 12.9548 3.09315 12.9548 3.11084C13.1501 4.17315 13.2565 5.9006 13.2565 7.81032C13.2565 9.62754 13.1501 11.2843 12.9898 12.3643C12.9723 12.3833 12.7756 13.5898 12.5614 14.0033C12.1694 14.7596 11.4029 15.2275 10.5826 15.2275H10.5112C9.97638 15.2098 8.85292 14.7405 8.85292 14.7242C6.96297 13.9312 3.23697 11.4652 1.73902 9.82613C1.73902 9.82613 1.31604 9.40447 1.13284 9.14195C0.84726 8.76381 0.70447 8.29591 0.70447 7.828C0.70447 7.30568 0.864772 6.82009 1.16786 6.42292"
                                        fill="currentColor"></path>
                                </svg>
                            </a>
                            <router-link to=""
                                class="whitespace-nowrap h-10 rounded-lg flex items-center justify-center px-4 text-sm font-semibold focus:outline-none focus:ring-2 ring-gray-300 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 text-gray-800 bg-gray-300 hover:shadow-md shadow-gray-400">
                                {{ $t('path.common.path_guide') }}
                                <svg class="ms-1 w-5 h-5" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M14.9703 3.3437C13.0166 2.88543 10.9834 2.88543 9.02975 3.3437C6.20842 4.00549 4.0055 6.20841 3.3437 9.02975C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C4.0055 17.7916 6.20842 19.9945 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C17.7916 19.9945 19.9945 17.7916 20.6563 14.9703C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20842 17.7916 4.00549 14.9703 3.3437ZM8.55377 9.12812C8.55377 8.8109 8.81093 8.55374 9.12815 8.55374H12.9573C13.2745 8.55374 13.5317 8.8109 13.5317 9.12812C13.5317 9.44533 13.2745 9.70249 12.9573 9.70249H9.12815C8.81093 9.70249 8.55377 9.44533 8.55377 9.12812ZM8.55377 12C8.55377 11.6828 8.81093 11.4256 9.12815 11.4256H14.8719C15.1891 11.4256 15.4462 11.6828 15.4462 12C15.4462 12.3172 15.1891 12.5743 14.8719 12.5743H9.12815C8.81093 12.5743 8.55377 12.3172 8.55377 12ZM8.55377 14.8718C8.55377 14.5546 8.81093 14.2975 9.12815 14.2975H12C12.3172 14.2975 12.5744 14.5546 12.5744 14.8718C12.5744 15.189 12.3172 15.4462 12 15.4462H9.12815C8.81093 15.4462 8.55377 15.189 8.55377 14.8718Z"
                                        fill="currentColor"></path>
                                </svg>
                            </router-link>
                        </div>
                    </div>
                    <div class="md:h-80 h-56 lg:pe-0 md:pe-20 sm:pl-10 relative">
                        <span
                            class="flex absolute bg-white dark:bg-gray-900 z-negative lg:-end-12 end-0 -top-12 sm:w-64 w-52 md:h-[400px] h-80 rounded-es-[35rem]">
                        </span>
                        <span
                            class="flex absolute border-2 border-white dark:border-gray-900 z-negative lg:-end-0 end-6 -top-0 sm:w-64 w-52 md:h-[400px] h-80 rounded-es-[35rem]">
                        </span>
                        <span class="absolute z-negative -top-7 lg:-end-7 end-5">
                            <svg width="67" height="67" viewBox="0 0 67 67" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="2.39778" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                            </svg>
                        </span>
                        <div class="z-10 relative bg-white dark:bg-gray-800 w-full h-full rounded-xl overflow-hidden">
                            <!-- <div class="relative overflow-hidden rounded-xl z-10 w-full h-full">
                                <div poster="https://static.roocket.ir/images/cover/2021/12/1/eLFObUXNm5Ibpp6SOAm9CvVf5SUbs0jBVPgsOoWV.jpg" preload="metadata" class="video-js w-full h-full overflow-hidden rounded-3xl vjs-paused vjs-controls-enabled vjs-workinghover vjs-v7 vjs-user-active my-video-dimensions" id="my-video" tabindex="-1" role="region" lang="fa" translate="no" aria-label="Video Player">
                                    <video id="my-video_html5_api" class="vjs-tech" preload="metadata" poster="https://static.roocket.ir/images/cover/2021/12/1/eLFObUXNm5Ibpp6SOAm9CvVf5SUbs0jBVPgsOoWV.jpg" tabindex="-1" role="application" src="/video/coming-soon.mp4">
                                        <source src="/video/coming-soon.mp4" type="video/mp4" />
                                    </video>
                                    
                                </div>
                            </div> -->
                            <!-- Video Player for trailer -->
                            <div v-if="path.trailer" class="w-full h-full">
                                <VideoPlayer
                                    :source="path.trailer"
                                    :title="$t('path.show.trailer_title', { title: path.title })"
                                    :poster="path.poster"
                                    :is-logged-in="false"
                                    :stream-video-id="null"
                                    :initial-watched-times="[]"
                                    :initial-full-watched="false"
                                    :autoplay="false"
                                />
                            </div>
                            <SeoImage
                                v-else
                                :src="path.poster"
                                :alt="path.title || ''"
                                :priority="true"
                                :width="960"
                                :height="540"
                                sizes-preset="hero"
                                img-class="object-cover w-full h-full rounded-xl"
                            />
                        </div>

                        <span class="absolute xl:flex hidden z-0 -start-7 -bottom-7">
                            <svg width="67" height="67" viewBox="0 0 67 67" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="2.39778" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="2.39778" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="17.9486" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="33.4993" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="49.0501" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="2.39778" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="17.9491" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="33.4998" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="49.0511" r="2.39778" fill="#CBD1DB"></circle>
                                <circle cx="64.6009" cy="64.6019" r="2.39778" fill="#CBD1DB"></circle>
                            </svg>
                        </span>
                    </div>
                </div>

                <div class="flex flex-wrap relative items-center md:px-11">
                    <b class="text-gray-500 dark:text-white font-semibold md:me-7 md:mb-0 mb-5 text-lg"> {{ $t('path.show.roadmap_label') }} </b>
                    <div
                        class="border-yellow-500 border-opacity-20 border-2 lg:px-8 px-5 py-7 md:w-max w-full rounded-3xl rounded-se-[4rem] rounded-ee-none relative">
                        <ul class="flex flex-col md:flex-row items-center whitespace-nowrap">
                            <li
                                class="md:w-max sm:w-1/2 lg:me-14 md:me-7 w-full md:mb-0 mb-8 flex items-center z-10 justify-start font-semibold text-gray-500 dark:text-gray-300">
                                {{ $t('path.show.prerequisites_steps_label') }}
                                <span
                                    class="w-9 pt-1 h-9 relative rounded-full bg-white text-amber-400 shadow-sm flex items-center justify-center ms-2">
                                    {{ path.prerequisites ? path.prerequisites.length : 0 }}
                                    <i
                                        class="flex w-9 h-9 -z-10 bg-amber-400 top-0.5 start-1 bg-opacity-10 rounded-full absolute"></i>
                                </span>
                            </li>
                            <li
                                class="md:w-max sm:w-1/2 w-full lg:me-14 md:me-7 md:mb-0 mb-8 flex items-center z-10 justify-start font-semibold text-gray-500 dark:text-gray-300">
                                {{ $t('path.show.main_steps_label') }}
                                <span
                                    class="w-9 h-9 relative rounded-full bg-white text-blue-700 shadow-sm flex items-center justify-center ms-2">
                                    {{ path.courses ? path.courses.length : 0 }}
                                    <i
                                        class="flex w-9 h-9 -z-10 bg-blue-700 top-0.5 start-1 bg-opacity-10 rounded-full absolute"></i>
                                </span>
                            </li>
                            <li
                                class="md:w-max sm:w-1/2 w-full flex items-center font-semibold z-10 justify-start text-gray-500 dark:text-gray-300">
                                {{ $t('path.show.next_steps_label') }}
                                <span
                                    class="w-9 h-9 relative rounded-full bg-white text-green-500 shadow-sm flex items-center justify-center ms-2">
                                    {{ path.nextSteps ? path.nextSteps.length : 0 }}
                                    <i
                                        class="flex w-9 h-9 -z-10 bg-green-500 top-0.5 start-1 bg-opacity-10 rounded-full absolute"></i>
                                </span>
                            </li>
                        </ul>
                        <span class="absolute -bottom-2 -end-2">
                            <svg width="26" height="32" viewBox="0 0 26 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.00390625 32L20.5753 32L20.5753 25.1429C20.5753 13.7816 11.3652 4.57143 0.00390865 4.57143V4.57143L0.00390625 32Z"
                                    fill="#BFD5FB" fill-opacity="0.2"></path>
                                <path
                                    d="M4.57422 27.4287L25.1456 27.4287L25.1456 20.5716C25.1456 9.21028 15.9355 0.000140137 4.57422 0.000139143V0.000139143L4.57422 27.4287Z"
                                    fill="#BFD5FB"></path>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <div id="steps" class="md:mx-16 lg:mx-32">
                <div class="mb-14 bg-white dark:bg-gray-900 rounded-xl p-3 md:p-5 lg:p-7">
                    <div class="relative flex items-center w-max mx-auto mb-6">
                        <h3 class="ms-2 md:text-4xl text-2xl dark:text-white text-gray-700 font-bold">{{ $t('path.show.what_is_learning_path') }}
                        </h3>
                        <svg class="stroke-current absolute mt-11 text-yellow-300" viewBox="0 0 410 18"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 6.4c16.8 16.8 380.8-11.2 397.6 5.602" stroke-width="12" fill="none"
                                fill-rule="evenodd" stroke-linecap="round"></path>
                        </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 md:text-lg font-light">{{ $t('path.show.learning_path_desc') }}</p>
                </div>
            </div>
            <div v-if="path.prerequisites && path.prerequisites.length > 0"
                class="pt-6 pb-9 lg:px-7 px-4 rounded-2xl border-2 border-white dark:border-gray-900 mb-14">
                <h3
                    class="w-max bg-gray-100 dark:bg-gray-800 ps-2 pe-5 -mt-10 text-xl flex items-center dark:text-white font-bold mb-7 text-gray-700">
                    <span class="me-3 -mt-1">
                        <svg class="w-5 h-5 text-amber-500" viewBox="0 0 33 42" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M33 0H6V9C6 23.9117 18.0883 36 33 36V36V0Z" fill="currentColor" fill-opacity="0.2">
                            </path>
                            <path d="M27 6H-7.00355e-07V15C-7.00355e-07 29.9117 12.0883 42 27 42V42V6Z"
                                fill="currentColor"></path>
                        </svg>
                    </span>
                    {{ $t('path.show.prerequisites_title') }}
                </h3>
                <div class="grid lg:gap-7 gap-3 lg:grid-cols-3 sm:grid-cols-2">
                    <div v-for="(prerequisite, index) in path.prerequisites" :key="index"
                        class="flex items-center justify-between sm:flex-row flex-col bg-white dark:bg-gray-900 lg:px-4 px-2 py-3 shadow-sm rounded-lg">
                        <div class="flex items-center sm:flex-row flex-col sm:mb-0 mb-5 sm:w-8/12">
                            <router-link :to="{ name: 'path.show', params: { pathSlug: prerequisite.slug } }"
                                class="xl:w-12 overflow-hidden xl:h-12 sm:w-9 sm:h-9 w-11 h-11 rounded-md sm:me-2 sm:mb-0 mb-3 flex items-center justify-center flex-shrink-0">
                                <SeoImage
                                    :src="prerequisite.icon"
                                    :alt="prerequisite.title || ''"
                                    :width="48"
                                    :height="48"
                                    sizes-preset="icon"
                                    img-class="w-full h-full object-cover rounded-lg hover:scale-110 transition duration-200 transform"
                                />
                            </router-link>
                            <b
                                class="xl:text-base lg:text-base sm:text-start text-center font-bold dark:hover:text-yellow-500 text-gray-800 dark:text-white hover:text-yellow-500 duration-200 transition">
                                <router-link :to="{ name: 'path.show', params: { pathSlug: prerequisite.slug } }">{{ $t('path.common.learn', { title: prerequisite.title }) }}</router-link>
                            </b>
                        </div>
                        <div
                            class="text-[0.65rem] flex items-center text-gray-400 h-8 border dark:text-gray-300 dark:border-gray-300 rounded px-1.5 dark:border-opacity-20">
                            <span class="me-2">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle opacity="0.15" cx="11.8001" cy="12.0674" r="7.19887"
                                        transform="rotate(-0.0437108 11.8001 12.0674)" fill="#3B82F6"></circle>
                                    <path
                                        d="M3.10384 6.46972C6.98187 8.71901 7.46684 8.71901 11.3449 6.46972C15.2229 4.22043 15.2229 4.22043 11.3449 1.97114C7.46684 -0.278139 6.98187 -0.278145 3.10384 1.97114C1.16482 3.09579 0.195312 3.65811 0.195312 4.22043V9.28133C0.195312 9.59189 0.447073 9.84365 0.757634 9.84365C1.0682 9.84365 1.31996 9.59189 1.31996 9.28133L1.31996 5.61131C1.31996 5.52219 1.41878 5.46825 1.49426 5.51563C1.9241 5.78547 2.46063 6.09666 3.10384 6.46972Z"
                                        fill="#3B82F6"></path>
                                    <path
                                        d="M3.10384 7.03208C6.98187 9.28137 7.46684 9.28137 11.3449 7.03208L11.5661 6.90375C11.7416 6.80184 11.9629 6.9136 11.9758 7.11618C11.9953 7.4223 12.0041 7.76751 12.0041 8.1567C12.0041 10.9683 10.8794 11.5306 7.20502 11.5306C3.28481 11.5306 2.4446 10.9683 2.4446 8.1567C2.4446 7.7677 2.45294 7.42263 2.47174 7.11662C2.48422 6.91359 2.70593 6.80118 2.88185 6.90329L3.10384 7.03208Z"
                                        fill="#3B82F6"></path>
                                </svg>
                            </span>
                            {{ $t('path.common.includes_courses', { count: prerequisite.courses ? prerequisite.courses.length : 0 }) }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="path.courses && path.courses.length > 0"
                class="py-7 lg:px-7 px-4 bg-gray-50/20 dark:bg-gray-600/10 shadow rounded-2xl mb-20">
                <h3
                    class="w-max bg-gray-100 dark:bg-gray-800 pb-2 ps-2 pe-5 -mt-10 rounded-lg text-xl flex items-center font-bold mb-7 text-gray-700 dark:text-white">
                    <span class="me-3 -mt-1">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-500" viewBox="0 0 33 42" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M33 0H6V9C6 23.9117 18.0883 36 33 36V36V0Z" fill="currentColor" fill-opacity="0.2">
                            </path>
                            <path d="M27 6H-7.00355e-07V15C-7.00355e-07 29.9117 12.0883 42 27 42V42V6Z"
                                fill="currentColor"></path>
                        </svg>
                    </span>
                    {{ $t('path.show.main_steps_title') }}
                </h3>
                <div class="grid lg:gap-9 gap-3 lg:grid-cols-3 sm:grid-cols-2">
                    <CourseCard4 v-for="(course, index) in path.courses" :key="index" :course="course" />
                </div>
            </div>

            <!-- <div v-if="path.available_courses && path.available_courses.length > 0" -->
            <div class="pt-6 pb-9 lg:px-7 px-2 rounded-2xl border-2 border-white dark:border-gray-900 mb-20">
                <h3
                    class="w-max bg-gray-100 dark:bg-gray-800 pb-2 ps-2 pe-5 -mt-10 rounded-lg text-xl flex items-center font-bold mb-7 text-gray-700 dark:text-white">
                    <span class="me-3 -mt-1">
                        <svg class="w-5 h-5 text-yellow-500 dark:text-yellow-400" viewBox="0 0 33 42" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M33 0H6V9C6 23.9117 18.0883 36 33 36V36V0Z" fill="currentColor" fill-opacity="0.2">
                            </path>
                            <path d="M27 6H-7.00355e-07V15C-7.00355e-07 29.9117 12.0883 42 27 42V42V6Z"
                                fill="currentColor"></path>
                        </svg>
                    </span>
                    {{ $t('path.show.purchasable_courses') }}
                </h3>
                <div class="grid grid-cols-12 gap-5 md:gap-8 font-anjoman">
                    <div v-if="path.courses && path.courses.filter(course => course.type !== 'free').length > 0" class="col-span-12 md:col-span-7 space-y-1">
                        <div v-for="(course, index) in path.courses.filter(course => course.type !== 'free')"
                            :key="index" :class="{ 'opacity-60': path.user_courseIds.includes(course.id) || path.user_courseIds_inCart.includes(course.id) }"
                            class="relative gap-3 bg-white dark:bg-gray-900 first:rounded-t-xl ps-3 p-2 md:p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div
                                class="w-1 h-[50%] md:h-[80%] bg-gray-700 dark:bg-gray-200 rounded-e-lg absolute start-0">
                            </div>
                            <div class="flex items-center">
                                <router-link :to="{ name: 'course.show', params: { courseSlug: course.slug } }" class="w-20 h-14 rounded-md overflow-hidden shrink-0">
                                    <SeoImage
                                        :src="course.poster"
                                        :alt="course.title || ''"
                                        :width="80"
                                        :height="56"
                                        sizes-preset="thumb"
                                        img-class="w-full h-full bg-gray-400 object-cover hover:scale-105 duration-100"
                                    />
                                </router-link>
                                <div class="space-y-1 ms-2">
                                    <router-link :to="{ name: 'course.show', params: { courseSlug: course.slug } }">
                                    <h4
                                        class="w-max line-clamp-1 text-gray-700 dark:text-gray-100 text-sm font-semibold">
                                        {{ course.title }}</h4></router-link>
                                    <router-link :to="{ name: 'profile-page', params: { username: course.teacher.username } }" class="flex items-center">
                                        <div class="w-5 h-5 rounded-full overflow-hidden shrink-0">
                                            <SeoImage
                                                :src="course.teacher.profile_pic"
                                                :alt="course.teacher.username || 'مدرس'"
                                                :width="20"
                                                :height="20"
                                                sizes-preset="avatar"
                                                img-class="w-full h-full bg-gray-400 object-cover hover:scale-105 duration-100"
                                            />
                                        </div>
                                        <p class="ms-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">{{
                                            course.teacher.first_name + ' ' + course.teacher.last_name }}</p>
                                    </router-link>
                                </div>
                            </div>
                            <div class="flex md:flex-col items-center justify-between md:justify-end">
                                <div
                                    class="order-1 md:order-0 w-full flex items-center justify-end text-end font-semibold text-gray-700 dark:text-gray-100">
                                    {{ course.price.toLocaleString() }}
                                    <svg class="ms-1" width="12" height="12" viewBox="0 0 14 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path class="text-current"
                                            d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C11.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z"
                                            fill="currentColor"></path>
                                    </svg>
                                </div>
                                <div class="order-0 md:order-1">
                                    <p v-if="path.user_courseIds.includes(course.id)"
                                        class=" whitespace-nowrap rounded-md h-5 px-2 font-YekanBakh text-xs font-light text-gray-800 bg-gray-100 flex items-center justify-center w-max">
                                        {{ $t('path.show.already_purchased') }}</p>
                                        <p v-if="path.user_courseIds_inCart.includes(course.id)"
                                        class=" whitespace-nowrap rounded-md h-5 px-2 font-YekanBakh text-xs font-light text-gray-800 bg-gray-100 flex items-center justify-center w-max">
                                         {{ $t('path.show.in_cart') }}</p>
                                </div>
                            </div>
                        </div>
                        <div
                            class="relative gap-1 flex flex-col md:flex-row md:items-center md:justify-between py-6 px-4 bg-yellow-400 text-black rounded-b-xl mt-1">
                            <div class="w-1 h-[60%] bg-black rounded-e-lg absolute start-0"></div>
                            <p class="font-semibold text-base">{{ $t('path.show.payable_amount') }}</p>
                            <div class="flex items-center font-semibold justify-end ms-2">
                                <div v-if="path.total_price > 0" class="flex items-center gap-2">
                                    <div class="flex items-center line-through text-sm opacity-60">
                                        {{ path.total_price.toLocaleString() }}
                                        <svg class="ms-1" width="13" height="13" viewBox="0 0 14 16" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path class="text-current"
                                                d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C11.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </div>
                                    <div class="flex items-center">
                                        {{ path.final_price.toLocaleString() }}
                                        <svg class="ms-1" width="13" height="13" viewBox="0 0 14 16" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path class="text-current"
                                                d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C11.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div v-else class="text-sm">{{ $t('path.show.nothing_to_buy') }}</div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="col-span-12 md:col-span-7 flex flex-col justify-center items-center">
                        <div class="flex flex-col items-center justify-center px-3 py-16 md:px-5 rounded-ss-[4rem] rounded-ee-[4rem] border-2 border-white dark:border-gray-900">
                            <svg class="w-12 h-12 mx-auto text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.5"
                                d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z"
                                fill="currentColor"></path>
                            <path
                                d="M8.39747 17.4466C8.64413 17.7794 9.11385 17.8492 9.44661 17.6025C10.175 17.0627 11.0541 16.75 12 16.75C12.9459 16.75 13.825 17.0627 14.5534 17.6025C14.8862 17.8492 15.3559 17.7794 15.6025 17.4466C15.8492 17.1138 15.7794 16.6441 15.4466 16.3975C14.4742 15.6767 13.285 15.25 12 15.25C10.715 15.25 9.5258 15.6767 8.55339 16.3975C8.22062 16.6441 8.15082 17.1138 8.39747 17.4466Z"
                                fill="currentColor"></path>
                            <path
                                d="M15 12C15.5523 12 16 11.3284 16 10.5C16 9.67157 15.5523 9 15 9C14.4477 9 14 9.67157 14 10.5C14 11.3284 14.4477 12 15 12Z"
                                fill="currentColor"></path>
                            <path
                                d="M9 12C9.55228 12 10 11.3284 10 10.5C10 9.67157 9.55228 9 9 9C8.44772 9 8 9.67157 8 10.5C8 11.3284 8.44772 12 9 12Z"
                                fill="currentColor"></path>
                        </svg>
                        <p class="mt-5 text-sm font-semibold text-gray-600 dark:text-gray-300">{{ $t('path.show.no_purchasable_courses') }}</p>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-5">
                        <div
                            class="w-full lg:inline-block flex flex-col items-center bg-gray-50 dark:bg-gray-900/60 rounded-xl py-4 p-2 md:p-4">
                            <svg class="w-20 h-20 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22 8.5C22 12.09 19.09 15 15.5 15C15.33 15 15.15 14.99 14.98 14.98C14.73 11.81 12.19 9.27 9.01999 9.02C9.00999 8.85 9 8.67 9 8.5C9 4.91 11.91 2 15.5 2C19.09 2 22 4.91 22 8.5Z"
                                    fill="currentColor"></path>
                                <path opacity="0.4"
                                    d="M15 15.5C15 19.09 12.09 22 8.5 22C4.91 22 2 19.09 2 15.5C2 11.91 4.91 9 8.5 9C8.67 9 8.84999 9.01 9.01999 9.02C12.19 9.27 14.73 11.81 14.98 14.98C14.99 15.15 15 15.33 15 15.5Z"
                                    fill="currentColor"></path>
                                <path
                                    d="M7.62 14.62L8.5 13L9.38 14.62L11 15.5L9.38 16.38L8.5 18L7.62 16.38L6 15.5L7.62 14.62Z"
                                    fill="currentColor"></path>
                            </svg>
                            <h4
                                class="text-gray-700 dark:text-gray-100 font-bold text-xl mb-2 md:text-start text-center">
                                {{ $t('path.show.start_path', { title: path.title }) }}</h4>
                            <p
                                class="text-gray-500 dark:text-gray-400 leading-8 font-normal text-sm mb-7 md:text-start text-center">
                                {{ $t('path.show.bundle_benefits', { title: path.title }) }}</p>
                            <InstallmentPurchaseBanner
                                v-if="path.final_price > 0 && path.allows_installment"
                                class="mb-5 w-full"
                                :allows-installment="path.allows_installment"
                            />
                            <div class="mt-6 md:mb-6">
                                <ul class="flex flex-wrap md:flex-row flex-col md:w-auto w-full">
                                    <li class="flex items-center md:w-1/2 w-full md:justify-start justify-center mb-5">
                                        <svg class="me-4 w-7 h-7" viewBox="0 0 33 33" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.015625" width="32.0691" height="32.0691" rx="4.37306"
                                                class="fill-yellow-400"></rect>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M24.7044 16.4986C24.7474 16.3176 24.7689 16.2271 24.7839 16.0941C24.7988 15.9612 24.7978 15.8516 24.7958 15.6324C24.7319 8.77564 23.106 7.28857 16.0508 7.28857C8.99565 7.28857 7.36967 8.77564 7.30585 15.6324C7.30381 15.8516 7.30279 15.9612 7.31773 16.0941C7.33267 16.227 7.35416 16.3176 7.39715 16.4986C8.6945 21.9613 13.3007 23.9986 15.2111 24.62C15.5406 24.7272 15.7054 24.7808 16.0508 24.7808C16.3962 24.7808 16.561 24.7272 16.8905 24.62C18.8009 23.9986 23.4071 21.9613 24.7044 16.4986ZM23.338 15.6461C23.3058 12.1867 22.845 10.7126 22.0442 9.95353C21.2182 9.1705 19.6276 8.7523 16.0508 8.7523C12.474 8.7523 10.8834 9.1705 10.0574 9.95353C9.25663 10.7126 8.7958 12.1867 8.76361 15.6461C8.76138 15.8857 8.76324 15.9022 8.76634 15.9298C8.76856 15.9496 8.77056 15.9624 8.77513 15.9848C8.78205 16.0187 8.79201 16.0613 8.81522 16.1591C9.93095 20.857 13.8971 22.6539 15.6604 23.2275C15.7471 23.2557 15.8017 23.2734 15.849 23.2876C15.8928 23.3007 15.9154 23.3061 15.9281 23.3089L15.9294 23.3091C15.9403 23.3115 15.966 23.3171 16.0508 23.3171C16.1356 23.3171 16.1613 23.3115 16.1722 23.3091L16.1735 23.3089C16.1862 23.3061 16.2088 23.3007 16.2526 23.2876C16.2999 23.2734 16.3545 23.2557 16.4412 23.2275C18.2045 22.6539 22.1707 20.857 23.2864 16.1591C23.3096 16.0613 23.3196 16.0187 23.3265 15.9848C23.331 15.9624 23.333 15.9498 23.3352 15.93C23.3383 15.9024 23.3402 15.8857 23.338 15.6461Z"
                                                fill="black"></path>
                                            <path
                                                d="M19.4815 14.3929C19.7661 14.1071 19.7661 13.6437 19.4815 13.3579C19.1968 13.0721 18.7353 13.0721 18.4506 13.3579L15.3215 16.4997L14.3791 15.5535C14.0944 15.2677 13.6329 15.2677 13.3483 15.5535C13.0636 15.8393 13.0636 16.3027 13.3483 16.5885L14.8061 18.0522C15.0907 18.3381 15.5523 18.3381 15.8369 18.0522L19.4815 14.3929Z"
                                                fill="black"></path>
                                        </svg>
                                        <span class="text-gray-500 dark:text-gray-300 font-semibold text-sm">{{ $t('path.show.discount_percent', { percent: path.discount_percent }) }}</span>
                                    </li>
                                    <li class="flex items-center md:w-1/2 w-full md:justify-start justify-center mb-5">
                                        <svg class="me-4 w-7 h-7" viewBox="0 0 33 33" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.015625" width="32.0691" height="32.0691" rx="4.37306"
                                                class="fill-yellow-400"></rect>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M24.7044 16.4986C24.7474 16.3176 24.7689 16.2271 24.7839 16.0941C24.7988 15.9612 24.7978 15.8516 24.7958 15.6324C24.7319 8.77564 23.106 7.28857 16.0508 7.28857C8.99565 7.28857 7.36967 8.77564 7.30585 15.6324C7.30381 15.8516 7.30279 15.9612 7.31773 16.0941C7.33267 16.227 7.35416 16.3176 7.39715 16.4986C8.6945 21.9613 13.3007 23.9986 15.2111 24.62C15.5406 24.7272 15.7054 24.7808 16.0508 24.7808C16.3962 24.7808 16.561 24.7272 16.8905 24.62C18.8009 23.9986 23.4071 21.9613 24.7044 16.4986ZM23.338 15.6461C23.3058 12.1867 22.845 10.7126 22.0442 9.95353C21.2182 9.1705 19.6276 8.7523 16.0508 8.7523C12.474 8.7523 10.8834 9.1705 10.0574 9.95353C9.25663 10.7126 8.7958 12.1867 8.76361 15.6461C8.76138 15.8857 8.76324 15.9022 8.76634 15.9298C8.76856 15.9496 8.77056 15.9624 8.77513 15.9848C8.78205 16.0187 8.79201 16.0613 8.81522 16.1591C9.93095 20.857 13.8971 22.6539 15.6604 23.2275C15.7471 23.2557 15.8017 23.2734 15.849 23.2876C15.8928 23.3007 15.9154 23.3061 15.9281 23.3089L15.9294 23.3091C15.9403 23.3115 15.966 23.3171 16.0508 23.3171C16.1356 23.3171 16.1613 23.3115 16.1722 23.3091L16.1735 23.3089C16.1862 23.3061 16.2088 23.3007 16.2526 23.2876C16.2999 23.2734 16.3545 23.2557 16.4412 23.2275C18.2045 22.6539 22.1707 20.857 23.2864 16.1591C23.3096 16.0613 23.3196 16.0187 23.3265 15.9848C23.331 15.9624 23.333 15.9498 23.3352 15.93C23.3383 15.9024 23.3402 15.8857 23.338 15.6461Z"
                                                fill="black"></path>
                                            <path
                                                d="M19.4815 14.3929C19.7661 14.1071 19.7661 13.6437 19.4815 13.3579C19.1968 13.0721 18.7353 13.0721 18.4506 13.3579L15.3215 16.4997L14.3791 15.5535C14.0944 15.2677 13.6329 15.2677 13.3483 15.5535C13.0636 15.8393 13.0636 16.3027 13.3483 16.5885L14.8061 18.0522C15.0907 18.3381 15.5523 18.3381 15.8369 18.0522L19.4815 14.3929Z"
                                                fill="black"></path>
                                        </svg>
                                        <span class="text-gray-500 dark:text-gray-300 font-semibold text-sm">{{ $t('path.show.money_back_guarantee') }}</span>
                                    </li>
                                    <li class="flex items-center md:w-1/2 w-full md:justify-start justify-center mb-5">
                                        <svg class="me-4 w-7 h-7" viewBox="0 0 33 33" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.015625" width="32.0691" height="32.0691" rx="4.37306"
                                                class="fill-yellow-400"></rect>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M24.7044 16.4986C24.7474 16.3176 24.7689 16.2271 24.7839 16.0941C24.7988 15.9612 24.7978 15.8516 24.7958 15.6324C24.7319 8.77564 23.106 7.28857 16.0508 7.28857C8.99565 7.28857 7.36967 8.77564 7.30585 15.6324C7.30381 15.8516 7.30279 15.9612 7.31773 16.0941C7.33267 16.227 7.35416 16.3176 7.39715 16.4986C8.6945 21.9613 13.3007 23.9986 15.2111 24.62C15.5406 24.7272 15.7054 24.7808 16.0508 24.7808C16.3962 24.7808 16.561 24.7272 16.8905 24.62C18.8009 23.9986 23.4071 21.9613 24.7044 16.4986ZM23.338 15.6461C23.3058 12.1867 22.845 10.7126 22.0442 9.95353C21.2182 9.1705 19.6276 8.7523 16.0508 8.7523C12.474 8.7523 10.8834 9.1705 10.0574 9.95353C9.25663 10.7126 8.7958 12.1867 8.76361 15.6461C8.76138 15.8857 8.76324 15.9022 8.76634 15.9298C8.76856 15.9496 8.77056 15.9624 8.77513 15.9848C8.78205 16.0187 8.79201 16.0613 8.81522 16.1591C9.93095 20.857 13.8971 22.6539 15.6604 23.2275C15.7471 23.2557 15.8017 23.2734 15.849 23.2876C15.8928 23.3007 15.9154 23.3061 15.9281 23.3089L15.9294 23.3091C15.9403 23.3115 15.966 23.3171 16.0508 23.3171C16.1356 23.3171 16.1613 23.3115 16.1722 23.3091L16.1735 23.3089C16.1862 23.3061 16.2088 23.3007 16.2526 23.2876C16.2999 23.2734 16.3545 23.2557 16.4412 23.2275C18.2045 22.6539 22.1707 20.857 23.2864 16.1591C23.3096 16.0613 23.3196 16.0187 23.3265 15.9848C23.331 15.9624 23.333 15.9498 23.3352 15.93C23.3383 15.9024 23.3402 15.8857 23.338 15.6461Z"
                                                fill="black"></path>
                                            <path
                                                d="M19.4815 14.3929C19.7661 14.1071 19.7661 13.6437 19.4815 13.3579C19.1968 13.0721 18.7353 13.0721 18.4506 13.3579L15.3215 16.4997L14.3791 15.5535C14.0944 15.2677 13.6329 15.2677 13.3483 15.5535C13.0636 15.8393 13.0636 16.3027 13.3483 16.5885L14.8061 18.0522C15.0907 18.3381 15.5523 18.3381 15.8369 18.0522L19.4815 14.3929Z"
                                                fill="black"></path>
                                        </svg>
                                        <span class="text-gray-500 dark:text-gray-300 font-semibold text-sm">{{ $t('path.show.permanent_access') }}</span>
                                    </li>
                                    <li class="flex items-center md:w-1/2 w-full md:justify-start justify-center mb-5">
                                        <svg class="me-4 w-7 h-7" viewBox="0 0 33 33" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.015625" width="32.0691" height="32.0691" rx="4.37306"
                                                class="fill-yellow-400"></rect>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M24.7044 16.4986C24.7474 16.3176 24.7689 16.2271 24.7839 16.0941C24.7988 15.9612 24.7978 15.8516 24.7958 15.6324C24.7319 8.77564 23.106 7.28857 16.0508 7.28857C8.99565 7.28857 7.36967 8.77564 7.30585 15.6324C7.30381 15.8516 7.30279 15.9612 7.31773 16.0941C7.33267 16.227 7.35416 16.3176 7.39715 16.4986C8.6945 21.9613 13.3007 23.9986 15.2111 24.62C15.5406 24.7272 15.7054 24.7808 16.0508 24.7808C16.3962 24.7808 16.561 24.7272 16.8905 24.62C18.8009 23.9986 23.4071 21.9613 24.7044 16.4986ZM23.338 15.6461C23.3058 12.1867 22.845 10.7126 22.0442 9.95353C21.2182 9.1705 19.6276 8.7523 16.0508 8.7523C12.474 8.7523 10.8834 9.1705 10.0574 9.95353C9.25663 10.7126 8.7958 12.1867 8.76361 15.6461C8.76138 15.8857 8.76324 15.9022 8.76634 15.9298C8.76856 15.9496 8.77056 15.9624 8.77513 15.9848C8.78205 16.0187 8.79201 16.0613 8.81522 16.1591C9.93095 20.857 13.8971 22.6539 15.6604 23.2275C15.7471 23.2557 15.8017 23.2734 15.849 23.2876C15.8928 23.3007 15.9154 23.3061 15.9281 23.3089L15.9294 23.3091C15.9403 23.3115 15.966 23.3171 16.0508 23.3171C16.1356 23.3171 16.1613 23.3115 16.1722 23.3091L16.1735 23.3089C16.1862 23.3061 16.2088 23.3007 16.2526 23.2876C16.2999 23.2734 16.3545 23.2557 16.4412 23.2275C18.2045 22.6539 22.1707 20.857 23.2864 16.1591C23.3096 16.0613 23.3196 16.0187 23.3265 15.9848C23.331 15.9624 23.333 15.9498 23.3352 15.93C23.3383 15.9024 23.3402 15.8857 23.338 15.6461Z"
                                                fill="black"></path>
                                            <path
                                                d="M19.4815 14.3929C19.7661 14.1071 19.7661 13.6437 19.4815 13.3579C19.1968 13.0721 18.7353 13.0721 18.4506 13.3579L15.3215 16.4997L14.3791 15.5535C14.0944 15.2677 13.6329 15.2677 13.3483 15.5535C13.0636 15.8393 13.0636 16.3027 13.3483 16.5885L14.8061 18.0522C15.0907 18.3381 15.5523 18.3381 15.8369 18.0522L19.4815 14.3929Z"
                                                fill="black"></path>
                                        </svg>
                                        <span class="text-gray-500 dark:text-gray-300 font-semibold text-sm">{{ $t('path.show.always_support') }}</span>
                                    </li>
                                </ul>
                            </div>

                            <div v-if="loggedIn">
                                <button v-if="!isPathInCart" @click="addToCart('path', path.id)"
                                    :disabled="addToCartLoading || path.total_price === 0"
                                    class="disabled:opacity-30 group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-black px-6 font-medium text-gray-50 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]">
                                    <span v-if="!addToCartLoading" class="flex items-center text-sm font-semibold">
                                        {{ $t('path.show.buy_path_courses') }}
                                        <svg class="ms-1 mb-1" width="23" height="19" viewBox="0 0 23 19" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill="currentColor"
                                                d="M4.73678 9.95638C10.9561 13.5636 11.7339 13.5637 17.9532 9.95638C24.1726 6.3491 24.1726 6.3491 17.9532 2.74183C11.7339 -0.865436 10.9561 -0.865446 4.73678 2.74183C1.62711 4.54547 0.0722656 5.44729 0.0722656 6.34911V14.4655C0.0722656 14.9635 0.476023 15.3673 0.974084 15.3673C1.47214 15.3673 1.8759 14.9635 1.8759 14.4655L1.8759 8.57971C1.8759 8.43679 2.03439 8.35027 2.15544 8.42626C2.84479 8.85901 3.70524 9.35808 4.73678 9.95638Z">
                                            </path>
                                            <path fill="currentColor"
                                                d="M4.73678 10.8583C10.9561 14.4655 11.7339 14.4655 17.9532 10.8583L18.308 10.6524C18.5895 10.489 18.9445 10.6682 18.9652 10.9931C18.9965 11.4841 19.0104 12.0377 19.0104 12.6618C19.0104 17.1709 17.2068 18.0728 11.314 18.0728C5.02702 18.0728 3.67954 17.1709 3.67954 12.6618C3.67954 12.038 3.69291 11.4846 3.72307 10.9938C3.74307 10.6682 4.09864 10.4879 4.38077 10.6517L4.73678 10.8583Z">
                                            </path>
                                        </svg>
                                    </span>
                                    <svg v-else class="w-6 h-6" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
                                        <circle class="stroke-current opacity-30" cx="50" cy="50" r="20" fill="none"
                                            stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                                            stroke-dasharray="200, 300"></circle>
                                        <circle class="stroke-current" cx="50" cy="50" r="20" fill="none"
                                            stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                                            stroke-dasharray="100, 200">
                                            <animateTransform attributeName="transform" attributeType="XML"
                                                type="rotate" from="0 50 50" to="360 50 50" dur="2.5s"
                                                repeatCount="indefinite">
                                            </animateTransform>
                                            <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s"
                                                repeatCount="indefinite"></animate>
                                            <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200"
                                                dur="1.25s" repeatCount="indefinite"></animate>
                                        </circle>
                                    </svg>
                                </button>
                                <router-link v-else :to="{ name: 'cart' }"
                                    class="group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-neutral-950 py-1 ps-6 pe-14 font-medium text-neutral-50"><span
                                        class="z-10 pe-2">{{ $t('path.show.finalize_purchase') }}</span>
                                    <div
                                        class="absolute end-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-neutral-700/60 transition-[width] group-hover:w-[calc(100%-8px)]">
                                        <div class="me-3.5 flex items-center justify-center">
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="h-5 w-5 text-neutral-50 rtl:rotate-180">
                                                <path
                                                    d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                                                    fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                            <div v-else>
                                <router-link :to="{ name: 'login' }"
                                    class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-black px-6 font-medium text-gray-50 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]">
                                    <span class="flex items-center text-sm font-semibold">
                                        {{ $t('path.show.login_to_buy') }}
                                        <svg class="ms-1 w-6 h-6 rtl:rotate-180" viewBox="0 0 22 23" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.4"
                                                d="M6.67065 6.4847C6.67065 4.27199 8.53019 2.47095 10.8157 2.47095H15.3587C17.6387 2.47095 19.4935 4.26748 19.4935 6.47567V16.5109C19.4935 18.7246 17.6349 20.5265 15.3494 20.5265H10.8064C8.52646 20.5265 6.67065 18.7291 6.67065 16.52V15.6714V6.4847Z"
                                                fill="currentColor"></path>
                                            <path
                                                d="M14.5621 11.0056L11.8827 8.37941C11.6058 8.10858 11.1602 8.10858 10.8841 8.38122C10.6091 8.65386 10.61 9.09351 10.886 9.36434L12.3531 10.8025H3.04688C2.65717 10.8025 2.34082 11.1139 2.34082 11.4985C2.34082 11.8822 2.65717 12.1927 3.04688 12.1927H12.3531L10.886 13.6318C10.61 13.9026 10.6091 14.3423 10.8841 14.6149C11.0226 14.7512 11.2033 14.8198 11.3848 14.8198C11.5645 14.8198 11.7452 14.7512 11.8827 14.6167L14.5621 11.9905C14.695 11.8596 14.7702 11.6827 14.7702 11.4985C14.7702 11.3134 14.695 11.1365 14.5621 11.0056Z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </span>
                                </router-link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div v-if="path.nextSteps && path.nextSteps.length > 0"
                class="pt-6 pb-9 lg:px-7 px-4 rounded-2xl border-2 border-white dark:border-gray-900 mb-20">
                <h3
                    class="w-max bg-gray-100 dark:bg-gray-800 ps-2 pe-5 -mt-10 text-xl flex items-center dark:text-white font-bold mb-7 text-gray-700">
                    <span class="me-3 -mt-1">
                        <svg class="w-5 h-5 text-green-500" viewBox="0 0 33 42" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M33 0H6V9C6 23.9117 18.0883 36 33 36V36V0Z" fill="currentColor" fill-opacity="0.2">
                            </path>
                            <path d="M27 6H-7.00355e-07V15C-7.00355e-07 29.9117 12.0883 42 27 42V42V6Z"
                                fill="currentColor"></path>
                        </svg>
                    </span>
                    {{ $t('path.show.next_steps_title') }}
                </h3>
                <div class="grid lg:gap-7 gap-3 lg:grid-cols-3 sm:grid-cols-2">
                    <div v-for="(nextStep, index) in path.nextSteps" :key="index"
                        class="flex items-center justify-between sm:flex-row flex-col bg-white dark:bg-gray-900 lg:px-4 px-2 py-3 shadow-sm rounded-lg">
                        <div class="flex items-center sm:flex-row flex-col sm:mb-0 mb-5 sm:w-8/12">
                            <router-link :to="{ name: 'path.show', params: { pathSlug: nextStep.slug } }"
                                class="xl:w-12 overflow-hidden xl:h-12 sm:w-9 sm:h-9 w-11 h-11 rounded-md sm:me-2 sm:mb-0 mb-3 flex items-center justify-center flex-shrink-0">
                                <SeoImage
                                    src="https://static.roocket.ir/images/cover/2024/10/9/4VEIfSCImpkaUtAgv0GNS8tAJ2oCAevvIwtMTlD5.png"
                                    alt=""
                                    :width="48"
                                    :height="48"
                                    sizes-preset="icon"
                                    :auto-webp="false"
                                    img-class="w-full h-full object-cover rounded-lg hover:scale-110 transition duration-200 transform"
                                />
                            </router-link>
                            <b
                                class="xl:text-base lg:text-base sm:text-start text-center font-bold dark:hover:text-yellow-500 text-gray-800 dark:text-white hover:text-yellow-500 duration-200 transition">
                                <router-link :to="{ name: 'path.show', params: { pathSlug: nextStep.slug } }">{{ $t('path.common.learn', { title: nextStep.title }) }}</router-link>
                            </b>
                        </div>
                        <div
                            class="text-[0.65rem] flex items-center text-gray-400 h-8 border dark:text-gray-300 dark:border-gray-300 rounded px-1.5 dark:border-opacity-20">
                            <span class="me-2">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle opacity="0.15" cx="11.8001" cy="12.0674" r="7.19887"
                                        transform="rotate(-0.0437108 11.8001 12.0674)" fill="#3B82F6"></circle>
                                    <path
                                        d="M3.10384 6.46972C6.98187 8.71901 7.46684 8.71901 11.3449 6.46972C15.2229 4.22043 15.2229 4.22043 11.3449 1.97114C7.46684 -0.278139 6.98187 -0.278145 3.10384 1.97114C1.16482 3.09579 0.195312 3.65811 0.195312 4.22043V9.28133C0.195312 9.59189 0.447073 9.84365 0.757634 9.84365C1.0682 9.84365 1.31996 9.59189 1.31996 9.28133L1.31996 5.61131C1.31996 5.52219 1.41878 5.46825 1.49426 5.51563C1.9241 5.78547 2.46063 6.09666 3.10384 6.46972Z"
                                        fill="#3B82F6"></path>
                                    <path
                                        d="M3.10384 7.03208C6.98187 9.28137 7.46684 9.28137 11.3449 7.03208L11.5661 6.90375C11.7416 6.80184 11.9629 6.9136 11.9758 7.11618C11.9953 7.4223 12.0041 7.76751 12.0041 8.1567C12.0041 10.9683 10.8794 11.5306 7.20502 11.5306C3.28481 11.5306 2.4446 10.9683 2.4446 8.1567C2.4446 7.7677 2.45294 7.42263 2.47174 7.11662C2.48422 6.91359 2.70593 6.80118 2.88185 6.90329L3.10384 7.03208Z"
                                        fill="#3B82F6"></path>
                                </svg>
                            </span>
                            {{ $t('path.common.includes_courses', { count: nextStep.courses ? nextStep.courses.length : 0 }) }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="path.description"
                class="md:ms-20 lg:ms-32 relative p-3 md:p-5 lg:p-7 border-2 border-white dark:border-gray-900 rounded-xl mb-20">
                <div class="-mt-11 md:-mt-14 w-max flex items-center bg-gray-100 dark:bg-gray-800 p-3">
                    <svg class="w-5 h-5 text-orange-400" viewBox="0 0 33 42" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M33 0H6V9C6 23.9117 18.0883 36 33 36V36V0Z" fill="currentColor" fill-opacity="0.2">
                        </path>
                        <path d="M27 6H-7.00355e-07V15C-7.00355e-07 29.9117 12.0883 42 27 42V42V6Z" fill="currentColor">
                        </path>
                    </svg>
                    <h3 class="lg:xl sm:text-2xl text-lg font-bold px-3 text-gray-700 dark:bg-dark-890 dark:text-white">
                        {{ $t('path.show.path_description_title') }}</h3>
                </div>
                <p :class="expandDescription ? 'h-max' : 'max-h-72'"
                    class="mb-5 overflow-hidden transition-all duration-300 text-gray-500 dark:text-gray-400 font-medium leading-8">
                    <MarkdownRenderer class="" startClass="desc" :source="path.description" />
                </p>
                <div class="absolute bottom-0 -mb-7 flex items-center h-12">
                    <div class="px-5 mx-auto bg-gray-100 dark:bg-gray-800">
                        <button @click.prevent="expandDescription = !expandDescription"
                            class="z-10 flex items-center justify-center w-32 h-8 text-sm font-medium rounded-md m-auto bg-yellow-400 text-black hover:bg-opacity-95 focus:ring-2 ring-yellow-400 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800">{{ $t('path.show.view_more') }}</button>
                    </div>
                </div>
            </div>
            <div v-if="path.faqs && path.faqs.length > 0"
                class="md:ms-20 lg:ms-32 p-3 md:p-5 lg:p-7 border-2 border-white dark:border-gray-900 rounded-xl mb-16">
                <div class="-mt-11 md:-mt-14 w-max flex items-center bg-gray-100 dark:bg-gray-800 p-3">
                    <svg class="w-5 h-5 text-orange-400" viewBox="0 0 33 42" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M33 0H6V9C6 23.9117 18.0883 36 33 36V36V0Z" fill="currentColor" fill-opacity="0.2">
                        </path>
                        <path d="M27 6H-7.00355e-07V15C-7.00355e-07 29.9117 12.0883 42 27 42V42V6Z" fill="currentColor">
                        </path>
                    </svg>
                    <h3 class="lg:xl sm:text-2xl text-lg font-bold px-3 text-gray-700 dark:bg-dark-890 dark:text-white">
                        {{ $t('nav.faq') }}</h3>
                </div>
                <Disclosure v-slot="{ open }" as="div" v-for="(faq, index) in path.faqs" :key="index"
                    class="mb-5 last:mb-0">
                    <DisclosureButton
                        class="flex items-center justify-between w-full p-3 font-medium rounded-xl focus:ring-0 dark:focus:ring-0 bg-white dark:bg-slate-900"
                        :class="[open ? 'text-gray-900 dark:text-amber-400' : 'text-gray-600 dark:text-gray-200']">
                        <div class="flex items-center">
                            <svg class="w-6 h-6 md:w-9 md:h-9 me-2 text-current flex-shrink-0" viewBox="0 0 24 24"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.58584 14.3415 10.232 13.883 10.704C13.7907 10.7989 13.7027 10.8869 13.6187 10.9708C13.4029 11.1864 13.2138 11.3753 13.0479 11.5885C12.8289 11.8699 12.75 12.0768 12.75 12.25V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V12.25C11.25 11.5948 11.555 11.0644 11.8642 10.6672C12.0929 10.3733 12.3804 10.0863 12.6138 9.85346C12.6842 9.78321 12.7496 9.71789 12.807 9.65877C13.0046 9.45543 13.125 9.18004 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                                    fill="currentColor"></path>
                            </svg>
                            <span class="text-start font-semibold">{{ faq.question }}</span>
                        </div>
                        <svg class="ms-2 ltr:rotate-180 flex-shrink-0"
                            :class="open && '-rotate-90 transform transition duration-300'" width="21" height="15"
                            viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" opacity="0.4"
                                d="M12.4789 4.53947L15.8693 4.23962C16.6302 4.23962 17.2471 4.86253 17.2471 5.63081C17.2471 6.3991 16.6302 7.022 15.8693 7.022L12.4789 6.72216C11.882 6.72216 11.3981 6.23353 11.3981 5.63081C11.3981 5.02709 11.882 4.53947 12.4789 4.53947">
                            </path>
                            <path fill="currentColor"
                                d="M1.09392 4.5946C1.14691 4.5411 1.34488 4.31495 1.53085 4.12717C2.61567 2.95102 5.44819 1.02779 6.92994 0.439206C7.1549 0.345316 7.7238 0.145421 8.02875 0.131287C8.3197 0.131287 8.59765 0.198928 8.86261 0.332191C9.19355 0.518962 9.45751 0.813757 9.60348 1.16105C9.69647 1.40133 9.84244 2.12317 9.84244 2.1363C9.98742 2.92477 10.0664 4.20693 10.0664 5.62437C10.0664 6.97315 9.98742 8.20281 9.86844 9.00441C9.85544 9.01855 9.70947 9.91404 9.55049 10.2209C9.25954 10.7823 8.69064 11.1296 8.08174 11.1296H8.02875C7.63182 11.1164 6.79796 10.7681 6.79796 10.756C5.3952 10.1674 2.62966 8.33708 1.51785 7.12055C1.51785 7.12055 1.2039 6.80758 1.06793 6.61274C0.855964 6.33208 0.749982 5.98478 0.749982 5.63749C0.749982 5.24981 0.868961 4.8894 1.09392 4.5946">
                            </path>
                        </svg>
                    </DisclosureButton>
                    <transition enter-active-class="transition duration-300 ease-out"
                        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-300 ease-out"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0">
                        <DisclosurePanel>
                            <div
                                class="mt-2 ms-5 md:ms-10 p-2 md:p-3 rounded-xl text-base leading-8 text-gray-600 dark:text-white bg-white/75 dark:bg-gray-900">
                                <MarkdownRenderer class="" startClass="faqs" :source="faq.answer" />
                            </div>
                        </DisclosurePanel>
                    </transition>
                </Disclosure>
            </div>
            <div id="comments-list"
                class="md:ms-20 lg:ms-32 border-2 border-white dark:border-gray-900 rounded-xl md:p-5 p-3 mb-8">
                <CommentsList v-if="path && path.id" :type="'path'" :id="path.id"></CommentsList>
            </div>
        </section>
    </MasterPage>
</template>

<script>
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import CourseCard4 from "@/views/components/course/CourseCard4.vue";
import CourseCard4Loading from "@/views/components/course/CourseCard4Loading.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import CommentsList from "@/views/components/home/CommentsList.vue";
import VideoPlayer from "@/views/components/player/VideoPlayer.vue";
import InstallmentPurchaseBanner from "@/views/components/payment/InstallmentPurchaseBanner.vue";
import axiosInstance from "@/store/axiosInstance";
import { useSEO, generatePathSchema, generateBreadcrumbSchema } from "@/composables/useSEO";
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
    components: {
        MasterPage,
        CourseCard4,
        CourseCard4Loading,
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
        MarkdownRenderer,
        CommentsList,
        VideoPlayer,
        InstallmentPurchaseBanner,
        SeoImage,
    },
    data() {
        return {
            loading: false,
            pathSlug: this.$route.params.pathSlug,
            path: {},
            expandDescription: false,
            addToCartLoading: false,
        };
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },

        isPathInCart() {
            return this.$store.getters["cart/isItemInCart"]("path", this.path.id);
        },
    },
    watch: {
        "$route.params.pathSlug": function (newSlug) {
            this.pathSlug = newSlug;
            this.path = {};
            this.getPathDetails();
        },
    },
    methods: {
        async addToCart(type, itemId) {
            this.addToCartLoading = true;
            try {
                await this.$store.dispatch("cart/addToCart", { type, itemId });
            } catch (error) {
                console.error("Error adding to cart:", error);
            } finally {
                this.addToCartLoading = false;
            }
        },
        async getPathDetails() {
            this.loading = true;
            await axiosInstance
                .get(`/path/${this.pathSlug}`)
                .then(
                    (response) => {
                        this.path = response.data.path;
                        
                        // Setup SEO
                        const pathImage = this.path.poster 
                            ? (this.path.poster.startsWith('http') ? this.path.poster : `${process.env.VUE_APP_SITE_URL || 'https://zanburak.ir'}${this.path.poster}`)
                            : null;
                        
                        const pathSchema = generatePathSchema(this.path);
                        // Build ItemList of courses (cap to 12 items)
                        const coursesList = (() => {
                            const elements = []
                            const base = (process.env.VUE_APP_SITE_URL || 'https://zanburak.ir')
                            if (Array.isArray(this.path.courses)) {
                                this.path.courses.slice(0, 12).forEach((c, idx) => {
                                    if (!c?.slug) return
                                    elements.push({
                                        '@type': 'ListItem',
                                        position: idx + 1,
                                        url: `${base}/course/${c.slug}`,
                                        ...(c?.title ? { name: c.title } : {})
                                    })
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
                            { name: this.$t('path.show.breadcrumb_home'), url: '/' },
                            { name: this.$t('path.common.educational_paths'), url: '/paths' },
                            { name: this.path.title, url: `/path/${this.path.slug}` }
                        ]);
                        
                        // Combine static and dynamic keywords
                        const staticKeywords = [
                            this.path.title,
                            this.$t('path.common.roadmap'),
                            this.$t('path.common.learning_path'),
                            this.$t('path.common.programming_education'),
                            'roadmap'
                        ];
                        const dynamicKeywords = this.path.meta_keywords 
                            ? this.path.meta_keywords.split(',').map(k => k.trim()).filter(k => k)
                            : [];
                        const allKeywords = [...staticKeywords, ...dynamicKeywords];

                        useSEO({
                            title: this.$t('path.show.seo.title', { title: this.path.title }),
                            description: this.path.short_description || this.path.description || this.$t('path.show.seo.description', { title: this.path.title }),
                            image: pathImage || undefined,
                            url: `/path/${this.path.slug}`,
                            type: 'article',
                            keywords: allKeywords,
                            articleSection: this.$t('path.common.educational_paths'),
                            articleTags: [
                                this.path.title,
                                this.$t('path.common.roadmap'),
                                this.$t('path.common.learning_path'),
                                this.$t('path.common.programming_education')
                            ],
                            publishedTime: this.path.created_at,
                            modifiedTime: this.path.updated_at,
                            seeAlso: (() => {
                                const base = (process.env.VUE_APP_SITE_URL || 'https://zanburak.ir');
                                if (Array.isArray(this.path.courses)) {
                                    return this.path.courses
                                        .filter(c => c?.slug)
                                        .map(c => `${base}/course/${c.slug}`)
                                        .slice(0, 12);
                                }
                                return [];
                            })(),
                            twitterLabel1: this.$t('path.show.seo.twitter_label_courses'),
                            twitterData1: Array.isArray(this.path.courses) ? `${this.path.courses.length}` : '',
                            imageAlt: this.$t('path.show.seo.image_alt', { title: this.path.title }),
                            schema: [pathSchema, breadcrumbSchema, coursesList].filter(Boolean)
                        });
                    },
                    (error) => {
                        console.error(error.response.status);
                        if (error.response.status === 404) {
                            this.$route.push({ name: "NotFound" });
                        }
                        console.error(error.response.statusText);
                    }
                )
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        document.title = this.pathSlug;
        this.getPathDetails();
    },
    created() { },
};
</script>

<style>
.h_iframe-aparat_embed_frame {
    position: relative;
}

.h_iframe-aparat_embed_frame .ratio {
    display: block;
    width: 100%;
    height: auto;
}

.h_iframe-aparat_embed_frame iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
