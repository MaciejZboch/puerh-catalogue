const mongoose = require("mongoose");
const teaSeed = require("./teaSeed");
const vendorSeed = require("./vendorSeed");
const vendor = require("../models/vendor");
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
