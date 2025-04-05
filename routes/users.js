const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const users = require("../controllers/users");
const { hasNoSpecialSymbols, isLoggedIn } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/register")
  .get(users.registerForm)
  .post(
    hasNoSpecialSymbols,
    upload.single("image"),
    catchAsync(users.register)
  );

router.route("/login").get(users.loginForm).post(users.login);
router.get("/logout", isLoggedIn, users.logout);
router.put("/users/:id", isLoggedIn, users.follow); //follow route
router.delete("/users/:id", isLoggedIn, users.unfollow);

module.exports = router;
