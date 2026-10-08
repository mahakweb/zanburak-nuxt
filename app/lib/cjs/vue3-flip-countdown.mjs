/**
 * vue3-flip-countdown ships a webpack CJS/UMD lib with a named `Countdown` export.
 * Vite 8 + optimizeDeps.noDiscovery serves the raw CJS without that named export
 * → panel pages crash on `import { Countdown } from 'vue3-flip-countdown'`.
 *
 * Load the UMD build against the app's Vue and re-export Countdown.
 * Dynamic import runs after we set globalThis.Vue (static imports are hoisted).
 */
import * as VueNS from 'vue'

const Vue = VueNS.default ?? VueNS
const g = globalThis
const hadVue = Object.prototype.hasOwnProperty.call(g, 'Vue')
const prevVue = g.Vue
g.Vue = Vue

await import('../../../node_modules/vue3-flip-countdown/dist/vue3-flip-countdown.umd.min.js')

const mod = g['vue3-flip-countdown']

if (hadVue) g.Vue = prevVue
else delete g.Vue

if (!mod?.Countdown) {
  throw new Error('[vue3-flip-countdown] failed to resolve Countdown from UMD build')
}

export const Countdown = mod.Countdown
export default mod
