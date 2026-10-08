<template>
    <article
        class="flex flex-col h-full dark:bg-gray-900 bg-white"
        :class="variant === 'panel'
            ? 'relative overflow-visible p-4 pb-3 mb-1 rounded-xl border border-gray-100 dark:border-gray-800'
            : 'p-4 rounded-lg'">
        <template v-if="variant === 'panel'">
            <div>
                <h4 class="mb-2">
                    <router-link
                        :to="{ name: 'article-show', params: { articleSlug: localArticle.slug } }"
                        class="font-bold text-sm leading-snug transition duration-200 dark:hover:text-blue-400 hover:text-blue-700 dark:text-white text-gray-800 line-clamp-2 block">
                        {{ localArticle.title }}
                    </router-link>
                </h4>

                <div class="flex items-center justify-between gap-2 mb-1">
                    <div v-if="localArticle.user" class="flex items-center min-w-0">
                        <router-link
                            :to="{ name: 'profile-page', params: { username: localArticle.user.username } }"
                            class="rounded-full border border-gray-100 dark:border-gray-800 w-6 h-6 overflow-hidden me-2 bg-gray-100 dark:bg-gray-800 shrink-0">
                            <SeoImage
                                v-if="localArticle.user.profile_pic && !avatarImageError"
                                :src="localArticle.user.profile_pic"
                                :alt="authorName || 'نویسنده'"
                                :width="24"
                                :height="24"
                                sizes-preset="avatar"
                                img-class="w-full h-full object-cover"
                                @error="avatarImageError = true"
                            />
                        </router-link>
                        <router-link
                            :to="{ name: 'profile-page', params: { username: localArticle.user.username } }"
                            class="dark:hover:text-blue-400 dark:text-white text-gray-500 font-medium text-xs transition duration-200 hover:text-gray-800 line-clamp-1">
                            {{ authorName }}
                        </router-link>
                    </div>

                    <router-link
                        v-if="localArticle.category"
                        :to="{ name: 'articles-index', query: { category: localArticle.category.slug } }"
                        class="group shrink-0 flex dark:bg-blue-500/10 dark:text-blue-300 text-blue-500 items-center px-2 font-medium text-[10px] py-0.5 rounded bg-blue-100/50 transition duration-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                        {{ localArticle.category.title }}
                    </router-link>
                </div>
            </div>

            <div class="flex items-center pt-2 mt-1 border-t border-gray-100 dark:border-gray-800">
                    <div class="flex items-center">
                        <router-link
                            :to="{ name: 'article-show', params: { articleSlug: localArticle.slug }, hash: '#comments' }"
                            class="flex items-center px-1 h-5 rtl:ml-2 ltr:mr-2 text-xs text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-500 dark:bg-gray-500/10 dark:text-gray-400 bg-gray-500/10 rounded">
                            <svg class="rtl:ml-1 ltr:mr-1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.99646 0.827528C7.17456 0.827528 8.09169 0.881027 8.80899 1.01903C9.52386 1.15656 10.0045 1.37154 10.3411 1.66825C11.0098 2.25772 11.2804 3.32306 11.2804 5.47101C11.2804 6.85518 11.1561 7.87367 10.8215 8.53718C10.661 8.85564 10.4576 9.07995 10.2017 9.22916C9.94304 9.37996 9.59628 9.474 9.11892 9.474C8.5035 9.474 8.0416 9.61219 7.68041 9.85692C7.32786 10.0958 7.11521 10.4085 6.95703 10.6574C6.9331 10.6951 6.91069 10.7307 6.88949 10.7643C6.75685 10.9749 6.67103 11.1111 6.55187 11.2181C6.44568 11.3134 6.29728 11.3954 5.99659 11.3954C5.69593 11.3954 5.54754 11.3133 5.44133 11.218C5.32218 11.1111 5.23635 10.9749 5.10373 10.7643C5.08251 10.7307 5.0601 10.6951 5.03616 10.6574C4.87797 10.4085 4.66531 10.0958 4.31276 9.8569C3.95156 9.61218 3.48966 9.474 2.87424 9.474C2.39941 9.474 2.05376 9.37759 1.79518 9.22368C1.53855 9.07092 1.33387 8.84146 1.17225 8.51818C0.836472 7.84655 0.712507 6.82628 0.712507 5.47101C0.712507 3.35035 0.982347 2.28225 1.65335 1.68581C1.99094 1.38572 2.47232 1.1667 3.18628 1.02566C3.90284 0.884101 4.81936 0.827528 5.99646 0.827528Z" stroke="#607496" stroke-width="0.960719" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.47668 4.67017H8.39812" stroke="#607496" stroke-width="0.960719" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M3.59465 6.5918H8.39825" stroke="#607496" stroke-width="0.960719" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            {{ formatNumber(localArticle.comments_count || 0) }}
                        </router-link>

                        <button
                            type="button"
                            @click.prevent="handleLike"
                            :disabled="likeLoading"
                            class="flex items-center px-1 h-5 rtl:ml-2 ltr:mr-2 text-xs text-rose-500 dark:hover:bg-rose-700 dark:text-red-500 font-medium bg-red-400 dark:bg-opacity-20 bg-opacity-10 rounded hover:bg-opacity-100 hover:text-white dark:hover:text-white transition duration-200">
                            <svg v-if="isLoggedin && userHasLiked" class="rtl:ml-1 ltr:mr-1 -mt-0.5" width="13" height="11" fill="none" viewBox="0 0 15 13" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="M4.75 0.624878C5.80649 0.624878 6.77021 1.15065 7.5 1.74964C8.22979 1.15065 9.19351 0.624878 10.25 0.624878C12.5282 0.624878 14.375 2.31858 14.375 4.40774C14.375 8.62007 9.57964 11.0733 7.99879 11.7676C7.68036 11.9075 7.31964 11.9075 7.00121 11.7676C5.42036 11.0733 0.625 8.61997 0.625 4.40764C0.625 2.31848 2.47183 0.624878 4.75 0.624878Z" stroke-width="0.771644" />
                            </svg>
                            <svg v-else class="rtl:ml-1 ltr:mr-1 -mt-0.5" width="13" height="11" fill="none" viewBox="0 0 15 13" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="currentColor" d="M4.75 0.624878C5.80649 0.624878 6.77021 1.15065 7.5 1.74964C8.22979 1.15065 9.19351 0.624878 10.25 0.624878C12.5282 0.624878 14.375 2.31858 14.375 4.40774C14.375 8.62007 9.57964 11.0733 7.99879 11.7676C7.68036 11.9075 7.31964 11.9075 7.00121 11.7676C5.42036 11.0733 0.625 8.61997 0.625 4.40764C0.625 2.31848 2.47183 0.624878 4.75 0.624878Z" stroke-width="0.771644" />
                            </svg>
                            {{ formatNumber(likesCount) }}
                        </button>

                        <button
                            v-if="isLoggedin"
                            type="button"
                            @click.prevent="toggleBookmark"
                            :disabled="bookmarkLoading"
                            class="flex items-center justify-center px-1.5 h-5 rtl:ml-2 ltr:mr-2 text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-400 dark:bg-opacity-20 bg-opacity-10 rounded hover:bg-opacity-100 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition duration-200">
                            <svg v-if="localArticle.bookmarked" class="w-3.5 h-[15px] shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M21 11.0975V16.0909C21 19.1875 21 20.7358 20.2659 21.4123C19.9158 21.735 19.4739 21.9377 19.0031 21.9915C18.016 22.1045 16.8633 21.0849 14.5578 19.0458C13.5388 18.1445 13.0292 17.6938 12.4397 17.5751C12.1494 17.5166 11.8506 17.5166 11.5603 17.5751C10.9708 17.6938 10.4612 18.1445 9.44216 19.0458C7.13673 21.0849 5.98402 22.1045 4.99692 21.9915C4.52615 21.9377 4.08421 21.735 3.73411 21.4123C3 20.7358 3 19.1875 3 16.0909V11.0975C3 6.80891 3 4.6646 4.31802 3.3323C5.63604 2 7.75736 2 12 2C16.2426 2 18.364 2 19.682 3.3323C21 4.6646 21 6.80891 21 11.0975ZM8.25 6C8.25 5.58579 8.58579 5.25 9 5.25H15C15.4142 5.25 15.75 5.58579 15.75 6C15.75 6.41421 15.4142 6.75 15 6.75H9C8.58579 6.75 8.25 6.41421 8.25 6Z" />
                            </svg>
                            <svg v-else class="w-3.5 h-[15px] shrink-0" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="currentColor" d="M2.51974 10.651L2.51972 10.651L2.51551 10.654C2.00961 11.009 1.31115 10.6877 1.26272 10.0631C1.20578 9.32899 1.12994 7.98392 1.12995 6.02793V5.99265V5.99264C1.12994 5.21616 1.13036 4.53967 1.18575 3.97518C1.24191 3.40288 1.35849 2.89041 1.62915 2.47298C2.19514 1.60008 3.28533 1.34809 4.99817 1.34104C6.71301 1.33397 7.80474 1.58477 8.37131 2.46321C8.64158 2.88225 8.75804 3.39711 8.81416 3.97134C8.86955 4.538 8.86997 5.21625 8.86995 5.993V6.02794C8.86995 7.98392 8.7941 9.32899 8.73716 10.0631C8.68873 10.6877 7.99029 11.009 7.48439 10.654L7.48441 10.654L7.48016 10.651C7.03638 10.3475 6.6257 10.0207 6.30567 9.76593L6.29989 9.76133C6.15447 9.64555 6.02249 9.54047 5.91897 9.46373C5.7247 9.31973 5.56248 9.2214 5.41218 9.16087C5.24859 9.095 5.11648 9.08089 4.99995 9.08089C4.88342 9.08089 4.75131 9.095 4.58772 9.16088C4.43742 9.2214 4.2752 9.31973 4.08093 9.46373C3.97737 9.54049 3.8453 9.64565 3.69982 9.76147L3.69423 9.76592C3.3742 10.0207 2.96352 10.3475 2.51974 10.651Z" stroke-width="0.86" stroke-linecap="round" stroke-linejoin="round" />
                                <path stroke="currentColor" d="M5.86 3.06262C6.29 3.06262 6.505 3.06099 6.8275 3.38265C7.15 3.70432 7.15 4.78095 7.15 5.21094" stroke-width="0.86" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

            <div
                class="absolute bottom-0 end-3 z-10 w-[5.5rem] h-[3.5rem] sm:w-[6rem] sm:h-[3.5rem] translate-y-[40%] overflow-hidden rounded-md shadow-lg bg-gray-100 dark:bg-gray-800">
                <router-link
                    :to="{ name: 'article-show', params: { articleSlug: localArticle.slug } }"
                    class="block w-full h-full overflow-hidden">
                    <SeoImage
                        v-if="localArticle.cover_image && !coverImageError"
                        :src="localArticle.cover_image"
                        :alt="localArticle.title || 'مقاله'"
                        :width="192"
                        :height="112"
                        sizes-preset="thumb"
                        img-class="w-full h-full object-cover transition duration-200 transform hover:scale-105"
                        @error="coverImageError = true"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                        <svg class="w-7 h-7 opacity-40" viewBox="0 0 24 24" fill="none">
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.2" />
                        </svg>
                    </div>
                </router-link>
            </div>
        </template>

        <template v-else>
        <router-link
            :to="{ name: 'article-show', params: { articleSlug: localArticle.slug } }"
            class="rounded flex w-full md:h-40 sm:h-60 h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
            <SeoImage
                v-if="localArticle.cover_image && !coverImageError"
                :src="localArticle.cover_image"
                :alt="localArticle.title || 'مقاله'"
                :width="640"
                :height="360"
                sizes-preset="card"
                img-class="sepia hover:sepia w-full h-full object-cover transform transition duration-200 hover:scale-110"
                @error="coverImageError = true"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                <svg class="w-12 h-12 opacity-40" viewBox="0 0 24 24" fill="none">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.2" />
                </svg>
            </div>
        </router-link>

        <div class="flex flex-col flex-1">
            <div class="flex flex-col flex-grow">
                <h4 class="mt-3 mb-4">
                    <router-link
                        :to="{ name: 'article-show', params: { articleSlug: localArticle.slug } }"
                        class="font-bold transition duration-200 dark:hover:text-blue-400 hover:text-blue-700 dark:text-white text-gray-800 overflow-hidden block">
                        {{ localArticle.title }}
                    </router-link>
                </h4>
            </div>

            <div>
                <div class="flex items-center justify-between mb-4">
                    <div v-if="localArticle.user" class="flex items-center justify-between">
                        <router-link
                        :to="{ name: 'profile-page', params: { username: localArticle.user.username } }" class="rounded-full border border-gray-100 dark:border-gray-800 w-6 h-6 overflow-hidden me-1 bg-gray-100 dark:bg-gray-800 shrink-0">
                            <SeoImage
                                v-if="localArticle.user.profile_pic && !avatarImageError"
                                :src="localArticle.user.profile_pic"
                                :alt="authorName || 'نویسنده'"
                                :width="24"
                                :height="24"
                                sizes-preset="avatar"
                                img-class="w-full h-full object-cover hover:scale-105 duration-150"
                                @error="avatarImageError = true"
                            />
                        </router-link>
                        <b>
                            <router-link
                                :to="{ name: 'profile-page', params: { username: localArticle.user.username } }"
                                class="dark:hover:text-blue-400 dark:text-white text-gray-400 font-medium text-xs transition duration-200 hover:text-gray-800">
                                {{ authorName }}
                            </router-link>
                        </b>
                    </div>

                    <div v-if="localArticle.category" class="flex items-center space-x-reverse space-x-2">
                        <router-link
                            :to="{ name: 'articles-index', query: { category: localArticle.category.slug } }"
                            class="group flex dark:bg-blue-500/10 dark:text-blue-300 text-blue-700 items-center px-2 font-medium text-xs py-1 rounded bg-blue-100 transition duration-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                            <svg class="rtl:ml-1 ltr:mr-1" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path class="fill-current transition duration-200 text-blue-700 group-hover:text-white dark:text-blue-300" fill-rule="evenodd" clip-rule="evenodd" d="M5.00525 4.99988C4.77513 4.99988 4.58858 5.18643 4.58858 5.41654C4.58858 5.64666 4.77513 5.83321 5.00525 5.83321L6.67725 5.83321C6.90737 5.83321 7.09392 5.64666 7.09392 5.41654C7.09392 5.18643 6.90737 4.99988 6.67725 4.99988H5.00525ZM3.3335 6.67224C3.10338 6.67224 2.91683 6.85879 2.91683 7.08891C2.91683 7.31903 3.10338 7.50557 3.3335 7.50557L6.6775 7.50557C6.90762 7.50557 7.09416 7.31903 7.09416 7.08891C7.09416 6.85879 6.90762 6.67224 6.6775 6.67224L3.3335 6.67224Z" />
                                <path class="stroke-current transition duration-200 text-blue-700 group-hover:text-white dark:text-blue-300" d="M7.08323 2.17834C6.6357 2.13634 6.1178 2.11907 5.52165 2.11907C1.83979 2.11907 0.958571 2.77779 0.528906 5.85116C0.46337 6.31993 0.424047 6.73253 0.41753 7.09518M7.08323 2.17834C9.3997 2.39569 9.83099 3.27541 9.47089 5.85116C9.04123 8.92452 8.16001 9.58323 4.47814 9.58323C1.35787 9.58323 0.381319 9.11014 0.41753 7.09518M7.08323 2.17834C7.08323 2.17834 7.14666 1.79476 7.08323 1.28972C6.92699 0.0456842 1.79278 0.208173 1.24992 1.28972C0.417377 2.9484 0.41753 7.09518 0.41753 7.09518" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            {{ localArticle.category.title }}
                        </router-link>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <router-link
                            :to="{ name: 'article-show', params: { articleSlug: localArticle.slug }, hash: '#comments' }"
                            class="flex items-center px-1 h-5 rtl:ml-2 ltr:mr-2 text-xs text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-500 dark:bg-gray-500/10 dark:text-gray-400 bg-gray-500/10 rounded">
                            <svg class="rtl:ml-1 ltr:mr-1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.99646 0.827528C7.17456 0.827528 8.09169 0.881027 8.80899 1.01903C9.52386 1.15656 10.0045 1.37154 10.3411 1.66825C11.0098 2.25772 11.2804 3.32306 11.2804 5.47101C11.2804 6.85518 11.1561 7.87367 10.8215 8.53718C10.661 8.85564 10.4576 9.07995 10.2017 9.22916C9.94304 9.37996 9.59628 9.474 9.11892 9.474C8.5035 9.474 8.0416 9.61219 7.68041 9.85692C7.32786 10.0958 7.11521 10.4085 6.95703 10.6574C6.9331 10.6951 6.91069 10.7307 6.88949 10.7643C6.75685 10.9749 6.67103 11.1111 6.55187 11.2181C6.44568 11.3134 6.29728 11.3954 5.99659 11.3954C5.69593 11.3954 5.54754 11.3133 5.44133 11.218C5.32218 11.1111 5.23635 10.9749 5.10373 10.7643C5.08251 10.7307 5.0601 10.6951 5.03616 10.6574C4.87797 10.4085 4.66531 10.0958 4.31276 9.8569C3.95156 9.61218 3.48966 9.474 2.87424 9.474C2.39941 9.474 2.05376 9.37759 1.79518 9.22368C1.53855 9.07092 1.33387 8.84146 1.17225 8.51818C0.836472 7.84655 0.712507 6.82628 0.712507 5.47101C0.712507 3.35035 0.982347 2.28225 1.65335 1.68581C1.99094 1.38572 2.47232 1.1667 3.18628 1.02566C3.90284 0.884101 4.81936 0.827528 5.99646 0.827528Z" stroke="#607496" stroke-width="0.960719" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.47668 4.67017H8.39812" stroke="#607496" stroke-width="0.960719" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M3.59465 6.5918H8.39825" stroke="#607496" stroke-width="0.960719" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            {{ formatNumber(localArticle.comments_count || 0) }}
                        </router-link>

                        <button
                            type="button"
                            @click.prevent="handleLike"
                            :disabled="likeLoading"
                            class="flex items-center px-1 h-5 rtl:ml-2 ltr:mr-2 text-xs text-rose-500 dark:hover:bg-rose-700 dark:text-red-500 font-medium bg-red-400 dark:bg-opacity-20 bg-opacity-10 rounded hover:bg-opacity-100 hover:text-white dark:hover:text-white transition duration-200"
                        >
                            <svg
                                v-if="isLoggedin && userHasLiked"
                                class="rtl:ml-1 ltr:mr-1 -mt-0.5"
                                width="13"
                                height="11"
                                fill="none"
                                viewBox="0 0 15 13"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill="currentColor"
                                    d="M4.75 0.624878C5.80649 0.624878 6.77021 1.15065 7.5 1.74964C8.22979 1.15065 9.19351 0.624878 10.25 0.624878C12.5282 0.624878 14.375 2.31858 14.375 4.40774C14.375 8.62007 9.57964 11.0733 7.99879 11.7676C7.68036 11.9075 7.31964 11.9075 7.00121 11.7676C5.42036 11.0733 0.625 8.61997 0.625 4.40764C0.625 2.31848 2.47183 0.624878 4.75 0.624878Z"
                                    stroke-width="0.771644"
                                />
                            </svg>
                            <svg
                                v-else
                                class="rtl:ml-1 ltr:mr-1 -mt-0.5"
                                width="13"
                                height="11"
                                fill="none"
                                viewBox="0 0 15 13"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke="currentColor"
                                    d="M4.75 0.624878C5.80649 0.624878 6.77021 1.15065 7.5 1.74964C8.22979 1.15065 9.19351 0.624878 10.25 0.624878C12.5282 0.624878 14.375 2.31858 14.375 4.40774C14.375 8.62007 9.57964 11.0733 7.99879 11.7676C7.68036 11.9075 7.31964 11.9075 7.00121 11.7676C5.42036 11.0733 0.625 8.61997 0.625 4.40764C0.625 2.31848 2.47183 0.624878 4.75 0.624878Z"
                                    stroke-width="0.771644"
                                />
                            </svg>
                            {{ formatNumber(likesCount) }}
                        </button>
              
              

                        <button
                            v-if="isLoggedin"
                            type="button"
                            @click.prevent="toggleBookmark"
                            :disabled="bookmarkLoading"
                            class="flex items-center justify-center px-1.5 h-5 rtl:ml-2 ltr:mr-2 text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-400 dark:bg-opacity-20 bg-opacity-10 rounded hover:bg-opacity-100 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition duration-200"
                        >
                            <svg
                                v-if="localArticle.bookmarked"
                                class="w-3.5 h-[15px] shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    fill="currentColor"
                                    d="M21 11.0975V16.0909C21 19.1875 21 20.7358 20.2659 21.4123C19.9158 21.735 19.4739 21.9377 19.0031 21.9915C18.016 22.1045 16.8633 21.0849 14.5578 19.0458C13.5388 18.1445 13.0292 17.6938 12.4397 17.5751C12.1494 17.5166 11.8506 17.5166 11.5603 17.5751C10.9708 17.6938 10.4612 18.1445 9.44216 19.0458C7.13673 21.0849 5.98402 22.1045 4.99692 21.9915C4.52615 21.9377 4.08421 21.735 3.73411 21.4123C3 20.7358 3 19.1875 3 16.0909V11.0975C3 6.80891 3 4.6646 4.31802 3.3323C5.63604 2 7.75736 2 12 2C16.2426 2 18.364 2 19.682 3.3323C21 4.6646 21 6.80891 21 11.0975ZM8.25 6C8.25 5.58579 8.58579 5.25 9 5.25H15C15.4142 5.25 15.75 5.58579 15.75 6C15.75 6.41421 15.4142 6.75 15 6.75H9C8.58579 6.75 8.25 6.41421 8.25 6Z"
                                />
                            </svg>
                            <svg
                                v-else
                                class="w-3.5 h-[15px] shrink-0"
                                viewBox="0 0 10 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke="currentColor"
                                    d="M2.51974 10.651L2.51972 10.651L2.51551 10.654C2.00961 11.009 1.31115 10.6877 1.26272 10.0631C1.20578 9.32899 1.12994 7.98392 1.12995 6.02793V5.99265V5.99264C1.12994 5.21616 1.13036 4.53967 1.18575 3.97518C1.24191 3.40288 1.35849 2.89041 1.62915 2.47298C2.19514 1.60008 3.28533 1.34809 4.99817 1.34104C6.71301 1.33397 7.80474 1.58477 8.37131 2.46321C8.64158 2.88225 8.75804 3.39711 8.81416 3.97134C8.86955 4.538 8.86997 5.21625 8.86995 5.993V6.02794C8.86995 7.98392 8.7941 9.32899 8.73716 10.0631C8.68873 10.6877 7.99029 11.009 7.48439 10.654L7.48441 10.654L7.48016 10.651C7.03638 10.3475 6.6257 10.0207 6.30567 9.76593L6.29989 9.76133C6.15447 9.64555 6.02249 9.54047 5.91897 9.46373C5.7247 9.31973 5.56248 9.2214 5.41218 9.16087C5.24859 9.095 5.11648 9.08089 4.99995 9.08089C4.88342 9.08089 4.75131 9.095 4.58772 9.16088C4.43742 9.2214 4.2752 9.31973 4.08093 9.46373C3.97737 9.54049 3.8453 9.64565 3.69982 9.76147L3.69423 9.76592C3.3742 10.0207 2.96352 10.3475 2.51974 10.651Z"
                                    stroke-width="0.86"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    stroke="currentColor"
                                    d="M5.86 3.06262C6.29 3.06262 6.505 3.06099 6.8275 3.38265C7.15 3.70432 7.15 4.78095 7.15 5.21094"
                                    stroke-width="0.86"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    <div class="flex items-center font-light text-[10px] dark:text-gray-500 text-gray-400">
                        <svg class="rtl:ml-1 ltr:mr-1" width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.60509 1.45136C2.44111 1.61533 2.36357 1.8075 2.33008 2.00642C2.93427 1.89004 3.6854 1.84615 4.61527 1.84615C5.54514 1.84615 6.29627 1.89004 6.90046 2.00642C6.86697 1.8075 6.78942 1.61533 6.62545 1.45136C6.37407 1.19998 5.82701 0.923077 4.61527 0.923077C3.40353 0.923077 2.85647 1.19998 2.60509 1.45136ZM1.95237 0.798643C1.44953 1.30148 1.38477 1.91343 1.3845 2.30521C0.299759 2.83849 -0.000112534 3.92458 -0.000112534 6C-0.000112534 8.07542 0.299759 9.16151 1.3845 9.69479C1.38477 10.0866 1.44953 10.6985 1.95237 11.2014C2.45099 11.7 3.28854 12 4.61527 12C5.942 12 6.77955 11.7 7.27817 11.2014C7.78101 10.6985 7.84577 10.0866 7.84604 9.69479C8.93079 9.16151 9.23066 8.07542 9.23066 6C9.23066 3.92458 8.93079 2.83849 7.84604 2.30521C7.84577 1.91344 7.78101 1.30149 7.27817 0.798644C6.77955 0.300024 5.942 0 4.61527 0C3.28854 0 2.45099 0.300024 1.95237 0.798643ZM6.90046 9.99358C6.29626 10.11 5.54514 10.1538 4.61527 10.1538C3.68541 10.1538 2.93428 10.11 2.33008 9.99358C2.36357 10.1925 2.44111 10.3847 2.60509 10.5486C2.85647 10.8 3.40353 11.0769 4.61527 11.0769C5.82701 11.0769 6.37407 10.8 6.62545 10.5486C6.78943 10.3847 6.86696 10.1925 6.90046 9.99358ZM1.4998 8.67356C1.15669 8.36477 0.922964 7.73297 0.922964 6C0.922964 4.26703 1.15669 3.63523 1.4998 3.32643C1.67362 3.16999 1.9565 3.02236 2.47171 2.91931C2.99245 2.81515 3.68384 2.76923 4.61527 2.76923C5.54671 2.76923 6.2381 2.81515 6.75883 2.91931C7.27405 3.02236 7.55692 3.16999 7.73075 3.32643C8.07385 3.63523 8.30758 4.26703 8.30758 6C8.30758 7.73297 8.07385 8.36477 7.73075 8.67356C7.55692 8.83001 7.27405 8.97764 6.75883 9.08069C6.2381 9.18485 5.54671 9.23077 4.61527 9.23077C3.68384 9.23077 2.99245 9.18485 2.47171 9.08069C1.9565 8.97764 1.67362 8.83001 1.4998 8.67356Z" fill="currentColor" />
                            <path d="M4.61548 4.15381C4.61548 4.15381 4.61548 5.07689 4.61548 5.53842C4.61548 5.99996 4.61547 5.99996 5.07702 5.99996C5.53856 5.99996 6.92317 5.99996 6.92317 5.99996" stroke="currentColor" stroke-width="0.923077" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {{ $t('articles.card.readTime', { min: formatNumber(localArticle.reading_time_minutes || 1) }) }}
                    </div>
                </div>
            </div>
        </div>
        </template>
    </article>
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import SeoImage from "@/views/components/seo/SeoImage.vue";

