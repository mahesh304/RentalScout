const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Listing = require('../models/Listing');
const { auth } = require('../middleware/auth');

// Get all reviews for a listing
router.get('/listing/:listingId', async (req, res) => {
  try {
    console.log('Fetching reviews for listing:', req.params.listingId);
    
    // Validate listingId
    if (!req.params.listingId) {
      return res.status(400).json({ message: 'Listing ID is required' });
    }

    // Check if listing exists first
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      console.log('Listing not found:', req.params.listingId);
      return res.status(404).json({ message: 'Listing not found' });
    }

    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('user', 'username firstName lastName')
      .sort({ createdAt: -1 });

    console.log(`Found ${reviews.length} reviews for listing ${req.params.listingId}`);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      message: 'Error fetching reviews', 
      error: error.message,
      details: error.toString()
    });
  }
});

// Create a new review
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    // Check if the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user has already reviewed this listing
    const existingReview = await Review.findOne({
      listing: listingId,
      user: req.user.userId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this listing' });
    }

    const review = new Review({
      listing: listingId,
      user: req.user.userId,
      rating,
      comment
    });

    await review.save();

    // Populate user information before sending response
    await review.populate('user', 'username firstName lastName');
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
});

// Update a review
router.put('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user.userId
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    const { rating, comment } = req.body;
    review.rating = rating;
    review.comment = comment;

    await review.save();
    await review.populate('user', 'username firstName lastName');

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
});

// Delete a review
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      user: req.user.userId
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

module.exports = router;