import { pathToFileURL } from 'node:url'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright')

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (err) => errors.push(err.message))

await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' })
await page.waitForTimeout(2000)

const brokenImages = await page.locator('img').evaluateAll((imgs) =>
  imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
)

const sections = await page.locator('section').count()
const heroTitle = await page.locator('.hero-title').innerText()
const presenceTitle = await page.locator('#presence h2').innerText()
const barsCount = await page.locator('.bar-fill').count()
const galleryRows = await page.locator('.gallery-row').count()
const inventoryCards = await page.locator('.inventory-card').count()
const ctaTitle = await page.locator('#experience h2').innerText()

await page.getByRole('button', { name: 'REVUELTO', exact: true }).click()
await page.waitForTimeout(300)
const revueltoCount = await page.locator('.inventory-card').count()

await page.getByRole('button', { name: 'ALL', exact: true }).click()
await page.waitForTimeout(300)
const allCount = await page.locator('.inventory-card').count()

await page.locator('#cta-fullname').fill('Automobili Collector')
await page.locator('#cta-email').fill('vip@collection.it')
await page.locator('#cta-model').selectOption('revuelto')

const ctaButton = page.locator('#submitBtn')
await ctaButton.click()
await page.waitForTimeout(300)
const clickedText = await ctaButton.innerText()

console.log(JSON.stringify({
  errors,
  brokenImages,
  sections,
  heroTitle,
  presenceTitle,
  barsCount,
  galleryRows,
  inventoryCards,
  revueltoCount,
  allCount,
  clickedText,
  ctaTitle
}, null, 2))

await browser.close()
