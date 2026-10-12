# Information architecture and UX

## Single-page map

```text
Global: concept identity · chapters menu · motion toggle · external official-model links
Main:
  #awakening    Opening and identity
  #presence     Vehicle design
  #velocity     Performance
  #engineering  Powertrain / technical story
  #interior     Cabin / craftsmanship
  #showroom     Model switcher and comparison
  #configure    Visual concept configurator
  #finale       Closing / creator CTA
Footer: sources · disclaimer · project credits
```

## Navigation behavior

- Desktop: minimal fixed header becomes a small chapter rail after the opening; active chapter is announced by text and index, never color alone.
- Mobile: one `Chapters` button opens a compact semantic menu; normal page scroll remains available.
- Skip intro links to `#presence`. Deep links use native anchors with offset handling. Back/forward and keyboard focus must follow the selected chapter.
- Motion toggle persists for the session, honors `prefers-reduced-motion`, and is separate from optional audio control.

## Showroom interaction

One active model at a time. Tabs or a radio group present Revuelto, Temerario and Urus SE. Switching changes the image, name, class and a **consistent** set of verified metrics; accessible live text confirms the selected model. Comparison opens a compact three-column specification table on desktop, vertically stacked semantic rows on mobile. Units and caveats remain visible. No fabricated hierarchy such as “best value.”

## Configurator concept truth

This is a visual styling exercise, not an official configuration or purchase tool. A selection is an entry in a curated media manifest with a real image for that exact look. If only one wheel or interior angle is available for a paint option, the UI disables or omits missing choices. The selection summary says “Visual concept / indicative only.” The CTA is `Explore official Lamborghini model`, not `Buy` or `Reserve`.

## Price treatment

No price number in v1 because no market, tax basis or current official published offer has been established. Each model reads **Price on request**. The comparison explains that actual quotations depend on region and specification. Later prices need market, currency, model year, source URL, retrieval date and exact qualification stored in data before display.

## Failure and access states

| Situation | Behavior |
| --- | --- |
| Sequence frames fail/are slow | Poster image stays visible; text and navigation never wait for frames. |
| JS unavailable | Semantic chapter content, still images and links remain readable. |
| Reduced motion | No scroll scrub, pins or large zoom; replace with static editorial layouts and simple opacity if allowed. |
| Narrow/short viewport | Condense or unpin scenes while preserving all content and anchors. |
| Model image unavailable | Keep name/specs and show a neutral labeled image unavailable state; never swap to another model silently. |

## Portfolio conversion

Primary CTA: `View the maker's work` or a verified portfolio link in closing/footer. Secondary: `Explore the official model` (external). If analytics is later requested, measure chapter completion and creator-link CTR with privacy-safe events; no tracking is required to make the page function.
