import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser } from '../authSlice';
import * as apiHelpers from '@/utils/apiHelpers';
import type { User } from '@/types';

// Mock the API helpers
jest.mock('@/utils/apiHelpers', () => ({
  loginUser: jest.fn(),
  getUserByEmail: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('authSlice - Patient Login', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  const mockPatientUser: User = {
    id: '1',
    email: 'patient@example.com',
    name: 'John Patient',
    role: 'patient',
  };

  it('should handle successful patient login', async () => {
    (apiHelpers.loginUser as jest.Mock).mockResolvedValue(mockPatientUser);

    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    const result = await store.dispatch(
      loginUser({ email: 'patient@example.com', password: 'password123' })
    );

    expect(result.type).toBe('auth/login/fulfilled');
    if (result.type === 'auth/login/fulfilled') {
      expect(result.payload).toMatchObject({
        user: mockPatientUser,
        token: expect.any(String),
      });
    }

    const state = store.getState().auth;
    expect(state.user).toEqual(mockPatientUser);
    expect(state.token).toBeTruthy();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);

    // Verify localStorage was updated
    expect(localStorage.getItem('auth_token')).toBeTruthy();
    expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockPatientUser));
  });

  it('should handle login failure with invalid credentials', async () => {
    (apiHelpers.loginUser as jest.Mock).mockResolvedValue(null);

    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    const result = await store.dispatch(
      loginUser({ email: 'patient@example.com', password: 'wrongpassword' })
    );

    expect(result.type).toBe('auth/login/rejected');
    if (result.type === 'auth/login/rejected') {
      expect(result.error.message).toBe('Invalid email or password');
    }

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('should handle login failure with API error', async () => {
    (apiHelpers.loginUser as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    const result = await store.dispatch(
      loginUser({ email: 'patient@example.com', password: 'password123' })
    );

    expect(result.type).toBe('auth/login/rejected');
    if (result.type === 'auth/login/rejected') {
      expect(result.error.message).toBe('Network error');
    }

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('should set loading state during login', async () => {
    (apiHelpers.loginUser as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockPatientUser), 100))
    );

    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    const loginPromise = store.dispatch(
      loginUser({ email: 'patient@example.com', password: 'password123' })
    );

    // Check loading state
    let state = store.getState().auth;
    expect(state.isLoading).toBe(true);

    await loginPromise;

    // Check final state
    state = store.getState().auth;
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should generate and store JWT token on successful login', async () => {
    (apiHelpers.loginUser as jest.Mock).mockResolvedValue(mockPatientUser);

    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    await store.dispatch(
      loginUser({ email: 'patient@example.com', password: 'password123' })
    );

    const token = localStorage.getItem('auth_token');
    expect(token).toBeTruthy();

    // Verify token structure (base64 encoded JSON)
    if (token) {
      const decoded = JSON.parse(atob(token));
      expect(decoded).toMatchObject({
        userId: mockPatientUser.id,
        email: mockPatientUser.email,
        iat: expect.any(Number),
        exp: expect.any(Number),
      });
    }
  });
});
