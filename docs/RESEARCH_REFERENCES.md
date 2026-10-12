# Research references

**Source-checked:** 11 October 2026. Repositories/docs and manufacturer text were checked; visual references remain candidates for screenshot-based composition review when keyframes are made. These are references for *patterns and constraints*, not templates to clone. Code licensing and media licensing are separate.

| Category / reference | Why it matters | Borrow for this project | Do not copy directly | Usefulness |
| --- | --- | --- | --- | --- |
| [BSMNT Scrollytelling](https://github.com/basementstudio/scrollytelling) | React + GSAP chapter abstraction; includes image-sequence and Lenis examples | Timeline/waypoint mental model for chapters | Its component API wholesale; our scenes need bespoke geometry | High, architectural comparison |
| [BSMNT Scrollytelling demo](https://scrollytelling.basement.studio/) | A candidate live site for inspecting chapter pacing and handoff | Study how one scroll beat prepares the next in keyframe research | Its art direction or exact timing | Medium visual candidate |
| [Apple AirPods Pro product story](https://www.apple.com/airpods-pro/) | Product-led sequence of hero, feature and evidence moments | Study how each feature gains its own visual moment | Apple layout, device imagery, copy or wholesale page grammar | Medium visual candidate |
| [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Official pin, scrub and refresh behavior | Timeline on parent, animate children, refresh after layout | Every demo effect or excessive nested pins | Critical |
| [@gsap/react](https://github.com/greensock/react) | Official `useGSAP` lifecycle/cleanup | Scoped timelines and context-safe handlers | Page-wide selector animations | Critical |
| [Lenis](https://github.com/darkroomengineering/lenis) | Official smooth-scroll integration and limitations | One ticker sync if native scrolling needs improvement | Always-on smooth scroll as a badge of quality | Conditional |
| [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) | Reflow-aware, accessible line/word reveal | Two or three headline moments with `autoSplit` | Character splitting across all copy | Medium |
| [GSAP imageSequenceScrub](https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub/) | Direct canvas frame-progress reference | Deterministic scroll-to-frame mapping | Eager loading all frames in production | High for prototype |
| [Codrops ScrollTextMotion](https://github.com/codrops/ScrollTextMotion) | Editorial text rhythm research | Study stagger/negative-space relationship | Its exact type treatment and animation timings | Medium |
| [Codrops LineHoverStyles](https://github.com/codrops/LineHoverStyles) | Small CSS-only link interactions | Directional underline for navigation/CTAs | Effect gallery across every link | Medium microinteraction |
| [Codrops RotatingOnScrollAnimations](https://github.com/codrops/RotatingOnScrollAnimations) | Shows photographic depth without a 3D product model | Consider one perspective beat if imagery supports it | Spinning every visual just for novelty | Low/experimental |
| [14islands r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig) | DOM/3D synchronization and image tracking | Understand progressive enhancement if 3D becomes justified | Add WebGL dependency before a real scene/asset need exists | Optional |
| [R3F performance guide](https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance) | On-demand rendering and adaptive quality | Performance criteria for a later 3D experiment | Continuous expensive render loop in v1 | Optional |
| [Lamborghini official model pages](https://www.lamborghini.com/en-en/models) | Manufacturer model/spec source | Source-aware language, names and metrics | Site visual design, photos, logo or implied official UX | Critical for facts |
| [Porsche model configurator](https://models.porsche.com/) | Comparable premium automotive decision UI | Clear separation of model choice and variant details | Purchase-oriented hierarchy or visual identity | Medium UX reference |
| [Vite asset guide](https://vite.dev/guide/assets.html) | Explains import vs `public/` behavior | Hashed imports for regular images; `public/` for stable frame URLs | Put all huge media into initial JS imports | High implementation |
| [web.dev LCP guide](https://web.dev/articles/optimize-lcp) | Hero-loading timing | Discoverable, prioritized hero poster; later imagery lazy | Lazy-load the LCP image | High performance |
| [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) | Accessibility behavior for large visual movement | Equivalent still layouts and content | Hide whole chapters when motion is reduced | Critical |

## Reference synthesis

The strongest reusable pattern is **one controlled timeline per chapter** with explicit DOM ownership and cleanup. The highest visual leverage is approved photography with restrained crop/mask movement. A site assembled from demo effects would feel generic despite sophisticated code. 3D is a later experiment, not the default architecture.

## Research verdict by question

| Question | Phase 1 answer | Evidence |
| --- | --- | --- |
| How should scroll scenes be owned in React? | Local chapter timelines with scoped setup and teardown. | [@gsap/react](https://github.com/greensock/react), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) |
| Is smooth scrolling required? | No. Native scroll is the baseline; Lenis is a measured enhancement. | [Lenis setup and limitations](https://github.com/darkroomengineering/lenis) |
| Do we need a full 3D vehicle? | No for v1. Photography can carry the visual thesis; R3F is a later option. | [R3F scaling guide](https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance), [14islands scroll rig](https://github.com/14islands/r3f-scroll-rig) |
| Can we source official images from model pages? | Their terms do not provide that reuse right. Seek written permission or separately licensed media. | [Lamborghini terms](https://www.lamborghini.com/privacy-legal) |

## Source policy

Prioritize manufacturer pages for model facts; use the library authors' docs/repos for implementation behavior. Inspiration sites inform composition only. Record retrieval dates for product facts and recheck before public release. [Lamborghini's terms](https://www.lamborghini.com/privacy-legal) govern reuse of their site media separately from factual research.
