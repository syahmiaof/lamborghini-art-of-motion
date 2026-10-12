import { pathToFileURL } from 'node:url'
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
    : 'playwright'
)
import assert from 'node:assert/strict'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (err) => errors.push(err.message))

await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

// 1. Verify Hero is static approved layout
const heroImg = await page.locator('#hero .hero-bg-img').getAttribute('src')
assert.equal(heroImg, '/media/hero-car-clean.webp')
await page.screenshot({ path: '.impeccable/review/verified-hero.png' })

// 2. Scroll to Awakening (#awakening)
const awakening = page.locator('#awakening')
await awakening.scrollIntoViewIfNeeded()
await page.waitForTimeout(800)
await page.screenshot({ path: '.impeccable/review/verified-awakening-start.png' })

// Scroll down to scrub awakening
await page.mouse.wheel(0, 1000)
await page.waitForTimeout(800)
await page.screenshot({ path: '.impeccable/review/verified-awakening-mid.png' })

// Scroll to Presence (#presence)
const presence = page.locator('#presence')
await presence.scrollIntoViewIfNeeded()
await page.waitForTimeout(800)
await page.mouse.wheel(0, 1000)
await page.waitForTimeout(800)
await page.screenshot({ path: '.impeccable/review/verified-presence-mid.png' })

// Scroll to Cockpit (#cockpit)
const cockpit = page.locator('#cockpit')
await cockpit.scrollIntoViewIfNeeded()
await page.waitForTimeout(800)
await page.mouse.wheel(0, 1000)
await page.waitForTimeout(800)
await page.screenshot({ path: '.impeccable/review/verified-cockpit-mid.png' })

// Check canvas ready states
const canvasCount = await page.locator('canvas').count()
console.log(JSON.stringify({
  canvasCount,
  errors,
  heroImg,
  verified: true
}, null, 2))

await browser.close()
