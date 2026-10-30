# Remembered Child — yt-motion-design

A complete 10-second editorial animation of the marked passage:

> Think about it for a second. You can remember being a child, but you no longer have that child's body.

[Download the MP4](https://github.com/designthinking87-cyber/Kunal-Repository/blob/main/videos/Remembered-Child-10s.mp4) — click **Download raw file (↓)**.

**1920×1080 · 30fps · 300 frames · H.264/AAC**

The visual anchor is one remembered child photograph, carried continuously from the opening to the final comparison. On the right, a smaller body contour fragments while a larger outline resolves. The photograph stays intact. See `BEATS.md` for exact cues, transformations, asset provenance, design choices and final-frame intent.

## Preview / render

Requires Node.js 22+ and Chrome/Chromium.

```bash
npm ci
npm run studio
npm run typecheck
npm run render
```

Select **RememberedChild** in Remotion Studio. Render: `out/Remembered-Child.mp4`. `src/Film.tsx` contains the complete editable composition. All images, fonts and audio clips are bundled. `node_modules` is excluded; the lockfile creates a standalone installation.

## Assets and interpretation

- Photograph: user's earlier uploaded life-stage image, copied unchanged and cropped within the composition. It is a visual metaphor for memory, not documentary evidence about a real person's life.
- Body forms: original anonymous SVG line artwork. The transformation does not claim literal facial aging or simulate biological growth accurately.
- Narration: three complete English synthetic-voice clips (Kokoro `am_michael`), reused from the preceding project. This is not a recording or imitation of the user's voice.
- Sound bed: original procedural synthesis, shortened and faded for 10 seconds.
- Typeface: Manrope variable, included with its SIL Open Font License.

All motion is deterministic and driven by Remotion's current frame and fps. No wall-clock animation, uncontrolled randomness or independent rendering loop is used. Only the marked narration is included, and the previous 25-second film is preserved separately.

The delivered MP4 additionally receives audio loudness normalization for consistent playback. The included individual voice clips remain editable.
