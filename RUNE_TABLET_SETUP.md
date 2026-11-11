# Rune Tablet guide

`/rune-tablet` is a protected route using the existing login and session handling.
The main navigation links to it from the timer, trackers, calculators and Codex.

## Source and content

- Source workbook: `public/guides/ro-rune-tablet-thai-guide.xlsx` (supplied Thai guide, dated November 11, 2026).
- Generated data: `src/lib/generated/rune-tablet.json`.
- Imported illustrations: `public/rune-tablet/`. These are explanatory artwork from the workbook, not original game icons. Original image links remain available in the guide.
- UI: `src/components/rune-tablet/RuneTabletGuide.tsx`.
- Search and calculation helpers: `src/lib/rune-tablet.ts`.

The six page sections cover all nine source sheets: getting started, sample sets and piece thresholds, bonus calculation, materials and exchanges, NPCs and updates, and glossary and sources. The workbook download preserves the supplied file.

The data describes kRO. It is a curated guide, not a complete or live database, and does not confirm availability or recipes on GGT. Set unlock costs exclude Rune Pieces, Printing and enhancement materials.

## Import and verify

The importer uses Python's standard library and is specific to this workbook's nine-sheet layout. It reads cell values and embedded images; it does not execute workbook content or edit the source file.

```text
python scripts/import-rune-tablet.py
npm run check:rune-tablet
npm run build
```

An optional first argument specifies another copy of the same workbook. Update the importer if the source layout changes. The web application reads the committed JSON and images and does not need Python at runtime.

## Calculator scope

The calculator reproduces the 17 sample metrics in sheet 06. Each metric is evaluated as `base + floor(refinement / step) * perStep`, with refinement from 0 to 15. The step is 3 or 1 according to the source. The +15 results are checked against the workbook's saved values, including the per-level Encroachment bonus.

Each result assumes its stated piece requirement has been met. Full piece threshold descriptions are shown separately. The calculator does not estimate final damage, upgrade success rates, or material costs; these are not supplied in the workbook.
