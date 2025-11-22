import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '@/utils/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { Reminder } from '@/types';
import { getArray } from '@/utils/apiHelpers';

interface RemindersState {
  reminders: Reminder[];
  currentReminder: Reminder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RemindersState = {
  reminders: [],
  currentReminder: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchRemindersByUser = createAsyncThunk(
  'reminders/fetchByUser',
  async (userId: string) => {
    const response = await axiosClient.get(API_ENDPOINTS.REMINDERS.BY_USER(userId));
    return getArray(response.data);
  }
);

export const createReminder = createAsyncThunk(
  'reminders/create',
  async (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axiosClient.post(API_ENDPOINTS.REMINDERS.CREATE, reminder);
    return response.data;
  }
);

export const updateReminder = createAsyncThunk(
  'reminders/update',
  async ({ id, ...reminder }: Partial<Reminder> & { id: string }) => {
    const response = await axiosClient.put(API_ENDPOINTS.REMINDERS.UPDATE(id), reminder);
    return response.data;
  }
);

export const deleteReminder = createAsyncThunk(
  'reminders/delete',
  async (id: string) => {
    await axiosClient.delete(API_ENDPOINTS.REMINDERS.DELETE(id));
    return id;
  }
);

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setCurrentReminder: (state, action: PayloadAction<Reminder | null>) => {
      state.currentReminder = action.payload;
    },
    clearReminders: (state) => {
      state.reminders = [];
      state.currentReminder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reminders
      .addCase(fetchRemindersByUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRemindersByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reminders = action.payload;
      })
      .addCase(fetchRemindersByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch reminders';
      })
      // Create reminder
      .addCase(createReminder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReminder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reminders.push(action.payload);
      })
      .addCase(createReminder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create reminder';
      })
      // Update reminder
      .addCase(updateReminder.fulfilled, (state, action) => {
        const index = state.reminders.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reminders[index] = action.payload;
        }
        if (state.currentReminder?.id === action.payload.id) {
          state.currentReminder = action.payload;
        }
      })
      // Delete reminder
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.reminders = state.reminders.filter((r) => r.id !== action.payload);
        if (state.currentReminder?.id === action.payload) {
          state.currentReminder = null;
        }
      });
  },
});

export const { setCurrentReminder, clearReminders } = remindersSlice.actions;
export default remindersSlice.reducer;