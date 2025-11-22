import { memo, useMemo } from 'react';
import { User, Goal, PatientProfile } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { calculateAge } from '@/utils/dateUtils';

interface PatientStatusCardProps {
  patient: User;
  profile?: PatientProfile;
  goals: Goal[];
  onViewDetails?: (patientId: string) => void;
}

const PatientStatusCard = memo(
  ({ patient, profile, goals, onViewDetails }: PatientStatusCardProps) => {
    const wellnessMetrics = useMemo(() => {
      const todayGoals = goals.filter((g) => {
        const goalDate = new Date(g.date);
        const today = new Date();
        return goalDate.toDateString() === today.toDateString();
      });

      const completedGoals = todayGoals.filter((g) => g.completed || g.current >= g.target);
      const completionRate =
        todayGoals.length > 0 ? Math.round((completedGoals.length / todayGoals.length) * 100) : 0;

      return {
        totalGoals: todayGoals.length,
        completedGoals: completedGoals.length,
        completionRate,
      };
    }, [goals]);

    return (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-600">{patient.email}</p>
            {profile && (
              <p className="text-sm text-gray-500 mt-1">
                Age: {calculateAge(profile.dateOfBirth)} | MRN: {profile.medicalRecordNumber}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-healthcare-blue">
              {wellnessMetrics.totalGoals}
            </p>
            <p className="text-xs text-gray-600">Goals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {wellnessMetrics.completedGoals}
            </p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {wellnessMetrics.completionRate}%
            </p>
            <p className="text-xs text-gray-600">Rate</p>
          </div>
        </div>

        {profile?.allergies && profile.allergies.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-1">Allergies:</p>
            <div className="flex flex-wrap gap-1">
              {profile.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(patient.id)}
            className="w-full"
          >
            View Details
          </Button>
        )}
      </Card>
    );
  }
);

PatientStatusCard.displayName = 'PatientStatusCard';

export default PatientStatusCard;
