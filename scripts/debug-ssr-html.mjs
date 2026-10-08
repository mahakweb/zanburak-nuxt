import { chromium } from 'playwright-core'

// 1) nesting violations
const html = await fetch('http://localhost:3000/articles').then((r) => r.text())
const layoutStart = html.indexOf('<div class="min-h-screen flex flex-col">')
const mainIdx = html.indexOf('<main', layoutStart)
const beforeMain = html.slice(layoutStart, mainIdx)
const tagRe = /<\/?(a|button|div|span)\b[^>]*>/gi
const stack = []
const violations = []
let m
while ((m = tagRe.exec(beforeMain))) {
  const full = m[0]
  const name = m[1].toLowerCase()
  const isClose = full.startsWith('</')
  if (/\/>$/.test(full)) continue
  if (!isClose) {
    for (const parent of stack) {
      if ((parent === 'a' || parent === 'button') && (name === 'a' || name === 'button')) {
        violations.push(`${parent}>${name}`)
      }
      if (parent === 'span' && name === 'div') violations.push('span>div')
    }
    stack.push(name)
  } else {
    const idx = stack.lastIndexOf(name)
    if (idx >= 0) stack.splice(idx)
  }
}
console.log('violations', violations)

// 2) browser SSR parse + live hydrate
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.setContent(html, { waitUntil: 'domcontentloaded' })
const ssr = await page.evaluate(() => {
  const nuxt = document.querySelector('#__nuxt')
  const layout = nuxt?.querySelector(':scope > .min-h-screen, .min-h-screen')
  const yellow = document.querySelector('[class*="border-dashed"]')
  return {
    kids: [...(nuxt?.children || [])].map((c) => c.tagName + '.' + String(c.className).slice(0, 40)),
    layoutHasMain: !!(layout && layout.querySelector(':scope > main, main')),
    yellowParent: yellow?.parentElement?.className?.slice(0, 45),
    mains: document.querySelectorAll('main').length,
    footers: document.querySelectorAll('footer').length,
  }
})
console.log('SSR', ssr)

await page.goto('http://localhost:3000/articles', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(2000)
const live = await page.evaluate(() => {
  const nuxt = document.querySelector('#__nuxt')
  const navWrap = document.querySelector('nav')?.closest('.max-w-screen-xl')
  return {
    kids: [...(nuxt?.children || [])].map((c) => c.tagName + '.' + String(c.className).slice(0, 40)),
    mains: document.querySelectorAll('main').length,
    footers: document.querySelectorAll('footer').length,
    h1s: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 40)),
    navWrapW: navWrap && Math.round(navWrap.getBoundingClientRect().width),
  }
})
console.log('LIVE', live)

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1500)
const home = await page.evaluate(() => ({
  mains: document.querySelectorAll('main').length,
  footers: document.querySelectorAll('footer').length,
  navW: Math.round(document.querySelector('nav')?.closest('.max-w-screen-xl')?.getBoundingClientRect().width || 0),
}))
console.log('HOME', home)
await browser.close()
