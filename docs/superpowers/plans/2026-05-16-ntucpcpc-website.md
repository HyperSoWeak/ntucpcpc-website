# NTUCPCPC Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static single-page promotion site for NTUCPCPC 2026 with Astro + TypeScript, modern dark visual (Slate + Emerald), Tetris and mini rhythm game, and nine small easter eggs.

**Architecture:** Astro static build (`astro build → dist/`). Single page `index.astro` composes ~10 `.astro` section components. Interactive bits (footer prompt, mini games, konami, tab-title, console banner) are vanilla TS modules wired up via small Astro client islands. Content lives in `src/content/*.md` and is imported as raw strings via Astro's `?raw` import.

**Tech Stack:** Astro 4.x, TypeScript 5.x, Vitest 1.x (for testable logic), pnpm. No React, no Tailwind, no UI framework. Web Audio for sound, Canvas 2D for games. Spec: `docs/superpowers/specs/2026-05-16-ntucpcpc-website-design.md`.

**Conventions:**
- Conventional commits (`feat:`, `chore:`, `style:`, `test:`...)
- Commit after every task
- TDD for logic-heavy modules (commands, konami, tetris board ops, rhythm scoring, countdown format). Visual components have no unit tests; verified by `pnpm build` succeeding and final manual review

---

## File Structure

```
ntucpcpc-website/
├── .gitignore
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vitest.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── pages/
    │   ├── index.astro
    │   └── 404.astro
    ├── layouts/
    │   └── Base.astro
    ├── components/
    │   ├── Nav.astro
    │   ├── Hero.astro
    │   ├── BootSequence.astro
    │   ├── Countdown.astro
    │   ├── Purpose.astro
    │   ├── Schedule.astro
    │   ├── Register.astro
    │   ├── Rules.astro
    │   ├── TechDetails.astro
    │   ├── Team.astro
    │   ├── Sponsors.astro
    │   ├── Contact.astro
    │   ├── FooterPrompt.astro
    │   ├── TetrisOverlay.astro
    │   └── RhythmOverlay.astro
    ├── content/
    │   ├── purpose.md
    │   ├── rules-prelim.md
    │   ├── rules-final.md
    │   ├── tech.md
    │   ├── team.md
    │   ├── sponsors.md
    │   └── contact.md
    ├── lib/
    │   ├── commands.ts            # dispatcher (E2)
    │   ├── commands.test.ts
    │   ├── console-banner.ts      # E1
    │   ├── konami.ts              # E6
    │   ├── konami.test.ts
    │   ├── tab-title.ts           # E4
    │   ├── countdown.ts
    │   ├── countdown.test.ts
    │   ├── tetris.ts              # game logic
    │   ├── tetris.test.ts
    │   ├── tetris-render.ts       # canvas draw
    │   ├── tetris-audio.ts
    │   ├── rhythm.ts              # scoring logic
    │   ├── rhythm.test.ts
    │   ├── rhythm-render.ts
    │   ├── rhythm-audio.ts
    │   ├── rhythm-chart.ts        # the one song chart
    │   ├── matrix-rain.ts         # E6 visual
    │   └── config.ts              # shared constants (URLs, deadlines)
    └── styles/
        ├── tokens.css             # palette + font + radius vars
        └── global.css             # resets, base typography
```

---

## Task 1: Project init

**Files:**
- Create: `.gitignore`, `package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `public/favicon.svg`, `src/pages/index.astro` (placeholder)

- [ ] **Step 1.1: Initialize git**

```bash
cd /home/hyper/ntu/ntucpc/ntucpcpc-website
git init -b main
```

- [ ] **Step 1.2: Write `.gitignore`**

```
node_modules
dist
.astro
.DS_Store
*.log
.vscode
.idea
```

- [ ] **Step 1.3: Write `package.json`**

```json
{
  "name": "ntucpcpc-website",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "astro": "^4.16.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0",
    "vitest": "^1.6.0",
    "happy-dom": "^14.0.0"
  }
}
```

- [ ] **Step 1.4: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ntucpcpc.ntucpc.org',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
```

- [ ] **Step 1.5: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "*.config.*"]
}
```

- [ ] **Step 1.6: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 1.7: Write `public/favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0b1018"/>
  <text x="6" y="22" font-family="ui-monospace,monospace" font-size="18" fill="#34d399">$_</text>
</svg>
```

- [ ] **Step 1.8: Write placeholder `src/pages/index.astro`**

```astro
---
---
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <title>NTUCPCPC 2026</title>
  </head>
  <body>
    <p>bootstrap ok</p>
  </body>
</html>
```

- [ ] **Step 1.9: Install dependencies**

Run: `pnpm install`
Expected: lockfile created, no errors.

- [ ] **Step 1.10: Build smoke test**

Run: `pnpm build`
Expected: `dist/index.html` produced, no errors.

- [ ] **Step 1.11: Commit**

```bash
git add .
git commit -m "chore: bootstrap astro + typescript + vitest"
```

---

## Task 2: Design tokens + global styles + Base layout (with E7 view-source 註解)

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/lib/config.ts`

- [ ] **Step 2.1: Write `src/lib/config.ts`**

```ts
export const SITE = {
  title: 'NTUCPCPC 2026',
  description: '臺灣大學程式解題社程式解題競賽 2026',
  registerUrl: 'https://forms.gle/REPLACE_ME', // 待補
  email: 'ntucpc@csie.ntu.edu.tw',
  clubUrl: 'https://ntucpc.org/',
} as const;

export const DATES = {
  registerOpen:  new Date('2026-05-18T00:00:00+08:00'),
  registerClose: new Date('2026-07-12T23:59:59+08:00'),
  preliminary:   new Date('2026-07-26T13:00:00+08:00'),
  final:         new Date('2026-08-02T13:00:00+08:00'),
} as const;
```

- [ ] **Step 2.2: Write `src/styles/tokens.css`** (from spec §3)

```css
:root {
  /* Surface */
  --bg:           #0b1018;
  --surface:      #141b26;
  --surface-2:    #1c2433;
  --border:       #1f2937;
  --border-soft:  #1f293780;

  /* Text */
  --fg:           #e5edf5;
  --fg-dim:       #8b97a8;
  --fg-mute:      #525d6e;

  /* Accent */
  --accent:       #34d399;
  --accent-soft:  #34d39920;
  --link:         #7dd3fc;
  --warn:         #fbbf24;
  --error:        #f87171;

  /* Radius / Shadow */
  --radius-sm:    6px;
  --radius-md:    10px;
  --radius-lg:    16px;
  --shadow-card:  0 1px 0 #ffffff08 inset, 0 8px 24px #00000040;

  /* Tetris */
  --tetris-1:     #34d399;
  --tetris-2:     #7dd3fc;
  --tetris-3:     #fbbf24;
  --tetris-4:     #fb7185;
  --tetris-5:     #a78bfa;
  --tetris-6:     #a3e635;
  --tetris-7:     #22d3ee;

  /* Fonts */
  --font-sans:
    'Inter', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei',
    system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono:
    'JetBrains Mono', 'Cascadia Code', 'Sarasa Mono TC',
    ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Layout */
  --content-max: 960px;
}
```

- [ ] **Step 2.3: Write `src/styles/global.css`**

```css
*, *::before, *::after { box-sizing: border-box; }

html, body { margin: 0; padding: 0; }

html {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, #34d39908, transparent 60%),
    var(--bg);
}

a {
  color: var(--link);
  text-decoration: none;
}
a:hover { text-decoration: underline; }
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 2px;
}

h1, h2, h3, h4 {
  font-weight: 600;
  line-height: 1.25;
  margin: 0 0 0.5em;
  letter-spacing: -0.01em;
}
h1 { font-size: 2.75rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }

p { margin: 0 0 1em; }

code, kbd, .mono {
  font-family: var(--font-mono);
  font-size: 0.95em;
}

.container {
  max-width: var(--content-max);
  margin-inline: auto;
  padding-inline: 24px;
}

section {
  padding-block: 96px;
  border-top: 1px solid var(--border-soft);
}
section:first-of-type { border-top: 0; }

.eyebrow {
  font-family: var(--font-mono);
  color: var(--fg-dim);
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-card);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--fg);
  font: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  transition: 150ms ease;
  text-decoration: none;
}
.btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  text-decoration: none;
}
.btn-primary {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}
.btn-primary:hover {
  background: var(--accent);
  color: var(--bg);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 768px) {
  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
  section { padding-block: 64px; }
}
```

- [ ] **Step 2.4: Write `src/layouts/Base.astro`** (includes E7 view-source 註解)

```astro
---
import '@/styles/tokens.css';
import '@/styles/global.css';
import { SITE } from '@/lib/config';

interface Props {
  title?: string;
  description?: string;
}
const { title = SITE.title, description = SITE.description } = Astro.props;
---
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title>{title}</title>
    <!--
      ╔════════════════════════════════════════════════════════════╗
      ║                                                            ║
      ║   you're reading the source. nice.                         ║
      ║                                                            ║
      ║   臺大程式解題社徵社員、徵工程師、徵贊助商。               ║
      ║   寫信來：ntucpc@csie.ntu.edu.tw                           ║
      ║                                                            ║
      ║   hint: try `help` in the prompt at the bottom of the      ║
      ║   page, or open the JS console.                            ║
      ║                                                            ║
      ║   "premature optimization is the root of all evil"         ║
      ║                                  — donald knuth            ║
      ║                                                            ║
      ╚════════════════════════════════════════════════════════════╝
    -->
  </head>
  <body>
    <slot />
    <!-- end of body. if you're still reading, /join us :) -->
  </body>
</html>
```

- [ ] **Step 2.5: Update `src/pages/index.astro` to use Base**

```astro
---
import Base from '@/layouts/Base.astro';
---
<Base>
  <main class="container">
    <h1>NTUCPCPC 2026</h1>
    <p>bootstrap with layout ok</p>
  </main>
</Base>
```

