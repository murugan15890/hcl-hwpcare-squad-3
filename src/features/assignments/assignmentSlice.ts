import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '@/utils/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { User, ProviderAssignment } from '@/types';
import { getArray } from '@/utils/apiHelpers';

interface AssignmentState {
  providers: User[];
  patients: User[];
  assignments: ProviderAssignment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AssignmentState = {
  providers: [],
  patients: [],
  assignments: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProviders = createAsyncThunk(
  'assignments/fetchProviders',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_ROLE('provider'));
    return getArray(response.data);
  }
);

export const fetchPatients = createAsyncThunk(
  'assignments/fetchPatients',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_ROLE('patient'));
    return getArray(response.data);
  }
);

export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.PROVIDER_ASSIGNMENTS.LIST);
    return getArray(response.data);
  }
);

export const fetchAssignmentsByProvider = createAsyncThunk(
  'assignments/fetchByProvider',
  async (providerId: string) => {
    const response = await axiosClient.get(
      API_ENDPOINTS.PROVIDER_ASSIGNMENTS.BY_PROVIDER(providerId)
    );
    return getArray(response.data);
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/create',
  async (
    {
      providerId,
      patientId,
      assignedBy,
      notes,
    }: {
      providerId: string;
      patientId: string;
      assignedBy: string;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Check if assignment already exists
      const existingResponse = await axiosClient.get(
        API_ENDPOINTS.PROVIDER_ASSIGNMENTS.BY_PATIENT(patientId)
      );
      const existingAssignments = getArray(existingResponse.data);
      
      const activeAssignment = existingAssignments.find(
        (a) => a.providerId === providerId && a.status === 'active'
      );

      if (activeAssignment) {
        return rejectWithValue(
          'This patient is already assigned to this provider'
        );
      }

      const response = await axiosClient.post(
        API_ENDPOINTS.PROVIDER_ASSIGNMENTS.CREATE,
        {
          providerId,
          patientId,
          assignedAt: new Date().toISOString(),
          assignedBy,
          status: 'active',
          notes: notes || undefined,
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create assignment'
      );
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignments/delete',
  async (id: string) => {
    await axiosClient.delete(API_ENDPOINTS.PROVIDER_ASSIGNMENTS.DELETE(id));
    return id;
  }
);

export const updateAssignmentStatus = createAsyncThunk(
  'assignments/updateStatus',
  async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
    const response = await axiosClient.put(
      API_ENDPOINTS.PROVIDER_ASSIGNMENTS.UPDATE(id),
      { status }
    );
    return response.data;
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    clearProviders: (state) => {
      state.providers = [];
    },
    clearPatients: (state) => {
      state.patients = [];
    },
    clearAssignments: (state) => {
      state.assignments = [];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch providers
      .addCase(fetchProviders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providers = action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch providers';
      })
      // Fetch patients
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      })
      // Fetch assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch assignments';
      })
      // Fetch assignments by provider
      .addCase(fetchAssignmentsByProvider.fulfilled, (state, action) => {
        state.assignments = action.payload;
      })
      // Create assignment
      .addCase(createAssignment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments.push(action.payload);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Failed to create assignment';
      })
      // Delete assignment
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (a) => a.id !== action.payload
        );
      })
      // Update assignment status
      .addCase(updateAssignmentStatus.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      });
  },
});

export const {
  clearProviders,
  clearPatients,
  clearAssignments,
  setError,
} = assignmentSlice.actions;
export default assignmentSlice.reducer;
