import { memo, useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useACL } from '@/hooks/useACL';
import {
  fetchPatientProfile,
  clearProfile,
} from '@/features/patient/patientSlice';
import ProfileForm from '@/components/patient/ProfileForm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { calculateAge, formatDateReadable } from '@/utils/dateUtils';

const ProfilePage = memo(() => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, isLoading, error } = useAppSelector((state) => state.patient);
  const { isPatient } = useACL();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.id && isPatient) {
      dispatch(fetchPatientProfile(user.id));
    }

    return () => {
      dispatch(clearProfile());
    };
  }, [user?.id, isPatient, dispatch]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    if (user?.id) {
      dispatch(fetchPatientProfile(user.id));
    }
  }, [user?.id, dispatch]);

  const handleSaveSuccess = useCallback(() => {
    setIsEditing(false);
    if (user?.id) {
      dispatch(fetchPatientProfile(user.id));
    }
  }, [user?.id, dispatch]);

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
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {!isEditing && profile && (
            <Button onClick={handleEdit} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading && !profile ? (
          <Card className="p-6">
            <div className="text-center py-8">Loading profile...</div>
          </Card>
        ) : isEditing ? (
          <ProfileForm
            profile={profile}
            userId={user?.id || ''}
            onSuccess={handleSaveSuccess}
            onCancel={handleCancel}
          />
        ) : profile ? (
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">
                    {profile.dateOfBirth
                      ? formatDateReadable(profile.dateOfBirth)
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">
                    {profile.dateOfBirth
                      ? `${calculateAge(profile.dateOfBirth)} years`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{profile.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Medical Record Number</p>
                  <p className="font-medium">
                    {profile.medicalRecordNumber || 'N/A'}
                  </p>
                </div>
                {profile.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{profile.address}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Emergency Contact */}
            {profile.emergencyContact && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">
                      {profile.emergencyContact.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">
                      {profile.emergencyContact.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="font-medium">
                      {profile.emergencyContact.relationship}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Medical Information */}
            {(profile.allergies?.length || profile.medications?.length) && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.allergies && profile.allergies.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.allergies.map((allergy, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.medications && profile.medications.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Current Medications
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.medications.map((medication, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {medication}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <div className="flex justify-end">
              <Button onClick={handleEdit}>Edit Profile</Button>
            </div>
          </div>
        ) : (
          <Card className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No profile found. Please create your profile.
              </p>
              <Button onClick={handleEdit}>Create Profile</Button>
            </div>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;
