import { MELODY_HZ, BEAT_MS } from './rhythm-chart';

export function createRhythmAudio() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  let stopFns: (() => void)[] = [];
  let started = 0;

  function start(leadInMs = 2000) {
    const t0 = ctx.currentTime + leadInMs / 1000;
    started = performance.now() + leadInMs;
    MELODY_HZ.forEach((hz, i) => {
      if (hz === 0) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = hz;
      const startAt = t0 + i * (BEAT_MS / 1000);
      const dur = (BEAT_MS / 1000) * 0.8;
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(0.04, startAt + 0.01);
      gain.gain.linearRampToValueAtTime(0, startAt + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + dur);
      stopFns.push(() => { try { osc.stop(); } catch {} });
    });
  }

  function elapsed(): number {
    return performance.now() - started;
  }

  function stop() {
    stopFns.forEach(f => f());
    stopFns = [];
    try { ctx.close(); } catch {}
  }

  return { start, elapsed, stop };
}

export function hitSound() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 800;
  gain.gain.value = 0.03;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
  setTimeout(() => ctx.close(), 100);
}
