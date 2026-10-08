<template>
    <div
        :class="['zan-md-content custom-scrollbar', startClass]"
        :style="contentLineHeight ? { lineHeight: contentLineHeight } : undefined"
        v-html="renderedHtml"
        ref="rootRef" />
</template>

<script setup>
import { computed, onMounted, onUpdated, ref, watch, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
import MarkdownItAbbr from 'markdown-it-abbr';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItFootnote from 'markdown-it-footnote';
import MarkdownItHighlightjs from 'markdown-it-highlightjs';
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import MarkdownItTasklists from 'markdown-it-task-lists';
import MarkdownItTOC from 'markdown-it-toc-done-right';
import { preprocessGfmTables } from '@/utils/markdownGfmTable';
import { preprocessColorSyntax } from '@/utils/markdownColorSyntax';
import { preprocessLineHeightSyntax } from '@/utils/markdownLineHeightSyntax';
import { setupCodeBlockChrome } from '@/utils/codeBlockChrome';
import { extractLineHeight, stripContentMeta } from '@/utils/articleContentMeta';
import { enhanceMarkdownAttachments } from '@/utils/markdownEnhancements';
import { extractVideoSegments, parseTimeToSeconds } from '@/utils/videoSegments';

const props = defineProps({
    source: { type: String, default: '' },
    startClass: { type: String, default: 'rendered-content' },
    lang: { type: String, default: '' },
});

function resolveLang() {
    if (props.lang) return props.lang === 'fa' ? 'fa' : 'en'
    if (import.meta.client) {
        try {
            const locale = localStorage.getItem('locale') || 'fa'
            return locale === 'fa' ? 'fa' : 'en'
        } catch {
            return 'fa'
        }
    }
    return 'fa'
}

const rootRef = ref(null);

function createMarkdown() {
    const md = new MarkdownIt({ html: true, linkify: true, breaks: true, typographer: true })
        .use(MarkdownItAbbr)
        .use(MarkdownItAnchor, { permalink: false })
        .use(MarkdownItFootnote)

    const hljs = import.meta.client && typeof window !== 'undefined' ? window.hljs : null
    if (hljs) {
        md.use(MarkdownItHighlightjs, { hljs, auto: true, code: true })
    }

    return md
        .use(MarkdownItSub)
        .use(MarkdownItSup)
        .use(MarkdownItTasklists, { enabled: true, label: true })
        .use(MarkdownItTOC)
}

const markdown = createMarkdown();

function linkifyTimestamps(src) {
    if (!src || typeof src !== 'string') return '';
    const linePattern = /^(\s*)(\d{1,2}:\d{2}(?::\d{2})?)(\s+)(.+)$/;
    return src.split(/\r?\n/).map((line) => {
        const m = line.match(linePattern);
        if (!m) return line;
        const seconds = parseTimeToSeconds(m[2]);
        if (seconds === null) return line;
        return `${m[1]}[${m[2]}](#t=${seconds})${m[3]}${m[4]}`;
    }).join('\n');
}

const contentLineHeight = computed(() => extractLineHeight(props.source));

const processedSource = computed(() => {
    const stripped = stripContentMeta(props.source || '');
    return preprocessLineHeightSyntax(preprocessColorSyntax(preprocessGfmTables(linkifyTimestamps(stripped))));
});
const renderedHtml = computed(() => markdown.render(processedSource.value));

let clickHandlerBound = false;
function bindTimestampClickHandler() {
    if (clickHandlerBound) return;
    document.addEventListener('click', (e) => {
        const target = e.target?.closest?.('a');
        if (!target) return;
        const href = target.getAttribute('href') || '';
        if (!href.startsWith('#t=')) return;
        e.preventDefault();
        const seconds = parseInt(href.replace('#t=', ''), 10);
        if (!Number.isNaN(seconds)) {
            window.dispatchEvent(new CustomEvent('zan:video-seek', { detail: { time: seconds } }));
        }
    });
    clickHandlerBound = true;
}

function emitSegments(segments) {
    try {
        window.dispatchEvent(new CustomEvent('zan:video-segments', { detail: { segments } }));
    } catch { /* ignore */ }
}

function enhanceRenderedContent() {
    const root = rootRef.value;
    if (!root) return;
    root.classList.add('custom-scrollbar');
    root.querySelectorAll('pre code').forEach((block) => {
        if (!block.dataset.highlighted && window.hljs?.highlightElement) {
            window.hljs.highlightElement(block);
        }
        if (window.hljs?.lineNumbersBlock && !block.querySelector('.hljs-ln')) {
            window.hljs.lineNumbersBlock(block);
        }
    });
    setupCodeBlockChrome(root);
    enhanceMarkdownAttachments(root, resolveLang());
}

async function refresh() {
    await nextTick();
    enhanceRenderedContent();
}

onMounted(() => {
    emitSegments(extractVideoSegments(props.source));
    bindTimestampClickHandler();
    refresh();
});

onUpdated(() => {
    emitSegments(extractVideoSegments(props.source));
    refresh();
});

watch(() => props.source, (val) => {
    emitSegments(extractVideoSegments(val));
    refresh();
});
</script>

<style>
@import '@/assets/css/markdown-content.css';
</style>
