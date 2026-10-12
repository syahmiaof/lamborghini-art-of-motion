# Motion system

## Motion roles

| Role | Use | Guidance |
| --- | --- | --- |
| Reveal | Expose a new image or line of thought | 0.6–1.1 s, masked crop/translate; one focal movement at a time. |
| Scrub | Couple physical scroll to vehicle reveal | Linear frame mapping; reversible; no unbounded work per tick. |
| Accent | Hover/focus response | 160–280 ms; underline/line displacement or subtle image crop. |
| Data | Introduce verified value | Numeral transition paired with static text; never hide units. |
| Transition | Carry visual geometry between chapters | Reuse body line, light edge or technical rail. |

Timings are design starting points, not measured performance results. Use custom easing sparingly for triggered transitions; scroll-scrubbed content should map linearly to input.

## Implementation approach

The [Video-to-image sequence plan](VIDEO_IMAGE_SEQUENCE_PLAN.md) specifies frame counts, lazy windows, canvas ownership and fallback gates. Treat the poster as the opening image; motion begins only after it is ready.

- One GSAP plugin registration module. Prefer `@gsap/react` `useGSAP` with a scoped container so timelines and ScrollTriggers revert on unmount. Create triggers in document order and refresh after fonts/media change layout. [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [@gsap/react](https://github.com/greensock/react).
- Animate children inside a pinned section, never the pinned element. Keep pin distance content-based and test short landscape/zoom-height viewports. If the pin cannot fit, use a condensed timeline or natural flow, preserving content.
- Use `gsap.matchMedia()` for desktop/mobile/reduced-motion variants. The reduced-motion version removes scroll-linked animation and pins; content stays present.
- Lenis is **conditional**. Start with native scroll and add Lenis only if browser QA shows a real gain. If enabled, use its documented GSAP ticker sync, `lenis.on('scroll', ScrollTrigger.update)`, one RAF source, and clean up listeners/ticker on unmount. [Lenis README](https://github.com/darkroomengineering/lenis).
- SplitText only for 2–3 major headings. Use line/word splitting, `autoSplit` when line breaks may change, keep the original semantic heading accessible, and revert on teardown. [SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/).
- Avoid scroll-jacking, globally transformed scroll containers, perpetual `will-change`, and animation that requires pointing-device hover to reveal content.

## Choreography by mood

- **Awakening:** delay and restraint; the first image appears before complex scripts initialize.
- **Velocity:** faster masks and compressed gaps; movement aligns with legitimate performance facts.
- **Engineering:** precise, inspectable lines; labels hold long enough to read.
- **Interior/finale:** longer stillness and minimal movement.

## Responsive and accessibility rules

Keyboard navigation must move focus to the destination heading after chapter selection. Buttons respond equally to hover and focus-visible. A pause/disable motion control should not remove access to chapter content. Do not split body paragraphs or animate each character. Canvas sequences need equivalent HTML text and useful poster alt text.

## Engineering watchlist

| Risk | Mitigation / acceptance check |
| --- | --- |
| Pin fails at short desktop height or browser zoom | Test 1280×560, 1440×900, 390×844, landscape mobile and 200% zoom; essential content remains visible. |
| ScrollTrigger measured before images/fonts settle | Reserve aspect ratio, await critical font/image decode and refresh once. |
| Lenis and GSAP RAF drift | One ticker integration, no duplicate RAF loops; test native scroll as baseline. |
| Reverse scroll glitches | Scrubbed timeline and sequence index are deterministic in both directions. |
| Heavy paint/decode | Prefer transform/opacity; cap active decoded frames and profile on target devices. |

## Ownership and lifecycle

| Layer | Responsibility | Cleanup |
| --- | --- | --- |
| `src/motion/gsap.ts` | Register `useGSAP` and `ScrollTrigger` once; export the configured instance | Module lifetime |
| Chapter component | Own DOM scope and one timeline/trigger group | `useGSAP` context reverts when chapter unmounts or variant changes |
| `src/features/sequence/` | Decode nearby frames and draw only changed index | Abort fetch, close bitmaps, clear canvas references |
| App shell | Resolve motion preference and expose control | Remove media-query listeners on unmount |

Create triggered scenes in document order. A pinned element itself is never transformed; animate its children. The scaffold includes the registration module but leaves it out of the entry bundle until a real chapter needs animation; it must not create placeholder pinned scenes before approved media and measured layouts exist.

## Motion variants

```text
full:     CSS microinteractions + GSAP reveals + selective scrub/pin
compact:  shorter reveals, no long pins or image sequence on short/touch screens
reduced:  static content order, no scrub/pin/parallax/large scale transitions
```

The variant is selected from capability and viewport constraints, not device labels alone. Touch does not automatically mean low performance, and desktop width does not guarantee enough height for a pin.

## Motion acceptance checks

1. Scroll down, reverse, refresh midchapter and use browser back/forward; chapter states stay deterministic.
2. Navigate by keyboard; no visual information appears only on hover or after a timed reveal.
3. Toggle reduced motion during a session; active timelines revert without hiding content.
4. Observe animation in browser performance tools on both desktop and mobile conditions; adjust based on measured frame work, not an assumed 60 fps claim.
