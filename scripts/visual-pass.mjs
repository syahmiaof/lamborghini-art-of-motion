import { pathToFileURL } from 'node:url'
import { mkdir, writeFile } from 'node:fs/promises'
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const browser=await chromium.launch({channel:'msedge',headless:true})
await mkdir('.impeccable/review',{recursive:true})
const evidence=[]
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['short',1280,560]]) {
 const page=await browser.newPage({viewport:{width,height}})
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:5174/',{waitUntil:'networkidle'});await page.waitForTimeout(2200)
 for(const id of ['awakening','presence','benchmarks','showroom','configure']) {
 await page.evaluate(async id=>{const m=await import('/src/motion/scroll.ts');m.scrollToChapter(id,true)},id)
 await page.waitForTimeout(1700)
 if(id==='showroom'&&width>1000){await page.evaluate(async()=>{const m=await import('/src/motion/gsap.ts');const s=await import('/src/motion/scroll.ts');const t=m.ScrollTrigger.getById('collection-travel');s.scrollToY(t.start,true)});await page.waitForTimeout(1000)}
 await page.screenshot({path:`.impeccable/review/${name}-${id}.png`})
 evidence.push({name,id,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),errors:[...errors]})
 }
 await page.close()
}
await writeFile('.impeccable/review/visual-pass.json',JSON.stringify(evidence,null,2)); console.log(JSON.stringify(evidence));await browser.close()
