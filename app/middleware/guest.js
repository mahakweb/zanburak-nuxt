import { useAuthStore } from '@/stores/auth'

/**
 * Redirect authenticated users away from login/register.
 * Honour ?redirect= when present.
 */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.status.loggedIn) return

  const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : null
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return navigateTo(redirect)
  }
  return navigateTo({ name: 'home' })
})
