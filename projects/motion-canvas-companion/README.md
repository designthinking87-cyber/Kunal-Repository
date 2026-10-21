# भगवान साथ हैं… फिर दुःख क्यों?

Native **Motion Canvas 3.17.2** vector animation, assembled into the original Short with **HyperFrames 0.8.181**. This is a separate project. The earlier Three.js and other edits are preserved. No Remotion is used.

## Downloads

- [Full Short, original narration](../../videos/Karma-MotionCanvas-narrated-short.mp4) — 1080 × 1920, 30 fps, 24.333 seconds.
- [Standalone cinematic sequence](../../videos/Karma-MotionCanvas-cinematic-15s.mp4) — 1080 × 1920, 30 fps, 15 seconds, silent.
- Preview frames: [opening](previews/opening.png), [cycle reveal](previews/cycle-reveal.png), [ending](previews/ending.png).

## Visual sequence

An ivory silhouette and a tiny constant gold companion light. A single fine gold stroke draws the world around them. Smoky curves enter as the figure withdraws its attention. A controlled pullback reveals the circular environment. **भूल → दुःख → सवाल** builds one node and connecting arc at a time. A single gold pulse travels around the completed loop. The final Hindi question settles below the cycle.

The scene uses native Motion Canvas nodes, vector paths, splines, circles, text, gradients, reactive signals and its official Renderer/ImageExporter. It is not a prerecorded substitute for the editable animation. Fonts are bundled and the headless renderer waits for Devanagari fonts to load before export.

## Timing against narration

`src/project.ts` provides the tighter standalone version. `src/narrated.ts` provides a separate timing version for the uploaded source:

| Original Short | Visual |
| --- | --- |
| 0–9.333s | Original speaker footage |
| 9.333s onward | Cross-dissolve into the native vector sequence; original voice continues |
| About 17.43s | Ribbons and averted pose begin ahead of “भूल जाते हैं” |
| About 19.83s | Camera begins the cycle reveal |
| About 20.43 / 20.98 / 21.53s | भूल / दुःख / सवाल appear sequentially |
| About 22.38s | One pulse begins after the final connecting arc completes |
| About 22.33–24.33s | Closing question, matching the final spoken question |

`assembly/index.html` adapts the existing HyperFrames timeline and keeps the full uploaded source in `assembly/source.mp4`. The original AAC narration is restored by stream copy after HyperFrames export; it is not shortened, replaced or retimed. No new music or sound effects are added.

## Edit

Run `npm ci`, then `npm start`. Open the local Vite address and select either Motion Canvas project. Both default to **1080 × 1920 at 30 fps**. The source is in `src/scenes/story.tsx`; timing parameters are near the top. Local settings are stored inside the project instead of requiring a writable global home directory.

Open `assembly/` in HyperFrames Studio to edit the footage/animation placement and dissolve.

## Render

Requires Node 22+, FFmpeg and a local Chromium/Chrome installation. Run:

```sh
npm ci
npm run typecheck
npm run render
```

Set `CHROME_PATH` if Chrome is not `/usr/bin/chromium`. The script starts Vite, renders both native Motion Canvas image sequences, encodes them, runs HyperFrames checks, exports the full assembly **through HyperFrames**, then restores the original audio stream. Final MP4s appear under `renders/`.

All animation/rendering dependencies are free and run locally. The original video and all necessary fonts are included; installed dependencies and temporary frame sequences are excluded from Git.
