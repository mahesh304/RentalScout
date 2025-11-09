import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { admin, auth } from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAdmin()) {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const dashboardStats = await admin.getDashboardStats();
      setStats(dashboardStats);

      const allListings = await admin.getAllListings();
      setListings(allListings);

      const allUsers = await admin.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleListingApproval = async (listingId, status, rejectionReason = '') => {
    try {
      await admin.updateListingApproval(listingId, status, rejectionReason);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating listing approval:', error);
    }
  };

  const handleUserStatusUpdate = async (userId, active) => {
    try {
      await admin.updateUserStatus(userId, active);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleListingDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await admin.deleteListing(listingId);
        loadDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 mr-4 ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 mr-4 ${activeTab === 'listings' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          Listings
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'users' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {/* Dashboard Overview */}
      {activeTab === 'dashboard' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Total Listings</h3>
            <p className="text-3xl">{stats.totalListings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Total Users</h3>
            <p className="text-3xl">{stats.totalUsers}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow col-span-2">
            <h3 className="text-xl font-semibold mb-4">Recent Listings</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Owner</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentListings.map(listing => (
                    <tr key={listing._id}>
                      <td className="px-4 py-2">{listing.title}</td>
                      <td className="px-4 py-2">{listing.owner.username}</td>
                      <td className="px-4 py-2">{listing.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Listings Management */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(listing => (
                <tr key={listing._id}>
                  <td className="px-4 py-2">{listing.title}</td>
                  <td className="px-4 py-2">{listing.owner.username}</td>
                  <td className="px-4 py-2">{listing.status}</td>
                  <td className="px-4 py-2">${listing.price}/night</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleListingApproval(listing._id, 'approved')}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleListingApproval(listing._id, 'rejected', prompt('Reason for rejection:'))}
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.isAdmin ? 'Admin' : 'User'}</td>
                  <td className="px-4 py-2">{user.active ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleUserStatusUpdate(user._id, !user.active)}
                      className={`${user.active ? 'bg-red-500' : 'bg-green-500'} text-white px-2 py-1 rounded`}
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;