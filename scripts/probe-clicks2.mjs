import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
})
const page = await browser.newPage()
const errs = []
page.on('pageerror', (e) => errs.push(e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errs.push(m.text().slice(0, 240))
})

async function check(label, url, clickSel) {
  errs.length = 0
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(1500)
  if (clickSel) {
    const el = page.locator(clickSel).first()
    if (await el.count()) {
      await el.click({ force: true, timeout: 8000 })
      await page.waitForTimeout(3000)
    } else {
      console.log(label, 'NO SELECTOR MATCH')
    }
  }
  const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 180)
  console.log(`=== ${label} ===`)
  console.log('URL', page.url())
  console.log('TEXT', text)
  if (errs.length) console.log('ERRS', [...new Set(errs)].slice(0, 6))
}

await check('home->course', 'http://localhost:3000/', 'a[href^="/course/"]')
await check('courses->course', 'http://localhost:3000/courses', 'a[href^="/course/"]')
await check('articles->article', 'http://localhost:3000/articles', 'a[href^="/article/"]')
await check('paths->path', 'http://localhost:3000/paths', 'a[href^="/path/"]')
await check('nav request-project', 'http://localhost:3000/', 'a[href="/request-project"]')
await check('direct course', 'http://localhost:3000/course/tailwind-css-zero-to-hero')
await check('direct about', 'http://localhost:3000/about')
await check('direct panel', 'http://localhost:3000/panel')

await browser.close()
