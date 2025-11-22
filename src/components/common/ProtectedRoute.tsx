import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { useACL } from '@/hooks/useACL';
import { ROUTES } from '@/utils/constants';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requiredRoles,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { canAccessRoute, role } = useACL();

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole || requiredRoles) {
    const allowedRoles = requiredRoles || (requiredRole ? [requiredRole] : []);
    if (!role || !allowedRoles.includes(role)) {
      // Redirect to appropriate dashboard based on role
      if (role === 'patient') {
        return <Navigate to={ROUTES.DASHBOARD_PATIENT} replace />;
      }
      if (role === 'provider') {
        return <Navigate to={ROUTES.DASHBOARD_PROVIDER} replace />;
      }
      if (role === 'admin' || role === 'superadmin') {
        return <Navigate to={ROUTES.DASHBOARD_ADMIN} replace />;
      }
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
  }

  // Check route-level access
  if (!canAccessRoute(location.pathname)) {
    // Redirect to appropriate dashboard
    if (role === 'patient') {
      return <Navigate to={ROUTES.DASHBOARD_PATIENT} replace />;
    }
    if (role === 'provider') {
      return <Navigate to={ROUTES.DASHBOARD_PROVIDER} replace />;
    }
    if (role === 'admin' || role === 'superadmin') {
      return <Navigate to={ROUTES.DASHBOARD_ADMIN} replace />;
    }
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};
