import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import PropertyMap from '../components/PropertyMap.jsx';
import ReviewComponent from '../components/ReviewComponent';
import { listings } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await listings.getOne(id);
        console.log('Property details loaded:', response);
        setProperty(response);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Property not found</h2>
          <p className="mt-2 text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/listings')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const allImages = [property.image, ...property.additionalImages];
  console.log('All image paths:', allImages);
  console.log('Constructed image URLs:', allImages.map(img => getImageUrl(img)));

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        {/* Image Gallery */}
        <div className="mb-6 sm:mb-8">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden mb-3 sm:mb-4">
            <img
              src={getImageUrl(allImages[selectedImage])}
              alt={`${property.title} - Image ${selectedImage + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-property.jpg';
              }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-16 sm:h-20 md:h-24 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${property.title} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-property.jpg';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {`${property.location.area}, ${property.location.city}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">₹{property.price.toLocaleString()}</p>
                  <p className="text-gray-500">per month</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium">{property.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Area</p>
                    <p className="font-medium">{property.area} sq.ft</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bedrooms</p>
                    <p className="font-medium">{property.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bathrooms</p>
                    <p className="font-medium">{property.bathrooms}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600">{property.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Address Details</h3>
                      <div className="space-y-2 text-gray-600">
                        <p>{property.location.address}</p>
                        <p>{property.location.area}</p>
                        <p>{property.location.city}, {property.location.state} {property.location.pinCode}</p>
                        {property.location.landmark && (
                          <p className="text-gray-500">Landmark: {property.location.landmark}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Nearby Places</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• City Center Mall - 0.2 km</li>
                        <li>• Railway Station - 2.5 km</li>
                        <li>• Airport - 8 km</li>
                        <li>• Hospital - 1 km</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden">
                    <PropertyMap address={`${property.location.address}, ${property.location.area}, ${property.location.city}`} />
                  </div>

                  <div className="flex items-center justify-end">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        `${property.location.address}, ${property.location.area}, ${property.location.city}, ${property.location.state} ${property.location.pinCode}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <ReviewComponent listingId={id} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Owner</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{property.owner.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{property.owner.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{property.owner.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Response Time</p>
                  <p className="font-medium">{property.owner.responseTime}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate(`/booking/${property.id}`)}
                  className="w-full py-3 px-4 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
                >
                  Book Now
                </button>
                <a
                  href={`tel:${property.owner.phone}`}
                  className="w-full py-3 px-4 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Owner
                </a>
                <a
                  href={`mailto:${property.owner.email}`}
                  className="w-full py-3 px-4 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Owner
                </a>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${property.available ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <span className="font-medium">{property.available ? 'Available' : 'Not Available'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}