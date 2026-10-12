import { pathToFileURL } from 'node:url'
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' })

const culprits = await page.evaluate(() => {
  const docW = window.innerWidth
  const elements = document.querySelectorAll('*')
  const results = []
  for (const el of elements) {
    const rect = el.getBoundingClientRect()
    if (rect.right > docW + 1 || el.scrollWidth > docW + 1) {
      results.push({
        tag: el.tagName,
        id: el.id,
        className: el.className,
        rectRight: Math.round(rect.right),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        outerHTML: el.outerHTML.slice(0, 100)
      })
    }
  }
  return results
})

console.log(JSON.stringify(culprits, null, 2))
await browser.close()
