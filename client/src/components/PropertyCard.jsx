
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

export default function PropertyCard({ property }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition-transform duration-200 flex flex-col">
      <div className="relative">
        <img
          src={getImageUrl(property.image)}
          alt={property.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            console.error('Image load error:', property.image);
            e.target.onerror = null;
            e.target.src = '/placeholder-property.jpg';
          }}
        />
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-4 py-1 rounded-full font-semibold text-primary-600 shadow">
          ₹{property.price.toLocaleString()}/mo
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{`${property.location.area}, ${property.location.city}`}</span>
        </div>
        <div className="flex gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-primary-700">{property.category}</span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{property.rentType}</span>
        </div>
        <div className="flex items-center mb-4">
          <div className="flex items-center text-yellow-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-gray-700 font-medium">{property.rating || 0}</span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">{property.reviewCount || 0} reviews</span>
        </div>
        <div className="flex gap-2 mt-auto">
          <button 
            onClick={() => navigate(`/property/${property._id}`)}
            className="flex-1 py-2 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition"
          >
            View Details
          </button>
          <button 
            onClick={() => navigate(`/booking/${property._id}`)}
            className="flex-1 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}