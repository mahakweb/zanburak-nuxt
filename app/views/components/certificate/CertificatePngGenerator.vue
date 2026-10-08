<template>
    <div class="cert-png-generator" aria-hidden="true">
        <CertificateRenderer
            v-if="renderData"
            ref="renderer"
            :render="renderData"
            :width="canvasWidth"
            :height="canvasHeight"
        />
    </div>
</template>

<script>
import CertificateRenderer from '@/views/components/certificate/CertificateRenderer.vue';
import { getCertificateRenderData } from '@/services/certificate.service';
import {
    captureCertificateToPng,
    embedRenderImagesAsDataUrls,
    getCanvasSize,
    normalizeRenderAssets,
} from '@/utils/certificatePngCapture';

export default {
    name: 'CertificatePngGenerator',
    components: { CertificateRenderer },
    data() {
        return {
            renderData: null,
        };
    },
    computed: {
        canvasWidth() {
            return getCanvasSize(this.renderData).width;
        },
        canvasHeight() {
            return getCanvasSize(this.renderData).height;
        },
    },
    methods: {
        async generate(uuid, options = {}) {
            const templateId = options.templateId ?? null;
            const res = await getCertificateRenderData(uuid, templateId);
            return this.generateFromRender(res.render);
        },
        async generateFromRender(render) {
            this.renderData = await embedRenderImagesAsDataUrls(normalizeRenderAssets(render));
            await this.$nextTick();
            await new Promise((r) => setTimeout(r, 350));

            const el = this.$refs.renderer?.$el;
            if (!el) {
                this.renderData = null;
                throw new Error('Certificate renderer not ready');
            }

            try {
                return await captureCertificateToPng(el, this.renderData);
            } finally {
                this.renderData = null;
            }
        },
    },
};
</script>

<style scoped>
.cert-png-generator {
    position: fixed;
    left: -10000px;
    top: 0;
    z-index: -1;
    pointer-events: none;
    opacity: 0;
}
</style>
