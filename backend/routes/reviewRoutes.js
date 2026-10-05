const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createProductReview,
  getProductReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createProductReview)
  .get(getProductReviews);

module.exports = router;
