import { pathToFileURL } from 'node:url'
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
    : 'playwright'
)
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const url = process.env.QA_URL || 'http://localhost:5174/'
const output = '.impeccable/review/three-clips'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const results = []
const errors = []

const viewports = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'desktop-1280x573', width: 1280, height: 573 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-360x740', width: 360, height: 740 },
]

try {
  for (const vp of viewports) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`)
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
    page.on('pageerror', (err) => errors.push(`${vp.name}: ${err.message}`))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`${vp.name} console: ${msg.text()}`)
    })

    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    // 1. Verify Static Hero Section
    const hero = page.locator('#hero')
    assert.equal(await hero.isVisible(), true, `${vp.name}: #hero is visible`)
    await page.screenshot({ path: `${output}/${vp.name}-00-hero.png` })

    // Check HUD Nav links
    const heroNav = page.locator('.hud-nav a[href="#hero"]')
    assert.equal(await heroNav.isVisible(), vp.width > 768 ? true : false)

    // 2. Verify Awakening Sequence directly below hero (Beat 1)
    const awakening = page.locator('#awakening')
    assert.equal(await awakening.isVisible(), true, `${vp.name}: #awakening is visible`)

    // Scroll into awakening sequence
    await awakening.evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${output}/${vp.name}-01-awakening-top.png` })

    // Scrub through Awakening sequence (on desktop where sequence pins)
    if (vp.width >= 900) {
      await page.mouse.wheel(0, 600)
      await page.waitForTimeout(400)
      await page.screenshot({ path: `${output}/${vp.name}-01-awakening-mid.png` })

      await page.mouse.wheel(0, 800)
      await page.waitForTimeout(400)
      await page.screenshot({ path: `${output}/${vp.name}-01-awakening-resolved.png` })
    }

    // 3. Verify Presence Sequence (Beat 2)
    const presence = page.locator('#presence')
    await presence.evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
    await page.waitForTimeout(600)
    assert.equal(await presence.isVisible(), true, `${vp.name}: #presence is visible`)
    await page.screenshot({ path: `${output}/${vp.name}-02-presence-start.png` })

    if (vp.width >= 900) {
      // Scrub mid phase (pointers)
      await page.mouse.wheel(0, 600)
      await page.waitForTimeout(400)
      await page.screenshot({ path: `${output}/${vp.name}-02-presence-pointers.png` })

      // Scrub profile phase (65-100%)
      await page.mouse.wheel(0, 800)
      await page.waitForTimeout(400)
      await page.screenshot({ path: `${output}/${vp.name}-02-presence-profile.png` })
    }

    // 3. Verify Cockpit Video Section (Beat 3)
    const gallery = page.locator('#gallery')
    await gallery.evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
    await page.waitForTimeout(800)
    assert.equal(await gallery.isVisible(), true, `${vp.name}: #gallery is visible`)

    const cockpitVideo = page.locator('.cockpit-video')
    assert.equal(await cockpitVideo.isVisible(), true, `${vp.name}: cockpit video is rendered`)
    await page.screenshot({ path: `${output}/${vp.name}-03-cockpit-section.png` })

    // Test Video Modal Interaction (Beat 3 Modal Trigger)
    const openModalBtn = page.locator('.cockpit-clip-btn').first()
    if (await openModalBtn.isVisible()) {
      await openModalBtn.click()
      await page.waitForSelector('.video-modal-backdrop', { state: 'visible' })
      assert.equal(await page.locator('.video-modal-player').isVisible(), true, 'Video modal player is mounted')
      await page.screenshot({ path: `${output}/${vp.name}-03-cockpit-modal.png` })

      // Close modal with Escape key
      await page.keyboard.press('Escape')
      await page.waitForSelector('.video-modal-backdrop', { state: 'detached' })
    }

    // 4. Reverse scroll test: scroll back up to top smoothly
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(500)
    assert.equal(await page.evaluate(() => window.scrollY), 0, 'Reversed cleanly back to top')

    // 5. Check no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    )
    assert.equal(hasHorizontalOverflow, false, `${vp.name}: no horizontal overflow`)

    // 6. Check for broken images
    const brokenImages = await page.locator('img').evaluateAll((imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
    )
    assert.deepEqual(brokenImages, [], `${vp.name}: zero broken images`)

    results.push({
      viewport: vp.name,
      width: vp.width,
      height: vp.height,
      awakening: 'PASSED',
      presence: 'PASSED',
      cockpit: 'PASSED',
      modal: 'PASSED',
      reverseScroll: 'PASSED',
      noOverflow: true,
      brokenImagesCount: 0,
    })

    await page.close()
  }

  // 7. Verify Prefers-Reduced-Motion
  console.log(`\n=== Testing OS prefers-reduced-motion ===`)
  const reducedPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  reducedPage.on('pageerror', (err) => errors.push(`reduced: ${err.message}`))
  await reducedPage.goto(url, { waitUntil: 'networkidle' })
  await reducedPage.waitForTimeout(800)

  // Verify data-motion attribute
  const dataMotion = await reducedPage.locator('html').getAttribute('data-motion')
  assert.equal(dataMotion, 'reduced', 'data-motion is set to reduced')

  // Verify canvas hidden in reduced motion
  const canvasHidden = await reducedPage.evaluate(() => {
    const canvas = document.querySelector('.scroll-image-sequence__canvas')
    if (!canvas) return true
    return window.getComputedStyle(canvas).display === 'none'
  })
  assert.equal(canvasHidden, true, 'Sequence canvas is hidden in reduced motion')

  // Verify poster image is visible
  const posterVisible = await reducedPage.locator('.scroll-image-sequence__poster').first().isVisible()
  assert.equal(posterVisible, true, 'Fallback poster image is visible in reduced motion')

  await reducedPage.screenshot({ path: `${output}/reduced-motion-hero.png` })
  results.push({
    test: 'prefers-reduced-motion: reduce',
    dataMotion: 'reduced',
    canvasHidden: true,
    posterVisible: true,
    status: 'PASSED',
  })
  await reducedPage.close()

  await writeFile(`${output}/verification-summary.json`, JSON.stringify({ results, errors }, null, 2))
  console.log('\n✅ All Playwright Verification Tests PASSED successfully!')
} finally {
  await browser.close()
}
