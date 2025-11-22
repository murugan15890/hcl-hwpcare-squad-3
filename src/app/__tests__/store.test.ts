import { store } from '../store';
import { setCredentials, logout } from '@/features/auth/authSlice';
import { setPatients } from '@/features/patient/patientSlice';

describe('Redux Store', () => {
  it('should have correct initial state', () => {
    const state = store.getState();
    
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBeNull();
    expect(state.patient.patients).toEqual([]);
    expect(state.provider.providers).toEqual([]);
  });

  it('should dispatch actions correctly', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'patient' as const,
    };

    store.dispatch(setCredentials({ user, token: 'test-token' }));
    
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.user).toEqual(user);

    store.dispatch(logout());
    
    const newState = store.getState();
    expect(newState.auth.isAuthenticated).toBe(false);
  });

  it('should handle patient actions', () => {
    const patients = [
      {
        id: '1',
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        email: 'john@example.com',
        phone: '123-456-7890',
        medicalRecordNumber: 'MRN001',
      },
    ];

    store.dispatch(setPatients(patients));
    
    const state = store.getState();
    expect(state.patient.patients).toEqual(patients);
  });
});


