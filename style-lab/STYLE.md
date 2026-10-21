# Style: Carlos Lantigua (@realcarloslantigua)

## Source brand system (brand-system.html, v1.0)
- **Colours:** Bone #E6DCCF (signature: hero type, wordmark) · Porcelain #F5F1EA (small text on busy footage) · Ink #14120F (grounds, scrim, shadow) · Ash #7C7266 (metadata, secondary) · Sand #C9BBA8 (type depth) · Espresso #3B322A (web CTA only, never on a cover).
- **Display:** Druk Super, all caps, with a width ladder: Wide Super for one short word, Super for one or two words, Condensed for one long word, XCond for a long line. Always edge to edge, never mix widths inside a word.
- **Support / kicker:** Bebas Neue (OFL), tracked +0.08em, about 18% of the hero size.
- **Cover recipe:** 1080×1350, warm-graded footage, ink scrim from the anchored edge, one left-aligned block (kicker, hero, optional label), same block position across a series.
- **Don't:** a second accent colour on a cover, centred blocks, mixed Druk widths in one word, pure #000 or #FFF, a kicker as big as the hero.
- **Font licence:** the Druk files are Commercial Type *trial* cuts. **Decision: the Druk + Bebas combo is Carlos's personal look only** (Druk trial cuts: fine for previews; license before publishing at scale). Client work never uses Druk or Bebas, and any free font (OFL or similar) is fair game there.
- Fonts extracted to `brand/fonts/` for rendering.

## The brief
1. **For:** client work and Reels. Clients are real estate agents at a brokerage and creators in the Cornerstone cohorts. A base system adapted per client: fixed structure, motion and sound, with swappable colour, font and logo.
2. **Where / shape:** Instagram only for now. Build at 9:16 (1080×1920) for Reels. All text stays inside the 4:5 grid crop (y 285–1635) *and* the Reels safe zone, so the usable band for text is roughly y 285–1479 on the left side. 4:5 carousels are welcome as a secondary scope.
   - Placement must be tested: top / middle / lower, all left-aligned (centred only if asked).
