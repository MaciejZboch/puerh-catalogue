// seedTeas.js

const mongoose = require("mongoose");
const Tea = require("../models/tea");
const Vendor = require("../models/vendor");
const mergedTeas = require("./mergedOutputWithAgeing"); // Array of tea objects
require("dotenv").config({ path: "../.env" });
const MONGO_URI = process.env.DB_URL;

async function seedTeas() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const vendors = {
      KingTeaMall: await Vendor.findOne({ name: "KingTeaMall" }),
      YunnanSourcing: await Vendor.findOne({ name: "Yunnan Sourcing" }),
    };

    if (!vendors.KingTeaMall || !vendors.YunnanSourcing) {
      throw new Error("One or both vendor entries not found in the database.");
    }

    for (const tea of mergedTeas) {
      const existing = await Tea.findOne({ name: tea.title });
      if (existing) {
        console.log(`🔁 Skipping existing tea: ${tea.title}`);
        continue;
      }

      const newTea = new Tea({
        name: tea.title,
        type: tea.type === "Ripe Pu-erh Tea" ? "Ripe / Shu" : "Raw / Sheng",
        year: tea.year,
        sizeInGrams: tea.sizeInGrams,
        price: tea.price,
        vendor:
          tea.vendor === "KingTeaMall"
            ? vendors.KingTeaMall._id
            : vendors.YunnanSourcing._id,
        ageing_location: tea.ageing_location || undefined,
        ageing_conditions: tea.ageing_conditions || undefined,
        shape: tea.shape || undefined, // Optional if you include shape
      });

      await newTea.save();
      console.log(`✅ Seeded: ${tea.title}`);
    }

    console.log("🎉 Seeding complete");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    mongoose.disconnect();
  }
}

seedTeas();
