<template>
    <div v-if="isLoggedin && isEditing && localAnswer.is_editable && localAnswer.user.username === currentUser.username">
        <div :id="`edit-form-${localAnswer.id}`" class="">
            <div>
                <div class="rounded-xl border-2 border-white dark:border-gray-900 p-3 py-5 md:p-6">
                    <form>
                        <div class="mb-4 flex items-center">
                            <i class="dark:bg-amber-400 rounded-full bg-slate-700 w-2 h-2 ml-2"></i>
                            <h4 class="dark:text-amber-400 text-lg font-bold text-slate-700">{{ $t('discuss.answer.editTitle') }}</h4>
                        </div>
                        <div class="mb-3 border-b dark:border-white dark:border-opacity-10 border-gray-210">
                            <div class="flex items-start">
                                <div class="relative" style="">
                                    <div class="w-14 h-14 flex me-2 bg-gray-300 group relative rounded-full overflow-hidden border-4 border-solid border-amber-400">
                                        <router-link :to="{ name: 'profile-page', params: { username: localAnswer.user.username } }">
                                            <SeoImage
                                                :src="localAnswer.user.profile_pic"
                                                alt="user-avatar"
                                                :width="56"
                                                :height="56"
                                                sizes-preset="avatar"
                                                img-class="transition duration-200 transform group-hover:scale-110 w-full h-full object-cover"
                                            />
                                            <div class="w-full h-full absolute top-0 right-0 bg-biscay-700 bg-opacity-20 z-0"></div>
                                        </router-link>
                                    </div>
                                </div>
                                <div class="flex relative justify-center flex-col pb-5">
                                    <h6 class="font-semibold text-base dark:text-white text-chambray-700 leading-6">
                                        <router-link :to="{ name: 'profile-page', params: { username: localAnswer.user.username } }">
                                            {{ localAnswer.user.first_name + " " + localAnswer.user.last_name }}
                                        </router-link>
                                    </h6>
                                    <router-link :to="{ name: 'profile-page', params: { username: localAnswer.user.username } }" class="mt-1 dark:text-gray-200 text-gray-360 text-sm" dir="ltr"> @{{ localAnswer.user.username }} </router-link>
                                    <i class="absolute w-full border-b dark:border-amber-400 border-amber-400 flex bottom-0"></i>
                                </div>
                            </div>
                        </div>
                        <EditorComponent :submitButton="false" :cancelButton="false" :errors="errors && errors.answer ? errors.answer[0] : ''" v-model="editContent"> </EditorComponent>
                        <div class="-mt-10 flex items-center justify-end space-x-1 rtl:space-x-reverse">
                            <button @click="isEditing = false" class="w-20 whitespace-nowrap text-gray-700 dark:text-gray-50 bg-gray-200 dark:bg-gray-700/80 duration-150 focus:ring-2 focus:outline-none focus:ring-gray-400 dark:focus:ring-gray-400 font-semibold rounded-lg text-sm px-3 py-2.5 text-center">{{ $t('discuss.common.cancel') }}</button>
                            <button type="button" @click.prevent="updateAnswer" :disabled="editLoading" class="w-24 whitespace-nowrap text-rose-800 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl hover:shadow-md hover:shadow-yellow-200 duration-150 focus:ring-2 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-semibold rounded-lg text-sm px-5 py-2.5 text-center">
                                <svg v-if="editLoading" class="w-4 h-4 m-auto" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
                                    <circle class="stroke-current text-rose-500 text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
                                    <circle class="stroke-current text-rose-500" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
                                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                                        <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
                                        <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
                                    </circle>
                                </svg>
                                <span v-else>{{ $t('discuss.answer.saveEdit') }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div v-if="showDateTimeAbove">
            <hr class="border-t-2 border-gray-400/20 dark:border-gray-500/20 -mb-3 mx-16" />
            <div class="flex items-center justify-between text-sm font-medium text-gray-400/60 dark:text-gray-500/70 px-2">
                <div dir="ltr" class="bg-gray-100 dark:bg-gray-800 ps-3">
                    {{
                        new Date(localAnswer.created_at)
                            .toLocaleTimeString("fa-IR", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })
                            .replace("بعدازظهر", "pm")
                            .replace("قبل‌ازظهر", "am")
                    }}
                </div>
                <div class="bg-gray-100 dark:bg-gray-800 ps-3 flex items-center">
                    <span dir="ltr">
                        {{
                            new Date(localAnswer.created_at)
                                .toLocaleDateString("fa-IR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })
                                .replace(/\//g, "-")
                        }}
                    </span>
                    <svg class="ms-2 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.02977 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.0055 19.9946 6.20843 20.6564 9.02977C21.1146 10.9834 21.1146 13.0166 20.6564 14.9703C19.9946 17.7916 17.7916 19.9946 14.9703 20.6564C13.0166 21.1146 10.9834 21.1146 9.02977 20.6564C6.20843 19.9946 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02976C4.0055 6.20842 6.20842 4.0055 9.02977 3.3437ZM12.2758 9.12813C12.2758 8.79676 12.0072 8.52813 11.6758 8.52813C11.3445 8.52813 11.0758 8.79676 11.0758 9.12813V12.6643C11.0758 12.8694 11.1807 13.0604 11.3538 13.1705L14.0711 14.8994C14.3507 15.0773 14.7215 14.9949 14.8994 14.7153C15.0773 14.4357 14.9949 14.0649 14.7153 13.887L12.2758 12.3349V9.12813Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
        </div>
        <div v-if="showQuestionAbove" class="mt-1">
            <div class="flex items-center justify-between p-3 md:px-5 md:py-3 mb-0.5 bg-white dark:bg-gray-900 rounded-t-2xl">
                <!-- <router-link :to="{ name: 'question-show', params: { questionSlug: question.slug } }" class="w-full flex items-center line-clamp-1 text-sm font-semibold text-gray-700 dark:text-white">
                    <svg class="w-5 h-5 me-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.3437 9.02975C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C4.00549 17.7916 6.20841 19.9945 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C17.7916 19.9945 19.9945 17.7916 20.6563 14.9702C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20841 17.7916 4.00549 14.9703 3.3437C13.0166 2.88543 10.9834 2.88544 9.02975 3.3437C6.20842 4.00549 4.00549 6.20841 3.3437 9.02975ZM12.7658 15.207C12.7658 15.6035 12.4443 15.9249 12.0478 15.9249C11.6513 15.9249 11.3299 15.6035 11.3299 15.207C11.3299 14.8105 11.6513 14.489 12.0478 14.489C12.4443 14.489 12.7658 14.8105 12.7658 15.207ZM10.6598 9.98975C10.6598 9.24958 11.2598 8.64955 12 8.64955C12.7401 8.64955 13.3402 9.24958 13.3402 9.98975V10.1059C13.3402 10.4921 13.1867 10.8626 12.9136 11.1357L11.5938 12.4555C11.3695 12.6798 11.3695 13.0434 11.5938 13.2678C11.8181 13.4921 12.1818 13.4921 12.4061 13.2678L13.7259 11.948C14.2145 11.4594 14.4889 10.7968 14.4889 10.1059V9.98975C14.4889 8.61515 13.3746 7.50081 12 7.50081C10.6254 7.50081 9.51103 8.61515 9.51103 9.98975V10.4684C9.51103 10.7856 9.76819 11.0428 10.0854 11.0428C10.4026 11.0428 10.6598 10.7856 10.6598 10.4684V9.98975Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                    <span class="whitespace-nowrap font-light">مربوط به پرسش:</span>
                    <span class="ms-1.5 line-clamp-1 hover:text-amber-400 underline duration-150">{{ question.subject }}</span>
                </router-link> -->
                <div class="w-full flex items-center line-clamp-1 text-sm font-semibold text-gray-700 dark:text-white">
                    <svg class="w-5 h-5 me-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.3437 9.02975C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C4.00549 17.7916 6.20841 19.9945 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C17.7916 19.9945 19.9945 17.7916 20.6563 14.9702C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20841 17.7916 4.00549 14.9703 3.3437C13.0166 2.88543 10.9834 2.88544 9.02975 3.3437C6.20842 4.00549 4.00549 6.20841 3.3437 9.02975ZM12.7658 15.207C12.7658 15.6035 12.4443 15.9249 12.0478 15.9249C11.6513 15.9249 11.3299 15.6035 11.3299 15.207C11.3299 14.8105 11.6513 14.489 12.0478 14.489C12.4443 14.489 12.7658 14.8105 12.7658 15.207ZM10.6598 9.98975C10.6598 9.24958 11.2598 8.64955 12 8.64955C12.7401 8.64955 13.3402 9.24958 13.3402 9.98975V10.1059C13.3402 10.4921 13.1867 10.8626 12.9136 11.1357L11.5938 12.4555C11.3695 12.6798 11.3695 13.0434 11.5938 13.2678C11.8181 13.4921 12.1818 13.4921 12.4061 13.2678L13.7259 11.948C14.2145 11.4594 14.4889 10.7968 14.4889 10.1059V9.98975C14.4889 8.61515 13.3746 7.50081 12 7.50081C10.6254 7.50081 9.51103 8.61515 9.51103 9.98975V10.4684C9.51103 10.7856 9.76819 11.0428 10.0854 11.0428C10.4026 11.0428 10.6598 10.7856 10.6598 10.4684V9.98975Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                    <span class="whitespace-nowrap font-light">{{ $t('discuss.answer.questionLabel') }}</span>
                    <div class="relative flex-1 items-center ms-1">
                        <router-link :to="{ name: 'question-show', params: { questionSlug: question.slug } }" class="absolute mt-1.5 end-3 ms-2">
                            <svg class="w-5 h-5 text-gray-500 dark:text-gray-300 hover:text-amber-400 dark:hover:text-amber-400 duration-150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.25 3C14.25 2.58579 14.5858 2.25 15 2.25H21C21.4142 2.25 21.75 2.58579 21.75 3V9C21.75 9.41421 21.4142 9.75 21 9.75C20.5858 9.75 20.25 9.41421 20.25 9V4.81066L13.5303 11.5303C13.2374 11.8232 12.7626 11.8232 12.4697 11.5303C12.1768 11.2374 12.1768 10.7626 12.4697 10.4697L19.1893 3.75H15C14.5858 3.75 14.25 3.41421 14.25 3Z" fill="currentColor"></path>
                                <path d="M21.9995 11.0164C21.6983 11.1659 21.359 11.25 21 11.25C19.7574 11.25 18.75 10.2426 18.75 9V8.43198L14.591 12.591C13.7123 13.4697 12.2877 13.4697 11.409 12.591C10.5303 11.7123 10.5303 10.2877 11.409 9.40901L15.568 5.25H15C13.7574 5.25 12.75 4.24264 12.75 3C12.75 2.64101 12.8341 2.30165 12.9836 2.00055C12.6676 2 12.3399 2 12 2C7.28596 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28596 2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28596 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6601 22 11.3324 21.9995 11.0164Z" fill="currentColor"></path>
                            </svg>
                        </router-link>
                        <input type="text" disabled class="w-full pe-10 justify-start rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 font-semibold text-sm text-gray-700 dark:text-gray-100" :value="question.subject" />
                    </div>
                </div>
            </div>
        </div>
        <div :id="'subject-' + localAnswer.id" class="relative flex flex-col w-full mb-5 last:mb-0">
            <span v-if="pinned" class="absolute end-8 -top-[7px]">
                <span class="relative inline-block text-center text-white leading-none w-[88px] uppercase pt-2 pb-2 px-2 rounded-tr-lg rounded-b-lg bg-gradient-to-b from-orange-500 to-orange-800 shadow-md shadow-amber-600 before:h-[7px] before:w-1.5 before:-left-1.5 before:top-0 before:bg-orange-500 after:bg-gray-300 dark:after:bg-gray-600 after:h-[7px] after:w-2 after:rounded-[8px_8px_0_0] after:-left-2 after:top-0 before:absolute before:content-[''] before:block after:absolute after:content-[''] after:block text-xs font-semibold">
                    <span class="flex items-center text-xs font-semibold">
                        <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2188 4.83755L19.1835 7.80516C21.1954 9.81905 22.2014 10.826 21.9667 11.9115C21.7319 12.9969 20.4 13.4973 17.7362 14.4981L15.8922 15.191C15.1788 15.459 14.8221 15.593 14.5468 15.8314C14.4262 15.9358 14.3184 16.054 14.2254 16.1835C14.013 16.4795 13.9119 16.8472 13.7095 17.5825C13.2493 19.2551 13.0192 20.0914 12.4713 20.4041C12.2404 20.5358 11.9792 20.6049 11.7134 20.6045C11.0827 20.6036 10.4699 19.9902 9.24441 18.7635L7.77841 17.2961L6.69935 16.2163L5.28476 14.8C4.06698 13.581 3.45809 12.9715 3.45413 12.3446C3.45242 12.0735 3.5228 11.8069 3.65804 11.5721C3.97088 11.0289 4.80107 10.8 6.46145 10.3423C7.19811 10.1392 7.56644 10.0377 7.86251 9.82451C7.99536 9.72887 8.11619 9.61754 8.22239 9.49292C8.45908 9.2152 8.59063 8.85617 8.85373 8.1381L9.5217 6.31506C10.5086 3.62155 11.0021 2.2748 12.0904 2.03468C13.1788 1.79457 14.1921 2.8089 16.2188 4.83755Z" fill="currentColor"></path>
                            <path d="M3.30236 21.7764L7.77841 17.2961L6.69935 16.2163L2.22345 20.6965C1.92552 20.9947 1.92552 21.4782 2.22345 21.7764C2.52138 22.0747 3.00443 22.0747 3.30236 21.7764Z" fill="currentColor"></path>
                        </svg>
                        {{ $t('discuss.answer.pinned') }}
                    </span>
                </span>
            </span>
            <span v-if="best" class="absolute end-8 -top-[7px]">
                <span class="relative inline-block text-center text-white leading-none w-[100px] uppercase pt-2 pb-2 px-2 rounded-tr-lg rounded-b-lg bg-gradient-to-b from-green-500 to-green-800 shadow-md shadow-green-600 before:h-[7px] before:w-1.5 before:-left-1.5 before:top-0 before:bg-green-500 after:bg-gray-300 dark:after:bg-gray-600 after:h-[7px] after:w-2 after:rounded-[8px_8px_0_0] after:-left-2 after:top-0 before:absolute before:content-[''] before:block after:absolute after:content-[''] after:block text-xs font-semibold">
                    <span class="flex items-center text-xs font-semibold">
                        <svg class="w-4 h-4 me-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.84375 10.0213C0.84375 17.9096 2.53443 19.6003 10.4227 19.6003C18.311 19.6003 20.0016 17.9096 20.0016 10.0213C20.0016 2.13307 18.311 0.442383 10.4227 0.442383C2.53443 0.442383 0.84375 2.13307 0.84375 10.0213ZM14.1801 7.06215C14.4919 7.37388 14.4919 7.8793 14.1801 8.19104L10.1889 12.1823C9.87716 12.494 9.37174 12.494 9.06001 12.1823L7.06439 10.1867C6.75266 9.87492 6.75266 9.3695 7.06439 9.05776C7.37613 8.74603 7.88155 8.74603 8.19328 9.05776L9.62445 10.4889L13.0512 7.06215C13.363 6.75041 13.8684 6.75041 14.1801 7.06215Z" fill="currentColor"></path>
                        </svg>
                        {{ $t('discuss.answer.bestAnswer') }}
                    </span>
                </span>
            </span>
            <div
                :class="{
                    'border-t-2 border-orange-400 ': pinned,
                    'border-t-2 border-green-400 ': best,
                    'rounded-t-none': showQuestionAbove,
                }"
                class="bg-white dark:bg-gray-900 w-full flex flex-col md:flex-row md:justify-between md:items-center rounded-3xl rounded-ee-none px-4 py-3 md:py-6"
            >
                <div class="flex items-center">
                    <router-link :to="{ name: 'profile-page', params: { username: localAnswer.user.username } }" class="w-11 h-11 me-2 text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 border-2 rounded-full overflow-hidden">
                        <SeoImage
                            :src="localAnswer.user.profile_pic"
                            alt=""
                            :width="44"
                            :height="44"
                            sizes-preset="avatar"
                            img-class="w-full h-full object-cover transform transition duration-200 hover:scale-110"
                        />
                    </router-link>
                    <div class="flex flex-col">
                        <router-link :to="{ name: 'profile-page', params: { username: localAnswer.user.username } }" class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ localAnswer.user.first_name + " " + localAnswer.user.last_name }}</router-link>
                        <span v-if="new Date(localAnswer.updated_at) > new Date(localAnswer.created_at)" class="text-gray-500 dark:text-gray-400 italic text-xs">{{ $t('discuss.common.updatedAgo', { time: timeAgo(localAnswer.updated_at) }) }}</span>
                        <span v-else class="text-gray-500 dark:text-gray-400 italic text-xs">{{ $t('discuss.common.postedAgo', { time: timeAgo(localAnswer.created_at) }) }}</span>
                    </div>
                </div>
                <div class="mt-3 md:mt-0 inline-flex items-center justify-end space-x-2 rtl:space-x-reverse">
                    <button v-if="isLoggedin && showSelectBestBtn && currentUser.username === localQuestion.user.username && !localQuestion.best_answer" @click="openConfirmBestAnswerModal" class="w-8 h-8 text-lime-600 dark:text-lime-600 text-sm rounded-xl flex items-center justify-center hover:bg-lime-600 dark:hover:bg-lime-600 hover:text-white dark:hover:text-white border border-lime-600 duration-200 hover:shadow-lg hover:shadow-lime-600 hover:dark:shadow-lime-600">
                        <svg class="w-4 h-5" fill="none" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M351.605 663.268l481.761-481.761c28.677-28.677 75.171-28.677 103.847 0s28.677 75.171 0 103.847L455.452 767.115l.539.539-58.592 58.592c-24.994 24.994-65.516 24.994-90.51 0L85.507 604.864c-28.677-28.677-28.677-75.171 0-103.847s75.171-28.677 103.847 0l162.25 162.25z"></path>
                        </svg>
                    </button>
                    <button v-if="isLoggedin && showDeleteBtn && localAnswer.is_editable" @click="openDeleteModal" class="w-8 h-8 text-rose-500 dark:text-rose-500 text-sm rounded-xl flex items-center justify-center hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white dark:hover:text-white border border-rose-500 duration-200 hover:shadow-lg hover:shadow-rose-500 hover:dark:shadow-rose-500">
                        <svg class="w-4 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"></path>
                        </svg>
                    </button>
                    <button v-if="isLoggedin" @click="openReportModal" class="w-8 h-8 text-rose-500 dark:text-rose-500 text-sm rounded-xl flex items-center justify-center hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white dark:hover:text-white border border-rose-500 duration-200 hover:shadow-lg hover:shadow-rose-500 hover:dark:shadow-rose-500">
                        <svg class="w-4 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11 13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13V10C13 9.44772 12.5523 9 12 9C11.4477 9 11 9.44772 11 10V13ZM13 15.9888C13 15.4365 12.5523 14.9888 12 14.9888C11.4477 14.9888 11 15.4365 11 15.9888V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V15.9888ZM9.37735 4.66136C10.5204 2.60393 13.4793 2.60393 14.6223 4.66136L21.2233 16.5431C22.3341 18.5427 20.8882 21 18.6008 21H5.39885C3.11139 21 1.66549 18.5427 2.77637 16.5431L9.37735 4.66136Z" fill="currentColor"></path>
                        </svg>
                    </button>
                    <button v-if="isLoggedin && showEditBtn && localAnswer.is_editable && !best" @click.prevent="edit" class="w-8 h-8 text-gray-700 dark:text-gray-50 text-sm rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-300/20 duration-200 hover:shadow-lg shadow-gray-300 dark:shadow-gray-700">
                        <svg class="w-4 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C12 20.4477 12.4477 20 13 20H21C21.5523 20 22 20.4477 22 21C22 21.5523 21.5523 22 21 22H13C12.4477 22 12 21.5523 12 21Z" fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.7736 8.09994C22.3834 6.48381 22.315 4.36152 21.113 3.06183C20.5268 2.4281 19.6926 2.0233 18.7477 2.00098C17.7993 1.97858 16.8167 2.34127 15.91 3.09985C15.8868 3.11925 15.8645 3.13969 15.8432 3.16111L2.87446 16.1816C2.31443 16.7438 2 17.5051 2 18.2987V19.9922C2 21.0937 2.89197 22 4.00383 22H5.68265C6.48037 22 7.24524 21.6823 7.80819 21.1171L20.7736 8.09994ZM17.2071 5.79295C16.8166 5.40243 16.1834 5.40243 15.7929 5.79295C15.4024 6.18348 15.4024 6.81664 15.7929 7.20717L16.7929 8.20717C17.1834 8.59769 17.8166 8.59769 18.2071 8.20717C18.5976 7.81664 18.5976 7.18348 18.2071 6.79295L17.2071 5.79295Z" fill="currentColor"></path>
                        </svg>
                    </button>
                    <button @click="copyToClipboard()" class="w-8 h-8 text-gray-700 dark:text-gray-50 text-sm rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-300/20 duration-200 hover:shadow-lg shadow-gray-300 dark:shadow-gray-700">
                        <svg v-if="isCopied" class="w-4 h-5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <svg v-else class="w-4 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="currentColor"></path>
                            <path opacity="0.4" d="M17.0998 2H12.8998C9.44976 2 8.04977 3.37 8.00977 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V15.99C20.6298 15.95 21.9998 14.55 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z" fill="currentColor"></path>
                        </svg>
                    </button>
                    <router-link v-if="showQuestionAbove" :to="{ name: 'question-show', params: { questionSlug: question.slug }, hash: '#answer-form' }" class="w-8 h-8 text-gray-700 dark:text-gray-50 text-sm rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-300/20 duration-200 hover:shadow-lg shadow-gray-300 dark:shadow-gray-700">
                        <svg class="w-4 h-4" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve" fill="none">
                            <path fill="currentColor" d="M448.115,240.956c-39.306-39.389-94.166-63.913-154.235-63.885h-51.026V86.142 c0-8.058-4.506-15.439-11.674-19.125c-7.172-3.677-15.8-3.047-22.352,1.64L8.983,211.746C3.343,215.784,0,222.295,0,229.232 s3.343,13.448,8.983,17.486l199.844,143.088c6.552,4.687,15.18,5.316,22.352,1.64c7.169-3.686,11.674-11.068,11.674-19.125v-90.929 h51.026c31.59,0.019,59.708,12.651,80.467,33.331c20.676,20.755,33.305,48.882,33.332,80.473c0,28.803,23.353,52.16,52.16,52.16 S512,424,512,395.196C512.028,335.127,487.508,280.271,448.115,240.956z"></path>
                        </svg>
                    </router-link>
                    <a v-else href="#answer-form" class="w-8 h-8 text-gray-700 dark:text-gray-50 text-sm rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-300/20 duration-200 hover:shadow-lg shadow-gray-300 dark:shadow-gray-700">
                        <svg class="w-4 h-4" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve" fill="none">
                            <path fill="currentColor" d="M448.115,240.956c-39.306-39.389-94.166-63.913-154.235-63.885h-51.026V86.142 c0-8.058-4.506-15.439-11.674-19.125c-7.172-3.677-15.8-3.047-22.352,1.64L8.983,211.746C3.343,215.784,0,222.295,0,229.232 s3.343,13.448,8.983,17.486l199.844,143.088c6.552,4.687,15.18,5.316,22.352,1.64c7.169-3.686,11.674-11.068,11.674-19.125v-90.929 h51.026c31.59,0.019,59.708,12.651,80.467,33.331c20.676,20.755,33.305,48.882,33.332,80.473c0,28.803,23.353,52.16,52.16,52.16 S512,424,512,395.196C512.028,335.127,487.508,280.271,448.115,240.956z"></path>
                        </svg>
                    </a>
                </div>
            </div>
            <div class="w-full flex relative">
                <div class="z-10 w-14 md:w-16 h-full rounded-2xl" :class="[ratingClass ? ratingClass : 'bg-gray-100 dark:bg-gray-800']">
                    <div class="w-full h-full rounded-3xl pe-2 pt-2">
                        <div
                            :class="{
                                '': pinned,
                                '': best,
                                '': !pinned && !best,
                            }"
                            class="border-2 border-white dark:border-opacity-10 rounded-2xl w-full flex flex-col items-center py-1 md:py-2"
                        >
                            <button @click="likeDislike('like')" :disabled="likeLoading" class="flex justify-center align-middle items-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-500 w-[80%] md:w-[60%] h-[28px] md:h-[30px] rounded-xl hover:bg-opacity-90 hover:shadow">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.32919 18H14.6692C17.9892 18 19.3392 15.65 17.6892 12.78L16.9492 11.5C16.7692 11.19 16.4392 11 16.0792 11H7.91919C7.55919 11 7.22919 11.19 7.04919 11.5L6.30919 12.78C4.65919 15.65 6.00919 18 9.32919 18Z" fill="currentColor"></path>
                                    <path d="M8.79152 9.99859H15.2215C15.6115 9.99859 15.8515 9.57859 15.6515 9.24859L15.0115 8.14859C13.3615 5.27859 10.6415 5.27859 8.99152 8.14859L8.35152 9.24859C8.16152 9.57859 8.40152 9.99859 8.79152 9.99859Z" fill="currentColor"></path>
                                </svg>
                            </button>
                            <span class="shadow-md my-2 rounded-xl w-[80%] md:w-[60%] h-7 text-gray-700 dark:text-gray-50 bg-white dark:bg-gray-700 p-0.5 text-xs font-bold text-center flex justify-center items-center select-none" dir="ltr">{{ localAnswer.likes_count }}</span>
                            <button @click="likeDislike('dislike')" :disabled="dislikeLoading" class="flex justify-center align-middle items-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-500 w-[80%] md:w-[60%] h-[28px] md:h-[30px] rounded-xl hover:bg-opacity-90 hover:shadow">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.32919 6H14.6692C17.9892 6 19.3392 8.35 17.6892 11.22L16.9492 12.5C16.7692 12.81 16.4392 13 16.0792 13H7.91919C7.55919 13 7.22919 12.81 7.04919 12.5L6.30919 11.22C4.65919 8.35 6.00919 6 9.32919 6Z" fill="currentColor"></path>
                                    <path d="M8.79152 14H15.2215C15.6115 14 15.8515 14.42 15.6515 14.75L15.0115 15.85C13.3615 18.72 10.6415 18.72 8.99152 15.85L8.35152 14.75C8.16152 14.42 8.40152 14 8.79152 14Z" fill="currentColor"></path>
                                </svg>
                            </button>
                            <hr v-if="!best && showPinBtn && isLoggedin && localQuestion.user.username == currentUser.username" class="my-2 w-[80%] md:w-[60%] mx-auto border-t-2 border-white dark:border-gray-600" />
                            <button v-if="!best && showPinBtn && isLoggedin && localQuestion.user.username == currentUser.username" @click="togglePin" :disabled="pinLoading" class="flex justify-center align-middle items-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-500 w-[80%] md:w-[60%] h-7 rounded-xl hover:bg-opacity-90 hover:shadow">
                                <svg v-if="!localAnswer.pinned_at" class="w-4 h-4" fill="none" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" d="M231.999,107.31445,173.47168,165.8418c4.55664,12.67968,6.44531,33.88965-13.18945,59.98584a15.96991,15.96991,0,0,1-11.64649,6.33007q-.5625.03955-1.124.03956a16.0039,16.0039,0,0,1-11.31934-4.69141L88,179.314,53.65723,213.65674a8.00018,8.00018,0,0,1-11.31446-11.31348L76.686,168,28.2959,119.60986a16.01339,16.01339,0,0,1,1.2832-23.78613C55.00488,75.312,79.34082,79.35205,89.99316,82.69287L148.68555,24l.001-.001a16.02135,16.02135,0,0,1,22.627,0L232,84.68652a15.99888,15.99888,0,0,1-.001,22.62793Z"></path>
                                </svg>
                                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" d="M213.91992,210.61865a8.00027,8.00027,0,0,1-11.83984,10.7627l-26.42334-29.06543c-2.45459,14.17285-9.88623,26.21582-15.37451,33.51123a15.96882,15.96882,0,0,1-11.64649,6.33056q-.5625.03955-1.124.03956a16.0039,16.0039,0,0,1-11.31934-4.69141L88,179.314,53.65723,213.65674a8.00018,8.00018,0,0,1-11.31446-11.31348L76.686,168,28.2959,119.60986a16.01339,16.01339,0,0,1,1.2832-23.78613c16.17676-13.05029,31.90967-16.16064,43.96-15.8374l-31.459-34.605a8.00027,8.00027,0,0,1,11.83984-10.7627ZM232,84.68652,171.31348,23.999A16.02162,16.02162,0,0,0,148.68555,24L110.71,61.97607a8.00034,8.00034,0,0,0-.26269,11.03809l68.57128,75.42871a8.00133,8.00133,0,0,0,5.7295,2.61621c.06347.00147.12695.00244.19043.00244a8.00139,8.00139,0,0,0,5.65722-2.34326L231.999,107.31445A15.99888,15.99888,0,0,0,232,84.68652Z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    :class="{
                        '': pinned,
                        '': best,
                        'bg-white dark:bg-gray-900': !pinned && !best,
                    }"
                    class="bg-white dark:bg-gray-900 w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] relative rating-button-area before:start-[-2rem] rounded-b-xl md:rounded-b-3xl p-1 md:p-2"
                >
                    <div class="bg-gray-50 dark:bg-gray-600 dark:bg-opacity-10 rounded-lg md:rounded-2xl w-full h-full p-2 md:p-3 text-sm font-semibold text-gray-600 dark:text-gray-100">
                        <MarkdownRenderer startClass="rendered-content" :source="localAnswer.answer" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <BottomSheetDrawer v-model="isOpenReportModal" :initialHeight="0.7" :maxHeight="0.8" :minHeight="0.6"
    :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
    :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:w-[40rem] lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
    :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
    :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">

        <div>
                                        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <h3 class="mb-2 text-start text-base font-bold text-gray-500 dark:text-gray-200">{{ $t('discuss.common.reportTitle') }}</h3>
                                        <div class="flex flex-col space-y-2 my-3">
                                            <div class="flex flex-col space-y-2 text-sm text-start text-gray-700 dark:text-gray-400">
                                                <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                                    <input id="report-spam" v-model="report" type="radio" class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" name="" value="spam" />
                                                    <label for="report-spam" class="ms-3"> {{ $t('discuss.common.reportSpamBefore') }} <span class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportSpamHighlight') }}</span> {{ $t('discuss.common.reportSpamAfter') }} </label>
                                                </div>
                                                <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                                    <input id="report-offensive-writing" v-model="report" type="radio" class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" name="" value="offensive-writing" />
                                                    <label for="report-offensive-writing" class="ms-3"> {{ $t('discuss.common.reportOffensiveBefore') }} <span class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportOffensiveHighlight') }}</span> {{ $t('discuss.common.reportOffensiveAfter') }} </label>
                                                </div>
                                                <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                                    <input id="report-violation-of-rules" v-model="report" type="radio" class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" name="" value="violation-of-rules" />
                                                    <label for="report-violation-of-rules" class="ms-3"> {{ $t('discuss.common.reportRulesBefore') }} <span class="mx-0.5 font-bold text-gray-800 dark:text-gray-50">{{ $t('discuss.common.reportRulesHighlight') }}</span> {{ $t('discuss.common.reportRulesAfter') }} </label>
                                                </div>
                                                <div class="rounded-lg flex items-start bg-gray-100 dark:bg-gray-700/20 p-2.5">
                                                    <input id="report-other" v-model="report" type="radio" class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" name="" value="other" />
                                                    <label for="report-other" class="ms-3"> {{ $t('discuss.common.reportOther') }} </label>
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
                                            <button @click="closeReportModal" type="button" class="h-9 py-2 px-3 text-sm font-semibold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">{{ $t('discuss.common.cancel') }}</button>
                                            <button type="submit" @click="sendReport" :disabled="reportLoading" class="w-32 h-9 py-2 px-3 text-sm font-semibold text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                                                <svg v-if="reportLoading" class="w-4 h-4 m-auto" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
                                                    <circle class="stroke-current text-gray-50 text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
                                                    <circle class="stroke-current text-gray-50" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
                                                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                                                        <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
                                                        <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
                                                    </circle>
                                                </svg>
                                                <span v-else class="flex items-center">
                                                    <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16.3027 15.3365H6.68V20.1818C6.68 20.6337 6.30392 21 5.84 21C5.37608 21 5 20.6337 5 20.1818V3.81818C5 3.36631 5.37608 3 5.84 3H16.3027C17.4037 3 18.2506 3.65926 18.6739 4.48207C19.0965 5.30334 19.1414 6.35681 18.6123 7.28021L18.1096 8.15756C17.757 8.77312 17.757 9.56335 18.1096 10.1789L18.6123 11.0563C19.1414 11.9797 19.0965 13.0331 18.6739 13.8544C18.2506 14.6772 17.4037 15.3365 16.3027 15.3365Z" fill="currentColor"></path>
                                                    </svg>
                                                    {{ $t('discuss.common.sendReport') }}
                                                </span>
                                            </button>
                                        </div>
        </div>
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="isOpenDeleteModal" :initialHeight="0.5" :maxHeight="0.6" :minHeight="0.4"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:w-[25rem] lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
        :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
        :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">

        <div class="relative p-4 text-center sm:p-5">
                                <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                </svg>
                                <p class="mb-4 text-gray-500 dark:text-gray-300 font-medium">{{ $t('discuss.answer.deleteConfirm') }}</p>
                                <div class="flex justify-center items-center space-x-4 rtl:space-x-reverse">
                                    <button @click="closeDeleteModal" type="button" class="h-9 py-2 px-3 text-sm font-semibold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">{{ $t('discuss.common.keepIt') }}</button>
                                    <button type="submit" @click="deleteAnswer" :disabled="deleteLoading" class="w-32 h-9 py-2 px-3 text-sm font-semibold text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                                        <svg v-if="deleteLoading" class="w-4 h-4 m-auto" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
                                            <circle class="stroke-current text-gray-50 text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
                                            <circle class="stroke-current text-gray-50" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
                                                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                                                <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
                                                <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
                                            </circle>
                                        </svg>
                                        <span v-else>{{ $t('discuss.common.yesDelete') }} </span>
                                    </button>
                                </div>
        </div>
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="isOpenConfirmBestAnswerModal" :initialHeight="0.5" :maxHeight="0.6" :minHeight="0.4"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
        :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
        :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
        <div class="flex items-center justify-end mb-4">
            <button type="button"
                class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                @click="closeConfirmBestAnswerModal">
                <span class="sr-only">{{ $t('discuss.common.close') }}</span>
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div class="relative p-4 text-center sm:p-5">
                                <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p class="mb-4 text-gray-500 dark:text-gray-300 font-medium">{{ $t('discuss.answer.bestConfirm') }}</p>
                                <div class="mb-4 flex flex-col rounded-lg p-2 bg-amber-200/50 dark:bg-gray-700/30 text-amber-600 dark:text-amber-500 text-sm font-medium">
                                    <div class="flex items-start align-middle">
                                        <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span class="ms-2 text-sm font-bold"> {{ $t('discuss.answer.bestNoteTitle') }}</span>
                                    </div>
                                    <p class="mt-2 text-start leading-6">{{ $t('discuss.answer.bestNoteBody') }}</p>
                                </div>
                                <div class="flex justify-center items-center space-x-4 rtl:space-x-reverse">
                                    <button @click="closeConfirmBestAnswerModal" type="button" class="h-9 py-2 px-3 text-sm font-semibold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">{{ $t('discuss.answer.bestNotSure') }}</button>
                                    <button type="submit" @click="setBestAnswer" :disabled="bestLoading" class="w-32 h-9 py-2 px-3 text-sm font-semibold text-center text-white bg-lime-600 rounded-lg hover:bg-lime-700 focus:ring-2 focus:outline-none focus:ring-lime-300 dark:bg-lime-500 dark:hover:bg-lime-600 dark:focus:ring-lime-900">
                                        <svg v-if="bestLoading" class="w-4 h-4 m-auto" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
                                            <circle class="stroke-current text-gray-50 text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
                                            <circle class="stroke-current text-gray-50" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
                                                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                                                <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
                                                <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
                                            </circle>
                                        </svg>
                                        <span v-else>{{ $t('discuss.answer.bestSure') }} </span>
                                    </button>
                                </div>
        </div>
    </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { useClipboard } from "@vueuse/core";
