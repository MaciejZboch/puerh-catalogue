const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProducerSchema = new Schema({
  name: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Producer", ProducerSchema);
