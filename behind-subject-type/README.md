# Large overlapping type behind subject

English placeholder typography preview using the original Main.mp4 footage and audio.

Tracking: -0.12em, font sizes: 270–485px, Inter heavy variable. Frame-edge cropping and overlapping glyphs are intentional. Text is placed in the background around the speaker’s head.

The supplied subject-mask.mp4 is a frame-by-frame MediaPipe Selfie Segmentation matte at 1080×1920, 30fps, 16 seconds. It is aligned to the uploaded Main.mp4. Original foreground footage is restored above the typography using a grayscale matte converted to identical RGB planes. Fine hair/ear edges remain dependent on automatic segmentation.

To re-render, put Main.mp4 next to index.html as source.mp4. Render this HyperFrames composition to background-type.mp4. Then composite:

```sh
ffmpeg -i background-type.mp4 -i source.mp4 -i subject-mask.mp4 -filter_complex "[0:v]format=gbrp[a];[1:v]format=gbrp[b];[2:v]format=gray,format=gbrp[m];[a][b][m]maskedmerge,format=yuv420p[v]" -map "[v]" -map 1:a:0 -c:v libx264 -crf 17 -preset medium -c:a copy -movflags +faststart -t 16 Main-behind-subject-overlapping-type.mp4
```

segmentation.py logic is included as segment.py for reference; paths must be adapted to your workspace if regenerating the matte.
