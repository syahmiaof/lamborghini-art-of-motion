import urllib.request
import urllib.parse
import json

def search_category_details(category, keywords):
    encoded_cat = urllib.parse.quote(category)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle={encoded_cat}&gcmnamespace=6&gcmlimit=100&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1920"
    req = urllib.request.Request(url, headers={'User-Agent': 'LamborghiniArtOfMotionBot/1.0 (https://github.com/portfolio-concept; student@example.org)'})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        results = []
        for pid, p in pages.items():
            title = p.get('title', '')
            ii = p.get('imageinfo', [{}])[0]
            meta = ii.get('extmetadata', {})
            desc = meta.get('ImageDescription', {}).get('value', '').lower()
            artist = meta.get('Artist', {}).get('value', '')
            lic = meta.get('LicenseShortName', {}).get('value', '')
            thumb = ii.get('thumburl', '')
            
            # check keywords
            title_lower = title.lower()
            if any(k.lower() in title_lower or k.lower() in desc for k in keywords):
                results.append({
                    'title': title,
                    'artist': artist,
                    'license': lic,
                    'thumburl': thumb,
                    'width': ii.get('width'),
                    'height': ii.get('height'),
                    'desc': desc[:100]
                })
        return results

if __name__ == '__main__':
    print("=== Revuelto Details/Rear/Interior/Engine ===")
    r_rev = search_category_details('Category:Lamborghini Revuelto', ['rear', 'interior', 'inside', 'engine', 'cockpit', 'detail', 'side', 'fos', 'zuerich', 'concours'])
    for r in r_rev:
        print(f"* {r['title']} [{r['width']}x{r['height']}] ({r['license']}) - {r['thumburl']}")
        
    print("\n=== Temerario Details/Interior/Track ===")
    r_tem = search_category_details('Category:Lamborghini Temerario', ['interior', 'cockpit', 'inside', 'rear', 'track', 'festival', 'detail', 'side'])
    for r in r_tem:
        print(f"* {r['title']} [{r['width']}x{r['height']}] ({r['license']}) - {r['thumburl']}")

    print("\n=== Urus SE Details/Rear/Orange ===")
    r_urus = search_category_details('Category:Lamborghini Urus SE', ['rear', 'orange', 'arancio', 'interior', 'side', 'detail'])
    for r in r_urus:
        print(f"* {r['title']} [{r['width']}x{r['height']}] ({r['license']}) - {r['thumburl']}")
