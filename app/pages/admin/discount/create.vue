<script setup>
definePageMeta({
  name: "admin-discount-create",
  middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-discounts-list' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    لیست کدهای تخفیف
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </span>
            </router-link>
        </template>

        <div class="min-w-0">
            <LoadingComponent v-if="pageLoading" />

            <form v-else id="create-discount-form" @submit.prevent="submit">
                <div class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="DISCOUNT_FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="submitLoading"
                        submit-label="تایید و ایجاد کد تخفیف"
                        :show-reset="currentStepId === 'confirm'"
                        reset-label="خالی کردن فرم"
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submit"
                        @reset="resetForm"
                    />

                    <div class="min-w-0 min-h-[420px]">
                        <DiscountFormSections :step-id="currentStepId" />
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
import DiscountFormSections from "@/views/page/admin/discount/DiscountFormSections.vue";
import axiosInstance from "@/store/axiosInstance";
import { discountFormMixin } from "@/views/page/admin/discount/discountFormMixin.js";
import { showToastSuccess, showToastError } from "@/utils/toastConfig";

export default {
    name: "AdminCreateDiscount",
    components: { AdminMasterPage, LoadingComponent, AdminFormStepperNav, DiscountFormSections },
    mixins: [discountFormMixin],
    mounted() {
        document.title = "ایجاد کد تخفیف جدید";
        this.setupClickOutsideHandler();
    },
    beforeUnmount() {
        this.teardownClickOutsideHandler();
    },
    methods: {
        async submit() {
            if (!this.validateFormStep(0)) {
                this.currentStep = 0;
                return;
            }
            this.submitLoading = true;
            this.errors = null;
            try {
                await axiosInstance.post("admin/discount/create", this.prepareFormData());
                showToastSuccess("کد تخفیف با موفقیت ایجاد شد.");
                this.$router.push({ name: "admin-discounts-list" });
            } catch (error) {
                if (error.response?.data?.errors) {
                    this.errors = error.response.data.errors;
                    this.currentStep = this.mapErrorsToStep();
                } else {
                    showToastError("خطا در ایجاد کد تخفیف.");
                }
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