- [ ] **Step 2.6: Build verify**

Run: `pnpm build`
Expected: success.

- [ ] **Step 2.7: Commit**

```bash
git add .
git commit -m "feat: design tokens, global styles, base layout with view-source eggs"
```

---

## Task 3: Extract content markdown

**Files:**
- Create: `src/content/{purpose,rules-prelim,rules-final,tech,team,sponsors,contact}.md`

The source is `NTUCPCPC 比賽資訊.md` at repo root. Preserve the original wording verbatim; only split.

- [ ] **Step 3.1: Write `src/content/purpose.md`**

```markdown
近年來，資訊產業因為大型語言模型的興起而有巨大的轉變，隨著越來越多 AI 工具被應用於實際的開發流程，軟體開發的門檻降低、開發效率越來越高，在資訊產業與科技蓬勃發展的同時，培養資訊人才也面臨巨大的挑戰：新進入資訊產業的人要如何跟上快速發展的時代？過去傳統的培育方法在現今的環境下仍然有效嗎？

即便現今 AI 工具已能輔助許多軟體開發流程，人們已不再需要手工編寫所有程式碼，但我們仍然深信基礎能力的重要，我們相信擁有堅實的程式設計能力、運算思維與演算法知識，更能在這個快速變化的產業之中站穩腳步。雖然程式競賽仍然是舊時代的競賽方式：沒有 AI 工具輔助、參賽者需要完全依靠自己，在甚至不能查詢資料的情況下進行競賽，但我們相信程式競賽對於培養基礎能力有相當大的幫助，更是一項考驗邏輯思考的腦力運動。

隨著時代改變，有許多過去已舉辦多年的程式競賽活動逐漸停辦，我們很擔心學習程式設計的門檻降低的同時，接觸程式競賽的門檻卻越來越高、機會越來越少，程式解題社的宗旨之一是推廣程式競賽，我們認為我們肩負維持程式競賽社群的使命，因此舉辦此競賽，不僅提供大眾參賽機會，更提供選手交流的場所。
```

- [ ] **Step 3.2: Write `src/content/rules-prelim.md`**

```markdown
- 初賽為**線上**進行。
- 競賽中可以使用任意數量的裝置撰寫程式碼作答，所有在競賽過程中使用的裝置皆**必須全程使用主辦方提供之 VPN**。考量到同隊隊員會有溝通的需求，競賽中**可以**使用通訊軟體與同隊隊員溝通，但不可與非同隊隊員交流或使用通訊軟體於跟隊友溝通以外的用途，亦不可訪問其他非競賽系統之網站。主辦方提供之 VPN 會禁止部分容易誤用且理論上沒有通訊軟體功能之連線（例如大型語言模型），請注意 VPN 無直接禁止之連線仍必須遵守此規則。
- **競賽中不可使用大型語言模型，無論是線上或本地模型皆不可使用。**
- 競賽結束後，主辦單位會審查參賽者上傳之程式碼，若判定有抄襲、使用大型語言模型，或有其他違規情形之疑慮，主辦單位有權取消參賽資格且不提供參賽證明。
- 參賽者可於競賽過程中螢幕錄影，並於比賽結束後的規定時間內上傳至指定表單，若主辦單位認為有作弊疑慮，會參考隊伍上傳的螢幕錄影進行判斷。注意即便有上傳完整錄影，主辦單位仍有最終決定權。
- 競賽過程中，可以使用數量不限的紙本資料與本機的電子參考資料，但是禁止複製貼上非比賽中撰寫的程式碼。
- 在比賽中解出至少一題且沒有被取消資格之隊伍，可以獲得**電子**參賽證明。
```

- [ ] **Step 3.3: Write `src/content/rules-final.md`**

```markdown
- 原則上取初賽成績的前 20 至 30 名隊伍進入決賽。
- 主辦單位可以額外邀請**隊員中有 >50% 成員為女生之隊伍**（兩人參賽必須兩人皆為女生，三人參賽須有至少兩名女生）晉級決賽，以 0 至 3 隊為原則。
- 決賽為實體進行，一隊只能使用一台電腦。
- 競賽期間不可使用任何網路資源。
- 可以使用數量不限的紙本資料，唯不得干擾比賽進行。
- 禁止攜帶任何電子資料。
- 可以自己帶食物，比賽現場會提供點心。比賽場地使用之電腦教室內不得飲食，需到教室外面食用。
- 完整參加決賽的隊伍，可以獲得**實體**參賽證明，獲獎隊伍可以得到獎狀。
- 報到時，未滿 18 歲之參賽者需繳交家長同意書。
```

- [ ] **Step 3.4: Write `src/content/tech.md`**

```markdown
- 評測系統：DOMjudge 9.0.0
- 允許使用的程式語言、編譯器與編譯指令：待補
- Server 作業系統：Ubuntu 24.04
```

- [ ] **Step 3.5: Write `src/content/team.md`**

```markdown
- 負責人：臺灣大學程式解題社
- 工作人員：由富有經驗的前高中資訊競賽選手、ICPC 競賽現役及退役選手組成
```

- [ ] **Step 3.6: Write `src/content/sponsors.md`**

```markdown
// TODO: 待補
```

- [ ] **Step 3.7: Write `src/content/contact.md`**

```markdown
Email：[ntucpc@csie.ntu.edu.tw](mailto:ntucpc@csie.ntu.edu.tw)

社團網站：[https://ntucpc.org/](https://ntucpc.org/)
```

- [ ] **Step 3.8: Commit**

```bash
git add src/content/
git commit -m "feat: extract competition info into content/*.md"
```

---

## Task 4: Countdown utility (TDD)

**Files:**
- Create: `src/lib/countdown.ts`, `src/lib/countdown.test.ts`

- [ ] **Step 4.1: Write failing test**

`src/lib/countdown.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { formatRemaining, getState } from './countdown';

describe('formatRemaining', () => {
  it('formats days hours minutes seconds', () => {
    const ms = ((2 * 24 + 14) * 60 + 36) * 60_000 + 21_000;
    expect(formatRemaining(ms)).toBe('02d 14h 36m 21s');
  });
  it('zero pads single digits', () => {
    expect(formatRemaining(((1) * 60 + 2) * 60_000 + 3_000)).toBe('00d 01h 02m 03s');
  });
  it('clamps negative to zero', () => {
    expect(formatRemaining(-5000)).toBe('00d 00h 00m 00s');
  });
});

describe('getState', () => {
  const open = new Date('2026-05-18T00:00:00+08:00');
  const close = new Date('2026-07-12T23:59:59+08:00');

  it('before open', () => {
    expect(getState(new Date('2026-05-01'), open, close)).toBe('pending');
  });
  it('during open', () => {
    expect(getState(new Date('2026-06-01'), open, close)).toBe('open');
  });
  it('after close', () => {
    expect(getState(new Date('2026-08-01'), open, close)).toBe('closed');
  });
});
```

- [ ] **Step 4.2: Run test, expect fail**

Run: `pnpm test`
Expected: FAIL (module missing).

- [ ] **Step 4.3: Implement `src/lib/countdown.ts`**

```ts
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
```

- [ ] **Step 4.4: Run test, expect pass**

Run: `pnpm test`
Expected: 6 tests pass.

- [ ] **Step 4.5: Commit**

```bash
git add src/lib/countdown.ts src/lib/countdown.test.ts
git commit -m "feat: countdown utility with formatRemaining and getState"
```

---

## Task 5: Commands dispatcher (TDD)

**Files:**
- Create: `src/lib/commands.ts`, `src/lib/commands.test.ts`

- [ ] **Step 5.1: Write failing test**

`src/lib/commands.test.ts`:
```ts
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
```

- [ ] **Step 5.2: Run test, expect fail**

Run: `pnpm test`
Expected: FAIL.

- [ ] **Step 5.3: Implement `src/lib/commands.ts`**

```ts
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
```

- [ ] **Step 5.4: Run test, expect pass**

Run: `pnpm test`
Expected: all pass.

- [ ] **Step 5.5: Commit**

```bash
git add src/lib/commands.ts src/lib/commands.test.ts
git commit -m "feat: commands dispatcher with help/ls/cd/tetris/rhythm/sudo/etc"
```

---

## Task 6: Konami code detector (TDD)

**Files:**
- Create: `src/lib/konami.ts`, `src/lib/konami.test.ts`

- [ ] **Step 6.1: Write failing test**

`src/lib/konami.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { createKonamiDetector, KONAMI_SEQUENCE } from './konami';

function dispatch(detector: ReturnType<typeof createKonamiDetector>, keys: string[]) {
  keys.forEach(key => detector.handleKey({ key } as KeyboardEvent));
}

describe('konami', () => {
  it('fires callback on complete sequence', () => {
    const cb = vi.fn();
    const det = createKonamiDetector(cb);
    dispatch(det, KONAMI_SEQUENCE);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('does not fire on partial', () => {
    const cb = vi.fn();
    const det = createKonamiDetector(cb);
    dispatch(det, KONAMI_SEQUENCE.slice(0, 5));
    expect(cb).not.toHaveBeenCalled();
  });

  it('does not fire on wrong sequence', () => {
    const cb = vi.fn();
    const det = createKonamiDetector(cb);
    dispatch(det, ['a','a','a','a','a','a','a','a','a','a']);
    expect(cb).not.toHaveBeenCalled();
  });

  it('resets on wrong key', () => {
    const cb = vi.fn();
    const det = createKonamiDetector(cb);
    dispatch(det, ['ArrowUp', 'ArrowUp', 'x']);
    dispatch(det, KONAMI_SEQUENCE);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('counts invocations', () => {
    const cb = vi.fn();
    const det = createKonamiDetector(cb);
    dispatch(det, KONAMI_SEQUENCE);
    dispatch(det, KONAMI_SEQUENCE);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb.mock.calls[1][0]).toBe(2);
  });
});
```

- [ ] **Step 6.2: Run test, expect fail**

