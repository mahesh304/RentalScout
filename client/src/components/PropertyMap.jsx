import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const PropertyMap = ({ address, properties }) => {
  const [center, setCenter] = useState({
    lat: 22.3072, // Default to Vadodara
    lng: 73.1812
  });
  const [selectedProperty, setSelectedProperty] = useState(null);

  // If single address is provided, use it for center
  useEffect(() => {
    if (address) {
      // For demo purposes, using hardcoded coordinates for Vadodara
      setCenter({
        lat: 22.3072,
        lng: 73.1812
      });
    }
  }, [address]);

  // For demo purposes, generate random coordinates around Vadodara for each property
  const getPropertyCoordinates = (property) => {
    // Generate random offset between -0.05 and 0.05 degrees
    const randomLat = (Math.random() - 0.5) * 0.1;
    const randomLng = (Math.random() - 0.5) * 0.1;
    
    return {
      lat: center.lat + randomLat,
      lng: center.lng + randomLng
    };
  };

  // Error state for map loading
  const [mapError, setMapError] = useState(false);

  if (mapError) {
    return (
      <div className="h-[600px] bg-gray-100 flex items-center justify-center flex-col">
        <p className="text-red-600 mb-2">Unable to load map</p>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCrbz0OYg45z5VG0g9tbTggf4j0uRpwaTU"}
      onError={() => setMapError(true)}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {properties ? (
          // Show multiple properties
          properties.map((property) => {
            const position = getPropertyCoordinates(property);
            return (
              <Marker
                key={property._id}
                position={position}
                onClick={() => setSelectedProperty(property)}
              />
            );
          })
        ) : (
          // Show single property
          address && <Marker position={center} />
        )}

        {selectedProperty && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-lg m-4 rounded-lg"
            style={{ zIndex: 1000 }}
          >
            <h3 className="font-semibold text-lg">{selectedProperty.title}</h3>
            <p className="text-gray-600">₹{selectedProperty.price.toLocaleString()} / month</p>
            <p className="text-sm text-gray-500">{selectedProperty.location.area}, {selectedProperty.location.city}</p>
            <button
              onClick={() => window.location.href = `/property/${selectedProperty._id}`}
              className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              View Details
            </button>
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default PropertyMap;