/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Auth.tsx
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

const LOGO_PATH = 'https://static.vecteezy.com/system/resources/previews/035/577/040/non_2x/medical-health-care-logo-design-template-vector.jpg';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});
type LoginValues = z.infer<typeof loginSchema>;

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(3, 'Password must be at least 3 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
    phone: z.string().optional().or(z.literal('')),
    dob: z.string().optional().or(z.literal('')),
    gender: z.enum(['male', 'female', 'other']).optional(),
    address: z.string().optional().or(z.literal('')),
    insuranceId: z.string().optional().or(z.literal('')),
    consent: z.boolean().refine((v) => v === true, 'You must accept the consent'),
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
type RegisterValues = z.infer<typeof registerSchema>;


const Auth = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // login form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    setError: setLoginFieldError,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // register form
  const {
    register: regRegister,
    handleSubmit: handleRegSubmit,
    formState: { errors: regErrors },
    setError: setRegFieldError,
  } = useForm<RegisterValues>({
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
      consent: false,
    },
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [loginServerError, setLoginServerError] = useState<string | null>(null);
  const [regServerError, setRegServerError] = useState<string | null>(null);

  const onLogin = useCallback(
    async (data: LoginValues) => {
 
      setLoginServerError(null);
      setLoginLoading(true);
      try {
        const res = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, {
          email: data.email,
          password: data.password,
        });

        const { user, token } = res.data;
        dispatch(setCredentials({ user, token }));
        localStorage.setItem("users",JSON.stringify(user) );

        console.log("user?.role", user?.role);
        switch (user?.role) {
          case "provider":
            return navigate('/dashboard/provider');
          case "admin":
            return navigate('/dashboard/admin');
          case "patient":
            return navigate('/dashboard/patient');
          default: 
            return navigate('/');
        }
      } catch (err: unknown) {
        const msg = (err as any)?.response?.data?.message ?? (err instanceof Error ? err.message : 'Login failed');
        if ((err as any)?.response?.data?.errors) {
          (err as any).response.data.errors.forEach((e: any) => {
            if (e.field) setLoginFieldError(e.field as any, { type: 'server', message: e.message });
          });
        }
        setLoginServerError(msg);
      } finally {
        setLoginLoading(false);
      }
    },
    [dispatch, navigate, setLoginFieldError]
  );

  /* ---------- Register Handler ---------- */
  const onRegister = useCallback(
    async (data: RegisterValues) => {
      setRegServerError(null);
      setRegLoading(true);
      try {
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

        const res = await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);

        // if API returns user + token, auto-login
        const { user, token } = res.data || {};
        if (user && token) {
          dispatch(setCredentials({ user, token }));
          navigate('/dashboard/patient');
        } else {
          // fallback: switch to login and show success
          setMode('login');
          setLoginServerError('Registration successful. Please sign in.');
        }
      } catch (err: unknown) {
        const msg = (err as any)?.response?.data?.message ?? (err instanceof Error ? err.message : 'Registration failed');
        if ((err as any)?.response?.data?.errors) {
          (err as any).response.data.errors.forEach((e: any) => {
            if (e.field) setRegFieldError(e.field as any, { type: 'server', message: e.message });
          });
        }
        setRegServerError(msg);
      } finally {
        setRegLoading(false);
      }
    },
    [dispatch, navigate, setRegFieldError]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="flex flex-col items-center mb-6">
          <img src={LOGO_PATH} alt="Logo" className="w-36 h-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">{mode === 'login' ? 'Sign in' : 'Create an account'}</h1>
          <p className="text-sm text-gray-600">
            {mode === 'login'
              ? 'Sign in to your healthcare account'
              : 'Register as a patient to manage appointments & records'}
          </p>
        </div>

        <div className="flex space-x-2 justify-center mb-4">
          <button
            onClick={() => setMode('login')}
            className={`px-4 py-2 rounded-md ${mode === 'login' ? 'bg-white shadow' : 'bg-transparent text-gray-600'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`px-4 py-2 rounded-md ${mode === 'register' ? 'bg-white shadow' : 'bg-transparent text-gray-600'}`}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          /* ---------------- LOGIN FORM ---------------- */
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4 max-w-md mx-auto">
            {loginServerError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{loginServerError}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                {...loginRegister('email')}
                type="email"
                className={`w-full px-4 py-2 border rounded-lg ${loginErrors.email ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {loginErrors.email && <p className="text-sm text-red-600 mt-1">{loginErrors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                {...loginRegister('password')}
                type="password"
                className={`w-full px-4 py-2 border rounded-lg ${loginErrors.password ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Password"
                autoComplete="current-password"
              />
              {loginErrors.password && <p className="text-sm text-red-600 mt-1">{loginErrors.password.message}</p>}
            </div>

            <Button type="submit" isLoading={loginLoading} className="w-full">
              Sign In
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button type="button" onClick={() => setMode('register')} className="text-healthcare-blue underline">
                Create a new account
              </button>
            </div>
          </form>
        ) : (
          /* ---------------- REGISTER FORM ---------------- */
          <form onSubmit={handleRegSubmit(onRegister)} className="space-y-4 max-w-2xl mx-auto">
            {regServerError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{regServerError}</div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input {...regRegister('firstName')} className={`w-full px-3 py-2 border rounded-lg ${regErrors.firstName ? 'border-red-300' : 'border-gray-300'}`} />
                {regErrors.firstName && <p className="text-sm text-red-600 mt-1">{regErrors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input {...regRegister('lastName')} className={`w-full px-3 py-2 border rounded-lg ${regErrors.lastName ? 'border-red-300' : 'border-gray-300'}`} />
                {regErrors.lastName && <p className="text-sm text-red-600 mt-1">{regErrors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...regRegister('email')} type="email" className={`w-full px-3 py-2 border rounded-lg ${regErrors.email ? 'border-red-300' : 'border-gray-300'}`} />
              {regErrors.email && <p className="text-sm text-red-600 mt-1">{regErrors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input {...regRegister('password')} type="password" className={`w-full px-3 py-2 border rounded-lg ${regErrors.password ? 'border-red-300' : 'border-gray-300'}`} />
                {regErrors.password && <p className="text-sm text-red-600 mt-1">{regErrors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                <input {...regRegister('confirmPassword')} type="password" className={`w-full px-3 py-2 border rounded-lg ${regErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`} />
                {regErrors.confirmPassword && <p className="text-sm text-red-600 mt-1">{regErrors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input {...regRegister('phone')} className={`w-full px-3 py-2 border rounded-lg ${regErrors.phone ? 'border-red-300' : 'border-gray-300'}`} placeholder="+91-XXXXXXXXXX" />
                {regErrors.phone && <p className="text-sm text-red-600 mt-1">{regErrors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
                <input {...regRegister('dob')} type="date" className={`w-full px-3 py-2 border rounded-lg ${regErrors.dob ? 'border-red-300' : 'border-gray-300'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select {...regRegister('gender')} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea {...regRegister('address')} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>


            <div className="flex items-start gap-2">
              <input {...regRegister('consent')} id="consent" type="checkbox" className={`mt-1 h-4 w-4 rounded ${regErrors.consent ? 'border-red-300' : 'border-gray-300'}`} />
              <label htmlFor="consent" className="text-sm text-gray-700">
                I consent to processing of my personal & medical data for treatment & communication. <span className="text-xs text-gray-500">(Required)</span>
              </label>
            </div>
            {regErrors.consent && <p className="text-sm text-red-600 mt-1">{regErrors.consent.message}</p>}

            <Button type="submit" isLoading={regLoading} className="w-full">
              Create account
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')} className="text-healthcare-blue underline">
                Sign in
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
});

Auth.displayName = 'Auth';
export default Auth;
