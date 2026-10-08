<template>
    <AdminMasterPage>
        
        <template #breadcrumb-actions>
                    <button @click="fetchData"
                        class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"><span
                            class="block group-active:[transform:translate3d(0,1px,0)]">
                            <span class="flex items-center">
                                بروزرسانی داده‌ها

                                <svg class="w-5 h-5 rtl:ms-1 -mt-0.5" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24" />
                                        <path
                                            d="M12,8 L8,8 C5.790861,8 4,9.790861 4,12 L4,13 C4,14.6568542 5.34314575,16 7,16 L7,18 C4.23857625,18 2,15.7614237 2,13 L2,12 C2,8.6862915 4.6862915,6 8,6 L12,6 L12,4.72799742 C12,4.62015048 12.0348702,4.51519416 12.0994077,4.42878885 C12.264656,4.2075478 12.5779675,4.16215674 12.7992086,4.32740507 L15.656242,6.46136716 C15.6951359,6.49041758 15.7295917,6.52497737 15.7585249,6.56395854 C15.9231063,6.78569617 15.876772,7.09886961 15.6550344,7.263451 L12.798001,9.3840407 C12.7118152,9.44801079 12.607332,9.48254921 12.5,9.48254921 C12.2238576,9.48254921 12,9.25869158 12,8.98254921 L12,8 Z"
                                            fill="currentColor" />
                                        <path
                                            d="M12.0583175,16 L16,16 C18.209139,16 20,14.209139 20,12 L20,11 C20,9.34314575 18.6568542,8 17,8 L17,6 C19.7614237,6 22,8.23857625 22,11 L22,12 C22,15.3137085 19.3137085,18 16,18 L12.0583175,18 L12.0583175,18.9825492 C12.0583175,19.2586916 11.8344599,19.4825492 11.5583175,19.4825492 C11.4509855,19.4825492 11.3465023,19.4480108 11.2603165,19.3840407 L8.40328311,17.263451 C8.18154548,17.0988696 8.13521119,16.7856962 8.29979258,16.5639585 C8.32872576,16.5249774 8.36318164,16.4904176 8.40207551,16.4613672 L11.2591089,14.3274051 C11.48035,14.1621567 11.7936615,14.2075478 11.9589099,14.4287888 C12.0234473,14.5151942 12.0583175,14.6201505 12.0583175,14.7279974 L12.0583175,16 Z"
                                            fill="currentColor" opacity="0.3" />
                                    </g>
                                </svg>
                            </span>
                        </span></button>
        </template>
        <div class="min-w-0">
            <div class="gap-y-2 flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div class="">
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="simple-search" v-model="searchQuery" @input="debounceSearch"
                            class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 p-2.5  dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white "
                            placeholder="جستجو..." required />
                    </div>
                </div>
                <div class="flex flex-wrap items-end gap-1 rtl:space-x-reverse">
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">کاربر:</div>
                        <input type="text" v-model="usernameFilter" @input="debounceUsernameSearch"
                            placeholder="نام کاربری..."
                            class="w-full px-2 py-1 h-8 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-none" />
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1"> نوع پروژه:</div>
                        <select v-model="selectedType" @change="selectType(selectedType)"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option value="all">همه</option>
                            <option value="website">سایت</option>
                            <option value="app">اپلیکیشن</option>
                            <option value="websiteAndApp">سایت و اپ</option>
                        </select>
                    </div>
                    <div class="w-max">
                        <div class="text-xs font-light text-gray-400 px-1 mb-1">مرتب‌سازی:</div>
                        <select v-model="selectedSort" @change.prevent="selectSort(selectedSort)"
                            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                            <option value="newest">جدیدترین</option>
                            <option value="oldest">قدیمی‌ترین</option>
                            <option value="price_min">حداقل قیمت</option>
                            <option value="price_max">حداکثر قیمت</option>
                        </select>
                    </div>
                    <div class="inline-flex">
                        <button @click.prevent="resetFilters"
                            class="flex items-center justify-center h-8 w-8 bg-rose-400/20 hover:bg-opacity-90 rounded-lg focus:ring-1 ring-rose-500 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800">
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
                <AdminBulkActionBar :count="selectedIds.length">
                    <button type="button" @click="openBulkDeleteModal"
                        class="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50">
                        حذف
                    </button>
                    <button type="button" @click="selectedIds = []"
                        class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                        لغو انتخاب
                    </button>
                </AdminBulkActionBar>
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 w-8">
                                    <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                </th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">کاربر</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">عنوان</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">نوع</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">ددلاین (روز)</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">بازه قیمت(تومان)</th>
                                <th class="px-1 py-3 whitespace-nowrap text-start">تاریخ</th>
                                <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="(item, index) in items" :key="index"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="px-1 py-3" @click.stop>
                                    <AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="flex items-center">
                                        <div
                                            class="flex-shrink-0 w-9 h-9 bg-gray-100 dark:bg-opacity-10 rounded-lg border-2 border-gray-200 border-opacity-30 dark:border-opacity-10 overflow-hidden">
                                            <img onerror="this.style.display='none'" v-if="item.user.profile_pic"
                                                :src="item.user.profile_pic" alt="" class="w-full h-full object-cover">
                                            <div v-else class="w-full h-full flex items-center justify-center">
                                                <span class="text-amber-400 text-sm font-medium">{{
                                                    item.user.first_name?.charAt(0) }}</span>
                                            </div>
                                        </div>
                                        <div class="ms-2">
                                            <div
                                                class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {{ item.user?.first_name }} {{ item.user?.last_name }}</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">@{{
                                                item.user?.username }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                        {{ item.title }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                        {{ mapType(item.type) }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                        {{ item.deadline }}</div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-semibold text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1 flex items-center">
                                        <span class="flex items-center gap-1">
                                            {{ formatCurrency(item.min_price) }}
                                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-50" viewBox="0 0 14 16"
                                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1.54253 6.51526C1.96399 6.51526 2.26592 6.41776 2.44834 6.22276C2.63076 6.03405 2.73769 5.80131 2.76915 5.52454H2.32568C1.99858 5.52454 1.73124 5.48994 1.52366 5.42075C1.31608 5.35155 1.15253 5.24776 1.03302 5.10938C0.913503 4.97099 0.828584 4.8043 0.778261 4.6093C0.734229 4.40801 0.712213 4.17841 0.712213 3.92051C0.712213 3.67518 0.74681 3.44244 0.816003 3.22228C0.885197 2.99583 0.985842 2.80083 1.11794 2.63728C1.25633 2.47373 1.42616 2.34478 1.62745 2.25043C1.83503 2.14978 2.07407 2.09946 2.34455 2.09946C2.55842 2.09946 2.75971 2.13406 2.94842 2.20325C3.14342 2.27244 3.31326 2.38252 3.45794 2.53349C3.60261 2.68446 3.71584 2.8826 3.79761 3.12793C3.88568 3.37325 3.92971 3.67204 3.92971 4.0243V4.23188H4.60906C4.74745 4.23188 4.81664 4.43946 4.81664 4.85462C4.81664 5.30123 4.74745 5.52454 4.60906 5.52454H3.92027C3.9014 5.83276 3.83535 6.12526 3.72213 6.40203C3.6089 6.67881 3.45164 6.92099 3.25035 7.12857C3.05535 7.33615 2.81632 7.49969 2.53326 7.61921C2.25019 7.74502 1.93568 7.80792 1.58971 7.80792H0.665036L0.608423 6.51526H1.54253ZM1.85391 3.82615C1.85391 3.97712 1.88536 4.08405 1.94826 4.14696C2.01745 4.20357 2.14326 4.23188 2.32568 4.23188H2.78802V3.96768C2.78802 3.72865 2.74713 3.5651 2.66536 3.47704C2.58987 3.38897 2.47036 3.34494 2.30681 3.34494C2.00487 3.34494 1.85391 3.50535 1.85391 3.82615ZM6.16378 4.23188C6.24555 4.23188 6.29902 4.2822 6.32418 4.38284C6.35563 4.48349 6.37136 4.64075 6.37136 4.85462C6.37136 5.08736 6.35563 5.2572 6.32418 5.36413C6.29902 5.47107 6.24555 5.52454 6.16378 5.52454H4.60692C4.52515 5.52454 4.47168 5.47421 4.44652 5.37357C4.41507 5.26663 4.39934 5.10938 4.39934 4.9018C4.39934 4.66276 4.41507 4.49292 4.44652 4.39228C4.47168 4.28534 4.52515 4.23188 4.60692 4.23188H6.16378ZM7.721 4.23188C7.80277 4.23188 7.85624 4.2822 7.8814 4.38284C7.91285 4.48349 7.92858 4.64075 7.92858 4.85462C7.92858 5.08736 7.91285 5.2572 7.8814 5.36413C7.85624 5.47107 7.80277 5.52454 7.721 5.52454H6.16415C6.08237 5.52454 6.0289 5.47421 6.00374 5.37357C5.97229 5.26663 5.95657 5.10938 5.95657 4.9018C5.95657 4.66276 5.97229 4.49292 6.00374 4.39228C6.0289 4.28534 6.08237 4.23188 6.16415 4.23188H7.721ZM9.27822 4.23188C9.35999 4.23188 9.41346 4.2822 9.43862 4.38284C9.47007 4.48349 9.4858 4.64075 9.4858 4.85462C9.4858 5.08736 9.47007 5.2572 9.43862 5.36413C9.41346 5.47107 9.35999 5.52454 9.27822 5.52454H7.72137C7.63959 5.52454 7.58613 5.47421 7.56096 5.37357C7.52951 5.26663 7.51379 5.10938 7.51379 4.9018C7.51379 4.66276 7.52951 4.49292 7.56096 4.39228C7.58613 4.28534 7.63959 4.23188 7.72137 4.23188H9.27822ZM10.8354 4.23188C10.9172 4.23188 10.9707 4.2822 10.9958 4.38284C11.0273 4.48349 11.043 4.64075 11.043 4.85462C11.043 5.08736 11.0273 5.2572 10.9958 5.36413C10.9707 5.47107 10.9172 5.52454 10.8354 5.52454H9.27859C9.19681 5.52454 9.14335 5.47421 9.11819 5.37357C9.08673 5.26663 9.07101 5.10938 9.07101 4.9018C9.07101 4.66276 9.08673 4.49292 9.11819 4.39228C9.14335 4.28534 9.19681 4.23188 9.27859 4.23188H10.8354ZM11.7227 4.23188C11.9052 4.23188 12.0341 4.19099 12.1096 4.10922C12.1914 4.02115 12.2323 3.88591 12.2323 3.70349V2.7222H13.4306V3.80728C13.4306 4.3797 13.2922 4.81059 13.0154 5.09994C12.7449 5.383 12.3486 5.52454 11.8265 5.52454H10.8358C10.754 5.52454 10.7006 5.47421 10.6754 5.37357C10.644 5.26663 10.6282 5.10938 10.6282 4.9018C10.6282 4.66276 10.644 4.49292 10.6754 4.39228C10.7006 4.28534 10.754 4.23188 10.8358 4.23188H11.7227ZM13.4211 1.6843H12.2794V0.589785H13.4211V1.6843ZM11.9681 1.6843H10.8264V0.589785H11.9681V1.6843ZM6.62833 13.2603C6.62833 13.6252 6.57171 13.9617 6.45849 14.2699C6.35155 14.5845 6.1943 14.8549 5.98672 15.0814C5.77914 15.3078 5.52752 15.484 5.23188 15.6098C4.93623 15.7419 4.60599 15.8079 4.24115 15.8079H3.61841C2.9139 15.8079 2.36664 15.5909 1.97664 15.1569C1.58664 14.7228 1.39164 14.1284 1.39164 13.3736V11.6563H2.58051V13.317C2.58051 13.4994 2.59938 13.6629 2.63712 13.8076C2.67487 13.9586 2.73777 14.0844 2.82583 14.185C2.92019 14.292 3.04285 14.3737 3.19382 14.4303C3.35107 14.487 3.54607 14.5153 3.77882 14.5153H4.19398C4.4393 14.5153 4.64059 14.4807 4.79785 14.4115C4.96139 14.3486 5.09035 14.2574 5.1847 14.1378C5.27906 14.0246 5.3451 13.8925 5.38285 13.7416C5.42059 13.5906 5.43946 13.4302 5.43946 13.2603V10.7222H6.62833V13.2603ZM4.44873 10.6184H3.20325V9.47672H4.44873V10.6184ZM9.01941 13.5245C8.83699 13.5245 8.66401 13.5025 8.50046 13.4585C8.33691 13.4082 8.19223 13.3264 8.06643 13.2132C7.94691 13.0999 7.84941 12.9521 7.77393 12.7697C7.70473 12.581 7.67014 12.3482 7.67014 12.0715V7.67454H8.86844V11.7601C8.86844 12.0746 9.00683 12.2319 9.2836 12.2319H9.53836C9.67675 12.2319 9.74594 12.4395 9.74594 12.8546C9.74594 13.3012 9.67675 13.5245 9.53836 13.5245H9.01941ZM9.58377 12.2319C9.77248 12.2319 9.92344 12.2004 10.0367 12.1375C10.1499 12.0683 10.2065 11.9425 10.2065 11.7601V11.6563C10.2065 11.411 10.2443 11.1845 10.3197 10.977C10.3952 10.7631 10.5022 10.5807 10.6405 10.4297C10.7789 10.2787 10.9488 10.1592 11.1501 10.0712C11.3513 9.98309 11.5747 9.93906 11.82 9.93906C12.0779 9.93906 12.3075 9.98309 12.5088 10.0712C12.7101 10.1592 12.8767 10.2819 13.0088 10.4391C13.1472 10.5901 13.251 10.7757 13.3202 10.9958C13.3957 11.2097 13.4334 11.4456 13.4334 11.7035C13.4334 12.2822 13.2856 12.732 12.99 13.0528C12.7006 13.3673 12.3106 13.5245 11.82 13.5245C11.5747 13.5245 11.3356 13.4742 11.1029 13.3736C10.8764 13.2729 10.7097 13.1314 10.6028 12.949C10.4833 13.1628 10.3292 13.3138 10.1405 13.4019C9.95175 13.4836 9.76619 13.5245 9.58377 13.5245H9.53659C9.45482 13.5245 9.40135 13.4742 9.37619 13.3736C9.34474 13.2666 9.32901 13.1094 9.32901 12.9018C9.32901 12.6628 9.34474 12.4929 9.37619 12.3923C9.40135 12.2853 9.45482 12.2319 9.53659 12.2319H9.58377ZM12.2823 11.7601C12.2823 11.628 12.2509 11.5085 12.188 11.4016C12.1251 11.2946 12.0024 11.2412 11.82 11.2412C11.6376 11.2412 11.5149 11.2946 11.452 11.4016C11.3891 11.5085 11.3576 11.628 11.3576 11.7601C11.3576 12.0746 11.5117 12.2319 11.82 12.2319C12.1282 12.2319 12.2823 12.0746 12.2823 11.7601Z"
                                                    fill="currentColor" opacity="0.6"></path>
                                            </svg>
                                        </span>
                                        &nbsp;
                                        -
                                        &nbsp;
                                        <span class="flex items-center gap-1">
                                            {{ formatCurrency(item.max_price) }}
                                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-50" viewBox="0 0 14 16"
                                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1.54253 6.51526C1.96399 6.51526 2.26592 6.41776 2.44834 6.22276C2.63076 6.03405 2.73769 5.80131 2.76915 5.52454H2.32568C1.99858 5.52454 1.73124 5.48994 1.52366 5.42075C1.31608 5.35155 1.15253 5.24776 1.03302 5.10938C0.913503 4.97099 0.828584 4.8043 0.778261 4.6093C0.734229 4.40801 0.712213 4.17841 0.712213 3.92051C0.712213 3.67518 0.74681 3.44244 0.816003 3.22228C0.885197 2.99583 0.985842 2.80083 1.11794 2.63728C1.25633 2.47373 1.42616 2.34478 1.62745 2.25043C1.83503 2.14978 2.07407 2.09946 2.34455 2.09946C2.55842 2.09946 2.75971 2.13406 2.94842 2.20325C3.14342 2.27244 3.31326 2.38252 3.45794 2.53349C3.60261 2.68446 3.71584 2.8826 3.79761 3.12793C3.88568 3.37325 3.92971 3.67204 3.92971 4.0243V4.23188H4.60906C4.74745 4.23188 4.81664 4.43946 4.81664 4.85462C4.81664 5.30123 4.74745 5.52454 4.60906 5.52454H3.92027C3.9014 5.83276 3.83535 6.12526 3.72213 6.40203C3.6089 6.67881 3.45164 6.92099 3.25035 7.12857C3.05535 7.33615 2.81632 7.49969 2.53326 7.61921C2.25019 7.74502 1.93568 7.80792 1.58971 7.80792H0.665036L0.608423 6.51526H1.54253ZM1.85391 3.82615C1.85391 3.97712 1.88536 4.08405 1.94826 4.14696C2.01745 4.20357 2.14326 4.23188 2.32568 4.23188H2.78802V3.96768C2.78802 3.72865 2.74713 3.5651 2.66536 3.47704C2.58987 3.38897 2.47036 3.34494 2.30681 3.34494C2.00487 3.34494 1.85391 3.50535 1.85391 3.82615ZM6.16378 4.23188C6.24555 4.23188 6.29902 4.2822 6.32418 4.38284C6.35563 4.48349 6.37136 4.64075 6.37136 4.85462C6.37136 5.08736 6.35563 5.2572 6.32418 5.36413C6.29902 5.47107 6.24555 5.52454 6.16378 5.52454H4.60692C4.52515 5.52454 4.47168 5.47421 4.44652 5.37357C4.41507 5.26663 4.39934 5.10938 4.39934 4.9018C4.39934 4.66276 4.41507 4.49292 4.44652 4.39228C4.47168 4.28534 4.52515 4.23188 4.60692 4.23188H6.16378ZM7.721 4.23188C7.80277 4.23188 7.85624 4.2822 7.8814 4.38284C7.91285 4.48349 7.92858 4.64075 7.92858 4.85462C7.92858 5.08736 7.91285 5.2572 7.8814 5.36413C7.85624 5.47107 7.80277 5.52454 7.721 5.52454H6.16415C6.08237 5.52454 6.0289 5.47421 6.00374 5.37357C5.97229 5.26663 5.95657 5.10938 5.95657 4.9018C5.95657 4.66276 5.97229 4.49292 6.00374 4.39228C6.0289 4.28534 6.08237 4.23188 6.16415 4.23188H7.721ZM9.27822 4.23188C9.35999 4.23188 9.41346 4.2822 9.43862 4.38284C9.47007 4.48349 9.4858 4.64075 9.4858 4.85462C9.4858 5.08736 9.47007 5.2572 9.43862 5.36413C9.41346 5.47107 9.35999 5.52454 9.27822 5.52454H7.72137C7.63959 5.52454 7.58613 5.47421 7.56096 5.37357C7.52951 5.26663 7.51379 5.10938 7.51379 4.9018C7.51379 4.66276 7.52951 4.49292 7.56096 4.39228C7.58613 4.28534 7.63959 4.23188 7.72137 4.23188H9.27822ZM10.8354 4.23188C10.9172 4.23188 10.9707 4.2822 10.9958 4.38284C11.0273 4.48349 11.043 4.64075 11.043 4.85462C11.043 5.08736 11.0273 5.2572 10.9958 5.36413C10.9707 5.47107 10.9172 5.52454 10.8354 5.52454H9.27859C9.19681 5.52454 9.14335 5.47421 9.11819 5.37357C9.08673 5.26663 9.07101 5.10938 9.07101 4.9018C9.07101 4.66276 9.08673 4.49292 9.11819 4.39228C9.14335 4.28534 9.19681 4.23188 9.27859 4.23188H10.8354ZM11.7227 4.23188C11.9052 4.23188 12.0341 4.19099 12.1096 4.10922C12.1914 4.02115 12.2323 3.88591 12.2323 3.70349V2.7222H13.4306V3.80728C13.4306 4.3797 13.2922 4.81059 13.0154 5.09994C12.7449 5.383 12.3486 5.52454 11.8265 5.52454H10.8358C10.754 5.52454 10.7006 5.47421 10.6754 5.37357C10.644 5.26663 10.6282 5.10938 10.6282 4.9018C10.6282 4.66276 10.644 4.49292 10.6754 4.39228C10.7006 4.28534 10.754 4.23188 10.8358 4.23188H11.7227ZM13.4211 1.6843H12.2794V0.589785H13.4211V1.6843ZM11.9681 1.6843H10.8264V0.589785H11.9681V1.6843ZM6.62833 13.2603C6.62833 13.6252 6.57171 13.9617 6.45849 14.2699C6.35155 14.5845 6.1943 14.8549 5.98672 15.0814C5.77914 15.3078 5.52752 15.484 5.23188 15.6098C4.93623 15.7419 4.60599 15.8079 4.24115 15.8079H3.61841C2.9139 15.8079 2.36664 15.5909 1.97664 15.1569C1.58664 14.7228 1.39164 14.1284 1.39164 13.3736V11.6563H2.58051V13.317C2.58051 13.4994 2.59938 13.6629 2.63712 13.8076C2.67487 13.9586 2.73777 14.0844 2.82583 14.185C2.92019 14.292 3.04285 14.3737 3.19382 14.4303C3.35107 14.487 3.54607 14.5153 3.77882 14.5153H4.19398C4.4393 14.5153 4.64059 14.4807 4.79785 14.4115C4.96139 14.3486 5.09035 14.2574 5.1847 14.1378C5.27906 14.0246 5.3451 13.8925 5.38285 13.7416C5.42059 13.5906 5.43946 13.4302 5.43946 13.2603V10.7222H6.62833V13.2603ZM4.44873 10.6184H3.20325V9.47672H4.44873V10.6184ZM9.01941 13.5245C8.83699 13.5245 8.66401 13.5025 8.50046 13.4585C8.33691 13.4082 8.19223 13.3264 8.06643 13.2132C7.94691 13.0999 7.84941 12.9521 7.77393 12.7697C7.70473 12.581 7.67014 12.3482 7.67014 12.0715V7.67454H8.86844V11.7601C8.86844 12.0746 9.00683 12.2319 9.2836 12.2319H9.53836C9.67675 12.2319 9.74594 12.4395 9.74594 12.8546C9.74594 13.3012 9.67675 13.5245 9.53836 13.5245H9.01941ZM9.58377 12.2319C9.77248 12.2319 9.92344 12.2004 10.0367 12.1375C10.1499 12.0683 10.2065 11.9425 10.2065 11.7601V11.6563C10.2065 11.411 10.2443 11.1845 10.3197 10.977C10.3952 10.7631 10.5022 10.5807 10.6405 10.4297C10.7789 10.2787 10.9488 10.1592 11.1501 10.0712C11.3513 9.98309 11.5747 9.93906 11.82 9.93906C12.0779 9.93906 12.3075 9.98309 12.5088 10.0712C12.7101 10.1592 12.8767 10.2819 13.0088 10.4391C13.1472 10.5901 13.251 10.7757 13.3202 10.9958C13.3957 11.2097 13.4334 11.4456 13.4334 11.7035C13.4334 12.2822 13.2856 12.732 12.99 13.0528C12.7006 13.3673 12.3106 13.5245 11.82 13.5245C11.5747 13.5245 11.3356 13.4742 11.1029 13.3736C10.8764 13.2729 10.7097 13.1314 10.6028 12.949C10.4833 13.1628 10.3292 13.3138 10.1405 13.4019C9.95175 13.4836 9.76619 13.5245 9.58377 13.5245H9.53659C9.45482 13.5245 9.40135 13.4742 9.37619 13.3736C9.34474 13.2666 9.32901 13.1094 9.32901 12.9018C9.32901 12.6628 9.34474 12.4929 9.37619 12.3923C9.40135 12.2853 9.45482 12.2319 9.53659 12.2319H9.58377ZM12.2823 11.7601C12.2823 11.628 12.2509 11.5085 12.188 11.4016C12.1251 11.2946 12.0024 11.2412 11.82 11.2412C11.6376 11.2412 11.5149 11.2946 11.452 11.4016C11.3891 11.5085 11.3576 11.628 11.3576 11.7601C11.3576 12.0746 11.5117 12.2319 11.82 12.2319C12.1282 12.2319 12.2823 12.0746 12.2823 11.7601Z"
                                                    fill="currentColor" opacity="0.6"></path>
                                            </svg>
                                        </span>
                                    </div>
                                </td>
                                <td class="px-1 py-3 whitespace-nowrap text-start">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg line-clamp-1">
                                        {{ new Date(item.created_at).toLocaleDateString('fa-IR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: '2-digit'
                                        }) }} &nbsp;&nbsp; {{ new Date(item.created_at).toLocaleTimeString('fa-IR', {
                                            hour: '2-digit', hour12: true,
                                            minute: '2-digit',
                                            second: '2-digit'
                                        }).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ') }}</div>
                                </td>
                                <td class="relative px-1 py-3 whitespace-nowrap text-start">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                        <Popover class="group  flex items-center justify-center">
                                            <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                            <PopoverButton
                                                class="text-gray-900 dark:text-white me-2 relative group-focus-within:z-30 focus:outline-none flex items-center justify-center">
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
                                                    class="text-start flex flex-col z-30 end-10 absolute p-2 bg-white rounded-lg shadow w-max min-w-[7rem] dark:bg-gray-900 dark:divide-gray-800">
                                                    <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                        <li>
                                                            <button type="button" @click="viewDetails(item.id)"
                                                                class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">جزئیات</button>
                                                        </li>
                                                        <li>
                                                            <button type="button" @click="openDeleteModal(item.id)"
                                                                class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">حذف</button>
                                                        </li>
                                                    </ul>
                                                </PopoverPanel>
                                            </transition>
                                        </Popover>
                                    </div>
                                </td>
                            </tr>
                            <tr class="h-24"></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="flex lg:flex-row flex-col items-center justify-between gap-4 -mt-20">
                <div class="">
                    <PaginationComponent v-if="pagination && pagination.last_page > 1" dir="ltr"
                        :pagination="pagination" @updatePage="updatePage" />
                </div>

                <div class="">
                    <select :value="perPage" @change="selectPerpage(parseInt($event.target.value))"
                        class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                        <option v-for="per in perPages" :key="per" :value="per">
                            {{ per }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Details Modal -->
            <BottomSheetDrawer v-model="showDetailsModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[42rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div v-if="detailsLoading"
                    class="py-8 text-gray-600 dark:text-gray-100 text-sm font-semibold text-center">در حال بارگذاری...
                </div>
                <div v-else-if="selectedProject" class="">
                    <div class="mb-6">
                        <div class="rounded-md border border-gray-100 dark:border-opacity-10 p-2">
                            <h4
                                class="font-anjoman text-sm font-semibold text-gray-900 dark:text-white flex items-center mb-2">
                                <svg class="w-5 h-5 me-1" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24" />
                                        <circle fill="currentColor" opacity="0.3" cx="12" cy="12" r="10" />
                                        <rect fill="currentColor" x="11" y="10" width="2" height="7" rx="1" />
                                        <rect fill="currentColor" x="11" y="7" width="2" height="2" rx="1" />
                                    </g>
                                </svg>
                                اطلاعات پروژه
                            </h4>
                            <hr class="border-t border-gray-100 dark:border-opacity-10 m-2" />
                            <div class="">
                                <table class="w-full border-spacing-0.5 border-separate">
                                    <tbody class="text-xs whitespace-nowrap">
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                عنوان</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ selectedProject.title }}</td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                کاربر</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ selectedProject.user?.first_name }} {{
                                                selectedProject.user?.last_name }} (@{{ selectedProject.user?.username
                                                }})</td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                نوع</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ mapType(selectedProject.type) }}</td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                ددلاین</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ selectedProject.deadline }} روز</td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                بازه قیمت</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                <span class="flex items-center">
                                                    <span class="flex items-center gap-1">
                                                        {{ formatCurrency(selectedProject.min_price) }}
                                                        <svg class="w-3 h-3 text-gray-800 dark:text-gray-50"
                                                            viewBox="0 0 14 16" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M1.54253 6.51526C1.96399 6.51526 2.26592 6.41776 2.44834 6.22276C2.63076 6.03405 2.73769 5.80131 2.76915 5.52454H2.32568C1.99858 5.52454 1.73124 5.48994 1.52366 5.42075C1.31608 5.35155 1.15253 5.24776 1.03302 5.10938C0.913503 4.97099 0.828584 4.8043 0.778261 4.6093C0.734229 4.40801 0.712213 4.17841 0.712213 3.92051C0.712213 3.67518 0.74681 3.44244 0.816003 3.22228C0.885197 2.99583 0.985842 2.80083 1.11794 2.63728C1.25633 2.47373 1.42616 2.34478 1.62745 2.25043C1.83503 2.14978 2.07407 2.09946 2.34455 2.09946C2.55842 2.09946 2.75971 2.13406 2.94842 2.20325C3.14342 2.27244 3.31326 2.38252 3.45794 2.53349C3.60261 2.68446 3.71584 2.8826 3.79761 3.12793C3.88568 3.37325 3.92971 3.67204 3.92971 4.0243V4.23188H4.60906C4.74745 4.23188 4.81664 4.43946 4.81664 4.85462C4.81664 5.30123 4.74745 5.52454 4.60906 5.52454H3.92027C3.9014 5.83276 3.83535 6.12526 3.72213 6.40203C3.6089 6.67881 3.45164 6.92099 3.25035 7.12857C3.05535 7.33615 2.81632 7.49969 2.53326 7.61921C2.25019 7.74502 1.93568 7.80792 1.58971 7.80792H0.665036L0.608423 6.51526H1.54253ZM1.85391 3.82615C1.85391 3.97712 1.88536 4.08405 1.94826 4.14696C2.01745 4.20357 2.14326 4.23188 2.32568 4.23188H2.78802V3.96768C2.78802 3.72865 2.74713 3.5651 2.66536 3.47704C2.58987 3.38897 2.47036 3.34494 2.30681 3.34494C2.00487 3.34494 1.85391 3.50535 1.85391 3.82615ZM6.16378 4.23188C6.24555 4.23188 6.29902 4.2822 6.32418 4.38284C6.35563 4.48349 6.37136 4.64075 6.37136 4.85462C6.37136 5.08736 6.35563 5.2572 6.32418 5.36413C6.29902 5.47107 6.24555 5.52454 6.16378 5.52454H4.60692C4.52515 5.52454 4.47168 5.47421 4.44652 5.37357C4.41507 5.26663 4.39934 5.10938 4.39934 4.9018C4.39934 4.66276 4.41507 4.49292 4.44652 4.39228C4.47168 4.28534 4.52515 4.23188 4.60692 4.23188H6.16378ZM7.721 4.23188C7.80277 4.23188 7.85624 4.2822 7.8814 4.38284C7.91285 4.48349 7.92858 4.64075 7.92858 4.85462C7.92858 5.08736 7.91285 5.2572 7.8814 5.36413C7.85624 5.47107 7.80277 5.52454 7.721 5.52454H6.16415C6.08237 5.52454 6.0289 5.47421 6.00374 5.37357C5.97229 5.26663 5.95657 5.10938 5.95657 4.9018C5.95657 4.66276 5.97229 4.49292 6.00374 4.39228C6.0289 4.28534 6.08237 4.23188 6.16415 4.23188H7.721ZM9.27822 4.23188C9.35999 4.23188 9.41346 4.2822 9.43862 4.38284C9.47007 4.48349 9.4858 4.64075 9.4858 4.85462C9.4858 5.08736 9.47007 5.2572 9.43862 5.36413C9.41346 5.47107 9.35999 5.52454 9.27822 5.52454H7.72137C7.63959 5.52454 7.58613 5.47421 7.56096 5.37357C7.52951 5.26663 7.51379 5.10938 7.51379 4.9018C7.51379 4.66276 7.52951 4.49292 7.56096 4.39228C7.58613 4.28534 7.63959 4.23188 7.72137 4.23188H9.27822ZM10.8354 4.23188C10.9172 4.23188 10.9707 4.2822 10.9958 4.38284C11.0273 4.48349 11.043 4.64075 11.043 4.85462C11.043 5.08736 11.0273 5.2572 10.9958 5.36413C10.9707 5.47107 10.9172 5.52454 10.8354 5.52454H9.27859C9.19681 5.52454 9.14335 5.47421 9.11819 5.37357C9.08673 5.26663 9.07101 5.10938 9.07101 4.9018C9.07101 4.66276 9.08673 4.49292 9.11819 4.39228C9.14335 4.28534 9.19681 4.23188 9.27859 4.23188H10.8354ZM11.7227 4.23188C11.9052 4.23188 12.0341 4.19099 12.1096 4.10922C12.1914 4.02115 12.2323 3.88591 12.2323 3.70349V2.7222H13.4306V3.80728C13.4306 4.3797 13.2922 4.81059 13.0154 5.09994C12.7449 5.383 12.3486 5.52454 11.8265 5.52454H10.8358C10.754 5.52454 10.7006 5.47421 10.6754 5.37357C10.644 5.26663 10.6282 5.10938 10.6282 4.9018C10.6282 4.66276 10.644 4.49292 10.6754 4.39228C10.7006 4.28534 10.754 4.23188 10.8358 4.23188H11.7227ZM13.4211 1.6843H12.2794V0.589785H13.4211V1.6843ZM11.9681 1.6843H10.8264V0.589785H11.9681V1.6843ZM6.62833 13.2603C6.62833 13.6252 6.57171 13.9617 6.45849 14.2699C6.35155 14.5845 6.1943 14.8549 5.98672 15.0814C5.77914 15.3078 5.52752 15.484 5.23188 15.6098C4.93623 15.7419 4.60599 15.8079 4.24115 15.8079H3.61841C2.9139 15.8079 2.36664 15.5909 1.97664 15.1569C1.58664 14.7228 1.39164 14.1284 1.39164 13.3736V11.6563H2.58051V13.317C2.58051 13.4994 2.59938 13.6629 2.63712 13.8076C2.67487 13.9586 2.73777 14.0844 2.82583 14.185C2.92019 14.292 3.04285 14.3737 3.19382 14.4303C3.35107 14.487 3.54607 14.5153 3.77882 14.5153H4.19398C4.4393 14.5153 4.64059 14.4807 4.79785 14.4115C4.96139 14.3486 5.09035 14.2574 5.1847 14.1378C5.27906 14.0246 5.3451 13.8925 5.38285 13.7416C5.42059 13.5906 5.43946 13.4302 5.43946 13.2603V10.7222H6.62833V13.2603ZM4.44873 10.6184H3.20325V9.47672H4.44873V10.6184ZM9.01941 13.5245C8.83699 13.5245 8.66401 13.5025 8.50046 13.4585C8.33691 13.4082 8.19223 13.3264 8.06643 13.2132C7.94691 13.0999 7.84941 12.9521 7.77393 12.7697C7.70473 12.581 7.67014 12.3482 7.67014 12.0715V7.67454H8.86844V11.7601C8.86844 12.0746 9.00683 12.2319 9.2836 12.2319H9.53836C9.67675 12.2319 9.74594 12.4395 9.74594 12.8546C9.74594 13.3012 9.67675 13.5245 9.53836 13.5245H9.01941ZM9.58377 12.2319C9.77248 12.2319 9.92344 12.2004 10.0367 12.1375C10.1499 12.0683 10.2065 11.9425 10.2065 11.7601V11.6563C10.2065 11.411 10.2443 11.1845 10.3197 10.977C10.3952 10.7631 10.5022 10.5807 10.6405 10.4297C10.7789 10.2787 10.9488 10.1592 11.1501 10.0712C11.3513 9.98309 11.5747 9.93906 11.82 9.93906C12.0779 9.93906 12.3075 9.98309 12.5088 10.0712C12.7101 10.1592 12.8767 10.2819 13.0088 10.4391C13.1472 10.5901 13.251 10.7757 13.3202 10.9958C13.3957 11.2097 13.4334 11.4456 13.4334 11.7035C13.4334 12.2822 13.2856 12.732 12.99 13.0528C12.7006 13.3673 12.3106 13.5245 11.82 13.5245C11.5747 13.5245 11.3356 13.4742 11.1029 13.3736C10.8764 13.2729 10.7097 13.1314 10.6028 12.949C10.4833 13.1628 10.3292 13.3138 10.1405 13.4019C9.95175 13.4836 9.76619 13.5245 9.58377 13.5245H9.53659C9.45482 13.5245 9.40135 13.4742 9.37619 13.3736C9.34474 13.2666 9.32901 13.1094 9.32901 12.9018C9.32901 12.6628 9.34474 12.4929 9.37619 12.3923C9.40135 12.2853 9.45482 12.2319 9.53659 12.2319H9.58377ZM12.2823 11.7601C12.2823 11.628 12.2509 11.5085 12.188 11.4016C12.1251 11.2946 12.0024 11.2412 11.82 11.2412C11.6376 11.2412 11.5149 11.2946 11.452 11.4016C11.3891 11.5085 11.3576 11.628 11.3576 11.7601C11.3576 12.0746 11.5117 12.2319 11.82 12.2319C12.1282 12.2319 12.2823 12.0746 12.2823 11.7601Z"
                                                                fill="currentColor" opacity="0.6"></path>
                                                        </svg>
                                                    </span>
                                                    &nbsp;
                                                    -
                                                    &nbsp;
                                                    <span class="flex items-center gap-1">
                                                        {{ formatCurrency(selectedProject.max_price) }}
                                                        <svg class="w-3 h-3 text-gray-800 dark:text-gray-50"
                                                            viewBox="0 0 14 16" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M1.54253 6.51526C1.96399 6.51526 2.26592 6.41776 2.44834 6.22276C2.63076 6.03405 2.73769 5.80131 2.76915 5.52454H2.32568C1.99858 5.52454 1.73124 5.48994 1.52366 5.42075C1.31608 5.35155 1.15253 5.24776 1.03302 5.10938C0.913503 4.97099 0.828584 4.8043 0.778261 4.6093C0.734229 4.40801 0.712213 4.17841 0.712213 3.92051C0.712213 3.67518 0.74681 3.44244 0.816003 3.22228C0.885197 2.99583 0.985842 2.80083 1.11794 2.63728C1.25633 2.47373 1.42616 2.34478 1.62745 2.25043C1.83503 2.14978 2.07407 2.09946 2.34455 2.09946C2.55842 2.09946 2.75971 2.13406 2.94842 2.20325C3.14342 2.27244 3.31326 2.38252 3.45794 2.53349C3.60261 2.68446 3.71584 2.8826 3.79761 3.12793C3.88568 3.37325 3.92971 3.67204 3.92971 4.0243V4.23188H4.60906C4.74745 4.23188 4.81664 4.43946 4.81664 4.85462C4.81664 5.30123 4.74745 5.52454 4.60906 5.52454H3.92027C3.9014 5.83276 3.83535 6.12526 3.72213 6.40203C3.6089 6.67881 3.45164 6.92099 3.25035 7.12857C3.05535 7.33615 2.81632 7.49969 2.53326 7.61921C2.25019 7.74502 1.93568 7.80792 1.58971 7.80792H0.665036L0.608423 6.51526H1.54253ZM1.85391 3.82615C1.85391 3.97712 1.88536 4.08405 1.94826 4.14696C2.01745 4.20357 2.14326 4.23188 2.32568 4.23188H2.78802V3.96768C2.78802 3.72865 2.74713 3.5651 2.66536 3.47704C2.58987 3.38897 2.47036 3.34494 2.30681 3.34494C2.00487 3.34494 1.85391 3.50535 1.85391 3.82615ZM6.16378 4.23188C6.24555 4.23188 6.29902 4.2822 6.32418 4.38284C6.35563 4.48349 6.37136 4.64075 6.37136 4.85462C6.37136 5.08736 6.35563 5.2572 6.32418 5.36413C6.29902 5.47107 6.24555 5.52454 6.16378 5.52454H4.60692C4.52515 5.52454 4.47168 5.47421 4.44652 5.37357C4.41507 5.26663 4.39934 5.10938 4.39934 4.9018C4.39934 4.66276 4.41507 4.49292 4.44652 4.39228C4.47168 4.28534 4.52515 4.23188 4.60692 4.23188H6.16378ZM7.721 4.23188C7.80277 4.23188 7.85624 4.2822 7.8814 4.38284C7.91285 4.48349 7.92858 4.64075 7.92858 4.85462C7.92858 5.08736 7.91285 5.2572 7.8814 5.36413C7.85624 5.47107 7.80277 5.52454 7.721 5.52454H6.16415C6.08237 5.52454 6.0289 5.47421 6.00374 5.37357C5.97229 5.26663 5.95657 5.10938 5.95657 4.9018C5.95657 4.66276 5.97229 4.49292 6.00374 4.39228C6.0289 4.28534 6.08237 4.23188 6.16415 4.23188H7.721ZM9.27822 4.23188C9.35999 4.23188 9.41346 4.2822 9.43862 4.38284C9.47007 4.48349 9.4858 4.64075 9.4858 4.85462C9.4858 5.08736 9.47007 5.2572 9.43862 5.36413C9.41346 5.47107 9.35999 5.52454 9.27822 5.52454H7.72137C7.63959 5.52454 7.58613 5.47421 7.56096 5.37357C7.52951 5.26663 7.51379 5.10938 7.51379 4.9018C7.51379 4.66276 7.52951 4.49292 7.56096 4.39228C7.58613 4.28534 7.63959 4.23188 7.72137 4.23188H9.27822ZM10.8354 4.23188C10.9172 4.23188 10.9707 4.2822 10.9958 4.38284C11.0273 4.48349 11.043 4.64075 11.043 4.85462C11.043 5.08736 11.0273 5.2572 10.9958 5.36413C10.9707 5.47107 10.9172 5.52454 10.8354 5.52454H9.27859C9.19681 5.52454 9.14335 5.47421 9.11819 5.37357C9.08673 5.26663 9.07101 5.10938 9.07101 4.9018C9.07101 4.66276 9.08673 4.49292 9.11819 4.39228C9.14335 4.28534 9.19681 4.23188 9.27859 4.23188H10.8354ZM11.7227 4.23188C11.9052 4.23188 12.0341 4.19099 12.1096 4.10922C12.1914 4.02115 12.2323 3.88591 12.2323 3.70349V2.7222H13.4306V3.80728C13.4306 4.3797 13.2922 4.81059 13.0154 5.09994C12.7449 5.383 12.3486 5.52454 11.8265 5.52454H10.8358C10.754 5.52454 10.7006 5.47421 10.6754 5.37357C10.644 5.26663 10.6282 5.10938 10.6282 4.9018C10.6282 4.66276 10.644 4.49292 10.6754 4.39228C10.7006 4.28534 10.754 4.23188 10.8358 4.23188H11.7227ZM13.4211 1.6843H12.2794V0.589785H13.4211V1.6843ZM11.9681 1.6843H10.8264V0.589785H11.9681V1.6843ZM6.62833 13.2603C6.62833 13.6252 6.57171 13.9617 6.45849 14.2699C6.35155 14.5845 6.1943 14.8549 5.98672 15.0814C5.77914 15.3078 5.52752 15.484 5.23188 15.6098C4.93623 15.7419 4.60599 15.8079 4.24115 15.8079H3.61841C2.9139 15.8079 2.36664 15.5909 1.97664 15.1569C1.58664 14.7228 1.39164 14.1284 1.39164 13.3736V11.6563H2.58051V13.317C2.58051 13.4994 2.59938 13.6629 2.63712 13.8076C2.67487 13.9586 2.73777 14.0844 2.82583 14.185C2.92019 14.292 3.04285 14.3737 3.19382 14.4303C3.35107 14.487 3.54607 14.5153 3.77882 14.5153H4.19398C4.4393 14.5153 4.64059 14.4807 4.79785 14.4115C4.96139 14.3486 5.09035 14.2574 5.1847 14.1378C5.27906 14.0246 5.3451 13.8925 5.38285 13.7416C5.42059 13.5906 5.43946 13.4302 5.43946 13.2603V10.7222H6.62833V13.2603ZM4.44873 10.6184H3.20325V9.47672H4.44873V10.6184ZM9.01941 13.5245C8.83699 13.5245 8.66401 13.5025 8.50046 13.4585C8.33691 13.4082 8.19223 13.3264 8.06643 13.2132C7.94691 13.0999 7.84941 12.9521 7.77393 12.7697C7.70473 12.581 7.67014 12.3482 7.67014 12.0715V7.67454H8.86844V11.7601C8.86844 12.0746 9.00683 12.2319 9.2836 12.2319H9.53836C9.67675 12.2319 9.74594 12.4395 9.74594 12.8546C9.74594 13.3012 9.67675 13.5245 9.53836 13.5245H9.01941ZM9.58377 12.2319C9.77248 12.2319 9.92344 12.2004 10.0367 12.1375C10.1499 12.0683 10.2065 11.9425 10.2065 11.7601V11.6563C10.2065 11.411 10.2443 11.1845 10.3197 10.977C10.3952 10.7631 10.5022 10.5807 10.6405 10.4297C10.7789 10.2787 10.9488 10.1592 11.1501 10.0712C11.3513 9.98309 11.5747 9.93906 11.82 9.93906C12.0779 9.93906 12.3075 9.98309 12.5088 10.0712C12.7101 10.1592 12.8767 10.2819 13.0088 10.4391C13.1472 10.5901 13.251 10.7757 13.3202 10.9958C13.3957 11.2097 13.4334 11.4456 13.4334 11.7035C13.4334 12.2822 13.2856 12.732 12.99 13.0528C12.7006 13.3673 12.3106 13.5245 11.82 13.5245C11.5747 13.5245 11.3356 13.4742 11.1029 13.3736C10.8764 13.2729 10.7097 13.1314 10.6028 12.949C10.4833 13.1628 10.3292 13.3138 10.1405 13.4019C9.95175 13.4836 9.76619 13.5245 9.58377 13.5245H9.53659C9.45482 13.5245 9.40135 13.4742 9.37619 13.3736C9.34474 13.2666 9.32901 13.1094 9.32901 12.9018C9.32901 12.6628 9.34474 12.4929 9.37619 12.3923C9.40135 12.2853 9.45482 12.2319 9.53659 12.2319H9.58377ZM12.2823 11.7601C12.2823 11.628 12.2509 11.5085 12.188 11.4016C12.1251 11.2946 12.0024 11.2412 11.82 11.2412C11.6376 11.2412 11.5149 11.2946 11.452 11.4016C11.3891 11.5085 11.3576 11.628 11.3576 11.7601C11.3576 12.0746 11.5117 12.2319 11.82 12.2319C12.1282 12.2319 12.2823 12.0746 12.2823 11.7601Z"
                                                                fill="currentColor" opacity="0.6"></path>
                                                        </svg>
                                                    </span>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                تاریخ ثبت</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                {{ new Date(selectedProject.created_at).toLocaleDateString('fa-IR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: '2-digit'
                                                }) }} &nbsp;&nbsp; {{ new
                                                    Date(selectedProject.created_at).toLocaleTimeString('fa-IR', {
                                                        hour: '2-digit', hour12: true,
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    }).replace('بعدازظهر', 'ب.ظ').replace('قبل‌ازظهر', 'ق.ظ') }}
                                            </td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                نمونه کار/لینک</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                <a v-if="selectedProject.sample" :href="selectedProject.sample"
                                                    target="_blank"
                                                    class="text-blue-600 underline hover:no-underline">مشاهده</a>
                                                <span v-else>-</span>
                                            </td>
                                        </tr>
                                        <tr class="">
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 text-gray-500 dark:text-gray-300">
                                                فایل پیوست</td>
                                            <td
                                                class="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-2 font-semibold text-gray-800 dark:text-gray-50">
                                                <a v-if="selectedProject.attach_file"
                                                    :href="selectedProject.attach_file" target="_blank"
                                                    class="text-blue-600 underline hover:no-underline">دانلود</a>
                                                <span v-else>-</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <div class="rounded-md border border-gray-100 dark:border-opacity-10 p-2">
                            <h4
                                class="font-anjoman text-sm font-semibold text-gray-900 dark:text-white flex items-center mb-2">
                                <svg class="w-5 h-5 me-1" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24" />
                                        <circle fill="currentColor" opacity="0.3" cx="12" cy="12" r="10" />
                                        <rect fill="currentColor" x="11" y="10" width="2" height="7" rx="1" />
                                        <rect fill="currentColor" x="11" y="7" width="2" height="2" rx="1" />
                                    </g>
                                </svg>
                                توضیحات پروژه
                            </h4>
                            <hr class="border-t border-gray-100 dark:border-opacity-10 m-2" />
                            <div class="bg-gray-100/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 p-2 text-xs">
                                <MarkdownRenderer startClass="desc" :source="selectedProject.description" />
                            </div>
                        </div>
                    </div>
                </div>
            </BottomSheetDrawer>

            <!-- Delete Modal -->
            <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                <div class="bg-white dark:bg-gray-900 rounded-lg w-[95%] md:w-[480px] p-4">
                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-50 mb-2">حذف پروژه</div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                        {{ isBulkDelete ? `آیا از حذف ${selectedIds.length} پروژه مطمئن هستید؟` : 'آیا از حذف این پروژه مطمئن هستید؟' }}
                    </div>
                    <div class="flex items-center justify-end gap-2">
                        <button @click="closeDelete"
                            class="text-xs font-semibold px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-200">انصراف</button>
                        <button :disabled="deleteLoading" @click="confirmDelete"
                            class="text-xs font-semibold px-4 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50">حذف</button>
                    </div>
                </div>
            </div>
        </div>

        <LoadingComponent v-if="loading" class="" />
    </AdminMasterPage>

