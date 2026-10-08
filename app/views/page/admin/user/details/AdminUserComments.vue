<template>
    <div class="relative w-full">
        <div class="rounded-2xl border border-gray-200/80 bg-white p-4 md:p-5 dark:border-gray-700/80 dark:bg-gray-900 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">کامنت‌های کاربر</h4>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">نظرات ثبت‌شده روی محتوا</p>
                </div>
            </div>
            <!-- Filters -->
            <div class="gap-y-4 flex flex-col lg:flex-row lg:items-end lg:justify-between mb-4">
                <div></div>
                <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">نوع محتوا:</div>
                        <select :value="selectedFilter.slug" @change="selectFilter($event.target.value)"
                            class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg text-xs  border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-none">
                            <option v-for="(filter, key) in filters" :key="key" :value="filter.slug">
                                {{ filter.title }}
                            </option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت تایید:</div>
                        <select :value="selectedStatus.slug" @change="selectStatus($event.target.value)"
                            class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg text-xs  border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-none">
                            <option v-for="(sta, key) in status" :key="key" :value="sta.slug">
                                {{ sta.title }}
                            </option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                        <select :value="selectedSort.slug" @change="selectSort($event.target.value)"
                            class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg text-xs  border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-none">
                            <option v-for="(srt, key) in sort" :key="key" :value="srt.slug">
                                {{ srt.title }}
                            </option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">نوع نمایش:</div>
                        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                            <button @click.prevent="viewMode = 'table'"
                                :class="viewMode === 'table' ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25' : 'text-gray-600 dark:text-gray-400'"
                                class="px-2 py-1.5 rounded-lg text-xs font-bold transition-all">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3H21V21H3V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M3 9H21M9 3V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button @click.prevent="viewMode = 'grid'"
                                :class="viewMode === 'grid' ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25' : 'text-gray-600 dark:text-gray-400'"
                                class="px-2 py-1.5 rounded-lg text-xs font-bold transition-all">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3H10V10H3V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 3H21V10H14V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M3 14H10V21H3V14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 14H21V21H14V14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="inline-flex">
                        <button @click.prevent="clearFilters"
                            class="flex items-center justify-center h-7 w-7 bg-rose-400/20 hover:bg-opacity-90 rounded-lg focus:ring-1 ring-rose-500 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800">
                            <svg class="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16.8809 10C14.2609 10 12.1309 12.13 12.1309 14.75C12.1309 15.64 12.3809 16.48 12.8209 17.2C13.6409 18.58 15.1509 19.5 16.8809 19.5C18.6109 19.5 20.1209 18.57 20.9409 17.2C21.3809 16.49 21.6309 15.64 21.6309 14.75C21.6309 12.13 19.5109 10 16.8809 10ZM18.6809 16.52C18.5309 16.67 18.3409 16.74 18.1509 16.74C17.9609 16.74 17.7709 16.67 17.6209 16.52L16.9009 15.8L16.1509 16.55C16.0009 16.7 15.8109 16.77 15.6209 16.77C15.4309 16.77 15.2409 16.7 15.0909 16.55C14.8009 16.26 14.8009 15.78 15.0909 15.49L15.8409 14.74L15.1209 14.01C14.8309 13.72 14.8309 13.24 15.1209 12.95C15.4109 12.66 15.8909 12.66 16.1809 12.95L16.9009 13.67L17.6009 12.97C17.8909 12.68 18.3709 12.68 18.6609 12.97C18.9509 13.26 18.9509 13.74 18.6609 14.03L17.9609 14.73L18.6809 15.46C18.9809 15.75 18.9809 16.23 18.6809 16.52Z"
                                    fill="currentColor"></path>
                                <path
                                    d="M20.5799 4.02V6.24C20.5799 7.05 20.0799 8.06 19.5799 8.57L19.3999 8.73C19.2599 8.86 19.0499 8.89 18.8699 8.83C18.6699 8.76 18.4699 8.71 18.2699 8.66C17.8299 8.55 17.3599 8.5 16.8799 8.5C13.4299 8.5 10.6299 11.3 10.6299 14.75C10.6299 15.89 10.9399 17.01 11.5299 17.97C12.0299 18.81 12.7299 19.51 13.4899 19.98C13.7199 20.13 13.8099 20.45 13.6099 20.63C13.5399 20.69 13.4699 20.74 13.3999 20.79L11.9999 21.7C10.6999 22.51 8.90992 21.6 8.90992 19.98V14.63C8.90992 13.92 8.50992 13.01 8.10992 12.51L4.31992 8.47C3.81992 7.96 3.41992 7.05 3.41992 6.45V4.12C3.41992 2.91 4.31992 2 5.40992 2H18.5899C19.6799 2 20.5799 2.91 20.5799 4.02Z"
                                    fill="currentColor"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table View -->
            <div v-show="viewMode === 'table'">
                <div id="data-list">
                    <div class="overflow-x-auto md:custom-scrollbar pt-4">
                        <table
                            class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                <tr class="text-xs font-semibold text-start">
                                    <th class="px-1 py-3 whitespace-nowrap text-start">پوستر</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start w-48">عنوان محتوا</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start w-80">پیش‌نمایش کامنت</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت تایید</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ ارسال</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                <tr v-for="(item, i) in comments" v-show="!loading" :key="i"
                                    class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                        <router-link v-if="getCommentableRoute(item)" :to="getCommentableRoute(item)"
                                            class="flex items-center">
                                            <div
                                                class="flex-shrink-0 w-20 h-12 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-100 dark:border-opacity-10 overflow-hidden cursor-pointer hover:scale-105 duration-150">
                                                <img onerror="this.style.display='none'" v-if="getCommentablePoster(item)"
                                                    class="w-full h-full object-cover"
                                                    :src="getCommentablePoster(item)" :alt="getCommentableTitle(item)" />
                                            </div>
                                        </router-link>
                                        <div v-else class="flex items-center">
                                            <div
                                                class="flex-shrink-0 w-20 h-12 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-100 dark:border-opacity-10 overflow-hidden">
                                                <img onerror="this.style.display='none'" v-if="getCommentablePoster(item)"
                                                    class="w-full h-full object-cover hover:scale-105 duration-150"
                                                    :src="getCommentablePoster(item)" :alt="getCommentableTitle(item)" />
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 text-start w-48">
                                        <div class="flex flex-col">
                                            <router-link v-if="getCommentableRoute(item)" :to="getCommentableRoute(item)"
                                                class="mb-1 text-gray-900 dark:text-white font-bold line-clamp-1 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors cursor-pointer"
                                                :title="getCommentableTitle(item)">
                                                {{ getCommentableTitle(item) }}
                                            </router-link>
                                            <div v-else class="mb-1 text-gray-900 dark:text-white font-bold line-clamp-1"
                                                :title="getCommentableTitle(item)">
                                                {{ getCommentableTitle(item) }}
                                            </div>
                                            <div class="flex items-center gap-2 flex-wrap">
                                                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-0.5 rounded-lg">
                                                    {{ getCommentTypeTitle(item.type) }}
                                                </span>
                                                <span v-if="item.type === 'Episode' && item.commentable && item.commentable.course"
                                                    class="text-xs text-gray-500 dark:text-gray-400">
                                                    دوره: {{ item.commentable.course.title }}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 text-start w-80">
                                        <Popover class="group relative">
                                            <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                            <PopoverButton
                                                class="w-full text-start focus:outline-none group-focus-within:z-30">
                                                <div
                                                    class="text-xs font-medium  text-gray-700 dark:text-gray-300 line-clamp-1 cursor-pointer  transition-colors">
                                                    <MarkdownRenderer :source="item.comment" />
                                                </div>
                                            </PopoverButton>
                                            <transition enter-active-class="transition duration-200 ease-out"
                                                enter-from-class="translate-y-1 opacity-0"
                                                enter-to-class="translate-y-0 opacity-100"
                                                leave-active-class="transition duration-150 ease-in"
                                                leave-from-class="translate-y-0 opacity-100"
                                                leave-to-class="translate-y-1 opacity-0">
                                                <PopoverPanel
                                                    class="absolute z-30 start-0 -mt-8 p-1.5 bg-white rounded-lg shadow-lg w-80 max-w-[90vw] dark:bg-gray-900  border-gray-200 dark:border-gray-700">
                                                    <div class="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-3">
                                                        <MarkdownRenderer :source="item.comment" />
                                                    </div>
                                                </PopoverPanel>
                                            </transition>
                                        </Popover>
                                    </td>
                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                        <div v-if="item.approved"
                                            class="whitespace-nowrap flex items-center text-xs font-medium text-green-800 dark:text-green-100 bg-green-100/70 dark:bg-green-800/50 px-2 py-1 rounded-lg">
                                            <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"
                                                    stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                            تایید شده
                                        </div>
                                        <div v-else
                                            class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            در انتظار تایید
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                        <div dir="ltr"
                                            class="whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ formatDateTime(item.created_at) }}
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 whitespace-nowrap text-center">
                                        <Popover class="group relative flex items-center justify-center">
                                            <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                            <PopoverButton
                                                class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none flex items-center justify-center">
                                                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M10 2C10 0.89543 9.10457 -4.82823e-08 8 0C6.89543 4.82823e-08 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </PopoverButton>
                                            <transition enter-active-class="transition duration-200 ease-out"
                                                enter-from-class="translate-y-1 opacity-0"
                                                enter-to-class="translate-y-0 opacity-100"
                                                leave-active-class="transition duration-150 ease-in"
                                                leave-from-class="translate-y-0 opacity-100"
                                                leave-to-class="translate-y-1 opacity-0">
                                                <PopoverPanel
                                                    class="text-start flex flex-col z-30 end-10 absolute p-2 bg-white rounded-lg shadow w-max min-w-[10rem] dark:bg-gray-900 dark:divide-gray-800">
                                                    <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200 space-y-1">
                                                        <li>
                                                            <button @click.prevent="openCommentModal(item, 'preview')"
                                                                class="flex items-center gap-2 w-full text-start p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z"
                                                                        stroke="currentColor" stroke-width="2"></path>
                                                                    <path
                                                                        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                                                                        stroke="currentColor" stroke-width="2"></path>
                                                                </svg>
                                                                مشاهده
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button @click.prevent="openCommentModal(item, 'reply')"
                                                                class="flex items-center gap-2 w-full text-start p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M3 20L4.3 16.1C2.97643 14.1829 2.41421 11.8342 2.70827 9.52615C3.00233 7.21807 4.13228 5.09298 5.86763 3.55219C7.60299 2.01139 9.82179 1.15132 12.1388 1.12093C14.4558 1.09054 16.6996 1.89158 18.4798 3.37835C20.26 4.86512 21.4642 6.93647 21.8804 9.22764C22.2966 11.5188 21.8992 13.8871 20.7557 15.9139C19.6122 17.9407 17.7992 19.4988 15.6441 20.3077C13.489 21.1166 11.1218 21.1252 8.96 20.3317L3 20Z"
                                                                        stroke="currentColor" stroke-width="2"
                                                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                                                    <path d="M9 9H15M9 13H12" stroke="currentColor" stroke-width="2"
                                                                        stroke-linecap="round"></path>
                                                                </svg>
                                                                پاسخ
                                                            </button>
                                                        </li>
                                                        <li v-if="!item.approved">
                                                            <button :disabled="loadingComments[item.id]"
                                                                @click.prevent="commentToggleApproval(item)"
                                                                class="flex items-center gap-2 w-full text-start p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-60 transition-colors text-emerald-600 dark:text-emerald-400">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"
                                                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                                                </svg>
                                                                تایید
                                                            </button>
                                                        </li>
                                                        <li v-else>
                                                            <button :disabled="loadingComments[item.id]"
                                                                @click.prevent="commentToggleApproval(item)"
                                                                class="flex items-center gap-2 w-full text-start p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-60 transition-colors text-orange-600 dark:text-orange-400">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"
                                                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                                                </svg>
                                                                عدم تایید
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button :disabled="deleteLoading[item.id]"
                                                                @click.prevent="openDeleteCommentModal(item)"
                                                                class="flex items-center gap-2 w-full text-start p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 disabled:opacity-60 transition-colors text-rose-600 dark:text-rose-400">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                                                        stroke="currentColor" stroke-width="2"
                                                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                                                </svg>
                                                                حذف
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </PopoverPanel>
                                            </transition>
                                        </Popover>
                                    </td>
                                </tr>
                                <tr v-if="comments.length === 0" class="bg-white dark:bg-gray-900">
                                    <td colspan="7" class="px-4 py-12 text-center">
                                        <div class="flex flex-col items-center justify-center">
                                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                                <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            </div>
                                            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">کامنتی یافت نشد</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="h-20"></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="flex lg:flex-row flex-col items-center justify-between gap-4 mt-4">
                    <div class="">
                        <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">تعداد در صفحه:</div>
                        <select :value="perPage" @change="selectPerpage(parseInt($event.target.value))"
                            class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg text-xs  border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-none">
                            <option v-for="per in perPages" :key="per" :value="per">
                                {{ per }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Grid View -->
            <div v-show="viewMode === 'grid' && !loading" id="data-list">
                <div v-if="comments && comments.length > 0"
                    class="grid grid-cols-1 lg:grid-cols-2 gap-4 gap-y-6 lg:gap-y-4 mt-4">
                    <div v-for="(comment, index) in comments" :key="index" class="">
                        <Disclosure v-slot="{ open }" as="div" class="relative">
                            <div class="text-start w-full rounded-xl bg-gray-100 dark:bg-gray-800 p-2 md:p-3">
                            <!-- Content Info -->
                            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300 dark:border-opacity-10">
                                <router-link v-if="getCommentableRoute(comment)" :to="getCommentableRoute(comment)"
                                    class="flex-shrink-0 w-16 h-10 bg-gray-200 dark:bg-opacity-20 rounded-lg border-2 border-gray-200 dark:border-opacity-10 overflow-hidden cursor-pointer hover:scale-105 duration-150">
                                    <img onerror="this.style.display='none'" v-if="getCommentablePoster(comment)"
                                        class="w-full h-full object-cover"
                                        :src="getCommentablePoster(comment)" :alt="getCommentableTitle(comment)" />
                                </router-link>
                                <div v-else-if="getCommentablePoster(comment)"
                                    class="flex-shrink-0 w-16 h-10 bg-gray-200 dark:bg-opacity-20 rounded-lg border-2 border-gray-200 dark:border-opacity-10 overflow-hidden">
                                    <img onerror="this.style.display='none'"
                                        class="w-full h-full object-cover"
                                        :src="getCommentablePoster(comment)" :alt="getCommentableTitle(comment)" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <router-link v-if="getCommentableRoute(comment)" :to="getCommentableRoute(comment)"
                                        class="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors cursor-pointer block"
                                        :title="getCommentableTitle(comment)">
                                        {{ getCommentableTitle(comment) }}
                                    </router-link>
                                    <div v-else class="text-sm font-bold text-gray-900 dark:text-white line-clamp-1"
                                        :title="getCommentableTitle(comment)">
                                        {{ getCommentableTitle(comment) }}
                                    </div>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200/70 dark:bg-gray-700/50 px-2 py-0.5 rounded-lg">
                                            {{ getCommentTypeTitle(comment.type) }}
                                        </span>
                                        <span v-if="comment.type === 'Episode' && comment.commentable && comment.commentable.course"
                                            class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                            دوره: {{ comment.commentable.course.title }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Comment Header -->
                            <div class="flex items-center justify-between gap-2 mb-2">
                                <div class="flex items-center gap-2">
                                    <div class="text-xs text-gray-400 dark:text-gray-500">
                                        {{ formatDateTime(comment.created_at) }}
                                    </div>
                                    <div v-if="comment.approved"
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-green-800 dark:text-green-100 bg-green-100/70 dark:bg-green-800/50 px-2 py-0.5 rounded-lg">
                                        <svg class="w-3 h-3 me-1" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        تایید شده
                                    </div>
                                    <div v-else
                                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-200/70 dark:bg-gray-700/50 px-2 py-0.5 rounded-lg">
                                        در انتظار تایید
                                    </div>
                                </div>
                                <div class="hidden md:flex items-center gap-1">
                                    <button @click.prevent="openCommentModal(comment, 'preview')"
                                        class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        مشاهده
                                    </button>
                                    <button @click.prevent="openCommentModal(comment, 'reply')"
                                        class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        پاسخ
                                    </button>
                                    <button v-if="!comment.approved" :disabled="loadingComments[comment.id]"
                                        @click.prevent="commentToggleApproval(comment)"
                                        class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                                        تایید
                                    </button>
                                    <button v-else :disabled="loadingComments[comment.id]"
                                        @click.prevent="commentToggleApproval(comment)"
                                        class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                                        عدم تایید
                                    </button>
                                    <button :disabled="deleteLoading[comment.id]"
                                        @click.prevent="openDeleteCommentModal(comment)"
                                        class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 transition-colors">
                                        حذف
                                    </button>
                                </div>
                                <Popover class="md:hidden group relative">
                                    <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                    <PopoverButton
                                        class="p-1 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 rounded-md relative group-focus-within:z-30 focus:outline-none flex items-center justify-center">
                                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                            viewBox="0 0 16 16">
                                            <path
                                                d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0">
                                            </path>
                                        </svg>
                                    </PopoverButton>
                                    <transition enter-active-class="transition duration-200 ease-out"
                                        enter-from-class="translate-y-1 opacity-0"
                                        enter-to-class="translate-y-0 opacity-100"
                                        leave-active-class="transition duration-150 ease-in"
                                        leave-from-class="translate-y-0 opacity-100"
                                        leave-to-class="translate-y-1 opacity-0">
                                        <PopoverPanel
                                            class="text-start flex flex-col z-30 mt-3 end-0 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-700 dark:divide-gray-800">
                                            <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                <li>
                                                    <button type="button" @click.prevent="openCommentModal(comment, 'preview')"
                                                        class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">مشاهده</button>
                                                </li>
                                                <li>
                                                    <button @click.prevent="openCommentModal(comment, 'reply')"
                                                        class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">پاسخ</button>
                                                </li>
                                                <li>
                                                    <button v-if="!comment.approved" :disabled="loadingComments[comment.id]"
                                                        @click.prevent="commentToggleApproval(comment)"
                                                        class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">تایید</button>
                                                    <button v-else :disabled="loadingComments[comment.id]"
                                                        @click.prevent="commentToggleApproval(comment)"
                                                        class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">عدم تایید</button>
                                                </li>
                                                <li>
                                                    <button :disabled="deleteLoading[comment.id]"
                                                        @click.prevent="openDeleteCommentModal(comment)"
                                                        class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-rose-600">حذف</button>
                                                </li>
                                            </ul>
                                        </PopoverPanel>
                                    </transition>
                                </Popover>
                            </div>
                            <hr class="border-t border-gray-300 dark:border-opacity-10 mx-1 my-2">
                            <div
                                class="rounded-lg text-sm font-light leading-6 px-2 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
                                <p class="line-clamp-3">
                                    <MarkdownRenderer :source="comment.comment"></MarkdownRenderer>
                                </p>
                            </div>
                            <DisclosureButton
                                class="absolute end-3 -mb-10 mx-auto px-3 py-1 text-yellow-400 bg-gray-100 dark:bg-gray-800 text-xs font-semibold rounded-md"
                                :class="{ 'hidden': !comment.children || comment.children.length == 0 }">{{ !open ? `مشاهده
                                پاسخ‌ها` : `مخفی کردن پاسخ‌ها` }}</DisclosureButton>
                        </div>
                        <transition enter-active-class="transition-all duration-300 ease-out overflow-hidden"
                            enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-96 opacity-100"
                            leave-active-class="transition-all duration-300 ease-in overflow-hidden"
                            leave-from-class="max-h-96 opacity-100" leave-to-class="max-h-0 opacity-0">
                            <DisclosurePanel class="relative mt-6 ps-5 space-y-3"
                                :class="{ 'childs': comment.children && comment.children.length > 0 }"
                                v-if="comment.children && comment.children.length > 0">
                                <div v-for="(child, childIndex) in comment.children" :key="childIndex"
                                    :class="{ 'last-child': childIndex === comment.children.length - 1 }"
                                    class="relative child-line rounded-xl bg-gray-100 dark:bg-gray-800 p-2 md:p-3">
                                    <div class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-2">
                                            <div class="text-xs text-gray-400 dark:text-gray-500">
                                                {{ formatDateTime(child.created_at) }}
                                            </div>
                                            <div v-if="child.approved"
                                                class="whitespace-nowrap flex items-center text-xs font-medium text-green-800 dark:text-green-100 bg-green-100/70 dark:bg-green-800/50 px-2 py-0.5 rounded-lg">
                                                <svg class="w-3 h-3 me-1" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"
                                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                                </svg>
                                                تایید شده
                                            </div>
                                            <div v-else
                                                class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-200/70 dark:bg-gray-700/50 px-2 py-0.5 rounded-lg">
                                                در انتظار تایید
                                            </div>
                                        </div>
                                        <div class="hidden md:flex items-center gap-1">
                                            <button @click.prevent="openCommentModal(child, 'preview')"
                                                class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                مشاهده
                                            </button>
                                            <button @click.prevent="openCommentModal(child, 'reply')"
                                                class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                پاسخ
                                            </button>
                                            <button v-if="!child.approved" :disabled="loadingComments[child.id]"
                                                @click.prevent="commentToggleApproval(child)"
                                                class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                                                تایید
                                            </button>
                                            <button v-else :disabled="loadingComments[child.id]"
                                                @click.prevent="commentToggleApproval(child)"
                                                class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                                                عدم تایید
                                            </button>
                                            <button :disabled="deleteLoading[child.id]"
                                                @click.prevent="openDeleteCommentModal(child)"
                                                class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 transition-colors">
                                                حذف
                                            </button>
                                        </div>
                                        <Popover class="md:hidden group relative">
                                            <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                            <PopoverButton
                                                class="p-1 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 rounded-md relative group-focus-within:z-30 focus:outline-none flex items-center justify-center">
                                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                    viewBox="0 0 16 16">
                                                    <path
                                                        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0">
                                                    </path>
                                                </svg>
                                            </PopoverButton>
                                            <transition enter-active-class="transition duration-200 ease-out"
                                                enter-from-class="translate-y-1 opacity-0"
                                                enter-to-class="translate-y-0 opacity-100"
                                                leave-active-class="transition duration-150 ease-in"
                                                leave-from-class="translate-y-0 opacity-100"
                                                leave-to-class="translate-y-1 opacity-0">
                                                <PopoverPanel
                                                    class="text-start flex flex-col z-30 mt-3 end-0 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-700 dark:divide-gray-800">
                                                    <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                        <li>
                                                            <button type="button" @click.prevent="openCommentModal(child, 'preview')"
                                                                class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">مشاهده</button>
                                                        </li>
                                                        <li>
                                                            <button @click.prevent="openCommentModal(child, 'reply')"
                                                                class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">پاسخ</button>
                                                        </li>
                                                        <li>
                                                            <button v-if="!child.approved" :disabled="loadingComments[child.id]"
                                                                @click.prevent="commentToggleApproval(child)"
                                                                class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">تایید</button>
                                                            <button v-else :disabled="loadingComments[child.id]"
                                                                @click.prevent="commentToggleApproval(child)"
                                                                class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">عدم تایید</button>
                                                        </li>
                                                        <li>
                                                            <button :disabled="deleteLoading[child.id]"
                                                                @click.prevent="openDeleteCommentModal(child)"
                                                                class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-rose-600">حذف</button>
                                                        </li>
                                                    </ul>
                                                </PopoverPanel>
                                            </transition>
                                        </Popover>
                                    </div>
                                    <hr class="border-t border-gray-300 dark:border-opacity-10 mx-1 my-2">
                                    <div
                                        class="rounded-lg text-sm font-light leading-6 p-2 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
                                        <p class="line-clamp-3">
                                            <MarkdownRenderer :source="child.comment"></MarkdownRenderer>
                                        </p>
                                    </div>
                                </div>
                            </DisclosurePanel>
                        </transition>
                    </Disclosure>
                </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                    <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">کامنتی یافت نشد</p>
                </div>
                <div class="flex lg:flex-row flex-col items-center justify-between gap-4 mt-6">
                    <div class="">
                        <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">تعداد در صفحه:</div>
                        <select :value="perPage" @change="selectPerpage(parseInt($event.target.value))"
                            class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg text-xs  border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-none">
                            <option v-for="per in perPages" :key="per" :value="per">
                                {{ per }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <BottomSheetDrawer v-model="isOpenCommentModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="bs.ADMIN_BS_PANEL"
            :contentClass="bs.ADMIN_BS_CONTENT"
            :backdropClass="bs.ADMIN_BS_BACKDROP">
            <template v-if="selectedComment">
                <AdminBottomSheetHeader
                    title="کامنت"
                    subtitle="مشاهده و پاسخ به کامنت"
                    accent="rose"
                    @close="closeCommentModal">
                    <template #icon>
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </template>
                </AdminBottomSheetHeader>
                <div :class="bs.ADMIN_BS_FORM_BODY" class="flex items-center gap-3">
                    <router-link v-if="getCommentableRoute(selectedComment)" :to="getCommentableRoute(selectedComment)"
                        class="flex-shrink-0 w-16 h-12 rounded-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden cursor-pointer hover:scale-105 duration-150">
                        <img onerror="this.style.display='none'" v-if="getCommentablePoster(selectedComment)"
                            class="w-full h-full object-cover"
                            :src="getCommentablePoster(selectedComment)"
                            :alt="getCommentableTitle(selectedComment)" />
                    </router-link>
                    <div v-else-if="getCommentablePoster(selectedComment)"
                        class="flex-shrink-0 w-16 h-12 rounded-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
                        <img onerror="this.style.display='none'"
                            class="w-full h-full object-cover"
                            :src="getCommentablePoster(selectedComment)"
                            :alt="getCommentableTitle(selectedComment)" />
                    </div>
                    <div class="min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-0.5 rounded-lg">
                                {{ getCommentTypeTitle(selectedComment.type) }}
                            </span>
                            <router-link v-if="getCommentableRoute(selectedComment)" :to="getCommentableRoute(selectedComment)"
                                class="text-gray-700 dark:text-gray-100 font-semibold hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer line-clamp-1">
                                {{ getCommentableTitle(selectedComment) }}
                            </router-link>
                            <div v-else class="text-gray-700 dark:text-gray-100 font-semibold line-clamp-1">
                                {{ getCommentableTitle(selectedComment) }}
                            </div>
                        </div>
                        <div v-if="selectedComment.type === 'Episode' && selectedComment.commentable && selectedComment.commentable.course"
                            class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            دوره: {{ selectedComment.commentable.course.title }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {{ formatDateTime(selectedComment.created_at) }}
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    <button @click="activeTab = 'preview'"
                        :class="activeTab === 'preview' ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25' : 'text-gray-600 dark:text-gray-400'"
                        class="flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all">
                        مشاهده
                    </button>
                    <button @click="activeTab = 'reply'"
                        :class="activeTab === 'reply' ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25' : 'text-gray-600 dark:text-gray-400'"
                        class="flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all">
                        پاسخ
                    </button>
                </div>

                <div v-show="activeTab === 'preview'" class="mt-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div :class="bs.ADMIN_BS_FORM_BODY" class="text-sm text-gray-700 dark:text-gray-300">
                        <MarkdownRenderer :source="selectedComment.comment" />
                    </div>
                </div>

                <div v-show="activeTab === 'reply'" class="mt-4">
                    <div class="mb-3" v-if="selectedComment && !selectedComment.approved">
                        <input type="checkbox" v-model="selectedCommentForReplyApprovedCheck" id="approve-parent"
                            class="hidden peer" />
                        <label for="approve-parent"
                            class="flex items-center justify-between w-max px-2 py-1 text-xs font-medium text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-amber-400 dark:peer-checked:border-amber-400 hover:text-gray-600 dark:peer-checked:text-amber-400 peer-checked:text-amber-500 peer-checked:bg-amber-400/10 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-opacity-80">
                            <svg v-if="selectedCommentForReplyApprovedCheck" class="me-2 w-5 h-5"
                                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z"
                                    fill="currentColor"></path>
                            </svg>
                            <span v-else class="w-3 h-3 m-1 me-3 bg-gray-500 rounded-lg"></span>
                            کامنت نیز تایید شود
                        </label>
                    </div>
                    <div class="relative rounded-xl border-2 border-dashed border-gray-200/70 dark:border-gray-700/60 bg-gray-50/40 dark:bg-gray-800/20 p-2 md:p-4">
                        <EditorComponent class="relative" :submitButton="false" :cancelButton="false"
                            :bodyClass="['bg-gray-100/60', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-50']"
                            :toolbarClass="['bg-gray-100', 'dark:bg-gray-800/70', 'my-2', 'rounded-lg', 'px-2']"
                            v-model="replyForSelectedComment"
                            :errors="errors?.parent_approved?.[0] || errors?.comment?.[0] || errors?.parent_id?.[0] || ''" />
                        <button @click.prevent="commentSendReply" :disabled="replyCommentLoading"
                            class="absolute bottom-2 md:bottom-4 end-4 disabled:opacity-60 whitespace-nowrap bg-amber-400 hover:bg-amber-500 text-sm font-bold px-4 py-1.5 rounded-xl text-gray-900 flex items-center shadow-sm shadow-amber-400/25 transition-colors">
                            ثبت پاسخ
                            <svg class="shrink-0 ms-2 w-6 h-6" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M3.3437 9.02975C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C4.00549 17.7916 6.20841 19.9945 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C17.7916 19.9945 19.9945 17.7916 20.6563 14.9703C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20842 17.7916 4.00549 14.9703 3.3437C13.0166 2.88543 10.9834 2.88544 9.02975 3.3437C6.20842 4.00549 4.00549 6.20841 3.3437 9.02975ZM11.467 14.8175C11.2327 15.0518 10.8528 15.0518 10.6184 14.8175L8.22523 12.4243C8.11271 12.3117 8.0495 12.1591 8.0495 12C8.0495 11.8409 8.11271 11.6883 8.22523 11.5757L10.6184 9.18252C10.8528 8.94821 11.2327 8.94821 11.467 9.18252C11.7013 9.41684 11.7013 9.79673 11.467 10.031L10.098 11.4H15.3505C15.6819 11.4 15.9505 11.6686 15.9505 12C15.9505 12.3314 15.6819 12.6 15.3505 12.6L10.098 12.6L11.467 13.969C11.7013 14.2033 11.7013 14.5832 11.467 14.8175Z"
                                    fill="currentColor"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </template>
        </BottomSheetDrawer>

        <BottomSheetDrawer v-model="showDeleteCommentModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="bs.ADMIN_BS_PANEL_SM"
            :contentClass="bs.ADMIN_BS_CONTENT"
            :backdropClass="bs.ADMIN_BS_BACKDROP">
            <AdminBottomSheetHeader
                title="حذف کامنت"
                subtitle="این عملیات قابل بازگشت نیست"
                accent="rose"
                @close="closeDeleteCommentModal">
                <template #icon>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </template>
            </AdminBottomSheetHeader>
            <AdminBottomSheetConfirm
                message="از حذف این کامنت اطمینان کامل دارید؟"
                description="این کامنت به طور کامل حذف خواهد شد و قابل بازیابی نیست."
                :loading="commentForDelete && deleteLoading[commentForDelete.id]"
                @cancel="closeDeleteCommentModal"
                @confirm="deleteComment(commentForDelete)"
            />
        </BottomSheetDrawer>
        <LoadingComponent v-if="loading" />
    </div>
</template>

<script>
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetConfirm from "@/views/components/admin/bottomSheet/AdminBottomSheetConfirm.vue";
import * as adminBottomSheetStyles from "@/views/components/admin/bottomSheet/adminBottomSheetStyles";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import moment from "moment";
import "moment/locale/fa";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    components: {
        LoadingComponent,
        PaginationComponent,
        EditorComponent,
        MarkdownRenderer,
        BottomSheetDrawer,
        AdminBottomSheetHeader,
        AdminBottomSheetConfirm,
        Popover,
        PopoverButton,
        PopoverPanel,
        PopoverOverlay,
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
    },
    props: {
        username: {
            type: String,
            required: true,
        },
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterFromUrl = urlParams.get("filter") || "all";
        const sortFromUrl = urlParams.get("sort") || "newest";
        const statusFromUrl = urlParams.get("status") || "all";
        const pageFromUrl = parseInt(urlParams.get("page") || "1", 10);
        const viewModeFromUrl = urlParams.get("viewMode") || "table";

        const filters = {
            all: { title: "همه", slug: "all" },
            course: { title: "دوره‌ها", slug: "course" },
            episode: { title: "جلسات", slug: "episode" },
            path: { title: "مسیرها", slug: "path" },
        };
        const sort = {
            newest: { title: "جدیدترین", slug: "newest" },
            oldest: { title: "قدیمی‌ترین", slug: "oldest" },
        };
        const status = {
            all: { title: "همه", slug: "all" },
            published: { title: "منتشر شده", slug: "published" },
            unpublished: { title: "منتشر نشده", slug: "unpublished" },
        };

        return {
            bs: adminBottomSheetStyles,
            filters,
            sort,
            status,
            selectedFilter: filters[filterFromUrl] || filters.all,
            selectedSort: sort[sortFromUrl] || sort.newest,
            selectedStatus: status[statusFromUrl] || status.all,
            currentPage: pageFromUrl > 0 ? pageFromUrl : 1,
            perPage: 10,
            perPages: [10, 20, 30, 50, 100],
            comments: [],
            pagination: {},
            loading: false,
            mountedOnce: false,
            loadingComments: {},
            deleteLoading: {},
            // unified modal
            isOpenCommentModal: false,
            selectedComment: null,
            activeTab: 'preview', // 'preview' or 'reply'
            selectedCommentForReplyApprovedCheck: true,
            replyForSelectedComment: "",
            replyCommentLoading: false,
            errors: null,
            // delete
            showDeleteCommentModal: false,
            commentForDelete: null,
            // view mode
            viewMode: (viewModeFromUrl === 'table' || viewModeFromUrl === 'grid') ? viewModeFromUrl : 'table', // 'table' or 'grid'
        };
    },
    methods: {
        selectFilter(slug) {
            this.selectedFilter = this.filters[slug] || this.filters.all;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        selectStatus(slug) {
            this.selectedStatus = this.status[slug] || this.status.all;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        selectSort(slug) {
            this.selectedSort = this.sort[slug] || this.sort.newest;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        selectPerpage(value) {
            this.perPage = value;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        clearFilters() {
            this.selectedFilter = this.filters.all;
            this.selectedStatus = this.status.all;
            this.selectedSort = this.sort.newest;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        updatePage(value) {
            this.currentPage = value;
            this.updateUrlAndFetchData();
        },
        updateUrlAndFetchData() {
            const params = new URLSearchParams(window.location.search);

            // حفظ section و سایر query های والد (در صورت نیاز)
            params.forEach((value, key) => {
                if (!["filter", "status", "sort", "page", "viewMode"].includes(key)) {
                    // نگه داشتن
                }
            });

            if (this.selectedFilter && this.selectedFilter.slug !== "all") {
                params.set("filter", this.selectedFilter.slug);
            } else {
                params.delete("filter");
            }

            if (this.selectedStatus && this.selectedStatus.slug !== "all") {
                params.set("status", this.selectedStatus.slug);
            } else {
                params.delete("status");
            }

            if (this.selectedSort && this.selectedSort.slug !== "newest") {
                params.set("sort", this.selectedSort.slug);
            } else {
                params.delete("sort");
            }

            if (this.currentPage !== 1) {
                params.set("page", this.currentPage);
            } else {
                params.delete("page");
            }

            if (this.viewMode && this.viewMode !== "table") {
                params.set("viewMode", this.viewMode);
            } else {
                params.delete("viewMode");
            }

            const queryString = params.toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
            window.history.pushState(null, "", newUrl);

            this.getComments();
        },
        async getComments() {
            this.loading = true;
            try {
                let params = {
                    page: this.currentPage,
                    perPage: this.perPage,
                    filter: this.selectedFilter && this.selectedFilter.slug !== "all" ? this.selectedFilter.slug : undefined,
                    sort: this.selectedSort ? this.selectedSort.slug : undefined,
                    status: this.selectedStatus ? this.selectedStatus.slug : undefined,
                    viewMode: this.viewMode,
                };
                Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

                const response = await axiosInstance.post(
                    `admin/user/${this.username}/comments`,
                    params
                );
                this.comments = response.data.comments || [];
                this.pagination = response.data.pagination || {};
                this.currentPage = this.pagination.current_page || 1;

                if (this.mountedOnce) {
                    setTimeout(() => {
                        const el = document.getElementById("data-list");
                        if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                        }
                    }, 150);
                }
            } catch (error) {
                console.error(error.response?.data || error);
            } finally {
                this.loading = false;
                this.mountedOnce = true;
            }
        },
        timeAgo(date) {
            moment.locale("fa");
            return moment(date).fromNow();
        },
        formatDateTime(value) {
            if (!value) return "-";
            const d = new Date(value);
            const date = d
                .toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })
                .replace(/\//g, "-");
            const time = d
                .toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
            return `${date} | ${time}`;
        },
        getCommentableTitle(item) {
            if (!item || !item.commentable) return "-";
            if (this.selectedFilter.slug === "episode") {
                return item.commentable.title || "-";
            }
            return item.commentable.title || "-";
        },
        getCommentablePoster(item) {
            if (!item || !item.commentable) return null;
            let poster = null;
            if (item.type === 'Course' && item.commentable.poster) {
                poster = item.commentable.poster;
            } else if (item.type === 'Episode' && item.commentable.course && item.commentable.course.poster) {
                poster = item.commentable.course.poster;
            } else if (item.type === 'Path' && item.commentable.poster) {
                poster = item.commentable.poster;
            }
            if (poster) {
                return poster.startsWith('http') ? poster : `${process.env.VUE_APP_SITE_URL || 'https://zanburak.ir'}${poster}`;
            }
            return null;
        },
        getCommentTypeTitle(type) {
            const typeMap = {
                'Course': 'دوره',
                'Episode': 'جلسه',
                'Path': 'مسیر',
            };
            return typeMap[type] || type || '-';
        },
        getCommentableRoute(item) {
            if (!item || !item.commentable) return null;
            
            if (item.type === 'Course' && item.commentable.slug) {
                return {
                    name: 'course.show',
                    params: { courseSlug: item.commentable.slug }
                };
            } else if (item.type === 'Episode' && item.commentable.order != null && item.commentable.course && item.commentable.course.slug) {
                return {
                    name: 'episode.show',
                    params: { 
                        courseSlug: item.commentable.course.slug,
                        episodeOrder: item.commentable.order,
                    }
                };
            } else if (item.type === 'Path' && item.commentable.slug) {
                return {
                    name: 'path.show',
                    params: { pathSlug: item.commentable.slug }
                };
            }
            return null;
        },
        async commentToggleApproval(comment) {
            if (!comment || !comment.id) return;
            this.loadingComments[comment.id] = true;
            try {
                await axiosInstance.post("admin/comments/toggle-approval", {
                    comment_id: comment.id,
                });
                comment.approved = !comment.approved;
            } catch (error) {
                console.error(error.response?.data || error);
            } finally {
                this.loadingComments[comment.id] = false;
            }
        },
        openDeleteCommentModal(comment) {
            this.commentForDelete = comment;
            this.showDeleteCommentModal = true;
        },
        closeDeleteCommentModal() {
            this.commentForDelete = null;
            this.showDeleteCommentModal = false;
        },
        async deleteComment(comment) {
            if (!comment || !comment.id) return;
            this.deleteLoading[comment.id] = true;
            try {
                await axiosInstance.post("admin/comments/delete", {
                    comment_id: comment.id,
                });
                this.comments = this.comments.filter((c) => c.id !== comment.id);
                this.closeDeleteCommentModal();
                if (toast) {
                    toast.success("کامنت با موفقیت حذف شد.", {
                        theme: "colored",
                        rtl: localStorage.getItem("direction") === "rtl",
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }
            } catch (error) {
                console.error(error.response?.data || error);
                if (toast) {
                    toast.error("حذف کامنت با خطا مواجه شد.", {
                        theme: "colored",
                        rtl: localStorage.getItem("direction") === "rtl",
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }
            } finally {
                this.deleteLoading[comment.id] = false;
            }
        },
        // Preview modal
        openCommentModal(comment, tab = 'preview') {
            this.selectedComment = comment;
            this.activeTab = tab;
            if (tab === 'reply') {
                this.selectedCommentForReplyApprovedCheck = true;
                this.replyForSelectedComment = "";
                this.errors = null;
            }
            this.isOpenCommentModal = true;
        },
        closeCommentModal() {
            this.isOpenCommentModal = false;
            this.selectedComment = null;
            this.activeTab = 'preview';
            this.selectedCommentForReplyApprovedCheck = true;
            this.replyForSelectedComment = "";
            this.errors = null;
        },
        async commentSendReply() {
            if (!this.selectedComment || !this.selectedComment.id) return;
            this.replyCommentLoading = true;
            this.errors = null;
            try {
                await axiosInstance.post("admin/comments/send-reply", {
                    parent_id: this.selectedComment.id,
                    comment: this.replyForSelectedComment,
                    parent_approved: this.selectedCommentForReplyApprovedCheck,
                });

                if (this.selectedCommentForReplyApprovedCheck) {
                    this.selectedComment.approved = true;
                }

                if (toast) {
                    toast.success("پاسخ کامنت با موفقیت ثبت شد.", {
                        theme: "colored",
                        rtl: localStorage.getItem("direction") === "rtl",
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }

                this.closeCommentModal();
            } catch (error) {
                console.error(error.response?.data || error);
                if (error.response && error.response.status === 422) {
                    this.errors = error.response.data.errors || null;
                }
            } finally {
                this.replyCommentLoading = false;
            }
        },
    },
    watch: {
        viewMode(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.currentPage = 1;
                this.updateUrlAndFetchData();
            }
        },
    },
    mounted() {
        this.getComments();
    },
};
</script>

<style scoped>
.childs::before {
    display: block;
    content: '';
    position: absolute;
    top: -1.55rem;
    left: 0.7rem;
    width: 2px;
    height: 100%;
    background-color: #d1d5db;
    /* gray-300 */
}

.child-line::before {
    content: '';
    position: absolute;
    top: 20%;
    left: -0.5rem;
    width: 0.5rem;
    height: 2px;
    background-color: #d1d5db;
    transform: translateY(-50%);
}

.dark .childs::before,
.dark .child-line::before {
    background-color: #374151;
    /* gray-700 */
}

:dir(rtl) .childs::before {
    left: auto;
    right: 0.7rem;
}

:dir(rtl) .child-line::before {
    left: auto;
    right: -0.5rem;
}

.last-child::after {
    content: "";
    display: block;
    position: absolute;
    left: -0.6rem;
    top: calc(20% + 5px);
    width: 5px;
    height: calc(80% + 5px);
    background: #ffffff;
}

:dir(rtl) .last-child::after {
    left: auto;
    right: -0.6rem;
}

.dark .last-child::after {
    background: #111827;
}
</style>