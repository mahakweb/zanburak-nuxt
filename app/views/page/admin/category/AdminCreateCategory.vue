<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-categories-list' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    فهرست دسته‌بندی‌ها
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </span>
            </router-link>
        </template>

        <div class="min-w-0">
            <LoadingComponent v-if="pageLoading" />

            <form v-else id="create-category-form" @submit.prevent="submit">
                <div class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="CATEGORY_FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="submitLoading"
                        submit-label="تایید و ایجاد دسته‌بندی"
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
                        <CategoryFormSections ref="categoryFormSections" :step-id="currentStepId" />
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
import CategoryFormSections from "@/views/page/admin/category/CategoryFormSections.vue";
import axiosInstance from "@/store/axiosInstance";
import { categoryFormMixin } from "@/views/page/admin/category/categoryFormMixin.js";
import { showToastSuccess } from "@/utils/toastConfig";

export default {
    name: "AdminCreateCategory",
    components: { AdminMasterPage, LoadingComponent, AdminFormStepperNav, CategoryFormSections },
    mixins: [categoryFormMixin],
    async mounted() {
        document.title = "ایجاد دسته‌بندی";
        this.pageLoading = true;
        await this.getInitData();
        this.pageLoading = false;
    },
    methods: {
        async submit() {
            for (const step of [0, 2]) {
                if (!this.validateFormStep(step)) {
                    this.currentStep = step;
                    return;
                }
            }
            if (!this.validateFile(this.icon, "icon")) {
                this.currentStep = 2;
                return;
            }

            this.submitLoading = true;
            this.errors = {};
            try {
                const response = await axiosInstance.post("admin/category/create", this.buildPayload());
                const categoryId = response.data?.category?.id;
                this.category_id = categoryId;

                let message = "دسته‌بندی با موفقیت ایجاد شد.";
                if (this.icon) message += " منتظر آپلود آیکون باشید.";
                showToastSuccess(message);

                if (this.icon && categoryId) {
                    this.currentStep = 2;
                    await this.$nextTick();
                    document.getElementById("icon-section")?.scrollIntoView({ behavior: "smooth" });
                    await this.uploadFile(categoryId, "icon");
                    if (this.uploadStatus.icon === "uploaded") {
                        showToastSuccess("آیکون با موفقیت آپلود شد.");
                    }
                }
            } catch (error) {
                this.errors = error?.response?.data?.errors || {};
                this.currentStep = this.mapErrorsToStep();
                console.error("category creation failed:", this.errors);
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
