<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button @click.prevent="openCreateCategoryModal"
                        class="group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                 دسته جدید
                                <svg class="w-5 h-5 ms-1" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                    <path
                                        d="M11,11 L11,7 C11,6.44771525 11.4477153,6 12,6 C12.5522847,6 13,6.44771525 13,7 L13,11 L17,11 C17.5522847,11 18,11.4477153 18,12 C18,12.5522847 17.5522847,13 17,13 L13,13 L13,17 C13,17.5522847 12.5522847,18 12,18 C11.4477153,18 11,17.5522847 11,17 L11,13 L7,13 C6.44771525,13 6,12.5522847 6,12 C6,11.4477153 6.44771525,11 7,11 L11,11 Z"
                                        fill="currentColor" />
                                </svg>
                            </span> </span></button>
        </template>
        <div class="min-w-0">
            <!-- Stats -->
            <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-4">
                <AdminReportStatCard title="کل دسته‌ها" :value="formatNumber(stats.total_categories)" accent="amber">
                    <template #icon>
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </template>
                </AdminReportStatCard>
                <AdminReportStatCard title="فعال" :value="formatNumber(stats.active_categories)" accent="emerald" subtitle="قابل نمایش در سایت" />
                <AdminReportStatCard title="غیرفعال" :value="formatNumber(stats.inactive_categories)" accent="rose" />
                <AdminReportStatCard title="بدون سوال" :value="formatNumber(stats.empty_categories)" accent="cyan" subtitle="دسته خالی" />
                <AdminReportStatCard title="کل سوالات" :value="formatNumber(stats.total_faqs)" accent="blue" />
                <AdminReportStatCard title="سوالات فعال" :value="formatNumber(stats.active_faqs)" accent="emerald" />
                <AdminReportStatCard title="سوالات غیرفعال" :value="formatNumber(stats.inactive_faqs)" accent="violet" />
                <AdminReportStatCard title="میانگین / دسته" :value="formatNumber(stats.avg_faqs_per_category)" accent="amber" subtitle="سوال به ازای هر دسته" />
            </div>

            <!-- Filters -->
            <div class="gap-y-2 flex flex-col lg:flex-row lg:items-end lg:justify-between mb-4">
                <div class="relative w-full max-w-md">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input v-model="searchQuery" type="text" placeholder="جستجو در عنوان یا عنوان انگلیسی..."
                        class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 pe-8 dark:bg-gray-600 dark:text-white" />
                    <button v-if="searchQuery" @click="searchQuery = ''"
                        class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex flex-wrap items-end gap-1">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت:</div>
                        <select v-model="statusFilter"
                            class="h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[7rem]">
                            <option value="all">همه</option>
                            <option value="active">فعال</option>
                            <option value="inactive">غیرفعال</option>
                            <option value="empty">بدون سوال</option>
                            <option value="has_faqs">دارای سوال</option>
                        </select>
                    </div>
                    <button @click="clearFilters"
                        class="flex items-center justify-center h-8 w-8 bg-rose-400/20 hover:bg-rose-400/30 rounded-lg">
                        <svg class="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.8809 10C14.2609 10 12.1309 12.13 12.1309 14.75C12.1309 15.64 12.3809 16.48 12.8209 17.2C13.6409 18.58 15.1509 19.5 16.8809 19.5C18.6109 19.5 20.1209 18.57 20.9409 17.2C21.3809 16.49 21.6309 15.64 21.6309 14.75C21.6309 12.13 19.5109 10 16.8809 10ZM18.6809 16.52C18.5309 16.67 18.3409 16.74 18.1509 16.74C17.9609 16.74 17.7709 16.67 17.6209 16.52L16.9009 15.8L16.1509 16.55C16.0009 16.7 15.8109 16.77 15.6209 16.77C15.4309 16.77 15.2409 16.7 15.0909 16.55C14.8009 16.26 14.8009 15.78 15.0909 15.49L15.8409 14.74L15.1209 14.01C14.8309 13.72 14.8309 13.24 15.1209 12.95C15.4109 12.66 15.8909 12.66 16.1809 12.95L16.9009 13.67L17.6009 12.97C17.8909 12.68 18.3709 12.68 18.6609 12.97C18.9509 13.26 18.9509 13.74 18.6609 14.03L17.9609 14.73L18.6809 15.46C18.9809 15.75 18.9809 16.23 18.6809 16.52Z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="mb-3 text-xs text-gray-500 dark:text-gray-400">
                {{ formatNumber(displayCategories.length) }} دسته‌بندی نمایش داده می‌شود
            </div>

            <div v-if="loading"
                class="bg-yellow-100 dark:bg-yellow-400 dark:bg-opacity-20 dark:text-slate-200 text-slate-600 border border-dashed border-yellow-300 rounded-xl p-4 font-semibold flex items-center space-x-2 space-x-reverse mb-6">
                <svg class="w-8 h-8 rtl:ml-2 ltr:mr-2" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
                    <circle class="stroke-current text-yellow-500 text-opacity-30" cx="50" cy="50" r="20"
                        fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                        stroke-dasharray="200, 300">
                    </circle>
                    <circle class="stroke-current text-yellow-500" cx="50" cy="50" r="20" fill="none"
                        stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                        stroke-dasharray="100, 200">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate"
                            from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite">
                        </animateTransform>
                        <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s"
                            repeatCount="indefinite">
                        </animate>
                        <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s"
                            repeatCount="indefinite"></animate>
                    </circle>
                </svg>
                <p>در حال دریافت اطلاعات از سرور، لطفا منتظر بمانید...</p>
            </div>

            <div v-else-if="displayCategories.length > 0" class="space-y-0.5 font-anjoman">
                <div v-for="(category, idx) in displayCategories" :key="category.id" class="">
                    <Disclosure v-slot="{ open }">
                        <DisclosureButton
                            :class="{ 'dark:bg-gray-900/60 dark:text-gray-50 bg-gray-50/80 rounded-b-none': open, 'rounded-t-xl': idx == 0, 'rounded-b-xl': idx == displayCategories.length - 1 }"
                            class="p-3 w-full rounded text-start bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 hover:bg-gray-200/90 dark:hover:bg-gray-800/70 transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50">
                            <div class="flex items-center justify-between gap-2">
                                <div class="flex items-center min-w-0">
                                    <div v-if="category.icon"
                                        class="flex items-center justify-center shrink-0 w-10 h-10 me-2"
                                        v-html="category.icon">
                                    </div>
                                    <div class="min-w-0">
                                        <div class="text-sm font-medium line-clamp-1">{{ category.title }}</div>
                                        <div class="flex flex-wrap items-center gap-1.5 mt-1">
                                            <span class="text-[10px] font-semibold font-anjoman px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                                {{ formatNumber(category.faqs_count || 0) }} سوال
                                            </span>
                                            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                {{ formatNumber(category.active_faqs_count || 0) }} فعال
                                            </span>
                                            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                                {{ formatNumber(category.inactive_faqs_count || 0) }} غیرفعال
                                            </span>
                                            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                                                :class="category.status
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'">
                                                {{ category.status ? 'دسته فعال' : 'دسته غیرفعال' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 shrink-0">
                                            <button @click.prevent="openCreateFaqModal(category)"
                                                class="hover:bg-opacity-80 rounded-lg px-3 py-1 flex justify-center items-center text-xs font-semibold bg-gray-400/30 text-gray-700 dark:text-gray-100">
                                                ایجاد سوال
                                            </button>
                                            <Popover class="group relative">
                                                <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                                <PopoverButton
                                                    class="p-1 text-gray-900 dark:text-white hover:bg-gray-300/50 dark:hover:bg-gray-700/50 rounded-md ms-0.5 relative  group-focus-within:z-30 focus:outline-none  flex items-center justify-center">
                                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg"
                                                        fill="currentColor" viewBox="0 0 16 16">
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
                                                        <ul
                                                            class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                            <li>
                                                                <button type="button"
                                                                    @click.prevent="openDeleteCategoryModal(category)"
                                                                    class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">حذف</button>
                                                            </li>
                                                            <li>
                                                                <button @click.prevent="openEditCategoryModal(category)"
                                                                    class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ویرایش</button>
                                                            </li>
                                                        </ul>
                                                    </PopoverPanel>
                                                </transition>
                                            </Popover>
                                        </div>
                                    </div>
                                </DisclosureButton>
                                <transition enter-active-class="transition-all duration-300 ease-out overflow-hidden"
                                    enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-96 opacity-100"
                                    leave-active-class="transition-all duration-300 ease-in overflow-hidden"
                                    leave-from-class="max-h-96 opacity-100" leave-to-class="max-h-0 opacity-0">
                                    <DisclosurePanel class="relative mt-2 space-y-2"
                                        :class="{ 'faq': category.faqs && category.faqs.length > 0 }">
                                        <Container :group-name="'faqs'"
                                            :get-child-payload="(index) => getChildPayload(category, index)"
                                            @drop="(dropResult) => onDrop(category, dropResult)" drag-class="opacity-50"
                                            drop-class="bg-yellow-100 dark:bg-yellow-500/30" :drop-placeholder="{
                                                animationDuration: 150,
                                                showOnTop: false,
                                                className: 'h-14 bg-yellow-400/10 dark:bg-yellow-400/20 ms-4 border-2 border-dashed border-yellow-300 dark:border-yellow-400/70 rounded-lg'
                                            }" class="space-y-0.5">
                                            <Draggable v-for="(faq, faqIndex) in category.faqs" :key="faq.id"
                                                class="relative overflow-visible ps-4 cursor-move">
                                                <div :class="{ 'last-faq rounded-b-xl': faqIndex === category.faqs.length - 1, 'rounded-t-xl': faqIndex == 0 }"
                                                    class="faq-line rounded p-3.5 bg-white dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md hover:border-yellow-400/50 dark:hover:border-yellow-500/50 transition-all duration-200">
                                                    <div class="flex items-center justify-between">
                                                        <div class="flex items-center flex-1">
                                                            <span
                                                                class="me-1.5 shrink-0 flex items-center justify-center font-bold text-sm rounded-lg w-6 h-6 border-2 border-yellow-400 bg-yellow-400/90 text-gray-700 shadow-sm shadow-yellow-400 underline underline-offset-2">{{
                                                                    faq.order }}</span>
                                                            <div class="flex-1">
                                                                <h5
                                                                    class="text-xs font-medium line-clamp-1 text-gray-800 dark:text-gray-100">
                                                                    {{ faq.question }}</h5>
                                                            </div>
                                                        </div>
                                                        <div class="flex items-center gap-1.5">
                                                            <button @click.prevent="openEditFaqModal(faq)"
                                                                class="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                                                                title="ویرایش">
                                                                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                                                        stroke="currentColor" stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round" />
                                                                    <path
                                                                        d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                                                                        stroke="currentColor" stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round" />
                                                                </svg>
                                                            </button>
                                                            <button type="button"
                                                                @click.prevent="openDeleteFaqModal(faq)"
                                                                class="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                                                                title="حذف">
                                                                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M10 12V17M14 12V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
                                                                        stroke="currentColor" stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Draggable>
                                        </Container>
                                    </DisclosurePanel>
                                </transition>
                            </Disclosure>
                        </div>
                    </div>
            <div v-else-if="!loading" class="text-center py-12">
                <p class="text-gray-500 dark:text-gray-400">دسته‌بندی یافت نشد.</p>
            </div>


            <!-- Create/Edit Category Modal -->
            <BottomSheetDrawer v-model="showCategoryModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ categoryMode === 'create' ? 'افزودن دسته‌بندی جدید' : 'ویرایش دسته‌بندی' }}
                    </h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeCategoryModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 sm:mt-0 w-full">

                        <form @submit.prevent="submitCategoryForm" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان</label>
                                    <input v-model="categoryForm.title" type="text" required
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان
                                        انگلیسی</label>
                                    <input v-model="categoryForm.english_title" type="text" required
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">آیکون
                                    (SVG)</label>
                                <textarea v-model="categoryForm.icon" rows="3"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"></textarea>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">ترتیب</label>
                                    <input v-model.number="categoryForm.order" type="number" min="0"
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" />
                                </div>
                                <div class="">
                                    <label
                                        class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">وضعیت</label>
                                    <ul
                                        class="w-max h-10 grid gap-3 grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                                        <li>
                                            <input v-model="categoryForm.status" type="radio" id="category-status-0"
                                                name="category-status" value="0" checked class="hidden peer" required />
                                            <label for="category-status-0"
                                                class="h-full inline-flex items-center justify-between w-full px-4 p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                                <div class="block text-xs font-semibold text-center w-full">
                                                    غیرفعال
                                                </div>
                                            </label>
                                        </li>
                                        <li>
                                            <input v-model="categoryForm.status" type="radio" id="category-status-1"
                                                name="category-status" value="1" class="hidden peer">
                                            <label for="category-status-1"
                                                class="h-full inline-flex items-center justify-between w-full px-4 p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                                <div class="block text-xs font-semibold text-center w-full">
                                                    فعال
                                                </div>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="flex justify-end gap-3 pt-6">
                                <button type="button" @click="closeCategoryModal"
                                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    انصراف
                                </button>
                                <button type="submit" :disabled="categoryFormLoading"
                                    class="px-5 py-2.5 text-sm font-semibold text-white bg-yellow-400 rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-colors shadow-lg shadow-yellow-400/30">
                                    <span v-if="categoryFormLoading">در حال ذخیره...</span>
                                    <span v-else>ذخیره</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </BottomSheetDrawer>

            <!-- Create/Edit FAQ Modal -->
            <BottomSheetDrawer v-model="showFaqModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ faqMode === 'create' ? 'افزودن سوال جدید' : 'ویرایش سوال' }}
                    </h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeFaqModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 sm:mt-0 w-full">
                        <form @submit.prevent="submitFaqForm" class="space-y-4">
                            <div>
                                <label
                                    class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">دسته‌بندی</label>
                                <select v-model="faqForm.category_id" required
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                        {{ cat.title }}</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">سوال</label>
                                <input v-model="faqForm.question" type="text" required
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" />
                            </div>
                            <div>
                                <label
                                    class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">پاسخ</label>
                                <EditorComponent :previewClass="['bg-gray-100', 'dark:bg-gray-800']"
                                    :bodyClass="['bg-gray-50', 'dark:bg-gray-700', 'rounded-xl', 'text-gray-700', 'dark:text-gray-100']"
                                    :focusedBorder="'1px #f59e0b solid'" :errorBorder="'1px #ef4444 solid'"
                                    :submitButton="false" :cancelButton="false" :errors="''" v-model="faqForm.answer" />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">ترتیب</label>
                                    <input v-model.number="faqForm.order" type="number" min="0"
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" />
                                </div>
                                <div class="">
                                    <label
                                        class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">وضعیت</label>
                                    <ul
                                        class="w-max h-10 grid gap-3 grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                                        <li>
                                            <input v-model="faqForm.status" type="radio" id="faq-status-0"
                                                name="faq-status" value="0" checked class="hidden peer" required />
                                            <label for="faq-status-0"
                                                class="h-full inline-flex items-center justify-between w-full px-4 p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                                <div class="block text-xs font-semibold text-center w-full">
                                                    غیرفعال
                                                </div>
                                            </label>
                                        </li>
                                        <li>
                                            <input v-model="faqForm.status" type="radio" id="faq-status-1"
                                                name="faq-status" value="1" class="hidden peer">
                                            <label for="faq-status-1"
                                                class="h-full inline-flex items-center justify-between w-full px-4 p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                                <div class="block text-xs font-semibold text-center w-full">
                                                    فعال
                                                </div>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="flex justify-end gap-3 pt-6">
                                <button type="button" @click="closeFaqModal"
                                    class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    انصراف
                                </button>
                                <button type="submit" :disabled="faqFormLoading"
                                    class="px-5 py-2.5 text-sm font-semibold text-white bg-yellow-400 rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-colors shadow-lg shadow-yellow-400/30">
                                    <span v-if="faqFormLoading">در حال ذخیره...</span>
                                    <span v-else>ذخیره</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </BottomSheetDrawer>


            <!-- Delete Category Modal -->
            <BottomSheetDrawer v-model="showDeleteCategoryModal"
                :initialHeight="deleteSheetInitialHeight"
                :maxHeight="0.95"
                :minHeight="deleteSheetHasFaqs ? 0.6 : 0.4"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="deleteSheetHasFaqs ? sheetPanelClass : sheetPanelClassSm"
                :contentClass="sheetContentClass"
                :backdropClass="sheetBackdropClass">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">حذف دسته‌بندی</h3>
                        <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {{ deleteSheetHasFaqs ? 'سوالات را منتقل کنید، سپس دسته حذف می‌شود' : 'این عملیات قابل بازگشت نیست' }}
                        </p>
                    </div>
                    <button type="button" @click="closeDeleteCategoryModal"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <template v-if="!deleteSheetHasFaqs">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        آیا از حذف دسته‌بندی «<strong>{{ categoryForDelete?.title }}</strong>» مطمئن هستید؟
                    </p>
                </template>

                <template v-else>
                    <div class="rounded-2xl border border-amber-200/80 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-950/20 p-3.5 mb-4">
                        <div class="flex items-start gap-3">
                            <div class="shrink-0 p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                    حذف «{{ categoryForDelete?.title }}» — {{ formatNumber(categoryForDelete?.faqs_count) }} سوال
                                </p>
                                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    قبل از حذف، مقصد هر سوال را مشخص کنید.
                                </p>
                            </div>
                        </div>
                    </div>

                    <ul class="h-10 grid w-full grid-cols-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                        <li>
                            <input id="faq-transfer-mode-bulk" v-model="transferMode" type="radio" value="bulk" class="hidden peer" />
                            <label for="faq-transfer-mode-bulk"
                                class="h-full inline-flex items-center justify-center w-full rounded-lg cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-300 peer-checked:text-gray-900 peer-checked:bg-yellow-400">
                                انتقال یکجا
                            </label>
                        </li>
                        <li>
                            <input id="faq-transfer-mode-per" v-model="transferMode" type="radio" value="per_faq" class="hidden peer" />
                            <label for="faq-transfer-mode-per"
                                class="h-full inline-flex items-center justify-center w-full rounded-lg cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-300 peer-checked:text-gray-900 peer-checked:bg-yellow-400">
                                انتقال تکی
                            </label>
                        </li>
                    </ul>

                    <template v-if="transferMode === 'bulk'">
                        <div class="flex items-center gap-2 mb-4">
                            <div class="flex-1 min-w-0 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 px-3 py-2.5">
                                <p class="text-[10px] font-medium text-rose-600 dark:text-rose-400 mb-0.5">حذف می‌شود</p>
                                <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ categoryForDelete?.title }}</p>
                                <p class="text-[10px] text-gray-500 mt-0.5 font-anjoman">{{ formatNumber(categoryForDelete?.faqs_count) }} سوال</p>
                            </div>
                            <div class="shrink-0 text-gray-400">
                                <svg class="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 rounded-xl border px-3 py-2.5 transition-colors"
                                :class="transferTargetId
                                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40'
                                    : 'bg-gray-50 dark:bg-gray-800/50 border-dashed border-gray-300 dark:border-gray-600'">
                                <p class="text-[10px] font-medium mb-0.5" :class="transferTargetId ? 'text-emerald-600' : 'text-gray-400'">مقصد همه</p>
                                <p class="text-xs font-semibold truncate" :class="transferTargetId ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
                                    {{ selectedTransferCategory?.title || 'انتخاب دسته' }}
                                </p>
                            </div>
                        </div>
                        <div class="relative mb-2">
                            <input v-model="transferSearch" type="text" placeholder="جستجوی دسته مقصد..."
                                class="w-full h-9 ps-9 pe-3 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-amber-400/50" />
                            <svg class="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <div v-if="!transferTargetOptions.length" class="py-6 text-center text-xs text-gray-500 mb-4">
                            دسته دیگری برای انتقال وجود ندارد.
                        </div>
                        <div v-else class="max-h-40 overflow-y-auto custom-scrollbar space-y-1.5 mb-4 pe-0.5">
                            <button v-for="cat in transferTargetOptions" :key="cat.id" type="button"
                                @click="transferTargetId = cat.id"
                                class="w-full flex items-center gap-3 p-2.5 rounded-xl text-start transition-all"
                                :class="transferTargetId === cat.id
                                    ? 'bg-amber-100 dark:bg-amber-900/30 ring-2 ring-amber-400/70'
                                    : 'bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70'">
                                <div class="shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                    :class="transferTargetId === cat.id ? 'border-amber-500' : 'border-gray-300'">
                                    <div v-if="transferTargetId === cat.id" class="w-2 h-2 rounded-full bg-amber-500"></div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ cat.title }}</div>
                                    <div class="text-[10px] text-gray-500">{{ formatNumber(cat.faqs_count) }} سوال</div>
                                </div>
                            </button>
                        </div>
                    </template>

                    <template v-else>
                        <div class="mb-4">
                            <div class="flex items-center justify-between text-xs mb-1.5">
                                <span class="text-gray-600 dark:text-gray-400">پیشرفت تخصیص</span>
                                <span class="font-semibold font-anjoman"
                                    :class="transferProgressComplete ? 'text-emerald-600' : 'text-amber-600'">
                                    {{ formatNumber(transferAssignedCount) }} / {{ formatNumber(deleteFaqs.length) }}
                                </span>
                            </div>
                            <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-300"
                                    :class="transferProgressComplete ? 'bg-emerald-500' : 'bg-amber-400'"
                                    :style="{ width: transferProgressPercent + '%' }"></div>
                            </div>
                        </div>

                        <div class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 p-3 mb-3 space-y-2">
                            <div class="flex flex-wrap items-center gap-2">
                                <select v-model="bulkApplyCategoryId"
                                    class="flex-1 min-w-[8rem] h-8 px-2 text-xs rounded-lg bg-white dark:bg-gray-900 outline-none">
                                    <option :value="null" disabled>دسته مقصد...</option>
                                    <option v-for="cat in otherCategories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                                </select>
                                <button type="button" @click="applyBulkToAll" :disabled="!bulkApplyCategoryId"
                                    class="h-8 px-3 text-xs font-semibold rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 disabled:opacity-40">
                                    همه
                                </button>
                                <button type="button" @click="applyBulkToSelected" :disabled="!bulkApplyCategoryId || !selectedDeleteFaqIds.length"
                                    class="h-8 px-3 text-xs font-semibold rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-40">
                                    انتخاب‌شده ({{ formatNumber(selectedDeleteFaqIds.length) }})
                                </button>
                                <button type="button" @click="clearFaqTransfers"
                                    class="h-8 px-3 text-xs font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200">
                                    پاک کردن
                                </button>
                            </div>
                            <div class="flex items-center justify-between gap-2">
                                <label class="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                    <input type="checkbox" :checked="allDeleteFaqsSelected"
                                        :indeterminate.prop="isIndeterminateDeleteSelection"
                                        @change="toggleSelectAllDeleteFaqs"
                                        class="appearance-none shrink-0 w-5 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-gray-50 dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
                                        :class="[
                                            allDeleteFaqsSelected ? 'is-checked bg-yellow-400' : '',
                                            isIndeterminateDeleteSelection ? 'is-indeterminate bg-yellow-400' : '',
                                        ]" />
                                    انتخاب همه
                                </label>
                                <div class="relative flex-1 max-w-xs">
                                    <input v-model="deleteFaqSearch" type="text" placeholder="جستجو..."
                                        class="w-full h-7 ps-8 pe-2 text-[11px] rounded-lg bg-white dark:bg-gray-900 outline-none" />
                                    <svg class="w-3.5 h-3.5 absolute start-2.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div v-if="!otherCategories.length" class="py-6 text-center text-xs text-gray-500 mb-4">
                            دسته دیگری برای انتقال وجود ندارد.
                        </div>
                        <div v-else class="max-h-52 overflow-y-auto custom-scrollbar space-y-1.5 mb-4 pe-0.5">
                            <div v-for="faq in filteredDeleteFaqs" :key="faq.id"
                                @click="toggleDeleteFaqSelection(faq.id, $event)"
                                class="flex items-center gap-2.5 p-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                :class="deleteFaqRowClass(faq)">
                                <input type="checkbox" :checked="isDeleteFaqSelected(faq.id)"
                                    tabindex="-1" aria-hidden="true"
                                    class="shrink-0 appearance-none w-5 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 checked:bg-yellow-400 focus:outline-none transition relative custom-checkbox pointer-events-none"
                                    :class="isDeleteFaqSelected(faq.id) ? 'is-checked bg-yellow-400' : ''" />
                                <div class="min-w-0 flex-1">
                                    <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{{ faq.question }}</div>
                                    <div class="flex items-center gap-1.5 mt-0.5">
                                        <span class="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                                            :class="faq.status ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'">
                                            {{ faq.status ? 'فعال' : 'غیرفعال' }}
                                        </span>
                                    </div>
                                </div>
                                <select :value="faqTransfers[faq.id] || ''"
                                    @click.stop
                                    @change="setFaqTransfer(faq.id, $event.target.value)"
                                    class="shrink-0 w-[7.5rem] h-8 px-1.5 text-[11px] rounded-lg outline-none border-0 transition-colors duration-200"
                                    :class="faqTransfers[faq.id]
                                        ? 'bg-emerald-100/90 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                                        : 'bg-white/90 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400'">
                                    <option value="" disabled>مقصد...</option>
                                    <option v-for="cat in otherCategories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                                </select>
                            </div>
                        </div>

                        <div v-if="transferPendingCount > 0"
                            class="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-xl px-3 py-2 mb-2">
                            {{ formatNumber(transferPendingCount) }} سوال هنوز مقصد ندارند.
                        </div>
                    </template>
                </template>

                <div class="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-2 pt-4">
                    <button type="button" @click="closeDeleteCategoryModal"
                        class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        انصراف
                    </button>
                    <button type="button" @click="deleteCategory"
                        :disabled="deleteCategoryLoading || !canConfirmDelete"
                        class="px-5 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-50 shadow-lg transition-colors"
                        :class="deleteSheetHasFaqs
                            ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                            : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'">
                        <span v-if="deleteCategoryLoading">در حال پردازش...</span>
                        <span v-else-if="deleteSheetHasFaqs && transferMode === 'per_faq'">انتقال تکی و حذف دسته</span>
                        <span v-else-if="deleteSheetHasFaqs">انتقال {{ formatNumber(categoryForDelete?.faqs_count) }} سوال و حذف</span>
                        <span v-else>حذف دسته‌بندی</span>
                    </button>
                </div>
            </BottomSheetDrawer>

            <!-- Delete FAQ Modal -->
            <BottomSheetDrawer v-model="showDeleteFaqModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl  lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                        حذف دسته‌بندی
                    </h3>
                    <button type="button"
                        class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
                        @click="closeDeleteFaqModal">
                        <span class="sr-only">Close</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    آیا مطمئن هستید که می‌خواهید این سوال را حذف کنید؟
                </p>
                <div class="flex justify-end gap-3">
                    <button type="button" @click="closeDeleteFaqModal"
                        class="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        انصراف
                    </button>
                    <button type="button" @click="deleteFaq" :disabled="deleteFaqLoading"
                        class="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors shadow-lg shadow-rose-500/30">
                        <span v-if="deleteFaqLoading">در حال حذف...</span>
                        <span v-else>حذف</span>
                    </button>
                </div>
            </BottomSheetDrawer>

        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import { Container, Draggable } from "vue3-smooth-dnd";
