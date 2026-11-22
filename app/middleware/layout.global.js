/**
 * Public pages use `default` (navbar + footer).
 * App shells keep their own chrome via Panel/Admin/Auth pages.
 */
const BLANK_PREFIXES = [
  '/auth',
  '/panel',
  '/admin',
  '/messenger',
  '/oauth',
  '/checkout',
]

export default defineNuxtRouteMiddleware((to) => {
  // Respect explicit layout declared in definePageMeta
  if (to.meta.layout !== undefined) {
    setPageLayout(to.meta.layout || 'default')
    return
  }

  // Active exam taking screens run distraction-free (blank layout)
  if (to.path.endsWith('/start') || to.path.endsWith('/resume')) {
    setPageLayout('blank')
    return
  }

  const blank = BLANK_PREFIXES.some(
    (prefix) => to.path === prefix || to.path.startsWith(`${prefix}/`),
  )
  setPageLayout(blank ? 'blank' : 'default')
})
