import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types';
import axiosClient from '@/utils/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { loginUser as apiLoginUser, getUserByEmail } from '@/utils/apiHelpers';

// Generate fake JWT token
const generateFakeToken = (userId: string, email: string): string => {
  const payload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };
  // Simple base64 encoding (not secure, just for mock)
  return btoa(JSON.stringify(payload));
};

// Load auth state from localStorage on init
const loadAuthFromStorage = (): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> => {
  try {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        user: user as User,
        token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = {
  ...loadAuthFromStorage(),
  isLoading: false,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await apiLoginUser(email, password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Generate fake JWT token
    const token = generateFakeToken(user.id, user.email);
    
    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return { user, token };
  }
);

export const registerPatient = createAsyncThunk(
  'auth/registerPatient',
  async (userData: {
    email: string;
    password: string;
    name: string;
  }) => {
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new patient user
    const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: 'patient',
    };
    
    const response = await axiosClient.post(API_ENDPOINTS.USERS.CREATE, {
      ...newUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    const user = response.data;
    
    // Generate fake JWT token
    const token = generateFakeToken(user.id, user.email);
    
    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return { user, token };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Store in localStorage
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      // Register Patient
      .addCase(registerPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerPatient.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;


