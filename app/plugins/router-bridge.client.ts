import { bindNuxtRouter } from '@/routes/router'

export default defineNuxtPlugin((nuxtApp) => {
  bindNuxtRouter(nuxtApp.$router)
})
