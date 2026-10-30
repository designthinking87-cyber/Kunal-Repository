# Bridge of Teachings — yt-motion-design

**15 seconds · 1920×1080 · 30fps · 450 frames · H.264/AAC**

- [Download with English narration](https://github.com/designthinking87-cyber/Kunal-Repository/blob/main/videos/Bridge-of-Teachings-15s.mp4)
- [Download without narration](https://github.com/designthinking87-cyber/Kunal-Repository/blob/main/videos/Bridge-of-Teachings-15s-no-narration.mp4)

On either video page, click **Download raw file (↓)**.

A teaching book becomes the source of an arched bridge. A page travels toward people seeking answers; the same recipient carries the received light into a path of questioning, reflection and discovery. The complete marked passage is retained. `BEATS.md` records the visual argument, exact narration, timings, pacing tradeoff and final-frame intent.

## Preview and render

Requires Node.js 22+ and Chrome/Chromium.

```bash
npm ci
npm run studio
npm run typecheck
npm run render
```

Choose **BridgeOfTeachings** in Studio. The output is `out/Bridge-of-Teachings.mp4`. The delivered narrated version additionally receives final loudness normalization.

All artwork is editable in `src/Film.tsx`. Assets are local. Node dependencies are pinned in the lockfile; the cloud's shared node_modules symlink is excluded. All movement is driven by current frame/fps with deterministic paths and easing. No independent animation loops, stock footage, generated faces or externally hosted assets.

## Narration and assets

The complete passage is spoken with a locally generated Kokoro `am_michael` English synthetic voice. It is not a recording or imitation of the user or their Spiritual Master. The 46-word passage has a brisk delivery to fit the requested 15 seconds. The obvious “TMy” typo is corrected to “My”; the wording is otherwise unchanged.

`narration.json` contains all three phrase timings and exact text. The narration-free version retains only the quiet original sound bed, allowing insertion beneath the user's own recording. The anonymous seekers, book and bridge are conceptual artwork; the book's decorative lines do not represent scripture quotations. No likeness of the Spiritual Master is fabricated.

Manrope is included with its SIL Open Font License. Sound bed is original procedural synthesis from the previous authorized project, shortened/faded for this composition. No purchase or new factual/scriptural claims.

`generate-narration.py` is optional; the rendered audio clips are already bundled. To regenerate, install free `kokoro-onnx` and `soundfile`, have FFmpeg available, and set `KOKORO_MODEL` / `KOKORO_VOICES` to the local Kokoro v1.0 model and voice files. Large model files are excluded.
