# Karma — complete editorial YouTube Short

A complete **24.333-second, 1080 × 1920, 30 fps** edit made in **Motion Canvas 3.17.2** using the original clean `Comp 3_2.mp4` and the supplied Hindi transcript. Original narration plays from the beginning without cuts, reordering, replacement, or speed changes.

[Download the finished MP4](../../videos/Karma-MotionCanvas-complete-editorial.mp4)

Preview frames: [opening hook](previews/opening-hook.png), [circular face reveal](previews/face-reveal.png), [cycle explanation](previews/cycle-explanation.png).

## Edit structure

| Time | Treatment |
| --- | --- |
| 0–3s | Full-screen editorial Hindi hook. No face. A protective gold circle transforms into a question mark. Original narration starts immediately. |
| About 3s | The circle expands to reveal the original speaker. |
| 3.24–4.67s | Talking head with speech-based phrase captions. |
| 4.67–6.57s | Brief full-screen compassion typography, following “तब भी भगवान / इतने दयालु हैं.” |
| 6.57–9.6s | Talking head, captions, and one restrained push-in on “छोड़ते नहीं हैं.” |
| 9.6–12.3s | A steady companion light and human silhouette above the face, with the current caption below. |
| 12.3–15.87s | A luminous seed travels and transforms into a human silhouette during the human-birth explanation. |
| 15.87–17.53s | Return to the face. “जैसे ही हम” sets up the progressively revealed “मनुष्य बनते हैं.” |
| 17.53–20.1s | Talking head and captions; smoky ribbons obscure the supporting figure while the companion light stays visible. |
| 20.1–22.73s | Full-screen भूल → दुःख → सवाल explanation, built one node and connecting path at a time. |
| 22.73–24.33s | Return to the speaker for the original concluding question, echoing the opening typography. |

The opening question is an editorial introduction, not newly generated narration. Later captions use meaningful phrases from the actual supplied speech. Typography uses bundled, correctly shaped Devanagari regular/bold fonts, ivory and selective gold, a soft lower-chest contrast scrim, and no generic subtitle boxes.

## Editable source and assets

- `src/scenes/film.tsx`: the complete Motion Canvas composition, including native video, masks, typography, captions, silhouettes, curves and diagrams.
- `src/project.ts`: Motion Canvas project, with the original source audio available for editor playback.
- `transcript.json`: the supplied transcript and frame-based timing converted to seconds.
- `public/source.mp4`: the original clean footage, preserved without modification.
- `public/fonts/`: both Devanagari font weights and their license.
- `DESIGN.md`: visual identity and motion direction.
- `previews/`: three frames from the rendered composition.

Earlier edits and projects are preserved. This project runs independently of HyperFrames and Remotion. FFmpeg only encodes Motion Canvas's rendered frames and muxes the untouched original AAC audio. No music, paid API, purchased assets, or externally hosted renderer is required.

## Preview and render

Requires Node 22+, FFmpeg, and Chromium/Chrome.

```sh
npm ci
npm start
```

Open the local address shown by Vite to edit and preview the Motion Canvas project. It defaults to portrait 1080 × 1920 at 30 fps. Settings are stored inside the project so a writable global home directory is not required.

To export:

```sh
npm run typecheck
npm run render
```

Set `CHROME_PATH` if Chrome is not `/usr/bin/chromium`. The render script starts a local Vite server, waits for both Hindi font weights, uses Motion Canvas's official Renderer/ImageExporter for all **730 frames**, checks that the sequence is complete, and produces `renders/Karma-MotionCanvas-complete-editorial.mp4`. The original audio is stream-copied, not re-encoded. Temporary frames and installed dependencies are excluded from Git.
