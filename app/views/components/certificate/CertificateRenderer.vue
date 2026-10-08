<template>
    <div ref="root" class="certificate-render mx-auto" :class="orientationClass"
        :style="rootStyle">
        <component :is="'style'" v-if="fontFaceCss">{{ fontFaceCss }}</component>

        <img v-if="backgroundUrl" :src="backgroundUrl" class="cert-bg" alt="" crossorigin="anonymous" />
        <div v-else class="cert-bg-fallback"></div>
        <div v-if="frameEnabled" class="cert-frame" :style="frameStyle"></div>

        <img
            v-if="logoUrl && isVisible('logo')"
            :key="'cert-logo-' + logoUrl"
            :src="logoUrl"
            class="asset-img cert-logo-img"
            alt=""
            crossorigin="anonymous"
            :style="imageStyle('logo')"
        />

        <img
            v-if="qrDataUri && isVisible('qr_code')"
            :key="'cert-qr-' + qrDataUri.slice(0, 32)"
            :src="qrDataUri"
            class="asset-img cert-qr-img"
            alt="QR"
            :style="imageStyle('qr_code')"
        />

        <div v-if="showTitle" class="field" :class="fieldClass('title')" :style="fieldStyle('title')">
            {{ titleText }}
        </div>

        <div v-if="showStudentName" class="field" :class="fieldClass('student_name')" :style="fieldStyle('student_name')">
            {{ placeholders.student_name }}
        </div>

        <div v-if="showSubtitle" class="field" :class="fieldClass('subtitle')" :style="fieldStyle('subtitle')">
            {{ subtitleText }}
        </div>

        <div v-if="showCourseName" class="field" :class="fieldClass('course_name')" :style="fieldStyle('course_name')">
            {{ placeholders.course_name }}
        </div>

        <div v-if="showDuration" class="field" :class="fieldClass('duration')" :style="fieldStyle('duration')">
            {{ durationLabel }}: {{ placeholders.duration }}
        </div>

        <div v-if="showGrade" class="field" :class="fieldClass('grade')" :style="fieldStyle('grade')">
            {{ gradeLabel }}: {{ placeholders.grade }}
        </div>

        <div v-if="showCompletionDate" class="field" :class="fieldClass('completion_date')" :style="fieldStyle('completion_date')">
            {{ dateLabel }}: {{ placeholders.completion_date }}
        </div>

        <div v-if="showInstructor" class="field instructor-block" :class="fieldClass('instructor_name')" :style="fieldStyle('instructor_name')">
            <div>{{ placeholders.instructor_name }}</div>
            <div class="instructor-label">{{ instructorLabel }}</div>
        </div>

        <div
            v-for="key in customTextKeys"
            :key="key"
            v-show="showCustomText(key)"
            class="field"
            :class="fieldClass(key)"
            :style="fieldStyle(key)"
        >
            {{ customTextValue(key) }}
        </div>

        <img
            v-if="signatureUrl && isVisible('signature')"
            :key="'cert-signature-' + signatureUrl"
            :src="signatureUrl"
            class="asset-img cert-signature-img"
            alt=""
            crossorigin="anonymous"
            :style="imageStyle('signature')"
        />

        <div v-if="showSerial" class="field serial-field" :class="fieldClass('certificate_serial')" :style="fieldStyle('certificate_serial')">
            {{ serialLabel }}: {{ placeholders.certificate_serial }}
        </div>

        <div v-if="showCertificateId" class="field id-field" :class="fieldClass('certificate_id')" :style="fieldStyle('certificate_id')">
            ID: {{ placeholders.certificate_id }}
        </div>
    </div>
</template>

<script>
import { CUSTOM_TEXT_KEYS, isFieldVisible, mergeLayout, textFieldHasBox, textFieldStyle } from '@/constants/certificateLayout';

