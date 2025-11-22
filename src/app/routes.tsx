import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ROUTES } from '@/utils/constants';

// Lazy load pages for code splitting
const Login = lazy(() => import('@/pages/Login'));
const DashboardPatient = lazy(() => import('@/pages/DashboardPatient'));
const DashboardProvider = lazy(() => import('@/pages/DashboardProvider'));
const PublicHealth = lazy(() => import('@/pages/PublicHealth'));
const RegisterPatient = lazy(() => import('@/pages/RegisterPatient'));
const AdminUserList = lazy(() => import('@/pages/admin/AdminUserList'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AssignmentPage = lazy(() => import('@/pages/admin/AssignmentPage'));
const GoalTracker = lazy(() => import('@/pages/GoalTracker'));
const Reminders = lazy(() => import('@/pages/Reminders'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const DashboardAdmin = lazy(() => import('@/pages/admin/DashboardAdmin'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-blue mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/dashboard/patient',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardPatient />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/provider',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardProvider />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/public-health',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PublicHealth />
      </Suspense>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RegisterPatient />
      </Suspense>
    ),
  },
  {
    path: ROUTES.ADMIN_USER_MANAGEMENT,
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <Suspense fallback={<LoadingFallback />}>
          <AdminUserList />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute requiredRole="patient">
        <Suspense fallback={<LoadingFallback />}>
          <ProfilePage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN_ASSIGNMENTS,
    element: (
      <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
        <Suspense fallback={<LoadingFallback />}>
          <AssignmentPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.GOALS,
    element: (
      <ProtectedRoute requiredRole="patient">
        <Suspense fallback={<LoadingFallback />}>
          <GoalTracker />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.REMINDERS,
    element: (
      <ProtectedRoute requiredRole="patient">
        <Suspense fallback={<LoadingFallback />}>
          <Reminders />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PRIVACY_POLICY,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PrivacyPolicy />
      </Suspense>
    ),
  },
  {
    path: ROUTES.DASHBOARD_ADMIN,
    element: (
      <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardAdmin />
        </Suspense>
      </ProtectedRoute>
    ),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};


