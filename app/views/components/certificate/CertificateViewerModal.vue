<template>
    <BottomSheetDrawer
        v-model="open"
        :initialHeight="0.92"
        :maxHeight="0.96"
        :minHeight="0.6"
        :fitContent="false"
        :autoCloseOnMin="true"
        :closeOnBackdrop="true"
        :lockScroll="true"
        :draggable="true"
        backdropZClass="z-[2000000010]"
        panelZClass="z-[2000000020]"
        :panelClass="'bg-white dark:bg-gray-950 border-t border-gray-200/80 dark:border-gray-800/80 rounded-t-[1.75rem] shadow-[0_-20px_60px_rgba(15,23,42,0.28)]'"
        :contentClass="'px-4 pb-4 flex flex-col min-h-0 h-full'"
        :backdropClass="'bg-gray-900/55 backdrop-blur-md'"
        @update:modelValue="onOpenChange"
    >
        <CertificatePngGenerator v-if="!sharedGenerator" ref="localGenerator" />

        <div class="shrink-0 flex items-start justify-between gap-3 mb-3">
            <div class="min-w-0">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">
                    {{ mode === 'download' ? 'دانلود گواهینامه' : 'مشاهده گواهینامه' }}
                </p>
                <h3 class="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">{{ courseTitle }}</h3>
                <p v-if="serial" class="text-[11px] text-gray-400 font-mono mt-1" dir="ltr">{{ serial }}</p>
            </div>
            <button type="button" @click="close"
                class="shrink-0 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <section class="shrink-0 mb-3 rounded-2xl border border-amber-200/50 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/90 via-white to-white dark:from-amber-500/10 dark:via-gray-900 dark:to-gray-900 p-3">
            <div class="flex items-center justify-between gap-2 mb-2">
                <div>
                    <h4 class="text-xs font-bold text-gray-900 dark:text-white">انتخاب قالب گواهینامه</h4>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">فقط قالب‌های منتشرشده توسط ادمین نمایش داده می‌شوند</p>
                </div>
                <span v-if="savingTemplate" class="text-[10px] font-medium text-amber-600 dark:text-amber-400 shrink-0">در حال ذخیره...</span>
            </div>
            <CertificateTemplatePicker
                v-model="selectedTemplateId"
                :templates="templates"
                :loading="templatesLoading"
                :show-hint="false"
                :show-manage-link="false"
                :required="true"
                @update:modelValue="onTemplateChange"
            />
        </section>

        <section class="flex-1 min-h-0 overflow-y-auto custom-scrollbar rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60">
            <div class="flex items-center justify-center min-h-[200px] p-3 md:p-5">
                <CertificateGeneratingLoader v-if="loading"
                    :title="$t('cert.view.generating')"
                    :subtitle="$t('cert.view.generatingHint')" />

                <p v-else-if="error" class="text-sm text-rose-500 text-center px-4">{{ error }}</p>

                <div v-else-if="pngUrl" class="cert-paper-wrap w-full flex flex-col items-center">
                    <div class="cert-paper-shadow max-w-full">
                        <img
                            :src="pngUrl"
                            :alt="courseTitle"
                            class="block max-w-full h-auto w-auto mx-auto"
                            draggable="false"
                        />
                    </div>
                    <p class="text-center text-[10px] text-gray-400 mt-3 pb-1">
                        {{ $t('cert.view.paperSize') }}
                    </p>
                </div>

                <p v-else-if="!templatesLoading && !templates.length" class="text-xs text-gray-500 text-center px-4">
                    قالب منتشرشده‌ای برای انتخاب وجود ندارد.
                </p>
            </div>
        </section>

        <div v-if="mode === 'download'" class="shrink-0 pt-3 mt-1 border-t border-gray-100 dark:border-gray-800">
            <button
                type="button"
                :disabled="!pngUrl || loading || savingTemplate || downloading"
                @click="handleDownload"
                class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white text-sm font-bold px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <svg v-if="!downloading" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 22C10.1144 22 9.17157 22 8.58579 21.4142C8 20.8284 8 19.8856 8 18C8 16.1144 8 15.1716 8.58579 14.5858C9.17157 14 10.1144 14 12 14C13.8856 14 14.8284 14 15.4142 14.5858C16 15.1716 16 16.1144 16 18C16 19.8856 16 20.8284 15.4142 21.4142C14.8284 22 13.8856 22 12 22ZM13.8047 18.9158L12.4714 20.2492C12.2111 20.5095 11.7889 20.5095 11.5286 20.2492L10.1953 18.9158C9.93491 18.6555 9.93491 18.2334 10.1953 17.973C10.4556 17.7127 10.8777 17.7127 11.1381 17.973L11.3333 18.1683V16.2222C11.3333 15.854 11.6318 15.5556 12 15.5556C12.3682 15.5556 12.6667 15.854 12.6667 16.2222V18.1683L12.8619 17.973C13.1223 17.7127 13.5444 17.7127 13.8047 17.973C14.0651 18.2334 14.0651 18.6555 13.8047 18.9158Z"
                        fill="currentColor" />
                    <path
                        d="M6.50001 18L6.50001 17.9105C6.49991 17.0449 6.49981 16.2512 6.58661 15.6056C6.6822 14.8946 6.90709 14.1432 7.52514 13.5251C8.14319 12.9071 8.89464 12.6822 9.6056 12.5866C10.2512 12.4998 11.0449 12.4999 11.9105 12.5H12.0895C12.9551 12.4999 13.7488 12.4998 14.3944 12.5866C15.1054 12.6822 15.8568 12.9071 16.4749 13.5251C17.0929 14.1432 17.3178 14.8946 17.4134 15.6056C17.4989 16.2417 17.5001 17.0215 17.5 17.8722C20.0726 17.3221 22 15.0599 22 12.3529C22 9.88113 20.393 7.78024 18.1551 7.01498C17.8371 4.19371 15.4159 2 12.4762 2C9.32028 2 6.7619 4.52827 6.7619 7.64706C6.7619 8.33687 6.88706 8.9978 7.11616 9.60887C6.8475 9.55673 6.56983 9.52941 6.28571 9.52941C3.91878 9.52941 2 11.4256 2 13.7647C2 16.1038 3.91878 18 6.28571 18L6.50001 18Z"
                        fill="currentColor" />
                </svg>
                <svg v-else class="w-4 h-4 shrink-0 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span>{{ downloading ? $t('panel.certifications.downloading') : $t('panel.certifications.download') }}</span>
            </button>
        </div>
    </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import CertificateGeneratingLoader from '@/views/components/certificate/CertificateGeneratingLoader.vue';
