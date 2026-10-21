// Round 2: built from round 1's verdicts. Locked: kicker + hero pairs, text behind the subject, ungraded footage.
import {readFileSync} from 'node:fs';
const w = (list) => list.map(([word, t, e]) => ({w: word, t, ...(e ? {e: true} : {})}));

const V = {the: 0.0, view: 0.11, youre: 0.4, paying: 0.55, for: 0.89, may: 1.17, not: 1.46, be: 1.71, the2: 1.85, one: 1.92, you: 2.14, keep: 2.24};
const A = {youre: 0, deciding: 0.23, people: 0.81, dont: 1.16, wanna: 1.34, hear: 1.53, from: 1.82, you: 2.08, before: 2.19, you2: 2.69, even: 2.9, reach: 3.28, out: 3.67};

const VIEW = (allBehind) => [
  {t: 0, kick: w([['the', V.the], ['view', V.view], ["you're", V.youre]]), hero: [w([['paying', V.paying, allBehind], ['for', V.for, allBehind]])]},
  {t: V.may, kick: w([['may', V.may], ['not', V.not], ['be', V.be], ['the', V.the2], ['one', V.one], ['you', V.you]]), hero: [w([['keep', V.keep, 1]])]},
];
const APOL = (places = []) => [
  {t: 0, place: places[0], kick: w([["you're", A.youre], ['deciding', A.deciding]]), hero: [w([['people', A.people]])]},
  {t: A.dont, place: places[1], kick: w([["don't", A.dont], ['wanna', A.wanna]]), hero: [w([['hear', A.hear], ['from', A.from], ['you', A.you]])]},
  {t: A.before, place: places[2], kick: w([['before', A.before], ['you', A.you2], ['even', A.even]]), hero: [w([['reach', A.reach, 1], ['out', A.out, 1]])]},
];

const CLIENT = {kick: '#F7F7F4', hero: '#F7F7F4', emph: '#73B3DC'};
const KICK = {family: 'InstrumentSans', weight: 600, vary: "'wdth' 100"};
const ANTON = {family: 'Anton', weight: 400};
const viewCut = {behindFrames: 'cut/view_orig', behindCount: 82};
const apolCut = {behindFrames: 'cut/apol_orig', behindCount: 110};
// The locked system, on ungraded footage.
const base = {clip: 'view_orig', dur: 3.4, beats: VIEW(), colors: CLIENT, kick: KICK, kickSize: 44, hero: ANTON, place: 'top', build: 'pair', emph: 'behind', heroMax: 330, ...viewCut};
const apol = {...base, clip: 'apol_orig', dur: 4.6, beats: APOL(), ...apolCut};

// Head position per frame (from the cutouts) for the steady reframe.
const track = JSON.parse(readFileSync(new URL('./public/cut/view_orig.track.json', import.meta.url)));

export const ROUND = {
  title: 'Round 2: depth, camera and sound',
  round: 2,
  intro: 'Built from your round 1 picks. Kicker + hero pairs, words behind the agent and natural (ungraded) footage are now locked and used under everything. This round settles your two Maybes, pushes the depth effect further, and adds camera moves and the first sounds from your EAR CANDY library. Tap a card for full size with sound.',
  notes: [
    'Locked from round 1: kicker + hero pairs, key word behind the agent, ungraded footage. All three are now the base for every option.',
    'Font: Anton vs Oswald (your two Maybes), now inside the locked system.',
    'Placement: top vs lower (your two Maybes), plus a mix: lower for most beats, top for the beat whose word goes behind his head.',
    'New: four ways to push the behind-the-agent effect, four caption timings, four camera moves, five sounds.',
    'Dropped from view: fonts, rhythms, emphasis styles and grades you didn\'t pick. The yellows are paused until you say whether you still want them.',
  ],
  aspect: '9:16',
};

