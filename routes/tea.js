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
const { hasNoSpecialSymbols } = require("../middleware");

router
  .route("/newVendor")
  .get(catchAsync(tea.newVendor))
  .post(hasNoSpecialSymbols, catchAsync(tea.postVendor));

router.get("/collection/:id", isLoggedIn, catchAsync(tea.collection));

router.get("/browse", catchAsync(tea.browse));

router
  .route("/")
  .get(catchAsync(tea.index))
  .post(
    isLoggedIn,
    hasNoSpecialSymbols,
    upload.array("image"),
    validateTea,
    catchAsync(tea.new)
  );

router.get("/new", isLoggedIn, catchAsync(tea.newForm));
router
  .route("/newVendor")
  .get(isLoggedIn, tea.newVendor)
  .post(isLoggedIn, hasNoSpecialSymbols, catchAsync(tea.postVendor));

router
  .route("/newProducer")
  .get(isLoggedIn, tea.newProducer)
  .post(isLoggedIn, hasNoSpecialSymbols, catchAsync(tea.postProducer));

router
  .route("/:id")
  .get(catchAsync(tea.show))
  .put(
    isLoggedIn,
    hasNoSpecialSymbols,
    isAuthor,
    upload.array("image"),
    validateTea,
    catchAsync(tea.update)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(tea.delete));

router
  .route("/:id/add")
  .post(isLoggedIn, catchAsync(tea.addToCollection))
  .delete(isLoggedIn, catchAsync(tea.removeFromCollection));

module.exports = router;
