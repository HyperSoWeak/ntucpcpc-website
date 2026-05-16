import { SITE } from './config';

export interface Result {
  lines: string[];
  action?:
    | 'clear'
    | 'exit'
    | `launch:${'tetris' | 'rhythm'}`
    | `scroll:${string}`
    | `external:${string}`;
}

type Handler = (args: string[]) => Result;

const registry = new Map<string, Handler>();

export const sections = [
  'hero', 'purpose', 'schedule', 'register',
  'rules', 'tech', 'team', 'sponsors', 'contact',
];

export function register(name: string, fn: Handler): void {
  registry.set(name, fn);
}

export function run(input: string): Result {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return { lines: [] };
  const [cmd, ...args] = trimmed.split(/\s+/);

  if (cmd === 'sudo') {
    return { lines: ['permission denied: are you a 工作人員 ?'] };
  }

  const handler = registry.get(cmd);
  if (!handler) {
    return { lines: [`${cmd}: command not found. try 'help'.`] };
  }
  return handler(args);
}

register('help', () => ({
  lines: [
    'available commands:',
    '  help        — show this message',
    '  about       — about NTUCPC',
    '  whoami      — print effective user',
    '  ls          — list sections',
    '  cd <id>     — scroll to a section',
    '  tetris      — launch tetris',
    '  rhythm      — launch rhythm game',
    '  register    — open registration form',
    '  sudo <cmd>  — go on, try it',
    '  clear       — clear output',
    '  exit        — close prompt',
  ],
}));

register('about', () => ({
  lines: [
    '臺大程式解題社 (NTUCPC) — established to keep',
    'competitive programming alive among taiwanese students.',
    'this competition (NTUCPCPC) targets high-school and below.',
  ],
}));

register('whoami', () => ({ lines: ['guest@ntucpcpc'] }));

register('ls', () => ({ lines: [sections.join('  ')] }));

register('cd', (args) => {
  const target = args[0];
  if (!target) return { lines: ['cd: missing operand. try `ls`.'] };
  if (!sections.includes(target)) {
    return { lines: [`cd: ${target}: no such section`] };
  }
  return { lines: [`→ #${target}`], action: `scroll:${target}` };
});

register('tetris', () => ({ lines: ['launching tetris...'], action: 'launch:tetris' }));
register('rhythm', () => ({ lines: ['launching rhythm...'], action: 'launch:rhythm' }));

register('register', () => ({
  lines: [`opening ${SITE.registerUrl} ...`],
  action: `external:${SITE.registerUrl}`,
}));

register('clear', () => ({ lines: [], action: 'clear' }));
register('exit', () => ({ lines: [], action: 'exit' }));
