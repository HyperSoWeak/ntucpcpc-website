export function createBeeper() {
  let ctx: AudioContext | null = null;
  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctx;
  }
  function beep(freq: number, durMs: number, vol = 0.05) {
    const ac = ensure();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + durMs / 1000);
  }
  return {
    move: () => beep(220, 30),
    rotate: () => beep(330, 40),
    drop: () => beep(120, 80),
    clear: (lines: number) => {
      const base = 440 + lines * 110;
      beep(base, 100);
      setTimeout(() => beep(base * 1.5, 100), 60);
    },
    gameOver: () => {
      beep(220, 200);
      setTimeout(() => beep(150, 300), 150);
    },
  };
}
