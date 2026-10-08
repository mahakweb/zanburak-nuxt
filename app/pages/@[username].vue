<script setup>
definePageMeta({
  name: "profile-page",
})
</script>

<template>
    <MasterPage>
        <ProfilePageLoading v-if="loading" />

        <div v-else-if="user" class="mx-auto max-w-screen-xl px-3 md:px-4 pb-16">
            <!-- Cover -->
            <div
                class="relative mt-6 h-40 sm:h-52 md:h-60 lg:h-72 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-pink-400 via-fuchsia-500 to-indigo-500 ring-1 ring-black/5 dark:ring-white/5 shadow-sm">
                <SeoImage
                    v-if="user.cover_pic"
                    :src="user.cover_pic"
                    :alt="authorDisplayName || user.username || 'cover'"
                    :width="1200"
                    :height="400"
                    sizes-preset="hero"
                    :priority="true"
                    img-class="absolute inset-0 w-full h-full object-cover"
                    picture-class="absolute inset-0 block w-full h-full"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" aria-hidden="true"></div>
            </div>

            <!-- Identity card -->
            <div class="relative z-10 -mt-14 md:-mt-16 mx-1 sm:mx-4 rounded-3xl bg-white dark:bg-gray-900 p-5 md:p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                <div class="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                    <!-- Avatar -->
                    <div class="-mt-20 md:-mt-24 mx-auto md:mx-0 shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden ring-4 ring-white dark:ring-gray-900 bg-gray-100 dark:bg-gray-800 shadow-xl">
                        <SeoImage
                            v-if="user.profile_pic && !avatarError"
                            :src="user.profile_pic"
                            :alt="authorDisplayName"
                            :width="144"
                            :height="144"
                            sizes-preset="avatar"
                            img-class="w-full h-full object-cover transition duration-300 hover:scale-105"
                            @error="avatarError = true"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                            <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="8" r="4" fill="currentColor" />
                                <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                        </div>
                    </div>

                    <!-- Name + meta -->
                    <div class="flex-1 min-w-0 text-center md:text-start">
                        <h1 class="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white truncate">
                            {{ authorDisplayName }}
                        </h1>
                        <div class="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <span dir="ltr" class="font-semibold text-pink-600 dark:text-pink-400">@{{ user.username }}</span>
                            <span class="hidden sm:inline w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden="true"></span>
                            <span class="inline-flex items-center gap-1.5">
                                <svg class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 8V12L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <circle cx="12" cy="12" r="9.25" stroke="currentColor" stroke-width="1.5" />
                                </svg>
                                {{ timeAgo(user.last_seen) }}
                            </span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col items-center md:items-end gap-3 shrink-0">
                        <button
                            v-if="!isLoggedin || user.id !== currentUser.id"
                            @click="toggleFollow"
                            :disabled="followLoading"
                            type="button"
                            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-white dark:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            :class="user.follow.hasFlollow
                                ? 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-400/60'
                                : 'text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 shadow-lg shadow-pink-500/30 dark:shadow-pink-800/40 focus:ring-pink-500'">
                            <svg v-if="!user.follow.hasFlollow" class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            </svg>
                            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            {{ user.follow.hasFlollow ? $t('profile.common.unfollow') : $t('profile.common.follow') }}
                        </button>
                        <router-link
                            v-else
                            :to="{ name: 'panel-profile' }"
                            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 shadow-lg shadow-pink-500/30 dark:shadow-pink-800/40 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ring-offset-white dark:ring-offset-gray-900">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 20h4l10.5-10.5a2.121 2.121 0 00-3-3L5 17v3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                            </svg>
                            {{ $t('profile.public.editProfile') }}
                        </router-link>

                        <!-- Socials -->
                        <div v-if="hasSocials" class="flex items-center gap-1.5">
                            <a v-if="user.info.website" target="_blank" rel="noopener" :href="'https://' + user.info.website" :title="$t('profile.account.website')" class="social-btn">
                                <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.25" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M2.75 12h18.5M12 2.75c2.5 2.5 3.75 6 3.75 9.25S14.5 18.75 12 21.25M12 2.75c-2.5 2.5-3.75 6-3.75 9.25S9.5 18.75 12 21.25" stroke="currentColor" stroke-width="1.5" />
                                </svg>
                            </a>
                            <a v-if="user.info.github" target="_blank" rel="noopener" :href="'https://github.com/' + user.info.github" title="GitHub" class="social-btn">
                                <svg class="w-[18px] h-[18px]" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
                                    <path fill="currentColor" fill-rule="evenodd" d="M8 1C4.133 1 1 4.13 1 7.993c0 3.09 2.006 5.71 4.787 6.635.35.064.478-.152.478-.337 0-.166-.006-.606-.01-1.19-1.947.423-2.357-.937-2.357-.937-.319-.808-.778-1.023-.778-1.023-.635-.434.048-.425.048-.425.703.05 1.073.72 1.073.72.624 1.07 1.638.76 2.037.582.063-.452.244-.76.444-.935-1.554-.176-3.188-.776-3.188-3.456 0-.763.273-1.388.72-1.876-.072-.177-.312-.888.07-1.85 0 0 .586-.189 1.924.716A6.711 6.711 0 018 4.381c.595.003 1.194.08 1.753.236 1.336-.905 1.923-.717 1.923-.717.382.963.142 1.674.07 1.85.448.49.72 1.114.72 1.877 0 2.686-1.638 3.278-3.197 3.45.251.216.475.643.475 1.296 0 .934-.009 1.688-.009 1.918 0 .187.127.404.482.336A6.996 6.996 0 0015 7.993 6.997 6.997 0 008 1z" clip-rule="evenodd" />
                                </svg>
                            </a>
                            <a v-if="user.info.telegram" target="_blank" rel="noopener" :href="'https://t.me/' + user.info.telegram" title="Telegram" class="social-btn">
                                <svg class="w-[18px] h-[18px]" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none">
                                    <path stroke="currentColor" stroke-width="12" d="M23.073 88.132s65.458-26.782 88.16-36.212c8.702-3.772 38.215-15.843 38.215-15.843s13.621-5.28 12.486 7.544c-.379 5.281-3.406 23.764-6.433 43.756-4.54 28.291-9.459 59.221-9.459 59.221s-.756 8.676-7.188 10.185c-6.433 1.509-17.027-5.281-18.919-6.79-1.513-1.132-28.377-18.106-38.214-26.404-2.649-2.263-5.676-6.79.378-12.071 13.621-12.447 29.891-27.913 39.728-37.72 4.54-4.527 9.081-15.089-9.837-2.264-26.864 18.483-53.35 35.835-53.35 35.835s-6.053 3.772-17.404.377c-11.351-3.395-24.594-7.921-24.594-7.921s-9.08-5.659 6.433-11.693Z" />
                                </svg>
                            </a>
                            <a v-if="user.info.instagram" target="_blank" rel="noopener" :href="'https://instagram.com/' + user.info.instagram" title="Instagram" class="social-btn">
                                <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor" />
                                    <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="currentColor" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="currentColor" />
                                </svg>
                            </a>
                            <a v-if="user.info.linkedin" target="_blank" rel="noopener" :href="'https://linkedin.com/in/' + user.info.linkedin" title="LinkedIn" class="social-btn">
                                <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2H6ZM4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6ZM9 11C9 10.4477 8.55228 10 8 10C7.44772 10 7 10.4477 7 11V17C7 17.5523 7.44772 18 8 18C8.55228 18 9 17.5523 9 17V11ZM9.5 7.5C9.5 8.32843 8.82843 9 8 9C7.17157 9 6.5 8.32843 6.5 7.5C6.5 6.67157 7.17157 6 8 6C8.82843 6 9.5 6.67157 9.5 7.5ZM12.5 10C11.9477 10 11.5 10.4477 11.5 11V17C11.5 17.5523 11.9477 18 12.5 18C13.0523 18 13.5 17.5523 13.5 17V13.75C13.5 13.0596 14.0596 12.5 14.75 12.5C15.4404 12.5 16 13.0596 16 13.75V17C16 17.5523 16.4477 18 17 18C17.5523 18 18 17.5523 18 17V13.75C18 11.9551 16.5449 10.5 14.75 10.5C14.2159 10.5 13.7118 10.6288 13.2675 10.857C13.0904 10.3498 12.6077 10 12.5 10Z" fill="currentColor" />
                                </svg>
                            </a>
                            <a v-if="user.info.twitter" target="_blank" rel="noopener" :href="'https://twitter.com/' + user.info.twitter" title="X (Twitter)" class="social-btn">
                                <svg class="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Quick stats -->
                <div class="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <button type="button" @click="openFollowSheet('followers')" class="stat-chip stat-chip--btn">
                        <span class="stat-chip__value">{{ formatNumber(user.follow.numberOfFollowers) }}</span>
                        <span class="stat-chip__label">{{ $t('profile.public.followers') }}</span>
                    </button>
                    <button type="button" @click="openFollowSheet('followings')" class="stat-chip stat-chip--btn">
                        <span class="stat-chip__value">{{ formatNumber(user.follow.numberOfFollowings) }}</span>
                        <span class="stat-chip__label">{{ $t('profile.public.followings') }}</span>
                    </button>
                    <div class="stat-chip">
                        <span class="stat-chip__value">{{ formatNumber(user.discuss.numberOfQuestions) }}</span>
                        <span class="stat-chip__label">{{ $t('profile.public.questionWord') }}</span>
                    </div>
                    <div class="stat-chip">
                        <span class="stat-chip__value">{{ formatNumber(user.discuss.numberOfAnswers) }}</span>
                        <span class="stat-chip__label">{{ $t('profile.public.answerWord') }}</span>
                    </div>
                </div>
            </div>

            <!-- Body -->
            <div class="mt-6 grid grid-cols-12 gap-5">
                <!-- Main -->
                <div class="col-span-12 lg:col-span-8">
                    <!-- Tabs -->
                    <div class="flex flex-nowrap overflow-x-auto gap-2 p-1.5 rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm w-full sm:w-max no-scrollbar">
                        <button type="button" @click="changeFilter('about')" :class="tabClass('about')">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.81828 5.27239C2.22012 5.17193 2.62732 5.41625 2.72778 5.81809L3.10975 7.34596C3.71957 9.78523 5.64125 11.6764 8.0847 12.25H16.0002C18.0912 12.25 19.8512 13.8151 20.0956 15.8918L20.745 21.4124C20.7934 21.8237 20.4992 22.1965 20.0878 22.2449C19.6764 22.2933 19.3037 21.999 19.2553 21.5876L18.6058 16.0671C18.4504 14.7458 17.3306 13.75 16.0002 13.75H7.91785L7.83748 13.7321C4.80227 13.0576 2.40864 10.7262 1.65454 7.70976L1.27257 6.1819C1.17211 5.78005 1.41643 5.37285 1.81828 5.27239Z" />
                                <path opacity="0.5" d="M8 13.75V18C8 19.8856 8 20.8284 8.58579 21.4142C9.17157 22 10.1144 22 12 22C13.8856 22 14.8284 22 15.4142 21.4142C16 20.8284 16 19.8856 16 18V13.75H8Z" />
                                <circle cx="12" cy="6" r="4" />
                            </svg>
                            {{ $t('profile.public.aboutMe') }}
                        </button>
                        <button type="button" @click="changeFilter('articles')" :class="tabClass('articles')">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V10C21 6.22876 21 4.34315 19.8284 3.17157C18.6569 2 16.7712 2 13 2H11C7.22876 2 5.34315 2 4.17157 3.17157ZM7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8ZM7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12ZM8 15.25C7.58579 15.25 7.25 15.5858 7.25 16C7.25 16.4142 7.58579 16.75 8 16.75H13C13.4142 16.75 13.75 16.4142 13.75 16C13.75 15.5858 13.4142 15.25 13 15.25H8Z" />
                            </svg>
                            {{ $t('profile.public.myArticles') }}
                        </button>
                        <button type="button" @click="changeFilter('discuss')" :class="tabClass('discuss')">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.58584 14.3415 10.232 13.883 10.704C13.7907 10.7989 13.7027 10.8869 13.6187 10.9708C13.4029 11.1864 13.2138 11.3753 13.0479 11.5885C12.8289 11.8699 12.75 12.0768 12.75 12.25V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V12.25C11.25 11.5948 11.555 11.0644 11.8642 10.6672C12.0929 10.3733 12.3804 10.0863 12.6138 9.85346C12.6842 9.78321 12.7496 9.71789 12.807 9.65877C13.0046 9.45543 13.125 9.18004 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" />
                            </svg>
                            {{ $t('profile.public.discussions') }}
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="mt-5">
                        <ProfileAbout v-if="selectedFilter === 'about'" :username="username" />

                        <ProfileArticles v-else-if="selectedFilter === 'articles'" :username="username" :author-name="authorDisplayName" />

                        <template v-else-if="selectedFilter === 'discuss'">
                            <div class="mb-5 flex flex-nowrap gap-2 p-1.5 rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm w-max">
                                <button type="button" @click="changeDiscussType('questions')" :class="subTabClass('questions')">
                                    {{ $t('profile.public.myQuestions') }}
                                </button>
                                <button type="button" @click="changeDiscussType('answers')" :class="subTabClass('answers')">
                                    {{ $t('profile.public.myAnswers') }}
                                </button>
                            </div>
                            <ProfileQuestions v-if="selectedDiscussType === 'questions'" :username="username" />
                            <ProfileAnswers v-else :username="username" />
                        </template>
                    </div>
                </div>

                <!-- Sidebar -->
                <aside class="col-span-12 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
                    <div class="rounded-3xl bg-white dark:bg-gray-900 p-5 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                        <h3 class="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-white mb-4">
                            <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-pink-500/10 text-pink-500 dark:text-pink-400">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.25" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M12 11v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                                    <circle cx="12" cy="8" r="1" fill="currentColor" />
                                </svg>
                            </span>
                            {{ $t('profile.public.details') }}
                        </h3>

                        <div class="space-y-1">
                            <div class="detail-row">
                                <span class="detail-row__icon">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 8V12L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" stroke-width="1.5" />
                                    </svg>
                                </span>
                                <div class="min-w-0">
                                    <div class="detail-row__value">{{ timeAgo(user.last_seen) }}</div>
                                    <div class="detail-row__label">{{ $t('profile.public.lastActivity') }}</div>
                                </div>
                            </div>

                            <div class="detail-row">
                                <span class="detail-row__icon">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="currentColor" stroke-width="1.5" />
                                        <path d="M7 4V2.5M17 4V2.5M2.5 9H21.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    </svg>
                                </span>
                                <div class="min-w-0">
                                    <div class="detail-row__value">{{ timeAgo(user.created_at) }}</div>
                                    <div class="detail-row__label">{{ $t('profile.public.joinDate') }}</div>
                                </div>
                            </div>

                            <div v-if="user.info.birth_date" class="detail-row">
                                <span class="detail-row__icon">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 2V5M16 2V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M21 8.5V16.36C20.27 15.53 19.2 15 18 15C15.79 15 14 16.79 14 19C14 19.75 14.21 20.46 14.58 21.06C14.79 21.42 15.06 21.74 15.37 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <div class="min-w-0">
                                    <div class="detail-row__value" dir="ltr">{{ user.info.birth_date }}</div>
                                    <div class="detail-row__label">{{ $t('profile.public.birthDate') }}</div>
                                </div>
                            </div>

                            <div class="detail-row">
                                <span class="detail-row__icon">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor" d="M12,1a11,11,0,0,0,0,22,1,1,0,0,0,0-2,9,9,0,1,1,9-9v2.857a1.857,1.857,0,0,1-3.714,0V7.714a1,1,0,1,0-2,0v.179A5.234,5.234,0,0,0,12,6.714a5.286,5.286,0,1,0,3.465,9.245A3.847,3.847,0,0,0,23,14.857V12A11.013,11.013,0,0,0,12,1Zm0,14.286A3.286,3.286,0,1,1,15.286,12,3.29,3.29,0,0,1,12,15.286Z" />
                                    </svg>
                                </span>
                                <div class="min-w-0">
                                    <div class="detail-row__value" dir="ltr">@{{ user.username }}</div>
                                    <div class="detail-row__label">{{ $t('profile.public.username') }}</div>
                                </div>
                            </div>

                            <div class="detail-row">
                                <span class="detail-row__icon">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.8114 6.7267C12.8247 4.9089 13.3314 4 14.0889 4C14.8464 4 15.353 4.9089 16.3663 6.7267L16.6285 7.19699C16.9164 7.71355 17.0604 7.97183 17.2849 8.14225C17.5094 8.31266 17.789 8.37592 18.3482 8.50244L18.8572 8.61762C20.825 9.06284 21.8089 9.28545 22.0429 10.0382C22.277 10.7909 21.6063 11.5753 20.2648 13.1439L19.9177 13.5498C19.5365 13.9955 19.3459 14.2184 19.2602 14.4942C19.1744 14.7699 19.2032 15.0673 19.2609 15.662L19.3134 16.2035C19.5162 18.2965 19.6176 19.343 19.0047 19.8082C18.3919 20.2734 17.4707 19.8492 15.6283 19.0009L15.1517 18.7815C14.6281 18.5404 14.3664 18.4199 14.0889 18.4199C13.8114 18.4199 13.5496 18.5404 13.0261 18.7815L12.5494 19.0009C10.707 19.8492 9.78581 20.2734 9.17299 19.8082C8.56016 19.343 8.66157 18.2965 8.86438 16.2035L8.91685 15.662C8.97449 15.0673 9.0033 14.7699 8.91756 14.4942C8.83181 14.2184 8.64121 13.9955 8.26 13.5498L7.91295 13.1439C6.57147 11.5753 5.90073 10.7909 6.1348 10.0382C6.36888 9.28545 7.35275 9.06284 9.3205 8.61762L9.82958 8.50244C10.3887 8.37592 10.6683 8.31266 10.8928 8.14225C11.1173 7.97183 11.2613 7.71355 11.5492 7.19699L11.8114 6.7267Z" stroke="currentColor" stroke-width="1.5" />
                                    </svg>
                                </span>
                                <div class="min-w-0">
                                    <div class="detail-row__value">{{ formatNumber(user.score) }}</div>
                                    <div class="detail-row__label">{{ $t('profile.public.userExperience') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>

        <ProfileFollowSheet
            v-if="user"
            v-model="isFollowSheetOpen"
            :username="username"
            :initial-tab="followSheetTab"
            :followers-count="user.follow.numberOfFollowers"
            :followings-count="user.follow.numberOfFollowings"
            :profile-display-name="authorDisplayName"
            :is-logged-in="isLoggedin"
        />
    </MasterPage>
</template>

<script>
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import ProfilePageLoading from "@/views/page/profile/ProfilePageLoading.vue";
import { ref } from "vue";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ProfileAbout from "@/views/page/profile/ProfileAbout.vue";
import ProfileArticles from "@/views/page/profile/ProfileArticles.vue";
import ProfileQuestions from "@/views/page/profile/ProfileQuestions.vue";
import ProfileAnswers from "@/views/page/profile/ProfileAnswers.vue";
import ProfileFollowSheet from "@/views/components/profile/ProfileFollowSheet.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import moment from "moment";
import "moment/locale/fa";
import { useSEO } from "@/composables/useSEO";

export default {
    components: {
        MasterPage,
        ProfilePageLoading,
        ProfileAbout,
        ProfileArticles,
        ProfileQuestions,
        ProfileAnswers,
        ProfileFollowSheet,
        SeoImage,
    },
    props: {
        username: String,
    },
    data() {
        const filters = ["about", "articles", "discuss"];
        const defaultFilter = "about";
        const queryFilter = this.$route.query.filter;

        const discussTypes = ["questions", "answers"];
        const defaultDiscussType = "questions";
        const queryDiscussType = this.$route.query.type;
        return {
            filters,
            selectedFilter: filters.includes(queryFilter) ? queryFilter : defaultFilter,
            discussTypes,
            selectedDiscussType: discussTypes.includes(queryDiscussType) ? queryDiscussType : defaultDiscussType,
            loading: false,
            followLoading: false,
            user: ref(null),
            isFollowSheetOpen: false,
            followSheetTab: "followers",
            avatarError: false,
        };
    },
    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
        authorDisplayName() {
            if (!this.user) return "";
            return [this.user.first_name, this.user.last_name].filter(Boolean).join(" ").trim();
        },
        coverStyle() {
            return this.user && this.user.cover_pic
                ? { backgroundImage: `url(${this.user.cover_pic})` }
                : {};
        },
        hasSocials() {
            const info = this.user && this.user.info ? this.user.info : {};
            return !!(info.website || info.github || info.telegram || info.instagram || info.linkedin || info.twitter);
        },
    },

    methods: {
        formatNumber(n) {
            return new Intl.NumberFormat(this.$i18n.locale === "fa" ? "fa-IR" : "en-US").format(Number(n) || 0);
        },
        tabClass(name) {
            const base =
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none";
            const active =
                "text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-md shadow-pink-500/30";
            const inactive =
                "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
            return `${base} ${this.selectedFilter === name ? active : inactive}`;
        },
        subTabClass(name) {
            const base =
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none";
            const active =
                "text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-md shadow-pink-500/30";
            const inactive =
                "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
            return `${base} ${this.selectedDiscussType === name ? active : inactive}`;
        },
        openFollowSheet(tab) {
            this.followSheetTab = tab;
            this.isFollowSheetOpen = true;
        },
        timeAgo(date) {
            moment.locale("fa");
            return moment(date).fromNow();
        },
        changeFilter(value) {
            this.selectedDiscussType = "questions";
            this.selectedFilter = value;
            this.buildQueryParams();
            this.updateProfileSEO();
        },
        changeDiscussType(value) {
            this.selectedDiscussType = value;
            this.buildQueryParams();
            this.updateProfileSEO();
        },
        updateProfileSEO() {
            if (!this.user) return;

            const filter = this.selectedFilter;
            const discussType = this.selectedDiscussType;
            const fullName = `${this.user.first_name} ${this.user.last_name}`;
            let title = this.$t("profile.seo.profileTitle", { name: fullName });
            let description = this.$t("profile.seo.profileDesc", { name: fullName });
            let url = `/@${this.user.username}`;

            if (filter === "about") {
                title = this.$t("profile.seo.aboutTitle", { name: fullName });
                description = this.$t("profile.seo.aboutDesc", { name: fullName });
            } else if (filter === "articles") {
                title = this.$t("profile.seo.articlesTitle", { name: fullName });
                description = this.$t("profile.seo.articlesDesc", { name: fullName });
                url += "?filter=articles";
            } else if (filter === "discuss") {
                if (discussType === "questions") {
                    title = this.$t("profile.seo.questionsTitle", { name: fullName });
                    description = this.$t("profile.seo.questionsDesc", { name: fullName });
                    url += "?filter=discuss&type=questions";
                } else {
                    title = this.$t("profile.seo.answersTitle", { name: fullName });
                    description = this.$t("profile.seo.answersDesc", { name: fullName });
                    url += "?filter=discuss&type=answers";
                }
            }

            const keywords = [
                fullName,
                this.user.username,
                this.$t("profile.seo.kwUserProfile"),
                this.$t("profile.seo.kwZanburak"),
                this.$t("profile.seo.kwZanburakUser"),
            ];

            useSEO({
                title,
                description,
                url,
                keywords,
                image: this.user.profile_pic || undefined,
                noindex: false,
            });
        },
        buildQueryParams() {
            let query = {};

            if (this.selectedFilter !== "about") {
                query.filter = this.selectedFilter;
            }

            if (this.selectedFilter === "discuss" && this.selectedDiscussType !== "questions") {
                query.type = this.selectedDiscussType;
            }

            const queryString = new URLSearchParams(query).toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

            window.history.pushState(null, "", newUrl);
        },
        getUserDetails() {
            this.loading = true;
            this.buildQueryParams();
            axiosInstance
                .post(`/@${this.username}`)
                .then((response) => {
                    this.user = response.data.user;
                    this.avatarError = false;
                    this.updateProfileSEO();
                })
                .catch((error) => {
                    console.error(error);
                    this.$router.push({ name: "NotFound" });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        async toggleFollow() {
            this.followLoading = true;
            await axiosInstance
                .post("/toggleFollow", {
                    followable_id: this.user.id,
                    followable_type: "User",
                })
                .then((response) => {
                    this.user.follow.hasFlollow = response.data.hasFlollow;
                    this.user.follow.numberOfFollowings = response.data.numberOfFollowings;
                    this.user.follow.numberOfFollowers = response.data.numberOfFollowers;
                })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        if (error.response.data.errorType === "login") {
                            toast.warning(this.$t("profile.toast.followLoginRequired"), {
                                theme: "colored",
                                hideProgressBar: false,
                                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                                bodyClassName: "font-YekanBakh text-gray-800",
                                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                                transition: toast.TRANSITIONS.BOUNCE,
                                position: toast.POSITION.BOTTOM_RIGHT,
                            });
                        } else if (error.response.data.errorType === "yourself") {
                            toast.error(this.$t("profile.toast.cannotFollowSelf"), {
                                theme: "colored",
                                hideProgressBar: false,
                                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                                bodyClassName: "font-YekanBakh",
                                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                                transition: toast.TRANSITIONS.BOUNCE,
                                position: toast.POSITION.BOTTOM_RIGHT,
                            });
                        }
                    }
                    console.error(error);
                })
                .finally(() => {
                    this.followLoading = false;
                });
        },
    },
    mounted() {
        this.getUserDetails();
    },
};
</script>

<style scoped>
.social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.75rem;
    color: #4b5563;
    background-color: #f3f4f6;
    transition: all 0.2s ease;
}
.dark .social-btn {
    color: #d1d5db;
    background-color: #1f2937;
}
.social-btn:hover {
    color: #fff;
    background-color: #ec4899;
    transform: translateY(-2px);
}

