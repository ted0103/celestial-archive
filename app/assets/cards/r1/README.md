# R1 original raster deck workspace

Gate status: **complete catalog approved; production integration authorized**

The seven files in `approved/` are byte-for-byte copies of the R1.0 proof assets approved by the user on 18 July 2026. Do not overwrite them. New card faces belong in `generated/` only after individual visual inspection; rejected attempts belong in `rejected/` and must never be imported by the application.

`deck-register.json` is generated from the canonical 78-card schema and records the asset state for every card. `provenance.json` locks the approved anchors by SHA-256 and records generation policy. The complete interactive review catalog is [catalog/index.html](catalog/index.html); all 78 faces and the universal back have passed the locked dimension, identity, and hash checks.

The user explicitly approved all 78 named faces and the universal lunar back on 18 July 2026. Application integration is authorized; packaging and release still require the implementation and release QA defined in `PLAN.md`.

## Locked art direction

- Portrait 2:3 raster PNG, 1024×1536 minimum.
- Near-black `#0b0d0d`, muted antique gold `#a88952`, warm ivory `#ead9b2`, and no more than three tiny dusty-rose `#b88478` star accents.
- Sparse flat screen-printed composition with generous negative space and the same thin rounded double border.
- No baked title, rank, letters, numerals, logo, watermark, mockup, or surrounding surface.
- No realistic scene, engraving, crosshatching, modeled lighting, gradient, drop shadow, or photorealism.
- Card names and ranks remain live JetBrains Mono UI text.