Run: `pnpm test`
Expected: FAIL.

- [ ] **Step 6.3: Implement `src/lib/konami.ts`**

```ts
export const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
] as const;

export function createKonamiDetector(onFire: (count: number) => void) {
  let progress = 0;
  let count = 0;

  function handleKey(e: KeyboardEvent) {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = KONAMI_SEQUENCE[progress];
    if (key === expected) {
      progress += 1;
      if (progress === KONAMI_SEQUENCE.length) {
        count += 1;
        onFire(count);
        progress = 0;
      }
    } else {
      progress = key === KONAMI_SEQUENCE[0] ? 1 : 0;
    }
  }

  return { handleKey, reset() { progress = 0; } };
}

export function attachKonami(onFire: (count: number) => void): () => void {
  const det = createKonamiDetector(onFire);
  const handler = (e: KeyboardEvent) => det.handleKey(e);
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}
```

- [ ] **Step 6.4: Run test, expect pass**

Run: `pnpm test`
Expected: all pass.

- [ ] **Step 6.5: Commit**

```bash
git add src/lib/konami.ts src/lib/konami.test.ts
git commit -m "feat: konami code detector"
```

---

## Task 7: Console banner (E1)

**Files:**
- Create: `src/lib/console-banner.ts`

- [ ] **Step 7.1: Write `src/lib/console-banner.ts`**

```ts
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
```

- [ ] **Step 7.2: Commit**

```bash
git add src/lib/console-banner.ts
git commit -m "feat: console banner with ascii logo and help() function"
```

---

## Task 8: Tab title verdict (E4)

**Files:**
- Create: `src/lib/tab-title.ts`

- [ ] **Step 8.1: Write `src/lib/tab-title.ts`**

```ts
const VERDICTS = ['[Compiling...]', '[AC]', '[WA]', '[TLE]', '[MLE]', '[PE]', '[RE]'];

export function installTabTitle(): void {
  if (typeof document === 'undefined') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const original = document.title;
  let timer: number | null = null;
  let idx = 0;

  function tick() {
    document.title = VERDICTS[idx % VERDICTS.length];
    idx += 1;
  }

  function onVisibility() {
    if (document.hidden) {
      tick();
      timer = window.setInterval(tick, 2000);
    } else {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
      document.title = original;
      idx = 0;
    }
  }

  document.addEventListener('visibilitychange', onVisibility);
}
```

- [ ] **Step 8.2: Commit**

```bash
git add src/lib/tab-title.ts
git commit -m "feat: tab title verdict animation when hidden"
```

---

## Task 9: Matrix rain (for E6 Konami)

**Files:**
- Create: `src/lib/matrix-rain.ts`

- [ ] **Step 9.1: Write `src/lib/matrix-rain.ts`**

```ts
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01ACWATLE>$_';

export function showMatrixRain(durationMs = 5000): void {
  if (typeof document === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position:fixed;inset:0;z-index:9999;pointer-events:none;
    background:rgba(11,16,24,0.85);
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  const fontSize = 16 * dpr;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = new Array(cols).fill(0).map(() => Math.random() * -50);

  ctx.font = `${fontSize}px ui-monospace, monospace`;

  let raf = 0;
  const start = performance.now();
  function frame(t: number) {
    ctx.fillStyle = 'rgba(11,16,24,0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#34d399';
    for (let i = 0; i < cols; i++) {
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
      drops[i] += 1;
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
    }
    if (t - start < durationMs) {
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.remove();
    }
  }
  raf = requestAnimationFrame(frame);
}
```

- [ ] **Step 9.2: Commit**

```bash
git add src/lib/matrix-rain.ts
git commit -m "feat: matrix rain effect for konami easter egg"
```

---

## Task 10: Tetris game logic (TDD)

**Files:**
- Create: `src/lib/tetris.ts`, `src/lib/tetris.test.ts`

- [ ] **Step 10.1: Write failing test**

`src/lib/tetris.test.ts`:
```ts
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
```

- [ ] **Step 10.2: Run test, expect fail**

Run: `pnpm test`
Expected: FAIL.

- [ ] **Step 10.3: Implement `src/lib/tetris.ts`**

```ts
export const ROWS = 20;
export const COLS = 10;

export type Cell = number; // 0 empty, 1..7 piece color id
export type Board = Cell[][];

export interface Shape {
  rotations: number[][][]; // each rotation: matrix of 0/1
  color: number;
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

function rot(base: number[][]): number[][][] {
  const out: number[][][] = [base];
  for (let i = 0; i < 3; i++) {
    out.push(rotateCW(out[out.length - 1]));
  }
  return out;
}

function rotateCW(m: number[][]): number[][] {
  const rows = m.length, cols = m[0].length;
  const r: number[][] = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++)
      r[x][rows - 1 - y] = m[y][x];
  return r;
}

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
```

- [ ] **Step 10.4: Run test, expect pass**

Run: `pnpm test`
Expected: all pass.

- [ ] **Step 10.5: Commit**

```bash
git add src/lib/tetris.ts src/lib/tetris.test.ts
git commit -m "feat: tetris game logic (board, shapes, collisions, scoring)"
```

---

## Task 11: Tetris audio + renderer + game controller

**Files:**
- Create: `src/lib/tetris-audio.ts`, `src/lib/tetris-render.ts`, `src/lib/tetris-controller.ts`

- [ ] **Step 11.1: Write `src/lib/tetris-audio.ts`**

```ts
export function createBeeper() {
  let ctx: AudioContext | null = null;
  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctx;
  }
  function beep(freq: number, durMs: number, vol = 0.05) {
    const ac = ensure();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + durMs / 1000);
  }
  return {
    move: () => beep(220, 30),
    rotate: () => beep(330, 40),
    drop: () => beep(120, 80),
    clear: (lines: number) => {
      const base = 440 + lines * 110;
      beep(base, 100);
      setTimeout(() => beep(base * 1.5, 100), 60);
    },
    gameOver: () => {
      beep(220, 200);
      setTimeout(() => beep(150, 300), 150);
    },
  };
}
```

- [ ] **Step 11.2: Write `src/lib/tetris-render.ts`**

```ts
import { Board, Piece, shapeMatrix, colorOf, ROWS, COLS } from './tetris';

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
    this.ctx.fillStyle = cssVar('--surface');
    this.ctx.fillRect(0, 0, COLS * cs, ROWS * cs);
    // grid
    this.ctx.strokeStyle = cssVar('--border-soft') || '#1f293780';
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
```

- [ ] **Step 11.3: Write `src/lib/tetris-controller.ts`**

```ts
import {
  Board, Piece, createBoard, randomBag, spawnPiece,
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

  function spawn() {
    piece = spawnPiece(nextId || nextFromBag());
    nextId = nextFromBag();
    renderer.drawNext(nextId, nextCtx);
    if (collides(board, piece)) {
      over = true;
      stop();
      best = Math.max(best, score);
      localStorage.setItem(BEST_KEY, String(best));
      beep.gameOver();
      opts.onGameOver({ score });
    }
  }

  function pushScore() {
    best = Math.max(best, score);
    opts.onScore({ score, lines, level: levelFor(lines), best });
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
        beep.clear(r.cleared);
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
    if (!collides(board, m)) { piece = m; beep.move(); renderer.draw(board, piece); }
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
    beep.drop();
    pushScore();
    renderer.draw(board, piece);
    tick();
  }

  function rotate() {
    if (!piece || paused || over) return;
    const m = { ...piece, rot: piece.rot + 1 };
    if (!collides(board, m)) { piece = m; beep.rotate(); renderer.draw(board, piece); }
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
```

- [ ] **Step 11.4: Verify type check**

Run: `pnpm check`
Expected: no errors.

- [ ] **Step 11.5: Commit**

```bash
git add src/lib/tetris-audio.ts src/lib/tetris-render.ts src/lib/tetris-controller.ts
git commit -m "feat: tetris audio, renderer, and controller"
```

---

## Task 12: Tetris overlay component

**Files:**
- Create: `src/components/TetrisOverlay.astro`

- [ ] **Step 12.1: Write `src/components/TetrisOverlay.astro`**

