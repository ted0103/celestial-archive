# The Celestial Archive · R1.0 review proof

This is the approved, isolated R1.0 design baseline. It authorizes generation of the remaining 72 original card faces, but it does **not** authorize production integration or release.

## Review it

From this directory, run:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173` in a browser. Sound begins only after pressing **Enter the archive**.

Use the **Review** control in the top bar to inspect the 56 approved finite cases. **Export decisions** downloads the approved baseline record.

## Included interactions

- Editorial gateway and four destinations
- Original dark-green ceremonial opening ident followed by a dedicated collage resolve, ivory-panel unfold, sequential title/copy/seal entrance, persistent next-reload toggle, and skip control
- Glowing gold/ivory particle scatter on pointer and touch interactions
- Three-card question, shuffle, measured deck-to-slot card flights, stable reserved positions, reveal gating after every card lands, cinematic portal/fan/flip reveal, meaning, synthesis, save, export, copy, and discard flow
- Explicit local saving only; all question-inclusion toggles default off
- Origami-pigeon save motion and paper/ink/gold discard dissolve
- Six-face Arcana proof grid with card-back-first detail reveals
- Finite horizontal Reading Chamber gallery with selected-only emphasis
- Six-chapter Grimoire
- EN + 中文, English-only, and 中文-only modes
- Optional Hand Ritual with explicit browser permission, local 64×48 motion-zone analysis, no upload or frame storage, and a manual simulation fallback
- 3200×1800 high-density monochrome editorial image report with denser grain, live card montage, bilingual archive type, and opt-in question inclusion
- Original synthesized violin-like ambient theme and interaction sounds, all independently toggleable
- Motion toggle and `prefers-reduced-motion` support

## Proof assets

`assets/cards/revision-2/` contains the active six face proofs and one lunar back at 1024×1536. Every active card uses the same locked near-black, muted-antique-gold, warm-ivory, and tiny dusty-rose accent palette, with sparse flat screen-printed compositions matching the approved template direction. The earlier detailed proofs remain preserved one directory above but are no longer loaded. `assets/backgrounds/` contains five original 1920×1080 page backdrops. Card titles and ranks are live interface text rather than baked into the faces.

Automated desktop/mobile QA evidence is in `qa/`, including opening/reveal/camera captures and the exported report proof. The browser test verifies the live camera stream, rejects the idle fake feed as a gesture, and separately verifies zone-to-card selection. The image-generation prompt register is in `IMAGEGEN-PROMPTS.md`. The machine-readable approval scope is `approval-manifest.json`.

## Approval gates

The first gate passed on 18 July 2026: all 56 R1.0 proof cases were explicitly approved, authorizing production of the remaining 72 original raster faces. The approved proof remains the immutable visual, motion, sound, responsive, privacy, and export baseline.

Production integration, certificate work, packaging, and release remain blocked until the complete 78-card catalog plus the universal back passes a second explicit user approval.
