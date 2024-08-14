const Tea = require("../models/tea");
const Vendor = require("../models/vendor");
const Producer = require("../models/producer");
const currentYear = new Date().getFullYear();
const { cloudinary } = require("../cloudinary");

//index
module.exports.index = async (req, res) => {
  const vendors = await Vendor.find();
  const producers = await Producer.find();
  res.render("teas/index", { vendors, producers });
};

//new
module.exports.newForm = async (req, res) => {
  const vendors = await Vendor.find();
  const producers = await Producer.find();
  res.render("teas/new", { currentYear, vendors, producers });
};

module.exports.new = async (req, res) => {
  const newTea = new Tea(req.body.tea);
  newTea.author = req.user._id;
  newTea.vendor = await Vendor.findOne({ name: req.body.vendor.name });
  newTea.producer = await Producer.findOne({ name: req.body.producer.name });
  newTea.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
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
  res.render("teas/show", { tea });
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
  res.render("teas/edit", { t, currentYear, vendors, producers });
};

module.exports.update = async (req, res) => {
  const foundTea = await Tea.findByIdAndUpdate(req.params.id, {
    ...req.body.tea,
  });
  foundTea.vendor = await Vendor.findOne({ name: req.body.vendor.name });
  foundTea.producer = await Producer.findOne({ name: req.body.producer.name });
  if (req.files) {
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    await foundTea.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      foundTea.images.push(...imgs);
    }
    await foundTea.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Succesfully updated!");
  res.redirect(`/tea/${foundTea._id}`);
};

module.exports.delete = async (req, res) => {
  await Tea.findByIdAndDelete(req.params.id);
  req.flash("success", "Succesfully deleted!");
  res.redirect("/tea");
};
