# दुर्लभ मानव जन्म — PixiJS × HyperFrames

An original 10-second, 1920×1080, 30fps spiritual motion graphic on pure black.

[Download with sound](https://github.com/designthinking87-cyber/Kunal-Repository/blob/main/videos/Rare-Human-Birth-PixiJS.mp4) · [Download silent version](https://github.com/designthinking87-cyber/Kunal-Repository/blob/main/videos/Rare-Human-Birth-PixiJS-silent.mp4)

On either GitHub video page, choose **Download raw file (↓)**.

## Story

- **0–3.2s:** “८४ लाख / योनियों को पार करके…” A golden seed sits within interlaced paths, thirty hand-drawn forms of life, and a field of light. Six symbolic forms: fish, bird, butterfly, leaf, deer and turtle.
- **3.2–5.8s:** The paths and life forms converge into one seed. Their light expands into a human silhouette.
- **5.8–10s:** “तब मिला हमें… / मानव जन्म / बहुत मुश्किल से मिला है / यह अनमोल मानव शरीर।” The figure resolves into 1,900 points of light, a fine outline and a quiet heart glow.

The imagery expresses the user's spiritual concept symbolically. It is not a literal simulation of 8.4 million individual objects.

## Technology

PixiJS 7.4.3 renders all line artwork, particles, convergence, silhouette and localized light through WebGL. HyperFrames 0.8.181 controls typography, timing, deterministic frame capture and the sound mix. There is no Remotion, AI image generation, stock footage or external runtime network requirement. Libraries and the Tiro Devanagari Hindi font are bundled locally with their relevant license files.

`art.js` has a seeded particle distribution and a pure-time `drawArt(seconds)` function. The Pixi ticker is stopped. A GSAP property setter drives the rendered time even when seeks suppress callback events, so backwards seeking and export remain stable.

Background RGB is exactly `#000000`. Localized gold/ivory light is artwork, not a background wash. Corners stay black.

`make-sound.py` generates the original 10-second stereo harmonic bed and three soft bell accents. No licensed external samples, purchases or synthetic narration are used. The silent version is intended for insertion under your own voice.

## Preview / render

Requires Node.js 22+, FFmpeg and Chrome/Chromium.

```bash
npm run check
npm run dev
npm run render
```

If needed, set `HYPERFRAMES_BROWSER_PATH` to your browser executable. The render is written to `renders/Rare-Human-Birth-PixiJS.mp4`.

The source composition is `index.html`; visual design is documented in `DESIGN.md`. Sound can be regenerated with `python3 make-sound.py` using only Python's standard library. To create a silent MP4 without re-encoding the image:

```bash
ffmpeg -i renders/Rare-Human-Birth-PixiJS.mp4 -map 0:v:0 -c copy -an renders/Rare-Human-Birth-PixiJS-silent.mp4
```
