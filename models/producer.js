const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProducerSchema = new Schema({
  name: String,
});

module.exports = mongoose.model("Producer", ProducerSchema);
