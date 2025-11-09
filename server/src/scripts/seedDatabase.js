const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Listing = require('../models/Listing');

dotenv.config();

const sampleListings = [
  {
    title: 'Modern Villa with Pool',
    description: 'Luxurious modern villa featuring a private swimming pool, landscaped garden, and state-of-the-art security. Perfect for families looking for a premium living experience.',
    price: 45000,
    location: {
      address: '123 Manjalpur Main Road',
      area: 'Manjalpur',
      city: 'Vadodara',
      state: 'Gujarat',
      pinCode: '390011',
      landmark: 'Near City Center Mall',
      coordinates: {
        lat: 22.3072,
        lng: 73.1812
      }
    },
    category: 'Villa',
    rentType: 'Monthly',
    bedrooms: 3,
    bathrooms: 2,
    furnished: true,
    area: 2500,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60',
    additionalImages: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&auto=format&fit=crop&q=60'
    ],
    amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security'],
    features: [
      'Modern Kitchen',
      'Air Conditioning',
      'High-Speed Internet',
      'Smart Home Features',
      '24/7 Security',
      'Covered Parking',
      'Power Backup',
      'Modular Kitchen'
    ],
    available: true,
    rating: 4.8,
    nearbyPlaces: [
      { name: 'City Center Mall', distance: '0.2 km' },
      { name: 'Railway Station', distance: '2.5 km' },
      { name: 'Airport', distance: '8 km' },
      { name: 'Hospital', distance: '1 km' }
    ]
  },
  // Add more sample listings here
];

const sampleUsers = [
  {
    username: 'johndoe',
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+91 98765 43210',
    role: 'owner',
    responseTime: '2 hours',
    verified: true
  },
  // Add more sample users here
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create(sampleUsers);
    console.log('Created sample users');

    // Create listings with owner references
    const listingsWithOwners = sampleListings.map(listing => ({
      ...listing,
      owner: users[0]._id // Assign to first user (John Doe)
    }));

    await Listing.create(listingsWithOwners);
    console.log('Created sample listings');

    // Update user with listings
    const listings = await Listing.find();
    await User.findByIdAndUpdate(users[0]._id, {
      $push: { listings: { $each: listings.map(l => l._id) } }
    });

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();