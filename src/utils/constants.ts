// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  API_ROOT: '/api',
  PATIENTS: {
    LIST: '/patients',
    DETAIL: (id: string) => `/patients/${id}`,
    CREATE: '/patients',
    UPDATE: (id: string) => `/patients/${id}`,
    DELETE: (id: string) => `/patients/${id}`,
  },
  PROVIDERS: {
    LIST: '/providers',
    DETAIL: (id: string) => `/providers/${id}`,
    CREATE: '/providers',
    UPDATE: (id: string) => `/providers/${id}`,
    DELETE: (id: string) => `/providers/${id}`,
  },
} as const;

// Cache Keys
export const CACHE_KEYS = {
  PATIENTS: 'patients',
  PROVIDERS: 'providers',
  USER_PROFILE: 'user_profile',
} as const;

// Route Paths
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD_PATIENT: '/dashboard/patient',
  DASHBOARD_PROVIDER: '/dashboard/provider',
  PUBLIC_HEALTH: '/public-health',
} as const;


