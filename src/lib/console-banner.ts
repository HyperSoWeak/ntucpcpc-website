import { run } from './commands';

const BANNER = `
 _   _ _____ _   _  ____ ____   ____ ____   ____
| \\ | |_   _| | | |/ ___|  _ \\ / ___|  _ \\ / ___|
|  \\| | | | | | | | |   | |_) | |   | |_) | |
| |\\  | | | | |_| | |___|  __/| |___|  __/| |___
|_| \\_| |_|  \\___/ \\____|_|    \\____|_|    \\____|

  程式解題社程式解題競賽  ·  2026
`;

const WARN = '⚠ 不要將不明來源的程式碼貼進這個 console。';
const HINT = '> try help() to see hidden commands, or use the prompt at the bottom of the page.';

export function installConsoleBanner(): void {
  if (typeof window === 'undefined') return;
  const accent = 'color:#34d399;font-family:ui-monospace,monospace;';
  const dim = 'color:#8b97a8;font-family:ui-monospace,monospace;';
  const warn = 'color:#fbbf24;font-weight:bold;';
  console.log(`%c${BANNER}`, accent);
  console.log(`%c${WARN}`, warn);
  console.log(`%c${HINT}`, dim);

  (window as any).help = () => {
    const out = run('help');
    out.lines.forEach(l => console.log(`%c${l}`, dim));
  };

  ['about', 'whoami', 'ls', 'tetris', 'rhythm', 'register'].forEach(name => {
    (window as any)[name] = () => {
      const out = run(name);
      out.lines.forEach(l => console.log(`%c${l}`, dim));
      if (out.action?.startsWith('launch:')) {
        location.hash = `#${out.action.split(':')[1]}`;
      } else if (out.action?.startsWith('external:')) {
        window.open(out.action.slice('external:'.length), '_blank');
      }
      return undefined;
    };
  });
}
