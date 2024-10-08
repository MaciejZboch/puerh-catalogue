const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorImageSchema = new Schema({
  url: String,
  filename: String,
});

const VendorSchema = new Schema({
  name: String,
  images: [VendorImageSchema],
});

module.exports = mongoose.model("Vendor", VendorSchema);
