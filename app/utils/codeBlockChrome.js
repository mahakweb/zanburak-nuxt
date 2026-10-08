import { resetCodeBlockScroll } from '@/utils/codeBlockScroll';
import { codeBlockT } from '@/utils/codeBlockI18n';
import {
    applyCodeBlockTheme,
    CODE_BLOCK_THEME_DEFAULT,
    initCodeBlockTheme,
    nextCodeBlockTheme,
} from '@/utils/codeBlockTheme';

function themeButtonLabel(theme) {
    return theme === 'dark' ? codeBlockT('codeBlock.switchToLight') : codeBlockT('codeBlock.switchToDark');
}

function themeButtonIcon(theme) {
    if (theme === 'dark') {
        return '<svg class="zan-code-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
    }
    return '<svg class="zan-code-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

function updateThemeButton(btn, theme) {
    btn.innerHTML = themeButtonIcon(theme);
    btn.title = themeButtonLabel(theme);
    btn.setAttribute('aria-label', themeButtonLabel(theme));
    btn.dataset.theme = theme;
}

function getPlainCode(pre) {
    return pre.querySelector('code')?.textContent || pre.textContent || '';
}

function createToolbar(pre) {
    const wrap = document.createElement('div');
    wrap.className = 'zan-code-block-wrap';
    wrap.dataset.codeTheme = CODE_BLOCK_THEME_DEFAULT;

    const toolbar = document.createElement('div');
    toolbar.className = 'zan-code-toolbar';

    const themeBtn = document.createElement('button');
    themeBtn.type = 'button';
    themeBtn.className = 'zan-code-theme-btn';

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'zan-code-copy-btn';
    copyBtn.textContent = codeBlockT('codeBlock.copy');

    const parent = pre.parentNode;
    parent.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    wrap.appendChild(toolbar);

    pre.classList.add('zan-code-block', 'custom-scrollbar');

    toolbar.appendChild(themeBtn);
    toolbar.appendChild(copyBtn);

    initCodeBlockTheme(wrap);
    updateThemeButton(themeBtn, wrap.dataset.codeTheme);

    themeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = nextCodeBlockTheme(wrap.dataset.codeTheme || CODE_BLOCK_THEME_DEFAULT);
        applyCodeBlockTheme(wrap, next);
        updateThemeButton(themeBtn, next);
    });

    copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(getPlainCode(pre).trim());
            copyBtn.textContent = '✓';
            setTimeout(() => { copyBtn.textContent = codeBlockT('codeBlock.copy'); }, 2000);
        } catch {
            copyBtn.textContent = '!';
            setTimeout(() => { copyBtn.textContent = codeBlockT('codeBlock.copy'); }, 2000);
        }
    });

    return wrap;
}

export function setupCodeBlockChrome(root) {
    if (!root) return;

    root.querySelectorAll('pre').forEach((pre) => {
        if (pre.closest('.zan-code-block-wrap')) return;

        createToolbar(pre);
        resetCodeBlockScroll(pre);
    });
}
