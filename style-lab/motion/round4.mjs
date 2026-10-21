// Round 4: fixes from round 3's notes. Blend always behind, money counts up (green allowed), paper card re-placed,
// riser into cinematic hit, mustard vs movie-subtitle yellow.
const w = (list) => list.map(([word, t, e]) => ({w: word, t, ...(e ? {e: true} : {})}));

const V = {the: 0.0, view: 0.11, youre: 0.4, paying: 0.55, for: 0.89, may: 1.17, not: 1.46, be: 1.71, the2: 1.85, one: 1.92, you: 2.14, keep: 2.24};
const O = {fifty: 0.74, thousand: 1.13, dollars: 1.48, more: 1.8};

const VIEW = (allHero) => [
  {t: 0, kick: w([['the', V.the], ['view', V.view], ["you're", V.youre]]), hero: [w([['paying', V.paying, allHero], ['for', V.for, allHero]])]},
  {t: V.may, kick: w([['may', V.may], ['not', V.not], ['be', V.be], ['the', V.the2], ['one', V.one], ['you', V.you]]), hero: [w([['keep', V.keep, 1]])]},
];
const COUNT = {count: {from: 0, to: 50000, t0: O.fifty, t1: O.dollars + 0.2, prefix: '$'}};
const STAT = (count = true) => [{t: O.fifty, kick: w([['more', O.more]]), hero: [[{w: '$50,000', t: O.fifty, e: true, ...(count ? COUNT : {})}]]}];

const CLIENT = {kick: '#F7F7F4', hero: '#F7F7F4', emph: '#73B3DC'};
const GREEN = '#4BC27D';
const KICK = {family: 'InstrumentSans', weight: 600, vary: "'wdth' 100"};
const ANTON = {family: 'Anton', weight: 400};
const viewCut = {behindFrames: 'cut/view_orig', behindCount: 82};
const offerCut = {behindFrames: 'cut/offer_orig', behindCount: 77};
const base = {clip: 'view_orig', dur: 3.4, beats: VIEW(), colors: CLIENT, kick: KICK, kickSize: 44, hero: ANTON, place: 'top', build: 'pair', emph: 'behind', heroMax: 330, ...viewCut};
const stat = {...base, clip: 'offer_orig', dur: 3.2, beats: STAT(), kickAfter: true, ...offerCut};
const card = {...stat, emph: 'none', colors: {kick: '#1E1B5E', hero: '#1E1B5E', emph: '#1E1B5E'}, kickSize: 40, shadow: false};

export const ROUND = {
  title: 'Round 4: behind, counting, and a better card',
  round: 4,
  intro: 'Every change here comes from your round 3 notes. The negative blend now always sits behind him, money counts up, the paper card has new spots, and the riser leads into the cinematic hit instead of the thump.',
  notes: [
    'Rule from your note: the negative blend always goes behind him, unless it\'s small or placed away from him.',
    'The bigger blend now sits behind him instead of covering him.',
    'Money counts up (you loved it), now also in green.',
    'Paper card: same idea, two new spots. One tucked behind him, one smaller and clear of his head.',
    'Sound: riser into cinematic hit (your idea). The thump is out, and the soft air isn\'t used as a lead-in any more.',
    'Mustard: your #E8B923 next to the #FFCE1B you mentioned, plus one in between.',
  ],
  aspect: '9:16',
};

export const SECTIONS = [
  {id: 'r4-locked', name: 'Locked in', use: 'Everything you\'ve kept, including round 3\'s: blend behind him, count-up, proof behind him, soft air on the key word, mustard #E8B923.', order: 0},
  {id: 'r4-blend', name: 'Negative blend, behind him', use: 'Your rule applied: the blend sits behind him. Only size, which words, or (last option) the small, away-from-him exception changes.', order: 1},
  {id: 'r4-proof', name: 'Proof: "$50,000 more"', use: 'Count-up is now the base. Only the colour or treatment changes.', order: 2},
  {id: 'r4-card', name: 'Paper card, new spots', use: 'You liked the concept, not the placement. Same card, two new spots, plus round 3\'s for reference.', order: 3},
  {id: 'r4-sound', name: 'Riser into the key word', use: 'Following your note: no air lead-in, no thump. Sound on.', order: 4},
  {id: 'r4-mustard', name: 'Mustard vs subtitle yellow (Carlos mode)', use: 'Your #E8B923 next to #FFCE1B. Only the yellow changes.', order: 5},
];

export const LOCKED = [
  ['r1-03b', 'Kicker + hero pairs', 'Base rhythm.'], ['r1-04d', 'Behind the agent', 'Base emphasis.'], ['r1-06a', 'Ungraded footage', 'Base grade.'],
  ['r2-01a', 'Anton', 'Font option.'], ['r2-01b', 'Oswald Bold', 'Font option.'],
  ['r2-02a', 'Placement: top', ''], ['r2-02b', 'Placement: lower', ''], ['r2-02c', 'Lower, key beat up top', ''],
  ['r2-03a', 'Behind: accent colour', ''], ['r2-03d', 'Behind: bigger', ''], ['r2-03e', 'Behind: every hero word', ''],
  ['r2-04a', 'Timing: word by word', ''], ['r2-04c', 'Timing: hero lands whole', ''],
  ['r2-05a', 'Camera: locked off', ''], ['r2-05b', 'Camera: slow push', ''], ['r2-05c', 'Camera: punch on key word', ''], ['r2-05d', 'Camera: steady follow', ''],
  ['r2-06d', 'Sound: cinematic hit', 'On the key word.'],
  ['r3-01b', 'Negative blend, behind him', 'Rule: blend goes behind unless small or away from him.'],
  ['r3-02a', 'Proof number behind him', ''], ['r3-02b', 'Proof number counts up', '"LOVE this."'], ['r3-02c', 'Proof in negative blend', 'Better behind him.'],
  ['r3-03a', 'Sound: soft air on the key word', 'The safe default.'], ['r3-04a', 'Carlos mustard #E8B923', ''],
].map(([from, label, desc], i) => ({id: 'r4-00' + String(i + 1).padStart(2, '0'), section: 'r4-locked', label, desc, from, order: i + 1}));

