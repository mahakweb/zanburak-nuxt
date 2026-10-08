<template>
    <section class="visual-editor rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
            <h4 class="text-xs font-bold text-gray-600 dark:text-gray-300">{{ $t('cert.admin.visualLayoutEditor') }}</h4>
            <div class="flex flex-wrap items-center gap-2">
                <label class="zoom-control">
                    <span class="zoom-label">{{ $t('cert.admin.canvasZoom') }}</span>
                    <input v-model.number="zoomPercent" type="range" min="40" max="100" step="5" @input="applyZoom" />
                    <span class="zoom-value">{{ zoomPercent }}%</span>
                </label>
                <select v-model="selectedField" class="field-select">
                    <option v-for="field in fields" :key="field.key" :value="field.key">{{ field.label }}</option>
                </select>
            </div>
        </div>
        <p class="text-xs text-gray-400">{{ $t('cert.admin.visualLayoutHint') }}</p>

        <div ref="viewport" class="viewport" :style="viewportStyle">
            <div class="canvas-outer" :style="outerStyle">
                <div ref="scaledInner" class="canvas-inner" :style="innerStyle">
                    <CertificateRenderer class="cert-preview" :render="render" :width="canvasWidth" :height="canvasHeight" />
                    <div class="overlay-layer">
                        <div
                            v-for="field in fields"
                            :key="field.key"
                            class="field-overlay"
                            :class="{
                                active: selectedField === field.key,
                                'is-image': field.type === 'image',
                                'is-text': field.type === 'text',
                                'is-hidden': localLayout[field.key]?.visible === false,
                            }"
                            :style="overlayStyle(field)"
                            @pointerdown="onMoveStart($event, field)"
                        >
                            <span class="overlay-label">{{ field.label }}</span>
                            <template v-if="field.type === 'image' || field.type === 'text'">
                                <div
                                    v-for="handle in imageHandles"
                                    :key="handle"
                                    class="resize-handle"
                                    :class="[handle, field.type === 'text' ? 'text-handle' : '']"
                                    @pointerdown.stop="onResizeStart($event, field, handle)"
                                />
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import CertificateRenderer from '@/views/components/certificate/CertificateRenderer.vue';
import { LAYOUT_FIELD_GROUPS, approximateTextBox, mergeLayout } from '@/constants/certificateLayout';

const IMAGE_HANDLES = ['nw', 'ne', 'sw', 'se'];

