import { configureStore } from '@reduxjs/toolkit';
import goalsReducer, {
  createGoal,
  updateGoal,
  setCurrentGoal,
} from '../goalsSlice';
import axiosClient from '@/utils/axiosClient';
import type { Goal } from '@/types';

// Mock axios client
jest.mock('@/utils/axiosClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAxios = axiosClient as jest.Mocked<typeof axiosClient>;

describe('goalsSlice - Add and Edit Goals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGoal: Goal = {
    id: '1',
    userId: 'user1',
    type: 'steps',
    target: 10000,
    current: 5000,
    unit: 'steps',
    date: '2024-01-15',
    completed: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  };

  const newGoalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
    userId: 'user1',
    type: 'sleep',
    target: 8,
    current: 7,
    unit: 'hours',
    date: '2024-01-16',
    completed: false,
  };

  describe('Create Goal', () => {
    it('should successfully create a new goal', async () => {
      const createdGoal: Goal = {
        ...newGoalData,
        id: '2',
        createdAt: '2024-01-16T00:00:00Z',
        updatedAt: '2024-01-16T00:00:00Z',
      };

      mockedAxios.post.mockResolvedValue({ data: createdGoal });

      const store = configureStore({
        reducer: {
          goals: goalsReducer,
        },
      });

      const result = await store.dispatch(createGoal(newGoalData));

      expect(result.type).toBe('goals/create/fulfilled');
      if (result.type === 'goals/create/fulfilled') {
        expect(result.payload).toEqual(createdGoal);
      }

      const state = store.getState().goals;
      expect(state.goals).toContainEqual(createdGoal);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();

      // Verify API was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/goals'),
        newGoalData
      );
    });

    it('should handle goal creation failure', async () => {
      const errorMessage = 'Failed to create goal';
      mockedAxios.post.mockRejectedValue(new Error(errorMessage));

      const store = configureStore({
        reducer: {
          goals: goalsReducer,
        },
      });

      const result = await store.dispatch(createGoal(newGoalData));

      expect(result.type).toBe('goals/create/rejected');
      if (result.type === 'goals/create/rejected') {
        expect(result.error.message).toBe(errorMessage);
      }

      const state = store.getState().goals;
      expect(state.goals).toHaveLength(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should set loading state during goal creation', async () => {
      mockedAxios.post.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    ...newGoalData,
                    id: '2',
                    createdAt: '2024-01-16T00:00:00Z',
                    updatedAt: '2024-01-16T00:00:00Z',
                  },
                }),
              100
            )
          )
      );

      const store = configureStore({
        reducer: {
          goals: goalsReducer,
        },
      });

      const createPromise = store.dispatch(createGoal(newGoalData));

      // Check loading state
      let state = store.getState().goals;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      await createPromise;

      // Check final state
      state = store.getState().goals;
      expect(state.isLoading).toBe(false);
    });

    it('should create goal with completed status when current >= target', async () => {
      const completedGoalData = {
        ...newGoalData,
        current: 8,
        target: 8,
      };

      const createdGoal: Goal = {
        ...completedGoalData,
        id: '2',
        completed: true,
        createdAt: '2024-01-16T00:00:00Z',
        updatedAt: '2024-01-16T00:00:00Z',
      };

      mockedAxios.post.mockResolvedValue({ data: createdGoal });

      const store = configureStore({
        reducer: {
          goals: goalsReducer,
        },
      });

      await store.dispatch(createGoal(completedGoalData));

      const state = store.getState().goals;
      expect(state.goals[0].completed).toBe(true);
    });
  });

  describe('Update Goal', () => {
    it('should successfully update an existing goal', async () => {
      const updatedGoal: Goal = {
        ...mockGoal,
        current: 8000,
        completed: false,
        updatedAt: '2024-01-16T00:00:00Z',
      };

      mockedAxios.put.mockResolvedValue({ data: updatedGoal });

      const store = configureStore({
        reducer: {
          goals: goalsReducer,
        },
      });

      // Set initial goal
      store.dispatch({
        type: 'goals/fetchByUser/fulfilled',
        payload: [mockGoal],
      });

      const result = await store.dispatch(
        updateGoal({
          id: '1',
          current: 8000,
        })
      );

      expect(result.type).toBe('goals/update/fulfilled');
      if (result.type === 'goals/update/fulfilled') {
        expect(result.payload).toEqual(updatedGoal);
      }

      const state = store.getState().goals;
      const updatedGoalInState = state.goals.find((g) => g.id === '1');
      expect(updatedGoalInState?.current).toBe(8000);
      expect(state.error).toBeNull();

      // Verify API was called correctly
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/goals/1'),
        { current: 8000 }
      );
    });

    it('should handle goal update failure', async () => {
      const errorMessage = 'Failed to update goal';
      mockedAxios.put.mockRejectedValue(new Error(errorMessage));

      const store = configureStore({
        reducer: {
          goals: goalsReducer,
        },
      });

      // Set initial goal
      store.dispatch({
        type: 'goals/fetchByUser/fulfilled',
        payload: [mockGoal],
      });

      const result = await store.dispatch(
        updateGoal({
          id: '1',
          current: 8000,
        })
      );

      expect(result.type).toBe('goals/update/rejected');
      if (result.type === 'goals/update/rejected') {
        expect(result.error.message).toBe(errorMessage);
      }

      const state = store.getState().goals;
      // Goal should remain unchanged on error
      expect(state.goals[0].current).toBe(5000);
    });

    it('should update currentGoal when editing the current goal', async () => {
      const updatedGoal: Goal = {
        ...mockGoal,
        current: 9000,
        updatedAt: '2024-01-16T00:00:00Z',
      };

      mockedAxios.put.mockResolvedValue({ data: updatedGoal });

      const store = configureStore({
        reducer: {
          goals: goalsReducer,
        },
      });

      // Set initial goal and current goal
      store.dispatch({
        type: 'goals/fetchByUser/fulfilled',
        payload: [mockGoal],
      });
      store.dispatch(setCurrentGoal(mockGoal));

      await store.dispatch(
        updateGoal({
          id: '1',
          current: 9000,
        })
      );

      const state = store.getState().goals;
      expect(state.currentGoal?.current).toBe(9000);
    });

    it('should mark goal as completed when current >= target', async () => {
      const updatedGoal: Goal = {
        ...mockGoal,
        current: 10000,
        target: 10000,
        completed: true,
        updatedAt: '2024-01-16T00:00:00Z',
      };

      mockedAxios.put.mockResolvedValue({ data: updatedGoal });

      const store = configureStore({
        reducer: {
          goals: goalsReducer,
        },
      });

      store.dispatch({
        type: 'goals/fetchByUser/fulfilled',
        payload: [mockGoal],
      });

      await store.dispatch(
        updateGoal({
          id: '1',
          current: 10000,
        })
      );

      const state = store.getState().goals;
      const updatedGoalInState = state.goals.find((g) => g.id === '1');
      expect(updatedGoalInState?.completed).toBe(true);
      expect(updatedGoalInState?.current).toBe(10000);
    });

    it('should update multiple goal fields at once', async () => {
      const updatedGoal: Goal = {
        ...mockGoal,
        type: 'exercise',
        target: 30,
        current: 25,
        unit: 'minutes',
        updatedAt: '2024-01-16T00:00:00Z',
      };

      mockedAxios.put.mockResolvedValue({ data: updatedGoal });

      const store = configureStore({
        reducer: {
          goals: goalsReducer,
        },
      });

      store.dispatch({
        type: 'goals/fetchByUser/fulfilled',
        payload: [mockGoal],
      });

      await store.dispatch(
        updateGoal({
          id: '1',
          type: 'exercise',
          target: 30,
          current: 25,
          unit: 'minutes',
        })
      );

      const state = store.getState().goals;
      const updatedGoalInState = state.goals.find((g) => g.id === '1');
      expect(updatedGoalInState?.type).toBe('exercise');
      expect(updatedGoalInState?.target).toBe(30);
      expect(updatedGoalInState?.current).toBe(25);
      expect(updatedGoalInState?.unit).toBe('minutes');
    });
  });

  describe('Goal Types', () => {
    it.each([
      ['sleep'],
      ['steps'],
      ['water'],
      ['exercise'],
      ['medication'],
    ])('should create goal of type %s', async (type) => {
      const goalData = {
        ...newGoalData,
        type: type as Goal['type'],
      };

      const createdGoal: Goal = {
        ...goalData,
        id: `goal-${type}`,
        createdAt: '2024-01-16T00:00:00Z',
        updatedAt: '2024-01-16T00:00:00Z',
      };

      mockedAxios.post.mockResolvedValue({ data: createdGoal });

      const store = configureStore({
        reducer: {
          goals: goalsReducer,
        },
      });

      await store.dispatch(createGoal(goalData));

      const state = store.getState().goals;
      expect(state.goals[0].type).toBe(type);
    });
  });
});
