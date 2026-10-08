<script setup>
definePageMeta({
  name: "admin-statuses-list",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button @click.prevent="openCreateStatusModal"
                class="group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        ایجاد وضعیت جدید
                        <svg class="w-[0.85rem] h-[0.85rem] ms-2" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 3a1 1 0 0 0-1 1v7H4a1 1 0 1 0 0 2h7v7a1 1 0 1 0 2 0v-7h7a1 1 0 1 0 0-2h-7V4a1 1 0 0 0-1-1z"
                                fill="currentColor"></path>
                        </svg>
                    </span>
                </span>
            </button>
        </template>
        <div class="min-w-0">
            <div v-if="items && items.length > 0" class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div v-for="(status, i) in items" :key="i"
                    class="bg-white dark:bg-gray-900 rounded-xl p-2 md:p-4 text-gray-700 dark:text-gray-100 relative">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="shrink-0">
                                <!-- for checkbox -->
                            </div>
                            <div
                                class="shrink-0 w-12 h-10 rounded-lg overflow-hidden bg-gray-200/40 dark:bg-gray-600 border-2 border-gray-200 dark:border-opacity-20">
                                <img onerror="this.style.display='none'" v-if="status.icon"
                                    class="w-full h-full object-cover hover:scale-105 duration-150" :src="status.icon"
                                    :alt="status.title" />
                                <div v-else
                                    class="w-full h-full flex justify-center items-center text-gray-600 dark:text-gray-300">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.4"
                                            d="M2.44922 14.9702C3.51922 18.4102 6.39923 21.0602 9.97923 21.7902"
                                            stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
                                            stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path
                                            d="M2.05078 10.98C2.56078 5.93 6.82078 2 12.0008 2C17.1808 2 21.4408 5.94 21.9508 10.98"
                                            stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
                                            stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M14.0098 21.8C17.5798 21.07 20.4498 18.45 21.5398 15.02"
                                            stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
                                            stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="ms-2">
                                <div class="text-gray-700 dark:text-gray-100 text-sm font-semibold line-clamp-1"
                                    :title="status.title">
                                    {{ status.title }}
                                </div>
                                <div class="mt-0.5 text-gray-500 dark:text-gray-400 text-xs font-semibold line-clamp-1"
                                    :title="status.english_title">
                                    {{ status.english_title }}
                                </div>
                            </div>
                        </div>
                        <div class="ms-2 flex items-center space-x-1 rtl:space-x-reverse">
                            <div class="whitespace-nowrap">
                                <button @click.prevent="openCoursesModal(status)"
                                    class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                    <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M15.3276 7.54199H8.67239C5.29758 7.54199 3.61017 7.54199 2.66232 8.52882C1.71447 9.51565 1.93748 11.0403 2.38351 14.0895L2.80648 16.9811C3.15626 19.3723 3.33115 20.5679 4.22834 21.2839C5.12553 21.9999 6.4488 21.9999 9.09534 21.9999H14.9046C17.5512 21.9999 18.8745 21.9999 19.7717 21.2839C20.6689 20.5679 20.8437 19.3723 21.1935 16.9811L21.6165 14.0895C22.0625 11.0403 22.2855 9.51564 21.3377 8.52882C20.3898 7.54199 18.7024 7.54199 15.3276 7.54199ZM14.5812 15.7942C15.1396 15.448 15.1396 14.5519 14.5812 14.2057L11.2096 12.1156C10.6669 11.7792 10 12.2171 10 12.9098V17.0901C10 17.7828 10.6669 18.2207 11.2096 17.8843L14.5812 15.7942Z"
                                            fill="currentColor"></path>
                                        <path opacity="0.4"
                                            d="M8.50956 2.00001H15.4897C15.7221 1.99995 15.9004 1.99991 16.0562 2.01515C17.164 2.12352 18.0708 2.78958 18.4553 3.68678H5.54395C5.92846 2.78958 6.83521 2.12352 7.94303 2.01515C8.09884 1.99991 8.27708 1.99995 8.50956 2.00001Z"
                                            fill="currentColor"></path>
                                        <path opacity="0.7"
                                            d="M6.3102 4.72266C4.91958 4.72266 3.77931 5.56241 3.39878 6.67645C3.39085 6.69967 3.38325 6.72302 3.37598 6.74647C3.77413 6.6259 4.18849 6.54713 4.60796 6.49336C5.68833 6.35485 7.05367 6.35492 8.6397 6.35501H15.5318C17.1178 6.35492 18.4832 6.35485 19.5635 6.49336C19.983 6.54713 20.3974 6.6259 20.7955 6.74647C20.7883 6.72302 20.7806 6.69967 20.7727 6.67645C20.3922 5.56241 19.2519 4.72266 17.8613 4.72266H6.3102Z"
                                            fill="currentColor"></path>
                                    </svg>
                                    {{ status.courses_count }} دوره
                                </button>
                            </div>
                            <div class="shrink-0">
                                <Popover class="group relative">
                                    <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                    <PopoverButton
                                        class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none  flex items-center justify-center">
                                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                            viewBox="0 0 16 16">
                                            <path data-v-10f166d7=""
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
                                            class="text-start flex flex-col z-30 mt-3 end-2 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-900 dark:divide-gray-800">
                                            <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                <li>
                                                    <button type="button" @click.prevent="openDeleteStatusModal(status)"
                                                        class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">حذف</button>
                                                </li>
                                                <li>
                                                    <button type="button" @click.prevent="openEditStatusModal(status)"
                                                        class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ویرایش</button>
                                                </li>
                                            </ul>
                                        </PopoverPanel>
                                    </transition>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <hr class="border-t border-gray-200 border-dashed dark:border-opacity-10 my-1.5">
                    <div class="flex items-center justify-between">
                        <div class="p-1 rounded-md bg-gray-200/10 dark:bg-gray-800/60 w-full">
                            <div class="text-gray-400 dark:text-gray-500 text-xs font-light line-clamp-1"
                                :title="status.description">
                                {{ status.description ?? 'مقداری وارد نشده!' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="px-2">
                <p
                    class="mx-auto w-max mt-40 bg-white dark:bg-gray-900 rounded-lg p-2 md:p-4 px-4 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                    موردی جهت نمایش وجود ندارد!</p>
            </div>
        </div>

        <!-- Create/Edit Status Bottom Sheet -->
        <BottomSheetDrawer v-model="showStatusModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                    {{ mode === 'create' ? 'ایجاد وضعیت جدید' : 'ویرایش وضعیت' }}
                </h3>
                <button type="button"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                    @click="closeStatusModal">
                    <span class="sr-only">Close</span>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="sm:flex sm:items-start">
                <div class="mt-3 sm:mt-0 w-full">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-4">
                                        <div>
                                            <label for="title"
                                                class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">عنوان
                                                فارسی
                                                وضعیت</label>
                                            <input type="text" id="title" v-model="form.title"
                                                class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                                :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.title }"
                                                placeholder="" required />
                                            <span v-if="errors && errors.title"
                                                class="mt-1 text-rose-500 text-xs font-medium">
                                                {{ errors.title[0] }}
                                            </span>
                                        </div>

                                        <div>
                                            <label for="english_title"
                                                class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">عنوان
                                                انگلیسی وضعیت</label>
                                            <input type="text" id="english_title" v-model="form.english_title"
                                                @input="filterInputEnglishTitle"
                                                class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                                :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.english_title }"
                                                placeholder="" required />
                                            <span v-if="errors && errors.english_title"
                                                class="mt-1 text-rose-500 text-xs font-medium">
                                                {{ errors.english_title[0] }}
                                            </span>
                                            <p class="text-xs text-gray-400 mt-1">این فیلد برای ساخت آدرس (slug) وضعیت
                                                استفاده
                                                می‌شود.</p>
                                        </div>

                                        <div class="md:col-span-2">
                                            <label for="short_description"
                                                class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">توضیحات</label>
                                            <textarea id="short_description" rows="5" v-model="form.description"
                                                class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                                :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.description }"
                                                placeholder=""></textarea>
                                            <span v-if="errors && errors.description"
                                                class="mt-1 text-rose-500 text-xs font-medium">
                                                {{ errors.description[0] }}
                                            </span>
                                            <p class="text-xs text-gray-400 mt-1">توضیح مختصر در ۲-۳ جمله که وضعیت را
                                                معرفی
                                                می‌کند.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex justify-end mt-5">
                                        <div
                                            class="bg-white dark:bg-gray-900/50 rounded-xl p-2 inline-flex items-center space-x-2 rtl:space-x-reverse">
                                            <button ref="resetSectionForm" @click.prevent="resetStatusForm"
                                                class="relative overflow-hidden rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110">خالی
                                                کردن فرم</button>
                                            <button @click.prevent="statusSubmit" :disabled="submitLoading"
                                                class="relative disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110">
                                                {{ mode === 'create' ? 'ثبت و ایجاد' : 'ویرایش وضعیت' }}
                                            </button>
                                        </div>
                                    </div>
                </div>
            </div>
        </BottomSheetDrawer>

        <!-- Delete Status Bottom Sheet -->
        <BottomSheetDrawer v-model="showDeleteStatusModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">حذف وضعیت</h3>
                <button type="button"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                    @click="closeDeleteStatusModal">
                    <span class="sr-only">Close</span>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                از حذف این وضعیت اطمینان کامل دارید؟
            </p>
            <div class="flex justify-end gap-3">
                <button type="button" @click="closeDeleteStatusModal"
                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    انصراف
                </button>
                <button type="button" @click="deleteStatus" :disabled="deleteStatusLoading"
                    class="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors shadow-lg shadow-rose-500/30">
                    <span v-if="deleteStatusLoading">در حال حذف...</span>
                    <span v-else>حذف</span>
                </button>
            </div>
        </BottomSheetDrawer>

        <!-- Courses View Bottom Sheet -->
        <BottomSheetDrawer v-model="isCoursesModalOpen" :initialHeight="0.6" :maxHeight="0.85" :minHeight="0.5"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                    دوره‌های با وضعیت {{ selectedStatusForShowCourses?.title }}
                </h3>
                <button type="button"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                    @click="closeCoursesModal">
                    <span class="sr-only">Close</span>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <hr class="mb-4 border-t border-dashed border-gray-200 dark:border-opacity-20" />
                                <div v-if="selectedStatusForShowCourses && selectedStatusForShowCourses.courses && selectedStatusForShowCourses.courses.length > 0"
                                    class="space-y-2 max-h-[24rem] overflow-y-auto custom-scrollbar">
                                    <div v-for="(course, index) in selectedStatusForShowCourses.courses" :key="index"
                                        class="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 md:p-3 flex items-center justify-between">
                                        <div class="flex items-center">
                                            <router-link
                                                :to="{ name: 'course.show', params: { courseSlug: course.slug } }"
                                                class="w-14 h-10 rounded-lg overflow-hidden border-2 border-gray-400 dark:border-opacity-20">
                                                <img onerror="this.style.display='none'"
                                                    class="w-full h-full object-cover hover:scale-105 duration-150"
                                                    :src="course.poster" />
                                            </router-link>
                                            <div class="ms-2 space-y-1">
                                                <router-link
                                                    :to="{ name: 'course.show', params: { courseSlug: course.slug } }"
                                                    class="text-xs font-semibold text-gray-700 dark:text-gray-100 line-clamp-1">{{
                                                        course.title }}</router-link>
                                                <div
                                                    class="text-xs font-semibold text-gray-500 dark:text-gray-400 line-clamp-1">
                                                    {{ course.english_title }}</div>
                                            </div>
                                        </div>
                                        <div class="flex items-center">

                                        </div>
                                    </div>
                                </div>
                                <div v-else
                                    class="my-5 text-sm font-semibold text-gray-500 dark:text-gray-400 text-center">
                                    موردی برای نمایش وجود ندارد!
                                </div>
        </BottomSheetDrawer>

        <LoadingComponent v-if="loading" class="" />
    </AdminMasterPage>
</template>
<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        BottomSheetDrawer,
        Popover, PopoverButton, PopoverPanel, PopoverOverlay,
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            urlParams,
            loading: false,
            errors: null,
            items: [],
            deleteStatusLoading: false,
            showDeleteStatusModal: false,
            statusForDelete: null,
            showStatusModal: this.$route.query.createStatus && this.$route.query.createStatus === 'true' ? true : false,
            formStatusLoading: false,
            submitLoading: false,

            mode: 'create', // create or edit
            form: {
                title: '',
                english_title: '',
                description: '',
                icon: '',
            },

            isCoursesModalOpen: false,
            selectedStatusForShowCourses: null,
        }
    },
    methods: {
        async getData() {
            this.loading = true;
            await axiosInstance
                .post("admin/statuses")
                .then((response) => {
                    this.items = response.data.statuses;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        filterInputEnglishTitle() {
            this.form.english_title = this.form.english_title.replace(/[^a-zA-Z0-9 _-]/g, "");
        },
        openDeleteStatusModal(status) {
            this.statusForDelete = status;
            this.showDeleteStatusModal = true;
        },
        closeDeleteStatusModal() {
            this.statusForDelete = null;
            this.showDeleteStatusModal = false;
        },

        async deleteStatus() {
            this.deleteStatusLoading = true;
            await axiosInstance.delete(
                `admin/status/${this.statusForDelete.id}/delete`)
                .then(() => {
                    this.items = this.items.filter(status => status.id != this.statusForDelete.id)
                    toast.success("وضعیت مورد نظر با موفقیت حذف شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });

                }).catch((error) => {
                    this.errors = error.response.data.errors;
                    if (error.response.status == '409') {
                        toast.error("امکان حذف وجود ندارد. تعدادی دوره هنوز به این وضعیت متصل هستند.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    } else {
                        toast.error("خطا! لطفا دوباره تلاش کنید.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    }

                }).finally(() => {
                    this.deleteStatusLoading = false;
                    this.closeDeleteStatusModal();
                })
        },

        openCreateStatusModal() {
            this.mode = 'create';
            this.resetStatusForm();
            this.showStatusModal = true;
        },
        openEditStatusModal(status) {
            this.mode = 'edit';
            this.form = {
                id: status.id,
                title: status.title,
                english_title: status.english_title,
                description: status.description,
                icon: status.icon,
            };
            this.showStatusModal = true;
        },
        closeStatusModal() {
            this.showStatusModal = false;
        },
        resetStatusForm() {
            this.form = {
                title: '',
                english_title: '',
                description: '',
                icon: '',
            };
        },
        async statusSubmit() {
            this.errors = null;
            this.submitLoading = true;
            if (this.mode === 'create') {
                await axiosInstance.post(
                    `admin/status/create`, this.form
                ).then((response) => {
                    this.items.push(response.data.status)
                    toast.success("وضعیت جدید با موفقیت ایجاد شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeStatusModal();
                }).catch((error) => {
                    this.errors = error.response.data.errors;
                    console.log(error.response.data.errors)
                }).finally(() => {
                    this.submitLoading = false;
                })
            } else {
                await axiosInstance.post(
                    `admin/status/${this.form.id}/update`, this.form
                ).then((response) => {
                    toast.success("وضعیت مورد نظر  با موفقیت ویرایش شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    const index = this.items.findIndex(l => l.id === response.data.status.id);
                    this.items[index].title = response.data.status.title;
                    this.items[index].english_title = response.data.status.english_title;
                    this.items[index].slug = response.data.status.slug;
                    this.items[index].description = response.data.status.description;
                    // if (index !== -1) {
                    //     this.items.splice(index, 1, response.data.status)
                    // }
                    this.closeStatusModal();
                }).catch((error) => {
                    this.errors = error.response.data.errors;
                    console.log(error.response.data.errors)
                }).finally(() => {
                    this.submitLoading = false;
                })
            }
        },
        openCoursesModal(status) {
            this.selectedStatusForShowCourses = status;
            this.isCoursesModalOpen = true;
        },
        closeCoursesModal() {
            this.isCoursesModalOpen = false;
        },

    },
    mounted() {
        this.getData();
    },
}
</script>