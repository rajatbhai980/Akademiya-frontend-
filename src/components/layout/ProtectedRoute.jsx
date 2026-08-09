import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

/** requireStaff: if true, only is_staff users may pass; others are redirected home. */
export default function ProtectedRoute({ requireStaff = false }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loader fullPage label="Checking your session" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireStaff && !user?.is_staff) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
