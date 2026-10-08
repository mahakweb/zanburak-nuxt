<template>
    <div class="space-y-4">
        <div
            class="relative overflow-hidden rounded-2xl border transition-all duration-300"
            :class="modelValue
                ? 'border-amber-300/80 bg-gradient-to-br from-amber-50 via-white to-yellow-50/70 dark:from-amber-950/35 dark:via-gray-900 dark:to-yellow-950/20 dark:border-amber-500/40 shadow-sm shadow-amber-100/70 dark:shadow-none'
                : 'border-gray-200/80 bg-gray-50/50 dark:bg-gray-800/30 dark:border-gray-700/80'"
        >
            <div class="absolute -top-10 -end-8 h-28 w-28 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />
            <div class="relative flex items-start gap-4 p-4">
                <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors"
                    :class="modelValue
                        ? 'bg-amber-400 text-gray-900 shadow-lg shadow-amber-500/25'
                        : 'bg-gray-200/80 text-gray-500 dark:bg-gray-700 dark:text-gray-400'"
                >
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 7.5 12 4l7.5 3.5v5.2c0 3.6-2.8 6.9-7.5 8.3-4.7-1.4-7.5-4.7-7.5-8.3V7.5Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="m9 12 2 2 4-4" />
                    </svg>
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-3">
                        <div>
                            <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('cert.course.enable') }}</h4>
                            <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">{{ $t('cert.course.enableHint') }}</p>
                        </div>
                        <AdminToggleSwitch :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
                    </div>
                    <div v-if="modelValue" class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold text-amber-800 dark:text-amber-200">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        صدور خودکار پس از تکمیل دوره
                    </div>
                </div>
            </div>
        </div>

        <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="modelValue" class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/60 p-4">
                <div class="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('cert.course.template') }}</h4>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{{ $t('cert.course.defaultTemplate') }} در صورت عدم انتخاب استفاده می‌شود.</p>
                    </div>
                </div>
                <CertificateTemplatePicker v-model="selectedTemplateId" :templates="templates" :loading="loading" />
            </div>
        </transition>
    </div>
</template>

<script>
import AdminToggleSwitch from '@/views/components/admin/AdminToggleSwitch.vue';
import CertificateTemplatePicker from '@/views/components/certificate/CertificateTemplatePicker.vue';

export default {
    name: 'AdminCertificateSettings',
    components: { AdminToggleSwitch, CertificateTemplatePicker },
    props: {
        modelValue: { type: Boolean, default: false },
        templateId: { type: [Number, String, null], default: null },
        templates: { type: Array, default: () => [] },
        loading: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'update:templateId'],
    computed: {
        selectedTemplateId: {
            get() {
                return this.templateId;
            },
            set(value) {
                this.$emit('update:templateId', value);
            },
        },
    },
};
</script>
