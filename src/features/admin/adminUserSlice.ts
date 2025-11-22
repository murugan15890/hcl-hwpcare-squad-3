import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '@/utils/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { User, UserRole } from '@/types';
import { getArray } from '@/utils/apiHelpers';

interface AdminUserState {
  users: User[];
  filteredUsers: User[];
  selectedRole: UserRole | 'all';
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminUserState = {
  users: [],
  filteredUsers: [],
  selectedRole: 'all',
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  'adminUser/fetchAll',
  async () => {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.LIST);
    return getArray(response.data);
  }
);

export const fetchUsersByRole = createAsyncThunk(
  'adminUser/fetchByRole',
  async (role: UserRole) => {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_ROLE(role));
    return getArray(response.data);
  }
);

export const createAdminUser = createAsyncThunk(
  'adminUser/createAdmin',
  async (userData: {
    email: string;
    password: string;
    name: string;
  }) => {
    const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: 'admin',
    };

    const response = await axiosClient.post(API_ENDPOINTS.USERS.CREATE, {
      ...newUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return response.data;
  }
);

export const createProviderUser = createAsyncThunk(
  'adminUser/createProvider',
  async (userData: {
    email: string;
    password: string;
    name: string;
  }) => {
    const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: 'provider',
    };

    const response = await axiosClient.post(API_ENDPOINTS.USERS.CREATE, {
      ...newUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'adminUser/delete',
  async (id: string) => {
    await axiosClient.delete(API_ENDPOINTS.USERS.DELETE(id));
    return id;
  }
);

const adminUserSlice = createSlice({
  name: 'adminUser',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<UserRole | 'all'>) => {
      state.selectedRole = action.payload;
      if (action.payload === 'all') {
        state.filteredUsers = state.users;
      } else {
        state.filteredUsers = state.users.filter(
          (user) => user.role === action.payload
        );
      }
    },
    filterUsers: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      if (state.selectedRole === 'all') {
        state.filteredUsers = state.users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
      } else {
        state.filteredUsers = state.users.filter(
          (user) =>
            user.role === state.selectedRole &&
            (user.name.toLowerCase().includes(searchTerm) ||
              user.email.toLowerCase().includes(searchTerm))
        );
      }
    },
    clearUsers: (state) => {
      state.users = [];
      state.filteredUsers = [];
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
        state.filteredUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Fetch users by role
      .addCase(fetchUsersByRole.fulfilled, (state, action) => {
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      // Create admin
      .addCase(createAdminUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
        if (
          state.selectedRole === 'all' ||
          state.selectedRole === 'admin'
        ) {
          state.filteredUsers.push(action.payload);
        }
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create admin user';
      })
      // Create provider
      .addCase(createProviderUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProviderUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
        if (
          state.selectedRole === 'all' ||
          state.selectedRole === 'provider'
        ) {
          state.filteredUsers.push(action.payload);
        }
      })
      .addCase(createProviderUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create provider user';
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.filteredUsers = state.filteredUsers.filter(
          (user) => user.id !== action.payload
        );
      });
  },
});

export const { setSelectedRole, filterUsers, clearUsers } =
  adminUserSlice.actions;
export default adminUserSlice.reducer;
