# Celestial Archive — Design Decision Ledger

Catalog version: R1.0 generation baseline  
Status: Proof approved; complete catalog pending  
Scope: 6 approved original raster faces + 1 approved back; 72 original faces authorized for generation

## How to request a change

Open a card in `catalog.html`, choose **Copy Change Request**, and edit the copied template:

```text
CARD: MAJOR-18 — 月亮 · The Moon
CHANGE: Make the central moon larger and reduce the path ornaments.
KEEP: Twin towers and triple-moon idea.
PRIORITY: major
```

Changes can also target a family:

```text
CARD: SWORDS-ALL
CHANGE: Use more diagonal tension and less perfect symmetry across number cards.
KEEP: Silver accent and ceremonial blade construction.
PRIORITY: major
```

## Shared system decisions

| ID | Area | Current decision | Status |
|---|---|---|---|
| SYS-01 | Artwork source | Direct raster crops from the supplied complete-deck composite; no procedural illustration | Pending |
| SYS-02 | Typography | JetBrains Mono + CJK fallback | Pending |
| SYS-03 | Faces | Preserve the supplied antique-gold borders, figures, symbols, and internal titles as pixels | Pending |
| SYS-04 | Card back | Not included in this review because the supplied composite contains faces only | Deferred |
| SYS-05 | Major Arcana | 22 image crops mapped to the supplied Major Arcana rows | Pending |
| SYS-06 | Minor Arcana | 56 image crops mapped to the supplied suit rows; source duplicates and label errors remain visible | Pending |

## Family review

- [ ] Major Arcana — 22 cards reviewed
- [ ] Wands — 14 cards reviewed
- [ ] Cups — 14 cards reviewed
- [ ] Swords — 14 cards reviewed
- [ ] Pentacles — 14 cards reviewed
- [ ] Cross-deck consistency reviewed
- [ ] Final catalog approved for interactive integration

## Revision log

| Revision | Target | Request | Resolution | Status |
|---|---|---|---|---|
| D0.1 | Entire deck | Initial sparse procedural concept catalog | User requested richer figurative celestial artwork | Superseded |
| D0.2 | Entire deck | Add warm-gold fills, rounded framing, figures, hands, flora, insects, terrain, clouds, textured moons, and denser celestial ornament inspired by 2 new references | Awaiting user feedback | Open |
| D0.3 | Entire deck | Research Labyrinthos’s 78-card taxonomy; replace generic Minor Arcana copy with 56 card-specific bilingual interpretations; translate Golden Thread’s black/gold monoline discipline into original celestial scenes | Awaiting user feedback | Open |
| D1.0 | Entire deck | Delete the inherited procedural-orbit renderer and rebuild all 78 faces around the supplied glossy moon-tarot template: bold filled gold icons, double rounded borders, corner rings, diagonal sheen, and dedicated name bay | Awaiting user feedback | Open |
| D2.0 | Entire deck | Replace the glossy icon system with the supplied traditional engraved reference: articulated figures, patterned garments, animals, architecture, terrain, plants, stars, and narrative Minor Arcana | Awaiting user approval; no application integration authorized | Open |
| D3.0 | Entire deck | Retire code-drawn card art and use only direct local-image crops from the supplied 78-card composite; remove the procedural back from the active review | Awaiting user approval; no application integration authorized | Open |
| D3.1 | Entire deck | Restore the supplied raster master, upscale it 4× to 5792×4344, sharpen engraved edges, and render all 78 crops from resolution-aware source coordinates | Awaiting user approval; no application integration authorized | Open |
| R1.0 | Complete experience + seven card assets | Replace all D0–D3 production directions with the original sparse flat screen-printed near-black / muted-gold / warm-ivory system; keep card labels live; approve every page, transition, motion, sound, responsive, language, privacy, report, background, six representative faces, and lunar back | User explicitly approved all 56 proof cases on 18 July 2026. Remaining 72 original raster faces authorized. Full catalog approval still required before integration. | Approved baseline |

## R1.0 gate status

All D0.1–D3.1 artwork paths are legacy-only and forbidden as production sources. R1.0 approval authorizes generation and catalog assembly, not application integration. The next binding decision is explicit user approval of the complete 78-card catalog plus universal lunar back.
