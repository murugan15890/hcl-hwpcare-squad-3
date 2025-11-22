import { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useACL } from '@/hooks/useACL';
import {
  fetchGoalsByUser,
  createGoal,
  updateGoal,
  deleteGoal,
  setCurrentGoal,
} from '@/features/goals/goalsSlice';
import GoalCard from '@/components/goals/GoalCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { VirtualizedList } from '@/components/common/VirtualizedList';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Goal } from '@/types';
import { getToday } from '@/utils/dateUtils';

interface GoalFormData {
  type: Goal['type'];
  target: number;
  current: number;
  unit: string;
  date: string;
}

const GoalTracker = memo(() => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { goals, currentGoal, isLoading, error } = useAppSelector((state) => state.goals);
  const { isPatient } = useACL();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<GoalFormData>({
    type: 'steps',
    target: 10000,
    current: 0,
    unit: 'steps',
    date: getToday(),
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof GoalFormData, string>>>({});

  useEffect(() => {
    if (user?.id && isPatient) {
      dispatch(fetchGoalsByUser(user.id));
    }
  }, [user?.id, isPatient, dispatch]);

  useEffect(() => {
    if (currentGoal) {
      setFormData({
        type: currentGoal.type,
        target: currentGoal.target,
        current: currentGoal.current,
        unit: currentGoal.unit,
        date: currentGoal.date,
      });
      setShowForm(true);
    }
  }, [currentGoal]);

  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof GoalFormData, string>> = {};

    if (formData.target <= 0) {
      errors.target = 'Target must be greater than 0';
    }

    if (formData.current < 0) {
      errors.current = 'Current value cannot be negative';
    }

    if (formData.current > formData.target * 2) {
      errors.current = 'Current value seems unrealistic';
    }

    if (!formData.unit.trim()) {
      errors.unit = 'Unit is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm() || !user?.id) {
        return;
      }

      try {
        const goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
          userId: user.id,
          type: formData.type,
          target: formData.target,
          current: formData.current,
          unit: formData.unit,
          date: formData.date,
          completed: formData.current >= formData.target,
        };

        if (currentGoal?.id) {
          await dispatch(updateGoal({ id: currentGoal.id, ...goalData })).unwrap();
        } else {
          await dispatch(createGoal(goalData)).unwrap();
        }

        setShowForm(false);
        setFormData({
          type: 'steps',
          target: 10000,
          current: 0,
          unit: 'steps',
          date: getToday(),
        });
        dispatch(setCurrentGoal(null));
        setFormErrors({});
      } catch (err) {
        console.error('Failed to save goal:', err);
      }
    },
    [formData, user?.id, currentGoal, dispatch, validateForm]
  );

  const handleEdit = useCallback(
    (goal: Goal) => {
      dispatch(setCurrentGoal(goal));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this goal?')) {
        await dispatch(deleteGoal(id));
      }
    },
    [dispatch]
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setFormData({
      type: 'steps',
      target: 10000,
      current: 0,
      unit: 'steps',
      date: getToday(),
    });
    dispatch(setCurrentGoal(null));
    setFormErrors({});
  }, [dispatch]);

  const todayGoals = useMemo(
    () => goals.filter((g) => g.date === getToday()),
    [goals]
  );

  const renderGoalItem = useCallback(
    (goal: Goal, index: number) => (
      <GoalCard
        key={goal.id}
        goal={goal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
    [handleEdit, handleDelete]
  );

  const getDefaultUnit = useCallback((type: Goal['type']): string => {
    const units: Record<Goal['type'], string> = {
      sleep: 'hours',
      steps: 'steps',
      water: 'glasses',
      exercise: 'minutes',
      medication: 'doses',
    };
    return units[type];
  }, []);

  const handleTypeChange = useCallback(
    (type: Goal['type']) => {
      setFormData((prev) => ({
        ...prev,
        type,
        unit: getDefaultUnit(type),
        target: type === 'sleep' ? 8 : type === 'water' ? 8 : type === 'steps' ? 10000 : 30,
      }));
    },
    [getDefaultUnit]
  );

  if (!isPatient) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <p className="text-red-600">Access denied. Patients only.</p>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="patient">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Goal Tracker</h1>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>Add New Goal</Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {currentGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value as Goal['type'])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue"
                  >
                    <option value="sleep">Sleep</option>
                    <option value="steps">Steps</option>
                    <option value="water">Water</option>
                    <option value="exercise">Exercise</option>
                    <option value="medication">Medication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    max={getToday()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.target}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        target: Number(e.target.value),
                      }))
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-healthcare-blue ${
                      formErrors.target ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.target && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.target}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.current}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        current: Number(e.target.value),
                      }))
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-healthcare-blue ${
                      formErrors.current ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.current && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.current}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, unit: e.target.value }))
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-healthcare-blue ${
                      formErrors.unit ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.unit && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.unit}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  {currentGoal ? 'Update Goal' : 'Create Goal'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {todayGoals.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Today's Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">All Goals</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No goals found</div>
          ) : (
            <div className="w-full">
              <VirtualizedList
                items={goals}
                height={600}
                itemHeight={220}
                renderItem={renderGoalItem}
                className="w-full"
              />
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
});

GoalTracker.displayName = 'GoalTracker';

export default GoalTracker;
