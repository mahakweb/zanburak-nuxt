/**
 * vue3-flip-countdown ships a webpack CJS/UMD lib. Vite 8 + optimizeDeps.noDiscovery
 * cannot resolve the named `Countdown` export, which crashed panel pages.
 *
 * Re-export a Vue 3 SFC that matches the package props/API used in the dashboard.
 */
import Countdown from '../../views/components/countdown/FlipCountdown.vue'

export { Countdown }
export default Countdown
