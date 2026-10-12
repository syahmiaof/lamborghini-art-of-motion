# Native intro asset audit

Verified 13 October 2026. Source: root `Supercar_in_underground_garage_1080p_20261012131710.mp4`, supplied by the user for this independent custom automotive concept. The source and all image-sequence assets were preserved. Source SHA-256 before/after encoding: `9560c16620bcda51b7ff40dc206365de9c68a911f3435dfac50b784eb15d8270`.

## Encodes

| Public URL | Size | Resolution | Encoding |
| --- | ---: | --- | --- |
| `/media/intro/awakening-desktop-v1.mp4` | 4,641,888 bytes | 1920 × 1080 | x264 slow, CRF 23 |
| `/media/intro/awakening-mobile-v1.mp4` | 1,828,472 bytes | 1280 × 720 | x264 slow, CRF 24 |
| `/media/intro/poster.webp` | 77,210 bytes | 1920 × 1080 | First actual source frame, WebP quality 82 |
| `/media/intro/poster-mobile.webp` | 44,556 bytes | 1280 × 720 | First actual source frame, WebP quality 82 |

Both MP4s are H.264 High profile level 4.0, YUV 4:2:0, 24 fps, 240 frames and exactly 10.000 seconds. Both contain one video stream and no audio. The 16:9 aspect ratio and original timing are unchanged. Relative to the 7,347,185-byte original, desktop is 36.8% smaller and mobile 75.1% smaller. Mobile retains 720p detail for full-screen landscape playback while reducing transfer size substantially.

MP4 top-level atom inspection found `ftyp → moov → free → mdat` in both outputs: initialization metadata precedes the video payload. Full FFmpeg video decoding returned exit 0 without decode errors for each output. Machine-readable measurements are in `public/media/intro/asset-audit.json`.

## Visual verification

Source and both encodes were sampled at actual frames 0, 120 and 239, then viewed side by side. The car silhouette, gradual lighting reveal, wheels, gold decal and garage composition remain recognizable without obvious major compression artifacts at the inspected contact-sheet scale. The first frame is intentionally dark, not empty. Posters use this true first frame so playback does not jump backward from an unrelated brighter still.

Full-clip FFmpeg SSIM against the source measured **0.987297 desktop** and **0.983337 mobile**; the mobile reference was first Lanczos-scaled to 1280 × 720. This is a fidelity measure for these specific encodes, not a browser FPS, loading-performance score or guarantee of imperceptible differences. Local visual evidence: `C:/Users/USER/AppData/Local/Temp/lamborghini-intro-audit/intro-comparison.jpg`.

## Integration and sequence formats

Use native muted, inline video playback for this timed intro. Select one video variant before loading; do not preload both. Choose the matching poster. Intro playback and the scroll-controlled Canvas scenes must have separate lifecycle/loading ownership. The intro's progress describes `video.currentTime / video.duration`; it must not claim unrelated assets have loaded. Asset checks here do not verify autoplay policy, skip controls, session behavior, transition choreography or browser playback; those require integration QA.

The existing Awakening WebP sequence totals 9,665,384 bytes desktop (121 frames at 1440 × 810) and 3,750,368 bytes mobile (121 frames at 768 × 432), excluding posters. The native intro encodes are smaller despite their higher spatial resolution and full 24 fps timeline; this supports the native-video choice for timed playback. The sequence still serves a different requirement: deterministic random access by scroll position.

No AVIF sequence was generated or benchmarked in this asset task. Existing WebP assets have known dimensions, measured byte totals, verified decoding and working manifests. A switch to AVIF needs a representative same-quality byte/decode benchmark in target browsers, including rapid bidirectional frame changes; nominal compression advantage alone does not establish a scroll-performance improvement. Keep WebP for the repaired sequence until such evidence exists.

## Reproduction

Run `python scripts/encode-intro-v1.py` with FFmpeg/ffprobe available. It encodes only `public/media/intro/*`, creates first-frame posters, verifies stream metadata, full decoding, faststart atom order and unchanged source hash, and writes the audit JSON. No deployment was performed.
