<template>
    <div class="space-y-4">
        <!-- basic -->
        <section v-show="stepId === 'basic'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات پایه</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">عنوان، وضعیت و توضیح کوتاه</p>
            </div>
            <div class="grid gap-x-6 gap-y-3 grid-cols-1 md:grid-cols-2">
                <div>
                    <label class="field-label">عنوان فارسی</label>
                    <input v-model="pathFormRoot.form.title" type="text" class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" :class="inputError('title')" />
                    <span v-if="errors.title" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.title[0] }}</span>
                </div>
                <div>
                    <label class="field-label">عنوان انگلیسی</label>
                    <input v-model="pathFormRoot.form.english_title" @input="filterEnglish" type="text" class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" :class="inputError('english_title')" />
                    <span v-if="errors.english_title" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.english_title[0] }}</span>
                </div>
                <div>
                    <label class="field-label">وضعیت</label>
                    <ul class="h-10 grid w-full grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <li>
                            <input v-model="pathFormRoot.form.status" type="radio" id="path-status-0" :value="false" class="hidden peer" />
                            <label for="path-status-0" class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                <div class="block text-xs font-semibold text-center w-full">غیرفعال</div>
                            </label>
                        </li>
                        <li>
                            <input v-model="pathFormRoot.form.status" type="radio" id="path-status-1" :value="true" class="hidden peer" />
                            <label for="path-status-1" class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                <div class="block text-xs font-semibold text-center w-full">فعال</div>
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="md:col-span-2">
                    <AdminInstallmentToggle
                        v-model="pathFormRoot.form.allows_installment"
                        :title="$t('admin.installment.title')"
                        :description="$t('admin.installment.desc')"
                    />
                </div>
                <div class="md:col-span-2">
                    <label class="field-label">توضیح کوتاه</label>
                    <input v-model="pathFormRoot.form.short_description" type="text" class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" />
                </div>
            </div>
        </section>

        <!-- description -->
        <section v-show="stepId === 'description'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">توضیحات</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">متن کامل و کلمات کلیدی SEO</p>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="field-label">توضیحات</label>
                    <textarea v-model="pathFormRoot.form.description" rows="5" class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"></textarea>
                </div>
                <div>
                    <label for="path-meta_keywords" class="field-label">
                        کلمات کلیدی
                        <span class="text-gray-400 font-normal">(حداقل 3 و حداکثر 10 کلمه)</span>
                    </label>
                    <input type="text" id="path-meta_keywords" v-model="pathFormRoot.form.meta_keywords" class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" :class="inputError('meta_keywords')" placeholder="" />
                    <span v-if="errors.meta_keywords" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.meta_keywords[0] }}</span>
                    <p class="text-xs text-gray-400 mt-1">
                        کلمات کلیدی را با کاما (,) جدا کنید. این کلمات برای SEO استفاده می‌شوند.
                        <span class="block mt-1" :class="metaKeywordsCount < 3 || metaKeywordsCount > 10 ? 'text-rose-500' : 'text-green-500'">
                            تعداد کلمات: {{ metaKeywordsCount }} / 3-10
                        </span>
                    </p>
                </div>
            </div>
        </section>

        <!-- courses -->
        <section v-show="stepId === 'courses'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">نسبت‌دهی دوره‌ها</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">دستی یا با شروط پویا دوره‌های مسیر را تعیین کنید</p>
            </div>
            <div class="space-y-3">
                <div>
                    <label class="field-label">روش اختصاص</label>
                    <ul class="space-y-3">
                        <li>
                            <input v-model="pathFormRoot.form.assignment_type" type="radio" id="path-assign_manual" value="manual" class="hidden peer" />
                            <label for="path-assign_manual" class="inline-flex items-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <svg class="w-5 h-5 me-3" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v2H3V5a2 2 0 0 1 2-2Zm16 6H3v8a2 2 0 0 0 2 2h6v-4H9v-2h6v2h-2v4h6a2 2 0 0 0 2-2V9Z" /></svg>
                                <div class="block">
                                    <div class="text-sm font-semibold">دستی</div>
                                    <div class="text-xs">انتخاب دوره‌ها به صورت دستی</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input v-model="pathFormRoot.form.assignment_type" type="radio" id="path-assign_auto" value="automatic" class="hidden peer" />
                            <label for="path-assign_auto" class="inline-flex items-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <svg class="w-5 h-5 me-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10h-2A8 8 0 1 1 12 4V2Zm1 1v9h7v-2h-5V3h-2Z" /></svg>
                                <div class="block">
                                    <div class="text-sm font-semibold">خودکار</div>
                                    <div class="text-xs">انتخاب دوره‌ها با شروط پویا</div>
                                </div>
                            </label>
                        </li>
                    </ul>
                </div>
                <div v-if="form.assignment_type === 'manual'">
                    <label class="field-label">انتخاب دوره‌ها</label>
                    <AsyncSearchSelect v-model="selectedCourses" class="text-gray-900 dark:text-gray-300 mb-1"
                        :inputClass="['h-10 bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white']"
                        searchApi="/admin/path/search/courses" :placeholder="' '">
                    </AsyncSearchSelect>
                    <span v-if="errors.courses" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.courses[0] }}</span>
                </div>
                <div v-else class="mt-2 border border-dashed border-gray-200 dark:border-opacity-20 p-3 md:px-4 rounded-lg">
                    <div class="flex flex-col md:flex-row md:items-center gap-4">
                        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">دوره‌ها مطابقت داشته باشند با:</div>
                        <ul class="w-max flex items-center text-xs bg-gray-100 dark:bg-gray-700 py-2 px-1 rounded-full">
                            <li>
                                <input v-model="pathFormRoot.form.match_type" type="radio" id="path-match_all" value="all" class="hidden peer" />
                                <label for="path-match_all" class="w-full px-3 py-1 text-gray-700 dark:text-gray-300 rounded-full cursor-pointer font-semibold dark:peer-checked:text-black peer-checked:bg-yellow-400">همه شرایط</label>
                            </li>
                            <li>
                                <input v-model="pathFormRoot.form.match_type" type="radio" id="path-match_any" value="any" class="hidden peer" />
                                <label for="path-match_any" class="w-full px-3 py-1 text-gray-700 dark:text-gray-300 rounded-full cursor-pointer font-semibold dark:peer-checked:text-black peer-checked:bg-yellow-400">هر شرطی</label>
                            </li>
                        </ul>
                    </div>
                    <hr v-if="rules.length" class="border-t border-dashed border-gray-200 dark:border-gray-700/50 my-3">
                    <transition-group name="fade" tag="div">
                        <div v-for="(rule, i) in rules" :key="i" class="flex flex-col lg:flex-row lg:items-start gap-2 mb-3 last:mb-0">
                            <div class="w-full flex items-start gap-2">
                                <div class="w-full">
                                    <select v-model="rule.field" class="bg-gray-100 text-gray-900 text-xs font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
                                        <option value="title">عنوان</option>
                                        <option value="english_title">عنوان انگلیسی</option>
                                        <option value="short_description">توضیح کوتاه</option>
                                        <option value="description">توضیحات</option>
                                        <option value="publish">وضعیت انتشار</option>
                                        <option value="status">وضعیت</option>
                                        <option value="level">سطح</option>
                                        <option value="totalTime">مدت زمان</option>
                                        <option value="price">قیمت</option>
                                    </select>
                                </div>
                                <div class="w-full">
                                    <select v-model="rule.operator" class="bg-gray-100 text-gray-900 text-xs font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
                                        <option value="is_equal_to">برابر است با</option>
                                        <option value="not_equal_to">مخالف است با</option>
                                        <option value="less_than">کمتر از</option>
                                        <option value="greater_than">بیشتر از</option>
                                        <option value="contains">شامل باشد</option>
                                        <option value="not_contains">شامل نباشد</option>
                                        <option value="starts_with">شروع شود با</option>
                                        <option value="ends_with">تمام شود با</option>
                                    </select>
                                </div>
                            </div>
                            <div class="w-full">
                                <div class="w-full flex items-start gap-2">
                                    <input v-model="rule.value" type="text" class="bg-gray-100 text-gray-900 text-xs font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" />
                                    <button @click.prevent="removeRule(i)" class="bg-gray-100/70 dark:bg-gray-800/60 rounded-lg text-pink-400 hover:text-pink-500 p-2 w-max duration-200">
                                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1"><path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="currentColor" fill-rule="nonzero" /><path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="currentColor" opacity="0.8" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                    <button @click.prevent="addRule" class="mt-3 bg-yellow-400 text-black text-xs font-semibold rounded-lg px-3 h-9 hover:bg-opacity-80 dark:hover:bg-opacity-80 flex items-center justify-center">
                        <svg class="me-1 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12H18M12 6V18" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        افزودن شرط جدید
                    </button>
                </div>
            </div>
        </section>

        <!-- relations -->
        <section v-show="stepId === 'relations'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">پیش‌نیازها و قدم‌های بعدی</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">مسیرهای مرتبط با این مسیر یادگیری</p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div>
                    <label class="field-label">پیش‌نیازها</label>
                    <AsyncSearchSelect v-model="selectedPrerequisites" class="text-gray-900 dark:text-gray-300 mb-1"
                        :inputClass="['h-10 bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white']"
                        searchApi="/admin/path/search/paths" :placeholder="' '">
                    </AsyncSearchSelect>
                </div>
                <div>
                    <label class="field-label">هم‌نیازها</label>
                    <AsyncSearchSelect v-model="selectedCorequisites" class="text-gray-900 dark:text-gray-300 mb-1"
                        :inputClass="['h-10 bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white']"
                        searchApi="/admin/path/search/paths" :placeholder="' '">
                    </AsyncSearchSelect>
                </div>
                <div>
                    <label class="field-label">قدم‌های بعدی</label>
                    <AsyncSearchSelect v-model="selectedNextSteps" class="text-gray-900 dark:text-gray-300 mb-1"
                        :inputClass="['h-10 bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white']"
                        searchApi="/admin/path/search/paths" :placeholder="' '">
                    </AsyncSearchSelect>
                </div>
            </div>
        </section>

        <!-- media -->
        <section v-show="stepId === 'media'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">فایل‌ها و رسانه</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">آیکون، پوستر و ویدیو معرفی مسیر</p>
            </div>
            <!-- Always-present hidden inputs for edit compatibility -->
            <input ref="icon" type="file" id="path-form-icon"
                :disabled="uploadStatus.icon === 'uploaded'"
                :accept="fileValidationRules.icon.extensions.join(',')" class="hidden"
                @change="pathFormRoot.handleFile('icon', $event)" />
            <input ref="poster" type="file" id="path-form-poster"
                :disabled="uploadStatus.poster === 'uploaded'"
                :accept="fileValidationRules.poster.extensions.join(',')" class="hidden"
                @change="pathFormRoot.handleFile('poster', $event)" />
            <input ref="trailer" type="file" id="path-form-trailer"
                :disabled="uploadStatus.trailer === 'uploading'"
                :accept="fileValidationRules.trailer.extensions.join(',')" class="hidden"
                @change="pathFormRoot.handleFile('trailer', $event)" />
            <div class="grid gap-x-6 gap-y-3 mb-6 grid-cols-1 md:grid-cols-2">
                                        <div>
                                            <label for="path-form-icon"
                                                class="flex items-center justify-between mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                                آیکون مسیر
                                                <span v-if="icon" class="text-xs font-medium text-gray-400 font-sans">
                                                    <template v-if="uploadStatus.icon === 'pending'">
                                                        در انتظار آپلود
                                                    </template>
                                                    <template v-else-if="uploadStatus.icon === 'uploading'">
                                                        در حال آپلود –
                                                        <span dir="ltr">
                                                            {{ formatFileSize(progress.icon.uploaded) }}/{{ iconPreview.size }}
                                                        </span>
                                                    </template>
                                                    <template v-else-if="uploadStatus.icon === 'uploaded'">
                                                        آیکون آپلود شده است
                                                    </template>
                                                </span>
                                            </label>
                                            <div class="flex items-center justify-center w-full">
                                                <div v-if="isEdit && oldIcon && icon == null" class="relative w-full">
                                                    <div
                                                        class="w-full h-48 overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-700">
                                                        <img onerror="this.style.display='none'" :src="oldIcon" class="w-full h-full object-cover" />
                                                    </div>
                                                    <div
                                                        class="absolute top-2 start-2 z-10 flex items-center space-x-2 rtl:space-x-reverse">
                                                        <button type="button" title="تغییر آیکون مسیر"
                                                            class="h-6 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 text-xs font-semibold px-2 py-[3px] rounded shadow hover:bg-opacity-90 dark:hover:bg-opacity-90 flex items-center"
                                                            @click.stop="$refs.icon.click()">
                                                            <svg class="w-5 h-5 me-1.5" viewBox="0 0 512 512" version="1.1"
                                                                xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                                                                xmlns:xlink="http://www.w3.org/1999/xlink" fill="none">
                                                                <path fill="currentColor"
                                                                    d="M307.81,212.18c-3.24,0-6.07-2.17-6.91-5.3l-4.82-17.88c-0.84-3.12-3.68-5.3-6.91-5.3h-21.46h-25.44H220.8 c-3.24,0-6.07,2.17-6.91,5.3l-4.82,17.88c-0.84,3.12-3.68,5.3-6.91,5.3H169.5c-3.96,0-7.16,3.21-7.16,7.16v101.78 c0,3.96,3.21,7.16,7.16,7.16h170.95c3.96,0,7.16-3.21,7.16-7.16V219.35c0-3.96-3.21-7.16-7.16-7.16H307.81z M282.33,264.94 c-0.86,13.64-11.93,24.71-25.58,25.58c-16.54,1.05-30.18-12.59-29.14-29.14c0.86-13.64,11.93-24.71,25.58-25.58 C269.74,234.76,283.38,248.4,282.33,264.94z"></path>
                                                                <path fill="currentColor"
                                                                    d="M82.95,272.41c3.82,0,7.53-1.53,10.23-4.23l21.23-21.23c4.74-4.74,6.4-11.92,3.73-18.06 c-2.73-6.29-8.88-8.95-18.84-7.57l-0.27,0.27c15.78-71.56,79.7-125.27,155.94-125.27c60.72,0,115.41,33.72,142.73,87.99 c3.58,7.11,12.24,9.97,19.34,6.39c7.11-3.58,9.97-12.24,6.39-19.34c-15.47-30.73-39.05-56.66-68.22-75.01 C325.23,77.47,290.57,67.5,254.98,67.5c-93,0-170.48,67.71-185.75,156.41c-5.38-4.77-13.59-5.18-19.13-0.44 c-6.3,5.39-6.75,14.88-1.13,20.84c0.23,0.24,5.69,6.03,11.41,11.93c3.41,3.51,6.2,6.33,8.3,8.38c4.23,4.13,7.88,7.69,14.07,7.78 C82.81,272.41,82.88,272.41,82.95,272.41z"></path>
                                                                <path fill="currentColor"
                                                                    d="M464.28,247.82l-26.5-26.5c-2.75-2.75-6.57-4.3-10.44-4.23c-2.33,0.03-4.29,0.56-6.07,1.42 c-0.26,0.12-0.51,0.26-0.76,0.4c-0.04,0.02-0.08,0.04-0.12,0.06c-0.59,0.33-1.16,0.68-1.69,1.08c-1.88,1.34-3.6,3.03-5.44,4.82 c-2.1,2.05-4.89,4.87-8.3,8.38c-5.72,5.9-11.18,11.68-11.41,11.93c-5.46,5.79-5.19,14.91,0.6,20.36 c5.75,5.42,14.77,5.18,20.24-0.48c-4.72,83.85-74.42,150.62-159.43,150.62c-70.52,0-131.86-45.23-152.62-112.55 c-2.35-7.6-10.41-11.86-18.01-9.52c-7.6,2.34-11.86,10.41-9.52,18.01c11.62,37.68,35.48,71.52,67.19,95.28 c32.8,24.59,71.86,37.58,112.96,37.58c100.11,0,182.23-78.45,188.14-177.1l0.79,0.79c2.81,2.81,6.5,4.22,10.18,4.22 c3.69,0,7.37-1.41,10.18-4.22C469.91,262.57,469.91,253.45,464.28,247.82z"></path>
                                                            </svg>
                                                            تغییر آیکون مسیر
                                                        </button>
                                                    </div>
                                                </div>
                                                <label v-else for="path-form-icon"
                                                    class="relative border-2 group flex flex-col items-center justify-center w-full h-48 rounded-lg cursor-pointer transition overflow-hidden"
                                                    :class="[
                                                        errors && errors.icon ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700',
                                                        iconPreview.url
                                                            ? 'p-0'
                                                            : 'bg-gray-50 dark:bg-gray-700  border-dashed hover:bg-gray-100 dark:hover:bg-gray-600'
                                                    ]" @dragover.prevent @drop.prevent="pathFormRoot.handleFile('icon', $event)">
                                                    <div v-if="!iconPreview.url" @click="$refs.icon.click()"
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
                                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <span class="font-semibold">کلیک برای انتخاب</span> یا کشیدن و رها کردن
                                                        </p>
                                                        <p class="text-xs text-gray-500 dark:text-gray-400">
                                                            {{ fileValidationRules.icon.extensions }} (حداکثر {{
                                                                formatFileSize(fileValidationRules.icon.maxSize, 0, 'fa') }} )
                                                        </p>
                                                    </div>
            
                                                    <div v-else class="absolute inset-0">
                                                        <img onerror="this.style.display='none'" :src="iconPreview.url"
                                                            class="w-full h-full object-cover " />
                                                        <button
                                                            v-if="icon && (uploadStatus.icon === 'pending' || uploadStatus.icon === 'error')"
                                                            type="button" title="تغییر آیکون"
                                                            class="z-10 absolute top-2 start-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 text-xs font-semibold px-2 py-[3px] rounded-lg shadow hover:bg-opacity-100 dark:hover:bg-opacity-100 flex items-center"
                                                            @click.stop="$refs.icon.click()">
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
                                                            <button v-if="icon && uploadStatus.icon === 'uploading'"
                                                                @click.prevent="pathFormRoot.cancelUpload('icon')" title="لغو آپلود"
                                                                class="w-6 h-6 shadow rounded-lg bg-rose-500 text-white flex items-center justify-center">
                                                                <svg class="w-4 h-4" fill="none" viewBox="0 0 32 32" version="1.1"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill="currentColor"
                                                                        d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z">
                                                                    </path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                v-if="icon && (uploadStatus.icon === 'pending' || uploadStatus.icon === 'error')"
                                                                @click.prevent="pathFormRoot.removeLocal('icon')" title="حذف"
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
                                                                v-if="icon && path_id && (uploadStatus.icon === 'pending' || uploadStatus.icon === 'error')"
                                                                @click.prevent="pathFormRoot.uploadFile(path_id, 'icon')" title="آپلود مجدد"
                                                                class="w-6 h-6 shadow rounded-lg bg-gray-700 text-white flex items-center justify-center">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z"
                                                                        fill="currentColor"></path>
                                                                    <path
                                                                        d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"
                                                                        fill="currentColor"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div
                                                            class="absolute start-0 bottom-2 me-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 text-xs font-semibold px-2 py-1 rounded-e-lg shadow flex items-center">
                                                            <div dir="ltr"
                                                                class="flex flex-col items-center font-sans shrink-0 text-start justify-start">
                                                                <span class="">size:</span>
                                                                <span class="">{{ iconPreview.size }}</span>
                                                            </div>
                                                            <div class="mx-2">|</div>
                                                            <div dir="ltr"
                                                                class="flex flex-col items-center font-sans shrink-0 text-start justify-start">
                                                                <span class="">name:</span>
                                                                <span class="line-clamp-1">{{ iconPreview.name }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
            <div v-if="icon && !progress.icon.completed"
                                                        :class="{ 'hidden': uploadStatus.icon === 'uploaded' }"
                                                        class="absolute top-0 left-0 h-full flex items-center bg-green-400 bg-opacity-20 border-r-2 border-green-400/40 transition-all duration-500"
                                                        :style="`width: ${progress.icon.percent}%`">
                                                        <div class="z-20 -mr-2 flex items-center justify-center text-center bg-green-400 text-white rounded-md py-2 text-xs font-medium font-serif"
                                                            :class="{ '-mr-4': progress.icon.percent <= 2, 'mr-0': progress.icon.percent >= 99 }"
                                                            style="writing-mode: vertical-rl!important;">{{ progress.icon.percent
                                                            }}%
                                                            completed</div>
                                                    </div>
                                                    <!-- errors -->
                                                    <div v-if="errors && errors.icon"
                                                        class="absolute top-0 left-0 h-full w-full flex items-center bg-rose-400 bg-opacity-20 transition-all duration-500">
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label for="path-form-poster"
                                                class="flex items-center justify-between mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                                پوستر مسیر
                                                <span v-if="poster" class="text-xs font-medium text-gray-400 font-sans">
                                                    <template v-if="uploadStatus.poster === 'pending'">
                                                        در انتظار آپلود
                                                    </template>
                                                    <template v-else-if="uploadStatus.poster === 'uploading'">
                                                        در حال آپلود –
                                                        <span dir="ltr">
                                                            {{ formatFileSize(progress.poster.uploaded) }}/{{ posterPreview.size }}
                                                        </span>
                                                    </template>
                                                    <template v-else-if="uploadStatus.poster === 'uploaded'">
                                                        پوستر آپلود شده است
                                                    </template>
                                                </span>
                                            </label>
                                            <div class="flex items-center justify-center w-full">
                                                <div v-if="isEdit && oldPoster && poster == null" class="relative w-full">
                                                    <div
                                                        class="w-full h-48 overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-700">
                                                        <img onerror="this.style.display='none'" :src="oldPoster" class="w-full h-full object-cover" />
                                                    </div>
                                                    <div
                                                        class="absolute top-2 start-2 z-10 flex items-center space-x-2 rtl:space-x-reverse">
                                                        <button type="button" title="تغییر پوستر مسیر"
                                                            class="h-6 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 text-xs font-semibold px-2 py-[3px] rounded shadow hover:bg-opacity-90 dark:hover:bg-opacity-90 flex items-center"
                                                            @click.stop="$refs.poster.click()">
                                                            <svg class="w-5 h-5 me-1.5" viewBox="0 0 512 512" version="1.1"
                                                                xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                                                                xmlns:xlink="http://www.w3.org/1999/xlink" fill="none">
                                                                <path fill="currentColor"
                                                                    d="M307.81,212.18c-3.24,0-6.07-2.17-6.91-5.3l-4.82-17.88c-0.84-3.12-3.68-5.3-6.91-5.3h-21.46h-25.44H220.8 c-3.24,0-6.07,2.17-6.91,5.3l-4.82,17.88c-0.84,3.12-3.68,5.3-6.91,5.3H169.5c-3.96,0-7.16,3.21-7.16,7.16v101.78 c0,3.96,3.21,7.16,7.16,7.16h170.95c3.96,0,7.16-3.21,7.16-7.16V219.35c0-3.96-3.21-7.16-7.16-7.16H307.81z M282.33,264.94 c-0.86,13.64-11.93,24.71-25.58,25.58c-16.54,1.05-30.18-12.59-29.14-29.14c0.86-13.64,11.93-24.71,25.58-25.58 C269.74,234.76,283.38,248.4,282.33,264.94z"></path>
                                                                <path fill="currentColor"
                                                                    d="M82.95,272.41c3.82,0,7.53-1.53,10.23-4.23l21.23-21.23c4.74-4.74,6.4-11.92,3.73-18.06 c-2.73-6.29-8.88-8.95-18.84-7.57l-0.27,0.27c15.78-71.56,79.7-125.27,155.94-125.27c60.72,0,115.41,33.72,142.73,87.99 c3.58,7.11,12.24,9.97,19.34,6.39c7.11-3.58,9.97-12.24,6.39-19.34c-15.47-30.73-39.05-56.66-68.22-75.01 C325.23,77.47,290.57,67.5,254.98,67.5c-93,0-170.48,67.71-185.75,156.41c-5.38-4.77-13.59-5.18-19.13-0.44 c-6.3,5.39-6.75,14.88-1.13,20.84c0.23,0.24,5.69,6.03,11.41,11.93c3.41,3.51,6.2,6.33,8.3,8.38c4.23,4.13,7.88,7.69,14.07,7.78 C82.81,272.41,82.88,272.41,82.95,272.41z"></path>
                                                                <path fill="currentColor"
                                                                    d="M464.28,247.82l-26.5-26.5c-2.75-2.75-6.57-4.3-10.44-4.23c-2.33,0.03-4.29,0.56-6.07,1.42 c-0.26,0.12-0.51,0.26-0.76,0.4c-0.04,0.02-0.08,0.04-0.12,0.06c-0.59,0.33-1.16,0.68-1.69,1.08c-1.88,1.34-3.6,3.03-5.44,4.82 c-2.1,2.05-4.89,4.87-8.3,8.38c-5.72,5.9-11.18,11.68-11.41,11.93c-5.46,5.79-5.19,14.91,0.6,20.36 c5.75,5.42,14.77,5.18,20.24-0.48c-4.72,83.85-74.42,150.62-159.43,150.62c-70.52,0-131.86-45.23-152.62-112.55 c-2.35-7.6-10.41-11.86-18.01-9.52c-7.6,2.34-11.86,10.41-9.52,18.01c11.62,37.68,35.48,71.52,67.19,95.28 c32.8,24.59,71.86,37.58,112.96,37.58c100.11,0,182.23-78.45,188.14-177.1l0.79,0.79c2.81,2.81,6.5,4.22,10.18,4.22 c3.69,0,7.37-1.41,10.18-4.22C469.91,262.57,469.91,253.45,464.28,247.82z"></path>
                                                            </svg>
                                                            تغییر پوستر مسیر
                                                        </button>
                                                    </div>
                                                </div>
                                                <label v-else for="path-form-poster"
                                                    class="relative border-2 group flex flex-col items-center justify-center w-full h-48 rounded-lg cursor-pointer transition overflow-hidden"
                                                    :class="[
                                                        errors && errors.poster ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700',
                                                        posterPreview.url
                                                            ? 'p-0'
                                                            : 'bg-gray-50 dark:bg-gray-700  border-dashed hover:bg-gray-100 dark:hover:bg-gray-600'
                                                    ]" @dragover.prevent @drop.prevent="pathFormRoot.handleFile('poster', $event)">
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
                                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <span class="font-semibold">کلیک برای انتخاب</span> یا کشیدن و رها کردن
                                                        </p>
                                                        <p class="text-xs text-gray-500 dark:text-gray-400">
                                                            {{ fileValidationRules.poster.extensions }} (حداکثر {{
                                                                formatFileSize(fileValidationRules.poster.maxSize, 0, 'fa') }} )
                                                        </p>
                                                    </div>
            
                                                    <div v-else class="absolute inset-0">
                                                        <img onerror="this.style.display='none'" :src="posterPreview.url"
                                                            class="w-full h-full object-cover " />
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
                                                                @click.prevent="pathFormRoot.cancelUpload('poster')" title="لغو آپلود"
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
                                                                @click.prevent="pathFormRoot.removeLocal('poster')" title="حذف"
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
                                                                v-if="poster && path_id && (uploadStatus.poster === 'pending' || uploadStatus.poster === 'error')"
                                                                @click.prevent="pathFormRoot.uploadFile(path_id, 'poster')" title="آپلود مجدد"
                                                                class="w-6 h-6 shadow rounded-lg bg-gray-700 text-white flex items-center justify-center">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z"
                                                                        fill="currentColor"></path>
                                                                    <path
                                                                        d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"
                                                                        fill="currentColor"></path>
                                                                </svg>
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
                                            </div>
                                        </div>
                                        <div>
                                            <label for="path-form-trailer"
                                                class="flex items-center justify-between mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                                تریلر مسیر
                                                <span v-if="trailer || oldTrailer" class="text-xs font-medium text-gray-400 font-sans flex items-center gap-0.5">
                                                    <template v-if="uploadStatus.trailer === 'pending'">
                                                        در انتظار آپلود
                                                    </template>
                                                    <template v-else-if="uploadStatus.trailer === 'uploading'">
                                                        در حال آپلود –
                                                        <span dir="ltr">
                                                            {{ formatFileSize(progress.trailer.uploaded) }}/{{
                                                                formatFileSize(trailerPreview.size) }}
                                                        </span>
                                                    </template>
                                                    <template v-else-if="uploadStatus.trailer === 'uploaded'">
                                                        تریلر آپلود شده است
                                                    </template>
                                                    <template v-else-if="uploadStatus.trailer === 'error'">
                                                        خطا در آپلود ویدیو
                                                    </template>
                                                </span>
                                            </label>
                                            <div class="flex items-center justify-center w-full">
                                                <div v-if="isEdit && oldTrailer && trailer == null" class="relative w-full">
                                                    <video class="rounded-lg w-full lg:h-48 border-2 border-gray-300 dark:border-gray-500" controls>
                                                        <source :src="oldTrailer" :type="`video/${oldTrailer.split('.').pop()}`">
                                                        Your browser does not support the video tag.
                                                    </video>
                                                    <div
                                                        class="absolute top-2 start-2 z-10 flex items-center space-x-2 rtl:space-x-reverse">
                                                        <button type="button" title="تغییر تریلر مسیر"
                                                            class="h-6 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 text-xs font-semibold px-2 py-[3px] rounded shadow hover:bg-opacity-90 dark:hover:bg-opacity-90 flex items-center"
                                                            @click.stop="$refs.trailer.click()">
                                                            <svg class="w-5 h-5 me-1.5" viewBox="0 0 512 512" version="1.1"
                                                                xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                                                                xmlns:xlink="http://www.w3.org/1999/xlink" fill="none">
                                                                <path fill="currentColor"
                                                                    d="M307.81,212.18c-3.24,0-6.07-2.17-6.91-5.3l-4.82-17.88c-0.84-3.12-3.68-5.3-6.91-5.3h-21.46h-25.44H220.8 c-3.24,0-6.07-2.17-6.91,5.3l-4.82,17.88c-0.84,3.12-3.68,5.3-6.91,5.3H169.5c-3.96,0-7.16,3.21-7.16,7.16v101.78 c0,3.96,3.21,7.16,7.16,7.16h170.95c3.96,0,7.16-3.21,7.16-7.16V219.35c0-3.96-3.21-7.16-7.16-7.16H307.81z M282.33,264.94 c-0.86,13.64-11.93,24.71-25.58,25.58c-16.54,1.05-30.18-12.59-29.14-29.14c0.86-13.64,11.93-24.71,25.58-25.58 C269.74,234.76,283.38,248.4,282.33,264.94z"></path>
                                                                <path fill="currentColor"
                                                                    d="M82.95,272.41c3.82,0,7.53-1.53,10.23-4.23l21.23-21.23c4.74-4.74,6.4-11.92,3.73-18.06 c-2.73-6.29-8.88-8.95-18.84-7.57l-0.27,0.27c15.78-71.56,79.7-125.27,155.94-125.27c60.72,0,115.41,33.72,142.73,87.99 c3.58,7.11,12.24,9.97,19.34,6.39c7.11-3.58,9.97-12.24,6.39-19.34c-15.47-30.73-39.05-56.66-68.22-75.01 C325.23,77.47,290.57,67.5,254.98,67.5c-93,0-170.48,67.71-185.75,156.41c-5.38-4.77-13.59-5.18-19.13-0.44 c-6.3,5.39-6.75,14.88-1.13,20.84c0.23,0.24,5.69,6.03,11.41,11.93c3.41,3.51,6.2,6.33,8.3,8.38c4.23,4.13,7.88,7.69,14.07,7.78 C82.81,272.41,82.88,272.41,82.95,272.41z"></path>
                                                                <path fill="currentColor"
                                                                    d="M464.28,247.82l-26.5-26.5c-2.75-2.75-6.57-4.3-10.44-4.23c-2.33,0.03-4.29,0.56-6.07,1.42 c-0.26,0.12-0.51,0.26-0.76,0.4c-0.04,0.02-0.08,0.04-0.12,0.06c-0.59,0.33-1.16,0.68-1.69,1.08c-1.88,1.34-3.6,3.03-5.44,4.82 c-2.1,2.05-4.89,4.87-8.3,8.38c-5.72,5.9-11.18,11.68-11.41,11.93c-5.46,5.79-5.19,14.91,0.6,20.36 c5.75,5.42,14.77,5.18,20.24-0.48c-4.72,83.85-74.42,150.62-159.43,150.62c-70.52,0-131.86-45.23-152.62-112.55 c-2.35-7.6-10.41-11.86-18.01-9.52c-7.6,2.34-11.86,10.41-9.52,18.01c11.62,37.68,35.48,71.52,67.19,95.28 c32.8,24.59,71.86,37.58,112.96,37.58c100.11,0,182.23-78.45,188.14-177.1l0.79,0.79c2.81,2.81,6.5,4.22,10.18,4.22 c3.69,0,7.37-1.41,10.18-4.22C469.91,262.57,469.91,253.45,464.28,247.82z"></path>
                                                            </svg>
                                                            تغییر تریلر مسیر
                                                        </button>
                                                    </div>
                                                    <div class="absolute top-2 end-2 z-10 flex items-center space-x-2 rtl:space-x-reverse">
                                                        <button @click.prevent="pathFormRoot.removeFile('trailer')" title="حذف تریلر مسیر"
                                                            class="h-6 text-white bg-rose-600 text-xs font-semibold px-2 py-[3px] rounded shadow hover:bg-opacity-90 dark:hover:bg-opacity-90 flex items-center">
                                                            <svg class="w-4 h-4 me-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z" fill="currentColor"></path>
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12404C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001ZM10.2463 12.1886C10.2051 11.7548 9.83753 11.4382 9.42537 11.4816C9.01321 11.525 8.71251 11.9119 8.75372 12.3457L9.25372 17.6089C9.29494 18.0427 9.66247 18.3593 10.0746 18.3159C10.4868 18.2725 10.7875 17.8856 10.7463 17.4518L10.2463 12.1886ZM14.5746 11.4816C14.9868 11.525 15.2875 11.9119 15.2463 12.3457L14.7463 17.6089C14.7051 18.0427 14.3375 18.3593 13.9254 18.3159C13.5132 18.2725 13.2125 17.8856 13.2537 17.4518L13.7537 12.1886C13.7949 11.7548 14.1625 11.4382 14.5746 11.4816Z" fill="currentColor"></path>
                                                            </svg>
                                                            حذف تریلر مسیر
                                                        </button>
                                                    </div>
                                                </div>
                                                <label v-else for="path-form-trailer"
                                                    class="relative border-2 group flex flex-col items-center justify-center w-full h-48 rounded-lg cursor-pointer transition overflow-hidden"
                                                    :class="[
                                                        errors && errors.trailer ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700',
                                                        trailerPreview.thumbnail
                                                            ? 'p-0'
                                                            : 'bg-gray-50 dark:bg-gray-700  border-dashed hover:bg-gray-100 dark:hover:bg-gray-600'
                                                    ]" @dragover.prevent @drop.prevent="pathFormRoot.handleFile('trailer', $event)">
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
                                                        <img onerror="this.style.display='none'" :src="trailerPreview.thumbnail"
                                                            class="w-full h-full object-cover " />
                                                        <button
                                                            v-if="trailer && (uploadStatus.trailer === 'pending' || uploadStatus.trailer === 'error')"
                                                            type="button" title="تغییر تریلر"
                                                            class="z-10 absolute top-2 start-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 text-xs font-semibold px-2 py-[3px] rounded-lg shadow hover:bg-opacity-100 dark:hover:bg-opacity-100 flex items-center"
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
                                                                @click.prevent="pathFormRoot.cancelUpload('trailer')" title="لغو آپلود"
                                                                class="w-6 h-6 shadow rounded-lg bg-rose-500 text-white flex items-center justify-center">
                                                                <svg class="w-4 h-4" fill="none" viewBox="0 0 32 32" version="1.1"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill="currentColor"
                                                                        d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z">
                                                                    </path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                v-if="trailer && (uploadStatus.trailer === 'pending' || uploadStatus.trailer === 'error')"
                                                                @click.prevent="pathFormRoot.removeLocal('trailer')" title="حذف"
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
                                                                v-if="trailer && path_id && (uploadStatus.trailer === 'pending' || uploadStatus.trailer === 'error')"
                                                                @click.prevent="pathFormRoot.uploadFile(path_id, 'trailer')" title="آپلود مجدد"
                                                                class="w-6 h-6 shadow rounded-lg bg-gray-700 text-white flex items-center justify-center">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z"
                                                                        fill="currentColor"></path>
                                                                    <path
                                                                        d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"
                                                                        fill="currentColor"></path>
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
                                                        :class="{ 'hidden': ['uploaded'].includes(uploadStatus.trailer) }"
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
                                            </div>
                                        </div>
            </div>
        </section>

        <!-- faqs -->
        <section v-show="stepId === 'faqs'" class="admin-form-section space-y-3">
            <div class="mb-2">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">سوالات متداول</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">سوالات و پاسخ‌های متداول مربوط به این مسیر</p>
            </div>
            <div v-for="(faq, index) in form.faqs" :key="index" class="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300"></div>
                    <button type="button" @click="removeFaq(index)" class="bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-lg text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="space-y-3">
                    <div>
                        <label class="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">سوال</label>
                        <input v-model="faq.question" type="text" class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" placeholder="" />
                    </div>
                    <div>
                        <label class="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">پاسخ</label>
                        <textarea v-model="faq.answer" rows="4" class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" placeholder=""></textarea>
                    </div>
                </div>
            </div>
            <div v-if="form.faqs.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm">هنوز سوالی اضافه نشده است</p>
            </div>
            <div class="flex justify-center">
                <button type="button" @click="addFaq" class="inline-flex items-center px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                    <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    افزودن سوال جدید
                </button>
            </div>
        </section>

        <!-- confirm -->
        <section v-show="stepId === 'confirm'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">تایید و ثبت</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">یک بار دیگر اطلاعات را بررسی کنید</p>
            </div>
            <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900 p-5 mb-4">
                <div class="flex flex-wrap items-start justify-between gap-4">
                    <div class="min-w-0">
                        <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">عنوان مسیر</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ form.title || '—' }}</p>
                    </div>
                    <div class="text-end">
                        <p class="text-[10px] font-semibold text-gray-400 mb-1">وضعیت</p>
                        <span class="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md" :class="form.status ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'">
                            {{ getStatusLabel() }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="rounded-xl border border-gray-200/80 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                <div class="px-4 py-3 flex items-center justify-between gap-2 text-xs">
                    <span class="text-gray-400">روش اختصاص دوره</span>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{ getAssignmentTypeLabel() }}</span>
                </div>
                <div class="px-4 py-3 flex items-center justify-between gap-2 text-xs">
                    <span class="text-gray-400">{{ coursesCountLabel }}</span>
                    <span class="summary-badge">{{ coursesCount }}</span>
                </div>
                <div class="px-4 py-3 flex items-center justify-between gap-2 text-xs">
                    <span class="text-gray-400">پیش‌نیازها</span>
                    <span class="summary-badge">{{ (selectedPrerequisites || []).length }}</span>
                </div>
                <div class="px-4 py-3 flex items-center justify-between gap-2 text-xs">
                    <span class="text-gray-400">هم‌نیازها</span>
                    <span class="summary-badge">{{ (selectedCorequisites || []).length }}</span>
                </div>
                <div class="px-4 py-3 flex items-center justify-between gap-2 text-xs">
                    <span class="text-gray-400">قدم‌های بعدی</span>
                    <span class="summary-badge">{{ (selectedNextSteps || []).length }}</span>
                </div>
                <div class="px-4 py-3 flex items-center justify-between gap-2 text-xs">
                    <span class="text-gray-400">سوالات متداول</span>
                    <span class="summary-badge">{{ (form.faqs || []).length }}</span>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import AsyncSearchSelect from "@/views/components/multiselect/AsyncSearchSelect.vue";
