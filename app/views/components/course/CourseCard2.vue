<template>
    <div class="group w-full relative">
        <div class="relative rounded-xl overflow-hidden">
            <div class="bg-white dark:bg-slate-900 rounded-xl absolute left-0 right-0 top-0 bottom-0 rtl:mr-6 ltr:ml-6 mb-6 mt-6 rtl:group-hover:mr-0 ltr:group-hover:ml-0 group-hover:mt-0 group-hover:mb-0 duration-300"></div>
            <div class="p-3 z-1 relative">
            <div class="relative aspect-w-16 aspect-h-11 h-48 md:h-40 overflow-hidden rounded-xl bg-gray-300 dark:bg-gray-600">
                <router-link
                    :to="{ name: 'course.show', params: { courseSlug: localCourse.slug } }"
                    class="absolute inset-0 z-0 block">
                    <SeoImage
                        :src="localCourse.poster"
                        :alt="displayTitle || localCourse.title || 'دوره آموزشی'"
                        :width="640"
                        :height="360"
                        sizes-preset="card"
                        img-class="relative z-0 w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                    />
                </router-link>
                <CourseStatusRibbon :status="localCourse.status" />
                <InstallmentRibbon
                    :allows-installment="localCourse.allows_installment"
                    :alternate-corner="hasStatusRibbon"
                />
                <div v-if="hasDiscount" class="absolute z-20 top-2 rtl:right-2 ltr:left-2 pointer-events-none">
                    <DiscountBadge :percent="discountPercent" overlay compact />
                </div>
                <div class="hidden group-hover:block absolute top-0 rtl:left-0 ltr:right-0 z-10">
                    <div
                        class="pointer-events-none absolute top-0 rtl:left-0 ltr:right-0 w-28 h-24 rtl:rounded-ee-xl ltr:rounded-es-xl rtl:bg-[radial-gradient(ellipse_at_0_0,rgba(15,23,42,0.28)_0%,rgba(15,23,42,0.08)_48%,transparent_70%)] ltr:bg-[radial-gradient(ellipse_at_100%_0,rgba(15,23,42,0.28)_0%,rgba(15,23,42,0.08)_48%,transparent_70%)]">
                    </div>
                    <div class="relative p-3">
                        <div class="rounded-md p-1 bg-gray-500 bg-opacity-55 shadow-md shadow-slate-900/50 transition ease-in-out delay-100 hover:scale-110">
                            <router-link :to="{ name: 'course.show', params: { courseSlug: localCourse.slug } }" class="">
                                <svg class="w-6 h-6 text-gray-300 hover:text-gray-50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.9999 2C16.714 2 19.071 2 20.5354 3.46447C21.9999 4.92893 21.9999 7.28595 21.9999 12C21.9999 16.714 21.9999 19.0711 20.5354 20.5355C19.1784 21.8926 17.055 21.9921 12.9999 21.9994M2.00049 11C2.00779 6.94493 2.10734 4.8215 3.46438 3.46447C4.43813 2.49071 5.8065 2.16443 8 2.0551" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                <path d="M12 12L17 7M17 7H13.25M17 7V10.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M2 18C2 16.1144 2 15.1716 2.58579 14.5858C3.17157 14 4.11438 14 6 14C7.88562 14 8.82843 14 9.41421 14.5858C10 15.1716 10 16.1144 10 18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18Z" stroke="currentColor" stroke-width="1.5"></path>
                            </svg>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="my-3">
                <!-- <div class="font-semibold text-xl py-2 pr-3">title</div> -->
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <router-link
                            v-if="localCourse.teacher"
                            :to="{ name: 'profile-page', params: { username: localCourse.teacher.username } }"
                            class="rtl:ml-2 ltr:mr-2 w-8 h-8 overflow-hidden rounded-xl border-2 border-gray-200 dark:border-opacity-20 bg-gray-300 dark:bg-gray-600">
                            <SeoImage
                                :src="localCourse.teacher.profile_pic"
                                :alt="localCourse.teacher.first_name ? `${localCourse.teacher.first_name} ${localCourse.teacher.last_name || ''}`.trim() : 'مدرس'"
                                :width="32"
                                :height="32"
                                sizes-preset="avatar"
                                img-class="w-full h-full rounded-lg object-cover transform transition duration-200 hover:scale-110"
                            />
                        </router-link>
                        <div
                            v-else
                            class="rtl:ml-2 ltr:mr-2 w-8 h-8 overflow-hidden rounded-xl border-2 border-gray-200 dark:border-opacity-20 bg-gray-300 dark:bg-gray-600">
                        </div>
                        <div class="flex flex-col justify-center">
                            <div class="line-clamp-1 text-sm font-bold text-gray-600 dark:text-white" :title="displayTitle">
                                <router-link :to="{ name: 'course.show', params: { courseSlug: localCourse.slug } }" class="">
                                    {{ truncatedText(displayTitle, 5) }}
                                </router-link>
                            </div>
                            <div class="line-clamp-1 text-xs text-gray-400">
                                {{ teacherName }}
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <div v-if="displayRating != null" class="flex items-center justify-center rounded py-0.5 px-1 bg-gray-200/50 dark:bg-gray-700/30">
							<span class="rtl:mt-0.5 me-1 text-xs font-medium text-gray-700 dark:text-gray-100">{{ displayRating }}</span>
                            <svg class="w-3 h-3 text-amber-400" data-v-5600a2dc="" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor"><path data-v-5600a2dc="" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="transition ease-in-out duration-75 delay-75 origin-top opacity-0 group-hover:opacity-100 flex justify-between">
                <div class="flex space-x-3">
                    <div class="flex items-center">
                        <div class="flex items-center bg-gray-200 dark:bg-gray-700 px-2 h-6 rounded rtl:ml-2 ltr:mr-2">
                            <svg class="rtl:ml-1 ltr:mr-1 text-gray-500 dark:text-gray-300" width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.29921 7.10036C1.29921 8.47492 1.37342 9.55017 1.56095 10.394C1.74739 11.2329 2.04007 11.8164 2.45902 12.2353C2.87796 12.6543 3.4615 12.947 4.30041 13.1334C5.14419 13.3209 6.21945 13.3952 7.594 13.3952C8.96856 13.3952 10.0438 13.3209 10.8876 13.1334C11.7265 12.947 12.31 12.6543 12.729 12.2353C13.1479 11.8164 13.4406 11.2329 13.6271 10.394C13.8146 9.55017 13.8888 8.47492 13.8888 7.10036C13.8888 5.72581 13.8146 4.65055 13.6271 3.80677C13.4406 2.96786 13.1479 2.38432 12.729 1.96538C12.31 1.54643 11.7265 1.25375 10.8876 1.06731C10.0438 0.879784 8.96856 0.805572 7.594 0.805572C6.21945 0.805572 5.14419 0.879784 4.30041 1.06731C3.4615 1.25375 2.87796 1.54643 2.45902 1.96538C2.04007 2.38432 1.74739 2.96786 1.56095 3.80677C1.37342 4.65055 1.29921 5.72581 1.29921 7.10036Z" stroke="currentColor" stroke-width="0.858919" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M7.59399 3.73825C7.59399 3.73825 7.59399 5.97967 7.59399 6.54002C7.59399 7.10038 7.59399 7.10038 8.15435 7.10038C8.71471 7.10038 10.9561 7.10038 10.9561 7.10038" stroke="currentColor" stroke-width="0.858919" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <span class="text-gray-500 dark:text-gray-300 font-normal text-xs">
                                {{ formattedDuration }}
                            </span>
                        </div>

                        <button @click.prevent="toggleLike()" :disabled="likeLoading" class="flex group items-center px-2 h-6 rtl:ml-2 ltr:mr-2 text-xs text-red-400 bg-red-500 dark:text-red-600 dark:hover:bg-red-500 dark:hover:text-white dark:bg-opacity-20 bg-opacity-20 rounded transition duration-200 hover:bg-opacity-100 hover:text-white group">
                            <svg v-if="isLoggedin && localCourse.user_has_liked" class="rtl:ml-1 ltr:mr-1" fill="none" width="13" height="11" viewBox="0 0 13 11" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="M3.95035 1.229C4.81955 1.229 5.61243 1.66166 6.21284 2.15457C6.81326 1.66166 7.60614 1.229 8.47534 1.229C10.3497 1.229 11.8691 2.62275 11.8691 4.34192C11.8691 7.80824 7.92382 9.82702 6.62321 10.3984C6.36123 10.5134 6.06445 10.5134 5.80248 10.3984C4.50187 9.827 0.556602 7.80816 0.556602 4.34184C0.556602 2.62267 2.07603 1.229 3.95035 1.229Z" stroke-width="0.761705"></path>
                            </svg>
                            <svg v-else class="rtl:ml-1 ltr:mr-1" fill="none" width="13" height="11" viewBox="0 0 13 11" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="currentColor" d="M3.95035 1.229C4.81955 1.229 5.61243 1.66166 6.21284 2.15457C6.81326 1.66166 7.60614 1.229 8.47534 1.229C10.3497 1.229 11.8691 2.62275 11.8691 4.34192C11.8691 7.80824 7.92382 9.82702 6.62321 10.3984C6.36123 10.5134 6.06445 10.5134 5.80248 10.3984C4.50187 9.827 0.556602 7.80816 0.556602 4.34184C0.556602 2.62267 2.07603 1.229 3.95035 1.229Z" stroke-width="0.761705"></path>
                            </svg>

                            {{ localCourse.likes_count }}
                        </button>
                    </div>
                </div>

                <div v-if="localCourse.price > 0" class="flex items-center gap-1.5 min-w-0">
                    <PriceDisplay :course="localCourse" compact :show-badge="false" size-class="lg:text-md text-sm" />
                    <svg class="rtl:mr-1 ltr:ml-1 ltr:hidden" width="12" height="12" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            class="text-gray-600 dark:text-white"
                            d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C11.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z"
                            fill="currentColor"
                        ></path>
                    </svg>

                    <svg fill="none" class="rtl:mr-1 ltr:ml-1 mt-1 hidden ltr:block" width="14" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                        <path
                            class="text-gray-400 dark:text-white"
                            d="M25.198,6.273c-0.014,0.23-0.045,0.389-0.087,0.467c-0.045,0.084-0.176,0.145-0.392,0.183 c-0.469,0.104-0.781-0.074-0.935-0.533C23.239,4.7,22.59,3.578,21.84,3.016c-1.041-0.773-2.862-1.161-5.469-1.161 c-1.054,0-1.633,0.115-1.734,0.343c-0.036,0.075-0.057,0.184-0.057,0.324v18.999c0,0.812,0.188,1.383,0.571,1.709 c0.382,0.32,1.069,0.731,2.201,0.999c0.483,0.103,0.97,0.2,1.034,0.239c0.46,0,0.504,1.057-0.376,1.057 c-0.025,0.016-10.375-0.008-10.375-0.008s-0.723-0.439-0.074-1.023c0.271-0.121,0.767-0.343,0.767-0.343s1.83-0.614,2.211-1.009 c0.434-0.445,0.648-1.164,0.648-2.154V2.521c0-0.369-0.229-0.585-0.687-0.647c-0.049-0.015-0.425-0.02-1.122-0.02 c-2.415,0-4.191,0.418-5.338,1.259C3.176,3.735,2.411,4.877,1.737,6.545C1.52,7.065,1.22,7.234,0.84,7.058 C0.408,6.957,0.251,6.719,0.363,6.353c0.445-1.374,0.668-3.31,0.668-5.814c0-0.292,0.387-0.586,1.163-0.533L23.56,0.064 c0.709-0.104,1.096,0.012,1.16,0.343C25.076,2.096,25.234,4.052,25.198,6.273z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
                <div v-else class="text-gray-700 dark:text-white font-bold lg:text-md text-sm">
                    <span>{{ $t('course.card.free') }}</span>
                </div>
            </div>
        </div>
        </div>
        <svg
            class="absolute top-0 rtl:right-0 ltr:left-0 w-6 h-6 pointer-events-none z-[3] text-white dark:text-slate-900 transition-opacity duration-300 group-hover:opacity-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true">
            <path class="ltr:block rtl:hidden" d="M4 0H24V4H4V24H0V4A4 4 0 0 1 4 0Z" />
            <path class="hidden rtl:block" d="M0 0H20A4 4 0 0 1 24 4V24H20V4H0V0Z" />
        </svg>
    </div>
