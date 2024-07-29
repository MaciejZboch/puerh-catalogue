const express = require("express");
const router = express.Router();
const Tea = require("../models/tea");
const Vendor = require("../models/vendor");
const Producer = require("../models/producer");
const catchAsync = require("../utilities/catchAsync");
const DataTable = require("datatables.net-dt");
const { isLoggedIn, isAuthor, validateTea } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const vendor = require("../models/vendor");
const upload = multer({ storage });
const currentYear = new Date().getFullYear();
const { cloudinary } = require("../cloudinary");
const tea = require("../controllers/tea");

router.get("/browse", (req, res) => {
  res.render("teas/browse", { Tea, DataTable });
});
router
  .route("/")
  .get(tea.index)
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
