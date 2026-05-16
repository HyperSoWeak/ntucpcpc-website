# NTUCPCPC 宣傳網站 Design Spec

- 日期：2026-05-16
- 狀態：Draft（待 user review）

## 1. 目標與非目標

### 目標
- 把 `NTUCPCPC 比賽資訊.md` 的內容呈現成一個讓高中生（及家長 / 老師）能在 10 秒內找到關鍵資訊（日期、報名、規則）的靜態網站
- 用 Hacker / Terminal 美學，讓造訪者感受到「果然是臺大資工」的調性
- 提供兩個可觸發的迷你遊戲（Tetris、超迷你音遊）與若干小彩蛋，讓有耐心的訪客有挖寶樂趣

### 非目標
- 不做帳號 / 後端 / 資料庫
- 不做 i18n（只 zh-TW）
- 不做大型貫穿全場的遊戲、不做主線劇情
- 報名表單由外部 Google Form 提供，本站只負責導流
- 不做即時排行榜或社群分享分數的功能
- 不做 SEO / 流量分析的進階設定（基本 meta 即可）

## 2. 技術棧與部署

- **框架**：Astro + TypeScript（不使用 React / Vue 等 UI 框架；元件用 `.astro`）
- **樣式**：原生 CSS（CSS variables 管色票），不引入 Tailwind 或其他 utility framework
- **內容**：長文（宗旨、規則）放在 `src/content/*.md`，藉 Astro content collections 或直接 `import` 字串
- **互動 island**：Tetris、Rhythm 用 vanilla TS + Canvas，包成 Astro client island，僅在使用者觸發後 hydrate
- **部署**：純靜態輸出（`astro build` → `dist/`），未選定具體 host（Cloudflare Pages / GitHub Pages / Vercel static 皆可）
- **套件管理**：pnpm
- **Node 版本**：≥ 20

## 3. 視覺系統

### 設計原則
- **現代為主、terminal 為點綴**：整體版面、字體、留白、卡片走 GitHub Dark / Vercel / Linear 的乾淨感；terminal 元素只作為主題化的裝飾（prompt 符號、ASCII art、特定 hover 效果），不讓全站變成全黑綠螢光的 hacker 刻板印象
- **可換色**：所有色彩集中在 `src/styles/tokens.css` 的 CSS variables，換 palette 只動這檔
- **中文閱讀優先**：body 字體以中文 sans-serif 系統字為主，mono 只用在 prompt / 程式碼 / 裝飾字元（`$`, `>`, `//`）

### 色票（預設：Slate + Emerald）

集中宣告於 `src/styles/tokens.css`：

```css
:root {
  /* Surface */
  --bg:           #0b1018;   /* page background, 藍調深棕，非純黑 */
  --surface:      #141b26;   /* 卡片 / section 區塊 */
  --surface-2:    #1c2433;   /* 巢狀卡片 / 表格 hover */
  --border:       #1f2937;   /* 微化分隔線 */
  --border-soft:  #1f293780; /* 半透明分隔 */

  /* Text */
  --fg:           #e5edf5;   /* 主文字 */
  --fg-dim:       #8b97a8;   /* 次文字 / 提示 / 註解 */
  --fg-mute:      #525d6e;   /* placeholder / disabled */

  /* Accent */
  --accent:       #34d399;   /* emerald: prompt / hover / 強調 */
  --accent-soft:  #34d39920; /* 12% emerald 背景填色 */
  --link:         #7dd3fc;   /* sky 連結色 */
  --warn:         #fbbf24;   /* TLE / verdict warn */
  --error:        #f87171;   /* WA / verdict error */

  /* Radius / Shadow */
  --radius-sm:    6px;
  --radius-md:    10px;
  --radius-lg:    16px;
  --shadow-card:  0 1px 0 #ffffff08 inset, 0 8px 24px #00000040;

  /* Tetris 方塊（柔和飽和度，不螢光） */
  --tetris-1:     #34d399;  /* emerald */
  --tetris-2:     #7dd3fc;  /* sky */
  --tetris-3:     #fbbf24;  /* amber */
  --tetris-4:     #fb7185;  /* rose */
  --tetris-5:     #a78bfa;  /* violet */
  --tetris-6:     #a3e635;  /* lime */
  --tetris-7:     #22d3ee;  /* cyan */
}
```

更換 palette 只需重寫上述變數（未來可加 `data-theme="…"` 屬性切換多套）。

### 字體

