# Optional Gemini reflection

The static app remains usable without this Worker. No API key belongs in `app/`, the APK or GitHub. The request accepts only three card IDs/orientations, three allowlisted preset IDs and explicit consent; additional fields are rejected. Private question text is never submitted. The Worker supplies authoritative meanings from `cards.json` and validates bounded bilingual output. AI is a reflection aid, not evidence or a factual prediction.

## Activate without billing

1. Use a Gemini API project showing **Free tier**, with billing disabled. Create a key in Google AI Studio. Do not share it in chat or commit it. Confirm `gemini-3.1-flash-lite` is still free and available for this project at deployment time.
2. Use a **Workers Free** account. From this directory run `npx wrangler login`, then `npx wrangler deploy`. Complete the account authorization yourself. The deployed endpoint stays disabled initially.
3. Run `npx wrangler secret put Celestial_Archieve` and enter the key in the hidden prompt, or add it as an encrypted Worker secret in Cloudflare. Never put it in `vars`.
4. After checking both free plans, change `FREE_TIER_CONFIRMED` to `true` and redeploy. This is an operator check, not a billing enforcement API. Keep billing disabled; no code can promise zero charges if the account is later upgraded.
5. Set `app/ai-config.js` to the deployed HTTPS `/reading` URL. Run `node tests/ai-reading.mjs`, `node tests/scene-motion.cjs`, and `python3 scripts/refresh-assets.py`. Publish the static app only after a synthetic live test passes.

No paid model fallback, search grounding, retries, database, or server reading storage. Worker observability is disabled; Google and Cloudflare still process requests under their service policies. Google may use free-tier prompts/results for product improvement and human review. AI requires adult self-attestation. The Worker rejects requests from the EEA, Switzerland and UK and fails closed when country information is absent. Self-attestation and geolocation are limited controls; review suitability before broader public launch.

The 5-per-minute throttle is approximate per Cloudflare location, not a global spending cap. Abuse may exhaust the Gemini free quota; users retain offline readings. Do not enable billing to resolve quota errors. The app ignores late responses after a new draw or a save and never changes an already-saved reading. Results are stored locally only on explicit Save, alongside preset context, and reused for copy/export.

`cards.json` is a generated subset of `app/data.js`; the test checks it for drift. Regenerate it when the curated meanings change.

Official references: [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing), [Gemini terms](https://ai.google.dev/gemini-api/terms), [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [rate-limit locality](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
