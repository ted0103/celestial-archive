#!/usr/bin/env python3
"""Refresh local release hashes and the service worker after UI edits."""
import hashlib
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1] / 'app'
# A waiting older worker must not serve old code to a newly fetched page.
html_path = root / 'index.html'
def version_asset(match):
    attribute, url = match.groups()
    path = root / url.split('?')[0]
    digest = hashlib.sha256(path.read_bytes()).hexdigest()[:16]
    return f'{attribute}="{url.split("?")[0]}?v={digest}"'
html_path.write_text(re.sub(r'(href|src)="([^"<>]+\.(?:css|js)(?:\?[^"<>]*)?)"', version_asset, html_path.read_text()))
manifest = json.loads((root / 'asset-manifest.json').read_text())
files = {item['url']: item for item in manifest['files']}
files['./gallery.css'] = {'url': './gallery.css', 'mime': 'text/css; charset=utf-8', 'pack': 'core'}
files['./assets/fonts/manrope-variable.ttf'] = {'url':'./assets/fonts/manrope-variable.ttf','mime':'font/ttf','pack':'core'}
for font in ['archive-display.woff2','archive-song.woff2']:
    files['./assets/fonts/'+font]={'url':'./assets/fonts/'+font,'mime':'font/woff2','pack':'core'}
for name in ['ai-contract.js','ai-config.js']:
    files['./'+name]={'url':'./'+name,'mime':'text/javascript; charset=utf-8','pack':'core'}
for url, item in files.items():
    path = (root / url).resolve()
    assert path.is_relative_to(root.resolve()), 'Asset path escapes app directory'
    content = path.read_bytes()
    item.update(bytes=len(content), sha256=hashlib.sha256(content).hexdigest())
manifest['files'] = sorted(files.values(), key=lambda item: item['url'])
release = hashlib.sha256(json.dumps(manifest['files'], sort_keys=True).encode()).hexdigest()[:16]
manifest['releaseId'] = release
manifest['generatedAt'] = '2026-10-24T00:00:00Z'
manifest['totals'] = {pack+'Bytes': sum(item['bytes'] for item in files.values() if item['pack'] == pack) for pack in ('core', 'gesture')}
(root / 'asset-manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
html = (root / 'index.html').read_text()
shell = ['./', './index.html', *re.findall(r'(?:href|src)="([^"<>]+\.(?:css|js)(?:\?[^"<>]*)?)"', html), './manifest.webmanifest']
worker = (root / 'sw.js').read_text()
worker = re.sub(r'const RELEASE_ID="[^"]+";', 'const RELEASE_ID='+json.dumps(release)+';', worker)
worker = re.sub(r'const SHELL=\[[^\n]+;', 'const SHELL='+json.dumps([x if x.startswith('./') else './'+x for x in shell])+';', worker)
packs = {pack:[x['url'] for x in files.values() if x['pack']==pack] for pack in ('core','gesture')}
worker = re.sub(r'const PACKS=\{[^\n]+;', 'const PACKS='+json.dumps(packs)+';', worker)
(root / 'sw.js').write_text(worker)
assert './gallery.css' in packs['core']
assert any('gallery.css' in item for item in shell)
assert all((root / item.split('?')[0]).exists() for item in shell)
print(f'Verified {len(files)} assets; release {release}; gallery CSS in shell and offline core.')
