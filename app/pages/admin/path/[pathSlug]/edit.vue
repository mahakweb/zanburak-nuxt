<script setup>
definePageMeta({
  name: "admin-path-edit",
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
            <LoadingComponent v-if="pageLoading" />

            <form v-else id="edit-path-form" @submit.prevent="submit">
                <div class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="PATH_FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="submitLoading"
                        submit-label="تایید و ذخیره تغییرات"
                        submit-loading-label="در حال ذخیره..."
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submit"
                    />

                    <div class="min-w-0 min-h-[420px]">
                        <PathFormSections ref="pathFormSections" :step-id="currentStepId" />
                    </div>
                </div>
            </form>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import AdminFormStepperNav from "@/views/components/admin/AdminFormStepperNav.vue";
import PathFormSections from "@/views/page/admin/path/PathFormSections.vue";
import axiosInstance from "@/store/axiosInstance";
import { pathFormMixin } from "@/views/page/admin/path/pathFormMixin.js";
import { toast } from "vue3-toastify";

export default {
    name: "AdminEditPath",
    components: { AdminMasterPage, LoadingComponent, AdminFormStepperNav, PathFormSections },
    mixins: [pathFormMixin],
    props: {
        pathSlug: { type: String, default: "" },
    },
    mounted() {
        document.title = "ویرایش مسیر یادگیری";
        if (this.resolvedPathSlug) this.getPath();
    },
    methods: {
        async submit() {
            for (const step of [0, 2]) {
                if (!this.validateFormStep(step)) {
                    this.currentStep = step;
                    return;
                }
            }
            const iconValid = this.validateFile(this.icon, "icon");
            const posterValid = this.validateFile(this.poster, "poster");
            const trailerValid = this.validateFile(this.trailer, "trailer");
            if (!iconValid || !posterValid || !trailerValid) {
                this.currentStep = 4;
                return;
            }

            this.submitLoading = true;
            this.errors = {};
            try {
                await axiosInstance.patch(`/admin/path/${this.resolvedPathSlug}/update`, this.buildPayload());
                const willUpload = !!(this.poster || this.icon || this.trailer);
                if (!willUpload) {
                    toast.success("مسیر با موفقیت ویرایش شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") === "rtl",
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    });
                }
                if (this.path_id) {
                    if (this.poster) await this.uploadFile(this.path_id, "poster");
                    if (this.icon) await this.uploadFile(this.path_id, "icon");
                    if (this.trailer) await this.uploadFile(this.path_id, "trailer");
                }
                if (willUpload) {
                    toast.success("مسیر ذخیره شد. آپلود فایل‌ها در حال انجام است.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") === "rtl",
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    });
                }
            } catch (e) {
                this.errors = e?.response?.data?.errors || {};
                this.currentStep = this.mapErrorsToStep();
                console.error("update path failed", e);
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
