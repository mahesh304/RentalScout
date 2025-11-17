import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { listings } from '../services/api';

export default function AddListingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showBackButton, setShowBackButton] = useState(true);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    rentType: 'Monthly',
    bedrooms: '',
    bathrooms: '',
    furnished: false,
    area: '',
    location: {
      address: '',
      area: '',
      city: '',
      state: '',
      pinCode: '',
      landmark: '',
    },
    amenities: [],
    features: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    
    if (files.length > 0) {
      setImages(files);
      console.log('Setting images:', files);

      // Create preview URLs for the images
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      console.log('Created preview URLs:', newPreviewUrls);
      
      setImagePreviewUrls(prevUrls => {
        // Clean up old preview URLs to avoid memory leaks
        prevUrls.forEach(url => URL.revokeObjectURL(url));
        return newPreviewUrls;
      });
    } else {
      console.log('No files selected');
    }
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter(a => a !== value)
    }));
  };

  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      features: checked
        ? [...prev.features, value]
        : prev.features.filter(f => f !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Current images state:', images);
    console.log('Current image preview URLs:', imagePreviewUrls);
    
    if (!images || images.length === 0) {
      console.log('No images found in state');
      toast.error('Please upload at least one image');
      return;
    }

    // Validate that images are actually File objects
    const validImages = images.every(img => img instanceof File);
    if (!validImages) {
      console.log('Invalid image objects found:', images);
      toast.error('There was a problem with the uploaded images. Please try uploading them again.');
      return;
    }

    setLoading(true);

    try {
      const listingData = new FormData();
      
      // Convert arrays to comma-separated strings
      const formDataToSend = {
        ...formData,
        amenities: formData.amenities.join(','),
        features: formData.features.join(',')
      };
      
      // Append all form data
      Object.keys(formDataToSend).forEach(key => {
        if (key === 'location') {
          listingData.append(key, JSON.stringify(formDataToSend[key]));
        } else {
          listingData.append(key, formDataToSend[key]);
        }
      });

      // Append each image individually with the same field name
      images.forEach(image => {
        listingData.append('images', image);
      });
      
      console.log('FormData entries before sending:');
      for (let [key, value] of listingData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      await listings.create(listingData);
      toast.success('Property listed successfully!');
      navigate('/listings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const amenityOptions = [
    'Swimming Pool',
    'Garden',
    'Parking',
    'Security',
    'Gym',
    'Power Backup',
    'Lift',
    'Club House',
    'Children\'s Play Area',
    'Sports Facility'
  ];

  const featureOptions = [
    'Air Conditioning',
    'High-Speed Internet',
    'Modular Kitchen',
    'Smart Home Features',
    'Water Purifier',
    'Gas Pipeline',
    'CCTV',
    'Fire Safety',
    'Waste Disposal',
    'Rain Water Harvesting'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">List Your Property</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Property Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (per month)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Property Type</label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Farm House">Farm House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="PG/Hostel">PG/Hostel</option>
                    <option value="Shop/Office">Shop/Office</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="rentType" className="block text-sm font-medium text-gray-700">Rent Type</label>
                  <select
                    id="rentType"
                    name="rentType"
                    required
                    value={formData.rentType}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Daily">Daily</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Property Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    required
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    required
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area (sq.ft)</label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="furnished"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="furnished" className="ml-2 block text-sm text-gray-900">Furnished</label>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Location</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    id="location.address"
                    name="location.address"
                    required
                    value={formData.location.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location.area" className="block text-sm font-medium text-gray-700">Area/Locality</label>
                  <input
                    type="text"
                    id="location.area"
                    name="location.area"
                    required
                    value={formData.location.area}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    required
                    value={formData.location.city}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location.state" className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    id="location.state"
                    name="location.state"
                    required
                    value={formData.location.state}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location.pinCode" className="block text-sm font-medium text-gray-700">PIN Code</label>
                  <input
                    type="text"
                    id="location.pinCode"
                    name="location.pinCode"
                    required
                    value={formData.location.pinCode}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location.landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
                  <input
                    type="text"
                    id="location.landmark"
                    name="location.landmark"
                    value={formData.location.landmark}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Images</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Property Images</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          multiple
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </div>
                {images.length > 0 && (
                  <>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImages(images.filter((_, i) => i !== index));
                              setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {images.length} {images.length === 1 ? 'image' : 'images'} selected
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Amenities</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenityOptions.map(amenity => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      name="amenities"
                      value={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-900">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Features</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featureOptions.map(feature => (
                  <div key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`feature-${feature}`}
                      name="features"
                      value={feature}
                      checked={formData.features.includes(feature)}
                      onChange={handleFeatureChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`feature-${feature}`} className="ml-2 block text-sm text-gray-900">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Creating Listing...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}