import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import patientReducer from '@/features/patient/patientSlice';
import providerReducer from '@/features/provider/providerSlice';
import uiReducer from '@/features/ui/uiSlice';
import goalsReducer from '@/features/goals/goalsSlice';
import remindersReducer from '@/features/reminders/remindersSlice';
import adminReducer from '@/features/admin/adminSlice';
import adminUserReducer from '@/features/admin/adminUserSlice';
import assignmentReducer from '@/features/assignments/assignmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    provider: providerReducer,
    ui: uiReducer,
    goals: goalsReducer,
    reminders: remindersReducer,
    admin: adminReducer,
    adminUser: adminUserReducer,
    assignments: assignmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


