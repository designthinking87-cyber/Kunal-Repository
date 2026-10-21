# My File — reference-style left captions

A complete 1920×1080, 29.97 fps HyperFrames edit of the uploaded `My File.mp4`, using the supplied Hindi/English transcript and the uploaded `My Reference.mp4` as the visual reference.

[Download the finished MP4](https://github.com/designthinking87-cyber/Kunal-Repository/blob/main/videos/My-File-reference-style-captions.mp4) — choose **Download raw file** on that page.

## Design

Heavy grotesque typography, tightly kerned Latin, properly shaped Hindi, pale lavender/white/blue reflections on large key words, and a soft layered dark shadow. Quick upward/scale settles and short fades match the reference's compact-to-large caption rhythm. The reference is a compressed video, so the font and layer settings are visually reconstructed rather than recovered from an original project.

All captions live in the empty left area; no banner or box is added. The original speaker, framing, color and audio are preserved. Hindi uses Noto Sans Devanagari variable 850–900; English uses Inter Black variable. Local fonts, GSAP and licenses are included. Hindi tracking is deliberately less negative than Latin to protect vowel marks and conjunct shaping.

The opening greeting is a prominent two-line visual hook. The childhood/story words then become the emphasis points. One caption group is visible at a time.

## Edit and render

Requires Node.js 22+, FFmpeg, and Chrome/Chromium. Free dependencies only.

```bash
npm run check
npm run dev
npm run render
```

If Chrome is not found automatically, set `HYPERFRAMES_BROWSER_PATH` to the installed browser executable. `npm run render` invokes pinned HyperFrames 0.8.181, then copies the original AAC voice track into the final MP4 without re-encoding it. Output: `renders/My-File-reference-style-captions.mp4`.

`index.html` is the editable HyperFrames composition. `build.py` regenerates it from the phrase definitions, along with `transcript.json`. After changing those definitions, run `python3 build.py` then the checks and render. `DESIGN.md` documents the layout, shadow, tracking and motion decisions.

Source video and all local dependencies used by the composition are included. No dependency on earlier spiritual reel projects.
