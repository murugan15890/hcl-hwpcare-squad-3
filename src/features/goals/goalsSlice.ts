import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '@/utils/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { Goal } from '@/types';
import { getArray } from '@/utils/apiHelpers';

interface GoalsState {
  goals: Goal[];
  currentGoal: Goal | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  goals: [],
  currentGoal: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchGoalsByUser = createAsyncThunk(
  'goals/fetchByUser',
  async (userId: string) => {
    const response = await axiosClient.get(API_ENDPOINTS.GOALS.BY_USER(userId));
    return getArray(response.data);
  }
);

export const createGoal = createAsyncThunk(
  'goals/create',
  async (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axiosClient.post(API_ENDPOINTS.GOALS.CREATE, goal);
    return response.data;
  }
);

export const updateGoal = createAsyncThunk(
  'goals/update',
  async ({ id, ...goal }: Partial<Goal> & { id: string }) => {
    const response = await axiosClient.put(API_ENDPOINTS.GOALS.UPDATE(id), goal);
    return response.data;
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/delete',
  async (id: string) => {
    await axiosClient.delete(API_ENDPOINTS.GOALS.DELETE(id));
    return id;
  }
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setCurrentGoal: (state, action: PayloadAction<Goal | null>) => {
      state.currentGoal = action.payload;
    },
    clearGoals: (state) => {
      state.goals = [];
      state.currentGoal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchGoalsByUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoalsByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoalsByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch goals';
      })
      // Create goal
      .addCase(createGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals.push(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create goal';
      })
      // Update goal
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
        if (state.currentGoal?.id === action.payload.id) {
          state.currentGoal = action.payload;
        }
      })
      // Delete goal
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g.id !== action.payload);
        if (state.currentGoal?.id === action.payload) {
          state.currentGoal = null;
        }
      });
  },
});

export const { setCurrentGoal, clearGoals } = goalsSlice.actions;
export default goalsSlice.reducer;