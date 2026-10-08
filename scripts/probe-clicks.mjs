import { chromium } from 'playwright-core'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

// Prefer system Chrome / Edge on Windows
const candidates = [
  process.env.CHROME_PATH,
  'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe',
  'C:\\\\Program Files\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe',
].filter(Boolean)

let browser
for (const exe of candidates) {
  try {
    browser = await chromium.launch({ headless: true, executablePath: exe })
    console.log('LAUNCHED', exe)
    break
  } catch (e) {
    console.log('skip', exe, e.message.slice(0, 80))
  }
}
if (!browser) {
  console.error('No browser found')
  process.exit(1)
}

const page = await browser.newPage()
const errors = []
const consoleMsgs = []
const failedReq = []
page.on('pageerror', (e) => errors.push('PAGE: ' + e.message))
page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) {
    consoleMsgs.push(`${m.type()}: ${m.text().slice(0, 300)}`)
  }
})
page.on('requestfailed', (r) => failedReq.push(r.url().slice(0, 120) + ' ' + r.failure()?.errorText))

async function dump(label) {
  const url = page.url()
  const text = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200)
  console.log(`\n=== ${label} ===`)
  console.log('URL:', url)
  console.log('TEXT:', text)
  if (errors.length) console.log('PAGE_ERRORS:', [...new Set(errors)].slice(0, 10))
  if (consoleMsgs.length) console.log('CONSOLE:', [...new Set(consoleMsgs)].slice(0, 12))
  if (failedReq.length) console.log('FAILED_REQ:', [...new Set(failedReq)].slice(0, 8))
}

errors.length = 0; consoleMsgs.length = 0; failedReq.length = 0
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(3000)
await dump('HOME')

// Check if Vue/Nuxt hydrated
const hydrate = await page.evaluate(() => {
  const nuxt = window.__NUXT__ || window.useNuxtApp?.()
  const app = document.querySelector('#__nuxt')
  const links = [...document.querySelectorAll('a[href]')].slice(0, 25).map(a => ({
    href: a.getAttribute('href'),
    text: (a.textContent || '').trim().slice(0, 40),
    hasListener: typeof a.__vueParentComponent !== 'undefined' || !!a.__vnode,
  }))
  // try programmatic router
  let routerOk = null
  try {
    const nuxtApp = window.__NUXT_DEVTOOLS__ || null
    routerOk = !!document.querySelector('#__nuxt')?.__vue_app__
  } catch {}
  return {
    hasNuxtData: !!document.getElementById('__NUXT_DATA__') || !!window.__NUXT__,
    kids: app ? app.children.length : 0,
    linkCount: document.querySelectorAll('a[href]').length,
    sampleLinks: links,
    vueApp: !!document.querySelector('#__nuxt')?.__vue_app__,
  }
})
console.log('HYDRATE:', JSON.stringify(hydrate, null, 2))

// Click courses nav
errors.length = 0; consoleMsgs.length = 0
const coursesLink = page.locator('a[href="/courses"]').first()
if (await coursesLink.count()) {
  await coursesLink.click({ timeout: 5000 }).catch(e => console.log('click courses fail', e.message))
  await page.waitForTimeout(2500)
  await dump('CLICK /courses')
} else {
  console.log('no /courses link')
}

// Go home again and click a course card
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(2000)
const courseCard = page.locator('a[href^="/course/"]').first()
console.log('course cards', await courseCard.count())
if (await courseCard.count()) {
  const href = await courseCard.getAttribute('href')
  console.log('clicking course', href)
  errors.length = 0; consoleMsgs.length = 0
  await courseCard.click({ timeout: 5000 }).catch(e => console.log('click course fail', e.message))
  await page.waitForTimeout(3000)
  await dump('CLICK COURSE CARD')
}

// Direct navigation to courses then click
await page.goto('http://localhost:3000/courses', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(2500)
await dump('GOTO /courses')
const c2 = page.locator('a[href^="/course/"]').first()
if (await c2.count()) {
  const href = await c2.getAttribute('href')
  console.log('clicking', href)
  await c2.click()
  await page.waitForTimeout(3000)
  await dump('CLICK COURSE FROM LIST')
}

// Try router.push via evaluate
const pushResult = await page.evaluate(async () => {
  try {
    // Nuxt 3 exposes router via useRouter only inside setup; try vue app
    const app = document.querySelector('#__nuxt')?.__vue_app__
    if (!app) return { ok: false, reason: 'no vue app' }
    const provides = app._context?.provides || {}
    // find router
    let router = null
    for (const k of Object.keys(provides)) {
      const v = provides[k]
      if (v && typeof v.push === 'function' && v.currentRoute) {
        router = v
        break
      }
    }
    if (!router) return { ok: false, reason: 'no router in provides', keys: Object.keys(provides).slice(0, 20) }
    const before = router.currentRoute.value.fullPath
    await router.push('/about')
    await new Promise(r => setTimeout(r, 500))
    return { ok: true, before, after: router.currentRoute.value.fullPath }
  } catch (e) {
    return { ok: false, reason: e.message }
  }
})
console.log('ROUTER_PUSH:', pushResult)
await dump('AFTER ROUTER PUSH')

// request-project
await page.goto('http://localhost:3000/request-project', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(2500)
await dump('GOTO /request-project')

await browser.close()
