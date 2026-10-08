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

            <form v-else id="edit-article-form" @submit.prevent="submit">
                <div class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="ARTICLE_FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="submitLoading"
                        submit-label="ذخیره تغییرات"
                        submit-loading-label="در حال ذخیره..."
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submit"
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
    name: "AdminEditArticle",
    components: { AdminMasterPage, AdminInlineLoading, AdminFormStepperNav, ArticleFormSections },
    mixins: [articleFormMixin],
    props: { id: { type: [String, Number], required: true } },
    async mounted() {
        document.title = "ویرایش مقاله";
        this.articleId = this.id;
        this.pageLoading = true;
        try {
            await this.fetchCategories();
            await this.loadArticle();
        } finally {
            this.pageLoading = false;
        }
    },
    methods: {
        async loadArticle() {
            const res = await axiosInstance.get(`/admin/article/${this.id}`);
            const a = res.data.article;
            this.selectedUser = a.user;
            this.publishRadio = a.publish ? "1" : "0";
            this.form = {
                user_id: a.user_id,
                category_id: a.category_id,
                title: a.title,
                english_title: a.english_title || "",
                excerpt: a.excerpt || "",
                content: a.content || "",
                cover_image: a.cover_image,
                status: a.status,
                publish: !!a.publish,
                is_featured: !!a.is_featured,
                seo_title: a.seo_title || "",
                seo_description: a.seo_description || "",
                meta_keywords: a.meta_keywords || "",
                canonical_url: a.canonical_url || "",
                og_image: a.og_image || "",
                scheduled_at: a.scheduled_at ? a.scheduled_at.slice(0, 16) : null,
                reading_time_minutes: a.reading_time_minutes || null,
            };
            this.tags = (a.tags || []).map((t) => t.name);
        },
        async removeCover() {
            if (!this.form.cover_image) return;
            await axiosInstance.delete(`/admin/article/${this.id}/cover`);
            this.form.cover_image = null;
            showToastSuccess("کاور حذف شد");
        },
        async uploadCover() {
            if (!this.coverFile) return;
            this.coverUploading = true;
            try {
                const formData = new FormData();
                formData.append("file", this.coverFile);
                const res = await axiosInstance.post(`/admin/article/${this.id}/cover`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                this.form.cover_image = res.data.cover_image;
                this.coverFile = null;
            } finally {
                this.coverUploading = false;
            }
        },
        async submit() {
            if (!this.runClientValidation()) {
                showToastError("لطفاً خطاهای فرم را برطرف کنید.");
                this.currentStep = this.mapErrorsToStep();
                return;
            }
            this.submitLoading = true;
            this.errors = {};
            try {
                if (this.coverFile) {
                    await this.uploadCover();
                }
                await axiosInstance.post(`/admin/article/${this.id}/update`, this.buildPayload());
                showToastSuccess("مقاله به‌روزرسانی شد");
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
