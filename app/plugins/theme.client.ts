import { applyThemePreference } from '@/utils/themePreference'

export default defineNuxtPlugin(() => {
  const storedTheme = localStorage.getItem('theme')
  applyThemePreference(storedTheme || 'system', { persist: !!storedTheme, notify: false })
})
