<template>
    <div class="py-4">
        <div class="comment-root">
            <div v-if="!hideTitle || (!hideAddButton && isLoggedin)" class="flex items-center sm:flex-row flex-col justify-between" :class="hideTitle ? 'mb-0 justify-end' : 'mb-6'">
                <h4 v-if="!hideTitle" class="text-gray-900 dark:text-yellow-400 text-lg font-bold rtl:sm:text-right ltr:sm:text-left flex sm:justify-start justify-center items-center">
                    <i class="bg-gray-900 dark:bg-yellow-400 rtl:ml-1 ltr:mr-1 w-2 h-2 rounded-full sm:flex hidden"></i>
                    {{ $t('comments.title') }}
                </h4>

                <div v-if="!hideAddButton && isLoggedin" class="flex flex-wrap justify-center sm:w-fit-content md:w-auto w-full relative">
                    <!-- <div class="sm:w-fit-content w-full flex justify-center ">
                        <div
                            class="cursor-pointer group border text-sm justify-center sm:ml-3 border-blue-700 text-blue-700 dark:hover:border-blue-700 dark:text-white dark:border-white px-3 h-12 rounded flex items-center font-semibold sm:w-fit-content w-full transition duration-200 hover:bg-blue-700 hover:text-white">
                            دنبال کردن نظرات
                        </div>
                        
                    </div> -->
                    <button v-if="isLoggedin" @click="commentForm(null, $event)" class="group border justify-center w-max mt-3 md:mt-0 border-yellow-400 bg-yellow-400 text-sm focus:ring-2 ring-yellow-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 text-gray-800 px-3 h-10 rounded-lg flex items-center font-semibold transition duration-200">
                        {{ $t('comments.addNew') }}
                        <svg class="ms-1" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path stroke="currentColor" opacity="0.5" d="M4.75 12.5C4.75 14.2328 4.84383 15.5741 5.07592 16.6184C5.30612 17.6543 5.66226 18.3514 6.15542 18.8446C6.64859 19.3377 7.34575 19.6939 8.38157 19.9241C9.4259 20.1562 10.7672 20.25 12.5 20.25C14.2328 20.25 15.5741 20.1562 16.6184 19.9241C17.6543 19.6939 18.3514 19.3377 18.8446 18.8446C19.3377 18.3514 19.6939 17.6543 19.9241 16.6184C20.1562 15.5741 20.25 14.2328 20.25 12.5C20.25 10.7672 20.1562 9.4259 19.9241 8.38157C19.6939 7.34575 19.3377 6.64859 18.8446 6.15542C18.3514 5.66226 17.6543 5.30613 16.6184 5.07592C15.5741 4.84383 14.2328 4.75 12.5 4.75C10.7672 4.75 9.4259 4.84383 8.38157 5.07592C7.34575 5.30613 6.64859 5.66226 6.15542 6.15542C5.66226 6.64859 5.30612 7.34575 5.07592 8.38157C4.84383 9.4259 4.75 10.7672 4.75 12.5Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path stroke="currentColor" opacity="0.5" d="M7.01992 17.9803C8.24521 19.2055 9.25998 20.0876 10.1626 20.662C11.0578 21.2316 11.8026 21.4728 12.5 21.4728C13.1974 21.4728 13.9422 21.2316 14.8374 20.662C15.74 20.0876 16.7548 19.2055 17.9801 17.9803C19.2054 16.755 20.0874 15.7402 20.6618 14.8376C21.2314 13.9424 21.4726 13.1976 21.4726 12.5002C21.4726 11.8027 21.2314 11.058 20.6618 10.1627C20.0874 9.26017 19.2054 8.24539 17.9801 7.0201C16.7548 5.79482 15.74 4.91274 14.8374 4.33839C13.9422 3.76874 13.1974 3.5276 12.5 3.5276C11.8026 3.5276 11.0578 3.76874 10.1626 4.33839C9.25998 4.91274 8.24521 5.79482 7.01992 7.0201C5.79463 8.24539 4.91255 9.26017 4.33821 10.1627C3.76856 11.058 3.52741 11.8027 3.52741 12.5002C3.52741 13.1976 3.76856 13.9424 4.33821 14.8376C4.91255 15.7402 5.79463 16.755 7.01992 17.9803Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path stroke="currentColor" d="M9.66699 12.4997H12.5003M15.3337 12.4997H12.5003M12.5003 12.4997V9.66634V15.333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div class="my-4">
            <div v-if="!isLoggedin || !currentUser" class="shadow-md shadow-amber-400 py-4 md:px-8 px-5 flex justify-between items-center md:flex-row flex-col bg-amber-400 dark:bg-opacity-60 rounded-xl mb-6">
                <h3 class="text-white font-medium flex items-center md:mb-0 mb-5">
                    <span class="rtl:ml-4 ltr:mr-4">
                        <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M0 17.4167C0 21.191 1.77971 22 10.0833 22C18.387 22 20.1667 21.191 20.1667 17.4167C20.1667 13.6423 18.387 12.8333 10.0833 12.8333C1.77971 12.8333 0 13.6423 0 17.4167Z"></path>
                            <path fill="currentColor" d="M4.58333 5.5C4.58333 8.53757 7.04577 11 10.0833 11C13.1209 11 15.5833 8.53757 15.5833 5.5C15.5833 2.46243 13.1209 0 10.0833 0C7.04577 0 4.58333 2.46243 4.58333 5.5Z"></path>
                        </svg>
                    </span>
                    {{ $t('comments.loginRequired') }}
                </h3>

                <router-link class="text-normal text-white font-semibold flex items-center hover:text-gray-700 duration-200 transition" :to="{ name: 'login' }">
                    {{ $t('comments.loginOrRegister') }}
                    <span class="rtl:mr-4 ltr:ml-4 ltr:rotate-180">
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" opacity="0.4" d="M12.7975 4.80957L16.4967 4.48242C17.3269 4.48242 18 5.16206 18 6.00032C18 6.83858 17.3269 7.51822 16.4967 7.51822L12.7975 7.19107C12.1463 7.19107 11.6183 6.65793 11.6183 6.00032C11.6183 5.34161 12.1463 4.80957 12.7975 4.80957Z"></path>
                            <path fill="currentColor" d="M0.37534 4.86984C0.433157 4.81146 0.649155 4.56471 0.852061 4.35983C2.03568 3.07656 5.12619 0.978153 6.7429 0.335965C6.98835 0.233523 7.60907 0.0154213 7.94179 0C8.25924 0 8.56251 0.0738021 8.8516 0.219203C9.21269 0.422985 9.50068 0.74463 9.65995 1.12355C9.76141 1.38572 9.92068 2.17331 9.92068 2.18763C10.0789 3.04792 10.165 4.44685 10.165 5.99339C10.165 7.46503 10.0789 8.80668 9.94904 9.68129C9.93486 9.69671 9.77559 10.6738 9.60214 11.0086C9.28469 11.6211 8.66397 12 7.99961 12H7.94179C7.50871 11.9857 6.5989 11.6057 6.5989 11.5924C5.06837 10.9502 2.05096 8.95319 0.837879 7.62585C0.837879 7.62585 0.495338 7.28438 0.346976 7.07178C0.115706 6.76556 7.15256e-05 6.38663 7.15256e-05 6.00771C7.15256e-05 5.58473 0.129888 5.19148 0.37534 4.86984Z"></path>
                        </svg>
                    </span>
                </router-link>
            </div>
            <div v-else ref="defaultCommentFormHost">
                <div v-show="showCommentForm && isLoggedin" class="comment-form p-3 md:p-4 border-2 border-white dark:border-gray-900 rounded-xl mb-5 mt-8">
                    <div class="flex sm:flex-row flex-col justify-between border-b-2 border-white dark:border-gray-900">
                        <div class="flex">
                            <i class="absolute"></i>

                            <div class="rtl:ml-2 ltr:mr-2 pb-5">
                                <div class="relative" style="">
                                    <div class="sm:w-14 sm:h-14 w-12 h-12 bg-gray-300 group relative rounded-full overflow-hidden border-4 border-solid border-yellow-500">
                                        <router-link :to="'/@' + currentUser.username">
                                            <SeoImage
                                                :src="currentUser.profile_pic"
                                                alt="user-avatar"
                                                :width="40"
                                                :height="40"
                                                sizes-preset="avatar"
                                                img-class="object-cover transition duration-200 transform group-hover:scale-110 w-full h-full"
                                            />
                                            <div class="w-full h-full absolute top-0 right-0 bg-gray-700 bg-opacity-20 z-0"></div>
                                        </router-link>
                                    </div>
                                </div>
                            </div>

                            <div class="flex relative justify-center flex-col pb-5 space-y-1">
                                <h6 class="font-semibold text-chambray-700 dark:text-white dark:hover:text-yellow-400 hover:text-yellow-400 transition duration-200">
                                    <router-link :to="'/@' + currentUser.username">
                                        {{ currentUser.first_name + " " + currentUser.last_name }}
                                    </router-link>
                                </h6>
                                <span dir="ltr" class="text-gray-400 dark:text-gray-200 text-sm"> @{{ currentUser.username }} </span>
                            </div>
                        </div>
                        <div class="flex sm:items-start sm:justify-start justify-end sm:mb-0 mb-2"></div>
                    </div>
                    <div class="pt-4">
                        <form @submit.prevent="addComment">
                            <EditorComponent :submitButton="true" :cancelButton="true" :cancelCallback="hideCommentForm" :errors="errors && errors.comment ? errors.comment[0] : ''" v-model="content"> </EditorComponent>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- <hr class="my-5 border-gray-100 border dark:border-opacity-10"> -->
        <div id="comments-body">
            <div v-if="loading" class="bg-yellow-100 dark:bg-yellow-400 dark:bg-opacity-20 dark:text-slate-200 text-slate-600 border border-dashed border-yellow-300 rounded-xl p-4 font-semibold flex items-center space-x-2 space-x-reverse mb-6">
                <svg class="w-8 h-8 rtl:ml-2 ltr:mr-2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
                    <circle class="stroke-current text-yellow-500 text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
                    <circle class="stroke-current text-yellow-500" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                        <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
                        <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
                    </circle>
                </svg>
                <p>{{ $t('comments.loading') }}</p>
            </div>

            <div v-else>
                <div v-if="comments && comments.length > 0">
                    <div class="-mb-6">
                        <div class="space-y-10 space-y-reverse">
                            <div dir="">
                                <div v-for="(comment, index) in comments" :key="index">
                                    <div class="comment-root mb-10 md:mb-0">
                                        <div class="sm:p-6 p-3 rounded-2xl mb-5 bg-white dark:bg-slate-900">
                                            <div class="flex sm:flex-row flex-col justify-between border-b border-dashed border-gray-200 dark:border-opacity-20">
                                                <div class="flex">
                                                    <i class="absolute"></i>

                                                    <div class="rtl:ml-2 ltr:mr-2 pb-5">
                                                        <div class="relative" style="">
                                                            <div class="sm:w-14 sm:h-14 w-12 h-12 bg-gray-300 group relative rounded-full overflow-hidden border-4 border-solid border-gray-100">
                                                                <router-link :to="'/@' + comment.user.username">
                                                                    <SeoImage
                                                                        :src="comment.user.profile_pic"
                                                                        alt="user-avatar"
                                                                        :width="40"
                                                                        :height="40"
                                                                        sizes-preset="avatar"
                                                                        img-class="object-cover transition duration-200 transform group-hover:scale-110 w-full h-full"
                                                                    />
                                                                    <div class="w-full h-full absolute top-0 right-0 bg-gray-700 bg-opacity-20 z-0"></div>
                                                                </router-link>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="flex relative justify-center flex-col pb-5 space-y-1">
                                                        <h6 class="font-semibold sm:text-xl text-base text-chambray-700 dark:text-white dark:hover:text-yellow-400 hover:text-yellow-400 transition duration-200">
                                                            <router-link :to="'/@' + comment.user.username">
                                                                {{ comment.user.first_name + " " + comment.user.last_name }}
                                                            </router-link>
                                                        </h6>
                                                        <span class="text-gray-400 dark:text-gray-300 text-xs">
                                                            {{ timeAgo(comment.created_at) }} &nbsp; {{ $t('comments.by') }} {{ comment.user.first_name + " " + comment.user.last_name }}
                                                            &nbsp; {{ $t('comments.posted') }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="flex sm:items-start sm:justify-start justify-end sm:mb-0 mb-2">
                                                    <button v-if="isLoggedin && currentUser" @click.prevent="commentForm(comment.id, $event)" class="flex items-center me-2 text-sm text-gray-600 font-medium bg-gray-200 dark:bg-gray-300 focus:ring-2 ring-gray-200 dark:ring-gray-300 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 h-6 px-2 rounded transition duration-200">
                                                        <svg class="rtl:ml-1 ltr:mr-1" width="20" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M4.5 12L9.5 7M4.5 12L9.5 17M4.5 12L11 12M14.5 12C16.1667 12 19.5 13 19.5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                        </svg>
                                                    </button>
                                                    <button @click.prevent="toggleLike(comment)" :disabled="comment.loading" class="flex items-center text-sm text-rose-500 dark:hover:bg-rose-700 dark:text-red-500 font-medium bg-red-400 dark:bg-opacity-20 bg-opacity-10 h-6 px-2 rounded hover:bg-opacity-100 hover:text-white dark:hover:text-white transition duration-200">
                                                        <svg v-if="isLoggedin && comment.user_has_liked" class="rtl:ml-1 ltr:mr-1" width="15" height="13" fill="none" viewBox="0 0 15 13" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M4.75 0.624878C5.80649 0.624878 6.77021 1.15065 7.5 1.74964C8.22979 1.15065 9.19351 0.624878 10.25 0.624878C12.5282 0.624878 14.375 2.31858 14.375 4.40774C14.375 8.62007 9.57964 11.0733 7.99879 11.7676C7.68036 11.9075 7.31964 11.9075 7.00121 11.7676C5.42036 11.0733 0.625 8.61997 0.625 4.40764C0.625 2.31848 2.47183 0.624878 4.75 0.624878Z" stroke-width="0.771644"></path>
                                                        </svg>
                                                        <svg v-else class="rtl:ml-1 ltr:mr-1" width="15" height="13" fill="none" viewBox="0 0 15 13" xmlns="http://www.w3.org/2000/svg">
                                                            <path stroke="currentColor" d="M4.75 0.624878C5.80649 0.624878 6.77021 1.15065 7.5 1.74964C8.22979 1.15065 9.19351 0.624878 10.25 0.624878C12.5282 0.624878 14.375 2.31858 14.375 4.40774C14.375 8.62007 9.57964 11.0733 7.99879 11.7676C7.68036 11.9075 7.31964 11.9075 7.00121 11.7676C5.42036 11.0733 0.625 8.61997 0.625 4.40764C0.625 2.31848 2.47183 0.624878 4.75 0.624878Z" stroke-width="0.771644"></path>
                                                        </svg>

                                                        {{ comment.likes_count }}
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="content-area comment-area pt-4 font-medium text-gray-800 dark:text-gray-200">
                                                <p class="leading-7 w-full rendered-content">
                                                    <MarkdownRenderer startClass="rendered-content" :source="comment.comment" />
                                                </p>
                                            </div>
                                        </div>
                                        <div v-if="comment.childs && comment.childs.length">
                                            <div class="space-y-2 comment-answer-section">
                                                <div v-for="(commentChild, indexChild) in visibleChilds(comment)" :key="commentChild.id || indexChild">
                                                    <div class="sm:p-6 p-3 rounded-2xl mb-5 sm:rtl:mr-14 sm:ltr:ml-14 bg-white dark:bg-slate-900 sub-item" :class="{ 'last-item': isLastVisibleChild(comment, indexChild) }">
                                                    <div class="flex sm:flex-row flex-col justify-between border-b border-dashed border-gray-200 dark:border-opacity-20">
                                                        <div class="flex">
                                                            <i class="absolute"></i>

                                                            <div class="rtl:ml-2 ltr:mr-2 pb-5">
                                                                <div class="relative" style="">
                                                                    <div class="sm:w-14 sm:h-14 w-12 h-12 bg-gray-300 group relative rounded-full overflow-hidden border-4 border-solid border-gray-100">
                                                                        <router-link :to="'/@' + commentChild.user.username">
                                                                            <SeoImage
                                                                                :src="commentChild.user.profile_pic"
                                                                                alt="user-avatar"
                                                                                :width="32"
                                                                                :height="32"
                                                                                sizes-preset="avatar"
                                                                                img-class="object-cover transition duration-200 transform group-hover:scale-110 w-full h-full"
                                                                            />
                                                                            <div class="w-full h-full absolute top-0 right-0 bg-gray-700 bg-opacity-20 z-0"></div>
                                                                        </router-link>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div class="flex relative justify-center flex-col pb-5 space-y-1">
                                                                <h6 class="font-semibold sm:text-xl text-base text-gray-700 dark:text-white dark:hover:text-yellow-400 hover:text-yellow-400 transition duration-200">
                                                                    <router-link :to="'/@' + commentChild.user.username">
                                                                        {{ commentChild.user.first_name + " " + commentChild.user.last_name }}
                                                                    </router-link>
                                                                </h6>
                                                                <span class="text-gray-400 dark:text-gray-200 text-xs"> {{ timeAgo(commentChild.created_at) }} &nbsp; {{ $t('comments.by') }} {{ commentChild.user.first_name + " " + commentChild.user.last_name }} &nbsp; {{ $t('comments.posted') }} </span>
                                                            </div>
                                                        </div>
                                                        <div class="flex sm:items-start sm:justify-start justify-end sm:mb-0 mb-2">
                                                            <a v-if="isLoggedin && currentUser" @click="commentForm(commentChild.id, $event)" class="flex items-center me-2 text-sm text-gray-600 font-medium bg-gray-200 dark:bg-gray-300 focus:ring-2 ring-gray-200 dark:ring-gray-300 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 h-6 px-2 rounded transition duration-200">
                                                                <svg class="rtl:ml-1 ltr:mr-1" width="20" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M4.5 12L9.5 7M4.5 12L9.5 17M4.5 12L11 12M14.5 12C16.1667 12 19.5 13 19.5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                </svg>
                                                            </a>
                                                            <button @click.prevent="toggleLike(commentChild)" :disabled="commentChild.loading" class="flex items-center text-sm text-rose-500 dark:hover:bg-rose-700 dark:text-red-500 font-medium bg-red-400 dark:bg-opacity-20 bg-opacity-10 h-6 px-2 rounded hover:bg-opacity-100 hover:text-white dark:hover:text-white transition duration-200">
                                                                <svg v-if="isLoggedin && commentChild.user_has_liked" class="rtl:ml-1 ltr:mr-1" width="15" height="13" fill="none" viewBox="0 0 15 13" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill="currentColor" d="M4.75 0.624878C5.80649 0.624878 6.77021 1.15065 7.5 1.74964C8.22979 1.15065 9.19351 0.624878 10.25 0.624878C12.5282 0.624878 14.375 2.31858 14.375 4.40774C14.375 8.62007 9.57964 11.0733 7.99879 11.7676C7.68036 11.9075 7.31964 11.9075 7.00121 11.7676C5.42036 11.0733 0.625 8.61997 0.625 4.40764C0.625 2.31848 2.47183 0.624878 4.75 0.624878Z" stroke-width="0.771644"></path>
                                                                </svg>
                                                                <svg v-else class="rtl:ml-1 ltr:mr-1" width="15" height="13" fill="none" viewBox="0 0 15 13" xmlns="http://www.w3.org/2000/svg">
                                                                    <path stroke="currentColor" d="M4.75 0.624878C5.80649 0.624878 6.77021 1.15065 7.5 1.74964C8.22979 1.15065 9.19351 0.624878 10.25 0.624878C12.5282 0.624878 14.375 2.31858 14.375 4.40774C14.375 8.62007 9.57964 11.0733 7.99879 11.7676C7.68036 11.9075 7.31964 11.9075 7.00121 11.7676C5.42036 11.0733 0.625 8.61997 0.625 4.40764C0.625 2.31848 2.47183 0.624878 4.75 0.624878Z" stroke-width="0.771644"></path>
                                                                </svg>

                                                                {{ commentChild.likes_count }}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div class="content-area comment-area">
                                                        <p class="leading-7 pt-4 w-full font-medium text-gray-800 dark:text-gray-200 rendered-content">
                                                            <MarkdownRenderer startClass="rendered-content" :source="commentChild.comment" />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                            <button
                                                v-if="hasHiddenChilds(comment)"
                                                type="button"
                                                :disabled="isExpandingChilds(comment.id)"
                                                @click="showAllChilds(comment.id)"
                                                class="flex items-center justify-center gap-2 text-sm font-semibold text-white dark:text-gray-800 bg-slate-800 hover:bg-slate-700 dark:bg-slate-300 dark:hover:bg-slate-200 focus:ring-2 ring-slate-700 dark:ring-gray-300 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800 h-9 px-3 rounded-lg transition duration-200 w-max sm:rtl:mr-14 sm:ltr:ml-14 mb-5 disabled:cursor-wait disabled:opacity-90"
                                            >
                                                <svg v-if="isExpandingChilds(comment.id)" class="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                </svg>
                                                <svg v-else class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                                                </svg>
                                                {{ $t('comments.showAllReplies', { count: hiddenChildsCount(comment) }) }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="comments.length != 0" class="mt-16 flex items-center justify-center">
                        <PaginationComponent :pagination="pagination" @updatePage="updatePage" />
                    </div>
                </div>

                <div v-else>
                    <div class="mb-6">
                        <div class="space-y-10 space-y-reverse">
                            <div class="bg-white dark:bg-gray-900 p-4 mx-auto rounded-xl">
                                <div class="flex items-center flex-col pt-4">
                                    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M27 0C49.2345 0 54 4.00008 54 24C54 37.0001 51.7506 45 41.6256 45C36.2147 45 34.6052 47.5703 33.1064 49.9638C31.8006 52.0491 30.5789 54.0001 27.0006 54C23.4225 53.9999 22.2007 52.049 20.8949 49.9638C19.3961 47.5703 17.7865 45 12.3756 45C2.25055 45 0 36.7442 0 24C0 4.23601 4.7655 0 27 0ZM49.5 24C49.5 13.878 48.1565 9.89799 45.8623 7.87579C44.6944 6.84628 42.8722 5.95738 39.7488 5.35647C36.6026 4.75117 32.4778 4.5 27 4.5C21.5316 4.5 17.4124 4.76523 14.2732 5.38537C11.1583 6.00072 9.32897 6.90538 8.1517 7.95184C5.83648 10.0098 4.5 14.0158 4.5 24C4.5 30.3241 5.09867 34.632 6.41592 37.2668C7.01586 38.4668 7.70279 39.1862 8.47207 39.6441C9.25959 40.1128 10.4585 40.5 12.3756 40.5C15.6095 40.5 18.2372 41.232 20.3756 42.6808C22.433 44.0748 23.6339 45.8794 24.4009 47.0862L24.7092 47.5722C25.3722 48.6189 25.5918 48.9656 25.9024 49.2444L25.9146 49.256C25.9799 49.3197 26.1644 49.5 27.0007 49.5C27.8371 49.5 28.0216 49.3197 28.0867 49.2561L28.0989 49.2445C28.4096 48.9657 28.6291 48.6191 29.2923 47.572L29.6003 47.0864C30.3672 45.8797 31.5681 44.0749 33.6255 42.6809C35.7638 41.232 38.3916 40.5 41.6256 40.5C43.5662 40.5 44.7756 40.119 45.564 39.6594C46.3265 39.2148 47.0012 38.5197 47.5916 37.3489C48.8981 34.7581 49.5 30.4669 49.5 24Z"
                                            fill="#E0E3EA"
                                        ></path>
                                        <path d="M31.5 15.75C30.2573 15.75 29.25 16.7573 29.25 18C29.25 19.2427 30.2573 20.25 31.5 20.25H38.25C39.4927 20.25 40.5 19.2427 40.5 18C40.5 16.7573 39.4927 15.75 38.25 15.75H31.5Z" fill="#A2ACBF"></path>
                                        <path d="M15.75 24.75C14.5073 24.75 13.5 25.7573 13.5 27C13.5 28.2427 14.5073 29.25 15.75 29.25H38.25C39.4927 29.25 40.5 28.2427 40.5 27C40.5 25.7573 39.4927 24.75 38.25 24.75H15.75Z" fill="#A2ACBF"></path>
                                    </svg>
                                    <h6 class="mt-4 text-xl font-semibold text-gray-400">{{ $t('comments.empty') }}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import axios from "axios";
import axiosInstance from "@/store/axiosInstance";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import moment from "moment";
import "moment/locale/fa";

export default {
    components: {
        EditorComponent,
        MarkdownRenderer,
        PaginationComponent,
        SeoImage,
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        id: {
            type: Number,
            required: true,
        },
        perPage: {
            type: Number,
            required: true,
            default: 10,
        },
        hideTitle: {
            type: Boolean,
            default: false,
        },
        hideAddButton: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            comments: [],
            pagination: {},
            loading: true,
            content: "",
            parent_id: null,
            errors: null,
            message: null,
            currentButtonFormShownId: null,
            showCommentForm: false,
            expandedChilds: {},
            loadingChilds: {},
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
        timeAgo(date) {
            moment.locale("fa");
            return moment(date).fromNow();
        },
        visibleChilds(comment) {
            const childs = comment?.childs || [];
            if (this.expandedChilds[comment.id]) {
                return childs;
            }
            return childs.slice(0, 2);
        },
        hiddenChildsCount(comment) {
            const childs = comment?.childs || [];
            if (this.expandedChilds[comment.id] || childs.length <= 2) {
                return 0;
            }
            return childs.length - 2;
        },
        hasHiddenChilds(comment) {
            return this.hiddenChildsCount(comment) > 0;
        },
        isLastVisibleChild(comment, index) {
            const childs = comment?.childs || [];
            const visibleCount = this.expandedChilds[comment.id] ? childs.length : Math.min(childs.length, 2);
            return index === visibleCount - 1;
        },
        isExpandingChilds(commentId) {
            return !!this.loadingChilds[commentId];
        },
        showAllChilds(commentId) {
            if (this.loadingChilds[commentId] || this.expandedChilds[commentId]) {
                return;
            }
            this.loadingChilds = { ...this.loadingChilds, [commentId]: true };
            this.clearChildExpandTimer(commentId);
            this._childExpandTimers[commentId] = setTimeout(() => {
                this.expandedChilds = { ...this.expandedChilds, [commentId]: true };
                this.loadingChilds = { ...this.loadingChilds, [commentId]: false };
                delete this._childExpandTimers[commentId];
            }, 1000);
        },
        clearChildExpandTimer(commentId) {
            if (!this._childExpandTimers) {
                this._childExpandTimers = {};
            }
            if (this._childExpandTimers[commentId]) {
                clearTimeout(this._childExpandTimers[commentId]);
                delete this._childExpandTimers[commentId];
            }
        },
        clearAllChildExpandTimers() {
            if (!this._childExpandTimers) {
                this._childExpandTimers = {};
                return;
            }
            Object.keys(this._childExpandTimers).forEach((id) => this.clearChildExpandTimer(id));
        },
        resetChildExpandState() {
            this.clearAllChildExpandTimers();
            this.expandedChilds = {};
            this.loadingChilds = {};
        },
        async getComments(page) {
            this.loading = true;
            await axiosInstance
                .get("/comments", { params: { type: this.type, id: this.id, page: page, perPage: this.perPage } })
                .then((response) => {
                    this.hideCommentForm();
                    this.resetChildExpandState();
                    this.comments = response.data.comments;
                    this.pagination = response.data.pagination;
                })
                .catch((error) => {
                    console.error("Error fetching comments", error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        updatePage(page) {
            this.getComments(page);
            document.getElementById("comments-body").scrollIntoView({ behavior: "smooth" });
        },
        hideCommentForm() {
            this.showCommentForm = false;
            this.parent_id = null;
        },
        commentForm(id, event) {
            if (this.currentButtonFormShownId === id && this.showCommentForm === true) {
                this.hideCommentForm();
                return;
            }
            this.currentButtonFormShownId = id;
            this.parent_id = id;

            const commentFormEl = this.$el?.querySelector(".comment-form");
            if (!commentFormEl) {
                this.showCommentForm = true;
                return;
            }

            let parentNode = null;
            if (id != null && event?.target) {
                parentNode = event.target.closest(".comment-root");
            }
            if (!parentNode) {
                parentNode = this.$refs.defaultCommentFormHost;
            }
            if (!parentNode) {
                this.showCommentForm = true;
                return;
            }

            if (commentFormEl.parentNode !== parentNode) {
                parentNode.appendChild(commentFormEl);
            }

            this.showCommentForm = true;
            setTimeout(() => {
                commentFormEl.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
            }, 10);
        },
        addComment() {
            if (this.content.trim() !== "") {
                this.errors = null;
                axiosInstance
                    .post("/comments/store", { type: this.type, id: this.id, comment: this.content, parent_id: this.parent_id })
                    .then(() => {
                        toast.success(this.$t("comments.submitSuccess"), {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") === "rtl",
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    })
                    .catch((error) => {
                        this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

                        this.errors = error.response.data.errors;
                    });
            }
        },

        async toggleLike(comment) {
            if (!this.isLoggedin) {
                toast.warning(this.$t("comments.likeLoginRequired"), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") === "rtl",
                    bodyClassName: "font-YekanBakh text-gray-800",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }

            comment.loading = true;

            await axiosInstance
                .post("/toggleLike", {
                    likeable_id: comment.id,
                    likeable_type: "Comment",
                })
                .then((response) => {
                    comment.user_has_liked = response.data.user_has_liked;
                    comment.likes_count = response.data.likes_count;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    comment.loading = false;
                });
        },
    },
    created() {
        this._childExpandTimers = {};
    },
    mounted() {
        this.getComments();
    },
    beforeUnmount() {
        this.clearAllChildExpandTimers();
    },
};
</script>

<style scoped>
.comment-answer-section {
    position: relative;
}

@media (min-width: 640px) {
    .dark .comment-answer-section:before {
        --tw-bg-opacity: 1;
    }
}

.comment-answer-section:before,
.dark .comment-answer-section:before {
    --tw-bg-opacity: 0;
}

.dark .comment-answer-section:before {
    --tw-bg-opacity: 1;
    background-color: rgba(2, 6, 23, var(--tw-bg-opacity));
}

.comment-answer-section:before {
    content: "";
    display: block;
    height: 100%;
    position: absolute;
    right: 25px;
    top: -20px;
    width: 5px;
}
html[dir="ltr"] .comment-answer-section:before {
    left: 25px;
}

.comment-answer-section:before {
    --tw-bg-opacity: 0.2;
}

.comment-answer-section:before {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
}

.comment-answer-section .sub-item {
    position: relative;
}

.dark .comment-answer-section .sub-item:before {
    --tw-bg-opacity: 1;
}

.dark .comment-answer-section .sub-item:before {
    background-color: rgba(2, 6, 23, var(--tw-bg-opacity));
}

.comment-answer-section .sub-item:before {
    content: "";
    display: block;
    height: 5px;
    position: relative;
    right: -51px;
    top: 58px;
    width: 28px;
}

html[dir="ltr"] .comment-answer-section .sub-item:before {
    left: -51px;
}


@media (min-width: 640px) {
    .comment-answer-section .sub-item:before {
        --tw-rotate: 0deg;
        display: block !important;
    }
}

.comment-answer-section .sub-item:before {
    --tw-bg-opacity: 0.2;
}

.comment-answer-section .sub-item:before {
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    --tw-rotate: 0deg;
    --tw-bg-opacity: 1;
    display: none;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
    transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.dark .comment-answer-section .last-item:after {
    --tw-bg-opacity: 1;
    background-color: rgba(30, 41, 55, var(--tw-bg-opacity));
}

.comment-answer-section .last-item:after {
    content: "";
    display: block;
    height: calc(100% - 66px);
    position: absolute;
    right: -32px;
    top: 87px;
    width: 6px;
}

html[dir="ltr"] .comment-answer-section .last-item:after {
    left: -32px;
}

.comment-answer-section .last-item:after {
    --tw-bg-opacity: 1;
    background-color: rgba(241, 245, 249, var(--tw-bg-opacity));
}
</style>
