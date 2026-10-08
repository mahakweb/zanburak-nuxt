import axiosInstance from "@/store/axiosInstance";
import { createStepperMixin, BTN_SECONDARY } from "@/views/components/admin/adminFormStepperMixin.js";
import { showToastError } from "@/utils/toastConfig";
import { toast } from "vue3-toastify";

export const PATH_FORM_STEPS = [
    { id: "basic", label: "اطلاعات پایه", hint: "عنوان و وضعیت" },
    { id: "description", label: "توضیحات", hint: "متن و SEO" },
    { id: "courses", label: "دوره‌ها", hint: "اختصاص دستی یا خودکار" },
    { id: "relations", label: "ارتباطات", hint: "پیش‌نیاز و قدم بعدی" },
    { id: "media", label: "رسانه", hint: "آیکون، پوستر و تریلر" },
    { id: "faqs", label: "سوالات", hint: "سوالات متداول" },
    { id: "confirm", label: "تایید و ثبت", hint: "بررسی نهایی" },
];

export function createEmptyPathForm() {
    return {
        title: "",
        english_title: "",
        short_description: "",
        description: "",
        meta_keywords: "",
        icon: "",
        poster: "",
        status: true,
        allows_installment: false,
        assignment_type: "manual",
        match_type: "any",
        faqs: [],
    };
}

