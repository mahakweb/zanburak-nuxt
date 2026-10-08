<template>
    <AdminTabPanelToolbar>
        <div class="w-max shrink-0">
            <div class="text-xs font-light text-gray-400 px-1 mb-1">نوع نمایش:</div>
            <div class="flex items-center h-9 gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                <button type="button" @click.prevent="viewMode = 'table'; changeViewMode()"
                    :class="viewMode === 'table' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400'"
                    class="w-full h-full px-2 py-1 rounded-md text-xs font-semibold transition-colors">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 3H21V21H3V3Z" stroke="currentColor" stroke-width="2"/><path d="M3 9H21M9 3V21" stroke="currentColor" stroke-width="2"/></svg>
                </button>
                <button type="button" @click.prevent="viewMode = 'grid'; changeViewMode()"
                    :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400'"
                    class="w-full h-full px-2 py-1 rounded-md text-xs font-semibold transition-colors">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 3H10V10H3V3Z" stroke="currentColor" stroke-width="2"/><path d="M14 3H21V10H14V3Z" stroke="currentColor" stroke-width="2"/><path d="M3 14H10V21H3V14Z" stroke="currentColor" stroke-width="2"/><path d="M14 14H21V21H14V14Z" stroke="currentColor" stroke-width="2"/></svg>
                </button>
            </div>
        </div>
        <AdminFilterSelect v-model="filters.approved" label="وضعیت تایید" :options="approvedOptions" @change="onFilterChange" />
        <AdminFilterSelect v-model="filters.sort" label="مرتب‌سازی" :options="sortOptions" @change="onFilterChange" />
    </AdminTabPanelToolbar>
    <AdminInlineLoading v-if="loading" />
    <div v-else id="data-list">
    <!-- Table View -->
    <div v-show="viewMode === 'table'">
        <div class="overflow-x-auto md:custom-scrollbar pt-4">
            <table
                class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <tr class="text-xs font-semibold text-start">
                        <th class="px-1 py-3 whitespace-nowrap text-start">کاربر</th>
                        <th class="px-1 py-3 whitespace-nowrap text-start w-80">پیش‌نمایش کامنت</th>
                        <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت تایید</th>
                        <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ ارسال</th>
                        <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                    </tr>
                </thead>
                <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                    <tr v-for="(item, i) in comments" :key="i"
                        class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                        <td class="px-1 py-3 whitespace-nowrap text-start">
                            <router-link v-if="item.user" :to="{ name: 'profile-page', params: { username: item.user.username } }"
                                class="flex items-center gap-2 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                                <div class="relative w-8 h-8 flex-shrink-0">
                                    <img v-if="item.user.profile_pic" 
                                        :src="item.user.profile_pic" 
                                        :alt="item.user.username"
                                        class="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                        @error="$event.target.style.display='none'" />
                                    <div v-else class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                                        <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-xs font-semibold">{{ item.user.first_name }} {{ item.user.last_name }}</span>
                                    <span class="text-xs text-gray-500 dark:text-gray-400">@{{ item.user.username }}</span>
                                </div>
                            </router-link>
                            <span v-else class="text-xs text-gray-500">کاربر حذف شده</span>
                        </td>
                        <td class="px-1 py-3 text-start w-80">
                            <div class="flex flex-col gap-1">
                                <Popover class="group relative">
                                    <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                    <PopoverButton
                                        class="w-full text-start focus:outline-none group-focus-within:z-30">
                                        <div
                                            class="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1 cursor-pointer transition-colors">
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
                                            class="absolute z-30 start-0 -mt-8 p-1.5 bg-white rounded-lg shadow-lg w-80 max-w-[90vw] dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                            <div class="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-3">
                                                <MarkdownRenderer :source="item.comment" />
                                            </div>
                                        </PopoverPanel>
                                    </transition>
                                </Popover>
                                <span v-if="item.parent" class="text-xs text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-800/50 px-2 py-0.5 rounded-lg w-max">
                                    پاسخ به: {{ item.parent.user ? item.parent.user.first_name + ' ' + item.parent.user.last_name : 'کاربر ناشناس' }}
                                </span>
                            </div>
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
                            <div class="hidden md:flex items-center justify-center gap-1">
                                <button @click.prevent="openPreviewCommentModal(item)"
                                    class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">مشاهده</button>
                                <button @click.prevent="openReplyCommentModal(item)"
                                    class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">پاسخ</button>
                                <button v-if="!item.approved" :disabled="loadingComments[item.id]"
                                    @click.prevent="commentToggleApproval(item, item.id)"
                                    class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">تایید</button>
                                <button v-else @click.prevent="commentToggleApproval(item, item.id)"
                                    :disabled="loadingComments[item.id]"
                                    class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">عدم تایید</button>
                            </div>
                            <Popover class="md:hidden group relative flex items-center justify-center">
                                <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                <PopoverButton
                                    class="p-1 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 rounded-md relative  group-focus-within:z-30 focus:outline-none  flex items-center justify-center">
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
                                                <button type="button" @click.prevent="openPreviewCommentModal(item)"
                                                    class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">مشاهده</button>
                                            </li>
                                            <li>
                                                <button @click.prevent="openReplyCommentModal(item)"
                                                    class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">پاسخ</button>
                                            </li>
                                            <li>
                                                <button v-if="!item.approved" :disabled="loadingComments[item.id]"
                                                    @click.prevent="commentToggleApproval(item, item.id)"
                                                    class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">تایید</button>
                                                <button v-else :disabled="loadingComments[item.id]"
                                                    @click.prevent="commentToggleApproval(item, item.id)"
                                                    class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">عدم تایید</button>
                                            </li>
                                        </ul>
                                    </PopoverPanel>
                                </transition>
                            </Popover>
                        </td>
                    </tr>
                    <tr v-if="comments.length === 0" class="bg-white dark:bg-gray-900">
                        <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            کامنتی یافت نشد
                        </td>
                    </tr>
                    <tr class="h-20"></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Grid View -->
    <div v-show="viewMode === 'grid'">
        <div v-if="comments && comments.length > 0"
            class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div v-for="(comment, index) in comments" :key="index" class="h-auto self-start">
                <Disclosure v-slot="{ open }" as="div" class="relative rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div class="text-start w-full p-3 md:p-4">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center">
                                <router-link v-if="comment.user" :to="{ name: 'profile-page', params: { username: comment.user.username } }"
                                    class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500">
                                    <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-200"
                                        :src="comment.user.profile_pic" :alt="comment.user.username" />
                                </router-link>
                                <div v-else class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500 flex items-center justify-center">
                                    <span class="text-gray-600 dark:text-gray-300 text-sm font-semibold">?</span>
                                </div>
                                <div class="space-y-1 ms-2">
                                    <router-link v-if="comment.user"
                                        :to="{ name: 'profile-page', params: { username: comment.user.username } }"
                                        class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                                        {{ comment.user.name || (comment.user.first_name + ' ' + comment.user.last_name) }}
                                    </router-link>
                                    <span v-else class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">کاربر ناشناس</span>
                                    <p class="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{{
                                        timeAgo(comment.created_at) }}</p>
                                </div>
                            </div>
                            <div class="hidden md:flex items-center gap-1">
                                <button @click.prevent="openReplyCommentModal(comment)"
                                    class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">پاسخ</button>
                                <button v-if="!comment.approved" :disabled="loadingComments[comment.id]"
                                    @click.prevent="commentToggleApproval(comment, comment.id)"
                                    class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">تایید</button>
                                <button v-else @click.prevent="commentToggleApproval(comment, comment.id)"
                                    :disabled="loadingComments[comment.id]"
                                    class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">عدم
                                    تایید</button>
                                <button @click.prevent="openPreviewCommentModal(comment)"
                                    class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">مشاهده</button>
                            </div>
                            <Popover class="md:hidden group relative">
                                <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                <PopoverButton
                                    class="p-1 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 rounded-md relative  group-focus-within:z-30 focus:outline-none  flex items-center justify-center">
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
                                                <button type="button" @click.prevent="openPreviewCommentModal(comment)"
                                                    class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">مشاهده</button>
                                            </li>
                                            <li>
                                                <button @click.prevent="openReplyCommentModal(comment)"
                                                    class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">پاسخ</button>
                                            </li>
                                            <li>
                                                <button v-if="!comment.approved" :disabled="loadingComments[comment.id]"
                                                    @click.prevent="commentToggleApproval(comment, comment.id)"
                                                    class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">تایید</button>
                                                <button v-else :disabled="loadingComments[comment.id]"
                                                    @click.prevent="commentToggleApproval(comment, comment.id)"
                                                    class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">عدم
                                                    تایید</button>
                                            </li>
                                        </ul>
                                    </PopoverPanel>
                                </transition>
                            </Popover>
                        </div>
                        <hr class="border-t border-gray-300 dark:border-opacity-10 mx-1 my-2">
                        <div class="rounded-xl text-sm leading-6 px-3 py-2 bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800">
                            <p class="line-clamp-3">
                                <MarkdownRenderer :source="comment.comment"></MarkdownRenderer>
                            </p>
                        </div>
                        <DisclosureButton
                            class="mt-3 w-full px-3 py-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 text-xs font-semibold rounded-lg hover:bg-amber-100 dark:hover:bg-amber-400/15 transition-colors"
                            :class="{ 'hidden': !comment.replies || comment.replies.length == 0 }">{{ !open ? `مشاهده
                            پاسخ‌ها (${comment.replies?.length || 0})` : `مخفی کردن پاسخ‌ها` }}</DisclosureButton>
                    </div>
                    <transition enter-active-class="transition-all duration-300 ease-out overflow-hidden"
                        enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[3000px] opacity-100"
                        leave-active-class="transition-all duration-300 ease-in overflow-hidden"
                        leave-from-class="max-h-[3000px] opacity-100" leave-to-class="max-h-0 opacity-0">
                        <DisclosurePanel class="relative px-4 pb-4 pt-0 space-y-3 border-t border-gray-100 dark:border-gray-800"
                            :class="{ 'childs': comment.replies && comment.replies.length > 0 }"
                            v-if="comment.replies && comment.replies.length > 0">
                            <div v-for="(reply, replyIndex) in comment.replies" :key="replyIndex"
                                :class="{ 'last-child': replyIndex === comment.replies.length - 1 }"
                                class="relative child-line rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40 p-3">
                                <div class="flex items-center justify-between gap-2">
                                    <div class="flex items-center">
                                        <router-link v-if="reply.user"
                                            :to="{ name: 'profile-page', params: { username: reply.user.username } }"
                                            class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500">
                                            <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-200"
                                                :src="reply.user.profile_pic" :alt="reply.user.username" />
                                        </router-link>
                                        <div v-else class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500 flex items-center justify-center">
                                            <span class="text-gray-600 dark:text-gray-300 text-xs font-semibold">?</span>
                                        </div>
                                        <div class="space-y-1 ms-2">
                                            <router-link v-if="reply.user"
                                                :to="{ name: 'profile-page', params: { username: reply.user.username } }"
                                                class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                                                {{ reply.user.name || (reply.user.first_name + ' ' + reply.user.last_name) }}
                                            </router-link>
                                            <span v-else class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">کاربر ناشناس</span>
                                            <p class="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{{
                                                timeAgo(reply.created_at) }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="hidden md:flex items-center gap-1">
                                        <button @click.prevent="openReplyCommentModal(reply)"
                                            class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">پاسخ</button>
                                        <button v-if="!reply.approved" :disabled="loadingComments[reply.id]"
                                            @click.prevent="commentToggleApproval(reply, reply.id)"
                                            class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">تایید</button>
                                        <button v-else @click.prevent="commentToggleApproval(reply, reply.id)"
                                            :disabled="loadingComments[reply.id]"
                                            class="disabled:opacity-60 px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">عدم
                                            تایید</button>
                                        <button @click.prevent="openPreviewCommentModal(reply)"
                                            class="px-2 py-1.5 rounded-lg flex items-center text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">مشاهده</button>
                                    </div>
                                    <Popover class="md:hidden group relative">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                        <PopoverButton
                                            class="p-1 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 rounded-md relative  group-focus-within:z-30 focus:outline-none  flex items-center justify-center">
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
                                                        <button type="button"
                                                            @click.prevent="openPreviewCommentModal(reply)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">مشاهده</button>
                                                    </li>
                                                    <li>
                                                        <button @click.prevent="openReplyCommentModal(reply)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">پاسخ</button>
                                                    </li>
                                                    <li>
                                                        <button v-if="!reply.approved"
                                                            :disabled="loadingComments[reply.id]"
                                                            @click.prevent="commentToggleApproval(reply, reply.id)"
                                                            class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">تایید</button>
                                                        <button v-else :disabled="loadingComments[reply.id]"
                                                            @click.prevent="commentToggleApproval(reply, reply.id)"
                                                            class="disabled:opacity-50 block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">عدم
                                                            تایید</button>
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
                                        <MarkdownRenderer :source="reply.comment"></MarkdownRenderer>
                                    </p>
                                </div>
                            </div>
                        </DisclosurePanel>
                    </transition>
                </Disclosure>
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-24 text-gray-500 font-semibold">چیزی برای نمایش وجود
            ندارد!
        </div>
    </div>

    <div class="mt-6 flex lg:flex-row flex-col items-center justify-between gap-4">
        <div class="" v-if="pagination && pagination.last_page > 1">
            <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
        </div>
        <div class="w-max">
            <select v-model="perPage" @change="selectPerpage(perPage)"
                class="w-full px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none">
                <option v-for="(per, index) in perPages" :key="index" :value="per">{{ per }}</option>
            </select>
        </div>
        </div>
    </div>

    <BottomSheetDrawer v-model="isOpenCommentModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <template v-if="selectedComment">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">کامنت</h3>
                <button type="button"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                    @click="closeCommentModal">
                    <span class="sr-only">Close</span>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

                            <TabGroup :selectedIndex="activeTabIndex" @change="handleTabChange">
                                <TabList class="mt-4 w-max mx-auto flex space-x-1 rtl:space-x-reverse rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
                                    <Tab v-slot="{ selected }" as="template">
                                        <button
                                            :class="[
                                                'px-6 w-full rounded-lg py-2.5 text-sm font-semibold leading-5',
                                                'focus:outline-none',
                                                selected
                                                    ? 'bg-white dark:bg-gray-900 text-yellow-400 shadow'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                                            ]">
                                            مشاهده
                                        </button>
                                    </Tab>
                                    <Tab v-slot="{ selected }" as="template">
                                        <button
                                            :class="[
                                                'px-6 w-full rounded-lg py-2.5 text-sm font-semibold leading-5',
                                                'focus:outline-none',
                                                selected
                                                    ? 'bg-white dark:bg-gray-900 text-yellow-400 shadow'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                                            ]">
                                            پاسخ
                                        </button>
                                    </Tab>
                                </TabList>

                                <TabPanels class="mt-4">
                                    <!-- مشاهده Tab -->
                                    <TabPanel>
                                        <!-- Parent Comment (if exists) -->
                                        <div v-if="selectedComment && selectedComment.parent" class="mb-6 pb-6 border-b border-gray-200 dark:border-opacity-10">
                                            <div class="flex items-center justify-between mb-2">
                                                <div class="flex items-center">
                                                    <router-link v-if="selectedComment.parent.user"
                                                        :to="{ name: 'profile-page', params: { username: selectedComment.parent.user.username } }"
                                                        class="w-10 h-10 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500">
                                                        <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-200"
                                                            :src="selectedComment.parent.user.profile_pic"
                                                            :alt="selectedComment.parent.user.username" />
                                                    </router-link>
                                                    <div v-else class="w-10 h-10 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500 flex items-center justify-center">
                                                        <span class="text-gray-600 dark:text-gray-300 text-xs font-semibold">?</span>
                                                    </div>
                                                    <div class="space-y-1 ms-2">
                                                        <router-link v-if="selectedComment.parent.user"
                                                            :to="{ name: 'profile-page', params: { username: selectedComment.parent.user.username } }"
                                                            class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                                                            {{ selectedComment.parent.user.name || (selectedComment.parent.user.first_name + ' ' + selectedComment.parent.user.last_name) }}
                                                        </router-link>
                                                        <span v-else class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">کاربر ناشناس</span>
                                                        <p class="text-xs text-gray-400 dark:text-gray-500">{{
                                                            timeAgo(selectedComment.parent.created_at) }}</p>
                                                    </div>
                                                </div>
                                                <span class="text-xs text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-800/50 px-2 py-1 rounded-lg">
                                                    کامنت اصلی
                                                </span>
                                            </div>
                                            <div
                                                class="mt-3 bg-gray-100/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-xl p-2 md:p-3 text-start leading-7">
                                                <MarkdownRenderer :source="selectedComment.parent.comment" />
                                            </div>
                                        </div>

                                        <!-- Current Comment -->
                                        <div class="flex items-center mb-4">
                                            <router-link v-if="selectedComment.user"
                                                :to="{ name: 'profile-page', params: { username: selectedComment.user.username } }"
                                                class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500">
                                                <img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 duration-200"
                                                    :src="selectedComment.user.profile_pic"
                                                    :alt="selectedComment.user.username" />
                                            </router-link>
                                            <div v-else class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-400 dark:border-opacity-20 bg-gray-500 flex items-center justify-center">
                                                <span class="text-gray-600 dark:text-gray-300 text-sm font-semibold">?</span>
                                            </div>
                                            <div class="space-y-1 ms-2">
                                                <router-link v-if="selectedComment.user"
                                                    :to="{ name: 'profile-page', params: { username: selectedComment.user.username } }"
                                                    class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                                                    {{ selectedComment.user.name || (selectedComment.user.first_name + ' ' + selectedComment.user.last_name) }}
                                                </router-link>
                                                <span v-else class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">کاربر ناشناس</span>
                                                <p class="text-xs text-gray-400 dark:text-gray-500">{{
                                                    timeAgo(selectedComment.created_at) }}</p>
                                            </div>
                                        </div>
                                        <hr class="my-4 border-gray-200 border-t dark:border-opacity-10" />
                                        <div
                                            class="mt-4 bg-gray-100/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-xl p-2 md:p-3 text-start leading-7 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                            <MarkdownRenderer :source="selectedComment.comment" />
                                        </div>
                                    </TabPanel>

                                    <!-- پاسخ Tab -->
                                    <TabPanel>
                                        <div class="lg:-mb-[5.5rem] lg:ms-4 lg:mt-8 mt-4" v-if="selectedComment && !selectedComment.approved">
                                <input type="checkbox" v-model="selectedCommentForReplyApprovedCheck" checked
                                    id="approve-parent" value="" class="hidden peer" required="">
                                <label for="approve-parent"
                                    class="flex items-center justify-between w-max p-3 text-sm text-gray-500 bg-white border-2 border-gray-200 rounded-xl cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-yellow-400 dark:peer-checked:border-yellow-400 hover:text-gray-600 dark:peer-checked:text-amber-400 peer-checked:text-amber-500 peer-checked:bg-yellow-400/10 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-opacity-80">
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
                            <div
                                class="mt-4 border-2 border-dashed border-gray-200/70 dark:border-gray-800 rounded-xl p-2 md:p-4">
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
                                    </TabPanel>
                                </TabPanels>
                            </TabGroup>
        </template>
    </BottomSheetDrawer>
