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

                                <!-- Video Upload Dropzone when no video selected -->
                                <div
                                    v-if="!video"
                                    class="relative border-2 border-dashed flex flex-col items-center justify-center w-full max-w-3xl mx-auto rounded-2xl cursor-pointer transition overflow-hidden aspect-video group/drop"
                                    :class="[
                                        errors?.video ? 'border-rose-500 bg-rose-50/20' : 'border-gray-300 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-400 bg-gray-50/70 dark:bg-gray-800/40 hover:bg-gray-100/70 dark:hover:bg-gray-800/70',
                                    ]"
                                    @dragover.prevent
                                    @drop.prevent="handleVideo"
                                    @click="openVideoPicker"
                                >
                                    <div class="flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                                        <div class="w-16 h-16 rounded-2xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center mb-4 text-yellow-500 group-hover/drop:scale-110 transition-transform">
                                            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p class="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">
                                            انتخاب یا کشیدن و رها کردن ویدیوی جلسه
                                        </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-sans">
                                            {{ fileValidationRules.video.extensions.join(' · ') }} (حداکثر {{ formatFileSize(fileValidationRules.video.maxSize, 0, 'fa') }})
                                        </p>
                                        <button
                                            type="button"
                                            class="mt-4 rounded-xl px-5 py-2 text-xs font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition shadow-sm pointer-events-auto"
                                            @click.stop="openVideoPicker"
                                        >
                                            انتخاب فایل ویدیو
                                        </button>
                                    </div>
                                </div>

                                <!-- Sleek Video Player when video is selected (Never stretched, full playback) -->
                                <div v-else class="w-full max-w-3xl mx-auto space-y-3">
                                    <AdminVideoPlayer
                                        :src="video"
                                        :poster="videoPreview.thumbnail"
                                        :title="videoPreview.name"
                                        :size="videoPreview.size"
                                        badge-text="آماده ایجاد"
                                        @change="openVideoPicker"
                                        @remove="removeVideo"
                                    />


                                </div>
                                <span v-if="errors?.video" class="mt-1 text-rose-500 text-xs font-medium block">
                                    {{ errors.video[0] }}
                                </span>
                            </div>


                        </section>

                        <!-- Step 2: Confirm -->
                        <section
                            v-show="currentStepId === 'confirm'"
                            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 sm:p-6 shadow-sm space-y-6"
                        >
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <h3 class="text-base font-bold text-gray-900 dark:text-white">بررسی و تایید نهایی جلسه</h3>
                                    </div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        اطلاعات و ویدیوی انتخاب‌شده را بررسی کنید؛ می‌توانید ویدیو را مستقیماً پخش و بازبینی نمایید
                                    </p>
                                </div>
                                <span class="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 border border-yellow-400/30">
                                    مرحله ۲ از ۲: بررسی نهایی
                                </span>
                            </div>

                            <!-- Playable Video in Confirm Step -->
                            <div v-if="video" class="space-y-2">
                                <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 px-1 font-semibold">
                                    <span class="flex items-center gap-1.5">
                                        <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        پیش‌نمایش زنده ویدیو
                                    </span>
                                    <span class="text-slate-400 font-normal text-[11px]">با کلیک روی ویدیو یا دکمه پخش، از صحت ویدیو اطمینان حاصل کنید</span>
                                </div>
                                <AdminVideoPlayer
                                    :src="video"
                                    :poster="videoPreview.thumbnail"
                                    :title="videoPreview.name"
                                    :size="videoPreview.size"
                                    :allow-change="false"
                                    :allow-remove="false"
                                    badge-text="آماده ایجاد"
                                />
                            </div>

                            <!-- Graphical Information Cards -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Card 1: Episode Details -->
                                <div class="rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 p-4 space-y-3">
                                    <div class="flex items-center gap-2 pb-2.5 border-b border-gray-200/60 dark:border-gray-700/60">
                                        <div class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h4 class="text-xs font-bold text-gray-900 dark:text-white">مشخصات جلسه</h4>
                                    </div>

                                    <div class="space-y-2 text-xs">
                                        <div class="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-700/40">
                                            <span class="text-gray-500 dark:text-gray-400">عنوان فارسی:</span>
                                            <span class="font-bold text-gray-900 dark:text-gray-100 text-end">{{ title || '—' }}</span>
                                        </div>
                                        <div class="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-700/40">
                                            <span class="text-gray-500 dark:text-gray-400">عنوان انگلیسی:</span>
                                            <span class="font-mono font-medium text-gray-800 dark:text-gray-200 text-end" dir="ltr">{{ english_title || '—' }}</span>
                                        </div>
                                        <div class="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-700/40">
                                            <span class="text-gray-500 dark:text-gray-400">دوره / فصل:</span>
                                            <span class="font-semibold text-gray-800 dark:text-gray-200 text-end">{{ course?.title || '—' }} · {{ selectedSection?.title || '—' }}</span>
                                        </div>
                                        <div class="flex items-center justify-between py-1">
                                            <span class="text-gray-500 dark:text-gray-400">شماره ترتیب جلسه:</span>
                                            <span class="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold font-mono">جلسه {{ selectedOrder }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Card 2: Video Details -->
                                <div class="rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 p-4 space-y-3">
                                    <div class="flex items-center justify-between pb-2.5 border-b border-gray-200/60 dark:border-gray-700/60">
                                        <div class="flex items-center gap-2">
                                            <div class="w-7 h-7 rounded-lg bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0">
                                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h4 class="text-xs font-bold text-gray-900 dark:text-white">مشخصات ویدیو</h4>
                                        </div>
                                    </div>

                                    <div class="space-y-2 text-xs">
                                        <div class="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-700/40">
                                            <span class="text-gray-500 dark:text-gray-400">نام فایل ویدیو:</span>
                                            <span class="font-mono text-gray-800 dark:text-gray-200 truncate max-w-[180px]" :title="videoPreview.name" dir="ltr">{{ videoPreview.name || '—' }}</span>
                                        </div>
                                        <div class="flex items-center justify-between py-1">
                                            <span class="text-gray-500 dark:text-gray-400">حجم و زمان:</span>
                                            <span class="font-mono text-gray-800 dark:text-gray-200" dir="ltr">
                                                {{ formatFileSize(videoPreview.size) }} · {{ videoPreview.duration || '—' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <!-- Notice Box -->
                            <div class="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/40 p-3.5 flex items-start gap-3">
                                <div class="w-5 h-5 rounded-full bg-amber-400/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <p class="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                                    پس از فشردن دکمه «ایجاد جلسه و ادامه»، جلسه ذخیره شده و مستقیماً به صفحه ویرایش هدایت می‌شوید تا مراحل انتقال و پردازش ویدیو به‌صورت خودکار آغاز شود.
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
import AdminVideoPlayer from "@/views/components/admin/episode/AdminVideoPlayer.vue";

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
        AdminVideoPlayer,
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
            processingMode: "local",
            storageDisk: "static",
            showErrorModal: false,
            fileValidationRules: {
                video: {
                    maxSize: 2 * 1024 * 1024 * 1024,
                    types: ["video/mp4", "video/x-matroska"],
                    extensions: [".mp4", ".mkv"],
                    required: true,
                    errorKey: "video",
                    label: "ویدیو",
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
                setPendingEpisodeVideo(this.video, this.videoPreview, {
                    processingMode: this.processingMode || "local",
                    storageDisk: this.storageDisk || "static",
                });
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
