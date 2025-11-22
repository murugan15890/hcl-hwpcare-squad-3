// src/pages/Register.tsx
import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import axiosClient from '@/utils/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';

// Logo path (uploaded image). Your tooling will transform this local path as needed.
const LOGO_PATH = '/mnt/data/dddab98a-ad6a-4d74-a7d9-3689ec57e950.png';

/**
 * Zod schema for patient registration
 * - consent must be true
 * - password + confirmPassword must match
 */
const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
    phone: z
      .string()
      .min(7, 'Phone is required')
      .max(15, 'Phone looks too long')
      .optional()
      .or(z.literal('')), // allow empty string if you prefer optional (RHF handles empty)
    dob: z.string().optional().or(z.literal('')),
    gender: z.enum(['male', 'female', 'other']).optional(),
    address: z.string().optional().or(z.literal('')),
    insuranceId: z.string().optional().or(z.literal('')),
    consent: z.boolean().refine((v) => v === true, {
      message: 'You must accept the terms and consent to proceed',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
      });
    }
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dob: '',
      gender: 'male',
      address: '',
      insuranceId: '',
      consent: false,
    },
  });

  const onSubmit = useCallback(
    async (data: RegisterFormValues) => {
      setServerError(null);
      setIsLoading(true);

      try {
        // adjust endpoint as needed
        const payload = {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone || undefined,
          dob: data.dob || undefined,
          gender: data.gender || undefined,
          address: data.address || undefined,
          insurance_id: data.insuranceId || undefined,
          consent: data.consent,
          role: 'patient',
        };

        const response = await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);


        const { user, token } = response.data || {};
        if (user && token) {
          dispatch(setCredentials({ user, token }));
          navigate('/dashboard/patient');
        } else {
          navigate('/login');
        }
      } catch (err: unknown) {
        const message =
          (err as any)?.response?.data?.message ||
          (err instanceof Error ? err.message : 'Registration failed. Please try again.');
        setServerError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <Card className="w-full max-w-lg p-6">
        <div className="flex flex-col items-center mb-4">
          <img src={LOGO_PATH} alt="Medicare Connect Logo" className="w-36 h-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Patient Registration</h1>
          <p className="text-sm text-gray-600">Create an account to manage appointments and records</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input
                {...register('firstName')}
                className={`w-full px-3 py-2 border rounded-lg ${errors.firstName ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="First name"
              />
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input
                {...register('lastName')}
                className={`w-full px-3 py-2 border rounded-lg ${errors.lastName ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Last name"
              />
              {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                {...register('password')}
                type="password"
                className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Password"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className={`w-full px-3 py-2 border rounded-lg ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                {...register('phone')}
                className={`w-full px-3 py-2 border rounded-lg ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="+91-XXXXXXXXXX"
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
              <input
                {...register('dob')}
                type="date"
                className={`w-full px-3 py-2 border rounded-lg ${errors.dob ? 'border-red-300' : 'border-gray-300'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                {...register('gender')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              {...register('address')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Street, City, State, ZIP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance / Policy ID (optional)</label>
            <input
              {...register('insuranceId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Insurance / policy number"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              {...register('consent')}
              id="consent"
              type="checkbox"
              className={`mt-1 h-4 w-4 rounded ${errors.consent ? 'border-red-300' : 'border-gray-300'}`}
            />
            <label htmlFor="consent" className="text-sm text-gray-700">
              I consent to the processing of my personal and medical data for the purposes of treatment and
              communication. <span className="text-xs text-gray-500">(Required)</span>
            </label>
          </div>
          {errors.consent && <p className="text-sm text-red-600 mt-1">{errors.consent.message}</p>}

          <div>
            <Button type="submit" isLoading={isLoading} className="w-full">
              Create account
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-healthcare-blue underline"
            >
              Sign in
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
});

Register.displayName = 'Register';
export default Register;
