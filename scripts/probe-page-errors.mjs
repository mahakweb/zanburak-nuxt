import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
})
const page = await browser.newPage()
const errs = []
page.on('pageerror', (e) => errs.push(e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errs.push(m.text().slice(0, 300))
})

const urls = [
  'http://localhost:3000/course/tailwind-css-zero-to-hero',
  'http://localhost:3000/paths',
  'http://localhost:3000/articles',
  'http://localhost:3000/about',
  'http://localhost:3000/request-project',
  'http://localhost:3000/auth/login',
]

for (const url of urls) {
  errs.length = 0
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 }).catch((e) => errs.push('GOTO: ' + e.message))
  await page.waitForTimeout(2500)
  const text = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160)
  console.log('\n===', url, '===')
  console.log('FINAL', page.url())
  console.log('TEXT', text)
  if (errs.length) console.log('ERRS', [...new Set(errs)].slice(0, 8))
}

// click flow
errs.length = 0
await page.goto('http://localhost:3000/courses', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(1500)
await page.locator('a[href^="/course/"]').first().click({ force: true })
await page.waitForTimeout(3500)
console.log('\n=== CLICK COURSE ===')
console.log('FINAL', page.url())
console.log('TEXT', (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 200))
if (errs.length) console.log('ERRS', [...new Set(errs)].slice(0, 8))

await page.goto('http://localhost:3000/articles', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(1500)
errs.length = 0
const art = page.locator('a[href^="/article/"]').first()
if (await art.count()) {
  await art.click({ force: true })
  await page.waitForTimeout(3500)
}
console.log('\n=== CLICK ARTICLE ===')
console.log('FINAL', page.url())
console.log('TEXT', (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 200))
if (errs.length) console.log('ERRS', [...new Set(errs)].slice(0, 8))

await page.goto('http://localhost:3000/paths', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(1500)
errs.length = 0
const path = page.locator('a[href^="/path/"]').first()
if (await path.count()) {
  await path.click({ force: true })
  await page.waitForTimeout(3500)
}
console.log('\n=== CLICK PATH ===')
console.log('FINAL', page.url())
console.log('TEXT', (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 200))
if (errs.length) console.log('ERRS', [...new Set(errs)].slice(0, 8))

await browser.close()
