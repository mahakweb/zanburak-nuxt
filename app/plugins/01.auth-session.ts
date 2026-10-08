import { setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import {
  clearServerRequestToken,
  getAuthToken,
  setServerRequestToken,
} from '@/utils/authToken'

/**
 * Restore auth from cookie (SSR) / localStorage (client) before route middleware.
 * Injects the token into a request-scoped slot so axios can read it without composables.
 */
export default defineNuxtPlugin({
  name: 'auth-session',
  dependsOn: ['pinia-active'],
  async setup(nuxtApp) {
    const token = getAuthToken()
    setServerRequestToken(token)

    if (import.meta.server) {
      nuxtApp.hook('app:rendered', () => {
        clearServerRequestToken()
      })
    }

    const pinia = nuxtApp.$pinia || usePinia()
    if (pinia) setActivePinia(pinia)
    const auth = useAuthStore(pinia)
    await auth.restoreFromStorage()
  },
})
