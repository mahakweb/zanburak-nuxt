<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
        <CertificatePngGenerator ref="pngGenerator" />

        <div v-if="type !== 'download' && !loading" class="fixed top-4 end-4 z-20 flex flex-wrap gap-2">
            <button v-if="pngUrl" @click="downloadPng"
                class="text-white bg-gray-900 hover:bg-gray-800 font-medium rounded-lg text-sm px-4 py-2 inline-flex items-center">
                {{ $t('cert.download.png') }}
            </button>
            <button v-if="shareUrl" @click="share"
                class="text-gray-800 bg-yellow-400 hover:bg-yellow-300 font-medium rounded-lg text-sm px-4 py-2">
                {{ $t('cert.share') }}
            </button>
        </div>

        <div class="mx-auto max-w-screen-xl px-4 py-10 min-h-screen flex flex-col items-center justify-center">
            <CertificateGeneratingLoader v-if="loading"
                :title="$t('cert.view.generating')"
                :subtitle="$t('cert.view.generatingHint')" />

            <div v-else-if="pngUrl && type !== 'download'" class="w-full flex justify-center py-6 px-2">
                <div class="cert-paper-shadow rounded-sm overflow-hidden shadow-2xl max-w-full">
                    <SeoImage
                        priority
                        :src="pngUrl"
                        :alt="certificationData?.course_title || 'گواهی پایان دوره'"
                        img-class="block max-w-full h-auto"
                        :hide-on-error="false"
                    />
                </div>
            </div>

            <div v-if="error" class="text-center text-rose-500 py-16">{{ error }}</div>
        </div>
    </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance';
import CertificatePngGenerator from '@/views/components/certificate/CertificatePngGenerator.vue';
import CertificateGeneratingLoader from '@/views/components/certificate/CertificateGeneratingLoader.vue';
import SeoImage from '@/views/components/seo/SeoImage.vue';
import config from '@/store/config';
import { downloadDataUrl, revokeObjectUrl } from '@/utils/certificatePngCapture';

export default {
    components: { CertificatePngGenerator, CertificateGeneratingLoader, SeoImage },
    props: { uuid: { type: String, required: true } },
    data() {
        return {
            loading: true,
            error: null,
            certificationData: null,
            pngUrl: null,
            type: this.$route.query.type ?? 'view',
        };
    },
    computed: {
        downloadNamePng() {
            if (!this.certificationData) return 'certificate.png';
            return `certificate-${this.certificationData.serial_number || this.uuid}.png`;
        },
        shareUrl() {
            const serial = this.certificationData?.serial_number;
            if (!serial) return null;
            const token = this.certificationData?.verification_token;
            let url = `${config.appUrl}/verify-certificate?serial=${encodeURIComponent(serial)}`;
            if (token) url += `&token=${encodeURIComponent(token)}`;
            return url;
        },
    },
    async mounted() {
        try {
            const res = await axiosInstance.get(`/certificate/${this.uuid}`);
            this.certificationData = res.data.certificate;

            const dataUrl = await this.$refs.pngGenerator.generate(this.uuid);

            if (this.type === 'download') {
                downloadDataUrl(dataUrl, this.downloadNamePng);
                this.$router.replace({ name: 'panel-certifications' }).catch(() => {});
                return;
            }

            this.pngUrl = dataUrl;
        } catch {
            this.error = this.$t('certificate.intro.notFound') || 'Certificate not found';
            if (this.type !== 'download') {
                this.$router.push({ name: 'NotFound' });
            }
        } finally {
            this.loading = false;
        }
    },
    beforeUnmount() {
        revokeObjectUrl(this.pngUrl);
    },
    methods: {
        downloadPng() {
            if (this.pngUrl) {
                downloadDataUrl(this.pngUrl, this.downloadNamePng);
            }
        },
        async share() {
            if (navigator.share && this.shareUrl) {
                await navigator.share({
                    title: this.certificationData?.course_title,
                    url: this.shareUrl,
                });
            } else if (this.shareUrl) {
                await navigator.clipboard.writeText(this.shareUrl);
                alert(this.$t('cert.share'));
            }
        },
    },
};
</script>

<style scoped>
.cert-paper-shadow {
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    background: #fff;
    line-height: 0;
}
</style>
