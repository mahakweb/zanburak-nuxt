/**
 * Portable markdown line-height syntax (no raw HTML in stored content).
 * Block: [lh:0.75]متن چندخطی[/lh]
 * Converted to a styled wrapper at render time.
 */

const LINE_HEIGHT_RE = /\[lh:([\d.]+)\]([\s\S]*?)\[\/lh\]/g;

function sanitizeLineHeight(value) {
    const v = String(value || '').trim();
    if (!/^[\d.]+$/.test(v)) return '1.75';
    const n = parseFloat(v);
    if (Number.isNaN(n) || n < 0.5 || n > 3) return '1.75';
    return v;
}

export function preprocessLineHeightSyntax(src) {
    if (!src || typeof src !== 'string') return src;
    return src.replace(
        LINE_HEIGHT_RE,
        (_, lineHeight, text) => (
            `<div markdown="1" class="zan-lh-block" style="line-height: ${sanitizeLineHeight(lineHeight)}">${text}</div>`
        ),
    );
}
