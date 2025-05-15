const fs = require("fs");
const path = require("path");

const products = require("./mergedOutput");

const updated = products.map((product) => {
  const title = product.title || "";
  const yearStr = title.slice(0, 4);
  const year = parseInt(yearStr, 10);

  // Only update if first 4 characters are a valid year
  if (!isNaN(year) && yearStr.match(/^\d{4}$/)) {
    return {
      ...product,
      title: title.slice(5).trim(), // remove year + space
      year,
    };
  } else {
    return product; // leave unchanged if year not valid
  }
});

const outputPath = path.join(__dirname, "mergedOutputWithYear.js");
const fileContent = `module.exports = ${JSON.stringify(updated, null, 2)};\n`;

fs.writeFileSync(outputPath, fileContent, "utf-8");
console.log(
  `✅ Updated ${updated.length} products with year extracted from title.`
);
