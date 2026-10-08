import { getFileExtension } from '@/utils/fileTypeMeta';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KNOWN_EXT_RE = /\.(pdf|txt|zip|csv|png|jpe?g|gif|webp|docx?|xlsx?|pptx?|docm|xlsm|pptm)$/i;

export function isUuidLikeName(value) {
    const raw = String(value || '').trim();
    if (!raw) return true;
    const base = raw.replace(KNOWN_EXT_RE, '');
    return UUID_RE.test(base);
}

export function fileBaseName(filename) {
    if (!filename) return '';
    return String(filename).replace(/\\/g, '/').split('/').pop() || '';
}

export function defaultAttachmentTitle(filename, fallback = 'فایل پیوست') {
    const base = fileBaseName(filename).replace(KNOWN_EXT_RE, '').trim();
    if (!base || isUuidLikeName(base)) return fallback;
    return base.replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim() || fallback;
}

export function displayAttachmentTitle(attach, fallback = 'فایل پیوست') {
    const title = String(attach?.title || '').trim();
    if (title && !isUuidLikeName(title)) {
        return defaultAttachmentTitle(title, title.replace(KNOWN_EXT_RE, '') || fallback);
    }
    return defaultAttachmentTitle(attach?.url || attach?.filename || '', fallback);
}

export function attachmentExtension(attach) {
    const explicit = String(attach?.ext || '').replace(/^\./, '').toLowerCase();
    if (explicit) return explicit;
    return getFileExtension(attach?.url || attach?.filename || attach?.file?.name || attach?.title || '');
}
