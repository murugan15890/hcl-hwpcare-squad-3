// User and Authentication Types
export type UserRole = 'superadmin' | 'admin' | 'provider' | 'patient';

export interface User {
  id: string;
  email: string;
  password?: string; // Only for registration/login
  name: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Patient Types
export interface PatientProfile {
  id: string;
  userId: string;
  dateOfBirth: string;
  phone: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalRecordNumber: string;
  allergies?: string[];
  medications?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  medicalRecordNumber: string;
}

// Provider Types
export interface Provider {
  id: string;
  userId: string; // Add this line
  name: string;
  specialty: string;
  email: string;
  phone: string;
  licenseNumber: string;
}

// Provider Assignment Types
export interface ProviderAssignment {
  id: string;
  providerId: string;
  patientId: string;
  assignedAt: string;
  assignedBy?: string; // Admin/SuperAdmin ID
  status: 'active' | 'inactive';
  notes?: string;
}

// Goal Tracker Types
export interface Goal {
  id: string;
  userId: string;
  type: 'sleep' | 'steps' | 'water' | 'exercise' | 'medication';
  target: number;
  current: number;
  unit: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Reminder Types
export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'medication' | 'appointment' | 'checkup' | 'goal' | 'general';
  scheduledDate: string;
  scheduledTime?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt?: string;
  updatedAt?: string;
}

// Log Types
export interface Log {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  role: UserRole;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// UI Types
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
  loading: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}


