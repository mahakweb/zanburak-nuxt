/**
 * Portable markdown color syntax (no raw HTML in stored content).
 * Text:  [c:#2563eb]متن[/c]
 * Bg:    [bg:#fef08a]متن[/bg]
 * Converted to <span> at render time for web; mobile apps can parse the same tags.
 */

const TEXT_COLOR_RE = /\[c:([#a-zA-Z0-9(),.%\s]+)\]([\s\S]*?)\[\/c\]/g;
const BG_COLOR_RE = /\[bg:([#a-zA-Z0-9(),.%\s]+)\]([\s\S]*?)\[\/bg\]/g;

export function preprocessColorSyntax(src) {
    if (!src || typeof src !== 'string') return src;
    return src
        .replace(TEXT_COLOR_RE, (_, color, text) => `<span style="color: ${color.trim()}">${text}</span>`)
        .replace(BG_COLOR_RE, (_, color, text) => `<span style="background-color: ${color.trim()}">${text}</span>`);
}
