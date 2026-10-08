import { useStore } from '@/composables/useStore'

/**
 * Expose Vuex-compatible `$store` for Options API components.
 */
export default defineNuxtPlugin({
  name: 'vuex-store-bridge',
  dependsOn: ['pinia-active', 'auth-session'],
  setup(nuxtApp) {
    const store = useStore()
    nuxtApp.vueApp.config.globalProperties.$store = store
    nuxtApp.provide('store', store)
  },
})
