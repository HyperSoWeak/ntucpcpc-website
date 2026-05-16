import { describe, it, expect } from 'vitest';
import { judge, scoreFor, gradeFor } from './rhythm';

describe('judge', () => {
  it('perfect within 30ms', () => {
    expect(judge(0)).toBe('perfect');
    expect(judge(29)).toBe('perfect');
    expect(judge(-29)).toBe('perfect');
  });
  it('great within 60ms', () => {
    expect(judge(45)).toBe('great');
    expect(judge(-45)).toBe('great');
  });
  it('good within 100ms', () => {
    expect(judge(90)).toBe('good');
  });
  it('miss otherwise', () => {
    expect(judge(150)).toBe('miss');
  });
});

describe('scoreFor', () => {
  it('p=100 g=70 gd=30 m=0', () => {
    expect(scoreFor('perfect')).toBe(100);
    expect(scoreFor('great')).toBe(70);
    expect(scoreFor('good')).toBe(30);
    expect(scoreFor('miss')).toBe(0);
  });
});

describe('gradeFor', () => {
  it('S >= 95%', () => {
    expect(gradeFor(95)).toBe('S');
    expect(gradeFor(100)).toBe('S');
  });
  it('A >= 85%', () => {
    expect(gradeFor(85)).toBe('A');
    expect(gradeFor(94)).toBe('A');
  });
  it('B >= 70%', () => {
    expect(gradeFor(70)).toBe('B');
    expect(gradeFor(84)).toBe('B');
  });
  it('C below', () => {
    expect(gradeFor(50)).toBe('C');
    expect(gradeFor(0)).toBe('C');
  });
});
