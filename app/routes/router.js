/** Nuxt vue-router bridge for legacy `@/routes/router` imports. */

let nuxtRouter = null

export function bindNuxtRouter(router) {
  nuxtRouter = router
}

const fallbackCurrentRoute = {
  value: {
    path: '/',
    fullPath: '/',
    name: undefined,
    meta: {},
    matched: [],
    params: {},
    query: {},
  },
}

const router = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === 'then') return undefined
      if (!nuxtRouter) {
        if (prop === 'currentRoute') return fallbackCurrentRoute
        if (prop === 'getRoutes') return () => []
        if (prop === 'push' || prop === 'replace' || prop === 'go' || prop === 'back' || prop === 'forward') {
          return () => Promise.resolve()
        }
        return undefined
      }
      const value = nuxtRouter[prop]
      return typeof value === 'function' ? value.bind(nuxtRouter) : value
    },
  },
)

export default router