</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import axiosInstance from "@/store/axiosInstance";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";

export default {
    components: { AdminMasterPage, AdminBulkCheckbox, AdminBulkActionBar, Popover, PopoverButton, PopoverPanel, PopoverOverlay, LoadingComponent, PaginationComponent, BottomSheetDrawer, MarkdownRenderer, },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            items: [],
            ppagination: {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0
            },
            currentPage: 1,
            perPage: parseInt(urlParams.get('perPage')) || 10,
            perPages: [10, 20, 30, 50, 100],
            selectedType: urlParams.get('type') || 'all',
            selectedSort: urlParams.get('sort') || 'newest',
            searchQuery: urlParams.get('search') || '',
            searchTimeout: null,
            usernameFilter: "",
            usernameTimeout: null,
            loading: false,
            mounted: false,
            // details
            showDetailsModal: false,
            detailsLoading: false,
            selectedProject: null,
            // delete
            showDeleteModal: false,
            deleteLoading: false,
            deleteId: null,
            selectedIds: [],
            isBulkDelete: false,
        };
    },
    computed: {
        isAllSelected() {
            return this.items.length > 0 && this.selectedIds.length === this.items.length;
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.isAllSelected;
        },
    },
    created() {
        // this.initFromRoute();
        this.fetchData();
    },
    methods: {
        selectPerpage(per) {
            this.perPage = per;
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        selectSort(value) {
            this.selectedSort = value;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        selectType(value) {
            this.selectedType = value;
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        debounceSearch() {
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            this.searchTimeout = setTimeout(() => {
                this.currentPage = 1;
                this.updateUrlAndFetchData();
            }, 1000);
        },
        debounceUsernameSearch() {
            if (this.usernameTimeout) {
                clearTimeout(this.usernameTimeout);
            }
            this.usernameTimeout = setTimeout(() => {
                this.currentPage = 1;
                this.updateUrlAndFetchData();
            }, 1000);
        },
        mapType(type) {
            const map = { website: 'سایت', app: 'اپلیکیشن', websiteAndApp: 'سایت و اپ' };
            return map[type] || type;
        },
        formatCurrency(amount) {
            if (amount == null) return '-';
            const num = parseInt(amount, 10);
            return new Intl.NumberFormat('fa-IR').format(num);
        },
        // initFromRoute() {
        //     const query = this.$route.query;
        //     this.currentPage = parseInt(query.page || '1');
        //     this.perPage = parseInt(query.perPage || '10');
        //     this.selectedType = query.type || 'all';
        //     this.selectedSort = query.sort || 'newest';
        //     this.searchQuery = query.search || '';
        // },
        buildQuery() {
            const params = {
                page: this.currentPage,
                perPage: this.perPage,
                sort: this.selectedSort,
            };
            if (this.selectedType !== 'all') params.type = this.selectedType;
            if (this.searchQuery) params.search = this.searchQuery;
            if (this.usernameFilter) params.username = this.usernameFilter;
            return params;
        },
        async fetchData() {
            this.loading = true;
            try {
                const params = this.buildQuery();
                const res = await axiosInstance.post('/admin/projects', params);
                if (res.data.message === 'Success') {
                    this.items = res.data.projects;
                    this.pagination = res.data.pagination;
                }
            } catch (e) {
                console.error('Error fetching projects', e);
            } finally {
                this.loading = false;
                this.mounted = true;
            }
        },
        updateUrlAndFetchData() {
            const params = new URLSearchParams(window.location.search);

            params.forEach((value, key) => {
                if (!["type", "sort", "page", "search", "username"].includes(key)) {
                    // نگه داشتن
                }
            });

            if (this.selectedType && this.selectedType !== "all") {
                params.set("type", this.selectedType);
            } else {
                params.delete("type");
            }

            if (this.selectedSort && this.selectedSort !== "newest") {
                params.set("sort", this.selectedSort);
            } else {
                params.delete("sort");
            }

            if (this.currentPage !== 1) {
                params.set("page", this.currentPage);
            } else {
                params.delete("page");
            }

            if (this.searchQuery) {
                params.set("search", this.searchQuery);
            } else {
                params.delete("search");
            }

            if (this.usernameFilter) {
                params.set("username", this.usernameFilter);
            } else {
                params.delete("username");
            }

            const queryString = params.toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
            window.history.pushState(null, "", newUrl);

            this.fetchData();
        },
        updatePage(page) {
            this.currentPage = page;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        resetFilters() {
            this.selectedType = 'all';
            this.selectedSort = 'newest';
            this.searchQuery = '';
            this.usernameFilter = '';
            this.currentPage = 1;
            this.updateUrlAndFetchData();
        },
        async viewDetails(id) {
            this.showDetailsModal = true;
            this.detailsLoading = true;
            this.selectedProject = null;
            try {
                const res = await axiosInstance.get(`/admin/projects/${id}`);
                if (res.data.message === 'Success') {
                    this.selectedProject = res.data.project;
                }
            } catch (e) {
                console.error('Error loading project details', e);
            } finally {
                this.detailsLoading = false;
            }
        },
        closeDetails() {
            this.showDetailsModal = false;
            this.selectedProject = null;
        },
        toggleSelectAll() {
            if (this.isAllSelected) {
                this.selectedIds = [];
            } else {
                this.selectedIds = this.items.map((item) => item.id);
            }
        },
        openBulkDeleteModal() {
            if (!this.selectedIds.length) return;
            this.isBulkDelete = true;
            this.deleteId = null;
            this.showDeleteModal = true;
        },
        openDeleteModal(id) {
            this.isBulkDelete = false;
            this.deleteId = id;
            this.showDeleteModal = true;
        },
        closeDelete() {
            this.showDeleteModal = false;
            this.deleteId = null;
            this.isBulkDelete = false;
            this.deleteLoading = false;
        },
        async confirmDelete() {
            const ids = this.isBulkDelete ? [...this.selectedIds] : (this.deleteId ? [this.deleteId] : []);
            if (!ids.length) return;
            this.deleteLoading = true;
            try {
                for (const id of ids) {
                    await axiosInstance.delete(`/admin/projects/${id}`);
                }
                this.selectedIds = [];
                this.closeDelete();
                this.fetchData();
            } catch (e) {
                console.error('Error deleting project', e);
            } finally {
                this.deleteLoading = false;
            }
        },
    },
};
</script>

<style scoped></style>