3. **Audience and first second:** viewers of agents' Reels (buyers, sellers, locals scrolling) and Cornerstone creators' followers. The same first second for both: it stops the scroll and signals authority. "This looks premium", "I need to stop and read this", "this person knows their market".
4. **References** (in `refs/`, my read, to confirm):
   - **ref1, Ken Tjandra** ("where I want to get to"): a fully Claude-edited talking head. Clean UI cards animate in the top third and explain what he's saying (timeline, phone mockup, a checklist with strike-throughs, a typed prompt box, a before/after grade slider, a list of captions, a grid recap). One-to-three-word captions sit in a solid pill under the face. A follow card with a hand-drawn circle at the end. The grade is tinted to match his brand colour.
   - **ref2, @edita.visuals** ("depth of effects"): text *behind* the subject (cut-out depth), one keyword per beat in an italic serif with a glow highlight, split screen with B-roll on top and speaker below, phone/UI mockups, floating icons, soft gradient scrims, small-to-big word pairs.
   - **ref3, real estate (@_k.elsie)** ("best RE edit so far"): word-by-word captions that follow her head, small lead-in plus big emphasis word (the same idea as Carlos's kicker plus hero), big words that tuck behind her, proof cards popping in (press photo, magazine cover, a fan of client-family photos, a map pin for "relocating", a home-photo grid), a big stat ("closed over $10 MILLION"), warm natural grade, walk-and-talk on property.
   - **What Carlos loves:** the effects, kept subtle. Gentle punch-ins and a steady reframe that keeps the subject centred (ref3). Graphics and words that live *in* the shot or *behind* the subject, not split screens or boxes stacked on top. The colours in ref3 are "AMAZING": mainly **the grade** (warm, lush greens, creamy skin, soft contrast), so test it as a colour-grade section. He also likes ref3's **negative/difference blend** on emphasis words (the text inverts against the footage) and its coloured emphasis words, so test those as emphasis treatments.
5. **Never** (anti-reference: `refs/never-explainer-panel.mp4`, an earlier edit made with Claude that "clearly says AI"):
   - Charcoal-to-black gradient panels with gold/champagne accents (the "luxury dark mode + gold" look).
   - A serif headline with one italic gold word ("The *Magnetic* Agent Assessment").
   - Tiny, widely tracked uppercase eyebrow labels above everything ("LISTINGS SENT", "WHAT TO SEND INSTEAD").
   - Rounded, glassy cards with hairline borders and soft glows, numbered pill bullets, dimmed "inactive" list rows.
   - A sparkline chart with a glowing end dot.
   - Splitting the screen: a graphic panel on top with the speaker shrunk into a rounded box underneath.
   - Small, plain, centred white captions that carry no emphasis.
   - In general: anything that reads as a template or a dashboard rather than as part of the shot.
   - No emojis. Nothing cheesy: ref3 is the bar for premium.
   - More to come as Carlos spots them.

6. **Assets on hand:**
   - Carlos: name, colours and fonts from the brand system (`brand/`). No separate logo file yet.
   - **Test client: Magnetic** (brokerage), logos in `clients/magnetic/` (Standard and Horizontal × FullColor / White / AltWhite). Logo colours sampled: navy ~#1E1B5E, mid blue ~#0B72BA, light blue ~#73B3DC. Wordmark is a rounded geometric sans, lowercase "magnetic" with a magnet-shaped "m" mark.
   - **Footage** in `footage/` (2160×3840, 23.976 fps, already cut with jump cuts and some punch-ins, ready for captions and effects): an agent from Magnetic, the same agent as in the anti-reference.
     - `apologizing-for-reaching-out.mp4` (34 s, living room and kitchen)
     - `highest-offer.mp4` (41 s, seated at a kitchen counter, low angle)
     - `view-you-pay-for.mp4` (34 s, standing in a bright room by a framed painting)

   - Magnetic accent (proposed, to test): light blue #73B3DC.
7. **Motion:** like Elsie's (ref3): **calm authority, not performative, forced social content.** Smooth, filmic easing; gentle punch-ins; a steady reframe that follows the subject; words ease in rather than pop, bounce or shake. Nothing hyperactive.
8. **Sound:** "felt more than heard" mixed with cinematic. Quiet, short textures under transitions and card landings (soft whooshes, ticks) that you sense rather than notice, plus a few restrained cinematic moments (a low impact or a short riser) saved for the big beats: a key stat, a proof card, the hook. Never cheesy (no dings, no cartoon whooshes).
   - **Music: yes, underneath**, but tailored to what's seen and heard, never performative. Source to settle at round 2: no music yet and no generator, and the library has no music beds.
9. **Build first (round 1, on the Magnetic footage, client mode unless marked):** captions (word-by-word kicker and hero pairs, placement top/middle/lower), emphasis treatments (yellows, negative blend, text behind subject), colour grade (Elsie-style looks), fonts (free display faces for clients; Druk + Bebas for Carlos mode only). Round 2: proof cards, punch-ins and reframe, sound and music.

**Pipeline notes:** Remotion for motion, ffmpeg for audio. Person cutout with rembg (u2net_human_seg) works. huggingface.co is blocked on this work machine, so no Whisper here: use the offline pocketsphinx recognizer for a rough pass, or force-align to Carlos's scripts for exact captions.

**Two palette modes. Every round and every option states which one it uses:**
- **Carlos mode** (his own content): Bone titles, Porcelain captions, yellow emphasis, Ink scrims.
- **Client mode** (agents, Cornerstone creators): the client's own colours and fonts. Only the structure, motion, placement, grade approach and sound carry over, plus one accent colour per client in the emphasis role. Bone and Porcelain are *not* assumed.
   - Emphasis-colour round: #FFFF00 vs bright gold ~#FFD23F vs mustards ~#E8B923 / ~#D4A72C, all on the same caption and the same footage.
   - **Colour roles (Carlos's own content):** Bone for titles/hero, Porcelain for captions, a yellow for caption emphasis (he said #FFFF00 "mustard yellow vibe"; #FFFF00 is pure yellow, so test it against mustard tones). This deliberately overrides the brand guide's "no second accent" for captions.
   - **Clients:** one accent colour per client, swapped into the emphasis role.

## Rounds
- **Round 1** (Magnetic footage): fonts, placement, caption rhythm, emphasis treatment, Carlos's yellow, colour grade. 24 options. Specs in `motion/round1.mjs`, renders in `renders/r1/`.
  - Result: kept pairs, behind-subject and ungraded; Maybe on Anton, Oswald, top and lower; 17 unrated; no notes.
- **Round 2** (Magnetic footage, all on the locked base): Anton vs Oswald Bold/SemiBold; top vs lower vs lower-with-key-beat-up; depth effect pushed (accent vs white, ghosted, bigger, every hero word behind); pair timing (round 1, slower/softer, hero lands whole, beats lift away); camera (locked off, slow 6% push, 10% punch on the key word, steady follow at 112%); sound on the key word from EAR CANDY (Soft Wipe, Short foley Hit Deep, Whoosh Rise, Cinematic Whoosh Impact, Tension Small Riser + Hit Deep), each trimmed and faded, peak-normalised, mixed low under the voice with the master limited below -1 dB. Specs in `motion/round2.mjs`.
  - Result: Keeps on almost every option, so this is a toolkit, not one winner per job. Dropped the low thump alone. No notes.
- **Round 3**: negative blend placed better (in front, behind him, bigger, every hero word); first proof card, "$50,000 more" (behind him, counts up, negative blend, paper card); where the kept sounds go (key word only, every big word, air then cinematic hit, air then riser); Carlos mustard (#E8B923, #DDB028, #D4A72C). 20 locked tools shown on the page. Specs in `motion/round3.mjs`.
  - Result: blend behind him, proof behind him, count-up, proof blend, soft air on key word, mustard #E8B923 kept. Paper card and air-then-hit were Maybes. Thump rejected. 9 notes.
- **Round 4** (fixes from round 3 notes): blend behind him (reference, bigger, every hero word, small-and-away exception); count-up proof (accent, green #4BC27D, negative blend behind, soft white); paper card re-placed (round 3 spot, tucked behind him, small and clear of his head, behind him and counting); riser into the key word (soft air ref, riser into cinematic hit, riser alone, riser into a quieter hit); Carlos yellow (#E8B923, #F4C41F, #FFCE1B). Specs in `motion/round4.mjs`.
  - Result: nearly everything kept (blend behind ×3, count-up ×3, card behind ×2, riser ×3, both yellows). Maybes: small blend placement, soft-white count-up. Overall: text can be centred when applicable.
- **Round 5** (layout only): small negative blend in the lower third (left, centred) and middle (centred); centred text (top behind him, middle, lower) against the locked left version. Specs in `motion/round5.mjs`.

## Locked
- **Caption rhythm: kicker + hero pairs** (r1-03b). Small lead-in words, then the big hero word, each easing in on the voice (0.3 s, brand reveal ease), the beat swapping out as the next begins.
- **Emphasis: behind the subject** (r1-04d). The key word sits behind the speaker via a per-frame person cutout.
- **Grade: ungraded / natural** (r1-06a). Carlos picked the footage as shot over warm lush, soft filmic and bright clean. Don't add a look by default.

## Rejected
- **Short foley Hit Deep (the thump), in any role**: dropped alone in round 2; in round 3 "the hit doesn't work for me here" after the riser. Out unless Carlos asks.
- **Negative blend covering the speaker** (r3-01c, bigger in front): "the fact it's blocking him and not behind is what doesn't work."
- **Low thump on its own** (Short foley Hit Deep alone under the key word), round 2. No reason given. It's still allowed as the landing inside "riser into thump", which was kept.

## Not picked in round 1 (unrated, not rejected)
League Gothic, Big Shoulders, Archivo Condensed/Expanded; middle placement; one-word-at-a-time and phrase-block rhythms; size-only, accent-colour and negative-blend emphasis; all four yellows (Carlos mode); warm lush, soft filmic and bright clean grades.

## Locked in round 2 (the toolkit: several options per job, to be chosen per client and per moment)
- Fonts: **Anton**, **Oswald Bold**.
- Placement: **top**, **lower**, **lower with the behind-him beat moved up to the head**.
- Depth: behind him in the **client accent**, **bigger**, and **every hero word behind**.
- Timing: **word by word on the syllable** (0.3 s), **hero lands whole**.
- Camera: **locked off**, **slow 6% push**, **soft 10% punch on the key word** (0.33 s ease), **steady follow** (112%, head re-centred each frame).
- Sound: **Soft Wipe** (soft air) under the key word, **Cinematic Whoosh Impact** on the key word, **Tension Small Riser into Short foley Hit Deep**.
- Carlos mode: **mustard** for emphasis (shade to settle in round 3).

## Maybes from round 2
Soft white behind him (no accent colour); beats lifting away. Unrated: Oswald SemiBold, ghosted, slower/softer timing, deep swell.

## Locked in round 3
- **Negative blend goes behind the speaker** (r3-01b). Rule from Carlos: "negative should always go behind unless it's small/different placement."
- **Proof numbers behind him** (r3-02a) and **counting up** (r3-02b, "LOVE this. very interactive"). Money may use **green**.
- **Proof number in negative blend** (r3-02c), better behind him.
- **Sound default: soft air (Soft Wipe) on the key word only** (r3-03a, "can't go wrong with this").
- **Carlos mustard: #E8B923** ("feels good"). Carlos also named **#FFCE1B**, "less deep and more movie subtitle yellow", to compare.

## Locked in round 4
- Negative blend behind him: standard, **bigger** ("I like this"), **every hero word** ("I like this").
- Count-up proof: **client accent**, **green #4BC27D**, **negative blend behind him**.
- Paper card **tucked behind him** ("feels right"), and **tucked behind him, counting** ("this feels great").
- Sound: **riser into cinematic hit**, **riser alone**, **riser into a quieter hit**.
- Carlos yellows: **#F4C41F** and **#FFCE1B** (both kept; #E8B923 kept in round 3).
- Overall note: "text doesn't ALWAYS have to be locked left. It can be in the middle of the screen when needed/applicable." This overrides the brand guide's "never centre" when it serves the shot.

## Maybes from round 4
- Small negative blend: "would work small somewhere else on screen, maybe lower thirds or middle, not there" (not on the wall above his shoulder).
- Count-up in soft white: "not crazy about it but a good option for backup."

## Maybes from round 3
- Paper card: "like the concept, not the placement."
- Air then cinematic hit: "I don't like the air. Maybe rise into cinematic hit."

## Notes from Carlos
- Round 2: the negative blend "wasn't bad". He didn't keep it in round 1 only because of where it sat; wants it placed better (behind him / better spot).

## RULES (for anyone editing in this style)

These cover everything locked so far. Frame: 1080×1920, 24 fps, Instagram Reels. "Client mode" uses the client's colours; "Carlos mode" is Carlos's own content.

### Layout
- **Text band:** x 91–881 (790 px wide), y 285–1479. That keeps text inside the 4:5 grid crop and clear of the Reels header, buttons, name and caption.
- **Placements:** *top* (block starts at y 300, head height), *lower* (block ends at y 1460), or *lower with the behind-the-speaker beat moved up to the head*. Pick per shot: words behind the speaker only read where the speaker is narrow (the head).
- **Alignment:** left-aligned by default. Centred is allowed when the shot calls for it (round 5 is testing where).
- **Footage:** natural, no grade. Never add a "look".

### Type
- **Rhythm:** kicker + hero pairs. A small lead-in (the kicker), then the big word or words (the hero). One beat on screen at a time; each beat replaces the last.
- **Client mode:**
  - Kicker: Instrument Sans SemiBold, uppercase, +0.08em, 44 px, #F7F7F4.
  - Hero: **Anton** or **Oswald Bold**, uppercase, -0.005em, line-height 0.9, #F7F7F4.
  - Shadow: 0 2px 24px rgba(0,0,0,.28).
- **Carlos mode:**
  - Kicker: Bebas Neue, uppercase, +0.08em, 46 px, Porcelain #F5F1EA.
  - Hero: Druk Super, uppercase, -0.015em, line-height 0.84, Bone #E6DCCF.
  - Emphasis: yellow **#F4C41F** or **#FFCE1B** (#E8B923 also kept).
  - No shadow.
- **Hero size:** scaled so the longest hero line fills 790 px, capped at 330 px for a single word ("bigger": up to 460 px across 900 px).
- **Fonts never used:** Druk and Bebas in client work (Druk is trial-licensed; license it before paid publishing).

### Colour
- **Client mode:**
  - Text is soft white #F7F7F4.
  - The client gets **one** accent colour, used only on emphasis words. Magnetic: light blue #73B3DC.
  - Money may use green **#4BC27D**.
  - Soft white emphasis is the backup.
- **Never** a second accent, pure #000 or #FFF on Carlos's covers, emojis, or dark-mode + gold.

### Motion
- **Word entrance:** each word arrives on its spoken syllable over 7 frames (0.29 s), easing `cubic-bezier(.16,.84,.32,1)`. It rises from +0.16 em and un-blurs from 8 px. Variant: the hero lands whole on its first word.
- **Beat exit:** 5 frames (0.21 s), fade plus a 0.06 em lift.
- **Never** pop, bounce, shake or glitch. Calm authority.

### Depth (the signature)
- The **key word sits behind the speaker** (per-frame person cutout). Options: in the client accent, bigger, or every hero word behind.
- **Negative blend** (`mix-blend-mode: difference`, white text) **always goes behind the speaker**, unless it's small and placed away from him (where it works is still being tested).

### Proof moments
- **Numbers count up** from 0, starting on the first spoken digit and finishing about 0.2 s after the unit word ("dollars"). They sit behind the speaker, in the accent, green (money) or negative blend.
- **Paper card:** #F7F7F4 card, client-navy text (Magnetic #1E1B5E), 3 px radius, -2.5° tilt, soft drop shadow. It rises 60 px over 10 frames and is **tucked behind the speaker** like a print on the wall. It can count up on the card.

### Camera
- Choose per moment:
  - **Locked off:** the default.
  - **Slow push:** 6% across the clip.
  - **Punch on the key word:** 10% over 8 frames.
  - **Steady follow:** 112%, re-centring the top of the head at (540, 430) every frame.
- The footage and the cutout move together; the text stays still.

### Sound (all from EAR CANDY; trim, 5 ms fade in, 150 ms fade out, master never above -1 dB)
- **Default:** *Soft Wipe* (soft air) peaking on the key word only, about 15 dB under full scale. "Can't go wrong."
- **Big beats** (hook, stat, proof):
  - *Tension Small Riser* (1.2–2.95 s of the file) building into the key word, either **alone** or **into Cinematic Whoosh Impact** (normal, or 6 dB quieter).
  - *Cinematic Whoosh Impact* alone on the key word also works.
- **Never:** the thump (*Short foley Hit Deep*) in any role; soft air as a lead-in to a hit; dings, cartoon whooshes, anything performative.
- **Music:** wanted underneath and tailored to the moment, but not yet sourced.

### Suggested usage (to confirm with Carlos)
- Hook line: top placement, key word behind the head, riser into the hit, slow push.
- Ordinary key words: lower placement, soft air, locked off or steady follow.
- Stats and proof: count-up behind the speaker or on the tucked-behind card, riser alone, punch on the number.

## Open questions
- Round 1 pattern: depth and natural footage over added treatments (grades, colour emphasis and blend all went unpicked), despite loving Elsie's grade. Is the accent colour still wanted for clients at all?
- Carlos-mode yellow: answered, mustard. Round 3 picks the exact shade.
- Music: Carlos has no generator, and Claude has none here either. Options offered: add music in Instagram, download free-library tracks himself, or a simple ambient pad synthesised in code.
- Mixed signal on soft air: kept on the key word alone, but "I don't like the air" when it led into the cinematic hit. Working read: air is fine as the only sound, not as a lead-in.
- Exact captions for the full videos need the scripts or Whisper (huggingface.co is blocked here).
- Magnetic accent: light blue #73B3DC is proposed, not confirmed.
