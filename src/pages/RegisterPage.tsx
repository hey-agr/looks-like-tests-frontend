import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ROLES = ['TEACHER', 'SUPERVISOR', 'STUDENT'] as const;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
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
      setSuccess('Вы успешно зарегистрировались! Теперь можете войти.');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Ошибка регистрации. Попробуйте снова.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'email@example.com' },
    { name: 'lastname', label: 'Фамилия', type: 'text', required: true, placeholder: '' },
    { name: 'firstname', label: 'Имя', type: 'text', required: true, placeholder: '' },
    { name: 'middlename', label: 'Отчество', type: 'text', required: false, placeholder: '' },
    { name: 'phone', label: 'Телефон', type: 'tel', required: false, placeholder: '+7 (999) 123-45-67' },
    { name: 'password', label: 'Пароль', type: 'password', required: true, placeholder: '••••••••' },
    { name: 'confirmPassword', label: 'Подтверждение пароля', type: 'password', required: true, placeholder: '••••••••' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Регистрация</h1>
          <p className="mt-2 text-sm text-gray-500">Создайте новую учётную запись</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
                {!field.required && <span className="text-gray-400 ml-1">(необязательно)</span>}
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
              Роль
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
                  {role === 'TEACHER' ? 'Учитель' : role === 'SUPERVISOR' ? 'Наблюдатель' : 'Студент'}
                </option>
              ))}
            </select>
          </div>

          {!success && (
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          )}

          {success && (
            <Link
              to="/login"
              className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white text-center hover:bg-blue-700"
            >
              Перейти ко входу
            </Link>
          )}
        </form>

        {!success && (
          <p className="text-center text-sm text-gray-500">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Войти
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
