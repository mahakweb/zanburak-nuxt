import { formatFileSize } from '@/utils/formatFileSize';
import { getFileTypeMeta } from '@/utils/fileTypeMeta';

const FILE_TITLE_PREFIX = 'zan-file:';
const VIDEO_TITLE = 'zan-video';

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildFileAttachmentHtml(href, label, sizeBytes, ext, lang = 'fa') {
    const meta = getFileTypeMeta(ext);
    const sizeText = formatFileSize(sizeBytes, 1, lang);
    const safeLabel = escapeHtml(label || meta.label);
    const safeHref = escapeHtml(href);
    return (
        `<a class="zan-file-attachment" href="${safeHref}" target="_blank" rel="noopener noreferrer" download>`
        + `<span class="zan-file-attachment__icon" style="background-color:${meta.color}">${meta.abbr}</span>`
        + `<span class="zan-file-attachment__body">`
        + `<span class="zan-file-attachment__name">${safeLabel}</span>`
        + `<span class="zan-file-attachment__meta">${meta.label} · ${sizeText}</span>`
        + `</span></a>`
    );
}

function parseFileTitle(title) {
    if (!title?.startsWith(FILE_TITLE_PREFIX)) return null;
    const parts = title.slice(FILE_TITLE_PREFIX.length).split(':');
    if (parts.length < 2) return null;
    const size = parseInt(parts[0], 10);
    const ext = parts.slice(1).join(':');
    if (Number.isNaN(size)) return null;
    return { size, ext };
}

export function enhanceMarkdownAttachments(root, lang = 'fa') {
    if (!root) return;

    root.querySelectorAll(`a[title^="${FILE_TITLE_PREFIX}"]`).forEach((anchor) => {
        const title = anchor.getAttribute('title') || '';
        const parsed = parseFileTitle(title);
        if (!parsed) return;
        const href = anchor.getAttribute('href') || '#';
        const label = anchor.textContent?.trim() || '';
        const wrapper = document.createElement('div');
        wrapper.className = 'zan-file-attachment-wrap';
        wrapper.innerHTML = buildFileAttachmentHtml(href, label, parsed.size, parsed.ext, lang);
        anchor.replaceWith(wrapper.firstElementChild);
    });

    root.querySelectorAll(`img[title="${VIDEO_TITLE}"]`).forEach((img) => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        const video = document.createElement('video');
        video.className = 'zan-md-video';
        video.src = src;
        video.controls = true;
        video.preload = 'metadata';
        if (alt) video.setAttribute('aria-label', alt);
        img.replaceWith(video);
    });
}

export function buildFileAttachmentMarkdown(label, url, sizeBytes, ext) {
    const safeExt = (ext || 'file').toLowerCase();
    return `[${label}](${url} "${FILE_TITLE_PREFIX}${sizeBytes}:${safeExt}")`;
}

export function buildVideoMarkdown(alt, url) {
    return `![${alt}](${url} "${VIDEO_TITLE}")`;
}
