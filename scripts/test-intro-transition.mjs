import { pathToFileURL } from 'node:url'
const playwrightPath = process.env.PLAYWRIGHT_MODULE || 'C:\\Users\\USER\\Desktop\\03astrasyahmiportfolio\\node_modules\\playwright\\index.mjs'
const { chromium } = await import(pathToFileURL(playwrightPath).href)
import { mkdir } from 'node:fs/promises'

const url = 'http://127.0.0.1:5174/'
const output = '.impeccable/intro-qa'
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

// 1. Initial Intro Video State
await page.waitForSelector('.cinematic-intro')
console.log('CinematicIntro mounted successfully')
await page.waitForTimeout(1000)
await page.screenshot({ path: `${output}/01-intro-playing.png` })

// 2. Fast forward to 9.2s
console.log('Fast-forwarding video to 9.2s...')
await page.evaluate(() => {
  const video = document.querySelector('video')
  if (video) video.currentTime = 9.2
})
await page.waitForTimeout(300)
await page.screenshot({ path: `${output}/02-intro-pre-dissolve.png` })

// 3. Capture at 9.6s (during crossfade)
await page.waitForTimeout(400)
await page.screenshot({ path: `${output}/03-crossfade-mid.png` })

// 4. Wait for transition to complete and hero to settle
await page.waitForTimeout(1500)
await page.screenshot({ path: `${output}/04-hero-settled.png` })

// 5. Test Replay via FILM button
const filmBtn = page.locator('.hud-film-btn')
const hasFilmBtn = await filmBtn.isVisible()
console.log('FILM button visible:', hasFilmBtn)
if (hasFilmBtn) {
  await filmBtn.click()
  await page.waitForTimeout(600)
  const introMountedAgain = await page.locator('.cinematic-intro').isVisible()
  console.log('Intro re-mounted on FILM click:', introMountedAgain)
  await page.screenshot({ path: `${output}/05-replay-mounted.png` })

  // Click SKIP to test skip transition
  const skipBtn = page.locator('.intro-skip')
  if (await skipBtn.isVisible()) {
    await skipBtn.click()
    console.log('Clicked SKIP')
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${output}/06-skip-crossfade.png` })
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${output}/07-skip-complete.png` })
  }
}

console.log('Errors:', errors)
await browser.close()
