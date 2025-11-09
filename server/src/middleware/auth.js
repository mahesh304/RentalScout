const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Listing = require('../models/Listing');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};

// Middleware to check if user is admin or the owner of the resource
const isAdminOrOwner = (req, res, next) => {
  if (req.user.isAdmin || req.user.userId.toString() === req.params.userId) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin or owner rights required.' });
  }
};

// Middleware to check if user can edit a listing
const canEditListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (req.user.isAdmin || listing.owner.toString() === req.user.userId.toString()) {
      req.listing = listing;
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Not authorized to edit this listing.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking listing permissions' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role) && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
};

module.exports = {
  auth,
  isAdmin,
  isAdminOrOwner,
  canEditListing,
  checkRole
};