export default {
    components: { CertificateRenderer },
    props: {
        render: { type: Object, required: true },
        layout: { type: Object, default: () => ({}) },
        canvasWidth: { type: Number, default: 1123 },
        canvasHeight: { type: Number, default: 794 },
    },
    emits: ['update:layout'],
    data() {
        return {
            fields: LAYOUT_FIELD_GROUPS,
            imageHandles: IMAGE_HANDLES,
            selectedField: 'student_name',
            scale: 1,
            zoomPercent: 85,
            userZoom: null,
            drag: null,
            localLayout: mergeLayout(this.layout),
        };
    },
    computed: {
        outerStyle() {
            return {
                width: `${Math.round(this.canvasWidth * this.scale)}px`,
                height: `${Math.round(this.canvasHeight * this.scale)}px`,
            };
        },
        innerStyle() {
            return {
                width: `${this.canvasWidth}px`,
                height: `${this.canvasHeight}px`,
                transform: `scale(${this.scale})`,
                transformOrigin: 'top left',
            };
        },
        viewportStyle() {
            const h = Math.round(this.canvasHeight * this.scale) + 32;
            return { minHeight: `${Math.max(480, h)}px` };
        },
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
        canvasWidth() { this.$nextTick(this.updateScale); },
        canvasHeight() { this.$nextTick(this.updateScale); },
        render: { deep: true, handler() { this.$nextTick(this.updateScale); } },
    },
    mounted() {
        this.$nextTick(() => {
            this.updateScale();
            this.resizeObserver = new ResizeObserver(() => this.updateScale());
            if (this.$refs.viewport) {
                this.resizeObserver.observe(this.$refs.viewport);
            }
        });
        window.addEventListener('resize', this.updateScale);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerEnd);
        window.addEventListener('pointercancel', this.onPointerEnd);
    },
    beforeUnmount() {
        this.resizeObserver?.disconnect();
        window.removeEventListener('resize', this.updateScale);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerEnd);
        window.removeEventListener('pointercancel', this.onPointerEnd);
    },
    methods: {
        updateScale() {
            const viewport = this.$refs.viewport;
            if (!viewport) return;
            const pad = 32;
            const maxWidth = Math.max(640, viewport.clientWidth - pad);
            const maxHeight = Math.max(520, Math.min(window.innerHeight * 0.72, 780) - pad);
            const scaleW = maxWidth / this.canvasWidth;
            const scaleH = maxHeight / this.canvasHeight;
            const fitScale = Math.min(1, scaleW, scaleH);
            const minScale = 0.55;
            const autoScale = Math.max(minScale, fitScale);
            this.scale = this.userZoom != null
                ? Math.min(1, Math.max(0.4, this.userZoom))
                : autoScale;
            if (this.userZoom == null) {
                this.zoomPercent = Math.round(this.scale * 100);
            }
        },
        applyZoom() {
            this.userZoom = this.zoomPercent / 100;
            this.scale = this.userZoom;
        },
        overlayStyle(field) {
            const pos = this.localLayout[field.key] || {};
            const x = pos.x ?? 50;
            const y = pos.y ?? 50;

            if (field.type === 'image') {
                const w = pos.width ?? pos.size ?? 100;
                const h = pos.height ?? pos.size ?? 60;
                return {
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${w}px`,
                    height: `${h}px`,
                    transform: 'translate(-50%, -50%)',
                };
            }

            const fontSize = pos.font_size ?? 14;
            const sampleText = this.sampleTextFor(field.key);
            const fallback = approximateTextBox(sampleText, fontSize, this.canvasWidth);
            const w = pos.width ?? fallback.width;
            const h = pos.height ?? fallback.height;

            return {
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}px`,
                height: `${h}px`,
                transform: 'translate(-50%, -50%)',
            };
        },
        sampleTextFor(key) {
            const placeholders = this.render.placeholders || {};
            const settings = this.render.settings || {};
            const map = {
                title: settings.title || 'گواهینامه',
                subtitle: settings.subtitle || 'زیرعنوان',
                student_name: placeholders.student_name || 'نام دانشجو',
                course_name: placeholders.course_name || 'نام دوره',
                completion_date: placeholders.completion_date || '1404/01/01',
                certificate_serial: placeholders.certificate_serial || 'ZNB-000',
                certificate_id: placeholders.certificate_id || '1001',
                instructor_name: placeholders.instructor_name || 'مدرس',
                duration: placeholders.duration || '12h',
                grade: placeholders.grade || '95',
                custom_text_1: settings.custom_text_1 || 'متن دلخواه ۱',
                custom_text_2: settings.custom_text_2 || 'متن دلخواه ۲',
                custom_text_3: settings.custom_text_3 || 'متن دلخواه ۳',
                custom_text_4: settings.custom_text_4 || 'متن دلخواه ۴',
                custom_text_5: settings.custom_text_5 || 'متن دلخواه ۵',
            };
            return String(map[key] || key);
        },
        pointerToCanvas(event) {
            const rect = this.$refs.scaledInner.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) / this.scale,
                y: (event.clientY - rect.top) / this.scale,
            };
        },
        clampPct(v) {
            return Math.round(Math.min(100, Math.max(0, v)) * 10) / 10;
        },
        emitLayout() {
            this.$emit('update:layout', JSON.parse(JSON.stringify(this.localLayout)));
        },
        onMoveStart(event, field) {
            if (event.button !== 0) return;
            event.preventDefault();
            this.selectedField = field.key;
            const pos = this.localLayout[field.key] || {};
            const pointer = this.pointerToCanvas(event);
            this.drag = {
                mode: 'move',
                fieldKey: field.key,
                startPointer: pointer,
                startX: pos.x ?? 50,
                startY: pos.y ?? 50,
            };
            event.currentTarget.setPointerCapture?.(event.pointerId);
        },
        onResizeStart(event, field, handle) {
            if (event.button !== 0) return;
            event.preventDefault();
            this.selectedField = field.key;
            const pos = this.localLayout[field.key] || {};
            const pointer = this.pointerToCanvas(event);
            const fontSize = pos.font_size ?? 14;
            const fallback = approximateTextBox(this.sampleTextFor(field.key), fontSize, this.canvasWidth);
            this.drag = {
                mode: 'resize',
                fieldKey: field.key,
                fieldType: field.type,
                handle,
                startPointer: pointer,
                startWidth: pos.width ?? pos.size ?? fallback.width,
                startHeight: pos.height ?? pos.size ?? fallback.height,
                startX: pos.x ?? 50,
                startY: pos.y ?? 50,
            };
            event.currentTarget.setPointerCapture?.(event.pointerId);
        },
        onPointerMove(event) {
            if (!this.drag) return;
            const pointer = this.pointerToCanvas(event);
            const dx = pointer.x - this.drag.startPointer.x;
            const dy = pointer.y - this.drag.startPointer.y;
            const key = this.drag.fieldKey;
            const pos = { ...this.localLayout[key] };

            if (this.drag.mode === 'move') {
                pos.x = this.clampPct(this.drag.startX + (dx / this.canvasWidth) * 100);
                pos.y = this.clampPct(this.drag.startY + (dy / this.canvasHeight) * 100);
            } else if (this.drag.mode === 'resize') {
                this.applyBoxResize(pos, dx, dy);
            }

            this.localLayout = { ...this.localLayout, [key]: pos };
            this.emitLayout();
        },
        applyBoxResize(pos, dx, dy) {
            let width = this.drag.startWidth;
            let height = this.drag.startHeight;
            let x = this.drag.startX;
            let y = this.drag.startY;
            const handle = this.drag.handle;
            const isText = this.drag.fieldType === 'text';
            const minWidth = isText ? 40 : 20;
            const minHeight = isText ? 16 : 20;
            const maxWidth = isText ? 1200 : 800;
            const maxHeight = isText ? 600 : 800;

            if (handle.includes('e')) width = this.drag.startWidth + dx;
            if (handle.includes('w')) width = this.drag.startWidth - dx;
            if (handle.includes('s')) height = this.drag.startHeight + dy;
            if (handle.includes('n')) height = this.drag.startHeight - dy;

            width = Math.round(Math.min(maxWidth, Math.max(minWidth, width)));
            height = Math.round(Math.min(maxHeight, Math.max(minHeight, height)));

            const widthDelta = width - this.drag.startWidth;
            const heightDelta = height - this.drag.startHeight;

            if (handle.includes('w')) {
                x = this.drag.startX - (widthDelta / this.canvasWidth) * 50;
            } else if (handle.includes('e')) {
                x = this.drag.startX + (widthDelta / this.canvasWidth) * 50;
            }
            if (handle.includes('n')) {
                y = this.drag.startY - (heightDelta / this.canvasHeight) * 50;
            } else if (handle.includes('s')) {
                y = this.drag.startY + (heightDelta / this.canvasHeight) * 50;
            }

            pos.width = width;
            pos.height = height;
            pos.x = this.clampPct(x);
            pos.y = this.clampPct(y);
        },
        onPointerEnd() {
            this.drag = null;
        },
    },
};
</script>

