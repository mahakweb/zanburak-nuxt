/**
 * Leaflet's package "main" is CJS (`leaflet-src.js`) with no ESM default.
 * Vite 8 + optimizeDeps.noDiscovery serves it raw → `import L from 'leaflet'` crashes.
 * Re-export the real ESM build and provide a namespace default for legacy imports.
 */
export * from '../../../node_modules/leaflet/dist/leaflet-src.esm.js'
import * as Leaflet from '../../../node_modules/leaflet/dist/leaflet-src.esm.js'

export default Leaflet
