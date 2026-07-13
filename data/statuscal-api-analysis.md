# Analysis: Where does ro-calculator.sanka.in.th get weapon data?

> Analyzed from user-provided HTML snippet of the weapon dropdown (2026-06-24)

## Short Answer
**It is NOT fetching weapon data from a public REST API in real-time.**

The dropdown list is already rendered into the HTML/Angular template. The data is loaded from the application's own bundle or local data files, then filtered/rendered client-side.

## Evidence from the snippet

1. **No API URL in the dropdown**
   - The dropdown items are hardcoded `<p-dropdownitem>` / `<li role="option">` elements.
   - Each item has `aria-label`, `aria-posinset`, and `aria-setsize="69"` (69 total weapons in this list).

2. **Item images are local assets**
   ```
   src="assets/demo/images/items/700065.png"
   src="assets/demo/images/items/700032.png"
   src="assets/demo/images/items/18186.png"
   ```
   These are served from the website's own `assets/demo/images/items/` folder.

3. **Item IDs match Divine Pride format**
   - `700065` = [LV 5] Angel Wing Bow [2]
   - `700032` = Adulter Fides Aiming Bow [2]
   - `18186` = Aiming Bow [2]
   - `1231` = Bazerald
   - etc.

   This confirms the site uses **Divine Pride item IDs** as its primary key, even though the data itself is stored locally.

## What this means

| Source | Used for? | Accessible? |
|--------|-----------|-------------|
| `assets/demo/images/items/[id].png` | Item sprites | Yes, but only IDs the site has cached |
| Divine Pride API (`www.divine-pride.net/api/database/Item/[id]`) | Full item stats/description | Yes, with free API key |
| Site's own JS bundle / local JSON | The actual filtered weapon list | Not exposed as a clean endpoint |

## How to get the full weapon/item database

1. **Easiest**: Use Divine Pride API with an API key.
   - Endpoint: `https://www.divine-pride.net/api/database/Item/{id}?apiKey=YOUR_KEY`
   - You can iterate over known item IDs (e.g. from this dropdown) to fetch details.

2. **From the site itself**: The dropdown only shows a filtered subset (69 weapons for this job/class). To get all items you would need to trigger every dropdown in every context, or inspect the site's JS bundle for the master item list.

## If you want the 69 weapons as JSON

Paste the snippet into `data/snippet-weapon-dropdown.html`, then run:

```bash
node scripts/extract-weapon-options.js data/snippet-weapon-dropdown.html > data/statuscal-weapon-options.json
```

The parser reads `aria-label` + `assets/demo/images/items/{id}.png` from the dropdown HTML.
