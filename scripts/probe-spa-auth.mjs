import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
})

const fakeUser = {
  id: 1,
  name: 'Probe',
  email: 'p@x.com',
  mobile: '09120000000',
  mobile_verified_at: '2020-01-01T00:00:00.000000Z',
  roles: [],
  permissions: [],
}

async function check(url, { auth = true } = {}) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))

  if (auth) {
    await page.route(/http:\/\/localhost:8000\/api\/.*/, async (route) => {
      const u = route.request().url()
      if (u.includes('/user')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(fakeUser),
        })
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      })
    })
    await page.addInitScript((u) => {
      localStorage.setItem('token', JSON.stringify('t'))
      localStorage.setItem('user', JSON.stringify(u))
      document.cookie = 'zb_token=t; Path=/; Max-Age=2592000; SameSite=Lax'
    }, fakeUser)
  }

  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(3000)
  const text = (await page.locator('#__nuxt').innerText()).replace(/\s+/g, ' ').trim()
  const fatal = errs.filter((e) => !/emojiCategory|usehead|inject|Unhead|Pusher/.test(e))
  console.log(url, auth ? 'auth' : 'guest', '->', page.url(), 'len=' + text.length)
  console.log(' ', text.slice(0, 140))
  if (fatal.length) console.log('  FATAL', fatal.slice(0, 5))
  await ctx.close()
}

await check('http://localhost:3000/panel', { auth: false })
await check('http://localhost:3000/messenger', { auth: false })
await check('http://localhost:3000/panel', { auth: true })
await check('http://localhost:3000/messenger', { auth: true })
await browser.close()
