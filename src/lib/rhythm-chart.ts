import type { Note } from './rhythm';

export const MELODY_HZ = [
  392, 0, 392, 440, 494, 0, 494, 440,
  392, 0, 587, 587, 523, 494, 440, 0,
  392, 0, 392, 440, 494, 0, 494, 523,
  587, 659, 659, 587, 523, 494, 440, 0,
  330, 392, 494, 587, 659, 587, 494, 392,
  330, 392, 494, 587, 659, 587, 494, 0,
  392, 0, 392, 440, 494, 0, 494, 440,
  392, 0, 587, 587, 523, 494, 440, 0,
];

export const BEAT_MS = 500;
export const SONG_LENGTH_MS = MELODY_HZ.length * BEAT_MS;

export const CHART: Note[] = MELODY_HZ.flatMap((hz, i) => {
  if (hz === 0) return [];
  const lane = ((Math.floor(hz / 50) + i) % 4) as 0 | 1 | 2 | 3;
  return [{ time: i * BEAT_MS + 2000, lane }];
});
