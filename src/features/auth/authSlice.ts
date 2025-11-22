/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/auth/authSlice.ts (snippet)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = { user: any | null; token: string | null };

const initialState: AuthState = { user: null, token: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: any; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
