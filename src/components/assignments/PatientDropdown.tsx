import { memo, useMemo } from 'react';
import { User, ProviderAssignment } from '@/types';

interface PatientDropdownProps {
  patients: User[];
  assignments: ProviderAssignment[];
  selectedPatientId: string;
  onSelect: (patientId: string) => void;
  disabled?: boolean;
  error?: string;
  excludeAssigned?: boolean; // Option to exclude already assigned patients
}

const PatientDropdown = memo(
  ({
    patients,
    assignments,
    selectedPatientId,
    onSelect,
    disabled,
    error,
    excludeAssigned = false,
  }: PatientDropdownProps) => {
    const availablePatients = useMemo(() => {
      if (!excludeAssigned) return patients;

      const assignedPatientIds = new Set(
        assignments
          .filter((a) => a.status === 'active')
          .map((a) => a.patientId)
      );

      return patients.filter((p) => !assignedPatientIds.has(p.id));
    }, [patients, assignments, excludeAssigned]);

    return (
      <div>
        <label
          htmlFor="patient"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Patient <span className="text-red-500">*</span>
        </label>
        <select
          id="patient"
          value={selectedPatientId}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        >
          <option value="">Select a patient</option>
          {availablePatients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} ({patient.email})
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {availablePatients.length === 0 && !disabled && (
          <p className="mt-1 text-sm text-gray-500">
            {excludeAssigned
              ? 'All patients are already assigned'
              : 'No patients available'}
          </p>
        )}
      </div>
    );
  }
);

PatientDropdown.displayName = 'PatientDropdown';

export default PatientDropdown;
