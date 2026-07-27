# Celestial Tarot Visual Specification

Reference artifact: `celestial-tarot-reference.webp`  
SHA-256: `dd4c4b31e3163652bafa453623b44689e8cd28bde388a0e54045832643fdb609`

Redesign references:

- `rich-celestial-reference-01.png` — SHA-256 `138a7fcf3e3c2442d2d2469f64ec0120a77b546e2aba385351f19f6965a69378`
- `rich-celestial-reference-02.png` — SHA-256 `08295b8eceeb2929b615c54fffa106aac392a0ca86119ecccf16ab36ef36039d`
- `engraved-tarot-reference.png` — user-supplied complete-deck raster artwork used directly for Draft 3.0
- `engraved-tarot-reference-enhanced.png` — AI-restored, composition-preserving master
- `engraved-tarot-reference-enhanced-4x.webp` — 5792×4344 production master used by Draft 3.1

Research reference: [Labyrinthos 78-card meaning index](https://labyrinthos.co/blogs/tarot-card-meanings-list) and its Golden Thread deck presentation, accessed 2026-07-17.

## Direction

Luxury occult illustration on warm charcoal-black. The work should feel precise, ceremonial, richly illustrated, and collectable—not gothic horror, neon fantasy, or generic “magic” UI. Every card shares one visual grammar while presenting a different central scene.

Draft 3.0 is a local-image proof based directly on `engraved-tarot-reference.png`. Card faces are cropped from the supplied composite and displayed without procedural redrawing, geometric substitutions, generated figures, or CSS overlays. The source pixels—including any duplicate art, incorrect internal labels, and resolution limits—are intentionally preserved for review.

Draft 3.1 restores line contrast and scales the complete sheet to 5792×4344 before individual cards are cropped. Crop coordinates scale from the original 1448×1086 coordinate system, preserving the approved composition while avoiding direct enlargement from tiny browser canvases.

## Palette

- Void: `#050505`
- Raised black: `#0c0c0a`
- Antique gold: `#c99a4b`
- Burnished gold: `#684b25`
- Warm ivory: `#e2ba72`
- Smoke: `#81745d`
- Wands accent: `#b7835d`
- Cups accent: `#7897a2`
- Swords accent: `#aab3b8`
- Pentacles accent: `#82966e`

Gold is structural, ivory is focal, and suit colors are restrained secondary notes. No saturated rainbow palette.

## Typography

- Latin, numerals, and punctuation: JetBrains Mono.
- Chinese glyph fallback: Noto Sans Mono CJK SC, then PingFang SC / Microsoft YaHei.
- Uppercase micro-labels with generous tracking.
- Names remain compact and subordinate to the illustration.

## Card anatomy (observed in source artwork)

- Ratio: approximately 5:7.
- Parchment-black card with two narrow outer keylines and a dedicated illustrated scene frame.
- Fine botanical corner engraving and a separate bilingual name bay.
- Traditional central narrative scene rather than a single poster symbol.
- Dense but controlled star fields, distant mountains, terrain, plants, clouds, and architecture.
- Countable suit objects remain explicit on numeric Minor Arcana.

## Density & line rules

- Primary outline: 3.0–5.0 px at 768 px card width.
- Secondary construction line: 1.5–2.5 px.
- Micro-engraving: 0.6–1.0 px at reduced opacity.
- Use symmetry for authority, balance, and cosmic order; break symmetry with hands, figures, plants, insects, terrain, or flowing fabric for narrative energy.
- Glow is a narrow halo around ivory focal marks, never a large blurred neon bloom.
- At least one large filled gold or ivory mass anchors each card. Thin-line geometry supports the scene but cannot be the only visual content.
- Numeric Minor Arcana retain countable suit emblems while gaining a rank-specific narrative environment. Courts use distinct robes, headpieces, poses, and suit-specific natural/celestial surroundings.

## Source-art boundary

Draft 3.1 does not reconstruct or imitate the supplied art in code. It embeds the enhanced local master and crops it for private local review. Labyrinthos text remains a meaning reference only; displayed meanings are paraphrased rather than copied.
