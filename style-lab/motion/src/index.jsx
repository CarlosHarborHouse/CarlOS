import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  registerRoot, Composition, AbsoluteFill, OffthreadVideo, Img, staticFile,
  useCurrentFrame, useVideoConfig, delayRender, continueRender, interpolate, Easing,
} from 'remotion';

// Fonts available to cards. Variable fonts get their axes from `vary` on the card.
const FONTS = {
  Anton: 'Anton-Regular.ttf',
  LeagueGothic: 'LeagueGothic.ttf',
  Oswald: 'Oswald.ttf',
  BigShoulders: 'BigShouldersDisplay.ttf',
  Archivo: 'Archivo.ttf',
  InstrumentSans: 'InstrumentSans.ttf',
  DrukSuper: 'DrukSuper.otf',
  DrukWide: 'DrukWideSuper.otf',
  Bebas: 'BebasNeue.woff2',
};
const fontCss = Object.entries(FONTS).map(([f, file]) =>
  `@font-face{font-family:"${f}";src:url("${staticFile('fonts/' + file)}");font-weight:100 900;font-stretch:50% 200%;font-display:block}`).join('');

// Calm entrance: the brand's own reveal ease, no bounce.
const EASE = Easing.bezier(0.16, 0.84, 0.32, 1);
const IN = 7;   // frames for a word to arrive (~0.3s)
const OUT = 5;  // frames for a beat to leave

// Reels-safe band inside the 4:5 grid crop (1080x1920 frame).
const LEFT = 91, WIDTH = 790;
const PLACE = {top: {top: 300}, middle: {top: 882, center: true}, lower: {bottom: 460}};

function useFonts(families) {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(families.map((f) => document.fonts.load(`700 100px "${f}"`))).then(() => document.fonts.ready).then(() => continueRender(h));
  }, []);
}