import CertificatePngGenerator from '@/views/components/certificate/CertificatePngGenerator.vue';
import CertificateTemplatePicker from '@/views/components/certificate/CertificateTemplatePicker.vue';
import { listPanelCertificateTemplates, updatePanelCertificateTemplate } from '@/services/certificate.service';
import { downloadDataUrl, revokeObjectUrl } from '@/utils/certificatePngCapture';

export default {
    components: {
        BottomSheetDrawer,
        CertificateGeneratingLoader,
        CertificatePngGenerator,
        CertificateTemplatePicker,
    },
    emits: ['update:modelValue', 'png-ready', 'template-updated', 'downloaded'],
    props: {
        modelValue: { type: Boolean, default: false },
        mode: { type: String, default: 'view' }, // view | download
        uuid: { type: String, default: null },
        courseTitle: { type: String, default: '' },
        serial: { type: String, default: '' },
        templateId: { type: [Number, String, null], default: null },
        sharedGenerator: { type: Object, default: null },
    },
    data() {
        return {
            loading: false,
            error: null,
            pngUrl: null,
            templates: [],
            templatesLoading: false,
            selectedTemplateId: null,
            savingTemplate: false,
            previewTemplateId: null,
            downloading: false,
        };
    },
    computed: {
        open: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            },
        },
        downloadName() {
            return `certificate-${this.serial || this.uuid}.png`;
        },
    },
    watch: {
        modelValue(open) {
            if (open && this.uuid) {
                this.bootstrap();
            } else if (!open) {
                this.cleanup();
            }
        },
    },
    beforeUnmount() {
        this.cleanup();
    },
    methods: {
        onOpenChange(value) {
            if (!value) this.cleanup();
        },
        close() {
            this.open = false;
        },
        cleanup() {
            revokeObjectUrl(this.pngUrl);
            this.pngUrl = null;
            this.error = null;
            this.previewTemplateId = null;
            this.downloading = false;
        },
        async bootstrap() {
            this.selectedTemplateId = this.templateId ? Number(this.templateId) : null;
            this.previewTemplateId = this.selectedTemplateId;
            await this.loadTemplates();

            if (!this.templates.length) {
                this.error = 'قالب منتشرشده‌ای برای انتخاب وجود ندارد.';
                return;
            }

            if (!this.selectedTemplateId || !this.templates.some((t) => Number(t.id) === Number(this.selectedTemplateId))) {
                const def = this.templates.find((t) => t.is_default) || this.templates[0];
                this.selectedTemplateId = def?.id ?? null;
                this.previewTemplateId = this.selectedTemplateId;
            }

            await this.load();
        },
        async loadTemplates() {
            this.templatesLoading = true;
            try {
                const res = await listPanelCertificateTemplates();
                this.templates = (res.templates || []).filter((t) => t.is_active !== false);
            } catch {
                this.templates = [];
            } finally {
                this.templatesLoading = false;
            }
        },
        async onTemplateChange(templateId) {
            if (!templateId || !this.uuid) return;
            if (Number(templateId) === Number(this.previewTemplateId) && this.pngUrl) return;

            this.savingTemplate = true;
            try {
                await updatePanelCertificateTemplate(this.uuid, templateId);
                this.previewTemplateId = Number(templateId);
                this.$emit('template-updated', { uuid: this.uuid, certificate_template_id: templateId });
                await this.load();
            } catch {
                this.error = this.$t('cert.view.loadError');
            } finally {
                this.savingTemplate = false;
            }
        },
        async load() {
            if (!this.previewTemplateId && !this.selectedTemplateId) return;

            this.loading = true;
            revokeObjectUrl(this.pngUrl);
            this.pngUrl = null;
            this.error = null;
            try {
                const generator = this.sharedGenerator || this.$refs.localGenerator;
                const templateId = this.previewTemplateId || this.selectedTemplateId;
                this.pngUrl = await generator.generate(this.uuid, { templateId });
                this.$emit('png-ready', { uuid: this.uuid, dataUrl: this.pngUrl, templateId });
            } catch {
                this.error = this.$t('cert.view.loadError');
            } finally {
                this.loading = false;
            }
        },
        async handleDownload() {
            if (!this.pngUrl || this.downloading) return;
            this.downloading = true;
            try {
                downloadDataUrl(this.pngUrl, this.downloadName);
                this.$emit('downloaded', { uuid: this.uuid, templateId: this.previewTemplateId || this.selectedTemplateId });
            } finally {
                this.downloading = false;
            }
        },
    },
};
</script>

<style scoped>
.cert-paper-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
.cert-paper-shadow {
    box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.08),
        0 20px 40px -12px rgb(0 0 0 / 0.18);
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
    line-height: 0;
}
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
