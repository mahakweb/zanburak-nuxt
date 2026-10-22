/**
 * Browser smoke: open messenger shell on the live Nuxt IPv6 bind.
 * Full authenticated UI login is blocked by reCAPTCHA in local API.
 */
import { chromium } from 'playwright-core'

const base = process.env.MESSENGER_URL || 'http://[::1]:3000'
const chrome =
  process.env.CHROME_PATH ||
  'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe'

const browser = await chromium.launch({
  headless: true,
  executablePath: chrome,
})
const page = await browser.newPage()
const marks = { navStart: Date.now() }
const apiCalls = []

page.on('response', (res) => {
  const url = res.url()
  if (url.includes('/api/messenger') || url.includes('/api/auth') || url.includes('/api/user')) {
    apiCalls.push({
      status: res.status(),
      url: url.replace(/^https?:\/\/[^/]+/, ''),
      ms: Date.now() - marks.navStart,
    })
  }
})

let gotoErr = null
try {
  await page.goto(`${base}/messenger`, { waitUntil: 'domcontentloaded', timeout: 60000 })
} catch (e) {
  gotoErr = String(e.message || e)
}
await page.waitForTimeout(2500)
const url = page.url()
const text = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').trim()

console.log(JSON.stringify({
  base,
  finalUrl: url,
  gotoErr,
  loadMs: Date.now() - marks.navStart,
  bodyPreview: text.slice(0, 240),
  apiCalls: apiCalls.slice(0, 30),
  reachedLoginOrMessenger: /messenger|login|ورود|auth/i.test(url + ' ' + text),
}, null, 2))

await browser.close()
