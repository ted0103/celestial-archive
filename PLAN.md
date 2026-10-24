# Antique gallery redesign

Approved direction: clean antique gallery with restrained celestial accents, based on the user's second reference. Redesign type, menu, and layout across cover, gateway, reading, deck, saved readings, guide, and settings. Preserve the existing bilingual content, card artwork, local data model, and reading engine.

Scope: app/index.html, new gallery.css, targeted navigation/labels in app.js, offline asset manifest/service worker, and Pages packaging. The repository previously deployed a release ZIP; the exact v0.3.4 release is extracted into app/ as an editable baseline. No publication, push, camera session, or real saved-reading changes are authorized or needed.

Checks: syntax; browser navigation, bilingual settings, deck filters, reading flow; desktop/mobile layouts, long card names, keyboard and reduced motion; cache manifest consistency. Preserve the original release ZIP for comparison. Independent review was not requested.

## Motion refinement

Add staggered main-page, route, guide-chapter and ritual entrances using the existing scene lifecycle. Preserve save/export choreography. Use transform/opacity, bounded stagger delays, reduced-motion and immediate keyboard navigation. Local-only implementation; no publication.

## Optional Gemini reflection — implemented locally, activation pending

Accepted: zero fee; optional online AI with offline fallback. Preset topic, situation and desired clarity replace private free text in the AI payload. Written questions remain on-device. Explicit adult/data-use consent before each reading request.

Scope: preset form, strict shared request/output validation, Cloudflare Worker with server-only Gemini secret and authoritative meanings, immutable saved AI synthesis reused by display/copy/export, offline asset manifest and focused tests. Existing save/export animation functions remain unchanged.

Checks: payload privacy, invalid/extra fields, consent, card identity, immutable snapshots, origin/region restrictions, quota/network/malformed fallback, stale responses and save-during-request; existing scene-motion checks. Live model quality and account free-tier state require secure setup and a synthetic request before publication.

Activation: user confirmed exposed key revoked and replacement saved. Cloudflare secret is named Celestial_Archieve; Worker and tests use that binding. Gemini 3.1 Flash-Lite returned HTTP 200 with grounded English/Chinese output for a synthetic creative/stuck/next reading. Free tier confirmed; no billing changes. Frontend endpoint connected for release v0.3.8. Browser save/export verification pending.
