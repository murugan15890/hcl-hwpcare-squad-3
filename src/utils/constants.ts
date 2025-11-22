// API Endpoints - JSON Server compatible
export const API_ENDPOINTS = {
  // Users endpoints
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    // Query by role
    BY_ROLE: (role: string) => `/users?role=${role}`,
    // Query by email and password (for login)
    BY_EMAIL_PASSWORD: (email: string, password: string) => 
      `/users?email=${email}&password=${password}`,
    // Query by email only
    BY_EMAIL: (email: string) => `/users?email=${email}`,
  },
  
  // Patient Profiles endpoints
  PATIENT_PROFILES: {
    LIST: '/patientProfiles',
    DETAIL: (id: string) => `/patientProfiles/${id}`,
    CREATE: '/patientProfiles',
    UPDATE: (id: string) => `/patientProfiles/${id}`,
    DELETE: (id: string) => `/patientProfiles/${id}`,
    // Query by userId
    BY_USER: (userId: string) => `/patientProfiles?userId=${userId}`,
  },
  
  // Providers endpoints
  PROVIDERS: {
    LIST: '/providers',
    DETAIL: (id: string) => `/providers/${id}`,
    CREATE: '/providers',
    UPDATE: (id: string) => `/providers/${id}`,
    DELETE: (id: string) => `/providers/${id}`,
    // Query by userId
    BY_USER: (userId: string) => `/providers?userId=${userId}`,
  },
  
  // Goals endpoints
  GOALS: {
    LIST: '/goals',
    DETAIL: (id: string) => `/goals/${id}`,
    CREATE: '/goals',
    UPDATE: (id: string) => `/goals/${id}`,
    DELETE: (id: string) => `/goals/${id}`,
    // Query by userId
    BY_USER: (userId: string) => `/goals?userId=${userId}`,
    // Query by userId and date
    BY_USER_DATE: (userId: string, date: string) => 
      `/goals?userId=${userId}&date=${date}`,
  },
  
  // Reminders endpoints
  REMINDERS: {
    LIST: '/reminders',
    DETAIL: (id: string) => `/reminders/${id}`,
    CREATE: '/reminders',
    UPDATE: (id: string) => `/reminders/${id}`,
    DELETE: (id: string) => `/reminders/${id}`,
    // Query by userId
    BY_USER: (userId: string) => `/reminders?userId=${userId}`,
    // Query by userId and completed status
    BY_USER_COMPLETED: (userId: string, completed: boolean) => 
      `/reminders?userId=${userId}&completed=${completed}`,
  },
  
  // Provider Assignments endpoints
  PROVIDER_ASSIGNMENTS: {
    LIST: '/providerAssignments',
    DETAIL: (id: string) => `/providerAssignments/${id}`,
    CREATE: '/providerAssignments',
    UPDATE: (id: string) => `/providerAssignments/${id}`,
    DELETE: (id: string) => `/providerAssignments/${id}`,
    // Query by providerId
    BY_PROVIDER: (providerId: string) => 
      `/providerAssignments?providerId=${providerId}`,
    // Query by patientId
    BY_PATIENT: (patientId: string) => 
      `/providerAssignments?patientId=${patientId}`,
    // Query by providerId and status
    BY_PROVIDER_STATUS: (providerId: string, status: string) => 
      `/providerAssignments?providerId=${providerId}&status=${status}`,
  },
  
  // Logs endpoints
  LOGS: {
    LIST: '/logs',
    DETAIL: (id: string) => `/logs/${id}`,
    CREATE: '/logs',
    // Query by userId
    BY_USER: (userId: string) => `/logs?userId=${userId}`,
    // Query by role
    BY_ROLE: (role: string) => `/logs?role=${role}`,
    // Query by action
    BY_ACTION: (action: string) => `/logs?action=${action}`,
  },
} as const;

// Cache Keys
export const CACHE_KEYS = {
  PATIENTS: 'patients',
  PROVIDERS: 'providers',
  USER_PROFILE: 'user_profile',
  GOALS: 'goals',
  REMINDERS: 'reminders',
  ASSIGNMENTS: 'assignments',
  USERS: 'users',
} as const;

// Route Paths
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD_PATIENT: '/dashboard/patient',
  DASHBOARD_PROVIDER: '/dashboard/provider',
  DASHBOARD_ADMIN: '/admin',
  PROFILE: '/profile',
  GOALS: '/goals',
  REMINDERS: '/reminders',
  PUBLIC_HEALTH: '/public-health',
  PRIVACY_POLICY: '/privacy-policy',
  ADMIN_USER_MANAGEMENT: '/admin/user-management',
  ADMIN_ASSIGNMENTS: '/admin/assignments',
  ADMIN_SYSTEM_LOGS: '/admin/system-logs',
} as const;

// Mock API Configuration
export const MOCK_API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  PORT: 5000,
} as const;