export const pathFormHelpers = {
    computed: {
        isEdit() {
            return !!(this.pathSlug || this.$route?.params?.pathSlug);
        },
        resolvedPathSlug() {
            return this.pathSlug || this.$route?.params?.pathSlug || "";
        },
        metaKeywordsCount() {
            if (!this.form.meta_keywords) return 0;
            return this.form.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean).length;
        },
        searchInputClass() {
            return [
                "h-10 bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white",
            ];
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
        addRule() {
            this.rules.push({ field: "title", operator: "contains", value: "" });
        },
        removeRule(i) {
            this.rules.splice(i, 1);
        },
        addFaq() {
            this.form.faqs.push({ question: "", answer: "" });
        },
        removeFaq(i) {
            this.form.faqs.splice(i, 1);
        },
        getOldFileValue(type) {
            switch (type) {
                case "poster": return this.oldPoster;
                case "icon": return this.oldIcon;
                case "trailer": return this.oldTrailer;
                default: return null;
            }
        },
        validateFile(file, type) {
            const rules = this.fileValidationRules[type];
            if (!this.errors) this.errors = {};
            if (rules.required) {
                const hasNewFile = !!file;
                const hasOldFile = this.isEdit && !!this.getOldFileValue(type);
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
        formatDuration(seconds) {
            if (!seconds) return "0:00";
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
            return `${m}:${s.toString().padStart(2, "0")}`;
        },
        getMediaRef(type) {
            return this.$refs.pathFormSections?.$refs[type] || this.$refs[type];
        },
        handleFile(type, e) {
            const file = e?.target?.files?.[0] || e?.dataTransfer?.files?.[0] || this.getMediaRef(type)?.files?.[0];
            if (!file) return;
            if (!this.validateFile(file, type)) {
                if (type === "icon") this.icon = null;
                else if (type === "poster") this.poster = null;
                else if (type === "trailer") this.trailer = null;
                return;
            }
            if (type === "icon") this.icon = file;
            else if (type === "poster") this.poster = file;
            else if (type === "trailer") this.trailer = file;
            const previewObj = type === "icon" ? "iconPreview" : "posterPreview";
            if (type === "trailer") {
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
                    const duration = this.formatDuration(Math.floor(video.duration));
                    this.trailerPreview = { name: file.name, size: file.size, duration, thumbnail };
                    URL.revokeObjectURL(url);
                });
            } else {
                this[previewObj] = { name: file.name, size: this.formatFileSize(file.size), url: URL.createObjectURL(file) };
            }
            this.uploadStatus[type] = "pending";
        },
        async uploadFile(pathId, fileType) {
            const file = this[fileType];
            if (!file) return;
            if (!this.validateFile(file, fileType)) {
                this.uploadStatus[fileType] = "error";
                return;
            }
            if (this.controllers[fileType]) this.controllers[fileType].abort();
            const controller = new AbortController();
            this.controllers[fileType] = controller;
            this.uploadStatus[fileType] = "uploading";
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
                        total,
                        speed: `${this.formatFileSize(speed)}/s`,
                        lastTime: now,
                        lastUploaded: loaded,
                    };
                };

                // Poster + icon: upload + WebP once on main API (no worker)
                if (fileType === "poster" || fileType === "icon") {
                    const formData = new FormData();
                    formData.append("path_id", pathId);
                    formData.append("file", file);
                    const endpoint = fileType === "poster" ? "/admin/path/uploadPoster" : "/admin/path/uploadIcon";
                    await axiosInstance.post(endpoint, formData, {
                        timeout: 3600 * 1000,
                        headers: { "Content-Type": "multipart/form-data" },
                        signal: controller.signal,
                        onUploadProgress: trackProgress,
                    });
                    this.progress[fileType].completed = true;
                    this.uploadStatus[fileType] = "uploaded";
                    toast.success(fileType === "poster" ? "پوستر با موفقیت آپلود شد." : "آیکون با موفقیت آپلود شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") === "rtl",
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    });
                    return;
                }

                let initUrl = "";
                const initBody = { filename: file.name, mime: file.type, size: file.size, path_id: pathId };
                if (fileType === "trailer") {
                    initUrl = "/admin/path/uploadTrailer";
                    initBody.process = false;
                } else {
                    return;
                }
                const initRes = await axiosInstance.post(initUrl, initBody);
                const { uploadPath, uploadToken, workerUploadUrl } = initRes.data;
                const formData = new FormData();
                formData.append("path", uploadPath);
                formData.append("file", file);
                await axiosInstance.post(workerUploadUrl, formData, {
                    timeout: 3600 * 1000,
                    headers: { Authorization: `Bearer ${uploadToken}` },
                    signal: controller.signal,
                    onUploadProgress: trackProgress,
                });
                this.progress[fileType].completed = true;
                this.uploadStatus[fileType] = "uploaded";
                const labels = { trailer: "تریلر", icon: "آیکون" };
                toast.success(`${labels[fileType]} با موفقیت آپلود شد.`, {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") === "rtl",
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                });
            } catch (e) {
                if (controller.signal.aborted) {
                    this.uploadStatus[fileType] = "pending";
                } else {
                    this.uploadStatus[fileType] = "error";
                    console.error("upload failed", fileType, e);
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
        removeLocal(type) {
            this.cancelUpload(type);
            if (type === "icon") {
                this.icon = null;
                this.iconPreview = { name: "", size: "", url: "" };
            }
            if (type === "poster") {
                this.poster = null;
                this.posterPreview = { name: "", size: "", url: "" };
            }
            if (type === "trailer") {
                this.trailer = null;
                this.trailerPreview = { name: "", size: 0, duration: "", thumbnail: "" };
            }
            this.uploadStatus[type] = "idle";
        },
        async removeFile(fileType) {
            try {
                await axiosInstance.post("/admin/path/removeFile", {
                    path_id: this.path_id,
                    file_type: fileType,
                });
                if (fileType === "trailer") {
                    this.oldTrailer = "";
                    this.uploadStatus.trailer = "idle";
                    this.trailer = null;
                    const trailerRef = this.getMediaRef("trailer");
                    if (trailerRef) trailerRef.value = null;
                    this.trailerPreview = { name: "", duration: "", size: "", thumbnail: "" };
                } else if (fileType === "poster") {
                    this.oldPoster = "";
                    this.uploadStatus.poster = "idle";
                    this.poster = null;
                    const posterRef = this.getMediaRef("poster");
                    if (posterRef) posterRef.value = null;
                    this.posterPreview = { name: "", size: "", url: "" };
                } else if (fileType === "icon") {
                    this.oldIcon = "";
                    this.uploadStatus.icon = "idle";
                    this.icon = null;
                    const iconRef = this.getMediaRef("icon");
                    if (iconRef) iconRef.value = null;
                    this.iconPreview = { name: "", size: "", url: "" };
                }
                toast.success("فایل با موفقیت از سرور حذف شد", {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") === "rtl",
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                });
            } catch (e) {
                console.error(e);
                toast.error("حذف فایل با خطا مواجه شد", {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") === "rtl",
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                });
            }
        },
        buildPayload() {
            const payload = {
                title: this.form.title,
                english_title: this.form.english_title,
                short_description: this.form.short_description,
                description: this.form.description,
                meta_keywords: this.form.meta_keywords || null,
                faqs: this.form.faqs,
                status: this.form.status,
                allows_installment: this.form.allows_installment,
                assignment_type: this.form.assignment_type,
                match_type: this.form.assignment_type === "automatic" ? this.form.match_type : undefined,
                rules: this.form.assignment_type === "automatic" ? this.rules : undefined,
                courses: this.form.assignment_type === "manual"
                    ? (this.selectedCourses || []).map((c) => c.id || c)
                    : undefined,
                prerequisites: (this.selectedPrerequisites || []).map((p) => p.id || p),
                corequisites: (this.selectedCorequisites || []).map((p) => p.id || p),
                next_steps: (this.selectedNextSteps || []).map((n) => n.id || n),
            };
            if (this.isEdit) {
                if (this.icon) payload.icon = "uploaded";
                if (this.poster) payload.poster = "uploaded";
                if (this.trailer) payload.trailer = "uploaded";
            } else {
                payload.icon = this.icon ? "uploaded" : null;
                payload.poster = this.poster ? "uploaded" : null;
            }
            Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
            return payload;
        },
        validateFormStep(stepIndex) {
            const stepId = PATH_FORM_STEPS[stepIndex]?.id;
            if (stepId === "basic") {
                if (!this.form.title?.trim()) {
                    showToastError("عنوان فارسی الزامی است.");
                    return false;
                }
            }
            if (stepId === "courses") {
                if (this.form.assignment_type === "manual" && !(this.selectedCourses || []).length) {
                    showToastError("حداقل یک دوره انتخاب کنید.");
                    return false;
                }
            }
            if (stepId === "media" && !this.isEdit) {
                const iconValid = this.validateFile(this.icon, "icon");
                const posterValid = this.validateFile(this.poster, "poster");
                if (!iconValid || !posterValid) return false;
            }
            return true;
        },
        mapErrorsToStep() {
            if (!this.errors) return 0;
            const stepMap = {
                title: 0, english_title: 0, status: 0, short_description: 0,
                description: 1, meta_keywords: 1,
                courses: 2, assignment_type: 2, rules: 2, match_type: 2,
                prerequisites: 3, corequisites: 3, next_steps: 3,
                icon: 4, poster: 4, trailer: 4,
                faqs: 5,
            };
            for (const key of Object.keys(this.errors)) {
                const base = key.split(".")[0];
                if (base in stepMap) return stepMap[base];
            }
            return 0;
        },
        resetForm() {
            this.form = createEmptyPathForm();
            this.rules = [{ field: "title", operator: "contains", value: "" }];
            this.selectedCourses = [];
            this.selectedPrerequisites = [];
            this.selectedCorequisites = [];
            this.selectedNextSteps = [];
            this.poster = null;
            this.icon = null;
            this.trailer = null;
            this.posterPreview = { name: "", size: "", url: "" };
            this.iconPreview = { name: "", size: "", url: "" };
            this.trailerPreview = { name: "", size: 0, duration: "", thumbnail: "" };
            this.uploadStatus = { poster: "idle", icon: "idle", trailer: "idle" };
            this.progress = {
                poster: { percent: 0, uploaded: 0, total: 0, speed: "", completed: false },
                icon: { percent: 0, uploaded: 0, total: 0, speed: "", completed: false },
                trailer: { percent: 0, uploaded: 0, total: 0, speed: "", completed: false },
            };
            this.controllers = { poster: null, icon: null, trailer: null };
            this.path_id = null;
            this.oldIcon = "";
            this.oldPoster = "";
            this.oldTrailer = "";
            this.errors = {};
            this.currentStep = 0;
        },
        async getPath() {
            if (!this.resolvedPathSlug) return;
            this.pageLoading = true;
            try {
                const res = await axiosInstance.get(`/admin/path/${this.resolvedPathSlug}/edit`);
                const p = res.data?.path || {};
                this.path_id = p.id || null;
                this.form.title = p.title || "";
                this.form.english_title = p.english_title || "";
                this.form.short_description = p.short_description || "";
                this.form.description = p.description || "";
                this.form.meta_keywords = p.meta_keywords || "";
                this.form.status = typeof p.status === "boolean" ? p.status : !!p.status;
                this.form.allows_installment = Boolean(p.allows_installment);
                this.form.faqs = Array.isArray(p.faqs) ? p.faqs : [];
                this.form.assignment_type = p.assignment_type || "manual";
                this.form.match_type = p.match_type || "any";
                this.rules = Array.isArray(p.rules) && p.rules.length ? p.rules : [{ field: "title", operator: "contains", value: "" }];
                this.selectedCourses = Array.isArray(p.courses) ? p.courses : [];
                this.selectedPrerequisites = Array.isArray(p.prerequisites) ? p.prerequisites : [];
                this.selectedCorequisites = Array.isArray(p.corequisites) ? p.corequisites : [];
                this.selectedNextSteps = Array.isArray(p.next_steps) ? p.next_steps : [];
                this.oldIcon = p.icon || "";
                this.oldPoster = p.poster || "";
                this.oldTrailer = p.trailer || "";
                if (this.oldTrailer) this.uploadStatus.trailer = "uploaded";
            } catch (e) {
                console.error(e);
                showToastError("خطا در بارگذاری مسیر.");
            } finally {
                this.pageLoading = false;
            }
        },
        getAssignmentTypeLabel() {
            return this.form.assignment_type === "automatic" ? "خودکار" : "دستی";
        },
        getStatusLabel() {
            return this.form.status ? "فعال" : "غیرفعال";
        },
    },
};

