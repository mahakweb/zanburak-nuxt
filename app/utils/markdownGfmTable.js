/**
 * Lightweight GFM pipe-table → HTML preprocessor (no extra npm package).
 * Runs before markdown-it so tables render with html: true.
 */

const BIDI_PREFIX = /^[\u200e\u200f\u2066\u2067\u2068\u2069\ufeff]+/;

export function stripTableBidiMarks(line) {
    if (!line || typeof line !== 'string') return line;
    return line.replace(BIDI_PREFIX, '');
}

function parseRow(line) {
    return stripTableBidiMarks(line)
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim());
}

function isSeparatorRow(line) {
    const normalized = stripTableBidiMarks(line);
    return /^\s*\|?[\s:-]+(\|[\s:-]+)+\|?\s*$/.test(normalized);
}

function isTableRow(line) {
    const normalized = stripTableBidiMarks(line);
    return Boolean(normalized && /^\s*\|.+\|\s*$/.test(normalized));
}

function tableLinesToHtml(lines) {
    const header = parseRow(lines[0]);
    const bodyLines = lines.slice(2);
    const thead = `<thead><tr>${header.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`;
    const tbody = bodyLines.length
        ? `<tbody>${bodyLines.map((row) => {
            const cells = parseRow(row);
            return `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`;
        }).join('')}</tbody>`
        : '';
    return `<table class="zan-md-table">\n${thead}\n${tbody}\n</table>`;
}

export function preprocessGfmTables(src) {
    if (!src || typeof src !== 'string') return src;

    const lines = src.split('\n');
    const out = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const next = lines[i + 1];

        if (isTableRow(line) && next && isSeparatorRow(next)) {
            const tableLines = [line, next];
            let j = i + 2;
            while (j < lines.length && isTableRow(lines[j]) && !isSeparatorRow(lines[j])) {
                tableLines.push(lines[j]);
                j++;
            }
            out.push(tableLinesToHtml(tableLines));
            i = j;
            continue;
        }

        out.push(line);
        i++;
    }

    return out.join('\n');
}
