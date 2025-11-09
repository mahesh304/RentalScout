const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    address: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pinCode: {
      type: String,
      required: true
    },
    landmark: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['Villa', 'Studio', 'Farm House', 'Apartment', 'PG/Hostel', 'Shop/Office']
  },
  rentType: {
    type: String,
    required: true,
    enum: ['Daily', 'Monthly', 'Yearly'],
    default: 'Monthly'
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  furnished: {
    type: Boolean,
    required: true,
    default: false
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  additionalImages: [{
    type: String
  }],
  amenities: [{
    type: String,
    required: true
  }],
  features: [{
    type: String,
    required: true
  }],
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nearbyPlaces: [{
    name: String,
    distance: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', listingSchema);