const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ImageSchema = require("./image");

const TeaSchema = new Schema({
  name: String,
  description: String,
  images: [ImageSchema],
  type: { type: String, enum: ["Raw / Sheng", "Ripe / Shu", "blend"] },
  year: Number,
  region: String,
  village: String,
  ageing_location: String,
  ageing_conditions: {
    type: String,
    enum: ["Dry", "Natural", "Wet", "Hong-Kong Traditional", "Unknown"],
  },
  shape: {
    type: String,
    enum: [
      "Loose",
      "Cake",
      "Tuo",
      "Brick",
      "Mushroom",
      "Dragon ball",
      "Tube",
      "Melon",
      "Other",
    ],
  },
  producer: {
    type: Schema.Types.ObjectId,
    ref: "Producer",
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "Vendor",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  owners: [{ type: Schema.Types.ObjectId, ref: "User" }],
  sizeInGrams: Number,
  price: Number,
});

//setting price per gram virtual
TeaSchema.virtual("pricePerGram").get(function () {
  return this.price / this.sizeInGrams;
});

//setting up an index to search in all fields
TeaSchema.index({
  name: "text",
  type: "text",
  region: "text",
  village: "text",
  ageing_location: "text",
  ageing_conditions: "text",
  shape: "text",
  vendor: "text",
  producer: "text",
});

TeaSchema.set("toObject", { virtuals: true });
TeaSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Tea", TeaSchema);