import axiosInstance from "@/store/axiosInstance";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { showToastSuccess, showToastError } from "@/utils/toastConfig";
import debounce from "lodash/debounce";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";

const SHEET_PANEL = 'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]';
const SHEET_PANEL_SM = 'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[32rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]';
const SHEET_CONTENT = 'px-4 pb-4 overflow-auto custom-scrollbar';
const SHEET_BACKDROP = 'z-50 bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm';

export default {
    components: {
        AdminMasterPage,
        AdminReportStatCard,
        Container,
        Draggable,
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
        Popover,
        PopoverButton,
        PopoverPanel,
        PopoverOverlay,
        BottomSheetDrawer,
        EditorComponent,
    },
    data() {
        return {
            categories: [],
            stats: {
                total_categories: 0,
                active_categories: 0,
                inactive_categories: 0,
                empty_categories: 0,
                total_faqs: 0,
                active_faqs: 0,
                inactive_faqs: 0,
                avg_faqs_per_category: 0,
            },
            searchQuery: "",
            statusFilter: "all",
            loading: false,
            showCategoryModal: false,
            showFaqModal: false,
            showDeleteCategoryModal: false,
            showDeleteFaqModal: false,
            categoryMode: 'create',
            faqMode: 'create',
            categoryFormLoading: false,
            faqFormLoading: false,
            deleteCategoryLoading: false,
            deleteFaqLoading: false,
            categoryForDelete: null,
            faqForDelete: null,
            transferMode: "bulk",
            transferTargetId: null,
            transferSearch: "",
            deleteFaqs: [],
            deleteFaqSearch: "",
            faqTransfers: {},
            bulkApplyCategoryId: null,
            selectedDeleteFaqIds: [],
            sheetPanelClass: SHEET_PANEL,
            sheetPanelClassSm: SHEET_PANEL_SM,
            sheetContentClass: SHEET_CONTENT,
            sheetBackdropClass: SHEET_BACKDROP,
            categoryForm: {
                title: '',
                english_title: '',
                icon: '',
                order: 0,
                status: true,
            },
            faqForm: {
                category_id: null,
                question: '',
                answer: '',
                order: 0,
                status: true,
            },
            editingCategory: null,
            editingFaq: null,
        };
    },
    computed: {
        displayCategories() {
            let list = [...this.categories];
            if (this.statusFilter === "empty") {
                list = list.filter((c) => !(c.faqs_count || 0));
            } else if (this.statusFilter === "has_faqs") {
                list = list.filter((c) => (c.faqs_count || 0) > 0);
            }
            return list;
        },
        deleteSheetHasFaqs() {
            return (this.categoryForDelete?.faqs_count || 0) > 0;
        },
        deleteSheetInitialHeight() {
            if (!this.deleteSheetHasFaqs) return 0.42;
            if (this.transferMode === "per_faq") return 0.88;
            return 0.68;
        },
        otherCategories() {
            if (!this.categoryForDelete) return [];
            return this.categories
                .filter((c) => c.id !== this.categoryForDelete.id)
                .sort((a, b) => (a.title || "").localeCompare(b.title || "", "fa"));
        },
        transferTargetOptions() {
            const q = this.transferSearch.trim().toLowerCase();
            return this.otherCategories.filter((c) =>
                !q || (c.title || "").toLowerCase().includes(q) || (c.english_title || "").toLowerCase().includes(q)
            );
        },
        selectedTransferCategory() {
            if (!this.transferTargetId) return null;
            return this.categories.find((c) => c.id === this.transferTargetId) || null;
        },
        filteredDeleteFaqs() {
            const q = this.deleteFaqSearch.trim().toLowerCase();
            if (!q) return this.deleteFaqs;
            return this.deleteFaqs.filter((f) => (f.question || "").toLowerCase().includes(q));
        },
        transferAssignedCount() {
            return this.deleteFaqs.filter((f) => !!this.faqTransfers[f.id]).length;
        },
        transferPendingCount() {
            return this.deleteFaqs.length - this.transferAssignedCount;
        },
        transferProgressPercent() {
            if (!this.deleteFaqs.length) return 0;
            return Math.round((this.transferAssignedCount / this.deleteFaqs.length) * 100);
        },
        transferProgressComplete() {
            return this.deleteFaqs.length > 0 && this.transferPendingCount === 0;
        },
        allDeleteFaqsSelected() {
            return this.deleteFaqs.length > 0 && this.selectedDeleteFaqIds.length === this.deleteFaqs.length;
        },
        isIndeterminateDeleteSelection() {
            const count = this.selectedDeleteFaqIds.length;
            return count > 0 && count < this.deleteFaqs.length;
        },
        canConfirmDelete() {
            if (!this.categoryForDelete) return false;
            if (!this.deleteSheetHasFaqs) return true;
            if (!this.otherCategories.length) return false;
            if (this.transferMode === "bulk") return !!this.transferTargetId;
            return this.transferProgressComplete;
        },
    },
    watch: {
        searchQuery() {
            this.debouncedFetchCategories();
        },
        statusFilter(newVal) {
            if (newVal === "active" || newVal === "inactive" || newVal === "all") {
                this.fetchCategories();
            }
        },
    },
    mounted() {
        this.debouncedFetchCategories = debounce(this.fetchCategories, 400);
        this.fetchCategories();
    },
    methods: {
        formatNumber(value) {
            return Number(value || 0).toLocaleString("fa-IR");
        },
        clearFilters() {
            this.searchQuery = "";
            this.statusFilter = "all";
            this.fetchCategories();
        },
        async fetchCategories() {
            this.loading = true;
            try {
                const params = { perPage: 100 };
                const q = this.searchQuery.trim();
                if (q) params.search = q;
                if (this.statusFilter === "active") params.status = 1;
                else if (this.statusFilter === "inactive") params.status = 0;

                const response = await axiosInstance.post('/admin/faqs/categories', params);
                if (response.data?.categories) {
                    this.categories = response.data.categories.data || response.data.categories;
                }
                if (response.data?.stats) {
                    this.stats = response.data.stats;
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                showToastError("خطایی در دریافت اطلاعات رخ داد.");
            } finally {
                this.loading = false;
            }
        },
        getChildPayload(category, index) {
            return { ...category.faqs[index], category_id: category.id };
        },
        applyDrag(arr, dragResult) {
            const { removedIndex, addedIndex, payload } = dragResult;
            if (removedIndex === null && addedIndex === null) return arr;
            const result = [...arr];
            let itemToAdd = payload;
            if (removedIndex !== null) {
                itemToAdd = result.splice(removedIndex, 1)[0];
            }
            if (addedIndex !== null) {
                result.splice(addedIndex, 0, itemToAdd);
            }
            return result;
        },
        onDrop(targetCategory, dropResult) {
            if (!dropResult) return;
            targetCategory.faqs = this.applyDrag(targetCategory.faqs, dropResult);
            const movedFaq = dropResult.payload;
            if (movedFaq.category_id !== targetCategory.id) {
                movedFaq.category_id = targetCategory.id;
            }
            const allFaqs = [];
            // Reorder FAQs within each category separately
            this.categories.forEach((category) => {
                if (category.faqs && category.faqs.length > 0) {
                    category.faqs.forEach((faq, idx) => {
                        faq.category_id = category.id;
                        faq.order = idx + 1; // Order starts from 1 for each category
                        allFaqs.push(faq);
                    });
                }
            });
            this.reorderFaqs(allFaqs);
        },
        reorderFaqs: debounce(function (faqsList) {
            axiosInstance
                .post('/admin/faqs/reorder', {
                    faqs: faqsList.map((faq) => ({
                        id: faq.id,
                        category_id: faq.category_id,
                        order: faq.order,
                    })),
                })
                .then(() => {
                    showToastSuccess('سوالات با موفقیت مرتب شدند.');
                })
                .catch((err) => {
                    console.error("❌ API Error:", err);
                    showToastError("خطایی در مرتب‌سازی رخ داد.");
                });
        }, 1000),
        openCreateCategoryModal() {
            this.categoryMode = 'create';
            this.categoryForm = {
                title: '',
                english_title: '',
                icon: '',
                order: 0,
                status: true,
            };
            this.editingCategory = null;
            this.showCategoryModal = true;
        },
        openEditCategoryModal(category) {
            this.categoryMode = 'edit';
            this.editingCategory = category;
            this.categoryForm = {
                title: category.title,
                english_title: category.english_title,
                icon: category.icon || '',
                order: category.order,
                status: category.status,
            };
            this.showCategoryModal = true;
        },
        closeCategoryModal() {
            this.showCategoryModal = false;
            this.editingCategory = null;
        },
        async submitCategoryForm() {
            this.categoryFormLoading = true;
            try {
                if (this.categoryMode === 'create') {
                    await axiosInstance.post('/admin/faqs/category/create', this.categoryForm);
                    showToastSuccess('دسته‌بندی با موفقیت ایجاد شد.');
                } else {
                    await axiosInstance.post(`/admin/faqs/category/${this.editingCategory.id}/update`, this.categoryForm);
                    showToastSuccess('دسته‌بندی با موفقیت به‌روزرسانی شد.');
                }
                this.closeCategoryModal();
                this.fetchCategories();
            } catch (error) {
                console.error('Error submitting category form:', error);
                showToastError(error.response?.data?.message || 'خطایی رخ داد.');
            } finally {
                this.categoryFormLoading = false;
            }
        },
        openCreateFaqModal(category) {
            this.faqMode = 'create';
            this.faqForm = {
                category_id: category.id,
                question: '',
                answer: '',
                order: category.faqs ? category.faqs.length + 1 : 1,
                status: true,
            };
            this.editingFaq = null;
            this.showFaqModal = true;
        },
        openEditFaqModal(faq) {
            this.faqMode = 'edit';
            this.editingFaq = faq;
            this.faqForm = {
                category_id: faq.category_id,
                question: faq.question,
                answer: faq.answer,
                order: faq.order,
                status: faq.status,
            };
            this.showFaqModal = true;
        },
        closeFaqModal() {
            this.showFaqModal = false;
            this.editingFaq = null;
        },
        async submitFaqForm() {
            this.faqFormLoading = true;
            try {
                if (this.faqMode === 'create') {
                    await axiosInstance.post('/admin/faqs/create', this.faqForm);
                    showToastSuccess('سوال با موفقیت ایجاد شد.');
                } else {
                    await axiosInstance.post(`/admin/faqs/${this.editingFaq.id}/update`, this.faqForm);
                    showToastSuccess('سوال با موفقیت به‌روزرسانی شد.');
                }
                this.closeFaqModal();
                this.fetchCategories();
            } catch (error) {
                console.error('Error submitting FAQ form:', error);
                showToastError(error.response?.data?.message || 'خطایی رخ داد.');
            } finally {
                this.faqFormLoading = false;
            }
        },
        openDeleteCategoryModal(category) {
            this.categoryForDelete = category;
            const faqsCount = category.faqs_count || category.faqs?.length || 0;
            this.transferMode = faqsCount > 3 ? "per_faq" : "bulk";
            this.transferTargetId = null;
            this.transferSearch = "";
            this.deleteFaqs = category.faqs ? [...category.faqs] : [];
            this.deleteFaqSearch = "";
            this.faqTransfers = {};
            this.bulkApplyCategoryId = null;
            this.selectedDeleteFaqIds = [];
            const others = this.categories.filter((c) => c.id !== category.id);
            if (faqsCount > 0 && others.length === 1) {
                this.transferTargetId = others[0].id;
                this.bulkApplyCategoryId = others[0].id;
            }
            this.showDeleteCategoryModal = true;
        },
        closeDeleteCategoryModal() {
            this.categoryForDelete = null;
            this.showDeleteCategoryModal = false;
            this.transferMode = "bulk";
            this.transferTargetId = null;
            this.transferSearch = "";
            this.deleteFaqs = [];
            this.deleteFaqSearch = "";
            this.faqTransfers = {};
            this.bulkApplyCategoryId = null;
            this.selectedDeleteFaqIds = [];
        },
        setFaqTransfer(faqId, value) {
            const categoryId = value ? Number(value) : null;
            if (!categoryId) {
                const next = { ...this.faqTransfers };
                delete next[faqId];
                this.faqTransfers = next;
                return;
            }
            this.faqTransfers = { ...this.faqTransfers, [faqId]: categoryId };
        },
        applyBulkToAll() {
            if (!this.bulkApplyCategoryId) return;
            const next = { ...this.faqTransfers };
            this.deleteFaqs.forEach((f) => {
                next[f.id] = this.bulkApplyCategoryId;
            });
            this.faqTransfers = next;
        },
        applyBulkToSelected() {
            if (!this.bulkApplyCategoryId || !this.selectedDeleteFaqIds.length) return;
            const next = { ...this.faqTransfers };
            this.selectedDeleteFaqIds.forEach((id) => {
                next[id] = this.bulkApplyCategoryId;
            });
            this.faqTransfers = next;
        },
        clearFaqTransfers() {
            this.faqTransfers = {};
            this.selectedDeleteFaqIds = [];
        },
        isDeleteFaqSelected(faqId) {
            return this.selectedDeleteFaqIds.includes(faqId);
        },
        deleteFaqRowClass(faq) {
            const selected = this.isDeleteFaqSelected(faq.id);
            const assigned = !!this.faqTransfers[faq.id];
            if (selected) {
                return "bg-amber-100/90 dark:bg-amber-900/35 hover:bg-amber-100 dark:hover:bg-amber-900/40";
            }
            if (assigned) {
                return "bg-emerald-50/90 dark:bg-emerald-950/25 hover:bg-emerald-50 dark:hover:bg-emerald-950/30";
            }
            return "bg-gray-100/70 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-800/70";
        },
        toggleDeleteFaqSelection(faqId, event) {
            if (event.target.closest("select")) return;
            const idx = this.selectedDeleteFaqIds.indexOf(faqId);
            if (idx === -1) {
                this.selectedDeleteFaqIds = [...this.selectedDeleteFaqIds, faqId];
            } else {
                this.selectedDeleteFaqIds = this.selectedDeleteFaqIds.filter((id) => id !== faqId);
            }
        },
        toggleSelectAllDeleteFaqs(event) {
            if (event.target.checked) {
                this.selectedDeleteFaqIds = this.deleteFaqs.map((f) => f.id);
            } else {
                this.selectedDeleteFaqIds = [];
            }
        },
        buildDeletePayload() {
            if (!this.deleteSheetHasFaqs) return undefined;
            if (this.transferMode === "bulk") {
                return { transfer_to: this.transferTargetId };
            }
            return {
                transfers: this.deleteFaqs.map((f) => ({
                    faq_id: f.id,
                    category_id: this.faqTransfers[f.id],
                })),
            };
        },
        formatDeleteSuccessMessage(response) {
            const transferred = response.data?.transferred_faqs;
            const targetTitle = response.data?.transfer_to?.title;
            if (transferred && targetTitle) {
                return `${this.formatNumber(transferred)} سوال به «${targetTitle}» منتقل شد و دسته حذف شد`;
            }
            if (transferred) {
                return `${this.formatNumber(transferred)} سوال منتقل شد و دسته حذف شد`;
            }
            return "دسته‌بندی حذف شد";
        },
        async deleteCategory() {
            if (!this.categoryForDelete || !this.canConfirmDelete) return;
            this.deleteCategoryLoading = true;
            try {
                const payload = this.buildDeletePayload();
                const response = await axiosInstance.delete(
                    `/admin/faqs/category/${this.categoryForDelete.id}`,
                    payload ? { data: payload } : undefined
                );
                showToastSuccess(this.formatDeleteSuccessMessage(response));
                this.closeDeleteCategoryModal();
                this.fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                showToastError(error.response?.data?.message || 'خطایی در حذف رخ داد.');
            } finally {
                this.deleteCategoryLoading = false;
            }
        },
        openDeleteFaqModal(faq) {
            this.faqForDelete = faq;
            this.showDeleteFaqModal = true;
        },
        closeDeleteFaqModal() {
            this.faqForDelete = null;
            this.showDeleteFaqModal = false;
        },
        async deleteFaq() {
            if (!this.faqForDelete) return;
            this.deleteFaqLoading = true;
            try {
                await axiosInstance.delete(`/admin/faqs/${this.faqForDelete.id}`);
                showToastSuccess('سوال با موفقیت حذف شد.');
                this.closeDeleteFaqModal();
                this.fetchCategories();
            } catch (error) {
                console.error('Error deleting FAQ:', error);
                showToastError(error.response?.data?.message || 'خطایی در حذف رخ داد.');
            } finally {
                this.deleteFaqLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.faq-line {
    transition: all 0.2s ease;
}

.last-faq {
    margin-bottom: 2rem;
}

.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.custom-checkbox::after {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    display: none;
    color: white;
    font-size: 13px;
    font-weight: bold;
    line-height: 1;
    text-align: center;
    user-select: none;
}

.custom-checkbox.is-checked::after {
    content: '✔';
    display: block;
    margin-top: 1px;
}

.custom-checkbox.is-indeterminate::after {
    content: '−';
    display: block;
    margin-top: -1px;
    font-size: 16px;
    font-weight: 700;
}
</style>
