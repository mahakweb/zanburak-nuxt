<template>
    <div class="mail-rich-editor rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
        <div class="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <button type="button" class="editor-btn" title="درشت" @mousedown.prevent @click="exec('bold')"><b>B</b></button>
            <button type="button" class="editor-btn" title="کج" @mousedown.prevent @click="exec('italic')"><i>I</i></button>
            <button type="button" class="editor-btn" title="زیرخط" @mousedown.prevent @click="exec('underline')"><u>U</u></button>
            <span class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></span>
            <button type="button" class="editor-btn" title="راست‌چین" @mousedown.prevent @click="setAlign('right')">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M4 6H20M8 12H20M4 18H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </button>
            <button type="button" class="editor-btn" title="وسط‌چین" @mousedown.prevent @click="setAlign('center')">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 6H18M8 12H16M6 18H18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </button>
            <button type="button" class="editor-btn" title="چپ‌چین" @mousedown.prevent @click="setAlign('left')">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M4 6H20M4 12H16M4 18H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </button>
            <span class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></span>
            <button type="button" class="editor-btn" title="لیست" @mousedown.prevent @click="exec('insertUnorderedList')">• لیست</button>
            <button type="button" class="editor-btn" title="لیست شماره‌دار" @mousedown.prevent @click="exec('insertOrderedList')">1. لیست</button>
            <span class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></span>
            <button type="button" class="editor-btn" title="لینک" @mousedown.prevent @click="insertLink">لینک</button>
            <button type="button" class="editor-btn" title="پاک کردن قالب" @mousedown.prevent @click="exec('removeFormat')">پاک</button>
        </div>
        <div
            ref="editor"
            class="mail-editor-surface overflow-y-auto custom-scrollbar px-3 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none"
            :class="compact ? 'min-h-[72px] max-h-[160px]' : 'min-h-[140px] max-h-[320px]'"
            :data-placeholder="placeholder"
            contenteditable="true"
            dir="rtl"
            @input="onInput"
            @blur="onInput"
        ></div>
    </div>
</template>

<script>
export default {
    name: "MailRichEditor",
    props: {
        modelValue: { type: String, default: "" },
        placeholder: { type: String, default: "متن پیام..." },
        compact: { type: Boolean, default: false },
    },
    emits: ["update:modelValue", "update:html"],
    mounted() {
        if (this.modelValue) {
            this.$refs.editor.innerHTML = this.modelValue;
        }
    },
    watch: {
        modelValue(value) {
            if (this.$refs.editor && this.$refs.editor.innerHTML !== value) {
                this.$refs.editor.innerHTML = value || "";
            }
        },
    },
    methods: {
        exec(command, value = null) {
            this.focusEditor();
            let applied = document.execCommand(command, false, value);
            if (!applied && (command === "insertUnorderedList" || command === "insertOrderedList")) {
                const tag = command === "insertOrderedList" ? "ol" : "ul";
                applied = document.execCommand("insertHTML", false, `<${tag}><li><br></li></${tag}>`);
            }
            this.onInput();
            return applied;
        },
        setAlign(align) {
            const commands = { right: "justifyRight", left: "justifyLeft", center: "justifyCenter" };
            const applied = this.exec(commands[align] || "justifyRight");
            if (!applied && this.$refs.editor) {
                this.$refs.editor.style.textAlign = align;
                this.$refs.editor.setAttribute("dir", align === "left" ? "ltr" : "rtl");
                this.onInput();
            }
        },
        insertLink() {
            this.focusEditor();
            const selection = window.getSelection();
            const range = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
            const selectedText = range && !range.collapsed ? range.toString() : "";
            const url = window.prompt("آدرس لینک:", selectedText.startsWith("http") ? selectedText : "https://");
            if (!url) return;

            const href = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
            this.focusEditor();
            if (range && selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }

            const linked = document.execCommand("createLink", false, href);
            if (!linked) {
                const label = this.escapeHtml(selectedText || href);
                document.execCommand(
                    "insertHTML",
                    false,
                    `<a href="${this.escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`,
                );
            }
            this.onInput();
        },
        focusEditor() {
            this.$refs.editor?.focus();
        },
        escapeHtml(value) {
            return String(value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        },
        onInput() {
            const html = this.$refs.editor?.innerHTML || "";
            const text = this.$refs.editor?.innerText || "";
            this.$emit("update:modelValue", text.trim() ? html : "");
            this.$emit("update:html", html);
        },
        getHtml() {
            return this.$refs.editor?.innerHTML || "";
        },
        getText() {
            return this.$refs.editor?.innerText?.trim() || "";
        },
        clear() {
            if (this.$refs.editor) {
                this.$refs.editor.innerHTML = "";
                this.$refs.editor.style.textAlign = "right";
                this.$refs.editor.setAttribute("dir", "rtl");
            }
            this.$emit("update:modelValue", "");
            this.$emit("update:html", "");
        },
    },
};
</script>

<style scoped>
.editor-btn {
    @apply h-8 px-2 rounded-lg text-xs text-gray-700 dark:text-gray-200 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/40 dark:hover:text-teal-200 transition inline-flex items-center justify-center;
}

.mail-rich-editor [contenteditable]:empty:before {
    content: attr(data-placeholder);
    color: #9ca3af;
    pointer-events: none;
}

.mail-editor-surface {
    text-align: right;
}

.mail-editor-surface :deep(ul) {
    list-style: disc;
    padding-inline-start: 1.5rem;
    margin: 0.35rem 0;
}

.mail-editor-surface :deep(ol) {
    list-style: decimal;
    padding-inline-start: 1.5rem;
    margin: 0.35rem 0;
}

.mail-editor-surface :deep(li) {
    display: list-item;
    margin: 0.15rem 0;
}

.mail-editor-surface :deep(a) {
    color: #0d9488;
    text-decoration: underline;
}
</style>
