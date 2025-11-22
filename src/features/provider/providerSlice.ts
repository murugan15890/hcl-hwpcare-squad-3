import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '@/utils/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { Provider, User } from '@/types';
import { getArray, getFirstItem } from '@/utils/apiHelpers';

interface ProviderState {
  providers: Provider[];
  providerUsers: User[]; // Users with provider role
  selectedProvider: Provider | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProviderState = {
  providers: [],
  providerUsers: [],
  selectedProvider: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProviders = createAsyncThunk(
  'provider/fetchProviders',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.PROVIDERS.LIST);
    return getArray(response.data);
  }
);

export const fetchProviderUsers = createAsyncThunk(
  'provider/fetchProviderUsers',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_ROLE('provider'));
    return getArray(response.data);
  }
);

export const fetchProviderByUserId = createAsyncThunk(
  'provider/fetchByUserId',
  async (userId: string) => {
    const response = await axiosClient.get(API_ENDPOINTS.PROVIDERS.BY_USER(userId));
    const providers = getArray(response.data);
    return getFirstItem(providers);
  }
);

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    setProviders: (state, action: PayloadAction<Provider[]>) => {
      state.providers = action.payload;
    },
    addProvider: (state, action: PayloadAction<Provider>) => {
      state.providers.push(action.payload);
    },
    updateProvider: (state, action: PayloadAction<Provider>) => {
      const index = state.providers.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.providers[index] = action.payload;
      }
    },
    setSelectedProvider: (state, action: PayloadAction<Provider | null>) => {
      state.selectedProvider = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
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
      // Fetch provider users
      .addCase(fetchProviderUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviderUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providerUsers = action.payload;
      })
      .addCase(fetchProviderUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch provider users';
      })
      // Fetch provider by userId
      .addCase(fetchProviderByUserId.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedProvider = action.payload;
        }
      });
  },
});

export const {
  setProviders,
  addProvider,
  updateProvider,
  setSelectedProvider,
  setLoading,
  setError,
} = providerSlice.actions;
export default providerSlice.reducer;