```astro
---
---
<div id="tetris-overlay" class="overlay" hidden>
  <div class="frame">
    <header>
      <span class="title">$ tetris</span>
      <span class="hint">press [esc] to exit · [p] pause</span>
    </header>
    <div class="body">
      <canvas id="tetris-canvas" width="300" height="600"></canvas>
      <aside>
        <div class="panel">
          <div class="label">NEXT</div>
          <canvas id="tetris-next" width="80" height="80"></canvas>
        </div>
        <div class="panel">
          <div class="label">SCORE</div>
          <div class="value mono" id="tetris-score">0</div>
        </div>
        <div class="panel">
          <div class="label">LINES</div>
          <div class="value mono" id="tetris-lines">0</div>
        </div>
        <div class="panel">
          <div class="label">LEVEL</div>
          <div class="value mono" id="tetris-level">1</div>
        </div>
        <div class="panel">
          <div class="label">BEST</div>
          <div class="value mono" id="tetris-best">0</div>
        </div>
        <div class="keys mono">
          ← → move<br/>
          ↓ soft drop<br/>
          ↑ rotate<br/>
          space hard drop<br/>
          p pause
        </div>
      </aside>
    </div>
    <div id="tetris-gameover" class="gameover" hidden>
      <div class="verdict">Verdict: TLE</div>
      <div class="msg">exceeded time limit. final score: <span id="tetris-final">0</span></div>
      <button class="btn btn-primary" id="tetris-restart">restart</button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(11, 16, 24, 0.92);
    display: grid; place-items: center;
    backdrop-filter: blur(4px);
  }
  .frame {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    max-width: 560px; width: calc(100vw - 32px);
  }
  header {
    display: flex; justify-content: space-between;
    font-family: var(--font-mono); color: var(--fg-dim); font-size: 0.875rem;
    margin-bottom: 16px;
  }
  header .title { color: var(--accent); }
  .body { display: flex; gap: 20px; }
  canvas#tetris-canvas { background: var(--surface-2); border-radius: var(--radius-sm); }
  aside { display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .panel { background: var(--surface-2); padding: 10px; border-radius: var(--radius-sm); }
  .label { font-size: 0.75rem; color: var(--fg-dim); font-family: var(--font-mono); }
  .value { font-size: 1.5rem; color: var(--accent); }
  .keys { font-size: 0.75rem; color: var(--fg-dim); line-height: 1.8; margin-top: auto; }
  canvas#tetris-next { background: var(--surface); border-radius: var(--radius-sm); }
  .gameover {
    position: absolute; inset: 0;
    background: rgba(11, 16, 24, 0.9);
    display: grid; place-items: center; text-align: center;
    border-radius: var(--radius-lg);
  }
  .verdict { color: var(--warn); font-family: var(--font-mono); font-size: 2rem; margin-bottom: 8px; }
  .msg { color: var(--fg-dim); font-family: var(--font-mono); margin-bottom: 20px; }
  @media (max-width: 640px) {
    .body { flex-direction: column; align-items: center; }
    aside { flex-direction: row; flex-wrap: wrap; width: 100%; }
    .panel { flex: 1 1 30%; }
    canvas#tetris-canvas { width: 100%; height: auto; max-width: 280px; }
  }
</style>

<script>
  import { startTetris } from '@/lib/tetris-controller';

  const overlay = document.getElementById('tetris-overlay')!;
  const canvas = document.getElementById('tetris-canvas') as HTMLCanvasElement;
  const nextCanvas = document.getElementById('tetris-next') as HTMLCanvasElement;
  const scoreEl = document.getElementById('tetris-score')!;
  const linesEl = document.getElementById('tetris-lines')!;
  const levelEl = document.getElementById('tetris-level')!;
  const bestEl = document.getElementById('tetris-best')!;
  const gameOverEl = document.getElementById('tetris-gameover')!;
  const finalEl = document.getElementById('tetris-final')!;
  const restartBtn = document.getElementById('tetris-restart')!;

  let game: ReturnType<typeof startTetris> | null = null;

  function open() {
    overlay.removeAttribute('hidden');
    gameOverEl.setAttribute('hidden', '');
    game = startTetris({
      canvas, nextCanvas,
      onScore: ({ score, lines, level, best }) => {
        scoreEl.textContent = String(score);
        linesEl.textContent = String(lines);
        levelEl.textContent = String(level);
        bestEl.textContent = String(best);
      },
      onGameOver: ({ score }) => {
        finalEl.textContent = String(score);
        gameOverEl.removeAttribute('hidden');
      },
    });
    game.start();
  }

  function close() {
    overlay.setAttribute('hidden', '');
    game?.stop();
    game = null;
    if (location.hash === '#tetris') history.replaceState(null, '', location.pathname);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) close();
  });
  restartBtn.addEventListener('click', () => {
    gameOverEl.setAttribute('hidden', '');
    game?.restart();
  });

  window.addEventListener('ntucpcpc:launch-tetris', open);
  if (location.hash === '#tetris') open();
  window.addEventListener('hashchange', () => {
    if (location.hash === '#tetris') open();
  });
</script>
```

- [ ] **Step 12.2: Commit**

```bash
git add src/components/TetrisOverlay.astro
git commit -m "feat: tetris overlay component"
```

---

## Task 13: Rhythm scoring logic (TDD)

**Files:**
- Create: `src/lib/rhythm.ts`, `src/lib/rhythm.test.ts`

- [ ] **Step 13.1: Write failing test**

`src/lib/rhythm.test.ts`:
```ts
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
```

- [ ] **Step 13.2: Run test, expect fail**

Run: `pnpm test`
Expected: FAIL.

- [ ] **Step 13.3: Implement `src/lib/rhythm.ts`**

```ts
export type Judgment = 'perfect' | 'great' | 'good' | 'miss';
export type Grade = 'S' | 'A' | 'B' | 'C';

export const WINDOWS = { perfect: 30, great: 60, good: 100 };

export function judge(deltaMs: number): Judgment {
  const a = Math.abs(deltaMs);
  if (a <= WINDOWS.perfect) return 'perfect';
  if (a <= WINDOWS.great) return 'great';
  if (a <= WINDOWS.good) return 'good';
  return 'miss';
}

export function scoreFor(j: Judgment): number {
  return ({ perfect: 100, great: 70, good: 30, miss: 0 } as const)[j];
}

export function gradeFor(percent: number): Grade {
  if (percent >= 95) return 'S';
  if (percent >= 85) return 'A';
  if (percent >= 70) return 'B';
  return 'C';
}

export interface Note { time: number; lane: 0 | 1 | 2 | 3; }
```

- [ ] **Step 13.4: Run test, expect pass**

Run: `pnpm test`
Expected: all pass.

- [ ] **Step 13.5: Commit**

```bash
git add src/lib/rhythm.ts src/lib/rhythm.test.ts
git commit -m "feat: rhythm scoring logic (judge / scoreFor / gradeFor)"
```

---

## Task 14: Rhythm chart + audio + controller

**Files:**
- Create: `src/lib/rhythm-chart.ts`, `src/lib/rhythm-audio.ts`, `src/lib/rhythm-render.ts`, `src/lib/rhythm-controller.ts`

- [ ] **Step 14.1: Write `src/lib/rhythm-chart.ts`** — a simple ~60s chart in 4/4 at 120 BPM (500ms per beat).

```ts
import { Note } from './rhythm';

// 8-bit melody (note frequencies in Hz, one per beat; 0 = rest)
// Loosely original riff so no copyright concern.
export const MELODY_HZ = [
  392, 0, 392, 440, 494, 0, 494, 440,
  392, 0, 587, 587, 523, 494, 440, 0,
  392, 0, 392, 440, 494, 0, 494, 523,
  587, 659, 659, 587, 523, 494, 440, 0,
  330, 392, 494, 587, 659, 587, 494, 392,
  330, 392, 494, 587, 659, 587, 494, 0,
  392, 0, 392, 440, 494, 0, 494, 440,
  392, 0, 587, 587, 523, 494, 440, 0,
];

export const BEAT_MS = 500; // 120 BPM
export const SONG_LENGTH_MS = MELODY_HZ.length * BEAT_MS; // 32s
// Chart: one note per non-rest beat; lane pseudo-random but deterministic.
export const CHART: Note[] = MELODY_HZ.flatMap((hz, i) => {
  if (hz === 0) return [];
  const lane = ((Math.floor(hz / 50) + i) % 4) as 0 | 1 | 2 | 3;
  return [{ time: i * BEAT_MS + 2000, lane }]; // 2s lead-in
});
```

- [ ] **Step 14.2: Write `src/lib/rhythm-audio.ts`**

```ts
import { MELODY_HZ, BEAT_MS } from './rhythm-chart';

export function createRhythmAudio() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  let stopFns: (() => void)[] = [];
  let started = 0;

  function start(leadInMs = 2000) {
    const t0 = ctx.currentTime + leadInMs / 1000;
    started = performance.now() + leadInMs;
    MELODY_HZ.forEach((hz, i) => {
      if (hz === 0) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = hz;
      const start = t0 + i * (BEAT_MS / 1000);
      const dur = (BEAT_MS / 1000) * 0.8;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.04, start + 0.01);
      gain.gain.linearRampToValueAtTime(0, start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
      stopFns.push(() => { try { osc.stop(); } catch {} });
    });
  }

  function elapsed(): number {
    return performance.now() - started;
  }

  function stop() {
    stopFns.forEach(f => f());
    stopFns = [];
    try { ctx.close(); } catch {}
  }

  return { start, elapsed, stop };
}

export function hitSound() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 800;
  gain.gain.value = 0.03;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
  setTimeout(() => ctx.close(), 100);
}
```

- [ ] **Step 14.3: Write `src/lib/rhythm-render.ts`**

```ts
import { Note } from './rhythm';

const LANE_KEYS = ['D', 'F', 'J', 'K'];

export class RhythmRenderer {
  constructor(private ctx: CanvasRenderingContext2D, private chart: Note[]) {}

  draw(elapsedMs: number, hits: Map<number, string>) {
    const c = this.ctx;
    const w = c.canvas.width, h = c.canvas.height;
    const laneW = w / 4;
    const judgeY = h - 80;
    const fallMs = 1200; // how long a note takes to fall

    c.fillStyle = this.cssVar('--surface');
    c.fillRect(0, 0, w, h);

    // lane separators
    c.strokeStyle = this.cssVar('--border');
    for (let i = 0; i <= 4; i++) {
      c.beginPath(); c.moveTo(i * laneW, 0); c.lineTo(i * laneW, h); c.stroke();
    }

    // judge line
    c.strokeStyle = this.cssVar('--accent');
    c.beginPath(); c.moveTo(0, judgeY); c.lineTo(w, judgeY); c.stroke();

    // lane keys
    c.fillStyle = this.cssVar('--fg-dim');
    c.font = '14px ui-monospace, monospace';
    c.textAlign = 'center';
    LANE_KEYS.forEach((k, i) => c.fillText(k, i * laneW + laneW / 2, h - 30));

    // notes
    for (let i = 0; i < this.chart.length; i++) {
      const n = this.chart[i];
      const dt = n.time - elapsedMs;
      if (dt > fallMs || dt < -200) continue;
      const y = judgeY - (dt / fallMs) * judgeY;
      const x = n.lane * laneW + 10;
      const noteW = laneW - 20;
      c.fillStyle = hits.has(i)
        ? (hits.get(i) === 'miss' ? this.cssVar('--error') : this.cssVar('--accent'))
        : this.cssVar('--tetris-2');
      c.fillRect(x, y - 8, noteW, 16);
    }
  }

  private cssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#34d399';
  }
}
```

