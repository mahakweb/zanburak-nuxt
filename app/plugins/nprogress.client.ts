import NProgress from '@/lib/nprogress.bundle.mjs'
import axiosInstance from '@/store/axiosInstance'

function isMessengerShellRoute(route: { name?: string | symbol | null }) {
  const n = route?.name
  return n === 'panel-messenger'
    || n === 'panel-messenger-chat'
    || n === 'panel-messenger-join'
    || n === 'panel-messenger-community'
}

export default defineNuxtPlugin((nuxtApp) => {
  const router = nuxtApp.$router

  // Vue Router 5: do not use the deprecated `next()` callback — it can stall navigations.
  router.beforeResolve((to, from) => {
    const messengerInternal = isMessengerShellRoute(to) && isMessengerShellRoute(from)
    if (!messengerInternal && axiosInstance && typeof axiosInstance.cancelAllPending === 'function') {
      axiosInstance.cancelAllPending()
    }
    if (to.name && !messengerInternal) {
      NProgress.start()
    }
  })

  router.afterEach((to, from) => {
    if (isMessengerShellRoute(to) && isMessengerShellRoute(from)) return
    NProgress.done()
  })
})
