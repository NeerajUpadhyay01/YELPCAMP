const express = require("express");
const router = express.Router({ mergeParams: true }); //if we use params in prefix, than we must define  "mergeParams: true"  in our routes file where we Access it.
const catchAsync = require("../Utilities/catchAsync");
const reviews = require("../controllers/reviews.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
