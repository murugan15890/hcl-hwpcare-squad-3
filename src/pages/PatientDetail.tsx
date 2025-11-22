import { memo, useMemo, useCallback, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import type { Patient, PatientGoal, PatientCompliance } from '@/types';

// Loading fallback component
const SectionFallback = ({ title }: { title: string }) => (
  <Card title={title} className="mb-6">
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-blue mx-auto mb-2" />
        <p className="text-sm text-gray-500">Loading {title.toLowerCase()}...</p>
      </div>
    </div>
  </Card>
);

// Mock goals data
const MOCK_GOALS: Record<string, PatientGoal[]> = {
  '1': [
    {
      id: 'g1',
      title: 'Blood Pressure Control',
      description: 'Maintain systolic BP below 140 mmHg',
      targetDate: '2024-06-30',
      status: 'in-progress',
      progress: 75,
      category: 'Cardiovascular',
    },
    {
      id: 'g2',
      title: 'Weight Management',
      description: 'Lose 10 pounds over 3 months',
      targetDate: '2024-05-15',
      status: 'in-progress',
      progress: 60,
      category: 'Lifestyle',
    },
    {
      id: 'g3',
      title: 'Medication Adherence',
      description: 'Take prescribed medications daily',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 90,
      category: 'Medication',
    },
    {
      id: 'g6',
      title: 'Daily Steps Goal',
      description: 'Walk 10,000 steps per day',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 82,
      category: 'Fitness',
    },
    {
      id: 'g7',
      title: 'Active Time',
      description: '150 minutes of moderate activity per week',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 68,
      category: 'Fitness',
    },
    {
      id: 'g8',
      title: 'Sleep Duration',
      description: 'Get 7-9 hours of sleep per night',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 75,
      category: 'Wellness',
    },
  ],
  '2': [
    {
      id: 'g4',
      title: 'Exercise Routine',
      description: '30 minutes of exercise, 5 days per week',
      targetDate: '2024-07-01',
      status: 'in-progress',
      progress: 70,
      category: 'Lifestyle',
    },
    {
      id: 'g5',
      title: 'Blood Sugar Control',
      description: 'Maintain HbA1c below 7%',
      targetDate: '2024-08-30',
      status: 'in-progress',
      progress: 85,
      category: 'Diabetes',
    },
    {
      id: 'g9',
      title: 'Daily Steps Goal',
      description: 'Walk 8,000 steps per day',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 72,
      category: 'Fitness',
    },
    {
      id: 'g10',
      title: 'Active Time',
      description: '120 minutes of moderate activity per week',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 85,
      category: 'Fitness',
    },
    {
      id: 'g11',
      title: 'Sleep Duration',
      description: 'Get 8 hours of sleep per night',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 65,
      category: 'Wellness',
    },
  ],
  '3': [
    {
      id: 'g12',
      title: 'Daily Steps Goal',
      description: 'Walk 12,000 steps per day',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 88,
      category: 'Fitness',
    },
    {
      id: 'g13',
      title: 'Active Time',
      description: '180 minutes of moderate activity per week',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 55,
      category: 'Fitness',
    },
    {
      id: 'g14',
      title: 'Sleep Duration',
      description: 'Get 7-8 hours of sleep per night',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 80,
      category: 'Wellness',
    },
  ],
  '4': [
    {
      id: 'g15',
      title: 'Daily Steps Goal',
      description: 'Walk 7,500 steps per day',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 70,
      category: 'Fitness',
    },
    {
      id: 'g16',
      title: 'Active Time',
      description: '100 minutes of moderate activity per week',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 90,
      category: 'Fitness',
    },
    {
      id: 'g17',
      title: 'Sleep Duration',
      description: 'Get 7 hours of sleep per night',
      targetDate: '2024-12-31',
      status: 'in-progress',
      progress: 58,
      category: 'Wellness',
    },
  ],
};

// Mock compliance data
const MOCK_COMPLIANCE: Record<string, PatientCompliance[]> = {
  '1': [
    {
      id: 'c1',
      metric: 'Medication Adherence',
      value: 92,
      target: 90,
      unit: '%',
      status: 'compliant',
      lastUpdated: '2024-03-15',
    },
    {
      id: 'c2',
      metric: 'Appointment Attendance',
      value: 85,
      target: 80,
      unit: '%',
      status: 'compliant',
      lastUpdated: '2024-03-10',
    },
    {
      id: 'c3',
      metric: 'Lab Test Completion',
      value: 75,
      target: 90,
      unit: '%',
      status: 'at-risk',
      lastUpdated: '2024-03-12',
    },
  ],
  '2': [
    {
      id: 'c4',
      metric: 'Medication Adherence',
      value: 88,
      target: 90,
      unit: '%',
      status: 'at-risk',
      lastUpdated: '2024-03-14',
    },
    {
      id: 'c5',
      metric: 'Appointment Attendance',
      value: 95,
      target: 80,
      unit: '%',
      status: 'compliant',
      lastUpdated: '2024-03-11',
    },
  ],
};

const PatientDetail = memo(() => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const { assignedPatients } = useAppSelector((state) => state.provider);

  const patient = useMemo<Patient | null>(() => {
    if (!patientId) return null;
    return assignedPatients.find((p) => p.id === patientId) || null;
  }, [patientId, assignedPatients]);

  const goals = useMemo(() => {
    if (!patientId) return [];
    return MOCK_GOALS[patientId] || MOCK_GOALS['1'] || [];
  }, [patientId]);

  const compliance = useMemo(() => {
    if (!patientId) return [];
    return MOCK_COMPLIANCE[patientId] || MOCK_COMPLIANCE['1'] || [];
  }, [patientId]);

  const handleBack = useCallback(() => {
    navigate('/dashboard/provider');
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Patient not found</p>
            <Button onClick={handleBack}>Back to Dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBack}>
                ← Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Information */}
        <Card title="Patient Information" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-4">{patient.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{patient.phone}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-3 mt-8 md:mt-0">
                <div>
                  <p className="text-sm text-gray-500">Medical Record Number</p>
                  <p className="text-gray-900 font-mono">{patient.medicalRecordNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">
                    {new Date(patient.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Patient Goals */}
        <Suspense fallback={<SectionFallback title="Patient Goals" />}>
          <Card title="Patient Goals" className="mb-6">
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            goal.status
                          )}`}
                        >
                          {goal.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Category: {goal.category}</span>
                        <span>
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(
                          goal.progress
                        )}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No goals set for this patient</p>
          )}
          </Card>
        </Suspense>

        {/* Compliance Metrics */}
        <Suspense fallback={<SectionFallback title="Compliance Metrics" />}>
          <Card title="Compliance Metrics">
            {compliance.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compliance.map((metric) => (
                <div
                  key={metric.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{metric.metric}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        metric.status
                      )}`}
                    >
                      {metric.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {metric.value}
                        {metric.unit}
                      </span>
                      <span className="text-sm text-gray-500">
                        / {metric.target}
                        {metric.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.value >= metric.target
                            ? 'bg-green-500'
                            : metric.value >= metric.target * 0.8
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(metric.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No compliance data available</p>
          )}
          </Card>
        </Suspense>
      </main>
    </div>
  );
});

PatientDetail.displayName = 'PatientDetail';

export default PatientDetail;

