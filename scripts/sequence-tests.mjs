import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { FrameLoader } from '../src/features/sequence/FrameLoader.ts'
import { frameIndex, drawBounds, frameUrl } from '../src/features/sequence/types.ts'
import { validateManifest } from './validate-sequences.mjs'

const variant = { frameCount: 72, width: 1, height: 1, extension: 'png', urlTemplate: '/fixture/frame_{frame}.png', totalBytes: 0 }
const flush = () => new Promise(resolve => setTimeout(resolve, 0))
const decoded = (close = () => {}) => ({ source: {}, width: 1, height: 1, close })

test('frame mapping is clamped, deterministic and reverses exactly', () => {
  assert.deepEqual([0, 0.5, 1, 0.5, 0, -1, 2, NaN].map(p => frameIndex(p, 72)), [0, 36, 71, 36, 0, 0, 71, 0])
  assert.equal(frameUrl(variant, 8), '/fixture/frame_00008.png')
  assert.equal(frameUrl({ ...variant, startIndex: 1, padLength: 4 }, 8), '/fixture/frame_0009.png')
  assert.deepEqual(drawBounds(1600, 900, 400, 400, 'cover', { x: 1, y: 0.5 }), { x: 400 - 1600 * 400 / 900, y: 0, width: 1600 * 400 / 900, height: 400 })
  assert.equal(drawBounds(1600, 900, 400, 400, 'contain', { x: 0.5, y: 0.5 }).width, 400)
})

test('rapid reverse does not draw stale completions; concurrency and cache are bounded', async () => {
  const jobs = []
  const rendered = []
  let closed = 0
  const loader = new FrameLoader(variant, (_, i) => rendered.push(i), { capacity: 4, concurrency: 2, decode: (url, signal) => new Promise(resolve => jobs.push({ url, signal, resolve })) })
  loader.request(0)
  assert.equal(loader.stats.pending, 2)
  loader.request(71)
  loader.request(0)
  for (let n = 0; n < 12; n++) { const job = jobs.shift(); if (job) job.resolve(decoded(() => closed++)); await flush() }
  assert.ok(rendered.every(index => index < 4), 'A stale distant completion must never replace the current window')
  assert.equal(rendered.at(-1), 0, 'Exact target must replace temporary neighbouring fallback')
  assert.ok(rendered.length > 0, 'The latest requested frame must eventually render')
  assert.ok(loader.stats.cached <= 4)
  assert.ok(loader.stats.pending <= 2)
  loader.dispose()
  assert.ok(closed > 0)
})

test('isolated failed frames do not disable the scene; the last good image survives resize and suspension', async () => {
  const rendered = []
  const attempts = new Map()
  const loader = new FrameLoader(variant, (_, index) => rendered.push(index), { decode: async url => {
    const index = Number(url.match(/frame_(\d+)/)[1])
    attempts.set(index, (attempts.get(index) ?? 0) + 1)
    if ([1, 2, 3].includes(index)) throw new Error('404')
    return decoded()
  } })
  loader.request(0)
  await flush()
  assert.equal(rendered.at(-1), 0)
  loader.request(2)
  await flush()
  assert.equal(rendered.at(-1), 0, 'Missing target must keep the last valid image')
  loader.redraw()
  assert.equal(rendered.at(-1), 0, 'Resize must retain the last decoded source')
  loader.request(12)
  await flush()
  assert.equal(rendered.at(-1), 12, 'Three unrelated missing frames must not disable subsequent playback')
  assert.ok(attempts.get(2) <= 2, 'Missing target retries are bounded')
  loader.suspend()
  assert.equal(loader.stats.cached, 1, 'Only the displayed bitmap remains when far from the scene')
  loader.redraw()
  assert.equal(rendered.at(-1), 12)
  loader.dispose()
})

test('unmount closes late decoded resources without a draw', async () => {
  let resolve
  let closed = 0
  const late = new FrameLoader(variant, () => assert.fail('Disposed loader drew'), { concurrency: 1, decode: () => new Promise(r => { resolve = r }) })
  late.request(0)
  await flush()
  late.dispose()
  resolve(decoded(() => closed++))
  await flush()
  assert.equal(closed, 1)
})

