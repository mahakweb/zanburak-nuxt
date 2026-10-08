<template>
    <AdminMasterPage>
        <CertificatePngGenerator ref="previewGenerator" />

        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-certificate-templates' }" :class="btnSecondary">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center gap-1.5">
                        {{ $t('cert.admin.back') }}
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </span>
                </span>
            </router-link>
            <button type="submit" form="certificate-template-form" :disabled="saving || loading" :class="btnSecondary">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center gap-1.5">
                        {{ saving ? $t('cert.admin.saving') : $t('cert.admin.save') }}
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                </span>
            </button>
        </template>

        <div class="min-w-0">
            <LoadingComponent v-if="loading" />

            <form v-else id="certificate-template-form" @submit.prevent="submit">
                <!-- 2-column: stepper | content -->
                <div class="grid grid-cols-1 gap-4 items-start cert-form-layout">

                    <!-- Vertical stepper -->
                    <aside class="lg:sticky lg:top-4 space-y-2">
                        <nav class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-2 shadow-sm">
                            <ol class="space-y-0.5">
                                <li v-for="(step, index) in visibleSteps" :key="step.id">
                                    <button
                                        type="button"
                                        @click="goToMainStep(index)"
                                        class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-start transition-all"
                                        :class="mainStepButtonClass(index)"
                                    >
                                        <span class="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold" :class="mainStepIndexClass(index)">
                                            <svg v-if="index < currentStep" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <svg v-else-if="step.id === 'confirm'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span v-else>{{ index + 1 }}</span>
                                        </span>
                                        <span class="min-w-0">
                                            <span class="block text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{{ step.label }}</span>
                                            <span class="block text-[10px] text-gray-400 truncate">{{ step.hint }}</span>
                                        </span>
                                    </button>

                                    <!-- Design sub-steps -->
                                    <ul v-if="step.id === 'design' && currentStepId === 'design'" class="mt-0.5 mb-1 me-1 border-s-2 border-yellow-400/40 ps-2 space-y-0.5">
                                        <li v-for="(sub, subIndex) in designSubSteps" :key="sub.id">
                                            <button
                                                type="button"
                                                @click="designSubStep = subIndex"
                                                class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-start text-[11px] font-medium transition-colors"
                                                :class="designSubStep === subIndex
                                                    ? 'bg-yellow-400/20 text-gray-900 dark:text-yellow-100'
                                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'"
                                            >
                                                <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="designSubStep === subIndex ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'"></span>
                                                {{ sub.label }}
                                            </button>
                                        </li>
                                    </ul>

                                    <!-- Font sub-steps -->
                                    <ul v-if="step.id === 'fonts' && currentStepId === 'fonts'" class="mt-0.5 mb-1 me-1 border-s-2 border-yellow-400/40 ps-2 space-y-0.5">
                                        <li v-for="(sub, subIndex) in fontSubSteps" :key="sub.id">
                                            <button
                                                type="button"
                                                @click="fontSubStep = subIndex"
                                                class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-start text-[11px] font-medium transition-colors"
                                                :class="fontSubStep === subIndex
                                                    ? 'bg-yellow-400/20 text-gray-900 dark:text-yellow-100'
                                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'"
                                            >
                                                <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="fontSubStep === subIndex ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'"></span>
                                                {{ sub.label }}
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </ol>

                            <!-- Step nav -->
                            <div class="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800 px-1">
                                <button
                                    type="button"
                                    @click="prevStep"
                                    :disabled="isFirstSubStep"
                                    title="مرحله قبل"
                                    class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <span class="text-[10px] font-medium text-gray-400 text-center leading-tight px-1">{{ footerStepLabel }}</span>
                                <button
                                    type="button"
                                    @click="nextStep"
                                    :disabled="isLastSubStep"
                                    title="مرحله بعد"
                                    class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Save on confirm step -->
                            <button
                                v-if="currentStepId === 'confirm'"
                                type="submit"
                                :disabled="saving"
                                class="w-full mt-2 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 transition-colors"
                            >
                                <svg v-if="!saving" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {{ saving ? $t('cert.admin.saving') : 'تایید و ذخیره' }}
                            </button>
                        </nav>
                    </aside>

                    <!-- Main content -->
                    <div class="min-w-0 min-h-[420px]">
                        <!-- Basic -->
                        <section v-show="currentStepId === 'basic'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 space-y-5 shadow-sm">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات پایه</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">نام، توضیحات و تنظیمات کلی قالب</p>
                            </div>
                            <div>
                                <label class="field-label">{{ $t('cert.admin.templateName') }}</label>
                                <input v-model="form.name" required class="form-input" />
                            </div>
                            <div>
                                <label class="field-label">{{ $t('cert.admin.description') }}</label>
                                <textarea v-model="form.description" rows="3" class="form-input resize-none"></textarea>
                            </div>
                            <div>
                                <label class="field-label">{{ $t('cert.admin.orientation') }}</label>
                                <select v-model="form.orientation" class="form-input" @change="onOrientationChange">
                                    <option value="landscape">{{ $t('cert.admin.landscape') }}</option>
                                    <option value="portrait">{{ $t('cert.admin.portrait') }}</option>
                                </select>
                            </div>
                            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                                <div class="flex items-center justify-between gap-3 px-4 py-3">
                                    <div>
                                        <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ $t('cert.admin.active') }}</p>
                                        <p class="text-[11px] text-gray-400 mt-0.5">قابل استفاده در صدور</p>
                                    </div>
                                    <AdminToggleSwitch v-model="form.is_active" />
                                </div>
                                <div class="flex items-center justify-between gap-3 px-4 py-3">
                                    <div>
                                        <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ $t('cert.admin.default') }}</p>
                                        <p class="text-[11px] text-gray-400 mt-0.5">قالب پیش‌فرض دوره‌ها</p>
                                    </div>
                                    <AdminToggleSwitch v-model="form.is_default" />
                                </div>
                            </div>
                        </section>

                        <!-- Assets -->
                        <section v-show="currentStepId === 'assets'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 space-y-5 shadow-sm">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('cert.admin.assets') }}</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">پس‌زمینه، لوگو و امضا</p>
                            </div>
                            <div v-if="!isEdit" class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/40 p-6 text-center">
                                <p class="text-sm text-gray-600 dark:text-gray-400">ابتدا قالب را ذخیره کنید، سپس فایل‌ها را آپلود کنید.</p>
                            </div>
                            <template v-else>
                                <div v-for="asset in assetTypes" :key="asset.type" class="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
                                    <div class="flex items-center justify-between gap-3">
                                        <label class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ asset.label }}</label>
                                        <img v-if="previewUrl(asset.field)" :src="previewUrl(asset.field)" class="h-12 max-w-[120px] rounded-lg border object-contain bg-white dark:bg-gray-800 p-1" alt="" />
                                    </div>
                                    <label class="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 cursor-pointer transition-colors">
                                        <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        {{ uploadingType === asset.type ? $t('cert.admin.uploading') : 'انتخاب فایل' }}
                                        <input type="file" accept="image/*" class="sr-only" :disabled="uploadingType === asset.type" @change="e => uploadAsset(asset.type, e)" />
                                    </label>
                                </div>
                                <p v-if="uploadError" class="text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">{{ uploadError }}</p>
                                <p v-if="uploadSuccess" class="text-xs bg-yellow-400/20 px-3 py-2 rounded-lg">{{ uploadSuccess }}</p>
                            </template>
                        </section>

                        <!-- Design (sub-panels) -->
                        <div v-show="currentStepId === 'design'" class="space-y-3">
                            <section v-if="activeDesignPanel === 'visual'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-4 shadow-sm">
                                <div class="flex flex-wrap gap-1.5 mb-3">
                                    <span v-for="p in placeholders" :key="p.key" class="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">{{ '{' + p.key + '}' }}</span>
                                </div>
                            </section>
                            <CertificateLayoutEditor
                                v-model:layout="form.layout"
                                v-model:settings="form.settings"
                                v-model:canvasWidth="form.canvas_width"
                                v-model:canvasHeight="form.canvas_height"
                                :visual-render="visualRender"
                                :panel="activeDesignPanel"
                            />
                        </div>

                        <!-- Fonts -->
                        <section v-show="currentStepId === 'fonts'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 space-y-4 shadow-sm">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ activeFontGroup?.label || $t('cert.admin.fonts') }}</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('cert.admin.fontsBundledHint') }}</p>
                            </div>
                            <div v-if="!activeFontGroup?.items?.length" class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
                                <p class="text-sm text-gray-500">فونتی در این دسته یافت نشد.</p>
                            </div>
                            <div v-else class="space-y-2">
                                <div v-for="font in activeFontGroup.items" :key="font.slug"
                                    class="flex flex-wrap items-center gap-3 py-3 px-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ font.name }}</span>
                                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                                        :class="font.available ? 'bg-yellow-400/20 text-gray-800' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'">
                                        {{ font.available ? $t('cert.admin.fontReady') : $t('cert.admin.fontMissing') }}
                                    </span>
                                    <label class="ms-auto inline-flex h-8 px-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[11px] font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 items-center">
                                        {{ uploadingFont === font.slug ? $t('cert.admin.uploading') : 'آپلود' }}
                                        <input type="file" accept=".woff,.woff2,.ttf,.otf" class="sr-only" :disabled="uploadingFont === font.slug" @change="e => uploadFont(font.slug, e)" />
                                    </label>
                                </div>
                            </div>
                            <p v-if="fontUploadError" class="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">{{ fontUploadError }}</p>
                        </section>

                        <!-- Preview (dedicated step) -->
                        <section v-show="currentStepId === 'preview'" class="space-y-4">
                            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm">
                                <div class="mb-4">
                                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('cert.admin.preview') }}</h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">نمای نهایی گواهینامه قبل از ذخیره</p>
                                </div>
                                <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 p-4 min-h-[280px] flex items-center justify-center">
                                    <div v-if="previewLoading" class="text-center">
                                        <p class="text-sm text-gray-400">{{ $t('cert.view.generating') }}</p>
                                    </div>
                                    <img v-else-if="isEdit && previewPngUrl" :src="previewPngUrl" class="max-w-full h-auto shadow-lg rounded-lg" alt="preview" />
                                    <div v-else-if="visualRender" class="w-full max-w-2xl mx-auto">
                                        <CertificateRenderer
                                            :render="visualRender"
                                            :width="form.canvas_width"
                                            :height="form.canvas_height"
                                            class="w-full h-auto rounded-lg shadow-md"
                                        />
                                        <p v-if="!isEdit" class="text-[11px] text-gray-400 text-center mt-3">پس از ذخیره، پیش‌نمایش PNG کامل در دسترس است</p>
                                    </div>
                                    <p v-else class="text-sm text-gray-400">پیش‌نمایش در دسترس نیست</p>
                                </div>
                            </div>
                        </section>

                        <!-- Confirm & save -->
                        <section v-show="currentStepId === 'confirm'" class="space-y-4">
                            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm">
                                <div class="flex items-start gap-3 mb-4">
                                    <div class="shrink-0 w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                                        <svg class="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="text-sm font-bold text-gray-900 dark:text-white">تایید و ذخیره</h3>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">اطلاعات را بررسی کنید و قالب را ثبت نهایی کنید</p>
                                    </div>
                                </div>

                                <dl class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5">
                                    <div class="rounded-lg bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
                                        <dt class="text-gray-400">نام</dt>
                                        <dd class="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 truncate">{{ form.name || '—' }}</dd>
                                    </div>
                                    <div class="rounded-lg bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
                                        <dt class="text-gray-400">جهت</dt>
                                        <dd class="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                                            {{ form.orientation === 'portrait' ? $t('cert.admin.portrait') : $t('cert.admin.landscape') }}
                                        </dd>
                                    </div>
                                    <div class="rounded-lg bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
                                        <dt class="text-gray-400">وضعیت</dt>
                                        <dd class="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{{ form.is_active ? $t('cert.admin.active') : $t('cert.admin.inactive') }}</dd>
                                    </div>
                                    <div class="rounded-lg bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
                                        <dt class="text-gray-400">پیش‌فرض</dt>
                                        <dd class="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{{ form.is_default ? 'بله' : 'خیر' }}</dd>
                                    </div>
                                </dl>

                                <button
                                    type="submit"
                                    :disabled="saving"
                                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-8 rounded-xl text-sm font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    <svg v-if="!saving" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {{ saving ? $t('cert.admin.saving') : 'تایید و ذخیره قالب' }}
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </form>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from '@/views/page/admin/layouts/AdminMasterPage.vue';
import LoadingComponent from '@/views/components/LoadingComponent.vue';
import AdminToggleSwitch from '@/views/components/admin/AdminToggleSwitch.vue';
import CertificateLayoutEditor from '@/views/components/certificate/CertificateLayoutEditor.vue';
import CertificateRenderer from '@/views/components/certificate/CertificateRenderer.vue';
import CertificatePngGenerator from '@/views/components/certificate/CertificatePngGenerator.vue';
import {
    getCertificateTemplate, createCertificateTemplate, updateCertificateTemplate,
    uploadCertificateTemplateAsset, listCertificateFonts, uploadCertificateFont,
    CERTIFICATE_PLACEHOLDERS,
} from '@/services/certificate.service';
import { showToastSuccess, showToastError } from '@/utils/toastConfig';
import config from '@/store/config';
import { normalizeCertificateAssetUrl } from '@/utils/certificatePngCapture';
import qrcode from 'qrcode-generator';
import { canvasForOrientation, mergeLayout } from '@/constants/certificateLayout';

