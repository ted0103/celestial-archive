# Antique gallery redesign

Approved direction: clean antique gallery with restrained celestial accents, based on the user's second reference. Redesign type, menu, and layout across cover, gateway, reading, deck, saved readings, guide, and settings. Preserve the existing bilingual content, card artwork, local data model, and reading engine.

Scope: app/index.html, new gallery.css, targeted navigation/labels in app.js, offline asset manifest/service worker, and Pages packaging. The repository previously deployed a release ZIP; the exact v0.3.4 release is extracted into app/ as an editable baseline. No publication, push, camera session, or real saved-reading changes are authorized or needed.

Checks: syntax; browser navigation, bilingual settings, deck filters, reading flow; desktop/mobile layouts, long card names, keyboard and reduced motion; cache manifest consistency. Preserve the original release ZIP for comparison. Independent review was not requested.

## Motion refinement

Add staggered main-page, route, guide-chapter and ritual entrances using the existing scene lifecycle. Preserve save/export choreography. Use transform/opacity, bounded stagger delays, reduced-motion and immediate keyboard navigation. Local-only implementation; no publication.
