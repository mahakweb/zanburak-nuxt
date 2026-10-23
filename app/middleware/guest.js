import { useAuthStore } from '@/stores/auth'

/**
 * Redirect authenticated users away from login/register.
 * Honour ?redirect= when present.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const auth = useAuthStore()

  if (!auth.status.ready || !auth.status.loggedIn) {
    try {
      await auth.restoreFromStorage()
    } catch (error) {
      console.error('[auth] Failed to restore session on guest route', error)
    }
  }

  if (!auth.status.loggedIn) return

  const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : null
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return navigateTo(redirect)
  }
  return navigateTo({ name: 'home' })
})
