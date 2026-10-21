// Round 1 option specs. Each section changes one thing; words and footage stay fixed within a section.
const w = (list) => list.map(([word, t, e]) => ({w: word, t, ...(e ? {e: true} : {})}));

// Word timings force-aligned to the audio.
const V = {the: 0.0, view: 0.11, youre: 0.4, paying: 0.55, for: 0.89, may: 1.17, not: 1.46, be: 1.71, the2: 1.85, one: 1.92, you: 2.14, keep: 2.24};
const A = {youre: 0, deciding: 0.23, people: 0.81, dont: 1.16, wanna: 1.34, hear: 1.53, from: 1.82, you: 2.08, before: 2.19, you2: 2.69, even: 2.9, reach: 3.28, out: 3.67};

const VIEW = [
  {t: 0, kick: w([['the', V.the], ['view', V.view], ["you're", V.youre]]), hero: [w([['paying', V.paying], ['for', V.for]])]},
  {t: V.may, kick: w([['may', V.may], ['not', V.not], ['be', V.be]]), hero: [w([['the', V.the2], ['one', V.one]]), w([['you', V.you], ['keep', V.keep, 1]])]},
];
const VIEW_KEEP = [
  VIEW[0],
  {t: V.may, kick: w([['may', V.may], ['not', V.not], ['be', V.be], ['the', V.the2], ['one', V.one], ['you', V.you]]), hero: [w([['keep', V.keep, 1]])]},
];
const APOL = [
  {t: 0, kick: w([["you're", A.youre], ['deciding', A.deciding]]), hero: [w([['people', A.people]])]},
  {t: A.dont, kick: w([["don't", A.dont], ['wanna', A.wanna]]), hero: [w([['hear', A.hear], ['from', A.from], ['you', A.you]])]},
  {t: A.before, kick: w([['before', A.before], ['you', A.you2], ['even', A.even]]), hero: [w([['reach', A.reach, 1], ['out', A.out, 1]])]},
];
const APOL_PHRASE = APOL.map((b) => {
  const all = [...b.kick, ...b.hero.flat()];
  const mid = Math.ceil(all.length / 2);
  return {t: b.t, kick: [], hero: all.length > 3 ? [all.slice(0, mid), all.slice(mid)] : [all]};
});

const CLIENT = {kick: '#F7F7F4', hero: '#F7F7F4', emph: '#73B3DC'};
const KICK = {family: 'InstrumentSans', weight: 600, vary: "'wdth' 100"};
const ANTON = {family: 'Anton', weight: 400};
const base = {clip: 'view_lush', dur: 3.4, beats: VIEW, colors: CLIENT, kick: KICK, hero: ANTON, place: 'lower', build: 'pair', emph: 'color', kickSize: 44};

export const ROUND = {
  title: 'Round 1: type, emphasis and grade',
  round: 1,
  intro: 'First pass at the base system, on the Magnetic footage. Every option uses the agent\'s own words, timed to his voice. Tap a card to watch it full size with sound, and turn on Safe zones to check the Reels interface. No sound design or music yet: that\'s round 2.',
  notes: [
    'Built from your brief: calm authority, left-aligned, words ease in on the voice (no pops or bounces).',
    'Client mode (Magnetic) unless a section says Carlos mode. Client text is soft white with Magnetic light blue #73B3DC as the one accent.',
    'All text sits inside the 4:5 grid crop and clear of the Reels buttons.',
    'Words are timed to the audio automatically; captions below cover only the first line of each video.',
  ],
  aspect: '9:16',
};

export const SECTIONS = [
  {id: 'r1-fonts', name: 'Fonts (client mode)', use: 'Same words, size, placement and colour. Only the display font changes. All free to use commercially; Druk and Bebas are kept for your own content.', order: 1},
  {id: 'r1-place', name: 'Placement', use: 'Same caption in Anton. Only the height of the block changes: top, middle or lower third, all left-aligned.', order: 2},
  {id: 'r1-build', name: 'Caption rhythm', use: 'How the words build up as he speaks. Same line, font, placement and accent. Only the rhythm changes.', order: 3},
  {id: 'r1-emph', name: 'Emphasis treatment', use: 'How the one key word ("keep") stands out. Same layout at head height, where Elsie puts her big words. Only the treatment on that word changes.', order: 4},
  {id: 'r1-yellow', name: 'Your emphasis yellow (Carlos mode)', use: 'Your own look: Druk hero in Bone, Bebas kicker in Porcelain, soft Ink scrim. Only the yellow on the emphasis word changes.', order: 5},
  {id: 'r1-grade', name: 'Colour grade', use: 'The same 3.4 seconds with no text, so you judge only the colour. Aiming for Elsie\'s warm, lush look.', order: 6},
];

