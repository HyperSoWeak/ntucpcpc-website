const VERDICTS = ['[Compiling...]', '[AC]', '[WA]', '[TLE]', '[MLE]', '[PE]', '[RE]'];

export function installTabTitle(): void {
  if (typeof document === 'undefined') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const original = document.title;
  let timer: number | null = null;
  let idx = 0;

  function tick() {
    document.title = VERDICTS[idx % VERDICTS.length];
    idx += 1;
  }

  function onVisibility() {
    if (document.hidden) {
      tick();
      timer = window.setInterval(tick, 2000);
    } else {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
      document.title = original;
      idx = 0;
    }
  }

  document.addEventListener('visibilitychange', onVisibility);
}
