export const LINE_HEIGHT_MARKER_RE = /^<!--\s*zan-line-height:([\d.]+)\s*-->\n?/;

export function extractLineHeight(content) {
    const match = (content || '').match(LINE_HEIGHT_MARKER_RE);
    return match ? match[1] : null;
}

export function stripContentMeta(content) {
    return (content || '').replace(LINE_HEIGHT_MARKER_RE, '');
}

export function setLineHeightMarker(content, value) {
    const stripped = stripContentMeta(content);
    const normalized = String(value || '').trim();
    if (!normalized) return stripped;
    return `<!-- zan-line-height:${normalized} -->\n\n${stripped}`;
}
