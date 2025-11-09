import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';
import { useAuth } from '../context/AuthContext';
import { listings } from '../services/api';

export default function ListingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  // Skeleton loading component
  const PropertySkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
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
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    furnished: '',
    rentType: ''
  });

  // Fetch all listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await listings.getAll();
        setProperties(response);
        setFilteredProperties(response);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter properties when any filter changes
  useEffect(() => {
    if (!properties.length) return;
    
    let filtered = [...properties];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(property => 
        property.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.area.toLowerCase().includes(query) ||
        property.location.city.toLowerCase().includes(query)
      );
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= Number(filters.maxPrice));
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= Number(filters.bedrooms));
    }

    // Bathrooms filter
    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= Number(filters.bathrooms));
    }

    // Furnished filter
    if (filters.furnished !== '') {
      filtered = filtered.filter(property => property.furnished === (filters.furnished === 'true'));
    }

    // Rent type filter
    if (filters.rentType) {
      filtered = filtered.filter(property => property.rentType === filters.rentType);
    }

    setFilteredProperties(filtered);
  }, [selectedCategory, properties, searchQuery, filters]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">All Properties</h1>
          <div className="flex gap-4">
            {/* View Toggle */}
            <div className="flex rounded-lg shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:text-gray-900'
                } rounded-l-lg border`}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'map'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:text-gray-900'
                } rounded-r-lg border-t border-r border-b`}
                onClick={() => setViewMode('map')}
              >
                Map View
              </button>
            </div>
            {user && (user.role === 'owner' || user.role === 'admin') && (
              <button
                onClick={() => navigate('/add-listing')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Add Property
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-6">
            {/* Search Bar */}
            <div className="md:col-span-4">
              <input
                type="text"
                placeholder="Search by location, property name, or description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Price Range */}
            <div>
              <input
                type="number"
                placeholder="Min Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={filters.bedrooms}
                onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1+ Bedroom</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={filters.bathrooms}
                onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
              >
                <option value="">Any Bathrooms</option>
                <option value="1">1+ Bathroom</option>
                <option value="2">2+ Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={filters.furnished}
                onChange={(e) => setFilters({ ...filters, furnished: e.target.value })}
              >
                <option value="">Furnished/Unfurnished</option>
                <option value="true">Furnished</option>
                <option value="false">Unfurnished</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={filters.rentType}
                onChange={(e) => setFilters({ ...filters, rentType: e.target.value })}
              >
                <option value="">Any Rent Type</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredProperties.length} properties
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <PropertySkeleton key={index} />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or check back later for new listings.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="h-[600px] rounded-lg overflow-hidden">
            <PropertyMap properties={filteredProperties} />
          </div>
        )}
      </div>
    </div>
  );
}