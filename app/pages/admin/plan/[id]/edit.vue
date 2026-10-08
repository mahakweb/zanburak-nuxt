<script setup>
definePageMeta({
  name: "admin-plan-edit",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-plans-list' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    لیست پلن‌ها
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </span>
            </router-link>
        </template>

        <div class="min-w-0">
            <LoadingComponent v-if="pageLoading" />

            <form v-else id="edit-plan-form" @submit.prevent="submitPlan">
                <div class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="PLAN_FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="submitLoading"
                        submit-label="تایید و ذخیره تغییرات"
                        :show-reset="currentStepId === 'confirm'"
                        reset-label="بازگردانی داده‌ها"
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submitPlan"
                        @reset="loadPlan"
                    />

                    <div class="min-w-0 min-h-[420px]">
                        <PlanFormSections :step-id="currentStepId" />
                    </div>
                </div>
            </form>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from '@/views/page/admin/layouts/AdminMasterPage.vue';
import AdminFormStepperNav from '@/views/components/admin/AdminFormStepperNav.vue';
import LoadingComponent from '@/views/components/LoadingComponent.vue';
import PlanFormSections from '@/views/page/admin/plan/PlanFormSections.vue';
import { planFormMixin } from '@/views/page/admin/plan/planFormMixin.js';

export default {
    name: 'AdminEditPlan',
    components: { AdminMasterPage, AdminFormStepperNav, LoadingComponent, PlanFormSections },
    mixins: [planFormMixin],
    props: ['id'],
    computed: {
        isEditMode() {
            return true;
        },
        planId() {
            return this.id;
        },
    },
    mounted() {
        document.title = 'ویرایش پلن';
        this.loadPlan();
    },
};
</script>

<style>
.admin-form-section {
    @apply rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 p-4 md:p-5 shadow-sm;
}
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
