const fs = require("fs");
const path = process.argv[2];
if (!path) {
  console.error("Usage: node extract-weapon-options.js <html-file>");
  process.exit(1);
}
const text = fs.readFileSync(path, "utf-8");
const regex = /aria-label="([^"]+)"[\s\S]*?src="assets\/demo\/images\/items\/([^"]+)\.png"/g;
const items = [];
let match;
while ((match = regex.exec(text)) !== null) {
  items.push({ name: match[1].trim(), itemId: Number(match[2]) });
}
const seen = new Set();
const unique = items.filter((i) => {
  if (seen.has(i.itemId)) return false;
  seen.add(i.itemId);
  return true;
});
console.log(JSON.stringify({ count: unique.length, items: unique }, null, 2));