</template>

<script>
import { initPopovers } from "flowbite";
import axiosInstance from "@/store/axiosInstance";
import CourseStatusRibbon from "@/views/components/course/CourseStatusRibbon.vue";
import InstallmentRibbon from "@/views/components/payment/InstallmentRibbon.vue";
import PriceDisplay from "@/views/components/price/PriceDisplay.vue";
import DiscountBadge from "@/views/components/price/DiscountBadge.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import { cleanCourseTitle } from "@/utils/courseDisplay";
import { courseDiscountPercent, courseHasDiscount } from "@/utils/priceDisplay";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
    components: { CourseStatusRibbon, InstallmentRibbon, PriceDisplay, DiscountBadge, SeoImage },
    props: {
        course: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            likeLoading: false,
            localCourse: this.course,
        };
    },
    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
        displayTitle() {
            return cleanCourseTitle(this.localCourse.title, this.localCourse.status);
        },
        teacherName() {
            const teacher = this.localCourse.teacher;
            if (!teacher) {
                return this.$t("course.card.unknownTeacher");
            }
            return `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() || this.$t("course.card.unknownTeacher");
        },
        formattedDuration() {
            const seconds = Number(this.localCourse.total_time);
            if (!Number.isFinite(seconds) || seconds <= 0) {
                return "00:00:00";
            }
            return new Date(seconds * 1000).toISOString().slice(11, 19);
        },
        displayRating() {
            const rating = Number(this.localCourse.avgRating);
            if (!Number.isFinite(rating) || rating <= 0) {
                return null;
            }
            return Number(rating.toFixed(1));
        },
        hasStatusRibbon() {
            const status = this.localCourse?.status;
            const slug = status?.english_title || status?.slug || null;
            return ['presale', 'upcoming', 'archive'].includes(slug);
        },
        hasDiscount() {
            return courseHasDiscount(this.localCourse);
        },
        discountPercent() {
            return courseDiscountPercent(this.localCourse);
        },
    },
    methods: {
        truncatedText(originalText, maxWords) {
            const words = originalText.split(" ");
            return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : originalText;
        },

        async toggleLike() {
            if (!this.isLoggedin) {
                toast.warning(this.$t("course.show.loginToLike"), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh text-gray-800",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } else {
                this.likeLoading = true;
                await axiosInstance
                    .post("/toggleLike", {
                        likeable_id: this.localCourse.id,
                        likeable_type: "Course",
                    })
                    .then((response) => {
                        this.localCourse.user_has_liked = response.data.user_has_liked;
                        this.localCourse.likes_count = response.data.likes_count;
                    })
                    .catch((error) => {
                        console.error(error.response.data.errors);
                    })
                    .finally(() => {
                        this.likeLoading = false;
                    });
            }
        },
    },
    updated() {
        this.localCourse = this.course;
    },
    mounted() {
        initPopovers();
    },
};
</script>

<style></style>
