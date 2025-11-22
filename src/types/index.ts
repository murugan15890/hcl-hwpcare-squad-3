// Common types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'provider' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  medicalRecordNumber: string;
}

export interface PatientGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'in-progress' | 'completed' | 'not-started';
  progress: number; // 0-100
  category: string;
}

export interface PatientCompliance {
  id: string;
  metric: string;
  value: number;
  target: number;
  unit: string;
  status: 'compliant' | 'non-compliant' | 'at-risk';
  lastUpdated: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  licenseNumber: string;
}

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