```css
:root {
  --font-sans:
    'Inter', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei',
    system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono:
    'JetBrains Mono', 'Cascadia Code', 'Sarasa Mono TC',
    ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

- **Body / 標題**：`--font-sans`。Inter 處理西文（數字、字母），Noto Sans TC / 系統字處理中文。Inter 用自架 woff2 subset（latin only，~20 KB）；中文走系統字避免下載 Noto Sans TC（>500 KB）
- **Mono**：`--font-mono`。只用在 prompt、code block、`$`／`>`／`//` 裝飾字元、Tetris/Rhythm UI、Footer prompt 輸入框。JetBrains Mono 同樣只下載 latin subset
- **字級**（rem，root=16px）：`0.875 / 1 / 1.125 / 1.25 / 1.5 / 2 / 2.75 / 4`
- **行高**：body 1.7（中文閱讀友好）、標題 1.25、mono 1.5

### 版面與互動細節
- **區塊樣式**：sections 用 surface 卡片 + 圓角 + 細邊框，不用 dashed terminal box；卡片之間用大量留白（垂直間距 ≥ 96px）
- **標題裝飾**：標題前可選綴 dim `> ` 或 `## `（依設計師判斷），但不強制每個都加
- **註解裝飾**：`// 副文 ` 用 `--fg-dim` + mono 字體，用於 hero 副標 / section eyebrow
- **Prompt 標誌**：`ntucpc@2026:~$` 用 mono，emerald 色，僅出現在 Nav logo、Footer prompt、Hero 副標
- **游標**：CSS blinking block `▌`，emerald 色，blink 1.2s 週期
- **按鈕**：rounded `--radius-md`，預設 outline 風（border 1px + 透明底），primary CTA 用 `--accent-soft` 填底 + emerald 文字 + 細 emerald border
- **連結**：`--link` 色 + hover 出現底線（不用 glow），focus 顯示綠色 ring
- **Hover 動效**：subtle、150–200ms ease；不用大幅 scale 或 neon glow
- **背景**：純色 `--bg`，hero 可加一層極輕的徑向漸層（中央 emerald 1% → 透明）
- **全站避免 emoji**（user 偏好），保留 ASCII art

### 響應式
- 斷點：480 / 768 / 1024
- ≥1024：max-width 960px 置中
- 768–1024：max-width 720px
- <768：full-width 16px padding，nav 收成 hamburger（但展開仍是 `## section` 純文字列表）
- Tetris：直向螢幕自動旋轉版面（盤面置中，控制條改在下方）
- Rhythm：手機隱藏（無法雙手按 D F J K），改顯示 "rhythm game requires desktop keyboard"

### 無障礙
- 所有互動元件具備鍵盤焦點 outline（綠色 ring）
- Boot sequence / Tab title 動畫 respect `prefers-reduced-motion`
- 對比度全部達 WCAG AA（背景 vs 文字 ≥ 4.5:1）
- ASCII art 加 `aria-hidden="true"`，附上一行簡短描述供讀屏軟體

## 4. 資訊架構

單頁長卷軸。`src/pages/index.astro` 組合下列元件，順序：

1. **Nav**（sticky top）：左邊 logo（`ntucpc@2026:~$`），右邊 anchor links（日程／規則／報名／聯絡）
2. **Hero**：大標題、副標、CTA 兩顆（report / docs）、倒數計時器
3. **BootSequence**：首次造訪播一次 600ms 假編譯動畫，後續用 sessionStorage 跳過
4. **Purpose**：宗旨（來自 `purpose.md`，三段文字）
5. **Schedule**：日程表 + 決賽當日流程（可折疊）
6. **Register**：條件 checklist + Google Form CTA
7. **Rules**：tab 切換【初賽 | 決賽】，內容來自 `rules-prelim.md` / `rules-final.md`
8. **TechDetails**：DOMjudge / OS / 編譯指令
9. **Team**：負責人 + 工作人員描述
10. **Sponsors**：「待補」狀態的 placeholder
11. **Contact**：email + 社團連結
12. **Footer**：隱藏 prompt + copyright + 半透明 hint

額外頁面：
- `src/pages/404.astro`：WA verdict 主題

## 5. 元件規格

### 5.1 Nav
- sticky top，背景 `--bg` + 半透明 backdrop blur
- 滾過 hero 後出現底線 `--rule`
- 行動版收 hamburger，點開全螢幕 overlay 列出所有 anchor