- [ ] **Step 14.4: Write `src/lib/rhythm-controller.ts`**

```ts
import { CHART, BEAT_MS, SONG_LENGTH_MS } from './rhythm-chart';
import { Judgment, judge, scoreFor, scoreFor as _, gradeFor } from './rhythm';
import { RhythmRenderer } from './rhythm-render';
import { createRhythmAudio, hitSound } from './rhythm-audio';

interface Options {
  canvas: HTMLCanvasElement;
  onUpdate: (s: {
    score: number; combo: number; lastJudge: Judgment | null;
    perfect: number; great: number; good: number; miss: number;
  }) => void;
  onEnd: (final: { score: number; percent: number; grade: string }) => void;
}

const BEST_KEY = 'ntucpcpc.rhythm.high';

export function startRhythm(opts: Options) {
  const ctx = opts.canvas.getContext('2d')!;
  const renderer = new RhythmRenderer(ctx, CHART);
  const audio = createRhythmAudio();
  const hits = new Map<number, Judgment>();
  let score = 0, combo = 0, perfect = 0, great = 0, good = 0, miss = 0;
  let raf = 0, ended = false;
  const LANE_KEYS: Record<string, 0|1|2|3> = {
    d: 0, f: 1, j: 2, k: 3, D: 0, F: 1, J: 2, K: 3,
  };

  function update(j: Judgment) {
    score += scoreFor(j);
    if (j === 'miss') combo = 0;
    else combo += 1;
    if (j === 'perfect') perfect++;
    else if (j === 'great') great++;
    else if (j === 'good') good++;
    else miss++;
    opts.onUpdate({ score, combo, lastJudge: j, perfect, great, good, miss });
  }

  function onKey(e: KeyboardEvent) {
    if (ended) return;
    const lane = LANE_KEYS[e.key];
    if (lane === undefined) return;
    e.preventDefault();
    const now = audio.elapsed();
    // find nearest unhit note in this lane
    let bestI = -1, bestDt = Infinity;
    for (let i = 0; i < CHART.length; i++) {
      if (hits.has(i)) continue;
      const n = CHART[i];
      if (n.lane !== lane) continue;
      const dt = Math.abs(n.time - now);
      if (dt < bestDt) { bestDt = dt; bestI = i; }
      if (n.time - now > 200) break;
    }
    if (bestI >= 0 && bestDt <= 100) {
      const j = judge(CHART[bestI].time - now);
      hits.set(bestI, j);
      hitSound();
      update(j);
    }
  }

  function frame() {
    const t = audio.elapsed();
    // auto-miss anything past judge window
    for (let i = 0; i < CHART.length; i++) {
      if (hits.has(i)) continue;
      if (t - CHART[i].time > 100) { hits.set(i, 'miss'); update('miss'); }
    }
    renderer.draw(t, hits);
    if (t > SONG_LENGTH_MS + 1500) {
      ended = true;
      window.removeEventListener('keydown', onKey);
      const maxScore = CHART.length * 100;
      const percent = (score / maxScore) * 100;
      const grade = gradeFor(percent);
      const best = Number(localStorage.getItem(BEST_KEY) ?? 0);
      if (score > best) localStorage.setItem(BEST_KEY, String(score));
      opts.onEnd({ score, percent, grade });
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    audio.start(2000);
    window.addEventListener('keydown', onKey);
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    ended = true;
    cancelAnimationFrame(raf);
    audio.stop();
    window.removeEventListener('keydown', onKey);
  }

  return { start, stop };
}
```

- [ ] **Step 14.5: Type check**

Run: `pnpm check`
Expected: no errors.

- [ ] **Step 14.6: Commit**

```bash
git add src/lib/rhythm-chart.ts src/lib/rhythm-audio.ts src/lib/rhythm-render.ts src/lib/rhythm-controller.ts
git commit -m "feat: rhythm chart, audio, renderer, controller"
```

---

## Task 15: Rhythm overlay component

**Files:**
- Create: `src/components/RhythmOverlay.astro`

- [ ] **Step 15.1: Write `src/components/RhythmOverlay.astro`**

```astro
---
---
<div id="rhythm-overlay" class="overlay" hidden>
  <div class="frame">
    <header>
      <span class="title">$ rhythm — NTUCPCPC theme</span>
      <span class="hint">press [esc] to exit · D F J K to hit</span>
    </header>
    <div class="hud mono">
      <span>SCORE <span id="rhythm-score">0</span></span>
      <span>COMBO x<span id="rhythm-combo">0</span></span>
      <span id="rhythm-judge"></span>
    </div>
    <canvas id="rhythm-canvas" width="480" height="600"></canvas>
    <div id="rhythm-mobile" class="mobile-note" hidden>
      rhythm game requires a desktop keyboard.
    </div>
    <div id="rhythm-result" class="result" hidden>
      <div class="grade mono" id="rhythm-grade">S</div>
      <div class="msg mono" id="rhythm-msg"></div>
      <button class="btn btn-primary" id="rhythm-close">close</button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(11, 16, 24, 0.92);
    display: grid; place-items: center;
    backdrop-filter: blur(4px);
  }
  .frame {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    max-width: 540px; width: calc(100vw - 32px);
    position: relative;
  }
  header {
    display: flex; justify-content: space-between;
    font-family: var(--font-mono); color: var(--fg-dim); font-size: 0.875rem;
    margin-bottom: 12px;
  }
  header .title { color: var(--accent); }
  .hud {
    display: flex; gap: 24px; justify-content: center;
    color: var(--fg-dim); margin-bottom: 12px;
  }
  .hud span span { color: var(--accent); }
  canvas { display: block; background: var(--surface-2); border-radius: var(--radius-sm); margin-inline: auto; max-width: 100%; height: auto; }
  .mobile-note {
    padding: 60px 20px; text-align: center;
    font-family: var(--font-mono); color: var(--fg-dim);
  }
  .result {
    position: absolute; inset: 0; background: rgba(11,16,24,0.95);
    display: grid; place-items: center; border-radius: var(--radius-lg);
    text-align: center;
  }
  .grade { font-size: 5rem; color: var(--accent); }
  .msg { color: var(--fg-dim); margin-bottom: 20px; }
</style>

<script>
  import { startRhythm } from '@/lib/rhythm-controller';

  const overlay = document.getElementById('rhythm-overlay')!;
  const canvas = document.getElementById('rhythm-canvas') as HTMLCanvasElement;
  const scoreEl = document.getElementById('rhythm-score')!;
  const comboEl = document.getElementById('rhythm-combo')!;
  const judgeEl = document.getElementById('rhythm-judge')!;
  const resultEl = document.getElementById('rhythm-result')!;
  const gradeEl = document.getElementById('rhythm-grade')!;
  const msgEl = document.getElementById('rhythm-msg')!;
  const closeBtn = document.getElementById('rhythm-close')!;
  const mobileEl = document.getElementById('rhythm-mobile')!;

  let game: ReturnType<typeof startRhythm> | null = null;

  function isMobile() {
    return matchMedia('(pointer: coarse) and (max-width: 768px)').matches;
  }

  function open() {
    overlay.removeAttribute('hidden');
    resultEl.setAttribute('hidden', '');
    if (isMobile()) {
      mobileEl.removeAttribute('hidden');
      return;
    }
    mobileEl.setAttribute('hidden', '');
    game = startRhythm({
      canvas,
      onUpdate: ({ score, combo, lastJudge }) => {
        scoreEl.textContent = String(score);
        comboEl.textContent = String(combo);
        if (lastJudge) judgeEl.textContent = lastJudge.toUpperCase();
      },
      onEnd: ({ score, percent, grade }) => {
        gradeEl.textContent = grade;
        msgEl.textContent = `${score} pts · ${percent.toFixed(1)}%`;
        resultEl.removeAttribute('hidden');
      },
    });
    game.start();
  }

  function close() {
    overlay.setAttribute('hidden', '');
    game?.stop();
    game = null;
    if (location.hash === '#rhythm') history.replaceState(null, '', location.pathname);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) close();
  });
  closeBtn.addEventListener('click', close);

  window.addEventListener('ntucpcpc:launch-rhythm', open);
  if (location.hash === '#rhythm') open();
  window.addEventListener('hashchange', () => {
    if (location.hash === '#rhythm') open();
  });
</script>
```

- [ ] **Step 15.2: Commit**

```bash
git add src/components/RhythmOverlay.astro
git commit -m "feat: rhythm overlay component"
```

---

## Task 16: Footer prompt component (E2)

**Files:**
- Create: `src/components/FooterPrompt.astro`

- [ ] **Step 16.1: Write `src/components/FooterPrompt.astro`**

