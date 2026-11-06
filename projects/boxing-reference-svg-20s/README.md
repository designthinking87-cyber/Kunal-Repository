# Boxing vs Wrestling — supplied-character SVG match, first 20 seconds

1920 × 1080 · 22 fps · 20.000 seconds · 440 editable SVG frames.

This version follows **0:00–0:20 of the user-provided reference**, preserving its sequence, camera, original pose cadence, grey set, dark-red opponent, source effects and source lettering. The light-red fighter is replaced with a pose-fitted vector redraw of the user's bald character with peach face, large eyes, white vest, black limbs/gloves and flag shorts. This is the requested source-matching version; the earlier original rooftop fight is a separate project.

## Downloads

- [1920 × 1080 MP4](../../videos/Boxing-Reference-Match-20s-1920x1080.mp4)
- [Complete editable project ZIP](../../downloads/Boxing-Reference-Match-20s-HyperFrames-Source.zip)

## What is newly authored and what comes from the source

The source animation is credited on screen to **DartAnimates**. Its poses, set, opponent, camera, shadows, smears and other visible source elements were traced into vector paths from each of the first 440 source frames. These are **source-derived reconstructions**, not a claim that the underlying choreography is newly invented. There is **no source video plate, embedded bitmap or raster frame inside the SVG animation**.

The replacement face, vest and flag-short geometry are newly authored for the supplied character and fitted to the source poses. Source silhouettes and occlusion masks retain the original action; the replacement does not rely on a new generic fighting rig. Source compression, blur and occlusion mean tracing and fitted clothing/face details are approximate. This is not a pixel-identical copy of the reference. The 720p source's camera and framing are scaled to the requested 1080p canvas rather than inventing new picture detail.

## Sound

The fight effects come from the supplied reference, at their original timestamps. This is not newly synthesized Foley. Per the user's explicit choice, dialogue intervals are muted. Retained intervals are 0:00–0:04.25, 0:05.35–0:08.00 and 0:10.88–0:20.00, with 12 ms boundary fades and a small peak-headroom gain reduction. This removes any sounds mixed with the excluded dialogue windows as well. No new voice or music was generated. `audio-cues.json` records the intervals.

## Preview / edit / render

Node 22+ and FFmpeg are required. JavaScript libraries and render assets are local.

```sh
npm run dev
npm run check
npm run render
```

HyperFrames prints its Studio URL. The paused source page is not a standalone video player.

- Edit any file in `frames/0000.svg` through `frames/0439.svg` using a vector editor or text editor.
- Run `npm run build` to regenerate `frame-data.js` after editing individual SVG frames.
- Render with `npm run render`. Keep 22 fps to preserve source cadence exactly.
- `index.html` uses the MIT-licensed **SVG.js 3.2.5** library to swap vector geometry on a deterministic paused HyperFrames/GSAP timeline.
- `frame-map.json` records source time and fitted head/torso coordinates per frame. Occluded or offscreen frames may have no head fit.
- `manual-tracking-corrections.json` records individually reviewed detector corrections.
- `DESIGN.md`, `trace-settings.json`, `audio-cues.json` and `verification.json` record the production choices and measured checks.

If Chromium is installed but not detected, set `HYPERFRAMES_BROWSER_PATH` to its executable. All source-dependent audio needed for playback is already included; the original video is not needed to preview or render this project.

## Review limits

Source and reconstruction contact frames, fast-throw head tracking, guard/face occlusion, overlapping fighters and SVG seeking were inspected. Full-speed human playback and a listening audition were not available in this tool interface. Sampling, metadata and deterministic seeking do not certify a perfect match or a complete audio review. Please treat this as the requested **first 20-second review section** before extending the sequence.

## Dependencies and credits

- HyperFrames CLI 0.8.181, pinned in scripts.
- SVG.js 3.2.5, MIT; bundled license included.
- GSAP 3.14.2; [standard license](https://gsap.com/standard-license/).
- User-provided Boxing vs Wrestling reference, credited on screen to DartAnimates.
- Character design from the user's supplied image; vector redraw/fitting created for this adaptation.

## Optional retracing tools

`tools/` includes the authored tracing, character fitting and audio-preparation code. Main playback/rendering needs none of these Python packages. To retrace from the exact supplied source, install `tools/requirements.txt`, decode its first 20 seconds to `trace-work/source-frames/0001.png` through `0440.png` with FFmpeg without changing its 22 fps cadence, then run `python tools/track-reference.py` and `python tools/trace-and-fit.py`. The saved manual corrections are applied to the exact same source frames. For audio, decode the first 20 seconds to stereo PCM `trace-work/source-audio.wav` and run `python tools/prepare-audio.py`. Retracing a different source requires a new tracking/occlusion review.
