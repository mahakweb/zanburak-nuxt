import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
})
const context = await browser.newContext()
const page = await context.newPage()

const errs = []
const badMime = []
page.on('pageerror', (e) => errs.push(`[pageerror] ${e.message}`))
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errs.push(`[${m.type()}] ${m.text().slice(0, 400)}`)
})
page.on('response', async (res) => {
  const url = res.url()
  if (!url.includes('/_nuxt/')) return
  const ct = res.headers()['content-type'] || ''
  if (url.includes('.js') || url.includes('.mjs') || url.includes('.vue') || url.includes('@fs')) {
    if (ct.includes('json') || ct.includes('text/html')) {
      const body = await res.text().catch(() => '')
      badMime.push({ url: url.slice(0, 180), status: res.status(), ct, body: body.slice(0, 180) })
    }
  }
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

// Only mock backend API host — never touch Vite /_nuxt assets.
await page.route(/http:\/\/localhost:8000\/api\/.*/, async (route) => {
  const url = route.request().url()
  if (url.includes('/user')) {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeUser) })
  }
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) })
})

await page.addInitScript((user) => {
  localStorage.setItem('token', JSON.stringify('probe-fake-token'))
  localStorage.setItem('user', JSON.stringify(user))
  document.cookie = 'zb_token=' + encodeURIComponent('probe-fake-token') + '; Path=/; Max-Age=2592000; SameSite=Lax'
}, fakeUser)

await page.goto('http://localhost:3000/messenger', { waitUntil: 'networkidle', timeout: 180000 }).catch((e) => {
  errs.push('[goto] ' + e.message)
})
await page.waitForTimeout(8000)

const spin = await page.locator('.animate-spin').count()
const text = (await page.locator('#__nuxt').innerText().catch(() => '')).replace(/\s+/g, ' ').trim()
const html = (await page.locator('#__nuxt').innerHTML().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400)

console.log('FINAL', page.url())
console.log('spin', spin, 'textLen', text.length)
console.log('TEXT', text.slice(0, 300))
console.log('HTML', html)
console.log('BAD_MIME', badMime.slice(0, 8))
console.log('ERRS', [...new Set(errs)].slice(0, 20))

await browser.close()
