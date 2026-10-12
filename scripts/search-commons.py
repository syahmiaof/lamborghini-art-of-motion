import urllib.request
import json
import sys

def search_commons(query, limit=15):
    encoded_query = urllib.parse.quote(query)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit={limit}&gsrsearch={encoded_query}&prop=imageinfo&iiprop=url|size|extmetadata"
    req = urllib.request.Request(url, headers={'User-Agent': 'LamborghiniArtOfMotionBot/1.0 (portfolio research)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, page in pages.items():
                title = page.get('title', '')
                ii = page.get('imageinfo', [{}])[0]
                meta = ii.get('extmetadata', {})
                desc = meta.get('ImageDescription', {}).get('value', '')[:100]
                artist = meta.get('Artist', {}).get('value', '')
                license_short = meta.get('LicenseShortName', {}).get('value', '')
                results.append({
                    'title': title,
                    'width': ii.get('width', 0),
                    'height': ii.get('height', 0),
                    'url': ii.get('url', ''),
                    'desc_url': ii.get('descriptionurl', ''),
                    'artist': artist,
                    'license': license_short,
                })
            return results
    except Exception as e:
        print(f"Error searching {query}: {e}")
        return []

def list_category(category_name, limit=50):
    encoded_cat = urllib.parse.quote(category_name)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle={encoded_cat}&gcmnamespace=6&gcmlimit={limit}&prop=imageinfo&iiprop=url|size|extmetadata"
    req = urllib.request.Request(url, headers={'User-Agent': 'LamborghiniArtOfMotionBot/1.0 (portfolio research)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, page in pages.items():
                title = page.get('title', '')
                ii = page.get('imageinfo', [{}])[0]
                meta = ii.get('extmetadata', {})
                artist = meta.get('Artist', {}).get('value', '')
                license_short = meta.get('LicenseShortName', {}).get('value', '')
                results.append({
                    'title': title,
                    'width': ii.get('width', 0),
                    'height': ii.get('height', 0),
                    'url': ii.get('url', ''),
                    'desc_url': ii.get('descriptionurl', ''),
                    'artist': artist,
                    'license': license_short,
                })
            return results
    except Exception as e:
        print(f"Error category {category_name}: {e}")
        return []

if __name__ == '__main__':
    arg = sys.argv[1] if len(sys.argv) > 1 else 'Category:Lamborghini Revuelto'
    if arg.startswith('Category:'):
        results = list_category(arg)
    else:
        results = search_commons(arg)
    print(f"Found {len(results)} items for '{arg}':")
    for r in results:
        print(f"* {r['title']} [{r['width']}x{r['height']}] ({r['license']}) by {r['artist'][:30]}")
        print(f"  URL: {r['url']}")
