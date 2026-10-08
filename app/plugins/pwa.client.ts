import { initPwaInstallListeners, registerPwaServiceWorker } from '@/composables/usePwaInstall'
import { finishPwaBootSplash } from '@/composables/pwaSplash'

export default defineNuxtPlugin(() => {
  initPwaInstallListeners()

  if (import.meta.dev) return

  registerPwaServiceWorker()
  finishPwaBootSplash()
})
