import {
  type Board, type Piece, createBoard, randomBag, spawnPiece,
  collides, merge, clearFullRows, scoreForLines, levelFor, dropIntervalMs,
} from './tetris';
import { TetrisRenderer } from './tetris-render';
import { createBeeper } from './tetris-audio';

interface Options {
  canvas: HTMLCanvasElement;
  nextCanvas: HTMLCanvasElement;
  onScore: (s: { score: number; lines: number; level: number; best: number }) => void;
  onGameOver: (final: { score: number }) => void;
}

const BEST_KEY = 'ntucpcpc.tetris.high';

export function startTetris(opts: Options) {
  const ctx = opts.canvas.getContext('2d')!;
  const nextCtx = opts.nextCanvas.getContext('2d')!;
  const cell = Math.floor(opts.canvas.width / 10);
  const renderer = new TetrisRenderer(ctx, cell);
  const beep = createBeeper();

  let board: Board = createBoard();
  let bag: number[] = [];
  let piece: Piece | null = null;
  let nextId = 0;
  let score = 0, lines = 0, paused = false, over = false;
  let best = Number(localStorage.getItem(BEST_KEY) ?? 0);
  let timer: number | null = null;

  function nextFromBag(): number {
    if (bag.length === 0) bag = randomBag();
    return bag.shift()!;
  }

  function pushScore() {
    best = Math.max(best, score);
    opts.onScore({ score, lines, level: levelFor(lines), best });
  }

  function spawn() {
    piece = spawnPiece(nextId);
    nextId = nextFromBag();
    renderer.drawNext(nextId, nextCtx);
    if (collides(board, piece)) {
      over = true;
      stop();
      best = Math.max(best, score);
      localStorage.setItem(BEST_KEY, String(best));
      try { beep.gameOver(); } catch {}
      opts.onGameOver({ score });
    }
  }

  function tick() {
    if (paused || over || !piece) return;
    const moved = { ...piece, y: piece.y + 1 };
    if (collides(board, moved)) {
      board = merge(board, piece);
      const r = clearFullRows(board);
      board = r.board;
      if (r.cleared > 0) {
        lines += r.cleared;
        score += scoreForLines(r.cleared);
        try { beep.clear(r.cleared); } catch {}
        if (timer !== null) {
          clearInterval(timer);
          timer = window.setInterval(tick, dropIntervalMs(levelFor(lines)));
        }
      }
      pushScore();
      spawn();
    } else {
      piece = moved;
    }
    renderer.draw(board, piece);
  }

  function move(dx: number) {
    if (!piece || paused || over) return;
    const m = { ...piece, x: piece.x + dx };
    if (!collides(board, m)) { piece = m; try { beep.move(); } catch {}; renderer.draw(board, piece); }
  }

  function softDrop() {
    if (!piece || paused || over) return;
    const m = { ...piece, y: piece.y + 1 };
    if (!collides(board, m)) { piece = m; score += 1; pushScore(); renderer.draw(board, piece); }
  }

  function hardDrop() {
    if (!piece || paused || over) return;
    let dy = 0;
    while (!collides(board, { ...piece, y: piece.y + dy + 1 })) dy += 1;
    piece = { ...piece, y: piece.y + dy };
    score += dy * 2;
    try { beep.drop(); } catch {}
    pushScore();
    renderer.draw(board, piece);
    tick();
  }

  function rotate() {
    if (!piece || paused || over) return;
    const m = { ...piece, rot: piece.rot + 1 };
    if (!collides(board, m)) { piece = m; try { beep.rotate(); } catch {}; renderer.draw(board, piece); }
  }

  function togglePause() {
    if (over) return;
    paused = !paused;
  }

  function onKey(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowLeft':  e.preventDefault(); move(-1); break;
      case 'ArrowRight': e.preventDefault(); move(1); break;
      case 'ArrowDown':  e.preventDefault(); softDrop(); break;
      case 'ArrowUp':    e.preventDefault(); rotate(); break;
      case ' ':          e.preventDefault(); hardDrop(); break;
      case 'p': case 'P': togglePause(); break;
    }
  }

  function start() {
    score = 0; lines = 0; paused = false; over = false;
    board = createBoard();
    bag = randomBag();
    nextId = nextFromBag();
    spawn();
    pushScore();
    renderer.draw(board, piece);
    if (timer !== null) clearInterval(timer);
    timer = window.setInterval(tick, dropIntervalMs(1));
    window.addEventListener('keydown', onKey);
  }

  function stop() {
    if (timer !== null) { clearInterval(timer); timer = null; }
    window.removeEventListener('keydown', onKey);
  }

  return { start, stop, restart: start };
}
