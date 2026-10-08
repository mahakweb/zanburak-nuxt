<template>
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-4 md:p-5 space-y-4 shadow-sm">
        <!-- Visual editor -->
        <div v-show="showPanel('visual')">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">{{ $t('cert.admin.visualLayoutEditor') }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">{{ $t('cert.admin.visualLayoutHint') }}</p>
            <CertificateVisualLayoutEditor
                v-if="visualRender"
                :render="visualRender"
                :layout="localLayout"
                :canvas-width="localCanvas.width"
                :canvas-height="localCanvas.height"
                @update:layout="onVisualLayoutUpdate"
            />
        </div>

        <!-- Style -->
        <div v-show="showPanel('style')" class="space-y-4">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('cert.admin.designSettings') }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">رنگ اصلی و متن‌های ثابت گواهینامه</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="field-label">{{ $t('cert.admin.primaryColor') }}</label>
                    <input v-model="localSettings.primary_color" type="color" class="form-input h-10 p-1" @input="emitSettings" />
                </div>
                <div>
                    <label class="field-label">{{ $t('cert.admin.titleText') }}</label>
                    <input v-model="localSettings.title" class="form-input" @input="emitSettings" />
                </div>
                <div class="sm:col-span-2">
                    <label class="field-label">{{ $t('cert.admin.subtitleText') }}</label>
                    <input v-model="localSettings.subtitle" class="form-input" @input="emitSettings" />
                </div>
            </div>
        </div>

        <!-- Frame & canvas -->
        <div v-show="showPanel('frame')" class="space-y-4">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('cert.admin.frameSettings') }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">قاب دور گواهینامه و ابعاد بوم</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div class="col-span-2 md:col-span-3 flex items-center justify-between gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 px-3 py-2.5">
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ $t('cert.admin.frameEnabled') }}</span>
                    <AdminToggleSwitch
                        size="sm"
                        :model-value="!!localSettings.frame_enabled"
                        @update:model-value="localSettings.frame_enabled = $event; emitSettings()"
                    />
                </div>
                <div>
                    <label class="field-label">{{ $t('cert.admin.frameColor') }}</label>
                    <input v-model="localSettings.frame_color" type="color" class="layout-input h-9 p-1" @input="emitSettings" />
                </div>
                <div>
                    <label class="field-label">{{ $t('cert.admin.frameWidth') }}</label>
                    <input v-model.number="localSettings.frame_width" type="number" min="0" max="20" step="1" class="layout-input" @change="emitSettings" />
                </div>
                <div>
                    <label class="field-label">{{ $t('cert.admin.frameInset') }}</label>
                    <input v-model.number="localSettings.frame_inset" type="number" min="0" max="200" step="1" class="layout-input" @change="emitSettings" />
                </div>
                <div class="col-span-2 md:col-span-1">
                    <label class="field-label">{{ $t('cert.admin.frameStyle') }}</label>
                    <select v-model="localSettings.frame_style" class="layout-input" @change="emitSettings">
                        <option value="solid">{{ $t('cert.admin.frameSolid') }}</option>
                        <option value="dashed">{{ $t('cert.admin.frameDashed') }}</option>
                        <option value="dotted">{{ $t('cert.admin.frameDotted') }}</option>
                        <option value="none">{{ $t('cert.admin.frameNone') }}</option>
                    </select>
                </div>
                <div>
                    <label class="field-label">{{ $t('cert.admin.canvasWidth') }}</label>
                    <input v-model.number="localCanvas.width" type="number" min="400" max="5000" class="form-input" @change="emitCanvas" />
                </div>
                <div>
                    <label class="field-label">{{ $t('cert.admin.canvasHeight') }}</label>
                    <input v-model.number="localCanvas.height" type="number" min="400" max="5000" class="form-input" @change="emitCanvas" />
                </div>
            </div>
        </div>

        <!-- Fields (one at a time) -->
        <div v-show="showPanel('fields')" class="space-y-4">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('cert.admin.layoutEditor') }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('cert.admin.layoutHint') }}</p>
            </div>

            <div>
                <label class="field-label">{{ $t('cert.admin.field') }}</label>
                <select v-model="selectedFieldKey" class="form-input">
                    <option v-for="field in fields" :key="field.key" :value="field.key">{{ field.label }}</option>
                </select>
            </div>

            <article v-if="activeField"
                class="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3"
                :class="{ 'opacity-60': localLayout[activeField.key]?.visible === false }">
                <div class="flex items-center justify-between gap-2">
                    <h5 class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ activeField.label }}</h5>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] text-gray-500">{{ $t('cert.admin.fieldVisible') }}</span>
                        <AdminToggleSwitch
                            size="sm"
                            :model-value="localLayout[activeField.key]?.visible !== false"
                            @update:model-value="toggleVisible(activeField.key, $event)"
                        />
                    </div>
                </div>

                <div v-if="activeField.custom">
                    <label class="field-label">{{ $t('cert.admin.customTextContent') }}</label>
                    <input
                        v-model="localSettings[activeField.settingsKey]"
                        class="layout-input text-start w-full"
                        :placeholder="activeField.label"
                        @input="emitSettings"
                    />
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div>
                        <label class="field-label">X%</label>
                        <input v-model.number="localLayout[activeField.key].x" type="number" min="0" max="100" step="0.1" class="layout-input" @change="emitLayout" />
                    </div>
                    <div>
                        <label class="field-label">Y%</label>
                        <input v-model.number="localLayout[activeField.key].y" type="number" min="0" max="100" step="0.1" class="layout-input" @change="emitLayout" />
                    </div>

                    <template v-if="activeField.type === 'text'">
                        <div>
                            <label class="field-label">{{ $t('cert.admin.fontSize') }}</label>
                            <input v-model.number="localLayout[activeField.key].font_size" type="number" min="8" max="120" class="layout-input" @change="emitLayout" />
                        </div>
                        <div>
                            <label class="field-label">{{ $t('cert.admin.fontFamily') }}</label>
                            <select v-model="localLayout[activeField.key].font_family" class="layout-input" @change="emitLayout">
                                <option v-for="f in fonts" :key="f.slug" :value="f.slug" :disabled="!f.available">
                                    {{ f.name }}{{ f.available ? '' : ' (آپلود نشده)' }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="field-label">{{ $t('cert.admin.align') }}</label>
                            <select v-model="localLayout[activeField.key].align" class="layout-input" @change="emitLayout">
                                <option value="center">{{ $t('cert.admin.alignCenter') }}</option>
                                <option value="left">{{ $t('cert.admin.alignLeft') }}</option>
                                <option value="right">{{ $t('cert.admin.alignRight') }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="field-label">{{ $t('cert.admin.color') }}</label>
                            <input v-model="localLayout[activeField.key].color" type="color" class="layout-input h-9 p-1" @input="emitLayout" />
                        </div>
                        <div>
                            <label class="field-label">{{ $t('cert.admin.widthPx') }}</label>
                            <input v-model.number="localLayout[activeField.key].width" type="number" min="20" max="1200" class="layout-input" @change="emitLayout" />
                        </div>
                        <div>
                            <label class="field-label">{{ $t('cert.admin.heightPx') }}</label>
                            <input v-model.number="localLayout[activeField.key].height" type="number" min="16" max="600" class="layout-input" @change="emitLayout" />
                        </div>
                        <div>
                            <label class="field-label">{{ $t('cert.admin.lineHeight') }}</label>
                            <select v-model.number="localLayout[activeField.key].line_height" class="layout-input" @change="emitLayout">
                                <option :value="1">1×</option>
                                <option :value="1.25">1.25×</option>
                                <option :value="1.5">1.5×</option>
                                <option :value="2">2×</option>
                            </select>
                        </div>
                        <div class="flex items-center justify-between gap-2 col-span-2 md:col-span-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
                            <span class="text-xs text-gray-600 dark:text-gray-300">{{ $t('cert.admin.fontBold') }}</span>
                            <AdminToggleSwitch
                                size="sm"
                                :model-value="isBold(activeField.key)"
                                @update:model-value="toggleBold(activeField.key, $event)"
                            />
                        </div>
                    </template>

                    <template v-else>
                        <div>
                            <label class="field-label">{{ $t('cert.admin.widthPx') }}</label>
                            <input v-model.number="localLayout[activeField.key].width" type="number" min="20" max="800" class="layout-input" @change="emitLayout" />
                        </div>
                        <div>
                            <label class="field-label">{{ $t('cert.admin.heightPx') }}</label>
                            <input v-model.number="localLayout[activeField.key].height" type="number" min="20" max="800" class="layout-input" @change="emitLayout" />
                        </div>
                    </template>
                </div>
            </article>
        </div>
    </section>
</template>

<script>
import CertificateVisualLayoutEditor from '@/views/components/certificate/CertificateVisualLayoutEditor.vue';
import AdminToggleSwitch from '@/views/components/admin/AdminToggleSwitch.vue';
import { LAYOUT_FIELD_GROUPS, mergeLayout, mergeSettings } from '@/constants/certificateLayout';
import { listCertificateFonts } from '@/services/certificate.service';

export default {
    components: { CertificateVisualLayoutEditor, AdminToggleSwitch },
    props: {
        layout: { type: Object, default: () => ({}) },
        settings: { type: Object, default: () => ({}) },
        canvasWidth: { type: Number, default: 1123 },
        canvasHeight: { type: Number, default: 794 },
        visualRender: { type: Object, default: null },
        panel: { type: String, default: 'visual' },
    },
    emits: ['update:layout', 'update:settings', 'update:canvasWidth', 'update:canvasHeight'],
    data() {
        return {
            localLayout: mergeLayout(this.layout),
            localSettings: mergeSettings(this.settings),
            localCanvas: { width: this.canvasWidth, height: this.canvasHeight },
            fonts: [],
            fields: LAYOUT_FIELD_GROUPS,
            selectedFieldKey: LAYOUT_FIELD_GROUPS[0]?.key || '',
        };
    },
    computed: {
        activeField() {
            return this.fields.find((f) => f.key === this.selectedFieldKey) || this.fields[0] || null;
        },
    },
    async mounted() {
        try {
            const res = await listCertificateFonts();
            this.fonts = res.fonts || [];
        } catch {
            this.fonts = [];
        }
    },
    watch: {
        layout: {
            deep: true,
            handler(v) {
                const merged = mergeLayout(v);
                if (JSON.stringify(merged) === JSON.stringify(this.localLayout)) return;
                this.localLayout = merged;
            },
        },
        settings: {
            deep: true,
            handler(v) {
                const merged = mergeSettings(v);
                if (JSON.stringify(merged) === JSON.stringify(this.localSettings)) return;
                this.localSettings = merged;
            },
        },
        canvasWidth(w) { this.localCanvas.width = w; },
        canvasHeight(h) { this.localCanvas.height = h; },
    },
    methods: {
        showPanel(id) {
            return this.panel === id;
        },
        toggleVisible(key, visible) {
            this.localLayout[key] = { ...this.localLayout[key], visible };
            this.emitLayout();
        },
        isBold(key) {
            return (this.localLayout[key]?.font_weight || 'normal') === 'bold';
        },
        toggleBold(key, bold) {
            this.localLayout[key] = {
                ...this.localLayout[key],
                font_weight: bold ? 'bold' : 'normal',
            };
            this.emitLayout();
        },
        onVisualLayoutUpdate(layout) {
            this.localLayout = mergeLayout(layout);
            this.emitLayout();
        },
        emitLayout() {
            this.$emit('update:layout', JSON.parse(JSON.stringify(this.localLayout)));
        },
        emitSettings() {
            this.$emit('update:settings', { ...this.localSettings });
        },
        emitCanvas() {
            this.$emit('update:canvasWidth', this.localCanvas.width);
            this.$emit('update:canvasHeight', this.localCanvas.height);
        },
    },
};
</script>

<style scoped>
.form-input {
    width: 100%;
    margin-top: 0.25rem;
    border-radius: 0.75rem;
    background-color: #f9fafb;
    border: 1px solid #f3f4f6;
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
}
.dark .form-input { background-color: #374151; border-color: #4b5563; color: #fff; }
.field-label {
    display: block;
    font-size: 10px;
    color: #9ca3af;
    margin-bottom: 2px;
}
.layout-input {
    width: 100%;
    border-radius: 0.5rem;
    background-color: #f9fafb;
    border: 1px solid #f3f4f6;
    padding: 0.375rem 0.5rem;
    text-align: center;
    font-size: 11px;
}
.dark .layout-input { background-color: #374151; border-color: #4b5563; color: #fff; }
</style>
