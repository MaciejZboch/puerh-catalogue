const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateTea } = require("../middleware");
const tea = require("../controllers/tea");

router.get("/:id", isLoggedIn, isAuthor, validateTea, catchAsync(tea.editForm));

module.exports = router;
