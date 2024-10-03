const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProducerImageSchema = new Schema({
  url: String,
  filename: String,
});

const ProducerSchema = new Schema({
  name: String,
  image: ProducerImageSchema,
});

module.exports = mongoose.model("Producer", ProducerSchema);
