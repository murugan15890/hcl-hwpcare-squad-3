import { memo, useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useACL } from '@/hooks/useACL';
import {
  fetchAllUsers,
  deleteUser,
  setSelectedRole,
  filterUsers,
} from '@/features/admin/adminUserSlice';
import UserCreateForm from '@/components/admin/UserCreateForm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { UserRole } from '@/types';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

const AdminUserList = memo(() => {
  const dispatch = useAppDispatch();
  const { isSuperAdmin } = useACL();
  const { users, filteredUsers, selectedRole, isLoading, error } =
    useAppSelector((state) => state.adminUser || { users: [], filteredUsers: [], selectedRole: 'all', isLoading: false, error: null });
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createRole, setCreateRole] = useState<'admin' | 'provider'>('admin');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isSuperAdmin) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, isSuperAdmin]);

  useEffect(() => {
    if (searchTerm) {
      dispatch(filterUsers(searchTerm));
    } else {
      dispatch(setSelectedRole(selectedRole));
    }
  }, [searchTerm, dispatch, selectedRole]);

  const handleRoleFilter = useCallback(
    (role: UserRole | 'all') => {
      dispatch(setSelectedRole(role));
      setSearchTerm('');
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this user?')) {
        await dispatch(deleteUser(id));
      }
    },
    [dispatch]
  );

  const handleCreateSuccess = useCallback(() => {
    setShowCreateForm(false);
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <p className="text-red-600">Access denied. SuperAdmin only.</p>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setCreateRole('admin');
                setShowCreateForm(true);
              }}
            >
              Create Admin
            </Button>
            <Button
              onClick={() => {
                setCreateRole('provider');
                setShowCreateForm(true);
              }}
            >
              Create Provider
            </Button>
          </div>
        </div>

        {showCreateForm && (
          <UserCreateForm
            role={createRole}
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Card className="p-6">
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-2">
              {(['all', 'admin', 'provider', 'patient'] as const).map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? 'primary' : 'outline'}
                  onClick={() => handleRoleFilter(role)}
                  size="sm"
                >
                  {role === 'all' ? 'All Users' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
                </Button>
              ))}
            </div>

            <div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* User List */}
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">Created</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
});

AdminUserList.displayName = 'AdminUserList';

export default AdminUserList;