</template>
<script>
import axiosInstance from "@/store/axiosInstance";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import moment from "moment";
import "moment/locale/fa";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminTabPanelToolbar from "@/views/components/admin/AdminTabPanelToolbar.vue";
import AdminFilterSelect from "@/views/components/admin/AdminFilterSelect.vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import * as bs from "@/views/components/admin/bottomSheet/adminBottomSheetStyles.js";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
export default {
    components: {
        AdminInlineLoading,
        EditorComponent,
        Popover, PopoverButton, PopoverPanel, PopoverOverlay,
        MarkdownRenderer,
        Disclosure, DisclosureButton, DisclosurePanel,
        BottomSheetDrawer,
        AdminTabPanelToolbar,
        AdminFilterSelect,
        TabGroup, TabList, Tab, TabPanels, TabPanel,
        PaginationComponent,
    },
    props: {
        courseSlug: {
            type: String,
            required: true,
        },
        episodeSlug: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            bs,
            filters: {
                approved: 'all',
                sort: 'desc'
            },
            errors: null,
            comments: [],
            loading: false,
            loadingComments: [],
            isOpenCommentModal: false,
            selectedComment: null,
            activeTabIndex: 0,
            selectedCommentForReplyApprovedCheck: true,
            replyForSelectedComment: "",
            replyCommentLoading: false,
            pagination: {},
            perPage: 20,
            perPages: [10, 20, 30, 50, 100],
            currentPage: 1,
            viewMode: 'table', // 'table' or 'grid'
        };
    },
    computed: {
        approvedOptions() {
            return [
                { value: "all", label: "همه" },
                { value: "true", label: "تایید‌شده" },
                { value: "false", label: "تایید‌نشده" },
            ];
        },
        sortOptions() {
            return [
                { value: "desc", label: "جدیدترین" },
                { value: "asc", label: "قدیمی‌ترین" },
            ];
        },
    },
    methods: {
        onFilterChange() {
            this.currentPage = 1;
            this.getEpisodeComments();
        },
        changeViewMode() {
            this.currentPage = 1;
            this.getEpisodeComments();
        },
        timeAgo(date) {
            moment.locale("fa");
            return moment(date).fromNow();
        },
        async commentToggleApproval(comment, id) {
            this.loadingComments[id] = true;
            const wasUnapproved = !comment.approved;
            try {
                await axiosInstance.post(
                    'admin/comments/toggle-approval', { comment_id: comment.id }
                );
                comment.approved = !comment.approved;
                
                // Update Vuex if comment was unapproved and now is approved
                if (wasUnapproved && comment.approved) {
                    this.$store.dispatch('adminComments/decreaseUnapprovedComments');
                    // Also update parent component if it has the method
                    if (this.$parent && typeof this.$parent.decreaseUnapprovedCount === 'function') {
                        this.$parent.decreaseUnapprovedCount();
                    }
                }
                // If comment was approved and now is unapproved, increment
                if (!wasUnapproved && !comment.approved) {
                    this.$store.dispatch('adminComments/incrementUnapprovedComments');
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.loadingComments[id] = false;
            }
        },
        async getEpisodeComments() {
            this.loading = true;
            try {
                const response = await axiosInstance.post(
                    `admin/course/${this.courseSlug}/episode/${this.episodeSlug}/details`,
                    {
                        data_type: 'comments',
                        page: this.currentPage,
                        perPage: this.perPage,
                        sort: this.filters.sort,
                        filter: this.filters.approved === 'all' ? 'all' : (this.filters.approved === 'true' ? 'approved' : 'unapproved'),
                        viewMode: this.viewMode
                    }
                );
                this.comments = response.data.comments || [];
                this.pagination = response.data.pagination || {};
            } catch (error) {
                console.error('Error fetching episode comments:', error);
                this.comments = [];
                this.pagination = {};
            } finally {
                this.loading = false;
            }
        },
        formatDateTime(date) {
            moment.locale("fa");
            return moment(date).format("YYYY/MM/DD HH:mm");
        },
        selectPerpage(value) {
            this.perPage = value;
            this.currentPage = 1;
            this.getEpisodeComments();
        },
        updatePage(page) {
            this.currentPage = page;
            this.getEpisodeComments();
        },
        handleTabChange(index) {
            this.activeTabIndex = index;
        },
        closeCommentModal() {
            this.isOpenCommentModal = false;
            this.selectedComment = null;
            this.activeTabIndex = 0;
            this.selectedCommentForReplyApprovedCheck = true;
            this.replyForSelectedComment = "";
        },
        openPreviewCommentModal(comment) {
            this.selectedComment = comment;
            this.activeTabIndex = 0;
            this.isOpenCommentModal = true;
        },
        openReplyCommentModal(comment) {
            this.selectedComment = comment;
            this.activeTabIndex = 1;
            this.isOpenCommentModal = true;
        },
        async commentSendReply() {
            this.errors = null;
            this.replyCommentLoading = true;
            try {
                const response = await axiosInstance.post(
                    'admin/comments/send-reply', { 
                        parent_id: this.selectedComment.id, 
                        comment: this.replyForSelectedComment, 
                        parent_approved: this.selectedCommentForReplyApprovedCheck 
                    }
                );

                const newComment = response.data.comment;

                // Add reply to the parent comment
                if (this.selectedComment.replies) {
                    this.selectedComment.replies.push(newComment);
                } else {
                    this.selectedComment.replies = [newComment];
                }

                // If parent was approved, update it
                if (this.selectedCommentForReplyApprovedCheck && !this.selectedComment.approved) {
                    this.selectedComment.approved = true;
                }

                toast.success('پاسخ کامنت با موفقیت ثبت شد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });

                this.closeCommentModal();
                this.getEpisodeComments();

            } catch (error) {
                console.error(error);
                this.errors = error.response?.data?.errors;
            } finally {
                this.replyCommentLoading = false;
            }
        },
    },
    mounted() {
        this.getEpisodeComments();
    },
}
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

