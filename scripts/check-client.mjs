import { chromium } from 'playwright-core'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
const logs = []
page.on('pageerror', (err) => logs.push(`PAGE:${err.message.slice(0, 400)}`))
page.on('console', (msg) => {
  if (msg.type() === 'error') logs.push(`ERR:${msg.text().slice(0, 250)}`)
})

for (const url of ['http://localhost:3000/', 'http://localhost:3000/courses']) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(2500)
  const info = await page.evaluate(async () => {
    const toggle = document.querySelector('[data-dropdown-toggle="otherMenu"]')
    toggle?.click()
    await new Promise((r) => setTimeout(r, 300))
    const menuOpen = !!document.getElementById('otherMenu') && !document.getElementById('otherMenu').classList.contains('hidden')
    const searchBtn = [...document.querySelectorAll('button')].find((b) => (b.textContent || '').includes('Ctrl'))
    searchBtn?.click()
    await new Promise((r) => setTimeout(r, 400))
    return {
      path: location.pathname,
      errorPage: document.body.innerText.includes('Internal Server Error'),
      hasNav: !!document.querySelector('nav'),
      menuOpen,
      searchUi: !!document.querySelector('[class*="search"], input[type="search"], input[placeholder*="جست"]') || document.body.innerText.includes('جستجو'),
      mainLen: (document.querySelector('main')?.innerText || '').length,
    }
  })
  console.log(JSON.stringify({ logs: [...logs], info }))
  logs.length = 0
}

await browser.close()
