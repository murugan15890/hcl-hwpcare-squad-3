import { configureStore } from '@reduxjs/toolkit';
import patientReducer, { updatePatientProfile, setProfile } from '../patientSlice';
import axiosClient from '@/utils/axiosClient';
import type { PatientProfile } from '@/types';

// Mock axios client
jest.mock('@/utils/axiosClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedAxios = axiosClient as jest.Mocked<typeof axiosClient>;

describe('patientSlice - Profile Update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProfile: PatientProfile = {
    id: '1',
    userId: 'user1',
    dateOfBirth: '1990-01-01',
    phone: '+1234567890',
    address: '123 Main St',
    medicalRecordNumber: 'MRN-001',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1234567891',
      relationship: 'Spouse',
    },
    allergies: ['Peanuts'],
    medications: ['Aspirin'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const updatedProfile: PatientProfile = {
    ...mockProfile,
    phone: '+9876543210',
    address: '456 New St',
    allergies: ['Peanuts', 'Dairy'],
    updatedAt: '2024-01-15T00:00:00Z',
  };

  it('should successfully update patient profile', async () => {
    mockedAxios.put.mockResolvedValue({ data: updatedProfile });

    const store = configureStore({
      reducer: {
        patient: patientReducer,
      },
    });

    // First, set the initial profile
    store.dispatch(setProfile(mockProfile));

    const result = await store.dispatch(
      updatePatientProfile({
        id: '1',
        phone: '+9876543210',
        address: '456 New St',
        allergies: ['Peanuts', 'Dairy'],
      })
    );

    expect(result.type).toBe('patient/updateProfile/fulfilled');
    if (result.type === 'patient/updateProfile/fulfilled') {
      expect(result.payload).toEqual(updatedProfile);
    }

    const state = store.getState().patient;
    expect(state.profile).toEqual(updatedProfile);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();

    // Verify API was called correctly
    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining('/patientProfiles/1'),
      expect.objectContaining({
        phone: '+9876543210',
        address: '456 New St',
        allergies: ['Peanuts', 'Dairy'],
        updatedAt: expect.any(String),
      })
    );
  });

  it('should handle profile update failure', async () => {
    const errorMessage = 'Failed to update profile';
    mockedAxios.put.mockRejectedValue(new Error(errorMessage));

    const store = configureStore({
      reducer: {
        patient: patientReducer,
      },
    });

    // Set initial profile
    store.dispatch(setProfile(mockProfile));

    const result = await store.dispatch(
      updatePatientProfile({
        id: '1',
        phone: '+9876543210',
      })
    );

    expect(result.type).toBe('patient/updateProfile/rejected');
    if (result.type === 'patient/updateProfile/rejected') {
      expect(result.error.message).toBe(errorMessage);
    }

    const state = store.getState().patient;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    // Profile should remain unchanged on error
    expect(state.profile).toEqual(mockProfile);
  });

  it('should set loading state during profile update', async () => {
    mockedAxios.put.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: updatedProfile }), 100))
    );

    const store = configureStore({
      reducer: {
        patient: patientReducer,
      },
    });

    store.dispatch(setProfile(mockProfile));

    const updatePromise = store.dispatch(
      updatePatientProfile({
        id: '1',
        phone: '+9876543210',
      })
    );

    // Check loading state
    let state = store.getState().patient;
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();

    await updatePromise;

    // Check final state
    state = store.getState().patient;
    expect(state.isLoading).toBe(false);
  });

  it('should update only specified fields', async () => {
    const partialUpdate = {
      ...mockProfile,
      phone: '+1111111111',
      updatedAt: '2024-01-15T00:00:00Z',
    };

    mockedAxios.put.mockResolvedValue({ data: partialUpdate });

    const store = configureStore({
      reducer: {
        patient: patientReducer,
      },
    });

    store.dispatch(setProfile(mockProfile));

    await store.dispatch(
      updatePatientProfile({
        id: '1',
        phone: '+1111111111',
      })
    );

    const state = store.getState().patient;
    expect(state.profile?.phone).toBe('+1111111111');
    // Other fields should remain unchanged
    expect(state.profile?.address).toBe(mockProfile.address);
    expect(state.profile?.medicalRecordNumber).toBe(mockProfile.medicalRecordNumber);
  });

  it('should update emergency contact information', async () => {
    const updatedWithEmergencyContact = {
      ...mockProfile,
      emergencyContact: {
        name: 'John Doe',
        phone: '+9999999999',
        relationship: 'Parent',
      },
      updatedAt: '2024-01-15T00:00:00Z',
    };

    mockedAxios.put.mockResolvedValue({ data: updatedWithEmergencyContact });

    const store = configureStore({
      reducer: {
        patient: patientReducer,
      },
    });

    store.dispatch(setProfile(mockProfile));

    await store.dispatch(
      updatePatientProfile({
        id: '1',
        emergencyContact: {
          name: 'John Doe',
          phone: '+9999999999',
          relationship: 'Parent',
        },
      })
    );

    const state = store.getState().patient;
    expect(state.profile?.emergencyContact).toEqual({
      name: 'John Doe',
      phone: '+9999999999',
      relationship: 'Parent',
    });
  });
});
