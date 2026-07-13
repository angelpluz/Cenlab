# RO Codex — Status & Next Steps

> Last updated: 2026-06-24

## ที่ทำไปแล้ว ✅

### 1. Infrastructure / Code
- สร้างหน้า `/codex` ภายใต้ `(protected)` route (ต้อง login)
- สร้าง type system ใน `src/lib/codex-types.ts`
  - `CodexItem`, `CodexMonster`, `CodexEntry`, `CodexFilter`
  - enums: `ItemCategory`, `ItemSlot`, `MonsterRace`, `MonsterElement`, `MonsterSize`
  - `ExternalIds` รองรับ Divine Pride / rAthena ID สำหรับ sync ภายหลัง
- สร้าง utility `src/lib/codex-utils.ts` สำหรับ search/filter/sort/format
- สร้าง UI components ครบชุด:
  - `CodexClient.tsx` — หน้าหลัก
  - `CodexSearch.tsx` — tab Items/Monsters + search + filter
  - `CodexItemCard.tsx` — การ์ดไอเทม
  - `CodexMonsterCard.tsx` — การ์ดมอนสเตอร์
- เพิ่มลิงก์ "Codex" ใน `OgchNav.tsx`
- อัปเดต `AGENTS.md` แล้ว

### 2. Seed Data (Curated Local)
ตอนนี้มี seed เริ่มต้นใน `src/lib/codex-data.ts`:

| ประเภท | จำนวน | ตัวอย่าง |
|--------|-------|----------|
| Items | 16 รายการ | Fly Wing, Yggdrasil Berry, Cenia's Orb, OGCH Token, Temporal Armor, Trident of the Abyss, การ์ดบางใบ |
| Monsters | 10 รายการ | Poring, Cenia, Amdarais, Kraken, Baphomet, Mistress |

เป็นแค่ **ตัวอย่าง/โครง** เท่านั้น ยังไม่ครบถ้วนเมื่อเทียบกับเว็บต้นทาง

### 3. Parse `statuscal.html` (dump จาก ro-calculator.sanka.in.th)
- สร้าง script `scripts/extract-statuscal.js`
- ดึง JSON ทั้งหมดออกมาจาก HTML dump:
  - `characterBuild` — ข้อมูลตัวละคร + สถานะ + อุปกรณ์ที่สวมใส่
  - `calculatedResult` — ผลคำนวณ stats/dmg/skill
  - `equipmentSummary` — bonus ของแต่ละช่องอุปกรณ์
  - `costumeShadowConsumables` — bonus จาก costume/shadow/consumable
- ผลลัพธ์อยู่ใน `data/statuscal-extracted.json`
- สรุปข้อมูลที่ extract ได้:
  - Item IDs: 44 รายการ
  - Equipment names: 40 รายการ
  - Monster image ID: 21981 (`Ultimate Lasgand`)

