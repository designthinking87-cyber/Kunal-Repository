# “That was me.” — a 25-second philosophical film

**1920×1080 · 30fps · 750 frames · 25 seconds · H.264/AAC.**

[Download the finished film](https://github.com/designthinking87-cyber/Kunal-Repository/blob/main/videos/That-Was-Me-25s.mp4) — click **Download raw file (↓)**.

## Creative treatment

A contemplative English-language documentary vignette about the contrast between a changing body, changing thoughts, and the remembered sense of self. Warm ivory editorial typography, charcoal, restrained gold, photographic memories, luminous procedural artwork, and an intimate final statement.

The user's supplied life-stage image is reused without redrawing the faces. Newly authored vector artwork includes the opening clock, a particle-filled profile that sheds an earlier outline, and a rotating, rewiring network projected in perspective. No generative image replacement, stock clips, logos, or unrelated religious symbols.

## Narration

The complete supplied narration is spoken in English by a locally generated Kokoro `am_michael` synthetic voice. It is not a recording or imitation of the user's voice. The seven editable clips preserve the supplied wording; punctuation is normalized for speech. The voice is paced to a fixed 25-second edit. A quiet, original procedural harmonic bed and four soft tone accents sit below it.

- 0.15–2.55: Think about it for a second.
- 2.80–5.65: You can remember being a child,
- 5.95–9.25: but you no longer have that child's body.
- 9.60–13.65: You can remember the person you were ten years ago,
- 13.95–18.60: but your thoughts and beliefs may be completely different today.
- 19.00–22.25: Still, when you look back, you say,
- 22.55–24.45: That was me.

`narration.json` contains the same edit timings. No narration text was omitted.

## Preview and render

Requires Node.js 22+ and Chrome/Chromium.

```bash
npm ci
npm run studio
npm run typecheck
npm run render
```

Select **ThatWasMe** in Studio. The preview server prints its local URL. The render is written to `out/That-Was-Me.mp4`. The delivered video also has final audio loudness normalization; all included source audio remains editable.

`src/Film.tsx` contains the composition, scene artwork, transitions, photographs, typography and audio clips. All movement is a pure function of `useCurrentFrame()` / fps, with seeded particle placement; no independent animation loops or wall-clock motion. The photo uses Remotion `CanvasImage`. The procedural network uses explicit perspective projection rather than a WebGL runtime, keeping this composition portable.

All required image, font and audio assets are included. The installed node_modules used in the cloud was shared with an earlier project; that symlink is intentionally excluded. `npm ci` creates a standalone installation from the bundled lockfile.

## Optional audio regeneration

The final audio clips are bundled, so regeneration is unnecessary for rendering. `make-sound.py` uses only Python's standard library. `generate-narration.py` requires free `kokoro-onnx`, `soundfile`, FFmpeg, and the Kokoro v1.0 model and voices files. Set `KOKORO_MODEL` and `KOKORO_VOICES` to their local paths. Models are not bundled because of their size.

Typeface: Instrument Serif, included with its SIL Open Font License. Image: provided by the user earlier in this conversation. Sound bed: original synthesis. Narration: locally generated with Kokoro-82M.
