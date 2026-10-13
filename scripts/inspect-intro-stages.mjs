import { pathToFileURL } from 'node:url'
const playwrightPath = process.env.PLAYWRIGHT_MODULE || 'C:\\Users\\USER\\Desktop\\03astrasyahmiportfolio\\node_modules\\playwright\\index.mjs'
const { chromium } = await import(pathToFileURL(playwrightPath).href)

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' })

console.log('Capturing intro at multiple timestamps...')
// t = 0.5s (Standby)
await page.waitForTimeout(500)
await page.screenshot({ path: 'scripts/intro-t0.5.png' })

// t = 1.8s (Initializing)
await page.waitForTimeout(1300)
await page.screenshot({ path: 'scripts/intro-t1.8.png' })

// t = 3.8s (Ignition)
await page.waitForTimeout(2000)
await page.screenshot({ path: 'scripts/intro-t3.8.png' })

// t = 5.8s (Motion)
await page.waitForTimeout(2000)
await page.screenshot({ path: 'scripts/intro-t5.8.png' })

// t = 9.2s (Transition towards hero)
await page.waitForTimeout(3400)
await page.screenshot({ path: 'scripts/intro-t9.2.png' })

await browser.close()
console.log('Screenshots captured!')
