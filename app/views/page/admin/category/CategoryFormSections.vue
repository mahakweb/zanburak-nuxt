<template>
    <div class="space-y-4">
        <!-- basic -->
        <section v-show="stepId === 'basic'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات پایه</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">عنوان، والد، برچسب‌ها و وضعیت</p>
            </div>
            <div class="grid gap-x-6 gap-y-3 grid-cols-1 md:grid-cols-2">
                <div>
                    <label class="field-label">عنوان فارسی</label>
                    <input v-model="categoryFormRoot.form.title" type="text" class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" :class="inputError('title')" />
                    <span v-if="errors.title" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.title[0] }}</span>
                </div>
                <div>
                    <label class="field-label">عنوان انگلیسی</label>
                    <input v-model="categoryFormRoot.form.english_title" @input="filterEnglish" type="text" dir="ltr" class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white font-sans" :class="inputError('english_title')" />
                    <span v-if="errors.english_title" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.english_title[0] }}</span>
                    <p class="text-xs text-gray-400 mt-1">برای ساخت آدرس (slug) استفاده می‌شود.</p>
                </div>
                <div>
                    <label class="field-label">دسته‌بندی والد</label>
                    <AdvancedMultiSelect
                        v-model="parent"
                        :options="categories"
                        :maxSelection="1"
                        :closeOnSelect="true"
                        optionLabel="title"
                        optionValue="id"
                        placeholder="انتخاب کنید"
                        :enableSearch="true"
                        :enableSelectAll="false"
                        :enableClearAll="false"
                        :class="inputError('parent_id') ? 'ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 rounded-lg' : ''"
                    />
                    <span v-if="errors.parent_id" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.parent_id[0] }}</span>
                </div>
                <div>
                    <label class="field-label">وضعیت</label>
                    <ul class="h-10 grid w-full grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <li>
                            <input v-model="categoryFormRoot.form.status" type="radio" id="cat-status-0" :value="0" class="hidden peer" />
                            <label for="cat-status-0" class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                <div class="block text-xs font-semibold text-center w-full">غیرفعال</div>
                            </label>
                        </li>
                        <li>
                            <input v-model="categoryFormRoot.form.status" type="radio" id="cat-status-1" :value="1" class="hidden peer" />
                            <label for="cat-status-1" class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                <div class="block text-xs font-semibold text-center w-full">فعال</div>
                            </label>
                        </li>
                    </ul>
                    <span v-if="errors.status" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.status[0] }}</span>
                </div>
                <div class="md:col-span-2">
                    <label class="field-label">برچسب‌های دسته‌بندی</label>
                    <vue3-tags-input
                        class="bg-gray-100 border border-gray-300 text-gray-900 text-sm border-none rounded-lg focus:outline-none focus:border-none dark:focus:outline-none dark:focus:border-none focus-within:border-transparent dark:focus-within:border-transparent focus-within:ring-yellow-500 block w-full p-1 dark:bg-gray-700 dark:placeholder-gray-400 focus-within:ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 dark:text-white dark:focus-within:ring-yellow-500"
                        :class="inputError('tags')"
                        placeholder=""
                        :limit="3"
                        :loading="true"
                        :tags="form.tags"
                        :duplicate-select-item="true"
                        @on-tags-changed="handleChangeTag"
                    />
                    <span v-if="errors.tags" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.tags[0] }}</span>
                    <p class="text-xs text-gray-400 mt-1">با اینتر یا فاصله برچسب‌ها را جدا کنید.</p>
                </div>
            </div>
        </section>

        <!-- description -->
        <section v-show="stepId === 'description'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">توضیحات</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">معرفی مختصر دسته‌بندی</p>
            </div>
            <div>
                <label class="field-label">توضیحات دسته‌بندی</label>
                <textarea v-model="categoryFormRoot.form.description" rows="6" class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" :class="inputError('description')" />
                <span v-if="errors.description" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.description[0] }}</span>
                <p class="text-xs text-gray-400 mt-1">توضیح مختصر در حد ۲–۳ جمله.</p>
            </div>
        </section>

        <!-- media -->
        <section v-show="stepId === 'media'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">آیکون دسته‌بندی</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">تصویر نمایشی دسته در سایت</p>
            </div>
            <input
                ref="icon"
                id="category-form-icon"
                type="file"
                :disabled="uploadStatus.icon === 'uploaded'"
                :accept="fileValidationRules.icon.extensions.join(',')"
                class="hidden"
                @change="categoryFormRoot.handleIcon($event)"
            />
            <div id="icon-section" class="max-w-sm">
                <label class="flex items-center justify-between mb-1 field-label">
                    <span>آیکون</span>
                    <span v-if="icon || oldIcon" class="text-[10px] font-medium text-gray-400 font-sans">
                        <template v-if="uploadStatus.icon === 'pending'">در انتظار آپلود</template>
                        <template v-else-if="uploadStatus.icon === 'uploading'">در حال آپلود…</template>
                        <template v-else-if="uploadStatus.icon === 'uploaded'">آپلود شده</template>
                    </span>
                </label>
                <div v-if="isEdit && oldIcon && !icon" class="relative">
                    <div class="h-48 overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <img :src="oldIcon" alt="" class="h-full w-full object-cover" onerror="this.style.display='none'" />
                    </div>
                    <button
                        type="button"
                        class="absolute top-2 start-2 rounded-lg bg-white/90 dark:bg-gray-900/90 px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-100 shadow"
                        @click="$refs.icon.click()"
                    >
                        تغییر آیکون
                    </button>
                </div>
                <label
                    v-else
                    for="category-form-icon"
                    class="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 transition"
                    :class="[
                        errors?.icon ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600',
                        iconPreview.url ? 'p-0' : 'border-dashed bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800',
                    ]"
                    @dragover.prevent
                    @drop.prevent="categoryFormRoot.handleIcon($event)"
                >
                    <template v-if="!iconPreview.url">
                        <svg class="mb-3 h-9 w-9 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-xs text-gray-500 dark:text-gray-400"><span class="font-semibold">کلیک</span> یا کشیدن فایل</p>
                        <p class="mt-1 text-[10px] text-gray-400">{{ fileValidationRules.icon.extensions.join(', ') }} — حداکثر {{ formatFileSize(fileValidationRules.icon.maxSize, 0, 'fa') }}</p>
                    </template>
                    <template v-else>
                        <img :src="iconPreview.url" alt="" class="h-full w-full object-cover" />
                        <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <span class="truncate text-[10px] font-medium text-white">{{ iconPreview.name }}</span>
                            <button type="button" class="shrink-0 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold text-gray-900" @click.prevent="categoryFormRoot.removeIcon()">حذف</button>
                        </div>
                        <div
                            v-if="icon && !progress.icon.completed && uploadStatus.icon !== 'uploaded'"
                            class="absolute inset-y-0 start-0 bg-emerald-400/20 border-e-2 border-emerald-400/50 transition-all"
                            :style="`width: ${progress.icon.percent}%`"
                        />
                    </template>
                </label>
                <span v-if="errors?.icon" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.icon[0] }}</span>
                <p class="mt-1 text-xs text-gray-400">آیکون دسته‌بندی را در صورت امکان وارد کنید.</p>
            </div>
        </section>

        <!-- assignment -->
        <section v-show="stepId === 'assignment'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">اختصاص دوره‌ها</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">روش نسبت‌دادن دوره‌ها به این دسته‌بندی</p>
            </div>
            <div class="space-y-3">
                <ul class="space-y-3">
                    <li>
                        <input v-model="categoryFormRoot.form.assignment_type" type="radio" id="cat-assign-manual" value="manual" class="hidden peer" />
                        <label for="cat-assign-manual" class="inline-flex items-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-xl cursor-pointer dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <svg class="w-5 h-5 me-3 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v2H3V5a2 2 0 0 1 2-2Zm16 6H3v8a2 2 0 0 0 2 2h6v-4H9v-2h6v2h-2v4h6a2 2 0 0 0 2-2V9Z" /></svg>
                            <div>
                                <div class="text-sm font-semibold">دستی</div>
                                <div class="text-xs mt-0.5">هنگام ایجاد یا ویرایش دوره، آن را به این دسته اضافه کنید.</div>
                            </div>
                        </label>
                    </li>
                    <li>
                        <input v-model="categoryFormRoot.form.assignment_type" type="radio" id="cat-assign-auto" value="automatic" class="hidden peer" />
                        <label for="cat-assign-auto" class="inline-flex items-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-xl cursor-pointer dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <svg class="w-5 h-5 me-3 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10h-2A8 8 0 1 1 12 4V2Zm1 1v9h7v-2h-5V3h-2Z" /></svg>
                            <div>
                                <div class="text-sm font-semibold">خودکار</div>
                                <div class="text-xs mt-0.5">دوره‌های منطبق با شروط زیر به‌طور خودکار اضافه می‌شوند.</div>
                            </div>
                        </label>
                    </li>
                </ul>
                <span v-if="errors.assignment_type" class="text-rose-500 text-xs font-medium block">{{ errors.assignment_type[0] }}</span>

                <div v-if="form.assignment_type === 'automatic'" class="mt-2 border border-dashed border-gray-200 dark:border-gray-700 p-3 md:px-4 rounded-xl">
                    <div class="flex flex-col md:flex-row md:items-center gap-4">
                        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">دوره‌ها مطابقت داشته باشند با:</div>
                        <ul class="w-max flex items-center text-xs bg-gray-100 dark:bg-gray-700 py-2 px-1 rounded-full">
                            <li>
                                <input v-model="categoryFormRoot.form.match_type" type="radio" id="cat-match-all" value="all" class="hidden peer" />
                                <label for="cat-match-all" class="px-3 py-1 text-gray-700 dark:text-gray-300 rounded-full cursor-pointer font-semibold dark:peer-checked:text-black peer-checked:bg-yellow-400">همه شرایط</label>
                            </li>
                            <li>
                                <input v-model="categoryFormRoot.form.match_type" type="radio" id="cat-match-any" value="any" class="hidden peer" />
                                <label for="cat-match-any" class="px-3 py-1 text-gray-700 dark:text-gray-300 rounded-full cursor-pointer font-semibold dark:peer-checked:text-black peer-checked:bg-yellow-400">هر شرطی</label>
                            </li>
                        </ul>
                    </div>
                    <span v-if="errors.match_type" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.match_type[0] }}</span>
                    <hr v-if="rules.length" class="border-t border-dashed border-gray-200 dark:border-gray-700/50 my-3">
                    <transition-group tag="div" name="fade">
                        <div v-for="(rule, index) in rules" :key="index" class="flex flex-col lg:flex-row lg:items-start gap-2 mb-3 last:mb-0">
                            <div class="w-full flex items-start gap-2">
                                <div class="w-full">
                                    <select v-model="rule.field" class="bg-gray-100 text-gray-900 text-xs font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:text-white" :class="inputError(`rules.${index}.field`)">
                                        <option value="">فیلد</option>
                                        <option value="title">عنوان</option>
                                        <option value="english_title">عنوان انگلیسی</option>
                                        <option value="short_description">توضیح کوتاه</option>
                                        <option value="description">توضیحات</option>
                                        <option value="publish">وضعیت انتشار</option>
                                        <option value="status">وضعیت</option>
                                        <option value="level">سطح</option>
                                        <option value="totalTime">مدت زمان</option>
                                        <option value="price">قیمت</option>
                                        <option value="start_date">تاریخ شروع</option>
                                        <option value="end_date">تاریخ پایان</option>
                                    </select>
                                </div>
                                <div class="w-full">
                                    <select v-model="rule.operator" class="bg-gray-100 text-gray-900 text-xs font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:text-white" :class="inputError(`rules.${index}.operator`)">
                                        <option value="">عملگر</option>
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
                            <div class="w-full flex items-start gap-2">
                                <input v-model="rule.value" type="text" class="bg-gray-100 text-gray-900 text-xs font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white" :class="inputError(`rules.${index}.value`)" />
                                <button type="button" class="shrink-0 rounded-lg p-2 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20" @click.prevent="removeRule(index)">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path opacity="0.5" d="M11.607 22h.796c2.782 0 4.175 0 5.079-.864.904-.864.994-2.28 1.174-5.112l.26-4.08c.098-1.537.147-2.305-.295-2.792-.442-.487-1.188-.487-2.679-.487H7.229c-1.491 0-2.237 0-2.679.487-.443.487-.394 1.255-.296 2.792l.26 4.08c.18 2.832.27 4.248 1.174 5.112.904.864 2.297.864 5.079.864Z" fill="currentColor"/><path d="M3 6.524C3 6.129 3.327 5.81 3.73 5.81h4.788c.007-.841.098-1.994.933-2.793.657-.628 1.558-1.016 2.549-1.016.992 0 1.893.388 2.55 1.016.835.799.926 1.952.933 2.793h4.788c.403 0 .73.32.73.714s-.327.715-.73.715H3.73C3.327 7.238 3 6.918 3 6.524Z" fill="currentColor"/></svg>
                                </button>
                            </div>
                        </div>
                    </transition-group>
                    <button type="button" class="mt-3 bg-yellow-400 text-black text-xs font-semibold rounded-lg px-3 h-9 hover:bg-yellow-500 flex items-center justify-center" @click.prevent="addRule">
                        <svg class="me-1 w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 12H18M12 6V18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
                        افزودن شرط جدید
                    </button>
                    <div v-if="errors.rules" class="mt-3 text-rose-500 text-xs font-medium">{{ errors.rules[0] }}</div>

                    <div class="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40 p-3">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div>
                                <p class="text-xs font-semibold text-gray-800 dark:text-gray-200">دوره‌های منطبق با شروط</p>
                                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">به‌صورت خودکار بر اساس شروط بالا محاسبه می‌شود</p>
                            </div>
                            <button
                                type="button"
                                class="text-[10px] font-semibold px-2.5 h-7 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                :disabled="previewLoading"
                                @click.prevent="previewMatchedCourses"
                            >
                                {{ previewLoading ? "در حال محاسبه..." : "بروزرسانی" }}
                            </button>
                        </div>

                        <div v-if="previewLoading" class="py-4 text-center text-xs text-gray-500">در حال جستجوی دوره‌ها...</div>
                        <div v-else-if="matchedCoursesPreview.length" class="space-y-2">
                            <p class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">{{ matchedCoursesPreview.length }} دوره منطبق</p>
                            <ul class="max-h-48 overflow-y-auto space-y-1.5">
                                <li
                                    v-for="course in matchedCoursesPreview"
                                    :key="course.id"
                                    class="flex items-center gap-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-2 py-1.5"
                                >
                                    <img
                                        v-if="course.poster"
                                        :src="course.poster"
                                        :alt="course.title"
                                        class="w-8 h-8 rounded object-cover shrink-0"
                                    />
                                    <div v-else class="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
                                    <span class="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-1 flex-1">{{ course.title }}</span>
                                    <router-link
                                        :to="{ name: 'admin-courses-list', query: { search: course.slug } }"
                                        class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 shrink-0 hover:underline"
                                    >
                                        مشاهده
                                    </router-link>
                                </li>
                            </ul>
                            <router-link
                                v-if="isEdit && resolvedCategorySlug"
                                :to="coursesListRoute(resolvedCategorySlug)"
                                class="inline-flex items-center text-[10px] font-semibold text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400"
                            >
                                مشاهده همه در فهرست دوره‌ها ←
                            </router-link>
                        </div>
                        <p v-else class="py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                            با شروط فعلی دوره‌ای یافت نشد. شروط را کامل کنید یا بروزرسانی بزنید.
                        </p>
                    </div>
                </div>
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
                        <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">دسته‌بندی</p>
                        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ form.title || '—' }}</p>
                        <p v-if="form.english_title" class="mt-1 text-sm text-gray-500 dark:text-gray-400 font-sans" dir="ltr">{{ form.english_title }}</p>
                    </div>
                    <span class="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md" :class="Number(form.status) === 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'">
                        {{ getStatusLabel() }}
                    </span>
                </div>
            </div>
            <div class="rounded-xl border border-gray-200/80 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                <div class="px-4 py-3 flex items-center justify-between gap-2">
                    <span class="text-gray-400">دسته والد</span>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{ parentTitle }}</span>
                </div>
                <div class="px-4 py-3 flex items-center justify-between gap-2">
                    <span class="text-gray-400">برچسب‌ها</span>
                    <span class="summary-badge">{{ (form.tags || []).length }}</span>
                </div>
                <div class="px-4 py-3">
                    <p class="text-gray-400 mb-1">توضیحات</p>
                    <p class="text-gray-700 dark:text-gray-300 line-clamp-3">{{ form.description || '—' }}</p>
                </div>
                <div class="px-4 py-3 flex items-center justify-between gap-2">
                    <span class="text-gray-400">آیکون</span>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{ getIconStatusLabel() }}</span>
                </div>
                <div class="px-4 py-3 flex items-center justify-between gap-2">
                    <span class="text-gray-400">اختصاص دوره</span>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{ getAssignmentTypeLabel() }}</span>
                </div>
                <div v-if="form.assignment_type === 'automatic'" class="px-4 py-3 flex items-center justify-between gap-2">
                    <span class="text-gray-400">شرایط</span>
                    <span class="summary-badge">{{ rules.length }} شرط — {{ form.match_type === 'all' ? 'همه' : 'هر کدام' }}</span>
                </div>
                <div v-if="form.assignment_type === 'automatic'" class="px-4 py-3 flex items-center justify-between gap-2">
                    <span class="text-gray-400">دوره‌های منطبق</span>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{ matchedCoursesPreview.length }} دوره</span>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import Vue3TagsInput from "vue3-tags-input";
