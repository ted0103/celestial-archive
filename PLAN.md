# Plan: Celestial Archive Music, Hand Ritual, and Reading Clarity
_Locked via grill — by Codex + user on 2026-07-27_

## Goal

Release an updated Celestial Archive website package and Android APK that replaces the synthesized ambient theme with the user-supplied redistribution-cleared MP3, restores Hand Ritual on supported Android and desktop Chromium installations, and replaces generic tarot copy with clear original bilingual definitions and deterministic Situation → Challenge → Guidance readings. The app remains local-first: it sends no questions, cards, readings, or camera data to a server and uses no OpenAI API.

## Approach

1. **Replace only the ambient music implementation.**
   - Copy the supplied 80.5-second MP3 into the app's release assets under a stable, simple filename. Before publication, commit a release record containing its source SHA-256, the user's rights statement, attribution requirement (including “none” when applicable), and approval date/person.
   - Replace the synthesized oscillator theme with one looping local audio track. Start it only after **Enter the archive**, continue it across in-app navigation, preserve the existing music toggle and volume preference, pause while `document.visibilityState !== 'visible'` or after an OS audio interruption, and resume from the prior position only when visible, enabled, and permitted by the browser. Disabling music pauses and retains position; a fresh page load begins at the start.
   - Keep the existing generated interaction sound effects and shared audio-state indicator. Add MP3 MIME handling, offline-cache inclusion, release allowlisting, and a validation that the distributed file matches the source hash.

2. **Fix Hand Ritual at the shared production-build boundary.**
   - Preserve the current local-only MediaPipe Hands design, invisible camera feed, one-hand model, open-palm browsing, one-finger aiming, pinch confirmation, and tap fallback.
   - Add the currently omitted non-SIMD MediaPipe loader and WASM files to the production/release gesture pack while retaining the SIMD path. This addresses the identified failure mode where unsupported devices request fallback files that exist in source but are absent from `dist`, the public site, and the APK-backed experience.
   - Ensure both model variants use correct MIME types, paths, CSP permissions, offline preparation, and cache cleanup. Report stage-specific bounded error codes for runtime asset fetch, runtime construction, camera acquisition, video first frame, and first successful inference; each stage gets one timeout and diagnostics never expose frames or landmarks.
   - Keep activation browser-safe and one explicit user action: opening Hand Ritual presents the control; **Enable hand tracking** requests the camera. Keep tap selection usable whenever tracking fails.

3. **Replace generic tarot prose with an original, versioned bilingual reading edition.**
   - Replace the current flat card copy with a versioned schema: `meaningEdition`; per card localized `keywords`; `upright` and `reversed` objects containing localized `core`, `tension`, `reflection`, and `action`; plus localized `position` modifiers for `situation`, `challenge`, and `guidance`. Validate exact keys and reject missing/empty values at build time. Update active reading, card dialog, Arcana, save/load, copy, export, and tests to consume this schema through one shared lookup function.
   - Treat reversals as a card's energy being blocked, internalized, delayed, or overexpressed—not automatically negative or predictive.
   - Use plain, specific, practical language. Keep readings reflective rather than supernatural; do not present medical, legal, financial, safety, or future predictions as facts.
   - Replace repeated generated sentences such as “Where is [keywords]…” and “Name one choice…” with card-specific copy. Increment `deckVersion`/meaning edition.
   - Change saved records to persist a complete immutable reading snapshot: captured language, question inclusion choice, card identities/orientations, every displayed card text, movement, synthesis, grounded action, reading timestamp, and meaning edition. Reloaded saved readings, copy, and export must use only the snapshot text; migrate old ID-only records once by labeling them legacy/current-edition rather than pretending their original copy is recoverable.

4. **Generate a deterministic three-card synthesis without pretending to understand the question.**
   - Keep the optional question visible as user-provided context, but state through UI copy that the local reading does not semantically analyze it.
   - Compose the synthesis from explicit card-position/orientation fields: Situation establishes the present pattern, Challenge names the tension or distortion, and Guidance proposes a grounded response. Keep the algorithm deliberately small: concatenate the three localized orientation+position clauses with authored bilingual transition templates selected by one optional spread-level relation (`reinforcement`, `contrast`, `progression`, or `balance`). Derive that relation from a symmetric card-pair metadata table keyed by stable card IDs; precedence is Challenge↔Guidance, then Situation↔Challenge, otherwise `direct`. Orientation never changes relation lookup. `direct` uses the three clauses without a relationship claim.
   - End with one concrete action derived from the Guidance card. Never claim certainty, prediction, or hidden knowledge.
   - Use the same immutable synthesis for the active reading, saved Reading Chamber record, copied report, and exported images.