<style scoped>
.visual-editor {
    background: #f9fafb;
}
.dark .visual-editor {
    background: #111827;
}
.field-select {
    border-radius: 0.5rem;
    background: #fff;
    border: 1px solid #e5e7eb;
    padding: 0.35rem 0.5rem;
    font-size: 11px;
}
.dark .field-select {
    background: #374151;
    border-color: #4b5563;
    color: #fff;
}
.viewport {
    width: 100%;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    direction: ltr;
    padding: 16px;
    background: #e5e7eb;
    border-radius: 0.75rem;
    box-sizing: border-box;
}
.dark .viewport {
    background: #1f2937;
}
.zoom-control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    color: #6b7280;
}
.zoom-label { white-space: nowrap; }
.zoom-value { min-width: 2.5rem; text-align: end; }
.zoom-control input[type="range"] {
    width: 88px;
    accent-color: #f59e0b;
}
.canvas-outer {
    position: relative;
    flex-shrink: 0;
    margin: 0 auto;
}
.canvas-inner {
    position: relative;
    line-height: 0;
}
.cert-preview {
    margin: 0 !important;
}
.overlay-layer {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
}
.field-overlay {
    position: absolute;
    border: 1.5px dashed rgba(59, 130, 246, 0.55);
    background: rgba(59, 130, 246, 0.08);
    box-sizing: border-box;
    pointer-events: auto;
    cursor: move;
    touch-action: none;
    user-select: none;
}
.field-overlay.is-hidden {
    opacity: 0.45;
    border-style: dotted;
    border-color: rgba(156, 163, 175, 0.8);
    background: rgba(156, 163, 175, 0.1);
}
.field-overlay.active {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.12);
    z-index: 2;
}
.overlay-label {
    position: absolute;
    top: -18px;
    right: 0;
    font-size: 9px;
    line-height: 1;
    padding: 2px 4px;
    border-radius: 4px;
    background: rgba(17, 24, 39, 0.75);
    color: #fff;
    white-space: nowrap;
    pointer-events: none;
}
.resize-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #f59e0b;
    border: 1px solid #fff;
    border-radius: 2px;
    pointer-events: auto;
    touch-action: none;
}
.resize-handle.nw { top: -5px; left: -5px; cursor: nwse-resize; }
.resize-handle.ne { top: -5px; right: -5px; cursor: nesw-resize; }
.resize-handle.sw { bottom: -5px; left: -5px; cursor: nesw-resize; }
.resize-handle.se { bottom: -5px; right: -5px; cursor: nwse-resize; }
.text-handle.se { cursor: nwse-resize; }
</style>
