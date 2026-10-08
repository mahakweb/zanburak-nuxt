<script setup>
definePageMeta({
  name: "admin-path-create",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-paths-list' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    فهرست مسیرها
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </span>
            </router-link>
        </template>

        <div class="min-w-0">
            <form id="create-path-form" @submit.prevent="submit">
                <div class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="PATH_FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="submitLoading"
                        submit-label="تایید و ایجاد مسیر"
                        submit-loading-label="در حال ثبت..."
                        :show-reset="currentStepId === 'confirm'"
                        reset-label="خالی کردن فرم"
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submit"
                        @reset="resetForm"
                    />

                    <div class="min-w-0 min-h-[420px]">
                        <PathFormSections ref="pathFormSections" :step-id="currentStepId" />
                    </div>
                </div>
            </form>
        </div>

        <BottomSheetDrawer
            v-model="showSuccessCreateModal"
            :initialHeight="0.7"
            :maxHeight="0.9"
            :minHeight="0.5"
            :autoCloseOnMin="true"
            :closeOnBackdrop="true"
            :lockScroll="true"
            :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
            :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
            :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'"
        >
            <div class="relative p-6 text-center bg-white rounded-lg shadow dark:bg-gray-800">
                <button
                    type="button"
                    @click="showSuccessCreateModal = false"
                    class="absolute top-2.5 end-2.5 focus:outline-none bg-gray-200 text-gray-900 hover:bg-opacity-80 rounded-lg text-sm p-1.5 me-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>

                <div class="rounded-3xl bg-green-400/20 p-2 mb-4 mx-auto w-max">
                    <svg class="w-14 h-14 text-green-400" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.02975 3.3437C10.9834 2.88543 13.0166 2.88543 14.9703 3.3437C17.7916 4.00549 19.9945 6.20842 20.6563 9.02975C21.1146 10.9834 21.1146 13.0166 20.6563 14.9703C19.9945 17.7916 17.7916 19.9945 14.9703 20.6563C13.0166 21.1146 10.9834 21.1146 9.02975 20.6563C6.20842 19.9945 4.0055 17.7916 3.3437 14.9703C2.88543 13.0166 2.88543 10.9834 3.3437 9.02974C4.0055 6.20841 6.20842 4.00549 9.02975 3.3437ZM15.0524 10.4773C15.2689 10.2454 15.2563 9.88195 15.0244 9.6655C14.7925 9.44906 14.4291 9.46159 14.2126 9.6935L11.2678 12.8487L9.77358 11.3545C9.54927 11.1302 9.1856 11.1302 8.9613 11.3545C8.73699 11.5788 8.73699 11.9425 8.9613 12.1668L10.8759 14.0814C10.986 14.1915 11.1362 14.2522 11.2919 14.2495C11.4477 14.2468 11.5956 14.181 11.7019 14.0671L15.0524 10.4773Z" fill="currentColor" />
                    </svg>
                </div>

                <h3 class="mb-3 text-base font-bold text-gray-900 dark:text-white">مسیر با موفقیت ایجاد شد</h3>
                <p class="mb-6 text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                    فایل‌های مسیر در حال آپلود هستند. لطفا صبر کنید تا عملیات آپلود و پردازش تکمیل شود.
                </p>

                <div class="mb-6 space-y-1">
                    <div v-if="icon" class="flex items-center justify-between p-2 md:p-3 bg-gray-100 dark:bg-gray-700 first:rounded-t-lg last:rounded-b-lg">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <div class="w-2 h-2 rounded-full" :class="{ 'bg-yellow-400': uploadStatus.icon === 'uploading', 'bg-green-400': uploadStatus.icon === 'uploaded', 'bg-red-400': uploadStatus.icon === 'error' }" />
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">آیکون</span>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            <template v-if="uploadStatus.icon === 'uploading'">در حال آپلود...</template>
                            <template v-else-if="uploadStatus.icon === 'uploaded'">آپلود شده</template>
                            <template v-else-if="uploadStatus.icon === 'error'">خطا در آپلود</template>
                        </span>
                    </div>
                    <div v-if="poster" class="flex items-center justify-between p-2 md:p-3 bg-gray-100 dark:bg-gray-700 first:rounded-t-lg last:rounded-b-lg">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <div class="w-2 h-2 rounded-full" :class="{ 'bg-yellow-400': uploadStatus.poster === 'uploading', 'bg-green-400': uploadStatus.poster === 'uploaded', 'bg-red-400': uploadStatus.poster === 'error' }" />
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">پوستر</span>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            <template v-if="uploadStatus.poster === 'uploading'">در حال آپلود...</template>
                            <template v-else-if="uploadStatus.poster === 'uploaded'">آپلود شده</template>
                            <template v-else-if="uploadStatus.poster === 'error'">خطا در آپلود</template>
                        </span>
                    </div>
                    <div v-if="trailer" class="flex items-center justify-between p-2 md:p-3 bg-gray-100 dark:bg-gray-700 first:rounded-t-lg last:rounded-b-lg">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <div class="w-2 h-2 rounded-full" :class="{ 'bg-yellow-400': uploadStatus.trailer === 'uploading', 'bg-green-400': uploadStatus.trailer === 'uploaded', 'bg-red-400': uploadStatus.trailer === 'error' }" />
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">تریلر</span>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            <template v-if="uploadStatus.trailer === 'uploading'">در حال آپلود...</template>
                            <template v-else-if="uploadStatus.trailer === 'uploaded'">آپلود شده</template>
                            <template v-else-if="uploadStatus.trailer === 'error'">خطا در آپلود</template>
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    @click="showSuccessCreateModal = false"
                    class="px-6 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700"
                >
                    بستن
                </button>
            </div>
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminFormStepperNav from "@/views/components/admin/AdminFormStepperNav.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import PathFormSections from "@/views/page/admin/path/PathFormSections.vue";
import axiosInstance from "@/store/axiosInstance";
import { pathFormMixin } from "@/views/page/admin/path/pathFormMixin.js";

export default {
    name: "AdminCreatePath",
    components: { AdminMasterPage, AdminFormStepperNav, BottomSheetDrawer, PathFormSections },
    mixins: [pathFormMixin],
    mounted() {
        document.title = "ایجاد مسیر یادگیری";
    },
    methods: {
        async submit() {
            for (const step of [0, 2, 4]) {
                if (!this.validateFormStep(step)) {
                    this.currentStep = step;
                    return;
                }
            }
            if (!this.validateFile(this.trailer, "trailer")) {
                this.currentStep = 4;
                return;
            }

            this.submitLoading = true;
            this.errors = {};
            try {
                const res = await axiosInstance.post("/admin/path/create", this.buildPayload());
                if (res.data?.message) {
                    this.path_id = res.data?.path?.id;
                    this.showSuccessCreateModal = true;
                    await this.uploadFile(this.path_id, "poster");
                    await this.uploadFile(this.path_id, "icon");
                    await this.uploadFile(this.path_id, "trailer");
                }
            } catch (e) {
                this.errors = e?.response?.data?.errors || {};
                this.currentStep = this.mapErrorsToStep();
                console.error("create path failed", e);
            } finally {
                this.submitLoading = false;
            }
        },
    },
};
</script>

<style>
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
@media (min-width: 1024px) {
    .admin-form-layout { grid-template-columns: 14rem minmax(0, 1fr); }
}
</style>
