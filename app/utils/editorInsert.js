/**
 * CodeMirror insert helpers — placeholder text is auto-selected for quick editing.
 */
import { toRaw } from 'vue';

const TABLE_LTR = '\u200e';

export function getCodeMirror(editorInstance) {
    const inst = toRaw(editorInstance);
    return inst?.codemirror || inst;
}

export function insertWithSelection(cm, before, after, placeholder) {
    const from = cm.getCursor();
    const startIdx = cm.indexFromPos(from);
    const selected = cm.getSelection();
    const text = selected || placeholder;
    cm.replaceSelection(before + text + after);
    const selFrom = cm.posFromIndex(startIdx + before.length);
    const selTo = cm.posFromIndex(startIdx + before.length + text.length);
    cm.setSelection(selFrom, selTo);
    cm.focus();
}

export function insertLink(cm, labelPlaceholder, urlPlaceholder) {
    const from = cm.getCursor();
    const startIdx = cm.indexFromPos(from);
    const label = cm.getSelection() || labelPlaceholder;
    const suffix = `](${urlPlaceholder})`;
    cm.replaceSelection(`[${label}${suffix}`);
    const selFrom = cm.posFromIndex(startIdx + 1);
    const selTo = cm.posFromIndex(startIdx + 1 + label.length);
    cm.setSelection(selFrom, selTo);
    cm.focus();
}

export function insertImage(cm, altPlaceholder, urlPlaceholder) {
    const from = cm.getCursor();
    const startIdx = cm.indexFromPos(from);
    const alt = cm.getSelection() || altPlaceholder;
    const suffix = `](${urlPlaceholder})`;
    cm.replaceSelection(`![${alt}${suffix}`);
    const selFrom = cm.posFromIndex(startIdx + 2);
    const selTo = cm.posFromIndex(startIdx + 2 + alt.length);
    cm.setSelection(selFrom, selTo);
    cm.focus();
}

export function insertVideo(cm, altPlaceholder, urlPlaceholder) {
    const from = cm.getCursor();
    const startIdx = cm.indexFromPos(from);
    const alt = cm.getSelection() || altPlaceholder;
    const suffix = `](${urlPlaceholder} "zan-video")`;
    cm.replaceSelection(`![${alt}${suffix}`);
    const selFrom = cm.posFromIndex(startIdx + 2);
    const selTo = cm.posFromIndex(startIdx + 2 + alt.length);
    cm.setSelection(selFrom, selTo);
    cm.focus();
}

export function insertFileLink(cm, labelPlaceholder, urlPlaceholder, sizeBytes, ext) {
    const from = cm.getCursor();
    const startIdx = cm.indexFromPos(from);
    const label = cm.getSelection() || labelPlaceholder;
    const safeExt = (ext || 'file').toLowerCase();
    const suffix = `](${urlPlaceholder} "zan-file:${sizeBytes}:${safeExt}")`;
    cm.replaceSelection(`[${label}${suffix}`);
    const selFrom = cm.posFromIndex(startIdx + 1);
    const selTo = cm.posFromIndex(startIdx + 1 + label.length);
    cm.setSelection(selFrom, selTo);
    cm.focus();
}

export function insertCodeBlock(cm, placeholder) {
    const from = cm.getCursor();
    const startIdx = cm.indexFromPos(from);
    const text = cm.getSelection() || placeholder;
    const block = `\n\`\`\`\n${text}\n\`\`\`\n`;
    cm.replaceSelection(block);
    const selFrom = cm.posFromIndex(startIdx + 5);
    const selTo = cm.posFromIndex(startIdx + 5 + text.length);
    cm.setSelection(selFrom, selTo);
    cm.focus();
}

export function insertQuote(cm, placeholder) {
    const from = cm.getCursor();
    const startIdx = cm.indexFromPos(from);
    const text = cm.getSelection() || placeholder;
    const block = `> ${text}\n`;
    cm.replaceSelection(block);
    const selFrom = cm.posFromIndex(startIdx + 2);
    const selTo = cm.posFromIndex(startIdx + 2 + text.length);
    cm.setSelection(selFrom, selTo);
    cm.focus();
}

export function insertHeading(cm, placeholder, level = 2) {
    const from = cm.getCursor();
    const startIdx = cm.indexFromPos(from);
    const text = cm.getSelection() || placeholder;
    const prefix = `${'#'.repeat(level)} `;
    cm.replaceSelection(prefix + text + '\n');
    const selFrom = cm.posFromIndex(startIdx + prefix.length);
    const selTo = cm.posFromIndex(startIdx + prefix.length + text.length);
    cm.setSelection(selFrom, selTo);
    cm.focus();
}

export function insertLineHeightBlock(cm, lineHeight, placeholder = '') {
    insertWithSelection(cm, `[lh:${lineHeight}]`, '[/lh]', placeholder);
}

export function insertTable(cm, placeholders) {
    return insertTableSized(cm, 3, 3, placeholders);
}

function tableRow(cells) {
    return `${TABLE_LTR}| ${cells.join(' | ')} |\n`;
}

export function insertTableSized(cm, rows, cols, placeholders) {
    const rawCm = toRaw(cm);
    const r = Math.max(1, Math.min(Number(rows) || 1, 20));
    const c = Math.max(1, Math.min(Number(cols) || 1, 12));
    const { cell, colLabel } = placeholders;
    const headerCells = Array.from({ length: c }, (_, i) => (
        typeof colLabel === 'function' ? colLabel(i + 1) : cell
    ));
    const header = tableRow(headerCells);
    const separator = tableRow(Array(c).fill('---'));
    const body = Array.from({ length: r }, () => tableRow(Array(c).fill(cell))).join('');
    const table = `\n${header}${separator}${body}`;
    const from = rawCm.getCursor();
    const startIdx = rawCm.indexFromPos(from);
    rawCm.replaceSelection(table);
    const cellStart = startIdx + table.indexOf(cell);
    const selFrom = rawCm.posFromIndex(cellStart);
    const selTo = rawCm.posFromIndex(cellStart + cell.length);
    rawCm.setSelection(selFrom, selTo);
    rawCm.focus();
}

export function insertAlignBlock(cm, direction, align, placeholder) {
    const text = cm.getSelection() || placeholder;
    const block = `\n<div dir="${direction}" style="text-align: ${align}">\n\n${text}\n\n</div>\n`;
    const from = cm.getCursor();
    const startIdx = cm.indexFromPos(from);
    cm.replaceSelection(block);
    const innerStart = startIdx + block.indexOf(text);
    const selFrom = cm.posFromIndex(innerStart);
    const selTo = cm.posFromIndex(innerStart + text.length);
    cm.setSelection(selFrom, selTo);
    cm.focus();
}

export function insertStyledSpan(cm, style, placeholder) {
    const text = cm.getSelection() || placeholder;
    const isBg = style.startsWith('background-color:');
    const color = style.replace(/^[^:]+:\s*/, '').trim();
    if (isBg) {
        insertWithSelection(cm, `[bg:${color}]`, '[/bg]', text);
    } else {
        insertWithSelection(cm, `[c:${color}]`, '[/c]', text);
    }
}
