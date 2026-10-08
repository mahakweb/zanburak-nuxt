<template>
    <div class="space-y-4">
        <!-- basic: title & excerpt -->
        <section v-show="stepId === 'basic'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">عنوان و خلاصه</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">عنوان فارسی، انگلیسی و خلاصه مقاله</p>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="field-label">عنوان مقاله <span class="text-rose-500">*</span></label>
                    <input v-model="articleFormRoot.form.title" type="text" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('title') }" />
                    <span v-if="errorAt('title')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('title')[0] }}</span>
                </div>
                <div>
                    <label class="field-label">عنوان انگلیسی (برای اسلاگ URL)</label>
                    <input
                        v-model="articleFormRoot.form.english_title"
                        type="text"
                        dir="ltr"
                        placeholder="e.g. core-web-vitals-guide"
                        class="form-input"
                        :class="{ 'ring-2 ring-rose-500': errorAt('english_title') }"
                        @input="articleFormRoot.filterInputEnglishTitle()"
                    />
                    <span v-if="errorAt('english_title')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('english_title')[0] }}</span>
                    <p class="text-[11px] text-gray-400 mt-1">این فیلد برای ساخت آدرس (slug) مقاله استفاده می‌شود.</p>
                </div>
                <div>
                    <label class="field-label">خلاصه مقاله</label>
                    <textarea v-model="articleFormRoot.form.excerpt" rows="4" maxlength="500" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('excerpt') }" />
                    <span v-if="errorAt('excerpt')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('excerpt')[0] }}</span>
                </div>
            </div>
        </section>

        <!-- classification: author, category, tags -->
        <section v-show="stepId === 'classification'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">دسته‌بندی و تگ‌ها</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">نویسنده، دسته و برچسب‌های مقاله</p>
            </div>
            <div class="grid gap-x-6 gap-y-4 grid-cols-1 md:grid-cols-2">
                <div v-if="canChangeAuthor" class="md:col-span-2">
                    <label class="field-label">نویسنده</label>
                    <input v-model="articleFormRoot.userSearch" type="text" placeholder="جستجوی کاربر (حداقل ۳ حرف)..." class="form-input" @input="articleFormRoot.searchUsers" />
                    <select v-model="articleFormRoot.form.user_id" class="form-input mt-2" :class="{ 'ring-2 ring-rose-500': errorAt('user_id') }">
                        <option v-if="selectedUser" :value="selectedUser.id">{{ selectedUser.first_name }} {{ selectedUser.last_name }} (@{{ selectedUser.username }})</option>
                        <option :value="null" disabled>انتخاب کاربر</option>
                        <option v-for="u in userResults" :key="u.id" :value="u.id">{{ u.first_name }} {{ u.last_name }} (@{{ u.username }})</option>
                    </select>
                    <span v-if="errorAt('user_id')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('user_id')[0] }}</span>
                </div>
                <div :class="canChangeAuthor ? 'md:col-span-2' : ''">
                    <label class="field-label">دسته‌بندی <span class="text-rose-500">*</span></label>
                    <select v-model="articleFormRoot.form.category_id" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('category_id') }">
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                    </select>
                    <span v-if="errorAt('category_id')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('category_id')[0] }}</span>
                </div>
                <div class="md:col-span-2">
                    <label class="field-label">تگ‌ها</label>
                    <vue3-tags-input
                        class="bg-gray-100 border border-gray-300 text-gray-900 text-sm border-none rounded-xl focus:outline-none focus-within:ring-yellow-500 block w-full p-1 dark:bg-gray-700 dark:placeholder-gray-400 focus-within:ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 dark:text-white"
                        :class="{ 'ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errorAt('tags') }"
                        placeholder=""
                        :limit="5"
                        :loading="true"
                        :tags="tags"
                        :duplicate-select-item="true"
                        @on-tags-changed="articleFormRoot.handleChangeTag"
                    />
                    <span v-if="errorAt('tags')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('tags')[0] }}</span>
                    <p class="text-[11px] text-gray-400 mt-1">تگ‌ها را وارد کنید و با اینتر یا فاصله جدا کنید</p>
                </div>
            </div>
        </section>

        <!-- publish settings -->
        <section v-show="stepId === 'publish'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">تنظیمات انتشار</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">وضعیت، زمان‌بندی و نمایش مقاله</p>
            </div>
            <div class="grid gap-x-6 gap-y-4 grid-cols-1 md:grid-cols-2">
                <div>
                    <label class="field-label">وضعیت</label>
                    <select v-model="articleFormRoot.form.status" class="form-input">
                        <option value="draft">پیش‌نویس</option>
                        <option value="pending">در انتظار</option>
                        <option value="published">منتشر شده</option>
                        <option v-if="isEdit" value="archived">بایگانی</option>
                    </select>
                </div>
                <div>
                    <label class="field-label">زمان‌بندی انتشار</label>
                    <input v-model="articleFormRoot.form.scheduled_at" type="datetime-local" class="form-input" />
                </div>
                <div>
                    <label class="field-label">مدت زمان مطالعه (دقیقه)</label>
                    <input
                        v-model.number="articleFormRoot.form.reading_time_minutes"
                        type="number"
                        min="1"
                        max="999"
                        placeholder="خودکار"
                        class="form-input"
                        :class="{ 'ring-2 ring-rose-500': errorAt('reading_time_minutes') }"
                    />
                    <span v-if="errorAt('reading_time_minutes')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('reading_time_minutes')[0] }}</span>
                    <p class="text-[11px] text-gray-400 mt-1">
                        خالی بگذارید تا از روی محتوا محاسبه شود
                        <template v-if="suggestedReadingTime"> (پیشنهاد: {{ suggestedReadingTime }} دقیقه)</template>
                    </p>
                </div>
                <div>
                    <label class="field-label">انتشار</label>
                    <ul class="h-10 grid w-full grid-cols-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700">
                        <li>
                            <input id="article-publish-0" v-model="articleFormRoot.publishRadio" type="radio" value="0" class="hidden peer" />
                            <label for="article-publish-0" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">پیش‌نویس</label>
                        </li>
                        <li>
                            <input id="article-publish-1" v-model="articleFormRoot.publishRadio" type="radio" value="1" class="hidden peer" />
                            <label for="article-publish-1" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">منتشر شده</label>
                        </li>
                    </ul>
                </div>
                <div class="flex items-end md:col-span-2">
                    <label class="flex items-center gap-2 h-10 text-sm font-semibold text-gray-700 dark:text-gray-200 cursor-pointer">
                        <input v-model="articleFormRoot.form.is_featured" type="checkbox" class="checkbox checkbox-warning checkbox-sm" />
                        مقاله ویژه
                    </label>
                </div>
            </div>
        </section>

        <!-- content: v-if so editor mounts with correct content on edit -->
        <section v-if="stepId === 'content'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">محتوای مقاله</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">متن کامل مقاله را با ویرایشگر بنویسید</p>
            </div>
            <EditorComponent
                :key="editorKey"
                v-model="articleFormRoot.form.content"
                :submitButton="false"
                :cancelButton="false"
                :errors="errors.content?.[0]"
                :enableFileUpload="true"
                :enableVideoUpload="true"
            />
        </section>

        <!-- media -->
        <section v-show="stepId === 'media'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">رسانه</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">تصویر کاور مقاله برای لیست و صفحه مقاله</p>
            </div>
            <AdminImageDropzone
                v-model="articleFormRoot.coverFile"
                :existing-url="form.cover_image"
                label="تصویر کاور"
                :hint="isEdit ? 'برای جایگزینی کاور، تصویر جدید انتخاب کنید.' : 'فرمت‌های JPG، PNG یا WebP — پس از ذخیره آپلود می‌شود.'"
                :uploading="coverUploading"
                :error="errors.cover_image?.[0]"
                @remove-existing="articleFormRoot.removeCover?.()"
            />
        </section>

        <!-- seo -->
        <section v-show="stepId === 'seo'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">تنظیمات SEO</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">متادیتای مقاله برای موتورهای جستجو</p>
            </div>
            <div class="grid gap-x-6 gap-y-4 grid-cols-1 md:grid-cols-2">
                <div>
                    <label class="field-label">عنوان SEO</label>
                    <input v-model="articleFormRoot.form.seo_title" type="text" maxlength="255" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('seo_title') }" />
                    <span v-if="errorAt('seo_title')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('seo_title')[0] }}</span>
                </div>
                <div>
                    <label class="field-label">کلمات کلیدی</label>
                    <input v-model="articleFormRoot.form.meta_keywords" type="text" class="form-input" />
                </div>
                <div class="md:col-span-2">
                    <label class="field-label">توضیحات SEO</label>
                    <textarea v-model="articleFormRoot.form.seo_description" rows="3" maxlength="500" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('seo_description') }" />
                    <span v-if="errorAt('seo_description')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('seo_description')[0] }}</span>
                </div>
                <div class="md:col-span-2">
                    <label class="field-label">Canonical URL</label>
                    <input v-model="articleFormRoot.form.canonical_url" type="url" dir="ltr" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('canonical_url') }" />
                    <span v-if="errorAt('canonical_url')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('canonical_url')[0] }}</span>
                </div>
                <div class="md:col-span-2">
                    <label class="field-label">OG Image URL</label>
                    <input v-model="articleFormRoot.form.og_image" type="url" dir="ltr" maxlength="500" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('og_image') }" />
                    <span v-if="errorAt('og_image')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('og_image')[0] }}</span>
                </div>
            </div>
        </section>

        <!-- confirm -->
        <section v-show="stepId === 'confirm'" class="admin-form-section">
            <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">تأیید و ثبت</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">یک بار دیگر اطلاعات را بررسی کنید</p>
            </div>

            <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900 p-5 mb-4">
                <div class="flex flex-wrap items-start justify-between gap-4">
                    <div class="min-w-0">
                        <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">عنوان مقاله</p>
                        <p class="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{{ form.title || '—' }}</p>
                        <p v-if="form.english_title" class="mt-1 text-sm text-gray-500 font-sans" dir="ltr">{{ form.english_title }}</p>
                    </div>
                    <div class="text-end">
                        <span class="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {{ articleFormRoot.getStatusLabel(form.status) }}
                        </span>
                        <p class="mt-2 text-xs text-gray-500">{{ publishRadio === '1' ? 'منتشر شده' : 'پیش‌نویس' }}</p>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border border-gray-200/80 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                <div class="px-4 py-3 grid grid-cols-2 gap-3">
                    <div><span class="text-gray-400">دسته‌بندی: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ articleFormRoot.getCategoryTitle(form.category_id) }}</span></div>
                    <div><span class="text-gray-400">نویسنده: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ articleFormRoot.getAuthorLabel() }}</span></div>
                    <div><span class="text-gray-400">زمان مطالعه: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ form.reading_time_minutes || suggestedReadingTime || 'خودکار' }} دقیقه</span></div>
                    <div><span class="text-gray-400">مقاله ویژه: </span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ form.is_featured ? 'بله' : 'خیر' }}</span></div>
                </div>
                <div v-if="form.excerpt" class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-400 mb-1">خلاصه</p>
                    <p class="text-gray-700 dark:text-gray-300 line-clamp-3">{{ form.excerpt }}</p>
                </div>
                <div v-if="tags.length" class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-400 mb-2">تگ‌ها</p>
                    <div class="flex flex-wrap gap-1">
                        <span v-for="tag in tags" :key="tag" class="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 font-medium">{{ tag }}</span>
                    </div>
                </div>
                <div class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-400 mb-1">محتوا</p>
                    <p class="font-semibold text-gray-800 dark:text-gray-200">
                        <template v-if="contentStats.hasContent">
                            ثبت شده — {{ contentStats.words.toLocaleString('fa-IR') }} کلمه، {{ contentStats.chars.toLocaleString('fa-IR') }} کاراکتر
                        </template>
                        <template v-else>محتوایی وارد نشده</template>
                    </p>
                </div>
                <div class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-400 mb-1">کاور</p>
                    <p class="font-semibold text-gray-800 dark:text-gray-200">{{ coverFile ? 'تصویر جدید انتخاب شده' : (form.cover_image ? 'کاور موجود' : 'بدون کاور') }}</p>
                </div>
                <div v-if="form.seo_title || form.seo_description" class="px-4 py-3">
                    <p class="text-[10px] font-bold text-gray-400 mb-2">SEO</p>
                    <p v-if="form.seo_title" class="text-gray-700 dark:text-gray-300"><span class="text-gray-400">عنوان: </span>{{ form.seo_title }}</p>
                    <p v-if="form.seo_description" class="text-gray-700 dark:text-gray-300 mt-1 line-clamp-2"><span class="text-gray-400">توضیحات: </span>{{ form.seo_description }}</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import AdminImageDropzone from "@/views/components/admin/AdminImageDropzone.vue";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import Vue3TagsInput from "vue3-tags-input";

