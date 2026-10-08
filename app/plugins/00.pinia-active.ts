import { getActivePinia, setActivePinia } from 'pinia'

/**
 * Ensure Pinia is active early on every request (SSR-safe).
 * Must run before route middleware / components call useStore().
 */
export default defineNuxtPlugin({
  name: 'pinia-active',
  enforce: 'pre',
  setup() {
    try {
      const pinia = usePinia()
      if (pinia && getActivePinia() !== pinia) {
        setActivePinia(pinia)
      }
    } catch {
      /* pinia module not ready */
    }
  },
})
