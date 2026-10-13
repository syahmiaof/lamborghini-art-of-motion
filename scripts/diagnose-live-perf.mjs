import { pathToFileURL } from 'node:url'
const playwrightPath = process.env.PLAYWRIGHT_MODULE || 'C:\\Users\\USER\\Desktop\\03astrasyahmiportfolio\\node_modules\\playwright\\index.mjs'
const { chromium } = await import(pathToFileURL(playwrightPath).href)

const targetUrl = 'https://lamborghini.syahmiaof.my'
console.log(`Starting performance diagnosis on ${targetUrl}...`)

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1
})
const page = await context.newPage()

const networkRequests = []
let totalBytes = 0

page.on('request', req => {
  networkRequests.push({
    url: req.url(),
    resourceType: req.resourceType(),
    method: req.method(),
    startTime: Date.now()
  })
})

page.on('response', async res => {
  const req = networkRequests.find(r => r.url === res.url())
  if (req) {
    req.status = res.status()
    req.duration = Date.now() - req.startTime
    try {
      const headers = res.headers()
      const len = parseInt(headers['content-length'] || '0', 10)
      req.size = len
      totalBytes += len
    } catch {}
  }
})

const consoleErrors = []
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('pageerror', err => consoleErrors.push(err.message))

const startNav = Date.now()
await page.goto(targetUrl, { waitUntil: 'load', timeout: 60000 })
const navDuration = Date.now() - startNav
console.log(`Page load completed in ${navDuration}ms`)

// Skip intro if button visible
try {
  const skipBtn = page.locator('.intro-skip')
  if (await skipBtn.isVisible({ timeout: 2000 })) {
    await skipBtn.click()
    console.log('Skipped intro video overlay')
    await page.waitForTimeout(1500)
  }
} catch (e) {
  console.log('No intro button to skip')
}

// Inject FPS / Long Task meter
await page.evaluate(() => {
  window.__perfData = {
    frames: 0,
    longFrames: 0, // frames taking > 33ms (dropping below 30fps)
    veryLongFrames: 0, // frames taking > 50ms (dropping below 20fps)
    maxDelta: 0,
    deltas: []
  }
  let lastTime = performance.now()
  function countFrame(now) {
    const delta = now - lastTime
    window.__perfData.frames++
    if (delta > window.__perfData.maxDelta) window.__perfData.maxDelta = delta
    if (delta > 33.3) window.__perfData.longFrames++
    if (delta > 50) window.__perfData.veryLongFrames++
    if (window.__perfData.deltas.length < 500) window.__perfData.deltas.push(Math.round(delta))
    lastTime = now
    requestAnimationFrame(countFrame)
  }
  requestAnimationFrame(countFrame)
})

console.log('Testing scrolling performance...')
const scrollStartTime = Date.now()
// Simulate user scrolling smoothly through the page
const scrollSteps = 60
const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
console.log(`Page scroll height: ${maxScroll}px`)

for (let i = 1; i <= scrollSteps; i++) {
  const targetY = (maxScroll / scrollSteps) * i
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), targetY)
  await page.waitForTimeout(80) // 80ms per tick ~ 4.8s total scroll
}

// Scroll back up half way
for (let i = scrollSteps; i >= scrollSteps / 2; i -= 2) {
  const targetY = (maxScroll / scrollSteps) * i
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), targetY)
  await page.waitForTimeout(60)
}

const perfResult = await page.evaluate(() => {
  const perf = window.__perfData
  const avgDelta = perf.deltas.reduce((a, b) => a + b, 0) / (perf.deltas.length || 1)
  return {
    totalFrames: perf.frames,
    longFrames: perf.longFrames,
    veryLongFrames: perf.veryLongFrames,
    maxDeltaMs: Math.round(perf.maxDelta),
    avgDeltaMs: Math.round(avgDelta * 10) / 10,
    estimatedFps: Math.round(1000 / avgDelta)
  }
})

console.log('\n--- SCROLL PERFORMANCE METRICS ---')
console.log(`Estimated FPS: ${perfResult.estimatedFps}`)
console.log(`Average Frame Delta: ${perfResult.avgDeltaMs}ms`)
console.log(`Max Frame Delta (Lag Spike): ${perfResult.maxDeltaMs}ms`)
console.log(`Long frames (>33ms, <30fps): ${perfResult.longFrames} / ${perfResult.totalFrames} (${Math.round((perfResult.longFrames / perfResult.totalFrames) * 100)}%)`)
console.log(`Very long frames (>50ms, <20fps): ${perfResult.veryLongFrames} / ${perfResult.totalFrames} (${Math.round((perfResult.veryLongFrames / perfResult.totalFrames) * 100)}%)`)

// Analyze network requests
console.log('\n--- NETWORK ANALYSIS ---')
console.log(`Total Requests: ${networkRequests.length}`)
console.log(`Total Transferred Size (headers report): ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`)

const byType = {}
for (const req of networkRequests) {
  const t = req.resourceType || 'other'
  if (!byType[t]) byType[t] = { count: 0, bytes: 0 }
  byType[t].count++
  byType[t].bytes += req.size || 0
}
console.log('Requests by resource type:', byType)

// Top 10 slowest requests
const slowest = [...networkRequests].sort((a, b) => (b.duration || 0) - (a.duration || 0)).slice(0, 10)
console.log('\nTop Slowest Requests:')
slowest.forEach(r => console.log(`- [${r.status || 'pending'}] ${r.duration}ms: ${(r.size / 1024).toFixed(1)}KB ${r.url.slice(0, 90)}`))

// Top 10 largest requests
const largest = [...networkRequests].sort((a, b) => (b.size || 0) - (a.size || 0)).slice(0, 10)
console.log('\nTop Largest Requests:')
largest.forEach(r => console.log(`- ${(r.size / 1024).toFixed(1)}KB (${r.resourceType}): ${r.url.slice(0, 90)}`))

if (consoleErrors.length > 0) {
  console.log('\nConsole Errors:', consoleErrors)
} else {
  console.log('\nZero console errors!')
}

await browser.close()
