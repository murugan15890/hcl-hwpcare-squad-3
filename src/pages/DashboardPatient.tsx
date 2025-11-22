import { memo, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { fetchGoalsByUser } from '@/features/goals/goalsSlice';
import { fetchRemindersByUser } from '@/features/reminders/remindersSlice';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ROUTES } from '@/utils/constants';
import { useACL } from '@/hooks/useACL';
import { getToday, isToday, formatDateReadable } from '@/utils/dateUtils';
import { healthTips } from '@/data/healthTips';
import { Goal, Reminder } from '@/types';

const DashboardPatient = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { goals } = useAppSelector((state) => state.goals);
  const { reminders } = useAppSelector((state) => state.reminders);
  const { isPatient } = useACL();

  useEffect(() => {
    if (user?.id && isPatient) {
      dispatch(fetchGoalsByUser(user.id));
      dispatch(fetchRemindersByUser(user.id));
    }
  }, [user?.id, isPatient, dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  }, [dispatch, navigate]);

  // Today's Goals with Progress
  const todayGoals = useMemo(() => {
    return goals.filter((g) => isToday(g.date));
  }, [goals]);

  // Wellness Summary Calculations
  const wellnessSummary = useMemo(() => {
    const completedGoals = todayGoals.filter((g) => g.completed || g.current >= g.target);
    const totalProgress = todayGoals.reduce((sum, g) => {
      const progress = Math.min((g.current / g.target) * 100, 100);
      return sum + progress;
    }, 0);
    const averageProgress =
      todayGoals.length > 0 ? Math.round(totalProgress / todayGoals.length) : 0;

    return {
      totalGoals: todayGoals.length,
      completedGoals: completedGoals.length,
      averageProgress,
      completionRate:
        todayGoals.length > 0
          ? Math.round((completedGoals.length / todayGoals.length) * 100)
          : 0,
    };
  }, [todayGoals]);

  // Preventive Care Reminders (upcoming checkups, appointments, etc.)
  const preventiveReminders = useMemo(() => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    return reminders
      .filter((r) => !r.completed)
      .filter((r) => {
        const reminderDate = new Date(r.scheduledDate);
        return reminderDate >= today && reminderDate <= nextMonth;
      })
      .filter((r) => r.type === 'checkup' || r.type === 'appointment' || r.type === 'general')
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 5);
  }, [reminders]);

  // All Upcoming Reminders (next 7 days, not completed)
  const upcomingReminders = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return reminders
      .filter((r) => !r.completed)
      .filter((r) => {
        const reminderDate = new Date(r.scheduledDate);
        return reminderDate >= today && reminderDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 5);
  }, [reminders]);

  // Health Tip of the Day
  const healthTip = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return healthTips[dayOfYear % healthTips.length];
  }, []);

  // Get goal type display name
  const getGoalTypeLabel = useCallback((type: Goal['type']) => {
    const labels: Record<Goal['type'], string> = {
      sleep: 'Sleep',
      steps: 'Steps',
      water: 'Water',
      exercise: 'Exercise',
      medication: 'Medication',
    };
    return labels[type];
  }, []);

  // Get goal icon
  const getGoalIcon = useCallback((type: Goal['type']) => {
    const icons: Record<Goal['type'], string> = {
      sleep: '😴',
      steps: '🚶',
      water: '💧',
      exercise: '💪',
      medication: '💊',
    };
    return icons[type];
  }, []);

  // Calculate progress percentage
  const getProgressPercentage = useCallback((goal: Goal) => {
    return Math.min(Math.round((goal.current / goal.target) * 100), 100);
  }, []);

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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PROFILE)}>
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Wellness Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-healthcare-blue">
                  {wellnessSummary.totalGoals}
                </p>
                <p className="text-sm text-gray-600 mt-2">Today's Goals</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {wellnessSummary.completedGoals}
                </p>
                <p className="text-sm text-gray-600 mt-2">Completed</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {wellnessSummary.averageProgress}%
                </p>
                <p className="text-sm text-gray-600 mt-2">Average Progress</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {wellnessSummary.completionRate}%
                </p>
                <p className="text-sm text-gray-600 mt-2">Completion Rate</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Wellness Goals Progress */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Today's Wellness Goals</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(ROUTES.GOALS)}
                >
                  Manage Goals
                </Button>
              </div>
              {todayGoals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No goals set for today</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(ROUTES.GOALS)}
                  >
                    Add Goals
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayGoals.map((goal) => {
                    const progress = getProgressPercentage(goal);
                    const isCompleted = goal.completed || goal.current >= goal.target;
                    return (
                      <div
                        key={goal.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getGoalIcon(goal.type)}</span>
                            <div>
                              <p className="font-medium text-gray-900">
                                {getGoalTypeLabel(goal.type)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {goal.current} / {goal.target} {goal.unit}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isCompleted
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              isCompleted
                                ? 'bg-green-600'
                                : progress >= 75
                                ? 'bg-blue-600'
                                : progress >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Health Tip of the Day */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Health Tip of the Day</h2>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                <p className="text-gray-900 font-medium mb-2">{healthTip.title}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{healthTip.description}</p>
                <span className="inline-block mt-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {healthTip.category}
                </span>
              </div>
            </Card>
          </div>

          {/* Preventive Care Reminders */}
          {preventiveReminders.length > 0 && (
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Preventive Care Reminders</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(ROUTES.REMINDERS)}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {preventiveReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Upcoming: {reminder.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Scheduled for {formatDateReadable(reminder.scheduledDate)}
                        {reminder.scheduledTime && ` at ${reminder.scheduledTime}`}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ml-4 ${
                        reminder.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : reminder.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {reminder.priority}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* All Upcoming Reminders */}
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Reminders</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.REMINDERS)}
              >
                View All
              </Button>
            </div>
            {upcomingReminders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No upcoming reminders</p>
            ) : (
              <div className="space-y-3">
                {upcomingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{reminder.title}</p>
                      <p className="text-sm text-gray-600">{reminder.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateReadable(reminder.scheduledDate)}
                        {reminder.scheduledTime && ` at ${reminder.scheduledTime}`}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        reminder.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : reminder.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {reminder.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.PROFILE)}
                className="w-full"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.GOALS)}
                className="w-full"
              >
                Track Goals
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.REMINDERS)}
                className="w-full"
              >
                Manage Reminders
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.PROFILE)}
                className="w-full"
              >
                View Profile
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
});

DashboardPatient.displayName = 'DashboardPatient';

export default DashboardPatient;

