const Tea = require("../models/tea");
const Vendor = require("../models/vendor");
const Producer = require("../models/producer");
const currentYear = new Date().getFullYear();
const { cloudinary } = require("../cloudinary");
function isProperLength(t, x) {
  return (t.length > 3 && t.length < x) || !t;
}
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

module.exports.newVendor = (req, res) => {
  res.render("teas/newVendor");
};
module.exports.postVendor = async (req, res) => {
  const typedVendor = Vendor.findOne({ name: req.body.vendor });
  if (!typedVendor) {
    new Vendor(req.body.vendor);
    req.flash("success", "Vendor succesfully added!");
  } else {
    req.flash("failure", "There is already a vendor with that name!");
  }
  res.redirect("/tea");
};
module.exports.newVendor = async (req, res) => {
  const vendors = await Vendor.find();
  const producers = await Producer.find();
  res.render("teas/newVendor", { vendors, producers });
};

module.exports.postVendor = async (req, res) => {
  new Vendor({ name: Vendor.new });
};

module.exports.add = async (req, res) => {
  const t = await Tea.findById(req.params.id);
  console.log(t);
  if (!t.owners.includes(req.user._id)) {
    t.owners.push(req.user._id);
    await t.save();
    req.flash("success", "Tea added to collection!");
    res.redirect(`/tea/${t._id}`);
  } else {
    req.flash("failure", "This tea is already in your collection!");
    res.redirect(`/tea/${t._id}`);
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
    res.redirect(`/tea/${t._id}`);
  } else {
    req.flash("failure", "This tea is not in your collection!");
    res.redirect(`/tea/${t._id}`);
  }
};
