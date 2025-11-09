import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listings } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    alternativePhone: user?.alternativePhone || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user?.gender || '',
    
    // Address Information
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      country: user?.address?.country || '',
      postalCode: user?.address?.postalCode || ''
    },
    
    // Professional Information
    occupation: user?.occupation || '',
    company: user?.company || '',
    
    // Emergency Contact
    emergencyContact: {
      name: user?.emergencyContact?.name || '',
      relationship: user?.emergencyContact?.relationship || '',
      phone: user?.emergencyContact?.phone || '',
      email: user?.emergencyContact?.email || ''
    },
    
    // Social Media
    socialMedia: {
      facebook: user?.socialMedia?.facebook || '',
      twitter: user?.socialMedia?.twitter || '',
      linkedin: user?.socialMedia?.linkedin || '',
      instagram: user?.socialMedia?.instagram || ''
    },
    
    // Preferences
    preferences: {
      preferredLanguage: user?.preferences?.preferredLanguage || 'English',
      communicationPreferences: {
        email: user?.preferences?.communicationPreferences?.email ?? true,
        phone: user?.preferences?.communicationPreferences?.phone ?? true,
        sms: user?.preferences?.communicationPreferences?.sms ?? false
      },
      notificationSettings: {
        bookingUpdates: user?.preferences?.notificationSettings?.bookingUpdates ?? true,
        propertyAlerts: user?.preferences?.notificationSettings?.propertyAlerts ?? true,
        promotionalEmails: user?.preferences?.notificationSettings?.promotionalEmails ?? false
      }
    }
  });

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchMyListings();
    }
  }, [user]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const response = await listings.getMyListings();
      setMyListings(response);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load your properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await listings.delete(listingId);
        toast.success('Property deleted successfully');
        fetchMyListings();
      } catch (error) {
        console.error('Error deleting listing:', error);
        toast.error('Failed to delete property');
      }
    }
  };

  const handleInputChange = (e, section = null, subsection = null) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      if (section) {
        if (subsection) {
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [subsection]: {
                ...prev[section][subsection],
                [name]: type === 'checkbox' ? checked : value
              }
            }
          };
        }
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value
          }
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-primary-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
                <p className="text-primary-100">{user?.email}</p>
                <p className="text-primary-200 mt-1">
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }`}
              >
                Bookings
              </button>
              {user?.role === 'owner' && (
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                    activeTab === 'properties'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300'
                  }`}
                >
                  My Properties
                </button>
              )}
            </nav>
          </div>

          {/* Tab Panels */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Alternative Phone</label>
                      <input
                        type="tel"
                        name="alternativePhone"
                        value={formData.alternativePhone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.address.street}
                        onChange={(e) => handleInputChange(e, 'address')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange(e, 'address')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange(e, 'address')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.address.country}
                        onChange={(e) => handleInputChange(e, 'address')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.address.postalCode}
                        onChange={(e) => handleInputChange(e, 'address')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.emergencyContact.name}
                        onChange={(e) => handleInputChange(e, 'emergencyContact')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Relationship</label>
                      <input
                        type="text"
                        name="relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => handleInputChange(e, 'emergencyContact')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => handleInputChange(e, 'emergencyContact')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.emergencyContact.email}
                        onChange={(e) => handleInputChange(e, 'emergencyContact')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Facebook</label>
                      <input
                        type="url"
                        name="facebook"
                        value={formData.socialMedia.facebook}
                        onChange={(e) => handleInputChange(e, 'socialMedia')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Twitter</label>
                      <input
                        type="url"
                        name="twitter"
                        value={formData.socialMedia.twitter}
                        onChange={(e) => handleInputChange(e, 'socialMedia')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.socialMedia.linkedin}
                        onChange={(e) => handleInputChange(e, 'socialMedia')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Instagram</label>
                      <input
                        type="url"
                        name="instagram"
                        value={formData.socialMedia.instagram}
                        onChange={(e) => handleInputChange(e, 'socialMedia')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 mt-6">
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                        >
                          Save Changes
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* Properties Tab (for owners) */}
            {activeTab === 'properties' && user?.role === 'owner' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Properties</h2>
                  <button
                    onClick={() => navigate('/listings/add')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Add New Property
                  </button>
                </div>

                {loading ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                        <div className="bg-gray-200 h-48 w-full" />
                        <div className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                          <div className="flex items-center justify-between mb-3">
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-8 bg-gray-200 rounded" />
                            <div className="h-8 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myListings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No properties listed yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first property</p>
                    <button
                      onClick={() => navigate('/listings/add')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Add New Property
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {myListings.map((property) => (
                      <div key={property._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={getImageUrl(property.image)}
                            alt={property.title}
                            className="object-cover w-full h-48"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span>{property.location.area}, {property.location.city}</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-primary-600 font-semibold">₹{property.price.toLocaleString()}/mo</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {property.category}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => navigate(`/listings/edit/${property._id}`)}
                              className="flex justify-center items-center px-4 py-2 border border-primary-600 rounded-md text-primary-600 hover:bg-primary-50 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteListing(property._id)}
                              className="flex justify-center items-center px-4 py-2 border border-red-600 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                  <p className="text-gray-500">Your booking history will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
