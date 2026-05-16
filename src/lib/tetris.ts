export const ROWS = 20;
export const COLS = 10;

export type Cell = number; // 0 empty, 1..7 piece color id
export type Board = Cell[][];

export interface Shape {
  rotations: number[][][];
  color: number;
}

function rotateCW(m: number[][]): number[][] {
  const rows = m.length, cols = m[0].length;
  const r: number[][] = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++)
      r[x][rows - 1 - y] = m[y][x];
  return r;
}

function rot(base: number[][]): number[][][] {
  const out: number[][][] = [base];
  for (let i = 0; i < 3; i++) {
    out.push(rotateCW(out[out.length - 1]));
  }
  return out;
}

export const SHAPES: Record<string, Shape> = {
  I: { color: 1, rotations: rot([[1,1,1,1]]) },
  O: { color: 2, rotations: [[[1,1],[1,1]]] },
  T: { color: 3, rotations: rot([[0,1,0],[1,1,1]]) },
  S: { color: 4, rotations: rot([[0,1,1],[1,1,0]]) },
  Z: { color: 5, rotations: rot([[1,1,0],[0,1,1]]) },
  J: { color: 6, rotations: rot([[1,0,0],[1,1,1]]) },
  L: { color: 7, rotations: rot([[0,0,1],[1,1,1]]) },
};

export const SHAPE_KEYS = Object.keys(SHAPES);

export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

export function clearFullRows(board: Board): { board: Board; cleared: number } {
  const next: Board = [];
  let cleared = 0;
  for (const row of board) {
    if (row.every(c => c !== 0)) cleared += 1;
    else next.push([...row]);
  }
  while (next.length < ROWS) next.unshift(new Array(COLS).fill(0));
  return { board: next, cleared };
}

export function scoreForLines(n: number): number {
  return [0, 100, 300, 500, 800][n] ?? 0;
}

export function randomBag(rand: () => number = Math.random): number[] {
  const ids = SHAPE_KEYS.map((_, i) => i);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

export interface Piece { id: number; x: number; y: number; rot: number; }

export function shapeMatrix(p: Piece): number[][] {
  const key = SHAPE_KEYS[p.id];
  return SHAPES[key].rotations[p.rot % SHAPES[key].rotations.length];
}

export function colorOf(id: number): number {
  return SHAPES[SHAPE_KEYS[id]].color;
}

export function collides(board: Board, p: Piece): boolean {
  const m = shapeMatrix(p);
  for (let dy = 0; dy < m.length; dy++) {
    for (let dx = 0; dx < m[dy].length; dx++) {
      if (!m[dy][dx]) continue;
      const x = p.x + dx, y = p.y + dy;
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y >= 0 && board[y][x] !== 0) return true;
    }
  }
  return false;
}

export function merge(board: Board, p: Piece): Board {
  const next = board.map(r => [...r]);
  const m = shapeMatrix(p);
  const c = colorOf(p.id);
  for (let dy = 0; dy < m.length; dy++) {
    for (let dx = 0; dx < m[dy].length; dx++) {
      if (m[dy][dx]) {
        const x = p.x + dx, y = p.y + dy;
        if (y >= 0) next[y][x] = c;
      }
    }
  }
  return next;
}

export function spawnPiece(id: number): Piece {
  return { id, x: 3, y: -1, rot: 0 };
}

export function levelFor(lines: number): number {
  return 1 + Math.floor(lines / 10);
}

export function dropIntervalMs(level: number): number {
  return Math.max(80, 800 - (level - 1) * 60);
}
