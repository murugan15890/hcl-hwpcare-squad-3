import { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useACL } from '@/hooks/useACL';
import {
  fetchRemindersByUser,
  updateReminder,
  deleteReminder,
  setCurrentReminder,
} from '@/features/reminders/remindersSlice';
import ReminderCard from '@/components/reminders/ReminderCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { VirtualizedList } from '@/components/common/VirtualizedList';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Reminder } from '@/types';
import { getToday } from '@/utils/dateUtils';

const Reminders = memo(() => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { reminders, isLoading, error } = useAppSelector((state) => state.reminders);
  const { isPatient } = useACL();

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'overdue'>('all');

  useEffect(() => {
    if (user?.id && isPatient) {
      dispatch(fetchRemindersByUser(user.id));
    }
  }, [user?.id, isPatient, dispatch]);

  const filteredReminders = useMemo(() => {
    const today = new Date();
    switch (filter) {
      case 'upcoming':
        return reminders.filter(
          (r) => !r.completed && new Date(r.scheduledDate) >= today
        );
      case 'completed':
        return reminders.filter((r) => r.completed);
      case 'overdue':
        return reminders.filter(
          (r) => !r.completed && new Date(r.scheduledDate) < today
        );
      default:
        return reminders;
    }
  }, [reminders, filter]);

  const handleComplete = useCallback(
    async (id: string) => {
      await dispatch(updateReminder({ id, completed: true }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this reminder?')) {
        await dispatch(deleteReminder(id));
      }
    },
    [dispatch]
  );

  const renderReminderItem = useCallback(
    (reminder: Reminder, index: number) => (
      <ReminderCard
        key={reminder.id}
        reminder={reminder}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
    ),
    [handleComplete, handleDelete]
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
          <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-2">
            {(['all', 'upcoming', 'completed', 'overdue'] as const).map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterOption)}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Button>
            ))}
          </div>
        </Card>

        {/* Reminders List */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Reminders</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading reminders...</div>
          ) : filteredReminders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No reminders found</div>
          ) : (
            <div className="w-full">
              <VirtualizedList
                items={filteredReminders}
                height={600}
                itemHeight={220}
                renderItem={renderReminderItem}
                className="w-full"
              />
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
});

Reminders.displayName = 'Reminders';

export default Reminders;
