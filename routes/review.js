const express = require('express');
const { isReviewAuthor, isLoggedIn, validateReview } = require('../middleware');
const router = express.Router();
const Review = require('../models/review')
const Tea = require('../models/tea')
const catchAsync = require('../utilities/catchAsync')

router.post('/:id/review', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const tea = await Tea.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    tea.reviews.push(review)
    await review.save()
    await tea.save()
    req.flash('success', 'Succesfully made a new review!')
    res.redirect(`/tea/${tea._id}`)
}))

router.delete('/:id/review/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const tea = await Tea.findByIdAndUpdate(req.params.id, {$pull: { reviews: req.params.reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Succesfully deleted a review!');
    res.redirect(`/tea/${tea._id}`);
}))
module.exports = router;