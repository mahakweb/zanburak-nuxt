<script setup>
definePageMeta({
  name: "admin-episode-create",
  middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link
                v-if="course"
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
            <LoadingComponent v-if="pageLoading" />

            <form v-else id="create-episode-form" @submit.prevent="submit">
                <input
                    id="video"
                    ref="video"
                    type="file"
                    :accept="fileValidationRules.video.extensions.join(',')"
                    class="hidden"
                    @change="handleVideo"
                />

                <div class="grid grid-cols-1 gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="submitLoading"
                        submit-label="ایجاد جلسه و ادامه"
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submit"
                    />

                    <div class="min-w-0 min-h-[420px]">
                        <!-- Step 1: Basic info + video -->
                        <section
                            v-show="currentStepId === 'basic'"
                            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm"
                        >
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات اولیه جلسه</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    عنوان جلسه و ویدیوی آن را وارد کنید
                                </p>
                            </div>

                            <div class="grid gap-x-6 gap-y-4 grid-cols-1 md:grid-cols-2">
                                <div>
                                    <label for="title" class="field-label">عنوان فارسی جلسه</label>
                                    <input
                                        id="title"
                                        v-model="title"
                                        type="text"
                                        class="form-input"
                                        :class="fieldErrorClass('title')"
                                        placeholder="مثلاً: معرفی دوره"
                                        required
                                    />
                                    <span v-if="errors?.title" class="mt-1 text-rose-500 text-xs font-medium block">
                                        {{ errors.title[0] }}
                                    </span>
                                </div>

                                <div>
                                    <label for="english_title" class="field-label">عنوان انگلیسی جلسه</label>
                                    <input
                                        id="english_title"
                                        v-model="english_title"
                                        type="text"
                                        class="form-input"
                                        :class="fieldErrorClass('english_title')"
                                        placeholder="e.g. course-intro"
                                        @input="filterInputEnglishTitle"
                                        required
                                    />
                                    <span v-if="errors?.english_title" class="mt-1 text-rose-500 text-xs font-medium block">
                                        {{ errors.english_title[0] }}
                                    </span>
                                    <p class="text-xs text-gray-400 mt-1">برای ساخت آدرس (slug) جلسه استفاده می‌شود.</p>
                                </div>
                            </div>

                            <div class="mt-6">
                                <label class="field-label flex items-center justify-between">
                                    <span>ویدیوی جلسه</span>
                                    <span v-if="video" class="text-[10px] font-medium text-gray-400 font-sans">
                                        {{ videoPreview.name }} · {{ formatFileSize(videoPreview.size) }}
                                    </span>
                                </label>

                                <div
                                    class="relative border-2 flex flex-col items-center justify-center w-full rounded-2xl cursor-pointer transition overflow-hidden"
                                    :class="[
                                        errors?.video ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700',
                                        videoPreview.thumbnail
                                            ? 'h-56 border-solid'
                                            : 'h-64 border-dashed bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800',
                                    ]"
                                    @dragover.prevent
                                    @drop.prevent="handleVideo"
                                    @click="!videoPreview.thumbnail && openVideoPicker()"
                                >
                                    <template v-if="!videoPreview.thumbnail">
                                        <div class="flex flex-col items-center justify-center p-8 pointer-events-none">
                                            <div class="w-16 h-16 rounded-2xl bg-yellow-400/20 flex items-center justify-center mb-4">
                                                <svg class="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p class="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                کلیک کنید یا ویدیو را اینجا بکشید
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                {{ fileValidationRules.video.extensions.join(', ') }}
                                                (حداکثر {{ formatFileSize(fileValidationRules.video.maxSize, 0, 'fa') }})
                                            </p>
                                            <button
                                                type="button"
                                                class="mt-5 rounded-xl px-5 py-2 text-xs font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-colors pointer-events-auto"
                                                @click.stop="openVideoPicker"
                                            >
                                                انتخاب ویدیو
                                            </button>
                                        </div>
                                    </template>

                                    <template v-else>
                                        <img :src="videoPreview.thumbnail" class="absolute inset-0 w-full h-full object-cover" alt="" />
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        <div class="absolute top-3 end-3 flex items-center gap-1.5 z-10">
                                            <button
                                                type="button"
                                                title="تغییر ویدیو"
                                                class="h-8 px-3 rounded-lg bg-white/90 dark:bg-gray-900/90 text-xs font-semibold text-gray-800 dark:text-gray-100 shadow hover:bg-white"
                                                @click.stop="openVideoPicker"
                                            >
                                                تغییر
                                            </button>
                                            <button
                                                type="button"
                                                title="لغو انتخاب ویدیو"
                                                class="h-8 px-3 rounded-lg bg-rose-500 text-white text-xs font-semibold shadow hover:bg-rose-600 flex items-center gap-1"
                                                @click.stop="removeVideo"
                                            >
                                                لغو انتخاب
                                            </button>
                                        </div>
                                        <div class="absolute bottom-3 start-3 end-3 z-10 flex items-center gap-3 text-white text-xs font-medium">
                                            <span class="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">{{ videoPreview.duration }}</span>
                                            <span class="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">{{ formatFileSize(videoPreview.size) }}</span>
                                            <span class="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 line-clamp-1 flex-1">{{ videoPreview.name }}</span>
                                        </div>
                                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                            <div class="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                                <svg class="w-6 h-6 text-gray-600 ms-0.5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <span v-if="errors?.video" class="mt-1 text-rose-500 text-xs font-medium block">
                                    {{ errors.video[0] }}
                                </span>
                            </div>

                            <div class="mt-8 pt-6 border-t border-gray-200/80 dark:border-gray-700/80">
                                <AdminAttachmentsField
                                    ref="attachmentsField"
                                    title="فایل پیوست (PDF، ZIP و...)"
                                    hint="می‌توانید چند فایل انتخاب کنید و برای هر کدام نام نمایشی بگذارید"
                                    :accept="fileValidationRules.attached_file.extensions.join(',')"
                                    :allowed-extensions="fileValidationRules.attached_file.extensions"
                                    :allowed-types="fileValidationRules.attached_file.types"
                                    :max-size="fileValidationRules.attached_file.maxSize"
                                    :uploading="attachmentUploading"
                                    @change="onPendingAttachChange"
                                />
                            </div>
                        </section>

                        <!-- Step 2: Confirm -->
                        <section
                            v-show="currentStepId === 'confirm'"
                            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm"
                        >
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">تایید و ایجاد</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    اطلاعات را بررسی کنید؛ پس از ایجاد به صفحه ویرایش هدایت می‌شوید
                                </p>
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

                            <div v-if="videoPreview.thumbnail" class="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                <div class="relative h-40">
                                    <img :src="videoPreview.thumbnail" class="w-full h-full object-cover" alt="" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div class="absolute bottom-3 start-3 text-white text-xs font-semibold">
                                        {{ videoPreview.name }}
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/40 p-3">
                                <p class="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                                    پس از ایجاد جلسه، به صفحه ویرایش منتقل می‌شوید تا سایر جزئیات را تکمیل کنید و ویدیو آپلود و پردازش شود.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </form>
        </div>

        <!-- No sections error -->
        <BottomSheetDrawer
            v-model="showErrorModal"
            :initialHeight="0.55"
            :maxHeight="0.75"
            :minHeight="0.4"
            :autoCloseOnMin="true"
            :closeOnBackdrop="true"
            :lockScroll="true"
            :panelClass="bottomSheetPanelClass"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'"
        >
            <div class="relative p-4 text-center sm:p-5">
                <div class="rounded-2xl bg-amber-400/20 p-2 mb-3.5 mx-auto w-max">
                    <svg class="w-11 h-11 text-amber-400" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M227.3125,80.2345,175.76562,28.68762a16.11511,16.11511,0,0,0-11.3125-4.6875H91.54687a16.11515,16.11515,0,0,0-11.3125,4.6875L28.6875,80.2345A16.11511,16.11511,0,0,0,24,91.547v72.90625a16.11515,16.11515,0,0,0,4.6875,11.3125l51.54687,51.54687a16.11515,16.11515,0,0,0,11.3125,4.6875h72.90625a16.11511,16.11511,0,0,0,11.3125-4.6875l51.54688-51.54687A16.11515,16.11515,0,0,0,232,164.45325V91.547A16.11511,16.11511,0,0,0,227.3125,80.2345ZM120,80.00012a8,8,0,1,1,16,0v56a8,8,0,1,1-16,0Zm8,104a12,12,0,1,1,12-12A12.0006,12.0006,0,0,1,128,184.00012Z" />
                    </svg>
                </div>
                <p class="mb-2 text-gray-600 dark:text-gray-300 font-semibold">برای این دوره هیچ فصلی تعریف نشده!</p>
                <p class="mb-4 text-gray-500 dark:text-gray-400 text-sm">ابتدا یک فصل برای دوره ایجاد کنید.</p>
                <div class="flex justify-center items-center gap-3">
                    <router-link
                        :to="{ name: 'admin-course-details', params: { courseSlug }, query: { section: 'episodes', createSection: 'true' } }"
                        class="h-9 py-2 px-4 text-sm font-semibold text-gray-700 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        ایجاد فصل جدید
                    </router-link>
                </div>
            </div>
        </BottomSheetDrawer>
        <component :is="'style'" type="text/css">{{ adminFormStyles }}</component>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminFormStepperNav from "@/views/components/admin/AdminFormStepperNav.vue";
import { createStepperMixin, BTN_SECONDARY, ADMIN_FORM_STYLES } from "@/views/components/admin/adminFormStepperMixin.js";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import axiosInstance from "@/store/axiosInstance";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { setPendingEpisodeVideo } from "@/utils/episodeUploadBridge.js";
import AdminAttachmentsField from "@/views/components/admin/AdminAttachmentsField.vue";

const FORM_STEPS = [
    { id: "basic", label: "اطلاعات اولیه", hint: "عنوان و ویدیو" },
    { id: "confirm", label: "تایید و ایجاد", hint: "بررسی نهایی" },
];

const stepperMixin = createStepperMixin();

export default {
    mixins: [stepperMixin],
    components: {
        AdminMasterPage,
        AdminFormStepperNav,
        LoadingComponent,
        BottomSheetDrawer,
        AdminAttachmentsField,
    },
    data() {
        return {
            BTN_SECONDARY,
            adminFormStyles: ADMIN_FORM_STYLES,
            FORM_STEPS,
            bottomSheetPanelClass:
                "bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]",
            pageLoading: true,
            submitLoading: false,
            course: null,
            episode: null,
            selectedSection: null,
            selectedOrder: null,
            orderOptions: [],
            courseSlug: this.$route.params.courseSlug,
            sectionSlug: this.$route.params.sectionSlug,
            errors: null,
            title: "",
            english_title: "",
            lock: 0,
            video: null,
            videoPreview: { name: "", size: 0, duration: "", thumbnail: "" },
            showErrorModal: false,
            attachmentUploading: false,
            pendingAttachCount: 0,
            pendingAttachTitles: [],
            fileValidationRules: {
                video: {
                    maxSize: 2 * 1024 * 1024 * 1024,
                    types: ["video/mp4", "video/x-matroska"],
                    extensions: [".mp4", ".mkv"],
                    required: true,
                    errorKey: "video",
                    label: "ویدیو",
                },
                attached_file: {
                    maxSize: 200 * 1024 * 1024,
                    types: [
                        "application/pdf",
                        "text/plain",
                        "application/zip",
                        "application/x-zip-compressed",
                        "text/csv",
                        "image/png",
                        "image/jpeg",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/vnd.ms-word.document.macroEnabled.12",
                        "application/vnd.ms-excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "application/vnd.ms-excel.sheet.macroEnabled.12",
                        "application/vnd.ms-powerpoint",
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
                    ],
                    extensions: [
                        ".pdf", ".txt", ".zip", ".csv", ".png", ".jpg", ".jpeg",
                        ".doc", ".docx", ".docm", ".xls", ".xlsx", ".xlsm",
                        ".ppt", ".pptx", ".pptm",
                    ],
                    required: false,
                    errorKey: "attached_file",
                    label: "فایل پیوست",
                },
            },
        };
    },
    computed: {
        confirmSummary() {
            return [
                { label: "عنوان فارسی", value: this.title },
                { label: "عنوان انگلیسی", value: this.english_title, ltr: true },
                { label: "فصل", value: this.selectedSection?.title },
                { label: "شماره جلسه", value: this.selectedOrder },
                { label: "ویدیو", value: this.video ? this.videoPreview.name : "—" },
                { label: "پیوست‌ها", value: this.pendingAttachTitles.length ? this.pendingAttachTitles.join("، ") : "—" },
            ];
        },
    },
    methods: {
        fieldErrorClass(field) {
            return this.errors?.[field]
                ? "text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900"
                : "";
        },
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
        async getInitData() {
            this.pageLoading = true;
            try {
                const response = await axiosInstance.post(`admin/course/${this.courseSlug}/dataForCreateEpisode`);
                this.course = response.data.course;
                if (!this.course.sections?.length) {
                    this.showErrorModal = true;
                    return;
                }
                this.lock = this.course.type === "free" ? 0 : 1;
                const defaultSection = this.course.sections.find((sec) => sec.slug === this.sectionSlug);
                this.selectedSection = defaultSection || this.course.sections[this.course.sections.length - 1];
                this.prepareOrderOptions();
            } catch (error) {
                console.error(error);
                this.showToast("خطا در بارگذاری اطلاعات دوره", true);
            } finally {
                this.pageLoading = false;
            }
        },
        async createNullEpisode() {
            const response = await axiosInstance.post(`admin/course/${this.courseSlug}/createNullEpisode`, {
                section_id: this.selectedSection.id,
                order: this.selectedOrder,
                title: this.title,
                english_title: this.english_title,
            });
            this.episode = response.data.episode;
            return this.episode;
        },
        onPendingAttachChange(files) {
            const pending = (files || []).filter((item) => item.status !== "uploaded");
            this.pendingAttachCount = pending.length;
            this.pendingAttachTitles = pending.map((item) => item.title).filter(Boolean);
        },
        async uploadPendingAttachments() {
            const field = this.$refs.attachmentsField;
            const episodeId = this.episode?.id;
            if (!field || !episodeId || !field.pendingForUpload().length) return;
            this.attachmentUploading = true;
            try {
                await field.uploadAll(async (item, onProgress) => {
                    const file = item.file;
                    const initRes = await axiosInstance.post(`admin/course/${this.courseSlug}/episode/uploadAttachedFile`, {
                        episode_id: episodeId,
                        filename: file.name,
                        mime: file.type || "application/octet-stream",
                        size: file.size,
                        title: item.title || file.name,
                    });
                    const { uploadPath, uploadToken, workerUploadUrl } = initRes.data;
                    const formData = new FormData();
                    formData.append("path", uploadPath);
                    formData.append("file", file);
                    await axios.post(workerUploadUrl, formData, {
                        timeout: 3600 * 1000,
                        headers: { Authorization: `Bearer ${uploadToken}` },
                        onUploadProgress: (progressEvent) => {
                            const { loaded, total } = progressEvent;
                            onProgress(total ? Math.round((loaded * 100) / total) : 0);
                        },
                    });
                });
            } catch (error) {
                this.showToast(error?.response?.data?.message || "آپلود برخی فایل‌های پیوست ناموفق بود", true);
            } finally {
                this.attachmentUploading = false;
            }
        },
        prepareOrderOptions() {
            const sections = this.course.sections;
            const currentIndex = sections.findIndex((sec) => sec.id === this.selectedSection.id);
            let minOrder = 1;
            for (let i = currentIndex - 1; i >= 0; i--) {
                const prevOrders = sections[i].episodes.map((ep) => ep.order);
                if (prevOrders.length) {
                    minOrder = Math.max(...prevOrders) + 1;
                    break;
                }
            }
            let maxOrder;
            for (let i = currentIndex + 1; i < sections.length; i++) {
                const nextOrders = sections[i].episodes.map((ep) => ep.order);
                if (nextOrders.length) {
                    maxOrder = Math.min(...nextOrders);
                    break;
                }
            }
            if (!maxOrder) {
                const allOrders = sections.flatMap((sec) => sec.episodes.map((ep) => ep.order));
                maxOrder = allOrders.length ? Math.max(...allOrders) + 1 : 1;
            }
            if (minOrder >= maxOrder) {
                this.orderOptions = [minOrder];
            } else {
                this.orderOptions = [];
                for (let i = minOrder; i <= maxOrder; i++) this.orderOptions.push(i);
            }
            this.selectedOrder = maxOrder;
        },
        filterInputEnglishTitle() {
            this.english_title = this.english_title.replace(/[^a-zA-Z0-9 _-]/g, "");
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
            const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
            const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
            const s = String(Math.floor(seconds % 60)).padStart(2, "0");
            return `${h}:${m}:${s}`;
        },
        openVideoPicker() {
            const input = this.$refs.video;
            if (input && typeof input.click === "function") {
                input.click();
            }
        },
        handleVideo(e) {
            const file = e.target?.files?.[0] || e.dataTransfer?.files?.[0];
            if (!file) return;
            if (!this.validateFile(file, "video")) {
                this.video = null;
                return;
            }
            this.video = file;
            const url = URL.createObjectURL(file);
            const videoEl = document.createElement("video");
            videoEl.src = url;
            videoEl.currentTime = 1;
            videoEl.muted = true;
            videoEl.addEventListener("loadeddata", () => {
                const canvas = document.createElement("canvas");
                canvas.width = videoEl.videoWidth;
                canvas.height = videoEl.videoHeight;
                canvas.getContext("2d").drawImage(videoEl, 0, 0, canvas.width, canvas.height);
                this.videoPreview = {
                    name: file.name,
                    size: file.size,
                    duration: this.formatDuration(Math.floor(videoEl.duration)),
                    thumbnail: canvas.toDataURL("image/jpeg"),
                };
                URL.revokeObjectURL(url);
            });
        },
        removeVideo() {
            this.video = null;
            if (this.$refs.video) this.$refs.video.value = null;
            this.videoPreview = { name: "", size: 0, duration: "", thumbnail: "" };
            if (this.errors) this.errors.video = null;
        },
        validateFormStep(stepIndex) {
            const stepId = this.FORM_STEPS[stepIndex]?.id;
            if (stepId === "basic") {
                const missing = [];
                if (!this.title?.trim()) missing.push("عنوان فارسی");
                if (!this.english_title?.trim()) missing.push("عنوان انگلیسی");
                if (!this.video) missing.push("ویدیو");
                if (this.video && !this.validateFile(this.video, "video")) return false;
                if (missing.length) {
                    this.showToast(`لطفاً فیلدهای الزامی را تکمیل کنید: ${missing.join("، ")}`, true);
                    return false;
                }
            }
            return true;
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
            const ext = file?.name?.split(".").pop()?.toLowerCase() || "";
            const isValidExt = rules.extensions.some((e) => e.replace(".", "") === ext);
            const isValidType = file.type && rules.types.includes(file.type);
            if (!isValidExt && !isValidType) {
                this.errors[type] = ["فرمت فایل مجاز نیست"];
                return false;
            }
            if (file.size > rules.maxSize) {
                this.errors[type] = [`حجم ${rules.label} نباید بیشتر از ${this.formatFileSize(rules.maxSize, 0, "fa")} باشد`];
                return false;
            }
            this.errors[type] = null;
            return true;
        },
        async submit() {
            if (!this.validateFormStep(0)) {
                this.currentStep = 0;
                return;
            }
            this.submitLoading = true;
            this.errors = null;
            try {
                if (!this.episode) await this.createNullEpisode();
                const response = await axiosInstance.post(`admin/course/${this.course.slug}/createEpisode`, {
                    title: this.title,
                    english_title: this.english_title,
                    description: "",
                    meta_keywords: null,
                    publish_date: "",
                    publish: 0,
                    lock: this.lock,
                    order: this.selectedOrder,
                    section_id: this.selectedSection.id,
                    episode_id: this.episode.id,
                });
                setPendingEpisodeVideo(this.video, this.videoPreview);
                await this.uploadPendingAttachments();
                this.showToast("جلسه ایجاد شد؛ در حال انتقال به صفحه ویرایش...");
                const savedEpisode = response.data?.episode || this.episode;
                const episodeSlug = savedEpisode.slug || this.english_title;
                await this.$router.push({
                    name: "admin-episode-edit",
                    params: {
                        courseSlug: this.courseSlug,
                        sectionSlug: this.selectedSection.slug,
                        episodeSlug,
                    },
                });
            } catch (error) {
                this.errors = error.response?.data?.errors || {};
                this.showToast("خطا در ایجاد جلسه", true);
            } finally {
                this.submitLoading = false;
            }
        },
    },
    mounted() {
        document.title = "ایجاد جلسه جدید";
        this.getInitData();
    },
};
</script>
