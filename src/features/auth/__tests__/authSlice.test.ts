import authReducer, { setCredentials, logout, setLoading } from '../authSlice';
import type { AuthState } from '@/types';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCredentials', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'patient' as const,
    };
    const token = 'test-token';

    const actual = authReducer(initialState, setCredentials({ user, token }));
    
    expect(actual.user).toEqual(user);
    expect(actual.token).toBe(token);
    expect(actual.isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    const stateWithAuth: AuthState = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'patient',
      },
      token: 'test-token',
      isAuthenticated: true,
      isLoading: false,
    };

    const actual = authReducer(stateWithAuth, logout());
    
    expect(actual.user).toBeNull();
    expect(actual.token).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });

  it('should handle setLoading', () => {
    const actual = authReducer(initialState, setLoading(true));
    expect(actual.isLoading).toBe(true);

    const actual2 = authReducer(actual, setLoading(false));
    expect(actual2.isLoading).toBe(false);
  });
});


