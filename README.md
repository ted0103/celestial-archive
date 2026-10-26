<div align="center">

# ✨ The Celestial Archive · 天穹秘典

### A bilingual, local-first tarot reflection experience

Explore a complete 78-card tarot collection through a private and immersive experience designed for personal reflection and sharing with friends.

[![Live Demo](https://img.shields.io/badge/Open_Live_Demo-6C4CCF?style=for-the-badge\&logo=googlechrome\&logoColor=white)](https://ted0103.github.io/celestial-archive/)
[![Installation Guide](https://img.shields.io/badge/Installation_Guide-171717?style=for-the-badge\&logo=readthedocs\&logoColor=white)](https://ted0103.github.io/celestial-archive/download.html)
[![Release](https://img.shields.io/badge/Release-v0.3.9-d2ad62?style=for-the-badge)](https://github.com/ted0103/celestial-archive/releases/tag/v0.3.9)

</div>

---

## Overview

**The Celestial Archive** is a bilingual tarot reflection experience built around the complete collection of **78 tarot cards**.

It is designed to provide a calm, personal, and accessible experience across mobile and desktop devices.

The core tarot experience works without hand tracking. The optional **Hand Ritual** uses local camera-based hand tracking with a tap fallback.

## What’s new in v0.3.9

Optional Gemini reflections use your selected topic, situation, desired clarity and three drawn cards. Your written question stays on your device. Explicit consent is required; offline readings remain available when AI is unavailable. AI is supported on the live website; locally hosted packages retain offline readings.

Antique-gallery layouts, locally bundled Cormorant Garamond and Noto Serif SC display typography with Manrope and Noto Sans SC body text, clearer bilingual hierarchy, candlelit antique-gold headlines and dark umber surfaces, and coordinated page and ritual transitions. Existing save/export animations are preserved.

## Highlights

* Complete **78-card tarot experience**
* Bilingual interface
* Local-first privacy
* Mobile and desktop support
* Web, Android APK, and offline access
* Optional camera-based interaction
* User-controlled saving and exporting

## Access the Project

| Method                 | Best for                                  | Link                                                                                                                                      |
| ---------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Live web app**       | iPhone, iPad, Android, Windows, and macOS | [Open The Celestial Archive](https://ted0103.github.io/celestial-archive/)                                                                 |
| **Installation guide** | Step-by-step setup instructions           | [View the illustrated guide](https://ted0103.github.io/celestial-archive/download.html)                                                    |
| **Android APK**        | Signed Android web wrapper           | [Download Android APK v0.3.0](https://github.com/ted0103/celestial-archive/releases/download/v0.3.9/celestial-archive-android-v0.3.0.apk) |
| **Offline package**    | Desktop use and local hosting             | [View the v0.3.9 release](https://github.com/ted0103/celestial-archive/releases/tag/v0.3.9)                                              |

## Installation

<details>
<summary><strong>iPhone and iPad</strong></summary>

1. Open the [live website](https://ted0103.github.io/celestial-archive/) in Safari.
2. Tap the **Share** button.
3. Select **Add to Home Screen**.
4. Tap **Add**.

The website is the supported version for iPhone and iPad. Apple devices do not use Android APK files.

</details>

<details>
<summary><strong>Android</strong></summary>

### Install from the website

1. Open the [live website](https://ted0103.github.io/celestial-archive/) in Chrome.
2. Open the Chrome menu.
3. Select **Add to Home screen** or **Install app**.

### Install the Android APK

Download the signed Android web wrapper. Its native version remains v0.3.0; it loads the current live website, including the v0.3.9 redesign:

[Download Celestial Archive Android APK](https://github.com/ted0103/celestial-archive/releases/download/v0.3.9/celestial-archive-android-v0.3.0.apk)

Because this preview is distributed outside Google Play, Android may request permission to install applications from the selected source.

</details>

<details>
<summary><strong>Windows</strong></summary>

1. Download `celestial-archive-friend-preview-v0.3.9.zip` from the [v0.3.9 release](https://github.com/ted0103/celestial-archive/releases/tag/v0.3.9).
2. Right-click the ZIP file and select **Extract All**.
3. Open PowerShell inside the extracted folder.
4. Start a local server:

```powershell
py -m http.server 47831
```

Alternatively:

```powershell
python -m http.server 47831
```

5. Open this address in Chrome or Edge:

```text
http://localhost:47831
```

</details>

<details>
<summary><strong>macOS</strong></summary>

1. Download and unzip `celestial-archive-friend-preview-v0.3.9.zip`.
2. Open Terminal inside the extracted folder.
3. Start a local server:

```bash
python3 -m http.server 47831
```

4. Open this address in your browser:

```text
http://localhost:47831
```

</details>

> Camera access requires the HTTPS website or a local server. Opening `index.html` directly through a `file://` URL is not supported.

## Privacy by Design

Written questions and saved readings remain on the user’s device. Optional AI sends only preset choices and cards to the Cloudflare Worker and Google Gemini after consent. Google may use free-tier inputs and outputs for product improvement and human review. AI is restricted to adults and unavailable in the EEA, Switzerland and UK. Exporting or sharing is user-controlled.

Camera-based hand tracking is optional and is not required to use the main tarot experience.

The Celestial Archive is intended for reflection and entertainment. It does not provide medical, legal, financial, or predictive advice.

## Project Status

| Feature                         | Status         |
| ------------------------------- | -------------- |
| Core tarot experience           | Available      |
| Complete 78-card collection     | Available      |
| Mobile and desktop web access   | Available      |
| Android package                 | Available      |
| Offline desktop package         | Available      |
| Hand Ritual gesture interaction | Available with tap fallback |

## Feedback

Feedback helps improve the experience, usability, and future features.

<div align="center">

[![Complete the Survey](https://img.shields.io/badge/Share_Your_Feedback-Complete_the_Survey-2EA44F?style=for-the-badge\&logo=googleforms\&logoColor=white)](https://docs.google.com/forms/d/e/1FAIpQLSfKsgh5DuaJZm0mpYEAmB-ClBB0TzHHBjiOUlRnFB0bu9d6Aw/viewform)

</div>

---

<div align="center">

Created by [ted0103](https://github.com/ted0103)

</div>

## AI service

Gemini 3.1 Flash-Lite runs through a Cloudflare Worker with an encrypted server-side key. Billing stays disabled and there is no paid fallback. Free quotas may limit availability. See [Worker setup](worker/README.md).

## Development and releases

The editable website lives in `app/`. Serve it with `python3 -m http.server 47831 --directory app`. After editing assets, run `python3 scripts/refresh-assets.py` to refresh offline hashes and the service worker. The Pages workflow deploys this source from `main`.

The Android APK is the original signed v0.3.0 Trusted Web Activity wrapper for `https://ted0103.github.io/celestial-archive/`. It contains no bundled website, so the web UI updates through the live site. The v0.3.9 release redistributes that identical APK for convenience; it is not a new native build. Physical Android camera/TWA verification remains pending.

### Ambient soundtrack

“Enchanted Valley” by Ondrosik is bundled locally under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/), as declared in the [artist’s library](https://ondrosik.sk/music/). See `app/assets/audio/LICENSE.txt` for provenance. Playback starts after entering the archive and respects the existing music toggle and volume preference.

### Hand Ritual first-use tutorial

The first Hand Ritual visit shows a 24-second silent bilingual Remotion animation. Skip/Continue dismisses it for this browser; Replay tutorial remains available. Camera tracking starts only when explicitly enabled. Remotion source and render instructions: `video/hand-tutorial/`.
