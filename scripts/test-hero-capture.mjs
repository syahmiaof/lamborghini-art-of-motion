import { pathToFileURL } from 'node:url'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright')

const browser = await chromium.launch({ channel: 'msedge', headless: true })

// 1. Mockup reference size: 1024 x 576 (16:9)
const page1024 = await browser.newPage({ viewport: { width: 1024, height: 576 } })
await page1024.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' })
// Wait for GSAP entrance animation to complete and settle
await page1024.waitForTimeout(3000)
await page1024.screenshot({ path: '.impeccable/review/hero-current-1024x576.png' })
console.log('Saved .impeccable/review/hero-current-1024x576.png')

// 2. Desktop standard: 1440 x 900
const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page1440.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' })
await page1440.waitForTimeout(3000)
await page1440.screenshot({ path: '.impeccable/review/hero-current-1440x900.png' })
console.log('Saved .impeccable/review/hero-current-1440x900.png')

// 3. Mobile: 390 x 844
const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
await pageMobile.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' })
await pageMobile.waitForTimeout(3000)
await pageMobile.screenshot({ path: '.impeccable/review/hero-current-390x844.png' })
console.log('Saved .impeccable/review/hero-current-390x844.png')

await browser.close()
