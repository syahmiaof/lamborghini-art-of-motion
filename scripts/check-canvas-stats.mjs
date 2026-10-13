import { pathToFileURL } from 'node:url'
const playwrightPath = process.env.PLAYWRIGHT_MODULE || 'C:\\Users\\USER\\Desktop\\03astrasyahmiportfolio\\node_modules\\playwright\\index.mjs'
const { chromium } = await import(pathToFileURL(playwrightPath).href)

const url = 'https://lamborghini.syahmiaof.my'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto(url, { waitUntil: 'domcontentloaded' })
try {
  const skipBtn = page.locator('.intro-skip')
  if (await skipBtn.isVisible({ timeout: 2000 })) await skipBtn.click()
} catch {}

await page.waitForTimeout(1000)

// Scroll to awakening
await page.locator('#awakening').evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(500)

console.log('Scrolling through #awakening in simulated user increments...')
for (let i = 0; i < 20; i++) {
  await page.mouse.wheel(0, 150)
  await page.waitForTimeout(50)
}

const awakeningStats = await page.locator('#awakening canvas').evaluate(el => ({
  frame: el.dataset.frame,
  target: el.dataset.target,
  cache: el.dataset.cache,
  pending: el.dataset.pending,
  failed: el.dataset.failed,
  decoded: el.dataset.decoded,
  aborted: el.dataset.aborted,
}))
console.log('Awakening canvas stats after scroll:', awakeningStats)

await browser.close()
