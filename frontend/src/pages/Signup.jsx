import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

const schema = yup.object({
  name: yup.string().min(2, 'Name is too short').required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
});

export default function Signup() {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const data = await authApi.register(values);
      setCredentials({ token: data.token, user: data.user });
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Unable to sign up. Try again.');
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-brand-50 bg-white p-10 shadow-card-lg">
        <h1 className="text-3xl font-bold text-slate-850">Create an account</h1>
        <p className="mt-1 text-sm text-slate-500">Sign up to start managing your tasks.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <input
              {...register('name')}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              placeholder="Jane Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email address</label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{serverError}</p>
          )}

          <button
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card-lg transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500">
            Log in here
          </Link>
        </p>
      </div>
    </section>
  );
}

