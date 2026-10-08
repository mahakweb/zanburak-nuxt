import { useHead } from '@vueuse/head'

/**
 * Apply noindex/nofollow on private app surfaces so Google doesn't index
 * panel, admin, messenger, cart, payment, auth, etc.
 * Page-level useSEO() can still set titles; robots from this win when private.
 */
const PRIVATE_PREFIXES = [
  '/panel',
  '/admin',
  '/messenger',
  '/cart',
  '/payment',
  '/auth',
  '/oauth',
]

const PRIVATE_EXACT = new Set([
  '/email-verified',
  '/request-project',
  '/discuss/create',
])

export function isPrivateSeoPath(path) {
  const p = String(path || '')
  if (PRIVATE_EXACT.has(p)) return true
  if (/^\/discuss\/.+\/edit$/.test(p)) return true
  return PRIVATE_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))
}

export function applyRouteRobots(path) {
  const privatePage = isPrivateSeoPath(path)
  useHead({
    meta: [
      {
        name: 'robots',
        content: privatePage
          ? 'noindex, nofollow, noarchive'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        name: 'googlebot',
        content: privatePage
          ? 'noindex, nofollow, noarchive'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        name: 'bingbot',
        content: privatePage ? 'noindex, nofollow' : 'index, follow',
      },
    ],
  })
}
