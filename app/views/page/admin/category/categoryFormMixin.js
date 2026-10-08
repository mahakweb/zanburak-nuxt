import axiosInstance from "@/store/axiosInstance";
import { createStepperMixin, BTN_SECONDARY } from "@/views/components/admin/adminFormStepperMixin.js";
import { showToastError } from "@/utils/toastConfig";

export const CATEGORY_FORM_STEPS = [
    { id: "basic", label: "اطلاعات پایه", hint: "عنوان، والد و وضعیت" },
    { id: "description", label: "توضیحات", hint: "معرفی دسته‌بندی" },
    { id: "media", label: "آیکون", hint: "تصویر دسته‌بندی" },
    { id: "assignment", label: "اختصاص دوره", hint: "دستی یا خودکار" },
    { id: "confirm", label: "تایید و ثبت", hint: "بررسی نهایی" },
];

export function createEmptyCategoryForm() {
    return {
        title: "",
        english_title: "",
        description: "",
        status: 1,
        tags: [],
        assignment_type: "manual",
        match_type: "any",
    };
}

const defaultFileValidationRules = {
    icon: {
        maxSize: 5 * 1024 * 1024,
        types: ["image/jpeg", "image/png", "image/webp"],
        extensions: [".jpg", ".jpeg", ".png", ".webp"],
        required: true,
        errorKey: "icon",
        label: "آیکون",
    },
};