export const SECTIONS = [
  {id: 'r2-locked', name: 'Locked in', use: 'Your round 1 keeps. These are now the base for every option below.', order: 0},
  {id: 'r2-font', name: 'Font: Anton or Oswald', use: 'Your two Maybes, side by side in the locked system. Only the hero font changes.', order: 1},
  {id: 'r2-place', name: 'Placement: top or lower', use: 'Your two Maybes on a longer line. Words behind the agent only read where he\'s narrow (his head), so the third option mixes the two.', order: 2},
  {id: 'r2-behind', name: 'Pushing the depth effect', use: 'Your behind-the-agent keep, pushed four ways. Same words and placement. One change per option.', order: 3},
  {id: 'r2-rhythm', name: 'Pair timing', use: 'Your kicker + hero keep with different timing. Same words, font and placement.', order: 4},
  {id: 'r2-camera', name: 'Camera: punch-ins and reframe', use: 'Subtle camera moves like Elsie\'s edit. The footage moves under the text; the text stays still.', order: 5},
  {id: 'r2-sound', name: 'Sound on the key word', use: 'One sound from your library lands on "keep", mixed low under the voice: felt more than heard, with cinematic options. Turn sound on.', order: 6},
];

export const LOCKED = [
  {id: 'r2-00a', section: 'r2-locked', label: 'Kicker + hero pairs', desc: 'Caption rhythm: small lead-in, then the big word, easing in on the voice.', from: 'r1-03b'},
  {id: 'r2-00b', section: 'r2-locked', label: 'Behind the agent', desc: 'Emphasis: the key word sits behind him.', from: 'r1-04d'},
  {id: 'r2-00c', section: 'r2-locked', label: 'Ungraded footage', desc: 'Grade: natural, as shot. No added look.', from: 'r1-06a'},
];

export const CARDS = [
  {id: 'r2-01a', section: 'r2-font', label: 'Anton', desc: 'Heavier and tighter. Closer to Druk.', props: {...base}},
  {id: 'r2-01b', section: 'r2-font', label: 'Oswald Bold', desc: 'Rounder and a little wider. Friendlier.', props: {...base, hero: {family: 'Oswald', weight: 700}}},
  {id: 'r2-01c', section: 'r2-font', label: 'Oswald SemiBold', desc: 'The same family a step lighter. Calmer, more refined.', props: {...base, hero: {family: 'Oswald', weight: 600}}},

  {id: 'r2-02a', section: 'r2-place', label: 'Top', desc: 'Every beat sits at the top, so the key words tuck behind his head.', props: {...apol, beats: APOL(['top', 'top', 'top'])}},
  {id: 'r2-02b', section: 'r2-place', label: 'Lower', desc: 'Every beat sits low, so the key words go behind his chest and mostly disappear.', props: {...apol, beats: APOL(['lower', 'lower', 'lower'])}},
  {id: 'r2-02c', section: 'r2-place', label: 'Lower, key beat up top', desc: 'Captions stay low; only the beat with the behind-him word moves up to his head.', props: {...apol, beats: APOL(['lower', 'lower', 'top'])}},

  {id: 'r2-03a', section: 'r2-behind', label: 'As in round 1', desc: 'The key word behind him in the client accent. The reference.', props: {...base}},
  {id: 'r2-03b', section: 'r2-behind', label: 'Soft white', desc: 'Same, but the word stays soft white. Depth alone does the emphasis.', props: {...base, behindPlain: true}},
  {id: 'r2-03c', section: 'r2-behind', label: 'Ghosted', desc: 'The part his head hides shows faintly through him, so the word still reads.', props: {...base, ghost: 0.42}},
  {id: 'r2-03d', section: 'r2-behind', label: 'Bigger', desc: 'The word is wider and taller, so more of it shows around his head.', props: {...base, heroMax: 460, fill: 900}},
  {id: 'r2-03e', section: 'r2-behind', label: 'Every hero word behind', desc: '"Paying for" goes behind him too, not just the key word.', props: {...base, beats: VIEW(1)}},

  {id: 'r2-04a', section: 'r2-rhythm', label: 'As in round 1', desc: 'Each word eases in over 0.3 s on its spoken syllable.', props: {...apol, beats: APOL(['lower', 'lower', 'top'])}},
  {id: 'r2-04b', section: 'r2-rhythm', label: 'Slower, softer', desc: 'Each word takes 0.5 s and starts more blurred. Gentler, more filmic.', props: {...apol, beats: APOL(['lower', 'lower', 'top']), inFrames: 12, inBlur: 14, inRise: 0.1}},
  {id: 'r2-04c', section: 'r2-rhythm', label: 'Hero lands whole', desc: 'Kicker builds word by word; the big words arrive together as one block.', props: {...apol, beats: APOL(['lower', 'lower', 'top']), heroWhole: true}},
  {id: 'r2-04d', section: 'r2-rhythm', label: 'Beats lift away', desc: 'Same entrance, but each finished beat drifts up as it fades instead of just fading.', props: {...apol, beats: APOL(['lower', 'lower', 'top']), exit: 'rise'}},

  {id: 'r2-05a', section: 'r2-camera', label: 'Locked off', desc: 'No camera move. The footage as shot.', props: {...base}},
  {id: 'r2-05b', section: 'r2-camera', label: 'Slow push', desc: 'A steady 6% push-in across the whole clip. Barely noticed, adds tension.', props: {...base, cam: {mode: 'push', amount: 0.06}}},
  {id: 'r2-05c', section: 'r2-camera', label: 'Punch on the key word', desc: 'A soft 10% push-in, eased over 0.33 s, as he says "keep".', props: {...base, cam: {mode: 'punch', at: V.keep, amount: 0.1, frames: 8}}},
  {id: 'r2-05d', section: 'r2-camera', label: 'Steady follow', desc: 'Framed 12% tighter and gently re-centred on his head every frame, like Elsie\'s.', props: {...base, cam: {mode: 'follow', scale: 1.12, track}}},
];

