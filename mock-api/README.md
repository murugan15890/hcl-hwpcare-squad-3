
Setting up a JSON mock server for all APIs. Files and configurations:

## 1. Mock API Database (`mock-api/db.json`)

```json:mock-api/db.json
{
  "users": [
    {
      "id": "1",
      "email": "superadmin@healthcare.com",
      "password": "admin123",
      "name": "Super Admin",
      "role": "superadmin",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "2",
      "email": "admin@healthcare.com",
      "password": "admin123",
      "name": "Admin User",
      "role": "admin",
      "createdAt": "2024-01-02T00:00:00Z",
      "updatedAt": "2024-01-02T00:00:00Z"
    },
    {
      "id": "3",
      "email": "provider@healthcare.com",
      "password": "provider123",
      "name": "Dr. John Smith",
      "role": "provider",
      "createdAt": "2024-01-03T00:00:00Z",
      "updatedAt": "2024-01-03T00:00:00Z"
    },
    {
      "id": "4",
      "email": "patient@example.com",
      "password": "patient123",
      "name": "Jane Doe",
      "role": "patient",
      "createdAt": "2024-01-04T00:00:00Z",
      "updatedAt": "2024-01-04T00:00:00Z"
    }
  ],
  "patientProfiles": [
    {
      "id": "1",
      "userId": "4",
      "dateOfBirth": "1990-05-15",
      "phone": "+1234567890",
      "address": "123 Main St, City, State 12345",
      "emergencyContact": {
        "name": "John Doe",
        "phone": "+1234567891",
        "relationship": "Spouse"
      },
      "medicalRecordNumber": "MRN-001",
      "allergies": ["Peanuts", "Penicillin"],
      "medications": ["Aspirin", "Vitamin D"],
      "createdAt": "2024-01-04T00:00:00Z",
      "updatedAt": "2024-01-04T00:00:00Z"
    }
  ],
  "providers": [
    {
      "id": "1",
      "userId": "3",
      "name": "Dr. John Smith",
      "specialty": "Cardiology",
      "email": "provider@healthcare.com",
      "phone": "+1234567892",
      "licenseNumber": "LIC-001",
      "createdAt": "2024-01-03T00:00:00Z",
      "updatedAt": "2024-01-03T00:00:00Z"
    }
  ],
  "goals": [
    {
      "id": "1",
      "userId": "4",
      "type": "sleep",
      "target": 8,
      "current": 7,
      "unit": "hours",
      "date": "2024-01-15",
      "completed": false,
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    },
    {
      "id": "2",
      "userId": "4",
      "type": "steps",
      "target": 10000,
      "current": 8500,
      "unit": "steps",
      "date": "2024-01-15",
      "completed": false,
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    },
    {
      "id": "3",
      "userId": "4",
      "type": "water",
      "target": 8,
      "current": 6,
      "unit": "glasses",
      "date": "2024-01-15",
      "completed": false,
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "reminders": [
    {
      "id": "1",
      "userId": "4",
      "title": "Morning Medication",
      "description": "Take prescribed medication with breakfast",
      "type": "medication",
      "scheduledDate": "2024-01-16",
      "scheduledTime": "08:00",
      "completed": false,
      "priority": "high",
      "createdAt": "2024-01-10T00:00:00Z",
      "updatedAt": "2024-01-10T00:00:00Z"
    },
    {
      "id": "2",
      "userId": "4",
      "title": "Annual Checkup",
      "description": "Schedule annual health checkup",
      "type": "checkup",
      "scheduledDate": "2024-01-20",
      "completed": false,
      "priority": "medium",
      "createdAt": "2024-01-12T00:00:00Z",
      "updatedAt": "2024-01-12T00:00:00Z"
    }
  ],
  "providerAssignments": [
    {
      "id": "1",
      "providerId": "3",
      "patientId": "4",
      "assignedAt": "2024-01-05T00:00:00Z",
      "assignedBy": "2",
      "status": "active",
      "notes": "Initial assignment"
    }
  ],
  "logs": [
    {
      "id": "1",
      "userId": "4",
      "action": "login",
      "resource": "auth",
      "role": "patient",
      "timestamp": "2024-01-15T10:00:00Z",
      "metadata": {
        "ip": "192.168.1.1",
        "userAgent": "Mozilla/5.0"
      }
    },
    {
      "id": "2",
      "userId": "2",
      "action": "assign_patient",
      "resource": "providerAssignments",
      "resourceId": "1",
      "role": "admin",
      "timestamp": "2024-01-05T10:00:00Z",
      "metadata": {
        "providerId": "3",
        "patientId": "4"
      }
    }
  ]
}
```

