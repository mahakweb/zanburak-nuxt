<script setup>
definePageMeta({
  name: "admin-course-edit",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-courses-list' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    لیست دوره‌ها
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </span>
            </router-link>
            <router-link v-if="courseSlug" :to="{ name: 'admin-course-details', params: { courseSlug } }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">جزئیات دوره</span>
            </router-link>
        </template>

        <div class="min-w-0">
            <LoadingComponent v-if="loading" />

            <form v-else id="edit-course-form" @submit.prevent="submit">
                <div class="grid grid-cols-1 gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="updateLoading"
                        submit-label="تایید و ذخیره تغییرات"
                        :show-reset="currentStepId === 'confirm'"
                        reset-label="بازنشانی فرم"
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submit"
                        @reset="resetForm"
                    />

                    <div class="min-w-0 min-h-[420px]">
                        <section v-show="currentStepId === 'basic'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm">
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات کلی</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">عنوان، نوع، قیمت، انتشار و دسته‌بندی دوره</p>
                            </div>
                            <div class="grid gap-x-6 gap-y-3 mb-6 grid-cols-1 md:grid-cols-2">
                            <div>
                                <label for="title"
                                    class="field-label">عنوان فارسی
                                    دوره</label>
                                <input type="text" id="title" v-model="title"
                                    class="form-input"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.title }"
                                    placeholder="" required />
                                <span v-if="errors && errors.title" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.title[0] }}
                                </span>
                            </div>

                            <div>
                                <label for="english_title"
                                    class="field-label">عنوان
                                    انگلیسی دوره</label>
                                <input type="text" id="english_title" v-model="english_title"
                                    @input="filterInputEnglishTitle"
                                    class="form-input"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.english_title }"
                                    placeholder="" required />
                                <span v-if="errors && errors.english_title"
                                    class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.english_title[0] }}
                                </span>
                                <p class="text-xs text-gray-400 mt-1">این فیلد برای ساخت آدرس (slug) دوره استفاده
                                    می‌شود.</p>
                            </div>

                            <div>
                                <label for="type"
                                    class="field-label">نوع
                                    دوره</label>
                                <div>
                                    <ul
                                        class="h-10 grid w-full grid-cols-4 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                                        <li class="col-span-1">
                                            <input v-model="type" type="radio" id="type-free" name="type" value="free"
                                                class="hidden peer" required />
                                            <label for="type-free"
                                                class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                                <div class="block text-xs font-semibold text-center w-full">
                                                    رایگان
                                                </div>
                                            </label>
                                        </li>
                                        <li class="col-span-1">
                                            <input v-model="type" type="radio" id="type-cash" name="type" value="cash"
                                                checked class="hidden peer">
                                            <label for="type-cash"
                                                class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                                <div class="block text-xs font-semibold text-center w-full">
                                                    نقدی
                                                </div>
                                            </label>
                                        </li>
                                        <li class="col-span-2">
                                            <input v-model="type" type="radio" id="type-cash-vip" name="type"
                                                value="cash-vip" class="hidden peer">
                                            <label for="type-cash-vip"
                                                class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                                <div class="block text-xs font-semibold text-center w-full">
                                                    نقدی و اعضای ویژه
                                                </div>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                                <span v-if="errors && errors.type" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.type[0] }}
                                </span>
                            </div>

                            <div>
                                <label for="price"
                                    class="field-label">قیمت
                                    (تومان)</label>
                                <input type="text" id="price" v-model="formattedPrice" @input="onInputPrice"
                                    :disabled="type === 'free'"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.price }"
                                    placeholder="" />
                                <span v-if="errors && errors.price" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.price[0] }}
                                </span>
                                <p class="text-xs text-gray-400">&nbsp;{{ priceInWords }}&nbsp;<span v-if="priceInWords"
                                        class="">تومان</span></p>
                            </div>

                            <div>
                                <label for="publish"
                                    class="field-label">وضعیت
                                    انتشار</label>
                                <ul
                                    class="h-10 grid w-full gap-3 grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <li>
                                        <input v-model="publish" type="radio" id="publish-false" name="publish" :value="false"
                                            checked class="hidden peer" required />
                                        <label for="publish-false"
                                            class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                            <div class="block text-xs font-semibold text-center w-full">
                                                پیش‌نویس
                                            </div>
                                        </label>
                                    </li>
                                    <li>
                                        <input v-model="publish" type="radio" id="publish-true" name="publish" :value="true"
                                            class="hidden peer">
                                        <label for="publish-true"
                                            class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                            <div class="block text-xs font-semibold text-center w-full">
                                                منتشر شده
                                            </div>
                                        </label>
                                    </li>
                                </ul>
                                <p class="text-xs text-gray-400 mt-1">اگر در حالت "منتشر شده" باشد، دوره برای عموم قابل
                                    مشاهده خواهد بود.</p>
                            </div>

                            <div v-if="type !== 'free'" class="md:col-span-2">
                                <AdminInstallmentToggle
                                    v-model="allows_installment"
                                    :title="$t('admin.installment.title')"
                                    :description="$t('admin.installment.desc')"
                                />
                            </div>

                            <div class="md:col-span-2">
                                <AdminInstallmentToggle
                                    v-model="has_money_back_guarantee"
                                    :title="$t('admin.guarantee.title')"
                                    :description="$t('admin.guarantee.desc')"
                                />
                            </div>

                            <div>
                                <label for="tags"
                                    class="field-label">برچسب های
                                    دوره</label>
                                <vue3-tags-input
                                    class="bg-gray-100 border border-gray-300 text-gray-900 text-sm border-none rounded-lg focus:outline-none focus:border-none dark:focus:outline-none dark:focus:border-none focus-within:border-transparent dark:focus-within:border-transparent focus-within:ring-yellow-500 block w-full p-1 dark:bg-gray-700 dark:placeholder-gray-400 focus-within:ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 dark:text-white dark:focus-within:ring-yellow-500"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.tags }"
                                    placeholder="" :limit="3" :loading="true" :tags="tags" :duplicate-select-item="true"
                                    @on-tags-changed="handleChangeTag" />
                                <p class="text-xs text-gray-400 mt-1">تگ ها را وارد کنید و با زدن کلید اینتر یا فاصله آن
                                    هارا از هم جدا کنید</p>
                            </div>

                            <div>
                                <label for="categories"
                                    class="field-label">دسته
                                    بندی‌های دوره</label>
                                <AdvancedMultiSelect v-model="selectedCategories" :options="categories"
                                    :closeOnSelect="true" optionLabel="title" optionValue="id"
                                    :placeholder="'انتخاب کنید'" :enableSearch="true" :enableSelectAll="true"
                                    :enableClearAll="true"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 rounded-lg': errors && errors.categories }" />
                                <span v-if="errors && errors.categories" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.categories[0] }}
                                </span>

                                <p class="text-xs text-gray-400 mt-1">برای دسته بندی میتوانید چندین مورد را انتخاب کنید.
                                </p>
                            </div>
                            
                            <div>
                                <label for="paths"
                                    class="field-label">مسیرهای یادگیری</label>
                                <AsyncSearchSelect v-model="selectedPaths" class="h-11" searchApi="/admin/path/search/paths" :placeholder="'جستجو مسیر...'"></AsyncSearchSelect>
                                <!-- <p class="text-xs text-gray-400 mt-1">مسیرهایی که این دوره جز آن‌هاست را انتخاب کنید.
                                </p> -->
                            </div>
                        </div>
                        </section>

                        <section v-show="currentStepId === 'details'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm">
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">جزئیات آموزشی</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">توضیحات، سطح، وضعیت و تاریخ‌های دوره</p>
                            </div>
                            <div class="grid gap-6 mb-6 grid-cols-1 md:grid-cols-2">
                            <div class="md:col-span-2">
                                <label for="short_description"
                                    class="field-label">توضیح
                                    کوتاه</label>
                                <textarea id="short_description" rows="5" v-model="short_description"
                                    class="form-input"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.short_description }"
                                    placeholder=""></textarea>
                                <span v-if="errors && errors.short_description"
                                    class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.short_description[0] }}
                                </span>
                                <p class="text-xs text-gray-400 mt-1">توضیح مختصر در ۲-۳ جمله که دوره را معرفی می‌کند.
                                </p>
                            </div>

                            <div class="md:col-span-2">
                                <label for="description"
                                    class="flex items-center mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">توضیح
                                    کامل
                                    دوره
                                    <svg class="w-5 h-5 -rotate-90 ltr:hidden mt-1.5 ms-0.5" viewBox="0 0 24 24"
                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 17L16 15C16 12.7909 14.2091 11 12 11L7 11" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M10 8L7 11L10 14" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </label>
                                <EditorComponent ref="description" :submitButton="false" :cancelButton="false"
                                    :focusedBorder="'2px #eab308 solid'"
                                    :bodyClass="['bg-gray-100', 'text-gray-900', 'dark:bg-gray-700', 'dark:text-white']"
                                    :errors="errors && errors.description ? errors.description[0] : ''"
                                    :placeholder="'تمامی نکات، موضوعات تحت پوشش، اهداف آموزشی و نیازمندی‌های این دوره را بنویسید...'"
                                    v-model="description"> </EditorComponent>
                            </div>

                            <div class="md:col-span-2">
                                <label for="meta_keywords"
                                    class="field-label">کلمات کلیدی
                                    <span class="text-gray-400">(حداقل 3 و حداکثر 10 کلمه)</span>
                                </label>
                                <textarea id="meta_keywords" rows="3" v-model="meta_keywords"
                                    class="form-input"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.meta_keywords }"
                                    placeholder=", Laravel Framework"></textarea>
                                <span v-if="errors && errors.meta_keywords"
                                    class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.meta_keywords[0] }}
                                </span>
                                <p class="text-xs text-gray-400 mt-1">
                                    کلمات کلیدی را با کاما (,) جدا کنید. این کلمات برای SEO استفاده می‌شوند.
                                    <span class="block mt-1" :class="metaKeywordsCount < 3 || metaKeywordsCount > 10 ? 'text-rose-500' : 'text-green-500'">
                                        تعداد کلمات: {{ metaKeywordsCount }} / 3-10
                                    </span>
                                </p>
                            </div>

                            <div>
                                <label for="level"
                                    class="field-label">سطح
                                    دوره</label>
                                <select id="level" v-model="level_id"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.level_id }">

                                    <option value="" disabled selected>انتخاب کنید</option>
                                    <option v-for="(level, index) in levels" :key="index" :value="level.id">{{
                                        level.title }}</option>
                                </select>
                                <span v-if="errors && errors.level_id" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.level_id[0] }}
                                </span>
                            </div>

                            <div>
                                <label for="status"
                                    class="field-label">وضعیت
                                    دوره</label>
                                <select id="status" v-model="status_id"
                                    class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.status_id }">
                                    <option value="" disabled selected>انتخاب کنید</option>
                                    <option v-for="(status, index) in statuses" :key="index" :value="status.id">{{
                                        status.title }}</option>
                                </select>
                                <span v-if="errors && errors.status_id" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.status_id[0] }}
                                </span>
                            </div>

                            <div>
                                <label for="start_date"
                                    class="field-label">تاریخ
                                    شروع</label>
                                <input type="datetime-local" id="start_date" v-model="start_date"
                                    class="form-input text-center"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.start_date }" />
                                <span v-if="errors && errors.start_date" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.start_date[0] }}
                                </span>
                                <p class="text-xs text-gray-400">در صورت لایو بودن، تاریخ آغاز کلاس‌ها را وارد
                                    کنید.</p>
                            </div>

                            <div>
                                <label for="end_date"
                                    class="field-label">تاریخ
                                    پایان</label>
                                <input type="datetime-local" id="end_date" v-model="end_date"
                                    class="form-input text-center"
                                    :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.end_date }" />
                                <span v-if="errors && errors.end_date" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.end_date[0] }}
                                </span>
                                <p class="text-xs text-gray-400 mt-1">برای مدیریت طول دوره، تاریخ پایان را نیز مشخص
                                    کنید.</p>
                            </div>
                        </div>
                        </section>

                        <section v-show="currentStepId === 'certificate'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm">
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('cert.course.sectionTitle') }}</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('cert.course.sectionDesc') }}</p>
                            </div>
                            <AdminCertificateSettings
                                v-model="certificate_enabled"
                                :template-id="certificate_template_id"
                                :templates="certificateTemplates"
                                @update:template-id="certificate_template_id = $event"
                            />
                        </section>

                        <section v-show="currentStepId === 'media'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm">
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">فایل‌ها و رسانه</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">پوستر، تریلر و فایل‌های پیوست</p>
                            </div>
                            <div class="grid gap-3 mb-6 grid-cols-1 md:grid-cols-2">
                            <div>
                                <label for="poster"
                                    class="flex items-center justify-between mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                    پوستر دوره
                                    <MediaStatusBadge
                                        v-if="poster || oldPoster"
                                        :status="poster ? uploadStatus.poster : 'uploaded'"
                                        :percent="progress.poster.percent"
                                    />
                                </label>
                                <div class="flex items-center justify-center w-full">
                                    <div v-if="oldPoster && poster == null" class="relative w-full">
                                        <div
                                            class="w-full h-52 overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-700">
                                            <img onerror="this.style.display='none'" :src="oldPoster" class="w-full h-full object-cover" />
                                        </div>
                                        <div
                                            class="absolute top-2 start-2 z-10 flex items-center space-x-2 rtl:space-x-reverse">
                                            <button type="button" title="تغییر پوستر دوره"
                                                class="h-6 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 text-xs font-semibold px-2 py-[3px] rounded shadow hover:bg-opacity-90 dark:hover:bg-opacity-90 flex items-center"
                                                @click.stop="$refs.poster.click()">
                                                <svg class="w-5 h-5 me-1.5" viewBox="0 0 512 512" version="1.1"
                                                    xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" fill="none">

                                                    <path fill="currentColor"
                                                        d="M307.81,212.18c-3.24,0-6.07-2.17-6.91-5.3l-4.82-17.88c-0.84-3.12-3.68-5.3-6.91-5.3h-21.46h-25.44H220.8 c-3.24,0-6.07,2.17-6.91,5.3l-4.82,17.88c-0.84,3.12-3.68,5.3-6.91,5.3H169.5c-3.96,0-7.16,3.21-7.16,7.16v101.78 c0,3.96,3.21,7.16,7.16,7.16h170.95c3.96,0,7.16-3.21,7.16-7.16V219.35c0-3.96-3.21-7.16-7.16-7.16H307.81z M282.33,264.94 c-0.86,13.64-11.93,24.71-25.58,25.58c-16.54,1.05-30.18-12.59-29.14-29.14c0.86-13.64,11.93-24.71,25.58-25.58 C269.74,234.76,283.38,248.4,282.33,264.94z">
                                                    </path>

                                                    <path fill="currentColor"
                                                        d="M82.95,272.41c3.82,0,7.53-1.53,10.23-4.23l21.23-21.23c4.74-4.74,6.4-11.92,3.73-18.06 c-2.73-6.29-8.88-8.95-18.84-7.57l-0.27,0.27c15.78-71.56,79.7-125.27,155.94-125.27c60.72,0,115.41,33.72,142.73,87.99 c3.58,7.11,12.24,9.97,19.34,6.39c7.11-3.58,9.97-12.24,6.39-19.34c-15.47-30.73-39.05-56.66-68.22-75.01 C325.23,77.47,290.57,67.5,254.98,67.5c-93,0-170.48,67.71-185.75,156.41c-5.38-4.77-13.59-5.18-19.13-0.44 c-6.3,5.39-6.75,14.88-1.13,20.84c0.23,0.24,5.69,6.03,11.41,11.93c3.41,3.51,6.2,6.33,8.3,8.38c4.23,4.13,7.88,7.69,14.07,7.78 C82.81,272.41,82.88,272.41,82.95,272.41z">
                                                    </path>

                                                    <path fill="currentColor"
                                                        d="M464.28,247.82l-26.5-26.5c-2.75-2.75-6.57-4.3-10.44-4.23c-2.33,0.03-4.29,0.56-6.07,1.42 c-0.26,0.12-0.51,0.26-0.76,0.4c-0.04,0.02-0.08,0.04-0.12,0.06c-0.59,0.33-1.16,0.68-1.69,1.08c-1.88,1.34-3.6,3.03-5.44,4.82 c-2.1,2.05-4.89,4.87-8.3,8.38c-5.72,5.9-11.18,11.68-11.41,11.93c-5.46,5.79-5.19,14.91,0.6,20.36 c5.75,5.42,14.77,5.18,20.24-0.48c-4.72,83.85-74.42,150.62-159.43,150.62c-70.52,0-131.86-45.23-152.62-112.55 c-2.35-7.6-10.41-11.86-18.01-9.52c-7.6,2.34-11.86,10.41-9.52,18.01c11.62,37.68,35.48,71.52,67.19,95.28 c32.8,24.59,71.86,37.58,112.96,37.58c100.11,0,182.23-78.45,188.14-177.1l0.79,0.79c2.81,2.81,6.5,4.22,10.18,4.22 c3.69,0,7.37-1.41,10.18-4.22C469.91,262.57,469.91,253.45,464.28,247.82z">
                                                    </path>

                                                </svg>
                                                تغییر پوستر دوره
                                            </button>
                                        </div>
                                    </div>
                                    <label v-else for="poster"
                                        class="relative border-2 group flex flex-col items-center justify-center w-full h-52 rounded-lg cursor-pointer transition overflow-hidden"
                                        :class="[
                                            errors && errors.poster ? 'border-rose-500' : 'border-gray-300 dark:border-gray-500',
                                            posterPreview.url
                                                ? 'p-0'
                                                : 'bg-gray-50 dark:bg-gray-700 border-dashed hover:bg-gray-100 dark:hover:bg-gray-700/70'
                                        ]" @dragover.prevent @drop.prevent="handlePoster">
                                        <div v-if="!posterPreview.url" @click="$refs.poster.click()"
                                            class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink" fill="none">

                                                <path
                                                    d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                                                    id="MingCute" fill-rule="nonzero"> </path>
                                                <path
                                                    d="M20,3 C21.1046,3 22,3.89543 22,5 L22,19 C22,20.1046 21.1046,21 20,21 L4,21 C2.89543,21 2,20.1046 2,19 L2,5 C2,3.89543 2.89543,3 4,3 L20,3 Z M20,5 L4,5 L4,15.1005 L8.9948,10.1057 C9.48296,9.61757 10.2744,9.61757 10.7626,10.1057 L14.8284,14.1716 L16.0659,12.9342 C16.554,12.446 17.3455,12.446 17.8336,12.9342 L20,15.1005 L20,5 Z M15.5,7 C16.3284,7 17,7.67157 17,8.5 C17,9.32843 16.3284,10 15.5,10 C14.6716,10 14,9.32843 14,8.5 C14,7.67157 14.6716,7 15.5,7 Z"
                                                    fill="currentColor"> </path>

                                            </svg>
                                            <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span class="font-semibold">کلیک برای انتخاب</span> یا کشیدن و رها کردن
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                {{ fileValidationRules.poster.extensions }} (حداکثر {{
                                                    formatFileSize(fileValidationRules.poster.maxSize, 0, 'fa') }} )
                                            </p>
                                        </div>
                                        <div v-else class="absolute inset-0">
                                            <img onerror="this.style.display='none'" :src="posterPreview.url" class="w-full h-full object-cover " />
                                            <button
                                                v-if="poster && (uploadStatus.poster === 'pending' || uploadStatus.poster === 'error')"
                                                type="button" title="تغییر پوستر"
                                                class="z-10 absolute top-2 start-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 text-xs font-semibold px-2 py-[3px] rounded-lg shadow hover:bg-opacity-100 dark:hover:bg-opacity-100 flex items-center"
                                                @click.stop="$refs.poster.click()">
                                                <svg class="w-5 h-5 me-1.5" viewBox="0 0 512 512" version="1.1"
                                                    xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" fill="none">

                                                    <path fill="currentColor"
                                                        d="M307.81,212.18c-3.24,0-6.07-2.17-6.91-5.3l-4.82-17.88c-0.84-3.12-3.68-5.3-6.91-5.3h-21.46h-25.44H220.8 c-3.24,0-6.07,2.17-6.91,5.3l-4.82,17.88c-0.84,3.12-3.68,5.3-6.91,5.3H169.5c-3.96,0-7.16,3.21-7.16,7.16v101.78 c0,3.96,3.21,7.16,7.16,7.16h170.95c3.96,0,7.16-3.21,7.16-7.16V219.35c0-3.96-3.21-7.16-7.16-7.16H307.81z M282.33,264.94 c-0.86,13.64-11.93,24.71-25.58,25.58c-16.54,1.05-30.18-12.59-29.14-29.14c0.86-13.64,11.93-24.71,25.58-25.58 C269.74,234.76,283.38,248.4,282.33,264.94z">
                                                    </path>

                                                    <path fill="currentColor"
                                                        d="M82.95,272.41c3.82,0,7.53-1.53,10.23-4.23l21.23-21.23c4.74-4.74,6.4-11.92,3.73-18.06 c-2.73-6.29-8.88-8.95-18.84-7.57l-0.27,0.27c15.78-71.56,79.7-125.27,155.94-125.27c60.72,0,115.41,33.72,142.73,87.99 c3.58,7.11,12.24,9.97,19.34,6.39c7.11-3.58,9.97-12.24,6.39-19.34c-15.47-30.73-39.05-56.66-68.22-75.01 C325.23,77.47,290.57,67.5,254.98,67.5c-93,0-170.48,67.71-185.75,156.41c-5.38-4.77-13.59-5.18-19.13-0.44 c-6.3,5.39-6.75,14.88-1.13,20.84c0.23,0.24,5.69,6.03,11.41,11.93c3.41,3.51,6.2,6.33,8.3,8.38c4.23,4.13,7.88,7.69,14.07,7.78 C82.81,272.41,82.88,272.41,82.95,272.41z">
                                                    </path>

                                                    <path fill="currentColor"
                                                        d="M464.28,247.82l-26.5-26.5c-2.75-2.75-6.57-4.3-10.44-4.23c-2.33,0.03-4.29,0.56-6.07,1.42 c-0.26,0.12-0.51,0.26-0.76,0.4c-0.04,0.02-0.08,0.04-0.12,0.06c-0.59,0.33-1.16,0.68-1.69,1.08c-1.88,1.34-3.6,3.03-5.44,4.82 c-2.1,2.05-4.89,4.87-8.3,8.38c-5.72,5.9-11.18,11.68-11.41,11.93c-5.46,5.79-5.19,14.91,0.6,20.36 c5.75,5.42,14.77,5.18,20.24-0.48c-4.72,83.85-74.42,150.62-159.43,150.62c-70.52,0-131.86-45.23-152.62-112.55 c-2.35-7.6-10.41-11.86-18.01-9.52c-7.6,2.34-11.86,10.41-9.52,18.01c11.62,37.68,35.48,71.52,67.19,95.28 c32.8,24.59,71.86,37.58,112.96,37.58c100.11,0,182.23-78.45,188.14-177.1l0.79,0.79c2.81,2.81,6.5,4.22,10.18,4.22 c3.69,0,7.37-1.41,10.18-4.22C469.91,262.57,469.91,253.45,464.28,247.82z">
                                                    </path>

                                                </svg>
                                                تغییر
                                            </button>
                                            <div
                                                class="z-10 absolute top-2 end-2 flex items-center space-x-1 rtl:space-x-reverse">
                                                <button v-if="poster && uploadStatus.poster === 'uploading'"
                                                    @click.prevent="cancelUpload('poster')" title="لغو آپلود"
                                                    class="w-6 h-6 shadow rounded-lg bg-rose-500 text-white flex items-center justify-center">
                                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 32 32" version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path fill="currentColor"
                                                            d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z">
                                                        </path>
                                                    </svg>
                                                </button>
                                                <button
                                                    v-if="poster && (uploadStatus.poster === 'pending' || uploadStatus.poster === 'error')"
                                                    @click.prevent="removePoster" title="حذف"
                                                    class="w-6 h-6 shadow rounded-lg bg-rose-500 text-white flex items-center justify-center">
                                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z"
                                                            fill="currentColor"></path>
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12404C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001ZM10.2463 12.1886C10.2051 11.7548 9.83753 11.4382 9.42537 11.4816C9.01321 11.525 8.71251 11.9119 8.75372 12.3457L9.25372 17.6089C9.29494 18.0427 9.66247 18.3593 10.0746 18.3159C10.4868 18.2725 10.7875 17.8856 10.7463 17.4518L10.2463 12.1886ZM14.5746 11.4816C14.9868 11.525 15.2875 11.9119 15.2463 12.3457L14.7463 17.6089C14.7051 18.0427 14.3375 18.3593 13.9254 18.3159C13.5132 18.2725 13.2125 17.8856 13.2537 17.4518L13.7537 12.1886C13.7949 11.7548 14.1625 11.4382 14.5746 11.4816Z"
                                                            fill="currentColor"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    v-if="poster && course_id && (uploadStatus.poster === 'pending' || uploadStatus.poster === 'error')"
                                                    @click.prevent="uploadFile(course_id, 'poster')" title="آپلود "
                                                    class="px-2 h-6 text-xs font-semibold shadow rounded-lg bg-gray-700 text-white flex items-center justify-center">
                                                    <svg class="w-4 h-4 me-1.5" viewBox="0 0 24 24" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z"
                                                            fill="currentColor"></path>
                                                        <path
                                                            d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"
                                                            fill="currentColor"></path>
                                                    </svg>
                                                    آپلود
                                                </button>
                                            </div>
                                            <div
                                                class="absolute start-0 bottom-2 me-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 text-xs font-semibold px-2 py-1 rounded-e-lg shadow flex items-center">
                                                <div dir="ltr"
                                                    class="flex flex-col items-center font-sans shrink-0 text-start justify-start">
                                                    <span class="">size:</span>
                                                    <span class="">{{ posterPreview.size }}</span>
                                                </div>
                                                <div class="mx-2">|</div>
                                                <div dir="ltr"
                                                    class="flex flex-col items-center font-sans shrink-0 text-start justify-start">
                                                    <span class="">name:</span>
                                                    <span class="line-clamp-1">{{ posterPreview.name }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="poster && !progress.poster.completed"
                                            :class="{ 'hidden': uploadStatus.poster === 'uploaded' }"
                                            class="absolute top-0 left-0 h-full flex items-center bg-green-400 bg-opacity-20 border-r-2 border-green-400/40 transition-all duration-500"
                                            :style="`width: ${progress.poster.percent}%`">
                                            <div class="z-20 -mr-2 flex items-center justify-center text-center bg-green-400 text-white rounded-md py-2 text-xs font-medium font-serif"
                                                :class="{ '-mr-4': progress.poster.percent <= 2, 'mr-0': progress.poster.percent >= 99 }"
                                                style="writing-mode: vertical-rl!important;">{{ progress.poster.percent
                                                }}%
                                                completed</div>
                                        </div>
                                        <!-- errors -->
                                        <div v-if="errors && errors.poster"
                                            class="absolute top-0 left-0 h-full w-full flex items-center bg-rose-400 bg-opacity-20 transition-all duration-500">
                                        </div>
                                    </label>
                                    <input id="poster" ref="poster" type="file"
                                        :disabled="uploadStatus.poster === 'uploaded'"
                                        :accept="fileValidationRules.poster.extensions.join(',')" class="hidden"
                                        @change="handlePoster" />
                                </div>
                                <span v-if="errors && errors.poster" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.poster[0] }}
                                </span>
                                <p class="text-xs text-gray-400 mt-1">تصویر اصلی که در صفحه معرفی دوره نمایش داده
                                    می‌شود.</p>
                            </div>
                            <div>
                                <label for="trailer"
                                    class="flex items-center justify-between mb-1 text-xs font-medium text-gray-900 dark:text-gray-300 gap-2">
                                    ویدیوی معرفی دوره
                                    <span v-if="trailer || oldTrailer" class="flex items-center gap-1 flex-wrap justify-end">
                                        <MediaStatusBadge
                                            v-if="trailer && uploadStatus.trailer && uploadStatus.trailer !== 'idle'"
                                            :status="uploadStatus.trailer"
                                            :percent="progress.trailer.percent"
                                        />
                                        <MediaStatusBadge
                                            v-if="processingStatus.trailer && processingStatus.trailer !== 'idle'"
                                            :status="processingStatus.trailer"
                                        />
                                        <MediaStatusBadge v-else-if="oldTrailer && !trailer" status="processed" />
                                    </span>
                                </label>

                                <div class="flex items-center justify-center w-full">
                                    <div v-if="oldTrailer && trailer == null" class="relative w-full">
                                        <video class="rounded-lg w-full lg:h-52 border-2 border-gray-300 dark:border-gray-500" controls>
                                            <source :src="oldTrailer" :type="`video/${oldTrailer.split('.').pop()}`">
                                            Your browser does not support the video tag.
                                        </video>
                                        <div
                                            class="absolute top-2 start-2 z-10 flex items-center space-x-2 rtl:space-x-reverse">
                                            <button type="button" title="تغییر تریلر دوره"
                                                class="h-6 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 text-xs font-semibold px-2 py-[3px] rounded shadow hover:bg-opacity-90 dark:hover:bg-opacity-90 flex items-center"
                                                @click.stop="$refs.trailer.click()">
                                                <svg class="w-5 h-5 me-1.5" viewBox="0 0 512 512" version="1.1"
                                                    xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" fill="none">

                                                    <path fill="currentColor"
                                                        d="M307.81,212.18c-3.24,0-6.07-2.17-6.91-5.3l-4.82-17.88c-0.84-3.12-3.68-5.3-6.91-5.3h-21.46h-25.44H220.8 c-3.24,0-6.07,2.17-6.91,5.3l-4.82,17.88c-0.84,3.12-3.68,5.3-6.91,5.3H169.5c-3.96,0-7.16,3.21-7.16,7.16v101.78 c0,3.96,3.21,7.16,7.16,7.16h170.95c3.96,0,7.16-3.21,7.16-7.16V219.35c0-3.96-3.21-7.16-7.16-7.16H307.81z M282.33,264.94 c-0.86,13.64-11.93,24.71-25.58,25.58c-16.54,1.05-30.18-12.59-29.14-29.14c0.86-13.64,11.93-24.71,25.58-25.58 C269.74,234.76,283.38,248.4,282.33,264.94z">
                                                    </path>

                                                    <path fill="currentColor"
                                                        d="M82.95,272.41c3.82,0,7.53-1.53,10.23-4.23l21.23-21.23c4.74-4.74,6.4-11.92,3.73-18.06 c-2.73-6.29-8.88-8.95-18.84-7.57l-0.27,0.27c15.78-71.56,79.7-125.27,155.94-125.27c60.72,0,115.41,33.72,142.73,87.99 c3.58,7.11,12.24,9.97,19.34,6.39c7.11-3.58,9.97-12.24,6.39-19.34c-15.47-30.73-39.05-56.66-68.22-75.01 C325.23,77.47,290.57,67.5,254.98,67.5c-93,0-170.48,67.71-185.75,156.41c-5.38-4.77-13.59-5.18-19.13-0.44 c-6.3,5.39-6.75,14.88-1.13,20.84c0.23,0.24,5.69,6.03,11.41,11.93c3.41,3.51,6.2,6.33,8.3,8.38c4.23,4.13,7.88,7.69,14.07,7.78 C82.81,272.41,82.88,272.41,82.95,272.41z">
                                                    </path>

                                                    <path fill="currentColor"
                                                        d="M464.28,247.82l-26.5-26.5c-2.75-2.75-6.57-4.3-10.44-4.23c-2.33,0.03-4.29,0.56-6.07,1.42 c-0.26,0.12-0.51,0.26-0.76,0.4c-0.04,0.02-0.08,0.04-0.12,0.06c-0.59,0.33-1.16,0.68-1.69,1.08c-1.88,1.34-3.6,3.03-5.44,4.82 c-2.1,2.05-4.89,4.87-8.3,8.38c-5.72,5.9-11.18,11.68-11.41,11.93c-5.46,5.79-5.19,14.91,0.6,20.36 c5.75,5.42,14.77,5.18,20.24-0.48c-4.72,83.85-74.42,150.62-159.43,150.62c-70.52,0-131.86-45.23-152.62-112.55 c-2.35-7.6-10.41-11.86-18.01-9.52c-7.6,2.34-11.86,10.41-9.52,18.01c11.62,37.68,35.48,71.52,67.19,95.28 c32.8,24.59,71.86,37.58,112.96,37.58c100.11,0,182.23-78.45,188.14-177.1l0.79,0.79c2.81,2.81,6.5,4.22,10.18,4.22 c3.69,0,7.37-1.41,10.18-4.22C469.91,262.57,469.91,253.45,464.28,247.82z">
                                                    </path>

                                                </svg>
                                                تغییر تریلر دوره
                                            </button>
                                            <button @click.prevent="removeFile('trailer')" title="حذف تریلر دوره"
                                                class="h-6 text-white bg-rose-600 text-xs font-semibold px-2 py-[3px] rounded shadow hover:bg-opacity-90 dark:hover:bg-opacity-90 flex items-center">
                                                <svg class="w-4 h-4 me-1.5" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z"
                                                        fill="currentColor"></path>
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12404C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001ZM10.2463 12.1886C10.2051 11.7548 9.83753 11.4382 9.42537 11.4816C9.01321 11.525 8.71251 11.9119 8.75372 12.3457L9.25372 17.6089C9.29494 18.0427 9.66247 18.3593 10.0746 18.3159C10.4868 18.2725 10.7875 17.8856 10.7463 17.4518L10.2463 12.1886ZM14.5746 11.4816C14.9868 11.525 15.2875 11.9119 15.2463 12.3457L14.7463 17.6089C14.7051 18.0427 14.3375 18.3593 13.9254 18.3159C13.5132 18.2725 13.2125 17.8856 13.2537 17.4518L13.7537 12.1886C13.7949 11.7548 14.1625 11.4382 14.5746 11.4816Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                                حذف تریلر دوره
                                            </button>
                                        </div>
                                    </div>
                                    <label v-else for="trailer"
                                        class="relative border-2 group flex flex-col items-center justify-center w-full h-52 rounded-lg cursor-pointer transition overflow-hidden"
                                        :class="[
                                            errors && errors.trailer ? 'border-rose-500' : 'border-gray-300 dark:border-gray-500',
                                            trailerPreview.thumbnail
                                                ? 'p-0'
                                                : 'bg-gray-50 dark:bg-gray-700  border-dashed hover:bg-gray-100 dark:hover:bg-gray-700/70'
                                        ]" @dragover.prevent @drop.prevent="handleTrailer">
                                        <div v-if="!trailerPreview.thumbnail" @click="$refs.trailer.click()"
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
                                                {{ fileValidationRules.trailer.extensions }} (حداکثر {{
                                                    formatFileSize(fileValidationRules.trailer.maxSize, 0, 'fa') }} )
                                            </p>
                                        </div>

                                        <div v-else class="absolute inset-0">
                                            <img onerror="this.style.display='none'" :src="trailerPreview.thumbnail" class="w-full h-full object-cover " />
                                            
                                            <!-- Processing Status for New Uploaded Video -->
                                            <div v-if="processingStatus.trailer !== 'idle'" class="absolute bottom-2 left-2 right-2 bg-black/80 text-white text-xs p-2 rounded">
                                                <div v-if="processingStatus.trailer === 'queued'" class="text-blue-400">
                                                    در صف پردازش
                                                </div>
                                                <div v-else-if="processingStatus.trailer === 'processing'" class="flex items-center text-blue-400">
                                                    درحال پردازش ویدیو
                                                    <svg class="animate-spin w-4 h-4 ms-1" xmlns="http://www.w3.org/2000/svg" viewBox="-58 -58 116 116">
                                                        <g stroke-linecap="round" stroke-width="15">
                                                            <path id="a" d="m0 35 0,14" />
                                                            <use transform="rotate(210)" xlink:href="#a" stroke="#f0f0f0" />
                                                            <use transform="rotate(240)" xlink:href="#a" stroke="#ebebeb" />
                                                            <use transform="rotate(270)" xlink:href="#a" stroke="#d3d3d3" />
                                                            <use transform="rotate(300)" xlink:href="#a" stroke="#bcbcbc" />
                                                            <use transform="rotate(330)" xlink:href="#a" stroke="#a4a4a4" />
                                                            <use transform="rotate(0)" xlink:href="#a" stroke="#8d8d8d" />
                                                            <use transform="rotate(30)" xlink:href="#a" stroke="#757575" />
                                                            <use transform="rotate(60)" xlink:href="#a" stroke="#5e5e5e" />
                                                            <use transform="rotate(90)" xlink:href="#a" stroke="#464646" />
                                                            <use transform="rotate(120)" xlink:href="#a" stroke="#2f2f2f" />
                                                            <use transform="rotate(150)" xlink:href="#a" stroke="#171717" />
                                                            <use transform="rotate(180)" xlink:href="#a" stroke="#000" />
                                                        </g>
                                                    </svg>
                                                </div>
                                                <div v-else-if="processingStatus.trailer === 'processed'" class="text-green-400">
                                                    ویدیو پردازش شده است
                                                </div>
                                                <div v-else-if="processingStatus.trailer === 'failed'" class="text-red-400">
                                                    خطا در پردازش ویدیو
                                                </div>
                                            </div>
                                            <button
                                                v-if="trailer && (uploadStatus.trailer === 'pending' || uploadStatus.trailer === 'upload-error')"
                                                type="button" title="تغییر تریلر"
                                                class="z-10 absolute top-2 start-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 text-xs font-semibold px-2 py-[3px] rounded-lg shadow hover:bg-opacity-90 dark:hover:bg-opacity-90 flex items-center"
                                                @click.stop="$refs.trailer.click()">
                                                <svg class="w-5 h-5 me-1.5" viewBox="0 0 512 512" version="1.1"
                                                    xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" fill="none">

                                                    <path fill="currentColor"
                                                        d="M307.81,212.18c-3.24,0-6.07-2.17-6.91-5.3l-4.82-17.88c-0.84-3.12-3.68-5.3-6.91-5.3h-21.46h-25.44H220.8 c-3.24,0-6.07,2.17-6.91,5.3l-4.82,17.88c-0.84,3.12-3.68,5.3-6.91,5.3H169.5c-3.96,0-7.16,3.21-7.16,7.16v101.78 c0,3.96,3.21,7.16,7.16,7.16h170.95c3.96,0,7.16-3.21,7.16-7.16V219.35c0-3.96-3.21-7.16-7.16-7.16H307.81z M282.33,264.94 c-0.86,13.64-11.93,24.71-25.58,25.58c-16.54,1.05-30.18-12.59-29.14-29.14c0.86-13.64,11.93-24.71,25.58-25.58 C269.74,234.76,283.38,248.4,282.33,264.94z">
                                                    </path>

                                                    <path fill="currentColor"
                                                        d="M82.95,272.41c3.82,0,7.53-1.53,10.23-4.23l21.23-21.23c4.74-4.74,6.4-11.92,3.73-18.06 c-2.73-6.29-8.88-8.95-18.84-7.57l-0.27,0.27c15.78-71.56,79.7-125.27,155.94-125.27c60.72,0,115.41,33.72,142.73,87.99 c3.58,7.11,12.24,9.97,19.34,6.39c7.11-3.58,9.97-12.24,6.39-19.34c-15.47-30.73-39.05-56.66-68.22-75.01 C325.23,77.47,290.57,67.5,254.98,67.5c-93,0-170.48,67.71-185.75,156.41c-5.38-4.77-13.59-5.18-19.13-0.44 c-6.3,5.39-6.75,14.88-1.13,20.84c0.23,0.24,5.69,6.03,11.41,11.93c3.41,3.51,6.2,6.33,8.3,8.38c4.23,4.13,7.88,7.69,14.07,7.78 C82.81,272.41,82.88,272.41,82.95,272.41z">
                                                    </path>

                                                    <path fill="currentColor"
                                                        d="M464.28,247.82l-26.5-26.5c-2.75-2.75-6.57-4.3-10.44-4.23c-2.33,0.03-4.29,0.56-6.07,1.42 c-0.26,0.12-0.51,0.26-0.76,0.4c-0.04,0.02-0.08,0.04-0.12,0.06c-0.59,0.33-1.16,0.68-1.69,1.08c-1.88,1.34-3.6,3.03-5.44,4.82 c-2.1,2.05-4.89,4.87-8.3,8.38c-5.72,5.9-11.18,11.68-11.41,11.93c-5.46,5.79-5.19,14.91,0.6,20.36 c5.75,5.42,14.77,5.18,20.24-0.48c-4.72,83.85-74.42,150.62-159.43,150.62c-70.52,0-131.86-45.23-152.62-112.55 c-2.35-7.6-10.41-11.86-18.01-9.52c-7.6,2.34-11.86,10.41-9.52,18.01c11.62,37.68,35.48,71.52,67.19,95.28 c32.8,24.59,71.86,37.58,112.96,37.58c100.11,0,182.23-78.45,188.14-177.1l0.79,0.79c2.81,2.81,6.5,4.22,10.18,4.22 c3.69,0,7.37-1.41,10.18-4.22C469.91,262.57,469.91,253.45,464.28,247.82z">
                                                    </path>

                                                </svg>
                                                تغییر
                                            </button>
                                            <div
                                                class="z-10 absolute top-2 end-2 flex items-center space-x-1 rtl:space-x-reverse">
                                                <button v-if="trailer && uploadStatus.trailer === 'uploading'"
                                                    @click.prevent="cancelUpload('trailer')" title="لغو آپلود"
                                                    class="w-6 h-6 shadow rounded-lg bg-rose-500 text-white flex items-center justify-center">
                                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 32 32" version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path fill="currentColor"
                                                            d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z">
                                                        </path>
                                                    </svg>
                                                </button>
                                                <button
                                                    v-if="trailer && (uploadStatus.trailer === 'pending' || uploadStatus.trailer === 'upload-error')"
                                                    @click.prevent="removeTrailer" title="حذف"
                                                    class="w-6 h-6 shadow rounded-lg bg-rose-500 text-white flex items-center justify-center">
                                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z"
                                                            fill="currentColor"></path>
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12404C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001ZM10.2463 12.1886C10.2051 11.7548 9.83753 11.4382 9.42537 11.4816C9.01321 11.525 8.71251 11.9119 8.75372 12.3457L9.25372 17.6089C9.29494 18.0427 9.66247 18.3593 10.0746 18.3159C10.4868 18.2725 10.7875 17.8856 10.7463 17.4518L10.2463 12.1886ZM14.5746 11.4816C14.9868 11.525 15.2875 11.9119 15.2463 12.3457L14.7463 17.6089C14.7051 18.0427 14.3375 18.3593 13.9254 18.3159C13.5132 18.2725 13.2125 17.8856 13.2537 17.4518L13.7537 12.1886C13.7949 11.7548 14.1625 11.4382 14.5746 11.4816Z"
                                                            fill="currentColor"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    v-if="trailer && course_id && (uploadStatus.trailer === 'pending' || uploadStatus.trailer === 'upload-error')"
                                                    @click.prevent="uploadFile(course_id, 'trailer')"
                                                    title="آپلود تریلر"
                                                    class="px-2 h-6 text-xs font-semibold shadow rounded-lg bg-gray-700 text-white flex items-center justify-center">
                                                    <svg class="w-4 h-4 me-1.5" viewBox="0 0 24 24" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z"
                                                            fill="currentColor"></path>
                                                        <path
                                                            d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"
                                                            fill="currentColor"></path>
                                                    </svg>
                                                    آپلود
                                                </button>
                                                <button
                                                    v-if="course_id && processingStatus.trailer === 'failed'"
                                                    @click.prevent="startProcessing(video_id)" title="پردازش مجدد"
                                                    class="w-6 h-6 shadow rounded-lg bg-gray-700 text-white flex items-center justify-center">
                                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 14 14" role="img"
                                                        focusable="false" aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path fill="currentColor"
                                                            d="M9.21052629 1.96315795l3.7578947.50526315-3.09473681 3.0947368zM4.78947371 12.06842099l-3.7578947-.50526315 3.09473681-3.0947368zM1.94736848 4.80526318l.50526315-3.7578947 3.0947368 3.09473681z">
                                                        </path>
                                                        <path fill="currentColor"
                                                            d="M2.3578948 6.13157895l-1.32631578.25263158c-.03157895.22105263-.03157895.41052631-.03157895.63157894 0 1.45263156.50526315 2.84210523 1.45263156 3.91578943l.94736841-.82105262c-.72631578-.85263157-1.13684209-1.95789472-1.13684209-3.09473681 0-.28421052.03157895-.6.09473684-.88421052zM7 1.01578954c-1.70526314 0-3.2210526.72631578-4.32631574 1.86315787l.88421052.88421052C4.44210529 2.84736847 5.64210528 2.27894742 7 2.27894742c.28421052 0 .6.03157895.88421052.09473684l.22105262-1.23157893C7.75789473 1.04736849 7.37894736 1.01578954 7 1.01578954zm4.6421052 6.88421045l1.32631578-.25263158c.03157895-.22105263.03157895-.41052631.03157895-.63157894 0-1.38947367-.4736842-2.74736839-1.35789472-3.82105259l-.97894736.78947368c.69473684.85263157 1.0736842 1.92631577 1.0736842 2.99999996 0 .31578947-.03157895.63157894-.09473684.91578947zm-1.19999998 2.36842102C9.55789471 11.18421047 8.35789472 11.75263152 7 11.75263152c-.28421052 0-.6-.03157895-.88421052-.09473684l-.22105262 1.23157893c.37894736.0631579.75789472.09473684 1.10526314.09473684 1.70526314 0 3.2210526-.72631578 4.32631574-1.86315787l-.88421052-.85263157z">
                                                        </path>
                                                        <path fill="currentColor"
                                                            d="M12.05263152 9.22631576l-.50526315 3.7578947-3.0947368-3.09473681z">
                                                        </path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div
                                                class="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
                                                <svg width="50" height="50" viewBox="0 0 67 67" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="33.5" cy="33.5" r="33.5" class="fill-white/90"></circle>
                                                    <path class="text-gray-500"
                                                        d="M29.9118 47.4749C26.7852 49.2801 22.8769 47.0236 22.8769 43.4133L22.8769 23.4136C22.8769 19.8032 26.7852 17.5468 29.9119 19.352L47.2321 29.3518C50.3587 31.157 50.3587 35.6699 47.2321 37.4751L29.9118 47.4749Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </div>
                                            <div
                                                class="absolute start-0 bottom-2 me-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 text-xs font-semibold px-2 py-1 rounded-e-lg shadow flex items-center">
                                                <div dir="ltr"
                                                    class="flex flex-col items-center font-sans shrink-0 text-start justify-start">
                                                    <span class="">size:</span>
                                                    <span class="">{{ formatFileSize(trailerPreview.size) }}</span>
                                                </div>
                                                <div class="mx-2">|</div>
                                                <div dir="ltr"
                                                    class="flex flex-col items-center font-sans shrink-0 text-start justify-start">
                                                    <span class="">duration:</span>
                                                    <span class="line-clamp-1">{{ trailerPreview.duration }}</span>
                                                </div>
                                                <div class="mx-2">|</div>
                                                <div dir="ltr"
                                                    class="flex flex-col items-center font-sans shrink-0 text-start justify-start">
                                                    <span class="">name:</span>
                                                    <span class="line-clamp-1">{{ trailerPreview.name }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="trailer && !progress.trailer.completed"
                                            :class="{ 'hidden': ['uploaded', 'upload-error'].includes(uploadStatus.trailer) || ['queued', 'processing', 'processed', 'failed'].includes(processingStatus.trailer) }"
                                            class="absolute top-0 left-0 h-full flex items-center bg-green-400 bg-opacity-20 border-r-2 border-green-400/40 transition-all duration-500"
                                            :style="`width: ${progress.trailer.percent}%`">
                                            <div class="z-20 -mr-2 flex items-center justify-center text-center bg-green-400 text-white rounded-md py-2 text-xs font-medium font-serif"
                                                :class="{ '-mr-4': progress.trailer.percent <= 2, 'mr-0': progress.trailer.percent >= 99 }"
                                                style="writing-mode: vertical-rl!important;">{{ progress.trailer.percent
                                                }}%
                                                completed</div>
                                        </div>
                                        <!-- errors -->
                                        <div v-if="errors && errors.trailer"
                                            class="absolute top-0 left-0 h-full w-full flex items-center bg-rose-400 bg-opacity-20 transition-all duration-500">
                                        </div>
                                    </label>
                                    <input id="trailer" ref="trailer" type="file"
                                        :disabled="uploadStatus.trailer === 'uploading' || ['queued', 'processing'].includes(processingStatus.trailer)"
                                        :accept="fileValidationRules.trailer.extensions.join(',')" class="hidden"
                                        @change="handleTrailer" />
                                </div>
                                <span v-if="errors && errors.trailer" class="mt-1 text-rose-500 text-xs font-medium">
                                    {{ errors.trailer[0] }}
                                </span>
                                <CourseTrailerProcessSettings
                                    v-if="trailer"
                                    class="mt-4"
                                    :process-enabled="processEnabled"
                                    :process-options="processOptions"
                                    :watermark-file="watermarkFile"
                                    :source-height="sourceHeight"
                                    :preview-file="trailer"
                                    @update:process-enabled="processEnabled = $event"
                                    @update:process-options="processOptions = $event"
                                    @update:watermark-file="watermarkFile = $event"
                                />
                            </div>

                            <div class="md:col-span-2 md:mt-8">
                                <AdminAttachmentsField
                                    ref="attachmentsField"
                                    title="فایل پیوست (PDF، ZIP و...)"
                                    :hint="`فایل‌های اضافی مثل منابع PDF و تمرین. فرمت‌های مجاز: ${fileValidationRules.attached_file.extensions.join(', ')}`"
                                    :accept="fileValidationRules.attached_file.extensions.join(',')"
                                    :allowed-extensions="fileValidationRules.attached_file.extensions"
                                    :allowed-types="fileValidationRules.attached_file.types"
                                    :max-size="fileValidationRules.attached_file.maxSize"
                                    :existing-files="existingAttachs"
                                    :uploading="attachmentUploading"
                                    :saving-title-id="savingAttachTitleId"
                                    :removing-id="removingAttachId"
                                    @remove-existing="removeExistingAttach"
                                    @update-existing-title="updateExistingAttachTitle"
                                />
                            </div>
                        </div>
                        </section>

                        <section v-show="currentStepId === 'confirm'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm space-y-5">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">بررسی و تایید نهایی</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">اطلاعات وارد شده را بررسی کنید</p>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div v-for="item in confirmSummary" :key="item.label" class="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 px-4 py-3">
                                    <p class="text-[10px] font-medium text-gray-400 mb-0.5">{{ item.label }}</p>
                                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" :style="item.ltr ? 'direction: ltr' : ''">{{ item.value || '—' }}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </form>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminFormStepperNav from "@/views/components/admin/AdminFormStepperNav.vue";
import { createStepperMixin, BTN_SECONDARY } from "@/views/components/admin/adminFormStepperMixin.js";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import Vue3TagsInput from "vue3-tags-input";
import AdvancedMultiSelect from "@/views/components/multiselect/AdvancedMultiSelect.vue";
import AsyncSearchSelect from "@/views/components/multiselect/AsyncSearchSelect.vue";
import PN from "persian-number";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import axiosInstance from "@/store/axiosInstance";
import axios from "axios";
import { listCertificateTemplates } from "@/services/certificate.service";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import AdminInstallmentToggle from "@/views/components/admin/AdminInstallmentToggle.vue";
import AdminCertificateSettings from "@/views/components/admin/AdminCertificateSettings.vue";
import AdminAttachmentsField from "@/views/components/admin/AdminAttachmentsField.vue";
import MediaStatusBadge from "@/views/components/admin/MediaStatusBadge.vue";
import CourseTrailerProcessSettings from "@/views/components/admin/CourseTrailerProcessSettings.vue";
import { defaultProcessOptions, buildProcessRequestBody, probeVideoHeightFromFile } from "@/utils/videoProcessOptions.js";


const FORM_STEPS = [
    { id: "basic", label: "اطلاعات کلی", hint: "عنوان و قیمت" },
    { id: "details", label: "جزئیات آموزشی", hint: "توضیحات دوره" },
    { id: "certificate", label: "گواهینامه", hint: "تنظیمات مدرک" },
    { id: "media", label: "فایل و رسانه", hint: "پوستر و تریلر" },
    { id: "confirm", label: "تایید و ذخیره", hint: "بررسی نهایی" },
];

const stepperMixin = createStepperMixin();

export default {
    mixins: [stepperMixin],
    components: {
        AdminFormStepperNav,
        AdminMasterPage,
        EditorComponent,
        Vue3TagsInput,
        AdvancedMultiSelect,
        AsyncSearchSelect,
        LoadingComponent,
        AdminInstallmentToggle,
        AdminCertificateSettings,
        AdminAttachmentsField,
        MediaStatusBadge,
        CourseTrailerProcessSettings,
    },
    data() {
        return {
            BTN_SECONDARY,
            FORM_STEPS,
            oldPoster: "",
            oldTrailer: "",
            existingAttachs: [],
            attachmentUploading: false,
            savingAttachTitleId: null,
            removingAttachId: null,
            loading: false,
            updateLoading: false,
            courseSlug: this.$route.params.courseSlug,
            course_id: null,
            video_id: null,
            errors: null,
            title: "",
            english_title: "",
            selectedCategories: [],
            selectedPaths: [],
            categories: [],
            short_description: "",
            description: "",
            meta_keywords: "",
            start_date: "",
            end_date: "",
            price: "",
            formattedPrice: "",
            publish: 0,
            allows_installment: false,
            has_money_back_guarantee: true,
            tags: [],
            statuses: [],
            status_id: "",
            levels: [],
            level_id: "",
            type: "cash",
            certificate_enabled: false,
            certificate_template_id: null,
            certificateTemplates: [],
            poster: null,
            trailer: null,
            attached_file: null,
            posterPreview: {
                name: '',
                size: '',
                url: '',
            },
            trailerPreview: {
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
                poster: {
                    percent: 0,
                    uploaded: 0,
                    total: 0,
                    speed: '',
                    completed: false
                },
                trailer: {
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
                poster: null,
                trailer: null,
                attached_file: null,
            },
            uploadStatus: {
                poster: 'idle',
                trailer: 'idle',
                attached_file: 'idle',
            },
            processingStatus: {
                trailer: 'idle', // idle, queued, processing, processed, failed
            },
            fileValidationRules: {
                poster: {
                    maxSize: 5 * 1024 * 1024,
                    types: ['image/jpeg', 'image/png', 'image/webp'],
                    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
                    required: true,
                    errorKey: 'poster',
                    label: 'پوستر',
                },
                trailer: {
                    maxSize: 100 * 1024 * 1024,
                    types: ['video/mp4', 'video/x-matroska'],
                    extensions: ['.mp4', '.mkv'],
                    required: false,
                    errorKey: 'trailer',
                    label: 'تریلر',
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
            processEnabled: false,
            processOptions: { ...defaultProcessOptions(720), outputs: ['trailer'] },
            watermarkFile: null,
            sourceHeight: 720,
        };
    },
    watch: {
        processEnabled(enabled) {
            this.processOptions = { ...this.processOptions, outputs: ['trailer'] };
            if (!enabled) this.rejectTrailerIfNeedsProcess();
        },
    },
    computed: {
        confirmSummary() {
            const typeLabels = { free: "رایگان", cash: "نقدی", "cash-vip": "نقدی/VIP" };
            return [
                { label: "عنوان فارسی", value: this.title },
                { label: "عنوان انگلیسی", value: this.english_title, ltr: true },
                { label: "نوع دوره", value: typeLabels[this.type] || this.type },
                { label: "قیمت", value: this.type === "free" ? "رایگان" : (this.formattedPrice ? this.formattedPrice + " تومان" : "") },
                { label: "انتشار", value: String(this.publish) === "1" ? "منتشر شده" : "پیش‌نویس" },
                { label: "گواهینامه", value: this.certificate_enabled ? "فعال" : "غیرفعال" },
                { label: "گارانتی بازگشت وجه", value: this.has_money_back_guarantee ? "فعال" : "غیرفعال" },
            ];
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
        canStartTrailerProcessing() {
            if (!this.processEnabled) return true;
            const outs = this.processOptions?.outputs || [];
            if (!outs.length) return false;
            if (!(this.processOptions?.stream_qualities?.length || this.processOptions?.qualities?.length)) return false;
            const wm = this.processOptions?.watermark;
            if (wm?.enabled && wm.type === 'text' && !String(wm.text || '').trim()) return false;
            if (wm?.enabled && wm.type === 'image' && !this.watermarkFile) return false;
            return true;
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
            isError ? toast.error(message, opts) : toast.success(message, opts);
        },

        async getInitData() {
            this.loading = true;
            await axiosInstance
                .post("admin/course/layouts/getInitData")
                .then((response) => {
                    this.categories = response.data.categories;
                    this.statuses = response.data.statuses;
                    this.levels = response.data.levels;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                });
            try {
                const tplRes = await listCertificateTemplates({ perPage: 100, active: 'yes' });
                this.certificateTemplates = tplRes.templates?.data ?? [];
            } catch (e) {
                console.error(e);
            }
        },
        async getCourse() {
            this.loading = true;
            await axiosInstance
                .post("admin/course/edit", { slug: this.courseSlug })
                .then((response) => {
                    this.course_id = response.data.course.id;
                    this.title = response.data.course.title;
                    this.english_title = response.data.course.english_title;
                    this.selectedCategories = response.data.course.categories;
                    this.selectedPaths = response.data.course.paths || [];
                    this.short_description = response.data.course.short_description;
                    this.description = response.data.course.description;
                    this.meta_keywords = response.data.course.meta_keywords || "";
                    this.start_date = response.data.course.start_date;
                    this.end_date = response.data.course.end_date;
                    this.price = String(response.data.course.price).replace(/[^0-9]/g, "");
                    this.formattedPrice = String(response.data.course.price).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    this.publish = response.data.course.publish;
                    this.allows_installment = Boolean(response.data.course.allows_installment);
                    this.has_money_back_guarantee = response.data.course.has_money_back_guarantee !== false;
                    this.tags = response.data.course.tags;
                    this.status_id = response.data.course.status.id;
                    this.level_id = response.data.course.level.id;
                    this.type = response.data.course.type;
                    this.certificate_enabled = !!response.data.course.certificate_enabled;
                    this.certificate_template_id = response.data.course.certificate_template_id ?? null;
                    this.oldPoster = response.data.course.poster;
                    this.oldTrailer = response.data.course.trailer;
                    this.existingAttachs = response.data.course.attachs || (response.data.course.attach ? [response.data.course.attach] : []);
                    
                    // Load trailer processing status from server
                    if (response.data.course.trailer_status) {
                        this.processingStatus.trailer = response.data.course.trailer_status;
                        // If there's a processing status, set upload status to uploaded
                        if (response.data.course.trailer_status !== 'idle') {
                            this.uploadStatus.trailer = 'uploaded';
                        }
                    }
                    if (response.data.course.trailer_video_id) {
                        this.video_id = response.data.course.trailer_video_id;
                        // Start status polling if video is not fully processed yet
                        if (this.processingStatus.trailer && this.processingStatus.trailer !== 'processed') {
                            // Get worker token and origin for status polling
                            this.getWorkerCredentials().then(() => {
                                this.startStatusPolling(this.video_id);
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        async getWorkerCredentials() {
            try {
                // Get worker credentials from main API
                const res = await axiosInstance.post('admin/course/edit', { 
                    slug: this.courseSlug,
                    get_worker_credentials: true
                });
                const { worker_token, worker_origin } = res.data;
                this._workerToken = worker_token;
                this._workerOrigin = worker_origin;
            } catch (error) {
                console.error('Failed to get worker credentials:', error);
            }
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

        handlePoster(e) {
            const file = (e.target?.files?.[0]) || (e.dataTransfer?.files?.[0]);
            if (!file) return;
            if (!this.validateFile(file, 'poster')) {
                this.poster = null;
                return;
            }

            this.poster = file;
            this.uploadStatus.poster = 'pending';
            this.posterPreview = {
                name: file.name,
                size: this.formatFileSize(file.size),
                url: URL.createObjectURL(file),
            };
        },

        handleTrailer(e) {
            const file = (e.target?.files?.[0]) || (e.dataTransfer?.files?.[0]);
            if (!file) return;
            if (!this.validateFile(file, 'trailer')) {
                this.trailer = null;
                return;
            }
            const name = (file.name || '').toLowerCase();
            if (!this.processEnabled && name.endsWith('.mkv')) {
                this.trailer = null;
                if (this.$refs.trailer) this.$refs.trailer.value = null;
                this.showToast('بدون پردازش فقط MP4 در پلیر پخش می‌شود. برای MKV پردازش را فعال کنید.', true);
                return;
            }

            this.trailer = file;
            this.uploadStatus.trailer = 'pending';
            this.processingStatus.trailer = 'idle';
            this.probeTrailerHeight(file);

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

                this.trailerPreview = {
                    name: file.name,
                    size: file.size,
                    duration: this.formatDuration(Math.floor(video.duration)),
                    thumbnail: thumbnail,
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

        removeAttach() {
            this.cancelUpload('attached_file')
            this.uploadStatus.attached_file = 'idle';
            this.attached_file = null;
            this.$refs.attached_file.value = null
            this.attachPreview = {
                name: '',
                ext: '',
                size: ''
            }
        },
        removeTrailer() {
            this.cancelUpload('trailer')
            this.uploadStatus.trailer = 'idle';
            this.processingStatus.trailer = 'idle';
            this.trailer = null;
            this.$refs.trailer.value = null
            this.trailerPreview = {
                name: '',
                duration: '',
                size: '',
                thumbnail: ''
            }
            URL.revokeObjectURL(this.trailerPreview.thumbnail)
        },
        removePoster() {
            this.cancelUpload('poster')
            this.uploadStatus.poster = 'idle';
            this.poster = null;
            this.$refs.poster.value = null
            this.posterPreview = {
                name: '',
                size: '',
                url: ''
            }
        },
        async removeFile(fileType) {
            await axiosInstance.post('admin/course/removeFile',
                {
                    course_id: this.course_id,
                    file_type: fileType
                }
            ).then(() => {
                toast.success("عملیات با موفقیت انجام شد و فایل حذف شد.", {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                switch (fileType) {
                    case 'trailer':
                        this.oldTrailer = "";
                        this.uploadStatus.trailer = 'idle';
                        this.processingStatus.trailer = 'idle';
                        this.trailer = null;
                        if (this.$refs.trailer) this.$refs.trailer.value = null;
                        this.trailerPreview = { name: '', duration: '', size: '', thumbnail: '' };
                        break;
                    case 'poster':
                        this.oldPoster = "";
                        this.uploadStatus.poster = 'idle';
                        this.poster = null;
                        if (this.$refs.poster) this.$refs.poster.value = null;
                        this.posterPreview = { name: '', size: '', url: '' };
                        break;
                    case 'attached_file':
                        this.oldAttachedFile = "";
                        this.uploadStatus.attached_file = 'idle';
                        this.attached_file = null;
                        if (this.$refs.attached_file) this.$refs.attached_file.value = null;
                        this.attachPreview = { name: '', ext: '', size: '' };
                        break;
                }

            }).catch((error) => {
                console.error(error.response.data.errors)
            }).finally(() => {

            })
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
        resetForm() {
            this.title = "";
            this.english_title = "";
            this.short_description = "";
            this.description = "";
            this.meta_keywords = "";
            this.selectedCategories = "";
            this.selectedPaths = [];
            this.start_date = "";
            this.end_date = "";
            this.price = "";
            this.formattedPrice = "";
            this.publish = false;
            this.tags = [];
            this.status_id = "";
            this.level_id = "";
            this.type = "cash";
            this.removeAttach();
            this.existingAttachs = [];
            this.oldTrailer = "";
            this.oldPoster = "";
            this.removePoster();
            this.removeTrailer();
            this.$refs.description.reset();

        },
        async submit() {
            this.updateLoading = true
            this.errors = null
            const posterValid = this.validateFile(this.poster, 'poster');
            const trailerValid = this.validateFile(this.trailer, 'trailer');
            if (!posterValid || !trailerValid) {
                this.updateLoading = false;
                return;
            }
            if (this.trailer && this.processEnabled && !this.canStartTrailerProcessing) {
                this.updateLoading = false;
                this.showToast('کیفیت‌ها و تنظیمات پردازش تریلر را کامل کنید.', true);
                return;
            }
            try {
                const response = await axiosInstance.post('admin/course/update', {
                    course_id: this.course_id,
                    title: this.title,
                    english_title: this.english_title,
                    categories: Array.isArray(this.selectedCategories) && typeof this.selectedCategories[0] === "object"
                        ? this.selectedCategories.map(cat => cat.id)
                        : this.selectedCategories,
                    paths: Array.isArray(this.selectedPaths) && typeof this.selectedPaths[0] === "object"
                        ? this.selectedPaths.map(path => path.id)
                        : this.selectedPaths,
                    short_description: this.short_description,
                    description: this.description,
                    meta_keywords: this.meta_keywords || null,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    price: this.type === 'free' ? 0 : parseInt(this.price),
                    publish: this.publish,
                    allows_installment: this.type !== 'free' ? this.allows_installment : false,
                    has_money_back_guarantee: this.has_money_back_guarantee,
                    tags: this.tags,
                    status_id: this.status_id,
                    level_id: this.level_id,
                    type: this.type,
                    certificate_enabled: this.certificate_enabled,
                    certificate_template_id: this.certificate_enabled ? this.certificate_template_id : null,
                });
                this.courseSlug = response.data.course.slug;
                // console.log(response.data);

                toast.success(`عملیات با موفقیت انجام شد و دوره با موفقیت ویرایش شد. ${(this.poster || this.trailer || this.$refs.attachmentsField?.pendingForUpload?.().length) ? ' منتظر آپلود فایل(های) دوره باشید.' : ''}`, {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });

                if (this.poster)
                    await this.uploadFile(this.course_id, 'poster');
                await this.uploadPendingAttachments(this.course_id);
                if (this.trailer)
                    await this.uploadFile(this.course_id, 'trailer');

            } catch (error) {
                this.errors = error.response.data.errors;
                console.error('Course creation failed:', this.errors);
            } finally {
                this.updateLoading = false
            }
        },




        async uploadPendingAttachments(courseId) {
            const field = this.$refs.attachmentsField;
            if (!field || !field.pendingForUpload().length) return;
            this.attachmentUploading = true;
            try {
                await field.uploadAll(async (item, onProgress) => {
                    const file = item.file;
                    const initRes = await axiosInstance.post('admin/course/uploadAttachedFile', {
                        course_id: courseId,
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
                const response = await axiosInstance.post('admin/course/edit', { slug: this.courseSlug });
                this.existingAttachs = response.data.course.attachs || [];
            } finally {
                this.attachmentUploading = false;
            }
        },
        async removeExistingAttach(item) {
            if (!item?.id || !this.course_id) return;
            this.removingAttachId = item.id;
            try {
                await axiosInstance.post('admin/course/removeFile', {
                    course_id: this.course_id,
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
            if (!item?.id || !this.course_id || !title) return;
            this.savingAttachTitleId = item.id;
            try {
                const res = await axiosInstance.post('admin/course/updateAttachedFile', {
                    course_id: this.course_id,
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

        async uploadFile(courseId, fileType) {
            const file = this[fileType];
            if (!file) return;
            if (!this.validateFile(file, fileType)) { this.uploadStatus[fileType] = 'upload-error'; return; }

            if (this.controllers[fileType]) {
                this.controllers[fileType].abort();
            }
            const controller = new AbortController();
            this.controllers[fileType] = controller;
            this.uploadStatus[fileType] = 'uploading';

            try {
                const trackProgress = (progressEvent) => {
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
                };

                // Poster: upload + WebP once on main API (no worker)
                if (fileType === 'poster') {
                    const formData = new FormData();
                    formData.append('course_id', courseId);
                    formData.append('file', file);
                    await axiosInstance.post('admin/course/uploadPoster', formData, {
                        timeout: 3600 * 1000,
                        headers: { 'Content-Type': 'multipart/form-data' },
                        signal: controller.signal,
                        onUploadProgress: trackProgress,
                    });
                    this.progress[fileType].completed = true;
                    this.uploadStatus[fileType] = 'uploaded';
                    toast.success('پوستر با موفقیت آپلود شد.', {
                        theme: 'colored',
                        hideProgressBar: false,
                        rtl: localStorage.getItem('direction') == 'rtl' ? true : false,
                        bodyClassName: 'font-YekanBakh',
                        toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    return;
                }

                // Trailer / attachment: init token then upload to worker
                let initUrl = '';
                let initBody = { filename: file.name, mime: file.type, size: file.size };
                if (fileType === 'trailer') {
                    initUrl = 'admin/video/upload';
                    initBody.course_id = courseId;
                    initBody.episode_id = null;
                    initBody.storage_disk = this.processOptions?.storage_disk || 'dl';
                } else if (fileType === 'attached_file') {
                    initUrl = 'admin/course/uploadAttachedFile';
                    initBody.course_id = courseId;
                }

                const initRes = await axiosInstance.post(initUrl, initBody);
                const { uploadPath, uploadToken, workerUploadUrl } = initRes.data;
                if (fileType === 'trailer') {
                    this._workerToken = uploadToken;
                    try { this._workerOrigin = new URL(workerUploadUrl).origin; } catch (e) { this._workerOrigin = ''; }
                }

                const formData = new FormData();
                formData.append('path', uploadPath);
                formData.append('file', file);

                const workerRes = await axios.post(workerUploadUrl, formData, {
                    timeout: 3600 * 1000,
                    headers: { 'Authorization': `Bearer ${uploadToken}` },
                    signal: controller.signal,
                    onUploadProgress: trackProgress,
                });

                this.progress[fileType].completed = true;
                this.uploadStatus[fileType] = 'uploaded';

                let type = '';
                if (fileType === 'trailer') type = 'تریلر';
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

                if (fileType === 'trailer' && workerRes?.data?.video_id) {
                    this.video_id = workerRes.data.video_id;
                    if (this.processEnabled) {
                        await this.startProcessing(this.video_id);
                    } else {
                        this.processingStatus.trailer = 'idle';
                    }
                }

            } catch (error) {
                if (controller.signal.aborted) {
                    this.uploadStatus[fileType] = 'pending';
                    console.log(`${fileType} upload canceled.`);

                } else {
                    this.uploadStatus[fileType] = 'upload-error';
                    console.error(`${fileType} upload failed:`, error);
                }
            } finally {
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
                if (fileType === 'trailer') {
                    this.processingStatus.trailer = 'idle';
                }
            }
        },

        async probeTrailerHeight(file) {
            try {
                this.sourceHeight = await probeVideoHeightFromFile(file);
            } catch (e) {
                this.sourceHeight = 720;
            }
        },
        rejectTrailerIfNeedsProcess() {
            const name = (this.trailer?.name || '').toLowerCase();
            if (!name.endsWith('.mkv')) return;
            this.removeTrailer();
            this.showToast('بدون پردازش فقط MP4 در پلیر پخش می‌شود. برای MKV پردازش را فعال کنید.', true);
        },
        async startProcessing(videoId) {
            if (!videoId) return;
            if (!this.processEnabled || !this.canStartTrailerProcessing) {
                this.showToast('کیفیت‌ها و تنظیمات پردازش تریلر را کامل کنید.', true);
                return;
            }
            this.processingStatus.trailer = 'queued';
            try {
                await axiosInstance.post(
                    `admin/video/process/${videoId}`,
                    buildProcessRequestBody(this.processOptions, this.watermarkFile),
                    { timeout: 60 * 1000 }
                );
                this.processingStatus.trailer = 'processing';
                this.startStatusPolling(videoId);
            } catch (error) {
                this.processingStatus.trailer = 'failed';
                this.showToast(error?.response?.data?.message || 'شروع پردازش ناموفق بود', true);
            }
        },
        startStatusPolling(videoId) {
            if (this._statusTimer) clearInterval(this._statusTimer);
            this._statusTimer = setInterval(async () => {
                try {
                    const res = await axiosInstance.get(`admin/video/${videoId}/status`, { timeout: 10000 });
                    const status = res.data?.status;
                    if (status === 'processed') { this.processingStatus.trailer = 'processed'; clearInterval(this._statusTimer); this._statusTimer = null; }
                    else if (status === 'failed') { this.processingStatus.trailer = 'failed'; clearInterval(this._statusTimer); this._statusTimer = null; }
                    else if (status === 'queued') { this.processingStatus.trailer = 'queued'; }
                    else { this.processingStatus.trailer = 'processing'; }
                } catch (e) {
                    // keep trying
                }
            }, 3000);
        },
        beforeDestroy() { if (this._statusTimer) { clearInterval(this._statusTimer); this._statusTimer = null; } },
        
        reprocessTrailer() {
            if (this.video_id) {
                this.processingStatus.trailer = 'queued';
                this.startStatusPolling(this.video_id);
            }
        },
        getOldFileValue(type) {
            switch (type) {
                case 'poster':
                    return this.oldPoster;
                case 'trailer':
                    return this.oldTrailer;
                case 'attached_file':
                    return this.existingAttachs?.length ? this.existingAttachs : "";
                default:
                    return null;
            }
        },
        validateFile(file, type) {
            const rules = this.fileValidationRules[type];
            if (!this.errors) this.errors = {};
            
            // Check if file is required and if it exists in either old or new values
            if (rules.required) {
                const hasNewFile = file && file !== null;
                const hasOldFile = this.getOldFileValue(type) && this.getOldFileValue(type) !== "";
                
                if (!hasNewFile && !hasOldFile) {
                    this.errors[type] = [`فیلد ${rules.label} الزامی است.`];
                    return false;
                }
            }

            if (!file) {
                this.errors[type] = null;
                return true;
            }

            const ext = file?.name?.split(".").pop()?.toLowerCase() || '';

            const isValidExt = rules.extensions.includes(ext);
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
        document.title = "فرم ویرایش دوره آموزشی";
        this.getInitData();
        this.getCourse();
    }
};
</script>
<style scoped>
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
    transition: box-shadow 0.15s, border-color 0.15s;
}
.form-input:focus {
    box-shadow: 0 0 0 2px #facc15;
}
.dark .form-input {
    background: #374151;
    color: #fff;
}
.field-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.375rem;
}
.dark .field-label { color: #9ca3af; }
@media (min-width: 1024px) {
    .admin-form-layout {
        grid-template-columns: 14rem minmax(0, 1fr);
    }
}
</style>
