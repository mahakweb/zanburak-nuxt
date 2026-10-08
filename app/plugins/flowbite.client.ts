import { initDropdowns, initPopovers, initTooltips } from 'flowbite'

/**
 * Re-init Flowbite interactive widgets after route changes (same package as zanburak-frontend: 1.8.x).
 * Navbar also calls initDropdowns locally; this covers late-mounted menus.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const refresh = () => {
    try {
      initDropdowns()
      initPopovers()
      initTooltips()
    } catch (e) {
      console.warn('[flowbite] init failed', e)
    }
  }

  nuxtApp.hook('page:finish', () => {
    nextTick(refresh)
  })

  if (import.meta.client) {
    nextTick(refresh)
  }
})
