<template>
    <div class="flex flex-col items-center justify-center w-full">
        <div class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500" @click="clickable ? triggerFileInput() : null" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @drop.prevent="handleDrop" :class="{ 'border-yellow-400 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-800/20': isDragOver, 'cursor-pointer': clickable }">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg v-if="showIcon" class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16" aria-hidden="true">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p v-if="showDesc" class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span v-if="clickable" class="font-semibold">{{ $t('dropzone.clickToUpload') }}</span>
                    {{ $t('dropzone.dragDrop') }}
                </p>
                <p v-if="showFormats" class="text-xs text-gray-500 dark:text-gray-400">{{ $t('dropzone.allowedFormats', { formats: formatAcceptAttribute, size: formatFileSize(maxSize, "fa") }) }}</p>
            </div>
            <input type="file" :accept="formatAcceptAttribute" class="hidden" :multiple="maxFiles > 1" @change="handleFileSelect" ref="fileInput" />
        </div>
        <div v-if="errors" class="w-full my-2 mb-3 text-red-500 text-xs font-semibold">{{ errors }}</div>
        <div v-if="selectedFiles && selectedFiles.length > 0" class="w-full mt-2 space-y-2">
            <div v-if="bulkUpload && maxFiles > 1 && selectedFiles.length > 1" class="flex items-center justify-end">
                <button @click="uploadAll()" class="h-8 px-4 text-sm font-semibold flex items-center justify-center bg-amber-400 text-gray-800 hover:bg-opacity-80 dark:hover:bg-opacity-80 focus:ring-2 ring-offset-1 dark:ring-offset-1 dark:ring-offset-transparent ring-amber-500/50 dark:ring-amber-500/60 rounded-md">
                    <span class="rtl:mt-0.5">{{ $t('dropzone.uploadAll') }}</span>
                    <svg class="ms-2 w-4 h-4" fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M24.972,12.288C24.608,7.657,20.723,4,16,4c-4.04,0-7.508,2.624-8.627,6.451C4.181,11.559,2,14.583,2,18 c0,4.411,3.589,8,8,8h13c3.86,0,7-3.14,7-7C30,15.851,27.93,13.148,24.972,12.288z M20.924,15.383C20.769,15.756,20.404,16,20,16h-2 v4c0,1.104-0.896,2-2,2s-2-0.896-2-2v-4h-2c-0.404,0-0.769-0.244-0.924-0.617c-0.155-0.374-0.069-0.804,0.217-1.09l4-4 C15.488,10.098,15.744,10,16,10s0.512,0.098,0.707,0.293l4,4C20.993,14.579,21.079,15.009,20.924,15.383z"></path>
                    </svg>
                </button>
            </div>
            <div v-for="(fileData, i) in selectedFiles" :key="i" class="w-full p-2 md:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                        <div class="me-3">
                            <div v-if="isImage(fileData.file)" class="w-12 h-12 overflow-hidden rounded">
                                <img onerror="this.style.display='none'" :src="createObjectUrl(fileData.file)" :alt="fileData.file.name" :title="fileData.file.name" class="w-full h-full object-cover" />
                            </div>
                            <div v-else class="relative w-12 h-12 rounded-lg">
                                <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="800px" width="800px" version="1.1" id="Layer_1" viewBox="0 0 512 512" xml:space="preserve">
                                    <path style="fill: #e2e5e7" d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z" />
                                    <path style="fill: #b0b7bd" d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z" />
                                    <polygon style="fill: #cad1d8" points="480,224 384,128 480,128 " />

                                    <path style="fill: #cad1d8" d="M400,432H96v16h304c8.8,0,16,-7.2,16,-7.2Z" />
                                </svg>
                                <span dir="ltr" class="min-w-[2rem] bg-amber-400 rounded-sm px-1 inline-flex justify-center items-center end-[10px] -mt-[23px] absolute text-xs font-mono font-bold text-black uppercase">{{ fileData.file.name.split(".").pop().toLowerCase() }}</span>
                            </div>
                        </div>
                        <div class="">
                            <p class="text-gray-700 dark:text-gray-200 text-sm font-semibold line-clamp-1">
                                {{ $t('dropzone.fileName') }}: &nbsp; <span dir="ltr">{{ fileData.file.name }}</span>
                            </p>
                            <p class="text-gray-500 dark:text-gray-400 text-xs font-medium mt-1.5">
                                {{ $t('dropzone.fileSize') }}: &nbsp; <span dir="ltr" class="font-sans">{{ formatFileSize(fileData.file.size) }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div v-if="fileData.status === 'uploaded'" class="me-1.5 bg-green-100 hover:bg-green-300 text-green-700 hover:text-green-800 rounded-md text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:bg-green-700/50 dark:hover:bg-green-800/70 dark:text-green-200 dark:hover:text-white">
                            <svg class="w-5 h-5" fill="none" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="M4.63 15.638a1.028 1.028 0 0 1-.79-.37L.36 11.09a1.03 1.03 0 1 1 1.58-1.316l2.535 3.043L9.958 3.32a1.029 1.029 0 0 1 1.783 1.03L5.52 15.122a1.03 1.03 0 0 1-.803.511.89.89 0 0 1-.088.004z"></path>
                            </svg>
                        </div>
                        <button v-else type="button" @click.prevent="uploadFile(fileData.file)" :disabled="fileData.status === 'uploading'" class="disabled:opacity-75 disabled:cursor-not-allowed me-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-gray-900 rounded-md text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-gray-100 dark:hover:text-white">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="M8.93878 8.78981C9.14286 8.78981 9.34694 8.6879 9.44898 8.58599L11.1837 6.8535V13.0701C11.1837 13.4777 11.4898 13.8854 12 13.8854C12.5102 13.8854 12.8163 13.5796 12.8163 13.0701V6.75159L14.551 8.48408C14.7551 8.58599 14.8571 8.6879 15.0612 8.6879C15.2653 8.6879 15.4694 8.58599 15.5714 8.48408C15.8776 8.17834 15.8776 7.66879 15.5714 7.36306L12.5102 4.30573C12.4082 4.20382 12.3061 4.20382 12.3061 4.10191C12.2041 4.10191 12.102 4 12 4C11.898 4 11.7959 4 11.6939 4.10191C11.5918 4.10191 11.4898 4.20382 11.4898 4.30573L8.42857 7.36306C8.12245 7.66879 8.12245 8.17834 8.42857 8.48408C8.53061 8.6879 8.73469 8.78981 8.93878 8.78981Z"></path>
                                <path fill="currentColor" d="M21.1837 12.2548H15.9796L13.6327 14.5987C13.4286 14.8025 13.1224 15.0064 12.9184 15.1083C12.6122 15.2102 12.3061 15.3121 12 15.3121C11.6939 15.3121 11.3878 15.2102 11.0816 15.1083C10.7755 15.0064 10.5714 14.8025 10.3673 14.5987L8.02041 12.2548H2.81633C2.40816 12.2548 2 12.5605 2 13.0701V16.8408C2 18.2675 3.12245 19.4904 4.55102 19.5924C6.69388 19.7962 9.65306 20 12 20C14.3469 20 17.3061 19.7962 19.449 19.5924C20.8776 19.4904 22 18.2675 22 16.8408V13.0701C22 12.7643 21.5918 12.2548 21.1837 12.2548Z"></path>
                            </svg>
                        </button>

                        <button type="button" @click.prevent="removeFileFromDropzone(fileData.file)" class="bg-gray-100 hover:bg-red-200 text-red-600 rounded-md text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:bg-red-700/20 dark:hover:bg-red-700/30 dark:text-red-600 dark:hover:text-red-600">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12 3C11.3742 3 10.753 3.11031 10.1712 3.32613C9.58938 3.54196 9.05585 3.86006 8.60284 4.26577C8.14968 4.67161 7.78526 5.1579 7.53483 5.69935C7.38345 6.02664 7.27593 6.36939 7.21453 6.72006H3.69231C3.30996 6.72006 3 7.03235 3 7.41757C3 7.8028 3.30996 8.11509 3.69231 8.11509H4.84615V12.1622C4.84615 13.6812 5.05998 15.1924 5.48125 16.6508C6.11125 18.8318 7.92504 20.4569 10.1486 20.8324L10.2942 20.857C11.4235 21.0477 12.5765 21.0477 13.7058 20.857L13.8514 20.8324C16.0749 20.4569 17.8887 18.8319 18.5187 16.6509C18.94 15.1924 19.1538 13.6811 19.1538 12.1622V8.11509H20.3077C20.69 8.11509 21 7.8028 21 7.41757C21 7.03235 20.69 6.72006 20.3077 6.72006H16.7855C16.7241 6.36939 16.6165 6.02664 16.4652 5.69935C16.2147 5.1579 15.8503 4.67161 15.3972 4.26577C14.9441 3.86007 14.4106 3.54196 13.8288 3.32613C13.247 3.11031 12.6258 3 12 3ZM10.6496 4.63524C11.0757 4.47716 11.5348 4.39502 12 4.39502C12.4652 4.39502 12.9243 4.47716 13.3504 4.63524C13.7765 4.79331 14.1588 5.02324 14.4773 5.30842C14.7955 5.59346 15.0431 5.92736 15.2101 6.28858C15.2753 6.42941 15.3278 6.57365 15.3678 6.72006L8.63224 6.72006C8.67215 6.57365 8.72473 6.42941 8.78987 6.28858C8.95694 5.92736 9.20445 5.59346 9.52273 5.30842C9.84116 5.02324 10.2235 4.79331 10.6496 4.63524ZM10.1538 11.3701C10.5362 11.3701 10.8462 11.6824 10.8462 12.0677V15.7877C10.8462 16.1729 10.5362 16.4852 10.1538 16.4852C9.7715 16.4852 9.46154 16.1729 9.46154 15.7877V12.0677C9.46154 11.6824 9.7715 11.3701 10.1538 11.3701ZM13.8462 11.3701C14.2285 11.3701 14.5385 11.6824 14.5385 12.0677V15.7877C14.5385 16.1729 14.2285 16.4852 13.8462 16.4852C13.4638 16.4852 13.1538 16.1729 13.1538 15.7877V12.0677C13.1538 11.6824 13.4638 11.3701 13.8462 11.3701Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- progress for upload -->
                <div v-if="fileData.progress > 0" dir="ltr" class="w-full mt-4">
                    <div class="flex justify-between mb-1">
                        <span class="text-xs font-medium text-gray-600 dark:text-gray-100">{{ $t('dropzone.uploadPercentage') }}</span>
                        <span dir="ltr" class="text-xs font-sans font-medium text-gray-600 dark:text-gray-100"
                            ><span v-if="fileData.status === 'uploading'">{{ formatFileSize(fileData.uploadedSize, "en") + "/" + formatFileSize(fileData.totalSize, "en") }}&nbsp;|&nbsp;</span>{{ fileData.progress }}%</span
                        >
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-600">
                        <div class="h-1 rounded-full transition-all ease-out duration-1000" :class="{ 'bg-green-500': fileData.status === 'uploaded', 'bg-rose-600': fileData.status === 'error', 'bg-amber-400': fileData.status === 'added' || fileData.status === 'uploading' }" :style="{ width: fileData.progress + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
    components: {},
    props: {
        showDesc: {
            type: Boolean,
            default: true,            
        },
        showIcon: {
            type: Boolean,
            default: true,
        },
        showFormats :{
            type: Boolean,
            default: true,
        },
        errors: {
            type: Object,
            default: () => {},
        },
        uploadUrl: {
            type: String,
            required: true,
        },
        maxSize: {
            type: Number,
            default: 1048576, // byte
        },
        allowedFormats: {
            type: Array,
            default: () => ["jpg", "jpeg", "png", "pdf", "txt", "rar", "zip"],
        },
        maxFiles: {
            type: Number,
            default: 1,
            required: true,
        },
        bulkUpload: {
            type: Boolean,
            default: true, // true: show upload all btn if selected files > 1
        },
        method: {
            type: String,
            default: "POST",
        },
        headers: {
            type: Object,
            default: () => ({}),
        },
        paramName: {
            type: String,
            default: "file",
        },
        xhrTimeout: {
            type: Number,
            default: 30000, // 30 seconds
        },
        withCredentials: {
            type: Boolean,
            default: false,
        },
        uploadOnDrop: {
            type: Boolean,
            default: false,
        },
        retryOnError: {
            type: Boolean,
            default: true,
        },
        maxRetries: {
            type: Number,
            default: 2,
        },
        parallelUpload: {
            type: Boolean,
            default: true,
        },
        maxParallelUploads: {
            type: Number,
            default: 2,
        },
        clickable: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            selectedFiles: [],
            isDragOver: false,
            uploadRequests: {},
            // uploadedFiles: [],
        };
    },
    computed: {
        formatAcceptAttribute() {
            return this.allowedFormats.map((ext) => `.${ext}`).join(",");
        },
    },
    methods: {
        reset(){
            this.selectedFiles = []
            this.sendUploadedFiles();
        },
        handleDragOver() {
            this.isDragOver = true;
        },
        handleDragLeave() {
            this.isDragOver = false;
        },
        handleDrop(event) {
            this.isDragOver = false;
            const droppedFiles = Array.from(event.dataTransfer.files);
            droppedFiles.forEach((file) => {
                this.addFile(file);
            });
            this.clearFileInput();

            if (this.uploadOnDrop) {
                this.uploadAll();
            }
        },

        handleFileSelect(event) {
            this.isDragOver = false;
            const selectedFiles = Array.from(event.target.files);
            selectedFiles.forEach((file) => {
                this.addFile(file);
            });
            this.clearFileInput();

            if (this.uploadOnDrop) {
                this.uploadAll();
            }
        },

        addFile(file) {
            const allowedFormats = this.allowedFormats;
            const totalSize = this.selectedFiles.reduce((sum, f) => sum + f.file.size, 0);
            const totalFiles = this.selectedFiles.length;

            const fileExtension = file.name.split(".").pop().toLowerCase();
            if (!allowedFormats.includes(fileExtension)) {
                toast.warning(this.$t("dropzone.formatNotAllowed", { format: fileExtension }), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl",
                    bodyClassName: "font-YekanBakh text-black",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }
            if (totalFiles + 1 > this.maxFiles) {
                toast.warning(this.$t("dropzone.maxFilesError", { count: this.maxFiles }), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") === "rtl",
                    bodyClassName: "font-YekanBakh text-black",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }

            if (totalSize + file.size > this.maxSize) {
                toast.warning(this.$t("dropzone.maxSizeError", { size: this.formatFileSize(this.maxSize, "fa") }), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") === "rtl",
                    bodyClassName: "font-YekanBakh text-black",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }

            if (!this.selectedFiles.some((existingFile) => existingFile.file.name === file.name && existingFile.file.size === file.size)) {
                // this.selectedFiles.push(file);
                const fileData = {
                    file: file,
                    progress: 0,
                    uploadedSize: 0,
                    totalSize: file.size,
                    retryCount: 0,
                    status: "added",
                    fileUrl: "",
                };

                this.selectedFiles.push(fileData);
            } else {
                toast.warning(this.$t("dropzone.fileAlreadyAdded", { name: file.name }), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") === "rtl",
                    bodyClassName: "font-YekanBakh text-black",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        },

        isImage(file) {
            return file && file.type.startsWith("image/");
        },
        createObjectUrl(file) {
            if (this.isImage(file)) {
                return URL.createObjectURL(file);
            } else {
                return null;
            }
        },
        formatFileSize(size, language = "en") {
            const units = {
                fa: ["بایت", "کیلوبایت", "مگابایت", "گیگابایت", "ترابایت"],
                en: ["Bytes", "KB", "MB", "GB", "TB"],
            };

            let unitIndex = 0;
            let formattedSize = size;

            while (formattedSize >= 1024 && unitIndex < units[language].length - 1) {
                formattedSize /= 1024;
                unitIndex++;
            }

            return `${parseFloat(formattedSize.toFixed(2))} ${units[language][unitIndex]}`;
        },
        removeFileFromDropzone(file) {
            if (this.findFileInSelectedFiles(file).status === "uploading") this.uploadRequests[file.name].abort();
            this.selectedFiles = this.selectedFiles.filter((item) => item.file !== file);
            this.clearFileInput();
            this.sendUploadedFiles();
        },
        sendUploadedFiles() {
            const uploadedFiles = this.selectedFiles
                .filter((item) => item.status === "uploaded")
                .map((item) => ({
                    name: item.file.name,
                    url: item.fileUrl,
                }));
            this.$emit("uploaded-files", uploadedFiles);
        },
        clearFileInput() {
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = "";
            }
        },
        validateFile(file, maxSize = 10, allowedExtensions = ["jpg", "jpeg", "png", "pdf", "txt", "rar", "zip"]) {
            const errors = [];
            const maxFileSize = maxSize * 1024 * 1024;

            if (file.size > maxFileSize) {
                errors.push(this.$t("dropzone.fileSizeError", { size: maxSize }));
            }

            const fileExtension = file.name.split(".").pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                errors.push(this.$t("dropzone.fileFormatError", { formats: allowedExtensions }));
            }

            return errors;
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        findFileInSelectedFiles(file) {
            return this.selectedFiles.find((item) => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified);
        },
        uploadFile(file) {
            const fileForUpload = this.findFileInSelectedFiles(file);
            if (!fileForUpload || fileForUpload.status === "uploaded") {
                console.error("File not found in selectedFiles or file uploaded.");
                return;
            }
            fileForUpload.status = "uploading";
            const attemptUpload = () => {
                const xhr = new XMLHttpRequest();
                xhr.open(this.method, this.uploadUrl, true);
                xhr.timeout = this.xhrTimeout;
                xhr.withCredentials = this.withCredentials;

                this.uploadRequests[file.name] = xhr;

                for (const [key, value] of Object.entries(this.headers)) {
                    xhr.setRequestHeader(key, value);
                }

                const formData = new FormData();
                formData.append(this.paramName, file);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        fileForUpload.progress = Math.round((event.loaded * 100) / event.total);
                        fileForUpload.uploadedSize = event.loaded;
                        fileForUpload.totalSize = event.total;
                    }
                };

                xhr.send(formData);

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            fileForUpload.status = "uploaded";
                            fileForUpload.fileUrl = response.fileUrl;

                            delete this.uploadRequests[file.name];

                            this.sendUploadedFiles();
                        } catch (error) {
                            console.error("Failed to parse server response:", error);
                            fileForUpload.status = "error";
                            this.handleError(fileForUpload);
                        }
                    } else {
                        fileForUpload.status = "error";
                        this.handleError(fileForUpload);
                        delete this.uploadRequests[file.name];
                    }
                };

                xhr.onerror = () => {
                    fileForUpload.status = "error";
                    this.handleError(fileForUpload);
                    delete this.uploadRequests[file.name];
                };

                xhr.ontimeout = () => {
                    fileForUpload.status = "error";
                    this.handleError(fileForUpload);
                    delete this.uploadRequests[file.name];
                };
            };

            attemptUpload();
        },

        handleError(fileData) {
            if (this.retryOnError) {
                if (fileData.retryCount < this.maxRetries) {
                    fileData.retryCount++;
                    console.log(`تلاش مجدد ${fileData.retryCount} برای آپلود فایل: ${fileData.file.name}`);
                    this.uploadFile(fileData.file);
                } else {
                    fileData.status = "failed";
                    console.log(`حداکثر تعداد تلاش‌ها برای آپلود فایل ${fileData.file.name} به اتمام رسید.`);
                }
            }
        },

        async uploadAll() {
            if (!this.parallelUpload) {
                // one by one
                const queue = [...this.selectedFiles];
                while (queue.length > 0) {
                    const file = queue.shift();
                    if (file.status !== "uploaded") {
                        await new Promise((resolve) => {
                            this.uploadFile(file.file);
                            const checkUploadStatus = setInterval(() => {
                                if (file.status === "uploaded") {
                                    clearInterval(checkUploadStatus);
                                    resolve();
                                } else if (file.status === "error") {
                                    // Move the file to the end of the queue in case of error
                                    queue.push(file);
                                    clearInterval(checkUploadStatus);
                                    resolve();
                                }
                            }, 100);
                        });
                    }
                }
            } else {
                // Parallel upload
                const queue = [...this.selectedFiles];
                const activeUploads = new Set();

                const uploadNext = () => {
                    if (queue.length === 0) return Promise.resolve();

                    const file = queue.shift();
                    if (file.status === "uploaded") {
                        return uploadNext();
                    }

                    const uploadPromise = new Promise((resolve) => {
                        this.uploadFile(file.file);
                        const checkUploadStatus = setInterval(() => {
                            if (file.status === "uploaded") {
                                clearInterval(checkUploadStatus);
                                resolve();
                            } else if (file.status === "error") {
                                // Move the file to the end of the queue in case of error
                                queue.push(file);
                                clearInterval(checkUploadStatus);
                                resolve();
                            }
                        }, 100);
                    });

                    activeUploads.add(uploadPromise);
                    uploadPromise.finally(() => {
                        activeUploads.delete(uploadPromise);
                        uploadNext();
                    });

                    return uploadPromise;
                };

                const uploadManager = Array.from({ length: this.maxParallelUploads }, () => uploadNext());

                await Promise.all(uploadManager);
            }
        },
    },
};
</script>
<style></style>
