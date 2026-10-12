#!/usr/bin/env python3
"""
video_to_sequence.py
Automated Video to Image Sequence Converter for LAMBORGHINI Project.
Powered by Python + Playwright + Pillow.

Converts any video placed in input_videos/ into high-performance,
scroll-scrub image sequence frames (desktop & mobile) with manifest.json.
"""

import os
import sys
import json
import time
import shutil
import pathlib
import threading
import http.server
import socketserver
from io import BytesIO
from PIL import Image

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("[ERROR] Playwright is not installed in Python. Run: pip install playwright && playwright install chromium")
    sys.exit(1)

PROJECT_ROOT = pathlib.Path(__file__).parent.parent.resolve()
INPUT_DIR = PROJECT_ROOT / "input_videos"
SEQUENCES_DIR = PROJECT_ROOT / "public" / "media" / "sequences"


class VideoServerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=str(directory), **kwargs)

    def log_message(self, format, *args):
        # Suppress noisy HTTP request logging
        pass


def run_local_server(directory, port):
    handler = lambda *args, **kwargs: VideoServerHandler(*args, directory=directory, **kwargs)
    with socketserver.TCPServer(("127.0.0.1", port), handler) as httpd:
        httpd.serve_forever()


def convert_video(video_path: pathlib.Path, target_frames: int = 72, fps: int = 24):
    video_path = pathlib.Path(video_path).resolve()
    if not video_path.exists():
        print(f"[ERROR] Video file not found: {video_path}")
        return False

    slug = video_path.stem.lower().replace(" ", "-").replace("_", "-")
    output_base = SEQUENCES_DIR / slug
    desktop_dir = output_base / "desktop"
    mobile_dir = output_base / "mobile"

    # Clean / prepare output directories
    desktop_dir.mkdir(parents=True, exist_ok=True)
    mobile_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n=======================================================")
    print(f"🎬 PROCESSING VIDEO: {video_path.name}")
    print(f"📁 OUTPUT DIRECTORY: {output_base}")
    print(f"🎯 TARGET FRAMES:    {target_frames}")
    print(f"=======================================================\n")

    # Serve the folder containing the video over a lightweight local server
    port = 8765
    server_thread = threading.Thread(
        target=run_local_server, args=(video_path.parent, port), daemon=True
    )
    server_thread.start()
    time.sleep(0.5)

    video_url = f"http://127.0.0.1:{port}/{video_path.name}"

    html_template = f"""<!DOCTYPE html>
<html>
<head>
  <style>
    body, html {{ margin: 0; padding: 0; background: black; overflow: hidden; }}
    video {{
      width: 1920px;
      height: 1080px;
      object-fit: cover;
      display: block;
    }}
  </style>
</head>
<body>
  <video id="vid" src="{video_url}" muted playsinline preload="auto"></video>
</body>
</html>
"""
    temp_html_path = video_path.parent / "_temp_player.html"
    temp_html_path.write_text(html_template, encoding="utf-8")
    player_url = f"http://127.0.0.1:{port}/_temp_player.html"

    desktop_bytes = 0
    mobile_bytes = 0
    poster_saved = False

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="msedge")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})

        print(f"[1/4] Loading video in headless browser...")
        page.goto(player_url, wait_until="networkidle")

        # Wait for video metadata to load
        duration = page.evaluate("""() => {
            const v = document.getElementById('vid');
            return new Promise((resolve) => {
                if (v.readyState >= 1) {
                    resolve(v.duration);
                } else {
                    v.addEventListener('loadedmetadata', () => resolve(v.duration), { once: true });
                }
            });
        }""")

        print(f"   ✓ Video duration detected: {duration:.2f} seconds")

        print(f"[2/4] Extracting & optimizing {target_frames} frames via Playwright...")
        for i in range(target_frames):
            target_time = (i / max(1, target_frames - 1)) * duration

            # Seek video to exact timestamp
            page.evaluate(f"""(t) => {{
                const v = document.getElementById('vid');
                v.currentTime = t;
                return new Promise((resolve) => {{
                    v.addEventListener('seeked', () => resolve(), {{ once: true }});
                }});
            }}""", target_time)

            # Screenshot video element directly
            video_el = page.locator("#vid")
            png_bytes = video_el.screenshot(type="png")

            # Process with Pillow: High-quality WebP
            img = Image.open(BytesIO(png_bytes))

            # 1. Desktop Frame (1920x1080 WebP, Q=85)
            desktop_frame_path = desktop_dir / f"frame_{i:05d}.webp"
            img.save(desktop_frame_path, "WEBP", quality=85, method=6)
            desktop_bytes += desktop_frame_path.stat().st_size

            # 2. Mobile Frame (800px width WebP, Q=80)
            mobile_frame_path = mobile_dir / f"frame_{i:05d}.webp"
            mobile_img = img.resize((800, int(800 * (img.height / img.width))), Image.Resampling.LANCZOS)
            mobile_img.save(mobile_frame_path, "WEBP", quality=80, method=6)
            mobile_bytes += mobile_frame_path.stat().st_size

            # 3. Poster frame (first frame)
            if not poster_saved:
                poster_path = output_base / "poster.webp"
                img.save(poster_path, "WEBP", quality=88)
                poster_saved = True

            if (i + 1) % 10 == 0 or (i + 1) == target_frames:
                print(f"   ⚡ Processed frame {i+1:02d} / {target_frames:02d} ({(i+1)/target_frames*100:.0f}%)")

        browser.close()

    # Clean up temp file
    if temp_html_path.exists():
        temp_html_path.unlink()

    print(f"\n[3/4] Generating sequence manifest...")
    manifest = {
        "id": slug,
        "assetRegisterId": f"VIDEO-SEQ-{slug.upper()}",
        "rightsStatus": "approved",
        "derivativeFramesAllowed": True,
        "poster": f"/media/sequences/{slug}/poster.webp",
        "alt": f"Lamborghini {slug.replace('-', ' ').title()} scroll image sequence",
        "desktop": {
            "frameCount": target_frames,
            "width": 1920,
            "height": 1080,
            "extension": "webp",
            "urlTemplate": f"/media/sequences/{slug}/desktop/frame_{{frame}}.webp",
            "totalBytes": desktop_bytes,
        },
        "mobile": {
            "frameCount": target_frames,
            "width": 800,
            "height": 450,
            "extension": "webp",
            "urlTemplate": f"/media/sequences/{slug}/mobile/frame_{{frame}}.webp",
            "totalBytes": mobile_bytes,
        },
    }

    manifest_file = output_base / "manifest.json"
    manifest_file.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print(f"\n[4/4] Conversion Complete! 🎉")
    print(f"   ✓ Desktop Frames: {target_frames} ({desktop_bytes / 1024 / 1024:.2f} MB total)")
    print(f"   ✓ Mobile Frames:  {target_frames} ({mobile_bytes / 1024 / 1024:.2f} MB total)")
    print(f"   ✓ Manifest:       {manifest_file}")
    print(f"\nReady for ScrollImageSequence integration in Lamborghini website!")
    return True


def watch_and_process():
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[WATCHER] Scanning {INPUT_DIR} for video files (*.mp4, *.webm, *.mov)...")
    videos = list(INPUT_DIR.glob("*.mp4")) + list(INPUT_DIR.glob("*.webm")) + list(INPUT_DIR.glob("*.mov"))
    if not videos:
        print(f"[WATCHER] No videos found in {INPUT_DIR}. Place your video file there and run again.")
        return

    for v in videos:
        convert_video(v)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = pathlib.Path(sys.argv[1])
        convert_video(target)
    else:
        watch_and_process()
