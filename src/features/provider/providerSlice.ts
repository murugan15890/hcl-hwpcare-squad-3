import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Provider } from '@/types';

interface ProviderState {
  providers: Provider[];
  selectedProvider: Provider | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProviderState = {
  providers: [],
  selectedProvider: null,
  isLoading: false,
  error: null,
};

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
});

export const {
  setProviders,
  addProvider,
  updateProvider,
  setSelectedProvider,
  setLoading: setProviderLoading,
  setError: setProviderError,
} = providerSlice.actions;
export default providerSlice.reducer;


