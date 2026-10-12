# Video-to-image sequence plan

**Status:** design pending rights-cleared footage and browser profiling. Frame counts and byte caps are starting budgets, not measured results. The homepage can ship with a still if the sequence fails its gates. [Asset strategy](ASSET_STRATEGY.md) controls public and derivative-frame rights.

## 1. Section decisions and frame budgets

Use a sequence only when precise, reversible scroll position changes the visual story. Delivered frames need not equal the source video FPS.

| Chapter | Decision | Starting frame count | Renderer | Mobile / constrained fallback |
| --- | --- | ---: | --- | --- |
| **01 Awakening** — lights/front silhouette | **Only sequence approved for the first prototype.** Headline stays in HTML. | 48–72 desktop over about one viewport of scroll; optional 16–24 mobile only after real-device testing. | Canvas 2D over a semantic poster `<picture>`. | Poster plus brief CSS light reveal; no long pin. |
| **02 Presence** — side profile | Still and mask by default. Sequence only for a licensed, stable camera orbit that reveals more than a still. | Optional 24–40 desktop; **0 in v1**. | Canvas if intermediate angles matter; DOM crossfade for 2–4 selected views. | Approved portrait still. |
| **03 Velocity** — track/drive-by | Start with still, crop and metrics. Compare video if natural playback is the goal. | Optional 36–60 desktop; **0 in v1**. | Canvas only if exact scroll control is essential; otherwise DOM still/video. | Still and facts in normal flow. |
| **04 Engineering** — wheel/detail | Local rotation only if it reveals a real, sourced feature. | Optional 16–32 desktop; **0 in v1**. | Canvas for continuous rotation; DOM for 2–3 labeled states. | Static detail and accessible callout list. |
| **05 Interior** | Two to four editorial stills. | **0** | DOM `<picture>` / `<img>`. | Same content, one column. |
| **06 Showroom** | Explicit model selection with comparable stills. | **0** | DOM `<picture>` / `<img>`. | Same controls. |
| **07 Configure** | One complete approved image per supported look. | **0** | DOM `<picture>` / `<img>`. | Same valid looks. |
| **08 Finale** | One still and CTA. | **0** | DOM `<picture>` / `<img>`. | Same content. |

**Release cap:** one full sequence, Awakening. Optional sequences are separate future decisions requiring their own rights, art and performance review. Do not initialize or preload multiple full sequences on page entry.

## 2. Source and extraction pipeline

1. Acquire source video with **explicit derivative-frame rights**. Log source, creator, permission and intended edits in the asset register.
2. Identify a clean 2–4 second shot; make a contact sheet and lock first/last frames plus desktop/mobile crops. Favor a stable camera move so reverse scroll does not wobble.
3. Extract a selected working set with FFmpeg, e.g. `ffmpeg -ss 00:00:01.200 -i source.mov -t 00:00:02.500 -vf "fps=24,scale=1600:-2" -start_number 0 working/frame_%05d.png`. This example was **not run** against a real source and is not the final compression pipeline. Select the delivered frame count from the working set.
4. Grade/crop consistently, export compressed AVIF/WebP where decode performance is acceptable; test on target browsers. Produce desktop and mobile variants if camera framing needs it.
5. Emit a manifest with frame count, dimensions, URL template, poster, alt text, source/license ID and per-variant byte totals. A build check must reject gaps, inconsistent dimensions, missing files and unapproved sources.
6. Deliver only processed frames from `public/`; keep originals and lossless working frames outside public delivery.

## 3. Initial budget to validate, not a guarantee

Prototype 48–72 delivered frames for **one** scene. Aim for ≤4 MiB transferred for desktop and ≤2 MiB for an optional mobile sequence, excluding the separately optimized poster. Profile transfer, decoding, memory and visual quality before committing. If it fails, shorten the sequence, reduce resolution or use the still/mask composition. These are review targets, not claimed measurements or universal limits.

## 4. Folder organization and naming

