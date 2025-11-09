const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const DEFAULT_PLACEHOLDER = '/placeholder-property.jpg';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_PLACEHOLDER;
  
  // If the image path is already a full URL, return it as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If the path starts with a slash, remove it to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${API_URL}/${cleanPath}`;
};