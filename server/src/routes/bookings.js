const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { auth, checkRole } = require('../middleware/auth');

// Get all bookings (admin only)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'username email')
      .populate('listing', 'title price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('listing', 'title price images location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get listing's bookings (owner or admin only)
router.get('/listing/:listingId', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is owner or admin
    if (listing.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ listing: req.params.listingId })
      .populate('user', 'username email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut } = req.body;

    // Check if listing exists and is available
    const listing = await Listing.findById(listingId);
    if (!listing || listing.status !== 'available') {
      return res.status(400).json({ message: 'Listing is not available' });
    }

    // Calculate total price (simplified)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = listing.price * days;

    const booking = new Booking({
      listing: listingId,
      user: req.user.userId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice
    });

    await booking.save();

    // Update listing status
    listing.status = 'booked';
    await listing.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Update booking status (admin only)
router.put('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the booking owner or admin
    if (booking.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update listing status
    const listing = await Listing.findById(booking.listing);
    if (listing) {
      listing.status = 'available';
      await listing.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});

module.exports = router;