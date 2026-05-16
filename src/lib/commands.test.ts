import { describe, it, expect, vi, beforeEach } from 'vitest';
import { run, register, sections } from './commands';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('run', () => {
  it('returns help text when called with help', () => {
    const out = run('help');
    expect(out.lines.join('\n')).toMatch(/available commands/i);
    expect(out.lines.join('\n')).toMatch(/tetris/);
  });

  it('returns whoami', () => {
    expect(run('whoami').lines).toEqual(['guest@ntucpcpc']);
  });

  it('lists sections on ls', () => {
    expect(run('ls').lines.join(' ')).toContain('schedule');
  });

  it('returns permission denied for sudo', () => {
    expect(run('sudo rm -rf /').lines[0]).toMatch(/permission denied/i);
  });

  it('returns command not found for unknown', () => {
    expect(run('flarp').lines[0]).toMatch(/command not found/i);
  });

  it('clear returns special marker', () => {
    expect(run('clear').action).toBe('clear');
  });

  it('exit returns special marker', () => {
    expect(run('exit').action).toBe('exit');
  });

  it('tetris returns launch marker', () => {
    expect(run('tetris').action).toBe('launch:tetris');
  });

  it('rhythm returns launch marker', () => {
    expect(run('rhythm').action).toBe('launch:rhythm');
  });

  it('cd schedule returns scroll marker', () => {
    expect(run('cd schedule').action).toBe('scroll:schedule');
  });

  it('register returns external marker', () => {
    const out = run('register');
    expect(out.action).toMatch(/^external:/);
  });

  it('trims whitespace and is case-insensitive', () => {
    expect(run('  HELP  ').lines.join('\n')).toMatch(/available commands/i);
  });
});

describe('custom registration', () => {
  it('can register a new command', () => {
    register('hello', () => ({ lines: ['hi'] }));
    expect(run('hello').lines).toEqual(['hi']);
  });
});

describe('sections', () => {
  it('contains required ids', () => {
    expect(sections).toEqual(
      expect.arrayContaining(['hero', 'schedule', 'register', 'rules', 'contact'])
    );
  });
});
