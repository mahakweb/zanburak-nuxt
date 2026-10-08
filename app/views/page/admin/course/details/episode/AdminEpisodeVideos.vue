<template>
    <div class="space-y-4">
        <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/70 p-4 space-y-4 shadow-sm">
            <div class="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">مدیریت ویدیوی جلسه</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        کیفیت‌ها را انتخاب کنید، سپس آپلود و پردازش را انجام دهید. خروجی قبلی همان نوع با هر پردازش جایگزین می‌شود.
                    </p>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    <label class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-bold bg-yellow-400 text-gray-900 cursor-pointer shadow-sm hover:bg-yellow-300 transition">
                        انتخاب ویدیو
                        <input ref="fileInput" type="file" accept=".mp4,.mkv,video/mp4,video/x-matroska" class="hidden" @change="onFileSelected" />
                    </label>
                    <button
                        type="button"
                        class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-yellow-400/50 transition disabled:opacity-60"
                        :disabled="loading || uploading"
                        @click="getEpisodeVideos">
                        بروزرسانی
                    </button>
                </div>
            </div>

            <p v-if="uploadError && !selectedFile" class="text-xs text-rose-500">{{ uploadError }}</p>

            <div v-if="selectedFile" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50 p-4 space-y-4">
                <div class="flex items-center justify-between gap-2 text-xs">
                    <span class="font-bold text-gray-800 dark:text-gray-100 truncate">{{ selectedFile.name }}</span>
                    <span class="shrink-0 rounded-full bg-white dark:bg-gray-900 px-2.5 py-1 text-[10px] font-semibold text-gray-500 border border-gray-200 dark:border-gray-700">{{ formatFileSize(selectedFile.size) }}</span>
                </div>
                <VideoProcessOptions
                    v-model="processOptions"
                    v-model:watermark-file="watermarkFile"
                    :source-height="sourceHeight"
                    :preview-file="selectedFile"
                />
                <div v-if="uploading" class="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div class="h-full bg-yellow-400 transition-all duration-300" :style="{ width: uploadPercent + '%' }"></div>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-bold bg-yellow-400 text-gray-900 shadow-sm hover:bg-yellow-300 transition disabled:opacity-60"
                        :disabled="uploading || !canUpload || !canStartProcessing"
                        @click="uploadSelectedVideo">
                        {{ uploading ? `در حال آپلود ${uploadPercent}%` : 'آپلود و شروع پردازش' }}
                    </button>
                    <button
                        v-if="uploading"
                        type="button"
                        class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white shadow-sm hover:bg-rose-600 transition"
                        @click="cancelUpload">
                        لغو آپلود
                    </button>
                    <button
                        type="button"
                        class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-gray-900 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition disabled:opacity-60"
                        :disabled="uploading"
                        @click="clearSelectedFile">
                        لغو انتخاب
                    </button>
                </div>
                <p v-if="uploadError" class="text-xs text-rose-500">{{ uploadError }}</p>
            </div>

            <div v-else-if="rawVideo" class="space-y-3">
                <VideoProcessOptions
                    v-model="processOptions"
                    v-model:watermark-file="watermarkFile"
                    :source-height="sourceHeight"
                />
            </div>
        </div>

        <AdminInlineLoading v-if="loading && !videos.length" />
        <div v-else-if="videos && videos.length > 0" class="space-y-1 relative">
            <div v-if="refreshing"
                class="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-400/90 text-gray-900">
                بروزرسانی…
            </div>
            <div v-for="video in videos" :key="video.id"
                class="p-4 bg-gray-50 dark:bg-gray-800 first:rounded-t-lg last:rounded-b-lg">
                <div class="flex flex-col md:flex-row md:items-center gap-3">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-2 flex-wrap">
                            <span class="px-2 py-1 rounded text-xs font-semibold shrink-0"
                                :class="{
                                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400': video.type === 'stream',
                                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400': video.type === 'download',
                                    'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300': video.type === 'raw'
                                }">
                                {{ video.type === 'stream' ? 'پخش آنلاین' : video.type === 'download' ? 'دانلود' : 'خام' }}
                            </span>
                            <span v-if="video.quality" class="px-2 py-1 rounded text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 shrink-0">
                                {{ video.quality }}p
                            </span>
                            <span class="px-2 py-1 rounded text-xs font-semibold shrink-0"
                                :class="{
                                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400': normalizeStatus(video.status, video.progress) === 'processed',
                                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400': ['processing', 'queued', 'uploaded'].includes(normalizeStatus(video.status, video.progress)),
                                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400': normalizeStatus(video.status, video.progress) === 'failed'
                                }">
                                {{ getStatusText(normalizeStatus(video.status, video.progress)) }}
                                <span v-if="video.type === 'raw' && typeof video.progress === 'number' && ['processing', 'queued'].includes(normalizeStatus(video.status, video.progress))">
                                    · {{ video.progress }}%
                                </span>
                            </span>
                            <p v-if="video.type === 'raw' && normalizeStatus(video.status, video.progress) === 'failed' && videoErrorText(video)"
                                class="mt-1 text-[11px] text-rose-600 dark:text-rose-300">
                                {{ videoErrorText(video) }}
                            </p>
                        </div>

                        <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs text-gray-600 dark:text-gray-300">
                            <div v-if="video.duration" class="flex items-center gap-1.5 shrink-0">
                                <span>مدت زمان: {{ formatDuration(video.duration) }}</span>
                            </div>
                            <div v-if="video.size" class="flex items-center gap-1.5 shrink-0">
                                <span>{{ formatFileSize(video.size) }}</span>
                            </div>
                            <div v-if="video.created_at" class="flex items-center gap-1.5 shrink-0">
                                <span>{{ new Date(video.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 shrink-0 flex-wrap">
                        <button
                            v-if="video.type === 'raw' && ['processing', 'queued'].includes(normalizeStatus(video.status, video.progress))"
                            type="button"
                            @click="cancelProcessing(video.id)"
                            :disabled="cancellingId === video.id"
                            class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500 text-white shadow-sm hover:bg-rose-600 whitespace-nowrap transition disabled:opacity-60">
                            {{ cancellingId === video.id ? '...' : 'لغو پردازش' }}
                        </button>
                        <button
                            v-if="video.type === 'raw' && ['failed', 'uploaded', 'queued', 'processed', 'cancelled'].includes(video.status) && !['processing', 'queued'].includes(normalizeStatus(video.status, video.progress))"
                            type="button"
                            @click="retryProcessing(video.id)"
                            :disabled="retryingId === video.id || !canStartProcessing"
                            class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-yellow-400 text-gray-900 shadow-sm hover:bg-yellow-300 whitespace-nowrap transition disabled:opacity-60">
                            {{ retryingId === video.id ? '...' : (video.status === 'processed' ? 'پردازش مجدد' : 'پردازش') }}
                        </button>
                        <button
                            v-if="video.type === 'raw'"
                            type="button"
                            @click="removeAllVideos"
                            :disabled="removing"
                            class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border border-rose-200/70 dark:border-rose-900/40 whitespace-nowrap transition disabled:opacity-60">
                            {{ removing ? '...' : 'حذف ویدیو' }}
                        </button>
                        <a v-if="video.url" :href="video.url" target="_blank"
                            class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-yellow-400/50 whitespace-nowrap transition">
                            مشاهده
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-24 text-gray-500 font-semibold">
            هیچ ویدیویی ثبت نشده است
        </div>

        <div v-if="pagination && pagination.last_page > 1"
            class="flex lg:flex-row flex-col items-center justify-between gap-4 mt-6">
            <div>
                <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
            </div>
            <div class="w-max">
                <select v-model="perPage" @change="selectPerpage(perPage)"
                    class="w-full px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none">
                    <option v-for="(per, index) in perPages" :key="index" :value="per">{{ per }}</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import axiosInstance from "@/store/axiosInstance";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import VideoProcessOptions from "@/views/components/admin/VideoProcessOptions.vue";
import { probeVideoHeightFromFile, defaultProcessOptions, buildProcessRequestBody } from "@/utils/videoProcessOptions.js";
import { toast } from "vue3-toastify";

export default {
    components: {
        AdminInlineLoading,
        PaginationComponent,
        VideoProcessOptions,
    },
    props: {
        courseSlug: { type: String, required: true },
        episodeSlug: { type: String, required: true },
        courseId: { type: [Number, String], default: null },
        episodeId: { type: [Number, String], default: null },
    },
    data() {
        return {
            retryingId: null,
            cancellingId: null,
            removing: false,
            uploadController: null,
            videos: [],
            loading: false,
            refreshing: false,
            perPage: 10,
            perPages: [10, 20, 30, 50, 100],
            currentPage: 1,
            pagination: {},
            selectedFile: null,
            uploading: false,
            uploadPercent: 0,
            uploadError: null,
            statusTimer: null,
            lastUploadedVideoId: null,
            sourceHeight: 720,
            watermarkFile: null,
            processOptions: defaultProcessOptions(720),
            pollingVideoId: null,
        };
    },
    computed: {
        canUpload() {
            return !!(this.selectedFile && this.courseId && this.episodeId);
        },
        rawVideo() {
            return (this.videos || []).find((v) => v.type === 'raw') || null;
        },
        canStartProcessing() {
            const outs = this.processOptions?.outputs || [];
            if (!outs.length) return false;
            if (outs.includes('stream') && !(this.processOptions?.stream_qualities?.length || this.processOptions?.qualities?.length)) {
                return false;
            }
            if (outs.includes('download') && !(this.processOptions?.download_qualities?.length || this.processOptions?.qualities?.length)) {
                return false;
            }
            const wm = this.processOptions?.watermark;
            if (wm?.enabled && wm.type === 'text' && !String(wm.text || '').trim()) {
                return false;
            }
            if (wm?.enabled && wm.type === 'image' && !this.watermarkFile) {
                return false;
            }
            return true;
        },
    },
    methods: {
        async onFileSelected(e) {
            const file = e.target.files?.[0];
            this.uploadError = null;
            if (!file) {
                this.selectedFile = null;
                return;
            }
            // Course episode videos can be large; keep a high ceiling (2GB).
            const max = 2 * 1024 * 1024 * 1024;
            const name = (file.name || '').toLowerCase();
            const okExt = name.endsWith('.mp4') || name.endsWith('.mkv');
            if (!okExt) {
                this.uploadError = 'فقط فایل‌های mp4 و mkv مجاز هستند.';
                this.selectedFile = null;
                if (this.$refs.fileInput) this.$refs.fileInput.value = '';
                toast.warning(this.uploadError, {
                    theme: 'colored',
                    hideProgressBar: false,
                    rtl: localStorage.getItem('direction') == 'rtl',
                    bodyClassName: 'font-YekanBakh',
                    toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }
            if (file.size > max) {
                this.uploadError = `حداکثر حجم مجاز ${this.formatFileSize(max)} است.`;
                this.selectedFile = null;
                if (this.$refs.fileInput) this.$refs.fileInput.value = '';
                toast.warning(this.uploadError, {
                    theme: 'colored',
                    hideProgressBar: false,
                    rtl: localStorage.getItem('direction') == 'rtl',
                    bodyClassName: 'font-YekanBakh',
                    toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }
            this.selectedFile = file;
            this.sourceHeight = await probeVideoHeightFromFile(file);
        },
        clearSelectedFile() {
            this.cancelUpload({ silent: true });
            this.selectedFile = null;
            this.uploadPercent = 0;
            this.uploadError = null;
            if (this.$refs.fileInput) this.$refs.fileInput.value = '';
        },
        cancelUpload({ silent = false } = {}) {
            if (this.uploadController) {
                this.uploadController.abort();
                this.uploadController = null;
            }
            if (this.uploading) {
                this.uploading = false;
                this.uploadPercent = 0;
                if (!silent) {
                    toast.info('آپلود لغو شد.', {
                        theme: 'colored',
                        hideProgressBar: false,
                        rtl: localStorage.getItem('direction') == 'rtl',
                        bodyClassName: 'font-YekanBakh',
                        toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }
            }
        },
        async uploadSelectedVideo() {
            if (!this.canUpload || this.uploading) return;
            if (!this.canStartProcessing) {
                toast.warning('خروجی و کیفیت‌ها را کامل انتخاب کنید.', {
                    theme: 'colored',
                    hideProgressBar: false,
                    rtl: localStorage.getItem('direction') == 'rtl',
                    bodyClassName: 'font-YekanBakh',
                    toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }
            this.uploading = true;
            this.uploadPercent = 0;
            this.uploadError = null;
            this.uploadController = new AbortController();
            try {
                const initRes = await axiosInstance.post('admin/video/upload', {
                    course_id: this.courseId,
                    episode_id: this.episodeId,
                    filename: this.selectedFile.name,
                    mime: this.selectedFile.type || 'video/mp4',
                    size: this.selectedFile.size,
                    storage_disk: this.processOptions?.storage_disk || 'dl',
                });
                const { uploadPath, uploadToken, workerUploadUrl } = initRes.data;
                const { uploadVideoInChunks } = await import('@/utils/chunkedVideoUpload.js');
                const workerData = await uploadVideoInChunks({
                    file: this.selectedFile,
                    uploadPath,
                    uploadToken,
                    workerUploadUrl,
                    signal: this.uploadController.signal,
                    onProgress: (percent) => {
                        this.uploadPercent = percent;
                    },
                });

                const videoId = workerData?.video_id;
                if (workerData?.height) {
                    this.sourceHeight = Number(workerData.height) || this.sourceHeight;
                }
                this.lastUploadedVideoId = videoId || null;

                if (videoId && this.canStartProcessing) {
                    toast.success('آپلود تمام شد؛ پردازش از فایل لوکال شروع شد.', {
                        theme: 'colored',
                        hideProgressBar: false,
                        rtl: localStorage.getItem('direction') == 'rtl',
                        bodyClassName: 'font-YekanBakh',
                        toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.clearSelectedFile();
                    await this.getEpisodeVideos();
                    await this.retryProcessing(videoId);
                } else {
                    toast.success('ویدیو آپلود شد. کیفیت‌ها را انتخاب و پردازش را شروع کنید.', {
                        theme: 'colored',
                        hideProgressBar: false,
                        rtl: localStorage.getItem('direction') == 'rtl',
                        bodyClassName: 'font-YekanBakh',
                        toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.clearSelectedFile();
                    await this.getEpisodeVideos();
                }
            } catch (error) {
                if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED' || axios.isCancel?.(error)) {
                    return;
                }
                console.error('Upload failed:', error);
                const msg = error?.response?.data?.message || error?.message || 'آپلود ناموفق بود';
                this.uploadError = msg;
                toast.error(msg, {
                    theme: 'colored',
                    hideProgressBar: false,
                    rtl: localStorage.getItem('direction') == 'rtl',
                    bodyClassName: 'font-YekanBakh',
                    toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.uploading = false;
                this.uploadController = null;
            }
        },
        async cancelProcessing(videoId) {
            if (!videoId || this.cancellingId) return;
            this.cancellingId = videoId;
            try {
                await axiosInstance.post(`admin/video/process/${videoId}/cancel`, {}, { timeout: 30000 });
                this.stopStatusPolling();
                await this.getEpisodeVideos({ silent: true });
                toast.success('پردازش لغو شد.', {
                    theme: 'colored',
                    hideProgressBar: false,
                    rtl: localStorage.getItem('direction') == 'rtl',
                    bodyClassName: 'font-YekanBakh',
                    toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } catch (error) {
                console.error('Cancel processing failed:', error);
                toast.error(error?.response?.data?.message || 'لغو پردازش ناموفق بود', {
                    theme: 'colored',
                    hideProgressBar: false,
                    rtl: localStorage.getItem('direction') == 'rtl',
                    bodyClassName: 'font-YekanBakh',
                    toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.cancellingId = null;
            }
        },
        async removeAllVideos() {
            if (!this.episodeId || this.removing) return;
            if (!confirm('همه ویدیوهای این جلسه حذف شوند؟')) return;
            this.removing = true;
            try {
                await axiosInstance.post(`admin/course/${this.courseSlug}/episode/removeFile`, {
                    episode_id: this.episodeId,
                    file_type: 'video',
                });
                this.stopStatusPolling();
                this.lastUploadedVideoId = null;
                await this.getEpisodeVideos();
                toast.success('ویدیو حذف شد.', {
                    theme: 'colored',
                    hideProgressBar: false,
                    rtl: localStorage.getItem('direction') == 'rtl',
                    bodyClassName: 'font-YekanBakh',
                    toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } catch (error) {
                console.error('Remove failed:', error);
            } finally {
                this.removing = false;
            }
        },
        async retryProcessing(videoId) {
            if (!videoId || this.retryingId) return;
            if (!this.canStartProcessing) {
                toast.warning('خروجی و کیفیت‌ها را کامل انتخاب کنید.', {
                    theme: 'colored',
                    hideProgressBar: false,
                    rtl: localStorage.getItem('direction') == 'rtl',
                    bodyClassName: 'font-YekanBakh',
                    toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }
            this.retryingId = videoId;
            try {
                await axiosInstance.post(
                    `admin/video/process/${videoId}`,
                    buildProcessRequestBody(this.processOptions, this.watermarkFile),
                    { timeout: 60000 }
                );
                this.startStatusPolling(videoId);
                await this.getEpisodeVideos();
            } catch (error) {
                console.error('Retry processing failed:', error);
            } finally {
                this.retryingId = null;
            }
        },
        startStatusPolling(videoId) {
            this.stopStatusPolling();
            this.pollingVideoId = videoId;
            const pollOnce = async () => {
                try {
                    const res = await axiosInstance.get(`admin/video/${videoId}/status`, { timeout: 10000 });
                    let status = res.data?.status;
                    const progress = res.data?.progress;
                    if (status === 'queued' && typeof progress === 'number' && progress > 0) {
                        status = 'processing';
                    }

                    const target = this.videos.find((v) => v.id === videoId)
                        || this.videos.find((v) => v.type === 'raw');
                    if (target) {
                        target.status = status;
                        if (typeof progress === 'number') {
                            target.progress = progress;
                        }
                    }

                    if (status === 'processed' || status === 'failed') {
                        this.stopStatusPolling();
                        await this.getEpisodeVideos({ silent: true });
                    }
                } catch (e) {
                    // keep trying
                }
            };
            pollOnce();
            this.statusTimer = setInterval(pollOnce, 3000);
        },
        stopStatusPolling() {
            if (this.statusTimer) {
                clearInterval(this.statusTimer);
                this.statusTimer = null;
            }
            this.pollingVideoId = null;
        },
        normalizeStatus(status, progress) {
            if (status === 'cancelled') return 'uploaded';
            if ((status === 'queued' || status === 'uploaded') && typeof progress === 'number' && progress > 0) {
                return 'processing';
            }
            if (status === 'completed') return 'processed';
            return status;
        },
        formatDuration(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            return `${m}:${s.toString().padStart(2, '0')}`;
        },
        formatFileSize(bytes) {
            if (!bytes) return 'نامشخص';
            const k = 1024;
            const sizes = ['بایت', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
        },
        getStatusText(status) {
            const statusMap = {
                queued: 'در صف',
                uploaded: 'آپلود شده',
                processing: 'در حال پردازش',
                processed: 'تکمیل شده',
                completed: 'تکمیل شده',
                failed: 'ناموفق',
                cancelled: 'لغو شده',
            };
            return statusMap[status] || status || '—';
        },
        videoErrorText(video) {
            if (!video?.error_message) return '';
            const msg = String(video.error_message);
            if (msg.includes('STATIC_DEPLOY_SECRET') || msg.includes('hls-unpack')) {
                return 'اسکریپت hls-unpack روی static تنظیم نشده است.';
            }
            if (msg.includes('FTP') || msg.includes('ftp') || msg.includes('Timeout') || msg.includes('Zip deploy')) {
                return 'آپلود خروجی به سرور فایل ناموفق بود؛ دوباره پردازش کنید.';
            }
            if (msg.includes('Raw video file missing')) {
                return 'فایل خام روی سرور نیست؛ دوباره آپلود کنید.';
            }
            return msg.length > 120 ? msg.slice(0, 120) + '…' : msg;
        },
        selectPerpage(value) {
            this.perPage = value;
            this.currentPage = 1;
            this.getEpisodeVideos();
        },
        updatePage(page) {
            this.currentPage = page;
            this.getEpisodeVideos();
        },
        async getEpisodeVideos({ silent = false } = {}) {
            if (silent) {
                this.refreshing = true;
            } else {
                this.loading = true;
            }
            try {
                const response = await axiosInstance.post(
                    `admin/course/${this.courseSlug}/episode/${this.episodeSlug}/details`,
                    {
                        data_type: 'videos',
                        perPage: this.perPage,
                        page: this.currentPage,
                    }
                );
                this.videos = response.data.videos || [];
                this.pagination = response.data.pagination || {};

                const raw = this.rawVideo;
                if (raw?.id) this.lastUploadedVideoId = raw.id;
                const liveStatus = raw ? this.normalizeStatus(raw.status, raw.progress) : null;
                if (raw && ['queued', 'processing', 'uploaded'].includes(liveStatus) && !this.statusTimer) {
                    this.startStatusPolling(raw.id);
                }
            } catch (error) {
                console.error('Error fetching episode videos:', error);
                if (!silent) this.videos = [];
            } finally {
                this.loading = false;
                this.refreshing = false;
            }
        },
    },
    mounted() {
        this.getEpisodeVideos();
    },
    beforeUnmount() {
        this.stopStatusPolling();
    },
};
</script>
<style></style>
