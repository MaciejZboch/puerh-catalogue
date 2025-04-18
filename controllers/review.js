const Review = require("../models/review");
const Tea = require("../models/tea");
const Activity = require("../models/activity");

module.exports.new = async (req, res) => {
  const tea = await Tea.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  tea.reviews.push(review);
  await review.save();
  await tea.save();

  //logging activity with timestamp
  const activity = new Activity({
    user: req.user._id,
    type: "review",
    refId: review._id,
  });
  await activity.save();
  req.flash("success", "Succesfully made a new review!");
  res.redirect(`/tea/${tea._id}`);
};

module.exports.delete = async (req, res) => {
  const tea = await Tea.findByIdAndUpdate(req.params.id, {
    $pull: { reviews: req.params.reviewId },
  });
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "Succesfully deleted a review!");
  res.redirect(`/tea/${tea._id}`);
};
