const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const Vendor = require("./vendor");
const Producer = require("./producer");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_40,ar_1:1,c_fill,g_auto");
});

ImageSchema.virtual("square").get(function () {
  return this.url.replace("/upload", "/upload/w_500,ar_1:1,c_fill,g_auto");
});

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
    enum: ["Dry", "Natural", "Wet", "Hong-Kong Traditional"],
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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
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

TeaSchema.virtual("average").get(function () {
  const reviews = this.reviews;
  const mappedReviews = reviews.map((x) => x.rating);
  function getAverage(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    return sum / array.length;
  }
  return getAverage(mappedReviews);
});

module.exports = mongoose.model("Tea", TeaSchema);
