import { memo, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { loginUser } from '@/features/auth/authSlice';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

const Login = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      try {
        const result = await dispatch(
          loginUser({ email, password })
        ).unwrap();

        // Navigate based on user role
        if (result.user.role === 'patient') {
          navigate(ROUTES.DASHBOARD_PATIENT);
        } else if (result.user.role === 'provider') {
          navigate(ROUTES.DASHBOARD_PROVIDER);
        } else if (result.user.role === 'admin' || result.user.role === 'superadmin') {
          navigate(ROUTES.DASHBOARD_ADMIN);
        } else {
          navigate(ROUTES.DASHBOARD_PATIENT);
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Invalid email or password. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, dispatch, navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Healthcare Portal
            </h2>
            <p className="text-center text-gray-600">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
              placeholder="Enter your email"
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-blue focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Sign In
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="text-healthcare-blue hover:underline font-medium"
              >
                Register as Patient
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
});

Login.displayName = 'Login';

export default Login;


