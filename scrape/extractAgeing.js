const fs = require("fs");
const path = require("path");

const products = require("./mergedOutputWithYear");

const updated = products.map((product) => {
  if (product.vendor === "KingTeaMall") {
    return {
      ...product,
      ageing_location: "Guangzhou",
      ageing_conditions: "Natural",
    };
  }
  return product;
});

const outputPath = path.join(__dirname, "mergedOutputWithAgeing.js");
const fileContent = `module.exports = ${JSON.stringify(updated, null, 2)};\n`;

fs.writeFileSync(outputPath, fileContent, "utf-8");
console.log(
  `✅ Updated ${updated.length} products with ageing info for KingTeaMall.`
);
