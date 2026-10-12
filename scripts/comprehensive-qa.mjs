import { pathToFileURL } from 'node:url'
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
    : 'playwright'
)
import assert from 'node:assert/strict'

const url = process.env.QA_URL || 'http://127.0.0.1:5174/'
const browser = await chromium.launch({ channel: 'msedge', headless: true })

const viewports = [
  { name: 'desktop-fhd', width: 1920, height: 1080 },
  { name: 'laptop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile-iphone', width: 390, height: 844 },
]

const summary = {
  viewportsTested: [],
  overflowResults: {},
  brokenImages: [],
  consoleErrors: [],
  modalTested: false,
  formValidationTested: false,
  reducedMotionTested: false,
}

try {
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
    page.on('pageerror', (err) => summary.consoleErrors.push(`${vp.name}: ${err.message}`))

    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    // Check initial overflow
    const initialOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1
    })
    assert.equal(initialOverflow, false, `${vp.name}: Initial horizontal overflow detected`)

    // Scroll through each section and check overflow
    const sectionIds = ['awakening', 'presence', 'showroom', 'benchmarks', 'gallery', 'inventory', 'experience']
    for (const id of sectionIds) {
      await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
      await page.waitForTimeout(400)
      const scrolledOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 1
      })
      assert.equal(scrolledOverflow, false, `${vp.name}: Overflow detected at section #${id}`)
    }

    // Check broken images
    const broken = await page.locator('img').evaluateAll((imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
    )
    if (broken.length > 0) {
      summary.brokenImages.push(...broken)
    }

    summary.overflowResults[vp.name] = {
      innerWidth: vp.width,
      docScrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
      hasOverflow: false,
    }
    summary.viewportsTested.push(vp.name)
    await page.close()
  }

  // Deep interactive testing on laptop viewport
  const testPage = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await testPage.goto(url, { waitUntil: 'networkidle' })
  await testPage.waitForTimeout(1000)

  // 1. Test Quick View Modal
  const firstQuickView = testPage.locator('.quick-view').first()
  await firstQuickView.evaluate((btn) => btn.click())
  await testPage.waitForSelector('.quick-view-modal', { state: 'visible' })
  const modalTitle = await testPage.locator('#modalCarTitle').innerText()
  assert.ok(modalTitle.length > 0, 'Quick View modal title should exist')

  // Close modal via Escape
  await testPage.keyboard.press('Escape')
  await testPage.waitForSelector('.quick-view-modal', { state: 'detached' })
  summary.modalTested = true

  // 2. Test Form Validation
  const submitBtn = testPage.locator('#submitBtn')
  // Empty submission should trigger validation error
  await submitBtn.click()
  await testPage.waitForTimeout(200)
  const errorAlert = testPage.locator('[role="alert"]')
  assert.equal(await errorAlert.isVisible(), true, 'Validation error alert should be visible on empty submit')

  // Valid submission
  await testPage.locator('#cta-fullname').fill('Automobili Test Driver')
  await testPage.locator('#cta-email').fill('driver@santagata.it')
  await testPage.locator('#cta-model').selectOption('revuelto')
  await submitBtn.click()
  await testPage.waitForTimeout(300)
  assert.equal(await submitBtn.innerText(), 'RESERVATION REQUESTED ✓')
  summary.formValidationTested = true

  await testPage.close()

  // 3. Test Reduced Motion Emulation
  const motionPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  await motionPage.goto(url, { waitUntil: 'networkidle' })
  await motionPage.waitForTimeout(800)
  const motionAttr = await motionPage.locator('html').getAttribute('data-motion')
  assert.equal(motionAttr, 'reduced', 'HTML tag should have data-motion="reduced"')
  summary.reducedMotionTested = true
  await motionPage.close()

  console.log(JSON.stringify({ status: 'SUCCESS', summary }, null, 2))
} finally {
  await browser.close()
}