const defaultFileValidationRules = {
    poster: {
        maxSize: 5 * 1024 * 1024,
        types: ["image/jpeg", "image/png", "image/webp"],
        extensions: [".jpg", ".jpeg", ".png", ".webp"],
        required: true,
        errorKey: "poster",
        label: "پوستر",
    },
    icon: {
        maxSize: 5 * 1024 * 1024,
        types: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
        extensions: [".jpg", ".jpeg", ".png", ".webp", ".svg"],
        required: true,
        errorKey: "icon",
        label: "آیکون",
    },
    trailer: {
        maxSize: 100 * 1024 * 1024,
        types: ["video/mp4", "video/x-matroska", "video/webm", "video/ogg"],
        extensions: [".mp4", ".mkv", ".webm", ".ogg"],
        required: false,
        errorKey: "trailer",
        label: "تریلر",
    },
};

export const pathFormMixin = {
    mixins: [createStepperMixin("PATH_FORM_STEPS"), pathFormHelpers],
    props: {
        pathSlug: { type: String, default: "" },
    },
    data() {
        return {
            PATH_FORM_STEPS,
            BTN_SECONDARY,
            form: createEmptyPathForm(),
            errors: {},
            submitLoading: false,
            pageLoading: false,
            oldIcon: "",
            oldPoster: "",
            oldTrailer: "",
            rules: [{ field: "title", operator: "contains", value: "" }],
            selectedCourses: [],
            selectedPrerequisites: [],
            selectedCorequisites: [],
            selectedNextSteps: [],
            path_id: null,
            poster: null,
            icon: null,
            posterPreview: { name: "", size: "", url: "" },
            iconPreview: { name: "", size: "", url: "" },
            controllers: { poster: null, icon: null, trailer: null },
            uploadStatus: { poster: "idle", icon: "idle", trailer: "idle" },
            showSuccessCreateModal: false,
            progress: {
                poster: { percent: 0, uploaded: 0, total: 0, speed: "", completed: false },
                icon: { percent: 0, uploaded: 0, total: 0, speed: "", completed: false },
                trailer: { percent: 0, uploaded: 0, total: 0, speed: "", completed: false },
            },
            trailer: null,
            trailerPreview: { name: "", size: 0, duration: "", thumbnail: "" },
            fileValidationRules: defaultFileValidationRules,
        };
    },
    provide() {
        return { pathFormRoot: this };
    },
    watch: {
        uploadStatus: {
            handler(newStatus) {
                if (!this.path_id) return;
                const selectedFiles = Object.keys(newStatus).filter((key) => newStatus[key] !== "idle");
                if (!selectedFiles.length) return;
                const allReady = selectedFiles.every((statusKey) => newStatus[statusKey] === "uploaded");
                if (allReady && !this.isEdit) this.showSuccessCreateModal = true;
            },
            deep: true,
        },
    },
};

export { ADMIN_FORM_STYLES } from "@/views/components/admin/adminFormStepperMixin.js";
