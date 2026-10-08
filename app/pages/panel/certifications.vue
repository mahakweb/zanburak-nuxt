<script setup>
definePageMeta({
  name: "panel-certifications",
  middleware: ['auth'],
})
</script>

<template>
    <PanelMasterPage>
        <div class="space-y-5">
            <div class="w-full">
                <div class="md:hidden">
                    <Listbox v-model="selectedFilter" v-slot="{ open }" as="div" class="w-full">
                        <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
                        <div class="mt-1 relative" :class="open ? ' z-20' : ''">
                            <ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''"
                                class="w-full flex justify-between items-center px-3 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-xl text-sm">
                                <div class="flex items-center">
                                    <span class="flex items-center me-2">
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z"
                                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                                stroke-linejoin="round"></path>
                                            <path opacity="0.4"
                                                d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833"
                                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                                stroke-linejoin="round"></path>
                                        </svg>
                                    </span>
                                    <span class="flex items-center line-clamp-1 font-semibold">{{ selectedFilter.title
                                        }}</span>
                                </div>
                                <div class="border-s border-current px-3 py-1.5">
                                    <svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''"
                                        viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor"
                                            stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round">
                                        </path>
                                    </svg>
                                </div>
                            </ListboxButton>
                            <ListboxOptions
                                class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-sm space-y-1 p-2 rounded-b-xl">
                                <ListboxOption v-for="(filter, index) in filters" :key="index"
                                    @click.prevent="selectFilter(filter)" :value="filter" :disabled="false"
                                    class="flex items-center px-2 py-3 rounded-lg cursor-pointer"
                                    :class="selectedFilter == filter ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-700 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:bg-opacity-50'">
                                    <span v-html="filter.icon"></span>
                                    <span class="ms-2 font-semibold">{{ filter.title }}</span>
                                </ListboxOption>
                            </ListboxOptions>
                        </div>
                    </Listbox>
                </div>
                <div class="">
                    <TabGroup>
                        <TabList
                            class="hidden md:inline-flex space-x-1 rtl:space-x-reverse rounded-xl bg-gray-100/80 dark:bg-gray-800/60 p-1">
                            <Tab v-for="(filter, index) in filters" :key="index" @click.prevent="selectFilter(filter)"
                                class="ring-0 outline-none">
                                <button :disabled="filter.slug == selectedFilter.slug"
                                    class="w-full flex items-center rounded-lg py-2 px-3 text-sm font-semibold leading-5 ring-0 outline-none transition-colors duration-200"
                                    :class="[
                                        filter.slug === selectedFilter.slug ? 'bg-white dark:bg-gray-900 shadow-sm text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                                    ]">
                                    <span class="me-2" v-html="filter.icon"></span>
                                    <span>{{ filter.title }}</span>
                                </button>
                            </Tab>
                        </TabList>
                        <TabPanels class="mt-4 md:mt-8">
                            <!-- <TabPanel class="rounded-xl bg-white dark:bg-gray-900 p-3 outline-none"> -->
                            <div v-if="filterLoading"
                                class="grid xl:grid-cols-4 lg:rid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                                <div v-for="i in 8" :key="i"
                                    class="w-full p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                                    <div class="animate-pulse w-full h-48 lg:h-36 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                                    <div class="animate-pulse my-3 h-3.5 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                    <div class="mb-5 space-y-3">
                                        <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                            <div class="animate-pulse w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                                            <div class="animate-pulse h-2.5 w-2/3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        </div>
                                        <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                            <div class="animate-pulse w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                                            <div class="animate-pulse h-2.5 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        </div>
                                    </div>
                                    <div class="items-center justify-center flex space-x-4 rtl:space-x-reverse">
                                        <div class="animate-pulse w-full h-10 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                                        <div class="animate-pulse w-full h-10 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                                    </div>
                                </div>
                            </div>
                            <div v-else id="data-list">
                                <div v-if="certificates && certificates.length > 0"
                                    class="grid xl:grid-cols-4 lg:rid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                                    <div v-for="(certificate, index) in certificates" :key="index"
                                        class="w-full p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                                        <div class="relative w-full h-48 lg:h-36 rounded-xl overflow-hidden">
                                            <div class="bg-gray-200/10 rounded-t-xl dark:bg-gray-600/10  py-2 px-3 absolute w-full flex items-center justify-between">
                                                <span
                                                    class="text-green-500 text-xs font-semibold flex items-center">
                                                    <i class="inline-flex w-1 h-1 bg-green-500 rounded-full me-1"></i>
                                                    {{ $t("panel.certifications.verified") }}
                                                </span>
                                                <svg class="end-2 w-5 h-5 text-amber-500" viewBox="0 0 24 24"
                                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M10 6H14C16.8284 6 18.2426 6 19.1213 6.87868C20 7.75736 20 9.17157 20 12V13.0557C20 15.4614 20 16.6642 19.4026 17.6308C18.8052 18.5974 17.7294 19.1353 15.5777 20.2111C13.8221 21.089 12.9443 21.5279 12 21.5279C11.0557 21.5279 10.1779 21.089 8.42229 20.2111C6.27063 19.1353 5.19479 18.5974 4.5974 17.6308C4 16.6642 4 15.4614 4 13.0557V12C4 9.17157 4 7.75736 4.87868 6.87868C5.75736 6 7.17157 6 10 6ZM12 10C11.7159 10 11.5259 10.3408 11.1459 11.0225L11.0476 11.1989C10.9397 11.3926 10.8857 11.4894 10.8015 11.5533C10.7173 11.6172 10.6125 11.641 10.4028 11.6884L10.2119 11.7316C9.47396 11.8986 9.10501 11.982 9.01723 12.2643C8.92945 12.5466 9.18097 12.8407 9.68403 13.429L9.81418 13.5812C9.95713 13.7483 10.0286 13.8319 10.0608 13.9353C10.0929 14.0387 10.0821 14.1502 10.0605 14.3733L10.0408 14.5763C9.96476 15.3612 9.92674 15.7536 10.1565 15.9281C10.3864 16.1025 10.7318 15.9435 11.4227 15.6254L11.6014 15.5431C11.7978 15.4527 11.8959 15.4075 12 15.4075C12.1041 15.4075 12.2022 15.4527 12.3986 15.5431L12.5773 15.6254C13.2682 15.9435 13.6136 16.1025 13.8435 15.9281C14.0733 15.7536 14.0352 15.3612 13.9592 14.5763L13.9395 14.3733C13.9179 14.1502 13.9071 14.0387 13.9392 13.9353C13.9714 13.8319 14.0429 13.7483 14.1858 13.5812L14.316 13.429C14.819 12.8407 15.0706 12.5466 14.9828 12.2643C14.895 11.982 14.526 11.8986 13.7881 11.7316L13.5972 11.6884C13.3875 11.641 13.2827 11.6172 13.1985 11.5533C13.1143 11.4894 13.0603 11.3926 12.9524 11.1989L12.8541 11.0225C12.4741 10.3408 12.2841 10 12 10Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M10.9998 2H12.9998C14.8855 2 15.8283 2 16.4141 2.58579C16.828 2.99968 16.9494 3.59181 16.985 4.56879C16.1642 4.49989 15.1938 4.49994 14.0986 4.5H9.90111C8.80589 4.49994 7.8355 4.49989 7.01465 4.56879C7.05029 3.59181 7.17174 2.99968 7.58563 2.58579C8.17142 2 9.11423 2 10.9998 2Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </div>

                                            <SeoImage
                                                :src="certificate.course.poster"
                                                :alt="certificate.course_title || 'course'"
                                                :width="320"
                                                :height="180"
                                                sizes-preset="card"
                                                img-class="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h5
                                            class="my-3 line-clamp-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                                            {{ certificate.course_title }}</h5>
                                        <div class="mb-5 space-y-3 text-xs text-gray-500  dark:text-gray-400">
                                            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                                <svg class="w-4 h-4 text-blue-950 dark:text-gray-300"
                                                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                                        fill="currentColor"></path>
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                                                        class="fill-white dark:fill-slate-800"></path>
                                                </svg>
                                                <div class="">
                                                    {{ $t("panel.certifications.courseDuration") }}
                                                    <span class="ms-2">{{ new Date(certificate.time_completed * 1000).toISOString().substr(11, 8) }}</span>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                                <svg class="w-4 h-4 text-blue-950 dark:text-gray-300"
                                                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M7.75 2.5C7.75 2.08579 7.41421 1.75 7 1.75C6.58579 1.75 6.25 2.08579 6.25 2.5V4.07926C4.81067 4.19451 3.86577 4.47737 3.17157 5.17157C2.47737 5.86577 2.19451 6.81067 2.07926 8.25H21.9207C21.8055 6.81067 21.5226 5.86577 20.8284 5.17157C20.1342 4.47737 19.1893 4.19451 17.75 4.07926V2.5C17.75 2.08579 17.4142 1.75 17 1.75C16.5858 1.75 16.25 2.08579 16.25 2.5V4.0129C15.5847 4 14.839 4 14 4H10C9.16097 4 8.41527 4 7.75 4.0129V2.5Z"
                                                        fill="currentColor"></path>
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 11.161 2 10.4153 2.0129 9.75H21.9871C22 10.4153 22 11.161 22 12ZM16.5 18C17.3284 18 18 17.3284 18 16.5C18 15.6716 17.3284 15 16.5 15C15.6716 15 15 15.6716 15 16.5C15 17.3284 15.6716 18 16.5 18Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                                <div class="">
                                                    {{ $t("panel.certifications.issueDate") }}
                                                    <span class="me-2" dir="ltr">{{ new Date(certificate.issued_at).toLocaleDateString('fa-IR').replace(/\//g, '-') }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="items-center justify-center flex space-x-4 rtl:space-x-reverse">
                                            <button type="button"
                                                @click="openCertificateSheet(certificate, 'download')"
                                                class="w-full bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:outline-none focus:ring-gray-700 ring-offset-1 ring-offset-white dark:ring-offset-gray-800 text-white rounded-md flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 min-w-[7rem]">
                                                <svg class="me-2 w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M12 22C10.1144 22 9.17157 22 8.58579 21.4142C8 20.8284 8 19.8856 8 18C8 16.1144 8 15.1716 8.58579 14.5858C9.17157 14 10.1144 14 12 14C13.8856 14 14.8284 14 15.4142 14.5858C16 15.1716 16 16.1144 16 18C16 19.8856 16 20.8284 15.4142 21.4142C14.8284 22 13.8856 22 12 22ZM13.8047 18.9158L12.4714 20.2492C12.2111 20.5095 11.7889 20.5095 11.5286 20.2492L10.1953 18.9158C9.93491 18.6555 9.93491 18.2334 10.1953 17.973C10.4556 17.7127 10.8777 17.7127 11.1381 17.973L11.3333 18.1683V16.2222C11.3333 15.854 11.6318 15.5556 12 15.5556C12.3682 15.5556 12.6667 15.854 12.6667 16.2222V18.1683L12.8619 17.973C13.1223 17.7127 13.5444 17.7127 13.8047 17.973C14.0651 18.2334 14.0651 18.6555 13.8047 18.9158Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M6.50001 18L6.50001 17.9105C6.49991 17.0449 6.49981 16.2512 6.58661 15.6056C6.6822 14.8946 6.90709 14.1432 7.52514 13.5251C8.14319 12.9071 8.89464 12.6822 9.6056 12.5866C10.2512 12.4998 11.0449 12.4999 11.9105 12.5H12.0895C12.9551 12.4999 13.7488 12.4998 14.3944 12.5866C15.1054 12.6822 15.8568 12.9071 16.4749 13.5251C17.0929 14.1432 17.3178 14.8946 17.4134 15.6056C17.4989 16.2417 17.5001 17.0215 17.5 17.8722C20.0726 17.3221 22 15.0599 22 12.3529C22 9.88113 20.393 7.78024 18.1551 7.01498C17.8371 4.19371 15.4159 2 12.4762 2C9.32028 2 6.7619 4.52827 6.7619 7.64706C6.7619 8.33687 6.88706 8.9978 7.11616 9.60887C6.8475 9.55673 6.56983 9.52941 6.28571 9.52941C3.91878 9.52941 2 11.4256 2 13.7647C2 16.1038 3.91878 18 6.28571 18L6.50001 18Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                                <div class="text-start">
                                                    <div class="text-xs font-semibold">
                                                        {{ $t('panel.certifications.download') }}
                                                    </div>
                                                </div>
                                            </button>
                                            <button type="button"
                                                @click="openCertificateSheet(certificate, 'view')"
                                                class="w-full text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:outline-none focus:ring-gray-300 ring-offset-1 ring-offset-white dark:ring-offset-gray-800 rounded-md flex items-center justify-center px-4 py-2.5 ">
                                                <svg class="me-2 w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M2 6.5C2 4.37868 2 3.31802 2.65901 2.65901C3.31802 2 4.37868 2 6.5 2C8.62132 2 9.68198 2 10.341 2.65901C11 3.31802 11 4.37868 11 6.5C11 8.62132 11 9.68198 10.341 10.341C9.68198 11 8.62132 11 6.5 11C4.37868 11 3.31802 11 2.65901 10.341C2 9.68198 2 8.62132 2 6.5Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M13 17.5C13 15.3787 13 14.318 13.659 13.659C14.318 13 15.3787 13 17.5 13C19.6213 13 20.682 13 21.341 13.659C22 14.318 22 15.3787 22 17.5C22 19.6213 22 20.682 21.341 21.341C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.341C13 20.682 13 19.6213 13 17.5Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M2 17.5C2 15.3787 2 14.318 2.65901 13.659C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 13.659C11 14.318 11 15.3787 11 17.5C11 19.6213 11 20.682 10.341 21.341C9.68198 22 8.62132 22 6.5 22C4.37868 22 3.31802 22 2.65901 21.341C2 20.682 2 19.6213 2 17.5Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M13 6.5C13 4.37868 13 3.31802 13.659 2.65901C14.318 2 15.3787 2 17.5 2C19.6213 2 20.682 2 21.341 2.65901C22 3.31802 22 4.37868 22 6.5C22 8.62132 22 9.68198 21.341 10.341C20.682 11 19.6213 11 17.5 11C15.3787 11 14.318 11 13.659 10.341C13 9.68198 13 8.62132 13 6.5Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                                <div class="text-start">
                                                    <div class="text-xs font-semibold">{{ $t('panel.certifications.view') }}</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div v-else
							class="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 md:p-14 text-center">
							<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/10 text-amber-500">
								<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
								</svg>
							</div>
							<p class="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-200">{{ $t("panel.common.empty") }}</p>
						</div>
                            </div>
                            <!-- </TabPanel> -->
                        </TabPanels>
                        <div v-if="certificates.length > 0 && pagination.last_page > 1"
                            class="my-10 flex items-center justify-center">
                            <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                        </div>
                    </TabGroup>
                </div>
            </div>
        </div>

        <CertificatePngGenerator ref="pngGenerator" />

        <CertificateViewerModal
            v-model="sheetOpen"
            :mode="sheetMode"
            :uuid="actionCert?.uuid"
            :course-title="actionCert?.course_title"
            :serial="actionCert?.serial_number"
            :template-id="actionCert?.certificate_template_id"
            :shared-generator="$refs.pngGenerator"
            @png-ready="cachePng"
            @template-updated="onTemplateUpdated"
            @downloaded="onDownloaded"
        />

    </PanelMasterPage>
</template>

<script>
import PanelMasterPage from "@/views/page/panel/layouts/PanelMasterPage.vue";
import CertificateViewerModal from "@/views/components/certificate/CertificateViewerModal.vue";
import CertificatePngGenerator from "@/views/components/certificate/CertificatePngGenerator.vue";
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import { TabGroup, TabList, Tab, TabPanels, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
export default {
    components: {
        PanelMasterPage,
        CertificateViewerModal,
        CertificatePngGenerator,
        PaginationComponent,
        TabGroup,
        TabList,
        Tab,
        TabPanels,
        // TabPanel,
        Listbox,
        ListboxButton,
        ListboxOptions,
        ListboxOption
    },
    data() {
        const urlParams = new URLSearchParams(window.location.search);
        const slugFromUrl = urlParams.get('filter') || 'online';
        const filters = {
            online: {
                title: this.$t("panel.certifications.filterOnline"),
                english_title: "online view",
                slug: "online",
                icon: `<svg class="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M10 0C18.235 0 20 1.765 20 10C18.3333 18.3333 10 20 10 20C10 20 1.66667 18.3333 0 10C0 1.765 1.765 -1.59415e-06 10 0Z"></path>
                            <path fill="currentColor" d="M5.68817 9.18565C6.40416 9.99708 8.01221 11.5003 10 11.5003C11.9878 11.5003 13.5958 9.99708 14.3118 9.18565C14.4084 9.07617 14.4084 8.92448 14.3118 8.815C13.5958 8.00357 11.9878 6.50033 10 6.50033C8.01221 6.50033 6.40417 8.00357 5.68817 8.815C5.59157 8.92448 5.59157 9.07617 5.68817 9.18565Z" stroke="white" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"></path>
                            <circle  r="0.833333" transform="matrix(-1 0 0 1 10 9)" stroke-width="0.833333"></circle>
                        </svg>`
            },
            tech: {
                title: this.$t("panel.certifications.filterTech"),
                english_title: "tech confirmation",
                slug: "tech",
                icon: `<svg class="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M10 0C18.235 0 20 1.765 20 10C18.3333 18.3333 10 20 10 20C10 20 1.66667 18.3333 0 10C0 1.765 1.765 -1.59415e-06 10 0ZM13.9226 6.91076C14.248 7.23619 14.248 7.76383 13.9226 8.08927L9.75594 12.2559C9.4305 12.5814 8.90286 12.5814 8.57742 12.2559L6.91076 10.5893C6.58532 10.2638 6.58532 9.73619 6.91076 9.41076C7.23619 9.08532 7.76383 9.08532 8.08927 9.41076L9.16668 10.4882L12.7441 6.91076C13.0695 6.58532 13.5972 6.58532 13.9226 6.91076Z">
                            </path>
                        </svg>`
            },
        };
        const selectedFilter = filters[slugFromUrl] || filters['online'];
        return {
            certificates: [],
            filterLoading: false,
            filters,
            selectedFilter,
            currentPage: this.$route.query.page ? this.$route.query.page : 1,
            pagination: {},
            mounted: false,
            sheetOpen: false,
            sheetMode: 'view',
            actionCert: null,
            pngCache: {},
        };
    },
    methods: {
        selectFilter(filter) {
            this.selectedFilter = filter;
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        updatePage(value) {
            this.currentPage = value;

            this.updateUrlAndFetchData();
        },
        updateUrlAndFetchData() {
            let query = {};

            if (this.selectedFilter && this.selectedFilter.slug !== 'online') {
                query.filter = this.selectedFilter.slug;
            }

            if (this.currentPage !== 1) {
                query.page = this.currentPage;
            }

            const queryString = new URLSearchParams(query).toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

            window.history.pushState(null, '', newUrl);

            this.getCertificates();
        },
        async getCertificates() {
            try {
                this.filterLoading = true;

                let params = {
                    page: this.currentPage,
                    filter: this.selectedFilter ? this.selectedFilter.slug : undefined,
                };

                Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

                const response = await axiosInstance.post('/panel/certifications', params);
                this.certificates = response.data.data;
                this.currentPage = response.data.pagination.current_page;
                this.pagination = response.data.pagination;
                if (this.mounted) {
                    setTimeout(() => {
                        document.getElementById('data-list')?.scrollIntoView({ behavior: 'smooth' });
                    }, 200);
                }
            } catch (error) {
                console.error('Error loading certificates:', error);
            } finally {
                this.filterLoading = false;
                this.mounted = true;
            }
        },
        openCertificateSheet(certificate, mode = 'view') {
            this.actionCert = certificate;
            this.sheetMode = mode;
            this.sheetOpen = true;
        },
        cachePng({ uuid, dataUrl }) {
            if (uuid && dataUrl) {
                this.pngCache[uuid] = dataUrl;
            }
        },
        onTemplateUpdated({ uuid, certificate_template_id }) {
            const cert = this.certificates.find((c) => c.uuid === uuid);
            if (cert) {
                cert.certificate_template_id = certificate_template_id;
            }
            if (this.actionCert?.uuid === uuid) {
                this.actionCert.certificate_template_id = certificate_template_id;
            }
            delete this.pngCache[uuid];
        },
        onDownloaded({ uuid }) {
            delete this.pngCache[uuid];
        },
    },
    mounted() {
        document.title = this.$t("panel.certifications.documentTitle");
        this.updateUrlAndFetchData()
    },
};
</script>
