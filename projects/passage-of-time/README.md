# The Passage of Time

A silent, text-free cinematic animation of the supplied six-life-stages photograph. Remotion + React Three Fiber + Three.js + `@remotion/three`.

**Output:** 1920×1080, 30fps, 300 frames, exactly 10 seconds, H.264 MP4.

[Download the MP4](https://github.com/designthinking87-cyber/Kunal-Repository/blob/main/videos/Passage-of-Time.mp4) — select **Download raw file (↓)**.

## Preview and render

Requires Node.js 22+ and Chrome/Chromium.

```bash
npm ci
npm run studio
npm run typecheck
npm run render
```

Studio opens at the URL printed in the terminal; select **PassageOfTime**. Output: `out/Passage-of-Time.mp4`.

All Remotion dependencies are pinned to 4.0.537. React 19.2.3, R3F 9.4.0 and Three.js 0.180.0 are pinned in the lockfile. The render uses deterministic software WebGL (`swangle`), and the config uses system Chromium when available; otherwise Remotion's normal browser discovery applies.

## Implementation

- Reusable component: `src/LifeStagesAnimation.tsx` exports `LifeStagesAnimation`.
- Registered composition: `PassageOfTime`, 1920×1080 / 30fps / 300 frames.
- Original photograph: `public/assets/life-stages.png`, copied byte-for-byte from the user's ZIP. It is rendered on a single photographic texture plane. The people and clock are not redrawn, face-swapped or treated as isolated 3D geometry.
- An eased perspective-camera path moves from left to right, with a short adult hold and an eased full-image pullback after 8.25 seconds. Source proportions are retained; projection is clamped to avoid exposing missing image edges.
- R3F adds 460 seeded depth particles, very faint foreground atmospheric planes, a traveling light following the visible golden path, and a restrained final timeline pulse.
- The original clock hands remain static. Original memories stay in the photograph; the atmosphere and depth particles supply movement without inventing missing photographic backgrounds.
- The image begins slightly darkened. A subtle cool color overlay emerges after six seconds. The last 15 frames darken gently to prepare for the next segment.
- No subtitles, logos, additional text, speech or music.

Every authored movement is calculated from Remotion's `useCurrentFrame()` and `useVideoConfig()`. There is no custom `requestAnimationFrame`, R3F `useFrame`, wall-clock time or unseeded randomness. `ThreeCanvas` controls render synchronization. Its built-in Suspense boundary waits for the original texture before capturing frame zero.

The source image is 1672×941. A 1920×1080 render necessarily upscales it; close views are kept moderate to preserve its photographic detail.
