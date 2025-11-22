import { useMemo } from 'react';
import { useAppSelector } from '@/app/hooks';
import { UserRole } from '@/types';
import {
  hasRouteAccess,
  hasFeatureAccess,
  getAccessibleRoutes,
} from '@/utils/aclConfig';

/**
 * Custom hook for Access Control List (ACL) functionality
 */
export const useACL = () => {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || null;

  const canAccessRoute = useMemo(
    () => (path: string) => hasRouteAccess(path, role),
    [role]
  );

  const canAccessFeature = useMemo(
    () => (feature: string, action: string = 'read') =>
      hasFeatureAccess(feature, role, action),
    [role]
  );

  const accessibleRoutes = useMemo(
    () => getAccessibleRoutes(role),
    [role]
  );

  const isRole = useMemo(
    () => (checkRole: UserRole | UserRole[]) => {
      if (!role) return false;
      if (Array.isArray(checkRole)) {
        return checkRole.includes(role);
      }
      return role === checkRole;
    },
    [role]
  );

  const isSuperAdmin = useMemo(() => role === 'superadmin', [role]);
  const isAdmin = useMemo(() => role === 'admin' || role === 'superadmin', [role]);
  const isProvider = useMemo(() => role === 'provider', [role]);
  const isPatient = useMemo(() => role === 'patient', [role]);

  return {
    role,
    user,
    canAccessRoute,
    canAccessFeature,
    accessibleRoutes,
    isRole,
    isSuperAdmin,
    isAdmin,
    isProvider,
    isPatient,
  };
};
