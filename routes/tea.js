const express = require("express");
const router = express.Router();
const Tea = require("../models/tea");
const Vendor = require("../models/vendor");
const Producer = require("../models/producer");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateTea } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const tea = require("../controllers/tea");

router
  .route("/newVendor")
  .get(catchAsync(tea.newVendor))
  .post(catchAsync(tea.postVendor));

router.get(
  "/collection",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const teas = await Tea.find({ author: req.user._id })
      .populate("vendor")
      .populate("producer");
    const pageTitle = "My collection";
    res.render("teas/collection", { teas, pageTitle });
  })
);

router.get(
  "/browse",
  catchAsync(async (req, res) => {
    let teas = {};
    const search = req.query.search;
    const option = req.query.option;
    if (option === "vendor") {
      const searchedVendor = await Vendor.findOne({ name: search });

      teas = await Tea.find({
        vendor: searchedVendor._id,
      })
        .populate("vendor")
        .populate("producer");
    } else if (option === "producer") {
      const searchedProducer = await Producer.findOne({
        name: search,
      });

      teas = await Tea.find({
        producer: searchedProducer._id,
      })
        .populate("vendor")
        .populate("producer");
    }
    const pageTitle = search + "'s teas";
    res.render("teas/browse", { teas, search, option, pageTitle });
  })
);

router
  .route("/")
  .get(catchAsync(tea.index))
  .post(isLoggedIn, upload.array("image"), validateTea, catchAsync(tea.new));

router.get("/new", isLoggedIn, catchAsync(tea.newForm));
router
  .route("/newVendor")
  .get(isLoggedIn, tea.newVendor)
  .post(upload.array("image"), catchAsync(tea.postVendor));

router
  .route("/newProducer")
  .get(isLoggedIn, tea.newProducer)
  .post(upload.array("image"), catchAsync(tea.postProducer));

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