## 2. JSON Server Configuration (`mock-api/server.json`)

```json:mock-api/server.json
{
  "port": 5000,
  "delay": 300,
  "id": "id"
}
```

## 3. Update Constants with All JSON-Server Endpoints (`src/utils/constants.ts`)

```typescript:src/utils/constants.ts
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
```

## 4. Update Axios Client for JSON Server (`src/utils/axiosClient.ts`)

```typescript:src/utils/axiosClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { MOCK_API_CONFIG } from './constants';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || MOCK_API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - attach JWT token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and logout
axiosClient.interceptors.response.use(
  (response) => {
    // JSON Server returns arrays directly, wrap single item responses if needed
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
```

## 5. Update Package.json with JSON Server (`package.json`)

Add json-server to devDependencies and add scripts:

```json:package.json
{
  "name": "healthcare-wellness-preventive-care-portal",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,scss,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,scss,json}\"",
    "prepare": "husky install",
    "mock:server": "json-server --watch mock-api/db.json --port 5000 --delay 300",
    "mock:server:quiet": "json-server --watch mock-api/db.json --port 5000 --quiet",
    "dev:all": "concurrently \"npm run dev\" \"npm run mock:server\""
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.26.0",
    "@reduxjs/toolkit": "^2.2.0",
    "react-redux": "^9.1.0",
    "axios": "^1.7.0",
    "react-window": "^1.8.10",
    "@tanstack/react-query": "^5.56.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/react-window": "^1.8.8",
    "@typescript-eslint/eslint-plugin": "^7.18.0",
    "@typescript-eslint/parser": "^7.18.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.10",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/user-event": "^14.5.2",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@types/jest": "^29.5.14",
    "ts-jest": "^29.2.0",
    "identity-obj-proxy": "^3.0.0",
    "eslint": "^8.57.1",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.11",
    "prettier": "^3.3.3",
    "husky": "^9.1.0",
    "lint-staged": "^15.2.10",
    "json-server": "^0.17.4",
    "concurrently": "^8.2.2"
  }
}
```

## 6. Helper Utility for JSON Server Queries (`src/utils/apiHelpers.ts`)

```typescript:src/utils/apiHelpers.ts
import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './constants';

/**
 * Helper to handle JSON Server array responses
 * JSON Server returns arrays even for single item queries
 */
export const getFirstItem = <T>(data: T | T[]): T | null => {
  if (Array.isArray(data)) {
    return data.length > 0 ? data[0] : null;
  }
  return data;
};

/**
 * Helper to handle JSON Server array responses - get all items
 */
export const getArray = <T>(data: T | T[]): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  return data ? [data] : [];
};

/**
 * Login user using JSON Server query
 */
export const loginUser = async (email: string, password: string) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.USERS.BY_EMAIL_PASSWORD(email, password)
  );
  const users = getArray(response.data);
  return getFirstItem(users);
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string) => {
  const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_EMAIL(email));
  const users = getArray(response.data);
  return getFirstItem(users);
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role: string) => {
  const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_ROLE(role));
  return getArray(response.data);
};

/**
 * Get patient profile by userId
 */
export const getPatientProfileByUser = async (userId: string) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.PATIENT_PROFILES.BY_USER(userId)
  );
  const profiles = getArray(response.data);
  return getFirstItem(profiles);
};

/**
 * Get goals by userId
 */
export const getGoalsByUser = async (userId: string) => {
  const response = await axiosClient.get(API_ENDPOINTS.GOALS.BY_USER(userId));
  return getArray(response.data);
};

/**
 * Get reminders by userId
 */
export const getRemindersByUser = async (userId: string) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.REMINDERS.BY_USER(userId)
  );
  return getArray(response.data);
};

/**
 * Get provider assignments by providerId
 */
export const getAssignmentsByProvider = async (providerId: string) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.PROVIDER_ASSIGNMENTS.BY_PROVIDER(providerId)
  );
  return getArray(response.data);
};

/**
 * Get provider assignments by patientId
 */
export const getAssignmentsByPatient = async (patientId: string) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.PROVIDER_ASSIGNMENTS.BY_PATIENT(patientId)
  );
  return getArray(response.data);
};
```

