import { useAuthStore } from '@/stores/auth'
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

function routeRequiresAuth(to) {
  const routeLabel = routeName(to)
  return (
    to.meta?.requiresAuth === true ||
    to.meta?.middleware?.includes?.('auth') ||
    (Array.isArray(to.meta?.middleware) && to.meta.middleware.includes('auth')) ||
    to.matched?.some((r) => r.meta?.requiresAuth) ||
    ROUTE_META[routeLabel]?.requiresAuth
  )
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Admin/panel/auth routes are SPA (`ssr: false`). Running the login redirect
  // on the server paints /auth/login in the first HTML, then the browser
  // restores the Laravel session and bounces back — a visible login flash.
  if (import.meta.server) return

  const auth = useAuthStore()
  const routeLabel = routeName(to)
  const requiresAuth = routeRequiresAuth(to)

  // Only block navigation when ACL actually needs the session. Public pages
  // paint immediately; the navbar skeleton covers the in-flight /user request.
  if (!auth.status.loggedIn && requiresAuth) {
    try {
      await auth.restoreFromStorage()
    } catch (error) {
      console.error('[auth] Failed to restore session before route access', error)
    }
  }

  const isLoggedIn = auth.status.loggedIn

  if (isLoggedIn && needsMobileVerification(auth.status.userInfo)) {
    if (!MOBILE_VERIFY_ALLOWLIST.has(routeLabel)) {
      return navigateTo({
        name: 'panel-profile-manage-phone',
        query: { force_verify: '1', redirect: to.fullPath },
      })
    }
  }

  if (!requiresAuth) return

  if (!isLoggedIn) {
    return navigateTo({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }

  if (to.path.startsWith('/admin')) {
    try {
      await auth.refreshUser()
    } catch (error) {
      console.error('[auth] Failed to refresh user before admin access', error)
      if (!auth.status.loggedIn) {
        return navigateTo({
          name: 'login',
          query: { redirect: to.fullPath },
        })
      }
    }

    if (
      needsMobileVerification(auth.status.userInfo) &&
      !MOBILE_VERIFY_ALLOWLIST.has(routeLabel)
    ) {
      return navigateTo({
        name: 'panel-profile-manage-phone',
        query: { force_verify: '1', redirect: to.fullPath },
      })
    }
  }

  const aclRoute = enrichRouteForAcl(to)
  const redirect = getRouteAccessRedirect(auth.status.userInfo, aclRoute)
  if (redirect) {
    if (typeof redirect === 'string') return navigateTo(redirect)
    if (redirect.name) return navigateTo(redirect)
    if (redirect.path) return navigateTo(redirect)
  }
})
