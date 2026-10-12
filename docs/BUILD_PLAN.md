# Build plan

## Stack decision

React + TypeScript + Vite; custom CSS with a small token layer, adding CSS modules or SCSS for chapter-specific styling where helpful; GSAP + ScrollTrigger + `@gsap/react` for actual scenes; SplitText only where it improves major headings. Add Lenis **after** native-scroll QA if needed. No R3F dependency in first release. Image optimization and FFmpeg are build-time tooling, not runtime libraries.

This document is the **implementation plan**. The immediate deliverable is a compilable app scaffold with one honest development frame. It does not claim the cinematic homepage is built before cleared imagery exists.

## Proposed structure after scaffold

```text
LAMBORGHINI/
  PRODUCT.md
  docs/                          # this planning packet
    research/MODEL_FACTS.md
    assets-plan/ASSET_REGISTER.csv
  references/                    # moodboards and licensed originals, access-aware
  public/media/                  # rights-approved, processed delivery files only
  src/
    app/                         # page composition and providers
    chapters/                    # one component + motion file per chapter
    components/                  # nav, headings, controls, media frame
    features/showroom/           # model switcher, comparison
    features/configurator/       # curated variant state
    features/sequence/           # frame manifest, loader, canvas player
    data/                        # sourced specs, image rights IDs, sequence manifests
    motion/                      # GSAP registration, media queries, helpers
    styles/                      # tokens, typography, base, chapter styles
    utils/                       # clamps, asset checks, typed helpers
  scripts/                       # asset processing/manifest verification
```

## Sequence of work

| Phase | Deliverable | Exit gate |
| --- | --- | --- |
| 0. Discovery | Brief, storyboard, source register, rights plan | This packet is internally consistent. |
| 0.5. Scaffold | Vite/React/TS, tokens, chapter manifest, motion registration and an honest development frame | Typecheck/lint/build pass; desktop/mobile render inspected. |
| 1. Asset acquisition | Cleared A01/A02/A06–A08 images and rights records | Public-use scope verified; correct model and crops. |
| 2. Art direction | Desktop/mobile keyframes for Awakening, Velocity, Showroom, Interior | Compositions work with **real selected** imagery, not generic placeholders. |
| 3. Homepage foundation | Semantic chapters, sourced model data, navigation and static responsive composition | Every chapter readable and keyboard-operable before chapter motion. |
| 4. Core scenes | Hero, Presence, Velocity, Engineering, Interior, Finale | Desktop/mobile compositions and source links integrated. |
| 5. Interaction | Showroom/compare; curated configurator | Every exposed state has accurate media and accessible feedback. |
| 6. Motion | GSAP chapter timelines; optional sequence; conditional Lenis | Reverse scroll, short viewport, mobile and reduced motion verified. |
| 7. Finish | Image optimization, typography, visual QA, tests, credit/disclaimer | Build passes; no broken media, overflow or unsupported claim. |

## Scaffold milestone — current task

1. Add Vite/React/TypeScript tooling, scripts, lint rules and a small global style foundation.
2. Add a semantic app entry, a development frame that exposes the narrative direction without pretending finished scenes exist, and the independent-concept disclosure.
3. Add a typed chapter manifest and a central GSAP registration module. Keep heavyweight sequence/3D dependencies out.
4. Reserve `public/media/` for rights-approved deliverables; no copied Lamborghini website assets.
5. Validate typecheck, lint and production build. Inspect the rendered scaffold at desktop and mobile widths for broken layout or horizontal overflow.

This milestone is complete only when the commands pass and the browser render has been inspected. The next milestone still begins with rights-cleared hero/showroom images and desktop/mobile keyframes.

## Data and component boundaries

- `src/data/chapters.ts` provides stable IDs, labels and order for navigation; it has no animation instructions.
- `src/motion/gsap.ts` is the single plugin registration entry. Chapter components own selectors, scopes, timelines and teardown.
- `src/features/showroom/` will own model choice and comparison. `src/features/configurator/` will consume a curated valid-look manifest; neither feature can invent a price or a visual variant.
- Media manifests will bind each public file to an asset-register ID and rights status. Build tooling should reject missing/unapproved references before release.
- Semantic React content renders before chapter motion; scroll choreography is progressive enhancement. The Vite SPA needs JavaScript, so `index.html` carries a truthful essential `<noscript>` summary rather than claiming a full no-JS chapter experience.

## Validation matrix for build phase

- `typecheck`, lint and production build.
- Browser QA at 1440×900, 1280×560, 390×844, 360×740, landscape mobile, and 200% zoom. Check normal and reduced motion in Chromium and WebKit where available.
- Keyboard-only journey, focus order, chapter anchors, model/configuration choices, image error fallback and browser history restore.
- Network/performance check: hero is not lazy-loaded; later scenes defer; frame bytes and decode are profiled rather than assumed.
- Capture desktop/mobile screenshots after animations settle and compare to approved keyframes.
- Recheck model facts, outbound URLs, asset rights, credits and disclaimer immediately before publishing.

## Risks and tradeoffs

| Risk | Decision |
| --- | --- |
| Real Lamborghini media rights unresolved | Keep acquisition as a gate. Do not hide it behind an attribution line. |
| Three featured models demand many equal-quality angles | Use one image per model for v1; do not imply 360° coverage. |
| Configurator combinations explode exponentially | Curated valid states, not independent options that falsely combine. |
| Animated canvas increases bytes/memory | Prototype one short sequence; ship still fallback if profiling fails. |
| Scroll pin degrades mobile | Mobile-specific natural flow with same information. |

## Next executable milestone

After this scaffold, source and record the minimum cleared photos, then make four desktop/mobile keyframes using the actual images. Build the static semantic homepage composition from those keyframes before attaching chapter motion.
