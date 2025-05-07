const fs = require("fs");

function loadRawShopifyData(filePath) {
  try {
    const jsonString = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to load JSON:", err);
    process.exit(1);
  }
}

function loadExistingData(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    try {
      return eval(content); // assumes output file contains JS array, e.g. module.exports = [ ... ];
    } catch {
      return [];
    }
  }
  return [];
}

function parseShopifyProducts(products) {
  const parsed = [];

  for (const product of products) {
    const productType = product.type || null;

    for (const variant of product.variants || []) {
      const title = product.title || variant.name || "";
      const priceCents = variant.price || 0;
      const price = priceCents / 100;

      const sizeMatch = variant.name.match(/(\d+)\s*(g|gram|grams)/i);
      const sizeInGrams = sizeMatch ? parseInt(sizeMatch[1], 10) : null;
      const pricePerGram = sizeInGrams
        ? +(price / sizeInGrams).toFixed(2)
        : null;

      let cleanTitle = title;
      if (/ - .{1,15}$/.test(cleanTitle)) {
        cleanTitle = cleanTitle.replace(/ - .{1,15}$/, "").trim();
      }

      parsed.push({
        title: cleanTitle,
        sizeInGrams,
        price,
        pricePerGram,
        type: productType,
      });
    }
  }

  return parsed;
}

function deduplicateByTitleAndKeepLargest(products) {
  const map = new Map();

  for (const product of products) {
    const key = product.title.slice(0, 40).toLowerCase();
    const existing = map.get(key);

    if (!existing || product.sizeInGrams > (existing.sizeInGrams || 0)) {
      map.set(key, product);
    }
  }

  return Array.from(map.values());
}

const raw = loadRawShopifyData("data.json");
const parsed = parseShopifyProducts(raw);
const filtered = deduplicateByTitleAndKeepLargest(parsed);

const outputPath = "outputYS.js";
const existing = loadExistingData(outputPath);
const combined = [...existing, ...filtered];

const content = `module.exports = ${JSON.stringify(combined, null, 2)};\n`;
fs.writeFileSync(outputPath, content, "utf-8");

console.log(`✅ Saved ${filtered.length} new products to outputYS.js`);
