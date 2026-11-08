#!/usr/bin/env python3
"""Check the generated asset manifest and service-worker cache without writing files."""
import hashlib
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1] / 'app'
manifest = json.loads((root / 'asset-manifest.json').read_text())
files = manifest['files']
listed = set()

for item in files:
    url = item['url']
    if not url.startswith('./') or '..' in Path(url[2:]).parts or url in listed:
        raise SystemExit(f'Invalid or duplicate asset URL: {url}')
    listed.add(url)
    path = (root / url[2:].split('?', 1)[0]).resolve(strict=True)
    try:
        path.relative_to(root.resolve())
    except ValueError:
        raise SystemExit(f'Asset path escapes app directory: {url}') from None
    content = path.read_bytes()
    if item['bytes'] != len(content) or item['sha256'] != hashlib.sha256(content).hexdigest():
        raise SystemExit(f'Stale asset hash or size: {url}')

release = hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest()[:16]
worker = (root / 'sw.js').read_text()

def constant(name):
    match = re.search(rf'^const {name}=(.*);$', worker, re.MULTILINE)
    if not match:
        raise SystemExit(f'Missing service-worker constant: {name}')
    return json.loads(match.group(1))

if release != manifest['releaseId'] or release != constant('RELEASE_ID'):
    raise SystemExit('Asset manifest and service-worker release IDs differ')

packs = constant('PACKS')
for pack in ('core', 'gesture'):
    expected = {item['url'] for item in files if item['pack'] == pack}
    if set(packs.get(pack, [])) != expected:
        raise SystemExit(f'Service-worker {pack} cache differs from the asset manifest')

index = (root / 'index.html').read_text()
for url in re.findall(r'(?:href|src)="([^"<>]+\.(?:css|js)(?:\?[^"<>]*)?)"', index):
    asset = url.split('?', 1)[0]
    path = (root / asset).resolve(strict=True)
    try:
        path.relative_to(root.resolve())
    except ValueError:
        raise SystemExit(f'Page asset path escapes app directory: {url}') from None
    expected_hash = hashlib.sha256(path.read_bytes()).hexdigest()[:16]
    if not re.search(rf'(?:\?|&)v={expected_hash}(?:&|$)', url):
        raise SystemExit(f'Stale page asset version: {url}')

shell = constant('SHELL')
for url in shell:
    (root / url.split('?', 1)[0][2:]).resolve(strict=True)

print(f'PASS: {len(files)} assets, cache packs, shell URLs, and release {release} are current.')
