import { describe, it, expect, vi } from 'vitest';
import { createKonamiDetector, KONAMI_SEQUENCE } from './konami';

function dispatch(detector: ReturnType<typeof createKonamiDetector>, keys: readonly string[]) {
  keys.forEach(key => detector.handleKey({ key } as KeyboardEvent));
}

describe('konami', () => {
  it('fires callback on complete sequence', () => {
    const cb = vi.fn();
    const det = createKonamiDetector(cb);
    dispatch(det, KONAMI_SEQUENCE);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('does not fire on partial', () => {
    const cb = vi.fn();
    const det = createKonamiDetector(cb);
    dispatch(det, KONAMI_SEQUENCE.slice(0, 5));
    expect(cb).not.toHaveBeenCalled();
  });

  it('does not fire on wrong sequence', () => {
    const cb = vi.fn();
    const det = createKonamiDetector(cb);
    dispatch(det, ['a','a','a','a','a','a','a','a','a','a']);
    expect(cb).not.toHaveBeenCalled();
  });

  it('resets on wrong key', () => {
    const cb = vi.fn();
    const det = createKonamiDetector(cb);
    dispatch(det, ['ArrowUp', 'ArrowUp', 'x']);
    dispatch(det, KONAMI_SEQUENCE);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('counts invocations', () => {
    const cb = vi.fn();
    const det = createKonamiDetector(cb);
    dispatch(det, KONAMI_SEQUENCE);
    dispatch(det, KONAMI_SEQUENCE);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb.mock.calls[1][0]).toBe(2);
  });
});
