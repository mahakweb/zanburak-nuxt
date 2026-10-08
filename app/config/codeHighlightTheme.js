/**
 * Code block syntax-highlight theme (highlight.js).
 * Styles are imported statically so Vite resolves CSS URLs (dynamic import strings fail in browser).
 */
import atomOneDark from 'highlight.js/styles/atom-one-dark.min.css?url'
import atomOneLight from 'highlight.js/styles/atom-one-light.min.css?url'
import tokyoNightDark from 'highlight.js/styles/tokyo-night-dark.min.css?url'
import tokyoNightLight from 'highlight.js/styles/tokyo-night-light.min.css?url'
import monokai from 'highlight.js/styles/monokai.min.css?url'
import outrunDark from 'highlight.js/styles/base16/outrun-dark.min.css?url'
import githubDark from 'highlight.js/styles/github-dark.min.css?url'
import githubLight from 'highlight.js/styles/github.min.css?url'

export const CODE_THEME_SETS = {
    github: { light: githubLight, dark: githubDark },
    'atom-one': { light: atomOneLight, dark: atomOneDark },
    'tokyo-night': { light: tokyoNightLight, dark: tokyoNightDark },
    monokai: { light: monokai, dark: monokai },
    outrun: { light: outrunDark, dark: outrunDark },
}

/** Pick one key from CODE_THEME_SETS */
export const ACTIVE_CODE_THEME_SET = 'atom-one'

let appliedThemeKey = null
let linkEl = null

function isDarkMode() {
    if (document.documentElement.classList.contains('dark')) return true
    if (document.documentElement.classList.contains('light')) return false

    const theme = localStorage.getItem('theme') || 'system'
    if (theme === 'dark') return true
    if (theme === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function loadThemeStylesheet(isDark) {
    const set = CODE_THEME_SETS[ACTIVE_CODE_THEME_SET] || CODE_THEME_SETS.github
    const href = isDark ? set.dark : set.light
    const themeKey = `${ACTIVE_CODE_THEME_SET}:${isDark ? 'dark' : 'light'}`
    if (appliedThemeKey === themeKey) return
    appliedThemeKey = themeKey

    if (!linkEl) {
        linkEl = document.createElement('link')
        linkEl.rel = 'stylesheet'
        linkEl.dataset.hljsTheme = '1'
        document.head.appendChild(linkEl)
    }
    linkEl.href = href
}

export function applyCodeHighlightTheme(forceDark) {
    loadThemeStylesheet(forceDark ?? isDarkMode())
}

export function initCodeHighlightTheme() {
    applyCodeHighlightTheme()
    document.documentElement.addEventListener('onChangeTheme', () => {
        appliedThemeKey = null
        applyCodeHighlightTheme()
    })
}
