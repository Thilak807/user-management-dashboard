import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi, profileApi } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import Sidebar from '../components/layout/Sidebar';

// ...removed theme definitions...

const profileSchema = yup.object({
  name: yup.string().min(2, 'Name is too short').required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(8, 'Minimum 8 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm password'),
});

export default function Settings() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Theme and dark mode removed

  // ...removed dark mode and theme effect...

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.me,
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      window.alert('Profile updated successfully!');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      window.alert('Password changed successfully!');
    },
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: profileQuery.data?.user?.name || '',
      email: profileQuery.data?.user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  if (profileQuery.data) {
    resetProfile({
      name: profileQuery.data.user.name,
      email: profileQuery.data.user.email,
    });
  }

  const onProfileSubmit = async (values) => {
    try {
      await updateProfileMutation.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };

  const onPasswordSubmit = async (values) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      resetPassword();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'pl-64' : 'pl-0'
        }`}
      >
        <section className="px-4 py-6 lg:py-12">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-6 lg:mb-8 flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-700 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
              <div>
                <h1 className="text-4xl font-bold text-slate-850 dark:text-white">Settings</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage your account settings</p>
              </div>
            </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card-lg">
          <div className="mb-6 flex gap-4 border-b border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-b-2 border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'password'
                  ? 'border-b-2 border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Password
            </button>
            {/* Appearance tab removed */}
          </div>

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  {...registerProfile('name')}
                  className="w-full rounded-xl border border-brand-100 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-850 dark:text-white"
                  placeholder="John Doe"
                />
                {profileErrors.name && (
                  <p className="mt-2 text-xs font-medium text-rose-600">{profileErrors.name.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  {...registerProfile('email')}
                  type="email"
                  className="w-full rounded-xl border border-brand-100 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-850 dark:text-white"
                  placeholder="you@example.com"
                />
                {profileErrors.email && (
                  <p className="mt-2 text-xs font-medium text-rose-600">{profileErrors.email.message}</p>
                )}
              </div>

              {updateProfileMutation.error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3">
                  <p className="text-sm font-medium text-rose-700">
                    {updateProfileMutation.error.response?.data?.message || 'Failed to update profile'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                <input
                  {...registerPassword('currentPassword')}
                  type="password"
                  className="w-full rounded-xl border border-brand-100 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-850 dark:text-white"
                  placeholder="••••••••"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-2 text-xs font-medium text-rose-600">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                <input
                  {...registerPassword('newPassword')}
                  type="password"
                  className="w-full rounded-xl border border-brand-100 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-850 dark:text-white"
                  placeholder="••••••••"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-2 text-xs font-medium text-rose-600">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <input
                  {...registerPassword('confirmPassword')}
                  type="password"
                  className="w-full rounded-xl border border-brand-100 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-850 dark:text-white"
                  placeholder="••••••••"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-2 text-xs font-medium text-rose-600">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              {changePasswordMutation.error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3">
                  <p className="text-sm font-medium text-rose-700">
                    {changePasswordMutation.error.response?.data?.message || 'Failed to change password'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
              >
                {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {/* Appearance tab and settings removed */}
        </div>
          </div>
        </section>
      </div>
    </div>
  );
}

