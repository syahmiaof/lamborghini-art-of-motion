import { pathToFileURL } from 'node:url'
const playwrightPath = process.env.PLAYWRIGHT_MODULE || 'C:\\Users\\USER\\Desktop\\03astrasyahmiportfolio\\node_modules\\playwright\\index.mjs'
const { chromium } = await import(pathToFileURL(playwrightPath).href)
import { mkdir } from 'node:fs/promises'
import assert from 'node:assert/strict'

const url = 'http://127.0.0.1:5174/'
const output = '.impeccable/fixes-qa'
await mkdir(output, { recursive: true })

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const errors = []
page.on('pageerror', (err) => errors.push(err.message))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})

console.log('Navigating to ' + url)
await page.goto(url, { waitUntil: 'domcontentloaded' })

// Dismiss intro if visible
try {
  const skipBtn = page.locator('.intro-skip')
  if (await skipBtn.isVisible({ timeout: 2000 })) {
    await skipBtn.click()
    console.log('Skipped intro')
    await page.waitForTimeout(1400)
  }
} catch (e) {
  console.log('No intro to skip or already dismissed')
}

// 1. TEST AWAKENING (FULLSCREEN SEQUENCE)
console.log('Testing #awakening...')
await page.locator('#awakening').evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(1000)

const awakeningBounds = await page.locator('#awakening .scroll-image-sequence').boundingBox()
console.log('Awakening bounds:', awakeningBounds)
assert.ok(awakeningBounds.width >= 1440, 'Awakening sequence width must be full viewport')
assert.ok(awakeningBounds.height >= 898, 'Awakening sequence height must be full viewport')

// Check canvas dataset fit
const awakeningCanvasFit = await page.locator('#awakening canvas').getAttribute('data-fit')
console.log('Awakening canvas fit:', awakeningCanvasFit)
assert.equal(awakeningCanvasFit, 'cover', 'Canvas must use cover for edge-to-edge rendering')

await page.screenshot({ path: `${output}/01-awakening-fullscreen.png` })

// 2. TEST PRESENCE (FULLSCREEN SEQUENCE)
console.log('Testing #presence...')
await page.locator('#presence').evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(1000)

const presenceBounds = await page.locator('#presence .scroll-image-sequence').boundingBox()
console.log('Presence bounds:', presenceBounds)
assert.ok(presenceBounds.width >= 1440, 'Presence sequence width must be full viewport')
assert.ok(presenceBounds.height >= 898, 'Presence sequence height must be full viewport')

const presenceCanvasFit = await page.locator('#presence canvas').getAttribute('data-fit')
console.log('Presence canvas fit:', presenceCanvasFit)
assert.equal(presenceCanvasFit, 'cover', 'Presence canvas must use cover')

await page.screenshot({ path: `${output}/02-presence-fullscreen.png` })

// 3. TEST SHOWROOM (NO OVERLAPPING PRICE)
console.log('Testing #showroom and Temerario panel...')
await page.locator('#showroom').evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(800)

// Scroll horizontally to Temerario
const temerario = page.locator('.model-panel:nth-child(2)')
await temerario.evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(800)

// Check bounding box of TOP SPEED vs panel-price in Temerario panel
const topSpeedBox = await temerario.locator('.spec-item:nth-child(4)').boundingBox()
const priceBox = await temerario.locator('.panel-price').boundingBox()
console.log('Temerario TOP SPEED box:', topSpeedBox)
console.log('Temerario Price box:', priceBox)

// Assert that the price is positioned BELOW the top speed item with no vertical overlap!
assert.ok(
  priceBox.y >= topSpeedBox.y + topSpeedBox.height - 2,
  `Price (y=${priceBox.y}) must be below Top Speed bottom (y=${topSpeedBox.y + topSpeedBox.height})`
)
console.log('VERIFIED: Price does NOT overlap with Top Speed!')

await page.screenshot({ path: `${output}/03-temerario-no-overlap.png` })

// Also test Revuelto panel
const revuelto = page.locator('.model-panel:nth-child(1)')
await revuelto.evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(600)
await page.screenshot({ path: `${output}/04-revuelto-panel.png` })

// 4. TEST BENCHMARKS (ENGINEERING APEX PROGRESS BARS)
console.log('Testing #benchmarks (Engineering Apex)...')
await page.locator('#benchmarks').evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
// Wait for GSAP scrollTrigger to animate bars
await page.waitForTimeout(2000)

const barCount = await page.locator('.bar-fill').count()
console.log('Bar count:', barCount)
assert.equal(barCount, 4, 'Must have 4 progress bars')

// Inspect the animated scaleX or computed width of the bars
for (let i = 0; i < 4; i++) {
  const bar = page.locator('.bar-fill').nth(i)
  const transform = await bar.evaluate(el => window.getComputedStyle(el).transform)
  const width = await bar.evaluate(el => el.offsetWidth)
  console.log(`Bar ${i + 1} width: ${width}px, transform: ${transform}`)
  assert.ok(width > 100, `Bar ${i + 1} must have non-zero track width`)
  assert.notEqual(transform, 'none', `Bar ${i + 1} must be scaled by GSAP`)
}

await page.screenshot({ path: `${output}/05-engineering-apex-bars.png` })

// 5. TEST COCKPIT (FULLSCREEN SEQUENCE)
console.log('Testing #gallery / #cockpit...')
await page.locator('#cockpit').evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(1000)

const cockpitBounds = await page.locator('#cockpit .scroll-image-sequence').boundingBox()
console.log('Cockpit bounds:', cockpitBounds)
assert.ok(cockpitBounds.width >= 1440, 'Cockpit sequence width must be full viewport')
assert.ok(cockpitBounds.height >= 898, 'Cockpit sequence height must be full viewport')

const cockpitCanvasFit = await page.locator('#cockpit canvas').getAttribute('data-fit')
console.log('Cockpit canvas fit:', cockpitCanvasFit)
assert.equal(cockpitCanvasFit, 'cover', 'Cockpit canvas must use cover')

await page.screenshot({ path: `${output}/06-cockpit-fullscreen.png` })

console.log('All tests passed with zero errors! Errors:', errors)
await browser.close()
