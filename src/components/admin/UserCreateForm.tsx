import { memo, useState, useCallback } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { createAdminUser, createProviderUser } from '@/features/admin/adminUserSlice';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { UserRole } from '@/types';

interface UserCreateFormProps {
  role: 'admin' | 'provider';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UserCreateForm = memo(({ role, onSuccess, onCancel }: UserCreateFormProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      setIsLoading(true);

      try {
        if (role === 'admin') {
          await dispatch(
            createAdminUser({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            })
          ).unwrap();
        } else {
          await dispatch(
            createProviderUser({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            })
          ).unwrap();
        }

        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        onSuccess?.();
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : `Failed to create ${role}. Please try again.`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData, role, dispatch, onSuccess]
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        Create New {role === 'admin' ? 'Admin' : 'Provider'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
            placeholder="Enter password"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
            placeholder="Confirm password"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Create {role === 'admin' ? 'Admin' : 'Provider'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
});

UserCreateForm.displayName = 'UserCreateForm';

export default UserCreateForm;
