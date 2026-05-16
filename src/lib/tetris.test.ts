import { describe, it, expect } from 'vitest';
import { createBoard, clearFullRows, scoreForLines, SHAPES, randomBag } from './tetris';

describe('createBoard', () => {
  it('returns 20 rows x 10 cols of zero', () => {
    const b = createBoard();
    expect(b.length).toBe(20);
    expect(b[0].length).toBe(10);
    expect(b[0][0]).toBe(0);
  });
});

describe('clearFullRows', () => {
  it('clears full rows and returns count', () => {
    const b = createBoard();
    b[19] = new Array(10).fill(1);
    const { board, cleared } = clearFullRows(b);
    expect(cleared).toBe(1);
    expect(board[19].every(v => v === 0)).toBe(true);
  });

  it('returns 0 cleared when no full row', () => {
    const b = createBoard();
    expect(clearFullRows(b).cleared).toBe(0);
  });

  it('clears multiple', () => {
    const b = createBoard();
    b[18] = new Array(10).fill(2);
    b[19] = new Array(10).fill(1);
    expect(clearFullRows(b).cleared).toBe(2);
  });
});

describe('scoreForLines', () => {
  it('100 / 300 / 500 / 800', () => {
    expect(scoreForLines(1)).toBe(100);
    expect(scoreForLines(2)).toBe(300);
    expect(scoreForLines(3)).toBe(500);
    expect(scoreForLines(4)).toBe(800);
    expect(scoreForLines(0)).toBe(0);
  });
});

describe('SHAPES', () => {
  it('has 7 tetrominoes', () => {
    expect(Object.keys(SHAPES).length).toBe(7);
  });
});

describe('randomBag', () => {
  it('returns permutation of 7 ids', () => {
    const bag = randomBag(() => 0.5);
    expect(bag.length).toBe(7);
    expect(new Set(bag).size).toBe(7);
    expect(bag.every(n => n >= 0 && n < 7)).toBe(true);
  });
});
