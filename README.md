# The Celestial Archive · 天穹秘典

A local-first, bilingual tarot reflection and card-learning app built for the **Apps for your life** track.

## Open or download

- Direct website for iPhone, iPad, Android, Windows, and Mac: **https://ted0103.github.io/**
- Illustrated installation guide: **https://ted0103.github.io/download.html**
- APK and offline ZIP downloads: **https://github.com/ted0103/celestial-archive/releases/latest**

On iPhone/iPad, use Safari → Share → Add to Home Screen. On Android, use Chrome → Install app, or install the friend-preview APK. No paid service or app-store account is required.

## Run the production app

Requirements: a current Node.js runtime and a Chromium, Safari, or Firefox browser.

```sh
npm test
npm run start
```

Open `http://celestial-archive.localhost:47831/`. The launcher intentionally accepts only that app-specific hostname and port; opening `app/index.html` through `file://` is not the supported production path.

## Included experience

- A complete, named 78-card Rider–Waite–Smith deck with English and Chinese names.
- A complete set of local raster artwork made from the approved R1.0 visual system, plus the universal lunar card back.
- Secure Fisher–Yates shuffle, a horizontally scrollable 78-card selection ribbon, and an independent upright/reversed random bit for every bound card.
- A three-card Situation / Challenge / Guidance ritual with detailed meanings, reflections, practice prompts, and bilingual synthesis.
- Stacked-deck resolve, smooth deal, cinematic flip/reveal, shared-element page morph, entry ident, click particles, sound, and discard-dissolve motion.
- A whole-page Save ceremony that contracts the report into a paper flyer, folds it into a celestial pigeon, and delivers a newly framed archival sheet to the Reading Chamber.
- A separate export-only ceremony with a gold lunar seal and glowing pigeon. It prepares a 3200×1800 Cover + Synthesis page and a roomier 3200×2400 Card Mapping page without adding a saved reading.
- Arcana search and suit filters, a six-chapter Grimoire, and an x-axis Reading Chamber.
- Explicit Save, Copy, and high-resolution image Export actions. Nothing is saved by default, and the private question is excluded unless its action-specific checkbox is enabled.
- Optional local camera-gesture selection presented as a deck-first ritual: the camera preview is never shown, the visible nine-card ribbon keeps the highlighted choice centered, and every selected card draws, flips, and settles into one of three named artwork slots. Hand tracking is explicitly enabled, speed and sensitivity remain adjustable, and tapping the center card is always available. Video frames are analyzed in memory and are not stored or uploaded. A local diagnostics panel exposes numeric audio/gesture state only; it excludes frames, landmarks, questions, cards, and readings.

## Local data and privacy

Saved readings use browser storage for this exact origin. Clearing browser data, changing the hostname/port, or using a different browser profile makes that archive unavailable. Exported images are the portable copy. The application has no required network requests and the production server applies a restrictive Content Security Policy and local-only connection policy.

Tarot content is provided for reflection, creativity, and entertainment. It is not medical, legal, financial, crisis, or deterministic advice.

## Project commands

```sh
npm run build:production-data  # rebuild app/data.js from the canonical registry
npm run build:export-font -- /path/to/NotoSansSC.ttf  # rebuild the local Chinese export subset
npm run build                         # create the allowlisted optimized PWA in dist/
npm test                       # validate all 78 records and production wiring
npm run start                  # serve the production app at its stable origin
npm run start:dist             # serve the generated friend-release artifact
```

## Canonical source and release flow

- Runtime application: `app/index.html`, `app/app.js`, and `app/styles.css`
- Canonical card registry: the source used by `npm run build:production-data`
- Source-worker release marker: `app/asset-manifest.json` and `app/sw.js` must
  carry the same release ID
- Generated release: `npm run build` creates the allowlisted `dist/` artifact and
  its content-derived release manifest; do not hand-edit `dist/`

Use the stable local hostname for browser checks, then deploy only the validated
`dist/` artifact through the repository's GitHub Pages release workflow.

## Content and font sources

- Tarot meaning structure was researched against the [Labyrinthos tarot meanings index](https://labyrinthos.co/blogs/tarot-card-meanings-list); all production copy is written for this project rather than reproduced verbatim.
- The bundled Simplified Chinese subset is derived from [Noto Sans SC in the official Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/notosanssc) under the SIL Open Font License 1.1. The included license is at `app/assets/fonts/OFL-NotoSansSC.txt`.

The track assessment is recorded in [TRACK-QUALIFICATION.md](TRACK-QUALIFICATION.md), and the approved design/build history is recorded in [PLAN-REVIEW-LOG.md](PLAN-REVIEW-LOG.md).
