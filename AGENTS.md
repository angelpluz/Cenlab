# Central Laboratory Boss Timer — Session Log

## ภาษา / Language
- Primary user language: **Thai**
- Code comments/docs: English

## โปรเจกต์นี้คืออะไร
Next.js web application สำหรับ track dungeon run ของ Ragnarok Online "Central Laboratory"
- จับเวลา boss spawn 3 รอบ
- เลือกตัวละครเข้า dungeon ทีละ 2 ตัว
- Theme เกม dark/neon (slate-950 + cyan/violet/pink accents)

## สิ่งที่สร้างไปแล้วในครั้งนี้

### Files ที่สร้าง
```
src/components/CenLabBossTimer.tsx   ← Component หลัก ใช้ได้ทั้ง App & Pages Router
src/app/cen-lab/page.tsx             ← App Router page
src/pages/cen-lab-pages.tsx          ← Pages Router example (rename → cen-lab.tsx ถ้าใช้ Pages อย่างเดียว)
src/pages/_app.tsx                   ← Pages Router root layout
src/app/layout.tsx                   ← App Router root layout
src/app/globals.css                  ← Tailwind directives + dark bg
tailwind.config.ts                   ← Custom animations (blink, pulse-fast)
postcss.config.mjs
next.config.mjs
package.json
tsconfig.json
.eslintrc.json
```

### Tech Stack
- Next.js 14.2.5 (App Router + Pages Router examples)
- React 18 + TypeScript (strict)
- Tailwind CSS 3.4
- No external UI library
- Local state only (useState/useEffect/useRef/useCallback)

### ฟีเจอร์ที่เสร็จแล้ว
1. **3 Boss Timers**
   - Stage 1: 150s (Initial Spawn)
   - Stage 2: 80s (Second Spawn)
   - Stage 3: 160s (Third Spawn)
   - นับถอยหลังแบบ MM:SS
   - Interval cleanup อย่างถูกต้อง (ไม่ leak memory)

2. **Pre-spawn Warning**
   - เหลือ ≤10 วินาที: card กระพริบสีส้ม/แดง + ข้อความ "Get Ready to Buff!"
   - เหลือ 0: ขึ้น "Boss Spawned!" สีเขียว

3. **Character Selection**
   - Mock data 12 ตัวละคร (Arch Bishop, Windhawk, Cardinal, ...)
   - เลือกได้สูงสุด 2 ตัว
   - Click อีกครั้งเพื่อ unselect
   - หลังกด Start Dungeon ตัวละครจะถูก lock
   - หลัง Reset Run ตัวละครจะถูก mark "Used This Session"
   - มีปุ่ม "Reset Session Usage" เคลียร์ used ทั้งหมด
   - มีปุ่ม "Clear Selected Characters"

4. **Run Summary Panel**
   - แสดง Selected Pair, Run Status, Active Stage, Used count
   - Next Action helper text บอกว่าต้องทำอะไรต่อ

5. **Controls**
   - Start Dungeon (disabled จนกว่าจะเลือกครบ 2 ตัว)
   - Boss 1 Defeated
   - Boss 2 Defeated
   - Reset Run

6. **Responsive Layout**
   - Mobile-first: Summary → Controls → Timers → Characters
   - Desktop (lg): Characters ซ้าย (col-span-7), Dashboard ขวา (col-span-5)

### Types ที่ใช้
```ts
type TimerStage = {
  id: "stage1" | "stage2" | "stage3";
  title: string;
  duration: number;
  remaining: number;
  status: "waiting" | "running" | "finished" | "stopped";
};

type Character = {
  id: string;
  name: string;
  job: string;
  level: number;
};
```

### สถานะการ build
- ✅ `npx next build` — ผ่าน (static generation)
- ✅ `npx next lint` — ผ่าน (no warnings/errors)
- Dev server รันได้ที่ `http://localhost:3000` (หรือ 3001 ถ้า 3000 ถูกใช้)

## ปัญหาที่เคยเจอและวิธีแก้
1. **Directory name "Cenlab" มีตัวพิมพ์ใหญ่** → npm ไม่ยอม create-next-app
   - แก้: สร้าง package.json + config files เอง แล้ว `npm install`
2. **App Router vs Pages Router conflict** → Next.js error "Conflicting app and page file"
   - แก้: Pages Router file ตั้งชื่อ `cen-lab-pages.tsx` (comment อธิบายไว้ว่าถ้าใช้ Pages อย่างเดียวให้ rename)
3. **TypeScript downlevelIteration** → `Set` spread ไม่ผ่าน
   - แก้: ใช้ `Array.from(new Set([...]))`

## ไอเดียที่อาจทำต่อในอนาคต
- [ ] บันทึกข้อมูลลง localStorage (selected chars, used chars, timer state)
- [ ] Sound/notification เมื่อ timer ใกล้หมด
- [ ] Run history log (เวลาเริ่ม, เวลาจบ, ตัวละครที่ใช้)
- [ ] ปรับแต่ง duration ของแต่ละ stage ได้เอง
- [ ] รองรับหลาย party หรือหลาย account
- [ ] Deploy เป็น static site (GitHub Pages / Vercel)

## คำสั่งที่ใช้บ่อย
```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # ESLint check
```

## หมายเหตุ
- Component หลักอยู่ที่ `src/components/CenLabBossTimer.tsx` เป็น reusable component ใช้ได้ทั้งสอง router
- สี theme: slate-950 bg, cyan/violet/pink accents, emerald สำหรับ finished, orange/red สำหรับ warning
- ใช้ `useRef` เก็บ `intervalRef` และ cleanup ใน `useEffect` return function
## 2026-06-03 Update - Individual Character Runs
- Character dungeon runs are no longer paired. Each character starts, advances bosses, and resets independently.
- Main state in `src/components/CenLabBossTimer.tsx` is now `runs: Record<string, CharacterRun>` keyed by character id.
- Each active character has its own interval stored in `intervalsRef[characterId]`.
- Roster cards now include a Start Character button and per-character run controls.
- The side panel shows active character timer panels instead of one shared boss timer.
- Character records support optional `imageSrc`; current UI uses generated portrait fallback art until real sprite files are added.

## 2026-06-23 Update - RO Codex (Item + Monster Database)
- Added `/codex` protected route for browsing Items and Monsters.
- New files:
  - `src/lib/codex-types.ts` — shared types for `CodexItem`, `CodexMonster`, `CodexEntry`, filters, tags.
  - `src/lib/codex-data.ts` — curated local seed data (no external API dependency).
  - `src/lib/codex-utils.ts` — search, filter, sort helpers.
  - `src/components/codex/CodexClient.tsx` — main client page.
  - `src/components/codex/CodexSearch.tsx` — tab + search + filter UI.
  - `src/components/codex/CodexItemCard.tsx` — item card.
  - `src/components/codex/CodexMonsterCard.tsx` — monster card.
  - `src/app/(protected)/codex/page.tsx` — protected page entry.
- Navigation: added "Codex" link in `OgchNav.tsx`.
- Approach: own curated database instead of parsing ro-calculator.sanka.in.th bundle (fragile) or relying on Divine Pride API.
- Schema supports optional `externalIds` (Divine Pride / rAthena) for future sync.
- Build & lint: ✅ passing.
