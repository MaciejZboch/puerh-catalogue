const fs = require("fs");
const outputFile = "outputKTM.js";

// Load the raw Shopify JSON data
function loadRawShopifyData(filePath) {
  try {
    const jsonString = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to load JSON:", err);
    process.exit(1);
  }
}

// Load existing parsed data from outputKTM.js
function loadExistingOutput(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = eval(content.replace("module.exports =", ""));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Failed to load existing output file:", err);
    return [];
  }
}

// Parse products from raw Shopify format
function parseShopifyProducts(products) {
  const parsed = [];

  for (const product of products) {
    for (const variant of product.variants || []) {
      let title = variant.name || product.title || "";
      const priceCents = variant.price || 0;
      const price = priceCents / 100;

      const sizeMatch = title.match(/(\d+)\s*(g|gram|grams)/i);
      const sizeInGrams = sizeMatch ? parseInt(sizeMatch[1], 10) : null;
      const pricePerGram = sizeInGrams
        ? +(price / sizeInGrams).toFixed(2)
        : null;

      const shape = variant.public_title || "";
      if (/stack/i.test(shape)) continue;

      const dashIndex = title.lastIndexOf(" - ");
      if (dashIndex !== -1 && dashIndex >= title.length - 15) {
        title = title.slice(0, dashIndex).trim();
      }

      parsed.push({
        title,
        sizeInGrams,
        price,
        pricePerGram,
      });
    }
  }

  const grouped = {};
  for (const product of parsed) {
    const prefix = product.title.slice(0, 30);
    if (!grouped[prefix] || product.sizeInGrams > grouped[prefix].sizeInGrams) {
      grouped[prefix] = product;
    }
  }

  return Object.values(grouped);
}

// Load raw, existing, merge, and write output
const raw = loadRawShopifyData("data.json");
const newParsed = parseShopifyProducts(raw);
const existingParsed = loadExistingOutput(outputFile);

// Deduplicate by matching title + sizeInGrams
const mergedMap = {};
[...existingParsed, ...newParsed].forEach((item) => {
  const key = item.title + "-" + item.sizeInGrams;
  mergedMap[key] = item;
});

const mergedArray = Object.values(mergedMap);

console.log(`✅ Total combined products: ${mergedArray.length}`);
fs.writeFileSync(
  outputFile,
  "module.exports = " + JSON.stringify(mergedArray, null, 2) + ";\n"
);
console.log("Appended and saved to outputKTM.js ✅");

/* Example product structure
{
  "title": "2015 CNNP Liu Bao \"Lao Jiao Chen Cha - 2138 - Yi Ji\"",
  "vendor": "KingTea",
  "id": "8956373893350",
  "url": "/en-pl/products/2015-cnnp-liu-bao-lao-jiao-chen-cha-yi-ji-1st-grade-material-1000g-basket-liubao-loose-leaf-dark-tea-wuzhou-guangxi",
  "price": {
    "amount": 2.99,
    "currencyCode": "USD"
  },
  "image": "//kingteamall.com/cdn/shop/files/34801741244904_.pic.jpg?v=1741245113",
  "sampleSize": "7g"
}
*/

/*[
  {
    "title": "Puerh Sample 100g - Spring Harvest",
    "price": "$19.99",
    "link": "https://some-site.com/product/puerh-sample-100g"
  },
  {
    "title": "Menghai Raw Puerh Cake 357g",
    "price": "$42.00",
    "link": "https://some-site.com/product/menghai-raw-357g"
  }
]
*/
