/**
 * Per-block dark/light syntax colors (scoped under .zan-code-block-wrap).
 * Global default theme set: config/codeHighlightTheme.js
 */
import { ACTIVE_CODE_THEME_SET } from '@/config/codeHighlightTheme';

export const CODE_BLOCK_THEME_DEFAULT = 'dark';
export const CODE_BLOCK_THEMES = ['dark', 'light'];

const BLOCK_THEME_CSS_SETS = new Set(['atom-one', 'github']);

export function getBlockThemeSetName() {
    if (BLOCK_THEME_CSS_SETS.has(ACTIVE_CODE_THEME_SET)) {
        return ACTIVE_CODE_THEME_SET;
    }
    return 'atom-one';
}

/** @returns {'dark'|'light'} */
export function nextCodeBlockTheme(current) {
    return current === 'dark' ? 'light' : 'dark';
}

export function applyCodeBlockTheme(wrap, theme) {
    if (!wrap) return;
    wrap.dataset.codeTheme = theme;
    wrap.dataset.codeThemeSet = getBlockThemeSetName();
}

export function initCodeBlockTheme(wrap) {
    applyCodeBlockTheme(wrap, wrap?.dataset?.codeTheme || CODE_BLOCK_THEME_DEFAULT);
}
