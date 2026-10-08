const THEMES = new Set(['system', 'light', 'dark']);

export function normalizeThemePreference(theme) {
  return THEMES.has(theme) ? theme : 'system';
}

export function applyThemePreference(theme, { persist = true, notify = true } = {}) {
  const preference = normalizeThemePreference(theme);
  const prefersDark = preference === 'dark'
    || (preference === 'system'
      && typeof window !== 'undefined'
      && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', prefersDark);
    if (notify) {
      document.documentElement.dispatchEvent(new Event('onChangeTheme'));
    }
  }

  if (persist && typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', preference);
  }

  return preference;
}
