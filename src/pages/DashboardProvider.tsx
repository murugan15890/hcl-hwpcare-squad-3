import { memo, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { setAssignedPatients } from '@/features/provider/providerSlice';
import type { Patient } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// Lazy load VirtualizedList for better performance
const VirtualizedList = lazy(() =>
  import('@/components/common/VirtualizedList').then((module) => ({
    default: module.VirtualizedList as typeof module.VirtualizedList,
  }))
);

// Loading fallback for VirtualizedList
const VirtualizedListFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-blue mx-auto mb-2" />
      <p className="text-sm text-gray-500">Loading patients...</p>
    </div>
  </div>
);

// Mock patient data
const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    dateOfBirth: '1985-03-15',
    email: 'john.smith@example.com',
    phone: '555-0101',
    medicalRecordNumber: 'MRN-001234',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    dateOfBirth: '1990-07-22',
    email: 'sarah.johnson@example.com',
    phone: '555-0102',
    medicalRecordNumber: 'MRN-001235',
  },
  {
    id: '3',
    name: 'Michael Brown',
    dateOfBirth: '1978-11-08',
    email: 'michael.brown@example.com',
    phone: '555-0103',
    medicalRecordNumber: 'MRN-001236',
  },
  {
    id: '4',
    name: 'Emily Davis',
    dateOfBirth: '1992-05-30',
    email: 'emily.davis@example.com',
    phone: '555-0104',
    medicalRecordNumber: 'MRN-001237',
  },
  {
    id: '5',
    name: 'David Wilson',
    dateOfBirth: '1988-09-12',
    email: 'david.wilson@example.com',
    phone: '555-0105',
    medicalRecordNumber: 'MRN-001238',
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    dateOfBirth: '1983-12-25',
    email: 'lisa.anderson@example.com',
    phone: '555-0106',
    medicalRecordNumber: 'MRN-001239',
  },
  {
    id: '7',
    name: 'Robert Taylor',
    dateOfBirth: '1975-04-18',
    email: 'robert.taylor@example.com',
    phone: '555-0107',
    medicalRecordNumber: 'MRN-001240',
  },
  {
    id: '8',
    name: 'Jennifer Martinez',
    dateOfBirth: '1995-08-03',
    email: 'jennifer.martinez@example.com',
    phone: '555-0108',
    medicalRecordNumber: 'MRN-001241',
  },
];

const DashboardProvider = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { assignedPatients, selectedProvider } = useAppSelector(
    (state) => state.provider
  );

  // Initialize with mock data if no patients are assigned
  useEffect(() => {
    if (assignedPatients.length === 0) {
      dispatch(setAssignedPatients(MOCK_PATIENTS));
    }
  }, [dispatch, assignedPatients.length]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleViewPatient = useCallback(
    (patient: Patient) => {
      navigate(`/patients/${patient.id}`);
    },
    [navigate]
  );

  const renderPatientItem = useCallback(
    (patient: Patient, _index: number) => (
      <div className="border-b border-gray-200 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{patient.name}</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-gray-400">📧</span>
                {patient.email}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-gray-400">📞</span>
                {patient.phone}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  MRN: {patient.medicalRecordNumber}
                </span>
                <span className="text-xs text-gray-500">
                  DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewPatient(patient)}
              className="whitespace-nowrap"
            >
              View
            </Button>
          </div>
        </div>
      </div>
    ),
    [handleViewPatient]
  );

  const stats = useMemo(
    () => [
      { label: 'Assigned Patients', value: assignedPatients.length },
      { label: 'Today Appointments', value: 0 },
    ],
    [assignedPatients.length]
  );

  return (
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
            <Card key={stat.label}>
              <div className="text-center">
                <p className="text-3xl font-bold text-healthcare-blue">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card title="Assigned Patients">
          <div className="mb-4">
            {selectedProvider ? (
              <p className="text-sm text-gray-600">
                Showing patients for:{' '}
                <span className="font-semibold text-gray-900">
                  {selectedProvider.name} ({selectedProvider.specialty})
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                {/* Your assigned patients */}
              </p>
            )}
          </div>
          {assignedPatients.length > 0 ? (
            <Suspense fallback={<VirtualizedListFallback />}>
              <VirtualizedList
                items={assignedPatients}
                height={500}
                itemHeight={120}
                renderItem={renderPatientItem as (item: unknown, index: number) => React.ReactNode}
              />
            </Suspense>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No assigned patients found</p>
              <p className="text-sm text-gray-400 mt-1">
                Patients will appear here once they are assigned to this provider
              </p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
});

DashboardProvider.displayName = 'DashboardProvider';

export default DashboardProvider;


