import { CHART, SONG_LENGTH_MS } from './rhythm-chart';
import { type Judgment, judge, scoreFor, gradeFor } from './rhythm';
import { RhythmRenderer } from './rhythm-render';
import { createRhythmAudio, hitSound } from './rhythm-audio';

interface Options {
  canvas: HTMLCanvasElement;
  onUpdate: (s: {
    score: number; combo: number; lastJudge: Judgment | null;
    perfect: number; great: number; good: number; miss: number;
  }) => void;
  onEnd: (final: { score: number; percent: number; grade: string }) => void;
}

const BEST_KEY = 'ntucpcpc.rhythm.high';

export function startRhythm(opts: Options) {
  const ctx = opts.canvas.getContext('2d')!;
  const renderer = new RhythmRenderer(ctx, CHART);
  const audio = createRhythmAudio();
  const hits = new Map<number, Judgment>();
  let score = 0, combo = 0, perfect = 0, great = 0, good = 0, miss = 0;
  let raf = 0, ended = false;
  const LANE_KEYS: Record<string, 0 | 1 | 2 | 3> = {
    d: 0, f: 1, j: 2, k: 3,
  };

  function update(j: Judgment) {
    score += scoreFor(j);
    if (j === 'miss') combo = 0;
    else combo += 1;
    if (j === 'perfect') perfect++;
    else if (j === 'great') great++;
    else if (j === 'good') good++;
    else miss++;
    opts.onUpdate({ score, combo, lastJudge: j, perfect, great, good, miss });
  }

  function onKey(e: KeyboardEvent) {
    if (ended) return;
    const lane = LANE_KEYS[e.key.toLowerCase()];
    if (lane === undefined) return;
    e.preventDefault();
    const now = audio.elapsed();
    let bestI = -1, bestDt = Infinity;
    for (let i = 0; i < CHART.length; i++) {
      if (hits.has(i)) continue;
      const n = CHART[i];
      if (n.lane !== lane) continue;
      const dt = Math.abs(n.time - now);
      if (dt < bestDt) { bestDt = dt; bestI = i; }
      if (n.time - now > 200) break;
    }
    if (bestI >= 0 && bestDt <= 100) {
      const j = judge(CHART[bestI].time - now);
      hits.set(bestI, j);
      try { hitSound(); } catch {}
      update(j);
    }
  }

  function frame() {
    const t = audio.elapsed();
    for (let i = 0; i < CHART.length; i++) {
      if (hits.has(i)) continue;
      if (t - CHART[i].time > 100) { hits.set(i, 'miss'); update('miss'); }
    }
    renderer.draw(t, hits);
    if (t > SONG_LENGTH_MS + 1500) {
      ended = true;
      window.removeEventListener('keydown', onKey);
      const maxScore = CHART.length * 100;
      const percent = (score / maxScore) * 100;
      const grade = gradeFor(percent);
      const best = Number(localStorage.getItem(BEST_KEY) ?? 0);
      if (score > best) localStorage.setItem(BEST_KEY, String(score));
      opts.onEnd({ score, percent, grade });
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    audio.start(2000);
    window.addEventListener('keydown', onKey);
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    ended = true;
    cancelAnimationFrame(raf);
    audio.stop();
    window.removeEventListener('keydown', onKey);
  }

  return { start, stop };
}