```text
references/licensed-originals/awakening-revuelto/source.mov    # access-controlled
references/licensed-originals/awakening-revuelto/rights.pdf
references/licensed-originals/awakening-revuelto/working/frame_00000.png

public/media/sequences/awakening-revuelto/manifest.json
public/media/sequences/awakening-revuelto/poster-desktop.avif
public/media/sequences/awakening-revuelto/poster-mobile.avif
public/media/sequences/awakening-revuelto/desktop/frame_00000.webp
public/media/sequences/awakening-revuelto/desktop/frame_00001.webp
public/media/sequences/awakening-revuelto/desktop/frame_00071.webp
public/media/sequences/awakening-revuelto/mobile/frame_00000.webp  # only if approved

src/data/sequences.ts                       # typed manifest references
src/features/sequence/SequenceCanvas.tsx    # poster, canvas, resize, semantics
src/features/sequence/useSequenceFrames.ts  # bounded fetch/decode/cache
src/features/sequence/useSequenceScroll.ts  # GSAP progress ownership
scripts/validate-sequences.mjs              # build-time media/rights checks
```

Use lowercase kebab-case sequence IDs and zero-based, contiguous **five-digit** frame names (`frame_00000.webp`). The example last frame is for a 72-frame desktop variant; manifests own actual counts. Mobile may have a different count, declared explicitly. Keep frame names free of timestamps and spaces. Version a sequence directory/manifest URL when content changes because Vite `public/` URLs are stable and unhashed.

Each manifest records `id`, `assetRegisterId`, desktop/mobile poster URLs and dimensions, `alt`, and per-variant `frameCount`, `width`, `height`, `extension`, `urlTemplate` and `totalBytes`. Components read this typed contract; they do not guess paths or counts. The poster carries useful alt text; canvas is decorative with `aria-hidden="true"`; all meaningful copy stays in HTML.

## 5. Loading, preloading and memory

| Moment | Policy |
| --- | --- |
| Initial paint | Render a sized responsive Awakening poster eagerly. If it is the LCP image, use `fetchpriority="high"` and make it discoverable early; add an appropriate `index.html` preload if React delivery delays discovery. **Do not lazy-load the hero poster.** |
| After poster is visible | If full motion qualifies, load frame 0 and a 6–10-frame forward window at background priority. Do not let frame requests compete with critical poster/CSS/font traffic. |
| Scene approaches | Use `IntersectionObserver` around one viewport ahead to activate a direction-aware window: current target plus roughly 4–8 nearby frames, including a few behind for reverse scroll. Do not queue all frames. |
| Active scrub | Deduplicate in-flight requests, start with a 2–4-job fetch/decode cap, and retain about 8–16 decoded frames with LRU eviction. Draw only a changed index; if missing, hold the nearest decoded frame or poster and draw a late frame only if it is still current. |
| Exit or variant switch | Abort pending fetches, release object URLs if used, call `ImageBitmap.close()` on eviction/cleanup, and disconnect observers. |

A 1600×900 RGBA bitmap is about **5.5 MiB decoded**; 12 frames are about 66 MiB before canvas and the rest of the page. Compressed download size is not runtime memory. Try `createImageBitmap()` and retain an `HTMLImageElement.decode()` route if conversion fails or performs worse. Cap canvas DPR at a tested value (start at 1.5), reserve its aspect ratio and redraw on resize without refetching unchanged frames. All numeric windows are initial tuning values, subject to profiling.

## 6. Mobile, slow-device and failure fallbacks

1. `prefers-reduced-motion: reduce`, a visitor motion-off choice, or a short viewport that cannot hold the scene: show the poster and all text in normal flow; create no sequence trigger or pin.
2. `navigator.connection?.saveData`, an available very-slow connection hint, or a low-data choice: use the poster. Missing connection hints do not imply a fast connection.
3. Narrow/touch layout: default to the poster. Enable the optional 16–24-frame smaller mobile variant only after real-device QA; touch alone is not a performance diagnosis.
4. Missing frames, failed decode, canvas context failure or cache pressure: hold the last good image/poster and keep scrolling, chapter links and CTA usable. Disable the sequence for the session after repeated failure.

