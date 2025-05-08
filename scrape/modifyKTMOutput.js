const fs = require("fs");

// Load data
const ktm = require("./outputKTM");
const ktmShou = require("./outputKTMshou");

// Add type to each product
const updatedKTM = ktm.map((p) => ({ ...p, type: "Raw Pu-erh Tea" }));
const updatedKTMShou = ktmShou.map((p) => ({ ...p, type: "Ripe Pu-erh Tea" }));

// Save back to the same files
fs.writeFileSync(
  "outputKTM.js",
  `module.exports = ${JSON.stringify(updatedKTM, null, 2)};\n`
);
fs.writeFileSync(
  "outputKTMshou.js",
  `module.exports = ${JSON.stringify(updatedKTMShou, null, 2)};\n`
);

console.log("✅ Types added to outputKTM.js and outputKTMshou.js");
