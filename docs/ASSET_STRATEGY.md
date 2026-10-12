# Asset strategy and rights gate

## The hard constraint

Lamborghini's [Terms of Use](https://www.lamborghini.com/privacy-legal) state that site photographs, video, graphics, fonts and other material are protected, and prohibit reproduction, download, publication or distribution without express written authorization. The word mark and logo are also protected. **An “independent concept” disclaimer does not grant an image or trademark license.** We can use official pages as factual references; we cannot assume their media are reusable assets.

## Acquisition order

1. **Written permission / licensed press material** whose terms explicitly cover a public portfolio site, edits, derivative frames and duration/territory. Retain the permission text.
2. **Commissioned or self-shot photography/video** with photographer and vehicle/location releases where needed; contract must cover web publication and derived frame sequences.
3. **Rights-cleared stock** depicting the exact model, with license allowing portfolio publication, transformation and any relevant trademark appearance. Read individual license terms.
4. If none of these are available: keep the project private as a composition prototype or use original abstract design studies clearly labeled as concept art. Do not present generated/other-model imagery as a real Revuelto, Temerario or Urus SE.

Do not scrape official CMS files, hotlink images, extract frames from a manufacturer's online video, or assume “editorial use” covers this showcase.

## Acquisition decision rule

Before accepting a candidate, check four things in order: **exact model and angle**, **visual quality at desktop/mobile crops**, **public portfolio rights**, and **permission for the planned edits or frame extraction**. An attractive image that fails any rights check remains a research reference, never a shipping asset. Track the answer and evidence per file in the asset register.

## Shot inventory and priority

| ID | Shot | Priority | Chapter | Candidate treatment |
| --- | --- | --- | --- | --- |
| A01 | Revuelto lights/front silhouette | Critical | Awakening | Still + optional licensed sequence |
| A02 | Revuelto full three-quarter/side view | Critical | Presence/finale | Wide desktop and portrait mobile crops |
| A03 | Revuelto driving/track frame | High | Velocity | Still or short sequence |
| A04 | Powertrain or body detail | High | Engineering | Close crop with accurate callouts |
| A05 | Revuelto cockpit and one material detail | High | Interior | Two photographic stills |
| A06–A08 | Comparable Revuelto/Temerario/Urus SE views | Critical | Showroom | Similar camera and lighting where possible |
| A09+ | Exact supported configuration variations | Conditional | Configure | One complete image per selectable visual state |

`A01`, `A02`, `A06–A08` are the minimum visual gate for a credible first build. If `A09+` is unavailable, configure becomes a curated “design mood” gallery with honest labels, not a fake car configurator.

## Source tracks to pursue

| Track | What to request or inspect | Likely constraint |
| --- | --- | --- |
| Manufacturer / media contact | Written permission for a named portfolio URL, named image/video set, edits and derived frames | Access to a media portal alone may not include public portfolio rights. |
| Independent automotive photographer | Exact model shoots with web display and derivative rights in the contract | Color/angle continuity across three models may cost time or money. |
| Licensed stock provider | Individual asset license, recognizable model accuracy, transformation/public-display permission | Editorial-only restrictions may exclude a promotional portfolio use. |
| Original self-shot material | Ownership, location/vehicle permissions where applicable, crop/grade rights | The required models and lighting may be difficult to obtain. |

## Asset register fields

Record `id`, `file`, `model`, `view`, `sourceUrl`, `creator`, `rightsHolder`, `licenseEvidencePath`, `allowedUses`, `allowedDerivatives`, `expiry`, `creditRequirement`, `acquiredAt`, `reviewedAt`, `status`, and `notes`. A media item may enter `public/` only after `status=approved`. See [asset register](assets-plan/ASSET_REGISTER.csv) for the initial shot requirements.

## Processing

- Keep untouched originals outside `public/` under `references/licensed-originals/` only after rights review; gitignore large originals if repository policy warrants it.
- Generate AVIF/WebP responsive derivatives, retain a JPEG fallback where browser support or quality requires it, and encode explicit dimensions and crops.
- Separate desktop/mobile art direction; do not rely on an automatic center crop for a low wide car.
- Derive a blurred tiny preview or neutral background for image load, never ship a page that depends on an 8 MB hero asset to show meaning.
- Store caption/source metadata alongside each media manifest entry. Internal source attribution is mandatory even where public credit is not.

## Trademark and representation

Use model names only as factual identifiers with the independent-concept disclosure prominent enough to avoid confusion. Avoid official logo lockups, official site navigation mimicry, dealer-style pricing and “configure your Lamborghini” wording that implies an official manufacturer tool.
