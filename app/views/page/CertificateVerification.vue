<template>
    <MasterPage>
        <div class="md:mt-16 mx-auto max-w-lg px-4 py-10">
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
                <div class="text-center">
                    <h1 class="text-xl font-extrabold text-gray-800 dark:text-white">{{ $t('cert.verify.title') }}</h1>
                    <p class="text-sm text-gray-500 mt-2">{{ $t('cert.verify.subtitle') }}</p>
                </div>

                <form @submit.prevent="verify" class="space-y-3">
                    <label class="text-xs font-medium text-gray-500">{{ $t('cert.verify.serialLabel') }}</label>
                    <input v-model="serial" required
                        class="w-full h-11 rounded-xl text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border-0 px-4 text-sm font-mono uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        :placeholder="$t('cert.verify.serialPlaceholder')" />
                    <button type="submit" :disabled="loading"
                        class="w-full h-11 rounded-xl bg-yellow-400 font-bold text-sm text-gray-900 hover:bg-yellow-300 disabled:opacity-50">
                        {{ loading ? $t('cert.verify.checking') : $t('cert.verify.submit') }}
                    </button>
                </form>

                <div v-if="result !== null" class="rounded-xl p-4 space-y-3"
                    :class="result.valid ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20' : 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20'">
                    <div class="flex items-center gap-2 font-bold text-sm"
                        :class="result.valid ? 'text-green-700 dark:text-green-400' : 'text-rose-600'">
                        <span class="w-2.5 h-2.5 rounded-full" :class="result.valid ? 'bg-green-500' : 'bg-rose-500'"></span>
                        {{ statusMessage }}
                    </div>

                    <p v-if="result.certificate?.revoked" class="text-xs text-rose-600 font-medium">
                        {{ $t('cert.verify.revoked') }}
                    </p>
                    <p v-if="result.forgery_check === false" class="text-xs text-amber-600 font-medium">
                        {{ $t('cert.verify.forgeryWarning') }}
                    </p>

                    <template v-if="result.certificate">
                        <dl class="grid grid-cols-1 gap-2.5 text-sm">
                            <div class="flex justify-between items-center gap-3">
                                <dt class="text-gray-500 shrink-0">{{ $t('cert.verify.student') }}</dt>
                                <dd class="font-semibold text-gray-800 dark:text-gray-100 text-end">{{ result.certificate.student_name }}</dd>
                            </div>
                            <div class="flex justify-between items-center gap-3">
                                <dt class="text-gray-500 shrink-0">{{ $t('cert.verify.course') }}</dt>
                                <dd class="font-semibold text-gray-800 dark:text-gray-100 text-end">{{ result.certificate.course_name }}</dd>
                            </div>
                            <div v-if="result.certificate.instructor_name" class="flex justify-between items-center gap-3">
                                <dt class="text-gray-500 shrink-0">{{ $t('cert.verify.instructor') }}</dt>
                                <dd class="text-gray-700 dark:text-gray-200 text-end">{{ result.certificate.instructor_name }}</dd>
                            </div>
                            <div v-if="result.certificate.completion_date" class="flex justify-between items-center gap-3">
                                <dt class="text-gray-500 shrink-0">{{ $t('cert.verify.date') }}</dt>
                                <dd class="text-gray-700 dark:text-gray-200 text-end" dir="">{{ formatDateTime(result.certificate.completion_date) }}</dd>
                            </div>
                            <div v-if="showDuration" class="flex justify-between items-center gap-3">
                                <dt class="text-gray-500 shrink-0">{{ $t('cert.verify.duration') }}</dt>
                                <dd class="text-gray-700 dark:text-gray-200 text-end">{{ formatDuration(result.certificate) }}</dd>
                            </div>
                            <div v-if="result.certificate.grade != null" class="flex justify-between items-center gap-3">
                                <dt class="text-gray-500 shrink-0">{{ $t('cert.verify.grade') }}</dt>
                                <dd class="text-green-600 font-bold text-end">{{ result.certificate.grade }}</dd>
                            </div>
                            <div v-if="result.certificate.serial_number" class="flex justify-between items-center gap-3">
                                <dt class="text-gray-500 shrink-0">{{ $t('cert.verify.serialLabel') }}</dt>
                                <dd class="flex items-center gap-1 min-w-0">
                                    <span class="font-mono text-xs text-gray-700 dark:text-gray-200 truncate" dir="ltr">{{ result.certificate.serial_number }}</span>
                                    <CopyTextButton :value="result.certificate.serial_number" />
                                </dd>
                            </div>
                            <div v-if="result.certificate.uuid" class="flex justify-between items-center gap-3">
                                <dt class="text-gray-500 shrink-0">{{ $t('cert.verify.uuid') }}</dt>
                                <dd class="flex items-center gap-1 min-w-0">
                                    <span class="font-mono text-[11px] text-gray-600 dark:text-gray-300 truncate" dir="ltr">{{ result.certificate.uuid }}</span>
                                    <CopyTextButton :value="result.certificate.uuid" />
                                </dd>
                            </div>
                        </dl>
                    </template>
                </div>
            </div>
        </div>
    </MasterPage>
</template>

<script>
import MasterPage from '@/views/page/layouts/MasterPage.vue';
import CopyTextButton from '@/views/components/common/CopyTextButton.vue';
import { verifyCertificate } from '@/services/certificate.service';
import { formatCertificateDateTime, formatCertificateDuration } from '@/utils/certificateDisplay';

export default {
    components: { MasterPage, CopyTextButton },
    data() {
        return {
            serial: this.$route.query.serial || '',
            token: this.$route.query.token || null,
            loading: false,
            result: null,
        };
    },
    computed: {
        statusMessage() {
            if (!this.result) return '';
            if (this.result.certificate?.revoked) return this.$t('cert.verify.revoked');
            return this.result.valid ? this.$t('cert.verify.valid') : this.$t('cert.verify.invalid');
        },
        showDuration() {
            const cert = this.result?.certificate;
            if (!cert) return false;
            return !!(cert.duration_seconds || (cert.duration && cert.duration !== '—'));
        },
        localeKey() {
            return this.$i18n.locale === 'en' ? 'en' : 'fa';
        },
    },
    mounted() {
        if (this.serial) this.verify();
    },
    methods: {
        formatDateTime(value) {
            return formatCertificateDateTime(value, this.localeKey);
        },
        formatDuration(cert) {
            const raw = cert.duration_seconds || cert.duration;
            return formatCertificateDuration(raw, this.localeKey);
        },
        async verify() {
            this.loading = true;
            this.result = null;
            try {
                this.result = await verifyCertificate(this.serial.trim().toUpperCase(), this.token);
            } catch {
                this.result = { valid: false, certificate: null };
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