test('monotonic scroll reuses prefetched frames and deduplicates same-frame ticks', async () => {
  let callbacks = 0
  let notifications = 0
  const requests = new Map()
  const loader = new FrameLoader({ ...variant, frameCount: 121, width: 1440, height: 810 }, () => callbacks++, {
    capacity: 10,
    decode: async url => { requests.set(url, (requests.get(url) ?? 0) + 1); return { ...decoded(), width: 1440, height: 810 } },
    onChange: () => notifications++,
  })
  for (let index = 0; index <= 60; index++) {
    for (let tick = 0; tick < 5; tick++) loader.request(index)
    await flush()
  }
  const decodes = [...requests.values()].reduce((sum, count) => sum + count, 0)
  assert.equal(decodes, requests.size, 'Sequential forward scrub should never evict and redecode imminent prefetched frames')
  assert.equal(callbacks, 61, 'Only changed source frames should invoke draw callbacks')
  assert.ok(notifications < 150)
  assert.ok(loader.stats.estimatedDecodedBytes <= 72 * 1024 * 1024)
  console.log(`Controlled loader benchmark: ${decodes} decodes / ${requests.size} unique; ${callbacks} draw callbacks; ${notifications} diagnostic callbacks. Previous measured baseline: 70 / 66; 360; 375.`)
  loader.suspend()
  loader.resume(60, 2)
  await flush()
  assert.ok(loader.stats.cached <= 2, 'Upcoming scene should warm only its two-frame window')
  loader.dispose()
})

test('temporary synthetic 1px fixture validates continuity, rights, dimensions and byte totals', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'lamborghini-synthetic-sequence-test-'))
  const folder = path.join(root, 'media/sequences/synthetic-test/desktop')
  // Test-only single transparent pixel. This is never shipped as vehicle imagery.
  const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6GkAAAAASUVORK5CYII=', 'base64')
  const manifest = { id: 'synthetic-test', assetRegisterId: 'TEST-SYNTHETIC-ONLY', rightsStatus: 'approved', derivativeFramesAllowed: true, poster: '/media/sequences/synthetic-test/poster.png', alt: 'Synthetic test pixel', desktop: { ...variant, frameCount: 2, totalBytes: pixel.length * 2, urlTemplate: '/media/sequences/synthetic-test/desktop/frame_{frame}.png' } }
  const manifestFile = path.join(root, 'media/sequences/synthetic-test/manifest.json')
  const save = () => writeFile(manifestFile, JSON.stringify(manifest))
  try {
    await mkdir(folder, { recursive: true })
    await writeFile(path.join(folder, 'frame_00000.png'), pixel)
    await writeFile(path.join(folder, 'frame_00001.png'), pixel)
    await writeFile(path.join(folder, '../poster.png'), pixel)
    await save()
    assert.equal((await validateManifest(manifestFile, root)).variants[0].frameCount, 2)
    manifest.derivativeFramesAllowed = false
    await save()
    await assert.rejects(validateManifest(manifestFile, root), /rights/)
    manifest.derivativeFramesAllowed = true
    manifest.desktop.width = 2
    await save()
    await assert.rejects(validateManifest(manifestFile, root), /Dimension mismatch/)
    manifest.desktop.width = 1
    manifest.desktop.totalBytes++
    await save()
    await assert.rejects(validateManifest(manifestFile, root), /byte total mismatch/)
    manifest.desktop.totalBytes--
    await save()
    await rm(path.join(folder, 'frame_00001.png'))
    await assert.rejects(validateManifest(manifestFile, root), /ENOENT/)
  } finally {
    assert.ok(path.resolve(root).startsWith(path.resolve(tmpdir()) + path.sep))
    await rm(root, { recursive: true, force: true })
  }
})

