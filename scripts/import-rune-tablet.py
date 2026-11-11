"""Import the supplied Rune Tablet guide using only Python's standard library.

Usage: python scripts/import-rune-tablet.py [path/to/guide.xlsx]
The workbook is a data source; cell text is never executed.
"""

import json
import posixpath
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "public/guides/ro-rune-tablet-thai-guide.xlsx"
NS = {
    "s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "xdr": "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
}


def slug(value):
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def target_path(owner, target):
    if target.startswith("/"):
        return target.lstrip("/")
    return posixpath.normpath(posixpath.join(posixpath.dirname(owner), target))


with ZipFile(SOURCE) as archive:
    def relationships(owner):
        directory, name = posixpath.split(owner)
        path = posixpath.join(directory, "_rels", name + ".rels")
        if path not in archive.namelist():
            return {}
        return {
            node.attrib["Id"]: target_path(owner, node.attrib["Target"])
            for node in ET.fromstring(archive.read(path))
            if node.attrib.get("TargetMode") != "External"
        }

    strings = []
    if "xl/sharedStrings.xml" in archive.namelist():
        strings = [
            "".join(node.itertext())
            for node in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("s:si", NS)
        ]
    workbook_rels = relationships("xl/workbook.xml")
    sheets = []
    for node in ET.fromstring(archive.read("xl/workbook.xml")).findall("s:sheets/s:sheet", NS):
        path = workbook_rels[node.attrib["{" + NS["r"] + "}id"]]
        tree = ET.fromstring(archive.read(path))
        rows = {}
        for row in tree.findall("s:sheetData/s:row", NS):
            cells = {}
            for cell in row.findall("s:c", NS):
                value_node = cell.find("s:v", NS)
                inline = cell.find("s:is", NS)
                value = value_node.text if value_node is not None else "".join(inline.itertext()) if inline is not None else ""
                if cell.attrib.get("t") == "s":
                    value = strings[int(value)]
                cells[re.sub(r"\d", "", cell.attrib["r"])] = value or ""
            rows[int(row.attrib["r"])] = cells
        sheets.append({"name": node.attrib["name"], "path": path, "tree": tree, "rows": rows})

    def row(sheet_index, row_number):
        return sheets[sheet_index]["rows"][row_number]

    def records(sheet_index, start, end, columns):
        return [
            {name: row(sheet_index, number)[column] for name, column in columns.items()}
            for number in range(start, end + 1)
        ]

    def image(sheet_index, row_number, name):
        sheet = sheets[sheet_index]
        drawing = sheet["tree"].find("s:drawing", NS)
        drawing_path = relationships(sheet["path"])[drawing.attrib["{" + NS["r"] + "}id"]]
        drawing_rels = relationships(drawing_path)
        for anchor in ET.fromstring(archive.read(drawing_path)):
            from_row = anchor.find("xdr:from/xdr:row", NS)
            if from_row is not None and int(from_row.text) + 1 == row_number:
                blip = anchor.find(".//a:blip", NS)
                media_path = drawing_rels[blip.attrib["{" + NS["r"] + "}embed"]]
                output = ROOT / "public/rune-tablet" / (name + ".png")
                output.parent.mkdir(parents=True, exist_ok=True)
                output.write_bytes(archive.read(media_path))
                return "/rune-tablet/" + output.name
        raise ValueError(f"Missing illustration: sheet {sheet_index}, row {row_number}")

    sets = records(3, 6, 17, {
        "episode": "B", "name": "C", "playstyle": "D", "pieceCount": "E",
        "imperfectRunes": "F", "perfectRunes": "G", "otherMaterials": "H",
        "pieces": "I", "summary": "J", "exampleAt15": "K", "originalImageUrl": "L", "sourceUrl": "M",
    })
    for index, rune_set in enumerate(sets):
        rune_set["id"] = slug(rune_set["name"])
        for key in ["pieceCount", "imperfectRunes", "perfectRunes"]:
            rune_set[key] = int(rune_set[key])
        rune_set["pieces"] = [piece.strip() for piece in rune_set["pieces"].split("•")]
        rune_set["imageSrc"] = image(3, index + 6, rune_set["id"])
        rune_set["bonuses"] = [
            {"pieces": int(value["D"]), "description": value["E"], "scaling": value["F"]}
            for number, value in sheets[4]["rows"].items()
            if 6 <= number <= 27 and value["B"] == rune_set["name"]
        ]
        rune_set["metrics"] = [
            {
                "label": value["C"], "base": int(value["D"]), "perStep": int(value["E"]),
                "step": int(re.search(r"\d+", value["F"]).group()), "expectedAt15": int(value["G"]),
                "unit": value["H"], "requirement": value["I"],
            }
            for number, value in sheets[5]["rows"].items()
            if 11 <= number <= 27 and value["B"] == rune_set["name"]
        ]
        for metric in rune_set["metrics"]:
            assert metric["base"] + (15 // metric["step"]) * metric["perStep"] == metric["expectedAt15"]

    materials = records(2, 6, 13, {
        "category": "B", "thaiName": "C", "name": "D", "itemId": "E",
        "obtainedFrom": "F", "usage": "G", "originalImageUrl": "H", "sourceUrl": "I",
    })
    for index, material in enumerate(materials):
        material["imageSrc"] = image(2, index + 6, material["itemId"])

    data = {
        "source": {
            "filename": "RO_Rune_Tablet_Thai_Guide.xlsx", "guideDate": "2026-11-11", "server": "kRO",
            "url": row(8, 21)["B"], "downloadUrl": "/guides/ro-rune-tablet-thai-guide.xlsx",
            "sheets": [sheet["name"] for sheet in sheets],
        },
        "reminders": records(0, 19, 23, {"title": "B", "detail": "C"}),
        "steps": records(1, 6, 12, {
            "title": "B", "action": "C", "result": "D", "warning": "E", "example": "F", "summary": "G",
        }),
        "materials": materials,
        "otherMaterials": row(2, 16)["A"],
        "sets": sets,
        "shop": records(6, 6, 9, {
            "name": "B", "imperfectRunes": "C", "otherItem": "D", "otherQuantity": "E", "description": "F", "note": "G",
        }),
        "npcs": records(7, 6, 10, {"city": "A", "map": "B", "coordinates": "C", "services": "D"}),
        "updates": records(7, 15, 23, {"date": "A", "title": "B", "change": "C", "meaning": "D"}),
        "glossary": records(8, 6, 17, {"term": "A", "meaning": "B", "note": "C"}),
        "sources": records(8, 21, 25, {"title": "A", "url": "B", "note": "C"}),
    }
    for offer in data["shop"]:
        offer["imperfectRunes"] = int(offer["imperfectRunes"])
        offer["otherQuantity"] = None if offer["otherQuantity"] == "–" else int(offer["otherQuantity"])

    destination = ROOT / "src/lib/generated/rune-tablet.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(sets)} sets, {sum(len(s['bonuses']) for s in sets)} bonus tiers, "
          f"{sum(len(s['metrics']) for s in sets)} calculator metrics, {len(materials)} materials.")
