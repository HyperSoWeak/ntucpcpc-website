export type Judgment = 'perfect' | 'great' | 'good' | 'miss';
export type Grade = 'S' | 'A' | 'B' | 'C';

export const WINDOWS = { perfect: 22, great: 50, good: 85 };

export function judge(deltaMs: number): Judgment {
  const a = Math.abs(deltaMs);
  if (a <= WINDOWS.perfect) return 'perfect';
  if (a <= WINDOWS.great) return 'great';
  if (a <= WINDOWS.good) return 'good';
  return 'miss';
}

export function scoreFor(j: Judgment): number {
  return ({ perfect: 100, great: 70, good: 30, miss: 0 } as const)[j];
}

export function gradeFor(percent: number): Grade {
  if (percent >= 95) return 'S';
  if (percent >= 85) return 'A';
  if (percent >= 70) return 'B';
  return 'C';
}

export interface Note { time: number; lane: 0 | 1 | 2 | 3; }
