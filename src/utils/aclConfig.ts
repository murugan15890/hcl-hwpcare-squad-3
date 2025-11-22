import { UserRole } from '@/types';

export type RoutePermission = {
  path: string;
  roles: UserRole[];
  exact?: boolean;
};

export type FeaturePermission = {
  feature: string;
  roles: UserRole[];
  actions?: string[];
};

// Route-based access control
export const routePermissions: RoutePermission[] = [
  // Public routes
  { path: '/login', roles: ['superadmin', 'admin', 'provider', 'patient'], exact: true },
  { path: '/register', roles: ['patient'], exact: true }, // Only patients can self-register
  { path: '/public-health', roles: ['superadmin', 'admin', 'provider', 'patient'] },
  { path: '/privacy-policy', roles: ['superadmin', 'admin', 'provider', 'patient'] },
  
  // Patient routes
  { path: '/dashboard/patient', roles: ['patient'] },
  { path: '/profile', roles: ['patient'] },
  { path: '/goals', roles: ['patient'] },
  { path: '/reminders', roles: ['patient'] },
  
  // Provider routes
  { path: '/dashboard/provider', roles: ['provider'] },
  
  // Admin routes
  { path: '/admin/assignments', roles: ['admin', 'superadmin'] },
  { path: '/admin/users', roles: ['admin', 'superadmin'] },
  
  // SuperAdmin routes
  { path: '/admin/user-management', roles: ['superadmin'] },
  { path: '/admin/system-logs', roles: ['superadmin'] },
];

// Feature-based access control
export const featurePermissions: FeaturePermission[] = [
  // User Management
  {
    feature: 'user-management',
    roles: ['superadmin'],
    actions: ['create', 'read', 'update', 'delete'],
  },
  {
    feature: 'user-list',
    roles: ['superadmin', 'admin'],
    actions: ['read'],
  },
  
  // Patient Assignment
  {
    feature: 'patient-assignment',
    roles: ['admin', 'superadmin'],
    actions: ['create', 'read', 'update', 'delete'],
  },
  
  // Patient Profile
  {
    feature: 'patient-profile',
    roles: ['patient', 'provider', 'admin', 'superadmin'],
    actions: ['read'],
  },
  {
    feature: 'patient-profile-edit',
    roles: ['patient'],
    actions: ['update'],
  },
  
  // Goals
  {
    feature: 'goals',
    roles: ['patient', 'provider', 'admin', 'superadmin'],
    actions: ['read'],
  },
  {
    feature: 'goals-edit',
    roles: ['patient'],
    actions: ['create', 'update'],
  },
  
  // Reminders
  {
    feature: 'reminders',
    roles: ['patient', 'provider', 'admin', 'superadmin'],
    actions: ['read'],
  },
];

/**
 * Check if a role has access to a route
 */
export const hasRouteAccess = (path: string, role: UserRole | null): boolean => {
  if (!role) return false;
  
  const permission = routePermissions.find((p) => {
    if (p.exact) {
      return p.path === path;
    }
    return path.startsWith(p.path);
  });
  
  return permission ? permission.roles.includes(role) : false;
};

/**
 * Check if a role has access to a feature
 */
export const hasFeatureAccess = (
  feature: string,
  role: UserRole | null,
  action: string = 'read'
): boolean => {
  if (!role) return false;
  
  const permission = featurePermissions.find((p) => p.feature === feature);
  if (!permission) return false;
  
  if (!permission.roles.includes(role)) return false;
  
  if (permission.actions && !permission.actions.includes(action)) {
    return false;
  }
  
  return true;
};

/**
 * Get all accessible routes for a role
 */
export const getAccessibleRoutes = (role: UserRole | null): string[] => {
  if (!role) return [];
  
  return routePermissions
    .filter((p) => p.roles.includes(role))
    .map((p) => p.path);
};
