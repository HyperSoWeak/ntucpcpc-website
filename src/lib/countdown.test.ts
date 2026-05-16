import { describe, it, expect } from 'vitest';
import { formatRemaining, getState } from './countdown';

describe('formatRemaining', () => {
  it('formats days hours minutes seconds', () => {
    const ms = ((2 * 24 + 14) * 60 + 36) * 60_000 + 21_000;
    expect(formatRemaining(ms)).toBe('02d 14h 36m 21s');
  });
  it('zero pads single digits', () => {
    expect(formatRemaining(((1) * 60 + 2) * 60_000 + 3_000)).toBe('00d 01h 02m 03s');
  });
  it('clamps negative to zero', () => {
    expect(formatRemaining(-5000)).toBe('00d 00h 00m 00s');
  });
});

describe('getState', () => {
  const open = new Date('2026-05-18T00:00:00+08:00');
  const close = new Date('2026-07-12T23:59:59+08:00');

  it('before open', () => {
    expect(getState(new Date('2026-05-01'), open, close)).toBe('pending');
  });
  it('during open', () => {
    expect(getState(new Date('2026-06-01'), open, close)).toBe('open');
  });
  it('after close', () => {
    expect(getState(new Date('2026-08-01'), open, close)).toBe('closed');
  });
});
