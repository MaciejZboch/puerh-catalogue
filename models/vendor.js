const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
  name: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Vendor", VendorSchema);