export default {
    props: {
        render: { type: Object, required: true },
        width: { type: Number, default: null },
        height: { type: Number, default: null },
    },
    computed: {
        customTextKeys() {
            return CUSTOM_TEXT_KEYS;
        },
        canvasWidth() {
            return this.width || this.render.canvas_width || 1123;
        },
        canvasHeight() {
            return this.height || this.render.canvas_height || 794;
        },
        rootStyle() {
            return {
                width: `${this.canvasWidth}px`,
                height: `${this.canvasHeight}px`,
            };
        },
        placeholders() {
            return this.render.placeholders || {};
        },
        layout() {
            return mergeLayout(this.render.layout || {});
        },
        fontsMap() {
            return this.render.fonts || {};
        },
        settings() {
            return this.render.settings || {};
        },
        primaryColor() {
            return this.settings.primary_color || '#facc15';
        },
        frameEnabled() {
            return this.settings.frame_enabled !== false
                && (this.settings.frame_style || 'solid') !== 'none';
        },
        frameStyle() {
            const inset = Number(this.settings.frame_inset ?? 24);
            const width = Number(this.settings.frame_width ?? 3);
            const style = this.settings.frame_style || 'solid';
            const color = this.settings.frame_color || this.primaryColor;
            return {
                inset: `${inset}px`,
                border: `${width}px ${style} ${color}`,
            };
        },
        backgroundUrl() {
            return this.render.background_url;
        },
        logoUrl() {
            return this.render.logo_url;
        },
        signatureUrl() {
            return this.render.signature_url;
        },
        qrDataUri() {
            return this.render.qr_data_uri;
        },
        orientationClass() {
            return this.render.orientation === 'portrait' ? 'portrait' : 'landscape';
        },
        titleText() {
            return this.settings.title || 'گواهینامه پایان دوره';
        },
        subtitleText() {
            return this.settings.subtitle || 'این گواهینامه تایید می‌کند که';
        },
        dateLabel() {
            return this.settings.date_label || 'تاریخ اتمام';
        },
        durationLabel() {
            return this.settings.duration_label || 'مدت زمان';
        },
        gradeLabel() {
            return this.settings.grade_label || 'نمره';
        },
        serialLabel() {
            return this.settings.serial_label || 'سریال';
        },
        instructorLabel() {
            return this.settings.instructor_label || 'مدرس دوره';
        },
        showTitle() {
            return this.isVisible('title') && !!this.titleText;
        },
        showSubtitle() {
            return this.isVisible('subtitle') && !!this.subtitleText;
        },
        showStudentName() {
            return this.isVisible('student_name') && !!this.placeholders.student_name;
        },
        showCourseName() {
            return this.isVisible('course_name') && !!this.placeholders.course_name;
        },
        showDuration() {
            return this.isVisible('duration') && !!this.placeholders.duration;
        },
        showGrade() {
            return this.isVisible('grade') && !!this.placeholders.grade;
        },
        showCompletionDate() {
            return this.isVisible('completion_date') && !!this.placeholders.completion_date;
        },
        showInstructor() {
            return this.isVisible('instructor_name') && !!this.placeholders.instructor_name;
        },
        showSerial() {
            return this.isVisible('certificate_serial') && !!this.placeholders.certificate_serial;
        },
        showCertificateId() {
            return this.isVisible('certificate_id') && !!this.placeholders.certificate_id;
        },
        fontFaceCss() {
            const rules = Object.values(this.fontsMap)
                .filter((f) => f.url)
                .map((f) => `@font-face{font-family:'${f.css_family}';src:url('${f.url}') format('woff2'),url('${f.url}') format('woff'),url('${f.url}') format('truetype');font-display:swap;}`);
            return rules.join('');
        },
    },
    methods: {
        isVisible(key) {
            return isFieldVisible(this.layout[key]);
        },
        showCustomText(key) {
            return this.isVisible(key) && !!this.customTextValue(key);
        },
        customTextValue(key) {
            return (this.settings[key] || '').trim();
        },
        fieldStyle(key) {
            return textFieldStyle(this.layout[key] || {}, this.fontsMap);
        },
        fieldClass(key) {
            const pos = this.layout[key] || {};
            if (textFieldHasBox(pos)) return 'field-wrap';
            if (key === 'student_name' || key === 'course_name') return 'field-wrap';
            return null;
        },
        imageStyle(key) {
            const pos = this.layout[key] || {};
            const w = pos.width ?? pos.size ?? 100;
            const h = pos.height ?? pos.size ?? 60;
            return {
                position: 'absolute',
                zIndex: 3,
                left: `${pos.x ?? 50}%`,
                top: `${pos.y ?? 50}%`,
                transform: 'translate(-50%, -50%)',
                width: `${w}px`,
                height: `${h}px`,
                objectFit: 'contain',
            };
        },
    },
};
</script>

<style scoped>
.certificate-render {
    position: relative;
    overflow: hidden;
    background: #fff;
    font-family: Tahoma, sans-serif;
}
.cert-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}
.cert-bg-fallback {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff 100%);
    z-index: 0;
}
.cert-frame {
    position: absolute;
    z-index: 1;
    pointer-events: none;
    box-sizing: border-box;
}
.field {
    white-space: nowrap;
    outline: none;
    border: none;
}
.field-wrap {
    max-width: 80%;
    white-space: normal;
}
.instructor-block {
    white-space: normal;
}
.instructor-label {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
}
.serial-field, .id-field {
    direction: ltr;
}
</style>
