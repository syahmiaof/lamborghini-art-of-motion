import urllib.request
import urllib.parse
import json
import time
import os
from PIL import Image

ASSETS_TO_ACQUIRE = [
    {
        'key': 'revueltoVelocity',
        'slug': 'revuelto-velocity',
        'title': 'File:2023 Lamborghini Revuelto LB744 Orange FOS23.jpg',
        'local_raw': 'references/candidates/candidate-velocity-goodwood.jpg',
        'model': 'Revuelto',
        'section': 'Chapter 3 — Velocity (#velocity)',
        'alt': 'Lamborghini Revuelto in Arancio Apodis running at speed on the Goodwood Festival of Speed hillclimb tarmac',
        'caption': 'Revuelto — dynamic hillclimb run at Goodwood Festival of Speed',
        'credit': 'MrWalkr',
        'license': 'CC BY-SA 4.0',
        'licenseUrl': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'year': 2023,
    },
    {
        'key': 'revueltoPresence',
        'slug': 'revuelto-presence',
        'title': 'File:Lamborghini Revuelto Auto Zuerich 2023 1X7A1101.jpg',
        'local_raw': 'references/candidates/candidate-presence-zuerich-front.jpg',
        'model': 'Revuelto',
        'section': 'Chapter 2 — Presence (#presence)',
        'alt': 'Lamborghini Revuelto on an illuminated exhibition stage under dramatic spotlights at Auto Zürich',
        'caption': 'Revuelto — dramatic stage reveal at Auto Zürich',
        'credit': 'M97 Uzair',
        'license': 'CC BY-SA 4.0',
        'licenseUrl': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'year': 2023,
    },
    {
        'key': 'revueltoFinale',
        'slug': 'revuelto-finale',
        'title': 'File:Black Lamborghini Revuelto LC25.jpg',
        'local_raw': 'references/candidates/candidate-presence-london-concours.jpg',
        'model': 'Revuelto',
        'section': 'Chapter 8 — Finale & Private Inquiry (#finale)',
        'alt': 'Glossy black Lamborghini Revuelto in low three-quarter stance at London Concours',
        'caption': 'Revuelto — low aerodynamic stance at London Concours',
        'credit': 'MrWalkr',
        'license': 'CC BY-SA 4.0',
        'licenseUrl': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'year': 2025,
    },
    {
        'key': 'revueltoInteriorDetail',
        'slug': 'revuelto-interior-detail',
        'title': 'File:Lamborghini Revuelto int\u00e9rieur 01.jpg',
        'local_raw': None,
        'model': 'Revuelto',
        'section': 'Chapter 5 — Interior Gallery Row 1 (Feel the Tarmac)',
        'alt': 'Lamborghini Revuelto cockpit console, digital interfaces, and steering wheel detail',
        'caption': 'Revuelto — driver cockpit controls and forged carbon monofuselage architecture',
        'credit': 'Y.Leclercq',
        'license': 'CC BY-SA 4.0',
        'licenseUrl': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'year': 2024,
    },
    {
        'key': 'temerarioTrack',
        'slug': 'temerario-track',
        'title': 'File:Lamborghini Temerario at the 2026 Adelaide Motorsport Festival (DSCF2495).jpg',
        'local_raw': None,
        'model': 'Temerario',
        'section': 'Showroom Temerario Gallery & Collection',
        'alt': 'Lamborghini Temerario at the 2026 Adelaide Motorsport Festival circuit',
        'caption': 'Temerario — motorsport dynamic display at Adelaide Festival',
        'credit': 'Aussie_automotive',
        'license': 'CC BY-SA 4.0',
        'licenseUrl': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'year': 2026,
    },
    {
        'key': 'urusArancioRear',
        'slug': 'urus-arancio-rear',
        'title': 'File:Lamborghini Urus SE Arancio Egon 02.jpg',
        'local_raw': None,
        'model': 'Urus SE',
        'section': 'Collection & Quick View Alternative',
        'alt': 'Arancio Egon orange Lamborghini Urus SE Super SUV from the rear three-quarter angle',
        'caption': 'Urus SE — Arancio Egon orange finish, rear diffuser and aerodynamic light signature',
        'credit': 'MrWalkr',
        'license': 'CC BY-SA 4.0',
        'licenseUrl': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'year': 2025,
    },
]

headers = {'User-Agent': 'LamborghiniArtOfMotionBot/1.0 (https://github.com/portfolio-concept; student@example.org)'}

def fetch_thumb_url(title, width=1920):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth={width}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        for pid, p in pages.items():
            ii = p.get('imageinfo', [{}])[0]
            thumb = ii.get('thumburl') or ii.get('url')
            return thumb, ii.get('width'), ii.get('height')
    return None, None, None

os.makedirs('public/media', exist_ok=True)
os.makedirs('references/candidates', exist_ok=True)

results = []

for item in ASSETS_TO_ACQUIRE:
    print(f"\nProcessing {item['key']} ({item['title']})...")
    raw_path = item.get('local_raw')
    if not raw_path or not os.path.exists(raw_path):
        raw_path = f"references/candidates/{item['slug']}-raw.jpg"
        if not os.path.exists(raw_path):
            thumb_url, orig_w, orig_h = fetch_thumb_url(item['title'], 1920)
            if not thumb_url:
                print(f"Error: Could not find thumb URL for {item['title']}")
                continue
            print(f"  Downloading from {thumb_url}...")
            time.sleep(1.5)  # respect rate limit
            req = urllib.request.Request(thumb_url, headers=headers)
            with urllib.request.urlopen(req) as resp:
                with open(raw_path, 'wb') as f:
                    f.write(resp.read())
            print(f"  Saved raw image: {raw_path} ({os.path.getsize(raw_path)} bytes)")
    
    # Process image with Pillow
    im = Image.open(raw_path)
    im = im.convert('RGB')
    orig_w, orig_h = im.size
    print(f"  Raw image dimensions: {orig_w}x{orig_h}")
    
    # Target max width: 1920
    master_w = min(1920, orig_w)
    master_h = int(orig_h * (master_w / orig_w))
    im_master = im.resize((master_w, master_h), Image.Resampling.LANCZOS)
    
    master_path = f"public/media/{item['slug']}.webp"
    im_master.save(master_path, 'WEBP', quality=85)
    master_bytes = os.path.getsize(master_path)
    print(f"  Created master: {master_path} ({master_w}x{master_h}, {master_bytes} bytes)")
    
    # 800px derivative
    small_w = min(800, orig_w)
    small_h = int(orig_h * (small_w / orig_w))
    im_small = im.resize((small_w, small_h), Image.Resampling.LANCZOS)
    
    small_path = f"public/media/{item['slug']}-800.webp"
    im_small.save(small_path, 'WEBP', quality=85)
    small_bytes = os.path.getsize(small_path)
    print(f"  Created 800px: {small_path} ({small_w}x{small_h}, {small_bytes} bytes)")
    
    results.append({
        **item,
        'src': f"/media/{item['slug']}.webp",
        'srcSmall': f"/media/{item['slug']}-800.webp",
        'width': master_w,
        'height': master_h,
        'bytes': master_bytes,
        'bytesSmall': small_bytes,
        'sourceUrl': f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(item['title'].replace(' ', '_'))}",
    })

with open('references/acquired_assets.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("\nDone! Acquired and generated all assets.")
