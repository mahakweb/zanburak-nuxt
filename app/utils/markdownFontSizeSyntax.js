/**
 * Portable markdown font-size syntax (no raw HTML in stored content).
 * Text:  [size:18]متن[/size] or [size:18px]متن[/size] or [s:18]متن[/s]
 * Converted to <span style="font-size: ...px"> at render time for web.
 */

export function sanitizeFontSize(size) {
    const s = String(size || '').trim().toLowerCase();
    if (/^\d+(?:\.\d+)?(px|pt|rem|em)$/.test(s)) {
        return s;
    }
    const num = parseFloat(s);
    if (!Number.isNaN(num) && num > 0) {
        return `${num}px`;
    }
    return '16px';
}

export function preprocessFontSizeSyntax(src) {
    if (!src || typeof src !== 'string') return src;
    let result = src;
    let passes = 0;
    while (passes < 5 && /\[(?:size|s):([0-9.]+(?:px|pt|rem|em)?)\](?:(?!\[(?:size|s):)[\s\S])*?\[\/(?:size|s)\]/i.test(result)) {
        result = result.replace(
            /\[(?:size|s):([0-9.]+(?:px|pt|rem|em)?)\]((?:(?!\[(?:size|s):)[\s\S])*?)\[\/(?:size|s)\]/gi,
            (_, size, text) => {
                const cleanSize = sanitizeFontSize(size);
                return `<span style="font-size: ${cleanSize}">${text}</span>`;
            }
        );
        passes++;
    }
    return result;
}
