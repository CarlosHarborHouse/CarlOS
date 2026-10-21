# Style Lab

A round-by-round process for building Carlos Lantigua's motion and sound style for Instagram Reels. It covers his own content and client work (Magnetic agents, Cornerstone creators).

- **`STYLE.md`**: the brief, every round's verdicts, and the **RULES** section (fonts, sizes, colours, timing, depth, proof cards, camera, sound, the never list). Start here.
- **`style-lab.html`**: the review page. It's published as a claude.ai artifact with the `db`, `user` and `assets` capabilities; rounds are loaded into its database.
- **`SOUND-LIBRARY.md`** / **`sound-library.json`**: an index of the EAR CANDY sound library (names, lengths, groups). The audio itself is not in this repo.
- **`motion/`**: the Remotion project that renders every option.
  - `src/index.jsx`: one `Card` composition. It handles kicker + hero captions timed per word, text behind the speaker (per-frame cutouts), negative blend, count-up numbers, paper cards, camera push/punch/follow, and left or centred layout.
  - `round1.mjs` … `round5.mjs`: the option specs for each round.
  - `render.mjs`: renders a round's specs to a full MP4 with sound plus a small muted preview. It mixes library sounds under the voice (trim, fades, peak-aligned to the word, master ≤ -1 dB).
  - `prep.sh`: cuts and grades the source clips. `cutout.py`: per-frame person cutouts (rembg `u2net_human_seg`). `track.py`: head position per frame, for the steady follow.

## Not in this repo (on purpose)

This repository is public, so none of these are included:

- **The EAR CANDY sound library** (licensed pack; Carlos's rule is never to copy it anywhere).
- **Client footage and Magnetic logos.**
- **Druk fonts** (Commercial Type trial cuts, not redistributable) and Bebas Neue (free, but tied to the brand file).
- **Reference reels** from other creators.
- **Renders, cutout frames and `node_modules`.**

To render again, place them locally as:

- `sfx/`
- `footage/`
- `clients/`
- `motion/public/fonts/`
  - Anton, League Gothic, Oswald, Big Shoulders Display, Archivo and Instrument Sans come from github.com/google/fonts, under the OFL.
  - The Druk files come from the brand file.

Then run:

```bash
cd motion && npm install
bash prep.sh                                # from the folder that holds footage/ and motion/
python3 cutout.py public/clips/view_orig.mp4 public/cut/view_orig
python3 track.py public/cut/view_orig 66
node render.mjs round5.mjs ../renders/r5
```

Rendering uses the headless Chromium path set in `render.mjs`; change it for your machine.
