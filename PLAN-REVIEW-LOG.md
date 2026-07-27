# Plan Review Log: Celestial Archive Music, Hand Ritual, and Reading Clarity

Act 1 (grill) complete — plan locked with the user. MAX_ROUNDS=5.

## Act 1 decisions

- Use original built-in definitions; no OpenAI API.
- Rewrite all 78 cards in clear English and Simplified Chinese.
- Keep upright/reversed readings and add deterministic Situation → Challenge → Guidance synthesis.
- Keep the optional question only as context; do not claim semantic analysis.
- Fix Hand Ritual for Android APK/Chrome and desktop Chrome/Edge, with tap fallback elsewhere.
- Replace synthesized ambient music with the supplied MP3, treated as user-confirmed copyright-free/redistribution-cleared; start after Enter and loop across the app using existing controls.
- Rebuild, verify, and publish the website package, APK, and public release after implementation approval.

## Round 1 — Codex

- The promised snapshot preservation is false: saved records persist only card IDs/orientations, and reload hydrates them from the current deck, so old readings silently acquire new meanings despite `meaningVersion`. Fix: persist the complete card text and synthesis in a versioned snapshot, then render/copy/export saved readings exclusively from that snapshot.
- The proposed content model conflicts with the existing schema, which has only shared `meaning`, `shadow`, `reflection`, and `practice` fields—not orientation × position content. Fix: specify the exact new schema and every consumer migration before authoring 936+ bilingual fields.
- “Relationship tags where metadata supports them” leaves the synthesis algorithm and metadata undefined, so determinism and completeness cannot be tested. Fix: define the tag schema, precedence, bilingual templates, orientation behavior, and direct-clause fallback.
- The plan does not prevent mixed-version execution during service-worker activation; the current worker calls `skipWaiting()` and deletes prior release caches while old clients may remain open. Fix: defer activation/cache deletion until client reload or add explicit release-ID mismatch handling and an upgrade test.
- “Forced non-SIMD initialization” has no concrete mechanism; merely shipping the files does not prove MediaPipe selected or successfully executed that branch. Fix: instrument requested runtime URLs and run a browser configuration with WebAssembly SIMD disabled, asserting non-SIMD JS/WASM fetches plus successful inference.
- The Android APK is a TWA pointed at the deployed origin, not a package containing the web assets, so “matching APK asset set” and APK-offline behavior are misleading. Fix: define consistency as APK version → deployed release ID and test offline only after that exact origin/release has completed cache preparation.
- Music requirements conflict: step 1 pauses when the app is inactive, while Android validation demands “continuous music.” Fix: state the lifecycle rule precisely and test pause/resume position across visibility, navigation, OS interruption, and toggle changes.
- MP3 licensing evidence is underspecified for a public release: a conversational confirmation and optional embedded attribution do not establish what must ship. Fix: record the source hash, rights statement, attribution requirement, and approver in a committed release record before publication.
- “Build twice and compare meaningful inputs” is not executable because the comparison set and allowed nondeterministic fields are undefined. Fix: rebuild into isolated directories and compare sorted asset paths, sizes, MIME types, hashes, release ID, ZIP contents, and APK reproducibility exceptions.
- Human “spot review” is inadequate for 78 cards × two orientations × three positions × two languages, especially for safety-sensitive and semantically inverted copy. Fix: require a complete structured editorial review checklist with per-card approval status before release.
- The diagnostic taxonomy lacks observable evidence boundaries: MediaPipe initialization failures can surface asynchronously and collapse into indistinguishable loader/model errors. Fix: define stage-specific error codes for asset fetch, runtime construction, camera acquisition, first frame, and first inference, with one bounded timeout per stage.

VERDICT: REVISE

### Codex's response

Accepted all eleven findings. The plan now defines immutable saved snapshots and an honest legacy migration; an exact versioned card schema and shared consumer lookup; deterministic relation metadata, precedence, and fallback; safe service-worker release adoption; a real non-SIMD inference test; correct TWA-to-deployed-release semantics; precise music lifecycle rules; committed rights evidence; executable isolated-build comparison; a complete editorial approval matrix; and stage-specific bounded gesture diagnostics.

## Round 2 — Codex

All prior material findings are addressed. Two minor cleanup points:

- The risks section still says “human spot review,” contradicting the mandatory full editorial checklist. Fix: replace it with “complete structured human review.”
- “Same asset set” still describes the TWA APK inaccurately. Fix: say the APK maps to the same deployed release ID and meaning edition.

VERDICT: APPROVED

### Codex's response

Accepted both wording cleanups. The plan now consistently requires complete structured editorial review and describes the TWA as mapping to the deployed release rather than embedding the web assets.
