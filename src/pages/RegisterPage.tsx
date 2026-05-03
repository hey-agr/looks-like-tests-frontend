import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useI18n, LanguageSwitcher } from '@/i18n/I18nProvider';

const ROLES = ['TEACHER', 'SUPERVISOR', 'STUDENT'] as const;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useI18n();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    middlename: '',
    phone: '',
    role: 'STUDENT' as string,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      await register({
        username: form.email,
        email: form.email,
        password: form.password,
        firstName: form.firstname,
        lastName: form.lastname,
        middleName: form.middlename || undefined,
        phone: form.phone || undefined,
        authorities: [form.role],
      });
      navigate('/login?registered=true');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (t('auth.registerError') !== 'auth.registerError' ? t('auth.registerError') : 'Registration error. Try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'email', label: t('auth.email'), type: 'email', required: true, placeholder: 'email@example.com' },
    { name: 'lastname', label: t('profile.lastName'), type: 'text', required: true, placeholder: '' },
    { name: 'firstname', label: t('profile.firstName'), type: 'text', required: true, placeholder: '' },
    { name: 'middlename', label: t('profile.middleName'), type: 'text', required: false, placeholder: '' },
    { name: 'phone', label: t('profile.phone'), type: 'tel', required: false, placeholder: '+7 (999) 123-45-67' },
    { name: 'password', label: t('auth.password'), type: 'password', required: true, placeholder: '••••••••' },
    { name: 'confirmPassword', label: t('auth.confirmPassword'), type: 'password', required: true, placeholder: '••••••••' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('app.title')}</h1>
          <p className="mt-2 text-sm text-gray-500">{t('auth.registerTitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
                {!field.required && <span className="text-gray-400 ml-1">{t('common.optional')}</span>}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              {t('auth.role')}
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role === 'TEACHER' ? t('auth.roleTeacher') : role === 'SUPERVISOR' ? t('auth.roleSupervisor') : t('auth.roleStudent')}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t('auth.registering') : t('auth.register')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            {t('auth.login')}
          </Link>
        </p>

        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
