# 🏠 RentalScout

A full-stack property rental platform built with the MERN stack (MongoDB, Express.js, React, Node.js). RentalScout allows users to browse, list, and book rental properties with features like reviews, Google Maps integration
---
** LIVE DEMO ** https://rentalscout-1.onrender.com
## ✨ Features

### For Tenants

- 🔍 Browse and search rental properties
- 🗺️ Interactive Google Maps integration
- 🏷️ Filter by category, price, location, and amenities
- ⭐ View and submit property reviews
- 📱 Responsive design for mobile and desktop
- 👤 User profile management

### For Property Owners

- ➕ List new properties with multiple images
- ✏️ Edit and delete listings
- 📊 Manage property details and availability
- 📸 Upload property images
- 📋 View booking requests

## 🛠️ Tech Stack

### Frontend

- **React 19.1.1** - UI framework
- **React Router 7.9.4** - Navigation
- **Tailwind CSS 3.4.18** - Styling
- **Vite 4.4.5** - Build tool
- **Axios** - API requests
- **React Hot Toast** - Notifications
- **Google Maps API** - Location mapping
- **Heroicons** - Icons

### Backend

- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web framework
- **MongoDB** - Database
- **Mongoose 8.19.1** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v20.18.3 or higher)
- **npm** or **yarn**
- **MongoDB** account (MongoDB Atlas recommended)
- **Google Maps API Key** (optional, for maps feature)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mahesh304/RentalScout.git
cd RentalScout
```

### 2. Setup Backend (Server)

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

### 3. Setup Frontend (Client)

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🎯 Running the Application

### Development Mode

**Start Backend Server:**

```bash
cd server
npm run dev
```

Server runs on `http://localhost:5000`

**Start Frontend:**

```bash
cd client
npm run dev
```

Client runs on `http://localhost:5173`

### Production Build

**Build Frontend:**

```bash
cd client
npm run build
```

**Start Backend:**

```bash
cd server
npm start
```

## 📁 Project Structure

```
RentalScout/
├── client/                # Frontend React application
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── context/      # Context API (Auth)
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service functions
│   │   ├── styles/       # CSS and style files
│   │   └── utils/        # Utility functions
│   ├── .env              # Environment variables
│   └── package.json
│
├── server/               # Backend Node.js application
│   ├── src/
│   │   ├── controllers/  # Request handlers (currently empty)
│   │   ├── middleware/   # Custom middleware (auth, upload)
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── scripts/      # Utility scripts
│   │   └── index.js      # Server entry point
│   ├── uploads/          # Uploaded images storage
│   ├── .env              # Environment variables
│   └── package.json
│
└── README.md
```

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Listings

- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (owner/admin)
- `PUT /api/listings/:id` - Update listing (owner/admin)
- `DELETE /api/listings/:id` - Delete listing (owner/admin)
- `GET /api/listings/my-listings` - Get user's listings

### Reviews

- `GET /api/reviews/listing/:listingId` - Get reviews for a listing
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

### Bookings

- `GET /api/bookings/my-bookings` - Get user's bookings
- `POST /api/bookings` - Create booking
- `DELETE /api/bookings/:id` - Cancel booking

## 👥 User Roles

### Tenant

- Browse and search properties
- Submit reviews and ratings
- Book properties
- Manage profile

### Owner

- All tenant features
- List new properties
- Edit/delete own listings
- View booking requests
