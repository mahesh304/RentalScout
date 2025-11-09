const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  alternativePhone: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['tenant', 'owner', 'admin'],
    default: 'tenant'
  },
  profilePicture: {
    type: String
  },
  responseTime: {
    type: String,
    default: '24 hours'
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say'],
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    postalCode: {
      type: String,
      trim: true
    }
  },
  occupation: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  identification: {
    type: {
      type: String,
      enum: ['passport', 'drivers_license', 'national_id', 'other']
    },
    number: {
      type: String,
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  preferences: {
    preferredLanguage: {
      type: String,
      default: 'English'
    },
    communicationPreferences: {
      email: {
        type: Boolean,
        default: true
      },
      phone: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    notificationSettings: {
      bookingUpdates: {
        type: Boolean,
        default: true
      },
      propertyAlerts: {
        type: Boolean,
        default: true
      },
      promotionalEmails: {
        type: Boolean,
        default: false
      }
    }
  },
  socialMedia: {
    facebook: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    }
  },
  verificationStatus: {
    email: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: false
    },
    identity: {
      type: Boolean,
      default: false
    }
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  },
  profileCompleteness: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  listings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  savedListings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  // Ensure role and isAdmin are in sync
  if (this.role === 'admin') {
    this.isAdmin = true;
  }
  if (this.isAdmin && this.role !== 'admin') {
    this.role = 'admin';
  }
  
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);