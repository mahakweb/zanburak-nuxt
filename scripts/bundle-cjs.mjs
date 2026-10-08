import { build } from 'esbuild'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Bundle CommonJS packages that Vite 8 + optimizeDeps.noDiscovery serve as raw
 * ESM without a `default` export — which kills the Nuxt client.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'app/lib/cjs')
mkdirSync(outDir, { recursive: true })

const packages = [
  { name: 'nprogress', entry: 'node_modules/nprogress/nprogress.js' },
  { name: 'vue3-smooth-scroll', entry: 'node_modules/vue3-smooth-scroll/dist/vue-smooth-scroll.min.js' },
  { name: 'highlight', entry: 'node_modules/highlight.js/lib/common.js' },
  { name: 'moment', entry: 'node_modules/moment/moment.js' },
  { name: 'ua-parser-js', entry: 'node_modules/ua-parser-js/src/ua-parser.js' },
  { name: 'persian-number', entry: 'node_modules/persian-number/dist/persianNumber.min.js' },
  { name: 'qrcode-generator', entry: 'node_modules/qrcode-generator/dist/qrcode.js' },
  { name: 'platform', entry: 'node_modules/platform/platform.js' },
  { name: 'num2persian', entry: 'node_modules/num2persian/dist/num2persian.js' },
  // Browser UMD build — package "main" points at CJS src that has no ESM default.
  { name: 'easymde', entry: 'node_modules/easymde/dist/easymde.min.js' },
  // CJS plugin over moment — no ESM default under Vite noDiscovery.
  { name: 'moment-jalaali', entry: 'node_modules/moment-jalaali/index.js' },
  // Prefer TS source so esbuild emits real ESM `import` for highlight.js.
  {
    name: 'markdown-it-highlightjs',
    entry: 'node_modules/markdown-it-highlightjs/src/index.ts',
    external: ['highlight.js'],
  },
  { name: 'markdown-it-task-lists', entry: 'node_modules/markdown-it-task-lists/index.js' },
]

for (const pkg of packages) {
  const entry = join(root, pkg.entry)
  if (!existsSync(entry)) {
    console.warn(`[bundle-cjs] skip missing: ${pkg.name} (${pkg.entry})`)
    continue
  }
  await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    outfile: join(outDir, `${pkg.name}.mjs`),
    logLevel: 'info',
    external: ['vue', ...(pkg.external || [])],
  })
}

// Legacy paths already imported by plugins
const legacy = [
  ['highlight.mjs', 'app/lib/highlight.bundle.mjs'],
  ['nprogress.mjs', 'app/lib/nprogress.bundle.mjs'],
  ['vue3-smooth-scroll.mjs', 'app/lib/vue3-smooth-scroll.bundle.mjs'],
]
for (const [fromName, toRel] of legacy) {
  const from = join(outDir, fromName)
  const to = join(root, toRel)
  if (existsSync(from)) copyFileSync(from, to)
}
