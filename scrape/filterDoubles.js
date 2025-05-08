const fs = require("fs");

// Load data
const ys = require("./outputYS");
const ktm = require("./outputKTM");

// Create sets of titles
const ysTitles = new Set(ys.map((p) => p.title));
const ktmTitles = new Set(ktm.map((p) => p.title));

// Filter out duplicates
const ysFiltered = ys.filter((p) => !ktmTitles.has(p.title));
const ktmFiltered = ktm.filter((p) => !ysTitles.has(p.title));

// Write filtered arrays back to their files
fs.writeFileSync(
  "outputYS.js",
  `module.exports = ${JSON.stringify(ysFiltered, null, 2)};\n`
);
fs.writeFileSync(
  "outputKTM.js",
  `module.exports = ${JSON.stringify(ktmFiltered, null, 2)};\n`
);

console.log(`✅ Filtered YS: ${ys.length} → ${ysFiltered.length}`);
console.log(`✅ Filtered KTM: ${ktm.length} → ${ktmFiltered.length}`);
