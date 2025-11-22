import { memo, useMemo } from 'react';
import { ProviderAssignment, User } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatDateTime } from '@/utils/dateUtils';

interface AssignmentListProps {
  assignments: ProviderAssignment[];
  providers: User[];
  patients: User[];
  onDelete: (id: string) => void;
  onUpdateStatus?: (id: string, status: 'active' | 'inactive') => void;
  isLoading?: boolean;
}

const AssignmentList = memo(
  ({
    assignments,
    providers,
    patients,
    onDelete,
    onUpdateStatus,
    isLoading,
  }: AssignmentListProps) => {
    const assignmentsWithDetails = useMemo(() => {
      return assignments.map((assignment) => {
        const provider = providers.find((p) => p.id === assignment.providerId);
        const patient = patients.find((p) => p.id === assignment.patientId);

        return {
          ...assignment,
          providerName: provider?.name || 'Unknown Provider',
          providerEmail: provider?.email || 'N/A',
          patientName: patient?.name || 'Unknown Patient',
          patientEmail: patient?.email || 'N/A',
        };
      });
    }, [assignments, providers, patients]);

    if (isLoading) {
      return (
        <Card className="p-6">
          <div className="text-center py-8">Loading assignments...</div>
        </Card>
      );
    }

    if (assignmentsWithDetails.length === 0) {
      return (
        <Card className="p-6">
          <div className="text-center py-8 text-gray-500">
            No assignments found
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Assignments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Provider</th>
                <th className="text-left py-3 px-4 font-semibold">Patient</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Assigned Date</th>
                <th className="text-left py-3 px-4 font-semibold">Notes</th>
                <th className="text-right py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignmentsWithDetails.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{assignment.providerName}</p>
                      <p className="text-sm text-gray-500">
                        {assignment.providerEmail}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{assignment.patientName}</p>
                      <p className="text-sm text-gray-500">
                        {assignment.patientEmail}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        assignment.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDateTime(assignment.assignedAt)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {assignment.notes || '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      {onUpdateStatus && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onUpdateStatus(
                              assignment.id,
                              assignment.status === 'active'
                                ? 'inactive'
                                : 'active'
                            )
                          }
                        >
                          {assignment.status === 'active'
                            ? 'Deactivate'
                            : 'Activate'}
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(assignment.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }
);

AssignmentList.displayName = 'AssignmentList';

export default AssignmentList;