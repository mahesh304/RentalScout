const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Get all listings (including pending and inactive)
router.get('/listings', auth, isAdmin, async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('owner', 'username email firstName lastName')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
});

// Update any listing
router.put('/listings/:listingId', auth, isAdmin, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Allow admin to update any field
    Object.keys(req.body).forEach(key => {
      listing[key] = req.body[key];
    });

    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing', error: error.message });
  }
});

// Delete any listing
router.delete('/listings/:listingId', auth, isAdmin, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
});

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Update user status (activate/deactivate)
router.patch('/users/:userId/status', auth, isAdmin, async (req, res) => {
  try {
    const { active } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { active },
      { new: true, select: '-password' }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
});

// Get admin dashboard statistics
router.get('/dashboard', auth, isAdmin, async (req, res) => {
  try {
    const stats = {
      totalListings: await Listing.countDocuments(),
      totalUsers: await User.countDocuments(),
      recentListings: await Listing.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('owner', 'username email'),
      recentUsers: await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('-password')
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

// Approve or reject a listing
router.patch('/listings/:listingId/approval', auth, isAdmin, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const listing = await Listing.findByIdAndUpdate(
      req.params.listingId,
      { 
        status,
        rejectionReason,
        reviewedBy: req.user.userId,
        reviewedAt: Date.now()
      },
      { new: true }
    );
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing status', error: error.message });
  }
});

module.exports = router;