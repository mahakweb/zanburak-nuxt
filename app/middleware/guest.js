import { setActivePinia } from 'pinia'
import { useStore } from '@/composables/useStore'

/**
 * Redirect authenticated users away from login/register.
 * Honour ?redirect= when present.
 */
export default defineNuxtRouteMiddleware((to) => {
  try {
    const nuxtApp = tryUseNuxtApp()
    if (nuxtApp?.$pinia) setActivePinia(nuxtApp.$pinia)
  } catch {
    /* ignore */
  }

  const store = useStore()
  if (!store.state.auth.status.loggedIn) return

  const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : null
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return navigateTo(redirect)
  }
  return navigateTo({ name: 'home' })
})