### 5.2 Hero
- 大標題：`NTUCPCPC`（CSS 漸層 glitch effect，hover 觸發 1 次 RGB split 0.3 秒）
- 副標：`程式解題社程式解題競賽 / 2026`
- 兩顆 CTA：
  - Primary `[ register ]` → Google Form URL（待補，先用 placeholder）
  - Secondary `[ docs ]` → 滾到 `#rules`
- Hover 時 CTA 文字變成 `$ xdg-open <URL>` 打字機效果

### 5.3 Countdown
- 在 Hero 底下：`// T-minus 02d 14h 36m 21s until 報名截止`
- 截止時間：2026-07-12 23:59:59 +08:00（hardcode）
- 截止後自動切換為：`// 報名已截止` + 連到「比賽結果」段（如果還沒準備好則隱藏）
- 用 `setInterval(1s)`，無依賴

### 5.4 BootSequence
- 首次造訪用 `requestAnimationFrame` 在 Hero 區域上方播 ~600ms：
  ```
  $ g++ ntucpcpc.cpp -o site -O2 -std=c++20
  $ ./site --year 2026
  Compilation finished.
  Verdict: Accepted (0.04s, 12 MB)
  ```
- 完成後 fade out，sessionStorage 記錄 `boot=1` 不再播
- `prefers-reduced-motion` 直接跳過

### 5.5 Schedule
- 表格用語意 `<table>`
- 「決賽當日流程」用 `<details>` 折疊
- 行動版表格改 stacked card

### 5.6 Register
- 三個 ✓ checklist（資格、組隊、無報名費）
- 大 CTA：`[立即報名 →]`
- 報名期間外的視覺狀態：
  - 報名未開始（< 2026-05-18）：按鈕灰色 `[ pending: 報名 2026-05-18 開放 ]`
  - 報名結束後：`[ closed: 已截止 ]`
- 狀態判斷在 server side（build time）以避免 hydration 不一致；可在 client 用 setInterval 升級為即時切換（次要）

### 5.7 Rules
- Tab 切換【初賽 | 決賽】，URL 帶 `#rules-prelim` / `#rules-final`
- 共同規則放上方，差異規則放 tab 內
- 罰時公式 hover tooltip：`time(min) + wrong × 20`
- 內容 source from markdown

### 5.8 FooterPrompt（隱藏 prompt）
- 視覺：`ntucpc@2026:~$ ▌`，點擊或 Tab focus 可輸入
- 支援指令：
  | 指令 | 行為 |
  |------|------|
  | `help` | 列出所有指令 |
  | `about` | 印出社團一段話 |
  | `whoami` | `guest@ntucpcpc` |
  | `ls` | 列出 sections（[hero, schedule, rules, register, ...]） |
  | `cd <section>` | smooth scroll 到該 section |
  | `tetris` | 開 Tetris overlay |
  | `rhythm` | 開 Rhythm overlay |
  | `register` | 開新 tab 到 Google Form |
  | `clear` | 清空輸出區 |
  | `sudo <anything>` | `Permission denied: are you a 工作人員 ?` |
  | `exit` | 收起輸入框 |
  | （未知指令） | `<cmd>: command not found. try 'help'.` |
- 輸出區最多保留 20 行，超過捲動
- 上下鍵切換歷史

## 6. 迷你遊戲

### 6.1 Tetris
- **觸發**：footer prompt `tetris`、URL hash `#tetris`、Konami code 第二次以後可能（隨機三選一）
- **盤面**：10 × 20，標準 Tetris guideline 7-bag
- **操作**：← → 移動、↓ soft drop、↑ 旋轉、Space hard drop、P 暫停、Esc 離開
- **計分**：每行 100 / 300 / 500 / 800（單～四消），soft drop 1/格、hard drop 2/格
- **速度**：每 10 行升 1 級，落速指數型遞減
- **主題化**：七種方塊顏色從 `tokens.css` 額外提供的 `--tetris-1` ~ `--tetris-7` 取（預設用 emerald / sky / amber / rose / violet / lime / cyan 一組柔和飽和度，避免螢光感）；消行音效用 Web Audio 合成 8-bit beep（短促 100ms）；新方塊產生時若疊到頂端即遊戲結束，畫面顯示 `Verdict: TLE — exceeded time limit`
- **儲存**：本地最高分存 `localStorage` key `ntucpcpc.tetris.high`
- **無依賴**：純 vanilla TS + Canvas，~500 行內

