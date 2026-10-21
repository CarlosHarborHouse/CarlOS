// Round 5: layout. Where the small negative blend lives, and when text can be centred.
const w = (list) => list.map(([word, t, e]) => ({w: word, t, ...(e ? {e: true} : {})}));

const V = {the: 0.0, view: 0.11, youre: 0.4, paying: 0.55, for: 0.89, may: 1.17, not: 1.46, be: 1.71, the2: 1.85, one: 1.92, you: 2.14, keep: 2.24};
const VIEW = [
  {t: 0, kick: w([['the', V.the], ['view', V.view], ["you're", V.youre]]), hero: [w([['paying', V.paying], ['for', V.for]])]},
  {t: V.may, kick: w([['may', V.may], ['not', V.not], ['be', V.be], ['the', V.the2], ['one', V.one], ['you', V.you]]), hero: [w([['keep', V.keep, 1]])]},
];

const CLIENT = {kick: '#F7F7F4', hero: '#F7F7F4', emph: '#73B3DC'};
const KICK = {family: 'InstrumentSans', weight: 600, vary: "'wdth' 100"};
const base = {clip: 'view_orig', dur: 3.4, beats: VIEW, colors: CLIENT, kick: KICK, kickSize: 44, hero: {family: 'Anton', weight: 400}, place: 'top', build: 'pair', emph: 'behind', heroMax: 330, behindFrames: 'cut/view_orig', behindCount: 82};
const small = {...base, emph: 'difference', width: 280, kickSize: 34, heroMax: 150, fill: 240};

export const ROUND = {
  title: 'Round 5: layout',
  round: 5,
  intro: 'Depth, proof and sound are settled and written up as rules in STYLE.md. This short round answers your two layout notes: where the small negative blend should live, and when text can be centred.',
  notes: [
    'Locked from round 4: blend behind him (standard, bigger, every hero word), count-up (accent, green, blend), card tucked behind him (still or counting), all three riser sounds, yellows #F4C41F and #FFCE1B.',
    'Small negative blend moved off the wall, as your note asked: lower third or middle.',
    'New from your overall note: centred text, at the top behind his head, in the middle, and low.',
  ],
  aspect: '9:16',
};

export const SECTIONS = [
  {id: 'r5-locked', name: 'Locked in', use: 'Everything you\'ve kept across rounds 1–4. The rules for using them are in STYLE.md.', order: 0},
  {id: 'r5-small', name: 'Small negative blend, new spots', use: 'Your exception to "blend goes behind": small, in front, in the lower third or middle as you suggested. Same size; only the spot changes.', order: 1},
  {id: 'r5-center', name: 'Centred text', use: 'Your note: text doesn\'t always have to be left. Same words and font; the first option is the locked left version for reference.', order: 2},
];

const ids = {
  r1: [['03b', 'Kicker + hero pairs'], ['04d', 'Behind the agent'], ['06a', 'Ungraded footage']],
  r2: [['01a', 'Anton'], ['01b', 'Oswald Bold'], ['02a', 'Placement: top'], ['02b', 'Placement: lower'], ['02c', 'Lower, key beat up top'], ['03a', 'Behind: accent'], ['03d', 'Behind: bigger'], ['03e', 'Behind: every hero word'], ['04a', 'Timing: word by word'], ['04c', 'Timing: hero lands whole'], ['05a', 'Camera: locked off'], ['05b', 'Camera: slow push'], ['05c', 'Camera: punch on key word'], ['05d', 'Camera: steady follow'], ['06d', 'Sound: cinematic hit']],
  r3: [['03a', 'Sound: soft air on key word'], ['04a', 'Carlos yellow #E8B923']],
  r4: [['01a', 'Blend behind him'], ['01b', 'Blend bigger, behind him'], ['01c', 'Blend on every hero word'], ['02a', 'Count-up, accent'], ['02b', 'Count-up, green'], ['02c', 'Count-up, blend'], ['03b', 'Card tucked behind him'], ['03d', 'Card behind him, counting'], ['04b', 'Sound: riser into hit'], ['04c', 'Sound: riser alone'], ['04d', 'Sound: riser into quieter hit'], ['05b', 'Carlos yellow #F4C41F'], ['05c', 'Carlos yellow #FFCE1B']],
};
export const LOCKED = Object.entries(ids).flatMap(([r, list]) => list.map(([n, label]) => ({from: `${r}-${n}`, label})))
  .map((c, i) => ({...c, id: 'r5-00' + String(i + 1).padStart(2, '0'), section: 'r5-locked', desc: '', order: i + 1}));

export const CARDS = [
  {id: 'r5-01a', section: 'r5-small', label: 'Lower third, left', desc: 'Small and inverted, low on the left over his jacket.', props: {...small, place: 'lower'}},
  {id: 'r5-01b', section: 'r5-small', label: 'Lower third, centred', desc: 'Small and inverted, low and centred on his chest.', props: {...small, place: 'lower', align: 'center'}},
  {id: 'r5-01c', section: 'r5-small', label: 'Middle, centred', desc: 'Small and inverted, dead centre, around his collar.', props: {...small, place: 'middle', align: 'center'}},

  {id: 'r5-02a', section: 'r5-center', label: 'Left, top, behind him (locked)', desc: 'The locked layout, for reference.', props: {...base}},
  {id: 'r5-02b', section: 'r5-center', label: 'Centred, top, behind him', desc: 'Same, centred. His head now sits in the middle of the word.', props: {...base, align: 'center'}},
  {id: 'r5-02c', section: 'r5-center', label: 'Centred, middle', desc: 'Centred on his chest, in front, key word in the accent.', props: {...base, align: 'center', place: 'middle', emph: 'color', width: 700}},
  {id: 'r5-02d', section: 'r5-center', label: 'Centred, lower', desc: 'Centred low, in front, key word in the accent.', props: {...base, align: 'center', place: 'lower', emph: 'color', width: 700}},
];
CARDS.forEach((c, i) => (c.order = i + 1));
