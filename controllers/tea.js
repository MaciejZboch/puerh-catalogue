const Tea = require("../models/tea");
const Vendor = require("../models/vendor");
const Review = require("../models/review");
const Producer = require("../models/producer");
const User = require("../models/user");
const currentYear = new Date().getFullYear();
const { cloudinary } = require("../cloudinary");
const review = require("../models/review");
const mongoose = require("mongoose");

//index
module.exports.index = async (req, res) => {
  const pageTitle = "Pu-erh catalogue";
  const vendors = await Vendor.find();
  const producers = await Producer.find();
  res.render("teas/index", { vendors, producers, pageTitle });
};

//new
module.exports.newForm = async (req, res) => {
  const pageTitle = "New tea";
  const vendors = await Vendor.find();
  const producers = await Producer.find();
  res.render("teas/new", { currentYear, vendors, producers, pageTitle });
};

module.exports.new = async (req, res) => {
  function isProperLength(t, x) {
    return (t.length > 3 && t.length < x) || !t;
  }
  const tea = req.body.tea;

  if (!isProperLength(tea.name, 20)) {
    req.flash("error", "Name must be 3 to 20 characters long!");
    return res.redirect("/tea/new");
  }
  if (!isProperLength(tea.region, 20)) {
    req.flash("error", "Region must be 3 to 20 characters long!");
    return res.redirect("/tea/new");
  }
  if (!isProperLength(tea.village, 20)) {
    req.flash("error", "Village must be 3 to 20 characters long!");
    return res.redirect("/tea/new");
  }
  if (!isProperLength(tea.ageing_location, 20)) {
    req.flash("error", "Ageing location must be 3 to 20 characters long!");
    return res.redirect("/tea/new");
  }
  if (!isProperLength(tea.description, 200)) {
    req.flash("error", "Description must be 3 to 200 characters long!");
    return res.redirect("/tea/new");
  }

  const newTea = new Tea(tea);
  newTea.author = req.user._id;
  newTea.vendor = await Vendor.findOne({ name: req.body.vendor.name });
  newTea.producer = await Producer.findOne({ name: req.body.producer.name });

  //search db to check if there is something with the same exact name, vendor and year in the DB
  const sameTea = await Tea.find({
    name: newTea.name,
    vendor: newTea.vendor,
    year: newTea.year,
  });
  if (sameTea.length > 0) {
    req.flash("error", "This tea has already been added!");
    return res.redirect("/tea/new");
  }

  newTea.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await newTea.save();
  res.redirect("/tea/" + newTea._id);
};

//:id
module.exports.show = async (req, res) => {
  const tea = await Tea.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("producer")
    .populate("vendor");
  if (!tea) {
    req.flash("error", "Cannot find that tea!");
    return res.redirect("/tea");
  }

  //caluculating user's average rating for a tea
  function getAverage(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    return sum / array.length;
  }

  let myRatings = tea.reviews;

  if (req.user) {
    myRatings = Object.values(myRatings)
      .filter((review) => {
        return review.author._id.toString() === req.user._id.toString();
      })
      .map((review) => review.rating);
  } else {
    myRatings = false;
  }
  const pageTitle = tea.name;
  res.render("teas/show2", { tea, pageTitle, myRatings });
};

module.exports.editForm = async (req, res) => {
  const t = await Tea.findById(req.params.id)
    .populate("vendor")
    .populate("producer");
  if (!t) {
    req.flash("error", "Cannot find that tea!");
    return res.redirect("/tea");
  }
  const vendors = await Vendor.find();
  const producers = await Producer.find();
  const pageTitle = "Edit " + t.name;
  res.render("teas/edit", { t, currentYear, vendors, producers, pageTitle });
};

module.exports.update = async (req, res) => {
  const tea = req.body.tea;
  if (!isProperLength(tea.name, 20)) {
    req.flash("error", "Name must be 3 to 20 characters long!");
    return res.redirect("/tea/new");
  }
  if (!isProperLength(tea.region, 20)) {
    req.flash("error", "Region must be 3 to 20 characters long!");
    return res.redirect("/tea/new");
  }
  if (!isProperLength(tea.village, 20)) {
    req.flash("error", "Village must be 3 to 20 characters long!");
    return res.redirect("/tea/new");
  }
  if (!isProperLength(tea.ageing_location, 20)) {
    req.flash("error", "Ageing location must be 3 to 20 characters long!");
    return res.redirect("/tea/new");
  }
  if (!isProperLength(tea.description, 200)) {
    req.flash("error", "Description must be 3 to 200 characters long!");
    return res.redirect("/tea/new");
  }
  const foundTea = await Tea.findByIdAndUpdate(req.params.id, {
    ...req.body.tea,
  });
  foundTea.vendor = await Vendor.findOne({ name: req.body.vendor.name });
  foundTea.producer = await Producer.findOne({ name: req.body.producer.name });

  if (req.files) {
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));

    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
    }
    foundTea.images.push(...imgs);
    await foundTea.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    await foundTea.save();
  }
  req.flash("success", "Succesfully updated!");
  res.redirect(`/tea/${foundTea._id}`);
};