No screen waits for all frames. Keep a skip path around any pinned scene. Do not overlay an endless loading state on the car.

## 7. Canvas versus DOM

Canvas 2D suits Awakening because a reversible sequence changes on nearly every scroll step. Draw with a measured `object-fit: cover` equivalent and variant-specific focal point; redraw only on integer frame or canvas-size change. The chapter's poster and HTML remain visible before canvas is ready.

DOM `<picture>` / `<img>` suits Presence's few selected views, Interior, Showroom, Configure and Finale: responsive sources, semantic alt and discrete state changes come for free. Decode a newly selected showroom/configuration image before crossfading. Changing `<img src>` on every scroll tick for a 72-frame scene adds decode/paint churn and timing complexity. For 2–3 discrete states, a DOM crossfade is simpler than a canvas player.

Velocity remains a fork: use a DOM still in v1; evaluate video for natural playback; use canvas only if scroll-controlled frame position proves essential and passes profiling.

## 8. GSAP ScrollTrigger integration

- Register ScrollTrigger once in `src/motion/gsap.ts`. The chapter owns one scoped `useGSAP` setup and its trigger; the sequence loader owns `requestFrame(index)` and `drawFrame(index)` and does **not** create triggers.
- In the full-motion `gsap.matchMedia()` branch only, target Awakening with `start: "top top"`, a measured end near one viewport of travel, `pin: section` only if content fits, and `scrub: true`. Animate children inside the pinned section, never the pinned element itself.
- Map progress deterministically: `index = clamp(Math.round(progress * (frameCount - 1)), 0, frameCount - 1)`. Request/draw only when it changes. Reverse scroll uses the same map. Use `ease: "none"` on a frame playhead; do not create a trigger or tween per frame.
- If numeric `scrub` smoothing is chosen, update frames from the **animation's** `onUpdate`; ScrollTrigger's `onUpdate` can stop when scroll stops while the tween keeps catching up. With direct `scrub: true`, trigger progress is enough.
- Text reveals may share the chapter timeline but cannot depend on frame downloads. Reserve dimensions, then refresh ScrollTrigger once after poster/fonts or a breakpoint change layout; never refresh per frame. Scoped GSAP context reverts on unmount, while the loader aborts fetches and closes bitmaps.
- Native scroll is the baseline. If Lenis is later added, use the single ticker/ScrollTrigger sync in [Motion system](MOTION_SYSTEM.md), with no second RAF loop for frames.

[GSAP's canvas sequence helper](https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub/) demonstrates frame mapping, but its example assigns `src` to **all** frames immediately. Use its mapping idea, not its eager-all loading pattern. [ScrollTrigger's `onUpdate` guidance](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) explains the numeric-scrub distinction.

## 9. Ship gates

| Gate | Evidence |
| --- | --- |
| Rights and fidelity | Public and derivative-frame permission recorded; exact Revuelto shot; desktop/mobile crop and poster approved. |
| Visual story | First/last frames selected; no exposure jump, crop drift or reverse-scroll wobble. |
| Network | Actual poster/sequence bytes recorded; hero request starts promptly and is not blocked by frame prefetch; test a throttled connection. |
| Runtime | Profile decode, main-thread draw and memory on real target devices; rapid reverse scroll shows no stale frames or crash. |
| Access | Reduced motion, motion-off, data-saving, keyboard skip, poster alt and text work without decoded frames. |
| Layout | Verify 1440×900, 1280×560, 390×844, 360×740, landscape mobile and 200% zoom; no trapped pin, overflow or layout shift. |

If any gate fails, ship the poster and restrained CSS reveal. The chapter remains complete without a sequence.

## Technical references

- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [canvas sequence helper](https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub/), and [GSAP React](https://github.com/greensock/react)
- [web.dev LCP resource discovery and priority](https://web.dev/articles/optimize-lcp)
- [MDN `createImageBitmap()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap) and [`ImageBitmap.close()`](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close)