export default {
    name: "ArticleFormSections",
    components: { AdminImageDropzone, EditorComponent, Vue3TagsInput },
    inject: { articleFormRoot: { default: null } },
    props: {
        stepId: { type: String, required: true },
    },
    computed: {
        form() { return this.articleFormRoot?.form || {}; },
        errors() { return this.articleFormRoot?.errors || {}; },
        tags() { return this.articleFormRoot?.tags || []; },
        categories() { return this.articleFormRoot?.categories || []; },
        userResults() { return this.articleFormRoot?.userResults || []; },
        selectedUser() { return this.articleFormRoot?.selectedUser || null; },
        publishRadio() { return this.articleFormRoot?.publishRadio || "0"; },
        coverUploading() { return this.articleFormRoot?.coverUploading || false; },
        coverFile() { return this.articleFormRoot?.coverFile || null; },
        canChangeAuthor() { return this.articleFormRoot?.canChangeAuthor; },
        suggestedReadingTime() { return this.articleFormRoot?.suggestedReadingTime; },
        isEdit() { return this.articleFormRoot?.isEdit; },
        editorKey() {
            const id = this.articleFormRoot?.articleId || "new";
            return `article-editor-${id}`;
        },
        contentStats() {
            return this.articleFormRoot?.getContentStats?.() || { chars: 0, words: 0, hasContent: false };
        },
    },
    methods: {
        errorAt(field) {
            return this.articleFormRoot?.errorAt(field);
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
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.75rem;
    outline: none;
    background: #f3f4f6;
    color: #111827;
    border: 1px solid transparent;
    transition: box-shadow 0.15s, border-color 0.15s;
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
</style>
