import { memo, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { VirtualizedList } from '@/components/common/VirtualizedList';

const DashboardPatient = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { patients } = useAppSelector((state) => state.patient);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  // Memoized patient list items
  const renderPatientItem = useCallback(
    (patient: typeof patients[0], index: number) => (
      <div className="border-b border-gray-200 py-3">
        <h4 className="font-semibold text-gray-900">{patient.name}</h4>
        <p className="text-sm text-gray-600">{patient.email}</p>
        <p className="text-xs text-gray-500">MRN: {patient.medicalRecordNumber}</p>
      </div>
    ),
    []
  );

  // Memoized stats
  const stats = useMemo(
    () => [
      { label: 'Total Patients', value: patients.length },
      { label: 'Active Appointments', value: 0 },
      { label: 'Pending Tests', value: 0 },
    ],
    [patients.length]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
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
            <Card key={stat.label}>
              <div className="text-center">
                <p className="text-3xl font-bold text-healthcare-blue">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card title="Patient List">
          {patients.length > 0 ? (
            <VirtualizedList
              items={patients}
              height={400}
              itemHeight={80}
              renderItem={renderPatientItem}
            />
          ) : (
            <p className="text-center text-gray-500 py-8">No patients found</p>
          )}
        </Card>
      </main>
    </div>
  );
});

DashboardPatient.displayName = 'DashboardPatient';

export default DashboardPatient;

