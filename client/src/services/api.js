import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  signup: async (userData) => {
    try {
      console.log('Sending signup request with data:', userData);
      const response = await api.post('/auth/signup', userData);
      console.log('Signup response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Signup error:', {
        response: error.response?.data,
        status: error.response?.status,
        error: error.message
      });
      
      // Extract the error message from the response
      const message = error.response?.data?.message || 'Failed to create account';
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const listings = {
  getAll: async () => {
    const response = await api.get('/listings');
    return response.data;
  },

  getOne: async (id) => {
    try {
      const response = await api.get(`/listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listing:', error.response?.data || error.message);
      throw error;
    }
  },

  getMyListings: async () => {
    const response = await api.get('/listings/my-listings');
    return response.data;
  },

  create: async (formData) => {
    console.log('API Service - FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }

    const response = await api.post('/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, listingData) => {
    const response = await api.put(`/listings/${id}`, listingData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  }
};

export const users = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }
};

export const admin = {
  getAllListings: async () => {
    const response = await api.get('/admin/listings');
    return response.data;
  },

  updateListing: async (listingId, updateData) => {
    const response = await api.put(`/admin/listings/${listingId}`, updateData);
    return response.data;
  },

  deleteListing: async (listingId) => {
    const response = await api.delete(`/admin/listings/${listingId}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId, active) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { active });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  updateListingApproval: async (listingId, status, rejectionReason = '') => {
    const response = await api.patch(`/admin/listings/${listingId}/approval`, {
      status,
      rejectionReason
    });
    return response.data;
  }
};

export default api;
