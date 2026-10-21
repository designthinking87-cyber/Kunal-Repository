# भगवान साथ हैं… फिर दुःख क्यों?

A separate 15-second, 1080 × 1920, 30 fps Three.js cinematic insert. The uploaded original video is preserved in `assembly/source.mp4`.

## Deliverables

- [15-second silent cinematic](../../videos/Karma-ThreeJS-cinematic-15s.mp4) — golden companion light, mist, elevated circular-path reveal with भूल / दुःख / सवाल, return to the companion, and the closing question.
- [Full Short with original narration](../../videos/Karma-ThreeJS-narrated-short.mp4) — 24.333 seconds, preserving the entire original voice track. The first 9⅓ seconds show the speaker; the cinematic covers the remainder with a .45-second dissolve.
- [Opening preview](previews/opening.png), [circular-path reveal](previews/reveal.png), [companion preview](previews/companion.png).

The standalone insert is intentionally silent, leaving room for narration. No purchased assets, stock footage, paid API, or externally hosted rendering is used. The figure is symbolic and faceless; the gold light is not a deity depiction.

## Edit and preview

`scene.js` contains geometry, materials, shader water, seeded mist and particles, walking pose, companion light, travelling gold path pulse, camera choreography, and projected Hindi gate labels. `scene.html` contains the crisp Hindi overlay. `renderAt(seconds)` completely determines each frame.

Run `python3 -m http.server 8000` in this directory, then open `http://localhost:8000/preview.html` to play or scrub. Edit `scene.js`, `scene.html`, and `DESIGN.md` as needed. Fonts and Three.js are bundled locally with their licenses.

`assembly/index.html` is the editable HyperFrames timeline, including the original video, cinematic insert, original audio, and dissolve. It can be opened in HyperFrames Studio. The source video is not overwritten.

## Render

Requires Node 22+, FFmpeg and Chromium/Chrome. Run `npm install`, then `npm run render`. Set `CHROME_PATH` if Chrome is not at `/usr/bin/chromium`. The render script starts its own asset server, waits for fonts and scene readiness, captures 450 deterministic frames, and exports with FFmpeg. The FFmpeg assembly follows the same timing as `assembly/index.html`. `npm run check` runs HyperFrames checks on the assembly. Software WebGL can take several minutes.

## Insert into another edit

Place the silent 15-second animation on a video track above your footage and keep the existing narration underneath. The supplied example begins it at **00:09.333**, adds a **0.45-second dissolve**, and ends at **00:24.333**. Move or retime it for a different narration edit. Do not speed up the spoken track merely to fit the animation.

## Implementation notes

Water reflections and haze are lightweight procedural approximations, not physically simulated water or volumetric fog. Soft sprite glow provides the light halo. Hindi labels use browser shaping and crisp screen-space text for readability. The final audio is copied from the uploaded video without narration edits.
