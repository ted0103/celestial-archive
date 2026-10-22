# Antique gallery redesign

Local implementation on `codex/antique-gallery`, based on the official v0.3.4 application archive. Published as the v0.3.5 web release.

| Before | After | Why |
| --- | --- | --- |
| Tiny monospaced labels and dense text | Serif headings with readable system-sans body text | Clear hierarchy and easier reading |
| Busy celestial backgrounds | Warm ivory, bronze, quiet dark surfaces, original card art | Antique gallery direction with celestial accents |
| Destination-only gateway | Persistent responsive navigation with active state | Move between reading, deck, saved readings and guide |
| Narrow three-column meanings | Wide meaning rows, stacked on phones | Keep long card names and explanations readable |
| Large route morphs | Short fades and reduced-motion support | Responsive, restrained motion |

## Run locally

From this directory: `python3 -m http.server 47834 --directory app`.
After changing assets: `python3 scripts/refresh-assets.py`.
The Pages workflow now packages `app/` instead of downloading the old release ZIP.

## Verification

- JavaScript syntax check passed.
- Asset refresh verified 112 asset paths, hashes, service-worker shell and core inclusion of gallery.css.
- Browser: complete question / shuffle / three-card selection / reveal / interpretation journey passed.
- Browser: deck search, Moon detail open/close, guide via keyboard Enter, saved-readings empty state passed.
- Visual inspection at 1440px desktop, 805px intermediate and 390px phone widths. Intermediate document width equals scroll width (805px).
- Phone gateway/menu visually checked in a 390px iframe; not a physical phone test.
- Screenshots: review/gateway.png and review/phone.png.

Camera, save/export, offline installation, OS reduced-motion switching and production deployment were not exercised. Original reading/storage logic remains in place. System serif fonts may vary across platforms.

The running preview uses `/private/tmp/celestial-gallery/app` because iCloud file hydration stalled reads in the workspace. Final edited app files are mirrored in this checkout. Test harness pages are only in the temporary preview.

## Motion refinement — 22 October

Added 420ms cover exit, 320ms route crossfade, 620ms content rises with stagger capped at 280ms, a one-shot celestial orbit entrance, guide chapter entrances, and ritual stage emphasis. Existing shuffle/deal/reveal choreography remains. Save/export function region and original styles.css verified byte-for-byte unchanged against the pre-motion snapshot.

Verified JavaScript syntax, 112-asset manifest refresh, browser main-page/subpage navigation, 78-card ritual creation, chapter changes, computed motion timings, and zero-duration keyboard transitions. OS reduced-motion behavior is guarded in CSS but was not toggled on the host; no frame-rate benchmark or physical-device check. Save/export was verified by source comparison, not by creating a saved reading or downloading an export.

Updated preview: http://localhost:47836/

## Typography refinement

Replaced display serifs with locally bundled Manrope (Google Fonts, SIL OFL license included), paired with existing Noto Sans SC. Adjusted heading sizes, weights, line height and tracking across entry, gateway, navigation, reading panels and card titles. Updated offline core manifest to include the font (113 assets). No JavaScript or animation changes in this refinement. Preview: http://localhost:47838/

## Layout and hierarchy polish

| Before | After | Why |
| --- | --- | --- |
| Similar heading and body emphasis | Warm ivory headlines with restrained glow, gold topic labels, crisp body copy | Distinguish hierarchy without blurring reading text |
| Dense destination divisions | Spaced bordered destination panels, one column on phones | Clear grouping and comfortable tap areas |
| Inconsistent panel spacing | Shared responsive padding, balanced headings, comfortable text measures | Consistent rhythm across ritual, deck, saved readings, guide and settings |
| Plain dark surfaces | Quiet inset highlights and shallow shadows | Subtle depth without additional animation |

Verified browser gateway and ritual layouts, phone gateway at 390px, guide navigation, computed headline glow, and no document horizontal overflow at 805px. Refreshed 113 asset hashes and verified final CSS/manifest/worker source parity. CSS-only refinement; existing motion, save and export logic unchanged. Physical devices and full save/export workflow were not retested. Preview: http://localhost:47840/

## Release v0.3.5

The current release includes the redesigned web app and offline ZIP. The Android download is the unchanged signed v0.3.0 web wrapper, verified to target the live repository site. Native Android hardware testing remains pending.

## Entrance correction v0.3.6

| Before | After | Why |
| --- | --- | --- |
| Competing transition selectors and frame-scheduled class toggles | Explicit replayable Web Animations entrances | Reliable appearance on first entry and route return |
| Header navigation treated as one block | Four individually staggered menu items | Clear, visible menu entrance |

Verified intermediate opacity/translation and settled state in browser; regression checks cover replay, cancellation, hidden elements, keyboard and reduced motion. Save/export functions unchanged.