export const categoryFormHelpers = {
    computed: {
        isEdit() {
            return !!(this.categorySlug || this.$route?.params?.categorySlug);
        },
        resolvedCategorySlug() {
            return this.categorySlug || this.$route?.params?.categorySlug || "";
        },
        parentTitle() {
            if (!this.parent?.length) return "بدون والد";
            return this.parent[0]?.title || "—";
        },
    },
    methods: {
        inputError(key) {
            return this.errors?.[key]
                ? "text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900"
                : "";
        },
        filterEnglish() {
            this.form.english_title = this.form.english_title.replace(/[^a-zA-Z0-9 _-]/g, "");
        },
        handleChangeTag(tags) {
            this.form.tags = tags;
        },
        addRule() {
            this.rules.push({ field: "", operator: "", value: "" });
        },
        removeRule(index) {
            this.rules.splice(index, 1);
        },
        getMediaRef() {
            return this.$refs.categoryFormSections?.$refs.icon || this.$refs.icon;
        },
        handleIcon(e) {
            const file = e?.target?.files?.[0] || e?.dataTransfer?.files?.[0];
            if (!file) return;
            if (!this.validateFile(file, "icon")) {
                this.icon = null;
                return;
            }
            this.icon = file;
            this.uploadStatus.icon = "pending";
            this.iconPreview = {
                name: file.name,
                size: this.formatFileSize(file.size),
                url: URL.createObjectURL(file),
            };
        },
        removeIcon() {
            this.cancelUpload("icon");
            this.uploadStatus.icon = "idle";
            this.icon = null;
            const ref = this.getMediaRef();
            if (ref) ref.value = null;
            this.iconPreview = { name: "", size: "", url: "" };
        },
        formatFileSize(bytes, decimal = 1, lang = "en") {
            const units = {
                fa: ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"],
                en: ["B", "KB", "MB", "GB"],
            };
            const selectedUnits = units[lang] || units.en;
            if (bytes < 1024) return `${bytes} ${selectedUnits[0]}`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(decimal)} ${selectedUnits[1]}`;
            if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(decimal)} ${selectedUnits[2]}`;
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(decimal)} ${selectedUnits[3]}`;
        },
        validateFile(file, type) {
            const rules = this.fileValidationRules[type];
            if (!this.errors) this.errors = {};
            if (rules.required) {
                const hasNewFile = !!file;
                const hasOldFile = this.isEdit && !!this.oldIcon;
                if (!hasNewFile && !hasOldFile) {
                    this.errors[type] = [`فیلد ${rules.label} الزامی است.`];
                    return false;
                }
            }
            if (!file) {
                this.errors[type] = null;
                return true;
            }
            const ext = file?.name?.split(".").pop()?.toLowerCase() || "";
            const isValidExt = rules.extensions.some((e) => e.replace(".", "") === ext || e === `.${ext}`);
            const isValidType = file.type && rules.types.includes(file.type);
            if (!isValidExt && !isValidType) {
                this.errors[type] = ["فرمت فایل مجاز نیست"];
                return false;
            }
            if (file.size > rules.maxSize) {
                this.errors[type] = [
                    `حجم ${rules.label} نباید بیشتر از ${this.formatFileSize(rules.maxSize, 0, "fa")} باشد`,
                ];
                return false;
            }
            this.errors[type] = null;
            return true;
        },
        async uploadFile(categoryId, fileType) {
            const file = this[fileType];
            if (!file) return;
            if (this.controllers[fileType]) this.controllers[fileType].abort();
            const controller = new AbortController();
            this.controllers[fileType] = controller;
            const formData = new FormData();
            formData.append("category_id", categoryId);
            this.uploadStatus[fileType] = "uploading";
            if (fileType === "icon") formData.append("icon", file);
            try {
                await axiosInstance.post("admin/category/uploadIcon", formData, {
                    timeout: 600 * 1000,
                    headers: { "Content-Type": "multipart/form-data" },
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
                            total,
                            speed: `${this.formatFileSize(speed)}/s`,
                            lastTime: now,
                            lastUploaded: loaded,
                        };
                    },
                });
                this.progress[fileType].completed = true;
                this.uploadStatus[fileType] = "uploaded";
            } catch (error) {
                if (controller.signal.aborted) {
                    this.uploadStatus[fileType] = "pending";
                } else {
                    this.uploadStatus[fileType] = "error";
                    console.error(`${fileType} upload failed:`, error);
                }
            } finally {
                this.controllers[fileType] = null;
            }
        },
        cancelUpload(fileType) {
            if (this.controllers[fileType]) {
                this.controllers[fileType].abort();
                this.controllers[fileType] = null;
                this.progress[fileType] = { percent: 0, uploaded: 0, total: 0, speed: "", completed: false };
                this.uploadStatus[fileType] = "pending";
            }
        },
        buildPayload() {
            return {
                title: this.form.title,
                english_title: this.form.english_title,
                parent_id: this.parent?.length ? this.parent[0].id : null,
                description: this.form.description,
                status: this.form.status,
                tags: this.form.tags,
                assignment_type: this.form.assignment_type,
                match_type: this.form.match_type,
                rules: this.rules,
            };
        },
        validateFormStep(stepIndex) {
            const stepId = CATEGORY_FORM_STEPS[stepIndex]?.id;
            if (stepId === "basic") {
                if (!this.form.title?.trim()) {
                    showToastError("عنوان فارسی الزامی است.");
                    return false;
                }
                if (!this.form.english_title?.trim()) {
                    showToastError("عنوان انگلیسی الزامی است.");
                    return false;
                }
            }
            if (stepId === "media" && !this.isEdit) {
                if (!this.validateFile(this.icon, "icon")) return false;
            }
            return true;
        },
        mapErrorsToStep() {
            if (!this.errors) return 0;
            const stepMap = {
                title: 0,
                english_title: 0,
                parent_id: 0,
                tags: 0,
                status: 0,
                description: 1,
                icon: 2,
                assignment_type: 3,
                match_type: 3,
                rules: 3,
            };
            for (const key of Object.keys(this.errors)) {
                const base = key.split(".")[0];
                if (base in stepMap) return stepMap[base];
                if (key.startsWith("rules.")) return 3;
            }
            return 0;
        },
        resetForm() {
            this.form = createEmptyCategoryForm();
            this.parent = [];
            this.rules = [{ field: "", operator: "", value: "" }];
            this.matchedCoursesPreview = [];
            this.removeIcon();
            this.oldIcon = null;
            this.category_id = null;
            this.errors = {};
            this.currentStep = 0;
        },
        async getInitData() {
            try {
                const response = await axiosInstance.post("admin/course/layouts/getInitData");
                this.categories = response.data.categories || [];
                if (!this.isEdit) {
                    const parentSlug = this.$route.query.parent;
                    if (parentSlug) {
                        const found = this.categories.find((cat) => cat.slug === parentSlug);
                        if (found) this.parent = [found];
                    }
                }
            } catch (error) {
                console.error(error?.response?.data?.errors || error);
            }
        },
        async getCategory() {
            if (!this.resolvedCategorySlug) return;
            this.pageLoading = true;
            try {
                const response = await axiosInstance.post("admin/category/edit", { slug: this.resolvedCategorySlug });
                const c = response.data.category;
                this.category_id = c.id;
                this.form.title = c.title || "";
                this.form.english_title = c.english_title || "";
                this.form.description = c.description || "";
                this.form.status = c.status ? 1 : 0;
                this.form.tags = c.tags || [];
                this.parent = c.parent ? [c.parent] : [];
                this.oldIcon = c.icon;
                this.form.assignment_type = c.assignment_type || "manual";
                this.form.match_type = c.match_type || "any";
                this.rules = Array.isArray(c.rules) && c.rules.length
                    ? c.rules
                    : [{ field: "", operator: "", value: "" }];
                this.matchedCoursesPreview = c.matched_courses || [];
                if (this.form.assignment_type === "automatic" && this.matchedCoursesPreview.length === 0) {
                    this.scheduleMatchedCoursesPreview();
                }
            } catch (error) {
                console.error(error);
                showToastError("خطا در بارگذاری دسته‌بندی.");
            } finally {
                this.pageLoading = false;
            }
        },
        getAssignmentTypeLabel() {
            return this.form.assignment_type === "automatic" ? "خودکار" : "دستی";
        },
        getStatusLabel() {
            return Number(this.form.status) === 1 ? "فعال" : "غیرفعال";
        },
        getIconStatusLabel() {
            if (this.icon) return "آماده آپلود";
            if (this.oldIcon) return "آیکون موجود";
            return "بدون آیکون";
        },
        isRuleComplete(rule) {
            return !!(rule?.field && rule?.operator && String(rule?.value ?? "").trim() !== "");
        },
        scheduleMatchedCoursesPreview() {
            if (this._previewTimer) clearTimeout(this._previewTimer);
            if (this.form.assignment_type !== "automatic") {
                this.matchedCoursesPreview = [];
                return;
            }
            const completeRules = (this.rules || []).filter((r) => this.isRuleComplete(r));
            if (!completeRules.length) {
                this.matchedCoursesPreview = [];
                return;
            }
            this._previewTimer = setTimeout(() => this.previewMatchedCourses(), 600);
        },
        async previewMatchedCourses() {
            const completeRules = (this.rules || []).filter((r) => this.isRuleComplete(r));
            if (!completeRules.length) {
                this.matchedCoursesPreview = [];
                return;
            }
            this.previewLoading = true;
            try {
                const response = await axiosInstance.post("admin/category/preview-courses", {
                    match_type: this.form.match_type,
                    rules: completeRules,
                });
                this.matchedCoursesPreview = response.data.courses || [];
            } catch (error) {
                console.error(error);
                this.matchedCoursesPreview = [];
            } finally {
                this.previewLoading = false;
            }
        },
        coursesListRoute(categorySlug) {
            return {
                name: "admin-courses-list",
                query: categorySlug ? { category: categorySlug } : {},
            };
        },
    },
};

export const categoryFormMixin = {
    mixins: [createStepperMixin("CATEGORY_FORM_STEPS"), categoryFormHelpers],
    props: {
        categorySlug: { type: String, default: "" },
    },
    data() {
        return {
            CATEGORY_FORM_STEPS,
            BTN_SECONDARY,
            form: createEmptyCategoryForm(),
            errors: {},
            submitLoading: false,
            pageLoading: false,
            category_id: null,
            parent: [],
            categories: [],
            rules: [{ field: "", operator: "", value: "" }],
            matchedCoursesPreview: [],
            previewLoading: false,
            icon: null,
            oldIcon: null,
            iconPreview: { name: "", size: "", url: "" },
            controllers: { icon: null },
            uploadStatus: { icon: "idle" },
            progress: {
                icon: { percent: 0, uploaded: 0, total: 0, speed: "", completed: false },
            },
            fileValidationRules: defaultFileValidationRules,
        };
    },
    provide() {
        return { categoryFormRoot: this };
    },
};