// Sound: same picture for every option; only the sound changes. Times are when the sound's peak lands.
const S = (file, peakAt, trim, gainDb) => ({file: `EAR CANDY/${file}`, peakAt, trim, gainDb});
const SOUNDS = [
  ['a', 'Soft air', 'Soft Wipe: a quiet breath of air as the word arrives. Felt more than heard.', [S('Soft Wipe.wav', V.keep, [0, 0.8, 0.1], -15)]],
  ['b', 'Low thump', 'Short foley Hit Deep: a low body hit under the word. Felt in the chest.', [S('Short foley Hit Deep.wav', V.keep, [0, 1.0, 0], -9)]],
  ['c', 'Deep swell', 'Whoosh Rise: a dark swell that crests on the word.', [S('Whoosh Rise.wav', V.keep, [0.3, 2.1, 1.2], -11)]],
  ['d', 'Cinematic hit', 'Cinematic Whoosh Impact: a whoosh into an impact. The biggest option.', [S('Cinematic Whoosh Impact Sound.mp3', V.keep, [0.2, 2.6, 0.55], -8)]],
  ['e', 'Riser into thump', 'Tension Small Riser builds from "may not be", then Hit Deep lands on "keep".', [S('Tension Small Riser.wav', V.keep, [1.2, 2.95, 2.95], -13), S('Short foley Hit Deep.wav', V.keep, [0, 1.0, 0], -10)]],
];
for (const [k, label, desc, sfx] of SOUNDS) {
  CARDS.push({id: 'r2-06' + k, section: 'r2-sound', label, desc: desc.split(': ')[1], source: sfx.map((x) => x.file.replace('/', ' / ')).join(' + '), props: {...base}, sfx});
}
CARDS.forEach((c, i) => (c.order = i + 1));
LOCKED.forEach((c, i) => (c.order = i + 1));
