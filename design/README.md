# Celestial Archive Review Package

## Open first

Open `catalog-review.html` directly in a modern browser. It is self-contained, embeds JetBrains Mono, and works from `file://` without a network connection.

## Review workflow

1. Compare the whole family in `contact-sheet.png`.
2. Use catalog filters to review Major Arcana and each suit separately.
3. Select a card for a full-size preview, concept rationale, and upright/reversed themes.
4. Choose **Copy Change Request** and send the edited template back by stable card ID.
5. Review requested family-wide changes in `DESIGN-DECISIONS.md` before approving integration.

## Artifacts

- `catalog-review.html` — self-contained interactive review catalog.
- `contact-sheet.png` — 78-card overview.
- `cards/MAJOR-00.png` … `cards/PENTACLES-14.png` — 78 image-based card crops rendered from the restored 5792×4344 local master.
- `catalog-desktop.png` / `catalog-mobile.png` — responsive QA captures.
- `DESIGN-DECISIONS.md` — review ledger and approval checklist.

## Rebuild & QA

```sh
npm test
npm run build:catalog
npm run render:catalog
npm run qa:catalog
```

The render and QA scripts use Playwright with installed Chrome. The modular sources live in `../src/`. The standalone catalog embeds the 4× restored deck master as a local WebP data URL and makes no network requests.
