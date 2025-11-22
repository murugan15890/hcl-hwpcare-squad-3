import { memo, useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useACL } from '@/hooks/useACL';
import {
  fetchProviders,
  fetchPatients,
  fetchAssignments,
  createAssignment,
  deleteAssignment,
  updateAssignmentStatus,
  setError,
} from '@/features/assignments/assignmentSlice';
import { ProviderDropdown, PatientDropdown, AssignmentList } from '@/components/assignments';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

const AssignmentPage = memo(() => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { providers, patients, assignments, isLoading, error } = useAppSelector(
    (state) => state.assignments || {
      providers: [],
      patients: [],
      assignments: [],
      isLoading: false,
      error: null,
    }
  );
  const { isAdmin } = useACL();

  const [formData, setFormData] = useState({
    providerId: '',
    patientId: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<{
    providerId?: string;
    patientId?: string;
  }>({});

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchProviders());
      dispatch(fetchPatients());
      dispatch(fetchAssignments());
    }
  }, [dispatch, isAdmin]);

  const validateForm = useCallback((): boolean => {
    const errors: { providerId?: string; patientId?: string } = {};

    if (!formData.providerId) {
      errors.providerId = 'Please select a provider';
    }

    if (!formData.patientId) {
      errors.patientId = 'Please select a patient';
    }

    // Check if patient is already assigned to this provider
    if (formData.providerId && formData.patientId) {
      const existingAssignment = assignments.find(
        (a) =>
          a.providerId === formData.providerId &&
          a.patientId === formData.patientId &&
          a.status === 'active'
      );

      if (existingAssignment) {
        errors.patientId = 'This patient is already assigned to this provider';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, assignments]);

  const handleProviderSelect = useCallback((providerId: string) => {
    setFormData((prev) => ({ ...prev, providerId }));
    setFormErrors((prev) => ({ ...prev, providerId: undefined }));
    dispatch(setError(null));
  }, [dispatch]);

  const handlePatientSelect = useCallback((patientId: string) => {
    setFormData((prev) => ({ ...prev, patientId }));
    setFormErrors((prev) => ({ ...prev, patientId: undefined }));
    dispatch(setError(null));
  }, [dispatch]);

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, notes: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      if (!user?.id) {
        dispatch(setError('User not authenticated'));
        return;
      }

      try {
        await dispatch(
          createAssignment({
            providerId: formData.providerId,
            patientId: formData.patientId,
            assignedBy: user.id,
            notes: formData.notes || undefined,
          })
        ).unwrap();

        // Reset form
        setFormData({
          providerId: '',
          patientId: '',
          notes: '',
        });
        setFormErrors({});

        // Refresh assignments
        dispatch(fetchAssignments());
      } catch (err) {
        // Error is handled by the slice
        console.error('Failed to create assignment:', err);
      }
    },
    [formData, user?.id, dispatch, validateForm]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        window.confirm(
          'Are you sure you want to remove this assignment?'
        )
      ) {
        await dispatch(deleteAssignment(id));
        dispatch(fetchAssignments());
      }
    },
    [dispatch]
  );

  const handleUpdateStatus = useCallback(
    async (id: string, status: 'active' | 'inactive') => {
      await dispatch(updateAssignmentStatus({ id, status }));
      dispatch(fetchAssignments());
    },
    [dispatch]
  );

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <p className="text-red-600">Access denied. Admin only.</p>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Patient → Provider Assignments
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Assignment Form */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Assignment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProviderDropdown
                providers={providers}
                selectedProviderId={formData.providerId}
                onSelect={handleProviderSelect}
                disabled={isLoading}
                error={formErrors.providerId}
              />

              <PatientDropdown
                patients={patients}
                assignments={assignments}
                selectedPatientId={formData.patientId}
                onSelect={handlePatientSelect}
                disabled={isLoading}
                error={formErrors.patientId}
                excludeAssigned={false}
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={handleNotesChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
                placeholder="Add any notes about this assignment..."
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Create Assignment
              </Button>
            </div>
          </form>
        </Card>

        {/* Assignments List */}
        <AssignmentList
          assignments={assignments}
          providers={providers}
          patients={patients}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
          isLoading={isLoading}
        />
      </div>
    </ProtectedRoute>
  );
});

AssignmentPage.displayName = 'AssignmentPage';

export default AssignmentPage;
