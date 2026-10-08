import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

/**
 * Bundle CommonJS packages that Vite 8 + optimizeDeps.noDiscovery serve as raw
 * ESM (no default export) — which kills the whole Nuxt client.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const packages = [
  {
    entry: join(root, 'node_modules/highlight.js/lib/common.js'),
    outfile: join(root, 'app/lib/highlight.bundle.mjs'),
  },
  {
    entry: join(root, 'node_modules/nprogress/nprogress.js'),
    outfile: join(root, 'app/lib/nprogress.bundle.mjs'),
  },
  {
    entry: join(root, 'node_modules/vue3-smooth-scroll/dist/vue-smooth-scroll.min.js'),
    outfile: join(root, 'app/lib/vue3-smooth-scroll.bundle.mjs'),
  },
]

for (const pkg of packages) {
  await build({
    entryPoints: [pkg.entry],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    outfile: pkg.outfile,
    logLevel: 'info',
  })
}
