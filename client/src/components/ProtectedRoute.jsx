import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole) {
    if (requiredRole === 'admin' && !user?.isAdmin) {
      return <Navigate to="/" />;
    }
    if (requiredRole === 'owner' && user?.role !== 'owner') {
      return <Navigate to="/" />;
    }
  }

  return children;
}