<template>
    <AdminInlineLoading v-if="loading" />
    <div v-if="course">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2 border border-gray-200 dark:border-opacity-10 p-2 md:p-4 text-sm rounded-xl">
                <div class="text-gray-800 dark:text-gray-100 font-bold">توضیحات کوتاه</div>
                <div class="mt-2 text-gray-400 dark:text-gray-500 line-clamp-2 leading-7">
                    {{ course.short_description }}
                </div>
            </div>
            <router-link :to="{ name: 'profile-page', params: { username: course.teacher.username } }"
                class="border border-gray-200 dark:border-opacity-10 p-2 md:p-4 text-sm rounded-xl flex items-center">
                <div class="me-3 border-2 rounded-3xl w-20 h-20 overflow-hidden">
                    <img onerror="this.style.display='none'" :src="course.teacher.profile_pic" :alt="course.teacher.username"
                        class="w-full h-full object-cover duration-200 hover:scale-105" />
                </div>
                <div class="space-y-1">
                    <div class="text-gray-400 dark:text-gray-400 text-sm">مدرس</div>
                    <div class="text-gray-700 dark:text-gray-100 text-sm font-bold">{{ course.teacher.first_name + `
                        ` + course.teacher.last_name }}</div>
                    <div dir="ltr" class="text-gray-400 dark:text-gray-400 text-sm">@{{ course.teacher.username }}
                    </div>
                </div>
            </router-link>
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div class="md:col-span-3 border border-gray-200 dark:border-opacity-10 p-2 md:p-4 text-sm rounded-xl">
                <div class="text-gray-800 dark:text-gray-100 font-bold flex items-center justify-between">
                    توضیحات
                    <button @click.prevent="openDescriptionModal" class="flex items-center" title="مشاهده کامل">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                        </svg>
                    </button>
                </div>
                <div class="mt-2 text-gray-400 dark:text-gray-500 line-clamp-3 leading-7">
                    <MarkdownRenderer :source="course.description"></MarkdownRenderer>
                </div>
            </div>
            <div class="md:col-span-2">
                <div class="grid grid-cols-2 gap-4">
                    <div class="border border-gray-200 dark:border-opacity-10 p-2 md:p-4 text-sm rounded-xl">
                        <div class="space-y-3">
                            <div class="text-gray-800 dark:text-gray-100 font-bold">تعداد گواهینامه صادره</div>
                            <div class="text-gray-400 dark:text-gray-500 font-extrabold">{{ course.certificatesCount
                            }}</div>
                        </div>
                        <div class="mt-2 space-y-3">
                            <div class="text-gray-800 dark:text-gray-100 font-bold">فروش کلی دوره</div>
                            <div class="text-gray-500 dark:text-gray-300 font-bold flex items-center">
                                {{ course.totalSales.toLocaleString() }}
                                <svg class="ms-1 w-3 h-3" viewBox="0 0 14 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path class="text-gray-600 dark:text-white"
                                        d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C11.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z"
                                        fill="currentColor"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="border border-gray-200 dark:border-opacity-10 p-2 md:p-4 text-sm rounded-xl">
                            <div class="space-y-1">
                                <div class="text-gray-800 dark:text-gray-100 font-bold">تاریخ شروع</div>
                                <div class="text-gray-400 dark:text-gray-500">
                                    <span v-if="course.start_date">
                                        {{ new Date(course.start_date).toLocaleDateString('fa-IR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) }}
                                    </span>
                                    <span v-else class="flex items-center">
                                        تاریخی وارد نشده است.
                                        <router-link
                                            class="text-gray-800 dark:text-gray-50 hover:text-amber-400 dark:hover:text-amber-400"
                                            :to="{ name: 'admin-course-edit', params: { courseSlug: courseSlug }, hash: '#start_date' }">
                                            <svg class="w-6 h-6 ms-2 rtl:-mt-0.5" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H12.75V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V12.75H8C7.58579 12.75 7.25 12.4142 7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H11.25V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                                                    fill="currentColor"></path>
                                            </svg>
                                        </router-link>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="border border-gray-200 dark:border-opacity-10 p-2 md:p-4 text-sm rounded-xl">
                            <div class="space-y-1">
                                <div class="text-gray-800 dark:text-gray-100 font-bold">تاریخ پایان</div>
                                <div class="text-gray-400 dark:text-gray-500">
                                    <span v-if="course.end_date">
                                        {{ new Date(course.end_date).toLocaleDateString('fa-IR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) }}
                                    </span>
                                    <span v-else class="flex items-center">
                                        تاریخی وارد نشده است.
                                        <router-link
                                            class="text-gray-800 dark:text-gray-50 hover:text-amber-400 dark:hover:text-amber-400"
                                            :to="{ name: 'admin-course-edit', params: { courseSlug: courseSlug }, hash: '#end_date' }">
                                            <svg class="w-6 h-6 ms-2 rtl:-mt-0.5" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H12.75V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V12.75H8C7.58579 12.75 7.25 12.4142 7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H11.25V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                                                    fill="currentColor"></path>
                                            </svg>
                                        </router-link>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-7 gap-4">
            <div class="md:col-span-3 text-sm">
                <div class="space-y-3">
                    <div class="text-gray-800 dark:text-gray-100 font-bold">آخرین فعالیت‌ها</div>
                    <div
                        class="max-h-[16rem] overflow-y-auto custom-scrollbar space-y-2 lg:border border-gray-200 dark:border-opacity-10 lg:p-2 rounded-xl">
                        <div>
                            <div class="mb-3 text-gray-600 dark:text-gray-300 text-xs font-medium">آخرین کامنت‌ها</div>
                            <div v-if="course.recent_activities.comments && course.recent_activities.comments.length > 0"
                                class="space-y-2">

                                <div v-for="(comment, index) in course.recent_activities.comments" :key="index"
                                    class="border border-gray-200 dark:border-opacity-10 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-2 md:p-4">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <router-link
                                                :to="{ name: 'profile-page', params: { username: comment.user.username } }"
                                                class="w-10 h-10 overflow-hidden rounded-full border-2 border-gray-400">
                                                <img onerror="this.style.display='none'" :src="comment.user.profile_pic"
                                                    class="w-full h-full object-cover hover:scale-105 duration-150" />
                                            </router-link>
                                            <div class="ms-1.5">
                                                <router-link
                                                    :to="{ name: 'profile-page', params: { username: comment.user.username } }"
                                                    class="text-gray-700 dark:text-gray-100 text-xs font-semibold line-clamp-1">
                                                    {{ comment.user.first_name + ' ' + comment.user.last_name }}
                                                </router-link>
                                                <div class="mt-0.5 text-gray-400 dark:text-gray-400 text-xs font-light">
                                                    {{ timeAgo(comment.created_at) }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-1 rtl:space-x-reverse">
                                            <button @click.prevent="openReplyCommentModal(comment)"
                                                class="whitespace-nowrap bg-gray-400/20 text-xs font-semibold px-2 py-1 rounded-md text-gray-800 dark:text-gray-200 flex items-center">
                                                پاسخ
                                                <svg class="shrink-0 ms-2 w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M3.3437 9.02975C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C4.00549 17.7916 6.20841 19.9945 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C17.7916 19.9945 19.9945 17.7916 20.6563 14.9703C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20842 17.7916 4.00549 14.9703 3.3437C13.0166 2.88543 10.9834 2.88544 9.02975 3.3437C6.20842 4.00549 4.00549 6.20841 3.3437 9.02975ZM11.467 14.8175C11.2327 15.0518 10.8528 15.0518 10.6184 14.8175L8.22523 12.4243C8.11271 12.3117 8.0495 12.1591 8.0495 12C8.0495 11.8409 8.11271 11.6883 8.22523 11.5757L10.6184 9.18252C10.8528 8.94821 11.2327 8.94821 11.467 9.18252C11.7013 9.41684 11.7013 9.79673 11.467 10.031L10.098 11.4H15.3505C15.6819 11.4 15.9505 11.6686 15.9505 12C15.9505 12.3314 15.6819 12.6 15.3505 12.6L10.098 12.6L11.467 13.969C11.7013 14.2033 11.7013 14.5832 11.467 14.8175Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </button>
                                            <button v-if="!comment.approved"
                                                @click.prevent="commentToggleApproval(comment, index)"
                                                :disabled="loadingComments[index]"
                                                class="disabled:opacity-60 whitespace-nowrap bg-green-400/20 text-xs font-semibold px-2 py-1 rounded-md text-green-500 flex items-center">
                                                تاییدکردن
                                                <svg class="shrink-0 ms-2 w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">

                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </button>
                                            <button v-else @click.prevent="commentToggleApproval(comment, index)"
                                                :disabled="loadingComments[index]"
                                                class="disabled:opacity-60 whitespace-nowrap bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-md text-gray-800 flex items-center">
                                                عدم تایید
                                                <svg class="shrink-0 ms-1 w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM12 10.0854C12.5287 10.0854 12.9573 9.65681 12.9573 9.12812C12.9573 8.59942 12.5287 8.17083 12 8.17083C11.4713 8.17083 11.0427 8.59942 11.0427 9.12812C11.0427 9.65681 11.4713 10.0854 12 10.0854ZM12 10.8034C12.3965 10.8034 12.7179 11.1248 12.7179 11.5213V15.3505C12.7179 15.747 12.3965 16.0684 12 16.0684C11.6035 16.0684 11.282 15.747 11.282 15.3505V11.5213C11.282 11.1248 11.6035 10.8034 12 10.8034Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <hr class="border-t border-dashed border-gray-200 dark:border-opacity-20 my-1.5">
                                    <div class="text-xs font-light text-gray-500 dark:text-gray-300 line-clamp-1 m-1">
                                        {{ comment.comment }}
                                    </div>
                                </div>
                            </div>
                            <div v-else class="my-4 text-gray-400 dark:text-gray-400 font-semibold text-xs text-center">
                                چیزی
                                برای نمایش وجود ندارد.</div>
                        </div>
                        <div class="">
                            <div class="mb-3 text-gray-600 dark:text-gray-300 text-xs font-medium">آخرین کاربران ثبت
                                نامی در این دوره:</div>

                            <div v-if="course.recent_activities.registrations && course.recent_activities.registrations.length > 0"
                                class="space-y-2">
                                <div v-for="(user, index) in course.recent_activities.registrations" :key="index"
                                    class="border border-gray-200 dark:border-opacity-10 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-2 md:p-4">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <router-link
                                                :to="{ name: 'profile-page', params: { username: user.username } }"
                                                class="w-10 h-10 overflow-hidden rounded-full border-2 border-gray-400">
                                                <img onerror="this.style.display='none'" :src="user.profile_pic"
                                                    class="w-full h-full object-cover hover:scale-105 duration-150" />
                                            </router-link>
                                            <div class="ms-1.5">
                                                <router-link
                                                    :to="{ name: 'profile-page', params: { username: user.username } }"
                                                    class="text-gray-700 dark:text-gray-100 text-xs font-semibold line-clamp-1">
                                                    {{ user.first_name + ' ' + user.last_name }}
                                                </router-link>
                                                <div dir="ltr"
                                                    class="mt-0.5 text-gray-400 dark:text-gray-400 text-xs font-light">
                                                    @{{ user.username }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-gray-400 dark:text-gray-400 text-xs font-medium">
                                            {{ timeAgo(user.registered_at) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="my-4 text-gray-400 dark:text-gray-400 font-semibold text-xs text-center">
                                چیزی برای نمایش وجود ندارد.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:col-span-4 text-sm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="">
                        <div class="text-gray-800 dark:text-gray-100 font-bold flex items-center">
                            <svg class="w-4 h-4 me-2" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"
                                fill="currentColor">
                                <path
                                    d="M343.656,451.109C410,411.438,454.422,338.906,454.422,256c0-125.484-101.719-227.219-227.203-227.219 C101.719,28.781,0,130.516,0,256s101.719,227.219,227.219,227.219H512v-32.109H343.656z M318.484,145.875 c23.547-13.594,53.641-5.531,67.234,18.016s5.531,53.656-18.016,67.25c-23.547,13.578-53.641,5.516-67.234-18.016 C286.859,189.563,294.938,159.469,318.484,145.875z M300.453,297.688c13.609-23.547,43.703-31.609,67.25-18.016 c23.547,13.609,31.609,43.703,18.016,67.25s-43.688,31.609-67.25,18.016C294.938,351.344,286.859,321.234,300.453,297.688z M227.219,72.375c27.188,0,49.219,22.031,49.219,49.219s-22.031,49.25-49.219,49.25s-49.25-22.063-49.25-49.25 S200.031,72.375,227.219,72.375z M249.938,256c0,12.563-10.172,22.719-22.719,22.719c-12.563,0-22.719-10.156-22.719-22.719 s10.156-22.719,22.719-22.719C239.766,233.281,249.938,243.438,249.938,256z M68.703,163.891 c13.594-23.547,43.703-31.609,67.25-18.016s31.609,43.688,18.016,67.25c-13.594,23.531-43.703,31.609-67.25,18.016 C63.188,217.547,55.109,187.438,68.703,163.891z M135.969,364.938c-23.563,13.594-53.656,5.531-67.266-18.016 c-13.578-23.547-5.516-53.656,18.016-67.266c23.547-13.594,53.656-5.516,67.25,18.031S159.5,351.344,135.969,364.938z M177.969,389.203c0-27.188,22.063-49.234,49.25-49.234s49.219,22.047,49.219,49.234s-22.031,49.234-49.219,49.234 S177.969,416.391,177.969,389.203z">
                                </path>
                            </svg>
                            تریلر
                        </div>
                        <div
                            class="mt-3 p-2 md:p-4 border border-dashed border-gray-200 dark:border-opacity-20 rounded-xl">
                            <div v-if="course.trailer" class="space-y-1.5">
                                <div v-if="processingStatus.trailer === 'processed'"
                                    class="border border-dashed border-green-500 bg-green-400/20 p-1.5 rounded-md font-medium text-xs text-green-500">
                                    <span class="flex items-center">
                                        <svg class="w-4 h-4 me-1" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
                                                fill="currentColor"></path>
                                        </svg>
                                        ویدیو پردازش شده است.
                                    </span>
                                </div>
                                <div v-else
                                    class="border border-dashed border-amber-500 bg-yellow-400/20 p-1.5 rounded-md font-medium text-xs text-amber-500 flex items-center justify-between">
                                    <span class="flex items-center">
                                        <svg class="w-4 h-4 me-1" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
                                                fill="currentColor"></path>
                                        </svg>
                                        <template v-if="processingStatus.trailer === 'queued'">در صف پردازش</template>
                                        <template v-else-if="processingStatus.trailer === 'processing'">درحال پردازش ویدیو</template>
                                        <template v-else-if="processingStatus.trailer === 'failed'">خطا در پردازش ویدیو</template>
                                        <template v-else>ویدیو پردازش نشده</template>
                                    </span>


                                    <svg v-if="processLoading || ['queued','processing'].includes(processingStatus.trailer)" class="animate-spin w-4 h-4"
                                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                        version="1.1" viewBox="-58 -58 116 116">
                                        <g stroke-linecap="round" stroke-width="15">
                                            <path id="a" d="m0 35 0,14" />
                                            <use transform="rotate(210)" xlink:href="#a" stroke="#f0f0f0" />
                                            <use transform="rotate(240)" xlink:href="#a" stroke="#ebebeb" />
                                            <use transform="rotate(270)" xlink:href="#a" stroke="#d3d3d3" />
                                            <use transform="rotate(300)" xlink:href="#a" stroke="#bcbcbc" />
                                            <use transform="rotate(330)" xlink:href="#a" stroke="#a4a4a4" />
                                            <use transform="rotate(0)" xlink:href="#a" stroke="#8d8d8d" />
                                            <use transform="rotate(30)" xlink:href="#a" stroke="#757575" />
                                            <use transform="rotate(60)" xlink:href="#a" stroke="#5e5e5e" />
                                            <use transform="rotate(90)" xlink:href="#a" stroke="#464646" />
                                            <use transform="rotate(120)" xlink:href="#a" stroke="#2f2f2f" />
                                            <use transform="rotate(150)" xlink:href="#a" stroke="#171717" />
                                            <use transform="rotate(180)" xlink:href="#a" stroke="#000" />
                                        </g>
                                    </svg>
                                    <button v-else @click.prevent="startProcessing(video_id)"
                                        class="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-100 text-xs font-medium flex items-center">
                                        پردازش
                                        <svg class="w-4 h-4 ms-1" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.5"
                                                d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                                fill="currentColor"></path>
                                            <path
                                                d="M6.42385 9.51988C6.68903 9.20167 7.16195 9.15868 7.48016 9.42385L7.75658 9.6542L7.75661 9.65423C8.36154 10.1583 8.87654 10.5874 9.23295 10.9821C9.61151 11.4013 9.90694 11.8834 9.90694 12.5C9.90694 13.1166 9.61151 13.5987 9.23295 14.0179C8.87653 14.4126 8.36153 14.8418 7.75658 15.3458L7.48016 15.5762C7.16195 15.8414 6.68903 15.7984 6.42385 15.4802C6.15868 15.1619 6.20167 14.689 6.51988 14.4239L6.75428 14.2285C7.41285 13.6797 7.84348 13.3185 8.11968 13.0126C8.38196 12.7222 8.40694 12.586 8.40694 12.5C8.40694 12.414 8.38196 12.2779 8.11968 11.9874C7.84348 11.6815 7.41285 11.3203 6.75429 10.7715L6.51988 10.5762C6.20167 10.311 6.15868 9.83809 6.42385 9.51988Z"
                                                fill="currentColor"></path>
                                            <path
                                                d="M17.75 15C17.75 15.4142 17.4142 15.75 17 15.75H12C11.5858 15.75 11.25 15.4142 11.25 15C11.25 14.5858 11.5858 14.25 12 14.25H17C17.4142 14.25 17.75 14.5858 17.75 15Z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </button>
                                </div>

                                <div v-if="processingStatus.trailer === 'processed'">
                                <video controls download class="w-full rounded-lg overflow-hidden">
                                        <source type="video/mp4" :src="course.trailer">
                                </video>
                                </div>
                            </div>
                            <div v-else
                                class="w-full h-full flex flex-col items-center justify-center text-center font-semibold text-sm text-gray-500 dark:text-gray-400">
                                <p class="">ویدیویی آپلود نشده است.</p>
                                <router-link
                                    class="mt-3 text-gray-800 dark:text-gray-50 hover:text-amber-400 dark:hover:text-amber-400 flex items-center"
                                    :to="{ name: 'admin-course-edit', params: { courseSlug: courseSlug }, hash: '#trailer' }">
                                    افزودن تریلر
                                    <svg class="w-6 h-6 ms-2 rtl:-mt-0.5" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H12.75V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V12.75H8C7.58579 12.75 7.25 12.4142 7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H11.25V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                                            fill="currentColor"></path>
                                    </svg>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <div class="text-gray-800 dark:text-gray-100 font-bold flex items-center justify-between">
                            <span class="flex items-center">
                                <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM16.37 14.35L14.15 16.57C13.61 17.11 12.91 17.37 12.21 17.37C11.51 17.37 10.8 17.1 10.27 16.57C9.75 16.05 9.46 15.36 9.46 14.63C9.46 13.9 9.75 13.2 10.27 12.69L11.68 11.28C11.97 10.99 12.45 10.99 12.74 11.28C13.03 11.57 13.03 12.05 12.74 12.34L11.33 13.75C11.09 13.99 10.96 14.3 10.96 14.63C10.96 14.96 11.09 15.28 11.33 15.51C11.82 16 12.61 16 13.1 15.51L15.32 13.29C16.59 12.02 16.59 9.96 15.32 8.69C14.05 7.42 11.99 7.42 10.72 8.69L8.3 11.11C7.79 11.62 7.51 12.29 7.51 13C7.51 13.71 7.79 14.39 8.3 14.89C8.59 15.18 8.59 15.66 8.3 15.95C8.01 16.24 7.53 16.24 7.24 15.95C6.44 15.18 6 14.13 6 13.01C6 11.89 6.43 10.84 7.22 10.05L9.64 7.63C11.49 5.78 14.51 5.78 16.36 7.63C18.22 9.48 18.22 12.5 16.37 14.35Z"
                                        fill="currentColor"></path>
                                </svg>
                                پیوست
                            </span>
                            <button
                                type="button"
                                title="مدیریت فایل‌های پیوست"
                                class="w-8 h-8 rounded-lg inline-flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-400 transition"
                                @click="$emit('go-to-attachments')"
                            >
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M15.5395 3C14.6303 3 13.7583 3.3599 13.1154 4.00052L9.07222 8.02925C7.21527 9.87957 5.89791 12.198 5.26098 14.7366L5.06561 15.5153C4.86299 16.3229 5.59714 17.0544 6.40764 16.8525L7.1891 16.6578C9.73681 16.0232 12.0635 14.7105 13.9205 12.8602L17.9636 8.83146C18.6066 8.19084 18.9678 7.32196 18.9678 6.41599C18.9678 4.52939 17.4329 3 15.5395 3ZM14.3776 7.57378C14.9965 8.19047 15.714 8.45317 16.2462 8.36088L16.8688 7.74049C17.2213 7.38921 17.4194 6.91278 17.4194 6.41599C17.4194 5.38149 16.5777 4.54286 15.5395 4.54286C15.041 4.54286 14.5628 4.7402 14.2103 5.09149L13.5877 5.71187C13.495 6.24217 13.7587 6.95709 14.3776 7.57378Z"
                                        fill="currentColor"></path>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M4 20.2286C4 19.8025 4.34662 19.4571 4.77419 19.4571H19.2258C19.6534 19.4571 20 19.8025 20 20.2286C20 20.6546 19.6534 21 19.2258 21H4.77419C4.34662 21 4 20.6546 4 20.2286Z"
                                        fill="currentColor"></path>
                                </svg>
                            </button>
                        </div>
                        <div
                            class="mt-3 p-2 md:p-4 border border-dashed border-gray-200 dark:border-opacity-20 rounded-xl">
                            <div v-if="overviewAttachs.length" class="grid gap-4" :class="overviewAttachs.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'">
                                <div
                                    v-for="attach in overviewAttachs"
                                    :key="attach.id || attach.url"
                                    class="flex justify-center items-center flex-col"
                                >
                                    <FileExtBadgeIcon :file="attach" size="lg" />
                                    <p class="mt-2 max-w-full px-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-100 line-clamp-2">
                                        {{ displayTitle(attach) }}
                                    </p>
                                    <div class="mx-auto mt-3 flex items-center">
                                        <div dir="ltr"
                                            class="text-sm font-sans text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/70 rounded-md px-2 py-1">
                                            size: {{ formatFileSize(attach.size) }}
                                        </div>
                                        <a
                                            v-if="attach.url"
                                            :href="attach.url"
                                            :download="displayTitle(attach)"
                                            class="ms-2 text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/70 rounded-md px-2 py-1"
                                        >
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z"
                                                    fill="currentColor"></path>
                                                <path
                                                    d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"
                                                    fill="currentColor"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div v-else
                                class="w-full h-full flex flex-col items-center justify-center text-center font-semibold text-sm text-gray-500 dark:text-gray-400">
                                <p class="">هیچ فایلی پیوست نشده است.</p>
                                <button
                                    type="button"
                                    class="mt-3 text-gray-800 dark:text-gray-50 hover:text-amber-400 dark:hover:text-amber-400 flex items-center"
                                    @click="$emit('go-to-attachments')"
                                >
                                    افزودن پیوست
                                    <svg class="w-6 h-6 ms-2 rtl:-mt-0.5" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H12.75V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V12.75H8C7.58579 12.75 7.25 12.4142 7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H11.25V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                                            fill="currentColor"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[15rem]">
            <div class="text-sm rounded-xl">
                <div class="text-gray-800 dark:text-gray-100 font-bold flex items-center">
                    <svg class="w-5 h-5 me-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M7.87215 3.48483C5.22187 4.04402 3.11133 6.07055 2.42056 8.71942C1.85981 10.8697 1.85981 13.1303 2.42056 15.2806C3.11133 17.9295 5.22187 19.956 7.87215 20.5152L8.37858 20.622C10.7672 21.126 13.2328 21.126 15.6214 20.622L16.1278 20.5152C18.7781 19.956 20.8887 17.9295 21.5794 15.2806C22.1402 13.1303 22.1402 10.8697 21.5794 8.71943C20.8887 6.07055 18.7781 4.04402 16.1278 3.48483L15.6214 3.37798C13.2328 2.87401 10.7672 2.87401 8.37858 3.37798L7.87215 3.48483ZM14.5112 8.67634C14.3822 8.4805 14.165 8.36287 13.9324 8.36287C13.6998 8.36287 13.4826 8.4805 13.3536 8.67634L10.0676 13.6641L8.71402 11.6095C8.58499 11.4137 8.36779 11.296 8.13519 11.296H6.20279C5.81859 11.296 5.50713 11.6112 5.50713 12C5.50713 12.3888 5.81859 12.7039 6.20279 12.7039H7.76288L9.48876 15.3236C9.61778 15.5195 9.83499 15.6371 10.0676 15.6371C10.3002 15.6371 10.5174 15.5195 10.6464 15.3236L13.9324 10.3359L15.286 12.3905C15.415 12.5863 15.6322 12.7039 15.8648 12.7039H17.7972C18.1814 12.7039 18.4928 12.3888 18.4928 12C18.4928 11.6112 18.1814 11.296 17.7972 11.296H16.2371L14.5112 8.67634Z"
                            fill="currentColor"></path>
                    </svg>
                    آمار ثبت نام
                </div>
                <div class="border border-gray-200 dark:border-opacity-10 rounded-xl p-2 mt-2">
                    <AreaChart :rawData="course.charts.registrations" :lineColor="'#fed700'"
                        :fillColor="'rgba(245, 221, 5, 0.2)'" :dateFormatOptions="{ month: 'long', day: 'numeric' }"
                        :showLegend="false" :showGrid="false" :showFill="true" :showTitle="false"
                        :chartTitle="'ثبت نام'" class="w-full flex items-center justify-center" />
                </div>
            </div>
            <div class="text-sm rounded-xl">
                <div class="text-gray-800 dark:text-gray-100 font-bold flex items-center">
                    <svg class="w-5 h-5 me-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02975C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM12.5743 9.12815C12.5743 8.81093 12.3172 8.55377 12 8.55377C11.6828 8.55377 11.4256 8.81093 11.4256 9.12815L11.4256 13.9146C11.4256 14.2318 11.6828 14.4889 12 14.4889C12.3172 14.4889 12.5743 14.2318 12.5743 13.9146V9.12815ZM9.70249 11.0427C9.70249 10.7255 9.44533 10.4683 9.12812 10.4683C8.8109 10.4683 8.55374 10.7255 8.55374 11.0427V14.8719C8.55374 15.1891 8.8109 15.4462 9.12812 15.4462C9.44533 15.4462 9.70249 15.1891 9.70249 14.8719V11.0427ZM15.4462 12C15.4462 11.6828 15.1891 11.4256 14.8718 11.4256C14.5546 11.4256 14.2975 11.6828 14.2975 12V14.8719C14.2975 15.1891 14.5546 15.4462 14.8718 15.4462C15.1891 15.4462 15.4462 15.1891 15.4462 14.8719V12Z"
                            fill="currentColor"></path>
                    </svg>
                    آمار بازدیدها
                </div>
                <div class="border border-gray-200 dark:border-opacity-10 rounded-xl p-2 mt-2">
                    <AreaChart :rawData="course.charts.views" :dateFormatOptions="{ month: 'long', day: 'numeric' }"
                        :showLegend="false" :showGrid="false" :showFill="true" :showTitle="false" :chartTitle="'بازدید'"
                        class="w-full flex items-center justify-center" />
                </div>
            </div>
        </div>
    </div>

    <div v-if="course">
        <BottomSheetDrawer v-model="isOpenDescriptionModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="bs.ADMIN_BS_PANEL"
            :contentClass="bs.ADMIN_BS_CONTENT"
            :backdropClass="bs.ADMIN_BS_BACKDROP">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">توضیحات</h3>
                <button type="button"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                    @click="closeDescriptionModal">
                    <span class="sr-only">Close</span>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="flex items-center text-gray-500 dark:text-gray-500 font-light text-xs text-start mb-4">
                تاریخ ایجاد:
                <span class="ms-2">
                    {{ new Date(course.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: '2-digit' }).replace(/\//g, '-') }}
                </span>
                <span class="mx-1.5">|</span>
                <span>
                    {{ new Date(course.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: true }).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ') }}
                </span>
            </div>
            <hr class="my-4 border-gray-200 border-t dark:border-opacity-10" />
            <div class="mt-4 bg-gray-100/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-xl p-2 md:p-3 text-start leading-7 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <MarkdownRenderer :source="course.description" />
            </div>
        </BottomSheetDrawer>
    </div>

    <BottomSheetDrawer v-model="isOpenReplyCommentModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">پاسخ به کامنت</h3>
            <button type="button"
                class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                @click="closeReplyCommentModal">
                <span class="sr-only">Close</span>
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

                            <div class="mt-4" v-if="!selectedCommentForReply.approved">
                                <input type="checkbox" v-model="selectedCommentForReplyApprovedCheck" checked
                                    id="approve-parent" value="" class="hidden peer" required="">
                                <label for="approve-parent"
                                    class="inline-flex items-center justify-between w-max p-3 text-sm text-gray-500 bg-white border-2 border-gray-200 rounded-xl cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-yellow-400 dark:peer-checked:border-yellow-400 hover:text-gray-600 dark:peer-checked:text-amber-400 peer-checked:text-amber-500 peer-checked:bg-yellow-400/10 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-opacity-80">
                                    <svg v-if="selectedCommentForReplyApprovedCheck" class="me-2 w-7 h-7"
                                        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z"
                                            fill="currentColor"></path>
                                    </svg>
                                    <span v-else class="w-5 h-5 m-1 me-3 bg-gray-500 rounded-lg"></span>
                                    با ارسال پاسخ برای این کامنت خود کامنت نیز انتشار داده شود
                                </label>
                            </div>
                            <div class="mt-4 border-2 border-dashed border-gray-200/70 dark:border-gray-800 rounded-xl p-2 md:p-4">
                                <EditorComponent class="relative" :submitButton="false" :cancelButton="false"
                                    :bodyClass="['bg-gray-100/60', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-50']"
                                    :toolbarClass="['bg-gray-100', 'dark:bg-gray-800/70', 'my-2', 'rounded-lg', 'px-2']"
                                    v-model="replyForSelectedComment"
                                    :errors="errors?.parent_approved?.[0] || errors?.comment?.[0] || errors?.parent_id?.[0] || ''" />
                            </div>
                            <div class="flex items-center justify-end w-full p-2 md:p-4">
                                <button @click.prevent="commentSendReply" :disabled="replyCommentLoading"
                                    class="disabled:opacity-60 whitespace-nowrap bg-amber-400 text-sm font-semibold px-4 py-2 rounded-xl text-gray-900 flex items-center shadow-sm">
                                    ثبت پاسخ
                                    <svg class="shrink-0 ms-2 w-6 h-6" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M3.3437 9.02975C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C4.00549 17.7916 6.20841 19.9945 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C17.7916 19.9945 19.9945 17.7916 20.6563 14.9703C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20842 17.7916 4.00549 14.9703 3.3437C13.0166 2.88543 10.9834 2.88544 9.02975 3.3437C6.20842 4.00549 4.00549 6.20841 3.3437 9.02975ZM11.467 14.8175C11.2327 15.0518 10.8528 15.0518 10.6184 14.8175L8.22523 12.4243C8.11271 12.3117 8.0495 12.1591 8.0495 12C8.0495 11.8409 8.11271 11.6883 8.22523 11.5757L10.6184 9.18252C10.8528 8.94821 11.2327 8.94821 11.467 9.18252C11.7013 9.41684 11.7013 9.79673 11.467 10.031L10.098 11.4H15.3505C15.6819 11.4 15.9505 11.6686 15.9505 12C15.9505 12.3314 15.6819 12.6 15.3505 12.6L10.098 12.6L11.467 13.969C11.7013 14.2033 11.7013 14.5832 11.467 14.8175Z"
                                            fill="currentColor"></path>
                                    </svg>
                                </button>
                            </div>
                            <div
                                class="mt-3 border border-gray-200 dark:border-opacity-10 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-2 md:p-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <router-link
                                            :to="{ name: 'profile-page', params: { username: selectedCommentForReply.user.username } }"
                                            class="w-10 h-10 overflow-hidden rounded-full border-2 border-gray-400">
                                            <img onerror="this.style.display='none'" :src="selectedCommentForReply.user.profile_pic"
                                                class="w-full h-full object-cover hover:scale-105 duration-150" />
                                        </router-link>
                                        <div class="ms-1.5">
                                            <router-link
                                                :to="{ name: 'profile-page', params: { username: selectedCommentForReply.user.username } }"
                                                class="text-gray-700 dark:text-gray-100 text-xs font-semibold line-clamp-1">
                                                {{ selectedCommentForReply.user.first_name + ' ' +
                                                    selectedCommentForReply.user.last_name }}
                                            </router-link>
                                            <div class="mt-0.5 text-gray-400 dark:text-gray-400 text-xs font-light">
                                                {{ timeAgo(selectedCommentForReply.created_at) }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-1 rtl:space-x-reverse">

                                    </div>
                                </div>
                                <hr class="border-t border-dashed border-gray-200 dark:border-opacity-20 my-1.5">
                                <div
                                    class="text-xs font-light text-gray-500 dark:text-gray-300 max-h-52 overflow-y-auto custom-scrollbar">
                                    <MarkdownRenderer :source="selectedCommentForReply.comment" />
                                </div>
                            </div>
    </BottomSheetDrawer>
</template>
<script>
import axiosInstance from "@/store/axiosInstance";
import axios from "axios";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AreaChart from "@/views/components/chart/AreaChart.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import moment from "moment";
import "moment/locale/fa";
import * as bs from "@/views/components/admin/bottomSheet/adminBottomSheetStyles.js";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import FileExtBadgeIcon from "@/views/components/admin/FileExtBadgeIcon.vue";
import { displayAttachmentTitle } from "@/utils/attachmentDisplay";
export default {
    emits: ['go-to-attachments'],
    props: {
        courseSlug: {
            type: String,
            required: true,
        },
    },
    components: {
        MarkdownRenderer,
        AreaChart,
        BottomSheetDrawer,
        EditorComponent,
        AdminInlineLoading,
        FileExtBadgeIcon,
    },
    data() {
        return {
            bs,
            course: null,
            errors: null,
            loading: false,
            loadingComments: [],
            processLoading: false,
            processingStatus: { trailer: 'idle' },
            video_id: null,
            workerToken: null,
            workerOrigin: '',
            statusTimer: null,
            isOpenDescriptionModal: false,
            isOpenReplyCommentModal: false,
            selectedCommentForReply: null,
            selectedCommentForReplyApprovedCheck: true,
            replyForSelectedComment: "",
            replyCommentLoading: false,
        };
    },
    computed: {
        overviewAttachs() {
            if (Array.isArray(this.course?.attachs) && this.course.attachs.length) {
                return this.course.attachs;
            }
            if (this.course?.attach) {
                return [this.course.attach];
            }
            return [];
        },
    },
    methods: {
        displayTitle: displayAttachmentTitle,
        async getCourseOverview() {
            this.loading = true;
            await axiosInstance
                .post(`admin/course/${this.courseSlug}/overview`)
                .then((response) => {
                    this.course = response.data.course;
                    // Map trailer processing state similar to edit page
                    if (response.data.course.trailer_status) {
                        this.processingStatus.trailer = response.data.course.trailer_status;
                    } else if (response.data.course.trailer) {
                        // If trailer exists but no explicit status, consider processed
                        this.processingStatus.trailer = 'processed';
                    }
                    if (response.data.course.trailer_video_id) {
                        this.video_id = response.data.course.trailer_video_id;
                    }
                    // If not processed, get worker credentials and start polling
                    if (this.video_id && this.processingStatus.trailer !== 'processed') {
                        this.getWorkerCredentials().then(() => {
                            this.startStatusPolling(this.video_id);
                        });
                    }
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        async getWorkerCredentials() {
            try {
                const res = await axiosInstance.post(`admin/course/${this.courseSlug}/overview`, { get_worker_credentials: true });
                this.workerToken = res.data.worker_token;
                this.workerOrigin = res.data.worker_origin;
            } catch (e) {
                console.error('Failed to get worker credentials:', e);
            }
        },
        formatFileSize(bytes, decimal = 1, lang = 'en') {
            if (bytes == null || Number.isNaN(Number(bytes))) {
                return '—';
            }
            const units = {
                fa: ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'],
                en: ['B', 'KB', 'MB', 'GB']
            };

            const selectedUnits = units[lang] || units['en'];

            if (bytes < 1024) {
                return `${bytes} ${selectedUnits[0]}`;
            }
            if (bytes < 1024 * 1024) {
                return `${(bytes / 1024).toFixed(decimal)} ${selectedUnits[1]}`;
            }
            if (bytes < 1024 * 1024 * 1024) {
                return `${(bytes / (1024 * 1024)).toFixed(decimal)} ${selectedUnits[2]}`;
            }
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(decimal)} ${selectedUnits[3]}`;
        },
        startProcessing(videoId) {
            this.processLoading = true;
            this.processingStatus.trailer = 'queued';
            axiosInstance.post(`admin/video/process/${videoId}`, {}, { timeout: 2400 * 1000 })
                .then(() => {
                    if (this.workerToken && this.workerOrigin) {
                        this.startStatusPolling(videoId);
                    } else {
                        this.getWorkerCredentials().then(() => this.startStatusPolling(videoId));
                    }
                })
                .catch(error => {
                    this.processingStatus.trailer = 'failed';
                    console.error("Processing failed:", error);
                })
                .finally(() => { this.processLoading = false; });
        },
        startStatusPolling(videoId) {
            if (!this.workerToken || !this.workerOrigin) return;
            if (this.statusTimer) clearInterval(this.statusTimer);
            this.statusTimer = setInterval(async () => {
                try {
                    const url = `${this.workerOrigin}/api/videos/${videoId}/status`;
                    const res = await axios.get(url, { headers: { Authorization: `Bearer ${this.workerToken}` }, timeout: 10000 });
                    const status = res.data?.status;
                    if (status === 'processed') { this.processingStatus.trailer = 'processed'; clearInterval(this.statusTimer); this.statusTimer = null; }
                    else if (status === 'failed') { this.processingStatus.trailer = 'failed'; clearInterval(this.statusTimer); this.statusTimer = null; }
                    else if (status === 'queued') { this.processingStatus.trailer = 'queued'; }
                    else { this.processingStatus.trailer = 'processing'; }
                } catch (e) {
                    // keep trying silently
                }
            }, 10000);
        },
        closeDescriptionModal() {
            this.isOpenDescriptionModal = false;
        },
        openDescriptionModal() {
            this.isOpenDescriptionModal = true;
        },
        closeReplyCommentModal() {
            this.isOpenReplyCommentModal = false;
            // this.selectedCommentForReply = null;
            this.selectedCommentForReplyApprovedCheck = true;
            this.replyForSelectedComment = "";
        },
        openReplyCommentModal(comment) {
            this.selectedCommentForReply = comment;
            this.isOpenReplyCommentModal = true;
        },
        timeAgo(date) {
            moment.locale("fa");
            return moment(date).fromNow();
        },
        async commentToggleApproval(comment, index) {
            this.loadingComments[index] = true;
            try {
                const response = await axiosInstance.post(
                    'admin/comments/toggle-approval', { comment_id: comment.id }
                );
                const updatedComment = this.course.recent_activities.comments.find(c => c.id === comment.id);
                if (updatedComment) {
                    updatedComment.approved = response.data.comment.approved;
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.loadingComments[index] = false;
            }
        },
        async commentSendReply() {
            this.errors = null;
            this.replyCommentLoading = true;
            try {
                await axiosInstance.post(
                    'admin/comments/send-reply', { parent_id: this.selectedCommentForReply.id, comment: this.replyForSelectedComment, parent_approved: this.selectedCommentForReplyApprovedCheck }
                );
                toast.success('پاسخ کامنت با موفقیت ثبت شد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });

                const updatedComment = this.course.recent_activities.comments.find(c => c.id === this.selectedCommentForReply.id);
                if (updatedComment) {
                    updatedComment.approved = this.selectedCommentForReplyApprovedCheck;
                }

                this.closeReplyCommentModal();

            } catch (error) {
                console.error(error);
                this.errors = error.response.data.errors;
            } finally {
                this.replyCommentLoading = false;
            }
        },

    },

    mounted() {
        this.getCourseOverview();
    }
}
</script>