const S = (file, peakAt, trim, gainDb) => ({file: `EAR CANDY/${file}`, peakAt, trim, gainDb});
const RISER = S('Tension Small Riser.wav', V.keep, [1.2, 2.95, 2.95], -13);

export const CARDS = [
  {id: 'r4-01a', section: 'r4-blend', label: 'Behind him', desc: 'Round 3\'s keep. The reference.', props: {...base, blend: true}},
  {id: 'r4-01b', section: 'r4-blend', label: 'Bigger, behind him', desc: 'The bigger size you didn\'t mind, now tucked behind him instead of covering him.', props: {...base, blend: true, heroMax: 460, fill: 900}},
  {id: 'r4-01c', section: 'r4-blend', label: 'Every hero word, behind him', desc: '"Paying for" inverts behind him too.', props: {...base, blend: true, beats: VIEW(1)}},
  {id: 'r4-01d', section: 'r4-blend', label: 'Small, beside him', desc: 'Your exception: a small inverted word on the wall above his shoulder, in front, not touching him.', props: {...base, emph: 'difference', place: 'top', width: 280, kickSize: 34, heroMax: 150, fill: 240}},

  {id: 'r4-02a', section: 'r4-proof', label: 'Counts up, client accent', desc: 'Round 3\'s count-up behind him. The reference.', props: {...stat}},
  {id: 'r4-02b', section: 'r4-proof', label: 'Counts up in green', desc: 'Same, in money green (#4BC27D).', props: {...stat, colors: {...CLIENT, emph: GREEN}}},
  {id: 'r4-02c', section: 'r4-proof', label: 'Counts up, negative blend', desc: 'The count-up inverts behind him, per your note on the blend.', props: {...stat, blend: true}},
  {id: 'r4-02d', section: 'r4-proof', label: 'Counts up, soft white', desc: 'Same, with no colour at all.', props: {...stat, behindPlain: true}},

  {id: 'r4-03a', section: 'r4-card', label: 'Above his head (round 3)', desc: 'Where it was. The reference.', props: {...card, card: {bg: '#F7F7F4', tilt: -2.5}, beats: STAT(false), fill: 470, heroMax: 170}},
  {id: 'r4-03b', section: 'r4-card', label: 'Tucked behind him', desc: 'Larger, with his head in front of its corner, like a print pinned on the wall behind him.', props: {...card, card: {bg: '#F7F7F4', tilt: -2.5, behind: true}, emph: 'behind', beats: STAT(false), fill: 560, heroMax: 200}},
  {id: 'r4-03c', section: 'r4-card', label: 'Small, clear of his head', desc: 'Smaller and kept to the left so it never touches him.', props: {...card, card: {bg: '#F7F7F4', tilt: -2.5}, beats: STAT(false), fill: 240, heroMax: 110, kickSize: 32}},
  {id: 'r4-03d', section: 'r4-card', label: 'Tucked behind him, counting', desc: 'The behind-him card with the number counting up on it.', props: {...card, card: {bg: '#F7F7F4', tilt: -2.5, behind: true}, emph: 'behind', fill: 560, heroMax: 200}},

  {id: 'r4-04a', section: 'r4-sound', label: 'Soft air (locked default)', desc: 'Soft air on the key word only. The reference.', props: {...base}, sfx: [S('Soft Wipe.wav', V.keep, [0, 0.8, 0.1], -15)]},
  {id: 'r4-04b', section: 'r4-sound', label: 'Riser into cinematic hit', desc: 'Your idea: the riser builds from "may not be" into the cinematic hit on "keep".', props: {...base}, sfx: [RISER, S('Cinematic Whoosh Impact Sound.mp3', V.keep, [0.2, 2.6, 0.55], -8)]},
  {id: 'r4-04c', section: 'r4-sound', label: 'Riser alone', desc: 'The riser builds and stops on "keep". No hit.', props: {...base}, sfx: [RISER]},
  {id: 'r4-04d', section: 'r4-sound', label: 'Riser into a quieter hit', desc: 'The same as your idea, with the cinematic hit 6 dB softer.', props: {...base}, sfx: [RISER, S('Cinematic Whoosh Impact Sound.mp3', V.keep, [0.2, 2.6, 0.55], -14)]},
];

const carlos = {...base, hero: {family: 'DrukSuper', weight: 900, tracking: '-0.015em', lh: 0.84}, kick: {family: 'Bebas', weight: 400, tracking: '0.08em'}, kickSize: 46, shadow: false};
for (const [k, hex, name, d] of [['a', '#E8B923', 'Mustard #E8B923', 'Your keep from round 3.'], ['b', '#F4C41F', 'Between #F4C41F', 'Halfway between the two.'], ['c', '#FFCE1B', 'Subtitle yellow #FFCE1B', 'The one you named: brighter, less deep, like movie subtitles.']]) {
  CARDS.push({id: 'r4-05' + k, section: 'r4-mustard', label: name, desc: d, props: {...carlos, colors: {kick: '#F5F1EA', hero: '#E6DCCF', emph: hex}}});
}
for (const c of CARDS) if (c.sfx) c.source = [...new Set(c.sfx.map((x) => x.file.replace('/', ' / ')))].join(' + ');
CARDS.forEach((c, i) => (c.order = i + 1));
