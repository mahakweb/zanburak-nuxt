import fa from './app/translate/locales/fa.json'
import en from './app/translate/locales/en.json'
import ar from './app/translate/locales/ar.json'
import tr from './app/translate/locales/tr.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'fa',
  messages: {
    fa,
    en,
    ar,
    tr,
  },
}))
