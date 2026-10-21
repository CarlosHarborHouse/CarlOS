// Render every card in a round: full-quality MP4 with sound, plus a small muted looping preview.
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {mkdirSync, statSync} from 'node:fs';
import path from 'node:path';

const [roundFile, outDir, only] = process.argv.slice(2);
const {CARDS} = await import(path.resolve(roundFile));
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
mkdirSync(`${outDir}/full`, {recursive: true});
mkdirSync(`${outDir}/preview`, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.jsx'), publicDir: path.resolve('public')});
for (const c of CARDS.filter((c) => !only || c.id.startsWith(only))) {
  const comp = await selectComposition({serveUrl, id: 'Card', inputProps: c.props, browserExecutable});
  const full = `${outDir}/full/${c.id}.mp4`;
  await renderMedia({composition: comp, serveUrl, codec: 'h264', crf: 18, outputLocation: full, inputProps: c.props, browserExecutable, concurrency: 4, audioCodec: 'aac'});
  if (c.sfx) mixSfx(full, c.sfx);
  else {
    // Voice-only renders still get the -1 dB ceiling.
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', full, '-c:v', 'copy', '-af', 'alimiter=limit=0.87:level=false', '-c:a', 'aac', '-b:a', '192k', full + '.tmp.mp4']);
    execFileSync('mv', [full + '.tmp.mp4', full]);
  }
  const prev = `${outDir}/preview/${c.id}.mp4`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', full, '-an', '-vf', 'scale=432:768:flags=lanczos', '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', prev]);
  console.log(c.id, 'full', (statSync(full).size / 1e6).toFixed(1) + 'MB', 'preview', (statSync(prev).size / 1e6).toFixed(2) + 'MB');
}

// Lay library sounds under the voice: trim, normalise each to -1 dB peak, apply its gain, short fades,
// line its peak up with the word, then limit the mix so it never peaks above -1 dB.
function mixSfx(full, sfx) {
  const lib = path.resolve('../sfx');
  const ins = [], filt = [];
  sfx.forEach((x, i) => {
    const [a, b, peak] = x.trim;
    const src = `${lib}/${x.file}`;
    const err = execFileSync('bash', ['-c', `ffmpeg -hide_banner -ss ${a} -t ${b - a} -i "${src}" -af volumedetect -f null - 2>&1 | grep max_volume`]).toString();
    const max = parseFloat(err.split('max_volume:')[1]);
    const gain = -1 - max + x.gainDb;
    const delay = Math.max(0, Math.round((x.peakAt - (peak - a)) * 1000));
    const len = b - a;
    ins.push('-i', src);
    filt.push(`[${i + 1}:a]atrim=${a}:${b},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo,volume=${gain.toFixed(2)}dB,afade=t=in:d=0.005,afade=t=out:st=${(len - 0.15).toFixed(3)}:d=0.15,adelay=${delay}|${delay}[s${i}]`);
  });
  const mix = `[0:a]aformat=sample_rates=48000:channel_layouts=stereo[v];[v]${sfx.map((_, i) => `[s${i}]`).join('')}amix=inputs=${sfx.length + 1}:normalize=0:duration=first,alimiter=limit=0.87:level=false[out]`;
  const tmp = full.replace('.mp4', '.mix.mp4');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', full, ...ins, '-filter_complex', filt.join(';') + ';' + mix, '-map', '0:v', '-map', '[out]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', tmp]);
  execFileSync('mv', [tmp, full]);
}
