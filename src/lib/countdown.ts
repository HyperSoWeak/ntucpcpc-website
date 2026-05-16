export type RegState = 'pending' | 'open' | 'closed';

export function getState(now: Date, open: Date, close: Date): RegState {
  if (now < open) return 'pending';
  if (now > close) return 'closed';
  return 'open';
}

export function formatRemaining(ms: number): string {
  const t = Math.max(0, ms);
  const d = Math.floor(t / 86_400_000);
  const h = Math.floor(t / 3_600_000) % 24;
  const m = Math.floor(t / 60_000) % 60;
  const s = Math.floor(t / 1_000) % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d)}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}
