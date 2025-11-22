import { memo, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { fetchAssignmentsByProvider } from '@/features/assignments/assignmentSlice';
import { fetchPatientProfile } from '@/features/patient/patientSlice';
import { fetchGoalsByUser } from '@/features/goals/goalsSlice';
import { getUsersByRole } from '@/utils/apiHelpers';
import PatientStatusCard from '@/components/provider/PatientStatusCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ROUTES } from '@/utils/constants';
import { useACL } from '@/hooks/useACL';
import { User, Goal, PatientProfile } from '@/types';
import { useState } from 'react';

const DashboardProvider = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { assignments } = useAppSelector((state) => state.assignments);
  const { profile: patientProfile } = useAppSelector((state) => state.patient);
  const { goals } = useAppSelector((state) => state.goals);
  const { isProvider } = useACL();

  // Store patient data fetched from API
  const [patientUsers, setPatientUsers] = useState<Record<string, User>>({});
  const [patientProfiles, setPatientProfiles] = useState<Record<string, PatientProfile>>({});
  const [patientGoals, setPatientGoals] = useState<Record<string, Goal[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id && isProvider) {
      dispatch(fetchAssignmentsByProvider(user.id));
    }
  }, [user?.id, isProvider, dispatch]);

  // Fetch patient users and their data from mock JSON server
  useEffect(() => {
    const fetchPatientData = async () => {
      if (assignments.length === 0) return;

      setIsLoading(true);
      try {
        const activeAssignments = assignments.filter((a) => a.status === 'active');
        const patientIds = activeAssignments.map((a) => a.patientId);

        // Fetch all patient users
        const allPatients = await getUsersByRole('patient');
        const patientsMap: Record<string, User> = {};
        allPatients.forEach((p) => {
          if (patientIds.includes(p.id)) {
            patientsMap[p.id] = p;
          }
        });
        setPatientUsers(patientsMap);

        // Fetch profiles and goals for each patient
        const profilesMap: Record<string, PatientProfile> = {};
        const goalsMap: Record<string, Goal[]> = {};

        for (const patientId of patientIds) {
          try {
            // Fetch profile
            const profileResponse = await dispatch(
              fetchPatientProfile(patientId)
            ).unwrap();
            if (profileResponse) {
              profilesMap[patientId] = profileResponse;
            }

            // Fetch goals
            const goalsResponse = await dispatch(fetchGoalsByUser(patientId)).unwrap();
            if (goalsResponse) {
              goalsMap[patientId] = goalsResponse;
            }
          } catch (error) {
            console.error(`Failed to fetch data for patient ${patientId}:`, error);
          }
        }

        setPatientProfiles(profilesMap);
        setPatientGoals(goalsMap);
      } catch (error) {
        console.error('Failed to fetch patient data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [assignments, dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  }, [dispatch, navigate]);

  const assignedPatients = useMemo(() => {
    const activeAssignments = assignments.filter((a) => a.status === 'active');
    return activeAssignments
      .map((assignment) => {
        const patientUser = patientUsers[assignment.patientId];
        if (!patientUser) return null;

        return {
          user: patientUser,
          profile: patientProfiles[assignment.patientId],
          goals: patientGoals[assignment.patientId] || [],
          assignment,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [assignments, patientUsers, patientProfiles, patientGoals]);

  const handleViewDetails = useCallback(
    (patientId: string) => {
      navigate(`/provider/patient/${patientId}`);
    },
    [navigate]
  );

  const stats = useMemo(
    () => [
      { label: 'Assigned Patients', value: assignedPatients.length },
      {
        label: 'Active Assignments',
        value: assignments.filter((a) => a.status === 'active').length,
      },
      {
        label: 'Total Patients',
        value: assignedPatients.length,
      },
    ],
    [assignedPatients.length, assignments]
  );

  if (!isProvider) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <p className="text-red-600">Access denied. Providers only.</p>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="provider">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-healthcare-blue">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Assigned Patients</h2>
            {isLoading ? (
              <div className="text-center py-8">Loading patient data...</div>
            ) : assignedPatients.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No patients assigned yet. Contact an administrator to get patients assigned.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedPatients.map(({ user: patientUser, profile, goals: patientGoalsList }) => (
                  <PatientStatusCard
                    key={patientUser.id}
                    patient={patientUser}
                    profile={profile}
                    goals={patientGoalsList}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
});

DashboardProvider.displayName = 'DashboardProvider';

export default DashboardProvider;


