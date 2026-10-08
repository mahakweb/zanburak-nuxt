<template>
    <AdminMasterPage>
        
        <template #breadcrumb-actions>
                    <button @click.prevent="openCreateLevelModal"
                        class="group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                ایجاد سطح جدید
                                <svg class="w-[0.85rem] h-[0.85rem] ms-2" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M12 3a1 1 0 0 0-1 1v7H4a1 1 0 1 0 0 2h7v7a1 1 0 1 0 2 0v-7h7a1 1 0 1 0 0-2h-7V4a1 1 0 0 0-1-1z"
                                        fill="currentColor"></path>
                                </svg>
                            </span>
                        </span></button>
        </template>
        <div class="min-w-0">
<div v-if="items && items.length > 0" class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div v-for="(level, i) in items" :key="i"
                    class="bg-white dark:bg-gray-900 rounded-xl p-2 md:p-4 text-gray-700 dark:text-gray-100 relative">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="shrink-0">
                                <!-- for checkbox -->
                            </div>
                            <div
                                class="shrink-0 w-12 h-10 rounded-lg overflow-hidden bg-gray-200/40 dark:bg-gray-600 border-2 border-gray-200 dark:border-opacity-20">
                                <img onerror="this.style.display='none'" v-if="level.icon"
                                    class="w-full h-full object-cover hover:scale-105 duration-150" :src="level.icon"
                                    :alt="level.title" />
                                <div v-else
                                    class="w-full h-full flex justify-center items-center text-gray-600 dark:text-gray-300">
                                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15.7194 9.69002C13.6694 7.63002 10.3294 7.63002 8.27937 9.69002C6.21938 11.75 6.21938 15.08 8.27937 17.13C10.3394 19.19 13.6694 19.19 15.7194 17.13C17.7794 15.07 17.7794 11.74 15.7194 9.69002ZM12.5294 13.94L10.9394 15.53C10.7894 15.68 10.5994 15.75 10.4094 15.75C10.2194 15.75 10.0194 15.68 9.87938 15.53C9.58938 15.24 9.58938 14.76 9.87938 14.46L11.4694 12.87C11.7594 12.58 12.2394 12.58 12.5394 12.87C12.8294 13.17 12.8294 13.65 12.5294 13.94Z"
                                            fill="currentColor"></path>
                                        <path opacity="0.4"
                                            d="M19.6001 5.80975C19.3801 5.58975 19.1001 5.46973 18.7901 5.46973C18.4801 5.46973 18.2001 5.58974 17.9801 5.79974C17.5301 6.24974 17.5301 6.96974 17.9801 7.41974C18.2001 7.63974 18.4801 7.75977 18.7901 7.75977C19.1001 7.75977 19.3801 7.63975 19.6001 7.42975C19.8201 7.20975 19.9401 6.92975 19.9401 6.61975C19.9401 6.30975 19.8201 6.01975 19.6001 5.80975Z"
                                            fill="currentColor"></path>
                                        <path opacity="0.4"
                                            d="M6.02054 19.3898C5.80054 19.1698 5.52054 19.0498 5.21054 19.0498C4.90054 19.0498 4.62054 19.1698 4.40054 19.3798C4.18054 19.5998 4.06055 19.8798 4.06055 20.1898C4.06055 20.4998 4.18054 20.7798 4.40054 20.9998C4.62054 21.2198 4.92054 21.3298 5.21054 21.3298C5.50054 21.3298 5.80054 21.2198 6.02054 20.9898C6.46054 20.5598 6.46054 19.8298 6.02054 19.3898Z"
                                            fill="currentColor"></path>
                                        <path opacity="0.4"
                                            d="M22.4106 12.5997C22.2006 12.3797 21.9106 12.2698 21.6006 12.2598C21.2906 12.2598 21.0106 12.3797 20.7906 12.5997C20.3406 13.0497 20.3406 13.7697 20.7906 14.2197C21.0106 14.4397 21.3106 14.5497 21.6006 14.5497C21.8906 14.5497 22.1906 14.4397 22.4106 14.2197C22.8606 13.7697 22.8606 13.0397 22.4106 12.5997Z"
                                            fill="currentColor"></path>
                                        <path opacity="0.4"
                                            d="M3.20945 12.5999C2.76945 12.1599 2.03945 12.1499 1.58945 12.5999C1.13945 13.0499 1.13945 13.7699 1.58945 14.2199C1.80945 14.4399 2.10945 14.5499 2.39945 14.5499C2.68945 14.5499 2.98945 14.4399 3.20945 14.2199C3.64945 13.7699 3.64945 13.0399 3.20945 12.5999Z"
                                            fill="currentColor"></path>
                                        <path opacity="0.4"
                                            d="M19.6001 19.3902C19.1501 18.9402 18.4301 18.9402 17.9801 19.3902C17.5301 19.8402 17.5301 20.5602 17.9801 21.0102C18.2001 21.2302 18.5001 21.3402 18.7901 21.3402C19.0801 21.3402 19.3801 21.2302 19.6001 21.0102C19.8201 20.7902 19.9401 20.5002 19.9401 20.2002C19.9401 19.8902 19.8201 19.6002 19.6001 19.3902Z"
                                            fill="currentColor"></path>
                                        <path opacity="0.4"
                                            d="M6.02054 5.80975C5.80054 5.58975 5.52054 5.46973 5.21054 5.46973C4.90054 5.46973 4.62054 5.58974 4.40054 5.79974C4.18054 6.01974 4.06055 6.29974 4.06055 6.60974C4.06055 6.91974 4.18056 7.19974 4.39056 7.41974C4.61056 7.63974 4.89056 7.75977 5.20056 7.75977C5.51056 7.75977 5.79056 7.63974 6.01056 7.41974C6.46056 6.97974 6.46054 6.24975 6.02054 5.80975Z"
                                            fill="currentColor"></path>
                                        <path opacity="0.4"
                                            d="M12.8096 3.0001C12.8096 2.9901 12.8096 2.9901 12.8096 3.0001C12.3596 2.5501 11.6396 2.5501 11.1896 3.0001C10.9696 3.2201 10.8496 3.5101 10.8496 3.8101C10.8496 4.1201 10.9696 4.40009 11.1796 4.62009C11.3996 4.84009 11.6796 4.96012 11.9896 4.96012C12.2996 4.96012 12.5796 4.84009 12.7996 4.62009C13.2596 4.17009 13.2596 3.4401 12.8096 3.0001Z"
                                            fill="currentColor"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="ms-2">
                                <div class="text-gray-700 dark:text-gray-100 text-sm font-semibold line-clamp-1"
                                    :title="level.title">
                                    {{ level.title }}
                                </div>
                                <div class="mt-0.5 text-gray-500 dark:text-gray-400 text-xs font-semibold line-clamp-1"
                                    :title="level.english_title">
                                    {{ level.english_title }}
                                </div>
                            </div>
                        </div>
                        <div class="ms-2 flex items-center space-x-1 rtl:space-x-reverse">
                            <div class="whitespace-nowrap">
                                <button @click.prevent="openCoursesModal(level)"
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
                                    {{ level.courses_count }} دوره
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
                                                    <button type="button" @click.prevent="openDeleteLevelModal(level)"
                                                        class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">حذف</button>
                                                </li>
                                                <li>
                                                    <button type="button" @click.prevent="openEditLevelModal(level)"
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
                                :title="level.description">
                                {{ level.description ?? 'مقداری وارد نشده!' }}
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

        <!-- Create/Edit Level Bottom Sheet -->
        <BottomSheetDrawer v-model="showLevelModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                    {{ mode === 'create' ? 'ایجاد سطح جدید' : 'ویرایش سطح' }}
                </h3>
                <button type="button"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                    @click="closeLevelModal">
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
                                                سطح</label>
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
                                                انگلیسی سطح</label>
                                            <input type="text" id="english_title" v-model="form.english_title"
                                                @input="filterInputEnglishTitle"
                                                class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                                :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.english_title }"
                                                placeholder="" required />
                                            <span v-if="errors && errors.english_title"
                                                class="mt-1 text-rose-500 text-xs font-medium">
                                                {{ errors.english_title[0] }}
                                            </span>
                                            <p class="text-xs text-gray-400 mt-1">این فیلد برای ساخت آدرس (slug) سطح
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
                                            <p class="text-xs text-gray-400 mt-1">توضیح مختصر در ۲-۳ جمله که سطح را
                                                معرفی
                                                می‌کند.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex justify-end mt-5">
                                        <div
                                            class="bg-white dark:bg-gray-900/50 rounded-xl p-2 inline-flex items-center space-x-2 rtl:space-x-reverse">
                                            <button ref="resetSectionForm" @click.prevent="resetLevelForm"
                                                class="relative overflow-hidden rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110">خالی
                                                کردن فرم</button>
                                            <button @click.prevent="levelSubmit" :disabled="submitLoading"
                                                class="relative disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110">
                                                {{ mode === 'create' ? 'ثبت و ایجاد' : 'ویرایش سطح' }}
                                            </button>
                                        </div>
                                    </div>
                </div>
            </div>
        </BottomSheetDrawer>

        <!-- Delete Level Bottom Sheet -->
        <BottomSheetDrawer v-model="showDeleteLevelModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">حذف سطح</h3>
                <button type="button"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                    @click="closeDeleteLevelModal">
                    <span class="sr-only">Close</span>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                از حذف این سطح اطمینان کامل دارید؟
            </p>
            <div class="flex justify-end gap-3">
                <button type="button" @click="closeDeleteLevelModal"
                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    انصراف
                </button>
                <button type="button" @click="deleteLevel" :disabled="deleteLevelLoading"
                    class="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors shadow-lg shadow-rose-500/30">
                    <span v-if="deleteLevelLoading">در حال حذف...</span>
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
                    دوره‌های با سطح {{ selectedLevelForShowCourses?.title }}
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
                                <div v-if="selectedLevelForShowCourses && selectedLevelForShowCourses.courses && selectedLevelForShowCourses.courses.length > 0"
                                    class="space-y-2 max-h-[24rem] overflow-y-auto custom-scrollbar">
                                    <div v-for="(course, index) in selectedLevelForShowCourses.courses" :key="index"
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
import axiosInstance from "@/store/axiosInstance";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
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
            deleteLevelLoading: false,
            showDeleteLevelModal: false,
            levelForDelete: null,
            showLevelModal: this.$route.query.createLevel && this.$route.query.createLevel === 'true' ? true : false,
            formLevelLoading: false,
            submitLoading: false,

            mode: 'create', // create or edit
            form: {
                title: '',
                english_title: '',
                description: '',
                icon: '',
            },

            isCoursesModalOpen: false,
            selectedLevelForShowCourses: null,
        }
    },
    methods: {
        async getData() {
            this.loading = true;
            await axiosInstance
                .post("admin/levels")
                .then((response) => {
                    this.items = response.data.levels;
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
        openDeleteLevelModal(level) {
            this.levelForDelete = level;
            this.showDeleteLevelModal = true;
        },
        closeDeleteLevelModal() {
            this.levelForDelete = null;
            this.showDeleteLevelModal = false;
        },

        async deleteLevel() {
            this.deleteLevelLoading = true;
            await axiosInstance.delete(
                `admin/level/${this.levelForDelete.id}/delete`)
                .then(() => {
                    this.items = this.items.filter(level => level.id != this.levelForDelete.id)
                    toast.success("سطح مورد نظر با موفقیت حذف شد.", {
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
                        toast.error("امکان حذف وجود ندارد. تعدادی دوره هنوز به این سطح متصل هستند.", {
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
                    this.deleteLevelLoading = false;
                    this.closeDeleteLevelModal();
                })
        },

        openCreateLevelModal() {
            this.mode = 'create';
            this.resetLevelForm();
            this.showLevelModal = true;
        },
        openEditLevelModal(level) {
            this.mode = 'edit';
            this.form = {
                id: level.id,
                title: level.title,
                english_title: level.english_title,
                description: level.description,
                icon: level.icon,
            };
            this.showLevelModal = true;
        },
        closeLevelModal() {
            this.showLevelModal = false;
        },
        resetLevelForm() {
            this.form = {
                title: '',
                english_title: '',
                description: '',
                icon: '',
            };
        },
        async levelSubmit() {
            this.errors = null;
            this.submitLoading = true;
            if (this.mode === 'create') {
                await axiosInstance.post(
                    `admin/level/create`, this.form
                ).then((response) => {
                    this.items.push(response.data.level)
                    toast.success("سطح جدید با موفقیت ایجاد شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeLevelModal();
                }).catch((error) => {
                    this.errors = error.response.data.errors;
                    console.log(error.response.data.errors)
                }).finally(() => {
                    this.submitLoading = false;
                })
            } else {
                await axiosInstance.post(
                    `admin/level/${this.form.id}/update`, this.form
                ).then((response) => {
                    toast.success("سطح مورد نظر  با موفقیت ویرایش شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    const index = this.items.findIndex(l => l.id === response.data.level.id);
                    this.items[index].title = response.data.level.title;
                    this.items[index].english_title = response.data.level.english_title;
                    this.items[index].slug = response.data.level.slug;
                    this.items[index].description = response.data.level.description;
                    // if (index !== -1) {
                    //     this.items.splice(index, 1, response.data.level)
                    // }
                    this.closeLevelModal();
                }).catch((error) => {
                    this.errors = error.response.data.errors;
                    console.log(error.response.data.errors)
                }).finally(() => {
                    this.submitLoading = false;
                })
            }
        },

        openCoursesModal(level) {
            this.selectedLevelForShowCourses = level;
            this.isCoursesModalOpen = true;
        },
        closeCoursesModal() {
            this.isCoursesModalOpen = false;
        },

    },
    mounted() {
        document.title = 'مدیریت سطح‌ها'
        this.getData();
    },
}
</script>