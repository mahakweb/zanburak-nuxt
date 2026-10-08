<script setup>
definePageMeta({
  name: "admin-episode-edit",
  middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link
                :to="{ name: 'admin-course-details', params: { courseSlug }, query: { section: 'episodes' } }"
                :class="BTN_SECONDARY"
            >
                <span class="flex items-center gap-1.5">
                    جلسات دوره
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </span>
            </router-link>
        </template>

        <div class="min-w-0">
            <LoadingComponent v-if="loading && !course" />

            <form v-else id="edit-episode-form" @submit.prevent="submit">
                <div class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="updateLoading"
                        submit-label="تایید و ذخیره جلسه"
                        :show-reset="currentStepId === 'confirm'"
                        reset-label="بازنشانی فرم"
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submit"
                        @reset="resetForm"
                    />

                    <div class="min-w-0 min-h-[420px]">
                        <section
                        v-show="currentStepId === 'basic'"
                        class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm"
                    >
                    <div class="mb-4">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات کلی</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">عنوان، فصل، ترتیب و وضعیت انتشار</p>
                    </div>
                    <div class="space-y-4">

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="md:col-span-2">
                                    <label for="section"
                                        class="block mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">انتخاب
                                        فصل</label>
                                    <Listbox id="section" v-model="selectedSection" v-slot="{ open }" as="div"
                                        class="w-full">
                                        <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-10 dark:opacity-60">
                                        </div>
                                        <div class="relative" :class="open ? ' z-20' : ''">
                                            <ListboxButton
                                                :class="{ 'outline-none ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ring-yellow-500': open, 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.section_id }"
                                                class="flex justify-between items-center bg-gray-100 text-gray-900 text-sm font-medium rounded-lg outline-none w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
                                                <div class="flex items-center">
                                                    <span class="mx-2 flex items-center line-clamp-1">{{ selectedSection
                                                        ?
                                                        selectedSection.title
                                                        : '' }}</span>
                                                </div>
                                                <div class="ms-4 py-1.5">
                                                    <svg class="w-2 h-3"
                                                        :class="open ? 'rotate-180 transition duration-500' : ''"
                                                        viewBox="0 0 8 5" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873"
                                                            stroke="currentColor" stroke-width="1.23077"
                                                            stroke-linecap="round" stroke-linejoin="round">
                                                        </path>
                                                    </svg>
                                                </div>
                                            </ListboxButton>
                                            <ListboxOptions
                                                class="absolute z-10 mt-1.5 w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700 text-xs space-y-1 p-1 rounded-xl">
                                                <ListboxOption v-for="(section, index) in course.sections" :key="index"
                                                    :value="section"
                                                    :disabled="selectedSection && selectedSection.id === section.id"
                                                    @click.prevent="prepareOrderOptions"
                                                    class="flex items-center px-2 py-3 md:py-2 rounded-lg cursor-pointer hover:bg-gray-200/60 dark:hover:bg-gray-800/60">
                                                    <span class="ms-2 font-semibold">{{ index + 1 + ' - ' +
                                                        section.title
                                                    }}</span>
                                                </ListboxOption>
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                    <span v-if="errors && errors.section_id"
                                        class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.section_id[0] }}
                                    </span>
                                </div>
                                <div class="md:col-span-1">
                                    <label for="order"
                                        class="block mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">شماره
                                        جلسه</label>
                                    <Listbox id="order" v-model="selectedOrder" v-slot="{ open }" as="div"
                                        class="w-full">
                                        <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-10 dark:opacity-60">
                                        </div>
                                        <div class="relative" :class="open ? ' z-20' : ''">
                                            <ListboxButton
                                                :class="{ 'outline-none ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ring-yellow-500': open, 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.order }"
                                                class="flex justify-between items-center bg-gray-100 text-gray-900 text-sm font-medium rounded-lg outline-none w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
                                                <div class="flex items-center">
                                                    <span class="mx-2 flex items-center line-clamp-1">{{ selectedOrder
                                                    }}</span>
                                                </div>
                                                <div class="ms-4 py-1.5">
                                                    <svg class="w-2 h-3"
                                                        :class="open ? 'rotate-180 transition duration-500' : ''"
                                                        viewBox="0 0 8 5" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873"
                                                            stroke="currentColor" stroke-width="1.23077"
                                                            stroke-linecap="round" stroke-linejoin="round">
                                                        </path>
                                                    </svg>
                                                </div>
                                            </ListboxButton>
                                            <ListboxOptions
                                                class="absolute z-10 mt-1.5 w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700 text-xs space-y-1 p-1 rounded-xl">
                                                <ListboxOption v-for="(order, index) in orderOptions" :key="index"
                                                    :value="order" :disabled="selectedOrder && selectedOrder === order"
                                                    class="flex items-center px-2 py-3 md:py-2 rounded-lg cursor-pointer hover:bg-gray-200/60 dark:hover:bg-gray-800/60">
                                                    <span class="ms-2 font-semibold">{{ order }}</span>
                                                </ListboxOption>
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                    <span v-if="errors && errors.order" class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.order[0] }}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label for="title"
                                    class="block mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">عنوان
                                    فارسی
                                    جلسه</label>
                                <input type="text" id="title" v-model="title"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.title }"
                                    placeholder="" required />
                                <span v-if="errors && errors.title" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.title[0] }}
                                </span>
                            </div>

                            <div>
                                <label for="english_title"
                                    class="block mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">عنوان
                                    انگلیسی جلسه</label>
                                <input type="text" id="english_title" v-model="english_title"
                                    @input="filterInputEnglishTitle"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.english_title }"
                                    placeholder="" required />
                                <span v-if="errors && errors.english_title"
                                    class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.english_title[0] }}
                                </span>
                                <p class="text-xs text-gray-400 mt-1">این فیلد برای ساخت آدرس (slug) جلسه استفاده
                                    می‌شود.</p>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="publish"
                                    class="field-label">وضعیت انتشار</label>
                                <ul :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.publish }"
                                    class="h-10 grid w-full gap-3 grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <li>
                                        <input v-model="publish" type="radio" id="publish-0" name="publish" :value="0"
                                            class="hidden peer" required />
                                        <label for="publish-0"
                                            class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                            <div class="block text-xs font-semibold text-center w-full">
                                                پیش‌نویس
                                            </div>
                                        </label>
                                    </li>
                                    <li>
                                        <input v-model="publish" type="radio" id="publish-1" name="publish" :value="1"
                                            class="hidden peer">
                                        <label for="publish-1"
                                            class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                            <div class="block text-xs font-semibold text-center w-full">
                                                منتشر شود
                                            </div>
                                        </label>
                                    </li>
                                </ul>
                                <span v-if="errors && errors.publish" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.publish[0] }}
                                </span>

                            </div>

                            <div>
                                <label for="publish_date"
                                    class="block mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">تاریخ
                                    انتشار</label>
                                <input type="datetime-local" id="publish_date" v-model="publish_date"
                                    class="text-center bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.publish_date }" />
                                <span v-if="errors && errors.publish_date"
                                    class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.publish_date[0] }}
                                </span>
                                <p class="text-xs text-gray-400">درصورتی که قرار است جلسه بعدا منتشر شود تاریخ را مشخص
                                    کنید.
                                </p>
                            </div>

                            <div>
                                <label for="lock"
                                    class="block mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">وضعیت
                                    دسترسی</label>
                                <ul :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.lock }"
                                    class="h-10 grid w-full gap-3 grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <li>
                                        <input v-model="lock" type="radio" id="lock-0" name="lock" value="0" checked
                                            class="hidden peer" required />
                                        <label for="lock-0"
                                            class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-green-400">
                                            <div class="block text-xs font-semibold text-center w-full">
                                                عمومی باشد
                                            </div>
                                        </label>
                                    </li>
                                    <li>
                                        <input v-model="lock" type="radio" id="lock-1" name="lock" value="1"
                                            class="hidden peer">
                                        <label for="lock-1"
                                            class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-rose-500">
                                            <div class="block text-xs font-semibold text-center w-full">
                                                قفل شود
                                            </div>
                                        </label>
                                    </li>
                                </ul>
                                <span v-if="errors && errors.lock" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.lock[0] }}
                                </span>
                                <p class="text-xs text-gray-400 mt-1">اگر جلسه قفل باشد فقط افرادی که دوره را دارند
                                    میتوانند
                                    جلسه را مشاهده
                                    کنند.</p>
                            </div>
                            </div>
                    </div>
                    </section>
                    <section
                        v-show="currentStepId === 'details'"
                        class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm"
                    >
                    <div class="mb-4">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white">جزئیات آموزشی</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">توضیحات و کلمات کلیدی برای SEO</p>
                    </div>
                        <div class="space-y-4">

                            <div>
                                <label for="description"
                                    class="-mb-12 flex items-center text-xs font-semibold text-gray-900 dark:text-gray-100">توضیحات
                                    جلسه
                                </label>
                                <EditorComponent ref="description" :submitButton="false" :cancelButton="false"
                                    :helpButton="false" :focusedBorder="'2px #eab308 solid'"
                                    :bodyClass="['bg-gray-100', 'text-gray-900', 'dark:bg-gray-700', 'dark:text-white']"
                                    :toolbarClass="['bg-slate-50', 'dark:bg-slate-800', 'px-2', 'rounded-lg', 'my-2', 'flex', 'flex-wrap']"
                                    :errors="errors && errors.description ? errors.description[0] : ''"
                                    :placeholder="'توضیحات جلسه ...'" v-model="description"> </EditorComponent>
                            </div>

                            <div>
                                <label for="meta_keywords"
                                    class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">کلمات
                                    کلیدی
                                    <span class="text-gray-400">(حداقل 3 و حداکثر 10 کلمه)</span>
                                </label>
                                <textarea id="meta_keywords" rows="3" v-model="meta_keywords"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.meta_keywords }"
                                    placeholder=""></textarea>
                                <span v-if="errors && errors.meta_keywords"
                                    class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.meta_keywords[0] }}
                                </span>
                                <p class="text-xs text-gray-400 mt-1">
                                    کلمات کلیدی را با کاما (,) جدا کنید. این کلمات برای SEO استفاده می‌شوند.
                                    <span class="block mt-1"
                                        :class="metaKeywordsCount < 3 || metaKeywordsCount > 10 ? 'text-rose-500' : 'text-green-500'">
                                        تعداد کلمات: {{ metaKeywordsCount }} / 3-10
                                    </span>
                                </p>
                            </div>

                        </div>
                    </section>
                    <section
                        v-show="currentStepId === 'media'"
                        class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm"
                    >
                    <div class="mb-4">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white">فایل و رسانه</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">ویدیو و فایل پیوست جلسه</p>
                    </div>
                    <div class="grid grid-cols-1 gap-4">
                        <div class="h-max">
                            <div class="w-full">
                                <input
                                    id="video"
                                    ref="video"
                                    type="file"
                                    class="hidden"
                                    :accept="fileValidationRules.video.extensions.join(',')"
                                    @change="handleVideo"
                                />
                                <label
                                    class="flex items-center justify-between mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100 gap-2">
                                    ویدیوی جلسه
                                    <MediaStatusBadge
                                        v-if="oldVideo || video"
                                        :status="uploadStatus.video"
                                        :percent="progress.video.percent"
                                        :extra="uploadStatus.video === 'processing' && processingProgress != null ? (Math.round(processingProgress) + '٪') : ''"
                                    />
                                </label>

                                <div class="flex items-center justify-center w-full">
                                    <div v-if="oldVideo && video == null" class="relative w-full">
                                        <div class="relative aspect-video rounded-lg overflow-hidden bg-black">
                                            <video
                                                class="absolute inset-0 w-full h-full object-contain bg-black"
                                                controls>
                                                <source :src="oldVideo" :type="`video/${oldVideo.split('.').pop()}`">
                                                Your browser does not support the video tag.
                                            </video>
                                            <div
                                                class="absolute top-2 start-2 z-10 flex items-center gap-2 flex-wrap">
                                                <button type="button" title="تغییر ویدیوی جلسه"
                                                    class="h-7 text-white/95 text-xs font-semibold px-2.5 rounded-lg border-0 backdrop-blur-md bg-white/15 hover:bg-white/25 shadow-sm flex items-center gap-1.5 transition"
                                                    @click.stop="openVideoPicker">
                                                    <svg class="w-4 h-4" viewBox="0 0 512 512" fill="none" aria-hidden="true">
                                                        <path fill="currentColor"
                                                            d="M307.81,212.18c-3.24,0-6.07-2.17-6.91-5.3l-4.82-17.88c-0.84-3.12-3.68-5.3-6.91-5.3h-21.46h-25.44H220.8 c-3.24,0-6.07,2.17-6.91,5.3l-4.82,17.88c-0.84,3.12-3.68,5.3-6.91,5.3H169.5c-3.96,0-7.16,3.21-7.16,7.16v101.78 c0,3.96,3.21,7.16,7.16,7.16h170.95c3.96,0,7.16-3.21,7.16-7.16V219.35c0-3.96-3.21-7.16-7.16-7.16H307.81z M282.33,264.94 c-0.86,13.64-11.93,24.71-25.58,25.58c-16.54,1.05-30.18-12.59-29.14-29.14c0.86-13.64,11.93-24.71,25.58-25.58 C269.74,234.76,283.38,248.4,282.33,264.94z" />
                                                        <path fill="currentColor"
                                                            d="M82.95,272.41c3.82,0,7.53-1.53,10.23-4.23l21.23-21.23c4.74-4.74,6.4-11.92,3.73-18.06 c-2.73-6.29-8.88-8.95-18.84-7.57l-0.27,0.27c15.78-71.56,79.7-125.27,155.94-125.27c60.72,0,115.41,33.72,142.73,87.99 c3.58,7.11,12.24,9.97,19.34,6.39c7.11-3.58,9.97-12.24,6.39-19.34c-15.47-30.73-39.05-56.66-68.22-75.01 C325.23,77.47,290.57,67.5,254.98,67.5c-93,0-170.48,67.71-185.75,156.41c-5.38-4.77-13.59-5.18-19.13-0.44 c-6.3,5.39-6.75,14.88-1.13,20.84c0.23,0.24,5.69,6.03,11.41,11.93c3.41,3.51,6.2,6.33,8.3,8.38c4.23,4.13,7.88,7.69,14.07,7.78 C82.81,272.41,82.88,272.41,82.95,272.41z" />
                                                        <path fill="currentColor"
                                                            d="M464.28,247.82l-26.5-26.5c-2.75-2.75-6.57-4.3-10.44-4.23c-2.33,0.03-4.29,0.56-6.07,1.42 c-0.26,0.12-0.51,0.26-0.76,0.4c-0.04,0.02-0.08,0.04-0.12,0.06c-0.59,0.33-1.16,0.68-1.69,1.08c-1.88,1.34-3.6,3.03-5.44,4.82 c-2.1,2.05-4.89,4.87-8.3,8.38c-5.72,5.9-11.18,11.68-11.41,11.93c-5.46,5.79-5.19,14.91,0.6,20.36 c5.75,5.42,14.77,5.18,20.24-0.48c-4.72,83.85-74.42,150.62-159.43,150.62c-70.52,0-131.86-45.23-152.62-112.55 c-2.35-7.6-10.41-11.86-18.01-9.52c-7.6,2.34-11.86,10.41-9.52,18.01c11.62,37.68,35.48,71.52,67.19,95.28 c32.8,24.59,71.86,37.58,112.96,37.58c100.11,0,182.23-78.45,188.14-177.1l0.79,0.79c2.81,2.81,6.5,4.22,10.18,4.22 c3.69,0,7.37-1.41,10.18-4.22C469.91,262.57,469.91,253.45,464.28,247.82z" />
                                                    </svg>
                                                    تغییر ویدیو
                                                </button>
                                                <button @click.prevent="removeFile('video')" title="حذف ویدیوی جلسه"
                                                    class="h-7 text-rose-50 text-xs font-semibold px-2.5 rounded-lg border-0 backdrop-blur-md bg-rose-500/45 hover:bg-rose-500/60 shadow-sm flex items-center gap-1.5 transition">
                                                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                        <path
                                                            d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z"
                                                            fill="currentColor"></path>
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12404C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001ZM10.2463 12.1886C10.2051 11.7548 9.83753 11.4382 9.42537 11.4816C9.01321 11.525 8.71251 11.9119 8.75372 12.3457L9.25372 17.6089C9.29494 18.0427 9.66247 18.3593 10.0746 18.3159C10.4868 18.2725 10.7875 17.8856 10.7463 17.4518L10.2463 12.1886ZM14.5746 11.4816C14.9868 11.525 15.2875 11.9119 15.2463 12.3457L14.7463 17.6089C14.7051 18.0427 14.3375 18.3593 13.9254 18.3159C13.5132 18.2725 13.2125 17.8856 13.2537 17.4518L13.7537 12.1886C13.7949 11.7548 14.1625 11.4382 14.5746 11.4816Z"
                                                            fill="currentColor"></path>
                                                    </svg>
                                                    حذف ویدیو
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <label v-else for="video"
                                        class="relative group flex flex-col items-center justify-center w-full rounded-lg cursor-pointer transition overflow-hidden aspect-video"
                                        :class="[
                                            errors && errors.video ? 'ring-2 ring-rose-500' : 'ring-1 ring-gray-300 dark:ring-gray-600',
                                            videoPreview.thumbnail
                                                ? 'p-0 bg-black'
                                                : 'bg-gray-50 dark:bg-gray-800 border-dashed hover:bg-gray-100 dark:hover:bg-gray-700'
                                        ]" @dragover.prevent @drop.prevent="handleVideo">
                                        <div v-if="!videoPreview.thumbnail"
                                            class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink" fill="none">
                                                <path
                                                    d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                                                    id="MingCute" fill-rule="nonzero"> </path>
                                                <path
                                                    d="M12,2 C17.5228,2 22,6.47715 22,12 C22,15.2712 20.4293,18.1755 18.001,20 L20,20 C20.5523,20 21,20.4477 21,21 C21,21.5523 20.5523,22 20,22 L12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M12,14 C10.8954,14 10,14.8954 10,16 C10,17.1046 10.8954,18 12,18 C13.1046,18 14,17.1046 14,16 C14,14.8954 13.1046,14 12,14 Z M8,10 C6.89543,10 6,10.8954 6,12 C6,13.1046 6.89543,14 8,14 C9.10457,14 10,13.1046 10,12 C10,10.8954 9.10457,10 8,10 Z M16,10 C14.8954,10 14,10.8954 14,12 C14,13.1046 14.8954,14 16,14 C17.1046,14 18,13.1046 18,12 C18,10.8954 17.1046,10 16,10 Z M12,6 C10.8954,6 10,6.89543 10,8 C10,9.10457 10.8954,10 12,10 C13.1046,10 14,9.10457 14,8 C14,6.89543 13.1046,6 12,6 Z"
                                                    fill="currentColor"> </path>

                                            </svg>
                                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span class="font-semibold">کلیک برای انتخاب</span> یا کشیدن و رها کردن
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                {{ fileValidationRules.video.extensions.join(', ') }} (حداکثر {{
                                                    formatFileSize(fileValidationRules.video.maxSize, 0, 'fa') }} )
                                            </p>
                                        </div>

                                        <div v-else class="absolute inset-0">
                                            <img v-if="videoPreview.thumbnail" :src="videoPreview.thumbnail"
                                                class="w-full h-full object-cover"
                                                onerror="this.style.display='none'" />
                                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />
                                            <div class="z-10 absolute top-3 end-3 flex items-center gap-1.5 flex-wrap justify-end">
                                                <button
                                                    v-if="video && uploadStatus.video === 'uploading'"
                                                    type="button"
                                                    @click.prevent="cancelUpload('video')"
                                                    title="لغو آپلود"
                                                    class="h-8 px-3 rounded-lg bg-rose-500 text-white text-xs font-semibold shadow hover:bg-rose-600 transition">
                                                    لغو آپلود
                                                </button>
                                                <button
                                                    v-if="video_id && ['queued', 'processing'].includes(uploadStatus.video)"
                                                    type="button"
                                                    @click.prevent="cancelProcessing(video_id)"
                                                    :disabled="cancellingProcess"
                                                    title="لغو پردازش"
                                                    class="h-8 px-3 rounded-lg bg-rose-500 text-white text-xs font-semibold shadow hover:bg-rose-600 transition disabled:opacity-60">
                                                    {{ cancellingProcess ? '...' : 'لغو پردازش' }}
                                                </button>
                                                <button
                                                    v-if="video && (uploadStatus.video === 'pending' || uploadStatus.video === 'error')"
                                                    type="button"
                                                    @click.prevent="removeVideo"
                                                    title="حذف"
                                                    class="h-8 px-3 rounded-lg bg-rose-500 text-white text-xs font-semibold shadow hover:bg-rose-600 transition">
                                                    حذف
                                                </button>
                                                <button
                                                    v-if="video && (uploadStatus.video === 'pending' || uploadStatus.video === 'error')"
                                                    type="button"
                                                    @click.prevent="uploadFile(episode.id, 'video')"
                                                    title="آپلود مجدد"
                                                    class="h-8 px-3 rounded-lg bg-white/90 dark:bg-gray-900/90 text-xs font-semibold text-gray-800 dark:text-gray-100 shadow hover:bg-white transition">
                                                    آپلود
                                                </button>
                                                <button
                                                    v-if="video_id && ['processing-error', 'uploaded', 'queued', 'failed', 'processed'].includes(uploadStatus.video)"
                                                    type="button"
                                                    @click.prevent="startProcessing(video_id)"
                                                    :title="uploadStatus.video === 'processed' ? 'پردازش مجدد' : 'شروع پردازش'"
                                                    class="h-8 px-3 rounded-lg bg-yellow-400 text-gray-900 text-xs font-bold shadow hover:bg-yellow-300 transition">
                                                    {{ uploadStatus.video === 'processed' ? 'پردازش مجدد' : 'شروع پردازش' }}
                                                </button>
                                            </div>
                                            <div class="absolute bottom-3 start-3 end-3 z-10 flex items-center gap-2 text-white text-xs font-medium">
                                                <span class="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1" dir="ltr">{{ formatFileSize(videoPreview.size) }}</span>
                                                <span class="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1" dir="ltr">{{ videoPreview.duration }}</span>
                                                <span class="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 line-clamp-1 flex-1">{{ videoPreview.name }}</span>
                                            </div>
                                        </div>
                                        <!-- Progress Bar -->
                                        <div v-if="video && !progress.video.completed"
                                            :class="{ 'hidden': ['uploaded', 'processing', 'processed', 'processing-error'].includes(uploadStatus.video) }"
                                            class="absolute top-0 left-0 h-full flex items-center bg-green-400 bg-opacity-20 border-r-2 border-green-400/40 transition-all duration-500"
                                            :style="`width: ${progress.video.percent}%`">
                                            <div class="z-20 -mr-2 flex items-center justify-center text-center bg-green-400 text-white rounded-md py-2 text-xs font-medium font-serif"
                                                :class="{ '-mr-4': progress.video.percent <= 2, 'mr-0': progress.video.percent >= 99 }"
                                                style="writing-mode: vertical-rl!important;">
                                                {{ progress.video.percent }}% completed
                                            </div>
                                        </div>
                                        <!-- Error Overlay -->
                                        <div v-if="errors && errors.video"
                                            class="absolute top-0 left-0 h-full w-full flex items-center bg-rose-400 bg-opacity-20 transition-all duration-500">
                                        </div>
                                    </label>
                                </div>
                                <span v-if="errors && errors.video" class="mt-1 text-rose-500 text-xs font-medium block">
                                    {{ errors.video[0] }}
                                </span>

                                <div v-if="video_id || video || oldVideo" class="mt-4 space-y-3">
                                    <VideoProcessOptions
                                        v-model="processOptions"
                                        v-model:watermark-file="watermarkFile"
                                        :source-height="sourceHeight"
                                        :preview-file="video"
                                    />
                                    <div class="flex flex-wrap items-center gap-2">
                                        <button
                                            v-if="video_id && ['queued', 'processing'].includes(uploadStatus.video)"
                                            type="button"
                                            class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold bg-rose-500 text-white shadow-sm hover:bg-rose-600 transition disabled:opacity-60"
                                            :disabled="cancellingProcess"
                                            @click.prevent="cancelProcessing(video_id)">
                                            {{ cancellingProcess ? 'در حال لغو...' : 'لغو پردازش' }}
                                        </button>
                                        <button
                                            v-if="video_id && ['processing-error', 'uploaded', 'failed', 'processed'].includes(uploadStatus.video)"
                                            type="button"
                                            class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold bg-yellow-400 text-gray-900 shadow-sm hover:bg-yellow-300 transition disabled:opacity-60"
                                            :disabled="!canStartProcessing"
                                            @click.prevent="startProcessing(video_id)">
                                            {{ uploadStatus.video === 'processed' ? 'پردازش مجدد با تنظیمات انتخابی' : 'شروع پردازش با کیفیت‌های انتخابی' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-8 pt-6 border-t border-gray-200/80 dark:border-gray-700/80">
                        <AdminAttachmentsField
                            ref="attachmentsField"
                            title="فایل پیوست (PDF، ZIP و...)"
                            hint="منابع PDF، ZIP و سایر فایل‌های کمکی جلسه"
                            :accept="fileValidationRules.attached_file.extensions.join(',')"
                            :allowed-extensions="fileValidationRules.attached_file.extensions"
                            :allowed-types="fileValidationRules.attached_file.types"
                            :max-size="fileValidationRules.attached_file.maxSize"
                            :existing-files="existingAttachs"
                            :uploading="attachmentUploading"
                            :saving-title-id="savingAttachTitleId"
                            :removing-id="removingAttachId"
                            @change="onPendingAttachChange"
                            @remove-existing="removeExistingAttach"
                            @update-existing-title="updateExistingAttachTitle"
                        />
                    </div>
                    </section>
                    <section
                        v-show="currentStepId === 'confirm'"
                        class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm"
                    >
                        <div class="mb-5">
                            <h3 class="text-sm font-bold text-gray-900 dark:text-white">بررسی نهایی</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">اطلاعات جلسه را بررسی و ذخیره کنید</p>
                        </div>
                        <div class="grid gap-3 grid-cols-1 sm:grid-cols-2">
                            <div
                                v-for="item in confirmSummary"
                                :key="item.label"
                                class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 p-3"
                            >
                                <p class="text-[10px] font-medium text-gray-400 mb-1">{{ item.label }}</p>
                                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" :style="item.ltr ? 'direction: ltr' : ''">
                                    {{ item.value || '—' }}
                                </p>
                            </div>
                        </div>
                        <div v-if="video && uploadStatus.video === 'pending'" class="mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/40 p-3">
                            <p class="text-xs text-amber-800 dark:text-amber-200">با رفتن به مرحله بعد یا ثبت، آپلود ویدیو در پس‌زمینه آغاز می‌شود.</p>
                        </div>
                    </section>
                    </div>
                </div>
            </form>
        </div>

        <!-- Upload progress bottom sheet -->
        <BottomSheetDrawer
            v-model="showUploadProgressModal"
            :initialHeight="0.65"
            :maxHeight="0.9"
            :minHeight="0.45"
            :autoCloseOnMin="true"
            :closeOnBackdrop="true"
            :lockScroll="false"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[35rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'"
        >
            <div class="relative p-6 text-center">
                <h3 class="mb-2 text-base font-bold text-gray-900 dark:text-white">{{ uploadProgressTitle }}</h3>
                <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">{{ uploadProgressSubtitle }}</p>

                <div v-if="hasActiveFileTransfer" class="mb-5 flex flex-col items-center">
                    <div class="w-max h-max p-2 rounded-lg bg-white dark:bg-gray-900">
                        <svg class="text-gray-500 dark:text-gray-300" width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect fill="currentColor" x="1" y="1" rx="1" width="10" height="10">
                                <animate id="episode_spinner_c7A9" begin="0;episode_spinner_23zP.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze" />
                                <animate id="episode_spinner_Acnw" begin="episode_spinner_ZmWi.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze" />
                                <animate id="episode_spinner_iIcm" begin="episode_spinner_zfQN.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze" />
                                <animate id="episode_spinner_WX4U" begin="episode_spinner_rRAc.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze" />
                            </rect>
                            <rect fill="currentColor" x="1" y="13" rx="1" width="10" height="10">
                                <animate id="episode_spinner_YLx7" begin="episode_spinner_c7A9.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze" />
                                <animate id="episode_spinner_vwnJ" begin="episode_spinner_Acnw.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze" />
                                <animate id="episode_spinner_KQuy" begin="episode_spinner_iIcm.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze" />
                                <animate id="episode_spinner_arKy" begin="episode_spinner_WX4U.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze" />
                            </rect>
                            <rect fill="currentColor" x="13" y="13" rx="1" width="10" height="10">
                                <animate id="episode_spinner_ZmWi" begin="episode_spinner_YLx7.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze" />
                                <animate id="episode_spinner_zfQN" begin="episode_spinner_vwnJ.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze" />
                                <animate id="episode_spinner_rRAc" begin="episode_spinner_KQuy.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze" />
                                <animate id="episode_spinner_23zP" begin="episode_spinner_arKy.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze" />
                            </rect>
                        </svg>
                    </div>
                    <p v-if="uploadStatus.video === 'uploading' || attachmentUploading" class="mt-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        در حال آپلود
                        <span v-if="uploadStatus.video === 'uploading' && attachmentUploading">ویدیو و فایل پیوست</span>
                        <span v-else-if="uploadStatus.video === 'uploading'">ویدیو</span>
                        <span v-else>فایل پیوست</span>
                        ...
                    </p>
                    <p v-else-if="['queued', 'processing', 'uploaded'].includes(uploadStatus.video)" class="mt-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        ویدیو آپلود شده و در حال پردازش است...
                    </p>
                </div>

                <div class="mb-6 space-y-1 text-start">
                    <div v-if="video" class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">ویدیو</span>
                        <span class="text-xs text-gray-500">{{ videoStatusLabel }}</span>
                    </div>
                    <div v-if="attachmentUploading || pendingAttachCount" class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">فایل پیوست</span>
                        <MediaStatusBadge :status="attachmentUploading ? 'uploading' : 'pending'" />
                    </div>
                </div>

                <p class="text-xs text-gray-400">می‌توانید این پنجره را ببندید؛ آپلود و پردازش در پس‌زمینه ادامه دارد.</p>
            </div>
        </BottomSheetDrawer>

        <!-- Submit warning when files pending -->
        <BottomSheetDrawer
            v-model="showSubmitWarningModal"
            :initialHeight="0.5"
            :maxHeight="0.7"
            :minHeight="0.4"
            :autoCloseOnMin="true"
            :closeOnBackdrop="true"
            :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'"
        >
            <div class="relative p-5 text-center">
                <div class="rounded-2xl bg-amber-400/20 p-2 mb-3 mx-auto w-max">
                    <svg class="w-10 h-10 text-amber-500" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M227.3125,80.2345,175.76562,28.68762a16.11511,16.11511,0,0,0-11.3125-4.6875H91.54687a16.11515,16.11515,0,0,0-11.3125,4.6875L28.6875,80.2345A16.11511,16.11511,0,0,0,24,91.547v72.90625a16.11515,16.11515,0,0,0,4.6875,11.3125l51.54687,51.54687a16.11515,16.11515,0,0,0,11.3125,4.6875h72.90625a16.11511,16.11511,0,0,0,11.3125-4.6875l51.54688-51.54687A16.11515,16.11515,0,0,0,232,164.45325V91.547A16.11511,16.11511,0,0,0,227.3125,80.2345ZM120,80a8,8,0,1,1,16,0v56a8,8,0,1,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z" />
                    </svg>
                </div>
                <p class="mb-2 font-semibold text-gray-700 dark:text-gray-200">فایل‌ها هنوز آپلود نشده‌اند</p>
                <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
                    ویدیو یا فایل پیوست انتخاب شده ولی هنوز آپلود نشده. با ذخیره، آپلود آغاز می‌شود.
                </p>
                <div class="flex justify-center gap-3">
                    <button type="button" class="h-9 px-4 text-sm font-semibold text-gray-700 bg-gray-200 dark:bg-gray-600 rounded-lg" @click="showSubmitWarningModal = false">
                        انصراف
                    </button>
                    <button type="button" class="h-9 px-4 text-sm font-semibold text-gray-900 bg-yellow-400 rounded-lg" @click="confirmSubmitWithUpload">
                        ذخیره و شروع آپلود
                    </button>
                </div>
            </div>
        </BottomSheetDrawer>

        <BottomSheetDrawer v-model="showSuccessEditModal" :initialHeight="0.55" :maxHeight="0.75" :minHeight="0.4"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                                <div
                                    class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                    <div class="rounded-2xl bg-emerald-400/20 p-2 mb-3.5 mx-auto w-max">
                                        <svg class="w-14 h-14 text-green-400" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </div>
                                    <p class="mb-2 text-gray-700 dark:text-gray-200 font-semibold">
                                        جلسه با موفقیت ویرایش شده است.
                                    </p>
                                    <div v-if="video || pendingAttachCount || existingAttachs.length"
                                        class="mb-2 text-sm text-gray-600 dark:text-gray-300">
                                        <template v-if="video">
                                            <p v-if="uploadStatus.video === 'processed'" class="mb-1">
                                                ویدیو آپلود و پردازش شده است.
                                            </p>
                                            <p v-else class="mb-1">
                                                ویدیو آپلود شده و در حال پردازش است.
                                            </p>
                                        </template>
                                        <template v-if="existingAttachs.length || pendingAttachCount">
                                            <p class="mb-1">
                                                فایل‌های پیوست ذخیره شدند.
                                            </p>
                                        </template>
                                    </div>
                                    <p class="mb-4 text-gray-500 dark:text-gray-400 font-medium text-sm">میخوای توی
                                        همین
                                        صفحه بمونی یا بری به مشخصات دوره؟</p>
                                    <div class="flex justify-center items-center space-x-4 rtl:space-x-reverse">
                                        <button @click.prevent="() => { showSuccessEditModal = false }"
                                            class="h-9 py-2 px-3 text-sm font-semibold text-gray-700 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-700 focus:outline-none hover:text-gray-900 focus:z-10 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-500 focus:ring-gray-200 dark:focus:ring-gray-600">
                                            ماندن همینجا </button>
                                        <router-link
                                            :to="{ name: 'admin-course-details', params: { courseSlug: course.slug }, query: { section: 'episodes' } }"
                                            class="w-32 h-9 py-2 px-3 text-sm font-semibold text-center text-gray-800 bg-yellow-400 rounded-lg hover:bg-opacity-80 focus:ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-700 focus:outline-none focus:ring-yellow-400">
                                            رفتن به جلسات دوره
                                        </router-link>
                                    </div>
                                </div>
        </BottomSheetDrawer>

        <BottomSheetDrawer v-model="showErrorModal" :initialHeight="0.55" :maxHeight="0.75" :minHeight="0.4"
            :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                                <!-- Modal content -->
                                <div
                                    class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                    <div class="rounded-2xl bg-amber-400/20 p-2 mb-3.5 mx-auto w-max">
                                        <svg class="w-11 h-11 text-amber-400" fill="currentColor" viewBox="0 0 256 256"
                                            id="Flat" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M227.3125,80.2345,175.76562,28.68762a16.11511,16.11511,0,0,0-11.3125-4.6875H91.54687a16.11515,16.11515,0,0,0-11.3125,4.6875L28.6875,80.2345A16.11511,16.11511,0,0,0,24,91.547v72.90625a16.11515,16.11515,0,0,0,4.6875,11.3125l51.54687,51.54687a16.11515,16.11515,0,0,0,11.3125,4.6875h72.90625a16.11511,16.11511,0,0,0,11.3125-4.6875l51.54688-51.54687A16.11515,16.11515,0,0,0,232,164.45325V91.547A16.11511,16.11511,0,0,0,227.3125,80.2345ZM120,80.00012a8,8,0,1,1,16,0v56a8,8,0,1,1-16,0Zm8,104a12,12,0,1,1,12-12A12.0006,12.0006,0,0,1,128,184.00012Z">
                                            </path>
                                        </svg>
                                    </div>
                                    <p class="mb-2 text-gray-500 dark:text-gray-300 font-medium">برای این دوره هیچ
                                        فصلی
                                        تعریف
                                        نشده متاسفانه!</p>
                                    <p class="mb-4 text-gray-400 dark:text-gray-400 font-medium text-sm">
                                        میخوای یه فصل تعریف کنی اول؟
                                    </p>
                                    <div class="flex justify-center items-center space-x-4 rtl:space-x-reverse">
                                        <router-link
                                            :to="{ name: 'admin-course-details', params: { courseSlug: course.slug }, query: { section: 'episodes', createSection: 'true' } }"
                                            class="h-9 py-2 px-3 text-sm font-semibold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-700 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                            ایجاد فصل جدید</router-link>
                                        <router-link
                                            :to="{ name: 'admin-course-details', params: { courseSlug: course.slug } }"
                                            class="w-32 h-9 py-2 px-3 text-sm font-semibold text-center text-gray-700 bg-yellow-400 rounded-lg hover:bg-opacity-80 focus:ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-700 focus:outline-none focus:ring-yellow-400">
                                            مشخصات دوره
                                        </router-link>
                                    </div>
                                </div>
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>
<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminFormStepperNav from "@/views/components/admin/AdminFormStepperNav.vue";
import { createStepperMixin, BTN_SECONDARY } from "@/views/components/admin/adminFormStepperMixin.js";
import PN from "persian-number";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import axiosInstance from "@/store/axiosInstance";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { consumePendingEpisodeVideo } from "@/utils/episodeUploadBridge.js";
import VideoProcessOptions from "@/views/components/admin/VideoProcessOptions.vue";
import AdminAttachmentsField from "@/views/components/admin/AdminAttachmentsField.vue";
import MediaStatusBadge from "@/views/components/admin/MediaStatusBadge.vue";
import { defaultProcessOptions, buildProcessRequestBody } from "@/utils/videoProcessOptions.js";

const FORM_STEPS = [
    { id: "basic", label: "اطلاعات کلی", hint: "عنوان و انتشار" },
    { id: "details", label: "جزئیات آموزشی", hint: "توضیحات جلسه" },
    { id: "media", label: "فایل و رسانه", hint: "ویدیو و پیوست" },
    { id: "confirm", label: "تایید و ذخیره", hint: "بررسی نهایی" },
];

const stepperMixin = createStepperMixin();

export default {
    mixins: [stepperMixin],
    components: {
        AdminMasterPage,
        AdminFormStepperNav,
        LoadingComponent,
        EditorComponent,
        Listbox, ListboxButton, ListboxOptions, ListboxOption,
        BottomSheetDrawer,
        VideoProcessOptions,
        AdminAttachmentsField,
        MediaStatusBadge,
    },
    data() {
        return {
            BTN_SECONDARY,
            FORM_STEPS,
            updateLoading: false,
            showUploadProgressModal: false,
            showSubmitWarningModal: false,
            oldVideo: "",
            oldAttachedFile: "",
            existingAttachs: [],
            attachmentUploading: false,
            savingAttachTitleId: null,
            removingAttachId: null,
            pendingAttachCount: 0,
            pendingAttachTitles: [],
            loading: false,
            course: null,
            episode: null,
            selectedSection: null,
            selectedOrder: null,
            orderOptions: null,
            course_id: null,
            courseSlug: this.$route.params.courseSlug,
            sectionSlug: this.$route.params.sectionSlug,
            episodeSlug: this.$route.params.episodeSlug,
            createdCourse: null,
            video_id: null,
            sourceHeight: 720,
            watermarkFile: null,
            processOptions: defaultProcessOptions(720),
            errors: null,
            title: "",
            english_title: "",
            description: "",
            meta_keywords: "",
            publish_date: "",
            publish: 0,
            lock: 0,
            video: null,
            attached_file: null,
            videoPreview: {
                name: '',
                size: '',
                duration: '',
                thumbnail: ''
            },
            attachPreview: {
                name: '',
                size: '',
                ext: '',
            },
            progress: {
                video: {
                    percent: 0,
                    uploaded: 0,
                    total: 0,
                    speed: '',
                    completed: false
                },
                attached_file: {
                    percent: 0,
                    uploaded: 0,
                    total: 0,
                    speed: '',
                    completed: false
                },
            },
            controllers: {
                video: null,
                attached_file: null,
            },
            uploadStatus: {
                video: 'idle',
                attached_file: 'idle',
            },
            processingStatus: {
                video: 'idle',
            },
            processingProgress: null,
            cancellingProcess: false,
            workerToken: null,
            workerOrigin: '',
            statusTimer: null,
            fileValidationRules: {
                video: {
                    maxSize: 2 * 1024 * 1024 * 1024,
                    types: ['video/mp4', 'video/x-matroska'],
                    extensions: ['.mp4', '.mkv'],
                    required: false,
                    errorKey: 'video',
                    label: 'ویدیو',
                },
                attached_file: {
                    maxSize: 200 * 1024 * 1024,
                    types: [
                        'application/pdf',
                        'text/plain',
                        'application/zip',
                        'application/x-zip-compressed',
                        'text/csv',
                        'image/png',
                        'image/jpeg', // jpg
                        'image/jpeg', // jpeg
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.ms-word.document.macroEnabled.12',
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'application/vnd.ms-excel.sheet.macroEnabled.12',
                        'application/vnd.ms-powerpoint',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                        'application/vnd.ms-powerpoint.presentation.macroEnabled.12'
                    ],
                    extensions: [
                        '.pdf', '.txt', '.zip', '.csv', '.png', '.jpg', '.jpeg',
                        '.doc', '.docx', '.docm', '.xls', '.xlsx', '.xlsm',
                        '.ppt', '.pptx', '.pptm'
                    ],
                    required: false,
                    errorKey: 'attached_file',
                    label: 'فایل پیوست',
                },
            },
            showSuccessEditModal: false,
            showErrorModal: false,
            continueToCreateModal: false,
            showForm: false,
            formSubmited: false,
            successModalShown: false,
        };
    },
    watch: {
        uploadStatus: {
            handler(newStatus) {
                if (!this.formSubmited) return;
                const selectedFiles = Object.keys(newStatus).filter(key => newStatus[key] !== 'idle')

                if (selectedFiles.length === 0) {
                    if (!this.successModalShown) {
                        this.showSuccessEditModal = true;
                        this.successModalShown = true;
                    }
                    return
                }

                const allReady = selectedFiles.every(statusKey => {
                    if (statusKey === 'video') {
                        return ['processing', 'processed'].includes(newStatus.video)
                    } else {
                        return newStatus[statusKey] === 'uploaded'
                    }
                })

                if (allReady) {
                    if (!this.successModalShown) {
                        this.showUploadProgressModal = false;
                        this.showSuccessEditModal = true;
                        this.successModalShown = true;
                    }
                }
            },
            deep: true
        }
    },
    computed: {
        confirmSummary() {
            return [
                { label: "عنوان فارسی", value: this.title },
                { label: "عنوان انگلیسی", value: this.english_title, ltr: true },
                { label: "فصل", value: this.selectedSection?.title },
                { label: "شماره جلسه", value: this.selectedOrder },
                { label: "انتشار", value: String(this.publish) === "1" ? "منتشر شده" : "پیش‌نویس" },
                { label: "دسترسی", value: String(this.lock) === "1" ? "قفل" : "عمومی" },
                { label: "ویدیو", value: this.videoStatusLabel },
                { label: "پیوست‌ها", value: this.attachmentSummaryLabel },
            ];
        },
        videoStatusLabel() {
            if (this.uploadStatus.video === "processed") return "آپلود و پردازش شده";
            if (this.uploadStatus.video === "processing") {
                return typeof this.processingProgress === 'number'
                    ? `در حال پردازش... ${this.processingProgress}%`
                    : `در حال پردازش...`;
            }
            if (this.uploadStatus.video === "queued") return "در صف پردازش";
            if (this.uploadStatus.video === "uploaded") return "آپلود شده؛ در انتظار پردازش";
            if (this.uploadStatus.video === "uploading") return `در حال آپلود... ${this.progress.video.percent}%`;
            if (this.uploadStatus.video === "pending") return "در انتظار آپلود";
            if (this.oldVideo && !this.video) return "ویدیوی موجود";
            if (this.video) return this.videoPreview.name || "انتخاب شده";
            return "—";
        },
        canStartProcessing() {
            const outs = this.processOptions?.outputs || [];
            if (!outs.length) return false;
            if (outs.includes('stream') && !(this.processOptions?.stream_qualities?.length || this.processOptions?.qualities?.length)) {
                return false;
            }
            if (outs.includes('download') && !(this.processOptions?.download_qualities?.length || this.processOptions?.qualities?.length)) {
                return false;
            }
            const wm = this.processOptions?.watermark;
            if (wm?.enabled && wm.type === 'text' && !String(wm.text || '').trim()) {
                return false;
            }
            if (wm?.enabled && wm.type === 'image' && !this.watermarkFile) {
                return false;
            }
            return true;
        },
        hasActiveFileTransfer() {
            const videoActive = this.video && ["uploading", "queued", "processing", "uploaded"].includes(this.uploadStatus.video);
            return videoActive || this.attachmentUploading;
        },
        attachmentSummaryLabel() {
            const names = [
                ...(this.existingAttachs || []).map((row) => row.title).filter(Boolean),
                ...(this.pendingAttachTitles || []),
            ];
            return names.length ? names.join("، ") : "—";
        },
        uploadProgressTitle() {
            return this.formSubmited ? "جلسه ذخیره شد" : "فایل‌ها در حال آپلود و پردازش";
        },
        uploadProgressSubtitle() {
            if (this.formSubmited) {
                return "آپلود و پردازش در پس‌زمینه ادامه دارد.";
            }
            if (["queued", "processing", "uploaded"].includes(this.uploadStatus.video)) {
                return "ویدیو در حال پردازش است؛ می‌توانید سایر فیلدها را تکمیل کنید.";
            }
            return "آپلود در جریان است؛ می‌توانید این پنجره را ببندید و کار خود را ادامه دهید.";
        },
        metaKeywordsCount() {
            if (!this.meta_keywords) return 0;
            const keywords = this.meta_keywords.split(',').map(k => k.trim()).filter(k => k);
            return keywords.length;
        },
        priceInWords() {
            return this.price ? PN.convert(parseInt(this.price.replace(/,/g, ""))) : "";
        },
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
    },
    methods: {
        showToast(message, isError = false) {
            const opts = {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") === "rtl",
                bodyClassName: "font-YekanBakh",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            };
            if (isError) toast.error(message, opts);
            else toast.success(message, opts);
        },
        validateFormStep(stepIndex) {
            const stepId = this.FORM_STEPS[stepIndex]?.id;
            if (stepId === "basic") {
                const missing = [];
                if (!this.title?.trim()) missing.push("عنوان فارسی");
                if (!this.english_title?.trim()) missing.push("عنوان انگلیسی");
                if (missing.length) {
                    this.showToast(`لطفاً فیلدهای الزامی را تکمیل کنید: ${missing.join("، ")}`, true);
                    return false;
                }
            }
            return true;
        },
        applyPendingVideo() {
            const pending = consumePendingEpisodeVideo();
            if (!pending) return;
            this.video = pending.file;
            this.uploadStatus.video = "pending";
            if (pending.preview) {
                this.videoPreview = { ...pending.preview };
            }
            if (this.episode?.id) {
                this.currentStep = this.FORM_STEPS.findIndex((s) => s.id === "media");
                this.uploadFile(this.episode.id, "video");
                this.showToast("ویدیو در پس‌زمینه در حال آپلود است؛ می‌توانید سایر فیلدها را تکمیل کنید.");
            }
        },
        goToStep(index) {
            const steps = this.FORM_STEPS;
            if (index > this.currentStep && !this.validateFormStep(this.currentStep)) return;
            if (this.currentStepId === "media" && index > this.currentStep) {
                this.startPendingMediaUploads();
            }
            if (index >= 0 && index < steps.length) {
                this.currentStep = index;
            }
        },
        nextStep() {
            if (!this.validateFormStep(this.currentStep)) return;
            this.startPendingMediaUploads();
            if (this.currentStep < this.FORM_STEPS.length - 1) this.currentStep += 1;
        },
        startPendingMediaUploads() {
            if (!this.episode?.id || this.currentStepId !== "media") return;
            let started = false;
            if (this.video && this.uploadStatus.video === "pending") {
                this.uploadFile(this.episode.id, "video");
                started = true;
            }
            if (this.pendingAttachmentCount()) {
                this.uploadPendingAttachments(this.episode.id);
                started = true;
            }
            if (started) {
                this.showToast("آپلود در پس‌زمینه ادامه دارد؛ می‌توانید به مراحل بعدی بروید.");
            }
        },
        async initFromSlug() {
            this.loading = true;
            try {
                const response = await axiosInstance.post(`admin/course/${this.courseSlug}/section/${this.sectionSlug}/episode/${this.episodeSlug}/edit`);
                this.course = response.data.course;
                this.episode = response.data.episode;

                // pick section by URL or fallback to last
                const section = this.course.sections.find(sec => sec.slug === this.sectionSlug) || this.course.sections[this.course.sections.length - 1];
                this.selectedSection = section;

                // populate form fields
                this.title = this.episode.title || '';
                this.english_title = this.episode.english_title || '';
                this.description = this.episode.description || '';
                this.meta_keywords = this.episode.meta_keywords || '';
                this.publish_date = this.episode.publish_date || '';
                this.publish = this.episode.publish ? 1 : 0;
                this.lock = this.episode.lock ? 1 : 0;

                // Handle video data - don't set videoPreview for existing videos
                if (this.episode.video) {
                    this.oldVideo = this.episode.video;
                    this.uploadStatus.video = 'uploaded';
                    // Don't set videoPreview for existing videos - let the video player show
                }

                // Handle video processing status
                if (this.episode.video_status) {
                    this.processingStatus.video = this.episode.video_status;

                    // Set uploadStatus based on processing status
                    if (this.episode.video_status === 'processed') {
                        this.uploadStatus.video = 'processed';
                    } else if (this.episode.video_status === 'failed') {
                        this.uploadStatus.video = 'processing-error';
                    } else if (this.episode.video_status === 'queued') {
                        this.uploadStatus.video = 'queued';
                    } else if (this.episode.video_status === 'processing') {
                        this.uploadStatus.video = 'processing';
                    }
                }

                // Handle video ID for status polling
                if (this.episode.video_id) {
                    this.video_id = this.episode.video_id;
                    if (typeof this.episode.video_progress === 'number') {
                        this.processingProgress = this.episode.video_progress;
                    }
                    // Start status polling if video is not fully processed yet
                    if (this.processingStatus.video && this.processingStatus.video !== 'processed' && this.processingStatus.video !== 'failed') {
                        this.startStatusPolling(this.video_id);
                    }
                }

                // Handle attachment data
                this.existingAttachs = this.episode.attachs || (this.episode.attach ? [this.episode.attach] : []);
                if (this.episode.attach) {
                    this.oldAttachedFile = this.episode.attach;
                    this.uploadStatus.attached_file = 'uploaded';
                }

                // prepare ordering options and set current order
                this.prepareOrderOptions();
                this.selectedOrder = this.episode.order;

                this.applyPendingVideo();

            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        async getInitData() {
            this.continueToCreateModal = false;
            this.loading = true;
            await axiosInstance
                .post(`admin/course/${this.courseSlug}/dataForCreateEpisode`)
                .then((response) => {
                    this.course = response.data.course;
                    if (response.data.course.sections.length === 0) {
                        this.showErrorModal = true
                        return;
                        // alert("برای این دوره هنوز فصلی ایجاد نشده است، لطفا ابتدا یک فصل ایجاد کنید.")
                    }
                    // console.log(response.data);

                    this.lock = response.data.course.type === 'free' ? 0 : 1;

                    const defaultSection = this.course.sections.find(sec => sec.slug === this.$route.params.sectionSlug);
                    this.selectedSection = defaultSection ? defaultSection : this.course.sections[this.course.sections.length - 1];
                    this.prepareOrderOptions();

                    // when editing, preload episode by slug and fill form instead of creating
                    this.initFromSlug();

                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },


        prepareOrderOptions() {
            const sections = this.course.sections;
            const currentIndex = sections.findIndex(sec => sec.id === this.selectedSection.id);

            let minOrder = 1;
            for (let i = currentIndex - 1; i >= 0; i--) {
                const prevOrders = sections[i].episodes.map(ep => ep.order);
                if (prevOrders.length) {
                    minOrder = Math.max(...prevOrders) + 1;
                    break;
                }
            }

            let maxOrder;
            for (let i = currentIndex + 1; i < sections.length; i++) {
                const nextOrders = sections[i].episodes.map(ep => ep.order);
                if (nextOrders.length) {
                    maxOrder = Math.min(...nextOrders);
                    break;
                }
            }
            if (!maxOrder) {
                const allOrders = sections.flatMap(sec => sec.episodes.map(ep => ep.order));
                maxOrder = allOrders.length ? Math.max(...allOrders) + 1 : 1;
            }

            if (minOrder >= maxOrder) {
                this.orderOptions = [minOrder];
            } else {
                this.orderOptions = [];
                for (let i = minOrder; i <= maxOrder; i++) {
                    this.orderOptions.push(i);
                }
            }

            this.selectedOrder = maxOrder;
        },

        filterInputEnglishTitle() {
            this.english_title = this.english_title.replace(/[^a-zA-Z0-9 _-]/g, "");
        },

        handleChangeTag(tags) {
            this.tags = tags;
        },

        onInputPrice() {
            const rawNumber = this.formattedPrice.replace(/[^0-9]/g, "");
            this.formattedPrice = rawNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            this.price = rawNumber;
        },

        formatFileSize(bytes, decimal = 1, lang = 'en') {
            const units = {
                fa: ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'],
                en: ['B', 'KB', 'MB', 'GB']
            };

            const selectedUnits = units[lang] || units['en'];

            if (bytes < 1024) {
                return `${bytes} ${selectedUnits[0]}`;
            }
            if (bytes < 1024 * 1024) {
                return `${(bytes / 1024).toFixed(decimal)} ${selectedUnits[1]}`;
            }
            if (bytes < 1024 * 1024 * 1024) {
                return `${(bytes / (1024 * 1024)).toFixed(decimal)} ${selectedUnits[2]}`;
            }
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(decimal)} ${selectedUnits[3]}`;
        },

        formatDuration(seconds) {
            const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
            const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            const s = String(Math.floor(seconds % 60)).padStart(2, '0');
            return `${h}:${m}:${s}`;
        },

        openVideoPicker() {
            const input = this.$refs.video;
            if (input && typeof input.click === 'function') {
                input.click();
            }
        },

        handleVideo(e) {
            const file = (e.target?.files?.[0]) || (e.dataTransfer?.files?.[0]);
            if (!file) return;
            if (!this.validateFile(file, 'video')) {
                this.video = null;
                return;
            }

            // If there's an existing video, clear the old one first
            if (this.episode && this.episode.video) {
                this.episode.video = null;
                this.video_id = null;
                if (this.statusTimer) {
                    clearInterval(this.statusTimer);
                    this.statusTimer = null;
                }
            }

            this.video = file;
            this.uploadStatus.video = 'pending';
            this.processingStatus.video = 'idle';

            this.continueToCreateModal = true;

            const url = URL.createObjectURL(file);
            const video = document.createElement("video");
            video.src = url;
            video.currentTime = 1;
            video.muted = true;

            video.addEventListener("loadeddata", () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const thumbnail = canvas.toDataURL("image/jpeg");

                if (video.videoHeight > 0) {
                    this.sourceHeight = video.videoHeight;
                }

                this.videoPreview = {
                    name: file.name,
                    size: file.size,
                    duration: this.formatDuration(Math.floor(video.duration)),
                    thumbnail: thumbnail,
                    url: url,
                };

                URL.revokeObjectURL(url);
            });
        },

        handleAttach(e) {
            const file = (e.target?.files?.[0]) || (e.dataTransfer?.files?.[0]);
            if (!file) return;
            if (!this.validateFile(file, 'attached_file')) {
                this.attached_file = null;
                return;
            }

            this.attached_file = file;
            this.uploadStatus.attached_file = 'pending';

            const ext = file.name.split(".").pop().toLowerCase();
            this.attachPreview = {
                name: file.name,
                ext: ext,
                size: this.formatFileSize(file.size),
            };
        },

        async removeAttach() {
            try {
                // Cancel any ongoing upload
                this.cancelUpload('attached_file')
                this.uploadStatus.attached_file = 'idle';
                this.attached_file = null;
                if (this.$refs.attached_file) this.$refs.attached_file.value = null;
                this.attachPreview = {
                    name: '',
                    ext: '',
                    size: ''
                }
            } catch (error) {
                console.error('Error removing selected attachment:', error);
                toast.error('خطا در حذف فایل انتخاب شده', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },


        resetForm() {
            this.title = "";
            this.english_title = "";
            this.description = "";
            this.meta_keywords = "";
            this.publish_date = "";
            this.publish = 0;
            this.lock = 0;
            this.removeVideo();
            this.$refs.attachmentsField?.reset?.();
            this.pendingAttachCount = 0;
            this.pendingAttachTitles = [];
            this.$refs.description.reset();

        },

        submit() {
            if (!this.validateFormStep(0)) {
                this.currentStep = 0;
                return;
            }

            const hasPendingVideo = this.video && this.uploadStatus.video === "pending";
            const hasPendingAttach = this.pendingAttachmentCount() > 0;
            const videoInProgress = this.video && ["uploading", "queued", "processing", "uploaded"].includes(this.uploadStatus.video);
            const attachInProgress = this.attachmentUploading;

            if (hasPendingVideo || hasPendingAttach) {
                this.showSubmitWarningModal = true;
                return;
            }

            if (videoInProgress || attachInProgress) {
                this.showUploadProgressModal = true;
            }

            this.doSubmit();
        },
        doSubmit() {
            this.showSubmitWarningModal = false;
            this.updateLoading = true;
            this.loading = true;
            this.errors = null;

            if (this.video && !this.validateFile(this.video, "video")) {
                this.updateLoading = false;
                this.loading = false;
                return;
            }

            axiosInstance.post(`admin/course/${this.course.slug}/updateEpisode`, {
                title: this.title,
                english_title: this.english_title,
                description: this.description,
                meta_keywords: this.meta_keywords || null,
                publish_date: this.publish_date,
                publish: this.publish,
                lock: this.lock,
                order: this.selectedOrder,
                section_id: this.selectedSection.id,
                episode_id: this.episode.id,
            }).then((response) => {
                console.log(response.data)

                // Start uploads for files that are selected but not yet uploaded
                if (this.video && !["uploaded", "processed", "uploading", "queued", "processing"].includes(this.uploadStatus.video)) {
                    this.uploadFile(this.episode.id, "video");
                }
                if (this.pendingAttachmentCount()) {
                    this.uploadPendingAttachments(this.episode.id);
                }

                this.formSubmited = true;
                const willUploadVideo = this.video && !["uploaded", "processed", "uploading", "queued", "processing"].includes(this.uploadStatus.video);
                const willUploadAttach = this.pendingAttachmentCount() > 0 || this.attachmentUploading;
                const transferInProgress = (this.video && ["uploading", "queued", "processing", "uploaded"].includes(this.uploadStatus.video))
                    || this.attachmentUploading;

                if (willUploadVideo || willUploadAttach || transferInProgress) {
                    this.showUploadProgressModal = true;
                    this.showToast("فایل‌های جلسه در حال آپلود هستند؛ می‌توانید وضعیت را از باتم‌شیت ببینید.");
                } else {
                    this.showToast("ویرایش با موفقیت انجام شد.");
                    if (!this.video && !this.pendingAttachmentCount()) {
                        this.showSuccessEditModal = true;
                        this.successModalShown = true;
                    }
                }

            }).catch((error) => {
                this.errors = {
                    ...this.errors,
                    ...error.response?.data?.errors
                }
                console.error('Episode update failed:', this.errors);
            }).finally(() => {
                this.updateLoading = false;
                this.loading = false;
            })
        },
        confirmSubmitWithUpload() {
            this.showSubmitWarningModal = false;
            this.showUploadProgressModal = true;
            this.doSubmit();
        },

        pendingAttachmentCount() {
            return this.$refs.attachmentsField?.pendingForUpload?.()?.length || this.pendingAttachCount || 0;
        },
        onPendingAttachChange(files) {
            const pending = (files || []).filter((item) => item.status !== 'uploaded');
            this.pendingAttachCount = pending.length;
            this.pendingAttachTitles = pending.map((item) => item.title).filter(Boolean);
        },
        async uploadPendingAttachments(episodeId) {
            const field = this.$refs.attachmentsField;
            if (!field || !field.pendingForUpload().length) return;
            this.attachmentUploading = true;
            try {
                await field.uploadAll(async (item, onProgress) => {
                    const file = item.file;
                    const initRes = await axiosInstance.post(`admin/course/${this.courseSlug}/episode/uploadAttachedFile`, {
                        episode_id: episodeId,
                        filename: file.name,
                        mime: file.type || 'application/octet-stream',
                        size: file.size,
                        title: item.title || file.name,
                    });
                    const { uploadPath, uploadToken, workerUploadUrl } = initRes.data;
                    const formData = new FormData();
                    formData.append('path', uploadPath);
                    formData.append('file', file);
                    await axios.post(workerUploadUrl, formData, {
                        timeout: 3600 * 1000,
                        headers: { Authorization: `Bearer ${uploadToken}` },
                        onUploadProgress: (progressEvent) => {
                            const { loaded, total } = progressEvent;
                            onProgress(total ? Math.round((loaded * 100) / total) : 0);
                        },
                    });
                });
                const response = await axiosInstance.post(`admin/course/${this.courseSlug}/section/${this.sectionSlug}/episode/${this.episodeSlug}/edit`);
                this.existingAttachs = response.data.episode?.attachs || [];
                this.pendingAttachCount = 0;
                this.pendingAttachTitles = [];
            } finally {
                this.attachmentUploading = false;
            }
        },
        async removeExistingAttach(item) {
            if (!item?.id || !this.episode?.id) return;
            this.removingAttachId = item.id;
            try {
                await axiosInstance.post(`admin/course/${this.courseSlug}/episode/removeFile`, {
                    episode_id: this.episode.id,
                    file_type: 'attached_file',
                    attach_id: item.id,
                });
                this.existingAttachs = this.existingAttachs.filter((row) => row.id !== item.id);
                this.showToast('فایل پیوست حذف شد.');
            } catch (error) {
                this.showToast(error?.response?.data?.message || 'خطا در حذف فایل پیوست', true);
            } finally {
                this.removingAttachId = null;
            }
        },
        async updateExistingAttachTitle(item, title) {
            if (!item?.id || !this.episode?.id || !title) return;
            this.savingAttachTitleId = item.id;
            try {
                const res = await axiosInstance.post(`admin/course/${this.courseSlug}/episode/updateAttachedFile`, {
                    episode_id: this.episode.id,
                    attach_id: item.id,
                    title,
                });
                this.existingAttachs = this.existingAttachs.map((row) => row.id === item.id ? { ...row, ...res.data.attach, _editTitle: undefined } : row);
                this.showToast('نام فایل ذخیره شد.');
            } catch (error) {
                this.showToast(error?.response?.data?.message || 'خطا در ذخیره نام فایل', true);
            } finally {
                this.savingAttachTitleId = null;
            }
        },

        async uploadFile(episodeId, fileType) {
            const file = this[fileType];
            if (!file) return;

            if (this.controllers[fileType]) {
                this.controllers[fileType].abort();
            }

            const controller = new AbortController();
            this.controllers[fileType] = controller;
            // reset success modal guard for a new upload batch
            this.successModalShown = false;
            this.uploadStatus[fileType] = 'uploading';

            try {
                // 1) Init-upload on backend
                let initUrl = '';
                let initBody = { filename: file.name, mime: file.type, size: file.size };
                if (fileType === 'video') {
                    initUrl = 'admin/video/upload';
                    initBody.course_id = this.course.id;
                    initBody.episode_id = episodeId;
                    initBody.storage_disk = this.processOptions?.storage_disk || 'dl';
                } else if (fileType === 'attached_file') {
                    initUrl = `admin/course/${this.course.slug}/episode/uploadAttachedFile`;
                    initBody.episode_id = episodeId;
                }

                const initRes = await axiosInstance.post(initUrl, initBody);
                const { uploadPath, uploadToken, workerUploadUrl } = initRes.data;
                if (fileType === 'video') {
                    this.workerToken = uploadToken;
                    try { this.workerOrigin = new URL(workerUploadUrl).origin; } catch (e) { this.workerOrigin = ''; }
                }

                let workerRes;
                if (fileType === 'video') {
                    const { uploadVideoInChunks } = await import('@/utils/chunkedVideoUpload.js');
                    const data = await uploadVideoInChunks({
                        file,
                        uploadPath,
                        uploadToken,
                        workerUploadUrl,
                        signal: controller.signal,
                        onProgress: (percent) => {
                            const now = Date.now();
                            const loaded = Math.round((percent / 100) * file.size);
                            const timeElapsed = (now - (this.progress[fileType]?.lastTime || now)) / 1000;
                            const bytesUploaded = loaded - (this.progress[fileType]?.lastUploaded || 0);
                            const speed = timeElapsed > 0 ? bytesUploaded / timeElapsed : 0;
                            this.progress[fileType] = {
                                percent,
                                uploaded: loaded,
                                total: file.size,
                                speed: this.formatFileSize(speed) + '/s',
                                lastTime: now,
                                lastUploaded: loaded,
                            };
                        },
                    });
                    workerRes = { data };
                } else {
                    // 2) Upload to worker (attachments stay single-request)
                    const formData = new FormData();
                    formData.append('path', uploadPath);
                    formData.append('file', file);

                    workerRes = await axios.post(workerUploadUrl, formData, {
                        timeout: 3600 * 1000,
                        headers: { 'Authorization': `Bearer ${uploadToken}` },
                        signal: controller.signal,
                        onUploadProgress: (progressEvent) => {
                            const { loaded, total } = progressEvent;
                            const percentCompleted = Math.round((loaded * 100) / total);
                            const now = Date.now();
                            const timeElapsed = (now - (this.progress[fileType]?.lastTime || now)) / 1000;
                            const bytesUploaded = loaded - (this.progress[fileType]?.lastUploaded || 0);
                            const speed = bytesUploaded / timeElapsed;
                            this.progress[fileType] = {
                                percent: percentCompleted,
                                uploaded: loaded,
                                total: total,
                                speed: this.formatFileSize(speed) + '/s',
                                lastTime: now,
                                lastUploaded: loaded,
                            };
                        },
                    });
                }

                this.progress[fileType].completed = true;
                this.uploadStatus[fileType] = 'uploaded';

                if (fileType === 'video' && workerRes?.data?.video_id) {
                    this.video_id = workerRes.data.video_id;
                    this.uploadStatus.video = 'uploaded';
                    this.processingStatus.video = 'idle';
                    this.processingProgress = 0;
                    if (workerRes.data.height) {
                        this.sourceHeight = Number(workerRes.data.height) || this.sourceHeight;
                    }
                    // Fresh upload → encode from local inbox immediately (no FTP re-download).
                    if (this.canStartProcessing) {
                        this.startProcessing(this.video_id);
                    }
                }

                let type = '';
                if (fileType === 'video') type = 'ویدیو';
                else if (fileType === 'attached_file') type = 'فایل پیوست';

                toast.success(`${type} با موفقیت آپلود شد.`, {
                    theme: 'colored',
                    hideProgressBar: false,
                    rtl: localStorage.getItem('direction') == 'rtl' ? true : false,
                    bodyClassName: 'font-YekanBakh',
                    toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });

            } catch (error) {
                if (controller.signal.aborted || error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
                    this.uploadStatus[fileType] = 'pending';

                } else {
                    this.uploadStatus[fileType] = 'error';
                    console.error(`${fileType} upload failed:`, error);
                    const serverMsg = error?.response?.data?.message
                        || error?.response?.data?.error
                        || error?.message
                        || 'آپلود ناموفق بود';
                    toast.error(serverMsg, {
                        theme: 'colored',
                        hideProgressBar: false,
                        rtl: localStorage.getItem('direction') == 'rtl' ? true : false,
                        bodyClassName: 'font-YekanBakh',
                        toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }
            } finally {
                // Reset progress
                this.controllers[fileType] = null;
                this.progress[fileType] = {
                    percent: 0,
                    uploaded: 0,
                    total: 0,
                    speed: '',
                };
            }
        },

        cancelUpload(fileType) {
            if (this.controllers[fileType]) {
                this.controllers[fileType].abort();
                this.controllers[fileType] = null;
                this.progress[fileType] = {
                    percent: 0,
                    uploaded: 0,
                    total: 0,
                    speed: '',
                    completed: false
                };
                this.uploadStatus[fileType] = 'pending';
                toast.info(fileType === 'video' ? 'آپلود ویدیو لغو شد.' : 'آپلود لغو شد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },

        async cancelProcessing(videoId) {
            if (!videoId || this.cancellingProcess) return;
            this.cancellingProcess = true;
            try {
                await axiosInstance.post(`admin/video/process/${videoId}/cancel`, {}, { timeout: 30 * 1000 });
                this.uploadStatus.video = 'uploaded';
                this.processingStatus.video = 'idle';
                this.processingProgress = null;
                if (this.statusTimer) {
                    clearInterval(this.statusTimer);
                    this.statusTimer = null;
                }
                toast.success('پردازش لغو شد.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } catch (error) {
                console.error('Cancel processing failed:', error);
                toast.error(error?.response?.data?.message || 'لغو پردازش ناموفق بود', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.cancellingProcess = false;
            }
        },

        startProcessing(videoId) {
            if (!videoId) return;
            // If we already have live progress, just poll — don't re-queue / reset.
            if (
                this.uploadStatus.video === 'processing'
                || (typeof this.processingProgress === 'number' && this.processingProgress > 0 && this.uploadStatus.video !== 'processed' && this.uploadStatus.video !== 'processing-error')
            ) {
                this.startStatusPolling(videoId);
                toast.info('پردازش در حال اجراست؛ وضعیت در حال بروزرسانی است.', {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }

            this.uploadStatus.video = 'queued';
            this.processingStatus.video = 'queued';
            axiosInstance.post(
                `admin/video/process/${videoId}`,
                buildProcessRequestBody(this.processOptions, this.watermarkFile),
                { timeout: 60 * 1000 }
            )
                .then((res) => {
                    const status = res.data?.status || 'queued';
                    const progress = res.data?.progress;
                    if (typeof progress === 'number') this.processingProgress = progress;
                    if (status === 'processing') {
                        this.uploadStatus.video = 'processing';
                        this.processingStatus.video = 'processing';
                        toast.info("ویدیو در حال پردازش است.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    } else {
                        this.uploadStatus.video = 'queued';
                        this.processingStatus.video = 'queued';
                        toast.info("پردازش ویدیو در صف قرار گرفت.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    }
                    this.startStatusPolling(videoId);
                })
                .catch(error => {
                    const status = error?.response?.status;
                    if (status === 409) {
                        toast.warning("ویدیو در حال پردازش است.", {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                        this.uploadStatus.video = 'processing';
                        this.processingStatus.video = 'processing';
                        this.startStatusPolling(videoId);
                        return;
                    }
                    this.uploadStatus.video = 'processing-error';
                    this.processingStatus.video = 'failed';
                    console.error("Processing failed:", error);
                    toast.error(error?.response?.data?.message || 'شروع پردازش ناموفق بود', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                });
        },

        async getWorkerCredentials() {
            // Prefer backend Sanctum status API; keep method for compatibility
            return;
        },

        startStatusPolling(videoId) {
            if (!videoId) return;
            if (this.statusTimer) clearInterval(this.statusTimer);

            const applyStatus = (status, progress) => {
                if (typeof progress === 'number') {
                    this.processingProgress = progress;
                }
                // queued + progress means FFmpeg is already running
                if (status === 'queued' && typeof progress === 'number' && progress > 0) {
                    status = 'processing';
                }
                if (status === 'processed') {
                    this.processingStatus.video = 'processed';
                    this.uploadStatus.video = 'processed';
                    clearInterval(this.statusTimer);
                    this.statusTimer = null;
                } else if (status === 'failed') {
                    this.processingStatus.video = 'failed';
                    this.uploadStatus.video = 'processing-error';
                    clearInterval(this.statusTimer);
                    this.statusTimer = null;
                } else if (status === 'queued') {
                    this.processingStatus.video = 'queued';
                    this.uploadStatus.video = 'queued';
                } else {
                    this.processingStatus.video = 'processing';
                    this.uploadStatus.video = 'processing';
                }
            };

            const pollOnce = async () => {
                try {
                    const res = await axiosInstance.get(`admin/video/${videoId}/status`, { timeout: 10000 });
                    applyStatus(res.data?.status, res.data?.progress);
                } catch (e) {
                    // keep trying
                }
            };

            // Immediate refresh, then every 3s so UI tracks live encode progress.
            pollOnce();
            this.statusTimer = setInterval(pollOnce, 3000);
        },

        getFileExtension(url) {
            if (!url) return '';
            const parts = url.split('.');
            return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
        },

        reprocessVideo() {
            if (this.video_id) {
                this.startProcessing(this.video_id);
            }
        },

        removeVideo() {
            // Clear the currently selected video file (local file selection)
            this.video = null;
            this.uploadStatus.video = 'idle';
            this.processingStatus.video = 'idle';
            this.videoPreview = { name: '', duration: '', size: '', thumbnail: '', url: '' };
            if (this.statusTimer) {
                clearInterval(this.statusTimer);
                this.statusTimer = null;
            }
            if (this.$refs.video) this.$refs.video.value = null;

        },

        async removeFile(fileType) {
            try {
                await axiosInstance.post(`admin/course/${this.courseSlug}/episode/removeFile`, {
                    episode_id: this.episode.id,
                    file_type: fileType
                });

                toast.success(`${fileType === 'video' ? 'ویدیو' : 'فایل پیوست'} جلسه با موفقیت حذف شد`, {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });

                switch (fileType) {
                    case 'video':
                        this.oldVideo = "";
                        this.uploadStatus.video = 'idle';
                        this.processingStatus.video = 'idle';
                        this.video = null;
                        this.video_id = null;
                        if (this.$refs.video) this.$refs.video.value = null;
                        this.videoPreview = { name: '', duration: '', size: '', thumbnail: '' };
                        if (this.statusTimer) {
                            clearInterval(this.statusTimer);
                            this.statusTimer = null;
                        }
                        break;
                    case 'attached_file':
                        this.oldAttachedFile = "";
                        this.uploadStatus.attached_file = 'idle';
                        this.attached_file = null;
                        if (this.$refs.attached_file) this.$refs.attached_file.value = null;
                        this.attachPreview = { name: '', size: '', ext: '' };
                        break;
                }
            } catch (error) {
                console.error(`Error removing ${fileType}:`, error);
                toast.error(`خطا در حذف ${fileType === 'video' ? 'ویدیو' : 'فایل پیوست'} جلسه`, {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },

        validateFile(file, type) {
            const rules = this.fileValidationRules[type];
            if (!this.errors) this.errors = {};
            if (rules.required && !file) {
                this.errors[type] = [`فیلد ${rules.label} الزامی است.`];
                return false;
            }

            if (!file) {
                this.errors[type] = null;
                return true;
            }

            const ext = (file?.name?.split(".").pop() || '').toLowerCase();
            const extWithDot = ext ? `.${ext}` : '';

            const isValidExt = rules.extensions.includes(ext) || rules.extensions.includes(extWithDot);
            const isValidType = file.type && rules.types.includes(file.type);

            if (!isValidExt && !isValidType) {
                this.errors[type] = ['فرمت فایل مجاز نیست'];
                return false;
            }

            if (file.size > rules.maxSize) {
                this.errors[type] = [
                    `حجم ${rules.label} نباید بیشتر از ${this.formatFileSize(rules.maxSize, 0, 'fa')} باشد`
                ];
                return false;
            }

            this.errors[type] = null;
            return true;
        }
    },
    mounted() {
        document.title = "ویرایش جلسه";
        this.initFromSlug();
    }
};
</script>
<style>
.form-input {
    display: block;
    width: 100%;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.75rem;
    outline: none;
    background: #f3f4f6;
    color: #111827;
    border: 1px solid transparent;
}
.form-input:focus { box-shadow: 0 0 0 2px #facc15; }
.dark .form-input { background: #374151; color: #fff; }
.field-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.375rem;
}
.dark .field-label { color: #9ca3af; }
@media (min-width: 1024px) {
    .admin-form-layout { grid-template-columns: 14rem minmax(0, 1fr); }
}
</style>