// Opt in with --browser. PLAYWRIGHT_MODULE may point to a local agent runtime's
// playwright/index.mjs; browser tooling is deliberately not a production dependency.
if (process.argv.includes('--browser')) {
  test('browser canvas draws, reverses, resizes and falls back without frame requests', async () => {
    const { createServer } = await import('vite')
    const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright')
    const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6GkAAAAASUVORK5CYII=', 'base64')
    const fixtureManifest = { id: 'synthetic-test', assetRegisterId: 'TEST-SYNTHETIC-ONLY', rightsStatus: 'approved', derivativeFramesAllowed: true, poster: '/__fixture/poster.png', alt: 'Synthetic test pixel', desktop: { ...variant, frameCount: 12, urlTemplate: '/__fixture/frame_{frame}.png' } }
    const server = await createServer({
      configFile: false,
      optimizeDeps: { entries: [], include: ['react', 'react-dom/client', 'react/jsx-dev-runtime', '@gsap/react', 'gsap', 'gsap/ScrollTrigger'] },
      server: { port: 0, host: '127.0.0.1' },
      plugins: [{ name: 'sequence-test-fixture', configureServer(server) {
        server.middlewares.use('/__sequence-test', async (_request, response) => {
          response.setHeader('Content-Type', 'text/html')
          response.end(await server.transformIndexHtml('/__sequence-test', `<!doctype html><html><head><title>Synthetic sequence test only</title><style>body{margin:0}.spacer{height:800px}.test-sequence{height:600px}h1{padding:2rem}</style></head><body><div id="root"></div><script type="module">
          import React from 'react';
          import {createRoot} from 'react-dom/client';
          import {ScrollImageSequence} from '/src/features/sequence/ScrollImageSequence.tsx';
          import {ScrollTrigger} from '/src/motion/gsap.ts';
          import {PlaybackContext} from '/src/motion/PlaybackContext.ts';
          const root=createRoot(document.getElementById('root'));
          const query=new URLSearchParams(location.search);
          const manifest=query.has('no-manifest') ? undefined : ${JSON.stringify(fixtureManifest)};
          if(manifest && query.has('mobile')) manifest.mobile={...manifest.desktop,frameCount:8};
          const controller=React.createRef();
          let playback=!query.has('blocked');
          window.__progress=p=>controller.current?.setProgress(p);
          window.__triggers=()=>ScrollTrigger.getAll().length;
          window.__unmount=()=>root.unmount();
          const render=()=>root.render(React.createElement(React.StrictMode,null,React.createElement(PlaybackContext.Provider,{value:playback},React.createElement('div',null,React.createElement('div',{className:'spacer'}),React.createElement(ScrollImageSequence,{poster:'/__fixture/poster.png',alt:'Synthetic test pixel',manifest,controllerRef:query.has('external')?controller:undefined,onProgress:()=>{},priority:true,className:'test-sequence'},React.createElement('h1',null,'Synthetic geometry test only')),React.createElement('div',{className:'spacer'})))));
          render();window.__rerender=render;window.__play=()=>{playback=true;render()};
          </script></body></html>`))
        })
      } }],
    })
    let browser
    try {
      await server.listen()
      const address = server.httpServer.address()
      browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })
      const errors = []
      const frames = []
      let failLastFrame = false
      page.on('pageerror', error => errors.push(error.message))
      await page.route('**/__fixture/*', async route => {
        if (route.request().url().includes('frame_')) frames.push(route.request().url())
        if (failLastFrame && route.request().url().includes('frame_00011')) { await route.fulfill({ status: 404, body: 'Synthetic missing-frame test' }); return }
        await route.fulfill({ contentType: 'image/png', body: pixel })
      })
      const url = `http://127.0.0.1:${address.port}/__sequence-test`
      await page.goto(url)
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.ready === 'true')
      assert.equal(await page.evaluate(() => window.__triggers()), 1, 'StrictMode must not duplicate triggers')
      assert.ok(frames.length < 12, 'Initial load must not fetch all sequence frames')
      const initial = await page.locator('canvas').getAttribute('data-frame')
      await page.evaluate(() => window.scrollTo(0, 800))
      await page.waitForFunction(() => Number(document.querySelector('canvas')?.dataset.frame) >= 6)
      await page.evaluate(() => { window.scrollTo(0, 1300); window.scrollTo(0, 0) })
      await page.waitForFunction(frame => document.querySelector('canvas')?.dataset.frame === frame, initial)
      assert.equal(await page.locator('canvas').evaluate(canvas => canvas.width), 1920, 'Canvas DPR must be capped at 1.5')
      await page.setViewportSize({ width: 1000, height: 800 })
      await page.waitForFunction(() => document.querySelector('canvas')?.width === 1500)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.waitForFunction(() => window.__triggers() === 0)
      const requestCount = frames.length
      await page.evaluate(() => window.scrollTo(0, 900))
      await page.waitForTimeout(100)
      assert.equal(frames.length, requestCount, 'Reduced motion must not request frames')
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.setViewportSize({ width: 390, height: 844 })
      await page.waitForFunction(() => window.__triggers() === 0)
      await page.goto(`${url}?no-manifest`)
      assert.equal(await page.locator('canvas').count(), 0)
      assert.equal(await page.locator('img').getAttribute('alt'), 'Synthetic test pixel')
      await page.evaluate(() => window.__unmount())
      assert.equal(await page.evaluate(() => window.__triggers()), 0)
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto(url)
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.ready === 'true')
      await page.evaluate(() => window.__unmount())
      assert.equal(await page.evaluate(() => window.__triggers()), 0, 'Unmounting an active scene must remove its trigger')
      await page.goto(`${url}?external&mobile`)
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.frame === '0')
      assert.equal(await page.evaluate(() => window.__triggers()), 0, 'Externally controlled scenes must create no child ScrollTrigger')
      failLastFrame = true
      await page.evaluate(() => window.__progress(1))
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.failedFrame === '11')
      assert.equal(await page.locator('canvas').getAttribute('data-ready'), 'true')
      assert.equal(await page.locator('canvas').getAttribute('data-frame'), '0', 'Missing exact frame must retain displayed pixels')
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.waitForFunction(() => document.querySelector('canvas')?.width === 1800)
      assert.equal(await page.locator('canvas').getAttribute('data-ready'), 'true', 'Resize must not hide valid canvas pixels')
      await page.evaluate(() => window.__progress(0.5))
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.frame === '6')
      assert.ok(Number(await page.locator('canvas').getAttribute('data-cache')) <= 12)
      failLastFrame = false
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.variant === 'mobile' && document.querySelector('canvas')?.dataset.frame === '4')
      assert.equal(await page.locator('canvas').evaluate(canvas => canvas.width), 960, 'Compact DPR must cap at 1.25')
      await page.evaluate(() => window.__progress(1))
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.frame === '7')
      await page.setViewportSize({ width: 390, height: 844 })
      await page.waitForFunction(() => document.querySelector('canvas')?.width === 488)
      assert.equal(await page.locator('canvas').getAttribute('data-frame'), '7')
      await page.evaluate(() => window.__progress(0))
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.frame === '0')
      assert.equal(await page.locator('canvas').getAttribute('data-fit'), 'contain')
      await page.waitForTimeout(100)
      const beforeRerender = await page.locator('canvas').getAttribute('data-decoded')
      await page.evaluate(() => window.__rerender())
      await page.waitForTimeout(100)
      assert.equal(await page.locator('canvas').getAttribute('data-decoded'), beforeRerender, 'A new callback identity must not rebuild the loader')
      const beforeIntro = frames.length
      await page.goto(`${url}?external&mobile&blocked`)
      await page.locator('img').waitFor()
      await page.waitForTimeout(100)
      assert.equal(frames.length, beforeIntro, 'Intro playback context must prevent frame requests')
      await page.evaluate(() => window.__play())
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.ready === 'true')
      await page.evaluate(() => window.__unmount())
      await page.waitForTimeout(100)
      await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, effectiveType: '4g' }, configurable: true }))
      const beforeSaveData = frames.length
      await page.goto(url)
      await page.locator('img').waitFor()
      assert.equal(await page.evaluate(() => window.__triggers()), 0)
      await page.waitForTimeout(100)
      assert.equal(frames.length, beforeSaveData, 'Save-Data must prevent every frame request')
      assert.deepEqual(errors, [])
      console.log('Browser evidence: canvas decode, reverse scrub, external controller without child triggers, missing-frame hold, resize retention, mobile/tablet variant, bounded cache, DPR caps, StrictMode/unmount cleanup, reduced motion, Save-Data and absent-manifest fallback passed.')
    } finally { await browser?.close(); await server.close() }
  })
}

