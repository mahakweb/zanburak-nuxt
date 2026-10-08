import { chromium } from 'playwright-core'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text().slice(0, 240))
})

async function check(label, fn) {
  errors.length = 0
  await fn()
  await page.waitForTimeout(2500)
  const text = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240)
  const unique = [...new Set(errors)]
  const bad =
    /500|Server Error|Cannot read properties|Internal Server|reading '/i.test(text)
    || unique.some((e) => /Cannot read|is not defined|Internal Server|500/.test(e))
  console.log(`=== ${label} bad=${bad}`)
  console.log(text)
  if (unique.length) console.log('ERRS:', unique.slice(0, 8))
}

const hard = [
  '/discuss/create',
  '/panel',
  '/admin',
  '/request-project',
  '/payment/callback',
  '/certificate/verify',
]

for (const u of hard) {
  await check(`goto ${u}`, async () => {
    await page.goto(`http://localhost:3000${u}`, { waitUntil: 'networkidle', timeout: 90000 })
  })
}

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 90000 })
await check('client click /contact', async () => {
  const link = page.locator('a[href="/contact"]').first()
  if (await link.count()) await link.click()
  else await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' })
})

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 90000 })
await check('client click /discuss', async () => {
  const link = page.locator('a[href="/discuss"]').first()
  if (await link.count()) await link.click()
  else await page.goto('http://localhost:3000/discuss', { waitUntil: 'networkidle' })
})

await browser.close()
