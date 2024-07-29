const express = require("express");
const { isReviewAuthor, isLoggedIn, validateReview } = require("../middleware");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
review = require("../controllers/review");

router.post("/:id/review", isLoggedIn, validateReview, catchAsync(review.new));

router.delete(
  "/:id/review/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(review.delete)
);
module.exports = router;
