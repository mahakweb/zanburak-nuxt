<template>
    <div class="mail-html-body">
        <iframe
            v-if="html"
            ref="frame"
            class="w-full border-0 rounded-lg bg-white"
            :style="{ minHeight: frameHeight + 'px' }"
            sandbox="allow-same-origin"
            :srcdoc="wrappedHtml"
            @load="resizeFrame"
        />
        <div v-else-if="text" class="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-7" dir="rtl">
            {{ text }}
        </div>
        <p v-else class="text-sm text-gray-400 italic">بدون محتوا</p>
    </div>
</template>

<script>
export default {
    name: "MailHtmlBody",
    props: {
        html: { type: String, default: "" },
        text: { type: String, default: "" },
    },
    data() {
        return {
            frameHeight: 220,
        };
    },
    computed: {
        wrappedHtml() {
            if (!this.html) return "";
            return `<!DOCTYPE html><html dir="rtl" lang="fa"><head><meta charset="utf-8"><base target="_blank"><style>
                html, body { margin: 0; padding: 0; direction: rtl; text-align: right; font-family: Tahoma, Arial, sans-serif; font-size: 14px; line-height: 1.8; color: #1f2937; word-wrap: break-word; }
                img { max-width: 100%; height: auto; }
                a { color: #0d9488; }
                table { max-width: 100%; }
                ul { list-style: disc; padding-inline-start: 1.5rem; }
                ol { list-style: decimal; padding-inline-start: 1.5rem; }
                [align="left"], [style*="text-align: left"], [style*="text-align:left"] { text-align: left; direction: ltr; }
                [align="center"], [style*="text-align: center"], [style*="text-align:center"] { text-align: center; }
            </style></head><body dir="rtl">${this.html}</body></html>`;
        },
    },
    watch: {
        html() {
            this.$nextTick(this.resizeFrame);
        },
    },
    methods: {
        resizeFrame() {
            const frame = this.$refs.frame;
            if (!frame?.contentDocument?.body) return;
            const height = frame.contentDocument.body.scrollHeight;
            this.frameHeight = Math.max(220, height + 24);
        },
    },
};
</script>
