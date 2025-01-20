const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

/*const UserAccess = {
  MOD: "mod",
  USER: "user",
  ADMIN: "admin",
};*/

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  moderator: {
    type: Boolean,
  },
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
