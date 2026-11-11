const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const guide = require("../src/lib/generated/rune-tablet.json");
const source = fs.readFileSync(path.join(root, "src/lib/rune-tablet.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
});
const context = {
  exports: {},
  require: (name) => {
    assert.equal(name, "@/lib/generated/rune-tablet.json");
    return guide;
  },
};
vm.runInNewContext(compiled.outputText, context);
const { calculateRuneMetric, filterRuneSets } = context.exports;
const metricFor = (name) => guide.sets.find((set) => set.name === name).metrics[0];

test("every +15 metric matches the saved result in the source workbook", () => {
  let count = 0;
  for (const set of guide.sets) {
    for (const metric of set.metrics) {
      assert.equal(calculateRuneMetric(metric, 15), metric.expectedAt15, `${set.name}: ${metric.label}`);
      count += 1;
    }
  }
  assert.equal(count, 17);
});

test("every +3 bonuses change only at completed upgrade steps", () => {
  const metric = metricFor("Demigod");
  for (const [level, expected] of [[0, 25], [2, 25], [3, 28], [5, 28], [6, 31], [14, 37], [15, 40]]) {
    assert.equal(calculateRuneMetric(metric, level), expected);
  }
});

test("Encroachment gains its bonus at every single upgrade", () => {
  const metric = metricFor("Encroachment");
  for (const [level, expected] of [[0, 20], [1, 21], [2, 22], [3, 23], [14, 34], [15, 35]]) {
    assert.equal(calculateRuneMetric(metric, level), expected);
  }
});

test("refinement stays in the valid integer range", () => {
  const metric = metricFor("Automatic Armor");
  assert.equal(calculateRuneMetric(metric, -3), 0);
  assert.equal(calculateRuneMetric(metric, 99), 5);
  assert.equal(calculateRuneMetric(metric, 2.9), 0);
  assert.equal(calculateRuneMetric(metric, NaN), 0);
});

test("search combines Thai/English terms with episode and piece names", () => {
  assert.equal(filterRuneSets("", "all").length, 12);
  assert.equal(filterRuneSets("", "EP21").length, 5);
  assert.equal(filterRuneSets("  CoMpAnY  ", "all")[0].name, "Company");
  assert.equal(filterRuneSets("Bishop", "all").length, 2);
  assert.equal(filterRuneSets("เวท Boss", "all").length, 2);
  assert.equal(filterRuneSets("Boss", "EP21")[0].name, "Encroachment");
  assert.equal(filterRuneSets("Bishop", "EP17").length, 0);
  assert.equal(filterRuneSets("unknown rune", "all").length, 0);
});

test("all guide sections and local source assets are available", () => {
  for (const [section, expected] of Object.entries({ steps: 7, materials: 8, sets: 12, shop: 4, npcs: 5, updates: 9, glossary: 12, sources: 5 })) {
    assert.equal(guide[section].length, expected, section);
  }
  assert.equal(guide.source.sheets.length, 9);
  assert.equal(new Set(guide.sets.map((set) => set.id)).size, 12);
  for (const asset of [...guide.sets, ...guide.materials]) {
    assert.ok(fs.existsSync(path.join(root, "public", asset.imageSrc)), asset.imageSrc);
  }
  assert.ok(fs.existsSync(path.join(root, "public", guide.source.downloadUrl)));
});
