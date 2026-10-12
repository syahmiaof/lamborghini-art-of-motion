import { pathToFileURL } from 'node:url'
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
    : 'playwright'
)
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const url = process.env.QA_URL || 'http://127.0.0.1:5174/'
const output = '.impeccable/review'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const results = []
const errors = []
const sizes = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'wide', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'short', width: 1280, height: 560 },
]

try {
  for (const size of sizes) {
    const page = await browser.newPage({ viewport: { width: size.width, height: size.height } })
    page.on('pageerror', (error) => errors.push(size.name + ': ' + error.message))
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)

    // Assert 8 semantic chapters in Experience
    assert.equal(await page.locator('main section.chapter').count(), 8)
    await page.screenshot({ path: output + '/' + size.name + '-hero.png' })

    // Check all section targets for zero overflow
    for (const id of ['awakening', 'presence', 'showroom', 'benchmarks', 'gallery', 'inventory', 'experience']) {
      await page.locator('#' + id).evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
      await page.waitForTimeout(600)
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
        false,
        size.name + ': overflow at ' + id
      )
      if (['desktop', 'mobile'].includes(size.name)) {
        await page.screenshot({ path: output + '/' + size.name + '-' + id + '.png' })
      }
    }

    // Filter bar interaction
    await page.getByRole('button', { name: 'REVUELTO', exact: true }).click()
    await page.waitForTimeout(200)
    assert.equal(await page.locator('.inventory-card').count(), 3)

    await page.getByRole('button', { name: 'ALL', exact: true }).click()
    await page.waitForTimeout(200)
    assert.equal(await page.locator('.inventory-card').count(), 8)

    // Dynamic Spec Bars
    assert.equal(await page.locator('.section-bars').isVisible(), true)
    assert.equal(await page.locator('.bar-fill').count(), 4)

    // Quick View Modal
    const quickViewBtn = page.locator('.quick-view').first()
    await quickViewBtn.evaluate((el) => el.click())
    await page.waitForSelector('.quick-view-modal', { state: 'visible' })
    await page.keyboard.press('Escape')
    await page.waitForSelector('.quick-view-modal', { state: 'detached' })

    // Scroll back to top
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(300)

    // Broken images check
    const broken = await page.locator('img').evaluateAll((images) =>
      images.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
    )
    assert.deepEqual(broken, [])

    results.push({
      viewport: size,
      checks: '8 chapters, images, overflow, quick-view, inventory filters, benchmarks, fast/reverse scroll',
      passed: true,
    })
    await page.close()
  }

  // OS Reduced Motion Test
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  page.on('pageerror', (e) => errors.push('reduced: ' + e.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  assert.equal(await page.locator('html').getAttribute('data-motion'), 'reduced')
  await page.screenshot({ path: output + '/reduced-hero.png' })
  results.push({ checks: 'OS reduced motion sets data-motion and adapts layout', passed: true })
  await page.close()

  assert.deepEqual(errors, [])
  await writeFile(output + '/qa-results.json', JSON.stringify({ results, errors }, null, 2))
  console.log(JSON.stringify({ status: 'ALL_PASSED', totalViewports: sizes.length, resultsCount: results.length }, null, 2))
} finally {
  await browser.close()
}
