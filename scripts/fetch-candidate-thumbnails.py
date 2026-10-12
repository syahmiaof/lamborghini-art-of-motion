import urllib.request
import urllib.parse
import json
import os
from PIL import Image

CANDIDATES = [
    # Velocity candidate (Goodwood hillclimb dynamic run)
    ('File:2023 Lamborghini Revuelto LB744 Orange FOS23.jpg', 'candidate-velocity-goodwood.jpg'),
    # Presence candidates
    ('File:Black Lamborghini Revuelto LC25.jpg', 'candidate-presence-london-concours.jpg'),
    ('File:Lamborghini Revuelto Auto Zuerich 2023 1X7A1101.jpg', 'candidate-presence-zuerich-front.jpg'),
    ('File:Lamborghini Revuelto Auto Zuerich 2023 1X7A1103.jpg', 'candidate-presence-zuerich-side.jpg'),
    # Ad Personam Goodwood candidate
    ('File:Lamborghini Revuelto (53877996613).jpg', 'candidate-revuelto-ad-personam.jpg'),
    # Adelaide Motorsport Festival Temerario track candidate
    ('File:Lamborghini Temerario at the 2026 Adelaide Motorsport Festival (DSCF2495).jpg', 'candidate-temerario-adelaide-track.jpg'),
    # Urus SE candidates
    ('File:Lamborghini Urus SE Arancio Egon 01.jpg', 'candidate-urus-se-orange-front.jpg'),
    ('File:Lamborghini Urus SE Arancio Egon 02.jpg', 'candidate-urus-se-orange-rear.jpg'),
    ('File:Lamborghini Urus SE (2025) (54873551889).jpg', 'candidate-urus-se-white-exterior.jpg'),
    # Temerario candidates
    ('File:Lamborghini Temerario 2025 2.jpg', 'candidate-temerario-2.jpg'),
    ('File:Lamborghini Temerario 2025 5.jpg', 'candidate-temerario-5.jpg'),
    ('File:Lamborghini Temerario Retro Classics 2026 IMG 4738.jpg', 'candidate-temerario-retro.jpg'),
]

os.makedirs('references/candidates', exist_ok=True)

titles_param = '|'.join(urllib.parse.quote(c[0]) for c in CANDIDATES)
url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={titles_param}&prop=imageinfo&iiprop=url|size|extmetadata"
req = urllib.request.Request(url, headers={'User-Agent': 'LamborghiniArtOfMotionBot/1.0'})

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    pages = data.get('query', {}).get('pages', {})
    url_map = {}
    for pid, p in pages.items():
        title = p.get('title')
        ii = p.get('imageinfo', [{}])[0]
        meta = ii.get('extmetadata', {})
        url_map[title] = {
            'url': ii.get('url'),
            'width': ii.get('width'),
            'height': ii.get('height'),
            'artist': meta.get('Artist', {}).get('value', ''),
            'license': meta.get('LicenseShortName', {}).get('value', ''),
            'desc': meta.get('ImageDescription', {}).get('value', ''),
        }

for file_title, out_name in CANDIDATES:
    info = url_map.get(file_title)
    if not info:
        print(f"Not found: {file_title}")
        continue
    out_path = os.path.join('references/candidates', out_name)
    if not os.path.exists(out_path):
        print(f"Downloading {file_title} -> {out_name}...")
        img_url = info['url']
        # download image
        req_img = urllib.request.Request(img_url, headers={'User-Agent': 'LamborghiniArtOfMotionBot/1.0'})
        try:
            with urllib.request.urlopen(req_img) as img_resp:
                with open(out_path, 'wb') as f:
                    f.write(img_resp.read())
            print(f"Saved {out_name} ({os.path.getsize(out_path)} bytes)")
        except Exception as e:
            print(f"Failed {file_title}: {e}")
    else:
        print(f"Already exists: {out_name}")

print("\nCandidate Summary:")
for file_title, out_name in CANDIDATES:
    out_path = os.path.join('references/candidates', out_name)
    if os.path.exists(out_path):
        im = Image.open(out_path)
        info = url_map.get(file_title, {})
        print(f"{out_name}: {im.size} {im.format} | Lic: {info.get('license')} | Artist: {info.get('artist')[:30]}")
