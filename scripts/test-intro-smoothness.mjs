import { pathToFileURL } from 'node:url'
const playwrightPath = process.env.PLAYWRIGHT_MODULE || 'C:\\Users\\USER\\Desktop\\03astrasyahmiportfolio\\node_modules\\playwright\\index.mjs'
const { chromium } = await import(pathToFileURL(playwrightPath).href)

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto('https://lamborghini.syahmiaof.my', { waitUntil: 'domcontentloaded' })

// Wait for video to begin playing
await page.waitForFunction(() => {
  const v = document.querySelector('video.intro-film')
  return v && !v.paused && v.currentTime > 0.1
}, { timeout: 10000 })

console.log('Video playing. Capturing smooth entrances...')

// 1. Initializing (around t = 1.6s)
await page.waitForFunction(() => {
  const v = document.querySelector('video.intro-film')
  return v && v.currentTime >= 1.6
})
await page.screenshot({ path: 'scripts/smooth-intro-initializing.png' })
console.log('Captured scripts/smooth-intro-initializing.png')

// 2. Ignition (around t = 3.6s)
await page.waitForFunction(() => {
  const v = document.querySelector('video.intro-film')
  return v && v.currentTime >= 3.6
})
await page.screenshot({ path: 'scripts/smooth-intro-ignition.png' })
console.log('Captured scripts/smooth-intro-ignition.png')

// 3. The Art of Motion (around t = 5.8s)
await page.waitForFunction(() => {
  const v = document.querySelector('video.intro-film')
  return v && v.currentTime >= 5.8
})
await page.screenshot({ path: 'scripts/smooth-intro-motion.png' })
console.log('Captured scripts/smooth-intro-motion.png')

// 4. Check if any text was clipped or overflowing
const textMetrics = await page.evaluate(() => {
  const titles = Array.from(document.querySelectorAll('.intro-stage__title')).map(el => {
    const rect = el.getBoundingClientRect()
    return {
      text: el.textContent?.trim(),
      top: rect.top,
      bottom: rect.bottom,
      height: rect.height,
      opacity: window.getComputedStyle(el).opacity,
    }
  })
  return titles
})
console.log('Title metrics:', textMetrics)

await browser.close()
console.log('Test completed successfully!')
