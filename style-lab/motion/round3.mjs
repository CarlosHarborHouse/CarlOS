// Round 3: the negative blend placed better, the first proof card, where the kept sounds go, and Carlos's mustard.
import {readFileSync} from 'node:fs';
const w = (list) => list.map(([word, t, e]) => ({w: word, t, ...(e ? {e: true} : {})}));

const V = {the: 0.0, view: 0.11, youre: 0.4, paying: 0.55, for: 0.89, may: 1.17, not: 1.46, be: 1.71, the2: 1.85, one: 1.92, you: 2.14, keep: 2.24};
// Highest-offer video: "...fifty thousand dollars more" (recognised from the audio; the lead-in words aren't certain, so they stay uncaptioned).
const O = {fifty: 0.74, thousand: 1.13, dollars: 1.48, more: 1.8};

const VIEW = (allHero) => [
  {t: 0, kick: w([['the', V.the], ['view', V.view], ["you're", V.youre]]), hero: [w([['paying', V.paying, allHero], ['for', V.for, allHero]])]},
  {t: V.may, kick: w([['may', V.may], ['not', V.not], ['be', V.be], ['the', V.the2], ['one', V.one], ['you', V.you]]), hero: [w([['keep', V.keep, 1]])]},
];
const STAT = (count) => [{t: O.fifty, kick: w([['more', O.more]]), hero: [[{w: '$50,000', t: O.fifty, e: true, ...(count ? {count: {from: 0, to: 50000, t0: O.fifty, t1: O.dollars + 0.2, prefix: '$'}} : {})}]]}];

const CLIENT = {kick: '#F7F7F4', hero: '#F7F7F4', emph: '#73B3DC'};
const KICK = {family: 'InstrumentSans', weight: 600, vary: "'wdth' 100"};
const ANTON = {family: 'Anton', weight: 400};
const viewCut = {behindFrames: 'cut/view_orig', behindCount: 82};
const offerCut = {behindFrames: 'cut/offer_orig', behindCount: 77};
const base = {clip: 'view_orig', dur: 3.4, beats: VIEW(), colors: CLIENT, kick: KICK, kickSize: 44, hero: ANTON, place: 'top', build: 'pair', emph: 'behind', heroMax: 330, ...viewCut};
const stat = {...base, clip: 'offer_orig', dur: 3.2, beats: STAT(), kickAfter: true, ...offerCut};

export const ROUND = {
  title: 'Round 3: blend, proof and sound placement',
  round: 3,
  intro: 'Round 2 showed you\'re building a toolkit, not picking one winner, so everything you kept is now locked in as a tool (see Locked in). This round revisits the negative blend in better spots, adds the first proof card, tests where your kept sounds go, and settles your mustard.',
  notes: [
    'Locked from round 2: Anton and Oswald Bold; top, lower and lower-with-key-beat-up placements; behind-him as in round 1, bigger, and on every hero word; round 1 timing and hero-lands-whole; all four camera moves; soft air, cinematic hit, riser into thump.',
    'Dropped: the low thump on its own. It won\'t come back unless you ask.',
    'Negative blend is back, as you asked: behind him, bigger, and on every hero word.',
    'New: a proof card for the "$50,000 more" moment, four ways.',
    'Your mustard (Carlos mode): the two mustards from round 1 and one in between.',
  ],
  aspect: '9:16',
};

export const SECTIONS = [
  {id: 'r3-locked', name: 'Locked in', use: 'Everything you\'ve kept so far. These are tools in the kit; the write-up says when to use each.', order: 0},
  {id: 'r3-blend', name: 'Negative blend, placed better', use: 'The inverting word from round 1, now on natural footage in the locked system. Only where and how big it sits changes.', order: 1},
  {id: 'r3-proof', name: 'Proof card: "$50,000 more"', use: 'The first proof moment, from the highest-offer video. Same number and timing; only the treatment changes.', order: 2},
  {id: 'r3-sound', name: 'Where the sounds go', use: 'Your kept sounds, placed differently. Sound on.', order: 3},
  {id: 'r3-mustard', name: 'Your mustard (Carlos mode)', use: 'Your own look in the locked system: Druk hero in Bone, Bebas kicker in Porcelain, the key word behind you in mustard. Only the mustard changes.', order: 4},
];

// Round 2 keeps (shown locked) and round 1 base keeps.
export const LOCKED = [
  ['r1-03b', 'Kicker + hero pairs', 'Base rhythm.'], ['r1-04d', 'Behind the agent', 'Base emphasis.'], ['r1-06a', 'Ungraded footage', 'Base grade: natural.'],
  ['r2-01a', 'Anton', 'Font option: heavier, closer to Druk.'], ['r2-01b', 'Oswald Bold', 'Font option: rounder, friendlier.'],
  ['r2-02a', 'Placement: top', 'Everything at head height.'], ['r2-02b', 'Placement: lower', 'Everything low.'], ['r2-02c', 'Lower, key beat up top', 'Low captions; the behind-him beat goes to the head.'],
  ['r2-03a', 'Behind: accent colour', 'Key word behind him in the client accent.'], ['r2-03d', 'Behind: bigger', 'More of the word around his head.'], ['r2-03e', 'Behind: every hero word', 'All big words behind him.'],
  ['r2-04a', 'Timing: word by word', 'Each word eases in on its syllable.'], ['r2-04c', 'Timing: hero lands whole', 'The big words arrive as one block.'],
  ['r2-05a', 'Camera: locked off', 'No move.'], ['r2-05b', 'Camera: slow push', '6% push across the clip.'], ['r2-05c', 'Camera: punch on key word', 'Soft 10% push on the key word.'], ['r2-05d', 'Camera: steady follow', '112%, re-centred on the head.'],
  ['r2-06a', 'Sound: soft air', 'Soft Wipe under the key word.'], ['r2-06d', 'Sound: cinematic hit', 'Cinematic Whoosh Impact on the key word.'], ['r2-06e', 'Sound: riser into thump', 'Tension Small Riser + Hit Deep.'],
].map(([from, label, desc], i) => ({id: `r3-00${String.fromCharCode(97 + i)}`, section: 'r3-locked', label, desc, from, order: i + 1}));

