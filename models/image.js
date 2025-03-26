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

module.exports = ImageSchema;