### 4. Divine Pride API Fetcher
- สร้าง script `scripts/fetch-divine-pride.js`
- อ่าน item IDs จาก `data/statuscal-extracted.json`
- ดึงข้อมูล Item/Monster จาก Divine Pride API
- ต้องใช้ `DIVINE_PRIDE_API_KEY` (สมัครฟรีที่ https://www.divine-pride.net/portal)
- ผลลัพธ์จะเขียนลง `data/divine-pride-items.json`

```bash
# 1. แกะข้อมูลจาก statuscal.html
node scripts/extract-statuscal.js

# 2. ดึงข้อมูลจาก Divine Pride (ต้องมี API key)
DIVINE_PRIDE_API_KEY=your_key node scripts/fetch-divine-pride.js
```

### 5. Build & Lint
- ✅ `npm run lint` ผ่าน
- ✅ `npm run build` ผ่าน

---

## ข้อมูลที่ยังขาด ⏳

### เมื่อเทียบกับ `https://ro-calculator.sanka.in.th/`
เว็บต้นทางมีข้อมูลละเอียดกว่ามาก ซึ่งตอนนี้ยังไม่ได้ใส่เข้ามา:

1. **Item Master Data**
   - ไอเทมทั้งหมดใน RO (น่าจะหลักพันรายการ)
   - ข้อมูลเชิงลึก: ATK/MATK, DEF/MDEF, สายอาชีพที่สวมใส่ได้, ราคาซื้อขาย, weight ที่ถูกต้อง
   - Card compounded effect, set bonus
   - Slot แยกเป็น head-top/mid/low, armor, weapon, shield, etc. แบบละเอียด

2. **Monster Master Data**
   - มอนสเตอร์ทั้งหมดใน RO (หลักพันรายการ)
   - Stat: STR/AGI/VIT/INT/DEX/LUK, ATK, DEF, MDEF, FLEE, HIT
   - Element level ที่ถูกต้อง
   - Drop rate ที่ถูกต้อง (เช่น 0.01%)
   - Map/Spawn location ที่แน่นอน
   - MVP/mini-boss flag

3. **Cross-reference**
   - Item ดรอปจากมอนสเตอร์ตัวไหน
   - Monster ดรอปอะไรบ้าง
   - Quest ที่เกี่ยวข้อง

### เหตุผลที่ข้อมูลยังไม่ครบ
- ข้อมูลหลักของ `ro-calculator.sanka.in.th` อยู่ใน bundle JS หรือมาจาก Divine Pride ไม่ได้เปิดเป็น public REST API ตรง ๆ
- Supabase table (`custom_items`, `custom_monsters`, `ro_presets`) เป็น table สำหรับ custom data ของผู้ใช้ ไม่ใช่ item/monster master (query แล้วได้ `[]`)
- การ parse bundle ของเว็บเขาจะเปราะมาก ถ้า build ใหม่ variable เปลี่ยน ระบบเราพังได้
- คิมิจังเลยเลือกสร้าง curated database ของเราเองก่อน

---

## ทางเลือกสำหรับเติมข้อมูลให้ครบ

### ทางเลือก A — Import จาก Divine Pride API (แนะนำ)
- Divine Pride มี API เปิดให้ดึงข้อมูล Item/Monster ได้
- ข้อดี: ข้อมูลครบ มาตรฐานชุมชน RO
- ข้อควรระวัง:
  - ต้องสมัคร API key
  - มี rate limit (ต้อง cache หรือดึงช่วง dev ครั้งเดียว)
  - ถ้าเรียกตรงจาก client ทุกครั้งอาจโดน block
- วิธีที่เหมาะ:
  1. สร้าง script ดึงข้อมูลจาก Divine Pride ตอน dev
  2. แปลงเป็น JSON/TS seed
  3. commit ลง repo เป็น local data
  4. หน้าเว็บอ่านจาก local data (ไม่ต้องเรียก API บ่อย)

### ทางเลือก B — Import จาก rAthena
- rAthena มี `item_db.yml` / `mob_db.yml` บน GitHub
- ข้อดี: open source, นิ่ง, ไม่ต้อง API key
- ข้อควรระวัง:
  - ต้อง parse YAML
  - ข้อมูลอาจไม่สอดคล้องกับเซิร์ฟเวอร์ที่เล่น (ถ้าเซิร์ฟ custom)
- เหมาะสำหรับใช้เป็น base data แล้ว override ด้วย custom data ของเซิร์ฟเรา

### ทางเลือก C — Manual Curated (ที่ทำอยู่ตอนนี้)
- เติมข้อมูลเองทีละรายการใน `src/lib/codex-data.ts`
- ข้อดี: ควบคุมได้ 100%, ไม่มี dependency
- ข้อเสีย: ช้า, ไม่ครบทุกตัว
- เหมาะสำหรับข้อมูลเฉพาะที่ใช้บ่อย เช่น boss drops, dungeon gears

---

## งานที่ควรทำต่อ

1. **ตัดสินใจ data source หลัก**
   - Divine Pride API vs rAthena vs manual
   - หรือผสม: ดึงจาก Divine Pride แล้วเก็บเป็น local JSON

2. **สร้าง import script**
   - ตัวอย่าง: `scripts/import-divine-pride.ts` หรือ `scripts/import-rathena.ts`
   - ดึงข้อมูล → แปลง schema → เขียนลง `src/lib/codex-data.ts` หรือ `public/data/codex.json`

3. **ขยาย schema ให้รองรับข้อมูลเพิ่ม**
   - Item: job equip, stat bonus แบบ structured, buy/sell price, card slot ละเอียด
   - Monster: stats (STR/AGI/VIT/INT/DEX/LUK), ATK, DEF, MDEF, FLEE, HIT, drop rate

4. **เพิ่มระบบ Image**
   - รูปไอเทม/มอนสเตอร์จาก Divine Pride sprite URL (ถ้ามีสิทธิ์ใช้)
   - หรือใช้ placeholder ตัวอักษร/emoji ไปก่อน

5. **เชื่อมโยงกับ dungeon trackers**
   - คลิก boss ในหน้า Cen Lab/OGCH/Water Dungeon แล้วไปดูข้อมูลใน Codex
   - แสดง drops ของ boss ใน tracker ได้

6. **Pagination / Virtualization**
   - ถ้าข้อมูลครบหลักพันรายการ ต้องทำ pagination หรือ virtualized list
   - ตอนนี้ render ทั้งหมดในหน้าเดียว เหมาะกับข้อมูลน้อย ๆ

---

## สรุป
ตอนนี้ระบบ **Codex UI ทำงานได้แล้ว** แต่ **ข้อมูล (data) ยังเป็น seed เริ่มต้น** ไม่ครบเหมือนเว็บต้นทาง ขั้นตอนต่อไปคือเลือก data source ที่นิ่งกว่า (แนะนำ Divine Pride แล้ว cache เป็น local data) แล้ว import ข้อมูลเข้ามาเติมให้ครบครับ
