# ScrollImageSequence

The component owns decoding and Canvas 2D drawing. Cinematic chapters should own their one ScrollTrigger/pin and feed normalized progress through a controller; the component creates **no ScrollTrigger** when `controllerRef` is supplied.

```tsx
const sequence = useRef<SequenceController>(null)
// In the chapter's scoped ScrollTrigger onUpdate/onRefresh:
sequence.current?.setProgress(self.progress)
// Render inside the chapter's stable media layer:
<ScrollImageSequence controllerRef={sequence} manifest={manifest}
  poster={manifest.poster} alt={manifest.alt} priority />
```

`setProgress` stores progress even before the loader is ready. The mapping is always `round(clamp(progress, 0, 1) * (frameCount - 1))`. It performs no per-frame React state update. Legacy `pin`, `scrollDistance`, `triggerElement`, `refreshPriority` and `onProgress` props remain supported for independently controlled sequences. Do not combine the legacy internal pin with a parent pin.

## Responsive rendering and fallback

Desktop starts at 900 px. Below that, a valid `manifest.mobile` variant is selected with its own frame count and dimensions; without one, the poster remains. There is no arbitrary minimum-height playback block. Reduced motion, the `disabled` prop, Save-Data and 2G connections use the semantic poster. `supportsSequencePlayback(manifest)` exposes the same capability decision for the parent scene.

The poster uses z-index 0, canvas 1, and the optional content wrapper 2. All meaningful copy remains HTML. Pass `fit="cover"` or `fit="contain"` and normalized `focalPoint={{ x: 0.5, y: 0.5 }}`. Parent scene CSS owns the visible height; the default aspect ratio reserves space. Only the hero poster should receive `priority`.

Canvas dimensions are updated only when backing-store size changes, with DPR capped at 1.5 desktop / 1.25 compact. Resize synchronously restores old pixels and redraws the last valid decoded frame. It does not hide the canvas or flash the initial poster during ordinary resizing.

## Cache and lifecycle

`FrameLoader` retains at most 10 decoded desktop frames / 8 compact frames, with 3 / 2 concurrent requests. It prioritizes the target and a nearby directional window, aborts obsolete requests, suppresses stale distant completions, and closes evicted bitmaps. A missing target holds the displayed frame. A first load may use a decoded near neighbour until the exact target arrives. Individual failures never shut down the entire scene; retries are bounded to two attempts per frame.

IntersectionObserver loads nearby scenes, rather than all three on entry. Offscreen/hidden scenes abort their queue and retain only the last displayed bitmap for safe resizing. Unmount releases that remaining bitmap too. Reduced-motion changes, variant switches and React StrictMode teardown dispose observers, downloads and internal triggers.

Diagnostics on the canvas: `data-ready`, `data-frame` (displayed), `data-target`, `data-cache`, `data-pending`, `data-failed`, `data-failed-frame`, and `data-variant`. Root `data-sequence` identifies the manifest. Frame paths support optional `startIndex`/`padLength`; defaults remain zero-based/five-digit for legacy media. New one-based/four-digit assets declare `startIndex: 1, padLength: 4`.

## Verification

```powershell
node scripts/sequence-tests.mjs
node scripts/sequence-tests.mjs --browser
```

Browser mode uses local Playwright, optionally located through `PLAYWRIGHT_MODULE` pointing to `playwright/index.mjs`; `PLAYWRIGHT_CHANNEL=msedge` uses installed Edge. It starts and closes its own fixture server. Tests use explicitly synthetic images and never replace production car frames.

Tests cover deterministic reverse mapping, numbering, bounded queue/cache, stale decode cleanup, isolated failure recovery, retained redraw while missing a target, canvas resize, external progress ownership, mobile/tablet variants, StrictMode, reduced motion and Save-Data. Real footage art review, crop inspection, parent pin choreography and physical-device performance remain the complete homepage QA responsibility.
