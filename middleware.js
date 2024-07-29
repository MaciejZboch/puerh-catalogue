const ExpressError = require("./utilities/ExpressError");
const { teaSchema, reviewSchema, vendorSchema } = require("./schemas.js");

const Tea = require("./models/tea");
const Review = require("./models/review");

//tea middleware
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "sign in first!");
    return res.redirect("/login");
  }
  next();
};
module.exports.isAuthor = async (req, res, next) => {
  const tea = await Tea.findById(req.params.id);
  if (!tea.author.equals(req.user._id)) {
    req.flash("error", "No permission to do that!");
    return res.redirect("/tea/" + tea.id);
  }
  next();
};
module.exports.validateTea = (req, res, next) => {
  const { error } = teaSchema.validate(req.body.tea);
  const { error2 } = vendorSchema.validate(req.body.vendor);
  if (error || error2) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//review middleware
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "No permission to do that!");
    return res.redirect("/campgrounds/" + req.params.id);
  }
  next();
};