.stat-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0.5rem;
    border-radius: 1rem;
    background-color: #f9fafb;
    box-shadow: inset 0 0 0 1px #f3f4f6;
    transition: background-color 0.2s ease, transform 0.2s ease;
}
.dark .stat-chip {
    background-color: rgba(31, 41, 55, 0.5);
    box-shadow: inset 0 0 0 1px #1f2937;
}
.stat-chip--btn {
    cursor: pointer;
}
.stat-chip--btn:hover {
    background-color: #f3f4f6;
    transform: translateY(-2px);
}
.dark .stat-chip--btn:hover {
    background-color: #1f2937;
}
.stat-chip__value {
    font-size: 1.125rem;
    line-height: 1.5rem;
    font-weight: 800;
    color: #111827;
}
.dark .stat-chip__value {
    color: #fff;
}
.stat-chip__label {
    margin-top: 0.125rem;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #9ca3af;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-radius: 1rem;
    padding: 0.625rem 0.75rem;
    transition: background-color 0.2s ease;
}
.detail-row:hover {
    background-color: #f9fafb;
}
.dark .detail-row:hover {
    background-color: rgba(31, 41, 55, 0.5);
}
.detail-row__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    border-radius: 0.75rem;
    color: #ec4899;
    background-color: #f3f4f6;
}
.dark .detail-row__icon {
    color: #f9a8d4;
    background-color: #1f2937;
}
.detail-row__value {
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.dark .detail-row__value {
    color: #fff;
}
.detail-row__label {
    font-size: 0.75rem;
    line-height: 1rem;
    color: #9ca3af;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
