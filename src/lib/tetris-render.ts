import { type Board, type Piece, shapeMatrix, colorOf, ROWS, COLS } from './tetris';

const COLORS = ['transparent', '--tetris-1','--tetris-2','--tetris-3','--tetris-4','--tetris-5','--tetris-6','--tetris-7'];

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#34d399';
}

export class TetrisRenderer {
  private cellSize: number;
  constructor(private ctx: CanvasRenderingContext2D, cell: number) {
    this.cellSize = cell;
  }
  draw(board: Board, piece: Piece | null) {
    const cs = this.cellSize;
    this.ctx.fillStyle = cssVar('--surface-2');
    this.ctx.fillRect(0, 0, COLS * cs, ROWS * cs);
    this.ctx.strokeStyle = cssVar('--border-soft') || '#1f293780';
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * cs, 0); this.ctx.lineTo(x * cs, ROWS * cs); this.ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * cs); this.ctx.lineTo(COLS * cs, y * cs); this.ctx.stroke();
    }
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++)
        if (board[y][x]) this.drawCell(x, y, board[y][x]);
    if (piece) {
      const m = shapeMatrix(piece);
      const c = colorOf(piece.id);
      for (let dy = 0; dy < m.length; dy++)
        for (let dx = 0; dx < m[dy].length; dx++)
          if (m[dy][dx] && piece.y + dy >= 0) this.drawCell(piece.x + dx, piece.y + dy, c);
    }
  }
  private drawCell(x: number, y: number, color: number) {
    const cs = this.cellSize;
    this.ctx.fillStyle = cssVar(COLORS[color]);
    this.ctx.fillRect(x * cs + 1, y * cs + 1, cs - 2, cs - 2);
  }
  drawNext(next: number, ctx: CanvasRenderingContext2D, size = 20) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const m = shapeMatrix({ id: next, x: 0, y: 0, rot: 0 });
    const c = colorOf(next);
    for (let dy = 0; dy < m.length; dy++)
      for (let dx = 0; dx < m[dy].length; dx++)
        if (m[dy][dx]) {
          ctx.fillStyle = cssVar(COLORS[c]);
          ctx.fillRect(dx * size + 1, dy * size + 1, size - 2, size - 2);
        }
  }
}
