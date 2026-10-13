import { pathToFileURL } from 'node:url'
const playwrightPath = process.env.PLAYWRIGHT_MODULE || 'C:\\Users\\USER\\Desktop\\03astrasyahmiportfolio\\node_modules\\playwright\\index.mjs'
const { chromium } = await import(pathToFileURL(playwrightPath).href)

const url = 'https://lamborghini.syahmiaof.my'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

console.log('Navigating to live site...')
await page.goto(url, { waitUntil: 'domcontentloaded' })

// Skip intro
try {
  const skipBtn = page.locator('.intro-skip')
  if (await skipBtn.isVisible({ timeout: 2500 })) {
    await skipBtn.click()
    await page.waitForTimeout(1500)
  }
} catch {}

await page.waitForTimeout(1000)

// 1. Hero screenshot
await page.screenshot({ path: 'scripts/live-hero.png' })
console.log('Saved scripts/live-hero.png')

// 2. Scroll into #awakening
await page.locator('#awakening').evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(800)
for (let i = 0; i < 15; i++) {
  await page.mouse.wheel(0, 120)
  await page.waitForTimeout(40)
}
await page.waitForTimeout(600)
await page.screenshot({ path: 'scripts/live-awakening.png' })
console.log('Saved scripts/live-awakening.png')

// 3. Scroll into #showroom
await page.locator('#showroom').evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(800)
await page.screenshot({ path: 'scripts/live-showroom.png' })
console.log('Saved scripts/live-showroom.png')

// 4. Scroll into #benchmarks
await page.locator('#benchmarks').evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(1000)
await page.screenshot({ path: 'scripts/live-benchmarks.png' })
console.log('Saved scripts/live-benchmarks.png')

await browser.close()
console.log('All live screenshots captured successfully!')
