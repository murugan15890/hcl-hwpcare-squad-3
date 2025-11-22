import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '@/utils/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { Patient, PatientProfile } from '@/types';
import { getFirstItem, getUsersByRole } from '@/utils/apiHelpers';

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  profile: PatientProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPatientProfile = createAsyncThunk(
  'patient/fetchProfile',
  async (userId: string) => {
    const response = await axiosClient.get(
      API_ENDPOINTS.PATIENT_PROFILES.BY_USER(userId)
    );
    const profiles = Array.isArray(response.data) ? response.data : [response.data];
    return getFirstItem(profiles);
  }
);

export const updatePatientProfile = createAsyncThunk(
  'patient/updateProfile',
  async ({ id, ...profileData }: Partial<PatientProfile> & { id: string }) => {
    const response = await axiosClient.put(
      API_ENDPOINTS.PATIENT_PROFILES.UPDATE(id),
      {
        ...profileData,
        updatedAt: new Date().toISOString(),
      }
    );
    return response.data;
  }
);

export const createPatientProfile = createAsyncThunk(
  'patient/createProfile',
  async (profileData: Omit<PatientProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axiosClient.post(API_ENDPOINTS.PATIENT_PROFILES.CREATE, {
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  }
);

export const fetchPatientUsers = createAsyncThunk(
  'patient/fetchPatientUsers',
  async () => {
    return getUsersByRole('patient');
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload);
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
      state.selectedPatient = action.payload;
    },
    setProfile: (state, action: PayloadAction<PatientProfile | null>) => {
      state.profile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchPatientProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchPatientProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // Update profile
      .addCase(updatePatientProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      // Create profile
      .addCase(createPatientProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPatientProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(createPatientProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create profile';
      })
      // Fetch patient users
      .addCase(fetchPatientUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        // Convert User[] to Patient[] format if needed
        state.patients = action.payload.map((user) => ({
          id: user.id,
          name: user.name,
          dateOfBirth: '', // Will be filled from profile
          email: user.email,
          phone: '', // Will be filled from profile
          medicalRecordNumber: '', // Will be filled from profile
        }));
      })
      .addCase(fetchPatientUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      });
  },
});

export const {
  setPatients,
  addPatient,
  updatePatient,
  setSelectedPatient,
  setProfile,
  setLoading,
  setError,
  clearProfile,
} = patientSlice.actions;
export default patientSlice.reducer;


