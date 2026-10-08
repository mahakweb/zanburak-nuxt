import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
})
const page = await browser.newPage()
const logs = []
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text().slice(0, 400)}`))
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))

await page.goto('http://localhost:3000/courses', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(2000)

const result = await page.evaluate(async () => {
  const out = { steps: [] }
  const app = document.querySelector('#__nuxt')?.__vue_app__
  out.hasApp = !!app

  // Find router via vue-router injection symbol
  let router = null
  const provides = app?._context?.provides || {}
  for (const k of Reflect.ownKeys(provides)) {
    const v = provides[k]
    if (v && typeof v?.push === 'function' && v.currentRoute) {
      router = v
      out.routerKey = String(k)
      break
    }
  }
  out.hasRouter = !!router
  if (!router) return out

  out.current = router.currentRoute.value.fullPath
  out.routeNames = router.getRoutes().map(r => r.name).filter(Boolean).slice(0, 80)
  out.hasCourseShow = router.getRoutes().some(r => r.name === 'course.show')
  out.hasPathShow = router.getRoutes().some(r => r.name === 'path.show')
  out.hasArticleShow = router.getRoutes().some(r => r.name === 'article-show')
  out.hasRequestProject = router.getRoutes().some(r => r.name === 'request-project')
  out.hasPanel = router.getRoutes().some(r => r.name === 'panel' || r.name === 'panel-index')

  // Try push by path
  try {
    const r = await router.push('/course/tailwind-css-zero-to-hero')
    out.pushPath = { ok: true, result: String(r), after: router.currentRoute.value.fullPath }
  } catch (e) {
    out.pushPath = { ok: false, err: e.message, after: router.currentRoute.value.fullPath }
  }

  // Try push by name
  try {
    const r = await router.push({ name: 'course.show', params: { courseSlug: 'tailwind-css-zero-to-hero' } })
    out.pushName = { ok: true, result: String(r), after: router.currentRoute.value.fullPath }
  } catch (e) {
    out.pushName = { ok: false, err: e.message, after: router.currentRoute.value.fullPath }
  }

  // Check first course link click simulation
  const a = document.querySelector('a[href^="/course/"]')
  if (a) {
    out.linkHref = a.getAttribute('href')
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    const cancelled = !a.dispatchEvent(ev)
    out.clickCancelled = cancelled
    out.defaultPrevented = ev.defaultPrevented
    await new Promise(r => setTimeout(r, 800))
    out.afterClick = router.currentRoute.value.fullPath
    out.windowHref = location.href
  }

  return out
})

console.log(JSON.stringify(result, null, 2))
console.log('LOGS:')
for (const l of logs.slice(-30)) console.log(l)

await browser.close()
