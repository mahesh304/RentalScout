import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AddListingPage from './pages/AddListingPage';
import AdminDashboard from './pages/AdminDashboard';
import BookingPage from './pages/BookingPage';
import EditListingPage from './pages/EditListingPage';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PropertyDetails from './pages/PropertyDetails';
import SignUpPage from './pages/SignUpPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route
                path="/listings/add"
                element={
                  <ProtectedRoute requiredRole="owner">
                    <AddListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/listings/edit/:id"
                element={
                  <ProtectedRoute requiredRole="owner">
                    <EditListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}
