const express = require("express");
const router = express.Router();
const Tea = require("../models/tea");
const Vendor = require("../models/vendor");
const Producer = require("../models/producer");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateTea } = require("../middleware");
const multer = require("multer");
const MulterError = require("../utilities/MulterError");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const tea = require("../controllers/tea");

router
  .route("/newVendor")
  .get(catchAsync(tea.newVendor))
  .post(catchAsync(tea.postVendor));

router.get("/collection", isLoggedIn, catchAsync(tea.collection));

router.get("/browse", catchAsync(tea.browse));

router
  .route("/")
  .get(catchAsync(tea.index))
  .post(isLoggedIn, upload.array("image"), validateTea, catchAsync(tea.new));

router.get("/new", isLoggedIn, catchAsync(tea.newForm));
router
  .route("/newVendor")
  .get(isLoggedIn, tea.newVendor)
  .post(catchAsync(tea.postVendor));

router
  .route("/newProducer")
  .get(isLoggedIn, tea.newProducer)
  .post(isLoggedIn, upload.array("image"), catchAsync(tea.postProducer));

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

router
  .route("/:id/add")
  .post(isLoggedIn, catchAsync(tea.add))
  .delete(isLoggedIn, catchAsync(tea.remove));

module.exports = router;