const S = (file, peakAt, trim, gainDb) => ({file: `EAR CANDY/${file}`, peakAt, trim, gainDb});
const AIR = (at) => S('Soft Wipe.wav', at, [0, 0.8, 0.1], -15);
const HIT = S('Cinematic Whoosh Impact Sound.mp3', V.keep, [0.2, 2.6, 0.55], -8);
const RISE = [S('Tension Small Riser.wav', V.keep, [1.2, 2.95, 2.95], -13), S('Short foley Hit Deep.wav', V.keep, [0, 1.0, 0], -10)];

export const CARDS = [
  {id: 'r3-01a', section: 'r3-blend', label: 'In front, at head height', desc: 'Round 1\'s negative blend, now on natural footage. The reference.', props: {...base, emph: 'difference'}},
  {id: 'r3-01b', section: 'r3-blend', label: 'Behind him', desc: 'The inverted word tucks behind his head, like your locked depth effect.', props: {...base, blend: true}},
  {id: 'r3-01c', section: 'r3-blend', label: 'Bigger', desc: 'In front, but wider and taller so more of the scene shows through it.', props: {...base, emph: 'difference', heroMax: 460, fill: 900}},
  {id: 'r3-01d', section: 'r3-blend', label: 'Every hero word', desc: '"Paying for" inverts too, not just the key word.', props: {...base, emph: 'difference', beats: VIEW(1)}},

  {id: 'r3-02a', section: 'r3-proof', label: 'Behind him', desc: 'The number in the locked style, tucked behind his head.', props: {...stat}},
  {id: 'r3-02b', section: 'r3-proof', label: 'Counts up', desc: 'The same, but the number counts from $0 as he says it.', props: {...stat, beats: STAT(true)}},
  {id: 'r3-02c', section: 'r3-proof', label: 'Negative blend', desc: 'In front of him, inverting the cabinets and his jacket behind it.', props: {...stat, emph: 'difference'}},
  {id: 'r3-02d', section: 'r3-proof', label: 'Paper card', desc: 'Printed on a slightly tilted card that rises in beside his head, like Elsie\'s press cards.', props: {...stat, emph: 'none', card: {bg: '#F7F7F4', tilt: -2.5}, colors: {kick: '#1E1B5E', hero: '#1E1B5E', emph: '#1E1B5E'}, fill: 470, heroMax: 170, kickSize: 40, place: 'top', shadow: false}},

  {id: 'r3-03a', section: 'r3-sound', label: 'Key word only', desc: 'Soft air only on "keep", as you kept it. The reference.', props: {...base}, sfx: [AIR(V.keep)]},
  {id: 'r3-03b', section: 'r3-sound', label: 'Every big word', desc: 'Soft air on "paying" and on "keep".', props: {...base}, sfx: [AIR(V.paying), AIR(V.keep)]},
  {id: 'r3-03c', section: 'r3-sound', label: 'Air, then cinematic hit', desc: 'Soft air on "paying", the cinematic hit saved for "keep".', props: {...base}, sfx: [AIR(V.paying), HIT]},
  {id: 'r3-03d', section: 'r3-sound', label: 'Air, then riser into thump', desc: 'Soft air on "paying", the riser building into "keep".', props: {...base}, sfx: [AIR(V.paying), ...RISE]},
];

const carlos = {...base, hero: {family: 'DrukSuper', weight: 900, tracking: '-0.015em', lh: 0.84}, kick: {family: 'Bebas', weight: 400, tracking: '0.08em'}, kickSize: 46, shadow: false};
for (const [k, hex, name, d] of [['a', '#E8B923', 'Mustard #E8B923', 'The brighter mustard from round 1.'], ['b', '#DDB028', 'Mid mustard #DDB028', 'Halfway between the two.'], ['c', '#D4A72C', 'Deep mustard #D4A72C', 'The deeper, more muted mustard from round 1.']]) {
  CARDS.push({id: 'r3-04' + k, section: 'r3-mustard', label: name, desc: d, props: {...carlos, colors: {kick: '#F5F1EA', hero: '#E6DCCF', emph: hex}}});
}
for (const c of CARDS) if (c.sfx) c.source = [...new Set(c.sfx.map((x) => x.file.replace('/', ' / ')))].join(' + ');
CARDS.forEach((c, i) => (c.order = i + 1));
