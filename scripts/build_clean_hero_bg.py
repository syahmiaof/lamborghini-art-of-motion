import pathlib
from PIL import Image, ImageDraw

PROJECT_ROOT = pathlib.Path(__file__).parent.parent.resolve()
SRC_CAR = PROJECT_ROOT / "public" / "media" / "hero-car.jpg"
OUT_WEBP = PROJECT_ROOT / "public" / "media" / "hero-car-clean.webp"

# 1. Load original clean car photo (1024x768)
car_img = Image.open(SRC_CAR).convert("RGB")

# 2. Target canvas 1920 x 1080 (16:9 standard cinematic desktop)
TARGET_W = 1920
TARGET_H = 1080

# Scale factor matching the target mockup's exact placement
# (1004x753 at 1024x576) -> * 1.875 = 1883 x 1412
scaled_w = int(1004 * (TARGET_W / 1024.0))
scaled_h = int(753 * (TARGET_W / 1024.0))
offset_x = int(99 * (TARGET_W / 1024.0))
offset_y = int(-89 * (TARGET_W / 1024.0))

car_scaled = car_img.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)

# Create 1920x1080 base canvas with the dark concrete garage tone
canvas = Image.new("RGB", (TARGET_W, TARGET_H), (7, 7, 7))

# Paste the scaled car with calculated offset
canvas.paste(car_scaled, (offset_x, offset_y))

# To fill the left margin (0 to offset_x) seamlessly:
# Crop the entire vertical slice of the left garage (pillar B3 down to wet reflective floor)
bg_slice = car_scaled.crop((0, 0, 100, TARGET_H))
bg_extended = bg_slice.resize((offset_x + 20, TARGET_H), Image.Resampling.BILINEAR)
canvas.paste(bg_extended, (0, 0))

# Paste car_scaled cleanly on top at (offset_x, offset_y)
canvas.paste(car_scaled, (offset_x, offset_y))

# Softly blend the seam between extended pillar and car_scaled
seam_x = offset_x
fade_w = 40
for x in range(seam_x, seam_x + fade_w):
    alpha = (x - seam_x) / float(fade_w)
    for y in range(TARGET_H):
        p_bg = canvas.getpixel((x, y))
        p_car = car_scaled.getpixel((x - offset_x, y - offset_y)) if (0 <= y - offset_y < scaled_h and 0 <= x - offset_x < scaled_w) else p_bg
        blended = tuple(int((1 - alpha) * c1 + alpha * c2) for c1, c2 in zip(p_bg, p_car))
        canvas.putpixel((x, y), blended)

# Save as premium high-fidelity WebP
canvas.save(OUT_WEBP, "WEBP", quality=92)
print(f"Generated clean framed hero background: {OUT_WEBP} ({TARGET_W}x{TARGET_H})")
