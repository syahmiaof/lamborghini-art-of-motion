# Project brief

**As of:** 11 October 2026 · **Phase:** planning · **Owner:** independent portfolio concept

## Objective

Produce a premium, single-page automotive exhibition that demonstrates composition, interaction and engineering. The visitor should feel curiosity in the opening, acceleration through the middle and admiration in the closing. The page is a portfolio piece, not a commercial Lamborghini property.

## Audience and desired action

Recruiters and potential collaborators should be able to (1) experience the work, (2) inspect a meaningful interactive feature, and (3) reach an explicit creator/project link in the footer. Enthusiasts should be able to browse models without encountering a fake purchase funnel.

## Core proposition

**A machine revealed in three emotional acts:** mystery establishes attention, velocity and engineering earn credibility, and craftsmanship gives the visitor space to inspect the details. Each chapter must change what the visitor knows, not merely animate a new backdrop.

The page's conversion is a portfolio action: a visitor wants to inspect the maker's work or contact the maker. Model exploration is part of the demonstration, not a dealership lead funnel.

## Scope for first release

- Eight narrative chapters plus footer, in one URL with deep-linked chapter anchors.
- Revuelto-led filmic opening; Temerario and Urus SE appear as distinct alternatives in the showroom.
- Verified specifications with citations in data and a `Request quote from Lamborghini` **external official link** only if an appropriate official destination is verified during implementation. No price number without official regional source.
- Visual-only configurator with curated states backed by actual cleared imagery. If full combinations are unavailable, expose only supported combinations rather than recoloring photographs inaccurately.
- Reduced-motion, mobile and short-viewport variants planned from the start.

## Explicit exclusions

Official dealership identity, order placement, payment, lead capture, invented prices, synthetic performance claims, unlicensed official-site media, and a heavyweight 3D car added only for spectacle.

## Proposed quality measures (targets, not measured results)

| Measure | Initial target | Why |
| --- | --- | --- |
| Core Web Vitals | LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms on tested mobile conditions | Cinematic does not excuse a slow interface. |
| Accessibility | Keyboard path to every control; reduced-motion path covers all content | The narrative must remain usable. |
| Scroll completion | Measure chapter reach at 25/50/75/100% only if privacy-safe analytics is later added | Tests whether pacing earns continued attention. |
| Portfolio action | Track footer creator-link click rate only if analytics is later added | The actual conversion goal. |

No analytics are installed in this planning phase. Avoid claiming these targets have been achieved.

## Decisions and assumptions

- **Assumption:** English UI copy to suit a global portfolio audience; Malay can be added later without changing layout logic.
- **Assumption:** no geographic market for pricing, so first release uses “Price on request” and official model links.
- **Assumption:** no licensed media supplied yet; asset acquisition is a release gate, not a reason to substitute fake vehicle imagery.
- **Choice:** custom CSS/SCSS with design tokens over Tailwind for control of editorial geometry.
- **Choice:** no 3D car in v1. Reassess only if rights-cleared 3D assets and device testing justify it.

## Discovery findings and unresolved inputs

| Topic | Phase 1 finding | Production consequence |
| --- | --- | --- |
| Narrative anchor | Revuelto gives the opening and technical chapters one coherent subject. | The other two models appear when visitor has context, in the showroom. |
| Product truth | Manufacturer pages currently provide comparable power, acceleration and speed figures for all three models. | Store source and date with each metric; verify again before release. |
| Visual material | No media files or usage grants were supplied in this workspace. | Public build needs approved photo/video before vehicle-led scenes are final. |
| Price | No region or official quote basis was specified. | “Price on request”; no numeric MSRP. |
| Creator CTA | Portfolio/contact URL was not supplied. | Footer link destination remains an open input; no invented destination. |
| Configurator coverage | No matched photos of color/wheel/interior combinations exist yet. | Expose only asset-backed states or relabel as a curated design gallery. |

## Approval-worthy gates for later production

1. Asset provenance and public-display rights are documented.
2. Final visual direction can be compared against actual licensed frames.
3. Model facts and any outbound links are rechecked immediately before release.
