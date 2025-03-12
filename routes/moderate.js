const express = require("express");
const mongoose = require("mongoose");
const Vendor = require("../models/vendor");
const Producer = require("../models/producer");
const catchAsync = require("../utilities/catchAsync");
const router = express.Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const vendors = await Vendor.find({ status: "pending" });
    const producers = await Producer.find({ status: "pending" });
    res.render("moderate/dashboard", { vendors, producers });
  })
);

router.put(
  "/vendor/:id",
  catchAsync(async (req, res) => {
    if (req.query.status == "approved") {
      await Vendor.findByIdAndUpdate(req.params.id, {
        status: "approved",
      });
    } else if (req.query.status == "rejected") {
      await Vendor.findByIdAndUpdate(req.params.id, {
        status: "rejected",
      });
    }
    req.flash("Success", "Successfully changed status!");
    res.redirect("/moderate");
  })
);

router.put(
  "/producer/:id",
  catchAsync(async (req, res) => {
    if (req.query.status == "approved") {
      await Producer.findByIdAndUpdate(req.params.id, {
        status: "approved",
      });
    } else if (req.query.status == "rejected") {
      await Producer.findByIdAndUpdate(req.params.id, {
        status: "rejected",
      });
    }
    req.flash("Success", "Successfully changed status!");
    res.redirect("/moderate");
  })
);

module.exports = router;
