# UI section blueprint

Each chapter is a distinct composition. Entry/pin/exit are desktop concepts; mobile and reduced-motion alternatives are required, not afterthoughts.

| Chapter | Layout and key copy | Entry | During scroll / pin | Exit | Required assets | Mobile adaptation |
| --- | --- | --- | --- | --- | --- | --- |
| 01 Awakening | Dark full-bleed light signature; title and `Scroll to discover` | Poster visible immediately; light reveals from center | Optional short image sequence, capped to one viewport of travel; title remains legible | Body line wipes toward Presence | Cleared front/three-quarter sequence or still, separate poster | Still plus brief CSS light reveal; no long pin |
| 02 Presence | Oversized editorial headline offset from full vehicle image | Image mask opens, text rises by line | Small parallax between image and caption | Angular crop cuts to motion photo | Cleared full vehicle still in desktop/mobile crops | Image above concise copy, no giant offscreen type |
| 03 Velocity | Track image with narrow metric rail | Image accelerates via clip/scale; numbers count once into place | Short sticky panel where metrics synchronize to image movement | Rail contracts into fine divider | Cleared dynamic vehicle still/optional sequence; verified metrics | Static image and sequential metrics; avoid 300vh scroll |
| 04 Engineering | Dark detail image and precisely drawn callouts | Annotation lines draw to identified areas | One controlled pin; focus moves through 2–3 real engineering points; optional short detail sequence only after its own gate | Last line guides eye into cabin | Cleared powertrain/detail images, sourced claims | Stack image and annotations; tap/keyboard reveals details |
| 05 Interior | Warm black material close-ups; narrow editorial copy | Soft image reveal | No pin by default; rhythm slows across two images | Camera-like crop returns to full vehicle | Cleared cabin stills and detail captions | Single-column gallery with generous text spacing |
| 06 Showroom | Single hero bay; model index; facts beneath | Selected model fades/changes with image decode | No scroll hijack; user switches models explicitly | Active model carries into styling section | Three cleared vehicle views with comparable framing | Swipe is optional; visible buttons always work |
| 07 Configure | Large preview plus compact option matrix and summary | Current model preview resolves | Direct clicks change only supported curated states | Summary folds into final poster | Rights-cleared option variants for every exposed state | Preview first, controls second; sticky controls only if safe |
| 08 Finale | Quiet full-bleed still; huge title; maker CTA | Motion decelerates; line returns to original heading | No pin necessary | Footer flows naturally | Cleared hero/detail still | Simple image/text, clear CTA and disclaimer |

## Components to plan, not overgeneralize

The per-chapter sequence decision, frame budgets and canvas/DOM split live in [Video-to-image sequence plan](VIDEO_IMAGE_SEQUENCE_PLAN.md). The first release budgets one optional sequence in Awakening; other chapters use stills unless separately approved.

`ChapterShell`, `ChapterNav`, `EditorialHeading`, `MediaFrame`, `StatLine`, `ModelSwitcher`, `SpecComparison`, `ConfigChoice`, `ConceptNotice`, `SequenceCanvas`. Chapter-specific compositions should remain specific; a single universal section component would flatten the art direction.

## Text and data rule

All visible technical values come from typed model data with `sourceUrl`, `retrievedAt`, `market`, `unit` and qualification fields. Creative copy is separately authored and cannot masquerade as a manufacturer statement.

## Chapter contract for implementation

Every chapter owns its semantic content, media manifest reference, optional motion timeline and fallback. A chapter never owns global scroll state or another chapter's animation. A missing asset produces a readable editorial state in development; it cannot silently substitute a different car image.

| Chapter | Visitor action | Information contract | Fallback contract |
| --- | --- | --- | --- |
| Awakening | Scroll or skip | State independent concept and featured model by first viewport | Poster or typographic composition; skip always works |
| Presence | Continue exploring | Reveal one original design observation, clearly not a manufacturer quote | Text and static image in normal flow |
| Velocity | Inspect figures | 0–100 and top speed from sourced data; preserve inequality and units | Static figures remain visible |
| Engineering | Inspect 2–3 details | Annotations must point to the actual photographed part and link to source | Use text-led technical plate if no accurate detail image |
| Interior | View material/cockpit details | Captions describe only what the approved image shows or sourced facts | Editorial text and available approved stills |
| Showroom | Explicitly select model or compare | Same fields/units for all three models; selection announced to assistive tech | Text comparison remains usable without transition imagery |
| Configure | Select a supported look | UI lists only media-backed complete combinations | Relabel as curated design gallery when variation coverage is insufficient |
| Finale | Follow creator/official links | Creator attribution, independent disclosure, source links | All links and copy work with no motion or media |

## State boundaries

- `selectedModel` belongs to the showroom/configurator feature and defaults to Revuelto. It may persist across those two sections, not across unrelated chapters.
- `selectedLook` is a valid manifest ID, never a free combination of separate paint/wheel/interior keys unless an image exists for that exact combination.
- `motionPreference` is global and resolves OS preference plus the visitor's session override. Reducing motion never removes content.
- Media load state is local to each frame: poster → decoded media or poster → recoverable failure.

## Responsive cutover

Desktop can use pins only where the scene and text fit inside the available viewport. At narrow or short viewport conditions, chapters use normal document flow with the same semantic order. The page must not rely on hovering, swiping or following a moving target to access a fact.
