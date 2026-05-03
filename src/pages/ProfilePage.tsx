import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nProvider';
import AppLayout from '@/components/AppLayout';
import { getRoleLabel } from '@/types/auth';
import { usersApi } from '@/api/users';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const primaryRole = user?.authorities?.[0] || '';

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    middleName: user?.middleName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await usersApi.updateCurrent({
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName || undefined,
        email: form.email,
        phone: form.phone || undefined,
      });
      setSuccess(t('profile.saved'));
    } catch {
      setError(t('profile.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-8 shadow">
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('profile.email')}</p>
                <p className="font-medium text-gray-900">{user?.username}</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                {getRoleLabel(primaryRole, t)}
              </span>
            </div>
          </div>

          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('profile.edit')}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">{success}</div>
            )}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('profile.lastName')}</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('profile.firstName')}</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('profile.middleName')}</label>
              <input
                name="middleName"
                value={form.middleName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('auth.email')}</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('profile.phone')} <span className="text-gray-400 ml-1">{t('common.optional')}</span>
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+7 (999) 123-45-67"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Link
                to="/"
                className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('common.back')}
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? t('profile.saving') : t('profile.save')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AppLayout>
  );
}
