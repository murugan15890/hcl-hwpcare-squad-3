import { memo, useEffect, useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import {
  fetchPatients,
  fetchProviders,
  fetchProviderDetails,
  fetchAssignments,
} from '@/features/admin/adminSlice';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ROUTES } from '@/utils/constants';
import { useACL } from '@/hooks/useACL';
import { VirtualizedList } from '@/components/common/VirtualizedList';
import { formatDateReadable } from '@/utils/dateUtils';
import { User, Provider } from '@/types';

const DashboardAdmin = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { patients, providers, providerDetails, assignments, isLoading, error } =
    useAppSelector((state) => state.admin);
  const { isAdmin } = useACL();

  const [activeTab, setActiveTab] = useState<'patients' | 'providers'>('patients');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchPatients());
      dispatch(fetchProviders());
      dispatch(fetchProviderDetails());
      dispatch(fetchAssignments());
    }
  }, [dispatch, isAdmin]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  }, [dispatch, navigate]);

  // Dashboard Statistics
  const statistics = useMemo(() => {
    const activeAssignments = assignments.filter((a) => a.status === 'active');
    const assignedPatients = new Set(activeAssignments.map((a) => a.patientId));
    
    return {
      totalPatients: patients.length,
      registeredPatients: patients.length,
      totalProviders: providers.length,
      adminCreatedProviders: providers.length,
      activeAssignments: activeAssignments.length,
      assignedPatients: assignedPatients.size,
      unassignedPatients: patients.length - assignedPatients.size,
    };
  }, [patients, providers, assignments]);

  // Filtered patients based on search
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    const term = searchTerm.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term)
    );
  }, [patients, searchTerm]);

  // Filtered providers based on search
  const filteredProviders = useMemo(() => {
    if (!searchTerm) return providers;
    const term = searchTerm.toLowerCase();
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term)
    );
  }, [providers, searchTerm]);

  // Render patient item for virtualized list
  const renderPatientItem = useCallback(
    (patient: User, index: number) => {
      const isAssigned = assignments.some(
        (a) => a.patientId === patient.id && a.status === 'active'
      );
      const assignment = assignments.find(
        (a) => a.patientId === patient.id && a.status === 'active'
      );
      const provider = assignment
        ? providers.find((p) => p.id === assignment.providerId)
        : null;

      return (
        <div className="border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors px-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {patient.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{patient.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{patient.email}</p>
                </div>
                {isAssigned && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium whitespace-nowrap">
                    ✓ Assigned
                  </span>
                )}
                {!isAssigned && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium whitespace-nowrap">
                    Unassigned
                  </span>
                )}
              </div>
              <div className="ml-13 space-y-1">
                {patient.createdAt && (
                  <p className="text-xs text-gray-500">
                    Registered: {formatDateReadable(patient.createdAt)}
                  </p>
                )}
                {provider && (
                  <p className="text-xs text-blue-600">
                    Provider: {provider.name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`${ROUTES.ADMIN_ASSIGNMENTS}?patientId=${patient.id}`)}
              >
                {isAssigned ? 'Reassign' : 'Assign'}
              </Button>
            </div>
          </div>
        </div>
      );
    },
    [assignments, providers, navigate]
  );

  // Render provider item for virtualized list
  const renderProviderItem = useCallback(
    (provider: User, index: number) => {
      const providerDetail = providerDetails.find((pd) => pd.userId === provider.id);
      const assignedCount = assignments.filter(
        (a) => a.providerId === provider.id && a.status === 'active'
      ).length;

      return (
        <div className="border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors px-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">
                    {provider.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{provider.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{provider.email}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium whitespace-nowrap">
                  {assignedCount} {assignedCount === 1 ? 'Patient' : 'Patients'}
                </span>
              </div>
              {providerDetail && (
                <div className="ml-13 space-y-1">
                  <p className="text-xs text-gray-600">
                    <strong>Specialty:</strong> {providerDetail.specialty}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>License:</strong> {providerDetail.licenseNumber}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Phone:</strong> {providerDetail.phone}
                  </p>
                </div>
              )}
              {provider.createdAt && (
                <p className="text-xs text-gray-500 mt-1 ml-13">
                  Created: {formatDateReadable(provider.createdAt)}
                </p>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`${ROUTES.ADMIN_ASSIGNMENTS}?providerId=${provider.id}`)}
              >
                View Assignments
              </Button>
            </div>
          </div>
        </div>
      );
    },
    [providerDetails, assignments, navigate]
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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{statistics.totalPatients}</p>
                <p className="text-sm text-gray-600 mt-2">Total Patients</p>
                <p className="text-xs text-gray-500 mt-1">
                  {statistics.registeredPatients} registered
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {statistics.totalProviders}
                </p>
                <p className="text-sm text-gray-600 mt-2">Total Providers</p>
                <p className="text-xs text-gray-500 mt-1">
                  {statistics.adminCreatedProviders} created
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {statistics.activeAssignments}
                </p>
                <p className="text-sm text-gray-600 mt-2">Active Assignments</p>
                <p className="text-xs text-gray-500 mt-1">
                  {statistics.assignedPatients} patients assigned
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {statistics.unassignedPatients}
                </p>
                <p className="text-sm text-gray-600 mt-2">Unassigned Patients</p>
                <p className="text-xs text-gray-500 mt-1">Need assignment</p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.ADMIN_ASSIGNMENTS)}
                className="w-full"
              >
                Manage Assignments
              </Button>
              {user?.role === 'superadmin' && (
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.ADMIN_USER_MANAGEMENT)}
                  className="w-full"
                >
                  User Management
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  dispatch(fetchPatients());
                  dispatch(fetchProviders());
                  dispatch(fetchProviderDetails());
                  dispatch(fetchAssignments());
                }}
                className="w-full"
                isLoading={isLoading}
              >
                Refresh Data
              </Button>
            </div>
          </Card>

          {/* Patients and Providers Lists with Tabs */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('patients');
                  setSearchTerm('');
                }}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === 'patients'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Registered Patients ({patients.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('providers');
                  setSearchTerm('');
                }}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === 'providers'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Provider Details ({providers.length})
              </button>
            </div>

            {/* Search Bar */}
            <div>
              <input
                type="text"
                placeholder={`Search ${activeTab === 'patients' ? 'patients' : 'providers'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
              />
            </div>

            {/* Patients List */}
            {activeTab === 'patients' && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Registered Patients</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'}
                  </span>
                </div>
                {isLoading ? (
                  <div className="text-center py-8">Loading patients...</div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? 'No patients found matching your search'
                      : 'No patients registered yet'}
                  </div>
                ) : (
                  <VirtualizedList
                    items={filteredPatients}
                    height={500}
                    itemHeight={120}
                    renderItem={renderPatientItem}
                  />
                )}
              </Card>
            )}

            {/* Providers List */}
            {activeTab === 'providers' && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Provider Details</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {filteredProviders.length} {filteredProviders.length === 1 ? 'provider' : 'providers'}
                  </span>
                </div>
                {isLoading ? (
                  <div className="text-center py-8">Loading providers...</div>
                ) : filteredProviders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? 'No providers found matching your search'
                      : 'No providers added yet'}
                    {!searchTerm && user?.role === 'superadmin' && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(ROUTES.ADMIN_USER_MANAGEMENT)}
                        >
                          Create Provider
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <VirtualizedList
                    items={filteredProviders}
                    height={500}
                    itemHeight={150}
                    renderItem={renderProviderItem}
                  />
                )}
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
});

DashboardAdmin.displayName = 'DashboardAdmin';

export default DashboardAdmin;
