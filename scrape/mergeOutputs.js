const fs = require("fs");
const path = require("path");

const ysProducts = require("./outputYS");
const ktmProducts = require("./outputKTM");
const ktmShouProducts = require("./outputKTMshou");

// Tag each product with the appropriate vendor
const taggedYS = ysProducts.map((p) => ({ ...p, vendor: "YunnanSourcing" }));
const taggedKTM = ktmProducts.map((p) => ({ ...p, vendor: "KingTeaMall" }));
const taggedKTMShou = ktmShouProducts.map((p) => ({
  ...p,
  vendor: "KingTeaMall",
}));

// Combine all tagged arrays
const mergedProducts = [...taggedYS, ...taggedKTM, ...taggedKTMShou];

// Output to merged file
const outputPath = path.join(__dirname, "mergedOutput.js");
const fileContent = `module.exports = ${JSON.stringify(
  mergedProducts,
  null,
  2
)};\n`;

fs.writeFileSync(outputPath, fileContent, "utf-8");

console.log(`✅ Merged ${mergedProducts.length} products into mergedOutput.js`);
