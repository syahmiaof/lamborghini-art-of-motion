# Sequence source audit and extraction

Recovery audit: 12 October 2026. Scope: the three user-provided generated concept clips, asset extraction and manifest accuracy. Source MP4s and existing `awakening-v1`/`presence-v1` folders were preserved. The workspace has no Git repository, so no Git history was available for attribution of previous changes.

## Source verification

All three root MP4s are **H.264, 1920 × 1080, 16:9, 24 fps, 240 frames, 10.000 seconds**. `ffmpeg -v error -i SOURCE -map 0:v:0 -f null -` completed with exit 0 and no reported decode errors for each. SHA-256 hashes were compared before and after extraction; source files were unchanged. Per-source hashes, metadata and selected frame indices are recorded in each v2 folder's `source-audit.json`.

| Scene / export | Exact source file | First / middle / final visual inspection |
| --- | --- | --- |
| Awakening / `awakeningManifest` | `Supercar_in_underground_garage_1080p_20261012131710.mp4` | First: intentional dark garage and visible car silhouette. Middle: headlights/environment reveal black-and-gold body. Final: closer three-quarter view with gold side decal. |
| Golden Reveal / `presenceManifest` | `Supercar_filming_in_parking_garage_20261012133608.mp4` | Front three-quarter opening tracks toward a broad side profile; the side decal and wheels stay central. |
| Cockpit / `cockpitManifest` | `Supercar_interior_video_creation_1080p_20261012133612.mp4` | Starts at open-door cockpit, then pushes inward; steering wheel moves toward the left of the composition while centre-console details become larger. |

First/middle/final source frames **0 / 120 / 239** were extracted and visually inspected for each clip. Garage lighting differs intentionally between the first and later Awakening samples. No black/empty source frame or abrupt scene cut appears in those samples. This sampled inspection is not a claim that generated geometry is physically accurate or that every intermediate source frame is free of generative artifacts. These are custom concept scenes, not documentary Revuelto footage or evidence of production-car specifications.

Contact sheets are in the local temporary QA folder `C:/Users/USER/AppData/Local/Temp/lamborghini-sequence-audit/`: `awakening-contact.jpg`, `presence-contact.jpg`, `cockpit-contact.jpg`. They are not runtime assets.

## Existing asset findings

The active v1 manifest had only two desktop variants: Awakening 60 frames and Presence 48 frames at 1440 × 810. The listed files existed, and their final frames visually matched their intended source clips. There was no cockpit manifest or responsive mobile variant. This audit does not label those existing images corrupted. Existing extraction tooling used an FPS filter and did not explicitly guarantee the literal final source frame.

## Reconstructed assets

Every v2 variant contains **121 WebP frames**, named `frame_0001.webp` through `frame_0121.webp`. Selected source frame indices are `0, 2, 4, …, 238, 239`: 12 fps sampling across the clip plus the exact last frame. This doubles or more than doubles the old samples while keeping the source's first and final real frames. The slow camera movement makes this a reasonable starting density; smoothness must be judged in the rendered scroll experience, not inferred from extraction alone.

| Folder | Desktop: 1440 × 810 | Mobile: 768 × 432 | Poster |
| --- | ---: | ---: | --- |
| `awakening-v2` | 9,665,384 bytes | 3,750,368 bytes | Exact copy of desktop frame 0001 |
| `presence-v2` | 9,796,378 bytes | 3,882,604 bytes | Exact copy of desktop frame 0001 |
| `cockpit-v2` | 7,042,920 bytes | 2,800,422 bytes | Exact copy of desktop frame 0001 |

Desktop frame payload totals 26,504,682 bytes; mobile totals 10,433,394 bytes, excluding posters and manifests. These are complete journey payloads, not initial-page transfer measurements. The runtime must load a bounded nearby frame window and initialize later scenes near the viewport. A decoded desktop image is approximately 4.67 MB RGBA; mobile approximately 1.33 MB, before browser overhead. Holding all 121 desktop decoded frames would be roughly 565 MB per scene and is explicitly inappropriate.

The initial Awakening poster is intentionally dark because the actual shot starts in darkness. It contains a visible vehicle and garage, and is not a loading failure. Do not use an unrelated brighter frame as its first state. Landscape `contain` framing on narrow screens preserves the full exterior and decal; aggressive portrait `cover` cropping would lose the car's ends. Cockpit framing should retain the steering wheel and centre console, especially at the final close-up.

## Reproduction and contract

Run `python scripts/extract-sequences-v2.py` with FFmpeg, ffprobe and Pillow available. It reads the original MP4s, validates the audited source structure and full decode, writes only the v2 derivatives/manifests and `src/data/sequences.ts`, checks every exported frame's dimensions/decoding, and confirms source hashes remain unchanged. WebP qualities are 77 desktop / 75 mobile; Lanczos proportional downscaling preserves 16:9 without stretching or content alteration.

Each `SequenceVariant` sets `startIndex: 1` and `padLength: 4`; frame lookup remains zero-based in memory. Public JSON and typed TypeScript manifests agree. The explicit final frame index is 120 in memory, corresponding to file 0121 and original source frame 239. `rightsStatus: approved` reflects the user's supplied-asset authorization for this project; it does not claim a stock-photo or Creative Commons license for generated clips.

Asset checks passed: three complete source decodes, 726 exported WebP frame decodes and dimensions, three posters byte-identical to initial frames, contiguous names, exact manifest byte totals, and unchanged source hashes. Browser rendering, scroll mapping, overlays and performance tests are reported separately by the integration QA.
