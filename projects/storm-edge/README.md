# STORM / EDGE

An original 24-second 2D rooftop fight, authored in HyperFrames with a 2D vector drawing engine and optional PixiJS 7.4.3 compositor. 1920 × 1080, 24 fps, stereo action SFX. The supplied character image guided the newly drawn bald peach head, expressive eyes, white vest, black gloves, flag shorts and sneakers. This is a simplified animated redraw, not the original image pasted onto a body.

The supplied Boxing vs Wrestling clip was used as a craft reference for setup, acceleration, contact, recoil and changing advantage. The finished movie contains no source video, source motion traces, dialogue or source soundtrack. The setting, poses, choreography, opponent, weapon sequence and sound design were created for this project. Sound effects are original procedural synthesis, not recorded Foley. No speech or background music.

## Download

- [1920 × 1080 MP4](../../videos/Storm-Edge-1920x1080.mp4)
- [Editable project ZIP](../../downloads/Storm-Edge-HyperFrames-Source.zip)

On GitHub, open the video and select **Download raw file**, or use the direct raw URL.

## Preview and render

Node 22+ and FFmpeg are required. All image and script dependencies are local.

```sh
npm run dev
npm run check
npm run render
```

If Chromium is installed but not detected, set `HYPERFRAMES_BROWSER_PATH` to its executable. Use the Studio URL printed by the preview command. Do not expect the source index.html to play itself; HyperFrames controls its paused timeline.

## Editing

- `fight.js`: authored pose keys, two-bone limb construction, character drawing, scenery, camera and deterministic effects.
- `index.html`: 24-second paused, registered HyperFrames timeline and independent audio track. The timeline's property setter redraws every seek, including seeks with callbacks suppressed.
- `make-sound.py`: reproducible stereo SFX construction (Python + NumPy).
- `sfx.wav`: finished SFX stem.
- `DESIGN.md`: palette and art direction.
- `SHOT-NOTES.md`: action timing, provenance and review limitations.

Every requested animation frame regenerates the vector geometry. Bone lengths are clamped; fast action uses short windups and quick contact transitions rather than constant smooth motion. The treatment remains stylised, and it is not motion capture. Rain, dust, sparks and camera emphasis are deterministic.

## Dependencies

- PixiJS 7.4.3 — MIT; license included.
- GSAP 3.14.2 — bundled library; see its [standard license](https://gsap.com/standard-license/).
- HyperFrames CLI 0.8.181 — pinned in package scripts.

No generated video model, stock footage, 3D renderer or external media runtime is used. HyperFrames owns time and audio. The default presentation displays the vector canvas directly for efficient software rendering. Adding `?pixi` to the source page uses the same surface through a PixiJS texture, without changing the artwork or choreography.
