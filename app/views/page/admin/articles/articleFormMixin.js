import debounce from "lodash/debounce";
import axiosInstance from "@/store/axiosInstance";
import { createStepperMixin, BTN_SECONDARY } from "@/views/components/admin/adminFormStepperMixin.js";
import { showToastError } from "@/utils/toastConfig";
import {
    validateArticleForm,
    filterEnglishTitle,
    calculateArticleReadingTime,
} from "@/utils/validateArticleForm";

export const ARTICLE_FORM_STEPS = [
    { id: "basic", label: "عنوان و خلاصه", hint: "عنوان مقاله" },
    { id: "classification", label: "دسته‌بندی", hint: "نویسنده و تگ‌ها" },
    { id: "publish", label: "انتشار", hint: "وضعیت و زمان" },
    { id: "content", label: "محتوا", hint: "متن مقاله" },
    { id: "media", label: "رسانه", hint: "تصویر کاور" },
    { id: "seo", label: "SEO", hint: "متادیتا" },
    { id: "confirm", label: "تأیید", hint: "بازبینی نهایی" },
];

export function createEmptyArticleForm() {
    return {
        user_id: null,
        category_id: null,
        title: "",
        english_title: "",
        excerpt: "",
        content: "",
        cover_image: null,
        status: "draft",
        publish: false,
        is_featured: false,
        seo_title: "",
        seo_description: "",
        meta_keywords: "",
        canonical_url: "",
        og_image: "",
        scheduled_at: null,
        reading_time_minutes: null,
    };
}

const STEP_FIELD_MAP = {
    title: 0,
    english_title: 0,
    excerpt: 0,
    category_id: 1,
    user_id: 1,
    tags: 1,
    status: 2,
    reading_time_minutes: 2,
    content: 3,
    cover_image: 4,
    seo_title: 5,
    seo_description: 5,
    meta_keywords: 5,
    canonical_url: 5,
    og_image: 5,
};

