import { createHead } from '@vueuse/head'

export default defineNuxtPlugin((nuxtApp) => {
  const head = createHead()
  nuxtApp.vueApp.use(head)
})
