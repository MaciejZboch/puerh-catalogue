const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utilities/catchAsync");
const users = require("../controllers/users");
const { hasNoSpecialSymbols } = require("../middleware");

router
  .route("/register")
  .get(users.registerForm)
  .post(hasNoSpecialSymbols, catchAsync(users.register));

router
  .route("/login")
  .get(users.loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