if (process.argv.includes('--ffmpeg')) {
  test('FFmpeg extracts a synthetic test source with validated manifest and refuses overwrite', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'lamborghini-synthetic-extraction-test-'))
    const source = path.join(root, 'synthetic-color-bars.mp4')
    const executable = process.env.FFMPEG_PATH || 'ffmpeg'
    try {
      const generated = spawnSync(executable, ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'testsrc2=size=128x72:rate=8', '-t', '1', '-pix_fmt', 'yuv420p', source], { encoding: 'utf8', windowsHide: true })
      assert.equal(generated.status, 0, generated.error?.message || generated.stderr)
      const args = [path.resolve('scripts/extract-sequence.mjs'), '--source', source, '--id', 'synthetic-fixture-v1', '--asset-id', 'TEST-SYNTHETIC-ONLY', '--rights', 'approved', '--derivative-rights', 'approved', '--alt', 'Synthetic color bars for extraction test only', '--duration', '1', '--frames', '8', '--width', '128', '--ffmpeg', executable]
      const extracted = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', windowsHide: true })
      assert.equal(extracted.status, 0, extracted.error?.message || extracted.stderr)
      const report = JSON.parse(extracted.stdout)
      assert.equal(report.variants[0].frameCount, 8)
      assert.equal(report.variants[0].width, 128)
      assert.equal(report.variants[0].height, 72)
      const duplicate = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', windowsHide: true })
      assert.equal(duplicate.status, 1)
      assert.match(duplicate.stderr, /Output exists/)
    } finally {
      assert.ok(path.resolve(root).startsWith(path.resolve(tmpdir()) + path.sep))
      await rm(root, { recursive: true, force: true })
    }
  })
}