module.exports.delete = async (req, res) => {
  await Tea.findByIdAndDelete(req.params.id);
  req.flash("success", "Succesfully deleted!");
  res.redirect("/tea");
};

// vendor/producer controllers
module.exports.newVendor = async (req, res) => {
  const pageTitle = "New Vendor";
  const vendors = await Vendor.find();
  res.render("teas/newVendor", { vendors, pageTitle });
};

module.exports.postVendor = async (req, res) => {
  const v = new Vendor({ name: req.body.vendor });

  await v.save();
  req.flash("success", "Vendor submitted for approval!");
  res.redirect("/tea/newVendor");
};

module.exports.newProducer = async (req, res) => {
  const pageTitle = "New Producer";
  const producers = await Producer.find();
  res.render("teas/newProducer", { producers, pageTitle });
};

module.exports.postProducer = async (req, res) => {
  const p = await new Producer({ name: req.body.producer });
  p.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await p.save();
  req.flash("success", "Producer submitted for approval!");
  res.redirect("/tea/newProducer");
};

//add or remove from collection
module.exports.add = async (req, res) => {
  const t = await Tea.findById(req.params.id);
  if (!t.owners.includes(req.user._id)) {
    t.owners.push(req.user._id);
    await t.save();
    req.flash("success", "Tea added to collection!");
    res.redirect("back");
  } else {
    req.flash("failure", "This tea is already in your collection!");
    res.redirect("back");
  }
};

module.exports.remove = async (req, res) => {
  const t = await Tea.findById(req.params.id);
  if (t.owners.includes(req.user._id)) {
    await t.updateOne({
      $pull: { owners: req.user._id },
    });
    await t.save();
    req.flash("success", "Tea removed from collection!");
    //res.redirect(`/tea/${t._id}`);
    res.redirect("back");
  } else {
    req.flash("failure", "This tea is not in your collection!");
    //res.redirect(`/tea/${t._id}`);
    res.redirect("back");
  }
};

//get collection and browse tables
module.exports.collection = async (req, res) => {
  const teas = await Tea.find({ owners: req.params.id })
    .populate("vendor")
    .populate("producer");
  const collector = await User.findById(req.params.id);
  const pageTitle = "User's collection";
  res.render("teas/collection", { teas, pageTitle, collector });
};

module.exports.browse = async (req, res) => {
  /*let teas = {};
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
  }*/
  const search = req.query.search;
  async function searchTea(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim() === "") {
        console.error("Invalid search term");
        return [];
      }

      const regex = new RegExp(searchTerm, "i");

      const results = await Tea.aggregate([
        {
          $lookup: {
            from: "vendors", // Collection name for Vendor
            localField: "vendor",
            foreignField: "_id",
            as: "vendor",
            pipeline: [{ $match: { status: "approved" } }], // Only get approved vendors
          },
        },
        {
          $lookup: {
            from: "producers", // Collection name for Producer
            localField: "producer",
            foreignField: "_id",
            as: "producer",
            pipeline: [{ $match: { status: "approved" } }], // Only get approved producers
          },
        },
        { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } }, // Unwind vendor (keep null values)
        { $unwind: { path: "$producer", preserveNullAndEmptyArrays: true } }, // Unwind producer (keep null values)
        {
          $unwind: {
            path: "$images",
            preserveNullAndEmptyArrays: true, // Keeps empty arrays as `null` instead of removing them
          },
        },
        {
          $addFields: {
            images: { $ifNull: ["$images", []] }, // Ensures images is always an array
          },
        },
        {
          $match: {
            $or: [
              { name: regex },
              { type: regex },
              {
                $expr: {
                  $regexMatch: {
                    input: { $toString: "$year" },
                    regex: searchTerm,
                    options: "i",
                  },
                },
              }, // Convert year to string
              { region: regex },
              { ageing_location: regex },
              { ageing_conditions: regex },
              { "vendor.name": regex }, // Search inside the populated vendor field
              { "producer.name": regex }, // Search inside the populated producer field
            ],
          },
        },
      ]);

      return results;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  const teas = await searchTea(search);
  const pageTitle = search + "'s teas";

  //searching for vendors / producers to populate datalist
  const vendors = await Vendor.find();
  const producers = await Producer.find();

  res.render("teas/browse", { teas, search, pageTitle, vendors, producers });
};
