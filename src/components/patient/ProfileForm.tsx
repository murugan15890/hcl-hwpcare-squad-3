import { memo, useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { updatePatientProfile, createPatientProfile } from '@/features/patient/patientSlice';
import { PatientProfile } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ProfileFormProps {
  profile: PatientProfile | null;
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void; // Add onCancel prop
}

const ProfileForm = memo(({ profile, userId, onSuccess, onCancel }: ProfileFormProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    phone: '',
    address: '',
    medicalRecordNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    allergies: '',
    medications: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        dateOfBirth: profile.dateOfBirth || '',
        phone: profile.phone || '',
        address: profile.address || '',
        medicalRecordNumber: profile.medicalRecordNumber || '',
        emergencyContactName: profile.emergencyContact?.name || '',
        emergencyContactPhone: profile.emergencyContact?.phone || '',
        emergencyContactRelationship: profile.emergencyContact?.relationship || '',
        allergies: profile.allergies?.join(', ') || '',
        medications: profile.medications?.join(', ') || '',
      });
    }
  }, [profile]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError(null);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validation
      if (!formData.dateOfBirth || !formData.phone || !formData.medicalRecordNumber) {
        setError('Please fill in all required fields');
        return;
      }

      setIsLoading(true);

      try {
        const profileData: Partial<PatientProfile> = {
          userId,
          dateOfBirth: formData.dateOfBirth,
          phone: formData.phone,
          address: formData.address || undefined,
          medicalRecordNumber: formData.medicalRecordNumber,
          emergencyContact:
            formData.emergencyContactName && formData.emergencyContactPhone
              ? {
                  name: formData.emergencyContactName,
                  phone: formData.emergencyContactPhone,
                  relationship: formData.emergencyContactRelationship || 'Other',
                }
              : undefined,
          allergies: formData.allergies
            ? formData.allergies.split(',').map((a) => a.trim()).filter(Boolean)
            : undefined,
          medications: formData.medications
            ? formData.medications.split(',').map((m) => m.trim()).filter(Boolean)
            : undefined,
        };

        if (profile?.id) {
          await dispatch(
            updatePatientProfile({ id: profile.id, ...profileData })
          ).unwrap();
        } else {
          await dispatch(createPatientProfile(profileData as Omit<PatientProfile, 'id' | 'createdAt' | 'updatedAt'>)).unwrap();
        }

        onSuccess?.();
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to save profile. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData, profile, userId, dispatch, onSuccess]
  );

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Patient Profile</h2>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            ← Back
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
              placeholder="Street address, City, State, ZIP"
            />
          </div>

          <div>
            <label
              htmlFor="medicalRecordNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Medical Record Number <span className="text-red-500">*</span>
            </label>
            <input
              id="medicalRecordNumber"
              name="medicalRecordNumber"
              type="text"
              value={formData.medicalRecordNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
              placeholder="MRN-001"
            />
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="emergencyContactName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="emergencyContactName"
                name="emergencyContactName"
                type="text"
                value={formData.emergencyContactName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
                placeholder="Full name"
              />
            </div>

            <div>
              <label
                htmlFor="emergencyContactPhone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label
                htmlFor="emergencyContactRelationship"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Relationship
              </label>
              <input
                id="emergencyContactRelationship"
                name="emergencyContactRelationship"
                type="text"
                value={formData.emergencyContactRelationship}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
                placeholder="Spouse, Parent, etc."
              />
            </div>
          </div>
        </div>

        {/* Medical Information Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="allergies"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Allergies
              </label>
              <input
                id="allergies"
                name="allergies"
                type="text"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
                placeholder="Peanuts, Penicillin (comma-separated)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple allergies with commas
              </p>
            </div>

            <div>
              <label
                htmlFor="medications"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Medications
              </label>
              <input
                id="medications"
                name="medications"
                type="text"
                value={formData.medications}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
                placeholder="Aspirin, Vitamin D (comma-separated)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple medications with commas
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={isLoading}>
            Save Profile
          </Button>
        </div>
      </form>
    </Card>
  );
});

ProfileForm.displayName = 'ProfileForm';

export default ProfileForm;
