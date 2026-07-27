# Android friend preview

The Android package is a Trusted Web Activity for `https://ted0103.github.io/celestial-archive/` using package ID `io.github.ted0103.twa`. The generated project is pinned to Bubblewrap CLI `1.24.1`; the website remains the source of the interface and data.

## Rebuild without committing signing material

1. Install the free Bubblewrap runtime once: `npx --yes @bubblewrap/cli@1.24.1 --version`.
2. From `android/twa`, create `.signing/` and place the existing `signing.keystore` there. Never commit this directory.
3. Run `npx --yes @bubblewrap/cli@1.24.1 build --skipPwaValidation` and enter the existing store/key passwords when prompted.
4. Confirm `versionCode` is higher than the previous APK, then inspect the signed APK's package, version, certificate fingerprint, launch URL, and root Digital Asset Links association before release.
5. Remove `.signing/` after the build. Store the key only in the external private backup.

The app intentionally uses no Play Billing, geolocation, account, analytics, or paid service. Camera permission is requested only when the optional Hand Ritual is explicitly enabled.
