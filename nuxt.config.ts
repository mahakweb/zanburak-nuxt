import { fileURLToPath } from 'node:url'

const appRoot = fileURLToPath(new URL('./app', import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  /**
   * Default = SPA. SSR for public SEO surfaces (lists + detail + about/contact).
   * Auth/panel/admin/messenger/editor flows stay client-only.
   */
  routeRules: {
    '/**': { ssr: false },

    // Public SEO pages
    '/': { ssr: true },
    '/courses': { ssr: true },
    '/course/**': { ssr: true },
    '/paths': { ssr: true },
    '/path/**': { ssr: true },
    '/articles': { ssr: true },
    '/article/**': { ssr: true },
    '/discuss': { ssr: true },
    '/discuss/**': { ssr: true },
    '/tags': { ssr: true },
    // Use /tag/* (not /tag/**): with sibling /tags, /tag/** can normalize to /tag/
    // and fail to match /tag/:slug — leaving the page as SPA.
    '/tag/*': { ssr: true },
    '/faq': { ssr: true },
    '/what-is-vip': { ssr: true },
    '/what-is-certification': { ssr: true },
    '/about': { ssr: true },
    '/contact': { ssr: true },

    // Discuss editor flows stay SPA under /discuss/**
    '/discuss/create': { ssr: false },
    '/discuss/**/edit': { ssr: false },
  },

  css: [
    '~/assets/tailwind.css',
    '~/assets/css/messenger-theme.css',
    'nprogress/nprogress.css',
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl',
      },
      bodyAttrs: {
        class: 'rtl:font-YekanBakh bg-slate-100 dark:bg-gray-800 custom-scrollbar',
      },
      // Theme/dir + sync legacy localStorage token → cookie before Vue boots
      script: [
        {
          innerHTML:
            "(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');var dark=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);d.classList.toggle('dark',!!dark);var dir=localStorage.getItem('direction');if(dir)d.setAttribute('dir',dir);var raw=localStorage.getItem('token');if(raw){var tok=JSON.parse(raw);if(tok){document.cookie='zb_token='+encodeURIComponent(tok)+'; Path=/; Max-Age=2592000; SameSite=Lax';}}}catch(e){}})();",
          tagPosition: 'head',
        },
      ],
    },
  },

  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  alias: {
    '@': appRoot,
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL
        || (process.env.NODE_ENV === 'production' ? 'https://zanburak.ir' : 'http://localhost:3000'),
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL
        || (process.env.NODE_ENV === 'production' ? 'https://api.zanburak.ir/api' : 'http://localhost:8000/api'),
      googleRecaptchaSitekey: process.env.NUXT_PUBLIC_RECAPTCHA_SITEKEY
        || (process.env.NODE_ENV === 'production'
          ? '6LekVqQrAAAAAKtusONUqgC840FJxDon_RilcxGN'
          : '6LccV6QrAAAAAPJg8qA5ZjGfXGZrBn5xjEZ8Irox'),
      pusher: {
        key: process.env.NUXT_PUBLIC_PUSHER_KEY
          || (process.env.NODE_ENV === 'production' ? 'zb_live_3kf9d2m7p1q8' : 'zanburak-key'),
        cluster: process.env.NUXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
        wsHost: process.env.NUXT_PUBLIC_PUSHER_WS_HOST
          || (process.env.NODE_ENV === 'production' ? 'api.zanburak.ir' : 'localhost'),
        wsPort: Number(process.env.NUXT_PUBLIC_PUSHER_WS_PORT
          || (process.env.NODE_ENV === 'production' ? 443 : 6001)),
        wssPort: Number(process.env.NUXT_PUBLIC_PUSHER_WSS_PORT
          || (process.env.NODE_ENV === 'production' ? 443 : 6001)),
        forceTLS: process.env.NUXT_PUBLIC_PUSHER_FORCE_TLS != null
          ? process.env.NUXT_PUBLIC_PUSHER_FORCE_TLS === 'true'
          : process.env.NODE_ENV === 'production',
      },
    },
  },

  i18n: {
    locales: [
      { code: 'fa', language: 'fa-IR', dir: 'rtl' },
      { code: 'en', language: 'en-US', dir: 'ltr' },
      { code: 'ar', language: 'ar', dir: 'rtl' },
      { code: 'tr', language: 'tr-TR', dir: 'ltr' },
    ],
    defaultLocale: 'fa',
    strategy: 'no_prefix',
    vueI18n: fileURLToPath(new URL('./i18n.config.ts', import.meta.url)),
    detectBrowserLanguage: false,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    // Vite 8 / Rolldown dep-scan treats `#components` as a package import of
    // `@nuxtjs/i18n` (NuxtLinkLocale). Skip discovery; keep explicit includes.
    resolve: {
      alias: [
        // CJS lodash subpaths have no ESM default export under noDiscovery → crash client.
        { find: /^lodash\/(.*)$/, replacement: 'lodash-es/$1.js' },
        { find: 'lodash', replacement: 'lodash-es' },
        // Exact-match only so CSS / subpath imports keep working.
        { find: /^nprogress$/, replacement: fileURLToPath(new URL('./app/lib/cjs/nprogress.mjs', import.meta.url)) },
        { find: /^vue3-smooth-scroll$/, replacement: fileURLToPath(new URL('./app/lib/cjs/vue3-smooth-scroll.mjs', import.meta.url)) },
        { find: /^moment$/, replacement: fileURLToPath(new URL('./app/lib/cjs/moment.mjs', import.meta.url)) },
        // Upstream locale UMD crashes under Vite ESM (`this` is undefined).
        { find: /^moment\/locale\/fa$/, replacement: fileURLToPath(new URL('./app/lib/cjs/moment-locale-fa.mjs', import.meta.url)) },
        { find: /^ua-parser-js$/, replacement: fileURLToPath(new URL('./app/lib/cjs/ua-parser-js.mjs', import.meta.url)) },
        { find: /^persian-number$/, replacement: fileURLToPath(new URL('./app/lib/cjs/persian-number.mjs', import.meta.url)) },
        { find: /^qrcode-generator$/, replacement: fileURLToPath(new URL('./app/lib/cjs/qrcode-generator.mjs', import.meta.url)) },
        { find: /^platform$/, replacement: fileURLToPath(new URL('./app/lib/cjs/platform.mjs', import.meta.url)) },
        { find: /^num2persian$/, replacement: fileURLToPath(new URL('./app/lib/cjs/num2persian.mjs', import.meta.url)) },
        // Only the package root — styles stay on node_modules/highlight.js/styles/*
        { find: /^highlight\.js$/, replacement: fileURLToPath(new URL('./app/lib/cjs/highlight.mjs', import.meta.url)) },
        // vue-easymde does `import EasyMDE from 'easymde'`; package main is CJS src.
        { find: /^easymde$/, replacement: fileURLToPath(new URL('./app/lib/cjs/easymde.mjs', import.meta.url)) },
        // vue-easymde nested marked@2 UMD + root marked@4 named-only — unify default export.
        { find: /^marked$/, replacement: fileURLToPath(new URL('./app/lib/cjs/marked.mjs', import.meta.url)) },
        { find: /^markdown-it-highlightjs$/, replacement: fileURLToPath(new URL('./app/lib/cjs/markdown-it-highlightjs.mjs', import.meta.url)) },
        { find: /^markdown-it-task-lists$/, replacement: fileURLToPath(new URL('./app/lib/cjs/markdown-it-task-lists.mjs', import.meta.url)) },
        { find: /^moment-jalaali$/, replacement: fileURLToPath(new URL('./app/lib/cjs/moment-jalaali.mjs', import.meta.url)) },
        // Leaflet main is CJS; ESM build has named exports only — provide default.
        { find: /^leaflet$/, replacement: fileURLToPath(new URL('./app/lib/cjs/leaflet.mjs', import.meta.url)) },
        // Webpack CJS lib — named `Countdown` missing under noDiscovery.
        { find: /^vue3-flip-countdown$/, replacement: fileURLToPath(new URL('./app/lib/cjs/vue3-flip-countdown.mjs', import.meta.url)) },
      ],
    },
    optimizeDeps: {
      // Vite 8: noDiscovery skips auto CJS→ESM prebundle; list browser deps explicitly
      // or highlight.js / flowbite load as raw CJS and crash the client (no menus / no API).
      noDiscovery: true,
      include: [
        'lodash-es',
        'axios',
        'vue',
        'pinia',
        'highlightjs-line-numbers.js',
        'flowbite',
        'markdown-it',
        'markdown-it-abbr',
        'markdown-it-anchor',
        'markdown-it-footnote',
        'markdown-it-sub',
        'markdown-it-sup',
        'markdown-it-toc-done-right',
        'swiper',
        'swiper/vue',
        'chart.js',
        'vue-chartjs',
      ],
      needsInterop: [
        'highlightjs-line-numbers.js',
      ],
      exclude: [
        'nprogress',
        'vue3-smooth-scroll',
        'highlight.js',
        'moment',
        'moment-jalaali',
        'ua-parser-js',
        'persian-number',
        'qrcode-generator',
        'platform',
        'num2persian',
        'easymde',
        'marked',
        'markdown-it-highlightjs',
        'markdown-it-task-lists',
        'leaflet',
        'vue3-flip-countdown',
      ],
    },
    ssr: {
      noExternal: ['lodash-es'],
    },
    build: {
      // vue-plyr CSS uses :after:empty; lightningcss minify rejects it
      cssMinify: false,
    },
  },

  // Nuxt 4.6.0 on Windows leaves the SSR renderer external, so every page
  // 500s with "Either manifest or precomputed data must be provided".
  nitro: {
    externals: {
      inline: [/[\\/]node_modules[\\/]nuxt[\\/]dist[\\/]/],
    },
  },
})
