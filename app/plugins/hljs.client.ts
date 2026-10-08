import hljs from '@/lib/highlight.bundle.mjs'
import { initCodeHighlightTheme } from '@/config/codeHighlightTheme'

/**
 * Use a local ESM bundle of highlight.js (see app/lib/highlight.bundle.mjs).
 * The package's dual CJS/ESM entry crashes Vite 8 client when noDiscovery is on:
 * "does not provide an export named 'default'".
 * Mirrors zanburak-frontend: window.hljs = hljs + line-numbers plugin.
 */
export default defineNuxtPlugin(async () => {
  window.hljs = hljs

  try {
    await import('highlightjs-line-numbers.js')
  } catch (e) {
    console.warn('[hljs] line-numbers plugin failed', e)
  }

  initCodeHighlightTheme()
})
