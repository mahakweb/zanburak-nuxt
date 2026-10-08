import { useStore } from '@/composables/useStore'
import { getRouteAccessRedirect } from '@/utils/routePermissions'
import { ROUTE_META } from '@/utils/routeMeta'

/** Routes where an unverified-mobile user may stay without being forced to verify. */
const MOBILE_VERIFY_ALLOWLIST = new Set([
  'login',
  'register',
  'oauth-callback',
  'email-verified',
  'password-request',
  'password-reset',
  'panel-profile-manage-phone',
])

function needsMobileVerification(user) {
  if (!user?.mobile) return false
  return !user.mobile_verified_at
}

function routeName(to) {
  return to.name ?? to.meta?.name ?? null
}

/** Merge static ROUTE_META (from legacy router) into Nuxt route meta for ACL checks. */
function enrichRouteForAcl(to) {
  const name = routeName(to)
  const staticMeta = name ? ROUTE_META[name] || {} : {}
  const meta = {
    requiresAuth: true,
    ...staticMeta,
    ...to.meta,
  }
  const matched = (to.matched?.length ? to.matched : [{ meta: to.meta, path: to.path }]).map(
    (record) => ({
      ...record,
      meta: {
        ...staticMeta,
        ...(record.meta || {}),
        requiresAuth: record.meta?.requiresAuth ?? staticMeta.requiresAuth ?? meta.requiresAuth,
      },
    }),
  )
  return { ...to, meta, matched }
}

export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const nuxtApp = tryUseNuxtApp()
    if (nuxtApp?.$pinia) {
      const { setActivePinia } = await import('pinia')
      setActivePinia(nuxtApp.$pinia)
    }
  } catch {
    /* ignore */
  }

  const store = useStore()

  // Ensure cookie/localStorage session is restored before ACL checks (hard refresh).
  if (!store.state.auth.status.loggedIn) {
    try {
      await store.dispatch('auth/restoreFromStorage')
    } catch {
      /* ignore restore errors */
    }
  }

  const isLoggedIn = store.state.auth.status.loggedIn
  const routeLabel = routeName(to)

  if (isLoggedIn && needsMobileVerification(store.state.auth.status.userInfo)) {
    if (!MOBILE_VERIFY_ALLOWLIST.has(routeLabel)) {
      return navigateTo({
        name: 'panel-profile-manage-phone',
        query: { force_verify: '1', redirect: to.fullPath },
      })
    }
  }

  const requiresAuth =
    to.meta?.requiresAuth === true ||
    to.meta?.middleware?.includes?.('auth') ||
    (Array.isArray(to.meta?.middleware) && to.meta.middleware.includes('auth')) ||
    to.matched?.some((r) => r.meta?.requiresAuth) ||
    ROUTE_META[routeLabel]?.requiresAuth

  if (!requiresAuth) return

  if (!isLoggedIn) {
    return navigateTo({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }

  if (to.path.startsWith('/admin')) {
    try {
      await store.dispatch('auth/refreshUser')
    } catch {
      if (!store.state.auth.status.loggedIn) {
        return navigateTo({
          name: 'login',
          query: { redirect: to.fullPath },
        })
      }
    }

    if (
      needsMobileVerification(store.state.auth.status.userInfo) &&
      !MOBILE_VERIFY_ALLOWLIST.has(routeLabel)
    ) {
      return navigateTo({
        name: 'panel-profile-manage-phone',
        query: { force_verify: '1', redirect: to.fullPath },
      })
    }
  }

  const aclRoute = enrichRouteForAcl(to)
  const redirect = getRouteAccessRedirect(store.state.auth.status.userInfo, aclRoute)
  if (redirect) {
    if (typeof redirect === 'string') return navigateTo(redirect)
    if (redirect.name) return navigateTo(redirect)
    if (redirect.path) return navigateTo(redirect)
  }
})
