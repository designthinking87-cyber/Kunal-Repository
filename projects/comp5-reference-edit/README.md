# Comp 5 — HyperFrames reference edit

**Work in progress. Final captioned MP4 is not rendered yet.**

The source video and both references were successfully downloaded and inspected. The HyperFrames composition is authored at **3840 × 2160, 30000/1001 fps** and retains the full **147.6475-second** source. The camera pass adds eased zoom-ins, pullbacks, and lateral reframing to the opening, returning to the original frame at the subtitle cutoff. The original audio is preserved.

Reference-1 typography: white sans serif, regular linking words and larger bold italic emphasis. Bundled Liberation Sans is an Arial-compatible approximation; the exact font in the raster reference is unverified.

## Remaining blocker

`captions.json` is intentionally empty. The exact transcript must be supplied or transcribed before delivery. The local speech-recognition model is absent, and its download host `huggingface.co` is denied by the current network policy. Model downloads can also redirect to `*.xethub.hf.co`. Keep the existing Dropbox domains when adding those domains. No speech text has been invented.

The cutoff is **934 / (30000/1001) = 31.1644666667 seconds**, interpreting `00:00:31:04` as non-drop-frame source timecode. No caption may extend past this point.

## Files

- `index.html`: full-length HyperFrames composition.
- `camera.json`: editable camera keyframes.
- `captions.json`: timed phrase groups, currently awaiting transcript.
- `build.py`: deterministically builds the composition.
- `DESIGN.md`: reference treatment and font disclosure.
- `check.log`, `inspect.log`: passing checks for the camera-only composition; caption checks must be repeated after transcript integration.
- `previews/`: 4K framing studies using the opening video poster at selected camera positions, without captions. These are not rendered playback verification.

## Reproduce

1. Download the original Comp 5 to `assets/comp5.mp4` using `python download-source.py`.
2. Fill `captions.json` with the verified timed speech. Group format:
   `{ "start": 0.3, "end": 1.5, "side": "right", "words": [{ "text": "spoken word", "emphasis": true }] }`.
3. Run `python build.py` and `npm run check`.
4. Run `node render-final.mjs`. The render script refuses final export while captions are empty.

Source media and rendering caches are excluded from Git. No environment configuration or HyperFrames site was published.
