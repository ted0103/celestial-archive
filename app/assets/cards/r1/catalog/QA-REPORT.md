# R1 complete catalog QA

Date: 18 July 2026  
Gate: complete catalog explicitly approved by the user  
Production integration authorized: **yes**

## Passed checks

- Canonical structure: 78 cards, 22 Major Arcana, 56 Minor Arcana.
- Asset set: 78 unique card faces plus one unique universal back.
- Source split: six approved proof anchors and 72 new original raster faces.
- Every admitted PNG is exactly 1024×1536 (2:3).
- Every admitted asset has a unique locked SHA-256 digest.
- Every catalog file link resolves locally.
- No rejected attempt is referenced by the register or catalog.
- Card IDs and motif labels are unique.
- Catalog JavaScript and build/validation scripts pass syntax checks.
- `productionAuthorized` records the explicit second-gate approval in the catalog and deck register.

## Human visual QA

- Every generated face was inspected before admission for palette, border, text-free artwork, readable motif, and composition.
- Numbered suit cards were checked for exact, separately countable suit-symbol totals.
- Six failed Wands attempts and one failed Nine of Pentacles attempt were quarantined with reasons and hashes.

## Browser limitation

Programmatic in-app-browser navigation to a new local `file://` catalog tab was blocked by browser security policy, so no automated screenshot claim is made for this catalog. Static interaction, syntax, asset-link, responsive-CSS, and data-integrity checks passed. The user completed the second approval gate explicitly in the Codex task.