```astro
---
import { SITE } from '@/lib/config';
---
<footer class="site-footer container">
  <div class="prompt" id="footer-prompt">
    <div class="output mono" id="prompt-output" aria-live="polite"></div>
    <div class="input-line mono">
      <span class="ps1">ntucpc@2026:~$</span>
      <input
        id="prompt-input"
        type="text"
        autocomplete="off"
        spellcheck="false"
        aria-label="hidden command prompt"
      />
      <span class="caret">▌</span>
    </div>
    <div class="hint mono">// try `help` for hidden commands</div>
  </div>
  <div class="meta mono">
    © 2026 NTUCPC · <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
  </div>
</footer>

<style>
  .site-footer { padding-block: 64px; }
  .prompt {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 16px 18px;
    margin-bottom: 16px;
  }
  .output {
    min-height: 0;
    max-height: 240px;
    overflow-y: auto;
    color: var(--fg-dim);
    white-space: pre-wrap;
    font-size: 0.875rem;
    margin-bottom: 8px;
  }
  .output:empty { margin-bottom: 0; }
  .input-line { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }
  .ps1 { color: var(--accent); }
  input {
    flex: 1; background: transparent; border: 0; outline: 0;
    color: var(--fg); font: inherit; padding: 0;
  }
  .caret { color: var(--accent); animation: blink 1.2s steps(1,end) infinite; }
  .hint { color: var(--fg-mute); font-size: 0.75rem; margin-top: 8px; }
  .meta {
    color: var(--fg-dim); font-size: 0.8rem; text-align: center;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .caret { animation: none; }
  }
</style>

<script>
  import { run } from '@/lib/commands';

  const input = document.getElementById('prompt-input') as HTMLInputElement;
  const output = document.getElementById('prompt-output')!;
  const history: string[] = [];
  let cursor = -1;

  function append(line: string) {
    const div = document.createElement('div');
    div.textContent = line;
    output.appendChild(div);
    while (output.childElementCount > 40) output.firstChild?.remove();
    output.scrollTop = output.scrollHeight;
  }

  function execute(cmd: string) {
    if (!cmd.trim()) return;
    append(`ntucpc@2026:~$ ${cmd}`);
    history.push(cmd);
    cursor = history.length;
    const r = run(cmd);
    if (r.action === 'clear') { output.innerHTML = ''; return; }
    if (r.action === 'exit') { input.blur(); return; }
    r.lines.forEach(append);
    if (r.action?.startsWith('launch:')) {
      const game = r.action.split(':')[1];
      window.dispatchEvent(new CustomEvent(`ntucpcpc:launch-${game}`));
    } else if (r.action?.startsWith('scroll:')) {
      const id = r.action.split(':')[1];
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else if (r.action?.startsWith('external:')) {
      window.open(r.action.slice('external:'.length), '_blank');
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      execute(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cursor > 0) cursor -= 1;
      input.value = history[cursor] ?? '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cursor < history.length - 1) { cursor += 1; input.value = history[cursor]; }
      else { cursor = history.length; input.value = ''; }
    }
  });
</script>
```

- [ ] **Step 16.2: Commit**

```bash
git add src/components/FooterPrompt.astro
git commit -m "feat: footer hidden prompt component with history"
```

---

## Task 17: Nav (with E8 logo multi-click)

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 17.1: Write `src/components/Nav.astro`**

```astro
---
const items = [
  { id: 'schedule', label: '日程' },
  { id: 'register', label: '報名' },
  { id: 'rules',    label: '規則' },
  { id: 'contact',  label: '聯絡' },
];
---
<nav class="site-nav">
  <div class="inner container">
    <button id="nav-logo" class="logo mono" aria-label="NTUCPC home">
      <span class="user">ntucpc</span><span class="dim">@2026:~$</span>
    </button>
    <button class="hamburger mono" id="nav-toggle" aria-label="menu">≡</button>
    <ul id="nav-menu">
      {items.map((it) => (
        <li><a href={`#${it.id}`}>#{it.label}</a></li>
      ))}
    </ul>
  </div>
</nav>

<style>
  .site-nav {
    position: sticky; top: 0; z-index: 50;
    background: rgba(11,16,24,0.7);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-soft);
  }
  .inner { display: flex; align-items: center; justify-content: space-between; padding-block: 14px; }
  .logo {
    background: transparent; border: 0; padding: 0; cursor: pointer;
    font: inherit; color: inherit;
  }
  .logo .user { color: var(--accent); }
  .logo .dim { color: var(--fg-dim); }
  ul { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; }
  ul a { color: var(--fg-dim); font-family: var(--font-mono); font-size: 0.9rem; }
  ul a:hover { color: var(--accent); text-decoration: none; }
  .hamburger { display: none; background: transparent; border: 0; color: var(--fg); font-size: 1.5rem; cursor: pointer; }

  @media (max-width: 640px) {
    .hamburger { display: block; }
    ul { display: none; position: absolute; top: 100%; right: 0; left: 0;
         flex-direction: column; background: var(--surface); padding: 16px; border-bottom: 1px solid var(--border); }
    ul.open { display: flex; }
  }

  .logo.pulse { animation: pulse 0.6s ease; }
  @keyframes pulse {
    0% { text-shadow: 0 0 0 var(--accent); }
    50% { text-shadow: 0 0 16px var(--accent); }
    100% { text-shadow: 0 0 0 var(--accent); }
  }
</style>

<script>
  const logo = document.getElementById('nav-logo')!;
  const toggle = document.getElementById('nav-toggle')!;
  const menu = document.getElementById('nav-menu')!;
  let clicks = 0;

  const POEMS = [
    'while (! sleep) { 寫 code; debug; 寫 code; debug; }',
    '0xBADC0DE: don’t stare too long.',
    'segmentation fault — kidding, you’re fine.',
    'O(1) interest in your life — except this competition.',
  ];

  logo.addEventListener('click', (e) => {
    clicks += 1;
    logo.classList.remove('pulse');
    void (logo as HTMLElement).offsetWidth;
    logo.classList.add('pulse');
    if (clicks === 5) {
      console.log('%c+5 click streak. nice.', 'color:#34d399');
    } else if (clicks === 10) {
      const poem = POEMS[Math.floor(Math.random() * POEMS.length)];
      console.log(`%c${poem}`, 'color:#fbbf24;font-family:ui-monospace,monospace');
    } else if (clicks === 20) {
      import('@/lib/commands').then(({ register }) => {
        register('sandwich', () => ({ lines: ['What? Make it yourself.', '— xkcd 149'] }));
        console.log('%cunlocked: sudo make me a sandwich', 'color:#34d399');
      });
    }
  });

  toggle.addEventListener('click', () => menu.classList.toggle('open'));
</script>
```

- [ ] **Step 17.2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: sticky nav with logo multi-click easter egg"
```

---

## Task 18: Hero + BootSequence + Countdown components

**Files:**
- Create: `src/components/Hero.astro`, `src/components/BootSequence.astro`, `src/components/Countdown.astro`

- [ ] **Step 18.1: Write `src/components/BootSequence.astro`** (E9)

```astro
---
---
<div id="boot" class="boot mono" aria-hidden="true">
  <div class="lines" id="boot-lines"></div>
</div>

<style>
  .boot {
    position: fixed; inset: 0; z-index: 100;
    background: var(--bg);
    display: grid; place-items: center;
    color: var(--accent);
    font-size: 0.95rem;
    transition: opacity 300ms ease;
  }
  .boot.hide { opacity: 0; pointer-events: none; }
  .lines { width: min(600px, 90vw); }
  .lines div { white-space: pre; }
  .lines .ok { color: var(--accent); }
  .lines .dim { color: var(--fg-dim); }
</style>

<script>
  const root = document.getElementById('boot')!;
  const linesEl = document.getElementById('boot-lines')!;

  if (sessionStorage.getItem('boot') === '1' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.remove();
  } else {
    const sequence = [
      ['dim', '$ g++ ntucpcpc.cpp -o site -O2 -std=c++20'],
      ['dim', '$ ./site --year 2026'],
      ['ok',  'Compilation finished.'],
      ['ok',  'Verdict: Accepted (0.04s, 12 MB)'],
    ];
    let i = 0;
    function next() {
      if (i >= sequence.length) {
        setTimeout(() => {
          root.classList.add('hide');
          setTimeout(() => root.remove(), 300);
          sessionStorage.setItem('boot', '1');
        }, 250);
        return;
      }
      const [cls, text] = sequence[i++];
      const div = document.createElement('div');
      div.className = cls;
      div.textContent = text;
      linesEl.appendChild(div);
      setTimeout(next, 150);
    }
    next();
  }
</script>
```

- [ ] **Step 18.2: Write `src/components/Countdown.astro`**

```astro
---
import { DATES } from '@/lib/config';
const deadline = DATES.registerClose.toISOString();
---
<div class="countdown mono" data-deadline={deadline}>
  <span class="prefix">// T-minus</span>
  <span class="value" id="countdown-value">--d --h --m --s</span>
  <span class="suffix">until 報名截止</span>
</div>

<style>
  .countdown {
    color: var(--fg-dim);
    font-size: 0.875rem;
    margin-top: 24px;
  }
  .value { color: var(--accent); margin-inline: 8px; }
  .countdown.closed .value { color: var(--fg-mute); text-decoration: line-through; }
  .countdown.closed .suffix::before { content: '已截止 '; color: var(--warn); }
</style>

<script>
  import { formatRemaining, getState } from '@/lib/countdown';
  import { DATES } from '@/lib/config';

  const root = document.querySelector('.countdown')!;
  const value = document.getElementById('countdown-value')!;

  function tick() {
    const now = new Date();
    const state = getState(now, DATES.registerOpen, DATES.registerClose);
    if (state === 'pending') {
      value.textContent = formatRemaining(DATES.registerOpen.getTime() - now.getTime());
      root.querySelector('.suffix')!.textContent = 'until 報名開放';
    } else if (state === 'open') {
      value.textContent = formatRemaining(DATES.registerClose.getTime() - now.getTime());
    } else {
      value.textContent = '00d 00h 00m 00s';
      root.classList.add('closed');
    }
  }
  tick();
  setInterval(tick, 1000);
</script>
```

- [ ] **Step 18.3: Write `src/components/Hero.astro`**

