import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Button from '@/components/ui/Button';

// Lazy load pages for code splitting
const Login = lazy(() => import('@/pages/Login'));
const DashboardPatient = lazy(() => import('@/pages/DashboardPatient'));
const DashboardProvider = lazy(() => import('@/pages/DashboardProvider'));
const PatientDetail = lazy(() => import('@/pages/PatientDetail'));
const PublicHealth = lazy(() => import('@/pages/PublicHealth'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-blue mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected Route wrapper (simplified - add auth check logic)
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  // In a real app, check authentication state here
  return children;
};

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
    path: '/patients/:patientId',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <PatientDetail />
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
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};


