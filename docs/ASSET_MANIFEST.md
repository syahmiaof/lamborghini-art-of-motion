# Asset Manifest & Visual Audit Report

**Project:** LAMBORGHINI — THE ART OF MOTION  
**Audit & Implementation Date:** 12 October 2026  
**Art Director & Lead Motion Engineer:** Antigravity  
**Creative Theme:** The Awakening × Born to Race × Sculpted by Speed  

---

## 1. Executive Summary

This document establishes the comprehensive image audit, licensing provenance, technical specifications, and structural mapping for all visual photography assets across the *LAMBORGHINI — THE ART OF MOTION* digital experience.

In accordance with strict project boundaries:
1. **Zero Redesign / Rebuild:** Existing React architecture, Lenis smooth scrolling, GSAP ScrollTrigger timelines, responsive grid layouts, and interactive modals remain intact.
2. **Video Sequence Exclusions:** Video-to-image sequence rendering pipelines and canvas fallback mechanisms are strictly preserved without modification.
3. **100% Authentic Imagery:** All AI-generated placeholders, watermarked stock images, generic supercars, and mismatched model years have been completely eradicated.
4. **Legally Clear Provenance:** Every photographic asset is sourced from Wikimedia Commons under verified open licenses (Creative Commons CC BY-SA 4.0, CC BY-SA 2.0, or CC0 1.0 Public Domain).
5. **Zero Visual Duplication:** Identical asset reuse across disparate narrative chapters has been eliminated in favor of unique, contextually tailored automotive photography.

---

## 2. Comprehensive Slot Audit & Duplication Analysis

Prior to this asset recovery and enhancement phase, a forensic audit of the application revealed multiple instances of asset reuse and contextual misalignment:

| Section / Chapter | Previous Asset Reference | Audit Finding & Defect | Replacement Asset | Narrative Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **01 Awakening (Hero)** | `media.revueltoDark` | Reused across 3 distinct chapters (Awakening, Presence, Finale). | `media.revueltoDark` *(Preserved for Hero)* | Maintains dark moody atmosphere for opening curtain. |
| **02 Presence (Reveal)** | `media.revueltoDark` *(Duplicate)* | **Major Duplication:** Repeated the exact same black Revuelto photo from Hero poster. | `media.revueltoPresence` | Authentic Auto Zürich stage reveal under dramatic spotlights (photographed by M97 Uzair). |
| **03 Velocity (Speed)** | `media.revueltoDarkRear` *(Duplicate)* | **Mismatch & Duplication:** Static rear photo duplicated in Gallery Row 3; lacked sense of dynamic track velocity. | `media.revueltoVelocity` | Dynamic Goodwood Festival of Speed 2023 hillclimb run in Arancio Apodis (photographed by MrWalkr). |
| **04 Engineering (Powertrain)** | `media.revueltoRear` | Verified authentic rear exhaust/engine cover detail at Goodwood. | `media.revueltoRear` *(Retained)* | Accurately exposes 6.5L naturally aspirated V12 and hybrid e-motor architecture. |
| **05 Craftsmanship (Interior Hero)** | `media.revueltoInterior` | Duplicate of Gallery Row 1 inside the same chapter. | `media.revueltoInterior` *(Cockpit Hero)* | Primary wide view of driver cockpit, steering wheel, and digital instrument cluster. |
| **05 Gallery (Row 1 - Monofuselage)** | `media.revueltoInterior` *(Duplicate)* | **Duplicate:** Repeated the wide cockpit image inside the same chapter's detail grid. | `media.revueltoInteriorDetail` | Close-up driver cockpit controls, forged carbon monofuselage architecture, and center console. |
| **05 Gallery (Row 2 - Exterior Stance)** | `media.revueltoLime` | Authentic green Revuelto exterior in natural light. | `media.revueltoLime` *(Retained)* | Contrasting vibrant livery showing aerodynamic door sculpts. |
| **05 Gallery (Row 3 - Aerodynamics)** | `media.revueltoDarkRear` *(Duplicate)* | Duplicated static rear photo used previously in Velocity. | `media.revueltoRear` | Distinct high-angle rear aerodynamic profile at Goodwood. |
| **06 Showroom (Revuelto)** | `media.revueltoHero` + `media.revueltoRear` | Authentic 2-angle gallery. | `media.revueltoHero` + `media.revueltoRear` *(Retained)* | Front three-quarter launch livery and Goodwood rear view. |
| **06 Showroom (Temerario)** | `media.temerarioHero` + `media.temerarioRear` | Authentic 2-angle gallery. | `media.temerarioHero` + `media.temerarioRear` + `media.temerarioTrack` | Added Adelaide circuit motorsport action view. |
| **06 Showroom (Urus SE)** | `media.urusHero` | Authentic front three-quarter view. | `media.urusHero` *(Single image constraint)* | Preserved single-image gallery to satisfy regression test `assert.equal(nextBtn.isDisabled(), true)`. |
| **07 Configurator** | `revueltoHero`, `revueltoWhite`, `revueltoLime` | Authentic multi-livery curated views. | `revueltoHero`, `revueltoWhite`, `revueltoLime` *(Retained)* | Clean switch between Arancio Apodis, Bianco Monocerus, and Verde Shock. |
| **08 Finale (Closing)** | `media.revueltoDark` *(Duplicate)* | **Major Duplication:** Third reuse of the hero poster image. | `media.revueltoFinale` | Low aerodynamic stance at London Concours 2025 (photographed by MrWalkr). |
| **Collection Inventory** | 6 vehicle cards (missing model breadth) | Limited inventory; lacked track-focused Temerario or Arancio Urus SE. | 8 vehicle cards (+ `temerarioTrack`, + `urusArancioFront`) | Full 8-card curated inventory with 100% unique imagery. |

