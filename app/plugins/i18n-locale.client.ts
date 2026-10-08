import { getLanguageByLocale } from '@/config/languages'

/**
 * Sync stored locale/dir after i18n is ready.
 * Do NOT call useI18n() in a Nuxt plugin — vue-i18n requires component setup
 * and throws "Must be called at the top of a setup function", which 500s the client.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as {
    locale: { value: string }
    setLocale?: (code: string) => Promise<void> | void
  }

  if (!localStorage.getItem('direction')) {
    localStorage.setItem('direction', 'rtl')
  }

  const stored = localStorage.getItem('locale')
  const current = i18n?.locale?.value

  if (stored && current && stored !== current && typeof i18n.setLocale === 'function') {
    Promise.resolve(i18n.setLocale(stored)).catch(() => {
      i18n.locale.value = stored
    })
  }

  const lang = getLanguageByLocale(stored || current || 'fa')
  if (lang?.dir) {
    document.documentElement.setAttribute('dir', lang.dir)
  }
})