export const CARDS = [
  // Fonts
  {id: 'r1-01a', section: 'r1-fonts', label: 'Anton', desc: 'Tall, heavy grotesque. The closest free match to Druk\'s weight.', props: {...base, hero: ANTON}},
  {id: 'r1-01b', section: 'r1-fonts', label: 'League Gothic', desc: 'Narrow and lighter. More words fit per line, quieter presence.', props: {...base, hero: {family: 'LeagueGothic', weight: 400}}},
  {id: 'r1-01c', section: 'r1-fonts', label: 'Oswald Bold', desc: 'Condensed but rounder and wider than Anton. Friendlier.', props: {...base, hero: {family: 'Oswald', weight: 700}}},
  {id: 'r1-01d', section: 'r1-fonts', label: 'Big Shoulders Display', desc: 'Condensed with squared corners. More architectural, a bit editorial.', props: {...base, hero: {family: 'BigShoulders', weight: 800}}},
  {id: 'r1-01e', section: 'r1-fonts', label: 'Archivo Condensed', desc: 'A clean grotesque squeezed narrow. Modern, less poster-like.', props: {...base, hero: {family: 'Archivo', weight: 800, vary: "'wdth' 62"}}},
  {id: 'r1-01f', section: 'r1-fonts', label: 'Archivo Expanded', desc: 'The same family stretched wide, like Druk Wide. Big on short words.', props: {...base, hero: {family: 'Archivo', weight: 800, vary: "'wdth' 125"}}},
  // Placement
  {id: 'r1-02a', section: 'r1-place', label: 'Top', desc: 'Block starts just under the Reels header, over the head and shoulders.', props: {...base, place: 'top'}},
  {id: 'r1-02b', section: 'r1-place', label: 'Middle', desc: 'Centred in the safe band, around chin and chest. Survives any crop.', props: {...base, place: 'middle'}},
  {id: 'r1-02c', section: 'r1-place', label: 'Lower', desc: 'Sits on the chest, just above the name and caption row.', props: {...base, place: 'lower'}},
  // Caption rhythm
  {id: 'r1-03a', section: 'r1-build', label: 'One word at a time', desc: 'Each word replaces the last at full size, like Elsie\'s single words.', props: {...base, clip: 'apol_lush', dur: 4.6, beats: APOL, build: 'word', wordSize: 190}},
  {id: 'r1-03b', section: 'r1-build', label: 'Kicker + hero pairs', desc: 'Small lead-in, then the big word, each easing in on the voice.', props: {...base, clip: 'apol_lush', dur: 4.6, beats: APOL, build: 'pair'}},
  {id: 'r1-03c', section: 'r1-build', label: 'Phrase blocks', desc: 'Each phrase lands whole in one even size. Calmest, least kinetic.', props: {...base, clip: 'apol_lush', dur: 4.6, beats: APOL_PHRASE, build: 'phrase', phraseSize: 120}},
  // Emphasis
  {id: 'r1-04a', section: 'r1-emph', label: 'Size only', desc: 'The key word is just bigger, in the same soft white. No colour at all.', props: {...base, beats: VIEW_KEEP, place: 'top', emph: 'none', heroMax: 330}},
  {id: 'r1-04b', section: 'r1-emph', label: 'Accent colour', desc: 'The key word in Magnetic light blue, the client\'s one accent.', props: {...base, beats: VIEW_KEEP, place: 'top', emph: 'color', heroMax: 330}},
  {id: 'r1-04c', section: 'r1-emph', label: 'Negative blend', desc: 'The word inverts whatever is behind it, like the emphasis words in Elsie\'s edit.', props: {...base, beats: VIEW_KEEP, place: 'top', emph: 'difference', heroMax: 330}},
  {id: 'r1-04d', section: 'r1-emph', label: 'Behind the agent', desc: 'The word sits behind him, tucked under his head, in the accent colour.', props: {...base, beats: VIEW_KEEP, place: 'top', emph: 'behind', heroMax: 330, behindFrames: 'cut/view_lush', behindCount: 82}},
];

const carlos = {...base, hero: {family: 'DrukSuper', weight: 900, tracking: '-0.015em', lh: 0.84}, kick: {family: 'Bebas', weight: 400, tracking: '0.08em'}, kickRatio: 0.18, kickSize: 46,
  scrim: 'linear-gradient(to top, rgba(20,18,15,.6) 0%, rgba(20,18,15,.25) 30%, rgba(20,18,15,0) 50%)', shadow: false};
for (const [k, hex, name, d] of [['a', '#FFFF00', 'Pure yellow #FFFF00', 'The exact colour you named. Loudest, most electric.'], ['b', '#FFD23F', 'Bright gold #FFD23F', 'A touch warmer and softer than pure yellow.'], ['c', '#E8B923', 'Mustard #E8B923', 'Classic mustard. Sits warmer on cream and skin.'], ['d', '#D4A72C', 'Deep mustard #D4A72C', 'Darker and more muted. The most premium, least shouty.']]) {
  CARDS.push({id: 'r1-05' + k, section: 'r1-yellow', label: name, desc: d, props: {...carlos, colors: {kick: '#F5F1EA', hero: '#E6DCCF', emph: hex}}});
}
for (const [k, clip, name, d] of [['a', 'view_orig', 'Ungraded', 'The footage as shot, for reference. Cool daylight, neutral skin.'], ['b', 'view_lush', 'Warm lush', 'Warmer mids, richer colour, gently lifted blacks. Closest to Elsie\'s. Used under every text option above.'], ['c', 'view_film', 'Soft filmic', 'Lower contrast, lifted blacks, muted colour and fine grain. Quieter, more cinematic.'], ['d', 'view_bright', 'Bright and clean', 'Brighter and crisper with only a little warmth. Airy, listing-photo feel.']]) {
  CARDS.push({id: 'r1-06' + k, section: 'r1-grade', label: name, desc: d, props: {clip, dur: 3.4}});
}
CARDS.forEach((c, i) => (c.order = i + 1));