const BTN_SECONDARY = 'flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 dark:bg-gray-900 dark:text-gray-100 dark:shadow-none dark:border dark:border-gray-700 dark:hover:bg-gray-800';

const STEPS = [
    { id: 'basic', label: 'اطلاعات پایه', hint: 'نام و تنظیمات' },
    { id: 'assets', label: 'فایل‌ها', hint: 'تصاویر قالب' },
    { id: 'design', label: 'طراحی', hint: 'چیدمان و رنگ' },
    { id: 'fonts', label: 'فونت‌ها', hint: 'آپلود فونت' },
    { id: 'preview', label: 'پیش‌نمایش', hint: 'مشاهده نهایی' },
    { id: 'confirm', label: 'تایید و ذخیره', hint: 'ثبت قالب' },
];

const DESIGN_SUB_STEPS = [
    { id: 'visual', label: 'ویرایشگر بصری' },
    { id: 'style', label: 'متن و رنگ' },
    { id: 'frame', label: 'قاب و بوم' },
    { id: 'fields', label: 'فیلدها' },
];

const FONT_SUB_STEPS = [
    { id: 'fa', label: 'فونت فارسی' },
    { id: 'en', label: 'فونت انگلیسی' },
];

export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        AdminToggleSwitch,
        CertificateLayoutEditor,
        CertificateRenderer,
        CertificatePngGenerator,
    },
    props: { id: { type: [String, Number], default: null } },
    data() {
        return {
            loading: false,
            saving: false,
            currentStep: 0,
            designSubStep: 0,
            fontSubStep: 0,
            uploadingType: null,
            uploadError: null,
            uploadSuccess: null,
            previewLoading: false,
            previewPngUrl: null,
            previewTimer: null,
            fontList: [],
            uploadingFont: null,
            fontUploadError: null,
            placeholders: CERTIFICATE_PLACEHOLDERS,
            template: null,
            btnSecondary: BTN_SECONDARY,
            designSubSteps: DESIGN_SUB_STEPS,
            fontSubSteps: FONT_SUB_STEPS,
            form: {
                name: '',
                description: '',
                orientation: 'landscape',
                is_active: true,
                is_default: false,
                canvas_width: 1123,
                canvas_height: 794,
                layout: {},
                settings: {},
            },
            assetTypes: [
                { type: 'background', field: 'background_image', label: 'پس‌زمینه' },
                { type: 'logo', field: 'logo_image', label: 'لوگو' },
                { type: 'signature', field: 'signature_image', label: 'امضا' },
            ],
        };
    },
    computed: {
        isEdit() { return !!this.id; },
        visibleSteps() { return STEPS; },
        currentStepId() { return this.visibleSteps[this.currentStep]?.id || 'basic'; },
        activeDesignPanel() { return this.designSubSteps[this.designSubStep]?.id || 'visual'; },
        isOnDesignStep() { return this.currentStepId === 'design'; },
        isOnFontsStep() { return this.currentStepId === 'fonts'; },
        activeFontGroup() {
            const key = this.fontSubSteps[this.fontSubStep]?.id || 'fa';
            return this.fontGroups.find((g) => g.key === key) || this.fontGroups[0] || null;
        },
        isFirstSubStep() {
            if (this.currentStep === 0) {
                if (this.isOnDesignStep) return this.designSubStep === 0;
                if (this.isOnFontsStep) return this.fontSubStep === 0;
                return true;
            }
            if (this.isOnDesignStep) return this.designSubStep === 0;
            if (this.isOnFontsStep) return this.fontSubStep === 0;
            return false;
        },
        isLastSubStep() {
            if (this.isOnDesignStep && this.designSubStep < this.designSubSteps.length - 1) return false;
            if (this.isOnFontsStep && this.fontSubStep < this.fontSubSteps.length - 1) return false;
            return this.currentStep >= this.visibleSteps.length - 1;
        },
        footerStepLabel() {
            if (this.isOnDesignStep) {
                return `طراحی — ${this.designSubSteps[this.designSubStep]?.label} (${this.designSubStep + 1}/${this.designSubSteps.length})`;
            }
            if (this.isOnFontsStep) {
                return `فونت‌ها — ${this.fontSubSteps[this.fontSubStep]?.label} (${this.fontSubStep + 1}/${this.fontSubSteps.length})`;
            }
            const step = this.visibleSteps[this.currentStep];
            return `${step?.label} (${this.currentStep + 1}/${this.visibleSteps.length})`;
        },
        visualRender() {
            const canvas = canvasForOrientation(this.form.orientation);
            return {
                placeholders: {
                    student_name: 'علی محمدی',
                    course_name: 'دوره نمونه Laravel',
                    completion_date: '1404/03/15',
                    certificate_serial: 'ZNB-20260620-ABC123',
                    certificate_id: '1001',
                    instructor_name: 'مدرس نمونه',
                    duration: '12h 30m',
                    grade: '95',
                },
                layout: this.form.layout,
                settings: this.form.settings,
                background_url: this.isEdit
                    ? (this.template?.background_image_url || this.assetUrl(this.template?.background_image))
                    : null,
                logo_url: this.isEdit
                    ? (this.template?.logo_image_url || this.assetUrl(this.template?.logo_image))
                    : null,
                signature_url: this.isEdit
                    ? (this.template?.signature_image_url || this.assetUrl(this.template?.signature_image))
                    : null,
                qr_data_uri: this.sampleQrDataUri,
                orientation: this.form.orientation,
                canvas_width: this.form.canvas_width || canvas.width,
                canvas_height: this.form.canvas_height || canvas.height,
                fonts: this.previewFonts,
            };
        },
        sampleQrDataUri() {
            const qr = qrcode(0, 'M');
            qr.addData('https://zanburak.ir/certificate/preview');
            qr.make();
            return qr.createDataURL(4, 0);
        },
        previewRender() {
            return this.isEdit ? this.visualRender : null;
        },
        previewFonts() {
            const merged = mergeLayout(this.form.layout);
            const slugs = new Set(
                Object.values(merged).filter((item) => item?.font_family).map((item) => item.font_family),
            );
            const catalog = {};
            for (const font of this.fontList) {
                if (slugs.has(font.slug) && font.url) {
                    catalog[font.slug] = {
                        slug: font.slug,
                        css_family: font.css_family,
                        url: normalizeCertificateAssetUrl(font.url),
                    };
                }
            }
            return catalog;
        },
        fontGroups() {
            const fa = [];
            const en = [];
            for (const font of this.fontList) {
                if (font.category === 'en') en.push(font);
                else fa.push(font);
            }
            return [
                { key: 'fa', label: this.$t('cert.admin.fontsPersian'), items: fa },
                { key: 'en', label: this.$t('cert.admin.fontsEnglish'), items: en },
            ];
        },
    },
    watch: {
        previewRender: {
            deep: true,
            handler(render) {
                if (!render || !this.isEdit) return;
                clearTimeout(this.previewTimer);
                this.previewTimer = setTimeout(() => this.refreshPreview(render), 500);
            },
        },
        currentStepId(id) {
            if ((id === 'preview' || id === 'confirm') && this.isEdit && this.previewRender) {
                this.refreshPreview(this.previewRender);
            }
        },
    },
    mounted() {
        this.localizeAssetLabels();
        this.loadFonts();
        if (this.isEdit) this.load();
    },
    beforeUnmount() {
        clearTimeout(this.previewTimer);
    },
    methods: {
        localizeAssetLabels() {
            this.assetTypes = [
                { type: 'background', field: 'background_image', label: this.$t('cert.admin.background') },
                { type: 'logo', field: 'logo_image', label: this.$t('cert.admin.logo') },
                { type: 'signature', field: 'signature_image', label: this.$t('cert.admin.signature') },
            ];
        },
        mainStepButtonClass(index) {
            if (index === this.currentStep) return 'bg-yellow-400/15 ring-1 ring-yellow-400/40';
            if (index < this.currentStep) return 'hover:bg-gray-50 dark:hover:bg-gray-800/60';
            return 'hover:bg-gray-50 dark:hover:bg-gray-800/40 opacity-80';
        },
        mainStepIndexClass(index) {
            if (index === this.currentStep) return 'bg-yellow-400 text-gray-900';
            if (index < this.currentStep) return 'bg-gray-800 dark:bg-gray-600 text-white';
            return 'bg-gray-100 dark:bg-gray-800 text-gray-500';
        },
        goToMainStep(index) {
            if (index >= 0 && index < this.visibleSteps.length) {
                this.currentStep = index;
                const stepId = this.visibleSteps[index].id;
                if (stepId !== 'design') this.designSubStep = 0;
                if (stepId !== 'fonts') this.fontSubStep = 0;
            }
        },
        nextStep() {
            if (this.currentStep === 0 && !this.form.name?.trim()) {
                showToastError('نام قالب را وارد کنید');
                return;
            }
            if (this.isOnDesignStep && this.designSubStep < this.designSubSteps.length - 1) {
                this.designSubStep += 1;
                return;
            }
            if (this.isOnFontsStep && this.fontSubStep < this.fontSubSteps.length - 1) {
                this.fontSubStep += 1;
                return;
            }
            if (this.currentStep < this.visibleSteps.length - 1) {
                this.currentStep += 1;
                this.designSubStep = 0;
                this.fontSubStep = 0;
            }
        },
        prevStep() {
            if (this.isOnDesignStep && this.designSubStep > 0) {
                this.designSubStep -= 1;
                return;
            }
            if (this.isOnFontsStep && this.fontSubStep > 0) {
                this.fontSubStep -= 1;
                return;
            }
            if (this.currentStep > 0) {
                this.currentStep -= 1;
                const prevId = this.currentStepId;
                if (prevId === 'design') {
                    this.designSubStep = this.designSubSteps.length - 1;
                } else {
                    this.designSubStep = 0;
                }
                if (prevId === 'fonts') {
                    this.fontSubStep = this.fontSubSteps.length - 1;
                } else {
                    this.fontSubStep = 0;
                }
            }
        },
        assetUrl(path) {
            if (!path) return null;
            if (path.startsWith('http')) return normalizeCertificateAssetUrl(path);
            return normalizeCertificateAssetUrl(`${(config.apiBaseUrl || '').replace(/\/api\/?$/, '')}/storage/${path.replace(/^\/+/, '')}`);
        },
        previewUrl(field) {
            const urlField = `${field}_url`;
            if (this.template?.[urlField]) return this.template[urlField];
            return this.assetUrl(this.template?.[field]);
        },
        onOrientationChange() {
            const canvas = canvasForOrientation(this.form.orientation);
            this.form.canvas_width = canvas.width;
            this.form.canvas_height = canvas.height;
        },
        async loadFonts() {
            try {
                const res = await listCertificateFonts();
                this.fontList = res.fonts || [];
            } catch {
                this.fontList = [];
            }
        },
        async load() {
            this.loading = true;
            try {
                const res = await getCertificateTemplate(this.id);
                this.template = res.template;
                const canvas = canvasForOrientation(res.template.orientation || 'landscape');
                this.form = {
                    name: res.template.name,
                    description: res.template.description || '',
                    orientation: res.template.orientation || 'landscape',
                    canvas_width: res.template.canvas_width || canvas.width,
                    canvas_height: res.template.canvas_height || canvas.height,
                    is_active: !!res.template.is_active,
                    is_default: !!res.template.is_default,
                    layout: res.template.layout || res.default_layout || {},
                    settings: res.template.settings || {},
                };
            } catch (error) {
                showToastError(error.response?.data?.message || 'خطا در بارگذاری قالب');
            } finally {
                this.loading = false;
            }
        },
        async uploadFont(slug, event) {
            const file = event.target.files?.[0];
            if (!file) return;
            this.uploadingFont = slug;
            this.fontUploadError = null;
            try {
                const res = await uploadCertificateFont(slug, file);
                const idx = this.fontList.findIndex((f) => f.slug === slug);
                if (idx >= 0) this.fontList.splice(idx, 1, res.font);
                else this.fontList.push(res.font);
                event.target.value = '';
                showToastSuccess('فونت آپلود شد');
            } catch (err) {
                const data = err?.response?.data;
                this.fontUploadError = data?.message || 'خطا در آپلود فونت.';
                showToastError(this.fontUploadError);
            } finally {
                this.uploadingFont = null;
            }
        },
        async uploadAsset(type, event) {
            const file = event.target.files?.[0];
            if (!file) return;
            this.uploadingType = type;
            this.uploadError = null;
            this.uploadSuccess = null;
            try {
                const res = await uploadCertificateTemplateAsset(this.id, type, file);
                this.template = res.template;
                this.uploadSuccess = 'فایل با موفقیت آپلود شد.';
                showToastSuccess(this.uploadSuccess);
                event.target.value = '';
            } catch (err) {
                this.uploadError = err?.response?.data?.message || 'خطا در آپلود فایل.';
                showToastError(this.uploadError);
            } finally {
                this.uploadingType = null;
            }
        },
        async refreshPreview(render) {
            if (!this.$refs.previewGenerator) return;
            this.previewLoading = true;
            try {
                this.previewPngUrl = await this.$refs.previewGenerator.generateFromRender(render);
            } catch (e) {
                console.error('Preview failed:', e);
            } finally {
                this.previewLoading = false;
            }
        },
        async submit() {
            if (!this.form.name?.trim()) {
                showToastError('نام قالب را وارد کنید');
                this.currentStep = 0;
                return;
            }
            this.saving = true;
            try {
                if (this.isEdit) {
                    await updateCertificateTemplate(this.id, this.form);
                    showToastSuccess('قالب ذخیره شد');
                    this.$router.push({ name: 'admin-certificate-templates' });
                } else {
                    const res = await createCertificateTemplate(this.form);
                    showToastSuccess('قالب ایجاد شد');
                    this.$router.push({ name: 'admin-certificate-template-edit', params: { id: res.template.id } });
                }
            } catch (error) {
                showToastError(error.response?.data?.message || 'خطا در ذخیره قالب');
            } finally {
                this.saving = false;
            }
        },
    },
};
</script>

<style scoped>
.form-input {
    width: 100%;
    margin-top: 0.375rem;
    border-radius: 0.75rem;
    background-color: #f9fafb;
    border: 1px solid #f3f4f6;
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    outline: none;
}
.form-input:focus {
    border-color: #facc15;
    box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.25);
}
.dark .form-input {
    background-color: #1f2937;
    border-color: #374151;
    color: #fff;
}
.field-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
}
.dark .field-label { color: #9ca3af; }
@media (min-width: 1024px) {
    .cert-form-layout {
        grid-template-columns: 14rem minmax(0, 1fr);
    }
}
</style>
