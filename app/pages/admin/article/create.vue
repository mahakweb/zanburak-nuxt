<script setup>
definePageMeta({
  name: "admin-article-create",
  middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-articles' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    فهرست مقالات
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </span>
            </router-link>
        </template>

        <div class="min-w-0">
            <AdminInlineLoading v-if="pageLoading" />

            <form v-else id="create-article-form" @submit.prevent="submit">
                <div class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="ARTICLE_FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="submitLoading"
                        submit-label="تأیید و ایجاد مقاله"
                        submit-loading-label="در حال ذخیره..."
                        :show-reset="currentStepId === 'confirm'"
                        reset-label="خالی کردن فرم"
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submit"
                        @reset="resetForm"
                    />

                    <div class="min-w-0 min-h-[420px]">
                        <ArticleFormSections :step-id="currentStepId" />
                    </div>
                </div>
            </form>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import AdminFormStepperNav from "@/views/components/admin/AdminFormStepperNav.vue";
import ArticleFormSections from "@/views/page/admin/articles/ArticleFormSections.vue";
import axiosInstance from "@/store/axiosInstance";
import { articleFormMixin } from "@/views/page/admin/articles/articleFormMixin.js";
import { showToastSuccess, showToastError } from "@/utils/toastConfig";

export default {
    name: "AdminCreateArticle",
    components: { AdminMasterPage, AdminInlineLoading, AdminFormStepperNav, ArticleFormSections },
    mixins: [articleFormMixin],
    async mounted() {
        document.title = "ایجاد مقاله";
        this.pageLoading = true;
        try {
            await this.fetchCategories();
            this.setDefaultAuthor();
        } finally {
            this.pageLoading = false;
        }
    },
    methods: {
        async uploadCover(articleId) {
            if (!this.coverFile) return;
            this.coverUploading = true;
            try {
                const formData = new FormData();
                formData.append("file", this.coverFile);
                await axiosInstance.post(`/admin/article/${articleId}/cover`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } finally {
                this.coverUploading = false;
            }
        },
        async submit() {
            this.setDefaultAuthor();
            if (!this.runClientValidation()) {
                showToastError("لطفاً خطاهای فرم را برطرف کنید.");
                this.currentStep = this.mapErrorsToStep();
                return;
            }
            this.submitLoading = true;
            try {
                const res = await axiosInstance.post("/admin/article/create", this.buildPayload());
                const articleId = res.data.article?.id;
                if (articleId && this.coverFile) {
                    await this.uploadCover(articleId);
                }
                showToastSuccess("مقاله با موفقیت ایجاد شد");
                this.$router.push({ name: "admin-articles" });
            } catch (e) {
                this.errors = e.response?.data?.errors || {};
                if (Object.keys(this.errors).length) {
                    this.currentStep = this.mapErrorsToStep();
                }
                showToastError(e.response?.data?.message || "خطا در ذخیره");
            } finally {
                this.submitLoading = false;
            }
        },
    },
};
</script>

<style>
@media (min-width: 1024px) {
    .admin-form-layout { grid-template-columns: 14rem minmax(0, 1fr); }
}
</style>