import config from "@/store/config";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { ref } from "vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import moment from "moment";
import "moment/locale/fa";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
    components: {
        MarkdownRenderer,
        BottomSheetDrawer,
        EditorComponent,
        SeoImage,
    },
    props: {
        ratingClass: {
            type: String,
            default: "",
        },
        answer: Object,
        question: Object,
        pinned: Boolean,
        best: Boolean,
        showDateTimeAbove: {
            type: Boolean,
            default: false,
        },
        showQuestionAbove: {
            type: Boolean,
            default: false,
        },
        showSelectBestBtn: {
            type: Boolean,
            default: true,
        },
        showDeleteBtn: {
            type: Boolean,
            default: true,
        },
        showEditBtn: {
            type: Boolean,
            default: true,
        },
        showPinBtn: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            localAnswer: this.answer,
            localQuestion: this.question,
            isOpenReportModal: false,
            report: null,
            reportLoading: false,
            isOpenDeleteModal: false,
            deleteLoading: false,
            isOpenConfirmBestAnswerModal: false,
            bestLoading: false,
            isCopied: false,
            appUrl: config.appUrl,
            errors: ref(null),
            likeLoading: false,
            dislikeLoading: false,
            pinLoading: false,
            isEditing: false,
            editLoading: false,
            editContent: "",
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
    // updated() {
    //   this.localAnswer = this.answer
    //   this.localQuestion = this.question
    // },
    watch: {
        answer(newAnswer) {
            this.localAnswer = newAnswer;
        },
        question(newQuestion) {
            this.localQuestion = newQuestion;
        },
    },
    methods: {
        timeAgo(date) {
            moment.locale("fa");
            return moment(date).fromNow();
        },
        edit() {
            (this.isEditing = true), (this.editContent = this.localAnswer.answer);
        },
        updateAnswer() {
            this.editLoading = true;
            this.errors = null;
            axiosInstance
                .put("/discuss/" + this.localQuestion.slug + "/editAnswer", {
                    id: this.localAnswer.id,
                    answer: this.editContent,
                })
                .then((response) => {
                    this.localAnswer = response.data.answer;
                    toast.success(this.$t('discuss.answer.editSuccess'), {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.editLoading = false;
                    this.isEditing = false;
                    setTimeout(() => {
                        document.getElementById("subject-" + this.localAnswer.id).scrollIntoView({ behavior: "smooth" });
                    }, 500);
                })
                .catch((error) => {
                    if (error.response.status === 422) {
                        this.errors = error.response.data.errors;
                    }
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    // this.isEditing = false
                    this.editLoading = false;
                });
        },
        deleteAnswer() {
            this.deleteLoading = true;
            axiosInstance
                .delete("/discuss/" + this.localQuestion.slug + "/deleteAnswer", {
                    data: { id: this.localAnswer.id },
                })
                .then(() => {
                    this.$emit("delete-answer", this.localAnswer);
                    toast.success(this.$t('discuss.answer.deleteSuccess'), {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .catch((error) => {
                    // if (error.response.status === 422) {
                    //   this.errors = error.response.data.errors;
                    // }
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.deleteLoading = false;
                    this.closeDeleteModal();
                });
        },
        setBestAnswer() {
            this.bestLoading = true;
            axiosInstance
                .put("/discuss/" + this.localQuestion.slug + "/setBestAnswer", {
                    answer_id: this.localAnswer.id,
                })
                .then(() => {
                    this.$emit("set-best-answer", this.localAnswer);
                    toast.success(this.$t('discuss.answer.bestSuccess'), {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .catch((error) => {
                    // if (error.response.status === 422) {
                    //   this.errors = error.response.data.errors;
                    // }
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.bestLoading = false;
                    this.closeConfirmBestAnswerModal();
                });
        },
        async sendReport() {
            this.reportLoading = true;
            this.errors = null;
            await axiosInstance
                .post("/sendReport", {
                    reportable_id: this.localAnswer.id,
                    reportable_type: "Answer",
                    report: this.report,
                })
                .then(() => {
                    toast.success(this.$t('discuss.common.reportSuccess'), {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeReportModal();
                    this.report = null;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                    this.errors = error.response.data.errors;
                })
                .finally(() => {
                    this.reportLoading = false;
                });
        },
        async togglePin() {
            this.pinLoading = true;
            await axiosInstance
                .post("/discuss/layouts/toggle-pin", {
                    answer_id: this.localAnswer.id,
                })
                .then((response) => {
                    this.localAnswer.pinned_at = response.data.answer.pinned_at;
                    this.$emit("pin-toggled", this.localAnswer);
                })
                .catch((error) => {
                    console.error(error.response.data);
                })
                .finally(() => {
                    this.pinLoading = false;
                });
        },
        async likeDislike(type) {
            type === "like" ? (this.likeLoading = true) : (this.dislikeLoading = true);
            await axiosInstance
                .post("/discuss/layouts/like-dislike", {
                    likeable_id: this.localAnswer.id,
                    likeable_type: "Answer",
                    type: type,
                })
                .then((response) => {
                    this.localAnswer.likes_count = response.data.likes_count;
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        toast.warning(this.$t('discuss.common.loginToLike'), {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh text-gray-800",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    } else if (error.response.status === 403) {
                        if (error.response.data.errorType === "ownPost") {
                            toast.error(this.$t('discuss.common.cannotLikeOwn'), {
                                theme: "colored",
                                hideProgressBar: false,
                                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                                bodyClassName: "font-YekanBakh",
                                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                                transition: toast.TRANSITIONS.BOUNCE,
                                position: toast.POSITION.BOTTOM_RIGHT,
                            });
                        } else if (error.response.data.errorType === "lowScore") {
                            toast.error(this.$t('discuss.common.minScoreToLike', { score: error.response.data.minScore }), {
                                theme: "colored",
                                hideProgressBar: false,
                                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                                bodyClassName: "font-YekanBakh",
                                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                                transition: toast.TRANSITIONS.BOUNCE,
                                position: toast.POSITION.BOTTOM_RIGHT,
                            });
                        }
                    } else {
                        toast.error(this.$t('discuss.common.errorRetry'), {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    }
                    console.error(error.response.data);
                })
                .finally(() => {
                    type === "like" ? (this.likeLoading = false) : (this.dislikeLoading = false);
                });
        },
        async copyToClipboard() {
            try {
                const { copy, isSupported } = useClipboard();
                if (isSupported) {
                    // appUrl + $route.fullPath + '#subject-' + localAnswer.id
                    const resolved = this.$router.resolve({
                        name: "question-show",
                        params: { questionSlug: this.localQuestion.slug },
                        hash: `#subject-${this.localAnswer.id}`,
                    });

                    await copy(`${window.location.origin}${resolved.href}`);
                    this.isCopied = true;
                    setTimeout(() => {
                        this.isCopied = false;
                    }, 4000);
                } else {
                    console.error("عملیات کپی پشتیبانی نمی‌شود");
                }
            } catch (error) {
                console.error("خطا در کپی به کلیپبورد:", error);
            }
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
        closeConfirmBestAnswerModal() {
            this.isOpenConfirmBestAnswerModal = false;
        },
        openConfirmBestAnswerModal() {
            this.isOpenConfirmBestAnswerModal = true;
        },
    },
};
</script>

<style>
.rating-button-area:before {
    position: absolute;
    top: 0;
    /* right: -2rem; */
    height: 2rem;
    width: 2rem;
    background-color: inherit;
    content: "";
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
}
</style>