```astro
---
import { SITE } from '@/lib/config';
import Countdown from './Countdown.astro';
---
<section id="hero" class="hero container">
  <div class="eyebrow">$ ./ntucpcpc --year 2026</div>
  <h1 class="title">NTUCPCPC</h1>
  <p class="subtitle">程式解題社程式解題競賽 · 2026</p>
  <div class="cta">
    <a class="btn btn-primary cta-register" href={SITE.registerUrl} target="_blank" rel="noopener" data-original="[ register ]">
      <span class="label">[ register ]</span>
    </a>
    <a class="btn" href="#rules">[ docs ]</a>
  </div>
  <Countdown />
</section>

<style>
  .hero { padding-block: 120px 80px; text-align: left; border-top: 0; }
  .title {
    font-size: clamp(2.5rem, 8vw, 5rem);
    letter-spacing: -0.02em;
    background: linear-gradient(180deg, var(--fg), var(--fg-dim));
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 12px;
  }
  .subtitle { color: var(--fg-dim); font-family: var(--font-mono); margin-bottom: 28px; }
  .cta { display: flex; gap: 12px; flex-wrap: wrap; }
  .cta .btn { font-family: var(--font-mono); }
</style>

<script>
  import { SITE } from '@/lib/config';
  const btn = document.querySelector('.cta-register .label') as HTMLElement;
  const original = btn.textContent!;
  const hover = `$ xdg-open ${SITE.registerUrl}`;
  let typing: number | null = null;
  function type(target: string, done?: () => void) {
    if (typing !== null) { clearInterval(typing); typing = null; }
    let i = 0;
    btn.textContent = '';
    typing = window.setInterval(() => {
      i += 1;
      btn.textContent = target.slice(0, i);
      if (i >= target.length) { clearInterval(typing!); typing = null; done?.(); }
    }, 12);
  }
  const a = btn.closest('a')!;
  a.addEventListener('mouseenter', () => type(hover));
  a.addEventListener('mouseleave', () => type(original));
  a.addEventListener('focus', () => type(hover));
  a.addEventListener('blur', () => type(original));
</script>
```

- [ ] **Step 18.4: Commit**

```bash
git add src/components/Hero.astro src/components/BootSequence.astro src/components/Countdown.astro
git commit -m "feat: hero, boot sequence, countdown with cta hover typing"
```

---

## Task 19: Content section components

**Files:**
- Create: `src/components/Purpose.astro`, `Schedule.astro`, `Register.astro`, `Rules.astro`, `TechDetails.astro`, `Team.astro`, `Sponsors.astro`, `Contact.astro`

- [ ] **Step 19.1: Write `src/components/Purpose.astro`**

```astro
---
import purpose from '@/content/purpose.md?raw';
const paragraphs = purpose.trim().split(/\n\n+/);
---
<section id="purpose" class="container">
  <div class="eyebrow">// 為什麼舉辦這場比賽？</div>
  <h2>## 宗旨</h2>
  <div class="prose">
    {paragraphs.map(p => <p>{p}</p>)}
  </div>
</section>

<style>
  .prose p { max-width: 65ch; color: var(--fg); }
</style>
```

- [ ] **Step 19.2: Write `src/components/Schedule.astro`**

```astro
---
const rows = [
  { stage: '報名', date: '2026/05/18 – 07/12' },
  { stage: '測試賽', date: '2026/07/23 – 07/25' },
  { stage: '初賽', date: '2026/07/26 13:00 – 17:00', tag: 'online' },
  { stage: '決賽', date: '2026/08/02', tag: '台大校總區' },
];
const finalDay = [
  ['10:00–12:00', '報到 / 系統測試（報到完即可進場測試）'],
  ['12:40–13:00', '比賽進場'],
  ['13:00–18:00', '比賽（5 小時）'],
  ['18:00–19:00', '頒獎與題目講解'],
];
---
<section id="schedule" class="container">
  <div class="eyebrow">// 重要日期</div>
  <h2>## 競賽日程</h2>
  <div class="card">
    <table>
      <thead>
        <tr><th>階段</th><th>日期</th><th></th></tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr>
            <td class="stage">{r.stage}</td>
            <td class="date mono">{r.date}</td>
            <td class="tag mono">{r.tag ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <details class="final-day">
    <summary>展開決賽當日流程</summary>
    <ul>
      {finalDay.map(([t, what]) => (
        <li><span class="t mono">{t}</span><span>{what}</span></li>
      ))}
    </ul>
    <p class="note mono">// 決賽不提供午餐，比賽中會提供點心</p>
  </details>
</section>

<style>
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 12px 8px; text-align: left; border-bottom: 1px solid var(--border-soft); }
  th { color: var(--fg-dim); font-family: var(--font-mono); font-weight: 500; font-size: 0.875rem; }
  .stage { font-weight: 600; }
  .date { color: var(--fg); }
  .tag { color: var(--accent); font-size: 0.85rem; }
  tr:last-child td { border-bottom: 0; }

  .final-day { margin-top: 16px; }
  .final-day summary { cursor: pointer; color: var(--fg-dim); font-family: var(--font-mono); font-size: 0.9rem; }
  .final-day summary:hover { color: var(--accent); }
  .final-day ul { list-style: none; padding: 16px 0 0; margin: 0; display: grid; gap: 8px; }
  .final-day li { display: flex; gap: 16px; }
  .final-day .t { color: var(--accent); min-width: 120px; }
  .final-day .note { color: var(--fg-dim); margin-top: 12px; }
</style>
```

- [ ] **Step 19.3: Write `src/components/Register.astro`** (with state)

```astro
---
import { SITE, DATES } from '@/lib/config';
import { getState } from '@/lib/countdown';
const state = getState(new Date(), DATES.registerOpen, DATES.registerClose);
---
<section id="register" class="container">
  <div class="eyebrow">// 報名</div>
  <h2>## $ register --team</h2>
  <div class="card register-card">
    <ul class="checklist mono">
      <li><span class="ok">✓</span> 高中職以下（含應屆畢業生）</li>
      <li><span class="ok">✓</span> 一至三人一隊，同隊不必同校</li>
      <li><span class="ok">✓</span> 無報名費</li>
    </ul>
    {state === 'open' && (
      <a class="btn btn-primary big" href={SITE.registerUrl} target="_blank" rel="noopener">
        立即報名 →
      </a>
    )}
    {state === 'pending' && (
      <button class="btn big" disabled>
        pending: 報名 2026-05-18 開放
      </button>
    )}
    {state === 'closed' && (
      <button class="btn big" disabled>
        closed: 已截止
      </button>
    )}
    <p class="hint mono">送出後會收到 email 確認，未收到請聯絡 {SITE.email}</p>
  </div>
</section>

<style>
  .register-card { display: grid; gap: 20px; }
  .checklist { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
  .ok { color: var(--accent); margin-right: 8px; }
  .btn.big { padding: 14px 28px; font-size: 1.1rem; justify-self: start; }
  .hint { color: var(--fg-dim); font-size: 0.85rem; margin: 0; }
</style>
```

- [ ] **Step 19.4: Write `src/components/Rules.astro`**

```astro
---
import prelim from '@/content/rules-prelim.md?raw';
import final from '@/content/rules-final.md?raw';
function mdList(src: string) {
  return src.trim().split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2));
}
const prelimItems = mdList(prelim);
const finalItems = mdList(final);
const common = [
  '初賽與決賽皆採用 ICPC 制。',
  '每場比賽有 5–15 題。',
  '排名依解出題數，題數相同者比罰時。',
  '罰時 = 通過時間（分鐘）+ 錯誤數 × 20；編譯錯誤不計。',
];
---
<section id="rules" class="container">
  <div class="eyebrow">// 競賽規則</div>
  <h2>## 規則</h2>

  <div class="card common">
    <h3>共同規則</h3>
    <ul>
      {common.map(c => <li>{c.split('罰時').length > 1
        ? <><span class="dim">{'// '}</span><span class="rule-text">{c}</span></>
        : <><span class="dim">{'// '}</span><span>{c}</span></>}</li>)}
    </ul>
  </div>

  <div class="tabs">
    <button class="tab active" data-tab="prelim">初賽</button>
    <button class="tab" data-tab="final">決賽</button>
  </div>

  <div class="card panel" id="panel-prelim">
    <ul>{prelimItems.map(it => <li set:html={it.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')} />)}</ul>
  </div>

  <div class="card panel" id="panel-final" hidden>
    <ul>{finalItems.map(it => <li set:html={it.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')} />)}</ul>
  </div>
</section>

<style>
  ul { padding-left: 1.2em; margin: 0; }
  li { margin-bottom: 8px; line-height: 1.7; }
  .dim { color: var(--fg-dim); font-family: var(--font-mono); }
  strong { color: var(--accent); font-weight: 600; }
  .common { margin-bottom: 20px; }
  .common h3 { color: var(--fg-dim); font-size: 1rem; font-family: var(--font-mono); margin-bottom: 12px; }

  .tabs { display: flex; gap: 4px; margin-bottom: 0; }
  .tab {
    padding: 10px 18px; background: transparent;
    border: 1px solid var(--border); border-bottom: 0;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    color: var(--fg-dim); font: inherit; font-family: var(--font-mono);
    cursor: pointer; transition: 150ms ease;
  }
  .tab:hover { color: var(--accent); }
  .tab.active { background: var(--surface); color: var(--accent); border-color: var(--border); }

  .panel { border-top-left-radius: 0; }
</style>

<script>
  const tabs = document.querySelectorAll<HTMLButtonElement>('#rules .tab');
  const panels = {
    prelim: document.getElementById('panel-prelim')!,
    final: document.getElementById('panel-final')!,
  };
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    Object.entries(panels).forEach(([k, el]) => {
      if (k === t.dataset.tab) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    });
  }));
</script>
```

- [ ] **Step 19.5: Write `src/components/TechDetails.astro`**

```astro
---
import tech from '@/content/tech.md?raw';
const items = tech.trim().split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2));
---
<section id="tech" class="container">
  <div class="eyebrow">// 平台與工具</div>
  <h2>## 技術細節</h2>
  <div class="card">
    <ul>
      {items.map(i => <li class="mono"><span class="dim">$</span> {i}</li>)}
    </ul>
  </div>
</section>

<style>
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
  .dim { color: var(--accent); margin-right: 8px; }
</style>
```

- [ ] **Step 19.6: Write `src/components/Team.astro`**

```astro
---
import team from '@/content/team.md?raw';
const items = team.trim().split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2));
---
<section id="team" class="container">
  <div class="eyebrow">// 工作人員</div>
  <h2>## 籌備團隊</h2>
  <div class="card">
    <ul>
      {items.map(i => <li set:html={i.replace(/：/, '<span class="sep">: </span>')} />)}
    </ul>
  </div>
</section>

<style>
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
  .sep { color: var(--accent); font-family: var(--font-mono); }
</style>
```

