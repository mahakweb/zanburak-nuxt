import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
})
const page = await browser.newPage()
const errs = []
page.on('pageerror', (e) => errs.push(e.message))

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(1500)
errs.length = 0
await page.locator('a[href^="/course/"]').first().click({ force: true })
await page.waitForTimeout(3000)
console.log('home->course', page.url(), errs.slice(0, 3))

errs.length = 0
await page.goto('http://localhost:3000/discuss', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(1500)
const q = page.locator('a[href^="/discuss/"]').first()
if (await q.count()) {
  const href = await q.getAttribute('href')
  await q.click({ force: true })
  await page.waitForTimeout(3000)
  console.log('discuss->q', href, '=>', page.url(), errs.slice(0, 3))
}

errs.length = 0
await page.goto('http://localhost:3000/tags', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(1500)
const tag = page.locator('a[href^="/tag/"]').first()
if (await tag.count()) {
  await tag.click({ force: true })
  await page.waitForTimeout(3000)
  console.log('tags->tag', page.url(), errs.slice(0, 3))
  console.log('text', (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 140))
}

await browser.close()
