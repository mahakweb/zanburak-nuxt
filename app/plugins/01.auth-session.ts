import { setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

/**
 * Restore auth from cookie (SSR) / localStorage (client) before route middleware.
 */
export default defineNuxtPlugin({
  name: 'auth-session',
  dependsOn: ['pinia-active'],
  async setup(nuxtApp) {
    const pinia = nuxtApp.$pinia || usePinia()
    if (pinia) setActivePinia(pinia)
    const auth = useAuthStore(pinia)
    await auth.restoreFromStorage()
  },
})
