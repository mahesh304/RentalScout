const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { auth, isAdmin, checkRole } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const fs = require('fs').promises;
const path = require('path');

// Get all listings with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, rentType, minPrice, maxPrice, furnished } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (rentType) filters.rentType = rentType;
    if (furnished !== undefined) filters.furnished = furnished === 'true';
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filters).populate('owner', 'username email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
});

// Get owner's listings
router.get('/my-listings', auth, checkRole(['owner', 'admin']), async (req, res) => {
  try {
    // Use userId from auth middleware
    const listings = await Listing.find({ owner: req.user.userId })
      .sort({ createdAt: -1 }) // Most recent first
      .populate('owner', 'username email');
    res.json(listings);
  } catch (error) {
    console.error('Error in my-listings:', error);
    res.status(500).json({ message: 'Error fetching your listings', error: error.message });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'username email');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listing', error: error.message });
  }
});

// Create listing (owner only)
router.post('/', auth, checkRole(['owner', 'admin']), upload.array('images', 10), handleMulterError, async (req, res) => {
  try {
    console.log('Received files:', req.files?.length || 0);
    console.log('Received body:', req.body);
    console.log('Files details:', req.files?.map(f => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      size: f.size,
      mimetype: f.mimetype
    })));

    const files = req.files;
    if (!files || files.length === 0) {
      console.log('No files received in request');
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    console.log('Processing files:', files.map(f => ({ name: f.originalname, size: f.size })));

    // Get the paths for the uploaded images
    const mainImage = `/uploads/${files[0].filename}`;
    const additionalImages = files.slice(1).map(file => `/uploads/${file.filename}`);

    // Parse the location object if it's a string
    const location = typeof req.body.location === 'string' 
      ? JSON.parse(req.body.location)
      : req.body.location;

    // Create the listing
    const listing = new Listing({
      ...req.body,
      location,
      image: mainImage,
      additionalImages,
      owner: req.user.userId,
      amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [req.body.amenities],
      features: Array.isArray(req.body.features) ? req.body.features : [req.body.features]
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    // Delete uploaded files if there was an error
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(console.error);
      }
    }
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
});

// Update listing (owner or admin only)
router.put('/:id', auth, upload.array('images', 10), handleMulterError, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is owner or admin
    if (listing.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateData = { ...req.body };

    // Handle image updates if new files were uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images
      const oldImages = [listing.image, ...listing.additionalImages];
      for (const imagePath of oldImages) {
        await fs.unlink(path.join(__dirname, '../..', imagePath)).catch(console.error);
      }

      // Update with new images
      updateData.image = `/uploads/${req.files[0].filename}`;
      updateData.additionalImages = req.files.slice(1).map(file => `/uploads/${file.filename}`);
    }

    // Handle location update if it's provided as a string
    if (typeof req.body.location === 'string') {
      updateData.location = JSON.parse(req.body.location);
    }

    // Handle arrays
    if (req.body.amenities) {
      updateData.amenities = Array.isArray(req.body.amenities) ? req.body.amenities : [req.body.amenities];
    }
    if (req.body.features) {
      updateData.features = Array.isArray(req.body.features) ? req.body.features : [req.body.features];
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedListing);
  } catch (error) {
    // Delete uploaded files if there was an error
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(console.error);
      }
    }
    res.status(500).json({ message: 'Error updating listing', error: error.message });
  }
});

// Delete listing (owner or admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is owner or admin
    if (listing.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete associated images
    const imagePaths = [listing.image, ...listing.additionalImages];
    for (const imagePath of imagePaths) {
      await fs.unlink(path.join(__dirname, '../..', imagePath)).catch(console.error);
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
});

module.exports = router;