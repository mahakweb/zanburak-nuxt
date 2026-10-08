/**
 * Public pages use `default` (navbar + footer).
 * App shells keep their own chrome via Panel/Admin/Auth pages.
 */
const BLANK_PREFIXES = [
  '/auth',
  '/panel',
  '/admin',
  '/messenger',
  '/cart',
  '/oauth',
  '/checkout',
  '/certificate',
  '/quiz',
  '/payment',
]

export default defineNuxtRouteMiddleware((to) => {
  const blank = BLANK_PREFIXES.some(
    (prefix) => to.path === prefix || to.path.startsWith(`${prefix}/`),
  )
  setPageLayout(blank ? 'blank' : 'default')
})