### 6.2 Rhythm
- **觸發**：footer prompt `rhythm`、URL hash `#rhythm`
- **形式**：下落式 4K（D F J K），單一固定譜面，長度 ~60 秒
- **音樂**：Web Audio API 程序生成 8-bit 旋律（避免版權），主題曲叫 `NTUCPCPC Theme`
- **譜面**：手寫一份 JSON `[{time: ms, lane: 0-3}, ...]`，~150 個 notes
- **判定**：PERFECT (±30ms) / GREAT (±60ms) / GOOD (±100ms) / MISS
- **計分**：P=100, G=70, Gd=30, M=0；連擊 combo
- **行動版**：偵測無實體鍵盤時顯示 `rhythm game requires a desktop keyboard.`
- **儲存**：最高分 / S A B C 評等存 `localStorage` key `ntucpcpc.rhythm.high`

## 7. 小彩蛋（全部都做）

| 編號 | 名稱 | 規格 |
|------|------|------|
| E1 | Console banner | DOMContentLoaded 時 `console.log` 印 ASCII NTUCPCPC logo、招募訊息、警告語、提示 `help()`。在 `window` 注入 `help()` 函式列出可在 console 跑的指令（與 footer prompt 共用 dispatcher） |
| E2 | Footer hidden prompt | 見 §5.8 |
| E3 | 404 verdict | `src/pages/404.astro`，ASCII WA logo + verdict 文字 + 兩顆按鈕（resubmit = reload；回首頁） |
| E4 | Tab title verdict | `visibilitychange` 偵測 hidden，把 `document.title` 在 `[Compiling...] [AC] [TLE] [MLE] [PE]` 之間隨機切換每 2 秒一次；focus 回來恢復原 title |
| E5 | CTA hover 變指令 | `[立即報名]` hover 時透過 CSS-only 或 JS 打字機效果替換顯示為 `$ xdg-open https://forms.google.com/...`，離開時還原 |
| E6 | Konami code | `lib/konami.ts` 全域監聽，輸入完整序列後觸發：第一次 → Matrix 雨 overlay 5 秒；第二次以後 → 隨機在 [Matrix 雨 / Tetris / Rhythm] 三選一 |
| E7 | view-source 註解 | `Base.astro` 在 `<head>` 與 `<body>` 內插入大段 HTML 註解：招生 / 招社員 / 隱藏指令 hint / 一句 CSIE 內梗 |
| E8 | 倍數點 logo | Nav 的 logo 點擊計數，第 5 次：閃綠光；第 10 次：印出隨機詩；第 20 次：解鎖 prompt 多一個指令 `sudo make me a sandwich`（致敬 xkcd） |
| E9 | Boot sequence | 見 §5.4 |

## 8. 互動 dispatcher

Footer prompt、`window.help()`、Konami 觸發、URL hash、CTA hover 都共用一個 `lib/commands.ts`：

```ts
type Command = (args: string[]) => string | void;
const registry: Record<string, Command> = {
  help, about, whoami, ls, cd, tetris, rhythm, register, clear, sudo, exit
};
```

確保「指令」概念是單一事實來源；新增彩蛋只需加一個 entry。

## 9. 效能預算

- 主頁 first paint < 1.5s（4G mobile）
- 主頁傳輸 JS（不含 game）< 20 KB gzipped
- 主頁 Lighthouse Performance ≥ 95
- Tetris / Rhythm 各自 chunk < 30 KB gzipped，only 觸發後載入
- 字體用 system monospace 為主，JetBrains Mono 用 `font-display: swap` woff2 < 50 KB

## 10. 內容流程

- `purpose.md`、`rules-prelim.md`、`rules-final.md`、`tech.md`、`team.md`、`sponsors.md`、`contact.md` 從 `NTUCPCPC 比賽資訊.md` 拆出
- 拆檔時忠實保留原文，不擅自改寫
- 後續內容更新只動 markdown，不動 `.astro`

## 11. 待補資料（spec 不阻擋，但開工前需要 user 補）

- Google Form 報名 URL
- 社團 logo 圖檔（沒有的話用 ASCII 暫代）
- 8-bit theme 旋律（程序生成，但要 user 確認風格）
- Rhythm 譜面（implementer 設計，但 user 可指定難度）
- 預計部署的 host

## 12. 不在這份 spec 處理

- 比賽結果頁、得獎名單頁（比賽結束後另案）
- 後續的 FAQ 頁
- 贊助商實際 logo 與連結
- email / 表單後端