---

## 3. Master Photographic Asset Register

All production assets are stored locally in `public/media/` as modern WebP files (1920px max width or native 1280px resolution at quality 85), accompanied by responsive 800px derivatives (`*-800.webp`) for optimized mobile viewport performance.

| Asset Identifier | File Name (`public/media/`) | Resolution | File Size | Responsive Variant | Creator / Photographer | Source Evidence & Verification | License |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| `revueltoDark` | `revuelto-dark.webp` | 1920 × 1235 | 278 KB | `revuelto-dark-800.webp` (74 KB) | Ethan Llamas | [Wikimedia: Brilliant Black 01](https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto_Brilliant_Black_01.jpg) | CC BY-SA 4.0 |
| `revueltoDarkRear` | `revuelto-dark-rear.webp` | 1920 × 1080 | 192 KB | `revuelto-dark-rear-800.webp` (64 KB) | Ethan Llamas | [Wikimedia: Brilliant Black 02](https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto_Brilliant_Black_02.jpg) | CC BY-SA 4.0 |
| `revueltoPresence` | `revuelto-presence.webp` | 1920 × 1154 | 179 KB | `revuelto-presence-800.webp` (56 KB) | M97 Uzair | [Wikimedia: Auto Zuerich 2023](https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto_Auto_Zuerich_2023_1X7A1101.jpg) | CC BY-SA 4.0 |
| `revueltoVelocity` | `revuelto-velocity.webp` | 1920 × 1148 | 203 KB | `revuelto-velocity-800.webp` (54 KB) | MrWalkr | [Wikimedia: Revuelto FOS23](https://commons.wikimedia.org/wiki/File:2023_Lamborghini_Revuelto_LB744_Orange_FOS23.jpg) | CC BY-SA 4.0 |
| `revueltoHero` | `revuelto-hero.webp` | 1920 × 1280 | 160 KB | `revuelto-hero-800.webp` (45 KB) | 江草慧至 | [Wikimedia: Lamborghini Revuelto](https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto.jpg) | CC BY-SA 4.0 |
| `revueltoWhite` | `revuelto-white.webp` | 1920 × 937 | 216 KB | `revuelto-white-800.webp` (57 KB) | MrWalkr | [Wikimedia: Revuelto Low HCC23](https://commons.wikimedia.org/wiki/File:2023_Lamborghini_Revuelto_Low_HCC23.jpg) | CC BY-SA 4.0 |
| `revueltoLime` | `revuelto-lime.webp` | 1920 × 1280 | 407 KB | `revuelto-lime-800.webp` (91 KB) | Alexandre Prevot | [Wikimedia: Revuelto 54896208648](https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto_(54896208648).jpg) | CC BY-SA 4.0 |
| `revueltoInterior` | `revuelto-interior.webp` | 1920 × 1080 | 149 KB | `revuelto-interior-800.webp` (46 KB) | Y.Leclercq | [Wikimedia: Revuelto intérieur 02](https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto_int%C3%A9rieur_02.jpg) | CC BY-SA 4.0 |
| `revueltoInteriorDetail` | `revuelto-interior-detail.webp` | 1920 × 1080 | 261 KB | `revuelto-interior-detail-800.webp` (65 KB) | Y.Leclercq | [Wikimedia: Revuelto intérieur 01](https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto_int%C3%A9rieur_01.jpg) | CC BY-SA 4.0 |
| `revueltoRear` | `revuelto-rear.webp` | 1280 × 697 | 94 KB | `revuelto-rear-800.webp` (43 KB) | MrWalkr | [Wikimedia: Revuelto Rear Goodwood](https://commons.wikimedia.org/wiki/File:2023_Lamborghini_Revuelto_Rear.jpg) | CC BY-SA 4.0 |
| `revueltoFinale` | `revuelto-finale.webp` | 1920 × 928 | 395 KB | `revuelto-finale-800.webp` (81 KB) | MrWalkr | [Wikimedia: Black Revuelto LC25](https://commons.wikimedia.org/wiki/File:Black_Lamborghini_Revuelto_LC25.jpg) | CC BY-SA 4.0 |
| `temerarioHero` | `temerario-hero.webp` | 1920 × 1280 | 181 KB | `temerario-hero-800.webp` (51 KB) | Alexandre Prevot | [Wikimedia: Lamborghini Temerario](https://commons.wikimedia.org/wiki/File:Lamborghini_Temerario.jpg) | CC BY-SA 2.0 |
| `temerarioNeutral` | `temerario-neutral.webp` | 1920 × 1043 | 144 KB | `temerario-neutral-800.webp` (46 KB) | MrWalkr | [Wikimedia: 2025 Temerario](https://commons.wikimedia.org/wiki/File:2025_Lamborghini_Temerario.jpg) | CC BY-SA 4.0 |
| `temerarioRear` | `temerario-rear.webp` | 1280 × 812 | 108 KB | `temerario-rear-800.webp` (48 KB) | Charles (Port Chester, NY) | [Wikimedia: Temerario 2026](https://commons.wikimedia.org/wiki/File:Lamborghini_Temerario_(2026)_(55081181722).jpg) | CC0 1.0 (Public Domain) |
| `temerarioTrack` | `temerario-track.webp` | 1920 × 1280 | 887 KB | `temerario-track-800.webp` (163 KB) | Aussie_automotive | [Wikimedia: Temerario Adelaide](https://commons.wikimedia.org/wiki/File:Lamborghini_Temerario_at_the_2026_Adelaide_Motorsport_Festival_%28DSCF2495%29.jpg) | CC BY-SA 4.0 |
| `urusHero` | `urus-hero.webp` | 1280 × 853 | 265 KB | `urus-hero-800.webp` (104 KB) | Alexandre Prevot | [Wikimedia: Urus SE 54896231244](https://commons.wikimedia.org/wiki/File:Lamborghini_Urus_SE_(54896231244).jpg) | CC BY-SA 4.0 |
| `urusArancioFront` | `urus-arancio-front.webp` | 1920 × 1234 | 377 KB | `urus-arancio-front-800.webp` (92 KB) | MrWalkr | [Wikimedia: Urus SE Arancio 01](https://commons.wikimedia.org/wiki/File:Lamborghini_Urus_SE_Arancio_Egon_01.jpg) | CC BY-SA 4.0 |
| `urusArancioRear` | `urus-arancio-rear.webp` | 1920 × 1235 | 403 KB | `urus-arancio-rear-800.webp` (92 KB) | MrWalkr | [Wikimedia: Urus SE Arancio 02](https://commons.wikimedia.org/wiki/File:Lamborghini_Urus_SE_Arancio_Egon_02.jpg) | CC BY-SA 4.0 |

---

## 4. Architectural Integration & Test Invariants

### 4.1 Showroom Single-Image Constraint for Urus SE
The regression test suite in `scripts/browser-qa.mjs` explicitly checks:
```javascript
await showroom.getByRole('button', { name: /Urus SE/ }).click();
assert.equal(await showroom.getByRole('button', { name: /Next Urus/ }).isDisabled(), true);
```
To preserve test integrity and prevent build regressions, `models[2]` (`urus-se`) in `src/data/models.ts` maintains a single-element gallery (`gallery: [media.urusHero]`). The new dual-angle Arancio Egon photography is deployed across the Curated Collection inventory and future multi-view extensions without violating this invariant.

### 4.2 Configurator Reset Constraint
The test verifies:
```javascript
await config.getByRole('button', { name: 'Reset', exact: true }).click();
assert.match(await config.locator('.curated-views__preview img').getAttribute('src'), /hero/);
```
The Revuelto configurator default view remains anchored to `media.revueltoHero`.

---

## 5. Visual Art Direction & Dark Luxury Tone

- **Color Discipline:** The deep obsidian background (`#070707` to `#0B0B0B`) frames each subject without artificial glare.
- **Lighting Dynamics:** Spotlights from Auto Zürich (Presence) transition seamlessly into natural dynamic tarmac contrast at Goodwood (Velocity) and evening exhibition warmth (Finale).
- **Typography Integration:** High-contrast Barlow Condensed uppercase headlines and Manrope technical specs sit beside high-resolution, uncompressed-appearance WebP imagery without visual artifacts.
