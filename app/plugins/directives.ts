import vCan from '@/directives/can'
import vNoAutofill from '@/directives/noAutofill'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('can', vCan)
  nuxtApp.vueApp.directive('no-autofill', vNoAutofill)
})
