<template>
    <div class="relative">
        <div class="mb-6 rounded-2xl border border-gray-200/80 bg-white p-4 md:p-5 dark:border-gray-700/80 dark:bg-gray-900 shadow-sm">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white">دوره‌های کاربر</h4>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400">دوره‌های اختصاص‌یافته و خریداری‌شده</p>
                    </div>
                </div>
                <button @click.prevent="openAssignModal"
                    class="rounded-xl px-4 py-2 flex justify-center items-center text-xs font-bold bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25 hover:bg-amber-500 transition-colors">
                    اختصاص دوره جدید
                    <svg class="ms-1.5 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
                </button>
            </div>
        <div class="gap-y-4 flex flex-col lg:flex-row lg:items-end lg:justify-between mb-4">
                <div class="">
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-3 h-3 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="simple-search" v-model="searchQuery" @input="onSearchInput"
                            class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg text-xs  border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-none h-8 ps-8 p-2.5"
                            placeholder="جستجو..." />
                    </div>
                </div>
                <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">وضعیت انتشار:</div>
                        <select :value="selectedPublish.slug" @change="selectPublishBySlug($event.target.value)"
                            class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg text-xs  border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-none">
                            <option v-for="(pbsh, index) in publishs" :key="index" :value="pbsh.slug">
                                {{ pbsh.title }}
                            </option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">نوع دوره:</div>
                        <select :value="selectedType.slug" @change="selectTypeBySlug($event.target.value)"
                            class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg text-xs  border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-none">
                            <option v-for="(typ, index) in types" :key="index" :value="typ.slug">
                                {{ typ.title }}
                            </option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                        <select :value="selectedSort.slug" @change="selectSortBySlug($event.target.value)"
                            class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg text-xs  border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-none">
                            <option v-for="(srt, index) in sort" :key="index" :value="srt.slug">
                                {{ srt.title }}
                            </option>
                        </select>
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

            <div id="data-list">
                    <div class="overflow-x-auto md:custom-scrollbar pt-4">
                        <table
                            class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                <tr class="text-xs font-semibold text-start">
                                    <th class="px-1 py-3 whitespace-nowrap text-start">پوستر</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">جزئیات دوره</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت انتشار</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">نوع دوره</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">قیمت خرید</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ خرید</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">وضعیت تکمیل</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">مدت زمان</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                <tr v-for="(item, i) in items" v-show="!loading" :key="i"
                                    class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                        <div class="flex items-center">
                                            <div
                                                class="flex-shrink-0 w-20 h-12 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-100 dark:border-opacity-10 overflow-hidden">
                                                <img onerror="this.style.display='none'"
                                                    class="w-full h-full object-cover hover:scale-105 duration-150"
                                                    :src="item.poster" :alt="item.title" />
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 text-start">
                                        <div class="flex items-center">
                                            <div class="ms-2 w-48">
                                                <div class="mb-1 text-gray-900 dark:text-white font-bold line-clamp-1"
                                                    :title="item.title">
                                                    {{ item.title }}
                                                </div>
                                                <div class="text-gray-500 text-xs line-clamp-2">{{ item.short_description }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                        <div v-if="item.publish"
                                            class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M3 14C3 9.02944 7.02944 5 12 5C16.9706 5 21 9.02944 21 14M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z"
                                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round"></path>
                                            </svg>
                                            منتشر شده
                                        </div>
                                        <div v-else
                                            class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9.60997 9.60714C8.05503 10.4549 7 12.1043 7 14C7 16.7614 9.23858 19 12 19C13.8966 19 15.5466 17.944 16.3941 16.3878M21 14C21 9.02944 16.9706 5 12 5C11.5582 5 11.1238 5.03184 10.699 5.09334M3 14C3 11.0069 4.46104 8.35513 6.70883 6.71886M3 3L21 21"
                                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round"></path>
                                            </svg>
                                            پیش‌نویس
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                        <div
                                            class="whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            <span v-if="item.type === 'free'">رایگان</span>
                                            <span v-if="item.type === 'cash'">نقدی</span>
                                            <span v-if="item.type === 'cash-vip'">نقدی/اعضای‌ویژه</span>
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                        <div
                                            class="whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ item.purchase_price ? item.purchase_price.toLocaleString() + ' تومان' : 'رایگان' }}
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                        <div dir="ltr"
                                            class="whitespace-nowrap text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ item.purchased_at
                                                ? new Date(item.purchased_at)
                                                    .toLocaleDateString("fa-IR", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    .replace(/\//g, "-")
                                                : '-' }}
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                        <div v-if="item.completed_at"
                                            class="whitespace-nowrap flex items-center text-xs font-medium text-green-800 dark:text-green-100 bg-green-100/70 dark:bg-green-800/50 px-2 py-1 rounded-lg">
                                            <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"
                                                    stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                            تکمیل شده
                                        </div>
                                        <div v-else
                                            class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            در حال یادگیری
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 whitespace-nowrap text-start">
                                        <div
                                            class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {{ new Date(item.total_time * 1000).toISOString().slice(11, 19) }}
                                            <svg class="ms-1 w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M11.0055 2H12.9945C14.3805 1.99999 15.4828 1.99999 16.3716 2.0738C17.2819 2.14939 18.0575 2.30755 18.7658 2.67552C19.8617 3.24477 20.7552 4.13829 21.3245 5.23415C21.6925 5.94253 21.8506 6.71811 21.9262 7.62839C22 8.51722 22 9.6195 22 11.0055V12.9945C22 14.3805 22 15.4828 21.9262 16.3716C21.8506 17.2819 21.6925 18.0575 21.3245 18.7658C20.7552 19.8617 19.8617 20.7552 18.7658 21.3245C18.0575 21.6925 17.2819 21.8506 16.3716 21.9262C15.4828 22 14.3805 22 12.9945 22H11.0055C9.6195 22 8.51722 22 7.62839 21.9262C6.71811 21.8506 5.94253 21.6925 5.23415 21.3245C4.13829 20.7552 3.24477 19.8617 2.67552 18.7658C2.30755 18.0575 2.14939 17.2819 2.0738 16.3716C1.99999 15.4828 1.99999 14.3805 2 12.9945V11.0055C1.99999 9.61949 1.99999 8.51721 2.0738 7.62839C2.14939 6.71811 2.30755 5.94253 2.67552 5.23415C3.24477 4.13829 4.13829 3.24477 5.23415 2.67552C5.94253 2.30755 6.71811 2.14939 7.62839 2.0738C8.51721 1.99999 9.61949 1.99999 11.0055 2ZM7.79391 4.06694C7.00955 4.13207 6.53142 4.25538 6.1561 4.45035C5.42553 4.82985 4.82985 5.42553 4.45035 6.1561C4.25538 6.53142 4.13207 7.00955 4.06694 7.79391C4.0008 8.59025 4 9.60949 4 11.05V12.95C4 14.3905 4.0008 15.4097 4.06694 16.2061C4.13207 16.9905 4.25538 17.4686 4.45035 17.8439C4.82985 18.5745 5.42553 19.1702 6.1561 19.5497C6.53142 19.7446 7.00955 19.8679 7.79391 19.9331C8.59025 19.9992 9.60949 20 11.05 20H12.95C14.3905 20 15.4097 19.9992 16.2061 19.9331C16.9905 19.8679 17.4686 19.7446 17.8439 19.5497C18.5745 19.1702 19.1702 18.5745 19.5497 17.8439C19.7446 17.4686 19.8679 16.9905 19.9331 16.2061C19.9992 15.4097 20 14.3905 20 12.95V11.05C20 9.60949 19.9992 8.59025 19.9331 7.79391C19.8679 7.00955 19.7446 6.53142 19.5497 6.1561C19.1702 5.42553 18.5745 4.82985 17.8439 4.45035C17.4686 4.25538 16.9905 4.13207 16.2061 4.06694C15.4097 4.0008 14.3905 4 12.95 4H11.05C9.60949 4 8.59025 4.0008 7.79391 4.06694ZM11.8284 6.75736C12.3807 6.75736 12.8284 7.20507 12.8284 7.75736V12.7245L16.3553 14.0653C16.8716 14.2615 17.131 14.8391 16.9347 15.3553C16.7385 15.8716 16.1609 16.131 15.6447 15.9347L11.4731 14.349C11.085 14.2014 10.8284 13.8294 10.8284 13.4142V7.75736C10.8284 7.20507 11.2761 6.75736 11.8284 6.75736Z"
                                                    fill="currentColor"></path>
                                            </svg>
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 whitespace-nowrap text-center">
                                        <div class="flex items-center justify-center gap-2">
                                            <router-link
                                                :to="{ name: 'admin-course-details', params: { courseSlug: item.slug } }"
                                                class="inline-flex items-center px-2 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                                                مشاهده 
                                            </router-link>
                                            <button @click.prevent="openDeleteCourseModal(item.id)"
                                                :disabled="removeLoading[item.id]"
                                                class="disabled:opacity-60 inline-flex items-center px-1.5 py-1.5 text-xs font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700">
                                                <svg v-if="!removeLoading[item.id]" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M10 12V17M14 12V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round"></path>
                                                </svg>
                                                <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                        stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                    </path>
                                                </svg>
                                                
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="!loading && items.length === 0" class="bg-white dark:bg-gray-900">
                                    <td colspan="9" class="px-4 py-12 text-center">
                                        <div class="flex flex-col items-center justify-center">
                                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                                <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            </div>
                                            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">دوره‌ای یافت نشد</p>
                                        </div>
                                    </td>
                                </tr>
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
                            <option v-for="(per, index) in perPages" :key="index" :value="per">
                                {{ per }}
                            </option>
                        </select>
                    </div>
                </div>
        </div>
    <LoadingComponent v-if="loading" />

    <BottomSheetDrawer v-model="isAssignModalOpen" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetHeader
            title="اختصاص دوره"
            subtitle="جستجو و انتخاب دوره برای اختصاص به کاربر"
            accent="indigo"
            @close="closeAssignModal">
            <template #icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
        </AdminBottomSheetHeader>
        <div class="text-start space-y-4">
            <div>
                <label for="searchKey" :class="bs.ADMIN_BS_FORM_LABEL">برای جستجو حداقل 3 کاراکتر وارد کنید</label>
                <div class="relative w-full flex items-center">
                    <input type="text" ref="searchInput" id="searchKey" @input="handleSearch"
                        v-model="searchKey"
                        :class="[bs.ADMIN_BS_INPUT, 'pe-10', errors && errors.searchKey ? bs.ADMIN_BS_INPUT_ERROR : '']"
                        placeholder="عنوان دوره..." required />
                    <svg v-if="searchLoading" class="absolute end-3 w-4 h-4" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="25 25 50 50">
                        <circle class="stroke-current text-gray-400 text-opacity-30" cx="50" cy="50"
                            r="20" fill="none" stroke-width="8" stroke-linecap="round"
                            stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
                        <circle class="stroke-current text-gray-400" cx="50" cy="50" r="20" fill="none"
                            stroke-width="8" stroke-linecap="round" stroke-dashoffset="0"
                            stroke-dasharray="100, 200">
                            <animateTransform attributeName="transform" attributeType="XML"
                                type="rotate" from="0 50 50" to="360 50 50" dur="2.5s"
                                repeatCount="indefinite"></animateTransform>
                            <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s"
                                repeatCount="indefinite"></animate>
                            <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200"
                                dur="1.25s" repeatCount="indefinite"></animate>
                        </circle>
                    </svg>
                </div>
                <span v-if="errors && errors.searchKey" class="mt-1 text-rose-500 text-xs font-medium">
                    {{ errors.searchKey[0] }}
                </span>
            </div>
            <div v-if="searchResult && searchResult.length > 0"
                class="space-y-2 max-h-[24rem] overflow-y-auto custom-scrollbar">
                <div v-for="(course, index) in searchResult" :key="index"
                    class="rounded-xl border border-indigo-200/60 dark:border-indigo-800/40 bg-gradient-to-br from-indigo-50/80 to-white dark:from-indigo-900/20 dark:to-gray-800/40 p-2.5 md:p-3 flex items-center justify-between">
                    <div class="flex items-center min-w-0">
                        <div class="w-16 h-10 rounded-lg overflow-hidden border border-indigo-200/40 dark:border-indigo-800/30 shrink-0">
                            <img onerror="this.style.display='none'" class="w-full h-full object-cover"
                                :src="course.poster" />
                        </div>
                        <div class="ms-2 space-y-0.5 min-w-0">
                            <div class="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{{ course.title }}</div>
                            <div class="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{{ course.english_title }}</div>
                        </div>
                    </div>
                    <button @click.prevent="submitAssignCourse(course.id)"
                        :disabled="assignedLoading[course.id] || items.some(c => c.id === course.id)"
                        class="disabled:opacity-60 disabled:bg-gray-300 disabled:text-gray-600 shrink-0 ms-2 flex items-center bg-amber-400 hover:bg-amber-500 text-gray-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm shadow-amber-400/25 transition-colors">
                        اختصاص
                        <svg class="w-3 h-3 ms-1 rtl:-mt-0.5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                            <path fill="currentColor" fill-rule="evenodd"
                                d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-8 text-center">
                <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                    <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">موردی برای نمایش وجود ندارد!</p>
            </div>
        </div>
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="showDeleteCourseModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL_SM"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetHeader
            title="حذف دوره"
            subtitle="حذف دوره از لیست کاربر"
            accent="rose"
            @close="closeDeleteCourseModal">
            <template #icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
        </AdminBottomSheetHeader>
        <AdminBottomSheetConfirm
            message="از حذف این دوره از کاربر اطمینان کامل دارید؟"
            description="این دوره از لیست دوره‌های کاربر حذف خواهد شد."
            :loading="courseIdForDelete && removeLoading[courseIdForDelete]"
            @cancel="closeDeleteCourseModal"
            @confirm="removeCourse(courseIdForDelete)"
        />
    </BottomSheetDrawer>
    </div>
</template>

<script>
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetConfirm from "@/views/components/admin/bottomSheet/AdminBottomSheetConfirm.vue";
import * as adminBottomSheetStyles from "@/views/components/admin/bottomSheet/adminBottomSheetStyles";
import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    components: {
        LoadingComponent,
        PaginationComponent,
        BottomSheetDrawer,
        AdminBottomSheetHeader,
        AdminBottomSheetConfirm,
    },
    props: {
        username: {
            type: String,
            required: true
        }
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        const sortSlugFromUrl = urlParams.get('sort') || 'newest';
        const publishSlugFromUrl = urlParams.get('publish') || 'all';
        const typeSlugFromUrl = urlParams.get('type') || 'all';
        const searchFromUrl = urlParams.get('search') || '';
        const pageFromUrl = urlParams.get('page') || 1;

        const publishs = {
            all: { title: "همه", slug: "all" },
            published: { title: "منتشر شده", slug: "published" },
            draft: { title: "پیش‌نویس", slug: "draft" },
        };
        const types = {
            all: { title: "همه", slug: "all" },
            free: { title: "رایگان", slug: "free" },
            cash: { title: "نقدی", slug: "cash" },
            cash_vip: { title: "نقدی/اعضای‌ویژه", slug: "cash-vip" },
        };
        const sort = {
            newest: { title: "جدیدترین", slug: "newest" },
            oldest: { title: "قدیمی‌ترین", slug: "oldest" },
        };

        const selectedPublish = publishs[publishSlugFromUrl] || publishs.all;
        const typeKeyFromUrl = typeSlugFromUrl === 'cash-vip' ? 'cash_vip' : typeSlugFromUrl;
        const selectedType = types[typeKeyFromUrl] || types.all;
        const selectedSort = sort[sortSlugFromUrl] || sort.newest;

        return {
            bs: adminBottomSheetStyles,
            loading: false,
            items: [],
            pagination: {},
            perPage: 20,
            perPages: [10, 20, 30, 50, 100],
            searchQuery: searchFromUrl,
            publishs,
            selectedPublish: selectedPublish,
            types,
            selectedType: selectedType,
            sort,
            selectedSort: selectedSort,
            currentPage: parseInt(pageFromUrl),
            searchTimeout: null,

            isAssignModalOpen: false,
            searchLoading: false,
            searchKey: null,
            previousSearchKey: "",
            searchResult: [],
            assignedLoading: [],
            removeLoading: [],
            errors: null,

            showDeleteCourseModal: false,
            courseIdForDelete: null,
        };
    },
    methods: {
        selectPublishBySlug(slug) {
            this.selectedPublish = this.publishs[slug] || this.publishs.all;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        selectTypeBySlug(slug) {
            const typeKey = slug === 'cash-vip' ? 'cash_vip' : slug;
            this.selectedType = this.types[typeKey] || this.types.all;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        selectSortBySlug(slug) {
            this.selectedSort = this.sort[slug] || this.sort.newest;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        updatePage(value) {
            this.currentPage = value;
            this.updateUrlAndFetchData();
        },
        selectPerpage(value) {
            this.perPage = value;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        clearFilters() {
            this.selectedPublish = this.publishs.all;
            this.selectedType = this.types.all;
            this.selectedSort = this.sort.newest;
            this.searchQuery = '';
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        onSearchInput() {
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            this.searchTimeout = setTimeout(() => {
                this.currentPage = 1;
                this.updateUrlAndFetchData();
            }, 500);
        },
        updateUrlAndFetchData() {
            let query = {};

            // حفظ query parameter های موجود (مثل section)
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.forEach((value, key) => {
                // فقط section و editSocial را حفظ می‌کنیم (query های مربوط به صفحه والد)
                if (key === 'section' || key === 'editSocial') {
                    query[key] = value;
                }
            });

            // اضافه کردن فیلترهای جدید
            if (this.selectedPublish && this.selectedPublish.slug !== 'all') {
                query.publish = this.selectedPublish.slug;
            }
            if (this.selectedType && this.selectedType.slug !== 'all') {
                query.type = this.selectedType.slug;
            }
            if (this.selectedSort && this.selectedSort.slug !== 'newest') {
                query.sort = this.selectedSort.slug;
            }
            if (this.searchQuery) {
                query.search = this.searchQuery;
            }
            if (this.currentPage !== 1) {
                query.page = this.currentPage;
            }

            const queryString = new URLSearchParams(query).toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

            window.history.pushState(null, '', newUrl);

            this.getData();
        },
        async getData() {
            this.loading = true;
            let params = {
                page: this.currentPage,
                perPage: this.perPage,
                search: this.searchQuery || undefined,
                publish: this.selectedPublish && this.selectedPublish.slug !== 'all' ? this.selectedPublish.slug : undefined,
                type: this.selectedType && this.selectedType.slug !== 'all' ? this.selectedType.slug : undefined,
                sort: this.selectedSort ? this.selectedSort.slug : undefined,
            };

            Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

            await axiosInstance
                .post(`admin/user/${this.username}/courses`, params)
                .then((response) => {
                    this.items = response.data.courses;
                    this.currentPage = response.data.pagination.current_page;
                    this.pagination = response.data.pagination;
                })
                .catch((error) => {
                    console.error(error.response?.data?.errors || error.message);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSearch: debounce(function () {
            if (this.searchKey === this.previousSearchKey) {
                return;
            }

            if (this.searchKey.trim().length > 2) {
                this.searchLoading = true;
                axiosInstance
                    .post(`/admin/searchCourse`, { key: this.searchKey, limit: 20 })
                    .then((response) => {
                        this.searchResult = response.data.result;
                    })
                    .catch((error) => {
                        console.error(error.response?.data?.errors || error.message);
                    })
                    .finally(() => {
                        this.searchLoading = false;
                    });
                this.previousSearchKey = this.searchKey;
            } else if (this.searchKey.length === 0) {
                this.searchResult = [];
                this.previousSearchKey = "";
            }
        }, 1000),
        submitAssignCourse(courseId) {
            this.assignedLoading[courseId] = true;
            axiosInstance
                .post(`/admin/user/${this.username}/courses/assign`, { course_id: courseId })
                .then((response) => {
                    this.items.unshift(response.data.result);
                    toast.success("دوره با موفقیت به کاربر مورد نظر اختصاص داده شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeAssignModal();
                })
                .catch((error) => {
                    console.error(error.response?.data?.errors || error.message);
                    if (error.response && error.response.status === 409) {
                        toast.error("این دوره قبلاً به این کاربر اختصاص داده شده است.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    } else if (error.response && error.response.status === 403) {
                        toast.warning("شما اجازه این عملیات را ندارید.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    } else {
                        toast.error("خطایی رخ داد. لطفاً دوباره تلاش کنید.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    }
                })
                .finally(() => {
                    this.assignedLoading[courseId] = false;
                });
        },
        openAssignModal() {
            this.isAssignModalOpen = true;
            this.$nextTick(() => {
                this.$refs.searchInput.focus();
            });
        },
        closeAssignModal() {
            this.isAssignModalOpen = false;
            this.searchLoading = false;
            this.searchKey = null;
            this.previousSearchKey = "";
            this.searchResult = [];
        },
        openDeleteCourseModal(courseId) {
            this.courseIdForDelete = courseId;
            this.showDeleteCourseModal = true;
        },
        closeDeleteCourseModal() {
            this.courseIdForDelete = null;
            this.showDeleteCourseModal = false;
        },
        removeCourse(courseId) {
            this.removeLoading[courseId] = true;
            axiosInstance
                .post(`/admin/user/${this.username}/courses/remove`, { course_id: courseId })
                .then(() => {
                    this.items = this.items.filter(item => item.id !== courseId);
                    this.closeDeleteCourseModal();
                    toast.success("دوره با موفقیت از کاربر حذف شد.", {
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
                    console.error(error.response?.data?.errors || error.message);
                    if (error.response && error.response.status === 404) {
                        toast.error("این دوره به این کاربر اختصاص داده نشده است.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    } else if (error.response && error.response.status === 403) {
                        toast.warning("شما اجازه این عملیات را ندارید.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    } else {
                        toast.error("خطایی رخ داد. لطفاً دوباره تلاش کنید.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    }
                })
                .finally(() => {
                    this.removeLoading[courseId] = false;
                });
        },
    },
    mounted() {
        this.getData();
    }
};
</script>
