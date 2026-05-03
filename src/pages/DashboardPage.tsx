import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900">Looks Like Tests</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {user?.lastname} {user?.firstname}
            </Link>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              {user?.role === 'ADMIN' ? 'Администратор' : user?.role === 'TEACHER' ? 'Учитель' : 'Студент'}
            </span>
            <button
              onClick={logout}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">
            Добро пожаловать, {user?.firstname}!
          </h2>
          <p className="mt-2 text-gray-600">
            Ваша роль: {user?.role === 'ADMIN' ? 'Администратор' : user?.role === 'TEACHER' ? 'Учитель' : 'Студент'}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/profile"
              className="block rounded-lg border border-gray-200 p-4 transition hover:border-blue-300 hover:shadow-sm"
            >
              <h3 className="font-medium text-gray-900">Профиль</h3>
              <p className="mt-1 text-sm text-gray-500">Редактировать профиль</p>
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin/users"
                className="block rounded-lg border border-gray-200 p-4 transition hover:border-purple-300 hover:shadow-sm"
              >
                <h3 className="font-medium text-gray-900">Админ-панель</h3>
                <p className="mt-1 text-sm text-gray-500">Управление пользователями</p>
              </Link>
            )}

            <div className="rounded-lg border border-gray-200 p-4 opacity-60">
              <h3 className="font-medium text-gray-900">Тесты</h3>
              <p className="mt-1 text-sm text-gray-500">Скоро</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 opacity-60">
              <h3 className="font-medium text-gray-900">Результаты</h3>
              <p className="mt-1 text-sm text-gray-500">Скоро</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 opacity-60">
              <h3 className="font-medium text-gray-900">Назначения</h3>
              <p className="mt-1 text-sm text-gray-500">Скоро</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
