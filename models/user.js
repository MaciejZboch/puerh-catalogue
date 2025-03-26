const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const ImageSchema = require("./image");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  moderator: {
    type: Boolean,
  },
  image: ImageSchema,
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
