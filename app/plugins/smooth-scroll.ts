import VueSmoothScroll from '@/lib/vue3-smooth-scroll.bundle.mjs'

/**
 * Register smooth-scroll on both sides. Client gets the real plugin;
 * server gets a no-op directive so Vue SSR can call getSSRProps.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive('smooth-scroll', {
      getSSRProps() {
        return {}
      },
    })
    return
  }
  nuxtApp.vueApp.use(VueSmoothScroll, { duration: 400, updateHistory: true })
})
