import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '@/utils/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { User, ProviderAssignment, Provider } from '@/types';
import { getArray, getFirstItem } from '@/utils/apiHelpers';

interface AdminState {
  users: User[];
  patients: User[];
  providers: User[];
  providerDetails: Provider[];
  assignments: ProviderAssignment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  patients: [],
  providers: [],
  providerDetails: [],
  assignments: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.LIST);
    return getArray(response.data);
  }
);

export const fetchUsersByRole = createAsyncThunk(
  'admin/fetchUsersByRole',
  async (role: string) => {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_ROLE(role));
    return getArray(response.data);
  }
);

export const fetchPatients = createAsyncThunk(
  'admin/fetchPatients',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_ROLE('patient'));
    return getArray(response.data);
  }
);

export const fetchProviders = createAsyncThunk(
  'admin/fetchProviders',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_ROLE('provider'));
    return getArray(response.data);
  }
);

export const fetchProviderDetails = createAsyncThunk(
  'admin/fetchProviderDetails',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.PROVIDERS.LIST);
    return getArray(response.data);
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axiosClient.post(API_ENDPOINTS.USERS.CREATE, {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  }
);

export const fetchAssignments = createAsyncThunk(
  'admin/fetchAssignments',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.PROVIDER_ASSIGNMENTS.LIST);
    return getArray(response.data);
  }
);

export const createAssignment = createAsyncThunk(
  'admin/createAssignment',
  async (assignment: Omit<ProviderAssignment, 'id' | 'assignedAt'>) => {
    const response = await axiosClient.post(
      API_ENDPOINTS.PROVIDER_ASSIGNMENTS.CREATE,
      {
        ...assignment,
        assignedAt: new Date().toISOString(),
      }
    );
    return response.data;
  }
);

export const deleteAssignment = createAsyncThunk(
  'admin/deleteAssignment',
  async (id: string) => {
    await axiosClient.delete(API_ENDPOINTS.PROVIDER_ASSIGNMENTS.DELETE(id));
    return id;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
    },
    clearPatients: (state) => {
      state.patients = [];
    },
    clearProviders: (state) => {
      state.providers = [];
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
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Fetch users by role
      .addCase(fetchUsersByRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersByRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersByRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
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
      // Fetch provider details
      .addCase(fetchProviderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providerDetails = action.payload;
      })
      .addCase(fetchProviderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch provider details';
      })
      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        if (action.payload.role === 'patient') {
          state.patients.push(action.payload);
        } else if (action.payload.role === 'provider') {
          state.providers.push(action.payload);
        }
      })
      // Fetch assignments
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.assignments = action.payload;
      })
      // Create assignment
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.assignments.push(action.payload);
      })
      // Delete assignment
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter((a) => a.id !== action.payload);
      });
  },
});

export const {
  clearUsers,
  clearPatients,
  clearProviders,
  clearAssignments,
  setError,
} = adminSlice.actions;
export default adminSlice.reducer;