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

## Celestial journal — whole-app refinement

Approved: extend the tactile journal across all rooms, with a black-and-gold theatrical start screen. Retain English display serif and Chinese Song headings, readable sans body, original card artwork, and save/export choreography. Use existing entrance lifecycle and local CSS illustration; no added dependency or generated artwork. Scope: cover markup and presentation CSS, regenerated offline hashes. Check desktop and narrow layouts, navigation, bilingual type, reduced motion, existing behavior tests. This iteration is a local preview; prior main release remains the verified Hand Ritual fix until publication is requested.

Manuscript refinement: question, shuffle/draw, and reading now use numbered illuminated folios, ink flourishes, lunar seals, ruled input, and a rubricated synthesis initial. Readable bilingual type retained; no changes to reading logic or save/export animations. Local preview only.

Publication approved by user: publish the complete journal/manuscript design, landscape Reading Chamber, and dark-ink readability fixes to main. Motion, Hand Ritual, and AI regression suites passed; browser reading flow and saved-reading layout checked. Physical-device validation remains outstanding.

Hand Ritual first-use tutorial: 16-second original schematic MP4, four gesture steps, bilingual text equivalent, skip/continue and replay; per-browser versioned seen marker, storage failures safe, reduced-motion manual playback, no camera request during tutorial. First/return/replay paths verified in browser. Tutorial remains a local preview; approved question-flow commit 02eef78 deployed successfully.

Approved Remotion tutorial exported and integrated: 24s, 1920×1080, 60fps, H.264, silent, 1.7MB. Full decode and contact-sheet inspection passed. First-use, skip, replay, reduced motion and blocked storage tested. Publishing tutorial and source with approval.
