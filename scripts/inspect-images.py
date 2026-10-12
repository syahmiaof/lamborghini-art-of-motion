import urllib.request
import urllib.parse
import json
import sys

titles = [
    'File:2023 Lamborghini Revuelto LB744 Orange FOS23.jpg',
    'File:2023 Lamborghini Revuelto White FOS23.jpg',
    'File:Lamborghini Revuelto (2024) (53620872937).jpg',
    'File:Lamborghini Revuelto (2024) (53621749676).jpg',
    'File:Lamborghini Revuelto (2024) (53621749716).jpg',
    'File:Lamborghini Revuelto (2024) (53621960033).jpg',
    'File:Lamborghini Revuelto (2024) (53621960073).jpg',
    'File:2024 Lamborghini Revuelto 2.jpg',
    'File:2024 Lamborghini Revuelto 4.jpg',
    'File:2024 Lamborghini Revuelto 20.jpg',
    'File:2024 Lamborghini Revuelto 24.jpg',
    'File:Lamborghini Temerario at the 2026 Adelaide Motorsport Festival (DSCF2495).jpg',
    'File:Lamborghini Temerario 2025 2.jpg',
    'File:Lamborghini Temerario 2025 5.jpg',
    'File:Lamborghini Urus SE Arancio Egon 01.jpg',
    'File:Lamborghini Urus SE Arancio Egon 02.jpg',
    'File:Lamborghini Urus SE (2025) (54873551889).jpg',
    'File:Lamborghini Urus SE 2025 2.jpg'
]

encoded_titles = '|'.join(urllib.parse.quote(t) for t in titles)
url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={encoded_titles}&prop=imageinfo&iiprop=url|size|extmetadata"
req = urllib.request.Request(url, headers={'User-Agent': 'LamborghiniArtOfMotionBot/1.0'})

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    pages = data.get('query', {}).get('pages', {})
    for pid, p in pages.items():
        title = p.get('title', '')
        ii = p.get('imageinfo', [{}])[0]
        meta = ii.get('extmetadata', {})
        cats = meta.get('Categories', {}).get('value', '')
        desc = meta.get('ImageDescription', {}).get('value', '')[:140]
        artist = meta.get('Artist', {}).get('value', '')[:35]
        lic = meta.get('LicenseShortName', {}).get('value', '')
        w = ii.get('width', 0)
        h = ii.get('height', 0)
        u = ii.get('url', '')
        print(f"TITLE: {title} [{w}x{h}] ({lic})")
        print(f"  Artist: {artist}")
        print(f"  Desc: {desc}")
        print(f"  URL: {u}\n")
