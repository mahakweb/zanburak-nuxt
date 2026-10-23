<script setup>
definePageMeta({
  name: "admin-path-details",
  middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage
        :breadcrumb-title-override="path?.title"
        :breadcrumb-last-override="path?.title"
        breadcrumb-subtitle-override="مسیر یادگیری">
        <template #breadcrumb-actions>
            <template v-if="path">
                <a
                    :href="publicPathUrl"
                    target="_blank"
                    class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                    <span class="block group-active:[transform:translate3d(0,1px,0)]">پیش‌نمایش</span>
                </a>
                <button
                    type="button"
                    @click="copyPathLink"
                    class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                    <span class="block group-active:[transform:translate3d(0,1px,0)]">کپی لینک</span>
                </button>
                <router-link
                    :to="{ name: 'admin-path-edit', params: { pathSlug } }"
                    class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                    <span class="block group-active:[transform:translate3d(0,1px,0)]">
                        <span class="flex items-center">
                            ویرایش مسیر
                            <svg class="w-4 h-4 ms-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M15.5395 3C14.6303 3 13.7583 3.3599 13.1154 4.00052L9.07222 8.02925C7.21527 9.87957 5.89791 12.198 5.26098 14.7366L5.06561 15.5153C4.86299 16.3229 5.59714 17.0544 6.40764 16.8525L7.1891 16.6578C9.73681 16.0232 12.0635 14.7105 13.9205 12.8602L17.9636 8.83146C18.6066 8.19084 18.9678 7.32196 18.9678 6.41599C18.9678 4.52939 17.4329 3 15.5395 3ZM14.3776 7.57378C14.9965 8.19047 15.714 8.45317 16.2462 8.36088L16.8688 7.74049C17.2213 7.38921 17.4194 6.91278 17.4194 6.41599C17.4194 5.38149 16.5777 4.54286 15.5395 4.54286C15.041 4.54286 14.5628 4.7402 14.2103 5.09149L13.5877 5.71187C13.495 6.24217 13.7587 6.95709 14.3776 7.57378Z"
                                    fill="currentColor"></path>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M4 20.2286C4 19.8025 4.34662 19.4571 4.77419 19.4571H19.2258C19.6534 19.4571 20 19.8025 20 20.2286C20 20.6546 19.6534 21 19.2258 21H4.77419C4.34662 21 4 20.6546 4 20.2286Z"
                                    fill="currentColor"></path>
                            </svg>
                        </span>
                    </span>
                </router-link>
                <button
                    v-can="'paths.delete'"
                    type="button"
                    @click="showDeleteModal = true"
                    class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-rose-700 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                    <span class="block group-active:[transform:translate3d(0,1px,0)]">حذف مسیر</span>
                </button>
            </template>
        </template>

        <div v-if="path">
            <div class="mb-4 overflow-hidden rounded-2xl border border-sky-200/70 dark:border-sky-900/40 bg-gradient-to-br from-sky-50 via-white to-indigo-50/80 dark:from-gray-900 dark:via-gray-900 dark:to-sky-950/25 shadow-sm">
                <div class="flex flex-wrap items-center gap-1.5 px-4 md:px-5 py-2.5 border-b border-sky-100/80 dark:border-sky-900/30 bg-sky-100/60 dark:bg-sky-950/20">
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-2.5 py-1 text-[11px] font-bold text-white">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12h4l2-7 4 14 2-7h6" />
                        </svg>
                        مسیر یادگیری
                    </span>
                    <span class="inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium"
                        :class="path.status ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/25' : 'text-gray-600 bg-white/80 dark:text-gray-200 dark:bg-gray-800/60'">
                        <span class="me-1.5 h-1.5 w-1.5 rounded-full" :class="path.status ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                        {{ path.status ? 'فعال' : 'غیرفعال' }}
                    </span>
                    <span class="inline-flex items-center rounded-lg bg-white/80 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-gray-800/60 dark:text-indigo-300">
                        {{ assignmentLabel }}
                    </span>
                    <span v-if="path.allows_installment" class="inline-flex items-center rounded-lg bg-white/80 px-2 py-1 text-xs font-medium text-sky-700 dark:bg-gray-800/60 dark:text-sky-300">
                        خرید اقساطی
                    </span>
                    <span class="inline-flex items-center rounded-lg bg-white/80 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                        {{ commentsCount }} کامنت
                    </span>
                    <span class="inline-flex items-center rounded-lg bg-white/80 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                        {{ viewsCount }} بازدید
                    </span>
                </div>

                <div class="p-4 md:p-5">
                    <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-start gap-4">
                                <div class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-sky-200 bg-white shadow-sm dark:border-sky-800 dark:bg-gray-800">
                                    <img v-if="path.icon" :src="path.icon" :alt="path.title" class="h-full w-full object-cover" onerror="this.style.display='none'" />
                                    <div v-else class="flex h-full w-full items-center justify-center text-sky-400">
                                        <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12h4l2-7 4 14 2-7h6" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="min-w-0">
                                    <h2 class="text-xl font-black text-gray-900 dark:text-white">{{ path.title }}</h2>
                                    <p v-if="path.english_title" class="mt-0.5 font-sans text-sm font-semibold text-sky-700 dark:text-sky-300" dir="ltr">{{ path.english_title }}</p>
                                    <button type="button" class="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1 text-[11px] font-medium text-gray-500 hover:text-sky-700 dark:bg-gray-800/70 dark:text-gray-400" dir="ltr" @click="copySlug">
                                        /path/{{ path.slug }}
                                        <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                            <rect x="9" y="9" width="11" height="11" rx="2" />
                                            <path d="M5 15V5h10" />
                                        </svg>
                                    </button>
                                    <p v-if="path.short_description" class="mt-3 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400">{{ path.short_description }}</p>
                                </div>
                            </div>

                            <div class="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <button type="button" class="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-3 py-3 text-start transition hover:border-amber-300 dark:border-amber-900/40 dark:bg-amber-950/20" @click="changeSections('relations')">
                                    <div class="text-[11px] font-semibold text-amber-700 dark:text-amber-300">پیش‌نیاز مسیر</div>
                                    <div class="mt-1 text-lg font-black text-gray-900 dark:text-white">{{ prerequisites.length }}</div>
                                </button>
                                <button type="button" class="rounded-2xl border-2 border-sky-400 bg-white px-3 py-3 text-start shadow-sm dark:border-sky-500 dark:bg-gray-900" @click="changeSections('courses')">
                                    <div class="text-[11px] font-semibold text-sky-700 dark:text-sky-300">دوره‌های این مسیر</div>
                                    <div class="mt-1 text-lg font-black text-gray-900 dark:text-white">{{ courses.length }}</div>
                                </button>
                                <button type="button" class="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-3 text-start transition hover:border-emerald-300 dark:border-emerald-900/40 dark:bg-emerald-950/20" @click="changeSections('relations')">
                                    <div class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">قدم بعدی</div>
                                    <div class="mt-1 text-lg font-black text-gray-900 dark:text-white">{{ nextSteps.length }}</div>
                                </button>
                            </div>

                            <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>ایجاد: {{ formatDate(path.created_at) }}</span>
                                <span v-if="path.updated_at">ویرایش: {{ formatDate(path.updated_at) }}</span>
                                <span>هم‌نیاز: {{ corequisites.length }}</span>
                                <span>سوال متداول: {{ faqs.length }}</span>
                            </div>
                        </div>

                        <div class="w-full shrink-0 overflow-hidden rounded-2xl border border-sky-100 bg-slate-900 lg:w-80 xl:w-96 dark:border-sky-900/40">
                            <div v-if="path.trailer && selectedSection !== 'media'" class="h-44 w-full lg:h-52">
                                <VideoPlayer
                                    :source="path.trailer"
                                    :title="path.title"
                                    :poster="path.poster"
                                    :is-logged-in="true"
                                />
                            </div>
                            <img
                                v-else-if="path.poster"
                                :src="path.poster"
                                :title="path.title"
                                class="h-44 w-full object-cover lg:h-52"
                                onerror="this.style.display='none'"
                            />
                            <div v-else class="flex h-44 items-center justify-center bg-gradient-to-br from-sky-800 to-indigo-900 lg:h-52">
                                <svg class="h-12 w-12 text-sky-300/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12h4l2-7 4 14 2-7h6" />
                                </svg>
                            </div>
                            <div class="flex items-center justify-between bg-sky-950 px-3 py-2 text-[11px] font-medium text-sky-100">
                                <span>{{ path.trailer ? 'تریلر مسیر' : (path.poster ? 'پوستر مسیر' : 'رسانه ثبت نشده') }}</span>
                                <span v-if="path.trailer_status">{{ trailerStatusLabel }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4 rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700/80 dark:bg-gray-900">
                <TabGroup :selectedIndex="selectedTabIndex" @change="onTabChange">
                    <div class="relative z-10 border-b border-gray-100 bg-white px-3 pt-3 pb-2 dark:border-gray-800 dark:bg-gray-900">
                        <AdminHorizontalScroll fade-variant="card">
                            <TabList :class="tabListClass">
                                <Tab v-for="tab in pathTabs" :key="tab.key" v-slot="{ selected }" as="template">
                                    <button type="button" :class="tabButtonClass(selected)">
                                        <span>{{ tab.label }}</span>
                                        <span v-if="tab.key === 'comments' && pendingCommentsCount > 0" :class="tabBadgeClass">{{ pendingCommentsCount }}</span>
                                        <span v-else-if="tab.count != null" class="text-[10px] font-bold text-gray-400 dark:text-gray-500">{{ tab.count }}</span>
                                    </button>
                                </Tab>
                            </TabList>
                        </AdminHorizontalScroll>
                    </div>
                </TabGroup>

                <div class="min-h-[12rem] p-4 md:p-5">
                    <div v-if="selectedSection === 'overview'" class="space-y-4">
                        <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
                            <AdminReportStatCard title="دوره‌های مسیر" :value="courses.length" accent="cyan">
                                <template #icon>
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                                    </svg>
                                </template>
                            </AdminReportStatCard>
                            <AdminReportStatCard title="ارتباطات مسیر" :value="relationsCount" accent="violet">
                                <template #icon>
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12h4l2-7 4 14 2-7h6" />
                                    </svg>
                                </template>
                            </AdminReportStatCard>
                            <AdminReportStatCard title="کامنت‌ها" :value="commentsCount" accent="blue" icon="message" />
                            <AdminReportStatCard title="بازدیدها" :value="viewsCount" accent="amber" icon="eye" />
                        </div>

                        <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                            <div v-for="item in overviewFacts" :key="item.label" class="rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-700/60">
                                <div class="text-[11px] font-semibold text-gray-400">{{ item.label }}</div>
                                <div class="mt-1 break-all font-bold text-gray-800 dark:text-gray-100" :dir="item.ltr ? 'ltr' : undefined">{{ item.value }}</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div class="rounded-xl border border-gray-200 p-3 text-sm md:p-4 dark:border-gray-700/60">
                                <div class="font-bold text-gray-800 dark:text-gray-100">توضیح کوتاه</div>
                                <p class="mt-2 leading-7 text-gray-500 dark:text-gray-400">{{ path.short_description || 'توضیح کوتاهی ثبت نشده است.' }}</p>
                            </div>
                            <div class="rounded-xl border border-gray-200 p-3 text-sm md:p-4 dark:border-gray-700/60">
                                <div class="font-bold text-gray-800 dark:text-gray-100">کلمات کلیدی SEO</div>
                                <div v-if="keywords.length" class="mt-2 flex flex-wrap gap-1.5">
                                    <span v-for="(tag, i) in keywords" :key="i" class="rounded-lg bg-sky-50 px-2 py-1 text-xs font-medium text-sky-800 dark:bg-sky-950/40 dark:text-sky-200"># {{ tag }}</span>
                                </div>
                                <p v-else class="mt-2 text-gray-400">کلمه کلیدی ثبت نشده است.</p>
                            </div>
                        </div>

                        <div class="rounded-xl border border-gray-200 p-3 text-sm md:p-4 dark:border-gray-700/60">
                            <div class="font-bold text-gray-800 dark:text-gray-100">توضیحات مسیر</div>
                            <div v-if="path.description" class="mt-2 leading-7 text-gray-500 dark:text-gray-400">
                                <MarkdownRenderer startClass="rendered-content" :source="path.description" />
                            </div>
                            <p v-else class="mt-2 text-gray-400">توضیحی برای این مسیر ثبت نشده است.</p>
                        </div>

                        <div v-if="path.assignment_type === 'automatic'" class="rounded-xl border border-indigo-200/80 bg-indigo-50/40 p-3 text-sm md:p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                            <div class="font-bold text-gray-800 dark:text-gray-100">قوانین اختصاص خودکار دوره‌ها</div>
                            <p class="mt-1 text-xs text-gray-500">تطبیق با {{ path.match_type === 'all' ? 'همه شرایط' : 'هر یک از شرایط' }}</p>
                            <div v-if="rules.length" class="mt-3 space-y-2">
                                <div v-for="(rule, index) in rules" :key="index" class="rounded-lg bg-white px-3 py-2 text-xs text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
                                    {{ fieldLabel(rule.field) }}
                                    <span class="mx-1 font-bold text-indigo-600 dark:text-indigo-300">{{ operatorLabel(rule.operator) }}</span>
                                    {{ rule.value }}
                                </div>
                            </div>
                            <p v-else class="mt-2 text-xs text-gray-400">قانونی ثبت نشده است.</p>
                        </div>
                    </div>

                    <div v-else-if="selectedSection === 'courses'">
                        <div v-if="courses.length" class="relative space-y-3 ps-2">
                            <div class="absolute start-[1.35rem] top-5 bottom-5 w-px bg-sky-200 dark:bg-sky-900/60"></div>
                            <router-link
                                v-for="(course, index) in courses"
                                :key="course.id"
                                :to="{ name: 'admin-course-details', params: { courseSlug: course.slug } }"
                                class="relative flex items-start gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 transition hover:border-sky-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-sky-700"
                            >
                                <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-black text-white shadow-sm">
                                    {{ index + 1 }}
                                </div>
                                <div class="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                                    <img v-if="course.poster" :src="course.poster" :alt="course.title" class="h-full w-full object-cover" onerror="this.style.display='none'" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ course.title }}</h4>
                                    <p v-if="course.english_title" class="mt-0.5 font-sans text-[11px] text-gray-400" dir="ltr">{{ course.english_title }}</p>
                                    <div class="mt-2 flex flex-wrap gap-1.5">
                                        <span class="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">{{ courseTypeLabel(course.type) }}</span>
                                        <span class="rounded-md px-2 py-0.5 text-[11px] font-medium" :class="course.publish ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'">
                                            {{ course.publish ? 'منتشرشده' : 'پیش‌نویس' }}
                                        </span>
                                        <span v-if="course.status_title" class="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-950/30 dark:text-sky-300">{{ course.status_title }}</span>
                                        <span v-if="course.level_title" class="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300">{{ course.level_title }}</span>
                                        <span class="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">{{ coursePriceLabel(course.price) }}</span>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                        <p v-else class="py-10 text-center text-sm text-gray-400">هنوز دوره‌ای به این مسیر اختصاص داده نشده است.</p>
                    </div>

                    <AdminPathComments
                        v-else-if="selectedSection === 'comments' && path?.id"
                        :path-id="path.id"
                        @pending-count="pendingCommentsCount = $event"
                    />

                    <div v-else-if="selectedSection === 'relations'" class="space-y-4">
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <section class="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-3 md:p-4 dark:border-amber-900/40 dark:bg-amber-950/10">
                                <h4 class="text-sm font-bold text-amber-800 dark:text-amber-200">پیش‌نیازها</h4>
                                <p class="mt-1 text-[11px] text-gray-500">مسیرهایی که باید قبل از این مسیر دیده شوند</p>
                                <div v-if="prerequisites.length" class="mt-3 space-y-2">
                                    <router-link v-for="item in prerequisites" :key="item.id" :to="pathDetailsLink(item.slug)" :class="relatedPathClass">
                                        <img v-if="item.icon" :src="item.icon" class="h-8 w-8 rounded-lg object-cover" alt="" onerror="this.style.display='none'" />
                                        <span class="min-w-0">
                                            <span class="block line-clamp-1">{{ item.title }}</span>
                                            <span v-if="item.english_title" class="block font-sans text-[10px] font-normal text-gray-400" dir="ltr">{{ item.english_title }}</span>
                                        </span>
                                    </router-link>
                                </div>
                                <p v-else class="mt-3 text-xs text-gray-400">پیش‌نیازی ثبت نشده است.</p>
                            </section>
                            <section class="rounded-2xl border border-sky-200/80 bg-sky-50/40 p-3 md:p-4 dark:border-sky-900/40 dark:bg-sky-950/10">
                                <h4 class="text-sm font-bold text-sky-800 dark:text-sky-200">هم‌نیازها</h4>
                                <p class="mt-1 text-[11px] text-gray-500">مسیرهایی که موازی با این مسیر پیشنهاد می‌شوند</p>
                                <div v-if="corequisites.length" class="mt-3 space-y-2">
                                    <router-link v-for="item in corequisites" :key="item.id" :to="pathDetailsLink(item.slug)" :class="relatedPathClass">
                                        <img v-if="item.icon" :src="item.icon" class="h-8 w-8 rounded-lg object-cover" alt="" onerror="this.style.display='none'" />
                                        <span class="min-w-0">
                                            <span class="block line-clamp-1">{{ item.title }}</span>
                                            <span v-if="item.english_title" class="block font-sans text-[10px] font-normal text-gray-400" dir="ltr">{{ item.english_title }}</span>
                                        </span>
                                    </router-link>
                                </div>
                                <p v-else class="mt-3 text-xs text-gray-400">هم‌نیازی ثبت نشده است.</p>
                            </section>
                            <section class="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-3 md:p-4 dark:border-emerald-900/40 dark:bg-emerald-950/10">
                                <h4 class="text-sm font-bold text-emerald-800 dark:text-emerald-200">قدم‌های بعدی</h4>
                                <p class="mt-1 text-[11px] text-gray-500">مسیرهایی که بعد از اتمام این مسیر پیشنهاد می‌شوند</p>
                                <div v-if="nextSteps.length" class="mt-3 space-y-2">
                                    <router-link v-for="item in nextSteps" :key="item.id" :to="pathDetailsLink(item.slug)" :class="relatedPathClass">
                                        <img v-if="item.icon" :src="item.icon" class="h-8 w-8 rounded-lg object-cover" alt="" onerror="this.style.display='none'" />
                                        <span class="min-w-0">
                                            <span class="block line-clamp-1">{{ item.title }}</span>
                                            <span v-if="item.english_title" class="block font-sans text-[10px] font-normal text-gray-400" dir="ltr">{{ item.english_title }}</span>
                                        </span>
                                    </router-link>
                                </div>
                                <p v-else class="mt-3 text-xs text-gray-400">قدم بعدی ثبت نشده است.</p>
                            </section>
                        </div>

                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <section class="rounded-2xl border border-gray-200/80 p-3 md:p-4 dark:border-gray-800">
                                <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100">این مسیر پیش‌نیاز کدام مسیرهاست</h4>
                                <div v-if="prerequisiteFor.length" class="mt-3 space-y-2">
                                    <router-link v-for="item in prerequisiteFor" :key="item.id" :to="pathDetailsLink(item.slug)" :class="relatedPathClass">
                                        <img v-if="item.icon" :src="item.icon" class="h-8 w-8 rounded-lg object-cover" alt="" onerror="this.style.display='none'" />
                                        <span class="line-clamp-1">{{ item.title }}</span>
                                    </router-link>
                                </div>
                                <p v-else class="mt-3 text-xs text-gray-400">مسیر دیگری این مسیر را به‌عنوان پیش‌نیاز ندارد.</p>
                            </section>
                            <section class="rounded-2xl border border-gray-200/80 p-3 md:p-4 dark:border-gray-800">
                                <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100">مسیرهایی که به این مسیر ختم می‌شوند</h4>
                                <div v-if="previousSteps.length" class="mt-3 space-y-2">
                                    <router-link v-for="item in previousSteps" :key="item.id" :to="pathDetailsLink(item.slug)" :class="relatedPathClass">
                                        <img v-if="item.icon" :src="item.icon" class="h-8 w-8 rounded-lg object-cover" alt="" onerror="this.style.display='none'" />
                                        <span class="line-clamp-1">{{ item.title }}</span>
                                    </router-link>
                                </div>
                                <p v-else class="mt-3 text-xs text-gray-400">مسیر دیگری این مسیر را به‌عنوان قدم بعدی ندارد.</p>
                            </section>
                        </div>
                    </div>

                    <div v-else-if="selectedSection === 'media'" class="space-y-4">
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <section class="rounded-2xl border border-gray-200/80 p-3 dark:border-gray-800">
                                <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100">آیکون مسیر</h4>
                                <div class="mt-3 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800/60">
                                    <img v-if="path.icon" :src="path.icon" :alt="path.title" class="h-full w-full object-contain" onerror="this.style.display='none'" />
                                    <span v-else class="text-xs text-gray-400">آیکون ثبت نشده است.</span>
                                </div>
                            </section>
                            <section class="rounded-2xl border border-gray-200/80 p-3 dark:border-gray-800">
                                <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100">پوستر مسیر</h4>
                                <div class="mt-3 h-40 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800/60">
                                    <img v-if="path.poster" :src="path.poster" :alt="path.title" class="h-full w-full object-cover" onerror="this.style.display='none'" />
                                    <div v-else class="flex h-full items-center justify-center text-xs text-gray-400">پوستر ثبت نشده است.</div>
                                </div>
                            </section>
                            <section class="rounded-2xl border border-gray-200/80 p-3 dark:border-gray-800">
                                <div class="flex items-center justify-between gap-2">
                                    <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100">تریلر مسیر</h4>
                                    <span v-if="path.trailer_status" class="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-950/30 dark:text-sky-300">{{ trailerStatusLabel }}</span>
                                </div>
                                <div class="mt-3 h-40 overflow-hidden rounded-xl bg-black">
                                    <VideoPlayer
                                        v-if="path.trailer"
                                        :source="path.trailer"
                                        :title="path.title"
                                        :poster="path.poster"
                                        :is-logged-in="true"
                                    />
                                    <div v-else class="flex h-full items-center justify-center text-xs text-gray-400">تریلر ثبت نشده است.</div>
                                </div>
                            </section>
                        </div>

                        <section v-if="videos.length" class="rounded-2xl border border-gray-200/80 p-3 md:p-4 dark:border-gray-800">
                            <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100">ویدیوهای ذخیره‌شده</h4>
                            <div class="mt-3 overflow-x-auto">
                                <table class="min-w-full text-xs text-gray-600 dark:text-gray-300">
                                    <thead>
                                        <tr class="text-start text-gray-400">
                                            <th class="px-2 py-2 font-semibold">شناسه</th>
                                            <th class="px-2 py-2 font-semibold">نوع</th>
                                            <th class="px-2 py-2 font-semibold">وضعیت</th>
                                            <th class="px-2 py-2 font-semibold">کیفیت</th>
                                            <th class="px-2 py-2 font-semibold">دیسک</th>
                                            <th class="px-2 py-2 font-semibold">پیشرفت</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="video in videos" :key="video.id" class="border-t border-gray-100 dark:border-gray-800">
                                            <td class="px-2 py-2 font-sans">{{ video.id }}</td>
                                            <td class="px-2 py-2">{{ video.type || '—' }}</td>
                                            <td class="px-2 py-2">{{ video.status || '—' }}</td>
                                            <td class="px-2 py-2">{{ video.quality || '—' }}</td>
                                            <td class="px-2 py-2">{{ video.disk || '—' }}</td>
                                            <td class="px-2 py-2">{{ video.progress != null ? `${video.progress}%` : '—' }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    <div v-else-if="selectedSection === 'faqs'">
                        <div v-if="faqs.length" class="space-y-2">
                            <details
                                v-for="(faq, index) in faqs"
                                :key="index"
                                class="group rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                            >
                                <summary class="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-gray-800 dark:text-gray-100">
                                    <span>{{ faq.question }}</span>
                                    <svg class="h-4 w-4 shrink-0 text-gray-400 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </summary>
                                <p class="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">{{ faq.answer }}</p>
                            </details>
                        </div>
                        <p v-else class="py-10 text-center text-sm text-gray-400">سوال متداولی برای این مسیر ثبت نشده است.</p>
                    </div>
                </div>
            </div>
        </div>

        <AdminDeletePathModal v-model="showDeleteModal" :path-slugs="pathSlug" @deleted="onPathDeleted" />
        <LoadingComponent v-if="loading" />
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import AdminHorizontalScroll from "@/views/components/admin/AdminHorizontalScroll.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminDeletePathModal from "@/views/components/admin/AdminDeletePathModal.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import VideoPlayer from "@/views/components/player/VideoPlayer.vue";
import axiosInstance from "@/store/axiosInstance";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import { ADMIN_TAB_LIST, ADMIN_TAB_BADGE, adminTabButtonClass } from "@/views/components/admin/adminTabStyles.js";
import AdminPathComments from "@/views/page/admin/path/AdminPathComments.vue";
import { showToastSuccess, showToastError } from "@/utils/toastConfig";

export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        AdminHorizontalScroll,
        AdminReportStatCard,
        AdminDeletePathModal,
        MarkdownRenderer,
        VideoPlayer,
        TabGroup,
        TabList,
        Tab,
        AdminPathComments,
    },
    data() {
        const sections = ["overview", "courses", "comments", "relations", "media", "faqs"];
        return {
            pathSlug: this.$route.params.pathSlug,
            selectedSection: sections.includes(this.$route.query.section) ? this.$route.query.section : sections[0],
            path: null,
            loading: false,
            showDeleteModal: false,
            pendingCommentsCount: 0,
            relatedPathClass: "flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-white/80 dark:bg-gray-900/80 dark:text-gray-100 dark:hover:bg-gray-900",
        };
    },
    computed: {
        courses() {
            return this.path?.courses || [];
        },
        prerequisites() {
            return this.path?.prerequisites || [];
        },
        corequisites() {
            return this.path?.corequisites || [];
        },
        nextSteps() {
            return this.path?.next_steps || [];
        },
        prerequisiteFor() {
            return this.path?.prerequisite_for || [];
        },
        previousSteps() {
            return this.path?.previous_steps || [];
        },
        faqs() {
            return Array.isArray(this.path?.faqs) ? this.path.faqs : [];
        },
        rules() {
            return Array.isArray(this.path?.rules) ? this.path.rules : [];
        },
        videos() {
            return Array.isArray(this.path?.videos) ? this.path.videos : [];
        },
        keywords() {
            if (!this.path?.meta_keywords) return [];
            return this.path.meta_keywords.split(",").map((item) => item.trim()).filter(Boolean);
        },
        commentsCount() {
            return this.path?.comments_count || 0;
        },
        viewsCount() {
            return this.path?.views_count || 0;
        },
        relationsCount() {
            return this.prerequisites.length + this.corequisites.length + this.nextSteps.length;
        },
        assignmentLabel() {
            return this.path?.assignment_type === "automatic" ? "اختصاص خودکار دوره" : "اختصاص دستی دوره";
        },
        trailerStatusLabel() {
            const map = {
                uploaded: "آپلود شده",
                processing: "در حال پردازش",
                processed: "پردازش‌شده",
                ready: "آماده",
                failed: "ناموفق",
                error: "خطا",
            };
            return map[this.path?.trailer_status] || this.path?.trailer_status || "";
        },
        publicPathUrl() {
            return `/path/${this.pathSlug}`;
        },
        overviewFacts() {
            if (!this.path) return [];
            return [
                { label: "عنوان فارسی", value: this.path.title || "—" },
                { label: "عنوان انگلیسی", value: this.path.english_title || "—", ltr: true },
                { label: "اسلاگ", value: this.path.slug || "—", ltr: true },
                { label: "شناسه", value: this.path.id || "—" },
                { label: "وضعیت", value: this.path.status ? "فعال" : "غیرفعال" },
                { label: "خرید اقساطی", value: this.path.allows_installment ? "فعال" : "غیرفعال" },
                { label: "نحوه اختصاص دوره", value: this.assignmentLabel },
                { label: "نوع تطبیق", value: this.path.assignment_type === "automatic" ? (this.path.match_type === "all" ? "همه شرایط" : "هر یک از شرایط") : "—" },
                { label: "تاریخ ایجاد", value: this.formatDate(this.path.created_at) },
                { label: "آخرین ویرایش", value: this.formatDate(this.path.updated_at) },
                { label: "گزارش‌ها", value: this.path.reports_count || 0 },
                { label: "ویدیوها", value: this.videos.length },
            ];
        },
        pathTabs() {
            return [
                { key: "overview", label: "جزئیات مسیر" },
                { key: "courses", label: "نقشه دوره‌ها", count: this.courses.length },
                { key: "comments", label: "کامنت‌ها", count: this.commentsCount },
                { key: "relations", label: "نقشه ارتباطات", count: this.relationsCount },
                { key: "media", label: "رسانه" },
                { key: "faqs", label: "سوالات متداول", count: this.faqs.length },
            ];
        },
        selectedTabIndex() {
            const idx = this.pathTabs.findIndex((tab) => tab.key === this.selectedSection);
            return idx >= 0 ? idx : 0;
        },
        tabListClass() {
            return [ADMIN_TAB_LIST, "w-max min-w-0"];
        },
        tabBadgeClass() {
            return ADMIN_TAB_BADGE;
        },
    },
    watch: {
        "$route.params.pathSlug"(slug) {
            if (!slug || slug === this.pathSlug) return;
            this.pathSlug = slug;
            this.selectedSection = "overview";
            this.getPath();
        },
    },
    methods: {
        tabButtonClass(selected) {
            return adminTabButtonClass(selected);
        },
        onTabChange(index) {
            const tab = this.pathTabs[index];
            if (tab) this.changeSections(tab.key);
        },
        changeSections(value) {
            this.selectedSection = value;
            const query = value === "overview" ? "" : `?section=${value}`;
            window.history.pushState(null, "", `${window.location.pathname}${query}`);
        },
        pathDetailsLink(slug) {
            return { name: "admin-path-details", params: { pathSlug: slug } };
        },
        formatDate(date) {
            if (!date) return "—";
            return new Date(date).toLocaleDateString("fa-IR", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        },
        courseTypeLabel(type) {
            return { free: "رایگان", cash: "نقدی", "cash-vip": "ویژه / نقدی" }[type] || "نامشخص";
        },
        coursePriceLabel(price) {
            if (price == null) return "—";
            if (Number(price) === 0) return "رایگان";
            return `${Number(price).toLocaleString("fa-IR")} تومان`;
        },
        fieldLabel(field) {
            const map = {
                title: "عنوان",
                english_title: "عنوان انگلیسی",
                short_description: "توضیح کوتاه",
                description: "توضیحات",
                publish: "وضعیت انتشار",
                status: "وضعیت",
                level: "سطح",
                totalTime: "مدت زمان",
                price: "قیمت",
            };
            return map[field] || field;
        },
        operatorLabel(operator) {
            const map = {
                is_equal_to: "مساوی",
                not_equal_to: "نامساوی",
                less_than: "کوچکتر از",
                greater_than: "بزرگتر از",
                contains: "شامل",
                not_contains: "بدون",
                starts_with: "شروع با",
                ends_with: "پایان با",
            };
            return map[operator] || operator;
        },
        async copyPathLink() {
            try {
                const url = `${window.location.origin}${this.publicPathUrl}`;
                await navigator.clipboard.writeText(url);
                showToastSuccess("لینک مسیر کپی شد.");
            } catch {
                showToastError("کپی لینک ناموفق بود.");
            }
        },
        async copySlug() {
            try {
                await navigator.clipboard.writeText(this.path?.slug || this.pathSlug);
                showToastSuccess("اسلاگ مسیر کپی شد.");
            } catch {
                showToastError("کپی اسلاگ ناموفق بود.");
            }
        },
        async getPath() {
            if (!this.pathSlug) return;
            this.loading = true;
            try {
                const { data } = await axiosInstance.get(`/admin/path/${this.pathSlug}/edit`);
                this.path = data.path || null;
                document.title = this.path?.title ? `مشخصات مسیر | ${this.path.title}` : "مشخصات مسیر";
            } catch (error) {
                console.error(error);
                showToastError("بارگذاری مشخصات مسیر ناموفق بود.");
            } finally {
                this.loading = false;
            }
        },
        onPathDeleted() {
            this.$router.push({ name: "admin-paths-list" });
        },
    },
    mounted() {
        document.title = "مشخصات مسیر";
        this.getPath();
    },
};
</script>
