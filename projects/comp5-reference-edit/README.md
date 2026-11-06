# Comp 5 — Reference captions and camera motion

HyperFrames edit at **3840 × 2160, 30000/1001 fps**, using your supplied words. Captions end at **00:00:31:04** (frame 934; 31.1644667 seconds). The full source duration is retained: **2:27.6475**.

## Downloads

- **[Edited opening — 4K MP4](delivery/Comp-5-opening-4K.mp4)**: the complete captioned section, ready to download and watch. On the file page, click **Download raw file**.
- **[Full-length video download parts](delivery/)**: full-quality MP4 split into pieces to meet GitHub's 100 MiB file limit. Download every `.partXX` file and `Join-Full-Video.html`. Open the HTML file, select all downloaded parts, and save the joined MP4. Joining restores the exact MP4; it does not transcode it.
- The full-length MP4 is also available locally at `renders/Comp-5-reference-edit-4K.mp4` in the working environment.

## Treatment

Reference-1 guides the white sans-serif captions: regular connecting words, larger bold italic emphasis, short phrases, and quick word entrances. The exact font in the raster reference is unverified; bundled Liberation Sans provides an Arial-compatible approximation. Caption placement alternates into the free space beside the speaker.

Reference-2 guides the eased zoom-ins, pullbacks and lateral reframing. Camera emphasis follows the opening statements and the image, reputation, car, neighbors, relationship, and parents phrases. The camera returns to the source framing at the caption cutoff.

All later source edits remain intact. Video from the next source keyframe (frame 944) onward is copied without re-encoding. Only the ten-frame bridge between the subtitle cutoff and that keyframe is encoded. The full-length export uses the original audio stream unchanged.

## Source and reproduction

- `index.html`: full-length editable HyperFrames composition.
- `captions.json`: 29 timed phrase groups with per-word entrances and emphasis.
- `script.txt`: your exact supplied text, including spelling and punctuation.
- `words.json`, `alignment-raw.json`: forced-alignment timing from PocketSphinx.
- `camera.json`: editable camera keyframes.
- `DESIGN.md`: reference treatment and typography.
- `previews/`: exported-frame review stills.
- `validation.json`: export dimensions, frame counts and audio verification.

Download source media using `python download-source.py`. Then run `python build.py`, `npm run check`, and `node render-final.mjs`. The render uses HyperFrames 0.8.181 and requires Node.js 22+, Chrome and FFmpeg. If needed, point `HYPERFRAMES_BROWSER_PATH` to your installed Chrome executable. The short render is created in a temporary project; source and final delivery remain full length.

The supplied transcript is already aligned and checked in. To realign, install `alignment-requirements.txt`, run `python align.py`, then `python make-captions.py` and `python build.py`. No Hugging Face download or API key is required.

The full-length file can alternatively be joined and SHA-256 verified with `python delivery-join.py` after all download parts and `manifest.json` are in `delivery/`.

## Verification

The export contains exactly 4,425 frames on the source 29.97 fps grid. All 79 supplied words are retained in 29 non-overlapping caption groups; captions stop at frame 934. HyperFrames layout and contrast checks passed, and the complete MP4 decoded without errors. Original and exported audio hashes match. The first copied-tail frame matches the source pixel for pixel. Each download part has a SHA-256 checksum in the manifest.
