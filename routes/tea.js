const express = require("express");
const router = express.Router();
const Tea = require("../models/tea");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateTea } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const tea = require("../controllers/tea");

router.get(
  "/collection",
  catchAsync(async (req, res) => {
    const teas = await Tea.find({ author: req.user._id })
      .populate("vendor")
      .populate("producer");
    res.render("teas/collection", { teas });
  })
);

router.get(
  "/browse/:vendorid",
  catchAsync(async (req, res) => {
    const teas = await Tea.find({ vendor: req.params.vendorid })
      .populate("vendor")
      .populate("producer");
    res.render("teas/collection", { teas });
  })
);
router
  .route("/")
  .get(catchAsync(tea.index))
  .post(isLoggedIn, upload.array("image"), validateTea, catchAsync(tea.new));

router.get("/new", isLoggedIn, catchAsync(tea.newForm));

router
  .route("/:id")
  .get(catchAsync(tea.show))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateTea,
    catchAsync(tea.update)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(tea.delete));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  validateTea,
  catchAsync(tea.editForm)
);

module.exports = router;