- [ ] **Step 19.7: Write `src/components/Sponsors.astro`**

```astro
---
---
<section id="sponsors" class="container">
  <div class="eyebrow">// 感謝</div>
  <h2>## 贊助單位</h2>
  <div class="card placeholder mono">
    <span class="dim">$ ls sponsors/</span>
    <span class="dim">// TODO: 待補</span>
  </div>
</section>

<style>
  .placeholder { display: grid; gap: 8px; color: var(--fg-dim); }
  .dim { color: var(--fg-mute); }
</style>
```

- [ ] **Step 19.8: Write `src/components/Contact.astro`**

```astro
---
import { SITE } from '@/lib/config';
---
<section id="contact" class="container">
  <div class="eyebrow">// 找我們</div>
  <h2>## 聯絡我們</h2>
  <div class="card contact">
    <div class="line"><span class="key mono">email</span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
    <div class="line"><span class="key mono">web</span><a href={SITE.clubUrl} target="_blank" rel="noopener">{SITE.clubUrl}</a></div>
  </div>
</section>

<style>
  .contact { display: grid; gap: 12px; }
  .line { display: flex; gap: 16px; align-items: baseline; }
  .key { color: var(--accent); min-width: 60px; font-size: 0.875rem; }
</style>
```

- [ ] **Step 19.9: Commit**

```bash
git add src/components/Purpose.astro src/components/Schedule.astro src/components/Register.astro src/components/Rules.astro src/components/TechDetails.astro src/components/Team.astro src/components/Sponsors.astro src/components/Contact.astro
git commit -m "feat: content sections (purpose, schedule, register, rules, tech, team, sponsors, contact)"
```

---

## Task 20: Assemble index page + globals install

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/layouts/Base.astro` (add globals init script)

- [ ] **Step 20.1: Update `src/layouts/Base.astro` to install console banner + tab title + konami**

Replace the `<body>` tag and below with:

```astro
  <body>
    <slot />
    <!-- end of body. if you're still reading, /join us :) -->
    <script>
      import { installConsoleBanner } from '@/lib/console-banner';
      import { installTabTitle } from '@/lib/tab-title';
      import { attachKonami } from '@/lib/konami';
      import { showMatrixRain } from '@/lib/matrix-rain';

      installConsoleBanner();
      installTabTitle();
      attachKonami((count) => {
        if (count === 1) {
          showMatrixRain();
        } else {
          const picks = ['matrix', 'tetris', 'rhythm'];
          const pick = picks[Math.floor(Math.random() * picks.length)];
          if (pick === 'matrix') showMatrixRain();
          else window.dispatchEvent(new CustomEvent(`ntucpcpc:launch-${pick}`));
        }
      });
    </script>
  </body>
```

- [ ] **Step 20.2: Rewrite `src/pages/index.astro`**

```astro
---
import Base from '@/layouts/Base.astro';
import Nav from '@/components/Nav.astro';
import BootSequence from '@/components/BootSequence.astro';
import Hero from '@/components/Hero.astro';
import Purpose from '@/components/Purpose.astro';
import Schedule from '@/components/Schedule.astro';
import Register from '@/components/Register.astro';
import Rules from '@/components/Rules.astro';
import TechDetails from '@/components/TechDetails.astro';
import Team from '@/components/Team.astro';
import Sponsors from '@/components/Sponsors.astro';
import Contact from '@/components/Contact.astro';
import FooterPrompt from '@/components/FooterPrompt.astro';
import TetrisOverlay from '@/components/TetrisOverlay.astro';
import RhythmOverlay from '@/components/RhythmOverlay.astro';
---
<Base>
  <BootSequence />
  <Nav />
  <Hero />
  <Purpose />
  <Schedule />
  <Register />
  <Rules />
  <TechDetails />
  <Team />
  <Sponsors />
  <Contact />
  <FooterPrompt />
  <TetrisOverlay />
  <RhythmOverlay />
</Base>
```

- [ ] **Step 20.3: Build + test**

Run: `pnpm test && pnpm check && pnpm build`
Expected: tests pass, type check passes, build succeeds.

- [ ] **Step 20.4: Commit**

```bash
git add src/pages/index.astro src/layouts/Base.astro
git commit -m "feat: assemble index page and install global easter eggs"
```

---

## Task 21: 404 page (E3)

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 21.1: Write `src/pages/404.astro`**

```astro
---
import Base from '@/layouts/Base.astro';
---
<Base title="WA · NTUCPCPC">
  <main class="wrap container">
    <pre class="logo mono" aria-hidden="true">
 _    _  _____ ___      __        __                       _____
| |  | |/ ____|__ \\     \\ \\      / / __ ___  _ __   __ _  |  ___|
| |  | | (___    ) |_____\\ \\ /\\ / / '__/ _ \\| '_ \\ / _` | | |__
| |/\\| |\\___ \\  / /______\\ V  V /| | | (_) | | | | (_| | |  __|
\\_/\\_/ |____/ |_|        \\_/\\_/ |_|  \\___/|_| |_|\\__, | |_|
                                                  __/ |
                                                 |___/
    </pre>
    <h1 class="verdict mono">Verdict: <span>Wrong Answer</span></h1>
    <p class="msg mono">// 找不到這個頁面，期待的輸出與實際不符</p>
    <div class="cta">
      <a class="btn btn-primary" href="/">回首頁</a>
      <button class="btn" onclick="location.reload()">resubmit</button>
    </div>
  </main>
</Base>

<style>
  .wrap { padding-block: 120px; text-align: center; }
  .logo { color: var(--error); font-size: 0.7rem; line-height: 1.1; overflow-x: auto; }
  .verdict { font-size: 1.5rem; color: var(--fg-dim); margin-top: 24px; }
  .verdict span { color: var(--error); }
  .msg { color: var(--fg-dim); margin-bottom: 28px; }
  .cta { display: flex; gap: 12px; justify-content: center; }
</style>
```

- [ ] **Step 21.2: Build verify**

Run: `pnpm build`
Expected: success.

- [ ] **Step 21.3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: 404 page with WA verdict"
```

---

## Task 22: Final verification

- [ ] **Step 22.1: Full test suite**

Run: `pnpm test`
Expected: all green.

- [ ] **Step 22.2: Type check**

Run: `pnpm check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 22.3: Production build**

Run: `pnpm build`
Expected: success, `dist/` produced. Check `dist/index.html` exists and includes the boot sequence ASCII text and the view-source comment.

- [ ] **Step 22.4: Manual verification checklist**

Start `pnpm dev` and verify each easter egg manually:

- E1 Console banner: Open DevTools, see ASCII logo + warning + hint. Run `help()` in console — should print commands.
- E2 Footer prompt: Scroll to footer. Type `help`, `whoami`, `ls`, `cd schedule`, `tetris`, `rhythm`, `sudo rm -rf /`, `flarp`. All should respond per spec.
- E3 404: Visit `/nonexistent`. Should show WA verdict.
- E4 Tab title: Switch to another tab and back; title should cycle verdict strings while hidden and restore on focus.
- E5 CTA hover: Hover `[ register ]` — text should type out `$ xdg-open <url>`.
- E6 Konami: Press ↑↑↓↓←→←→BA — Matrix rain. Second time — random matrix/tetris/rhythm.
- E7 view-source: View page source — see the ASCII comment box at top and end-of-body comment.
- E8 logo multi-click: Click logo 5 / 10 / 20 times — pulse, console poem, unlock `sandwich` command.
- E9 Boot sequence: First visit shows compile→AC. Refresh in same session — should not show again. Open in private window — should show again.

Plus:
- Tetris: keys responsive, scoring updates, TLE game over on stack-up, best saved to localStorage.
- Rhythm: D F J K respond, song plays, ends with grade S/A/B/C, mobile shows desktop-only message.
- Responsive: resize to ≤640px — nav hamburger, schedule table OK, rhythm overlay shows mobile note.
- Reduced motion: enable in OS — boot sequence skipped, caret static, tab title not animated.

- [ ] **Step 22.5: Final commit if anything fixed**

```bash
git add -A
git commit -m "chore: final verification fixups" || echo "nothing to commit"
```

---

## Self-Review

**Spec coverage** (spec § → task):
- §1 Goals → all tasks
- §2 Tech (Astro + TS + pnpm + Vitest, no React/Tailwind) → Task 1
- §3 Tokens.css palette/fonts/visual → Task 2
- §4 Single-page sections in order → Task 20
- §5.1 Nav → Task 17
- §5.2 Hero → Task 18.3
- §5.3 Countdown → Task 18.2 + Task 4
- §5.4 BootSequence → Task 18.1
- §5.5 Schedule → Task 19.2
- §5.6 Register state → Task 19.3
- §5.7 Rules tabs → Task 19.4
- §5.8 FooterPrompt → Task 16 + Task 5
- §6.1 Tetris → Tasks 10, 11, 12
- §6.2 Rhythm → Tasks 13, 14, 15
- §7 Easter eggs E1–E9 → Tasks 7, 16, 21, 8, 18.3, 9+20, 2, 17, 18.1
- §8 dispatcher commands.ts → Task 5
- §9 Performance budget → addressed by Astro 0-JS default + island chunking (no explicit task, validated by `pnpm build` output)
- §10 Content pipeline → Task 3
- §11 Pending data → noted in Task 2 SITE.registerUrl placeholder

**Placeholder scan:** `SITE.registerUrl = 'https://forms.gle/REPLACE_ME'` is intentional per spec §11; no other TBDs.

**Type consistency:** `Result.action` uses literal union; FooterPrompt and Konami both consume `launch:tetris` / `launch:rhythm` via custom event `ntucpcpc:launch-<game>`. Tetris/Rhythm overlays both listen on those exact event names. ✓

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-16-ntucpcpc-website.md`. Per user instruction ("自己跑到全部完成") I'll proceed with **Inline Execution** via the executing-plans skill.