5. **Validate, package, and release.**
   - Add the smallest executable checks that prove: the MP3 is included and loop wiring replaces synthesis; both SIMD and non-SIMD hand runtimes are present in `dist` and the offline gesture pack; every schema field has non-generic bilingual content; relation precedence/fallback and synthesis are deterministic; saved snapshots remain byte-for-byte text-stable after a meaning-edition change; and legacy records receive the explicit migration label.
   - Run the existing deck, runtime, production, and release validation suites. Build into two isolated directories and compare sorted asset paths, sizes, MIME types, hashes, release IDs, and ZIP entries; document expected APK signature/timestamp differences rather than claiming byte-identical APKs.
   - Browser-test the production build on desktop Chrome or Edge: music lifecycle and position across navigation/visibility/toggle changes; camera denial recovery; real hand initialization; gesture selection; and tap fallback. For the fallback proof, launch Chromium with WebAssembly SIMD disabled, capture requested runtime URLs, assert the non-SIMD JS/WASM were fetched, and require one successful inference result—not merely initialization.
   - Test the deployed HTTPS build and rebuilt APK on Android Chrome/TWA, including camera permission, fallback model loading where supported, offline relaunch after that exact deployed release's gesture pack is prepared, music pause/resume rules, and a complete three-card reading/export. The APK contains a TWA wrapper, not web assets; record and verify the mapping from Android version to deployed release ID.
   - Prevent mixed-release clients: do not delete the previous caches while controlled clients still use them; expose the worker release ID, detect page/worker mismatch, and prompt a reload before adopting/deleting the old release. Test an open old tab upgrading while a second tab loads the new deployment.
   - Complete a structured editorial checklist covering every card, both orientations, all three position modifiers, both languages, and reversal/safety coherence; every row must be approved before release.
   - Increment release identifiers and Android version code/name, rebuild the website ZIP and signed APK using the existing external signing setup, publish them as a new release without replacing prior artifacts, deploy the matching public site, then verify download URLs, manifest, Digital Asset Links, release-ID mapping, and asset hashes.

## Key decisions & tradeoffs

- **Original built-in readings, no OpenAI API:** avoids a backend, API-key exposure, cost, network dependence, and privacy claims the static app cannot uphold.
- **Combination-aware but deterministic:** readings connect Situation, Challenge, and Guidance without pretending to understand free-form question semantics.
- **Both upright and reversed:** reversals describe blocked, internalized, delayed, or excessive qualities rather than bad outcomes.
- **Local MP3 replaces only music:** existing generated interaction cues remain; playback still waits for the Enter gesture and uses current controls.
- **MediaPipe fallback restored instead of replacing the tracker:** the source already contains the required non-SIMD runtime, so the smallest root-cause fix is to ship and test it.
- **Supported gesture targets:** installed Android APK/Chrome and desktop Chrome/Edge local installs; tap remains the supported fallback elsewhere.
- **One coordinated release:** source, public site, and production ZIP carry the same asset set; the TWA APK maps to that deployed release ID and meaning edition.

## Risks / open questions

- The user confirmed the supplied MP3 is copyright-free/cleared for redistribution; no independent license document was provided. Publication proceeds on that explicit representation, and the release should retain any attribution metadata available in the source.
- The missing non-SIMD bundle is the strongest code-level explanation for shared local-production/APK failure, but physical camera permission and device tests remain required before claiming Hand Ritual is fixed.
- Rewriting 78 cards in two languages is a content-heavy change. Automated uniqueness/completeness checks catch repetition and omissions, and the complete structured human editorial review is required for tone and translation quality.
- GitHub Pages cannot set every custom security header. The deployed behavior must be tested under its actual response headers rather than inferred from the local production server.

## Out of scope

- OpenAI integration, API-key entry, backend services, accounts, cloud-saved readings, analytics, or transmitting question/camera data.
- New spreads, card artwork redesign, camera preview display, multiple-hand tracking, iOS-native packaging, app-store submission, or replacing MediaPipe.
- Changes to export dimensions, save ceremony, navigation design, card-selection rules, or unrelated release features.
