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

async function testSection(id) {
  console.log(`\nTesting section #${id}...`)
  await page.locator(`#${id}`).evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
  await page.waitForTimeout(500)
  for (let i = 0; i < 25; i++) {
    await page.mouse.wheel(0, 100)
    await page.waitForTimeout(40)
  }
  await page.waitForTimeout(500)
  const stats = await page.locator(`#${id} canvas`).evaluate(el => ({
    frame: el.dataset.frame,
    target: el.dataset.target,
    cache: el.dataset.cache,
    pending: el.dataset.pending,
    failed: el.dataset.failed,
    decoded: el.dataset.decoded,
    aborted: el.dataset.aborted,
    ready: el.dataset.ready,
  }))
  console.log(`#${id} stats:`, stats)
}

await testSection('awakening')
await testSection('presence')
await testSection('cockpit')

await browser.close()
