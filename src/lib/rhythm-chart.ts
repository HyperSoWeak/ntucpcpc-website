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

export const BEAT_MS = 250;
const LOOPS = 3;
export const SONG_LENGTH_MS = MELODY_HZ.length * BEAT_MS * LOOPS;

type Lane = 0 | 1 | 2 | 3;
const lane4 = (n: number): Lane => ((n % 4 + 4) % 4) as Lane;
const t = (beat: number, loop: number) =>
  Math.round((loop * MELODY_HZ.length + beat) * BEAT_MS) + 2000;

function buildLoop(loop: number): Note[] {
  const notes: Note[] = [];
  const add = (beat: number, l: Lane) => notes.push({ time: t(beat, loop), lane: l });

  MELODY_HZ.forEach((hz, i) => {
    if (hz === 0) return;
    const base = lane4(Math.floor(hz / 50) + i);
    add(i, base);

    // chord every 8 beats (section accents), gets denser each loop
    if (i % 8 === 0) {
      add(i, lane4(base + 2));
      if (loop >= 2) add(i, lane4(base + 1)); // triple on loop 3
    }

    // 8th-note fill after every note in loop 2+, only on gaps in loop 1
    const nextSilent = MELODY_HZ[i + 1] === 0 || MELODY_HZ[i + 1] === undefined;
    if (nextSilent || loop >= 1) {
      add(i + 0.5, lane4(base + 1));
    }

    // 16th-note fill in loop 3
    if (loop >= 2) {
      add(i + 0.25, lane4(base + 3));
      if (nextSilent) add(i + 0.75, lane4(base + 2));
    }
  });

  // Ascending burst at phrase starts
  [0, 32].forEach(start => {
    ([0.25, 0.5, 0.75] as const).forEach((off, k) => {
      add(start + off, k as Lane);
    });
    if (loop >= 1) add(start + 1, 3);
  });

  // Triple chord at phrase ends
  [31, 63].forEach(beat => {
    ([0, 1, 2] as const).forEach(k => add(beat, k as Lane));
    if (loop >= 2) add(beat, 3);
  });

  return notes;
}

const allNotes: Note[] = [];
for (let loop = 0; loop < LOOPS; loop++) {
  allNotes.push(...buildLoop(loop));
}
allNotes.sort((a, b) => a.time - b.time);

export const CHART: Note[] = allNotes;
