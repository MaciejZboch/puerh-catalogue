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
    console.log("Vendors fetched:", vendors);
    res.render("moderate/dashboard", { vendors, producers });
  })
);

router.put("/vendor/:id", async (req, res) => {
  try {
    const { status } = req.body; // Expecting "approved" or "rejected"
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.json({ message: `Vendor ${vendor.name} is now ${status}.`, vendor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/producer/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const producer = await Producer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!producer)
      return res.status(404).json({ message: "Producer not found" });

    res.json({
      message: `Producer ${producer.name} is now ${status}.`,
      producer,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