import AdminInstallmentToggle from "@/views/components/admin/AdminInstallmentToggle.vue";
import { pathFormHelpers } from "./pathFormMixin.js";

function rootProxy(key) {
    return {
        get() {
            return this.pathFormRoot[key];
        },
        set(v) {
            this.pathFormRoot[key] = v;
        },
    };
}

export default {
    name: "PathFormSections",
    mixins: [pathFormHelpers],
    inject: {
        pathFormRoot: { required: true },
    },
    props: {
        stepId: {
            type: String,
            default: "basic",
        },
    },
    components: { AsyncSearchSelect, AdminInstallmentToggle },
    computed: {
        form() {
            return this.pathFormRoot.form;
        },
        errors: rootProxy("errors"),
        rules: rootProxy("rules"),
        pathSlug() {
            return this.pathFormRoot.pathSlug;
        },
        path_id: rootProxy("path_id"),
        selectedCourses: rootProxy("selectedCourses"),
        selectedPrerequisites: rootProxy("selectedPrerequisites"),
        selectedCorequisites: rootProxy("selectedCorequisites"),
        selectedNextSteps: rootProxy("selectedNextSteps"),
        icon: rootProxy("icon"),
        poster: rootProxy("poster"),
        trailer: rootProxy("trailer"),
        iconPreview: rootProxy("iconPreview"),
        posterPreview: rootProxy("posterPreview"),
        trailerPreview: rootProxy("trailerPreview"),
        uploadStatus: rootProxy("uploadStatus"),
        progress: rootProxy("progress"),
        controllers: rootProxy("controllers"),
        fileValidationRules() {
            return this.pathFormRoot.fileValidationRules;
        },
        oldIcon: rootProxy("oldIcon"),
        oldPoster: rootProxy("oldPoster"),
        oldTrailer: rootProxy("oldTrailer"),
        coursesCount() {
            if (this.form.assignment_type === "manual") {
                return (this.selectedCourses || []).length;
            }
            return (this.rules || []).length;
        },
        coursesCountLabel() {
            return this.form.assignment_type === "manual" ? "دوره‌ها" : "قوانین";
        },
    },
};
</script>

<style scoped>
.admin-form-section {
    background: white;
    border-radius: 1rem;
    border: 1px solid rgba(229, 231, 235, 0.8);
    padding: 1.25rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.dark .admin-form-section {
    background: #111827;
    border-color: rgba(55, 65, 81, 0.8);
}
.form-input {
    display: block;
    width: 100%;
    margin-top: 0.25rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.75rem;
    outline: none;
    background: #f3f4f6;
    color: #111827;
    border: 1px solid transparent;
    transition: box-shadow 0.15s;
}
.form-input:focus { box-shadow: 0 0 0 2px #facc15; }
.dark .form-input { background: #374151; color: #fff; }
.field-label {
    display: block;
    font-size: 0.6875rem;
    font-weight: 600;
    color: #9ca3af;
    margin-bottom: 0.25rem;
}
.summary-badge {
    display: inline-flex;
    padding: 0.125rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.6875rem;
    font-weight: 700;
    background: #fef3c7;
    color: #92400e;
}
.dark .summary-badge { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
</style>