export const articleFormHelpers = {
    computed: {
        canChangeAuthor() {
            return this.$can("articles.update.any");
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
        suggestedReadingTime() {
            return calculateArticleReadingTime(this.form.content);
        },
        isEdit() {
            return !!this.articleId;
        },
    },
    methods: {
        errorAt(field) {
            if (!this.errors?.[field]) return false;
            return this.errors[field];
        },
        fieldClass(field) {
            return [
                this.baseInputClass,
                this.errors[field]
                    ? "text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900"
                    : "",
            ];
        },
        filterInputEnglishTitle() {
            this.form.english_title = filterEnglishTitle(this.form.english_title);
        },
        handleChangeTag(tags) {
            this.tags = tags;
            if (this.errors.tags) delete this.errors.tags;
        },
        setDefaultAuthor() {
            if (!this.canChangeAuthor && this.currentUser?.id) {
                this.form.user_id = this.currentUser.id;
            }
        },
        async fetchCategories() {
            const res = await axiosInstance.post("/admin/article-categories");
            this.categories = res.data.categories || [];
            if (!this.isEdit && this.categories.length && !this.form.category_id) {
                this.form.category_id = this.categories[0].id;
            }
        },
        getStatusLabel(status) {
            const labels = {
                draft: "پیش‌نویس",
                pending: "در انتظار",
                published: "منتشر شده",
                archived: "بایگانی",
            };
            return labels[status] || status;
        },
        getCategoryTitle(id) {
            return this.categories.find((c) => c.id === id)?.title || "—";
        },
        getAuthorLabel() {
            const user = this.selectedUser
                || this.userResults.find((u) => u.id === this.form.user_id)
                || (this.currentUser?.id === this.form.user_id ? this.currentUser : null);
            if (!user) return "—";
            return `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "—";
        },
        getContentStats() {
            const plain = (this.form.content || "")
                .replace(/```[\s\S]*?```/g, "")
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim();
            const chars = plain.length;
            const words = plain ? plain.split(" ").filter(Boolean).length : 0;
            return { chars, words, hasContent: chars > 0 };
        },
        normalizeReadingTime(value) {
            if (value === null || value === "" || value === undefined) return null;
            const minutes = Number(value);
            return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
        },
        buildPayload() {
            const readingTime = this.normalizeReadingTime(this.form.reading_time_minutes);
            if (!this.isEdit) {
                const payload = {
                    ...this.form,
                    publish: this.publishRadio === "1",
                    tags: this.tags,
                    reading_time_minutes: readingTime,
                };
                delete payload.cover_image;
                return payload;
            }
            const payload = {
                category_id: this.form.category_id,
                title: this.form.title,
                english_title: this.form.english_title,
                excerpt: this.form.excerpt,
                content: this.form.content,
                status: this.form.status,
                publish: this.publishRadio === "1",
                is_featured: this.form.is_featured,
                seo_title: this.form.seo_title,
                seo_description: this.form.seo_description,
                meta_keywords: this.form.meta_keywords,
                canonical_url: this.form.canonical_url,
                og_image: this.form.og_image,
                scheduled_at: this.form.scheduled_at,
                reading_time_minutes: readingTime,
                tags: this.tags,
            };
            if (this.canChangeAuthor) {
                payload.user_id = this.form.user_id;
            }
            if (!this.coverFile) {
                payload.cover_image = this.form.cover_image;
            }
            return payload;
        },
        runClientValidation() {
            const validationForm = {
                ...this.form,
                user_id: this.canChangeAuthor ? this.form.user_id : (this.form.user_id || this.currentUser?.id),
            };
            this.errors = validateArticleForm(validationForm, {
                tags: this.tags,
                coverFile: this.coverFile,
                requireCover: false,
            });
            return Object.keys(this.errors).length === 0;
        },
        validateFormStep(stepIndex) {
            const stepId = ARTICLE_FORM_STEPS[stepIndex]?.id;
            if (stepId === "basic") {
                if (!(this.form.title || "").trim()) {
                    showToastError("عنوان مقاله الزامی است.");
                    return false;
                }
            }
            if (stepId === "classification") {
                if (!this.form.category_id) {
                    showToastError("دسته‌بندی را انتخاب کنید.");
                    return false;
                }
                this.setDefaultAuthor();
                if (!this.form.user_id && !this.canChangeAuthor) {
                    showToastError("نویسنده مقاله مشخص نشده است.");
                    return false;
                }
            }
            if (stepId === "content") {
                const plain = (this.form.content || "").replace(/<[^>]*>/g, "").trim();
                if (plain.length < 50) {
                    showToastError("محتوای مقاله باید حداقل ۵۰ کاراکتر باشد.");
                    return false;
                }
            }
            return true;
        },
        mapErrorsToStep() {
            if (!this.errors) return 0;
            for (const key of Object.keys(this.errors)) {
                const base = key.split(".")[0];
                if (base in STEP_FIELD_MAP) return STEP_FIELD_MAP[base];
            }
            return 0;
        },
        resetForm() {
            this.form = createEmptyArticleForm();
            this.tags = [];
            this.coverFile = null;
            this.publishRadio = "0";
            this.errors = {};
            this.userSearch = "";
            this.userResults = [];
            this.currentStep = 0;
            this.setDefaultAuthor();
            if (this.categories.length) this.form.category_id = this.categories[0].id;
        },
        searchUsers: debounce(async function () {
            const key = this.userSearch.trim();
            if (key.length < 3) {
                this.userResults = [];
                return;
            }
            try {
                const res = await axiosInstance.post("/admin/searchUser", { key, limit: 20 });
                this.userResults = res.data.result || [];
            } catch {
                this.userResults = [];
            }
        }, 400),
    },
};

export const articleFormMixin = {
    mixins: [createStepperMixin("ARTICLE_FORM_STEPS"), articleFormHelpers],
    data() {
        return {
            ARTICLE_FORM_STEPS,
            BTN_SECONDARY,
            articleId: null,
            categories: [],
            userResults: [],
            selectedUser: null,
            userSearch: "",
            tags: [],
            coverFile: null,
            coverUploading: false,
            pageLoading: false,
            submitLoading: false,
            errors: {},
            publishRadio: "0",
            baseInputClass:
                "bg-gray-100 text-gray-900 text-sm rounded-xl outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white border border-transparent",
            form: createEmptyArticleForm(),
        };
    },
    provide() {
        return { articleFormRoot: this };
    },
};
