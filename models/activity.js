const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["review", "tea"], required: true },
  refId: { type: Schema.Types.ObjectId, required: true }, // points to the Review or Tea
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);
