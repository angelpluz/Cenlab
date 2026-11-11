const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

function load(relativePath, globals = {}) {
  const source = fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const context = { exports: {}, ...globals };
  vm.runInNewContext(compiled.outputText, context);
  return context.exports;
}

const { addBangkokGameDayCooldown } = load("src/lib/game-day.ts");

test("the one-day preview resets at the next Bangkok 04:00, including midnight and year rollover", () => {
  for (const [input, expected] of [
    ["2026-11-11T03:59:59.999+07:00", "2026-11-10T21:00:00.000Z"],
    ["2026-11-11T04:00:00+07:00", "2026-11-11T21:00:00.000Z"],
    ["2026-11-11T19:30:00+07:00", "2026-11-11T21:00:00.000Z"],
    ["2026-11-12T00:30:00+07:00", "2026-11-11T21:00:00.000Z"],
    ["2026-12-31T23:59:59+07:00", "2026-12-31T21:00:00.000Z"],
  ]) {
    assert.equal(addBangkokGameDayCooldown(new Date(input), 1).toISOString(), expected);
  }
});

test("all two-dungeon actions stay in their own API and preserve the Sakray contract", async () => {
  const calls = [];
  const state = { characters: [], mappings: {} };
  const apiExports = load("src/lib/sakray-api.ts", {
    fetch: async (url, init) => {
      calls.push({ url, init });
      return { ok: true, json: async () => ({ success: true, data: state }) };
    },
  });
  const { TWO_DUNGEONS_API: api } = load("src/lib/two-dungeons.ts", {
    require: (id) => {
      assert.equal(id, "@/lib/sakray-api");
      return apiExports;
    },
  });
  assert.equal(await api.getState(), state);
  await api.completeRun("rainna");
  await api.saveMapping("kittyalp", "rainna");
  await api.saveMapping("kittyalp", null);
  await api.manualAdjust({ characterId: "rainna", clearCount: 1, lastCompletedAt: null, nextAvailableAt: null });
  await api.resetCooldown("rainna");
  assert.equal(calls.length, 6);
  for (const call of calls) {
    assert.ok(call.url.startsWith("/api/two-dungeons/"));
    assert.equal(call.init.cache, "no-store");
  }
  assert.equal(calls[1].init.method, "POST");
  assert.equal(JSON.parse(calls[1].init.body).characterId, "rainna");
  assert.equal(JSON.parse(calls[2].init.body).bishopId, "rainna");
  assert.equal(JSON.parse(calls[3].init.body).bishopId, null);
  await apiExports.getSakrayState();
  assert.equal(calls[6].url, "/api/sakray/state");
});

test("a cooldown rejection stays visible without falling back to another tracker", async () => {
  let count = 0;
  const { createDailyDungeonApi } = load("src/lib/sakray-api.ts", {
    fetch: async () => {
      count += 1;
      return { ok: false, json: async () => ({ success: false, message: "Party on cooldown", remainingCooldownSeconds: 60 }) };
    },
  });
  await assert.rejects(createDailyDungeonApi("/api/two-dungeons").completeRun("kittyalp"), /Party on cooldown.*60s remaining/);
  assert.equal(count, 1);
});
