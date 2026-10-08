<template>
    <div class="space-y-4">
        <!-- basic -->
        <section v-show="stepId === 'basic'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات پایه</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">کد، نوع، مقدار و وضعیت تخفیف</p>
            </div>

            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="field-label">کد تخفیف <span class="text-rose-500">*</span></label>
                        <input
                            type="text"
                            v-model="discountFormRoot.form.code"
                            required
                            class="form-input font-sans uppercase tracking-wide"
                            :class="{ 'ring-2 ring-rose-500': errorAt('code') }"
                            placeholder="مثلاً SUMMER1404"
                        />
                        <span v-if="errorAt('code')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('code')[0] }}</span>
                        <p class="text-[11px] text-gray-400 mt-1">کد باید منحصر به فرد و بدون فاصله باشد</p>
                    </div>
                    <div>
                        <label class="field-label">عنوان</label>
                        <input
                            type="text"
                            v-model="discountFormRoot.form.title"
                            class="form-input"
                            :class="{ 'ring-2 ring-rose-500': errorAt('title') }"
                            placeholder="مثلاً تخفیف تابستانه"
                        />
                        <span v-if="errorAt('title')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('title')[0] }}</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <label class="field-label">نوع تخفیف <span class="text-rose-500">*</span></label>
                        <ul class="h-10 grid w-full grid-cols-3 p-1 rounded-xl bg-gray-100 dark:bg-gray-700">
                            <li v-for="opt in typeOptions" :key="opt.value">
                                <input v-model="discountFormRoot.form.type" type="radio" :id="`dtype-${opt.value}`" name="discount-type" :value="opt.value" class="hidden peer" />
                                <label :for="`dtype-${opt.value}`" class="h-full inline-flex items-center justify-center w-full px-2 text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400 transition-colors">
                                    {{ opt.label }}
                                </label>
                            </li>
                        </ul>
                        <span v-if="errorAt('type')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('type')[0] }}</span>
                    </div>

                    <div v-if="form.type && form.type !== 'free'">
                        <label class="field-label">
                            مقدار تخفیف
                            <span v-if="form.type === 'percent'">(درصد)</span>
                            <span v-if="form.type === 'fixed'">(تومان)</span>
                        </label>
                        <input
                            type="number"
                            v-model="discountFormRoot.form.value"
                            :required="form.type !== 'free'"
                            min="0"
                            :max="form.type === 'percent' ? 100 : null"
                            class="form-input"
                            :class="{ 'ring-2 ring-rose-500': errorAt('value') }"
                            :placeholder="form.type === 'percent' ? 'مثلاً 20' : 'مثلاً 50000'"
                        />
                        <span v-if="errorAt('value')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('value')[0] }}</span>
                    </div>
                    <div v-else-if="form.type === 'free'" class="hidden md:flex h-10 items-center rounded-xl bg-gray-100 dark:bg-gray-800 px-3 text-xs font-medium text-gray-600 dark:text-gray-300">
                        این کد، خرید را رایگان می‌کند
                    </div>
                </div>
                <p v-if="form.type === 'free'" class="md:hidden text-xs font-medium text-gray-500 dark:text-gray-400 -mt-2">
                    این کد، خرید را رایگان می‌کند
                </p>

                <div>
                    <label class="field-label">توضیحات داخلی</label>
                    <textarea
                        v-model="discountFormRoot.form.description"
                        rows="3"
                        class="form-input"
                        :class="{ 'ring-2 ring-rose-500': errorAt('description') }"
                        placeholder="توضیح کوتاه برای تیم یا صفحه پروموشن"
                    ></textarea>
                    <span v-if="errorAt('description')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('description')[0] }}</span>
                </div>

                <div v-if="form.type === 'percent'" class="max-w-sm">
                    <label class="field-label">سقف مبلغ تخفیف (تومان)</label>
                    <input
                        type="number"
                        v-model="discountFormRoot.form.max_discount_amount"
                        min="0"
                        class="form-input"
                        :class="{ 'ring-2 ring-rose-500': errorAt('max_discount_amount') }"
                        placeholder="بدون سقف"
                    />
                    <p class="text-[11px] text-gray-400 mt-1">برای تخفیف درصدی، حداکثر مبلغ قابل کسر را محدود می‌کند</p>
                    <span v-if="errorAt('max_discount_amount')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('max_discount_amount')[0] }}</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="field-label">ترکیب با تخفیف مستقیم دوره</label>
                        <ul class="h-10 grid grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700">
                            <li>
                                <input v-model="discountFormRoot.form.stackable" type="radio" id="discount-stackable" name="discount-stackable" :value="true" class="hidden peer" />
                                <label for="discount-stackable" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">مجاز</label>
                            </li>
                            <li>
                                <input v-model="discountFormRoot.form.stackable" type="radio" id="discount-not-stackable" name="discount-stackable" :value="false" class="hidden peer" />
                                <label for="discount-not-stackable" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">فقط بزرگ‌تر</label>
                            </li>
                        </ul>
                        <p class="text-[11px] text-gray-400 mt-1">هر دو تخفیف از قیمت اصلی محاسبه می‌شوند، نه از قیمت بعد از تخفیف</p>
                    </div>
                    <div>
                        <label class="field-label">تخفیف مستقیم روی دوره</label>
                        <ul class="h-10 grid grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700">
                            <li>
                                <input v-model="discountFormRoot.form.apply_automatically" type="radio" id="discount-auto-on" name="discount-auto" :value="true" class="hidden peer" />
                                <label for="discount-auto-on" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">نمایش روی کارت</label>
                            </li>
                            <li>
                                <input v-model="discountFormRoot.form.apply_automatically" type="radio" id="discount-auto-off" name="discount-auto" :value="false" class="hidden peer" />
                                <label for="discount-auto-off" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">فقط با کد</label>
                            </li>
                        </ul>
                        <p class="text-[11px] text-gray-400 mt-1">اگر فعال باشد، قیمت تخفیف‌خورده روی کارت دوره دیده می‌شود</p>
                    </div>
                </div>

                <div class="max-w-sm">
                    <label class="field-label">وضعیت کد تخفیف</label>
                    <ul class="h-10 grid grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700">
                        <li>
                            <input v-model="discountFormRoot.form.is_active" type="radio" id="discount-active" name="discount-status" :value="true" class="hidden peer" />
                            <label for="discount-active" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">فعال</label>
                        </li>
                        <li>
                            <input v-model="discountFormRoot.form.is_active" type="radio" id="discount-inactive" name="discount-status" :value="false" class="hidden peer" />
                            <label for="discount-inactive" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">غیرفعال</label>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- limits -->
        <section v-show="stepId === 'limits'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">محدودیت‌ها</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">تعداد استفاده و بازه زمانی اعتبار</p>
            </div>

            <div class="rounded-xl border border-amber-200/60 bg-amber-50/40 dark:bg-amber-900/10 dark:border-amber-800/30 px-4 py-3 mb-4">
                <p class="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">فیلدهای خالی به معنای «نامحدود» هستند. برای محدود کردن، عدد وارد کنید.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="field-label">حداکثر استفاده کل</label>
                    <input type="number" v-model="discountFormRoot.form.usage_limit" min="1" class="form-input" placeholder="نامحدود" :class="{ 'ring-2 ring-rose-500': errorAt('usage_limit') }" />
                    <span v-if="errorAt('usage_limit')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('usage_limit')[0] }}</span>
                </div>
                <div>
                    <label class="field-label">حداکثر استفاده هر کاربر</label>
                    <input type="number" v-model="discountFormRoot.form.per_user_limit" min="1" class="form-input" placeholder="نامحدود" :class="{ 'ring-2 ring-rose-500': errorAt('per_user_limit') }" />
                    <span v-if="errorAt('per_user_limit')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('per_user_limit')[0] }}</span>
                </div>
                <div>
                    <label class="field-label">تاریخ شروع</label>
                    <div class="flex items-center gap-2">
                        <input type="datetime-local" v-model="discountFormRoot.form.starts_at" class="form-input flex-1" :class="{ 'ring-2 ring-rose-500': errorAt('starts_at') }" />
                        <button type="button" class="shrink-0 text-[11px] text-gray-400 hover:text-rose-500" @click="clearDateField('starts_at')">پاک کردن</button>
                    </div>
                    <span v-if="errorAt('starts_at')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('starts_at')[0] }}</span>
                </div>
                <div>
                    <label class="field-label">تاریخ پایان</label>
                    <div class="flex items-center gap-2">
                        <input type="datetime-local" v-model="discountFormRoot.form.ends_at" class="form-input flex-1" :class="{ 'ring-2 ring-rose-500': errorAt('ends_at') }" />
                        <button type="button" class="shrink-0 text-[11px] text-gray-400 hover:text-rose-500" @click="clearDateField('ends_at')">پاک کردن</button>
                    </div>
                    <span v-if="errorAt('ends_at')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('ends_at')[0] }}</span>
                </div>
            </div>
        </section>

        <!-- promotion -->
        <section v-show="stepId === 'promotion'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">پروموشن عمومی</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">نمایش بنر و صفحه جزئیات برای کدهای تبلیغاتی</p>
            </div>

            <div class="space-y-4">
                <div class="max-w-sm">
                    <label class="field-label">نمایش عمومی در سایت</label>
                    <ul class="h-10 grid grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700">
                        <li>
                            <input v-model="discountFormRoot.form.is_public" type="radio" id="discount-public-on" name="discount-public" :value="true" class="hidden peer" />
                            <label for="discount-public-on" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">بله</label>
                        </li>
                        <li>
                            <input v-model="discountFormRoot.form.is_public" type="radio" id="discount-public-off" name="discount-public" :value="false" class="hidden peer" />
                            <label for="discount-public-off" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">خیر</label>
                        </li>
                    </ul>
                </div>

                <template v-if="form.is_public">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="field-label">عنوان بنر <span v-if="form.banner_description" class="text-rose-500">*</span></label>
                            <input type="text" v-model="discountFormRoot.form.banner_title" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('banner_title') }" placeholder="مثلاً تخفیف ویژه برنامه‌نویسی" />
                            <span v-if="errorAt('banner_title')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('banner_title')[0] }}</span>
                            <p class="text-[11px] text-gray-400 mt-1">اگر خالی بماند در بنر نمایش داده نمی‌شود</p>
                        </div>
                        <div>
                            <label class="field-label">متن دکمه</label>
                            <input type="text" v-model="discountFormRoot.form.cta_text" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('cta_text') }" placeholder="مشاهده جزئیات" />
                            <span v-if="errorAt('cta_text')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('cta_text')[0] }}</span>
                        </div>
                    </div>
                    <div>
                        <label class="field-label">آیکون بنر</label>
                        <div class="flex flex-wrap gap-2">
                            <button
                                type="button"
                                class="h-10 px-3 rounded-xl text-[11px] font-medium border transition-colors"
                                :class="!form.banner_icon
                                    ? 'border-yellow-400 bg-yellow-400/20 text-gray-800 dark:text-gray-100'
                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:border-yellow-300'"
                                @click="discountFormRoot.form.banner_icon = ''"
                            >
                                بدون آیکون
                            </button>
                            <button
                                v-for="icon in bannerIconOptions"
                                :key="icon"
                                type="button"
                                class="w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-colors"
                                :class="form.banner_icon === icon
                                    ? 'border-yellow-400 bg-yellow-400/20'
                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-yellow-300'"
                                @click="discountFormRoot.form.banner_icon = icon"
                            >
                                {{ icon }}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="field-label">توضیح بنر</label>
                        <textarea v-model="discountFormRoot.form.banner_description" rows="3" class="form-input resize-y min-h-[4.5rem]" :class="{ 'ring-2 ring-rose-500': errorAt('banner_description') }" placeholder="فقط تا پایان امروز"></textarea>
                        <span v-if="errorAt('banner_description')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('banner_description')[0] }}</span>
                        <p class="text-[11px] text-gray-400 mt-1">اگر خالی بماند در بنر نمایش داده نمی‌شود. با پر کردن این فیلد، عنوان بنر اجباری می‌شود.</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="field-label">مقصد دکمه</label>
                            <select v-model="discountFormRoot.form.destination_type" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('destination_type') }">
                                <option value="promotion">صفحه جزئیات پروموشن</option>
                                <option value="courses">لیست دوره‌ها</option>
                                <option value="category">دسته‌بندی / مسیر سفارشی</option>
                                <option value="custom">آدرس دلخواه</option>
                            </select>
                        </div>
                        <div>
                            <label class="field-label">اولویت نمایش</label>
                            <input type="number" v-model="discountFormRoot.form.priority" min="0" max="9999" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('priority') }" />
                            <p class="text-[11px] text-gray-400 mt-1">عدد بزرگ‌تر بالاتر نمایش داده می‌شود</p>
                        </div>
                    </div>
                    <div v-if="form.destination_type === 'custom' || form.destination_type === 'category'">
                        <label class="field-label">{{ form.destination_type === 'custom' ? 'آدرس مقصد' : 'مسیر یا اسلاگ مقصد' }}</label>
                        <input type="text" v-model="discountFormRoot.form.destination_url" class="form-input font-sans" :class="{ 'ring-2 ring-rose-500': errorAt('destination_url') }" :placeholder="form.destination_type === 'custom' ? 'https://...' : '/courses?cat=...'" dir="ltr" />
                        <span v-if="errorAt('destination_url')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('destination_url')[0] }}</span>
                    </div>
                </template>
            </div>
        </section>

        <!-- eligibilities -->
        <section
            v-show="stepId === 'eligibilities'"
            class="admin-form-section space-y-4"
            :class="{ 'pb-44': form.eligibilities.some((item) => item.searchResults?.length) }"
        >
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">واجد شرایط</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">مشخص کنید چه کسانی یا چه محصولاتی می‌توانند از این کد استفاده کنند</p>
                </div>
                <button type="button" @click="addEligibility" class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    افزودن قانون
                </button>
            </div>

            <div v-if="!form.eligibilities.length" class="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-10 text-center">
                <div class="mx-auto w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-2">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">هنوز قانون دسترسی اضافه نشده</p>
                <p class="text-[11px] text-gray-400 mt-1">بدون قانون، کد برای همه قابل استفاده است</p>
            </div>

            <div v-else class="rounded-xl border border-gray-200/80 dark:border-gray-800 overflow-visible">
                <div class="hidden md:grid grid-cols-[2rem_6.5rem_6.5rem_1fr_2rem] gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800/80 text-[10px] font-semibold text-gray-400 border-b border-gray-200/80 dark:border-gray-800 rounded-t-xl">
                    <span>#</span><span>نوع</span><span>هدف</span><span>جستجو</span><span/>
                </div>
                <div
                    v-for="(eligibility, index) in form.eligibilities"
                    :key="index"
                    class="grid grid-cols-1 md:grid-cols-[2rem_6.5rem_6.5rem_1fr_2rem] gap-3 items-center px-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 bg-white dark:bg-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    :class="{ 'relative z-30': eligibility.searchResults?.length || eligibility.searching }"
                >
                    <span class="row-index">{{ index + 1 }}</span>
                    <select v-model="eligibility.type" class="compact-input" :class="{ 'ring-2 ring-rose-500': errorAt(`eligibilities.${index}.type`) }">
                        <option value="inclusion">اجازه</option>
                        <option value="exclusion">ممانعت</option>
                    </select>
                    <select v-model="eligibility.target_type" @change="clearTargetSearch(index)" class="compact-input" :class="{ 'ring-2 ring-rose-500': errorAt(`eligibilities.${index}.target_type`) }">
                        <option value="user">کاربر</option>
                        <option value="course">دوره</option>
                        <option value="path">مسیر</option>
                        <option value="vip">اشتراک</option>
                        <option value="category">دسته‌بندی</option>
                    </select>
                    <div class="relative search-dropdown-container min-w-0">
                        <input type="text" v-model="eligibility.search_query" @input="handleTargetSearch(index, $event)" placeholder="نام را جستجو کنید..." class="compact-input w-full" :class="{ 'ring-2 ring-rose-500': errorAt(`eligibilities.${index}.target_id`) }" />
                        <div v-if="eligibility.searchResults?.length" class="search-dropdown">
                            <div v-for="(result, ri) in eligibility.searchResults" :key="ri" @click="selectSearchResult(index, result)" class="search-dropdown-item">
                                <span class="truncate font-medium">{{ searchResultLabel(result) }}</span>
                                <span class="text-[10px] text-gray-400 shrink-0">#{{ result.id }}</span>
                            </div>
                        </div>
                        <div v-else-if="eligibility.search_query?.length >= 2 && !eligibility.target_id && !eligibility.searching && eligibility.searchResults?.length === 0" class="search-dropdown">
                            <div class="px-3 py-2 text-xs text-gray-400 text-center">نتیجه‌ای یافت نشد</div>
                        </div>
                        <div v-if="eligibility.searching" class="absolute start-3 top-1/2 -translate-y-1/2">
                            <div class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-yellow-400 border-t-transparent"></div>
                        </div>
                    </div>
                    <button type="button" @click="removeEligibility(index)" class="delete-btn" title="حذف">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    </button>
                </div>
            </div>
        </section>

        <!-- conditions -->
        <section
            v-show="stepId === 'conditions'"
            class="admin-form-section space-y-4"
            :class="{ 'pb-44': form.conditions.some((item) => item.searchResults?.length) }"
        >
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">شرایط اعمال</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">قوانین سبد خرید برای اعمال خودکار تخفیف</p>
                </div>
                <button type="button" @click="addCondition" class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    افزودن شرط
                </button>
            </div>

            <div v-if="!form.conditions.length" class="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-10 text-center">
                <div class="mx-auto w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-2">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">هنوز شرطی تعریف نشده</p>
                <p class="text-[11px] text-gray-400 mt-1">بدون شرط، تخفیف روی هر سبد خریدی اعمال می‌شود</p>
            </div>

            <div v-else class="space-y-3">
                <div
                    v-for="(condition, index) in form.conditions"
                    :key="index"
                    class="rounded-xl border border-gray-200/80 dark:border-gray-800 overflow-visible bg-white dark:bg-gray-900"
                    :class="{ 'relative z-30': condition.searchResults?.length || condition.searching }"
                >
                    <div class="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200/80 dark:border-gray-800">
                        <div class="flex items-center gap-2 min-w-0 flex-1">
                            <span class="row-index shrink-0">{{ index + 1 }}</span>
                            <select v-model="condition.condition_type" class="compact-input flex-1 min-w-0" :class="{ 'ring-2 ring-rose-500': errorAt(`conditions.${index}.condition_type`) }">
                                <option value="min_cart_total">حداقل مبلغ سبد</option>
                                <option value="max_cart_total">حداکثر مبلغ سبد</option>
                                <option value="min_item_price">حداقل قیمت آیتم</option>
                                <option value="max_item_price">حداکثر قیمت آیتم</option>
                                <option value="min_item_count">حداقل تعداد آیتم</option>
                                <option value="max_item_count">حداکثر تعداد آیتم</option>
                                <option value="first_purchase">اولین خرید</option>
                                <option value="no_purchase_since">عدم خرید از روزهای اخیر</option>
                                <option value="min_orders_count">حداقل تعداد سفارش‌های قبلی</option>
                                <option value="max_orders_count">حداکثر تعداد سفارش‌های قبلی</option>
                                <option value="day_of_week">روز هفته</option>
                                <option value="time_range">بازه زمانی ساعت</option>
                                <option value="date_range">بازه تاریخی</option>
                                <option value="required_item">وجود آیتم الزامی</option>
                                <option value="forbidden_item">وجود آیتم ممنوعه</option>
                                <option value="required_category">وجود دسته‌بندی الزامی</option>
                                <option value="forbidden_category">وجود دسته‌بندی ممنوعه</option>
                                <option value="min_total_spent">حداقل مجموع هزینه‌های گذشته</option>
                                <option value="max_total_spent">حداکثر مجموع هزینه‌های گذشته</option>
                                <option value="purchased_product_before">خرید آیتم مشخص قبلاً</option>
                                <option value="not_purchased_product_before">عدم خرید آیتم مشخص</option>
                                <option value="new_user">کاربر جدید (X روز)</option>
                            </select>
                        </div>
                        <button type="button" @click="removeCondition(index)" class="delete-btn shrink-0" title="حذف">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                        </button>
                    </div>
                    <div class="p-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div v-if="!['day_of_week', 'time_range', 'date_range', 'required_item', 'forbidden_item', 'purchased_product_before', 'not_purchased_product_before'].includes(condition.condition_type)">
                            <label class="field-label">عملگر</label>
                            <select v-model="condition.operator" class="compact-input w-full" :class="{ 'ring-2 ring-rose-500': errorAt(`conditions.${index}.operator`) }">
                                <option :value="undefined">—</option>
                                <option value="=">مساوی</option>
                                <option value="!=">نامساوی</option>
                                <option value=">">بزرگتر</option>
                                <option value="<">کوچکتر</option>
                                <option value=">=">بزرگتر یا مساوی</option>
                                <option value="<=">کوچکتر یا مساوی</option>
                            </select>
                        </div>
                        <div v-if="!['day_of_week', 'time_range', 'date_range', 'required_item', 'forbidden_item', 'purchased_product_before', 'not_purchased_product_before'].includes(condition.condition_type)">
                            <label class="field-label">مقدار</label>
                            <input type="number" v-model.number="condition.value" placeholder="مقدار" class="compact-input w-full" :class="{ 'ring-2 ring-rose-500': errorAt(`conditions.${index}.value`) }" />
                        </div>
                        <div v-if="['required_item', 'forbidden_item', 'purchased_product_before', 'not_purchased_product_before'].includes(condition.condition_type)">
                            <label class="field-label">نوع آیتم</label>
                            <select v-model="condition.item_type" @change="clearConditionSearch(index)" class="compact-input w-full">
                                <option :value="undefined">—</option>
                                <option value="course">دوره</option>
                                <option value="path">مسیر</option>
                                <option value="vip">اشتراک</option>
                            </select>
                        </div>
                        <div v-if="['required_item', 'forbidden_item', 'purchased_product_before', 'not_purchased_product_before'].includes(condition.condition_type)" class="md:col-span-2">
                            <label class="field-label">جستجوی آیتم</label>
                            <div class="relative search-dropdown-container">
                                <input type="text" v-model="condition.search_query" @input="handleConditionSearch(index, $event)" placeholder="نام را جستجو کنید..." class="compact-input w-full" />
                                <div v-if="condition.searchResults?.length" class="search-dropdown">
                                    <div v-for="(result, ri) in condition.searchResults" :key="ri" @click="selectConditionSearchResult(index, result)" class="search-dropdown-item">
                                        <span class="truncate font-medium">{{ searchResultLabel(result) }}</span>
                                        <span class="text-[10px] text-gray-400 shrink-0">#{{ result.id }}</span>
                                    </div>
                                </div>
                                <div v-else-if="condition.search_query?.length >= 2 && !condition.target_id && !condition.searching && condition.searchResults?.length === 0" class="search-dropdown">
                                    <div class="px-3 py-2 text-xs text-gray-400 text-center">نتیجه‌ای یافت نشد</div>
                                </div>
                                <div v-if="condition.searching" class="absolute start-3 top-1/2 -translate-y-1/2">
                                    <div class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-yellow-400 border-t-transparent"></div>
                                </div>
                            </div>
                        </div>
                        <div v-if="condition.condition_type === 'time_range'">
                            <label class="field-label">شروع</label>
                            <input type="time" v-model="condition.extra.start" class="compact-input w-full" />
                        </div>
                        <div v-if="condition.condition_type === 'time_range'">
                            <label class="field-label">پایان</label>
                            <input type="time" v-model="condition.extra.end" class="compact-input w-full" />
                        </div>
                        <div v-if="condition.condition_type === 'date_range'">
                            <label class="field-label">تاریخ شروع</label>
                            <input type="date" v-model="condition.extra.start_date" class="compact-input w-full" />
                        </div>
                        <div v-if="condition.condition_type === 'date_range'">
                            <label class="field-label">تاریخ پایان</label>
                            <input type="date" v-model="condition.extra.end_date" class="compact-input w-full" />
                        </div>
                        <div v-if="condition.condition_type === 'day_of_week'" class="md:col-span-2">
                            <label class="field-label">روزهای هفته (0-6)</label>
                            <input type="text" v-model="condition.extra.days" placeholder="مثال: 0,5,6" class="compact-input w-full" />
                        </div>
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
                        <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">کد تخفیف</p>
                        <p class="text-2xl font-bold font-sans text-gray-900 dark:text-white tracking-wide" dir="ltr">{{ form.code || '—' }}</p>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ form.title || 'بدون عنوان' }}</p>
                    </div>
                    <div class="text-end">
                        <p class="text-[10px] font-semibold text-gray-400 mb-1">مقدار تخفیف</p>
                        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ getValueDisplay(form.type, form.value) }}</p>
                        <span class="inline-flex mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md" :class="form.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'">
                            {{ form.is_active ? 'فعال' : 'غیرفعال' }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border border-gray-200/80 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                <div class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-400 mb-2">محدودیت استفاده</p>
                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div><span class="text-gray-400">حداکثر کل: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ form.usage_limit || 'نامحدود' }}</span></div>
                        <div><span class="text-gray-400">هر کاربر: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ form.per_user_limit || 'نامحدود' }}</span></div>
                    </div>
                </div>
                <div class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-400 mb-2">بازه زمانی</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div><span class="text-gray-400">شروع: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ formatPersianDateTime(form.starts_at) }}</span></div>
                        <div><span class="text-gray-400">پایان: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ formatPersianDateTime(form.ends_at) }}</span></div>
                    </div>
                </div>
                <div class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-400 mb-2">رفتار تخفیف و پروموشن</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div><span class="text-gray-400">اعمال خودکار: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ form.apply_automatically ? 'بله — تخفیف مستقیم دوره' : 'خیر — فقط با کد' }}</span></div>
                        <div><span class="text-gray-400">ترکیب با تخفیف دوره: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ form.stackable ? 'قابل ترکیب' : 'بدون ترکیب (بزرگ‌تر)' }}</span></div>
                        <div><span class="text-gray-400">نمایش عمومی: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ form.is_public ? 'بله' : 'خیر' }}</span></div>
                        <div v-if="form.type === 'percent'"><span class="text-gray-400">سقف تخفیف: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ form.max_discount_amount ? Number(form.max_discount_amount).toLocaleString() + ' تومان' : 'بدون سقف' }}</span></div>
                    </div>
                </div>
                <div v-if="form.eligibilities?.length" class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-400 mb-2">قوانین دسترسی ({{ form.eligibilities.length }})</p>
                    <div class="space-y-1">
                        <div v-for="(eligibility, index) in form.eligibilities" :key="index" class="flex items-center justify-between gap-2 text-xs py-1">
                            <span class="font-medium text-gray-800 dark:text-gray-200">
                                {{ eligibility.type === 'inclusion' ? 'اجازه' : 'ممانعت' }} —
                                {{ eligibility.target_type === 'user' ? 'کاربر' : eligibility.target_type === 'course' ? 'دوره' : eligibility.target_type === 'path' ? 'مسیر' : eligibility.target_type === 'vip' ? 'اشتراک' : 'دسته‌بندی' }}
                            </span>
                            <span v-if="selectedTargetDisplay(eligibility) || eligibility.target_id" class="text-gray-400">{{ selectedTargetDisplay(eligibility) || ('#' + eligibility.target_id) }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="form.conditions?.length" class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-400 mb-2">شرایط سبد ({{ form.conditions.length }})</p>
                    <div class="space-y-1">
                        <div v-for="(condition, index) in form.conditions" :key="index" class="text-xs text-gray-700 dark:text-gray-300 py-0.5">
                            <span class="font-semibold">{{ getConditionTypeName(condition.condition_type) }}</span>
                            <template v-if="shouldShowOperator(condition.condition_type) && condition.operator"> {{ getOperatorName(condition.operator) }}</template>
                            <template v-if="getConditionDisplayValue(condition)"> — {{ getConditionDisplayValue(condition) }}</template>
                        </div>
                    </div>
                </div>
                <div v-if="!form.eligibilities?.length && !form.conditions?.length" class="px-4 py-3 text-xs text-gray-400">
                    بدون قانون دسترسی یا شرط سبد — برای همه قابل استفاده است.
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { discountFormHelpers, BANNER_ICON_OPTIONS } from "./discountFormMixin.js";

export default {
    name: "DiscountFormSections",
    mixins: [discountFormHelpers],
    inject: {
        discountFormRoot: { required: true },
    },
    props: {
        stepId: {
            type: String,
            default: "basic",
        },
    },
    computed: {
        form() {
            return this.discountFormRoot.form;
        },
        errors() {
            return this.discountFormRoot.errors;
        },
        bannerIconOptions() {
            return BANNER_ICON_OPTIONS;
        },
        typeOptions() {
            return [
                { value: "percent", label: "درصدی" },
                { value: "fixed", label: "مبلغ ثابت" },
                { value: "free", label: "رایگان" },
            ];
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
    overflow: visible;
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
.compact-input {
    display: block;
    width: 100%;
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
    border-radius: 0.625rem;
    outline: none;
    background: #f9fafb;
    color: #111827;
    border: 1px solid #e5e7eb;
    transition: box-shadow 0.15s, border-color 0.15s;
}
.compact-input:focus { box-shadow: 0 0 0 2px #facc15; border-color: transparent; }
.dark .compact-input { background: #1f2937; color: #fff; border-color: #374151; }
.field-label {
    display: block;
    font-size: 0.6875rem;
    font-weight: 600;
    color: #9ca3af;
    margin-bottom: 0.25rem;
}
.row-index {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.5rem;
    background: #f3f4f6;
    font-size: 0.6875rem;
    font-weight: 700;
    color: #6b7280;
}
.dark .row-index { background: #374151; color: #9ca3af; }
.delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    color: #9ca3af;
    transition: color 0.15s, background 0.15s;
}
.delete-btn:hover { color: #f43f5e; background: #fff1f2; }
.dark .delete-btn:hover { background: rgba(244, 63, 94, 0.1); }
.search-dropdown {
    position: absolute;
    z-index: 80;
    inset-inline-start: 0;
    inset-inline-end: 0;
    top: calc(100% + 0.25rem);
    width: 100%;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    max-height: 12rem;
    overflow-y: auto;
}
.dark .search-dropdown { background: #1f2937; border-color: #374151; }
.search-dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
}
.search-dropdown-item:last-child { border-bottom: none; }
.search-dropdown-item:hover { background: #f9fafb; }
.dark .search-dropdown-item:hover { background: #374151; }
.dark .search-dropdown-item { border-color: #374151; }
.summary-card {
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    padding: 1rem;
    background: #fafafa;
}
.dark .summary-card { background: rgba(31, 41, 55, 0.5); border-color: #374151; }
.summary-card-title {
    font-size: 0.8125rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.75rem;
}
.dark .summary-card-title { color: #e5e7eb; }
.summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.375rem 0;
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
.dark .summary-badge { background: rgba(251,191,36,0.15); color: #fbbf24; }
</style>
