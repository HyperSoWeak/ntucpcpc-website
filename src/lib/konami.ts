export const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
] as const;

export function createKonamiDetector(onFire: (count: number) => void) {
  let progress = 0;
  let count = 0;

  function handleKey(e: KeyboardEvent) {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = KONAMI_SEQUENCE[progress];
    if (key === expected) {
      progress += 1;
      if (progress === KONAMI_SEQUENCE.length) {
        count += 1;
        onFire(count);
        progress = 0;
      }
    } else {
      progress = key === KONAMI_SEQUENCE[0] ? 1 : 0;
    }
  }

  return { handleKey, reset() { progress = 0; } };
}

export function attachKonami(onFire: (count: number) => void): () => void {
  const det = createKonamiDetector(onFire);
  const handler = (e: KeyboardEvent) => det.handleKey(e);
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}
