import type { Note } from './rhythm';

const LANE_KEYS = ['D', 'F', 'J', 'K'];

export class RhythmRenderer {
  constructor(private ctx: CanvasRenderingContext2D, private chart: Note[]) {}

  draw(elapsedMs: number, hits: Map<number, string>) {
    const c = this.ctx;
    const w = c.canvas.width, h = c.canvas.height;
    const laneW = w / 4;
    const judgeY = h - 80;
    const fallMs = 1200;

    c.fillStyle = this.cssVar('--surface-2');
    c.fillRect(0, 0, w, h);

    c.strokeStyle = this.cssVar('--border');
    c.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      c.beginPath(); c.moveTo(i * laneW, 0); c.lineTo(i * laneW, h); c.stroke();
    }

    c.strokeStyle = this.cssVar('--accent');
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(0, judgeY); c.lineTo(w, judgeY); c.stroke();

    c.fillStyle = this.cssVar('--fg-dim');
    c.font = '14px ui-monospace, monospace';
    c.textAlign = 'center';
    LANE_KEYS.forEach((k, i) => c.fillText(k, i * laneW + laneW / 2, h - 30));

    for (let i = 0; i < this.chart.length; i++) {
      const n = this.chart[i];
      const dt = n.time - elapsedMs;
      if (dt > fallMs || dt < -200) continue;
      const y = judgeY - (dt / fallMs) * judgeY;
      const x = n.lane * laneW + 10;
      const noteW = laneW - 20;
      const hit = hits.get(i);
      c.fillStyle = hit
        ? (hit === 'miss' ? this.cssVar('--error') : this.cssVar('--accent'))
        : this.cssVar('--tetris-2');
      c.fillRect(x, y - 8, noteW, 16);
    }
  }

  private cssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#34d399';
  }
}
