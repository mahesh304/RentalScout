import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { listings } from '../services/api';

export default function HomePage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);

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

  // Fetch all listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await listings.getAll();
        console.log('Listings loaded:', response);
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

  // Filter properties when category, city, or search changes
  useEffect(() => {
    if (!properties.length) return;
    
    let filtered = [...properties];
    
    // Apply category filter
    if (selectedCategory) {
      const categoryMap = {
        'villa': 'Villa',
        'studio': 'Studio',
        'farmhouse': 'Farm House',
        'poolhouse': 'Pool House',
        'apartment': 'Apartment',
        'pg': 'PG/Hostel',
        'cabin': 'Cabins',
        'shop': 'Shop/Office',
        'bungalow': 'Bungalow'
      };
      const targetCategory = categoryMap[selectedCategory];
      filtered = filtered.filter(property => property.category === targetCategory);
    }

    // Apply city filter
    if (selectedCity) {
      filtered = filtered.filter(property => property.location.city === selectedCity);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(property => 
        property.location.city.toLowerCase().includes(query) ||
        property.location.area.toLowerCase().includes(query) ||
        property.title.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(filtered);
  }, [selectedCategory, selectedCity, searchQuery, properties]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search and Cities Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-xs">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by city, area or title..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* City Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
                {['Vadodara', 'Surat', 'Ahmedabad', 'Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad'].map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition ${
                      selectedCity === city
                        ? 'bg-primary-50 text-primary-700 border-2 border-primary-500'
                        : 'text-gray-700 bg-gray-100 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Add New Property Button - Only show for owners */}
            {user?.role === 'owner' && (
              <Link
                to="/listings/add"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add New Property
              </Link>
            )}
          </div>

          {/* Property Types Section */}
          <div>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <PropertySkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {/* Property Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-6">
              {filteredProperties.map((property) => (
                <PropertyCard 
                  key={property._id} 
                  property={property}
                  onClick={() => navigate(`/property/${property._id}`)}
                />
              ))}
            </div>
            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500">Try selecting a different category</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
