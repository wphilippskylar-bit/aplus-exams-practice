#!/usr/bin/env python3
"""Builds the deployable GitHub Pages folder (dist/) and a zip for upload."""
import json, os, shutil, zipfile, hashlib
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC, DIST = os.path.join(ROOT, 'src'), os.path.join(ROOT, 'dist')
APP = {'name': 'A+ Range', 'short': 'A+ Range', 'id': 'aplus', 'glyph': 'A+', 'color': '#f5b942', 'bg': '#0a0e13',
       'desc': 'CompTIA A+ Core 1 (220-1201) and Core 2 (220-1202) from zero to confident IT tech: locked learning path, flashcards, explained questions and hands-on labs.'}
JS = ['ac0.js', 'a1.js', 'a2.js', 'a3.js', 'a4.js', 'a5.js', 'b1.js', 'b2.js', 'b3.js', 'b4.js', 'alab.js', 'labpbq.js', 'course-wire.js', 'app.js']

def read(n): return open(os.path.join(SRC, n), encoding='utf-8').read()

def icons(out):
    os.makedirs(out, exist_ok=True)
    def draw(size, pad=0.0):
        im = Image.new('RGB', (size, size), APP['bg']); d = ImageDraw.Draw(im)
        s = size; inset = int(s * pad)
        c = tuple(int(APP['color'][i:i + 2], 16) for i in (1, 3, 5))
        # rounded panel
        d.rounded_rectangle([inset, inset, s - inset, s - inset], radius=int(s * .18), fill='#101823', outline=c, width=max(2, s // 64))
        # three nodes + links
        pts = [(s * .30, s * .34), (s * .70, s * .34), (s * .50, s * .70)]
        for a in range(3):
            for b in range(a + 1, 3):
                d.line([pts[a], pts[b]], fill=c, width=max(2, s // 40))
        r = s * .075
        for p in pts:
            d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill='#0a0e13', outline=c, width=max(2, s // 48))
        try:
            f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(s * .16))
            d.text((s * .5, s * .52), APP['glyph'], font=f, fill='#ffffff', anchor='mm')
        except Exception:
            pass
        return im
    draw(192).save(os.path.join(out, 'icon-192.png'))
    draw(512).save(os.path.join(out, 'icon-512.png'))
    draw(512, .1).save(os.path.join(out, 'icon-maskable-512.png'))
    draw(180).save(os.path.join(out, 'apple-touch-icon.png'))

def main():
    if os.path.exists(DIST): shutil.rmtree(DIST)
    os.makedirs(DIST)
    css = read('style.css')
    js = '\n;\n'.join(read(n) for n in JS)
    js = js.replace('</script', '<\\/script').replace('<!--', '<\\!--')
    ver = hashlib.sha1((css + js).encode()).hexdigest()[:10]
    html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="{APP['bg']}">
<meta name="description" content="{APP['desc']}">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="{APP['short']}">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" href="icons/icon-192.png">
<title>{APP['name']}</title>
<style>
{css}
</style>
</head>
<body>
<noscript>This study app needs JavaScript enabled.</noscript>
<script>
/* build {ver} */
{js}
</script>
</body>
</html>
'''
    open(os.path.join(DIST, 'index.html'), 'w', encoding='utf-8').write(html)
    manifest = {'name': APP['name'], 'short_name': APP['short'], 'description': APP['desc'], 'start_url': './', 'scope': './',
                'display': 'standalone', 'orientation': 'any', 'background_color': APP['bg'], 'theme_color': APP['bg'],
                'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
                          {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
                          {'src': 'icons/icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}]}
    json.dump(manifest, open(os.path.join(DIST, 'manifest.json'), 'w'), indent=2)
    sw = read('sw.js').replace('__VERSION__', APP['id'] + '-' + ver)
    open(os.path.join(DIST, 'sw.js'), 'w').write(sw)
    icons(os.path.join(DIST, 'icons'))
    shutil.copy(os.path.join(ROOT, 'README.md'), os.path.join(DIST, 'README.md'))
    open(os.path.join(DIST, '.nojekyll'), 'w').close()
    z = os.path.join(ROOT, APP['id'] + '-range.zip')
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
        for base, _, files in os.walk(DIST):
            for f in files:
                p = os.path.join(base, f); zf.write(p, os.path.relpath(p, DIST))
    print('built', ver, 'index.html', os.path.getsize(os.path.join(DIST, 'index.html')) // 1024, 'KB ->', z)

if __name__ == '__main__':
    main()