// Hero size that makes the longest hero line fill WIDTH (capped).
function useHeroSize(beats, s) {
  const ref = useRef(null);
  const [sizes, setSizes] = useState(null);
  const [h] = useState(() => delayRender('measure'));
  useLayoutEffect(() => {
    document.fonts.ready.then(() => {
      const out = beats.map((b, i) => {
        const els = ref.current.querySelectorAll(`[data-b="${i}"]`);
        let w = 1; els.forEach((e) => (w = Math.max(w, e.getBoundingClientRect().width)));
        return Math.min(s.heroMax || 260, (100 * (s.fill || WIDTH)) / w);
      });
      setSizes(out); continueRender(h);
    });
  }, []);
  const probe = (
    <div ref={ref} style={{position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap'}}>
      {beats.map((b, i) => b.hero.map((line, j) => (
        <div key={i + '-' + j} data-b={i} style={{...heroFont(s), fontSize: 100, display: 'inline-block'}}>{line.map((w) => w.w).join(' ')}</div>
      )))}
    </div>
  );
  return [sizes, probe];
}

const heroFont = (s) => ({
  fontFamily: s.hero.family, fontWeight: s.hero.weight || 400,
  fontVariationSettings: s.hero.vary || 'normal', textTransform: 'uppercase',
  letterSpacing: s.hero.tracking || '-0.005em', lineHeight: s.hero.lh || 0.9,
});
const kickFont = (s) => ({
  fontFamily: s.kick.family, fontWeight: s.kick.weight || 600, fontVariationSettings: s.kick.vary || 'normal',
  textTransform: 'uppercase', letterSpacing: s.kick.tracking || '0.08em', lineHeight: 1.1,
});

function wordStyle(frame, fps, t, end, s = {}) {
  const inF = s.inFrames || IN;
  const p = EASE(Math.min(1, Math.max(0, (frame - t * fps) / inF)));
  const q = end == null ? 0 : EASE(Math.min(1, Math.max(0, (frame - end * fps) / OUT)));
  const rise = s.exit === 'rise' ? 0.5 : 0.06;
  return {
    opacity: p * (1 - q),
    transform: `translateY(${(1 - p) * (s.inRise ?? 0.16) - q * rise}em)`,
    filter: `blur(${(1 - p) * (s.inBlur ?? 8) + q * 4}px)`,
  };
}

// One layer of text. `only` = 'front' hides emphasis words, 'back' shows only them.
function TextLayer({s, sizes, only}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beats = s.beats;
  const ghost = (w) => only === 'front' && w.e && s.emph === 'behind' && s.ghost;
  const vis = (w) => (s.card && s.card.behind) ? true : only === 'front' ? (!(w.e && s.emph === 'behind') || ghost(w)) : only === 'back' ? (w.e && s.emph === 'behind') : true;
  const colour = (w, base) => (w.e && (s.emph === 'color' || (s.emph === 'behind' && !s.behindPlain)) ? s.colors.emph : base);
  const blend = (w) => (w.e && (s.emph === 'difference' || s.blend) ? {mixBlendMode: 'difference', color: '#ffffff', textShadow: 'none'} : {});
  const text = (w) => {
    if (!w.count) return w.w;
    const {from, to, t0, t1, prefix = ''} = w.count;
    const p = EASE(Math.min(1, Math.max(0, (frame / fps - t0) / (t1 - t0))));
    return prefix + Math.round(from + (to - from) * p).toLocaleString('en-US');
  };
  
  const shadow = s.shadow === false ? 'none' : '0 2px 24px rgba(0,0,0,.28)';

  // A card that sits behind the speaker lives entirely in the back layer.
  if (s.card && s.card.behind && only === 'front') return null;
  const shownBeat = beats.findLastIndex((b) => frame >= b.t * fps - IN) ;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {beats.map((b, i) => {
        if (i !== shownBeat && i !== shownBeat - 1) return null;
        const end = beats[i + 1] ? beats[i + 1].t : null;
        if (end != null && frame > end * fps + OUT) return null;
        const size = sizes ? sizes[i] : 100;
        const place = PLACE[b.place || s.place || 'lower'];
        const kSize = s.kickSize || Math.round(Math.max(34, size * (s.kickRatio || 0.2)));
        const bw = s.width || WIDTH;
        const box = {position: 'absolute', left: s.align === 'center' ? (1080 - bw) / 2 : LEFT, width: bw,
          ...(s.align === 'center' ? {alignItems: 'center', textAlign: 'center'} : {}), display: 'flex', flexDirection: 'column', gap: s.gap ?? 10,
          ...(place.top != null ? {top: place.top} : {}), ...(place.bottom != null ? {bottom: place.bottom} : {}),
          ...(place.center ? {transform: 'translateY(-50%)'} : {}), ...(s.kickAfter ? {flexDirection: 'column-reverse'} : {})};
        if (s.card) {
          const p = EASE(Math.min(1, Math.max(0, (frame - b.t * fps + 2) / 10)));
          const q = end == null ? 0 : EASE(Math.min(1, Math.max(0, (frame - end * fps) / OUT)));
          Object.assign(box, {width: 'fit-content', background: s.card.bg, padding: '26px 34px 30px', borderRadius: 3,
            boxShadow: '0 22px 60px rgba(0,0,0,.32), 0 2px 6px rgba(0,0,0,.18)', opacity: p * (1 - q),
            transform: `translateY(${(1 - p) * 60}px) rotate(${s.card.tilt || -2.5}deg)`, transformOrigin: '0 100%'});
        }
        const W = (w, k, base, extra) => (
          // On a card the words just appear with it; the card does the moving.
          <span key={k} style={{display: 'inline-block', marginRight: '0.24em', whiteSpace: 'pre', color: colour(w, base),
            textShadow: w.e && s.emph === 'difference' ? 'none' : shadow,
            ...(s.build === 'word' && !w.cur ? {display: 'none'} : {}),
            ...wordStyle(frame, fps, s.build === 'phrase' ? b.t : (s.heroWhole && w.h ? w.h0 : w.t), s.build === 'word' ? w.next : end, s), ...blend(w), ...extra,
            ...(ghost(w) ? {opacity: (wordStyle(frame, fps, w.t, end, s).opacity) * (s.ghost || 0.22), textShadow: 'none'} : {}),
            visibility: vis(w) ? 'visible' : 'hidden'}}>{text(w)}</span>
        );
        if (s.build === 'word') {
          // One word at a time, the current word alone at hero size.
          const all = [...b.kick, ...b.hero.flat()];
          const cur = all.findLastIndex((w) => frame >= w.t * fps - 1);
          return (
            <div key={i} style={box}>
              {all.map((w, j) => j === cur ? (
                <div key={j} style={{...heroFont(s), fontSize: s.wordSize || 200}}>{W({...w, cur: true, next: all[j + 1] ? all[j + 1].t : end}, j, s.colors.hero)}</div>
              ) : null)}
            </div>
          );
        }
        return (
          <div key={i} style={box}>
            {b.kick.length > 0 && (
              <div style={{...kickFont(s), fontSize: kSize, color: s.colors.kick}}>{b.kick.map((w, j) => W(w, j, s.colors.kick, {marginRight: '0.32em'}))}</div>
            )}
            {b.hero.map((line, j) => (
              <div key={j} style={{...heroFont(s), fontSize: s.build === 'phrase' ? (s.phraseSize || size) : size, whiteSpace: 'nowrap'}}>
                {line.map((w, k) => W({...w, h: 1, h0: b.hero[0][0].t}, k, s.colors.hero))}
              </div>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

function camera(s, frame, fps) {
  const c = s.cam; if (!c) return {};
  if (c.mode === 'push') {
    const k = 1 + (c.amount || 0.06) * (frame / (s.dur * fps));
    return {transform: `scale(${k})`, transformOrigin: c.origin || '50% 30%'};
  }
  if (c.mode === 'punch') {
    const p = EASE(Math.min(1, Math.max(0, (frame - c.at * fps) / (c.frames || 8))));
    return {transform: `scale(${1 + (c.amount || 0.1) * p})`, transformOrigin: c.origin || '50% 30%'};
  }
  if (c.mode === 'follow') {
    const k = c.scale || 1.12, [x, y] = c.track[Math.min(frame, c.track.length - 1)];
    const tx = Math.min(0, Math.max(1080 - 1080 * k, (c.x ?? 540) - x * k));
    const ty = Math.min(0, Math.max(1920 - 1920 * k, (c.y ?? 430) - y * k));
    return {transform: `translate(${tx}px, ${ty}px) scale(${k})`, transformOrigin: '0 0'};
  }
  return {};
}

function Card(s) {
  const fams = [s.hero?.family, s.kick?.family].filter(Boolean);
  useFonts(fams.length ? fams : ['Anton']);
  const [sizes, probe] = useHeroSize(s.beats || [], s);
  const frame = useCurrentFrame();
  const cut = s.behindFrames ? staticFile(`${s.behindFrames}/${String(Math.min(frame + 1, s.behindCount)).padStart(4, '0')}.png`) : null;
  return (
    <AbsoluteFill style={{background: '#14120F'}}>
      <style>{fontCss}</style>
      <AbsoluteFill style={camera(s, frame, 24)}>
        <OffthreadVideo src={staticFile(`clips/${s.clip}.mp4`)} muted={!!s.muted} />
      </AbsoluteFill>
      {s.scrim && <AbsoluteFill style={{background: s.scrim}} />}
      {s.beats && probe}
      {s.beats && s.emph === 'behind' && <TextLayer s={s} sizes={sizes} only="back" />}
      {cut && s.emph === 'behind' && <AbsoluteFill style={camera(s, frame, 24)}><Img src={cut} style={{width: '100%', height: '100%'}} /></AbsoluteFill>}
      {s.beats && <TextLayer s={s} sizes={sizes} only="front" />}
    </AbsoluteFill>
  );
}

registerRoot(() => (
  <Composition id="Card" component={Card} width={1080} height={1920} fps={24} durationInFrames={72}
    defaultProps={{clip: 'view_lush', dur: 3}}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(props.dur * 24)})} />
));
