import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
})

const fakeUser = {
  id: 1,
  name: 'Probe',
  email: 'probe@example.com',
  mobile: '09120000000',
  mobile_verified_at: '2020-01-01T00:00:00.000000Z',
  roles: [],
  permissions: [],
}

async function setupAuthMocks(page) {
  await page.route('**/api/user**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fakeUser),
    })
  })
  // Soft-mock common panel bootstrap endpoints so the page can render chrome.
  await page.route('**/api/**', async (route) => {
    const url = route.request().url()
    if (url.includes('/api/user')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fakeUser),
      })
    }
    // Let other requests continue (or fail harmlessly)
    return route.continue().catch(() => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    }))
  })
  await page.addInitScript((user) => {
    localStorage.setItem('token', JSON.stringify('probe-fake-token'))
    localStorage.setItem('user', JSON.stringify(user))
  }, fakeUser)
}

async function probe(label, url, { auth = false } = {}) {
  const context = await browser.newContext()
  const page = await context.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(`[pageerror] ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push(`[console] ${m.text().slice(0, 400)}`)
  })
  if (auth) await setupAuthMocks(page)

  const gotoErr = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 }).then(() => null).catch((e) => e.message)
  await page.waitForTimeout(6000)
  const body = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 280)
  const nuxtLen = (await page.locator('#__nuxt').innerText().catch(() => '')).replace(/\s+/g, ' ').trim().length
  console.log('\n===', label, '===')
  if (gotoErr) console.log('GOTO', gotoErr)
  console.log('FINAL', page.url())
  console.log('NUXT_LEN', nuxtLen)
  console.log('BODY', body)
  const uniq = [...new Set(errs)].filter((e) => !/favicon|devtools|401|404/.test(e)).slice(0, 12)
  if (uniq.length) console.log('ERRS', uniq)
  await context.close()
}

await probe('panel guest', 'http://localhost:3000/panel')
await probe('messenger guest', 'http://localhost:3000/messenger')
await probe('panel auth', 'http://localhost:3000/panel', { auth: true })
await probe('messenger auth', 'http://localhost:3000/messenger', { auth: true })

// Direct module resolution through Vite
const context = await browser.newContext()
const page = await context.newPage()
const errs = []
page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 120000 })
await page.waitForTimeout(2000)
const importResult = await page.evaluate(async () => {
  const out = {}
  // Resolve via bare imports that hit our Vite aliases
  try {
    const flip = await import('http://localhost:3000/_nuxt/@id/virtual:nuxt:...')
    out.note = 'skip-virtual'
  } catch { /* ignore */ }
  try {
    // Fetch the transformed module graph entry by requesting an app page chunk path is hard;
    // instead use dynamic import of aliased packages via a tiny inline module evaluation.
    const flipUrl = '/_nuxt/lib/cjs/vue3-flip-countdown.mjs'
    const leafletUrl = '/_nuxt/lib/cjs/leaflet.mjs'
    const flipRes = await fetch(flipUrl)
    const leafletRes = await fetch(leafletUrl)
    out.flipStatus = flipRes.status
    out.leafletStatus = leafletRes.status
    out.flipType = flipRes.headers.get('content-type')
    out.leafletType = leafletRes.headers.get('content-type')
    if (flipRes.ok) {
      const flip = await import(/* @vite-ignore */ flipUrl)
      out.flip = { keys: Object.keys(flip), hasCountdown: !!flip.Countdown }
    } else {
      out.flipBody = (await flipRes.text()).slice(0, 200)
    }
    if (leafletRes.ok) {
      const leaflet = await import(/* @vite-ignore */ leafletUrl)
      out.leaflet = {
        hasDefault: !!leaflet.default,
        hasMap: !!(leaflet.default?.map || leaflet.map),
        keySample: Object.keys(leaflet).slice(0, 10),
      }
    } else {
      out.leafletBody = (await leafletRes.text()).slice(0, 200)
    }
  } catch (e) {
    out.error = String(e?.message || e)
  }
  return out
})
console.log('\n=== MODULE IMPORT SMOKE ===')
console.log(JSON.stringify(importResult, null, 2))
if (errs.length) console.log('ERRS', [...new Set(errs)].slice(0, 8))

await context.close()
await browser.close()