## 7. Update Utils Index (`src/utils/index.ts`)

```typescript:src/utils/index.ts
export * from './axiosClient';
export * from './caching';
export * from './constants';
export * from './apiHelpers';
```

## 8. README for Mock Server (`mock-api/README.md`)

```markdown:mock-api/README.md
# Mock JSON Server

This directory contains the mock API server configuration for development.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the mock server:
```bash
npm run mock:server
```

The server will run on `http://localhost:5000`

## Available Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `GET /users?role=patient` - Get users by role
- `GET /users?email=test@example.com&password=123` - Login query
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Patient Profiles
- `GET /patientProfiles` - Get all profiles
- `GET /patientProfiles/:id` - Get profile by ID
- `GET /patientProfiles?userId=4` - Get profile by userId
- `POST /patientProfiles` - Create profile
- `PUT /patientProfiles/:id` - Update profile
- `DELETE /patientProfiles/:id` - Delete profile

### Providers
- `GET /providers` - Get all providers
- `GET /providers/:id` - Get provider by ID
- `POST /providers` - Create provider
- `PUT /providers/:id` - Update provider
- `DELETE /providers/:id` - Delete provider

### Goals
- `GET /goals` - Get all goals
- `GET /goals?userId=4` - Get goals by userId
- `GET /goals?userId=4&date=2024-01-15` - Get goals by userId and date
- `POST /goals` - Create goal
- `PUT /goals/:id` - Update goal
- `DELETE /goals/:id` - Delete goal

### Reminders
- `GET /reminders` - Get all reminders
- `GET /reminders?userId=4` - Get reminders by userId
- `GET /reminders?userId=4&completed=false` - Get incomplete reminders
- `POST /reminders` - Create reminder
- `PUT /reminders/:id` - Update reminder
- `DELETE /reminders/:id` - Delete reminder

### Provider Assignments
- `GET /providerAssignments` - Get all assignments
- `GET /providerAssignments?providerId=3` - Get assignments by provider
- `GET /providerAssignments?patientId=4` - Get assignments by patient
- `POST /providerAssignments` - Create assignment
- `PUT /providerAssignments/:id` - Update assignment
- `DELETE /providerAssignments/:id` - Delete assignment

### Logs
- `GET /logs` - Get all logs
- `GET /logs?userId=4` - Get logs by userId
- `GET /logs?role=patient` - Get logs by role
- `POST /logs` - Create log entry

## Default Users

- **SuperAdmin**: `superadmin@healthcare.com` / `admin123`
- **Admin**: `admin@healthcare.com` / `admin123`
- **Provider**: `provider@healthcare.com` / `provider123`
- **Patient**: `patient@example.com` / `patient123`
```

## Summary

This setup includes:

1. `mock-api/db.json` — database with all entities
2. `mock-api/server.json` — JSON Server configuration
3. Updated `constants.ts` — endpoints compatible with JSON Server queries
4. Updated `axiosClient.ts` — points to port 5000
5. `apiHelpers.ts` — utilities for handling JSON Server array responses
6. Updated `package.json` — json-server dependency and scripts
7. Documentation — README for the mock server

To use:

1. Install dependencies: `npm install`
2. Start the mock server: `npm run mock:server` (runs on port 5000)
3. Start the dev server: `npm run dev` (runs on port 3000)
4. Or run both: `npm run dev:all` (requires `concurrently`)

The mock server supports all CRUD operations and query parameters as specified in your requirements document.

