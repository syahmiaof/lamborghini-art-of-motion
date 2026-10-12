import time
import pathlib
from playwright.sync_api import sync_playwright

OUTPUT_DIR = pathlib.Path(".impeccable/review")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    
    # 1. Mockup reference size: 1024 x 576 (16:9)
    page1024 = browser.new_page(viewport={"width": 1024, "height": 576})
    page1024.goto("http://localhost:5174/", wait_until="networkidle")
    time.sleep(3.0) # Wait for GSAP entrance animations to settle
    path1024 = OUTPUT_DIR / "hero-current-1024x576.png"
    page1024.screenshot(path=str(path1024))
    print(f"Captured: {path1024}")
    page1024.close()

    # 2. Desktop standard: 1440 x 900
    page1440 = browser.new_page(viewport={"width": 1440, "height": 900})
    page1440.goto("http://localhost:5174/", wait_until="networkidle")
    time.sleep(3.0)
    path1440 = OUTPUT_DIR / "hero-current-1440x900.png"
    page1440.screenshot(path=str(path1440))
    print(f"Captured: {path1440}")
    page1440.close()

    # 3. Mobile: 390 x 844
    page_mob = browser.new_page(viewport={"width": 390, "height": 844})
    page_mob.goto("http://localhost:5174/", wait_until="networkidle")
    time.sleep(3.0)
    path_mob = OUTPUT_DIR / "hero-current-390x844.png"
    page_mob.screenshot(path=str(path_mob))
    print(f"Captured: {path_mob}")
    page_mob.close()

    browser.close()