export default {
    components: { SeoImage },
    props: {
        article: { type: Object, required: true },
        variant: { type: String, default: "default" },
    },
    data() {
        return {
            localArticle: { ...this.article },
            bookmarkLoading: false,
            likeLoading: false,
            userHasLiked: !!this.article.user_has_liked,
            likesCount: this.article.likes_count || 0,
            coverImageError: false,
            avatarImageError: false,
        };
    },
    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        authorName() {
            const u = this.localArticle.user;
            if (!u) return "";
            return [u.first_name, u.last_name].filter(Boolean).join(" ");
        },
    },
    watch: {
        article: {
            deep: true,
            handler(val) {
                this.localArticle = { ...val };
                this.userHasLiked = !!val.user_has_liked;
                this.likesCount = val.likes_count || 0;
                this.coverImageError = false;
                this.avatarImageError = false;
            },
        },
    },
    methods: {
        formatNumber(n) {
            return new Intl.NumberFormat(this.$i18n.locale === "fa" ? "fa-IR" : "en-US").format(n || 0);
        },
        handleLike() {
            if (!this.isLoggedin) {
                this.$router.push({ name: "login" });
                return;
            }
            this.toggleLike();
        },
        async toggleBookmark() {
            this.bookmarkLoading = true;
            try {
                const res = await axiosInstance.post("/toggleBookmark", {
                    bookmarkable_id: this.localArticle.id,
                    bookmarkable_type: "Article",
                });
                this.localArticle.bookmarked = res.data.bookmarked;
            } finally {
                this.bookmarkLoading = false;
            }
        },
        async toggleLike() {
            this.likeLoading = true;
            try {
                const res = await axiosInstance.post("/toggleLike", {
                    likeable_id: this.localArticle.id,
                    likeable_type: "Article",
                });
                this.userHasLiked = res.data.user_has_liked;
                this.likesCount = res.data.likes_count;
            } finally {
                this.likeLoading = false;
            }
        },
    },
};
</script>