import AdvancedMultiSelect from "@/views/components/multiselect/AdvancedMultiSelect.vue";
import { categoryFormHelpers } from "./categoryFormMixin.js";

function rootProxy(key) {
    return {
        get() {
            return this.categoryFormRoot[key];
        },
        set(v) {
            this.categoryFormRoot[key] = v;
        },
    };
}

export default {
    name: "CategoryFormSections",
    components: { Vue3TagsInput, AdvancedMultiSelect },
    mixins: [categoryFormHelpers],
    inject: {
        categoryFormRoot: { required: true },
    },
    props: {
        stepId: { type: String, default: "basic" },
    },
    computed: {
        form() {
            return this.categoryFormRoot.form;
        },
        errors: rootProxy("errors"),
        parent: rootProxy("parent"),
        categories: rootProxy("categories"),
        rules: rootProxy("rules"),
        matchedCoursesPreview: rootProxy("matchedCoursesPreview"),
        previewLoading: rootProxy("previewLoading"),
        icon: rootProxy("icon"),
        oldIcon: rootProxy("oldIcon"),
        iconPreview: rootProxy("iconPreview"),
        uploadStatus: rootProxy("uploadStatus"),
        progress: rootProxy("progress"),
        fileValidationRules() {
            return this.categoryFormRoot.fileValidationRules;
        },
    },
    watch: {
        "form.assignment_type"() {
            this.scheduleMatchedCoursesPreview();
        },
        "form.match_type"() {
            this.scheduleMatchedCoursesPreview();
        },
        rules: {
            deep: true,
            handler() {
                this.scheduleMatchedCoursesPreview();
            },
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
.summary-badge {
    display: inline-flex;
    padding: 0.125rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.6875rem;
    font-weight: 700;
    background: #fef3c7;
    color: #92400e;
}
.dark .summary-badge {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
}
</style>
